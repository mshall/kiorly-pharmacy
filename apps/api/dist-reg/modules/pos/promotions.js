"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPromotions = applyPromotions;
const client_1 = require("../../generated/prisma/client");
const money_1 = require("../../common/money");
function applyPromotions(cart, promos, coupons = []) {
    const codes = new Set(coupons.map((c) => c.trim().toLowerCase()).filter(Boolean));
    const usedCodes = new Set();
    const lines = new Map();
    for (const l of cart) {
        const cur = lines.get(l.drugId);
        const gross = l.unitPrice.mul(l.quantity);
        if (cur) {
            cur.qty += l.quantity;
            cur.gross = cur.gross.plus(gross);
            cur.discounted = cur.discounted.plus(l.manualDiscount);
        }
        else
            lines.set(l.drugId, { qty: l.quantity, unit: l.unitPrice, gross, discounted: l.manualDiscount, promoDiscounted: false });
    }
    const subtotal = [...lines.values()].reduce((a, l) => a.plus(l.gross), (0, money_1.D)(0));
    const byDrug = new Map();
    const applied = [];
    const room = (id) => { const l = lines.get(id); return client_1.Prisma.Decimal.max(l.gross.minus(l.discounted), (0, money_1.D)(0)); };
    const take = (id, amount) => {
        const l = lines.get(id);
        const a = client_1.Prisma.Decimal.min((0, money_1.round2)(amount), room(id));
        if (a.lte(0))
            return (0, money_1.D)(0);
        l.discounted = l.discounted.plus(a);
        l.promoDiscounted = true;
        byDrug.set(id, (byDrug.get(id) ?? (0, money_1.D)(0)).plus(a));
        return a;
    };
    for (const p of [...promos].sort((a, b) => b.priority - a.priority)) {
        const code = p.couponCode?.trim().toLowerCase();
        if (code && !codes.has(code))
            continue;
        if (p.minSubtotal && subtotal.lt(p.minSubtotal))
            continue;
        const scope = (p.drugIds.length ? p.drugIds : [...lines.keys()]).filter((id) => lines.has(id) && (p.stackable || !lines.get(id).promoDiscounted || p.kind === "BUNDLE_PRICE"));
        let total = (0, money_1.D)(0);
        if (p.kind === "PERCENT_OFF") {
            const pct = (0, money_1.D)(p.params.percent ?? 0);
            if (pct.lte(0) || pct.gt(100))
                continue;
            for (const id of scope)
                total = total.plus(take(id, room(id).mul(pct).div(100)));
        }
        else if (p.kind === "AMOUNT_OFF") {
            const amt = (0, money_1.D)(p.params.amount ?? 0);
            if (amt.lte(0))
                continue;
            for (const id of scope)
                total = total.plus(take(id, amt.mul(lines.get(id).qty)));
        }
        else if (p.kind === "BUY_X_GET_Y") {
            const buy = p.params.buy ?? 0, get = p.params.get ?? 0, off = (0, money_1.D)(p.params.percentOff ?? 100);
            if (buy < 1 || get < 1)
                continue;
            for (const id of scope) {
                const l = lines.get(id);
                const free = Math.floor(l.qty / (buy + get)) * get;
                if (free > 0)
                    total = total.plus(take(id, l.unit.mul(free).mul(off).div(100)));
            }
        }
        else if (p.kind === "BUNDLE_PRICE") {
            const items = p.params.items ?? [];
            if (!items.length || p.params.price == null)
                continue;
            const sets = Math.min(...items.map((i) => (lines.has(i.drugId) && i.qty > 0 ? Math.floor(lines.get(i.drugId).qty / i.qty) : 0)));
            if (!(sets > 0))
                continue;
            const list = items.reduce((a, i) => a.plus(lines.get(i.drugId).unit.mul(i.qty)), (0, money_1.D)(0));
            const saving = list.minus((0, money_1.D)(p.params.price)).mul(sets);
            if (saving.lte(0))
                continue;
            for (const i of items)
                total = total.plus(take(i.drugId, saving.mul(lines.get(i.drugId).unit.mul(i.qty)).div(list)));
        }
        if (total.gt(0)) {
            applied.push({ promoId: p.id, name: p.name, amount: total, couponCode: code ? p.couponCode : undefined });
            if (code)
                usedCodes.add(code);
        }
    }
    return { byDrug, applied, unusedCoupons: [...codes].filter((c) => !usedCodes.has(c)) };
}
//# sourceMappingURL=promotions.js.map