# Test data — Kiorly Pharmacy (DEV ONLY)

> **DEV ONLY / synthetic.** Fictional names, phones `+20100000xxxx`, e-mails `@demo.kiorex.test`. Passwords and OTPs here are local dev values, blocked in production.
> No tax-authority integration; VAT is a plain configurable line. Messaging/PSP/video are mocked. Cross-product index: `TEST_DATA.md` in the workspace root (`kiorex-v2/`).

## Run / reset
```bash
cd apps/api
npm run seed             # base demo tenant "Kiorly Demo Pharmacy" (org_demo_kiorly, the tenant Kiorex's dev client is bound to)
npm run seed:demo        # idempotent: NEW records only, on top of the base tenant (prisma/demo/seed-demo.ts)
npm run seed:demo -- --reset   # best-effort removal of demo sales/Rx/POs/Kiorex orders; global drugs, price history, stock lots and movements are append-only (DB rules) and stay
```
Full wipe: recreate the `kiorly_pharmacy` database and re-run `seed` + `seed:demo`.
## Logins — http://localhost:5190 (password `Demo@12345`, DEV ONLY)
`owner@demo.kiorly.local`, `pharmacist@demo.kiorly.local` (licensed: can sign off), `cashier@demo.kiorly.local`, `manager@demo.kiorly.local`, `chain@demo.kiorly.local`. Passport persona for the pharmacy org: `+201000002004` (OTP `000000`).
## Suite seed (`npm run seed:suite`, included in `seed:all`; re-runnable)
Adds to the demo tenant: ~500 drugs in total (categories, pack units, shelf locations), ~150 customers (families, allergies/conditions, loyalty tiers, credit accounts, duplicate pairs), prescribers, ~107 prescriptions in every state (received, validating, validated, partially dispensed, dispensed, rejected, cancelled, expired, transferred out) with refills and reminders, ~360 sales (promotions, coupons, split payments, returns, exchanges), shifts and cash movements, POs/RFQs/receipts/supplier returns, expenses, 8 insurer claims, controlled register rows with a discrepancy, alerts. Extra logins (same password): `assistant@demo.kiorly.local`, `pharmacist2@demo.kiorly.local` (witness).
**Standalone tenant** (no Kiorex client, mode STANDALONE): `solo.owner@demo.kiorly.local`, `solo.pharmacist@demo.kiorly.local`, `solo.manager@demo.kiorly.local`, `solo.assistant@demo.kiorly.local` - ~23 customers, ~18 Rx, ~53 sales, controlled rows. Use it to verify that nothing needs Kiorex.

## What exists
343 catalogue drugs (~100 base + ~215 generated, names are fictional) with prices · lots with expiry spread 12…700 days: **near-expiry** (49 within 30 d), **expired** (3, `DMEXP*`), **quarantined** (3), **recalled** (1, notice `DEMO-RECALL-001`) · 5 suppliers (3 new `(DEMO)`), POs: draft, sent, received, partially received, cancelled · Rx queue (received / validated / rejected / dispensed; patients `…(DEMO)`) · dispensing history with pharmacist sign-off · ~45 POS sales over 30 days (8 today) · Kiorex orders `kx_ph_demo_3…7`: new, ready, dispensed x2, rejected (mirror the Kiorex orders of the same id).
## Where to click
Dashboard KPIs · Inventory (filter blocked / expiring) · Receiving · Purchasing · Prescriptions · Point of sale · Kiorex orders · Reports.

## Seeding staging on AWS (non-production only; written, never applied)
Nothing here deploys anything. A human first deploys the staging stacks and pushes the seed images, then seeds by hand:
1. `enable_demo_seed = true` is set **only** in the staging `terraform.tfvars` (default `false`, prod `false`; a plan with `env = "prod"` and `enable_demo_seed = true` **fails** a precondition, tested offline by `infra/tofu/modules/product-stack/tests/demo_seed_guard.tftest.hcl` via `tofu test`). It creates a container-image Lambda `<product>-staging-demo-seed` in the isolated subnets with DB access and least-privilege IAM (read the DB secret + the runtime secrets, decrypt with the secrets key, nothing else); OpenTofu never invokes it.
2. Build and push the seed image (`apps/api/Dockerfile.seed`, tag = the deploy git sha) to the `<name>-seed` ECR repo, then run `tofu apply` for staging as usual.
3. From the workspace root run `scripts/seed-staging.sh --dry-run` (prints the plan), then `scripts/seed-staging.sh --yes` (order: Passport Cognito users, Kiorly Clinic, Pharmacy, Lab, Kiorex provider sync, Kiorex). `--reset` removes and re-creates the demo records only; `--only lab,kiorex` re-runs selected steps. The script refuses any AWS account other than the staging one. Single product: `tofu output demo_seed_invoke`.
4. Image: `apps/api/Dockerfile.seed` (`npm run build:seed -w api`; entrypoints `dist-seed/prisma/seed.js` and `dist-seed/prisma/demo/seed-demo.js`). The stack is a placeholder (`enabled = false`) until M9: flip `enabled = true` for staging first.
**Guard (every seed entrypoint, `src/common/demo-seed-guard.ts`; `scripts/demo-seed-guard.ts` in kiorex-account):** the demo seed runs only when `DEMO_SEED_ALLOWED=true` **and** the environment is declared non-production (`KIORLY_ENV` / `KIOREX_ENV` / `ENV_TAG`, the `Env` tag OpenTofu sets; `NODE_ENV` is only a fallback because staging containers run with `NODE_ENV=production`). It fails closed: any variable saying prod/production/live, an unknown environment name, an undeclared environment under `NODE_ENV=production`, a database whose host/name looks like production, or any "allow in prod" override all refuse. It logs a banner (environment + database name, never credentials). Local `npm run` scripts set `DEMO_SEED_ALLOWED=true` for you; `scripts/seed-all.sh` also sets `KIORLY_ENV=local`. Tests: `demo-seed-guard.node.test.ts` (jest/vitest equivalent in platform/account).
Mock providers stay mock on staging (`MODE=mock`, PSP `sandbox-fake`, messaging `log`), so every seeded flow works without real providers. Cognito generates user subs, so the Passport step writes a phone-to-sub map that the Clinic / Pharmacy / Kiorex seeds take as `DEMO_SUB_MAP_JSON` (seed-staging.sh passes it). Families, organisations, invitations, link requests and TOTP of the Passport demo exist only in the local dev IdP DB (the AWS Passport stack is Cognito only): on staging the guardian/org Passport screens are not seeded.
Known limits: Kiorex's provider sync and the Nurse-lab push-back call Kiorly Clinic/Lab over HTTPS and need the egress path HB07 from the isolated subnets (until then those steps warn and the Kiorex data is seeded without the clinic mirror). Seeding Kiorex needs the platform's `KIORLY_CLIENT_KEY/SECRET` runtime secrets. The seed images could not be built in this session (Docker daemon not running): build them once before the first run.

## Q10 notes
No new pharmacy flows were added after the last data pass; the Kiorex-origin orders still mirror `kx_ph_demo_*`. The seed now accepts `DEMO_SUB_MAP_JSON` (real Kiorex/Cognito subs on AWS) and refuses unless `DEMO_SEED_ALLOWED=true` in a non-production environment (`src/common/demo-seed-guard.ts`; the npm scripts set the flag). `--reset` still cannot remove append-only stock rows (the 2 reported statements); the log noise about append-only deletes and the duplicate `SettlementEntry` on re-runs is expected and harmless.

## Kiorly Work mobile (added 20 Nov 2026)
`npm run seed:mobile -w api` (also part of `seed:all`; idempotent, demo-seed guard applies; run after `seed` and `seed:suite`). One tenant per plan so the plan gate and the upgrade path are demonstrable. Password for all: `Demo@12345` (DEV ONLY). API http://localhost:3100/api/v1 (`POST /auth/login`).
| Plan (edition) | Tenant | Logins |
|---|---|---|
| ENTERPRISE (CHAIN) | Kiorly Demo Pharmacy (INTEGRATED, Kiorex orders on) | `owner@` / `pharmacist@` / `manager@` / `cashier@` / `assistant@demo.kiorly.local` |
| PRO | Kiorly Solo Pharmacy (DEMO) (STANDALONE) | `solo.owner@` / `solo.pharmacist@` / `solo.manager@` / `solo.cashier@` / `solo.assistant@demo.kiorly.local` |
| BASIC (LITE) | Kiorly Corner Pharmacy (DEMO, Lite) | `owner.basic@` / `pharmacist.basic@` / `cashier.basic@demo.kiorly.local` (bootstrap: `PLAN_BELOW_PRO`, safety-alert inbox only) |
Every tenant gets open safety alerts (a controlled-drug discrepancy for "Morphicure 10 mg (DEMO)" awaiting a witness, one already countersigned) and two inbox messages per user (welcome + a SAFETY one). Try: log in as `pharmacist@` -> `GET /mobile/bootstrap`, `GET /mobile/alerts`, `GET /mobile/pharmacy/controlled/pending-witness`; countersign as `manager@` (a different person than the reporter `pharmacist@`). Switch the app off for a PRO org: set `mobile_staff_app` OFF at org scope in the Kiorex flag control plane -> `FLAG_OFF`.
