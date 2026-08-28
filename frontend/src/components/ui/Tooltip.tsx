import type { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const positionMap = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-flex group">
      {children}
      <span
        role="tooltip"
        className={`
          absolute z-50 pointer-events-none whitespace-nowrap
          bg-[var(--text-primary)] text-white text-[11px] font-medium
          px-2 py-1 rounded-md shadow-sm
          opacity-0 group-hover:opacity-100
          transition-opacity duration-[var(--duration-fast)]
          ${positionMap[side]}
        `}
      >
        {content}
      </span>
    </div>
  );
}
