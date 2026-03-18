import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './useInternetIdentity';
import { useAuthSession } from './useAuthSession';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Route guard hook that redirects to /signin when user is not authenticated
 * Checks Firebase Auth, Internet Identity, and local session state
 */
export function useRequireAuth() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { hasSession } = useAuthSession();
  const [isFirebaseChecking, setIsFirebaseChecking] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsFirebaseChecking(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Wait for auth initialization to finish
    if (isInitializing || isFirebaseChecking) {
      return;
    }

    // Check if user has either Firebase auth, Internet Identity, or local session
    const hasInternetIdentity = !!identity;
    const hasLocalSession = hasSession();
    const hasFirebaseAuth = !!firebaseUser;

    if (!hasInternetIdentity && !hasLocalSession && !hasFirebaseAuth) {
      // User is not authenticated, redirect to sign in
      navigate({ to: '/signin', replace: true });
    }
  }, [identity, isInitializing, hasSession, navigate, firebaseUser, isFirebaseChecking]);
}
