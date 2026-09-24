/**
 * Books I am reading right now (koncept.md §3.4). Static — edit by hand.
 * Covers live in src/assets/books/ (downloaded once from Open Library by ISBN)
 * and go through astro:assets; a book without one shows an icon instead.
 * Placeholder entries until the real list is filled in.
 */
import type { ImageMetadata } from 'astro';
import ddia from '../assets/books/designing-data-intensive-applications.jpg';
import witcher from '../assets/books/ostatnie-zyczenie.jpg';

export interface Book {
	title: string;
	author: string;
	cover?: ImageMetadata;
}

export const books: Book[] = [
	{
		title: 'Designing Data-Intensive Applications',
		author: 'Martin Kleppmann',
		cover: ddia,
	},
	{
		title: 'Wiedźmin: Ostatnie życzenie',
		author: 'Andrzej Sapkowski',
		cover: witcher,
	},
];
