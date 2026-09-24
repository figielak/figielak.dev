import { getJson } from '../fetch';
import { noData, number } from '../format';
import type { MusicPayload } from '../payloads';
import type { Command } from '../types';

export default {
	name: 'np',
	aliases: ['music', 'muzyka'],
	group: 'live',
	async run(ctx) {
		const pending = ctx.loading();
		const music = await getJson<MusicPayload>('/api/music');
		if (!music) return pending.done(noData(ctx, 'last.fm'));

		const { track, topArtists } = music;
		const width = Math.max(0, ...topArtists.map((artist) => artist.name.length)) + 2;
		pending.done(
			[
				track.nowPlaying ? { text: '● ', role: 'ok' } : { text: '○ ', role: 'muted' },
				{ text: `${ctx.t(track.nowPlaying ? 'term.np.now' : 'term.np.last')}: `, role: 'muted' },
				{ text: `${track.title} — ${track.artist}` },
			],
			'',
			[{ text: ctx.t('term.np.top'), role: 'muted' }],
			...topArtists.slice(0, 3).map((artist, i) => [
				{ text: `  ${i + 1}. ${artist.name.padEnd(width)}` },
				{ text: ctx.t('term.np.plays', { n: number(ctx, artist.plays) }), role: 'muted' as const },
			]),
		);
	},
} satisfies Command;
