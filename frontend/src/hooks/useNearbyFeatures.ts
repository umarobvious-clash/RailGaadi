import { useQuery } from '@tanstack/react-query';
import { getNearbyFeatures } from '../services/train.api';

export function useNearbyFeatures(trainId: string) {
  return useQuery({
    queryKey: ['geo', 'features', trainId],
    queryFn: () => getNearbyFeatures(trainId),
    enabled: Boolean(trainId),
    staleTime: 1000 * 60 * 60, // 1 hr
  });
}
