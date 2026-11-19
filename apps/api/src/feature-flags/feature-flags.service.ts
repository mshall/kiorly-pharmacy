import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit, Optional } from "@nestjs/common";
import { evaluateFlag, verifySnapshot, type FlagReason } from "@kiorex/contracts";
import { PrismaService } from "../prisma/prisma.service";
import { FLAG_DEFINITIONS, isKnownFlagKey } from "./feature-flag-keys";
import { type FlagSnapshot, signSnapshotRequest } from "./flag-snapshot";
import { SafetyControlNotAFlagError, isSafetyControlKey } from "./safety-controls";

export interface FlagContext {
  orgId?: string;
  market?: string;
  /** Plan entitlement (rule 4). false => OFF. */
  entitled?: boolean;
}
export interface FlagDecision {
  enabled: boolean;
  /** Which layer turned it OFF (for the 403 FEATURE_DISABLED body). */
  scope?: "global" | "market" | "org" | "dependency" | "launch-locked" | "entitlement";
  key: string;
  reason?: FlagReason;
}

const CODE_DEFAULTS = Object.fromEntries(FLAG_DEFINITIONS.map((f) => [f.key, { launchLocked: f.launchLocked, dependsOn: f.dependsOn }]));

/**
 * Flag evaluator over the Kiorex snapshot (PH-F03/PH-F10). Evaluation is local (@kiorex/contracts evaluateFlag):
 * global AND market AND org AND entitlement AND gate AND dependencies. Missing snapshot => code defaults (ON, launch-locked OFF).
 * The last good snapshot is persisted in FlagSnapshotCache and restored on boot. Safety controls are NEVER evaluable (ADR-025).
 */
@Injectable()
export class FeatureFlagsService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(FeatureFlagsService.name);
  private snapshot: FlagSnapshot | null = null;
  private etag: string | null = null;
  private timer: NodeJS.Timeout | null = null;

  constructor(@Optional() @Inject(PrismaService) private readonly prisma?: PrismaService) {}

  async onModuleInit() {
    await this.restore();
    if (process.env.FLAGS_POLL_ENABLED === "true") {
      void this.refresh();
      this.timer = setInterval(() => void this.refresh(), Number(process.env.FLAGS_POLL_INTERVAL_MS ?? 30_000));
      this.timer.unref();
    }
  }
  onModuleDestroy() { if (this.timer) clearInterval(this.timer); }

  /** Loads the persisted snapshot (survives restart). */
  async restore(): Promise<void> {
    if (!this.prisma) return;
    try {
      const row = await this.prisma.flagSnapshotCache.findUnique({ where: { product: "kiorly-pharmacy" } });
      if (row && !this.snapshot) { this.snapshot = row.body as unknown as FlagSnapshot; this.etag = row.etag; }
    } catch (e) { this.log.warn(`could not restore flag snapshot: ${(e as Error).message}`); }
  }

  /** Test seam and push handler entry point. */
  setSnapshot(snapshot: FlagSnapshot | null, etag: string | null = null) {
    this.snapshot = snapshot;
    this.etag = etag;
  }

  getSnapshotVersion(): string | number | null { return this.snapshot?.version ?? null; }

  private async persist(): Promise<void> {
    if (!this.prisma || !this.snapshot) return;
    const data = { version: String(this.snapshot.version), etag: this.etag, body: this.snapshot as never, fetchedAt: new Date() };
    await this.prisma.flagSnapshotCache.upsert({ where: { product: "kiorly-pharmacy" }, create: { product: "kiorly-pharmacy", ...data }, update: data });
  }

  /** Poll once with If-None-Match. Failures keep the last good snapshot. */
  async refresh(fetchImpl: typeof fetch = fetch): Promise<"updated" | "not-modified" | "failed"> {
    const base = process.env.KIOREX_FLAGS_URL;
    const key = process.env.KIOREX_PRODUCT_KEY;
    const secret = process.env.KIOREX_PRODUCT_SECRET;
    if (!base || !key || !secret) return "failed";
    try {
      const url = new URL(base);
      url.searchParams.set("product", "kiorly-pharmacy");
      const headers: Record<string, string> = { ...signSnapshotRequest(key, secret, url.pathname) };
      if (this.etag) headers["if-none-match"] = this.etag;
      const res = await fetchImpl(url, { headers });
      if (res.status === 304) return "not-modified";
      if (!res.ok) throw new Error(`snapshot HTTP ${res.status}`);
      const body = (await res.json()) as FlagSnapshot;
      if (body.signature && !verifySnapshot(secret, body as never)) throw new Error("snapshot signature invalid");
      this.snapshot = body;
      this.etag = res.headers.get("etag");
      await this.persist().catch((e) => this.log.warn(`persist snapshot failed: ${(e as Error).message}`));
      return "updated";
    } catch (err) {
      this.log.warn(`flag snapshot refresh failed (keeping last good): ${(err as Error).message}`);
      return "failed";
    }
  }

  evaluate(key: string, ctx: FlagContext = {}): FlagDecision {
    if (isSafetyControlKey(key)) throw new SafetyControlNotAFlagError(key);
    if (!isKnownFlagKey(key)) throw new Error(`Unknown flag key "${key}"`);
    const d = evaluateFlag(this.snapshot, key, { orgId: ctx.orgId, market: ctx.market, entitled: ctx.entitled }, CODE_DEFAULTS);
    if (d.enabled) return { key, enabled: true, reason: d.reason };
    const scope: FlagDecision["scope"] =
      d.reason === "dependency_off" ? "dependency"
      : d.reason === "not_entitled" ? "entitlement"
      : d.reason === "awaiting_gate" || d.reason === "no_snapshot_launch_locked" ? "launch-locked"
      : (d.scope as FlagDecision["scope"]);
    return { key, enabled: false, scope, reason: d.reason };
  }

  isEnabled(key: string, ctx: FlagContext = {}): boolean { return this.evaluate(key, ctx).enabled; }
}
