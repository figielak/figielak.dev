/**
 * Books I am reading from Hardcover for the "Reading" tile, cached 1 h
 * (docs/koncept.md §9). Without HARDCOVER_TOKEN `astro dev` serves the mock,
 * production answers 503.
 */
import type { APIRoute } from 'astro';
import { cached } from '../../lib/server/cache';
import { fetchBooks, hardcoverToken } from '../../lib/server/hardcover';
import { mockBooks } from '../../lib/mocks/books';
import { liveJson, unavailable } from '../../lib/server/respond';

export const prerender = false;

const HOUR = 60 * 60_000;

export const GET: APIRoute = async () => {
	if (!hardcoverToken()) {
		return import.meta.env.DEV ? liveJson(mockBooks().data!, 60) : unavailable('HARDCOVER_TOKEN is not set');
	}

	try {
		const { value, updatedAt } = await cached('books', HOUR, fetchBooks);
		return liveJson({ ...value, updatedAt }, 600);
	} catch (error) {
		return unavailable(error);
	}
};
