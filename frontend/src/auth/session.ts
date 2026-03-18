/**
 * Local session utility for managing non-Internet-Identity authentication states
 * (demo phone+OTP flow, password-based sign-in, and "Continue as Guest").
 */

const SESSION_KEY = 'healthcare_local_session';

export type SessionType = 'otp' | 'password' | 'guest' | null;

export interface LocalSession {
  type: SessionType;
  phone?: string;
  fullName?: string;
  timestamp: number;
}

/**
 * Save a local session to localStorage
 */
export function saveSession(type: SessionType, phone?: string, fullName?: string): void {
  if (!type) {
    clearSession();
    return;
  }

  const session: LocalSession = {
    type,
    phone,
    fullName,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

/**
 * Load the current local session from localStorage
 */
export function loadSession(): LocalSession | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const session: LocalSession = JSON.parse(stored);
    return session;
  } catch (error) {
    console.error('Failed to load session:', error);
    return null;
  }
}

/**
 * Clear the local session from localStorage
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}

/**
 * Check if a valid local session exists
 */
export function hasValidSession(): boolean {
  const session = loadSession();
  return session !== null && (session.type === 'otp' || session.type === 'password' || session.type === 'guest');
}
