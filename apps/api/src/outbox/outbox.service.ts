import { Inject, Injectable } from "@nestjs/common";
import type { Prisma, PrismaClient } from "../generated/prisma/client";
import { createId } from "../common/ids";
import { validateEvent } from "@kiorex/contracts";
import { PrismaService } from "../prisma/prisma.service";
import { DomainError } from "../common/errors";

export interface EnqueueInput {
  orgId: string;
  type: "DispenseCompleted" | "OrderReady" | "OrderRejected";
  aggregateId: string;
  data: Record<string, unknown>;
  /** Same (orgId, dedupeKey) enqueues once. */
  dedupeKey: string;
}

/**
 * Transactional outbox (ADR-006, PH-F08). Call inside the same $transaction as the state change so the event
 * exists iff the change committed. Fails closed: an envelope that does not validate against @kiorex/contracts is never written.
 */
@Injectable()
export class OutboxService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async enqueue(input: EnqueueInput, db: PrismaClient | Prisma.TransactionClient = this.prisma): Promise<{ id: string; created: boolean }> {
    const existing = await db.outboxEvent.findUnique({ where: { orgId_dedupeKey: { orgId: input.orgId, dedupeKey: input.dedupeKey } } });
    if (existing) return { id: existing.id, created: false };
    const id = createId();
    const envelope = {
      eventId: id, type: input.type, aggregateType: "PharmacyOrder", aggregateId: input.aggregateId,
      target: "KIOREX", occurredAt: new Date().toISOString(), data: input.data,
    };
    const v = validateEvent(input.type, envelope);
    if (!v.valid) throw new DomainError("EVENT_CONTRACT_VIOLATION", `Outbound ${input.type} does not match @kiorex/contracts`, 500, v.errors);
    await db.outboxEvent.create({
      data: { id, orgId: input.orgId, type: input.type, aggregateType: "PharmacyOrder", aggregateId: input.aggregateId, payload: envelope as Prisma.InputJsonValue, dedupeKey: input.dedupeKey, target: "KIOREX" },
    });
    return { id, created: true };
  }
}
