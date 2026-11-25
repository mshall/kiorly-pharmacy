import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { capabilityRows, hasCap, isFreeEdition, priceOf, usagePercent } from "./subscription-logic";

describe("SUB-01 pharmacy plan logic", () => {
  it("usage percent", () => { assert.equal(usagePercent(1, 2), 50); assert.equal(usagePercent(5, 2), 100); assert.equal(usagePercent(1, 0), 100); assert.equal(usagePercent(3, null), null); });
  it("capability rows are the union, add-ons stay separate rows", () => {
    const plans = [{ capabilities: ["kiorex_orders"], addOns: [] }, { capabilities: ["kiorex_orders", "purchasing"], addOns: ["insurer_claims"] }];
    assert.deepEqual(capabilityRows(plans), ["kiorex_orders", "purchasing", "insurer_claims (add-on)"]);
    assert.equal(hasCap(plans[1]!, "insurer_claims (add-on)"), true); assert.equal(hasCap(plans[0]!, "purchasing"), false);
  });
  it("free edition and price lookup (null = placeholder, never a guess)", () => { assert.equal(isFreeEdition("LITE"), true); assert.equal(priceOf({ prices: [] }, "MONTHLY"), null); });
});
