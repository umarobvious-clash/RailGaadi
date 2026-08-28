import { AnimatedCounter } from './AnimatedCounter';

interface MetricCardProps {
  label: string;
  value: number;
  unit?: string;
  icon?: string;
  formatter?: (val: number) => string;
  highlight?: boolean;
}

export function MetricCard({ label, value, unit = '', icon, formatter, highlight }: MetricCardProps) {
  return (
    <div className={`p-4 bg-[var(--surface)] rounded-[var(--radius-card)] border border-[var(--border)] transition-transform hover:-translate-y-0.5 ${highlight ? 'ring-2 ring-[var(--accent)]/30' : ''}`}>
      <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
        <span>{label}</span>
        {icon && <span className="text-base">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-[var(--text-primary)] font-mono flex items-baseline gap-1">
        <AnimatedCounter value={value} formatter={formatter} />
        {unit && <span className="text-xs font-normal text-[var(--text-secondary)]">{unit}</span>}
      </div>
    </div>
  );
}
