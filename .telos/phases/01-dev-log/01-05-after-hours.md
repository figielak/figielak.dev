---
id: 01-05
title: Reduce Last.fm to a compact after-hours tile
type: code
status: approved    # draft | approved | in-progress | done | blocked | reverted
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
- [ ] all listed tests pass
- [ ] `npm run build` → exit 0
- [ ] After-hours music is visibly smaller than current work and contains no top-artist ranking.
- [ ] Preview interaction and missing-artwork fallback remain functional without API or audio-engine changes.

## Result
<!-- filled by do: 3–5 lines (audit: ≤ 10, findings + proposed follow-ups)
     last line always: "Deviations: none" or "Deviations: path — why" -->
