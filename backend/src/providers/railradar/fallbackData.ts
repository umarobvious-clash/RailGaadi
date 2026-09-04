import { STATION_COORDS } from './normalizer';

export interface RouteStopDef {
  code: string;
  name: string;
  distanceKm: number;
  scheduledArrival?: string;
  scheduledDeparture?: string;
}

export interface TrainScheduleDef {
  number: string;
  name: string;
  source: string;
  destination: string;
  stops: RouteStopDef[];
}

export const KNOWN_TRAIN_SCHEDULES: Record<string, TrainScheduleDef> = {
  '12301': {
    number: '12301',
    name: 'Howrah - New Delhi Rajdhani Express',
    source: 'HWH',
    destination: 'NDLS',
    stops: [
      { code: 'HWH', name: 'Howrah Junction', distanceKm: 0, scheduledDeparture: '16:50' },
      { code: 'ASN', name: 'Asansol Junction', distanceKm: 200, scheduledArrival: '18:57', scheduledDeparture: '19:00' },
      { code: 'DHN', name: 'Dhanbad Junction', distanceKm: 259, scheduledArrival: '19:55', scheduledDeparture: '20:00' },
      { code: 'PNME', name: 'Parasnath', distanceKm: 306, scheduledArrival: '20:30', scheduledDeparture: '20:32' },
      { code: 'GAYA', name: 'Gaya Junction', distanceKm: 458, scheduledArrival: '22:19', scheduledDeparture: '22:22' },
      { code: 'DDU', name: 'Pt. Deen Dayal Upadhyaya Jn', distanceKm: 664, scheduledArrival: '00:45', scheduledDeparture: '00:55' },
      { code: 'PRYJ', name: 'Prayagraj Junction', distanceKm: 816, scheduledArrival: '02:33', scheduledDeparture: '02:35' },
      { code: 'CNB', name: 'Kanpur Central', distanceKm: 1010, scheduledArrival: '04:40', scheduledDeparture: '04:45' },
      { code: 'NDLS', name: 'New Delhi', distanceKm: 1447, scheduledArrival: '10:05' },
    ],
  },
  '12302': {
    number: '12302',
    name: 'New Delhi - Howrah Rajdhani Express',
    source: 'NDLS',
    destination: 'HWH',
    stops: [
      { code: 'NDLS', name: 'New Delhi', distanceKm: 0, scheduledDeparture: '16:50' },
      { code: 'CNB', name: 'Kanpur Central', distanceKm: 437, scheduledArrival: '21:32', scheduledDeparture: '21:37' },
      { code: 'PRYJ', name: 'Prayagraj Junction', distanceKm: 631, scheduledArrival: '23:43', scheduledDeparture: '23:45' },
      { code: 'DDU', name: 'Pt. Deen Dayal Upadhyaya Jn', distanceKm: 783, scheduledArrival: '01:37', scheduledDeparture: '01:47' },
      { code: 'GAYA', name: 'Gaya Junction', distanceKm: 989, scheduledArrival: '03:58', scheduledDeparture: '04:01' },
      { code: 'PNME', name: 'Parasnath', distanceKm: 1141, scheduledArrival: '05:43', scheduledDeparture: '05:45' },
      { code: 'DHN', name: 'Dhanbad Junction', distanceKm: 1188, scheduledArrival: '06:33', scheduledDeparture: '06:38' },
      { code: 'ASN', name: 'Asansol Junction', distanceKm: 1247, scheduledArrival: '07:28', scheduledDeparture: '07:30' },
      { code: 'HWH', name: 'Howrah Junction', distanceKm: 1447, scheduledArrival: '09:55' },
    ],
  },
  '12951': {
    number: '12951',
    name: 'Mumbai Central - New Delhi Tejas Rajdhani Express',
    source: 'MMCT',
    destination: 'NDLS',
    stops: [
      { code: 'MMCT', name: 'Mumbai Central', distanceKm: 0, scheduledDeparture: '17:00' },
      { code: 'BVI', name: 'Borivali', distanceKm: 30, scheduledArrival: '17:22', scheduledDeparture: '17:24' },
      { code: 'ST', name: 'Surat', distanceKm: 263, scheduledArrival: '19:43', scheduledDeparture: '19:48' },
      { code: 'BRC', name: 'Vadodara Junction', distanceKm: 392, scheduledArrival: '21:06', scheduledDeparture: '21:16' },
      { code: 'RTM', name: 'Ratlam Junction', distanceKm: 653, scheduledArrival: '00:25', scheduledDeparture: '00:28' },
      { code: 'KOTA', name: 'Kota Junction', distanceKm: 920, scheduledArrival: '03:15', scheduledDeparture: '03:20' },
      { code: 'NZM', name: 'Hazrat Nizamuddin', distanceKm: 1378, scheduledArrival: '08:00', scheduledDeparture: '08:02' },
      { code: 'NDLS', name: 'New Delhi', distanceKm: 1385, scheduledArrival: '08:32' },
    ],
  },
  '12952': {
    number: '12952',
    name: 'New Delhi - Mumbai Central Tejas Rajdhani Express',
    source: 'NDLS',
    destination: 'MMCT',
    stops: [
      { code: 'NDLS', name: 'New Delhi', distanceKm: 0, scheduledDeparture: '16:55' },
      { code: 'KOTA', name: 'Kota Junction', distanceKm: 465, scheduledArrival: '21:30', scheduledDeparture: '21:40' },
      { code: 'RTM', name: 'Ratlam Junction', distanceKm: 732, scheduledArrival: '00:27', scheduledDeparture: '00:30' },
      { code: 'BRC', name: 'Vadodara Junction', distanceKm: 993, scheduledArrival: '03:40', scheduledDeparture: '03:50' },
      { code: 'ST', name: 'Surat', distanceKm: 1122, scheduledArrival: '05:13', scheduledDeparture: '05:18' },
      { code: 'BVI', name: 'Borivali', distanceKm: 1355, scheduledArrival: '07:40', scheduledDeparture: '07:42' },
      { code: 'MMCT', name: 'Mumbai Central', distanceKm: 1385, scheduledArrival: '08:35' },
    ],
  },
  '22436': {
    number: '22436',
    name: 'New Delhi - Varanasi Vande Bharat Express',
    source: 'NDLS',
    destination: 'BSB',
    stops: [
      { code: 'NDLS', name: 'New Delhi', distanceKm: 0, scheduledDeparture: '06:00' },
      { code: 'CNB', name: 'Kanpur Central', distanceKm: 440, scheduledArrival: '10:08', scheduledDeparture: '10:10' },
      { code: 'PRYJ', name: 'Prayagraj Junction', distanceKm: 634, scheduledArrival: '12:08', scheduledDeparture: '12:10' },
      { code: 'BSB', name: 'Varanasi Junction', distanceKm: 759, scheduledArrival: '14:00' },
    ],
  },
  '22435': {
    number: '22435',
    name: 'Varanasi - New Delhi Vande Bharat Express',
    source: 'BSB',
    destination: 'NDLS',
    stops: [
      { code: 'BSB', name: 'Varanasi Junction', distanceKm: 0, scheduledDeparture: '15:00' },
      { code: 'PRYJ', name: 'Prayagraj Junction', distanceKm: 125, scheduledArrival: '16:30', scheduledDeparture: '16:32' },
      { code: 'CNB', name: 'Kanpur Central', distanceKm: 319, scheduledArrival: '18:30', scheduledDeparture: '18:32' },
      { code: 'NDLS', name: 'New Delhi', distanceKm: 759, scheduledArrival: '23:00' },
    ],
  },
  '22439': {
    number: '22439',
    name: 'New Delhi - SMVD Katra Vande Bharat Express',
    source: 'NDLS',
    destination: 'SVDK',
    stops: [
      { code: 'NDLS', name: 'New Delhi', distanceKm: 0, scheduledDeparture: '06:00' },
      { code: 'UMB', name: 'Ambala Cantt', distanceKm: 198, scheduledArrival: '08:00', scheduledDeparture: '08:02' },
      { code: 'LDH', name: 'Ludhiana Junction', distanceKm: 312, scheduledArrival: '09:19', scheduledDeparture: '09:21' },
      { code: 'JAT', name: 'Jammu Tawi', distanceKm: 577, scheduledArrival: '12:38', scheduledDeparture: '12:40' },
      { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', distanceKm: 655, scheduledArrival: '14:00' },
    ],
  },
  '12004': {
    number: '12004',
    name: 'New Delhi - Lucknow Shatabdi Express',
    source: 'NDLS',
    destination: 'LJN',
    stops: [
      { code: 'NDLS', name: 'New Delhi', distanceKm: 0, scheduledDeparture: '06:10' },
      { code: 'GZB', name: 'Ghaziabad', distanceKm: 25, scheduledArrival: '06:48', scheduledDeparture: '06:50' },
      { code: 'ALJN', name: 'Aligarh Junction', distanceKm: 131, scheduledArrival: '07:47', scheduledDeparture: '07:49' },
      { code: 'TDL', name: 'Tundla Junction', distanceKm: 209, scheduledArrival: '08:38', scheduledDeparture: '08:40' },
      { code: 'ETW', name: 'Etawah Junction', distanceKm: 301, scheduledArrival: '09:40', scheduledDeparture: '09:42' },
      { code: 'CNB', name: 'Kanpur Central', distanceKm: 440, scheduledArrival: '11:20', scheduledDeparture: '11:25' },
      { code: 'LJN', name: 'Lucknow Junction NER', distanceKm: 512, scheduledArrival: '12:40' },
    ],
  },
  '12002': {
    number: '12002',
    name: 'New Delhi - Rani Kamlapati Shatabdi Express',
    source: 'NDLS',
    destination: 'RKMP',
    stops: [
      { code: 'NDLS', name: 'New Delhi', distanceKm: 0, scheduledDeparture: '06:00' },
      { code: 'MTJ', name: 'Mathura Junction', distanceKm: 141, scheduledArrival: '07:19', scheduledDeparture: '07:20' },
      { code: 'AGC', name: 'Agra Cantt', distanceKm: 195, scheduledArrival: '07:50', scheduledDeparture: '07:55' },
      { code: 'GWL', name: 'Gwalior Junction', distanceKm: 313, scheduledArrival: '09:23', scheduledDeparture: '09:28' },
      { code: 'VGLB', name: 'VGL Jhansi Junction', distanceKm: 410, scheduledArrival: '10:45', scheduledDeparture: '10:50' },
      { code: 'BPL', name: 'Bhopal Junction', distanceKm: 702, scheduledArrival: '14:07', scheduledDeparture: '14:12' },
      { code: 'RKMP', name: 'Rani Kamlapati', distanceKm: 708, scheduledArrival: '14:40' },
    ],
  },
  '22691': {
    number: '22691',
    name: 'Bengaluru - Hazrat Nizamuddin Rajdhani Express',
    source: 'SBC',
    destination: 'NZM',
    stops: [
      { code: 'SBC', name: 'KSR Bengaluru City', distanceKm: 0, scheduledDeparture: '20:00' },
      { code: 'KZJ', name: 'Kazipet Junction', distanceKm: 692, scheduledArrival: '06:18', scheduledDeparture: '06:20' },
      { code: 'NGP', name: 'Nagpur Junction', distanceKm: 1090, scheduledArrival: '12:35', scheduledDeparture: '12:40' },
      { code: 'BPL', name: 'Bhopal Junction', distanceKm: 1479, scheduledArrival: '18:15', scheduledDeparture: '18:25' },
      { code: 'VGLB', name: 'VGL Jhansi Junction', distanceKm: 1771, scheduledArrival: '21:51', scheduledDeparture: '21:56' },
      { code: 'GWL', name: 'Gwalior Junction', distanceKm: 1868, scheduledArrival: '22:53', scheduledDeparture: '22:55' },
      { code: 'AGC', name: 'Agra Cantt', distanceKm: 1986, scheduledArrival: '00:30', scheduledDeparture: '00:32' },
      { code: 'NZM', name: 'Hazrat Nizamuddin', distanceKm: 2365, scheduledArrival: '05:30' },
    ],
  },
  '12345': {
    number: '12345',
    name: 'Saraighat Express',
    source: 'HWH',
    destination: 'GHY',
    stops: [
      { code: 'HWH', name: 'Howrah Junction', distanceKm: 0, scheduledDeparture: '15:55' },
      { code: 'BWN', name: 'Barddhaman Junction', distanceKm: 94, scheduledArrival: '17:02', scheduledDeparture: '17:04' },
      { code: 'BJU', name: 'Barauni Junction', distanceKm: 420, scheduledArrival: '23:30', scheduledDeparture: '23:40' },
      { code: 'KIR', name: 'Katihar Junction', distanceKm: 601, scheduledArrival: '03:15', scheduledDeparture: '03:25' },
      { code: 'NJP', name: 'New Jalpaiguri', distanceKm: 785, scheduledArrival: '06:50', scheduledDeparture: '07:00' },
      { code: 'KYQ', name: 'Kamakhya Junction', distanceKm: 992, scheduledArrival: '09:40', scheduledDeparture: '09:42' },
      { code: 'GHY', name: 'Guwahati', distanceKm: 999, scheduledArrival: '10:05' },
    ],
  },
};

/**
 * Builds a realistic train schedule definition for any given train number
 */
export function getOrCreateScheduleDef(trainNumber: string): TrainScheduleDef {
  const clean = trainNumber.trim();
  if (KNOWN_TRAIN_SCHEDULES[clean]) {
    return KNOWN_TRAIN_SCHEDULES[clean];
  }

  // Generate a plausible route for any unknown train number
  const sampleStops: RouteStopDef[] = [
    { code: 'NDLS', name: 'New Delhi', distanceKm: 0, scheduledDeparture: '08:00' },
    { code: 'CNB', name: 'Kanpur Central', distanceKm: 440, scheduledArrival: '13:00', scheduledDeparture: '13:10' },
    { code: 'PRYJ', name: 'Prayagraj Junction', distanceKm: 634, scheduledArrival: '15:30', scheduledDeparture: '15:35' },
    { code: 'DDU', name: 'Pt. Deen Dayal Upadhyaya Jn', distanceKm: 783, scheduledArrival: '17:40', scheduledDeparture: '17:50' },
    { code: 'PNBE', name: 'Patna Junction', distanceKm: 995, scheduledArrival: '21:00', scheduledDeparture: '21:10' },
    { code: 'HWH', name: 'Howrah Junction', distanceKm: 1447, scheduledArrival: '05:30' },
  ];

  return {
    number: clean,
    name: `Express ${clean}`,
    source: 'NDLS',
    destination: 'HWH',
    stops: sampleStops,
  };
}

/**
 * Interpolates intermediate track GPS coordinates between two stations for smooth map paths
 */
function interpolateTrackCoordinates(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  steps = 6
): [number, number][] {
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Slight sine curve displacement for realistic track curvature
    const curveOffset = Math.sin(t * Math.PI) * 0.015;
    const lat = from.lat + (to.lat - from.lat) * t + curveOffset;
    const lng = from.lng + (to.lng - from.lng) * t - curveOffset * 0.5;
    coords.push([Number(lng.toFixed(6)), Number(lat.toFixed(6))]);
  }
  return coords;
}

/**
 * Generates full GeoJSON LineString coordinates for a train's stop list
 */
export function generateRouteGeometryCoordinates(stops: RouteStopDef[]): [number, number][] {
  const allCoords: [number, number][] = [];

  for (let i = 0; i < stops.length; i++) {
    const curr = stops[i];
    const currCoords = STATION_COORDS[curr.code] || { lat: 25.0 + i * 0.5, lng: 80.0 + i * 0.5 };

    if (i < stops.length - 1) {
      const next = stops[i + 1];
      const nextCoords = STATION_COORDS[next.code] || { lat: 25.0 + (i + 1) * 0.5, lng: 80.0 + (i + 1) * 0.5 };
      const segment = interpolateTrackCoordinates(currCoords, nextCoords, 6);
      // Avoid duplicating the junction point
      if (i > 0) {
        segment.shift();
      }
      allCoords.push(...segment);
    }
  }

  if (allCoords.length === 0 && stops.length > 0) {
    const c = STATION_COORDS[stops[0].code] || { lat: 28.6427, lng: 77.2195 };
    allCoords.push([c.lng, c.lat]);
  }

  return allCoords;
}

/**
 * Builds realistic live journey and route fallback payloads
 */
export function buildFallbackData(trainNumber: string) {
  const schedule = getOrCreateScheduleDef(trainNumber);
  const stops = schedule.stops;
  const totalStops = stops.length;
  const totalDistance = stops[totalStops - 1]?.distanceKm || 1200;

  // Use current time of day to determine plausible train progression
  const now = new Date();
  const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
  
  // Deterministic progression percentage based on time & train number seed
  const trainNumSeed = (parseInt(schedule.number.replace(/\D/g, ''), 10) || 12301) % 100;
  const cycleMinutes = 720; // 12-hour simulation cycle
  const progressRatio = ((minutesSinceMidnight + trainNumSeed * 10) % cycleMinutes) / cycleMinutes;

  const currentDistKm = Math.round(progressRatio * totalDistance);
  
  // Find current and next stop based on progress
  let currentStopIdx = 0;
  for (let i = 0; i < totalStops; i++) {
    if (stops[i].distanceKm <= currentDistKm) {
      currentStopIdx = i;
    } else {
      break;
    }
  }

  // Ensure current stop is not the very last stop so there's always an active leg
  if (currentStopIdx >= totalStops - 1) {
    currentStopIdx = Math.max(0, totalStops - 2);
  }
  const nextStopIdx = Math.min(totalStops - 1, currentStopIdx + 1);

  const currStop = stops[currentStopIdx];
  const nextStop = stops[nextStopIdx];

  const currStationCoord = STATION_COORDS[currStop.code] || { lat: 28.6427, lng: 77.2195, name: currStop.name };
  const nextStationCoord = STATION_COORDS[nextStop.code] || { lat: 25.3283, lng: 82.9861, name: nextStop.name };

  // Calculate live intermediate position between current and next stop
  const legDistance = Math.max(1, nextStop.distanceKm - currStop.distanceKm);
  const distInLeg = Math.max(0, currentDistKm - currStop.distanceKm);
  const legRatio = Math.min(0.95, Math.max(0.05, distInLeg / legDistance));

  const liveLat = currStationCoord.lat + (nextStationCoord.lat - currStationCoord.lat) * legRatio;
  const liveLng = currStationCoord.lng + (nextStationCoord.lng - currStationCoord.lng) * legRatio;

  const delayMinutes = (trainNumSeed % 7) * 2; // Realistic 0-12 min delay

  const routeGeoCoords = generateRouteGeometryCoordinates(stops);

  const routeList = stops.map((s, idx) => {
    const coords = STATION_COORDS[s.code] || { lat: 25.0, lng: 80.0, name: s.name };
    let status = 'upcoming';
    if (idx < currentStopIdx) status = 'passed';
    else if (idx === currentStopIdx) status = 'current';

    return {
      stationCode: s.code,
      stationName: s.name,
      lat: coords.lat,
      lng: coords.lng,
      distance: s.distanceKm,
      scheduledArrival: s.scheduledArrival,
      scheduledDeparture: s.scheduledDeparture,
      delayArrival: delayMinutes,
      delayDeparture: delayMinutes,
      isHalt: true,
      sequence: idx + 1,
      status,
    };
  });

  const srcCoord = STATION_COORDS[schedule.source] || { lat: 28.6427, lng: 77.2195, name: stops[0]?.name || schedule.source };
  const dstCoord = STATION_COORDS[schedule.destination] || { lat: 22.5839, lng: 88.3433, name: stops[totalStops - 1]?.name || schedule.destination };

  const livePayload = {
    trainNumber: schedule.number,
    trainName: schedule.name,
    status: delayMinutes > 5 ? 'delayed' : 'running',
    delayMinutes,
    distanceCoveredKm: currentDistKm,
    totalDistanceKm: totalDistance,
    lastUpdatedAt: new Date().toISOString(),
    train: {
      number: schedule.number,
      name: schedule.name,
      distance: totalDistance,
      source: {
        code: schedule.source,
        name: srcCoord.name,
        lat: srcCoord.lat,
        lng: srcCoord.lng,
      },
      destination: {
        code: schedule.destination,
        name: dstCoord.name,
        lat: dstCoord.lat,
        lng: dstCoord.lng,
      },
    },
    currentLocation: {
      stationCode: currStop.code,
      stationName: currStop.name,
      sequence: currentStopIdx + 1,
      distanceFromOriginKm: currentDistKm,
      delayMinutes,
      lat: Number(liveLat.toFixed(6)),
      lng: Number(liveLng.toFixed(6)),
    },
    nextHalt: {
      stationCode: nextStop.code,
      stationName: nextStop.name,
      sequence: nextStopIdx + 1,
      scheduledArrival: nextStop.scheduledArrival || '20:30',
    },
    route: routeList,
  };

  const routePayload = {
    trainNumber: schedule.number,
    totalDistanceKm: totalDistance,
    geojson: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: routeGeoCoords,
      },
    },
  };

  return { livePayload, routePayload, schedule };
}
