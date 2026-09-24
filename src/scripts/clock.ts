/**
 * Keeps every `[data-clock]` element showing the current time in its
 * `data-time-zone`, formatted for its `data-locale`. Ticks every second but
 * only touches the DOM when the displayed text changes.
 *
 * `data-clock-format` picks what is shown:
 *   time (default) `14:05` · seconds `07` · date `wtorek, 23 września` ·
 *   offset `GMT+2` (follows DST, so it cannot be baked in at build time)
 */
type ClockFormat = 'time' | 'seconds' | 'date' | 'offset';

function formatter(el: HTMLElement): (now: Date) => string {
	const { locale, timeZone } = el.dataset;
	const format = (el.dataset.clockFormat ?? 'time') as ClockFormat;

	switch (format) {
		case 'seconds':
			return (now) => String(now.getSeconds()).padStart(2, '0');
		case 'date': {
			const f = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone });
			return (now) => f.format(now);
		}
		case 'offset': {
			const f = new Intl.DateTimeFormat(locale, { timeZoneName: 'shortOffset', timeZone });
			return (now) => f.formatToParts(now).find((part) => part.type === 'timeZoneName')?.value ?? '';
		}
		default: {
			const f = new Intl.DateTimeFormat(locale, {
				hour: '2-digit',
				minute: '2-digit',
				hourCycle: 'h23',
				timeZone,
			});
			return (now) => f.format(now);
		}
	}
}

export function startClocks() {
	const clocks = [...document.querySelectorAll<HTMLTimeElement>('time[data-clock]')]
		.filter((el) => !el.dataset.clockStarted)
		.map((el) => {
			el.dataset.clockStarted = '';
			return { el, format: formatter(el) };
		});
	if (clocks.length === 0) return;

	const tick = () => {
		const now = new Date();
		for (const { el, format } of clocks) {
			const text = format(now);
			if (el.textContent !== text) {
				el.textContent = text;
				el.dateTime = now.toISOString();
			}
		}
	};

	tick();
	setInterval(tick, 1000);
}
