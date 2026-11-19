import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { SAFETY_CONTROLS } from "@kiorly/pharmacy-shared";
import { SAFETY_PATH_DIRS } from "./safety-controls";

const modulesRoot = resolve(__dirname, "../modules");

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".ts") ? [p] : [];
  });
}

describe("ADR-025 never-flags guard", () => {
  it("lists the PRD safety controls", () => {
    assert.ok(SAFETY_CONTROLS.length >= 8);
    for (const c of SAFETY_CONTROLS) assert.match(c.id, /^safety\.pharmacy\./);
  });

  it("no safety-path code references feature flags", () => {
    const offenders: string[] = [];
    for (const d of SAFETY_PATH_DIRS) {
      for (const f of walk(join(modulesRoot, d))) {
        const src = readFileSync(f, "utf8");
        if (/FeatureFlagsService|RequiresFlag|isEnabled\(/.test(src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, ""))) offenders.push(f);
      }
    }
    assert.deepEqual(offenders, [], "safety paths must not be gated by flags (ADR-025)");
  });
});
