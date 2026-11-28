import { PrismaService } from "../../prisma/prisma.service";
import { FeatureFlagsService } from "../../feature-flags/feature-flags.service";
import { normalisePlan } from "./mobile-plan";
export interface MobileEntitlement {
    key: "mobile_staff_app";
    enabled: boolean;
    requiredPlan: "PRO";
    reason: null | "PLAN_BELOW_PRO" | "FLAG_OFF";
    scope: "org" | "global" | "market" | "dependency" | "launch-locked" | "entitlement";
}
export declare class MobileEntitlementService {
    private readonly prisma;
    private readonly flags;
    constructor(prisma: PrismaService, flags: FeatureFlagsService);
    tenant(orgId: string): Promise<{
        id: string;
        externalOrgId: string | null;
        name: string;
        edition: import("../../generated/prisma/enums").Edition;
        marketCode: string;
        subscriptionStatus: string;
        defaultSignInMethod: import("../../generated/prisma/enums").SignInMethod | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        onboardedAt: Date | null;
        createdAt: Date;
    }>;
    evaluate(orgId: string): Promise<MobileEntitlement & {
        plan: ReturnType<typeof normalisePlan>;
        rawPlan: string;
    }>;
    assertEnabled(orgId: string): Promise<void>;
}
