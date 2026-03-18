import { useMutation, useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

/**
 * React hook for backend credential operations
 */
export function useBackendCredentials() {
  const { actor, isFetching: actorFetching } = useActor();

  // Check if credentials exist
  const checkCredentials = useQuery<boolean>({
    queryKey: ['hasCredentials'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasCredentials();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  // Add credentials mutation
  const addCredentialsMutation = useMutation({
    mutationFn: async ({ phoneNumber, hashedPassword }: { phoneNumber: string; hashedPassword: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCredentials(phoneNumber, hashedPassword);
    },
  });

  // Verify credentials mutation
  const verifyCredentialsMutation = useMutation({
    mutationFn: async ({ phoneNumber, hashedPassword }: { phoneNumber: string; hashedPassword: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyCredentials(phoneNumber, hashedPassword);
    },
  });

  return {
    hasCredentials: checkCredentials.data ?? false,
    isCheckingCredentials: checkCredentials.isLoading,
    addCredentials: addCredentialsMutation.mutateAsync,
    verifyCredentials: verifyCredentialsMutation.mutateAsync,
    isAddingCredentials: addCredentialsMutation.isPending,
    isVerifyingCredentials: verifyCredentialsMutation.isPending,
  };
}
