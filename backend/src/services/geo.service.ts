import { OverpassClient } from '../providers/overpass/OverpassClient';
import { RailRadarClient } from '../providers/railradar/RailRadarClient';
import { cache } from '../cache/cache';

const overpass = new OverpassClient();
const railradar = new RailRadarClient();

export async function getNearbyFeatures(trainId: string) {
  const cacheKey = 'geo:features:' + trainId;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const route = await railradar.getRoute(trainId);
  const features = await overpass.getFeaturesAlongRoute(trainId, route.stations);

  await cache.set(cacheKey, features, 86400); // 24 hr TTL
  return features;
}
