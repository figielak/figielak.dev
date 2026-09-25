/**
 * Push endpoint of the homelab agent (koncept.md §9, contract in
 * src/lib/server/homelab.ts). Needs STATS_PUSH_TOKEN, a Secret Manager value
 * read at runtime; without it production refuses everything and `astro dev`
 * accepts any push.
 *
 *   204  every section saved
 *   200  some saved, `rejected` lists the others with a reason
 *   400  bad envelope or no valid section
 *   401  wrong token · 413 body too large · 503 not configured or Firestore down
 */
import type { APIRoute } from 'astro';
import { isInvalid, parsePush, type Parsed, type Rejected } from '../../lib/server/homelab';
import { writePrivateSections, writeSections } from '../../lib/server/firestore';
import { appendHistory } from '../../lib/server/history';
import { sameSecret } from '../../lib/server/secret';

export const prerender = false;

const MAX_BODY_BYTES = 16 * 1024;

/* Read at request time — `import.meta.env` would bake it into the build. */
const pushToken = () => process.env.STATS_PUSH_TOKEN ?? '';

const reply = (status: number, body?: object) =>
	body
		? Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
		: new Response(null, { status, headers: { 'Cache-Control': 'no-store' } });

function authorized(request: Request): boolean | null {
	const expected = pushToken();
	if (!expected) return import.meta.env.DEV ? true : null;
	const [scheme, given] = (request.headers.get('authorization') ?? '').split(' ');
	return scheme?.toLowerCase() === 'bearer' && !!given && sameSecret(given, expected);
}

export const POST: APIRoute = async ({ request }) => {
	const auth = authorized(request);
	if (auth === null) return reply(503, { error: 'not configured' });
	if (!auth) return reply(401, { error: 'unauthorized' });

	const text = await request.text();
	if (Buffer.byteLength(text) > MAX_BODY_BYTES) return reply(413, { error: 'body too large' });

	let parsed: Parsed;
	try {
		parsed = parsePush(JSON.parse(text));
	} catch (error) {
		if (error instanceof SyntaxError) return reply(400, { error: 'body is not JSON' });
		if (isInvalid(error)) return reply(400, { error: error.message });
		throw error;
	}

	const saved = [...Object.keys(parsed.sections), ...Object.keys(parsed.privateSections)];
	const rejected: Rejected[] = parsed.rejected;
	if (rejected.length > 0) console.warn('[api/stats] rejected', rejected);
	if (saved.length === 0) return reply(400, { error: 'no valid section', rejected });

	try {
		await Promise.all([writeSections(parsed.sections), writePrivateSections(parsed.privateSections)]);
	} catch (error) {
		console.error('[api/stats]', error);
		return reply(503, { error: 'storage unavailable' });
	}

	/* The history is a nicety: a failure is logged and the push still counts. */
	if (parsed.sections.lab) {
		await appendHistory(parsed.sections.lab).catch((error) => console.error('[api/stats] history', error));
	}

	return rejected.length > 0 ? reply(200, { saved, rejected }) : reply(204);
};
