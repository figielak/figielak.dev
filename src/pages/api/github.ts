/**
 * GitHub stats for the dashboard tile, cached 1 h (docs/koncept.md §9).
 * Without GITHUB_TOKEN `astro dev` serves the mock, production answers 503.
 */
import type { APIRoute } from 'astro';
import { githubUser } from '../../lib/contact';
import { cached } from '../../lib/server/cache';
import { fetchGithub, githubToken } from '../../lib/server/github';
import { mockGithub } from '../../lib/mocks/github';
import { liveJson, unavailable } from '../../lib/server/respond';

export const prerender = false;

const HOUR = 60 * 60_000;

export const GET: APIRoute = async () => {
	if (!githubToken()) {
		return import.meta.env.DEV ? liveJson(mockGithub().data!, 60) : unavailable('GITHUB_TOKEN is not set');
	}

	try {
		const { value, updatedAt } = await cached('github', HOUR, () => fetchGithub(githubUser));
		return liveJson({ ...value, updatedAt }, 600);
	} catch (error) {
		return unavailable(error);
	}
};
