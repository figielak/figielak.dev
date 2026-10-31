---
id: 01-04
title: Simplify WakaTime and handle empty weeks
type: code
status: done        # draft | approved | in-progress | done | blocked | reverted
critical: false
effort: normal      # normal | hard
depends: ["01-01"]
decisions: []       # phase-local, e.g. [D-03]
scope: ["src/components/tiles/WakaTile.astro","src/lib/waka.ts","src/lib/mocks/waka.ts","src/i18n/pl.json","src/i18n/en.json","src/pages/dev/[gallery].astro"]
---
## Goal
Reduce WakaTime to this week’s total and a short language distribution. Show honest empty data instead of a misleading 100% other-language segment.

## Read first
- src/components/tiles/WakaTile.astro:23-178 (SSR and browser rendering)
- src/lib/waka.ts:24-47 (language colours and segment remainder)
- src/lib/mocks/waka.ts:6-45 (data shape and state fixtures)
- src/lib/server/wakatime.ts:22-69 (Monday-based week and code-only language shares)
- src/scripts/live.ts:26-89 (live lifecycle)
- src/pages/dev/[gallery].astro:73-75 (WakaTime state gallery)

## Files
- src/components/tiles/WakaTile.astro (modify)
- src/lib/waka.ts (modify)
- src/lib/mocks/waka.ts (modify)
- src/i18n/pl.json (modify)
- src/i18n/en.json (modify)
- src/pages/dev/[gallery].astro (modify)

## Constraints
- Keep /api/waka, Waka props, freshness and server filtering; week starts Monday in Europe/Warsaw.
- Show total week time and up to three named languages; drop daily bars and today’s footer detail.
- Retain weekBars and payload fields needed by existing terminal clients; avoid unrelated cleanup.
- Empty is valid ok/stale data, not a fifth LiveState or an integration error.
- Total time can be positive with no code languages after server filtering; explain missing language data.
- Follow PROJECT.md §Rules: mock first, four lifecycle states, fixed footprint, tokens and PL/EN.
- Do not add a test framework; use temporary native Node assertions for the changed pure helper.

## Tests (write first)
- languageSegments([], label) and all-zero language shares return no segments rather than Other 100%.
- A nonempty partial distribution retains its correct remainder and token colour fallback.
- Zero week time with no languages renders localized no-activity copy and no fabricated distribution.
- Positive week time with no languages preserves the total and explains unavailable language data.
- Loading, ok, stale and error share dimensions; stale empty data keeps its freshness warning.
- Live refresh nonempty → empty → nonempty matches initial rendering without leftover bars or names.
- Existing weekBars behavior and terminal WakaTime output remain available.


## Steps
- Add empty and filtered-language fixtures; write temporary assertions for the helper cases before fixing them.
- Make languageSegments return an empty distribution when no positive shares exist; retain valid remainder handling.
- Simplify WakaTile markup and localized copy to total, language bar/legend or empty explanation, and freshness.
- Mirror the same empty/nonempty logic in its live callback; remove only selectors for the deleted daily presentation.
- Exercise all gallery cases and browser-intercepted transitions at the planned tile widths.

## Acceptance
- [x] all listed tests pass
- [x] `npm run build` → exit 0
- [x] No successful empty dataset displays Other 100%, a fake language, NaN or a broken chart.
- [x] The visible period and language percentages still match the existing backend semantics.

## Result
<!-- filled by do: 3–5 lines (audit: ≤ 10, findings + proposed follow-ups)
     last line always: "Deviations: none" or "Deviations: path — why" -->
Simplified Coding to the Monday-based weekly total, up to three named code languages with a correct remainder, and localized quiet-week/absent-language explanations. Removed only the tile's daily bars and today's footer detail; retained payload fields, weekBars and terminal output.
RED: Native assertions reproduced fabricated Other 100% for empty/all-zero shares; built-gallery checks found daily bars and missing explanations/period. GREEN: 9 native checks and 28 browser checks passed, including PL/EN at 1280×720, 1440×900, 800, 390 and 320 px.
Verified equal 252px gallery footprints, stale empty data, initial failure, SSR/live normal→empty→filtered→stale-empty→normal parity using QA-only optional polling, four current-dashboard layouts and terminal output. Warsaw week boundaries/filtering are unchanged; error/footer contrast is 5.34:1 and reduced motion is respected. Build exit 0; production gallery excluded; telos accept 01-04 PASS.
Deviations: src/components/tiles/CurrentWorkTile.astro, src/components/tiles/ExperimentTile.astro, src/components/tiles/GithubTile.astro, src/lib/dev-log.ts, src/lib/mocks/github.ts — pre-existing uncommitted 01-02/01-03 work preserved, with hashes confirming no 01-04 edits; temporary assertions, polling harness and screenshots stay outside the work tree.
