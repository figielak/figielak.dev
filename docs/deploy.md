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
  `GCP_SERVICE_ACCOUNT` — wartości z końca kroku 1.
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
   a ta reguła ogranicza zgadywanie.
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
```

## Lokalnie

Najpierw `cp .env.example .env` i uzupełnij wartości. Obraz pakuje gotowy `dist/`,
więc build zawsze idzie przed `docker build`.

```bash
npm run build && node dist/server/entry.mjs                  # http://localhost:4321
npm run build && docker build -t figielak-dev . && docker run --rm -p 8080:8080 figielak-dev
```
