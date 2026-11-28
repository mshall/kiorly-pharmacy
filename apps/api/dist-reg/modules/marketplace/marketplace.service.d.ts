import { PushService } from "../mobile/push.service";
import { OnModuleInit } from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
import { OutboxService } from "../../outbox/outbox.service";
import { DispenseHooks } from "../../common/dispense-hooks";
import { DispensingService } from "../dispensing/dispensing.service";
import { InventoryService } from "../inventory/inventory.service";
import { type SettlementPort } from "../../kernel-adapter/ports";
import { NotificationsService } from "../../platform/adapters/notifications.service";
import { PriceService } from "../catalogue/price.service";
export interface IngestOrderInput {
    orderId: string;
    branchId: string;
    customer?: {
        name?: string;
        phone?: string;
        address?: string;
    };
    patientRef?: string;
    prepaid?: boolean;
    lines: Array<{
        sku: string;
        quantity: number;
        unitPrice: string;
    }>;
    delivery?: {
        method: "PICKUP" | "DELIVERY";
        address?: Record<string, unknown>;
    };
    payment?: {
        reference?: string;
        totalMinor?: number;
        currency?: string;
    };
    prescription?: {
        patientRef?: string;
        recordRef?: string;
        verificationToken?: string;
        prescriberName?: string;
        prescriberLicenceNo?: string;
        issuedAt?: string;
        scanRef?: string;
    };
    acquisition?: unknown;
}
export declare class MarketplaceService implements OnModuleInit {
    private readonly prisma;
    private readonly outbox;
    private readonly hooks;
    private readonly dispensing;
    private readonly inv;
    private readonly settlement;
    private readonly notify;
    private readonly prices;
    private readonly push?;
    constructor(prisma: PrismaService, outbox: OutboxService, hooks: DispenseHooks, dispensing: DispensingService, inv: InventoryService, settlement: SettlementPort, notify: NotificationsService, prices: PriceService, push?: PushService | undefined);
    onModuleInit(): void;
    private pharmacyId;
    getSetting(orgId: string, branchId: string): Promise<{
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
    } | {
        orgId: string;
        branchId: string;
        optedIn: false;
        deliveryRadiusKm: import("@prisma/client-runtime-utils").Decimal;
        openingHours: null;
        prepMinutes: number;
        slaMinutes: number;
        latitude: null;
        longitude: null;
    }>;
    listSettings(orgId: string): Promise<{
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
    putSetting(user: AuthUser, branchId: string, d: {
        optedIn: boolean;
        deliveryRadiusKm?: string;
        openingHours?: Record<string, string[]>;
        prepMinutes?: number;
        slaMinutes?: number;
        latitude?: string;
        longitude?: string;
    }): Promise<{
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
    availability(orgId: string): Promise<{
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
    ingest(orgId: string, input: IngestOrderInput): Promise<{
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
        replayed: boolean;
    }>;
    inbox(orgId: string, q: {
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
    get(orgId: string, id: string): Promise<{
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
    accept(user: AuthUser, id: string, lineAcceptances?: Array<{
        lineId: string;
        qtyAccepted: number;
    }>): Promise<{
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
    reject(user: AuthUser, id: string, reason: string, reasonCode?: string): Promise<{
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
    markReady(user: AuthUser, id: string): Promise<{
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
    markOutForDelivery(user: AuthUser, id: string, d?: {
        estimatedMinutes?: number;
    }): Promise<{
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
    cancelByKiorex(orgId: string, externalOrderId: string): Promise<{
        status: string;
    }>;
    expireOverdue(orgId?: string): Promise<{
        expired: number;
    }>;
    private optedInBranches;
    pharmacies(orgId: string): Promise<{
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
    catalogue(orgId: string, q: {
        q?: string;
        branchId?: string;
    }): Promise<{
        items: Record<string, unknown>[];
    }>;
    quote(orgId: string, b: {
        pharmacyId: string;
        items: Array<{
            sku: string;
            qty: number;
        }>;
        delivery?: {
            method?: string;
        };
    }): Promise<{
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
    private kiorexBase;
    private verifyWithKiorex;
    validatePrescription(orgId: string, b: {
        orderId: string;
        prescriptionRef: string;
        verificationToken: string;
        patientRef?: string;
    }): Promise<{
        status: "VALID" | "INVALID" | "PENDING";
        reason?: string;
    }>;
    createClient(user: AuthUser, d: {
        kiorexBaseUrl?: string;
        webhookSecret?: string;
        key?: string;
        secret?: string;
    }): Promise<{
        id: string;
        key: string;
        secret: string;
        webhookSecret: string;
        kiorexBaseUrl: string | null;
    }>;
    listClients(orgId: string): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        active: boolean;
        source: string;
        key: string;
        kiorexBaseUrl: string | null;
    }[]>;
}
