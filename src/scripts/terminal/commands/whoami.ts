import { row } from '../format';
import type { Command } from '../types';

export default {
	name: 'whoami',
	group: 'about',
	run(ctx) {
		ctx.print(
			[{ text: 'figielak', role: 'accent' }, { text: ' — Krystian Figiela' }],
			ctx.t('term.whoami.bio'),
			row(ctx.t('term.whoami.location'), ctx.t('term.whoami.locationValue')),
		);
	},
} satisfies Command;
