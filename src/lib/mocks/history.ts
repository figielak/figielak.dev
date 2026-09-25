/**
 * CPU and RAM of the homelab over the last 24 hours (koncept.md §3.4), in
 * 5-minute buckets, oldest first. Collected by the site from the agent's
 * pushes (src/lib/server/history.ts); private, since the rhythm of use shows
 * when someone is at home (§14).
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

export const HISTORY_STEP_MIN = 5;
export const HISTORY_HOURS = 24;
/** Buckets in the window: 288. */
export const HISTORY_POINTS = (HISTORY_HOURS * 60) / HISTORY_STEP_MIN;

export interface HistoryPoint {
	/** Start of the 5-minute bucket, ISO. */
	t: string;
	/** Averages over the bucket, percent 0–100. */
	cpu: number;
	ram: number;
}

export type History = Live<{ points: HistoryPoint[] }>;

const STEP_MS = HISTORY_STEP_MIN * 60_000;
const bucket = (ms: number) => Math.floor(ms / STEP_MS) * STEP_MS;

export function mockHistory(state: LiveState = 'ok'): History {
	if (state === 'loading' || state === 'error') return { state };

	const now = bucket(Date.now());
	const points: HistoryPoint[] = [];
	for (let i = HISTORY_POINTS - 1; i >= 0; i--) {
		/* A two-hour gap, as when the Pi was offline. */
		if (i > 150 && i < 175) continue;
		const hour = new Date(now - i * STEP_MS).getHours();
		const evening = hour >= 18 && hour <= 23 ? 12 : 0;
		points.push({
			t: new Date(now - i * STEP_MS).toISOString(),
			cpu: Math.round((4 + evening + 3 * Math.sin(i / 7) + (i % 17 === 0 ? 20 : 0)) * 10) / 10,
			ram: Math.round((22 + evening / 3 + 2 * Math.sin(i / 40)) * 10) / 10,
		});
	}
	return { state, data: { points, updatedAt: mockUpdatedAt(state) } };
}
