/**
 * Books I am reading right now (koncept.md §3.4). Static — edit by hand.
 * Placeholder entries until the real list is filled in.
 */
export interface Book {
	title: string;
	author: string;
	/** Percent read, 0–100; leave out when unknown. */
	progress?: number;
}

export const books: Book[] = [
	{
		title: 'Designing Data-Intensive Applications',
		author: 'Martin Kleppmann',
		progress: 42,
	},
	{
		title: 'Wiedźmin: Ostatnie życzenie',
		author: 'Andrzej Sapkowski',
		progress: 70,
	},
];
