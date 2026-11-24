import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildPlan, skipKey, type BranchSnap, type SetupSnapshot } from "./setup-plan";

const branch = (id: string, over: Partial<BranchSnap> = {}): BranchSnap => ({ id, name: `Branch ${id}`, licenceNo: null, address: null, stockLots: 0, sales: 0, ...over });
const snap = (over: Partial<SetupSnapshot> = {}): SetupSnapshot => ({ branches: [branch("a")], pharmacistLicensed: false, pricedDrugs: 0, otherStaff: 0, receiptConfigured: false, connectStatus: null, ...over });
const step = (p: ReturnType<typeof buildPlan>, k: string) => p.steps.find((s) => s.key === k)!;

describe("pharmacy quick setup rules", () => {
  it("fresh pharmacy: 0%, branch licence first, nothing manual", () => {
    const p = buildPlan(snap(), {}, { role: "OWNER" });
    assert.equal(p.progressPercent, 0);
    assert.equal(p.nextKey, "branch_licence");
    assert.ok(p.steps.every((s) => !s.manual));
    assert.equal(step(p, "branch_licence").href, "/settings?tab=branches&setup=branch_licence&entity=a");
  });
  it("licence needs both licence number and address", () => {
    assert.equal(step(buildPlan(snap({ branches: [branch("a", { licenceNo: "L1" })] }), {}, { role: "OWNER" }), "branch_licence").status, "pending");
    assert.equal(step(buildPlan(snap({ branches: [branch("a", { licenceNo: "L1", address: "1 Nile St" })] }), {}, { role: "OWNER" }), "branch_licence").status, "done");
  });
  it("multi-branch: per-branch states, aggregate, new branch reopens the step", () => {
    const one = buildPlan(snap({ branches: [branch("a", { stockLots: 2 })] }), {}, { role: "OWNER" });
    assert.equal(step(one, "first_stock").status, "done");
    const two = buildPlan(snap({ branches: [branch("a", { stockLots: 2 }), branch("b")] }), {}, { role: "OWNER" });
    const st = step(two, "first_stock");
    assert.equal(st.status, "pending");
    assert.deepEqual([st.doneCount, st.totalCount], [1, 2]);
    assert.match(st.href, /entity=b$/);
  });
  it("optional steps skip per entity only; required cannot be skipped", () => {
    const p = buildPlan(snap(), { invite_staff: "skipped", [skipKey("branch_licence", "a")]: "skipped" }, { role: "OWNER" });
    assert.equal(step(p, "invite_staff").status, "skipped");
    assert.equal(step(p, "branch_licence").status, "pending");
  });
  it("roles: a cashier cannot change settings and sees who can; Connect to Kiorex is hidden for non-owners", () => {
    const p = buildPlan(snap(), {}, { role: "CASHIER" });
    assert.equal(step(p, "branch_licence").canPerform, false);
    assert.ok(step(p, "branch_licence").whoCan.includes("OWNER"));
    assert.equal(step(p, "first_sale").canPerform, true);
    assert.equal(p.steps.some((s) => s.key === "connect_kiorex"), false);
    assert.equal(buildPlan(snap(), {}, { role: "OWNER" }).steps.some((s) => s.key === "connect_kiorex"), true);
  });
  it("all done only when every unit is done/skipped; dismissal only counts then", () => {
    const done = snap({ branches: [branch("a", { licenceNo: "L", address: "A", stockLots: 1, sales: 1 })], pharmacistLicensed: true, pricedDrugs: 5, otherStaff: 1, receiptConfigured: true, connectStatus: "APPROVED" });
    const p = buildPlan(done, {}, { role: "OWNER" }, "2026-01-01T00:00:00Z");
    assert.equal(p.allDone, true);
    assert.equal(p.dismissedAt, "2026-01-01T00:00:00Z");
    assert.equal(buildPlan(snap(), {}, { role: "OWNER" }, "2026-01-01T00:00:00Z").dismissedAt, null);
  });
});
