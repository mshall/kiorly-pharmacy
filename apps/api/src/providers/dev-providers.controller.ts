import { BadRequestException, Body, ConflictException, Controller, Get, Inject, NotFoundException, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { randomUUID } from "node:crypto";
import { CurrentUser, Perm } from "../auth/decorators";
import type { AuthUser } from "../auth/auth-user";
import { NotificationsService, renderSubject } from "../platform/adapters/notifications.service";
import { PayLinksService } from "../modules/pos/paylinks.service";
import { PrismaService } from "../prisma/prisma.service";
import { ProviderEventsService } from "./provider-events.service";
import { MOCK_WEBHOOK_SECRET, PROVIDER_KINDS, WEBHOOK_KINDS, devToolsEnabled, providerConfig, providerMode, webhookSecretFor, type ProviderKind } from "./provider-env";
import type { CanonicalEventType } from "./provider-types";
import { signWebhook } from "./webhook-signature";
import { AiGateway } from "../platform/adapters/ai.gateway";
import { ConsentService } from "../platform/adapters/consent.service";
import { StorageAdapter } from "../platform/adapters/storage.adapter";
import { CONSENT_PURPOSES } from "./provider-types";
import { verifyDownload } from "./storage-policy";

const EVENT_TYPES: CanonicalEventType[] = ["message.sent", "message.delivered", "message.read", "message.failed", "payment.succeeded", "payment.failed", "payment.expired", "refund.succeeded", "refund.failed", "consent.granted", "consent.revoked", "consent.expired"];
const on = () => { if (!devToolsEnabled()) throw new NotFoundException(); };

/**
 * DEV ONLY (404 in production or with PROVIDER_DEV_TOOLS=false). See the mock "sent messages", simulate provider webhooks (signed with the
 * kind's webhook secret and ingested through the SAME verify/dedupe/apply path as the public endpoint) and run every demo flow end to end.
 */
@ApiTags("dev-providers")
@ApiBearerAuth()
@Controller("dev/providers")
export class DevProvidersController {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(NotificationsService) private readonly notify: NotificationsService,
    @Inject(PayLinksService) private readonly payLinks: PayLinksService,
    @Inject(ProviderEventsService) private readonly events: ProviderEventsService,
    @Inject(ConsentService) private readonly consents: ConsentService,
    @Inject(AiGateway) private readonly ai: AiGateway,
    @Inject(StorageAdapter) private readonly storage: StorageAdapter,
  ) {}

  /** Modes and which credentials are set (booleans only, never values). */
  @Get("status") @Perm("settings.write")
  status() {
    on();
    return PROVIDER_KINDS.map((k) => { const c = providerConfig(k); return { kind: k, mode: providerMode(k), apiUrlSet: !!c.apiUrl, apiKeySet: !!c.apiKey, webhookSecretSet: !!c.webhookSecret, senderIdSet: !!c.senderId, ...(k === "AI" ? { modelSet: !!c.model } : {}) }; });
  }

  /** Everything "sent" by the (mock or real) messaging providers, newest first, with the rendered body. */
  @Get("messages") @Perm("settings.write")
  async messages(@CurrentUser() u: AuthUser, @Query() q: { channel?: string; limit?: string }) {
    on();
    const rows = await this.prisma.notification.findMany({ where: { orgId: u.orgId, ...(q.channel ? { channel: q.channel as never } : {}) }, orderBy: { createdAt: "desc" }, take: Math.min(Number(q.limit) || 50, 200) });
    return rows.map((r) => ({ ...r, subject: r.channel === "EMAIL" ? renderSubject(r.template, r.locale === "en" ? "en" : "ar", {}) : undefined }));
  }

  @Get("pay-links") @Perm("settings.write")
  payLinkList(@CurrentUser() u: AuthUser) { on(); return this.payLinks.list(u.orgId); }

  /** Simulate a provider callback. Mock mode only. Body: { kind, type, providerRef, error?, amount?, eventId? }. */
  @Post("simulate/webhook") @Perm("settings.write")
  async simulate(@Body() b: { kind: string; type: CanonicalEventType; providerRef: string; error?: string; amount?: string; eventId?: string }) {
    on();
    return this.simulateEvent(b.kind, b.type, b.providerRef, { error: b.error, amount: b.amount, eventId: b.eventId });
  }

  private async simulateEvent(kindIn: string, type: CanonicalEventType, providerRef: string, x: { error?: string; amount?: string; eventId?: string } = {}) {
    const kind = String(kindIn).toUpperCase() as ProviderKind;
    if (!WEBHOOK_KINDS.includes(kind)) throw new BadRequestException({ code: "UNKNOWN_KIND", kinds: WEBHOOK_KINDS });
    if (!EVENT_TYPES.includes(type) || !providerRef) throw new BadRequestException({ code: "BAD_EVENT", types: EVENT_TYPES });
    if (providerMode(kind) !== "mock") throw new ConflictException({ code: "SIMULATION_ONLY_IN_MOCK_MODE", message: `${kind}_MODE is real; the provider sends real callbacks` });
    const body = JSON.stringify({ id: x.eventId ?? `evt_sim_${randomUUID()}`, type, createdAt: new Date().toISOString(), data: { id: providerRef, ...(x.error ? { error: x.error } : {}), ...(x.amount ? { amount: x.amount } : {}) } });
    const result = await this.events.ingest(kind, body, signWebhook(webhookSecretFor(kind) ?? MOCK_WEBHOOK_SECRET, body));
    return { simulated: type, providerRef, ...result };
  }

  /** Consent: grant MARKETING for a demo customer, check status, revoke (mock: the registry's signed `consent.revoked` callback; real: a local revoke synced to the registry), check status again. */
  @Post("consent/demo") @Perm("settings.write")
  async consentDemo(@CurrentUser() u: AuthUser) { on(); return this.runConsentDemo(u); }

  private async runConsentDemo(u: AuthUser) {
    let p = await this.prisma.patientRef.findFirst({ where: { orgId: u.orgId, displayName: "Demo Consent Customer (DEMO)" } });
    if (!p) p = await this.prisma.patientRef.create({ data: { orgId: u.orgId, displayName: "Demo Consent Customer (DEMO)", phone: "+201000000005", consentMarketing: true, consentDataProcessing: true } });
    await this.prisma.patientRef.update({ where: { id: p.id }, data: { consentMarketing: true } });
    const granted = await this.consents.grant(u.orgId, { subjectRef: p.id, patientId: p.id, purpose: "MARKETING", source: "DEV_DEMO", actorId: u.userId });
    const before = await this.consents.status(u.orgId, p.id, "MARKETING");
    let revoke: unknown;
    if (providerMode("CONSENT") === "mock") revoke = await this.simulateEvent("CONSENT", "consent.revoked", granted.providerRef!, { error: "patient withdrew consent (demo)" });
    else { await this.consents.revoke(u.orgId, granted.id, "demo revoke", u.userId); revoke = { via: "local revoke synced to the registry" }; }
    const after = await this.consents.status(u.orgId, p.id, "MARKETING");
    const patient = await this.prisma.patientRef.findUniqueOrThrow({ where: { id: p.id }, select: { consentMarketing: true } });
    return { purposes: CONSENT_PURPOSES, customerId: p.id, consentId: granted.id, providerRef: granted.providerRef, validAfterGrant: before.valid, revoke, validAfterRevoke: after.valid, customerMarketingFlag: patient.consentMarketing, record: after.history[0] };
  }

  /** AI: sends a sample prompt containing fake PHI through the gateway; returns the redacted prompt that left the building, the labelled answer, token usage. Body: { prompt?, names? }. */
  @Post("ai/sample") @Perm("settings.write")
  async aiSample(@CurrentUser() u: AuthUser, @Body() b: { prompt?: string; names?: string[] } = {}) {
    on();
    return this.ai.assist({
      orgId: u.orgId, actorId: u.userId, task: "dev.sample", names: b.names ?? ["Mona Hassan"],
      prompt: b.prompt ?? "Patient Mona Hassan (phone +201001234567, email mona.demo@example.test, DOB 1984-03-02, MRN 884213) asks whether metformin 500 mg can be taken with ibuprofen. Summarise key counselling points.",
    });
  }

  /** Storage: put a tiny PNG, read it back, mint a signed URL, prove a tampered / expired signature is rejected. Mock = local disk, real = the object gateway. */
  @Post("storage/roundtrip") @Perm("settings.write")
  async storageRoundtrip(@CurrentUser() u: AuthUser) {
    on();
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
    const put = await this.storage.putDataUrl(`dev-demo/${u.orgId}/roundtrip-${randomUUID()}`, `data:image/png;base64,${png.toString("base64")}`);
    const got = await this.storage.get(put.key);
    const url = this.storage.signedUrl(put.key, 60);
    const q = new URL(`http://x${url.path}`).searchParams;
    const tampered = verifyDownload(put.key, q.get("exp")!, "0".repeat(64));
    const expired = verifyDownload(put.key, q.get("exp")!, q.get("sig")!, process.env, Date.now() + 3_600_000);
    return { key: put.key, bytes: put.bytes, contentType: put.contentType, readBack: { bytes: got?.bytes.length ?? null, identical: !!got && got.bytes.equals(png), contentType: got?.contentType }, signedUrl: url.path, expiresAt: url.expiresAt, tamperedSignature: tampered, afterExpiry: expired };
  }

  /**
   * Runs every demo flow in mock mode: pharmacy order-ready (WhatsApp), refill reminder (WhatsApp), receipt email, delivery receipts for each;
   * then (unless { payments: false }) pay-by-link success -> refund and a failing link on the first customer account with a balance (one is created when none exists),
   * then consent grant/revoke, an AI sample with the redacted prompt, and a storage put/get round trip (each skippable with { consent|ai|storage: false }).
   */
  @Post("demo/run") @Perm("settings.write")
  async demo(@CurrentUser() u: AuthUser, @Body() b: { payments?: boolean; consent?: boolean; ai?: boolean; storage?: boolean } = {}) {
    on();
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
    const sends: { flow: string; channel: "WHATSAPP" | "SMS" | "EMAIL"; to: string; template: string; vars: Record<string, string | number> }[] = [
      { flow: "order ready (WhatsApp)", channel: "WHATSAPP", to: "+201000000001", template: "order.ready", vars: { pharmacy: t.name, order: "DEMO-ORD-1", method: "pickup" } },
      { flow: "refill reminder (WhatsApp)", channel: "WHATSAPP", to: "+201000000002", template: "rx.refill_reminder", vars: { pharmacy: t.name, rx: "DEMO01", date: new Date().toISOString().slice(0, 10) } },
      { flow: "receipt email", channel: "EMAIL", to: "customer.demo@example.test", template: "receipt.email", vars: { pharmacy: t.name, receipt: "R-DEMO-1", date: new Date().toISOString().slice(0, 10), total: "125.50", currency: "EGP" } },
      { flow: "receipt SMS", channel: "SMS", to: "+201000000003", template: "receipt.email", vars: { pharmacy: t.name, receipt: "R-DEMO-2", date: new Date().toISOString().slice(0, 10), total: "48.00", currency: "EGP" } },
    ];
    const messages: unknown[] = [];
    for (const s of sends) {
      const n = await this.notify.send({ orgId: u.orgId, channel: s.channel, recipient: s.to, template: s.template, locale: "en", vars: s.vars, refType: "DemoFlow", refId: s.flow });
      let receipt: unknown = null;
      if (n.providerMessageId && n.status !== "FAILED" && providerMode(s.channel) === "mock") receipt = await this.simulateEvent(s.channel, "message.delivered", n.providerMessageId);
      messages.push({ flow: s.flow, notificationId: n.id, status: n.status, providerMessageId: n.providerMessageId, receipt });
    }
    const payments: Record<string, unknown> = {};
    if (b.payments !== false && providerMode("PAYMENT") === "mock") {
      let acc = await this.prisma.customerAccount.findFirst({ where: { orgId: u.orgId, balance: { gt: 5 } }, orderBy: { createdAt: "desc" } });
      if (!acc) {
        const p = await this.prisma.patientRef.create({ data: { orgId: u.orgId, displayName: "Demo Credit Customer (DEMO)", phone: "+201000000004", email: "credit.demo@example.test" } });
        acc = await this.prisma.customerAccount.create({ data: { orgId: u.orgId, patientId: p.id, creditLimit: 500, balance: 120 } });
        await this.prisma.customerCreditEntry.create({ data: { orgId: u.orgId, accountId: acc.id, kind: "CHARGE", amount: 120, note: "demo balance", createdBy: u.userId } });
      }
      const ok = await this.payLinks.create(u, acc.id, { amount: "1.00" }, `demo-ok-${randomUUID()}`);
      payments.success = { linkId: ok.link.id, payUrl: ok.link.payUrl, paid: await this.simulateEvent("PAYMENT", "payment.succeeded", ok.link.providerRef!, { amount: "1.00" }) };
      payments.refund = await this.payLinks.refund(u, ok.link.id, { reason: "demo refund" });
      const bad = await this.payLinks.create(u, acc.id, { amount: "1.00" }, `demo-fail-${randomUUID()}`);
      payments.failure = { linkId: bad.link.id, result: await this.simulateEvent("PAYMENT", "payment.failed", bad.link.providerRef!, { error: "card_declined" }) };
      payments.account = acc.id;
    }
    const extras: Record<string, unknown> = {};
    if (b.consent !== false) extras.consent = await this.runConsentDemo(u);
    if (b.ai !== false) extras.ai = await this.aiSample(u);
    if (b.storage !== false) extras.storage = await this.storageRoundtrip(u);
    return { messages, payments, ...extras };
  }
}
