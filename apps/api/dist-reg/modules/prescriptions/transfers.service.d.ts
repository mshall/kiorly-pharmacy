import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
import { PrescriptionsService } from "./prescriptions.service";
export interface Counterparty {
    name: string;
    phone?: string;
    pharmacist?: string;
    licenceNo?: string;
}
export declare class RxTransfersService {
    private readonly prisma;
    private readonly rx;
    constructor(prisma: PrismaService, rx: PrescriptionsService);
    out(user: AuthUser, id: string, d: {
        counterparty: Counterparty;
        reason?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        reason: string | null;
        prescriptionId: string;
        direction: string;
        counterpartyName: string;
        counterpartyPhone: string | null;
        counterpartyPharmacist: string | null;
        counterpartyLicenceNo: string | null;
        snapshot: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    in(user: AuthUser, branchId: string, d: {
        counterparty: Counterparty;
        reason?: string;
        originalRef?: string;
        patientId?: string;
        patient?: {
            displayName: string;
            phone?: string;
            allergies?: string[];
            birthYear?: number;
        };
        prescriberName: string;
        prescriberLicenceNo?: string;
        issuedAt: string;
        refillsAllowed?: number;
        lines: Array<{
            drugId?: string;
            activeIngredient?: string;
            drugName?: string;
            strength?: string;
            dosageForm?: string;
            quantity: number;
            directions?: string;
        }>;
    }): Promise<{
        transfer: {
            id: string;
            createdAt: Date;
            orgId: string;
            branchId: string;
            createdBy: string;
            reason: string | null;
            prescriptionId: string;
            direction: string;
            counterpartyName: string;
            counterpartyPhone: string | null;
            counterpartyPharmacist: string | null;
            counterpartyLicenceNo: string | null;
            snapshot: import("@prisma/client/runtime/client").JsonValue | null;
        };
        prescription: {
            lines: ({
                drug: {
                    id: string;
                    createdAt: Date;
                    orgId: string | null;
                    active: boolean;
                    brandName: string;
                    brandNameAr: string | null;
                    activeIngredient: string;
                    strength: string;
                    dosageForm: string;
                    packSize: string;
                    gtin: string | null;
                    manufacturer: string | null;
                    rxOnly: boolean;
                    controlledSchedule: import("../../generated/prisma/enums").ControlledSchedule;
                    coldChain: boolean;
                    otc: boolean;
                    marketCodes: import("@prisma/client/runtime/client").JsonValue | null;
                    substitutionGroupId: string | null;
                    vatRate: import("@prisma/client-runtime-utils").Decimal | null;
                    category: string | null;
                    baseUnit: string;
                    sourceKey: string | null;
                } | null;
            } & {
                id: string;
                activeIngredient: string | null;
                strength: string | null;
                dosageForm: string | null;
                drugId: string | null;
                prescriptionId: string;
                quantity: number;
                qtyDispensed: number;
                drugName: string | null;
                controlled: boolean;
                directions: string | null;
            })[];
            patient: {
                id: string;
                createdAt: Date;
                orgId: string;
                address: string | null;
                phone: string | null;
                active: boolean;
                displayName: string;
                email: string | null;
                externalId: string | null;
                customerNo: string | null;
                gender: string | null;
                dateOfBirth: Date | null;
                nationalIdHash: string | null;
                nationalIdLast4: string | null;
                allergies: string[];
                chronicConditions: string[];
                medicalNotes: string | null;
                pregnant: boolean;
                lactating: boolean;
                renalImpairment: boolean;
                hepaticImpairment: boolean;
                weightKg: import("@prisma/client-runtime-utils").Decimal | null;
                birthYear: number | null;
                consentDataProcessing: boolean;
                consentMarketing: boolean;
                consentRecordedAt: Date | null;
                consentRecordedBy: string | null;
                loyaltyPoints: number;
                loyaltyTier: string;
                lifetimeSpend: import("@prisma/client-runtime-utils").Decimal;
                mergedIntoId: string | null;
                updatedAt: Date;
            } | null;
        } & {
            id: string;
            orgId: string;
            branchId: string;
            status: import("../../generated/prisma/enums").RxStatus;
            source: import("../../generated/prisma/enums").RxSource;
            receivedAt: Date;
            patientId: string | null;
            sourceEventId: string | null;
            sourceRxRef: string | null;
            consentTokenHash: string | null;
            consentVerifiedAt: Date | null;
            consentExpiresAt: Date | null;
            prescriberName: string | null;
            prescriberLicenceNo: string | null;
            prescriberVerifiedBadge: boolean;
            issuedAt: Date | null;
            validUntil: Date | null;
            scanStorageKey: string | null;
            prescriberRef: string | null;
            prescriberId: string | null;
            refillsAllowed: number;
            refillsUsed: number;
            refillIntervalDays: number | null;
            nextRefillDueAt: Date | null;
            priority: string;
            verificationNotes: string | null;
            transferredOutAt: Date | null;
            clinicRef: string | null;
            validatedBy: string | null;
            validatedAt: Date | null;
            kiorexOrderId: string | null;
            rejectionReason: string | null;
            receivedBy: string | null;
        };
    }>;
    list(orgId: string, q: {
        direction?: string;
        branchId?: string;
        skip: number;
        take: number;
    }): Promise<{
        items: {
            id: string;
            createdAt: Date;
            orgId: string;
            branchId: string;
            createdBy: string;
            reason: string | null;
            prescriptionId: string;
            direction: string;
            counterpartyName: string;
            counterpartyPhone: string | null;
            counterpartyPharmacist: string | null;
            counterpartyLicenceNo: string | null;
            snapshot: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
        total: number;
    }>;
    noteHtml(orgId: string, transferId: string, lang: "ar" | "en"): Promise<string>;
}
