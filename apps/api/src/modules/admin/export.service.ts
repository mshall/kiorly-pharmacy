import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError } from "../../common/errors";
import { toCsvText } from "../../common/csv";
import type { AuthUser } from "../../auth/auth-user";

export const EXPORT_ENTITIES = ["customers", "drugs", "stock", "sales", "prescriptions", "suppliers", "expenses", "audit", "controlled-register"] as const;
export type ExportEntity = (typeof EXPORT_ENTITIES)[number];
const iso = (d: Date | null | undefined) => (d ? d.toISOString() : "");

/** Backup / export: the whole tenant as one JSON bundle (restore-able by the support team) or per-entity CSV for the owner's accountant and spreadsheets. National IDs are never exported (hash only is stored). */
@Injectable()
export class ExportService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private async rows(orgId: string, e: ExportEntity): Promise<{ headers: string[]; rows: unknown[][] }> {
    const take = 100_000;
    switch (e) {
      case "customers": { const r = await this.prisma.patientRef.findMany({ where: { orgId, mergedIntoId: null }, orderBy: { createdAt: "asc" }, take }); return { headers: ["customerNo", "displayName", "phone", "email", "gender", "dateOfBirth", "address", "allergies", "chronicConditions", "loyaltyPoints", "loyaltyTier", "consentDataProcessing", "consentMarketing", "active", "createdAt"], rows: r.map((c) => [c.customerNo, c.displayName, c.phone, c.email, c.gender, c.dateOfBirth?.toISOString().slice(0, 10), c.address, c.allergies.join(";"), c.chronicConditions.join(";"), c.loyaltyPoints, c.loyaltyTier, c.consentDataProcessing, c.consentMarketing, c.active, iso(c.createdAt)]) }; }
      case "drugs": { const r = await this.prisma.drug.findMany({ where: { orgId }, orderBy: { brandName: "asc" }, take }); return { headers: ["brandName", "brandNameAr", "activeIngredient", "strength", "dosageForm", "packSize", "gtin", "category", "rxOnly", "controlledSchedule", "coldChain", "manufacturer"], rows: r.map((d) => [d.brandName, d.brandNameAr, d.activeIngredient, d.strength, d.dosageForm, d.packSize, d.gtin, d.category, d.rxOnly, d.controlledSchedule, d.coldChain, d.manufacturer]) }; }
      case "stock": { const r = await this.prisma.stockLot.findMany({ where: { orgId, qtyOnHand: { gt: 0 } }, include: { drug: { select: { brandName: true, gtin: true } } }, orderBy: [{ drug: { brandName: "asc" } }, { expiryDate: "asc" }], take }); const br = new Map((await this.prisma.branch.findMany({ where: { orgId } })).map((b) => [b.id, b.code ?? b.name])); return { headers: ["branchCode", "gtin", "brandName", "lotNumber", "expiryDate", "quantity", "unitCost", "status"], rows: r.map((l) => [br.get(l.branchId), l.drug.gtin, l.drug.brandName, l.lotNumber, l.expiryDate.toISOString().slice(0, 10), l.qtyOnHand, l.unitCost.toFixed(2), l.status]) }; }
      case "sales": { const r = await this.prisma.sale.findMany({ where: { orgId }, include: { lines: true, payments: true }, orderBy: { soldAt: "asc" }, take }); return { headers: ["receiptNo", "soldAt", "status", "subtotal", "discount", "vatIncluded", "total", "payments", "lines"], rows: r.map((s) => [s.receiptNo, iso(s.soldAt), s.status, s.subtotal.toFixed(2), s.discountTotal.toFixed(2), s.vatTotal.toFixed(2), s.total.toFixed(2), s.payments.map((p) => `${p.method}:${p.amount.toFixed(2)}`).join(";"), s.lines.length]) }; }
      case "prescriptions": { const r = await this.prisma.prescription.findMany({ where: { orgId }, include: { lines: true, patient: { select: { displayName: true, customerNo: true } } }, orderBy: { receivedAt: "asc" }, take }); return { headers: ["receivedAt", "source", "status", "customerNo", "patient", "prescriber", "prescriberLicence", "refillsAllowed", "refillsUsed", "items"], rows: r.map((x) => [iso(x.receivedAt), x.source, x.status, x.patient?.customerNo, x.patient?.displayName, x.prescriberName, x.prescriberLicenceNo, x.refillsAllowed, x.refillsUsed, x.lines.map((l) => `${l.drugName ?? l.activeIngredient} x${l.quantity}`).join(";")]) }; }
      case "suppliers": { const r = await this.prisma.supplier.findMany({ where: { orgId }, orderBy: { name: "asc" } }); return { headers: ["name", "phone", "email", "paymentTerms", "creditLimit", "balance", "active"], rows: r.map((s) => [s.name, s.phone, s.email, s.paymentTerms, s.creditLimit?.toFixed(2), s.balance.toFixed(2), s.active]) }; }
      case "expenses": { const r = await this.prisma.expense.findMany({ where: { orgId }, orderBy: { expenseDate: "asc" }, take }); return { headers: ["expenseDate", "category", "amount", "vatIncluded", "method", "description", "receiptRef", "voided"], rows: r.map((x) => [x.expenseDate.toISOString().slice(0, 10), x.category, x.amount.toFixed(2), x.vatAmount.toFixed(2), x.method, x.description, x.receiptRef, !!x.voidedAt]) }; }
      case "audit": { const r = await this.prisma.auditLog.findMany({ where: { orgId }, orderBy: { at: "asc" }, take }); return { headers: ["at", "actorId", "action", "entityType", "entityId", "meta"], rows: r.map((a) => [iso(a.at), a.actorId, a.action, a.entityType, a.entityId, a.meta ? JSON.stringify(a.meta) : ""]) }; }
      case "controlled-register": { const r = await this.prisma.controlledRegisterEntry.findMany({ where: { orgId }, orderBy: { occurredAt: "asc" }, take }); return { headers: ["occurredAt", "drugId", "lotId", "kind", "qtyDelta", "balanceAfter", "patientIdLast4", "prescriberLicenceNo", "performedBy", "witnessName", "reason"], rows: r.map((x) => [iso(x.occurredAt), x.drugId, x.lotId, x.kind, x.qtyDelta, x.balanceAfter, x.patientIdLast4, x.prescriberLicenceNo, x.performedBy, x.witnessName, x.reason]) }; }
    }
  }

  async csv(u: AuthUser, entity: string) {
    if (!(EXPORT_ENTITIES as readonly string[]).includes(entity)) throw new DomainError("UNKNOWN_ENTITY", `Unknown export ${entity}`, 404, { available: EXPORT_ENTITIES });
    const { headers, rows } = await this.rows(u.orgId, entity as ExportEntity);
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "data.export", entityType: "Export", entityId: entity, meta: { rows: rows.length, format: "csv" } } });
    return toCsvText(headers, rows);
  }

  /** Full backup bundle (JSON): counts + every entity as header/rows. */
  async bundle(u: AuthUser) {
    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
    const out: Record<string, { headers: string[]; rows: unknown[][] }> = {};
    for (const e of EXPORT_ENTITIES) out[e] = await this.rows(u.orgId, e);
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "data.export", entityType: "Export", entityId: "bundle", meta: { entities: EXPORT_ENTITIES.length, format: "json" } } });
    return { app: "kiorly-pharmacy", format: 1, exportedAt: new Date().toISOString(), tenant: { id: tenant.id, name: tenant.name, market: tenant.marketCode, edition: tenant.edition, settings: tenant.settings }, counts: Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.rows.length])), data: out };
  }
}
