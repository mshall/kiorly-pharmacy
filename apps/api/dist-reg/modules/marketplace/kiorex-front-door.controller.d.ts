import type { AuthUser } from "../../auth/auth-user";
import { KiorexFrontDoorService } from "./kiorex-front-door.service";
declare class TalkDto {
    contactName: string;
    contactRole?: string;
    phone?: string;
    email?: string;
    preferredTime?: string;
    note?: string;
    consent: boolean;
}
declare class PauseDto {
    reason?: string;
}
export declare class KiorexFrontDoorController {
    private readonly svc;
    constructor(svc: KiorexFrontDoorService);
    get(u: AuthUser): Promise<{
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
    interest(u: AuthUser): Promise<{
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
    pause(u: AuthUser, d: PauseDto): Promise<{
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
    resume(u: AuthUser): Promise<{
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
    talk(u: AuthUser, d: TalkDto): Promise<{
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
}
export {};
