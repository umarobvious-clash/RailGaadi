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

// Directory of popular Indian trains to support text search by name
const POPULAR_TRAINS_DIRECTORY: Array<{ number: string; name: string; origin: string; dest: string }> = [
  { number: '12301', name: 'Howrah - New Delhi Rajdhani Express', origin: 'HWH', dest: 'NDLS' },
  { number: '12302', name: 'New Delhi - Howrah Rajdhani Express', origin: 'NDLS', dest: 'HWH' },
  { number: '12951', name: 'Mumbai Central - New Delhi Tejas Rajdhani Express', origin: 'MMCT', dest: 'NDLS' },
  { number: '12952', name: 'New Delhi - Mumbai Central Tejas Rajdhani Express', origin: 'NDLS', dest: 'MMCT' },
  { number: '12953', name: 'August Kranti Tejas Rajdhani Express', origin: 'MMCT', dest: 'NZM' },
  { number: '22691', name: 'Bengaluru Rajdhani Express', origin: 'SBC', dest: 'NZM' },
  { number: '22692', name: 'Hazrat Nizamuddin - Bengaluru Rajdhani Express', origin: 'NZM', dest: 'SBC' },
  { number: '12424', name: 'New Delhi - Dibrugarh Rajdhani Express', origin: 'NDLS', dest: 'DBRG' },
  { number: '22436', name: 'New Delhi - Varanasi Vande Bharat Express', origin: 'NDLS', dest: 'BSB' },
  { number: '22435', name: 'Varanasi - New Delhi Vande Bharat Express', origin: 'BSB', dest: 'NDLS' },
  { number: '22439', name: 'New Delhi - SMVD Katra Vande Bharat Express', origin: 'NDLS', dest: 'SVDK' },
  { number: '20607', name: 'Chennai Central - Mysuru Vande Bharat Express', origin: 'MAS', dest: 'MYS' },
  { number: '12004', name: 'New Delhi - Lucknow Shatabdi Express', origin: 'NDLS', dest: 'LJN' },
  { number: '12002', name: 'New Delhi - Rani Kamlapati Shatabdi Express', origin: 'NDLS', dest: 'RKMP' },
  { number: '12295', name: 'Sanghamitra SF Express (SMVB - DNR)', origin: 'SMVB', dest: 'DNR' },
  { number: '12296', name: 'Sanghamitra SF Express (DNR - SMVB)', origin: 'DNR', dest: 'SMVB' },
  { number: '12345', name: 'Saraighat Express', origin: 'HWH', dest: 'GHY' },
  { number: '12626', name: 'Kerala Express', origin: 'NDLS', dest: 'TVC' },
  { number: '12841', name: 'Coromandel Express', origin: 'HWH', dest: 'MAS' },
  { number: '12801', name: 'Purushottam Express', origin: 'PURI', dest: 'NDLS' },
  { number: '12137', name: 'Punjab Mail', origin: 'CSMT', dest: 'FZR' },
  { number: '12779', name: 'Goa Express', origin: 'VSG', dest: 'NZM' },
  { number: '12859', name: 'Gitanjali Express', origin: 'CSMT', dest: 'HWH' },
  { number: '12925', name: 'Paschim Express', origin: 'BDTS', dest: 'ASR' },
  { number: '12559', name: 'Shiv Ganga Express', origin: 'BSBS', dest: 'NDLS' },
  { number: '12393', name: 'Sampoorna Kranti Express', origin: 'RJPB', dest: 'NDLS' },
];

export class RailRadarClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;

  // Shared in-memory cache
  private static liveCache = new Map<string, { data: any; expiry: number }>();
  private static routeCache = new Map<string, { data: any; expiry: number }>();

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
      if (cached) {
        return cached.data; // Serve stale cache on rate limit
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
      const res = await this.fetchApi<any>(`/trains/${cleanNumber}/route`);
      const payload = res.data || res;
      RailRadarClient.routeCache.set(cleanNumber, { data: payload, expiry: now + 86400000 }); // 24h TTL
      return payload;
    } catch (err: any) {
      if (cached) {
        return cached.data;
      }
      logger.warn({ trainNumber: cleanNumber }, 'Could not fetch route GeoJSON from RailRadar');
      return null;
    }
  }

  async searchTrains(query: string): Promise<Train[]> {
    const q = query.toLowerCase().trim();
    if (!q || q.length < 2) return [];

    const matches: Train[] = [];
    const seen = new Set<string>();

    if (/^\d{3,5}$/.test(q)) {
      try {
        const livePayload = await this.getRawLivePayload(q);
        if (livePayload && (livePayload.trainNumber || livePayload.train)) {
          const train = normalizeRailRadarTrain(livePayload);
          matches.push(train);
          seen.add(train.number);
        }
      } catch (err) {
        logger.warn({ trainNumber: q }, 'RailRadar live train lookup by number not found or errored');
      }
    }

    for (const item of POPULAR_TRAINS_DIRECTORY) {
      if (
        item.number.includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.origin.toLowerCase().includes(q) ||
        item.dest.toLowerCase().includes(q)
      ) {
        if (!seen.has(item.number)) {
          const orgCoords = STATION_COORDS[item.origin] || { name: item.origin };
          const dstCoords = STATION_COORDS[item.dest] || { name: item.dest };

          matches.push({
            id: item.number,
            number: item.number,
            name: item.name,
            origin: {
              id: item.origin,
              code: item.origin,
              name: orgCoords.name,
            },
            destination: {
              id: item.dest,
              code: item.dest,
              name: dstCoords.name,
            },
          });
          seen.add(item.number);
        }
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
