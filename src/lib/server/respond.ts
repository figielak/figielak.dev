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

/** Data for the private dashboard (koncept.md §14): never cached anywhere. */
export function privateJson(data: object, status = 200): Response {
	return Response.json(data, { status, headers: { 'Cache-Control': 'private, no-store' } });
}

/**
 * Writes from the private dashboard take JSON only (koncept.md §14): a
 * cross-site form cannot send it, and a cross-site fetch needs a CORS
 * preflight this server never allows. Null when the request is JSON.
 */
export function requireJson(request: Request): Response | null {
	const type = request.headers.get('content-type') ?? '';
	return type.split(';')[0].trim() === 'application/json' ? null : privateJson({ error: 'expected JSON' }, 415);
}
