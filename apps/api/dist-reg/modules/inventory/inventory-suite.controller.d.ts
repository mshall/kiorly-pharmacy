import type { AuthUser } from "../../auth/auth-user";
import { ApprovalDto, ApprovalService } from "../../auth/approval.service";
import { PrismaService } from "../../prisma/prisma.service";
import { LocationsService } from "./locations.service";
import { UomService } from "./uom.service";
import { InventoryAnalyticsService } from "./inventory-analytics.service";
import { InventoryService } from "./inventory.service";
declare class LocationDto {
    branchId?: string;
    code: string;
    label?: string;
    kind?: string;
}
declare class LocationPatchDto {
    label?: string;
    kind?: string;
    active?: boolean;
}
declare class AssignDto {
    lotIds: string[];
}
declare class UomDto {
    name: string;
    factor: number;
    barcode?: string;
}
declare class AutoDto {
    branchId?: string;
    days?: number;
    safetyDays?: number;
    reviewDays?: number;
    overwrite?: boolean;
}
declare class DamageDto {
    quantity: number;
    reason: string;
    reasonCode?: string;
    witness?: ApprovalDto;
    approval?: ApprovalDto;
}
export declare class InventorySuiteController {
    private readonly locations;
    private readonly uoms;
    private readonly analytics;
    private readonly inv;
    private readonly approvals;
    private readonly prisma;
    constructor(locations: LocationsService, uoms: UomService, analytics: InventoryAnalyticsService, inv: InventoryService, approvals: ApprovalService, prisma: PrismaService);
    locList(u: AuthUser, branchId?: string): Promise<{
        lots: number;
        units: number;
        code: string;
        id: string;
        createdAt: Date;
        orgId: string;
        active: boolean;
        branchId: string;
        kind: string;
        label: string | null;
    }[]>;
    locCreate(u: AuthUser, d: LocationDto): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        orgId: string;
        active: boolean;
        branchId: string;
        kind: string;
        label: string | null;
    }>;
    locUpdate(u: AuthUser, id: string, d: LocationPatchDto): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        orgId: string;
        active: boolean;
        branchId: string;
        kind: string;
        label: string | null;
    }>;
    locContents(u: AuthUser, id: string): Promise<{
        location: {
            code: string;
            id: string;
            createdAt: Date;
            orgId: string;
            active: boolean;
            branchId: string;
            kind: string;
            label: string | null;
        };
        lots: {
            lotId: string;
            brandName: string;
            brandNameAr: string | null;
            strength: string;
            lotNumber: string;
            expiryDate: Date;
            qtyOnHand: number;
            status: import("../../generated/prisma/enums").LotStatus;
            value: string;
        }[];
    }>;
    locAssign(u: AuthUser, id: string, d: AssignDto): Promise<{
        assigned: number;
    }>;
    uomList(u: AuthUser, drugId: string): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        active: boolean;
        drugId: string;
        factor: number;
        barcode: string | null;
    }[]>;
    uomCreate(u: AuthUser, drugId: string, d: UomDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        active: boolean;
        drugId: string;
        factor: number;
        barcode: string | null;
    }>;
    uomRemove(u: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
    movers(u: AuthUser, q: {
        branchId?: string;
        days?: string;
    }): Promise<{
        days: number;
        counts: {
            FAST: number;
            NORMAL: number;
            SLOW: number;
            DEAD: number;
        };
        deadStockValue: string;
        items: ({
            drugId: string;
            brandName: string;
            brandNameAr: string | null;
            strength: string;
            category: string | null;
            units: number;
            perDay: number;
            onHand: number;
            daysOfCover: number | null;
            stockValue: string;
            lastSold: Date | null;
            lastReceived: Date | null;
        } & {
            class: import("./inventory-analytics.service").MoverClass;
        })[];
    }>;
    autoReorder(u: AuthUser, d: AutoDto): Promise<{
        created: number;
        updated: number;
        skipped: number;
    }>;
    cold(u: AuthUser, branchId?: string): Promise<{
        lotId: string;
        brandName: string;
        brandNameAr: string | null;
        strength: string;
        lotNumber: string;
        expiryDate: Date;
        qtyOnHand: number;
        status: import("../../generated/prisma/enums").LotStatus;
        locationId: string | null;
        lastReading: {
            temperatureC: string;
            excursion: boolean;
            recordedAt: Date;
        } | null;
        readings24h: number;
    }[]>;
    movements(u: AuthUser, q: {
        branchId?: string;
        type?: string;
        reasonCode?: string;
        from?: string;
        to?: string;
        q?: string;
        page?: string;
        pageSize?: string;
    }): Promise<{
        total: number;
        items: {
            id: string;
            type: import("../../generated/prisma/enums").StockMovementType;
            qtyDelta: number;
            reason: string | null;
            reasonCode: string | null;
            occurredAt: Date;
            branchId: string;
            lotId: string;
            lotNumber: string;
            brandName: string;
            brandNameAr: string | null;
            strength: string;
            performedBy: string;
        }[];
    }>;
    lotLabels(u: AuthUser, ids: string, lang?: string): Promise<string>;
    damage(u: AuthUser, id: string, d: DamageDto): Promise<{
        id: string;
        orgId: string;
        branchId: string;
        reason: string | null;
        lotId: string;
        type: import("../../generated/prisma/enums").StockMovementType;
        qtyDelta: number;
        refType: string | null;
        refId: string | null;
        reasonCode: string | null;
        managerApprovalBy: string | null;
        performedBy: string;
        occurredAt: Date;
    }>;
}
export {};
