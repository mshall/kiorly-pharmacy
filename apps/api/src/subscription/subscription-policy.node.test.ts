import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { computeDowngradeImpact, decidePeriodEnd, DEFAULT_SUBSCRIPTION_POLICY, effectiveAutoRenew, loadPolicy, nextOutsideQuietHours, parseSubscriptionPolicy, reminderOffsetsDue } from "./subscription-policy";
import { MockBillingCharge, billingChargeFromEnv, UnwiredRealBillingCharge } from "./billing.port";

const D = 86_400_000;
describe("SUB-01 pharmacy policy (pure)", () => {
  it("defaults: auto-renew ON, Lite on lapse; env override and garbage fall back safely", () => {
    assert.deepEqual(parseSubscriptionPolicy(null), DEFAULT_SUBSCRIPTION_POLICY);
    assert.equal(loadPolicy({ SUBSCRIPTION_POLICY_JSON: "{not json" } as never).autoRenewDefault, true);
    const p = loadPolicy({ SUBSCRIPTION_POLICY_JSON: JSON.stringify({ downgradeAfterDays: 9999, renewalReminderDaysBefore: [1, 14], taxRatePercent: 200 }) } as never);
    assert.equal(p.downgradeAfterDays, 365); assert.deepEqual(p.renewalReminderDaysBefore, [14, 1]); assert.equal(p.taxRatePercent, 0);
  });
  it("force beats the org switch; period end decisions", () => {
    assert.equal(effectiveAutoRenew({ autoRenew: false, autoRenewForced: "ON" }), true);
    const now = new Date("2026-12-01T00:00:00Z"), end = new Date("2026-11-30T00:00:00Z");
    assert.equal(decidePeriodEnd({ edition: "PRO", autoRenew: true, currentPeriodEnd: end, now }), "RENEW");
    assert.equal(decidePeriodEnd({ edition: "PRO", autoRenew: false, currentPeriodEnd: end, now }), "DOWNGRADE_AUTO_RENEW_OFF");
    assert.equal(decidePeriodEnd({ edition: "LITE", autoRenew: false, currentPeriodEnd: end, now }), "NONE");
    assert.equal(decidePeriodEnd({ edition: "PRO", autoRenew: false, currentPeriodEnd: new Date(now.getTime() + D), now }), "NONE");
  });
  it("reminders: tightest due offset only, never twice, quiet hours deferral", () => {
    const end = new Date("2026-12-10T12:00:00Z");
    assert.deepEqual(reminderOffsetsDue({ currentPeriodEnd: end, now: new Date("2026-12-04T00:00:00Z"), offsets: [7, 3, 1], alreadySent: [] }), [7]);
    assert.deepEqual(reminderOffsetsDue({ currentPeriodEnd: end, now: new Date("2026-12-07T00:00:00Z"), offsets: [7, 3, 1], alreadySent: [3] }), []);
    assert.equal(nextOutsideQuietHours(new Date("2026-12-04T21:00:00Z"), { start: 21, end: 8 }, 2).toISOString(), "2026-12-05T06:00:00.000Z");
  });
  it("downgrade impact shows lost capabilities and shrinking limits against usage; data retained", () => {
    const i = computeDowngradeImpact({ edition: "PRO", maxUsers: 5, maxBranches: null, capabilities: ["kiorex_orders", "purchasing"] }, { edition: "LITE", maxUsers: 2, maxBranches: 1, capabilities: ["kiorex_orders"] }, { users: 4, branches: 3 }, 30);
    assert.deepEqual(i.lostFeatures, ["purchasing"]);
    assert.deepEqual(i.reducedLimits.map((l) => [l.key, l.overBy]), [["users", 2], ["branches", 2]]);
    assert.equal(i.dataRetained, true);
  });
  it("mock charge is idempotent and declines tokens containing fail; real mode refuses until wired", async () => {
    const m = new MockBillingCharge();
    const a = await m.charge({ orgId: "o", tokenRef: "tok_ok", amount: "1.00", currency: "EGP", invoiceId: "i", idempotencyKey: "k" });
    assert.equal(a.status, "succeeded"); assert.deepEqual(await m.charge({ orgId: "o", tokenRef: "tok_fail", amount: "1.00", currency: "EGP", invoiceId: "i", idempotencyKey: "k" }), a);
    assert.equal((await m.charge({ orgId: "o", tokenRef: "tok_fail", amount: "1", currency: "EGP", invoiceId: "i", idempotencyKey: "k2" })).status, "failed");
    assert.ok(billingChargeFromEnv({ BILLING_MODE: "real" } as never) instanceof UnwiredRealBillingCharge);
  });
});
