import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
import { ClinicalKnowledge, LocalClinicalKnowledge } from "./knowledge";
declare const KINDS: readonly ["INTERACTION", "DOSE_RANGE", "PREGNANCY", "LACTATION", "RENAL", "HEPATIC"];
declare class RuleDto {
    kind: (typeof KINDS)[number];
    ingredient: string;
    ingredientB?: string;
    severity?: string;
    note: string;
    maxDailyMg?: string;
    maxSingleMg?: string;
    pediatricMaxMgPerKg?: string;
    category?: string;
}
export declare class ClinicalController {
    private readonly prisma;
    private readonly kb;
    private readonly local;
    constructor(prisma: PrismaService, kb: ClinicalKnowledge, local: LocalClinicalKnowledge);
    list(u: AuthUser, q: {
        kind?: string;
        q?: string;
    }): Promise<{
        mode: string;
        counts: {
            builtIn: number;
            database: number;
        };
        rules: ({
            id: string;
            scope: string;
            source: string;
            kind: string;
            ingredient: string;
            ingredientB: string | null;
            severity: string;
            note: string;
            maxDailyMg: string | null;
            maxSingleMg: string | null;
            pediatricMaxMgPerKg: string | null;
            category: string | null;
        } | {
            kind: string;
            ingredient: string;
            maxDailyMg: number;
            maxSingleMg: number | null;
            pediatricMaxMgPerKg: number | null;
            note: string;
            id: null;
            scope: string;
            source: string;
        } | {
            kind: string;
            ingredient: string;
            category: "A" | "B" | "C" | "D" | "X";
            note: string;
            id: null;
            scope: string;
            source: string;
        } | {
            ingredient: string;
            severity: import("./clinical-dataset").Sev;
            note: string;
            kind: string;
            id: null;
            scope: string;
            source: string;
        })[];
    }>;
    add(u: AuthUser, d: RuleDto): Promise<{
        id: string;
        createdAt: Date;
        orgId: string | null;
        active: boolean;
        kind: string;
        category: string | null;
        createdBy: string | null;
        source: string;
        note: string;
        key: string;
        ingredient: string;
        ingredientB: string | null;
        severity: string;
        maxDailyMg: import("@prisma/client-runtime-utils").Decimal | null;
        maxSingleMg: import("@prisma/client-runtime-utils").Decimal | null;
        pediatricMaxMgPerKg: import("@prisma/client-runtime-utils").Decimal | null;
    }>;
    remove(u: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
    overrides(u: AuthUser, q: {
        from?: string;
        to?: string;
        page?: string;
        pageSize?: string;
    }): Promise<{
        total: number;
        items: {
            id: string;
            kind: import("../../generated/prisma/enums").SafetyCheckKind;
            detail: string | null;
            reason: string | null;
            checkedAt: Date;
            dispensingId: string;
            prescriptionId: string | null;
            pharmacist: {
                id: string;
                displayName: string;
                pharmacistLicenceNo: string | null;
            } | {
                id: string;
            } | null;
        }[];
    }>;
}
export {};
