import { PrismaService } from "../prisma/prisma.service";
import type { AuthUser } from "../auth/auth-user";
import { AuditService } from "../audit/audit.service";
import { type EntitlementsPort, type MarketPackPort } from "../kernel-adapter/ports";
import { StaffRole } from "../generated/prisma/client";
import { PassportSessions } from "../auth/passport-sessions.service";
import { TokenVerifier } from "../auth/token-verifier";
import { type SignInDefaultMethod } from "../auth/sign-in-default";
declare class BranchDto {
    name: string;
    code?: string;
    licenceNo?: string;
    address?: string;
    phone?: string;
}
declare class BranchPatchDto {
    name?: string;
    licenceNo?: string;
    address?: string;
    phone?: string;
    active?: boolean;
}
declare class StaffDto {
    displayName: string;
    email: string;
    password: string;
    role: StaffRole;
    branchId?: string;
    pharmacistLicenceNo?: string;
    phone?: string;
}
declare class StaffPatchDto {
    displayName?: string;
    role?: StaffRole;
    branchId?: string;
    pharmacistLicenceNo?: string;
    active?: boolean;
    password?: string;
    phone?: string | null;
}
declare class ReceiptSettingsDto {
    header?: string;
    footer?: string;
    showVat?: boolean;
    showLicence?: boolean;
    paper?: "80mm" | "a4";
    logoText?: string;
}
declare class PrinterDto {
    id: string;
    name: string;
    kind: "RECEIPT" | "LABEL" | "A4";
    paper?: string;
    note?: string;
}
declare class TaxRateDto {
    code: string;
    label: string;
    rate: string;
}
declare class TierDto {
    name: string;
    minSpend: string;
}
declare class LoyaltyDto {
    enabled?: boolean;
    earnPer?: string;
    pointsPerEarn?: number;
    redeemValue?: string;
    tiers?: TierDto[];
}
declare class SettingsDto {
    mode?: "STANDALONE" | "INTEGRATED";
    currency?: string;
    languages?: Array<"ar" | "en">;
    receipt?: ReceiptSettingsDto;
    printers?: PrinterDto[];
    taxRates?: TaxRateDto[];
    loyalty?: LoyaltyDto;
    maxCashierDiscountPct?: number;
    refillReminderDays?: number;
    costVarianceTolerancePct?: number;
    customerCreditDays?: number;
    vatRate?: string;
    shiftVarianceThreshold?: string;
    ownerPhone?: string;
    ownerEmail?: string;
    defaultLocale?: "ar" | "en";
    receiptFooter?: string;
    defaultSignInMethod?: SignInDefaultMethod | null;
}
declare class SignupDto {
    pharmacyName: string;
    ownerName: string;
    email: string;
    password: string;
    branchName?: string;
    pharmacistLicenceNo?: string;
    marketCode?: string;
}
export declare class TenancyController {
    private readonly prisma;
    private readonly audit;
    private readonly ent;
    private readonly packs;
    private readonly sessions;
    private readonly tokens;
    constructor(prisma: PrismaService, audit: AuditService, ent: EntitlementsPort, packs: MarketPackPort, sessions: PassportSessions, tokens: TokenVerifier);
    private cleanPhone;
    signup(dto: SignupDto): Promise<{
        ownerClaim: string;
        tenantId: string;
        branchId: string;
        ownerId: string;
    }>;
    completeOnboarding(u: AuthUser): Promise<{
        ok: boolean;
    }>;
    branches(u: AuthUser): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        code: string | null;
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        licenceNo: string | null;
        address: string | null;
        phone: string | null;
        active: boolean;
        receiptCounter: number;
    }[]>;
    createBranch(u: AuthUser, dto: BranchDto): Promise<{
        code: string | null;
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        licenceNo: string | null;
        address: string | null;
        phone: string | null;
        active: boolean;
        receiptCounter: number;
    }>;
    patchBranch(u: AuthUser, id: string, dto: BranchPatchDto): Promise<{
        code: string | null;
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        licenceNo: string | null;
        address: string | null;
        phone: string | null;
        active: boolean;
        receiptCounter: number;
    }>;
    staff(u: AuthUser): Promise<{
        passportLinked: boolean;
        id: string;
        createdAt: Date;
        orgId: string;
        phone: string | null;
        active: boolean;
        displayName: string;
        role: StaffRole;
        pharmacistLicenceNo: string | null;
        email: string | null;
        branchId: string | null;
        mfaEnrolled: boolean;
        dismissedCards: import("@prisma/client/runtime/client").JsonValue;
        lastLoginAt: Date | null;
    }[]>;
    createStaff(u: AuthUser, dto: StaffDto): Promise<{
        passportLinked: boolean;
        id: string;
        createdAt: Date;
        orgId: string;
        phone: string | null;
        active: boolean;
        displayName: string;
        role: StaffRole;
        pharmacistLicenceNo: string | null;
        email: string | null;
        branchId: string | null;
        mfaEnrolled: boolean;
        dismissedCards: import("@prisma/client/runtime/client").JsonValue;
        lastLoginAt: Date | null;
    }>;
    patchStaff(u: AuthUser, id: string, dto: StaffPatchDto): Promise<{
        passportLinked: boolean;
        id: string;
        createdAt: Date;
        orgId: string;
        phone: string | null;
        active: boolean;
        displayName: string;
        role: StaffRole;
        pharmacistLicenceNo: string | null;
        email: string | null;
        branchId: string | null;
        mfaEnrolled: boolean;
        dismissedCards: import("@prisma/client/runtime/client").JsonValue;
        lastLoginAt: Date | null;
    }>;
    settings(u: AuthUser): Promise<{
        name: string;
        edition: import("../generated/prisma/enums").Edition;
        market: string;
        subscriptionStatus: string;
        pack: import("../kernel-adapter/ports").MarketPack;
        settings: string | number | boolean | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray;
        defaultSignInMethod: import("../generated/prisma/enums").SignInMethod | null;
        effectiveSignInMethod: "PASSWORD" | "PASSPORT";
        linkedToKiorex: boolean;
    }>;
    patchSettings(u: AuthUser, dto: SettingsDto): Promise<{
        mode?: "STANDALONE" | "INTEGRATED";
        currency?: string;
        languages?: Array<"ar" | "en">;
        receipt?: ReceiptSettingsDto;
        printers?: PrinterDto[];
        taxRates?: TaxRateDto[];
        loyalty?: LoyaltyDto;
        maxCashierDiscountPct?: number;
        refillReminderDays?: number;
        costVarianceTolerancePct?: number;
        customerCreditDays?: number;
        vatRate?: string;
        shiftVarianceThreshold?: string;
        ownerPhone?: string;
        ownerEmail?: string;
        defaultLocale?: "ar" | "en";
        receiptFooter?: string;
    }>;
    plan(u: AuthUser): Promise<{
        edition: import("../generated/prisma/enums").Edition;
    }>;
}
export {};
