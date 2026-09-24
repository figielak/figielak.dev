/**
 * Browser side of live tiles fed from /api/* (koncept.md §9). A tile opts in
 * with `data-endpoint`; it is rendered as `loading` and this script switches
 * it to ok, stale or error — the same four states the server-rendered mocks
 * show, driven by the same attributes (LiveBody, LiveDot, LiveFooter).
 *
 * `data-stale-after` (minutes) overrides STALE_AFTER_MIN for sources that are
 * cached for longer, like GitHub.
 *
 * The element given to watchLive is a whole tile or one section of a tile
 * that joins several sources (the homelab). Either way the tile's dot shows
 * the worst state of all its sections, and a tile whose every section failed
 * gets `data-offline`.
 */
import { dotState, minutesSince, STALE_AFTER_MIN, worstState, type LiveState } from '../lib/live';

type Payload<T> = T & { updatedAt: Date };

function refreshTile(tile: HTMLElement) {
	const states = [...tile.querySelectorAll<HTMLElement>('.live-body')].map((b) => b.dataset.live as LiveState);
	const dot = tile.querySelector<HTMLElement>('.tile-header .live-dot');
	if (dot) dot.dataset.state = dotState(worstState(states));
	tile.toggleAttribute('data-offline', states.length > 1 && states.every((s) => s === 'error'));
}

function render(root: HTMLElement, state: LiveState, updatedAt?: Date) {
	const body = root.querySelector<HTMLElement>('.live-body');
	if (body) body.dataset.live = state;

	const content = body?.querySelector('.live-content');
	if (state === 'loading' || state === 'error') content?.setAttribute('aria-hidden', 'true');
	else content?.removeAttribute('aria-hidden');

	refreshTile(root.closest<HTMLElement>('.tile') ?? root);

	const footer = root.querySelector<HTMLElement>('.live-footer');
	if (footer) footer.dataset.state = state;

	const updated = footer?.querySelector<HTMLElement>('.live-footer-updated');
	if (updated && updatedAt) {
		updated.textContent = (updated.dataset.template ?? '{n}').replace('{n}', String(minutesSince(updatedAt)));
	}
}

/**
 * Loads the endpoint of a tile or a section (`root`) now and every `everyMs`
 * while the page is visible, and hands each response to `apply`. A failed
 * refresh keeps the data on screen and lets it go stale; only one that never
 * loaded shows the error.
 */
export function watchLive<T>(root: HTMLElement, apply: (data: Payload<T>) => void, everyMs = 0) {
	const url = root.dataset.endpoint;
	if (!url || root.dataset.liveStarted !== undefined) return;
	root.dataset.liveStarted = '';

	const staleAfterMin = Number(root.dataset.staleAfter) || STALE_AFTER_MIN;
	let tried = false;
	let updatedAt: Date | undefined;

	const refreshState = () => {
		if (!tried) return;
		if (!updatedAt) return render(root, 'error');
		const ageMin = (Date.now() - updatedAt.getTime()) / 60_000;
		render(root, ageMin > staleAfterMin ? 'stale' : 'ok', updatedAt);
	};

	const load = async () => {
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error(`${url}: ${response.status}`);
			const json = await response.json();
			const data = { ...json, updatedAt: new Date(json.updatedAt) } as Payload<T>;
			apply(data);
			updatedAt = data.updatedAt;
		} catch (error) {
			console.warn(error);
		}
		tried = true;
		refreshState();
	};

	load();
	/* "Updated … min ago" keeps counting between loads. */
	setInterval(refreshState, 60_000);

	if (everyMs > 0) {
		setInterval(() => document.visibilityState === 'visible' && load(), everyMs);
		document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && load());
	}
}

/** Sets an element's text only when it changes, so aria-live does not repeat itself. */
export function setText(el: Element | null | undefined, text: string) {
	if (el && el.textContent !== text) el.textContent = text;
}
