/**
 * Kiorly Pharmacy standalone-suite DEMO dataset (synthetic, DEV ONLY — see /TEST_DATA.md). Run AFTER `npm run seed` and `npm run seed:demo`:
 *
 *   npm run seed:suite -w api            idempotent (skips a tenant that already carries the suite marker)
 *
 * Enriches the base demo tenant "Kiorly Demo Pharmacy" (INTEGRATED, 2 branches) with: customers (families, allergies, credit, loyalty), a prescriber directory,
 * prescriptions in EVERY state, safety-check findings, a controlled register with witnessed adjustments and discrepancies, promotions + coupons, ~150 sales over
 * 30 days, held carts, returns / exchanges, cash drawer movements, expenses, RFQs, supplier aging, cost variance, insurer claims, locations, pack units, categories.
 * It also creates a second, STANDALONE tenant "Kiorly Solo Pharmacy (DEMO)" with no Kiorly / Kiorex integration at all.
 * No tax-authority anything: VAT is the configured display line only.
 */
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { loadEnv } from "../../src/config/env";
import { assertDemoSeedAllowed } from "../../src/common/demo-seed-guard";
import { tagDemoRows } from "../../src/common/demo-data-tag";
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/prisma/prisma.service";
import { hashPassword } from "../../src/auth/password";
import { marketToday } from "../../src/common/dates";
import type { AuthUser } from "../../src/auth/auth-user";
import { CustomerRegistryService } from "../../src/modules/customers/customer-registry.service";
import { PrescriptionsService } from "../../src/modules/prescriptions/prescriptions.service";
import { PrescribersService } from "../../src/modules/prescriptions/prescribers.service";
import { RefillsService } from "../../src/modules/prescriptions/refills.service";
import { RxTransfersService } from "../../src/modules/prescriptions/transfers.service";
import { DispensingService } from "../../src/modules/dispensing/dispensing.service";
import { SalesService } from "../../src/modules/pos/sales.service";
import { ShiftsService } from "../../src/modules/pos/shifts.service";
import { PromotionsService } from "../../src/modules/pos/promotions.service";
import { HeldCartsService } from "../../src/modules/pos/held-carts.service";
import { CashService } from "../../src/modules/pos/cash.service";
import { PosService } from "../../src/modules/pos/pos.service";
import { LocationsService } from "../../src/modules/inventory/locations.service";
import { UomService } from "../../src/modules/inventory/uom.service";
import { ReceivingService } from "../../src/modules/inventory/receiving.service";
import { InventoryService } from "../../src/modules/inventory/inventory.service";
import { InventoryAnalyticsService } from "../../src/modules/inventory/inventory-analytics.service";
import { ControlledService } from "../../src/modules/controlled/controlled.service";
import { FinanceService } from "../../src/modules/finance/finance.service";
import { RfqService } from "../../src/modules/purchasing/rfq.service";
import { SuppliersService } from "../../src/modules/suppliers/suppliers.service";
import { ClaimsService } from "../../src/modules/claims/claims.module";
import { AlertsService } from "../../src/modules/admin/alerts.service";
import { PriceService } from "../../src/modules/catalogue/price.service";
import { CatalogueService } from "../../src/modules/catalogue/catalogue.service";
import { ApprovalService } from "../../src/auth/approval.service";

const DAY = 86_400_000;
let seedN = 20261121;
const rnd = () => { seedN |= 0; seedN = (seedN + 0x6d2b79f5) | 0; let t = Math.imul(seedN ^ (seedN >>> 15), 1 | seedN); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = <T,>(xs: readonly T[]) => xs[Math.floor(rnd() * xs.length)]!;
const DEMO_PASSWORD = "Demo@12345";

const FIRST_AR = ["محمد", "أحمد", "محمود", "علي", "عمر", "يوسف", "كريم", "مصطفى", "هدى", "منى", "سارة", "نور", "ياسمين", "فاطمة", "مريم", "ليلى", "دينا", "رنا", "هبة", "سلمى"];
const LAST_AR = ["حسن", "إبراهيم", "السيد", "عبد الله", "فتحي", "الشريف", "زكي", "منصور", "عثمان", "رضوان", "الجمال", "مراد"];
const FIRST_EN = ["Mohamed", "Ahmed", "Mahmoud", "Ali", "Omar", "Youssef", "Karim", "Mostafa", "Hoda", "Mona", "Sara", "Nour", "Yasmin", "Fatma", "Mariam", "Laila", "Dina", "Rana", "Heba", "Salma"];
const LAST_EN = ["Hassan", "Ibrahim", "El-Sayed", "Abdallah", "Fathy", "El-Sherif", "Zaki", "Mansour", "Osman", "Radwan", "El-Gamal", "Morad"];
const CATEGORY: Record<string, string> = {
  paracetamol: "Analgesics", ibuprofen: "Analgesics", diclofenac: "Analgesics", naproxen: "Analgesics", celecoxib: "Analgesics", tramadol: "Analgesics", morphine: "Analgesics", pregabalin: "CNS",
  amoxicillin: "Antibiotics", "amoxicillin + clavulanic acid": "Antibiotics", azithromycin: "Antibiotics", cefixime: "Antibiotics", ciprofloxacin: "Antibiotics", levofloxacin: "Antibiotics", clarithromycin: "Antibiotics", doxycycline: "Antibiotics", ceftriaxone: "Antibiotics", fluconazole: "Antibiotics", acyclovir: "Antibiotics",
  metformin: "Diabetes", glimepiride: "Diabetes", gliclazide: "Diabetes", sitagliptin: "Diabetes", "insulin glargine": "Diabetes", "insulin aspart": "Diabetes",
  atorvastatin: "Cardiovascular", simvastatin: "Cardiovascular", rosuvastatin: "Cardiovascular", amlodipine: "Cardiovascular", enalapril: "Cardiovascular", lisinopril: "Cardiovascular", losartan: "Cardiovascular", valsartan: "Cardiovascular", metoprolol: "Cardiovascular", bisoprolol: "Cardiovascular", furosemide: "Cardiovascular", spironolactone: "Cardiovascular", clopidogrel: "Cardiovascular", warfarin: "Cardiovascular", aspirin: "Cardiovascular", enoxaparin: "Cardiovascular",
  omeprazole: "Gastro", pantoprazole: "Gastro", esomeprazole: "Gastro", domperidone: "Gastro", lactulose: "Gastro", "hyoscine butylbromide": "Gastro", "oral rehydration salts": "Gastro",
  loratadine: "Allergy & respiratory", cetirizine: "Allergy & respiratory", fexofenadine: "Allergy & respiratory", montelukast: "Allergy & respiratory", salbutamol: "Allergy & respiratory", budesonide: "Allergy & respiratory", "saline nasal spray": "Allergy & respiratory",
  "vitamin c": "Vitamins", "vitamin d3": "Vitamins", "zinc sulfate": "Vitamins", multivitamin: "Vitamins", "omega-3": "Vitamins", "calcium + vitamin d": "Vitamins",
  clotrimazole: "Dermatology", "fusidic acid": "Dermatology", betamethasone: "Dermatology", sertraline: "CNS", escitalopram: "CNS", alprazolam: "CNS", diazepam: "CNS", sildenafil: "Urology", tamsulosin: "Urology", prednisolone: "Hormones", levothyroxine: "Hormones",
};

interface Ctx { done: string[]; org: string; name: string; mode: "INTEGRATED" | "STANDALONE"; b1: { id: string; code: string | null }; b2?: { id: string; code: string | null }; owner: AuthUser; pharm: AuthUser; cashier: AuthUser; assistant: AuthUser; scale: "main" | "solo"; managerCreds: { email: string; password: string }; witnessCreds: { email: string; password: string } }

const ALL_STEPS = ["catalogue", "stock2", "locations", "prescribers", "promos", "customers", "sales", "rx", "controlled", "purchasing", "claims"];
/** Steps already done for a tenant: its own `suiteSteps` marker, or (older single-flag runs) everything / the base steps. Every step is skipped when done, so the seed is safe to re-run and to top up. */
function legacyDone(settings: unknown, isMain: boolean): string[] {
  const s = (settings ?? {}) as { suiteSteps?: string[]; suiteSeeded?: boolean };
  if (s.suiteSteps) return s.suiteSteps;
  if (s.suiteSeeded) return isMain ? ALL_STEPS : ["catalogue", "locations", "prescribers", "promos", "customers", "sales"];
  return [];
}

export async function seedSuite(): Promise<void> {
  assertDemoSeedAllowed("Kiorly Pharmacy standalone-suite demo");
  loadEnv();
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ["error"] });
  try {
    const prisma = app.get(PrismaService);
    const main = await prisma.tenant.findUnique({ where: { externalOrgId: "org_demo_kiorly" } });
    if (!main) throw new Error("base demo tenant missing: run `npm run seed -w api` and `npm run seed:demo -w api` first");
    const hash = await hashPassword(DEMO_PASSWORD);
    const au = (org: string, u: { id: string; role: AuthUser["role"]; displayName: string; branchId: string | null; pharmacistLicenceNo: string | null }): AuthUser => ({ userId: u.id, orgId: org, role: u.role, displayName: u.displayName, branchId: u.branchId, market: "EG", edition: "CHAIN", pharmacistLicenceNo: u.pharmacistLicenceNo, mfa: false });
    const mkStaff = async (org: string, email: string, role: AuthUser["role"], displayName: string, extra: object = {}) => (await prisma.staffUser.findUnique({ where: { email } })) ?? prisma.staffUser.create({ data: { orgId: org, email, passwordHash: hash, displayName, role, ...extra } });

    // ------------------------------------------------------------------ main tenant
    {
      const mainFirst = !((main.settings ?? {}) as { suiteSeeded?: boolean; suiteSteps?: string[] }).suiteSeeded && !((main.settings ?? {}) as { suiteSteps?: string[] }).suiteSteps;
      const b1 = await prisma.branch.findFirstOrThrow({ where: { orgId: main.id, code: "MAIN" } }), b2 = await prisma.branch.findFirstOrThrow({ where: { orgId: main.id, code: "NASR" } });
      const owner = await prisma.staffUser.findUniqueOrThrow({ where: { email: "owner@demo.kiorly.local" } }), pharm = await prisma.staffUser.findUniqueOrThrow({ where: { email: "pharmacist@demo.kiorly.local" } }), cashier = await prisma.staffUser.findUniqueOrThrow({ where: { email: "cashier@demo.kiorly.local" } });
      const assistant = await mkStaff(main.id, "assistant@demo.kiorly.local", "ASSISTANT", "Asma Assistant", { branchId: b1.id });
      await mkStaff(main.id, "pharmacist2@demo.kiorly.local", "PHARMACIST", "Ph. Karim Demo", { branchId: b2.id, pharmacistLicenceNo: "SYN-0003" });
      if (mainFirst) await prisma.tenant.update({ where: { id: main.id }, data: { settings: { ...((main.settings ?? {}) as object), mode: "INTEGRATED", currency: "EGP", languages: ["ar", "en"], maxCashierDiscountPct: 10, costVarianceTolerancePct: 5, refillReminderDays: 3, customerCreditDays: 30, receipt: { header: "Open 9am - midnight", footer: "Thank you for choosing Kiorly Demo Pharmacy", showVat: true, showLicence: true, paper: "80mm" }, printers: [{ id: "p1", name: "Counter thermal printer", kind: "RECEIPT", paper: "80mm" }, { id: "p2", name: "Label printer", kind: "LABEL" }, { id: "p3", name: "Office A4", kind: "A4" }], taxRates: [{ code: "STD", label: "VAT", rate: "0.14" }, { code: "ZERO", label: "Zero-rated", rate: "0.00" }], loyalty: { enabled: true, earnPer: "10", pointsPerEarn: 1, redeemValue: "0.50" } } } });
      const ctx: Ctx = { done: legacyDone(main.settings, true), org: main.id, name: main.name, mode: "INTEGRATED", b1, b2, owner: au(main.id, owner), pharm: au(main.id, pharmacist(pharm)), cashier: au(main.id, cashier), assistant: au(main.id, assistant), scale: "main", managerCreds: { email: "manager@demo.kiorly.local", password: DEMO_PASSWORD }, witnessCreds: { email: "manager@demo.kiorly.local", password: DEMO_PASSWORD } };
      await seedOperations(app, prisma, ctx);
      await prisma.tenant.update({ where: { id: main.id }, data: { settings: { ...(((await prisma.tenant.findUniqueOrThrow({ where: { id: main.id } })).settings ?? {}) as object), suiteSeeded: true } } });
    }

    // ------------------------------------------------------------------ standalone tenant (no Kiorex / Kiorly at all)
    let solo = await prisma.tenant.findUnique({ where: { externalOrgId: "org_demo_solo" } });
    if (!solo) {
      solo = await prisma.tenant.create({ data: { name: "Kiorly Solo Pharmacy (DEMO)", externalOrgId: "org_demo_solo", edition: "PRO", marketCode: "EG", onboardedAt: new Date(), settings: { mode: "STANDALONE", currency: "EGP", languages: ["ar", "en"], receipt: { header: "Standalone demo pharmacy", footer: "Thank you", paper: "80mm" }, loyalty: { enabled: true, earnPer: "10", redeemValue: "0.50" } } } });
    }
    {
      const sb = (await prisma.branch.findFirst({ where: { orgId: solo.id, code: "SOLO" } })) ?? (await prisma.branch.create({ data: { orgId: solo.id, name: "Zamalek Branch", code: "SOLO", licenceNo: "EDA-DEMO-SOLO-1", address: "Zamalek, Cairo" } }));
      const so = await mkStaff(solo.id, "solo.owner@demo.kiorly.local", "OWNER", "Dr. Solo Owner", { pharmacistLicenceNo: "SYN-1001" });
      const sp = await mkStaff(solo.id, "solo.pharmacist@demo.kiorly.local", "PHARMACIST", "Ph. Nada Solo", { branchId: sb.id, pharmacistLicenceNo: "SYN-1002" });
      const sm = await mkStaff(solo.id, "solo.manager@demo.kiorly.local", "BRANCH_MANAGER", "Mina Manager", { branchId: sb.id });
      const sc = await mkStaff(solo.id, "solo.cashier@demo.kiorly.local", "CASHIER", "Sherif Cashier", { branchId: sb.id });
      const sa = await mkStaff(solo.id, "solo.assistant@demo.kiorly.local", "ASSISTANT", "Aya Assistant", { branchId: sb.id });
      void sm;
      const ctx: Ctx = { done: legacyDone(solo.settings, false), org: solo.id, name: solo.name, mode: "STANDALONE", b1: sb, owner: au(solo.id, so), pharm: au(solo.id, pharmacist(sp)), cashier: au(solo.id, sc), assistant: au(solo.id, sa), scale: "solo", managerCreds: { email: "solo.manager@demo.kiorly.local", password: DEMO_PASSWORD }, witnessCreds: { email: "solo.manager@demo.kiorly.local", password: DEMO_PASSWORD } };
      await seedOperations(app, prisma, ctx);
      await prisma.tenant.update({ where: { id: solo.id }, data: { settings: { ...(((await prisma.tenant.findUniqueOrThrow({ where: { id: solo.id } })).settings ?? {}) as object), suiteSeeded: true } } });
    }

    // everything the suite wrote stays local: never push demo events to Kiorex
    await prisma.$executeRawUnsafe(`UPDATE "OutboxEvent" SET status='SENT', "sentAt"=now() WHERE status<>'SENT'`).catch(() => 0);
    const c = async (org: string) => ({ customers: await prisma.patientRef.count({ where: { orgId: org } }), rx: await prisma.prescription.count({ where: { orgId: org } }), sales: await prisma.sale.count({ where: { orgId: org } }), controlled: await prisma.controlledRegisterEntry.count({ where: { orgId: org } }), claims: await prisma.insurerClaim.count({ where: { orgId: org } }), alerts: await prisma.alert.count({ where: { orgId: org } }) });
    console.log(`Suite seed OK — main ${JSON.stringify(await c(main.id))}; solo ${JSON.stringify(await c(solo.id))}. Logins: owner@ / pharmacist@ / cashier@ / manager@ / assistant@demo.kiorly.local and solo.owner@ / solo.pharmacist@ / solo.cashier@ / solo.manager@ / solo.assistant@demo.kiorly.local — ${DEMO_PASSWORD} (DEV ONLY)`);
  } finally { await app.close(); await tagDemoRows("seed-suite"); }
}
const pharmacist = <T extends { role: string }>(u: T) => u as T & { role: "PHARMACIST" };

/* eslint-disable @typescript-eslint/no-explicit-any */
async function seedOperations(app: any, prisma: PrismaService, x: Ctx): Promise<void> {
  const { org } = x;
  const reg = app.get(CustomerRegistryService) as CustomerRegistryService, rxSvc = app.get(PrescriptionsService) as PrescriptionsService, presc = app.get(PrescribersService) as PrescribersService, refills = app.get(RefillsService) as RefillsService;
  const xfers = app.get(RxTransfersService) as RxTransfersService, disp = app.get(DispensingService) as DispensingService, sales = app.get(SalesService) as SalesService, shifts = app.get(ShiftsService) as ShiftsService;
  const promos = app.get(PromotionsService) as PromotionsService, held = app.get(HeldCartsService) as HeldCartsService, cash = app.get(CashService) as CashService, pos = app.get(PosService) as PosService;
  const locs = app.get(LocationsService) as LocationsService, uoms = app.get(UomService) as UomService, receiving = app.get(ReceivingService) as ReceivingService, inv = app.get(InventoryService) as InventoryService;
  const analytics = app.get(InventoryAnalyticsService) as InventoryAnalyticsService, ctl = app.get(ControlledService) as ControlledService, fin = app.get(FinanceService) as FinanceService, rfq = app.get(RfqService) as RfqService;
  const suppliers = app.get(SuppliersService) as SuppliersService, claims = app.get(ClaimsService) as ClaimsService, alerts = app.get(AlertsService) as AlertsService, prices = app.get(PriceService) as PriceService, catalogue = app.get(CatalogueService) as CatalogueService, approvals = app.get(ApprovalService) as ApprovalService;
  void pos; void fin; void catalogue;
  const warn = (what: string) => (e: unknown) => { console.warn(`suite[${x.name}] ${what}: ${(e as Error).message}`); return undefined; };
  const today = marketToday(), iso = (d: number) => new Date(today.getTime() + d * DAY).toISOString().slice(0, 10);
  const solo = x.scale === "solo";
  console.log(`suite: seeding ${x.name} (${x.mode}) ...`);
  const done = new Set<string>(x.done);
  const step = async (name: string, fn: () => Promise<void>) => { if (done.has(name)) return; await fn(); done.add(name); const t = await prisma.tenant.findUniqueOrThrow({ where: { id: org } }); await prisma.tenant.update({ where: { id: org }, data: { settings: { ...((t.settings ?? {}) as object), suiteSteps: [...done] } } }); };


  // ---- catalogue: categories, stock (solo tenant gets its own opening stock), price book
  let all: Awaited<ReturnType<typeof prisma.drug.findMany>> = [];
  await step("catalogue", async () => {
    for (const [ing, cat] of Object.entries(CATEGORY)) await prisma.drug.updateMany({ where: { activeIngredient: ing, category: null }, data: { category: cat } });
    const all = await prisma.drug.findMany({ where: { active: true, OR: [{ orgId: null }, { orgId: org }] }, orderBy: { sourceKey: "asc" } });
    if (solo) {
      const pool = all.filter((d) => !d.coldChain && d.controlledSchedule === "NONE");
      const chosen = [...pool.filter((d) => !d.rxOnly).filter((_, i) => i % 6 === 0).slice(0, 55), ...pool.filter((d) => d.rxOnly).filter((_, i) => i % 5 === 0).slice(0, 30), ...all.filter((d) => d.controlledSchedule === "SCHEDULE_3" || d.controlledSchedule === "SCHEDULE_4").slice(0, 2)];
      const unpriced = chosen.filter(() => true);
      const base = await prisma.priceBookEntry.findMany({ where: { drugId: { in: unpriced.map((d) => d.id) }, branchId: null }, orderBy: { effectiveFrom: "desc" } });
      const pm = new Map<string, string>(); for (const b of base) if (!pm.has(b.drugId)) pm.set(b.drugId, b.price.toFixed(2));
      await prices.bulkUpdate(org, x.owner.userId, new Date("2026-01-01"), unpriced.map((d) => ({ drugId: d.id, price: pm.get(d.id) ?? String(20 + Math.floor(rnd() * 120)) }))).catch(warn("prices"));
      const sup = await suppliers.create(org, { name: "Solo Pharma Supply (DEMO)", phone: "+201001119001", email: "orders@solo-supply.test", paymentTerms: "30 days", creditLimit: "100000" });
      for (const [i, d] of chosen.entries()) await receiving.receive(x.owner, { branchId: x.b1.id, supplierId: sup.id, invoiceNo: `SOLO-${1000 + i}`, lines: [{ drugId: d.id, lotNumber: `SL${String(i + 1).padStart(4, "0")}`, expiryDate: iso([420, 260, 120, 55, 20][i % 5]!), quantity: 12 + Math.floor(rnd() * 50), unitCost: ((Number(pm.get(d.id) ?? 50)) * 0.7).toFixed(2) }] } as any).catch(warn("receive"));
    }
  });
  await step("stock2", async () => {
    if (!solo) return;
    const pool = await prisma.drug.findMany({ where: { active: true, OR: [{ orgId: null }, { orgId: org }] }, orderBy: { sourceKey: "asc" } });
    const extra = [...pool.filter((d) => d.rxOnly && d.controlledSchedule === "NONE" && !d.coldChain).filter((_, i) => i % 3 === 0).slice(0, 36), ...pool.filter((d) => d.controlledSchedule === "SCHEDULE_3" || d.controlledSchedule === "SCHEDULE_4").slice(0, 2)];
    const sup = await prisma.supplier.findFirst({ where: { orgId: org } });
    const base = await prisma.priceBookEntry.findMany({ where: { drugId: { in: extra.map((d) => d.id) }, branchId: null }, orderBy: { effectiveFrom: "desc" } });
    const pm = new Map<string, string>(); for (const b of base) if (!pm.has(b.drugId)) pm.set(b.drugId, b.price.toFixed(2));
    const priced = new Set((await prisma.priceBookEntry.findMany({ where: { orgId: org, drugId: { in: extra.map((d) => d.id) } }, select: { drugId: true } })).map((r) => r.drugId));
    const need = extra.filter((d) => !priced.has(d.id));
    if (need.length) await prices.bulkUpdate(org, x.owner.userId, new Date("2026-01-01"), need.map((d) => ({ drugId: d.id, price: pm.get(d.id) ?? String(30 + Math.floor(rnd() * 150)) }))).catch(warn("prices2"));
    for (const [i, d] of extra.entries()) { const lotNumber = `SX${String(i + 1).padStart(4, "0")}`; if (await prisma.stockLot.findFirst({ where: { branchId: x.b1.id, drugId: d.id, lotNumber } })) continue; await receiving.receive(x.owner, { branchId: x.b1.id, supplierId: sup?.id, invoiceNo: `SOLO-X-${i}`, lines: [{ drugId: d.id, lotNumber, expiryDate: iso([420, 260, 120][i % 3]!), quantity: 20 + Math.floor(rnd() * 40), unitCost: ((Number(pm.get(d.id) ?? 60)) * 0.7).toFixed(2) }] } as any).catch(warn("receive2")); }
  });
  const stocked = await prisma.stockLot.findMany({ where: { orgId: org, qtyOnHand: { gt: 8 }, status: { in: ["AVAILABLE", "RECEIVED"] }, expiryDate: { gte: today } }, include: { drug: true } });
  const sellable = [...new Map(stocked.filter((l) => !l.drug.rxOnly && l.drug.controlledSchedule === "NONE" && !l.drug.coldChain && l.branchId === x.b1.id).map((l) => [l.drugId, l.drug])).values()];
  const rxStocked = [...new Map(stocked.filter((l) => l.drug.rxOnly && l.drug.controlledSchedule === "NONE" && !l.drug.coldChain && l.branchId === x.b1.id).map((l) => [l.drugId, l.drug])).values()];
  const withIng = (ing: string) => rxStocked.find((d) => d.activeIngredient.toLowerCase() === ing) ?? stocked.find((l) => l.drug.activeIngredient.toLowerCase() === ing)?.drug;

  // ---- locations + pack units
  await step("locations", async () => {
    for (const b of [x.b1, x.b2].filter(Boolean) as Array<{ id: string }>) {
      const mk = async (code: string, kind: string, label: string) => (await prisma.shelfLocation.findFirst({ where: { branchId: b.id, code } })) ?? locs.create(x.owner, b.id, { code, kind, label });
      const shelves = [await mk("A1", "SHELF", "Analgesics & cold remedies"), await mk("A2", "SHELF", "Vitamins"), await mk("B1", "SHELF", "Antibiotics (Rx)"), await mk("B2", "DISPLAY", "Front display")];
      const fridge = await mk("FR1", "FRIDGE", "Pharmacy fridge 2-8 C"), safe = await mk("SAFE1", "SAFE", "Controlled medicines safe");
      const lots = await prisma.stockLot.findMany({ where: { orgId: org, branchId: b.id, qtyOnHand: { gt: 0 }, locationId: null }, include: { drug: true }, take: 900 });
      for (const l of lots) { const loc = l.drug.coldChain ? fridge : l.drug.controlledSchedule !== "NONE" ? safe : l.drug.rxOnly ? shelves[2]! : shelves[l.drug.category === "Vitamins" ? 1 : l.drug.category === "Analgesics" ? 0 : (l.id.charCodeAt(5) % 2) + 0]!; await prisma.stockLot.update({ where: { id: l.id }, data: { locationId: loc.id } }); }
    }
    for (const d of sellable.slice(0, 18)) await uoms.create(x.owner, d.id, { name: "box", factor: 12 }).catch(() => undefined);

  });
  // ---- prescribers
  await step("prescribers", async () => {
    const doctors = [["Dr. Tamer Shawky", "SYN-MD-100", "Internal medicine", true], ["Dr. Rania Fouad", "SYN-MD-101", "Paediatrics", true], ["Dr. Khaled Nabil", "SYN-MD-102", "Cardiology", true], ["Dr. Amira Salah", "SYN-MD-103", "Obstetrics", false], ["Dr. Wael Gamal", "SYN-MD-104", "Orthopaedics", false], ["Dr. Dalia Samir", "SYN-MD-105", "Dermatology", true], ["Dr. Hossam Eid", "SYN-MD-106", "Psychiatry", true], ["Dr. Nadia Lotfy", "SYN-MD-107", "Endocrinology", false]] as const;
    const docIds: string[] = [];
    for (const [n, lic, spec, ver] of doctors) { const p = (await prisma.prescriber.findFirst({ where: { orgId: org, licenceNo: `${solo ? "S" : ""}${lic}` } })) ?? (await presc.create(x.pharm, { name: n, licenceNo: `${solo ? "S" : ""}${lic}`, specialty: spec, clinicName: `${spec} Clinic`, phone: "+20225550000" })); if (ver && !p.verified) await presc.verify(x.pharm, p.id, true); docIds.push(p.id); }

  });
  const docIds = (await prisma.prescriber.findMany({ where: { orgId: org, licenceNo: { contains: "SYN-MD-" } }, orderBy: { licenceNo: "asc" }, select: { id: true } })).map((p) => p.id);
  // ---- promotions & coupons
  await step("promos", async () => {
    const pr = sellable.slice(4, 14);
    if (pr.length >= 6) {
      await promos.create(x.owner, { name: "Vitamin week 10% off", nameAr: "أسبوع الفيتامينات خصم 10%", kind: "PERCENT_OFF", drugIds: sellable.filter((d) => d.category === "Vitamins").slice(0, 6).map((d) => d.id), params: { percent: 10 }, endsAt: new Date(Date.now() + 10 * DAY).toISOString() }).catch(warn("promo1"));
      await promos.create(x.owner, { name: "Buy 2 get 1 free", nameAr: "اشترِ 2 والثالث مجاناً", kind: "BUY_X_GET_Y", drugIds: [pr[0]!.id, pr[1]!.id], params: { buy: 2, get: 1 } }).catch(warn("promo2"));
      await promos.create(x.owner, { name: "Cold & flu bundle", nameAr: "باقة البرد والإنفلونزا", kind: "BUNDLE_PRICE", drugIds: [pr[2]!.id, pr[3]!.id], params: { items: [{ drugId: pr[2]!.id, qty: 1 }, { drugId: pr[3]!.id, qty: 1 }], price: 60 }, priority: 5 }).catch(warn("promo3"));
      await promos.create(x.owner, { name: "Welcome coupon", nameAr: "كوبون ترحيب", kind: "PERCENT_OFF", couponCode: "WELCOME10", params: { percent: 10 }, maxUses: 100 }).catch(warn("promo4"));
      await promos.create(x.owner, { name: "Loyal customers 5 EGP off", kind: "AMOUNT_OFF", couponCode: "LOYAL5", drugIds: [pr[4]!.id, pr[5]!.id], params: { amount: 5 } }).catch(warn("promo5"));
    }

  });
  // ---- customers (families, allergies, flags, credit, duplicates)
  await step("customers", async () => {
    const nCust = solo ? 22 : 62;
    const made: Array<{ id: string; customerNo: string | null; displayName: string }> = [];
    for (let i = 0; i < nCust; i++) {
      const ar = i % 2 === 0, name = ar ? `${pick(FIRST_AR)} ${pick(LAST_AR)}` : `${pick(FIRST_EN)} ${pick(LAST_EN)}`, female = i % 3 === 0;
      const allergies = i % 9 === 0 ? ["penicillin"] : i % 11 === 0 ? ["sulfa", "nsaid"] : i % 17 === 0 ? ["latex"] : [], conds = i % 7 === 0 ? ["diabetes"] : i % 8 === 0 ? ["hypertension"] : i % 13 === 0 ? ["asthma"] : [];
      const phone = `01${["0", "1", "2", "5"][i % 4]}${String(10_000_000 + Math.floor(rnd() * 89_999_999))}`;
      const c = await reg.create(x.owner, { displayName: `${name}${ar ? "" : ""}`, phone, email: i % 4 === 0 ? `cust${i}@example.test` : undefined, gender: female ? "F" : "M", dateOfBirth: `${1950 + Math.floor(rnd() * 55)}-${String(1 + (i % 12)).padStart(2, "0")}-${String(1 + (i % 27)).padStart(2, "0")}`, allergies, chronicConditions: conds, pregnant: female && i % 12 === 0, lactating: female && i % 15 === 0 && i % 12 !== 0, renalImpairment: i % 19 === 0, hepaticImpairment: i % 23 === 0, weightKg: String(48 + (i % 40)), consentDataProcessing: true, consentMarketing: i % 3 !== 0, address: `${10 + i} Street ${1 + (i % 9)}, Cairo` }, { force: true }).catch(warn("customer"));
      if (c) made.push(c as never);
    }
    for (let f = 0; f + 2 < made.length && f < 12; f += 3) { await reg.addFamily(x.owner, made[f]!.id, { relatedPatientId: made[f + 1]!.id, relation: "spouse" }).catch(() => undefined); await reg.addFamily(x.owner, made[f]!.id, { relatedPatientId: made[f + 2]!.id, relation: "child" }).catch(() => undefined); }
    if (made.length > 10) { // duplicates for the merge screen
      await reg.create(x.owner, { displayName: `${made[5]!.displayName}`, phone: undefined, consentDataProcessing: true }, { force: true }).catch(warn("dup"));
      await reg.addNote(x.pharm, made[0]!.id, { body: "Prefers generic brands; counselled on antibiotic course completion.", kind: "COUNSELLING" }).catch(() => undefined);
    }
    for (const [i, c] of made.slice(2, solo ? 5 : 9).entries()) await reg.openCreditAccount(x.owner, c.id, String(500 + i * 250)).catch(warn("credit"));


  });
  const custs = (await prisma.patientRef.findMany({ where: { orgId: org, active: true, mergedIntoId: null, customerNo: { not: null }, displayName: { not: { contains: "Kiorex patient" } } }, orderBy: { createdAt: "asc" }, take: 80, select: { id: true, customerNo: true, displayName: true } }));
  const creditCusts = (await prisma.customerAccount.findMany({ where: { orgId: org }, select: { patientId: true }, take: 12 })).map((a) => custs.find((c) => c.id === a.patientId)).filter((c): c is NonNullable<typeof c> => !!c);
  const acct = async (id: string) => (await prisma.customerAccount.findUnique({ where: { patientId: id } }))?.id;
  const peopleRx = custs.slice(solo ? 3 : 10, solo ? 23 : 30);
  const rxFor = async (cust: { id: string }, drugId: string, qty: number, directions: string, extra: object = {}) => rxSvc.intakePaper(x.pharm, { branchId: x.b1.id, patientId: cust.id, prescriberId: pick(docIds), issuedAt: new Date(Date.now() - 2 * DAY).toISOString(), lines: [{ drugId, quantity: qty, directions }], source: "MANUAL_ENTRY", ...extra } as any).catch(warn("rx"));
  // ---- shift + sales over 30 days (loyalty accrues, some credit, promos, coupons)
  await step("sales", async () => {
    const open = (await prisma.shift.findFirst({ where: { orgId: org, branchId: x.b1.id, status: "OPEN" } })) ?? (await shifts.open(x.cashier, x.b1.id, "300.00"));
    const nSales = solo ? 45 : 140;
    for (let i = 0; i < nSales; i++) {
      const d1 = pick(sellable), d2 = pick(sellable), cust = i % 3 !== 0 ? pick(custs) : null;
      const lines = [{ drugId: d1.id, quantity: 1 + (i % 3) }, ...(i % 4 === 0 && d2.id !== d1.id ? [{ drugId: d2.id, quantity: 1 }] : [])];
      try {
        const priced = await sales.priceCart(prisma, x.cashier, x.b1.id, lines, new Date(), false);
        const pr2 = await sales.applyPromos(prisma, x.cashier, x.b1.id, priced, i % 10 === 0 ? ["WELCOME10"] : [], new Date());
        const total = sales.totals(pr2.lines).total;
        const onCredit = cust && creditCusts.some((c) => c.id === cust.id) && i % 2 === 0;
        const r = await sales.checkout(x.cashier, { branchId: x.b1.id, shiftId: open.id, idempotencyKey: `suite-sale-${org.slice(-4)}-${i}`, lines, patientId: cust?.id, customerAccountId: onCredit ? await acct(cust!.id) : undefined, couponCodes: i % 10 === 0 ? ["WELCOME10"] : undefined, payments: [{ method: onCredit ? "CUSTOMER_CREDIT" : i % 3 === 0 ? "CARD" : "CASH", amount: total.toFixed(2) }] } as any);
        const when = i < 6 ? Date.now() - (i + 1) * 20 * 60_000 : Date.now() - ((i % 29) + 1) * DAY - (i % 11) * 3_600_000;
        await prisma.sale.update({ where: { id: r.sale.id }, data: { soldAt: new Date(when) } });
        if (onCredit && i % 6 === 0) await prisma.customerCreditEntry.updateMany({ where: { saleId: r.sale.id }, data: { createdAt: new Date(when) } });
      } catch (e) { if (i < 2) warn("sale")(e); }
    }
    // returns + an exchange, cash drawer, held carts, expenses
    const recent = await prisma.sale.findMany({ where: { orgId: org, branchId: x.b1.id, status: "COMPLETED", shiftId: open.id }, include: { lines: true }, orderBy: { soldAt: "desc" }, take: 6 });
    if (recent[0]) await pos.returnItems(x.owner, recent[0].id, { lines: [{ saleLineId: recent[0].lines[0]!.id, quantity: 1 }], reason: "Customer returned an unopened pack", refundMethod: "CASH" }).catch(warn("return"));
    if (recent[1] && sellable.length > 3) await pos.exchange(x.owner, recent[1].id, { returnLines: [{ saleLineId: recent[1].lines[0]!.id, quantity: 1 }], reason: "Wrong strength", refundMethod: "CASH", newLines: [{ drugId: sellable[3]!.id, quantity: 1 }], payments: [{ method: "CASH", amount: "500.00" }], idempotencyKey: `suite-exch-${org.slice(-4)}` } as any).catch(warn("exchange"));
    for (const [kind, category, amount, reason] of [["OUT", "PETTY_CASH", "35.00", "Cleaning supplies"], ["OUT", "SUPPLIER_PAYMENT", "120.00", "COD delivery"], ["IN", "FLOAT_TOP_UP", "100.00", "Change float from safe"]] as const) await cash.record(x.cashier, x.b1.id, { kind, category, amount, reason }).catch(warn("cash"));
    await held.hold(x.cashier, x.b1.id, { label: "Mrs. Aya (waiting for her husband)", patientId: custs[1]?.id, payload: { lines: [{ drugId: sellable[0]!.id, quantity: 2, brandName: sellable[0]!.brandName }, { drugId: sellable[1]!.id, quantity: 1, brandName: sellable[1]!.brandName }], customer: custs[1] ? { id: custs[1].id, displayName: custs[1].displayName } : null } as never }).catch(warn("held"));
    const expenses: Array<[string, string, string, string, boolean?]> = [["RENT", "9500.00", "Monthly rent", "BANK"], ["UTILITIES", "1240.00", "Electricity bill", "BANK"], ["SALARIES", "18500.00", "Staff salaries", "BANK"], ["MARKETING", "600.00", "Facebook ads", "CARD"], ["MAINTENANCE", "350.00", "AC service", "CASH"], ["SUPPLIES", "85.00", "Receipt paper rolls", "CASH", true], ["TRANSPORT", "140.00", "Delivery scooter fuel", "CASH"], ["BANK_FEES", "75.00", "POS terminal fees", "BANK"]];
    for (const [i, [category, amount, description, method, fromDrawer]] of expenses.entries()) await fin.createExpense(x.owner, x.b1.id, { category, amount, vatAmount: category === "UTILITIES" ? "150.88" : undefined, description, method, fromDrawer, expenseDate: new Date(Date.now() - (i * 3 + 1) * DAY).toISOString() }).catch(warn("expense"));
    // closed past shifts for the cash-close report
    for (let k = 1; k <= 4; k++) { const opened = new Date(Date.now() - k * DAY - 10 * 3_600_000); const gross = (900 + Math.floor(rnd() * 1800)); const counted = gross + 300 + (k === 2 ? -45 : 0); await prisma.shift.create({ data: { orgId: org, branchId: x.b1.id, openedBy: x.cashier.userId, closedBy: x.cashier.userId, status: "CLOSED", openingFloat: 300, countedCash: counted, expectedCash: gross + 300, variance: counted - gross - 300, varianceAlerted: k === 2, openedAt: opened, closedAt: new Date(opened.getTime() + 10 * 3_600_000), zReport: { salesCount: 24 + k, grossSales: gross.toFixed(2), report: "Z" } as never } }).catch(() => undefined); }

  });
  // ---- prescriptions in EVERY state ------------------------------------------------------------------------------
  await step("rx", async () => {
  
    const drugA = withIng("amoxicillin") ?? rxStocked[0]!, drugB = withIng("metformin") ?? rxStocked[1]!, drugC = withIng("atorvastatin") ?? rxStocked[2]!, drugD = withIng("azithromycin") ?? rxStocked[3]!, drugE = rxStocked[4] ?? rxStocked[0]!;
    if (rxStocked.length >= 5 && peopleRx.length >= 14) {
      await rxFor(peopleRx[0]!, drugA.id, 2, "1 capsule three times daily for 7 days", { priority: "URGENT" });                         // RECEIVED urgent
      await rxFor(peopleRx[1]!, drugB.id, 2, "1 tablet twice daily", { refillsAllowed: 3, refillIntervalDays: 30 });                    // RECEIVED
      const noLic = await rxSvc.intakePaper(x.pharm, { branchId: x.b1.id, patientId: peopleRx[2]!.id, prescriberName: "Dr. Unknown (no licence)", lines: [{ drugId: drugC.id, quantity: 1, directions: "" }], source: "MANUAL_ENTRY" } as any).catch(warn("rx-nolic")); // VALIDATING (fails)
      if (noLic) await rxSvc.validate(x.pharm, noLic.id).catch(() => undefined);
      for (const [i, d] of [drugB, drugC].entries()) { const v = await rxFor(peopleRx[3 + i]!, d.id, 3, "1 tablet daily"); if (v) await rxSvc.validate(x.pharm, v.id).catch(() => undefined); }   // VALIDATED
      const rej = await rxFor(peopleRx[5]!, drugD.id, 1, "single dose"); if (rej) await rxSvc.reject(x.pharm, rej.id, "Prescriber signature unclear; asked the patient to bring a clearer copy").catch(() => undefined); // REJECTED
      const can = await rxFor(peopleRx[6]!, drugE.id, 1, "as directed"); if (can) await prisma.prescription.update({ where: { id: can.id }, data: { status: "CANCELLED" } }); // CANCELLED
      const exp = await rxFor(peopleRx[7]!, drugE.id, 1, "as directed", { issuedAt: new Date(Date.now() - 80 * DAY).toISOString(), validDays: 30 }); if (exp) await prisma.prescription.update({ where: { id: exp.id }, data: { status: "EXPIRED" } }); // EXPIRED
      const out = await rxFor(peopleRx[8]!, drugB.id, 4, "1 tablet daily"); if (out) { await rxSvc.validate(x.pharm, out.id).catch(() => undefined); await xfers.out(x.pharm, out.id, { counterparty: { name: "Al Nour Pharmacy", phone: "+20233300000", pharmacist: "Ph. Amal" }, reason: "Out of stock at the time" }).catch(warn("xfer-out")); } // TRANSFERRED_OUT
      await xfers.in(x.pharm, x.b1.id, { counterparty: { name: "City Care Pharmacy", pharmacist: "Ph. Samir" }, originalRef: "CC-88231", patientId: peopleRx[9]!.id, prescriberName: "Dr. Tamer Shawky", prescriberLicenceNo: "SYN-MD-100", issuedAt: new Date(Date.now() - 4 * DAY).toISOString(), refillsAllowed: 1, lines: [{ drugId: drugB.id, quantity: 2, directions: "1 tablet twice daily" }] }).catch(warn("xfer-in")); // TRANSFER_IN
      // dispensed + refills (due soon -> reminder list), partial fill
      const dispense = async (rxId: string, qty?: number, partialReason?: string) => { const full = await rxSvc.get(org, rxId); const dsp = await disp.create(x.pharm, { branchId: x.b1.id, prescriptionId: rxId, partialReason, items: full.lines.map((l: any) => ({ prescriptionLineId: l.id, drugId: l.drugId, quantity: qty ?? l.quantity - l.qtyDispensed })) } as any); const bl = dsp.safetyChecks.filter((c: any) => c.outcome === "BLOCK" && c.overridable); for (const b of bl) await disp.override(x.pharm, dsp.id, b.id, "Reviewed with the prescriber (demo)").catch(() => undefined); await disp.setCounselling(x.pharm, dsp.id, { notes: "Take after food; complete the course; return if rash appears.", topics: ["food", "course"] }).catch(() => undefined); await disp.signOff(x.pharm, dsp.id, "Counselled (demo)"); return disp.complete(x.pharm, dsp.id, { idempotencyKey: `suite-disp-${rxId}`, payments: [{ method: "CASH", amount: "5000.00" }] } as any); };
      for (const [i, d] of [drugB, drugC].entries()) { const r = await rxFor(peopleRx[10 + i]!, d.id, 2, "1 tablet daily", { refillsAllowed: 2, refillIntervalDays: 28 }); if (r) { await rxSvc.validate(x.pharm, r.id).catch(() => undefined); await dispense(r.id).catch(warn("dispense")); await prisma.prescription.update({ where: { id: r.id }, data: { nextRefillDueAt: new Date(Date.now() + (i === 0 ? 2 : -3) * DAY) } }).catch(() => undefined); if (i === 0) await prisma.customerAccount.count(); } } // DISPENSED with refills due
      const part = await rxFor(peopleRx[12]!, drugA.id, 10, "1 capsule daily"); if (part) { await rxSvc.validate(x.pharm, part.id).catch(() => undefined); await dispense(part.id, 4, "Only 4 capsules in stock at the time").catch(warn("partial")); } // PARTIALLY_DISPENSED
      const twice = await rxFor(peopleRx[13]!, drugB.id, 2, "1 tablet daily", { refillsAllowed: 1 }); if (twice) { await rxSvc.validate(x.pharm, twice.id).catch(() => undefined); await dispense(twice.id).catch(warn("dispense2")); await prisma.prescription.update({ where: { id: twice.id }, data: { nextRefillDueAt: new Date(Date.now() - DAY) } }); await refills.refill(x.pharm, twice.id, {}).catch(warn("refill")); } // refill granted -> VALIDATED
      await refills.runReminders(x.owner, 7).catch(warn("reminders"));
      // safety findings left open for the demo (BLOCKs): allergy, pregnancy X, renal, dose range
      const allergic = custs.find((c, i) => i % 9 === 0) ?? custs[0]!; await reg.update(x.owner, allergic.id, { allergies: ["penicillin"] }).catch(() => undefined);
      const preg = (await prisma.patientRef.findFirst({ where: { orgId: org, pregnant: true } })) ?? custs[3]!;
      for (const [cust, ing, directions] of [[allergic, "amoxicillin", "1 capsule three times daily"], [preg, "atorvastatin", "1 tablet at night"], [custs[7]!, "paracetamol", "2 tablets every 4 hours"]] as const) {
        const drug = withIng(ing); if (!drug) continue; const r = await rxFor(cust, drug.id, 2, directions); if (!r) continue; await rxSvc.validate(x.pharm, r.id).catch(() => undefined); await disp.create(x.pharm, { branchId: x.b1.id, prescriptionId: r.id, items: [{ drugId: drug.id, quantity: 2 }] } as any).catch(warn("safety-demo"));
      }
      // e-Rx style row (integrated tenant only: arrives from Kiorly with a consent token hash)
      if (x.mode === "INTEGRATED") { const e = await prisma.patientRef.create({ data: { orgId: org, externalId: "sub_demo_erx_1", customerNo: `CUS-${String(900000 + 1)}`, displayName: "Kiorex patient 0001", allergies: [] } }); const er = await prisma.prescription.create({ data: { orgId: org, branchId: x.b1.id, source: "KIORLY_E_RX", status: "RECEIVED", patientId: e.id, sourceEventId: `ev_suite_erx_1_${org.slice(-4)}`, sourceRxRef: "rx_suite_1", clinicRef: "clinic_demo_1", prescriberRef: "clin_demo_1", prescriberName: "Clinic prescriber demo1", prescriberLicenceNo: "KIORLY:clin_demo_1", prescriberVerifiedBadge: true, consentTokenHash: "0".repeat(64), consentVerifiedAt: new Date(), consentExpiresAt: new Date(Date.now() + 7 * DAY), issuedAt: new Date(), validUntil: new Date(Date.now() + 30 * DAY) } }); await prisma.prescriptionLine.create({ data: { prescriptionId: er.id, activeIngredient: "amoxicillin", strength: "500 mg", quantity: 1, directions: "1 capsule three times daily" } }); }
    }

  });
  // ---- controlled substances: stock, dispensing with ID capture, witnessed adjustment, discrepancies
  await step("controlled", async () => {
    const ctlDrug = (await prisma.stockLot.findFirst({ where: { orgId: org, branchId: x.b1.id, drug: { controlledSchedule: { in: ["SCHEDULE_3", "SCHEDULE_4"] } }, status: { in: ["AVAILABLE", "RECEIVED"] }, qtyOnHand: { gt: 10 } }, include: { drug: true } }));
    if (ctlDrug && custs.length > 20) {
      for (const [i, c] of custs.slice(20, 23).entries()) {
        try {
          const r = await rxFor(c, ctlDrug.drugId, 1, "1 at night when needed", { refillsAllowed: 0, validDays: 7 }); if (!r) continue;
          await rxSvc.validate(x.pharm, r.id); const dsp = await disp.create(x.pharm, { branchId: x.b1.id, prescriptionId: r.id, items: [{ drugId: ctlDrug.drugId, quantity: 1 }] } as any);
          await disp.captureControlledId(x.pharm, dsp.id, { nationalId: `2980101123${4000 + i}`.slice(0, 14), patientName: c.displayName });
          await disp.signOff(x.pharm, dsp.id, "Counselled on sedation and driving (demo)"); await disp.complete(x.pharm, dsp.id, { idempotencyKey: `suite-ctl-${org.slice(-4)}-${i}`, payments: [{ method: "CASH", amount: "500.00" }] } as any);
        } catch (e) { warn("controlled")(e); }
      }
      const w = await approvals.witness(x.pharm, x.witnessCreds).catch(() => null);
      if (w) { await inv.adjust(x.pharm, ctlDrug.id, -1, "Broken ampoule during stock check (demo)", undefined, w, "DAMAGE").catch(warn("ctl-adjust")); }
      if (w) { const a = await ctl.audit(x.pharm, { branchId: x.b1.id, drugId: ctlDrug.drugId, countedQty: ctlDrug.qtyOnHand - 4, notes: "Monthly physical count (demo)", witness: w }).catch(warn("ctl-audit")); void a; }
    }

  });
  // ---- purchasing: suppliers, ledger aging, POs with cost variance, RFQs
  await step("purchasing", async () => {
    const sups = await prisma.supplier.findMany({ where: { orgId: org }, take: 3, orderBy: { createdAt: "asc" } });
    if (sups.length >= 2) {
      for (const [i, s] of sups.slice(0, 2).entries()) { for (const [amt, ago] of [["4200.00", 95], ["2650.00", 48], ["1800.00", 12]] as const) await prisma.supplierLedgerEntry.create({ data: { orgId: org, supplierId: s.id, type: "INVOICE", amount: amt, note: `Demo invoice (${ago} days ago)`, createdBy: x.owner.userId, createdAt: new Date(Date.now() - (ago + i * 3) * DAY) } }); await prisma.supplierLedgerEntry.create({ data: { orgId: org, supplierId: s.id, type: "PAYMENT", amount: "-3000.00", note: "Bank transfer", createdBy: x.owner.userId, createdAt: new Date(Date.now() - 20 * DAY) } }); await prisma.supplier.update({ where: { id: s.id }, data: { balance: { increment: 4200 + 2650 + 1800 - 3000 }, creditLimit: i === 0 ? 6000 : undefined } }); }
      const pd = sellable[8]; if (pd) { const po = await suppliers.createPo(x.owner, { branchId: x.b1.id, supplierId: sups[0]!.id, lines: [{ drugId: pd.id, qtyOrdered: 30, unitCost: "10.00" }], notes: "SUITE cost-variance demo" }).catch(warn("po")); if (po) { await suppliers.sendPo(x.owner, po.id, "EMAIL").catch(() => undefined); await receiving.receive(x.owner, { branchId: x.b1.id, supplierId: sups[0]!.id, purchaseOrderId: po.id, invoiceNo: "SUITE-VAR-1", lines: [{ drugId: pd.id, lotNumber: `SV${org.slice(-3)}1`, expiryDate: iso(365), quantity: 30, unitCost: "12.40" }] } as any).catch(warn("var-receipt")); } }
      const ds = sellable.slice(9, 12); if (ds.length === 3) {
        const r1 = await rfq.create(x.owner, x.b1.id, { notes: "Monthly OTC restock", dueAt: new Date(Date.now() + 3 * DAY).toISOString(), lines: ds.map((d, i) => ({ drugId: d.id, qty: 40 + i * 10 })), supplierIds: sups.map((s) => s.id) }).catch(warn("rfq"));
        if (r1) { await rfq.send(x.owner, r1.id).catch(() => undefined); const rr = await rfq.get(org, r1.id); for (const [k, s] of sups.entries()) await rfq.recordQuote(x.owner, r1.id, s.id, { lines: rr.lines.map((l) => ({ rfqLineId: l.id, unitPrice: (18 + k * 1.5 + (l.qty % 7)).toFixed(2) })), leadTimeDays: 2 + k }).catch(() => undefined); await rfq.award(x.owner, r1.id, { mode: "CHEAPEST_PER_LINE" }).catch(warn("rfq-award")); }
        const r2 = await rfq.create(x.owner, x.b1.id, { notes: "Quotes pending", lines: ds.slice(0, 2).map((d) => ({ drugId: d.id, qty: 25 })), supplierIds: sups.map((s) => s.id) }).catch(() => null); if (r2) { await rfq.send(x.owner, r2.id).catch(() => undefined); const rr = await rfq.get(org, r2.id); await rfq.recordQuote(x.owner, r2.id, sups[0]!.id, { lines: rr.lines.map((l) => ({ rfqLineId: l.id, unitPrice: "21.00" })) }).catch(() => undefined); }
      }
    }
    await analytics.autoReorder(x.owner, x.b1.id, { days: 30, safetyDays: 3, reviewDays: 14, overwrite: false }).catch(warn("auto-reorder"));

  });
  // ---- insurer claims (only where the claims capability exists: CHAIN / add-on)
  await step("claims", async () => {
    const claimSales = await prisma.sale.findMany({ where: { orgId: org, status: "COMPLETED" }, take: 8, orderBy: { soldAt: "desc" } });
    if (!solo && claimSales.length >= 8) {
      const mk = async (i: number, insurer: string, amount: string) => claims.create(x.owner, x.b1.id, { saleId: claimSales[i]!.id, insurerName: insurer, memberRef: `MEM-${4000 + i}`, policyNo: `POL-${100 + i}`, amountClaimed: amount, patientCopay: "20.00" } as any).catch(warn("claim"));
      const cs = await Promise.all([mk(0, "MedCare Insurance", "1250.00"), mk(1, "MedCare Insurance", "430.00"), mk(2, "HealthPlus", "890.00"), mk(3, "HealthPlus", "310.00"), mk(4, "Delta Health Plan", "2100.00"), mk(5, "Delta Health Plan", "150.00"), mk(6, "MedCare Insurance", "700.00"), mk(7, "Nile Insurance", "99.00")]);
      const ids = cs.filter(Boolean).map((c: any) => c.id as string);
      if (ids.length >= 8) {
        await claims.batchSubmit(x.owner, ids.slice(0, 7), "BATCH-DEMO-01").catch(warn("batch"));
        await claims.approve(x.owner, ids[0]!, { approvedAmount: "1125.00", note: "10% co-insurance applied" }).catch(warn("approve")); await claims.pay(x.owner, ids[0]!, { amount: "600.00", reference: "BANK-8841" }).catch(warn("pay1")); await claims.pay(x.owner, ids[0]!, { amount: "525.00", reference: "BANK-8902" }).catch(warn("pay2"));
        await claims.approve(x.owner, ids[1]!, {}).catch(warn("approve2")); await claims.reject(x.owner, ids[2]!, "Policy expired on the date of service").catch(warn("reject"));
        await claims.approve(x.owner, ids[4]!, { approvedAmount: "1890.00" }).catch(warn("approve4")); await claims.pay(x.owner, ids[4]!, { amount: "1000.00", reference: "BANK-9100" }).catch(warn("pay4"));
        await prisma.insurerClaim.update({ where: { id: ids[3]! }, data: { submittedAt: new Date(Date.now() - 45 * DAY) } }).catch(() => undefined);
      }
    }
  });
  await alerts.scan(org).catch(warn("alerts"));
  void inv; void iso;
}

if (require.main === module) void seedSuite().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
