import { noData } from '../format';
import type { Command } from '../types';

/*
 * Weather and air quality have no endpoint yet (koncept.md §16.6): the tile
 * still runs on mocks. Until /api/weather and the GIOŚ source exist, the
 * command says so instead of showing test data as real.
 */
export default {
	name: 'weather',
	aliases: ['pogoda'],
	group: 'live',
	run(ctx) {
		ctx.print(noData(ctx, ctx.t('term.source.weather')));
	},
} satisfies Command;
