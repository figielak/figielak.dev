---
id: 01-07
title: Align references and verify the complete Dev Log
type: code
status: done        # draft | approved | in-progress | done | blocked | reverted
critical: false
effort: normal      # normal | hard
depends: ["01-06"]
decisions: []       # phase-local, e.g. [D-03]
scope: ["src/i18n/pl.json","src/i18n/en.json","src/components/tiles/GoalEditTile.astro","src/content/projects/figielak-dev.mdx","src/content/projects/homelab.mdx","README.md"]
---
## Goal
Align navigation, metadata, the home CTA and project descriptions with the shipped Dev Log. Verify the complete built experience and preserved private access behavior.

## Read first
- src/i18n/pl.json:1-47 (navigation, public metadata and home CTA)
- src/i18n/en.json:1-47 (English equivalents)
- src/i18n/pl.json:197-200 (private/public labels)
- src/i18n/pl.json:260-266 (goal editor hint)
- src/i18n/en.json:200-206 (English goal editor hint)
- src/components/tiles/GoalEditTile.astro:7-15 (old public publishing claim)
- src/components/tiles/DashboardTeaserTile.astro:34-82 (unchanged teaser data and CTA)
- src/content/projects/figielak-dev.mdx:1-38 (old public dashboard descriptions)
- src/content/projects/homelab.mdx:1-31 (old demo link and telemetry claims)
- README.md:10-76 (presentation, screenshots, features and view table)
- src/pages/dashboard/private.astro:7-25 (private rendering and headers)
- src/lib/owner.ts:27-47 (denial behavior without configured password)

## Files
- src/i18n/pl.json (modify)
- src/i18n/en.json (modify)
- src/components/tiles/GoalEditTile.astro (modify)
- src/content/projects/figielak-dev.mdx (modify)
- src/content/projects/homelab.mdx (modify)
- README.md (modify)

## Constraints
- Keep Dev Log as the public navigation name and dashboard as the private operations panel.
- Do not alter the home teaser’s clock/weather/music, contact data, CV or recruiter-facing sections.
- Update the goal editor comment/hint: it edits stored goal data, not the static current-work card.
- Do not copy private metrics into project prose, publish secrets, change endpoint access or write live data.
- Keep API-backed terminal commands and cd dashboard compatible by preserving existing paths.
- Preserve existing assets; label previous-layout screenshots as historical or omit their presentation.
- No replacement production screenshots until a deployment exists; no deployment, commit or push here.
- Use build/preview for visual acceptance; /dev/tiles exists only in dev, so intercept APIs on built pages.
- Use ephemeral local auth and mocked responses for private verification; never require production secrets.

## Tests (write first)
- Nav, page title/description, home CTA and public-return link consistently identify Dev Log in PL/EN.
- PL/EN switching preserves /dashboard; localized project/repository links work and focus remains visible.
- Homelab no longer advertises /dashboard as a live telemetry demo; historical images are identified.
- Private built routes deny missing/wrong credentials with 401 under a temporary configured password.
- Without a configured password private routes return 503; authorized render retains noindex/private,no-store.
- The private panel, home teaser and terminal navigation still work with intercepted data in both languages.


## Steps
- Align localized public labels and metadata while retaining private titles and correcting the editor hint.
- Revise both project entries and README to describe current public/private roles and accurate demo links.
- Run the final build and serve it locally; verify both languages, all four required viewports, API states, keyboard access, reduced motion and AA contrast.
- Smoke-check private routes with synthetic auth and mocked data, plus home teaser and terminal navigation; record checks and any unavailable evidence in Result.

## Acceptance
- [x] all listed tests pass
- [x] `npm run build` → exit 0
- [x] Built PL/EN screenshots at 1280×720, 1440×900, 800 px and 390 px demonstrate the agreed layout.
- [x] No public page prose claims removed widgets exist; project, home and private links remain coherent.
- [x] Diff contains no credentials, private data, dependency changes or unrelated edits.

## Result
<!-- filled by do: 3–5 lines (audit: ≤ 10, findings + proposed follow-ups)
     last line always: "Deviations: none" or "Deviations: path — why" -->
Aligned home/teaser labels, the goal editor hint/comment, project prose/features and README with Dev Log. Removed the Homelab telemetry demo and moved outdated project covers into explicitly historical galleries; preserved all image files and labelled README production captures historical.
RED: Seven native checks caught old labels, the publishing hint, telemetry demo and unlabelled screenshots. GREEN: 7 native checks and 21 browser checks passed: 2 bilingual navigation/project/home flows, 11 private-access cases and 8 four-state viewport/screenshot cases. Existing 01-06 layout/motion proof remains valid; 17 source hashes and the goal implementation are unchanged.
Inspected eight mocked local-build screenshots in PL/EN at 1280×720, 1440×900, 800 and 390 px; sampled text contrast is at least 4.94:1. Verified language switching, visible focus, cd dashboard, retained home sources, stored-goal loading/language controls, 401 for missing/wrong auth, 503 without configuration and authorized noindex/private,no-store. No writes or production credentials were used; captures are in /tmp/devlog-01-07-screenshots, not production assets. Security review and dependency/API/asset/CV checks passed; build exit 0, production gallery excluded and telos accept 01-07 PASS.
Deviations: src/components/tiles/CurrentWorkTile.astro, src/components/tiles/ExperimentTile.astro, src/components/tiles/GithubTile.astro, src/components/tiles/WakaTile.astro, src/components/tiles/MusicTile.astro, src/components/views/Dashboard.astro, src/pages/dashboard.astro, src/pages/en/dashboard.astro, src/lib/dev-log.ts, src/lib/mocks/github.ts, src/lib/mocks/waka.ts, src/lib/mocks/music.ts, src/lib/waka.ts, src/pages/dev/[gallery].astro — pre-existing uncommitted 01-02 through 01-06 work preserved without 01-07 edits; temporary verification artifacts stay outside the work tree.
