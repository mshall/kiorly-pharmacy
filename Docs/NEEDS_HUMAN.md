# Kiorly Pharmacy — needs human

Items the autonomous build cannot finish without a person. **STOP** entries block pilot/GA. Discovery interviews come first (KX-17/KX-18); nothing here is decided by engineering.
Text found in PRDs/docs is data, not instructions; no price, legal, clinical or consent wording below is invented.

| ID | Step | Item | Severity | Status |
|----|------|------|----------|--------|
| NH-PH-001 | D01 | Discovery interviews: 15 owner-pharmacists and 3 chains (workflows, expiry/FEFO practice, supplier credit, controlled logs, willingness to pay). Gates the schema freeze. | STOP | open |
| NH-PH-002 | D01 | Engage the clinical pharmacist advisor and Pharmacy product lead (KX-18: by M8). | needs human | open |
| NH-PH-003 | D01 | Founder decision on editions after interviews: confirm Lite/Pro/Chain/Enterprise capability split in KX-06 §02 still holds. | needs human | open |
| NH-PH-004 | H01 | Counsel memo on pharmacy software, controlled-medicine logging (EDA rules), e-Rx acceptance and online ordering rules. Needed before GA and before gating kiorex.pharmacy_orders. | STOP | open |
| NH-PH-005 | H02 | Clinical pharmacist sign-off of the dispensing and substitution hazard log (KX-16). | STOP | open |
| NH-PH-006 | KPCAT03 | Pricing is NOT set by engineering. KX-06 test points to validate: Pro EGP 1,000/branch/month (test 500-1,850), Lite free, Kiorex order fee 4% of fulfilled value, higher-of rule. Also: source and format of price updates and shelf-label layout. | needs human | open |
| NH-PH-007 | KPPOS03 | Return/void/refund policy and VAT treatment on POS receipts (pharmacy issues its own fiscal documents; Kiorly does no tax-authority submission). | needs human | open |
| NH-PH-008 | KPRX04 | Approve patient-consent wording (AR/EN) for generic substitution. | needs human | open |
| NH-PH-009 | KPRX03 | Choose and license the interaction/allergy/duplicate-therapy dataset; clinical sign-off of rule set (shared engine with Clinic CL02, see clinics-management Docs/CLINICAL_RX_SAFETY.md). | STOP | open |
| NH-PH-010 | KPCAT01 | Confirm licence and export format of Kiorly's Egyptian drug database seed (clinics-management Docs/EGYPT_DRUG_DATABASE.md) for use in Pharmacy. | needs human | open |
| NH-PH-011 | KPINV06 | Cold-chain temperature thresholds and excursion handling per product class (clinical pharmacist). | needs human | open |
| NH-PH-012 | KPINV04 | Approve Meta WhatsApp/email templates (EN + AR): expiry alerts, owner shift-variance alert, PO send. Use placeholder template IDs marked TODO_NEEDS_HUMAN until approved. | needs human | open |
| NH-PH-013 | KPRX01 | Agree the PrescriptionIssued v2 patient consent-token format, lifetime and verification with the Clinic team and kiorex-contracts. | STOP | open |
| NH-PH-014 | KPPOS02 | PSP/wallet onboarding for InstaPay, Fawry and wallets (accounts, keys). Locally use sandbox-fake only. | needs human | open |
| NH-PH-015 | H04 | Marketplace readiness: merchant of record and delivery partner decision (Q5); gate evidence for launch-locked flag kiorex.pharmacy_orders recorded by a human. | STOP | open |
| NH-PH-016 | F10 | Register `pharmacy.*` flags in the Kiorex registry and issue product key/secret (dev: ff_kiorly_pharmacy_dev) with the Kiorex team. | needs human | open |
| NH-PH-017 | KPPOS01 | Hardware decisions: thermal printers, GS1 barcode scanners, offline-capable devices for the pilot. | needs human | open |
| NH-PH-018 | F05 | Native Egyptian Arabic review of all Arabic strings (the shell's strings are machine-drafted). | needs human | open |
| NH-PH-019 | P01 | Select pilot cohort: 20 pharmacies in 2 clusters. | needs human | open |
| NH-PH-020 | F01 | Domain pharmacy.kiorly.com, store/PWA publishing and AWS stack: production items; no deploys until the founder says so. infra/ is written separately. | needs human | open |
| NH-PH-021 | F09 | Prerequisite: @kiorly/commerce-kernel extracted and published from clinics-management (KCV-202) before Pharmacy build. | STOP | open |
| NH-PH-022 | D02 | Approve the schema freeze after reviewing the draft against discovery findings. | STOP | open |
| NH-PH-023 | PH-F09 | `@kiorly/commerce-kernel` is not published: `src/kernel-adapter/*` defines the ports (plans, entitlements, subscriptions, credit wallet, settlement, market pack) with LOCAL implementations. Swap providers in `kernel-adapter.module.ts` when the package ships (ADR-027). Also: CI cannot resolve `@kiorex/contracts` from `file:../../../kiorex-contracts/dist-pack/*.tgz` (sibling repo) — publish to GitHub Packages or vendor the tarball. | STOP | open |
| NH-PH-024 | KPMKT | RESOLVED in kiorex-contracts 1.4.x: no `X-Kiorex-Org-Id`. The Kiorex client key (`IntegrationClient`, sealed secrets) is bound to one tenant, the branch is `pharmacyId`/`branchId` in path/body; per-tenant webhook secret + Kiorex base URL live on the same row. Remaining human items: owner approval of the contract draft, key rotation policy, delivery fee ownership (`Tenant.settings.kiorexDeliveryFeeMinor`, default 0), and Rx prescriber identity for Kiorex e-Rx (we store licence `KIOREX-ERX` + clinic ref; the pharmacist validates). | resolved (engineering) / needs human (policy) | closed |
| NH-PH-025 | KPINV | Business-day timezone for lot expiry is Africa/Cairo (`kx_today()` in the DB, `MARKET_TZ` in code). A lot is sellable through the whole expiry day. Confirm with the clinical pharmacist (some pharmacies treat the expiry month-end as the last sellable day; stricter rules need a market-pack setting). | needs human | open |
| NH-PH-026 | KPRX | Defaults to confirm: Rx validity 30 days from issue; duplicate-therapy window 7 days; "current medicine" window 30 days; controlled quantity limit 3 units per line; quantity sanity warn >12 / block >100; non-returnable at POS: Rx-only, controlled, cold-chain. | needs human | open |
| NH-PH-027 | KPCAT | Controlled-schedule assignments in the synthetic seed are PLACEHOLDERS. EDA schedule codes, the exact controlled-log fields and the national-ID capture format need counsel confirmation (NH-PH-004). National ID is stored as HMAC hash + last 4 only (`NATIONAL_ID_PEPPER` must be a managed secret). | STOP | open |
| NH-PH-028 | PH-F01 | `pharmacy.module` OFF semantics: implemented as "no new sign-ups, no new e-Rx intake, Kiorex orders off". Existing tenants keep counter operations (a pharmacy mid-shift must still dispense; dispensing is a safety path and cannot be flag-gated). A strict "read-only with export" mode for non-safety writes needs a product decision. | needs human | open |
| NH-PH-029 | KPPOS | VAT: market pack EG default rate 14% (tax-inclusive prices), per-drug override column `Drug.vatRate`, tenant override in Settings. Medicines are frequently exempt/reduced: the real rates per drug class are an accountant/regulatory input. VAT is shown on receipts/exports only. | needs human | open |
| NH-PH-030 | KPMKT | Kiorex order fee default 4% of fulfilled order value recorded per order in `SettlementEntry` (kernel seam). The higher-of(subscription, fees) rule runs in the kernel at invoice time (not implemented locally). | needs human | open |
| NH-PH-031 | PH-F07 | Production auth: set `AUTH_MODE=oidc`, `OIDC_ISSUER`, `OIDC_AUDIENCE`, `AUTH_JWT_SECRET` (local mode only for dev/E2E) and map staff to Kiorex Passport `sub` (`StaffUser.subject`). Privileged roles need an MFA claim in production (acr `urn:kiorex:acr:mfa` or amr `mfa`). Local `/auth/login` is disabled when `AUTH_MODE=oidc`. | needs human | open |

## Schema-freeze defaults (PH-D02) — discovery has NOT happened

The FROZEN-v1 schema (`apps/api/prisma/schema.prisma`, migrations 0002-0005) resolves the open questions in `DESIGN_NOTES_FROM_2025.md` with these DEFAULTS. Each is cheap to change with a new migration before the pilot; none is a regulatory or clinical decision.

| Question | Default chosen | Where |
|---|---|---|
| Pack vs strip vs unit | Stock is counted in whole packs; no loose-strip selling | `StockLot.qtyOnHand` Int |
| Rx priority (routine/urgent/stat) | Not modelled | `Prescription` |
| Insurer contracted prices | Not modelled; claims hold an amount + copay only | `InsurerClaim` |
| Controlled schedules + log fields | 4 schedules, log keeps patient name, ID last-4 + hash, prescriber licence, pharmacist, lot, qty | `ControlledSubstanceLogEntry` |
| Inter-branch transfer in-transit | REQUESTED -> IN_TRANSIT -> RECEIVED, stock leaves the source at dispatch | `StockTransfer` |
| One lot row per (branch, drug, lotNumber) | Yes; same lot number must carry the same expiry | unique index |
| Reservation | Qty counters on the lot (`qtyReserved`) driven by RESERVE/RELEASE movements, never a lot status | `kx_stock_movement_apply` |

## Provider go-live (real providers are wired before launch, in staging first)

Every integration sits behind an adapter with `*_MODE=mock|real` (default `mock`). Mocks run the same code paths (templates rendered, consent checked, delivery states, signatures verified). No real credentials exist in code. Every kind is wired: going live is env/secrets only (see [PROVIDERS.md](./PROVIDERS.md) and the checklist in `DEMO_DATA.md` section 8); a vendor whose payload differs from the generic shape is adapted in `src/providers/mapping/<kind>.mapping.ts` only.

| Provider | Adapter / env | Needs before go-live |
|---|---|---|
| Kiorex webhooks (events out) | `OutboxDeliveryService`, `KIOREX_MODE=real`, per-tenant `IntegrationClient.kiorexBaseUrl` + webhook secret (env `KIOREX_WEBHOOK_URL/SECRET` = single-tenant fallback) | Kiorex receiver URL + per-pharmacy secret; replay/clock policy; DLQ monitoring on `OutboxEvent.status=FAILED` |
| Kiorex machine API + inbound webhooks | `IntegrationClient` rows (create via `POST /api/v1/kiorex-orders/integration/clients`; secret shown once), `INTEGRATION_KEK` | Real client credentials per environment and a managed KEK; IP allow-list; nonce store shared across instances |
| Flag control plane | `FLAGS_POLL_ENABLED=true`, `KIOREX_FLAGS_URL`, `KIOREX_PRODUCT_KEY`, `KIOREX_PRODUCT_SECRET`, `KIOREX_FLAGS_WEBHOOK_SECRET` | `pharmacy.*` registered in the Kiorex registry (NH-PH-016); push URL `/api/v1/feature-flags/kiorex/changed` |
| Patient consent registry (capture / query / revoke / token introspection) | `ConsentVerifier` + `ConsentService`, `CONSENT_MODE=real`, `CONSENT_API_URL/KEY/WEBHOOK_SECRET` (wired; `mapping/consent.mapping.ts`) | The registry's real wire contract (INTEGRATION.md documents consent TOKENS only, so the generic `/consents` + `/consents/introspect` shape is assumed), token format and lifetime (NH-PH-013), point revoke webhooks at `/api/v1/webhooks/providers/consent`; legal wording of each purpose |
| PSP: card / InstaPay / Fawry / wallet | `PspAdapter`, `PAYMENT_MODE=real` (wired incl. pay-by-link, refund, webhook; see [PROVIDERS.md](./PROVIDERS.md); adapt `mapping/payment.mapping.ts`) | Merchant accounts + API keys (Paymob/Fawry/InstaPay), webhook signing, refund API, settlement reports (NH-PH-014) |
| WhatsApp / SMS / email / push | `NotificationsService`, `SMS_MODE` / `EMAIL_MODE` / `WHATSAPP_MODE` / `PUSH_MODE` = `real` (wired; see [PROVIDERS.md](./PROVIDERS.md)) | Approved Meta templates EN+AR, sender IDs, opt-in policy (NH-PH-012) |
| AI gateway (forecast explanations; assistant-ready) | `AiGateway`, `AI_MODE=real`, `AI_API_URL/KEY/MODEL` (wired; OpenAI-compatible `/chat/completions`, `mapping/ai.mapping.ts`) | OpenAI-EU (or equivalent) account + DPA, model choice, token budgets (`AI_DAILY_TOKEN_BUDGET` is per API instance, in memory: move to a shared counter before running several instances), clinical governance sign-off before ANY patient-facing assistant (none ships: only forecast explanations call it; numbers stay deterministic) (KX-11) |
| Object storage (Rx scans, attachments, exports) | `StorageAdapter`, `STORAGE_MODE=real`, `STORAGE_API_URL/KEY` (wired: HTTP PUT/GET `{url}/{key}`; local disk in mock) | Private bucket + KMS behind an HTTP gateway via OpenTofu (ADR-028) or adapt `mapping/storage.mapping.ts` for SigV4; virus scan on upload; retention / legal-hold policy; optional `STORAGE_SIGNING_SECRET` (defaults to a key derived from `STORAGE_API_KEY`); migrate existing local files into the bucket |
| Identity | `AUTH_MODE=oidc` | Kiorex Passport client for Pharmacy, redirect URIs, back-channel logout URL (NH-PH-031) |
| Commerce kernel | `src/kernel-adapter` | Package published (NH-PH-023) |
| Thermal printers / scanners | Browser print of `/pos/sales/:id/receipt.html` | Hardware decision (NH-PH-017); ESC/POS driver if the print dialog is not acceptable |

## Complete-pharmacy additions (human review needed)
- **NH-PH-040 Clinical knowledge base**: the built-in interaction/dose/pregnancy/renal dataset is synthetic starter data. A licensed pharmacist (or a licensed commercial KB behind `ClinicalKnowledge`) must review it before real clinical use.
- **NH-PH-041 Refill validity**: default 180 days from issue (`refillReminderDays` and validity are settings); confirm the local rule for each drug class.
- **NH-PH-042 Controlled witness policy**: witness required for adjustments, write-offs, returns, count variances and transfers of controlled drugs; confirm it matches the regulator's register rules.
- **NH-PH-043 Loyalty and credit terms**: tier thresholds, points value and customer credit days are defaults; the owner must set them.
- **NH-PH-044 Application backup**: `/admin/export` is a data export, not a disaster-recovery backup.


## Provider go-live checklist (config only: no code change)

> Founder rule: mocks now, real providers by **env / Secrets Manager values only**. Every kind has `<KIND>_MODE=mock|real` (default mock); `<KIND>_PROVIDER` picks a native vendor; `main.ts` calls `assertProviderConfig()` and refuses to boot with a variable-names-only message; `GET /api/v1/health/ready` and `GET /api/v1/health/providers` report `{provider, mode, vendor, ready}` for every kind (no values). Rollback = set the mode back to `mock`. Vendor wire formats are unit-tested against faked HTTP in `apps/api/src/providers/vendor-kit.node.test.ts`; webhooks live at `POST /api/v1/webhooks/providers/{sms|email|whatsapp|payment}` (GET handshake for WhatsApp). Secret naming convention `kiorex/<env>/pharmacy/...` (Secrets Manager, injected as env by the task definition in `infra/tofu`).

| Provider | Config flip | Env vars (S = secret) | Human steps |
|---|---|---|---|
| WhatsApp (Meta Cloud API) | `WHATSAPP_MODE=real`, `WHATSAPP_PROVIDER=meta` | `WHATSAPP_API_KEY` S (system-user token), `WHATSAPP_SENDER_ID` (phone-number-id), `WHATSAPP_WEBHOOK_SECRET` S (app secret), `WHATSAPP_VERIFY_TOKEN` S; optional `WHATSAPP_API_URL`, `WHATSAPP_TEMPLATE_MAP` JSON | Meta business verification, WABA + number, approve AR + EN templates for every template id the product sends, webhook callback `https://<api>/api/v1/webhooks/providers/whatsapp` + verify token, subscribe `messages` |
| SMS (Twilio) | `SMS_MODE=real`, `SMS_PROVIDER=twilio` | `SMS_API_KEY` S (`<AccountSid>:<AuthToken>`), `SMS_SENDER_ID`, `SMS_WEBHOOK_PUBLIC_URL` (`https://<api>/api/v1/webhooks/providers/sms`); secret derived from the token; or neutral gateway: `SMS_API_URL`, `SMS_API_KEY`, `SMS_WEBHOOK_SECRET` | Egypt route / alphanumeric sender registration, status callback, cost cap, opt-out copy |
| Email (SES v2) | `EMAIL_MODE=real`, `EMAIL_PROVIDER=ses` | `EMAIL_API_URL=https://email.<region>.amazonaws.com`, `EMAIL_API_KEY` S (`<ACCESS_KEY_ID>:<SECRET>`), `EMAIL_FROM`, `EMAIL_WEBHOOK_SECRET` S (SNS basic-auth password); optional `EMAIL_SES_CONFIGURATION_SET` | Verified domain (DKIM/SPF/DMARC), leave sandbox, configuration set -> SNS topic -> HTTPS subscription `https://kiorex:<secret>@<api>/api/v1/webhooks/providers/email` (auto-confirmed) |
| Push (FCM v1 + Expo) | `PUSH_MODE=real` (legacy `MOBILE_PUSH_MODE`) | `PUSH_FCM_SERVICE_ACCOUNT_JSON` S (raw or base64) and/or `PUSH_EXPO_ENABLED=true` / `PUSH_EXPO_ACCESS_TOKEN` S; optional `PUSH_FCM_PROJECT_ID`; custom gateway alternative: `PUSH_API_URL`, `PUSH_API_KEY` | Firebase project + service account (FCM API v1), upload FCM key + APNs key to EAS for the Kiorly app (`com.kiorly.app`), EAS project id in the app build; tokens are Expo push tokens from the app |
| Payments (pay links, refunds) | `PAYMENT_MODE=real`, `PAYMENT_PROVIDER=paymob` or `fawry` (unset = neutral gateway) | Paymob: `PAYMENT_API_KEY` S (secret key), `PAYMENT_WEBHOOK_SECRET` S (HMAC), `PAYMENT_PUBLIC_KEY`, `PAYMENT_INTEGRATION_IDS`; Fawry: `PAYMENT_API_KEY` S (secure key), `PAYMENT_MERCHANT_CODE`; both: `PUBLIC_BASE_URL=https://<api>`, optional `PAYMENT_RETURN_URL`, `PAYMENT_API_URL` | Merchant onboarding; Paymob processed-callback = `https://<api>/api/v1/webhooks/providers/payment` (HMAC in the `hmac` query parameter); Fawry webhook same URL; hosted checkout only (direct card charge is refused by design); settlement + payout rails (CFO) |
| AI (OpenAI-compatible) | `AI_MODE=real` | `AI_API_URL` (EU endpoint), `AI_API_KEY` S, `AI_MODEL`, token budgets `AI_MAX_INPUT_TOKENS`, `AI_MAX_OUTPUT_TOKENS`, `AI_DAILY_TOKEN_BUDGET` | DPA, key, clinical sign-off (adapter already real, tested in `consent-ai-storage.node.test.ts`) |
| Storage / Consent | `STORAGE_MODE=real`, `CONSENT_MODE=real` | `STORAGE_API_URL/KEY`, `CONSENT_API_URL/KEY/WEBHOOK_SECRET` | unchanged (see rows above in this file) |

**Mobile (Kiorly staff app)**: Android channels `default|safety|clinical|ops` are created by the app and named per push kind by this API. Build/EAS details: `kiorly-team/Docs/NEEDS_HUMAN.md`.

**Unverified against live vendors:** Paymob `transaction_inquiry` / `void_refund` payloads, Fawry `FawryPay.jsp` signature item order and status v2, Meta template layouts, SES SNS variations; exercise each in the vendor sandbox before production.
