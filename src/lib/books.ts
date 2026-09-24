/**
 * Books I am reading right now (koncept.md §3.4). Static — edit by hand.
 * Covers live in src/assets/books/ (downloaded once from Open Library by ISBN)
 * and go through astro:assets; a book without one shows an icon instead.
 * The tile shows three at a time and flips to the next three on a click.
 * Placeholder entries until the real list is filled in.
 */
import type { ImageMetadata } from 'astro';
import ddia from '../assets/books/designing-data-intensive-applications.jpg';
import witcher from '../assets/books/ostatnie-zyczenie.jpg';
import solaris from '../assets/books/solaris.jpg';
import dune from '../assets/books/diuna.jpg';
import pragmatic from '../assets/books/pragmatic-programmer.jpg';
import habits from '../assets/books/atomowe-nawyki.jpg';

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
	{
		title: 'Solaris',
		author: 'Stanisław Lem',
		cover: solaris,
	},
	{
		title: 'Diuna',
		author: 'Frank Herbert',
		cover: dune,
	},
	{
		title: 'The Pragmatic Programmer',
		author: 'David Thomas, Andrew Hunt',
		cover: pragmatic,
	},
	{
		title: 'Atomowe nawyki',
		author: 'James Clear',
		cover: habits,
	},
];
