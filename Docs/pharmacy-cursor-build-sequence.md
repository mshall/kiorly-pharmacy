# Kiorly Pharmacy — Cursor Build Sequence

> Generated from **KX-06 (Kiorly Pharmacy PRD, Rev 2.2)** and KX-08/KX-09/KX-22/KX-17/KX-18.
> Repo: `mshall/kiorly-pharmacy` · **57 steps** (31 requirement steps, one per PRD requirement ID) in dependency order.
> **Status: skeleton phase.** Steps PH-F01…F06 are done by the scaffold. Everything else is blocked on discovery interviews (PH-D01) and the schema-freeze review (PH-D02).
> Each step = one branch, one PR. Do not reorder; every step only depends on earlier steps.

---

## 0. Instructions for Cursor (read this section first, every session)

### 0.1 Execution protocol

1. Open **§5 Progress tracker** and find the **first unchecked step**. That is the only step you work on.
2. Read that step's section in **§6** (`### Step <ID>`). Do not read ahead.
3. Confirm every step listed in **Depends on** is checked. If not, stop and report the missing dependency.
4. Check the step **Type**: *Code* → implement fully. *Code + human input* → implement the code, list the NEEDS_HUMAN items. *Human task* → prepare only, then stop and ask the human.
5. Before changing code read `.cursor/rules/pharmacy.mdc` and §1 below.
6. Implement in order: Prisma migration (new named migration, never edit an applied one) → API module → DTOs/guards → web UI (BOTH en.json and ar.json) → tests → docs.
7. Write a test for **every acceptance criterion**, then run the checks in §0.2.
8. Tick the step in §5 (`- [x]`) with the commit/PR reference; update Docs status rows.
9. Finish with a short summary: what changed, migrations, tests, follow-ups, **Needs human**.

### 0.2 Commands to run before marking a step done

```bash
npm run db:setup       # DB exists + migrations applied (port 5433)
npm run typecheck      # api (prisma generate + tsc) + web
npm run lint           # web
npm test               # api: unit + e2e; web: locale parity
npm run docs:check
```

### 0.3 Hard stops (ask a human, do not invent)

Prices/fees/VAT/refund policy; legal, clinical or consent wording; marking a launch gate satisfied; production credentials, domains, store accounts, PSP onboarding, AWS changes; breaking a published contract. Record each in `Docs/NEEDS_HUMAN.md`.

---

## 1. Repo rules (also in .cursor/rules/pharmacy.mdc)

1. DRAFT schema until PH-D02. 2. No shared DB, no cross-product imports; HMAC REST + outbox. 3. Flags ON by default; OFF => 403 FEATURE_DISABLED. 4. **Safety controls are never flags** (§3). 5. Explicit `@Inject()` in Nest constructors. 6. Money paths: idempotency key + outbox + ledger + reconciliation test. 7. No PHI in logs. 8. 2025 repos are design notes only (ADR-026). 9. Do not touch infra/ or deploy to AWS.

## 2. Phase map and timing (KX-17 / KX-18; discovery interviews first)

| Phase | When | Notes |
|---|---|---|
| Phase 0 — skeleton + plan | now (Nov 2026) | This repo as scaffolded; no features |
| Discovery | Q3 2027 (pharmacy product lead + clinical pharmacist advisor by M8) | 15 owner-pharmacists, 3 chains; schema freeze (PH-D02) |
| Build MVP | M9 → M12 (Q4 2027), on @kiorly/commerce-kernel | Requirement steps in order; stop-ship suite |
| Pilot | **M13** (Q5, Jan–Mar 2028) | 20 pharmacies, 2 clusters |
| GA | **M16** (Q6) | Kiorex pharmacy orders follow (KPMKT; launch-locked flag kiorex.pharmacy_orders) |

Dates are derived from KX-18 and must be confirmed by the founder; this plan never commits dates externally.

## 3. Safety controls — never flags (ADR-025)

A switch that can disable these is itself a hazard. CI rejects flag keys on safety paths (`apps/api/src/feature-flags/safety-controls.node.test.ts`); the evaluator throws `SafetyControlNotAFlagError`. They exist in **every edition including Lite**. Where possible they are also enforced by database triggers/CHECKs in migration `0001_draft_init`.

| Control id | Rule | Requirements |
|---|---|---|
| `safety.pharmacy.lot_expiry_block` | Sale of an expired lot is impossible | KPINV03 |
| `safety.pharmacy.lot_recall_block` | Sale of a recalled lot is impossible (cross-branch within 5 minutes) | KPINV03, KPSUP03 |
| `safety.pharmacy.lot_quarantine_block` | Sale of a quarantined lot is impossible (cold-chain excursion, recall hold) | KPINV03, KPINV06 |
| `safety.pharmacy.pharmacist_signoff` | Every Rx dispense carries pharmacist user + timestamp | KPRX06 |
| `safety.pharmacy.rx_safety_checks` | Interaction / allergy / duplicate checks run on every Rx | KPRX03 |
| `safety.pharmacy.controlled_substance_log` | Controlled-medicine dispensing log with ID capture; never exposed to Kiorex ordering | KPRX05 |
| `safety.pharmacy.audit_logging` | State changes affecting stock, money, access are audited | KX-08 §09 |
| `safety.pharmacy.consent_enforcement` | e-Rx intake requires a valid patient consent token | KPRX01 |
| `safety.pharmacy.tenant_isolation` | Tenant isolation and authorization | KX-08 §09 |
| `safety.pharmacy.privileged_mfa` | Privileged MFA on production | KX-08 §09 |

Flags that DO exist (ship ON; OFF => 403 FEATURE_DISABLED {key,scope}): `pharmacy.module`, `pharmacy.kiorex_orders`, `pharmacy.forecasting`, `pharmacy.insurer_claims`.

## 4. Step index

| ID | Type | Title | Depends on |
|---|---|---|---|
| PH-F01 | Code | npm workspaces root, CI, CODEOWNERS, .gitignore, README | none |
| PH-F02 | Code | API skeleton: NestJS 10 + Prisma 6, health live/ready | PH-F01 |
| PH-F03 | Code | Feature-flag evaluator stub reading the Kiorex snapshot (never-flag guard) | PH-F02 |
| PH-F04 | Code | DRAFT Prisma schema + initial migration 0001_draft_init (DB-level safety invariants) | PH-F02 |
| PH-F05 | Code | Web shell: AR/EN, RTL, Kiorly styling, coming-soon page | PH-F01 |
| PH-F06 | Docs | Docs hub: build sequence, NEEDS_HUMAN, design notes, ADR reference | PH-F01 |
| PH-D01 | Human task | Discovery interviews (15 owner-pharmacists, 3 chains) | PH-F06 |
| PH-D02 | Code + human input | Schema freeze review: reconcile the DRAFT schema with discovery findings | PH-D01 |
| PH-F07 (safety) | Code | Kiorex Account OIDC auth, tenant + staff + RBAC, tenant isolation guard | PH-D02 |
| PH-F08 (safety) | Code | Audit log + transactional outbox + HMAC REST client/server (Kiorex) | PH-F07 |
| PH-F09 | Code + human input | Consume @kiorly/commerce-kernel (plans, billing, ledger, settlement) | PH-F07 |
| PH-F10 | Code | Flag snapshot cache + flag.changed webhook receiver + per-flag OFF contract-test harness | PH-F08 |
| PH-F11 | Code | Pin @kiorex/contracts SDK; implement consumed/produced event schemas | PH-F08 |
| KPCAT01 | Code + human input | Drug master seeded from Kiorly's Egyptian drug database (brand ↔ active ingredient, strength, form, pack,... | PH-D02, PH-F07 |
| KPCAT02 | Code | Regulatory flags: Rx-only, controlled schedule, cold-chain, OTC; market-specific codes. | PH-D02, PH-F07, KPCAT01 |
| KPCAT03 | Code + human input | Bulk price updates with effective dates; history retained; shelf label printing. | PH-D02, PH-F07, KPCAT01 |
| KPCAT04 | Code | Generic substitution groups by active ingredient + strength + form. | PH-D02, PH-F07, KPCAT01 |
| KPINV01 | Code | Receive by PO or direct: lot, expiry, quantity, cost, supplier invoice; barcode/GS1 scan. | PH-D02, PH-F07, KPCAT01 |
| KPINV02 | Code | FEFO picking (first-expiry-first-out) suggested at POS. | PH-D02, PH-F07, KPINV01 |
| KPINV03 (safety) | Code | Block sale of expired, recalled or quarantined lots; negative stock only with manager permission and audit. | PH-D02, PH-F07, KPINV01 |
| KPINV04 | Code + human input | Near-expiry alerts (90/60/30 days) with return-to-supplier workflow. | PH-D02, PH-F07, KPINV01 |
| KPINV05 | Code | Stock counts (cycle and full) with variance approval. | PH-D02, PH-F07, KPINV01 |
| KPINV06 | Code + human input | Cold-chain items: temperature log entry; excursion → quarantine. | PH-D02, PH-F07, KPINV03 |
| KPRX01 (safety) | Code + human input | Capture Rx: scan paper, receive Kiorly e-Rx (PrescriptionIssued with patient consent), or Kiorex upload. | PH-D02, PH-F07, KPCAT01, PH-F08, PH-F11 |
| KPRX02 | Code | Validate prescriber (Kiorly-verified doctor badge where available), patient, dose, quantity. | PH-D02, PH-F07, KPRX01 |
| KPRX03 (safety) | Code + human input | Interaction / allergy / duplicate checks by active ingredient (shared engine with CL02). | PH-D02, PH-F07, KPRX02 |
| KPRX04 | Code + human input | Substitution requires pharmacist decision and patient consent; recorded. | PH-D02, PH-F07, KPRX03, KPCAT04 |
| KPRX05 (safety) | Code + human input | Controlled medicines: dispensing log per EDA rules, ID capture, quantity limits; never exposed to Kiorex... | PH-D02, PH-F07, KPRX03 |
| KPRX06 (safety) | Code | Pharmacist sign-off (user + timestamp) on every Rx dispense; counselling notes optional. | PH-D02, PH-F07, KPRX03, KPINV02, KPINV03 |
| KPPOS01 | Code | Barcode sale ≤ 3 s per line; offline mode with queued sync. | PH-D02, PH-F07, KPINV02, KPINV03 |
| KPPOS02 | Code + human input | Payments: cash, card, InstaPay, Fawry, wallet; split tender. | PH-D02, PH-F07, KPPOS01, PH-F09 |
| KPPOS03 | Code | Returns and voids with reason and manager approval; restock to correct lot. | PH-D02, PH-F07, KPPOS01 |
| KPPOS04 | Code + human input | Shift open/close, Z-report, variance threshold alert to owner via WhatsApp. | PH-D02, PH-F07, KPPOS01 |
| KPPOS05 | Code | Customer accounts and credit (common in neighbourhood pharmacies) with limits. | PH-D02, PH-F07, KPPOS01 |
| KPPOS06 | Code | Receipt printing (thermal); no tax-authority submission by Kiorly (pharmacy issues its own fiscal documents). | PH-D02, PH-F07, KPPOS01 |
| KPSUP01 | Code | Supplier catalogue, terms, credit balance, payments. | PH-D02, PH-F07 |
| KPSUP02 | Code + human input | Auto-reorder suggestions from min/max and forecast; one-tap PO via WhatsApp/email. | PH-D02, PH-F07, KPSUP01, KPINV01 |
| KPSUP03 (safety) | Code | Recall notices: block affected lots across branches within 5 minutes of entry. | PH-D02, PH-F07, KPSUP01, KPINV03 |
| PH-OFF01 | Code | OFF contract test for pharmacy.module | PH-F10 |
| PH-OFF02 | Code | OFF contract test for pharmacy.kiorex_orders | PH-F10 |
| PH-OFF03 | Code | OFF contract test for pharmacy.forecasting | PH-F10 |
| PH-OFF04 | Code | OFF contract test for pharmacy.insurer_claims | PH-F10 |
| PH-SS01 (safety) | Code | Stop-ship: expired / recalled / quarantined lot sale attempt fails | KPINV03, KPSUP03, KPPOS01 |
| PH-SS02 (safety) | Code | Stop-ship: Rx-only item cannot be dispensed without pharmacist sign-off | KPRX06 |
| PH-SS03 (safety) | Code | Stop-ship: offline POS reconciles | KPPOS01, KPPOS02 |
| PH-SS04 (safety) | Code | Never-flag CI: Rx safety checks, lot blocks and sign-off cannot be switched off | KPRX03, KPINV03, KPRX06, PH-F10 |
| KPINV07 | Code | Available-to-promise per SKU and branch exposed to Kiorex (phase 2). | PH-D02, PH-F07, KPINV02 |
| KPMKT01 | Code + human input | Opt-in per branch; delivery radius, hours, prep time. | PH-D02, PH-F07, KPINV07, PH-F11 |
| KPMKT02 | Code | Order inbox with SLA timer; accept / partial / reject with reason. | PH-D02, PH-F07, KPMKT01 |
| KPMKT03 | Code | Reservation of lots on accept; release on cancel. | PH-D02, PH-F07, KPMKT02, KPINV02 |
| KPMKT04 (safety) | Code | Rx orders require pharmacist validation before acceptance. | PH-D02, PH-F07, KPMKT02, KPRX06 |
| KPMKT05 | Code | DispenseCompleted / OrderReady / OrderRejected events to Kiorex. | PH-D02, PH-F07, KPMKT02, PH-F08 |
| PH-H01 | Human task | Regulatory review: counsel memo | PH-D01 |
| PH-H02 | Human task | Clinical pharmacist sign-off: dispensing and substitution hazard log (KX-16) | PH-D01 |
| PH-H03 | Human task | Stop-ship suite green on the pilot build (evidence archived) | PH-SS01, PH-SS02, PH-SS03, PH-SS04 |
| PH-H04 | Human task | Marketplace readiness: merchant of record + delivery partner decided (Q5); refund flows tested | KPMKT05 |
| PH-P01 | Human task | Pilot readiness review (20 pharmacies, 2 clusters, M13) | PH-H01, PH-H02, PH-H03 |

---

## 5. Progress tracker

- [x] **PH-F01** — npm workspaces root, CI, CODEOWNERS, .gitignore, README (scaffold commit)
- [x] **PH-F02** — API skeleton: NestJS 10 + Prisma 6, health live/ready (scaffold commit)
- [x] **PH-F03** — Feature-flag evaluator stub reading the Kiorex snapshot (never-flag guard) (scaffold commit)
- [x] **PH-F04** — DRAFT Prisma schema + initial migration 0001_draft_init (DB-level safety invariants) (scaffold commit)
- [x] **PH-F05** — Web shell: AR/EN, RTL, Kiorly styling, coming-soon page (scaffold commit)
- [x] **PH-F06** — Docs hub: build sequence, NEEDS_HUMAN, design notes, ADR reference (scaffold commit)
- [ ] **PH-D01** — Discovery interviews (15 owner-pharmacists, 3 chains)
- [ ] **PH-D02** — Schema freeze review: reconcile the DRAFT schema with discovery findings
- [ ] **PH-F07** — Kiorex Account OIDC auth, tenant + staff + RBAC, tenant isolation guard
- [ ] **PH-F08** — Audit log + transactional outbox + HMAC REST client/server (Kiorex)
- [ ] **PH-F09** — Consume @kiorly/commerce-kernel (plans, billing, ledger, settlement)
- [ ] **PH-F10** — Flag snapshot cache + flag.changed webhook receiver + per-flag OFF contract-test harness
- [ ] **PH-F11** — Pin @kiorex/contracts SDK; implement consumed/produced event schemas
- [ ] **KPCAT01** — Drug master seeded from Kiorly's Egyptian drug database (brand ↔ active ingredient, strength, form, pack,...
- [ ] **KPCAT02** — Regulatory flags: Rx-only, controlled schedule, cold-chain, OTC; market-specific codes.
- [ ] **KPCAT03** — Bulk price updates with effective dates; history retained; shelf label printing.
- [ ] **KPCAT04** — Generic substitution groups by active ingredient + strength + form.
- [ ] **KPINV01** — Receive by PO or direct: lot, expiry, quantity, cost, supplier invoice; barcode/GS1 scan.
- [ ] **KPINV02** — FEFO picking (first-expiry-first-out) suggested at POS.
- [ ] **KPINV03** — Block sale of expired, recalled or quarantined lots; negative stock only with manager permission and audit.
- [ ] **KPINV04** — Near-expiry alerts (90/60/30 days) with return-to-supplier workflow.
- [ ] **KPINV05** — Stock counts (cycle and full) with variance approval.
- [ ] **KPINV06** — Cold-chain items: temperature log entry; excursion → quarantine.
- [ ] **KPRX01** — Capture Rx: scan paper, receive Kiorly e-Rx (PrescriptionIssued with patient consent), or Kiorex upload.
- [ ] **KPRX02** — Validate prescriber (Kiorly-verified doctor badge where available), patient, dose, quantity.
- [ ] **KPRX03** — Interaction / allergy / duplicate checks by active ingredient (shared engine with CL02).
- [ ] **KPRX04** — Substitution requires pharmacist decision and patient consent; recorded.
- [ ] **KPRX05** — Controlled medicines: dispensing log per EDA rules, ID capture, quantity limits; never exposed to Kiorex...
- [ ] **KPRX06** — Pharmacist sign-off (user + timestamp) on every Rx dispense; counselling notes optional.
- [ ] **KPPOS01** — Barcode sale ≤ 3 s per line; offline mode with queued sync.
- [ ] **KPPOS02** — Payments: cash, card, InstaPay, Fawry, wallet; split tender.
- [ ] **KPPOS03** — Returns and voids with reason and manager approval; restock to correct lot.
- [ ] **KPPOS04** — Shift open/close, Z-report, variance threshold alert to owner via WhatsApp.
- [ ] **KPPOS05** — Customer accounts and credit (common in neighbourhood pharmacies) with limits.
- [ ] **KPPOS06** — Receipt printing (thermal); no tax-authority submission by Kiorly (pharmacy issues its own fiscal documents).
- [ ] **KPSUP01** — Supplier catalogue, terms, credit balance, payments.
- [ ] **KPSUP02** — Auto-reorder suggestions from min/max and forecast; one-tap PO via WhatsApp/email.
- [ ] **KPSUP03** — Recall notices: block affected lots across branches within 5 minutes of entry.
- [ ] **PH-OFF01** — OFF contract test for pharmacy.module
- [ ] **PH-OFF02** — OFF contract test for pharmacy.kiorex_orders
- [ ] **PH-OFF03** — OFF contract test for pharmacy.forecasting
- [ ] **PH-OFF04** — OFF contract test for pharmacy.insurer_claims
- [ ] **PH-SS01** — Stop-ship: expired / recalled / quarantined lot sale attempt fails
- [ ] **PH-SS02** — Stop-ship: Rx-only item cannot be dispensed without pharmacist sign-off
- [ ] **PH-SS03** — Stop-ship: offline POS reconciles
- [ ] **PH-SS04** — Never-flag CI: Rx safety checks, lot blocks and sign-off cannot be switched off
- [ ] **KPINV07** — Available-to-promise per SKU and branch exposed to Kiorex (phase 2).
- [ ] **KPMKT01** — Opt-in per branch; delivery radius, hours, prep time.
- [ ] **KPMKT02** — Order inbox with SLA timer; accept / partial / reject with reason.
- [ ] **KPMKT03** — Reservation of lots on accept; release on cancel.
- [ ] **KPMKT04** — Rx orders require pharmacist validation before acceptance.
- [ ] **KPMKT05** — DispenseCompleted / OrderReady / OrderRejected events to Kiorex.
- [ ] **PH-H01** — Regulatory review: counsel memo
- [ ] **PH-H02** — Clinical pharmacist sign-off: dispensing and substitution hazard log (KX-16)
- [ ] **PH-H03** — Stop-ship suite green on the pilot build (evidence archived)
- [ ] **PH-H04** — Marketplace readiness: merchant of record + delivery partner decided (Q5); refund flows tested
- [ ] **PH-P01** — Pilot readiness review (20 pharmacies, 2 clusters, M13)

---

## 6. Step details

### Step PH-F01 — npm workspaces root, CI, CODEOWNERS, .gitignore, README

- **Type:** Code
- **Depends on:** none
- **Acceptance criteria (each needs a test):**
  - Workspace installs; CI workflow runs typecheck + tests.

### Step PH-F02 — API skeleton: NestJS 10 + Prisma 6, health live/ready

- **Type:** Code
- **Depends on:** PH-F01
- **Acceptance criteria (each needs a test):**
  - GET /api/v1/health/live and /ready return 200 (health e2e test).

### Step PH-F03 — Feature-flag evaluator stub reading the Kiorex snapshot (never-flag guard)

- **Type:** Code
- **Depends on:** PH-F02
- **Acceptance criteria (each needs a test):**
  - Defaults ON / launch-locked OFF with no snapshot; safety keys throw (unit tests).

### Step PH-F04 — DRAFT Prisma schema + initial migration 0001_draft_init (DB-level safety invariants)

- **Type:** Code
- **Depends on:** PH-F02
- **Acceptance criteria (each needs a test):**
  - Schema smoke test exercises triggers/CHECKs against the real DB.

### Step PH-F05 — Web shell: AR/EN, RTL, Kiorly styling, coming-soon page

- **Type:** Code
- **Depends on:** PH-F01
- **Acceptance criteria (each needs a test):**
  - Locale parity test; page renders and switches direction.

### Step PH-F06 — Docs hub: build sequence, NEEDS_HUMAN, design notes, ADR reference

- **Type:** Docs
- **Depends on:** PH-F01
- **Acceptance criteria (each needs a test):**
  - npm run docs:check passes.

### Step PH-D01 — Discovery interviews (15 owner-pharmacists, 3 chains)

- **Type:** Human task
- **Depends on:** PH-F06
- **Needs human:** NH-PH-001
- **Acceptance criteria (each needs a test):**
  - Synthesis memo filed in Docs/; recommendations on editions, workflows and the draft schema.

### Step PH-D02 — Schema freeze review: reconcile the DRAFT schema with discovery findings

- **Type:** Code + human input
- **Depends on:** PH-D01
- **Needs human:** NH-PH-022
- **Acceptance criteria (each needs a test):**
  - Schema reviewed entity by entity; follow-up migration 0002 lands; banner changed from DRAFT to FROZEN-v1; schema smoke test updated.

### Step PH-F07 — Kiorex Account OIDC auth, tenant + staff + RBAC, tenant isolation guard

- **Type:** Code · **SAFETY PATH (ADR-025, never a flag)**
- **Depends on:** PH-D02
- **Acceptance criteria (each needs a test):**
  - JWT (aud/iss) validated; every query is orgId-scoped (cross-tenant access test).
  - Privileged roles require MFA claim in production.
  - Tenant isolation is not flag-controlled.

### Step PH-F08 — Audit log + transactional outbox + HMAC REST client/server (Kiorex)

- **Type:** Code · **SAFETY PATH (ADR-025, never a flag)**
- **Depends on:** PH-F07
- **Acceptance criteria (each needs a test):**
  - State changes write AuditLog; events written to OutboxEvent in the same transaction.
  - Outbox sender signs webhooks with HMAC; Kiorex de-duplicates on eventId (contract test).

### Step PH-F09 — Consume @kiorly/commerce-kernel (plans, billing, ledger, settlement)

- **Type:** Code + human input
- **Depends on:** PH-F07
- **Needs human:** NH-PH-021
- **Acceptance criteria (each needs a test):**
  - Kernel package installed from GitHub Packages (ADR-027); money path has idempotency key, outbox event, ledger entry, reconciliation test.

### Step PH-F10 — Flag snapshot cache + flag.changed webhook receiver + per-flag OFF contract-test harness

- **Type:** Code
- **Depends on:** PH-F08
- **Needs human:** NH-PH-016
- **Acceptance criteria (each needs a test):**
  - Snapshot persisted in FlagSnapshotCache and survives restart; 30 s poll with If-None-Match; webhook HMAC verified and refreshes immediately.
  - OFF => 403 FEATURE_DISABLED {key,scope}; never hides data.

### Step PH-F11 — Pin @kiorex/contracts SDK; implement consumed/produced event schemas

- **Type:** Code
- **Depends on:** PH-F08
- **Acceptance criteria (each needs a test):**
  - PrescriptionIssued (inbound) and DispenseCompleted / OrderReady / OrderRejected (outbound) validate against kiorex-contracts schemas in contract tests.

### Step KPCAT01 — Drug master seeded from Kiorly's Egyptian drug database (brand ↔ active ingredient, strength, form, pack,...

- **Type:** Code + human input
- **Depends on:** PH-D02, PH-F07
- **Source:** KX-06 KPCAT01 (Catalogue): Drug master seeded from Kiorly's Egyptian drug database (brand ↔ active ingredient, strength, form, pack, GTIN/barcode, price).
- **Module:** apps/api/src/modules/catalogue
- **Schema (draft):** Drug, SubstitutionGroup
- **Needs human:** NH-PH-010 (drug DB licence/seed format)
- **Acceptance criteria (each needs a test):**
  - Seed import is idempotent and maps brand to active ingredient, strength, form, pack, GTIN, price.
  - Search by brand, ingredient or barcode returns in under 300 ms on a 50k-row catalogue (perf test).
  - Re-import after a source update never duplicates rows.

### Step KPCAT02 — Regulatory flags: Rx-only, controlled schedule, cold-chain, OTC; market-specific codes.

- **Type:** Code
- **Depends on:** PH-D02, PH-F07, KPCAT01
- **Source:** KX-06 KPCAT02 (Catalogue): Regulatory flags: Rx-only, controlled schedule, cold-chain, OTC; market-specific codes.
- **Module:** apps/api/src/modules/catalogue
- **Schema (draft):** Drug
- **Acceptance criteria (each needs a test):**
  - Rx-only, controlled schedule, cold-chain, OTC flags and market codes are stored and filterable.
  - Controlled-schedule drugs are excluded from every Kiorex-facing projection (test).

### Step KPCAT03 — Bulk price updates with effective dates; history retained; shelf label printing.

- **Type:** Code + human input
- **Depends on:** PH-D02, PH-F07, KPCAT01
- **Source:** KX-06 KPCAT03 (Catalogue): Bulk price updates with effective dates; history retained; shelf label printing.
- **Module:** apps/api/src/modules/catalogue
- **Schema (draft):** PriceBookEntry
- **Needs human:** NH-PH-006 (price update source, label format)
- **Acceptance criteria (each needs a test):**
  - Bulk update with effective dates never mutates history rows (append/close only).
  - Price at time of sale is resolvable for any past date.
  - Shelf-label print template renders AR/EN.

### Step KPCAT04 — Generic substitution groups by active ingredient + strength + form.

- **Type:** Code
- **Depends on:** PH-D02, PH-F07, KPCAT01
- **Source:** KX-06 KPCAT04 (Catalogue): Generic substitution groups by active ingredient + strength + form.
- **Module:** apps/api/src/modules/catalogue
- **Schema (draft):** SubstitutionGroup
- **Acceptance criteria (each needs a test):**
  - Groups are exactly ingredient + strength + form; a drug belongs to at most one group.
  - Substitution suggestions at POS list only same-group, in-stock, non-blocked lots.

### Step KPINV01 — Receive by PO or direct: lot, expiry, quantity, cost, supplier invoice; barcode/GS1 scan.

- **Type:** Code
- **Depends on:** PH-D02, PH-F07, KPCAT01
- **Source:** KX-06 KPINV01 (Inventory): Receive by PO or direct: lot, expiry, quantity, cost, supplier invoice; barcode/GS1 scan.
- **Module:** apps/api/src/modules/inventory
- **Schema (draft):** StockLot, StockMovement, PurchaseOrder, Supplier
- **Acceptance criteria (each needs a test):**
  - Receipt (by PO or direct) creates a lot with lot number, expiry, cost, supplier invoice and a RECEIPT movement in one transaction.
  - GS1/barcode scan prefills drug, lot and expiry.
  - Duplicate (branch, drug, lot) receipt adds to the existing lot, never a second row.

### Step KPINV02 — FEFO picking (first-expiry-first-out) suggested at POS.

- **Type:** Code
- **Depends on:** PH-D02, PH-F07, KPINV01
- **Source:** KX-06 KPINV02 (Inventory): FEFO picking (first-expiry-first-out) suggested at POS.
- **Module:** apps/api/src/modules/inventory
- **Schema (draft):** StockLot
- **Acceptance criteria (each needs a test):**
  - Suggested pick is the earliest-expiry AVAILABLE lot with stock (FEFO) for the branch.
  - Ties break by received date; blocked lots are never suggested.

### Step KPINV03 — Block sale of expired, recalled or quarantined lots; negative stock only with manager permission and audit.

- **Type:** Code · **SAFETY PATH (ADR-025, never a flag)**
- **Depends on:** PH-D02, PH-F07, KPINV01
- **Source:** KX-06 KPINV03 (Inventory): Block sale of expired, recalled or quarantined lots; negative stock only with manager permission and audit.
- **Module:** apps/api/src/modules/inventory
- **Schema (draft):** StockLot, StockMovement
- **Acceptance criteria (each needs a test):**
  - Expired, recalled and quarantined lots cannot be sold or dispensed (service check AND DB trigger).
  - Negative stock only with manager permission; the approver is recorded on the movement and audited.
  - Stop-ship test PH-SS01 passes.

### Step KPINV04 — Near-expiry alerts (90/60/30 days) with return-to-supplier workflow.

- **Type:** Code + human input
- **Depends on:** PH-D02, PH-F07, KPINV01
- **Source:** KX-06 KPINV04 (Inventory): Near-expiry alerts (90/60/30 days) with return-to-supplier workflow.
- **Module:** apps/api/src/modules/inventory
- **Schema (draft):** StockLot
- **Needs human:** NH-PH-012 (WhatsApp/email alert templates)
- **Acceptance criteria (each needs a test):**
  - Alerts fire at 90/60/30 days before expiry per lot, once per threshold.
  - Return-to-supplier workflow posts RETURN_TO_SUPPLIER movements and updates supplier balance.

### Step KPINV05 — Stock counts (cycle and full) with variance approval.

- **Type:** Code
- **Depends on:** PH-D02, PH-F07, KPINV01
- **Source:** KX-06 KPINV05 (Inventory): Stock counts (cycle and full) with variance approval.
- **Module:** apps/api/src/modules/inventory
- **Schema (draft):** StockCount, StockCountLine
- **Acceptance criteria (each needs a test):**
  - Cycle and full counts record expected vs counted per lot.
  - Variances post COUNT_VARIANCE movements only after approval by a different user.

### Step KPINV06 — Cold-chain items: temperature log entry; excursion → quarantine.

- **Type:** Code + human input
- **Depends on:** PH-D02, PH-F07, KPINV03
- **Source:** KX-06 KPINV06 (Inventory): Cold-chain items: temperature log entry; excursion → quarantine.
- **Module:** apps/api/src/modules/inventory
- **Schema (draft):** ColdChainReading, StockLot
- **Needs human:** NH-PH-011 (excursion thresholds per product class, clinical pharmacist)
- **Acceptance criteria (each needs a test):**
  - Cold-chain lots require a temperature entry at receipt.
  - An excursion reading moves the lot to QUARANTINE and blocks sale immediately.

### Step KPRX01 — Capture Rx: scan paper, receive Kiorly e-Rx (PrescriptionIssued with patient consent), or Kiorex upload.

- **Type:** Code + human input · **SAFETY PATH (ADR-025, never a flag)**
- **Depends on:** PH-D02, PH-F07, KPCAT01, PH-F08, PH-F11
- **Source:** KX-06 KPRX01 (Prescriptions & dispensing): Capture Rx: scan paper, receive Kiorly e-Rx (PrescriptionIssued with patient consent), or Kiorex upload.
- **Module:** apps/api/src/modules/prescriptions
- **Schema (draft):** Prescription, PrescriptionLine, PatientRef
- **Needs human:** NH-PH-004 (e-Rx acceptance legal), NH-PH-013 (consent token spec)
- **Acceptance criteria (each needs a test):**
  - Paper scan, Kiorly e-Rx and Kiorex upload create a Prescription with the right source.
  - PrescriptionIssued without a valid consent token is rejected (consent enforcement, never a flag).
  - Re-delivery of the same event id is a no-op (idempotent on orgId + sourceEventId).
  - Only the SHA-256 of the consent token is stored.

### Step KPRX02 — Validate prescriber (Kiorly-verified doctor badge where available), patient, dose, quantity.

- **Type:** Code
- **Depends on:** PH-D02, PH-F07, KPRX01
- **Source:** KX-06 KPRX02 (Prescriptions & dispensing): Validate prescriber (Kiorly-verified doctor badge where available), patient, dose, quantity.
- **Module:** apps/api/src/modules/prescriptions
- **Schema (draft):** Prescription
- **Acceptance criteria (each needs a test):**
  - Prescriber badge, patient, dose and quantity validated; failures list actionable reasons.
  - Missing Kiorly-verified badge degrades to manual verification, never silent accept.

### Step KPRX03 — Interaction / allergy / duplicate checks by active ingredient (shared engine with CL02).

- **Type:** Code + human input · **SAFETY PATH (ADR-025, never a flag)**
- **Depends on:** PH-D02, PH-F07, KPRX02
- **Source:** KX-06 KPRX03 (Prescriptions & dispensing): Interaction / allergy / duplicate checks by active ingredient (shared engine with CL02).
- **Module:** apps/api/src/modules/prescriptions
- **Schema (draft):** SafetyCheckResult
- **Needs human:** NH-PH-009 (interaction dataset source and clinical sign-off)
- **Acceptance criteria (each needs a test):**
  - Interaction, allergy and duplicate-therapy checks run by active ingredient on every Rx dispensing.
  - A BLOCK outcome cannot proceed without an attributed pharmacist override with reason.
  - The checks cannot be disabled by any flag, setting or edition (test PH-SS04).

### Step KPRX04 — Substitution requires pharmacist decision and patient consent; recorded.

- **Type:** Code + human input
- **Depends on:** PH-D02, PH-F07, KPRX03, KPCAT04
- **Source:** KX-06 KPRX04 (Prescriptions & dispensing): Substitution requires pharmacist decision and patient consent; recorded.
- **Module:** apps/api/src/modules/dispensing
- **Schema (draft):** DispensingLine
- **Needs human:** NH-PH-008 (patient consent wording AR/EN)
- **Acceptance criteria (each needs a test):**
  - A substitution line stores substitutedFromDrugId, pharmacist decision and patient consent.
  - Substitution without recorded consent is rejected.

### Step KPRX05 — Controlled medicines: dispensing log per EDA rules, ID capture, quantity limits; never exposed to Kiorex...

- **Type:** Code + human input · **SAFETY PATH (ADR-025, never a flag)**
- **Depends on:** PH-D02, PH-F07, KPRX03
- **Source:** KX-06 KPRX05 (Prescriptions & dispensing): Controlled medicines: dispensing log per EDA rules, ID capture, quantity limits; never exposed to Kiorex ordering.
- **Module:** apps/api/src/modules/dispensing
- **Schema (draft):** ControlledSubstanceLogEntry, Dispensing
- **Needs human:** NH-PH-004 (EDA controlled-medicine logging rules)
- **Acceptance criteria (each needs a test):**
  - Dispensing a controlled drug requires ID capture (hash + last4) and writes a log entry.
  - Quantity limits enforced per rule set; controlled items never appear in Kiorex ordering projections.

### Step KPRX06 — Pharmacist sign-off (user + timestamp) on every Rx dispense; counselling notes optional.

- **Type:** Code · **SAFETY PATH (ADR-025, never a flag)**
- **Depends on:** PH-D02, PH-F07, KPRX03, KPINV02, KPINV03
- **Source:** KX-06 KPRX06 (Prescriptions & dispensing): Pharmacist sign-off (user + timestamp) on every Rx dispense; counselling notes optional.
- **Module:** apps/api/src/modules/dispensing
- **Schema (draft):** Dispensing, DispensingLine, OutboxEvent
- **Acceptance criteria (each needs a test):**
  - Every Rx dispense carries pharmacist user + timestamp (service check AND DB CHECK).
  - DispenseCompleted is written to the outbox in the same transaction and only when sign-off is present.
  - Stop-ship test PH-SS02 passes.

### Step KPPOS01 — Barcode sale ≤ 3 s per line; offline mode with queued sync.

- **Type:** Code
- **Depends on:** PH-D02, PH-F07, KPINV02, KPINV03
- **Source:** KX-06 KPPOS01 (POS & money): Barcode sale ≤ 3 s per line; offline mode with queued sync.
- **Module:** apps/api/src/modules/pos
- **Schema (draft):** Sale, SaleLine
- **Acceptance criteria (each needs a test):**
  - Barcode line add completes in 3 s or less (p95 perf test).
  - Offline mode queues sales with idempotency keys; sync is replay-safe.
  - Stop-ship test PH-SS03 (offline POS reconciles) passes.

### Step KPPOS02 — Payments: cash, card, InstaPay, Fawry, wallet; split tender.

- **Type:** Code + human input
- **Depends on:** PH-D02, PH-F07, KPPOS01, PH-F09
- **Source:** KX-06 KPPOS02 (POS & money): Payments: cash, card, InstaPay, Fawry, wallet; split tender.
- **Module:** apps/api/src/modules/pos
- **Schema (draft):** SalePayment
- **Needs human:** NH-PH-014 (Fawry/InstaPay/wallet PSP accounts)
- **Acceptance criteria (each needs a test):**
  - Cash, card, InstaPay, Fawry, wallet and split tender sum exactly to the sale total.
  - Money path has idempotency key, outbox event, ledger entry and reconciliation test (kernel).

### Step KPPOS03 — Returns and voids with reason and manager approval; restock to correct lot.

- **Type:** Code
- **Depends on:** PH-D02, PH-F07, KPPOS01
- **Source:** KX-06 KPPOS03 (POS & money): Returns and voids with reason and manager approval; restock to correct lot.
- **Module:** apps/api/src/modules/pos
- **Schema (draft):** SaleReturn, StockMovement
- **Acceptance criteria (each needs a test):**
  - Returns and voids need a reason and manager approval.
  - Restock goes to the original lot unless that lot is blocked (then QUARANTINE).

### Step KPPOS04 — Shift open/close, Z-report, variance threshold alert to owner via WhatsApp.

- **Type:** Code + human input
- **Depends on:** PH-D02, PH-F07, KPPOS01
- **Source:** KX-06 KPPOS04 (POS & money): Shift open/close, Z-report, variance threshold alert to owner via WhatsApp.
- **Module:** apps/api/src/modules/pos
- **Schema (draft):** Shift
- **Needs human:** NH-PH-012 (owner variance WhatsApp template; variance threshold)
- **Acceptance criteria (each needs a test):**
  - Z-report totals equal the ledger for the shift.
  - Variance above threshold queues an owner alert (log mode locally).

### Step KPPOS05 — Customer accounts and credit (common in neighbourhood pharmacies) with limits.

- **Type:** Code
- **Depends on:** PH-D02, PH-F07, KPPOS01
- **Source:** KX-06 KPPOS05 (POS & money): Customer accounts and credit (common in neighbourhood pharmacies) with limits.
- **Module:** apps/api/src/modules/pos
- **Schema (draft):** CustomerAccount
- **Acceptance criteria (each needs a test):**
  - Credit sales are refused beyond the account limit.
  - Payments reduce balance via ledger entries, never direct edits.

### Step KPPOS06 — Receipt printing (thermal); no tax-authority submission by Kiorly (pharmacy issues its own fiscal documents).

- **Type:** Code
- **Depends on:** PH-D02, PH-F07, KPPOS01
- **Source:** KX-06 KPPOS06 (POS & money): Receipt printing (thermal); no tax-authority submission by Kiorly (pharmacy issues its own fiscal documents).
- **Module:** apps/api/src/modules/pos
- **Schema (draft):** Sale
- **Acceptance criteria (each needs a test):**
  - Thermal receipt renders AR/EN at 58/80 mm.
  - No tax-authority submission exists anywhere in the codebase (test greps for it, mirrors ADR-011).

### Step KPSUP01 — Supplier catalogue, terms, credit balance, payments.

- **Type:** Code
- **Depends on:** PH-D02, PH-F07
- **Source:** KX-06 KPSUP01 (Suppliers): Supplier catalogue, terms, credit balance, payments.
- **Module:** apps/api/src/modules/suppliers
- **Schema (draft):** Supplier
- **Acceptance criteria (each needs a test):**
  - Supplier catalogue with terms and credit balance; payments post to the kernel ledger.

### Step KPSUP02 — Auto-reorder suggestions from min/max and forecast; one-tap PO via WhatsApp/email.

- **Type:** Code + human input
- **Depends on:** PH-D02, PH-F07, KPSUP01, KPINV01
- **Source:** KX-06 KPSUP02 (Suppliers): Auto-reorder suggestions from min/max and forecast; one-tap PO via WhatsApp/email.
- **Module:** apps/api/src/modules/suppliers
- **Schema (draft):** PurchaseOrder, PurchaseOrderLine
- **Flag:** `pharmacy.forecasting` (ships ON; OFF contract test required)
- **Needs human:** NH-PH-012 (PO WhatsApp/email templates)
- **Acceptance criteria (each needs a test):**
  - Suggestions come from min/max; forecast suggestions only when pharmacy.forecasting is ON.
  - OFF behaviour: min/max reorder only (per-flag OFF contract test).

### Step KPSUP03 — Recall notices: block affected lots across branches within 5 minutes of entry.

- **Type:** Code · **SAFETY PATH (ADR-025, never a flag)**
- **Depends on:** PH-D02, PH-F07, KPSUP01, KPINV03
- **Source:** KX-06 KPSUP03 (Suppliers): Recall notices: block affected lots across branches within 5 minutes of entry.
- **Module:** apps/api/src/modules/suppliers
- **Schema (draft):** RecallNotice, StockLot
- **Acceptance criteria (each needs a test):**
  - A recall entry blocks all matching lots in every branch of the tenant within 5 minutes (timer test).
  - Lifting a recall requires a manager and audit entry.

### Step PH-OFF01 — OFF contract test for pharmacy.module

- **Type:** Code
- **Depends on:** PH-F10
- **Acceptance criteria (each needs a test):**
  - With pharmacy.module OFF: No new sign-ups; existing tenants read-only with export. Responses are 403 FEATURE_DISABLED {key,scope}; no data is hidden; export still works.

### Step PH-OFF02 — OFF contract test for pharmacy.kiorex_orders

- **Type:** Code
- **Depends on:** PH-F10
- **Acceptance criteria (each needs a test):**
  - With pharmacy.kiorex_orders OFF: Order inbox hidden; stock not exposed to Kiorex. Responses are 403 FEATURE_DISABLED {key,scope}; no data is hidden; export still works.

### Step PH-OFF03 — OFF contract test for pharmacy.forecasting

- **Type:** Code
- **Depends on:** PH-F10
- **Acceptance criteria (each needs a test):**
  - With pharmacy.forecasting OFF: Min/max reorder only. Responses are 403 FEATURE_DISABLED {key,scope}; no data is hidden; export still works.

### Step PH-OFF04 — OFF contract test for pharmacy.insurer_claims

- **Type:** Code
- **Depends on:** PH-F10
- **Acceptance criteria (each needs a test):**
  - With pharmacy.insurer_claims OFF: Cash/self-pay only. Responses are 403 FEATURE_DISABLED {key,scope}; no data is hidden; export still works.

### Step PH-SS01 — Stop-ship: expired / recalled / quarantined lot sale attempt fails

- **Type:** Code · **SAFETY PATH (ADR-025, never a flag)**
- **Depends on:** KPINV03, KPSUP03, KPPOS01
- **Acceptance criteria (each needs a test):**
  - Service AND DB reject; attempt is audited; no stock movement is written.

### Step PH-SS02 — Stop-ship: Rx-only item cannot be dispensed without pharmacist sign-off

- **Type:** Code · **SAFETY PATH (ADR-025, never a flag)**
- **Depends on:** KPRX06
- **Acceptance criteria (each needs a test):**
  - Dispensing cannot reach DISPENSED and DispenseCompleted is never emitted without sign-off.

### Step PH-SS03 — Stop-ship: offline POS reconciles

- **Type:** Code · **SAFETY PATH (ADR-025, never a flag)**
- **Depends on:** KPPOS01, KPPOS02
- **Acceptance criteria (each needs a test):**
  - Replaying a queued offline day produces ledger totals identical to the expected, with no double-sales.

### Step PH-SS04 — Never-flag CI: Rx safety checks, lot blocks and sign-off cannot be switched off

- **Type:** Code · **SAFETY PATH (ADR-025, never a flag)**
- **Depends on:** KPRX03, KPINV03, KPRX06, PH-F10
- **Acceptance criteria (each needs a test):**
  - Static test rejects flag usage on safety paths; evaluator throws for safety keys; end-to-end test with every flag OFF still enforces all blocks.

### Step KPINV07 — Available-to-promise per SKU and branch exposed to Kiorex (phase 2).

- **Type:** Code · phase 2
- **Depends on:** PH-D02, PH-F07, KPINV02
- **Source:** KX-06 KPINV07 (Inventory): Available-to-promise per SKU and branch exposed to Kiorex (phase 2).
- **Module:** apps/api/src/modules/inventory
- **Schema (draft):** StockLot
- **Flag:** `pharmacy.kiorex_orders` (ships ON; OFF contract test required)
- **Acceptance criteria (each needs a test):**
  - Available-to-promise per SKU and branch = sum(AVAILABLE qty) - reserved, excluding blocked lots and controlled drugs.
  - OFF behaviour: stock is not exposed to Kiorex (contract test).

### Step KPMKT01 — Opt-in per branch; delivery radius, hours, prep time.

- **Type:** Code + human input · phase 2
- **Depends on:** PH-D02, PH-F07, KPINV07, PH-F11
- **Source:** KX-06 KPMKT01 (Kiorex orders (phase 2)): Opt-in per branch; delivery radius, hours, prep time.
- **Module:** apps/api/src/modules/marketplace
- **Schema (draft):** Branch
- **Flag:** `pharmacy.kiorex_orders` (ships ON; OFF contract test required)
- **Needs human:** NH-PH-015 (marketplace launch gate: merchant of record, delivery partner)
- **Acceptance criteria (each needs a test):**
  - Opt-in per branch with delivery radius, hours and prep time.
  - OFF behaviour: order inbox hidden; stock not exposed.

### Step KPMKT02 — Order inbox with SLA timer; accept / partial / reject with reason.

- **Type:** Code · phase 2
- **Depends on:** PH-D02, PH-F07, KPMKT01
- **Source:** KX-06 KPMKT02 (Kiorex orders (phase 2)): Order inbox with SLA timer; accept / partial / reject with reason.
- **Module:** apps/api/src/modules/marketplace
- **Schema (draft):** Sale
- **Flag:** `pharmacy.kiorex_orders` (ships ON; OFF contract test required)
- **Acceptance criteria (each needs a test):**
  - Inbox shows an SLA timer; accept, partial and reject all require a reason where applicable.

### Step KPMKT03 — Reservation of lots on accept; release on cancel.

- **Type:** Code · phase 2
- **Depends on:** PH-D02, PH-F07, KPMKT02, KPINV02
- **Source:** KX-06 KPMKT03 (Kiorex orders (phase 2)): Reservation of lots on accept; release on cancel.
- **Module:** apps/api/src/modules/marketplace
- **Schema (draft):** StockLot, StockMovement
- **Flag:** `pharmacy.kiorex_orders` (ships ON; OFF contract test required)
- **Acceptance criteria (each needs a test):**
  - Accept reserves FEFO lots (RESERVE movements); cancel releases them.

### Step KPMKT04 — Rx orders require pharmacist validation before acceptance.

- **Type:** Code · **SAFETY PATH (ADR-025, never a flag)** · phase 2
- **Depends on:** PH-D02, PH-F07, KPMKT02, KPRX06
- **Source:** KX-06 KPMKT04 (Kiorex orders (phase 2)): Rx orders require pharmacist validation before acceptance.
- **Module:** apps/api/src/modules/marketplace
- **Schema (draft):** Prescription, Dispensing
- **Flag:** `pharmacy.kiorex_orders` (ships ON; OFF contract test required)
- **Acceptance criteria (each needs a test):**
  - An Rx order cannot be accepted before pharmacist validation and sign-off.

### Step KPMKT05 — DispenseCompleted / OrderReady / OrderRejected events to Kiorex.

- **Type:** Code · phase 2
- **Depends on:** PH-D02, PH-F07, KPMKT02, PH-F08
- **Source:** KX-06 KPMKT05 (Kiorex orders (phase 2)): DispenseCompleted / OrderReady / OrderRejected events to Kiorex.
- **Module:** apps/api/src/modules/marketplace
- **Schema (draft):** OutboxEvent
- **Flag:** `pharmacy.kiorex_orders` (ships ON; OFF contract test required)
- **Acceptance criteria (each needs a test):**
  - DispenseCompleted / OrderReady / OrderRejected conform to kiorex-contracts and carry pharmacist sign-off where required.

### Step PH-H01 — Regulatory review: counsel memo

- **Type:** Human task
- **Depends on:** PH-D01
- **Needs human:** NH-PH-004
- **Acceptance criteria (each needs a test):**
  - Memo on pharmacy software, controlled-medicine logging, e-Rx acceptance and online ordering filed; launch-locked flag kiorex.pharmacy_orders gate evidence recorded by a human.

### Step PH-H02 — Clinical pharmacist sign-off: dispensing and substitution hazard log (KX-16)

- **Type:** Human task
- **Depends on:** PH-D01
- **Needs human:** NH-PH-005
- **Acceptance criteria (each needs a test):**
  - Hazard log reviewed and signed; each hazard maps to a safety control and a stop-ship test.

### Step PH-H03 — Stop-ship suite green on the pilot build (evidence archived)

- **Type:** Human task
- **Depends on:** PH-SS01, PH-SS02, PH-SS03, PH-SS04
- **Acceptance criteria (each needs a test):**
  - Founder/QA records the CI run id; marking a launch gate satisfied is a human action only.

### Step PH-H04 — Marketplace readiness: merchant of record + delivery partner decided (Q5); refund flows tested

- **Type:** Human task
- **Depends on:** KPMKT05
- **Needs human:** NH-PH-015
- **Acceptance criteria (each needs a test):**
  - Decisions recorded; refund flow test evidence attached.

### Step PH-P01 — Pilot readiness review (20 pharmacies, 2 clusters, M13)

- **Type:** Human task
- **Depends on:** PH-H01, PH-H02, PH-H03
- **Needs human:** NH-PH-019
- **Acceptance criteria (each needs a test):**
  - All STOP items in NEEDS_HUMAN closed; pilot cohort named; support rota agreed.
