# Deployment: runtime images and configuration (Kiorly Pharmacy)

Host-agnostic: the same two images run on AWS App Runner, ECS, Kubernetes or a single Docker host. Nothing here needs a cloud SDK. Verified locally on arm64 (Apple silicon) and built for linux/amd64; both images use only multi-arch bases (`node:26-bookworm-slim`, `nginx:1.29-alpine`), so `docker buildx build --platform linux/amd64,linux/arm64` works.

## 1. API image (`apps/api/Dockerfile`)

```
docker build -f apps/api/Dockerfile -t kiorly-pharmacy-api .          # from the repo root
```

- Copies `vendor/` (the `file:` tarballs the lockfile resolves: `@kiorex/contracts`) before `npm ci`, builds with `prisma generate` + `nest build`, and ships production dependencies only. The Prisma CLI (7.10.1) lives in `/opt/prisma`, outside the app's `node_modules`.
- Runs as the non-root `node` user, port `3100` (`PORT`), `LISTEN_HOST=0.0.0.0`.
- Entrypoint `apps/api/docker-entrypoint.mjs`:
  1. `DATABASE_URL` as given, else built from `DB_SECRET_JSON` (the JSON of a secret injected as one variable: `host`, `port`, `username`, `password`, `dbname`) or `DB_HOST` + `DB_PORT` `DB_USER` `DB_PASSWORD` `DB_NAME` [`DB_SSLMODE`, `DB_SCHEMA`]. Credentials are URL-encoded and never logged.
  2. `prisma migrate deploy` with bounded retries: `MIGRATE_MAX_ATTEMPTS` (default 8), `MIGRATE_RETRY_BASE_MS` (default 3000, linear back-off, 30 s cap). **If every attempt fails the process exits 1 and the server is never started**, so the container cannot look healthy on a half-migrated database (the orchestrator shows a failed/restarting container). `PRISMA_MIGRATE_ON_BOOT=false` skips migrations (run `db:deploy` from CI instead).
  3. Starts `dist/main.js`; `SIGTERM`/`SIGINT` are forwarded; seeds never run on boot.
- Migrations are applied by every replica that boots; Prisma takes a database advisory lock, so concurrent starts serialize safely.

Single Docker host example (private network, Postgres outside the container):

```
docker run -d --name kiorly-pharmacy-api -p 127.0.0.1:3100:3100 \
  -e NODE_ENV=production -e DB_HOST=db.internal -e DB_USER=app -e DB_PASSWORD=... -e DB_NAME=kiorly_pharmacy \
  -e JWT_SECRET=... -e AUTH_MODE=oidc -e OIDC_ISSUER=https://passport.example.com \
  -e CORS_ORIGINS=https://app.example.com -e WEB_APP_URL=https://app.example.com -v /srv/kiorly-pharmacy/storage:/data/storage -e STORAGE_DIR=/data/storage -e STORAGE_DIR_PERSISTENT=true \
  kiorly-pharmacy-api
```

The full variable list per product is in `.env.example`, `Docs/PROVIDERS.md` and the AWS plan section 3.3 in the workspace `_docs/AWS_DEV_ENV_PLAN.md`. Provider modes default to `mock`; `real` stays gated.

## 2. Health and readiness

| Route | Purpose | Answer |
|---|---|---|
| `GET /api/v1/health/live` | liveness: the process is up (no dependencies touched) | `200 {"status":"ok","product":"kiorly-pharmacy"}` |
| `GET /api/v1/health/ready` | readiness: runs `SELECT 1` against the database | `200 {"status":"ok","database":"ok"}`; `503 {"status":"degraded","database":"unavailable"}`. Internal callers (private network) also get provider modes and lead-signing state |
| `GET /api/v1/health/providers` | provider directory | internal callers only (`403 INTERNAL_ONLY` from the internet) |

All three are public (no token) and live under the API prefix (`API_PREFIX`, section 3). Use `/health/live` for the container `HEALTHCHECK` (built into the image) and for liveness; use `/health/ready` as the load balancer / App Runner health check when you want traffic held back while the database is unreachable. The web image answers `GET /healthz` (`ok`).

## 3. Prefix, CORS and base URLs (all environment, no rebuild)

| Variable | Default | Meaning |
|---|---|---|
| `API_PREFIX` | `api/v1` | Global prefix of the application API. The web build, the Passport redirect/back-channel URIs and the AWS plan assume the default; change it only together with the proxy in front and those registrations. |
| `CORS_ORIGINS` | local dev origins outside production; **empty in production** | Comma-separated browser origins allowed to call the API cross-origin. In production an unset value means same-origin only (the web image proxies `/api/`, so no CORS is needed); a startup notice says so. |
| `KIORLY_HOME_ORIGINS` | local default outside production | Kiorly Home origins allowed for the sign-in handoff (added to CORS). Required in production if Home is used. |
| `WEB_APP_URL` | local default outside production | Where the browser goes after a handoff login (this product's own web). |
| `PUBLIC_BASE_URL` | none | Public base used in links the API emits. |
| `KIOREX_BASE_URL`, `KIOREX_API_BASE_URL`, `KIOREX_WEBHOOK_URL`, `KIOREX_FLAGS_URL` | local defaults | Where the Kiorex platform lives (webhooks, flags, signed statement route). |

| Machine API `/marketplace/v1/*` | fixed path | The Kiorex machine API (HMAC signed, partner contract) is **outside** `API_PREFIX` and not configurable, because the signed path is part of the contract. A CDN rule `/api/*` therefore does not reach it: route `/marketplace/*` to the API as well (the web image already does), or let Kiorex call the API host directly (`partner base URL = <api host>`, path `/marketplace/v1` appended). It never needs CORS (server to server). |

## 4. Storage volume (`STORAGE_DIR`)

Rx scans, attachments and exports use `STORAGE_MODE=mock` (default: **local disk** under `STORAGE_DIR`, default `<cwd>/.data` inside the image) unless `STORAGE_MODE=real` points at an HTTP object store (`STORAGE_API_URL`, `STORAGE_API_KEY`). Container filesystems are lost on every redeploy/restart (App Runner always; Docker when the container is recreated).

- **Single Docker host:** bind-mount or name a volume at a fixed path and set the directory: `-v /srv/kiorly-pharmacy/storage:/data/storage -e STORAGE_DIR=/data/storage -e STORAGE_DIR_PERSISTENT=true`. The image creates `/data/storage` owned by `node`; a host bind mount must be writable by uid 1000 (`chown 1000:1000`).
- **App Runner (no volume support):** use `STORAGE_MODE=real`, or accept loss in DEV (scans are synthetic).
- **Startup warning:** with `NODE_ENV=production`, `STORAGE_MODE` mock and `STORAGE_DIR` unset, relative, under the app's working directory or under `/tmp`, `/var/tmp`, `/dev/shm`, `/run`, the API logs a `storage:` warning (it keeps running). `STORAGE_DIR_PERSISTENT=true` states that a volume is mounted and silences it.

## 5. Web build (`apps/web/Dockerfile`)

```
docker build -f apps/web/Dockerfile -t kiorly-pharmacy-web \
  --build-arg VITE_KIORLY_HOME_URL=https://home.example.com \
  --build-arg VITE_SESSION_IDLE_MINUTES=30 .
docker run -d -p 8080:8080 -e API_UPSTREAM=http://kiorly-pharmacy-api:3100 kiorly-pharmacy-web
```

- Vite inlines `VITE_*` at **build** time, so they are build args: `VITE_KIORLY_HOME_URL` (Kiorly Home link; unset hides the switch link outside dev), `VITE_SESSION_IDLE_MINUTES`, `VITE_DEV_TEST_USERS` (leave empty outside dev). Without Docker: `VITE_KIORLY_HOME_URL=... npm run build -w web` writes `apps/web/dist`.
- The image is nginx serving the SPA with an `index.html` fallback and a proxy of `/api/` to `API_UPSTREAM` and `/marketplace/` (the Kiorex machine API, path unchanged), so the browser is same-origin (no CORS). `API_UPSTREAM` is resolved at request time (the container starts before the API); override the resolver with `NGINX_RESOLVER`, the listen port with `NGINX_PORT` (default 8080).
- Behind CloudFront or another CDN you can serve `dist/` from object storage instead and route `/api/*` to the API.

## 6. What is still the operator's job

Database provisioning and backups (take a snapshot before the first migrate on real data), TLS, secrets management, Passport client redirect URIs and back-channel logout URL, DNS. No AWS resources are created by these files.
