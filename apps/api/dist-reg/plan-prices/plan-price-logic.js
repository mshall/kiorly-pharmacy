"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeAt = exports.PRICE_INTERVALS = exports.PRICE_EDITIONS = void 0;
exports.parsePriceRequest = parsePriceRequest;
exports.planNextVersion = planNextVersion;
const errors_1 = require("../common/errors");
exports.PRICE_EDITIONS = ["LITE", "PRO", "CHAIN"];
exports.PRICE_INTERVALS = ["MONTHLY", "ANNUAL"];
const MONEY = /^\d{1,12}(\.\d{1,2})?$/;
const MARKET = /^[A-Z]{2}$/;
const CURRENCY = /^[A-Z]{3}$/;
const REF = /^[A-Za-z0-9_@.\-]{1,80}$/;
const bad = (code, message) => new errors_1.DomainError(code, message, 400);
function parsePriceRequest(raw, now) {
    const b = (raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {});
    const s = (v) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
    const edition = s(b.edition).toUpperCase();
    if (!exports.PRICE_EDITIONS.includes(edition))
        throw bad("INVALID_EDITION", "edition must be LITE, PRO or CHAIN");
    const marketCode = s(b.marketCode).toUpperCase();
    if (!MARKET.test(marketCode))
        throw bad("INVALID_MARKET", "marketCode must be a two-letter country code");
    const interval = s(b.interval).toUpperCase();
    if (!exports.PRICE_INTERVALS.includes(interval))
        throw bad("INVALID_INTERVAL", "interval must be MONTHLY or ANNUAL");
    const currency = s(b.currency).toUpperCase();
    if (!CURRENCY.test(currency))
        throw bad("INVALID_CURRENCY", "currency must be a three-letter code");
    const amount = s(b.amount);
    if (!MONEY.test(amount))
        throw bad("INVALID_AMOUNT", "amount must be digits with at most two decimals");
    let validFrom = now;
    if (b.validFrom !== undefined && b.validFrom !== null && b.validFrom !== "") {
        const d = new Date(s(b.validFrom));
        if (Number.isNaN(d.getTime()))
            throw bad("INVALID_VALID_FROM", "validFrom is not a date");
        validFrom = d.getTime() < now.getTime() ? now : d;
    }
    const actor = (b.actor && typeof b.actor === "object" ? b.actor : {});
    const actorId = s(actor.id);
    if (!REF.test(actorId))
        throw bad("ACTOR_REQUIRED", "the acting console user is required");
    const preview = b.preview === true;
    let approval = null;
    if (!preview) {
        const a = (b.approval && typeof b.approval === "object" ? b.approval : {});
        const proposalId = s(a.proposalId), proposedBy = s(a.proposedBy);
        if (!REF.test(proposalId) || !REF.test(proposedBy))
            throw bad("APPROVAL_REQUIRED", "a price is published only from an approved proposal (proposalId and proposedBy)");
        if (proposedBy === actorId)
            throw new errors_1.DomainError("TWO_PERSON_RULE", "The person who proposed a price cannot approve it", 403);
        approval = { proposalId, proposedBy };
    }
    return { edition: edition, marketCode, interval: interval, currency, amount, validFrom, preview, actorId, approval };
}
const activeAt = (rows, at) => rows.filter((r) => r.validFrom <= at && (!r.validTo || r.validTo > at));
exports.activeAt = activeAt;
function planNextVersion(rows, validFrom) {
    const newest = rows.reduce((m, r) => (!m || r.validFrom > m.validFrom ? r : m), null);
    if (newest && validFrom <= newest.validFrom)
        throw new errors_1.DomainError("PRICE_NOT_AFTER_LATEST", "The new price must start after the newest existing version of this plan, market and period", 409, { newestValidFrom: newest.validFrom.toISOString(), newestVersion: newest.priceVersion });
    return { priceVersion: rows.reduce((m, r) => Math.max(m, r.priceVersion), 0) + 1, supersedes: (0, exports.activeAt)(rows, validFrom) };
}
//# sourceMappingURL=plan-price-logic.js.map