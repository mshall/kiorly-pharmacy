# Kiorly Pharmacy - Kiorex integration runbook

- **Ports**: API 3100 (`/api/v1`; Kiorex machine API `/marketplace/v1`), web 5190. Dev DB `kiorly_pharmacy` on :5433.
- **Register Kiorex** for a tenant: owner `POST /api/v1/kiorex-orders/integration/clients {kiorexBaseUrl}` -> `{key, secret, webhookSecret}` (shown once); give key/secret to Kiorex ops (`/admin/partners`) and set the webhook secret on the Kiorex registration. Dev: `npm run seed` registers `kx_dev_pharmacy_client` (INTEGRATION.md).
- **Run against Kiorex**: `KIOREX_MODE=real KIOREX_BASE_URL=http://localhost:4000 FLAGS_POLL_ENABLED=true KIOREX_PRODUCT_KEY=ff_kiorly-pharmacy_dev KIOREX_PRODUCT_SECRET=ff_dev_secret_change_me`.
- **Stuck events**: `OutboxEvent.status=FAILED` after 8 attempts -> fix the cause (Kiorex 4xx/5xx in `lastError`) and set `status=PENDING, nextAttemptAt=now`; Kiorex de-duplicates on eventId.
- **Common failures**: Kiorex 401 INVALID_CLIENT (wrong key/secret or deactivated client), 400 RAW_BODY_REQUIRED (a proxy or duplicate `content-type` header broke body parsing), 403 FEATURE_DISABLED (`pharmacy.kiorex_orders` OFF for the org; org-scope flags use `Tenant.id`).

## Standalone operation

- **Mode**: a new pharmacy (`POST /onboarding/signup`) starts STANDALONE. To connect Kiorex later: Settings > General > mode INTEGRATED, then register the client as above. Switching back to STANDALONE stops order ingest and outbox events immediately; existing data is kept.
- **Local setup**: Postgres :5433, `npm run migrate:deploy -w api`, then `npm run seed:all` (base + demo + suite seeds; guarded: needs `DEMO_SEED_ALLOWED=true` and a non-production env). `seed:suite` is re-runnable and step-wise (markers in `Tenant.settings.suiteSteps`).
- **Roles matrix**: Settings > Roles shows every permission per role. Owner edits create `RolePermissionOverride` rows (cached 15 s); the OWNER role and locked safety permissions cannot be changed; "reset" removes overrides.
- **Import**: Settings > Data (or `POST /admin/import/{kind}` with CSV; `GET /admin/import/{kind}/template`). Kinds: drugs, stock (opening stock), customers, suppliers. Body `{csv, dryRun}`: `dryRun` defaults to true (validate only); send `dryRun:false` to commit.
- **Backup / export**: `GET /admin/export` (full JSON bundle) and `GET /admin/export/{entity}` (CSV). This is an application-level export; database backups (PITR, snapshots) remain an infrastructure task.
- **Notifications centre**: alerts (low stock, expiry, cold chain, refills due, overdue payables, open controlled discrepancies) are generated every 15 minutes by the jobs module and on demand (`POST /notifications/scan`).
- **Controlled substances**: every movement writes `ControlledRegisterEntry` (running balance). Adjustments, write-offs, returns, count variances and transfers of controlled drugs need a witness (a different active staff member's credentials). Periodic audits via `POST /controlled/audits` create discrepancy records that must be resolved with a reason.
- **Clinical knowledge base**: a built-in starter dataset plus tenant rules (`/clinical/kb`). It is synthetic: a licensed pharmacist must review it before clinical use (NEEDS_HUMAN).
- **Offline POS**: queued sales sync via `/pos/sync`; promotions and loyalty redemption are not applied offline.
