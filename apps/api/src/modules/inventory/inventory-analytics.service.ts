import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { D, money } from "../../common/money";
import { DomainError } from "../../common/errors";
import type { AuthUser } from "../../auth/auth-user";
import { barcodeSvg } from "../../common/barcode";

export type MoverClass = "FAST" | "NORMAL" | "SLOW" | "DEAD";
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Pure classification used by the movers report: DEAD = stock but no net sale in the window; FAST = top quintile of sold units; SLOW = bottom quintile. */
export function classifyMovers<T extends { units: number; onHand: number }>(rows: T[]): Array<T & { class: MoverClass }> {
  const sold = rows.filter((r) => r.units > 0).map((r) => r.units).sort((a, b) => a - b);
  const q = (p: number) => sold.length ? sold[Math.min(sold.length - 1, Math.floor(p * sold.length))]! : 0;
  const fast = q(0.8), slow = q(0.2);
  return rows.map((r) => ({ ...r, class: (r.units <= 0 ? (r.onHand > 0 ? "DEAD" : "NORMAL") : sold.length >= 5 && r.units >= fast ? "FAST" : sold.length >= 5 && r.units <= slow ? "SLOW" : "NORMAL") as MoverClass }));
}

@Injectable()
export class InventoryAnalyticsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /** Fast / slow movers, dead stock, days of cover and stock value per drug over the last `days`. */
  async movers(orgId: string, branchId: string, days: number) {
    const sales = await this.prisma.$queryRaw<Array<{ drugId: string; units: bigint; lastSold: Date | null }>>`
      SELECT l."drugId", COALESCE(-SUM(m."qtyDelta"),0) AS units, MAX(CASE WHEN m.type IN ('SALE','DISPENSE') THEN m."occurredAt" END) AS "lastSold"
      FROM "StockMovement" m JOIN "StockLot" l ON l.id = m."lotId"
      WHERE m."orgId" = ${orgId} AND m."branchId" = ${branchId} AND m.type IN ('SALE','DISPENSE','RETURN_FROM_CUSTOMER') AND m."occurredAt" >= now() - (${days}::int * interval '1 day')
      GROUP BY l."drugId"`;
    const stock = await this.prisma.$queryRaw<Array<{ drugId: string; onHand: bigint; value: string; lastReceived: Date | null }>>`
      SELECT "drugId", COALESCE(SUM("qtyOnHand"),0) AS "onHand", COALESCE(SUM("qtyOnHand" * "unitCost"),0) AS value, MAX("receivedAt") AS "lastReceived" FROM "StockLot" WHERE "orgId" = ${orgId} AND "branchId" = ${branchId} GROUP BY "drugId"`;
    const ids = [...new Set([...sales.map((s) => s.drugId), ...stock.map((s) => s.drugId)])];
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: ids } }, select: { id: true, brandName: true, brandNameAr: true, strength: true, category: true } });
    const dm = new Map(drugs.map((d) => [d.id, d])), sm = new Map(sales.map((s) => [s.drugId, s])), st = new Map(stock.map((s) => [s.drugId, s]));
    const rows = ids.map((id) => {
      const s = sm.get(id), k = st.get(id), units = Number(s?.units ?? 0), onHand = Number(k?.onHand ?? 0), daily = units / days;
      return { drugId: id, brandName: dm.get(id)?.brandName ?? id, brandNameAr: dm.get(id)?.brandNameAr ?? null, strength: dm.get(id)?.strength ?? "", category: dm.get(id)?.category ?? null, units, perDay: Math.round(daily * 100) / 100, onHand, daysOfCover: daily > 0 ? Math.round(onHand / daily) : null, stockValue: money(k?.value ?? 0), lastSold: s?.lastSold ?? null, lastReceived: k?.lastReceived ?? null };
    }).filter((r) => r.units > 0 || r.onHand > 0);
    const out = classifyMovers(rows).sort((a, b) => b.units - a.units);
    const dead = out.filter((r) => r.class === "DEAD");
    return { days, counts: { FAST: out.filter((r) => r.class === "FAST").length, NORMAL: out.filter((r) => r.class === "NORMAL").length, SLOW: out.filter((r) => r.class === "SLOW").length, DEAD: dead.length }, deadStockValue: money(dead.reduce((a, r) => a.plus(r.stockValue), D(0))), items: out };
  }

  /** Derive min/max from the last `days` of sales: min = demand over (lead time + safety days), max = min + review period of demand. Existing policies are kept unless `overwrite`. */
  async autoReorder(u: AuthUser, branchId: string, o: { days: number; safetyDays: number; reviewDays: number; overwrite: boolean }) {
    if (o.days < 14) throw new DomainError("WINDOW_TOO_SHORT", "Use at least 14 days of history", 400);
    const m = await this.movers(u.orgId, branchId, o.days);
    const existing = await this.prisma.reorderPolicy.findMany({ where: { orgId: u.orgId, branchId } });
    const em = new Map(existing.map((p) => [p.drugId, p]));
    let created = 0, updated = 0, skipped = 0;
    for (const r of m.items.filter((x) => x.units > 0)) {
      const cur = em.get(r.drugId);
      if (cur && !o.overwrite) { skipped++; continue; }
      const lead = cur?.leadTimeDays ?? 2;
      const min = Math.max(1, Math.ceil(r.perDay * (lead + o.safetyDays))), max = Math.max(min + 1, Math.ceil(min + r.perDay * o.reviewDays));
      await this.prisma.reorderPolicy.upsert({ where: { branchId_drugId: { branchId, drugId: r.drugId } }, create: { orgId: u.orgId, branchId, drugId: r.drugId, minQty: min, maxQty: max, leadTimeDays: lead }, update: { minQty: min, maxQty: max } });
      cur ? updated++ : created++;
    }
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "reorder.auto_policies", entityType: "ReorderPolicy", entityId: branchId, meta: { created, updated, skipped, days: o.days } } });
    return { created, updated, skipped };
  }

  /** Cold-chain lots with their latest temperature reading and excursion state. */
  async coldChain(orgId: string, branchId: string) {
    const lots = await this.prisma.stockLot.findMany({ where: { orgId, branchId, drug: { coldChain: true }, OR: [{ qtyOnHand: { gt: 0 } }, { status: "QUARANTINE" }] }, include: { drug: { select: { brandName: true, brandNameAr: true, strength: true } }, readings: { orderBy: { recordedAt: "desc" }, take: 1 } }, orderBy: { expiryDate: "asc" } });
    const since = new Date(Date.now() - 86_400_000);
    const counts = await this.prisma.coldChainReading.groupBy({ by: ["lotId"], where: { orgId, lotId: { in: lots.map((l) => l.id) }, recordedAt: { gte: since } }, _count: true });
    const cm = new Map(counts.map((c) => [c.lotId, c._count]));
    return lots.map((l) => ({ lotId: l.id, brandName: l.drug.brandName, brandNameAr: l.drug.brandNameAr, strength: l.drug.strength, lotNumber: l.lotNumber, expiryDate: l.expiryDate, qtyOnHand: l.qtyOnHand, status: l.status, locationId: l.locationId, lastReading: l.readings[0] ? { temperatureC: l.readings[0].temperatureC.toString(), excursion: l.readings[0].excursion, recordedAt: l.readings[0].recordedAt } : null, readings24h: cm.get(l.id) ?? 0 }));
  }

  /** Stock movement journal (audit of every adjustment / write-off / return), filterable by type and reason code. */
  async movements(orgId: string, q: { branchId?: string; type?: string; reasonCode?: string; from?: Date; to?: Date; q?: string; skip: number; take: number }) {
    const where = { orgId, type: q.type ? (q.type as never) : { notIn: ["RESERVE", "RELEASE_RESERVATION"] as never[] }, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.reasonCode ? { reasonCode: q.reasonCode } : {}), ...(q.from || q.to ? { occurredAt: { ...(q.from ? { gte: q.from } : {}), ...(q.to ? { lte: q.to } : {}) } } : {}), ...(q.q ? { lot: { drug: { brandName: { contains: q.q, mode: "insensitive" as const } } } } : {}) };
    const [rows, total] = await Promise.all([this.prisma.stockMovement.findMany({ where, include: { lot: { select: { lotNumber: true, drug: { select: { brandName: true, brandNameAr: true, strength: true } } } } }, orderBy: { occurredAt: "desc" }, skip: q.skip, take: q.take }), this.prisma.stockMovement.count({ where })]);
    const staff = await this.prisma.staffUser.findMany({ where: { id: { in: [...new Set(rows.map((r) => r.performedBy))] } }, select: { id: true, displayName: true } });
    const sm = new Map(staff.map((s) => [s.id, s.displayName]));
    return { total, items: rows.map((r) => ({ id: r.id, type: r.type, qtyDelta: r.qtyDelta, reason: r.reason, reasonCode: r.reasonCode, occurredAt: r.occurredAt, branchId: r.branchId, lotId: r.lotId, lotNumber: r.lot.lotNumber, brandName: r.lot.drug.brandName, brandNameAr: r.lot.drug.brandNameAr, strength: r.lot.drug.strength, performedBy: sm.get(r.performedBy) ?? r.performedBy })) };
  }

  /** Printable lot labels (80x40 mm): drug, strength, lot, expiry, shelf location and a barcode of the lot id. */
  async lotLabelsHtml(orgId: string, lotIds: string[], lang: "ar" | "en") {
    const lots = await this.prisma.stockLot.findMany({ where: { id: { in: lotIds }, orgId }, include: { drug: true } });
    const locs = await this.prisma.shelfLocation.findMany({ where: { id: { in: lots.map((l) => l.locationId).filter((x): x is string => !!x) } } });
    const lm = new Map(locs.map((l) => [l.id, l.code]));
    const rtl = lang === "ar";
    return `<!doctype html><html lang="${lang}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${rtl ? "ملصقات التشغيلات" : "Lot labels"}</title><style>@page{margin:6mm}body{margin:0;font:11px system-ui,"Noto Sans Arabic",sans-serif}.g{display:flex;flex-wrap:wrap;gap:3mm}.l{width:80mm;height:40mm;border:1px solid #000;padding:2mm;box-sizing:border-box;break-inside:avoid}.n{font-weight:700;font-size:13px}.r{display:flex;justify-content:space-between}.b{text-align:center;margin-top:1mm}.b svg{max-width:100%;height:20mm}</style></head><body><div class="g">${lots.map((l) => `<div class="l"><div class="n">${esc(rtl && l.drug.brandNameAr ? l.drug.brandNameAr : l.drug.brandName)} <small>${esc(l.drug.strength)}</small></div><div class="r"><span>${rtl ? "تشغيلة" : "Lot"} <b>${esc(l.lotNumber)}</b></span><span>${rtl ? "انتهاء" : "Exp"} <b>${l.expiryDate.toISOString().slice(0, 10)}</b></span></div><div class="r"><span>${l.locationId ? `${rtl ? "مكان" : "Loc"} <b>${esc(lm.get(l.locationId))}</b>` : ""}</span><span>${rtl ? "الكمية" : "Qty"} ${l.qtyOnHand}</span></div><div class="b">${barcodeSvg(`LOT-${l.id.slice(-8).toUpperCase()}`, { height: 28 })}</div></div>`).join("")}</div></body></html>`;
  }
}
