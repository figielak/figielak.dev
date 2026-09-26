/**
 * CPU and RAM history for the private dashboard (docs/koncept.md §3.4), kept by
 * the site in Firestore (homelab/history): every push of the machine section
 * folds into its 5-minute bucket as a running average, and buckets older
 * than 24 hours drop out. The agent sends nothing extra.
 *
 * One read and one write per push, next to the reading's own write — well
 * inside Firestore's free limits (about 1440 of each a day).
 */
import { HISTORY_HOURS, HISTORY_STEP_MIN, type HistoryPoint } from '../mocks/history';
import type { LabSection, Stored } from './homelab';
import { readDoc, writeDoc } from './firestore';

const DOC = 'homelab/history';
const STEP_MS = HISTORY_STEP_MIN * 60_000;
const WINDOW_MS = HISTORY_HOURS * 3_600_000;

/* `n` counts the readings in a bucket, so the average can take one more. */
type StoredPoint = HistoryPoint & { n: number };

const round = (value: number) => Math.round(value * 10) / 10;

export async function readHistory(): Promise<StoredPoint[]> {
	return ((await readDoc(DOC)).points as StoredPoint[] | undefined) ?? [];
}

/** Folds one machine reading into the history. */
export async function appendHistory(lab: Stored<LabSection>): Promise<void> {
	const at = Date.parse(lab.updatedAt);
	const t = new Date(Math.floor(at / STEP_MS) * STEP_MS).toISOString();
	const cpu = lab.cpu;
	const ram = lab.ramTotalGb ? (lab.ramUsedGb / lab.ramTotalGb) * 100 : 0;

	const points = (await readHistory()).filter((p) => Date.parse(p.t) > at - WINDOW_MS);
	const last = points.at(-1);
	if (last?.t === t) {
		const n = last.n + 1;
		last.cpu = round(last.cpu + (cpu - last.cpu) / n);
		last.ram = round(last.ram + (ram - last.ram) / n);
		last.n = n;
	} else if (!last || last.t < t) {
		points.push({ t, cpu: round(cpu), ram: round(ram), n: 1 });
	} else {
		/* A reading older than the last bucket (a late retry): not worth reordering. */
		return;
	}
	await writeDoc(DOC, { points });
}
