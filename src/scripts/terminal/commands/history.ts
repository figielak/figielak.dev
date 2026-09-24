import type { Command } from '../types';

export default {
	name: 'history',
	aliases: ['historia'],
	group: 'basic',
	run(ctx) {
		ctx.history.forEach((line, i) => ctx.print([{ text: String(i + 1).padStart(4) + '  ', role: 'muted' }, { text: line }]));
	},
} satisfies Command;
