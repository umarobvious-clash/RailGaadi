import { useState, useRef } from 'react';
import type { ReactNode, TouchEvent } from 'react';
import { clsx } from 'clsx';

type DrawerState = 'peek' | 'half' | 'full';

interface DrawerProps {
  children: ReactNode;
  className?: string;
  defaultState?: DrawerState;
}

const stateHeights: Record<DrawerState, string> = {
  peek: '88px',
  half: '50vh',
  full: '88vh',
};

export function Drawer({ children, className, defaultState = 'half' }: DrawerProps) {
  const [state, setState] = useState<DrawerState>(defaultState);
  const startY = useRef<number | null>(null);
  const startState = useRef<DrawerState>(defaultState);

  const handleTouchStart = (e: TouchEvent) => {
    startY.current = e.touches[0].clientY;
    startState.current = state;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (startY.current === null) return;
    const delta = startY.current - e.changedTouches[0].clientY;
    if (delta > 60) {
      // swiped up
      setState(startState.current === 'peek' ? 'half' : 'full');
    } else if (delta < -60) {
      // swiped down
      setState(startState.current === 'full' ? 'half' : 'peek');
    }
    startY.current = null;
  };

  return (
    <div
      className={clsx(
        'md:hidden fixed bottom-0 left-0 right-0 z-[var(--z-panel)]',
        'bg-[var(--surface)] rounded-t-[var(--radius-xl)]',
        'shadow-[var(--shadow-modal)]',
        'transition-[height] duration-[var(--duration-panel)] ease-[var(--ease-out)]',
        className
      )}
      style={{ height: stateHeights[state] }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-2 shrink-0 cursor-grab active:cursor-grabbing">
        <div className="w-10 h-1 bg-[var(--border-strong)] rounded-full" />
      </div>

      {/* Content */}
      <div className="overflow-y-auto h-[calc(100%-32px)] px-4 pb-6">
        {children}
      </div>
    </div>
  );
}
