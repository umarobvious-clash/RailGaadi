import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSharedJourney } from '../services/train.api';
import { TrainStatusCard } from '../components/journey/TrainStatusCard';
import { StationTimeline } from '../components/journey/StationTimeline';
import { JourneyMap } from '../components/map/JourneyMap';
import { Drawer } from '../components/ui/Drawer';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';

export default function SharedJourneyPage() {
  const { shareId = '' } = useParams<{ shareId: string }>();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['share', shareId],
    queryFn: () => getSharedJourney(shareId),
    enabled: Boolean(shareId),
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8 bg-[var(--background)]">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-40 w-full rounded-[var(--radius-panel)]" />
          <Skeleton className="h-64 w-full rounded-[var(--radius-card)]" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <ErrorState
          title="Shared link expired or invalid"
          description="This shared tracking link could not be found or has expired."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const { journey, route } = data;

  const sidebarContent = (
    <div className="space-y-4 pb-10">
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-[var(--radius-card)] text-xs text-emerald-700 flex items-center justify-between">
        <span>🔒 Viewing Shared Read-Only Journey</span>
        <Link to={`/journey/${journey.train.id}`} className="font-bold underline text-[var(--accent)]">
          Open Full
        </Link>
      </div>
      <TrainStatusCard journey={journey} />
      <StationTimeline stations={route.stations} currentStationId={journey.currentStation?.id} />
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-[var(--background)] overflow-hidden">
      <div className="hidden md:block w-[420px] lg:w-[460px] h-full p-5 overflow-y-auto border-r border-[var(--border)] shrink-0 bg-[var(--surface-elevated)]">
        {sidebarContent}
      </div>
      <div className="flex-1 h-full relative">
        <JourneyMap route={route} liveJourney={journey} />
      </div>
      <Drawer>{sidebarContent}</Drawer>
    </div>
  );
}
