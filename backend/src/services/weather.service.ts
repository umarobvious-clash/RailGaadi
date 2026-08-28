import { OpenWeatherClient } from '../providers/openweather/OpenWeatherClient';
import { railradar } from '../providers/railradar/RailRadarClient';
import { cache } from '../cache/cache';

const openweather = new OpenWeatherClient();

export async function getJourneyWeather(trainId: string) {
  const cacheKey = 'weather:journey:' + trainId;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const live = await railradar.getLiveStatus(trainId);
  const route = await railradar.getRoute(trainId);

  const stations = route.stations || [];
  const currentSt =
    stations.find(s => s.id === live.currentStation?.id || s.code === live.currentStation?.code) ||
    stations[0] ||
    {
      name: live.currentStation?.name || 'Current Location',
      latitude: live.location?.lat || 28.6139,
      longitude: live.location?.lng || 77.209,
    };

  const nextSt =
    stations.find(s => s.id === live.nextStation?.id || s.code === live.nextStation?.code) ||
    stations[1] ||
    currentSt;

  const destSt = stations[stations.length - 1] || currentSt;

  const [current, next, destination] = await Promise.all([
    openweather.getWeatherByCoords(currentSt.latitude, currentSt.longitude, currentSt.name),
    openweather.getWeatherByCoords(nextSt.latitude, nextSt.longitude, nextSt.name),
    openweather.getWeatherByCoords(destSt.latitude, destSt.longitude, destSt.name),
  ]);

  const result = { current, next, destination };
  await cache.set(cacheKey, result, 600); // 10 min TTL
  return result;
}
