/**
 * The last deploys for the private dashboard (docs/koncept.md §3.4), cached 60 s.
 * Owner only (src/lib/owner.ts). Without GITHUB_TOKEN `astro dev` serves the
 * mock, production answers 503.
 */
import type { APIRoute } from 'astro';
import { ownerGate } from '../../../lib/owner';
import { cached } from '../../../lib/server/cache';
import { fetchDeploys } from '../../../lib/server/deploys';
import { githubToken } from '../../../lib/server/github';
import { mockDeploy } from '../../../lib/mocks/deploy';
import { privateJson, unavailable } from '../../../lib/server/respond';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const denied = ownerGate(request);
	if (denied) return denied;

	if (!githubToken()) {
		return import.meta.env.DEV ? privateJson(mockDeploy().data!) : unavailable('GITHUB_TOKEN is not set');
	}

	try {
		const { value, updatedAt } = await cached('deploys', 60_000, fetchDeploys);
		return privateJson({ ...value, updatedAt });
	} catch (error) {
		return unavailable(error);
	}
};
