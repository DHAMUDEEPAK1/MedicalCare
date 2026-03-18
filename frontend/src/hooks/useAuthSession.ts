import { useCallback } from 'react';
import { saveSession, clearSession, hasValidSession, type SessionType } from '../auth/session';

/**
 * Hook for managing local authentication session state
 * (demo phone+OTP, password-based sign-in, and guest access)
 */
export function useAuthSession() {
  const signInAsOtp = useCallback((phone: string) => {
    saveSession('otp', phone);
  }, []);

  const signInAsPassword = useCallback((phone: string, fullName: string) => {
    saveSession('password', phone, fullName);
  }, []);

  const continueAsGuest = useCallback(() => {
    saveSession('guest');
  }, []);

  const clearLocalSession = useCallback(() => {
    clearSession();
  }, []);

  const hasSession = useCallback(() => {
    return hasValidSession();
  }, []);

  return {
    signInAsOtp,
    signInAsPassword,
    continueAsGuest,
    clearLocalSession,
    hasSession,
  };
}
