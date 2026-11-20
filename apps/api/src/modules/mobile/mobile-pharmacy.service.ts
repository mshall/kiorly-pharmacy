import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../audit/audit.service";
import { PriceService } from "../catalogue/price.service";
import { ReceivingService } from "../inventory/receiving.service";
import { ShiftsService } from "../pos/shifts.service";
import { marketToday } from "../../common/dates";
import { resolveBranchId } from "../../common/branch-scope";
import { DomainError, notFound } from "../../common/errors";
import { money } from "../../common/money";
import type { AuthUser } from "../../auth/auth-user";

const DAY = 86_400_000;
const drugView = (d: { id: string; brandName: string; brandNameAr: string | null; strength: string; dosageForm: string; rxOnly: boolean; controlledSchedule: string; gtin: string | null; coldChain: boolean }) =>
  ({ id: d.id, brandName: d.brandName, brandNameAr: d.brandNameAr, strength: d.strength, dosageForm: d.dosageForm, gtin: d.gtin, rxOnly: d.rxOnly, controlled: d.controlledSchedule !== "NONE", controlledSchedule: d.controlledSchedule, coldChain: d.coldChain });

/** Mobile-shaped read models the existing REST API does not offer in one call. All reads are tenant- and branch-scoped. */
@Injectable()
export class MobilePharmacyService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService, @Inject(AuditService) private readonly audit: AuditService,
    @Inject(PriceService) private readonly prices: PriceService, @Inject(ReceivingService) private readonly receiving: ReceivingService,
    @Inject(ShiftsService) private readonly shifts: ShiftsService,
  ) {}

  /** Barcode (GS1 or plain GTIN) or free text -> drug + price + stock + every lot with expiry. */
  async barcode(u: AuthUser, code: string, requestedBranch?: string) {
    const branchId = await resolveBranchId(this.prisma, u, requestedBranch);
    const scan = await this.receiving.resolveScan(u.orgId, code);
    let drug = scan.drug;
    if (!drug) drug = await this.prisma.drug.findFirst({ where: { active: true, OR: [{ orgId: null }, { orgId: u.orgId }], brandName: { contains: code.trim(), mode: "insensitive" } } });
    if (!drug) return { found: false as const, code, scan: { gtin: scan.gtin, lotNumber: scan.lotNumber, expiryDate: scan.expiryDate } };
    const [price, lots] = await Promise.all([
      this.prices.priceAt(u.orgId, branchId, drug.id),
      this.prisma.stockLot.findMany({ where: { orgId: u.orgId, branchId, drugId: drug.id, qtyOnHand: { gt: 0 } }, orderBy: { expiryDate: "asc" }, take: 50 }),
    ]);
    const today = marketToday();
    const sellable = lots.filter((l) => ["AVAILABLE", "RESERVED"].includes(l.status) && l.expiryDate >= today);
    return {
      found: true as const, code, branchId, scan: { gtin: scan.gtin, lotNumber: scan.lotNumber, expiryDate: scan.expiryDate }, drug: drugView(drug),
      price: price?.toFixed(2) ?? null, requiresPrescription: drug.rxOnly || drug.controlledSchedule !== "NONE",
      stock: { onHand: lots.reduce((a, l) => a + l.qtyOnHand, 0), available: sellable.reduce((a, l) => a + l.qtyOnHand - l.qtyReserved, 0), nearestExpiry: sellable[0]?.expiryDate ?? null },
      lots: lots.map((l) => ({ id: l.id, lotNumber: l.lotNumber, expiryDate: l.expiryDate, status: l.status, qtyOnHand: l.qtyOnHand, qtyReserved: l.qtyReserved, expired: l.expiryDate < today, daysToExpiry: Math.floor((l.expiryDate.getTime() - today.getTime()) / DAY), scannedLotMatch: scan.lotNumber ? l.lotNumber === scan.lotNumber : null })),
    };
  }

  /** Expiry buckets (expired / 30 / 60 / 90 days) and low stock (on-hand at or below the reorder minimum). */
  async expiryLowStock(u: AuthUser, requestedBranch?: string) {
    const branchId = u.branchId ?? requestedBranch ?? null;
    if (branchId) await resolveBranchId(this.prisma, u, branchId);
    const today = marketToday();
    const base = { orgId: u.orgId, qtyOnHand: { gt: 0 }, ...(branchId ? { branchId } : {}) };
    const lots = await this.prisma.stockLot.findMany({ where: { ...base, status: { notIn: ["RECALLED"] }, expiryDate: { lte: new Date(today.getTime() + 90 * DAY) } }, include: { drug: { select: { brandName: true, brandNameAr: true } } }, orderBy: { expiryDate: "asc" }, take: 300 });
    const days = (l: { expiryDate: Date }) => Math.floor((l.expiryDate.getTime() - today.getTime()) / DAY);
    const bucket = (lo: number, hi: number) => lots.filter((l) => days(l) >= lo && days(l) <= hi);
    const expired = lots.filter((l) => days(l) < 0), b30 = bucket(0, 30), b60 = bucket(31, 60), b90 = bucket(61, 90);
    const sumQty = (ls: typeof lots) => ls.reduce((a, l) => a + l.qtyOnHand, 0);
    const low = await this.prisma.$queryRaw<Array<{ drugId: string; branchId: string; brandName: string; brandNameAr: string | null; minQty: number; maxQty: number; onHand: bigint }>>`
      SELECT p."drugId", p."branchId", d."brandName", d."brandNameAr", p."minQty", p."maxQty",
        COALESCE((SELECT SUM(l."qtyOnHand" - l."qtyReserved") FROM "StockLot" l WHERE l."branchId" = p."branchId" AND l."drugId" = p."drugId" AND l.status IN ('AVAILABLE','RESERVED') AND l."expiryDate" >= kx_today()), 0) AS "onHand"
      FROM "ReorderPolicy" p JOIN "Drug" d ON d.id = p."drugId"
      WHERE p."orgId" = ${u.orgId} AND (${branchId}::text IS NULL OR p."branchId" = ${branchId})`;
    const lowItems = low.map((r) => ({ drugId: r.drugId, branchId: r.branchId, brandName: r.brandName, brandNameAr: r.brandNameAr, minQty: r.minQty, maxQty: r.maxQty, onHand: Number(r.onHand), suggestedOrder: Math.max(r.maxQty - Number(r.onHand), 0) })).filter((r) => r.onHand <= r.minQty).sort((a, b) => a.onHand - b.onHand);
    const row = (l: (typeof lots)[number]) => ({ lotId: l.id, drugId: l.drugId, brandName: l.drug.brandName, brandNameAr: l.drug.brandNameAr, lotNumber: l.lotNumber, expiryDate: l.expiryDate, daysToExpiry: days(l), qtyOnHand: l.qtyOnHand, status: l.status, branchId: l.branchId });
    return {
      asOf: today, expiry: { expired: { lots: expired.length, units: sumQty(expired) }, within30: { lots: b30.length, units: sumQty(b30) }, within60: { lots: b60.length, units: sumQty(b60) }, within90: { lots: b90.length, units: sumQty(b90) }, items: lots.slice(0, 40).map(row) },
      lowStock: { count: lowItems.length, items: lowItems.slice(0, 40) },
    };
  }

  /** Open shift of the caller (or the branch) with the live X-report numbers; null when no shift is open. */
  async shiftSummary(u: AuthUser, requestedBranch?: string) {
    const branchId = await resolveBranchId(this.prisma, u, requestedBranch);
    const shift = (await this.prisma.shift.findFirst({ where: { orgId: u.orgId, branchId, status: "OPEN", openedBy: u.userId }, orderBy: { openedAt: "desc" } }))
      ?? (await this.prisma.shift.findFirst({ where: { orgId: u.orgId, branchId, status: "OPEN" }, orderBy: { openedAt: "desc" } }));
    if (!shift) return { open: false as const, branchId, shift: null, report: null, lastClosed: await this.lastClosed(u.orgId, branchId) };
    const report = await this.shifts.zReport(u.orgId, shift.id);
    const opener = await this.prisma.staffUser.findUnique({ where: { id: shift.openedBy }, select: { displayName: true } });
    return { open: true as const, branchId, shift: { id: shift.id, openedAt: shift.openedAt, openedBy: shift.openedBy, openedByName: opener?.displayName ?? null, openingFloat: money(shift.openingFloat), mine: shift.openedBy === u.userId }, report, lastClosed: await this.lastClosed(u.orgId, branchId) };
  }
  private async lastClosed(orgId: string, branchId: string) {
    const s = await this.prisma.shift.findFirst({ where: { orgId, branchId, status: "CLOSED" }, orderBy: { closedAt: "desc" } });
    return s ? { id: s.id, closedAt: s.closedAt, variance: s.variance ? money(s.variance) : null, expectedCash: s.expectedCash ? money(s.expectedCash) : null, countedCash: s.countedCash ? money(s.countedCash) : null } : null;
  }

  /** Open controlled-drug discrepancies with their countersign state. */
  async pendingWitness(u: AuthUser) {
    const discs = await this.prisma.controlledDiscrepancy.findMany({ where: { orgId: u.orgId, status: "OPEN", ...(u.branchId ? { branchId: u.branchId } : {}) }, orderBy: { createdAt: "desc" }, take: 100 });
    const [signs, drugs, staff] = await Promise.all([
      this.prisma.controlledCountersign.findMany({ where: { orgId: u.orgId, discrepancyId: { in: discs.map((d) => d.id) } } }),
      this.prisma.drug.findMany({ where: { id: { in: discs.map((d) => d.drugId) } }, select: { id: true, brandName: true, brandNameAr: true, strength: true, controlledSchedule: true } }),
      this.prisma.staffUser.findMany({ where: { orgId: u.orgId }, select: { id: true, displayName: true } }),
    ]);
    const dm = new Map(drugs.map((d) => [d.id, d])), sm = new Map(staff.map((s) => [s.id, s.displayName]));
    return { items: discs.map((d) => {
      const ss = signs.filter((s) => s.discrepancyId === d.id);
      return { id: d.id, branchId: d.branchId, drug: dm.get(d.drugId) ?? null, expectedQty: d.expectedQty, countedQty: d.countedQty, difference: d.difference, notes: d.notes, reportedBy: d.reportedBy, reportedByName: sm.get(d.reportedBy) ?? null, createdAt: d.createdAt,
        countersigns: ss.map((s) => ({ witnessId: s.witnessId, witnessName: sm.get(s.witnessId) ?? null, signedAt: s.signedAt, note: s.note })), witnessPending: !ss.some((s) => s.witnessId !== d.reportedBy), canCountersign: d.reportedBy !== u.userId && !ss.some((s) => s.witnessId === u.userId) };
    }) };
  }

  /** Witness countersign: a second staff member (not the reporter) confirms the physical count. Idempotent per witness; audited; the register itself is untouched. */
  async countersign(u: AuthUser, discrepancyId: string, note?: string) {
    const d = await this.prisma.controlledDiscrepancy.findFirst({ where: { id: discrepancyId, orgId: u.orgId } });
    if (!d) throw notFound("Discrepancy", discrepancyId);
    if (u.branchId && d.branchId !== u.branchId) throw new DomainError("BRANCH_FORBIDDEN", "You can only countersign your own branch", 403);
    if (d.status !== "OPEN") throw new DomainError("ALREADY_RESOLVED", "This discrepancy is already resolved", 409);
    if (d.reportedBy === u.userId) throw new DomainError("WITNESS_MUST_DIFFER", "The witness must be a different staff member from the reporter", 409);
    const row = await this.prisma.controlledCountersign.upsert({ where: { orgId_discrepancyId_witnessId: { orgId: u.orgId, discrepancyId, witnessId: u.userId } }, create: { orgId: u.orgId, discrepancyId, witnessId: u.userId, note }, update: {} });
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "controlled.countersign", entityType: "ControlledDiscrepancy", entityId: discrepancyId, meta: { witnessId: u.userId } });
    return { id: row.id, discrepancyId, witnessId: u.userId, signedAt: row.signedAt, note: row.note };
  }

  /** Global search over drugs, customers and prescriptions (each group only when the caller holds the read permission). */
  async search(u: AuthUser, q: string, can: { catalogue: boolean; customers: boolean; rx: boolean }) {
    const s = q.trim();
    const [drugs, customers, rxs] = await Promise.all([
      can.catalogue ? this.prisma.drug.findMany({ where: { active: true, OR: [{ orgId: null }, { orgId: u.orgId }], AND: [{ OR: [{ brandName: { contains: s, mode: "insensitive" } }, { brandNameAr: { contains: s, mode: "insensitive" } }, { activeIngredient: { contains: s, mode: "insensitive" } }, { gtin: s }] }] }, orderBy: { brandName: "asc" }, take: 8 }) : [],
      can.customers ? this.prisma.patientRef.findMany({ where: { orgId: u.orgId, OR: [{ displayName: { contains: s, mode: "insensitive" } }, { phone: { contains: s } }, { customerNo: { contains: s, mode: "insensitive" } }] }, select: { id: true, displayName: true, phone: true, customerNo: true }, take: 8 }) : [],
      can.rx ? this.prisma.prescription.findMany({ where: { orgId: u.orgId, ...(u.branchId ? { branchId: u.branchId } : {}), OR: [{ id: { startsWith: s } }, { patient: { displayName: { contains: s, mode: "insensitive" } } }, { prescriberName: { contains: s, mode: "insensitive" } }] }, select: { id: true, status: true, prescriberName: true, receivedAt: true, patient: { select: { displayName: true } } }, orderBy: { receivedAt: "desc" }, take: 8 }) : [],
    ]);
    return { q: s, drugs: drugs.map(drugView), customers, prescriptions: rxs.map((r) => ({ id: r.id, status: r.status, prescriberName: r.prescriberName, receivedAt: r.receivedAt, patientName: r.patient?.displayName ?? null })) };
  }
}
