import type { TranslationKey } from '../i18n';

/** Manually selected subjects; prose lives in the matching PL/EN dictionaries. */
export interface EditorialEntry {
	title: string;
	paragraphs: readonly TranslationKey[];
	link?: { href: string; label: TranslationKey };
}

/** The task in progress is written by hand; the latest commit of `repo` comes live from /api/github. */
export interface CurrentWorkEntry {
	title: string;
	/** One line on what the project is, for visitors who have not heard of it. */
	summary: TranslationKey;
	task: TranslationKey;
	/** Repository name under the GitHub user (src/lib/contact.ts). */
	repo: string;
	tags: readonly string[];
	link?: { href: string; label: TranslationKey };
}

export const currentWork: CurrentWorkEntry = {
	title: 'Telos',
	summary: 'devLog.currentWork.summary',
	task: 'devLog.currentWork.task',
	repo: 'telos',
	tags: ['Claude Code', 'Node.js', 'JavaScript'],
	link: { href: 'https://github.com/figielak/telos', label: 'projects.code' },
};

export const experiment: EditorialEntry = {
	title: 'Homelab',
	paragraphs: ['devLog.experiment.body'],
	link: { href: '/projects/homelab', label: 'projects.details' },
};
