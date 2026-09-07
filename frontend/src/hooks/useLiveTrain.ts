import { useQuery } from '@tanstack/react-query';
import { getLiveTrain } from '../services/train.api';

export function useLiveTrain(trainId: string) {
  return useQuery({
    queryKey: ['train', 'live', trainId],
    queryFn: () => getLiveTrain(trainId),
    enabled: Boolean(trainId),
    staleTime: 30000, // 30s cache before refetching
    refetchInterval: () => {
      if (typeof document !== 'undefined' && document.hidden) return 120000; // 2 min when tab hidden
      return 45000; // 45s when tab active (prevents rate-limit quota exhaustion)
    },
    retry: 2,
    retryDelay: (attempt) => Math.min(attempt * 2000, 10000),
  });
}
