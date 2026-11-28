import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
import { TenantModeService } from "../../tenancy/tenant-mode.service";
import { ConsentService } from "../../platform/adapters/consent.service";
export interface CustomerInput {
    displayName?: string;
    phone?: string | null;
    email?: string | null;
    gender?: string | null;
    dateOfBirth?: string | null;
    birthYear?: number | null;
    address?: string | null;
    allergies?: string[];
    chronicConditions?: string[];
    medicalNotes?: string | null;
    pregnant?: boolean;
    lactating?: boolean;
    renalImpairment?: boolean;
    hepaticImpairment?: boolean;
    weightKg?: string | null;
    nationalId?: string;
    consentDataProcessing?: boolean;
    consentMarketing?: boolean;
    active?: boolean;
}
export declare function nextCustomerNo(tx: Prisma.TransactionClient, orgId: string): Promise<string>;
export declare const normPhone: (p?: string | null) => string | null;
export declare class CustomerRegistryService {
    private readonly prisma;
    private readonly modes;
    private readonly consents;
    constructor(prisma: PrismaService, modes: TenantModeService, consents: ConsentService);
    private audit;
    private view;
    create(u: AuthUser, d: CustomerInput & {
        displayName: string;
    }, opts?: {
        force?: boolean;
    }): Promise<Omit<{
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
    }, "nationalIdHash">>;
    private data;
    update(u: AuthUser, id: string, d: CustomerInput): Promise<Omit<{
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
    }, "nationalIdHash">>;
    mustGet(orgId: string, id: string): Promise<{
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
    }>;
    search(orgId: string, q: {
        q?: string;
        page: number;
        pageSize: number;
        includeInactive?: boolean;
        withCredit?: boolean;
        withAllergies?: boolean;
    }): Promise<{
        total: number;
        page: number;
        pageSize: number;
        items: {
            customerAccount: {
                id: string;
                balance: string;
                creditLimit: string;
            } | null;
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
        }[];
    }>;
    profile(orgId: string, id: string): Promise<{
        customerAccount: {
            balance: string;
            creditLimit: string;
            available: string;
            id: string;
            createdAt: Date;
            orgId: string;
            patientId: string;
        } | null;
        family: {
            id: string;
            relation: string;
            person: {
                id: string;
                phone: string | null;
                displayName: string;
                customerNo: string | null;
                allergies: string[];
                birthYear: number | null;
            } | null;
        }[];
        stats: {
            prescriptions: number;
            purchases: number;
            totalSpend: string;
            lastVisit: Date | null;
        };
        loyalty: {
            points: number;
            tier: string;
            value: string;
            redeemValue: string;
            enabled: boolean;
        };
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
    }>;
    history(orgId: string, id: string, take?: number): Promise<{
        items: ({
            kind: "RX";
            at: Date | null;
            drug: {
                id: string;
                brandName: string;
                brandNameAr: string | null;
                activeIngredient: string;
                strength: string;
                dosageForm: string;
                rxOnly: boolean;
                controlledSchedule: import("../../generated/prisma/enums").ControlledSchedule;
            } | null;
            quantity: number;
            prescriptionId: string | null;
            dispensingId: string;
            saleId: string | null;
            receiptNo: string | null;
        } | {
            kind: "OTC";
            at: Date;
            drug: {
                id: string;
                brandName: string;
                brandNameAr: string | null;
                activeIngredient: string;
                strength: string;
                dosageForm: string;
                rxOnly: boolean;
                controlledSchedule: import("../../generated/prisma/enums").ControlledSchedule;
            } | null;
            quantity: number;
            prescriptionId: null;
            dispensingId: null;
            saleId: string;
            receiptNo: string | null;
        })[];
    }>;
    notes(orgId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        kind: string;
        createdBy: string;
        refType: string | null;
        refId: string | null;
        patientId: string;
        body: string;
    }[]>;
    addNote(u: AuthUser, id: string, d: {
        body: string;
        kind?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        kind: string;
        createdBy: string;
        refType: string | null;
        refId: string | null;
        patientId: string;
        body: string;
    }>;
    family(orgId: string, id: string): Promise<{
        id: string;
        relation: string;
        person: {
            id: string;
            phone: string | null;
            displayName: string;
            customerNo: string | null;
            allergies: string[];
            birthYear: number | null;
        } | null;
    }[]>;
    addFamily(u: AuthUser, id: string, d: {
        relatedPatientId: string;
        relation: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        createdBy: string;
        patientId: string;
        relatedPatientId: string;
        relation: string;
    }>;
    removeFamily(u: AuthUser, id: string, linkId: string): Promise<{
        ok: boolean;
    }>;
    setConsent(u: AuthUser, id: string, d: {
        dataProcessing: boolean;
        marketing: boolean;
    }): Promise<Omit<{
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
    }, "nationalIdHash">>;
    openCreditAccount(u: AuthUser, id: string, creditLimit: string): Promise<{
        balance: string;
        creditLimit: string;
        id: string;
        createdAt: Date;
        orgId: string;
        patientId: string;
    }>;
    loyalty(orgId: string, id: string): Promise<{
        points: number;
        tier: string;
        lifetimeSpend: string;
        value: string;
        nextTier: {
            name: string;
            remaining: string;
        } | null;
        entries: {
            id: string;
            createdAt: Date;
            orgId: string;
            kind: string;
            createdBy: string | null;
            patientId: string;
            points: number;
            balanceAfter: number;
            saleId: string | null;
            note: string | null;
        }[];
    }>;
    adjustLoyalty(u: AuthUser, id: string, d: {
        points: number;
        note: string;
    }): Promise<{
        balance: number;
    }>;
    duplicates(orgId: string): Promise<{
        groups: {
            reason: string;
            customers: {
                id: string;
                createdAt: Date;
                phone: string | null;
                displayName: string;
                customerNo: string | null;
                birthYear: number | null;
            }[];
        }[];
    }>;
    merge(u: AuthUser, id: string, sourceId: string): Promise<{
        customer: {
            customerAccount: {
                balance: string;
                creditLimit: string;
                available: string;
                id: string;
                createdAt: Date;
                orgId: string;
                patientId: string;
            } | null;
            family: {
                id: string;
                relation: string;
                person: {
                    id: string;
                    phone: string | null;
                    displayName: string;
                    customerNo: string | null;
                    allergies: string[];
                    birthYear: number | null;
                } | null;
            }[];
            stats: {
                prescriptions: number;
                purchases: number;
                totalSpend: string;
                lastVisit: Date | null;
            };
            loyalty: {
                points: number;
                tier: string;
                value: string;
                redeemValue: string;
                enabled: boolean;
            };
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
        };
        mergedInto: string;
        source: string;
        moved: {
            prescriptions: number;
            dispensings: number;
            sales: number;
            notes: number;
            loyalty: number;
        };
    }>;
}
