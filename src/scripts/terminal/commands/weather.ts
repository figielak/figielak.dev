import { getJson } from '../fetch';
import { noData, row } from '../format';
import type { AirPayload, WeatherPayload } from '../payloads';
import type { Command } from '../types';

/* The same /api/weather and /api/air the tile reads; each source may fail
   on its own, so each gets its own "no data" line. */
export default {
	name: 'weather',
	aliases: ['pogoda'],
	group: 'live',
	async run(ctx) {
		const pending = ctx.loading();
		const [weather, air] = await Promise.all([
			getJson<WeatherPayload>('/api/weather'),
			getJson<AirPayload>('/api/air'),
		]);

		const lines = weather
			? [
					row(
						ctx.t('term.weather.label'),
						`${weather.tempC}° · ${ctx.t(`weather.${weather.condition}`)} · ${weather.city}`,
					),
					row(
						ctx.t('term.weather.feels'),
						`${weather.feelsLikeC}° · ${ctx.t('term.weather.wind', { n: weather.windKmh })}`,
					),
				]
			: [noData(ctx, ctx.t('term.source.weather'))];

		lines.push(
			air
				? row(ctx.t('term.air.label'), `${ctx.t(`air.${air.level}`)} · PM2.5 ${air.pm25} · PM10 ${air.pm10} µg/m³`)
				: noData(ctx, ctx.t('term.air.label')),
		);
		pending.done(...lines);
	},
} satisfies Command;
