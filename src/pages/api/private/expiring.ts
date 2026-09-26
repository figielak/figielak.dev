/**
 * What expires and when, for the private dashboard (docs/koncept.md §3.4), cached
 * 6 h. Owner only (src/lib/owner.ts). Needs no key: sources without their
 * token are simply left out.
 */
import type { APIRoute } from 'astro';
import { ownerGate } from '../../../lib/owner';
import { cached } from '../../../lib/server/cache';
import { fetchExpiring } from '../../../lib/server/expiring';
import { privateJson, unavailable } from '../../../lib/server/respond';

export const prerender = false;

const SIX_HOURS = 6 * 60 * 60_000;

export const GET: APIRoute = async ({ request }) => {
	const denied = ownerGate(request);
	if (denied) return denied;

	try {
		const { value, updatedAt } = await cached('expiring', SIX_HOURS, fetchExpiring);
		return privateJson({ ...value, updatedAt });
	} catch (error) {
		return unavailable(error);
	}
};
