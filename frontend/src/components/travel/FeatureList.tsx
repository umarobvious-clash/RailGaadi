import { useState } from 'react';
import { GeographicFeatureCard } from './GeographicFeatureCard';
import type { GeographicFeature } from '../../types';

interface FeatureListProps {
  features: GeographicFeature[];
  onSelectFeature?: (feature: GeographicFeature) => void;
}

export function FeatureList({ features, onSelectFeature }: FeatureListProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'water' | 'terrain' | 'infrastructure' | 'place'>('all');

  const filtered = activeTab === 'all' ? features : features.filter(f => f.type === activeTab);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          En Route Highlights ({features.length})
        </h4>
        <div className="flex gap-1 text-[11px]">
          {['all', 'water', 'terrain', 'infrastructure', 'place'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-2 py-0.5 rounded-full capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-[var(--accent)] text-white font-medium'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {filtered.map(feat => (
          <GeographicFeatureCard
            key={feat.id}
            feature={feat}
            onSelect={() => onSelectFeature?.(feat)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-4 text-xs text-[var(--text-tertiary)]">
            No highlights in this category.
          </div>
        )}
      </div>
    </div>
  );
}
