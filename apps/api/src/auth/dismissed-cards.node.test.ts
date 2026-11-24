import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidDismissedBody, MAX_DISMISSED, sanitizeDismissed } from "./dismissed-cards";

describe("dismissed cards (per user, server side)", () => {
  it("keeps only valid unique slugs, in order, capped", () => {
    assert.deepEqual(sanitizeDismissed(["kiorex-home", "kiorex-home", "bad key", 3, "", "a.b:c_d".replace("_", "-")]), ["kiorex-home", "a.b:c-d"]);
    assert.deepEqual(sanitizeDismissed("nope"), []);
    assert.equal(sanitizeDismissed(Array.from({ length: 80 }, (_, i) => `k${i}`)).length, MAX_DISMISSED);
  });
  it("rejects a malformed body", () => {
    assert.equal(isValidDismissedBody({ keys: ["kiorex-home"] }), true);
    for (const b of [null, {}, { keys: "x" }, { keys: [1] }, { keys: ["has space"] }, { keys: Array.from({ length: 51 }, (_, i) => `k${i}`) }]) assert.equal(isValidDismissedBody(b), false);
  });
});
