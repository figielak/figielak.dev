/**
 * Accent candidates for /dev/accent and the floating picker
 * (src/components/dev/AccentPicker.astro). Each one overrides the accent
 * tokens from src/styles/tokens.css on <html>.
 */

/* Temporarily on in production too, so the candidates can be shown to others.
   Set to false and the picker and /dev/accent are dev-only again. */
export const ACCENT_LAB_LIVE = true;

export interface AccentCandidate {
	id: string;
	name: string;
	note: string;
	accent: string;
	hover: string;
	/* The accent as "r g b", for the see-through tokens. */
	rgb: string;
	glowAlpha: number;
	/* Problems keep their own red when the accent is not red. */
	statusDown?: string;
}

export const ACCENTS: AccentCandidate[] = [
	{
		id: 'current',
		name: 'Obecny',
		note: 'Stonowana czerwień (Radix Red) — to, co jest teraz w tokens.css.',
		accent: '#e5484d',
		hover: '#ec5d5e',
		rgb: '229 72 77',
		glowAlpha: 0.35,
	},
	{
		id: 'crimson',
		name: 'Karmazyn',
		note: 'Pełne nasycenie, idzie w malinę. Tekst na tle nie przechodzi AA.',
		accent: '#e8003a',
		hover: '#ff2150',
		rgb: '232 0 58',
		glowAlpha: 0.3,
	},
	{
		id: 'red',
		name: 'Żywa czerwień',
		note: 'Obecny odcień, tylko żywszy. AA wszędzie z zapasem.',
		accent: '#ff2445',
		hover: '#ff4560',
		rgb: '255 36 69',
		glowAlpha: 0.28,
	},
	{
		id: 'raspberry',
		name: 'Rozjaśniony karmazyn',
		note: '#e8003a podniesiony do AA — na styk na --surface.',
		accent: '#f02d5a',
		hover: '#ff4a72',
		rgb: '240 45 90',
		glowAlpha: 0.28,
	},
	{
		id: 'signal',
		name: 'Bonus: sygnałowy pomarańcz',
		note: 'Akcent przestaje być czerwony, więc czerwień zostaje tylko dla błędów — kropka „awaria” w końcu znaczy coś jednoznacznie. Klimat terminala i Teenage Engineering.',
		accent: '#ff5a1f',
		hover: '#ff7a45',
		rgb: '255 90 31',
		glowAlpha: 0.3,
		statusDown: '#e5484d',
	},
];

/** CSS custom properties a candidate sets on <html>. */
export function accentVars(candidate: AccentCandidate): Record<string, string> {
	const { accent, hover, rgb, glowAlpha, statusDown } = candidate;
	return {
		'--accent': accent,
		'--accent-hover': hover,
		'--accent-soft': `rgb(${rgb} / 0.12)`,
		'--nav-active': `rgb(${rgb} / 0.22)`,
		'--glow': `rgb(${rgb} / ${glowAlpha})`,
		'--spotlight': `rgb(${rgb} / 0.6)`,
		'--status-down': statusDown ?? accent,
	};
}

export function styleOf(vars: Record<string, string>): string {
	return Object.entries(vars)
		.map(([name, value]) => `${name}: ${value}`)
		.join('; ');
}

/* Mirrors of --bg, --surface and --accent-foreground in tokens.css, for the
   contrast table. */
export const BACKGROUNDS = { bg: '#0e0e10', surface: '#161618', graphite: '#0e0e10', white: '#ffffff' };

function luminance(hex: string): number {
	const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
	const [r, g, b] = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
	const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (light + 0.05) / (dark + 0.05);
}
