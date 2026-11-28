import type { StaffRole } from "../../generated/prisma/client";
import { type Permission } from "../../auth/permissions";
export type SetupStatus = "pending" | "done" | "skipped";
export type SetupKey = "branch_licence" | "pharmacist_licence" | "drug_prices" | "first_stock" | "invite_staff" | "receipt_settings" | "first_sale" | "connect_kiorex";
export interface BranchSnap {
    id: string;
    name: string;
    licenceNo: string | null;
    address: string | null;
    stockLots: number;
    sales: number;
}
export interface SetupSnapshot {
    branches: BranchSnap[];
    pharmacistLicensed: boolean;
    pricedDrugs: number;
    otherStaff: number;
    receiptConfigured: boolean;
    connectStatus: string | null;
}
export interface Viewer {
    role: StaffRole;
}
interface Def {
    key: SetupKey;
    scope: "org" | "branch";
    required: boolean;
    perm: Permission;
    hideIfCannot?: boolean;
    done: (s: SetupSnapshot, b?: BranchSnap) => boolean;
    href: (branchId?: string) => string;
}
export declare const SETUP_DEFS: Def[];
export interface EntityDto {
    id: string;
    name: string;
    status: SetupStatus;
    href: string;
}
export interface StepDto {
    key: SetupKey;
    order: number;
    required: boolean;
    manual: false;
    scope: "org" | "branch";
    status: SetupStatus;
    href: string;
    whoCan: StaffRole[];
    canPerform: boolean;
    available: boolean;
    entities: EntityDto[] | null;
    doneCount: number;
    totalCount: number;
}
export interface PlanDto {
    steps: StepDto[];
    progressPercent: number;
    overallPercent: number;
    doneUnits: number;
    totalUnits: number;
    allDone: boolean;
    nextKey: SetupKey | null;
    nextHref: string | null;
    dismissedAt: string | null;
}
export declare const skipKey: (key: string, entity?: string | null) => string;
export declare const rolesWith: (perm: Permission) => StaffRole[];
export declare function buildPlan(snap: SetupSnapshot, skipped: Record<string, string>, viewer: Viewer, dismissedAt?: string | null): PlanDto;
export {};
