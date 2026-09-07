import { logger } from '../../logger';
import type { Train, LiveJourney, TrainRoute, Station } from '../../types';
import { env } from '../../config/env';
import { localStore } from '../../db/localStore';
import {
  normalizeRailRadarTrain,
  normalizeRailRadarLive,
  normalizeRailRadarRoute,
  normalizeRailRadarStations,
} from './normalizer';

export class RailRadarClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;

  // In-memory cache for live statuses (30s TTL to prevent rate limit spikes)
  private static liveCache = new Map<string, { data: any; expiry: number }>();
  // In-flight request deduplication to prevent parallel requests for the same train
  private static inFlightLive = new Map<string, Promise<any>>();
  private static inFlightRoute = new Map<string, Promise<any>>();

  constructor() {
    this.baseUrl = 'https://api.railradar.in/v1';
    this.apiKey = env.RAILRADAR_API_KEY;
  }

  private async fetchApi<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      logger.warn(
        { endpoint, status: response.status, statusText: response.statusText, errorText },
        'RailRadar upstream API returned non-OK status'
      );
      throw new Error(`RailRadar API error: HTTP ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return json as T;
  }

  private async getRawLivePayload(trainNumber: string): Promise<any> {
    const cleanNumber = trainNumber.trim();
    const now = Date.now();
    const cached = RailRadarClient.liveCache.get(cleanNumber);

    if (cached && cached.expiry > now) {
      return cached.data;
    }

    // Deduplicate in-flight requests for the same train
    if (RailRadarClient.inFlightLive.has(cleanNumber)) {
      return RailRadarClient.inFlightLive.get(cleanNumber)!;
    }

    const fetchPromise = (async () => {
      try {
        const res = await this.fetchApi<any>(`/trains/${cleanNumber}/live`);
        const payload = res.data || res;
        RailRadarClient.liveCache.set(cleanNumber, { data: payload, expiry: now + 45000 }); // 45s TTL
        localStore.saveLiveSnapshot(cleanNumber, payload);
        return payload;
      } catch (err: any) {
        logger.warn({ trainNumber: cleanNumber, err: err.message }, 'Upstream live fetch failed, checking local database store');
        // 1. Check if we have a saved live snapshot in local database
        const savedSnapshot = localStore.getLiveSnapshot(cleanNumber);
        if (savedSnapshot) {
          logger.info({ trainNumber: cleanNumber }, 'Serving live status from local database snapshot');
          return savedSnapshot;
        }

        // 2. Generate smooth fallback from train schedule/route
        logger.info({ trainNumber: cleanNumber }, 'Serving computed fallback live status');
        return localStore.generateFallbackLive(cleanNumber);
      } finally {
        RailRadarClient.inFlightLive.delete(cleanNumber);
      }
    })();

    RailRadarClient.inFlightLive.set(cleanNumber, fetchPromise);
    return fetchPromise;
  }

  private async getRawRoutePayload(trainNumber: string): Promise<any> {
    const cleanNumber = trainNumber.trim();

    // 1. Permanent cache in local database — railway tracks don't change!
    const localRoute = localStore.getRoute(cleanNumber);
    if (localRoute && localRoute.geojson?.geometry?.coordinates?.length > 1) {
      return localRoute;
    }

    // Deduplicate in-flight requests
    if (RailRadarClient.inFlightRoute.has(cleanNumber)) {
      return RailRadarClient.inFlightRoute.get(cleanNumber)!;
    }

    const fetchPromise = (async () => {
      try {
        const res = await this.fetchApi<any>(`/trains/${cleanNumber}/route?format=geojson&stops=true`);
        const payload = res.data || res;
        localStore.saveRoute(cleanNumber, payload);
        return payload;
      } catch (err: any) {
        logger.warn({ trainNumber: cleanNumber, err: err.message }, 'Upstream route fetch failed, using local database fallback');
        if (localRoute) {
          return localRoute;
        }
        return localStore.generateFallbackRoute(cleanNumber);
      } finally {
        RailRadarClient.inFlightRoute.delete(cleanNumber);
      }
    })();

    RailRadarClient.inFlightRoute.set(cleanNumber, fetchPromise);
    return fetchPromise;
  }

  async searchTrains(query: string): Promise<Train[]> {
    const q = query.toLowerCase().trim();
    if (!q || q.length < 2) return [];

    // Local database search across all 4,061 PRS trains (instant, zero API calls, zero rate limit issues)
    const matches = localStore.searchTrains(q);
    if (matches.length > 0) {
      return matches;
    }

    // Fallback: If query is numeric and not in database, attempt live lookup
    if (/^\d{3,5}$/.test(q)) {
      try {
        const livePayload = await this.getRawLivePayload(q);
        if (livePayload && (livePayload.trainNumber || livePayload.train)) {
          const train = normalizeRailRadarTrain(livePayload);
          return [train];
        }
      } catch {
        // ignore
      }
    }

    return [];
  }

  async getLiveStatus(trainNumber: string): Promise<LiveJourney> {
    const cleanNumber = trainNumber.trim();
    const [livePayload, routePayload] = await Promise.all([
      this.getRawLivePayload(cleanNumber),
      this.getRawRoutePayload(cleanNumber),
    ]);

    let routeCoordinates: [number, number][] = [];
    const geojson = routePayload?.geojson || routePayload?.data?.geojson;
    if (geojson?.geometry?.coordinates && Array.isArray(geojson.geometry.coordinates)) {
      routeCoordinates = geojson.geometry.coordinates;
    }

    return normalizeRailRadarLive(livePayload, routeCoordinates);
  }

  async getRoute(trainNumber: string): Promise<TrainRoute> {
    const cleanNumber = trainNumber.trim();
    const [livePayload, routePayload] = await Promise.all([
      this.getRawLivePayload(cleanNumber),
      this.getRawRoutePayload(cleanNumber),
    ]);

    let routeCoordinates: [number, number][] = [];
    const geojson = routePayload?.geojson || routePayload?.data?.geojson;
    if (geojson?.geometry?.coordinates && Array.isArray(geojson.geometry.coordinates)) {
      routeCoordinates = geojson.geometry.coordinates;
    }

    let stations: Station[] = [];
    let totalDistanceKm = 0;

    const routeList = livePayload.route || routePayload.route || routePayload.data?.route;
    if (Array.isArray(routeList)) {
      const currentSeq = livePayload.currentLocation?.sequence;
      stations = normalizeRailRadarStations(routeList, routeCoordinates, currentSeq);
      totalDistanceKm =
        livePayload.train?.distance ??
        livePayload.totalDistanceKm ??
        routeList[routeList.length - 1]?.distance ??
        1200;
    }

    return normalizeRailRadarRoute(routePayload, stations, totalDistanceKm, cleanNumber);
  }

  async getStations(trainNumber: string): Promise<Station[]> {
    const cleanNumber = trainNumber.trim();
    const livePayload = await this.getRawLivePayload(cleanNumber);
    if (Array.isArray(livePayload.route)) {
      const currentSeq = livePayload.currentLocation?.sequence;
      return normalizeRailRadarStations(livePayload.route, [], currentSeq);
    }
    return [];
  }
}

export const railradar = new RailRadarClient();
