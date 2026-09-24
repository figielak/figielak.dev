/**
 * Health check for Cloud Run and the deploy smoke test. `K_REVISION` is set
 * by Cloud Run; locally it is missing.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = () =>
	Response.json(
		{ ok: true, revision: process.env.K_REVISION ?? 'local' },
		{ headers: { 'Cache-Control': 'no-store' } },
	);
