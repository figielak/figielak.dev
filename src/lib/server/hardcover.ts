/**
 * Books I am reading from Hardcover (koncept.md §9): my library entries with
 * the "Currently Reading" status, newest first. HARDCOVER_TOKEN is a server
 * secret read at runtime; a token with the `read:library` scope is enough.
 * Hardcover allows its API only where the token stays secret, never in the
 * browser.
 */
import type { Book } from '../mocks/books';

/* Status ids of a library entry: 1 want to read, 2 currently reading, 3 read. */
const CURRENTLY_READING = 2;

/* The edition I picked comes first: its title and cover are the ones I read
   (a Polish translation, say); the book's are the fallback. */
const QUERY = `query {
	me {
		user_books(where: { status_id: { _eq: ${CURRENTLY_READING} } }, order_by: { updated_at: desc }) {
			edition { title image { url } }
			book {
				title
				image { url }
				contributions { contribution author { name } }
			}
		}
	}
}`;

interface Image {
	url: string | null;
}

interface UserBook {
	edition: { title: string | null; image: Image | null } | null;
	book: {
		title: string;
		image: Image | null;
		contributions: { contribution: string | null; author: { name: string } | null }[];
	};
}

interface Response {
	data?: { me: { user_books: UserBook[] }[] };
	errors?: { message: string }[];
	error?: string;
}

/* The token page shows it with the "Bearer " prefix; accept it either way. */
export const hardcoverToken = () => (process.env.HARDCOVER_TOKEN ?? '').replace(/^Bearer\s+/i, '');

/** Authors only: a contribution without a role is the author, others are translators and the like. */
function authors(contributions: UserBook['book']['contributions']): string {
	const names = contributions
		.filter(({ contribution }) => !contribution || contribution.toLowerCase() === 'author')
		.flatMap(({ author }) => (author ? [author.name] : []));
	return names.slice(0, 2).join(', ');
}

export async function fetchBooks(): Promise<{ books: Book[] }> {
	const response = await fetch('https://api.hardcover.app/v1/graphql', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${hardcoverToken()}`,
			'Content-Type': 'application/json',
			'User-Agent': 'figielak.dev (reading tile on the dashboard)',
		},
		body: JSON.stringify({ query: QUERY }),
		signal: AbortSignal.timeout(10_000),
	});
	const body = (await response.json().catch(() => ({}))) as Response;
	if (!response.ok || body.errors?.length || !body.data) {
		throw new Error(`Hardcover: ${body.errors?.[0]?.message ?? body.error ?? `HTTP ${response.status}`}`);
	}

	const entries = body.data.me[0]?.user_books ?? [];
	return {
		books: entries.map(({ edition, book }) => ({
			title: edition?.title || book.title,
			author: authors(book.contributions),
			coverUrl: edition?.image?.url || book.image?.url || undefined,
		})),
	};
}
