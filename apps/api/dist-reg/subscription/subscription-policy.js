"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liteGraceActive = exports.isFree = exports.FREE_EDITION = exports.effectiveAutoRenew = exports.DEFAULT_SUBSCRIPTION_POLICY = void 0;
exports.parseSubscriptionPolicy = parseSubscriptionPolicy;
exports.loadPolicy = loadPolicy;
exports.decidePeriodEnd = decidePeriodEnd;
exports.reminderOffsetsDue = reminderOffsetsDue;
exports.nextOutsideQuietHours = nextOutsideQuietHours;
exports.computeDowngradeImpact = computeDowngradeImpact;
exports.DEFAULT_SUBSCRIPTION_POLICY = {
    autoRenewDefault: true,
    orgMayDisableAutoRenew: true,
    renewalReminderDaysBefore: [7, 3, 1],
    retryDays: [1, 3, 7],
    downgradeAfterDays: 15,
    liteReadOnlyGraceDays: 30,
    taxRatePercent: 0,
    reminderQuietHours: { start: 21, end: 8 },
};
const int = (v, d, min, max) => (typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.floor(v))) : d);
const days = (v, d) => (Array.isArray(v) ? [...new Set(v.filter((x) => typeof x === "number" && x >= 0 && x <= 90).map(Math.floor))].sort((a, b) => b - a) : d);
function parseSubscriptionPolicy(raw) {
    const d = exports.DEFAULT_SUBSCRIPTION_POLICY;
    const r = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
    const q = (r.reminderQuietHours ?? {});
    return {
        autoRenewDefault: typeof r.autoRenewDefault === "boolean" ? r.autoRenewDefault : d.autoRenewDefault,
        orgMayDisableAutoRenew: typeof r.orgMayDisableAutoRenew === "boolean" ? r.orgMayDisableAutoRenew : d.orgMayDisableAutoRenew,
        renewalReminderDaysBefore: days(r.renewalReminderDaysBefore, [...d.renewalReminderDaysBefore]),
        retryDays: Array.isArray(r.retryDays) ? days(r.retryDays, [...d.retryDays]).sort((a, b) => a - b) : [...d.retryDays],
        downgradeAfterDays: int(r.downgradeAfterDays, d.downgradeAfterDays, 1, 365),
        liteReadOnlyGraceDays: int(r.liteReadOnlyGraceDays, d.liteReadOnlyGraceDays, 0, 365),
        taxRatePercent: typeof r.taxRatePercent === "number" && r.taxRatePercent >= 0 && r.taxRatePercent <= 100 ? r.taxRatePercent : d.taxRatePercent,
        reminderQuietHours: { start: int(q.start, d.reminderQuietHours.start, 0, 23), end: int(q.end, d.reminderQuietHours.end, 0, 23) },
    };
}
function loadPolicy(env = process.env) {
    try {
        return parseSubscriptionPolicy(env.SUBSCRIPTION_POLICY_JSON ? JSON.parse(env.SUBSCRIPTION_POLICY_JSON) : null);
    }
    catch {
        return parseSubscriptionPolicy(null);
    }
}
const effectiveAutoRenew = (s) => (s.autoRenewForced === "ON" ? true : s.autoRenewForced === "OFF" ? false : s.autoRenew);
exports.effectiveAutoRenew = effectiveAutoRenew;
exports.FREE_EDITION = "LITE";
const isFree = (edition) => edition === exports.FREE_EDITION;
exports.isFree = isFree;
function decidePeriodEnd(i) {
    if (i.currentPeriodEnd > i.now || (0, exports.isFree)(i.edition))
        return "NONE";
    return i.autoRenew ? "RENEW" : "DOWNGRADE_AUTO_RENEW_OFF";
}
const DAY = 86_400_000;
function reminderOffsetsDue(i) {
    if (i.currentPeriodEnd <= i.now)
        return [];
    const left = Math.ceil((i.currentPeriodEnd.getTime() - i.now.getTime()) / DAY);
    const tight = i.alreadySent.length ? Math.min(...i.alreadySent) : Infinity;
    const due = i.offsets.filter((o) => left <= o && !i.alreadySent.includes(o) && o < tight);
    return due.length ? [Math.min(...due)] : [];
}
function nextOutsideQuietHours(now, quiet, tz = 2) {
    const inQ = (d) => { const h = (((d.getUTCHours() + tz) % 24) + 24) % 24; return quiet.start === quiet.end ? false : quiet.start < quiet.end ? h >= quiet.start && h < quiet.end : h >= quiet.start || h < quiet.end; };
    let d = new Date(now);
    for (let k = 0; k < 25 && inQ(d); k++)
        d = new Date(d.getTime() + 3_600_000);
    return d;
}
function computeDowngradeImpact(from, to, usage, readOnlyGraceDays) {
    const lost = from.capabilities.filter((c) => !to.capabilities.includes(c)).sort();
    const limits = [];
    for (const [key, f, t] of [["users", from.maxUsers, to.maxUsers], ["branches", from.maxBranches, to.maxBranches]]) {
        if (t != null && (f == null || t < f))
            limits.push({ key, from: f, to: t, current: usage[key], overBy: Math.max(0, usage[key] - t) });
    }
    return { fromEdition: from.edition, toEdition: to.edition, lostFeatures: lost, reducedLimits: limits, dataRetained: true, readOnlyGraceDays, restoredOnUpgrade: true };
}
const liteGraceActive = (s, now) => s.downgradedToLiteAt != null && s.liteReadOnlyGraceUntil != null && s.liteReadOnlyGraceUntil > now;
exports.liteGraceActive = liteGraceActive;
//# sourceMappingURL=subscription-policy.js.map