"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAcquisitionBlock = parseAcquisitionBlock;
exports.acquisitionColumns = acquisitionColumns;
exports.creditLinkOnce = creditLinkOnce;
const link_counters_1 = require("./link-counters");
const ORIGINS = ["PROVIDER_LED", "MARKETPLACE", "UNATTRIBUTED"];
const LINK_CODE = /^[0-9A-HJKMNP-TV-Z]{8}$/;
function parseAcquisitionBlock(raw, product) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
        return null;
    const b = raw;
    if (typeof b.origin !== "string" || !ORIGINS.includes(b.origin))
        return null;
    if (typeof b.decisionId !== "string" || b.decisionId.length < 1 || b.decisionId.length > 128)
        return null;
    if (typeof b.policyVersion !== "string" || b.policyVersion.length < 1 || b.policyVersion.length > 64)
        return null;
    if (typeof b.reason !== "string" || !/^[A-Z][A-Z0-9_]{2,63}$/.test(b.reason))
        return null;
    if (typeof b.evidenceHash !== "string" || !/^[0-9a-f]{64}$/.test(b.evidenceHash))
        return null;
    if (b.product !== undefined && b.product !== product)
        return null;
    if (b.linkCode !== undefined && (typeof b.linkCode !== "string" || !LINK_CODE.test(b.linkCode)))
        return null;
    return { origin: b.origin, decisionId: b.decisionId, policyVersion: b.policyVersion, reason: b.reason, evidenceHash: b.evidenceHash, ...(b.linkCode ? { linkCode: b.linkCode } : {}), product };
}
async function acquisitionColumns(db, orgId, block) {
    const link = block.origin === "PROVIDER_LED" && block.linkCode ? await db.providerReferralLink.findFirst({ where: { code: block.linkCode, orgId }, select: { id: true } }) : null;
    return { acquisitionOrigin: block.origin, acquisitionDecisionRef: block.decisionId, acquisitionReason: block.reason, acquisitionLinkId: link?.id ?? null };
}
async function creditLinkOnce(tx, orgId, orderRowId, counter, at = new Date()) {
    const field = counter === "orders" ? "acquisitionOrderCountedAt" : "acquisitionCompletedCountedAt";
    const o = await tx.kiorexOrder.findFirst({ where: { id: orderRowId, orgId }, select: { acquisitionLinkId: true, acquisitionOrigin: true } });
    if (!o || o.acquisitionOrigin !== "PROVIDER_LED" || !o.acquisitionLinkId)
        return false;
    const claimed = await tx.kiorexOrder.updateMany({ where: { id: orderRowId, orgId, [field]: null }, data: { [field]: at } });
    if (claimed.count !== 1)
        return false;
    await (0, link_counters_1.bumpLinkCounter)(tx, { id: o.acquisitionLinkId, orgId }, counter, at);
    return true;
}
//# sourceMappingURL=acquisition-fact.js.map