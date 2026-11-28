"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDays = exports.MARKET_TZ = void 0;
exports.marketToday = marketToday;
exports.MARKET_TZ = process.env.MARKET_TZ ?? "Africa/Cairo";
function marketToday(now = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: exports.MARKET_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
    return new Date(`${parts}T00:00:00.000Z`);
}
const addDays = (d, n) => new Date(d.getTime() + n * 86_400_000);
exports.addDays = addDays;
//# sourceMappingURL=dates.js.map