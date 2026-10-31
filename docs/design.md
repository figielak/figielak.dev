# figielak.dev – design

> System wizualny wspólny dla wszystkich widoków: tokeny, kafle, typografia, siatka, ruch.
> Razem z [koncept.md](koncept.md) jest źródłem prawdy; jeśli kod jest z nim sprzeczny, pytaj, zanim zmienisz którekolwiek z nich.

---

## 1. Zasady stylu bento

- **Kafel:**
  - tło `--surface`; na dashboardzie półprzezroczyste `--surface-glass`, przez które prześwituje rozmyta poświata akcentu (`--glow`) — dwie plamy powoli dryfujące pod siatką (`BaseLayout glow`, `BentoLayout alive`);
  - obramowanie 1px `--border`;
  - promień 20px;
  - padding 20px (dashboard: 16px).
- **Struktura każdego kafla:**
  - etykieta (mono, uppercase, szara) u góry;
  - treść lub duża liczba;
  - detal lub akcja na dole.
- **Klikalne kafle** mają strzałkę w prawym górnym albo dolnym rogu. **Strzałki w linkach:** ↗ prowadzi poza stronę (inna domena, plik jak PDF CV), → na inną podstronę tej witryny. Wyjątek: kafle sociali, które w całości są przyciskiem marki (koncept.md §3.4).
- **Hierarchia przez rozmiar:** najważniejsze treści dostają największe kafle.
- **Akcent jest rzadki**, bo czerwień czyta się jak „błąd” — im rzadziej występuje, tym mocniej się wyróżnia. Używam go do:
  - głównych CTA;
  - potwierdzeń i bieżących wpisów (np. „Skopiowano ✓”, „obecnie” w edukacji);
  - pojedynczych wyróżnień w tekście;
  - małych ikon przy etykietach kart (np. logo GitHuba, Last.fm, książka);
  - sygnalizowania prawdziwych problemów (§2);
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

## 2. Kolory

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
| `--accent` | `#FF2445` | akcent: żywa czerwień, kontrast AA na tle (5,1:1 na `--bg`, 4,8:1 na `--surface`) |
| `--accent-hover` | `#FF4560` | akcent po najechaniu |
| `--accent-soft` | `rgb(255 36 69 / 0.12)` | tła wyróżnień, poświaty |
| `--accent-foreground` | `#0E0E10` | tekst i ikony na pełnym tle akcentu (biały miałby tylko 3,8:1) |
| `--status-ok` / `--status-down` | `#46A758` / `--accent` | kropki stanu: działa / problem |
| `--status-ok-soft` / `--status-ok-border` | `--status-ok` z przezroczystością 0.1 / 0.3 | plakietka statusu w karcie profilu |
| `--github-level-1…4` | zielenie GitHuba (ciemny motyw) | wykres kontrybucji; poziom 0 to `--surface-inset` |
| `--brand-*` | gradienty w kolorach marek | kafle sociali (Discord, Instagram, GitHub, LinkedIn), biały tekst `--brand-foreground` z AA |
| `--lang-*` | kolory GitHub Linguist | języki w kaflu WakaTime — kolor treści jak loga (§1); najciemniejsze rozjaśnione |
| `--nav-active` | `rgb(255 36 69 / 0.22)` | tło aktywnej zakładki w nawigacji |
| `--nav-glass` | `rgb(14 14 16 / 0.9)` | tło przyklejonej nawigacji na telefonie (koncept.md §2) |
| `--surface-glass` | `rgb(22 22 24 / 0.55)` | półprzezroczysty kafel na dashboardzie (z rozmyciem tła `--glass-blur`) |
| `--spotlight` | `rgb(255 36 69 / 0.6)` | światło na ramkach kafli wokół kursora (dashboard) |
| `--scrim` / `--scrim-soft` | `rgb(0 0 0 / 0.85)` / `rgb(0 0 0 / 0.5)` | gradient pod tekstem na okładkach (np. muzyka) |
| `--featured-scrim-soft` / `--featured-scrim-solid` | `rgb(15 15 17 / 0.85)` / `rgb(15 15 17)` | gradient pod tekstem na zrzutach projektów; gotowe gradienty `--featured-scrim-side` (z boku) i `--featured-scrim-down` (w dół), §1 |
| `--glow` | `rgb(255 36 69 / 0.28)` | rozmyta poświata pod kaflami dashboardu (tekst `--text-muted` na szkle zostaje ≥ 4,6:1) |

Zasady:
- **Kropki stanu: czerwień tylko przy problemie.** Czerwień czyta się jak „awaria”, więc gdyby świeciła wszędzie, prawdziwy problem zginąłby w tłumie.
  - Kropka w rogu kafla (świeżość danych): świeże dane — `--text-subtle`, bez pulsu; nieaktualne dane i błąd — `--status-down` (czerwień). Kafle, które nie mogą być nieaktualne (zegar, zajawka dashboardu), nie mają kropki.
  - Status rzeczy (usługi, deploy, „online”, „teraz gra”, status na wizytówce): działa — `--status-ok` (zielony); nie działa — `--status-down`; brak danych lub bezczynność — `--text-subtle`.
  - Pulsują tylko rzeczy dziejące się teraz: status na wizytówce („Otwarty na staż”), „teraz gra”, trwający build.
- **Paski** (postęp, CPU/RAM/dysk) mają neutralne wypełnienie `--text-muted`. Paski homelaba robią się czerwone (`--status-down`) od progu zajętości (85%). Bieżący stopień skali powietrza ma kolor `--text`.
- Inne kolory semantyczne (np. skala jakości powietrza) są dozwolone, jeśli poprawiają czytelność — wtedy dodaję je jako tokeny.
- Wykres kontrybucji GitHuba rysuję w oryginalnych zieleniach GitHuba (4 poziomy z ciemnego motywu, tokeny `--github-level-*`) — czyta się jak prawdziwy wykres z profilu.
- Kolor treści (loga, okładki, zdjęcia, grafiki) opisuje §1 „Kolor w treści”.

---

## 3. Typografia

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

## 4. Siatka i responsywność

Reguły poniżej dotyczą **widoku w bento**: dashboardu.
**Wizytówka i korepetycje rządzą się własnymi zasadami** — patrz koncept.md §3.1, §3.3 i podsumowanie na końcu tej sekcji. Projekty to lista (koncept.md §3.2): wiersze dossier na całą szerokość.

- **Kolumny:** dashboard ma 6 kolumn (publiczny mieści się na jednym ekranie od 1440×900 dzięki `xl` i `tall` w `BentoLayout`, które dzielą wysokość ekranu na rzędy).
- **Odstęp między kaflami:** 10px (poza dashboardem 12px).
- **„Mieści się na jednym ekranie”** dotyczy desktopu. Publiczny dashboard mieści się bez scrolla od 1440×900 (docelowy widok), prywatny od 1280×720. Poniżej tego scroll jest dozwolony.
- **Tablet (640–1024px):** dashboard przechodzi z 6 na 4 kolumny.
- **Telefon (<640px):**
  - siatka ma **2 kolumny** i kafle układają się od lewej do prawej, **nigdy jedna kolumna jeden pod drugim**;
  - kafle szersze niż 2 kolumny zwężam do 2;
  - małe kafle (social, zegar, pogoda, CV) zajmują 1×1 parami obok siebie.
- Kolejność kafli na mobile ustawiam jawnie osobnymi `grid-template-areas` dla każdego breakpointu; nie polegam na kolejności w HTML.

**Dossier (wizytówka i korepetycje) — trzy odstępstwa:**

| Reguła bento | Dossier |
|---|---|
| siatka kolumn z `grid-template-areas` | dwie kolumny: 320px + reszta |
| mieści się na jednym ekranie | scrolluje celowo, lewa kolumna jest przyklejona |
| telefon zawsze 2 kolumny | poniżej 1024px jedna kolumna — strumień tekstu w dwóch kolumnach na telefonie byłby nieczytelny |

Wspólne zostają: tokeny, `Tile`, etykiety mono, akcent, hover, focus i `prefers-reduced-motion`.

---

## 5. Interakcje i animacje

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
- **Nawigacja na telefonie** (koncept.md §2): wysuwa się i chowa samym `transform` w ok. 200 ms (`--duration-nav`); przy reduced motion bez animacji.
- **Pulsowanie kropki** (tylko rzeczy dziejące się teraz, patrz §2): łagodne, skala i przezroczystość, około 2s.
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

## 6. Stany kafli z danymi na żywo (obowiązkowe)

Skąd kafle biorą dane: architecture.md §3.

| Stan | Wygląd |
|---|---|
| Ładowanie | szkielet w kształcie docelowej treści, z połyskiem przesuwającym się po kaflu; gdy przyjdą dane, treść płynnie się w niego wkleja |
| OK | dane i szara kropka |
| Nieaktualne (dane starsze niż próg, np. 10 min; GitHub, WakaTime i Hardcover odświeżane co godzinę — 3 h) | dane, czerwona kropka, „aktualizacja X min temu” |
| Błąd lub brak danych | czerwona kropka i spokojny tekst zastępczy (np. „Homelab offline”) |

Kafel nie może zmieniać rozmiaru między stanami. **Najpierw buduję kafle na danych testowych (mock), potem podpinam prawdziwe źródła.**

**Kafle z kilkoma źródłami** (Pogoda: pogoda + powietrze; Homelab: maszyna, usługi, transfer) składają się z sekcji, z których każda ma własne 4 stany. Kropka kafla pokazuje najgorszy stan sekcji; sekcja z błędem pokazuje krótkie „Brak danych”, a „Homelab offline” pojawia się dopiero, gdy padną wszystkie sekcje. „Aktualizacja X min temu” sekcji widać tylko przy nieaktualnych danych.

---

## 7. Motywy

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

## 8. Dostępność

- Kontrast minimum WCAG AA; akcent sprawdzony na `--bg` i `--surface`.
- Nawigacja klawiaturą, `:focus-visible`, teksty alternatywne dla zdjęć, `aria-live="polite"` dla aktualizowanych liczb.
- `prefers-reduced-motion` wyłącza animacje opisane w §5.
