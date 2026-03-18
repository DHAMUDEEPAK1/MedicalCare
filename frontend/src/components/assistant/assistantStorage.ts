const STORAGE_KEY = 'healthcare-assistant-transcript-v1';

export interface StoredTranscript {
  version: number;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    timestamp: number;
  }>;
}

export function loadTranscript(): StoredTranscript | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed.version === 1) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveTranscript(messages: Array<{ id: string; role: string; content: string; timestamp: number }>) {
  try {
    const data: StoredTranscript = {
      version: 1,
      messages,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Silently fail if storage is unavailable
  }
}

export function clearTranscript() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail if storage is unavailable
  }
}
