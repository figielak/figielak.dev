# figielak.dev – koncept

> Ten plik opisuje wizję strony. Jest źródłem prawdy dla wyglądu, struktury i zachowania.
> Jeśli coś w kodzie jest z nim sprzeczne, pytaj, zanim zmienisz którekolwiek z nich.

---

## 1. Wizja w skrócie

Osobista strona w stylu **bento grid**: ciemne, grafitowe tło, zaokrąglone kafle, jeden czerwony akcent w interfejsie. **Treść może być kolorowa** — prawdziwe loga, okładki, zdjęcia i grafiki dodają stronie życia (patrz §4 „Kolor w treści”).
Strona składa się z kilku **widoków** dla różnych odbiorców. Wszystkie dzielą ten sam **system wizualny** (tokeny, kafle, typografia, akcent), ale nie ten sam układ.

- **Bento grid** to układ domyślny: projekty i dashboard.
- **Wizytówka i korepetycje są świadomym wyjątkiem** — dwukolumnowe „dossier” opisane w 3.1 (korepetycje: 3.3). Powód: bento dobrze pokazuje *wiele równorzędnych* rzeczy naraz, a wizytówka ma jedną rzecz najważniejszą (kto to jest i jak się skontaktować) i resztę jako uzupełnienie. Siatka równych kafli spłaszczała tę hierarchię.

System wizualny obowiązuje w obu układach: te same tokeny, ten sam `Tile`, te same etykiety mono i ten sam akcent.

Charakter: **profesjonalnie, ale z lekkim luzem.** Konkretne informacje podane czytelnie, z drobnymi elementami osobowości (dane na żywo, easter eggi).

Główna inspiracja: gęsty „żywy dashboard” w stylu lucashdo (kafle z danymi na żywo, etykiety uppercase, kropki LIVE, duże liczby).
Wizytówka i korepetycje są spokojniejsze i mniej gęste. Dashboard jest pełną wersją tego stylu.

---

## 2. Widoki i adresy

| Widok | Adres | Odbiorca | Cel |
|---|---|---|---|
| Wizytówka | `figielak.dev` | rekruterzy, potencjalni współpracownicy | w kilka sekund: kim jestem, co umiem, jak się skontaktować |
| Projekty | `figielak.dev/projects` | rekruterzy, ciekawscy | lista projektów i opisy (case studies) w MDX |
| Korepetycje | `figielak.dev/maths` | uczniowie, rodzice | kim jestem, jak wyglądam, gdzie studiuję, szybki kontakt; w przyszłości dostępność i rezerwacja online |
| Dashboard | `figielak.dev/dashboard` | głównie ja, a także osoby chcące wiedzieć więcej | dane na żywo: pogoda, czas, GitHub, homelab, muzyka; prywatnie usługi i deploy |

**Decyzja:** główną strukturą są **ścieżki** (jeden projekt Astro, wspólne komponenty, jedna domena dla SEO).
Subdomeny `maths.figielak.dev` i `dashboard.figielak.dev` działają jako **przekierowania 301** na ścieżki (reguły przekierowań w Cloudflare), co daje krótkie adresy do wysyłania ludziom.

Nawigacja: górny pasek w formie pigułki, wspólny dla wszystkich widoków.
- Po lewej: logo lub inicjał
- Na środku: Wizytówka · Projekty · Dashboard · Korepetycje
- Po prawej: PL/EN i przełącznik motywu

---

## 3. Widoki szczegółowo

Układy bento zapisane są jako `grid-template-areas`. To propozycje startowe, do dopracowania wizualnie.
Wizytówka nie używa siatki obszarów — jej układ opisany jest słowami w 3.1.

### 3.1 Wizytówka (`/`)

- **Ton:** najbardziej profesjonalny widok, luz tylko w detalach (np. zajawka dashboardu z aktualną godziną i pogodą).
- **Układ:** **dwukolumnowe dossier**, nie bento. Lewa kolumna to przyklejona karta tożsamości, prawa to strumień sekcji. Czyta się jak dobre CV.
- **Scroll:** ten widok **może scrollować** i to jest celowe — na tym polega przyklejona lewa kolumna. Wyjątek od reguły „mieści się na jednym ekranie” z sekcji 7.
- **Proporcje:** lewa kolumna 320px, prawa resztę. Poniżej 1024px kolumny się składają, a karta przestaje być przyklejona.

```
┌──────────────┬──────────────────────────┐
│  [ avatar ]  │  WYRÓŻNIONY PROJEKT      │
│              │  ┌────────────────────┐  │
│  Krystian    │  │   zrzut 16:9       │  │
│  Figiela     │  └────────────────────┘  │
│  Student ·   │  ──────────────────────  │
│  Data &      │  DOŚWIADCZENIE           │
│  Software Dev│  2024 —  Firma · rola    │
│  ● Dostępny  │  ──────────────────────  │
│    Rzeszów   │  UMIEJĘTNOŚCI            │
│              │  [TS] [Astro] [Go] …     │
│  [ Napisz ]  │  ──────────────────────  │
│  [ CV ↗ ]    │  EDUKACJA                │
│  gh li mail  │  ──────────────────────  │
│              │  [ zajawka dashboardu ]  │
└──────────────┴──────────────────────────┘
     sticky              scroll
```

**Lewa kolumna — karta tożsamości** (jeden `Tile`, `position: sticky`):

| Element | Zawartość |
|---|---|
| avatar | zdjęcie lub inicjał |
| imię i rola | nagłówek hero + rola pod spodem |
| status | kropka akcentu z pulsowaniem + „Dostępny do pracy” |
| lokalizacja | miasto i kraj |
| bio | 2–3 zdania o mnie |
| akcje | „Napisz” (pełny akcent) i „Pobierz CV” (PDF z Typst, PL/EN zgodnie z językiem); **kopiowanie e-maila jednym kliknięciem** z potwierdzeniem „Skopiowano ✓” |
| social | GitHub, LinkedIn i inne; ikony w kolorze tekstu albo prawdziwe loga |

**Prawa kolumna — strumień sekcji**, rozdzielonych włosową linią `--border-divider`:

| Sekcja | Zawartość |
|---|---|
| Wyróżniony projekt | jedyna sekcja w ramce: zrzut 16:9, nazwa, 1 zdanie, tagi; akcja „Wszystkie projekty ↗” prowadzi do `/projects` |
| Doświadczenie | wiersze `okres · stanowisko`, okres w mono z `tabular-nums`; akcja „Pełne CV ↗” |
| Umiejętności | pigułki z nazwami technologii |
| Edukacja | uczelnia, kierunek, lata — ten sam format wierszy |
| Zajawka dashboardu | mały kafel na dole: godzina i pogoda, „Więcej o mnie ↗” |

Sekcje inne niż wyróżniony projekt **nie mają ramek** — dzieli je sama linia. Dzięki temu w prawej kolumnie widać hierarchię, a nie rząd równorzędnych pudełek.

### 3.2 Projekty (`/projects`)

- Lista projektów jako bento grid kart. Siatka ma 4 kolumny, a wyróżnione projekty mogą zajmować 2×2.
- Każdy projekt to plik MDX w content collection. Wpis zawiera: tytuł, opis, tagi, rok, linki (repo, demo), okładkę i flagę `featured`.
- Strona projektu (`/projects/[slug]`) to długa forma MDX. Może zawierać wzory (KaTeX) i diagramy (Mermaid).
- Wpisy z `featured: true` zasilają karuzelę na wizytówce.

### 3.3 Korepetycje (`/maths`)

- **Ton:** ciepły, prosty, budzący zaufanie. Odbiorcą są także rodzice, więc piszę bez żargonu IT.
- **Układ:** to samo **dossier** co wizytówka (3.1): te same komponenty (`Dossier`, `ProfileCard`, `DossierSection`), te same proporcje i zachowanie. Zmienia się treść — mniej zawodowo, bardziej osobiście.
- **Język:** na start tylko PL.

```
┌──────────────┬──────────────────────────┐
│  [ avatar ]  │  PIERWSZA LEKCJA         │
│              │  ┌────────────────────┐  │
│  Krystian    │  │ 0 zł · 1. godzina  │  │
│  Figiela     │  │ za darmo           │  │
│  Korepetycje │  └────────────────────┘  │
│  z matematyki│  ──────────────────────  │
│  ● Przyjmuję │  O MNIE                  │
│    uczniów   │  ──────────────────────  │
│              │  CO OFERUJĘ              │
│ [Umów lekcję]│  ──────────────────────  │
│ [ Zadzwoń ]  │  JAK UCZĘ                │
│  wa ms ig @  │  ──────────────────────  │
│              │  FORMA I CENA            │
│              │  ──────────────────────  │
│              │  KONTAKT                 │
└──────────────┴──────────────────────────┘
     sticky              scroll
```

**Lewa kolumna — karta tożsamości:** większe zdjęcie niż na wizytówce (160px — rodzic ma widzieć, kto uczy), imię, rola „Korepetycje z matematyki”, status „Przyjmuję nowych uczniów”, lokalizacja, jednozdaniowe bio; akcje „Umów darmową lekcję” (pełny akcent, prowadzi do sekcji kontaktu) i „Zadzwoń”; ikony WhatsApp, Messenger, Instagram, e-mail. Bez CV, GitHuba i LinkedIna.

**Prawa kolumna — strumień sekcji jako mini-bento.** Treść to rzędy kart (`FeatureTile` w `CardGrid`), nie wiersze tekstu — strona ma dać się przeskanować wzrokiem w kilka sekund. Każda karta: ikona, opcjonalna etykieta mono, tytuł i **jedno** krótkie zdanie. Większe odstępy między sekcjami niż na wizytówce (`Dossier relaxed`).

| Sekcja | Zawartość |
|---|---|
| Pierwsza lekcja | jedyna karta w tle `--accent-soft`: „0 zł”, pierwsza godzina za darmo (zapoznanie i decyzja, czy odpowiadam uczniowi), przycisk „Umów się” |
| O mnie | 2–3 krótkie zdania + trzy fakty jako pigułki z ikoną: wiek (liczony przy buildzie z daty urodzenia), uczelnia, rok i kierunek |
| Co oferuję | 3 karty: egzamin ósmoklasisty (tylko klasa 8), matura podstawowa (dowolna klasa), matura rozszerzona wyszarzona jako „Wkrótce” |
| Jak uczę | jedno zdanie o metodzie + 4 karty trybów 2×2: od podstaw, na bieżąco z lekcjami, przed egzaminem, doraźnie |
| Forma i cena | 3 karty: online, stacjonarnie (gdzie), cena „XX zł / 60 min” jako duża liczba mono |
| Kontakt | telefon i e-mail (kopiowanie jednym kliknięciem) + 3 klikalne karty: WhatsApp, Messenger, Instagram |

Telefon i e-mail są w HTML zakodowane (base64) i składane w przeglądarce, tak jak e-mail na wizytówce.

**Telefon:** siatki kart mają 2 kolumny (ostatnia nieparzysta karta na całą szerokość), a na dole ekranu jest przyklejony pasek „Umów darmową lekcję” / „Zadzwoń”, który chowa się, gdy widać sekcję kontaktu.

**W przyszłości:**
- matura rozszerzona w ofercie;
- sekcje: opinie uczniów, FAQ;
- tygodniowa dostępność i rezerwacja online (np. Cal.com, embed lub API);
- opcjonalna sekcja „Zadanie tygodnia” ze wzorem w KaTeX.

### 3.4 Dashboard (`/dashboard`)

- **Ton:** najbardziej osobisty i gęsty, pełny styl „żywego dashboardu”.
- **Dwa tryby** o tej samej siatce 6 kolumn, na desktopie oba mieszczą się na jednym ekranie:

| Tryb | Adres | Dla kogo | Dostęp |
|---|---|---|---|
| publiczny | `/dashboard` | odwiedzający | otwarty |
| prywatny | `/dashboard/private` | ja | hasło na serwerze (patrz §14) |

Między trybami przełącza cichy link pod siatką („Widok prywatny” z kłódką / „Widok publiczny”). W nawigacji jest tylko tryb publiczny.

**Tryb publiczny** — rzędy odpowiadają grupom: lokalne, praca, homelab, życie.

```
"clock   weather air     sun     progress progress"
"github  github  github  music   music    music"
"github  github  github  waka    waka     dns"
"books   books   coffee  net     event    event"
```

| Kafel | Grupa | Zawartość |
|---|---|---|
| `clock` | lokalne | czas Europe/Warsaw, co sekundę |
| `weather` | lokalne | temperatura, opis, miasto |
| `air` | lokalne | jakość powietrza w Rzeszowie (GIOŚ): poziom słownie, skala 6 stopni w akcencie, PM2.5/PM10 |
| `sun` | lokalne | wschód i zachód słońca, długość dnia — liczone lokalnie, bez API |
| `progress` | lokalne | % ukończenia dnia, miesiąca i roku (paski) |
| `github` | praca | wykres kontrybucji, liczba commitów, streak, repozytoria |
| `waka` | praca | czas kodowania dziś i w tygodniu, top 3 języki (WakaTime) |
| `dns` | homelab | liczba reklam zablokowanych dziś przez DNS |
| `net` | homelab | transfer sieciowy dziś ↓/↑ |
| `music` | życie | teraz słucham + top 3 artystów tygodnia (Last.fm) |
| `books` | życie | aktualnie czytane książki (statycznie, `src/lib/books.ts`) |
| `coffee` | życie | licznik kaw: dziś i w roku |
| `event` | życie | odliczanie do najbliższego ważnego wydarzenia (`src/lib/events.ts`) |

**Tryb prywatny** — rzeczy tylko dla mnie. Statystyk PC nie pokazuję wcale.

```
"lab     lab     uptime  uptime  now     now"
"lab     lab     deploy  deploy  site    site"
"launch  launch  launch  launch  launch  launch"
```

| Kafel | Zawartość |
|---|---|
| `lab` | statystyki homelabu: CPU, RAM, GPU, dyski, kontenery |
| `uptime` | uptime homelabu i usług |
| `now` | now page: buduję, uczę się, czytam |
| `launch` | launchery usług homelabu (domena z `HOMELAB_DOMAIN`, lista w `src/lib/services.ts`), działają tylko przez Tailscale |
| `deploy` | ostatni deploy strony: kiedy, commit, status |
| `site` | statystyki strony: odwiedziny dziś / 7 dni, online, top strona |

Na później: `sched` (rozkład zajęć, patrz §14), `visits`, `fact`, `term` i inne z sekcji 13.

---

## 4. Zasady stylu bento

- **Kafel:**
  - tło `--surface`;
  - obramowanie 1px `--border`;
  - promień 20px;
  - padding 20px (dashboard: 16px).
- **Struktura każdego kafla:**
  - etykieta (mono, uppercase, szara) u góry;
  - treść lub duża liczba;
  - detal lub akcja na dole.
- **Klikalne kafle** mają ikonę ↗ w prawym górnym albo dolnym rogu.
- **Hierarchia przez rozmiar:** najważniejsze treści dostają największe kafle.
- **Akcent jest rzadki.** Używam go do:
  - kropek LIVE;
  - pasków postępu;
  - głównych CTA;
  - aktywnych stanów;
  - pojedynczych wyróżnień w tekście.

  Maksymalnie 1–2 kafle na widok mogą mieć pełne akcentowe tło (np. CV, kontakt).
- **Ikony interfejsu** (strzałki, akcje, etykiety): jedna rodzina outline (Tabler), w kolorze tekstu.
- **Kolor w treści — dozwolony, nie wymagany.** Interfejs (tła, ramki, tekst, akcent) zostaje grafitowy z jednym czerwonym akcentem. Treść może mieć pełny kolor tam, gdzie dodaje życia i informacji:
  - prawdziwe loga marek i technologii w ich kolorach (np. Simple Icons w kolorze marki, logo uczelni, usług);
  - okładki książek i albumów, zdjęcia, zrzuty ekranu projektów;
  - grafiki, ilustracje, mapy, wykresy.

  Zasady: kolor pochodzi z samego assetu (SVG/obraz), a nie z hexów w stylach komponentów; każdy element graficzny ma sensowny tekst alternatywny; nic kolorowego nie może zbić kontrastu tekstu poniżej AA. Tekst obok grafik nadal jest pełnoprawną treścią — grafika uzupełnia, nie zastępuje.
- **Zdjęcia i okładki** mogą mieć delikatny ciemny gradient u dołu pod tekstem.

---

## 5. Kolory

Na razie jeden motyw: **ciemny**. Wszystkie kolory definiuję jako tokeny (Tailwind v4 `@theme` + zmienne CSS). **Nigdy nie wpisuję hexów w komponentach.**

| Token | Wartość | Użycie |
|---|---|---|
| `--bg` | `#0E0E10` | tło strony (grafit, nie czysta czerń) |
| `--surface` | `#161618` | tło kafla |
| `--surface-hover` | `#1C1C1F` | kafel po najechaniu |
| `--surface-inset` | `#111113` | elementy wewnątrz kafla (pigułki, paski) |
| `--border` | `rgb(255 255 255 / 0.08)` | obramowanie kafla |
| `--border-hover` | `rgb(255 255 255 / 0.16)` | obramowanie po najechaniu |
| `--text` | `#EDEDEF` | tekst główny |
| `--text-muted` | `#8B8B92` | opisy, etykiety |
| `--text-subtle` | `#5C5C63` | najmniej ważne detale |
| `--accent` | `#E5484D` | akcent: stonowana czerwień, kontrast AA na tle |
| `--accent-hover` | `#EC5D5E` | akcent po najechaniu |
| `--accent-soft` | `rgb(229 72 77 / 0.12)` | tła wyróżnień, poświaty |

Zasady:
- Stany na żywo: domyślnie `online` i `LIVE` mają kolor `--accent` z pulsowaniem, a `offline` i nieaktualne dane mają kolor `--text-subtle`. Kolory semantyczne (np. zielony „online”, skala jakości powietrza) są dozwolone, jeśli poprawiają czytelność — wtedy dodaję je jako tokeny.
- Wykres kontrybucji GitHuba rysuję w odcieniach akcentu (4 poziomy przezroczystości).
- Kolor treści (loga, okładki, zdjęcia, grafiki) opisuje §4 „Kolor w treści”.

---

## 6. Typografia

- **Główny font:** Satoshi w grubościach 400, 500 i 700. Najlepiej w wersji variable.
  Satoshi pochodzi z Fontshare i prawdopodobnie nie ma go w Fontsource, więc hostuję go lokalnie (woff2, `font-display: swap`, preload).
- **Mono:** JetBrains Mono przez Fontsource. Używam go do etykiet, liczb, statystyk, dat i terminala.
- **Liczby** zawsze z `font-variant-numeric: tabular-nums`, żeby nie „skakały” przy aktualizacji.

| Rola | Font | Rozmiar | Grubość | Uwagi |
|---|---|---|---|---|
| Etykieta kafla | mono | 11px | 500 | uppercase, `letter-spacing: 0.08em`, `--text-muted` |
| Tekst | Satoshi | 14px | 400 | `--text-muted` w opisach |
| Tytuł w kaflu | Satoshi | 16–18px | 500 | |
| Nagłówek hero | Satoshi | 28–36px | 700 | |
| Duża liczba | mono | 32–48px | 700 | |

---

## 7. Siatka i responsywność

Reguły poniżej dotyczą **widoków w bento**: projektów i dashboardu.
**Wizytówka i korepetycje rządzą się własnymi zasadami** — patrz 3.1, 3.3 i podsumowanie na końcu tej sekcji.

- **Kolumny:**
  - projekty mają 4 kolumny;
  - dashboard ma 6 kolumn.
- **Odstęp między kaflami:** 12px (dashboard: 10px).
- **„Mieści się na jednym ekranie”** dotyczy desktopu. Dashboard ma się zmieścić bez scrolla od 1280×720 w górę, a docelowy widok to 1440×900. Poniżej tego scroll jest dozwolony.
- **Tablet (640–1024px):** 4 kolumny; dashboard przechodzi z 6 na 4.
- **Telefon (<640px):**
  - siatka ma **2 kolumny** i kafle układają się od lewej do prawej, **nigdy jedna kolumna jeden pod drugim**;
  - kafle szersze niż 2 kolumny zwężam do 2;
  - małe kafle (social, zegar, pogoda, CV) zajmują 1×1 parami obok siebie.
- Kolejność kafli na mobile ustawiam jawnie osobnymi `grid-template-areas` dla każdego breakpointu; nie polegam na kolejności w HTML.

**Dossier (wizytówka i korepetycje) — trzy odstępstwa:**

| Reguła bento | Dossier |
|---|---|
| siatka 4 kolumn z `grid-template-areas` | dwie kolumny: 320px + reszta |
| mieści się na jednym ekranie | scrolluje celowo, lewa kolumna jest przyklejona |
| telefon zawsze 2 kolumny | poniżej 1024px jedna kolumna — strumień tekstu w dwóch kolumnach na telefonie byłby nieczytelny |

Wspólne zostają: tokeny, `Tile`, etykiety mono, akcent, hover, focus i `prefers-reduced-motion`.

---

## 8. Interakcje i animacje

Na start:
- **Hover na klikalnym kaflu:**
  - obramowanie zmienia się na `--border-hover`;
  - tło zmienia się na `--surface-hover`;
  - kafel unosi się lekko (`translateY(-2px)`);
  - pojawia się delikatny cień;
  - przejście trwa 150–200ms z `ease-out`.
- **Kropka LIVE:** kolor akcentu, łagodne pulsowanie (skala i przezroczystość, około 2s).
- **Focus:** widoczny ring w kolorze akcentu (`:focus-visible`).
- **`prefers-reduced-motion`:** wyłącza unoszenie, pulsowanie i animacje wejścia.

Do eksperymentów później (każde jako opcja łatwa do wyłączenia):
- poświata podążająca za kursorem;
- kafle pojawiające się kolejno przy wejściu;
- liczniki odliczające do wartości;
- efekt tilt.

---

## 9. Dane na żywo

### Architektura

- Strona jest **statyczna domyślnie** (Astro). Kafle z danymi na żywo to małe wyspy (`client:visible`).
- Dane pobieram przez własne endpointy `/api/*` na serwerze Node w Cloud Run (Astro + `@astrojs/node`, trasy z `prerender = false`; wzór: `src/pages/api/health.ts`). Z przeglądarki **nigdy** nie odpytuję zewnętrznych API z kluczem.
- Tokeny i klucze trzymam w **Secret Manager** i przekazuję do Cloud Run jako zmienne środowiskowe.

| Dane | Źródło | Odświeżanie / cache |
|---|---|---|
| Pogoda | Open-Meteo (bez klucza) | cache 15 min |
| GitHub | GitHub GraphQL API (token po stronie serwera) | cache 1h |
| Czas | lokalnie w przeglądarce | co sekundę |
| Wizyty i statystyki strony (prywatne) | API Umami lub Plausible | cache 1–5 min |
| Jakość powietrza | GIOŚ (bez klucza), stacja w Rzeszowie | cache 1h |
| Wschód i zachód słońca, % dnia/miesiąca/roku | liczone lokalnie (build + przeglądarka) | — |
| Blokada reklam (DNS), transfer sieciowy | AdGuard Home / Pi-hole i router przez push-agenta | przez push |
| Ostatni deploy (prywatne) | Cloud Run Admin API (rewizje usługi) lub GitHub Actions API | cache 1–5 min |
| Licznik kaw | do ustalenia (§17) | — |
| Homelab | model **push**, opisany niżej | co 1–5 min |
| Uptime | agent na homelabie (opcjonalnie Uptime Kuma) | przez push |
| Rozkład zajęć | plik iCal (np. eksport z USOS, jeśli uczelnia go udostępnia) | cache 1h |
| Teraz słucham / top artyści | Last.fm API | cache 30 s / 1h |
| WakaTime | WakaTime API | cache 1h |

### Homelab: model push

- Homelab jest dostępny **tylko przez Tailscale**. Nie wystawiam go publicznie i nie wystawiam endpointów Homepage/Homarr.
- Mały agent na homelabie (skrypt, np. timer systemd lub cron) co kilka minut wysyła zanonimizowany JSON z CPU, RAM, GPU, dyskami i uptime:
  - metodą POST na `/api/stats`;
  - z tajnym tokenem w nagłówku.
- Endpoint zapisuje ostatni odczyt w **Firestore**. Dashboard odczytuje go i odświeża co około 30 s.
- **Limity zapisu:** Cloud Run skaluje się do zera i nie trzyma stanu w pamięci, więc odczyt musi trafić do bazy. Darmowy Firestore daje 20 tys. zapisów dziennie; wysyłka co 30 s to ok. 2900 zapisów, więc się mieści. Przed wdrożeniem sprawdzam aktualne limity.

### Stany każdego kafla z danymi na żywo (obowiązkowe)

| Stan | Wygląd |
|---|---|
| Ładowanie | szkielet w kształcie docelowej treści |
| OK | dane i kropka LIVE |
| Nieaktualne (dane starsze niż próg, np. 10 min) | dane, szara kropka, „aktualizacja X min temu” |
| Błąd lub brak danych | spokojny tekst zastępczy (np. „Homelab offline”) |

Kafel nie może zmieniać rozmiaru między stanami. **Najpierw buduję kafle na danych testowych (mock), potem podpinam prawdziwe źródła.**

---

## 10. Stack i narzędzia

- **Astro + MDX** z content collections dla projektów.
- **Tailwind v4:** tokeny w `@theme`, zgodnie z sekcją 5.
- **Fontsource** dla JetBrains Mono; Satoshi hostowany lokalnie.
- **Sätteri (`@astrojs/markdown-satteri`) + KaTeX:** wzory w projektach i na `/maths`. Sätteri parsuje matematykę (`features: { math: true }`), a własny plugin `src/plugins/katex.js` renderuje ją KaTeX-em przy buildzie. CSS KaTeX ładuję tylko na stronach, które go używają.
- **rehype-mermaid:** diagramy w projektach. Domyślnie renderuje przy buildzie przez Playwright. Build idzie w GitHub Actions (obraz Dockera dostaje gotowy `dist/`), więc wystarczy doinstalować tam przeglądarkę; w razie problemów przechodzę na renderowanie po stronie klienta.
- **Typst:** źródło CV (`cv/cv-pl.typ`, `cv/cv-en.typ`), kompilowane do PDF w `public/cv/`. Kompilacja lokalnie lub w CI.
- **Hosting:** **Google Cloud Run** (`europe-west1`, skalowanie do zera) za **Cloudflare**.
  - Cloud Run uruchamia kontener z `Dockerfile`: prerenderowane strony + serwer Node dla `/api/*`.
  - Cloudflare zostaje z przodu jako DNS z proxy: SSL Full (strict), przekierowania 301 subdomen, cache `/_astro/*`, limit żądań do trybu prywatnego.
  - Region `europe-west1`, bo Cloud Run mapuje własne domeny tylko w części regionów (Warszawy wśród nich nie ma).
  - Deploy: GitHub Actions przy pushu na `master` (`.github/workflows/deploy.yml`, Workload Identity Federation, bez kluczy JSON). Jednorazowa konfiguracja: `docs/deploy.md`.
- **Analityka:** Umami lub Plausible. Wybór zależy od tego, które API wygodniej zasila licznik wizyt.
- **Homelab:** Homepage lub Homarr, dostępne tylko przez Tailscale.

Proponowana struktura:

```
src/
  components/
    ui/          # Tile, TileLabel, LiveDot, Pill, IconLink, Nav
    tiles/       # każdy kafel jako osobny komponent
  layouts/       # BaseLayout, BentoLayout
  pages/
    index.astro
    projects/    # index.astro, [slug].astro
    maths.astro
    dashboard.astro
    api/         # endpointy danych na żywo
  content/projects/*.mdx
  i18n/          # pl.json, en.json
  styles/        # tokens.css, global.css
public/
  fonts/  cv/
cv/              # źródła Typst
agent/           # skrypt statystyk homelabu
docs/            # deploy.md — konfiguracja Cloud Run i Cloudflare
Dockerfile       # obraz dla Cloud Run
```

---

## 11. Języki (PL/EN)

- Routing i18n w Astro:
  - `pl` jako domyślny bez prefiksu;
  - `en` pod `/en/...`.
- Wszystkie teksty UI trzymam w plikach i18n, nigdy wpisane na sztywno w komponentach.
- `/maths` na start tylko po polsku.
- Przełącznik PL/EN w nawigacji zachowuje bieżący widok.

---

## 12. Motywy

- Motyw ustawiam atrybutem `data-theme` na `<html>`:
  - `dark` (domyślny, jedyny na start);
  - później `light`;
  - później `crazy`.
- Motyw to wyłącznie inny zestaw wartości tokenów. Komponenty nie wiedzą, który motyw jest aktywny.
- Przełącznik jest w nawigacji od początku. Dopóki jest jeden motyw, może być nieaktywny albo ukryty.
- Wybór zapamiętuję po stronie klienta i ustawiam skryptem inline przed renderem, bez mignięcia.
- Jasny motyw w przyszłości wymaga ręcznego dopracowania:
  - mocniejszych cieni;
  - ciemniejszego akcentu dla kontrastu;
  - sprawdzenia zdjęć i ikon.

---

## 13. Kafle fun-to-have (po must-have)

- Top artyści / utwory
- Teraz słucham (Last.fm)
- WakaTime
- Zdjęcia (fotografia)
- Mapa podróży
- Losowy fun fact
- Licznik kaw
- Aktualny cel
- Now page
- Książki
- Mini terminal (`whoami`, `help`, `projects`…)
- Mini gra (Snake)
- Konami code / ukryty kafel
- Odtwarzacz muzyki
- Licznik kliknięć

---

## 14. Prywatność i bezpieczeństwo

- **Repozytorium jest publiczne** (`github.com/figielak/figielak.dev`). Wszystko, co trafia do commita — także do historii — jest jawne. Dlatego:
  - dane osobowe (telefon, e-mail kontaktowy, adres), nazwy hostów i domeny homelabu, nazwa tailnetu, adresy IP, tokeny i klucze **nigdy** nie trafiają do kodu, dokumentacji ani wiadomości commitów;
  - wartości potrzebne przy buildzie czytam ze zmiennych środowiskowych: lokalnie z `.env` (poza gitem), w CI z GitHub Secrets; lista kluczy jest w `.env.example`, a kod ma neutralne wypełniacze, żeby build działał bez nich;
  - sekrety serwera (`/api/*`) są w Secret Manager, nie w repo i nie w GitHub Variables;
  - zanim zrobię commit, sprawdzam diff pod kątem powyższych danych; jeśli coś wycieknie, przepisuję historię i od razu zmieniam ujawniony sekret.
- **Rozkład zajęć** zdradza, gdzie i kiedy jestem, a strona z korepetycjami jest publiczna. Publicznie pokazuję tylko ogólną formę (np. „zajęcia do 14:00” lub „dziś wolne”) albo ukrywam kafel.
- **Statystyk PC** nie pokazuję wcale — zdradzałyby, kiedy jestem przy komputerze. **Statystyki homelabu i uptime** są tylko w **prywatnym dashboardzie**.
- **Prywatny dashboard** (`/dashboard/private` i `/en/dashboard/private`) chroni **hasło sprawdzane na serwerze** (HTTP Basic Auth, `src/lib/owner.ts`). Cloudflare Zero Trust (Access) nie jest dostępny.
  - Strony prywatne renderuje serwer (`prerender = false`), a nie plik statyczny. Dzięki temu sprawdzenie obejmuje każdą odmianę ścieżki i adres `*.run.app`, który omija Cloudflare.
  - Hasło (`DASHBOARD_PASSWORD`) jest w Secret Manager i trafia do Cloud Run jako zmienna środowiskowa przy starcie, nie przy buildzie. Bez hasła serwer odmawia wszystkim (poza `astro dev`).
  - Hasło jest długie i losowe. Reguła rate limiting w Cloudflare ogranicza próby zgadywania.
  - Odpowiedzi mają `Cache-Control: private, no-store`. Strony mają `noindex` i nie trafiają do sitemapy.
  - Ten sam strażnik chroni przyszłe prywatne endpointy (`/api/private/*`).
- **Linki do homelabu** (prawdziwe nazwy hostów) są tylko w trybie prywatnym i działają wyłącznie przez Tailscale. W trybie publicznym pokazuję ogólne etykiety.
- **Tokeny i klucze** trzymam wyłącznie w zmiennych środowiskowych po stronie serwera. Endpoint `/api/stats`:
  - wymaga tokenu;
  - ma limit żądań;
  - waliduje dane.

---

## 15. Dostępność i wydajność

- Kontrast minimum WCAG AA; akcent sprawdzony na `--bg` i `--surface`.
- Nawigacja klawiaturą, `:focus-visible`, teksty alternatywne dla zdjęć, `aria-live="polite"` dla aktualizowanych liczb.
- Domyślnie zero JS; JS tylko w kaflach na żywo i interaktywnych.
- Obrazy przez `astro:assets` (AVIF/WebP, właściwe rozmiary).
- Cel: Lighthouse 95+ na wizytówce.

---

## 16. Kolejność prac

1. **Fundament:** tokeny, fonty, `Tile` i komponenty UI, nawigacja, szkielet i18n, szkielet widoków.
2. **Wizytówka:** układ dossier (zrobione w kroku 1), statyczne treści, kopiowanie e-maila, CV z Typst.
3. **Projekty:** content collection, lista, strona projektu, KaTeX, Mermaid, karuzela featured.
4. **Korepetycje:** treść i szybki kontakt.
5. **Dashboard na danych testowych:** pełny układ i wszystkie 4 stany kafli.
6. **Dane na żywo:** endpointy, cache, agent homelabu, analityka.
7. **Dodatki:** kafle fun-to-have, animacje, jasny motyw, motyw „crazy”, rezerwacja online na `/maths`.

---

## 17. Otwarte decyzje

- [ ] Domyślny język wizytówki: PL czy EN (rekruterzy zagraniczni?)
- [ ] Ostateczny odcień akcentu (start: `#E5484D`)
- [ ] Mono: JetBrains Mono czy Geist Mono
- [ ] Umami czy Plausible
- [ ] Źródło rozkładu zajęć i poziom szczegółowości publicznie
- [ ] Narzędzie do rezerwacji korepetycji (Cal.com / własne)
- [ ] Miasto w kaflu pogody
- [ ] Źródło licznika kaw (ręczny endpoint, skrót w telefonie, NFC?)
- [ ] Lista usług w launcherze i wydarzeń w odliczaniu (na razie wypełniacze)
- [ ] Framework wysp: czysty TS w `<script>` czy Preact, gdy potrzebny stan
