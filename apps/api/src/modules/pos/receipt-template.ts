import { code128Svg } from "../../common/barcode";
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

interface ReceiptData {
  receiptNo: string | null; soldAt: Date; pharmacy: string; branch: string; branchAddress: string | null; licenceNo: string | null; currency: string; vatLabel: string; vatLabelAr: string;
  lines: Array<{ name: string; nameAr: string | null; strength: string | null; lotNumber: string; quantity: number; unitPrice: string; discount: string; lineTotal: string; vatRate: string; vatAmount: string }>;
  subtotal: string; discountTotal: string; vatTotal: string; total: string; payments: Array<{ method: string; amount: string }>; status: string; footer: string | null; notice: { en: string; ar: string };
  /** Receipt template settings (Settings > Receipt). */
  template?: { header?: string; showVat?: boolean; showLicence?: boolean; logoText?: string };
  customer?: { name: string; customerNo: string | null; phone?: string | null } | null;
  loyalty?: { earned: number; balance: number; tier: string } | null;
  discounts?: Array<{ name: string; amount: string }>;
  vatBreakdown?: Array<{ rate: string; net: string; vat: string; gross: string }>;
}

const L = {
  en: { subtotal: "Subtotal", discount: "Discount", total: "Total", paid: "Paid", receipt: "Receipt", licence: "Licence", vat: "incl.", customer: "Customer", points: "Loyalty points", earned: "earned", balance: "balance", saved: "You saved", invoice: "Sales invoice", item: "Item", lot: "Lot", qty: "Qty", price: "Price", net: "Net", rate: "Rate", date: "Date", signature: "Signature", gross: "Gross", payments: "Payments" },
  ar: { subtotal: "الإجمالي الفرعي", discount: "الخصم", total: "الإجمالي", paid: "المدفوع", receipt: "إيصال", licence: "ترخيص", vat: "شامل", customer: "العميل", points: "نقاط الولاء", earned: "مكتسبة", balance: "الرصيد", saved: "وفّرت", invoice: "فاتورة مبيعات", item: "الصنف", lot: "تشغيلة", qty: "الكمية", price: "السعر", net: "الصافي", rate: "النسبة", date: "التاريخ", signature: "التوقيع", gross: "الإجمالي", payments: "المدفوعات" },
} as const;

/** Thermal-printable receipt (80 mm). VAT shown as lines only (market-pack label), no tax-authority identifiers or QR (CLAUDE.md). */
export function renderReceiptHtml(r: ReceiptData, lang: "ar" | "en"): string {
  const t = L[lang], rtl = lang === "ar";
  const vat = lang === "ar" ? r.vatLabelAr : r.vatLabel;
  return `<!doctype html><html lang="${lang}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${t.receipt} ${esc(r.receiptNo)}</title>
<style>@page{size:80mm auto;margin:3mm}body{width:74mm;font:11px/1.35 ui-monospace,"Noto Sans Arabic",monospace;margin:0}h1{font-size:14px;text-align:center;margin:0}.c{text-align:center}hr{border:0;border-top:1px dashed #000}
table{width:100%;border-collapse:collapse}td{vertical-align:top}.n{text-align:${rtl ? "left" : "right"}}.b{font-weight:700}small{color:#333}</style></head><body>
<h1>${esc(r.template?.logoText || r.pharmacy)}</h1><div class="c">${esc(r.branch)}${r.branchAddress ? `<br>${esc(r.branchAddress)}` : ""}${r.licenceNo && r.template?.showLicence !== false ? `<br>${t.licence}: ${esc(r.licenceNo)}` : ""}${r.template?.header ? `<br>${esc(r.template.header)}` : ""}</div><hr>
<div>${t.receipt} #${esc(r.receiptNo)}<br>${esc(new Date(r.soldAt).toISOString().replace("T", " ").slice(0, 16))}${r.customer ? `<br>${t.customer}: ${esc(r.customer.name)}` : ""}</div><hr>
<table>${r.lines.map((l) => `<tr><td>${esc(rtl && l.nameAr ? l.nameAr : l.name)}${l.strength ? ` ${esc(l.strength)}` : ""}<br><small>${l.quantity} × ${esc(l.unitPrice)} · LOT ${esc(l.lotNumber)}</small></td><td class="n">${esc(l.lineTotal)}</td></tr>`).join("")}</table><hr>
<table><tr><td>${t.subtotal}</td><td class="n">${esc(r.subtotal)}</td></tr>${r.discountTotal !== "0.00" ? `<tr><td>${t.discount}</td><td class="n">-${esc(r.discountTotal)}</td></tr>` : ""}
<tr class="b"><td>${t.total} (${esc(r.currency)})</td><td class="n">${esc(r.total)}</td></tr>${r.template?.showVat === false ? "" : `<tr><td>${t.vat} ${esc(vat)}</td><td class="n">${esc(r.vatTotal)}</td></tr>`}</table>${r.discounts?.length ? `<div class="c"><small>${t.saved}: ${r.discounts.map((d) => `${esc(d.name)} ${esc(d.amount)}`).join(" · ")}</small></div>` : ""}<hr>
<table>${r.payments.map((p) => `<tr><td>${esc(p.method)}</td><td class="n">${esc(p.amount)}</td></tr>`).join("")}</table><hr>
${r.loyalty ? `<div class="c"><small>${t.points}: +${r.loyalty.earned} (${t.balance} ${r.loyalty.balance})</small></div>` : ""}${r.footer ? `<div class="c">${esc(r.footer)}</div>` : ""}${r.receiptNo ? `<div class="c">${code128Svg(r.receiptNo, { height: 24, module: 1.2 })}</div>` : ""}<div class="c"><small>${esc(r.notice[lang])}</small></div>
${r.status !== "COMPLETED" ? `<div class="c b">${esc(r.status)}</div>` : ""}</body></html>`;
}


/** A4 sales invoice (payment record) for customers who ask for a full page: line table, VAT by rate, customer block. No tax-authority identifiers, no QR (CLAUDE.md). */
export function renderInvoiceA4Html(r: ReceiptData, lang: "ar" | "en"): string {
  const t = L[lang], rtl = lang === "ar";
  const vat = lang === "ar" ? r.vatLabelAr : r.vatLabel;
  return `<!doctype html><html lang="${lang}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${t.invoice} ${esc(r.receiptNo)}</title>
<style>@page{size:A4;margin:14mm}body{font:12px/1.5 system-ui,"Noto Sans Arabic",sans-serif;color:#111}header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #3730A3;padding-bottom:8px;margin-bottom:12px}
h1{margin:0;font-size:22px;color:#3730A3}.meta{text-align:${rtl ? "left" : "right"}}table{width:100%;border-collapse:collapse;margin:10px 0}th{background:#F4F6FC;text-align:start;font-size:11px}th,td{padding:6px 8px;border-bottom:1px solid #ddd}.n{text-align:${rtl ? "left" : "right"};font-variant-numeric:tabular-nums}
.tot{width:46%;margin-${rtl ? "right" : "left"}:auto}.tot td{border:0;padding:3px 8px}.grand td{font-size:15px;font-weight:700;border-top:2px solid #111}.foot{margin-top:24px;font-size:10px;color:#555}.sig{margin-top:36px;display:flex;justify-content:space-between}</style></head><body>
<header><div><h1>${esc(r.template?.logoText || r.pharmacy)}</h1>${esc(r.branch)}${r.branchAddress ? ` · ${esc(r.branchAddress)}` : ""}${r.licenceNo && r.template?.showLicence !== false ? `<br>${t.licence}: ${esc(r.licenceNo)}` : ""}${r.template?.header ? `<br>${esc(r.template.header)}` : ""}</div>
<div class="meta"><b>${t.invoice}</b><br>#${esc(r.receiptNo)}<br>${t.date}: ${esc(new Date(r.soldAt).toISOString().slice(0, 10))}${r.customer ? `<br>${t.customer}: ${esc(r.customer.name)}${r.customer.customerNo ? ` (${esc(r.customer.customerNo)})` : ""}` : ""}</div></header>
<table><thead><tr><th>${t.item}</th><th>${t.lot}</th><th class="n">${t.qty}</th><th class="n">${t.price}</th><th class="n">${t.discount}</th><th class="n">${t.total}</th></tr></thead><tbody>
${r.lines.map((l) => `<tr><td>${esc(rtl && l.nameAr ? l.nameAr : l.name)} ${esc(l.strength ?? "")}</td><td>${esc(l.lotNumber)}</td><td class="n">${l.quantity}</td><td class="n">${esc(l.unitPrice)}</td><td class="n">${esc(l.discount)}</td><td class="n">${esc(l.lineTotal)}</td></tr>`).join("")}</tbody></table>
<table class="tot"><tr><td>${t.subtotal}</td><td class="n">${esc(r.subtotal)}</td></tr>${r.discountTotal !== "0.00" ? `<tr><td>${t.discount}</td><td class="n">-${esc(r.discountTotal)}</td></tr>` : ""}
${r.template?.showVat === false ? "" : (r.vatBreakdown ?? []).map((v) => `<tr><td>${t.vat} ${esc(vat)} ${(Number(v.rate) * 100).toFixed(0)}%</td><td class="n">${esc(v.vat)}</td></tr>`).join("")}
<tr class="grand"><td>${t.total} (${esc(r.currency)})</td><td class="n">${esc(r.total)}</td></tr></table>
<h3 style="font-size:12px;margin:14px 0 4px">${t.payments}</h3><table class="tot">${r.payments.map((p) => `<tr><td>${esc(p.method)}</td><td class="n">${esc(p.amount)}</td></tr>`).join("")}</table>
<div class="sig"><span>${t.signature}: ____________________</span><span>${r.receiptNo ? code128Svg(r.receiptNo, { height: 28, module: 1.2 }) : ""}</span></div>
<p class="foot">${r.footer ? `${esc(r.footer)}<br>` : ""}${esc(r.notice[lang])}</p></body></html>`;
}
