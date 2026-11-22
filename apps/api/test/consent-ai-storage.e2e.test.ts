import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { signWebhook as signKiorex } from "@kiorex/contracts";
import { randomUUID } from "node:crypto";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { auth, bootApp, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";
import { startFakeProvider } from "../src/providers/fake-provider-server";
import { MOCK_WEBHOOK_SECRET } from "../src/providers/provider-env";
import { signWebhook } from "../src/providers/webhook-signature";
import { AiGateway } from "../src/platform/adapters/ai.gateway";

const RUN = Date.now().toString(36);
const PNG_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const png = `data:image/png;base64,${PNG_B64}`;
async function withEnv<T>(env: Record<string, string>, fn: () => Promise<T>): Promise<T> {
  const old: Record<string, string | undefined> = {};
  for (const k of Object.keys(env)) { old[k] = process.env[k]; process.env[k] = env[k]; }
  try { return await fn(); } finally { for (const k of Object.keys(env)) { if (old[k] === undefined) delete process.env[k]; else process.env[k] = old[k]; } }
}
const evt = (type: string, ref: string, id = `evt_${randomUUID()}`) => JSON.stringify({ id, type, createdAt: new Date().toISOString(), data: { id: ref } });

describe("consent registry, AI gateway and object storage (mock end to end, real against a local fake)", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); AiGateway.resetBudget(); });
  after(async () => { await t.close(); });
  const owner = () => auth(f.users.owner.token);
  const ph = () => auth(f.users.pharmacist.token);
  const hook = (body: string, secret: string | null = MOCK_WEBHOOK_SECRET) => t.http.post("/api/v1/webhooks/providers/consent").set({ "content-type": "application/json", ...(secret ? { "x-kiorex-signature": signWebhook(secret, body) } : {}) }).send(body);

  it("status lists the new kinds (booleans only); demo endpoints run consent grant/revoke, an AI sample with the redacted prompt, and a storage round trip", async () => {
    const st = await t.http.get("/api/v1/dev/providers/status").set(owner());
    for (const k of ["CONSENT", "AI", "STORAGE"]) assert.equal(st.body.find((s: { kind: string }) => s.kind === k)?.mode, "mock");
    assert.ok(st.body.every((s: Record<string, unknown>) => !("apiKey" in s)));

    const c = await t.http.post("/api/v1/dev/providers/consent/demo").set(owner()).send({});
    assert.equal(c.status, 201, JSON.stringify(c.body));
    assert.equal(c.body.validAfterGrant, true);
    assert.equal(c.body.revoke.applied, 1, "revocation arrives through the signed webhook path");
    assert.equal(c.body.validAfterRevoke, false);
    assert.equal(c.body.customerMarketingFlag, false, "revoking MARKETING switches the customer's flag off");
    assert.match(c.body.providerRef, /^mockconsent_/);

    const a = await t.http.post("/api/v1/dev/providers/ai/sample").set(owner()).send({});
    assert.equal(a.status, 201, JSON.stringify(a.body));
    assert.ok(!/Mona|Hassan|1001234567|example\.test|884213|1984/.test(a.body.sentPrompt), a.body.sentPrompt);
    assert.ok(/metformin/.test(a.body.sentPrompt));
    assert.match(a.body.text, /^\[AI-generated \(fake\/fake-1\)/);
    assert.ok(a.body.redactions.NAME > 0 && a.body.redactions.PHONE > 0 && a.body.redactions.EMAIL > 0);

    const s = await t.http.post("/api/v1/dev/providers/storage/roundtrip").set(owner()).send({});
    assert.equal(s.status, 201, JSON.stringify(s.body));
    assert.equal(s.body.readBack.identical, true);
    assert.equal(s.body.contentType, "image/png");
    assert.deepEqual(s.body.tamperedSignature, { ok: false, reason: "MISMATCH" });
    assert.deepEqual(s.body.afterExpiry, { ok: false, reason: "EXPIRED" });

    const all = await t.http.post("/api/v1/dev/providers/demo/run").set(owner()).send({ payments: false });
    assert.equal(all.status, 201, JSON.stringify(all.body));
    assert.ok(all.body.consent && all.body.ai && all.body.storage);
  });

  it("dev tools are 404 when disabled / forbidden without settings.write", async () => {
    await withEnv({ PROVIDER_DEV_TOOLS: "false" }, async () => {
      for (const p of ["consent/demo", "ai/sample", "storage/roundtrip"]) assert.equal((await t.http.post(`/api/v1/dev/providers/${p}`).set(owner()).send({})).status, 404, p);
    });
    assert.equal((await t.http.post("/api/v1/dev/providers/ai/sample").set(auth(f.users.cashier.token)).send({})).status, 403);
  });

  it("consent API + webhook: grant, status, signed revoke (401 on bad signature, replay deduped), customer toggles mirror to records", async () => {
    const cust = await t.http.post("/api/v1/customers").set(owner()).send({ displayName: `Consent ${RUN}`, phone: "+201000000771" });
    assert.equal(cust.status, 201, JSON.stringify(cust.body));
    const g = await t.http.post("/api/v1/consents").set(owner()).send({ subjectRef: cust.body.id, patientId: cust.body.id, purpose: "DATA_SHARING" });
    assert.equal(g.status, 201, JSON.stringify(g.body));
    assert.equal(g.body.status, "ACTIVE");
    assert.equal((await t.http.post("/api/v1/consents").set(owner()).send({ subjectRef: "x1", purpose: "NOPE" })).status, 400);
    assert.equal((await t.http.get(`/api/v1/consents/status?subjectRef=${cust.body.id}&purpose=DATA_SHARING`).set(owner())).body.valid, true);
    const body = evt("consent.revoked", g.body.providerRef);
    assert.equal((await hook(body, null)).status, 401);
    assert.equal((await hook(body, "wrong")).status, 401);
    const ok = await hook(body);
    assert.equal(ok.status, 200, JSON.stringify(ok.body));
    assert.equal(ok.body.applied, 1);
    assert.equal((await hook(body)).body.duplicates, 1, "replay is a no-op");
    const st = await t.http.get(`/api/v1/consents/status?subjectRef=${cust.body.id}&purpose=DATA_SHARING`).set(owner());
    assert.equal(st.body.valid, false);
    assert.equal(st.body.history[0].status, "REVOKED");
    assert.equal((await hook(evt("consent.revoked", "unknown_ref"))).body.unmatched, 1);
    assert.equal((await t.http.get("/api/v1/consents").set(auth(f.users.cashier.token))).status, 200);

    await t.http.put(`/api/v1/customers/${cust.body.id}/consent`).set(owner()).send({ dataProcessing: true, marketing: true });
    let marketing = await t.http.get(`/api/v1/consents?patientId=${cust.body.id}&purpose=MARKETING&status=ACTIVE`).set(owner());
    assert.equal(marketing.body.length, 1);
    await t.http.put(`/api/v1/customers/${cust.body.id}/consent`).set(owner()).send({ dataProcessing: true, marketing: false });
    marketing = await t.http.get(`/api/v1/consents?patientId=${cust.body.id}&purpose=MARKETING&status=ACTIVE`).set(owner());
    assert.equal(marketing.body.length, 0);
  });

  it("e-Rx consent is recorded; a registry revocation blocks dispensing of that Rx", async () => {
    const eventId = `ev_${randomUUID()}`;
    const token = `ct_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
    const body = JSON.stringify({ eventId, type: "PrescriptionIssued", aggregateType: "Prescription", aggregateId: `rx_${eventId}`, target: "KIOREX", occurredAt: new Date().toISOString(),
      data: { prescriptionId: `rx_${eventId}`, encounterId: "enc_1", clinicId: "clinic_1", patientRef: `sub_${RUN}`, prescriberId: "clin_01JF3Z7AAA", consentToken: token, issuedAt: new Date().toISOString(), items: [{ activeIngredient: "amoxicillin", strength: "500 mg", quantity: 1 }] } });
    const signed = signKiorex({ secret: f.client.webhookSecret, body, eventType: "PrescriptionIssued", eventId, clientKey: f.client.key });
    const r = await t.http.post("/api/v1/webhooks/kiorex").set({ ...signed.headers, "x-kiorex-branch-id": f.branchId }).send(body);
    assert.equal(r.status, 200, JSON.stringify(r.body));
    const rec = await t.prisma.consentRecord.findFirstOrThrow({ where: { orgId: f.orgId, subjectRef: `sub_${RUN}`, purpose: "ERX_DISPENSE" } });
    assert.equal(rec.status, "ACTIVE");
    assert.ok(rec.tokenHash && rec.providerRef);
    const before = await t.prisma.prescription.findUniqueOrThrow({ where: { id: r.body.prescriptionId } });
    assert.ok(before.consentExpiresAt! > new Date());
    assert.equal((await hook(evt("consent.revoked", rec.providerRef!))).body.applied, 1);
    const after = await t.prisma.prescription.findUniqueOrThrow({ where: { id: r.body.prescriptionId } });
    assert.ok(after.consentExpiresAt! <= new Date(), "Rx consent expires on revoke");
    const v = await t.http.post(`/api/v1/prescriptions/${r.body.prescriptionId}/validate`).set(ph());
    assert.ok(JSON.stringify(v.body).includes("CONSENT_INVALID"), JSON.stringify(v.body));
  });

  it("REAL consent registry against a local fake: grant/revoke call the registry; an outage blocks grants (503) but never blocks a revoke", async () => {
    const fake = await startFakeProvider(undefined, `cs${RUN}`);
    const env = { CONSENT_MODE: "real", CONSENT_API_URL: fake.url, CONSENT_API_KEY: "ck_e2e", CONSENT_WEBHOOK_SECRET: "cw_e2e", CONSENT_BACKOFF_MS: "5", CONSENT_TIMEOUT_MS: "300", CONSENT_MAX_RETRIES: "1" };
    try {
      await withEnv(env, async () => {
        const g = await t.http.post("/api/v1/consents").set(owner()).send({ subjectRef: `real_${RUN}`, purpose: "MARKETING" });
        assert.equal(g.status, 201, JSON.stringify(g.body));
        assert.match(g.body.providerRef, new RegExp(`^cs${RUN}_cs_`));
        const q = fake.requests[0]!;
        assert.equal(q.headers.authorization, "Bearer ck_e2e");
        assert.equal(q.body.subjectRef, `real_${RUN}`);
        assert.equal((await t.http.get(`/api/v1/consents/status?subjectRef=real_${RUN}&purpose=MARKETING`).set(owner())).body.registry[0].status, "ACTIVE");
        // webhook now needs the real secret; the public mock secret is refused
        const body = evt("consent.revoked", g.body.providerRef);
        assert.equal((await hook(body)).status, 401);
        assert.equal((await hook(body, "cw_e2e")).status, 200);
        // simulator refuses real mode
        assert.equal((await t.http.post("/api/v1/dev/providers/simulate/webhook").set(owner()).send({ kind: "consent", type: "consent.revoked", providerRef: "x" })).status, 409);
        const g2 = await t.http.post("/api/v1/consents").set(owner()).send({ subjectRef: `real2_${RUN}`, purpose: "DATA_PROCESSING" });
        const rv = await t.http.post(`/api/v1/consents/${g2.body.id}/revoke`).set(owner()).send({ reason: "asked" });
        assert.equal(rv.body.status, "REVOKED");
        assert.ok(fake.requests.some((r) => r.path === `/consents/${g2.body.providerRef}/revoke`));
      });
    } finally { await fake.close(); }
    await withEnv({ ...env, CONSENT_API_URL: "http://127.0.0.1:1", CONSENT_MAX_RETRIES: "0" }, async () => {
      const bad = await t.http.post("/api/v1/consents").set(owner()).send({ subjectRef: `down_${RUN}`, purpose: "MARKETING" });
      assert.equal(bad.status, 503);
      assert.equal(bad.body.code, "CONSENT_REGISTRY_UNAVAILABLE");
      assert.equal(await t.prisma.consentRecord.count({ where: { orgId: f.orgId, subjectRef: `down_${RUN}` } }), 0, "no registry proof, no ACTIVE record");
      const local = await t.prisma.consentRecord.create({ data: { orgId: f.orgId, subjectRef: `down2_${RUN}`, purpose: "MARKETING", source: "API", providerRef: `p_${RUN}` } });
      const rv = await t.http.post(`/api/v1/consents/${local.id}/revoke`).set(owner()).send({});
      assert.equal(rv.status, 201);
      assert.equal(rv.body.status, "REVOKED");
      assert.equal(rv.body.syncError, "NETWORK", "revoked locally; registry sync failure is recorded");
    });
  });

  it("storage mock: Rx scan is validated, stored, and only reachable through a short-lived signed URL", async () => {
    const dir = await mkdtemp(join(tmpdir(), "kx-e2e-"));
    await withEnv({ STORAGE_DIR: dir }, async () => {
      const d = await seedDrug(t, f, { rxOnly: true, activeIngredient: `ing-${RUN}`, price: "10.00" });
      const mk = (scanDataUrl: string) => t.http.post("/api/v1/prescriptions/manual").set(ph()).send({ patient: { displayName: "Scan Patient", phone: "01012349999" }, prescriberName: "Dr S", prescriberLicenceNo: `LIC-${randomUUID().slice(0, 6)}`, scanDataUrl, lines: [{ drugId: d.id, quantity: 1 }] });
      const rx = await mk(png);
      assert.equal(rx.status, 201, JSON.stringify(rx.body));
      assert.match(rx.body.scanStorageKey, new RegExp(`^rx-scans/${f.orgId}/${rx.body.id}\\.png$`));
      assert.equal((await mk(`data:image/svg+xml;base64,${Buffer.from("<svg onload=alert(1)/>").toString("base64")}`)).status, 400, "svg refused");
      assert.equal((await mk(`data:image/png;base64,${Buffer.from("definitely not a png").toString("base64")}`)).status, 400, "content must match the type");
      assert.equal((await mk(`data:application/pdf;base64,${Buffer.alloc(6 * 1024 * 1024, 37).toString("base64")}`)).status, 413, "too large");
      assert.equal((await t.http.get(`/api/v1/prescriptions/${rx.body.id}/scan-url`).set(auth(f.users.cashier.token))).status, 200);
      const u = await t.http.get(`/api/v1/prescriptions/${rx.body.id}/scan-url?ttl=60`).set(ph());
      assert.equal(u.status, 200, JSON.stringify(u.body));
      assert.ok(new Date(u.body.expiresAt).getTime() - Date.now() <= 61_000);
      const dl = await t.http.get(u.body.url).buffer(true).parse((res, cb) => { const c: Buffer[] = []; res.on("data", (x: Buffer) => c.push(x)); res.on("end", () => cb(null, Buffer.concat(c))); });
      assert.equal(dl.status, 200);
      assert.equal(dl.headers["content-type"], "image/png");
      assert.match(String(dl.headers["content-disposition"]), /^attachment;/);
      assert.equal(dl.headers["cache-control"], "private, no-store");
      assert.ok((dl.body as Buffer).equals(Buffer.from(PNG_B64, "base64")));
      assert.equal((await t.http.get(u.body.url.replace(/sig=[0-9a-f]{4}/, "sig=0000"))).status, 401, "tampered signature");
      assert.equal((await t.http.get(u.body.url.replace(/key=[^&]+/, "key=rx-scans%2Fother%2Fx.png"))).status, 401, "signature is bound to the key");
      assert.equal((await t.http.get("/api/v1/files?key=rx-scans/x.png")).status, 401, "no signature, no file");
      assert.equal((await t.http.get(`/api/v1/prescriptions/${rx.body.id}/scan-url`).set(auth(f.users.cashier.token))).status, 200);
      const other = await seedTenant(t);
      assert.equal((await t.http.get(`/api/v1/prescriptions/${rx.body.id}/scan-url`).set(auth(other.users.owner.token))).status, 404, "other tenants cannot even mint a URL");
    });
  });

  it("storage REAL against a local fake object gateway: PUT {url}/{key}, GET via signed URL, outage = 503 and the Rx is not created", async () => {
    const fake = await startFakeProvider();
    const env = { STORAGE_MODE: "real", STORAGE_API_URL: fake.url, STORAGE_API_KEY: "sk_e2e", STORAGE_BACKOFF_MS: "5", STORAGE_TIMEOUT_MS: "300", STORAGE_MAX_RETRIES: "1" };
    try {
      await withEnv(env, async () => {
        const d = await seedDrug(t, f, { rxOnly: true, activeIngredient: `ing2-${RUN}`, price: "10.00" });
        const body = (scanDataUrl: string) => ({ patient: { displayName: "Scan Patient", phone: "01012349998" }, prescriberName: "Dr S", prescriberLicenceNo: `LIC-${randomUUID().slice(0, 6)}`, scanDataUrl, lines: [{ drugId: d.id, quantity: 1 }] });
        const rx = await t.http.post("/api/v1/prescriptions/manual").set(ph()).send(body(png));
        assert.equal(rx.status, 201, JSON.stringify(rx.body));
        const put = fake.requests.find((r) => r.method === "PUT")!;
        assert.equal(put.path, `/${rx.body.scanStorageKey}`);
        assert.equal(put.headers.authorization, "Bearer sk_e2e");
        assert.equal(put.headers["content-type"], "image/png");
        const u = await t.http.get(`/api/v1/prescriptions/${rx.body.id}/scan-url`).set(ph());
        const dl = await t.http.get(u.body.url).buffer(true).parse((res, cb) => { const c: Buffer[] = []; res.on("data", (x: Buffer) => c.push(x)); res.on("end", () => cb(null, Buffer.concat(c))); });
        assert.equal(dl.status, 200);
        assert.ok((dl.body as Buffer).equals(Buffer.from(PNG_B64, "base64")));
        assert.ok(fake.requests.some((r) => r.method === "GET" && r.path === put.path));
      });
    } finally { await fake.close(); }
    await withEnv({ ...env, STORAGE_API_URL: "http://127.0.0.1:1", STORAGE_MAX_RETRIES: "0" }, async () => {
      const d = await seedDrug(t, f, { rxOnly: true, activeIngredient: `ing3-${RUN}`, price: "10.00" });
      const before = await t.prisma.prescription.count({ where: { orgId: f.orgId } });
      const r = await t.http.post("/api/v1/prescriptions/manual").set(ph()).send({ patient: { displayName: "Scan Patient", phone: "01012349997" }, prescriberName: "Dr S", prescriberLicenceNo: "LIC-OUT1", scanDataUrl: png, lines: [{ drugId: d.id, quantity: 1 }] });
      assert.equal(r.status, 503, JSON.stringify(r.body));
      assert.equal(r.body.code, "STORAGE_UNAVAILABLE");
      assert.equal(await t.prisma.prescription.count({ where: { orgId: f.orgId } }), before, "all-or-nothing: no Rx without its scan");
    });
  });

  it("AI REAL against a local fake: PHI never reaches the wire, output is labelled, budget guard answers 429, outage 503", async () => {
    const fake = await startFakeProvider();
    const env = { AI_MODE: "real", AI_API_URL: fake.url, AI_API_KEY: "ak_e2e", AI_MODEL: "gpt-eu-e2e", AI_BACKOFF_MS: "5", AI_TIMEOUT_MS: "300", AI_MAX_RETRIES: "1" };
    try {
      await withEnv(env, async () => {
        AiGateway.resetBudget();
        const a = await t.http.post("/api/v1/dev/providers/ai/sample").set(owner()).send({});
        assert.equal(a.status, 201, JSON.stringify(a.body));
        const wire = JSON.stringify(fake.requests[0]!.body);
        assert.ok(!/Mona|Hassan|1001234567|example\.test|884213/.test(wire), wire);
        assert.equal(fake.requests[0]!.body.model, "gpt-eu-e2e");
        assert.equal(fake.requests[0]!.headers.authorization, "Bearer ak_e2e");
        assert.match(a.body.text, /^\[AI-generated \(ai\/gpt-eu-e2e\)/);
        assert.equal(a.body.mode, "real");
        const audit = await t.prisma.auditLog.findFirst({ where: { orgId: f.orgId, action: "ai.assist" }, orderBy: { at: "desc" } });
        assert.ok(audit && !JSON.stringify(audit.meta).includes("metformin"), "audit keeps counts only, never the prompt");
        await withEnv({ AI_DAILY_TOKEN_BUDGET: "100" }, async () => {
          const r = await t.http.post("/api/v1/dev/providers/ai/sample").set(owner()).send({});
          assert.equal(r.status, 429);
          assert.equal(r.body.code, "AI_BUDGET_EXCEEDED");
        });
        await withEnv({ AI_MAX_INPUT_TOKENS: "5" }, async () => assert.equal((await t.http.post("/api/v1/dev/providers/ai/sample").set(owner()).send({})).body.code, "AI_INPUT_TOO_LARGE"));
      });
    } finally { await fake.close(); }
    AiGateway.resetBudget();
    await withEnv({ ...env, AI_API_URL: "http://127.0.0.1:1", AI_MAX_RETRIES: "0" }, async () => {
      const r = await t.http.post("/api/v1/dev/providers/ai/sample").set(owner()).send({});
      assert.equal(r.status, 503);
      assert.equal(r.body.code, "AI_UNAVAILABLE");
    });
  });
});
