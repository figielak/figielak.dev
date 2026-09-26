/**
 * What expires and when (docs/koncept.md §3.4): the domain, the certificate and
 * the API tokens, soonest first. Private dashboard only.
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

export type ExpiryKind = 'domain' | 'cert' | 'token';

export interface ExpiryItem {
	name: string;
	kind: ExpiryKind;
	/** Missing when its source did not answer; such an item goes last. */
	expiresAt?: Date;
}

export type Expiring = Live<{ items: ExpiryItem[] }>;

/** Items due within this many days are red. */
export const EXPIRY_WARN_DAYS = 30;

export const EXPIRING_PLACEHOLDER: NonNullable<Expiring['data']> = {
	items: Array.from({ length: 4 }, () => ({ name: '—', kind: 'token' })),
	updatedAt: new Date(0),
};

const inDays = (days: number) => new Date(Date.now() + days * 86_400_000);

export function mockExpiring(state: LiveState = 'ok'): Expiring {
	if (state === 'loading' || state === 'error') return { state };

	return {
		state,
		data: {
			items: [
				{ name: 'Token GitHub', kind: 'token', expiresAt: inDays(12) },
				{ name: 'figielak.dev', kind: 'cert', expiresAt: inDays(41) },
				{ name: 'figielak.dev', kind: 'domain', expiresAt: inDays(256) },
				{ name: 'Token Hardcover', kind: 'token', expiresAt: inDays(365) },
				{ name: 'Token Cloudflare', kind: 'token' },
			],
			updatedAt: mockUpdatedAt(state),
		},
	};
}
