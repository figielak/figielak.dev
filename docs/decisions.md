# figielak.dev – decyzje

> Otwarte i podjęte decyzje z powodem. Treść zasad żyje w [koncept.md](koncept.md),
> [design.md](design.md), [architecture.md](architecture.md) i [security.md](security.md);
> tu zostaje to, **dlaczego** jest tak, a nie inaczej. Nowa decyzja to nowy wiersz z datą.

---

## Otwarte

- [ ] Framework wysp: na razie czysty TS w `<script>` wystarcza; Preact dopiero, gdy potrzebny stan

---

## Podjęte

| Data | Decyzja | Powód / gdzie |
|---|---|---|
| 2026-09-25 | Domyślny język wizytówki: polski (`/`), angielski pod `/en/` | architecture.md §5 |
| 2026-09-25 | Mono: Geist Mono | design.md §3 |
| 2026-09-25 | Miasto w kaflu pogody: Rzeszów | koncept.md §3.4 |
| 2026-09-25 | Analityka: Cloudflare Web Analytics (nie Umami ani Plausible) | strona i tak stoi za proxy Cloudflare, beacon nie używa ciasteczek, dane czyta GraphQL API |
| 2026-09-25 | Źródło deployów: GitHub Actions API | koncept.md §3.4 |
| 2026-09-25 | Korepetycje: Google Calendar (iCal) + znacznik płatności w kaflu | koncept.md §3.4 |
| 2026-09-25 | Cel edytowany w trybie prywatnym zamiast kafla „Teraz”, który usunięto | koncept.md §4 |
| 2026-09-25 | Treść kafli bez wypełniaczy: wydarzenia w `src/lib/events.ts`, książki z Hardcover, kroki celu ustawiane w trybie prywatnym (`src/lib/goal.ts` to tylko wartość sprzed pierwszego zapisu) | koncept.md §3.4 |
| 2026-09-25 | E-mail i telefon wpisane w źródła CV (`cv/*.typ`) i PDF-y w `public/cv/` | PDF i tak pokazuje je otwartym tekstem, więc ukrywanie ich w repo nic nie daje; na stronach nadal `.env` i base64 (security.md) |
| 2026-09-25 | Korepetycje ukryte za planszą „W przygotowaniu” (`tutoringOpen`) | widok gotowy w kodzie, treści i cena jeszcze nie (koncept.md §3.3) |
| 2026-09-26 | Akcent `#FF2445` zamiast `#E5484D` | żywszy przy tym samym odcieniu, AA z zapasem; porównanie kandydatów na `/dev/accent` |
| 2026-09-26 | Rezerwacja korepetycji: Cal.com | koncept.md §3.3 |
| 2026-09-27 | Publicznie nazwy aplikacji homelaba z ich stanem (bez adresów i czasów odpowiedzi) | nazwy i tak są publiczne na schemacie Homelaba, a stan nie zdradza obecności (security.md) |
| 2026-10-31 | Dev Log czytelniej: płaskie karty bez poświaty, jedna paleta wykresów (akcent zamiast zieleni GitHuba i kolorów Linguist), kropki tylko przy problemie, jedno „zaktualizowano”, GitHub na całą szerokość, w „Nad czym pracuję” zadanie w toku i ostatni commit zamiast opisu projektu | szkło nad poświatą obniżało kontrast, pięć palet i powtórzony opis z `/projects` dawały szum; zajawka na wizytówce czytała się lepiej (koncept.md §3.4, design.md §2–4) |

---

## Bez daty (z pierwszej wersji konceptu)

| Decyzja | Powód |
|---|---|
| Główna struktura to ścieżki, subdomeny `maths.` i `dashboard.` to przekierowania 301 | jeden projekt Astro, wspólne komponenty, jedna domena dla SEO; krótkie adresy do wysyłania ludziom |
| Wizytówka i korepetycje jako dwukolumnowe dossier, nie bento | bento pokazuje wiele równorzędnych rzeczy, a wizytówka ma jedną najważniejszą; siatka równych kafli spłaszczała hierarchię |
| Projekty jako lista „wyróżniony + wiersze”, nie siatka | druga siatka zlewałaby się z dashboardem, projekt potrzebuje więcej tekstu, a przy kilku projektach w siatce widać dziury |
| Bez kart „W przygotowaniu” na liście projektów; filtry dopiero od ok. 6 projektów | lepiej mniej, dobrze opisanych projektów |
| Akcent jest rzadki, kropki stanu czerwone tylko przy problemie | czerwień czyta się jak „błąd”; gdyby świeciła wszędzie, prawdziwy problem zginąłby w tłumie |
| Bez efektu tilt kafli | dublowałby światło przy kursorze i uniesienie, a obrót 3D ze szklanym tłem rozjaśnia poświatę w Chromium |
| Obrót karty „Czytam” płaskim `scaleX`, nie `rotateY` | `rotateY` kafla ze szklanym tłem rozjaśnia poświatę w Chromium |
| WakaTime bez porównania ze średnią i bez Markdownu w językach | spokojna niedziela to nie wiadomość; Markdown to notatki i dokumentacja, nie kod |
| Hosting: Cloud Run w `europe-west1` za Cloudflare | Cloud Run mapuje własne domeny tylko w części regionów (Warszawy wśród nich nie ma) |
| Homelab tylko przez Tailscale, dane wysyła agent (push) | homelab nie jest wystawiony publicznie; Cloud Run skaluje się do zera, więc odczyt trafia do Firestore |
| Prywatny dashboard za HTTP Basic Auth na serwerze | Cloudflare Zero Trust (Access) nie jest dostępny; render na serwerze obejmuje też adres `*.run.app` |
| Bez statystyk PC; DNS bez wykresu godzinowego; historia CPU i RAM tylko prywatnie | zdradzałyby, kiedy jestem przy komputerze albo w domu |
| Satoshi hostowany lokalnie | prawdopodobnie nie ma go w Fontsource |
| Odrzucone kafle: mapa podróży, losowy fun fact, licznik kaw, licznik kliknięć | koncept.md §4 |
