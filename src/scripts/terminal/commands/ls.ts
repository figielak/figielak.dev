import type { Command } from '../types';

export default {
	name: 'ls',
	aliases: ['dir'],
	group: 'nav',
	run(ctx) {
		ctx.print([
			{ text: ctx.data.dirs.map((dir) => `${dir.name}/`).join('  ') + '  ' },
			{ text: '.sekret', role: 'muted' },
		]);
	},
} satisfies Command;
