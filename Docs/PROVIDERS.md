# Providers: mock today, real by configuration only

Every external provider sits behind a port with `<KIND>_MODE=mock|real` (default `mock`). Going live means setting env/secrets, **not** writing code. The same env names, generic request/response shapes and webhook scheme are used by Kiorly Clinic, Pharmacy and Lab.

| Kind | Port (code) | Switch | Mapping file (the only vendor-specific code) |
|---|---|---|---|
| SMS | `src/platform/adapters/notifications.service.ts` -> `src/providers/messaging-provider.ts` | `SMS_MODE` | `src/providers/mapping/sms.mapping.ts` |
| Email | same | `EMAIL_MODE` | `.../email.mapping.ts` |
| WhatsApp | same | `WHATSAPP_MODE` | `.../whatsapp.mapping.ts` |
| Payment (PSP, pay-by-link, refund) | `src/platform/adapters/psp.adapter.ts` -> `src/providers/payment-provider.ts` | `PAYMENT_MODE` | `.../payment.mapping.ts` |
| Push (Kiorly Work) | `src/modules/mobile/push.service.ts` -> `src/providers/push-provider.ts` | `PUSH_MODE` | n/a (Expo-compatible gateway) |

Not part of this pass: consent verification (`CONSENT_MODE`), forecasting AI (`AI_MODE`) and object storage (local disk, no MODE switch yet) keep their go-live rows in `NEEDS_HUMAN.md`.
`MESSAGING_MODE` / `PSP_MODE` still work as the default for the three messaging kinds / PAYMENT.

## Env contract (per kind)
`<KIND>_MODE`, `<KIND>_API_URL` (base URL of the provider or your gateway), `<KIND>_API_KEY` (bearer), `<KIND>_WEBHOOK_SECRET` (HMAC for callbacks), plus `SMS_SENDER_ID`, `EMAIL_FROM`, `WHATSAPP_SENDER_ID`; `PAYMENT_CURRENCY` (default `EGP`, used for till charges/refunds). Optional `<KIND>_TIMEOUT_MS` (8000), `_MAX_RETRIES` (2), `_BACKOFF_MS` (300). Kinds: `SMS`, `EMAIL`, `WHATSAPP`, `PAYMENT`.

**Fail-fast:** `main.ts` calls `assertProviderConfig()` before listening. `MODE=real` without URL, key, webhook secret or sender id (or a non-https URL in production) aborts startup listing the missing variable NAMES; values and secrets are never logged.

## Generic shapes (identical across repos)
* Send message: `POST {URL}/messages` `{to, from, text, reference, templateId, locale}` (email adds `subject`/`html`; WhatsApp sends `template:{name,language,params}`) -> `{id, status}`. Headers: `Authorization: Bearer <KEY>`, `Idempotency-Key` (= our notification row id, identical on every retry). The template key (`order.ready`, `rx.refill_reminder`, ...) is the template name sent to the provider.
* PSP: `POST {URL}/charges` -> `{id, status: captured|declined|pending}` (a till charge must answer synchronously; `pending` is treated as declined `PAYMENT_PENDING`); `POST {URL}/pay-links` `{amount,currency,reference,description,expiresAt,customer}` -> `{id, payUrl}`; `POST {URL}/refunds` `{chargeId,amount,currency,reason}` -> `{id, status: succeeded|pending}`.
* Retries: network errors, timeouts, 408, 429 (honours Retry-After) and 5xx, with exponential backoff + jitter; 401/403/4xx are never retried. Errors map to `TIMEOUT | NETWORK | AUTH | RATE_LIMITED | REJECTED | PROVIDER_5XX | BAD_RESPONSE`; a failed send is stored as `FAILED` with `CODE: message` (never a secret). A provider failure never fails the business flow (sale, order, reminder); the till PSP maps outages to a declined charge `PSP_<CODE>`.

## Webhooks (delivery receipts, payment status)
`POST /api/v1/webhooks/providers/{sms|email|whatsapp|payment}` (public route, HMAC authenticated). Header `X-Kiorex-Signature: t=<unix>,v1=<hex HMAC-SHA256("<t>.<raw body>", <KIND>_WEBHOOK_SECRET)>`, 5 minute tolerance. Body `{id, type, createdAt, data:{id, error?, amount?, currency?, reference?}}` (or `{events:[...]}`), types `message.sent|delivered|read|failed`, `payment.succeeded|failed|expired`, `refund.succeeded|failed`. Events are deduplicated by `id` (`ProviderWebhookEvent`); receipts never downgrade a state. A vendor with a different signature or payload is adapted in the kind's mapping file.

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
* `POST /api/v1/dev/providers/demo/run {payments?: false}` runs every flow: order-ready + refill reminder (WhatsApp), receipt email + SMS, delivery receipts, then pay-by-link success -> refund and a failing link on a credit customer (a demo one is created when none has a balance).

Tests: `src/providers/providers.node.test.ts` (fail-fast, signatures, retry/timeout/error mapping against a local fake HTTP server) and `test/providers.e2e.test.ts` (mock end to end; real mode against the fake provider; webhook auth/dedupe; refund pending/failed).
