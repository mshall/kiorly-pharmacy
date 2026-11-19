import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { D, money, sum } from "../../common/money";
import type { AuthUser } from "../../auth/auth-user";
import { OutboxService } from "../../outbox/outbox.service";
import { DispenseHooks } from "../../common/dispense-hooks";
import { DispensingService } from "../dispensing/dispensing.service";
import { InventoryService } from "../inventory/inventory.service";
import { KERNEL, type SettlementPort } from "../../kernel-adapter/ports";
import { isKiorexExposable } from "../catalogue/kiorex-projection";
import { NotificationsService } from "../../platform/adapters/notifications.service";
import { DEFAULT_RX_VALIDITY_DAYS } from "../prescriptions/prescriptions.service";

export interface IngestOrderInput {
  orderId: string;
  branchId: string;
  customer?: { name?: string; phone?: string; address?: string };
  prepaid?: boolean;
  lines: Array<{ sku: string; quantity: number; unitPrice: string }>;
  prescription?: { patientRef?: string; prescriberName?: string; prescriberLicenceNo?: string; issuedAt?: string; scanRef?: string };
}

@Injectable()
export class MarketplaceService implements OnModuleInit {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(OutboxService) private readonly outbox: OutboxService,
    @Inject(DispenseHooks) private readonly hooks: DispenseHooks,
    @Inject(DispensingService) private readonly dispensing: DispensingService,
    @Inject(InventoryService) private readonly inv: InventoryService,
    @Inject(KERNEL.settlement) private readonly settlement: SettlementPort,
    @Inject(NotificationsService) private readonly notify: NotificationsService,
  ) {}

  /** KPMKT05: DispenseCompleted fires from the dispensing transaction hook (outbox row commits atomically with the dispense). */
  onModuleInit() {
    this.hooks.register(async (tx, c) => {
      if (!c.kiorexOrderRef) return;
      const order = await tx.kiorexOrder.findFirst({ where: { id: c.kiorexOrderRef, orgId: c.orgId } });
      if (!order) return;
      await tx.kiorexOrder.update({ where: { id: order.id }, data: { status: "DISPENSED", dispensingId: c.dispensingId } });
      const pharmacyId = await this.pharmacyId(tx, c.orgId);
      await this.outbox.enqueue({
        orgId: c.orgId, type: "DispenseCompleted", aggregateId: order.externalOrderId, dedupeKey: `DispenseCompleted:${order.id}`,
        data: { orderId: order.externalOrderId, pharmacyId, branchId: c.branchId, dispensedAt: c.dispensedAt.toISOString(), pharmacistSignoff: { userId: c.pharmacistId, signedAt: c.signedOffAt.toISOString() }, partial: order.status === "PARTIALLY_ACCEPTED" },
      }, tx);
      // money path: idempotent settlement entry per fulfilled order (kernel seam)
      await this.settlement.recordFulfilledOrder({ orgId: c.orgId, orderRef: order.externalOrderId, orderValue: c.saleTotal });
    });
  }

  private async pharmacyId(db: Prisma.TransactionClient | PrismaService, orgId: string) {
    const t = await db.tenant.findUniqueOrThrow({ where: { id: orgId } });
    return t.externalOrgId ?? t.id;
  }

  // ------------------------------------------------------------------------------------------------ KPMKT01 opt-in
  async getSetting(orgId: string, branchId: string) {
    return (await this.prisma.branchMarketplaceSetting.findUnique({ where: { branchId } })) ?? { orgId, branchId, optedIn: false, deliveryRadiusKm: D(5), openingHours: null, prepMinutes: 30, slaMinutes: 10, latitude: null, longitude: null };
  }
  async listSettings(orgId: string) { return this.prisma.branchMarketplaceSetting.findMany({ where: { orgId } }); }
  async putSetting(user: AuthUser, branchId: string, d: { optedIn: boolean; deliveryRadiusKm?: string; openingHours?: Record<string, string[]>; prepMinutes?: number; slaMinutes?: number; latitude?: string; longitude?: string }) {
    const branch = await this.prisma.branch.findFirst({ where: { id: branchId, orgId: user.orgId } });
    if (!branch) throw notFound("Branch", branchId);
    const data = { optedIn: d.optedIn, deliveryRadiusKm: d.deliveryRadiusKm, openingHours: d.openingHours as Prisma.InputJsonValue | undefined, prepMinutes: d.prepMinutes, slaMinutes: d.slaMinutes, latitude: d.latitude, longitude: d.longitude, updatedAt: new Date() };
    const r = await this.prisma.branchMarketplaceSetting.upsert({ where: { branchId }, create: { orgId: user.orgId, branchId, ...data }, update: data });
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "marketplace.settings", entityType: "Branch", entityId: branchId, meta: { optedIn: d.optedIn } } });
    return r;
  }

  // ------------------------------------------------------------------------------------------------ KPINV07 stock exposure (never controlled)
  async availability(orgId: string) {
    const settings = await this.prisma.branchMarketplaceSetting.findMany({ where: { orgId, optedIn: true } });
    const branches = [];
    for (const s of settings) {
      const atp = await this.inv.atp(orgId, s.branchId);
      const drugs = await this.prisma.drug.findMany({ where: { id: { in: [...atp.keys()] } } });
      const items = drugs.filter((d) => isKiorexExposable(d)).map((d) => ({ sku: d.id, gtin: d.gtin, name: d.brandName, availableQty: atp.get(d.id) ?? 0, requiresPrescription: d.rxOnly }));
      branches.push({ branchId: s.branchId, deliveryRadiusKm: s.deliveryRadiusKm.toString(), prepMinutes: s.prepMinutes, openingHours: s.openingHours, items });
    }
    return { generatedAt: new Date().toISOString(), branches };
  }

  // ------------------------------------------------------------------------------------------------ KPMKT02 ingest + inbox
  async ingest(orgId: string, input: IngestOrderInput) {
    const dup = await this.prisma.kiorexOrder.findUnique({ where: { orgId_externalOrderId: { orgId, externalOrderId: input.orderId } }, include: { lines: true } });
    if (dup) return { order: dup, replayed: true };
    const setting = await this.prisma.branchMarketplaceSetting.findFirst({ where: { orgId, branchId: input.branchId, optedIn: true } });
    if (!setting) throw new DomainError("BRANCH_NOT_OPTED_IN", "Branch is not accepting Kiorex orders", 409);
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: input.lines.map((l) => l.sku) }, OR: [{ orgId: null }, { orgId }] } });
    const dm = new Map(drugs.map((d) => [d.id, d]));
    for (const l of input.lines) {
      const d = dm.get(l.sku);
      if (!d) throw new DomainError("UNKNOWN_SKU", `Unknown sku ${l.sku}`, 422, { sku: l.sku });
      if (!isKiorexExposable(d)) throw new DomainError("CONTROLLED_NOT_ORDERABLE", "Controlled medicines can never be ordered through Kiorex", 422, { sku: l.sku });
    }
    const hasRx = input.lines.some((l) => dm.get(l.sku)!.rxOnly);
    if (hasRx && !input.prescription?.prescriberName) throw new DomainError("PRESCRIPTION_REQUIRED", "Rx items need prescription details (uploaded by the patient)", 422);
    const orderValue = sum(input.lines.map((l) => D(l.unitPrice).mul(l.quantity)));
    const created = await this.prisma.$transaction(async (tx) => {
      let prescriptionId: string | undefined;
      if (hasRx) {
        const p = input.prescription!;
        const patient = await tx.patientRef.create({ data: { orgId, externalId: p.patientRef, displayName: input.customer?.name ?? "Kiorex patient", phone: input.customer?.phone } });
        const issued = p.issuedAt ? new Date(p.issuedAt) : new Date();
        const rx = await tx.prescription.create({
          data: { orgId, branchId: input.branchId, source: "KIOREX_UPLOAD", patientId: patient.id, prescriberName: p.prescriberName, prescriberLicenceNo: p.prescriberLicenceNo, issuedAt: issued, validUntil: new Date(issued.getTime() + DEFAULT_RX_VALIDITY_DAYS * 86_400_000), sourceRxRef: p.scanRef, kiorexOrderId: input.orderId },
        });
        for (const l of input.lines.filter((x) => dm.get(x.sku)!.rxOnly)) {
          const d = dm.get(l.sku)!;
          await tx.prescriptionLine.create({ data: { prescriptionId: rx.id, drugId: d.id, activeIngredient: d.activeIngredient, strength: d.strength, dosageForm: d.dosageForm, drugName: d.brandName, quantity: l.quantity, controlled: false } });
        }
        prescriptionId = rx.id;
      }
      const o = await tx.kiorexOrder.create({
        data: {
          orgId, branchId: input.branchId, externalOrderId: input.orderId, hasRx, prescriptionId, customerName: input.customer?.name, customerPhone: input.customer?.phone, deliveryAddress: input.customer?.address, prepaid: input.prepaid ?? true,
          orderValue, slaDueAt: new Date(Date.now() + setting.slaMinutes * 60_000), lines: { create: input.lines.map((l) => ({ drugId: l.sku, qtyRequested: l.quantity, unitPrice: l.unitPrice })) },
        },
        include: { lines: true },
      });
      await tx.auditLog.create({ data: { orgId, action: "order.received", entityType: "KiorexOrder", entityId: o.id, meta: { externalOrderId: input.orderId, hasRx, lines: input.lines.length } } });
      return o;
    });
    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
    const s = (tenant.settings ?? {}) as { ownerPhone?: string; defaultLocale?: "ar" | "en" };
    if (s.ownerPhone) await this.notify.send({ orgId, channel: "WHATSAPP", recipient: s.ownerPhone, template: "order.inbox", locale: s.defaultLocale ?? "ar", vars: { order: input.orderId, minutes: setting.slaMinutes }, refType: "KiorexOrder", refId: created.id });
    return { order: created, replayed: false };
  }

  async inbox(orgId: string, q: { branchId?: string; status?: string }) {
    const orders = await this.prisma.kiorexOrder.findMany({ where: { orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.status ? { status: q.status as never } : {}) }, include: { lines: true }, orderBy: { createdAt: "desc" }, take: 100 });
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: orders.flatMap((o) => o.lines.map((l) => l.drugId)) } }, select: { id: true, brandName: true, brandNameAr: true, rxOnly: true } });
    const dm = new Map(drugs.map((d) => [d.id, d]));
    const now = Date.now();
    return orders.map((o) => ({ ...o, orderValue: money(o.orderValue), slaRemainingSeconds: o.status === "RECEIVED" ? Math.floor((o.slaDueAt.getTime() - now) / 1000) : null, slaBreached: o.status === "RECEIVED" && o.slaDueAt.getTime() < now, lines: o.lines.map((l) => ({ ...l, unitPrice: money(l.unitPrice), drug: dm.get(l.drugId) })) }));
  }

  async get(orgId: string, id: string) {
    const order = await this.prisma.kiorexOrder.findFirst({ where: { id, orgId }, include: { lines: true } });
    if (!order) throw notFound("Order", id);
    return order;
  }

  // ------------------------------------------------------------------------------------------------ KPMKT02-04 accept / partial / reject
  async accept(user: AuthUser, id: string, lineAcceptances?: Array<{ lineId: string; qtyAccepted: number }>) {
    const order = await this.prisma.kiorexOrder.findFirst({ where: { id, orgId: user.orgId }, include: { lines: true } });
    if (!order) throw notFound("Order", id);
    if (order.status !== "RECEIVED") throw new DomainError("BAD_STATE", `Order is ${order.status}`, 409);
    // KPMKT04 (safety): Rx orders need pharmacist validation BEFORE acceptance
    if (order.hasRx) {
      const rx = order.prescriptionId ? await this.prisma.prescription.findFirst({ where: { id: order.prescriptionId, orgId: user.orgId } }) : null;
      if (!rx || rx.status !== "VALIDATED" || !rx.validatedBy) throw new DomainError("RX_VALIDATION_REQUIRED", "A pharmacist must validate the prescription before the order can be accepted", 409, { prescriptionId: order.prescriptionId });
    }
    const want = order.lines.map((l) => ({ line: l, qty: Math.min(lineAcceptances?.find((a) => a.lineId === l.id)?.qtyAccepted ?? l.qtyRequested, l.qtyRequested) })).filter((x) => x.qty > 0);
    if (!want.length) throw new DomainError("NOTHING_ACCEPTED", "Accept at least one line or reject the order", 400);
    const atp = await this.inv.atp(user.orgId, order.branchId);
    const accepted = want.map((x) => ({ ...x, qty: Math.min(x.qty, atp.get(x.line.drugId) ?? 0) })).filter((x) => x.qty > 0);
    if (!accepted.length) throw new DomainError("NO_STOCK", "None of the requested items can be reserved; reject the order", 409);
    // lots are reserved through a Dispensing (FEFO + Rx safety checks + pharmacist sign-off still apply to marketplace orders)
    const disp = await this.dispensing.create(user, {
      branchId: order.branchId, prescriptionId: order.prescriptionId ?? undefined, kiorexOrderId: order.id,
      items: accepted.map((a) => ({ drugId: a.line.drugId, quantity: a.qty })),
    });
    const full = accepted.length === order.lines.length && accepted.every((a) => a.qty === a.line.qtyRequested);
    await this.prisma.$transaction(async (tx) => {
      for (const a of accepted) await tx.kiorexOrderLine.update({ where: { id: a.line.id }, data: { qtyAccepted: a.qty } });
      await tx.kiorexOrder.update({ where: { id }, data: { status: full ? "ACCEPTED" : "PARTIALLY_ACCEPTED", respondedAt: new Date(), respondedBy: user.userId, dispensingId: disp.id } });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "order.accept", entityType: "KiorexOrder", entityId: id, meta: { partial: !full, dispensingId: disp.id } } });
    });
    return { order: await this.get(user.orgId, id), dispensing: disp };
  }

  async reject(user: AuthUser, id: string, reason: string, reasonCode?: string) {
    const order = await this.prisma.kiorexOrder.findFirst({ where: { id, orgId: user.orgId } });
    if (!order) throw notFound("Order", id);
    if (!["RECEIVED", "ACCEPTED", "PARTIALLY_ACCEPTED", "READY"].includes(order.status)) throw new DomainError("BAD_STATE", `Order is ${order.status}`, 409);
    if (order.dispensingId) await this.dispensing.cancel(user, order.dispensingId, `Order rejected: ${reason}`);
    await this.prisma.$transaction(async (tx) => {
      await tx.kiorexOrder.update({ where: { id }, data: { status: "REJECTED", rejectionReason: reason, rejectionCode: reasonCode, respondedAt: new Date(), respondedBy: user.userId } });
      await this.outbox.enqueue({ orgId: user.orgId, type: "OrderRejected", aggregateId: order.externalOrderId, dedupeKey: `OrderRejected:${order.id}`, data: { orderId: order.externalOrderId, pharmacyId: await this.pharmacyId(tx, user.orgId), rejectedAt: new Date().toISOString(), reason, ...(reasonCode ? { reasonCode } : {}) } }, tx);
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "order.reject", entityType: "KiorexOrder", entityId: id, meta: { reasonCode: reasonCode ?? null } } });
    });
    return this.get(user.orgId, id);
  }

  /** OrderReady: requires the pharmacist sign-off on the linked dispensing (contract field pharmacistSignoff is mandatory). */
  async markReady(user: AuthUser, id: string) {
    const order = await this.prisma.kiorexOrder.findFirst({ where: { id, orgId: user.orgId } });
    if (!order) throw notFound("Order", id);
    if (!["ACCEPTED", "PARTIALLY_ACCEPTED"].includes(order.status) || !order.dispensingId) throw new DomainError("BAD_STATE", `Order is ${order.status}`, 409);
    const d = await this.prisma.dispensing.findUniqueOrThrow({ where: { id: order.dispensingId } });
    if (d.status !== "SIGNED_OFF" || !d.pharmacistId || !d.signedOffAt) throw new DomainError("SIGNOFF_REQUIRED", "A pharmacist must sign off the dispensing before the order is ready", 409);
    await this.prisma.$transaction(async (tx) => {
      await tx.kiorexOrder.update({ where: { id }, data: { status: "READY", readyAt: new Date() } });
      await this.outbox.enqueue({
        orgId: user.orgId, type: "OrderReady", aggregateId: order.externalOrderId, dedupeKey: `OrderReady:${order.id}`,
        data: { orderId: order.externalOrderId, pharmacyId: await this.pharmacyId(tx, user.orgId), branchId: order.branchId, readyAt: new Date().toISOString(), pharmacistSignoff: { userId: d.pharmacistId!, signedAt: d.signedOffAt!.toISOString() } },
      }, tx);
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "order.ready", entityType: "KiorexOrder", entityId: id } });
    });
    return this.get(user.orgId, id);
  }

  /** Kiorex cancels an order (HMAC). Releases the reservations. */
  async cancelByKiorex(orgId: string, externalOrderId: string) {
    const order = await this.prisma.kiorexOrder.findUnique({ where: { orgId_externalOrderId: { orgId, externalOrderId } } });
    if (!order) throw notFound("Order", externalOrderId);
    if (order.status === "DISPENSED") throw new DomainError("ALREADY_DISPENSED", "Order already dispensed", 409);
    if (order.dispensingId && ["ACCEPTED", "PARTIALLY_ACCEPTED", "READY"].includes(order.status)) {
      const sys = await this.prisma.staffUser.findFirst({ where: { orgId, role: "OWNER" } });
      if (sys) await this.dispensing.cancel({ userId: sys.id, orgId, role: sys.role, displayName: sys.displayName, branchId: null, market: "EG", edition: "LITE", pharmacistLicenceNo: null, mfa: false }, order.dispensingId, "Cancelled by Kiorex");
    }
    await this.prisma.kiorexOrder.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
    await this.prisma.auditLog.create({ data: { orgId, action: "order.cancel_by_kiorex", entityType: "KiorexOrder", entityId: order.id } });
    return { status: "CANCELLED" };
  }

  /** SLA sweep: unanswered orders past their SLA are rejected with SLA_EXPIRED (event to Kiorex). */
  async expireOverdue(orgId?: string): Promise<{ expired: number }> {
    const overdue = await this.prisma.kiorexOrder.findMany({ where: { ...(orgId ? { orgId } : {}), status: "RECEIVED", slaDueAt: { lt: new Date() } } });
    for (const o of overdue) {
      await this.prisma.$transaction(async (tx) => {
        await tx.kiorexOrder.update({ where: { id: o.id }, data: { status: "EXPIRED", rejectionCode: "SLA_EXPIRED", rejectionReason: "No response within SLA" } });
        await this.outbox.enqueue({ orgId: o.orgId, type: "OrderRejected", aggregateId: o.externalOrderId, dedupeKey: `OrderRejected:${o.id}`, data: { orderId: o.externalOrderId, pharmacyId: await this.pharmacyId(tx, o.orgId), rejectedAt: new Date().toISOString(), reason: "No response within SLA", reasonCode: "SLA_EXPIRED" } }, tx);
      });
    }
    return { expired: overdue.length };
  }
}
