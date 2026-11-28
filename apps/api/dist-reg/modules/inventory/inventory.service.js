"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const dates_1 = require("../../common/dates");
const common_1 = require("@nestjs/common");
const push_service_1 = require("../mobile/push.service");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const stock_ledger_service_1 = require("./stock-ledger.service");
const ports_1 = require("../../kernel-adapter/ports");
const notifications_service_1 = require("../../platform/adapters/notifications.service");
const lot_guard_1 = require("./lot-guard/lot-guard");
const startOfTodayUtc = () => (0, dates_1.marketToday)();
const daysBetween = (a, b) => Math.floor((a.getTime() - b.getTime()) / 86_400_000);
let InventoryService = class InventoryService {
    prisma;
    ledger;
    packs;
    notify;
    push;
    constructor(prisma, ledger, packs, notify, push) {
        this.prisma = prisma;
        this.ledger = ledger;
        this.packs = packs;
        this.notify = notify;
        this.push = push;
    }
    async lots(orgId, q) {
        const where = {
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
            items: rows.map((l) => ({ ...l, unitCost: (0, money_1.money)(l.unitCost), available: l.qtyOnHand - l.qtyReserved, daysToExpiry: daysBetween(l.expiryDate, today), blockReason: (0, lot_guard_1.lotBlockReason)(l, today) })),
        };
    }
    async stock(orgId, branchId, q) {
        const rows = await this.prisma.$queryRaw `
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
            const d = dm.get(r.drugId), p = pm.get(r.drugId);
            const sellable = Number(r.sellable);
            return {
                drugId: r.drugId, brandName: d.brandName, brandNameAr: d.brandNameAr, strength: d.strength, dosageForm: d.dosageForm, rxOnly: d.rxOnly, controlledSchedule: d.controlledSchedule,
                onHand: Number(r.onHand), reserved: Number(r.reserved), sellable, blocked: Number(r.blocked), nextExpiry: r.nextExpiry,
                minQty: p?.minQty ?? null, maxQty: p?.maxQty ?? null, low: p ? sellable <= p.minQty : false,
            };
        });
        if (q.q) {
            const s = q.q.toLowerCase();
            items = items.filter((i) => i.brandName.toLowerCase().includes(s));
        }
        if (q.lowOnly)
            items = items.filter((i) => i.low);
        items.sort((a, b) => a.brandName.localeCompare(b.brandName));
        return { total: items.length, items: items.slice(q.skip, q.skip + q.take) };
    }
    async fefo(orgId, branchId, drugId, qty) {
        return this.ledger.fefoPlan(this.prisma, orgId, branchId, drugId, qty);
    }
    async atp(orgId, branchId) {
        const rows = await this.prisma.$queryRaw `
      SELECT l."drugId", COALESCE(SUM(l."qtyOnHand" - l."qtyReserved"),0) AS atp FROM "StockLot" l
      WHERE l."orgId" = ${orgId} AND l."branchId" = ${branchId} AND l.status IN ('AVAILABLE','RESERVED') AND l."expiryDate" >= kx_today() AND l."qtyOnHand" - l."qtyReserved" > 0
      GROUP BY l."drugId"`;
        return new Map(rows.map((r) => [r.drugId, Number(r.atp)]));
    }
    async quarantine(user, lotId, reason) {
        return this.prisma.$transaction(async (tx) => {
            const lot = await this.ledger.lockLot(tx, lotId, user.orgId);
            if (lot.status === "QUARANTINE" || lot.status === "RECALLED")
                return lot;
            const r = await tx.stockLot.update({ where: { id: lotId }, data: { status: "QUARANTINE", statusBeforeBlock: lot.status, blockedReason: reason, blockedAt: new Date() } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "lot.quarantine", entityType: "StockLot", entityId: lotId, meta: { reason } } });
            return r;
        });
    }
    async release(user, lotId, reason) {
        return this.prisma.$transaction(async (tx) => {
            const lot = await this.ledger.lockLot(tx, lotId, user.orgId);
            if (lot.status === "RECALLED")
                throw new errors_1.DomainError("LOT_RECALLED", "Recalled lots are released only by lifting the recall notice", 409);
            if (lot.status !== "QUARANTINE")
                throw new errors_1.DomainError("NOT_QUARANTINED", "Lot is not in quarantine", 409);
            if (lot.expiryDate < startOfTodayUtc())
                throw new errors_1.DomainError("LOT_EXPIRED", "Lot is expired", 409);
            const r = await tx.stockLot.update({ where: { id: lotId }, data: { status: lot.statusBeforeBlock && lot.statusBeforeBlock !== "QUARANTINE" ? lot.statusBeforeBlock : "AVAILABLE", statusBeforeBlock: null, blockedReason: null, blockedAt: null } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "lot.release", entityType: "StockLot", entityId: lotId, meta: { reason } } });
            return r;
        });
    }
    async adjust(user, lotId, quantity, reason, approvedBy, witness, reasonCode) {
        return this.prisma.$transaction(async (tx) => {
            const lot = await this.ledger.lockLot(tx, lotId, user.orgId);
            const m = await this.ledger.post(tx, { orgId: user.orgId, branchId: lot.branchId, lotId, type: "ADJUSTMENT", quantity, performedBy: user.userId, reason, approvedBy, refType: "Adjustment", witness, reasonCode });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "stock.adjust", entityType: "StockLot", entityId: lotId, meta: { quantity, reason, reasonCode: reasonCode ?? null, approvedBy: approvedBy ?? null } } });
            return m;
        });
    }
    async writeOff(user, lotId, reason, witness) {
        return this.prisma.$transaction(async (tx) => {
            const lot = await this.ledger.lockLot(tx, lotId, user.orgId);
            const block = (0, lot_guard_1.lotBlockReason)(lot);
            if (block !== "EXPIRED" && block !== "RECALLED")
                throw new errors_1.DomainError("WRITE_OFF_NOT_ALLOWED", "Only expired or recalled lots can be written off; quarantine/adjust otherwise", 409, { reason: block });
            if (lot.qtyOnHand <= 0)
                throw new errors_1.DomainError("NOTHING_TO_WRITE_OFF", "Lot has no stock", 409);
            const m = await this.ledger.post(tx, { orgId: user.orgId, branchId: lot.branchId, lotId, type: block === "RECALLED" ? "RECALL_WRITE_OFF" : "EXPIRY_WRITE_OFF", quantity: lot.qtyOnHand, performedBy: user.userId, reason, refType: "WriteOff", witness });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "stock.write_off", entityType: "StockLot", entityId: lotId, meta: { quantity: lot.qtyOnHand, block, reason } } });
            return m;
        });
    }
    async expirySweep(orgId) {
        const r = await this.prisma.stockLot.updateMany({
            where: { ...(orgId ? { orgId } : {}), status: { in: ["RECEIVED", "AVAILABLE", "RESERVED"] }, expiryDate: { lt: startOfTodayUtc() } },
            data: { status: "EXPIRED", blockedReason: "Expired", blockedAt: new Date() },
        });
        return { expired: r.count };
    }
    async expiryBuckets(orgId, branchId) {
        const lots = await this.prisma.stockLot.findMany({
            where: { orgId, ...(branchId ? { branchId } : {}), qtyOnHand: { gt: 0 }, status: { in: ["AVAILABLE", "RESERVED", "QUARANTINE", "EXPIRED"] }, expiryDate: { lte: new Date(startOfTodayUtc().getTime() + 90 * 86_400_000) } },
            include: { drug: { select: { brandName: true, brandNameAr: true } } }, orderBy: { expiryDate: "asc" },
        });
        const today = new Date();
        const mk = (l) => ({ lotId: l.id, branchId: l.branchId, drugId: l.drugId, brandName: l.drug.brandName, brandNameAr: l.drug.brandNameAr, lotNumber: l.lotNumber, expiryDate: l.expiryDate, qtyOnHand: l.qtyOnHand, daysToExpiry: daysBetween(l.expiryDate, today), supplierId: l.supplierId, unitCost: (0, money_1.money)(l.unitCost), status: l.status });
        const items = lots.map(mk);
        return { expired: items.filter((i) => i.daysToExpiry < 0), d30: items.filter((i) => i.daysToExpiry >= 0 && i.daysToExpiry <= 30), d60: items.filter((i) => i.daysToExpiry > 30 && i.daysToExpiry <= 60), d90: items.filter((i) => i.daysToExpiry > 60) };
    }
    async runExpiryAlerts(orgId) {
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
            if (!fresh.length)
                continue;
            const tightest = Math.min(...fresh);
            for (const t of fresh) {
                try {
                    await this.prisma.expiryAlert.create({ data: { orgId: lot.orgId, lotId: lot.id, thresholdDays: t } });
                }
                catch (e) {
                    if (!(e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === "P2002"))
                        throw e;
                }
            }
            const tenant = await this.prisma.tenant.findUnique({ where: { id: lot.orgId } });
            const settings = (tenant?.settings ?? {});
            if (settings.ownerPhone)
                await this.notify.send({ orgId: lot.orgId, channel: "WHATSAPP", recipient: settings.ownerPhone, template: "expiry.alert", vars: { drug: lot.drug.brandName, lot: lot.lotNumber, days: Math.max(days, 0), qty: lot.qtyOnHand }, refType: "StockLot", refId: lot.id, locale: settings.defaultLocale ?? "ar" });
            void this.push?.sendTemplate(lot.orgId, "stock.expiry", { drug: lot.drug.brandName, lot: lot.lotNumber, days: Math.max(days, 0), qty: lot.qtyOnHand }, { roles: ["PHARMACIST", "OWNER", "BRANCH_MANAGER"], branchId: lot.branchId }, { lotId: lot.id });
            await this.prisma.auditLog.create({ data: { orgId: lot.orgId, action: "expiry.alert", entityType: "StockLot", entityId: lot.id, meta: { thresholdDays: tightest, days } } });
            alerts++;
        }
        return { alerts };
    }
    async returnToSupplier(user, input) {
        return this.prisma.$transaction(async (tx) => {
            const lot = await this.ledger.lockLot(tx, input.lotId, user.orgId);
            if (!lot.supplierId)
                throw new errors_1.DomainError("NO_SUPPLIER", "Lot has no supplier to return to", 409);
            const credit = (0, money_1.round2)(input.creditAmount != null ? (0, money_1.D)(input.creditAmount) : (0, money_1.D)(lot.unitCost).mul(input.quantity));
            const ret = await tx.supplierReturn.create({ data: { orgId: user.orgId, branchId: lot.branchId, supplierId: lot.supplierId, lotId: lot.id, quantity: input.quantity, creditAmount: credit, reason: input.reason, createdBy: user.userId } });
            await this.ledger.post(tx, { orgId: user.orgId, branchId: lot.branchId, lotId: lot.id, type: "RETURN_TO_SUPPLIER", quantity: input.quantity, performedBy: user.userId, reason: input.reason, refType: "SupplierReturn", refId: ret.id, witness: input.witness });
            await tx.supplierLedgerEntry.create({ data: { orgId: user.orgId, supplierId: lot.supplierId, type: "RETURN_CREDIT", amount: credit.neg(), refType: "SupplierReturn", refId: ret.id, createdBy: user.userId } });
            await tx.supplier.update({ where: { id: lot.supplierId }, data: { balance: { decrement: credit } } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "inventory.return_to_supplier", entityType: "SupplierReturn", entityId: ret.id, meta: { lotId: lot.id, quantity: input.quantity, credit: (0, money_1.money)(credit) } } });
            return ret;
        });
    }
    async recordTemperature(user, lotId, temperatureC) {
        const lot = await this.prisma.stockLot.findFirst({ where: { id: lotId, orgId: user.orgId }, include: { drug: true } });
        if (!lot)
            throw (0, errors_1.notFound)("Lot", lotId);
        if (!lot.drug.coldChain)
            throw new errors_1.DomainError("NOT_COLD_CHAIN", "This drug is not a cold-chain item", 409);
        const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: user.orgId } });
        const pack = this.packs.get(tenant.marketCode);
        const excursion = temperatureC < pack.coldChainRangeC.min || temperatureC > pack.coldChainRangeC.max;
        const reading = await this.prisma.coldChainReading.create({ data: { orgId: user.orgId, lotId, temperatureC, excursion, recordedBy: user.userId } });
        if (excursion)
            await this.quarantine(user, lotId, `Cold-chain excursion (${temperatureC}°C, allowed ${pack.coldChainRangeC.min}–${pack.coldChainRangeC.max}°C)`);
        return { reading, excursion, quarantined: excursion, range: pack.coldChainRangeC };
    }
    readings(orgId, lotId) {
        return this.prisma.coldChainReading.findMany({ where: { orgId, lotId }, orderBy: { recordedAt: "desc" }, take: 200 });
    }
    async setReorderPolicy(orgId, branchId, p) {
        if (p.maxQty < p.minQty)
            throw new errors_1.DomainError("INVALID_POLICY", "max must be >= min", 400);
        return this.prisma.reorderPolicy.upsert({
            where: { branchId_drugId: { branchId, drugId: p.drugId } }, create: { orgId, branchId, ...p }, update: { minQty: p.minQty, maxQty: p.maxQty, leadTimeDays: p.leadTimeDays ?? 2, supplierId: p.supplierId ?? null, updatedAt: new Date() },
        });
    }
    reorderPolicies(orgId, branchId) {
        return this.prisma.reorderPolicy.findMany({ where: { orgId, branchId }, include: { drug: { select: { brandName: true, brandNameAr: true, strength: true } } } });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(stock_ledger_service_1.StockLedger)),
    __param(2, (0, common_1.Inject)(ports_1.KERNEL.marketPacks)),
    __param(3, (0, common_1.Inject)(notifications_service_1.NotificationsService)),
    __param(4, (0, common_1.Optional)()),
    __param(4, (0, common_1.Inject)(push_service_1.PushService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stock_ledger_service_1.StockLedger, Object, notifications_service_1.NotificationsService,
        push_service_1.PushService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map