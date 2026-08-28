import { useEffect, useState } from 'react';
import { formatRelativeTime, isDataStale } from '../../utils/journey';

interface LastUpdatedProps {
  updatedAt?: string;
  className?: string;
}

export function LastUpdated({ updatedAt, className = '' }: LastUpdatedProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  const stale = isDataStale(updatedAt);
  const text = formatRelativeTime(updatedAt);

  return (
    <div className={`flex items-center gap-1.5 text-xs ${className}`}>
      <span className={`inline-block w-2 h-2 rounded-full ${stale ? 'bg-amber-500' : 'bg-emerald-500'}`} />
      <span className="text-[var(--text-secondary)]">
        {stale ? `Stale data • Last updated ${text}` : `Updated ${text}`}
      </span>
    </div>
  );
}
