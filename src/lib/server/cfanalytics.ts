/**
 * Cloudflare Web Analytics for the private dashboard (koncept.md §9): the
 * beacon Cloudflare injects on the proxied site counts visits without
 * cookies, and the GraphQL API reads them back. CF_ANALYTICS_TOKEN (Account
 * Analytics: Read) is a server secret, CF_ACCOUNT_ID and
 * CF_WEB_ANALYTICS_SITE_TAG plain settings, all read at runtime.
 */
import { SITE_DAYS, SITE_TOP, type SiteStats } from '../mocks/site';

export type SiteData = Omit<NonNullable<SiteStats['data']>, 'updatedAt'>;

export const cloudflareToken = () => process.env.CF_ANALYTICS_TOKEN ?? '';
export const cloudflareConfig = () => ({
	token: cloudflareToken(),
	accountTag: process.env.CF_ACCOUNT_ID ?? '',
	siteTag: process.env.CF_WEB_ANALYTICS_SITE_TAG ?? '',
});

/* Visits coming from the site itself are moves between its pages, not a source. */
const OWN_HOSTS = ['figielak.dev', 'www.figielak.dev'];

const FILTER = '{ siteTag: $siteTag, datetime_geq: $since, datetime_leq: $until }';

const QUERY = `query ($accountTag: string!, $siteTag: string!, $since: Time!, $until: Time!) {
	viewer {
		accounts(filter: { accountTag: $accountTag }) {
			days: rumPageloadEventsAdaptiveGroups(limit: 10, filter: ${FILTER}, orderBy: [date_ASC]) {
				count
				sum { visits }
				dimensions { date }
			}
			pages: rumPageloadEventsAdaptiveGroups(limit: ${SITE_TOP}, filter: ${FILTER}, orderBy: [sum_visits_DESC]) {
				sum { visits }
				dimensions { requestPath }
			}
			referrers: rumPageloadEventsAdaptiveGroups(limit: ${SITE_TOP + OWN_HOSTS.length}, filter: ${FILTER}, orderBy: [sum_visits_DESC]) {
				sum { visits }
				dimensions { refererHost }
			}
		}
	}
}`;

interface Group<D> {
	count?: number;
	sum: { visits: number };
	dimensions: D;
}

interface Response {
	data?: {
		viewer: {
			accounts: {
				days: Group<{ date: string }>[];
				pages: Group<{ requestPath: string }>[];
				referrers: Group<{ refererHost: string }>[];
			}[];
		};
	} | null;
	errors?: { message: string }[] | null;
}

const isoDay = (date: Date) => date.toISOString().slice(0, 10);

export async function fetchSite(now = new Date()): Promise<SiteData> {
	const { token, accountTag, siteTag } = cloudflareConfig();
	const today = new Date(`${isoDay(now)}T00:00:00Z`);
	const since = new Date(today.getTime() - (SITE_DAYS - 1) * 86_400_000);

	const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({
			query: QUERY,
			variables: {
				accountTag,
				siteTag,
				since: since.toISOString(),
				until: now.toISOString(),
			},
		}),
		signal: AbortSignal.timeout(10_000),
	});
	const body = (await response.json().catch(() => ({}))) as Response;
	const account = body.data?.viewer.accounts[0];
	if (!response.ok || body.errors?.length || !account) {
		throw new Error(`Cloudflare: ${body.errors?.[0]?.message ?? `HTTP ${response.status}`}`);
	}

	/* Every day of the week, also the ones without a visit. */
	const byDay = new Map(account.days.map((g) => [g.dimensions.date, g]));
	const days = Array.from({ length: SITE_DAYS }, (_, i) => {
		const date = isoDay(new Date(since.getTime() + i * 86_400_000));
		return { date, visits: byDay.get(date)?.sum.visits ?? 0 };
	});

	return {
		days,
		visitsWeek: days.reduce((sum, day) => sum + day.visits, 0),
		pageviewsWeek: account.days.reduce((sum, g) => sum + (g.count ?? 0), 0),
		topPages: account.pages.map((g) => ({ path: g.dimensions.requestPath, visits: g.sum.visits })),
		referrers: account.referrers
			.filter((g) => !OWN_HOSTS.includes(g.dimensions.refererHost))
			.slice(0, SITE_TOP)
			.map((g) => ({ host: g.dimensions.refererHost, visits: g.sum.visits })),
	};
}
