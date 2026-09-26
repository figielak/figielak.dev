/**
 * Coding time from WakaTime for the dashboard (docs/koncept.md §9): today, each
 * day of this week since Monday and the week's top languages. WAKATIME_API_KEY is a
 * server secret read at runtime.
 */
import type { Waka } from '../mocks/waka';

export type WakaData = Omit<NonNullable<Waka['data']>, 'updatedAt'>;

const TIME_ZONE = 'Europe/Warsaw';

export const wakatimeKey = () => process.env.WAKATIME_API_KEY ?? '';

interface Summaries {
	data: {
		grand_total: { total_seconds: number };
		languages: { name: string; total_seconds: number }[];
	}[];
}

/** Monday and today in TIME_ZONE as YYYY-MM-DD. */
function thisWeek(now = new Date()): { start: string; end: string } {
	const end = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(now);
	const today = new Date(`${end}T00:00:00Z`);
	const sinceMonday = (today.getUTCDay() + 6) % 7;
	const start = new Date(today.getTime() - sinceMonday * 86_400_000).toISOString().slice(0, 10);
	return { start, end };
}

const minutes = (seconds: number) => Math.round(seconds / 60);

export async function fetchWaka(): Promise<WakaData> {
	const url = new URL('https://wakatime.com/api/v1/users/current/summaries');
	url.search = new URLSearchParams({ ...thisWeek(), timezone: TIME_ZONE }).toString();

	const response = await fetch(url, {
		headers: {
			Authorization: `Basic ${Buffer.from(wakatimeKey()).toString('base64')}`,
			'User-Agent': 'figielak.dev',
		},
		signal: AbortSignal.timeout(10_000),
	});
	if (!response.ok) throw new Error(`WakaTime responded ${response.status}`);

	const { data: days } = (await response.json()) as Summaries;
	const weekSeconds = days.reduce((sum, day) => sum + day.grand_total.total_seconds, 0);

	const byLanguage = new Map<string, number>();
	for (const day of days) {
		for (const { name, total_seconds } of day.languages) {
			byLanguage.set(name, (byLanguage.get(name) ?? 0) + total_seconds);
		}
	}
	/* "Other" is WakaTime's bucket for files it could not recognise, not a language. */
	byLanguage.delete('Other');
	const languages = [...byLanguage]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([name, seconds]) => ({ name, percent: weekSeconds ? Math.round((seconds / weekSeconds) * 100) : 0 }));

	return {
		todayMin: minutes(days.at(-1)?.grand_total.total_seconds ?? 0),
		weekMin: minutes(weekSeconds),
		days: days.map((day) => minutes(day.grand_total.total_seconds)),
		languages,
	};
}
