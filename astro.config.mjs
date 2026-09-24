import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import tailwindcss from '@tailwindcss/vite';
import { katexPlugin } from './src/plugins/katex.js';

export default defineConfig({
	site: 'https://figielak.dev',
	/* Pages stay prerendered; the Node server on Cloud Run only answers routes
	   with `prerender = false`, i.e. /api/* (koncept.md §9–§10). */
	adapter: node({ mode: 'standalone' }),
	integrations: [
		mdx(),
		/* The private dashboard is password-protected (koncept.md §14). */
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
