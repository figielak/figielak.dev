/**
 * The owner's homelab sections for the private dashboard (koncept.md §3.4,
 * §14): monitors and containers by name and the last backup, from the
 * homelab/private document, cached 30 s. Owner only (src/lib/owner.ts).
 *
 * Before the first backup is reported, `backup` answers `{ backup: null }` —
 * the tile shows that as a problem, not as missing data. In `astro dev` the
 * mocks stand in until something is pushed to /api/stats.
 */
import type { APIRoute } from 'astro';
import { ownerGate } from '../../../../lib/owner';
import { cached } from '../../../../lib/server/cache';
import { readPrivateSections } from '../../../../lib/server/firestore';
import type { PrivateSectionName } from '../../../../lib/server/homelab';
import { privateJson, unavailable } from '../../../../lib/server/respond';
import { mockBackup, mockContainers, mockMonitors } from '../../../../lib/mocks/homelab-private';

export const prerender = false;

const TTL_MS = import.meta.env.DEV ? 0 : 30_000;

const MOCKS: Record<PrivateSectionName, () => { data?: object }> = {
	monitors: mockMonitors,
	containers: mockContainers,
	backup: () => mockBackup('ok', true),
};

export const GET: APIRoute = async ({ params, request }) => {
	const denied = ownerGate(request);
	if (denied) return denied;

	const section = params.section as PrivateSectionName;
	if (!(section in MOCKS)) return new Response(null, { status: 404 });

	try {
		const { value, updatedAt } = await cached('homelab:private', TTL_MS, readPrivateSections);
		const data = value[section];
		if (data) return privateJson(data);
		if (import.meta.env.DEV) return privateJson(MOCKS[section]().data!);
		if (section === 'backup') return privateJson({ backup: null, updatedAt });
		return unavailable(`homelab: no ${section} data yet`);
	} catch (error) {
		return unavailable(error);
	}
};
