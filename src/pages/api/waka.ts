/**
 * WakaTime stats for the dashboard tile, cached 1 h (koncept.md §9).
 * Without WAKATIME_API_KEY `astro dev` serves the mock, production answers 503.
 */
import type { APIRoute } from 'astro';
import { cached } from '../../lib/server/cache';
import { fetchWaka, wakatimeKey } from '../../lib/server/wakatime';
import { mockWaka } from '../../lib/mocks/waka';
import { liveJson, unavailable } from '../../lib/server/respond';

export const prerender = false;

const HOUR = 60 * 60_000;

export const GET: APIRoute = async () => {
	if (!wakatimeKey()) {
		return import.meta.env.DEV ? liveJson(mockWaka().data!, 60) : unavailable('WAKATIME_API_KEY is not set');
	}

	try {
		const { value, updatedAt } = await cached('waka', HOUR, fetchWaka);
		return liveJson({ ...value, updatedAt }, 600);
	} catch (error) {
		return unavailable(error);
	}
};
