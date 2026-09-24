/**
 * Mock air quality until the GIOŚ endpoint exists (koncept.md §9). GIOŚ
 * needs no key; the index has six levels, from very good to very bad.
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

export type AirLevel = 'veryGood' | 'good' | 'moderate' | 'sufficient' | 'bad' | 'veryBad';

export const AIR_LEVELS: AirLevel[] = [
	'veryGood',
	'good',
	'moderate',
	'sufficient',
	'bad',
	'veryBad',
];

export type Air = Live<{
	level: AirLevel;
	/** µg/m³ */
	pm25: number;
	/** µg/m³ */
	pm10: number;
	city: string;
}>;

export const AIR_PLACEHOLDER: NonNullable<Air['data']> = {
	level: 'moderate',
	pm25: 0,
	pm10: 0,
	city: '—',
	updatedAt: new Date(0),
};

export function mockAir(state: LiveState = 'ok'): Air {
	if (state === 'loading' || state === 'error') return { state };

	return {
		state,
		data: {
			level: 'good',
			pm25: 12,
			pm10: 21,
			city: 'Rzeszów',
			updatedAt: mockUpdatedAt(state),
		},
	};
}
