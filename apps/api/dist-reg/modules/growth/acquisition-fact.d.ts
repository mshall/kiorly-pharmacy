import type { Prisma } from "../../generated/prisma/client";
export type AcquisitionOrigin = "PROVIDER_LED" | "MARKETPLACE" | "UNATTRIBUTED";
export interface AcquisitionBlock {
    origin: AcquisitionOrigin;
    decisionId: string;
    policyVersion: string;
    reason: string;
    evidenceHash: string;
    linkCode?: string;
    product?: string;
}
export declare function parseAcquisitionBlock(raw: unknown, product: "PHARMACY" | "LAB"): AcquisitionBlock | null;
export interface StoredAcquisition {
    acquisitionOrigin: string;
    acquisitionDecisionRef: string;
    acquisitionReason: string;
    acquisitionLinkId: string | null;
}
export declare function acquisitionColumns(db: Pick<Prisma.TransactionClient, "providerReferralLink">, orgId: string, block: AcquisitionBlock): Promise<StoredAcquisition>;
type Counter = "orders" | "completed";
export declare function creditLinkOnce(tx: Prisma.TransactionClient, orgId: string, orderRowId: string, counter: Counter, at?: Date): Promise<boolean>;
export {};
