const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

interface ReceiptData {
  receiptNo: string | null; soldAt: Date; pharmacy: string; branch: string; branchAddress: string | null; licenceNo: string | null; currency: string; vatLabel: string; vatLabelAr: string;
  lines: Array<{ name: string; nameAr: string | null; strength: string | null; lotNumber: string; quantity: number; unitPrice: string; discount: string; lineTotal: string; vatRate: string; vatAmount: string }>;
  subtotal: string; discountTotal: string; vatTotal: string; total: string; payments: Array<{ method: string; amount: string }>; status: string; footer: string | null; notice: { en: string; ar: string };
}

const L = {
  en: { subtotal: "Subtotal", discount: "Discount", total: "Total", paid: "Paid", receipt: "Receipt", licence: "Licence", vat: "incl." },
  ar: { subtotal: "الإجمالي الفرعي", discount: "الخصم", total: "الإجمالي", paid: "المدفوع", receipt: "إيصال", licence: "ترخيص", vat: "شامل" },
} as const;

/** Thermal-printable receipt (80 mm). VAT shown as lines only (market-pack label), no tax-authority identifiers or QR (CLAUDE.md). */
export function renderReceiptHtml(r: ReceiptData, lang: "ar" | "en"): string {
  const t = L[lang], rtl = lang === "ar";
  const vat = lang === "ar" ? r.vatLabelAr : r.vatLabel;
  return `<!doctype html><html lang="${lang}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${t.receipt} ${esc(r.receiptNo)}</title>
<style>@page{size:80mm auto;margin:3mm}body{width:74mm;font:11px/1.35 ui-monospace,"Noto Sans Arabic",monospace;margin:0}h1{font-size:14px;text-align:center;margin:0}.c{text-align:center}hr{border:0;border-top:1px dashed #000}
table{width:100%;border-collapse:collapse}td{vertical-align:top}.n{text-align:${rtl ? "left" : "right"}}.b{font-weight:700}small{color:#333}</style></head><body>
<h1>${esc(r.pharmacy)}</h1><div class="c">${esc(r.branch)}${r.branchAddress ? `<br>${esc(r.branchAddress)}` : ""}${r.licenceNo ? `<br>${t.licence}: ${esc(r.licenceNo)}` : ""}</div><hr>
<div>${t.receipt} #${esc(r.receiptNo)}<br>${esc(new Date(r.soldAt).toISOString().replace("T", " ").slice(0, 16))}</div><hr>
<table>${r.lines.map((l) => `<tr><td>${esc(rtl && l.nameAr ? l.nameAr : l.name)}${l.strength ? ` ${esc(l.strength)}` : ""}<br><small>${l.quantity} × ${esc(l.unitPrice)} · LOT ${esc(l.lotNumber)}</small></td><td class="n">${esc(l.lineTotal)}</td></tr>`).join("")}</table><hr>
<table><tr><td>${t.subtotal}</td><td class="n">${esc(r.subtotal)}</td></tr>${r.discountTotal !== "0.00" ? `<tr><td>${t.discount}</td><td class="n">-${esc(r.discountTotal)}</td></tr>` : ""}
<tr class="b"><td>${t.total} (${esc(r.currency)})</td><td class="n">${esc(r.total)}</td></tr><tr><td>${t.vat} ${esc(vat)}</td><td class="n">${esc(r.vatTotal)}</td></tr></table><hr>
<table>${r.payments.map((p) => `<tr><td>${esc(p.method)}</td><td class="n">${esc(p.amount)}</td></tr>`).join("")}</table><hr>
${r.footer ? `<div class="c">${esc(r.footer)}</div>` : ""}<div class="c"><small>${esc(r.notice[lang])}</small></div>
${r.status !== "COMPLETED" ? `<div class="c b">${esc(r.status)}</div>` : ""}</body></html>`;
}
