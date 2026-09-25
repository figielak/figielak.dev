import type { Command } from '../types';

export default {
	name: 'korepetycje',
	aliases: ['maths', 'tutoring'],
	group: 'about',
	run(ctx) {
		/* The directory is left out while tutoring is closed (src/lib/tutoring.ts). */
		const href = ctx.data.dirs.find((dir) => dir.name === 'korepetycje')?.href;
		if (!href) return ctx.print(ctx.t('term.maths.soon'));
		ctx.print(ctx.t('term.maths.text'), [
			{ text: '→ ', role: 'muted' },
			{ text: `figielak.dev${href}`, href },
		]);
	},
} satisfies Command;
