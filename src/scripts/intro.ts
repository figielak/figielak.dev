/**
 * Dashboard intro (docs/koncept.md §8), about 1.5 s, on the first visit in a
 * session and on every click on Dashboard in the navigation: BaseLayout marks <html data-intro="pending"> before first paint
 * and this script plays it.
 *
 * - Tiles come in one after another along the diagonal from the top left,
 *   so the grid fills like a wave (`--intro-delay`, animated by Tile).
 * - Right after a tile appears its insides get `data-reveal`: bars grow, the
 *   GitHub chart lights up column by column, the cover sharpens — each
 *   animated by its own component — and numbers count up from zero here.
 *   A tile still waiting for its data reveals once the data is in.
 * - The wordmark types itself in, then its cursor starts blinking.
 *
 * Only opacity and transform move (blur on desktop only), so it stays smooth.
 */

const COUNT_MS = 1_200;
/* How long a tile's insides wait for its data before giving up. */
const DATA_WAIT_MS = 3_000;
/* After this the tile animations are over and the normal rules return. */
const TILES_DONE_MS = 1_400;
/* How long `data-reveal` stays: the longest inner animation (the GitHub
   wave, 53 columns) and some. */
const REVEAL_MS = 1_600;

const html = document.documentElement;

/* A time token in ms. The CSS minifier may rewrite `350ms` as `.35s`. */
function token(name: string, fallback: number): number {
	const value = getComputedStyle(html).getPropertyValue(name).trim();
	const n = parseFloat(value);
	if (Number.isNaN(n)) return fallback;
	return value.endsWith('ms') ? n : value.endsWith('s') ? n * 1000 : n;
}

/* `847`, `14°`, `120 odtw.`: a whole number and a non-numeric tail. */
const COUNTABLE = /^(-?\d+)(\D*)$/;

function countUp(root: HTMLElement) {
	for (const el of root.querySelectorAll<HTMLElement>('[data-count]')) {
		const text = el.textContent ?? '';
		const match = COUNTABLE.exec(text.trim());
		if (!match || !Number(match[1])) continue;
		const target = Number(match[1]);
		const tail = match[2];

		/* aria-live would read every frame; busy holds it until the end. */
		el.setAttribute('aria-busy', 'true');
		const start = performance.now();
		const frame = (now: number) => {
			const progress = Math.min(1, (now - start) / COUNT_MS);
			const eased = 1 - (1 - progress) ** 3;
			el.textContent = `${Math.round(target * eased)}${tail}`;
			if (progress < 1) requestAnimationFrame(frame);
			else {
				el.textContent = text;
				el.removeAttribute('aria-busy');
			}
		};
		el.textContent = `0${tail}`;
		requestAnimationFrame(frame);
	}
}

function reveal(tile: HTMLElement) {
	const bodies = [...tile.querySelectorAll<HTMLElement>('.live-body')];
	const loading = () => bodies.some((body) => body.dataset.live === 'loading');

	const play = () => {
		tile.setAttribute('data-reveal', '');
		countUp(tile);
		setTimeout(() => tile.removeAttribute('data-reveal'), REVEAL_MS);
	};

	if (!loading()) return play();
	const observer = new MutationObserver(() => {
		if (loading()) return;
		observer.disconnect();
		clearTimeout(giveUp);
		play();
	});
	observer.observe(tile, { subtree: true, attributes: true, attributeFilter: ['data-live'] });
	const giveUp = setTimeout(() => observer.disconnect(), DATA_WAIT_MS);
}

/* The name appears letter by letter; the cursor holds still meanwhile. */
function typeBrand(step: number) {
	for (const brand of document.querySelectorAll<HTMLElement>('.nav-brand')) {
		const node = [...brand.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
		if (!node) continue;
		const full = node.textContent ?? '';
		const lead = full.slice(0, full.length - full.trimStart().length);
		const word = full.trim();
		brand.setAttribute('data-typing', '');
		node.textContent = lead;
		[...word].forEach((_, i) => {
			setTimeout(() => {
				node.textContent = lead + word.slice(0, i + 1);
				if (i === word.length - 1) {
					node.textContent = full;
					brand.removeAttribute('data-typing');
				}
			}, (i + 1) * step);
		});
	}
}

function play() {
	try {
		sessionStorage.setItem(`intro:${location.pathname.replace(/\/$/, '')}`, '1');
	} catch {}

	const spread = token('--intro-spread', 350);
	const inner = token('--intro-inner', 150);

	for (const grid of document.querySelectorAll<HTMLElement>('.bento[data-alive]')) {
		const box = grid.getBoundingClientRect();
		/* Each tile's distance along the diagonal from the top left corner,
		   scaled so the last tile starts at the end of the spread. */
		const tiles = [...grid.querySelectorAll<HTMLElement>(':scope > .tile')].map((tile) => {
			const rect = tile.getBoundingClientRect();
			const diagonal = (rect.left - box.left) / (box.width || 1) + (rect.top - box.top) / (box.height || 1);
			return { tile, diagonal };
		});
		const last = Math.max(...tiles.map((t) => t.diagonal)) || 1;
		for (const { tile, diagonal } of tiles) {
			const delay = Math.round((diagonal / last) * spread);
			tile.style.setProperty('--intro-delay', `${delay}ms`);
			setTimeout(() => reveal(tile), delay + inner);
		}
	}

	typeBrand(token('--intro-type-step', 60));
	html.dataset.intro = 'run';
	setTimeout(() => delete html.dataset.intro, TILES_DONE_MS);
}

/* Module scripts can run before the stylesheets are in, when the grid is not
   laid out yet and every tile would measure at the same spot. The page is
   not painted before its CSS either, so waiting costs nothing visible. */
function whenLaidOut(run: () => void, framesLeft = 60) {
	const grid = document.querySelector<HTMLElement>('.bento[data-alive]');
	if (!grid || getComputedStyle(grid).display === 'grid' || framesLeft === 0) return run();
	requestAnimationFrame(() => whenLaidOut(run, framesLeft - 1));
}

if (html.dataset.intro === 'pending') whenLaidOut(play);
