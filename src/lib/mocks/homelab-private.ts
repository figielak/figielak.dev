/**
 * The owner's view of the homelab (koncept.md §3.4, §14): monitors and
 * containers by name, and the last backup. The agent pushes these as private
 * sections; they are stored apart from the public reading and only ever
 * served behind the password (/api/private/homelab/*).
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

/** One Uptime Kuma monitor; `name` matches a service in src/lib/services.ts. */
export interface Monitor {
	name: string;
	up: boolean;
	/** Average response time over the last 30 days. */
	avgMs?: number;
	/** Percent over the last 30 days, 0–100. */
	uptime30d?: number;
}

export const CONTAINER_STATES = ['running', 'restarting', 'paused', 'exited', 'created', 'dead'] as const;
export const CONTAINER_HEALTH = ['healthy', 'unhealthy', 'starting'] as const;

export interface Container {
	name: string;
	state: (typeof CONTAINER_STATES)[number];
	health?: (typeof CONTAINER_HEALTH)[number];
	/** A newer image is out (Diun), once the agent reads it. */
	updateAvailable?: boolean;
}

export const BACKUP_TOOLS = ['restic', 'borg', 'kopia'] as const;

export interface BackupRun {
	tool: (typeof BACKUP_TOOLS)[number];
	lastRunAt: Date;
	ok: boolean;
	sizeGb?: number;
	snapshots?: number;
}

export type Monitors = Live<{ monitors: Monitor[] }>;
export type Containers = Live<{ containers: Container[] }>;
/** `backup` is null until the first backup is reported: shown as a problem. */
export type Backup = Live<{ backup: BackupRun | null }>;

/** A backup older than this counts as missed, as if it had failed. */
export const BACKUP_MAX_AGE_H = 26;

export const MONITORS_PLACEHOLDER: NonNullable<Monitors['data']> = { monitors: [], updatedAt: new Date(0) };
export const CONTAINERS_PLACEHOLDER: NonNullable<Containers['data']> = {
	containers: Array.from({ length: 4 }, () => ({ name: '—', state: 'running' })),
	updatedAt: new Date(0),
};
export const BACKUP_PLACEHOLDER: NonNullable<Backup['data']> = {
	backup: { tool: 'restic', lastRunAt: new Date(0), ok: true },
	updatedAt: new Date(0),
};

export function mockMonitors(state: LiveState = 'ok'): Monitors {
	if (state === 'loading' || state === 'error') return { state };
	return {
		state,
		data: {
			monitors: [
				{ name: 'Mealie', up: true, avgMs: 42, uptime30d: 99.9 },
				{ name: 'AdGuard', up: true, avgMs: 4, uptime30d: 99.97 },
				{ name: 'Uptime Kuma', up: true, avgMs: 18, uptime30d: 100 },
				{ name: 'Beszel', up: false, avgMs: 31, uptime30d: 96.1 },
			],
			updatedAt: mockUpdatedAt(state),
		},
	};
}

export function mockContainers(state: LiveState = 'ok'): Containers {
	if (state === 'loading' || state === 'error') return { state };
	return {
		state,
		data: {
			containers: [
				{ name: 'caddy', state: 'running', health: 'healthy' },
				{ name: 'adguard', state: 'running' },
				{ name: 'mealie', state: 'running', updateAvailable: true },
				{ name: 'uptime-kuma', state: 'running', health: 'healthy' },
				{ name: 'beszel', state: 'restarting' },
				{ name: 'dashboard-agent', state: 'running' },
			],
			updatedAt: mockUpdatedAt(state),
		},
	};
}

/** `missing` shows the tile before the first backup: the honest state today. */
export function mockBackup(state: LiveState = 'ok', missing = false): Backup {
	if (state === 'loading' || state === 'error') return { state };
	return {
		state,
		data: {
			backup: missing
				? null
				: { tool: 'restic', lastRunAt: new Date(Date.now() - 4 * 3_600_000), ok: true, sizeGb: 12.4, snapshots: 31 },
			updatedAt: mockUpdatedAt(state),
		},
	};
}
