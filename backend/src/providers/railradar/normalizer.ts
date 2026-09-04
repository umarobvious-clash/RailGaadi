import type { Train, LiveJourney, TrainRoute, Station, JourneyStatus } from '../../types';
import { logger } from '../../logger';

// ─── Comprehensive Indian Railway Stations GPS Catalog ────────────────────────

export const STATION_COORDS: Record<string, { name: string; lat: number; lng: number }> = {
  // Northern & Delhi NCR
  NDLS: { name: 'New Delhi', lat: 28.6427, lng: 77.2195 },
  NZM:  { name: 'Hazrat Nizamuddin', lat: 28.5886, lng: 77.2534 },
  DLI:  { name: 'Old Delhi', lat: 28.6609, lng: 77.2285 },
  ANVT: { name: 'Anand Vihar Terminal', lat: 28.6508, lng: 77.3153 },
  DEE:  { name: 'Delhi Sarai Rohilla', lat: 28.6644, lng: 77.1852 },
  GZB:  { name: 'Ghaziabad', lat: 28.6667, lng: 77.4333 },
  ALJN: { name: 'Aligarh Junction', lat: 27.8974, lng: 78.0880 },
  HRS:  { name: 'Hathras Junction', lat: 27.5956, lng: 78.0534 },
  SNS:  { name: 'Sasni', lat: 27.7050, lng: 78.0800 },
  TDL:  { name: 'Tundla Junction', lat: 27.2081, lng: 78.2411 },
  MTJ:  { name: 'Mathura Junction', lat: 27.4924, lng: 77.6737 },
  AGC:  { name: 'Agra Cantt', lat: 27.1585, lng: 78.0069 },
  GWL:  { name: 'Gwalior Junction', lat: 26.2183, lng: 78.1828 },
  VGLB: { name: 'VGL Jhansi Junction', lat: 25.4484, lng: 78.5685 },
  CDG:  { name: 'Chandigarh', lat: 30.7046, lng: 76.7985 },
  KLK:  { name: 'Kalka', lat: 30.8351, lng: 76.9360 },
  UMB:  { name: 'Ambala Cantt', lat: 30.3609, lng: 76.8282 },
  LDH:  { name: 'Ludhiana Junction', lat: 30.9010, lng: 75.8573 },
  ASR:  { name: 'Amritsar Junction', lat: 31.6340, lng: 74.8723 },
  JAT:  { name: 'Jammu Tawi', lat: 32.7063, lng: 74.8797 },
  SVDK: { name: 'Shri Mata Vaishno Devi Katra', lat: 32.9926, lng: 74.9317 },

  // Eastern & Bihar/Bengal
  HWH:  { name: 'Howrah Junction', lat: 22.5839, lng: 88.3433 },
  SDAH: { name: 'Sealdah', lat: 22.5675, lng: 88.3712 },
  KOAA: { name: 'Kolkata Chitpur', lat: 22.6019, lng: 88.3752 },
  BWN:  { name: 'Barddhaman Junction', lat: 23.2324, lng: 87.8550 },
  ASN:  { name: 'Asansol Junction', lat: 23.6889, lng: 86.9661 },
  DHN:  { name: 'Dhanbad Junction', lat: 23.7957, lng: 86.4304 },
  PNME: { name: 'Parasnath', lat: 23.9575, lng: 86.0841 },
  GAYA: { name: 'Gaya Junction', lat: 24.7955, lng: 85.0002 },
  DDU:  { name: 'Pt. Deen Dayal Upadhyaya Jn', lat: 25.2818, lng: 83.1189 },
  DLN:  { name: 'Dildarnagar Junction', lat: 25.4333, lng: 83.6667 },
  BXR:  { name: 'Buxar', lat: 25.5644, lng: 83.9778 },
  ARA:  { name: 'Ara Junction', lat: 25.5539, lng: 84.6644 },
  DNR:  { name: 'Danapur', lat: 25.5824, lng: 85.0453 },
  PNBE: { name: 'Patna Junction', lat: 25.6022, lng: 85.1376 },
  PPTA: { name: 'Patliputra Junction', lat: 25.6378, lng: 85.0939 },
  RJPB: { name: 'Rajendra Nagar Terminal', lat: 25.5973, lng: 85.1592 },
  BJU:  { name: 'Barauni Junction', lat: 25.4744, lng: 85.9753 },
  KIR:  { name: 'Katihar Junction', lat: 25.5394, lng: 87.5681 },
  NJP:  { name: 'New Jalpaiguri', lat: 26.6858, lng: 88.4419 },
  GHY:  { name: 'Guwahati', lat: 26.1822, lng: 91.7516 },
  KYQ:  { name: 'Kamakhya Junction', lat: 26.1558, lng: 91.7042 },
  DBRG: { name: 'Dibrugarh', lat: 27.4728, lng: 94.9120 },

  // Uttar Pradesh & Central
  BSB:  { name: 'Varanasi Junction', lat: 25.3283, lng: 82.9861 },
  BSBS: { name: 'Banaras', lat: 25.3176, lng: 82.9667 },
  MZP:  { name: 'Mirzapur', lat: 25.1337, lng: 82.5644 },
  PRYJ: { name: 'Prayagraj Junction', lat: 25.4484, lng: 81.8333 },
  PCOI: { name: 'Prayagraj Chheoki', lat: 25.3986, lng: 81.8847 },
  FTP:  { name: 'Fatehpur', lat: 25.9281, lng: 80.8128 },
  CNB:  { name: 'Kanpur Central', lat: 26.4547, lng: 80.3507 },
  ETW:  { name: 'Etawah Junction', lat: 26.7761, lng: 79.0278 },
  SKB:  { name: 'Shikohabad Junction', lat: 27.1089, lng: 78.5842 },
  FZD:  { name: 'Firozabad', lat: 27.1500, lng: 78.3900 },
  LKO:  { name: 'Lucknow Charbagh NR', lat: 26.8317, lng: 80.9231 },
  LJN:  { name: 'Lucknow Junction NER', lat: 26.8317, lng: 80.9231 },
  GKP:  { name: 'Gorakhpur Junction', lat: 26.7588, lng: 83.3697 },
  BPL:  { name: 'Bhopal Junction', lat: 23.2599, lng: 77.4126 },
  RKMP: { name: 'Rani Kamlapati', lat: 23.2057, lng: 77.4393 },
  ET:   { name: 'Itarsi Junction', lat: 22.6128, lng: 77.7619 },
  JBP:  { name: 'Jabalpur', lat: 23.1686, lng: 79.9339 },
  STA:  { name: 'Satna', lat: 24.5800, lng: 80.8300 },
  MKP:  { name: 'Manikpur Junction', lat: 25.0400, lng: 81.1100 },
  KTE:  { name: 'Katni', lat: 23.8300, lng: 80.4000 },
  NGP:  { name: 'Nagpur Junction', lat: 21.1504, lng: 79.0882 },

  // Western & Maharashtra/Gujarat
  MMCT: { name: 'Mumbai Central', lat: 18.9696, lng: 72.8193 },
  CSMT: { name: 'Chhatrapati Shivaji Maharaj Terminus', lat: 18.9401, lng: 72.8354 },
  BDTS: { name: 'Bandra Terminus', lat: 19.0628, lng: 72.8407 },
  LTT:  { name: 'Lokmanya Tilak Terminus', lat: 19.0699, lng: 72.8913 },
  BVI:  { name: 'Borivali', lat: 19.2288, lng: 72.8568 },
  KYN:  { name: 'Kalyan Junction', lat: 19.2437, lng: 73.1355 },
  PUNE: { name: 'Pune Junction', lat: 18.5284, lng: 73.8739 },
  BSL:  { name: 'Bhusaval Junction', lat: 21.0455, lng: 75.7885 },
  ST:   { name: 'Surat', lat: 21.2049, lng: 72.8406 },
  BRC:  { name: 'Vadodara Junction', lat: 22.3107, lng: 73.1812 },
  ADI:  { name: 'Ahmedabad Junction', lat: 23.0225, lng: 72.5714 },
  RTM:  { name: 'Ratlam Junction', lat: 23.3364, lng: 75.0374 },
  KOTA: { name: 'Kota Junction', lat: 25.2138, lng: 75.8648 },
  JP:   { name: 'Jaipur Junction', lat: 26.9196, lng: 75.7878 },

  // Southern & Andhra/Telangana/Karnataka/Tamil Nadu/Kerala
  SC:   { name: 'Secunderabad Junction', lat: 17.4344, lng: 78.5014 },
  HYB:  { name: 'Hyderabad Deccan', lat: 17.3924, lng: 78.4697 },
  KZJ:  { name: 'Kazipet Junction', lat: 17.9784, lng: 79.5161 },
  BZA:  { name: 'Vijayawada Junction', lat: 16.5186, lng: 80.6200 },
  GDR:  { name: 'Gudur Junction', lat: 14.1481, lng: 79.8492 },
  RU:   { name: 'Renigunta Junction', lat: 13.6500, lng: 79.5200 },
  MAS:  { name: 'MGR Chennai Central', lat: 13.0827, lng: 80.2707 },
  MS:   { name: 'Chennai Egmore', lat: 13.0797, lng: 80.2608 },
  KPD:  { name: 'Katpadi Junction', lat: 12.9700, lng: 79.1300 },
  JTJ:  { name: 'Jolarpettai Junction', lat: 12.5600, lng: 78.5800 },
  SBC:  { name: 'KSR Bengaluru City', lat: 12.9781, lng: 77.5694 },
  YPR:  { name: 'Yesvantpur Junction', lat: 13.0238, lng: 77.5503 },
  SMVB: { name: 'SMVT Bengaluru', lat: 13.0035, lng: 77.6534 },
  KJM:  { name: 'Krishnarajapuram', lat: 12.9982, lng: 77.6775 },
  BWT:  { name: 'Bangarapet', lat: 12.9900, lng: 78.2000 },
  CBE:  { name: 'Coimbatore Junction', lat: 11.0016, lng: 76.9628 },
  MDU:  { name: 'Madurai Junction', lat: 9.9252, lng: 78.1198 },
  ERS:  { name: 'Ernakulam Junction', lat: 9.9678, lng: 76.2906 },
  TVC:  { name: 'Thiruvananthapuram Central', lat: 8.4875, lng: 76.9525 },

  // Odisha / East Coast / Central
  PURI: { name: 'Puri', lat: 19.8076, lng: 85.8315 },
  BBS:  { name: 'Bhubaneswar', lat: 20.2668, lng: 85.8436 },
  CTC:  { name: 'Cuttack Junction', lat: 20.4625, lng: 85.8828 },
  VSKP: { name: 'Visakhapatnam', lat: 17.7214, lng: 83.2929 },
  R:    { name: 'Raipur Junction', lat: 21.2514, lng: 81.6296 },
  BSP:  { name: 'Bilaspur Junction', lat: 22.0797, lng: 82.1409 },
  VSG:  { name: 'Vasco-da-Gama', lat: 15.3976, lng: 73.8118 },
  MAO:  { name: 'Madgaon Junction', lat: 15.2736, lng: 73.9582 },
  BKN:  { name: 'Bikaner Junction', lat: 28.0229, lng: 73.3119 },
};

export function formatTime(timeStr?: string): string | undefined {
  if (!timeStr) return undefined;
  if (timeStr.includes('T')) {
    const timePart = timeStr.split('T')[1];
    return timePart ? timePart.slice(0, 5) : timeStr;
  }
  return timeStr.slice(0, 5);
}

// ─── Normalization Functions ──────────────────────────────────────────────────

export function normalizeRailRadarTrain(raw: any): Train {
  if (!raw) {
    throw new Error('RailRadar train payload is empty or invalid');
  }

  const d = raw.data?.train || raw.data || raw.train || raw;
  const number = String(d.number || d.trainNumber || raw.trainNumber || '').trim();
  const name = d.name || d.trainName || raw.trainName || `Train ${number}`;

  const src = d.source || d.origin || {};
  const dst = d.destination || {};
  const sourceCode = src.code || 'ORG';
  const destinationCode = dst.code || 'DST';

  return {
    id: number,
    number: number,
    name: name,
    origin: {
      id: sourceCode,
      code: src.code,
      name: STATION_COORDS[sourceCode]?.name || src.name || src.code || 'Origin Station',
    },
    destination: {
      id: destinationCode,
      code: dst.code,
      name: STATION_COORDS[destinationCode]?.name || dst.name || dst.code || 'Destination Station',
    },
  };
}

export function normalizeRailRadarLive(raw: any, routeCoordinates: [number, number][] = []): LiveJourney {
  if (!raw || (!raw.data && !raw.trainNumber && !raw.train)) {
    throw new Error('RailRadar live payload is empty or invalid');
  }

  const d = raw.data || raw;
  const trainNumber = String(d.trainNumber || d.train?.number || '').trim();
  const trainName = d.trainName || d.train?.name || `Train ${trainNumber}`;
  const routeArray = Array.isArray(d.route) ? d.route : [];
  const currentSequence = d.currentLocation?.sequence;
  const currentCode = d.currentLocation?.stationCode;
  const currentRouteIndex = routeArray.findIndex((stop: any) =>
    (typeof currentSequence === 'number' && stop.sequence === currentSequence) ||
    (currentCode && stop.stationCode === currentCode)
  );
  const currentRouteStop = currentRouteIndex >= 0 ? routeArray[currentRouteIndex] : undefined;
  const nextRouteStop = currentRouteIndex >= 0 ? routeArray[currentRouteIndex + 1] : undefined;

  let state: JourneyStatus = 'RUNNING';
  const rawStatus = String(d.status || '').toLowerCase();
  const delay = typeof d.delayMinutes === 'number' ? d.delayMinutes : (d.currentLocation?.delayMinutes ?? 0);

  if (rawStatus === 'not-started') {
    state = 'NOT_STARTED';
  } else if (rawStatus === 'completed' || rawStatus === 'arrived') {
    state = 'COMPLETED';
  } else if (delay > 5) {
    state = 'DELAYED';
  } else if (delay < -5) {
    state = 'EARLY';
  } else if (delay >= -5 && delay <= 5) {
    state = 'ON_TIME';
  }

  let distanceTravelledKm = d.currentLocation?.distanceFromOriginKm ?? d.distanceCoveredKm ?? currentRouteStop?.distance ?? 0;
  const segmentProgress = Number(d.currentLocation?.segmentProgress);
  if (
    Number.isFinite(segmentProgress) &&
    segmentProgress > 0 &&
    currentRouteStop &&
    nextRouteStop &&
    typeof currentRouteStop.distance === 'number' &&
    typeof nextRouteStop.distance === 'number'
  ) {
    const progress = Math.min(1, segmentProgress);
    distanceTravelledKm = currentRouteStop.distance + (nextRouteStop.distance - currentRouteStop.distance) * progress;
  }
  const lastRouteStop = routeArray.length > 0 ? routeArray[routeArray.length - 1] : undefined;
  const totalDistanceKm = d.train?.distance ?? d.totalDistanceKm ?? lastRouteStop?.distance ?? 0;
  const distanceRemainingKm = totalDistanceKm > distanceTravelledKm ? totalDistanceKm - distanceTravelledKm : 0;
  const completionPercent = totalDistanceKm > 0 ? Math.min(100, Math.round((distanceTravelledKm / totalDistanceKm) * 100)) : 0;

  // Compute live location coordinates accurately
  let location: { lat: number; lng: number } | undefined;
  if (typeof d.currentLocation?.lat === 'number' && typeof d.currentLocation?.lng === 'number' && d.currentLocation.lat !== 0) {
    location = { lat: d.currentLocation.lat, lng: d.currentLocation.lng };
  } else if (
    Number.isFinite(segmentProgress) &&
    currentRouteStop &&
    nextRouteStop &&
    typeof currentRouteStop.lat === 'number' &&
    typeof currentRouteStop.lng === 'number' &&
    typeof nextRouteStop.lat === 'number' &&
    typeof nextRouteStop.lng === 'number'
  ) {
    const progress = Math.min(1, Math.max(0, segmentProgress));
    location = {
      lat: currentRouteStop.lat + (nextRouteStop.lat - currentRouteStop.lat) * progress,
      lng: currentRouteStop.lng + (nextRouteStop.lng - currentRouteStop.lng) * progress,
    };
  } else if (typeof currentRouteStop?.lat === 'number' && typeof currentRouteStop?.lng === 'number') {
    location = { lat: currentRouteStop.lat, lng: currentRouteStop.lng };
  } else if (d.currentLocation?.stationCode && STATION_COORDS[d.currentLocation.stationCode]) {
    const coords = STATION_COORDS[d.currentLocation.stationCode];
    location = { lat: coords.lat, lng: coords.lng };
  } else if (routeCoordinates.length > 0 && totalDistanceKm > 0 && distanceTravelledKm > 0) {
    const ratio = Math.min(1, Math.max(0, distanceTravelledKm / totalDistanceKm));
    const coordIdx = Math.min(routeCoordinates.length - 1, Math.floor(ratio * (routeCoordinates.length - 1)));
    location = { lat: routeCoordinates[coordIdx][1], lng: routeCoordinates[coordIdx][0] };
  } else if (Array.isArray(d.route) && d.currentLocation?.sequence) {
    const currSeq = d.currentLocation.sequence;
    for (let offset = 0; offset <= 30; offset++) {
      const candidates = [
        d.route.find((s: any) => s.sequence === currSeq - offset),
        d.route.find((s: any) => s.sequence === currSeq + offset),
      ];
      for (const cand of candidates) {
        if (cand && cand.stationCode && STATION_COORDS[cand.stationCode]) {
          const coords = STATION_COORDS[cand.stationCode];
          location = { lat: coords.lat, lng: coords.lng };
          break;
        }
      }
      if (location) break;
    }
  }

  if (!location) {
    if (d.train?.source?.lat && d.train?.source?.lng && d.train.source.lat !== 0) {
      location = { lat: d.train.source.lat, lng: d.train.source.lng };
    } else if (d.train?.source?.code && STATION_COORDS[d.train.source.code]) {
      const coords = STATION_COORDS[d.train.source.code];
      location = { lat: coords.lat, lng: coords.lng };
    }
  }

  let currentStation: { id: string; code?: string; name: string } | undefined;
  if (d.currentLocation?.stationCode) {
    currentStation = {
      id: d.currentLocation.stationCode,
      code: d.currentLocation.stationCode,
      name: d.currentLocation.stationName || currentRouteStop?.stationName || d.currentLocation.stationCode,
    };
  }

  let nextStation: { id: string; code?: string; name: string } | undefined;
  if (d.nextHalt?.stationCode) {
    nextStation = {
      id: d.nextHalt.stationCode,
      code: d.nextHalt.stationCode,
      name: d.nextHalt.stationName || d.nextHalt.stationCode,
    };
  }

  let destination: { id: string; code?: string; name: string } | undefined;
  if (d.train?.destination?.code) {
    const destinationCode = d.train.destination.code;
    destination = {
      id: destinationCode,
      code: destinationCode,
      name: STATION_COORDS[destinationCode]?.name || d.train.destination.name || destinationCode,
    };
  }

  let eta: string | undefined;
  if (d.nextHalt?.scheduledArrival) {
    eta = `ETA ${formatTime(d.nextHalt.scheduledArrival)}`;
  } else if (lastRouteStop?.scheduledArrival) {
    eta = `Arrives ${formatTime(lastRouteStop.scheduledArrival)}`;
  }

  return {
    train: {
      id: trainNumber,
      number: trainNumber,
      name: trainName,
    },
    status: {
      state,
      delayMinutes: Math.max(0, delay),
    },
    location,
    currentStation,
    nextStation,
    destination,
    eta,
    distanceTravelledKm,
    distanceRemainingKm,
    totalDistanceKm,
    completionPercent,
    updatedAt: d.lastUpdatedAt || new Date().toISOString(),
  };
}

export function normalizeRailRadarStations(
  rawRoute: any[],
  routeCoordinates: [number, number][] = [],
  currentLocationSeq?: number
): Station[] {
  if (!Array.isArray(rawRoute) || rawRoute.length === 0) {
    return [];
  }

  const halts = rawRoute.filter((s: any) => s.isHalt === true);
  const stationsToMap = halts.length >= 2 ? halts : rawRoute;
  const totalStops = stationsToMap.length;

  return stationsToMap.map((s: any, idx: number) => {
    const code = s.stationCode || s.code || `STN_${idx + 1}`;
    const name = s.stationName || s.name || code;
    const knownCoords = STATION_COORDS[code];

    let lat = Number(s.lat ?? s.latitude ?? knownCoords?.lat ?? 0);
    let lng = Number(s.lng ?? s.longitude ?? knownCoords?.lng ?? 0);

    // If coordinates are missing, interpolate along route geometry coordinates
    if ((lat === 0 || lng === 0) && routeCoordinates.length > 0) {
      const coordIdx = Math.min(
        routeCoordinates.length - 1,
        Math.floor((idx / Math.max(1, totalStops - 1)) * (routeCoordinates.length - 1))
      );
      lng = routeCoordinates[coordIdx][0];
      lat = routeCoordinates[coordIdx][1];
    }

    let status: 'PASSED' | 'CURRENT' | 'UPCOMING' = 'UPCOMING';
    const sStatus = String(s.status || '').toLowerCase();
    const stSeq = s.sequence ?? idx + 1;

    if (sStatus === 'at-station' || sStatus === 'current') {
      status = 'CURRENT';
    } else if (sStatus === 'departed' || sStatus === 'passed') {
      status = 'PASSED';
    } else if (typeof currentLocationSeq === 'number') {
      if (stSeq < currentLocationSeq) {
        status = 'PASSED';
      } else if (stSeq === currentLocationSeq) {
        status = 'CURRENT';
      } else {
        status = 'UPCOMING';
      }
    }

    return {
      id: code,
      code,
      name,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      sequence: stSeq,
      scheduledArrival: formatTime(s.scheduledArrival),
      scheduledDeparture: formatTime(s.scheduledDeparture),
      actualArrival: formatTime(s.actualArrival),
      actualDeparture: formatTime(s.actualDeparture),
      estimatedArrival: formatTime(s.estimatedArrival),
      estimatedDeparture: formatTime(s.estimatedDeparture),
      delayMinutes: s.delayArrival ?? s.delayDeparture ?? 0,
      status,
    };
  });
}

export function normalizeRailRadarRoute(
  rawRouteGeoJson: any,
  stations: Station[],
  totalDistanceKm: number,
  trainNumber: string
): TrainRoute {
  let coordinates: [number, number][] = [];

  const geojson = rawRouteGeoJson?.data?.geojson || rawRouteGeoJson?.geojson;
  if (geojson?.geometry?.coordinates && Array.isArray(geojson.geometry.coordinates)) {
    coordinates = geojson.geometry.coordinates;
  }

  // Fallback: If GeoJSON coordinates are empty, build line from station coordinates
  if (coordinates.length === 0 && stations.length > 0) {
    coordinates = stations
      .filter(s => s.longitude !== 0 && s.latitude !== 0)
      .map(s => [s.longitude, s.latitude]);
  }

  return {
    id: `route_${trainNumber}`,
    trainId: trainNumber,
    geometry: {
      type: 'LineString',
      coordinates,
    },
    stations,
    distanceKm: totalDistanceKm || 0,
  };
}
