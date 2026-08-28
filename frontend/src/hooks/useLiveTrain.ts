import { useQuery } from '@tanstack/react-query';
import { getLiveTrain } from '../services/train.api';

export function useLiveTrain(trainId: string) {
  return useQuery({
    queryKey: ['train', 'live', trainId],
    queryFn: () => getLiveTrain(trainId),
    enabled: Boolean(trainId),
    refetchInterval: () => {
      if (typeof document !== 'undefined' && document.hidden) return 60000;
      return 15000;
    },
  });
}
