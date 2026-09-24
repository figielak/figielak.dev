import type { Command, TerminalData } from '../types';

const targets = (data: TerminalData) => [
	...data.socials.map((social) => ({ name: social.name, label: social.label, url: social.url })),
	...data.projects.map((project) => ({ name: project.name, label: project.title, url: project.href })),
];

export default {
	name: 'open',
	aliases: ['otworz', 'otwórz'],
	group: 'nav',
	complete: (data) => targets(data).map((target) => target.name),
	run(ctx) {
		const list = targets(ctx.data);
		const names = list.map((target) => target.name).join(' | ');
		const name = ctx.args[0]?.toLowerCase();
		if (!name) return ctx.print(ctx.t('term.open.usage', { list: names }));

		const target = list.find((t) => t.name === name);
		if (!target) return ctx.print(ctx.t('term.open.unknown', { name, list: names }));

		window.open(target.url, '_blank', 'noopener');
		ctx.print([{ text: ctx.t('term.open.opening', { name: target.label }), role: 'muted' }]);
	},
} satisfies Command;
