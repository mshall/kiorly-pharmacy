"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.money = exports.sum = exports.round2 = exports.D = void 0;
exports.vatFromGross = vatFromGross;
const client_1 = require("../generated/prisma/client");
const D = (v) => new client_1.Prisma.Decimal(v ?? 0);
exports.D = D;
const round2 = (v) => (0, exports.D)(v).toDecimalPlaces(2, client_1.Prisma.Decimal.ROUND_HALF_UP);
exports.round2 = round2;
const sum = (xs) => xs.reduce((a, b) => a.plus(b), (0, exports.D)(0));
exports.sum = sum;
const money = (v) => (0, exports.round2)(v ?? 0).toFixed(2);
exports.money = money;
function vatFromGross(gross, rate) {
    const r = (0, exports.D)(rate);
    if (r.isZero())
        return (0, exports.D)(0);
    return (0, exports.round2)((0, exports.D)(gross).mul(r).div(r.plus(1)));
}
//# sourceMappingURL=money.js.map