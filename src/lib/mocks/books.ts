/**
 * Mock of the books I am reading, from Hardcover (koncept.md §9): what
 * /api/books returns, for the tile gallery and `astro dev` without a token.
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

/* Stand-in covers: plain gradients, so no real artwork is shipped in mocks. */
const cover = (from: string, to: string) =>
	'data:image/svg+xml,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">' +
			`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${from}"/>` +
			`<stop offset="1" stop-color="${to}"/></linearGradient></defs>` +
			'<rect width="200" height="300" fill="url(#g)"/></svg>',
	);

export interface Book {
	title: string;
	author: string;
	coverUrl?: string;
}

export type Books = Live<{ books: Book[] }>;

/** One page of skeleton books while loading or on error. */
export const BOOKS_PLACEHOLDER: NonNullable<Books['data']> = {
	books: Array.from({ length: 3 }, () => ({ title: '—', author: '—' })),
	updatedAt: new Date(0),
};

export function mockBooks(state: LiveState = 'ok'): Books {
	if (state === 'loading' || state === 'error') return { state };

	return {
		state,
		data: {
			books: [
				{
					title: 'Designing Data-Intensive Applications',
					author: 'Martin Kleppmann',
					coverUrl: cover('#b8412c', '#3b1c32'),
				},
				{ title: 'Wiedźmin: Ostatnie życzenie', author: 'Andrzej Sapkowski', coverUrl: cover('#2f4858', '#86bbd8') },
				{ title: 'Solaris', author: 'Stanisław Lem', coverUrl: cover('#1b998b', '#0b3954') },
				{ title: 'Diuna', author: 'Frank Herbert', coverUrl: cover('#e0a458', '#8a4f19') },
				{ title: 'The Pragmatic Programmer', author: 'David Thomas, Andrew Hunt' },
			],
			updatedAt: mockUpdatedAt(state),
		},
	};
}
