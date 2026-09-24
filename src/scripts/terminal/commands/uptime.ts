import { getJson } from '../fetch';
import { locale, noData, plural, ZONE } from '../format';
import type { LabPayload } from '../payloads';
import type { Command } from '../types';

export default {
	name: 'uptime',
	group: 'live',
	async run(ctx) {
		const pending = ctx.loading();
		const lab = await getJson<LabPayload>('/api/homelab/lab');
		if (!lab) return pending.done(noData(ctx, 'homelab'));

		const time = new Intl.DateTimeFormat(locale(ctx), { timeZone: ZONE, timeStyle: 'medium' }).format(new Date());
		const parts = [`${time} up ${plural(ctx, lab.uptimeDays, 'day')}`];
		if (lab.containers !== undefined) parts.push(ctx.t('term.uptime.containers', { n: lab.containers }));
		parts.push(`CPU ${Math.round(lab.cpu)}%`, `${Math.round(lab.cpuTempC)}°C`);
		pending.done(parts.join(',  '));
	},
} satisfies Command;
