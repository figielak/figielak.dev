# figielak.dev – prywatność i bezpieczeństwo

> Co może trafić do publicznego repo i na publiczną stronę, a co zostaje prywatne. Sprawdzaj przed każdym commitem.
> Razem z [koncept.md](koncept.md) jest źródłem prawdy; jeśli kod jest z nim sprzeczny, pytaj, zanim zmienisz którekolwiek z nich.

---

## Zasady

- **Repozytorium jest publiczne** (`github.com/figielak/figielak.dev`). Wszystko, co trafia do commita — także do historii — jest jawne. Dlatego:
  - dane osobowe (telefon, e-mail kontaktowy, adres), nazwy hostów i domeny homelabu, nazwa tailnetu, adresy IP, tokeny i klucze **nigdy** nie trafiają do kodu, dokumentacji ani wiadomości commitów;
  - **wyjątek (decyzja 2026-09-25):** e-mail i telefon są wpisane w źródła CV (`cv/*.typ`) i w PDF-y w `public/cv/` — PDF i tak pokazuje je otwartym tekstem, więc ukrywanie ich w repo nic nie daje. Na stronach nadal idą przez `.env` i base64;
  - wartości potrzebne przy buildzie czytam ze zmiennych środowiskowych: lokalnie z `.env` (poza gitem), w CI z GitHub Secrets; lista kluczy jest w `.env.example`, a kod ma neutralne wypełniacze, żeby build działał bez nich;
  - sekrety serwera (`/api/*`) są w Secret Manager, nie w repo i nie w GitHub Variables;
  - zanim zrobię commit, sprawdzam diff pod kątem powyższych danych; jeśli coś wycieknie, przepisuję historię i od razu zmieniam ujawniony sekret.
- **Statystyk PC** nie pokazuję wcale — zdradzałyby, kiedy jestem przy komputerze. **Statystyki homelabu, uptime i ruch DNS** są publiczne: to serwer, który działa cały czas, więc nie zdradzają mojej obecności. Pokazuję liczby, nazwy aplikacji z ich stanem (decyzja 2026-09-27: nazwy i tak są publiczne na schemacie Homelaba, a stan nie zdradza obecności) — bez adresów i czasów odpowiedzi — a DNS jako sumy dzienne i tygodniowe — bez wykresu godzinowego, z którego widać, kiedy jestem w domu.
- **Prywatny dashboard** (`/dashboard/private` i `/en/dashboard/private`) chroni **hasło sprawdzane na serwerze** (HTTP Basic Auth, `src/lib/owner.ts`). Cloudflare Zero Trust (Access) nie jest dostępny.
  - Strony prywatne renderuje serwer (`prerender = false`), a nie plik statyczny. Dzięki temu sprawdzenie obejmuje każdą odmianę ścieżki i adres `*.run.app`, który omija Cloudflare.
  - Hasło (`DASHBOARD_PASSWORD`) jest w Secret Manager i trafia do Cloud Run jako zmienna środowiskowa przy starcie, nie przy buildzie. Bez hasła serwer odmawia wszystkim (poza `astro dev`).
  - Hasło jest długie i losowe. Reguła rate limiting w Cloudflare ogranicza próby zgadywania.
  - Odpowiedzi mają `Cache-Control: private, no-store`. Strony mają `noindex` i nie trafiają do sitemapy.
  - Ten sam strażnik chroni prywatne endpointy (`/api/private/*`), a ich odpowiedzi też mają `private, no-store`. Zapisy (`POST`) przyjmują tylko `application/json`, więc obca strona nie wyśle ich ani formularzem, ani `fetch` bez preflightu CORS.
  - Imiona uczniów z kalendarza pojawiają się tylko w tych odpowiedziach.
  - Historia CPU i RAM jest tylko prywatna: z jej rytmu widać, kiedy ktoś korzysta z serwera w domu — z tego samego powodu co brak godzinowego wykresu DNS.
- **Linki do homelabu** (prawdziwe nazwy hostów) są tylko w trybie prywatnym i działają wyłącznie przez Tailscale. W trybie publicznym aplikacje są pigułkami bez linków.
- **Tokeny i klucze** trzymam wyłącznie w zmiennych środowiskowych po stronie serwera. Endpoint `/api/stats`:
  - wymaga tokenu (`STATS_PUSH_TOKEN`, porównanie w stałym czasie);
  - ma limit żądań (reguła w Cloudflare, docs/deploy.md);
  - waliduje dane: znane wersje, zakresy liczb, tylko znane rodzaje; do bazy trafiają wyłącznie znane pola.
