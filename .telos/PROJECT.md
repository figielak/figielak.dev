# figielak.dev
<!-- Constitution, ≤ 60 lines. Project-specific facts only; Telos workflow rules
     live in CLAUDE.md. Headings are stable (tasks link to "PROJECT.md §Heading"). -->

## Purpose
Osobista strona w stylu bento z widokami dla rekruterów, uczniów i mnie.
Wizytówka, projekty, korepetycje i dashboard z danymi na żywo; PL/EN.

## Rules
- Repo jest publiczne: bez danych osobowych, hostów, IP i sekretów (wyjątek: CV w `cv/`).
- Kolory, promienie i odstępy tylko z tokenów w `src/styles/tokens.css`.
- Kafle z danymi na żywo: najpierw mock, 4 stany, stały rozmiar.
- Mobile w widokach bento: 2 kolumny; wyjątek to dossier (wizytówka, korepetycje).
- Teksty UI przez i18n; prefers-reduced-motion i kontrast AA.
- Prywatne trasy i `/api/private/*`: `ownerGate` i `prerender = false`.
- Nowa zależność lub zmiana sprzeczna z `docs/koncept.md` — najpierw pytanie.
- Commit, push i force push tylko na wyraźną prośbę.

## Conventions
- Kod i nazwy po angielsku; styl: taby, apostrofy, średniki, linie do ok. 100–120 znaków.
- Bez `prettier --write` (brak konfiguracji).
- Każdy kafel to osobny komponent w `src/components/tiles/` na `<Tile>`.
- Nowa komenda terminala to nowy plik w `src/scripts/terminal/commands/`.
- Wartości z builda: `import.meta.env`; sekrety serwera: `process.env`.
- Po zmianie CV: `npm run cv`; wygląd sprawdzaj na buildzie, nie w dev.

## Out of scope
- Statystyki PC (zdradzałyby obecność) i publiczne wystawianie homelabu.
- Efekt tilt kafli, karty „W przygotowaniu” w projektach.
- Odrzucone: mapa podróży, losowy fun fact, liczniki kaw i kliknięć.
