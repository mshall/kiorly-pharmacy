import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { signKiorlyRequest } from "@kiorex/contracts";
import { auth, bootApp, seedTenant, type Fixture, type TestApp } from "./helpers";

/** COM-2 commission rate (pharmacy): Kiorex reports it over the HMAC machine API; owner / branch manager / chain operations read it, read only. Every rate is a TEST placeholder. */
describe("Kiorex commission rate view (pharmacy)", () => {
  let t: TestApp, f: Fixture, other: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); other = await seedTenant(t); });
  after(async () => { await t.close(); });
  const spec = (o: object = {}) => ({ feeType: "PERCENT", percentBps: 800, flatMinor: null, minMinor: null, maxMinor: null, mode: null, ...o });
  const view = (orgRef: string, version: string, history: object[]) => ({ orgRef, product: "PHARMACY", version, history });
  const def = (version: number, from: string, s: object = spec()) => ({ version, scope: "DEFAULT", kind: "RATE", effectiveFrom: from, reason: null, spec: s });
  const push = (fx: Fixture, body: object) => {
    const path = "/marketplace/v1/commission-rates";
    const s = signKiorlyRequest({ clientKey: fx.client.key, clientSecret: fx.client.secret, method: "POST", path, body: JSON.stringify(body) });
    return t.http.post(path).set({ ...s.headers, "content-type": "application/json" }).send(JSON.stringify(body));
  };
  const read = (token: string) => t.http.get("/api/v1/growth/commission-rate").set(auth(token));

  it("with nothing reported the owner sees 'rate not set' (no invented rate)", async () => {
    const r = await read(f.users.owner.token);
    assert.equal(r.status, 200);
    assert.deepEqual([r.body.known, r.body.state, r.body.effective.spec], [false, "NOT_SET", null]);
  });

  it("Kiorex reports a view: idempotent, newest version wins, a malformed view is refused, a view is stored only for the signing organisation", async () => {
    assert.equal((await push(f, view(f.orgId, "100", [def(1, "2026-01-01T00:00:00Z")]))).body.applied, true);
    assert.equal((await push(f, view(f.orgId, "100", [def(1, "2026-01-01T00:00:00Z", spec({ percentBps: 9999 }))]))).body.applied, false);
    assert.equal((await push(f, view(f.orgId, "90", []))).body.applied, false);
    assert.equal((await read(f.users.owner.token)).body.effective.spec.percentBps, 800);
    assert.equal((await push(f, view("pr_pharmacy_registration", "200", [def(1, "2026-01-01T00:00:00Z", spec({ percentBps: 700 }))]))).body.applied, true); // Kiorex's own reference to the organisation (registration id) is accepted, stored for the SIGNING organisation only
    assert.equal((await read(other.users.owner.token)).body.known, false);
    assert.equal((await read(f.users.owner.token)).body.effective.spec.percentBps, 700);
    assert.equal((await push(f, view(f.orgId, "250", [def(1, "2026-01-01T00:00:00Z")]))).body.applied, true); // restore for the next test
    assert.equal((await push(f, { ...view(f.orgId, "200", []), product: "HOTEL" })).status, 400);
    assert.equal((await t.http.post("/marketplace/v1/commission-rates").send(view(f.orgId, "300", []))).status, 401); // no signature
  });

  it("shows default, own rate with its reason, upcoming change and history; an old instant keeps the old rate", async () => {
    const future = new Date(Date.now() + 5 * 86_400_000).toISOString();
    await push(f, view(f.orgId, "400", [
      def(1, "2026-01-01T00:00:00Z"),
      { version: 1, scope: "ORG", kind: "RATE", effectiveFrom: "2026-03-01T00:00:00Z", reason: "volume agreement", spec: spec({ feeType: "FLAT", percentBps: null, flatMinor: 2500 }) },
      def(2, future, spec({ percentBps: 1200 })),
    ]));
    const r = (await read(f.users.owner.token)).body;
    assert.equal(r.effective.source, "OVERRIDE"); assert.equal(r.effective.reason, "volume agreement"); assert.equal(r.inheriting, false);
    assert.equal(r.default.spec.percentBps, 800); assert.equal(r.upcoming.version, 2); assert.equal(r.history.length, 3);
    assert.equal((await t.http.get("/api/v1/growth/performance").set(auth(f.users.owner.token))).body.statement.configured, true);
  });

  it("roles: owner, branch manager and chain operations read it; a pharmacist and a cashier do not; another organisation sees nothing of it", async () => {
    for (const u of [f.users.owner, f.users.manager, f.users.chainOps]) assert.equal((await read(u.token)).status, 200);
    for (const u of [f.users.pharmacist, f.users.cashier]) assert.equal((await read(u.token)).status, 403);
    assert.equal((await read(other.users.owner.token)).body.known, false);
  });
});
