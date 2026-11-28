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
exports.StockLedger = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const lot_guard_1 = require("./lot-guard/lot-guard");
const OUTBOUND = new Set(["SALE", "DISPENSE", "RESERVE", "TRANSFER_OUT"]);
const NEGATIVE_FIXED = new Set(["SALE", "DISPENSE", "TRANSFER_OUT", "RETURN_TO_SUPPLIER", "EXPIRY_WRITE_OFF", "RECALL_WRITE_OFF"]);
const POSITIVE_FIXED = new Set(["RECEIPT", "RETURN_FROM_CUSTOMER", "TRANSFER_IN"]);
const WITNESS_REQUIRED = new Set(["ADJUSTMENT", "COUNT_VARIANCE", "EXPIRY_WRITE_OFF", "RECALL_WRITE_OFF", "RETURN_TO_SUPPLIER", "TRANSFER_OUT"]);
const NOT_STOCK = new Set(["RESERVE", "RELEASE_RESERVATION"]);
let StockLedger = class StockLedger {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async lockLot(tx, lotId, orgId) {
        const rows = await tx.$queryRaw `SELECT * FROM "StockLot" WHERE id = ${lotId} AND "orgId" = ${orgId} FOR UPDATE`;
        if (!rows[0])
            throw new errors_1.DomainError("LOT_NOT_FOUND", `Lot ${lotId} not found`, 404);
        return rows[0];
    }
    async post(tx, m) {
        if (!Number.isInteger(m.quantity) || m.quantity === 0)
            throw new errors_1.DomainError("INVALID_QUANTITY", "Quantity must be a non-zero integer", 400);
        const signedFree = m.type === "ADJUSTMENT" || m.type === "COUNT_VARIANCE";
        if (!signedFree && m.quantity < 0)
            throw new errors_1.DomainError("INVALID_QUANTITY", "Quantity must be positive", 400);
        const lot = await this.lockLot(tx, m.lotId, m.orgId);
        if (lot.branchId !== m.branchId)
            throw new errors_1.DomainError("LOT_BRANCH_MISMATCH", "Lot belongs to another branch", 409);
        if (OUTBOUND.has(m.type))
            (0, lot_guard_1.assertSellable)(lot);
        let qtyDelta = m.quantity;
        if (NEGATIVE_FIXED.has(m.type))
            qtyDelta = -Math.abs(m.quantity);
        else if (POSITIVE_FIXED.has(m.type))
            qtyDelta = Math.abs(m.quantity);
        let usedApproval = false;
        const needsApproval = (violates, err) => {
            if (!violates)
                return;
            if (!m.approvedBy)
                throw err;
            usedApproval = true;
        };
        if (m.type === "SALE" || m.type === "RESERVE" || m.type === "TRANSFER_OUT" || (m.type === "DISPENSE" && !m.fromReservation)) {
            const free = lot.qtyOnHand - lot.qtyReserved;
            needsApproval(Math.abs(qtyDelta) > free, new errors_1.DomainError("INSUFFICIENT_STOCK", `Only ${Math.max(free, 0)} available on lot ${lot.lotNumber}`, 409, { lotId: lot.id, available: Math.max(free, 0), requested: Math.abs(qtyDelta) }));
        }
        if (m.type === "DISPENSE" && m.fromReservation) {
            needsApproval(lot.qtyOnHand + qtyDelta < 0, new errors_1.DomainError("INSUFFICIENT_STOCK", `Lot ${lot.lotNumber} has insufficient stock`, 409, { lotId: lot.id }));
        }
        if (signedFree && qtyDelta < 0) {
            needsApproval(lot.qtyOnHand + qtyDelta < 0, new errors_1.DomainError("NEGATIVE_STOCK_REQUIRES_APPROVAL", "Stock would go negative; manager approval required", 409, { lotId: lot.id }));
        }
        const drug = NOT_STOCK.has(m.type) ? null : await tx.drug.findUnique({ where: { id: lot.drugId }, select: { controlledSchedule: true } });
        const controlled = !!drug && drug.controlledSchedule !== "NONE";
        if (controlled && WITNESS_REQUIRED.has(m.type) && !m.witness)
            throw new errors_1.DomainError("WITNESS_REQUIRED", "Controlled medicine: a witness (second staff member) must countersign this stock change", 409, { lotId: lot.id, type: m.type });
        const row = await tx.stockMovement.create({
            data: {
                orgId: m.orgId, branchId: m.branchId, lotId: m.lotId, type: m.type, qtyDelta, reason: m.reason, reasonCode: m.reasonCode, refType: m.refType, refId: m.refId,
                managerApprovalBy: m.approvedBy, performedBy: m.performedBy,
            },
        });
        if (controlled) {
            const bal = await tx.stockLot.aggregate({ where: { orgId: m.orgId, branchId: m.branchId, drugId: lot.drugId }, _sum: { qtyOnHand: true } });
            await tx.controlledRegisterEntry.create({ data: { orgId: m.orgId, branchId: m.branchId, drugId: lot.drugId, lotId: m.lotId, movementId: row.id, kind: m.type, qtyDelta, balanceAfter: bal._sum.qtyOnHand ?? 0, refType: m.refType, refId: m.refId, performedBy: m.performedBy, witnessId: m.witness?.id, witnessName: m.witness?.name, reason: m.reason, occurredAt: row.occurredAt } });
        }
        if (usedApproval) {
            await tx.auditLog.create({ data: { orgId: m.orgId, actorId: m.performedBy, action: "stock.negative_approved", entityType: "StockLot", entityId: m.lotId, meta: { approvedBy: m.approvedBy ?? null, movementId: row.id, qty: qtyDelta } } });
        }
        return row;
    }
    async candidateLots(db, orgId, branchId, drugId) {
        return db.stockLot.findMany({ where: { orgId, branchId, drugId, status: { in: ["AVAILABLE", "RESERVED"] }, qtyOnHand: { gt: 0 } } });
    }
    async fefoPlan(db, orgId, branchId, drugId, qty) {
        const lots = await this.candidateLots(db, orgId, branchId, drugId);
        const { picks, shortage } = (0, lot_guard_1.allocateFefo)(lots, qty);
        const by = new Map(lots.map((l) => [l.id, l]));
        return { picks: picks.map((p) => ({ ...p, lotNumber: by.get(p.lotId).lotNumber, expiryDate: by.get(p.lotId).expiryDate })), shortage };
    }
};
exports.StockLedger = StockLedger;
exports.StockLedger = StockLedger = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StockLedger);
//# sourceMappingURL=stock-ledger.service.js.map