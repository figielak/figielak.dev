import { sleep } from '../format';
import type { Command } from '../types';

export default {
	name: 'vim',
	aliases: ['vi', 'nvim'],
	hidden: true,
	async run(ctx) {
		ctx.print(ctx.t('term.vim.stuck'));
		await sleep(1_200);
		ctx.print([{ text: ctx.t('term.vim.hint'), role: 'muted' }, { text: ':q', role: 'accent' }]);
	},
} satisfies Command;
