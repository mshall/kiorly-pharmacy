# Kiorly Pharmacy API

Base path `/api/v1` (Swagger UI at `/docs`, machine-readable spec in [`openapi.json`](./openapi.json), regenerate with `npm run openapi:export -w api`). The Kiorex machine API lives outside the prefix at `/marketplace/v1` (same convention as Kiorly Clinic).

## Conventions
- **Auth**: `Authorization: Bearer <jwt>`. `AUTH_MODE=local` (default, dev/E2E): `POST /auth/login {email,password}`. `AUTH_MODE=oidc`: Kiorex Passport RS256 tokens (issuer/JWKS/audience validated; privileged roles need MFA in production).
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
