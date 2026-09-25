/**
 * Projects from the content collection (src/content/projects, koncept.md §3.2),
 * in the shapes the views need: the /projects list, the featured strip on the
 * home page (§3.1), the featured tile on the dashboard (§3.4) and the terminal.
 */
import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { IconName } from '../components/ui/Icon.astro';
import { localizePath, type Lang } from '../i18n';

export type ProjectEntry = CollectionEntry<'projects'>;

export interface FeaturedProject {
	title: string;
	/** One short line: what it is. */
	summary: { pl: string; en: string };
	stack: string[];
	/** Path on this site, already localized. */
	href: string;
	image?: ImageMetadata;
	/** A few short highlights, each with an icon; shown where the card has room. */
	features?: { icon: IconName; pl: string; en: string }[];
}

/** A project has a case study page when its MDX body is not empty. */
export const hasCaseStudy = (project: ProjectEntry) => Boolean(project.body?.trim());

/* Case studies are written in Polish only, so both languages link to the
   Polish page; without one, the link points at the project's row. */
export function projectHref(project: ProjectEntry, lang: Lang): string {
	return hasCaseStudy(project) ? `/projects/${project.id}` : `${localizePath('/projects', lang)}#${project.id}`;
}

/** Demo links may be paths on this site, which follow the page language. */
export function localizeLink(href: string, lang: Lang): string {
	return href.startsWith('/') ? localizePath(href, lang) : href;
}

export async function getProjects(): Promise<ProjectEntry[]> {
	const projects = await getCollection('projects');
	return projects.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedProjects(lang: Lang): Promise<FeaturedProject[]> {
	const projects = await getProjects();
	return projects
		.filter((project) => project.data.featured)
		.map((project) => ({
			title: project.data.title,
			summary: project.data.summary,
			stack: project.data.tags,
			href: projectHref(project, lang),
			image: project.data.cover,
			features: project.data.features as FeaturedProject['features'],
		}));
}
