import type { Command } from '../types';

export default {
	name: 'clear',
	aliases: ['cls'],
	group: 'basic',
	run(ctx) {
		ctx.clear();
	},
} satisfies Command;
