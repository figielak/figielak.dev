/**
 * Contract of the homelab push agent (koncept.md §9): what POST /api/stats
 * accepts. The agent lives in the homelab repository and sends every 60 s:
 *
 *   POST /api/stats
 *   Authorization: Bearer <STATS_PUSH_TOKEN>
 *   {
 *     "v": 1,
 *     "sentAt": "2026-09-24T13:42:47+00:00",
 *     "lab":      { cpu, cpuTempC, ramUsedGb, ramTotalGb, disks: [{ kind, usedGb, totalGb }],
 *                   uptimeDays, containers? },
 *     "dns":      { queriesToday, blockedToday, queriesWeek?, blockedWeek? },
 *     "traffic":  { downGbToday, upGbToday, downGbTotal, upGbTotal, totalSince },
 *     "services": [{ kind, up, uptime30d?, avgMs? }]
 *   }
 *
 * Every section is optional: the agent leaves out one whose source did not
 * answer, and the stored copy keeps its old data and time, so only that tile
 * goes stale. Sections are validated one by one — a bad one is rejected with
 * a reason, the good ones are still saved. Sizes are GiB, percentages 0–100.
 *
 * Only generic kinds travel (koncept.md §14): no host names, IPs or monitors.
 */
import type { MachineStats, Disk, DiskKind } from '../mocks/stats';
import type { Dns, Traffic } from '../mocks/network';
import { SERVICE_KINDS, type ServiceStatus } from '../mocks/uptime';

type Data<T extends { data?: unknown }> = Omit<NonNullable<T['data']>, 'updatedAt'>;

export type LabSection = Data<MachineStats> & { uptimeDays: number };
export type DnsSection = Data<Dns>;
export type TrafficSection = Data<Traffic>;
export type ServicesSection = { services: ServiceStatus[] };

export interface Sections {
	lab: LabSection;
	dns: DnsSection;
	traffic: TrafficSection;
	services: ServicesSection;
}

export type SectionName = keyof Sections;
export const SECTION_NAMES: SectionName[] = ['lab', 'dns', 'traffic', 'services'];

/** A section as stored: its data and when the agent read it. */
export type Stored<T> = T & { updatedAt: string };
export type StoredSections = { [K in SectionName]?: Stored<Sections[K]> };

export interface Rejected {
	section: SectionName;
	reason: string;
}

export interface Parsed {
	sections: StoredSections;
	rejected: Rejected[];
}

const DISK_KINDS: DiskKind[] = ['system', 'data', 'storage'];
/* sentAt may run a little ahead of the server clock, not more. */
const MAX_CLOCK_SKEW_MS = 5 * 60_000;

class Invalid extends Error {}

type Obj = Record<string, unknown>;

function object(value: unknown, path: string): Obj {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Invalid(`${path} is not an object`);
	return value as Obj;
}

function number(o: Obj, key: string, path: string, min: number, max: number, integer = false): number {
	const value = o[key];
	if (typeof value !== 'number' || !Number.isFinite(value)) throw new Invalid(`${path}.${key} is not a number`);
	if (integer && !Number.isInteger(value)) throw new Invalid(`${path}.${key} is not an integer`);
	if (value < min || value > max) throw new Invalid(`${path}.${key} out of range`);
	return value;
}

function optionalNumber(o: Obj, key: string, path: string, min: number, max: number, integer = false) {
	return o[key] === undefined || o[key] === null ? undefined : number(o, key, path, min, max, integer);
}

function array(o: Obj, key: string, path: string, maxLength: number): unknown[] {
	const value = o[key];
	if (!Array.isArray(value)) throw new Invalid(`${path}.${key} is not an array`);
	if (value.length > maxLength) throw new Invalid(`${path}.${key} is too long`);
	return value;
}

function oneOf<T extends string>(o: Obj, key: string, path: string, allowed: readonly T[]): T {
	const value = o[key];
	if (typeof value !== 'string' || !allowed.includes(value as T)) throw new Invalid(`${path}.${key} is unknown`);
	return value as T;
}

const COUNT = 1e10;
const GIB = 1e7;

function parseLab(value: unknown): LabSection {
	const o = object(value, 'lab');
	const disks = array(o, 'disks', 'lab', 8).map((item, i): Disk => {
		const disk = object(item, `lab.disks[${i}]`);
		const path = `lab.disks[${i}]`;
		const totalGb = number(disk, 'totalGb', path, 0, GIB);
		return {
			kind: oneOf(disk, 'kind', path, DISK_KINDS),
			usedGb: number(disk, 'usedGb', path, 0, totalGb),
			totalGb,
		};
	});
	const ramTotalGb = number(o, 'ramTotalGb', 'lab', 0, 4096);
	return {
		cpu: number(o, 'cpu', 'lab', 0, 100),
		cpuTempC: number(o, 'cpuTempC', 'lab', -40, 130),
		ramUsedGb: number(o, 'ramUsedGb', 'lab', 0, ramTotalGb),
		ramTotalGb,
		disks,
		uptimeDays: number(o, 'uptimeDays', 'lab', 0, 36_500),
		containers: optionalNumber(o, 'containers', 'lab', 0, 1000, true),
	};
}

function parseDns(value: unknown): DnsSection {
	const o = object(value, 'dns');
	return {
		queriesToday: number(o, 'queriesToday', 'dns', 0, COUNT, true),
		blockedToday: number(o, 'blockedToday', 'dns', 0, COUNT, true),
		queriesWeek: optionalNumber(o, 'queriesWeek', 'dns', 0, COUNT, true),
		blockedWeek: optionalNumber(o, 'blockedWeek', 'dns', 0, COUNT, true),
	};
}

function parseTraffic(value: unknown): TrafficSection {
	const o = object(value, 'traffic');
	const since = o.totalSince;
	if (typeof since !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(since) || Number.isNaN(Date.parse(since))) {
		throw new Invalid('traffic.totalSince is not a YYYY-MM-DD date');
	}
	return {
		downGbToday: number(o, 'downGbToday', 'traffic', 0, GIB),
		upGbToday: number(o, 'upGbToday', 'traffic', 0, GIB),
		downGbTotal: number(o, 'downGbTotal', 'traffic', 0, GIB),
		upGbTotal: number(o, 'upGbTotal', 'traffic', 0, GIB),
		totalSince: since,
	};
}

function parseServices(value: unknown): ServicesSection {
	if (!Array.isArray(value)) throw new Invalid('services is not an array');
	if (value.length > SERVICE_KINDS.length) throw new Invalid('services is too long');
	const seen = new Set<string>();
	const services = value.map((item, i): ServiceStatus => {
		const path = `services[${i}]`;
		const o = object(item, path);
		const kind = oneOf(o, 'kind', path, SERVICE_KINDS);
		if (seen.has(kind)) throw new Invalid(`${path}.kind is a duplicate`);
		seen.add(kind);
		if (typeof o.up !== 'boolean') throw new Invalid(`${path}.up is not a boolean`);
		return {
			kind,
			up: o.up,
			uptime30d: optionalNumber(o, 'uptime30d', path, 0, 100),
			avgMs: optionalNumber(o, 'avgMs', path, 0, 60_000),
		};
	});
	return { services };
}

const PARSERS: { [K in SectionName]: (value: unknown) => Sections[K] } = {
	lab: parseLab,
	dns: parseDns,
	traffic: parseTraffic,
	services: parseServices,
};

/**
 * Checks a push. A bad envelope (version, time) throws; a bad section is only
 * listed in `rejected`. Objects are rebuilt from known fields, so nothing
 * unexpected reaches the database.
 */
export function parsePush(body: unknown, now = Date.now()): Parsed {
	const o = object(body, 'body');
	if (o.v !== 1) throw new Invalid('unknown version v');

	const sentAt = typeof o.sentAt === 'string' ? Date.parse(o.sentAt) : NaN;
	if (Number.isNaN(sentAt)) throw new Invalid('sentAt is not an ISO date');
	if (sentAt > now + MAX_CLOCK_SKEW_MS) throw new Invalid('sentAt is in the future');
	const updatedAt = new Date(Math.min(sentAt, now)).toISOString();

	const parsed: Parsed = { sections: {}, rejected: [] };
	for (const name of SECTION_NAMES) {
		if (o[name] === undefined) continue;
		try {
			const data = PARSERS[name](o[name]);
			(parsed.sections as Obj)[name] = { ...stripUndefined(data), updatedAt };
		} catch (error) {
			if (!(error instanceof Invalid)) throw error;
			parsed.rejected.push({ section: name, reason: error.message });
		}
	}
	return parsed;
}

export const isInvalid = (error: unknown): error is Error => error instanceof Invalid;

/* Optional fields the agent left out stay out of the stored JSON. */
function stripUndefined<T extends object>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}
