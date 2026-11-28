"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeHtml = escapeHtml;
exports.renderPosterHtml = renderPosterHtml;
function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
const STR = {
    PHARMACY: {
        en: { brand: "Kiorly Pharmacy by Kiorex", poster: "Scan to order from this pharmacy on Kiorex", desk: "Order your medicines online", scan: "Scan with your phone camera" },
        ar: { brand: "كيورلي فارمسي من كيوريكس", poster: "امسح الرمز للطلب من هذه الصيدلية عبر كيوريكس", desk: "اطلب أدويتك عبر الإنترنت", scan: "امسح الرمز بكاميرا هاتفك" },
    },
    LAB: {
        en: { brand: "Kiorly Lab by Kiorex", poster: "Scan to book your tests with this lab on Kiorex", desk: "Book your next test online", scan: "Scan with your phone camera" },
        ar: { brand: "كيورلي لاب من كيوريكس", poster: "امسح الرمز لحجز تحاليلك مع هذا المعمل عبر كيوريكس", desk: "احجز تحليلك القادم عبر الإنترنت", scan: "امسح الرمز بكاميرا هاتفك" },
    },
};
const MARK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="206 206 688 468" width="46" height="31" aria-hidden="true">' +
    '<polyline points="373,237 505,440 373,643" fill="none" stroke="#3730A3" stroke-width="38"/>' +
    '<polyline points="720,237 588,440 720,643" fill="none" stroke="#0F766E" stroke-width="38"/>' +
    '<path d="M222 440 H510 L525 428 L540 466 L557 392 L574 460 L588 441 H877" fill="none" stroke="#E8735E" stroke-width="11" stroke-linejoin="round" stroke-linecap="round"/></svg>';
function brandRow(product, lang) {
    return `<div class="brand">${MARK_SVG}<span>${escapeHtml(STR[product][lang].brand)}</span></div>`;
}
function sheetCss(size) {
    const big = size === "A4";
    const qr = big ? 118 : 84;
    return `
@page { size: ${size}; margin: 14mm; }
:root { --ink:#3730A3; --ocean:#0369A1; --coral:#E8735E; --ground:#F4F6FC; --text:#111827; --muted:#4B5563; }
* { box-sizing: border-box; }
body { margin:0; font-family: "Segoe UI", Tahoma, "Noto Sans Arabic", "Noto Kufi Arabic", system-ui, sans-serif; color: var(--text); background:#fff; text-align:center; }
.sheet { border: 2px solid var(--ink); border-radius: 6mm; padding: ${big ? 12 : 8}mm; background: var(--ground); }
.brand { display:inline-flex; align-items:center; gap:8px; font-weight:600; color:var(--ink); font-size:${big ? 15 : 12}px; letter-spacing:.02em; }
h1 { font-size:${big ? 34 : 24}px; margin:${big ? 10 : 6}mm 0 2mm; color:var(--ink); line-height:1.25; }
h2 { font-size:${big ? 20 : 15}px; margin:0 0 4mm; color:var(--ocean); font-weight:500; }
p.cta { font-size:${big ? 26 : 18}px; margin:0 0 5mm; font-weight:600; }
.qr { display:inline-block; background:#fff; padding:3mm; border-radius:4mm; }
.qr svg { width:${qr}mm; height:${qr}mm; display:block; }
p.url { font-family: ui-monospace, Menlo, monospace; direction:ltr; unicode-bidi:isolate; font-size:${big ? 16 : 12}px; margin:5mm 0 2mm; color:var(--ink); }
p.note { font-size:${big ? 14 : 11}px; color:var(--muted); margin:0; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .noprint { display:none; } }
`;
}
function renderPosterHtml(input) {
    const s = STR[input.product][input.lang];
    const rtl = input.lang === "ar";
    const name = escapeHtml(rtl ? input.nameAr || input.nameEn : input.nameEn);
    const sub = (rtl ? input.subtitleAr || input.subtitleEn : input.subtitleEn) ?? "";
    const subHtml = sub ? escapeHtml(sub) : "";
    const cta = input.kind === "DESK" ? s.desk : s.poster;
    const url = escapeHtml(input.shortUrl.replace(/^https?:\/\//, ""));
    const body = `<div class="sheet">${brandRow(input.product, input.lang)}<h1>${name}</h1>${subHtml ? `<h2>${subHtml}</h2>` : ""}<p class="cta">${escapeHtml(cta)}</p><div class="qr" role="img" aria-label="QR">${input.qrSvg}</div><p class="url">${url}</p><p class="note">${escapeHtml(s.scan)}</p></div>`;
    const print = input.autoPrint ? "<script>window.addEventListener('load',function(){setTimeout(function(){window.print()},250)})</script>" : "";
    return `<!doctype html><html lang="${input.lang}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${name}</title><style>${sheetCss(input.size)}</style></head><body>${body}${print}</body></html>`;
}
//# sourceMappingURL=poster-html.js.map