import { getJson } from '../fetch';
import { noData, number, plural, row } from '../format';
import type { GithubPayload } from '../payloads';
import type { Command } from '../types';

const WEEKS = 26;
const LEVELS = '▁▂▃▅▇';
const LABEL_WIDTH = 20;

export default {
	name: 'gh',
	aliases: ['github'],
	group: 'live',
	async run(ctx) {
		const pending = ctx.loading();
		const github = await getJson<GithubPayload>('/api/github');
		if (!github) return pending.done(noData(ctx, 'github'));

		/* One character per week: its average level, in green like the
		   contribution chart (koncept.md §5). */
		const chart = github.weeks
			.slice(-WEEKS)
			.map((week) => LEVELS[Math.min(4, Math.round(week.reduce<number>((sum, level) => sum + level, 0) / 7))])
			.join('');

		pending.done(
			row(ctx.t('term.gh.contributions'), number(ctx, github.contributions), LABEL_WIDTH),
			row(ctx.t('term.gh.streak'), plural(ctx, github.streakDays, 'day'), LABEL_WIDTH),
			row(ctx.t('term.gh.repos'), String(github.repos), LABEL_WIDTH),
			'',
			[{ text: chart, role: 'ok' }],
			[{ text: ctx.t('term.gh.weeks', { n: WEEKS }), role: 'muted' }],
		);
	},
} satisfies Command;
