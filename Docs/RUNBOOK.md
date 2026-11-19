# Kiorly Pharmacy - Kiorex integration runbook

- **Ports**: API 3100 (`/api/v1`; Kiorex machine API `/marketplace/v1`), web 5190. Dev DB `kiorly_pharmacy` on :5433.
- **Register Kiorex** for a tenant: owner `POST /api/v1/kiorex-orders/integration/clients {kiorexBaseUrl}` -> `{key, secret, webhookSecret}` (shown once); give key/secret to Kiorex ops (`/admin/partners`) and set the webhook secret on the Kiorex registration. Dev: `npm run seed` registers `kx_dev_pharmacy_client` (INTEGRATION.md).
- **Run against Kiorex**: `KIOREX_MODE=real KIOREX_BASE_URL=http://localhost:4000 FLAGS_POLL_ENABLED=true KIOREX_PRODUCT_KEY=ff_kiorly-pharmacy_dev KIOREX_PRODUCT_SECRET=ff_dev_secret_change_me`.
- **Stuck events**: `OutboxEvent.status=FAILED` after 8 attempts -> fix the cause (Kiorex 4xx/5xx in `lastError`) and set `status=PENDING, nextAttemptAt=now`; Kiorex de-duplicates on eventId.
- **Common failures**: Kiorex 401 INVALID_CLIENT (wrong key/secret or deactivated client), 400 RAW_BODY_REQUIRED (a proxy or duplicate `content-type` header broke body parsing), 403 FEATURE_DISABLED (`pharmacy.kiorex_orders` OFF for the org; org-scope flags use `Tenant.id`).
