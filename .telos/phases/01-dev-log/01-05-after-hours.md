---
id: 01-05
title: Reduce Last.fm to a compact after-hours tile
type: code
status: done        # draft | approved | in-progress | done | blocked | reverted
critical: false
effort: normal      # normal | hard
depends: ["01-01"]
decisions: []       # phase-local, e.g. [D-03]
scope: ["src/components/tiles/MusicTile.astro","src/lib/mocks/music.ts","src/i18n/pl.json","src/i18n/en.json","src/pages/dev/[gallery].astro"]
---
## Goal
Turn the public Last.fm tile into a small after-hours accent showing only the current or last track. Keep optional playback usable without dominating the page.

## Read first
- src/components/tiles/MusicTile.astro:22-99 (track and top-artist markup)
- src/components/tiles/MusicTile.astro:101-168 (preview and live updates)
- src/components/tiles/MusicTile.astro:171-243 (cover, scrim and motion)
- src/lib/mocks/music.ts:19-61 (track shape and four-state mocks)
- src/components/tiles/DashboardTeaserTile.astro:65-79 (independent home music section)
- src/pages/dev/[gallery].astro:76-79 (music examples)

## Files
- src/components/tiles/MusicTile.astro (modify)
- src/lib/mocks/music.ts (modify)
- src/i18n/pl.json (modify)
- src/i18n/en.json (modify)
- src/pages/dev/[gallery].astro (modify)

## Constraints
- Keep Music props, /api/music payload, existing polling and server preview lookup unchanged.
- Use a compact cover/track composition; remove top artists from this tile, retaining API fields.
- Keep optional preview on explicit click only, no autoplay or new audio controls.
- Follow PROJECT.md §Rules: mock first, four states, fixed footprint, tokens, PL/EN and AA.
- The home teaser and terminal music/artist commands keep their own existing behavior.
- Freshness and now-playing are distinct: stale data must not claim that a track is currently live.

## Tests (write first)
- Four states and missing-cover data share the compact tile’s footprint without losing title/artist.
- Current and last-played tracks have correct PL/EN labels; stale tracks never show a live pulse.
- Without a preview URL there is no play button; available previews load only after a click.
- Play, pause, ended, playback rejection and a track refresh during playback keep controls consistent.
- Long titles/artists fit the narrow mobile tile and the play button remains keyboard accessible.
- Top-artist UI is absent; existing home teaser and terminal consumers still receive their fields.


## Steps
- Extend mock/gallery cases for missing cover, long track names and current/last/stale playback.
- Replace the tall artwork-led panel with the compact after-hours tile and localized label.
- Remove top-artist rendering and its live selectors; retain existing preview lifecycle and track updates.
- Check reduced motion, contrast, keyboard controls and intercepted live updates without real API credentials.

## Acceptance
- [x] all listed tests pass
- [x] `npm run build` → exit 0
- [x] After-hours music is visibly smaller than current work and contains no top-artist ranking.
- [x] Preview interaction and missing-artwork fallback remain functional without API or audio-engine changes.

## Result
<!-- filled by do: 3–5 lines (audit: ≤ 10, findings + proposed follow-ups)
     last line always: "Deviations: none" or "Deviations: path — why" -->
Replaced the artwork-led ranking panel with a compact After hours track, decorative 72/48px thumbnail, missing-cover icon and optional 44px preview control; retained full title/artist text with visual clamping and localized PL/EN labels.
RED: Built-gallery checks found full-card artwork, rankings, no fallback and varying narrow heights; intercepted stale data retained its pulse. GREEN: 33 browser checks passed, including PL/EN at 1280×720, 1440×900, 800, 390 and 320 px, four current-dashboard layouts and home/terminal compatibility.
All gallery cases share a footprint at each width (about 183px desktop, 245px at 390 and 259px at 320). Deterministic Audio stubs verified explicit playback, pause, ended/rejection and track changes during playback; existing audio handlers/polling are unchanged. A tile-local freshness observer removes stale live claims, including after failed polls; text contrast is 5.34:1 and reduced motion works. Build exit 0; production gallery excluded; telos accept 01-05 PASS.
Deviations: src/components/tiles/CurrentWorkTile.astro, src/components/tiles/ExperimentTile.astro, src/components/tiles/GithubTile.astro, src/components/tiles/WakaTile.astro, src/lib/dev-log.ts, src/lib/mocks/github.ts, src/lib/mocks/waka.ts, src/lib/waka.ts — pre-existing uncommitted 01-02/01-03/01-04 work preserved with matching hashes; temporary browser tests and screenshots stay outside the work tree.
