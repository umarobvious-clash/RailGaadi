import { useState } from 'react';
import type { Station } from '../../types';

interface StationRowProps {
  station: Station;
  isFirst?: boolean;
  isLast: boolean;
  isCurrent: boolean;
  isPassed: boolean;
}

export function StationRow({ station, isLast, isCurrent, isPassed }: StationRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative flex items-start group">
      {!isLast && (
        <div
          className={`absolute left-3.5 top-6 bottom-0 w-0.5 ${
            isPassed ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
          }`}
        />
      )}

      <div className="relative z-10 flex items-center justify-center w-7 h-7 mr-3 shrink-0">
        {isCurrent ? (
          <div className="w-5 h-5 rounded-full bg-[var(--accent)]/20 flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 rounded-full bg-[var(--accent)] shadow-sm" />
          </div>
        ) : isPassed ? (
          <div className="w-3.5 h-3.5 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-[9px] font-bold">
            ✓
          </div>
        ) : (
          <div className="w-3 h-3 rounded-full border-2 border-[var(--border)] bg-[var(--surface-elevated)]" />
        )}
      </div>

      <div
        className={`flex-1 pb-5 cursor-pointer select-none ${isCurrent ? 'font-semibold' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isCurrent ? 'text-[var(--accent)] font-bold' : isPassed ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
            >
              {station.name}
            </span>
            {station.code && (
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface)] text-[var(--text-tertiary)]">
                {station.code}
              </span>
            )}
          </div>
          <span className="text-xs text-[var(--text-secondary)] font-mono">
            {station.actualArrival || station.estimatedArrival || station.scheduledArrival || station.actualDeparture || station.scheduledDeparture || '--:--'}
          </span>
        </div>

        {expanded && (
          <div className="mt-2 p-2.5 bg-[var(--surface)] rounded-[var(--radius-control)] text-xs text-[var(--text-secondary)] space-y-1 animate-in fade-in">
            <div className="flex justify-between">
              <span>Scheduled Arrival:</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">{station.scheduledArrival || 'Origin'}</span>
            </div>
            <div className="flex justify-between">
              <span>Scheduled Departure:</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">{station.scheduledDeparture || 'Destination'}</span>
            </div>
            {(station.actualArrival || station.estimatedArrival) && (
              <div className="flex justify-between text-[var(--accent)]">
                <span>Actual / Est. Time:</span>
                <span className="font-mono font-medium">{station.actualArrival || station.estimatedArrival}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
