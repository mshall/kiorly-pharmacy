import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { PERMISSIONS, PRIVILEGED_ROLES, ROLE_PERMISSIONS, roleHas } from "./permissions";

const env = { ...process.env };
afterEach(() => { process.env = { ...env }; });

function ctx(headers: Record<string, string>) {
  const req: { headers: Record<string, string>; user?: unknown } = { headers };
  return { req, c: { getType: () => "http", getHandler: () => () => undefined, getClass: () => class {}, switchToHttp: () => ({ getRequest: () => req }) } as never };
}
const staff = (role: string) => ({ id: "s1", orgId: "o1", role, displayName: "S", active: true, branchId: null, pharmacistLicenceNo: null, tenant: { marketCode: "EG", edition: "PRO" } });
const guard = (mfa: boolean, role: string) => new AuthGuard(new Reflector(), { staffUser: { findFirst: async () => staff(role) } } as never, { verify: async () => ({ sub: "s1", mfa, claims: {} }) } as never);

describe("auth guard: privileged MFA in production (KX-08 §09)", () => {
  it("OIDC + production: privileged roles without an MFA claim are refused; with MFA or non-privileged roles pass", async () => {
    process.env.NODE_ENV = "production"; process.env.AUTH_MODE = "oidc";
    for (const role of PRIVILEGED_ROLES) {
      const a = ctx({ authorization: "Bearer t" });
      await assert.rejects(guard(false, role).canActivate(a.c), (e: { response?: { code?: string } }) => e.response?.code === "MFA_REQUIRED", role);
      assert.equal(await guard(true, role).canActivate(ctx({ authorization: "Bearer t" }).c), true);
    }
    assert.equal(await guard(false, "CASHIER").canActivate(ctx({ authorization: "Bearer t" }).c), true);
  });
  it("tenant identity comes only from the verified staff row, never from request headers", async () => {
    process.env.NODE_ENV = "test"; process.env.AUTH_MODE = "local";
    const a = ctx({ authorization: "Bearer t", "x-org-id": "ATTACKER", "x-tenant-id": "ATTACKER" });
    await guard(false, "OWNER").canActivate(a.c);
    assert.equal((a.req.user as { orgId: string }).orgId, "o1");
  });
});

describe("RBAC matrix", () => {
  it("every permission is granted to someone; OWNER has all; cashier cannot sign off or approve", () => {
    for (const p of PERMISSIONS) assert.ok(Object.values(ROLE_PERMISSIONS).some((s) => s.has(p)), p);
    assert.equal(ROLE_PERMISSIONS.OWNER.size, PERMISSIONS.length);
    assert.equal(roleHas("CASHIER", "dispense.signoff"), false);
    assert.equal(roleHas("CASHIER", "pos.refund_approve"), false);
    assert.equal(roleHas("PHARMACIST", "dispense.signoff"), true);
    assert.equal(roleHas("BRANCH_MANAGER", "dispense.signoff"), false);
    assert.equal(roleHas("CHAIN_OPS", "pos.sell"), false);
  });
});
