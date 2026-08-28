import { useQuery } from '@tanstack/react-query';
import { getRouteElevation } from '../services/train.api';

export function useRouteElevation(trainId: string) {
  return useQuery({
    queryKey: ['route', 'elevation', trainId],
    queryFn: () => getRouteElevation(trainId),
    enabled: Boolean(trainId),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
