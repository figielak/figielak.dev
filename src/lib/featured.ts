/**
 * Projects shown in the featured card on the dashboard (koncept.md §3.4).
 * Test data until the projects content collection exists (§3.2, §16): then
 * this list becomes the entries with `featured: true`. A project without a
 * screenshot gets a quiet placeholder.
 */
import type { ImageMetadata } from 'astro';
import figielakDev from '../assets/projects/figielak-dev.jpg';

export interface FeaturedProject {
	title: string;
	/** One short line: what it is. */
	summary: { pl: string; en: string };
	stack: string[];
	/** Path on this site, localized by the card. */
	href: string;
	image?: ImageMetadata;
}

export const featuredProjects: FeaturedProject[] = [
	{
		title: 'figielak.dev',
		summary: { pl: 'Ta strona: wizytówka i żywy dashboard', en: 'This site: a profile and a live dashboard' },
		stack: ['Astro', 'TypeScript', 'Cloud Run'],
		href: '/projects',
		image: figielakDev,
	},
	{
		title: 'Homelab agent',
		summary: { pl: 'Statystyki homelaba wysyłane na dashboard', en: 'Homelab stats pushed to the dashboard' },
		stack: ['Docker', 'Raspberry Pi'],
		href: '/projects',
	},
];
