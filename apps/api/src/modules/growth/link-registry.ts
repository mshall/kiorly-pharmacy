import type { ProviderReferralLink } from "../../generated/prisma/client";

/**
 * Partner side of the link registry (contracts 1.11.0 and 1.12.0 `product`, GRW-P4-B1): the partner owns link codes, Kiorex learns the code -> organisation
 * mapping from `ReferralLinkCreated` and `ReferralLinkRevoked` (outbox, target KIOREX, `product` PHARMACY, `orgRef` = Tenant.id) and can read any code back
 * through the signed lookup. Payloads carry the code, scope, channel and ids only: never a person, never an order.
 */
export const REFERRAL_LINK_CREATED = "ReferralLinkCreated";
export const REFERRAL_LINK_REVOKED = "ReferralLinkRevoked";
export const LINK_PRODUCT = "PHARMACY" as const;

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

export function toReferralLinkRecord(l: Pick<ProviderReferralLink, "code" | "orgId" | "branchRef" | "ownerScope" | "channelKind" | "status" | "createdAt" | "updatedAt" | "revokedAt">): ReferralLinkRecord {
  return {
    code: l.code,
    orgRef: l.orgId,
    product: LINK_PRODUCT,
    branchRef: l.branchRef ?? null,
    ownerScope: l.ownerScope,
    channelKind: l.channelKind,
    status: l.status,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
    revokedAt: l.revokedAt ? l.revokedAt.toISOString() : null,
  };
}

/** `data` of the registry event (validated against @kiorex/contracts by the outbox before it is stored). */
export function linkEventData(type: typeof REFERRAL_LINK_CREATED | typeof REFERRAL_LINK_REVOKED, link: Pick<ProviderReferralLink, "code" | "orgId" | "branchRef" | "ownerScope" | "channelKind" | "createdAt" | "revokedAt">, reason?: string): Record<string, unknown> {
  return type === REFERRAL_LINK_CREATED
    ? { linkCode: link.code, ownerScope: link.ownerScope, channelKind: link.channelKind, orgRef: link.orgId, clinicRef: link.branchRef ?? null, product: LINK_PRODUCT, createdAt: link.createdAt.toISOString() }
    : { linkCode: link.code, orgRef: link.orgId, clinicRef: link.branchRef ?? null, product: LINK_PRODUCT, revokedAt: (link.revokedAt ?? new Date()).toISOString(), ...(reason ? { reason } : {}) };
}
