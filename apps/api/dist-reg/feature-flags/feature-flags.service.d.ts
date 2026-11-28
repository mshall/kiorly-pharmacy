import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { type FlagReason } from "@kiorex/contracts";
import { PrismaService } from "../prisma/prisma.service";
import { type FlagSnapshot } from "./flag-snapshot";
export interface FlagContext {
    orgId?: string;
    market?: string;
    entitled?: boolean;
}
export interface FlagDecision {
    enabled: boolean;
    scope?: "global" | "market" | "org" | "dependency" | "launch-locked" | "entitlement";
    key: string;
    reason?: FlagReason;
}
export declare class FeatureFlagsService implements OnModuleInit, OnModuleDestroy {
    private readonly prisma?;
    private readonly log;
    private snapshot;
    private etag;
    private timer;
    constructor(prisma?: PrismaService | undefined);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): void;
    restore(): Promise<void>;
    setSnapshot(snapshot: FlagSnapshot | null, etag?: string | null): void;
    getSnapshotVersion(): string | number | null;
    private persist;
    refresh(fetchImpl?: typeof fetch): Promise<"updated" | "not-modified" | "failed">;
    evaluate(key: string, ctx?: FlagContext): FlagDecision;
    isEnabled(key: string, ctx?: FlagContext): boolean;
}
