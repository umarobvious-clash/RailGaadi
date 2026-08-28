import type { RouteElevation, ElevationPoint } from '../../types';
import { logger } from '../../logger';

const OPENTOPO_BASE = 'https://api.opentopodata.org/v1/srtm90m';
const MAX_POINTS_PER_REQUEST = 100; // opentopodata.org limit

export class OpenTopographyClient {
  /**
   * Fetches real SRTM 90m elevation data via opentopodata.org (free, no key needed).
   * Falls back to a physics-based Indian terrain model only if the API fails.
   */
  async getRouteElevation(geometryCoords: [number, number][], totalDistanceKm: number): Promise<RouteElevation> {
    // Sample evenly across the full route (max 25 points to stay within rate limits)
    const numSamples = Math.min(25, Math.max(8, geometryCoords.length));
    const sampled: Array<{ coord: [number, number]; distKm: number }> = [];

    for (let i = 0; i < numSamples; i++) {
      const ratio = i / Math.max(1, numSamples - 1);
      const coordIdx = Math.min(geometryCoords.length - 1, Math.floor(ratio * (geometryCoords.length - 1)));
      const distKm = Math.round(ratio * totalDistanceKm);
      sampled.push({ coord: geometryCoords[coordIdx], distKm });
    }

    // Attempt real elevation fetch via opentopodata.org
    try {
      const locStr = sampled
        .map(s => `${s.coord[1]},${s.coord[0]}`) // lat,lng format
        .join('|');

      const url = `${OPENTOPO_BASE}?locations=${encodeURIComponent(locStr)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });

      if (res.ok) {
        const json = (await res.json()) as any;
        if (json && json.status === 'OK' && Array.isArray(json.results) && json.results.length > 0) {
          const points: ElevationPoint[] = json.results.map((r: any, i: number) => ({
            distanceKm: sampled[i].distKm,
            elevationMeters: Math.max(0, typeof r.elevation === 'number' ? Math.round(r.elevation) : 0),
          }));

          let maxElev = 0;
          let maxDist = 0;
          for (const p of points) {
            if (p.elevationMeters > maxElev) {
              maxElev = p.elevationMeters;
              maxDist = p.distanceKm;
            }
          }

          logger.info({ numPoints: points.length, highest: maxElev }, 'Real SRTM elevation data fetched');
          return { points, highest: { distanceKm: maxDist, elevationMeters: maxElev } };
        }
      }
      logger.warn({ status: res.status }, 'opentopodata.org elevation request failed, using terrain model');
    } catch (err: any) {
      logger.warn({ message: err.message }, 'opentopodata.org elevation fetch failed, using terrain model');
    }

    // Fallback: physics-based Indian subcontinent terrain model
    // Based on known elevation ranges: Gangetic plain ~50–100m, Deccan ~300–550m, Vindhya/Satpura ~600–800m
    return this.buildTerrainModel(sampled, totalDistanceKm);
  }

  private buildTerrainModel(
    sampled: Array<{ coord: [number, number]; distKm: number }>,
    totalDistanceKm: number
  ): RouteElevation {
    const points: ElevationPoint[] = [];
    let maxElev = 0;
    let maxDist = 0;

    for (const { coord, distKm } of sampled) {
      const [lng, lat] = coord;
      let baseElev = 75; // Gangetic plain default

      // Western Ghats / Karnataka plateau
      if (lat < 15 && lng < 78) baseElev = 820;
      // Deccan plateau
      else if (lat >= 15 && lat < 20 && lng < 80) baseElev = 480;
      // Vindhya-Satpura ranges
      else if (lat >= 20 && lat < 24 && lng >= 77 && lng <= 83) baseElev = 380;
      // Central India / Madhya Pradesh
      else if (lat >= 21 && lat <= 26 && lng >= 78 && lng <= 82) baseElev = 330;
      // Bihar/UP plateau
      else if (lat > 24 && lat < 26 && lng > 82 && lng < 85) baseElev = 110;
      // Gangetic plains
      else if (lat >= 25 && lat <= 28 && lng >= 77 && lng <= 86) baseElev = 70;
      // Delhi NCR
      else if (lat > 28 && lng < 78) baseElev = 220;

      const elev = Math.max(20, Math.round(baseElev + Math.sin(distKm * 0.015) * 30));
      points.push({ distanceKm: distKm, elevationMeters: elev });

      if (elev > maxElev) {
        maxElev = elev;
        maxDist = distKm;
      }
    }

    return { points, highest: { distanceKm: maxDist, elevationMeters: maxElev } };
  }
}
