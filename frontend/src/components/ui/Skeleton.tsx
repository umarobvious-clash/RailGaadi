import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  lines?: number;
  circle?: boolean;
}

export function Skeleton({ className, lines, circle }: SkeletonProps) {
  if (circle) {
    return (
      <div
        className={clsx(
          'animate-shimmer rounded-full',
          className ?? 'w-10 h-10'
        )}
        aria-hidden
      />
    );
  }

  if (lines && lines > 1) {
    return (
      <div className={clsx('space-y-2', className)} aria-hidden>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              'animate-shimmer rounded-lg h-4',
              i === lines - 1 ? 'w-2/3' : 'w-full'
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'animate-shimmer rounded-lg',
        className ?? 'h-4 w-full'
      )}
      aria-hidden
    />
  );
}
