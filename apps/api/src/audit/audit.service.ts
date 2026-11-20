import { Inject, Injectable } from "@nestjs/common";
import type { Prisma, PrismaClient } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export interface AuditEntry {
  orgId: string;
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  /** Ids and field names only — NEVER PHI (names, phones, national IDs). */
  meta?: Prisma.InputJsonValue;
}

const PHI_KEYS = /(name|phone|nationalid|address|email|allerg)/i;

/** Appends to AuditLog (append-only at DB level). Pass the transaction client so the audit row commits with the change. */
@Injectable()
export class AuditService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async record(entry: AuditEntry, db: PrismaClient | Prisma.TransactionClient = this.prisma): Promise<void> {
    await db.auditLog.create({
      data: {
        orgId: entry.orgId, actorId: entry.actorId ?? null, action: entry.action, entityType: entry.entityType, entityId: entry.entityId,
        meta: scrub(entry.meta) as Prisma.InputJsonValue | undefined,
      },
    });
  }
}

/** Defence in depth: drop obviously-PHI keys from audit meta. */
export function scrub(meta: unknown): unknown {
  if (meta == null || typeof meta !== "object") return meta ?? undefined;
  if (Array.isArray(meta)) return meta.map(scrub);
  return Object.fromEntries(Object.entries(meta as Record<string, unknown>).filter(([k]) => !PHI_KEYS.test(k)).map(([k, v]) => [k, scrub(v)]));
}
