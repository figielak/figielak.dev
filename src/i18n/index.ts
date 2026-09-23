import pl from './pl.json';
import en from './en.json';

/** `pl` is the default and carries no prefix; `en` lives under /en/. */
export const defaultLang = 'pl' as const;

export const languages = {
	pl: 'PL',
	en: 'EN',
} as const;

export type Lang = keyof typeof languages;

const dictionaries = { pl, en } as const;

export type TranslationKey = keyof typeof pl;

export function isLang(value: string): value is Lang {
	return value in languages;
}

/** Reads the language from the first path segment, defaulting to `pl`. */
export function getLangFromUrl(url: URL): Lang {
	const [, segment] = url.pathname.split('/');
	return segment && isLang(segment) ? segment : defaultLang;
}

/** Falls back to the Polish string so a missing translation never renders a key. */
export function useTranslations(lang: Lang) {
	return function t(key: TranslationKey): string {
		return dictionaries[lang][key as keyof (typeof dictionaries)[typeof lang]] ?? pl[key];
	};
}

/** Strips the language prefix, e.g. `/en/projects` -> `/projects`. */
export function stripLang(pathname: string): string {
	const [, segment, ...rest] = pathname.split('/');
	if (segment && isLang(segment)) {
		return '/' + rest.join('/');
	}
	return pathname;
}

/** Prefixes a language-agnostic path for the given language. */
export function localizePath(path: string, lang: Lang): string {
	const clean = path === '/' ? '' : path.replace(/\/$/, '');
	return lang === defaultLang ? clean || '/' : `/${lang}${clean}`;
}

/**
 * Polish plural form for a count: `one` (1 rok), `few` (2–4, 22–24… lata),
 * `many` (everything else: 5 lat, 12 lat, 21 lat).
 */
export function pluralPl(n: number, forms: { one: string; few: string; many: string }): string {
	if (n === 1) return forms.one;
	const lastDigit = n % 10;
	const lastTwo = n % 100;
	return lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14) ? forms.few : forms.many;
}
