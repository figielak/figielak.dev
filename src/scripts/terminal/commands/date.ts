import { sunTimes } from '../../../lib/sun';
import { locale, ZONE } from '../format';
import type { Command } from '../types';

/* The same numbers as the "Day" tile: local, no API. */
export default {
	name: 'date',
	aliases: ['data'],
	group: 'basic',
	run(ctx) {
		const now = new Date();
		ctx.print(new Intl.DateTimeFormat(locale(ctx), { timeZone: ZONE, dateStyle: 'full', timeStyle: 'medium' }).format(now));

		const sun = sunTimes(now);
		if (!sun) return;
		const time = new Intl.DateTimeFormat(locale(ctx), { timeZone: ZONE, hour: '2-digit', minute: '2-digit' });
		const hours = Math.floor(sun.dayLength / 3_600_000);
		const minutes = Math.round((sun.dayLength % 3_600_000) / 60_000);
		ctx.print([
			{ text: `${ctx.t('term.date.sunrise')} `, role: 'muted' },
			{ text: time.format(sun.sunrise) },
			{ text: `  ·  ${ctx.t('term.date.sunset')} `, role: 'muted' },
			{ text: time.format(sun.sunset) },
			{ text: `  ·  ${ctx.t('term.date.dayLength')} `, role: 'muted' },
			{ text: `${hours} h ${minutes} min` },
		]);
	},
} satisfies Command;
