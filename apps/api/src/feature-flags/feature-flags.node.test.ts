import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { FeatureFlagsService } from "./feature-flags.service";
import { FLAG_DEFINITIONS } from "./feature-flag-keys";
import { SafetyControlNotAFlagError, SAFETY_CONTROL_IDS } from "./safety-controls";
import { signControlRequest } from "./flag-snapshot";

const snap = (flags: object[]) => ({ product: "kiorly-pharmacy", version: 1, generatedAt: new Date().toISOString(), flags: flags as never });

describe("feature flag evaluator (stub)", () => {
  it("defaults every flag ON when no snapshot is loaded", () => {
    const s = new FeatureFlagsService();
    for (const f of FLAG_DEFINITIONS) assert.equal(s.isEnabled(f.key), true, f.key);
  });

  it("global OFF reports scope and dependents go OFF with scope dependency", () => {
    const s = new FeatureFlagsService();
    s.setSnapshot(snap([{ key: "pharmacy.module", values: { global: "OFF" } }]));
    assert.deepEqual(s.evaluate("pharmacy.module"), { key: "pharmacy.module", enabled: false, scope: "global" });
    assert.equal(s.evaluate("pharmacy.kiorex_orders").scope, "dependency");
  });

  it("market and org OFF only affect that context", () => {
    const s = new FeatureFlagsService();
    s.setSnapshot(snap([{ key: "pharmacy.kiorex_orders", values: { markets: { EG: "OFF" }, orgs: { o1: "OFF" } } }]));
    assert.equal(s.evaluate("pharmacy.kiorex_orders", { market: "EG" }).scope, "market");
    assert.equal(s.evaluate("pharmacy.kiorex_orders", { orgId: "o1" }).scope, "org");
    assert.equal(s.isEnabled("pharmacy.kiorex_orders", { market: "SA", orgId: "o2" }), true);
  });

  it("launch-locked flag is OFF without gate evidence, ON with it", () => {
    const s = new FeatureFlagsService();
    s.setSnapshot(snap([{ key: "pharmacy.kiorex_orders", launchLocked: true, gateSatisfied: false }]));
    assert.equal(s.evaluate("pharmacy.kiorex_orders").scope, "launch-locked");
    s.setSnapshot(snap([{ key: "pharmacy.kiorex_orders", launchLocked: true, gateSatisfied: true }]));
    assert.equal(s.isEnabled("pharmacy.kiorex_orders"), true);
  });

  it("safety controls can never be evaluated as flags (ADR-025)", () => {
    const s = new FeatureFlagsService();
    for (const id of SAFETY_CONTROL_IDS) assert.throws(() => s.evaluate(id), SafetyControlNotAFlagError);
    assert.throws(() => s.evaluate("safety.anything"), SafetyControlNotAFlagError);
  });

  it("no flag key collides with a safety control", () => {
    for (const f of FLAG_DEFINITIONS) assert.ok(!SAFETY_CONTROL_IDS.includes(f.key) && !f.key.startsWith("safety."));
  });

  it("refresh keeps last good snapshot on failure and honours 304", async () => {
    process.env.KIOREX_FLAGS_URL = "http://localhost:4000/api/v1/control/v1/flags/snapshot";
    process.env.KIOREX_PRODUCT_KEY = "k";
    process.env.KIOREX_PRODUCT_SECRET = "s";
    const s = new FeatureFlagsService();
    const ok = await s.refresh((async () => new Response(JSON.stringify(snap([])), { status: 200, headers: { etag: '"v1"' } })) as typeof fetch);
    assert.equal(ok, "updated");
    let sentEtag: string | null = null;
    const nm = await s.refresh((async (_u: unknown, init?: RequestInit) => { sentEtag = (init?.headers as Record<string, string>)["if-none-match"]; return new Response(null, { status: 304 }); }) as typeof fetch);
    assert.equal(nm, "not-modified");
    assert.equal(sentEtag, '"v1"');
    const bad = await s.refresh((async () => { throw new Error("down"); }) as typeof fetch);
    assert.equal(bad, "failed");
    assert.equal(s.getSnapshotVersion(), 1);
  });

  it("signature is deterministic base64url", () => {
    const a = signControlRequest("s", { timestamp: "t", nonce: "n", method: "get", path: "/p" });
    assert.equal(a, signControlRequest("s", { timestamp: "t", nonce: "n", method: "GET", path: "/p" }));
    assert.match(a, /^[A-Za-z0-9_-]+$/);
  });
});
