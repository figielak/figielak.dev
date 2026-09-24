# figielak.dev

Wizja, widoki, styl i zasady projektu: @koncept.md

## Stack

Astro + MDX, Tailwind v4, Fontsource, Sätteri + KaTeX,
rehype-mermaid, Typst (CV). Hosting: Google Cloud Run za Cloudflare
(deploy: docs/deploy.md).

## Zasady

- Kolory, promienie i odstępy interfejsu tylko z tokenów (src/styles/tokens.css). Nigdy hex/rgb w stylach komponentów.
- Kolorowa treść (prawdziwe loga, okładki, zdjęcia, grafiki) jest dozwolona, nie wymagana — kolor niesie sam asset (koncept.md §4).
- Każdy kafel to osobny komponent w src/components/tiles/, zbudowany na `<Tile>`.
- Kafle z danymi na żywo: najpierw mock, zawsze 4 stany (ładowanie, OK, nieaktualne, błąd), stały rozmiar.
- **Repo jest publiczne.** Żadnych danych osobowych (telefon, e-mail kontaktowy), nazw hostów/domen homelabu, IP ani sekretów w kodzie, dokumentacji, commitach i ich wiadomościach. Wartości do builda idą przez `.env` / GitHub Secrets (`.env.example`), sekrety serwera przez Secret Manager. Przed każdym commitem sprawdź diff (koncept.md §14).
- Mobile: w widokach bento siatka 2 kolumny, nigdy jedna kolumna. Wizytówka i korepetycje są wyjątkiem (układ dossier, patrz koncept.md 3.1 i 3.3).
- Kod i nazwy po angielsku, teksty UI przez i18n (PL/EN).
- Szanuj prefers-reduced-motion i kontrast AA.
- Zapytaj, zanim dodasz nową zależność albo zmienisz coś, co jest sprzeczne z koncept.md.
