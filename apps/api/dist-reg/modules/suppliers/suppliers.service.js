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
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const notifications_service_1 = require("../../platform/adapters/notifications.service");
const inventory_service_1 = require("../inventory/inventory.service");
const feature_flags_service_1 = require("../../feature-flags/feature-flags.service");
const forecasting_service_1 = require("../forecasting/forecasting.service");
const ports_1 = require("../../kernel-adapter/ports");
let SuppliersService = class SuppliersService {
    prisma;
    notify;
    inv;
    flags;
    forecasting;
    ent;
    constructor(prisma, notify, inv, flags, forecasting, ent) {
        this.prisma = prisma;
        this.notify = notify;
        this.inv = inv;
        this.flags = flags;
        this.forecasting = forecasting;
        this.ent = ent;
    }
    list(orgId) { return this.prisma.supplier.findMany({ where: { orgId }, orderBy: { name: "asc" } }); }
    async get(orgId, id) {
        const s = await this.prisma.supplier.findFirst({ where: { id, orgId } });
        if (!s)
            throw (0, errors_1.notFound)("Supplier", id);
        return s;
    }
    create(orgId, d) {
        return this.prisma.supplier.create({ data: { orgId, ...d } });
    }
    async update(orgId, id, d) {
        await this.get(orgId, id);
        return this.prisma.supplier.update({ where: { id }, data: d });
    }
    async ledger(orgId, id) {
        await this.get(orgId, id);
        return this.prisma.supplierLedgerEntry.findMany({ where: { orgId, supplierId: id }, orderBy: { createdAt: "desc" }, take: 200 });
    }
    async pay(user, id, amount, note, idempotencyKey) {
        if ((0, money_1.D)(amount).lte(0))
            throw new errors_1.DomainError("INVALID_AMOUNT", "Amount must be positive", 400);
        await this.get(user.orgId, id);
        if (idempotencyKey) {
            const prior = await this.prisma.supplierLedgerEntry.findUnique({ where: { orgId_idempotencyKey: { orgId: user.orgId, idempotencyKey } } });
            if (prior)
                return { entry: prior, replayed: true };
        }
        return this.prisma.$transaction(async (tx) => {
            const entry = await tx.supplierLedgerEntry.create({ data: { orgId: user.orgId, supplierId: id, type: "PAYMENT", amount: (0, money_1.D)(amount).neg(), note, idempotencyKey, createdBy: user.userId } });
            await tx.supplier.update({ where: { id }, data: { balance: { decrement: amount } } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "supplier.payment", entityType: "Supplier", entityId: id, meta: { amount: (0, money_1.money)(amount) } } });
            return { entry, replayed: false };
        });
    }
    async nextPoNumber(orgId) {
        const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const last = await this.prisma.purchaseOrder.findFirst({ where: { orgId, poNumber: { startsWith: `PO-${day}` } }, orderBy: { poNumber: "desc" }, select: { poNumber: true } });
        const n = last?.poNumber ? Number(last.poNumber.slice(`PO-${day}-`.length)) || 0 : 0;
        return `PO-${day}-${String(n + 1).padStart(4, "0")}`;
    }
    async createPo(user, input) {
        await this.get(user.orgId, input.supplierId);
        const total = input.lines.reduce((a, l) => a.plus((0, money_1.D)(l.unitCost).mul(l.qtyOrdered)), (0, money_1.D)(0));
        for (let attempt = 0;; attempt++) {
            try {
                return await this.prisma.purchaseOrder.create({
                    data: { orgId: user.orgId, branchId: input.branchId, supplierId: input.supplierId, origin: input.origin ?? "MANUAL", notes: input.notes, createdBy: user.userId, poNumber: await this.nextPoNumber(user.orgId), totalCost: (0, money_1.round2)(total), lines: { create: input.lines } },
                    include: { lines: true },
                });
            }
            catch (e) {
                if (attempt >= 3 || e.code !== "P2002")
                    throw e;
            }
        }
    }
    async listPos(orgId, branchId) {
        return this.prisma.purchaseOrder.findMany({ where: { orgId, ...(branchId ? { branchId } : {}) }, include: { lines: true, supplier: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 100 });
    }
    async getPo(orgId, id) {
        const po = await this.prisma.purchaseOrder.findFirst({ where: { id, orgId }, include: { lines: true, supplier: true } });
        if (!po)
            throw (0, errors_1.notFound)("Purchase order", id);
        return po;
    }
    async sendPo(user, id, via) {
        const po = await this.getPo(user.orgId, id);
        if (po.status !== "DRAFT")
            throw new errors_1.DomainError("PO_NOT_DRAFT", `Purchase order is ${po.status}`, 409);
        const recipient = via === "WHATSAPP" ? po.supplier.phone : po.supplier.email;
        if (!recipient)
            throw new errors_1.DomainError("NO_CONTACT", `Supplier has no ${via === "WHATSAPP" ? "phone" : "email"}`, 409);
        const drugs = await this.prisma.drug.findMany({ where: { id: { in: po.lines.map((l) => l.drugId) } }, select: { id: true, brandName: true } });
        const nm = new Map(drugs.map((d) => [d.id, d.brandName]));
        const branch = await this.prisma.branch.findUniqueOrThrow({ where: { id: po.branchId } });
        await this.notify.send({ orgId: user.orgId, channel: via, recipient, template: "po.send", locale: "ar", vars: { po: po.poNumber ?? po.id, branch: branch.name, lines: po.lines.map((l) => `${nm.get(l.drugId)} x${l.qtyOrdered}`).join("; ") }, refType: "PurchaseOrder", refId: po.id });
        const r = await this.prisma.purchaseOrder.update({ where: { id }, data: { status: "SENT", sentAt: new Date(), sentVia: via } });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "po.send", entityType: "PurchaseOrder", entityId: id, meta: { via } } });
        return r;
    }
    async cancelPo(user, id) {
        const po = await this.getPo(user.orgId, id);
        if (po.status === "RECEIVED" || po.status === "PARTIALLY_RECEIVED")
            throw new errors_1.DomainError("PO_RECEIVED", "Cannot cancel a received purchase order", 409);
        return this.prisma.purchaseOrder.update({ where: { id }, data: { status: "CANCELLED" } });
    }
    async suggestions(user, branchId) {
        const policies = await this.prisma.reorderPolicy.findMany({ where: { orgId: user.orgId, branchId }, include: { drug: true } });
        const atp = await this.inv.atp(user.orgId, branchId);
        const onOrderRows = await this.prisma.purchaseOrderLine.findMany({ where: { purchaseOrder: { orgId: user.orgId, branchId, status: { in: ["SENT", "PARTIALLY_RECEIVED", "DRAFT"] } } } });
        const onOrder = new Map();
        for (const l of onOrderRows)
            onOrder.set(l.drugId, (onOrder.get(l.drugId) ?? 0) + Math.max(l.qtyOrdered - l.qtyReceived, 0));
        const useForecast = this.flags.isEnabled("pharmacy.forecasting", { orgId: user.orgId, market: user.market }) && (await this.ent.isEntitled(user.orgId, "forecasting"));
        const fc = useForecast ? new Map((await this.forecasting.forecast(user.orgId, branchId, 14)).map((r) => [r.drugId, r])) : new Map();
        const lastSupplier = await this.prisma.stockLot.findMany({ where: { orgId: user.orgId, branchId, supplierId: { not: null } }, orderBy: { receivedAt: "desc" }, select: { drugId: true, supplierId: true } });
        const ls = new Map();
        for (const l of lastSupplier)
            if (!ls.has(l.drugId) && l.supplierId)
                ls.set(l.drugId, l.supplierId);
        const items = [];
        for (const p of policies) {
            const position = (atp.get(p.drugId) ?? 0) + (onOrder.get(p.drugId) ?? 0);
            const f = fc.get(p.drugId);
            let qty = 0, method = "MIN_MAX";
            if (position <= p.minQty)
                qty = p.maxQty - position;
            if (f) {
                const target = Math.max(p.maxQty, Math.ceil(f.avgDailyDemand * (p.leadTimeDays + 14)));
                const need = Math.max(target - position, 0);
                if (position <= Math.max(p.minQty, Math.ceil(f.avgDailyDemand * p.leadTimeDays)) && need > qty) {
                    qty = need;
                    method = "FORECAST";
                }
            }
            if (qty > 0)
                items.push({ drugId: p.drugId, brandName: p.drug.brandName, brandNameAr: p.drug.brandNameAr, position, minQty: p.minQty, maxQty: p.maxQty, suggestedQty: qty, method, supplierId: p.supplierId ?? ls.get(p.drugId) ?? null, ...(f ? { forecast: { avgDailyDemand: f.avgDailyDemand, explanation: f.explanation } } : {}) });
        }
        return { method: useForecast ? "FORECAST" : "MIN_MAX", items };
    }
    async createPosFromSuggestions(user, branchId, items) {
        const sug = await this.suggestions(user, branchId);
        const by = new Map();
        const origin = new Map();
        for (const it of items) {
            const s = sug.items.find((x) => x.drugId === it.drugId);
            const sid = it.supplierId ?? s?.supplierId;
            if (!sid)
                throw new errors_1.DomainError("SUPPLIER_REQUIRED", `Choose a supplier for ${it.drugId}`, 400);
            const lot = await this.prisma.stockLot.findFirst({ where: { orgId: user.orgId, drugId: it.drugId }, orderBy: { receivedAt: "desc" } });
            (by.get(sid) ?? by.set(sid, []).get(sid)).push({ drugId: it.drugId, qtyOrdered: it.qty, unitCost: lot ? lot.unitCost.toFixed(2) : "0.00" });
            origin.set(sid, s?.method ?? "MIN_MAX");
        }
        const pos = [];
        for (const [supplierId, lines] of by)
            pos.push(await this.createPo(user, { branchId, supplierId, lines, origin: origin.get(supplierId) }));
        return pos;
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(notifications_service_1.NotificationsService)),
    __param(2, (0, common_1.Inject)(inventory_service_1.InventoryService)),
    __param(3, (0, common_1.Inject)(feature_flags_service_1.FeatureFlagsService)),
    __param(4, (0, common_1.Inject)(forecasting_service_1.ForecastingService)),
    __param(5, (0, common_1.Inject)(ports_1.KERNEL.entitlements)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        inventory_service_1.InventoryService,
        feature_flags_service_1.FeatureFlagsService,
        forecasting_service_1.ForecastingService, Object])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map