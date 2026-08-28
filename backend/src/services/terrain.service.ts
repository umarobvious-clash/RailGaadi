import { OpenTopographyClient } from '../providers/opentopography/OpenTopographyClient';
import { railradar } from '../providers/railradar/RailRadarClient';
import { cache } from '../cache/cache';

const topography = new OpenTopographyClient();

export async function getRouteElevation(trainId: string) {
  const cacheKey = 'elevation:' + trainId;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const route = await railradar.getRoute(trainId);
  const coords = route.geometry?.coordinates || [];

  // Only cache if we have real coordinates (not just a station-point fallback)
  const elevation = await topography.getRouteElevation(coords, route.distanceKm || 0);

  if (coords.length >= 5) {
    await cache.set(cacheKey, elevation, 86400 * 7); // 7 days TTL only for real data
  }
  return elevation;
}
