import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Prisma } from "@prisma/client";
import { applyPromotions, type PromoCartLine, type PromoDef } from "./promotions";

const D = (v: number | string) => new Prisma.Decimal(v);
const line = (drugId: string, quantity: number, price: number, manual = 0): PromoCartLine => ({ drugId, quantity, unitPrice: D(price), manualDiscount: D(manual) });
const promo = (p: Partial<PromoDef> & Pick<PromoDef, "kind" | "params">): PromoDef => ({ id: p.id ?? "p1", name: p.name ?? "Promo", drugIds: [], priority: 0, stackable: false, ...p });
const total = (r: ReturnType<typeof applyPromotions>) => [...r.byDrug.values()].reduce((a, b) => a.plus(b), D(0)).toFixed(2);

describe("promotion engine (pure)", () => {
  it("percent off the scoped drugs only", () => {
    const r = applyPromotions([line("a", 2, 50), line("b", 1, 100)], [promo({ kind: "PERCENT_OFF", params: { percent: 10 }, drugIds: ["a"] })]);
    assert.equal(r.byDrug.get("a")!.toFixed(2), "10.00"); assert.equal(r.byDrug.has("b"), false); assert.equal(r.applied[0]!.amount.toFixed(2), "10.00");
  });
  it("whole-cart percent when no scope; amount off per unit is capped at the line value", () => {
    assert.equal(total(applyPromotions([line("a", 1, 40), line("b", 1, 60)], [promo({ kind: "PERCENT_OFF", params: { percent: 25 } })])), "25.00");
    assert.equal(total(applyPromotions([line("a", 3, 10)], [promo({ kind: "AMOUNT_OFF", params: { amount: 4 }, drugIds: ["a"] })])), "12.00");
    assert.equal(total(applyPromotions([line("a", 1, 3)], [promo({ kind: "AMOUNT_OFF", params: { amount: 10 }, drugIds: ["a"] })])), "3.00");
  });
  it("buy X get Y free: 2+1 on 7 units gives 2 free", () => {
    const r = applyPromotions([line("a", 7, 20)], [promo({ kind: "BUY_X_GET_Y", params: { buy: 2, get: 1 }, drugIds: ["a"] })]);
    assert.equal(total(r), "40.00");
    assert.equal(total(applyPromotions([line("a", 2, 20)], [promo({ kind: "BUY_X_GET_Y", params: { buy: 2, get: 1 }, drugIds: ["a"] })])), "0.00", "not enough units");
    assert.equal(total(applyPromotions([line("a", 3, 20)], [promo({ kind: "BUY_X_GET_Y", params: { buy: 2, get: 1, percentOff: 50 }, drugIds: ["a"] })])), "10.00");
  });
  it("bundle price: only complete bundles count and the saving is spread across the bundle lines", () => {
    const bundle = promo({ kind: "BUNDLE_PRICE", params: { items: [{ drugId: "a", qty: 1 }, { drugId: "b", qty: 2 }], price: 100 } });
    const one = applyPromotions([line("a", 1, 60), line("b", 2, 30)], [bundle]); // list 120 -> 100
    assert.equal(total(one), "20.00");
    assert.equal(applyPromotions([line("a", 1, 60), line("b", 1, 30)], [bundle]).applied.length, 0, "incomplete bundle");
    assert.equal(total(applyPromotions([line("a", 3, 60), line("b", 4, 30)], [bundle])), "40.00", "two complete bundles");
    assert.equal(applyPromotions([line("a", 1, 40), line("b", 2, 30)], [bundle]).applied.length, 0, "a bundle price above list gives no discount");
  });
  it("coupon codes: only with the code (case-insensitive); unknown codes are reported", () => {
    const c = promo({ kind: "PERCENT_OFF", params: { percent: 20 }, couponCode: "SAVE20" });
    assert.equal(total(applyPromotions([line("a", 1, 100)], [c])), "0.00");
    const r = applyPromotions([line("a", 1, 100)], [c], ["save20", "nope"]);
    assert.equal(total(r), "20.00"); assert.deepEqual(r.unusedCoupons, ["nope"]); assert.equal(r.applied[0]!.couponCode, "SAVE20");
  });
  it("minimum subtotal gate; priority + stackable rules; manual discount is respected as already given", () => {
    const min = promo({ kind: "PERCENT_OFF", params: { percent: 10 }, minSubtotal: D(100) });
    assert.equal(total(applyPromotions([line("a", 1, 99)], [min])), "0.00"); assert.equal(total(applyPromotions([line("a", 1, 100)], [min])), "10.00");
    const hi = promo({ id: "hi", kind: "PERCENT_OFF", params: { percent: 50 }, priority: 5, drugIds: ["a"] });
    const lo = promo({ id: "lo", kind: "PERCENT_OFF", params: { percent: 10 }, priority: 1, drugIds: ["a"] });
    assert.equal(total(applyPromotions([line("a", 1, 100)], [lo, hi])), "50.00", "non-stackable: the higher priority wins, the other is skipped");
    assert.equal(total(applyPromotions([line("a", 1, 100)], [{ ...lo, stackable: true }, hi])), "55.00", "stackable applies on the remainder (10% of 50)");
    assert.equal(total(applyPromotions([line("a", 1, 100, 95)], [promo({ kind: "PERCENT_OFF", params: { percent: 50 }, drugIds: ["a"] })])), "2.50", "applies to what is left after the manual discount");
  });
  it("property: promotions never discount more than the line value", () => {
    for (const pct of [1, 33, 100]) for (const qty of [1, 4, 9]) {
      const r = applyPromotions([line("a", qty, 7.77)], [promo({ kind: "PERCENT_OFF", params: { percent: pct } }), promo({ id: "x", kind: "AMOUNT_OFF", params: { amount: 5 }, drugIds: ["a"], stackable: true })]);
      assert.ok(r.byDrug.get("a")!.lte(D(7.77).mul(qty)));
    }
  });
});
