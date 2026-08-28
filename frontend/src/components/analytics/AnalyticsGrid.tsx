import { MetricCard } from './MetricCard';
import type { LiveJourney, RouteElevation } from '../../types';

interface AnalyticsGridProps {
  journey: LiveJourney;
  elevation?: RouteElevation;
}

export function AnalyticsGrid({ journey, elevation }: AnalyticsGridProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
        Journey Analytics
      </h4>
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Completion"
          value={journey.completionPercent ?? 0}
          unit="%"
          icon="🏁"
          highlight
        />
        <MetricCard
          label="Distance"
          value={journey.distanceTravelledKm ?? 0}
          unit="km"
          icon="🛤️"
        />
        <MetricCard
          label="Current Delay"
          value={journey.status.delayMinutes ?? 0}
          unit="min"
          icon="⏱️"
          formatter={(v) => (v > 0 ? `+${v}` : `${v}`)}
        />
        <MetricCard
          label="Max Elevation"
          value={elevation?.highest?.elevationMeters ?? 0}
          unit="m"
          icon="⛰️"
        />
      </div>
    </div>
  );
}
