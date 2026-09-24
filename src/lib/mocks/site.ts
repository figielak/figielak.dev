/**
 * Mock site analytics until the Umami/Plausible endpoint exists
 * (koncept.md §9). Private dashboard only.
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

export type SiteStats = Live<{
	visitorsToday: number;
	visitorsWeek: number;
	/** Visitors right now. */
	online: number;
	topPage: string;
}>;

export const SITE_PLACEHOLDER: NonNullable<SiteStats['data']> = {
	visitorsToday: 0,
	visitorsWeek: 0,
	online: 0,
	topPage: '/',
	updatedAt: new Date(0),
};

export function mockSite(state: LiveState = 'ok'): SiteStats {
	if (state === 'loading' || state === 'error') return { state };

	return {
		state,
		data: {
			visitorsToday: 38,
			visitorsWeek: 214,
			online: 2,
			topPage: '/maths',
			updatedAt: mockUpdatedAt(state),
		},
	};
}
