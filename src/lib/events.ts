/**
 * Important upcoming events for the countdown tile (docs/koncept.md §3.4).
 * Past events are skipped, so the list can simply grow.
 */
import type { Lang } from '../i18n';

export interface CountdownEvent {
	/** ISO date, e.g. `2026-12-24`. */
	date: string;
	title: Record<Lang, string>;
}

export const events: CountdownEvent[] = [
	{ date: '2026-12-24', title: { pl: 'Wigilia', en: 'Christmas Eve' } },
	{ date: '2027-01-01', title: { pl: 'Nowy Rok', en: "New Year's Day" } },
	/* 3–4 September, Tauron Arena Kraków; counts down to the first day. */
	{ date: '2027-09-03', title: { pl: 'HackYeah Kraków', en: 'HackYeah Kraków' } },
];

/** The first event on or after the day of `now`, or null when none is left. */
export function nextEvent(now: Date, list = events): CountdownEvent | null {
	const today = now.toISOString().slice(0, 10);
	return (
		[...list].sort((a, b) => a.date.localeCompare(b.date)).find((event) => event.date >= today) ??
		null
	);
}

/** Whole days from the day of `now` to `date` (0 = today). */
export function daysUntil(date: string, now: Date): number {
	const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
	return Math.round((Date.parse(date) - today) / 86_400_000);
}
