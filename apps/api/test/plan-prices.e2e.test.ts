import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { signKiorlyRequest } from "@kiorex/contracts";
import { bootApp, seedTenant, type TestApp } from "./helpers";

/** LG-SUB-1: plan prices through the signed platform route. Every number here is a TEST placeholder; the table is emptied before and after. */
describe("plan prices (signed platform route, append-only, maker-checker)", () => {
  let t: TestApp; const KEY = "plans-admin-test-key", SECRET = "plans-admin-test-secret-0123456789";
  const actor = (id: string) => ({ id });
  const call = (method: "GET" | "POST", path: string, body?: object, over: { key?: string; secret?: string; nonce?: string } = {}) => {
    const raw = body ? JSON.stringify(body) : "";
    const s = signKiorlyRequest({ clientKey: over.key ?? KEY, clientSecret: over.secret ?? SECRET, method, path: path.split("?")[0]!, body: raw, nonce: over.nonce });
    const r = method === "GET" ? t.http.get(path) : t.http.post(path).set("content-type", "application/json");
    return r.set(s.headers).send(raw || undefined);
  };
  const price = (o: object = {}) => ({ edition: "PRO", marketCode: "EG", interval: "MONTHLY", currency: "EGP", amount: "100.00", actor: actor("checker-1"), approval: { proposalId: `kpp_${Math.random().toString(36).slice(2)}`, proposedBy: "maker-1" }, ...o });
  const wipe = () => t.prisma.$executeRawUnsafe(`TRUNCATE TABLE "PlanPrice"`);
  before(async () => { process.env.KIOREX_PLANS_ADMIN_CLIENT_KEY = KEY; process.env.KIOREX_PLANS_ADMIN_CLIENT_SECRET = SECRET; t = await bootApp(); await wipe(); });
  after(async () => { await wipe(); await t.close(); delete process.env.KIOREX_PLANS_ADMIN_CLIENT_KEY; delete process.env.KIOREX_PLANS_ADMIN_CLIENT_SECRET; });

  it("starts empty: no price is shipped", async () => {
    const r = await call("GET", "/marketplace/v1/plans");
    assert.equal(r.status, 200); assert.deepEqual(r.body.prices, []); assert.deepEqual(r.body.editions, ["LITE", "PRO", "CHAIN"]);
  });
  it("refuses unsigned, wrongly signed and replayed requests", async () => {
    assert.equal((await t.http.get("/marketplace/v1/plans")).status, 401);
    assert.equal((await call("GET", "/marketplace/v1/plans", undefined, { secret: "x".repeat(30) })).status, 401);
    assert.equal((await call("GET", "/marketplace/v1/plans", undefined, { key: "other-key-123" })).status, 401);
    const nonce = `n-${Date.now()}`;
    assert.equal((await call("GET", "/marketplace/v1/plans", undefined, { nonce })).status, 200);
    assert.equal((await call("GET", "/marketplace/v1/plans", undefined, { nonce })).status, 401);
  });
  it("preview writes nothing and reports the organisations on that edition and market", async () => {
    const f = await seedTenant(t, { edition: "PRO", market: "EG" });
    const r = await call("POST", "/marketplace/v1/plans/prices", { ...price({ approval: undefined }), preview: true });
    assert.equal(r.status, 200); assert.equal(r.body.preview, true); assert.equal(r.body.priceVersion, 1); assert.equal(r.body.supersedes, false);
    assert.ok(r.body.impact.organisationsAffected >= 1, `fixture ${f.orgId}`);
    assert.equal(await t.prisma.planPrice.count(), 0);
  });
  it("a publish needs an approval and a different person", async () => {
    assert.equal((await call("POST", "/marketplace/v1/plans/prices", price({ approval: undefined }))).body.code, "APPROVAL_REQUIRED");
    const same = await call("POST", "/marketplace/v1/plans/prices", price({ actor: actor("maker-1") }));
    assert.equal(same.status, 403); assert.equal(same.body.code, "TWO_PERSON_RULE");
    assert.equal(await t.prisma.planPrice.count(), 0);
  });
  it("publishes version 1, is idempotent per proposal, and the new version ends the old one", async () => {
    const a = price({ amount: "100.00", approval: { proposalId: "kpp_a", proposedBy: "maker-1" }, validFrom: "2030-01-01T00:00:00Z" });
    const r1 = await call("POST", "/marketplace/v1/plans/prices", a);
    assert.equal(r1.status, 200); assert.equal(r1.body.price.priceVersion, 1); assert.equal(r1.body.price.publishedBy, "checker-1");
    const again = await call("POST", "/marketplace/v1/plans/prices", a);
    assert.equal(again.body.idempotent, true); assert.equal(again.body.price.id, r1.body.price.id);
    const b = price({ amount: "150.00", approval: { proposalId: "kpp_b", proposedBy: "maker-2" }, validFrom: "2031-01-01T00:00:00Z" });
    const prev = await call("POST", "/marketplace/v1/plans/prices", { ...b, approval: undefined, preview: true });
    assert.equal(prev.body.supersedes, true); assert.equal(prev.body.impact.from.amount, "100.00");
    const r2 = await call("POST", "/marketplace/v1/plans/prices", b);
    assert.equal(r2.body.price.priceVersion, 2);
    const rows = await t.prisma.planPrice.findMany({ orderBy: { priceVersion: "asc" } });
    assert.equal(rows[0]!.validTo?.toISOString(), "2031-01-01T00:00:00.000Z"); assert.equal(rows[1]!.validTo, null);
  });
  it("a start at or before the newest version is refused (append-only order)", async () => {
    const r = await call("POST", "/marketplace/v1/plans/prices", price({ validFrom: "2030-06-01T00:00:00Z" }));
    assert.equal(r.status, 409); assert.equal(r.body.code, "PRICE_NOT_AFTER_LATEST");
  });
  it("monthly and annual are separate segments; the list shows every version", async () => {
    const r = await call("POST", "/marketplace/v1/plans/prices", price({ interval: "ANNUAL", amount: "1000.00", validFrom: "2030-01-01T00:00:00Z" }));
    assert.equal(r.body.price.priceVersion, 1);
    const l = await call("GET", "/marketplace/v1/plans");
    assert.equal(l.body.prices.length, 3);
  });
  it("the database refuses to edit or delete a published row; only validTo of an open row may be set", async () => {
    const row = await t.prisma.planPrice.findFirstOrThrow({ where: { interval: "ANNUAL" } });
    await assert.rejects(() => t.prisma.planPrice.update({ where: { id: row.id }, data: { amount: "1.00" } }), /append-only/);
    await assert.rejects(() => t.prisma.planPrice.delete({ where: { id: row.id } }), /append-only/);
    const closed = await t.prisma.planPrice.findFirstOrThrow({ where: { priceVersion: 1, interval: "MONTHLY" } });
    await assert.rejects(() => t.prisma.planPrice.update({ where: { id: closed.id }, data: { validTo: new Date("2040-01-01") } }), /append-only/);
    await t.prisma.planPrice.update({ where: { id: row.id }, data: { validTo: new Date("2040-01-01") } });
  });
  it("without the platform credential configured the route does not exist", async () => {
    const k = process.env.KIOREX_PLANS_ADMIN_CLIENT_KEY; delete process.env.KIOREX_PLANS_ADMIN_CLIENT_KEY;
    try { assert.equal((await call("GET", "/marketplace/v1/plans")).status, 404); } finally { process.env.KIOREX_PLANS_ADMIN_CLIENT_KEY = k; }
  });
});
