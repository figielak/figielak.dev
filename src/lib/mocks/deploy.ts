/**
 * Mock of the last site deploy until the Cloudflare API endpoint exists
 * (koncept.md §9). Private dashboard only.
 */
import { mockUpdatedAt, type Live, type LiveState } from '../live';

export type DeployStatus = 'success' | 'building' | 'failed';

export type Deploy = Live<{
	status: DeployStatus;
	deployedAt: Date;
	commit: string;
	message: string;
}>;

export const DEPLOY_PLACEHOLDER: NonNullable<Deploy['data']> = {
	status: 'success',
	deployedAt: new Date(0),
	commit: '0000000',
	message: '—',
	updatedAt: new Date(0),
};

export function mockDeploy(state: LiveState = 'ok'): Deploy {
	if (state === 'loading' || state === 'error') return { state };

	return {
		state,
		data: {
			status: 'success',
			deployedAt: new Date(Date.now() - 3 * 3_600_000),
			commit: 'c8e9c8c',
			message: 'Rebuild tutoring view as a dossier like home',
			updatedAt: mockUpdatedAt(state),
		},
	};
}
