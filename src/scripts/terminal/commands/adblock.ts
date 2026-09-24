import { getJson } from '../fetch';
import { noData, number } from '../format';
import type { DnsPayload } from '../payloads';
import type { Command, Context } from '../types';

function share(ctx: Context, key: string, blocked: number, queries: number): string {
	const percent = queries ? ((blocked / queries) * 100).toFixed(1) : '0';
	return ctx.t(key, { blocked: number(ctx, blocked), queries: number(ctx, queries), percent });
}

/* Daily and weekly sums only, never hourly (koncept.md §14). */
export default {
	name: 'adblock',
	group: 'live',
	async run(ctx) {
		const pending = ctx.loading();
		const dns = await getJson<DnsPayload>('/api/homelab/dns');
		if (!dns) return pending.done(noData(ctx, 'adblock'));

		const lines = [share(ctx, 'term.adblock.today', dns.blockedToday, dns.queriesToday)];
		if (dns.blockedWeek !== undefined && dns.queriesWeek !== undefined) {
			lines.push(share(ctx, 'term.adblock.week', dns.blockedWeek, dns.queriesWeek));
		}
		pending.done(...lines);
	},
} satisfies Command;
