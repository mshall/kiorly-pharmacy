/**
 * PHI redaction applied to EVERY prompt before it can reach an AI provider (mock or real). Deterministic, offline, over-redacts on purpose.
 * Removes: e-mail, URLs, phone numbers, national / long id numbers (Arabic-Indic digits are normalised first), dates (DOB etc.), labelled record numbers
 * (MRN / Rx / patient / customer / card ...), and any caller-supplied names (the patient/customer/prescriber names the caller knows about).
 */
export interface Redaction { text: string; counts: Record<string, number>; total: number }

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const normaliseDigits = (s: string) => s.replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d))).replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const RULES: Array<[string, RegExp, string]> = [
  ["EMAIL", /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL]"],
  ["URL", /\bhttps?:\/\/[^\s)]+/gi, "[URL]"],
  ["RECORD_ID", /\b(?:mrn|rx|patient|customer|member|card|policy|claim|nid|ssn)\s*(?:no\.?|number|id|#)?\s*[:#-]?\s*[A-Z0-9][A-Z0-9-]{3,}\b/gi, "[RECORD_ID]"],
  ["DATE", /\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\b|\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b/g, "[DATE]"],
  ["PHONE", /(?<![\w])\+?\d[\d\s().-]{7,}\d(?![\w])/g, "[PHONE]"],
  ["ID_NUMBER", /\b\d{9,}\b/g, "[ID_NUMBER]"],
];

export function redactPhi(input: string, names: string[] = []): Redaction {
  let text = normaliseDigits(input);
  const counts: Record<string, number> = {};
  const bump = (k: string, n = 1) => { counts[k] = (counts[k] ?? 0) + n; };
  // e-mail + URLs first (they may contain a name), then names (longest first so "Mona Hassan" wins over "Mona"), then the pattern rules
  for (const [k, re, rep] of RULES.slice(0, 2)) text = text.replace(re, () => { bump(k); return rep; });
  for (const n of [...new Set(names.map((x) => x.trim()).filter((x) => x.length >= 2))].sort((a, b) => b.length - a.length)) {
    for (const part of [n, ...n.split(/\s+/).filter((p) => p.length >= 3)]) {
      text = text.replace(new RegExp(esc(part), "gi"), () => { bump("NAME"); return "[NAME]"; });
    }
  }
  for (const [k, re, rep] of RULES.slice(2)) text = text.replace(re, () => { bump(k); return rep; });
  return { text, counts, total: Object.values(counts).reduce((a, b) => a + b, 0) };
}
