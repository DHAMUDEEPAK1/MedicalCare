import { useMemo } from 'react';
import { loadSession } from '../auth/session';
import { useInternetIdentity } from './useInternetIdentity';
import { useProfileDetails } from '../profile/useProfileDetails';

/**
 * Hook that resolves a display name for the current authenticated user.
 * 
 * Priority order:
 * 1. Saved profile full name (from profile details)
 * 2. Local session fullName (from password sign-up/sign-in)
 * 3. Local session phone (from OTP sign-in)
 * 4. "Guest" for guest sessions
 * 5. Shortened principal for Internet Identity
 * 6. "Guest" as final fallback
 */
export function useUserDisplayName(): string {
  const { identity, isInitializing } = useInternetIdentity();
  const { profile, isLoading: profileLoading } = useProfileDetails();
  
  return useMemo(() => {
    // Priority 1: Saved profile full name
    if (!profileLoading && profile?.fullName) {
      return profile.fullName;
    }

    // Check local session
    const session = loadSession();
    
    if (session) {
      // Priority 2: Password session with full name
      if (session.type === 'password' && session.fullName) {
        return session.fullName;
      }
      
      // Priority 3: OTP session with phone
      if (session.type === 'otp' && session.phone) {
        return session.phone;
      }
      
      // Priority 4: Guest session
      if (session.type === 'guest') {
        return 'Guest';
      }
    }
    
    // Priority 5: Internet Identity principal
    if (!isInitializing && identity && !identity.getPrincipal().isAnonymous()) {
      const principal = identity.getPrincipal().toString();
      // Show shortened principal (first 8 chars + ... + last 4 chars)
      if (principal.length > 15) {
        return `${principal.slice(0, 8)}...${principal.slice(-4)}`;
      }
      return principal;
    }
    
    // Priority 6: Default fallback
    return 'Guest';
  }, [identity, isInitializing, profile, profileLoading]);
}
