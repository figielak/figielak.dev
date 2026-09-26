/**
 * Shared shape of every live tile (docs/koncept.md §9): one of four states, and
 * data that is missing while loading or on error.
 */
export type LiveState = 'loading' | 'ok' | 'stale' | 'error';

export const LIVE_STATES: LiveState[] = ['loading', 'ok', 'stale', 'error'];

export interface Live<T> {
	state: LiveState;
	/** Missing while loading or on error. */
	data?: T & { updatedAt: Date };
}

/** Data older than this is shown as stale (docs/koncept.md §9). */
export const STALE_AFTER_MIN = 10;

/** The dot a tile shows for its state: grey while loading or fresh, red once there is a problem. */
export function dotState(state: LiveState): 'live' | 'stale' | 'offline' {
	if (state === 'loading' || state === 'ok') return 'live';
	if (state === 'stale') return 'stale';
	return 'offline';
}

/**
 * State of a tile made of sections with their own sources (docs/koncept.md §9):
 * the most serious of theirs, so one failing source is enough to show it.
 */
export function worstState(states: LiveState[]): LiveState {
	for (const state of ['error', 'stale', 'loading'] as const) if (states.includes(state)) return state;
	return 'ok';
}

/** Whole minutes since `date`, never less than one. */
export function minutesSince(date: Date): number {
	return Math.max(1, Math.round((Date.now() - date.getTime()) / 60_000));
}

/** Mock timestamp: fresh for `ok`, past the stale threshold for `stale`. */
export function mockUpdatedAt(state: LiveState): Date {
	const minutesAgo = state === 'stale' ? 25 : 2;
	return new Date(Date.now() - minutesAgo * 60_000);
}
