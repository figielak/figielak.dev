/**
 * Mock weather until the Open-Meteo endpoint exists (koncept.md §9).
 * The shape is what /api/weather will return, so tiles do not change when
 * the real source is plugged in.
 */
import { mockUpdatedAt, STALE_AFTER_MIN, type Live, type LiveState } from '../live';

export type { LiveState };

export type WeatherCondition = 'clear' | 'partlyCloudy' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm';

export type Weather = Live<{
	tempC: number;
	feelsLikeC: number;
	windKmh: number;
	condition: WeatherCondition;
	city: string;
}>;

export const WEATHER_STALE_AFTER_MIN = STALE_AFTER_MIN;

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
