import { railradar } from '../providers/railradar/RailRadarClient';
import { cache } from '../cache/cache';
import type { Train } from '../types';

export async function searchTrains(query: string): Promise<Train[]> {
  const sanitized = query.trim().slice(0, 100);
  if (sanitized.length < 2) return [];

  const cacheKey = 'search:' + sanitized.toLowerCase();
  const cached = await cache.get<Train[]>(cacheKey);
  if (cached) return cached;

  const results = await railradar.searchTrains(sanitized);
  await cache.set(cacheKey, results, 300); // 5 min TTL
  return results;
}

export async function getLiveJourneyByNumber(trainNumber: string) {
  const cacheKey = 'live:' + trainNumber;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const journey = await railradar.getLiveStatus(trainNumber);
  await cache.set(cacheKey, journey, 15); // 15 sec TTL
  return journey;
}

export async function getTrainRoute(trainNumber: string) {
  const cacheKey = 'route:' + trainNumber;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const route = await railradar.getRoute(trainNumber);
  // Only cache if we have real GeoJSON route (not just station points)
  if (route.geometry?.coordinates?.length >= 10) {
    await cache.set(cacheKey, route, 86400); // 24 hr TTL
  }
  return route;
}

export async function getTrainStations(trainNumber: string) {
  const cacheKey = 'stations:' + trainNumber;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const stations = await railradar.getStations(trainNumber);
  await cache.set(cacheKey, stations, 86400);
  return stations;
}
