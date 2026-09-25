/**
 * Projects shown in the featured card on the dashboard (koncept.md §3.4) and
 * the featured strip on the home page (§3.1).
 * Test data until the projects content collection exists (§3.2, §16): then
 * this list becomes the entries with `featured: true`. A project without a
 * screenshot gets a quiet placeholder.
 */
import type { ImageMetadata } from 'astro';
import type { IconName } from '../components/ui/Icon.astro';
import figielakDev from '../assets/projects/figielak-dev.jpg';

export interface FeaturedProject {
	title: string;
	/** One short line: what it is. */
	summary: { pl: string; en: string };
	stack: string[];
	/** Path on this site, localized by the card. */
	href: string;
	image?: ImageMetadata;
	/** A few short highlights, each with an icon; shown where the card has room. */
	features?: { icon: IconName; pl: string; en: string }[];
}

export const featuredProjects: FeaturedProject[] = [
	{
		title: 'figielak.dev',
		summary: { pl: 'Ta strona: wizytówka i żywy dashboard', en: 'This site: a profile and a live dashboard' },
		stack: ['Astro', 'TypeScript', 'Cloud Run'],
		href: '/projects',
		image: figielakDev,
		features: [
			{ icon: 'cloud', pl: 'pogoda i powietrze', en: 'weather and air' },
			{ icon: 'music', pl: 'Last.fm na żywo', en: 'Last.fm, live' },
			{ icon: 'github', pl: 'GitHub i WakaTime', en: 'GitHub and WakaTime' },
			{ icon: 'server', pl: 'statystyki homelaba', en: 'homelab stats' },
		],
	},
	{
		title: 'Homelab agent',
		summary: { pl: 'Statystyki homelaba wysyłane na dashboard', en: 'Homelab stats pushed to the dashboard' },
		stack: ['Docker', 'Raspberry Pi'],
		href: '/projects',
		features: [
			{ icon: 'activity', pl: 'CPU, RAM i dysk co minutę', en: 'CPU, RAM and disk every minute' },
			{ icon: 'shield', pl: 'blokada reklam z AdGuarda', en: 'ad blocking from AdGuard' },
			{ icon: 'chart-bar', pl: 'uptime usług', en: 'service uptime' },
		],
	},
	{
		title: 'Zadanie tygodnia',
		summary: { pl: 'Zadanie z matematyki co tydzień, wzory w KaTeX', en: 'A maths problem every week, formulas in KaTeX' },
		stack: ['Astro', 'KaTeX'],
		href: '/projects',
		features: [{ icon: 'math-function', pl: 'wzory renderowane przy buildzie', en: 'formulas rendered at build time' }],
	},
];
