/**
 * The last homelab reading in Firestore (koncept.md §9): one document,
 * homelab/latest, with one field per section. Cloud Run scales to zero, so
 * the reading cannot live in memory.
 *
 * Plain REST instead of the client library: the token and project come from
 * the Cloud Run metadata server, as the service's own account. Each section
 * is stored as a JSON string, and a write names only the sections it has in
 * its update mask — the others keep their data and their old time.
 *
 * `astro dev` has no metadata server and keeps the document in memory.
 */
import { SECTION_NAMES, type StoredSections } from './homelab';

const METADATA = 'http://metadata.google.internal/computeMetadata/v1';
const TIMEOUT_MS = 5_000;

let token: { value: string; expiresAt: number } | undefined;
let projectId: string | undefined;
const memory: StoredSections = {};

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

async function documentUrl(): Promise<string> {
	projectId ??= await (await metadata('/project/project-id')).text();
	return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/homelab/latest`;
}

async function firestore(url: string, init: RequestInit = {}): Promise<Response> {
	return fetch(url, {
		...init,
		headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json' },
		signal: AbortSignal.timeout(TIMEOUT_MS),
	});
}

/** Saves the given sections; the ones left out stay as they are. */
export async function writeSections(sections: StoredSections): Promise<void> {
	const names = SECTION_NAMES.filter((name) => sections[name]);
	if (names.length === 0) return;

	if (import.meta.env.DEV) {
		Object.assign(memory, sections);
		return;
	}

	const url = new URL(await documentUrl());
	for (const name of names) url.searchParams.append('updateMask.fieldPaths', name);
	const fields = Object.fromEntries(names.map((name) => [name, { stringValue: JSON.stringify(sections[name]) }]));

	const response = await firestore(url.toString(), { method: 'PATCH', body: JSON.stringify({ fields }) });
	if (!response.ok) throw new Error(`Firestore write: ${response.status} ${await response.text()}`);
}

/** All stored sections; an empty object before the first push. */
export async function readSections(): Promise<StoredSections> {
	if (import.meta.env.DEV) return { ...memory };

	const response = await firestore(await documentUrl());
	if (response.status === 404) return {};
	if (!response.ok) throw new Error(`Firestore read: ${response.status} ${await response.text()}`);

	const { fields = {} } = (await response.json()) as { fields?: Record<string, { stringValue?: string }> };
	const sections: StoredSections = {};
	for (const name of SECTION_NAMES) {
		const json = fields[name]?.stringValue;
		if (json) (sections as Record<string, unknown>)[name] = JSON.parse(json);
	}
	return sections;
}
