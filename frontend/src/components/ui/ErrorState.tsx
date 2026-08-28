import { Button } from './Button';
import { clsx } from 'clsx';

interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title, description, onRetry, className }: ErrorStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center px-6 py-10 gap-4',
        className
      )}
    >
      <div className="w-12 h-12 rounded-[var(--radius-card)] bg-[var(--danger-subtle)] border border-[var(--danger-dim)] flex items-center justify-center text-2xl shrink-0">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--danger)]"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="space-y-1.5">
        <p className="font-semibold text-sm text-[var(--text-primary)]">{title}</p>
        {description && (
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-[220px]">
            {description}
          </p>
        )}
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
