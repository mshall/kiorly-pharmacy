import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { D } from "./money";
import { loyaltyConfig, pointsFor, pointsValue, tierFor } from "./loyalty";

describe("loyalty maths (pure)", () => {
  const cfg = loyaltyConfig({});
  it("defaults: 1 point per 10 EGP spent, 0.50 per point, 4 tiers", () => {
    assert.equal(pointsFor("299.99", "BRONZE", cfg), 29);
    assert.equal(pointsFor("100", "SILVER", cfg), 12);
    assert.equal(pointsFor("100", "PLATINUM", cfg), 20);
    assert.equal(pointsValue(20, cfg).toFixed(2), "10.00");
  });
  it("tiers follow lifetime spend", () => {
    assert.equal(tierFor("0", cfg), "BRONZE"); assert.equal(tierFor("5000", cfg), "SILVER"); assert.equal(tierFor("19999.99", cfg), "SILVER");
    assert.equal(tierFor("20000", cfg), "GOLD"); assert.equal(tierFor("99999", cfg), "PLATINUM");
  });
  it("tenant settings override rates; disabled = no points", () => {
    const c = loyaltyConfig({ loyalty: { earnPer: "5", pointsPerEarn: 2, redeemValue: "0.25", tiers: [{ name: "A", minSpend: "0" }, { name: "B", minSpend: "100" }] } });
    assert.equal(pointsFor("50", "A", c), 20); assert.equal(c.redeemValue.toString(), "0.25"); assert.equal(tierFor(D(150), c), "B");
    assert.equal(pointsFor("500", "BRONZE", loyaltyConfig({ loyalty: { enabled: false } })), 0);
  });
});
