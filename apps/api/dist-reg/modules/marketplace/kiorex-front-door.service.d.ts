import { AuditService } from "../../audit/audit.service";
import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { KiorexConnectService } from "./kiorex-connect.service";
import { type TalkToUsInput } from "./kiorex-front-door.core";
export declare class KiorexFrontDoorService {
    private readonly prisma;
    private readonly audit;
    private readonly connect;
    private readonly log;
    constructor(prisma: PrismaService, audit: AuditService, connect: KiorexConnectService);
    private tenant;
    private flags;
    private setFlags;
    get(orgId: string): Promise<{
        state: import("./kiorex-front-door.core").FrontDoorState;
        listing: {
            paused: boolean;
            pausedAt: string | null;
            reason: string | null;
        };
        status: import("./kiorex-connect.core").ConnectStatus;
        legacy: boolean;
        started: boolean;
        interestedAt: string | null;
        leadAt: string | null;
        currency: string | null;
        deliveryFeeMinor: number | null;
        month: {
            orders: number;
            completed: number;
            rejected: number;
            value: number;
        } | null;
        recent: {
            id: string;
            createdAt: Date;
            status: string;
            branch: string;
            delivery: string | null;
            value: number;
        }[];
        branches: {
            id: string;
            name: string;
            optedIn: boolean;
        }[];
        connect: {
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
        };
    }>;
    pauseListing(u: AuthUser, reason?: unknown): Promise<{
        state: import("./kiorex-front-door.core").FrontDoorState;
        listing: {
            paused: boolean;
            pausedAt: string | null;
            reason: string | null;
        };
        status: import("./kiorex-connect.core").ConnectStatus;
        legacy: boolean;
        started: boolean;
        interestedAt: string | null;
        leadAt: string | null;
        currency: string | null;
        deliveryFeeMinor: number | null;
        month: {
            orders: number;
            completed: number;
            rejected: number;
            value: number;
        } | null;
        recent: {
            id: string;
            createdAt: Date;
            status: string;
            branch: string;
            delivery: string | null;
            value: number;
        }[];
        branches: {
            id: string;
            name: string;
            optedIn: boolean;
        }[];
        connect: {
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
        };
    }>;
    resumeListing(u: AuthUser): Promise<{
        state: import("./kiorex-front-door.core").FrontDoorState;
        listing: {
            paused: boolean;
            pausedAt: string | null;
            reason: string | null;
        };
        status: import("./kiorex-connect.core").ConnectStatus;
        legacy: boolean;
        started: boolean;
        interestedAt: string | null;
        leadAt: string | null;
        currency: string | null;
        deliveryFeeMinor: number | null;
        month: {
            orders: number;
            completed: number;
            rejected: number;
            value: number;
        } | null;
        recent: {
            id: string;
            createdAt: Date;
            status: string;
            branch: string;
            delivery: string | null;
            value: number;
        }[];
        branches: {
            id: string;
            name: string;
            optedIn: boolean;
        }[];
        connect: {
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
        };
    }>;
    interest(orgId: string): Promise<{
        sent: boolean;
    }>;
    start(u: AuthUser): Promise<{
        state: import("./kiorex-front-door.core").FrontDoorState;
        listing: {
            paused: boolean;
            pausedAt: string | null;
            reason: string | null;
        };
        status: import("./kiorex-connect.core").ConnectStatus;
        legacy: boolean;
        started: boolean;
        interestedAt: string | null;
        leadAt: string | null;
        currency: string | null;
        deliveryFeeMinor: number | null;
        month: {
            orders: number;
            completed: number;
            rejected: number;
            value: number;
        } | null;
        recent: {
            id: string;
            createdAt: Date;
            status: string;
            branch: string;
            delivery: string | null;
            value: number;
        }[];
        branches: {
            id: string;
            name: string;
            optedIn: boolean;
        }[];
        connect: {
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
        };
    }>;
    talk(u: AuthUser, input: TalkToUsInput): Promise<{
        state: import("./kiorex-front-door.core").FrontDoorState;
        listing: {
            paused: boolean;
            pausedAt: string | null;
            reason: string | null;
        };
        status: import("./kiorex-connect.core").ConnectStatus;
        legacy: boolean;
        started: boolean;
        interestedAt: string | null;
        leadAt: string | null;
        currency: string | null;
        deliveryFeeMinor: number | null;
        month: {
            orders: number;
            completed: number;
            rejected: number;
            value: number;
        } | null;
        recent: {
            id: string;
            createdAt: Date;
            status: string;
            branch: string;
            delivery: string | null;
            value: number;
        }[];
        branches: {
            id: string;
            name: string;
            optedIn: boolean;
        }[];
        connect: {
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
        };
    }>;
    private sendFunnel;
}
