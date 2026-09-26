/**
 * GitHub stats for the dashboard from the GraphQL API (docs/koncept.md §9).
 * GITHUB_TOKEN is a server secret read at runtime; it needs no scopes, as
 * only public data is read.
 */
import type { ContributionLevel, Github } from '../mocks/github';

export type GithubData = Omit<NonNullable<Github['data']>, 'updatedAt'>;

const WEEKS = 53;

const QUERY = `query ($login: String!) {
	user(login: $login) {
		contributionsCollection {
			contributionCalendar {
				totalContributions
				weeks { contributionDays { date weekday contributionCount contributionLevel } }
			}
		}
		repositories(ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false) { totalCount }
	}
}`;

interface Day {
	date: string;
	weekday: number;
	contributionCount: number;
	contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';
}

interface Response {
	data?: {
		user: {
			contributionsCollection: {
				contributionCalendar: { totalContributions: number; weeks: { contributionDays: Day[] }[] };
			};
			repositories: { totalCount: number };
		} | null;
	};
	errors?: { message: string }[];
}

const LEVELS: Record<Day['contributionLevel'], ContributionLevel> = {
	NONE: 0,
	FIRST_QUARTILE: 1,
	SECOND_QUARTILE: 2,
	THIRD_QUARTILE: 3,
	FOURTH_QUARTILE: 4,
};

export const githubToken = () => process.env.GITHUB_TOKEN ?? '';

/** Days in a row with a contribution, ending today — or yesterday, while today is still empty. */
function streak(days: Day[]): number {
	let i = days.length - 1;
	if (days[i]?.contributionCount === 0) i--;
	let count = 0;
	while (i >= 0 && days[i].contributionCount > 0) {
		count++;
		i--;
	}
	return count;
}

/** Exactly WEEKS full weeks, Sunday first; days GitHub leaves out (before the range, the future) are empty. */
function toWeeks(weeks: { contributionDays: Day[] }[]): ContributionLevel[][] {
	const full = weeks.slice(-WEEKS).map((week) => {
		const levels = Array<ContributionLevel>(7).fill(0);
		for (const day of week.contributionDays) levels[day.weekday] = LEVELS[day.contributionLevel];
		return levels;
	});
	while (full.length < WEEKS) full.unshift(Array<ContributionLevel>(7).fill(0));
	return full;
}

export async function fetchGithub(login: string): Promise<GithubData> {
	const response = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: {
			Authorization: `bearer ${githubToken()}`,
			'Content-Type': 'application/json',
			'User-Agent': 'figielak.dev',
		},
		body: JSON.stringify({ query: QUERY, variables: { login } }),
		signal: AbortSignal.timeout(10_000),
	});
	if (!response.ok) throw new Error(`GitHub responded ${response.status}`);

	const body = (await response.json()) as Response;
	const user = body.data?.user;
	if (!user) throw new Error(`GitHub: ${body.errors?.map((e) => e.message).join('; ') ?? 'no user'}`);

	const calendar = user.contributionsCollection.contributionCalendar;
	return {
		weeks: toWeeks(calendar.weeks),
		contributions: calendar.totalContributions,
		streakDays: streak(calendar.weeks.flatMap((week) => week.contributionDays)),
		repos: user.repositories.totalCount,
	};
}
