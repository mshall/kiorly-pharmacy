import type { AuthUser } from "../../auth/auth-user";
import { MarketplaceService } from "./marketplace.service";
import { CommissionRateService } from "../growth/commission-rate.service";
import { PrismaService } from "../../prisma/prisma.service";
declare class SettingDto {
    optedIn: boolean;
    deliveryRadiusKm?: string;
    openingHours?: Record<string, string[]>;
    prepMinutes?: number;
    slaMinutes?: number;
    latitude?: string;
    longitude?: string;
}
declare class ClientDto {
    kiorexBaseUrl?: string;
    webhookSecret?: string;
}
declare class AcceptLineDto {
    lineId: string;
    qtyAccepted: number;
}
declare class AcceptDto {
    lines?: AcceptLineDto[];
}
declare class OutForDeliveryDto {
    estimatedMinutes?: number;
}
declare class RejectDto {
    reason: string;
    reasonCode?: string;
}
export declare class KiorexOrdersController {
    private readonly svc;
    private readonly prisma;
    constructor(svc: MarketplaceService, prisma: PrismaService);
    inbox(u: AuthUser, q: {
        branchId?: string;
        status?: string;
    }): Promise<{
        orderValue: string;
        slaRemainingSeconds: number | null;
        slaBreached: boolean;
        lines: {
            unitPrice: string;
            drug: {
                id: string;
                brandName: string;
                brandNameAr: string | null;
                rxOnly: boolean;
            } | undefined;
            id: string;
            drugId: string;
            orderId: string;
            qtyRequested: number;
            qtyAccepted: number;
        }[];
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").KiorexOrderStatus;
        rejectionReason: string | null;
        prescriptionId: string | null;
        dispensingId: string | null;
        externalOrderId: string;
        hasRx: boolean;
        customerName: string | null;
        customerPhone: string | null;
        deliveryAddress: string | null;
        prepaid: boolean;
        slaDueAt: Date;
        respondedAt: Date | null;
        respondedBy: string | null;
        rejectionCode: string | null;
        readyAt: Date | null;
        outForDeliveryAt: Date | null;
        patientRef: string | null;
        deliveryMethod: string | null;
        paymentRef: string | null;
        acquisitionOrigin: string | null;
        acquisitionDecisionRef: string | null;
        acquisitionReason: string | null;
        acquisitionLinkId: string | null;
        acquisitionOrderCountedAt: Date | null;
        acquisitionCompletedCountedAt: Date | null;
    }[]>;
    settings(u: AuthUser): Promise<{
        id: string;
        orgId: string;
        branchId: string;
        updatedAt: Date;
        optedIn: boolean;
        deliveryRadiusKm: import("@prisma/client-runtime-utils").Decimal;
        openingHours: import("@prisma/client/runtime/client").JsonValue | null;
        prepMinutes: number;
        slaMinutes: number;
        latitude: import("@prisma/client-runtime-utils").Decimal | null;
        longitude: import("@prisma/client-runtime-utils").Decimal | null;
    }[]>;
    put(u: AuthUser, branchId: string, d: SettingDto): Promise<{
        id: string;
        orgId: string;
        branchId: string;
        updatedAt: Date;
        optedIn: boolean;
        deliveryRadiusKm: import("@prisma/client-runtime-utils").Decimal;
        openingHours: import("@prisma/client/runtime/client").JsonValue | null;
        prepMinutes: number;
        slaMinutes: number;
        latitude: import("@prisma/client-runtime-utils").Decimal | null;
        longitude: import("@prisma/client-runtime-utils").Decimal | null;
    }>;
    clients(u: AuthUser): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        createdAt: Date;
        active: boolean;
        source: string;
        key: string;
        kiorexBaseUrl: string | null;
    }[]>;
    createClient(u: AuthUser, d: ClientDto): Promise<{
        id: string;
        key: string;
        secret: string;
        webhookSecret: string;
        kiorexBaseUrl: string | null;
    }>;
    get(u: AuthUser, id: string): Promise<{
        lines: {
            id: string;
            drugId: string;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            orderId: string;
            qtyRequested: number;
            qtyAccepted: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").KiorexOrderStatus;
        rejectionReason: string | null;
        prescriptionId: string | null;
        dispensingId: string | null;
        externalOrderId: string;
        hasRx: boolean;
        customerName: string | null;
        customerPhone: string | null;
        deliveryAddress: string | null;
        prepaid: boolean;
        orderValue: import("@prisma/client-runtime-utils").Decimal;
        slaDueAt: Date;
        respondedAt: Date | null;
        respondedBy: string | null;
        rejectionCode: string | null;
        readyAt: Date | null;
        outForDeliveryAt: Date | null;
        patientRef: string | null;
        deliveryMethod: string | null;
        paymentRef: string | null;
        acquisitionOrigin: string | null;
        acquisitionDecisionRef: string | null;
        acquisitionReason: string | null;
        acquisitionLinkId: string | null;
        acquisitionOrderCountedAt: Date | null;
        acquisitionCompletedCountedAt: Date | null;
    }>;
    accept(u: AuthUser, id: string, d: AcceptDto): Promise<{
        order: {
            lines: {
                id: string;
                drugId: string;
                unitPrice: import("@prisma/client-runtime-utils").Decimal;
                orderId: string;
                qtyRequested: number;
                qtyAccepted: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            orgId: string;
            branchId: string;
            status: import("../../generated/prisma/enums").KiorexOrderStatus;
            rejectionReason: string | null;
            prescriptionId: string | null;
            dispensingId: string | null;
            externalOrderId: string;
            hasRx: boolean;
            customerName: string | null;
            customerPhone: string | null;
            deliveryAddress: string | null;
            prepaid: boolean;
            orderValue: import("@prisma/client-runtime-utils").Decimal;
            slaDueAt: Date;
            respondedAt: Date | null;
            respondedBy: string | null;
            rejectionCode: string | null;
            readyAt: Date | null;
            outForDeliveryAt: Date | null;
            patientRef: string | null;
            deliveryMethod: string | null;
            paymentRef: string | null;
            acquisitionOrigin: string | null;
            acquisitionDecisionRef: string | null;
            acquisitionReason: string | null;
            acquisitionLinkId: string | null;
            acquisitionOrderCountedAt: Date | null;
            acquisitionCompletedCountedAt: Date | null;
        };
        dispensing: {
            lines: {
                drug: {
                    id: string;
                    brandName: string;
                    brandNameAr: string | null;
                    strength: string;
                    rxOnly: boolean;
                    controlledSchedule: import("../../generated/prisma/enums").ControlledSchedule;
                } | undefined;
                lot: {
                    status: import("../../generated/prisma/enums").LotStatus;
                    lotNumber: string;
                    expiryDate: Date;
                };
                id: string;
                vatRate: import("@prisma/client-runtime-utils").Decimal;
                drugId: string;
                lotId: string;
                quantity: number;
                dispensingId: string;
                prescriptionLineId: string | null;
                substitutedFromDrugId: string | null;
                substitutionConsent: boolean;
                substitutionDecidedBy: string | null;
                unitPrice: import("@prisma/client-runtime-utils").Decimal;
            }[];
            unresolvedBlocks: number;
            prescription: ({
                patient: {
                    id: string;
                    displayName: string;
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
            }) | null;
            safetyChecks: {
                id: string;
                kind: import("../../generated/prisma/enums").SafetyCheckKind;
                dispensingId: string;
                outcome: import("../../generated/prisma/enums").SafetyCheckOutcome;
                detail: string | null;
                overridable: boolean;
                overriddenBy: string | null;
                overrideReason: string | null;
                checkedAt: Date;
            }[];
            controlledLog: {
                id: string;
                orgId: string;
                branchId: string;
                drugId: string;
                lotId: string;
                prescriberLicenceNo: string | null;
                prescriptionId: string | null;
                quantity: number;
                pharmacistId: string;
                dispensingId: string;
                patientNationalIdLast4: string;
                patientNationalIdHash: string | null;
                patientName: string | null;
                loggedAt: Date;
            }[];
            id: string;
            createdAt: Date;
            orgId: string;
            branchId: string;
            createdBy: string;
            status: import("../../generated/prisma/enums").DispensingStatus;
            patientId: string | null;
            saleId: string | null;
            prescriptionId: string | null;
            pharmacistId: string | null;
            signedOffAt: Date | null;
            counsellingNotes: string | null;
            kiorexOrderRef: string | null;
            controlledIdCaptured: boolean;
            partialReason: string | null;
            counsellingTopics: string[];
            safetyChecksRunAt: Date | null;
            dispensedAt: Date | null;
        };
    }>;
    reject(u: AuthUser, id: string, d: RejectDto): Promise<{
        lines: {
            id: string;
            drugId: string;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            orderId: string;
            qtyRequested: number;
            qtyAccepted: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").KiorexOrderStatus;
        rejectionReason: string | null;
        prescriptionId: string | null;
        dispensingId: string | null;
        externalOrderId: string;
        hasRx: boolean;
        customerName: string | null;
        customerPhone: string | null;
        deliveryAddress: string | null;
        prepaid: boolean;
        orderValue: import("@prisma/client-runtime-utils").Decimal;
        slaDueAt: Date;
        respondedAt: Date | null;
        respondedBy: string | null;
        rejectionCode: string | null;
        readyAt: Date | null;
        outForDeliveryAt: Date | null;
        patientRef: string | null;
        deliveryMethod: string | null;
        paymentRef: string | null;
        acquisitionOrigin: string | null;
        acquisitionDecisionRef: string | null;
        acquisitionReason: string | null;
        acquisitionLinkId: string | null;
        acquisitionOrderCountedAt: Date | null;
        acquisitionCompletedCountedAt: Date | null;
    }>;
    ready(u: AuthUser, id: string): Promise<{
        lines: {
            id: string;
            drugId: string;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            orderId: string;
            qtyRequested: number;
            qtyAccepted: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").KiorexOrderStatus;
        rejectionReason: string | null;
        prescriptionId: string | null;
        dispensingId: string | null;
        externalOrderId: string;
        hasRx: boolean;
        customerName: string | null;
        customerPhone: string | null;
        deliveryAddress: string | null;
        prepaid: boolean;
        orderValue: import("@prisma/client-runtime-utils").Decimal;
        slaDueAt: Date;
        respondedAt: Date | null;
        respondedBy: string | null;
        rejectionCode: string | null;
        readyAt: Date | null;
        outForDeliveryAt: Date | null;
        patientRef: string | null;
        deliveryMethod: string | null;
        paymentRef: string | null;
        acquisitionOrigin: string | null;
        acquisitionDecisionRef: string | null;
        acquisitionReason: string | null;
        acquisitionLinkId: string | null;
        acquisitionOrderCountedAt: Date | null;
        acquisitionCompletedCountedAt: Date | null;
    }>;
    outForDelivery(u: AuthUser, id: string, d: OutForDeliveryDto): Promise<{
        lines: {
            id: string;
            drugId: string;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            orderId: string;
            qtyRequested: number;
            qtyAccepted: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").KiorexOrderStatus;
        rejectionReason: string | null;
        prescriptionId: string | null;
        dispensingId: string | null;
        externalOrderId: string;
        hasRx: boolean;
        customerName: string | null;
        customerPhone: string | null;
        deliveryAddress: string | null;
        prepaid: boolean;
        orderValue: import("@prisma/client-runtime-utils").Decimal;
        slaDueAt: Date;
        respondedAt: Date | null;
        respondedBy: string | null;
        rejectionCode: string | null;
        readyAt: Date | null;
        outForDeliveryAt: Date | null;
        patientRef: string | null;
        deliveryMethod: string | null;
        paymentRef: string | null;
        acquisitionOrigin: string | null;
        acquisitionDecisionRef: string | null;
        acquisitionReason: string | null;
        acquisitionLinkId: string | null;
        acquisitionOrderCountedAt: Date | null;
        acquisitionCompletedCountedAt: Date | null;
    }>;
    expire(u: AuthUser): Promise<{
        expired: number;
    }>;
}
declare class IngestLineDto {
    sku: string;
    quantity: number;
    unitPrice: string;
}
declare class CustomerDto {
    name?: string;
    phone?: string;
    address?: string;
}
declare class PrescriptionDto {
    patientRef?: string;
    recordRef?: string;
    verificationToken?: string;
    prescriberName?: string;
    prescriberLicenceNo?: string;
    issuedAt?: string;
    scanRef?: string;
}
declare class DeliveryDto {
    method: "PICKUP" | "DELIVERY";
    address?: Record<string, unknown>;
}
declare class PaymentDto {
    reference?: string;
    totalMinor?: number;
    currency?: string;
}
declare class IngestDto {
    orderId: string;
    branchId: string;
    patientRef?: string;
    customer?: CustomerDto;
    prepaid?: boolean;
    lines: IngestLineDto[];
    delivery?: DeliveryDto;
    payment?: PaymentDto;
    prescription?: PrescriptionDto;
    acquisition?: Record<string, unknown>;
}
declare class QuoteItemDto {
    sku: string;
    qty: number;
}
declare class QuoteDeliveryDto {
    method?: string;
}
declare class QuoteDto {
    pharmacyId: string;
    items: QuoteItemDto[];
    delivery?: QuoteDeliveryDto;
}
declare class RxValidateDto {
    orderId: string;
    prescriptionRef: string;
    verificationToken: string;
    patientRef?: string;
}
declare class CancelDto {
    reason?: string;
}
export declare class MarketplaceMachineController {
    private readonly svc;
    private readonly rates;
    constructor(svc: MarketplaceService, rates: CommissionRateService);
    commissionRate(req: {
        tenant: {
            id: string;
        };
    }, d: Record<string, unknown>): Promise<{
        applied: boolean;
    }>;
    pharmacies(req: {
        tenant: {
            id: string;
        };
    }): Promise<{
        items: {
            id: string;
            name: string;
            delivery: {
                enabled: boolean;
                feeMinor: number;
                radiusKm: number;
            };
            pickup: boolean;
            prepMinutes: number;
        }[];
    }>;
    catalogue(req: {
        tenant: {
            id: string;
        };
    }, q: {
        q?: string;
        pharmacyId?: string;
    }): Promise<{
        items: Record<string, unknown>[];
    }>;
    quote(req: {
        tenant: {
            id: string;
        };
    }, d: QuoteDto): Promise<{
        delivery?: {
            feeMinor: number;
        } | undefined;
        items: {
            qty: number;
            unitPriceMinor: number;
            rxRequired: boolean;
            controlled: boolean;
            available: boolean;
            formAr?: string | undefined;
            strength: string;
            form: string;
            nameAr?: string | undefined;
            sku: string;
            name: string;
        }[];
    }>;
    availability(req: {
        tenant: {
            id: string;
        };
    }): Promise<{
        generatedAt: string;
        branches: {
            branchId: string;
            deliveryRadiusKm: string;
            prepMinutes: number;
            openingHours: import("@prisma/client/runtime/client").JsonValue;
            items: {
                sku: string;
                gtin: string | null;
                name: string;
                availableQty: number;
                requiresPrescription: boolean;
            }[];
        }[];
    }>;
    order(req: {
        tenant: {
            id: string;
        };
    }, d: IngestDto): Promise<{
        orderId: string;
        status: import("../../generated/prisma/enums").KiorexOrderStatus;
        slaDueAt: Date;
        replayed: boolean;
    }>;
    validateRx(req: {
        tenant: {
            id: string;
        };
    }, d: RxValidateDto): Promise<{
        status: "VALID" | "INVALID" | "PENDING";
        reason?: string;
    }>;
    cancel(req: {
        tenant: {
            id: string;
        };
    }, orderId: string, _d: CancelDto): Promise<{
        status: string;
    }>;
}
export {};
