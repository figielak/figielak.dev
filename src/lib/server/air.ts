/**
 * Air quality in Rzeszów from GIOŚ (docs/koncept.md §9) — no key needed. API v1
 * answers in Polish field names and local time; the old /pjp-api/rest is gone.
 *
 * One station in the city centre: its index (six levels) and the latest
 * hourly PM2.5 and PM10. `updatedAt` is when those were measured, not when
 * they were fetched, so a station that stops reporting turns the tile stale.
 */
import { AIR_LEVELS, type Air } from '../mocks/air';

export type AirData = NonNullable<Air['data']>;

const API = 'https://api.gios.gov.pl/pjp-api/v1/rest';
/* Rzeszów, Al. Piłsudskiego: the station closest to the centre with both PMs. */
const STATION_ID = 10125;
const CITY = 'Rzeszów';
const ZONE = 'Europe/Warsaw';

async function get<T>(path: string): Promise<T> {
	const response = await fetch(`${API}${path}`, {
		/* It answers 406 to a plain application/json: its type is JSON-LD. */
		headers: { accept: 'application/ld+json', 'User-Agent': 'figielak.dev' },
		signal: AbortSignal.timeout(10_000),
	});
	if (!response.ok) throw new Error(`GIOŚ ${path}: HTTP ${response.status}`);
	return (await response.json()) as T;
}

/** "2026-09-25 11:00:00" in Warsaw time as a Date. */
export function warsawTime(local: string): Date {
	const [date, time = '00:00:00'] = local.split(' ');
	const asUtc = new Date(`${date}T${time}Z`);
	const offset = new Intl.DateTimeFormat('en', { timeZone: ZONE, timeZoneName: 'longOffset' })
		.formatToParts(asUtc)
		.find((part) => part.type === 'timeZoneName')?.value;
	const [, sign, hours, minutes = '0'] = offset?.match(/GMT([+-])(\d{2}):?(\d{2})?/) ?? [];
	const shift = sign ? (sign === '-' ? -1 : 1) * (Number(hours) * 60 + Number(minutes)) : 0;
	return new Date(asUtc.getTime() - shift * 60_000);
}

interface Sensor {
	'Identyfikator stanowiska': number;
	'Wskaźnik - kod': string;
}

interface Measurements {
	'Lista danych pomiarowych': { Data: string; Wartość: number | null }[];
}

interface Index {
	AqIndex: Record<string, unknown>;
}

const OVERALL = 'Wartość indeksu';
const PER_POLLUTANT = 'Wartość indeksu dla wskaźnika ';

/**
 * The station's index level (0–5). GIOŚ sometimes publishes the overall one
 * as -1 ("Brak indeksu") while the per-pollutant ones are there — the overall
 * index is the worst of those, so it is worked out from them.
 */
export function indexLevel(index: Record<string, unknown>): number | undefined {
	const valid = (value: unknown) => typeof value === 'number' && value >= 0 && value < AIR_LEVELS.length;
	if (valid(index[OVERALL])) return index[OVERALL] as number;
	const parts = Object.entries(index)
		.filter(([key, value]) => key.startsWith(PER_POLLUTANT) && valid(value))
		.map(([, value]) => value as number);
	return parts.length ? Math.max(...parts) : undefined;
}

/** The newest hour with a value — the latest one is often still empty. */
async function latest(sensorId: number): Promise<{ value: number; at: Date }> {
	const body = await get<Measurements>(`/data/getData/${sensorId}`);
	const row = body['Lista danych pomiarowych'].find((item) => item.Wartość !== null);
	if (!row || row.Wartość === null) throw new Error(`GIOŚ sensor ${sensorId}: no measurements`);
	return { value: Math.round(row.Wartość), at: warsawTime(row.Data) };
}

export async function fetchAir(): Promise<AirData> {
	const [index, station] = await Promise.all([
		get<Index>(`/aqindex/getIndex/${STATION_ID}`),
		get<Record<string, unknown>>(`/station/sensors/${STATION_ID}`),
	]);

	const level = AIR_LEVELS[indexLevel(index.AqIndex) ?? -1];
	if (!level) throw new Error('GIOŚ: no air quality index');

	/* The list sits under a long Polish key; it is the one array in the body. */
	const sensors = (Object.values(station).find(Array.isArray) ?? []) as Sensor[];
	const sensorOf = (code: string) => {
		const sensor = sensors.find((item) => item['Wskaźnik - kod'] === code);
		if (!sensor) throw new Error(`GIOŚ: station has no ${code} sensor`);
		return sensor['Identyfikator stanowiska'];
	};
	const [pm25, pm10] = await Promise.all([latest(sensorOf('PM2.5')), latest(sensorOf('PM10'))]);

	return {
		level,
		pm25: pm25.value,
		pm10: pm10.value,
		city: CITY,
		updatedAt: new Date(Math.max(pm25.at.getTime(), pm10.at.getTime())),
	};
}
