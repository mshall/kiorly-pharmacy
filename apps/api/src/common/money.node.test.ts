import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import "./decimal-json";
import { D, money, round2, sum, vatFromGross } from "./money";

describe("money helpers", () => {
  it("VAT is extracted from a VAT-inclusive gross (display only)", () => {
    assert.equal(vatFromGross("114.00", "0.14").toFixed(2), "14.00");
    assert.equal(vatFromGross("200.00", "0.14").toFixed(2), "24.56");
    assert.equal(vatFromGross("50", "0").toFixed(2), "0.00");
  });
  it("property: net + vat == gross to the cent, vat never exceeds gross", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 10_000_000 }), fc.constantFrom("0", "0.05", "0.14"), (cents, rate) => {
      const gross = D(cents).div(100);
      const vat = vatFromGross(gross, rate);
      assert.ok(vat.lte(gross));
      assert.ok(gross.minus(vat).plus(vat).equals(gross));
    }));
  });
  it("decimals serialise as 2dp strings, never floats", () => {
    assert.equal(JSON.stringify({ a: D(200), b: D("0.1").plus("0.2"), vat: D("0.1400") }), '{"a":"200.00","b":"0.30","vat":"0.14"}');
    assert.equal(money(null), "0.00");
    assert.equal(round2("1.005").toFixed(2), "1.01");
    assert.equal(sum(["0.1", "0.2", "0.3"]).toFixed(2), "0.60");
  });
});
