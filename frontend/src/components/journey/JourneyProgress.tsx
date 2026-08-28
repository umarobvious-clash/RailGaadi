
interface JourneyProgressProps {
  percent: number;
  className?: string;
}

export function JourneyProgress({ percent, className = '' }: JourneyProgressProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center text-xs mb-1.5">
        <span className="font-medium text-[var(--text-secondary)]">Journey Progress</span>
        <span className="font-bold text-[var(--text-primary)]">{clamped}%</span>
      </div>
      <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-700 ease-out rounded-full"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
