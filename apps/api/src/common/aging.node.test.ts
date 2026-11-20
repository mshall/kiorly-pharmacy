import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ageInvoices, bucketFor, termsDays } from "./aging";

const day = 86_400_000;
const asOf = new Date("2026-11-20T00:00:00Z");
const inv = (id: string, daysAgo: number, amount: number, dueDays = 30) => ({ id, at: new Date(asOf.getTime() - daysAgo * day), dueDays, amount });

describe("aging (pure)", () => {
  it("buckets by days past due", () => {
    assert.deepEqual([0, -5, 1, 30, 31, 60, 61, 90, 91, 400].map(bucketFor), ["current", "current", "d1_30", "d1_30", "d31_60", "d31_60", "d61_90", "d61_90", "d90_plus", "d90_plus"]);
  });
  it("terms parsing", () => { assert.equal(termsDays("30 days"), 30); assert.equal(termsDays("Net 15"), 15); assert.equal(termsDays("cash"), 0); assert.equal(termsDays(null), 0); });
  it("credits clear the OLDEST invoices first; the rest is bucketed", () => {
    const r = ageInvoices([inv("old", 120, 100), inv("mid", 70, 200), inv("new", 10, 300)], 150, asOf); // due: old 90d ago, mid 40d ago, new not due
    assert.equal(r.outstanding.toFixed(2), "450.00");
    assert.equal(r.buckets.d61_90.toFixed(2), "0.00"); // old fully paid
    assert.equal(r.buckets.d31_60.toFixed(2), "150.00"); // mid partially paid: 200 - 50
    assert.equal(r.buckets.current.toFixed(2), "300.00");
    assert.deepEqual(r.open.map((o) => o.id), ["mid", "new"]);
  });
  it("overpayment is reported as credit; nothing outstanding; order of input does not matter", () => {
    const r = ageInvoices([inv("b", 5, 40), inv("a", 50, 60)], 130, asOf);
    assert.equal(r.outstanding.toFixed(2), "0.00"); assert.equal(r.credit.toFixed(2), "30.00");
    const x = ageInvoices([inv("a", 50, 60), inv("b", 5, 40)], 70, asOf), y = ageInvoices([inv("b", 5, 40), inv("a", 50, 60)], 70, asOf);
    assert.equal(x.outstanding.toFixed(2), y.outstanding.toFixed(2));
  });
  it("90+ days overdue lands in the last bucket", () => {
    const r = ageInvoices([inv("ancient", 200, 500)], 0, asOf);
    assert.equal(r.buckets.d90_plus.toFixed(2), "500.00"); assert.equal(r.open[0]!.daysPastDue, 170);
  });
});
