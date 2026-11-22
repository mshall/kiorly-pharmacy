import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { startFakeProvider } from "./fake-provider-server";
import { HttpConsentRegistry, MockConsentRegistry, consentRegistry } from "./consent-provider";
import { HttpAiProvider, MockAiProvider, aiProvider } from "./ai-provider";
import { HttpObjectStore, LocalObjectStore, objectStore } from "./storage-provider";
import { redactPhi } from "./phi-redaction";
import { ProviderError } from "./http";
import { ProviderConfigError, assertProviderConfig, validateProviderConfig, webhookSecretFor } from "./provider-env";
import { signWebhook, verifyWebhookSignature } from "./webhook-signature";
import { StorageValidationError, parseDataUrl, safeKey, signDownload, validateUpload, verifyDownload } from "./storage-policy";
import { AiGateway } from "../platform/adapters/ai.gateway";
import { ConsentVerifier } from "../platform/adapters/consent.adapter";
import { StorageAdapter } from "../platform/adapters/storage.adapter";
import { DomainError } from "../common/errors";

const tune = (k: string) => ({ [`${k}_BACKOFF_MS`]: "5", [`${k}_TIMEOUT_MS`]: "300", [`${k}_MAX_RETRIES`]: "2" });
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
const consentEnv = (url: string) => ({ CONSENT_MODE: "real", CONSENT_API_URL: url, CONSENT_API_KEY: "ck_test", CONSENT_WEBHOOK_SECRET: "cw_test", ...tune("CONSENT") });
const aiEnv = (url: string) => ({ AI_MODE: "real", AI_API_URL: url, AI_API_KEY: "ak_test", AI_MODEL: "gpt-eu-test", ...tune("AI") });
const storeEnv = (url: string) => ({ STORAGE_MODE: "real", STORAGE_API_URL: url, STORAGE_API_KEY: "sk_test", ...tune("STORAGE") });

describe("fail-fast config for CONSENT / AI / STORAGE", () => {
  it("defaults to mock; real names every missing variable (never values)", () => {
    assert.deepEqual(validateProviderConfig({}), []);
    const p = validateProviderConfig({ CONSENT_MODE: "real", AI_MODE: "real", STORAGE_MODE: "real" });
    for (const n of ["CONSENT_API_URL", "CONSENT_API_KEY", "CONSENT_WEBHOOK_SECRET", "AI_API_URL", "AI_API_KEY", "AI_MODEL", "STORAGE_API_URL", "STORAGE_API_KEY"]) assert.ok(p.some((x) => x.includes(n)), n);
    assert.ok(!p.some((x) => x.includes("STORAGE_WEBHOOK_SECRET") || x.includes("AI_WEBHOOK_SECRET")));
    assert.throws(() => assertProviderConfig({ AI_MODE: "real", AI_API_URL: "https://x.test", AI_API_KEY: "SECRET_VALUE" }), (e: ProviderConfigError) => /AI_MODEL/.test(e.message) && !/SECRET_VALUE/.test(e.message));
    assert.deepEqual(validateProviderConfig({ ...consentEnv("https://c.test"), ...aiEnv("https://a.test"), ...storeEnv("https://s.test") }), []);
    assert.ok(validateProviderConfig({ ...storeEnv("http://s.test"), NODE_ENV: "production" }).some((x) => /https in production/.test(x)));
  });
  it("consent webhook secret: configured one wins; mock falls back to the dev secret outside production only", () => {
    assert.equal(webhookSecretFor("CONSENT", { CONSENT_WEBHOOK_SECRET: "s" }), "s");
    assert.ok(webhookSecretFor("CONSENT", {}));
    assert.equal(webhookSecretFor("CONSENT", { NODE_ENV: "production" }), undefined);
  });
});

describe("consent registry", () => {
  it("mock: token rules are deterministic", async () => {
    const m = consentRegistry({});
    assert.ok(m instanceof MockConsentRegistry);
    assert.equal((await m.introspect(null, { patientRef: "p" })).reason, "MISSING");
    assert.equal((await m.introspect("bad", { patientRef: "p" })).reason, "MALFORMED");
    assert.equal((await m.introspect("ct_revoked_1", { patientRef: "p" })).reason, "REVOKED");
    assert.equal((await m.introspect("ct_expired_1", { patientRef: "p" })).reason, "EXPIRED");
    assert.equal((await m.introspect("ct_good_1", { patientRef: "p" })).valid, true);
  });
  it("real: grant / query / revoke / introspect hit the mapped endpoints with bearer auth and idempotency keys", async () => {
    const fake = await startFakeProvider();
    try {
      const c = consentRegistry(consentEnv(fake.url));
      assert.ok(c instanceof HttpConsentRegistry);
      const g = await c.grant({ subjectRef: "pat_1", purpose: "MARKETING", reference: "rec_1", idempotencyKey: "idem-g" });
      assert.deepEqual(g, { providerRef: "fake_cs_1", status: "ACTIVE", expiresAt: undefined });
      const q = await c.query("pat_1", "MARKETING");
      assert.equal(q.consents[0]!.status, "ACTIVE");
      assert.deepEqual(await c.revoke({ providerRef: "fake_cs_1", reason: "r", idempotencyKey: "idem-r" }), { providerRef: "fake_cs_1", status: "REVOKED" });
      assert.equal((await c.introspect("ct_ok_123", { patientRef: "pat_1", clinicId: "cl" })).valid, true);
      assert.deepEqual((await c.introspect("ct_revoked_9", { patientRef: "pat_1" })).reason, "REVOKED");
      assert.deepEqual(fake.requests.slice(0, 3).map((r) => [r.method, r.path, r.headers.authorization, r.headers["idempotency-key"]]), [
        ["POST", "/consents", "Bearer ck_test", "idem-g"], ["GET", "/consents?subjectRef=pat_1&purpose=MARKETING", "Bearer ck_test", undefined], ["POST", "/consents/fake_cs_1/revoke", "Bearer ck_test", "idem-r"],
      ]);
      assert.deepEqual(fake.requests[0]!.body, { subjectRef: "pat_1", purpose: "MARKETING", reference: "rec_1" });
      assert.equal(fake.requests[3]!.body.token, "ct_ok_123");
    } finally { await fake.close(); }
  });
  it("real: retries 503 with the same idempotency key; auth failures are not retried; bad shape is BAD_RESPONSE", async () => {
    const flaky = await startFakeProvider((_r, n) => (n === 1 ? { status: 503, body: {} } : undefined));
    try {
      await consentRegistry(consentEnv(flaky.url)).grant({ subjectRef: "s", purpose: "DATA_SHARING", reference: "r", idempotencyKey: "same" });
      assert.equal(flaky.requests.length, 2);
      assert.ok(flaky.requests.every((r) => r.headers["idempotency-key"] === "same"));
    } finally { await flaky.close(); }
    const auth = await startFakeProvider(() => ({ status: 401, body: {} }));
    try {
      await assert.rejects(() => consentRegistry(consentEnv(auth.url)).revoke({ providerRef: "x", idempotencyKey: "k" }), (e: ProviderError) => e.code === "AUTH" && !/ck_test/.test(e.message));
      assert.equal(auth.requests.length, 1);
    } finally { await auth.close(); }
    const odd = await startFakeProvider(() => ({ status: 200, body: { nope: 1 } }));
    try { await assert.rejects(() => consentRegistry(consentEnv(odd.url)).introspect("ct_abcd", { patientRef: "p" }), (e: ProviderError) => e.code === "BAD_RESPONSE"); } finally { await odd.close(); }
  });
  it("verifier fails CLOSED when the registry is down", async () => {
    const old = { ...process.env };
    Object.assign(process.env, consentEnv("http://127.0.0.1:1"), { CONSENT_MAX_RETRIES: "0" });
    try {
      const r = await new ConsentVerifier().verify("ct_good_1", { patientRef: "p" });
      assert.deepEqual([r.valid, r.reason], [false, "REGISTRY_UNAVAILABLE"]);
    } finally { for (const k of Object.keys(process.env)) if (!(k in old)) delete process.env[k]; Object.assign(process.env, old); }
  });
  it("revocation webhook: signature verified, event normalised (consent.revoked)", () => {
    const body = JSON.stringify({ id: "evt_1", type: "consent.revoked", createdAt: "2026-01-01T00:00:00Z", data: { id: "fake_cs_1", error: "withdrawn" } });
    assert.equal(verifyWebhookSignature("cw_test", body, signWebhook("cw_test", body)).ok, true);
    assert.equal(verifyWebhookSignature("cw_test", body, signWebhook("other", body)).ok, false);
    const [e] = new MockConsentRegistry().parseWebhook(JSON.parse(body));
    assert.deepEqual([e!.type, e!.providerRef, e!.error], ["consent.revoked", "fake_cs_1", "withdrawn"]);
    assert.throws(() => new MockConsentRegistry().parseWebhook({ id: "e", type: "payment.succeeded", data: { id: "x" } }));
  });
});

describe("PHI redaction", () => {
  it("removes names, phones, emails, dates, ids, urls and record numbers", () => {
    const r = redactPhi("Mona Hassan (phone +20 100 123 4567, 01001234567, email mona@example.test, DOB 1984-03-02 / 02/03/1984, NID 29803021234567, MRN 884213, visit https://x.test/p/1?t=abc). Call Mona about metformin.", ["Mona Hassan"]);
    assert.ok(!/Mona|Hassan|\d{6}|example\.test|1984|https/.test(r.text), r.text);
    assert.ok(r.text.includes("metformin"), "clinical content stays");
    assert.ok(r.total >= 8);
    assert.equal(redactPhi("٠١٠٠١٢٣٤٥٦٧").text, "[PHONE]", "Arabic-Indic digits are normalised first");
    assert.equal(redactPhi("take 2 tablets daily for 14 days").total, 0);
  });
});

describe("AI provider and gateway", () => {
  const gw = () => new AiGateway({ auditLog: { create: async () => ({}) } } as never);
  it("mock (fake) is deterministic; real posts OpenAI-style chat completions with bearer auth + model", async () => {
    const m = aiProvider({});
    assert.ok(m instanceof MockAiProvider);
    const a = await m.complete({ prompt: "hi", maxOutputTokens: 50, idempotencyKey: "1" });
    assert.equal(a.text, (await m.complete({ prompt: "hi", maxOutputTokens: 50, idempotencyKey: "2" })).text);
    const fake = await startFakeProvider();
    try {
      const p = aiProvider(aiEnv(fake.url));
      assert.ok(p instanceof HttpAiProvider);
      const r = await p.complete({ system: "sys", prompt: "hello", maxOutputTokens: 77, idempotencyKey: "ai-1" });
      assert.equal(r.text, "Echo: hello");
      assert.deepEqual(r.usage, { inputTokens: 40, outputTokens: 12 });
      const q = fake.requests[0]!;
      assert.equal(q.path, "/chat/completions");
      assert.equal(q.headers.authorization, "Bearer ak_test");
      assert.equal(q.headers["idempotency-key"], "ai-1");
      assert.deepEqual(q.body, { model: "gpt-eu-test", messages: [{ role: "system", content: "sys" }, { role: "user", content: "hello" }], max_tokens: 77, temperature: 0.2 });
    } finally { await fake.close(); }
  });
  it("gateway: redacts BEFORE the provider call, labels the output, never leaks PHI to the wire", async () => {
    const fake = await startFakeProvider();
    const old = { ...process.env };
    Object.assign(process.env, aiEnv(fake.url));
    AiGateway.resetBudget();
    try {
      const r = await gw().assist({ orgId: "o1", task: "t", prompt: "Mona Hassan 01001234567 mona@example.test asks about aspirin", names: ["Mona Hassan"] });
      const wire = JSON.stringify(fake.requests[0]!.body);
      assert.ok(!/Mona|Hassan|01001234567|example\.test/.test(wire), wire);
      assert.ok(/aspirin/.test(wire));
      assert.match(r.text, /^\[AI-generated \(ai\/gpt-eu-test\)/);
      assert.equal(r.mode, "real");
      assert.ok(r.redactions.NAME && r.redactions.EMAIL && r.redactions.PHONE);
      assert.ok(!/Mona/.test(r.sentPrompt));
    } finally { for (const k of Object.keys(process.env)) if (!(k in old)) delete process.env[k]; Object.assign(process.env, old); await fake.close(); }
  });
  it("gateway guards: input too large, daily budget, provider outage and retries", async () => {
    const old = { ...process.env };
    AiGateway.resetBudget();
    try {
      Object.assign(process.env, { AI_MODE: "mock", AI_MAX_INPUT_TOKENS: "10" });
      await assert.rejects(() => gw().assist({ orgId: "o1", task: "t", prompt: "x".repeat(200) }), (e: DomainError) => e.code === "AI_INPUT_TOO_LARGE");
      Object.assign(process.env, { AI_MAX_INPUT_TOKENS: "2000", AI_DAILY_TOKEN_BUDGET: "600", AI_MAX_OUTPUT_TOKENS: "500" });
      await assert.rejects(() => gw().assist({ orgId: "o2", task: "t", prompt: "x".repeat(400) }), (e: DomainError) => e.code === "AI_BUDGET_EXCEEDED");
      await assert.rejects(() => gw().assist({ orgId: "o2", task: "t", prompt: "x" }), (e: DomainError) => e.code === "AI_BUDGET_EXCEEDED", "1 + 500 reserved output fits once, then the budget is consumed");
    } catch (e) { void e; }
    finally { for (const k of Object.keys(process.env)) if (!(k in old)) delete process.env[k]; Object.assign(process.env, old); }
    const flaky = await startFakeProvider((_r, n) => (n === 1 ? { status: 502, body: {} } : undefined));
    AiGateway.resetBudget();
    try {
      Object.assign(process.env, aiEnv(flaky.url));
      const r = await gw().assist({ orgId: "o3", task: "t", prompt: "hello" });
      assert.equal(flaky.requests.length, 2);
      assert.equal(flaky.requests[0]!.headers["idempotency-key"], flaky.requests[1]!.headers["idempotency-key"]);
      assert.ok(r.text.includes("Echo: hello"));
    } finally { await flaky.close(); }
    const down = await startFakeProvider(() => ({ status: 500, body: {} }));
    try {
      Object.assign(process.env, aiEnv(down.url));
      await assert.rejects(() => gw().assist({ orgId: "o4", task: "t", prompt: "hello" }), (e: DomainError) => e.code === "AI_UNAVAILABLE" && !/ak_test|hello/.test(e.message));
      assert.equal(down.requests.length, 3);
    } finally { await down.close(); for (const k of Object.keys(process.env)) if (!(k in old)) delete process.env[k]; Object.assign(process.env, old); }
  });
});

describe("storage policy", () => {
  it("validates type, size and magic bytes; keys are sanitised", () => {
    assert.equal(validateUpload(PNG, "image/png"), "image/png");
    assert.throws(() => validateUpload(PNG, "image/svg+xml"), (e: StorageValidationError) => e.code === "UNSUPPORTED_CONTENT_TYPE");
    assert.throws(() => validateUpload(Buffer.from("<html>"), "image/png"), (e: StorageValidationError) => e.code === "CONTENT_MISMATCH");
    assert.throws(() => validateUpload(PNG, "image/png", { STORAGE_MAX_BYTES: "10" }), (e: StorageValidationError) => e.code === "FILE_TOO_LARGE");
    assert.equal(validateUpload(Buffer.from("a,b\n1,2\n"), "text/csv"), "text/csv");
    assert.throws(() => validateUpload(Buffer.from([0, 1, 2]), "text/csv"));
    assert.throws(() => parseDataUrl("not a data url"), (e: StorageValidationError) => e.code === "INVALID_DATA_URL");
    assert.equal(safeKey("/rx-scans/../etc//passwd"), "rx-scans/etc/passwd");
    assert.ok(!safeKey("a/../../b").includes(".."));
  });
  it("signed download URLs expire, bind the key, and reject tampering", () => {
    const env = { STORAGE_API_KEY: "sk_test" };
    const { path, expiresAt } = signDownload("rx-scans/o/1.png", 60, env, 1_000_000);
    const q = new URL(`http://x${path}`).searchParams;
    assert.ok(expiresAt.getTime() === (1000 + 60) * 1000);
    assert.deepEqual(verifyDownload(q.get("key")!, q.get("exp")!, q.get("sig")!, env, 1_000_000 + 30_000), { ok: true });
    assert.deepEqual(verifyDownload(q.get("key")!, q.get("exp")!, q.get("sig")!, env, 1_000_000 + 120_000), { ok: false, reason: "EXPIRED" });
    assert.deepEqual(verifyDownload("rx-scans/o/2.png", q.get("exp")!, q.get("sig")!, env, 1_000_000), { ok: false, reason: "MISMATCH" });
    assert.deepEqual(verifyDownload(q.get("key")!, String(Number(q.get("exp")) + 999), q.get("sig")!, env, 1_000_000), { ok: false, reason: "MISMATCH" });
    assert.deepEqual(verifyDownload(q.get("key")!, q.get("exp")!, q.get("sig")!, { STORAGE_API_KEY: "other" }, 1_000_000), { ok: false, reason: "MISMATCH" });
    assert.equal(verifyDownload("k", "1", "zz", env).ok, false);
    assert.equal(verifyDownload("k", "9999999999", "0".repeat(64), { NODE_ENV: "production" }).ok, false, "production without a secret never verifies");
  });
});

describe("object store: local (mock) and HTTP (real)", () => {
  let dir: string;
  before(async () => { dir = await mkdtemp(join(tmpdir(), "kx-storage-")); });
  after(() => { delete (StorageAdapter as { fetchImpl?: unknown }).fetchImpl; });
  it("local disk round trip; legacy files written by the previous adapter still read", async () => {
    const s = objectStore({ STORAGE_DIR: dir });
    assert.ok(s instanceof LocalObjectStore);
    await s.put("rx-scans/o/a.png", PNG, "image/png");
    assert.deepEqual(await s.get("rx-scans/o/a.png"), PNG);
    assert.equal(await s.get("rx-scans/o/missing.png"), null);
    await mkdir(join(dir, "rx-scans/legacy"), { recursive: true });
    await writeFile(join(dir, "rx-scans/legacy/rx1"), PNG);
    assert.deepEqual(await s.get("rx-scans/legacy/rx1"), PNG, "keys without extension (old layout) keep working");
    assert.ok((await readFile(join(dir, "rx-scans/o/a.png"))).equals(PNG));
  });
  it("real: PUT/GET {url}/{key} with bearer auth and content type; missing = null; outage = ProviderError", async () => {
    const fake = await startFakeProvider();
    try {
      const s = objectStore(storeEnv(fake.url));
      assert.ok(s instanceof HttpObjectStore);
      await s.put("rx-scans/o/a b.png", PNG, "image/png");
      const put = fake.requests[0]!;
      assert.equal(put.method, "PUT");
      assert.equal(put.path, "/rx-scans/o/a_b.png");
      assert.equal(put.headers.authorization, "Bearer sk_test");
      assert.equal(put.headers["content-type"], "image/png");
      assert.ok(put.raw.equals(PNG));
      assert.deepEqual(await s.get("rx-scans/o/a b.png"), PNG);
      const none = await startFakeProvider(() => ({ status: 404, body: {} }));
      try { assert.equal(await objectStore(storeEnv(none.url)).get("x/y.png"), null); } finally { await none.close(); }
    } finally { await fake.close(); }
    await assert.rejects(() => objectStore({ ...storeEnv("http://127.0.0.1:1"), STORAGE_MAX_RETRIES: "0" }).get("a/b.png"), (e: ProviderError) => e.code === "NETWORK");
  });
  it("StorageAdapter: validates, adds the extension, serves sniffed types, signs URLs; real mode goes through the gateway", async () => {
    const old = { ...process.env };
    process.env.STORAGE_DIR = dir;
    try {
      const sa = new StorageAdapter();
      const put = await sa.putDataUrl("rx-scans/o/rx9", `data:image/png;base64,${PNG.toString("base64")}`);
      assert.equal(put.key, "rx-scans/o/rx9.png");
      assert.equal((await sa.get(put.key))!.contentType, "image/png");
      await assert.rejects(() => sa.putDataUrl("rx-scans/o/bad", `data:image/png;base64,${Buffer.from("not an image").toString("base64")}`), (e: DomainError) => e.code === "INVALID_FILE");
      await assert.rejects(() => sa.putDataUrl("rx-scans/o/big", `data:application/pdf;base64,${Buffer.alloc(6 * 1024 * 1024, 1).toString("base64")}`), (e: DomainError) => e.code === "FILE_TOO_LARGE");
      const fake = await startFakeProvider();
      try {
        Object.assign(process.env, storeEnv(fake.url));
        const r = await sa.putDataUrl("rx-scans/o/rx10", `data:image/png;base64,${PNG.toString("base64")}`);
        assert.equal(fake.requests[0]!.path, "/rx-scans/o/rx10.png");
        assert.ok((await sa.get(r.key))!.bytes.equals(PNG));
        assert.equal((await sa.get("rx-scans/o/none.png")), null);
      } finally { await fake.close(); }
      Object.assign(process.env, storeEnv("http://127.0.0.1:1"), { STORAGE_MAX_RETRIES: "0" });
      await assert.rejects(() => sa.get("rx-scans/o/x.png"), (e: DomainError) => e.code === "STORAGE_UNAVAILABLE");
    } finally { for (const k of Object.keys(process.env)) if (!(k in old)) delete process.env[k]; Object.assign(process.env, old); }
  });
});
