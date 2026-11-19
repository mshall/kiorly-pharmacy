/**
 * Kiorly Pharmacy DEMO / QA dataset (synthetic, DEV ONLY — see /TEST_DATA.md). Extends the base demo tenant "Kiorly Demo Pharmacy"
 * (org_demo_kiorly, created by `npm run seed -w api`, the tenant Kiorex's dev client is bound to) with NEW records only:
 *   ~200 extra catalogue drugs (total ~300), priced lots with a full expiry spread (valid / near-expiry / expired / quarantined / recalled),
 *   3 more suppliers, purchase orders in every state, an Rx queue (received/validating/validated/rejected), dispensed history, ~45 POS sales
 *   spread over 30 days, and Kiorex marketplace orders that mirror kx_ph_demo_* in the Kiorex demo seed.
 *
 *   npm run seed:demo -w api              idempotent
 *   npm run seed:demo -w api -- --reset   first deletes the demo-marked rows only (never the base demo data the e2e suite uses)
 * Run AFTER `npm run seed -w api`. Nothing here touches tax authorities; VAT is the market-pack configured line.
 */
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { loadEnv } from "../../src/config/env";
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/prisma/prisma.service";
import { CatalogueService, type DrugInput } from "../../src/modules/catalogue/catalogue.service";
import { PriceService } from "../../src/modules/catalogue/price.service";
import { ReceivingService } from "../../src/modules/inventory/receiving.service";
import { SuppliersService } from "../../src/modules/suppliers/suppliers.service";
import { InventoryService } from "../../src/modules/inventory/inventory.service";
import { SalesService } from "../../src/modules/pos/sales.service";
import { ShiftsService } from "../../src/modules/pos/shifts.service";
import { PrescriptionsService } from "../../src/modules/prescriptions/prescriptions.service";
import { MarketplaceService } from "../../src/modules/marketplace/marketplace.service";
import { DispensingService } from "../../src/modules/dispensing/dispensing.service";
import { marketToday } from "../../src/common/dates";
import type { AuthUser } from "../../src/auth/auth-user";

const RESET = process.argv.includes("--reset");
const DAY = 86_400_000;
let s = 20261120;
const rnd = () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

// ~100 synthetic ingredients x brands x strengths => ~200 new drugs (names are generated, not real products)
const ING: [string, string, string, string, number, boolean][] = [
  ["metoprolol", "ميتوبرولول", "tablet", "30", 62, true], ["bisoprolol", "بيسوبرولول", "tablet", "30", 85, true], ["losartan", "لوسارتان", "tablet", "30", 78, true], ["valsartan", "فالسارتان", "tablet", "28", 120, true],
  ["furosemide", "فيوروسيميد", "tablet", "20", 25, true], ["spironolactone", "سبيرونولاكتون", "tablet", "20", 58, true], ["clopidogrel", "كلوبيدوجريل", "tablet", "28", 145, true], ["rosuvastatin", "روسوفاستاتين", "tablet", "30", 160, true],
  ["glimepiride", "جليمبيريد", "tablet", "30", 55, true], ["gliclazide", "جليكلازيد", "tablet", "60", 72, true], ["sitagliptin", "سيتاجليبتين", "tablet", "28", 310, true], ["levothyroxine", "ليفوثيروكسين", "tablet", "50", 48, true],
  ["pantoprazole", "بانتوبرازول", "tablet", "14", 66, false], ["esomeprazole", "إيسوميبرازول", "capsule", "14", 90, true], ["domperidone", "دومبيريدون", "tablet", "30", 34, false], ["ondansetron", "أوندانسيترون", "tablet", "10", 52, true],
  ["levofloxacin", "ليفوفلوكساسين", "tablet", "5", 105, true], ["clarithromycin", "كلاريثروميسين", "tablet", "14", 135, true], ["doxycycline", "دوكسيسيكلين", "capsule", "10", 44, true], ["metronidazole", "ميترونيدازول", "tablet", "20", 30, true],
  ["fluconazole", "فلوكونازول", "capsule", "1", 38, true], ["acyclovir", "أسيكلوفير", "tablet", "25", 70, true], ["prednisolone", "بريدنيزولون", "tablet", "20", 36, true], ["dexamethasone", "ديكساميثازون", "injection", "5", 42, true],
  ["montelukast", "مونتيلوكاست", "tablet", "28", 125, true], ["fexofenadine", "فيكسوفينادين", "tablet", "10", 58, false], ["budesonide", "بوديزونيد", "inhaler", "1", 140, true], ["ambroxol", "أمبروكسول", "syrup", "1", 33, false],
  ["naproxen", "نابروكسين", "tablet", "20", 47, true], ["celecoxib", "سيليكوكسيب", "capsule", "20", 98, true], ["pregabalin", "بريجابالين", "capsule", "28", 190, true], ["gabapentin", "جابابنتين", "capsule", "30", 150, true],
  ["escitalopram", "إسيتالوبرام", "tablet", "28", 130, true], ["zinc sulfate", "كبريتات الزنك", "capsule", "30", 40, false], ["vitamin d3", "فيتامين د3", "capsule", "4", 65, false], ["iron + folic acid", "حديد وحمض الفوليك", "capsule", "30", 52, false],
  ["calcium + vitamin d", "كالسيوم وفيتامين د", "tablet", "30", 75, false], ["multivitamin", "مالتي فيتامين", "tablet", "30", 90, false], ["omega-3", "أوميجا 3", "capsule", "30", 120, false], ["povidone iodine", "بوفيدون أيودين", "solution", "1", 28, false],
  ["chlorhexidine mouthwash", "غسول كلورهيكسيدين", "solution", "1", 45, false], ["hyoscine butylbromide", "هيوسين", "tablet", "20", 31, false], ["lactulose", "لاكتولوز", "syrup", "1", 60, false], ["oral contraceptive", "حبوب منع الحمل", "tablet", "21", 55, true],
  ["tamsulosin", "تامسولوسين", "capsule", "30", 115, true], ["ranitidine-free antacid", "مضاد حموضة", "tablet", "24", 22, false], ["saline nasal spray", "بخاخ ملحي", "spray", "1", 26, false], ["xylometazoline", "زيلوميتازولين", "spray", "1", 30, false],
  ["clotrimazole", "كلوتريمازول", "cream", "1", 35, false], ["fusidic acid", "حمض الفيوسيديك", "cream", "1", 58, true], ["betamethasone", "بيتاميثازون", "cream", "1", 46, true], ["lidocaine gel", "ليدوكايين جل", "gel", "1", 40, false],
  ["ceftriaxone", "سيفترياكسون", "injection", "1", 55, true], ["enoxaparin", "إينوكسابارين", "injection", "2", 280, true],
];
const STR = ["5 mg", "10 mg", "20 mg", "40 mg", "100 mg", "250 mg", "500 mg"];
const BR = ["Zora", "Medix", "Nilo", "Cura", "Pharmo", "Vita"];

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Refusing to seed demo data in production");
  loadEnv();
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ["error"] });
  const started = new Date();
  try {
    const prisma = app.get(PrismaService);
    const tenant = await prisma.tenant.findUnique({ where: { externalOrgId: "org_demo_kiorly" } });
    if (!tenant) throw new Error("base demo tenant missing: run `npm run seed -w api` first");
    const org = tenant.id;
    const owner = await prisma.staffUser.findUniqueOrThrow({ where: { email: "owner@demo.kiorly.local" } });
    const pharmacist = await prisma.staffUser.findUniqueOrThrow({ where: { email: "pharmacist@demo.kiorly.local" } });
    const cashier = await prisma.staffUser.findUniqueOrThrow({ where: { email: "cashier@demo.kiorly.local" } });
    const b1 = await prisma.branch.findFirstOrThrow({ where: { orgId: org, code: "MAIN" } });
    const b2 = await prisma.branch.findFirstOrThrow({ where: { orgId: org, code: "NASR" } });
    const au = (u: any): AuthUser => ({ userId: u.id, orgId: org, role: u.role, displayName: u.displayName, branchId: u.branchId ?? null, market: "EG", edition: "CHAIN", pharmacistLicenceNo: u.pharmacistLicenceNo ?? null, mfa: false } as any);
    const ownerU = au(owner), pharmU = au(pharmacist), cashierU = au(cashier);

    if (RESET) await reset(prisma, org);

    // 1) extra catalogue (global, idempotent by sourceKey) ----------------------------------------------------------
    const catalogue = app.get(CatalogueService); const prices = app.get(PriceService);
    const records: DrugInput[] = []; const priceBy = new Map<string, number>(); let n = 5000;
    for (const [ing, ar, form, pack, price, rx] of ING) {
      const k = 3 + (n % 2);
      for (let i = 0; i < k; i++) {
        n++; const strength = STR[(n + i) % STR.length]; const brand = `${BR[(n + i) % BR.length]}${ing.split(" ")[0].slice(0, 4)}`;
        records.push({ sourceKey: `demo-eg:${n}`, brandName: `${brand[0].toUpperCase()}${brand.slice(1)} ${strength.replace(/\s/g, "")}`, brandNameAr: `${ar} ${i + 1}`, activeIngredient: ing, strength, dosageForm: form, packSize: pack, gtin: `622${String(n).padStart(10, "0")}${n % 10}`, rxOnly: rx, controlledSchedule: "NONE" } as DrugInput);
        priceBy.set(`demo-eg:${n}`, Math.round(price * (1 + i * 0.12) * 100) / 100);
      }
    }
    const imp = await catalogue.importDrugs(null, records.slice(0, 215));
    const drugs = await prisma.drug.findMany({ where: { sourceKey: { startsWith: "demo-eg:" } }, orderBy: { sourceKey: "asc" } });
    const priced = new Set((await prisma.priceBookEntry.findMany({ where: { drugId: { in: drugs.map((d) => d.id) } }, select: { drugId: true } })).map((p) => p.drugId));
    const unpriced = drugs.filter((d) => !priced.has(d.id));
    if (unpriced.length) await prices.bulkUpdate(org, owner.id, new Date("2026-01-01"), unpriced.map((d) => ({ drugId: d.id, price: String(priceBy.get(d.sourceKey!) ?? 50) })));

    // 2) suppliers, lots, special lots ---------------------------------------------------------------------------------
    const suppliers = app.get(SuppliersService); const receiving = app.get(ReceivingService); const inv = app.get(InventoryService);
    const supNames = ["Giza Wholesale Pharma (DEMO)", "Alex Health Distribution (DEMO)", "Upper Egypt Medical Supplies (DEMO)"];
    const have = await prisma.supplier.findMany({ where: { orgId: org, name: { in: supNames } } });
    const sups = [...have];
    for (const [i, name] of supNames.entries()) if (!have.find((h) => h.name === name)) sups.push(await suppliers.create(org, { name, phone: `+2010000${String(4100 + i)}`, email: `orders${i}@demo.kiorex.test`, paymentTerms: ["30 days", "45 days", "cash"][i], creditLimit: String(100000 + i * 50000) }));
    const today = marketToday(); const iso = (d: number) => new Date(today.getTime() + d * DAY).toISOString().slice(0, 10);
    const exps = [700, 500, 330, 190, 95, 40, 12];
    const hasLots = await prisma.stockLot.count({ where: { orgId: org, lotNumber: { startsWith: "DM" } } });
    let lotNo = 1;
    if (!hasLots) {
      for (const [idx, d] of drugs.entries()) {
        const lines = [0, 1, 2].slice(0, 1 + (idx % 3)).map((k) => ({ drugId: d.id, lotNumber: `DM${String(lotNo++).padStart(5, "0")}`, expiryDate: iso(exps[(idx + k * 2) % exps.length]), quantity: 6 + Math.floor(rnd() * 60), unitCost: String(((priceBy.get(d.sourceKey!) ?? 50) * 0.7).toFixed(2)) }));
        await receiving.receive(ownerU, { branchId: idx % 5 === 0 ? b2.id : b1.id, supplierId: sups[idx % 3].id, invoiceNo: `DEMO-INV-${2000 + idx}`, lines } as any);
      }
      // expired / quarantined / recalled lots (direct rows for expired + recalled, service for quarantine)
      const dd = drugs.slice(0, 12);
      for (const [i, d] of dd.slice(0, 3).entries()) {
        const lot = await prisma.stockLot.create({ data: { orgId: org, branchId: b1.id, drugId: d.id, lotNumber: `DMEXP${i}`, expiryDate: new Date(today.getTime() - (4 + i * 9) * DAY), unitCost: 20, status: "EXPIRED", qtyOnHand: 5 + i * 3, blockedReason: "Expired (demo)", blockedAt: new Date() } });
        await prisma.stockMovement.create({ data: { orgId: org, branchId: b1.id, lotId: lot.id, type: "RECEIPT", qtyDelta: 5 + i * 3, performedBy: owner.id, reason: "Demo: expired stock awaiting write-off" } });
      }
      for (const d of dd.slice(3, 5)) { const lot = await prisma.stockLot.findFirst({ where: { orgId: org, drugId: d.id, lotNumber: { startsWith: "DM" }, status: { in: ["AVAILABLE", "RECEIVED"] } } }); if (lot) await inv.quarantine(ownerU, lot.id, "Suspected temperature excursion in transit (demo)").catch((e) => console.warn("quarantine:", e.message)); }
      const rd = dd[6]; const rlot = await prisma.stockLot.findFirst({ where: { orgId: org, drugId: rd.id, lotNumber: { startsWith: "DM" } } });
      if (rlot) {
        const notice = await prisma.recallNotice.create({ data: { orgId: org, drugId: rd.id, lotNumbers: [rlot.lotNumber], affectedLots: 1, reason: "Supplier recall: labelling error (DEMO notice)", source: "DEMO-RECALL-001", enteredBy: owner.id } });
        await prisma.stockLot.update({ where: { id: rlot.id }, data: { status: "RECALLED", statusBeforeBlock: rlot.status, blockedReason: "Recalled (DEMO-RECALL-001)", blockedAt: new Date(), recallNoticeId: notice.id } });
      }
    }
    await inv.runExpiryAlerts(org).catch(() => {});

    // 3) purchase orders in every state ----------------------------------------------------------------------------------
    if (!(await prisma.purchaseOrder.count({ where: { orgId: org, notes: { startsWith: "DEMO" } } }))) {
      const mk = (supI: number, from: number, k: number) => ({ branchId: b1.id, supplierId: sups[supI].id, notes: `DEMO PO ${from}`, lines: drugs.slice(from, from + k).map((d) => ({ drugId: d.id, qtyOrdered: 20 + k * 3, unitCost: ((priceBy.get(d.sourceKey!) ?? 50) * 0.7).toFixed(2) })) });
      await suppliers.createPo(pharmU, mk(0, 20, 4) as any);                                  // DRAFT
      const sent = await suppliers.createPo(pharmU, mk(1, 30, 5) as any); await suppliers.sendPo(pharmU, sent.id, "WHATSAPP").catch(() => {});
      const recv = await suppliers.createPo(ownerU, mk(2, 40, 3) as any); await suppliers.sendPo(ownerU, recv.id, "EMAIL").catch(() => {});
      const full = await suppliers.getPo(org, recv.id);
      await receiving.receive(ownerU, { branchId: b1.id, supplierId: sups[2].id, purchaseOrderId: recv.id, invoiceNo: "DEMO-PO-RECV", lines: full.lines.map((l: any, i: number) => ({ drugId: l.drugId, lotNumber: `DMPO${i}`, expiryDate: iso(400), quantity: l.qtyOrdered, unitCost: String(l.unitCost) })) } as any).catch((e) => console.warn("po receive:", e.message));
      const part = await suppliers.createPo(ownerU, mk(0, 50, 4) as any); await suppliers.sendPo(ownerU, part.id, "EMAIL").catch(() => {});
      const pf = await suppliers.getPo(org, part.id);
      await receiving.receive(ownerU, { branchId: b1.id, supplierId: sups[0].id, purchaseOrderId: part.id, invoiceNo: "DEMO-PO-PART", lines: pf.lines.slice(0, 2).map((l: any, i: number) => ({ drugId: l.drugId, lotNumber: `DMPP${i}`, expiryDate: iso(380), quantity: Math.floor(l.qtyOrdered / 2), unitCost: String(l.unitCost) })) } as any).catch((e) => console.warn("po partial:", e.message));
      const canc = await suppliers.createPo(pharmU, mk(1, 60, 2) as any); await suppliers.cancelPo(pharmU, canc.id).catch(() => {});
    }

    // 4) POS sales spread over 30 days ---------------------------------------------------------------------------------------
    const shifts = app.get(ShiftsService); const sales = app.get(SalesService);
    if (!(await prisma.sale.count({ where: { orgId: org, idempotencyKey: { startsWith: "demo-sale-" } } } as any))) {
      const shift = (await prisma.shift.findFirst({ where: { orgId: org, branchId: b1.id, closedAt: null } as any })) ?? (await shifts.open(cashierU, b1.id, "300.00"));
      const otc = drugs.filter((d) => !d.rxOnly && d.controlledSchedule === "NONE" && !d.coldChain);
      for (let i = 0; i < 45; i++) {
        const d = otc[i % otc.length]!; const cart = [{ drugId: d.id, quantity: 1 + (i % 3) }, ...(i % 4 === 0 ? [{ drugId: otc[(i + 7) % otc.length]!.id, quantity: 1 }] : [])];
        try {
          const total = sales.totals(await sales.priceCart(prisma, cashierU, b1.id, cart, new Date(), false)).total.toFixed(2);
          const r = await sales.checkout(cashierU, { branchId: b1.id, shiftId: shift.id, idempotencyKey: `demo-sale-${i}`, lines: cart, payments: [{ method: i % 3 === 0 ? "CARD" : "CASH", amount: total }] } as any);
          await prisma.sale.update({ where: { id: r.sale!.id }, data: { soldAt: new Date(i < 8 ? Date.now() - (i + 1) * 15 * 60_000 : Date.now() - ((i % 29) + 1) * DAY - i * 600_000) } });
        } catch (e: any) { if (i < 3) console.warn("sale:", e.message); }
      }
    }

    // 5) Rx queue + dispensed history ----------------------------------------------------------------------------------------
    const rxSvc = app.get(PrescriptionsService); const disp = app.get(DispensingService);
    if (!(await prisma.patientRef.count({ where: { orgId: org, displayName: { contains: "(DEMO)" } } }))) {
      const stocked = new Set((await prisma.stockLot.findMany({ where: { orgId: org, branchId: b1.id, status: { in: ["AVAILABLE", "RECEIVED"] }, qtyOnHand: { gte: 12 } }, select: { drugId: true } })).map((l) => l.drugId));
      const rxDrugs = drugs.filter((d) => d.rxOnly && d.controlledSchedule === "NONE" && !d.coldChain && stocked.has(d.id));
      const people: [string, string][] = [["Hoda Mahmoud (DEMO)", "+201000001001"], ["Mahmoud El-Sayed (DEMO)", "+201000001005"], ["Nourhan Fathy (DEMO)", "+201000001004"], ["Omar Hegazy (DEMO)", "+201000001007"], ["Tarek Zaki (DEMO)", "+201000001009"], ["Heba Salah (DEMO)", "+201000001010"], ["Rana Khaled (DEMO)", "+201000001012"], ["Dalia Ibrahim (DEMO)", "+201000001008"]];
      for (const [i, [name, ph]] of people.entries()) {
        const d = rxDrugs[(i * 5) % rxDrugs.length]!; const d2 = rxDrugs[(i * 5 + 2) % rxDrugs.length]!;
        const rx = await rxSvc.intakePaper(pharmU, { branchId: b1.id, patient: { displayName: name, phone: ph, allergies: i % 3 === 0 ? ["penicillin"] : [] }, prescriberName: "Dr Tamer Shawky (DEMO)", prescriberLicenceNo: `SYN-MD-${100 + i}`, issuedAt: new Date(Date.now() - (i % 6) * DAY).toISOString(), lines: [{ drugId: d.id, quantity: 1, directions: "1 tab daily after food" }, ...(i < 4 ? [{ drugId: d2.id, quantity: 2, directions: "1 tab twice daily" }] : [])] } as any);
        if (i === 0 || i === 1) continue; // RECEIVED
        if (i === 2) { await rxSvc.reject(pharmU, rx.id, "Prescriber licence number could not be verified (demo)"); continue; }
        const v = await rxSvc.validate(pharmU, rx.id); if (i === 3 || !v.validated) continue; // VALIDATED
        if (i >= 4) { // dispense (history)
          try {
            const full = await rxSvc.get(org, rx.id);
            const dsp = await disp.create(pharmU, { branchId: b1.id, prescriptionId: rx.id, items: full.lines.map((l: any) => ({ prescriptionLineId: l.id, drugId: l.drugId, quantity: l.quantity })) });
            await disp.signOff(pharmU, dsp.id, "Counselled on dose and timing (demo)");
            await disp.complete(pharmU, dsp.id, { idempotencyKey: `demo-disp-${i}`, prepaid: true } as any).catch((e: any) => console.warn("dispense complete:", e.message));
          } catch (e: any) { console.warn("dispense:", e.message); }
        }
      }
    }

    // 6) Kiorex marketplace orders (mirror the Kiorex demo seed ids kx_ph_demo_N) ----------------------------------------------
    const market = app.get(MarketplaceService);
    const cat = (await market.catalogue(org, {})) as any; const items: any[] = ((cat.items ?? cat) as any[]).filter((i) => !String(i.name).startsWith("E2E") && !i.rxRequired).slice(0, 12);
    const plan: [number, string][] = [[3, "RECEIVED"], [4, "READY"], [5, "DISPENSED"], [6, "DISPENSED"], [7, "REJECTED"]];
    for (const [i, st] of plan) {
      const x = [items[(i - 1) % items.length], items[(i + 2) % items.length]]; if (!x[0]) continue;
      try {
        const lines = await Promise.all(x.map(async (it, k) => ({ sku: it.sku ?? it.drugId, quantity: 1 + ((i - 1) % 2), unitPrice: ((it.priceMinor ?? 0) / 100).toFixed(2) })));
        const r = await market.ingest(org, { orderId: `kx_ph_demo_${i}`, branchId: b1.id, patientRef: `01HZKXD${String(1000 + i).padStart(19, "0")}`, customer: { name: `Kiorex patient ${1000 + i}`, phone: `+20100000${1000 + i}`, address: "12 Demo Street, Cairo" }, prepaid: true, delivery: { method: i % 2 ? "DELIVERY" : "PICKUP" }, prescription: { patientRef: `01HZKXD${String(1000 + i).padStart(19, "0")}`, prescriberName: "Dr Tamer Shawky (DEMO)", prescriberLicenceNo: "SYN-MD-100", issuedAt: new Date().toISOString(), scanRef: `demo-scan-${i}` }, lines } as any);
        const cur = async () => (await prisma.kiorexOrder.findUniqueOrThrow({ where: { id: r.order.id } })).status as string;
        if (st === "RECEIVED" || (await cur()) === "DISPENSED" || (st === "REJECTED" && (await cur()) !== "RECEIVED")) continue;
        const rxId = (r.order as any).prescriptionId; if (rxId && st !== "REJECTED") await rxSvc.validate(pharmU, rxId).catch((e: any) => console.warn("order rx validate:", e.message));
        if (st === "REJECTED") { await market.reject(pharmU, r.order.id, "Prescription could not be validated (DEMO)", "RX_INVALID"); continue; }
        if ((await cur()) === "RECEIVED") await market.accept(pharmU, r.order.id);
        const dsp = await prisma.dispensing.findFirst({ where: { kiorexOrderRef: r.order.id } as any });
        if (dsp && dsp.status !== "SIGNED_OFF" && dsp.status !== "DISPENSED") await disp.signOff(pharmU, dsp.id, "Counselled (demo)");
        if ((await cur()) === "ACCEPTED") await market.markReady(pharmU, r.order.id);
        if (st === "DISPENSED" && dsp) await disp.complete(pharmU, dsp.id, { idempotencyKey: `demo-kx-disp-${i}`, prepaid: true } as any).catch((e: any) => console.warn("order dispense:", e.message));
      } catch (e: any) { console.warn(`kiorex order ${i}:`, e.message); }
    }

    // never let a running pharmacy API push these demo events to Kiorex (the Kiorex demo seed already holds the matching state)
    const q = await prisma.$executeRawUnsafe(`UPDATE "OutboxEvent" SET status='SENT', "sentAt"=now() WHERE "orgId"='${org}' AND status<>'SENT' AND "occurredAt" >= $1`, started).catch(() => 0);
    const counts = { drugs: await prisma.drug.count(), lots: await prisma.stockLot.count({ where: { orgId: org } }), suppliers: await prisma.supplier.count({ where: { orgId: org } }), pos: await prisma.purchaseOrder.count({ where: { orgId: org } }), sales: await prisma.sale.count({ where: { orgId: org } }), rx: await prisma.prescription.count({ where: { orgId: org } }), kiorexOrders: await prisma.kiorexOrder.count({ where: { orgId: org } }) };
    console.log(`Pharmacy demo seed OK — imported ${imp.created} new drugs; totals ${JSON.stringify(counts)} (muted ${q} outbox events). Logins: *@demo.kiorly.local / Demo@12345 (DEV ONLY)`);
  } finally { await app.close(); }
}

async function reset(prisma: PrismaService, org: string) {
  // best-effort FK-ordered removal of demo-marked rows only (lots DM*, drugs demo-eg:*, suppliers *(DEMO), POs 'DEMO*', sales demo-sale-*, patients *(DEMO), kx_ph_demo_*)
  const sql = [
    `DELETE FROM "SalePayment" WHERE "saleId" IN (SELECT id FROM "Sale" WHERE "orgId"='${org}' AND "idempotencyKey" LIKE 'demo-sale-%')`,
    `DELETE FROM "SaleLine" WHERE "saleId" IN (SELECT id FROM "Sale" WHERE "orgId"='${org}' AND "idempotencyKey" LIKE 'demo-sale-%')`,
    `DELETE FROM "Sale" WHERE "orgId"='${org}' AND "idempotencyKey" LIKE 'demo-sale-%'`,
    `DELETE FROM "DispensingLine" WHERE "dispensingId" IN (SELECT id FROM "Dispensing" WHERE "prescriptionId" IN (SELECT id FROM "Prescription" WHERE "patientId" IN (SELECT id FROM "PatientRef" WHERE "orgId"='${org}' AND "displayName" LIKE '%(DEMO)')))`,
    `DELETE FROM "Dispensing" WHERE "prescriptionId" IN (SELECT id FROM "Prescription" WHERE "patientId" IN (SELECT id FROM "PatientRef" WHERE "orgId"='${org}' AND "displayName" LIKE '%(DEMO)'))`,
    `DELETE FROM "PrescriptionLine" WHERE "prescriptionId" IN (SELECT id FROM "Prescription" WHERE "patientId" IN (SELECT id FROM "PatientRef" WHERE "orgId"='${org}' AND "displayName" LIKE '%(DEMO)'))`,
    `DELETE FROM "Prescription" WHERE "patientId" IN (SELECT id FROM "PatientRef" WHERE "orgId"='${org}' AND "displayName" LIKE '%(DEMO)')`,
    `DELETE FROM "PatientRef" WHERE "orgId"='${org}' AND "displayName" LIKE '%(DEMO)'`,
    `DELETE FROM "KiorexOrderLine" WHERE "orderId" IN (SELECT id FROM "KiorexOrder" WHERE "orgId"='${org}' AND "externalOrderId" LIKE 'kx_ph_demo_%')`,
    `DELETE FROM "KiorexOrder" WHERE "orgId"='${org}' AND "externalOrderId" LIKE 'kx_ph_demo_%'`,
    `DELETE FROM "ExpiryAlert" WHERE "lotId" IN (SELECT id FROM "StockLot" WHERE "orgId"='${org}' AND "lotNumber" LIKE 'DM%')`,
    `DELETE FROM "StockMovement" WHERE "lotId" IN (SELECT id FROM "StockLot" WHERE "orgId"='${org}' AND "lotNumber" LIKE 'DM%')`,
    `DELETE FROM "GoodsReceiptLine" WHERE "lotId" IN (SELECT id FROM "StockLot" WHERE "orgId"='${org}' AND "lotNumber" LIKE 'DM%')`,
    `DELETE FROM "StockLot" WHERE "orgId"='${org}' AND "lotNumber" LIKE 'DM%'`,
    `DELETE FROM "RecallNotice" WHERE "orgId"='${org}' AND source LIKE 'DEMO-%'`,
    `DELETE FROM "PurchaseOrderLine" WHERE "purchaseOrderId" IN (SELECT id FROM "PurchaseOrder" WHERE "orgId"='${org}' AND notes LIKE 'DEMO%')`,
    `DELETE FROM "PurchaseOrder" WHERE "orgId"='${org}' AND notes LIKE 'DEMO%'`,
    // global drugs + price-book history are retained by DB rules (immutable); they are re-used on the next run
  ];
  let failed = 0;
  for (let pass = 0; pass < 2; pass++) { failed = 0; for (const q of sql) { try { await prisma.$executeRawUnsafe(q); } catch { failed++; } } if (!failed) break; }
  console.log(`pharmacy demo reset done (${failed} statements could not be applied; those rows remain)`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
