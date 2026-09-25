/**
 * Site analytics for the private dashboard (koncept.md §3.4), cached 5 min.
 * Owner only (src/lib/owner.ts). Without the Cloudflare settings `astro dev`
 * serves the mock, production answers 503.
 */
import type { APIRoute } from 'astro';
import { ownerGate } from '../../../lib/owner';
import { cached } from '../../../lib/server/cache';
import { cloudflareConfig, fetchSite } from '../../../lib/server/cfanalytics';
import { mockSite } from '../../../lib/mocks/site';
import { privateJson, unavailable } from '../../../lib/server/respond';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const denied = ownerGate(request);
	if (denied) return denied;

	const { token, accountTag, siteTag } = cloudflareConfig();
	if (!token || !accountTag || !siteTag) {
		return import.meta.env.DEV
			? privateJson(mockSite().data!)
			: unavailable('CF_ANALYTICS_TOKEN, CF_ACCOUNT_ID or CF_WEB_ANALYTICS_SITE_TAG is not set');
	}

	try {
		const { value, updatedAt } = await cached('site', 5 * 60_000, () => fetchSite());
		return privateJson({ ...value, updatedAt });
	} catch (error) {
		return unavailable(error);
	}
};
