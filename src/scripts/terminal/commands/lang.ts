import type { Command, Lang } from '../types';

const LANGS: Lang[] = ['pl', 'en'];

export default {
	name: 'lang',
	aliases: ['language', 'jezyk', 'język'],
	group: 'nav',
	complete: () => LANGS,
	run(ctx) {
		const lang = ctx.args[0]?.toLowerCase() as Lang | undefined;
		if (!lang || lang === ctx.data.lang) return ctx.print(ctx.t('term.lang.current', { lang: ctx.data.lang }));
		if (!LANGS.includes(lang)) return ctx.print(ctx.t('term.lang.unknown', { lang }));

		const href = ctx.data.langHrefs[lang];
		if (!href) return ctx.print(ctx.t('term.lang.polishOnly'));
		ctx.navigate(href);
	},
} satisfies Command;
