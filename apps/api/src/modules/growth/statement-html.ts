import { escapeHtml } from "./poster-html";
import type { StatementView } from "./commission-statement";

/**
 * Printable settlement statement of one period (COM-3). Same approach as the poster sheets: plain HTML + print CSS, the browser prints it or saves it as PDF (there is no server-side PDF engine).
 * Every label is the wording the web statement card already shows (AR/EN); no tax-authority fields, no new commercial or legal text. Pure function, escaped output, no scripts except `window.print()` on request.
 */
export type StatementLang = "ar" | "en";
export type StatementProduct = "PHARMACY" | "LAB";

const L = {
  en: {
    title: "Settlement statement", period: "Period", org: "Organisation", source: "These are the same figures Kiorex finance sees for your organization.",
    bankOnly: "Payouts are made by bank transfer to your bank account only. Kiorex never holds or pays out cash: any commission on a cash payment is accrued and netted in your next settlement.",
    reconciliation: "Reconciliation", MATCHED: "Matched", UNMATCHED: "Unmatched", DISPUTED: "Disputed", NO_PAYOUT: "No payout in this month",
    cOnline: "Online collections", cCashAccrued: "Cash commission accrued", cCashNetted: "Cash commission netted", cCashOpen: "Cash commission still open",
    cCashOnlyAccrued: "Of which cash at the visit: accrued", cCashOnlyNetted: "Of which cash at the visit: netted", cCashTransferAccrued: "Of which cash transfer: accrued", cCashTransferNetted: "Of which cash transfer: netted", cUnknownTender: "Visits with payment method not reported (exception)",
    cDedCommission: "Deduction: commission", cDedFees: "Deduction: fees", cDedRefunds: "Deduction: refunds", cDedChargebacks: "Deduction: chargebacks", cNet: "Net payable", cPaid: "Paid by bank transfer",
    payouts: "Payouts", noPayouts: "No payout in this month.", colPayout: "Payout", colDate: "Date", colCash: "Paid", colDeducted: "Commission kept", colBank: "Bank reference", colStatus: "Status",
    product: { PHARMACY: "Kiorly Pharmacy by Kiorex", LAB: "Kiorly Lab by Kiorex" },
  },
  ar: {
    title: "كشف التسوية", period: "الفترة", org: "المنشأة", source: "هذه هي الأرقام نفسها التي يراها المالية في كيوريكس لمنشأتك.",
    bankOnly: "تُدفع المستحقات بتحويل بنكي إلى حسابك البنكي فقط. لا تحتفظ كيوريكس بأي أموال نقدية ولا تدفعها: تُحتسب أي عمولة على دفعة نقدية وتُخصم في تسويتك القادمة.",
    reconciliation: "المطابقة", MATCHED: "مطابق", UNMATCHED: "غير مطابق", DISPUTED: "محل اعتراض", NO_PAYOUT: "لا توجد مدفوعات في هذا الشهر",
    cOnline: "التحصيلات الإلكترونية", cCashAccrued: "عمولة نقدية مستحقة", cCashNetted: "عمولة نقدية مخصومة", cCashOpen: "عمولة نقدية متبقية",
    cCashOnlyAccrued: "منها نقد عند الزيارة: مستحقة", cCashOnlyNetted: "منها نقد عند الزيارة: مخصومة", cCashTransferAccrued: "منها تحويل نقدي: مستحقة", cCashTransferNetted: "منها تحويل نقدي: مخصومة", cUnknownTender: "زيارات لم تُبلَّغ طريقة دفعها (استثناء)",
    cDedCommission: "خصم: العمولة", cDedFees: "خصم: الرسوم", cDedRefunds: "خصم: المبالغ المستردة", cDedChargebacks: "خصم: المطالبات المرتدة", cNet: "صافي المستحق", cPaid: "المدفوع بتحويل بنكي",
    payouts: "المدفوعات", noPayouts: "لا توجد مدفوعات في هذا الشهر.", colPayout: "الدفعة", colDate: "التاريخ", colCash: "المدفوع", colDeducted: "العمولة المخصومة", colBank: "مرجع البنك", colStatus: "الحالة",
    product: { PHARMACY: "كيورلي فارمسي من كيوريكس", LAB: "كيورلي لاب من كيوريكس" },
  },
} as const;

const money = (lang: StatementLang, cur: string, minor: number | null): string => {
  if (minor === null) return "—";
  try { return new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US", { style: "currency", currency: cur }).format(minor / 100); } catch { return (minor / 100).toFixed(2); }
};

export function renderStatementHtml(i: { product: StatementProduct; lang: StatementLang; periodKey: string; organisation: string; statement: StatementView; autoPrint?: boolean }): string {
  const s = L[i.lang]; const v = i.statement; const rtl = i.lang === "ar"; const m = (n: number | null) => escapeHtml(money(i.lang, v.currency, n));
  const rows: [keyof typeof s, number | null][] = [["cOnline", v.onlineCollectionsMinor], ["cCashAccrued", v.cashVisitCommissionAccruedMinor], ["cCashNetted", v.cashVisitCommissionNettedMinor], ["cCashOpen", v.cashVisitCommissionOpenMinor], ...(v.cashBreakdown ? ([["cCashOnlyAccrued", v.cashBreakdown.cash.accruedMinor], ["cCashOnlyNetted", v.cashBreakdown.cash.nettedMinor], ["cCashTransferAccrued", v.cashBreakdown.cashTransfer.accruedMinor], ["cCashTransferNetted", v.cashBreakdown.cashTransfer.nettedMinor]] as [keyof typeof s, number | null][]) : []), ...(v.unknownTender && v.unknownTender.charges > 0 ? ([["cUnknownTender", v.unknownTender.commissionMinor]] as [keyof typeof s, number | null][]) : []), ["cDedCommission", v.deductions.commissionMinor], ["cDedFees", v.deductions.feesMinor], ["cDedRefunds", v.deductions.refundsMinor], ["cDedChargebacks", v.deductions.chargebacksMinor], ["cNet", v.netPayableMinor], ["cPaid", v.paidByBankTransferMinor]];
  const figures = rows.map(([k, n]) => `<tr><th scope="row">${escapeHtml(String(s[k]))}</th><td dir="ltr">${m(n)}</td></tr>`).join("");
  const payouts = v.payouts.length
    ? `<table class="p"><thead><tr>${(["colPayout", "colDate", "colCash", "colDeducted", "colBank", "colStatus"] as const).map((c) => `<th scope="col">${escapeHtml(s[c])}</th>`).join("")}</tr></thead><tbody>${v.payouts.map((p) => `<tr><td dir="ltr">${escapeHtml(p.payoutRef)}</td><td dir="ltr">${escapeHtml(p.paidAt?.slice(0, 10) ?? "—")}</td><td dir="ltr">${m(p.cashMinor)}</td><td dir="ltr">${m(p.commissionDeductedMinor)}</td><td dir="ltr">${escapeHtml(p.bankReference ?? "—")}</td><td>${escapeHtml(s[p.reconciliation])}</td></tr>`).join("")}</tbody></table>`
    : `<p class="note">${escapeHtml(s.noPayouts)}</p>`;
  const css = `@page{size:A4;margin:14mm}:root{--ink:#3730A3;--text:#111827;--muted:#4B5563}*{box-sizing:border-box}body{margin:0;font-family:"Segoe UI",Tahoma,"Noto Sans Arabic",system-ui,sans-serif;color:var(--text);background:#fff;font-size:13px}.brand{color:var(--ink);font-weight:600}h1{font-size:24px;margin:6mm 0 2mm;color:var(--ink)}table{width:100%;border-collapse:collapse;margin:4mm 0}th,td{border-bottom:1px solid #D1D5DB;padding:6px 8px;text-align:start}tbody th{font-weight:500}td{font-variant-numeric:tabular-nums}.note{color:var(--muted)}h2{font-size:16px;margin:6mm 0 0}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}`;
  const print = i.autoPrint ? "<script>window.addEventListener('load',function(){setTimeout(function(){window.print()},250)})</script>" : "";
  return `<!doctype html><html lang="${i.lang}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escapeHtml(s.title)} ${escapeHtml(i.periodKey)}</title><style>${css}</style></head><body><div class="brand">${escapeHtml(s.product[i.product])}</div><h1>${escapeHtml(s.title)}</h1><p>${escapeHtml(s.org)}: <strong>${escapeHtml(i.organisation)}</strong> · ${escapeHtml(s.period)}: <strong dir="ltr">${escapeHtml(i.periodKey)}</strong> · ${escapeHtml(s.reconciliation)}: <strong>${escapeHtml(s[v.reconciliation])}</strong></p><p class="note">${escapeHtml(s.source)}</p><p class="note">${escapeHtml(s.bankOnly)}</p><table><tbody>${figures}</tbody></table><h2>${escapeHtml(s.payouts)}</h2>${payouts}${print}</body></html>`;
}
