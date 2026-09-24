/**
 * Homelab network numbers — DNS ad blocking and the homelab's own traffic —
 * as the tiles show them, and mocks for /dev/tiles and `astro dev`. Live data:
 * /api/homelab/dns and /api/homelab/net (koncept.md §9).
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

export type Dns = Live<{
	queriesToday: number;
	blockedToday: number;
	/** Last 7 days, today included. */
	queriesWeek?: number;
	blockedWeek?: number;
}>;

/** Traffic of the homelab itself (the Pi's Wi-Fi), not the whole home. GiB. */
export type Traffic = Live<{
	downGbToday: number;
	upGbToday: number;
	downGbTotal: number;
	upGbTotal: number;
	/** YYYY-MM-DD: the totals count from here (first run of the agent). */
	totalSince: string;
}>;

export const DNS_PLACEHOLDER: NonNullable<Dns['data']> = {
	queriesToday: 0,
	blockedToday: 0,
	queriesWeek: 0,
	blockedWeek: 0,
	updatedAt: new Date(0),
};

export const TRAFFIC_PLACEHOLDER: NonNullable<Traffic['data']> = {
	downGbToday: 0,
	upGbToday: 0,
	downGbTotal: 0,
	upGbTotal: 0,
	totalSince: '2026-01-01',
	updatedAt: new Date(0),
};

export function mockDns(state: LiveState = 'ok'): Dns {
	if (state === 'loading' || state === 'error') return { state };
	return {
		state,
		data: {
			queriesToday: 3_077,
			blockedToday: 202,
			queriesWeek: 21_457,
			blockedWeek: 1_982,
			updatedAt: mockUpdatedAt(state),
		},
	};
}

export function mockTraffic(state: LiveState = 'ok'): Traffic {
	if (state === 'loading' || state === 'error') return { state };
	return {
		state,
		data: {
			downGbToday: 1.8,
			upGbToday: 0.4,
			downGbTotal: 12.4,
			upGbTotal: 3.1,
			totalSince: '2026-09-24',
			updatedAt: mockUpdatedAt(state),
		},
	};
}
