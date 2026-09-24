/**
 * Red light on the tile edges around the cursor, on grids with `alive` — the
 * dashboards (koncept.md §8). Each tile gets the light's position relative to
 * itself (`--spot-x`, `--spot-y`), so tiles next to the cursor light up too;
 * the ring itself is drawn by Tile. The light trails the cursor a little,
 * which reads as a wave; with reduced motion it follows at once.
 *
 * Mouse only: touch has no cursor to follow.
 */

/* Share of the remaining distance the light covers each frame. */
const EASE = 0.2;
/* Close enough to stop the loop, in px. */
const SETTLED = 0.5;

const grids = [...document.querySelectorAll<HTMLElement>('.bento[data-alive]')];

if (grids.length && matchMedia('(hover: hover) and (pointer: fine)').matches) {
	const reduced = matchMedia('(prefers-reduced-motion: reduce)');
	const tiles = grids.flatMap((grid) => [...grid.querySelectorAll<HTMLElement>(':scope > .tile')]);
	const reach = () => parseFloat(getComputedStyle(grids[0]).getPropertyValue('--spotlight-size')) || 0;

	let target: { x: number; y: number } | null = null;
	let light = { x: 0, y: 0 };
	let frame = 0;

	function paint() {
		for (const tile of tiles) {
			const rect = tile.getBoundingClientRect();
			tile.style.setProperty('--spot-x', `${light.x - rect.left}px`);
			tile.style.setProperty('--spot-y', `${light.y - rect.top}px`);
		}
		const r = reach();
		for (const grid of grids) {
			const rect = grid.getBoundingClientRect();
			const near =
				target !== null &&
				target.x > rect.left - r &&
				target.x < rect.right + r &&
				target.y > rect.top - r &&
				target.y < rect.bottom + r;
			grid.style.setProperty('--spot-on', near ? '1' : '0');
		}
	}

	function step() {
		frame = 0;
		if (!target) return;
		const ease = reduced.matches ? 1 : EASE;
		light = { x: light.x + (target.x - light.x) * ease, y: light.y + (target.y - light.y) * ease };
		paint();
		if (Math.abs(target.x - light.x) > SETTLED || Math.abs(target.y - light.y) > SETTLED) {
			frame = requestAnimationFrame(step);
		}
	}

	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(step);
	};

	document.addEventListener(
		'pointermove',
		(event) => {
			if (event.pointerType !== 'mouse') return;
			/* The first move puts the light straight under the cursor. */
			if (!target) light = { x: event.clientX, y: event.clientY };
			target = { x: event.clientX, y: event.clientY };
			schedule();
		},
		{ passive: true },
	);

	const off = () => {
		target = null;
		for (const grid of grids) grid.style.setProperty('--spot-on', '0');
	};
	document.documentElement.addEventListener('pointerleave', off);
	window.addEventListener('blur', off);

	/* Tiles move under a still cursor when the page scrolls or resizes. */
	window.addEventListener('scroll', () => target && schedule(), { passive: true });
	window.addEventListener('resize', () => target && schedule());
}
