import type { Command } from '../types';

/* The way out `vim` hints at. */
export default {
	name: ':q',
	aliases: [':q!', ':wq', ':x'],
	hidden: true,
	run(ctx) {
		ctx.print([{ text: ctx.t('term.vim.quit'), role: 'ok' }]);
	},
} satisfies Command;
