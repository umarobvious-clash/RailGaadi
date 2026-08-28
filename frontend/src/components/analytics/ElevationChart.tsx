import { useState } from 'react';
import type { RouteElevation } from '../../types';

interface ElevationChartProps {
  elevation: RouteElevation;
  travelledKm?: number;
  className?: string;
}

export function ElevationChart({ elevation, travelledKm = 0, className = '' }: ElevationChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; dist: number; elev: number } | null>(null);

  const points = elevation.points || [];
  if (points.length === 0) return null;

  const maxElev = Math.max(...points.map(p => p.elevationMeters), 100);
  const minElev = Math.min(...points.map(p => p.elevationMeters), 0);
  const maxDist = points[points.length - 1]?.distanceKm || 100;

  const width = 400;
  const height = 120;
  const padding = 20;

  // SVG scale mappings
  const scaleX = (dist: number) => padding + (dist / maxDist) * (width - 2 * padding);
  const scaleY = (elev: number) => height - padding - ((elev - minElev) / (maxElev - minElev || 1)) * (height - 2 * padding);

  // Generate SVG path string
  const pathD = points.reduce((acc, p, i) => {
    const x = scaleX(p.distanceKm);
    const y = scaleY(p.elevationMeters);
    return i === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
  }, '');

  // Area fill path
  const firstX = scaleX(points[0].distanceKm);
  const lastX = scaleX(points[points.length - 1].distanceKm);
  const bottomY = height - padding;
  const areaD = `${pathD} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;

  // Train position coordinate
  const trainX = scaleX(Math.min(travelledKm, maxDist));

  return (
    <div className={`p-4 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-[var(--radius-card)] shadow-sm space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          Elevation Profile
        </h4>
        <div className="text-xs font-mono text-[var(--accent)] font-semibold">
          Peak: {elevation.highest.elevationMeters}m @ {elevation.highest.distanceKm}km
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          role="img"
          aria-label="Elevation profile chart"
        >
          <defs>
            <linearGradient id="elevation-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1769ff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1769ff" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Base grid */}
          <line x1={padding} y1={bottomY} x2={width - padding} y2={bottomY} stroke="var(--border)" strokeWidth="1" />

          {/* Area fill */}
          <path d={areaD} fill="url(#elevation-grad)" />

          {/* Line stroke */}
          <path d={pathD} fill="none" stroke="#1769ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Train current position vertical indicator */}
          <line x1={trainX} y1={padding} x2={trainX} y2={bottomY} stroke="#d64545" strokeWidth="1.5" strokeDasharray="3,3" />
          <circle cx={trainX} cy={scaleY(points.find(p => p.distanceKm >= travelledKm)?.elevationMeters ?? minElev)} r="4" fill="#d64545" stroke="#fff" strokeWidth="2" />

          {/* Data points hover targets */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={scaleX(p.distanceKm)}
              cy={scaleY(p.elevationMeters)}
              r="5"
              fill="transparent"
              className="hover:fill-[var(--accent)] hover:stroke-white hover:stroke-2 cursor-pointer transition-colors"
              onMouseEnter={() => setHoveredPoint({ x: scaleX(p.distanceKm), y: scaleY(p.elevationMeters), dist: p.distanceKm, elev: p.elevationMeters })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {hoveredPoint && (
          <div
            className="absolute pointer-events-none bg-[var(--text-primary)] text-white text-[10px] font-mono px-2 py-1 rounded shadow-md -translate-x-1/2 -translate-y-full -top-1"
            style={{ left: `${(hoveredPoint.x / width) * 100}%` }}
          >
            {hoveredPoint.elev}m • {hoveredPoint.dist}km
          </div>
        )}
      </div>
    </div>
  );
}
