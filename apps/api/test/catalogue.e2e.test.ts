import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, isoDate, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";
import { projectDrugForKiorex } from "../src/modules/catalogue/kiorex-projection";

describe("catalogue (KPCAT01-04)", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); });
  after(async () => { await t.close(); });
  const owner = () => auth(f.users.owner.token);

  it("KPCAT01 import is idempotent: re-import after a source update never duplicates, maps ingredient/strength/form/pack/GTIN/price", async () => {
    const rec = (price: string, strength = "500 mg") => ({ sourceKey: "egdb:900001", brandName: "Augmentin 1g", brandNameAr: "اوجمنتين ١ جم", activeIngredient: "Amoxicillin + Clavulanic acid", strength, dosageForm: "tablet", packSize: "14", gtin: "6221234500011", manufacturer: "GSK", price });
    const a = await t.http.post("/api/v1/catalogue/import").set(owner()).send({ drugs: [rec("150.00")] });
    assert.deepEqual(a.body, { created: 1, updated: 0 });
    const b = await t.http.post("/api/v1/catalogue/import").set(owner()).send({ drugs: [rec("160.00", "1000 mg")] });
    assert.deepEqual(b.body, { created: 0, updated: 1 });
    assert.equal(await t.prisma.drug.count({ where: { sourceKey: `${f.orgId}:egdb:900001` } }), 1);
    const d = await t.prisma.drug.findUniqueOrThrow({ where: { sourceKey: `${f.orgId}:egdb:900001` } });
    assert.equal(d.strength, "1000 mg");
    assert.equal(d.gtin, "6221234500011");
    assert.equal(d.otc, true);
    const search = await t.http.get("/api/v1/catalogue/drugs?q=6221234500011").set(owner());
    assert.equal(search.body.items[0].id, d.id, "barcode search");
    const byIng = await t.http.get("/api/v1/catalogue/drugs?q=clavulanic").set(owner());
    assert.ok(byIng.body.items.some((x: { id: string }) => x.id === d.id));
    const byAr = await t.http.get(`/api/v1/catalogue/drugs?q=${encodeURIComponent("اوجمنتين")}`).set(owner());
    assert.ok(byAr.body.items.some((x: { id: string }) => x.id === d.id), "Arabic brand name search");
  });

  it("KPCAT02 regulatory flags are stored, filterable and consistent; controlled drugs are excluded from every Kiorex projection", async () => {
    const ctrl = await seedDrug(t, f, { brandName: "CtrlX", controlledSchedule: "SCHEDULE_2" });
    const cold = await seedDrug(t, f, { brandName: "ColdX", coldChain: true });
    const otc = await seedDrug(t, f, { brandName: "OtcX" });
    const c = await t.prisma.drug.findUniqueOrThrow({ where: { id: ctrl.id } });
    assert.equal(c.rxOnly, true, "controlled implies Rx-only");
    assert.equal(c.otc, false);
    assert.equal((await t.http.get("/api/v1/catalogue/drugs?controlled=true").set(owner())).body.items.every((d: { controlledSchedule: string }) => d.controlledSchedule !== "NONE"), true);
    assert.equal((await t.http.get("/api/v1/catalogue/drugs?coldChain=true").set(owner())).body.items.some((d: { id: string }) => d.id === cold.id), true);
    assert.equal((await t.http.get("/api/v1/catalogue/drugs?otc=true&q=OtcX").set(owner())).body.items.some((d: { id: string }) => d.id === otc.id), true);
    const all = await t.prisma.drug.findMany({ where: { orgId: f.orgId } });
    const projected = all.map(projectDrugForKiorex).filter(Boolean);
    assert.ok(projected.length > 0);
    assert.equal(projected.some((p) => p!.sku === ctrl.id), false);
    const r = await t.http.patch(`/api/v1/catalogue/drugs/${otc.id}`).set(owner()).send({ controlledSchedule: "SCHEDULE_4" });
    assert.equal(r.body.rxOnly, true);
    assert.equal(r.body.otc, false);
  });

  it("KPCAT03 price book: append/close only, past price resolvable, DB forbids history edits", async () => {
    const drug = await seedDrug(t, f, { price: "10.00" });
    const now = Date.now();
    const t1 = new Date(now + 1_000).toISOString();
    const u1 = await t.http.post("/api/v1/catalogue/prices/bulk").set(owner()).send({ effectiveFrom: t1, items: [{ drugId: drug.id, price: "12.00" }] });
    assert.equal(u1.body.updated, 1);
    const t2 = new Date(now + 5 * 86_400_000).toISOString();
    await t.http.post("/api/v1/catalogue/prices/bulk").set(owner()).send({ effectiveFrom: t2, items: [{ drugId: drug.id, price: "15.00" }] });
    const conflict = await t.http.post("/api/v1/catalogue/prices/bulk").set(owner()).send({ effectiveFrom: new Date(now + 2 * 86_400_000).toISOString(), items: [{ drugId: drug.id, price: "99.00" }] });
    assert.equal(conflict.body.code, "PRICE_CONFLICT", "cannot rewrite before a scheduled price");
    const at = (iso: string) => t.http.get(`/api/v1/catalogue/prices/${drug.id}/at?date=${encodeURIComponent(iso)}&branchId=${f.branchId}`).set(owner()).then((r) => r.body.price);
    assert.equal(await at(new Date(now - 86_400_000).toISOString()), "10.00");
    assert.equal(await at(new Date(now + 86_400_000).toISOString()), "12.00");
    assert.equal(await at(new Date(now + 6 * 86_400_000).toISOString()), "15.00");
    const hist = await t.prisma.priceBookEntry.findMany({ where: { drugId: drug.id, orgId: f.orgId }, orderBy: { effectiveFrom: "asc" } });
    assert.equal(hist.length, 3);
    assert.ok(hist[0]!.effectiveTo && hist[1]!.effectiveTo && !hist[2]!.effectiveTo);
    await assert.rejects(t.prisma.priceBookEntry.update({ where: { id: hist[0]!.id }, data: { price: 1 } }), /history is retained/);
    await assert.rejects(t.prisma.priceBookEntry.delete({ where: { id: hist[1]!.id } }), /history is retained/);
    // branch override beats the central price
    await t.http.post("/api/v1/catalogue/prices/bulk").set(owner()).send({ effectiveFrom: new Date(now + 2_000).toISOString(), items: [{ drugId: drug.id, price: "11.00", branchId: f.branchId }] });
    assert.equal(await at(new Date(now + 86_400_000).toISOString()), "11.00");
  });

  it("KPCAT03 shelf labels render AR/EN (RTL) with price and barcode", async () => {
    const drug = await seedDrug(t, f, { brandName: "LabelMe", gtin: "6229999000011", price: "33.50" });
    const ar = await t.http.get(`/api/v1/catalogue/labels/print?drugIds=${drug.id}&lang=ar&branchId=${f.branchId}`).set(owner());
    assert.match(ar.text, /dir="rtl"/);
    assert.match(ar.text, /33\.50/);
    assert.match(ar.text, /6229999000011/);
    const en = await t.http.get(`/api/v1/catalogue/labels/print?drugIds=${drug.id}&lang=en&branchId=${f.branchId}`).set(owner());
    assert.match(en.text, /dir="ltr"/);
    assert.match(en.text, /LabelMe/);
  });

  it("KPCAT04 a drug belongs to exactly one group (ingredient+strength+form, normalised)", async () => {
    const a = await seedDrug(t, f, { activeIngredient: "Ibuprofen", strength: "400mg", dosageForm: "Tablets" });
    const b = await seedDrug(t, f, { activeIngredient: "ibuprofen", strength: "400 mg", dosageForm: "tablet" });
    const c = await seedDrug(t, f, { activeIngredient: "ibuprofen", strength: "600 mg", dosageForm: "tablet" });
    const [da, db, dc] = await Promise.all([a, b, c].map((x) => t.prisma.drug.findUniqueOrThrow({ where: { id: x.id } })));
    assert.equal(da!.substitutionGroupId, db!.substitutionGroupId);
    assert.notEqual(da!.substitutionGroupId, dc!.substitutionGroupId);
    const groups = await t.prisma.substitutionGroup.findMany({ where: { id: { in: [da!.substitutionGroupId!, dc!.substitutionGroupId!] } } });
    assert.equal(groups.length, 2);
    void isoDate;
  });

  it("KPCAT01 search over a 50k-row catalogue answers under 300 ms (trigram indexes)", async () => {
    const tag = `perf${Date.now()}`;
    await t.prisma.$executeRawUnsafe(`INSERT INTO "Drug" (id, "orgId", "brandName", "activeIngredient", strength, "dosageForm", "packSize", gtin, "sourceKey", "rxOnly", "controlledSchedule", "coldChain", otc, active)
      SELECT 'perf_${tag}_' || g, '${f.orgId}', 'Perfbrand ' || g || ' ' || (ARRAY['alpha','beta','gamma','delta','omega'])[1 + g % 5], (ARRAY['amoxicillin','paracetamol','ibuprofen','omeprazole','metformin','cefixime','warfarin'])[1 + g % 7] || ' ' || (g % 13), (10 * (1 + g % 50)) || ' mg', 'tablet', '10', '62' || lpad(g::text, 11, '0'), '${tag}:' || g, false, 'NONE', false, true, true
      FROM generate_series(1, 50000) g`);
    await t.prisma.$executeRawUnsafe(`ANALYZE "Drug"`);
    try {
      const queries = ["perfbrand 4999", "metformin", "ome", "6200000012345", "gamma"];
      const times: number[] = [];
      for (const q of queries) {
        for (let i = 0; i < 3; i++) {
          const s = performance.now();
          const r = await t.http.get(`/api/v1/catalogue/drugs?q=${encodeURIComponent(q)}`).set(owner());
          times.push(performance.now() - s);
          assert.equal(r.status, 200);
          assert.ok(r.body.total >= 0);
        }
      }
      times.sort((a, b) => a - b);
      const p95 = times[Math.floor(times.length * 0.95) - 1]!;
      assert.ok(p95 < 300, `p95 ${p95.toFixed(0)} ms must be < 300 ms (all: ${times.map((x) => x.toFixed(0)).join(",")})`);
    } finally {
      await t.prisma.$executeRawUnsafe(`DELETE FROM "Drug" WHERE "sourceKey" LIKE '${tag}:%'`);
    }
  });
});
