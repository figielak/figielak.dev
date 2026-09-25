/**
 * The goal in Firestore (site/goal, koncept.md §3.4): read for the public
 * tile, written from the private dashboard. Plain text only; English falls
 * back to Polish.
 */
import { GOAL_MAX_STEPS, GOAL_MAX_TITLE, type Goal } from '../goal';
import { readDoc, writeDoc } from './firestore';

const DOC = 'site/goal';

export async function readGoal(): Promise<{ goal: Goal | null; updatedAt: string | null }> {
	const doc = await readDoc(DOC);
	return { goal: (doc.goal as Goal | undefined) ?? null, updatedAt: (doc.updatedAt as string | undefined) ?? null };
}

/* Control characters out, spaces squeezed; a string or nothing. */
function text(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;
	const clean = value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
	return clean ? clean.slice(0, GOAL_MAX_TITLE) : undefined;
}

function title(value: unknown): Goal['title'] | null {
	if (typeof value !== 'object' || value === null) return null;
	const pl = text((value as Record<string, unknown>).pl);
	if (!pl) return null;
	return { pl, en: text((value as Record<string, unknown>).en) ?? pl };
}

/** The goal from the form, or null when something required is missing. */
export function parseGoal(body: unknown): Goal | null {
	if (typeof body !== 'object' || body === null) return null;
	const o = body as Record<string, unknown>;

	const goalTitle = title(o.title);
	if (!goalTitle) return null;

	let by: string | undefined;
	if (o.by !== undefined && o.by !== null && o.by !== '') {
		if (typeof o.by !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(o.by) || Number.isNaN(Date.parse(o.by))) return null;
		by = o.by;
	}

	if (!Array.isArray(o.steps) || o.steps.length > GOAL_MAX_STEPS) return null;
	const steps: Goal['steps'] = [];
	for (const item of o.steps) {
		if (typeof item !== 'object' || item === null) return null;
		const stepTitle = title((item as Record<string, unknown>).title);
		/* An empty row in the form is simply left out. */
		if (!stepTitle) continue;
		steps.push({ title: stepTitle, done: (item as Record<string, unknown>).done === true });
	}
	if (steps.length === 0) return null;

	return by ? { title: goalTitle, by, steps } : { title: goalTitle, steps };
}

export async function saveGoal(goal: Goal): Promise<string> {
	const updatedAt = new Date().toISOString();
	await writeDoc(DOC, { goal, updatedAt });
	return updatedAt;
}
