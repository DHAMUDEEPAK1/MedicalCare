import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './useInternetIdentity';
import { hasValidSession } from '../auth/session';

/**
 * Hook that redirects authenticated users to /home
 * Used on public pages like / and /signin to prevent authenticated users from seeing them
 */
export function useRedirectIfAuthenticated() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();

  useEffect(() => {
    // Wait for Internet Identity to finish initializing
    if (isInitializing) {
      return;
    }

    // Check if user has Internet Identity
    const hasInternetIdentity = !!identity && !identity.getPrincipal().isAnonymous();
    
    // Check if user has valid local session
    const hasLocalSession = hasValidSession();

    // Redirect to home if authenticated
    if (hasInternetIdentity || hasLocalSession) {
      navigate({ to: '/home', replace: true });
    }
  }, [identity, isInitializing, navigate]);
}
