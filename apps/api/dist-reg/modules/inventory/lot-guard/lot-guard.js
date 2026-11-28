"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSellable = void 0;
exports.lotBlockReason = lotBlockReason;
exports.assertSellable = assertSellable;
exports.fefoOrder = fefoOrder;
exports.allocateFefo = allocateFefo;
const errors_1 = require("../../../common/errors");
const dates_1 = require("../../../common/dates");
const dayStart = (d) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
function lotBlockReason(lot, today = (0, dates_1.marketToday)()) {
    if (lot.status === "RECALLED")
        return "RECALLED";
    if (lot.status === "QUARANTINE")
        return "QUARANTINE";
    if (lot.status === "EXPIRED")
        return "EXPIRED";
    if (dayStart(lot.expiryDate) < dayStart(today))
        return "EXPIRED";
    if (lot.status !== "AVAILABLE" && lot.status !== "RESERVED")
        return "NOT_AVAILABLE";
    return null;
}
const isSellable = (lot, today) => lotBlockReason(lot, today) === null;
exports.isSellable = isSellable;
function assertSellable(lot, today) {
    const reason = lotBlockReason(lot, today);
    if (reason)
        throw new errors_1.DomainError("LOT_BLOCKED", `Lot cannot be sold or dispensed: ${reason}`, 409, { lotId: lot.id, reason });
}
function fefoOrder(lots, today) {
    return lots
        .filter((l) => (0, exports.isSellable)(l, today) && l.qtyOnHand - l.qtyReserved > 0)
        .sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime() || a.receivedAt.getTime() - b.receivedAt.getTime() || a.id.localeCompare(b.id));
}
function allocateFefo(lots, qty, today) {
    let remaining = qty;
    const picks = [];
    for (const l of fefoOrder(lots, today)) {
        if (remaining <= 0)
            break;
        const take = Math.min(remaining, l.qtyOnHand - l.qtyReserved);
        picks.push({ lotId: l.id, quantity: take });
        remaining -= take;
    }
    return { picks, shortage: Math.max(remaining, 0) };
}
//# sourceMappingURL=lot-guard.js.map