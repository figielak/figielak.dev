/**
 * "3 h ago" in the page language, for the private dashboard's lists
 * (deploys, backup, lessons). Shared by the server render and the browser.
 */
export function ago(date: Date, lang: string, now = Date.now()): string {
	const format = new Intl.RelativeTimeFormat(lang, { numeric: 'auto', style: 'short' });
	const minutes = Math.round((now - date.getTime()) / 60_000);
	if (minutes < 60) return format.format(-Math.max(minutes, 0), 'minute');
	if (minutes < 1440) return format.format(-Math.round(minutes / 60), 'hour');
	return format.format(-Math.round(minutes / 1440), 'day');
}

/** Whole days from now until `date`; negative once it has passed. */
export function daysUntil(date: Date, now = Date.now()): number {
	return Math.floor((date.getTime() - now) / 86_400_000);
}
