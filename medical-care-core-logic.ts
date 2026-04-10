// ============================================================
// MEDICAL CARE - CORE LOGIC (NO UI/Design)
// ============================================================

// ============================================================
// 1. AUTHENTICATION & SESSION
// ============================================================

// auth/session.ts - Session management
type SessionType = 'otp' | 'password' | 'guest';

function saveSession(type: SessionType, phone?: string, fullName?: string) {
  const session = { type, phone, fullName, timestamp: Date.now() };
  localStorage.setItem('medicalcare_session', JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem('medicalcare_session');
}

function hasValidSession(): boolean {
  const session = localStorage.getItem('medicalcare_session');
  if (!session) return false;
  const parsed = JSON.parse(session);
  return !!parsed.type;
}

function loadSession() {
  const session = localStorage.getItem('medicalcare_session');
  return session ? JSON.parse(session) : null;
}

// useAuthSession.ts
export function useAuthSession() {
  const signInAsOtp = (phone: string) => saveSession('otp', phone);
  const signInAsPassword = (phone: string, fullName: string) => saveSession('password', phone, fullName);
  const continueAsGuest = () => saveSession('guest');
  const clearLocalSession = () => clearSession();
  const hasSession = () => hasValidSession();
  return { signInAsOtp, signInAsPassword, continueAsGuest, clearLocalSession, hasSession };
}

// useInternetIdentity.ts - Internet Identity Login
import { AuthClient, type AuthClientLoginOptions } from '@dfinity/auth-client';
import type { Identity } from '@icp-sdk/core/agent';

const ONE_HOUR_IN_NANOSECONDS = BigInt(3_600_000_000_000);
const DEFAULT_IDENTITY_PROVIDER = process.env.II_URL;

async function createAuthClient(): Promise<AuthClient> {
  const authClient = await AuthClient.create({
    idleOptions: { disableDefaultIdleCallback: true, disableIdle: true },
    loginOptions: { derivationOrigin: config.ii_derivation_origin }
  });
  return authClient;
}

export async function loginWithII(authClient: AuthClient, onSuccess: () => void, onError: (e: Error) => void) {
  const options: AuthClientLoginOptions = {
    identityProvider: DEFAULT_IDENTITY_PROVIDER,
    onSuccess,
    onError,
    maxTimeToLive: ONE_HOUR_IN_NANOSECONDS * BigInt(24 * 30) // 30 days
  };
  authClient.login(options);
}

// useRequireAuth.ts - Route Guard
import { onAuthStateChanged } from 'firebase/auth';

export function useRequireAuth() {
  // Check Firebase Auth, Internet Identity, or local session
  const hasFirebaseAuth = !!firebaseUser;
  const hasInternetIdentity = !!identity && !identity.getPrincipal().isAnonymous();
  const hasLocalSession = hasValidSession();

  if (!hasInternetIdentity && !hasLocalSession && !hasFirebaseAuth) {
    navigate({ to: '/signin' });
  }
}


// ============================================================
// 2. ENCRYPTION (E2EE)
// ============================================================

// encryption.ts - AES-GCM 256-bit with PBKDF2 key derivation
const ALGORITHM = 'AES-GCM';
const IV_LENGTH = 12;
const keyCache = new Map<string, CryptoKey>();

async function deriveKey(userPrincipal: string): Promise<CryptoKey> {
  if (keyCache.has(userPrincipal)) return keyCache.get(userPrincipal)!;

  const encoder = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    'raw', encoder.encode(userPrincipal), 'PBKDF2', false, ['deriveKey']
  );

  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('MedicalCare-E2EE-Salt-2026'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: ALGORITHM, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  keyCache.set(userPrincipal, derivedKey);
  return derivedKey;
}

export async function encryptData(data: Uint8Array, userPrincipal: string): Promise<Uint8Array> {
  const key = await deriveKey(userPrincipal);
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encrypted = await window.crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, data.buffer);
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return combined;
}

export async function decryptData(encryptedData: Uint8Array, userPrincipal: string): Promise<Uint8Array> {
  const key = await deriveKey(userPrincipal);
  const iv = encryptedData.slice(0, IV_LENGTH);
  const data = encryptedData.slice(IV_LENGTH);
  const decrypted = await window.crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, data.buffer);
  return new Uint8Array(decrypted);
}


// ============================================================
// 3. MEDICAL FILE STORAGE (IndexedDB + Cloud)
// ============================================================

// useMedicalFiles.ts - Local IndexedDB Vault + Cloud Backup
const DB_NAME = 'MedicalCareVaultDB';
const STORE_NAME = 'medical_files';

interface MedicalFileMetadata {
  id: string;
  filename: string;
  size: number;
  uploadedAt: number;
  contentType?: string;
  source?: 'icp' | 'firebase' | 'local';
}

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
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put({ ...metadata, userPrincipal, bytes });
}

async function getLocalVaultFiles(userPrincipal: string): Promise<MedicalFileMetadata[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => {
      const userFiles = request.result
        .filter((r: any) => r.userPrincipal === userPrincipal)
        .map((r: any) => { const { bytes, userPrincipal: _, ...meta } = r; return { ...meta, source: 'local' }; });
      resolve(userFiles);
    };
  });
}

async function getLocalVaultFileContent(id: string): Promise<Uint8Array | null> {
  const db = await getDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result?.bytes || null);
  });
}

async function deleteFromLocalVault(id: string) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).delete(id);
}

// Upload: E2EE + Fire-and-forget to Firebase + ICP
export async function uploadMedicalFile(file: File, userPrincipal: string) {
  const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // E2EE Encryption
  const encryptedBytes = await encryptData(bytes, userPrincipal);
  const meta: MedicalFileMetadata = {
    id: fileId,
    filename: file.name,
    size: encryptedBytes.length,
    uploadedAt: Date.now(),
    contentType: file.type,
    source: 'local'
  };

  // 1. Save to Local IndexedDB instantly
  await saveToLocalVault(meta, encryptedBytes, userPrincipal);

  // 2. Fire-and-forget background uploads
  Promise.all([
    // Firebase upload
    (async () => {
      const firebaseRef = ref(storage, `medical_records/${userPrincipal}/${fileId}_${file.name}`);
      await uploadBytes(firebaseRef, encryptedBytes);
      return 'firebase';
    })(),
    // ICP upload
    (async () => {
      const blob = ExternalBlob.fromBytes(new Uint8Array(encryptedBytes));
      await actor.uploadMedicalFile(fileId, blob, file.name, BigInt(encryptedBytes.length), file.type || null);
      return 'icp';
    })()
  ]);

  return meta;
}

// Download: decrypt + return bytes or trigger download
export async function downloadMedicalFile(fileId: string, filename: string, userPrincipal: string): Promise<Uint8Array | void> {
  let encryptedBytes: Uint8Array | null = await getLocalVaultFileContent(fileId);

  if (!encryptedBytes && actor) {
    const blob = await actor.getMedicalFile(fileId);
    if (blob) encryptedBytes = await blob.getBytes();
  }

  if (!encryptedBytes) throw new Error('File not found');

  const decryptedBytes = await decryptData(encryptedBytes, userPrincipal);

  // Download if filename provided
  if (filename) {
    const fileBlob = new Blob([decryptedBytes]);
    const url = URL.createObjectURL(fileBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return decryptedBytes;
}


// ============================================================
// 4. MEDICAL DOCUMENT VALIDATOR
// ============================================================

// medicalDocValidator.ts - Local AI document validation
interface ValidationResult {
  is_medical: boolean;
  confidence_score: number;
  document_type: string;
  reason: string;
}

// Keyword categories
const medicalKeywords: Record<string, string[]> = {
  'Lab/Report': ['report', 'lab', 'blood', 'test', 'result', 'lipid', 'cbc', 'hemoglobin', 'glucose', 'cholesterol', 'triglyceride', 'creatinine', 'bilirubin', 'thyroid', 'tsh', 'urine', 'diagnostic', 'pathology', 'biopsy', 'electrolyte', 'hematology'],
  'Prescription': ['prescription', 'rx', 'medication', 'dosage', 'tablet', 'capsule', 'syrup', 'mg', 'pharmacy', 'doctor', 'physician', 'dose', 'medicine', 'refill', 'bid', 'tid', 'qid'],
  'Imaging': ['xray', 'mri', 'ct scan', 'ultrasound', 'radiology', 'sonography', 'imaging', 'ecg', 'ekg', 'electrocardiogram'],
  'Clinical': ['discharge', 'summary', 'certificate', 'hospital', 'patient', 'clinical', 'consultation', 'diagnosis', 'prognosis', 'treatment', 'vital', 'symptoms', 'referral', 'admission', 'emergency']
};

const medicalAcronyms = ['ALT', 'AST', 'ALP', 'CRP', 'ESR', 'WBC', 'RBC', 'PLT', 'HCT', 'MCV', 'BUN', 'TSH', 'PSA', 'LDH', 'GGT', 'GFR', 'HDL', 'LDL', 'INR', 'PT', 'PTT'];

const diagnosticPatterns = [
  /(\d+\.?\d*)\s*(mg|ml|mcg|gm|unit|units|iu|mmol|mg\/dl|g\/dl|%|l|cells|µl|mm|hr)/i,
  /patient\s*name/i, /date\s*of\s*birth/i, /dob:/i, /physician:/i, /clinic:/i, /hospital:/i,
  /md|mbbs|do|pharmd|rn|pa-c/i,
  /collected:|reported:|received:|specimen:/i,
  /high|low|normal|abnormal|critical|negative|positive/i
];

export async function validateMedicalDocument(file: File): Promise<ValidationResult> {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  const isPdf = fileType === 'application/pdf' || fileName.endsWith('.pdf');

  // Extract text from PDF
  let extractedText = "";
  if (isPdf) extractedText = await extractTextFromPDF(file);

  // Score calculation
  let matchCount = 0;
  let detectedType = "Unknown";
  let matchedKeywords: string[] = [];

  // Filename analysis
  for (const [type, keywords] of Object.entries(medicalKeywords)) {
    for (const kw of keywords) {
      if (fileName.includes(kw)) {
        matchCount += 2.5;
        detectedType = type;
        if (!matchedKeywords.includes(kw)) matchedKeywords.push(kw);
      }
    }
  }

  // Content analysis
  if (extractedText) {
    const lowerText = extractedText.toLowerCase();
    for (const [type, keywords] of Object.entries(medicalKeywords)) {
      for (const kw of keywords) {
        if (lowerText.includes(kw)) {
          matchCount += 1;
          if (detectedType === "Unknown") detectedType = type;
          if (!matchedKeywords.includes(kw)) matchedKeywords.push(kw);
        }
      }
    }

    // Acronym matching
    medicalAcronyms.forEach(acr => {
      const regex = new RegExp(`\\b${acr}\\b`, 'gi');
      const matches = extractedText.match(regex);
      if (matches) matchCount += (matches.length * 1.5);
    });

    // Pattern matching
    diagnosticPatterns.forEach(regex => {
      if (lowerText.match(regex)) matchCount += 1.5;
    });

    // Density bonus
    if (matchedKeywords.length > 4) matchCount += 3;
    if (matchedKeywords.length > 8) matchCount += 5;
  }

  const confidenceScore = Math.min(0.99, (matchCount * 0.05) + (extractedText ? 0.4 : 0.1));
  const isMedical = extractedText ? matchCount >= 3 : matchCount >= 4;

  // Anti-adversarial
  const nonMedicalMarkers = ['meme', 'wallpaper', 'movie', 'game', 'music', 'logo', 'background'];
  if (nonMedicalMarkers.some(p => fileName.includes(p))) {
    return { is_medical: false, confidence_score: 0.95, document_type: "Non-Medical", reason: "Non-medical content detected" };
  }

  return isMedical
    ? { is_medical: true, confidence_score: confidenceScore, document_type: detectedType === "Unknown" ? "Medical Record" : detectedType, reason: `Confirmed via ${matchedKeywords.slice(0, 4).join(', ')}` }
    : { is_medical: false, confidence_score: 0.4, document_type: "Unknown", reason: "No sufficient medical evidence found" };
}


// ============================================================
// 5. STORAGE GATEWAY (ICP Storage)
// ============================================================

// StorageClient.ts - Chunk upload with Merkle tree
const HASH_ALGORITHM = 'SHA-256';
const MAXIMUM_CONCURRENT_UPLOADS = 10;
const MAX_RETRIES = 3;

class YHash {
  constructor(public bytes: Uint8Array) {}
  
  static async fromChunk(data: Uint8Array): Promise<YHash> {
    const domain = new TextEncoder().encode('icfs-chunk/');
    const combined = new Uint8Array(domain.length + data.length);
    combined.set(domain);
    combined.set(data, domain.length);
    const hashBuffer = await crypto.subtle.digest(HASH_ALGORITHM, combined);
    return new YHash(new Uint8Array(hashBuffer));
  }

  toShaString(): string {
    return `sha256:${Array.from(this.bytes).map(b => b.toString(16).padStart(2, '0')).join('')}`;
  }
}

class BlobHashTree {
  constructor(public chunkHashes: YHash[], public tree: any, public headers: string[]) {}

  static async build(chunkHashes: YHash[], headers: Record<string, string> = {}): Promise<BlobHashTree> {
    if (chunkHashes.length === 0) {
      const emptyHash = new YHash(new Uint8Array(32));
      return new BlobHashTree([emptyHash], { hash: emptyHash, left: null, right: null }, []);
    }

    // Build tree bottom-up
    let level = chunkHashes.map(hash => ({ hash, left: null, right: null }));
    while (level.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < level.length; i += 2) {
        const left = level[i];
        const right = level[i + 1] || null;
        const parentHash = await YHash.fromChunk(new Uint8Array([...left.hash.bytes, ...(right?.hash.bytes || [])]));
        nextLevel.push({ hash: parentHash, left, right });
      }
      level = nextLevel;
    }

    return new BlobHashTree(chunkHashes, level[0], Object.entries(headers).map(([k, v]) => `${k}: ${v}`));
  }
}

// Retry with exponential backoff
async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === MAX_RETRIES) throw error;
      const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 30000);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Unknown error');
}

// Storage upload
export class StorageClient {
  constructor(
    private bucket: string,
    private storageGatewayUrl: string,
    private backendCanisterId: string,
    private projectId: string,
    private agent: HttpAgent
  ) {}

  async putFile(blobBytes: Uint8Array, onProgress?: (p: number) => void): Promise<{ hash: string }> {
    const chunks = this.createFileChunks(new Blob([blobBytes]));
    const chunkHashes: YHash[] = [];
    
    for (const chunk of chunks) {
      const chunkData = new Uint8Array(await chunk.arrayBuffer());
      chunkHashes.push(await YHash.fromChunk(chunkData));
    }

    const blobHashTree = await BlobHashTree.build(chunkHashes, { 'Content-Type': 'application/octet-stream' });
    const blobRootHash = blobHashTree.tree.hash;
    const hashString = blobRootHash.toShaString();

    // Upload blob tree
    const certificateBytes = await this.getCertificate(hashString);
    await this.uploadBlobTree(blobHashTree, blobBytes.length, certificateBytes);

    // Upload chunks in parallel
    let completed = 0;
    await Promise.all(Array.from({ length: MAXIMUM_CONCURRENT_UPLOADS }, async (_, workerId) => {
      for (let i = workerId; i < chunks.length; i += MAXIMUM_CONCURRENT_UPLOADS) {
        const chunkData = new Uint8Array(await chunks[i].arrayBuffer());
        await this.uploadChunk(blobRootHash, chunkHashes[i], i, chunkData);
        completed++;
        onProgress?.(Math.round((completed / chunks.length) * 100));
      }
    }));

    return { hash: hashString };
  }

  private createFileChunks(file: Blob, chunkSize = 1024 * 1024): Blob[] {
    const chunks: Blob[] = [];
    for (let i = 0; i < Math.ceil(file.size / chunkSize); i++) {
      chunks.push(file.slice(i * chunkSize, Math.min((i + 1) * chunkSize, file.size)));
    }
    return chunks;
  }

  private async uploadChunk(blobHash: YHash, chunkHash: YHash, index: number, data: Uint8Array) {
    await withRetry(async () => {
      const url = `${this.storageGatewayUrl}/v1/chunk/?owner_id=${this.backendCanisterId}&blob_hash=${blobHash.toShaString()}&chunk_hash=${chunkHash.toShaString()}&chunk_index=${index}&bucket_name=${this.bucket}&project_id=${this.projectId}`;
      await fetch(url, { method: 'PUT', body: data });
    });
  }

  private async uploadBlobTree(tree: BlobHashTree, size: number, cert: Uint8Array) {
    await withRetry(async () => {
      const url = `${this.storageGatewayUrl}/v1/blob-tree/`;
      await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blob_tree: tree.toJSON(),
          bucket_name: this.bucket,
          num_blob_bytes: size,
          owner: this.backendCanisterId,
          project_id: this.projectId,
          auth: { OwnerEgressSignature: Array.from(cert) }
        })
      });
    });
  }

  private async getCertificate(hash: string): Promise<Uint8Array> {
    const args = IDL.encode([IDL.Text], [hash]);
    const result = await this.agent.call(this.backendCanisterId, { methodName: '_medicalcareStorageCreateCertificate', arg: args });
    return result.response.body.certificate;
  }

  getDirectURL(hash: string): string {
    return `${this.storageGatewayUrl}/v1/blob/?blob_hash=${hash}&owner_id=${this.backendCanisterId}&project_id=${this.projectId}`;
  }
}


// ============================================================
// 6. AI ASSISTANT (GOKU)
// ============================================================

// assistantBrain.ts - Main AI processing
class PersonalTalkHandler {
  process(text: string): { action: string, message: string } {
    const lower = text.toLowerCase();
    if (/^(hi|hello|hey)/i.test(lower)) return { action: "TALK", message: "Hello! I'm Goku, your clinical health strategist." };
    if (/(who are you|your name)/i.test(lower)) return { action: "TALK", message: "I'm Goku, your Clinical Health Strategist AI." };
    if (/(help|what can you do)/i.test(lower)) return { action: "TALK", message: "I can: analyze reports, parse prescriptions, answer medical questions, navigate the app." };
    return { action: "NONE", message: "" };
  }
}

export class GokuAssistant {
  labAnalyzer = new LabReportAnalyzer();
  prescriptionScheduler = new PrescriptionScheduler();
  knowledgeEngine = new MedicalKnowledgeEngine();
  navigator = new AppNavigator();
  talkHandler = new PersonalTalkHandler();
  lastFileContent: string | null = null;

  processInput(userInput: string): CommandResult {
    const lower = userInput.toLowerCase();

    // Emergency check
    const emergency = checkEmergency(userInput);
    if (emergency.isEmergency) return { type: 'medical', message: emergency.message };

    // Talk handler
    const talk = this.talkHandler.process(userInput);
    if (talk.action === "TALK") return { type: 'help', message: talk.message };

    // Medication tracking
    if (userInput.includes("took") || userInput.includes("medication")) {
      const meds = getCurrentMedications();
      return { type: 'medical', message: meds.map(m => `- ${m.name} [${m.taken ? '✅' : '🕒'}]`).join('\n') };
    }

    // Navigation
    const nav = this.navigator.processCommand(userInput);
    if (nav.action === "NAVIGATE") return { type: 'navigation', message: nav.message, navigationTarget: nav.route };

    // Medical content
    const response = this._processMedicalContent(userInput);
    return { type: 'medical', message: response.message || response };
  }

  analyzeFile(fileName: string, fileContent: string): CommandResult {
    this.lastFileContent = fileContent;
    const lower = fileContent.toLowerCase();

    // Prescription parsing
    if (['prescription', 'tablet', 'rx', 'medicine'].some(k => lower.includes(k))) {
      const schedule = this.prescriptionScheduler.parsePrescription(fileContent, fileName);
      if (schedule.medication !== "Not specified") {
        return { type: 'medical', message: schedule.message };
      }
    }

    // Lab report analysis
    if (['hb', 'glucose', 'cholesterol', 'report', 'lab', 'blood', 'test'].some(k => lower.includes(k))) {
      const analysis = this.labAnalyzer.analyzeReport(fileContent);
      return { type: 'medical', message: analysis.message };
    }

    return { type: 'medical', message: "File processed. For detailed analysis, please ask about specific aspects." };
  }

  private _processMedicalContent(text: string): any {
    const info = this.knowledgeEngine.queryUnified(text.toLowerCase());
    if (info) return { message: info };
    return { message: "I can help with report analysis, medications, or medical questions. What would you like?" };
  }
}

const gokuInstance = new GokuAssistant();
export function interpretCommand(userInput: string): CommandResult { return gokuInstance.processInput(userInput); }
export function analyzeFile(fileName: string, fileContent: string): CommandResult { return gokuInstance.analyzeFile(fileName, fileContent); }


// labAnalyzer.ts - Lab report analysis
export class LabReportAnalyzer {
  NORMAL_RANGES: Record<string, { min: number, max: number, unit: string }> = {
    hemoglobin: { min: 12, max: 17.5, unit: "g/dL" },
    wbc: { min: 4500, max: 11000, unit: "/µL" },
    platelets: { min: 150000, max: 450000, unit: "/µL" },
    hematocrit: { min: 35, max: 49, unit: "%" },
    glucose: { min: 70, max: 115, unit: "mg/dL" },
    hba1c: { min: 4.0, max: 7.5, unit: "%" },
    bun: { min: 7, max: 18, unit: "mg/dL" },
    creatinine: { min: 0.6, max: 1.2, unit: "mg/dL" },
    sodium: { min: 135, max: 145, unit: "mEq/L" },
    potassium: { min: 3.5, max: 5.1, unit: "mEq/L" },
    total_cholesterol: { min: 0, max: 200, unit: "mg/dL" },
    ldl_cholesterol: { min: 0, max: 130, unit: "mg/dL" },
    hdl_cholesterol: { min: 30, max: 150, unit: "mg/dL" },
    triglycerides: { min: 35, max: 160, unit: "mg/dL" },
    alt_liver: { min: 7, max: 40, unit: "U/L" },
    ast_liver: { min: 7, max: 40, unit: "U/L" },
    tsh: { min: 0.5, max: 10.0, unit: "µU/mL" }
  };

  analyzeReport(reportText: string): any {
    const metrics = this._extractMetrics(reportText);
    const findings: any[] = [];
    const abnormalities: any[] = [];

    for (const [metric, value] of Object.entries(metrics)) {
      if (metric in this.NORMAL_RANGES) {
        const range = this.NORMAL_RANGES[metric];
        const isAbnormal = value < range.min || value > range.max;
        findings.push({ metric, value, range: `${range.min}-${range.max} ${range.unit}`, status: isAbnormal ? "ABNORMAL" : "NORMAL" });
        if (isAbnormal) abnormalities.push({ metric, value });
      }
    }

    const conditionStack = abnormalities.length > 0 
      ? abnormalities.map(a => `${a.metric}: ${a.value}`).join(", ") 
      : "Optimal Clinical Profile";

    let msg = `### Clinical Consultation\n\n`;
    msg += `**Status:** ${abnormalities.length > 0 ? "⚠️ ABNORMAL" : "✅ NORMAL"}\n\n`;
    findings.forEach(f => msg += `- **${f.metric}:** ${f.value} (${f.range}) ${f.status === "ABNORMAL" ? "⚠️" : "✅"}\n`);
    if (abnormalities.length > 0) msg += `\n**Abnormal values:** ${conditionStack}`;

    return { findings, abnormalities, condition: conditionStack, message: msg };
  }

  private _extractMetrics(text: string): Record<string, number> {
    const metrics: Record<string, number> = {};
    const patterns: Record<string, RegExp> = {
      hemoglobin: /(?:hemoglobin|hb|hgb)[:\s]*([\d.]+)/i,
      wbc: /(?:wbc|white blood cells)[:\s]*([\d.]+)/i,
      platelets: /platelets[:\s]*([\d.]+)/i,
      glucose: /(?:glucose|fasting)[:\s]*([\d.]+)/i,
      hba1c: /hba1c[:\s]*([\d.]+)/i,
      cholesterol: /(?:total cholesterol)[:\s]*([\d.]+)/i,
      ldl: /ldl[:\s]*([\d.]+)/i,
      hdl: /hdl[:\s]*([\d.]+)/i,
      tsh: /tsh[:\s]*([\d.]+)/i
    };

    for (const [metric, pattern] of Object.entries(patterns)) {
      const match = pattern.exec(text);
      if (match && match[1]) {
        const val = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(val)) metrics[metric] = val;
      }
    }
    return metrics;
  }
}


// triageEngine.ts - Emergency detection
export const EmergencyTriage = {
  checkEmergency(text: string): { isEmergency: boolean, message: string } {
    const lower = text.toLowerCase();
    const emergencyKeywords = ['chest pain', 'difficulty breathing', 'severe bleeding', 'suicide', 'overdose', 'heart attack', 'stroke'];
    for (const kw of emergencyKeywords) {
      if (lower.includes(kw)) {
        return { isEmergency: true, message: `⚠️ EMERGENCY: ${kw} detected. Please call emergency services immediately.` };
      }
    }
    return { isEmergency: false, message: "" };
  }
};


// prescriptionScheduler.ts
export class PrescriptionScheduler {
  parsePrescription(text: string, filename: string): any {
    const medPatterns = [
      /([a-zA-Z]+)\s*(\d+(?:\.\d+)?)\s*(mg|ml|mcg|g)/i,
      /([a-zA-Z]+)\s*\((\d+)\s*(?:mg|ml)\s*x\s*(\d+)\)/i
    ];

    for (const pattern of medPatterns) {
      const match = text.match(pattern);
      if (match) {
        return {
          medication: match[1],
          dosage: match[2],
          unit: match[3] || 'mg',
          frequency: match[4] || 'daily',
          message: `**Prescription detected:** ${match[1]} ${match[2]}${match[3] || 'mg'} - ${match[4] || 'once daily'}`
        };
      }
    }
    return { medication: "Not specified", message: "Could not parse prescription details." };
  }

  getCurrentMedications(): any[] {
    const stored = localStorage.getItem('userMedications');
    return stored ? JSON.parse(stored) : [];
  }
}


// ============================================================
// 7. DATA SYNC (ICP <-> Firebase)
// ============================================================

// syncData.ts
export async function syncUserProfile(profile: UserProfile) {
  // 1. Save to ICP
  const actor = await createActorWithConfig();
  await actor.saveCallerUserProfile(profile);

  // 2. Save to Firebase
  await setDoc(doc(db, 'user_profiles', profile.id), {
    ...profile,
    dateOfBirth: profile.dateOfBirth ? Number(profile.dateOfBirth) : null,
    source: 'icp_sync'
  });
}

export async function syncReportMetadata(reportData: { id: string, filename: string, size: number, uploadedAt: number }) {
  await setDoc(doc(db, 'medical_reports', reportData.id), {
    ...reportData,
    syncedAt: serverTimestamp()
  });
}


// ============================================================
// 8. BACKEND INTEGRATION
// ============================================================

// useActor.ts - ICP canister calls
export async function createActorWithConfig() {
  return createActor(config.canisterIds.backend, { agent });
}

// Available backend methods:
// actor.listMedicalFilesMetadata() -> MedicalFileMetadata[]
// actor.uploadMedicalFile(id: string, blob: ExternalBlob, filename: string, size: bigint, contentType: ?text)
// actor.getMedicalFile(id: string) -> ?ExternalBlob
// actor.deleteMedicalFile(id: string)
// actor.saveCallerUserProfile(profile: UserProfile)
// actor._medicalcareStorageCreateCertificate(hash: string) -> certificate


// ============================================================
// SUMMARY: CORE FEATURES
// ============================================================
/*
| Feature                    | File                     |
|----------------------------|--------------------------|
| Multi-auth (OTP/Pass/II)   | useAuthSession.ts        |
| Internet Identity          | useInternetIdentity.ts   |
| Route Guard                | useRequireAuth.ts        |
| E2EE Encryption            | encryption.ts            |
| IndexedDB Vault            | useMedicalFiles.ts       |
| Document Validation        | medicalDocValidator.ts  |
| Storage Gateway            | StorageClient.ts         |
| AI Assistant               | assistantBrain.ts        |
| Lab Analysis               | labAnalyzer.ts           |
| Emergency Triage           | triageEngine.ts          |
| Prescription Parser        | prescriptionScheduler.ts|
| Data Sync                  | syncData.ts              |
| Backend Integration        | useActor.ts              |
*/