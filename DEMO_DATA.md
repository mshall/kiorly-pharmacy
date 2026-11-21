# Kiorly Pharmacy: demo data and manual test guide (DEV ONLY)

> **DEV ONLY / synthetic.** Fictional tenants, drugs, customers and prescribers; passwords are local development values (the demo seeds refuse to run in production). Providers are mocked. Workspace index: [../DEMO_DATA.md](../DEMO_DATA.md) · shared tables: [../TEST_DATA.md](../TEST_DATA.md) · seed reference: [Docs/TEST_DATA.md](Docs/TEST_DATA.md) · feature coverage: [Docs/FEATURE_MATRIX.md](Docs/FEATURE_MATRIX.md).
> Checked against the API on `:3100` and the `kiorly_pharmacy` database on 21 Nov 2026. The shared dev database is also written by the e2e suites, so **counts drift**; the numbers below are a snapshot, the states are what is guaranteed.

## 1. What this demo is for

A multi-branch chain pharmacy with every stock state (valid, near-expiry, expired, quarantined, recalled), prescriptions in every state, point-of-sale history, purchasing in every state, Kiorex marketplace orders, and a controlled-drug discrepancy that needs a witness. Two more tenants show the editions: a **Solo** (standalone, PRO, no Kiorex) and a **Corner (Lite / BASIC)** pharmacy that shows plan gates.

## 2. Start and seed

```bash
e2e/scripts/up.sh [--build] [--seed]          # workspace root: starts the Pharmacy API :3100 (AUTH_MODE=local, KIOREX_MODE=real) with the other services
cd kiorly-pharmacy && npm run dev -w web       # web on http://localhost:5190 (proxies /api to :3100)
cd kiorly-pharmacy/apps/api
npm run seed                # base tenant "Kiorly Demo Pharmacy" (org_demo_kiorly, the tenant Kiorex's dev client is bound to)
npm run seed:demo           # idempotent, NEW records only on top of the base tenant
npm run seed:suite          # ~500 drugs, ~150 customers, Rx in every state, ~360 sales, solo tenant (re-runnable)
npm run seed:mobile         # Kiorly Work tenants per plan (Solo PRO, Corner BASIC) + alerts
npm run seed:all            # all four
npm run seed:demo -- --reset   # best-effort removal of demo sales/Rx/POs/Kiorex orders
```

* **Port clash:** on this Mac port **5190** is currently held by the Kiorly Clinic *main* checkout's web (its `local-dev-ports.sh` assigns main web 5190 and docs 5191). If `http://localhost:5190` shows "Kiorly Clinic by Kiorex", start the Pharmacy web elsewhere: `PHARMACY_WEB_PORT=5192 npm run dev -w web` and open `http://localhost:5192` (API origin override: `PHARMACY_API_ORIGIN`).
* **No true reset:** global drugs, price history, stock lots and stock movements are append-only (DB rules); `--reset` cannot remove them (the "append-only delete" log lines are expected). For a full wipe recreate the `kiorly_pharmacy` database and run `seed` + `seed:all`.
* Run beside Kiorex with `KIOREX_MODE=real` (see [Docs/RUNBOOK.md](Docs/RUNBOOK.md)); `up.sh` already does.

## 3. Personas (web `/login`: e-mail + password; API `POST :3100/api/v1/auth/login`)

Password for all: **`Demo@12345`** (DEV ONLY). All nine base-tenant logins and the solo / Lite ones below were verified with curl on 21 Nov 2026. A Passport persona exists for the pharmacy org: `+201000002004` Mostafa Reda (pharmacist member of "Delta Pharmacy Group (DEMO)", OTP `000000`, see [../kiorex-account/DEMO_DATA.md](../kiorex-account/DEMO_DATA.md)).

| Login | Name | Role | Tenant (edition, plan, mode) | Branch | Permissions |
|---|---|---|---|---|---|
| `owner@demo.kiorly.local` | Dr. Demo Owner | OWNER, licensed pharmacist | Kiorly Demo Pharmacy (CHAIN, ENTERPRISE, INTEGRATED) | all | 54 (everything incl. settings, staff, roles, data import/export) |
| `pharmacist@demo.kiorly.local` | Ph. Salma Demo | PHARMACIST (licensed: can sign off) | same | Maadi | 35 (Rx validate, dispense + sign-off, controlled, POS, refunds approve, orders respond, inventory adjust/count/quarantine, recall) |
| `pharmacist2@demo.kiorly.local` | pharmacist (witness) | PHARMACIST | same | Maadi | as above; second signer for controlled drugs |
| `manager@demo.kiorly.local` | Mona Manager | BRANCH_MANAGER | same | Maadi | 49 (no sign-off, no staff/roles/settings write) |
| `cashier@demo.kiorly.local` | Omar Cashier | CASHIER | same | Maadi | 12 (POS, shift, cash drawer, customer credit, dispense create/complete, read Rx) |
| `assistant@demo.kiorly.local` | Asma Assistant | ASSISTANT | same | Maadi | 14 (POS, receiving, count, Rx intake; no validate, no controlled) |
| `chain@demo.kiorly.local` | Chain Ops | CHAIN_OPS | same | both | 18 (catalogue, price, transfers, suppliers, PO, reports, forecast, audit; no Rx, no POS, no stock receiving) |
| `solo.owner@`, `solo.pharmacist@`, `solo.manager@`, `solo.cashier@`, `solo.assistant@demo.kiorly.local` | Dr. Solo Owner etc. | OWNER / PHARMACIST / BRANCH_MANAGER / CASHIER / ASSISTANT | **Kiorly Solo Pharmacy (DEMO)** (PRO, STANDALONE, Zamalek branch `SOLO`) | Zamalek | as above per role; no Kiorex orders |
| `owner.basic@`, `pharmacist.basic@`, `cashier.basic@demo.kiorly.local` | Dr. Basic Owner etc. | OWNER / PHARMACIST / CASHIER | **Kiorly Corner Pharmacy (DEMO, Lite)** (LITE = BASIC, STANDALONE, Corner branch `CORNER`) | Corner | web works; Kiorly Work shows the upgrade screen (`PLAN_BELOW_PRO`) |

## 4. What data exists (snapshot 21 Nov 2026) and where to click

| Data | Detail | Where to click |
|---|---|---|
| Branches | Demo: Maadi `MAIN`, Nasr City `NASR` (+ an `E2E Till Branch (test)` left by a test); Solo: Zamalek `SOLO`; Lite: Corner `CORNER` | branch switcher |
| Catalogue | 299 tenant drugs for the Demo tenant (+259 global rows, 560 in the table); names are fictional "(DEMO)" | Catalogue |
| **Stock lots (Demo tenant)** | ~900 AVAILABLE; **near-expiry** (<= 30 d with stock): 58; **expired** x4 (`DMEXP0..2`, `EXPIRED-DEMO`); **quarantined** x4 (incl. `L00089`, `DM00007`, `DM00008`); **recalled** (`DM00013`, notice source `DEMO-RECALL-001`, plus lots recalled by tests) | Inventory (filter blocked / expiring), Safety, Reports -> expiry |
| Prescriptions (Demo, 121) | RECEIVED 14, VALIDATING 1, VALIDATED 12, REJECTED 36, PARTIALLY_DISPENSED 1, DISPENSED 54, CANCELLED 1, EXPIRED 1, TRANSFERRED_OUT 1 (patients named "... (DEMO)") | Prescriptions queue (`/rx`) |
| POS | 384 sales in the Demo tenant (~45 in the last 30 days, 8 today in the base demo), split payments, returns, exchanges, coupons, shifts and cash movements | Point of sale (`/pos`), Reports, Finance |
| Purchasing | POs DRAFT 2, SENT 1, PARTIALLY_RECEIVED 1, RECEIVED 2, CANCELLED 1; 6 suppliers (3 marked "(DEMO)") | Purchasing, Receiving |
| Customers | ~150 (families, allergies, loyalty tiers, credit accounts, duplicate pairs to merge) | Customers |
| Kiorex orders | mirrors of Kiorex orders `kx_ph_demo_3..7`: `3` Karim EXPIRED here (the "new" order aged past its SLA; Kiorex shows it REJECTED), `4` Nourhan READY, `5` Mahmoud and `6` Mariam DISPENSED, `7` Omar REJECTED. `kx_ph_demo_1` (Hoda, PENDING_PAYMENT), `2` (Samir, PAID) and `8` (Dalia, CANCELLED) exist only in Kiorex. Many more `kx-e2e-*` / `kx_ph_mwo*` rows are e2e leftovers | Orders (`/orders`) |
| **Controlled drug discrepancy** | "Morphicure 10 mg (DEMO)": register expected **40**, counted **38** (difference -2), CRITICAL, awaiting a witness (8 OPEN across the three tenants, one per tenant plus test rows) | Controlled (`/controlled`), Safety; Kiorly Work Controlled -> countersign |
| Insurer claims | 8 (one overdue: CLAIMS_OVERDUE alert) | Finance / claims |
| Alerts | NEAR_EXPIRY, LOW_STOCK, EXPIRED_STOCK (CRITICAL), RX_WAITING, REFILLS_DUE, CLAIMS_OVERDUE, CONTROLLED_DISCREPANCY | Dashboard, Notifications |
| Solo tenant | ~23 customers, 18 Rx, 53 sales, 90 lots, controlled rows | log in as `solo.*` |
| Lite tenant | 1 drug, 1 lot, no sales: just enough to show the plan gate | log in as `*.basic` |

## 5. Manual test scripts

**PH1. Sell at the till (cashier).** 1) Log in `cashier@demo.kiorly.local`. 2) Point of sale: open a shift (opening cash). 3) Scan/search a drug, add 2 units, pay cash. *Expected:* receipt, stock decremented. 4) Try a sale with an expired lot's drug by lot (`DMEXP0`). *Expected:* refused (expired/blocked lots are not sellable). 5) Return one unit with a reason. *Expected:* return recorded (refund approval needs `pos.refund_approve`, which the cashier role does not have). 6) Close the shift. *Expected:* variance shown.

**PH2. Prescription validate and dispense (pharmacist).** 1) Log in `pharmacist@`. 2) Prescriptions -> a RECEIVED one. 3) Validate: safety checks (allergy, interaction, dose) appear; override requires a reason. 4) Dispense -> sign off (licensed pharmacist only). *Expected:* status DISPENSED, dispensing history with sign-off. 5) Reject another with a reason. *Expected:* REJECTED. 6) Log in as `cashier@` and open the same list: can read and create a dispense but not validate or sign off.

**PH3. Inventory states.** 1) `manager@` -> Inventory, filter "expiring": near-expiry lots (<= 30 d). 2) Filter "blocked": expired x4, quarantined x4, recalled. 3) Open `DM00013` -> blocked with "Recalled (DEMO-RECALL-001)"; try to sell or dispense it -> refused. 4) Quarantine an available lot, then release it. *Expected:* movement rows, audit entries. 5) Stock count: start a count, count a different quantity, submit; approval needs `inventory.count.approve` (manager/owner).

**PH4. Purchasing and receiving.** 1) `manager@` -> Purchasing: list shows DRAFT / SENT / PARTIALLY_RECEIVED / RECEIVED / CANCELLED. 2) Send the draft PO. 3) Receiving: receive the SENT PO with a lot number and expiry. *Expected:* PO becomes RECEIVED (or PARTIALLY_RECEIVED), new lot visible in Inventory. 4) `chain@` can create a PO but not receive.

**PH5. Kiorex orders.** 1) Kiorex patient web as Nourhan (`+201000001004`, order `kx_ph_demo_4` is READY) or place a new order (see ../kiorex-platform/DEMO_DATA.md K6). 2) `pharmacist@` -> Orders: accept, mark READY, then dispense (DISPENSED) or reject with a reason. *Expected:* the patient sees each state; `kx_ph_demo_4` is READY, `5`/`6` DISPENSED, `7` REJECTED, `3` EXPIRED.

**PH6. Controlled discrepancy with a witness.** 1) `pharmacist@` -> Controlled: the Morphicure discrepancy (expected 40 counted 38) is OPEN. 2) The reporter cannot countersign their own report. 3) Log in as `manager@` (or `pharmacist2@`) and countersign. *Expected:* discrepancy closes with a witness and an audit entry. (Mobile route: Kiorly Work -> Controlled -> countersign.)

**PH7. Edition walkthroughs.** 1) `solo.owner@`: STANDALONE tenant, no Kiorex client (the mobile bootstrap also reports the orders module OFF); Rx, POS, inventory and purchasing all work without Kiorex. 2) `owner.basic@`: the web app works but Kiorly Work shows the upgrade screen and only the safety-alert inbox (see [../kiorly-work/DEMO_DATA.md](../kiorly-work/DEMO_DATA.md)). 3) `chain@`: switch between Maadi and Nasr City, transfers between branches.

**PH8. Outage / flag.** In the Kiorex ops console switch `pharmacy.kiorex_orders` OFF (super admin) -> the Orders list shows 403 FEATURE_DISABLED within about 2 s (fast flag polling in the demo stack); safety alerts keep working.

## 6. What each role should and should not see

| Role | Should see | Should NOT |
|---|---|---|
| Owner | everything: settings, staff, roles, data import/export, finance | n/a |
| Pharmacist | Rx validate/dispense + sign-off, controlled register, inventory adjust/quarantine/recall, refunds approval, orders | staff/roles/settings, price changes (no `price.write`) |
| Branch manager | catalogue + price write, count approve, transfers, PO, claims, reports, finance | dispense sign-off (`dispense.signoff`), staff/roles |
| Cashier | POS, shift, cash drawer, customers, dispense create/complete | validate Rx, controlled, inventory adjust, receiving, reports |
| Assistant | POS, receiving, count, Rx intake | validate/sign off, controlled, orders |
| Chain ops | catalogue, price, transfers, suppliers, PO, reports, forecast, audit | Rx, POS, receiving |
| Lite (BASIC) users | the web app; in the app only the safety inbox | Kiorly Work modules (403 FEATURE_DISABLED `mobile_staff_app`) |

## 7. Known limitations and inconsistencies found

* Mock providers: Kiorex messaging, SMS, push and PSP are mocked; the Kiorex link uses the dev HMAC client (`kx_dev_pharmacy_client`, DEV ONLY).
* Port 5190 collides with Clinic main (section 2).
* `RecallNotice` has **0 rows** in the live database although lot `DM00013` is `RECALLED` ("Recalled (DEMO-RECALL-001)"): the notice row was removed (by a `--reset`) while the append-only lot stayed, so a "Recalls" list will be empty while Inventory still shows the recalled lot. Re-run `seed:demo` after wiping, or recreate the DB.
* The doc statements "Catalogue 343 drugs" and "5 suppliers" do not match the live data (299 tenant drugs, 560 in the table; 6 suppliers). The `kx_ph_demo_3` order is no longer "new" (EXPIRED) because the SLA job ran.
* The Demo tenant carries test leftovers (`E2E Till Branch (test)`, hundreds of `kx-e2e-*`/`kx_ph_mwo*` Kiorex orders), so Orders counts are far above the 5 demo orders.
* No tax-authority integration exists; VAT is a plain configurable line on receipts.
