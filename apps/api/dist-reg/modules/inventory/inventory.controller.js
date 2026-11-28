"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../auth/decorators");
const pagination_1 = require("../../common/pagination");
const branch_scope_1 = require("../../common/branch-scope");
const prisma_service_1 = require("../../prisma/prisma.service");
const inventory_service_1 = require("./inventory.service");
const receiving_service_1 = require("./receiving.service");
const counts_service_1 = require("./counts.service");
const transfers_service_1 = require("./transfers.service");
const approval_service_1 = require("../../auth/approval.service");
const requires_entitlement_guard_1 = require("../../kernel-adapter/requires-entitlement.guard");
const dto = __importStar(require("./inventory.dto"));
const errors_1 = require("../../common/errors");
const LOT_STATUSES = ["RECEIVED", "AVAILABLE", "RESERVED", "DISPENSED", "QUARANTINE", "EXPIRED", "RECALLED"];
let InventoryController = class InventoryController {
    inv;
    receiving;
    counts;
    transfers;
    approvals;
    prisma;
    constructor(inv, receiving, counts, transfers, approvals, prisma) {
        this.inv = inv;
        this.receiving = receiving;
        this.counts = counts;
        this.transfers = transfers;
        this.approvals = approvals;
        this.prisma = prisma;
    }
    lots(u, q) {
        const { skip, take } = (0, pagination_1.pageArgs)(q, 200);
        if (q.status && !LOT_STATUSES.includes(q.status))
            throw new errors_1.DomainError("INVALID_LOT_STATUS", `status must be one of ${LOT_STATUSES.join(", ")}`, 400);
        return this.inv.lots(u.orgId, { ...(0, branch_scope_1.branchFilter)(u, q.branchId), drugId: q.drugId, status: q.status, expiringWithinDays: q.expiringWithinDays ? Number(q.expiringWithinDays) : undefined, q: q.q, includeEmpty: q.includeEmpty === "true", skip, take });
    }
    async stock(u, q) {
        const { skip, take } = (0, pagination_1.pageArgs)(q, 200);
        return this.inv.stock(u.orgId, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, q.branchId), { q: q.q, lowOnly: q.lowOnly === "true", skip, take });
    }
    async fefo(u, q) {
        return this.inv.fefo(u.orgId, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, q.branchId), q.drugId, Number(q.qty ?? 1));
    }
    scan(u, d) { return this.receiving.resolveScan(u.orgId, d.code); }
    async receive(u, d) {
        return this.receiving.receive(u, { ...d, branchId: await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId) });
    }
    receipts(u, q) {
        return this.prisma.goodsReceipt.findMany({ where: { orgId: u.orgId, ...(0, branch_scope_1.branchFilter)(u, q.branchId) }, include: { lines: true }, orderBy: { receivedAt: "desc" }, take: 50 });
    }
    quarantine(u, id, d) { return this.inv.quarantine(u, id, d.reason); }
    release(u, id, d) { return this.inv.release(u, id, d.reason); }
    async writeOff(u, id, d) { return this.inv.writeOff(u, id, d.reason, d.witness ? await this.approvals.witness(u, d.witness) : undefined); }
    async adjust(u, d) {
        const lot = await this.prisma.stockLot.findFirst({ where: { id: d.lotId, orgId: u.orgId } });
        if (!lot)
            throw new errors_1.DomainError("LOT_NOT_FOUND", "Lot not found", 404);
        const goesNegative = d.quantity < 0 && lot.qtyOnHand + d.quantity < 0;
        const approver = goesNegative ? await this.approvals.approver(u, "inventory.negative_stock", d.approval) : undefined;
        return this.inv.adjust(u, d.lotId, d.quantity, d.reason, approver, d.witness ? await this.approvals.witness(u, d.witness) : undefined, d.reasonCode);
    }
    expiry(u, branchId) { return this.inv.expiryBuckets(u.orgId, (0, branch_scope_1.branchFilter)(u, branchId).branchId); }
    async sweep(u) { return { ...(await this.inv.expirySweep(u.orgId)), ...(await this.inv.runExpiryAlerts(u.orgId)) }; }
    async returnToSupplier(u, d) { const { witness, ...rest } = d; return this.inv.returnToSupplier(u, { ...rest, witness: witness ? await this.approvals.witness(u, witness) : undefined }); }
    temperature(u, lotId, d) { return this.inv.recordTemperature(u, lotId, d.temperatureC); }
    readings(u, lotId) { return this.inv.readings(u.orgId, lotId); }
    async policies(u, branchId) { return this.inv.reorderPolicies(u.orgId, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, branchId)); }
    async setPolicy(u, d, branchId) { return this.inv.setReorderPolicy(u.orgId, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, branchId), d); }
    countList(u, branchId) { return this.counts.list(u.orgId, (0, branch_scope_1.branchFilter)(u, branchId).branchId); }
    async countStart(u, d) { return this.counts.start(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId), d.type, d.drugIds); }
    countGet(u, id) { return this.counts.get(u.orgId, id); }
    countRecord(u, id, d) { return this.counts.record(u, id, d.lines); }
    countSubmit(u, id) { return this.counts.submit(u, id); }
    async countApprove(u, id, d) { return this.counts.approve(u, id, d.witness ? await this.approvals.witness(u, d.witness) : undefined); }
    countReject(u, id) { return this.counts.reject(u, id); }
    transferList(u) { return this.transfers.list(u.orgId); }
    transferCreate(u, d) { return this.transfers.create(u, d); }
    async transferDispatch(u, id, d) { return this.transfers.dispatch(u, id, d.witness ? await this.approvals.witness(u, d.witness) : undefined); }
    transferReceive(u, id) { return this.transfers.receive(u, id); }
    transferCancel(u, id) { return this.transfers.cancel(u, id); }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)("lots"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "lots", null);
__decorate([
    (0, common_1.Get)("stock"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "stock", null);
__decorate([
    (0, common_1.Get)("fefo"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "fefo", null);
__decorate([
    (0, common_1.Post)("scan/parse"),
    (0, decorators_1.Perm)("inventory.receive"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.ScanDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "scan", null);
__decorate([
    (0, common_1.Post)("receipts"),
    (0, decorators_1.Perm)("inventory.receive"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.ReceiptDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "receive", null);
__decorate([
    (0, common_1.Get)("receipts"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "receipts", null);
__decorate([
    (0, common_1.Post)("lots/:id/quarantine"),
    (0, decorators_1.Perm)("inventory.quarantine"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto.ReasonDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "quarantine", null);
__decorate([
    (0, common_1.Post)("lots/:id/release"),
    (0, decorators_1.Perm)("inventory.quarantine"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto.ReasonDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "release", null);
__decorate([
    (0, common_1.Post)("lots/:id/write-off"),
    (0, decorators_1.Perm)("inventory.adjust"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto.ReasonDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "writeOff", null);
__decorate([
    (0, common_1.Post)("adjustments"),
    (0, decorators_1.Perm)("inventory.adjust"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.AdjustDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "adjust", null);
__decorate([
    (0, common_1.Get)("expiry"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "expiry", null);
__decorate([
    (0, common_1.Post)("jobs/expiry-sweep"),
    (0, decorators_1.Perm)("inventory.adjust"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "sweep", null);
__decorate([
    (0, common_1.Post)("returns-to-supplier"),
    (0, decorators_1.Perm)("inventory.adjust", "supplier.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.ReturnSupplierDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "returnToSupplier", null);
__decorate([
    (0, common_1.Post)("cold-chain/:lotId/readings"),
    (0, decorators_1.Perm)("inventory.receive"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("lotId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto.TempDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "temperature", null);
__decorate([
    (0, common_1.Get)("cold-chain/:lotId/readings"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("lotId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "readings", null);
__decorate([
    (0, common_1.Get)("reorder-policies"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "policies", null);
__decorate([
    (0, common_1.Put)("reorder-policies"),
    (0, decorators_1.Perm)("inventory.adjust"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.PolicyDto, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "setPolicy", null);
__decorate([
    (0, common_1.Get)("counts"),
    (0, decorators_1.Perm)("inventory.count"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "countList", null);
__decorate([
    (0, common_1.Post)("counts"),
    (0, decorators_1.Perm)("inventory.count"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CountStartDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "countStart", null);
__decorate([
    (0, common_1.Get)("counts/:id"),
    (0, decorators_1.Perm)("inventory.count"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "countGet", null);
__decorate([
    (0, common_1.Put)("counts/:id/lines"),
    (0, decorators_1.Perm)("inventory.count"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto.CountRecordDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "countRecord", null);
__decorate([
    (0, common_1.Post)("counts/:id/submit"),
    (0, decorators_1.Perm)("inventory.count"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "countSubmit", null);
__decorate([
    (0, common_1.Post)("counts/:id/approve"),
    (0, decorators_1.Perm)("inventory.count.approve"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto.WitnessDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "countApprove", null);
__decorate([
    (0, common_1.Post)("counts/:id/reject"),
    (0, decorators_1.Perm)("inventory.count.approve"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "countReject", null);
__decorate([
    (0, common_1.Get)("transfers"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("transfers"),
    (0, decorators_1.Perm)("inventory.transfer"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "transferList", null);
__decorate([
    (0, common_1.Post)("transfers"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("transfers"),
    (0, decorators_1.Perm)("inventory.transfer"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.TransferDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "transferCreate", null);
__decorate([
    (0, common_1.Post)("transfers/:id/dispatch"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("transfers"),
    (0, decorators_1.Perm)("inventory.transfer"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto.WitnessDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "transferDispatch", null);
__decorate([
    (0, common_1.Post)("transfers/:id/receive"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("transfers"),
    (0, decorators_1.Perm)("inventory.transfer"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "transferReceive", null);
__decorate([
    (0, common_1.Post)("transfers/:id/cancel"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("transfers"),
    (0, decorators_1.Perm)("inventory.transfer"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "transferCancel", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)("inventory"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("inventory"),
    __param(0, (0, common_1.Inject)(inventory_service_1.InventoryService)),
    __param(1, (0, common_1.Inject)(receiving_service_1.ReceivingService)),
    __param(2, (0, common_1.Inject)(counts_service_1.CountsService)),
    __param(3, (0, common_1.Inject)(transfers_service_1.TransfersService)),
    __param(4, (0, common_1.Inject)(approval_service_1.ApprovalService)),
    __param(5, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService,
        receiving_service_1.ReceivingService,
        counts_service_1.CountsService,
        transfers_service_1.TransfersService,
        approval_service_1.ApprovalService,
        prisma_service_1.PrismaService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map