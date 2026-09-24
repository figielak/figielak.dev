/** JSON responses shared by the live-data endpoints in /api/* (koncept.md §9). */

/** Data for a live tile; browsers may reuse it for `maxAge` seconds. */
export function liveJson(data: object, maxAge: number): Response {
	return Response.json(data, { headers: { 'Cache-Control': `public, max-age=${maxAge}` } });
}

/** The tile shows its error state; details stay in the server log. */
export function unavailable(reason: unknown): Response {
	console.error('[api]', reason);
	return Response.json({ error: 'unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
}
