/**
 * Mock coffee counter; the real source is still open (koncept.md §17).
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

export type Coffee = Live<{ today: number; year: number }>;

export const COFFEE_PLACEHOLDER: NonNullable<Coffee['data']> = {
	today: 0,
	year: 0,
	updatedAt: new Date(0),
};

export function mockCoffee(state: LiveState = 'ok'): Coffee {
	if (state === 'loading' || state === 'error') return { state };
	return {
		state,
		data: { today: 2, year: 412, updatedAt: mockUpdatedAt(state) },
	};
}
