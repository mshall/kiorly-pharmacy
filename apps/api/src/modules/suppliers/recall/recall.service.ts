import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { DomainError, notFound } from "../../../common/errors";
import type { AuthUser } from "../../../auth/auth-user";
import { NotificationsService } from "../../../platform/adapters/notifications.service";

/**
 * SAFETY PATH (KPSUP03, safety.pharmacy.lot_recall_block; ADR-025: never behind a feature flag).
 * Entering a recall notice blocks every matching lot in EVERY branch of the tenant inside one transaction (requirement: < 5 minutes;
 * this is synchronous, i.e. immediate). Lots received later under an ACTIVE notice are created RECALLED (see ReceivingService).
 */
@Injectable()
export class RecallService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(NotificationsService) private readonly notify: NotificationsService) {}

  async enter(user: AuthUser, input: { drugId: string; lotNumbers: string[]; reason: string; source?: string }) {
    const drug = await this.prisma.drug.findFirst({ where: { id: input.drugId, OR: [{ orgId: null }, { orgId: user.orgId }] } });
    if (!drug) throw notFound("Drug", input.drugId);
    const lotNumbers = [...new Set(input.lotNumbers.map((s) => s.trim()).filter(Boolean))];
    if (!lotNumbers.length) throw new DomainError("LOTS_REQUIRED", "At least one lot number is required", 400);
    const started = Date.now();
    const notice = await this.prisma.$transaction(async (tx) => {
      const n = await tx.recallNotice.create({ data: { orgId: user.orgId, drugId: input.drugId, lotNumbers, reason: input.reason, source: input.source, enteredBy: user.userId } });
      const lots = await tx.stockLot.findMany({ where: { orgId: user.orgId, drugId: input.drugId, lotNumber: { in: lotNumbers }, status: { not: "RECALLED" } } });
      for (const l of lots) {
        await tx.stockLot.update({ where: { id: l.id }, data: { status: "RECALLED", statusBeforeBlock: l.status === "QUARANTINE" ? l.statusBeforeBlock ?? "AVAILABLE" : l.status, blockedReason: `Recall: ${input.reason}`, blockedAt: new Date(), recallNoticeId: n.id } });
        await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "lot.recall_block", entityType: "StockLot", entityId: l.id, meta: { noticeId: n.id, branchId: l.branchId, qtyOnHand: l.qtyOnHand } } });
      }
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "recall.enter", entityType: "RecallNotice", entityId: n.id, meta: { lotsBlocked: lots.length } } });
      return tx.recallNotice.update({ where: { id: n.id }, data: { affectedLots: lots.length } });
    });
    const tenant = await this.prisma.tenant.findUnique({ where: { id: user.orgId } });
    const s = (tenant?.settings ?? {}) as { ownerPhone?: string; defaultLocale?: "ar" | "en" };
    if (s.ownerPhone) await this.notify.send({ orgId: user.orgId, channel: "WHATSAPP", recipient: s.ownerPhone, template: "recall.notice", locale: s.defaultLocale ?? "ar", vars: { drug: drug.brandName, lots: lotNumbers.join(", "), reason: input.reason }, refType: "RecallNotice", refId: notice.id });
    return { ...notice, blockedWithinMs: Date.now() - started };
  }

  list(orgId: string) { return this.prisma.recallNotice.findMany({ where: { orgId }, orderBy: { enteredAt: "desc" }, take: 100 }); }

  /** Lifting restores lots only when no other ACTIVE notice still covers them. */
  async lift(user: AuthUser, id: string) {
    const n = await this.prisma.recallNotice.findFirst({ where: { id, orgId: user.orgId } });
    if (!n) throw notFound("Recall notice", id);
    if (n.status === "LIFTED") throw new DomainError("ALREADY_LIFTED", "Recall already lifted", 409);
    await this.prisma.$transaction(async (tx) => {
      await tx.recallNotice.update({ where: { id }, data: { status: "LIFTED", liftedBy: user.userId, liftedAt: new Date() } });
      const lots = await tx.stockLot.findMany({ where: { orgId: user.orgId, recallNoticeId: id, status: "RECALLED" } });
      const today = new Date(); today.setUTCHours(0, 0, 0, 0);
      for (const l of lots) {
        const other = await tx.recallNotice.findFirst({ where: { orgId: user.orgId, status: "ACTIVE", drugId: l.drugId, lotNumbers: { has: l.lotNumber }, id: { not: id } } });
        if (other) { await tx.stockLot.update({ where: { id: l.id }, data: { recallNoticeId: other.id } }); continue; }
        const restored = l.expiryDate < today ? "EXPIRED" : l.statusBeforeBlock ?? "AVAILABLE";
        await tx.stockLot.update({ where: { id: l.id }, data: { status: restored, statusBeforeBlock: null, blockedReason: restored === "EXPIRED" ? "Expired" : null, blockedAt: null, recallNoticeId: null } });
      }
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "recall.lift", entityType: "RecallNotice", entityId: id, meta: { lots: lots.length } } });
    });
    return this.prisma.recallNotice.findUniqueOrThrow({ where: { id } });
  }
}
