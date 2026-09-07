import { useQuery } from '@tanstack/react-query';
import { getTrainRoute } from '../services/train.api';

export function useTrainRoute(trainId: string) {
  return useQuery({
    queryKey: ['train', 'route', trainId],
    queryFn: () => getTrainRoute(trainId),
    enabled: Boolean(trainId),
    staleTime: 1000 * 60 * 30, // 30 mins
    refetchOnWindowFocus: false,
  });
}
