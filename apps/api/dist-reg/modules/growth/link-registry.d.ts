import type { ProviderReferralLink } from "../../generated/prisma/client";
export declare const REFERRAL_LINK_CREATED = "ReferralLinkCreated";
export declare const REFERRAL_LINK_REVOKED = "ReferralLinkRevoked";
export declare const LINK_PRODUCT: "PHARMACY";
export interface ReferralLinkRecord {
    code: string;
    orgRef: string;
    product: typeof LINK_PRODUCT;
    branchRef: string | null;
    ownerScope: string;
    channelKind: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    revokedAt: string | null;
}
export declare function toReferralLinkRecord(l: Pick<ProviderReferralLink, "code" | "orgId" | "branchRef" | "ownerScope" | "channelKind" | "status" | "createdAt" | "updatedAt" | "revokedAt">): ReferralLinkRecord;
export declare function linkEventData(type: typeof REFERRAL_LINK_CREATED | typeof REFERRAL_LINK_REVOKED, link: Pick<ProviderReferralLink, "code" | "orgId" | "branchRef" | "ownerScope" | "channelKind" | "createdAt" | "revokedAt">, reason?: string): Record<string, unknown>;
