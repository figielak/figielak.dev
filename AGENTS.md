# figielak.dev

Wizja, widoki, styl i zasady projektu: @koncept.md

## Stack

Astro + MDX, Tailwind v4, Fontsource, Sätteri + KaTeX,
rehype-mermaid, Typst (CV). Hosting: Cloudflare.

## Zasady

- Kolory, promienie i odstępy tylko z tokenów (src/styles/tokens.css). Nigdy hex/rgb w komponentach.
- Każdy kafel to osobny komponent w src/components/tiles/, zbudowany na `<Tile>`.
- Kafle z danymi na żywo: najpierw mock, zawsze 4 stany (ładowanie, OK, nieaktualne, błąd), stały rozmiar.
- Sekrety tylko w zmiennych środowiskowych po stronie serwera, nigdy w kodzie klienta.
- Mobile: w widokach bento siatka 2 kolumny, nigdy jedna kolumna. Wizytówka i korepetycje są wyjątkiem (układ dossier, patrz koncept.md 3.1 i 3.3).
- Kod i nazwy po angielsku, teksty UI przez i18n (PL/EN).
- Szanuj prefers-reduced-motion i kontrast AA.
- Zapytaj, zanim dodasz nową zależność albo zmienisz coś, co jest sprzeczne z koncept.md.
