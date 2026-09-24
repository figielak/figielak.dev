/**
 * Mock homelab uptime until the push agent reports it (koncept.md §9).
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

/** Generic service kinds — no host names on a public page (koncept.md §14). */
export type ServiceKind = 'media' | 'files' | 'dns' | 'backup';

export type Uptime = Live<{
	uptimeDays: number;
	services: { kind: ServiceKind; up: boolean }[];
}>;

export const UPTIME_PLACEHOLDER: NonNullable<Uptime['data']> = {
	uptimeDays: 0,
	services: [
		{ kind: 'media', up: false },
		{ kind: 'files', up: false },
		{ kind: 'dns', up: false },
		{ kind: 'backup', up: false },
	],
	updatedAt: new Date(0),
};

export function mockUptime(state: LiveState = 'ok'): Uptime {
	if (state === 'loading' || state === 'error') return { state };

	return {
		state,
		data: {
			uptimeDays: 42,
			services: [
				{ kind: 'media', up: true },
				{ kind: 'files', up: true },
				{ kind: 'dns', up: true },
				{ kind: 'backup', up: false },
			],
			updatedAt: mockUpdatedAt(state),
		},
	};
}
