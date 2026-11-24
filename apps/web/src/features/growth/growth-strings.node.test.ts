import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { GROWTH_AR, GROWTH_EN } from "./growth-strings-data";

const flat = (o: unknown, p = ""): Record<string, string> => (o && typeof o === "object" ? Object.entries(o).reduce<Record<string, string>>((a, [k, v]) => ({ ...a, ...flat(v, p ? `${p}.${k}` : k) }), {}) : { [p]: String(o) });
const RECS = ["CREATE_FIRST_LINK", "PRINT_COUNTER_CARD", "BRANCH_NOT_LISTED", "LINKS_UNUSED", "HIGH_REJECTION"];

describe("Growth strings (AR/EN)", () => {
  const en = flat(GROWTH_EN), ar = flat(GROWTH_AR);
  it("same keys in both languages, none empty", () => {
    assert.deepEqual(Object.keys(ar).sort(), Object.keys(en).sort());
    for (const [k, v] of [...Object.entries(en), ...Object.entries(ar)]) assert.ok(v.trim().length > 0, k);
  });
  it("Arabic strings are Arabic and keep the same placeholders as English", () => {
    for (const [k, v] of Object.entries(ar)) {
      assert.match(v, /[؀-ۿ]/, k);
      assert.deepEqual([...v.matchAll(/{{(\w+)}}/g)].map((m) => m[1]).sort(), [...en[k]!.matchAll(/{{(\w+)}}/g)].map((m) => m[1]).sort(), k);
    }
  });
  it("every recommendation of the closed catalogue has wording, and no wording pushes treatment, price pressure or reviews", () => {
    for (const id of RECS) { assert.ok(en[`rec.${id}`], id); assert.ok(ar[`rec.${id}`], id); }
    for (const v of Object.values(en)) assert.doesNotMatch(v, /\b(discount|cheaper|upsell|buy more|review us|five.star|testimonial)\b/i);
  });
});
