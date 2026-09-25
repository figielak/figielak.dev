/**
 * Site analytics for the private dashboard (koncept.md §3.4), as
 * /api/private/site returns them from Cloudflare Web Analytics: the last 7
 * days, the most visited pages and where visitors came from.
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

export type SiteStats = Live<{
	/** Oldest first; the last one is today (UTC, as Cloudflare counts). */
	days: { date: string; visits: number }[];
	visitsWeek: number;
	pageviewsWeek: number;
	topPages: { path: string; visits: number }[];
	/** `host` is empty for direct visits. */
	referrers: { host: string; visits: number }[];
}>;

export const SITE_DAYS = 7;
export const SITE_TOP = 3;

const isoDay = (daysAgo: number) => new Date(Date.now() - daysAgo * 86_400_000).toISOString().slice(0, 10);

export const SITE_PLACEHOLDER: NonNullable<SiteStats['data']> = {
	days: Array.from({ length: SITE_DAYS }, (_, i) => ({ date: isoDay(SITE_DAYS - 1 - i), visits: 0 })),
	visitsWeek: 0,
	pageviewsWeek: 0,
	topPages: Array.from({ length: SITE_TOP }, () => ({ path: '/', visits: 0 })),
	referrers: Array.from({ length: SITE_TOP }, () => ({ host: '—', visits: 0 })),
	updatedAt: new Date(0),
};

export function mockSite(state: LiveState = 'ok'): SiteStats {
	if (state === 'loading' || state === 'error') return { state };

	const visits = [22, 31, 18, 40, 27, 52, 38];
	return {
		state,
		data: {
			days: visits.map((v, i) => ({ date: isoDay(SITE_DAYS - 1 - i), visits: v })),
			visitsWeek: visits.reduce((a, b) => a + b, 0),
			pageviewsWeek: 412,
			topPages: [
				{ path: '/', visits: 96 },
				{ path: '/dashboard', visits: 71 },
				{ path: '/maths', visits: 44 },
			],
			referrers: [
				{ host: '', visits: 118 },
				{ host: 'www.linkedin.com', visits: 54 },
				{ host: 'github.com', visits: 31 },
			],
			updatedAt: mockUpdatedAt(state),
		},
	};
}
