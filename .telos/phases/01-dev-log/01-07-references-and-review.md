---
id: 01-07
title: Align references and verify the complete Dev Log
type: code
status: approved    # draft | approved | in-progress | done | blocked | reverted
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
- [ ] all listed tests pass
- [ ] `npm run build` → exit 0
- [ ] Built PL/EN screenshots at 1280×720, 1440×900, 800 px and 390 px demonstrate the agreed layout.
- [ ] No public page prose claims removed widgets exist; project, home and private links remain coherent.
- [ ] Diff contains no credentials, private data, dependency changes or unrelated edits.

## Result
<!-- filled by do: 3–5 lines (audit: ≤ 10, findings + proposed follow-ups)
     last line always: "Deviations: none" or "Deviations: path — why" -->
