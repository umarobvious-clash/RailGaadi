import { fetchApi } from './api';
import type { Train, LiveJourney, TrainRoute, Station, JourneyWeather, RouteElevation, GeographicFeature, SearchResult } from '../types';

export async function searchTrains(query: string): Promise<Train[]> {
  const res = await fetchApi<SearchResult>(`/trains/search?q=${encodeURIComponent(query)}`);
  return res.data || [];
}

export async function getLiveTrain(trainId: string): Promise<LiveJourney> {
  const res = await fetchApi<{ data: LiveJourney }>(`/trains/${trainId}/live`);
  return res.data;
}

export async function getTrainRoute(trainId: string): Promise<TrainRoute> {
  const res = await fetchApi<{ data: TrainRoute }>(`/trains/${trainId}/route`);
  return res.data;
}

export async function getTrainStations(trainId: string): Promise<Station[]> {
  const res = await fetchApi<{ data: Station[] }>(`/trains/${trainId}/stations`);
  return res.data;
}

export async function getJourneyWeather(trainId: string): Promise<JourneyWeather> {
  const res = await fetchApi<{ data: JourneyWeather }>(`/journeys/${trainId}/weather`);
  return res.data;
}

export async function getRouteElevation(routeId: string): Promise<RouteElevation> {
  const res = await fetchApi<{ data: RouteElevation }>(`/routes/${routeId}/elevation`);
  return res.data;
}

export async function getNearbyFeatures(trainId: string): Promise<GeographicFeature[]> {
  const res = await fetchApi<{ data: GeographicFeature[] }>(`/geo/features?trainId=${trainId}`);
  return res.data || [];
}

export async function createShareLink(trainId: string): Promise<{ shareId: string; url: string }> {
  const res = await fetchApi<{ data: { shareId: string; url: string } }>('/shares', {
    method: 'POST',
    body: JSON.stringify({ trainId }),
  });
  return res.data;
}

export async function getSharedJourney(shareId: string): Promise<{ shareId: string; sharedAt: string; journey: LiveJourney; route: TrainRoute }> {
  const res = await fetchApi<{ data: { shareId: string; sharedAt: string; journey: LiveJourney; route: TrainRoute } }>(`/shares/${shareId}`);
  return res.data;
}
