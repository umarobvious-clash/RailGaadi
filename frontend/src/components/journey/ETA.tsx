
interface ETAProps {
  eta?: string;
  stationName?: string;
  className?: string;
}

export function ETA({ eta, stationName, className = '' }: ETAProps) {
  return (
    <div className={`p-3 bg-[var(--surface)] rounded-[var(--radius-card)] ${className}`}>
      <div className="text-[11px] text-[var(--text-secondary)] uppercase font-semibold tracking-wider">
        Next Arrival ({stationName || 'Next Station'})
      </div>
      <div className="text-xl font-bold text-[var(--text-primary)] font-mono mt-0.5">
        {eta || '--:--'}
      </div>
    </div>
  );
}
