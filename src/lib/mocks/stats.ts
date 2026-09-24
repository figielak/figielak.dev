/**
 * Mock homelab stats until the push agent and /api/stats exist
 * (koncept.md §9).
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
	/** Percent, 0–100. */
	gpu: number;
	disks: Disk[];
	containers?: number;
}>;

export const MACHINE_PLACEHOLDER: NonNullable<MachineStats['data']> = {
	cpu: 0,
	cpuTempC: 0,
	ramUsedGb: 0,
	ramTotalGb: 0,
	gpu: 0,
	disks: [
		{ kind: 'system', usedGb: 0, totalGb: 1 },
		{ kind: 'data', usedGb: 0, totalGb: 1 },
	],
	containers: 0,
	updatedAt: new Date(0),
};

export function mockLab(state: LiveState = 'ok'): MachineStats {
	if (state === 'loading' || state === 'error') return { state };

	return {
		state,
		data: {
			cpu: 11,
			cpuTempC: 44,
			ramUsedGb: 9.6,
			ramTotalGb: 16,
			gpu: 3,
			disks: [
				{ kind: 'system', usedGb: 58, totalGb: 256 },
				{ kind: 'storage', usedGb: 2870, totalGb: 4000 },
			],
			containers: 14,
			updatedAt: mockUpdatedAt(state),
		},
	};
}
