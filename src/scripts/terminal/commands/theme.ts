import type { Command } from '../types';

/* Every theme the concept plans; only the ones in `data.themes` exist yet (§12). */
const PLANNED = ['dark', 'light'];

export default {
	name: 'theme',
	aliases: ['motyw'],
	group: 'nav',
	complete: () => PLANNED,
	run(ctx) {
		const theme = ctx.args[0]?.toLowerCase();
		if (!theme) {
			return ctx.print(ctx.t('term.theme.current', { theme: document.documentElement.dataset.theme ?? 'dark' }));
		}
		if (!PLANNED.includes(theme)) return ctx.print(ctx.t('term.theme.unknown', { theme }));
		if (!ctx.data.themes.includes(theme)) return ctx.print(ctx.t('term.theme.unavailable', { theme }));

		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('theme', theme);
		} catch {}
		ctx.print([{ text: ctx.t('term.theme.set', { theme }) }, { text: ' ✓', role: 'ok' }]);
	},
} satisfies Command;
