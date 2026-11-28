import { AuditService } from "../../audit/audit.service";
import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { StorageAdapter } from "../../platform/adapters/storage.adapter";
import { MarketplaceService } from "./marketplace.service";
import { type ConnectStatus } from "./kiorex-connect.core";
interface Doc {
    status: ConnectStatus;
    terms?: {
        at: string;
        userId: string;
        version: string;
    };
    payoutLabel?: string;
    licenceDocument?: {
        at: string;
        bytes: number;
    };
    request?: {
        id: string;
        submittedAt: string;
        clientKey: string;
    };
    intakeKeyEnc?: string;
    kiorex?: {
        status: string;
        at: string;
    };
    contactEmail?: string;
}
export declare class KiorexConnectService {
    private readonly prisma;
    private readonly audit;
    private readonly market;
    private readonly storage;
    constructor(prisma: PrismaService, audit: AuditService, market: MarketplaceService, storage: StorageAdapter);
    private tenant;
    private doc;
    private save;
    private setMode;
    get(orgId: string, opts?: {
        pull?: boolean;
    }): Promise<{
        legacy: boolean;
        status: ConnectStatus;
        progress: number;
        canRequest: boolean;
        steps: import("./kiorex-connect.core").ConnectStep[];
        kiorex: {
            status: string;
            at: string;
        } | null;
        requestId: string | null;
        clientKey: string | null;
        enrolmentCodeRequired: boolean;
        termsVersion: string;
        payoutLabel: string | null;
        terms: {
            at: string;
            version: string;
        } | null;
        licenceDocument: {
            at: string;
            bytes: number;
        } | null;
        mode: string;
    }>;
    branches(orgId: string): Promise<{
        id: string;
        name: string;
        licenceNo: string | null;
        optedIn: boolean;
        openingHours: string | number | boolean | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray | null;
        deliveryRadiusKm: string;
        prepMinutes: number;
        latitude: string | null;
        longitude: string | null;
    }[]>;
    setBranch(u: AuthUser, branchId: string, d: {
        optedIn: boolean;
        deliveryRadiusKm?: string;
        openingHours?: Record<string, string[]>;
        prepMinutes?: number;
        latitude?: string;
        longitude?: string;
        licenceNo?: string;
    }): Promise<{
        id: string;
        name: string;
        licenceNo: string | null;
        optedIn: boolean;
        openingHours: string | number | boolean | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray | null;
        deliveryRadiusKm: string;
        prepMinutes: number;
        latitude: string | null;
        longitude: string | null;
    }[]>;
    acceptTerms(u: AuthUser, version: string): Promise<{
        legacy: boolean;
        status: ConnectStatus;
        progress: number;
        canRequest: boolean;
        steps: import("./kiorex-connect.core").ConnectStep[];
        kiorex: {
            status: string;
            at: string;
        } | null;
        requestId: string | null;
        clientKey: string | null;
        enrolmentCodeRequired: boolean;
        termsVersion: string;
        payoutLabel: string | null;
        terms: {
            at: string;
            version: string;
        } | null;
        licenceDocument: {
            at: string;
            bytes: number;
        } | null;
        mode: string;
    }>;
    setPayout(u: AuthUser, label: unknown): Promise<{
        legacy: boolean;
        status: ConnectStatus;
        progress: number;
        canRequest: boolean;
        steps: import("./kiorex-connect.core").ConnectStep[];
        kiorex: {
            status: string;
            at: string;
        } | null;
        requestId: string | null;
        clientKey: string | null;
        enrolmentCodeRequired: boolean;
        termsVersion: string;
        payoutLabel: string | null;
        terms: {
            at: string;
            version: string;
        } | null;
        licenceDocument: {
            at: string;
            bytes: number;
        } | null;
        mode: string;
    }>;
    uploadLicence(u: AuthUser, name: string, contentBase64: string): Promise<{
        legacy: boolean;
        status: ConnectStatus;
        progress: number;
        canRequest: boolean;
        steps: import("./kiorex-connect.core").ConnectStep[];
        kiorex: {
            status: string;
            at: string;
        } | null;
        requestId: string | null;
        clientKey: string | null;
        enrolmentCodeRequired: boolean;
        termsVersion: string;
        payoutLabel: string | null;
        terms: {
            at: string;
            version: string;
        } | null;
        licenceDocument: {
            at: string;
            bytes: number;
        } | null;
        mode: string;
    }>;
    request(u: AuthUser, o?: {
        rotate?: boolean;
        contactEmail?: string;
        enrolmentCode?: string;
    }): Promise<{
        credentials?: {
            clientKey: string;
            clientSecret: string;
            webhookSecret: string;
            shownOnce: boolean;
        } | undefined;
        legacy: boolean;
        status: ConnectStatus;
        progress: number;
        canRequest: boolean;
        steps: import("./kiorex-connect.core").ConnectStep[];
        kiorex: {
            status: string;
            at: string;
        } | null;
        requestId: string | null;
        clientKey: string | null;
        enrolmentCodeRequired: boolean;
        termsVersion: string;
        payoutLabel: string | null;
        terms: {
            at: string;
            version: string;
        } | null;
        licenceDocument: {
            at: string;
            bytes: number;
        } | null;
        mode: string;
    }>;
    pull(orgId: string, d: Doc): Promise<void>;
}
export {};
