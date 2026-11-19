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
## What exists
343 catalogue drugs (~100 base + ~215 generated, names are fictional) with prices · lots with expiry spread 12…700 days: **near-expiry** (49 within 30 d), **expired** (3, `DMEXP*`), **quarantined** (3), **recalled** (1, notice `DEMO-RECALL-001`) · 5 suppliers (3 new `(DEMO)`), POs: draft, sent, received, partially received, cancelled · Rx queue (received / validated / rejected / dispensed; patients `…(DEMO)`) · dispensing history with pharmacist sign-off · ~45 POS sales over 30 days (8 today) · Kiorex orders `kx_ph_demo_3…7`: new, ready, dispensed x2, rejected (mirror the Kiorex orders of the same id).
## Where to click
Dashboard KPIs · Inventory (filter blocked / expiring) · Receiving · Purchasing · Prescriptions · Point of sale · Kiorex orders · Reports.
