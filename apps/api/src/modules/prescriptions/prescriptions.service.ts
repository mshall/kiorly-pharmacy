import { Inject, Injectable, Optional } from "@nestjs/common";
import { PushService } from "../mobile/push.service";
import { createHash } from "node:crypto";
import { Prisma, type RxStatus } from "../../generated/prisma/client";
import { validateEvent } from "@kiorex/contracts";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import type { AuthUser } from "../../auth/auth-user";
import { ConsentVerifier } from "../../platform/adapters/consent.adapter";
import { StorageAdapter } from "../../platform/adapters/storage.adapter";
import { ConsentService } from "../../platform/adapters/consent.service";
import { groupKey } from "../catalogue/normalize";
import { PriceService } from "../catalogue/price.service";
import { PrescribersService } from "./prescribers.service";
import { nextCustomerNo, normPhone } from "../customers/customer-registry.service";

/** NEEDS_HUMAN default: an Rx is valid for 30 days from issue unless the prescription states otherwise. */
export const DEFAULT_RX_VALIDITY_DAYS = 30;

export interface PaperRxInput {
  branchId: string;
  /** Existing customer (preferred) or details for a new / matched-by-phone one. */
  patientId?: string;
  patient?: { displayName: string; phone?: string; allergies?: string[]; birthYear?: number; externalId?: string };
  /** Prescriber directory entry, or name + licence (added to the directory automatically). */
  prescriberId?: string;
  prescriberName?: string;
  prescriberLicenceNo?: string;
  issuedAt?: string;
  validDays?: number;
  scanDataUrl?: string;
  scanFileName?: string;
  source?: "PAPER_SCAN" | "MANUAL_ENTRY";
  refillsAllowed?: number;
  refillIntervalDays?: number;
  priority?: "NORMAL" | "URGENT";
  lines: Array<{ drugId?: string; activeIngredient?: string; drugName?: string; strength?: string; dosageForm?: string; quantity: number; directions?: string }>;
}

export interface ValidationIssue { code: string; severity: "ERROR" | "WARN"; message: string; lineId?: string }

@Injectable()
export class PrescriptionsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(ConsentVerifier) private readonly consent: ConsentVerifier,
    @Inject(StorageAdapter) private readonly storage: StorageAdapter,
    @Inject(ConsentService) private readonly consents: ConsentService,
    @Inject(PrescribersService) private readonly prescribers: PrescribersService,
    @Inject(PriceService) private readonly prices: PriceService,
    @Optional() @Inject(PushService) private readonly push?: PushService,
  ) {}

  /** Kiorly: mock push to pharmacists/managers (fire-and-forget; never affects intake). */
  private notifyRxWaiting(orgId: string, rxId: string, branchId?: string | null) {
    void this.push?.sendTemplate(orgId, "rx.awaiting", {}, { roles: ["PHARMACIST", "OWNER", "BRANCH_MANAGER"], branchId }, { rxId });
  }

  private async upsertPatient(tx: Prisma.TransactionClient, orgId: string, p: NonNullable<PaperRxInput["patient"]>) {
    const phone = normPhone(p.phone);
    const existing = p.externalId ? await tx.patientRef.findFirst({ where: { orgId, externalId: p.externalId } }) : phone ? await tx.patientRef.findFirst({ where: { orgId, phone, active: true, mergedIntoId: null }, orderBy: { createdAt: "asc" } }) : null;
    if (existing) {
      const allergies = [...new Set([...existing.allergies, ...(p.allergies ?? []).map((a) => a.toLowerCase().trim())])];
      return tx.patientRef.update({ where: { id: existing.id }, data: { allergies } });
    }
    return tx.patientRef.create({ data: { orgId, customerNo: await nextCustomerNo(tx, orgId), externalId: p.externalId, displayName: p.displayName, phone, allergies: (p.allergies ?? []).map((a) => a.toLowerCase().trim()), birthYear: p.birthYear } });
  }

  private async resolveDrug(tx: Prisma.TransactionClient, orgId: string, l: { activeIngredient?: string; strength?: string; dosageForm?: string; drugId?: string }) {
    if (l.drugId) {
      const d = await tx.drug.findFirst({ where: { id: l.drugId, OR: [{ orgId: null }, { orgId }] } });
      if (!d) throw notFound("Drug", l.drugId);
      return d;
    }
    return null;
  }

  /**
   * KPRX01 paper / manual Rx capture (standalone-first: no Kiorly needed). The pharmacist or assistant keys the Rx lines; an optional scan image is stored
   * via the storage adapter. Customers are matched by phone, prescribers by licence (directory grows automatically). Always lands in the verification queue.
   */
  async intakePaper(user: AuthUser, input: PaperRxInput) {
    if (!input.lines.length) throw new DomainError("NO_LINES", "A prescription needs at least one line", 400);
    if (!input.patientId && !input.patient) throw new DomainError("PATIENT_REQUIRED", "Choose or enter a patient", 400);
    if (!input.prescriberId && !input.prescriberName) throw new DomainError("PRESCRIBER_REQUIRED", "Choose a prescriber or enter the prescriber name", 400);
    const issued = input.issuedAt ? new Date(input.issuedAt) : new Date();
    if (issued.getTime() > Date.now() + 86_400_000) throw new DomainError("ISSUED_IN_FUTURE", "Issue date cannot be in the future", 400);
    if ((input.refillsAllowed ?? 0) < 0 || (input.refillsAllowed ?? 0) > 12) throw new DomainError("INVALID_REFILLS", "Refills must be between 0 and 12", 400);
    return this.prisma.$transaction(async (tx) => {
      const patient = input.patientId
        ? await tx.patientRef.findFirst({ where: { id: input.patientId, orgId: user.orgId, active: true } })
        : await this.upsertPatient(tx, user.orgId, input.patient!);
      if (!patient) throw notFound("Customer", input.patientId);
      // licence missing is allowed at intake (the pharmacist verification step flags it, PRESCRIBER_MISSING); no directory entry without a licence
      const prescriber = input.prescriberId
        ? await tx.prescriber.findFirst({ where: { id: input.prescriberId, orgId: user.orgId, active: true } })
        : input.prescriberLicenceNo ? await this.prescribers.ensure(tx, user.orgId, { name: input.prescriberName!, licenceNo: input.prescriberLicenceNo }) : null;
      if (input.prescriberId && !prescriber) throw notFound("Prescriber", input.prescriberId);
      const rx = await tx.prescription.create({
        data: {
          orgId: user.orgId, branchId: input.branchId, source: input.source ?? (input.scanDataUrl ? "PAPER_SCAN" : "MANUAL_ENTRY"), patientId: patient.id, prescriberId: prescriber?.id, prescriberName: prescriber?.name ?? input.prescriberName, prescriberLicenceNo: prescriber?.licenceNo,
          prescriberVerifiedBadge: prescriber?.verified ?? false, issuedAt: issued, validUntil: new Date(issued.getTime() + (input.validDays ?? DEFAULT_RX_VALIDITY_DAYS) * 86_400_000), receivedBy: user.userId,
          refillsAllowed: input.refillsAllowed ?? 0, refillIntervalDays: input.refillIntervalDays ?? ((input.refillsAllowed ?? 0) > 0 ? 30 : null), priority: input.priority ?? "NORMAL",
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
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "rx.intake", entityType: "Prescription", entityId: rx.id, meta: { source: rx.source, lines: input.lines.length, refills: rx.refillsAllowed } } });
      return rx;
    }).then((rx) => { this.notifyRxWaiting(user.orgId, rx.id, rx.branchId); return this.get(user.orgId, rx.id); });
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
    if (!consent.valid && consent.reason === "REGISTRY_UNAVAILABLE") throw new DomainError("CONSENT_REGISTRY_UNAVAILABLE", "Consent registry unreachable: the e-Rx is not stored without verified consent; the clinic will retry", 503, { reason: consent.reason });
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
      await this.consents.recordErxConsent(orgId, { patientRef: ev.data.patientRef, patientId: rx.patientId ?? undefined, token: ev.data.consentToken, expiresAt: consent.expiresAt });
      this.notifyRxWaiting(orgId, rx.id, branchId);
      return { status: "created", prescriptionId: rx.id };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        const again = await this.prisma.prescription.findUnique({ where: { orgId_sourceEventId: { orgId, sourceEventId: ev.eventId } } });
        if (again) return { status: "duplicate", prescriptionId: again.id };
      }
      throw e;
    }
  }

  async list(orgId: string, q: { branchId?: string; status?: RxStatus; source?: string; prescriberId?: string; patientId?: string; q?: string; skip: number; take: number }) {
    const where: Prisma.PrescriptionWhereInput = {
      orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.status ? { status: q.status } : {}), ...(q.source ? { source: q.source as never } : {}), ...(q.prescriberId ? { prescriberId: q.prescriberId } : {}), ...(q.patientId ? { patientId: q.patientId } : {}),
      ...(q.q ? { OR: [{ patient: { displayName: { contains: q.q, mode: "insensitive" } } }, { patient: { phone: { contains: q.q } } }, { prescriberName: { contains: q.q, mode: "insensitive" } }, { id: { startsWith: q.q } }] } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.prescription.findMany({ where, include: { lines: true, patient: { select: { id: true, displayName: true, customerNo: true } } }, orderBy: { receivedAt: "desc" }, skip: q.skip, take: q.take }),
      this.prisma.prescription.count({ where }),
    ]);
    return { items, total };
  }

  /** KPRX02 verification workflow: everything awaiting a pharmacist (RECEIVED / VALIDATING), urgent and oldest first, with issue hints. */
  async verificationQueue(orgId: string, branchId?: string) {
    const rows = await this.prisma.prescription.findMany({
      where: { orgId, status: { in: ["RECEIVED", "VALIDATING"] }, ...(branchId ? { branchId } : {}) },
      include: { lines: true, patient: { select: { id: true, displayName: true, allergies: true } } }, orderBy: { receivedAt: "asc" }, take: 200,
    });
    const now = Date.now();
    const items = rows.map((r) => ({
      id: r.id, status: r.status, priority: r.priority, source: r.source, receivedAt: r.receivedAt, ageMinutes: Math.floor((now - r.receivedAt.getTime()) / 60_000), patient: r.patient, prescriberName: r.prescriberName,
      prescriberVerified: r.prescriberVerifiedBadge, lines: r.lines.length, controlled: r.lines.some((l) => l.controlled), hasAllergyOnFile: !!r.patient?.allergies.length, refillsAllowed: r.refillsAllowed, verificationNotes: r.verificationNotes,
      expiresInDays: r.validUntil ? Math.floor((r.validUntil.getTime() - now) / 86_400_000) : null,
    })).sort((a, b) => Number(b.priority === "URGENT") - Number(a.priority === "URGENT") || b.ageMinutes - a.ageMinutes);
    return { total: items.length, urgent: items.filter((i) => i.priority === "URGENT").length, items };
  }

  async annotate(user: AuthUser, id: string, d: { priority?: "NORMAL" | "URGENT"; verificationNotes?: string }) {
    await this.get(user.orgId, id);
    const r = await this.prisma.prescription.update({ where: { id }, data: { ...(d.priority ? { priority: d.priority } : {}), ...(d.verificationNotes !== undefined ? { verificationNotes: d.verificationNotes } : {}) } });
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "rx.annotate", entityType: "Prescription", entityId: id, meta: { fields: Object.keys(d) } } });
    return r;
  }

  /** Partial fills: what has been dispensed and what is still owed per line. */
  async balance(orgId: string, id: string) {
    const rx = await this.get(orgId, id);
    const lines = rx.lines.map((l) => ({ lineId: l.id, drugName: l.drug?.brandName ?? l.drugName ?? l.activeIngredient, prescribed: l.quantity, dispensed: l.qtyDispensed, remaining: Math.max(l.quantity - l.qtyDispensed, 0) }));
    return { prescriptionId: id, status: rx.status, lines, owed: lines.reduce((a, l) => a + l.remaining, 0), complete: lines.every((l) => l.remaining === 0), refillsAllowed: rx.refillsAllowed, refillsUsed: rx.refillsUsed, nextRefillDueAt: rx.nextRefillDueAt };
  }

  /** Partially dispensed prescriptions with quantity still owed to the patient. */
  async partialFills(orgId: string, branchId?: string) {
    const rows = await this.prisma.prescription.findMany({ where: { orgId, status: "PARTIALLY_DISPENSED", ...(branchId ? { branchId } : {}) }, include: { lines: true, patient: { select: { id: true, displayName: true, phone: true } } }, orderBy: { receivedAt: "asc" }, take: 200 });
    return rows.map((r) => ({ id: r.id, patient: r.patient, receivedAt: r.receivedAt, validUntil: r.validUntil, owed: r.lines.reduce((a, l) => a + Math.max(l.quantity - l.qtyDispensed, 0), 0) }));
  }

  /** KPRX04: substitution candidates for a prescription line (same ingredient + strength + form), with stock, price and savings vs the prescribed product. */
  async lineSubstitutes(user: AuthUser, id: string, lineId: string, branchId: string) {
    const rx = await this.get(user.orgId, id);
    const line = rx.lines.find((l) => l.id === lineId);
    if (!line) throw notFound("Prescription line", lineId);
    const base = line.drug;
    const ingredient = (base?.activeIngredient ?? line.activeIngredient ?? "").trim();
    if (!ingredient) return [];
    const strength = base?.strength ?? line.strength;
    const form = base?.dosageForm ?? line.dosageForm;
    const drugs = await this.prisma.drug.findMany({ where: { active: true, OR: [{ orgId: null }, { orgId: user.orgId }], activeIngredient: { equals: ingredient, mode: "insensitive" }, ...(strength ? { strength: { equals: strength, mode: "insensitive" } } : {}), ...(form ? { dosageForm: { equals: form, mode: "insensitive" } } : {}) }, take: 40 });
    const stock = await this.prisma.stockLot.groupBy({ by: ["drugId"], where: { orgId: user.orgId, branchId, drugId: { in: drugs.map((d) => d.id) }, status: { in: ["AVAILABLE", "RESERVED"] }, qtyOnHand: { gt: 0 } }, _sum: { qtyOnHand: true, qtyReserved: true } });
    const sm = new Map(stock.map((x) => [x.drugId, (x._sum.qtyOnHand ?? 0) - (x._sum.qtyReserved ?? 0)]));
    const prices = await this.prices.pricesAt(user.orgId, branchId, drugs.map((d) => d.id));
    const basePrice = base ? prices.get(base.id) : undefined;
    return drugs.map((d) => {
      const price = prices.get(d.id);
      return { drugId: d.id, brandName: d.brandName, brandNameAr: d.brandNameAr, strength: d.strength, dosageForm: d.dosageForm, available: Math.max(sm.get(d.id) ?? 0, 0), price: price?.toFixed(2) ?? null, isPrescribed: d.id === base?.id, saving: price && basePrice && d.id !== base?.id ? basePrice.minus(price).toFixed(2) : null };
    }).sort((a, b) => Number(b.available > 0) - Number(a.available > 0) || Number(a.price ?? 1e9) - Number(b.price ?? 1e9));
  }

  async get(orgId: string, id: string) {
    const rx = await this.prisma.prescription.findFirst({ where: { id, orgId }, include: { lines: { include: { drug: true } }, patient: true } });
    if (!rx) throw notFound("Prescription", id);
    return rx;
  }

  /** Signed, expiring download URL for the scan / attachment of an Rx (never a public or permanent link). */
  async scanUrl(orgId: string, id: string, ttlSec?: number) {
    const rx = await this.get(orgId, id);
    if (!rx.scanStorageKey) throw notFound("Prescription scan", id);
    const u = this.storage.signedUrl(rx.scanStorageKey, ttlSec);
    return { url: u.path, expiresAt: u.expiresAt };
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
