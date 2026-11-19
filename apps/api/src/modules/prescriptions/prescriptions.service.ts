import { Inject, Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { Prisma, type RxStatus } from "@prisma/client";
import { validateEvent } from "@kiorex/contracts";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import type { AuthUser } from "../../auth/auth-user";
import { ConsentVerifier } from "../../platform/adapters/consent.adapter";
import { StorageAdapter } from "../../platform/adapters/storage.adapter";
import { groupKey } from "../catalogue/normalize";

/** NEEDS_HUMAN default: an Rx is valid for 30 days from issue unless the prescription states otherwise. */
export const DEFAULT_RX_VALIDITY_DAYS = 30;

export interface PaperRxInput {
  branchId: string;
  patient: { displayName: string; phone?: string; allergies?: string[]; birthYear?: number; externalId?: string };
  prescriberName: string;
  prescriberLicenceNo?: string;
  issuedAt?: string;
  scanDataUrl?: string;
  scanFileName?: string;
  lines: Array<{ drugId?: string; activeIngredient?: string; drugName?: string; strength?: string; dosageForm?: string; quantity: number; directions?: string }>;
}

export interface ValidationIssue { code: string; severity: "ERROR" | "WARN"; message: string; lineId?: string }

@Injectable()
export class PrescriptionsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(ConsentVerifier) private readonly consent: ConsentVerifier,
    @Inject(StorageAdapter) private readonly storage: StorageAdapter,
  ) {}

  private async upsertPatient(tx: Prisma.TransactionClient, orgId: string, p: PaperRxInput["patient"]) {
    if (p.externalId) {
      const ex = await tx.patientRef.findFirst({ where: { orgId, externalId: p.externalId } });
      if (ex) return tx.patientRef.update({ where: { id: ex.id }, data: { ...(p.allergies ? { allergies: p.allergies } : {}) } });
    }
    return tx.patientRef.create({ data: { orgId, externalId: p.externalId, displayName: p.displayName, phone: p.phone, allergies: p.allergies ?? [], birthYear: p.birthYear } });
  }

  private async resolveDrug(tx: Prisma.TransactionClient, orgId: string, l: { activeIngredient?: string; strength?: string; dosageForm?: string; drugId?: string }) {
    if (l.drugId) {
      const d = await tx.drug.findFirst({ where: { id: l.drugId, OR: [{ orgId: null }, { orgId }] } });
      if (!d) throw notFound("Drug", l.drugId);
      return d;
    }
    return null;
  }

  /** KPRX01 paper scan capture: pharmacist/cashier keys the Rx lines; the scan image is stored via the storage adapter. */
  async intakePaper(user: AuthUser, input: PaperRxInput) {
    if (!input.lines.length) throw new DomainError("NO_LINES", "A prescription needs at least one line", 400);
    return this.prisma.$transaction(async (tx) => {
      const patient = await this.upsertPatient(tx, user.orgId, input.patient);
      const rx = await tx.prescription.create({
        data: {
          orgId: user.orgId, branchId: input.branchId, source: "PAPER_SCAN", patientId: patient.id, prescriberName: input.prescriberName, prescriberLicenceNo: input.prescriberLicenceNo,
          issuedAt: input.issuedAt ? new Date(input.issuedAt) : new Date(), validUntil: new Date((input.issuedAt ? new Date(input.issuedAt) : new Date()).getTime() + DEFAULT_RX_VALIDITY_DAYS * 86_400_000), receivedBy: user.userId,
        },
      });
      for (const l of input.lines) {
        const d = await this.resolveDrug(tx, user.orgId, l);
        await tx.prescriptionLine.create({
          data: { prescriptionId: rx.id, drugId: d?.id, activeIngredient: l.activeIngredient ?? d?.activeIngredient, strength: l.strength ?? d?.strength, dosageForm: l.dosageForm ?? d?.dosageForm, drugName: l.drugName ?? d?.brandName, quantity: l.quantity, directions: l.directions, controlled: d ? d.controlledSchedule !== "NONE" : false },
        });
      }
      if (input.scanDataUrl) {
        const { key } = await this.storage.putDataUrl(`rx-scans/${user.orgId}/${rx.id}`, input.scanDataUrl);
        await tx.prescription.update({ where: { id: rx.id }, data: { scanStorageKey: key } });
      }
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "rx.intake", entityType: "Prescription", entityId: rx.id, meta: { source: "PAPER_SCAN", lines: input.lines.length } } });
      return rx;
    }).then((rx) => this.get(user.orgId, rx.id));
  }

  /**
   * KPRX01 inbound e-Rx: PrescriptionIssued envelope (already HMAC-verified by the webhook controller).
   * Safety control `consent_enforcement`: no valid patient consent token => nothing is stored. Idempotent on eventId and (orgId, sourceEventId).
   */
  async intakeEvent(orgId: string, branchId: string, envelope: unknown): Promise<{ status: "created" | "duplicate"; prescriptionId: string }> {
    const v = validateEvent("PrescriptionIssued", envelope);
    if (!v.valid) throw new DomainError("EVENT_CONTRACT_VIOLATION", "PrescriptionIssued does not match @kiorex/contracts", 422, v.errors);
    const ev = v.event as { eventId: string; data: { prescriptionId: string; clinicId: string; patientRef: string; prescriberId: string; consentToken: string; issuedAt: string; items: Array<{ activeIngredient: string; drugName?: string; strength?: string; dose?: string; quantity: number; controlled?: boolean }> } };

    const dup = await this.prisma.prescription.findUnique({ where: { orgId_sourceEventId: { orgId, sourceEventId: ev.eventId } } });
    if (dup) return { status: "duplicate", prescriptionId: dup.id };

    const consent = await this.consent.verify(ev.data.consentToken, { patientRef: ev.data.patientRef, clinicId: ev.data.clinicId });
    if (!consent.valid) throw new DomainError("CONSENT_INVALID", `Patient consent token rejected: ${consent.reason}`, 422, { reason: consent.reason });

    try {
      const rx = await this.prisma.$transaction(async (tx) => {
        await tx.inboundEvent.create({ data: { eventId: ev.eventId, type: "PrescriptionIssued", orgId } });
        const patient = await this.upsertPatient(tx, orgId, { displayName: `Patient ${ev.data.patientRef.slice(-6)}`, externalId: ev.data.patientRef });
        const issuedAt = new Date(ev.data.issuedAt);
        const created = await tx.prescription.create({
          data: {
            orgId, branchId, source: "KIORLY_E_RX", patientId: patient.id, sourceEventId: ev.eventId, sourceRxRef: ev.data.prescriptionId, clinicRef: ev.data.clinicId, prescriberRef: ev.data.prescriberId,
            consentTokenHash: createHash("sha256").update(ev.data.consentToken).digest("hex"), consentVerifiedAt: new Date(), consentExpiresAt: consent.expiresAt,
            // A PrescriptionIssued event only exists for a Kiorly-verified clinician (badge); name/licence stay with the issuing clinic.
            prescriberName: `Clinic prescriber ${ev.data.prescriberId.slice(-6)}`, prescriberLicenceNo: `KIORLY:${ev.data.prescriberId}`, prescriberVerifiedBadge: true,
            issuedAt, validUntil: new Date(issuedAt.getTime() + DEFAULT_RX_VALIDITY_DAYS * 86_400_000),
          },
        });
        for (const it of ev.data.items) {
          const match = await tx.drug.findFirst({ where: { OR: [{ orgId: null }, { orgId }], activeIngredient: { equals: it.activeIngredient, mode: "insensitive" }, ...(it.strength ? { strength: { equals: it.strength, mode: "insensitive" } } : {}), active: true }, orderBy: { brandName: "asc" } });
          await tx.prescriptionLine.create({ data: { prescriptionId: created.id, drugId: null, activeIngredient: it.activeIngredient, strength: it.strength ?? match?.strength, dosageForm: match?.dosageForm, drugName: it.drugName, quantity: Math.max(1, Math.ceil(it.quantity)), directions: it.dose, controlled: it.controlled ?? false } });
        }
        await tx.auditLog.create({ data: { orgId, action: "rx.intake", entityType: "Prescription", entityId: created.id, meta: { source: "KIORLY_E_RX", eventId: ev.eventId, items: ev.data.items.length } } });
        return created;
      });
      return { status: "created", prescriptionId: rx.id };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        const again = await this.prisma.prescription.findUnique({ where: { orgId_sourceEventId: { orgId, sourceEventId: ev.eventId } } });
        if (again) return { status: "duplicate", prescriptionId: again.id };
      }
      throw e;
    }
  }

  async list(orgId: string, q: { branchId?: string; status?: RxStatus; skip: number; take: number }) {
    const where: Prisma.PrescriptionWhereInput = { orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.status ? { status: q.status } : {}) };
    const [items, total] = await Promise.all([
      this.prisma.prescription.findMany({ where, include: { lines: true, patient: { select: { id: true, displayName: true } } }, orderBy: { receivedAt: "desc" }, skip: q.skip, take: q.take }),
      this.prisma.prescription.count({ where }),
    ]);
    return { items, total };
  }

  async get(orgId: string, id: string) {
    const rx = await this.prisma.prescription.findFirst({ where: { id, orgId }, include: { lines: { include: { drug: true } }, patient: true } });
    if (!rx) throw notFound("Prescription", id);
    return rx;
  }

  /** KPRX02: prescriber, patient, dose and quantity validation. Pharmacist marks VALIDATED only when there are no ERROR issues. */
  async validate(user: AuthUser, id: string) {
    const rx = await this.get(user.orgId, id);
    if (rx.status === "DISPENSED" || rx.status === "CANCELLED") throw new DomainError("RX_CLOSED", `Prescription is ${rx.status}`, 409);
    const issues: ValidationIssue[] = [];
    if (!rx.prescriberName || !rx.prescriberLicenceNo) issues.push({ code: "PRESCRIBER_MISSING", severity: "ERROR", message: "Prescriber name and licence number are required" });
    else if (!rx.prescriberVerifiedBadge) issues.push({ code: "PRESCRIBER_UNVERIFIED", severity: "WARN", message: "Prescriber has no Kiorly-verified badge; verify the licence manually" });
    if (!rx.patientId) issues.push({ code: "PATIENT_MISSING", severity: "ERROR", message: "Patient is required" });
    if (rx.validUntil && rx.validUntil < new Date()) issues.push({ code: "RX_EXPIRED", severity: "ERROR", message: "Prescription validity has passed" });
    if (rx.source === "KIORLY_E_RX" && (!rx.consentVerifiedAt || (rx.consentExpiresAt && rx.consentExpiresAt < new Date()))) issues.push({ code: "CONSENT_INVALID", severity: "ERROR", message: "Patient consent token missing or expired" });
    if (!rx.lines.length) issues.push({ code: "NO_LINES", severity: "ERROR", message: "No prescription lines" });
    for (const l of rx.lines) {
      if (!Number.isInteger(l.quantity) || l.quantity <= 0) issues.push({ code: "QUANTITY_INVALID", severity: "ERROR", message: "Quantity must be a positive whole number", lineId: l.id });
      if (!l.directions) issues.push({ code: "DOSE_MISSING", severity: "WARN", message: "Directions (dose/frequency/duration) not stated", lineId: l.id });
      if (!l.drugId && !l.activeIngredient) issues.push({ code: "DRUG_MISSING", severity: "ERROR", message: "Drug or active ingredient required", lineId: l.id });
    }
    const hasError = issues.some((i) => i.severity === "ERROR");
    const status: RxStatus = hasError ? "VALIDATING" : "VALIDATED";
    const updated = await this.prisma.prescription.update({ where: { id }, data: hasError ? { status } : { status, validatedBy: user.userId, validatedAt: new Date() } });
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "rx.validate", entityType: "Prescription", entityId: id, meta: { errors: issues.filter((i) => i.severity === "ERROR").length, warnings: issues.filter((i) => i.severity === "WARN").length } } });
    return { prescription: updated, issues, validated: !hasError };
  }

  async reject(user: AuthUser, id: string, reason: string) {
    const rx = await this.get(user.orgId, id);
    if (["DISPENSED", "PARTIALLY_DISPENSED", "CANCELLED"].includes(rx.status)) throw new DomainError("RX_CLOSED", `Prescription is ${rx.status}`, 409);
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "rx.reject", entityType: "Prescription", entityId: id, meta: { reason } } });
    return this.prisma.prescription.update({ where: { id }, data: { status: "REJECTED", rejectionReason: reason } });
  }

  /** Line drug choice at dispensing time (e-Rx lines carry an ingredient only). */
  async setLineDrug(user: AuthUser, id: string, lineId: string, drugId: string) {
    const rx = await this.get(user.orgId, id);
    const line = rx.lines.find((l) => l.id === lineId);
    if (!line) throw notFound("Prescription line", lineId);
    const d = await this.prisma.drug.findFirst({ where: { id: drugId, OR: [{ orgId: null }, { orgId: user.orgId }] } });
    if (!d) throw notFound("Drug", drugId);
    if (line.activeIngredient && groupKey({ activeIngredient: d.activeIngredient, strength: d.strength, dosageForm: d.dosageForm }).activeIngredient !== groupKey({ activeIngredient: line.activeIngredient, strength: d.strength, dosageForm: d.dosageForm }).activeIngredient) {
      throw new DomainError("INGREDIENT_MISMATCH", "Chosen product does not contain the prescribed active ingredient", 409);
    }
    return this.prisma.prescriptionLine.update({ where: { id: lineId }, data: { drugId, controlled: d.controlledSchedule !== "NONE", strength: line.strength ?? d.strength, dosageForm: line.dosageForm ?? d.dosageForm } });
  }
}
