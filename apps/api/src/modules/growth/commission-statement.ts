/**
 * COM-3 settlement statement of one period, provider side (pure; the same file ships in Clinic, Pharmacy and Lab). Same figures and shape as the Kiorex statement
 * (`GET /api/v1/admin/commissions/settlement-statement/{orgRef}`): online collections, cash-visit commission accrued and netted (Kiorex never holds or pays cash), deductions (commission, fees, refunds, chargebacks),
 * net payable, payout bank reference and reconciliation (MATCHED / UNMATCHED / DISPUTED). Providers are paid by bank transfer only. Minor units. `normalizeStatement` is tolerant: unknown fields are dropped, a missing one reads as null / 0.
 */
export type ReconciliationStatus = "MATCHED" | "UNMATCHED" | "DISPUTED";
export type StatementReconciliation = ReconciliationStatus | "NO_PAYOUT";
export type StatementPayout = { payoutRef: string; paidAt: string | null; cashMinor: number; commissionDeductedMinor: number; bankReference: string | null; reconciliation: ReconciliationStatus };
export type StatementView = {
  source: "KIOREX";
  orgRef: string; period: { from: string; to: string }; currency: string; payoutMethod: "BANK_TRANSFER";
  onlineCollectionsMinor: number; cashVisitCommissionAccruedMinor: number; cashVisitCommissionNettedMinor: number; cashVisitCommissionOpenMinor: number; cashVisitCharges: number;
  deductions: { commissionMinor: number; feesMinor: number | null; refundsMinor: number | null; chargebacksMinor: number | null };
  commission: { totalMinor: number; collectedMinor: number; openMinor: number; disputedOpen: number };
  netPayableMinor: number; paidByBankTransferMinor: number;
  payouts: StatementPayout[]; reconciliation: StatementReconciliation;
};
const RECON: readonly string[] = ["MATCHED", "UNMATCHED", "DISPUTED"];
const int = (v: unknown, fallback = 0): number => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : fallback);
const intOrNull = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : null);
const str = (v: unknown, max = 120): string | null => (typeof v === "string" && v.length > 0 ? v.slice(0, max) : null);
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const isoOrNull = (v: unknown): string | null => (typeof v === "string" && !Number.isNaN(Date.parse(v)) ? new Date(v).toISOString() : null);

/** `YYYY-MM` -> [from, to) in UTC (the platform default is the calendar month, UTC). null for anything else. */
export function periodRange(period: string | undefined, now = new Date()): { from: Date; to: Date; key: string } | null {
  if (!period) { const f = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)); return { from: f, to: new Date(Date.UTC(f.getUTCFullYear(), f.getUTCMonth() + 1, 1)), key: f.toISOString().slice(0, 7) }; }
  const m = /^(\d{4})-(\d{2})$/.exec(period);
  if (!m || Number(m[2]) < 1 || Number(m[2]) > 12) return null;
  return { from: new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, 1)), to: new Date(Date.UTC(Number(m[1]), Number(m[2]), 1)), key: period };
}

export function normalizeStatement(raw: unknown, fallback: { orgRef: string; from: Date; to: Date }): StatementView | null {
  const o = obj(raw);
  if (Object.keys(o).length === 0) return null;
  const d = obj(o.deductions); const c = obj(o.commission); const p = obj(o.period);
  const payouts = (Array.isArray(o.payouts) ? o.payouts : []).map((x) => {
    const r = obj(x);
    return { payoutRef: str(r.payoutRef, 80) ?? "", paidAt: isoOrNull(r.paidAt), cashMinor: int(r.cashMinor), commissionDeductedMinor: int(r.commissionDeductedMinor), bankReference: str(r.bankReference, 80), reconciliation: (RECON.includes(String(r.reconciliation)) ? r.reconciliation : "UNMATCHED") as ReconciliationStatus };
  }).filter((x) => x.payoutRef);
  const rec = String(o.reconciliation);
  return {
    source: "KIOREX", orgRef: str(o.orgRef, 64) ?? fallback.orgRef, period: { from: isoOrNull(p.from) ?? fallback.from.toISOString(), to: isoOrNull(p.to) ?? fallback.to.toISOString() }, currency: (str(o.currency, 3) ?? "EGP").toUpperCase(), payoutMethod: "BANK_TRANSFER",
    onlineCollectionsMinor: int(o.onlineCollectionsMinor), cashVisitCommissionAccruedMinor: int(o.cashVisitCommissionAccruedMinor), cashVisitCommissionNettedMinor: int(o.cashVisitCommissionNettedMinor),
    cashVisitCommissionOpenMinor: int(o.cashVisitCommissionOpenMinor, Math.max(0, int(o.cashVisitCommissionAccruedMinor) - int(o.cashVisitCommissionNettedMinor))), cashVisitCharges: int(o.cashVisitCharges),
    deductions: { commissionMinor: int(d.commissionMinor), feesMinor: intOrNull(d.feesMinor), refundsMinor: intOrNull(d.refundsMinor), chargebacksMinor: intOrNull(d.chargebacksMinor) },
    commission: { totalMinor: int(c.totalMinor), collectedMinor: int(c.collectedMinor), openMinor: int(c.openMinor), disputedOpen: int(c.disputedOpen) },
    netPayableMinor: int(o.netPayableMinor), paidByBankTransferMinor: int(o.paidByBankTransferMinor), payouts,
    reconciliation: (["MATCHED", "UNMATCHED", "DISPUTED", "NO_PAYOUT"].includes(rec) ? rec : "UNMATCHED") as StatementReconciliation,
  };
}
