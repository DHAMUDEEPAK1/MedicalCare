import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { ProfileDetails } from './profileTypes';
import { getEmptyProfileDetails } from './profileTypes';
import { loadLocalProfile, saveLocalProfile } from './profileLocalStore';
import { loadSession } from '../auth/session';
import type { UserProfile } from '../backend';

const PROFILE_QUERY_KEY = 'userProfile';

/**
 * Hook that provides current profile details and save mutation.
 * Handles both Internet Identity (backend) and local sessions (localStorage).
 */
export function useProfileDetails() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();

  // Determine if we're using Internet Identity or local session
  const isInternetIdentity = !isInitializing && identity && !identity.getPrincipal().isAnonymous();
  const localSession = loadSession();
  const hasLocalSession = !!localSession;

  // Query for profile details
  const query = useQuery<ProfileDetails | null>({
    queryKey: [PROFILE_QUERY_KEY, identity?.getPrincipal().toString(), localSession?.type, localSession?.phone],
    queryFn: async () => {
      // Internet Identity: fetch from backend
      if (isInternetIdentity && actor) {
        try {
          const backendProfile = await actor.getCallerUserProfile();
          if (backendProfile) {
            // Convert backend UserProfile to frontend ProfileDetails
            // Backend only stores name, so we merge with empty defaults
            const profile: ProfileDetails = {
              ...getEmptyProfileDetails(),
              fullName: backendProfile.name,
            };
            return profile;
          }
          return null;
        } catch (error: any) {
          // Handle authorization errors gracefully
          if (error.message && error.message.includes('Unauthorized')) {
            console.warn('Unauthorized access to profile');
            return null;
          }
          throw error;
        }
      }

      // Local session: load from localStorage
      if (hasLocalSession) {
        return loadLocalProfile();
      }

      return null;
    },
    enabled: (isInternetIdentity && !!actor && !actorFetching) || hasLocalSession,
    retry: false,
  });

  // Mutation for saving profile
  const saveMutation = useMutation({
    mutationFn: async (profile: ProfileDetails) => {
      // Internet Identity: save to backend
      if (isInternetIdentity && actor) {
        const backendProfile: UserProfile = {
          name: profile.fullName,
        };
        await actor.saveCallerUserProfile(backendProfile);
        return profile;
      }

      // Local session: save to localStorage
      if (hasLocalSession) {
        saveLocalProfile(profile);
        return profile;
      }

      throw new Error('No active session to save profile');
    },
    onSuccess: (savedProfile) => {
      // Update the cache immediately
      queryClient.setQueryData(
        [PROFILE_QUERY_KEY, identity?.getPrincipal().toString(), localSession?.type, localSession?.phone],
        savedProfile
      );
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
    },
  });

  return {
    profile: query.data ?? null,
    isLoading: actorFetching || query.isLoading,
    isFetched: (isInternetIdentity ? !!actor : true) && query.isFetched,
    error: query.error,
    saveProfile: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    saveError: saveMutation.error,
  };
}
