/**
 * Kiorly Team (mobile staff app) demo seed: one tenant per plan so the plan gate and the upgrade path are demonstrable (DEV ONLY).
 *   ENTERPRISE  "Kiorly Demo Pharmacy" (CHAIN edition, org_demo_kiorly)     owner|pharmacist|cashier|manager@demo.kiorly.local
 *   PRO         "Kiorly Solo Pharmacy (DEMO)" (org_demo_solo)               solo.owner|pharmacist|manager|cashier|assistant@demo.kiorly.local
 *   BASIC       "Kiorly Corner Pharmacy (DEMO, Lite)" (org_demo_basic, LITE) owner.basic|pharmacist.basic|cashier.basic@demo.kiorly.local
 * Also creates open safety alerts (controlled-drug discrepancy awaiting a witness, one countersigned) in every tenant and a few inbox messages.
 *   npm run seed:mobile -w api        idempotent; run after `seed` (and `seed:suite` for the PRO tenant)
 */
import "reflect-metadata";
import { PrismaClient, type StaffRole } from "../../src/generated/prisma/client";
import { createPgAdapter } from "../../src/prisma/pg-adapter";
import { loadEnv } from "../../src/config/env";
import { assertDemoSeedAllowed } from "../../src/common/demo-seed-guard";
import { hashPassword } from "../../src/auth/password";
import { marketToday } from "../../src/common/dates";

const DEMO_PASSWORD = "Demo@12345";
const DAY = 86_400_000;

async function main() {
  assertDemoSeedAllowed("Kiorly Pharmacy Kiorly Team (mobile) demo");
  loadEnv();
  const prisma = new PrismaClient({ adapter: createPgAdapter() });
  try {
    const hash = await hashPassword(DEMO_PASSWORD);
    const mkStaff = async (orgId: string, email: string, role: StaffRole, displayName: string, extra: object = {}) =>
      (await prisma.staffUser.findUnique({ where: { email } })) ?? prisma.staffUser.create({ data: { orgId, email, passwordHash: hash, displayName, role, ...extra } });

    // BASIC (LITE) tenant for the upgrade path ----------------------------------------------------------
    let basic = await prisma.tenant.findUnique({ where: { externalOrgId: "org_demo_basic" } });
    basic ??= await prisma.tenant.create({ data: { name: "Kiorly Corner Pharmacy (DEMO, Lite)", externalOrgId: "org_demo_basic", edition: "LITE", marketCode: "EG", onboardedAt: new Date(), settings: { mode: "STANDALONE", currency: "EGP", defaultLocale: "ar", languages: ["ar", "en"] } } });
    const bb = (await prisma.branch.findFirst({ where: { orgId: basic.id, code: "CORNER" } })) ?? (await prisma.branch.create({ data: { orgId: basic.id, name: "Corner Branch", code: "CORNER", licenceNo: "EDA-DEMO-BASIC-1", address: "Maadi, Cairo" } }));
    await mkStaff(basic.id, "owner.basic@demo.kiorly.local", "OWNER", "Dr. Basic Owner", { pharmacistLicenceNo: "SYN-2001" });
    await mkStaff(basic.id, "pharmacist.basic@demo.kiorly.local", "PHARMACIST", "Ph. Hala Basic", { branchId: bb.id, pharmacistLicenceNo: "SYN-2002" });
    await mkStaff(basic.id, "cashier.basic@demo.kiorly.local", "CASHIER", "Karim Cashier (Basic)", { branchId: bb.id });

    const targets: Array<{ externalOrgId: string; reporter: string; witness: string; branchCode?: string }> = [
      { externalOrgId: "org_demo_kiorly", reporter: "pharmacist@demo.kiorly.local", witness: "manager@demo.kiorly.local", branchCode: "MAIN" },
      { externalOrgId: "org_demo_solo", reporter: "solo.pharmacist@demo.kiorly.local", witness: "solo.manager@demo.kiorly.local", branchCode: "SOLO" },
      { externalOrgId: "org_demo_basic", reporter: "pharmacist.basic@demo.kiorly.local", witness: "owner.basic@demo.kiorly.local", branchCode: "CORNER" },
    ];
    for (const t of targets) {
      const tenant = await prisma.tenant.findUnique({ where: { externalOrgId: t.externalOrgId } });
      if (!tenant) { console.log(`seed:mobile skip ${t.externalOrgId} (tenant missing - run the earlier seeds)`); continue; }
      const branch = await prisma.branch.findFirst({ where: { orgId: tenant.id, code: t.branchCode } });
      const reporter = await prisma.staffUser.findUnique({ where: { email: t.reporter } });
      const witness = await prisma.staffUser.findUnique({ where: { email: t.witness } });
      if (!branch || !reporter || !witness) { console.log(`seed:mobile skip ${t.externalOrgId} (branch/staff missing)`); continue; }
      const sk = `kiorly-team-demo:cd:${tenant.id}`; // stable idempotency key
      // Demo DBs seeded before the 23 Nov 2026 rename hold the drug under the old key: rewrite it in place so no duplicate drug is created.
      const legacySk = `kiorly-work-demo:cd:${tenant.id}`;
      if (!(await prisma.drug.findUnique({ where: { sourceKey: sk } }))) await prisma.drug.updateMany({ where: { sourceKey: legacySk }, data: { sourceKey: sk } });
      const drug = (await prisma.drug.findUnique({ where: { sourceKey: sk } })) ?? (await prisma.drug.create({ data: { orgId: tenant.id, sourceKey: sk, brandName: "Morphicure 10 mg (DEMO)", brandNameAr: "مورفيكيور 10 ملجم (تجريبي)", activeIngredient: "morphine sulfate", strength: "10 mg", dosageForm: "ampoule", packSize: "10", rxOnly: true, controlledSchedule: "SCHEDULE_2", gtin: `62290009${tenant.id.slice(-6).replace(/\D/g, "0").padEnd(6, "0")}`.slice(0, 14) } }));
      const lotNo = "KT-CD-001";
      await prisma.stockLot.updateMany({ where: { orgId: tenant.id, branchId: branch.id, drugId: drug.id, lotNumber: "KW-CD-001" }, data: { lotNumber: lotNo } }); // pre-rename demo lots
      if (!(await prisma.stockLot.findFirst({ where: { orgId: tenant.id, branchId: branch.id, drugId: drug.id, lotNumber: lotNo } }))) {
        await prisma.stockLot.create({ data: { orgId: tenant.id, branchId: branch.id, drugId: drug.id, lotNumber: lotNo, expiryDate: new Date(marketToday().getTime() + 300 * DAY), status: "AVAILABLE", qtyOnHand: 38, unitCost: "120.00" } });
      }
      // open discrepancy awaiting a witness + one already countersigned
      const open = await prisma.controlledDiscrepancy.findMany({ where: { orgId: tenant.id, drugId: drug.id, status: "OPEN" }, orderBy: { createdAt: "asc" } });
      if (open.length === 0) {
        await prisma.controlledDiscrepancy.create({ data: { orgId: tenant.id, branchId: branch.id, drugId: drug.id, expectedQty: 40, countedQty: 38, difference: -2, notes: "Kiorly Team demo: 2 ampoules unaccounted at shift change", reportedBy: reporter.id } });
        const signed = await prisma.controlledDiscrepancy.create({ data: { orgId: tenant.id, branchId: branch.id, drugId: drug.id, expectedQty: 40, countedQty: 39, difference: -1, notes: "Kiorly Team demo: 1 ampoule, witnessed", reportedBy: reporter.id, createdAt: new Date(Date.now() - 3600_000) } });
        await prisma.controlledCountersign.create({ data: { orgId: tenant.id, discrepancyId: signed.id, witnessId: witness.id, note: "Counted together" } });
      }
      await prisma.pushMessage.updateMany({ where: { orgId: tenant.id, title: "Welcome to Kiorly Team", titleAr: "مرحبا بك في كيورلي ورك" }, data: { titleAr: "مرحبا بك في كيورلي تيم" } }); // pre-rename Arabic title
      // inbox seed (idempotent by title)
      for (const u of await prisma.staffUser.findMany({ where: { orgId: tenant.id, active: true }, select: { id: true } })) {
        const has = await prisma.pushMessage.count({ where: { userId: u.id, title: "Welcome to Kiorly Team" } });
        if (has) continue;
        await prisma.pushMessage.createMany({ data: [
          { orgId: tenant.id, userId: u.id, kind: "GENERAL", title: "Welcome to Kiorly Team", titleAr: "مرحبا بك في كيورلي تيم", body: "Your pharmacy in your pocket: verify prescriptions, scan stock, countersign controlled drugs.", bodyAr: "صيدليتك في جيبك: راجع الوصفات وامسح المخزون ووقّع على الأدوية المراقبة.", provider: "mock", deliveredAt: new Date(), data: { seed: true } },
          { orgId: tenant.id, userId: u.id, kind: "SAFETY", title: "Controlled-drug discrepancy", titleAr: "فرق في دواء مراقب", body: "Morphicure 10 mg (DEMO): expected 40, counted 38. Countersign required.", bodyAr: "مورفيكيور 10 ملجم: المتوقع 40 والمعدود 38. مطلوب توقيع شاهد.", provider: "mock", deliveredAt: new Date(), data: { seed: true } },
        ] });
      }
      console.log(`seed:mobile ok - ${tenant.name} (${tenant.edition})`);
    }
    console.log(`Kiorly Team logins (password ${DEMO_PASSWORD}, DEV ONLY): ENTERPRISE owner@/pharmacist@/cashier@/manager@demo.kiorly.local - PRO solo.owner@/solo.pharmacist@/solo.manager@/solo.cashier@demo.kiorly.local - BASIC owner.basic@/pharmacist.basic@/cashier.basic@demo.kiorly.local`);
  } finally { await prisma.$disconnect(); }
}
void main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
