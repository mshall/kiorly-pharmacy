import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { D, money, round2 } from "../../common/money";
import type { AuthUser } from "../../auth/auth-user";
import { NotificationsService } from "../../platform/adapters/notifications.service";
import { InventoryService } from "../inventory/inventory.service";
import { FeatureFlagsService } from "../../feature-flags/feature-flags.service";
import { ForecastingService } from "../forecasting/forecasting.service";
import { KERNEL, type EntitlementsPort } from "../../kernel-adapter/ports";

export interface Suggestion { drugId: string; brandName: string; brandNameAr: string | null; position: number; minQty: number; maxQty: number; suggestedQty: number; method: "MIN_MAX" | "FORECAST"; supplierId: string | null; forecast?: { avgDailyDemand: number; explanation: string } }

@Injectable()
export class SuppliersService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(NotificationsService) private readonly notify: NotificationsService,
    @Inject(InventoryService) private readonly inv: InventoryService,
    @Inject(FeatureFlagsService) private readonly flags: FeatureFlagsService,
    @Inject(ForecastingService) private readonly forecasting: ForecastingService,
    @Inject(KERNEL.entitlements) private readonly ent: EntitlementsPort,
  ) {}

  // ---- KPSUP01 catalogue, terms, credit balance, payments
  list(orgId: string) { return this.prisma.supplier.findMany({ where: { orgId }, orderBy: { name: "asc" } }); }
  async get(orgId: string, id: string) {
    const s = await this.prisma.supplier.findFirst({ where: { id, orgId } });
    if (!s) throw notFound("Supplier", id);
    return s;
  }
  create(orgId: string, d: { name: string; phone?: string; email?: string; paymentTerms?: string; creditLimit?: string; leadTimeDays?: number }) {
    return this.prisma.supplier.create({ data: { orgId, ...d } });
  }
  async update(orgId: string, id: string, d: Record<string, unknown>) {
    await this.get(orgId, id);
    return this.prisma.supplier.update({ where: { id }, data: d });
  }
  async ledger(orgId: string, id: string) {
    await this.get(orgId, id);
    return this.prisma.supplierLedgerEntry.findMany({ where: { orgId, supplierId: id }, orderBy: { createdAt: "desc" }, take: 200 });
  }

  /** Payment reduces the payable balance. Idempotent on idempotencyKey. */
  async pay(user: AuthUser, id: string, amount: string, note?: string, idempotencyKey?: string) {
    if (D(amount).lte(0)) throw new DomainError("INVALID_AMOUNT", "Amount must be positive", 400);
    await this.get(user.orgId, id);
    if (idempotencyKey) {
      const prior = await this.prisma.supplierLedgerEntry.findUnique({ where: { orgId_idempotencyKey: { orgId: user.orgId, idempotencyKey } } });
      if (prior) return { entry: prior, replayed: true };
    }
    return this.prisma.$transaction(async (tx) => {
      const entry = await tx.supplierLedgerEntry.create({ data: { orgId: user.orgId, supplierId: id, type: "PAYMENT", amount: D(amount).neg(), note, idempotencyKey, createdBy: user.userId } });
      await tx.supplier.update({ where: { id }, data: { balance: { decrement: amount } } });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "supplier.payment", entityType: "Supplier", entityId: id, meta: { amount: money(amount) } } });
      return { entry, replayed: false };
    });
  }

  // ---- purchase orders
  private async nextPoNumber(orgId: string): Promise<string> {
    const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const n = await this.prisma.purchaseOrder.count({ where: { orgId, poNumber: { startsWith: `PO-${day}` } } });
    return `PO-${day}-${String(n + 1).padStart(4, "0")}`;
  }

  async createPo(user: AuthUser, input: { branchId: string; supplierId: string; origin?: string; notes?: string; lines: Array<{ drugId: string; qtyOrdered: number; unitCost: string }> }) {
    await this.get(user.orgId, input.supplierId);
    const total = input.lines.reduce((a, l) => a.plus(D(l.unitCost).mul(l.qtyOrdered)), D(0));
    for (let attempt = 0; ; attempt++) {
      try {
        return await this.prisma.purchaseOrder.create({
          data: { orgId: user.orgId, branchId: input.branchId, supplierId: input.supplierId, origin: input.origin ?? "MANUAL", notes: input.notes, createdBy: user.userId, poNumber: await this.nextPoNumber(user.orgId), totalCost: round2(total), lines: { create: input.lines } },
          include: { lines: true },
        });
      } catch (e) { if (attempt >= 3 || (e as { code?: string }).code !== "P2002") throw e; }
    }
  }
  async listPos(orgId: string, branchId?: string) {
    return this.prisma.purchaseOrder.findMany({ where: { orgId, ...(branchId ? { branchId } : {}) }, include: { lines: true, supplier: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 100 });
  }
  async getPo(orgId: string, id: string) {
    const po = await this.prisma.purchaseOrder.findFirst({ where: { id, orgId }, include: { lines: true, supplier: true } });
    if (!po) throw notFound("Purchase order", id);
    return po;
  }
  /** KPSUP02 one-tap PO via WhatsApp / email (mock adapters: rendered + recorded in the dev inbox). */
  async sendPo(user: AuthUser, id: string, via: "WHATSAPP" | "EMAIL") {
    const po = await this.getPo(user.orgId, id);
    if (po.status !== "DRAFT") throw new DomainError("PO_NOT_DRAFT", `Purchase order is ${po.status}`, 409);
    const recipient = via === "WHATSAPP" ? po.supplier.phone : po.supplier.email;
    if (!recipient) throw new DomainError("NO_CONTACT", `Supplier has no ${via === "WHATSAPP" ? "phone" : "email"}`, 409);
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: po.lines.map((l) => l.drugId) } }, select: { id: true, brandName: true } });
    const nm = new Map(drugs.map((d) => [d.id, d.brandName]));
    const branch = await this.prisma.branch.findUniqueOrThrow({ where: { id: po.branchId } });
    await this.notify.send({ orgId: user.orgId, channel: via, recipient, template: "po.send", locale: "ar", vars: { po: po.poNumber ?? po.id, branch: branch.name, lines: po.lines.map((l) => `${nm.get(l.drugId)} x${l.qtyOrdered}`).join("; ") }, refType: "PurchaseOrder", refId: po.id });
    const r = await this.prisma.purchaseOrder.update({ where: { id }, data: { status: "SENT", sentAt: new Date(), sentVia: via } });
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "po.send", entityType: "PurchaseOrder", entityId: id, meta: { via } } });
    return r;
  }
  async cancelPo(user: AuthUser, id: string) {
    const po = await this.getPo(user.orgId, id);
    if (po.status === "RECEIVED" || po.status === "PARTIALLY_RECEIVED") throw new DomainError("PO_RECEIVED", "Cannot cancel a received purchase order", 409);
    return this.prisma.purchaseOrder.update({ where: { id }, data: { status: "CANCELLED" } });
  }

  // ---- KPSUP02 auto-reorder suggestions (min/max; forecast raises quantity when flag + plan allow)
  async suggestions(user: AuthUser, branchId: string): Promise<{ method: "MIN_MAX" | "FORECAST"; items: Suggestion[] }> {
    const policies = await this.prisma.reorderPolicy.findMany({ where: { orgId: user.orgId, branchId }, include: { drug: true } });
    const atp = await this.inv.atp(user.orgId, branchId);
    const onOrderRows = await this.prisma.purchaseOrderLine.findMany({ where: { purchaseOrder: { orgId: user.orgId, branchId, status: { in: ["SENT", "PARTIALLY_RECEIVED", "DRAFT"] } } } });
    const onOrder = new Map<string, number>();
    for (const l of onOrderRows) onOrder.set(l.drugId, (onOrder.get(l.drugId) ?? 0) + Math.max(l.qtyOrdered - l.qtyReceived, 0));
    const useForecast = this.flags.isEnabled("pharmacy.forecasting", { orgId: user.orgId, market: user.market }) && (await this.ent.isEntitled(user.orgId, "forecasting"));
    const fc = useForecast ? new Map((await this.forecasting.forecast(user.orgId, branchId, 14)).map((r) => [r.drugId, r])) : new Map();
    const lastSupplier = await this.prisma.stockLot.findMany({ where: { orgId: user.orgId, branchId, supplierId: { not: null } }, orderBy: { receivedAt: "desc" }, select: { drugId: true, supplierId: true } });
    const ls = new Map<string, string>();
    for (const l of lastSupplier) if (!ls.has(l.drugId) && l.supplierId) ls.set(l.drugId, l.supplierId);
    const items: Suggestion[] = [];
    for (const p of policies) {
      const position = (atp.get(p.drugId) ?? 0) + (onOrder.get(p.drugId) ?? 0);
      const f = fc.get(p.drugId);
      let qty = 0, method: "MIN_MAX" | "FORECAST" = "MIN_MAX";
      if (position <= p.minQty) qty = p.maxQty - position;
      if (f) {
        // forecast can only RAISE the order-up-to level: never below the min/max safety floor
        const target = Math.max(p.maxQty, Math.ceil(f.avgDailyDemand * (p.leadTimeDays + 14)));
        const need = Math.max(target - position, 0);
        if (position <= Math.max(p.minQty, Math.ceil(f.avgDailyDemand * p.leadTimeDays)) && need > qty) { qty = need; method = "FORECAST"; }
      }
      if (qty > 0) items.push({ drugId: p.drugId, brandName: p.drug.brandName, brandNameAr: p.drug.brandNameAr, position, minQty: p.minQty, maxQty: p.maxQty, suggestedQty: qty, method, supplierId: p.supplierId ?? ls.get(p.drugId) ?? null, ...(f ? { forecast: { avgDailyDemand: f.avgDailyDemand, explanation: f.explanation } } : {}) });
    }
    return { method: useForecast ? "FORECAST" : "MIN_MAX", items };
  }

  /** Creates DRAFT POs (one per supplier) from accepted suggestions. Unit cost = last lot cost or 0 (to be edited before sending). */
  async createPosFromSuggestions(user: AuthUser, branchId: string, items: Array<{ drugId: string; qty: number; supplierId?: string }>) {
    const sug = await this.suggestions(user, branchId);
    const by = new Map<string, Array<{ drugId: string; qtyOrdered: number; unitCost: string }>>();
    const origin = new Map<string, string>();
    for (const it of items) {
      const s = sug.items.find((x) => x.drugId === it.drugId);
      const sid = it.supplierId ?? s?.supplierId;
      if (!sid) throw new DomainError("SUPPLIER_REQUIRED", `Choose a supplier for ${it.drugId}`, 400);
      const lot = await this.prisma.stockLot.findFirst({ where: { orgId: user.orgId, drugId: it.drugId }, orderBy: { receivedAt: "desc" } });
      (by.get(sid) ?? by.set(sid, []).get(sid)!).push({ drugId: it.drugId, qtyOrdered: it.qty, unitCost: lot ? lot.unitCost.toFixed(2) : "0.00" });
      origin.set(sid, s?.method ?? "MIN_MAX");
    }
    const pos = [];
    for (const [supplierId, lines] of by) pos.push(await this.createPo(user, { branchId, supplierId, lines, origin: origin.get(supplierId) }));
    return pos;
  }
}
