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
