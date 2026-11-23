import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { applyThemePref, readThemePref } from "./ui-kit";

/** Founder, 24 Nov 2026: LIGHT is the default theme; only an explicit Light / Dark / System choice is stored (`kx-theme`) and restored. */
const g = globalThis as Record<string, unknown>;
const classes = new Set<string>();
const root = { classList: { toggle: (c: string, on: boolean) => void (on ? classes.add(c) : classes.delete(c)), contains: (c: string) => classes.has(c) }, dataset: {} as Record<string, string>, style: {} as Record<string, string> };
let store: Record<string, string> = {};
const osDark = { matches: true };
beforeEach(() => {
  store = {}; classes.clear(); root.dataset = {}; root.style = {};
  g.localStorage = { getItem: (k: string) => store[k] ?? null, setItem: (k: string, v: string) => { store[k] = v; } };
  g.document = { documentElement: root };
  g.matchMedia = () => osDark;
});
afterEach(() => { delete g.localStorage; delete g.document; delete g.matchMedia; });

describe("theme: light by default", () => {
  it("is light on a fresh visit, even when the OS is dark", () => {
    assert.equal(readThemePref(), "light");
    applyThemePref(readThemePref());
    assert.equal(root.dataset.theme, "light");
    assert.equal(classes.has("dark"), false);
  });
  it("restores a stored dark choice, and System follows the OS only when explicitly chosen", () => {
    store["kx-theme"] = "dark";
    assert.equal(readThemePref(), "dark");
    applyThemePref(readThemePref());
    assert.equal(root.dataset.theme, "dark"); assert.equal(classes.has("dark"), true);
    store["kx-theme"] = "system";
    assert.equal(readThemePref(), "system");
    applyThemePref("system");
    assert.equal(root.dataset.theme, "dark"); // the OS is dark in this test
    osDark.matches = false; applyThemePref("system"); assert.equal(root.dataset.theme, "light"); osDark.matches = true;
  });
  it("ignores garbage in storage", () => {
    store["kx-theme"] = "purple";
    assert.equal(readThemePref(), "light");
  });
  it("the inline boot script in index.html defaults to light and does not read the OS unless 'system' was chosen", () => {
    const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
    assert.match(html, /getItem\("kx-theme"\) \|\| "light"/);
    assert.doesNotMatch(html, /\|\| "system"/);
  });
});
