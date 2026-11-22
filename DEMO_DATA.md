# Kiorly Pharmacy: demo data and manual test guide (DEV ONLY)

> **DEV ONLY / synthetic.** Fictional tenants, drugs, customers and prescribers; passwords are local development values (the demo seeds refuse to run in production). Providers are mocked. Workspace index: [../DEMO_DATA.md](../DEMO_DATA.md) · shared tables: [../TEST_DATA.md](../TEST_DATA.md) · seed reference: [Docs/TEST_DATA.md](Docs/TEST_DATA.md) · feature coverage: [Docs/FEATURE_MATRIX.md](Docs/FEATURE_MATRIX.md).
> Checked against the API on `:3100` and the `kiorly_pharmacy` database on 21 Nov 2026. The shared dev database is also written by the e2e suites, so **counts drift**; the numbers below are a snapshot, the states are what is guaranteed.

## 1. What this demo is for

A multi-branch chain pharmacy with every stock state (valid, near-expiry, expired, quarantined, recalled), prescriptions in every state, point-of-sale history, purchasing in every state, Kiorex marketplace orders, and a controlled-drug discrepancy that needs a witness. Two more tenants show the editions: a **Solo** (standalone, PRO, no Kiorex) and a **Corner (Lite / BASIC)** pharmacy that shows plan gates.

## 2. Start and seed

```bash
e2e/scripts/up.sh [--build] [--seed]          # workspace root: starts the Pharmacy API :3100 (AUTH_MODE=local, KIOREX_MODE=real) with the other services
cd kiorly-pharmacy && npm run dev -w web       # web on http://localhost:5192 (proxies /api to :3100; port from PHARMACY_WEB_PORT, default 5192)
cd kiorly-pharmacy/apps/api
npm run seed                # base tenant "Kiorly Demo Pharmacy" (org_demo_kiorly, the tenant Kiorex's dev client is bound to)
npm run seed:demo           # idempotent, NEW records only on top of the base tenant
npm run seed:suite          # ~500 drugs, ~150 customers, Rx in every state, ~360 sales, solo tenant (re-runnable)
npm run seed:mobile         # Kiorly Work tenants per plan (Solo PRO, Corner BASIC) + alerts
npm run seed:all            # all four (scripts/seed-all.sh at the workspace root runs seed:demo and seed:mobile in the right order)
npm run seed:demo -- --reset   # best-effort removal of demo sales/Rx/POs/Kiorex orders
```

* **Ports:** the web dev port is configurable and defaults to **5192** (`PHARMACY_WEB_PORT=<port> npm run dev -w web`; API origin override: `PHARMACY_API_ORIGIN`). It used to be 5190, which is the Kiorly Clinic *main* checkout's web port (and 5191 its docs port), so the Pharmacy and Lab webs now default to 5192 / 5193.
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
| Catalogue | **259 shared catalogue rows** (44 base + 215 generated `demo-eg:*`, fictional names) plus 1 Demo-tenant drug from the Kiorly Work seed. The Demo tenant also holds 523 tenant-owned `E2E-Med-*` rows left by e2e runs (524 tenant rows, 785 in the table on 21 Nov), so any total above 260 is e2e noise | Catalogue |
| **Stock lots (Demo tenant)** | ~900 AVAILABLE; **near-expiry** (<= 30 d with stock): 58; **expired** x4 (`DMEXP0..2`, `EXPIRED-DEMO`); **quarantined** x4 (incl. `L00089`, `DM00007`, `DM00008`); **recalled** (`DM00013`, notice source `DEMO-RECALL-001`, plus lots recalled by tests); the matching **RecallNotice** (`source = DEMO-RECALL-001`, ACTIVE, lot `DM00013`) is re-created by `seed:demo` whenever it is missing (the Recalls list also shows 9 `E2E` notices from tests) | Inventory (filter blocked / expiring), Safety, Reports -> expiry |
| Prescriptions (Demo, 121) | RECEIVED 14, VALIDATING 1, VALIDATED 12, REJECTED 36, PARTIALLY_DISPENSED 1, DISPENSED 54, CANCELLED 1, EXPIRED 1, TRANSFERRED_OUT 1 (patients named "... (DEMO)") | Prescriptions queue (`/rx`) |
| POS | 384 sales in the Demo tenant (~45 in the last 30 days, 8 today in the base demo), split payments, returns, exchanges, coupons, shifts and cash movements | Point of sale (`/pos`), Reports, Finance |
| Purchasing | POs DRAFT 2, SENT 1, PARTIALLY_RECEIVED 1, RECEIVED 2, CANCELLED 1; **5 seeded suppliers** (3 marked "(DEMO)" + Delta Medical Supplies + Nile Pharma Distribution; the Demo tenant shows 32 because of 27 `E2E Supplier ...` leftovers) | Purchasing, Receiving |
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

* Mock providers: WhatsApp / SMS / email / push / PSP are mocked by default (real mode is config-only, see section 8); the Kiorex link uses the dev HMAC client (`kx_dev_pharmacy_client`, DEV ONLY).
* Fixed 21 Nov 2026: `RecallNotice` was empty while lot `DM00013` was RECALLED (a test cleanup / `--reset` removed the notice, the append-only lot stayed). `seed:demo` now re-creates the `DEMO-RECALL-001` notice idempotently; re-run it after any wipe.
* Fixed 21 Nov 2026: the older docs said "343 drugs / 5 suppliers". The seed gives 259 shared catalogue rows and 5 suppliers (the live 32 suppliers and 524 tenant drugs include e2e leftovers). `kx_ph_demo_3` is not a "new" order any more: the SLA job expired it, so it is EXPIRED here (`SLA_EXPIRED`) and REJECTED in Kiorex (reason `SLA_EXPIRED`); both docs say so.
* The Demo tenant carries test leftovers (`E2E Till Branch (test)`, hundreds of `kx-e2e-*`/`kx_ph_mwo*` Kiorex orders), so Orders counts are far above the 5 demo orders.
* No tax-authority integration exists; VAT is a plain configurable line on receipts.

## 8. Provider flows in mock mode, and the Provider go-live checklist

**Try every provider flow (mock, DEV ONLY).** As `owner@...` (settings.write): `POST /api/v1/dev/providers/demo/run` sends an order-ready and a refill-reminder WhatsApp, a receipt email and a receipt SMS to dummy recipients (`+201000000001..3`, `customer.demo@example.test`), delivers each receipt through the signed webhook path, then runs pay-by-link success -> refund and a failing link on a credit customer, then a consent grant -> signed revoke on `Demo Consent Customer (DEMO)`, an AI sample (the redacted prompt is returned) and a storage put/get round trip (each skippable: `{"consent":false,"ai":false,"storage":false}`; single ones at `/dev/providers/consent/demo`, `/ai/sample`, `/storage/roundtrip`) (a `Demo Credit Customer (DEMO)` with a 120 balance is created when no account has a balance; paid 1.00 then refunded 1.00, so the balance is unchanged). `GET /api/v1/dev/providers/messages` is the view of everything "sent" (rendered body, QUEUED -> SENT -> DELIVERED); `POST /api/v1/dev/providers/simulate/webhook {"kind":"payment","type":"payment.failed","providerRef":"mocklink_..."}` replays any single callback. All of it is 404 in production. Manual paths: Kiorex order -> accept -> sign-off -> **Ready** (WhatsApp `order.ready` to the order's customer phone); Refills -> run reminders; a sale -> `POST /pos/sales/:id/receipt/send {"channel":"EMAIL","to":"you@example.test"}`; a credit customer -> `POST /pos/customers/:id/pay-link {"sendVia":{"channel":"SMS"}}` -> simulate `payment.succeeded` -> `POST /pos/pay-links/:id/refund`. Recipients ending `-fail` are rejected by the mock (a FAILED message with `REJECTED: ...`); `message.failed` can also be simulated. Details: [Docs/PROVIDERS.md](Docs/PROVIDERS.md).

### Provider go-live checklist (no code change: env/secrets only; staging first)

Add these to the secrets manager / task definition of the Pharmacy API. Nothing else is needed per kind; the app refuses to start if a real MODE is missing something (it names the variable). Run `prisma migrate deploy` first (migrations `20261122090000_0017_provider_go_live`: `PayLink`, `ProviderWebhookEvent`, notification delivery columns, and `20261122120000_0018_consent_registry`: `ConsentRecord`).

| Kind | Set | Secrets / values to add | Provider-side to-do |
|---|---|---|---|
| SMS | `SMS_MODE=real` | `SMS_API_URL`, `SMS_API_KEY`, `SMS_WEBHOOK_SECRET`, `SMS_SENDER_ID` | Register the sender id; point delivery receipts at `https://<pharmacy-api>/api/v1/webhooks/providers/sms` |
| Email | `EMAIL_MODE=real` | `EMAIL_API_URL`, `EMAIL_API_KEY`, `EMAIL_WEBHOOK_SECRET`, `EMAIL_FROM` | Verify the sending domain (SPF/DKIM); webhook `.../webhooks/providers/email` |
| WhatsApp | `WHATSAPP_MODE=real` | `WHATSAPP_API_URL`, `WHATSAPP_API_KEY`, `WHATSAPP_WEBHOOK_SECRET`, `WHATSAPP_SENDER_ID` | Meta-approved EN + AR templates named like the template keys (`order.ready`, `rx.refill_reminder`, `receipt.email`, `paylink.send`, `paylink.receipt`, `expiry.alert`, `shift.variance`, `recall.notice`, `po.send`, `rfq.send`, `order.inbox`; NH-PH-012); webhook `.../webhooks/providers/whatsapp` |
| Payment | `PAYMENT_MODE=real` | `PAYMENT_API_URL`, `PAYMENT_API_KEY`, `PAYMENT_WEBHOOK_SECRET` (optional `PAYMENT_CURRENCY`) | Merchant account (NH-PH-014); webhook `.../webhooks/providers/payment`; reconcile `PayLink` vs the settlement report |
| Consent registry | `CONSENT_MODE=real` | `CONSENT_API_URL`, `CONSENT_API_KEY`, `CONSENT_WEBHOOK_SECRET` | Registry sends `consent.revoked|expired|granted` to `.../webhooks/providers/consent`; confirm the `/consents` + `/consents/introspect` contract (NH-PH-013), else edit `mapping/consent.mapping.ts` |
| AI gateway | `AI_MODE=real` | `AI_API_URL` (OpenAI-compatible base, e.g. the EU endpoint), `AI_API_KEY`, `AI_MODEL` (optional `AI_MAX_INPUT_TOKENS`, `AI_MAX_OUTPUT_TOKENS`, `AI_DAILY_TOKEN_BUDGET`, `AI_COST_PER_1K_TOKENS_USD`) | DPA / data-residency sign-off; `POST /dev/providers/ai/sample` in staging shows the redacted prompt |
| Object storage | `STORAGE_MODE=real` | `STORAGE_API_URL`, `STORAGE_API_KEY` (optional `STORAGE_SIGNING_SECRET`, `STORAGE_MAX_BYTES`, `STORAGE_URL_TTL_SEC`) | Private bucket behind the PUT/GET gateway; copy existing `.data/` files into it (same keys) |
| Push (Kiorly Work) | `PUSH_MODE=real` | `PUSH_API_URL` (Expo: `https://exp.host/--/api/v2/push/send`), optional `PUSH_API_KEY` | Expo project / credentials in the mobile build |

Then: (1) if the vendor's payload or signature differs from the generic shape, edit only `src/providers/mapping/<kind>.mapping.ts`; (2) in a non-production environment `GET /api/v1/dev/providers/status` shows each kind's mode and whether its credentials are set (booleans only); (3) send one real message to your own phone and one 1.00 EGP pay link, check the `Notification` goes SENT -> DELIVERED and the `PayLink` goes PAID; (4) `PROVIDER_DEV_TOOLS=false` (already off when `NODE_ENV=production`).

---
Verified: 2026-11-21 (seed scripts, `kiorly_pharmacy` database via SELECT, web dev port start-up check on 5192).
