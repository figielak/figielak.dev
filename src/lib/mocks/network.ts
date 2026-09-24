/**
 * Mock homelab network numbers — DNS ad blocking and traffic — until the push
 * agent reports them (koncept.md §9).
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

export type Dns = Live<{
	blockedToday: number;
}>;

export type Traffic = Live<{
	downGb: number;
	upGb: number;
}>;

export const DNS_PLACEHOLDER: NonNullable<Dns['data']> = {
	blockedToday: 0,
	updatedAt: new Date(0),
};

export const TRAFFIC_PLACEHOLDER: NonNullable<Traffic['data']> = {
	downGb: 0,
	upGb: 0,
	updatedAt: new Date(0),
};

export function mockDns(state: LiveState = 'ok'): Dns {
	if (state === 'loading' || state === 'error') return { state };
	return {
		state,
		data: { blockedToday: 1_284, updatedAt: mockUpdatedAt(state) },
	};
}

export function mockTraffic(state: LiveState = 'ok'): Traffic {
	if (state === 'loading' || state === 'error') return { state };
	return {
		state,
		data: { downGb: 18.2, upGb: 2.1, updatedAt: mockUpdatedAt(state) },
	};
}
