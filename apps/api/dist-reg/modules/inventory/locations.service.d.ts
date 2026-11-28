import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
export declare const LOCATION_KINDS: readonly ["SHELF", "FRIDGE", "SAFE", "BACKROOM", "DISPLAY", "QUARANTINE"];
export declare class LocationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(orgId: string, branchId: string): Promise<{
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
    create(u: AuthUser, branchId: string, d: {
        code: string;
        label?: string;
        kind?: string;
    }): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        orgId: string;
        active: boolean;
        branchId: string;
        kind: string;
        label: string | null;
    }>;
    update(u: AuthUser, id: string, d: {
        label?: string;
        kind?: string;
        active?: boolean;
    }): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        orgId: string;
        active: boolean;
        branchId: string;
        kind: string;
        label: string | null;
    }>;
    assign(u: AuthUser, locationId: string, lotIds: string[]): Promise<{
        assigned: number;
    }>;
    contents(orgId: string, locationId: string): Promise<{
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
}
