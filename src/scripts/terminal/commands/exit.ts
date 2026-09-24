import type { Command } from '../types';

export default {
	name: 'exit',
	aliases: ['quit', 'logout'],
	group: 'basic',
	run(ctx) {
		ctx.close();
	},
} satisfies Command;
