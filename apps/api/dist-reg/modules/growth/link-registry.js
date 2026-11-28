"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINK_PRODUCT = exports.REFERRAL_LINK_REVOKED = exports.REFERRAL_LINK_CREATED = void 0;
exports.toReferralLinkRecord = toReferralLinkRecord;
exports.linkEventData = linkEventData;
exports.REFERRAL_LINK_CREATED = "ReferralLinkCreated";
exports.REFERRAL_LINK_REVOKED = "ReferralLinkRevoked";
exports.LINK_PRODUCT = "PHARMACY";
function toReferralLinkRecord(l) {
    return {
        code: l.code,
        orgRef: l.orgId,
        product: exports.LINK_PRODUCT,
        branchRef: l.branchRef ?? null,
        ownerScope: l.ownerScope,
        channelKind: l.channelKind,
        status: l.status,
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
        revokedAt: l.revokedAt ? l.revokedAt.toISOString() : null,
    };
}
function linkEventData(type, link, reason) {
    return type === exports.REFERRAL_LINK_CREATED
        ? { linkCode: link.code, ownerScope: link.ownerScope, channelKind: link.channelKind, orgRef: link.orgId, clinicRef: link.branchRef ?? null, product: exports.LINK_PRODUCT, createdAt: link.createdAt.toISOString() }
        : { linkCode: link.code, orgRef: link.orgId, clinicRef: link.branchRef ?? null, product: exports.LINK_PRODUCT, revokedAt: (link.revokedAt ?? new Date()).toISOString(), ...(reason ? { reason } : {}) };
}
//# sourceMappingURL=link-registry.js.map