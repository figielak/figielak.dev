/**
 * Browser side of live tiles fed from /api/* (koncept.md §9). A tile opts in
 * with `data-endpoint`; it is rendered as `loading` and this script switches
 * it to ok, stale or error — the same four states the server-rendered mocks
 * show, driven by the same attributes (LiveBody, LiveDot, LiveFooter).
 *
 * `data-stale-after` (minutes) overrides STALE_AFTER_MIN for sources that are
 * cached for longer, like GitHub.
 */
import { dotState, minutesSince, STALE_AFTER_MIN, type LiveState } from '../lib/live';

type Payload<T> = T & { updatedAt: Date };

function render(tile: HTMLElement, state: LiveState, updatedAt?: Date) {
	const body = tile.querySelector<HTMLElement>('.live-body');
	if (body) body.dataset.live = state;

	const content = body?.querySelector('.live-content');
	if (state === 'loading' || state === 'error') content?.setAttribute('aria-hidden', 'true');
	else content?.removeAttribute('aria-hidden');

	const dot = tile.querySelector<HTMLElement>('.tile-header .live-dot');
	if (dot) dot.dataset.state = dotState(state);

	const footer = tile.querySelector<HTMLElement>('.live-footer');
	if (footer) footer.dataset.state = state;

	const updated = footer?.querySelector<HTMLElement>('.live-footer-updated');
	if (updated && updatedAt) {
		updated.textContent = (updated.dataset.template ?? '{n}').replace('{n}', String(minutesSince(updatedAt)));
	}
}

/**
 * Loads the tile's endpoint now and every `everyMs` while the page is visible,
 * and hands each response to `apply`. A failed refresh keeps the data on
 * screen and lets it go stale; only a tile that never loaded shows the error.
 */
export function watchLive<T>(tile: HTMLElement, apply: (data: Payload<T>) => void, everyMs = 0) {
	const url = tile.dataset.endpoint;
	if (!url || tile.dataset.liveStarted !== undefined) return;
	tile.dataset.liveStarted = '';

	const staleAfterMin = Number(tile.dataset.staleAfter) || STALE_AFTER_MIN;
	let tried = false;
	let updatedAt: Date | undefined;

	const refreshState = () => {
		if (!tried) return;
		if (!updatedAt) return render(tile, 'error');
		const ageMin = (Date.now() - updatedAt.getTime()) / 60_000;
		render(tile, ageMin > staleAfterMin ? 'stale' : 'ok', updatedAt);
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
