import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import tailwindcss from '@tailwindcss/vite';
import { katexPlugin } from './src/plugins/katex.js';

export default defineConfig({
	site: 'https://figielak.dev',
	integrations: [
		mdx(),
		/* The private dashboard sits behind Cloudflare Access (koncept.md §14). */
		sitemap({ filter: (page) => !page.includes('/dashboard/private') }),
	],
	markdown: {
		processor: satteri({
			features: { math: true },
			mdastPlugins: [katexPlugin()],
		}),
	},
	vite: { plugins: [tailwindcss()] },
});
