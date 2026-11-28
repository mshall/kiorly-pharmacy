"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_RATE_PARAMS = void 0;
exports.rateViewProblems = rateViewProblems;
exports.rateParamsOf = rateParamsOf;
exports.parseDisclosure = parseDisclosure;
exports.parseCounselStatus = parseCounselStatus;
function rateViewProblems(b) {
    if (!b || typeof b !== "object")
        return ["body must be an object"];
    const o = b;
    const out = [];
    if (typeof o.orgRef !== "string" || !o.orgRef)
        out.push("orgRef is required");
    if (!["CLINIC", "PHARMACY", "LAB"].includes(String(o.product)))
        out.push("product must be CLINIC, PHARMACY or LAB");
    if (typeof o.version !== "string" || !/^\d{1,18}$/.test(o.version))
        out.push("version must be a numeric string");
    if (!Array.isArray(o.history))
        out.push("history must be an array");
    else
        for (const [i, r] of o.history.entries()) {
            const h = r;
            if (!h || typeof h.version !== "number" || !["DEFAULT", "ORG"].includes(String(h.scope)) || !["RATE", "INHERIT"].includes(String(h.kind)) || Number.isNaN(Date.parse(String(h.effectiveFrom))))
                out.push(`history[${i}] is malformed`);
            else if (h.kind === "RATE") {
                const s = h.spec;
                if (!s || !["PERCENT", "FLAT"].includes(String(s.feeType)))
                    out.push(`history[${i}].spec is malformed`);
            }
        }
    return out;
}
const wholeDays = (v, min, max) => (typeof v === "number" && Number.isInteger(v) && v >= min && v <= max ? v : null);
const dayList = (v, min, max, maxLen) => (Array.isArray(v) && v.length > 0 && v.length <= maxLen && v.every((n, i, a) => wholeDays(n, min, max) !== null && (i === 0 || n > a[i - 1])) ? [...v] : null);
exports.NO_RATE_PARAMS = { graceDays: null, retryDays: null, invoiceDueDays: null, reminderDays: null, disputeWindowDays: null, savedMethodChargeAllowed: null };
function rateParamsOf(spec) {
    if (!spec || typeof spec !== "object")
        return exports.NO_RATE_PARAMS;
    return {
        graceDays: wholeDays(spec.graceDays, 0, 30), retryDays: dayList(spec.retryDays, 1, 60, 6), invoiceDueDays: wholeDays(spec.invoiceDueDays, 1, 90),
        reminderDays: dayList(spec.reminderDays, -30, 90, 8), disputeWindowDays: wholeDays(spec.disputeWindowDays, 0, 365), savedMethodChargeAllowed: typeof spec.savedMethodChargeAllowed === "boolean" ? spec.savedMethodChargeAllowed : null,
    };
}
const COUNSEL_STATUSES = ["NOT_REVIEWED", "APPROVED_WITH_CONDITIONS", "APPROVED", "REJECTED"];
const text = (v) => (typeof v === "string" ? v.slice(0, 4000) : "");
const bi = (v) => { const o = v && typeof v === "object" ? v : {}; return { en: text(o.en), ar: text(o.ar) }; };
function parseDisclosure(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
        return null;
    const o = raw;
    const rateDisclosure = bi(o.rateDisclosure);
    const termsSummary = bi(o.termsSummary);
    const wordingSet = [rateDisclosure.en, rateDisclosure.ar, termsSummary.en, termsSummary.ar].some((x) => x.trim().length > 0);
    return { rateDisclosure, termsSummary, showOverrideReason: o.showOverrideReason === true, wordingSet };
}
function parseCounselStatus(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
        return null;
    const o = raw;
    if (typeof o.status !== "string" || !COUNSEL_STATUSES.includes(o.status))
        return null;
    return { status: o.status, reviewedOn: typeof o.reviewedOn === "string" && !Number.isNaN(Date.parse(o.reviewedOn)) ? o.reviewedOn.slice(0, 10) : null };
}
//# sourceMappingURL=commission-rate-view.js.map