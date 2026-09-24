/**
 * Mock GitHub stats until the GraphQL endpoint exists (koncept.md §9).
 * Shape matches the future /api/github response.
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

/** Contribution intensity, 0 = none, 4 = most — GitHub's own four levels. */
export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type Github = Live<{
	/** 53 weeks, oldest first; each week holds 7 days, Sunday first. */
	weeks: ContributionLevel[][];
	contributions: number;
	streakDays: number;
	repos: number;
}>;

const WEEKS = 53;

function emptyWeeks(): ContributionLevel[][] {
	return Array.from({ length: WEEKS }, () => Array<ContributionLevel>(7).fill(0));
}

export const GITHUB_PLACEHOLDER: NonNullable<Github['data']> = {
	weeks: emptyWeeks(),
	contributions: 0,
	streakDays: 0,
	repos: 0,
	updatedAt: new Date(0),
};

/** Small seeded PRNG, so the mock chart is identical on every build. */
function seeded(seed: number) {
	return () => {
		seed = (seed * 1_103_515_245 + 12_345) % 2 ** 31;
		return seed / 2 ** 31;
	};
}

function mockWeeks(): ContributionLevel[][] {
	const random = seeded(42);
	return Array.from({ length: WEEKS }, (_, week) =>
		Array.from({ length: 7 }, (_, day) => {
			// Busier towards the present and on weekdays.
			const activity = random() * (0.4 + week / WEEKS) * (day === 0 || day === 6 ? 0.6 : 1);
			return Math.min(4, Math.floor(activity * 5)) as ContributionLevel;
		}),
	);
}

export function mockGithub(state: LiveState = 'ok'): Github {
	if (state === 'loading' || state === 'error') return { state };

	return {
		state,
		data: {
			weeks: mockWeeks(),
			contributions: 847,
			streakDays: 12,
			repos: 18,
			updatedAt: mockUpdatedAt(state),
		},
	};
}
