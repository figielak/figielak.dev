/**
 * The goal I am working towards now, for the goal tile (docs/koncept.md §3.4).
 * Edited on the private dashboard and kept in Firestore (site/goal), so a
 * change needs no deploy; `goal` below is what the tile shows until the
 * first save. Progress is the share of steps done, so it moves only when a
 * real step is ticked off.
 */
import type { Lang } from '../i18n';
import type { Live } from './live';

export interface Goal {
	title: Record<Lang, string>;
	/** ISO date the goal is set for, e.g. `2027-06-30`. */
	by?: string;
	steps: { title: Record<Lang, string>; done: boolean }[];
}

/** `goal` is null until the first save; the tile then shows the one below. */
export type LiveGoal = Live<{ goal: Goal | null }>;

export const GOAL_MAX_TITLE = 60;
export const GOAL_MAX_STEPS = 8;

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

/** Steps done and the first one still open. */
export function goalProgress(g: Goal) {
	const total = g.steps.length;
	const done = g.steps.filter((step) => step.done).length;
	return {
		total,
		done,
		percent: total ? Math.round((done / total) * 100) : 0,
		next: g.steps.find((step) => !step.done),
	};
}
