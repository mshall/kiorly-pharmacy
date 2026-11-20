import { marketToday } from "../../common/dates";
import { Inject, Injectable } from "@nestjs/common";
import { Prisma, type ControlledSchedule } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { groupKey } from "./normalize";
import { PriceService } from "./price.service";

export interface DrugInput {
  /** Stable dataset key => idempotent re-import (KPCAT01). */
  sourceKey?: string;
  brandName: string;
  brandNameAr?: string | null;
  activeIngredient: string;
  strength: string;
  dosageForm: string;
  packSize: string;
  gtin?: string | null;
  manufacturer?: string | null;
  price?: string | null;
  rxOnly?: boolean;
  controlledSchedule?: ControlledSchedule;
  coldChain?: boolean;
  otc?: boolean;
  marketCodes?: Record<string, unknown> | null;
  vatRate?: string | null;
  category?: string | null;
  baseUnit?: string | null;
}

export interface DrugSearch { category?: string; q?: string; rxOnly?: boolean; controlled?: boolean; coldChain?: boolean; otc?: boolean; skip: number; take: number }

@Injectable()
export class CatalogueService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(PriceService) private readonly prices: PriceService) {}

  private async ensureGroup(tx: Prisma.TransactionClient, d: Pick<DrugInput, "activeIngredient" | "strength" | "dosageForm">) {
    const k = groupKey(d);
    const g = await tx.substitutionGroup.upsert({ where: { activeIngredient_strength_dosageForm: k }, create: k, update: {} });
    return g.id;
  }

  /**
   * KPCAT01 idempotent import. Upserts by sourceKey (global seed: orgId=null; tenant: orgId). Re-import after a source update
   * updates rows in place — never duplicates. Regulatory consistency (KPCAT02): controlled => rxOnly, never otc.
   */
  async importDrugs(orgId: string | null, records: DrugInput[], actorId?: string): Promise<{ created: number; updated: number }> {
    let created = 0, updated = 0;
    await this.prisma.$transaction(async (tx) => {
      for (const r of records) {
        const controlled = r.controlledSchedule ?? "NONE";
        const rxOnly = r.rxOnly ?? controlled !== "NONE";
        const otc = controlled !== "NONE" || rxOnly ? false : r.otc ?? true;
        const substitutionGroupId = await this.ensureGroup(tx, r);
        const data = {
          brandName: r.brandName, brandNameAr: r.brandNameAr ?? null, activeIngredient: r.activeIngredient.trim(), strength: r.strength.trim(), dosageForm: r.dosageForm.trim(),
          packSize: r.packSize, gtin: r.gtin ?? null, manufacturer: r.manufacturer ?? null, rxOnly: rxOnly || controlled !== "NONE", controlledSchedule: controlled,
          coldChain: r.coldChain ?? false, otc, marketCodes: (r.marketCodes ?? undefined) as Prisma.InputJsonValue | undefined, vatRate: r.vatRate ?? null, substitutionGroupId,
          ...(r.category !== undefined ? { category: r.category } : {}), ...(r.baseUnit ? { baseUnit: r.baseUnit } : {}),
        };
        // tenant imports are namespaced by org so two pharmacies can import the same dataset ids; the global seed uses the raw dataset key
        const key = r.sourceKey ? (orgId ? `${orgId}:${r.sourceKey}` : r.sourceKey) : r.gtin ? `${orgId ?? "global"}:gtin:${r.gtin}` : undefined;
        let drugId: string;
        const existing = key ? await tx.drug.findUnique({ where: { sourceKey: key } }) : null;
        if (existing) {
          if (existing.orgId !== orgId) throw new DomainError("SOURCE_KEY_CONFLICT", `sourceKey ${key} belongs to another scope`, 409);
          await tx.drug.update({ where: { id: existing.id }, data });
          drugId = existing.id; updated++;
        } else {
          drugId = (await tx.drug.create({ data: { ...data, orgId, sourceKey: key } })).id; created++;
        }
        if (r.price != null && orgId) {
          const open = await tx.priceBookEntry.findFirst({ where: { orgId, drugId, branchId: null, effectiveTo: null } });
          if (!open) await tx.priceBookEntry.create({ data: { orgId, drugId, price: r.price, effectiveFrom: new Date("2000-01-01T00:00:00.000Z"), createdBy: actorId } });
        }
      }
      if (orgId) await tx.auditLog.create({ data: { orgId, actorId, action: "catalogue.import", entityType: "Drug", entityId: "bulk", meta: { created, updated } } });
    }, { timeout: 120_000, maxWait: 20_000 });
    return { created, updated };
  }

  /** Search by brand, ingredient or barcode. Uses the pg_trgm GIN indexes on lower(...) (migration 0002). Tenant sees global + own rows. */
  async search(orgId: string, s: DrugSearch): Promise<{ items: Array<Record<string, unknown>>; total: number }> {
    const q = s.q?.trim().toLowerCase();
    const filters: Prisma.Sql[] = [Prisma.sql`d.active = true`, Prisma.sql`(d."orgId" IS NULL OR d."orgId" = ${orgId})`];
    if (s.rxOnly != null) filters.push(Prisma.sql`d."rxOnly" = ${s.rxOnly}`);
    if (s.controlled != null) filters.push(s.controlled ? Prisma.sql`d."controlledSchedule" <> 'NONE'` : Prisma.sql`d."controlledSchedule" = 'NONE'`);
    if (s.coldChain != null) filters.push(Prisma.sql`d."coldChain" = ${s.coldChain}`);
    if (s.otc != null) filters.push(Prisma.sql`d.otc = ${s.otc}`);
    if (s.category) filters.push(Prisma.sql`d.category = ${s.category}`);
    let rank = Prisma.sql`d."brandName"`;
    if (q) {
      const like = `%${q.replace(/[%_\\]/g, (c) => `\\${c}`)}%`;
      const prefix = `${q.replace(/[%_\\]/g, (c) => `\\${c}`)}%`;
      filters.push(Prisma.sql`(d.gtin = ${q} OR lower(d."brandName") LIKE ${like} OR lower(d."activeIngredient") LIKE ${like} OR lower(coalesce(d."brandNameAr", '')) LIKE ${like})`);
      rank = Prisma.sql`(CASE WHEN d.gtin = ${q} THEN 0 WHEN lower(d."brandName") LIKE ${prefix} THEN 1 WHEN lower(d."activeIngredient") LIKE ${prefix} THEN 2 ELSE 3 END), d."brandName"`;
    }
    const where = Prisma.join(filters, " AND ");
    const rows = await this.prisma.$queryRaw<Array<{ id: string }>>`SELECT d.id FROM "Drug" d WHERE ${where} ORDER BY ${rank} LIMIT ${s.take} OFFSET ${s.skip}`;
    const [{ n }] = await this.prisma.$queryRaw<Array<{ n: bigint }>>`SELECT count(*) AS n FROM "Drug" d WHERE ${where}`;
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: rows.map((r) => r.id) } } });
    const order = new Map(rows.map((r, i) => [r.id, i]));
    drugs.sort((a, b) => order.get(a.id)! - order.get(b.id)!);
    return { items: drugs.map((d) => ({ ...d, vatRate: d.vatRate?.toString() ?? null })), total: Number(n) };
  }

  /** Price book overview: current price, latest unit cost and margin per drug (tenant-priced drugs only), searchable and paged. */
  async priceBook(orgId: string, branchId: string, q: { q?: string; category?: string; lowMargin?: boolean; skip: number; take: number }) {
    const like = q.q ? `%${q.q.toLowerCase().replace(/[%_\\]/g, (m) => `\\${m}`)}%` : null;
    const rows = await this.prisma.$queryRaw<Array<{ id: string; brandName: string; brandNameAr: string | null; strength: string; dosageForm: string; category: string | null; price: string; since: Date; cost: string | null; onHand: bigint }>>`
      SELECT d.id, d."brandName", d."brandNameAr", d.strength, d."dosageForm", d.category,
        pb.price, pb."effectiveFrom" AS since,
        (SELECT l."unitCost" FROM "StockLot" l WHERE l."orgId" = ${orgId} AND l."drugId" = d.id ORDER BY l."receivedAt" DESC LIMIT 1) AS cost,
        COALESCE((SELECT SUM(l."qtyOnHand") FROM "StockLot" l WHERE l."orgId" = ${orgId} AND l."branchId" = ${branchId} AND l."drugId" = d.id), 0) AS "onHand"
      FROM "Drug" d
      JOIN LATERAL (SELECT p.price, p."effectiveFrom" FROM "PriceBookEntry" p WHERE p."orgId" = ${orgId} AND p."drugId" = d.id AND (p."branchId" IS NULL OR p."branchId" = ${branchId}) AND p."effectiveFrom" <= now() AND (p."effectiveTo" IS NULL OR p."effectiveTo" > now()) ORDER BY p."branchId" NULLS LAST, p."effectiveFrom" DESC LIMIT 1) pb ON true
      WHERE d.active = true AND (d."orgId" IS NULL OR d."orgId" = ${orgId}) AND (${like}::text IS NULL OR lower(d."brandName") LIKE ${like} OR lower(d."activeIngredient") LIKE ${like} OR d.gtin = ${q.q ?? ""}) AND (${q.category ?? null}::text IS NULL OR d.category = ${q.category ?? null})
      ORDER BY d."brandName" LIMIT 2000`;
    let items = rows.map((r) => { const price = Number(r.price), cost = r.cost == null ? null : Number(r.cost); return { id: r.id, brandName: r.brandName, brandNameAr: r.brandNameAr, strength: r.strength, dosageForm: r.dosageForm, category: r.category, price: r.price, since: r.since, cost: r.cost, marginPct: cost != null && price > 0 ? Math.round(((price - cost) / price) * 1000) / 10 : null, onHand: Number(r.onHand) }; });
    if (q.lowMargin) items = items.filter((i) => i.marginPct != null && i.marginPct < 10);
    return { total: items.length, items: items.slice(q.skip, q.skip + q.take) };
  }

  async get(orgId: string, id: string) {
    const d = await this.prisma.drug.findFirst({ where: { id, OR: [{ orgId: null }, { orgId }] }, include: { substitutionGroup: true } });
    if (!d) throw notFound("Drug", id);
    return d;
  }

  async create(orgId: string, actorId: string, r: DrugInput) {
    const sourceKey = r.sourceKey ?? `local:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
    await this.importDrugs(orgId, [{ ...r, sourceKey }], actorId);
    return this.prisma.drug.findUniqueOrThrow({ where: { sourceKey: `${orgId}:${sourceKey}` } });
  }

  async update(orgId: string, actorId: string, id: string, patch: Partial<DrugInput>) {
    const d = await this.prisma.drug.findFirst({ where: { id, orgId } });
    if (!d) throw new DomainError("DRUG_READONLY", "Only tenant-local drugs can be edited; global seed rows are read-only", 403);
    const merged = { activeIngredient: patch.activeIngredient ?? d.activeIngredient, strength: patch.strength ?? d.strength, dosageForm: patch.dosageForm ?? d.dosageForm };
    const controlled = patch.controlledSchedule ?? d.controlledSchedule;
    const rxOnly = (patch.rxOnly ?? d.rxOnly) || controlled !== "NONE";
    const res = await this.prisma.$transaction(async (tx) => {
      const substitutionGroupId = await this.ensureGroup(tx, merged);
      const { price: _price, sourceKey: _sk, marketCodes, baseUnit, ...rest } = patch;
      const out = await tx.drug.update({ where: { id }, data: { ...rest, ...(baseUnit ? { baseUnit } : {}), ...merged, rxOnly, controlledSchedule: controlled, otc: controlled !== "NONE" || rxOnly ? false : patch.otc ?? d.otc, substitutionGroupId, ...(marketCodes ? { marketCodes: marketCodes as Prisma.InputJsonValue } : {}) } });
      await tx.auditLog.create({ data: { orgId, actorId, action: "catalogue.update", entityType: "Drug", entityId: id, meta: { fields: Object.keys(patch) } } });
      return out;
    });
    return res;
  }

  /** KPCAT04 + POS: same-group, in-stock, non-blocked, in-date alternatives for a drug at a branch (FEFO within each). */
  async substitutes(orgId: string, branchId: string, drugId: string) {
    const d = await this.get(orgId, drugId);
    if (!d.substitutionGroupId) return [];
    const lots = await this.prisma.stockLot.findMany({
      where: {
        orgId, branchId, status: { in: ["AVAILABLE", "RESERVED"] }, expiryDate: { gte: startOfToday() }, qtyOnHand: { gt: 0 },
        drug: { substitutionGroupId: d.substitutionGroupId, id: { not: drugId }, controlledSchedule: d.controlledSchedule, active: true },
      },
      orderBy: [{ expiryDate: "asc" }, { receivedAt: "asc" }], include: { drug: true },
    });
    const byDrug = new Map<string, { drug: typeof d; available: number; nextExpiry: Date }>();
    for (const l of lots) {
      const free = l.qtyOnHand - l.qtyReserved;
      if (free <= 0) continue;
      const cur = byDrug.get(l.drugId);
      if (cur) cur.available += free; else byDrug.set(l.drugId, { drug: l.drug as never, available: free, nextExpiry: l.expiryDate });
    }
    const prices = await this.prices.pricesAt(orgId, branchId, [...byDrug.keys()]);
    return [...byDrug.values()].map((v) => ({ drugId: v.drug.id, brandName: v.drug.brandName, brandNameAr: v.drug.brandNameAr, strength: v.drug.strength, dosageForm: v.drug.dosageForm, available: v.available, nextExpiry: v.nextExpiry, price: prices.get(v.drug.id)?.toFixed(2) ?? null }));
  }

  async labels(orgId: string, branchId: string | null, ids: string[]) {
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: ids }, OR: [{ orgId: null }, { orgId }] } });
    const prices = await this.prices.pricesAt(orgId, branchId ?? "", drugs.map((d) => d.id));
    return drugs.map((d) => ({ drugId: d.id, brandName: d.brandName, brandNameAr: d.brandNameAr, activeIngredient: d.activeIngredient, strength: d.strength, dosageForm: d.dosageForm, packSize: d.packSize, barcode: d.gtin, price: prices.get(d.id)?.toFixed(2) ?? null }));
  }
}

export const startOfToday = () => marketToday();
