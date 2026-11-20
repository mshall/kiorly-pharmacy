import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, conflict, notFound } from "../../common/errors";
import { D, money } from "../../common/money";
import type { AuthUser } from "../../auth/auth-user";

export const PROMO_KINDS = ["PERCENT_OFF", "AMOUNT_OFF", "BUY_X_GET_Y", "BUNDLE_PRICE"] as const;
export interface PromotionInput {
  name: string; nameAr?: string; kind: (typeof PROMO_KINDS)[number]; couponCode?: string; drugIds?: string[]; params: Record<string, unknown>; startsAt?: string; endsAt?: string;
  minSubtotal?: string; maxUses?: number; priority?: number; stackable?: boolean; branchId?: string; active?: boolean;
}

function validateParams(d: Pick<PromotionInput, "kind" | "params" | "drugIds">) {
  const p = d.params as { percent?: number; amount?: number | string; buy?: number; get?: number; items?: Array<{ drugId: string; qty: number }>; price?: number | string };
  const bad = (m: string) => new DomainError("INVALID_PROMOTION", m, 400);
  if (d.kind === "PERCENT_OFF" && !(typeof p.percent === "number" && p.percent > 0 && p.percent <= 100)) throw bad("percent must be between 0 and 100");
  if (d.kind === "AMOUNT_OFF" && !(D(p.amount ?? 0).gt(0))) throw bad("amount must be positive");
  if (d.kind === "BUY_X_GET_Y" && !((p.buy ?? 0) >= 1 && (p.get ?? 0) >= 1)) throw bad("buy and get must be at least 1");
  if (d.kind === "BUY_X_GET_Y" && !(d.drugIds?.length)) throw bad("choose the products for a buy-X-get-Y deal");
  if (d.kind === "BUNDLE_PRICE" && !(p.items?.length && p.price != null && D(p.price).gt(0) && p.items.every((i) => i.drugId && i.qty >= 1))) throw bad("a bundle needs items (drug + quantity) and a price");
}

/** Promotions, coupons and bundle deals (price book stays untouched; discounts are line discounts on the sale). */
@Injectable()
export class PromotionsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private view(p: { minSubtotal: Prisma.Decimal | null } & Record<string, unknown>) { return { ...p, minSubtotal: p.minSubtotal ? money(p.minSubtotal) : null }; }

  async list(orgId: string, q: { active?: boolean; q?: string }) {
    const rows = await this.prisma.promotion.findMany({ where: { orgId, ...(q.active !== undefined ? { active: q.active } : {}), ...(q.q ? { OR: [{ name: { contains: q.q, mode: "insensitive" } }, { couponCode: { contains: q.q, mode: "insensitive" } }] } : {}) }, orderBy: [{ active: "desc" }, { createdAt: "desc" }], take: 200 });
    const sums = await this.prisma.promotionRedemption.groupBy({ by: ["promotionId"], where: { orgId, promotionId: { in: rows.map((r) => r.id) } }, _sum: { discountAmount: true } });
    const sm = new Map(sums.map((s) => [s.promotionId, s._sum.discountAmount]));
    const now = Date.now();
    return rows.map((r) => ({ ...this.view(r), totalDiscount: money(sm.get(r.id) ?? 0), state: !r.active ? "OFF" : r.startsAt.getTime() > now ? "SCHEDULED" : r.endsAt && r.endsAt.getTime() < now ? "ENDED" : r.maxUses != null && r.usedCount >= r.maxUses ? "EXHAUSTED" : "LIVE" }));
  }

  async create(u: AuthUser, d: PromotionInput) {
    validateParams(d);
    if (d.endsAt && d.startsAt && new Date(d.endsAt) <= new Date(d.startsAt)) throw new DomainError("INVALID_PROMOTION", "End must be after start", 400);
    if (d.drugIds?.length) { const n = await this.prisma.drug.count({ where: { id: { in: d.drugIds }, OR: [{ orgId: null }, { orgId: u.orgId }] } }); if (n !== d.drugIds.length) throw notFound("Drug"); }
    try {
      const p = await this.prisma.promotion.create({ data: { orgId: u.orgId, branchId: d.branchId, name: d.name, nameAr: d.nameAr, kind: d.kind, couponCode: d.couponCode?.trim() || null, drugIds: d.drugIds ?? [], params: d.params as Prisma.InputJsonValue, startsAt: d.startsAt ? new Date(d.startsAt) : new Date(), endsAt: d.endsAt ? new Date(d.endsAt) : null, minSubtotal: d.minSubtotal, maxUses: d.maxUses, priority: d.priority ?? 0, stackable: d.stackable ?? false, active: d.active ?? true, createdBy: u.userId } });
      await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "promotion.create", entityType: "Promotion", entityId: p.id, meta: { kind: d.kind, coupon: !!d.couponCode } } });
      return this.view(p);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") throw conflict("COUPON_EXISTS", "A promotion with this coupon code already exists");
      throw e;
    }
  }

  async update(u: AuthUser, id: string, d: Partial<PromotionInput>) {
    const cur = await this.prisma.promotion.findFirst({ where: { id, orgId: u.orgId } });
    if (!cur) throw notFound("Promotion", id);
    if (d.params || d.kind) validateParams({ kind: d.kind ?? (cur.kind as PromotionInput["kind"]), params: d.params ?? (cur.params as Record<string, unknown>), drugIds: d.drugIds ?? cur.drugIds });
    const p = await this.prisma.promotion.update({ where: { id }, data: { ...(d.name !== undefined ? { name: d.name } : {}), ...(d.nameAr !== undefined ? { nameAr: d.nameAr } : {}), ...(d.kind ? { kind: d.kind } : {}), ...(d.params ? { params: d.params as Prisma.InputJsonValue } : {}), ...(d.drugIds ? { drugIds: d.drugIds } : {}), ...(d.endsAt !== undefined ? { endsAt: d.endsAt ? new Date(d.endsAt) : null } : {}), ...(d.minSubtotal !== undefined ? { minSubtotal: d.minSubtotal } : {}), ...(d.maxUses !== undefined ? { maxUses: d.maxUses } : {}), ...(d.priority !== undefined ? { priority: d.priority } : {}), ...(d.stackable !== undefined ? { stackable: d.stackable } : {}), ...(d.active !== undefined ? { active: d.active } : {}) } });
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "promotion.update", entityType: "Promotion", entityId: id, meta: { fields: Object.keys(d) } } });
    return this.view(p);
  }
}
