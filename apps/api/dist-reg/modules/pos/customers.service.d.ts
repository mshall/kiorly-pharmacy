import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
export declare class CustomersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(user: AuthUser, d: {
        displayName: string;
        phone?: string;
        creditLimit: string;
    }): Promise<{
        displayName: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        orgId: string;
        creditLimit: import("@prisma/client-runtime-utils").Decimal;
        balance: import("@prisma/client-runtime-utils").Decimal;
        patientId: string;
    }>;
    list(orgId: string, q?: string): Promise<{
        id: string;
        displayName: string;
        phone: string | null;
        creditLimit: string;
        balance: string;
        available: string;
    }[]>;
    get(orgId: string, id: string): Promise<{
        entries: {
            id: string;
            createdAt: Date;
            orgId: string;
            kind: string;
            createdBy: string;
            saleId: string | null;
            note: string | null;
            amount: import("@prisma/client-runtime-utils").Decimal;
            accountId: string;
        }[];
        patient: {
            phone: string | null;
            displayName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        creditLimit: import("@prisma/client-runtime-utils").Decimal;
        balance: import("@prisma/client-runtime-utils").Decimal;
        patientId: string;
    }>;
    setLimit(user: AuthUser, id: string, creditLimit: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        creditLimit: import("@prisma/client-runtime-utils").Decimal;
        balance: import("@prisma/client-runtime-utils").Decimal;
        patientId: string;
    }>;
    pay(user: AuthUser, id: string, amount: string, branchId: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        creditLimit: import("@prisma/client-runtime-utils").Decimal;
        balance: import("@prisma/client-runtime-utils").Decimal;
        patientId: string;
    }>;
}
