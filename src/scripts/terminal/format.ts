/**
 * Small helpers the commands share: bars, numbers, plurals and the quiet
 * "no data" line.
 */
import type { Context, Line } from './types';

export const ZONE = 'Europe/Warsaw';

/** Homelab bars turn red from this usage on, as in the tile (koncept.md §5). */
export const HIGH_USAGE = 85;

export const locale = (ctx: Context) => (ctx.data.lang === 'pl' ? 'pl-PL' : 'en-GB');

export const number = (ctx: Context, n: number) => new Intl.NumberFormat(locale(ctx)).format(n);

/** A text bar, e.g. `███░░░░░░░` for 30%. */
export function bar(percent: number, width = 10): string {
	const filled = Math.round((Math.min(100, Math.max(0, percent)) / 100) * width);
	return '█'.repeat(filled) + '░'.repeat(width - filled);
}

/** `<n> <word>` with the plural form from `term.<base>.one|few|many`. */
export function plural(ctx: Context, n: number, base: string): string {
	let form = n === 1 ? 'one' : 'many';
	if (ctx.data.lang === 'pl' && n !== 1) {
		const last = n % 10;
		const lastTwo = n % 100;
		if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) form = 'few';
	}
	return `${n} ${ctx.t(`term.${base}.${form}`)}`;
}

/** Minutes as `3 h 12 min`. */
export function duration(minutes: number): string {
	const h = Math.floor(minutes / 60);
	const m = Math.round(minutes % 60);
	return h ? `${h} h ${m} min` : `${m} min`;
}

/** A label in a fixed-width column, then the value. */
export const row = (label: string, value: string, width = 14): Line => [
	{ text: label.padEnd(width), role: 'muted' },
	{ text: value },
];

export const noData = (ctx: Context, source: string): Line => [
	{ text: ctx.t('term.noData', { source }), role: 'muted' },
];

/** Resolves after `ms`, or at once when `signal` aborts. */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
	return new Promise((resolve) => {
		const timer = setTimeout(resolve, ms);
		signal?.addEventListener('abort', () => {
			clearTimeout(timer);
			resolve();
		});
	});
}
