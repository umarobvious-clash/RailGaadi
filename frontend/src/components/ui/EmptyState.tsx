import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center px-6 py-10 gap-4',
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 rounded-[var(--radius-card)] bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-2xl text-[var(--text-tertiary)] shrink-0">
          {icon}
        </div>
      )}
      <div className="space-y-1.5">
        <p className="font-semibold text-sm text-[var(--text-primary)]">{title}</p>
        {description && (
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-[220px]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
