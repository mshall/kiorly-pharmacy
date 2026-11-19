import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const load = (n: string) => JSON.parse(readFileSync(fileURLToPath(new URL(n, import.meta.url)), "utf8")) as Record<string, unknown>;

function flatten(o: unknown, prefix = ""): Record<string, unknown> {
  if (Array.isArray(o)) return o.reduce<Record<string, unknown>>((a, v, i) => ({ ...a, ...flatten(v, `${prefix}[${i}]`) }), {});
  if (o && typeof o === "object") return Object.entries(o).reduce<Record<string, unknown>>((a, [k, v]) => ({ ...a, ...flatten(v, prefix ? `${prefix}.${k}` : k) }), {});
  return { [prefix]: o };
}

describe("locale parity (AR/EN)", () => {
  const en = flatten(load("en.json"));
  const ar = flatten(load("ar.json"));
  it("same keys in en.json and ar.json", () => {
    assert.deepEqual(Object.keys(ar).sort(), Object.keys(en).sort());
  });
  it("no empty strings", () => {
    for (const [k, v] of [...Object.entries(en), ...Object.entries(ar)]) assert.ok(typeof v === "string" && v.trim().length > 0, k);
  });
  it("Arabic strings are actually Arabic", () => {
    for (const [k, v] of Object.entries(ar).filter(([k]) => k !== "app.lang")) assert.match(String(v), /[\u0600-\u06FF]/, k);
  });
});
