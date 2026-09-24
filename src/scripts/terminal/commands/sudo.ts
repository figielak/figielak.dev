import { sleep } from '../format';
import type { Command } from '../types';

export default {
	name: 'sudo',
	hidden: true,
	async run(ctx) {
		await ctx.ask(ctx.t('term.sudo.prompt'), true);
		await sleep(700);
		ctx.print([{ text: ctx.t('term.sudo.denied'), role: 'down' }]);
	},
} satisfies Command;
