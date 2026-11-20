import type { Prisma } from "../generated/prisma/client";
import { D, type DecimalValue } from "./money";
import type { TenantSettings } from "../tenancy/tenant-mode.service";

type Tx = Prisma.TransactionClient;

export const DEFAULT_TIERS = [
  { name: "BRONZE", minSpend: "0" }, { name: "SILVER", minSpend: "5000" }, { name: "GOLD", minSpend: "20000" }, { name: "PLATINUM", minSpend: "50000" },
];
export const TIER_MULTIPLIER: Record<string, number> = { BRONZE: 1, SILVER: 1.25, GOLD: 1.5, PLATINUM: 2 };

export interface LoyaltyConfig { enabled: boolean; earnPer: Prisma.Decimal; pointsPerEarn: number; redeemValue: Prisma.Decimal; tiers: Array<{ name: string; minSpend: Prisma.Decimal }> }

export function loyaltyConfig(s: TenantSettings | null | undefined): LoyaltyConfig {
  const l = s?.loyalty ?? {};
  const tiers = (l.tiers?.length ? l.tiers : DEFAULT_TIERS).map((t) => ({ name: t.name, minSpend: D(t.minSpend) })).sort((a, b) => a.minSpend.comparedTo(b.minSpend));
  return { enabled: l.enabled !== false, earnPer: D(l.earnPer ?? 10), pointsPerEarn: l.pointsPerEarn ?? 1, redeemValue: D(l.redeemValue ?? "0.50"), tiers };
}

export function tierFor(lifetimeSpend: DecimalValue, cfg: LoyaltyConfig): string {
  let name = cfg.tiers[0]?.name ?? "BRONZE";
  for (const t of cfg.tiers) if (D(lifetimeSpend).gte(t.minSpend)) name = t.name;
  return name;
}

/** Points earned for a spend (floor): spend / earnPer * pointsPerEarn * tier multiplier. Pure. */
export function pointsFor(total: DecimalValue, tier: string, cfg: LoyaltyConfig): number {
  if (!cfg.enabled || cfg.earnPer.lte(0)) return 0;
  return Math.floor(D(total).div(cfg.earnPer).floor().mul(cfg.pointsPerEarn).toNumber() * (TIER_MULTIPLIER[tier] ?? 1));
}

/** Value (money) of a number of points. Pure. */
export const pointsValue = (points: number, cfg: LoyaltyConfig) => cfg.redeemValue.mul(points);

async function post(tx: Tx, p: { orgId: string; patientId: string; kind: string; points: number; saleId?: string; note?: string; by?: string; spend?: DecimalValue }, cfg: LoyaltyConfig) {
  const cur = await tx.patientRef.findUniqueOrThrow({ where: { id: p.patientId }, select: { loyaltyPoints: true, lifetimeSpend: true } });
  const balance = cur.loyaltyPoints + p.points;
  const spend = D(cur.lifetimeSpend).plus(p.spend ?? 0);
  await tx.patientRef.update({ where: { id: p.patientId }, data: { loyaltyPoints: balance, lifetimeSpend: spend, loyaltyTier: tierFor(spend, cfg) } });
  await tx.loyaltyEntry.create({ data: { orgId: p.orgId, patientId: p.patientId, kind: p.kind, points: p.points, balanceAfter: balance, saleId: p.saleId, note: p.note, createdBy: p.by } });
  return balance;
}

/** Accrue points (and lifetime spend / tier) for a completed sale. No-op when loyalty is off or the customer is unknown. */
export async function earnForSale(tx: Tx, p: { orgId: string; patientId: string; saleId: string; total: DecimalValue; by?: string }, cfg: LoyaltyConfig) {
  if (!cfg.enabled) return 0;
  const cur = await tx.patientRef.findFirst({ where: { id: p.patientId, orgId: p.orgId }, select: { loyaltyTier: true } });
  if (!cur) return 0;
  const pts = pointsFor(p.total, cur.loyaltyTier, cfg);
  await post(tx, { orgId: p.orgId, patientId: p.patientId, kind: "EARN", points: pts, saleId: p.saleId, by: p.by, spend: p.total }, cfg);
  return pts;
}

export async function redeemPoints(tx: Tx, p: { orgId: string; patientId: string; points: number; saleId?: string; by?: string }, cfg: LoyaltyConfig) {
  const cur = await tx.patientRef.findFirst({ where: { id: p.patientId, orgId: p.orgId }, select: { loyaltyPoints: true } });
  if (!cur || cur.loyaltyPoints < p.points) return false;
  await post(tx, { orgId: p.orgId, patientId: p.patientId, kind: "REDEEM", points: -p.points, saleId: p.saleId, by: p.by }, cfg);
  return true;
}

export const adjustPoints = (tx: Tx, p: { orgId: string; patientId: string; points: number; note: string; by: string; kind?: string }, cfg: LoyaltyConfig) =>
  post(tx, { orgId: p.orgId, patientId: p.patientId, kind: p.kind ?? "ADJUST", points: p.points, note: p.note, by: p.by }, cfg);
