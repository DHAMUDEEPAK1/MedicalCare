import type { MedicalFileMetadata } from '../hooks/useMedicalFiles';

const STORAGE_KEY = 'medical_file_metadata';

interface MetadataStore {
  [fileId: string]: MedicalFileMetadata;
}

function loadStore(): MetadataStore {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load metadata store:', error);
    return {};
  }
}

function saveStore(store: MetadataStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error('Failed to save metadata store:', error);
  }
}

export function loadFileMetadata(fileId: string): MedicalFileMetadata | null {
  const store = loadStore();
  return store[fileId] || null;
}

export function saveFileMetadata(metadata: MedicalFileMetadata): void {
  const store = loadStore();
  store[metadata.id] = metadata;
  saveStore(store);
}

export function deleteFileMetadata(fileId: string): void {
  const store = loadStore();
  delete store[fileId];
  saveStore(store);
}

export function clearAllMetadata(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear metadata store:', error);
  }
}

// Note: This module is now deprecated for listing purposes.
// The backend metadata API is the source of truth for file listings.
// Local metadata is kept for backward compatibility only.
