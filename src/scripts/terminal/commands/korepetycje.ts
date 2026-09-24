import type { Command } from '../types';

export default {
	name: 'korepetycje',
	aliases: ['maths', 'tutoring'],
	group: 'about',
	run(ctx) {
		const href = ctx.data.dirs.find((dir) => dir.name === 'korepetycje')?.href ?? '/maths';
		ctx.print(ctx.t('term.maths.text'), [
			{ text: '→ ', role: 'muted' },
			{ text: `figielak.dev${href}`, href },
		]);
	},
} satisfies Command;
