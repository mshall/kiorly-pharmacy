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
exports.LocationsService = exports.LOCATION_KINDS = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
exports.LOCATION_KINDS = ["SHELF", "FRIDGE", "SAFE", "BACKROOM", "DISPLAY", "QUARANTINE"];
let LocationsService = class LocationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(orgId, branchId) {
        const locs = await this.prisma.shelfLocation.findMany({ where: { orgId, branchId }, orderBy: { code: "asc" } });
        const agg = await this.prisma.stockLot.groupBy({ by: ["locationId"], where: { orgId, branchId, locationId: { not: null }, qtyOnHand: { gt: 0 } }, _sum: { qtyOnHand: true }, _count: true });
        const am = new Map(agg.map((a) => [a.locationId, a]));
        return locs.map((l) => ({ ...l, lots: am.get(l.id)?._count ?? 0, units: am.get(l.id)?._sum.qtyOnHand ?? 0 }));
    }
    async create(u, branchId, d) {
        try {
            const l = await this.prisma.shelfLocation.create({ data: { orgId: u.orgId, branchId, code: d.code.trim().toUpperCase(), label: d.label, kind: d.kind ?? "SHELF" } });
            await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "location.create", entityType: "ShelfLocation", entityId: l.id } });
            return l;
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === "P2002")
                throw (0, errors_1.conflict)("LOCATION_EXISTS", "This location code already exists in the branch");
            throw e;
        }
    }
    async update(u, id, d) {
        const l = await this.prisma.shelfLocation.findFirst({ where: { id, orgId: u.orgId } });
        if (!l)
            throw (0, errors_1.notFound)("Location", id);
        if (d.active === false && (await this.prisma.stockLot.count({ where: { locationId: id, qtyOnHand: { gt: 0 } } })))
            throw new errors_1.DomainError("LOCATION_NOT_EMPTY", "Move the stock out before deactivating this location", 409);
        return this.prisma.shelfLocation.update({ where: { id }, data: d });
    }
    async assign(u, locationId, lotIds) {
        const loc = await this.prisma.shelfLocation.findFirst({ where: { id: locationId, orgId: u.orgId, active: true } });
        if (!loc)
            throw (0, errors_1.notFound)("Location", locationId);
        const lots = await this.prisma.stockLot.findMany({ where: { id: { in: lotIds }, orgId: u.orgId, branchId: loc.branchId }, include: { drug: { select: { coldChain: true, controlledSchedule: true, brandName: true } } } });
        if (lots.length !== lotIds.length)
            throw (0, errors_1.notFound)("Lot");
        for (const l of lots) {
            if (l.drug.coldChain && !["FRIDGE", "QUARANTINE"].includes(loc.kind))
                throw new errors_1.DomainError("COLD_CHAIN_LOCATION", `${l.drug.brandName} is cold-chain: store it in a fridge location`, 409);
            if (l.drug.controlledSchedule !== "NONE" && !["SAFE", "BACKROOM"].includes(loc.kind))
                throw new errors_1.DomainError("CONTROLLED_LOCATION", `${l.drug.brandName} is controlled: store it in a safe or locked room`, 409);
        }
        await this.prisma.stockLot.updateMany({ where: { id: { in: lotIds } }, data: { locationId } });
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "location.assign", entityType: "ShelfLocation", entityId: locationId, meta: { lots: lotIds.length } } });
        return { assigned: lotIds.length };
    }
    async contents(orgId, locationId) {
        const loc = await this.prisma.shelfLocation.findFirst({ where: { id: locationId, orgId } });
        if (!loc)
            throw (0, errors_1.notFound)("Location", locationId);
        const lots = await this.prisma.stockLot.findMany({ where: { orgId, locationId, qtyOnHand: { gt: 0 } }, include: { drug: { select: { brandName: true, brandNameAr: true, strength: true } } }, orderBy: [{ drug: { brandName: "asc" } }, { expiryDate: "asc" }] });
        return { location: loc, lots: lots.map((l) => ({ lotId: l.id, brandName: l.drug.brandName, brandNameAr: l.drug.brandNameAr, strength: l.drug.strength, lotNumber: l.lotNumber, expiryDate: l.expiryDate, qtyOnHand: l.qtyOnHand, status: l.status, value: (0, money_1.money)((0, money_1.D)(l.unitCost).mul(l.qtyOnHand)) })) };
    }
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocationsService);
//# sourceMappingURL=locations.service.js.map