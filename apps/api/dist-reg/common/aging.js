"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AGING_BUCKETS = void 0;
exports.bucketFor = bucketFor;
exports.ageInvoices = ageInvoices;
exports.termsDays = termsDays;
const client_1 = require("../generated/prisma/client");
const money_1 = require("./money");
exports.AGING_BUCKETS = ["current", "d1_30", "d31_60", "d61_90", "d90_plus"];
function bucketFor(daysPastDue) {
    return daysPastDue <= 0 ? "current" : daysPastDue <= 30 ? "d1_30" : daysPastDue <= 60 ? "d31_60" : daysPastDue <= 90 ? "d61_90" : "d90_plus";
}
function ageInvoices(invoices, credits, asOf = new Date()) {
    let left = (0, money_1.D)(credits);
    const buckets = Object.fromEntries(exports.AGING_BUCKETS.map((b) => [b, (0, money_1.D)(0)]));
    const open = [];
    for (const inv of [...invoices].sort((a, b) => a.at.getTime() - b.at.getTime())) {
        const amount = (0, money_1.D)(inv.amount);
        const applied = client_1.Prisma.Decimal.min(left, amount);
        left = left.minus(applied);
        const remaining = (0, money_1.round2)(amount.minus(applied));
        if (remaining.lte(0))
            continue;
        const dueAt = new Date(inv.at.getTime() + inv.dueDays * 86_400_000);
        const daysPastDue = Math.floor((asOf.getTime() - dueAt.getTime()) / 86_400_000);
        const bucket = bucketFor(daysPastDue);
        buckets[bucket] = buckets[bucket].plus(remaining);
        open.push({ id: inv.id, at: inv.at, dueAt, remaining, daysPastDue, bucket });
    }
    const outstanding = open.reduce((a, o) => a.plus(o.remaining), (0, money_1.D)(0));
    return { outstanding, credit: (0, money_1.round2)(left), buckets, open };
}
function termsDays(terms) {
    const m = /(\d{1,3})/.exec(terms ?? "");
    return m ? Number(m[1]) : 0;
}
//# sourceMappingURL=aging.js.map