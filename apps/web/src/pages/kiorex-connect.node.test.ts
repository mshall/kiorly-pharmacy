import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
const here0 = dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(readFileSync(join(here0, "../locales/en.json"), "utf8")).kiorexConnect as Record<string, unknown>;
const ar = JSON.parse(readFileSync(join(here0, "../locales/ar.json"), "utf8")).kiorexConnect as Record<string, unknown>;

const flat = (o: Record<string, unknown>, p = ""): string[] => Object.entries(o).flatMap(([k, v]) => (typeof v === "object" && v ? flat(v as Record<string, unknown>, `${p}${k}.`) : [`${p}${k}`]));
describe("pharmacy Connect to Kiorex wizard", () => {
  it("AR and EN bundles match and every static key used by the page exists", () => {
    assert.deepEqual(flat(en).sort(), flat(ar).sort());
    const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "KiorexConnect.tsx"), "utf8");
    const keys = new Set(flat(en)); const used = [...src.matchAll(/\bt\(\s*["'`](kiorexConnect\.[a-zA-Z0-9_.]+)["'`]/g)].map((m) => m[1]!.replace("kiorexConnect.", ""));
    assert.ok(used.length > 15); assert.deepEqual(used.filter((k) => !keys.has(k)), []);
  });
  it("uses logical layout and brand tokens only", () => {
    const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "KiorexConnect.tsx"), "utf8");
    assert.doesNotMatch(src, /#[0-9a-fA-F]{6}\b/); assert.doesNotMatch(src, /\b(ml|mr|pl|pr|text-left|text-right)-/);
  });
  it("browser-walk regressions: AA colours, decision banner, rotation is not a new request, labelled branch fields, step 4 points to the form", () => {
    const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "KiorexConnect.tsx"), "utf8");
    assert.match(src, /text-amber-700 dark:text-amber-400/); assert.doesNotMatch(src, /text-(emerald|amber|sky)-600/);
    for (const s of ["CHANGES_REQUESTED", "REJECTED", "PAUSED"]) assert.ok((en.decision as Record<string, string>)[s] && (ar.decision as Record<string, string>)[s], s);
    assert.match(src, /connect-decision/); assert.match(src, /const rotate = /); assert.match(src, /aria-label=\{t\("kiorexConnect\.licenceUpload\.choose"\)\}/);
    assert.doesNotMatch(src, /<Input aria-label=\{t\("kiorexConnect\.branch\.(licenceNo|radius|lat|lng)"\)\} placeholder/); // visible labels, not placeholder-only
  });
});
