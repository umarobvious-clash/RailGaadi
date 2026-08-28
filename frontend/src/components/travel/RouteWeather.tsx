import { WeatherCard } from './WeatherCard';
import type { JourneyWeather } from '../../types';

interface RouteWeatherProps {
  weather?: JourneyWeather;
  isLoading?: boolean;
}

export function RouteWeather({ weather, isLoading }: RouteWeatherProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
        Route Weather
      </h4>
      <div className="grid grid-cols-3 gap-2.5">
        <WeatherCard title="Current" weather={weather?.current} isLoading={isLoading} />
        <WeatherCard title="Next" weather={weather?.next} isLoading={isLoading} />
        <WeatherCard title="Destination" weather={weather?.destination} isLoading={isLoading} />
      </div>
    </div>
  );
}
