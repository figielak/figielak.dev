/**
 * In-memory cache for /api/* (koncept.md §9). Cloud Run scales to zero, so a
 * cold instance simply fetches again — fine for data that is cheap to get.
 *
 * When a refresh fails, the last good value is served with its old
 * `updatedAt`, so the tile turns stale instead of failing (§9 states).
 */
interface Entry<T> {
	value?: T;
	updatedAt: number;
	failedAt?: number;
	pending?: Promise<T>;
}

/* After a failed refresh, wait this long before asking upstream again. */
const RETRY_AFTER_MS = 60_000;

const entries = new Map<string, Entry<unknown>>();

export interface Cached<T> {
	value: T;
	updatedAt: Date;
}

export async function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<Cached<T>> {
	const entry = (entries.get(key) ?? { updatedAt: 0 }) as Entry<T>;
	entries.set(key, entry);

	const now = Date.now();
	const fresh = entry.value !== undefined && now - entry.updatedAt < ttlMs;
	const backingOff = entry.value !== undefined && now - (entry.failedAt ?? 0) < RETRY_AFTER_MS;
	if (!fresh && !backingOff) {
		/* Concurrent requests share one upstream call. */
		entry.pending ??= load().finally(() => (entry.pending = undefined));
		try {
			entry.value = await entry.pending;
			entry.updatedAt = Date.now();
		} catch (error) {
			entry.failedAt = Date.now();
			if (entry.value === undefined) throw error;
			console.warn(`[cache] ${key}: serving the last good value`, error);
		}
	}

	return { value: entry.value as T, updatedAt: new Date(entry.updatedAt) };
}
