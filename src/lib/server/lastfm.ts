/**
 * Last.fm for the music tile (docs/koncept.md §9): the track playing now (or the
 * last one) and this week's top artists. LASTFM_API_KEY and LASTFM_USER are
 * read at runtime on the server.
 */
import type { Music } from '../mocks/music';

export type Track = NonNullable<Music['data']>['track'];
export type TopArtist = NonNullable<Music['data']>['topArtists'][number];

export const lastfmConfig = () => ({
	apiKey: process.env.LASTFM_API_KEY ?? '',
	user: process.env.LASTFM_USER ?? '',
});

/* Last.fm returns this grey star image when a release has no cover. */
const NO_COVER = '2a96cbd8b46e442fc41c2b86b821562f';

async function call<T>(method: string, params: Record<string, string>): Promise<T> {
	const { apiKey, user } = lastfmConfig();
	const url = new URL('https://ws.audioscrobbler.com/2.0/');
	url.search = new URLSearchParams({ method, user, api_key: apiKey, format: 'json', ...params }).toString();

	const response = await fetch(url, {
		headers: { 'User-Agent': 'figielak.dev' },
		signal: AbortSignal.timeout(10_000),
	});
	const body = (await response.json().catch(() => ({}))) as T & { error?: number; message?: string };
	if (!response.ok || body.error) {
		throw new Error(`Last.fm ${method}: ${body.message ?? `HTTP ${response.status}`}`);
	}
	return body;
}

interface RecentTracks {
	recenttracks: {
		track: {
			name: string;
			artist: { '#text': string };
			image?: { '#text': string; size: string }[];
			'@attr'?: { nowplaying?: string };
		}[];
	};
}

export async function fetchTrack(): Promise<Track> {
	const body = await call<RecentTracks>('user.getrecenttracks', { limit: '1' });
	const track = body.recenttracks.track[0];
	if (!track) throw new Error('Last.fm: no scrobbles yet');

	const cover = track.image?.find((image) => image.size === 'extralarge')?.['#text'];
	return {
		title: track.name,
		artist: track.artist['#text'],
		nowPlaying: track['@attr']?.nowplaying === 'true',
		coverUrl: cover && !cover.includes(NO_COVER) ? cover : undefined,
	};
}

interface TopArtists {
	topartists: { artist: { name: string; playcount: string }[] };
}

export async function fetchTopArtists(): Promise<TopArtist[]> {
	const body = await call<TopArtists>('user.gettopartists', { period: '7day', limit: '3' });
	return body.topartists.artist.map((artist) => ({ name: artist.name, plays: Number(artist.playcount) }));
}
