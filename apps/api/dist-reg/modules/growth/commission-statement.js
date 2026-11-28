"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.periodRange = periodRange;
exports.normalizeStatement = normalizeStatement;
exports.isStatementNotConnected = isStatementNotConnected;
const RECON = ["MATCHED", "UNMATCHED", "DISPUTED"];
const int = (v, fallback = 0) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : fallback);
const intOrNull = (v) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : null);
const str = (v, max = 120) => (typeof v === "string" && v.length > 0 ? v.slice(0, max) : null);
const obj = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : {});
const isoOrNull = (v) => (typeof v === "string" && !Number.isNaN(Date.parse(v)) ? new Date(v).toISOString() : null);
function periodRange(period, now = new Date()) {
    if (!period) {
        const f = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        return { from: f, to: new Date(Date.UTC(f.getUTCFullYear(), f.getUTCMonth() + 1, 1)), key: f.toISOString().slice(0, 7) };
    }
    const m = /^(\d{4})-(\d{2})$/.exec(period);
    if (!m || Number(m[2]) < 1 || Number(m[2]) > 12)
        return null;
    return { from: new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, 1)), to: new Date(Date.UTC(Number(m[1]), Number(m[2]), 1)), key: period };
}
const kindFigures = (v) => { const k = obj(v); const a = int(k.accruedMinor); const n = int(k.nettedMinor); return { accruedMinor: a, nettedMinor: n, openMinor: int(k.openMinor, Math.max(0, a - n)), charges: int(k.charges) }; };
function cashBreakdownOf(v) {
    const b = obj(v);
    if (Object.keys(b).length === 0 || Object.keys(obj(b.cash)).length + Object.keys(obj(b.cashTransfer)).length === 0)
        return null;
    const t = obj(b.cashTransfer);
    const byDetail = {};
    for (const [k, n] of Object.entries(obj(t.byDetail)))
        if (/^[A-Z_]{2,32}$/.test(k))
            byDetail[k] = int(n);
    return { cash: kindFigures(b.cash), cashTransfer: { ...kindFigures(t), byDetail, unspecifiedDetail: int(t.unspecifiedDetail) } };
}
function normalizeStatement(raw, fallback) {
    const o = obj(raw);
    if (Object.keys(o).length === 0)
        return null;
    const d = obj(o.deductions);
    const c = obj(o.commission);
    const p = obj(o.period);
    const payouts = (Array.isArray(o.payouts) ? o.payouts : []).map((x) => {
        const r = obj(x);
        return { payoutRef: str(r.payoutRef, 80) ?? "", paidAt: isoOrNull(r.paidAt), cashMinor: int(r.cashMinor), commissionDeductedMinor: int(r.commissionDeductedMinor), bankReference: str(r.bankReference, 80), reconciliation: (RECON.includes(String(r.reconciliation)) ? r.reconciliation : "UNMATCHED") };
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
        reconciliation: (["MATCHED", "UNMATCHED", "DISPUTED", "NO_PAYOUT"].includes(rec) ? rec : "UNMATCHED"),
    };
}
function isStatementNotConnected(e) {
    const res = e?.getResponse?.();
    return typeof res === "object" && res !== null && res.code === "STATEMENT_NOT_CONNECTED";
}
//# sourceMappingURL=commission-statement.js.map