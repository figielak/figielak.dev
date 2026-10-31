# figielak.dev – architektura

> Jak strona jest zbudowana: stack, hosting, struktura repo i przepływ danych na żywo.
> Razem z [koncept.md](koncept.md) jest źródłem prawdy; jeśli kod jest z nim sprzeczny, pytaj, zanim zmienisz którekolwiek z nich.

---

## 1. Stack i narzędzia

- **Astro + MDX** z content collections dla projektów.
- **Tailwind v4:** tokeny w `@theme`, zgodnie z design.md §2.
- **Fontsource** dla Geist Mono; Satoshi hostowany lokalnie.
- **Sätteri (`@astrojs/markdown-satteri`) + KaTeX:** wzory w projektach i na `/maths`. Sätteri parsuje matematykę (`features: { math: true }`), a własny plugin `src/plugins/katex.js` renderuje ją KaTeX-em przy buildzie. CSS KaTeX ładuję tylko na stronach, które go używają.
- **rehype-mermaid** (jeszcze niezainstalowany, instaluję go razem z pierwszym case study, które ma diagram — koncept.md §5): diagramy w projektach. Domyślnie renderuje przy buildzie przez Playwright. Build idzie w GitHub Actions (obraz Dockera dostaje gotowy `dist/`), więc wystarczy doinstalować tam przeglądarkę; w razie problemów przechodzę na renderowanie po stronie klienta.
- **Typst:** źródło CV (`cv/cv-pl.typ`, `cv/cv-en.typ`, wspólny układ w `cv/template.typ`), kompilowane lokalnie (`npm run cv`) do PDF w `public/cv/`; PDF-y są w repo, więc CI nie potrzebuje Typsta. Jedna strona A4, jasne tło (druk, ATS), Satoshi i Geist Mono (statyczne OTF w `cv/fonts/`, bo Typst nie czyta woff2), jeden czerwony akcent, klauzula RODO w stopce. Treść to kopia wizytówki — zmieniając doświadczenie lub umiejętności, poprawiam oba miejsca.
- **Hosting:** **Google Cloud Run** (`europe-west1`, skalowanie do zera) za **Cloudflare**.
  - Cloud Run uruchamia kontener z `Dockerfile`: prerenderowane strony + serwer Node dla `/api/*`.
  - Cloudflare zostaje z przodu jako DNS z proxy: SSL Full (strict), przekierowania 301 subdomen, cache `/_astro/*`, limit żądań do trybu prywatnego.
  - Region `europe-west1`, bo Cloud Run mapuje własne domeny tylko w części regionów (Warszawy wśród nich nie ma).
  - Deploy: GitHub Actions przy pushu na `master` (`.github/workflows/deploy.yml`, Workload Identity Federation, bez kluczy JSON). Jednorazowa konfiguracja: `docs/deploy.md`.
- **Analityka:** Cloudflare Web Analytics — strona i tak stoi za proxy Cloudflare, beacon nie używa ciasteczek, a dane czyta GraphQL API.
- **Homelab:** Homepage lub Homarr, dostępne tylko przez Tailscale.

---

## 2. Struktura katalogów

Struktura (✱ — jeszcze nie istnieje):

```
src/
  assets/        # avatar, okładki książek, loga marek, zrzuty projektów
  components/
    ui/          # Tile, TileLabel, LiveDot, Pill, IconLink, Nav, BentoLayout,
                 # Dossier, ProfileCard, FeaturedCarousel, ProjectGallery, Terminal…
    tiles/       # każdy kafel jako osobny komponent (homelab/ — jego sekcje)
    views/       # treść widoków, wspólna dla PL i EN
  layouts/       # BaseLayout
  lib/           # dane statyczne (projects, books, events, services, contact)
    mocks/       # dane testowe i typy kafli na żywo
    server/      # klienci API, cache, Firestore, kontrakt homelaba
  pages/
    index.astro  maths.astro  dashboard.astro  dashboard/private.astro
    projects/    # index.astro, [slug].astro (szczegóły projektu, case study tylko PL)
    en/          # te same widoki po angielsku (bez /maths), też projects/[slug]
    dev/         # galeria stanów kafli /dev/tiles (tylko w dev)
    api/         # endpointy danych na żywo
  content/projects/*.mdx   # schemat w src/content.config.ts
  plugins/       # katex.js
  scripts/       # live.ts, intro.ts, spotlight.ts, terminal/
  i18n/          # pl.json, en.json
  styles/        # tokens.css, global.css
public/
  fonts/  cv/     # PDF-y CV
cv/              # źródła Typst i fonty CV
docs/            # koncept.md, design.md, architecture.md (ten plik), security.md, decisions.md, deploy.md
Dockerfile       # obraz dla Cloud Run
```

---

## 3. Dane na żywo

### 3.1 Architektura

- Strona jest **statyczna domyślnie** (Astro). Kafle z danymi na żywo to małe wyspy w czystym TS (`<script>` + `src/scripts/live.ts`, bez frameworka): kafel z propem `endpoint` renderuje się w stanie ładowania i sam dociąga dane w przeglądarce.
- Dane pobieram przez własne endpointy `/api/*` na serwerze Node w Cloud Run (Astro + `@astrojs/node`, trasy z `prerender = false`; wzór: `src/pages/api/health.ts`). Z przeglądarki **nigdy** nie odpytuję zewnętrznych API z kluczem.
- Tokeny i klucze trzymam w **Secret Manager** i przekazuję do Cloud Run jako zmienne środowiskowe.
- Cache odpowiedzi jest w pamięci instancji (`src/lib/server/cache.ts`); po zimnym starcie pierwsze żądanie pobiera dane od nowa.

### 3.2 Źródła danych

| Dane | Źródło | Odświeżanie / cache |
|---|---|---|
| Pogoda | Open-Meteo (bez klucza), centrum Rzeszowa; nieaktualne po 45 min | cache 15 min |
| GitHub (+ ostatni commit repozytorium bieżącej pracy, `lastCommit`) | GitHub GraphQL API (token po stronie serwera) | cache 1h |
| Czas | lokalnie w przeglądarce | co sekundę |
| Wizyty i statystyki strony (prywatne) | Cloudflare Web Analytics (beacon wstrzykiwany przez proxy, bez ciasteczek) przez GraphQL API, token Account Analytics: Read | cache 5 min |
| Jakość powietrza | GIOŚ API v1 (bez klucza; stare `/pjp-api/rest` zwraca 410), stacja Rzeszów, Al. Piłsudskiego; `updatedAt` to czas pomiaru, nieaktualne po 3 h | cache 30 min |
| Wschód i zachód słońca, % dnia/miesiąca/roku | liczone lokalnie (build + przeglądarka) | — |
| Blokada reklam (DNS) | AdGuard Home (`/control/stats`, retencja 7 dni) przez push-agenta | przez push |
| Transfer sieciowy | `/proc/net/dev` na Pi przez push-agenta (ruch homelaba, nie domu) | przez push |
| Ostatnie deploye (prywatne) | GitHub Actions API (przebiegi `deploy.yml`, `GITHUB_TOKEN`) | cache 60 s |
| Korepetycje (prywatne) | prywatny adres iCal kalendarza Google (`TUTORING_ICAL_URL`), rozwijany przez `ical.js`; płatności w Firestore | cache 10 min |
| Wygasa (prywatne) | RDAP domeny, certyfikat z TLS, nagłówek tokenu GitHuba, verify tokenu Cloudflare, ręczne daty | cache 6 h |
| Cel | Firestore (`site/goal`), zapis z trybu prywatnego | cache 60 s |
| Historia CPU i RAM (prywatne) | zbierana przez stronę z pushy agenta: każdy odczyt `lab` wpada do 5-minutowego kubełka jako średnia, 24 h w dokumencie `homelab/history` (jeden odczyt i zapis Firestore na push) | cache 60 s |
| Homelab | model **push**, opisany niżej | co 1–5 min |
| Uptime usług | Uptime Kuma (`/metrics`: status, dostępność i czas odpowiedzi z 30 dni) przez push-agenta | przez push |
| Teraz słucham / top artyści | Last.fm API | cache 30 s / 1h |
| Podgląd utworu (30 s) | iTunes Search API (bez klucza), razem z utworem z Last.fm | ostatnie wyszukiwanie do zmiany utworu |
| WakaTime | WakaTime API | cache 1h |
| Czytam | Hardcover GraphQL API (token z zakresem `read:library` po stronie serwera; Hardcover nie pozwala używać go w przeglądarce); nieaktualne po 3 h | cache 1h |

Stany kafli (ładowanie, OK, nieaktualne, błąd) i kafle z kilkoma źródłami: design.md §6.

---

## 4. Homelab: model push

- Homelab jest dostępny **tylko przez Tailscale**. Nie wystawiam go publicznie i nie wystawiam endpointów Homepage/Homarr.
- Agent na homelabie (kontener Dockera w osobnym repo homelaba, `network_mode: host`) co 60 s zbiera dane z `/proc`, AdGuarda i Uptime Kumy i wysyła zanonimizowany JSON:
  - metodą POST na `/api/stats`, z tokenem `Authorization: Bearer` (`STATS_PUSH_TOKEN`);
  - w sekcjach publicznych tylko liczby i ogólne rodzaje (`dns`, `media`…) — nazwy hostów, domeny, IP i nazwy monitorów zostają na Pi;
  - sekcje prywatne (`monitors`, `containers`, `backup`) niosą nazwy monitorów i kontenerów — same słowa, bez kropek, dwukropków i ukośników, więc nie przejdzie przez nie host, domena, URL ani IP; trafiają do osobnego dokumentu `homelab/private`, czytanego przez `/api/private/homelab/*`; publiczny `/api/homelab/uptime` bierze z niego tylko nazwę i stan (up/down) aplikacji z listy w `src/lib/services.ts`;
  - kontrakt (v1) opisuje `src/lib/server/homelab.ts`.
- Sekcje (`lab`, `dns`, `traffic`, `services`) są niezależne: agent pomija tę, której źródło nie odpowiedziało, a endpoint odrzuca tylko błędną sekcję. Każda ma własny czas, więc przy awarii jednego źródła szarzeje tylko jego kafel.
- Endpoint zapisuje ostatni odczyt w **Firestore** (jeden dokument, REST bez biblioteki klienta). Kafle czytają go przez `/api/homelab/{lab,dns,net,uptime}` (cache 30 s) i odświeżają się co około minutę.
- **Limity zapisu:** Cloud Run skaluje się do zera i nie trzyma stanu w pamięci, więc odczyt musi trafić do bazy. Darmowy Firestore daje 20 tys. zapisów dziennie; wysyłka co 60 s to ok. 1440 zapisów.

---

## 5. Języki (PL/EN)

- Routing i18n w Astro:
  - `pl` jako domyślny bez prefiksu;
  - `en` pod `/en/...`.
- Wszystkie teksty UI trzymam w plikach i18n, nigdy wpisane na sztywno w komponentach.
- `/maths` na start tylko po polsku.
- Przełącznik PL/EN w nawigacji zachowuje bieżący widok.

---

## 6. Wydajność

- Domyślnie zero JS; JS tylko w kaflach na żywo i interaktywnych.
- Obrazy przez `astro:assets` (AVIF/WebP, właściwe rozmiary).
- Cel: Lighthouse 95+ na wizytówce.
