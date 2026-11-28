"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustPoints = exports.pointsValue = exports.TIER_MULTIPLIER = exports.DEFAULT_TIERS = void 0;
exports.loyaltyConfig = loyaltyConfig;
exports.tierFor = tierFor;
exports.pointsFor = pointsFor;
exports.earnForSale = earnForSale;
exports.redeemPoints = redeemPoints;
const money_1 = require("./money");
exports.DEFAULT_TIERS = [
    { name: "BRONZE", minSpend: "0" }, { name: "SILVER", minSpend: "5000" }, { name: "GOLD", minSpend: "20000" }, { name: "PLATINUM", minSpend: "50000" },
];
exports.TIER_MULTIPLIER = { BRONZE: 1, SILVER: 1.25, GOLD: 1.5, PLATINUM: 2 };
function loyaltyConfig(s) {
    const l = s?.loyalty ?? {};
    const tiers = (l.tiers?.length ? l.tiers : exports.DEFAULT_TIERS).map((t) => ({ name: t.name, minSpend: (0, money_1.D)(t.minSpend) })).sort((a, b) => a.minSpend.comparedTo(b.minSpend));
    return { enabled: l.enabled !== false, earnPer: (0, money_1.D)(l.earnPer ?? 10), pointsPerEarn: l.pointsPerEarn ?? 1, redeemValue: (0, money_1.D)(l.redeemValue ?? "0.50"), tiers };
}
function tierFor(lifetimeSpend, cfg) {
    let name = cfg.tiers[0]?.name ?? "BRONZE";
    for (const t of cfg.tiers)
        if ((0, money_1.D)(lifetimeSpend).gte(t.minSpend))
            name = t.name;
    return name;
}
function pointsFor(total, tier, cfg) {
    if (!cfg.enabled || cfg.earnPer.lte(0))
        return 0;
    return Math.floor((0, money_1.D)(total).div(cfg.earnPer).floor().mul(cfg.pointsPerEarn).toNumber() * (exports.TIER_MULTIPLIER[tier] ?? 1));
}
const pointsValue = (points, cfg) => cfg.redeemValue.mul(points);
exports.pointsValue = pointsValue;
async function post(tx, p, cfg) {
    const cur = await tx.patientRef.findUniqueOrThrow({ where: { id: p.patientId }, select: { loyaltyPoints: true, lifetimeSpend: true } });
    const balance = cur.loyaltyPoints + p.points;
    const spend = (0, money_1.D)(cur.lifetimeSpend).plus(p.spend ?? 0);
    await tx.patientRef.update({ where: { id: p.patientId }, data: { loyaltyPoints: balance, lifetimeSpend: spend, loyaltyTier: tierFor(spend, cfg) } });
    await tx.loyaltyEntry.create({ data: { orgId: p.orgId, patientId: p.patientId, kind: p.kind, points: p.points, balanceAfter: balance, saleId: p.saleId, note: p.note, createdBy: p.by } });
    return balance;
}
async function earnForSale(tx, p, cfg) {
    if (!cfg.enabled)
        return 0;
    const cur = await tx.patientRef.findFirst({ where: { id: p.patientId, orgId: p.orgId }, select: { loyaltyTier: true } });
    if (!cur)
        return 0;
    const pts = pointsFor(p.total, cur.loyaltyTier, cfg);
    await post(tx, { orgId: p.orgId, patientId: p.patientId, kind: "EARN", points: pts, saleId: p.saleId, by: p.by, spend: p.total }, cfg);
    return pts;
}
async function redeemPoints(tx, p, cfg) {
    const cur = await tx.patientRef.findFirst({ where: { id: p.patientId, orgId: p.orgId }, select: { loyaltyPoints: true } });
    if (!cur || cur.loyaltyPoints < p.points)
        return false;
    await post(tx, { orgId: p.orgId, patientId: p.patientId, kind: "REDEEM", points: -p.points, saleId: p.saleId, by: p.by }, cfg);
    return true;
}
const adjustPoints = (tx, p, cfg) => post(tx, { orgId: p.orgId, patientId: p.patientId, kind: p.kind ?? "ADJUST", points: p.points, note: p.note, by: p.by }, cfg);
exports.adjustPoints = adjustPoints;
//# sourceMappingURL=loyalty.js.map