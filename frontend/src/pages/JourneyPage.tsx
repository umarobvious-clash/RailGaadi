import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLiveTrain } from '../hooks/useLiveTrain';
import { useTrainRoute } from '../hooks/useTrainRoute';
import { useJourneyWeather } from '../hooks/useJourneyWeather';
import { useRouteElevation } from '../hooks/useRouteElevation';
import { useNearbyFeatures } from '../hooks/useNearbyFeatures';
import { TrainStatusCard } from '../components/journey/TrainStatusCard';
import { StationTimeline } from '../components/journey/StationTimeline';
import { JourneyMap } from '../components/map/JourneyMap';
import { AnalyticsGrid } from '../components/analytics/AnalyticsGrid';
import { ElevationChart } from '../components/analytics/ElevationChart';
import { RouteWeather } from '../components/travel/RouteWeather';
import { FeatureList } from '../components/travel/FeatureList';
import { Drawer } from '../components/ui/Drawer';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';

export default function JourneyPage() {
  const { trainId = '12345' } = useParams<{ trainId: string }>();
  const [activeTab, setActiveTab] = useState<'timeline' | 'analytics' | 'weather' | 'places'>('timeline');

  const { data: liveJourney, isLoading: liveLoading, error: liveError, refetch: refetchLive } = useLiveTrain(trainId);
  const { data: route, isLoading: routeLoading, error: routeError, refetch: refetchRoute } = useTrainRoute(trainId);
  const { data: weather, isLoading: weatherLoading } = useJourneyWeather(trainId);
  const { data: elevation } = useRouteElevation(trainId);
  const { data: features = [] } = useNearbyFeatures(trainId);

  if (liveLoading || routeLoading) {
    return (
      <div className="flex flex-col md:flex-row h-full w-full bg-[var(--background)]">
        <div className="w-full md:w-[420px] lg:w-[480px] p-6 space-y-4 shrink-0 overflow-y-auto border-r border-[var(--border)]">
          <Skeleton className="h-40 w-full rounded-[var(--radius-panel)]" />
          <Skeleton className="h-28 w-full rounded-[var(--radius-card)]" />
          <Skeleton className="h-64 w-full rounded-[var(--radius-card)]" />
        </div>
        <div className="flex-1 bg-[#1a1a2e] flex items-center justify-center text-white/50 text-sm font-mono">
          Loading real-time track and satellite data...
        </div>
      </div>
    );
  }

  if (liveError || routeError || !liveJourney || !route) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <ErrorState
          title="Journey data unavailable"
          description="Could not load real-time status or route geometry for this train."
          onRetry={() => { refetchLive(); refetchRoute(); }}
        />
      </div>
    );
  }

  const sidebarContent = (
    <div className="space-y-5 pb-12">
      <TrainStatusCard journey={liveJourney} />

      <div className="flex border-b border-[var(--border)] gap-2 text-xs font-semibold">
        {[
          { id: 'timeline', label: 'Stations' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'weather', label: 'Weather' },
          { id: 'places', label: 'Highlights' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2 px-1 transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'timeline' && (
        <StationTimeline stations={route.stations} currentStationId={liveJourney.currentStation?.id} />
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <AnalyticsGrid journey={liveJourney} elevation={elevation} />
          {elevation && (
            <ElevationChart elevation={elevation} travelledKm={liveJourney.distanceTravelledKm} />
          )}
        </div>
      )}

      {activeTab === 'weather' && (
        <RouteWeather weather={weather} isLoading={weatherLoading} />
      )}

      {activeTab === 'places' && (
        <FeatureList features={features} />
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-[var(--background)] overflow-hidden">
      <div className="hidden md:block w-[420px] lg:w-[460px] h-full p-5 overflow-y-auto border-r border-[var(--border)] shrink-0 bg-[var(--surface-elevated)]">
        {sidebarContent}
      </div>

      <div className="flex-1 h-full relative">
        <JourneyMap route={route} liveJourney={liveJourney} features={features} />
      </div>

      <Drawer>
        {sidebarContent}
      </Drawer>
    </div>
  );
}
