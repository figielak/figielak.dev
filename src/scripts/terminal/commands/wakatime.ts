import { getJson } from '../fetch';
import { bar, duration, noData, row } from '../format';
import type { WakaPayload } from '../payloads';
import type { Command } from '../types';

export default {
	name: 'wakatime',
	aliases: ['waka'],
	group: 'live',
	async run(ctx) {
		const pending = ctx.loading();
		const waka = await getJson<WakaPayload>('/api/waka');
		if (!waka) return pending.done(noData(ctx, 'wakatime'));

		const width = Math.max(0, ...waka.languages.map((language) => language.name.length)) + 2;
		pending.done(
			row(ctx.t('term.waka.today'), duration(waka.todayMin)),
			row(ctx.t('term.waka.week'), duration(waka.weekMin)),
			'',
			[{ text: ctx.t('term.waka.languages'), role: 'muted' }],
			...waka.languages.map((language) => [
				{ text: `  ${language.name.padEnd(width)}` },
				{ text: bar(language.percent), role: 'muted' as const },
				{ text: ` ${Math.round(language.percent)}%` },
			]),
		);
	},
} satisfies Command;
