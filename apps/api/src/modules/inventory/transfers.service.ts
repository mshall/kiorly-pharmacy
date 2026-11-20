import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { StockLedger } from "./stock-ledger.service";
import type { AuthUser } from "../../auth/auth-user";

/** Chain edition inter-branch transfers: REQUESTED -> IN_TRANSIT (stock leaves source) -> RECEIVED (stock enters destination lot with the same lot/expiry). */
@Injectable()
export class TransfersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(StockLedger) private readonly ledger: StockLedger) {}

  async create(user: AuthUser, input: { fromBranchId: string; toBranchId: string; lines: Array<{ lotId: string; quantity: number }> }) {
    if (input.fromBranchId === input.toBranchId) throw new DomainError("SAME_BRANCH", "Source and destination must differ", 400);
    const [a, b] = await Promise.all([input.fromBranchId, input.toBranchId].map((id) => this.prisma.branch.findFirst({ where: { id, orgId: user.orgId, active: true } })));
    if (!a || !b) throw notFound("Branch");
    const lots = await this.prisma.stockLot.findMany({ where: { id: { in: input.lines.map((l) => l.lotId) }, orgId: user.orgId, branchId: input.fromBranchId } });
    if (lots.length !== new Set(input.lines.map((l) => l.lotId)).size) throw new DomainError("LOT_NOT_IN_SOURCE", "Every lot must belong to the source branch", 409);
    const lm = new Map(lots.map((l) => [l.id, l]));
    const t = await this.prisma.stockTransfer.create({
      data: { orgId: user.orgId, fromBranchId: input.fromBranchId, toBranchId: input.toBranchId, requestedBy: user.userId, lines: { create: input.lines.map((l) => ({ lotId: l.lotId, drugId: lm.get(l.lotId)!.drugId, quantity: l.quantity })) } },
      include: { lines: true },
    });
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "transfer.request", entityType: "StockTransfer", entityId: t.id } });
    return t;
  }

  list(orgId: string) { return this.prisma.stockTransfer.findMany({ where: { orgId }, include: { lines: true }, orderBy: { createdAt: "desc" }, take: 100 }); }

  async dispatch(user: AuthUser, id: string, witness?: { id: string; name: string }) {
    return this.prisma.$transaction(async (tx) => {
      const t = await tx.stockTransfer.findFirst({ where: { id, orgId: user.orgId }, include: { lines: true } });
      if (!t) throw notFound("Transfer", id);
      if (t.status !== "REQUESTED") throw new DomainError("BAD_STATE", `Transfer is ${t.status}`, 409);
      for (const l of t.lines) {
        await this.ledger.post(tx, { orgId: user.orgId, branchId: t.fromBranchId, lotId: l.lotId, type: "TRANSFER_OUT", quantity: l.quantity, performedBy: user.userId, refType: "StockTransfer", refId: t.id, witness });
      }
      const r = await tx.stockTransfer.update({ where: { id }, data: { status: "IN_TRANSIT", dispatchedBy: user.userId, dispatchedAt: new Date() }, include: { lines: true } });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "transfer.dispatch", entityType: "StockTransfer", entityId: id } });
      return r;
    });
  }

  async receive(user: AuthUser, id: string) {
    return this.prisma.$transaction(async (tx) => {
      const t = await tx.stockTransfer.findFirst({ where: { id, orgId: user.orgId }, include: { lines: true } });
      if (!t) throw notFound("Transfer", id);
      if (t.status !== "IN_TRANSIT") throw new DomainError("BAD_STATE", `Transfer is ${t.status}`, 409);
      for (const l of t.lines) {
        const src = await tx.stockLot.findUniqueOrThrow({ where: { id: l.lotId } });
        // A lot recalled / quarantined while in transit stays blocked at the destination (recall is cross-branch).
        const blocked = src.status === "RECALLED" || src.status === "QUARANTINE" || src.status === "EXPIRED";
        let dest = await tx.stockLot.findUnique({ where: { branchId_drugId_lotNumber: { branchId: t.toBranchId, drugId: l.drugId, lotNumber: src.lotNumber } } });
        if (!dest) {
          dest = await tx.stockLot.create({
            data: { orgId: user.orgId, branchId: t.toBranchId, drugId: l.drugId, lotNumber: src.lotNumber, expiryDate: src.expiryDate, unitCost: src.unitCost, supplierId: src.supplierId, status: blocked ? src.status : "AVAILABLE", blockedReason: blocked ? src.blockedReason : null, blockedAt: blocked ? new Date() : null, recallNoticeId: src.recallNoticeId, statusBeforeBlock: blocked ? "AVAILABLE" : null },
          });
        }
        await this.ledger.post(tx, { orgId: user.orgId, branchId: t.toBranchId, lotId: dest.id, type: "TRANSFER_IN", quantity: l.quantity, performedBy: user.userId, refType: "StockTransfer", refId: t.id });
      }
      const r = await tx.stockTransfer.update({ where: { id }, data: { status: "RECEIVED", receivedBy: user.userId, receivedAt: new Date() }, include: { lines: true } });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "transfer.receive", entityType: "StockTransfer", entityId: id } });
      return r;
    });
  }

  async cancel(user: AuthUser, id: string) {
    const t = await this.prisma.stockTransfer.findFirst({ where: { id, orgId: user.orgId } });
    if (!t) throw notFound("Transfer", id);
    if (t.status !== "REQUESTED") throw new DomainError("BAD_STATE", "Only requested transfers can be cancelled", 409);
    return this.prisma.stockTransfer.update({ where: { id }, data: { status: "CANCELLED" } });
  }
}
