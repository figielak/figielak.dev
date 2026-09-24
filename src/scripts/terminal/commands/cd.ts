import type { Command } from '../types';

const HOME = ['', '~', '..', '/', '~/'];

export default {
	name: 'cd',
	group: 'nav',
	complete: (data) => [...data.dirs.map((dir) => dir.name), '~', '..'],
	run(ctx) {
		const target = (ctx.args[0] ?? '~').toLowerCase().replace(/^~\//, '').replace(/\/$/, '');
		const dir = HOME.includes(target)
			? ctx.data.dirs[0]
			: ctx.data.dirs.find((d) => d.name === target || d.aliases.includes(target));
		if (!dir) return ctx.print(ctx.t('term.cd.notFound', { dir: ctx.args[0] }));
		if (dir.href !== location.pathname.replace(/(.)\/$/, '$1')) ctx.navigate(dir.href);
	},
} satisfies Command;
