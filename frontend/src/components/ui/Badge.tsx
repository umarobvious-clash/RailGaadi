import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

const variantStyles = {
  default: 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border)]',
  success: 'bg-[var(--success-subtle)] text-[var(--success)] border border-[var(--success-dim)]',
  warning: 'bg-[var(--warning-subtle)] text-[var(--warning)] border border-[var(--warning-dim)]',
  danger:  'bg-[var(--danger-subtle)] text-[var(--danger)] border border-[var(--danger-dim)]',
  info:    'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-dim)]',
};

const dotColors = {
  default: 'bg-[var(--text-tertiary)]',
  success: 'bg-[var(--success)]',
  warning: 'bg-[var(--warning)]',
  danger:  'bg-[var(--danger)]',
  info:    'bg-[var(--accent)]',
};

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-medium tracking-wide select-none',
        size === 'sm'
          ? 'text-[11px] px-2 py-0.5 rounded-full'
          : 'text-xs px-2.5 py-1 rounded-full',
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            'inline-block w-1.5 h-1.5 rounded-full shrink-0',
            dotColors[variant]
          )}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}
