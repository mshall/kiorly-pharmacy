import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EVENT_EXAMPLES, signWebhook, validateEvent, verifyWebhook } from "@kiorex/contracts";
import { OutboxService } from "./outbox.service";
import { DomainError } from "../common/errors";

/** Contract tests vs @kiorex/contracts event schemas (PH-F11): inbound PrescriptionIssued; outbound DispenseCompleted / OrderReady / OrderRejected. */
function fakeDb() {
  const rows: Array<Record<string, unknown>> = [];
  return {
    rows,
    outboxEvent: {
      findUnique: async () => null,
      create: async ({ data }: { data: Record<string, unknown> }) => { rows.push(data); return data; },
    },
  };
}
const svc = () => new OutboxService({} as never);
const signoff = { userId: "usr_1", signedAt: "2027-03-05T12:29:00.000Z" };

describe("event contracts (@kiorex/contracts)", () => {
  it("inbound PrescriptionIssued example validates; missing consentToken is rejected", () => {
    const ex = (EVENT_EXAMPLES as Record<string, unknown>)["PrescriptionIssued"];
    assert.equal(validateEvent("PrescriptionIssued", ex).valid, true);
    const bad = JSON.parse(JSON.stringify(ex));
    delete bad.data.consentToken;
    assert.equal(validateEvent("PrescriptionIssued", bad).valid, false);
  });

  it("outbound events are validated BEFORE they are written (fail closed) and carry the contract envelope", async () => {
    const db = fakeDb();
    const ok = await svc().enqueue({ orgId: "o1", type: "DispenseCompleted", aggregateId: "ord_1", dedupeKey: "k1", data: { orderId: "ord_1", pharmacyId: "ph_1", dispensedAt: "2027-03-05T12:30:00.000Z", pharmacistSignoff: signoff } }, db as never);
    assert.equal(ok.created, true);
    const env = db.rows[0]!.payload as Record<string, unknown>;
    assert.deepEqual(Object.keys(env).sort(), ["aggregateId", "aggregateType", "data", "eventId", "occurredAt", "target", "type"]);
    assert.equal(env.eventId, db.rows[0]!.id, "eventId is the outbox row id (consumer de-dup key)");
    assert.equal(env.aggregateType, "PharmacyOrder");
    assert.equal(env.target, "KIOREX");

    // DispenseCompleted without pharmacist sign-off can never be emitted
    await assert.rejects(svc().enqueue({ orgId: "o1", type: "DispenseCompleted", aggregateId: "ord_2", dedupeKey: "k2", data: { orderId: "ord_2", pharmacyId: "ph_1", dispensedAt: "2027-03-05T12:30:00.000Z" } }, db as never), (e: unknown) => e instanceof DomainError && e.code === "EVENT_CONTRACT_VIOLATION");
    await assert.rejects(svc().enqueue({ orgId: "o1", type: "OrderReady", aggregateId: "ord_3", dedupeKey: "k3", data: { orderId: "ord_3", pharmacyId: "ph_1", readyAt: "2027-03-05T12:30:00.000Z" } }, db as never), /EVENT_CONTRACT_VIOLATION|does not match/);
    await assert.rejects(svc().enqueue({ orgId: "o1", type: "OrderRejected", aggregateId: "ord_4", dedupeKey: "k4", data: { orderId: "ord_4", pharmacyId: "ph_1", rejectedAt: "2027-03-05T12:30:00.000Z" } }, db as never), /does not match/);
    assert.equal(db.rows.length, 1, "nothing invalid reached the outbox");
  });

  it("OrderReady / OrderRejected accepted with required fields; envelope validates as emitted", async () => {
    const db = fakeDb();
    await svc().enqueue({ orgId: "o1", type: "OrderReady", aggregateId: "ord_5", dedupeKey: "k5", data: { orderId: "ord_5", pharmacyId: "ph_1", branchId: "b1", readyAt: "2027-03-05T12:30:00.000Z", pharmacistSignoff: signoff } }, db as never);
    await svc().enqueue({ orgId: "o1", type: "OrderRejected", aggregateId: "ord_6", dedupeKey: "k6", data: { orderId: "ord_6", pharmacyId: "ph_1", rejectedAt: "2027-03-05T12:30:00.000Z", reason: "Out of stock", reasonCode: "OOS" } }, db as never);
    for (const r of db.rows) assert.equal(validateEvent(r.type as string, r.payload).valid, true);
  });

  it("webhook HMAC (X-Kiorly-* scheme): round trip, tamper and stale timestamp rejected", () => {
    const body = JSON.stringify({ eventId: "e1" });
    const s = signWebhook({ secret: "sec", body, timestamp: 1_800_000_000, eventType: "OrderReady", eventId: "e1" });
    assert.equal(s.headers["X-Kiorly-Event"], "OrderReady");
    assert.match(s.signature, /^sha256=[0-9a-f]{64}$/);
    assert.equal(verifyWebhook({ secret: "sec", body, timestamp: s.timestamp, signature: s.signature, now: 1_800_000_010 }).ok, true);
    assert.equal(verifyWebhook({ secret: "sec", body: body + "x", timestamp: s.timestamp, signature: s.signature, now: 1_800_000_010 }).ok, false);
    assert.deepEqual(verifyWebhook({ secret: "sec", body, timestamp: s.timestamp, signature: s.signature, now: 1_800_009_999 }), { ok: false, reason: "stale_timestamp" });
  });
});
