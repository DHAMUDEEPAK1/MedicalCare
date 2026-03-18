import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

// Example query hook structure for future backend integration
export function useExampleQuery() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['example'],
    queryFn: async () => {
      if (!actor) return null;
      // Call backend methods here when available
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}
