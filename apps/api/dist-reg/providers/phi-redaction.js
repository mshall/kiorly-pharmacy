"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redactPhi = redactPhi;
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const normaliseDigits = (s) => s.replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d))).replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const RULES = [
    ["EMAIL", /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL]"],
    ["URL", /\bhttps?:\/\/[^\s)]+/gi, "[URL]"],
    ["RECORD_ID", /\b(?:mrn|rx|patient|customer|member|card|policy|claim|nid|ssn)\s*(?:no\.?|number|id|#)?\s*[:#-]?\s*[A-Z0-9][A-Z0-9-]{3,}\b/gi, "[RECORD_ID]"],
    ["DATE", /\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\b|\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b/g, "[DATE]"],
    ["PHONE", /(?<![\w])\+?\d[\d\s().-]{7,}\d(?![\w])/g, "[PHONE]"],
    ["ID_NUMBER", /\b\d{9,}\b/g, "[ID_NUMBER]"],
];
function redactPhi(input, names = []) {
    let text = normaliseDigits(input);
    const counts = {};
    const bump = (k, n = 1) => { counts[k] = (counts[k] ?? 0) + n; };
    for (const [k, re, rep] of RULES.slice(0, 2))
        text = text.replace(re, () => { bump(k); return rep; });
    for (const n of [...new Set(names.map((x) => x.trim()).filter((x) => x.length >= 2))].sort((a, b) => b.length - a.length)) {
        for (const part of [n, ...n.split(/\s+/).filter((p) => p.length >= 3)]) {
            text = text.replace(new RegExp(esc(part), "gi"), () => { bump("NAME"); return "[NAME]"; });
        }
    }
    for (const [k, re, rep] of RULES.slice(2))
        text = text.replace(re, () => { bump(k); return rep; });
    return { text, counts, total: Object.values(counts).reduce((a, b) => a + b, 0) };
}
//# sourceMappingURL=phi-redaction.js.map