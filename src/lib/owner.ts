/**
 * Guard for the private dashboard (koncept.md §14): HTTP Basic Auth against
 * DASHBOARD_PASSWORD, a Secret Manager value that Cloud Run passes in at
 * runtime. The check runs on the server for every request, so it also holds
 * for path variants and the *.run.app address that bypass Cloudflare.
 *
 * Any user name is accepted; only the password counts.
 */
import { createHash, timingSafeEqual } from 'node:crypto';

/* Header values must be Latin-1 — no typographic dashes here. */
const REALM = 'figielak.dev private';

/* Read at request time — `import.meta.env` would bake it into the build. */
const password = () => process.env.DASHBOARD_PASSWORD ?? '';

/** Hashing first gives equal-length buffers, so the comparison is constant-time. */
const digest = (value: string) => createHash('sha256').update(value).digest();

function presentedPassword(request: Request): string | null {
	const header = request.headers.get('authorization') ?? '';
	const [scheme, encoded] = header.split(' ');
	if (scheme?.toLowerCase() !== 'basic' || !encoded) return null;

	const decoded = Buffer.from(encoded, 'base64').toString('utf8');
	const colon = decoded.indexOf(':');
	return colon === -1 ? null : decoded.slice(colon + 1);
}

/**
 * Null when the request may see private content, otherwise the response to
 * send instead. Without a configured password everything is refused, except
 * in `astro dev`.
 */
export function ownerGate(request: Request): Response | null {
	const expected = password();
	if (!expected) {
		return import.meta.env.DEV ? null : new Response('Not configured', { status: 503 });
	}

	const given = presentedPassword(request);
	if (given !== null && timingSafeEqual(digest(given), digest(expected))) return null;

	return new Response('Unauthorized', {
		status: 401,
		headers: {
			'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
			'Cache-Control': 'no-store',
		},
	});
}
