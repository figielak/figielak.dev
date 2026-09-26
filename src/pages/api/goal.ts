/**
 * The goal for the public tile (docs/koncept.md §3.4), cached 60 s. Before the
 * first save from the private dashboard `goal` is null and the tile keeps
 * the one from src/lib/goal.ts.
 */
import type { APIRoute } from 'astro';
import { cached } from '../../lib/server/cache';
import { readGoal } from '../../lib/server/goal';
import { liveJson, unavailable } from '../../lib/server/respond';

export const prerender = false;

export const GET: APIRoute = async () => {
	try {
		const { value, updatedAt } = await cached('goal', import.meta.env.DEV ? 0 : 60_000, readGoal);
		return liveJson({ goal: value.goal, updatedAt: value.updatedAt ?? updatedAt }, 60);
	} catch (error) {
		return unavailable(error);
	}
};
