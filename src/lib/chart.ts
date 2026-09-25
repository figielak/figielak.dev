/**
 * Paths of a 24-hour area chart in a fixed viewBox (HISTORY_POINTS × 100),
 * so the server render and the browser draw the same thing and the SVG
 * stretches to any tile. Time runs left to right and ends at `end`; a value
 * from 0 to `top` maps to the height. `top` is a round number above the
 * peak, so a quiet CPU at a few percent is still a readable line. A gap longer than two buckets (the agent was
 * offline) breaks the line instead of drawing across it.
 */
import { HISTORY_POINTS, HISTORY_STEP_MIN, type HistoryPoint } from './mocks/history';

const STEP_MS = HISTORY_STEP_MIN * 60_000;
export const CHART_WIDTH = HISTORY_POINTS;
export const CHART_HEIGHT = 100;

const clamp = (v: number, top: number) => Math.min(top, Math.max(0, v));

/** The scale's top: the peak rounded up to a step of 10, at least 20, at most 100. */
export function chartTop(points: HistoryPoint[], key: 'cpu' | 'ram'): number {
	const peak = Math.max(0, ...points.map((p) => p[key]));
	return Math.min(100, Math.max(20, Math.ceil((peak * 1.1) / 10) * 10));
}

/** Y of a value in the viewBox. */
export const chartY = (value: number, top: number) => CHART_HEIGHT - (clamp(value, top) / top) * CHART_HEIGHT;

/** X of a bucket in the viewBox; the newest bucket sits at the right edge. */
export function chartX(t: string, end: number): number {
	return CHART_WIDTH - 1 - (end - Date.parse(t)) / STEP_MS;
}

/** The end of the window: the newest bucket, or now for an empty chart. */
export function chartEnd(points: HistoryPoint[]): number {
	return points.length ? Date.parse(points.at(-1)!.t) : Date.now();
}

export function seriesPaths(points: HistoryPoint[], key: 'cpu' | 'ram', end: number, top = chartTop(points, key)) {
	const runs: { x: number; y: number }[][] = [];
	let previous: number | undefined;
	for (const point of points) {
		const x = chartX(point.t, end);
		if (x < 0) continue;
		const y = chartY(point[key], top);
		if (previous === undefined || x - previous > 2) runs.push([]);
		runs.at(-1)!.push({ x, y });
		previous = x;
	}

	const line = runs.map((run) => run.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('')).join('');
	const area = runs
		.filter((run) => run.length > 1)
		.map((run) => {
			const top = run.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('');
			return `${top}L${run.at(-1)!.x.toFixed(1)} ${CHART_HEIGHT}L${run[0].x.toFixed(1)} ${CHART_HEIGHT}Z`;
		})
		.join('');
	return { line, area };
}

/** Average and peak (with its time) of a series, for the text summary. */
export function seriesSummary(points: HistoryPoint[], key: 'cpu' | 'ram') {
	if (!points.length) return undefined;
	const peak = points.reduce((best, p) => (p[key] > best[key] ? p : best));
	const average = points.reduce((sum, p) => sum + p[key], 0) / points.length;
	return { average, peak: peak[key], peakAt: peak.t, last: points.at(-1)![key] };
}
