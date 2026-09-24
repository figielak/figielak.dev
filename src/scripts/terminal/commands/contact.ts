import type { Command } from '../types';

export default {
	name: 'contact',
	aliases: ['socials', 'kontakt'],
	group: 'about',
	run(ctx) {
		ctx.print([{ text: ctx.t('term.contact.intro'), role: 'muted' }]);
		for (const social of ctx.data.socials) {
			ctx.print([
				{ text: `  ${social.label.padEnd(11)}`, role: 'muted' },
				{ text: social.url.replace(/^https:\/\/(www\.)?/, ''), href: social.url },
			]);
		}
	},
} satisfies Command;
