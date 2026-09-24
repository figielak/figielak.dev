import type { Command } from '../types';

export default {
	name: 'pwd',
	group: 'nav',
	run(ctx) {
		ctx.print(`/home/guest${ctx.data.cwd.slice(1)}`);
	},
} satisfies Command;
