/**
 * Mock weather until the Open-Meteo endpoint exists (koncept.md §9).
 * The shape is what /api/weather will return, so tiles do not change when
 * the real source is plugged in.
 */
export type LiveState = 'loading' | 'ok' | 'stale' | 'error';

export type WeatherCondition = 'clear' | 'partlyCloudy' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm';

export interface Weather {
	state: LiveState;
	/** Missing while loading or on error. */
	data?: {
		tempC: number;
		condition: WeatherCondition;
		city: string;
		updatedAt: Date;
	};
}

/** Data older than this is shown as stale (koncept.md §9). */
export const WEATHER_STALE_AFTER_MIN = 10;

export function mockWeather(state: LiveState = 'ok'): Weather {
	if (state === 'loading' || state === 'error') return { state };

	const minutesAgo = state === 'stale' ? 25 : 2;
	return {
		state,
		data: {
			tempC: 14,
			condition: 'cloudy',
			city: 'Rzeszów',
			updatedAt: new Date(Date.now() - minutesAgo * 60_000),
		},
	};
}
