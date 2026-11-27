/**
 * COM-3 settlement statement of one period, provider side (pure; the same file ships in Clinic, Pharmacy and Lab). Same figures and shape as the Kiorex statement
 * (ops route `GET /api/v1/admin/commissions/settlement-statement/{orgRef}`; this product reads the same statement from the signed partner route `GET /api/v1/partner/commissions/settlement-statement`): online collections, cash-visit commission accrued and netted (Kiorex never holds or pays cash), deductions (commission, fees, refunds, chargebacks),
 * net payable, payout bank reference and reconciliation (MATCHED / UNMATCHED / DISPUTED). Providers are paid by bank transfer only. Minor units. `normalizeStatement` is tolerant: unknown fields are dropped, a missing one reads as null / 0.
 */
export type ReconciliationStatus = "MATCHED" | "UNMATCHED" | "DISPUTED";
export type StatementReconciliation = ReconciliationStatus | "NO_PAYOUT";
export type StatementPayout = { payoutRef: string; paidAt: string | null; cashMinor: number; commissionDeductedMinor: number; bankReference: string | null; reconciliation: ReconciliationStatus };
/** LG-COM-20: the cash-type commission split into plain cash and cash transfer (bank / InstaPay transfer or card terminal at the provider). Absent (null) when an older Kiorex did not send it. */
export type TenderKindFigures = { accruedMinor: number; nettedMinor: number; openMinor: number; charges: number };
export type CashBreakdown = { cash: TenderKindFigures; cashTransfer: TenderKindFigures & { byDetail: Record<string, number>; unspecifiedDetail: number } };
export type StatementView = {
  source: "KIOREX";
  orgRef: string; period: { from: string; to: string }; currency: string; payoutMethod: "BANK_TRANSFER";
  onlineCollectionsMinor: number; cashVisitCommissionAccruedMinor: number; cashVisitCommissionNettedMinor: number; cashVisitCommissionOpenMinor: number; cashVisitCharges: number;
  /** the kind of each cash-type visit, as Kiorex finance sees it; null when Kiorex sent no split */
  cashBreakdown: CashBreakdown | null;
  /** visits whose tender was not reported: an exception, never counted as cash or online (null when not sent) */
  unknownTender: { charges: number; commissionMinor: number } | null;
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

const kindFigures = (v: unknown): TenderKindFigures => { const k = obj(v); const a = int(k.accruedMinor); const n = int(k.nettedMinor); return { accruedMinor: a, nettedMinor: n, openMinor: int(k.openMinor, Math.max(0, a - n)), charges: int(k.charges) }; };
function cashBreakdownOf(v: unknown): CashBreakdown | null {
  const b = obj(v); if (Object.keys(b).length === 0 || Object.keys(obj(b.cash)).length + Object.keys(obj(b.cashTransfer)).length === 0) return null;
  const t = obj(b.cashTransfer);
  const byDetail: Record<string, number> = {};
  for (const [k, n] of Object.entries(obj(t.byDetail))) if (/^[A-Z_]{2,32}$/.test(k)) byDetail[k] = int(n);
  return { cash: kindFigures(b.cash), cashTransfer: { ...kindFigures(t), byDetail, unspecifiedDetail: int(t.unspecifiedDetail) } };
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
    cashBreakdown: cashBreakdownOf(o.cashBreakdown),
    unknownTender: Object.keys(obj(o.unknownTender)).length ? { charges: int(obj(o.unknownTender).charges), commissionMinor: int(obj(o.unknownTender).commissionMinor) } : null,
    deductions: { commissionMinor: int(d.commissionMinor), feesMinor: intOrNull(d.feesMinor), refundsMinor: intOrNull(d.refundsMinor), chargebacksMinor: intOrNull(d.chargebacksMinor) },
    commission: { totalMinor: int(c.totalMinor), collectedMinor: int(c.collectedMinor), openMinor: int(c.openMinor), disputedOpen: int(c.disputedOpen) },
    netPayableMinor: int(o.netPayableMinor), paidByBankTransferMinor: int(o.paidByBankTransferMinor), payouts,
    reconciliation: (["MATCHED", "UNMATCHED", "DISPUTED", "NO_PAYOUT"].includes(rec) ? rec : "UNMATCHED") as StatementReconciliation,
  };
}

/** True for the 503 `STATEMENT_NOT_CONNECTED` the statement service throws when Kiorex is not connected for the organisation (mock mode, no rate link, no client). */
export function isStatementNotConnected(e: unknown): boolean {
  const res = (e as { getResponse?: () => unknown } | null)?.getResponse?.();
  return typeof res === "object" && res !== null && (res as { code?: unknown }).code === "STATEMENT_NOT_CONNECTED";
}
