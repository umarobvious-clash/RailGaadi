import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-[var(--radius-control)] cursor-pointer';
    
    const variants = {
      primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] focus-visible:ring-[var(--accent)]',
      secondary: 'bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--border)] focus-visible:ring-[var(--text-tertiary)]',
      ghost: 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface)] focus-visible:ring-[var(--text-tertiary)]',
      danger: 'bg-[var(--danger)] text-white hover:opacity-90 focus-visible:ring-[var(--danger)]',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm min-w-[44px]',
      md: 'h-11 px-4 text-base min-w-[44px]',
      lg: 'h-14 px-6 text-lg min-w-[44px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <span className="mr-2 animate-spin">⟳</span>}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
