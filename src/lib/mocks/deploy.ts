/**
 * The last deploys of this site (koncept.md §3.4), newest first, as
 * /api/private/deploys returns them from GitHub Actions. Private dashboard only.
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

export type DeployStatus = 'success' | 'building' | 'failed';

export interface DeployRun {
	status: DeployStatus;
	startedAt: Date;
	/** Missing while the run is still going. */
	durationSec?: number;
	commit: string;
	/** First line of the commit message. */
	message: string;
	url: string;
}

export type Deploy = Live<{ runs: DeployRun[] }>;

/** How many runs the tile lists. */
export const DEPLOY_RUNS = 3;

export const DEPLOY_PLACEHOLDER: NonNullable<Deploy['data']> = {
	runs: Array.from({ length: DEPLOY_RUNS }, () => ({
		status: 'success',
		startedAt: new Date(0),
		commit: '0000000',
		message: '—',
		url: '#',
	})),
	updatedAt: new Date(0),
};

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000);

export function mockDeploy(state: LiveState = 'ok'): Deploy {
	if (state === 'loading' || state === 'error') return { state };

	const run = (status: DeployStatus, hours: number, commit: string, message: string): DeployRun => ({
		status,
		startedAt: hoursAgo(hours),
		durationSec: status === 'building' ? undefined : 150,
		commit,
		message,
		url: '#',
	});
	return {
		state,
		data: {
			runs: [
				run('building', 0.05, '686457f', 'Feed the reading tile from Hardcover'),
				run('success', 3, '7ab9bb3', 'Move the goal tile left of GitHub as a narrow card'),
				run('failed', 20, '58ebd86', 'Add live weather and air, a goal tile and track previews'),
			],
			updatedAt: mockUpdatedAt(state),
		},
	};
}
