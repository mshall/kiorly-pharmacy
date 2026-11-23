# Kiorly Pharmacy test guide (DEV ONLY)

> **DEV ONLY / synthetic.** All names, phones, e-mails, passwords, OTPs and TOTP seeds below are fake values for the local stack; they are refused when `NODE_ENV=production` and the sign-in quick-pick ("Test users (dev only)") is not in production builds. Providers are mocked (dev inbox / logs, PSP `sandbox-fake`, video `mock`). No tax-authority integration.
> This guide is the repo's slice of the workspace guide `TEST_GUIDE.md` (parent folder `kiorex-v2/`, not part of this repository). Facts verified against the seeds and dev databases on 23 Nov 2026.

## Run the stack and seed it

```bash
# from the workspace root (kiorex-v2/): Postgres :5433 + the five APIs (Passport :4400, Kiorly :3010, Kiorex :4000, Pharmacy :3100, Lab :3200)
e2e/scripts/up.sh --build --seed      # first time; later just e2e/scripts/up.sh (stop: e2e/scripts/down.sh)
scripts/seed-all.sh                   # idempotent demo data in dependency order (--reset re-creates demo rows only)
```
One service only: `e2e/scripts/up.sh --restart --only=passport|kiorly|kiorex|pharmacy|lab > /tmp/up.log 2>&1`. Never touch ports 3000 / 5173 / 5175. Tests you run change data (a cancel stays cancelled): re-seed for the starting state.

```bash
cd kiorly-pharmacy
npm run dev -w web                        # Kiorly Pharmacy web :5192 (PHARMACY_WEB_PORT overrides); API :3100
cd apps/api && npm run seed:all           # seed + seed:demo + seed:suite + seed:mobile (no true reset)
cd apps/web && npm run check:dev-test-users
```

URL: http://localhost:5192/login (API http://localhost:3100/api/v1).

## The Test users (dev only) panel

Below the sign-in form (`apps/web/src/dev/`, lazy behind `import.meta.env.DEV`; hide with `VITE_DEV_TEST_USERS=false`): all 15 seeded logins in three groups, one click signs in with `Demo@12345`. Absent from production builds (`scripts/check-no-dev-test-users.mjs`, also run by `src/dev/dev-test-users.node.test.ts`).

## Test users: 3.4 Kiorly Pharmacy web (:5192, password `Demo@12345`, all `@demo.kiorly.local`)

Chain "Kiorly Demo Pharmacy" (Enterprise, Kiorex orders on): `owner@`, `pharmacist@` (can sign off), `pharmacist2@` (witness), `manager@`, `cashier@`, `assistant@`, `chain@`. Solo "Kiorly Solo Pharmacy" (Pro, no Kiorex): `solo.owner@`, `solo.pharmacist@`, `solo.manager@`, `solo.cashier@`, `solo.assistant@`. "Kiorly Corner Pharmacy" (Lite = Basic): `owner.basic@`, `pharmacist.basic@`, `cashier.basic@`. All 15 verified.

## Flows

### 4.6 Kiorly Pharmacy (PH1-PH8)

http://localhost:5192/login.

1. **Till (`cashier@`).** POS: open a shift, scan or search a drug, add 2, pay cash. *Expected:* receipt and stock decremented; an expired lot (`DMEXP0`) is refused; a return needs `pos.refund_approve` (manager); close the shift to see the variance.
2. **Rx validate and dispense (`pharmacist@`).** Prescriptions: validate a RECEIVED one, safety checks (allergy, interaction, dose) appear, an override needs a reason; dispense and sign off (licensed pharmacist only) gives DISPENSED; reject another with a reason. As `cashier@` the list is readable but validate and sign-off are refused.
3. **Inventory (`manager@`).** Filter expiring (near-expiry lots), blocked (expired x4, quarantined x4, recalled `DM00013` with "Recalled (DEMO-RECALL-001)"); quarantining then releasing creates movement rows and audit entries; a stock count needs `inventory.count.approve`.
4. **Purchasing.** PO list in every state; send the DRAFT, receive the SENT one with lot and expiry (becomes RECEIVED / PARTIALLY_RECEIVED); `chain@` can create but not receive.
5. **Kiorex orders and delivery.** See workspace guide 4.2 step 10: accept, ready, out for delivery, dispense, or reject with a reason.
6. **Controlled discrepancy.** `pharmacist@` -> Controlled: Morphicure expected 40 counted 38 is OPEN; the reporter cannot countersign; `manager@` or `pharmacist2@` countersigns and it closes with the witness in the audit.
7. **Editions.** `solo.owner@` is standalone (no Kiorex orders); `owner.basic@` web works, the staff app shows the upgrade screen; `chain@` switches branches and transfers stock. Turn `pharmacy.kiorex_orders` OFF in ops to see the outage behaviour.

8. **Staff, phone and Passport sessions (`owner@`).** Settings > Staff and roles: add a cashier with the mobile number `+20 100 000 3001` (stored `+201000003001`; a duplicate or `0100` is refused with a readable message), edit role/phone, deactivate. Sign in at :5192 with "Sign in with Kiorex Passport" (a seeded persona, OTP `000000`), then on http://localhost:4400/account/security press "Sign out all other sessions": *Expected:* the next click in the Pharmacy web returns to the sign-in page with "Your session ended" (back-channel logout; within a minute even when idle). Automated: `e2e/test/21-staff-web-session-revocation.e2e.ts`, `apps/web/e2e/staff-management.spec.ts`, `passport-session-end.spec.ts`.

The patient side of orders and delivery (Kiorex patient web :5180):

10. **Pharmacy order and delivery.** Chip Nourhan, `/pharmacy/orders`: `kx_ph_demo_4` READY. Place a new order: pick a pharmacy, add items, choose **Pickup** or **Delivery** (address needed; delivery fee shown when the pharmacy enables it), pay. In Pharmacy (:5192, `pharmacist@`) accept, mark Ready, for delivery orders **Out for delivery**, then dispense. *Expected:* the patient sees each state, including OUT_FOR_DELIVERY; seeded orders: `_1` PENDING_PAYMENT, `_2` PAID, `_3` / `_7` REJECTED, `_5` / `_6` DISPENSED, `_8` CANCELLED.
More: `DEMO_DATA.md` (PH1-PH8), `Docs/TEST_DATA.md`, `Docs/PROVIDERS.md`.
