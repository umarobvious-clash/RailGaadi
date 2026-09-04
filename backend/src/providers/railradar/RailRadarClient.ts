import { logger } from '../../logger';
import type { Train, LiveJourney, TrainRoute, Station } from '../../types';
import { env } from '../../config/env';
import {
  normalizeRailRadarTrain,
  normalizeRailRadarLive,
  normalizeRailRadarRoute,
  normalizeRailRadarStations,
  STATION_COORDS,
} from './normalizer';

export class RailRadarClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;

  // Shared in-memory cache
  private static liveCache = new Map<string, { data: any; expiry: number }>();
  private static routeCache = new Map<string, { data: any; expiry: number }>();
  private static directoryCache?: { data: Record<string, string>; expiry: number };

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

    try {
      logger.info({ endpoint, method: 'GET' }, 'Fetching from RailRadar upstream API');
      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        let errorBody = '';
        try {
          errorBody = await response.text();
        } catch {
          // ignore
        }
        logger.error(
          { endpoint, status: response.status, statusText: response.statusText, errorBody },
          'RailRadar upstream API returned error status'
        );
        throw new Error(`RailRadar API error: HTTP ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      return json as T;
    } catch (error: any) {
      logger.error({ endpoint, message: error.message }, 'Failed to communicate with RailRadar API');
      throw error;
    }
  }

  private async getRawLivePayload(trainNumber: string): Promise<any> {
    const cleanNumber = trainNumber.trim();
    const now = Date.now();
    const cached = RailRadarClient.liveCache.get(cleanNumber);
    if (cached && cached.expiry > now) {
      return cached.data;
    }

    try {
      const res = await this.fetchApi<any>(`/trains/${cleanNumber}/live`);
      const payload = res.data || res;
      RailRadarClient.liveCache.set(cleanNumber, { data: payload, expiry: now + 30000 }); // 30s TTL
      return payload;
    } catch (err: any) {
      // A very short grace period smooths transient provider failures without
      // presenting yesterday's position as if it were live.
      if (cached && now <= cached.expiry + 120000) {
        logger.warn({ trainNumber: cleanNumber }, 'Serving last verified live response because RailRadar is unavailable');
        return cached.data;
      }
      throw err;
    }
  }

  private async getRawRoutePayload(trainNumber: string): Promise<any> {
    const cleanNumber = trainNumber.trim();
    const now = Date.now();
    const cached = RailRadarClient.routeCache.get(cleanNumber);
    if (cached && cached.expiry > now) {
      return cached.data;
    }

    try {
      const res = await this.fetchApi<any>(`/trains/${cleanNumber}/route?format=geojson&stops=true`);
      const payload = res.data || res;
      RailRadarClient.routeCache.set(cleanNumber, { data: payload, expiry: now + 86400000 }); // 24h TTL
      return payload;
    } catch (err: any) {
      if (cached) {
        logger.warn({ trainNumber: cleanNumber }, 'Serving last verified route because RailRadar is unavailable');
        return cached.data;
      }
      throw err;
    }
  }

  private async getTrainDirectory(): Promise<Record<string, string>> {
    const now = Date.now();
    const cached = RailRadarClient.directoryCache;
    if (cached && cached.expiry > now) {
      return cached.data;
    }

    try {
      const res = await this.fetchApi<any>('/lookup/trains/prs');
      const directory = res.data || res;
      if (!directory || Array.isArray(directory) || typeof directory !== 'object') {
        throw new Error('RailRadar PRS train directory response is invalid');
      }
      RailRadarClient.directoryCache = { data: directory, expiry: now + 86400000 };
      return directory;
    } catch (error) {
      if (cached) {
        logger.warn('Serving last verified PRS train directory because RailRadar is unavailable');
        return cached.data;
      }
      throw error;
    }
  }

  async searchTrains(query: string): Promise<Train[]> {
    const q = query.toLowerCase().trim();
    if (!q || q.length < 2) return [];

    const matches: Train[] = [];
    const seen = new Set<string>();

    const directory = await this.getTrainDirectory();
    for (const [number, encodedDetails] of Object.entries(directory)) {
      const [name = `Train ${number}`, origin = '', destination = ''] = String(encodedDetails).split('|');
      if (
        number.includes(q) ||
        name.toLowerCase().includes(q) ||
        origin.toLowerCase().includes(q) ||
        destination.toLowerCase().includes(q)
      ) {
        const originDetails = STATION_COORDS[origin];
        const destinationDetails = STATION_COORDS[destination];
        matches.push({
          id: number,
          number,
          name,
          origin: {
            id: origin || 'ORG',
            code: origin || undefined,
            name: originDetails?.name || origin || 'Origin unavailable',
          },
          destination: {
            id: destination || 'DST',
            code: destination || undefined,
            name: destinationDetails?.name || destination || 'Destination unavailable',
          },
        });
        seen.add(number);
        if (matches.length >= 10) break;
      }
    }

    if (/^\d{5}$/.test(q) && seen.has(q)) {
      try {
        const verifiedTrain = normalizeRailRadarTrain(await this.getRawLivePayload(q));
        const exactIndex = matches.findIndex((train) => train.number === q);
        if (exactIndex >= 0) matches[exactIndex] = verifiedTrain;
      } catch (error) {
        logger.warn({ trainNumber: q }, 'Could not enrich exact train search with live metadata');
      }
    }

    return matches.slice(0, 10);
  }

  async getLiveStatus(trainNumber: string): Promise<LiveJourney> {
    const cleanNumber = trainNumber.trim();
    const livePayload = await this.getRawLivePayload(cleanNumber);
    const routePayload = await this.getRawRoutePayload(cleanNumber);

    let routeCoordinates: [number, number][] = [];
    const geojson = routePayload?.geojson || routePayload?.data?.geojson;
    if (geojson?.geometry?.coordinates && Array.isArray(geojson.geometry.coordinates)) {
      routeCoordinates = geojson.geometry.coordinates;
    }

    return normalizeRailRadarLive(livePayload, routeCoordinates);
  }

  async getRoute(trainNumber: string): Promise<TrainRoute> {
    const cleanNumber = trainNumber.trim();
    const livePayload = await this.getRawLivePayload(cleanNumber);
    const routePayload = await this.getRawRoutePayload(cleanNumber);

    let routeCoordinates: [number, number][] = [];
    const geojson = routePayload?.geojson || routePayload?.data?.geojson;
    if (geojson?.geometry?.coordinates && Array.isArray(geojson.geometry.coordinates)) {
      routeCoordinates = geojson.geometry.coordinates;
    }

    let stations: Station[] = [];
    let totalDistanceKm = 0;

    if (Array.isArray(livePayload.route)) {
      const currentSeq = livePayload.currentLocation?.sequence;
      stations = normalizeRailRadarStations(livePayload.route, routeCoordinates, currentSeq);
      totalDistanceKm = livePayload.train?.distance ?? livePayload.totalDistanceKm ?? livePayload.route[livePayload.route.length - 1]?.distance ?? 0;
    } else if (Array.isArray(routePayload.stops)) {
      stations = normalizeRailRadarStations(routePayload.stops, routeCoordinates);
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
