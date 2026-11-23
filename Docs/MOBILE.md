# Kiorly (mobile staff app): Pharmacy backend contract

Kiorly is the single Expo staff app (`kiorly` repo) with Clinic, Pharmacy and Lab modules. This file is the **Pharmacy** half of the contract: auth, the `mobile_staff_app` entitlement, the `/mobile/*` endpoints, and the **app API map** (every existing endpoint each mobile feature calls). Base URL: `http://localhost:3100/api/v1` locally. Errors use the standard `{ statusCode, code, message }` shape.

## 1. Auth (decision)
- **Local/dev and demo:** `POST /auth/login` `{email,password}` -> `{ "accessToken": "<HS256 JWT, 10 h>" }` (`AUTH_MODE=local`, the default). There is **no refresh token**; the app re-logs in (the device-bound session below is what makes remote sign-out work).
- **Production:** `AUTH_MODE=oidc`: tokens are RS256 JWTs from **Kiorex Passport** (issuer `OIDC_ISSUER`, audience `kiorly-pharmacy`, JWKS `…/jwks`, MFA claim `acr=urn:kiorex:acr:mfa` or `amr` contains `mfa`, required in production for OWNER / BRANCH_MANAGER / CHAIN_OPS / PHARMACIST). The product API already accepts those tokens; the app signs in with OIDC authorization-code + PKCE (`expo-auth-session`) against Passport and sends the access token as `Authorization: Bearer`. The Passport client for the staff app (`kiorly`, legacy `kiorly-team`, redirect `kiorly://auth/callback`) is registered in `kiorex-account/config/idp.json` (local, staging and production); locally the API runs dual (`AUTH_ACCEPT_PASSPORT=true`) so Passport tokens and product login both work. A Passport session ended elsewhere is refused by `sid` (back-channel logout, `PassportRevocation`).
- `GET /auth/me` returns `{ user, tenant{edition,market,mode,currency}, branches[], permissions[], flags{} }` (web-app oriented). The app should use `/mobile/bootstrap` instead.

## 2. Headers the app sends
| Header | Value | Effect |
|---|---|---|
| `Authorization` | `Bearer <token>` | required everywhere except `/auth/login` |
| `X-Kiorly-Client` | `kiorly/<appVersion>` (legacy `kiorly-team/*` and `kiorly-work/*` are still accepted) | opts the request in to **client entitlement enforcement** (section 4) |
| `X-Kiorly-Device` | server device `id` (client `deviceId` also accepted) | with the next header: device-bound session |
| `X-Kiorly-Device-Token` | opaque token returned once by `POST /mobile/devices` | revoked / unknown / mismatched -> **401 `DEVICE_REVOKED`** on any route (remote sign-out) |

## 3. Entitlement `mobile_staff_app`
- Commercial entitlement implemented through the existing flag mechanism (`FeatureFlagsService.evaluate("mobile_staff_app", { orgId, market, entitled })`): **entitled input = edition is PRO, CHAIN or ENTERPRISE and subscription is not SUSPENDED** (`LITE` = BASIC is off), AND the Kiorex flag layers (global / market / org kill switch, code default ON). A plan below PRO can never be switched on by the flag layer; a PRO org can be switched off from Kiorex super admin at org scope (reason `FLAG_OFF`).
- Plan names are normalised for the app: `LITE -> BASIC`, `PRO -> PRO`, `CHAIN` and `ENTERPRISE -> ENTERPRISE` (`org.rawPlan` carries the product edition). No new tenant column was needed: the pharmacy already models plans as `Tenant.edition`.
- **Not a safety control (ADR-025).** Safety alerts (section 6) are never gated.

## 4. Client enforcement
When `X-Kiorly-Client` starts with `kiorly` (or the legacy `kiorly-team` / `kiorly-work`), or the path is under `/mobile/`) and the org lacks the entitlement, every route returns `403 { code:"FEATURE_DISABLED", key:"mobile_staff_app", scope:"org" }` **except** `POST /mobile/upgrade-request`, `/auth/*`, `GET /mobile/bootstrap`, `/mobile/alerts*`, the witness countersign flow (`GET /mobile/pharmacy/controlled/pending-witness`, `POST /mobile/pharmacy/controlled/countersign`; safety, ADR-025; RBAC still applies) and `DELETE /mobile/devices/:id`. The web app (no client header) is never affected. **Precedence:** the plan gate answers before RBAC: `AuthGuard` defers `@Perm` on plan-gated routes and `MobileClientGuard` enforces it after the entitlement check, so a Lite user lacking the permission gets `FEATURE_DISABLED`, never `PERMISSION_DENIED`.

## 5. `/mobile/*` endpoints (new)
### GET `/mobile/bootstrap` (any authenticated staff, every plan)
```json
{ "apiVersion": 1, "product": "pharmacy", "serverTime": "2026-11-20T10:30:28.190Z",
  "user": { "id": "cmwo0…", "name": "Ph. Salma Demo", "email": "pharmacist@demo.kiorly.local", "role": "PHARMACIST", "roles": ["PHARMACIST"], "locale": "ar", "branchId": "cmwo0…", "isPharmacist": true },
  "org": { "id": "cmwo0…", "name": "Kiorly Demo Pharmacy", "slug": "org_demo_kiorly", "plan": "ENTERPRISE", "rawPlan": "CHAIN", "mode": "INTEGRATED" },
  "entitlement": { "key": "mobile_staff_app", "enabled": true, "requiredPlan": "PRO", "reason": null },
  "safetyAlertsOnly": false,
  "modules": [ { "key": "pharmacy.rx", "enabled": true, "screens": ["rx.queue","rx.detail","rx.safety","rx.override"] },
               { "key": "pharmacy.receiving", "enabled": false, "screens": [] } ],
  "device": { "id": "cmwou8…", "status": "ACTIVE" } }
```
BASIC org: `entitlement.enabled=false, reason:"PLAN_BELOW_PRO", safetyAlertsOnly:true, modules:[], device:null`. `reason` is `FLAG_OFF` when Kiorex switched it off. `device` is `null` without device headers.
Module keys and the permissions that enable them (role overrides per tenant are honoured):
`pharmacy.rx` rx.read (+`rx.validate` screen when `rx.validate`: mark validated / reject; +`rx.override` screen when `dispense.signoff`) · `pharmacy.barcode` catalogue.read+inventory.read · `pharmacy.receiving` inventory.receive · `pharmacy.stockcount` inventory.count · `pharmacy.expiry` inventory.read · `pharmacy.controlled` controlled.read · `pharmacy.shift` pos.sell · `pharmacy.customers` customer.read · `pharmacy.orders` orders.read **and** INTEGRATED mode **and** `pharmacy.kiorex_orders` flag ON · `pharmacy.search` catalogue.read.

### Devices (device-bound sessions, remote sign-out)
| Call | Notes |
|---|---|
| `POST /mobile/devices` `{deviceId, platform:"ios"\|"android"\|"web", name, appVersion?, pushToken?}` -> **201** `{ id, deviceToken, status:"ACTIVE" }` | needs entitlement (403 otherwise). `deviceToken` is returned **once**, only its SHA-256 is stored. Idempotent per user+`deviceId`: re-registering rotates the token (old one stops working) and re-activates a revoked row (the user just authenticated). |
| `GET /mobile/devices` -> `{ items:[{id,deviceId,userId,userName,platform,name,appVersion,status,pushRegistered,pushProvider,lastSeenAt,createdAt,revokedAt}] }` | own devices; **OWNER / BRANCH_MANAGER see every tenant device** |
| `DELETE /mobile/devices/:id` -> device view with `status:"REVOKED"` | own device, or OWNER / BRANCH_MANAGER (remote sign-out). Idempotent, audited (`mobile.device_revoke`), clears the push token. 404 for other tenants / other users' devices. Allowed without the entitlement. |
| `PUT /mobile/devices/:id/push-token` `{token, provider:"expo"\|"mock"}` | own device only |
The local access token has no server session to revoke; revocation takes effect through the device guard on the next request (401 `DEVICE_REVOKED`). The app must clear its token and show the sign-in screen on that code.

### Inbox + mock push (needs entitlement)
- `GET /mobile/inbox?limit=30&cursor=<lastId>` -> `{ items:[{id,kind:"GENERAL"|"SAFETY"|"CLINICAL"|"OPS",title,titleAr,body,bodyAr,data,createdAt,readAt}], nextCursor, unread }`
- `POST /mobile/inbox/:id/read` -> `{id,updated}` · `POST /mobile/inbox/read-all` -> `{updated}` · `POST /mobile/push/test` -> `{delivered}`
- Push adapter `PUSH_MODE=mock|real` (default **mock**): the `PushMessage` row *is* the dev inbox and delivery to devices is simulated. Real Expo push is a go-live task (`Docs/NEEDS_HUMAN.md`, "Provider go-live"). Bilingual templates: `rx.awaiting`, `order.received`, `controlled.discrepancy`, `stock.expiry`, `push.test`. Hooks fire on: Rx intake (-> PHARMACIST/OWNER/BRANCH_MANAGER of the branch), Kiorex order received, controlled audit discrepancy (**SAFETY**), expiry-sweep alerts. Non-safety pushes are only stored for orgs holding the entitlement; **SAFETY** messages reach every plan. `data` carries `template` plus ids (`rxId`, `orderId`, `discrepancyId`, `alertId`, `lotId`) for deep links.

### Safety alerts (ADR-025, never gated, every plan)
- `GET /mobile/alerts?status=open|all` -> `{ items:[{ id, kind, severity:"CRITICAL"|"HIGH"|"MEDIUM", title, titleAr, body, bodyAr, subject:{type,id,label}|null, raisedAt, ackedAt, ackedBy }] }` sorted by severity then recency. Derived live (not stored), id = `<KIND>:<subjectId>`. Branch-bound staff see their branch only. Kinds: `CONTROLLED_DRUG_DISCREPANCY` (CRITICAL, open discrepancy), `CONTROLLED_WITNESS_PENDING` (HIGH, no countersign by someone other than the reporter), `RECALLED_LOT_IN_STOCK` (CRITICAL; from an active RecallNotice with stock, or from any lot whose status is RECALLED and still holds stock), `COLD_CHAIN_EXCURSION` (HIGH), `EXPIRED_STOCK` (MEDIUM, once a day).
- `POST /mobile/alerts/:id/ack` `{note?}` -> the alert with `ackedAt/ackedBy`. **Idempotent (first ack wins)**, audited (`mobile.alert_ack`), allowed for OWNER, BRANCH_MANAGER, PHARMACIST, CHAIN_OPS (403 for cashier/assistant), 404 if the alert no longer exists. Acknowledging does not resolve the underlying issue.

### Upgrade request (Basic orgs, exempt from FEATURE_DISABLED like alerts)
- `POST /mobile/upgrade-request` `{featureKey?, note?}` -> `{id, status:"REQUESTED"|"ALREADY_ENTITLED", featureKey, requestedAt, deduped, notified}`. `featureKey` = a module key or `general` (400 otherwise); `note` <= 500 chars. Records requester, role, org, feature, note, time (`MobileUpgradeRequest`); a repeat by the same user for the same feature within **24h** returns the original (`deduped:true`, no second notification). Notifies the OWNER staff via the mock push inbox (`upgrade.request`, kind OPS; the only non-safety push that skips the plan check) and audits `mobile.upgrade_requested`. `ALREADY_ENTITLED` = nothing recorded.
- `GET /mobile/bootstrap` also returns `upgrade` on non-entitled orgs only (`null` on Pro): `{lockedModules:[key], myRequest:{featureKey,requestedAt}|null, openRequests:number|null, openRequestItems:[{id,featureKey,requesterRole,requesterName,requestedAt,note?}] (newest 10 open requests from other people, approvers only, display name only; [] otherwise), canApprove:boolean}`. `lockedModules` = the modules THIS role would get on Pro, so the app renders only role-relevant locked tiles.


### Pharmacy read models (`/mobile/pharmacy/*`, new, permission-checked)
| Call | Permission | Returns |
|---|---|---|
| `GET /mobile/pharmacy/barcode/:code?branchId=` (URL-encode GS1 strings) | catalogue.read + inventory.read | `{found, code, branchId, scan{gtin,lotNumber,expiryDate}, drug{id,brandName,brandNameAr,strength,dosageForm,gtin,rxOnly,controlled,controlledSchedule,coldChain}, price:"42.50", requiresPrescription, stock{onHand,available,nearestExpiry}, lots:[{id,lotNumber,expiryDate,status,qtyOnHand,qtyReserved,expired,daysToExpiry,scannedLotMatch}] }` (lots FEFO ordered; falls back to a name search when the code is not a GTIN; `{found:false,code,scan}` when unknown) |
| `GET /mobile/pharmacy/expiry-lowstock?branchId=` | inventory.read | `{ asOf, expiry{expired,within30,within60,within90 each {lots,units}, items:[{lotId,drugId,brandName,lotNumber,expiryDate,daysToExpiry,qtyOnHand,status,branchId}]}, blocked{quarantined{lots,units}, recalled{lots,units}, items:[...same row + blockedReason]} (any expiry date), lowStock{count, items:[{drugId,branchId,brandName,minQty,maxQty,onHand,suggestedOrder}]} }` |
| `GET /mobile/pharmacy/shift-summary?branchId=` | pos.sell | `{ open, branchId, shift{id,openedAt,openedByName,openingFloat,mine}, report{…X-report: salesCount,grossSales,byMethod,cashSales,cashRefunds,cashIn,cashOut,expectedCash,…}, lastClosed{variance,expectedCash,countedCash} }`; `open:false, report:null` when no shift |
| `GET /mobile/pharmacy/controlled/pending-witness` | controlled.read | `{ items:[{id,branchId,drug,expectedQty,countedQty,difference,notes,reportedBy,reportedByName,createdAt,countersigns[],witnessPending,canCountersign}] }` open discrepancies |
| `POST /mobile/pharmacy/controlled/countersign` `{discrepancyId, note?}` | controlled.manage | `{id,discrepancyId,witnessId,signedAt,note}`. Witness must be a different staff member than the reporter (409 `WITNESS_MUST_DIFFER`), discrepancy must be OPEN (409 `ALREADY_RESOLVED`), idempotent per witness, audited `controlled.countersign`. **Does not touch the register** (resolution with stock correction stays `POST /controlled/discrepancies/:id/resolve`). |
| `GET /mobile/pharmacy/search?q=` (min 2 chars) | any; groups filtered by catalogue.read / customer.read / rx.read | `{ q, drugs[], customers[{id,displayName,phone,customerNo}], prescriptions[{id,status,prescriberName,receivedAt,patientName}] }` (8 each) |

## 6. App API map (existing endpoints per mobile feature)
All paths under `/api/v1`. `branchId` is optional for branch-bound staff (forced to their branch) and required for OWNER/CHAIN_OPS in multi-branch tenants (400 `BRANCH_REQUIRED`). Money values are strings.

### Rx verification queue with safety-check review / override (module `pharmacy.rx`)
| Step | Call | Perm |
|---|---|---|
| Queue | `GET /prescriptions/verification-queue?branchId=` -> `{ total, urgent, items:[{id,status:"RECEIVED"\|"VALIDATING",priority:"URGENT"\|"NORMAL",source,receivedAt,ageMinutes,patient{id,displayName,allergies[]},prescriberName,prescriberVerified,lines,controlled,hasAllergyOnFile,refillsAllowed,verificationNotes,expiresInDays}] }` | rx.read |
| Detail | `GET /prescriptions/:id` -> prescription with `lines[]`, `patient`, prescriber fields; `GET /prescriptions/:id/balance`; `GET /prescriptions/:id/lines/:lineId/substitutes` | rx.read |
| Annotate | `PATCH /prescriptions/:id` `{priority?:"NORMAL"\|"URGENT", verificationNotes?}` | rx.validate |
| Validate / reject | `POST /prescriptions/:id/validate`; `POST /prescriptions/:id/reject` `{reason}`; `PUT /prescriptions/:id/lines/:lineId/drug` `{drugId}` (map an unmatched line) | rx.validate |
| Create draft + run safety checks | `POST /dispensings` `{prescriptionId, branchId?, items:[{prescriptionLineId?, drugId, quantity, substitution?:{fromDrugId,consent}}], partialReason?}` -> dispensing with `safetyChecks:[{id,kind:"INTERACTION"\|"ALLERGY"\|"DUPLICATE_THERAPY"\|"DOSE_QUANTITY"\|"PRESCRIBER"\|"CONTROLLED_LIMIT"\|"DOSE_RANGE"\|"PREGNANCY_LACTATION"\|"RENAL_HEPATIC", outcome:"PASS"\|"WARN"\|"BLOCK"\|"OVERRIDDEN_BY_PHARMACIST", detail, overridable, overriddenBy, overrideReason}]` | dispense.create |
| Review | `GET /dispensings/:id`; `GET /dispensings?prescriptionId=` | rx.read |
| **Override** a WARN/BLOCK | `POST /dispensings/:id/override/:checkId` `{reason (min 5 chars)}`; contraindicated checks have `overridable:false` and cannot be overridden | **dispense.signoff** (licensed pharmacist; locked, never tenant-overridable) |
| Controlled ID | `POST /dispensings/:id/controlled-id` `{nationalId, patientName}` | dispense.create |
| Sign off / complete | `PUT /dispensings/:id/counselling` `{notes, topics?[]}`; `POST /dispensings/:id/signoff` `{counsellingNotes?}`; `POST /dispensings/:id/complete` `{idempotencyKey (>=8), payments?:[{method,amount}], customerAccountId?}`; `POST /dispensings/:id/cancel` `{reason}` | dispense.signoff / dispense.complete |
Example queue item: `{"id":"cmwoswmnf01fas3bh8dz44jhj","status":"RECEIVED","priority":"URGENT","source":"MANUAL_ENTRY","ageMinutes":37,"patient":{"displayName":"منى السيد","allergies":[]},"prescriberName":"Dr. Dalia Samir","prescriberVerified":true,"lines":1,"controlled":false,"expiresInDays":27}`.

### Barcode lookup: price / stock / lots (module `pharmacy.barcode`)
`GET /mobile/pharmacy/barcode/:code` (new, section 5). Existing building blocks: `GET /pos/lookup?code=&branchId=` (drug + price + FEFO suggested lot + availability for the till), `POST /inventory/scan/parse` `{code}` -> `{gtin,lotNumber,expiryDate,drug}` (GS1-128 / GTIN, perm inventory.receive), `GET /inventory/lots?...`, `GET /catalogue/drugs/:id/substitutes`.

### Receiving against a PO by scanning (module `pharmacy.receiving`; PO endpoints need the `purchasing` plan capability, PRO and above)
1. Open POs: `GET /purchase-orders` (supplier.read) -> `[{id,poNumber,status:"DRAFT"\|"SENT"\|"PARTIALLY_RECEIVED"\|"RECEIVED"\|"CANCELLED",branchId,supplierId,supplier{name},expectedAt,totalCost,lines:[{id,drugId,qtyOrdered,qtyReceived,unitCost}]}]`; one PO: `GET /purchase-orders/:id`.
2. Scan each pack: `POST /inventory/scan/parse` `{code}` -> drug + lot + expiry (match `drug.id` to a PO line).
3. Post the receipt (one call, idempotent): `POST /inventory/receipts` `{branchId, supplierId?, purchaseOrderId, invoiceNo?, invoiceTotal?, idempotencyKey, lines:[{drugId | scan, lotNumber, expiryDate, quantity, unitCost, temperatureC?, uom?, locationId?}]}` (perm inventory.receive). Closes/partially closes the PO (409 `PO_CLOSED` when already received). Cold-chain lots take `temperatureC`; an excursion quarantines the lot (shows as `COLD_CHAIN_EXCURSION`).

### Stock count mode (module `pharmacy.stockcount`; perm inventory.count)
`GET /inventory/counts` · `POST /inventory/counts` `{branchId?, type:"CYCLE"\|"FULL", drugIds?[]}` -> count with `lines[{id,lotId,qtyExpected,qtyCounted:null}]` · `GET /inventory/counts/:id` · `PUT /inventory/counts/:id/lines` `{lines:[{lotId,qtyCounted}]}` (call per scan; resolve the lot from `GET /mobile/pharmacy/barcode/:code` `lots[].id`) · `POST /inventory/counts/:id/submit` -> `PENDING_APPROVAL` · managers (`inventory.count.approve`): `POST /inventory/counts/:id/approve` / `reject`. Variances on controlled drugs need a witness at approval.

### Expiry and low-stock dashboard (module `pharmacy.expiry`)
`GET /mobile/pharmacy/expiry-lowstock` (new). Related: `GET /inventory/expiry` (lot list), `GET /inventory/stock`, `GET /inventory/fefo?drugId=&qty=`, `GET /inventory/reorder-policies`, `POST /inventory/lots/:id/quarantine|release|write-off` (inventory.quarantine / inventory.adjust), `GET /notifications/feed` + `GET /notifications/unread-count` (web notification centre alerts, perm notifications.read).

### Controlled-register witness countersign (module `pharmacy.controlled`)
`GET /controlled/balances` (register vs shelf: `[{drug,onHand,registerBalance,inSync}]`), `GET /controlled/register?drugId=`, `GET /controlled/discrepancies?status=OPEN`, `POST /controlled/audits` `{branchId?, drugId, countedQty, notes?, witness:{email,password}}` (controlled.manage; the web flow authenticates the witness at the same till), `POST /controlled/discrepancies/:id/resolve` `{resolution, adjustLotId?, witness?}`. **Mobile witness flow (new):** `GET /mobile/pharmacy/controlled/pending-witness` then `POST /mobile/pharmacy/controlled/countersign` (the witness uses their own phone and account).

### Shift cash summary (module `pharmacy.shift`)
`GET /mobile/pharmacy/shift-summary` (new). Existing: `GET /pos/shifts/current`, `GET /pos/shifts/:id/x-report`, `GET /pos/shifts/:id/z-report`, `POST /pos/shifts/open` `{openingFloat}`, `POST /pos/shifts/:id/close` `{countedCash,...}` (pos.shift), `GET /pos/cash-movements`, `POST /pos/cash-movements` (pos.cash_drawer).

### Quick customer lookup (module `pharmacy.customers`; perm customer.read)
`GET /customers?q=&page=&pageSize=` -> `{ total, page, pageSize, items:[{id,customerNo,displayName,phone,allergies[],chronicConditions[],pregnant,lactating,consentDataProcessing,...}] }` · `GET /customers/:id` · `GET /customers/:id/history` (dispensings/purchases) · `GET /customers/:id/notes` · `GET /customers/:id/loyalty` · `GET /pos/customers/:id` (credit balance/limit, perm customer.credit). Allergy/condition fields are PHI: never log or cache them in analytics.

### Kiorex order alerts (module `pharmacy.orders`, only INTEGRATED tenants with `pharmacy.kiorex_orders` ON)
`GET /kiorex-orders?status=&branchId=` -> `[{id,externalOrderId,status:"RECEIVED"\|"ACCEPTED"\|"PARTIALLY_ACCEPTED"\|"REJECTED"\|"READY"\|"DISPENSED"\|"CANCELLED"\|"EXPIRED",hasRx,prescriptionId,customerName,prepaid,orderValue,slaDueAt,deliveryMethod,...}]` · `GET /kiorex-orders/:id` · `POST /kiorex-orders/:id/accept` · `POST /kiorex-orders/:id/reject` `{reasonCode?,reason}` · `POST /kiorex-orders/:id/ready` (perm orders.respond; accept also needs dispense.create). The new-order push (`order.received`, kind OPS) lands in `/mobile/inbox` with `data.orderId`.

### Global search
`GET /mobile/pharmacy/search?q=` (new, section 5).

### Offline notes
Safe to queue offline: stock-count lines (`PUT /inventory/counts/:id/lines`, last write wins per lot), alert acks (idempotent), countersign (idempotent), inbox read marks. POS sales have their own conflict API (`POST /pos/sync`, `GET /pos/sync/conflicts`). Never queue Rx override/sign-off or receipts without `idempotencyKey`.

## 7. Demo logins
See `Docs/TEST_DATA.md` "Kiorly mobile". Seed: `npm run seed:mobile -w api` (included in `seed:all`; guarded by the demo-seed guard).

## 8. Tests
`apps/api/test/mobile.e2e.test.ts` (17 API tests: entitlement per plan + flag override, bootstrap per role, device lifecycle and revoked guard, client enforcement, inbox/push mock and hooks, safety alerts incl. BASIC org, ack/countersign, recall alert, barcode / expiry / shift / search) and `src/modules/mobile/mobile.node.test.ts` (plan mapping, exemptions, templates). Run `npm test -w api` (needs Postgres on 5433).
