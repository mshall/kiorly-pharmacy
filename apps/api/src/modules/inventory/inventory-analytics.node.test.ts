import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { classifyMovers } from "./inventory-analytics.service";

describe("movers classification (pure)", () => {
  it("DEAD = stock with no net sale; FAST/SLOW are the top/bottom quintile once there are >= 5 sellers", () => {
    const rows = [{ id: "dead", units: 0, onHand: 40 }, { id: "gone", units: 0, onHand: 0 }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({ id: `s${n}`, units: n * 10, onHand: 5 }))];
    const by = Object.fromEntries(classifyMovers(rows).map((r) => [r.id, r.class]));
    assert.equal(by.dead, "DEAD"); assert.equal(by.gone, "NORMAL");
    assert.equal(by.s10, "FAST"); assert.equal(by.s9, "FAST"); assert.equal(by.s1, "SLOW"); assert.equal(by.s5, "NORMAL");
  });
  it("with fewer than 5 sellers nobody is called fast or slow", () => {
    assert.deepEqual(classifyMovers([{ units: 1, onHand: 1 }, { units: 50, onHand: 1 }]).map((r) => r.class), ["NORMAL", "NORMAL"]);
  });
});
