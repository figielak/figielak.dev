---
id: 01-06
title: Compose the five-card public Dev Log
type: code
status: done        # draft | approved | in-progress | done | blocked | reverted
critical: false
effort: normal      # normal | hard
depends: ["01-02","01-03","01-04","01-05"]
decisions: []       # phase-local, e.g. [D-03]
scope: ["src/components/views/Dashboard.astro","src/pages/dashboard.astro","src/pages/en/dashboard.astro","src/i18n/pl.json","src/i18n/en.json","src/styles/tokens.css"]
---
## Goal
Compose the five finished tiles into the public Dev Log with a clear introduction and dominant current-work card. Keep a consistent priority order across desktop, tablet and two-column mobile.

## Read first
- docs/koncept.md §3.4 Dashboard (`/dashboard`)
- docs/design.md §4. Siatka i responsywność
- src/components/views/Dashboard.astro:1-111 (public composition to replace)
- src/components/ui/BentoLayout.astro:12-89 (layout options and existing motion hooks)
- src/components/ui/BentoLayout.astro:91-162 (responsive sizing and fill behavior)
- src/pages/dashboard.astro:1-11 (PL route)
- src/pages/en/dashboard.astro:1-11 (EN route)
- src/styles/tokens.css:120-150 (spacing scale and page frame)

## Files
- src/components/views/Dashboard.astro (modify)
- src/pages/dashboard.astro (modify)
- src/pages/en/dashboard.astro (modify)
- src/i18n/pl.json (modify)
- src/i18n/en.json (modify)
- src/styles/tokens.css (modify)

## Constraints
- Keep routes, internal component names and existing BentoLayout API; no redirects or shared grid refactor.
- Reuse Tile, BentoLayout alive, existing glow/intro/spotlight and DashboardSwitch.
- Add / DEV LOG, one h1 Poza CV. / Beyond the CV., and the brief’s localized introductory sentence.
- Exactly five tiles: current work, GitHub, WakaTime, experiments, after hours, in that DOM/reading order.
- Use the explicit 6/4/2-column areas from 01-01; small mobile experiment/music tiles sit side by side.
- Do not use fill/tall/dense to force viewport filling; allow scroll and use existing spacing tokens.
- Remove public day/weather/goal/featured/social/books/event/homelab widgets by composition only.
- No private-panel, API, server, endpoint privacy or unused-component deletion work.
- Add tokens only if existing values cannot serve fixed live-tile sizing; preserve existing token values.

## Tests (write first)
- PL and EN render one h1 and exactly five tiles with current work visually dominant.
- At 1280×720, 1440×900, 800 px and 390 px, no overlap or horizontal page overflow occurs.
- Mobile computes two grid columns with experiment/music side by side; tab order follows priority.
- Public page requests only GitHub, WakaTime and music data, with no removed widget subscriptions.
- Intercepted delayed, fresh, stale and failed API responses leave tile dimensions unchanged.
- Reduced motion remains effective; the terminal shortcut and private-view link remain reachable.


## Steps
- Replace the old public imports, markup and area arrays with the five components in priority order.
- Add a localized page introduction and use the existing non-fill BentoLayout with explicit breakpoint areas.
- Set responsive stable footprints for live tiles using tokens without modifying private grid behavior.
- Wire existing endpoints and metadata keys, preserving the PL/EN route wrappers and public/private switch.
- Inspect built pages with intercepted fixtures at all required viewports and adjust only scoped styles.

## Acceptance
- [x] all listed tests pass
- [x] `npm run build` → exit 0
- [x] The page preserves the site identity, visible hierarchy, whitespace and a two-column mobile bento.
- [x] Only the five intended public cards are mounted; the private view still uses its existing component.

## Result
<!-- filled by do: 3–5 lines (audit: ≤ 10, findings + proposed follow-ups)
     last line always: "Deviations: none" or "Deviations: path — why" -->
Composed five existing tiles in priority order with the localized introduction, Dev Log navigation/metadata and explicit 6/4/2-column areas. Removed only old public widgets, constrained the page with the existing content cap and applied token-based public spacing without fill/tall/dense grid options or new tokens.
RED: Built PL/EN pages had no h1 introduction and eleven API subscriptions. GREEN: 38 browser checks passed: 20 composition/subscription/keyboard checks, 10 four-state geometry checks, four private-panel size comparisons, one normal-motion check and three unauthenticated private-route checks.
Verified PL/EN at 1280×720, 1440×900, 800, 390 and 320 px; exactly three live sources, fixed delayed/fresh/stale/error geometry, dominant current work, mobile experiment/music side by side, reduced motion and terminal access. Private sizes match the baseline exactly; 14 prior/shared/private files retain their hashes. Build exit 0; production gallery excluded; telos accept 01-06 PASS.
Deviations: src/components/tiles/CurrentWorkTile.astro, src/components/tiles/ExperimentTile.astro, src/components/tiles/GithubTile.astro, src/components/tiles/WakaTile.astro, src/components/tiles/MusicTile.astro, src/lib/dev-log.ts, src/lib/mocks/github.ts, src/lib/mocks/waka.ts, src/lib/mocks/music.ts, src/lib/waka.ts, src/pages/dev/[gallery].astro — pre-existing uncommitted 01-02 through 01-05 work preserved without 01-06 edits; temporary browser assertions and screenshots stay outside the work tree.
