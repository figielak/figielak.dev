/**
 * Last.fm for the music tile (koncept.md §9): the current track cached 30 s,
 * the week's top artists 1 h. Without LASTFM_API_KEY and LASTFM_USER
 * `astro dev` serves the mock, production answers 503.
 */
import type { APIRoute } from 'astro';
import { cached } from '../../lib/server/cache';
import { fetchTopArtists, fetchTrack, lastfmConfig } from '../../lib/server/lastfm';
import { mockMusic } from '../../lib/mocks/music';
import { liveJson, unavailable } from '../../lib/server/respond';

export const prerender = false;

export const GET: APIRoute = async () => {
	const { apiKey, user } = lastfmConfig();
	if (!apiKey || !user) {
		return import.meta.env.DEV
			? liveJson(mockMusic().data!, 30)
			: unavailable('LASTFM_API_KEY or LASTFM_USER is not set');
	}

	try {
		const [track, top] = await Promise.all([
			cached('lastfm:track', 30_000, fetchTrack),
			cached('lastfm:top', 60 * 60_000, fetchTopArtists),
		]);
		/* The footer's "updated … ago" follows the track, which changes most often. */
		return liveJson({ track: track.value, topArtists: top.value, updatedAt: track.updatedAt }, 30);
	} catch (error) {
		return unavailable(error);
	}
};
