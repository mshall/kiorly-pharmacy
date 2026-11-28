"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderShelfLabels = renderShelfLabels;
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const barcode_1 = require("../../common/barcode");
function renderShelfLabels(labels, lang, currency = "EGP") {
    const rtl = lang === "ar";
    const cells = labels.map((l) => `<div class="label"><div class="name">${esc(rtl && l.brandNameAr ? l.brandNameAr : l.brandName)}</div>
<div class="sub">${esc(l.activeIngredient)} · ${esc(l.strength)} · ${esc(l.dosageForm)} · ${esc(l.packSize)}</div>
<div class="price">${l.price ? `${esc(l.price)} <small>${esc(currency)}</small>` : "—"}</div>
<div class="bar">${l.barcode ? (() => { try {
        return (0, barcode_1.barcodeSvg)(l.barcode, { height: 24 });
    }
    catch {
        return esc(l.barcode);
    } })() : ""}</div></div>`).join("\n");
    return `<!doctype html><html lang="${lang}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${rtl ? "ملصقات الرف" : "Shelf labels"}</title>
<style>body{font-family:system-ui,"Noto Sans Arabic",sans-serif;margin:8mm}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
.label{border:1px dashed #888;padding:3mm;break-inside:avoid}.name{font-weight:700;font-size:13pt}.sub{font-size:9pt;color:#444}.price{font-size:18pt;font-weight:800;margin-top:2mm}.price small{font-size:9pt}.bar{font:9pt monospace;margin-top:2mm;letter-spacing:.15em}</style></head>
<body><div class="grid">${cells}</div></body></html>`;
}
//# sourceMappingURL=label-template.js.map