/**
 * Homelab stats as the lab tile shows them, and mocks for /dev/tiles and
 * `astro dev`. Live data: the push agent → /api/stats → /api/homelab/lab
 * (koncept.md §9). Sizes are GiB.
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

/** Generic disk roles only — no host or mount names (koncept.md §14). */
export type DiskKind = 'system' | 'data' | 'storage';

export interface Disk {
	kind: DiskKind;
	usedGb: number;
	totalGb: number;
}

export type MachineStats = Live<{
	/** Percent, 0–100. */
	cpu: number;
	cpuTempC: number;
	ramUsedGb: number;
	ramTotalGb: number;
	/** Percent, 0–100. The Pi has no GPU, so the agent leaves it out. */
	gpu?: number;
	disks: Disk[];
	containers?: number;
}>;

export const MACHINE_PLACEHOLDER: NonNullable<MachineStats['data']> = {
	cpu: 0,
	cpuTempC: 0,
	ramUsedGb: 0,
	ramTotalGb: 0,
	/* One row per disk the homelab has; the storage HDD joins later. */
	disks: [{ kind: 'system', usedGb: 0, totalGb: 1 }],
	containers: 0,
	updatedAt: new Date(0),
};

export function mockLab(state: LiveState = 'ok'): MachineStats {
	if (state === 'loading' || state === 'error') return { state };

	return {
		state,
		data: {
			cpu: 7.2,
			cpuTempC: 54.3,
			ramUsedGb: 1.42,
			ramTotalGb: 3.71,
			disks: [{ kind: 'system', usedGb: 14.8, totalGb: 116.9 }],
			containers: 11,
			updatedAt: mockUpdatedAt(state),
		},
	};
}
