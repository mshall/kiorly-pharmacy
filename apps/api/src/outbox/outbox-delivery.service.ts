import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { signWebhook, verifyWebhook, WEBHOOK_HEADERS } from "@kiorex/contracts";
import { PrismaService } from "../prisma/prisma.service";

const MAX_ATTEMPTS = 8;
export type KiorexMode = "mock" | "real";
export const kiorexMode = (): KiorexMode => (process.env.KIOREX_MODE === "real" ? "real" : "mock");

/**
 * Delivers PENDING outbox rows to Kiorex, signed with the Kiorly webhook scheme
 * (X-Kiorly-Timestamp seconds, X-Kiorly-Event, X-Kiorly-Event-Id, X-Kiorly-Signature: sha256=HMAC(secret, `${ts}.${body}`)).
 * KIOREX_MODE=mock (default): same signing path, but the "receiver" is a local verifier (verifyWebhook) — no network.
 * KIOREX_MODE=real: POSTs to KIOREX_WEBHOOK_URL (Provider go-live task in NEEDS_HUMAN.md).
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

  private secret(): string { return process.env.KIOREX_WEBHOOK_SECRET ?? "kx_dev_webhook_secret"; }

  async deliverDue(limit = 50): Promise<{ sent: number; failed: number }> {
    const due = await this.prisma.outboxEvent.findMany({
      where: { status: "PENDING", OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: new Date() } }] },
      orderBy: { occurredAt: "asc" }, take: limit,
    });
    let sent = 0, failed = 0;
    for (const ev of due) {
      const body = JSON.stringify(ev.payload);
      try {
        const signed = signWebhook({ secret: this.secret(), eventType: ev.type, eventId: ev.id, body });
        if (kiorexMode() === "mock") {
          const ok = verifyWebhook({ secret: this.secret(), body, timestamp: signed.timestamp, signature: signed.signature });
          if (!ok.ok) throw new Error(`mock receiver rejected signature: ${ok.reason}`);
          this.mockInbox.push({ eventId: ev.id, type: ev.type, body });
          if (this.mockInbox.length > 500) this.mockInbox.shift();
        } else {
          const url = process.env.KIOREX_WEBHOOK_URL;
          if (!url) throw new Error("KIOREX_WEBHOOK_URL not configured");
          const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json", ...signed.headers }, body });
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
