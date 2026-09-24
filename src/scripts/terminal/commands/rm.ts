import type { Command } from '../types';

export default {
	name: 'rm',
	hidden: true,
	run(ctx) {
		const flags = ctx.args.filter((arg) => arg.startsWith('-')).join('');
		const root = ctx.args.some((arg) => arg === '/' || arg === '/*');
		const nuke = root && flags.includes('r') && flags.includes('f');
		ctx.print(nuke ? ctx.t('term.rm.nice') : ctx.t('term.rm.denied'));
	},
} satisfies Command;
