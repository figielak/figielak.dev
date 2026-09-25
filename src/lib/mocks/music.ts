/**
 * Mock Last.fm data until the endpoint exists (koncept.md §9): the track
 * playing now (or last played) and this week's top artists.
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

/* A stand-in cover: a plain gradient, so no real artwork is shipped in mocks. */
const MOCK_COVER =
	'data:image/svg+xml,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">' +
			'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
			'<stop offset="0" stop-color="#3a6ea5"/><stop offset=".55" stop-color="#8a4f7d"/>' +
			'<stop offset="1" stop-color="#e0a458"/></linearGradient></defs>' +
			'<rect width="300" height="300" fill="url(#g)"/>' +
			'<circle cx="210" cy="95" r="55" fill="#f4d58d" opacity=".8"/></svg>',
	);

export type Music = Live<{
	track: {
		title: string;
		artist: string;
		nowPlaying: boolean;
		coverUrl?: string;
		/** 30-second preview for the play button (iTunes Search). */
		previewUrl?: string;
	};
	topArtists: { name: string; plays: number }[];
}>;

export const MUSIC_PLACEHOLDER: NonNullable<Music['data']> = {
	track: { title: '—', artist: '—', nowPlaying: false },
	topArtists: [
		{ name: '—', plays: 0 },
		{ name: '—', plays: 0 },
		{ name: '—', plays: 0 },
	],
	updatedAt: new Date(0),
};

export function mockMusic(state: LiveState = 'ok'): Music {
	if (state === 'loading' || state === 'error') return { state };

	return {
		state,
		data: {
			track: {
				title: 'Everything In Its Right Place',
				artist: 'Radiohead',
				nowPlaying: state === 'ok',
				coverUrl: MOCK_COVER,
			},
			topArtists: [
				{ name: 'Radiohead', plays: 64 },
				{ name: 'Daft Punk', plays: 41 },
				{ name: 'Taco Hemingway', plays: 27 },
			],
			updatedAt: mockUpdatedAt(state),
		},
	};
}
