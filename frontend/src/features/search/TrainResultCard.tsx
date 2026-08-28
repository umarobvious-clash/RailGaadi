import type { Train } from '../../types';

interface TrainResultCardProps {
  train: Train;
  onClick: () => void;
}

export function TrainResultCard({ train, onClick }: TrainResultCardProps) {
  return (
    <li 
      role="option"
      className="p-3 rounded-[var(--radius-control)] hover:bg-[var(--surface)] cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-[var(--text-primary)]">{train.name}</span>
        <span className="font-mono text-sm px-2 py-1 bg-[var(--surface-elevated)] border border-[var(--border)] rounded text-[var(--text-secondary)]">
          {train.number}
        </span>
      </div>
      <div className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
        <span>{train.origin.name}</span>
        <span className="text-[var(--text-tertiary)] text-xs">→</span>
        <span>{train.destination.name}</span>
      </div>
    </li>
  );
}
