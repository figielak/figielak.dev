/**
 * CPU and RAM of the last 24 hours for the private server tile (docs/koncept.md
 * §3.4), cached 60 s. Owner only (src/lib/owner.ts). A static route, so it
 * wins over [section].ts. In `astro dev` the mock stands in until pushes
 * build up a history.
 */
import type { APIRoute } from 'astro';
import { ownerGate } from '../../../../lib/owner';
import { cached } from '../../../../lib/server/cache';
import { readHistory } from '../../../../lib/server/history';
import { mockHistory } from '../../../../lib/mocks/history';
import { privateJson, unavailable } from '../../../../lib/server/respond';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const denied = ownerGate(request);
	if (denied) return denied;

	try {
		const { value } = await cached('homelab:history', import.meta.env.DEV ? 0 : 60_000, readHistory);
		if (value.length < 2) {
			if (import.meta.env.DEV) return privateJson(mockHistory().data!);
			return unavailable('homelab: no history yet');
		}
		const points = value.map(({ t, cpu, ram }) => ({ t, cpu, ram }));
		/* Fresh as the last bucket, which moves every 5 minutes. */
		return privateJson({ points, updatedAt: points.at(-1)!.t });
	} catch (error) {
		return unavailable(error);
	}
};
