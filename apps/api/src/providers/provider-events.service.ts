import { BadRequestException, Inject, Injectable, Logger, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PayLinksService } from "../modules/pos/paylinks.service";
import { messageProvider } from "./messaging-provider";
import { paymentProvider } from "./payment-provider";
import { consentRegistry } from "./consent-provider";
import { ConsentService } from "../platform/adapters/consent.service";
import { providerConfig, webhookSecretFor, type ProviderKind } from "./provider-env";
import { VENDOR_WEBHOOKS, vendorOf } from "./vendor-kit";
import type { CanonicalEvent, MessageChannelKind } from "./provider-types";
import { verifyWebhookSignature } from "./webhook-signature";

const RANK: Record<string, number> = { QUEUED: 0, SENT: 1, DELIVERED: 2 };

/**
 * Provider callbacks (delivery receipts, payment status, consent revocations). One entry point for the public webhook AND the dev simulator:
 * verify HMAC -> parse (mapping layer) -> dedupe by event id -> apply. Persisted state: Notification (message status) and PayLink / customer credit entries.
 */
@Injectable()
export class ProviderEventsService {
  private readonly log = new Logger(ProviderEventsService.name);
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(PayLinksService) private readonly payLinks: PayLinksService, @Inject(ConsentService) private readonly consents: ConsentService) {}

  async ingest(kind: ProviderKind, rawBody: string, signature: string | undefined, ctx: { headers?: Record<string, unknown>; query?: Record<string, unknown> } = {}) {
    const secret = webhookSecretFor(kind);
    if (!secret) throw new ServiceUnavailableException({ code: "WEBHOOK_NOT_CONFIGURED", message: `${kind}_WEBHOOK_SECRET is not set` });
    const vendor = providerConfig(kind).mode === "real" ? vendorOf(kind) : undefined;
    let events: CanonicalEvent[];
    if (vendor) { // native vendor: its own signature scheme and body format (see vendor-kit.ts)
      const hook = VENDOR_WEBHOOKS[vendor];
      if (!hook.verify({ secret, rawBody, headers: ctx.headers ?? {}, query: ctx.query ?? {}, publicUrl: process.env[`${kind}_WEBHOOK_PUBLIC_URL`] })) throw new UnauthorizedException({ code: "INVALID_WEBHOOK_SIGNATURE", message: "MISMATCH", reason: "MISMATCH" });
      const confirm = hook.confirmUrl?.(rawBody);
      if (confirm) { await fetch(confirm).catch(() => undefined); return { accepted: 0, applied: 0, duplicates: 0, unmatched: 0 }; } // SNS subscription handshake
      try { events = hook.parse(rawBody); } catch { throw new BadRequestException({ code: "INVALID_WEBHOOK_EVENT" }); }
    } else {
      const v = verifyWebhookSignature(secret, rawBody, signature);
      if (!v.ok) throw new UnauthorizedException({ code: "INVALID_WEBHOOK_SIGNATURE", message: v.reason, reason: v.reason });
      let json: unknown;
      try { json = JSON.parse(rawBody); } catch { throw new BadRequestException({ code: "INVALID_JSON" }); }
      try {
        events = kind === "CONSENT" ? consentRegistry(process.env).parseWebhook(json) : kind === "PAYMENT" ? paymentProvider(process.env).parseWebhook(json) : messageProvider(kind as MessageChannelKind, process.env).parseWebhook(json);
      } catch { throw new BadRequestException({ code: "INVALID_WEBHOOK_EVENT" }); }
    }
    let applied = 0, duplicates = 0, unmatched = 0;
    for (const e of events) {
      try {
        await this.prisma.providerWebhookEvent.create({ data: { kind, eventId: e.eventId, type: e.type } });
      } catch { duplicates++; continue; }
      try {
        if (await this.apply(e)) applied++; else unmatched++;
      } catch (err) {
        // let the provider retry: forget the dedupe row so the replay is applied
        await this.prisma.providerWebhookEvent.deleteMany({ where: { kind, eventId: e.eventId } });
        this.log.error(`webhook ${kind} ${e.type} failed to apply: ${(err as Error).message}`);
        throw err;
      }
    }
    return { accepted: events.length, applied, duplicates, unmatched };
  }

  private async apply(e: CanonicalEvent): Promise<boolean> {
    switch (e.type) {
      case "message.sent": case "message.delivered": case "message.read": case "message.failed": return this.applyMessage(e);
      case "payment.succeeded": return this.payLinks.onPaid(e.providerRef, e.amount);
      case "payment.failed": return this.payLinks.onNotPaid(e.providerRef, "FAILED", e.error);
      case "payment.expired": return this.payLinks.onNotPaid(e.providerRef, "EXPIRED");
      case "refund.succeeded": return this.payLinks.onRefundSucceeded(e.providerRef);
      case "refund.failed": return this.payLinks.onRefundFailed(e.providerRef, e.error);
      case "consent.granted": case "consent.revoked": case "consent.expired": return this.consents.onEvent(e);
    }
  }

  /** Receipts can arrive out of order: delivered/read never downgrade, failed never overrides a delivered message. */
  private async applyMessage(e: CanonicalEvent): Promise<boolean> {
    const row = await this.prisma.notification.findFirst({ where: { providerMessageId: e.providerRef } });
    if (!row) return false;
    const cur = RANK[row.status] ?? 0;
    if (e.type === "message.failed") {
      if (cur < RANK.DELIVERED && row.status !== "FAILED") await this.prisma.notification.update({ where: { id: row.id }, data: { status: "FAILED", error: (e.error ?? "PROVIDER_REPORTED_FAILURE").slice(0, 200) } });
    } else if (e.type === "message.sent") {
      if (row.status === "QUEUED") await this.prisma.notification.update({ where: { id: row.id }, data: { status: "SENT", sentAt: new Date() } });
    } else if (cur < RANK.DELIVERED || row.status === "FAILED") {
      await this.prisma.notification.update({ where: { id: row.id }, data: { status: "DELIVERED", deliveredAt: e.occurredAt ? new Date(e.occurredAt) : new Date(), error: null } });
    }
    return true;
  }
}
