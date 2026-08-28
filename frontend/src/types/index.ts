export interface Train {
  id: string;
  number: string;
  name: string;
  origin: { id: string; code?: string; name: string };
  destination: { id: string; code?: string; name: string };
}

export type JourneyStatus = 'ON_TIME' | 'DELAYED' | 'EARLY' | 'NOT_STARTED' | 'RUNNING' | 'COMPLETED' | 'STALE' | 'UNKNOWN';

export interface TrainPosition {
  latitude: number;
  longitude: number;
  recordedAt: string;
  accuracyMeters?: number;
  heading?: number;
  speedKmph?: number;
}

export interface LiveJourney {
  train: { id: string; number: string; name: string };
  status: { state: JourneyStatus; delayMinutes?: number };
  location?: { lat: number; lng: number };
  currentStation?: { id: string; code?: string; name: string };
  nextStation?: { id: string; code?: string; name: string };
  destination?: { id: string; code?: string; name: string };
  eta?: string;
  distanceTravelledKm?: number;
  distanceRemainingKm?: number;
  totalDistanceKm?: number;
  completionPercent?: number;
  updatedAt: string;
}

export interface Station {
  id: string;
  code?: string;
  name: string;
  latitude: number;
  longitude: number;
  sequence?: number;
  scheduledArrival?: string;
  scheduledDeparture?: string;
  actualArrival?: string;
  actualDeparture?: string;
  estimatedArrival?: string;
  estimatedDeparture?: string;
  delayMinutes?: number;
  status?: 'PASSED' | 'CURRENT' | 'UPCOMING';
}

export interface TrainRoute {
  id: string;
  trainId: string;
  geometry: GeoJSONLineString;
  stations: Station[];
  distanceKm: number;
}

export interface GeoJSONLineString {
  type: 'LineString';
  coordinates: [number, number][];
}

export interface WeatherSnapshot {
  locationName?: string;
  temperatureC: number;
  condition?: string;
  humidityPercent?: number;
  windKph?: number;
  rainProbability?: number;
  observedAt: string;
}

export interface JourneyWeather {
  current?: WeatherSnapshot;
  next?: WeatherSnapshot;
  destination?: WeatherSnapshot;
  route?: WeatherSnapshot[];
}

export interface ElevationPoint {
  distanceKm: number;
  elevationMeters: number;
}

export interface RouteElevation {
  points: ElevationPoint[];
  highest: {
    distanceKm: number;
    elevationMeters: number;
  };
}

export interface GeographicFeature {
  id: string;
  type: 'water' | 'terrain' | 'infrastructure' | 'place';
  category: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  distanceFromRouteKm?: number;
  distanceFromTrainKm?: number;
}

export interface SearchResult {
  data: Train[];
  meta: { query: string };
}

export interface ApiErrorResponse {
  error: { code: string; message: string; requestId: string };
}

