import type { Command, Group } from '../types';

const GROUPS: Group[] = ['basic', 'about', 'live', 'nav'];

export default {
	name: 'help',
	aliases: ['pomoc'],
	group: 'basic',
	run(ctx) {
		const visible = ctx.commands.filter((c) => !c.hidden);
		const width = Math.max(...visible.map((c) => c.name.length)) + 3;
		for (const group of GROUPS) {
			const list = visible.filter((c) => c.group === group);
			if (!list.length) continue;
			ctx.print([{ text: ctx.t(`term.group.${group}`), role: 'muted' }]);
			for (const c of list) {
				ctx.print([{ text: `  ${c.name.padEnd(width)}` }, { text: ctx.t(`term.cmd.${c.name}`), role: 'muted' }]);
			}
			ctx.print('');
		}
		ctx.print([{ text: ctx.t('term.help.footer'), role: 'muted' }]);
	},
} satisfies Command;
