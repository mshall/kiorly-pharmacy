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
exports.ReceivingService = void 0;
const dates_1 = require("../../common/dates");
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const stock_ledger_service_1 = require("./stock-ledger.service");
const ports_1 = require("../../kernel-adapter/ports");
const gs1_1 = require("./gs1");
const uom_service_1 = require("./uom.service");
const tenant_mode_service_1 = require("../../tenancy/tenant-mode.service");
const startOfTodayUtc = () => (0, dates_1.marketToday)();
let ReceivingService = class ReceivingService {
    prisma;
    ledger;
    packs;
    uoms;
    modes;
    constructor(prisma, ledger, packs, uoms, modes) {
        this.prisma = prisma;
        this.ledger = ledger;
        this.packs = packs;
        this.uoms = uoms;
        this.modes = modes;
    }
    async resolveScan(orgId, code) {
        const g = (0, gs1_1.parseGs1)(code);
        const gtin = g.gtin ?? (/^\d{8,14}$/.test(code.trim()) ? code.trim() : undefined);
        const candidates = gtin ? [gtin, gtin.replace(/^0+/, ""), gtin.padStart(14, "0")] : [];
        const drug = gtin ? await this.prisma.drug.findFirst({ where: { gtin: { in: candidates }, OR: [{ orgId: null }, { orgId }] } }) : null;
        return { gtin: gtin ?? null, lotNumber: g.lot ?? null, expiryDate: g.expiry ?? null, drug };
    }
    async receive(user, input) {
        const { orgId } = user;
        if (input.idempotencyKey) {
            const prior = await this.prisma.goodsReceipt.findUnique({ where: { orgId_idempotencyKey: { orgId, idempotencyKey: input.idempotencyKey } }, include: { lines: true } });
            if (prior)
                return { ...prior, replayed: true };
        }
        const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
        const pack = this.packs.get(tenant.marketCode);
        const supplierId = input.supplierId ?? undefined;
        if (supplierId && !(await this.prisma.supplier.findFirst({ where: { id: supplierId, orgId } })))
            throw (0, errors_1.notFound)("Supplier", supplierId);
        const po = input.purchaseOrderId ? await this.prisma.purchaseOrder.findFirst({ where: { id: input.purchaseOrderId, orgId, branchId: input.branchId }, include: { lines: true } }) : null;
        if (input.purchaseOrderId && !po)
            throw (0, errors_1.notFound)("Purchase order", input.purchaseOrderId);
        if (po && (po.status === "CANCELLED" || po.status === "RECEIVED"))
            throw new errors_1.DomainError("PO_CLOSED", `Purchase order is ${po.status}`, 409);
        if (!input.lines.length)
            throw new errors_1.DomainError("NO_LINES", "A receipt needs at least one line", 400);
        return this.prisma.$transaction(async (tx) => {
            const receipt = await tx.goodsReceipt.create({
                data: { orgId, branchId: input.branchId, supplierId: supplierId ?? po?.supplierId ?? null, purchaseOrderId: po?.id, invoiceNo: input.invoiceNo, invoiceTotal: input.invoiceTotal, idempotencyKey: input.idempotencyKey, receivedBy: user.userId },
            });
            let total = (0, money_1.D)(0);
            const tolerance = (0, money_1.D)((await this.modes.settings(orgId)).costVarianceTolerancePct ?? 5);
            const variances = [];
            const outLines = [];
            for (const rawLine of input.lines) {
                const scan = rawLine.scan ? await this.resolveScan(orgId, rawLine.scan) : null;
                const drugId = rawLine.drugId ?? scan?.drug?.id;
                if (!drugId)
                    throw new errors_1.DomainError("DRUG_UNRESOLVED", "Line needs a drugId or a scan that matches the catalogue", 400);
                const factor = await this.uoms.factor(orgId, drugId, rawLine.uom);
                const line = factor === 1 ? rawLine : { ...rawLine, quantity: rawLine.quantity * factor, unitCost: (0, money_1.D)(rawLine.unitCost).div(factor).toDecimalPlaces(2).toString() };
                const drug = await tx.drug.findFirst({ where: { id: drugId, OR: [{ orgId: null }, { orgId }] } });
                if (!drug)
                    throw (0, errors_1.notFound)("Drug", drugId);
                const lotNumber = (line.lotNumber ?? scan?.lotNumber ?? "").trim();
                const expiryStr = line.expiryDate ?? scan?.expiryDate;
                if (!lotNumber || !expiryStr)
                    throw new errors_1.DomainError("LOT_REQUIRED", "Lot number and expiry date are required", 400, { drugId });
                const expiryDate = new Date(`${expiryStr.slice(0, 10)}T00:00:00.000Z`);
                if (Number.isNaN(expiryDate.getTime()))
                    throw new errors_1.DomainError("INVALID_EXPIRY", "Invalid expiry date", 400);
                if (expiryDate < startOfTodayUtc())
                    throw new errors_1.DomainError("EXPIRED_AT_RECEIPT", `Lot ${lotNumber} is already expired and cannot be received`, 409, { drugId, lotNumber });
                if (!Number.isInteger(line.quantity) || line.quantity <= 0)
                    throw new errors_1.DomainError("INVALID_QUANTITY", "Quantity must be a positive integer", 400);
                let excursion = false;
                if (drug.coldChain) {
                    if (line.temperatureC == null)
                        throw new errors_1.DomainError("TEMPERATURE_REQUIRED", "Cold-chain item: record the temperature at receipt", 400, { drugId });
                    excursion = line.temperatureC < pack.coldChainRangeC.min || line.temperatureC > pack.coldChainRangeC.max;
                }
                const poLine = po?.lines.find((l) => l.drugId === drugId);
                const prev = await tx.stockLot.findFirst({ where: { orgId, drugId }, orderBy: { receivedAt: "desc" }, select: { unitCost: true } });
                const pct = (base) => (base && base.gt(0) ? Math.round((0, money_1.D)(line.unitCost).minus(base).div(base).mul(1000).toNumber()) / 10 : null);
                const pctVsPo = pct(poLine?.unitCost), pctVsPrev = pct(prev?.unitCost);
                if ((pctVsPo != null && Math.abs(pctVsPo) > tolerance.toNumber()) || (pctVsPrev != null && Math.abs(pctVsPrev) > tolerance.toNumber()))
                    variances.push({ drugId, poUnitCost: poLine ? (0, money_1.money)(poLine.unitCost) : null, prevUnitCost: prev ? (0, money_1.money)(prev.unitCost) : null, unitCost: (0, money_1.money)(line.unitCost), pctVsPo, pctVsPrev });
                const recall = await tx.recallNotice.findFirst({ where: { orgId, status: "ACTIVE", drugId, lotNumbers: { has: lotNumber } } });
                let lot = await tx.stockLot.findUnique({ where: { branchId_drugId_lotNumber: { branchId: input.branchId, drugId, lotNumber } } });
                if (lot) {
                    if (lot.expiryDate.getTime() !== expiryDate.getTime())
                        throw new errors_1.DomainError("LOT_EXPIRY_MISMATCH", `Lot ${lotNumber} already exists with a different expiry`, 409, { drugId, lotNumber });
                }
                else {
                    lot = await tx.stockLot.create({
                        data: {
                            orgId, branchId: input.branchId, drugId, lotNumber, expiryDate, unitCost: line.unitCost, supplierId: supplierId ?? po?.supplierId, purchaseOrderId: po?.id, supplierInvoiceNo: input.invoiceNo,
                            locationId: line.locationId,
                            status: recall ? "RECALLED" : excursion ? "QUARANTINE" : "AVAILABLE",
                            blockedReason: recall ? `Recall: ${recall.reason}` : excursion ? `Cold-chain excursion at receipt (${line.temperatureC}°C)` : null,
                            blockedAt: recall || excursion ? new Date() : null, recallNoticeId: recall?.id, statusBeforeBlock: recall || excursion ? "AVAILABLE" : null,
                        },
                    });
                }
                await this.ledger.post(tx, { orgId, branchId: input.branchId, lotId: lot.id, type: "RECEIPT", quantity: line.quantity, performedBy: user.userId, refType: "GoodsReceipt", refId: receipt.id, reason: input.invoiceNo ? `Invoice ${input.invoiceNo}` : "Direct receipt" });
                if (drug.coldChain)
                    await tx.coldChainReading.create({ data: { orgId, lotId: lot.id, temperatureC: line.temperatureC, excursion, recordedBy: user.userId } });
                await tx.goodsReceiptLine.create({ data: { receiptId: receipt.id, drugId, lotId: lot.id, quantity: line.quantity, unitCost: line.unitCost, poUnitCost: poLine?.unitCost, prevUnitCost: prev?.unitCost } });
                total = total.plus((0, money_1.D)(line.unitCost).mul(line.quantity));
                outLines.push({ lotId: lot.id, drugId, quantity: line.quantity, status: lot.status });
                if (po) {
                    const pl = po.lines.find((l) => l.drugId === drugId);
                    if (pl)
                        await tx.purchaseOrderLine.update({ where: { id: pl.id }, data: { qtyReceived: { increment: line.quantity } } });
                }
            }
            if (po) {
                const lines = await tx.purchaseOrderLine.findMany({ where: { purchaseOrderId: po.id } });
                const all = lines.every((l) => l.qtyReceived >= l.qtyOrdered);
                await tx.purchaseOrder.update({ where: { id: po.id }, data: { status: all ? "RECEIVED" : "PARTIALLY_RECEIVED" } });
            }
            const sid = supplierId ?? po?.supplierId;
            if (sid) {
                const amount = input.invoiceTotal ? (0, money_1.D)(input.invoiceTotal) : (0, money_1.round2)(total);
                await tx.supplierLedgerEntry.create({ data: { orgId, supplierId: sid, type: "INVOICE", amount, refType: "GoodsReceipt", refId: receipt.id, note: input.invoiceNo, createdBy: user.userId } });
                await tx.supplier.update({ where: { id: sid }, data: { balance: { increment: amount } } });
            }
            await tx.auditLog.create({ data: { orgId, actorId: user.userId, action: "inventory.receive", entityType: "GoodsReceipt", entityId: receipt.id, meta: { lines: outLines.length, total: (0, money_1.money)(total), poId: po?.id ?? null } } });
            if (variances.length)
                await tx.auditLog.create({ data: { orgId, actorId: user.userId, action: "inventory.cost_variance", entityType: "GoodsReceipt", entityId: receipt.id, meta: { lines: variances.length, tolerancePct: tolerance.toNumber() } } });
            return { ...receipt, lines: outLines, total: (0, money_1.money)(total), variances, replayed: false };
        }, { timeout: 30_000 }).catch((e) => {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === "P2002" && input.idempotencyKey)
                return this.prisma.goodsReceipt.findUniqueOrThrow({ where: { orgId_idempotencyKey: { orgId, idempotencyKey: input.idempotencyKey } } });
            throw e;
        });
    }
};
exports.ReceivingService = ReceivingService;
exports.ReceivingService = ReceivingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(stock_ledger_service_1.StockLedger)),
    __param(2, (0, common_1.Inject)(ports_1.KERNEL.marketPacks)),
    __param(3, (0, common_1.Inject)(uom_service_1.UomService)),
    __param(4, (0, common_1.Inject)(tenant_mode_service_1.TenantModeService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stock_ledger_service_1.StockLedger, Object, uom_service_1.UomService,
        tenant_mode_service_1.TenantModeService])
], ReceivingService);
//# sourceMappingURL=receiving.service.js.map