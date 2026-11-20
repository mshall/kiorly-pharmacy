import { barcodeSvg } from "../../common/barcode";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export interface RxLabelData {
  pharmacy: string; branch: string; branchPhone: string | null; licenceNo: string | null; rxNo: string; dispensedAt: Date; patient: string; refillsLeft: number | null;
  prescriber: string | null; pharmacist: string | null; pharmacistLicence: string | null; counselling: string | null;
  lines: Array<{ name: string; nameAr: string | null; strength: string | null; quantity: number; directions: string | null; lotNumber: string; expiryDate: Date; coldChain: boolean; controlled: boolean; substituted: boolean }>;
}

const T = {
  en: { patient: "Patient", rx: "Rx", qty: "Qty", directions: "Directions", expiry: "Exp", lot: "Lot", by: "Dispensed by", prescriber: "Prescriber", refills: "Refills left", keep: "Keep out of reach of children", cold: "STORE IN A REFRIGERATOR (2-8 °C)", controlled: "CONTROLLED MEDICINE", asDirected: "Use as directed by your pharmacist", sub: "Generic substitution (patient agreed)", counsel: "Counselling" },
  ar: { patient: "المريض", rx: "روشتة", qty: "الكمية", directions: "الجرعة", expiry: "الانتهاء", lot: "تشغيلة", by: "صرف بواسطة", prescriber: "الطبيب", refills: "مرات إعادة الصرف المتبقية", keep: "يحفظ بعيداً عن متناول الأطفال", cold: "يحفظ في الثلاجة (2-8 °م)", controlled: "دواء مراقب", asDirected: "يستخدم حسب إرشادات الصيدلي", sub: "بديل جنيس (بموافقة المريض)", counsel: "إرشادات" },
} as const;

/** Printable medication labels (one per dispensed line, 70x45 mm sheet) + a counselling slip. Self-contained HTML; AR/EN, RTL-aware. */
export function renderRxLabelsHtml(d: RxLabelData, lang: "ar" | "en"): string {
  const t = T[lang], rtl = lang === "ar";
  const label = (l: RxLabelData["lines"][number]) => `<section class="label">
<header><b>${esc(d.pharmacy)}</b> · ${esc(d.branch)}${d.branchPhone ? ` · <bdi>${esc(d.branchPhone)}</bdi>` : ""}</header>
<div class="row"><span>${t.patient}: <b>${esc(d.patient)}</b></span><span>${t.rx} <bdi>${esc(d.rxNo)}</bdi></span></div>
<div class="drug">${esc(rtl && l.nameAr ? l.nameAr : l.name)} <small><bdi>${esc(l.strength ?? "")}</bdi></small></div>
<div class="row"><span>${t.qty}: <b>${l.quantity}</b></span><span>${t.lot} <bdi>${esc(l.lotNumber)}</bdi> · ${t.expiry} <bdi>${l.expiryDate.toISOString().slice(0, 7)}</bdi></span></div>
<div class="dir">${esc(l.directions ?? t.asDirected)}</div>
${l.coldChain ? `<div class="warn">${t.cold}</div>` : ""}${l.controlled ? `<div class="warn">${t.controlled}</div>` : ""}${l.substituted ? `<div class="note">${t.sub}</div>` : ""}
<footer><span>${t.by}: ${esc(d.pharmacist ?? "—")}${d.pharmacistLicence ? ` (${esc(d.pharmacistLicence)})` : ""} · ${d.dispensedAt.toISOString().slice(0, 10)}${d.refillsLeft != null && d.refillsLeft > 0 ? ` · ${t.refills}: ${d.refillsLeft}` : ""}</span><span class="keep">${t.keep}</span></footer>
<div class="bar">${barcodeSvg(d.rxNo, { height: 18 })}</div></section>`;
  return `<!doctype html><html lang="${lang}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${t.rx} ${esc(d.rxNo)}</title>
<style>@page{size:auto;margin:6mm}body{margin:0;font:11px/1.35 system-ui,"Noto Sans Arabic",sans-serif;color:#000}.label{width:70mm;min-height:45mm;border:1px solid #000;border-radius:2mm;padding:2mm;margin:0 0 4mm;break-inside:avoid;page-break-inside:avoid}
header{font-size:9px;border-bottom:1px solid #000;padding-bottom:1mm;margin-bottom:1mm}.row{display:flex;justify-content:space-between;gap:4px;font-size:10px}.drug{font-size:13px;font-weight:700;margin:1mm 0}.dir{font-size:12px;font-weight:600;border:1px dashed #000;padding:1mm;margin:1mm 0}
.warn{background:#000;color:#fff;font-weight:700;text-align:center;font-size:10px;padding:.5mm;margin:.5mm 0}.note{font-size:9px;font-style:italic}footer{font-size:8px;display:flex;flex-direction:column}.keep{font-weight:700}.bar{text-align:center}.bar svg{max-width:100%;height:auto}
.slip{width:70mm;border:1px dashed #000;padding:2mm;font-size:10px}@media print{.no-print{display:none}}</style></head><body>
${d.lines.map(label).join("\n")}
${d.counselling ? `<section class="slip"><b>${t.counsel}</b><p>${esc(d.counselling)}</p></section>` : ""}
</body></html>`;
}
