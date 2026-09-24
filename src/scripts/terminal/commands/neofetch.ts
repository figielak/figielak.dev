import { getJson } from '../fetch';
import { bar, HIGH_USAGE, noData, number, plural, row } from '../format';
import type { DnsPayload, LabPayload } from '../payloads';
import type { Command, Context, Line } from '../types';

const LOGO = [
	' _____ ',
	'|  ___|',
	'| |_   ',
	'|  _|  ',
	'| |    ',
	'|_|    ',
];

const LABEL_WIDTH = 14;

const usage = (label: string, percent: number): Line => [
	{ text: label.padEnd(LABEL_WIDTH), role: 'muted' },
	{ text: bar(percent), role: percent >= HIGH_USAGE ? 'down' : 'muted' },
	{ text: ` ${Math.round(percent)}%` },
];

function info(ctx: Context, lab: LabPayload, dns: DnsPayload | null): Line[] {
	const lines: Line[] = [
		[{ text: 'guest', role: 'accent' }, { text: '@' }, { text: 'figielak', role: 'accent' }],
		[{ text: '-'.repeat(14), role: 'muted' }],
		row(ctx.t('term.lab.host'), ctx.t('term.lab.hostValue'), LABEL_WIDTH),
		row(ctx.t('term.lab.uptime'), plural(ctx, lab.uptimeDays, 'day'), LABEL_WIDTH),
	];
	if (lab.containers !== undefined) lines.push(row(ctx.t('term.lab.containers'), String(lab.containers), LABEL_WIDTH));
	lines.push(
		row(ctx.t('term.lab.temp'), `${Math.round(lab.cpuTempC)}°C`, LABEL_WIDTH),
		usage('CPU', lab.cpu),
		usage('RAM', (lab.ramUsedGb / lab.ramTotalGb) * 100),
		...lab.disks.map((disk) =>
			usage(
				lab.disks.length > 1 ? `${ctx.t('term.lab.disk')} ${disk.kind}` : ctx.t('term.lab.disk'),
				(disk.usedGb / disk.totalGb) * 100,
			),
		),
		dns
			? [
					{ text: 'DNS'.padEnd(LABEL_WIDTH), role: 'muted' },
					{ text: '● ', role: 'ok' },
					{ text: ctx.t('term.lab.dnsOk', { n: number(ctx, dns.blockedToday) }) },
				]
			: row('DNS', ctx.t('term.noDataShort'), LABEL_WIDTH),
	);
	return lines;
}

/* The homelab tile in a terminal: a logo beside the machine's numbers. */
export default {
	name: 'neofetch',
	aliases: ['fastfetch'],
	group: 'live',
	async run(ctx) {
		const pending = ctx.loading();
		const [lab, dns] = await Promise.all([
			getJson<LabPayload>('/api/homelab/lab'),
			getJson<DnsPayload>('/api/homelab/dns'),
		]);
		if (!lab) return pending.done(noData(ctx, 'homelab'));

		const right = info(ctx, lab, dns);
		/* On a phone the logo would push every line into a wrap. */
		if (matchMedia('(max-width: 639px)').matches) return pending.done(...right);
		const height = Math.max(LOGO.length, right.length);
		pending.done(
			...Array.from({ length: height }, (_, i): Line => [
				{ text: `${(LOGO[i] ?? '').padEnd(LOGO[0].length)}   `, role: 'accent' },
				...(right[i] ?? []),
			]),
		);
	},
} satisfies Command;
