import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { D, money } from "../../common/money";
import type { AuthUser } from "../../auth/auth-user";

/** KPPOS05 customer credit accounts (neighbourhood pharmacy "ledger") with limits. */
@Injectable()
export class CustomersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(user: AuthUser, d: { displayName: string; phone?: string; creditLimit: string }) {
    if (D(d.creditLimit).isNeg()) throw new DomainError("INVALID_LIMIT", "Credit limit must be >= 0", 400);
    return this.prisma.$transaction(async (tx) => {
      const p = await tx.patientRef.create({ data: { orgId: user.orgId, displayName: d.displayName, phone: d.phone } });
      const a = await tx.customerAccount.create({ data: { orgId: user.orgId, patientId: p.id, creditLimit: d.creditLimit } });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "customer.create", entityType: "CustomerAccount", entityId: a.id } });
      return { ...a, displayName: p.displayName, phone: p.phone };
    });
  }

  async list(orgId: string, q?: string) {
    const rows = await this.prisma.customerAccount.findMany({ where: { orgId, ...(q ? { patient: { OR: [{ displayName: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }] } } : {}) }, include: { patient: { select: { displayName: true, phone: true } } }, orderBy: { createdAt: "desc" }, take: 100 });
    return rows.map((a) => ({ id: a.id, displayName: a.patient.displayName, phone: a.patient.phone, creditLimit: money(a.creditLimit), balance: money(a.balance), available: money(a.creditLimit.minus(a.balance)) }));
  }

  async get(orgId: string, id: string) {
    const a = await this.prisma.customerAccount.findFirst({ where: { id, orgId }, include: { patient: { select: { displayName: true, phone: true } }, entries: { orderBy: { createdAt: "desc" }, take: 100 } } });
    if (!a) throw notFound("Customer account", id);
    return a;
  }

  async setLimit(user: AuthUser, id: string, creditLimit: string) {
    await this.get(user.orgId, id);
    const r = await this.prisma.customerAccount.update({ where: { id }, data: { creditLimit } });
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "customer.limit", entityType: "CustomerAccount", entityId: id, meta: { creditLimit: money(creditLimit) } } });
    return r;
  }

  /** Customer pays down their balance (cash at the till of `branchId`; counted in that shift's expected cash). */
  async pay(user: AuthUser, id: string, amount: string, branchId: string) {
    if (D(amount).lte(0)) throw new DomainError("INVALID_AMOUNT", "Amount must be positive", 400);
    return this.prisma.$transaction(async (tx) => {
      const [a] = await tx.$queryRaw<Array<{ balance: string }>>`SELECT balance FROM "CustomerAccount" WHERE id = ${id} AND "orgId" = ${user.orgId} FOR UPDATE`;
      if (!a) throw notFound("Customer account", id);
      if (D(amount).gt(a.balance)) throw new DomainError("OVERPAYMENT", "Payment exceeds the outstanding balance", 409, { balance: money(a.balance) });
      await tx.customerCreditEntry.create({ data: { orgId: user.orgId, accountId: id, kind: "PAYMENT", amount: D(amount).neg(), note: `cash:${branchId}`, createdBy: user.userId } });
      const r = await tx.customerAccount.update({ where: { id }, data: { balance: { decrement: amount } } });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "customer.payment", entityType: "CustomerAccount", entityId: id, meta: { amount: money(amount) } } });
      return r;
    });
  }
}
