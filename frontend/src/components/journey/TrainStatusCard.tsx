import { useState } from 'react';
import { DelayBadge } from './DelayBadge';
import { JourneyProgress } from './JourneyProgress';
import { LastUpdated } from './LastUpdated';
import { DistanceMetric } from './DistanceMetric';
import { IconButton } from '../ui/IconButton';
import { ShareJourneyModal } from './ShareJourneyModal';
import { useUIStore } from '../../stores/uiStore';
import type { LiveJourney } from '../../types';

interface TrainStatusCardProps {
  journey: LiveJourney;
  onToggleFollow?: () => void;
  isFollowing?: boolean;
}

export function TrainStatusCard({ journey, onToggleFollow, isFollowing }: TrainStatusCardProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const { isFavourite, addFavourite, removeFavourite } = useUIStore();
  const fav = isFavourite(journey.train.id);

  const handleFavClick = () => {
    if (fav) {
      removeFavourite(journey.train.id);
    } else {
      addFavourite({
        id: journey.train.id,
        number: journey.train.number,
        name: journey.train.name,
        origin: journey.currentStation || { id: 'origin', name: 'Origin' },
        destination: journey.destination || { id: 'dest', name: 'Destination' },
      });
    }
  };

  return (
    <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-[var(--radius-panel)] p-5 shadow-[var(--shadow-panel)] space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-[var(--text-primary)] leading-tight">
              {journey.train.name}
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[var(--surface)] border border-[var(--border)] rounded-md text-[var(--text-secondary)]">
              {journey.train.number}
            </span>
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">
            {journey.currentStation?.name} → {journey.destination?.name}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <IconButton
            icon={<span>{fav ? '★' : '☆'}</span>}
            aria-label={fav ? 'Remove favourite' : 'Add favourite'}
            variant="ghost"
            size="sm"
            className={fav ? 'text-yellow-500' : 'text-[var(--text-tertiary)]'}
            onClick={handleFavClick}
          />
          <IconButton
            icon={<span>🔗</span>}
            aria-label="Share journey"
            variant="ghost"
            size="sm"
            onClick={() => setShareOpen(true)}
          />
          {onToggleFollow && (
            <IconButton
              icon={<span>◎</span>}
              aria-label={isFollowing ? 'Following train' : 'Follow train'}
              variant={isFollowing ? 'primary' : 'secondary'}
              size="sm"
              onClick={onToggleFollow}
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <DelayBadge status={journey.status.state} delayMinutes={journey.status.delayMinutes} />
        <LastUpdated updatedAt={journey.updatedAt} />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3 bg-[var(--surface)] rounded-[var(--radius-card)]">
          <div className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold tracking-wider">Current Station</div>
          <div className="font-bold text-sm text-[var(--text-primary)] truncate mt-0.5">
            {journey.currentStation?.name || 'In Transit'}
          </div>
        </div>
        <div className="p-3 bg-[var(--surface)] rounded-[var(--radius-card)]">
          <div className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold tracking-wider">Next Station</div>
          <div className="font-bold text-sm text-[var(--accent)] truncate mt-0.5">
            {journey.nextStation?.name || '--'}
          </div>
        </div>
      </div>

      <JourneyProgress percent={journey.completionPercent ?? 50} />
      <DistanceMetric
        travelledKm={journey.distanceTravelledKm}
        remainingKm={journey.distanceRemainingKm}
        totalKm={journey.totalDistanceKm}
      />

      <ShareJourneyModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        trainId={journey.train.id}
        trainName={journey.train.name}
      />
    </div>
  );
}
