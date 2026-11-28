import { Inject, Injectable, Logger } from "@nestjs/common";
import { Prisma, type Edition } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { DomainError } from "../common/errors";
import { PRICE_EDITIONS, parsePriceRequest, planNextVersion, type SegmentRow } from "./plan-price-logic";

const row = (r: { id: string; edition: string; marketCode: string; interval: string; currency: string; amount: Prisma.Decimal; validFrom: Date; validTo: Date | null; priceVersion: number; proposalId: string | null; proposedBy: string | null; publishedBy: string | null; createdAt: Date }) => ({
  id: r.id, edition: r.edition, marketCode: r.marketCode, interval: r.interval, currency: r.currency, amount: r.amount.toFixed(2),
  validFrom: r.validFrom.toISOString(), validTo: r.validTo?.toISOString() ?? null, priceVersion: r.priceVersion, proposalId: r.proposalId, proposedBy: r.proposedBy, publishedBy: r.publishedBy, createdAt: r.createdAt.toISOString(),
});
const seg = (r: { id: string; priceVersion: number; validFrom: Date; validTo: Date | null; amount: Prisma.Decimal; currency: string }): SegmentRow => ({ id: r.id, priceVersion: r.priceVersion, validFrom: r.validFrom, validTo: r.validTo, amount: r.amount.toFixed(2), currency: r.currency });

/**
 * Plan prices of this product (single source of truth). Read and write only through the signed platform route; nothing here invents or seeds a price.
 * Publishing is append-only: the new version ends the version in force at its start (validTo), never edits it. Idempotent per approved proposal.
 */
@Injectable()
export class PlanPricesService {
  private readonly log = new Logger(PlanPricesService.name);
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /** Every price version (newest first) and how many organisations sit on each edition per market (for the console and the impact preview). */
  async overview() {
    const [rows, tenants] = await Promise.all([
      this.prisma.planPrice.findMany({ orderBy: [{ edition: "asc" }, { marketCode: "asc" }, { interval: "asc" }, { priceVersion: "desc" }] }),
      this.prisma.tenant.groupBy({ by: ["edition", "marketCode"], _count: { _all: true } }),
    ]);
    return {
      editions: [...PRICE_EDITIONS],
      prices: rows.map(row),
      organisations: tenants.filter((t) => (PRICE_EDITIONS as readonly string[]).includes(t.edition)).map((t) => ({ edition: t.edition, marketCode: t.marketCode, count: t._count._all })),
    };
  }

  async request(body: unknown, now = new Date()) {
    const q = parsePriceRequest(body, now);
    const edition = q.edition as Edition;
    const segWhere = { edition, marketCode: q.marketCode, interval: q.interval };

    if (q.preview) {
      const rows = (await this.prisma.planPrice.findMany({ where: segWhere })).map(seg);
      const { priceVersion, supersedes } = planNextVersion(rows, q.validFrom);
      const count = await this.prisma.tenant.count({ where: { edition, marketCode: q.marketCode } });
      const current = supersedes[0] ?? null;
      return { preview: true as const, priceVersion, supersedes: supersedes.length > 0, validFrom: q.validFrom.toISOString(), impact: { organisationsAffected: count, from: current ? { amount: current.amount, currency: current.currency, priceVersion: current.priceVersion } : null, to: { amount: q.amount, currency: q.currency } } };
    }

    const approval = q.approval!;
    const existing = await this.prisma.planPrice.findUnique({ where: { proposalId: approval.proposalId } });
    if (existing) return { published: true as const, idempotent: true, price: row(existing) };
    try {
      const created = await this.prisma.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`planprice:${q.edition}:${q.marketCode}:${q.interval}`}))`;
        const rows = (await tx.planPrice.findMany({ where: segWhere })).map(seg);
        const { priceVersion, supersedes } = planNextVersion(rows, q.validFrom);
        for (const r of supersedes) await tx.planPrice.update({ where: { id: r.id }, data: { validTo: q.validFrom } });
        return tx.planPrice.create({ data: { edition, marketCode: q.marketCode, interval: q.interval, currency: q.currency, amount: new Prisma.Decimal(q.amount), validFrom: q.validFrom, priceVersion, proposalId: approval.proposalId, proposedBy: approval.proposedBy, publishedBy: q.actorId } });
      });
      this.log.log(`plan price published: ${q.edition} ${q.marketCode} ${q.interval} v${created.priceVersion} (proposal ${approval.proposalId})`);
      return { published: true as const, idempotent: false, price: row(created) };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        const again = await this.prisma.planPrice.findUnique({ where: { proposalId: approval.proposalId } });
        if (again) return { published: true as const, idempotent: true, price: row(again) };
        throw new DomainError("PRICE_VERSION_CONFLICT", "Another price version was published at the same time: preview again", 409);
      }
      throw e;
    }
  }
}
