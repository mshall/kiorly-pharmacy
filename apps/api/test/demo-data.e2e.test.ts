import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { PrismaClient } from "../src/generated/prisma/client";
import { markDemoRows, removeDemoData } from "../src/common/demo-data";
import { run } from "../src/seed/demo-data-remove";
import { bootApp, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

/** demo-data:remove against a real database: only the marked organisation is touched, append-only history is never forced, the real organisation is untouched, repeat is safe. */
describe("demo-data:remove (pharmacy)", () => {
  let t: TestApp, demo: Fixture, real: Fixture, prisma: PrismaClient;
  const counts = async (orgId: string) => ({
    staff: await prisma.staffUser.count({ where: { orgId } }),
    branches: await prisma.branch.count({ where: { orgId } }),
    lots: await prisma.stockLot.count({ where: { orgId } }),
    movements: await prisma.stockMovement.count({ where: { orgId } }),
    tenant: await prisma.tenant.count({ where: { id: orgId } }),
  });
  const log: string[] = [];
  before(async () => {
    t = await bootApp(); prisma = t.prisma as PrismaClient;
    demo = await seedTenant(t); real = await seedTenant(t);
    for (const f of [demo, real]) { const d = await seedDrug(t, f); await receive(t, f, { drugId: d.id, quantity: 10 }); }
    await prisma.$executeRawUnsafe(`INSERT INTO "DemoMarker" ("tableName", "rowId", "batch") VALUES ('Tenant', $1, 'e2e') ON CONFLICT DO NOTHING`, demo.orgId);
  });
  after(async () => { await prisma.$executeRawUnsafe(`DELETE FROM "DemoMarker" WHERE "batch" = 'e2e'`); await t.close(); });

  it("the dry run is a rehearsal: it reports the deletes and writes nothing", async () => {
    const before = [await counts(demo.orgId), await counts(real.orgId)];
    const rep = await run(["--dry-run"], prisma, (m) => log.push(m));
    assert.ok(rep);
    const o = rep.orgs.find((x) => x.orgId === demo.orgId)!;
    assert.ok(o && o.deleted.StaffUser === 5 && o.deleted.Branch === 2, JSON.stringify(o.deleted));
    assert.deepEqual([await counts(demo.orgId), await counts(real.orgId)], before);
    assert.match(log.join("\n"), /nothing was changed/);
  });

  it("--confirm removes the marked organisation's deletable rows, keeps append-only history and the organisation row, and never touches the real organisation", async () => {
    const realBefore = await counts(real.orgId);
    const rep = await run(["--confirm"], prisma, (m) => log.push(m));
    const o = rep!.orgs.find((x) => x.orgId === demo.orgId)!;
    const after = await counts(demo.orgId);
    assert.equal(after.staff, 0); assert.equal(after.branches, 0);
    // stock movements are append-only (database trigger): they and the lot they reference stay, and so does the organisation row
    assert.ok(after.movements > 0 && after.lots > 0 && after.tenant === 1);
    assert.ok(o.kept.some((k) => k.table === "StockMovement"), JSON.stringify(o.kept));
    assert.equal(o.organisationDeleted, false);
    assert.deepEqual(await counts(real.orgId), realBefore);
    assert.ok(await prisma.staffUser.count({ where: { orgId: real.orgId } }) === 5);
  });

  it("repeating is safe: nothing more to delete, the report still names what is kept", async () => {
    const rep = await run(["--confirm"], prisma, (m) => log.push(m));
    const o = rep!.orgs.find((x) => x.orgId === demo.orgId)!;
    assert.deepEqual(o.deleted, {});
    assert.ok(o.kept.length > 0);
  });

  it("an unmarked organisation is never selected, whatever it is called", async () => {
    const lookalike = await seedTenant(t);
    await prisma.tenant.update({ where: { id: lookalike.orgId }, data: { name: "Kiorly Demo Pharmacy", externalOrgId: `look_${lookalike.orgId}` } });
    const before = await counts(lookalike.orgId);
    await removeDemoData({ $executeRawUnsafe: (s, ...v) => prisma.$executeRawUnsafe(s, ...v), $queryRawUnsafe: (s, ...v) => prisma.$queryRawUnsafe(s, ...v) }).catch(() => undefined);
    assert.deepEqual(await counts(lookalike.orgId), before);
  });

  it("tagging registers the demo organisations by the seeds' own keys, idempotently", async () => {
    const key = "org_demo_basic";
    const existing = await prisma.tenant.findUnique({ where: { externalOrgId: key } });
    const tenant = existing ?? await prisma.tenant.create({ data: { name: "Kiorly Corner Pharmacy (DEMO, Lite)", externalOrgId: key, edition: "LITE", marketCode: "EG" } });
    const a = await markDemoRows(prisma as never, { batch: "e2e" });
    const b = await markDemoRows(prisma as never, { batch: "e2e" });
    assert.equal(b.Tenant ?? 0, 0, "second tagging adds nothing");
    assert.ok(await prisma.$queryRawUnsafe<{ n: number }[]>(`SELECT COUNT(*)::int n FROM "DemoMarker" WHERE "tableName"='Tenant' AND "rowId"=$1`, tenant.id).then((r) => r[0]!.n === 1));
    void a;
    if (!existing) { await prisma.$executeRawUnsafe(`DELETE FROM "DemoMarker" WHERE "rowId" = $1`, tenant.id); await prisma.tenant.delete({ where: { id: tenant.id } }); }
  });
});
