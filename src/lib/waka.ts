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

/** Today against the average of the week's earlier days, in minutes; null on a Monday. */
export function vsAverage(days: number[]): number | null {
	const earlier = days.slice(0, -1);
	if (!earlier.length) return null;
	const average = earlier.reduce((sum, m) => sum + m, 0) / earlier.length;
	return Math.round((days.at(-1) ?? 0) - average);
}

/** The colour token of a language: `TypeScript` → `--lang-typescript`, `C++` → `--lang-cpp`. */
export function languageColor(name: string): string {
	const slug = name
		.toLowerCase()
		.replaceAll('++', 'pp')
		.replaceAll('#', 'sharp')
		.replace(/[^a-z0-9]/g, '');
	return `var(--lang-${slug}, var(--lang-other))`;
}

export interface Segment {
	name: string;
	percent: number;
	color: string;
}

/** The language bar: each language, then the rest of the week as "other". */
export function languageSegments(languages: { name: string; percent: number }[], other: string): Segment[] {
	const segments = languages
		.filter((language) => language.percent > 0)
		.map((language) => ({ ...language, color: languageColor(language.name) }));
	const rest = 100 - segments.reduce((sum, s) => sum + s.percent, 0);
	if (rest > 0) segments.push({ name: other, percent: rest, color: 'var(--lang-other)' });
	return segments;
}
