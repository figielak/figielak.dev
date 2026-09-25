/**
 * Current weather in Rzeszów from Open-Meteo, cached 15 min (koncept.md §9).
 * No key, so dev and production call the real source alike.
 */
import type { APIRoute } from 'astro';
import { cached } from '../../lib/server/cache';
import { fetchWeather } from '../../lib/server/weather';
import { liveJson, unavailable } from '../../lib/server/respond';

export const prerender = false;

export const GET: APIRoute = async () => {
	try {
		const { value, updatedAt } = await cached('weather', 15 * 60_000, fetchWeather);
		return liveJson({ ...value, updatedAt }, 300);
	} catch (error) {
		return unavailable(error);
	}
};
