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
| Dashboard | `figielak.dev/dashboard` | głównie ja, a także osoby chcące wiedzieć więcej | dane na żywo: pogoda, czas, GitHub, homelab, muzyka; prywatnie panel: usługi i serwer, backup, deploye, statystyki strony, korepetycje, wygasające rzeczy i edycja celu |

**Decyzja:** główną strukturą są **ścieżki** (jeden projekt Astro, wspólne komponenty, jedna domena dla SEO).
Subdomeny `maths.figielak.dev` i `dashboard.figielak.dev` działają jako **przekierowania 301** na ścieżki (reguły przekierowań w Cloudflare), co daje krótkie adresy do wysyłania ludziom.

Nawigacja: górny pasek w formie pigułki, wspólny dla wszystkich widoków.
- Po lewej: logo `figielak_` — nazwa i migający czerwony kursor `_` jak w terminalu (bez migania przy reduced motion)
- Na środku: Wizytówka · Projekty · Dashboard · Korepetycje
- Po prawej: PL/EN, przycisk terminala `>_` (§8) i przełącznik motywu (nieaktywny, dopóki jest jeden motyw — §12); na `/maths` przełącznik języka jest wyłączony, bo widok jest tylko po polsku
- Na telefonie (<640px) logo i przyciski dzielą górny rząd, a pigułka z linkami zajmuje rząd pod nimi
- Na telefonie (<640px) pasek jest przyklejony do góry ekranu na prawie kryjącym tle (`--nav-glass`, rozmycie `--glass-blur`): chowa się przy przewijaniu w dół i wraca przy pierwszym ruchu w górę (próg 8 px, żeby nie migał), a przy samej górze strony jest zawsze widoczny. Schowany jest `inert`, a fokus w nim go pokazuje. Na desktopie pasek przewija się razem ze stroną.

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
│              │  ┌────────────────┐┌──  │
│  Krystian    │  │ zrzut ░ opis   ││    │
│  Figiela     │  └────────────────┘└──  │
│  Student ·   │  ──────────────────────  │
│  Data & SW   │  DOŚWIADCZENIE           │
│  · Rzeszów   │  2024 —  Firma · rola    │
│ [● Otwarty   │  ──────────────────────  │
│   na staż]   │  UMIEJĘTNOŚCI            │
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
| imię i rola | nagłówek hero + rola pod spodem, z miastem na końcu („Student · Data & Software Developer · Rzeszów”); człony się nie łamią, a kropka zaczyna następny człon, więc linia nigdy nie kończy się kropką |
| status | plakietka (pigułka w tle `--status-ok-soft` z obwódką `--status-ok-border`): zielona kropka z pulsowaniem + konkretnie, czego szukam: „Otwarty na staż (Data / Backend)” |
| bio | 2 krótkie zdania o mnie |
| akcje | „Napisz” (pełny akcent) i „Pobierz CV” (EN: „Contact”, „CV” — krótko, żeby zmieściły się w rzędzie z ikonami; PDF z Typst, PL/EN zgodnie z językiem); **kopiowanie e-maila jednym kliknięciem** z potwierdzeniem „Skopiowano ✓” — adres widoczny w całości, obok sam przycisk z ikoną kopiowania (etykieta w `aria-label` i dymku; na `/maths` z napisem „Kopiuj”) |
| social | GitHub i LinkedIn w jednym rzędzie z przyciskami akcji (`ProfileCard inlineSocials`); ikony w kolorze tekstu albo prawdziwe loga. Bez ikony e-maila — adres dają już „Napisz” i pole kopiowania |

**Prawa kolumna — strumień sekcji**, rozdzielonych włosową linią `--border-divider`:

| Sekcja | Zawartość |
|---|---|
| Wyróżniony projekt | jedyna sekcja w ramkach: przewijany w bok pasek kart projektów (`FeaturedCarousel`, kolejna karta wystaje; pod paskiem licznik „1 / 3” i strzałki ‹ ›, które przeskakują o jedną kartę płynnym przewinięciem — bez animacji przy reduced motion — i gasną na końcach; pasek przewijania ukryty, działa też przesunięcie palcem i strzałki klawiatury). Zrzut wypełnia całą kartę, a w prawej kolumnie na gradiencie (przezroczysty do 35%, pełny od 80% — tokeny `--featured-scrim-*`) stoją nazwa ↗, 1 zdanie, kilka funkcji z ikonami i tagi; na telefonie gradient idzie w dół, tekst na dole, bez listy funkcji. Karty mają stałą wysokość, także bez zrzutu. Akcja „Wszystkie projekty ↗” prowadzi do `/projects` |
| Doświadczenie | wiersze `okres · stanowisko · firma` (firma w linii tytułu, szara), pod spodem miejsce i czas trwania, a na końcu **jedno** zdanie o tym, co tam robiłem (czynność + technologia, bez listy punktów; o stopień mniejsze, nie ciemniejsze — `--text-subtle` nie ma AA). Ciasno wewnątrz pozycji, duży odstęp między pozycjami, bez linii; okres w mono z `tabular-nums`: miesiące `MM.RRRR–MM.RRRR` dla okresów krótszych niż rok, lata dla dłuższych; akcja „Pełne CV ↗” |
| Umiejętności | wiersze kategorii (Backend, Automatyzacja, Bazy danych, DevOps, AI, Narzędzia): etykieta mono po lewej w kolumnie okresów z Doświadczenia, pigułki z nazwami technologii po prawej |
| Języki | jedna linia: „Polski — ojczysty · Angielski — B1” |
| Edukacja | uczelnia, kierunek, lata — ten sam format wierszy |
| Zajawka dashboardu | mały kafel na dole: godzina, pogoda i utwór z Last.fm („teraz gra” / „ostatnio”, na żywo z `/api/music`, 4 stany) — dowód, że dashboard naprawdę działa; stopka „Zobacz dashboard na żywo ↗” |

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
- tygodniowa dostępność i rezerwacja online (np. Cal.com, embed lub API);
- opcjonalna sekcja „Zadanie tygodnia” ze wzorem w KaTeX.

### 3.4 Dashboard (`/dashboard`)

- **Ton:** najbardziej osobisty i gęsty, pełny styl „żywego dashboardu”.
- **Dwa tryby**, na desktopie oba mieszczą się na jednym ekranie (publiczny od 1440×900, §7). Oba mają siatkę 6 kolumn:

| Tryb | Adres | Dla kogo | Dostęp |
|---|---|---|---|
| publiczny | `/dashboard` | odwiedzający | otwarty |
| prywatny | `/dashboard/private` | ja | hasło na serwerze (patrz §14) |

Między trybami przełącza cichy link pod siatką („Widok prywatny” z kłódką / „Widok publiczny”). W nawigacji jest tylko tryb publiczny.

**Tryb publiczny** — karty w różnych kształtach, żeby siatka miała bentowy rytm, a nie równe rzędy:
- to, co opisuje jedną rzecz, jest jedną kartą: czas, słońce i postęp to „Dzień”, pogoda i powietrze to „Pogoda”, a maszyna, usługi, transfer i blokada reklam to jeden „Homelab”;
- kształt wynika z treści: GitHub jest szeroki i niski, bo wykres kontrybucji to długi pasek; muzyka jest wysoka i wąska jak okładka; homelab jest duży, bo ma najwięcej danych;
- wyróżniony projekt dostaje najwięcej miejsca (3 kolumny, połowa wysokości), bo to jedyna karta, która coś „sprzedaje”: zrzut ekranu wypełnia większość karty, nazwa, stack i link mieszczą się w jednym pasku pod nim; kilka projektów to karuzela z kropkami;
- sociale (Discord, Instagram, GitHub, LinkedIn) to cztery małe kafle 2×2: cały kafel jest przyciskiem w kolorach marki (gradient z tokenów `--brand-*`, biały tekst z kontrastem AA), z białym logo (Simple Icons) nad nazwą wersalikami, bez ↗;
- Muzyka, Czytam i projekt przełamują ścianę tekstu obrazem; WakaTime ma dwie kolumny na wykres tygodnia i pasek języków;
- pojedyncza liczba (odliczanie) dostaje mały kafel — na desktopie o wysokości półrzędu, jak sociale;
- cel (nazwa, pasek kroków, następny krok) to wąska karta na jedną kolumnę, po lewej od GitHuba.

Rzędy liczę w połówkach, żeby sociale mogły być o połowę niższe od reszty.

```
≥ 1024px (6 kolumn, 8 półrzędów; jeden ekran od 1440×900)
"day      day      weather  music    lab      lab"    ×2
"goal     github   github   music    lab      lab"    ×2
"featured featured featured dc       ig       books"
"featured featured featured gh       li       books"
"featured featured featured waka     waka     books"
"featured featured featured waka     waka     event"

640–1023px (4 kolumny)
"day day weather music" / "goal github github music" /
"featured ×4" ×2 / "dc ig gh li" / "lab ×4" ×2 /
"event event books books" / "waka waka books books"

< 640px (2 kolumny: szerokie karty na cały rząd, małe parami)
"day day" / "weather music" / "goal goal" / "github github" /
"featured featured" / "dc ig" / "gh li" / "lab lab" / "waka waka" / "event books"
```

| Kafel | Grupa | Zawartość |
|---|---|---|
| `day` | lokalne | czas Europe/Warsaw co sekundę i data; wschód i zachód słońca, długość dnia; paski % dnia, miesiąca i roku — wszystko liczone lokalnie, bez API i bez kropki |
| `weather` | lokalne | dwie sekcje z własnymi stanami: pogoda w Rzeszowie (`/api/weather`, Open-Meteo: temperatura, opis, miasto) i jakość powietrza (`/api/air`, GIOŚ, stacja Al. Piłsudskiego: poziom słownie, skala 6 stopni; PM2.5/PM10 tylko na telefonie i tablecie); jedna stopka pokazuje gorszą z sekcji. Ta sama pogoda jest w zajawce na wizytówce i w komendzie `weather` terminala |
| `github` | praca | liczba kontrybucji, streak, repozytoria, legenda i „X min temu” w jednym rzędzie; pod nimi wykres roku na całą szerokość |
| `featured` | praca | wyróżniony projekt: zrzut ekranu, nazwa, jedno zdanie, stack, „Zobacz ↗”; kilka projektów w karuzeli (`src/lib/featured.ts` — dane testowe do czasu kolekcji projektów, §3.2) |
| `dc` `ig` `gh` `li` | kontakt | linki do profili: kafel w kolorach marki, białe logo i nazwa |
| `waka` | praca | WakaTime, ciemny jak inne kafle, w kolejności ważności: czas dziś (duża liczba) i porównanie ze średnią dni tygodnia; 7 słupków pon–ndz z dzisiejszym w akcencie; pasek języków w kolorach GitHub Linguist (`--lang-*`) z 3 nazwami; suma tygodnia w stopce. W wąskim kaflu najpierw znika porównanie, potem nazwy języków |
| `lab` | homelab | cztery sekcje: **maszyna** (CPU, RAM, każdy dysk osobnym paskiem i GPU, jeśli jest — w %, czerwone od 85% — kontenery, temperatura CPU), **usługi** (uptime hosta; usługi pod ogólnymi nazwami: Media, Pliki, DNS, Kopie — up/down, dostępność z 30 dni jako liczba i pasek od 90%, średni czas odpowiedzi; usługi bez danych zebrane w jedną linię „Brak danych: …”), **transfer** samego homelaba (Wi-Fi Pi, nie całego domu) dziś ↓/↑ i łącznie od pierwszego uruchomienia agenta, **blokada reklam** (zablokowane dziś z liczby zapytań, sumy z 7 dni; AdGuard) |
| `music` | życie | teraz słucham + top 3 artystów tygodnia (Last.fm); okładka jako tło całego kafla pod ciemnym gradientem, tekst na dole. Obok utworu okrągły przycisk ▶/❚❚ puszcza 30-sekundowy podgląd (iTunes Search API, bez klucza — Last.fm nie ma audio); serwer szuka po wykonawcy i tytule i bierze tylko wyraźne dopasowanie, a bez podglądu przycisku nie ma. Dźwięk ładuje się z CDN Apple dopiero po kliknięciu |
| `books` | życie | aktualnie czytane książki z okładkami, na żywo z Hardcover (`/api/books`, półka „Currently Reading”, 4 stany; tytuł i okładka z wybranego wydania); po 3 na stronę, kliknięcie obraca kartę na kolejne 3 (§8), w nagłówku licznik „1/2” z ikoną obrotu zamiast ↗; w wysokim wąskim kaflu (desktop) jedna pod drugą, w małym (telefon) tylko pierwsza ze strony |
| `event` | życie | odliczanie do najbliższego ważnego wydarzenia (`src/lib/events.ts`) |
| `goal` | życie | aktualny cel, edytowany w trybie prywatnym i czytany z Firestore (`/api/goal`) bez deployu; przed pierwszym zapisem `src/lib/goal.ts`: nazwa, termin „do MM.RRRR” w nagłówku, neutralny pasek wykonanych kroków z licznikiem „1/4” i następny krok; w niskim kaflu nazwa i pasek dzielą linię, a następny krok znika pierwszy |

**Tryb prywatny** — panel do zarządzania, tylko dla mnie. Statystyk PC nie pokazuję wcale; statystyki homelabu są publiczne, a w prywatnym dochodzą do nich nazwy usług i kontenerów oraz backup. Jeden ekran od 1280×720; rzędy w połówkach, pasek usług ma jedną.

```
≥ 1024px (6 kolumn, 7 półrzędów)
"svc    svc    svc    svc     svc     svc"          pasek usług, półrząd
"server server server backup  deploy  deploy"   ×2
"site   site   site   lessons lessons lessons"  ×2
"expire expire expire goal    goal    goal"     ×2

640–1023px: svc×4 / server×4 / backup backup deploy deploy / site×4 / lessons lessons expire expire / goal×4
< 640px:    svc / server / deploy / backup / site / lessons / expire / goal (każdy na cały rząd, 2 kolumny)
```

Każdy kafel czyta własny `/api/private/*` za tym samym strażnikiem co strona (§14); tylko zużycie maszyny idzie z publicznego `/api/homelab/lab`.

| Kafel | Zawartość |
|---|---|
| `svc` | pasek usług w jednej linii: pigułki-linki z `src/lib/services.ts` (domena z `HOMELAB_DOMAIN`, działają tylko przez Tailscale) z kropką up/down i średnim czasem odpowiedzi z Uptime Kumy, dostępność 30 dni w dymku; łączenie po nazwie monitora; `up` to status Kumy inny niż „down” (oczekujący i przerwa techniczna liczą się jako działające, jak w sekcji publicznej). „AdGuard” łączy trzy monitory (panel, DNS, rewrite), więc jego czas jest orientacyjny. Linki zostają przy błędzie. Przy błędzie lub nieaktualnych danych kropki są szare, a nieaktualny pasek pokazuje wiek danych — tak widać też awarię samej Kumy, która nie zgłosi się sama |
| `server` | CPU i RAM z ostatnich 24 h jako dwa osobne wykresy (co 5 min, neutralna linia z tłem, skala do okrągłej wartości nad maksimum podpisana u góry, przerwa w linii = agent offline; wspólna linia pod kursorem i dymek z godziną i obiema wartościami, opis tekstowy dla czytników ekranu); obok dyski, temperatura i kontenery po nazwie (lista przewija się w kaflu, gdy się nie mieści): kropka stanu (działa i zdrowy / restart, niezdrowy, zatrzymany / pauza), strzałka przy nowszym obrazie (Diun) |
| `backup` | ostatni backup: kiedy, udany czy nie, rozmiar, snapshoty, narzędzie; nieudany, starszy niż 26 h albo brak kopii — na czerwono |
| `deploy` | 3 ostatnie przebiegi workflow deployu z GitHub Actions: kropka statusu (trwający pulsuje, nieudany czerwony), commit, kiedy; wiersz prowadzi do runu |
| `site` | Cloudflare Web Analytics: wizyty z 7 dni jako liczba i słupki (dziś w `--text`), odsłony, top 3 strony i top 3 źródła („bezpośrednio” dla wejść bez referera, własna domena pominięta) |
| `lessons` | korepetycje z Google Calendar (prywatny iCal, lekcje cykliczne rozwijane z `RRULE`): 3 najbliższe lekcje i minione niezapłacone na czerwono z przyciskiem ✓ (znacznik w Firestore, klucz po planowanym terminie, więc przeniesienie go nie gubi) |
| `expire` | co i kiedy wygasa, od najbliższego: domena (RDAP), certyfikat (TLS), tokeny GitHuba (nagłówek API) i Cloudflare (verify), ręczne daty (np. Hardcover) w `src/lib/server/expiring.ts`; ≤ 30 dni lub po terminie na czerwono |
| `goal` | edycja celu: nazwa i termin po lewej, kroki po prawej (odhaczanie, dodawanie, usuwanie, do 8, przewijane w kaflu); przełącznik PL/EN i mały „Zapisz” w nagłówku, potwierdzenie „Zapisano ✓”; EN wraca do PL |

Na później: `sched` (rozkład zajęć, patrz §14), `visits` i inne z sekcji 13.

---

## 4. Zasady stylu bento

- **Kafel:**
  - tło `--surface`; na dashboardzie półprzezroczyste `--surface-glass`, przez które prześwituje rozmyta poświata akcentu (`--glow`) — dwie plamy powoli dryfujące pod siatką (`BaseLayout glow`, `BentoLayout alive`);
  - obramowanie 1px `--border`;
  - promień 20px;
  - padding 20px (dashboard: 16px).
- **Struktura każdego kafla:**
  - etykieta (mono, uppercase, szara) u góry;
  - treść lub duża liczba;
  - detal lub akcja na dole.
- **Klikalne kafle** mają ikonę ↗ w prawym górnym albo dolnym rogu. Wyjątek: kafle sociali, które w całości są przyciskiem marki (§3.4).
- **Hierarchia przez rozmiar:** najważniejsze treści dostają największe kafle.
- **Akcent jest rzadki**, bo czerwień czyta się jak „błąd” — im rzadziej występuje, tym mocniej się wyróżnia. Używam go do:
  - głównych CTA;
  - potwierdzeń i bieżących wpisów (np. „Skopiowano ✓”, „obecnie” w edukacji);
  - pojedynczych wyróżnień w tekście;
  - małych ikon przy etykietach kart (np. logo GitHuba, Last.fm, książka);
  - sygnalizowania prawdziwych problemów (§5);
  - stonowanej, mocno rozmytej poświaty w tle dashboardu — tło, nie element interfejsu.

  Paski postępu i zajętości oraz skala jakości powietrza są neutralne. Aktywna zakładka w nawigacji ma półprzezroczyste tło akcentu (`--nav-active`), bez animacji.

  Maksymalnie 1–2 kafle na widok mogą mieć pełne akcentowe tło (np. CV, kontakt). W takim kaflu tekst, ikony i kropki są grafitowe (`--accent-foreground`), a `Tile` sam podmienia tokeny tekstu.
- **Ikony interfejsu** (strzałki, akcje): jedna rodzina outline (Tabler), w kolorze tekstu. Wyjątek: ikona przy etykiecie karty (`Tile icon`) jest w kolorze akcentu.
- **Kolor w treści — dozwolony, nie wymagany.** Interfejs (tła, ramki, tekst, akcent) zostaje grafitowy z jednym czerwonym akcentem. Treść może mieć pełny kolor tam, gdzie dodaje życia i informacji:
  - prawdziwe loga marek i technologii w ich kolorach (np. Simple Icons w kolorze marki, logo uczelni, usług);
  - okładki książek i albumów, zdjęcia, zrzuty ekranu projektów;
  - grafiki, ilustracje, mapy, wykresy.

  Zasady: kolor pochodzi z samego assetu (SVG/obraz), a nie z hexów w stylach komponentów; każdy element graficzny ma sensowny tekst alternatywny; nic kolorowego nie może zbić kontrastu tekstu poniżej AA. Tekst obok grafik nadal jest pełnoprawną treścią — grafika uzupełnia, nie zastępuje.
- **Zdjęcia, okładki i zrzuty ekranu** mogą leżeć pod tekstem na ciemnym gradiencie (scrim) — u dołu albo z boku, po stronie tekstu:
  - gradient zaczyna się przezroczysty i pod tekstem dochodzi do pełnego krycia (wzór: przezroczysty do 35%, `--featured-scrim-soft` na 60%, `--featured-scrim-solid` od 80%); słaby gradient na ruchliwym obrazie (zrzuty, wykresy) nie wystarcza, bo spod tekstu przebijają liczby i kratki;
  - tekst na gradiencie musi mieć kontrast AA niezależnie od obrazka — stąd pełne krycie pod tekstem, a nie tylko przyciemnienie;
  - kolory gradientu tylko z tokenów (`--scrim*`, `--featured-scrim-*`), nigdy hex/rgb w komponencie;
  - przykłady: okładka w kaflu muzyki (gradient u dołu), karty wyróżnionych projektów na wizytówce (gradient z boku, na telefonie u dołu).

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
| `--border-divider` | `rgb(255 255 255 / 0.15)` | włosowa linia między sekcjami dossier |
| `--text` | `#EDEDEF` | tekst główny |
| `--text-muted` | `#8B8B92` | opisy, etykiety |
| `--text-subtle` | `#5C5C63` | najmniej ważne detale |
| `--accent` | `#E5484D` | akcent: stonowana czerwień, kontrast AA na tle |
| `--accent-hover` | `#EC5D5E` | akcent po najechaniu |
| `--accent-soft` | `rgb(229 72 77 / 0.12)` | tła wyróżnień, poświaty |
| `--accent-foreground` | `#0E0E10` | tekst i ikony na pełnym tle akcentu (biały miałby tylko 3,9:1) |
| `--status-ok` / `--status-down` | `#46A758` / `--accent` | kropki stanu: działa / problem |
| `--status-ok-soft` / `--status-ok-border` | `--status-ok` z przezroczystością 0.1 / 0.3 | plakietka statusu w karcie profilu |
| `--github-level-1…4` | zielenie GitHuba (ciemny motyw) | wykres kontrybucji; poziom 0 to `--surface-inset` |
| `--brand-*` | gradienty w kolorach marek | kafle sociali (Discord, Instagram, GitHub, LinkedIn), biały tekst `--brand-foreground` z AA |
| `--lang-*` | kolory GitHub Linguist | języki w kaflu WakaTime — kolor treści jak loga (§4); najciemniejsze rozjaśnione |
| `--nav-active` | `rgb(229 72 77 / 0.22)` | tło aktywnej zakładki w nawigacji |
| `--nav-glass` | `rgb(14 14 16 / 0.9)` | tło przyklejonej nawigacji na telefonie (§2) |
| `--surface-glass` | `rgb(22 22 24 / 0.55)` | półprzezroczysty kafel na dashboardzie (z rozmyciem tła `--glass-blur`) |
| `--spotlight` | `rgb(229 72 77 / 0.6)` | światło na ramkach kafli wokół kursora (dashboard) |
| `--scrim` / `--scrim-soft` | `rgb(0 0 0 / 0.85)` / `rgb(0 0 0 / 0.5)` | gradient pod tekstem na okładkach (np. muzyka) |
| `--featured-scrim-soft` / `--featured-scrim-solid` | `rgb(15 15 17 / 0.85)` / `rgb(15 15 17)` | gradient pod tekstem na zrzutach projektów; gotowe gradienty `--featured-scrim-side` (z boku) i `--featured-scrim-down` (w dół), §4 |
| `--glow` | `rgb(229 72 77 / 0.35)` | rozmyta poświata pod kaflami dashboardu (tekst `--text-muted` na szkle zostaje ≥ 4,6:1) |

Zasady:
- **Kropki stanu: czerwień tylko przy problemie.** Czerwień czyta się jak „awaria”, więc gdyby świeciła wszędzie, prawdziwy problem zginąłby w tłumie.
  - Kropka w rogu kafla (świeżość danych): świeże dane — `--text-subtle`, bez pulsu; nieaktualne dane i błąd — `--status-down` (czerwień). Kafle, które nie mogą być nieaktualne (zegar, zajawka dashboardu), nie mają kropki.
  - Status rzeczy (usługi, deploy, „online”, „teraz gra”, status na wizytówce): działa — `--status-ok` (zielony); nie działa — `--status-down`; brak danych lub bezczynność — `--text-subtle`.
  - Pulsują tylko rzeczy dziejące się teraz: status na wizytówce („Otwarty na staż”), „teraz gra”, trwający build.
- **Paski** (postęp, CPU/RAM/dysk) mają neutralne wypełnienie `--text-muted`. Paski homelaba robią się czerwone (`--status-down`) od progu zajętości (85%). Bieżący stopień skali powietrza ma kolor `--text`.
- Inne kolory semantyczne (np. skala jakości powietrza) są dozwolone, jeśli poprawiają czytelność — wtedy dodaję je jako tokeny.
- Wykres kontrybucji GitHuba rysuję w oryginalnych zieleniach GitHuba (4 poziomy z ciemnego motywu, tokeny `--github-level-*`) — czyta się jak prawdziwy wykres z profilu.
- Kolor treści (loga, okładki, zdjęcia, grafiki) opisuje §4 „Kolor w treści”.

---

## 6. Typografia

- **Główny font:** Satoshi w grubościach 400, 500 i 700, logo w nawigacji 900. Wersja variable (jeden plik, oś 300–900).
  Satoshi pochodzi z Fontshare i prawdopodobnie nie ma go w Fontsource, więc hostuję go lokalnie (woff2, `font-display: swap`, preload).
- **Mono:** Geist Mono (variable) przez Fontsource. Używam go do etykiet, liczb, statystyk, dat i terminala.
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
  - dashboard ma 6 kolumn (publiczny mieści się na jednym ekranie od 1440×900 dzięki `xl` i `tall` w `BentoLayout`, które dzielą wysokość ekranu na rzędy).
- **Odstęp między kaflami:** 12px (dashboard: 10px).
- **„Mieści się na jednym ekranie”** dotyczy desktopu. Publiczny dashboard mieści się bez scrolla od 1440×900 (docelowy widok), prywatny od 1280×720. Poniżej tego scroll jest dozwolony.
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
- **Hover na nieklikalnym kaflu (tylko dashboard):** mniejszy niż klikalny — obramowanie `--border-hover` i uniesienie o 1px (`--lift-subtle`), bez cienia i zmiany tła.
- **Intro dashboardu** (`src/scripts/intro.ts`, ok. 1,5 s; przy pierwszym wejściu w sesji i przy każdym kliknięciu „Dashboard” w nawigacji; bez intro przy reduced motion):
  - kafle wjeżdżają kolejno po przekątnej od lewego górnego rogu, lekko z dołu; rozmycie tylko od 1024 px (na telefonach mogłoby przycinać);
  - zaraz po pojawieniu się kafla ruszają animacje w środku: kratki GitHuba zapalają się falą od lewej, paski rosną od zera, liczby odliczają od 0 (1,2 s), okładka Muzyki się wyostrza;
  - kafel czekający na dane odgrywa swoje animacje, gdy dane przyjdą;
  - logo `figielak` wpisuje się litera po literze, potem zaczyna migać kursor;
  - animowane jest tylko `opacity` i `transform`.
- **Poświata dashboardu:** plamy dryfują w cyklach ok. 48 i 62 s.
- **Światło przy kursorze (dashboard, tylko mysz):** ramki kafli w zasięgu kursora (`--spotlight-size`) lekko czerwienieją, także sąsiednich; światło płynie za kursorem z lekkim opóźnieniem jak fala (`src/scripts/spotlight.ts`). Bez kafla akcentowego; przy reduced motion bez opóźnienia.
- **Obrót karty (Czytam):** kafel zwęża się do krawędzi, podmienia treść i rozszerza z powrotem (ok. 0,3 s). Płaski `scaleX`, nie `rotateY` — obrót 3D kafla ze szklanym tłem rozjaśnia poświatę w Chromium. Przy reduced motion treść zmienia się bez animacji.
- **Nawigacja na telefonie** (§2): wysuwa się i chowa samym `transform` w ok. 200 ms (`--duration-nav`); przy reduced motion bez animacji.
- **Pulsowanie kropki** (tylko rzeczy dziejące się teraz, patrz §5): łagodne, skala i przezroczystość, około 2s.
- **Focus:** widoczny ring w kolorze akcentu (`:focus-visible`).
- **`prefers-reduced-motion`:** wyłącza unoszenie, pulsowanie, dryf poświaty i animacje wejścia.

**Terminal** (na całej stronie, `src/components/ui/Terminal.astro` + `src/scripts/terminal/`):
- otwiera go klawisz `` ` `` (poza polami tekstowymi) albo przycisk `>_` w nawigacji — jedyna droga na ekranach dotykowych; zamyka ponownie `` ` ``, `Esc`, klik w tło lub `exit`;
- panel zjeżdża z góry (ok. 45% wysokości, na telefonie 70%), tło kafla, reszta strony przyciemniona i zablokowana; fokus wraca tam, skąd przyszedł;
- komendy to osobne moduły w `src/scripts/terminal/commands/` — nowa komenda to nowy plik; teksty w i18n (`term.*`);
- komendy z danymi czytają te same `/api/*` co kafle i przy błędzie piszą spokojne „<źródło>: brak danych”;
- output i historia zostają w `sessionStorage` na czas sesji; podpowiedź `` ` TERMINAL `` w stopce dashboardu (ukryta na dotyku).

Bez efektu tilt (przechylania kafli w 3D za kursorem): dublowałby światło przy kursorze i uniesienie, a obrót 3D ze szklanym tłem rozjaśnia poświatę w Chromium.

---

## 9. Dane na żywo

### Architektura

- Strona jest **statyczna domyślnie** (Astro). Kafle z danymi na żywo to małe wyspy w czystym TS (`<script>` + `src/scripts/live.ts`, bez frameworka): kafel z propem `endpoint` renderuje się w stanie ładowania i sam dociąga dane w przeglądarce.
- Dane pobieram przez własne endpointy `/api/*` na serwerze Node w Cloud Run (Astro + `@astrojs/node`, trasy z `prerender = false`; wzór: `src/pages/api/health.ts`). Z przeglądarki **nigdy** nie odpytuję zewnętrznych API z kluczem.
- Tokeny i klucze trzymam w **Secret Manager** i przekazuję do Cloud Run jako zmienne środowiskowe.
- Cache odpowiedzi jest w pamięci instancji (`src/lib/server/cache.ts`); po zimnym starcie pierwsze żądanie pobiera dane od nowa.

| Dane | Źródło | Odświeżanie / cache |
|---|---|---|
| Pogoda | Open-Meteo (bez klucza), centrum Rzeszowa; nieaktualne po 45 min | cache 15 min |
| GitHub | GitHub GraphQL API (token po stronie serwera) | cache 1h |
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
| Rozkład zajęć | plik iCal (np. eksport z USOS, jeśli uczelnia go udostępnia) | cache 1h |
| Teraz słucham / top artyści | Last.fm API | cache 30 s / 1h |
| Podgląd utworu (30 s) | iTunes Search API (bez klucza), razem z utworem z Last.fm | ostatnie wyszukiwanie do zmiany utworu |
| WakaTime | WakaTime API | cache 1h |
| Czytam | Hardcover GraphQL API (token z zakresem `read:library` po stronie serwera; Hardcover nie pozwala używać go w przeglądarce); nieaktualne po 3 h | cache 1h |

### Homelab: model push

- Homelab jest dostępny **tylko przez Tailscale**. Nie wystawiam go publicznie i nie wystawiam endpointów Homepage/Homarr.
- Agent na homelabie (kontener Dockera w osobnym repo homelaba, `network_mode: host`) co 60 s zbiera dane z `/proc`, AdGuarda i Uptime Kumy i wysyła zanonimizowany JSON:
  - metodą POST na `/api/stats`, z tokenem `Authorization: Bearer` (`STATS_PUSH_TOKEN`);
  - w sekcjach publicznych tylko liczby i ogólne rodzaje (`dns`, `media`…) — nazwy hostów, domeny, IP i nazwy monitorów zostają na Pi;
  - sekcje prywatne (`monitors`, `containers`, `backup`) niosą nazwy monitorów i kontenerów — same słowa, bez kropek, dwukropków i ukośników, więc nie przejdzie przez nie host, domena, URL ani IP; trafiają do osobnego dokumentu `homelab/private`, czytanego tylko przez `/api/private/homelab/*`;
  - kontrakt (v1) opisuje `src/lib/server/homelab.ts`.
- Sekcje (`lab`, `dns`, `traffic`, `services`) są niezależne: agent pomija tę, której źródło nie odpowiedziało, a endpoint odrzuca tylko błędną sekcję. Każda ma własny czas, więc przy awarii jednego źródła szarzeje tylko jego kafel.
- Endpoint zapisuje ostatni odczyt w **Firestore** (jeden dokument, REST bez biblioteki klienta). Kafle czytają go przez `/api/homelab/{lab,dns,net,uptime}` (cache 30 s) i odświeżają się co około minutę.
- **Limity zapisu:** Cloud Run skaluje się do zera i nie trzyma stanu w pamięci, więc odczyt musi trafić do bazy. Darmowy Firestore daje 20 tys. zapisów dziennie; wysyłka co 60 s to ok. 1440 zapisów.

### Stany każdego kafla z danymi na żywo (obowiązkowe)

| Stan | Wygląd |
|---|---|
| Ładowanie | szkielet w kształcie docelowej treści, z połyskiem przesuwającym się po kaflu; gdy przyjdą dane, treść płynnie się w niego wkleja |
| OK | dane i szara kropka |
| Nieaktualne (dane starsze niż próg, np. 10 min; GitHub, WakaTime i Hardcover odświeżane co godzinę — 3 h) | dane, czerwona kropka, „aktualizacja X min temu” |
| Błąd lub brak danych | czerwona kropka i spokojny tekst zastępczy (np. „Homelab offline”) |

Kafel nie może zmieniać rozmiaru między stanami. **Najpierw buduję kafle na danych testowych (mock), potem podpinam prawdziwe źródła.**

**Kafle z kilkoma źródłami** (Pogoda: pogoda + powietrze; Homelab: maszyna, usługi, transfer) składają się z sekcji, z których każda ma własne 4 stany. Kropka kafla pokazuje najgorszy stan sekcji; sekcja z błędem pokazuje krótkie „Brak danych”, a „Homelab offline” pojawia się dopiero, gdy padną wszystkie sekcje. „Aktualizacja X min temu” sekcji widać tylko przy nieaktualnych danych.

---

## 10. Stack i narzędzia

- **Astro + MDX** z content collections dla projektów.
- **Tailwind v4:** tokeny w `@theme`, zgodnie z sekcją 5.
- **Fontsource** dla Geist Mono; Satoshi hostowany lokalnie.
- **Sätteri (`@astrojs/markdown-satteri`) + KaTeX:** wzory w projektach i na `/maths`. Sätteri parsuje matematykę (`features: { math: true }`), a własny plugin `src/plugins/katex.js` renderuje ją KaTeX-em przy buildzie. CSS KaTeX ładuję tylko na stronach, które go używają.
- **rehype-mermaid** (jeszcze niezainstalowany, przyjdzie z krokiem 3 w §16): diagramy w projektach. Domyślnie renderuje przy buildzie przez Playwright. Build idzie w GitHub Actions (obraz Dockera dostaje gotowy `dist/`), więc wystarczy doinstalować tam przeglądarkę; w razie problemów przechodzę na renderowanie po stronie klienta.
- **Typst:** źródło CV (`cv/cv-pl.typ`, `cv/cv-en.typ`), kompilowane do PDF w `public/cv/`. Kompilacja lokalnie lub w CI. Katalogów `cv/` i `public/cv/` jeszcze nie ma.
- **Hosting:** **Google Cloud Run** (`europe-west1`, skalowanie do zera) za **Cloudflare**.
  - Cloud Run uruchamia kontener z `Dockerfile`: prerenderowane strony + serwer Node dla `/api/*`.
  - Cloudflare zostaje z przodu jako DNS z proxy: SSL Full (strict), przekierowania 301 subdomen, cache `/_astro/*`, limit żądań do trybu prywatnego.
  - Region `europe-west1`, bo Cloud Run mapuje własne domeny tylko w części regionów (Warszawy wśród nich nie ma).
  - Deploy: GitHub Actions przy pushu na `master` (`.github/workflows/deploy.yml`, Workload Identity Federation, bez kluczy JSON). Jednorazowa konfiguracja: `docs/deploy.md`.
- **Analityka:** Cloudflare Web Analytics — strona i tak stoi za proxy Cloudflare, beacon nie używa ciasteczek, a dane czyta GraphQL API.
- **Homelab:** Homepage lub Homarr, dostępne tylko przez Tailscale.

Struktura (✱ — jeszcze nie istnieje):

```
src/
  assets/        # avatar, okładki książek, loga marek, zrzuty projektów
  components/
    ui/          # Tile, TileLabel, LiveDot, Pill, IconLink, Nav, BentoLayout,
                 # Dossier, ProfileCard, FeaturedCarousel, Terminal…
    tiles/       # każdy kafel jako osobny komponent (homelab/ — jego sekcje)
    views/       # treść widoków, wspólna dla PL i EN
  layouts/       # BaseLayout
  lib/           # dane statyczne (featured, books, events, services, contact)
    mocks/       # dane testowe i typy kafli na żywo
    server/      # klienci API, cache, Firestore, kontrakt homelaba
  pages/
    index.astro  maths.astro  dashboard.astro  dashboard/private.astro
    projects/    # index.astro, [slug].astro ✱
    en/          # te same widoki po angielsku (bez /maths)
    dev/         # galeria stanów kafli /dev/tiles (tylko w dev)
    api/         # endpointy danych na żywo
  content/projects/*.mdx ✱
  plugins/       # katex.js
  scripts/       # live.ts, intro.ts, spotlight.ts, terminal/
  i18n/          # pl.json, en.json
  styles/        # tokens.css, global.css
public/
  fonts/  cv/ ✱
cv/ ✱            # źródła Typst
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

Usunięte: now page „Teraz” (zastąpiona edycją celu).

Zrobione: top artyści, teraz słucham (Last.fm), WakaTime, książki, aktualny cel (`goal`, edytowany w trybie prywatnym), terminal na całej stronie (§8) i podgląd utworu w kaflu Muzyki (zamiast osobnego odtwarzacza, §3.4).

Na później:
- Zdjęcia (fotografia)
- Mini gra (Snake)
- Konami code / ukryty kafel

Odrzucone: mapa podróży, losowy fun fact, licznik kaw, licznik kliknięć.

---

## 14. Prywatność i bezpieczeństwo

- **Repozytorium jest publiczne** (`github.com/figielak/figielak.dev`). Wszystko, co trafia do commita — także do historii — jest jawne. Dlatego:
  - dane osobowe (telefon, e-mail kontaktowy, adres), nazwy hostów i domeny homelabu, nazwa tailnetu, adresy IP, tokeny i klucze **nigdy** nie trafiają do kodu, dokumentacji ani wiadomości commitów;
  - wartości potrzebne przy buildzie czytam ze zmiennych środowiskowych: lokalnie z `.env` (poza gitem), w CI z GitHub Secrets; lista kluczy jest w `.env.example`, a kod ma neutralne wypełniacze, żeby build działał bez nich;
  - sekrety serwera (`/api/*`) są w Secret Manager, nie w repo i nie w GitHub Variables;
  - zanim zrobię commit, sprawdzam diff pod kątem powyższych danych; jeśli coś wycieknie, przepisuję historię i od razu zmieniam ujawniony sekret.
- **Rozkład zajęć** zdradza, gdzie i kiedy jestem, a strona z korepetycjami jest publiczna. Publicznie pokazuję tylko ogólną formę (np. „zajęcia do 14:00” lub „dziś wolne”) albo ukrywam kafel.
- **Statystyk PC** nie pokazuję wcale — zdradzałyby, kiedy jestem przy komputerze. **Statystyki homelabu, uptime i ruch DNS** są publiczne: to serwer, który działa cały czas, więc nie zdradzają mojej obecności. Pokazuję tylko liczby i ogólne nazwy usług, a DNS jako sumy dzienne i tygodniowe — bez wykresu godzinowego, z którego widać, kiedy jestem w domu.
- **Prywatny dashboard** (`/dashboard/private` i `/en/dashboard/private`) chroni **hasło sprawdzane na serwerze** (HTTP Basic Auth, `src/lib/owner.ts`). Cloudflare Zero Trust (Access) nie jest dostępny.
  - Strony prywatne renderuje serwer (`prerender = false`), a nie plik statyczny. Dzięki temu sprawdzenie obejmuje każdą odmianę ścieżki i adres `*.run.app`, który omija Cloudflare.
  - Hasło (`DASHBOARD_PASSWORD`) jest w Secret Manager i trafia do Cloud Run jako zmienna środowiskowa przy starcie, nie przy buildzie. Bez hasła serwer odmawia wszystkim (poza `astro dev`).
  - Hasło jest długie i losowe. Reguła rate limiting w Cloudflare ogranicza próby zgadywania.
  - Odpowiedzi mają `Cache-Control: private, no-store`. Strony mają `noindex` i nie trafiają do sitemapy.
  - Ten sam strażnik chroni prywatne endpointy (`/api/private/*`), a ich odpowiedzi też mają `private, no-store`. Zapisy (`POST`) przyjmują tylko `application/json`, więc obca strona nie wyśle ich ani formularzem, ani `fetch` bez preflightu CORS.
  - Imiona uczniów z kalendarza pojawiają się tylko w tych odpowiedziach.
  - Historia CPU i RAM jest tylko prywatna: z jej rytmu widać, kiedy ktoś korzysta z serwera w domu — z tego samego powodu co brak godzinowego wykresu DNS.
- **Linki do homelabu** (prawdziwe nazwy hostów) są tylko w trybie prywatnym i działają wyłącznie przez Tailscale. W trybie publicznym pokazuję ogólne etykiety.
- **Tokeny i klucze** trzymam wyłącznie w zmiennych środowiskowych po stronie serwera. Endpoint `/api/stats`:
  - wymaga tokenu (`STATS_PUSH_TOKEN`, porównanie w stałym czasie);
  - ma limit żądań (reguła w Cloudflare, docs/deploy.md);
  - waliduje dane: znane wersje, zakresy liczb, tylko znane rodzaje; do bazy trafiają wyłącznie znane pola.

---

## 15. Dostępność i wydajność

- Kontrast minimum WCAG AA; akcent sprawdzony na `--bg` i `--surface`.
- Nawigacja klawiaturą, `:focus-visible`, teksty alternatywne dla zdjęć, `aria-live="polite"` dla aktualizowanych liczb.
- Domyślnie zero JS; JS tylko w kaflach na żywo i interaktywnych.
- Obrazy przez `astro:assets` (AVIF/WebP, właściwe rozmiary).
- Cel: Lighthouse 95+ na wizytówce.

---

## 16. Kolejność prac

Stan na 2026-09-25: ✅ zrobione · 🟡 w toku · ⬜ nie zaczęte.

1. ✅ **Fundament:** tokeny, fonty, `Tile` i komponenty UI, nawigacja, szkielet i18n, szkielet widoków.
2. 🟡 **Wizytówka:** układ dossier, tożsamość, doświadczenie (prawdziwe pozycje), edukacja, umiejętności, języki, zdjęcie, linki, kopiowanie e-maila, wyróżnione projekty (karuzela z `src/lib/featured.ts`, ta sama lista co na dashboardzie), zajawka dashboardu (pogoda i muzyka na żywo) — gotowe. Zostało:
   - CV z Typst (`cv/` → `public/cv/`) — linki „Pobierz CV” i „Pełne CV” dają 404.
3. ⬜ **Projekty:** content collection, lista, strona projektu, KaTeX (plugin gotowy, CSS jeszcze nigdzie nieładowany), Mermaid, karuzela featured z kolekcji. Jest tylko szkielet `/projects` z pustymi kartami.
4. 🟡 **Korepetycje:** dossier z mini-bento, szybki kontakt, pasek na telefonie — gotowe. Teksty to szkic, cena do wpisania (`XX zł`).
5. ✅ **Dashboard na danych testowych:** tryb publiczny i prywatny, wszystkie kafle w 4 stanach (`/dev/tiles`). Publiczny przebudowany na karty w różnych kształtach z wyróżnionym projektem i socialami (§3.4); projekt na danych testowych do czasu kolekcji projektów.
6. 🟡 **Dane na żywo:** infrastruktura gotowa — Cloud Run za Cloudflare, deploy z GitHub Actions, serwer `/api/*` (`/api/health`), tryb prywatny za hasłem. Na żywo na produkcji: GitHub (`/api/github`), Last.fm (`/api/music`), WakaTime (`/api/waka`) i homelab (agent na Pi → `POST /api/stats` → Firestore → `/api/homelab/{lab,dns,net,uptime}`). Gotowe w kodzie, czekają na deploy: pogoda (`/api/weather`), powietrze (`/api/air`), podgląd utworu w `/api/music` i książki z Hardcover (`/api/books`). Tryb prywatny przebudowany na panel (§3.4): usługi, serwer, backup, deploye, statystyki, korepetycje, wygasające rzeczy i edycja celu — w kodzie; na żywo po deployu i dodaniu kluczy: deploye (GitHub), wygasa (RDAP, TLS); czekają na konfigurację: Cloudflare Web Analytics, iCal korepetycji, a po stronie agenta sekcje `monitors`, `containers` i `backup` (restic jeszcze nie działa).
7. 🟡 **Dodatki:** kafle fun-to-have dla części z §13 są już na dashboardzie (muzyka z podglądem utworu, książki, odliczanie, cel, cel z edycją w trybie prywatnym). Gotowe: terminal na całej stronie, intro dashboardu, poświata, światło przy kursorze, obrót karty (§8). Nie zaczęte: jasny motyw, motyw „crazy”, rezerwacja na `/maths`, reszta kafli z §13 (zdjęcia, Snake, Konami code).

---

## 17. Otwarte decyzje

- [ ] Źródło rozkładu zajęć i poziom szczegółowości publicznie
- [ ] Narzędzie do rezerwacji korepetycji (Cal.com / własne)
- [ ] Lista wydarzeń w odliczaniu, książek w „Czytam” i kroków celu (na razie wypełniacze)
- [ ] Framework wysp: na razie czysty TS w `<script>` wystarcza; Preact dopiero, gdy potrzebny stan

Podjęte (2026-09-25):
- [x] Domyślny język wizytówki: polski (`/`), angielski pod `/en/`
- [x] Akcent zostaje `#E5484D`
- [x] Mono: Geist Mono
- [x] Miasto w kaflu pogody: Rzeszów
- [x] Analityka: Cloudflare Web Analytics (nie Umami ani Plausible)
- [x] Źródło deployów: GitHub Actions API
- [x] Korepetycje: Google Calendar (iCal) + znacznik płatności w kaflu
- [x] Cel edytowany w trybie prywatnym (zamiast kafla „Teraz”, który usunięto)
