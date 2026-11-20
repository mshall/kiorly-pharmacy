import { Inject, Injectable } from "@nestjs/common";
import type { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import type { AuthUser } from "../../auth/auth-user";

/** Parked carts at the till. A held cart reserves nothing (stock is only moved at checkout); it just keeps the lines + customer. */
@Injectable()
export class HeldCartsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async hold(u: AuthUser, branchId: string, d: { label?: string; patientId?: string; payload: Prisma.InputJsonValue }) {
    const lines = (d.payload as { lines?: unknown[] }).lines;
    if (!Array.isArray(lines) || !lines.length) throw new DomainError("EMPTY_CART", "Nothing to hold", 400);
    const n = await this.prisma.heldCart.count({ where: { orgId: u.orgId, branchId, status: "HELD" } });
    if (n >= 30) throw new DomainError("TOO_MANY_HELD", "Too many held carts; resume or discard some", 409);
    const h = await this.prisma.heldCart.create({ data: { orgId: u.orgId, branchId, userId: u.userId, label: d.label?.trim() || `#${n + 1}`, patientId: d.patientId, payload: d.payload } });
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "cart.hold", entityType: "HeldCart", entityId: h.id, meta: { lines: lines.length } } });
    return h;
  }

  list(orgId: string, branchId: string) { return this.prisma.heldCart.findMany({ where: { orgId, branchId, status: "HELD" }, orderBy: { createdAt: "desc" } }); }

  /** Resume = return the payload and close the held record (it cannot be resumed twice). */
  async resume(u: AuthUser, id: string) {
    const h = await this.prisma.heldCart.findFirst({ where: { id, orgId: u.orgId } });
    if (!h) throw notFound("Held cart", id);
    if (u.branchId && h.branchId !== u.branchId) throw new DomainError("BRANCH_FORBIDDEN", "This cart belongs to another branch", 403);
    const r = await this.prisma.heldCart.updateMany({ where: { id, status: "HELD" }, data: { status: "RESUMED", resolvedAt: new Date() } });
    if (!r.count) throw new DomainError("NOT_HELD", "This cart was already resumed or discarded", 409);
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "cart.resume", entityType: "HeldCart", entityId: id } });
    return h;
  }

  async discard(u: AuthUser, id: string) {
    const r = await this.prisma.heldCart.updateMany({ where: { id, orgId: u.orgId, status: "HELD" }, data: { status: "DISCARDED", resolvedAt: new Date() } });
    if (!r.count) throw notFound("Held cart", id);
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "cart.discard", entityType: "HeldCart", entityId: id } });
    return { ok: true };
  }
}
