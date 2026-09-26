/**
 * Reads one of the site's /api/* endpoints (docs/koncept.md §9). Never throws:
 * a failed request is null, and the command prints "<source>: no data".
 */
export async function getJson<T>(url: string): Promise<T | null> {
	try {
		const response = await fetch(url, { headers: { accept: 'application/json' } });
		if (!response.ok) return null;
		return (await response.json()) as T;
	} catch {
		return null;
	}
}
