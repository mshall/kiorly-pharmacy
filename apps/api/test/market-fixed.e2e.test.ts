import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, seedTenant, type Fixture, type TestApp } from "./helpers";

/** Founder decision A (27 Nov 2026): a pharmacy belongs to its country for life. There is no market switch; the database refuses a change. */
describe("a pharmacy's country is fixed at creation", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); });
  after(async () => { await t.close(); });

  const signup = (marketCode?: unknown) => t.http.post("/api/v1/onboarding/signup").send({ pharmacyName: `Fixed ${Math.random()}`, ownerName: "Owner Name", email: `o${Math.random().toString(36).slice(2)}@example.com`, password: "a-strong-password-1", ...(marketCode === undefined ? {} : { marketCode }) });

  it("signup stores the country in upper case; the default is EG; malformed or hostile codes are refused", async () => {
    const ok = await signup("sa");
    assert.equal(ok.status, 201, JSON.stringify(ok.body));
    assert.equal((await t.prisma.tenant.findUniqueOrThrow({ where: { id: ok.body.tenantId } })).marketCode, "SA");
    const def = await signup();
    assert.equal((await t.prisma.tenant.findUniqueOrThrow({ where: { id: def.body.tenantId } })).marketCode, "EG");
    for (const bad of ["EGY", "E", "", "1G", "E G", "'; DROP TABLE \"Tenant\"; --", "<script>", 20, ["EG"], { a: 1 }]) {
      const r = await signup(bad);
      assert.equal(r.status, 400, `${JSON.stringify(bad)} -> ${r.status}`);
    }
  });

  it("no API changes the country: the settings update ignores or refuses a market field, and the row stays the same", async () => {
    const owner = auth(f.users.owner.token);
    for (const body of [{ marketCode: "AE" }, { market: "AE" }, { country: "AE" }]) {
      const r = await t.http.patch("/api/v1/settings").set(owner).send(body);
      assert.ok([200, 400].includes(r.status), `${JSON.stringify(body)} -> ${r.status}`);
    }
    assert.equal((await t.prisma.tenant.findUniqueOrThrow({ where: { id: f.orgId } })).marketCode, "EG");
    const s = await t.http.get("/api/v1/settings").set(owner);
    assert.equal(s.body.market, "EG");
  });

  it("the database refuses a change of the country (last line of defence), and accepts an update that leaves it alone", async () => {
    await assert.rejects(t.prisma.tenant.update({ where: { id: f.orgId }, data: { marketCode: "AE" } }), /MARKET_IMMUTABLE/);
    await assert.rejects(t.prisma.tenant.updateMany({ where: { id: f.orgId }, data: { marketCode: "" } }), /MARKET_IMMUTABLE/);
    await t.prisma.tenant.update({ where: { id: f.orgId }, data: { name: "Renamed pharmacy", marketCode: "EG" } });
    assert.equal((await t.prisma.tenant.findUniqueOrThrow({ where: { id: f.orgId } })).name, "Renamed pharmacy");
  });
});
