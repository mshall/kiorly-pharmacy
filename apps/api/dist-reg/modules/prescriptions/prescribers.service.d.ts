import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
export interface PrescriberInput {
    name?: string;
    nameAr?: string;
    licenceNo?: string;
    specialty?: string;
    phone?: string;
    clinicName?: string;
    clinicAddress?: string;
    notes?: string;
    active?: boolean;
}
export declare class PrescribersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(orgId: string, q: {
        q?: string;
        verified?: boolean;
        page: number;
        pageSize: number;
    }): Promise<{
        total: number;
        page: number;
        pageSize: number;
        items: {
            prescriptions: number;
            id: string;
            name: string;
            createdAt: Date;
            orgId: string;
            licenceNo: string;
            phone: string | null;
            active: boolean;
            notes: string | null;
            updatedAt: Date;
            nameAr: string | null;
            specialty: string | null;
            clinicName: string | null;
            clinicAddress: string | null;
            verified: boolean;
            verifiedBy: string | null;
            verifiedAt: Date | null;
        }[];
    }>;
    get(orgId: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        licenceNo: string;
        phone: string | null;
        active: boolean;
        notes: string | null;
        updatedAt: Date;
        nameAr: string | null;
        specialty: string | null;
        clinicName: string | null;
        clinicAddress: string | null;
        verified: boolean;
        verifiedBy: string | null;
        verifiedAt: Date | null;
    }>;
    create(u: AuthUser, d: PrescriberInput & {
        name: string;
        licenceNo: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        licenceNo: string;
        phone: string | null;
        active: boolean;
        notes: string | null;
        updatedAt: Date;
        nameAr: string | null;
        specialty: string | null;
        clinicName: string | null;
        clinicAddress: string | null;
        verified: boolean;
        verifiedBy: string | null;
        verifiedAt: Date | null;
    }>;
    update(u: AuthUser, id: string, d: PrescriberInput): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        licenceNo: string;
        phone: string | null;
        active: boolean;
        notes: string | null;
        updatedAt: Date;
        nameAr: string | null;
        specialty: string | null;
        clinicName: string | null;
        clinicAddress: string | null;
        verified: boolean;
        verifiedBy: string | null;
        verifiedAt: Date | null;
    }>;
    verify(u: AuthUser, id: string, verified: boolean): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        licenceNo: string;
        phone: string | null;
        active: boolean;
        notes: string | null;
        updatedAt: Date;
        nameAr: string | null;
        specialty: string | null;
        clinicName: string | null;
        clinicAddress: string | null;
        verified: boolean;
        verifiedBy: string | null;
        verifiedAt: Date | null;
    }>;
    ensure(tx: Prisma.TransactionClient, orgId: string, d: {
        name: string;
        licenceNo: string;
        specialty?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        licenceNo: string;
        phone: string | null;
        active: boolean;
        notes: string | null;
        updatedAt: Date;
        nameAr: string | null;
        specialty: string | null;
        clinicName: string | null;
        clinicAddress: string | null;
        verified: boolean;
        verifiedBy: string | null;
        verifiedAt: Date | null;
    }>;
}
