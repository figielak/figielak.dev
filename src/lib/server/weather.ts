/**
 * Current weather in Rzeszów from Open-Meteo (koncept.md §9) — no key needed.
 * The WMO weather code is folded into the tile's few conditions.
 */
import type { Weather, WeatherCondition } from '../mocks/weather';

export type WeatherData = Omit<NonNullable<Weather['data']>, 'updatedAt'>;

/* City centre of Rzeszów (koncept.md §17). */
const CITY = 'Rzeszów';
const LATITUDE = 50.0413;
const LONGITUDE = 21.999;

/** WMO weather interpretation codes, as documented by Open-Meteo. */
export function conditionOf(code: number): WeatherCondition {
	if (code === 0) return 'clear';
	if (code <= 2) return 'partlyCloudy';
	if (code === 3) return 'cloudy';
	if (code === 45 || code === 48) return 'fog';
	if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
	if (code >= 95) return 'storm';
	return 'rain';
}

interface Forecast {
	current?: {
		temperature_2m: number;
		apparent_temperature: number;
		wind_speed_10m: number;
		weather_code: number;
	};
}

export async function fetchWeather(): Promise<WeatherData> {
	const url = new URL('https://api.open-meteo.com/v1/forecast');
	url.search = new URLSearchParams({
		latitude: String(LATITUDE),
		longitude: String(LONGITUDE),
		current: 'temperature_2m,apparent_temperature,wind_speed_10m,weather_code',
		wind_speed_unit: 'kmh',
	}).toString();

	const response = await fetch(url, {
		headers: { 'User-Agent': 'figielak.dev' },
		signal: AbortSignal.timeout(10_000),
	});
	if (!response.ok) throw new Error(`Open-Meteo: HTTP ${response.status}`);
	const { current } = (await response.json()) as Forecast;
	if (!current) throw new Error('Open-Meteo: no current weather');

	return {
		tempC: Math.round(current.temperature_2m),
		feelsLikeC: Math.round(current.apparent_temperature),
		windKmh: Math.round(current.wind_speed_10m),
		condition: conditionOf(current.weather_code),
		city: CITY,
	};
}
