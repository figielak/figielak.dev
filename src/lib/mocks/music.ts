/**
 * Mock Last.fm data until the endpoint exists (koncept.md §9): the track
 * playing now (or last played) and this week's top artists.
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

export type Music = Live<{
	track: {
		title: string;
		artist: string;
		nowPlaying: boolean;
		coverUrl?: string;
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
