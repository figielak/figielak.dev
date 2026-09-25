import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Projects (koncept.md §3.2): one MDX file per project. The frontmatter feeds
 * the /projects list, the featured strip on the home page and the featured
 * tile on the dashboard; the body, when there is one, is the case study
 * (Polish) at /projects/<slug>. An empty body means no case study page.
 */
const localized = z.object({ pl: z.string(), en: z.string() });

const projects = defineCollection({
	loader: glob({ pattern: '*.mdx', base: './src/content/projects' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			year: z.number().int(),
			/** Still going on: the year reads as "2026–now". */
			ongoing: z.boolean().default(false),
			/** One sentence: problem → solution → result, ideally with a number. */
			summary: localized,
			/** Two to four, not the whole stack. */
			tags: z.array(z.string()).min(1).max(4),
			links: z
				.object({
					repo: z.url().optional(),
					/** A path on this site (localized) or a full URL. */
					demo: z.string().optional(),
				})
				.default({}),
			cover: image().optional(),
			/** Featured projects lead /projects and fill the home and dashboard strips. */
			featured: z.boolean().default(false),
			/** Lower comes first. */
			order: z.number().int(),
			/** A few highlights with an icon, shown where the card has room. */
			features: z.array(z.object({ icon: z.string(), pl: z.string(), en: z.string() })).optional(),
		}),
});

export const collections = { projects };
