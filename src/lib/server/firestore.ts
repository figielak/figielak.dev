/**
 * Documents in Firestore (koncept.md §9). Cloud Run scales to zero, so what
 * must outlive an instance lives here: the last homelab reading
 * (homelab/latest, public sections; homelab/private, the owner's), the goal
 * (site/goal) and lesson payments (private/payments).
 *
 * Plain REST instead of the client library: the token and project come from
 * the Cloud Run metadata server, as the service's own account. Every field is
 * stored as a JSON string, and a write names only the fields it has in its
 * update mask — the others keep their data.
 *
 * `astro dev` has no metadata server and keeps the documents in memory.
 */
import {
	PRIVATE_SECTION_NAMES,
	SECTION_NAMES,
	type StoredPrivateSections,
	type StoredSections,
} from './homelab';

const METADATA = 'http://metadata.google.internal/computeMetadata/v1';
const TIMEOUT_MS = 5_000;

let token: { value: string; expiresAt: number } | undefined;
let projectId: string | undefined;
const memory = new Map<string, Record<string, unknown>>();

async function metadata(path: string): Promise<Response> {
	const response = await fetch(`${METADATA}${path}`, {
		headers: { 'Metadata-Flavor': 'Google' },
		signal: AbortSignal.timeout(TIMEOUT_MS),
	});
	if (!response.ok) throw new Error(`metadata ${path}: ${response.status}`);
	return response;
}

async function accessToken(): Promise<string> {
	/* Renew a minute early. */
	if (token && Date.now() < token.expiresAt - 60_000) return token.value;
	const json = (await (await metadata('/instance/service-accounts/default/token')).json()) as {
		access_token: string;
		expires_in: number;
	};
	token = { value: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
	return token.value;
}

async function documentUrl(path: string): Promise<string> {
	projectId ??= await (await metadata('/project/project-id')).text();
	return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${path}`;
}

async function firestore(url: string, init: RequestInit = {}): Promise<Response> {
	return fetch(url, {
		...init,
		headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json' },
		signal: AbortSignal.timeout(TIMEOUT_MS),
	});
}

/** Saves the given fields of a document; the ones left out stay as they are. */
export async function writeDoc(path: string, fields: Record<string, unknown>): Promise<void> {
	const names = Object.keys(fields).filter((name) => fields[name] !== undefined);
	if (names.length === 0) return;

	if (import.meta.env.DEV) {
		memory.set(path, { ...memory.get(path), ...fields });
		return;
	}

	const url = new URL(await documentUrl(path));
	for (const name of names) url.searchParams.append('updateMask.fieldPaths', name);
	const body = Object.fromEntries(names.map((name) => [name, { stringValue: JSON.stringify(fields[name]) }]));

	const response = await firestore(url.toString(), { method: 'PATCH', body: JSON.stringify({ fields: body }) });
	if (!response.ok) throw new Error(`Firestore write ${path}: ${response.status} ${await response.text()}`);
}

/** Every field of a document; an empty object while it does not exist. */
export async function readDoc(path: string): Promise<Record<string, unknown>> {
	if (import.meta.env.DEV) return { ...memory.get(path) };

	const response = await firestore(await documentUrl(path));
	if (response.status === 404) return {};
	if (!response.ok) throw new Error(`Firestore read ${path}: ${response.status} ${await response.text()}`);

	const { fields = {} } = (await response.json()) as { fields?: Record<string, { stringValue?: string }> };
	return Object.fromEntries(
		Object.entries(fields).flatMap(([name, { stringValue }]) => (stringValue ? [[name, JSON.parse(stringValue)]] : [])),
	);
}

/** Saves the public homelab sections given; the ones left out stay as they are. */
export const writeSections = (sections: StoredSections) => writeDoc('homelab/latest', sections);

/** All stored public homelab sections; an empty object before the first push. */
export async function readSections(): Promise<StoredSections> {
	const doc = await readDoc('homelab/latest');
	return Object.fromEntries(SECTION_NAMES.filter((name) => doc[name]).map((name) => [name, doc[name]])) as StoredSections;
}

/* The owner's sections live in their own document, so no public endpoint,
   which reads homelab/latest, can ever return them (koncept.md §14). */
export const writePrivateSections = (sections: StoredPrivateSections) => writeDoc('homelab/private', sections);

export async function readPrivateSections(): Promise<StoredPrivateSections> {
	const doc = await readDoc('homelab/private');
	return Object.fromEntries(
		PRIVATE_SECTION_NAMES.filter((name) => doc[name]).map((name) => [name, doc[name]]),
	) as StoredPrivateSections;
}
