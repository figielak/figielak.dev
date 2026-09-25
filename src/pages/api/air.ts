/**
 * Air quality in Rzeszów from GIOŚ, cached 30 min (koncept.md §9): the
 * stations measure hourly and publish some twenty minutes later. `updatedAt`
 * is the time of the measurement, so the tile goes stale on its own when the
 * station falls silent.
 */
import type { APIRoute } from 'astro';
import { cached } from '../../lib/server/cache';
import { fetchAir } from '../../lib/server/air';
import { liveJson, unavailable } from '../../lib/server/respond';

export const prerender = false;

export const GET: APIRoute = async () => {
	try {
		const { value } = await cached('air', 30 * 60_000, fetchAir);
		return liveJson(value, 600);
	} catch (error) {
		return unavailable(error);
	}
};
