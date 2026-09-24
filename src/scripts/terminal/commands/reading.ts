import type { Command } from '../types';

export default {
	name: 'reading',
	aliases: ['books', 'czytam'],
	group: 'live',
	run(ctx) {
		const { books } = ctx.data;
		if (!books.length) return ctx.print(ctx.t('term.reading.empty'));
		ctx.print([{ text: ctx.t('term.reading.header'), role: 'muted' }]);
		for (const book of books) {
			ctx.print([{ text: `  ${book.title}` }, { text: ` — ${book.author}`, role: 'muted' }]);
		}
	},
} satisfies Command;
