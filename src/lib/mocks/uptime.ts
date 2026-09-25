/**
 * Homelab uptime and service status as the uptime tile shows them, and mocks
 * for /dev/tiles and `astro dev`. Live data: /api/homelab/uptime (koncept.md §9).
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

/** Generic service kinds — no host names on a public page (koncept.md §14). */
export const SERVICE_KINDS = ['media', 'files', 'dns', 'backup'] as const;
export type ServiceKind = (typeof SERVICE_KINDS)[number];

export interface ServiceStatus {
	kind: ServiceKind;
	up: boolean;
	/** Percent over the last 30 days, 0–100. */
	uptime30d?: number;
	/** Average response time over the last 30 days. */
	avgMs?: number;
}

/**
 * Only the kinds that exist are listed; the tile shows the rest as "—",
 * not as down.
 */
export type Uptime = Live<{
	/** Host uptime; fractional. */
	uptimeDays: number;
	services: ServiceStatus[];
}>;

export const UPTIME_PLACEHOLDER: NonNullable<Uptime['data']> = {
	uptimeDays: 0,
	services: [],
	updatedAt: new Date(0),
};

export function mockUptime(state: LiveState = 'ok'): Uptime {
	if (state === 'loading' || state === 'error') return { state };

	return {
		state,
		data: {
			uptimeDays: 1.38,
			services: [
				{ kind: 'dns', up: true, uptime30d: 99.98, avgMs: 3 },
				{ kind: 'media', up: false, uptime30d: 99.9, avgMs: 45 },
			],
			updatedAt: mockUpdatedAt(state),
		},
	};
}
