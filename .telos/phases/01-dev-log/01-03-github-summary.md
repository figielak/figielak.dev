---
id: 01-03
title: Simplify the GitHub activity tile
type: code
status: approved    # draft | approved | in-progress | done | blocked | reverted
critical: false
effort: normal      # normal | hard
depends: ["01-01"]
decisions: []       # phase-local, e.g. [D-03]
scope: ["src/components/tiles/GithubTile.astro","src/lib/mocks/github.ts","src/i18n/pl.json","src/i18n/en.json","src/pages/dev/[gallery].astro"]
---
## Goal
Make GitHub a restrained activity summary with a profile link, a contribution total and a readable heatmap. Remove streak and repository counters from this tile without changing the API contract.

## Read first
- src/components/tiles/GithubTile.astro:20-105 (props, markup and live renderer)
- src/components/tiles/GithubTile.astro:107-195 (summary and heatmap styles)
- src/lib/mocks/github.ts:7-64 (53-week contract and state mocks)
- src/scripts/live.ts:26-89 (loading, freshness and failed refresh handling)
- src/pages/dev/[gallery].astro:54-64 (GitHub state examples)

## Files
- src/components/tiles/GithubTile.astro (modify)
- src/lib/mocks/github.ts (modify)
- src/i18n/pl.json (modify)
- src/i18n/en.json (modify)
- src/pages/dev/[gallery].astro (modify)

## Constraints
- Preserve Github props, endpoint opt-in, /api/github payload, freshness threshold and profile URL.
- Remove streak/repository presentation only; retain fields consumed by other clients.
- Use contribution wording with an explicit period, never commits, quality scores or productivity claims.
- Keep the annual heatmap and tokenized GitHub colours; its accessible summary must describe the data.
- Follow PROJECT.md §Rules: mock first, loading/ok/stale/error, fixed footprint, i18n and AA.
- Use browser assertions and existing mocks; add no UI testing dependency or shared live-engine refactor.

## Tests (write first)
- All four mock states occupy equal dimensions at each assigned responsive width.
- An all-zero contribution dataset shows a valid quiet period, with a usable profile link.
- Fresh and stale live payloads update the remaining summary and heatmap without stale selectors.
- Initial endpoint failure shows error; a failed later refresh retains data and eventually marks it stale.
- The heatmap has a text equivalent, and no streak/repository counters remain in the tile.


## Steps
- Record current state rendering and add the zero-activity fixture to the existing gallery before changing the tile.
- Simplify markup to period-qualified contributions, the existing heatmap and profile navigation.
- Update the live callback and accessible summary to match the new markup; keep the endpoint shape.
- Adjust token-based spacing for the planned compact area and compare gallery states and intercepted responses.

## Acceptance
- [ ] all listed tests pass
- [ ] `npm run build` → exit 0
- [ ] The tile reads as supporting activity context and preserves its external profile link.
- [ ] No API, cache, terminal payload or shared watchLive behavior changes.

## Result
<!-- filled by do: 3–5 lines (audit: ≤ 10, findings + proposed follow-ups)
     last line always: "Deviations: none" or "Deviations: path — why" -->
