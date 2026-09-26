/**
 * The last deploys of this site from the GitHub Actions API (docs/koncept.md §9):
 * runs of .github/workflows/deploy.yml, newest first. The repository is
 * public, so GITHUB_TOKEN needs no scopes.
 */
import { DEPLOY_RUNS, type DeployRun, type DeployStatus } from '../mocks/deploy';
import { githubToken } from './github';

const RUNS_URL = `https://api.github.com/repos/figielak/figielak.dev/actions/workflows/deploy.yml/runs?per_page=${DEPLOY_RUNS}`;

interface Run {
	status: string;
	conclusion: string | null;
	head_sha: string;
	head_commit: { message: string } | null;
	run_started_at: string;
	updated_at: string;
	html_url: string;
}

function status(run: Run): DeployStatus {
	if (run.status !== 'completed') return 'building';
	return run.conclusion === 'success' ? 'success' : 'failed';
}

export async function fetchDeploys(): Promise<{ runs: DeployRun[] }> {
	const response = await fetch(RUNS_URL, {
		headers: {
			Authorization: `Bearer ${githubToken()}`,
			Accept: 'application/vnd.github+json',
			'User-Agent': 'figielak.dev',
		},
		signal: AbortSignal.timeout(10_000),
	});
	if (!response.ok) throw new Error(`GitHub Actions responded ${response.status}`);

	const { workflow_runs } = (await response.json()) as { workflow_runs: Run[] };
	return {
		runs: workflow_runs.map((run) => {
			const startedAt = new Date(run.run_started_at);
			const done = run.status === 'completed';
			return {
				status: status(run),
				startedAt,
				durationSec: done ? Math.round((Date.parse(run.updated_at) - startedAt.getTime()) / 1000) : undefined,
				commit: run.head_sha.slice(0, 7),
				message: (run.head_commit?.message ?? '').split('\n')[0],
				url: run.html_url,
			};
		}),
	};
}
