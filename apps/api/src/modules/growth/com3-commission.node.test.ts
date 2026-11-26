import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CommissionRateSpec as RateSpecView } from "@kiorex/contracts";
import { NO_RATE_PARAMS, parseCounselStatus, parseDisclosure, rateParamsOf, rateViewProblems } from "./commission-rate-view";
import { normalizeStatement, periodRange } from "./commission-statement";

const spec = (o: Partial<RateSpecView> = {}): RateSpecView => ({ feeType: "PERCENT", percentBps: 800, flatMinor: null, minMinor: null, maxMinor: null, mode: null, ...o });
const from = new Date("2026-12-01T00:00:00Z"); const to = new Date("2027-01-01T00:00:00Z");

describe("COM-3 pharmacy: rate view extras are read tolerantly", () => {
  it("accepts new spec fields, disclosure, counsel and unknown blocks; old views still pass", () => {
    const h = [{ version: 1, scope: "DEFAULT", kind: "RATE", effectiveFrom: "2026-12-01T00:00:00Z", reason: null, spec: spec({ graceDays: 5, retryDays: [2, 5] }) }];
    assert.deepEqual(rateViewProblems({ orgRef: "p", product: "PHARMACY", version: "1", history: h, disclosure: { rateDisclosure: { ar: "x" } }, counsel: { status: "APPROVED", reviewerName: "X" }, later: 1 }), []);
    assert.deepEqual(rateViewProblems({ orgRef: "p", product: "PHARMACY", version: "1", history: [{ ...h[0], spec: spec() }] }), []);
  });
  it("wording set only when some text is non-empty; counsel keeps the status only", () => {
    assert.equal(parseDisclosure({ rateDisclosure: { en: "", ar: "" }, termsSummary: { en: "", ar: "" } })?.wordingSet, false);
    assert.equal(parseDisclosure({ termsSummary: { en: "terms" } })?.wordingSet, true);
    assert.equal(parseDisclosure(7), null);
    assert.deepEqual(parseCounselStatus({ status: "REJECTED", reviewerName: "N", documentId: "D", conditions: "C" }), { status: "REJECTED", reviewedOn: null });
    assert.equal(parseCounselStatus({ status: "??" }), null);
  });
  it("parameters read as null when absent or malformed", () => {
    assert.deepEqual(rateParamsOf(spec()), NO_RATE_PARAMS);
    assert.deepEqual(rateParamsOf(spec({ retryDays: [3, 1], graceDays: 31 })), NO_RATE_PARAMS);
    assert.equal(rateParamsOf(spec({ invoiceDueDays: 12 })).invoiceDueDays, 12);
  });
});

describe("COM-3 pharmacy: settlement statement shape", () => {
  it("period is YYYY-MM in UTC", () => {
    assert.equal(periodRange("2026-12")?.from.toISOString(), from.toISOString());
    assert.equal(periodRange("2026-00"), null); assert.equal(periodRange("x"), null);
  });
  it("normalizes the Kiorex shape: bank transfer only, fees can be present, unknown fields dropped, sparse input safe", () => {
    const v = normalizeStatement({ orgRef: "pr_1", currency: "egp", onlineCollectionsMinor: 9000, cashVisitCommissionAccruedMinor: 0, deductions: { commissionMinor: 900, feesMinor: 100, refundsMinor: 0, chargebacksMinor: 0 }, netPayableMinor: 8000, paidByBankTransferMinor: 8000, payouts: [{ payoutRef: "po1", paidAt: "2026-12-04T00:00:00Z", cashMinor: 8000, commissionDeductedMinor: 900, bankReference: "po1", reconciliation: "MATCHED" }], reconciliation: "MATCHED", extra: 1 }, { orgRef: "pr_1", from, to })!;
    assert.deepEqual([v.currency, v.payoutMethod, v.deductions.feesMinor, v.netPayableMinor, v.reconciliation, v.payouts[0]?.reconciliation, v.source], ["EGP", "BANK_TRANSFER", 100, 8000, "MATCHED", "MATCHED", "KIOREX"]);
    assert.equal("extra" in (v as object), false);
    const s = normalizeStatement({ netPayableMinor: 1 }, { orgRef: "pr_1", from, to })!;
    assert.deepEqual([s.payouts, s.reconciliation, s.deductions.feesMinor], [[], "UNMATCHED", null]);
    assert.equal(normalizeStatement([], { orgRef: "x", from, to }), null);
  });
});
