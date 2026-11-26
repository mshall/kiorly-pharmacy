import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { createHash, createHmac } from "node:crypto";
import { signKiorlyRequest } from "@kiorex/contracts";
import { auth, bootApp, seedTenant, type Fixture, type TestApp } from "./helpers";

/** COM-3 (pharmacy): disclosure and counsel status with the rate view, and the settlement statement through the signed Kiorex statement API (an in-process fake). Every text and figure is a TEST placeholder. */
describe("COM-3 pharmacy: disclosure, counsel status, settlement statement", () => {
  let t: TestApp, f: Fixture, other: Fixture, fake: Server; const seen: { url: string; headers: Record<string, string | string[] | undefined> }[] = [];
  const statement = (ref: string) => ({ orgRef: ref, period: { from: "2026-12-01T00:00:00.000Z", to: "2027-01-01T00:00:00.000Z" }, currency: "EGP", payoutMethod: "BANK_TRANSFER", onlineCollectionsMinor: 9000, cashVisitCommissionAccruedMinor: 0, cashVisitCommissionNettedMinor: 0, cashVisitCommissionOpenMinor: 0, cashVisitCharges: 0, deductions: { commissionMinor: 900, feesMinor: 100, refundsMinor: 0, chargebacksMinor: 0 }, commission: { totalMinor: 900, collectedMinor: 900, openMinor: 0, disputedOpen: 0 }, netPayableMinor: 8000, paidByBankTransferMinor: 8000, payouts: [{ payoutRef: "po1", paidAt: "2026-12-04T00:00:00.000Z", cashMinor: 8000, commissionDeductedMinor: 900, bankReference: "po1", reconciliation: "MATCHED" }], reconciliation: "MATCHED", future: { x: 1 } });
  before(async () => {
    t = await bootApp(); f = await seedTenant(t); other = await seedTenant(t);
    fake = createServer((req, res) => { seen.push({ url: req.url ?? "", headers: req.headers }); const ref = decodeURIComponent((req.url ?? "").split("/settlement-statement/")[1]?.split(/[/?]/)[0] ?? ""); const csv = (req.url ?? "").includes("/export"); res.setHeader("content-type", csv ? "text/csv" : "application/json"); res.end(csv ? "item,amount,deducted,bankReference,status\r\nnetPayable,80.00,,,\r\n" : JSON.stringify(statement(ref))); });
    await new Promise<void>((r) => fake.listen(0, "127.0.0.1", r));
    await t.prisma.integrationClient.updateMany({ where: { orgId: f.orgId }, data: { kiorexBaseUrl: `http://127.0.0.1:${(fake.address() as { port: number }).port}` } });
  });
  after(async () => { delete process.env.KIOREX_MODE; await new Promise((r) => fake.close(r)); await t.close(); });
  const push = (fx: Fixture, body: object) => { const path = "/marketplace/v1/commission-rates"; const s = signKiorlyRequest({ clientKey: fx.client.key, clientSecret: fx.client.secret, method: "POST", path, body: JSON.stringify(body) }); return t.http.post(path).set({ ...s.headers, "content-type": "application/json" }).send(JSON.stringify(body)); };
  const view = (ref: string, version: string, extra: object = {}) => ({ orgRef: ref, product: "PHARMACY", version, history: [{ version: 1, scope: "DEFAULT", kind: "RATE", effectiveFrom: "2020-01-01T00:00:00Z", reason: null, spec: { feeType: "PERCENT", percentBps: 800, flatMinor: null, minMinor: null, maxMinor: null, mode: null, graceDays: 4, invoiceDueDays: 9 } }], ...extra });
  const rate = (token: string) => t.http.get("/api/v1/growth/commission-rate").set(auth(token));

  it("a view without the new blocks shows no wording and no counsel chip; wording appears only when set; only the counsel status is kept", async () => {
    await push(f, view("pr_ref_1", "100"));
    let r = (await rate(f.users.owner.token)).body;
    assert.deepEqual([r.disclosure, r.counsel, r.params.graceDays, r.params.invoiceDueDays, r.params.retryDays], [null, null, 4, 9, null]);
    await push(f, view("pr_ref_1", "101", { disclosure: { rateDisclosure: { en: "", ar: "" }, termsSummary: { en: "", ar: "" }, wordingSet: false }, counsel: { status: "NOT_REVIEWED" } }));
    r = (await rate(f.users.owner.token)).body; assert.deepEqual([r.disclosure, r.counsel], [null, { status: "NOT_REVIEWED" }]);
    await push(f, view("pr_ref_1", "102", { disclosure: { rateDisclosure: { en: "TEST text", ar: "نص" }, termsSummary: { en: "", ar: "" } }, counsel: { status: "APPROVED", reviewerName: "Secret", documentId: "DOC-9", conditions: "hidden" }, unknownBlock: [] }));
    r = (await rate(f.users.owner.token)).body;
    assert.deepEqual(r.disclosure.rateDisclosure, { en: "TEST text", ar: "نص" }); assert.deepEqual(r.counsel, { status: "APPROVED" });
    assert.doesNotMatch(JSON.stringify(r), /Secret|DOC-9|hidden/);
    const stored = JSON.stringify((await t.prisma.kiorexCommissionRateView.findUniqueOrThrow({ where: { orgId: f.orgId } })).view); assert.doesNotMatch(stored, /Secret|DOC-9|hidden/);
    assert.equal((await push(f, view("pr_ref_1", "103", { disclosure: "junk", counsel: 5 }))).status, 200); // malformed extras never break the view
    r = (await rate(f.users.owner.token)).body; assert.deepEqual([r.disclosure, r.counsel, r.state], [null, null, "SET"]);
    assert.equal((await rate(other.users.owner.token)).body.known, false);
  });

  it("mock mode invents nothing: 503 STATEMENT_NOT_CONNECTED", async () => {
    delete process.env.KIOREX_MODE;
    const r = await t.http.get("/api/v1/growth/commission-statement?period=2026-12").set(auth(f.users.owner.token));
    assert.equal(r.status, 503); assert.equal(r.body.code ?? r.body.message?.code, "STATEMENT_NOT_CONNECTED");
  });

  it("real mode: the statement comes from the Kiorex statement API with the partner HMAC; roles, isolation, CSV, bad period", async () => {
    process.env.KIOREX_MODE = "real";
    const ok = await t.http.get("/api/v1/growth/commission-statement?period=2026-12").set(auth(f.users.owner.token));
    assert.equal(ok.status, 200);
    assert.deepEqual([ok.body.source, ok.body.orgRef, ok.body.netPayableMinor, ok.body.deductions.feesMinor, ok.body.reconciliation, ok.body.payouts[0].bankReference, ok.body.period.key], ["KIOREX", "pr_ref_1", 8000, 100, "MATCHED", "po1", "2026-12"]);
    assert.equal("future" in ok.body, false);
    const call = seen.at(-1)!; const h = call.headers; const path = call.url.split("?")[0]!;
    assert.equal(path, "/api/v1/admin/commissions/settlement-statement/pr_ref_1"); assert.equal(h["x-kiorly-org-ref"], "pr_ref_1"); assert.equal(h["x-kiorly-client-key"], f.client.key);
    assert.equal(h["x-kiorly-signature"], createHmac("sha256", f.client.webhookSecret).update(`${h["x-kiorly-timestamp"]}\n${h["x-kiorly-nonce"]}\nGET\n${path}\n${createHash("sha256").update("").digest("hex")}`).digest("base64url"));
    assert.ok(call.url.includes("from=2026-12-01") && call.url.includes("to=2027-01-01"));
    assert.equal((await t.http.get("/api/v1/growth/commission-statement?period=2026-12").set(auth(f.users.manager.token))).status, 200);
    assert.equal((await t.http.get("/api/v1/growth/commission-statement?period=2026-12").set(auth(f.users.cashier.token))).status, 403);
    assert.equal((await t.http.get("/api/v1/growth/commission-statement?period=2026-12").set(auth(f.users.pharmacist.token))).status, 403);
    assert.equal((await t.http.get("/api/v1/growth/commission-statement?period=2026-13").set(auth(f.users.owner.token))).status, 400);
    assert.equal((await t.http.get("/api/v1/growth/commission-statement?period=2026-12").set(auth(other.users.owner.token))).status, 503); // the other organisation has no reference and no client base URL: never f's figures
    const csv = await t.http.get("/api/v1/growth/commission-statement/2026-12/export.csv").set(auth(f.users.owner.token));
    assert.equal(csv.status, 200); assert.match(csv.headers["content-type"] ?? "", /text\/csv/); assert.match(csv.text, /netPayable,80\.00/);
    assert.equal((await t.http.get("/api/v1/growth/commission-statement/2026-12/export.csv").set(auth(f.users.cashier.token))).status, 403);
    assert.ok(await t.prisma.auditLog.findFirst({ where: { orgId: f.orgId, action: "kiorex.commission_statement.exported" } }));
    await t.prisma.integrationClient.updateMany({ where: { orgId: f.orgId }, data: { kiorexBaseUrl: "http://127.0.0.1:1" } });
    const down = await t.http.get("/api/v1/growth/commission-statement?period=2026-12").set(auth(f.users.owner.token));
    assert.equal(down.status, 503); assert.equal(down.body.code ?? down.body.message?.code, "STATEMENT_UNAVAILABLE");
  });
});
