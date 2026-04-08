import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { ExternalBlob, MedicalFileMetadata as BackendMetadata } from '../backend';
import { encryptData, decryptData } from '../utils/encryption';
import { auth, storage } from '../lib/firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { loadSession } from '../auth/session';

export interface MedicalFileMetadata {
  id: string;
  filename: string;
  size: number;
  uploadedAt: number;
  contentType?: string;
  source?: 'icp' | 'firebase' | 'local';
}

const MEDICAL_FILES_QUERY_KEY = 'medicalFiles';

// --- Local IndexedDB Vault Fallback ---
const DB_NAME = 'MedicalCareVaultDB';
const STORE_NAME = 'medical_files';

async function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveToLocalVault(metadata: MedicalFileMetadata, bytes: Uint8Array, userPrincipal: string) {
  const db = await getDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ ...metadata, userPrincipal, bytes });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getLocalVaultFiles(userPrincipal: string): Promise<MedicalFileMetadata[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const userFiles = request.result
        .filter((r: any) => r.userPrincipal === userPrincipal)
        .map((r: any) => {
          const { bytes, userPrincipal: _, ...meta } = r;
          return { ...meta, source: 'local' };
        });
      resolve(userFiles);
    };
    request.onerror = () => reject(request.error);
  });
}

async function getLocalVaultFileContent(id: string): Promise<Uint8Array | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => {
      resolve(request.result ? request.result.bytes : null);
    };
    request.onerror = () => reject(request.error);
  });
}

async function deleteFromLocalVault(id: string) {
  const db = await getDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export function useMedicalFiles() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  // Determine a stable ID for E2EE key derivation
  const getStableId = () => {
    if (identity && !identity.getPrincipal().isAnonymous()) {
      return identity.getPrincipal().toText();
    }
    if (auth.currentUser) {
      return auth.currentUser.uid;
    }
    const session = loadSession();
    return session?.phone || session?.type || 'guest-device-vault-stable-id';
  };

  const userPrincipal = getStableId();

  // Query to list all medical files using backend metadata + IndexedDB
  const filesQuery = useQuery<MedicalFileMetadata[]>({
    queryKey: [MEDICAL_FILES_QUERY_KEY, userPrincipal],
    queryFn: async () => {
      let icpFiles: MedicalFileMetadata[] = [];
      const localFiles = await getLocalVaultFiles(userPrincipal || 'guest');

      // Attempt ICP
      if (actor && identity && !identity.getPrincipal().isAnonymous()) {
        try {
          const backendMetadata = await actor.listMedicalFilesMetadata();
          icpFiles = backendMetadata.map((meta: BackendMetadata) => ({
            id: meta.id,
            filename: meta.filename,
            size: Number(meta.size),
            uploadedAt: Number(meta.uploadedAt) / 1_000_000,
            contentType: meta.contentType || undefined,
            source: 'icp' as const,
          }));
        } catch (error) {
          console.error('Failed to list medical files from ICP:', error);
        }
      }

      // Merge local fallback and ICP files safely
      const allFiles = [...icpFiles];
      const icpIds = new Set(icpFiles.map(f => f.id));
      for (const lf of localFiles) {
        if (!icpIds.has(lf.id)) {
          allFiles.push(lf);
        }
      }

      allFiles.sort((a, b) => b.uploadedAt - a.uploadedAt);
      return allFiles;
    },
    enabled: true,
  });

  // Mutation to upload a file (Dual-Storage E2EE + Local Fallback)
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const uId = userPrincipal || 'guest';
      const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // --- E2EE Encryption ---
      const encryptedBytes = await encryptData(bytes, uId);
      const meta: MedicalFileMetadata = {
        id: fileId,
        filename: file.name,
        size: encryptedBytes.length,
        uploadedAt: Date.now(),
        contentType: file.type || undefined,
        source: 'local'
      };

      // 1. Save to Local IndexedDB instantly
      await saveToLocalVault(meta, encryptedBytes, uId);

      // 2. Fire-And-Forget Background Remote Uploads
      // Execute the heavy network calls in the background without blocking the UI!
      Promise.all([
        (async () => {
          try {
            const firebaseRef = ref(storage, `medical_records/${uId}/${fileId}_${file.name}`);
            await uploadBytes(firebaseRef, encryptedBytes);
            console.log('[E2EE Vault] Securely uploaded to Firebase');
            return true;
          } catch (err) {
            console.warn('Firebase upload failed in background', err);
            return false;
          }
        })(),
        (async () => {
          if (actor && identity && !identity.getPrincipal().isAnonymous()) {
            try {
              const blob = ExternalBlob.fromBytes(new Uint8Array(encryptedBytes));
              await actor.uploadMedicalFile(
                fileId,
                blob,
                file.name,
                BigInt(encryptedBytes.length),
                file.type || null
              );
              console.log('[E2EE Vault] Securely uploaded to ICP Canister');
              return true;
            } catch (err) {
              console.error('ICP upload failed in background', err);
              return false;
            }
          }
          return false;
        })()
      ]).then(([fbSuccess, icpSuccess]) => {
         // Optionally update the local vault's source tracking and trigger a background UI refresh
         if (fbSuccess || icpSuccess) {
           const updatedMeta = { ...meta, source: icpSuccess ? 'icp' : 'firebase' } as MedicalFileMetadata;
           saveToLocalVault(updatedMeta, encryptedBytes, uId)
            .then(() => queryClient.invalidateQueries({ queryKey: [MEDICAL_FILES_QUERY_KEY] }))
            .catch(console.error);
         }
      });

      // 3. Instantly return so the user doesn't wait for network uploads!
      return meta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDICAL_FILES_QUERY_KEY] });
    },
  });

  // Mutation to delete a file
  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      if (actor && identity && !identity.getPrincipal().isAnonymous()) {
        await actor.deleteMedicalFile(fileId).catch((e: unknown) => console.error('ICP Delete failed', e));
      }
      
      // Delete from local cache
      await deleteFromLocalVault(fileId);
      return fileId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDICAL_FILES_QUERY_KEY] });
    },
  });

  const downloadFile = async (fileId: string, filename: string, onlyReturnBytes = false): Promise<Uint8Array | void> => {
    const uId = userPrincipal || 'guest';
    let encryptedBytes: Uint8Array | null = null;
    
    // Opt for fast local load first
    encryptedBytes = await getLocalVaultFileContent(fileId);

    if (!encryptedBytes && actor && identity && !identity.getPrincipal().isAnonymous()) {
      try {
        const blob = await actor.getMedicalFile(fileId);
        if (blob) {
          encryptedBytes = await blob.getBytes();
        }
      } catch (e) {
        console.warn('Failed to download from ICP vault', e);
      }
    }

    if (!encryptedBytes) {
      throw new Error('File not found in vault or local fallback cache.');
    }

    try {
      const decryptedBytes = await decryptData(encryptedBytes, uId);

      if (onlyReturnBytes) return decryptedBytes;

      const fileBlob = new Blob([decryptedBytes as any]);
      const url = URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Vault extraction error:', error);
      throw new Error('Decryption failed. The file is corrupted or keys mismatch.');
    }
  };

  return {
    files: filesQuery.data || [],
    isLoading: uploadMutation.isPending || deleteMutation.isPending,
    isFetching: filesQuery.isFetching,
    uploadFile: uploadMutation.mutateAsync,
    deleteFile: deleteMutation.mutateAsync,
    downloadFile,
  };
}
