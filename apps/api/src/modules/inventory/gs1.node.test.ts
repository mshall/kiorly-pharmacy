import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseGs1 } from "./gs1";

describe("GS1 parsing (KPINV01)", () => {
  it("parses the human-readable form", () => {
    assert.deepEqual(parseGs1("(01)06223000112345(17)281231(10)BATCH77"), { gtin: "06223000112345", expiry: "2028-12-31", lot: "BATCH77" });
  });
  it("parses the raw form with GS separator after a variable-length lot", () => {
    assert.deepEqual(parseGs1("0106223000112345" + "17270630" .slice(0, 8) + "10LOT-9\u001d21SER1"), { gtin: "06223000112345", expiry: "2027-06-30", lot: "LOT-9", serial: "SER1" });
  });
  it("day 00 means the last day of the month; invalid dates are dropped", () => {
    assert.equal(parseGs1("(17)270200").expiry, "2027-02-28");
    assert.equal(parseGs1("(17)271300").expiry, undefined);
  });
  it("returns an empty object for garbage", () => { assert.deepEqual(parseGs1("hello"), {}); });
});
