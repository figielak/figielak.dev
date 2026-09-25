/**
 * Tutoring lessons for the private dashboard (koncept.md §3.4), cached
 * 10 min. Owner only (src/lib/owner.ts). Without TUTORING_ICAL_URL `astro
 * dev` serves the mock, production answers 503.
 */
import type { APIRoute } from 'astro';
import { ownerGate } from '../../../lib/owner';
import { cached } from '../../../lib/server/cache';
import { fetchLessons, icalUrl } from '../../../lib/server/lessons';
import { mockLessons } from '../../../lib/mocks/lessons';
import { privateJson, unavailable } from '../../../lib/server/respond';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const denied = ownerGate(request);
	if (denied) return denied;

	if (!icalUrl()) {
		return import.meta.env.DEV ? privateJson(mockLessons().data!) : unavailable('TUTORING_ICAL_URL is not set');
	}

	try {
		const { value, updatedAt } = await cached('lessons', 10 * 60_000, () => fetchLessons());
		return privateJson({ ...value, updatedAt });
	} catch (error) {
		return unavailable(error);
	}
};
