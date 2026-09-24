import { daysUntil, nextEvent } from '../../../lib/events';
import { plural } from '../format';
import type { Command } from '../types';

export default {
	name: 'countdown',
	aliases: ['odliczanie'],
	group: 'live',
	run(ctx) {
		const now = new Date();
		const event = nextEvent(now);
		if (!event) return ctx.print(ctx.t('term.countdown.none'));

		const title = event.title[ctx.data.lang];
		const days = daysUntil(event.date, now);
		ctx.print(
			days === 0
				? ctx.t('term.countdown.today', { title })
				: ctx.t('term.countdown.line', { title, days: plural(ctx, days, 'day') }),
		);
	},
} satisfies Command;
