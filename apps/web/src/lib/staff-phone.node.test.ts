import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isE164, normalizeStaffPhone } from "./staff-phone";

describe("staff phone (E.164)", () => {
  it("normalizes formatting and the 00 prefix", () => {
    assert.equal(normalizeStaffPhone("+20 100 000-2004"), "+201000002004");
    assert.equal(normalizeStaffPhone("00201000002004"), "+201000002004");
    assert.equal(normalizeStaffPhone("(+20) 100.000.2004"), "+201000002004");
  });
  it("refuses national numbers, short/long numbers, leading zero country codes and text", () => {
    for (const bad of ["01000002004", "+20", "+0100000200", "+2010000020041234", "abc", "", "+20 1000 00200x"]) assert.equal(isE164(bad), false, bad);
    assert.equal(normalizeStaffPhone(null), null);
  });
});
