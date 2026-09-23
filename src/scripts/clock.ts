/**
 * Keeps every `[data-clock]` element showing the current time in its
 * `data-time-zone`, formatted for its `data-locale`. Ticks every second but
 * only touches the DOM when the displayed minute changes.
 */
export function startClocks() {
	const clocks = [...document.querySelectorAll<HTMLTimeElement>('time[data-clock]')].map((el) => ({
		el,
		format: new Intl.DateTimeFormat(el.dataset.locale, {
			hour: '2-digit',
			minute: '2-digit',
			hourCycle: 'h23',
			timeZone: el.dataset.timeZone,
		}),
	}));
	if (clocks.length === 0) return;

	const tick = () => {
		const now = new Date();
		for (const { el, format } of clocks) {
			const text = format.format(now);
			if (el.textContent !== text) {
				el.textContent = text;
				el.dateTime = now.toISOString();
			}
		}
	};

	tick();
	setInterval(tick, 1000);
}
