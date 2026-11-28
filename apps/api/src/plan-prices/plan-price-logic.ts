import { DomainError } from "../common/errors";

/**
 * LG-SUB-1/6/7: effective-dated, versioned plan prices per market and currency for the paid editions of this product (monthly and annual).
 * PURE helpers: no I/O. The product owns the PlanPrice rows (single source of truth); Kiorex only proposes and approves a version through the signed
 * `/marketplace/v1/plans` route (maker-checker lives in the Kiorex platform; this product enforces that the maker and the approver differ, too).
 * Nothing here ships a number: the table starts empty and stays empty until someone publishes a price.
 */
export const PRICE_EDITIONS = ["LITE", "PRO", "CHAIN"] as const;
export type PriceEdition = (typeof PRICE_EDITIONS)[number];
export const PRICE_INTERVALS = ["MONTHLY", "ANNUAL"] as const;
export type PriceInterval = (typeof PRICE_INTERVALS)[number];

const MONEY = /^\d{1,12}(\.\d{1,2})?$/;
const MARKET = /^[A-Z]{2}$/;
const CURRENCY = /^[A-Z]{3}$/;
const REF = /^[A-Za-z0-9_@.\-]{1,80}$/;
const bad = (code: string, message: string) => new DomainError(code, message, 400);

export interface PriceRequest {
  edition: PriceEdition;
  marketCode: string;
  interval: PriceInterval;
  currency: string;
  amount: string;
  validFrom: Date;
  preview: boolean;
  actorId: string;
  approval: { proposalId: string; proposedBy: string } | null;
}

/** Parses and validates the body of a signed price request. A publish needs the approval record; a preview does not. `now` is injected for tests. */
export function parsePriceRequest(raw: unknown, now: Date): PriceRequest {
  const b = (raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}) as Record<string, unknown>;
  const s = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
  const edition = s(b.edition).toUpperCase();
  if (!(PRICE_EDITIONS as readonly string[]).includes(edition)) throw bad("INVALID_EDITION", "edition must be LITE, PRO or CHAIN");
  const marketCode = s(b.marketCode).toUpperCase();
  if (!MARKET.test(marketCode)) throw bad("INVALID_MARKET", "marketCode must be a two-letter country code");
  const interval = s(b.interval).toUpperCase();
  if (!(PRICE_INTERVALS as readonly string[]).includes(interval)) throw bad("INVALID_INTERVAL", "interval must be MONTHLY or ANNUAL");
  const currency = s(b.currency).toUpperCase();
  if (!CURRENCY.test(currency)) throw bad("INVALID_CURRENCY", "currency must be a three-letter code");
  const amount = s(b.amount);
  if (!MONEY.test(amount)) throw bad("INVALID_AMOUNT", "amount must be digits with at most two decimals");
  let validFrom = now;
  if (b.validFrom !== undefined && b.validFrom !== null && b.validFrom !== "") {
    const d = new Date(s(b.validFrom));
    if (Number.isNaN(d.getTime())) throw bad("INVALID_VALID_FROM", "validFrom is not a date");
    validFrom = d.getTime() < now.getTime() ? now : d; // a start in the past is moved to now (history is never rewritten)
  }
  const actor = (b.actor && typeof b.actor === "object" ? b.actor : {}) as Record<string, unknown>;
  const actorId = s(actor.id);
  if (!REF.test(actorId)) throw bad("ACTOR_REQUIRED", "the acting console user is required");
  const preview = b.preview === true;
  let approval: PriceRequest["approval"] = null;
  if (!preview) {
    const a = (b.approval && typeof b.approval === "object" ? b.approval : {}) as Record<string, unknown>;
    const proposalId = s(a.proposalId), proposedBy = s(a.proposedBy);
    if (!REF.test(proposalId) || !REF.test(proposedBy)) throw bad("APPROVAL_REQUIRED", "a price is published only from an approved proposal (proposalId and proposedBy)");
    if (proposedBy === actorId) throw new DomainError("TWO_PERSON_RULE", "The person who proposed a price cannot approve it", 403);
    approval = { proposalId, proposedBy };
  }
  return { edition: edition as PriceEdition, marketCode, interval: interval as PriceInterval, currency, amount, validFrom, preview, actorId, approval };
}

export interface SegmentRow { id: string; priceVersion: number; validFrom: Date; validTo: Date | null; amount: string; currency: string }

/** Rows of one segment (edition, market, interval) that are in force at `at`. */
export const activeAt = (rows: readonly SegmentRow[], at: Date): SegmentRow[] => rows.filter((r) => r.validFrom <= at && (!r.validTo || r.validTo > at));

/** Next version of a segment, and the rows the new version ends. A start at or before the newest version is refused: history is append-only and ordered. */
export function planNextVersion(rows: readonly SegmentRow[], validFrom: Date): { priceVersion: number; supersedes: SegmentRow[] } {
  const newest = rows.reduce<SegmentRow | null>((m, r) => (!m || r.validFrom > m.validFrom ? r : m), null);
  if (newest && validFrom <= newest.validFrom) throw new DomainError("PRICE_NOT_AFTER_LATEST", "The new price must start after the newest existing version of this plan, market and period", 409, { newestValidFrom: newest.validFrom.toISOString(), newestVersion: newest.priceVersion });
  return { priceVersion: rows.reduce((m, r) => Math.max(m, r.priceVersion), 0) + 1, supersedes: activeAt(rows, validFrom) };
}
