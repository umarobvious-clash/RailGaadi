import { useQuery } from '@tanstack/react-query';
import { getJourneyWeather } from '../services/train.api';

export function useJourneyWeather(trainId: string) {
  return useQuery({
    queryKey: ['journey', 'weather', trainId],
    queryFn: () => getJourneyWeather(trainId),
    enabled: Boolean(trainId),
    staleTime: 1000 * 60 * 10, // 10 min
  });
}
