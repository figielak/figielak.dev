/**
 * Mock WakaTime stats until the endpoint exists (docs/architecture.md §3).
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

export type Waka = Live<{
	todayMin: number;
	weekMin: number;
	/** Minutes per day from Monday up to today (so 1–7 entries). */
	days: number[];
	/** Top languages this week (up to five), share in percent. */
	languages: { name: string; percent: number }[];
}>;

export const WAKA_PLACEHOLDER: NonNullable<Waka['data']> = {
	todayMin: 0,
	weekMin: 0,
	days: [0, 0, 0, 0, 0],
	languages: [],
	updatedAt: new Date(0),
};

export function mockWaka(state: LiveState = 'ok'): Waka {
	if (state === 'loading' || state === 'error') return { state };

	return {
		state,
		data: {
			todayMin: 192,
			weekMin: 1_120,
			days: [236, 118, 305, 269, 192],
			languages: [
				{ name: 'TypeScript', percent: 48 },
				{ name: 'Astro', percent: 27 },
				{ name: 'Python', percent: 14 },
				{ name: 'CSS', percent: 6 },
				{ name: 'Bash', percent: 2 },
			],
			updatedAt: state === 'stale' ? new Date(Date.now() - 4 * 60 * 60_000) : mockUpdatedAt(state),
		},
	};
}

/** A quiet week or tracked activity with no code languages after filtering. */
export function mockWakaWithoutLanguages(weekMin = 0, state: 'ok' | 'stale' = 'ok'): Waka {
	return {
		state,
		data: {
			todayMin: weekMin,
			weekMin,
			days: [weekMin],
			languages: [],
			updatedAt: state === 'stale' ? new Date(Date.now() - 4 * 60 * 60_000) : mockUpdatedAt(state),
		},
	};
}
