<!-- telos-map: commit 7678742812a8ed4f611bc8965305f159ad208ccf · 2026-10-31 · files 250 -->
# Map

## Structure
- `src/pages/` — routes: PL bez prefiksu, EN w `src/pages/en/`; `src/pages/api/` to serwer Node (`prerender = false`)
- `src/components/views/` — treść widoków wspólna dla PL i EN
- `src/components/tiles/` — jeden kafel na komponent, `homelab/` to sekcje kafla Homelab
- `src/components/ui/` — `Tile`, `Nav`, `Dossier`, `Terminal`, `BentoLayout` i reszta UI
- `src/lib/` — dane statyczne, `mocks/`, `server/` (klienci API, cache, Firestore)
- `src/scripts/` — skrypty przeglądarki: `live.ts`, `intro.ts`, `spotlight.ts`, `terminal/`
- `src/content/projects/` — projekty w MDX, schemat w `src/content.config.ts`
- `src/i18n/` — `pl.json`, `en.json`; `src/styles/` — `tokens.css`, `global.css`
- `cv/` → `public/cv/` (Typst); `brand/` — logo; `docs/` — `koncept.md`, `design.md`, `architecture.md`, `security.md`, `decisions.md`, `deploy.md`
- `.github/workflows/deploy.yml` — deploy na Cloud Run

## Entry points
- `src/pages/index.astro:1-11` — wizytówka (EN: `src/pages/en/index.astro`)
- `src/pages/dashboard.astro:1-11` — dashboard publiczny
- `src/pages/dashboard/private.astro:1-26` — dashboard prywatny, `ownerGate`
- `src/pages/projects/index.astro` i `src/pages/projects/[slug].astro:1-17` — lista i szczegóły
- `src/pages/maths.astro` — korepetycje (za przełącznikiem `src/lib/tutoring.ts`)
- `src/pages/dev/[gallery].astro:1-80` — galeria stanów kafli (tylko dev)
- `astro.config.mjs:1-30` — integracje i adapter Node

## Flows
- Kafel na żywo: `src/scripts/live.ts` → `src/pages/api/<źródło>.ts` → `src/lib/server/cache.ts` → klient w `src/lib/server/`
- Pogoda: `src/pages/api/weather.ts:1-19` → `src/lib/server/weather.ts`
- Homelab push: agent → `src/pages/api/stats.ts:1-72` → `src/lib/server/homelab.ts` → `src/lib/server/firestore.ts`
- Homelab odczyt: `src/pages/api/homelab/[section].ts` → `src/lib/server/firestore.ts`
- Tryb prywatny: `src/pages/dashboard/private.astro` i `src/pages/api/private/` → `ownerGate` z `src/lib/owner.ts:1-48`
- Projekty: `src/content/projects/` → `src/lib/projects.ts:1-87` → widoki i karuzela
- Terminal: `src/components/ui/Terminal.astro` → `src/scripts/terminal/core.ts` → `src/scripts/terminal/commands/`

## Areas
### Layout i UI
- `src/layouts/BaseLayout.astro`, `src/components/ui/Tile.astro`, `src/components/ui/BentoLayout.astro`
- Tokeny: `src/styles/tokens.css`

### Dashboard
- Widoki: `src/components/views/Dashboard.astro:1-111`, `src/components/views/DashboardPrivate.astro:1-82`
- Kafle: `src/components/tiles/`, dane testowe: `src/lib/mocks/`

### Homelab
- Kontrakt push: `src/lib/server/homelab.ts`; zapis: `src/lib/server/firestore.ts:1-111`
- Historia CPU/RAM: `src/lib/server/history.ts`; usługi: `src/lib/services.ts`

### Projekty
- `src/content.config.ts:1-46`, `src/lib/projects.ts`
- Widoki: `src/components/views/Projects.astro`, `src/components/views/ProjectDetail.astro`
- KaTeX: `src/plugins/katex.js`

### Wizytówka i korepetycje
- `src/components/views/Home.astro`, `src/components/views/Maths.astro`
- Dossier: `src/components/ui/Dossier.astro`, `src/components/ui/ProfileCard.astro`

### Terminal
- `src/scripts/terminal/core.ts:1-428`, komendy: `src/scripts/terminal/commands/`

### i18n
- `src/i18n/index.ts:1-59`, teksty: `src/i18n/pl.json`, `src/i18n/en.json`

## Find
- Tokeny kolorów i odstępów → `src/styles/tokens.css`
- Nowy kafel → `src/components/tiles/`; nowy endpoint → `src/pages/api/`
- Nowa komenda terminala → `src/scripts/terminal/commands/`
- Nowy projekt → `src/content/projects/`
- Sekrety i zmienne środowiskowe → `.env.example`
- Konfiguracja deployu → `docs/deploy.md`, `.github/workflows/deploy.yml`
- Wizja i widoki → `docs/koncept.md`; styl → `docs/design.md`; dane i stack → `docs/architecture.md`; prywatność → `docs/security.md`; decyzje → `docs/decisions.md`
