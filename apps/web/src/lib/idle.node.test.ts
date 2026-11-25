import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { idleLimitMs } from "./idle";

describe("idleLimitMs (G-24)", () => {
  it("defaults to 30 minutes, 0 switches off, clamps to 5..480 and ignores junk", () => {
    assert.equal(idleLimitMs(undefined), 30 * 60_000); assert.equal(idleLimitMs(""), 30 * 60_000); assert.equal(idleLimitMs("x"), 30 * 60_000);
    assert.equal(idleLimitMs("0"), 0); assert.equal(idleLimitMs("2"), 5 * 60_000); assert.equal(idleLimitMs("45"), 45 * 60_000); assert.equal(idleLimitMs("9999"), 480 * 60_000);
  });
});
