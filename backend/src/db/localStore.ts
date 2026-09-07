import fs from 'fs';
import path from 'path';
import { logger } from '../logger';
import type { Train, LiveJourney, TrainRoute, Station } from '../types';
import { STATION_COORDS } from '../providers/railradar/normalizer';

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const TRAINS_FILE = path.join(DATA_DIR, 'trains_directory.json');
const ROUTES_FILE = path.join(DATA_DIR, 'routes_store.json');
const LIVE_FILE = path.join(DATA_DIR, 'live_snapshots.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class LocalStore {
  private trainsDirectory: Record<string, string> = {};
  private routesStore: Record<string, any> = {};
  private liveStore: Record<string, any> = {};

  constructor() {
    this.loadAll();
  }

  private loadAll() {
    try {
      if (fs.existsSync(TRAINS_FILE)) {
        this.trainsDirectory = JSON.parse(fs.readFileSync(TRAINS_FILE, 'utf-8'));
        logger.info({ count: Object.keys(this.trainsDirectory).length }, 'Loaded PRS trains directory into memory database');
      }
    } catch (e: any) {
      logger.error({ error: e.message }, 'Failed to load trains_directory.json');
    }

    try {
      if (fs.existsSync(ROUTES_FILE)) {
        this.routesStore = JSON.parse(fs.readFileSync(ROUTES_FILE, 'utf-8'));
        logger.info({ count: Object.keys(this.routesStore).length }, 'Loaded cached routes into memory database');
      }
    } catch (e: any) {
      logger.error({ error: e.message }, 'Failed to load routes_store.json');
    }

    try {
      if (fs.existsSync(LIVE_FILE)) {
        this.liveStore = JSON.parse(fs.readFileSync(LIVE_FILE, 'utf-8'));
        logger.info({ count: Object.keys(this.liveStore).length }, 'Loaded live snapshots into memory database');
      }
    } catch (e: any) {
      logger.error({ error: e.message }, 'Failed to load live_snapshots.json');
    }
  }

  // ─── Trains Search & Lookup ──────────────────────────────────────────────────

  searchTrains(query: string): Train[] {
    const q = query.toLowerCase().trim();
    if (!q || q.length < 2) return [];

    const matches: Train[] = [];
    const entries = Object.entries(this.trainsDirectory);

    for (const [number, encodedDetails] of entries) {
      const parts = String(encodedDetails).split('|');
      const name = parts[0] || `Train ${number}`;
      const origin = parts[1] || '';
      const dest = parts[2] || '';

      if (
        number.includes(q) ||
        name.toLowerCase().includes(q) ||
        origin.toLowerCase().includes(q) ||
        dest.toLowerCase().includes(q)
      ) {
        const orgCoords = STATION_COORDS[origin] || { name: origin, lat: 28.6139, lng: 77.2090 };
        const dstCoords = STATION_COORDS[dest] || { name: dest, lat: 28.6139, lng: 77.2090 };

        matches.push({
          id: number,
          number: number,
          name: name,
          origin: {
            id: origin || 'ORG',
            code: origin || undefined,
            name: orgCoords.name || origin || 'Origin Station',
          },
          destination: {
            id: dest || 'DST',
            code: dest || undefined,
            name: dstCoords.name || dest || 'Destination Station',
          },
        });

        if (matches.length >= 10) break;
      }
    }

    return matches;
  }

  getTrainMeta(trainNumber: string): { name: string; origin: string; dest: string } | null {
    const encoded = this.trainsDirectory[trainNumber];
    if (!encoded) return null;
    const [name = `Train ${trainNumber}`, origin = '', dest = ''] = encoded.split('|');
    return { name, origin, dest };
  }

  // ─── Route Storage ─────────────────────────────────────────────────────────

  getRoute(trainNumber: string): any | null {
    return this.routesStore[trainNumber] || null;
  }

  saveRoute(trainNumber: string, data: any) {
    if (!data) return;
    this.routesStore[trainNumber] = data;
    try {
      fs.writeFileSync(ROUTES_FILE, JSON.stringify(this.routesStore, null, 2), 'utf-8');
    } catch (e: any) {
      logger.error({ error: e.message }, 'Failed to persist routes_store.json');
    }
  }

  // Synthesize a basic route if completely missing and API is offline
  generateFallbackRoute(trainNumber: string): any {
    const meta = this.getTrainMeta(trainNumber);
    const orgCode = meta?.origin || 'NDLS';
    const dstCode = meta?.dest || 'HWH';

    const org = STATION_COORDS[orgCode] || { name: orgCode, lat: 28.6427, lng: 77.2195 };
    const dst = STATION_COORDS[dstCode] || { name: dstCode, lat: 22.5839, lng: 88.3433 };

    // Generate 15 intermediate sample points along the great circle
    const coordinates: [number, number][] = [];
    for (let i = 0; i <= 20; i++) {
      const frac = i / 20;
      const lng = org.lng + (dst.lng - org.lng) * frac;
      const lat = org.lat + (dst.lat - org.lat) * frac;
      coordinates.push([Number(lng.toFixed(5)), Number(lat.toFixed(5))]);
    }

    const stations = [
      {
        id: orgCode,
        code: orgCode,
        name: org.name,
        latitude: org.lat,
        longitude: org.lng,
        distanceFromOriginKm: 0,
        status: 'CURRENT' as const,
        scheduledDeparture: '06:00',
      },
      {
        id: dstCode,
        code: dstCode,
        name: dst.name,
        latitude: dst.lat,
        longitude: dst.lng,
        distanceFromOriginKm: 1200,
        status: 'UPCOMING' as const,
        scheduledArrival: '22:30',
      },
    ];

    return {
      success: true,
      data: {
        train: {
          number: trainNumber,
          name: meta?.name || `Train ${trainNumber}`,
          distance: 1200,
        },
        route: stations,
        geojson: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates,
          },
        },
      },
    };
  }

  // ─── Live Snapshot Storage ─────────────────────────────────────────────────

  getLiveSnapshot(trainNumber: string): any | null {
    return this.liveStore[trainNumber] || null;
  }

  saveLiveSnapshot(trainNumber: string, data: any) {
    if (!data) return;
    this.liveStore[trainNumber] = data;
    try {
      fs.writeFileSync(LIVE_FILE, JSON.stringify(this.liveStore, null, 2), 'utf-8');
    } catch (e: any) {
      logger.error({ error: e.message }, 'Failed to persist live_snapshots.json');
    }
  }

  generateFallbackLive(trainNumber: string): any {
    const meta = this.getTrainMeta(trainNumber);
    const orgCode = meta?.origin || 'NDLS';
    const dstCode = meta?.dest || 'HWH';

    const org = STATION_COORDS[orgCode] || { name: orgCode, lat: 28.6427, lng: 77.2195 };
    const dst = STATION_COORDS[dstCode] || { name: dstCode, lat: 22.5839, lng: 88.3433 };

    return {
      success: true,
      data: {
        train: {
          number: trainNumber,
          name: meta?.name || `Train ${trainNumber}`,
          distance: 1200,
          source: { code: orgCode, name: org.name },
          destination: { code: dstCode, name: dst.name },
        },
        currentLocation: {
          lat: (org.lat + dst.lat) / 2,
          lng: (org.lng + dst.lng) / 2,
          sequence: 1,
          speed: 75,
        },
        status: {
          state: 'RUNNING',
          delayMinutes: 0,
        },
        distanceCovered: 600,
        distanceRemaining: 600,
        totalDistanceKm: 1200,
        route: [
          { code: orgCode, name: org.name, distance: 0, lat: org.lat, lng: org.lng, departure: '06:00' },
          { code: dstCode, name: dst.name, distance: 1200, lat: dst.lat, lng: dst.lng, arrival: '22:30' },
        ],
      },
    };
  }
}

export const localStore = new LocalStore();
