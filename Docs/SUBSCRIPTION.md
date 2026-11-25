# Recurring subscription, auto-renew and Lite (SUB-01, Pharmacy)

Built and tested locally; not deployed. Mirrors Clinic's `Docs/PLANS_AND_PRICING.md` section SUB-01 (same rules, same endpoint and event names) until `@kiorly/commerce-kernel` ships (ADR-004/027), when `src/subscription/subscription-policy.ts` is replaced by the kernel.

**Rule (founder):** a paid edition renews automatically by default. Switching renewal off, or a lapse dunning cannot fix, moves the pharmacy to the free **Lite** edition, never to lockout. Nothing is deleted.

| Topic | Behaviour |
|---|---|
| Data | `OrgSubscription` (lifecycle), `SubscriptionEvent` (trail + audit), `SubscriptionNotice` (owner notices; the row is the mock dev inbox), `SubscriptionInvoice` (receipt per period, unique `(orgId, periodKey)` makes renewals idempotent), `PlanPrice` (empty until prices are set). `Tenant.edition` stays the source of truth for entitlements. Migration `20270301100000_sub01_subscription`. |
| Default | `autoRenew = true`. Owner switches it off only after the confirmation (`AUTO_RENEW_CONFIRMATION_REQUIRED` carries the downgrade impact until `confirmDowngrade: true`). The plan stays until the period end. |
| Renewal | `SubscriptionService.runDaily` (JobsService, every 6 hours, idempotent): period end with auto-renew ON creates the invoice and charges the saved token through `BillingChargePort` (same shape as Clinic's `PaymentGateway.chargeToken`; `BILLING_MODE=mock` default, `real` refuses until wired). Failure: `PAST_DUE`, retries on day 1, 3, 7, notice `payment_failed`, `downgrade_warning` the day before, Lite after `downgradeAfterDays` (15) with reason `payment_failed`. With no catalog price the period rolls without charge and the event `renewed_without_charge` records it. |
| Auto-renew OFF | At the period end the edition becomes Lite (`auto_renew_off`). |
| Lite enforcement | Capabilities of the previous edition stay READ-ONLY (GET/HEAD) for `liteReadOnlyGraceDays` (30), writes answer 402 `ENTITLEMENT_REQUIRED`; after the grace the capability needs an upgrade. Existing staff and branches are never removed; adding above the Lite cap is blocked (existing `checkLimit`). |
| Reminders | `renewal_reminder` / `renewal_off_reminder` / `payment_method_missing` at 7, 3, 1 days, tightest due offset only, once per period, `notBefore` outside quiet hours 21:00 to 08:00 Cairo. Account-holder transactional notices; the e-mail/WhatsApp sender is a provider go-live task (mock). |
| Reactivate | `POST /subscription/reactivate` (owner): previous edition by default; needs an active price (else `NO_ACTIVE_PRICE`, "price to be confirmed"). |
| Card | `PUT /subscription/payment-method` accepts a provider token reference and last4 only; a card number is refused (`PAN_NOT_ACCEPTED`). The page adds a MOCK card until the hosted PSP session exists. |
| API | `GET /subscription`, `/plans`, `/downgrade-impact`, `/invoices`, `/notices`; `POST /auto-renew`, `/reactivate`; `PUT /payment-method`. Reads need `settings.read`; changes need `settings.write` AND the OWNER role. |
| Web | `/plan` (nav, Plan and subscription): current plan, usage, renewal date, auto-renew switch and confirmation, comparison table from the kernel plans, payment method, invoices. EN/AR RTL, dark, 320 and 1440, axe clean. |

## Not built here (honest gaps)
- Platform super admin force and the maker-checker config catalog live in Kiorex's control plane (`SubscriptionService.forceAutoRenew` exists and is audited, no endpoint calls it yet); defaults come from code and `SUBSCRIPTION_POLICY_JSON` (LG-SUB-7).
- Platform subscriptions list, MRR and churn views are Kiorex ops work (Clinic has them).
- Proration: there is no mid-period plan change in Pharmacy; upgrade starts a new period today (rules NEEDS_HUMAN, LG-SUB-3).
- Real PSP charge, hosted card capture, notice delivery: go-live (LG-SUB-5).

## Tests
`src/subscription/subscription-policy.node.test.ts`, `test/subscription.e2e.test.ts` (default, renew once under 8 concurrent runs, failure to Lite, cancel to Lite with read-only grace, reactivate, roles, force, reminders and quiet hours, PAN refused), web `subscription.node.test.ts`, Playwright `apps/web/e2e/subscription.spec.ts`.
