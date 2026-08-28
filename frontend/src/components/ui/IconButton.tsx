import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  'aria-label': string;
  variant?: 'ghost' | 'secondary' | 'primary' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  active?: boolean;
}

const variantStyles = {
  ghost: 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  secondary: 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)]',
  primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]',
  danger: 'bg-[var(--danger-subtle)] text-[var(--danger)] hover:bg-[var(--danger-dim)]',
};

const sizeStyles = {
  xs: 'w-6 h-6 rounded-[var(--radius-xs)] text-xs',
  sm: 'w-8 h-8 rounded-[var(--radius-sm)] text-sm',
  md: 'w-9 h-9 rounded-[var(--radius-control)] text-sm',
  lg: 'w-11 h-11 rounded-[var(--radius-control)] text-base',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'ghost', size = 'md', className, active, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          'inline-flex items-center justify-center transition-colors cursor-pointer select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
          'disabled:opacity-40 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          active && 'bg-[var(--accent-subtle)] text-[var(--accent)]',
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';
