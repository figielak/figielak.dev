/**
 * Homelab data for the dashboard tiles (docs/koncept.md §9): the last push of the
 * agent, read from Firestore and cached 30 s per instance. One endpoint per
 * tile, so every tile goes stale on its own when its section stops coming.
 *
 * In `astro dev` the mocks stand in until something is pushed to /api/stats.
 */
import type { APIRoute } from 'astro';
import { cached } from '../../../lib/server/cache';
import { readSections } from '../../../lib/server/firestore';
import type { StoredSections } from '../../../lib/server/homelab';
import { liveJson, unavailable } from '../../../lib/server/respond';
import { mockLab } from '../../../lib/mocks/stats';
import { mockDns, mockTraffic } from '../../../lib/mocks/network';
import { mockUptime } from '../../../lib/mocks/uptime';

export const prerender = false;

/* In dev, a push shows up at once. */
const TTL_MS = import.meta.env.DEV ? 0 : 30_000;

type Tile = 'lab' | 'dns' | 'net' | 'uptime';

/** The tile's data, or null when its sections have not arrived yet. */
function forTile(tile: Tile, s: StoredSections): object | null {
	switch (tile) {
		case 'lab':
			return s.lab ?? null;
		case 'dns':
			return s.dns ?? null;
		case 'net':
			return s.traffic ?? null;
		case 'uptime': {
			if (!s.lab || !s.services) return null;
			/* Built from two sections — the older time decides freshness. */
			const updatedAt = s.lab.updatedAt < s.services.updatedAt ? s.lab.updatedAt : s.services.updatedAt;
			return { uptimeDays: s.lab.uptimeDays, services: s.services.services, updatedAt };
		}
	}
}

const MOCKS: Record<Tile, () => { data?: object }> = {
	lab: mockLab,
	dns: mockDns,
	net: mockTraffic,
	uptime: mockUptime,
};

export const GET: APIRoute = async ({ params }) => {
	const tile = params.section as Tile;
	if (!(tile in MOCKS)) return new Response(null, { status: 404 });

	try {
		const { value } = await cached('homelab', TTL_MS, readSections);
		const data = forTile(tile, value);
		if (data) return liveJson(data, 30);
		if (import.meta.env.DEV) return liveJson(MOCKS[tile]().data!, 30);
		return unavailable(`homelab: no ${tile} data yet`);
	} catch (error) {
		return unavailable(error);
	}
};
