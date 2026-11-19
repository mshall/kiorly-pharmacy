/**
 * Synthetic demo seed (idempotent). NOT real data: brand names/GTINs are generated; the interaction/controlled-schedule flags are
 * placeholders pending clinical-pharmacist and regulatory review (Docs/NEEDS_HUMAN.md NH-PH-009/010). Refuses to run in production.
 *
 *   npm run seed            # global catalogue + "Kiorly Demo Pharmacy" (CHAIN edition, 2 branches)
 * Demo logins (local only): owner@demo.kiorly.local / pharmacist@demo.kiorly.local / cashier@demo.kiorly.local / manager@demo.kiorly.local — password Demo@12345
 */
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { loadEnv } from "../src/config/env";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { CatalogueService, type DrugInput } from "../src/modules/catalogue/catalogue.service";
import { PriceService } from "../src/modules/catalogue/price.service";
import { ReceivingService } from "../src/modules/inventory/receiving.service";
import { SuppliersService } from "../src/modules/suppliers/suppliers.service";
import { InventoryService } from "../src/modules/inventory/inventory.service";
import { SalesService } from "../src/modules/pos/sales.service";
import { ShiftsService } from "../src/modules/pos/shifts.service";
import { CustomersService } from "../src/modules/pos/customers.service";
import { PrescriptionsService } from "../src/modules/prescriptions/prescriptions.service";
import { MarketplaceService } from "../src/modules/marketplace/marketplace.service";
import { hashPassword } from "../src/auth/password";
import { seal } from "../src/common/secret-box";
import { PARTNER_DEV_DEFAULTS } from "@kiorex/contracts";
import { marketToday } from "../src/common/dates";
import type { AuthUser } from "../src/auth/auth-user";

export const DEMO_PASSWORD = "Demo@12345";

type Base = { ing: string; ar: string; strength: string; form: string; pack: string; price: number; rx?: boolean; schedule?: DrugInput["controlledSchedule"]; cold?: boolean; brands: string[] };
const BASES: Base[] = [
  { ing: "paracetamol", ar: "باراسيتامول", strength: "500 mg", form: "tablet", pack: "20", price: 25, brands: ["Paracetol", "Febrimol"] },
  { ing: "ibuprofen", ar: "ايبوبروفين", strength: "400 mg", form: "tablet", pack: "30", price: 45, brands: ["Ibuprex", "Brufcare"] },
  { ing: "diclofenac", ar: "ديكلوفيناك", strength: "50 mg", form: "tablet", pack: "20", price: 38, brands: ["Diclorex", "Voltacure"] },
  { ing: "amoxicillin", ar: "اموكسيسيلين", strength: "500 mg", form: "capsule", pack: "16", price: 70, rx: true, brands: ["Amoxirex", "Moxicure"] },
  { ing: "amoxicillin + clavulanic acid", ar: "اموكسيسيلين + كلافيولانيك", strength: "1000 mg", form: "tablet", pack: "14", price: 160, rx: true, brands: ["Clavirex", "Augmacure"] },
  { ing: "azithromycin", ar: "ازيثروميسين", strength: "500 mg", form: "tablet", pack: "3", price: 95, rx: true, brands: ["Azithrex", "Zithocure"] },
  { ing: "cefixime", ar: "سيفكسيم", strength: "400 mg", form: "capsule", pack: "5", price: 110, rx: true, brands: ["Cefixrex", "Suprcure"] },
  { ing: "ciprofloxacin", ar: "سيبروفلوكساسين", strength: "500 mg", form: "tablet", pack: "10", price: 82, rx: true, brands: ["Ciprorex", "Floxcure"] },
  { ing: "metformin", ar: "ميتفورمين", strength: "850 mg", form: "tablet", pack: "50", price: 48, rx: true, brands: ["Metforex", "Glucocure"] },
  { ing: "atorvastatin", ar: "اتورفاستاتين", strength: "20 mg", form: "tablet", pack: "30", price: 120, rx: true, brands: ["Atorex", "Lipicure"] },
  { ing: "simvastatin", ar: "سيمفاستاتين", strength: "20 mg", form: "tablet", pack: "30", price: 90, rx: true, brands: ["Simvarex"] },
  { ing: "amlodipine", ar: "املوديبين", strength: "5 mg", form: "tablet", pack: "30", price: 55, rx: true, brands: ["Amlorex", "Norvcure"] },
  { ing: "enalapril", ar: "انالابريل", strength: "10 mg", form: "tablet", pack: "20", price: 40, rx: true, brands: ["Enalrex"] },
  { ing: "warfarin", ar: "وارفارين", strength: "5 mg", form: "tablet", pack: "28", price: 36, rx: true, brands: ["Warfarex"] },
  { ing: "aspirin", ar: "اسبرين", strength: "81 mg", form: "tablet", pack: "30", price: 30, brands: ["Aspirex", "Cardicure"] },
  { ing: "omeprazole", ar: "اوميبرازول", strength: "20 mg", form: "capsule", pack: "14", price: 60, brands: ["Omerex", "Losecure"] },
  { ing: "loratadine", ar: "لوراتادين", strength: "10 mg", form: "tablet", pack: "10", price: 28, brands: ["Loratrex", "Claricure"] },
  { ing: "cetirizine", ar: "سيتريزين", strength: "10 mg", form: "tablet", pack: "10", price: 32, brands: ["Cetirex"] },
  { ing: "salbutamol", ar: "سالبيوتامول", strength: "100 mcg", form: "inhaler", pack: "1", price: 65, rx: true, brands: ["Salbucure", "Ventorex"] },
  { ing: "vitamin c", ar: "فيتامين سي", strength: "1000 mg", form: "tablet", pack: "20", price: 55, brands: ["Cevirex", "Redoxcure"] },
  { ing: "oral rehydration salts", ar: "املاح معالجة الجفاف", strength: "20.5 g", form: "powder", pack: "5", price: 20, brands: ["Rehydrex"] },
  { ing: "insulin glargine", ar: "انسولين جلارجين", strength: "100 IU/ml", form: "injection", pack: "1", price: 520, rx: true, cold: true, brands: ["Glargirex"] },
  { ing: "insulin aspart", ar: "انسولين اسبارت", strength: "100 IU/ml", form: "injection", pack: "5", price: 610, rx: true, cold: true, brands: ["Aspartcure"] },
  { ing: "tramadol", ar: "ترامادول", strength: "50 mg", form: "capsule", pack: "20", price: 75, rx: true, schedule: "SCHEDULE_3", brands: ["Tramorex"] },
  { ing: "morphine", ar: "مورفين", strength: "10 mg", form: "injection", pack: "5", price: 140, rx: true, schedule: "SCHEDULE_2", brands: ["Morphicure"] },
  { ing: "alprazolam", ar: "البرازولام", strength: "0.5 mg", form: "tablet", pack: "30", price: 60, rx: true, schedule: "SCHEDULE_4", brands: ["Alprarex"] },
  { ing: "sertraline", ar: "سيرترالين", strength: "50 mg", form: "tablet", pack: "30", price: 150, rx: true, brands: ["Sertrarex"] },
  { ing: "sildenafil", ar: "سيلدينافيل", strength: "50 mg", form: "tablet", pack: "4", price: 130, rx: true, brands: ["Sildarex"] },
];

const gtin = (n: number) => `622${String(n).padStart(10, "0")}${n % 10}`;

export async function seed(): Promise<{ tenantId: string }> {
  if (process.env.NODE_ENV === "production") throw new Error("Refusing to seed demo data in production");
  loadEnv();
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ["error"] });
  try {
    const prisma = app.get(PrismaService);
    const catalogue = app.get(CatalogueService);

    // 1) global synthetic drug master (idempotent by sourceKey)
    let n = 1000;
    const records: DrugInput[] = [];
    for (const b of BASES) for (const [i, brand] of b.brands.entries()) {
      n++;
      records.push({ sourceKey: `synthetic-eg:${n}`, brandName: `${brand} ${b.strength.replace(/\s/g, "")}`, brandNameAr: `${b.ar} ${i + 1}`, activeIngredient: b.ing, strength: b.strength, dosageForm: b.form, packSize: b.pack, gtin: gtin(n), manufacturer: "Synthetic Pharma", rxOnly: b.rx ?? false, controlledSchedule: b.schedule ?? "NONE", coldChain: b.cold ?? false });
    }
    const seeded = await catalogue.importDrugs(null, records);

    // 2) demo tenant (idempotent)
    let tenant = await prisma.tenant.findUnique({ where: { externalOrgId: "org_demo_kiorly" } });
    const demoHash = await hashPassword(DEMO_PASSWORD);
    if (!tenant) {
      tenant = await prisma.tenant.create({ data: { name: "Kiorly Demo Pharmacy", externalOrgId: "org_demo_kiorly", edition: "CHAIN", marketCode: "EG", onboardedAt: new Date(), settings: { ownerPhone: "+201000000000", defaultLocale: "ar", addOns: ["insurer_claims"], receiptFooter: "شكراً لزيارتكم" } } });
    }
    const org = tenant.id;
    const b1 = (await prisma.branch.findFirst({ where: { orgId: org, code: "MAIN" } })) ?? (await prisma.branch.create({ data: { orgId: org, name: "Maadi Branch", code: "MAIN", licenceNo: "EDA-DEMO-001", address: "Road 9, Maadi, Cairo" } }));
    const b2 = (await prisma.branch.findFirst({ where: { orgId: org, code: "NASR" } })) ?? (await prisma.branch.create({ data: { orgId: org, name: "Nasr City Branch", code: "NASR", licenceNo: "EDA-DEMO-002" } }));
    const mkStaff = async (key: string, role: "OWNER" | "PHARMACIST" | "CASHIER" | "BRANCH_MANAGER" | "CHAIN_OPS", name: string, extra: object = {}) => {
      const email = `${key}@demo.kiorly.local`;
      return (await prisma.staffUser.findUnique({ where: { email } })) ?? prisma.staffUser.create({ data: { orgId: org, email, passwordHash: demoHash, displayName: name, role, ...extra } });
    };
    const owner = await mkStaff("owner", "OWNER", "Dr. Demo Owner", { pharmacistLicenceNo: "SYN-0001" });
    const pharmacist = await mkStaff("pharmacist", "PHARMACIST", "Ph. Salma Demo", { pharmacistLicenceNo: "SYN-0002", branchId: b1.id });
    const cashier = await mkStaff("cashier", "CASHIER", "Omar Cashier", { branchId: b1.id });
    await mkStaff("manager", "BRANCH_MANAGER", "Mona Manager", { branchId: b1.id });
    await mkStaff("chain", "CHAIN_OPS", "Chain Ops");

    // DEV registration of Kiorex as a machine client of this tenant (kiorex-contracts PARTNER_DEV_DEFAULTS; local only, never in production).
    if (process.env.NODE_ENV !== "production") {
      const d = PARTNER_DEV_DEFAULTS.pharmacy;
      await prisma.integrationClient.upsert({
        where: { key: d.clientKey },
        create: { orgId: org, key: d.clientKey, secretEnc: seal(d.clientSecret), webhookSecretEnc: seal(d.webhookSecret), kiorexBaseUrl: process.env.KIOREX_BASE_URL ?? "http://localhost:4000" },
        update: { orgId: org, secretEnc: seal(d.clientSecret), webhookSecretEnc: seal(d.webhookSecret), active: true },
      });
      console.log(`seed: dev Kiorex client ${d.clientKey} registered (secrets in INTEGRATION.md)`);
    }
    await prisma.branchMarketplaceSetting.upsert({ where: { branchId: b1.id }, create: { orgId: org, branchId: b1.id, optedIn: true, prepMinutes: 25, slaMinutes: 10 }, update: { optedIn: true } });
    if ((await prisma.stockLot.count({ where: { orgId: org } })) > 0) {
      console.log(`seed: demo tenant already has stock; global drugs created=${seeded.created} updated=${seeded.updated}`);
      return { tenantId: org };
    }
    const au = (u: { id: string; role: AuthUser["role"]; displayName: string; branchId: string | null; pharmacistLicenceNo: string | null }): AuthUser => ({ userId: u.id, orgId: org, role: u.role, displayName: u.displayName, branchId: u.branchId, market: "EG", edition: "CHAIN", pharmacistLicenceNo: u.pharmacistLicenceNo, mfa: false });
    const ownerU = au(owner), cashierU = au(cashier), pharmU = au(pharmacist);

    // 3) prices (central price book), suppliers, stock with a realistic expiry spread
    const drugs = await prisma.drug.findMany({ where: { sourceKey: { startsWith: "synthetic-eg:" } }, orderBy: { sourceKey: "asc" } });
    const prices = app.get(PriceService);
    const priceByIng = new Map(BASES.map((b) => [b.ing, b.price]));
    await prices.bulkUpdate(org, owner.id, new Date("2026-01-01"), drugs.map((d) => ({ drugId: d.id, price: (((priceByIng.get(d.activeIngredient) ?? 50) * (d.brandName.includes("cure") ? 1.1 : 1)).toFixed(2)) })));
    const suppliers = app.get(SuppliersService);
    const sA = await suppliers.create(org, { name: "Nile Pharma Distribution", phone: "+201001110001", email: "orders@nile-pharma.test", paymentTerms: "30 days", creditLimit: "250000" });
    const sB = await suppliers.create(org, { name: "Delta Medical Supplies", phone: "+201001110002", email: "sales@delta-med.test", paymentTerms: "15 days", creditLimit: "120000" });
    const receiving = app.get(ReceivingService);
    const today = marketToday();
    const iso = (days: number) => new Date(today.getTime() + days * 86_400_000).toISOString().slice(0, 10);
    const expiries = [600, 420, 240, 150, 80, 25];
    let lotNo = 1;
    for (const [idx, d] of drugs.entries()) {
      const sup = idx % 2 ? sA : sB;
      const lines = expiries.slice(0, 2 + (idx % 3)).map((e, k) => ({ drugId: d.id, lotNumber: `L${String(lotNo++).padStart(5, "0")}`, expiryDate: iso(e), quantity: 10 + ((idx * 7 + k * 5) % 40), unitCost: ((priceByIng.get(d.activeIngredient) ?? 50) * 0.7).toFixed(2), ...(d.coldChain ? { temperatureC: 5 } : {}) }));
      await receiving.receive(ownerU, { branchId: b1.id, supplierId: sup.id, invoiceNo: `INV-${1000 + idx}`, lines });
      if (idx % 4 === 0) await receiving.receive(ownerU, { branchId: b2.id, supplierId: sup.id, invoiceNo: `INV-B2-${idx}`, lines: [{ drugId: d.id, lotNumber: `N${String(lotNo++).padStart(5, "0")}`, expiryDate: iso(300), quantity: 25, unitCost: ((priceByIng.get(d.activeIngredient) ?? 50) * 0.7).toFixed(2), ...(d.coldChain ? { temperatureC: 4 } : {}) }] });
    }
    // an already-expired lot (stock seeded directly; DB blocks selling it) and a quarantined lot for the demo
    const paracetamol = drugs.find((d) => d.activeIngredient === "paracetamol")!;
    const expiredLot = await prisma.stockLot.create({ data: { orgId: org, branchId: b1.id, drugId: paracetamol.id, lotNumber: "EXPIRED-DEMO", expiryDate: new Date(today.getTime() - 5 * 86_400_000), unitCost: 15, status: "EXPIRED", blockedReason: "Expired", blockedAt: new Date() } });
    await prisma.stockMovement.create({ data: { orgId: org, branchId: b1.id, lotId: expiredLot.id, type: "RECEIPT", qtyDelta: 8, performedBy: owner.id, reason: "Demo: expired stock awaiting write-off" } });
    const inv = app.get(InventoryService);
    const quarLot = await prisma.stockLot.findFirstOrThrow({ where: { orgId: org, branchId: b1.id, drugId: drugs.find((d) => d.activeIngredient === "omeprazole")!.id } });
    await inv.quarantine(ownerU, quarLot.id, "Damaged outer cartons (demo)");
    // reorder policies
    for (const d of drugs.slice(0, 14)) await inv.setReorderPolicy(org, b1.id, { drugId: d.id, minQty: 15, maxQty: 60, supplierId: sA.id });

    // 4) POS history, a customer with credit, an Rx waiting, a Kiorex order inbox item
    const shifts = app.get(ShiftsService);
    const sales = app.get(SalesService);
    const shift = await shifts.open(cashierU, b1.id, "500.00");
    const otc = drugs.filter((d) => !d.rxOnly && d.controlledSchedule === "NONE" && !d.coldChain);
    for (let i = 0; i < 12; i++) {
      const d = otc[i % otc.length]!;
      const cart = [{ drugId: d.id, quantity: 1 + (i % 3) }];
      const total = sales.totals(await sales.priceCart(prisma, cashierU, b1.id, cart, new Date(), false)).total.toFixed(2);
      await sales.checkout(cashierU, { branchId: b1.id, shiftId: shift.id, idempotencyKey: `seed-sale-${i}`, lines: cart, payments: [{ method: i % 3 === 0 ? "CARD" : "CASH", amount: total }] });
    }
    const customers = app.get(CustomersService);
    await customers.create(cashierU, { displayName: "Um Ahmed (credit)", phone: "+201011112222", creditLimit: "500.00" });
    const rxDrug = drugs.find((d) => d.activeIngredient === "amoxicillin")!;
    const rx = app.get(PrescriptionsService);
    await rx.intakePaper(pharmU, { branchId: b1.id, patient: { displayName: "Hassan Demo", phone: "+201022223333", allergies: ["sulfonamide"] }, prescriberName: "Dr. Demo Clinician", prescriberLicenceNo: "SYN-MD-77", lines: [{ drugId: rxDrug.id, quantity: 1, directions: "1 capsule every 8 hours for 7 days" }] });
    const market = app.get(MarketplaceService);
    await prisma.branchMarketplaceSetting.upsert({ where: { branchId: b1.id }, create: { orgId: org, branchId: b1.id, optedIn: true, prepMinutes: 25, slaMinutes: 10 }, update: { optedIn: true } });
    const demoPrice = (await prices.priceAt(org, b1.id, otc[0]!.id))!.toFixed(2);
    await market.ingest(org, { orderId: "kx-demo-order-1", branchId: b1.id, customer: { name: "Amira Demo", phone: "+201033334444", address: "Zamalek, Cairo" }, prepaid: true, lines: [{ sku: otc[0]!.id, quantity: 2, unitPrice: demoPrice }] });
    console.log(`seed: ok — ${drugs.length} synthetic drugs, tenant ${org}, login owner@demo.kiorly.local / ${DEMO_PASSWORD}`);
    return { tenantId: org };
  } finally {
    await app.close();
  }
}

if (require.main === module) void seed().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
