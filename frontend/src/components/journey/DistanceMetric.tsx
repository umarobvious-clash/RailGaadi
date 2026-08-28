import { formatDistance } from '../../utils/journey';

interface DistanceMetricProps {
  travelledKm?: number;
  remainingKm?: number;
  totalKm?: number;
  className?: string;
}

export function DistanceMetric({ travelledKm, remainingKm, totalKm, className = '' }: DistanceMetricProps) {
  return (
    <div className={`grid grid-cols-3 gap-2 text-center p-3 bg-[var(--surface)] rounded-[var(--radius-card)] ${className}`}>
      <div>
        <div className="text-[10px] uppercase font-semibold text-[var(--text-tertiary)]">Covered</div>
        <div className="text-sm font-bold text-[var(--text-primary)] font-mono">{formatDistance(travelledKm)}</div>
      </div>
      <div className="border-x border-[var(--border)]">
        <div className="text-[10px] uppercase font-semibold text-[var(--text-tertiary)]">Remaining</div>
        <div className="text-sm font-bold text-[var(--accent)] font-mono">{formatDistance(remainingKm)}</div>
      </div>
      <div>
        <div className="text-[10px] uppercase font-semibold text-[var(--text-tertiary)]">Total</div>
        <div className="text-sm font-bold text-[var(--text-secondary)] font-mono">{formatDistance(totalKm)}</div>
      </div>
    </div>
  );
}
