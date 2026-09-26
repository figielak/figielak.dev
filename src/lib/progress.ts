/**
 * How far through the day, month and year we are in Europe/Warsaw
 * (docs/koncept.md §3.4). Shared by the build and the browser script.
 */
export type ProgressSpan = 'day' | 'month' | 'year';

export const PROGRESS_SPANS: ProgressSpan[] = ['day', 'month', 'year'];

export const PROGRESS_ZONE = 'Europe/Warsaw';

const parts = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric',
	hourCycle: 'h23',
	timeZone: PROGRESS_ZONE,
});

/** Percent (0–100) of each span that has passed at `now`. */
export function progress(now: Date): Record<ProgressSpan, number> {
	const p = Object.fromEntries(
		parts.formatToParts(now).map((part) => [part.type, Number(part.value)]),
	);
	/* Wall-clock time in Warsaw, read as if it were UTC — so the spans below
	   need no time zone maths of their own. */
	const wall = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
	const share = (start: number, end: number) => ((wall - start) / (end - start)) * 100;

	return {
		day: share(Date.UTC(p.year, p.month - 1, p.day), Date.UTC(p.year, p.month - 1, p.day + 1)),
		month: share(Date.UTC(p.year, p.month - 1, 1), Date.UTC(p.year, p.month, 1)),
		year: share(Date.UTC(p.year, 0, 1), Date.UTC(p.year + 1, 0, 1)),
	};
}
