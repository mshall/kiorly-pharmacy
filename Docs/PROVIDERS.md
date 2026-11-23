# Providers: mock today, real by configuration only

Every external provider sits behind a port with `<KIND>_MODE=mock|real` (default `mock`). Going live means setting env/secrets, **not** writing code. The same env names, generic request/response shapes and webhook scheme are used by Kiorly Clinic, Pharmacy and Lab.

| Kind | Port (code) | Switch | Mapping file (the only vendor-specific code) |
|---|---|---|---|
| SMS | `src/platform/adapters/notifications.service.ts` -> `src/providers/messaging-provider.ts` | `SMS_MODE` | `src/providers/mapping/sms.mapping.ts` |
| Email | same | `EMAIL_MODE` | `.../email.mapping.ts` |
| WhatsApp | same | `WHATSAPP_MODE` | `.../whatsapp.mapping.ts` |
| Payment (PSP, pay-by-link, refund) | `src/platform/adapters/psp.adapter.ts` -> `src/providers/payment-provider.ts` | `PAYMENT_MODE` | `.../payment.mapping.ts` |
| Push (Kiorly) | `src/modules/mobile/push.service.ts` -> `src/providers/push-provider.ts` | `PUSH_MODE` | n/a (Expo-compatible gateway) |
| Consent registry | `src/platform/adapters/consent.adapter.ts` (token verify) + `consent.service.ts` (capture/query/revoke) -> `src/providers/consent-provider.ts` | `CONSENT_MODE` | `.../consent.mapping.ts` |
| AI gateway | `src/platform/adapters/ai.gateway.ts` (+ `ai.adapter.ts` forecasting) -> `src/providers/ai-provider.ts`, `phi-redaction.ts` | `AI_MODE` | `.../ai.mapping.ts` |
| Object storage | `src/platform/adapters/storage.adapter.ts` -> `src/providers/storage-provider.ts`, `storage-policy.ts` | `STORAGE_MODE` | `.../storage.mapping.ts` |

`MESSAGING_MODE` / `PSP_MODE` still work as the default for the three messaging kinds / PAYMENT.

## Env contract (per kind)
`<KIND>_MODE`, `<KIND>_API_URL` (base URL of the provider or your gateway), `<KIND>_API_KEY` (bearer), `<KIND>_WEBHOOK_SECRET` (HMAC for callbacks), plus `SMS_SENDER_ID`, `EMAIL_FROM`, `WHATSAPP_SENDER_ID`; `PAYMENT_CURRENCY` (default `EGP`, used for till charges/refunds). Optional `<KIND>_TIMEOUT_MS` (8000), `_MAX_RETRIES` (2), `_BACKOFF_MS` (300). Kinds: `SMS`, `EMAIL`, `WHATSAPP`, `PAYMENT`, `PUSH`, `STORAGE`, `CONSENT`, `AI` (extras: `AI_MODEL`; see the three sections below).

**Fail-fast:** `main.ts` calls `assertProviderConfig()` before listening. `MODE=real` without URL, key, webhook secret (SMS/EMAIL/WHATSAPP/PAYMENT/CONSENT), sender id or `AI_MODEL` (or a non-https URL in production) aborts startup listing the missing variable NAMES; values and secrets are never logged.

## Generic shapes (identical across repos)
* Send message: `POST {URL}/messages` `{to, from, text, reference, templateId, locale}` (email adds `subject`/`html`; WhatsApp sends `template:{name,language,params}`) -> `{id, status}`. Headers: `Authorization: Bearer <KEY>`, `Idempotency-Key` (= our notification row id, identical on every retry). The template key (`order.ready`, `rx.refill_reminder`, ...) is the template name sent to the provider.
* PSP: `POST {URL}/charges` -> `{id, status: captured|declined|pending}` (a till charge must answer synchronously; `pending` is treated as declined `PAYMENT_PENDING`); `POST {URL}/pay-links` `{amount,currency,reference,description,expiresAt,customer}` -> `{id, payUrl}`; `POST {URL}/refunds` `{chargeId,amount,currency,reason}` -> `{id, status: succeeded|pending}`.
* Retries: network errors, timeouts, 408, 429 (honours Retry-After) and 5xx, with exponential backoff + jitter; 401/403/4xx are never retried. Errors map to `TIMEOUT | NETWORK | AUTH | RATE_LIMITED | REJECTED | PROVIDER_5XX | BAD_RESPONSE`; a failed send is stored as `FAILED` with `CODE: message` (never a secret). A provider failure never fails the business flow (sale, order, reminder); the till PSP maps outages to a declined charge `PSP_<CODE>`.

## Consent registry (`CONSENT_*`)
Purposes: `DATA_PROCESSING`, `MARKETING`, `DATA_SHARING`, `CONTROLLED_DRUG`, `ERX_DISPENSE`. Local table `ConsentRecord` (status ACTIVE | REVOKED | EXPIRED, `providerRef`, `tokenHash`, `syncError`) is what the pharmacy enforces; the registry is mirrored.
* Env: `CONSENT_MODE`, `CONSENT_API_URL`, `CONSENT_API_KEY`, `CONSENT_WEBHOOK_SECRET`.
* Wire (generic; INTEGRATION.md defines no registry contract, only consent tokens): `POST /consents {subjectRef,purpose,expiresAt?,reference,evidence?}` -> `{id,status}`; `GET /consents?subjectRef=&purpose=` -> `{data:[{id,status,...}]}`; `POST /consents/{id}/revoke {reason?}`; `POST /consents/introspect {token,patientRef,clinicId?}` -> `{active,reason?,expiresAt?}`. Idempotency-Key on grant/revoke.
* Webhook `POST /api/v1/webhooks/providers/consent` (same HMAC scheme): `consent.granted | consent.revoked | consent.expired`, `data.id` = the consent id. A revoke sets the record REVOKED, switches the customer's marketing / data-processing flag off, and expires the e-Rx consent tied to the token (dispensing then fails `CONSENT_INVALID`).
* API: `POST /consents {subjectRef,purpose,patientId?,expiresAt?}` (customer.write), `POST /consents/:id/revoke {reason?}`, `GET /consents?subjectRef&patientId&purpose&status`, `GET /consents/status?subjectRef&purpose`. e-Rx intake records an `ERX_DISPENSE` consent; `PUT /customers/:id/consent` mirrors the data-processing / marketing toggles.
* Safety: grant needs the registry's acceptance (outage -> 503 `CONSENT_REGISTRY_UNAVAILABLE`, nothing ACTIVE stored); revoke is applied locally first and never blocked (registry sync failure stored in `syncError`); e-Rx token verification FAILS CLOSED (503, nothing stored).

## AI gateway (`AI_*`)
* Env: `AI_MODE`, `AI_API_URL`, `AI_API_KEY`, `AI_MODEL` (all required for real); guards `AI_MAX_INPUT_TOKENS` (2000), `AI_MAX_OUTPUT_TOKENS` (500), `AI_DAILY_TOKEN_BUDGET` per org (100000, in memory per instance), optional `AI_COST_PER_1K_TOKENS_USD` for the cost estimate.
* Mock = deterministic `fake` provider. Real = OpenAI-compatible `POST {AI_API_URL}/chat/completions` (`model`, `messages`, `max_tokens`, `temperature`), bearer key, Idempotency-Key, timeout / bounded retries from `http.ts`.
* `AiGateway.assist()`: PHI redaction FIRST (names the caller passes, phones, e-mails, dates, long ids, record numbers, URLs; Arabic digits normalised) -> input / budget guard (413 `AI_INPUT_TOO_LARGE`, 429 `AI_BUDGET_EXCEEDED`) -> provider (503 `AI_UNAVAILABLE`, no prompt or key in the error) -> output prefixed `[AI-generated (provider/model); not clinical advice, a pharmacist must review before use]` -> audit row with counts only. Forecasting keeps its deterministic numbers; real mode only adds the labelled explanation and falls back silently on an outage.

## Object storage (`STORAGE_*`)
* Env: `STORAGE_MODE`, `STORAGE_API_URL`, `STORAGE_API_KEY`; optional `STORAGE_DIR` (mock root, default `./.data`), `STORAGE_MAX_BYTES` (5 MB), `STORAGE_URL_TTL_SEC` (300, max 3600), `STORAGE_SIGNING_SECRET` (default: key derived from `STORAGE_API_KEY`).
* Mock = local disk (existing files and keys keep working). Real = `PUT {url}/{key}` (raw bytes, Content-Type, bearer) and `GET {url}/{key}` (404 = missing). Callers use `StorageAdapter` only: `putDataUrl` / `put` validate the type (jpeg, png, webp, pdf, csv, json), size and magic bytes (400 `INVALID_FILE`, 413 `FILE_TOO_LARGE`; an outage is 503 `STORAGE_UNAVAILABLE` and the Rx is not created).
* Never public: `GET /prescriptions/:id/scan-url?ttl=` (rx.read, tenant-scoped) returns `/api/v1/files?key&exp&sig`, an HMAC-signed URL (default 300 s). `GET /api/v1/files` serves it as an attachment, `nosniff`, `no-store`; expired / tampered / wrong-key signatures are 401.

## Webhooks (delivery receipts, payment status, consent)
`POST /api/v1/webhooks/providers/{sms|email|whatsapp|payment|consent}` (public route, HMAC authenticated). Header `X-Kiorex-Signature: t=<unix>,v1=<hex HMAC-SHA256("<t>.<raw body>", <KIND>_WEBHOOK_SECRET)>`, 5 minute tolerance. Body `{id, type, createdAt, data:{id, error?, amount?, currency?, reference?}}` (or `{events:[...]}`), types `message.sent|delivered|read|failed`, `payment.succeeded|failed|expired`, `refund.succeeded|failed`. Events are deduplicated by `id` (`ProviderWebhookEvent`); receipts never downgrade a state. A vendor with a different signature or payload is adapted in the kind's mapping file.

State is persisted in `Notification` (status QUEUED -> SENT -> DELIVERED | FAILED, `providerMessageId`, `error`, `deliveredAt`) and `PayLink` (+ the booked `CustomerCreditEntry`).

## Flows (all work in mock mode)
* Order ready: `POST /kiorex-orders/:id/ready` -> WhatsApp `order.ready` to the customer's phone; refill reminder: `POST /api/v1/prescriptions/refills/reminders/run` (WhatsApp `rx.refill_reminder`).
* Receipt: `POST /pos/sales/:id/receipt/send {channel: EMAIL|SMS|WHATSAPP, to?}` (template `receipt.email`; the customer's contact on the sale is the default).
* Pay-by-link (customer credit balance): `POST /pos/customers/:id/pay-link {amount?, sendVia?}` -> `payment.succeeded` books ONE `PAYMENT` credit entry and sends a receipt; `payment.failed|expired` closes the link; `POST /pos/pay-links/:id/refund` refunds through the PSP and puts the money back on the balance (a pending refund is booked on `refund.succeeded`).

## Dev-only tools (404 in production or with `PROVIDER_DEV_TOOLS=false`; need `settings.write`, i.e. owner)
* `GET /api/v1/dev/providers/status` (modes, which credentials are set: booleans only)
* `GET /api/v1/dev/providers/messages?channel=` (everything "sent", with the rendered body)
* `GET /api/v1/dev/providers/pay-links`
* `POST /api/v1/dev/providers/simulate/webhook {kind, type, providerRef, error?, amount?}` (signed with the kind's secret and sent through the same verify/dedupe/apply path; mock mode only)
* `POST /api/v1/dev/providers/consent/demo` (grant MARKETING -> status -> signed `consent.revoked` -> status; the customer's flag goes off), `POST /api/v1/dev/providers/ai/sample {prompt?, names?}` (a prompt full of fake PHI; returns the redacted prompt that was sent, the labelled answer, token usage), `POST /api/v1/dev/providers/storage/roundtrip` (put a PNG, read it back, signed URL, tamper / expiry checks)
* `POST /api/v1/dev/providers/demo/run {payments?, consent?, ai?, storage?: false}` runs every flow: order-ready + refill reminder (WhatsApp), receipt email + SMS, delivery receipts, then pay-by-link success -> refund and a failing link on a credit customer (a demo one is created when none has a balance).

Tests: `src/providers/consent-ai-storage.node.test.ts` and `test/consent-ai-storage.e2e.test.ts` (real-mode wiring, retry, HMAC, fail-fast, redaction, signed URLs against a local fake server), `src/providers/providers.node.test.ts` (fail-fast, signatures, retry/timeout/error mapping against a local fake HTTP server) and `test/providers.e2e.test.ts` (mock end to end; real mode against the fake provider; webhook auth/dedupe; refund pending/failed).
