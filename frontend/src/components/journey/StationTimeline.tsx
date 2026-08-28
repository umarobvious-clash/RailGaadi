import { StationRow } from './StationRow';
import type { Station } from '../../types';

interface StationTimelineProps {
  stations: Station[];
  currentStationId?: string;
}

export function StationTimeline({ stations, currentStationId }: StationTimelineProps) {
  // Find current station index
  let currentIdx = stations.findIndex(
    s => s.id === currentStationId || s.code === currentStationId || s.status === 'CURRENT'
  );

  // If current train location is an intermediate passing station between halts:
  // Current active leg is the last station that has been passed
  if (currentIdx === -1) {
    const lastPassedIdx = stations.map(s => s.status).lastIndexOf('PASSED');
    if (lastPassedIdx >= 0) {
      currentIdx = lastPassedIdx;
    } else {
      currentIdx = 0;
    }
  }

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          Route Timeline ({stations.length} Stations)
        </h4>
        <span className="text-[11px] text-[var(--accent)] font-medium">
          {stations.filter(s => s.status === 'PASSED').length} passed • {stations.filter(s => s.status !== 'PASSED').length} to go
        </span>
      </div>
      <div className="relative">
        {stations.map((st, index) => {
          const isFirst = index === 0;
          const isLast = index === stations.length - 1;

          // Accurately determine status
          const isPassed = st.status === 'PASSED' || (currentIdx >= 0 && index < currentIdx);
          const isCurrent =
            st.id === currentStationId ||
            st.code === currentStationId ||
            st.status === 'CURRENT' ||
            (index === currentIdx && st.status !== 'PASSED');

          return (
            <StationRow
              key={st.id || index}
              station={st}
              isFirst={isFirst}
              isLast={isLast}
              isCurrent={isCurrent}
              isPassed={isPassed}
            />
          );
        })}
      </div>
    </div>
  );
}
