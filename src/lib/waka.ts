/**
 * The numbers the WakaTime tile draws from its data, shared by the build and
 * the browser (src/components/tiles/WakaTile.astro).
 */

export type DayState = 'past' | 'today' | 'future';

export interface WeekBar {
	/** Height against the best day of the week, 0–1. */
	height: number;
	state: DayState;
}

/** Seven bars, Monday to Sunday, from the minutes of the days so far. */
export function weekBars(days: number[]): WeekBar[] {
	const best = Math.max(1, ...days);
	const today = days.length - 1;
	return Array.from({ length: 7 }, (_, i) => ({
		height: i <= today ? (days[i] ?? 0) / best : 0,
		state: i < today ? 'past' : i === today ? 'today' : 'future',
	}));
}

/* One palette by rank, not by language: the accent for the leading one, greys
   after it, and the dimmest for the rest of the week (docs/design.md §2). */
const RANK_COLORS = ['var(--accent)', 'var(--text-muted)', 'var(--text-subtle)'];
const REST_COLOR = 'var(--chart-rest)';

export interface Segment {
	name: string;
	percent: number;
	color: string;
}

/** The language bar: each language (sorted, largest first), then the rest of the week as "other". */
export function languageSegments(languages: { name: string; percent: number }[], other: string): Segment[] {
	const segments = languages
		.filter((language) => language.percent > 0)
		.map((language, i) => ({ ...language, color: RANK_COLORS[i] ?? REST_COLOR }));
	if (segments.length === 0) return [];
	const rest = 100 - segments.reduce((sum, s) => sum + s.percent, 0);
	if (rest > 0) segments.push({ name: other, percent: rest, color: REST_COLOR });
	return segments;
}
