import type { PrismaService } from "../prisma/prisma.service";
import { deploymentDefaultMethod, effectiveOrgDefault, resolvePublicSignInConfig, type OrgSignInFacts, type SignInDefaultMethod } from "./sign-in-default";
export declare function tenantLinkedToKiorex(prisma: PrismaService, t: {
    id: string;
    externalOrgId: string | null;
}): Promise<boolean>;
export declare function orgSignInFacts(prisma: PrismaService, orgHint: unknown): Promise<OrgSignInFacts | null>;
export { deploymentDefaultMethod, effectiveOrgDefault, resolvePublicSignInConfig };
export type { SignInDefaultMethod };
