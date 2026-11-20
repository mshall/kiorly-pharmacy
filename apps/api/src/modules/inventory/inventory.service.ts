import { marketToday } from "../../common/dates";
import { Inject, Injectable } from "@nestjs/common";
import { Prisma, type LotStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { D, money, round2 } from "../../common/money";
import { StockLedger } from "./stock-ledger.service";
import { KERNEL, type MarketPackPort } from "../../kernel-adapter/ports";
import type { AuthUser } from "../../auth/auth-user";
import { NotificationsService } from "../../platform/adapters/notifications.service";
import { lotBlockReason } from "./lot-guard/lot-guard";

const startOfTodayUtc = () => marketToday();
const daysBetween = (a: Date, b: Date) => Math.floor((a.getTime() - b.getTime()) / 86_400_000);

export interface LotQuery { branchId?: string; drugId?: string; status?: LotStatus; expiringWithinDays?: number; q?: string; includeEmpty?: boolean; skip: number; take: number }

@Injectable()
export class InventoryService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(StockLedger) private readonly ledger: StockLedger,
    @Inject(KERNEL.marketPacks) private readonly packs: MarketPackPort,
    @Inject(NotificationsService) private readonly notify: NotificationsService,
  ) {}

  async lots(orgId: string, q: LotQuery) {
    const where: Prisma.StockLotWhereInput = {
      orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.drugId ? { drugId: q.drugId } : {}), ...(q.status ? { status: q.status } : {}),
      ...(q.includeEmpty ? {} : { OR: [{ qtyOnHand: { not: 0 } }, { qtyReserved: { gt: 0 } }] }),
      ...(q.expiringWithinDays != null ? { expiryDate: { lte: new Date(startOfTodayUtc().getTime() + q.expiringWithinDays * 86_400_000) } } : {}),
      ...(q.q ? { drug: { OR: [{ brandName: { contains: q.q, mode: "insensitive" } }, { activeIngredient: { contains: q.q, mode: "insensitive" } }, { gtin: q.q }] } } : {}),
    };
    const [rows, total] = await Promise.all([
      this.prisma.stockLot.findMany({ where, include: { drug: { select: { brandName: true, brandNameAr: true, strength: true, dosageForm: true, coldChain: true, controlledSchedule: true } } }, orderBy: [{ expiryDate: "asc" }, { receivedAt: "asc" }], skip: q.skip, take: q.take }),
      this.prisma.stockLot.count({ where }),
    ]);
    const today = new Date();
    return {
      total,
      items: rows.map((l) => ({ ...l, unitCost: money(l.unitCost), available: l.qtyOnHand - l.qtyReserved, daysToExpiry: daysBetween(l.expiryDate, today), blockReason: lotBlockReason(l, today) })),
    };
  }

  /** Per-drug stock summary for a branch with min/max flags (KPINV / KPSUP02). */
  async stock(orgId: string, branchId: string, q: { q?: string; skip: number; take: number; lowOnly?: boolean }) {
    const rows = await this.prisma.$queryRaw<Array<{ drugId: string; onHand: bigint; reserved: bigint; sellable: bigint; blocked: bigint; nextExpiry: Date | null }>>`
      SELECT l."drugId",
             COALESCE(SUM(l."qtyOnHand"),0) AS "onHand",
             COALESCE(SUM(l."qtyReserved"),0) AS reserved,
             COALESCE(SUM(CASE WHEN l.status IN ('AVAILABLE','RESERVED') AND l."expiryDate" >= kx_today() THEN l."qtyOnHand" - l."qtyReserved" ELSE 0 END),0) AS sellable,
             COALESCE(SUM(CASE WHEN l.status NOT IN ('AVAILABLE','RESERVED') OR l."expiryDate" < kx_today() THEN l."qtyOnHand" ELSE 0 END),0) AS blocked,
             MIN(CASE WHEN l.status IN ('AVAILABLE','RESERVED') AND l."expiryDate" >= kx_today() AND l."qtyOnHand" > 0 THEN l."expiryDate" END) AS "nextExpiry"
      FROM "StockLot" l WHERE l."orgId" = ${orgId} AND l."branchId" = ${branchId} GROUP BY l."drugId"`;
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: rows.map((r) => r.drugId) } } });
    const policies = await this.prisma.reorderPolicy.findMany({ where: { orgId, branchId } });
    const dm = new Map(drugs.map((d) => [d.id, d])), pm = new Map(policies.map((p) => [p.drugId, p]));
    let items = rows.map((r) => {
      const d = dm.get(r.drugId)!, p = pm.get(r.drugId);
      const sellable = Number(r.sellable);
      return {
        drugId: r.drugId, brandName: d.brandName, brandNameAr: d.brandNameAr, strength: d.strength, dosageForm: d.dosageForm, rxOnly: d.rxOnly, controlledSchedule: d.controlledSchedule,
        onHand: Number(r.onHand), reserved: Number(r.reserved), sellable, blocked: Number(r.blocked), nextExpiry: r.nextExpiry,
        minQty: p?.minQty ?? null, maxQty: p?.maxQty ?? null, low: p ? sellable <= p.minQty : false,
      };
    });
    if (q.q) { const s = q.q.toLowerCase(); items = items.filter((i) => i.brandName.toLowerCase().includes(s)); }
    if (q.lowOnly) items = items.filter((i) => i.low);
    items.sort((a, b) => a.brandName.localeCompare(b.brandName));
    return { total: items.length, items: items.slice(q.skip, q.skip + q.take) };
  }

  /** KPINV02: suggested FEFO pick for a requested quantity. */
  async fefo(orgId: string, branchId: string, drugId: string, qty: number) {
    return this.ledger.fefoPlan(this.prisma, orgId, branchId, drugId, qty);
  }

  /** KPINV07: available-to-promise per SKU for one branch (sellable, in-date, free quantity only). */
  async atp(orgId: string, branchId: string): Promise<Map<string, number>> {
    const rows = await this.prisma.$queryRaw<Array<{ drugId: string; atp: bigint }>>`
      SELECT l."drugId", COALESCE(SUM(l."qtyOnHand" - l."qtyReserved"),0) AS atp FROM "StockLot" l
      WHERE l."orgId" = ${orgId} AND l."branchId" = ${branchId} AND l.status IN ('AVAILABLE','RESERVED') AND l."expiryDate" >= kx_today() AND l."qtyOnHand" - l."qtyReserved" > 0
      GROUP BY l."drugId"`;
    return new Map(rows.map((r) => [r.drugId, Number(r.atp)]));
  }

  async quarantine(user: AuthUser, lotId: string, reason: string) {
    return this.prisma.$transaction(async (tx) => {
      const lot = await this.ledger.lockLot(tx, lotId, user.orgId);
      if (lot.status === "QUARANTINE" || lot.status === "RECALLED") return lot;
      const r = await tx.stockLot.update({ where: { id: lotId }, data: { status: "QUARANTINE", statusBeforeBlock: lot.status, blockedReason: reason, blockedAt: new Date() } });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "lot.quarantine", entityType: "StockLot", entityId: lotId, meta: { reason } } });
      return r;
    });
  }

  /** Releases a QUARANTINE lot. RECALLED lots can only be released by lifting the recall notice. */
  async release(user: AuthUser, lotId: string, reason: string) {
    return this.prisma.$transaction(async (tx) => {
      const lot = await this.ledger.lockLot(tx, lotId, user.orgId);
      if (lot.status === "RECALLED") throw new DomainError("LOT_RECALLED", "Recalled lots are released only by lifting the recall notice", 409);
      if (lot.status !== "QUARANTINE") throw new DomainError("NOT_QUARANTINED", "Lot is not in quarantine", 409);
      if (lot.expiryDate < startOfTodayUtc()) throw new DomainError("LOT_EXPIRED", "Lot is expired", 409);
      const r = await tx.stockLot.update({ where: { id: lotId }, data: { status: lot.statusBeforeBlock && lot.statusBeforeBlock !== "QUARANTINE" ? lot.statusBeforeBlock : "AVAILABLE", statusBeforeBlock: null, blockedReason: null, blockedAt: null } });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "lot.release", entityType: "StockLot", entityId: lotId, meta: { reason } } });
      return r;
    });
  }

  async adjust(user: AuthUser, lotId: string, quantity: number, reason: string, approvedBy?: string, witness?: { id: string; name: string }, reasonCode?: string) {
    return this.prisma.$transaction(async (tx) => {
      const lot = await this.ledger.lockLot(tx, lotId, user.orgId);
      const m = await this.ledger.post(tx, { orgId: user.orgId, branchId: lot.branchId, lotId, type: "ADJUSTMENT", quantity, performedBy: user.userId, reason, approvedBy, refType: "Adjustment", witness, reasonCode });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "stock.adjust", entityType: "StockLot", entityId: lotId, meta: { quantity, reason, reasonCode: reasonCode ?? null, approvedBy: approvedBy ?? null } } });
      return m;
    });
  }

  /** Writes off the remaining quantity of an expired / recalled lot (EXPIRY_WRITE_OFF / RECALL_WRITE_OFF). */
  async writeOff(user: AuthUser, lotId: string, reason: string, witness?: { id: string; name: string }) {
    return this.prisma.$transaction(async (tx) => {
      const lot = await this.ledger.lockLot(tx, lotId, user.orgId);
      const block = lotBlockReason(lot);
      if (block !== "EXPIRED" && block !== "RECALLED") throw new DomainError("WRITE_OFF_NOT_ALLOWED", "Only expired or recalled lots can be written off; quarantine/adjust otherwise", 409, { reason: block });
      if (lot.qtyOnHand <= 0) throw new DomainError("NOTHING_TO_WRITE_OFF", "Lot has no stock", 409);
      const m = await this.ledger.post(tx, { orgId: user.orgId, branchId: lot.branchId, lotId, type: block === "RECALLED" ? "RECALL_WRITE_OFF" : "EXPIRY_WRITE_OFF", quantity: lot.qtyOnHand, performedBy: user.userId, reason, refType: "WriteOff", witness });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "stock.write_off", entityType: "StockLot", entityId: lotId, meta: { quantity: lot.qtyOnHand, block, reason } } });
      return m;
    });
  }

  /** Marks lots past expiry as EXPIRED (status). The sale block never depends on this sweep (date is checked at sale time and in the DB). */
  async expirySweep(orgId?: string): Promise<{ expired: number }> {
    const r = await this.prisma.stockLot.updateMany({
      where: { ...(orgId ? { orgId } : {}), status: { in: ["RECEIVED", "AVAILABLE", "RESERVED"] }, expiryDate: { lt: startOfTodayUtc() } },
      data: { status: "EXPIRED", blockedReason: "Expired", blockedAt: new Date() },
    });
    return { expired: r.count };
  }

  /** KPINV04: expiry buckets for the dashboard / alerts page. */
  async expiryBuckets(orgId: string, branchId?: string) {
    const lots = await this.prisma.stockLot.findMany({
      where: { orgId, ...(branchId ? { branchId } : {}), qtyOnHand: { gt: 0 }, status: { in: ["AVAILABLE", "RESERVED", "QUARANTINE", "EXPIRED"] }, expiryDate: { lte: new Date(startOfTodayUtc().getTime() + 90 * 86_400_000) } },
      include: { drug: { select: { brandName: true, brandNameAr: true } } }, orderBy: { expiryDate: "asc" },
    });
    const today = new Date();
    const mk = (l: (typeof lots)[number]) => ({ lotId: l.id, branchId: l.branchId, drugId: l.drugId, brandName: l.drug.brandName, brandNameAr: l.drug.brandNameAr, lotNumber: l.lotNumber, expiryDate: l.expiryDate, qtyOnHand: l.qtyOnHand, daysToExpiry: daysBetween(l.expiryDate, today), supplierId: l.supplierId, unitCost: money(l.unitCost), status: l.status });
    const items = lots.map(mk);
    return { expired: items.filter((i) => i.daysToExpiry < 0), d30: items.filter((i) => i.daysToExpiry >= 0 && i.daysToExpiry <= 30), d60: items.filter((i) => i.daysToExpiry > 30 && i.daysToExpiry <= 60), d90: items.filter((i) => i.daysToExpiry > 60) };
  }

  /** KPINV04: fire alerts once per lot per threshold (90/60/30). Only the tightest newly-crossed threshold notifies; looser ones are recorded silently. */
  async runExpiryAlerts(orgId?: string): Promise<{ alerts: number }> {
    const lots = await this.prisma.stockLot.findMany({
      where: { ...(orgId ? { orgId } : {}), qtyOnHand: { gt: 0 }, status: { in: ["AVAILABLE", "RESERVED"] }, expiryDate: { gte: startOfTodayUtc(), lte: new Date(startOfTodayUtc().getTime() + 90 * 86_400_000) } },
      include: { drug: true, expiryAlerts: true },
    });
    let alerts = 0;
    const today = new Date();
    for (const lot of lots) {
      const days = daysBetween(lot.expiryDate, today);
      const crossed = [90, 60, 30].filter((t) => days <= t);
      const fresh = crossed.filter((t) => !lot.expiryAlerts.some((a) => a.thresholdDays === t));
      if (!fresh.length) continue;
      const tightest = Math.min(...fresh);
      for (const t of fresh) {
        try { await this.prisma.expiryAlert.create({ data: { orgId: lot.orgId, lotId: lot.id, thresholdDays: t } }); } catch (e) { if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")) throw e; }
      }
      const tenant = await this.prisma.tenant.findUnique({ where: { id: lot.orgId } });
      const settings = (tenant?.settings ?? {}) as { ownerPhone?: string; defaultLocale?: "ar" | "en" };
      if (settings.ownerPhone) await this.notify.send({ orgId: lot.orgId, channel: "WHATSAPP", recipient: settings.ownerPhone, template: "expiry.alert", vars: { drug: lot.drug.brandName, lot: lot.lotNumber, days: Math.max(days, 0), qty: lot.qtyOnHand }, refType: "StockLot", refId: lot.id, locale: settings.defaultLocale ?? "ar" });
      await this.prisma.auditLog.create({ data: { orgId: lot.orgId, action: "expiry.alert", entityType: "StockLot", entityId: lot.id, meta: { thresholdDays: tightest, days } } });
      alerts++;
    }
    return { alerts };
  }

  /** KPINV04 return-to-supplier: RETURN_TO_SUPPLIER movement + supplier credit (balance goes down). */
  async returnToSupplier(user: AuthUser, input: { lotId: string; quantity: number; reason: string; creditAmount?: string; witness?: { id: string; name: string } }) {
    return this.prisma.$transaction(async (tx) => {
      const lot = await this.ledger.lockLot(tx, input.lotId, user.orgId);
      if (!lot.supplierId) throw new DomainError("NO_SUPPLIER", "Lot has no supplier to return to", 409);
      const credit = round2(input.creditAmount != null ? D(input.creditAmount) : D(lot.unitCost).mul(input.quantity));
      const ret = await tx.supplierReturn.create({ data: { orgId: user.orgId, branchId: lot.branchId, supplierId: lot.supplierId, lotId: lot.id, quantity: input.quantity, creditAmount: credit, reason: input.reason, createdBy: user.userId } });
      await this.ledger.post(tx, { orgId: user.orgId, branchId: lot.branchId, lotId: lot.id, type: "RETURN_TO_SUPPLIER", quantity: input.quantity, performedBy: user.userId, reason: input.reason, refType: "SupplierReturn", refId: ret.id, witness: input.witness });
      await tx.supplierLedgerEntry.create({ data: { orgId: user.orgId, supplierId: lot.supplierId, type: "RETURN_CREDIT", amount: credit.neg(), refType: "SupplierReturn", refId: ret.id, createdBy: user.userId } });
      await tx.supplier.update({ where: { id: lot.supplierId }, data: { balance: { decrement: credit } } });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "inventory.return_to_supplier", entityType: "SupplierReturn", entityId: ret.id, meta: { lotId: lot.id, quantity: input.quantity, credit: money(credit) } } });
      return ret;
    });
  }

  /** KPINV06: temperature log entry; an excursion quarantines the lot. */
  async recordTemperature(user: AuthUser, lotId: string, temperatureC: number) {
    const lot = await this.prisma.stockLot.findFirst({ where: { id: lotId, orgId: user.orgId }, include: { drug: true } });
    if (!lot) throw notFound("Lot", lotId);
    if (!lot.drug.coldChain) throw new DomainError("NOT_COLD_CHAIN", "This drug is not a cold-chain item", 409);
    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: user.orgId } });
    const pack = this.packs.get(tenant.marketCode);
    const excursion = temperatureC < pack.coldChainRangeC.min || temperatureC > pack.coldChainRangeC.max;
    const reading = await this.prisma.coldChainReading.create({ data: { orgId: user.orgId, lotId, temperatureC, excursion, recordedBy: user.userId } });
    if (excursion) await this.quarantine(user, lotId, `Cold-chain excursion (${temperatureC}°C, allowed ${pack.coldChainRangeC.min}–${pack.coldChainRangeC.max}°C)`);
    return { reading, excursion, quarantined: excursion, range: pack.coldChainRangeC };
  }

  readings(orgId: string, lotId: string) {
    return this.prisma.coldChainReading.findMany({ where: { orgId, lotId }, orderBy: { recordedAt: "desc" }, take: 200 });
  }

  async setReorderPolicy(orgId: string, branchId: string, p: { drugId: string; minQty: number; maxQty: number; leadTimeDays?: number; supplierId?: string }) {
    if (p.maxQty < p.minQty) throw new DomainError("INVALID_POLICY", "max must be >= min", 400);
    return this.prisma.reorderPolicy.upsert({
      where: { branchId_drugId: { branchId, drugId: p.drugId } }, create: { orgId, branchId, ...p }, update: { minQty: p.minQty, maxQty: p.maxQty, leadTimeDays: p.leadTimeDays ?? 2, supplierId: p.supplierId ?? null, updatedAt: new Date() },
    });
  }

  reorderPolicies(orgId: string, branchId: string) {
    return this.prisma.reorderPolicy.findMany({ where: { orgId, branchId }, include: { drug: { select: { brandName: true, brandNameAr: true, strength: true } } } });
  }
}
