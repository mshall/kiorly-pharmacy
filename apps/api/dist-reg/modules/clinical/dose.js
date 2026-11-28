"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strengthToMg = strengthToMg;
exports.dosesPerDay = dosesPerDay;
exports.unitsPerDose = unitsPerDose;
exports.dailyDoseMg = dailyDoseMg;
const WORDS = { one: 1, two: 2, three: 3, four: 4, half: 0.5, "½": 0.5, a: 1 };
function strengthToMg(strength) {
    const m = /(\d+(?:[.,]\d+)?)\s*(mg|mcg|µg|g)\b/i.exec((strength ?? "").replace(",", "."));
    if (!m)
        return null;
    const v = Number(m[1]);
    const u = m[2].toLowerCase();
    return u === "g" ? v * 1000 : u === "mg" ? v : v / 1000;
}
function dosesPerDay(sig) {
    const s = sig.toLowerCase();
    let m = /every\s*(\d+)\s*(?:h|hr|hrs|hour|hours)/.exec(s) ?? /q\s*(\d+)\s*h\b/.exec(s) ?? /كل\s*(\d+)\s*ساعات?/.exec(s);
    if (m)
        return Math.min(24 / Number(m[1]), 24);
    const NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
    m = /(\d+|one|two|three|four|five|six)\s*(?:x|times?|مرات?)\b/.exec(s);
    if (m && /(day|daily|يوم)/.test(s))
        return NUM[m[1]] ?? Number(m[1]);
    if (/\b(qid|q\.i\.d)\b/.test(s))
        return 4;
    if (/\b(tid|t\.i\.d)\b/.test(s))
        return 3;
    if (/\b(bid|b\.i\.d)\b|twice|مرتين/.test(s))
        return 2;
    if (/\b(od|qd|o\.d)\b|once|daily|every day|at night|nightly|at bedtime|morning|يومياً|مرة/.test(s))
        return 1;
    return null;
}
function unitsPerDose(sig) {
    const s = sig.toLowerCase();
    const frac = /(\d+)\s*\/\s*(\d+)\s*(?:tab|cap|قرص)/.exec(s);
    if (frac)
        return Number(frac[1]) / Number(frac[2]);
    const n = /(\d+(?:\.\d+)?)\s*(?:tab|cap|pill|قرص|كبسول|حبة)/.exec(s);
    if (n)
        return Number(n[1]);
    const w = /\b(one|two|three|four|half|a)\s+(?:tab|cap|pill)/.exec(s);
    if (w)
        return WORDS[w[1]];
    return 1;
}
function dailyDoseMg(sig, strength) {
    if (!sig)
        return null;
    const mg = strengthToMg(strength);
    const n = dosesPerDay(sig);
    if (mg == null || n == null)
        return null;
    const perDoseMg = unitsPerDose(sig) * mg;
    return { perDoseMg, dosesPerDay: n, dailyMg: perDoseMg * n };
}
//# sourceMappingURL=dose.js.map