import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { notFound } from "../../common/errors";
import { marketToday } from "../../common/dates";
import type { AuthUser } from "../../auth/auth-user";

interface Candidate { kind: string; severity: "INFO" | "WARN" | "CRITICAL"; title: string; body?: string; link: string; refType?: string; refId?: string; dedupeKey: string; branchId?: string }
const DAY = 86_400_000;

/** Notification centre: scans the pharmacy for things that need attention and keeps one alert per condition (aggregates per day, entities per id). Alerts clear themselves when the condition goes away. */
@Injectable()
export class AlertsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private async candidates(orgId: string): Promise<Candidate[]> {
    const today = marketToday(), day = today.toISOString().slice(0, 10), out: Candidate[] = [];
    const [low, near, expired, refills, rxWait, disc, claims, conflicts, cold, pos, shifts, recalls, credit] = await Promise.all([
      this.prisma.$queryRaw<Array<{ n: bigint }>>`SELECT COUNT(*) AS n FROM "ReorderPolicy" p WHERE p."orgId" = ${orgId} AND COALESCE((SELECT SUM(l."qtyOnHand" - l."qtyReserved") FROM "StockLot" l WHERE l."branchId" = p."branchId" AND l."drugId" = p."drugId" AND l.status IN ('AVAILABLE','RESERVED') AND l."expiryDate" >= kx_today()),0) <= p."minQty"`,
      this.prisma.stockLot.count({ where: { orgId, qtyOnHand: { gt: 0 }, status: { in: ["AVAILABLE", "RESERVED"] }, expiryDate: { gte: today, lte: new Date(today.getTime() + 30 * DAY) } } }),
      this.prisma.stockLot.count({ where: { orgId, qtyOnHand: { gt: 0 }, expiryDate: { lt: today }, status: { notIn: ["RECALLED"] } } }),
      this.prisma.prescription.count({ where: { orgId, status: "DISPENSED", nextRefillDueAt: { not: null, lte: new Date(Date.now() + 3 * DAY) } } }),
      this.prisma.prescription.count({ where: { orgId, status: { in: ["RECEIVED", "VALIDATING"] }, receivedAt: { lt: new Date(Date.now() - 60 * 60_000) } } }),
      this.prisma.controlledDiscrepancy.findMany({ where: { orgId, status: "OPEN" }, select: { id: true, branchId: true, difference: true } }),
      this.prisma.insurerClaim.count({ where: { orgId, OR: [{ status: "SUBMITTED", submittedAt: { lt: new Date(Date.now() - 30 * DAY) } }, { status: "APPROVED", dueAt: { lt: new Date() } }] } }),
      this.prisma.syncConflict.count({ where: { orgId, resolved: false } }),
      this.prisma.stockLot.findMany({ where: { orgId, status: "QUARANTINE", drug: { coldChain: true }, qtyOnHand: { gt: 0 } }, select: { id: true, branchId: true, lotNumber: true } }),
      this.prisma.purchaseOrder.findMany({ where: { orgId, status: { in: ["SENT", "PARTIALLY_RECEIVED"] }, expectedAt: { lt: new Date() } }, select: { id: true, poNumber: true, branchId: true } }),
      this.prisma.shift.findMany({ where: { orgId, status: "OPEN", openedAt: { lt: new Date(Date.now() - 16 * 3600_000) } }, select: { id: true, branchId: true } }),
      this.prisma.recallNotice.findMany({ where: { orgId, status: "ACTIVE" }, select: { id: true, reason: true } }),
      this.prisma.customerAccount.findMany({ where: { orgId, balance: { gt: 0 } }, select: { id: true, balance: true, creditLimit: true, patient: { select: { displayName: true } } }, take: 500 }),
    ]);
    const lowN = Number(low[0]?.n ?? 0);
    if (lowN) out.push({ kind: "LOW_STOCK", severity: "WARN", title: `${lowN}`, body: "items at or below their minimum", link: "/purchasing", dedupeKey: `LOW_STOCK:${day}` });
    if (near) out.push({ kind: "NEAR_EXPIRY", severity: "WARN", title: `${near}`, body: "lots expire within 30 days", link: "/inventory", dedupeKey: `NEAR_EXPIRY:${day}` });
    if (expired) out.push({ kind: "EXPIRED_STOCK", severity: "CRITICAL", title: `${expired}`, body: "expired lots still in stock (blocked from sale)", link: "/inventory", dedupeKey: `EXPIRED_STOCK:${day}` });
    if (refills) out.push({ kind: "REFILLS_DUE", severity: "INFO", title: `${refills}`, body: "prescription refills due within 3 days", link: "/rx", dedupeKey: `REFILLS_DUE:${day}` });
    if (rxWait) out.push({ kind: "RX_WAITING", severity: "WARN", title: `${rxWait}`, body: "prescriptions waiting for verification over an hour", link: "/rx", dedupeKey: `RX_WAITING:${day}` });
    for (const d of disc) out.push({ kind: "CONTROLLED_DISCREPANCY", severity: "CRITICAL", title: `${d.difference}`, body: "controlled-substance discrepancy awaiting resolution", link: "/controlled", refType: "ControlledDiscrepancy", refId: d.id, branchId: d.branchId, dedupeKey: `DISC:${d.id}` });
    if (claims) out.push({ kind: "CLAIMS_OVERDUE", severity: "WARN", title: `${claims}`, body: "insurer claims overdue", link: "/finance", dedupeKey: `CLAIMS_OVERDUE:${day}` });
    if (conflicts) out.push({ kind: "SYNC_CONFLICTS", severity: "WARN", title: `${conflicts}`, body: "offline sales need a manager decision", link: "/pos", dedupeKey: `SYNC_CONFLICTS:${day}` });
    for (const c of cold) out.push({ kind: "COLD_CHAIN", severity: "CRITICAL", title: c.lotNumber, body: "cold-chain lot quarantined after a temperature excursion", link: "/inventory", refType: "StockLot", refId: c.id, branchId: c.branchId, dedupeKey: `COLD:${c.id}` });
    for (const p of pos) out.push({ kind: "PO_OVERDUE", severity: "INFO", title: p.poNumber ?? p.id.slice(-6), body: "purchase order is past its expected date", link: "/purchasing", refType: "PurchaseOrder", refId: p.id, branchId: p.branchId, dedupeKey: `PO:${p.id}` });
    for (const s of shifts) out.push({ kind: "SHIFT_OPEN", severity: "INFO", title: s.id.slice(-6), body: "a shift has been open for more than 16 hours", link: "/pos", refType: "Shift", refId: s.id, branchId: s.branchId, dedupeKey: `SHIFT:${s.id}` });
    for (const r of recalls) out.push({ kind: "RECALL_ACTIVE", severity: "CRITICAL", title: r.reason.slice(0, 60), body: "an active recall is blocking stock", link: "/purchasing", refType: "RecallNotice", refId: r.id, dedupeKey: `RECALL:${r.id}` });
    for (const c of credit) if (c.balance.gt(c.creditLimit)) out.push({ kind: "CREDIT_LIMIT", severity: "WARN", title: c.patient.displayName, body: "customer is over their credit limit", link: "/customers", refType: "CustomerAccount", refId: c.id, dedupeKey: `CREDIT:${c.id}` });
    return out;
  }

  /** Create alerts for new conditions; resolve entity alerts whose condition is gone. Idempotent. */
  async scan(orgId: string) {
    const cands = await this.candidates(orgId);
    const keys = new Set(cands.map((c) => c.dedupeKey));
    let created = 0;
    for (const c of cands) {
      const ex = await this.prisma.alert.findUnique({ where: { orgId_dedupeKey: { orgId, dedupeKey: c.dedupeKey } } });
      if (ex) { if (ex.resolvedAt) await this.prisma.alert.update({ where: { id: ex.id }, data: { resolvedAt: null, readBy: [] } }); continue; }
      await this.prisma.alert.create({ data: { orgId, branchId: c.branchId, kind: c.kind, severity: c.severity, title: c.title, body: c.body, link: c.link, refType: c.refType, refId: c.refId, dedupeKey: c.dedupeKey, readBy: [] } });
      created++;
    }
    const open = await this.prisma.alert.findMany({ where: { orgId, resolvedAt: null }, select: { id: true, dedupeKey: true } });
    const gone = open.filter((a) => !keys.has(a.dedupeKey)).map((a) => a.id);
    if (gone.length) await this.prisma.alert.updateMany({ where: { id: { in: gone } }, data: { resolvedAt: new Date() } });
    return { created, resolved: gone.length, open: open.length - gone.length };
  }

  async feed(u: AuthUser, q: { unread?: boolean; includeResolved?: boolean; take: number }) {
    const rows = await this.prisma.alert.findMany({ where: { orgId: u.orgId, ...(q.includeResolved ? {} : { resolvedAt: null }), ...(u.branchId ? { OR: [{ branchId: null }, { branchId: u.branchId }] } : {}) }, orderBy: [{ createdAt: "desc" }], take: q.take });
    const items = rows.map((a) => ({ ...a, read: a.readBy.includes(u.userId), readBy: undefined }));
    return { unread: items.filter((i) => !i.read && !i.resolvedAt).length, items: q.unread ? items.filter((i) => !i.read) : items };
  }

  async unreadCount(u: AuthUser) {
    const rows = await this.prisma.alert.findMany({ where: { orgId: u.orgId, resolvedAt: null, NOT: { readBy: { has: u.userId } }, ...(u.branchId ? { OR: [{ branchId: null }, { branchId: u.branchId }] } : {}) }, select: { severity: true } });
    return { unread: rows.length, critical: rows.filter((r) => r.severity === "CRITICAL").length };
  }

  async markRead(u: AuthUser, id: string) {
    const a = await this.prisma.alert.findFirst({ where: { id, orgId: u.orgId } });
    if (!a) throw notFound("Alert", id);
    if (!a.readBy.includes(u.userId)) await this.prisma.alert.update({ where: { id }, data: { readBy: { push: u.userId } } });
    return { ok: true };
  }

  async markAllRead(u: AuthUser) {
    const rows = await this.prisma.alert.findMany({ where: { orgId: u.orgId, resolvedAt: null, NOT: { readBy: { has: u.userId } } }, select: { id: true } });
    for (const r of rows) await this.prisma.alert.update({ where: { id: r.id }, data: { readBy: { push: u.userId } } });
    return { marked: rows.length };
  }
}
