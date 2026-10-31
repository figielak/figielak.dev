---
id: 01-01
title: Document the public Dev Log design contract
type: doc
status: approved    # draft | approved | in-progress | done | blocked | reverted
critical: false
effort: normal      # normal | hard
depends: []
decisions: []       # phase-local, e.g. [D-03]
scope: ["docs/koncept.md","docs/design.md"]
---
## Goal
Define the focused public Dev Log from the supplied redesign brief before changing its implementation. Keep the existing visual identity and separate the public editorial page from the private operations panel.

## Read first
- docs/koncept.md §1. Wizja w skrócie
- docs/koncept.md §2. Widoki i adresy
- docs/koncept.md §3.4 Dashboard (`/dashboard`)
- docs/design.md §4. Siatka i responsywność
- docs/security.md
- src/components/views/Dashboard.astro:16-108 (current public grid and sources)
- src/components/views/DashboardPrivate.astro:13-79 (existing operations panel)

## Files
- docs/koncept.md (modify)
- docs/design.md (modify)

## Constraints
- The user-supplied redesign brief authorizes planning the replacement of the old public dashboard.
- Assumed: keep /dashboard and /en/dashboard; use Dev Log in both navigation dictionaries.
- Assumed: five tiles; current work starts with figielak.dev, experiments with the existing homelab.
- Keep tokens, dark surfaces, the current red accent, mono labels, restrained glow and existing Tile.
- Keep the private panel, ownerGate, APIs, terminal commands and home teaser functionality.
- No dependencies, CMS, route migration, new case study, endpoint removal or auth redesign.
- Removing telemetry from this page does not make existing public endpoints private.



## Steps
- Replace the public purpose, navigation label and public koncept.md §3.4 with / DEV LOG, Poza CV. / Beyond the CV., and the localized subtitle from the brief.
- Specify current work, GitHub, WakaTime, experiments and after-hours music; remove the other widgets from this public composition only.
- Define a dominant current-work tile and responsive areas: desktop build×4 + GitHub×2, then Waka×2 + experiment×2 + music×2; tablet build×4, GitHub×2 + Waka×2, experiment×2 + music×2; mobile build×2, GitHub×2, Waka×2, experiment + music.
- Update design.md §4 for content-led public height, token-based breathing room and scrolling when needed; preserve private sizing and mobile two-column bento.
- Align related statements in koncept.md §1–3.2, §4 and §5 and design.md §5; describe retained integrations accurately and record old dashboard widgets as historical where needed.

## Acceptance
- [ ] `npm run build` → exit 0
- [ ] The design contract names exactly five public tiles, routes, copy, priority order and layouts.
- [ ] The public page need not fill the viewport; its private counterpart keeps the existing contract.
- [ ] Retained public APIs and removed public UI are distinguished without claiming new access protection.

## Result
<!-- filled by do: 3–5 lines (audit: ≤ 10, findings + proposed follow-ups)
     last line always: "Deviations: none" or "Deviations: path — why" -->
