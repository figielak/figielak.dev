/**
 * Number formats shared by the homelab tiles and their browser scripts, so
 * the first render and the live updates look the same.
 */

/** Used share of a total in percent, 0 for an empty total. */
export const percent = (used: number, total: number) => (total > 0 ? (used / total) * 100 : 0);

/** `12,4` — traffic figures with one decimal. */
export const decimal = (value: number, lang: string) =>
	new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);

/** `99,97%` — uptime keeps two decimals, since 99% and 99.9% differ a lot. */
export const uptimePercent = (value: number, lang: string) =>
	`${new Intl.NumberFormat(lang, { maximumFractionDigits: 2 }).format(value)}%`;
