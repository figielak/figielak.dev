---
id: 01-02
title: Add current-work and experiment tiles
type: code
status: approved    # draft | approved | in-progress | done | blocked | reverted
critical: false
effort: normal      # normal | hard
depends: ["01-01"]
decisions: []       # phase-local, e.g. [D-03]
scope: ["src/lib/dev-log.ts","src/components/tiles/CurrentWorkTile.astro","src/components/tiles/ExperimentTile.astro","src/i18n/pl.json","src/i18n/en.json","src/pages/dev/[gallery].astro"]
---
## Goal
Add a manually maintained current-work tile and a small learning-oriented experiment tile. Their copy must complement the project pages instead of repeating project summaries.

## Read first
- src/components/ui/Tile.astro:11-99 (tile props, body and footer)
- src/components/ui/Pill.astro:1-25 (existing technology tags)
- src/i18n/index.ts:12-47 (translation keys and localized paths)
- src/lib/projects.ts:28-36 (project routes)
- src/content/projects/figielak-dev.mdx:1-38 (verified existing project facts)
- src/content/projects/homelab.mdx:1-31 (verified experiment facts)
- src/pages/dev/[gallery].astro:122-137 (static tile examples)

## Files
- src/lib/dev-log.ts (create)
- src/components/tiles/CurrentWorkTile.astro (create)
- src/components/tiles/ExperimentTile.astro (create)
- src/i18n/pl.json (modify)
- src/i18n/en.json (modify)
- src/pages/dev/[gallery].astro (modify)

## Constraints
- Follow PROJECT.md §Rules and §Conventions: separate Tile components, tokens, i18n, AA.
- Assumed seed subjects: ongoing figielak.dev and homelab; use only existing documented facts.
- Store identity, tags and optional links in a small typed static module; keep prose in PL/EN i18n.
- Current work: project name, 2–3 short sentences on work and purpose, tags, optional link.
- Experiment: learning/technical purpose and a localized project link; no live infrastructure metrics.
- No automatic featured-project selection, copied carousel, new content schema, CMS or API.
- Do not invent milestones, results, learning outcomes or dates; keep initial copy factual.
- No hosts, infrastructure addresses, personal contacts or secrets in data or examples.

## Tests (write first)
- Both tiles render in PL and EN without JavaScript and use distinct editorial copy.
- Internal links follow PL/EN; external repo links have appropriate external-link attributes.
- A missing optional link yields readable content without an empty or broken anchor.
- At phone widths, tags and long titles wrap inside their assigned tile without overflow.


## Steps
- Add the typed editorial configuration and matching localized prose using existing source facts.
- Implement CurrentWorkTile with Tile and Pill; make it the stronger editorial component without a project-cover carousel.
- Implement ExperimentTile on Tile with a concise technical explanation and localized detail link.
- Add static gallery examples, including absent optional link and long-title cases; inspect at narrow widths.

## Acceptance
- [ ] all listed tests pass
- [ ] `npm run build` → exit 0
- [ ] Each new tile is a separate component on Tile; all UI prose has both language keys.
- [ ] One small configuration and its named i18n keys are sufficient for the next manual content update.

## Result
<!-- filled by do: 3–5 lines (audit: ≤ 10, findings + proposed follow-ups)
     last line always: "Deviations: none" or "Deviations: path — why" -->
