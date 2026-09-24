import type { Command } from '../types';

export default {
	name: 'echo',
	group: 'basic',
	run(ctx) {
		ctx.print(ctx.rest);
	},
} satisfies Command;
