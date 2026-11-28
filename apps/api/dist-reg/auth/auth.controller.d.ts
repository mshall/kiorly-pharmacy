import type { Request, Response } from "express";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthUser } from "./auth-user";
import { TokenVerifier } from "./token-verifier";
import { PermissionsService } from "./permissions.service";
import { TenantModeService } from "../tenancy/tenant-mode.service";
import { FeatureFlagsService } from "../feature-flags/feature-flags.service";
import { AuditService } from "../audit/audit.service";
import { DomainError } from "../common/errors";
import { PassportService } from "./passport.service";
import { PassportSessions } from "./passport-sessions.service";
import { PrismaHandoffStore } from "./handoff.store";
declare class LoginDto {
    email: string;
    password: string;
}
declare class OidcExchangeDto {
    code: string;
    codeVerifier: string;
    redirectUri: string;
    nonce: string;
    claim?: string;
}
declare class HandoffLoginDto {
    email: string;
    password: string;
}
declare class HandoffExchangeDto {
    code: string;
}
export declare function passwordRoleRefusal(role: string): Promise<DomainError | null>;
export declare class AuthController {
    private readonly prisma;
    private readonly tokens;
    private readonly flags;
    private readonly audit;
    private readonly perms;
    private readonly modes;
    private readonly passport;
    private readonly sessions;
    private readonly handoffStore;
    constructor(prisma: PrismaService, tokens: TokenVerifier, flags: FeatureFlagsService, audit: AuditService, perms: PermissionsService, modes: TenantModeService, passport: PassportService, sessions: PassportSessions, handoffStore: PrismaHandoffStore);
    private handoffCodes;
    config(org: string | undefined, req: Request, res: Response): Promise<{
        passportAvailable: boolean;
        defaultMethod: import("./sign-in-default").SignInDefaultMethod;
        localLogin: boolean;
        passport: null;
    } | {
        passportAvailable: boolean;
        defaultMethod: import("./sign-in-default").SignInDefaultMethod;
        localLogin: boolean;
        passport: {
            issuer: string;
            clientId: string;
            authorizationEndpoint: string;
            scope: string;
            endSession: boolean;
        };
    }>;
    exchange(dto: OidcExchangeDto): Promise<{
        endSessionUrl?: string | undefined;
        accessToken: string;
        expiresIn: number;
    }>;
    backchannelLogout(logoutToken: unknown, res: Response): Promise<{}>;
    login(dto: LoginDto, req: Request): Promise<{
        accessToken: string;
    }>;
    handoffLogin(dto: HandoffLoginDto, origin: string | undefined, req: Request, res: Response): Promise<{
        status: string;
        code: string;
        expiresInSeconds: number;
        redirectUrl: string | null;
    }>;
    handoffExchange(dto: HandoffExchangeDto, res: Response): Promise<{
        accessToken: string;
    }>;
    me(u: AuthUser): Promise<{
        user: {
            id: string;
            displayName: string;
            role: import("../generated/prisma/enums").StaffRole;
            branchId: string | null;
            isPharmacist: boolean;
        };
        tenant: {
            id: string;
            name: string;
            edition: import("../generated/prisma/enums").Edition;
            market: string;
            onboarded: boolean;
            mode: import("../tenancy/tenant-mode.service").OperatingMode;
            currency: string;
        };
        branches: {
            id: string;
            name: string;
            code: string | null;
        }[];
        permissions: ("catalogue.read" | "catalogue.write" | "price.write" | "inventory.read" | "inventory.receive" | "inventory.adjust" | "inventory.count" | "inventory.count.approve" | "inventory.transfer" | "inventory.quarantine" | "inventory.negative_stock" | "recall.manage" | "rx.read" | "rx.intake" | "rx.validate" | "dispense.create" | "dispense.signoff" | "dispense.complete" | "controlled.read" | "pos.sell" | "pos.shift" | "pos.refund_approve" | "customer.credit" | "supplier.read" | "supplier.write" | "po.write" | "orders.read" | "orders.respond" | "claims.manage" | "forecast.read" | "reports.read" | "audit.read" | "settings.read" | "settings.write" | "staff.manage" | "customer.read" | "customer.write" | "customer.merge" | "loyalty.manage" | "prescriber.manage" | "rx.refill" | "rx.transfer" | "safety.kb.manage" | "controlled.manage" | "promo.manage" | "pos.discount_override" | "pos.cash_drawer" | "expense.read" | "expense.write" | "finance.read" | "roles.manage" | "data.import" | "data.export" | "notifications.read")[];
        flags: {
            [k: string]: boolean;
        };
    }>;
}
export {};
