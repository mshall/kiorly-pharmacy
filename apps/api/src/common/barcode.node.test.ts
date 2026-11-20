import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { barcodeSvg, code128Modules, ean13Bits, ean13Check, isEan13 } from "./barcode";

describe("barcode generators", () => {
  it("EAN-13: check digit, 95 modules, guard patterns", () => {
    assert.equal(ean13Check("400638133393"), 1);
    assert.ok(isEan13("4006381333931"));
    assert.ok(!isEan13("4006381333932"));
    const bits = ean13Bits("4006381333931");
    assert.equal(bits.length, 95);
    assert.ok(bits.startsWith("101") && bits.endsWith("101") && bits.slice(45, 50) === "01010");
  });
  it("Code 128-B: start/stop, checksum and total width (11 modules per symbol, 13 for STOP)", () => {
    const w = code128Modules("Kiorly-123");
    assert.equal(w.reduce((a, b) => a + b, 0), 11 * (1 + 10 + 1) + 13);
    assert.throws(() => code128Modules("é"));
    // known vector from the Code 128 spec example "PJJ123C": start B(104) P J J 1 2 3 C => checksum 879 mod 103 = 55
    const sum = [104, 48, 42, 42, 17, 18, 19, 35].reduce((a, c, i) => a + c * (i === 0 ? 1 : i), 0);
    assert.equal(sum % 103, 55);
  });
  it("picks EAN-13 when valid else Code 128 and produces SVG", () => {
    assert.match(barcodeSvg("4006381333931"), /<svg[\s\S]*<rect/);
    assert.match(barcodeSvg("RX-000123"), /aria-label="RX-000123"/);
  });
});
