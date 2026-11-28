import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../audit/audit.service";
import { PriceService } from "../catalogue/price.service";
import { ReceivingService } from "../inventory/receiving.service";
import { ShiftsService } from "../pos/shifts.service";
import type { AuthUser } from "../../auth/auth-user";
export declare class MobilePharmacyService {
    private readonly prisma;
    private readonly audit;
    private readonly prices;
    private readonly receiving;
    private readonly shifts;
    constructor(prisma: PrismaService, audit: AuditService, prices: PriceService, receiving: ReceivingService, shifts: ShiftsService);
    barcode(u: AuthUser, code: string, requestedBranch?: string): Promise<{
        found: false;
        code: string;
        scan: {
            gtin: string | null;
            lotNumber: string | null;
            expiryDate: string | null;
        };
        branchId?: undefined;
        drug?: undefined;
        price?: undefined;
        requiresPrescription?: undefined;
        stock?: undefined;
        lots?: undefined;
    } | {
        found: true;
        code: string;
        branchId: string;
        scan: {
            gtin: string | null;
            lotNumber: string | null;
            expiryDate: string | null;
        };
        drug: {
            id: string;
            brandName: string;
            brandNameAr: string | null;
            strength: string;
            dosageForm: string;
            gtin: string | null;
            rxOnly: boolean;
            controlled: boolean;
            controlledSchedule: string;
            coldChain: boolean;
        };
        price: string | null;
        requiresPrescription: boolean;
        stock: {
            onHand: number;
            available: number;
            nearestExpiry: Date;
        };
        lots: {
            id: string;
            lotNumber: string;
            expiryDate: Date;
            status: import("../../generated/prisma/enums").LotStatus;
            qtyOnHand: number;
            qtyReserved: number;
            expired: boolean;
            daysToExpiry: number;
            scannedLotMatch: boolean | null;
        }[];
    }>;
    expiryLowStock(u: AuthUser, requestedBranch?: string): Promise<{
        asOf: Date;
        expiry: {
            expired: {
                lots: number;
                units: number;
            };
            within30: {
                lots: number;
                units: number;
            };
            within60: {
                lots: number;
                units: number;
            };
            within90: {
                lots: number;
                units: number;
            };
            items: {
                lotId: string;
                drugId: string;
                brandName: string;
                brandNameAr: string | null;
                lotNumber: string;
                expiryDate: Date;
                daysToExpiry: number;
                qtyOnHand: number;
                status: import("../../generated/prisma/enums").LotStatus;
                branchId: string;
            }[];
        };
        blocked: {
            quarantined: {
                lots: number;
                units: number;
            };
            recalled: {
                lots: number;
                units: number;
            };
            items: {
                blockedReason: string | null;
                lotId: string;
                drugId: string;
                brandName: string;
                brandNameAr: string | null;
                lotNumber: string;
                expiryDate: Date;
                daysToExpiry: number;
                qtyOnHand: number;
                status: import("../../generated/prisma/enums").LotStatus;
                branchId: string;
            }[];
        };
        lowStock: {
            count: number;
            items: {
                drugId: string;
                branchId: string;
                brandName: string;
                brandNameAr: string | null;
                minQty: number;
                maxQty: number;
                onHand: number;
                suggestedOrder: number;
            }[];
        };
    }>;
    shiftSummary(u: AuthUser, requestedBranch?: string): Promise<{
        open: false;
        branchId: string;
        shift: null;
        report: null;
        lastClosed: {
            id: string;
            closedAt: Date | null;
            variance: string | null;
            expectedCash: string | null;
            countedCash: string | null;
        } | null;
    } | {
        open: true;
        branchId: string;
        shift: {
            id: string;
            openedAt: Date;
            openedBy: string;
            openedByName: string | null;
            openingFloat: string;
            mine: boolean;
        };
        report: {
            shiftId: string;
            branchId: string;
            openedAt: Date;
            closedAt: Date | null;
            openingFloat: string;
            salesCount: number;
            grossSales: string;
            vatTotal: string;
            discountTotal: string;
            byMethod: Record<string, string>;
            returnsCount: number;
            returnsTotal: string;
            voidsCount: number;
            voidsTotal: string;
            cashSales: string;
            cashRefunds: string;
            cashIn: string;
            cashOut: string;
            report: string;
            customerCreditCollected: string;
            expectedCash: string;
        };
        lastClosed: {
            id: string;
            closedAt: Date | null;
            variance: string | null;
            expectedCash: string | null;
            countedCash: string | null;
        } | null;
    }>;
    private lastClosed;
    pendingWitness(u: AuthUser): Promise<{
        items: {
            id: string;
            branchId: string;
            drug: {
                id: string;
                brandName: string;
                brandNameAr: string | null;
                strength: string;
                controlledSchedule: import("../../generated/prisma/enums").ControlledSchedule;
            } | null;
            expectedQty: number;
            countedQty: number;
            difference: number;
            notes: string | null;
            reportedBy: string;
            reportedByName: string | null;
            createdAt: Date;
            countersigns: {
                witnessId: string;
                witnessName: string | null;
                signedAt: Date;
                note: string | null;
            }[];
            witnessPending: boolean;
            canCountersign: boolean;
        }[];
    }>;
    countersign(u: AuthUser, discrepancyId: string, note?: string): Promise<{
        id: string;
        discrepancyId: string;
        witnessId: string;
        signedAt: Date;
        note: string | null;
    }>;
    search(u: AuthUser, q: string, can: {
        catalogue: boolean;
        customers: boolean;
        rx: boolean;
    }): Promise<{
        q: string;
        drugs: {
            id: string;
            brandName: string;
            brandNameAr: string | null;
            strength: string;
            dosageForm: string;
            gtin: string | null;
            rxOnly: boolean;
            controlled: boolean;
            controlledSchedule: string;
            coldChain: boolean;
        }[];
        customers: never[] | {
            id: string;
            phone: string | null;
            displayName: string;
            customerNo: string | null;
        }[];
        prescriptions: {
            id: string;
            status: import("../../generated/prisma/enums").RxStatus;
            prescriberName: string | null;
            receivedAt: Date;
            patientName: string | null;
        }[];
    }>;
}
