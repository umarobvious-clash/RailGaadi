import type { WeatherSnapshot } from '../../types';

interface WeatherCardProps {
  title: string;
  weather?: WeatherSnapshot;
  isLoading?: boolean;
}

export function WeatherCard({ title, weather, isLoading }: WeatherCardProps) {
  if (isLoading) {
    return (
      <div className="p-3.5 bg-[var(--surface)] rounded-[var(--radius-card)] animate-pulse space-y-2">
        <div className="h-3 w-16 bg-[var(--border)] rounded" />
        <div className="h-6 w-12 bg-[var(--border)] rounded" />
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="p-3.5 bg-[var(--surface)] rounded-[var(--radius-card)] text-xs text-[var(--text-tertiary)]">
        {title}: Weather unavailable
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-[var(--surface)] rounded-[var(--radius-card)] border border-[var(--border)] space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
        <span>{title}</span>
        <span className="text-sm font-normal">
          {weather.condition?.includes('Rain') ? '🌧️' : weather.temperatureC > 30 ? '☀️' : '⛅'}
        </span>
      </div>
      <div className="text-xs font-medium text-[var(--text-primary)] truncate">
        {weather.locationName || 'Station'}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold font-mono text-[var(--text-primary)]">
          {weather.temperatureC}°C
        </span>
        <span className="text-xs text-[var(--text-secondary)]">{weather.condition}</span>
      </div>
      <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] font-mono pt-1 border-t border-[var(--border)]/60">
        <span>💧 {weather.humidityPercent}%</span>
        <span>💨 {weather.windKph} km/h</span>
      </div>
    </div>
  );
}
