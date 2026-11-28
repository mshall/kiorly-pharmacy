import type { AuthUser } from "../../auth/auth-user";
import { KiorexConnectService } from "./kiorex-connect.service";
declare class TermsDto {
    version: string;
}
declare class PayoutDto {
    label: string;
}
declare class UploadDto {
    name: string;
    contentBase64: string;
}
declare class BranchDto {
    optedIn: boolean;
    deliveryRadiusKm?: string;
    openingHours?: Record<string, string[]>;
    prepMinutes?: number;
    latitude?: string;
    longitude?: string;
    licenceNo?: string;
}
declare class RequestDto {
    rotate?: boolean;
    contactEmail?: string;
    enrolmentCode?: string;
}
export declare class KiorexConnectController {
    private readonly svc;
    constructor(svc: KiorexConnectService);
    get(u: AuthUser): Promise<{
        legacy: boolean;
        status: import("./kiorex-connect.core").ConnectStatus;
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
    branches(u: AuthUser): Promise<{
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
    branch(u: AuthUser, id: string, d: BranchDto): Promise<{
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
    terms(u: AuthUser, d: TermsDto): Promise<{
        legacy: boolean;
        status: import("./kiorex-connect.core").ConnectStatus;
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
    payout(u: AuthUser, d: PayoutDto): Promise<{
        legacy: boolean;
        status: import("./kiorex-connect.core").ConnectStatus;
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
    licence(u: AuthUser, d: UploadDto): Promise<{
        legacy: boolean;
        status: import("./kiorex-connect.core").ConnectStatus;
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
    request(u: AuthUser, d: RequestDto): Promise<{
        credentials?: {
            clientKey: string;
            clientSecret: string;
            webhookSecret: string;
            shownOnce: boolean;
        } | undefined;
        legacy: boolean;
        status: import("./kiorex-connect.core").ConnectStatus;
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
    refresh(u: AuthUser): Promise<{
        legacy: boolean;
        status: import("./kiorex-connect.core").ConnectStatus;
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
}
export {};
