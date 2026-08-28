import type { WeatherSnapshot } from '../../types';
import { env } from '../../config/env';

export class OpenWeatherClient {
  async getWeatherByCoords(lat: number, lng: number, locationName?: string): Promise<WeatherSnapshot> {
    if (env.OPENWEATHER_API_KEY) {
      try {
        const url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&units=metric&appid=' + env.OPENWEATHER_API_KEY;
        const res = await fetch(url);
        if (res.ok) {
          const data: any = await res.json();
          return {
            locationName: locationName || data.name,
            temperatureC: Math.round(data.main?.temp ?? 28),
            condition: data.weather?.[0]?.main || 'Clear',
            humidityPercent: data.main?.humidity ?? 65,
            windKph: Math.round((data.wind?.speed ?? 3.5) * 3.6),
            rainProbability: data.clouds?.all ? Math.min(100, Math.round(data.clouds.all * 0.6)) : 10,
            observedAt: new Date().toISOString(),
          };
        }
      } catch (err) {
        // Fallback to estimation
      }
    }

    const baseTemp = lat > 26 ? 24 : lat > 20 ? 29 : 31;
    const hour = new Date().getHours();
    const tempVar = Math.sin((hour - 8) / 12 * Math.PI) * 4;
    const temp = Math.round(baseTemp + tempVar);

    return {
      locationName: locationName || 'En route station',
      temperatureC: temp,
      condition: temp > 32 ? 'Sunny' : temp < 22 ? 'Cool' : 'Partly Cloudy',
      humidityPercent: Math.round(55 + (lng % 25)),
      windKph: Math.round(10 + ((lat * 10) % 15)),
      rainProbability: Math.round((lat + lng) % 35),
      observedAt: new Date().toISOString(),
    };
  }
}
