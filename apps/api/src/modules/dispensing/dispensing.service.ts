import { Inject, Injectable } from "@nestjs/common";
import { createHmac } from "node:crypto";
import { Prisma, type PaymentMethod } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { D, money, sum } from "../../common/money";
import type { AuthUser } from "../../auth/auth-user";
import { StockLedger } from "../inventory/stock-ledger.service";
import { allocateFefo, assertSellable } from "../inventory/lot-guard/lot-guard";
import { PriceService } from "../catalogue/price.service";
import { groupKey } from "../catalogue/normalize";
import { SalesService, type PaymentInput, type PricedLine } from "../pos/sales.service";
import { PspAdapter } from "../../platform/adapters/psp.adapter";
import { KERNEL, type MarketPackPort } from "../../kernel-adapter/ports";
import { DispenseHooks } from "../../common/dispense-hooks";
import { hasUnresolvedBlock, runSafetyChecks, type EngineItem } from "../prescriptions/safety/rx-safety-engine";
import { roleHas } from "../../auth/permissions";

/**
 * SAFETY PATH (KPRX03-06, ADR-025: NEVER behind a feature flag and not switchable).
 *  - safety.pharmacy.rx_safety_checks: checks run on every dispensing (create) and are persisted.
 *  - safety.pharmacy.pharmacist_signoff: SIGNED_OFF needs a licensed pharmacist user + timestamp (service AND DB CHECK / triggers).
 *  - safety.pharmacy.controlled_substance_log: controlled lines need ID capture + a log entry (service AND deferred DB trigger).
 * This module must not import FeatureFlagsService / RequiresFlag (enforced by safety-controls.node.test).
 */
export interface DispenseItemInput {
  prescriptionLineId?: string;
  drugId: string;
  quantity: number;
  /** KPRX04: substituting for the prescribed product. Needs pharmacist decision + patient consent. */
  substitution?: { fromDrugId: string; consent: boolean };
}
export interface CreateDispensingInput {
  branchId: string;
  prescriptionId?: string;
  kiorexOrderId?: string;
  patientId?: string;
  items: DispenseItemInput[];
}

const isPharmacist = (u: AuthUser) => roleHas(u.role, "dispense.signoff") && !!u.pharmacistLicenceNo;
const nidHash = (orgId: string, nid: string) => createHmac("sha256", process.env.NATIONAL_ID_PEPPER ?? "dev-only-pepper").update(`${orgId}:${nid}`).digest("hex");

@Injectable()
export class DispensingService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(StockLedger) private readonly ledger: StockLedger,
    @Inject(PriceService) private readonly prices: PriceService,
    @Inject(SalesService) private readonly sales: SalesService,
    @Inject(PspAdapter) private readonly psp: PspAdapter,
    @Inject(KERNEL.marketPacks) private readonly packs: MarketPackPort,
    @Inject(DispenseHooks) private readonly hooks: DispenseHooks,
  ) {}

  // ----------------------------------------------------------------------------------------------- create (validate, check, reserve)
  async create(user: AuthUser, input: CreateDispensingInput) {
    if (!input.items.length) throw new DomainError("NO_ITEMS", "Nothing to dispense", 400);
    const orgId = user.orgId;
    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
    const pack = this.packs.get(tenant.marketCode);

    const rx = input.prescriptionId
      ? await this.prisma.prescription.findFirst({ where: { id: input.prescriptionId, orgId }, include: { lines: true } })
      : null;
    if (input.prescriptionId && !rx) throw notFound("Prescription", input.prescriptionId);
    if (rx) {
      if (!["VALIDATED", "PARTIALLY_DISPENSED"].includes(rx.status)) throw new DomainError("RX_NOT_VALIDATED", `Prescription must be validated by a pharmacist first (status ${rx.status})`, 409);
      if (rx.source === "KIORLY_E_RX" && (!rx.consentVerifiedAt || (rx.consentExpiresAt && rx.consentExpiresAt < new Date()))) throw new DomainError("CONSENT_INVALID", "Patient consent for this e-Rx is missing or expired", 409);
    }

    const rxDrugIds = (rx?.lines ?? []).map((l) => l.drugId).filter((x): x is string => !!x);
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: [...new Set([...input.items.map((i) => i.drugId), ...rxDrugIds])] }, active: true, OR: [{ orgId: null }, { orgId }] } });
    const dm = new Map(drugs.map((d) => [d.id, d]));
    for (const it of input.items) {
      const d = dm.get(it.drugId);
      if (!d) throw notFound("Drug", it.drugId);
      if ((d.rxOnly || d.controlledSchedule !== "NONE") && !rx) throw new DomainError("RX_REQUIRED", `${d.brandName} requires a validated prescription`, 409, { drugId: d.id });
      if (!Number.isInteger(it.quantity) || it.quantity <= 0) throw new DomainError("INVALID_QUANTITY", "Quantity must be a positive whole number", 400);
    }

    // KPRX04 substitution rules + Rx line binding
    const bound = input.items.map((it) => {
      const drug = dm.get(it.drugId)!;
      let line = it.prescriptionLineId ? rx?.lines.find((l) => l.id === it.prescriptionLineId) : undefined;
      if (it.prescriptionLineId && !line) throw new DomainError("LINE_NOT_IN_RX", "Prescription line not found on this prescription", 409);
      if (rx && !line) {
        // bind to: the same prescribed product; else a prescribed product in the same substitution group (a substitution); else an ingredient-only line
        line = rx.lines.find((l) => l.drugId === it.drugId)
          ?? rx.lines.find((l) => l.drugId && drugs.find((d) => d.id === l.drugId)?.substitutionGroupId && drugs.find((d) => d.id === l.drugId)!.substitutionGroupId === drug.substitutionGroupId && (!it.substitution || it.substitution.fromDrugId === l.drugId))
          ?? rx.lines.find((l) => !l.drugId && l.activeIngredient && groupKey({ activeIngredient: l.activeIngredient, strength: drug.strength, dosageForm: drug.dosageForm }).activeIngredient === groupKey(drug).activeIngredient);
      }
      if (rx && !line) throw new DomainError("DRUG_NOT_PRESCRIBED", `${drug.brandName} does not match any prescription line`, 409, { drugId: drug.id });
      let substitution: { fromDrugId: string; consent: boolean; decidedBy: string } | null = null;
      if (line) {
        if (line.quantity - line.qtyDispensed < it.quantity) throw new DomainError("EXCEEDS_PRESCRIBED", `Only ${line.quantity - line.qtyDispensed} remaining on the prescription line`, 409, { lineId: line.id });
        if (line.activeIngredient && groupKey({ activeIngredient: drug.activeIngredient, strength: drug.strength, dosageForm: drug.dosageForm }).activeIngredient !== groupKey({ activeIngredient: line.activeIngredient, strength: drug.strength, dosageForm: drug.dosageForm }).activeIngredient)
          throw new DomainError("INGREDIENT_MISMATCH", `${drug.brandName} does not contain the prescribed ingredient`, 409);
      }
      const prescribedDrugId = line?.drugId ?? undefined;
      if (prescribedDrugId && prescribedDrugId !== it.drugId) {
        const prescribed = drugs.find((d) => d.id === prescribedDrugId);
        const sameGroup = prescribed && prescribed.substitutionGroupId && prescribed.substitutionGroupId === drug.substitutionGroupId;
        if (!sameGroup) throw new DomainError("SUBSTITUTION_NOT_EQUIVALENT", "Substitute must have the same active ingredient, strength and form", 409);
        if (!isPharmacist(user)) throw new DomainError("SUBSTITUTION_REQUIRES_PHARMACIST", "Only a pharmacist can decide a substitution", 403);
        if (!it.substitution?.consent) throw new DomainError("SUBSTITUTION_CONSENT_REQUIRED", "Patient consent for the substitution is required", 422);
        substitution = { fromDrugId: prescribedDrugId, consent: true, decidedBy: user.userId };
      }
      return { it, drug, line, substitution };
    });

    const patientId = input.patientId ?? rx?.patientId ?? undefined;
    const patient = patientId ? await this.prisma.patientRef.findFirst({ where: { id: patientId, orgId } }) : null;
    if (patientId && !patient) throw notFound("Patient", patientId);
    const recentRows = patient
      ? await this.prisma.dispensingLine.findMany({ where: { dispensing: { orgId, patientId: patient.id, status: "DISPENSED", dispensedAt: { gte: new Date(Date.now() - 30 * 86_400_000) } } }, include: { dispensing: { select: { dispensedAt: true } } } })
      : [];
    const recentDrugs = recentRows.length ? await this.prisma.drug.findMany({ where: { id: { in: recentRows.map((r) => r.drugId) } }, select: { id: true, activeIngredient: true } }) : [];
    const rd = new Map(recentDrugs.map((d) => [d.id, d.activeIngredient]));
    const engineItems: EngineItem[] = bound.map((b) => ({ drugId: b.drug.id, activeIngredient: b.drug.activeIngredient, quantity: b.it.quantity, controlledSchedule: b.drug.controlledSchedule, label: b.drug.brandName }));
    const results = runSafetyChecks(
      engineItems,
      { allergies: patient?.allergies ?? [], recent: recentRows.map((r) => ({ ingredient: rd.get(r.drugId) ?? "", dispensedAt: r.dispensing.dispensedAt ?? new Date() })).filter((r) => r.ingredient) },
      { hasRx: !!rx, prescriberName: rx?.prescriberName, prescriberLicenceNo: rx?.prescriberLicenceNo, prescriberVerifiedBadge: rx?.prescriberVerifiedBadge, validUntil: rx?.validUntil },
      { controlledQuantityLimit: pack.controlledQuantityLimit },
    );

    const at = new Date();
    return this.prisma.$transaction(async (tx) => {
      const disp = await tx.dispensing.create({ data: { orgId, branchId: input.branchId, prescriptionId: rx?.id, patientId: patient?.id, status: "VALIDATED", createdBy: user.userId, kiorexOrderRef: input.kiorexOrderId, safetyChecksRunAt: at } });
      await tx.safetyCheckResult.createMany({ data: results.map((r) => ({ dispensingId: disp.id, kind: r.kind, outcome: r.outcome, detail: r.detail })) });
      // KPINV02 FEFO reservation across lots (all-or-nothing)
      const takenByLot = new Map<string, number>();
      for (const b of bound) {
        const lots = (await tx.stockLot.findMany({ where: { orgId, branchId: input.branchId, drugId: b.drug.id, status: { in: ["AVAILABLE", "RESERVED"] }, qtyOnHand: { gt: 0 } } })).map((l) => ({ ...l, qtyReserved: l.qtyReserved + (takenByLot.get(l.id) ?? 0) }));
        const { picks, shortage } = allocateFefo(lots, b.it.quantity);
        if (shortage > 0) throw new DomainError("INSUFFICIENT_STOCK", `Not enough sellable stock for ${b.drug.brandName} (short by ${shortage})`, 409, { drugId: b.drug.id, shortage });
        const price = (await this.prices.priceAt(orgId, input.branchId, b.drug.id, at, tx)) ?? D(0);
        const vatRate = await this.sales.vatRateFor(orgId, b.drug);
        for (const p of picks) {
          takenByLot.set(p.lotId, (takenByLot.get(p.lotId) ?? 0) + p.quantity);
          await this.ledger.post(tx, { orgId, branchId: input.branchId, lotId: p.lotId, type: "RESERVE", quantity: p.quantity, performedBy: user.userId, refType: "Dispensing", refId: disp.id });
          await tx.dispensingLine.create({
            data: {
              dispensingId: disp.id, drugId: b.drug.id, lotId: p.lotId, quantity: p.quantity, prescriptionLineId: b.line?.id, unitPrice: price, vatRate,
              substitutedFromDrugId: b.substitution?.fromDrugId, substitutionConsent: !!b.substitution, substitutionDecidedBy: b.substitution?.decidedBy,
            },
          });
        }
      }
      await tx.dispensing.update({ where: { id: disp.id }, data: { status: "RESERVED" } });
      await tx.auditLog.create({ data: { orgId, actorId: user.userId, action: "dispense.create", entityType: "Dispensing", entityId: disp.id, meta: { prescriptionId: rx?.id ?? null, items: bound.length, blocks: results.filter((r) => r.outcome === "BLOCK").length, substitutions: bound.filter((b) => b.substitution).length } } });
      return disp.id;
    }, { timeout: 30_000 }).then((id) => this.get(orgId, id));
  }

  async get(orgId: string, id: string) {
    const d = await this.prisma.dispensing.findFirst({ where: { id, orgId }, include: { lines: { include: { lot: { select: { lotNumber: true, expiryDate: true, status: true } } } }, safetyChecks: { orderBy: { checkedAt: "asc" } }, controlledLog: true, prescription: { include: { patient: { select: { id: true, displayName: true } } } } } });
    if (!d) throw notFound("Dispensing", id);
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: d.lines.map((l) => l.drugId) } }, select: { id: true, brandName: true, brandNameAr: true, strength: true, controlledSchedule: true, rxOnly: true } });
    const dm = new Map(drugs.map((x) => [x.id, x]));
    return { ...d, lines: d.lines.map((l) => ({ ...l, drug: dm.get(l.drugId) })), unresolvedBlocks: d.safetyChecks.filter((c) => c.outcome === "BLOCK").length };
  }

  async list(orgId: string, q: { branchId?: string; status?: string; skip: number; take: number }) {
    const where: Prisma.DispensingWhereInput = { orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.status ? { status: q.status as never } : {}) };
    const [items, total] = await Promise.all([this.prisma.dispensing.findMany({ where, include: { lines: true, safetyChecks: true, prescription: { select: { id: true, source: true } } }, orderBy: { createdAt: "desc" }, skip: q.skip, take: q.take }), this.prisma.dispensing.count({ where })]);
    return { items, total };
  }

  // ----------------------------------------------------------------------------------------------- override a safety BLOCK (pharmacist only, attributed)
  async override(user: AuthUser, id: string, checkId: string, reason: string) {
    if (!isPharmacist(user)) throw new DomainError("PHARMACIST_REQUIRED", "Only a licensed pharmacist can override a safety check", 403);
    const d = await this.get(user.orgId, id);
    if (!["RESERVED", "VALIDATED"].includes(d.status)) throw new DomainError("BAD_STATE", `Dispensing is ${d.status}`, 409);
    const c = d.safetyChecks.find((x) => x.id === checkId);
    if (!c) throw notFound("Safety check", checkId);
    if (c.outcome !== "BLOCK") throw new DomainError("NOT_BLOCKED", "Only BLOCK results are overridden", 409);
    if (c.kind === "CONTROLLED_LIMIT" || c.kind === "PRESCRIBER" || c.kind === "DOSE_QUANTITY") throw new DomainError("NOT_OVERRIDABLE", `${c.kind} blocks are regulatory hard stops and cannot be overridden`, 403);
    await this.prisma.safetyCheckResult.update({ where: { id: checkId }, data: { outcome: "OVERRIDDEN_BY_PHARMACIST", overriddenBy: user.userId, overrideReason: reason } });
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "dispense.safety_override", entityType: "Dispensing", entityId: id, meta: { kind: c.kind, reason } } });
    return this.get(user.orgId, id);
  }

  // ----------------------------------------------------------------------------------------------- controlled ID capture (KPRX05)
  async captureControlledId(user: AuthUser, id: string, input: { nationalId: string; patientName: string }) {
    if (!/^\d{14}$/.test(input.nationalId)) throw new DomainError("INVALID_NATIONAL_ID", "National ID must be 14 digits", 400);
    const d = await this.get(user.orgId, id);
    if (!["RESERVED", "VALIDATED", "SIGNED_OFF"].includes(d.status)) throw new DomainError("BAD_STATE", `Dispensing is ${d.status}`, 409);
    const patientId = d.patientId;
    if (!patientId) throw new DomainError("PATIENT_REQUIRED", "A controlled dispensing needs a patient record", 409);
    await this.prisma.$transaction(async (tx) => {
      await tx.patientRef.update({ where: { id: patientId }, data: { nationalIdHash: nidHash(user.orgId, input.nationalId), nationalIdLast4: input.nationalId.slice(-4), displayName: input.patientName } });
      await tx.dispensing.update({ where: { id }, data: { controlledIdCaptured: true } });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "dispense.controlled_id", entityType: "Dispensing", entityId: id } });
    });
    return this.get(user.orgId, id);
  }

  // ----------------------------------------------------------------------------------------------- pharmacist sign-off (KPRX06)
  async signOff(user: AuthUser, id: string, counsellingNotes?: string) {
    if (!isPharmacist(user)) throw new DomainError("PHARMACIST_REQUIRED", "Only a licensed pharmacist can sign off a dispensing", 403);
    const d = await this.get(user.orgId, id);
    if (d.status !== "RESERVED") throw new DomainError("BAD_STATE", `Dispensing must be RESERVED to sign off (is ${d.status})`, 409);
    if (!d.safetyChecksRunAt) throw new DomainError("SAFETY_CHECKS_NOT_RUN", "Safety checks have not run", 409);
    const kinds = new Set(d.safetyChecks.map((c) => c.kind));
    for (const k of ["INTERACTION", "ALLERGY", "DUPLICATE_THERAPY", "DOSE_QUANTITY", "PRESCRIBER", "CONTROLLED_LIMIT"] as const) if (!kinds.has(k)) throw new DomainError("SAFETY_CHECKS_INCOMPLETE", `Safety check ${k} is missing`, 409);
    if (hasUnresolvedBlock(d.safetyChecks)) throw new DomainError("SAFETY_BLOCK_UNRESOLVED", "Resolve or override every BLOCK before sign-off", 409, { blocks: d.safetyChecks.filter((c) => c.outcome === "BLOCK").map((c) => ({ id: c.id, kind: c.kind, detail: c.detail })) });
    const controlled = d.lines.some((l) => l.drug && l.drug.controlledSchedule !== "NONE");
    if (controlled && !d.controlledIdCaptured) throw new DomainError("CONTROLLED_ID_REQUIRED", "Capture the patient ID before signing off a controlled medicine", 409);
    // the lots reserved earlier must still be sellable (recall / quarantine / expiry may have happened since)
    const blocked: Array<{ lotId: string; reason: string }> = [];
    for (const l of d.lines) { try { assertSellable({ id: l.lotId, status: l.lot.status, expiryDate: l.lot.expiryDate }); } catch (e) { blocked.push({ lotId: l.lotId, reason: (e as DomainError).message }); } }
    if (blocked.length) throw new DomainError("LOT_BLOCKED", "A reserved lot has been blocked since reservation; re-pick the lots", 409, { blocked, repick: true });
    const now = new Date();
    await this.prisma.$transaction(async (tx) => {
      await tx.dispensing.update({ where: { id }, data: { status: "SIGNED_OFF", pharmacistId: user.userId, signedOffAt: now, counsellingNotes } });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "dispense.signoff", entityType: "Dispensing", entityId: id, meta: { signedOffAt: now.toISOString() } } });
    });
    return this.get(user.orgId, id);
  }

  /** Releases the current reservations and re-picks FEFO lots (after a recall/quarantine hit a reserved lot). Clears any sign-off. */
  async repick(user: AuthUser, id: string) {
    await this.prisma.$transaction(async (tx) => {
      const d = await tx.dispensing.findFirst({ where: { id, orgId: user.orgId }, include: { lines: true } });
      if (!d) throw notFound("Dispensing", id);
      if (!["RESERVED", "SIGNED_OFF"].includes(d.status)) throw new DomainError("BAD_STATE", `Dispensing is ${d.status}`, 409);
      const byDrug = new Map<string, { qty: number; lines: typeof d.lines }>();
      for (const l of d.lines) {
        await this.releaseReservation(tx, user, d.branchId, l.lotId, l.quantity, id);
        const e = byDrug.get(l.drugId) ?? { qty: 0, lines: [] };
        e.qty += l.quantity; e.lines.push(l); byDrug.set(l.drugId, e);
      }
      await tx.dispensing.update({ where: { id }, data: { status: "VALIDATED", pharmacistId: null, signedOffAt: null } });
      await tx.dispensingLine.deleteMany({ where: { dispensingId: id } });
      for (const [drugId, e] of byDrug) {
        const lots = await tx.stockLot.findMany({ where: { orgId: user.orgId, branchId: d.branchId, drugId, status: { in: ["AVAILABLE", "RESERVED"] }, qtyOnHand: { gt: 0 } } });
        const { picks, shortage } = allocateFefo(lots, e.qty);
        if (shortage > 0) throw new DomainError("INSUFFICIENT_STOCK", `Not enough sellable stock after re-pick (short by ${shortage})`, 409, { drugId });
        const template = e.lines[0]!;
        for (const p of picks) {
          await this.ledger.post(tx, { orgId: user.orgId, branchId: d.branchId, lotId: p.lotId, type: "RESERVE", quantity: p.quantity, performedBy: user.userId, refType: "Dispensing", refId: id });
          await tx.dispensingLine.create({ data: { dispensingId: id, drugId, lotId: p.lotId, quantity: p.quantity, prescriptionLineId: template.prescriptionLineId, unitPrice: template.unitPrice, vatRate: template.vatRate, substitutedFromDrugId: template.substitutedFromDrugId, substitutionConsent: template.substitutionConsent, substitutionDecidedBy: template.substitutionDecidedBy } });
        }
      }
      await tx.dispensing.update({ where: { id }, data: { status: "RESERVED" } });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "dispense.repick", entityType: "Dispensing", entityId: id } });
    });
    return this.get(user.orgId, id);
  }

  private async releaseReservation(tx: Prisma.TransactionClient, user: AuthUser, branchId: string, lotId: string, quantity: number, dispensingId: string) {
    // releasing a reservation is always allowed (even on a now-blocked lot): it only frees quantity
    await this.ledger.post(tx, { orgId: user.orgId, branchId, lotId, type: "RELEASE_RESERVATION", quantity, performedBy: user.userId, refType: "Dispensing", refId: dispensingId });
  }

  async cancel(user: AuthUser, id: string, reason: string) {
    await this.prisma.$transaction(async (tx) => {
      const d = await tx.dispensing.findFirst({ where: { id, orgId: user.orgId }, include: { lines: true } });
      if (!d) throw notFound("Dispensing", id);
      if (!["VALIDATED", "RESERVED", "SIGNED_OFF", "DRAFT"].includes(d.status)) throw new DomainError("BAD_STATE", `Dispensing is ${d.status}`, 409);
      if (d.status !== "VALIDATED" && d.status !== "DRAFT") for (const l of d.lines) await this.releaseReservation(tx, user, d.branchId, l.lotId, l.quantity, id);
      await tx.dispensing.update({ where: { id }, data: { status: "CANCELLED", counsellingNotes: d.counsellingNotes } });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "dispense.cancel", entityType: "Dispensing", entityId: id, meta: { reason } } });
    });
    return this.get(user.orgId, id);
  }

  // ----------------------------------------------------------------------------------------------- dispense & pay
  async complete(user: AuthUser, id: string, input: { idempotencyKey: string; payments?: PaymentInput[]; customerAccountId?: string; prepaid?: boolean }) {
    const d = await this.get(user.orgId, id);
    if (d.status === "DISPENSED") {
      const sale = d.saleId ? await this.sales.getSale(user.orgId, d.saleId) : null;
      return { dispensing: d, sale, replayed: true };
    }
    if (d.status !== "SIGNED_OFF" || !d.pharmacistId || !d.signedOffAt) throw new DomainError("SIGNOFF_REQUIRED", "A pharmacist must sign off before dispensing", 409);
    const controlledLines = d.lines.filter((l) => l.drug && l.drug.controlledSchedule !== "NONE");
    if (controlledLines.length && !d.controlledIdCaptured) throw new DomainError("CONTROLLED_ID_REQUIRED", "Controlled medicine: patient ID capture required", 409);

    const priced: PricedLine[] = d.lines.map((l) => ({ drugId: l.drugId, lotId: l.lotId, quantity: l.quantity, unitPrice: l.unitPrice, discount: D(0), vatRate: l.vatRate, vatAmount: this.vat(l.unitPrice.mul(l.quantity), l.vatRate), negative: false }));
    const totals = this.sales.totals(priced);
    const prepaid = !!input.prepaid || !!d.kiorexOrderRef;
    let payments: Array<{ method: PaymentMethod; amount: Prisma.Decimal; reference?: string; status: string }>;
    let change = D(0);
    if (prepaid) payments = [{ method: "KIOREX_PREPAID", amount: totals.total, status: "CAPTURED" }];
    else {
      if (!input.payments?.length) throw new DomainError("PAYMENT_REQUIRED", "Payment is required to complete a dispensing", 402);
      const cap = await this.sales.capturePayments(user, `${input.idempotencyKey}`, totals.total, input.payments, input.customerAccountId);
      payments = cap.payments; change = cap.change;
    }
    const shift = await this.prisma.shift.findFirst({ where: { orgId: user.orgId, branchId: d.branchId, status: "OPEN" } });
    const credit = sum(payments.filter((p) => p.method === "CUSTOMER_CREDIT").map((p) => p.amount));

    try {
      const out = await this.prisma.$transaction(async (tx) => {
        const fresh = await tx.dispensing.findUniqueOrThrow({ where: { id } });
        if (fresh.status !== "SIGNED_OFF") throw new DomainError("BAD_STATE", `Dispensing is ${fresh.status}`, 409);
        // stock: free the reservation then post DISPENSE (the DB trigger re-checks lot status/expiry and the pharmacist sign-off)
        for (const l of d.lines) {
          await this.releaseReservation(tx, user, d.branchId, l.lotId, l.quantity, id);
          await this.ledger.post(tx, { orgId: user.orgId, branchId: d.branchId, lotId: l.lotId, type: "DISPENSE", quantity: l.quantity, performedBy: user.userId, refType: "Dispensing", refId: id });
        }
        if (credit.gt(0)) {
          const [acct] = await tx.$queryRaw<Array<{ balance: Prisma.Decimal; creditLimit: Prisma.Decimal }>>`SELECT balance, "creditLimit" FROM "CustomerAccount" WHERE id = ${input.customerAccountId} AND "orgId" = ${user.orgId} FOR UPDATE`;
          if (!acct || D(acct.balance).plus(credit).gt(acct.creditLimit)) throw new DomainError("CREDIT_LIMIT_EXCEEDED", "Customer credit limit would be exceeded", 402);
        }
        const sale = await this.sales.persist(tx, { user, branchId: d.branchId, shiftId: shift?.id ?? null, idempotencyKey: `rx:${id}`, lines: priced, payments, customerAccountId: input.customerAccountId, dispensingId: id, stockAlreadyPosted: true, channel: d.kiorexOrderRef ? "KIOREX_ORDER" : "POS" });
        if (credit.gt(0)) {
          await tx.customerCreditEntry.create({ data: { orgId: user.orgId, accountId: input.customerAccountId!, kind: "CHARGE", amount: credit, saleId: sale.id, createdBy: user.userId } });
          await tx.customerAccount.update({ where: { id: input.customerAccountId! }, data: { balance: { increment: credit } } });
        }
        // controlled-substance log (append-only; the deferred DB trigger refuses DISPENSED without it)
        if (controlledLines.length) {
          const patient = await tx.patientRef.findUniqueOrThrow({ where: { id: d.patientId! } });
          if (!patient.nationalIdLast4) throw new DomainError("CONTROLLED_ID_REQUIRED", "Patient ID not on file", 409);
          for (const l of controlledLines) {
            await tx.controlledSubstanceLogEntry.create({
              data: { orgId: user.orgId, branchId: d.branchId, dispensingId: id, drugId: l.drugId, lotId: l.lotId, quantity: l.quantity, patientNationalIdLast4: patient.nationalIdLast4, patientNationalIdHash: patient.nationalIdHash, patientName: patient.displayName, prescriptionId: d.prescriptionId, prescriberLicenceNo: d.prescription?.prescriberLicenceNo, pharmacistId: d.pharmacistId! },
            });
          }
        }
        // Rx progress
        if (d.prescriptionId) {
          for (const l of d.lines) if (l.prescriptionLineId) await tx.prescriptionLine.update({ where: { id: l.prescriptionLineId }, data: { qtyDispensed: { increment: l.quantity } } });
          const lines = await tx.prescriptionLine.findMany({ where: { prescriptionId: d.prescriptionId } });
          await tx.prescription.update({ where: { id: d.prescriptionId }, data: { status: lines.every((x) => x.qtyDispensed >= x.quantity) ? "DISPENSED" : "PARTIALLY_DISPENSED" } });
        }
        const dispensedAt = new Date();
        await tx.dispensing.update({ where: { id }, data: { status: "DISPENSED", dispensedAt, saleId: sale.id } });
        await this.hooks.run(tx, { orgId: user.orgId, branchId: d.branchId, dispensingId: id, kiorexOrderRef: d.kiorexOrderRef, pharmacistId: d.pharmacistId!, signedOffAt: d.signedOffAt!, dispensedAt, saleId: sale.id, saleTotal: money(totals.total) });
        await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "dispense.complete", entityType: "Dispensing", entityId: id, meta: { saleId: sale.id, controlled: controlledLines.length, total: money(totals.total) } } });
        return sale.id;
      }, { timeout: 30_000 });
      return { dispensing: await this.get(user.orgId, id), sale: await this.sales.getSale(user.orgId, out), change: money(change), replayed: false };
    } catch (e) {
      for (const p of payments) if (p.reference && p.method !== "CASH") await this.psp.refund({ orgId: user.orgId, reference: p.reference, amount: money(p.amount), idempotencyKey: `${input.idempotencyKey}:compensate` }).catch(() => undefined);
      throw e;
    }
  }

  private vat(gross: Prisma.Decimal, rate: Prisma.Decimal) {
    return rate.isZero() ? D(0) : gross.mul(rate).div(rate.plus(1)).toDecimalPlaces(2);
  }

  /** KPRX05 controlled-substance register for an auditor (never exposed to Kiorex). */
  async controlledRegister(orgId: string, q: { branchId?: string; from?: Date; to?: Date; skip: number; take: number }) {
    const where: Prisma.ControlledSubstanceLogEntryWhereInput = { orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.from || q.to ? { loggedAt: { ...(q.from ? { gte: q.from } : {}), ...(q.to ? { lte: q.to } : {}) } } : {}) };
    const [items, total] = await Promise.all([this.prisma.controlledSubstanceLogEntry.findMany({ where, orderBy: { loggedAt: "desc" }, skip: q.skip, take: q.take }), this.prisma.controlledSubstanceLogEntry.count({ where })]);
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: items.map((i) => i.drugId) } }, select: { id: true, brandName: true, controlledSchedule: true } });
    const dm = new Map(drugs.map((x) => [x.id, x]));
    return { total, items: items.map((i) => ({ ...i, drug: dm.get(i.drugId) })) };
  }
}

