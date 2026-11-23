import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MODULE_DEFS, modulesFor, normalisePlan, planIncludesMobile } from "./mobile-plan";
import { isEntitlementExempt } from "./mobile-client.guard";
import { renderPush, PUSH_TEMPLATES } from "./push.service";
import { isKnownFlagKey } from "../../feature-flags/feature-flag-keys";
import { isSafetyControlKey } from "../../feature-flags/safety-controls";

describe("Kiorly plan mapping (pure)", () => {
  it("LITE=BASIC, PRO=PRO, CHAIN/ENTERPRISE=ENTERPRISE; mobile from PRO upward; suspended loses it", () => {
    assert.deepEqual(["LITE", "PRO", "CHAIN", "ENTERPRISE"].map(normalisePlan), ["BASIC", "PRO", "ENTERPRISE", "ENTERPRISE"]);
    assert.deepEqual(["LITE", "PRO", "CHAIN", "ENTERPRISE"].map((e) => planIncludesMobile(e)), [false, true, true, true]);
    assert.equal(planIncludesMobile("PRO", "SUSPENDED"), false);
    assert.equal(planIncludesMobile("PRO", "TRIAL"), true);
  });
  it("mobile_staff_app is a registered commercial flag and never a safety control (ADR-025)", () => {
    assert.ok(isKnownFlagKey("mobile_staff_app"));
    assert.equal(isSafetyControlKey("mobile_staff_app"), false);
  });
  it("modulesFor enables a module only when all its permissions are held; orders need Kiorex integration", () => {
    const m = modulesFor(new Set(["rx.read", "orders.read", "catalogue.read", "inventory.read"]), false);
    const on = m.filter((x) => x.enabled).map((x) => x.key).sort();
    assert.deepEqual(on, ["pharmacy.barcode", "pharmacy.expiry", "pharmacy.rx", "pharmacy.search"]);
    assert.equal(m.length, MODULE_DEFS.length);
    assert.ok(modulesFor(new Set(["orders.read"]), true).find((x) => x.key === "pharmacy.orders")?.enabled);
    assert.ok(modulesFor(new Set(["rx.read", "dispense.signoff"]), false).find((x) => x.key === "pharmacy.rx")?.screens.includes("rx.override"));
  });
});
describe("client entitlement exemptions", () => {
  it("auth, bootstrap, alerts and device sign-out stay reachable without the entitlement", () => {
    for (const [m, p] of [["POST", "/api/v1/auth/login"], ["GET", "/api/v1/auth/me"], ["GET", "/api/v1/mobile/bootstrap"], ["GET", "/api/v1/mobile/alerts?status=all"], ["POST", "/api/v1/mobile/alerts/X:1/ack"], ["GET", "/api/v1/mobile/pharmacy/controlled/pending-witness"], ["POST", "/api/v1/mobile/pharmacy/controlled/countersign"], ["POST", "/api/v1/mobile/upgrade-request"], ["DELETE", "/api/v1/mobile/devices/abc"]] as const) assert.equal(isEntitlementExempt(m, p), true, `${m} ${p}`);
    for (const [m, p] of [["GET", "/api/v1/mobile/devices"], ["POST", "/api/v1/mobile/devices"], ["GET", "/api/v1/mobile/inbox"], ["GET", "/api/v1/mobile/upgrade-request"], ["GET", "/api/v1/catalogue/drugs"], ["GET", "/api/v1/mobile/alertsx"], ["POST", "/api/v1/mobile/pharmacy/controlled/pending-witness"], ["GET", "/api/v1/mobile/pharmacy/barcode/123"]] as const) assert.equal(isEntitlementExempt(m, p), false, `${m} ${p}`);
  });
});
describe("push templates", () => {
  it("render bilingual text with variables in both locales", () => {
    const r = renderPush("order.received", { order: "KX1", minutes: 15 });
    assert.match(r.body, /KX1/); assert.match(r.bodyAr, /KX1/); assert.equal(r.kind, "OPS");
    for (const k of Object.keys(PUSH_TEMPLATES) as Array<keyof typeof PUSH_TEMPLATES>) { const x = renderPush(k, { drug: "D", expected: 1, counted: 2, days: 3, lot: "L", qty: 4, order: "O", minutes: 5 }); assert.ok(!/[{}]/.test(x.title + x.body + x.titleAr + x.bodyAr), k); }
  });
});

import { MobileClientGuard } from "./mobile-client.guard";
import { isMobilePlanGated } from "./mobile-gate";
describe("plan gate (FEATURE_DISABLED) precedes RBAC (PERMISSION_DENIED) on /mobile routes", () => {
  const mk = (url: string, deferredPerms?: string[], headers: Record<string, string> = {}) => ({ method: "GET", originalUrl: url, url, headers, user: { orgId: "o", role: "TECH" }, deferredPerms });
  const ctx = (r: object) => ({ getType: () => "http", switchToHttp: () => ({ getRequest: () => r }) }) as never;
  const guard = (enabled: boolean) => new MobileClientGuard({ verify: async () => undefined } as never, { assertEnabled: async () => { if (!enabled) throw Object.assign(new Error("x"), { code: "FEATURE_DISABLED" }); } } as never, { forRole: async () => new Set<string>() } as never);
  it("gates /mobile/* and app-identified requests, not the exempt ones", () => {
    assert.equal(isMobilePlanGated(mk("/api/v1/mobile/summary")), true);
    assert.equal(isMobilePlanGated(mk("/api/v1/mobile/pharmacy/orders?x=1")), true);
    assert.equal(isMobilePlanGated(mk("/api/v1/orders", undefined, { "x-kiorly-client": "kiorly/1" })), true);
    for (const legacy of ["kiorly-team/1", "kiorly-work/1"]) assert.equal(isMobilePlanGated(mk("/api/v1/orders", undefined, { "x-kiorly-client": legacy })), true, legacy); // legacy client names
    assert.equal(isMobilePlanGated(mk("/api/v1/orders", undefined, { "x-kiorly-client": "kiorlyx/1" })), false);
    assert.equal(isMobilePlanGated(mk("/api/v1/orders")), false);
    assert.equal(isMobilePlanGated(mk("/api/v1/mobile/alerts")), false);
  });
  it("non-entitled: FEATURE_DISABLED first; entitled: PERMISSION_DENIED; no perm needed: passes", async () => {
    await assert.rejects(() => guard(false).canActivate(ctx(mk("/api/v1/mobile/inbox", ["rx.read"]))), (e: { code?: string }) => e.code === "FEATURE_DISABLED");
    await assert.rejects(() => guard(true).canActivate(ctx(mk("/api/v1/mobile/inbox", ["rx.read"]))), (e: { code?: string }) => e.code === "PERMISSION_DENIED");
    assert.equal(await guard(true).canActivate(ctx(mk("/api/v1/mobile/inbox"))), true);
  });
});
