/**
 * Saves the goal from the private dashboard (docs/koncept.md §3.4): JSON with
 * `title` `{ pl, en? }`, an optional `by` date and up to eight `steps`, each
 * `{ title: { pl, en? }, done }`. Owner only (src/lib/owner.ts), JSON only
 * (requireJson in src/lib/server/respond.ts).
 *
 *   200  saved, with the new `updatedAt`
 *   400  not JSON, no title, a bad date or no step
 */
import type { APIRoute } from 'astro';
import { ownerGate } from '../../../lib/owner';
import { forget } from '../../../lib/server/cache';
import { parseGoal, saveGoal } from '../../../lib/server/goal';
import { privateJson, requireJson, unavailable } from '../../../lib/server/respond';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	const denied = ownerGate(request) ?? requireJson(request);
	if (denied) return denied;

	const goal = parseGoal(await request.json().catch(() => null));
	if (!goal) return privateJson({ error: 'invalid' }, 400);

	try {
		const updatedAt = await saveGoal(goal);
		forget('goal');
		return privateJson({ goal, updatedAt });
	} catch (error) {
		return unavailable(error);
	}
};
