/**
 * Marks a lesson as paid from the private dashboard (koncept.md §3.4):
 * JSON `{ key, paid }`, the key as /api/private/lessons gives it. Owner only
 * (src/lib/owner.ts), JSON only (requireJson in src/lib/server/respond.ts).
 */
import type { APIRoute } from 'astro';
import { ownerGate } from '../../../lib/owner';
import { forget } from '../../../lib/server/cache';
import { setPaid } from '../../../lib/server/lessons';
import { privateJson, requireJson, unavailable } from '../../../lib/server/respond';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	const denied = ownerGate(request) ?? requireJson(request);
	if (denied) return denied;

	const body = (await request.json().catch(() => null)) as { key?: unknown; paid?: unknown } | null;
	const key = body?.key;
	if (typeof key !== 'string' || !key || key.length > 300 || typeof body?.paid !== 'boolean') {
		return privateJson({ error: 'invalid' }, 400);
	}

	try {
		await setPaid(key, body.paid);
		forget('lessons');
		return privateJson({ key, paid: body.paid });
	} catch (error) {
		return unavailable(error);
	}
};
