import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { signKiorlyRequest } from "@kiorex/contracts";
import { auth, bootApp, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

describe("Kiorex tab: pause/resume of the whole listing, per-user card dismissal, shared sign-in throttle", () => {
  let t: TestApp, f: Fixture;
  before(async () => {
    t = await bootApp(); f = await seedTenant(t);
    const r = await t.http.put(`/api/v1/kiorex-orders/settings/${f.branchId}`).set(auth(f.users.owner.token)).send({ optedIn: true, deliveryRadiusKm: "7.5", prepMinutes: 25, slaMinutes: 10 });
    assert.equal(r.status, 200, JSON.stringify(r.body));
  });
  after(async () => { await t.close(); });
  const owner = () => auth(f.users.owner.token);
  const machine = (method: "GET" | "POST", path: string, body?: object) => {
    const raw = body ? JSON.stringify(body) : "";
    const s = signKiorlyRequest({ clientKey: f.client.key, clientSecret: f.client.secret, method, path, body: raw });
    const req = (method === "GET" ? t.http.get(path) : t.http.post(path)).set({ ...s.headers, "content-type": "application/json" });
    return body ? req.send(raw) : req;
  };

  it("pausing the listing hides every branch and refuses new orders (409 LISTING_PAUSED); resuming restores it; both are audited", async () => {
    const drug = await seedDrug(t, f, { price: "10.00" }); await receive(t, f, { drugId: drug.id, quantity: 10 });
    const order = () => machine("POST", "/marketplace/v1/orders", { orderId: `o-${randomUUID()}`, branchId: f.branchId, lines: [{ sku: drug.id, quantity: 1, unitPrice: "10.00" }] });
    assert.equal((await machine("GET", "/marketplace/v1/availability")).body.branches.length, 1);
    const p = await t.http.post("/api/v1/kiorex-connect/front-door/listing/pause").set(owner()).send({ reason: "Stocktake" });
    assert.equal(p.status, 200, JSON.stringify(p.body));
    assert.deepEqual({ paused: p.body.listing.paused, reason: p.body.listing.reason }, { paused: true, reason: "Stocktake" });
    assert.equal((await machine("GET", "/marketplace/v1/availability")).body.branches.length, 0);
    const refused = await order(); assert.equal(refused.status, 409); assert.equal(refused.body.code, "LISTING_PAUSED");
    // per-branch settings are untouched
    assert.equal((await t.http.get(`/api/v1/kiorex-connect/branches`).set(owner())).body.find((b: { id: string }) => b.id === f.branchId).optedIn, true);
    assert.equal((await t.http.post("/api/v1/kiorex-connect/front-door/listing/pause").set(owner()).send({})).body.listing.paused, true, "idempotent");
    const r = await t.http.post("/api/v1/kiorex-connect/front-door/listing/resume").set(owner()).send({});
    assert.equal(r.status, 200); assert.equal(r.body.listing.paused, false);
    assert.equal((await machine("GET", "/marketplace/v1/availability")).body.branches.length, 1);
    assert.notEqual((await order()).body.code, "LISTING_PAUSED", "orders flow again");
    const actions = (await t.prisma.auditLog.findMany({ where: { orgId: f.orgId, action: { startsWith: "kiorex_listing." } }, orderBy: { at: "asc" } })).map((a) => a.action);
    assert.deepEqual(actions, ["kiorex_listing.paused", "kiorex_listing.resumed"]);
  });

  it("only users with settings.write can pause", async () => {
    assert.equal((await t.http.post("/api/v1/kiorex-connect/front-door/listing/pause").set(auth(f.users.cashier.token)).send({})).status, 403);
  });

  it("dismissed cards are stored per user on the server", async () => {
    const a = f.users.owner, b = f.users.manager;
    assert.deepEqual((await t.http.get("/api/v1/me/preferences/dismissed-cards").set(auth(a.token))).body, { keys: [] });
    const put = await t.http.put("/api/v1/me/preferences/dismissed-cards").set(auth(a.token)).send({ keys: ["kiorex-home", "kiorex-home"] });
    assert.equal(put.status, 200); assert.deepEqual(put.body, { keys: ["kiorex-home"] });
    assert.deepEqual((await t.http.get("/api/v1/me/preferences/dismissed-cards").set(auth(a.token))).body, { keys: ["kiorex-home"] });
    assert.deepEqual((await t.http.get("/api/v1/me/preferences/dismissed-cards").set(auth(b.token))).body, { keys: [] }, "another user is unaffected");
    assert.equal((await t.http.put("/api/v1/me/preferences/dismissed-cards").set(auth(a.token)).send({ keys: ["bad key"] })).status, 400);
    assert.equal((await t.http.get("/api/v1/me/preferences/dismissed-cards")).status, 401);
  });

  it("the sign-in throttle is counted in Postgres (429 after 10 attempts), not in process memory", async () => {
    const email = `nobody.${randomUUID().slice(0, 6)}@test.kiorly.local`;
    for (let i = 0; i < 10; i++) assert.equal((await t.http.post("/api/v1/auth/login").send({ email, password: "wrong-pass" })).status, 401);
    const r = await t.http.post("/api/v1/auth/login").send({ email, password: "wrong-pass" });
    assert.equal(r.status, 429); assert.equal(r.body.code, "RATE_LIMITED");
    assert.ok((await t.prisma.$queryRawUnsafe<{ count: number }[]>(`SELECT "count" FROM "RateLimitBucket" WHERE "key" LIKE $1`, `signin:${email}%`)).length >= 1);
  });
});
