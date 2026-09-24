import type { Command } from '../types';

const MUG = ['     ( (', '      ) )', '   ........', '   |      |]', '   \\      /', "    `----'"];

export default {
	name: 'coffee',
	aliases: ['kawa'],
	hidden: true,
	run(ctx) {
		ctx.print(...MUG.map((line) => [{ text: line, role: 'muted' as const }]), '', ctx.t('term.coffee'));
	},
} satisfies Command;
