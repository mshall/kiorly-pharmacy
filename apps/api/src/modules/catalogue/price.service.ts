import { Inject, Injectable } from "@nestjs/common";
import { Prisma, type PrismaClient } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { D } from "../../common/money";
import { DomainError } from "../../common/errors";

type Db = PrismaClient | Prisma.TransactionClient;

export interface PriceUpdate { drugId: string; price: string; branchId?: string | null }

/**
 * KPCAT03 price book. Append/close only (DB trigger `price_book_history` enforces it): an update closes the open row
 * (effectiveTo = new effectiveFrom) and inserts a new one. History is never mutated, so the price at any past date is resolvable.
 * Scope: branch-specific row beats the org-wide (central) row.
 */
@Injectable()
export class PriceService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /** Price in force at `at` for (branch, drug); null if none. Branch-specific beats central. */
  async priceAt(orgId: string, branchId: string | null, drugId: string, at: Date = new Date(), db: Db = this.prisma): Promise<Prisma.Decimal | null> {
    return (await this.pricesAt(orgId, branchId ?? "", [drugId], at, db)).get(drugId) ?? null;
  }

  async pricesAt(orgId: string, branchId: string, drugIds: string[], at: Date = new Date(), db: Db = this.prisma): Promise<Map<string, Prisma.Decimal>> {
    const out = new Map<string, Prisma.Decimal>();
    if (!drugIds.length) return out;
    const rows = await db.priceBookEntry.findMany({
      where: { orgId, drugId: { in: drugIds }, effectiveFrom: { lte: at }, OR: [{ effectiveTo: null }, { effectiveTo: { gt: at } }], AND: [{ OR: [{ branchId }, { branchId: null }] }] },
      orderBy: { effectiveFrom: "asc" },
    });
    // branch rows win over central; later effectiveFrom wins within a scope
    const central = new Map<string, Prisma.Decimal>(), branch = new Map<string, Prisma.Decimal>();
    for (const r of rows) (r.branchId ? branch : central).set(r.drugId, r.price);
    for (const id of drugIds) { const p = branch.get(id) ?? central.get(id); if (p) out.set(id, p); }
    return out;
  }

  async bulkUpdate(orgId: string, actorId: string, effectiveFrom: Date, items: PriceUpdate[]): Promise<{ updated: number }> {
    if (!items.length) return { updated: 0 };
    return this.prisma.$transaction(async (tx) => {
      let updated = 0;
      for (const it of items) {
        if (D(it.price).lt(0)) throw new DomainError("INVALID_PRICE", "Price must be >= 0", 400);
        const drug = await tx.drug.findFirst({ where: { id: it.drugId, OR: [{ orgId: null }, { orgId }] }, select: { id: true } });
        if (!drug) throw new DomainError("DRUG_NOT_FOUND", `Drug ${it.drugId} not found`, 404);
        const branchId = it.branchId ?? null;
        const later = await tx.priceBookEntry.findFirst({ where: { orgId, drugId: it.drugId, branchId, effectiveFrom: { gte: effectiveFrom } } });
        if (later) throw new DomainError("PRICE_CONFLICT", `A price effective ${later.effectiveFrom.toISOString()} already exists; choose a later effective date`, 409, { drugId: it.drugId });
        const open = await tx.priceBookEntry.findFirst({ where: { orgId, drugId: it.drugId, branchId, effectiveTo: null } });
        if (open && open.price.equals(it.price)) continue;
        if (open) await tx.priceBookEntry.update({ where: { id: open.id }, data: { effectiveTo: effectiveFrom } });
        await tx.priceBookEntry.create({ data: { orgId, drugId: it.drugId, branchId, price: it.price, effectiveFrom, createdBy: actorId } });
        updated++;
      }
      await tx.auditLog.create({ data: { orgId, actorId, action: "price.bulk_update", entityType: "PriceBookEntry", entityId: "bulk", meta: { count: updated, effectiveFrom: effectiveFrom.toISOString() } } });
      return { updated };
    });
  }

  history(orgId: string, drugId: string) {
    return this.prisma.priceBookEntry.findMany({ where: { orgId, drugId }, orderBy: [{ effectiveFrom: "desc" }] });
  }
}
