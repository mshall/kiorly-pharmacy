# Kiorly Pharmacy API

Base path `/api/v1` (Swagger UI at `/docs`, machine-readable spec in [`openapi.json`](./openapi.json), regenerate with `npm run openapi:export -w api`). The Kiorex machine API lives outside the prefix at `/marketplace/v1` (same convention as Kiorly Clinic).

## Conventions
- **Auth**: `Authorization: Bearer <jwt>`. `AUTH_MODE=local` (default, dev/E2E): `POST /auth/login {email,password}`. `AUTH_MODE=oidc`: Kiorex Passport RS256 tokens (issuer/JWKS/audience validated; privileged roles need MFA in production). Dual mode `AUTH_ACCEPT_PASSPORT=true` (never in production) accepts both. Web: `GET /auth/config`, `POST /auth/oidc/exchange {code,codeVerifier,redirectUri,nonce}` -> `{accessToken, expiresIn, endSessionUrl}` (session = `OIDC_SESSION_MAX_AGE_SECONDS`, default 1 h), and the OIDC Back-Channel Logout receiver `POST /auth/oidc/backchannel-logout` (form `logout_token`; 200 processed, 400 invalid/replayed; ends the matching session, next request 401 `SESSION_REVOKED`). Staff: `POST /staff`, `PATCH /staff/:id` take `phone` (E.164, unique per tenant: 400 `INVALID_PHONE`, 409 `PHONE_TAKEN`); `GET /staff` returns `phone` and `passportLinked`.
- **Tenancy**: the org comes ONLY from the verified staff row; `orgId`/branch headers or params are never trusted. Branch-bound staff can act on their own branch only.
- **RBAC**: permission strings per role (`apps/api/src/auth/permissions.ts`); `GET /auth/me` returns the caller's permissions and effective flags.
- **Errors**: `{ statusCode, code, message, details? }`. Notable codes: `FEATURE_DISABLED {key,scope}` (403), `ENTITLEMENT_REQUIRED {capability}` (402), `LOT_BLOCKED {reason}` (409), `RX_REQUIRED`, `SIGNOFF_REQUIRED`, `SAFETY_BLOCK_UNRESOLVED`, `INSUFFICIENT_STOCK`, `DB_INVARIANT` (a DB safety trigger refused the write).
- **Money**: strings with at least 2 decimals (`"200.00"`); VAT is a line on receipts/exports only.
- **Idempotency**: sales (`idempotencyKey`), goods receipts, supplier payments, dispensing completion, Kiorex order ingest (`orderId`), inbound webhooks (`eventId`, per tenant).
- **Manager approval**: operations needing a second person (negative stock, returns, voids, offline conflict resolution) accept `approval: {email,password}` of a staff member holding the permission; the approver is recorded and audited.

## Kiorex integration
- **Events out** (transactional outbox, validated against `@kiorex/contracts` before write): `OrderReady`, `DispenseCompleted`, `OrderRejected`. Delivered with the webhook scheme `X-Kiorly-Timestamp` (s) + `X-Kiorly-Signature: sha256=HMAC(secret, "<ts>.<rawBody>")`, `X-Kiorly-Event`, `X-Kiorly-Event-Id`. Every event carries the pharmacist sign-off.
- **Events in**: `POST /api/v1/webhooks/kiorex` (`PrescriptionIssued`; headers above + `X-Kiorex-Org-Id`, optional `X-Kiorex-Branch-Id`). A valid patient consent token is mandatory; nothing is stored without it.
- **Machine API** (`/marketplace/v1`, request HMAC: `X-Kiorly-Client-Key/Timestamp/Nonce/Signature`, `X-Kiorex-Org-Id`; gated by `pharmacy.kiorex_orders`): `GET /availability` (ATP per opted-in branch; controlled medicines never listed), `POST /orders`, `POST /orders/{orderId}/cancel`.
- **Flags**: `POST /api/v1/feature-flags/kiorex/changed` (signed push) refreshes the snapshot immediately.

## Safety paths (never flags, ADR-025)
`inventory/lot-guard`, `dispensing`, `prescriptions/safety`, `suppliers/recall` must not reference the flag service (CI-enforced). Each rule also exists as a DB trigger/CHECK in migrations 0002/0004: append-only stock ledger/audit/controlled log, sellable-lot check on every outbound movement, sign-off before DISPENSE, Rx-only sale requires a signed dispensing, controlled dispensing requires a log entry, negative stock requires a manager approver.

## Complete-pharmacy modules (all under `/api/v1`, full list in [openapi.json](./openapi.json))
| Area | Endpoints (prefix) | Notes |
|---|---|---|
| Customers | `/customers` (+ `/duplicates`, `/{id}/history|notes|family|consent|credit-account|loyalty|loyalty/adjust|merge`) | search by name/phone/no.; duplicate phone returns 409; merge moves sales, Rx, notes, loyalty, credit |
| Prescribers and Rx | `/prescribers`, `/prescriptions/manual`, `/verification-queue`, `/partial`, `/refills/due`, `/refills/reminders/run`, `/transfer-in`, `/transfers`, `/{id}/refill|transfer-out|balance`, `/dispensings/{id}/counselling|labels.html` | refill validity default 180 days; partial fills keep a balance; e-Rx intake (`/webhooks/kiorex`) is optional |
| Clinical safety | `/clinical/kb`, `/clinical/overrides`; checks run inside dispensing (9 kinds) | overridable checks need reason + audit; hard blocks never overridable |
| Controlled | `/controlled/register|balances|audits|discrepancies` | witness via `approval`/`witness` credentials |
| POS and cash | `/pos/promotions`, `/pos/held`, `/pos/cash-movements`, `/pos/shifts/{id}/x-report|z-report`, `/pos/sales/{id}/exchange`, `/receipt.html?format=thermal|a4` | promotions: percent, amount, BOGO, bundle, coupon; VAT is a display line only |
| Inventory | `/inventory/locations`, `/uoms`, `/analytics/movers|auto-reorder`, `/cold-chain/lots`, `/movements`, `/lots/labels.html`, `/lots/{id}/damage` | adjustments carry `reasonCode` |
| Purchasing | `/purchasing/rfqs`, `/aging`, `/cost-variance`, `/supplier-returns`, `/purchase-orders/{id}/close|print.html`, `/suppliers/{id}/statement` | RFQ > award creates PO(s) |
| Finance | `/finance/overview|margin|receivables|expenses`, `/claims/{id}/approve|reject|payments`, `/claims/batch-submit|reconciliation` | CSV via `?format=csv` on reports |
| Admin | `/admin/roles`, `/admin/mode`, `/admin/import/{kind}`, `/admin/export`, `/audit` + `/audit/export.csv`, `/notifications/*` | |
| Reports | `/reports` (catalogue of 32 reports in 6 groups), `/reports/{name}` | JSON or CSV |
New permissions: `customers.*`, `rx.refill`, `rx.transfer`, `safety.kb.manage`, `controlled.manage`, `promo.manage`, `pos.discount_override`, `pos.cash_drawer`, `finance.*`, `roles.manage`, `data.import|export`, `notifications.read`. New role `ASSISTANT`. Standalone tenants get `403 STANDALONE_MODE` on Kiorex-only routes.

## Default sign-in method (ADR-038 amendment, 24 Nov 2026)
- `GET /auth/config{?org=}` (public, no-store, 300 requests/min/client) now also returns `passportAvailable` and `defaultMethod` (`PASSWORD` | `PASSPORT`): the method the login page preselects. Both methods stay offered when Passport is available; when it is not, `defaultMethod` is `PASSWORD`. `?org=<organisation id>` identifies the organisation before login; a missing or unknown org gets the deployment default (`SIGNIN_DEFAULT_METHOD`, `PASSWORD` unless set) in the same shape (no org enumeration).
- Organisation setting `defaultSignInMethod` (`PASSWORD` | `PASSPORT` | `null` = automatic), column on `Tenant`, read from `GET /settings` (with `effectiveSignInMethod` and `linkedToKiorex`) and changed with `PATCH /settings` `{ "defaultSignInMethod": ... }`; permission `settings.write` (owner); audit `settings.default_signin_method` (from, to). Automatic = `PASSPORT` when the org is linked to Kiorex (Kiorex org id, active integration client, or Passport-linked staff), else `PASSWORD`.

## Growth: provider links (GRW-P4-B1, see [GROWTH.md](./GROWTH.md))
| Area | Endpoints | Notes |
|---|---|---|
| Web | `GET /growth/access|links|summary|performance|recommendations`, `POST /growth/links`, `PATCH /growth/links/:id`, `GET /growth/links/:id/qr.svg|qr.png|poster` | role matrix, 403 `KIOREX_NOT_CONNECTED`, flag `growth.provider_links` on create, QR and print; counts only |
| Staff app | `GET /mobile/growth`, `GET|POST /mobile/growth/links`, `PATCH /mobile/growth/links/:id`, `GET /mobile/growth/qr?linkId=` | plan gate `mobile_staff_app` first; pause and resume only (revoke is web only) |
| Public | `GET /public/links/q/:code` | 302 to the Kiorex pharmacy page with the signed touch `lt`; no cookies, no visitor data; destination from configuration only |
| Kiorex machine | `GET /marketplace/v1/referral-links[/:code]` | signed lookup and reconciliation feed of the link registry, one organisation per client key |
| Events out | `ReferralLinkCreated`, `ReferralLinkRevoked` (`product` PHARMACY) | outbox, validated against `@kiorex/contracts` 1.12.0 |
