import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { effectivePermissions, PRIVILEGED_ROLES } from "./permissions";
import { mfaMandatoryForRole, resetMfaPolicyCache, roleCovered, setCoverageFetcher, type Coverage } from "./mfa-policy";

const env = { ...process.env };
afterEach(() => { process.env = { ...env }; setCoverageFetcher(undefined); });

const cov = (mandatory: string[], partial: string[] = [], enabled = true): Coverage => ({ enabled, types: { pharmacy: { mandatory, partial }, lab: { mandatory: ["*"], partial: [] } } });

describe("MFA policy coverage (pharmacy type)", () => {
  it("off, empty, role lists, wildcard, partial and unknown (fail closed)", () => {
    assert.equal(roleCovered(cov([], [], false), "OWNER", true), false);
    assert.equal(roleCovered(cov([]), "OWNER", true), false);
    assert.equal(roleCovered(cov(["owner"]), "OWNER", false), true);
    assert.equal(roleCovered(cov(["owner"]), "PHARMACIST", false), false);
    assert.equal(roleCovered(cov(["*"]), "BRANCH_MANAGER", false), true);
    assert.equal(roleCovered(cov([], ["owner"]), "OWNER", false), false);
    assert.equal(roleCovered(cov([], ["owner"]), "OWNER", true), true);
    assert.equal(roleCovered(null, "OWNER", false), true);
    assert.equal(roleCovered(cov([]), "OWNER", false, "lab"), true); // another type's rules are not this type's
  });
  it("without a Passport issuer, or when it cannot be read, the answer is mandatory (the behaviour before the policy existed)", async () => {
    delete process.env.OIDC_ISSUER; delete process.env.KIOREX_OIDC_ISSUER; delete process.env.MFA_POLICY_URL; resetMfaPolicyCache();
    assert.equal(await mfaMandatoryForRole("OWNER"), true);
    process.env.OIDC_ISSUER = "http://passport.invalid"; setCoverageFetcher(async () => { throw new Error("down"); });
    assert.equal(await mfaMandatoryForRole("OWNER"), true);
    setCoverageFetcher(async () => ({ nonsense: true }) as never);
    assert.equal(await mfaMandatoryForRole("OWNER"), true);
  });
  it("reads the policy once per 15 s and follows it", async () => {
    process.env.OIDC_ISSUER = "http://passport.invalid"; let calls = 0; let c = cov([]);
    setCoverageFetcher(async (url) => { calls++; assert.equal(url, "http://passport.invalid/.well-known/kiorex-mfa-policy"); return c; });
    assert.equal(await mfaMandatoryForRole("OWNER"), false); assert.equal(await mfaMandatoryForRole("PHARMACIST"), false); assert.equal(calls, 1);
    c = cov(["owner"]); resetMfaPolicyCache();
    assert.equal(await mfaMandatoryForRole("OWNER"), true); assert.equal(await mfaMandatoryForRole("PHARMACIST"), false);
    process.env.MFA_POLICY_SOURCE = "always"; assert.equal(await mfaMandatoryForRole("PHARMACIST"), true);
  });
});

const staff = (role: string) => ({ id: "s1", orgId: "o1", role, displayName: "S", active: true, branchId: null, pharmacistLicenceNo: null, tenant: { marketCode: "EG", edition: "PRO" } });
const guard = (role: string) => new AuthGuard(new Reflector(), { staffUser: { findFirst: async () => staff(role) } } as never, { verify: async () => ({ sub: "s1", mfa: false, claims: {} }) } as never, { forRole: async (_o: string, r: string) => effectivePermissions(r as never) } as never);
const ctx = () => ({ getType: () => "http", getHandler: () => () => undefined, getClass: () => class {}, switchToHttp: () => ({ getRequest: () => ({ headers: { authorization: "Bearer t" } }) }) }) as never;

describe("auth guard follows the Passport MFA policy in production", () => {
  it("policy OFF: every privileged role works without the MFA claim; ON for the role: MFA_REQUIRED; unreadable: MFA_REQUIRED", async () => {
    process.env.NODE_ENV = "production"; process.env.AUTH_MODE = "oidc"; process.env.OIDC_ISSUER = "http://passport.invalid";
    setCoverageFetcher(async () => cov([]));
    for (const role of PRIVILEGED_ROLES) assert.equal(await guard(role).canActivate(ctx()), true, role);
    setCoverageFetcher(async () => cov(["owner", "pharmacist"]));
    await assert.rejects(guard("OWNER").canActivate(ctx()), (e: { response?: { code?: string } }) => e.response?.code === "MFA_REQUIRED");
    await assert.rejects(guard("PHARMACIST").canActivate(ctx()), (e: { response?: { code?: string } }) => e.response?.code === "MFA_REQUIRED");
    assert.equal(await guard("BRANCH_MANAGER").canActivate(ctx()), true);
    setCoverageFetcher(async () => { throw new Error("down"); });
    await assert.rejects(guard("OWNER").canActivate(ctx()), (e: { response?: { code?: string } }) => e.response?.code === "MFA_REQUIRED");
  });
});
