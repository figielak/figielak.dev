# figielak.dev

Osobista strona w stylu bento grid: ciemne, grafitowe tło, zaokrąglone kafle
i jeden czerwony akcent. Kilka widoków dla różnych odbiorców na wspólnym
systemie wizualnym.

| Widok | Adres | Dla kogo |
|---|---|---|
| Wizytówka | `/` | rekruterzy, współpracownicy — kim jestem, co umiem, kontakt |
| Projekty | `/projects` | lista projektów i case studies w MDX |
| Korepetycje | `/maths` | uczniowie i rodzice — oferta, cena, szybki kontakt (tylko PL) |
| Dashboard | `/dashboard` | dane na żywo: GitHub, WakaTime, homelab, muzyka, Rzeszów |
| Dashboard prywatny | `/dashboard/private` | właściciel — za hasłem |

Wizja, styl, układy i zasady: **[koncept.md](koncept.md)** (źródło prawdy).
Zasady pracy z kodem: **[AGENTS.md](AGENTS.md)**. Wdrożenie: **[docs/deploy.md](docs/deploy.md)**.

## Stack

- [Astro](https://astro.build) 7 + MDX, strony prerenderowane; serwer Node
  (`@astrojs/node`) tylko dla `/api/*` i trybu prywatnego
- Tailwind v4 + własne tokeny (`src/styles/tokens.css`)
- Satoshi (lokalnie) i Geist Mono (Fontsource)
- Sätteri + KaTeX dla wzorów
- Typst dla CV (`cv/` → `public/cv/`)
- i18n PL/EN bez bibliotek (`src/i18n/`)
- Hosting: Google Cloud Run za Cloudflare, deploy z GitHub Actions

## Uruchomienie

Wymaga Node ≥ 22.12.

```sh
npm install
cp .env.example .env     # uzupełnij — bez tego strona pokaże wypełniacze
npm run dev              # http://localhost:4321  (z --host: też w sieci LAN)
```

| Polecenie | Działanie |
|---|---|
| `npm run dev` | serwer deweloperski z podglądem na żywo |
| `npm run build` | build do `dist/` (`client/` — statyka, `server/` — Node) |
| `npm run preview` | podgląd builda |
| `node dist/server/entry.mjs` | serwer produkcyjny lokalnie (jak na Cloud Run) |
| `npm run cv` | CV z Typst do `public/cv/cv-{pl,en}.pdf` (wymaga [`typst`](https://github.com/typst/typst)) |

`/dev/tiles` (tylko w `npm run dev`) pokazuje każdy kafel na żywo we wszystkich
czterech stanach: ładowanie, OK, nieaktualne, błąd.

## Zmienne środowiskowe

Repozytorium jest publiczne, więc dane osobowe i nazwy hostów nie są w kodzie
(koncept.md §14). Lista kluczy: [`.env.example`](.env.example).

| Zmienna | Kiedy | Skąd na produkcji |
|---|---|---|
| `CONTACT_EMAIL`, `CONTACT_PHONE` | build | GitHub Secrets |
| `HOMELAB_DOMAIN` | build | GitHub Secrets |
| `DASHBOARD_PASSWORD` | start serwera | Secret Manager → Cloud Run |

Bez nich build działa z neutralnymi wypełniaczami, a tryb prywatny odmawia
dostępu wszystkim (poza `npm run dev`).

Wyjątek: CV. E-mail i telefon są wpisane w `cv/*.typ` i w gotowe PDF-y — plik
do pobrania i tak pokazuje je otwartym tekstem.

## CV

Źródła w Typst: `cv/cv-pl.typ` i `cv/cv-en.typ` (treść), `cv/template.typ`
(wspólny układ), `cv/fonts/` (Satoshi i Geist Mono jako OTF — Typst nie czyta
`woff2` ze strony). Po zmianie uruchom `npm run cv` i zacommituj źródła razem
z PDF-ami z `public/cv/`; CI nie kompiluje CV. Treść jest kopią wizytówki
(`src/components/views/Home.astro`, `src/i18n/`) — zmiany wprowadzaj w obu
miejscach.

## Struktura

```text
src/
  components/
    ui/        # Tile, LiveBody, StatBar, Dossier, Nav… — klocki systemu
    tiles/     # każdy kafel osobno, zbudowany na <Tile>
    views/     # całe widoki: Home, Projects, Maths, Dashboard, DashboardPrivate
  layouts/     # BaseLayout
  pages/       # trasy (PL bez prefiksu, EN pod /en/), api/ — endpointy
  lib/         # dane i logika: contact, live, owner, sun, progress, mocks/
  i18n/        # pl.json, en.json
  styles/      # tokens.css, global.css
cv/            # źródła CV w Typst i fonty (PDF-y w public/cv/)
docs/          # deploy.md
Dockerfile     # obraz dla Cloud Run (pakuje gotowy dist/)
```

## Wdrożenie

Push na `master` → GitHub Actions buduje stronę (z sekretami) → obraz z gotowym
`dist/` trafia na Cloud Run → Cloudflare (DNS z proxy, SSL, przekierowania 301,
cache, limit żądań) serwuje ją pod `figielak.dev`. Jednorazowa konfiguracja
i rozwiązywanie problemów: [docs/deploy.md](docs/deploy.md).
