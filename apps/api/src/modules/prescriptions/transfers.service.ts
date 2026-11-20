import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import type { AuthUser } from "../../auth/auth-user";
import { PrescriptionsService } from "./prescriptions.service";

export interface Counterparty { name: string; phone?: string; pharmacist?: string; licenceNo?: string }
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Prescription transfers between pharmacies (in and out). Controlled medicines are never transferred. */
@Injectable()
export class RxTransfersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(PrescriptionsService) private readonly rx: PrescriptionsService) {}

  /** OUT: the remaining quantities leave this pharmacy; the Rx is closed here (TRANSFERRED_OUT) and a printable transfer note is available. */
  async out(user: AuthUser, id: string, d: { counterparty: Counterparty; reason?: string }) {
    const rx = await this.rx.get(user.orgId, id);
    if (["DISPENSED", "CANCELLED", "REJECTED", "EXPIRED", "TRANSFERRED_OUT"].includes(rx.status)) throw new DomainError("RX_CLOSED", `Prescription is ${rx.status}`, 409);
    if (rx.lines.some((l) => l.controlled || (l.drug && l.drug.controlledSchedule !== "NONE"))) throw new DomainError("TRANSFER_NOT_ALLOWED_CONTROLLED", "Controlled medicines cannot be transferred to another pharmacy", 409);
    const remaining = rx.lines.map((l) => ({ drug: l.drug?.brandName ?? l.drugName ?? l.activeIngredient, activeIngredient: l.activeIngredient ?? l.drug?.activeIngredient, strength: l.strength, quantity: l.quantity - l.qtyDispensed, directions: l.directions })).filter((l) => l.quantity > 0);
    if (!remaining.length) throw new DomainError("NOTHING_TO_TRANSFER", "No quantity remains on this prescription", 409);
    return this.prisma.$transaction(async (tx) => {
      const t = await tx.rxTransfer.create({ data: { orgId: user.orgId, branchId: rx.branchId, direction: "OUT", prescriptionId: id, counterpartyName: d.counterparty.name, counterpartyPhone: d.counterparty.phone, counterpartyPharmacist: d.counterparty.pharmacist, counterpartyLicenceNo: d.counterparty.licenceNo, reason: d.reason, snapshot: { remaining, refillsLeft: rx.refillsAllowed - rx.refillsUsed, prescriber: rx.prescriberName, prescriberLicenceNo: rx.prescriberLicenceNo, issuedAt: rx.issuedAt } as never, createdBy: user.userId } });
      await tx.prescription.update({ where: { id }, data: { status: "TRANSFERRED_OUT", transferredOutAt: new Date() } });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "rx.transfer_out", entityType: "Prescription", entityId: id, meta: { transferId: t.id, lines: remaining.length } } });
      return t;
    });
  }

  /** IN: a prescription received from another pharmacy becomes a local Rx (TRANSFER_IN) that still goes through pharmacist verification. */
  async in(user: AuthUser, branchId: string, d: { counterparty: Counterparty; reason?: string; originalRef?: string; patientId?: string; patient?: { displayName: string; phone?: string; allergies?: string[]; birthYear?: number }; prescriberName: string; prescriberLicenceNo?: string; issuedAt: string; refillsAllowed?: number; lines: Array<{ drugId?: string; activeIngredient?: string; drugName?: string; strength?: string; dosageForm?: string; quantity: number; directions?: string }> }) {
    const drugIds = d.lines.map((l) => l.drugId).filter((x): x is string => !!x);
    if (drugIds.length && (await this.prisma.drug.count({ where: { id: { in: drugIds }, controlledSchedule: { not: "NONE" } } }))) throw new DomainError("TRANSFER_NOT_ALLOWED_CONTROLLED", "Controlled medicines cannot be transferred in", 409);
    const rx = await this.rx.intakePaper(user, { branchId, patientId: d.patientId, patient: d.patient, prescriberName: d.prescriberName, prescriberLicenceNo: d.prescriberLicenceNo, issuedAt: d.issuedAt, lines: d.lines, refillsAllowed: d.refillsAllowed, source: "MANUAL_ENTRY" });
    await this.prisma.prescription.update({ where: { id: rx.id }, data: { source: "TRANSFER_IN", sourceRxRef: d.originalRef } });
    const t = await this.prisma.rxTransfer.create({ data: { orgId: user.orgId, branchId, direction: "IN", prescriptionId: rx.id, counterpartyName: d.counterparty.name, counterpartyPhone: d.counterparty.phone, counterpartyPharmacist: d.counterparty.pharmacist, counterpartyLicenceNo: d.counterparty.licenceNo, reason: d.reason, createdBy: user.userId } });
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "rx.transfer_in", entityType: "Prescription", entityId: rx.id, meta: { transferId: t.id } } });
    return { transfer: t, prescription: await this.rx.get(user.orgId, rx.id) };
  }

  async list(orgId: string, q: { direction?: string; branchId?: string; skip: number; take: number }) {
    const where = { orgId, ...(q.direction ? { direction: q.direction } : {}), ...(q.branchId ? { branchId: q.branchId } : {}) };
    const [items, total] = await Promise.all([this.prisma.rxTransfer.findMany({ where, orderBy: { createdAt: "desc" }, skip: q.skip, take: q.take }), this.prisma.rxTransfer.count({ where })]);
    return { items, total };
  }

  /** Printable transfer note (sent with the patient / read out to the receiving pharmacist). */
  async noteHtml(orgId: string, transferId: string, lang: "ar" | "en") {
    const t = await this.prisma.rxTransfer.findFirst({ where: { id: transferId, orgId } });
    if (!t) throw notFound("Transfer", transferId);
    const [tenant, branch, rx] = await Promise.all([this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } }), this.prisma.branch.findUnique({ where: { id: t.branchId } }), this.rx.get(orgId, t.prescriptionId)]);
    const snap = (t.snapshot ?? {}) as { remaining?: Array<{ drug: string; strength: string | null; quantity: number; directions: string | null }> };
    const ar = lang === "ar";
    const L = ar ? { h: "مذكرة تحويل روشتة", from: "من", to: "إلى", patient: "المريض", rx: "رقم الروشتة", doctor: "الطبيب", items: "الأصناف المتبقية", qty: "الكمية", dir: "الجرعة", reason: "السبب", sign: "توقيع الصيدلي" } : { h: "Prescription transfer note", from: "From", to: "To", patient: "Patient", rx: "Rx no.", doctor: "Prescriber", items: "Remaining items", qty: "Qty", dir: "Directions", reason: "Reason", sign: "Pharmacist signature" };
    return `<!doctype html><html lang="${lang}" dir="${ar ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${L.h}</title><style>@page{size:A5;margin:10mm}body{font:12px/1.5 system-ui,"Noto Sans Arabic",sans-serif}h1{font-size:16px}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #ccc;padding:4px;text-align:start}</style></head><body>
<h1>${L.h}</h1><p><b>${L.from}:</b> ${esc(tenant.name)} — ${esc(branch?.name)} ${branch?.licenceNo ? `(${esc(branch.licenceNo)})` : ""}<br><b>${L.to}:</b> ${esc(t.counterpartyName)} ${esc(t.counterpartyPharmacist ?? "")} ${esc(t.counterpartyPhone ?? "")}</p>
<p><b>${L.patient}:</b> ${esc(rx.patient?.displayName)}<br><b>${L.rx}:</b> ${esc(rx.id.slice(-8).toUpperCase())}<br><b>${L.doctor}:</b> ${esc(rx.prescriberName)} ${esc(rx.prescriberLicenceNo ?? "")}</p>
<h2 style="font-size:13px">${L.items}</h2><table><tr><th></th><th>${L.qty}</th><th>${L.dir}</th></tr>${(snap.remaining ?? []).map((r) => `<tr><td>${esc(r.drug)} ${esc(r.strength ?? "")}</td><td>${r.quantity}</td><td>${esc(r.directions ?? "")}</td></tr>`).join("")}</table>
${t.reason ? `<p><b>${L.reason}:</b> ${esc(t.reason)}</p>` : ""}<p style="margin-top:28px">${L.sign}: ______________________ &nbsp; ${esc(new Date(t.createdAt).toISOString().slice(0, 10))}</p></body></html>`;
  }
}
