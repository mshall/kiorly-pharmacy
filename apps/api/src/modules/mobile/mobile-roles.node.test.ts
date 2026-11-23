import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ROLE_PERMISSIONS } from "../../auth/permissions";
import { modulesFor } from "./mobile-plan";

const keys = (role: keyof typeof ROLE_PERMISSIONS, kiorexOrders = true) => modulesFor(ROLE_PERMISSIONS[role], kiorexOrders).filter((m) => m.enabled).map((m) => m.key.replace("pharmacy.", "")).sort();
const screens = (role: keyof typeof ROLE_PERMISSIONS) => modulesFor(ROLE_PERMISSIONS[role], true).find((m) => m.key === "pharmacy.rx")!.screens;

/** The module set each built-in role gets in Kiorly (default permissions; tenants can override non-locked ones). Pins the role matrix proven end to end by e2e 17. */
describe("Kiorly pharmacy: modules per role (default RBAC)", () => {
  it("owner, pharmacist and branch manager get every module", () => {
    const all = ["barcode", "controlled", "customers", "expiry", "orders", "receiving", "rx", "search", "shift", "stockcount"];
    for (const r of ["OWNER", "PHARMACIST", "BRANCH_MANAGER"] as const) assert.deepEqual(keys(r), all, r);
  });
  it("cashier: till work only (no receiving, stock count, controlled register or online orders)", () => {
    assert.deepEqual(keys("CASHIER"), ["barcode", "customers", "expiry", "rx", "search", "shift"]);
  });
  it("assistant: receive + count but no controlled witness / orders", () => {
    assert.deepEqual(keys("ASSISTANT"), ["barcode", "customers", "expiry", "receiving", "rx", "search", "shift", "stockcount"]);
  });
  it("chain ops: head-office read view (no Rx, till, receiving, count or controlled)", () => {
    assert.deepEqual(keys("CHAIN_OPS"), ["barcode", "customers", "expiry", "orders", "search"]);
  });
  it("orders module disappears when the tenant is STANDALONE or the Kiorex orders flag is off", () => {
    for (const r of ["OWNER", "PHARMACIST", "BRANCH_MANAGER", "CHAIN_OPS"] as const) assert.ok(!keys(r, false).includes("orders"), r);
  });
  it("only licensed signers (dispense.signoff) get the rx.override screen: not the manager, cashier or assistant", () => {
    assert.ok(screens("PHARMACIST").includes("rx.override")); assert.ok(screens("OWNER").includes("rx.override"));
    for (const r of ["BRANCH_MANAGER", "CASHIER", "ASSISTANT"] as const) assert.ok(!screens(r).includes("rx.override"), r);
  });
  it("rx.validate screen (mark validated / reject) only for roles holding rx.validate: pharmacist, owner, manager; never cashier or assistant", () => {
    for (const r of ["OWNER", "PHARMACIST", "BRANCH_MANAGER"] as const) assert.ok(screens(r).includes("rx.validate"), r);
    for (const r of ["CASHIER", "ASSISTANT"] as const) assert.ok(!screens(r).includes("rx.validate"), r);
  });
  it("controlled witness countersign needs controlled.manage: manager/pharmacist yes, cashier/assistant no", () => {
    for (const r of ["PHARMACIST", "BRANCH_MANAGER", "OWNER"] as const) assert.ok(ROLE_PERMISSIONS[r].has("controlled.manage"), r);
    for (const r of ["CASHIER", "ASSISTANT", "CHAIN_OPS"] as const) assert.ok(!ROLE_PERMISSIONS[r].has("controlled.manage"), r);
    assert.ok(!ROLE_PERMISSIONS.ASSISTANT.has("inventory.count.approve") && !ROLE_PERMISSIONS.CASHIER.has("inventory.count.approve"));
  });
});
