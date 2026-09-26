/**
 * Mock WakaTime stats until the endpoint exists (docs/koncept.md §9).
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
	languages: [
		{ name: '—', percent: 0 },
		{ name: '—', percent: 0 },
		{ name: '—', percent: 0 },
	],
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
			updatedAt: mockUpdatedAt(state),
		},
	};
}
