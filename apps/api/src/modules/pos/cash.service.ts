import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { D, money } from "../../common/money";
import type { AuthUser } from "../../auth/auth-user";

export const CASH_IN_CATEGORIES = ["FLOAT_TOP_UP", "OWNER_DEPOSIT", "OTHER_IN"] as const;
export const CASH_OUT_CATEGORIES = ["PETTY_CASH", "BANK_DEPOSIT", "SUPPLIER_PAYMENT", "EXPENSE", "OWNER_WITHDRAWAL", "OTHER_OUT"] as const;

/** Cash drawer in/out inside the open shift. Z-report / X-report / shift close include them in the expected cash. */
@Injectable()
export class CashService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /** `tx`/`db` lets Finance post an expense paid from the drawer in the same transaction. */
  async record(u: AuthUser, branchId: string, d: { kind: "IN" | "OUT"; category: string; amount: string; reason: string; refType?: string; refId?: string }, db: Pick<PrismaService, "shift" | "cashMovement" | "auditLog"> = this.prisma) {
    if (D(d.amount).lte(0)) throw new DomainError("INVALID_AMOUNT", "Amount must be positive", 400);
    if (!(d.kind === "IN" ? CASH_IN_CATEGORIES : CASH_OUT_CATEGORIES).includes(d.category as never)) throw new DomainError("INVALID_CATEGORY", `Category ${d.category} is not valid for cash ${d.kind}`, 400);
    const shift = await db.shift.findFirst({ where: { orgId: u.orgId, branchId, status: "OPEN" } });
    if (!shift) throw new DomainError("SHIFT_REQUIRED", "Open a shift before moving cash in or out of the drawer", 409);
    const m = await db.cashMovement.create({ data: { orgId: u.orgId, branchId, shiftId: shift.id, kind: d.kind, category: d.category, amount: d.amount, reason: d.reason, refType: d.refType, refId: d.refId, createdBy: u.userId } });
    await db.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: `cash.${d.kind.toLowerCase()}`, entityType: "CashMovement", entityId: m.id, meta: { amount: money(d.amount), category: d.category } } });
    return m;
  }

  async list(orgId: string, q: { shiftId?: string; branchId?: string }) {
    const rows = await this.prisma.cashMovement.findMany({ where: { orgId, ...(q.shiftId ? { shiftId: q.shiftId } : {}), ...(q.branchId ? { branchId: q.branchId } : {}) }, orderBy: { createdAt: "desc" }, take: 200 });
    return rows.map((r) => ({ ...r, amount: money(r.amount) }));
  }

  async totals(orgId: string, shiftId: string) {
    const rows = await this.prisma.cashMovement.groupBy({ by: ["kind"], where: { orgId, shiftId }, _sum: { amount: true } });
    const g = (k: string) => D(rows.find((r) => r.kind === k)?._sum.amount ?? 0);
    return { cashIn: g("IN"), cashOut: g("OUT") };
  }

  async mustShift(orgId: string, shiftId: string) { const s = await this.prisma.shift.findFirst({ where: { id: shiftId, orgId } }); if (!s) throw notFound("Shift", shiftId); return s; }
}
