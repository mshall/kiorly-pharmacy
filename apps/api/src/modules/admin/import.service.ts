import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError } from "../../common/errors";

import { parseCsv } from "../../common/csv";
import type { AuthUser } from "../../auth/auth-user";
import { CatalogueService, type DrugInput } from "../catalogue/catalogue.service";
import { ReceivingService } from "../inventory/receiving.service";
import { CustomerRegistryService } from "../customers/customer-registry.service";
import { SuppliersService } from "../suppliers/suppliers.service";

export const IMPORT_KINDS = ["drugs", "stock", "customers", "suppliers"] as const;
export type ImportKind = (typeof IMPORT_KINDS)[number];
export interface RowResult { row: number; status: "OK" | "SKIPPED" | "ERROR"; message?: string }
export interface ImportReport { kind: ImportKind; dryRun: boolean; total: number; ok: number; skipped: number; errors: number; created?: number; updated?: number; rows: RowResult[] }

const TEMPLATES: Record<ImportKind, { headers: string[]; sample: string[] }> = {
  drugs: { headers: ["brandName", "brandNameAr", "activeIngredient", "strength", "dosageForm", "packSize", "gtin", "price", "category", "rxOnly", "controlledSchedule", "coldChain", "manufacturer"], sample: ["Paracetol 500", "باراسيتول 500", "paracetamol", "500 mg", "tablet", "20", "6221234567890", "25.00", "Analgesics", "false", "NONE", "false", "Nile Pharma"] },
  stock: { headers: ["gtin", "brandName", "lotNumber", "expiryDate", "quantity", "unitCost", "branchCode", "supplierName", "temperatureC"], sample: ["6221234567890", "", "L2026A", "2028-06-30", "40", "18.50", "MAIN", "Nile Pharma Distribution", ""] },
  customers: { headers: ["displayName", "phone", "email", "gender", "dateOfBirth", "address", "allergies", "chronicConditions"], sample: ["Mona Hassan", "01012345678", "mona@example.com", "F", "1990-05-01", "Maadi, Cairo", "penicillin;sulfa", "diabetes"] },
  suppliers: { headers: ["name", "phone", "email", "paymentTerms", "creditLimit", "leadTimeDays"], sample: ["Nile Pharma Distribution", "+201001110001", "orders@nile.test", "30 days", "250000", "2"] },
};
export const importTemplate = (k: ImportKind) => { const t = TEMPLATES[k]; return `﻿${t.headers.join(",")}\r\n${t.sample.join(",")}\r\n`; };

const bool = (v: string | undefined) => /^(true|yes|y|1|نعم)$/i.test((v ?? "").trim());
const list = (v: string | undefined) => (v ?? "").split(/[;|،]/).map((x) => x.trim()).filter(Boolean);
/** 2028-06-30 | 30/06/2028 | 30-06-2028 -> ISO date, or null. */
export function parseDate(v: string): string | null {
  const s = v.trim();
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) { const d = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(s); if (d) m = [d[0], d[3]!, d[2]!.padStart(2, "0"), d[1]!.padStart(2, "0")] as unknown as RegExpExecArray; }
  if (!m) return null;
  const iso = `${m[1]}-${m[2]}-${m[3]}`;
  return Number.isNaN(new Date(`${iso}T00:00:00Z`).getTime()) ? null : iso;
}
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, "-").replace(/^-|-$/g, "");

/** CSV data import (drugs, opening stock, customers, suppliers) with a dry-run that validates every row first. Nothing is applied when any row has an error. */
@Injectable()
export class ImportService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService, @Inject(CatalogueService) private readonly catalogue: CatalogueService, @Inject(ReceivingService) private readonly receiving: ReceivingService,
    @Inject(CustomerRegistryService) private readonly customers: CustomerRegistryService, @Inject(SuppliersService) private readonly suppliers: SuppliersService,
  ) {}

  async run(u: AuthUser, kind: ImportKind, csv: string, opts: { dryRun: boolean; branchId?: string }): Promise<ImportReport> {
    const { rows } = parseCsv(csv);
    if (!rows.length) throw new DomainError("EMPTY_FILE", "The file has no data rows", 400);
    if (rows.length > 5000) throw new DomainError("FILE_TOO_LARGE", "Import at most 5000 rows at a time", 400);
    const results: RowResult[] = [];
    const base = { kind, dryRun: opts.dryRun, total: rows.length };
    const finish = (extra: Partial<ImportReport> = {}): ImportReport => ({ ...base, ok: results.filter((r) => r.status === "OK").length, skipped: results.filter((r) => r.status === "SKIPPED").length, errors: results.filter((r) => r.status === "ERROR").length, rows: results, ...extra });
    const fail = (row: number, message: string) => results.push({ row, status: "ERROR", message });

    if (kind === "drugs") {
      const recs: Array<{ row: number; rec: DrugInput }> = [];
      rows.forEach((r, i) => {
        const row = i + 2;
        if (!r.brandname || !r.activeingredient || !r.strength || !r.dosageform || !r.packsize) return fail(row, "brandName, activeIngredient, strength, dosageForm and packSize are required");
        const sched = (r.controlledschedule || "NONE").toUpperCase();
        if (!["NONE", "SCHEDULE_1", "SCHEDULE_2", "SCHEDULE_3", "SCHEDULE_4"].includes(sched)) return fail(row, `controlledSchedule ${sched} is not valid`);
        if (r.price && !/^\d+(\.\d{1,2})?$/.test(r.price)) return fail(row, "price must be a number with up to 2 decimals");
        recs.push({ row, rec: { sourceKey: `import:${r.gtin || slug(`${r.brandname}-${r.strength}-${r.dosageform}`)}`, brandName: r.brandname, brandNameAr: r.brandnamear || null, activeIngredient: r.activeingredient, strength: r.strength, dosageForm: r.dosageform, packSize: r.packsize, gtin: r.gtin || null, manufacturer: r.manufacturer || null, price: r.price || null, category: r.category || null, rxOnly: bool(r.rxonly) || sched !== "NONE", controlledSchedule: sched as never, coldChain: bool(r.coldchain) } });
        results.push({ row, status: "OK" });
      });
      if (opts.dryRun || results.some((r) => r.status === "ERROR")) return finish();
      return finish({ ...(await this.catalogue.importDrugs(u.orgId, recs.map((x) => x.rec), u.userId)) });
    }

    if (kind === "suppliers") {
      const existing = new Set((await this.prisma.supplier.findMany({ where: { orgId: u.orgId }, select: { name: true } })).map((s) => s.name.toLowerCase()));
      const todo: Array<Record<string, string>> = [];
      rows.forEach((r, i) => {
        const row = i + 2;
        if (!r.name) return fail(row, "name is required");
        if (r.creditlimit && !/^\d+(\.\d{1,2})?$/.test(r.creditlimit)) return fail(row, "creditLimit must be a number");
        if (existing.has(r.name.toLowerCase())) return void results.push({ row, status: "SKIPPED", message: "supplier already exists" });
        existing.add(r.name.toLowerCase()); results.push({ row, status: "OK" }); todo.push(r);
      });
      if (opts.dryRun || results.some((r) => r.status === "ERROR")) return finish();
      for (const r of todo) await this.suppliers.create(u.orgId, { name: r.name, phone: r.phone || undefined, email: r.email || undefined, paymentTerms: r.paymentterms || undefined, creditLimit: r.creditlimit || undefined, leadTimeDays: r.leadtimedays ? Number(r.leadtimedays) : undefined });
      return finish({ created: todo.length });
    }

    if (kind === "customers") {
      const phones = new Set((await this.prisma.patientRef.findMany({ where: { orgId: u.orgId, phone: { not: null } }, select: { phone: true } })).map((p) => p.phone));
      const todo: Array<Record<string, string>> = [];
      rows.forEach((r, i) => {
        const row = i + 2;
        if (!r.displayname || r.displayname.length < 2) return fail(row, "displayName is required (2+ characters)");
        if (r.dateofbirth && !parseDate(r.dateofbirth)) return fail(row, "dateOfBirth must be YYYY-MM-DD or DD/MM/YYYY");
        if (r.gender && !["F", "M"].includes(r.gender.toUpperCase())) return fail(row, "gender must be F or M");
        const phone = r.phone.replace(/[^\d+]/g, "");
        if (phone && phones.has(phone)) return void results.push({ row, status: "SKIPPED", message: "a customer with this phone already exists" });
        if (phone) phones.add(phone);
        results.push({ row, status: "OK" }); todo.push(r);
      });
      if (opts.dryRun || results.some((r) => r.status === "ERROR")) return finish();
      for (const r of todo) await this.customers.create(u, { displayName: r.displayname, phone: r.phone || undefined, email: r.email || undefined, gender: r.gender ? r.gender.toUpperCase() : undefined, dateOfBirth: r.dateofbirth ? parseDate(r.dateofbirth)! : undefined, address: r.address || undefined, allergies: list(r.allergies), chronicConditions: list(r.chronicconditions), consentDataProcessing: true }, { force: true });
      return finish({ created: todo.length });
    }

    // stock
    const branches = await this.prisma.branch.findMany({ where: { orgId: u.orgId, active: true } });
    const defaultBranch = opts.branchId ? branches.find((b) => b.id === opts.branchId) : branches.length === 1 ? branches[0] : u.branchId ? branches.find((b) => b.id === u.branchId) : undefined;
    const byBranch = new Map<string, Array<{ drugId: string; lotNumber: string; expiryDate: string; quantity: number; unitCost: string; temperatureC?: number; supplierName?: string }>>();
    for (const [i, r] of rows.entries()) {
      const row = i + 2;
      const branch = r.branchcode ? branches.find((b) => (b.code ?? "").toLowerCase() === r.branchcode.toLowerCase()) : defaultBranch;
      if (!branch) { fail(row, r.branchcode ? `branchCode ${r.branchcode} not found` : "branchCode is required (or choose a branch)"); continue; }
      let drug = r.gtin ? await this.prisma.drug.findFirst({ where: { gtin: { in: [r.gtin, r.gtin.replace(/^0+/, ""), r.gtin.padStart(14, "0")] }, active: true, OR: [{ orgId: null }, { orgId: u.orgId }] } }) : null;
      if (!drug && r.brandname) { const m = await this.prisma.drug.findMany({ where: { brandName: { equals: r.brandname, mode: "insensitive" }, active: true, OR: [{ orgId: null }, { orgId: u.orgId }] }, take: 2 }); if (m.length > 1) { fail(row, `brandName "${r.brandname}" matches several drugs; use the barcode`); continue; } drug = m[0] ?? null; }
      if (!drug) { fail(row, "drug not found by gtin or brandName"); continue; }
      const expiry = parseDate(r.expirydate ?? "");
      if (!r.lotnumber || !expiry) { fail(row, "lotNumber and a valid expiryDate are required"); continue; }
      if (new Date(`${expiry}T00:00:00Z`) < new Date(new Date().toISOString().slice(0, 10))) { fail(row, "the lot is already expired"); continue; }
      const q = Number(r.quantity);
      if (!Number.isInteger(q) || q <= 0) { fail(row, "quantity must be a positive whole number"); continue; }
      if (!/^\d+(\.\d{1,2})?$/.test(r.unitcost ?? "")) { fail(row, "unitCost must be a number"); continue; }
      if (drug.coldChain && r.temperaturec === "") { fail(row, "cold-chain drug: temperatureC is required"); continue; }
      results.push({ row, status: "OK" });
      (byBranch.get(branch.id) ?? byBranch.set(branch.id, []).get(branch.id)!).push({ drugId: drug.id, lotNumber: r.lotnumber, expiryDate: expiry, quantity: q, unitCost: r.unitcost!, temperatureC: r.temperaturec ? Number(r.temperaturec) : undefined });
    }
    if (opts.dryRun || results.some((r) => r.status === "ERROR")) return finish();
    let units = 0;
    for (const [branchId, lines] of byBranch) { await this.receiving.receive(u, { branchId, invoiceNo: "OPENING-IMPORT", lines }); units += lines.reduce((a, l) => a + l.quantity, 0); }
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "import.stock", entityType: "GoodsReceipt", entityId: "import", meta: { rows: rows.length, units } } });
    return finish({ created: rows.length });
  }
}
