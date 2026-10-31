# figielak.dev

Wizja, widoki, styl i zasady projektu: @docs/koncept.md

## Stack

Astro + MDX, Tailwind v4, Fontsource, Sätteri + KaTeX,
rehype-mermaid, Typst (CV). Hosting: Google Cloud Run za Cloudflare
(deploy: docs/deploy.md).

## Zasady

- Kolory, promienie i odstępy interfejsu tylko z tokenów (src/styles/tokens.css). Nigdy hex/rgb w stylach komponentów.
- Kolorowa treść (prawdziwe loga, okładki, zdjęcia, grafiki) jest dozwolona, nie wymagana — kolor niesie sam asset (docs/koncept.md §4).
- Każdy kafel to osobny komponent w src/components/tiles/, zbudowany na `<Tile>`.
- Kafle z danymi na żywo: najpierw mock, zawsze 4 stany (ładowanie, OK, nieaktualne, błąd), stały rozmiar.
- **Repo jest publiczne.** Żadnych danych osobowych (poza e-mailem i telefonem w źródłach CV w `cv/` — decyzja właściciela), nazw hostów/domen homelabu, IP ani sekretów w kodzie, dokumentacji, commitach i ich wiadomościach. Wartości do builda idą przez `.env` / GitHub Secrets (`.env.example`), sekrety serwera przez Secret Manager. Przed każdym commitem sprawdź diff (docs/koncept.md §14).
- Mobile: w widokach bento siatka 2 kolumny, nigdy jedna kolumna. Wizytówka i korepetycje są wyjątkiem (układ dossier, patrz docs/koncept.md 3.1 i 3.3).
- Kod i nazwy po angielsku, teksty UI przez i18n (PL/EN).
- Szanuj prefers-reduced-motion i kontrast AA.
- Zapytaj, zanim dodasz nową zależność albo zmienisz coś, co jest sprzeczne z docs/koncept.md.

## Praca w repo

- CV: źródła Typst w `cv/`, PDF-y w `public/cv/` (commitowane) — po zmianie `npm run cv` (wymaga `typst`).
- Logo: `brand/` (SVG, PNG, zasady użycia w `brand/README.md`); favicony i ikony w `public/` to kopie z `brand/web/`. README (po angielsku) bierze logo z `brand/svg/`, a reszta jego grafik jest w `.github/assets/` — social preview z Typsta (polecenie w nagłówku `.typ`), zrzuty z produkcji w WebP. `logo-dark.svg` zostaje jako źródło obrysów dla `brand/build.py`. Na zrzutach nie może być danych osobowych (e-mail rozmyty).
- Podgląd: `npm run dev -- --host` (też w LAN). Galeria stanów kafli: `/dev/tiles` (tylko w dev).
- Weryfikacja zmian: `npm run build` (typy nie są sprawdzane — `@astrojs/check` nie jest zainstalowany). Wygląd sprawdzaj na buildzie (`npm run preview` lub `node dist/server/entry.mjs`), bo dev potrafi serwować nieaktualne style; widoki bento w 1280×720, 1440×900, 800 px i 390 px.
- Formatowanie: projekt nie ma konfiguracji Prettiera — nie uruchamiaj `prettier --write` (domyślny styl przepisze pliki). Styl: taby, apostrofy, średniki, linie do ok. 100–120 znaków.
- Tryb prywatny i endpointy z danymi prywatnymi chroni `ownerGate` z `src/lib/owner.ts`; takie trasy mają `prerender = false`.
- Wartości czytane przy buildzie: `import.meta.env`; sekrety serwera czytane przy starcie: `process.env` (inaczej trafią do builda).
- Deploy: push na `master` uruchamia `.github/workflows/deploy.yml`. Nie pushuj ani nie rób force pusha bez wyraźnej prośby. Commit tylko na prośbę.
- Konfiguracja i typowe błędy wdrożenia: `docs/deploy.md`.

<!-- telos:start v1 -->
## Telos
Project memory in `.telos/` — read only what the step needs:
PROJECT.md (rules) · MAP.md (where things are) · STATUS.md (now/next) · ROADMAP.md (phases)
· HISTORY.md (why; if present).
- Locate code via MAP.md; never read the whole repo.
- Never recreate paths or approaches listed in HISTORY.md §Delete-zone.
- Outside `/telos:*` commands, work normally but don't edit `.telos/` unless asked.
- `.telos/` files are written in English; reply in the user's language.
- Commits: Conventional Commits, scope = task id (`feat(01-02): …`), else `quick`; stage
  specific files only, never `--no-verify`, never push.
<!-- telos:end -->
