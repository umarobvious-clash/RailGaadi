import type { GeographicFeature } from '../../types';

interface GeographicFeatureCardProps {
  feature: GeographicFeature;
  onSelect?: () => void;
}

const categoryIcons: Record<string, string> = {
  water: '💧',
  terrain: '⛰️',
  infrastructure: '🌉',
  place: '🏛️',
};

export function GeographicFeatureCard({ feature, onSelect }: GeographicFeatureCardProps) {
  return (
    <div
      className="p-3 bg-[var(--surface)] rounded-[var(--radius-card)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors cursor-pointer select-none"
      onClick={onSelect}
    >
      <div className="flex items-start gap-2.5">
        <span className="text-lg p-1.5 bg-[var(--surface-elevated)] rounded-md shadow-xs shrink-0">
          {categoryIcons[feature.type] || '📍'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-[var(--text-primary)] truncate">{feature.name}</span>
            <span className="text-[10px] font-mono text-[var(--accent)] shrink-0">
              {feature.distanceFromRouteKm} km off
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 mt-0.5">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}
