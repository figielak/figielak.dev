/**
 * What expires and when, for the private dashboard (docs/koncept.md §3.4, §9).
 * Read where a source tells: the domain from RDAP, the certificate from the
 * TLS handshake, the GitHub token from an API response header and the
 * Cloudflare token from its verify endpoint. Tokens that tell nobody are
 * listed by hand below — a name and a date only, never a value.
 *
 * Every source is asked on its own: one that fails leaves its item without a
 * date instead of failing the tile.
 */
import { connect } from 'node:tls';
import type { ExpiryItem } from '../mocks/expiring';
import { githubToken } from './github';
import { cloudflareToken } from './cfanalytics';

const SITE = 'figielak.dev';
const TIMEOUT_MS = 10_000;

/* Set when a token is made; bump with every new one. */
const MANUAL: { name: string; expiresAt: string }[] = [{ name: 'Token Hardcover', expiresAt: '2027-09-25' }];

async function domainExpiry(): Promise<Date> {
	/* rdap.org refuses requests without a user agent (403). */
	const response = await fetch(`https://rdap.org/domain/${SITE}`, {
		headers: { Accept: 'application/rdap+json', 'User-Agent': 'figielak.dev' },
		signal: AbortSignal.timeout(TIMEOUT_MS),
	});
	if (!response.ok) throw new Error(`RDAP responded ${response.status}`);
	const { events = [] } = (await response.json()) as { events?: { eventAction: string; eventDate: string }[] };
	const expiration = events.find((event) => event.eventAction === 'expiration');
	if (!expiration) throw new Error('RDAP: no expiration event');
	return new Date(expiration.eventDate);
}

function certExpiry(): Promise<Date> {
	return new Promise((resolve, reject) => {
		const socket = connect({ host: SITE, port: 443, servername: SITE, timeout: TIMEOUT_MS }, () => {
			const { valid_to } = socket.getPeerCertificate();
			socket.end();
			valid_to ? resolve(new Date(valid_to)) : reject(new Error('TLS: no certificate'));
		});
		socket.on('timeout', () => socket.destroy(new Error('TLS: timeout')));
		socket.on('error', reject);
	});
}

/* A fine-grained or classic token with an expiry sends it on every response. */
async function githubExpiry(): Promise<Date> {
	const response = await fetch('https://api.github.com/rate_limit', {
		headers: { Authorization: `Bearer ${githubToken()}`, 'User-Agent': 'figielak.dev' },
		signal: AbortSignal.timeout(TIMEOUT_MS),
	});
	const header = response.headers.get('github-authentication-token-expiration');
	if (!response.ok || !header) throw new Error(`GitHub: ${response.status}, no expiry header`);
	return new Date(header.replace(' UTC', 'Z').replace(' ', 'T'));
}

async function cloudflareExpiry(): Promise<Date> {
	const response = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
		headers: { Authorization: `Bearer ${cloudflareToken()}` },
		signal: AbortSignal.timeout(TIMEOUT_MS),
	});
	const body = (await response.json().catch(() => ({}))) as { result?: { expires_on?: string } };
	if (!response.ok || !body.result?.expires_on) throw new Error(`Cloudflare: ${response.status}, no expiry`);
	return new Date(body.result.expires_on);
}

async function item(name: string, kind: ExpiryItem['kind'], read: () => Promise<Date>): Promise<ExpiryItem> {
	try {
		return { name, kind, expiresAt: await read() };
	} catch (error) {
		console.warn(`[expiring] ${name}:`, error);
		return { name, kind };
	}
}

export async function fetchExpiring(): Promise<{ items: ExpiryItem[] }> {
	const items = await Promise.all([
		item(SITE, 'domain', domainExpiry),
		item(SITE, 'cert', certExpiry),
		...(githubToken() ? [item('Token GitHub', 'token', githubExpiry)] : []),
		...(cloudflareToken() ? [item('Token Cloudflare', 'token', cloudflareExpiry)] : []),
		...MANUAL.map(({ name, expiresAt }) => item(name, 'token', async () => new Date(expiresAt))),
	]);
	/* Soonest first; the ones without a date at the end. */
	const time = (i: ExpiryItem) => i.expiresAt?.getTime() ?? Infinity;
	return { items: items.sort((a, b) => time(a) - time(b)) };
}
