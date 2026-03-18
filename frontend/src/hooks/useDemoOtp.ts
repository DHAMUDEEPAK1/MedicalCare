import { useState, useCallback, useEffect } from 'react';

interface OtpSession {
  phoneNumber: string;
  code: string;
  createdAt: number;
  expiresAt: number;
}

interface UseDemoOtpReturn {
  generateOtp: (phoneNumber: string) => string;
  verifyOtp: (phoneNumber: string, code: string) => { success: boolean; error?: string };
  currentOtp: string | null;
  currentPhone: string | null;
  canResend: boolean;
  resendCooldown: number;
  resetSession: () => void;
}

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds

export function useDemoOtp(): UseDemoOtpReturn {
  const [session, setSession] = useState<OtpSession | null>(null);
  const [lastSentAt, setLastSentAt] = useState<number>(0);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // Update cooldown timer
  useEffect(() => {
    if (lastSentAt === 0) {
      setResendCooldown(0);
      return;
    }

    const updateCooldown = () => {
      const elapsed = Date.now() - lastSentAt;
      const remaining = Math.max(0, Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000));
      setResendCooldown(remaining);

      if (remaining > 0) {
        requestAnimationFrame(updateCooldown);
      }
    };

    updateCooldown();
  }, [lastSentAt]);

  const generateOtp = useCallback((phoneNumber: string): string => {
    // Generate a 6-digit numeric code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const now = Date.now();

    const newSession: OtpSession = {
      phoneNumber,
      code,
      createdAt: now,
      expiresAt: now + OTP_EXPIRY_MS,
    };

    setSession(newSession);
    setLastSentAt(now);

    return code;
  }, []);

  const verifyOtp = useCallback(
    (phoneNumber: string, code: string): { success: boolean; error?: string } => {
      if (!session) {
        return { success: false, error: 'No OTP session found. Please request a new code.' };
      }

      if (session.phoneNumber !== phoneNumber) {
        return { success: false, error: 'Phone number does not match the OTP session.' };
      }

      const now = Date.now();
      if (now > session.expiresAt) {
        return { success: false, error: 'OTP has expired. Please request a new code.' };
      }

      if (session.code !== code) {
        return { success: false, error: 'Invalid OTP code. Please try again.' };
      }

      return { success: true };
    },
    [session]
  );

  const resetSession = useCallback(() => {
    setSession(null);
    setLastSentAt(0);
    setResendCooldown(0);
  }, []);

  const canResend = resendCooldown === 0;

  return {
    generateOtp,
    verifyOtp,
    currentOtp: session?.code || null,
    currentPhone: session?.phoneNumber || null,
    canResend,
    resendCooldown,
    resetSession,
  };
}
