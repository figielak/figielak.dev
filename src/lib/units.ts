/**
 * Number formats shared by the homelab tiles and their browser scripts, so
 * the first render and the live updates look the same.
 */

/** Used share of a total in percent, 0 for an empty total. */
export const percent = (used: number, total: number) => (total > 0 ? (used / total) * 100 : 0);

/** `12,4` — traffic figures with one decimal. */
export const decimal = (value: number, lang: string) =>
	new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);

/** `3,7` or `117` — a size in GiB, one decimal only while it is small. */
export const size = (value: number, lang: string) =>
	new Intl.NumberFormat(lang, { maximumFractionDigits: value < 100 ? 1 : 0 }).format(value);

/** `1,1 / 3,7 GB` — used of total. */
export const usedOf = (used: number, total: number, lang: string) => `${size(used, lang)} / ${size(total, lang)} GB`;

/** `99,97%` — uptime keeps two decimals, since 99% and 99.9% differ a lot. */
export const uptimePercent = (value: number, lang: string) =>
	`${new Intl.NumberFormat(lang, { maximumFractionDigits: 2 }).format(value)}%`;
