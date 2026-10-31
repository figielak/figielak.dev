# figielak.dev – koncept

> Ten plik opisuje wizję strony: widoki, odbiorców i to, co pokazuje każdy widok.
> Razem z plikami obok jest źródłem prawdy dla wyglądu, struktury i zachowania.
> Jeśli coś w kodzie jest z nimi sprzeczne, pytaj, zanim zmienisz którekolwiek z nich.

| Plik | Zawartość |
|---|---|
| [koncept.md](koncept.md) | wizja, widoki i odbiorcy, specyfikacja widoków i kafli, co dalej |
| [design.md](design.md) | system wizualny: kafle, kolory, typografia, siatka, interakcje, stany kafli, motywy, dostępność |
| [architecture.md](architecture.md) | stack, struktura katalogów, dane na żywo i źródła, model push homelaba, i18n, wydajność |
| [security.md](security.md) | publiczne repo, co jest publiczne, a co prywatne, prywatny dashboard, tokeny |
| [decisions.md](decisions.md) | otwarte i podjęte decyzje z datą i powodem |
| [deploy.md](deploy.md) | jednorazowa konfiguracja Cloud Run, Cloudflare i GitHub Actions |

---

## 1. Wizja w skrócie

Osobista strona w stylu **bento grid**: ciemne, grafitowe tło, zaokrąglone kafle, jeden czerwony akcent w interfejsie. **Treść może być kolorowa** — prawdziwe loga, okładki, zdjęcia i grafiki dodają stronie życia (patrz design.md §1 „Kolor w treści”).
Strona składa się z kilku **widoków** dla różnych odbiorców. Wszystkie dzielą ten sam **system wizualny** (tokeny, kafle, typografia, akcent), ale nie ten sam układ.

- **Bento grid** to układ publicznego Dev Logu i prywatnego dashboardu. Dev Log ma wyraźną hierarchię: bieżąca praca jest najważniejsza, pozostałe kafle ją uzupełniają.
- **Projekty to lista** — jeden wyróżniony projekt i wiersze pod nim (3.2). Druga siatka kafli zlewałaby się z Dev Logiem, a projekt potrzebuje więcej tekstu, niż mieści kafel.
- **Wizytówka i korepetycje są świadomym wyjątkiem** — dwukolumnowe „dossier” opisane w 3.1 (korepetycje: 3.3). Powód: bento dobrze pokazuje *wiele równorzędnych* rzeczy naraz, a wizytówka ma jedną rzecz najważniejszą (kto to jest i jak się skontaktować) i resztę jako uzupełnienie. Siatka równych kafli spłaszczała tę hierarchię.

System wizualny obowiązuje w obu układach: te same tokeny, ten sam `Tile`, te same etykiety mono i ten sam akcent.

Charakter: **profesjonalnie, ale z lekkim luzem.** Konkretne informacje podane czytelnie, z drobnymi elementami osobowości (dane na żywo, easter eggi).

Główna inspiracja wizualna: „żywy dashboard” w stylu lucashdo (kafle z danymi na żywo, etykiety uppercase, duże liczby).
Publiczny **Dev Log** uzupełnia CV i projekty: pokazuje bieżącą pracę, aktywność, naukę i mały osobisty akcent. Jest spokojniejszy, z pięcioma kartami i większą ilością oddechu. Gęsty panel operacyjny zostaje w trybie prywatnym. Wizytówka i korepetycje zachowują układ dossier.

---

## 2. Widoki i adresy

| Widok | Adres | Odbiorca | Cel |
|---|---|---|---|
| Wizytówka | `figielak.dev` | rekruterzy, potencjalni współpracownicy | w kilka sekund: kim jestem, co umiem, jak się skontaktować |
| Projekty | `figielak.dev/projects` | rekruterzy, ciekawscy | lista projektów i opisy (case studies) w MDX |
| Korepetycje | `figielak.dev/maths` | uczniowie, rodzice | kim jestem, jak wyglądam, gdzie studiuję, szybki kontakt; w przyszłości dostępność i rezerwacja online |
| Dev Log | `/dashboard`, `/en/dashboard` | rekruterzy, współpracownicy i ciekawscy | nad czym pracuję, czego się uczę i co dzieje się poza CV; pięć uporządkowanych kafli |
| Dashboard prywatny | `/dashboard/private`, `/en/dashboard/private` | ja | panel operacyjny: usługi i serwer, backup, deploye, statystyki strony, korepetycje, wygasające rzeczy i edycja celu |

**Decyzja:** główną strukturą są **ścieżki** (jeden projekt Astro, wspólne komponenty, jedna domena dla SEO).
Subdomeny `maths.figielak.dev` i `dashboard.figielak.dev` działają jako **przekierowania 301** na ścieżki (reguły przekierowań w Cloudflare), co daje krótkie adresy do wysyłania ludziom.

Nawigacja: górny pasek w formie pigułki, wspólny dla wszystkich widoków.
- Po lewej: logo `figielak_` — nazwa i migający czerwony kursor `_` jak w terminalu (bez migania przy reduced motion)
- Na środku: Wizytówka · Projekty · Dev Log · Korepetycje; nazwa Dev Log jest wspólna dla PL i EN. Dopóki korepetycje są zamknięte — wyszarzone, nie są linkiem, z dopiskiem „wkrótce” od 640 px (§3.3).
- Po prawej: PL/EN, przycisk terminala `>_` (design.md §5) i przełącznik motywu (nieaktywny, dopóki jest jeden motyw — design.md §7); na `/maths` przełącznik języka jest wyłączony, bo widok jest tylko po polsku
- Na telefonie (<640px) logo i przyciski dzielą górny rząd, a pigułka z linkami zajmuje rząd pod nimi
- Na telefonie (<640px) pasek jest przyklejony do góry ekranu na prawie kryjącym tle (`--nav-glass`, rozmycie `--glass-blur`): chowa się przy przewijaniu w dół i wraca przy pierwszym ruchu w górę (próg 8 px, żeby nie migał), a przy samej górze strony jest zawsze widoczny. Schowany jest `inert`, a fokus w nim go pokazuje. Na desktopie pasek przewija się razem ze stroną.

---

## 3. Widoki szczegółowo

Układy bento zapisane są jako `grid-template-areas`. To propozycje startowe, do dopracowania wizualnie.
Wizytówka nie używa siatki obszarów — jej układ opisany jest słowami w 3.1.

### 3.1 Wizytówka (`/`)

- **Ton:** najbardziej profesjonalny widok, luz tylko w detalach (np. zajawka dashboardu z aktualną godziną i pogodą).
- **Układ:** **dwukolumnowe dossier**, nie bento. Lewa kolumna to przyklejona karta tożsamości, prawa to strumień sekcji. Czyta się jak dobre CV.
- **Scroll:** ten widok **może scrollować** i to jest celowe — na tym polega przyklejona lewa kolumna (design.md §4).
- **Proporcje:** lewa kolumna 320px, prawa resztę. Poniżej 1024px kolumny się składają, a karta przestaje być przyklejona.

```
┌──────────────┬──────────────────────────┐
│  [ avatar ]  │  WYRÓŻNIONY PROJEKT      │
│              │  ┌────────────────┐┌──  │
│  Krystian    │  │ zrzut ░ opis   ││    │
│  Figiela     │  └────────────────┘└──  │
│  Student ·   │  ──────────────────────  │
│  Data & SW   │  DOŚWIADCZENIE           │
│ [● Otwarty   │  2024 —  Firma · rola    │
│   na staż]   │  ──────────────────────  │
│  Rzeszów     │  UMIEJĘTNOŚCI            │
│  bio         │  [Python] [SQL] …        │
│ [Napisz][CV] │  ──────────────────────  │
│   [gh] [li]  │  EDUKACJA                │
│  [@      ⧉]  │  ──────────────────────  │
│              │  [ zajawka dashboardu ]  │
└──────────────┴──────────────────────────┘
     sticky              scroll
```

**Lewa kolumna — karta tożsamości** (jeden `Tile`, `position: sticky`):

| Element | Zawartość |
|---|---|
| avatar | zdjęcie lub inicjał, zaokrąglony kwadrat; zdjęcie na ciemnym tle, żeby nie odstawało od motywu |
| imię i rola | nagłówek hero + rola pod spodem („Student · Data & Software Developer”); człony się nie łamią, a kropka zaczyna następny człon, więc linia nigdy nie kończy się kropką |
| lokalizacja | „Rzeszów” w osobnej linii pod statusem (`ProfileCard location`, jak na `/maths`) — na końcu roli łamała się na osierocone „· Rzeszów” |
| status | plakietka (pigułka w tle `--status-ok-soft` z obwódką `--status-ok-border`): zielona kropka z pulsowaniem + konkretnie, czego szukam: „Otwarty na staż (Data / Backend)” |
| bio | 2 krótkie zdania o mnie |
| akcje | „Napisz” (pełny akcent) i „Pobierz CV” (EN: „Contact”, „CV” — krótko, żeby zmieściły się w rzędzie z ikonami; PDF z Typst, PL/EN zgodnie z językiem); **kopiowanie e-maila jednym kliknięciem** z potwierdzeniem „Skopiowano ✓” — adres widoczny w całości, obok sam przycisk z ikoną kopiowania (etykieta w `aria-label` i dymku; na `/maths` z napisem „Kopiuj”) |
| social | GitHub i LinkedIn w jednym rzędzie z przyciskami akcji (`ProfileCard inlineSocials`); ikony w kolorze tekstu albo prawdziwe loga. Bez ikony e-maila — adres dają już „Napisz” i pole kopiowania |

**Prawa kolumna — strumień sekcji**, rozdzielonych włosową linią `--border-divider`:

| Sekcja | Zawartość |
|---|---|
| Wyróżniony projekt | jedyna sekcja w ramkach: przewijany w bok pasek kart projektów (`FeaturedCarousel`, kolejna karta wystaje; pod paskiem licznik „1 / 3” i strzałki ‹ ›, które przeskakują o jedną kartę płynnym przewinięciem — bez animacji przy reduced motion — i gasną na końcach; pasek przewijania ukryty, działa też przesunięcie palcem i strzałki klawiatury). Zrzut wypełnia całą kartę, a w prawej kolumnie na gradiencie (przezroczysty do 35%, pełny od 80% — tokeny `--featured-scrim-*`) stoją nazwa →, 1 zdanie, kilka funkcji z ikonami i tagi (funkcje znikają, gdy kolumna tekstu ma mniej niż 320 px); na telefonie karta jest wyższa, gradient idzie w dół, tekst na dole, bez listy funkcji. Karty mają stałą wysokość, także bez zrzutu. Akcja „Wszystkie projekty →” prowadzi do `/projects` |
| Doświadczenie | wiersze `okres · stanowisko · firma` (firma w linii tytułu, szara), pod spodem miejsce i czas trwania (tylko gdy nie widać go z okresu — przy miesiącach wystarczy zakres), a na końcu **jedno** zdanie o tym, co tam robiłem (czynność + technologia, bez listy punktów; o stopień mniejsze, nie ciemniejsze — `--text-subtle` nie ma AA). Ciasno wewnątrz pozycji, duży odstęp między pozycjami, bez linii; okres w mono z `tabular-nums`: miesiące `MM.RRRR–MM.RRRR` dla okresów krótszych niż rok, lata dla dłuższych; akcja „Pełne CV ↗” |
| Umiejętności | wiersze kategorii (Data / ML, Backend, Automatyzacja, Bazy danych, DevOps, Narzędzia): etykieta mono po lewej w kolumnie okresów z Doświadczenia, pigułki z nazwami technologii po prawej |
| Języki | jedna linia: „Polski — ojczysty · Angielski — B1” |
| Edukacja | uczelnia, kierunek, lata — ten sam format wierszy |
| Zajawka Dev Logu | mały kafel na dole: godzina, pogoda i utwór z Last.fm („teraz gra” / „ostatnio”, na żywo z `/api/music`, 4 stany); stopka prowadzi do Dev Logu. Zajawka zachowuje własne dane i zachowanie, również pogodę usuniętą z publicznej siatki |

Sekcje inne niż wyróżniony projekt **nie mają ramek** — dzieli je sama linia. Dzięki temu w prawej kolumnie widać hierarchię, a nie rząd równorzędnych pudełek.

### 3.2 Projekty (`/projects`)

- **Układ: jeden wyróżniony + lista**, na całą szerokość, bez karty profilu. Nie bento: Dev Log i prywatny dashboard korzystają z siatki kafli, a lista wygląda dobrze zarówno z dwoma, jak i z dziesięcioma projektami (w siatce przy kilku projektach widać dziury).
- Nad wszystkim etykieta mono „Projekty · N”.
- **Wyróżniony projekt** (pierwszy wpis z `featured: true` wg `order`): jeden `Tile` — zrzut ekranu po lewej od krawędzi do krawędzi, po prawej etykieta „Wyróżniony · rok” w akcencie (jedyny akcent w widoku), nazwa jak nagłówek hero, jedno zdanie, funkcje z ikonami (`features`), tagi i przyciski (Szczegóły / Kod ↗ / Na żywo — → albo ↗, zależnie od tego, dokąd prowadzi); nazwa też prowadzi do szczegółów. Poniżej 768px składa się w pionie: zrzut nad tekstem.
- **Lista** pozostałych w sekcji dossier („Pozostałe projekty”): te same wiersze co Doświadczenie na wizytówce — rok w mono w kolumnie okresów (`2025–obecnie` dla trwających), tytuł ze strzałką ›, jedno zdanie, tagi, a po prawej miniatura okładki (192 px, 16:10, cały obraz bez kadrowania) i ikony linków (kod, na żywo). Cały wiersz prowadzi do strony szczegółów (tło `--surface-hover` po najechaniu), ikony zostają osobnymi linkami. Na telefonie rok przechodzi nad tytuł, miniatura pod tagi na całą szerokość, a wiersze zostają wierszami.
- **Każda pozycja:** jedno zdanie w schemacie problem → rozwiązanie → efekt, najlepiej z konkretem („używany codziennie”, „3. miejsce na hackathonie”); 2–4 tagi stacku, nie cały stack; linki: kod, demo, opcjonalnie case study.
- Bez kart „W przygotowaniu” — lepiej mniej, dobrze opisanych projektów. Filtry (Backend, Data / ML…) dopiero od ok. 6 projektów.
- Każdy projekt to plik MDX w content collection (`src/content/projects/`, schemat w `src/content.config.ts`): tytuł, rok (+ `ongoing`), zdanie PL/EN, tagi, linki (repo, demo — ścieżka na stronie lub URL), okładka, `featured`, `order`, opcjonalne `features` (ikona + krótki tekst, dla karuzeli), opcjonalny `description` PL/EN (kilka akapitów) i `gallery` (zrzuty z podpisem PL/EN; zrzuty z produkcji w WebP w `src/assets/projects/<slug>/`, bez danych osobowych). Dane dla widoków daje `src/lib/projects.ts`.
- **Strona szczegółów** (`/projects/[slug]` i `/en/projects/[slug]`, `ProjectDetail`) — ma ją każdy projekt: powrót do listy, rok, nazwa, zdanie, tagi, przyciski Kod / Na żywo; **galeria** (`ProjectGallery`: okładka i `gallery` w pasku przewijanym w bok jak karuzela na wizytówce — licznik, ‹ ›, każdy zrzut w tej samej ramce 16:10 z podpisem; klik otwiera lightbox na `<dialog>` z ‹ ›, strzałkami i `Esc`, bez JS link do pełnego pliku); sekcje dossier „O projekcie” (`description` i `features`) oraz „Case study”.
- **Case study** to treść pliku MDX: kontekst, architektura, decyzje, czego się nauczyłem; może zawierać wzory (KaTeX, CSS ładowany tylko tam) i diagramy (Mermaid). Sekcja jest tylko przy niepustej treści. Case study są po polsku — strona EN pokazuje w tym miejscu link do polskiej.
- Wpisy z `featured: true` zasilają karuzelę na wizytówce, a wszystkie wpisy — komendę `open` w terminalu; oba miejsca linkują do strony szczegółów. Dawny kafel `featured` z karuzelą znika z publicznej siatki. Bieżąca praca w Dev Logu jest wybierana ręcznie i opisuje aktualny kierunek prac, zamiast powtarzać podsumowanie projektu.

### 3.3 Korepetycje (`/maths`)

> **Stan (2026-09-25): w przygotowaniu.** Przełącznik `tutoringOpen` w `src/lib/tutoring.ts` jest wyłączony: `/maths` pokazuje tylko kafel „W przygotowaniu” z powrotem na wizytówkę (`noindex`, poza sitemapą), nawigacja wyszarza pozycję, a terminal nie ma katalogu `korepetycje` i komenda odpowiada „w przygotowaniu”. Widok opisany niżej jest gotowy w kodzie (`Maths.astro`) i wraca po ustawieniu `true`.

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

**Lewa kolumna — karta tożsamości:** większe zdjęcie niż na wizytówce (160px — rodzic ma widzieć, kto uczy), imię, rola „Korepetycje z matematyki”, status „Przyjmuję nowych uczniów” (plakietka jak na wizytówce), lokalizacja, jednozdaniowe bio; akcje „Umów darmową lekcję” (pełny akcent, prowadzi do sekcji kontaktu) i „Zadzwoń”; ikony WhatsApp, Messenger, Instagram, e-mail. Bez CV, GitHuba i LinkedIna.

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
- tygodniowa dostępność i rezerwacja online przez Cal.com (embed lub API, decyzja decisions.md);
- opcjonalna sekcja „Zadanie tygodnia” ze wzorem w KaTeX.

### 3.4 Dashboard (`/dashboard`) — publiczny Dev Log i panel prywatny

- **Publiczny Dev Log:** spokojny, osobisty kontekst do CV i projektów, z dominującą kartą bieżącej pracy. Zachowuje ciemne powierzchnie, czerwony akcent, etykiety mono, subtelną poświatę i istniejący `Tile`.
- **Prywatny dashboard:** dotychczasowy gęsty panel operacyjny, bez zmiany układu, danych i ochrony. Mieści się na jednym ekranie od 1280×720 (design.md §4).

| Tryb | Adres PL / EN | Dla kogo | Dostęp |
|---|---|---|---|
| publiczny Dev Log | `/dashboard` / `/en/dashboard` | odwiedzający | otwarty |
| prywatny dashboard | `/dashboard/private` / `/en/dashboard/private` | ja | hasło na serwerze, `ownerGate` i `prerender = false` (patrz security.md) |

Adresy pozostają bez zmian; **Dev Log** jest nazwą w obu wersjach nawigacji. Między trybami przełącza cichy link pod siatką („Widok prywatny” z kłódką / powrót do „Dev Log”). W nawigacji jest tylko tryb publiczny.

**Wprowadzenie publiczne** — nad siatką, teksty przez i18n, jeden `h1`:

| Element | PL | EN |
|---|---|---|
| etykieta mono | `/ DEV LOG` | `/ DEV LOG` |
| nagłówek `h1` | Poza CV. | Beyond the CV. |
| podtytuł | Nad czym pracuję, czego się uczę i co gra w tle. | What I’m building, what I’m learning, and what’s playing in the background. |

**Dokładnie pięć publicznych kafli**, w tej samej kolejności DOM, czytania i przechodzenia klawiaturą na każdym ekranie:

| Kolejność / obszar | Rola | Zawartość |
|---|---|---|
| 1. `build` | Nad czym pracuję / Current work | ręcznie wybrana bieżąca praca, obecnie Telos (plugin do Claude Code, `figielak/telos`): nazwa, jedno zdanie o tym, czym jest projekt, jedno zdanie „W toku: …” o konkretnym zadaniu (nie opis projektu z `/projects`), ostatni commit repozytorium na żywo (`lastCommit` z `/api/github`: komunikat i kiedy, 4 stany), tagi technologii i przycisk „Kod ↗” jak na stronie projektów. Bez karuzeli i kopiowania opisu case study; największa i wizualnie dominująca karta |
| 2. `waka` | Kodowanie / Coding | suma czasu bieżącego tygodnia (od poniedziałku, Europe/Warsaw) i krótki rozkład maksymalnie trzech nazwanych języków z resztą podpisaną „inne X%” (`/api/waka`, dotychczasowe filtrowanie kodu bez Markdownu). Bez słupków dziennych i czasu dziś; pusty tydzień jest poprawnym wynikiem, a brak języków wymaga spokojnego wyjaśnienia, bez sztucznego „Inne 100%” |
| 3. `github` | GitHub | suma kontrybucji z jawnym okresem, roczna mapa aktywności na całą szerokość i link do profilu (`/api/github`). Bez streaka i licznika repozytoriów; to kontekst aktywności, nie ocena produktywności ani liczba commitów |
| 4. `experiment` | Eksperymenty / Experiments | krótko o nauce i celu technicznym, początkowo istniejący homelab; link do opisu projektu zgodny z językiem. Treść redakcyjna oparta na udokumentowanych faktach, bez telemetrii infrastruktury |
| 5. `music` | Po godzinach / After hours | mały akcent osobisty: bieżący lub ostatni utwór z Last.fm (`/api/music`), wykonawca i kompaktowa okładka. Bez top artystów. Opcjonalny 30-sekundowy podgląd iTunes tylko po kliknięciu, bez autoplay; bez URL podglądu nie ma przycisku |

Karta `experiment` i tekst zadania w `build` są utrzymywane ręcznie (`src/lib/dev-log.ts` + i18n), bez CMS; jedyne dane na żywo w `build` to ostatni commit z istniejącego `/api/github`. Ostatni commit, GitHub, WakaTime i muzyka zachowują cztery stany (ładowanie, OK, nieaktualne, błąd) i stały rozmiar między stanami. Zerowa aktywność jest poprawnymi danymi; nieaktualny utwór nie może sugerować, że gra właśnie teraz. Najpierw mock, potem prawdziwe źródła (design.md §6).

**Układ publiczny** — jawne `grid-template-areas`, bez wymuszania wysokości ekranu. Rozmiar kart wynika z treści i hierarchii; odstępy i wysokości tylko z tokenów (design.md §4).

```
≥ 1024px (6 kolumn)
"build build build build waka waka"
"github github github github github github"
"experiment experiment experiment music music music"

640–1023px (4 kolumny)
"build      build      build build"
"waka       waka       waka  waka"
"github     github     github github"
"experiment experiment music music"

< 640px (2 kolumny)
"build      build"
"waka       waka"
"github     github"
"experiment music"
```

Bieżąca praca dominuje treścią i rozmiarem; na desktopie zajmuje cztery z sześciu kolumn. GitHub jest osobnym pasem na całą szerokość, żeby heatmapa miała duże kratki. Na telefonie trzy pierwsze karty zajmują całe rzędy, a eksperymenty i muzyka stoją obok siebie w dwóch kolumnach.

Karty są płaskie i nieprzezroczyste, bez poświaty w tle; każda ma etykietę, jedną główną wartość, 1–2 linie kontekstu i stopkę z akcją (design.md §4). Pod wprowadzeniem jest jedna linia „zaktualizowano X temu”, a kropki w rogach kart pojawiają się tylko przy problemie (design.md §2). Punktem odniesienia jest zajawka Dev Logu na wizytówce: jeden rytm, płaskie tło, jasne separatory. Publiczna strona może scrollować również na desktopie; nie rozciąga kart, by wypełnić viewport.

**Usunięte wyłącznie z publicznej kompozycji:** dzień/zegar, pogoda i powietrze, cel, karuzela wyróżnionych projektów, cztery sociale, książki, odliczanie oraz operacyjny homelab (CPU/RAM/dyski, usługi, transfer i DNS). To historyczny zestaw widgetów dashboardu, a nie dodatkowe karty Dev Logu.

Komponenty i integracje pozostają dostępne dla innych odbiorców. Zajawka na wizytówce nadal pokazuje godzinę, pogodę i muzykę; terminal zachowuje komendy i dane, a edytor celu w panelu prywatnym działa jak dotąd. `/api/github`, `/api/waka` i `/api/music` zachowują kontrakty, także pola niewyświetlane w Dev Logu. Pozostałe dotychczas publiczne endpointy (m.in. `/api/weather`, `/api/air`, `/api/books`, `/api/goal` i `/api/homelab/*`) nie są usuwane ani obejmowane nową ochroną. Usunięcie kafla nie zmienia uprawnień API; granice publiczne i prywatne nadal określa security.md.

**Tryb prywatny** — panel do zarządzania, tylko dla mnie. Statystyk PC nie pokazuję wcale; bieżące statystyki homelabu i nazwy aplikacji z ich stanem pozostają dostępne przez publiczne API, choć nie ma ich w siatce Dev Logu. Prywatnie dochodzą m.in. historia CPU/RAM, szczegóły kontenerów i backup. Jeden ekran od 1280×720; rzędy w połówkach, pasek usług ma jedną.

```
≥ 1024px (6 kolumn, 7 półrzędów)
"svc    svc    svc    svc     svc     svc"          pasek usług, półrząd
"server server server backup  deploy  deploy"   ×2
"site   site   site   lessons lessons lessons"  ×2
"expire expire expire goal    goal    goal"     ×2

640–1023px: svc×4 / server×4 / backup backup deploy deploy / site×4 / lessons lessons expire expire / goal×4
< 640px:    svc / server / deploy / backup / site / lessons / expire / goal (każdy na cały rząd, 2 kolumny)
```

Każdy kafel czyta własny `/api/private/*` za tym samym strażnikiem co strona (security.md); tylko zużycie maszyny idzie z publicznego `/api/homelab/lab`.

| Kafel | Zawartość |
|---|---|
| `svc` | pasek usług w jednej linii: pigułki-linki z `src/lib/services.ts` (domena z `HOMELAB_DOMAIN`, działają tylko przez Tailscale) z kropką up/down i średnim czasem odpowiedzi z Uptime Kumy, dostępność 30 dni w dymku; łączenie po nazwie monitora; `up` to status Kumy inny niż „down” (oczekujący i przerwa techniczna liczą się jako działające, jak w publicznych danych uptime). „AdGuard” łączy trzy monitory (panel, DNS, rewrite), więc jego czas jest orientacyjny. Linki zostają przy błędzie. Przy błędzie lub nieaktualnych danych kropki są szare, a nieaktualny pasek pokazuje wiek danych — tak widać też awarię samej Kumy, która nie zgłosi się sama |
| `server` | CPU i RAM z ostatnich 24 h jako dwa osobne wykresy (co 5 min, neutralna linia z tłem, skala do okrągłej wartości nad maksimum podpisana u góry, przerwa w linii = agent offline; wspólna linia pod kursorem i dymek z godziną i obiema wartościami, opis tekstowy dla czytników ekranu); obok dyski, temperatura i kontenery po nazwie (lista przewija się w kaflu, gdy się nie mieści): kropka stanu (działa i zdrowy / restart, niezdrowy, zatrzymany / pauza), strzałka przy nowszym obrazie (Diun) |
| `backup` | ostatni backup: kiedy, udany czy nie, rozmiar, snapshoty, narzędzie; nieudany, starszy niż 26 h albo brak kopii — na czerwono |
| `deploy` | 3 ostatnie przebiegi workflow deployu z GitHub Actions: kropka statusu (trwający pulsuje, nieudany czerwony), commit, kiedy; wiersz prowadzi do runu |
| `site` | Cloudflare Web Analytics: wizyty z 7 dni jako liczba i słupki (dziś w `--text`), odsłony, top 3 strony i top 3 źródła („bezpośrednio” dla wejść bez referera, własna domena pominięta) |
| `lessons` | korepetycje z Google Calendar (prywatny iCal, lekcje cykliczne rozwijane z `RRULE`): 3 najbliższe lekcje i minione niezapłacone na czerwono z przyciskiem ✓ (znacznik w Firestore, klucz po planowanym terminie, więc przeniesienie go nie gubi) |
| `expire` | co i kiedy wygasa, od najbliższego: domena (RDAP), certyfikat (TLS), tokeny GitHuba (nagłówek API) i Cloudflare (verify), ręczne daty (np. Hardcover) w `src/lib/server/expiring.ts`; ≤ 30 dni lub po terminie na czerwono |
| `goal` | edycja celu: nazwa i termin po lewej, kroki po prawej (odhaczanie, dodawanie, usuwanie, do 8, przewijane w kaflu); przełącznik PL/EN i mały „Zapisz” w nagłówku, potwierdzenie „Zapisano ✓”; EN wraca do PL |

---

## 4. Kafle fun-to-have (po must-have)

Usunięte: now page „Teraz” (zastąpiona edycją celu).

Istniejące integracje: Last.fm (utwór i top artyści), WakaTime, Hardcover i cel (`goal`, edytowany w trybie prywatnym); terminal na całej stronie (design.md §5) i podgląd utworu. Publiczny Dev Log zachowuje tylko uproszczone GitHub, WakaTime i muzykę oraz dwie karty redakcyjne (§3.4). Książki, top artyści i podgląd celu należą do historycznej kompozycji dashboardu; usunięcie ich z tej strony nie usuwa integracji ani komend terminala.

Na później:
- Zdjęcia (fotografia)
- Mini gra (Snake)
- Konami code / ukryty kafel

Odrzucone: mapa podróży, losowy fun fact, licznik kaw, licznik kliknięć.

---

## 5. Co dalej

Fazy prac i bieżący stan prowadzi Telos (`.telos/ROADMAP.md`, `.telos/STATUS.md`), a historię zrobionych kroków — git. Tu zostaje tylko lista otwartych rzeczy na poziomie produktu:

- **Wizytówka:** dopisać do CV więcej konkretów (punkty z liczbami, projekty), gdy przybędzie treści.
- **Projekty:** treści case study (rehype-mermaid dochodzi razem z pierwszym diagramem), kolejne projekty (filtry od ok. 6).
- **Korepetycje:** teksty to szkic, cena do wpisania (`XX zł`); widok czeka za planszą „W przygotowaniu” (`src/lib/tutoring.ts`, §3.3); potem rezerwacja przez Cal.com.
- **Motywy:** jasny i „crazy” (design.md §7).
- **Dev Log:** wdrożyć kontrakt pięciu kart z §3.4, uprościć dane pomocnicze i zachować niezależność panelu prywatnego; zadania prowadzi faza `01-dev-log` w Telos.
- **Kafle:** reszta z §4 — zdjęcia, Snake, Konami code; ewentualne miejsce wymaga osobnej decyzji, bez poszerzania zestawu pięciu kart Dev Logu.
