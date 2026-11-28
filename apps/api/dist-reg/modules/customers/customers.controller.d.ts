import type { AuthUser } from "../../auth/auth-user";
import { CustomerRegistryService } from "./customer-registry.service";
declare class CustomerDto {
    displayName: string;
    phone?: string;
    email?: string;
    gender?: string;
    dateOfBirth?: string;
    address?: string;
    allergies?: string[];
    chronicConditions?: string[];
    medicalNotes?: string;
    pregnant?: boolean;
    lactating?: boolean;
    renalImpairment?: boolean;
    hepaticImpairment?: boolean;
    weightKg?: string;
    nationalId?: string;
    consentDataProcessing?: boolean;
    consentMarketing?: boolean;
    force?: boolean;
}
declare class CustomerPatchDto {
    displayName?: string;
    phone?: string;
    email?: string;
    gender?: string;
    dateOfBirth?: string;
    address?: string;
    allergies?: string[];
    chronicConditions?: string[];
    medicalNotes?: string;
    pregnant?: boolean;
    lactating?: boolean;
    renalImpairment?: boolean;
    hepaticImpairment?: boolean;
    weightKg?: string;
    nationalId?: string;
    active?: boolean;
}
declare class NoteDto {
    body: string;
    kind?: string;
}
declare class FamilyDto {
    relatedPatientId: string;
    relation: string;
}
declare class ConsentDto {
    dataProcessing: boolean;
    marketing: boolean;
}
declare class CreditDto {
    creditLimit: string;
}
declare class PointsDto {
    points: number;
    note: string;
}
declare class MergeDto {
    sourceId: string;
}
export declare class CustomersController {
    private readonly svc;
    constructor(svc: CustomerRegistryService);
    list(u: AuthUser, q: {
        q?: string;
        page?: string;
        pageSize?: string;
        inactive?: string;
        credit?: string;
        allergies?: string;
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
    create(u: AuthUser, d: CustomerDto): Promise<Omit<{
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
    duplicates(u: AuthUser): Promise<{
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
    get(u: AuthUser, id: string): Promise<{
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
    patch(u: AuthUser, id: string, d: CustomerPatchDto): Promise<Omit<{
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
    history(u: AuthUser, id: string): Promise<{
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
    notes(u: AuthUser, id: string): Promise<{
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
    addNote(u: AuthUser, id: string, d: NoteDto): Promise<{
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
    family(u: AuthUser, id: string): Promise<{
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
    addFamily(u: AuthUser, id: string, d: FamilyDto): Promise<{
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
    consent(u: AuthUser, id: string, d: ConsentDto): Promise<Omit<{
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
    credit(u: AuthUser, id: string, d: CreditDto): Promise<{
        balance: string;
        creditLimit: string;
        id: string;
        createdAt: Date;
        orgId: string;
        patientId: string;
    }>;
    loyalty(u: AuthUser, id: string): Promise<{
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
    adjust(u: AuthUser, id: string, d: PointsDto): Promise<{
        balance: number;
    }>;
    merge(u: AuthUser, id: string, d: MergeDto): Promise<{
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
export {};
