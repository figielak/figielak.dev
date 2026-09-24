import type { Command } from '../types';

/* The hidden file `ls` shows, and the way to the sudo joke. */
export default {
	name: 'cat',
	hidden: true,
	run(ctx) {
		const file = ctx.args[0];
		if (!file) return ctx.print(ctx.t('term.cat.usage'));
		if (!['.sekret', '.secret'].includes(file.toLowerCase())) {
			return ctx.print(ctx.t('term.cat.notFound', { file }));
		}
		ctx.print([{ text: ctx.t('term.cat.secret'), role: 'ok' }], [
			{ text: ctx.t('term.cat.hint'), role: 'muted' },
			{ text: 'sudo', role: 'accent' },
		]);
	},
} satisfies Command;
