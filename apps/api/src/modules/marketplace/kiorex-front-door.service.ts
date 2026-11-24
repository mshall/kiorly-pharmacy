import { Inject, Injectable, Logger } from "@nestjs/common";
import type { Prisma } from "../../generated/prisma/client";
import { AuditService } from "../../audit/audit.service";
import type { AuthUser } from "../../auth/auth-user";
import { badRequest, conflict } from "../../common/errors";
import { PrismaService } from "../../prisma/prisma.service";
import { kiorexHost } from "./kiorex-connect.core";
import { KiorexConnectService } from "./kiorex-connect.service";
import { cleanTalkToUs, frontDoorState, leadHeaders, leadSigningSecret, LeadInputError, newLeadNonce, type TalkToUsInput } from "./kiorex-front-door.core";

interface Flags { startedAt?: string; interestAt?: string; leadAt?: string }
const KEY = "kiorexFrontDoor";
const monthStart = () => { const d = new Date(); return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)); };

/** Front door of "Connect to Kiorex" (ADR-040): state, privacy-safe funnel markers, the Talk to us lead and the live dashboard numbers. Flags live in Tenant.settings.kiorexFrontDoor (no schema change). */
@Injectable()
export class KiorexFrontDoorService {
  private readonly log = new Logger("kiorex-front-door");
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(AuditService) private readonly audit: AuditService, @Inject(KiorexConnectService) private readonly connect: KiorexConnectService) {}

  private async tenant(orgId: string) { return this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } }); }
  private flags(settings: unknown): Flags { return ((settings as Record<string, unknown> | null)?.[KEY] as Flags | undefined) ?? {}; }
  private async setFlags(orgId: string, patch: Flags) {
    const t = await this.tenant(orgId);
    await this.prisma.tenant.update({ where: { id: orgId }, data: { settings: { ...((t.settings ?? {}) as Record<string, unknown>), [KEY]: { ...this.flags(t.settings), ...patch } } as unknown as Prisma.InputJsonValue } });
  }

  async get(orgId: string) {
    const c = await this.connect.get(orgId); const t = await this.tenant(orgId); const f = this.flags(t.settings);
    const state = frontDoorState({ legacy: c.legacy, status: c.status, started: !!f.startedAt || !!c.terms });
    let month: { orders: number; completed: number; rejected: number; value: number } | null = null; let recent: Array<{ id: string; createdAt: Date; status: string; branch: string; delivery: string | null; value: number }> = [];
    let branches: Array<{ id: string; name: string; optedIn: boolean }> = [];
    if (state === "LIVE" || state === "ATTENTION") {
      const rows = await this.prisma.kiorexOrder.findMany({ where: { orgId, createdAt: { gte: monthStart() } }, select: { status: true, orderValue: true } });
      month = { orders: rows.length, completed: rows.filter((r) => r.status === "DISPENSED").length, rejected: rows.filter((r) => r.status === "REJECTED").length, value: Math.round(rows.filter((r) => r.status === "DISPENSED").reduce((s, r) => s + Number(r.orderValue.toString()), 0) * 100) / 100 };
      const bs = await this.prisma.branch.findMany({ where: { orgId, active: true }, select: { id: true, name: true } });
      const bname = new Map(bs.map((b) => [b.id, b.name]));
      const last = await this.prisma.kiorexOrder.findMany({ where: { orgId }, orderBy: { createdAt: "desc" }, take: 8, select: { id: true, createdAt: true, status: true, branchId: true, deliveryMethod: true, orderValue: true } });
      recent = last.map((o) => ({ id: o.id, createdAt: o.createdAt, status: o.status, branch: bname.get(o.branchId) ?? "", delivery: o.deliveryMethod, value: Number(o.orderValue.toString()) }));
      const opted = new Set((await this.prisma.branchMarketplaceSetting.findMany({ where: { orgId, optedIn: true }, select: { branchId: true } })).map((x) => x.branchId));
      branches = bs.map((b) => ({ id: b.id, name: b.name, optedIn: opted.has(b.id) }));
    }
    return { state, status: c.status, legacy: c.legacy, started: !!f.startedAt || !!c.terms, interestedAt: f.interestAt ?? null, leadAt: f.leadAt ?? null, currency: ((t.settings as { currency?: string } | null)?.currency) ?? null, month, recent, branches, connect: c };
  }

  async interest(orgId: string) {
    const c = await this.connect.get(orgId, { pull: false }); const t = await this.tenant(orgId); const f = this.flags(t.settings);
    if (c.legacy || c.status !== "STANDALONE" || f.interestAt) return { sent: false };
    const ok = await this.sendFunnel(orgId, t.marketCode, "INTERESTED");
    if (ok) await this.setFlags(orgId, { interestAt: new Date().toISOString() });
    return { sent: ok };
  }

  async start(u: AuthUser) {
    const c = await this.connect.get(u.orgId, { pull: false });
    if (c.legacy) throw conflict("ALREADY_CONNECTED", "This pharmacy is already connected");
    const t = await this.tenant(u.orgId);
    if (c.status === "STANDALONE" && !this.flags(t.settings).startedAt) {
      await this.setFlags(u.orgId, { startedAt: new Date().toISOString() });
      await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "kiorex_connect.started", entityType: "Tenant", entityId: u.orgId });
      void this.sendFunnel(u.orgId, t.marketCode, "STARTED");
    }
    return this.get(u.orgId);
  }

  async talk(u: AuthUser, input: TalkToUsInput) {
    const c = await this.connect.get(u.orgId, { pull: false }); if (c.legacy) throw conflict("ALREADY_CONNECTED", "This pharmacy is already connected");
    let clean; try { clean = cleanTalkToUs(input ?? {}); } catch (e) { if (e instanceof LeadInputError) throw badRequest(e.code, "Check the form", { field: e.field }); throw e; }
    const secret = leadSigningSecret(); const t = await this.tenant(u.orgId);
    if (!secret) throw conflict("KIOREX_NOT_CONFIGURED", "Kiorex connection is not configured for this deployment");
    const body = JSON.stringify({ nonce: newLeadNonce(), kind: "PHARMACY", orgRef: u.orgId, orgName: t.name, ...clean, locale: "en", market: t.marketCode, consent: true });
    let res: Response;
    try { res = await fetch(`${kiorexHost()}/api/v1/partners/v1/leads`, { method: "POST", headers: leadHeaders(secret, Math.floor(Date.now() / 1000), body), body, signal: AbortSignal.timeout(8000) }); }
    catch { throw conflict("KIOREX_UNREACHABLE", "Kiorex could not be reached. Nothing was sent. Try again."); }
    if (!res.ok) throw conflict(res.status === 429 ? "KIOREX_BUSY" : "KIOREX_REJECTED_REQUEST", "Kiorex did not accept the request", { status: res.status });
    await this.setFlags(u.orgId, { leadAt: new Date().toISOString(), interestAt: this.flags(t.settings).interestAt ?? new Date().toISOString() });
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "kiorex_connect.talk_to_us", entityType: "Tenant", entityId: u.orgId });
    return this.get(u.orgId);
  }

  private async sendFunnel(orgId: string, _market: string, stage: "INTERESTED" | "STARTED"): Promise<boolean> {
    const secret = leadSigningSecret(); if (!secret) return false;
    const body = JSON.stringify({ nonce: newLeadNonce(), kind: "PHARMACY", orgRef: orgId, stage });
    try { const r = await fetch(`${kiorexHost()}/api/v1/partners/v1/funnel`, { method: "POST", headers: leadHeaders(secret, Math.floor(Date.now() / 1000), body), body, signal: AbortSignal.timeout(4000) }); return r.ok; }
    catch (e) { this.log.warn(`funnel marker not sent (${(e as Error).name})`); return false; }
  }
}
