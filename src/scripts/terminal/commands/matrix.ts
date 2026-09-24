import { sleep } from '../format';
import type { Command } from '../types';

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789$+-*/=%#&<>{}[]|';
const TRAIL = 12;
const FRAME_MS = 60;
const DURATION_MS = 6_000;

const pick = () => CHARS[Math.floor(Math.random() * CHARS.length)];

/* Falling characters over the output for a few seconds; any key stops them.
   With reduced motion it is one still frame. */
export default {
	name: 'matrix',
	hidden: true,
	async run(ctx) {
		ctx.print([{ text: ctx.t('term.matrix.hint'), role: 'muted' }]);
		await ctx.takeover(async (screen, signal) => {
			const style = getComputedStyle(screen);
			const fontSize = parseFloat(style.fontSize);
			const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.6;
			const width = screen.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
			const height = screen.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
			/* A monospace character is 0.6em wide. */
			const cols = Math.max(1, Math.floor(width / (fontSize * 0.6)));
			const rows = Math.max(1, Math.floor(height / lineHeight));
			const grid = Array.from({ length: rows }, () => Array<string>(cols).fill(' '));
			const drops = Array.from({ length: cols }, () => -Math.floor(Math.random() * rows));

			const step = () => {
				drops.forEach((row, col) => {
					if (row >= 0 && row < rows) grid[row][col] = pick();
					if (row - TRAIL >= 0 && row - TRAIL < rows) grid[row - TRAIL][col] = ' ';
					drops[col] = row > rows + TRAIL ? -Math.floor(Math.random() * rows) : row + 1;
				});
				screen.textContent = grid.map((line) => line.join('')).join('\n');
			};

			if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
				for (let i = 0; i < rows; i++) step();
				return sleep(DURATION_MS / 2, signal);
			}
			const timer = setInterval(step, FRAME_MS);
			await sleep(DURATION_MS, signal);
			clearInterval(timer);
		});
		ctx.print([{ text: ctx.t('term.matrix.done'), role: 'ok' }]);
	},
} satisfies Command;
