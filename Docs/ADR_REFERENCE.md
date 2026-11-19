# ADR reference — Kiorly Pharmacy

Binding decisions from KX-01 that shape this repo. ADR numbers are used in commit messages and Docs, as in clinics-management.

| ADR | Decision | How it applies here | Where enforced |
|---|---|---|---|
| ADR-004 | Share a commerce kernel by package, not by service | Plans, billing, ledger and settlement come from `@kiorly/commerce-kernel` (PH-F09). Never copy kernel code. | Package dependency; no kernel code in this repo |
| ADR-006 | Integration via HMAC REST + transactional outbox | Events leave only through OutboxEvent in the same transaction; flag snapshot calls use the HMAC scheme. | OutboxEvent table; signControlRequest |
| ADR-012 / ADR-013 | Kiorex Account OIDC; clinical data never in identity | Staff authenticate via Kiorex Account; tokens carry no clinical data. | PH-F07 |
| ADR-014 | Per-market configuration through market packs | No hard-coded Egypt or currency in logic; `marketCode` on Tenant. | Tenant.marketCode |
| ADR-015 | Hosting: AWS, Egypt tenants in the Frankfurt cell | Infra is written separately (OpenTofu). No deploys until the founder says so. | infra/ (not this scaffold) |
| ADR-017 | Pharmacy and Lab start as Kiorly SaaS before any Kiorex commerce | Pilot M13 / GA M16; Kiorex orders (KPMKT) come after. | Phase map in the build sequence |
| ADR-023 | Everything ships ON; super admin can switch any capability OFF | Product flags: `pharmacy.module`, `pharmacy.kiorex_orders`, `pharmacy.forecasting`, `pharmacy.insurer_claims`. OFF => 403 FEATURE_DISABLED {key,scope}; never hides data. | FeatureFlagsService, RequiresFlagGuard, OFF contract tests |
| ADR-024 | Launch-locked flags need gate evidence | Kiorex-side `kiorex.pharmacy_orders` is launch-locked (merchant of record + counsel memo). Gate evidence is recorded by a human only. | Evaluator honours launchLocked/gateSatisfied from the snapshot |
| **ADR-025** | **Safety controls are never feature flags** | See table below. CI rejects flag keys on safety paths; evaluator throws for safety keys; DB triggers/CHECKs back the critical ones. | safety-controls.ts + safety-controls.node.test.ts + migration invariants |
| ADR-026 | 2025 repositories are references, not foundations | Entities were re-modelled as design notes only; no code copied. | Docs/DESIGN_NOTES_FROM_2025.md |
| ADR-027 | Shared code ships as versioned packages on GitHub Packages | `@kiorex/contracts` and `@kiorly/commerce-kernel` consumed as packages. | PH-F09, PH-F11 |
| ADR-028 | Infrastructure as code with OpenTofu | Not part of this scaffold; no CDK/CloudFormation; no `@aws-sdk/*` outside `src/platform/adapters/*` when added. | infra/ owned separately |

## ADR-025 safety controls (never flags, in every edition including Lite)

| Control id | Rule | Requirements | Enforcement (current / planned) |
|---|---|---|---|
| `safety.pharmacy.lot_expiry_block` | Sale of an expired lot is impossible | KPINV03 | DB trigger kx_enforce_lot_sellable + service check (PH-SS01) |
| `safety.pharmacy.lot_recall_block` | Sale of a recalled lot is impossible (cross-branch within 5 minutes) | KPINV03, KPSUP03 | DB trigger (status RECALLED) + recall service (KPSUP03, PH-SS01) |
| `safety.pharmacy.lot_quarantine_block` | Sale of a quarantined lot is impossible (cold-chain excursion, recall hold) | KPINV03, KPINV06 | DB trigger (status QUARANTINE) + cold-chain service (KPINV06) |
| `safety.pharmacy.pharmacist_signoff` | Every Rx dispense carries pharmacist user + timestamp | KPRX06 | DB CHECK dispensing_requires_signoff + service (PH-SS02) |
| `safety.pharmacy.rx_safety_checks` | Interaction / allergy / duplicate checks run on every Rx | KPRX03 | Service (KPRX03) + never-flag CI (PH-SS04) |
| `safety.pharmacy.controlled_substance_log` | Controlled-medicine dispensing log with ID capture; never exposed to Kiorex ordering | KPRX05 | Service (KPRX05); never in Kiorex projections |
| `safety.pharmacy.audit_logging` | State changes affecting stock, money, access are audited | KX-08 §09 | AuditLog writes in services (PH-F08 / LB-F08) |
| `safety.pharmacy.consent_enforcement` | e-Rx intake requires a valid patient consent token | KPRX01 | Service (KPRX01 / KLCRIT02) |
| `safety.pharmacy.tenant_isolation` | Tenant isolation and authorization | KX-08 §09 | orgId on every table + guard (F07); schema smoke test asserts orgId |
| `safety.pharmacy.privileged_mfa` | Privileged MFA on production | KX-08 §09 | Auth guard (F07) |

Also not flags per KX-08 §09: Rx safety checks, encounter sign-off/audit, record view/print/export for the tenant, privileged MFA on production, tenant isolation and authorization, breach-response tooling.

## Adding a flag (checklist)

1. Not a safety control (check the table above). 2. Key `pharmacy.<name>`, ships ON, with a dependency on `pharmacy.module` where sensible. 3. Register in the Kiorex registry (needs human). 4. Add to `feature-flag-keys.ts` and `packages/shared`. 5. Write the OFF contract test (403 FEATURE_DISABLED {key,scope}). 6. Never place `@RequiresFlag` in a safety-path directory (`inventory/lot-guard, dispensing, prescriptions/safety`).
