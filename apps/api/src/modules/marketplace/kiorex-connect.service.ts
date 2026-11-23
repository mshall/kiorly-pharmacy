import { Inject, Injectable } from "@nestjs/common";
import type { Prisma } from "../../generated/prisma/client";
import { AuditService } from "../../audit/audit.service";
import type { AuthUser } from "../../auth/auth-user";
import { badRequest, conflict } from "../../common/errors";
import { seal } from "../../common/secret-box";
import { PrismaService } from "../../prisma/prisma.service";
import { StorageAdapter } from "../../platform/adapters/storage.adapter";
import { MarketplaceService } from "./marketplace.service";
import { KIOREX_TERMS_VERSION, canRequest, deriveStatusToken, intakeUrl, kiorexHost, newClientKey, newSecret, progressPct, publicApiBase, signConnectBody, validatePayoutLabel, type ConnectStatus } from "./kiorex-connect.core";
import { computePharmacySteps } from "./kiorex-connect.logic";

interface Doc { status: ConnectStatus; terms?: { at: string; userId: string; version: string }; payoutLabel?: string; licenceDocument?: { at: string; bytes: number }; request?: { id: string; submittedAt: string; clientKey: string }; kiorex?: { status: string; at: string }; contactEmail?: string }

const kek = () => process.env.INTEGRATION_KEK ?? "dev-kek-change-me-dev-kek-change-me!";

/** Connect to Kiorex for a standalone pharmacy (ADR-040). State lives in Tenant.settings.kiorexConnect (no schema change); secrets are shown once and never logged. */
@Injectable()
export class KiorexConnectService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService, @Inject(AuditService) private readonly audit: AuditService,
    @Inject(MarketplaceService) private readonly market: MarketplaceService, @Inject(StorageAdapter) private readonly storage: StorageAdapter,
  ) {}

  private async tenant(orgId: string) { return this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } }); }
  private doc(settings: unknown): Doc | undefined { return (settings as { kiorexConnect?: Doc } | null)?.kiorexConnect; }
  private async save(orgId: string, patch: (d: Doc) => Doc) {
    const t = await this.tenant(orgId); const cur = this.doc(t.settings) ?? { status: "STANDALONE" as ConnectStatus };
    const settings = { ...((t.settings ?? {}) as Record<string, unknown>), kiorexConnect: patch(cur) };
    await this.prisma.tenant.update({ where: { id: orgId }, data: { settings: settings as unknown as Prisma.InputJsonValue } });
  }
  private async setMode(orgId: string, mode: "STANDALONE" | "INTEGRATED") {
    const t = await this.tenant(orgId);
    await this.prisma.tenant.update({ where: { id: orgId }, data: { settings: { ...((t.settings ?? {}) as Record<string, unknown>), mode } as unknown as Prisma.InputJsonValue } });
  }

  async get(orgId: string, opts: { pull?: boolean } = {}) {
    let t = await this.tenant(orgId); let d = this.doc(t.settings);
    // an organisation that already runs INTEGRATED with an active client is a legacy connection: nothing to request
    const activeClients = await this.prisma.integrationClient.count({ where: { orgId, active: true } });
    const legacy = !d && activeClients > 0 && ((t.settings ?? {}) as { mode?: string }).mode !== "STANDALONE";
    if (opts.pull !== false && d?.request && ["REQUESTED", "CHANGES_REQUESTED", "APPROVED", "PAUSED"].includes(d.status)) { await this.pull(orgId, d); t = await this.tenant(orgId); d = this.doc(t.settings); }
    const status: ConnectStatus = d?.status ?? (legacy ? "APPROVED" : "STANDALONE");
    const settings = await this.prisma.branchMarketplaceSetting.findMany({ where: { orgId, optedIn: true } });
    const branches = await this.prisma.branch.findMany({ where: { orgId, id: { in: settings.map((x) => x.branchId) }, active: true } });
    let priced = 0; try { priced = (await this.market.catalogue(orgId, {})).items.length; } catch { priced = 0; }
    const steps = computePharmacySteps({
      status, subscriptionStatus: t.subscriptionStatus, optedInBranches: branches.length, pricedItems: priced,
      branchesMissingHours: settings.filter((s) => !s.openingHours || Object.keys(s.openingHours as object).length === 0 || s.latitude == null || s.longitude == null).length,
      branchesMissingLicenceNo: branches.filter((b) => !b.licenceNo?.trim()).length, licenceDocument: !!d?.licenceDocument, payoutLabel: !!d?.payoutLabel, termsAccepted: !!d?.terms,
      liveOnKiorex: status === "APPROVED",
    });
    return { legacy, status, progress: legacy ? 100 : progressPct(steps), canRequest: !legacy && canRequest(steps, status), steps, kiorex: d?.kiorex ?? null, requestId: d?.request?.id ?? null, clientKey: d?.request?.clientKey ?? null, termsVersion: KIOREX_TERMS_VERSION, payoutLabel: d?.payoutLabel ?? null, terms: d?.terms ? { at: d.terms.at, version: d.terms.version } : null, licenceDocument: d?.licenceDocument ?? null, mode: ((t.settings ?? {}) as { mode?: string }).mode ?? (activeClients > 0 ? "INTEGRATED" : "STANDALONE") };
  }

  /** Branch opt-in lives here too: the regular Kiorex-orders settings routes are 403 STANDALONE_MODE for a pharmacy that has not connected yet. */
  async branches(orgId: string) {
    const [branches, settings] = await Promise.all([this.prisma.branch.findMany({ where: { orgId, active: true }, orderBy: { createdAt: "asc" } }), this.prisma.branchMarketplaceSetting.findMany({ where: { orgId } })]);
    return branches.map((b) => { const s = settings.find((x) => x.branchId === b.id); return { id: b.id, name: b.name, licenceNo: b.licenceNo, optedIn: s?.optedIn ?? false, openingHours: s?.openingHours ?? null, deliveryRadiusKm: s ? s.deliveryRadiusKm.toString() : "5", prepMinutes: s?.prepMinutes ?? 30, latitude: s?.latitude?.toString() ?? null, longitude: s?.longitude?.toString() ?? null }; });
  }
  async setBranch(u: AuthUser, branchId: string, d: { optedIn: boolean; deliveryRadiusKm?: string; openingHours?: Record<string, string[]>; prepMinutes?: number; latitude?: string; longitude?: string; licenceNo?: string }) {
    if (d.licenceNo !== undefined) { const r = await this.prisma.branch.updateMany({ where: { id: branchId, orgId: u.orgId }, data: { licenceNo: d.licenceNo.trim() || null } }); if (!r.count) throw badRequest("BRANCH_NOT_FOUND", "Branch not found"); }
    await this.market.putSetting(u, branchId, d);
    return this.branches(u.orgId);
  }

  async acceptTerms(u: AuthUser, version: string) {
    if (version !== KIOREX_TERMS_VERSION) throw badRequest("TERMS_VERSION_MISMATCH", "Reload the page: the terms changed");
    await this.save(u.orgId, (d) => ({ ...d, status: d.status === "STANDALONE" ? "CONSENTED" : d.status, terms: { at: new Date().toISOString(), userId: u.userId, version } }));
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "kiorex_connect.terms_accepted", entityType: "Tenant", entityId: u.orgId, meta: { version } });
    return this.get(u.orgId, { pull: false });
  }
  async setPayout(u: AuthUser, label: unknown) {
    const v = validatePayoutLabel(label);
    if (!v.ok) throw badRequest(v.code, v.code === "PAYOUT_LOOKS_LIKE_ACCOUNT_NUMBER" ? "Enter a short label only. Bank details are never stored here" : "Enter a short label (2 to 40 characters)");
    await this.save(u.orgId, (d) => ({ ...d, payoutLabel: v.value }));
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "kiorex_connect.payout_label_set", entityType: "Tenant", entityId: u.orgId });
    return this.get(u.orgId, { pull: false });
  }
  async uploadLicence(u: AuthUser, name: string, contentBase64: string) {
    const bytes = Buffer.from(contentBase64, "base64"); const type = /\.pdf$/i.test(name) ? "application/pdf" : /\.png$/i.test(name) ? "image/png" : "image/jpeg";
    const put = await this.storage.put(`tenants/${u.orgId}/kiorex-connect/licence`, bytes, type);
    await this.save(u.orgId, (d) => ({ ...d, licenceDocument: { at: new Date().toISOString(), bytes: put.bytes } }));
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "kiorex_connect.licence_uploaded", entityType: "Tenant", entityId: u.orgId, meta: { bytes: put.bytes } });
    return this.get(u.orgId, { pull: false });
  }

  /** Issues a fresh HMAC client + webhook secret for Kiorex, switches the pharmacy to INTEGRATED and submits the signed request. Secrets leave this method ONCE (rotation response) and are never logged. */
  async request(u: AuthUser, o: { rotate?: boolean; contactEmail?: string } = {}) {
    const state = await this.get(u.orgId, { pull: false });
    const d0 = this.doc((await this.tenant(u.orgId)).settings);
    if (state.legacy) throw conflict("ALREADY_CONNECTED", "This pharmacy is already connected");
    const rotating = !!o.rotate && state.status === "APPROVED";
    if (!rotating && !state.canRequest && state.status !== "REQUESTED") throw conflict("CONNECT_NOT_READY", "Finish every required step first", { open: state.steps.filter((s) => !s.optional && !["request", "live"].includes(s.key) && s.status !== "done").map((s) => s.key) });
    const t = await this.tenant(u.orgId); const host = kiorexHost();
    const clientKey = newClientKey("kp"); const clientSecret = newSecret(); const webhookSecret = newSecret();
    await this.prisma.integrationClient.create({ data: { orgId: u.orgId, key: clientKey, secretEnc: seal(clientSecret), webhookSecretEnc: seal(webhookSecret), kiorexBaseUrl: host } });
    const body = JSON.stringify({
      statusToken: deriveStatusToken(kek(), u.orgId), kind: "PHARMACY", orgRef: u.orgId, name: t.name, market: t.marketCode, locale: "en", contactEmail: o.contactEmail ?? d0?.contactEmail,
      baseUrl: publicApiBase(), clientKey, clientSecret, webhookSecret,
      readiness: { counts: { branches: state.steps.find((s) => s.key === "branch_optin")?.detail?.branches, items: state.steps.find((s) => s.key === "catalogue")?.detail?.priced }, documents: { licence: state.steps.find((s) => s.key === "licence")?.status === "done" }, termsAcceptedAt: d0?.terms?.at, termsVersion: d0?.terms?.version, steps: state.steps.map((s) => ({ key: s.key, status: s.status })) },
    });
    const ts = Math.floor(Date.now() / 1000);
    let res: Response;
    try { res = await fetch(intakeUrl(host), { method: "POST", headers: { "content-type": "application/json", "X-Kiorly-Timestamp": String(ts), "X-Kiorly-Signature": signConnectBody(webhookSecret, ts, body) }, body, signal: AbortSignal.timeout(8000) }); }
    catch { await this.prisma.integrationClient.updateMany({ where: { orgId: u.orgId, key: clientKey }, data: { active: false } }); throw conflict("KIOREX_UNREACHABLE", "Kiorex could not be reached. Nothing was sent. Try again."); }
    if (!res.ok) { await this.prisma.integrationClient.updateMany({ where: { orgId: u.orgId, key: clientKey }, data: { active: false } }); throw conflict("KIOREX_REJECTED_REQUEST", "Kiorex did not accept the request", { status: res.status }); }
    const sent = (await res.json()) as { id: string };
    await this.save(u.orgId, (d) => ({ ...d, status: rotating ? d.status : "REQUESTED", request: { id: sent.id, submittedAt: new Date().toISOString(), clientKey }, contactEmail: o.contactEmail ?? d.contactEmail }));
    await this.setMode(u.orgId, "INTEGRATED");
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: rotating ? "kiorex_connect.credentials_rotated" : "kiorex_connect.requested", entityType: "Tenant", entityId: u.orgId, meta: { requestId: sent.id, clientKey } });
    return { ...(await this.get(u.orgId, { pull: false })), ...(rotating ? { credentials: { clientKey, clientSecret, webhookSecret, shownOnce: true } } : {}) };
  }

  /** Polls Kiorex with the derived status token and maps its status to the pharmacy state. */
  async pull(orgId: string, d: Doc): Promise<void> {
    if (!d.request) return;
    try {
      const res = await fetch(`${intakeUrl(kiorexHost())}/${encodeURIComponent(d.request.id)}`, { headers: { "x-connection-token": deriveStatusToken(kek(), orgId) }, signal: AbortSignal.timeout(4000) });
      if (!res.ok) return;
      const s = (await res.json()) as { status: string };
      const map: Record<string, ConnectStatus | undefined> = { LIVE: "APPROVED", PAUSED: "PAUSED", REJECTED: "REJECTED", CHANGES_REQUESTED: "CHANGES_REQUESTED" };
      const next = map[s.status];
      await this.save(orgId, (cur) => ({ ...cur, kiorex: { status: s.status, at: new Date().toISOString() }, ...(next ? { status: next } : {}) }));
      if (next === "REJECTED") await this.setMode(orgId, "STANDALONE");
    } catch { /* Kiorex unreachable: keep the last known state */ }
  }
}
