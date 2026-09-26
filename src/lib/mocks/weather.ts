/**
 * Weather in the shape /api/weather returns (Open-Meteo, docs/koncept.md §9), and
 * mocks of it for /dev/tiles.
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

export type { LiveState };

export const WEATHER_CONDITIONS = ['clear', 'partlyCloudy', 'cloudy', 'fog', 'rain', 'snow', 'storm'] as const;

export type WeatherCondition = (typeof WEATHER_CONDITIONS)[number];

export type Weather = Live<{
	tempC: number;
	feelsLikeC: number;
	windKmh: number;
	condition: WeatherCondition;
	city: string;
}>;

/* The server keeps a reading 15 min and the tile asks every 15 min, so up to
   half an hour is normal; past this the tile turns stale. */
export const WEATHER_STALE_AFTER_MIN = 45;

/** Fills the layout while loading or on error, so the tile keeps its size. */
export const WEATHER_PLACEHOLDER: NonNullable<Weather['data']> = {
	tempC: 0,
	feelsLikeC: 0,
	windKmh: 0,
	condition: 'cloudy',
	city: '—',
	updatedAt: new Date(0),
};

export function mockWeather(state: LiveState = 'ok'): Weather {
	if (state === 'loading' || state === 'error') return { state };

	return {
		state,
		data: {
			tempC: 14,
			feelsLikeC: 12,
			windKmh: 18,
			condition: 'cloudy',
			city: 'Rzeszów',
			updatedAt: mockUpdatedAt(state),
		},
	};
}
