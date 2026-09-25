/**
 * A 30-second preview of the track for the play button in the music tile
 * (koncept.md §3.4). Last.fm has no audio, so the track is looked up by
 * artist and title in the iTunes Search API (no key). Only a clear match
 * counts: no preview is better than someone else's song.
 */
import type { Track } from './lastfm';

interface SearchResult {
	artistName: string;
	trackName: string;
	previewUrl?: string;
}

/* Lower case without accents, brackets, " - Remastered …" and "feat. …",
   so "Everything In Its Right Place" matches "Everything in Its Right Place". */
export function normalize(text: string): string {
	return text
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/\(.*?\)|\[.*?\]/g, ' ')
		.replace(/\s-\s.*$/, ' ')
		.replace(/\s(feat|ft)\.?\s.*$/, ' ')
		.replace(/[^\p{L}\p{N}]+/gu, ' ')
		.trim();
}

/** The studio version first: an exact title beats "(Live in France)". */
export function pickPreview(results: SearchResult[], track: Pick<Track, 'title' | 'artist'>): string | undefined {
	const title = normalize(track.title);
	const artist = normalize(track.artist);
	const matches = results.filter((result) => {
		const name = normalize(result.artistName);
		return result.previewUrl && normalize(result.trackName) === title && (name.includes(artist) || artist.includes(name));
	});
	const exact = matches.find((result) => result.trackName.toLowerCase() === track.title.toLowerCase());
	return (exact ?? matches[0])?.previewUrl;
}

async function search(track: Pick<Track, 'title' | 'artist'>): Promise<string | undefined> {
	const url = new URL('https://itunes.apple.com/search');
	url.search = new URLSearchParams({
		term: `${track.artist} ${track.title}`,
		entity: 'song',
		country: 'PL',
		limit: '10',
	}).toString();

	const response = await fetch(url, {
		headers: { 'User-Agent': 'figielak.dev' },
		signal: AbortSignal.timeout(5_000),
	});
	if (!response.ok) throw new Error(`iTunes Search: HTTP ${response.status}`);
	const { results = [] } = (await response.json()) as { results?: SearchResult[] };
	return pickPreview(results, track);
}

/* The track stays the same for minutes while the tile asks every 30 s, so
   the last answer — found or not — is kept until the track changes. */
let last: { key: string; url?: string } | undefined;

/** Never throws: without a preview the tile simply has no play button. */
export async function findPreview(track: Pick<Track, 'title' | 'artist'>): Promise<string | undefined> {
	const key = `${track.artist}\n${track.title}`;
	if (last?.key === key) return last.url;
	try {
		const url = await search(track);
		last = { key, url };
		return url;
	} catch (error) {
		console.warn('[preview]', error);
		return undefined;
	}
}
