import { ZONE } from '../format';
import type { Command } from '../types';

function partOfDay(hour: number): string {
	if (hour < 5) return 'night';
	if (hour < 12) return 'morning';
	if (hour < 18) return 'afternoon';
	if (hour < 23) return 'evening';
	return 'night';
}

export default {
	name: 'hello',
	aliases: ['cześć', 'czesc', 'hej', 'hi', 'hey'],
	hidden: true,
	run(ctx) {
		const hour = Number(
			new Intl.DateTimeFormat('en-GB', { timeZone: ZONE, hour: 'numeric', hourCycle: 'h23' }).format(new Date()),
		);
		ctx.print(ctx.t(`term.hello.${partOfDay(hour)}`), [
			{ text: ctx.t('term.hello.tip'), role: 'muted' },
			{ text: 'help', role: 'accent' },
		]);
	},
} satisfies Command;
