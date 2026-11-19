import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PARTNER_WEBHOOK_PATH, signWebhook, verifyWebhook, WEBHOOK_HEADERS } from "@kiorex/contracts";
import { open } from "../common/secret-box";
import { PrismaService } from "../prisma/prisma.service";

const MAX_ATTEMPTS = 8;
export type KiorexMode = "mock" | "real";
export const kiorexMode = (): KiorexMode => (process.env.KIOREX_MODE === "real" ? "real" : "mock");

/**
 * Delivers PENDING outbox rows to Kiorex, signed with the Kiorly webhook scheme
 * (X-Kiorly-Timestamp seconds, X-Kiorly-Event, X-Kiorly-Event-Id, X-Kiorly-Signature: sha256=HMAC(secret, `${ts}.${body}`)).
 * KIOREX_MODE=mock (default): same signing path, but the "receiver" is a local verifier (verifyWebhook) — no network.
 * KIOREX_MODE=real: POSTs to `${IntegrationClient.kiorexBaseUrl}/api/v1/webhooks/pharmacy` (fallback KIOREX_WEBHOOK_URL), signed with the
 * tenant's per-partner webhook secret and carrying X-Kiorly-Client-Key so Kiorex picks that secret (kiorex-contracts 1.4.0).
 * Failure => exponential backoff, FAILED after 8 attempts (ops replay); Kiorex de-duplicates on eventId, so retries are safe.
 */
@Injectable()
export class OutboxDeliveryService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(OutboxDeliveryService.name);
  private timer: NodeJS.Timeout | null = null;
  /** Mock mode: every delivered, signature-verified envelope (dev inbox). */
  readonly mockInbox: Array<{ eventId: string; type: string; body: string }> = [];

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  onModuleInit() {
    if (process.env.OUTBOX_POLL_ENABLED !== "false" && process.env.NODE_ENV !== "test") {
      this.timer = setInterval(() => void this.deliverDue().catch((e) => this.log.warn(String(e))), Number(process.env.OUTBOX_POLL_INTERVAL_MS ?? 5000));
      this.timer.unref();
    }
  }
  onModuleDestroy() { if (this.timer) clearInterval(this.timer); }

  /** Per-tenant delivery target; env values are the single-tenant dev fallback. */
  private async target(orgId: string): Promise<{ secret: string; url: string; clientKey?: string }> {
    const c = await this.prisma.integrationClient.findFirst({ where: { orgId, active: true }, orderBy: { createdAt: "asc" } });
    const secret = c?.webhookSecretEnc ? open(c.webhookSecretEnc) : (process.env.KIOREX_WEBHOOK_SECRET ?? "kx_dev_pharmacy_webhook_secret");
    const url = c?.kiorexBaseUrl ? `${c.kiorexBaseUrl.replace(/\/+$/, "")}${PARTNER_WEBHOOK_PATH.pharmacy}` : (process.env.KIOREX_WEBHOOK_URL ?? `http://localhost:4000${PARTNER_WEBHOOK_PATH.pharmacy}`);
    return { secret, url, clientKey: c?.key };
  }

  async deliverDue(limit = 50): Promise<{ sent: number; failed: number }> {
    const due = await this.prisma.outboxEvent.findMany({
      where: { status: "PENDING", OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: new Date() } }] },
      orderBy: { occurredAt: "asc" }, take: limit,
    });
    let sent = 0, failed = 0;
    for (const ev of due) {
      const body = JSON.stringify(ev.payload);
      try {
        const t = await this.target(ev.orgId);
        const signed = signWebhook({ secret: t.secret, eventType: ev.type, eventId: ev.id, body, clientKey: t.clientKey });
        if (kiorexMode() === "mock") {
          const ok = verifyWebhook({ secret: t.secret, body, timestamp: signed.timestamp, signature: signed.signature });
          if (!ok.ok) throw new Error(`mock receiver rejected signature: ${ok.reason}`);
          this.mockInbox.push({ eventId: ev.id, type: ev.type, body });
          if (this.mockInbox.length > 500) this.mockInbox.shift();
        } else {
          const res = await fetch(t.url, { method: "POST", headers: signed.headers, body, signal: AbortSignal.timeout(8000) });
          if (!res.ok) throw new Error(`Kiorex responded ${res.status}`);
        }
        await this.prisma.outboxEvent.update({ where: { id: ev.id }, data: { status: "SENT", sentAt: new Date(), attempts: { increment: 1 }, lastError: null } });
        sent++;
      } catch (err) {
        failed++;
        const attempts = ev.attempts + 1;
        await this.prisma.outboxEvent.update({
          where: { id: ev.id },
          data: { attempts, lastError: (err as Error).message.slice(0, 500), status: attempts >= MAX_ATTEMPTS ? "FAILED" : "PENDING", nextAttemptAt: new Date(Date.now() + Math.min(2 ** attempts, 600) * 1000) },
        });
      }
    }
    return { sent, failed };
  }
}
export { WEBHOOK_HEADERS };
