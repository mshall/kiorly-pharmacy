import { PrismaService } from "../../prisma/prisma.service";
import { StockLedger } from "./stock-ledger.service";
import type { AuthUser } from "../../auth/auth-user";
export declare class TransfersService {
    private readonly prisma;
    private readonly ledger;
    constructor(prisma: PrismaService, ledger: StockLedger);
    create(user: AuthUser, input: {
        fromBranchId: string;
        toBranchId: string;
        lines: Array<{
            lotId: string;
            quantity: number;
        }>;
    }): Promise<{
        lines: {
            id: string;
            drugId: string;
            lotId: string;
            quantity: number;
            transferId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("../../generated/prisma/enums").TransferStatus;
        receivedAt: Date | null;
        receivedBy: string | null;
        fromBranchId: string;
        toBranchId: string;
        requestedBy: string;
        dispatchedBy: string | null;
        dispatchedAt: Date | null;
    }>;
    list(orgId: string): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        lines: {
            id: string;
            drugId: string;
            lotId: string;
            quantity: number;
            transferId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("../../generated/prisma/enums").TransferStatus;
        receivedAt: Date | null;
        receivedBy: string | null;
        fromBranchId: string;
        toBranchId: string;
        requestedBy: string;
        dispatchedBy: string | null;
        dispatchedAt: Date | null;
    })[]>;
    dispatch(user: AuthUser, id: string, witness?: {
        id: string;
        name: string;
    }): Promise<{
        lines: {
            id: string;
            drugId: string;
            lotId: string;
            quantity: number;
            transferId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("../../generated/prisma/enums").TransferStatus;
        receivedAt: Date | null;
        receivedBy: string | null;
        fromBranchId: string;
        toBranchId: string;
        requestedBy: string;
        dispatchedBy: string | null;
        dispatchedAt: Date | null;
    }>;
    receive(user: AuthUser, id: string): Promise<{
        lines: {
            id: string;
            drugId: string;
            lotId: string;
            quantity: number;
            transferId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("../../generated/prisma/enums").TransferStatus;
        receivedAt: Date | null;
        receivedBy: string | null;
        fromBranchId: string;
        toBranchId: string;
        requestedBy: string;
        dispatchedBy: string | null;
        dispatchedAt: Date | null;
    }>;
    cancel(user: AuthUser, id: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("../../generated/prisma/enums").TransferStatus;
        receivedAt: Date | null;
        receivedBy: string | null;
        fromBranchId: string;
        toBranchId: string;
        requestedBy: string;
        dispatchedBy: string | null;
        dispatchedAt: Date | null;
    }>;
}
