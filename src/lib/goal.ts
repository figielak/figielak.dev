/**
 * The goal I am working towards now, for the goal tile (koncept.md §3.4).
 * Static — edit by hand. Progress is the share of steps done, so it moves
 * only when a real step is ticked off.
 * Placeholder steps until the real ones are filled in.
 */
import type { Lang } from '../i18n';

export interface Goal {
	title: Record<Lang, string>;
	/** ISO date the goal is set for, e.g. `2027-06-30`. */
	by?: string;
	steps: { title: Record<Lang, string>; done: boolean }[];
}

export const goal: Goal = {
	title: { pl: 'Staż Data / Backend', en: 'A Data / Backend internship' },
	by: '2027-06-30',
	steps: [
		{ title: { pl: 'Doświadczenie na wizytówce', en: 'Experience on the profile' }, done: true },
		{ title: { pl: 'CV w Typst', en: 'CV in Typst' }, done: false },
		{ title: { pl: 'Opisy projektów na /projects', en: 'Case studies on /projects' }, done: false },
		{ title: { pl: 'Wysłane zgłoszenia', en: 'Applications sent' }, done: false },
	],
};
