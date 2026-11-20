import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, conflict, notFound } from "../../common/errors";
import { D, money } from "../../common/money";
import type { AuthUser } from "../../auth/auth-user";

export const LOCATION_KINDS = ["SHELF", "FRIDGE", "SAFE", "BACKROOM", "DISPLAY", "QUARANTINE"] as const;

/** Shelf locations per branch: where a lot physically sits. Fridge locations hold cold-chain stock; safes hold controlled stock. */
@Injectable()
export class LocationsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async list(orgId: string, branchId: string) {
    const locs = await this.prisma.shelfLocation.findMany({ where: { orgId, branchId }, orderBy: { code: "asc" } });
    const agg = await this.prisma.stockLot.groupBy({ by: ["locationId"], where: { orgId, branchId, locationId: { not: null }, qtyOnHand: { gt: 0 } }, _sum: { qtyOnHand: true }, _count: true });
    const am = new Map(agg.map((a) => [a.locationId, a]));
    return locs.map((l) => ({ ...l, lots: am.get(l.id)?._count ?? 0, units: am.get(l.id)?._sum.qtyOnHand ?? 0 }));
  }

  async create(u: AuthUser, branchId: string, d: { code: string; label?: string; kind?: string }) {
    try {
      const l = await this.prisma.shelfLocation.create({ data: { orgId: u.orgId, branchId, code: d.code.trim().toUpperCase(), label: d.label, kind: d.kind ?? "SHELF" } });
      await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "location.create", entityType: "ShelfLocation", entityId: l.id } });
      return l;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") throw conflict("LOCATION_EXISTS", "This location code already exists in the branch");
      throw e;
    }
  }

  async update(u: AuthUser, id: string, d: { label?: string; kind?: string; active?: boolean }) {
    const l = await this.prisma.shelfLocation.findFirst({ where: { id, orgId: u.orgId } });
    if (!l) throw notFound("Location", id);
    if (d.active === false && (await this.prisma.stockLot.count({ where: { locationId: id, qtyOnHand: { gt: 0 } } }))) throw new DomainError("LOCATION_NOT_EMPTY", "Move the stock out before deactivating this location", 409);
    return this.prisma.shelfLocation.update({ where: { id }, data: d });
  }

  /** Put lots on a location (cold-chain lots only in FRIDGE or QUARANTINE; controlled lots only in SAFE / BACKROOM). */
  async assign(u: AuthUser, locationId: string, lotIds: string[]) {
    const loc = await this.prisma.shelfLocation.findFirst({ where: { id: locationId, orgId: u.orgId, active: true } });
    if (!loc) throw notFound("Location", locationId);
    const lots = await this.prisma.stockLot.findMany({ where: { id: { in: lotIds }, orgId: u.orgId, branchId: loc.branchId }, include: { drug: { select: { coldChain: true, controlledSchedule: true, brandName: true } } } });
    if (lots.length !== lotIds.length) throw notFound("Lot");
    for (const l of lots) {
      if (l.drug.coldChain && !["FRIDGE", "QUARANTINE"].includes(loc.kind)) throw new DomainError("COLD_CHAIN_LOCATION", `${l.drug.brandName} is cold-chain: store it in a fridge location`, 409);
      if (l.drug.controlledSchedule !== "NONE" && !["SAFE", "BACKROOM"].includes(loc.kind)) throw new DomainError("CONTROLLED_LOCATION", `${l.drug.brandName} is controlled: store it in a safe or locked room`, 409);
    }
    await this.prisma.stockLot.updateMany({ where: { id: { in: lotIds } }, data: { locationId } });
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "location.assign", entityType: "ShelfLocation", entityId: locationId, meta: { lots: lotIds.length } } });
    return { assigned: lotIds.length };
  }

  /** What is on a location (pick list / shelf audit). */
  async contents(orgId: string, locationId: string) {
    const loc = await this.prisma.shelfLocation.findFirst({ where: { id: locationId, orgId } });
    if (!loc) throw notFound("Location", locationId);
    const lots = await this.prisma.stockLot.findMany({ where: { orgId, locationId, qtyOnHand: { gt: 0 } }, include: { drug: { select: { brandName: true, brandNameAr: true, strength: true } } }, orderBy: [{ drug: { brandName: "asc" } }, { expiryDate: "asc" }] });
    return { location: loc, lots: lots.map((l) => ({ lotId: l.id, brandName: l.drug.brandName, brandNameAr: l.drug.brandNameAr, strength: l.drug.strength, lotNumber: l.lotNumber, expiryDate: l.expiryDate, qtyOnHand: l.qtyOnHand, status: l.status, value: money(D(l.unitCost).mul(l.qtyOnHand)) })) };
  }
}
