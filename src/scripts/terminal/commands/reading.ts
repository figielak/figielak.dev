import { getJson } from '../fetch';
import { noData } from '../format';
import type { BooksPayload } from '../payloads';
import type { Command } from '../types';

export default {
	name: 'reading',
	aliases: ['books', 'czytam'],
	group: 'live',
	async run(ctx) {
		const pending = ctx.loading();
		const data = await getJson<BooksPayload>('/api/books');
		if (!data) return pending.done(noData(ctx, 'hardcover'));
		if (!data.books.length) return pending.done(ctx.t('term.reading.empty'));

		pending.done(
			[{ text: ctx.t('term.reading.header'), role: 'muted' }],
			...data.books.map((book) => [
				{ text: `  ${book.title}` },
				...(book.author ? [{ text: ` — ${book.author}`, role: 'muted' as const }] : []),
			]),
		);
	},
} satisfies Command;
