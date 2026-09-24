# Deploy: Google Cloud Run za Cloudflare

Architektura i powody: koncept.md §10. Ten plik to jednorazowa konfiguracja.
Po niej każdy push na `master` wdraża stronę sam (`.github/workflows/deploy.yml`):
build w GitHub Actions (z sekretami), potem obraz z gotowym `dist/` na Cloud Run.

```text
przeglądarka → Cloudflare (DNS proxy, SSL, 301, cache) → Cloud Run „figielak-dev” (europe-west1)
```

## 1. Google Cloud

Polecenia uruchamiasz w [Cloud Shell](https://shell.cloud.google.com) (ma `gcloud`).

```bash
PROJECT_ID=figielak-dev          # musi być globalnie unikalny — zmień, jeśli zajęty
REGION=europe-west1              # mapowanie domen nie działa w europe-central2
REPO=figielak/figielak.dev
BILLING=XXXXXX-XXXXXX-XXXXXX     # gcloud billing accounts list

gcloud projects create "$PROJECT_ID"
gcloud billing projects link "$PROJECT_ID" --billing-account="$BILLING"
gcloud config set project "$PROJECT_ID"
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')

gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
  artifactregistry.googleapis.com iamcredentials.googleapis.com secretmanager.googleapis.com
```

### Hasło do prywatnego dashboardu

Serwer wpuszcza na `/dashboard/private` tylko z tym hasłem (koncept.md §14). Workflow
podpina je do Cloud Run (`--set-secrets`), więc sekret musi istnieć przed deployem.

```bash
openssl rand -base64 24 | tr -d '\n' | gcloud secrets create dashboard-password --data-file=-
gcloud secrets versions access latest --secret=dashboard-password; echo   # zapisz w menedżerze haseł

# Cloud Run działa na domyślnym koncie Compute — musi móc odczytać sekret.
gcloud secrets add-iam-policy-binding dashboard-password \
  --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role=roles/secretmanager.secretAccessor
```

Zmiana hasła: `… | gcloud secrets versions add dashboard-password --data-file=-`, potem
ponowny deploy (Actions → Deploy → *Run workflow*).

### Klucze do danych na żywo

Kafle GitHub, Last.fm i WakaTime na `/dashboard` pobierają dane przez `/api/github`, `/api/music` i `/api/waka`
(koncept.md §9). Klucze są sekretami serwera — tak jak hasło, workflow podpina je do
Cloud Run, więc **muszą istnieć przed deployem**, inaczej krok *Deploy* się wywali.

- **GitHub:** Settings → Developer settings → Personal access tokens → *Tokens (classic)*,
  bez żadnych zakresów (wystarczy do publicznych danych), z datą ważności, którą
  zapiszesz sobie w kalendarzu. Kontrybucje z prywatnych repo liczą się, jeśli w profilu
  jest włączone *Include private contributions on my profile*.
- **Last.fm:** [last.fm/api/account/create](https://www.last.fm/api/account/create) —
  potrzebny jest tylko *API key* (bez *shared secret*).
- **WakaTime:** [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key) — ten sam
  klucz co w edytorze (`waka_…`).

```bash
for secret in github-token lastfm-api-key wakatime-api-key; do
  read -rsp "$secret: " value; echo
  printf '%s' "$value" | gcloud secrets create "$secret" --data-file=-
  gcloud secrets add-iam-policy-binding "$secret" \
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
    --role=roles/secretmanager.secretAccessor
done
```

Nazwa użytkownika Last.fm nie jest sekretem — idzie jako GitHub Variable `LASTFM_USER` (krok 2).
Nowy token: `… | gcloud secrets versions add github-token --data-file=-` i ponowny deploy.

### Homelab: Firestore i token agenta

Agent na homelabie (osobne repo, kontener Dockera) co 60 s wysyła `POST /api/stats` z tokenem;
endpoint zapisuje odczyt w Firestore, a kafle czytają go przez `/api/homelab/*` (koncept.md §9,
kontrakt w `src/lib/server/homelab.ts`). Serwer rozmawia z Firestore przez REST jako konto
Cloud Run, bez kluczy. Workflow podpina token do Cloud Run, więc **sekret, baza i rola muszą
istnieć przed deployem**.

```bash
# Nowa sesja Cloud Shell nie pamięta zmiennych z kroku 1.
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')

gcloud services enable firestore.googleapis.com
# Baza „(default)” — tylko ona ma darmowy limit (20 tys. zapisów dziennie; agent robi ~1440).
gcloud firestore databases create --location=europe-west1 --type=firestore-native

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role=roles/datastore.user --condition=None

# Token: ta sama wartość trafia do .env agenta (zapisz w menedżerze haseł).
openssl rand -base64 32 | tr -d '\n' | gcloud secrets create stats-push-token --data-file=-
gcloud secrets versions access latest --secret=stats-push-token; echo
gcloud secrets add-iam-policy-binding stats-push-token \
  --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role=roles/secretmanager.secretAccessor
```

Odpowiedzi `POST /api/stats`: **204** wszystko zapisane; **200** część sekcji odrzucona
(`rejected` z powodem — agent loguje); **400** zła koperta albo żadna poprawna sekcja; **401** zły
token; **503** brak tokenu na serwerze albo Firestore niedostępny. Treść musi mieć
`Content-Type: application/json` — Astro odrzuca POST-y wyglądające na formularz (403).

### Konto serwisowe dla GitHub Actions

```bash
gcloud iam service-accounts create github-deployer --display-name="GitHub deploy"
SA="github-deployer@$PROJECT_ID.iam.gserviceaccount.com"

for role in roles/run.admin roles/iam.serviceAccountUser roles/cloudbuild.builds.editor \
            roles/artifactregistry.admin roles/storage.admin roles/serviceusage.serviceUsageConsumer; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$SA" --role="$role" --condition=None
done

# Build ze źródeł (--source) działa na domyślnym koncie Compute — potrzebuje roli buildera.
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role=roles/run.builder --condition=None
```

### Workload Identity Federation (bez kluczy JSON)

```bash
gcloud iam workload-identity-pools create github --location=global --display-name="GitHub"

gcloud iam workload-identity-pools providers create-oidc figielak-dev \
  --location=global --workload-identity-pool=github \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository=='$REPO'"

gcloud iam service-accounts add-iam-policy-binding "$SA" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/$REPO"

# Wartości do GitHub Variables (krok 2):
echo "GCP_PROJECT_ID=$PROJECT_ID"
echo "GCP_WIF_PROVIDER=projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/providers/figielak-dev"
echo "GCP_SERVICE_ACCOUNT=$SA"
```

## 2. GitHub

Repo → Settings → Secrets and variables → Actions:

- **Variables** (identyfikatory, nie sekrety): `GCP_PROJECT_ID`, `GCP_WIF_PROVIDER`,
  `GCP_SERVICE_ACCOUNT` — wartości z końca kroku 1; `LASTFM_USER` — nazwa konta Last.fm.
- **Secrets** (dane, których nie ma w publicznym repo — koncept.md §14, `.env.example`):
  `CONTACT_EMAIL`, `CONTACT_PHONE`, `HOMELAB_DOMAIN`. Workflow wstawia je przy buildzie.

Albo z terminala: `gh variable set …` / `gh secret set …`.

Potem Actions → **Deploy** → *Run workflow* (albo push na `master`). Krok *Smoke test*
sprawdza `/api/health`; adres `https://figielak-dev-….run.app` jest w logu.

## 3. Domena

```bash
gcloud domains verify figielak.dev            # otwiera Search Console — dodaj rekord TXT w Cloudflare
gcloud beta run domain-mappings create --service figielak-dev --domain figielak.dev --region "$REGION"
gcloud beta run domain-mappings describe --domain figielak.dev --region "$REGION"   # rekordy DNS do dodania
```

## 4. Cloudflare

1. **DNS:** dodaj rekordy z `domain-mappings describe` (A/AAAA dla `figielak.dev`).
   Na czas wystawiania certyfikatu przez Google **proxy wyłączone** (szara chmurka).
   Gdy `describe` pokaże certyfikat jako gotowy — **włącz proxy** (pomarańczowa chmurka).
2. **SSL/TLS → Overview:** tryb **Full (strict)**.
3. **Security → WAF → Rate limiting rules** (1 reguła w darmowym planie): gdy URI path zawiera
   `/dashboard/private`, blokuj po 10 żądaniach na 10 s z jednego IP. Hasło chroni serwer,
   a ta reguła ogranicza zgadywanie. `/api/stats` (agent: 1 żądanie na minutę z jednego IP)
   też powinien mieć limit: jeśli próg reguły nie jest surowszy niż ~10 żądań na minutę, dopisz
   do jej wyrażenia `or (http.request.uri.path eq "/api/stats")`; jeśli jest, potrzebna osobna
   reguła (np. 20 na minutę) — na darmowym planie może nie być na nią miejsca.
   **Bot Fight Mode** (Security → Bots) może blokować agenta, a na darmowym planie reguła WAF
   go nie omija — wtedy agent wysyła na adres `https://figielak-dev-….run.app/api/stats`.
4. **Rules → Redirect Rules:** `maths.figielak.dev/*` → `https://figielak.dev/maths` (301),
   `dashboard.figielak.dev/*` → `https://figielak.dev/dashboard` (301). Subdomeny potrzebują
   rekordu DNS z proxy (np. `AAAA 100::`), żeby reguła zadziałała (koncept.md §2).
5. **Caching → Cache Rules:** `/_astro/*` — cache na krawędzi i w przeglądarce 1 rok
   (pliki mają hash w nazwie); `/api/*` — bypass (endpointy same ustawiają `Cache-Control`).

## Sprawdzenie

```bash
curl -sI https://figielak.dev | grep -iE '^(HTTP|server)'     # 200, server: cloudflare
curl -s  https://figielak.dev/api/health                      # {"ok":true,"revision":"figielak-dev-000…"}
curl -sI https://figielak.dev/dashboard/private | head -1     # 401 — przeglądarka pyta o hasło
curl -sI https://maths.figielak.dev | grep -i location        # https://figielak.dev/maths
curl -s  https://figielak.dev/api/github | head -c 120         # {"weeks":[[…  (503 = brak klucza lub błąd GitHuba)
curl -s  https://figielak.dev/api/music                        # {"track":{…},"topArtists":[…],…}
curl -s  https://figielak.dev/api/waka                         # {"todayMin":…,"weekMin":…,"days":[…],"languages":[…],…}
curl -s  -X POST https://figielak.dev/api/stats -o /dev/null -w '%{http_code}\n'   # 401 — bez tokenu
curl -s  https://figielak.dev/api/homelab/lab                  # {"cpu":…,"disks":[…],…} (503 = agent jeszcze nic nie wysłał)
```

## Lokalnie

Najpierw `cp .env.example .env` i uzupełnij wartości. Obraz pakuje gotowy `dist/`,
więc build zawsze idzie przed `docker build`.

```bash
npm run build && node dist/server/entry.mjs                  # http://localhost:4321
npm run build && docker build -t figielak-dev . && docker run --rm -p 8080:8080 figielak-dev
```

## Rozwiązywanie problemów

Problemy, które wystąpiły przy pierwszym wdrożeniu (2026-09-24).

| Objaw | Przyczyna | Rozwiązanie |
|---|---|---|
| Deploy pada na *Creating Revision*: `Permission denied on secret … for Revision service account …-compute@…` | konto, na którym działa Cloud Run, nie może czytać sekretu | `gcloud secrets add-iam-policy-binding dashboard-password --member="serviceAccount:<NUMER>-compute@developer.gserviceaccount.com" --role=roles/secretmanager.secretAccessor`, potem *Run workflow* |
| Odpowiedzi mają `server: Google Frontend`, DNS wskazuje `216.239.x.21` | rekordy w Cloudflare mają wyłączone proxy (szara chmurka) | włącz proxy, SSL/TLS: Full (strict) |
| Subdomeny `maths.` / `dashboard.` zwracają **525** | reguła przekierowania nie działa, a rekord wskazuje serwer bez certyfikatu dla subdomeny | Redirect Rules z warunkiem `http.host eq "maths.figielak.dev"`, rekord `AAAA 100::` z proxy |
| Na stronie `+48 000 000 000`, `kontakt@example.com`, `home.example` | brak GitHub Secrets przy buildzie (albo dodane po deployu) | dodaj Secrets (nie Variables) i uruchom deploy ponownie |
| `/dashboard/private` zwraca **503** | Cloud Run nie dostał `DASHBOARD_PASSWORD` | sprawdź sekret i flagę `--set-secrets` w workflow |
| **429** przy logowaniu do trybu prywatnego | limit żądań w Cloudflare (liczą się też próby bez hasła) | odczekaj kilka sekund |
| `/api/github`, `/api/music` lub `/api/waka` zwraca **503**, kafel „chwilowo niedostępny” | brak klucza, zła nazwa `LASTFM_USER` albo wygasły token GitHuba | przyczyna jest w logach Cloud Run (`[api] …`); nowy token jako nowa wersja sekretu |
| Deploy pada na *Creating Revision*: `Secret …/versions/latest was not found` | sekret nie istnieje albo nie ma wersji (pusta wartość przy `read`) | `gcloud secrets versions list <nazwa>`; brakującą wartość dodaj przez `gcloud secrets versions add` |
| `/api/stats` zwraca **503** `storage unavailable` | Firestore nie jest włączony, baza nie istnieje albo konto Compute nie ma `roles/datastore.user` | szczegóły w logach (`[api/stats]`); krok „Homelab: Firestore i token agenta” |
| Agent dostaje **403** z Cloudflare (strona HTML) | Bot Fight Mode albo reguła WAF | agent wysyła na adres `*.run.app` |
| Odmowa zwraca **500** zamiast 401 | znak spoza Latin-1 (np. „—”) w nagłówku `WWW-Authenticate` | w nagłówkach tylko ASCII |

Logi Cloud Run: `gcloud run services logs read figielak-dev --region europe-west1 --limit 50`.
