import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../audit/audit.service";
import { marketToday } from "../../common/dates";
import { notFound } from "../../common/errors";
import type { AuthUser } from "../../auth/auth-user";

export interface MobileAlert {
  id: string; kind: string; severity: "CRITICAL" | "HIGH" | "MEDIUM"; title: string; titleAr: string; body: string; bodyAr: string;
  subject: { type: string; id: string; label: string } | null; raisedAt: Date; ackedAt: Date | null; ackedBy: string | null;
}

/**
 * Safety alerts for the staff app (ADR-025). Derived live from safety data (controlled register, recalls, cold chain, expired stock), so
 * they cannot be disabled by any flag or plan: every edition sees them and can acknowledge them. Acknowledging is audited and idempotent.
 */
@Injectable()
export class MobileAlertsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(AuditService) private readonly audit: AuditService) {}

  private async derive(u: AuthUser): Promise<Array<Omit<MobileAlert, "ackedAt" | "ackedBy"> & { key: string }>> {
    const orgId = u.orgId, branch = u.branchId ? { branchId: u.branchId } : {};
    const out: Array<Omit<MobileAlert, "ackedAt" | "ackedBy"> & { key: string }> = [];
    const [discs, signs, recalls, cold, expired] = await Promise.all([
      this.prisma.controlledDiscrepancy.findMany({ where: { orgId, status: "OPEN", ...branch }, orderBy: { createdAt: "desc" }, take: 100 }),
      this.prisma.controlledCountersign.findMany({ where: { orgId } }),
      this.prisma.recallNotice.findMany({ where: { orgId, status: "ACTIVE" }, take: 50 }),
      this.prisma.stockLot.findMany({ where: { orgId, status: "QUARANTINE", drug: { coldChain: true }, qtyOnHand: { gt: 0 }, ...branch }, include: { drug: { select: { brandName: true, brandNameAr: true } } }, take: 50 }),
      this.prisma.stockLot.count({ where: { orgId, qtyOnHand: { gt: 0 }, expiryDate: { lt: marketToday() }, status: { notIn: ["RECALLED"] }, ...branch } }),
    ]);
    const drugIds = [...new Set([...discs.map((d) => d.drugId), ...recalls.map((r) => r.drugId)])];
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: drugIds } }, select: { id: true, brandName: true, brandNameAr: true } });
    const dm = new Map(drugs.map((d) => [d.id, d]));
    const independent = (d: { id: string; reportedBy: string }) => signs.some((s) => s.discrepancyId === d.id && s.witnessId !== d.reportedBy);
    for (const d of discs) {
      const dr = dm.get(d.drugId), en = dr?.brandName ?? "Controlled drug", ar = dr?.brandNameAr ?? en;
      const subject = { type: "ControlledDiscrepancy", id: d.id, label: en };
      out.push({ key: `CONTROLLED_DRUG_DISCREPANCY:${d.id}`, id: `CONTROLLED_DRUG_DISCREPANCY:${d.id}`, kind: "CONTROLLED_DRUG_DISCREPANCY", severity: "CRITICAL", title: `Controlled drug discrepancy: ${en}`, titleAr: `فرق في دواء مراقب: ${ar}`, body: `Register expected ${d.expectedQty}, counted ${d.countedQty} (difference ${d.difference}).`, bodyAr: `المتوقع بالسجل ${d.expectedQty}، المعدود ${d.countedQty} (الفرق ${d.difference}).`, subject, raisedAt: d.createdAt });
      if (!independent(d)) out.push({ key: `CONTROLLED_WITNESS_PENDING:${d.id}`, id: `CONTROLLED_WITNESS_PENDING:${d.id}`, kind: "CONTROLLED_WITNESS_PENDING", severity: "HIGH", title: `Witness countersign pending: ${en}`, titleAr: `بانتظار توقيع الشاهد: ${ar}`, body: "A second staff member must countersign this controlled-drug discrepancy.", bodyAr: "يجب أن يوقّع موظف ثانٍ على فرق الدواء المراقب.", subject, raisedAt: d.createdAt });
    }
    for (const r of recalls) {
      const inStock = await this.prisma.stockLot.count({ where: { orgId, drugId: r.drugId, lotNumber: { in: r.lotNumbers }, qtyOnHand: { gt: 0 }, ...branch } });
      if (!inStock) continue;
      const dr = dm.get(r.drugId), en = dr?.brandName ?? "Drug", ar = dr?.brandNameAr ?? en;
      out.push({ key: `RECALLED_LOT_IN_STOCK:${r.id}`, id: `RECALLED_LOT_IN_STOCK:${r.id}`, kind: "RECALLED_LOT_IN_STOCK", severity: "CRITICAL", title: `Recalled lot still in stock: ${en}`, titleAr: `تشغيلة مسحوبة ما زالت بالمخزون: ${ar}`, body: `${inStock} recalled lot(s) hold stock. ${r.reason}`, bodyAr: `${inStock} تشغيلة مسحوبة بها رصيد. ${r.reason}`, subject: { type: "RecallNotice", id: r.id, label: en }, raisedAt: r.enteredAt });
    }
    for (const l of cold) out.push({ key: `COLD_CHAIN_EXCURSION:${l.id}`, id: `COLD_CHAIN_EXCURSION:${l.id}`, kind: "COLD_CHAIN_EXCURSION", severity: "HIGH", title: `Cold-chain excursion: ${l.drug.brandName}`, titleAr: `ارتفاع حرارة سلسلة التبريد: ${l.drug.brandNameAr ?? l.drug.brandName}`, body: `Lot ${l.lotNumber} is quarantined after a temperature excursion (${l.qtyOnHand} units).`, bodyAr: `التشغيلة ${l.lotNumber} محجوزة بعد تجاوز درجة الحرارة (${l.qtyOnHand} وحدة).`, subject: { type: "StockLot", id: l.id, label: l.lotNumber }, raisedAt: l.receivedAt });
    if (expired) { const day = marketToday().toISOString().slice(0, 10); out.push({ key: `EXPIRED_STOCK:${day}`, id: `EXPIRED_STOCK:${day}`, kind: "EXPIRED_STOCK", severity: "MEDIUM", title: `${expired} expired lot(s) still on the shelf`, titleAr: `${expired} تشغيلة منتهية الصلاحية على الرف`, body: "Expired lots are blocked from sale but must be quarantined or written off.", bodyAr: "التشغيلات المنتهية ممنوعة من البيع ويجب حجزها أو إعدامها.", subject: null, raisedAt: new Date() }); }
    return out;
  }

  async list(u: AuthUser, status: "open" | "all" = "open") {
    const derived = await this.derive(u);
    const acks = await this.prisma.mobileAlertAck.findMany({ where: { orgId: u.orgId, alertKey: { in: derived.map((a) => a.key) } } });
    const am = new Map(acks.map((a) => [a.alertKey, a]));
    const names = await this.prisma.staffUser.findMany({ where: { id: { in: acks.map((a) => a.ackedBy) } }, select: { id: true, displayName: true } });
    const nm = new Map(names.map((n) => [n.id, n.displayName]));
    const rank = { CRITICAL: 0, HIGH: 1, MEDIUM: 2 } as const;
    const items = derived.map(({ key, ...a }): MobileAlert => { const k = am.get(key); return { ...a, ackedAt: k?.ackedAt ?? null, ackedBy: k ? nm.get(k.ackedBy) ?? k.ackedBy : null }; })
      .filter((a) => status === "all" || !a.ackedAt).sort((a, b) => rank[a.severity] - rank[b.severity] || b.raisedAt.getTime() - a.raisedAt.getTime());
    return { items };
  }

  async ack(u: AuthUser, id: string, note?: string) {
    const derived = await this.derive(u);
    if (!derived.some((a) => a.key === id)) throw notFound("Alert", id);
    const existing = await this.prisma.mobileAlertAck.findUnique({ where: { orgId_alertKey: { orgId: u.orgId, alertKey: id } } });
    if (!existing) {
      await this.prisma.mobileAlertAck.upsert({ where: { orgId_alertKey: { orgId: u.orgId, alertKey: id } }, create: { orgId: u.orgId, alertKey: id, ackedBy: u.userId, note }, update: {} });
      await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "mobile.alert_ack", entityType: "MobileAlert", entityId: id, meta: { hasNote: !!note } });
    }
    return (await this.list(u, "all")).items.find((a) => a.id === id)!;
  }
}
