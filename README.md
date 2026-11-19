# Kiorly Pharmacy

> **QA / demo data:** synthetic Egyptian dataset, logins, URLs and reset instructions in [Docs/TEST_DATA.md](Docs/TEST_DATA.md) (DEV ONLY).

Pharmacy operating software for Egypt: lot-accurate inventory, pharmacist-gated dispensing, fast POS, supplier automation.

> **Status: built to the PRD (KX-06), providers mocked.** Every build-sequence code step is done and covered by tests (see `Docs/pharmacy-cursor-build-sequence.md`); remaining items are human tasks and decisions in `Docs/NEEDS_HUMAN.md` (discovery, counsel memo, clinical sign-off, provider go-live). The Prisma schema is FROZEN-v1 with discovery-dependent defaults marked NEEDS_HUMAN.

Part of Kiorly by Kiorex. Works standalone; talks to Kiorex only over HMAC REST + outbox webhooks (KX-09). Never imports another product's source or DB.

## Layout

| Path | What |
|---|---|
| `apps/api` | NestJS 10 + Prisma 6. Modules: catalogue (KPCAT), inventory (KPINV: lots, FEFO, receiving, counts, transfers, cold chain), prescriptions + safety engine (KPRX), dispensing (sign-off, controlled log), POS (KPPOS), suppliers + recalls (KPSUP), marketplace (KPMKT), claims, forecasting, reports, dashboard. Cross-cutting: `auth`, `audit`, `outbox`, `kernel-adapter` (commerce-kernel seam), `platform/adapters` (mock/real providers), `feature-flags` |
| `apps/api/prisma` | FROZEN-v1 schema, migrations 0001-0005 (DB invariants as triggers), synthetic demo `seed.ts` |
| `apps/web` | React + Vite + Tailwind + TanStack Query + i18next (AR/EN, RTL). Touch-first POS PWA (IndexedDB offline queue + service worker), Rx/dispensing workspace, inventory, receiving, purchasing, Kiorex order inbox, reports, settings, onboarding. Playwright E2E in `apps/web/e2e` |
| `packages/shared` | Product constants, flag keys, safety controls (never-flags) |
| `Docs/` | Build sequence + tracker, NEEDS_HUMAN (incl. Provider go-live), ADR reference, `openapi.json`, `API.md` |
| `infra/` | OpenTofu (separate) |

## Run locally

Prereqs: Node >= 22, workspace Postgres on :5433 (see workspace CLAUDE.md), `../kiorex-contracts/dist-pack/kiorex-contracts-1.2.0.tgz` present (sibling repo).

```bash
npm install
cp .env.example apps/api/.env        # DATABASE_URL points to kiorly_pharmacy on :5433
npm run db:setup                     # creates kiorly_pharmacy + kiorly_pharmacy_test, applies migrations
npm run seed -w api                  # synthetic catalogue + demo tenant (idempotent)
npm run dev                          # API http://localhost:3100/api/v1 (Swagger /docs)  ·  web http://localhost:5190
```

Demo logins (local only, seed): `owner@` / `pharmacist@` / `cashier@` / `manager@` `demo.kiorly.local`, password `Demo@12345`. UI language switch top right (AR is RTL).

| Service | URL |
|---|---|
| API | http://localhost:3100/api/v1/health/live , /ready ; Swagger at /docs ; machine API (Kiorex) at /marketplace/v1 |
| Web | http://localhost:5190 (proxies `/api` to 3100) |
| DB | postgresql://postgres:postgres@127.0.0.1:5433/kiorly_pharmacy (tests: `kiorly_pharmacy_test`) |

## Checks

```bash
npm run typecheck   # api (prisma generate + tsc) + web
npm run lint        # web (eslint + jsx-a11y)
npm test            # api unit (node:test) + e2e (supertest-style HTTP against the test DB, stop-ship suites) + web locale parity/usage
npm run docs:check
npm run e2e -w web  # Playwright: golden flow, offline POS reconcile, axe a11y AR/EN (needs seeded dev DB; starts API + web)
npm run openapi:export -w api   # writes Docs/openapi.json
```

## Feature flags

Evaluated locally from the Kiorex snapshot with `@kiorex/contracts` (`GET /control/v1/flags/snapshot?product=kiorly-pharmacy`, polled every 30 s when `FLAGS_POLL_ENABLED=true`, persisted in `FlagSnapshotCache`, refreshed by the signed `flag.changed` webhook; no snapshot => code defaults: ON, launch-locked OFF). Keys: `pharmacy.module`, `pharmacy.kiorex_orders`, `pharmacy.forecasting`, `pharmacy.insurer_claims`. OFF => `403 FEATURE_DISABLED {key, scope}` and data is never hidden (per-flag contract tests). Plan capability gates are separate (`402 ENTITLEMENT_REQUIRED`). **Safety controls are never flags** (ADR-025): lot expiry/recall/quarantine blocks, Rx safety checks, pharmacist sign-off, controlled-substance log, audit, tenant isolation — enforced in services AND DB triggers; a CI test fails if safety-path code references a flag.

## Compliance guard

No tax-authority reporting anywhere (ADR-011): receipts and exports carry VAT lines only. `apps/api/src/compliance/no-tax-authority.node.test.ts` fails on ETA / e-invoice / ZATCA / fiscal-device references.

## Rules

See `.cursor/rules/pharmacy.mdc` and the workspace `CLAUDE.md`. Conventional Commits. No push to `main` without review; no AWS deploys until the founder says so.
