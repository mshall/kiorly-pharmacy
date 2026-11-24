import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { signKiorlyRequest, validateEvent } from "@kiorex/contracts";
import type { PrismaClient } from "../src/generated/prisma/client";
import type { FlagSnapshot } from "../src/feature-flags/flag-snapshot";
import { verifyLinkTouch } from "../src/modules/growth/link-touch";
import { auth, bootApp, seedTenant, type Fixture, type TestApp } from "./helpers";

const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1";
const CODE = /^[0-9A-HJKMNP-TV-Z]{8}$/;
const snap = (flags: Array<{ key: string; values: object }>): FlagSnapshot => ({ product: "kiorly-pharmacy", version: Date.now(), generatedAt: new Date().toISOString(), flags: flags.map((f) => ({ class: "Module", dependsOn: [], launchLocked: false, gateSatisfied: false, ...f })) as never });

/** GRW-P4-B1 provider links for Kiorly Pharmacy against a real database: lifecycle, role matrix, tenant isolation, plan gate, registry events, public resolver, signed lookup. */
describe("Growth provider links (pharmacy)", () => {
  let t: TestApp, f: Fixture, other: Fixture, prisma: PrismaClient;
  before(async () => { t = await bootApp(); prisma = t.prisma as PrismaClient; f = await seedTenant(t); other = await seedTenant(t); });
  after(async () => { t.flags.setSnapshot(null); await t.close(); });
  const owner = () => auth(f.users.owner.token);
  const mk = async (body: object = {}, who = owner()) => { const r = await t.http.post("/api/v1/growth/links").set(who).send({ label: `Link ${randomUUID().slice(0, 4)}`, ...body }); assert.equal(r.status, 201, JSON.stringify(r.body)); return r.body as { id: string; code: string; status: string; shortUrl: string; ownerScope: string; branchId: string | null }; };
  const machine = (fx: Fixture, path: string) => { const s = signKiorlyRequest({ clientKey: fx.client.key, clientSecret: fx.client.secret, method: "GET", path, body: "" }); return t.http.get(path).set({ ...s.headers }); };
  /** supertest only fills `.text` for text and JSON types, so an SVG body is read as a string explicitly. */
  const getSvg = (path: string, who: Record<string, string>) => t.http.get(path).set(who).buffer(true).parse((res, cb) => { let d = ""; res.setEncoding("utf8"); res.on("data", (c: string) => (d += c)); res.on("end", () => cb(null, d)); });
  const events = (orgId: string, type: string) => prisma.outboxEvent.findMany({ where: { orgId, type }, orderBy: { occurredAt: "asc" } });

  it("owner creates an ORG link: 8-char code, short URL, audit row, signed ReferralLinkCreated with product PHARMACY that validates against the contract", async () => {
    const l = await mk({ ownerScope: "ORG", channelKind: "WEB_LINK" });
    assert.match(l.code, CODE); assert.match(l.shortUrl, new RegExp(`/api/v1/public/links/q/${l.code}$`)); assert.equal(l.status, "ACTIVE");
    const ev = (await events(f.orgId, "ReferralLinkCreated")).find((e) => (e.payload as { data: { linkCode: string } }).data.linkCode === l.code)!;
    const p = ev.payload as { data: Record<string, unknown>; target: string; aggregateType: string };
    assert.equal(p.target, "KIOREX"); assert.equal(p.aggregateType, "ProviderReferralLink"); assert.equal(p.data.product, "PHARMACY"); assert.equal(p.data.orgRef, f.orgId); assert.equal(p.data.ownerScope, "ORG");
    assert.equal(validateEvent("ReferralLinkCreated", ev.payload as never).valid, true);
    assert.ok(await prisma.auditLog.findFirst({ where: { orgId: f.orgId, action: "growth.link.created", entityId: l.id } }));
    assert.doesNotMatch(JSON.stringify(ev.payload), /customer|phone|email|price/i);
  });

  it("scopes: BRANCH and DESK need a branch of the organisation, ORG must not carry one; a foreign branch is a 404", async () => {
    const b = await mk({ ownerScope: "BRANCH", branchId: f.branchId });
    assert.equal(b.branchId, f.branchId);
    const d = await mk({ ownerScope: "DESK", branchId: f.branch2Id, label: "Counter 2" });
    assert.equal(d.ownerScope, "DESK");
    for (const body of [{ ownerScope: "BRANCH" }, { ownerScope: "DOCTOR" }, { ownerScope: "ORG", label: "x" }, { ownerScope: "ORG", channelKind: "FAX" }, { ownerScope: "ORG", tags: { utm_source: "<b>" } }]) {
      const r = await t.http.post("/api/v1/growth/links").set(owner()).send({ label: "Valid label", ...body }); assert.equal(r.status, 400, JSON.stringify(body)); assert.equal(r.body.code, "GROWTH_LINK_INVALID");
    }
    const foreign = await t.http.post("/api/v1/growth/links").set(owner()).send({ label: "Valid label", ownerScope: "BRANCH", branchId: other.branchId });
    assert.equal(foreign.status, 404);
    // the database refuses what the service would never write
    await assert.rejects(prisma.$executeRaw`INSERT INTO "ProviderReferralLink" ("id","orgId","ownerScope","code","label","createdBy") VALUES ('x1', ${f.orgId}, 'BRANCH', 'ABCDEFGH', 'no branch', 'u')`);
    await assert.rejects(prisma.$executeRaw`INSERT INTO "ProviderReferralLink" ("id","orgId","ownerScope","code","label","createdBy") VALUES ('x2', ${f.orgId}, 'ORG', 'ABCDEFGI', 'bad code', 'u')`);
  });

  it("role matrix: owner and manager create, every other staff role reads; a branch-scoped manager is limited to their own branch", async () => {
    const pharm = auth(f.users.pharmacist.token), cash = auth(f.users.cashier.token), chain = auth(f.users.chainOps.token), mgr = auth(f.users.manager.token);
    for (const who of [pharm, cash, chain]) {
      assert.equal((await t.http.get("/api/v1/growth/links").set(who)).status, 200);
      const r = await t.http.post("/api/v1/growth/links").set(who).send({ label: "Nope nope", ownerScope: "ORG" }); assert.equal(r.status, 403); assert.equal(r.body.code, "GROWTH_FORBIDDEN");
    }
    const org = await mk({ ownerScope: "ORG" });
    const m1 = await t.http.post("/api/v1/growth/links").set(mgr).send({ label: "My branch", ownerScope: "BRANCH" }); // branchId defaults to the manager's own branch
    assert.equal(m1.status, 201, JSON.stringify(m1.body)); assert.equal(m1.body.branchId, f.branchId);
    assert.equal((await t.http.post("/api/v1/growth/links").set(mgr).send({ label: "Org wide", ownerScope: "ORG" })).body.code, "GROWTH_SCOPE_FORBIDDEN");
    assert.equal((await t.http.post("/api/v1/growth/links").set(mgr).send({ label: "Other branch", ownerScope: "BRANCH", branchId: f.branch2Id })).body.code, "GROWTH_SCOPE_FORBIDDEN");
    const other2 = await mk({ ownerScope: "DESK", branchId: f.branch2Id });
    const seen = (await t.http.get("/api/v1/growth/links").set(mgr)).body.items as Array<{ id: string }>;
    assert.ok(seen.some((x) => x.id === org.id) && seen.some((x) => x.id === m1.body.id) && !seen.some((x) => x.id === other2.id), "manager sees org-wide and own-branch links only");
    assert.equal((await t.http.patch(`/api/v1/growth/links/${other2.id}`).set(mgr).send({ status: "PAUSED" })).status, 404, "another branch's link is invisible");
    assert.equal((await t.http.patch(`/api/v1/growth/links/${org.id}`).set(mgr).send({ status: "PAUSED" })).body.code, "GROWTH_SCOPE_FORBIDDEN");
    assert.equal((await t.http.patch(`/api/v1/growth/links/${m1.body.id}`).set(mgr).send({ status: "PAUSED" })).status, 200);
    assert.equal((await t.http.patch(`/api/v1/growth/links/${m1.body.id}`).set(cash).send({ status: "ACTIVE" })).status, 403);
    const acc = (await t.http.get("/api/v1/growth/access").set(cash)).body; assert.deepEqual([acc.level, acc.can.create, acc.can.view, acc.connected], ["read", false, true, true]);
  });

  it("lifecycle: pause and resume change the lookup status, revoke is permanent, emits ReferralLinkRevoked at once and the QR of a revoked link is refused", async () => {
    const l = await mk({ ownerScope: "ORG" });
    const lookup = async () => (await machine(f, `/marketplace/v1/referral-links/${l.code}`)).body;
    assert.equal((await lookup()).status, "ACTIVE");
    assert.equal((await t.http.patch(`/api/v1/growth/links/${l.id}`).set(owner()).send({ status: "PAUSED" })).body.status, "PAUSED");
    assert.equal((await lookup()).status, "PAUSED");
    assert.equal((await t.http.patch(`/api/v1/growth/links/${l.id}`).set(owner()).send({ status: "ACTIVE", label: "Renamed link" })).body.label, "Renamed link");
    assert.equal((await t.http.patch(`/api/v1/growth/links/${l.id}`).set(owner()).send({ status: "BOGUS" })).status, 400);
    const rev = await t.http.patch(`/api/v1/growth/links/${l.id}`).set(owner()).send({ status: "REVOKED" });
    assert.equal(rev.status, 200); assert.equal(rev.body.status, "REVOKED");
    const l2 = await lookup(); assert.equal(l2.status, "REVOKED"); assert.ok(l2.revokedAt, "revoked is visible to Kiorex immediately");
    const ev = (await events(f.orgId, "ReferralLinkRevoked")).find((e) => (e.payload as { data: { linkCode: string } }).data.linkCode === l.code)!;
    assert.equal(validateEvent("ReferralLinkRevoked", ev.payload as never).valid, true); assert.equal((ev.payload as { data: { product: string } }).data.product, "PHARMACY");
    assert.equal((await t.http.patch(`/api/v1/growth/links/${l.id}`).set(owner()).send({ status: "ACTIVE" })).status, 409);
    assert.equal((await t.http.get(`/api/v1/growth/links/${l.id}/qr.svg`).set(owner())).status, 409);
    assert.equal((await t.http.patch(`/api/v1/growth/links/${l.id}`).set(owner()).send({ label: "Edit after revoke" })).status, 200, "label edits stay possible, status does not");
  });

  it("QR (SVG, PNG) and printable cards (AR and EN, A4 and A5, desk card)", async () => {
    const l = await mk({ ownerScope: "DESK", branchId: f.branchId, label: "Counter 1" });
    const svg = await getSvg(`/api/v1/growth/links/${l.id}/qr.svg`, owner());
    assert.equal(svg.status, 200); assert.match(svg.headers["content-type"]!, /image\/svg\+xml/); assert.match(svg.body as string, /^<svg/);
    const png = await t.http.get(`/api/v1/growth/links/${l.id}/qr.png?width=400`).set(owner()).buffer(true).parse((res, cb) => { const c: Buffer[] = []; res.on("data", (d: Buffer) => c.push(d)); res.on("end", () => cb(null, Buffer.concat(c))); });
    assert.equal(png.status, 200); assert.equal((png.body as Buffer).subarray(1, 4).toString(), "PNG");
    const ar = await t.http.get(`/api/v1/growth/links/${l.id}/poster?lang=ar&size=A5`).set(owner());
    assert.equal(ar.status, 200); assert.match(ar.text, /dir="rtl"/); assert.match(ar.text, /Counter 1/); assert.match(ar.text, new RegExp(l.code)); assert.doesNotMatch(ar.text, /<script/);
    const en = await t.http.get(`/api/v1/growth/links/${l.id}/poster?lang=en&kind=POSTER`).set(owner()); assert.match(en.text, /dir="ltr"/);
    assert.match((await t.http.get(`/api/v1/growth/links/${l.id}/poster?print=1`).set(owner())).text, /window\.print/);
    assert.equal((await t.http.get(`/api/v1/growth/links/${l.id}/qr.svg`).set(auth(f.users.cashier.token))).status, 200, "the counter prints its own card");
  });

  it("tenant isolation: another organisation can neither see, change, print nor look up a link (IDOR)", async () => {
    const l = await mk({ ownerScope: "ORG" });
    const them = auth(other.users.owner.token);
    assert.equal(((await t.http.get("/api/v1/growth/links").set(them)).body.items as Array<{ id: string }>).some((x) => x.id === l.id), false);
    for (const [m, p] of [["patch", `/api/v1/growth/links/${l.id}`], ["get", `/api/v1/growth/links/${l.id}/qr.svg`], ["get", `/api/v1/growth/links/${l.id}/qr.png`], ["get", `/api/v1/growth/links/${l.id}/poster`]] as const) {
      const r = m === "patch" ? await t.http.patch(p).set(them).send({ status: "REVOKED" }) : await t.http.get(p).set(them);
      assert.equal(r.status, 404, `${m} ${p}`);
    }
    assert.equal((await t.http.get(`/api/v1/growth/links/${l.id}/qr.svg`).set(owner())).status, 200, "still intact");
    assert.equal((await machine(other, `/marketplace/v1/referral-links/${l.code}`)).status, 404, "a Kiorex client key of another organisation cannot read it");
    assert.equal(((await machine(other, "/marketplace/v1/referral-links")).body.items as Array<{ code: string }>).some((x) => x.code === l.code), false);
    assert.equal(((await machine(f, "/marketplace/v1/referral-links")).body.items as Array<{ code: string }>).some((x) => x.code === l.code), true);
    assert.equal((await t.http.get(`/marketplace/v1/referral-links/${l.code}`)).status, 401, "unsigned");
    assert.equal((await machine(f, "/marketplace/v1/referral-links/NOTACODE1")).status, 404);
    const sum = (await t.http.get("/api/v1/growth/summary").set(them)).body; assert.equal(sum.byLink.some((x: { linkId: string }) => x.linkId === l.id), false);
  });

  it("lookup feed: oldest first, cursor paged, only this organisation", async () => {
    const page1 = (await machine(f, "/marketplace/v1/referral-links?limit=2")).body;
    assert.equal(page1.items.length, 2); assert.ok(page1.nextCursor);
    const page2 = (await machine(f, `/marketplace/v1/referral-links?limit=2&cursor=${page1.nextCursor}`)).body;
    assert.equal(page2.items.some((x: { code: string }) => page1.items.some((y: { code: string }) => y.code === x.code)), false);
    for (const it of [...page1.items, ...page2.items]) { assert.equal(it.orgRef, f.orgId); assert.equal(it.product, "PHARMACY"); }
  });

  it("public resolver: 302 to the Kiorex pharmacy page with a verifiable lt, UTM tags, one visit per non-bot hit, no PII stored; bots are not counted", async () => {
    const l = await mk({ ownerScope: "DESK", branchId: f.branchId, channelKind: "QR_DESK", tags: { utm_campaign: "counter-26" } });
    const res = await t.http.get(`/api/v1/public/links/q/${l.code.toLowerCase()}`).set("user-agent", UA).set("x-forwarded-for", "203.0.113.9");
    assert.equal(res.status, 302);
    const loc = new URL(res.headers.location!); assert.equal(loc.pathname, "/pharmacy"); assert.equal(loc.origin, new URL(process.env.KIOREX_PATIENT_WEB_URL ?? "http://localhost:5180").origin);
    assert.equal(loc.searchParams.get("utm_medium"), "qr"); assert.equal(loc.searchParams.get("utm_campaign"), "counter-26");
    const v = verifyLinkTouch(loc.searchParams.get("lt")); assert.ok(v.ok); if (v.ok) { assert.equal(v.claims.o, f.orgId); assert.equal(v.claims.c, l.code); }
    await t.http.get(`/api/v1/public/links/q/${l.code}`).set("user-agent", "curl/8.4.0");
    await t.http.get(`/api/v1/public/links/q/${l.code}`).set("user-agent", UA).set("purpose", "prefetch");
    const day = await prisma.providerReferralLinkDaily.findMany({ where: { linkId: l.id } });
    assert.equal(day.length, 1); assert.equal(day[0]!.visits, 1); assert.equal(day[0]!.orders, 0);
    assert.equal(Object.keys(day[0]!).sort().join(), "completed,date,linkId,orders,orgId,updatedAt,visits", "counters only: no visitor column exists");
    assert.doesNotMatch(JSON.stringify(await prisma.rateLimitBucket.findMany({ where: { key: { startsWith: "plink:" } } })), /203\.0\.113\.9/);
    const json = await t.http.get(`/api/v1/public/links/q/${l.code}`).set("user-agent", UA).set("accept", "application/json");
    assert.equal(json.status, 200); assert.equal(json.body.status, "ACTIVE"); assert.match(json.body.target, /\/pharmacy\?lt=/);
    assert.equal((await t.http.get("/api/v1/growth/summary").set(owner())).body.byLink.find((x: { linkId: string }) => x.linkId === l.id).visits, 2);
    assert.equal((await t.http.get("/api/v1/growth/links").set(owner())).body.items.find((x: { id: string }) => x.id === l.id).last30.visits, 2);
  });

  it("20 parallel visits count exactly 20 (atomic daily aggregate)", async () => {
    const l = await mk({ ownerScope: "ORG" });
    await Promise.all(Array.from({ length: 20 }, () => t.http.get(`/api/v1/public/links/q/${l.code}`).set("user-agent", UA)));
    assert.equal((await prisma.providerReferralLinkDaily.findFirstOrThrow({ where: { linkId: l.id } })).visits, 20);
  });

  it("open redirect: nothing the caller sends changes the destination; paused, revoked, unknown and malformed codes never attribute or leak", async () => {
    const l = await mk({ ownerScope: "ORG" });
    const kiorexHost = new URL(process.env.KIOREX_PATIENT_WEB_URL ?? "http://localhost:5180").host;
    for (const probe of [`?next=https://evil.test`, `?redirect=//evil.test`, `?url=javascript:alert(1)`, `?s=https://evil.test`]) {
      const r = await t.http.get(`/api/v1/public/links/q/${l.code}${probe}`).set("user-agent", UA).set("referer", "https://evil.test").set("host", "evil.test");
      assert.equal(r.status, 302, probe); assert.equal(new URL(r.headers.location!).host, kiorexHost, probe);
    }
    for (const bad of ["https://evil.test", "%2F%2Fevil.test", "..%2F..%2Fetc%2Fpasswd", "ABCDEFGH", "7K3M9QX", "%00"]) {
      const r = await t.http.get(`/api/v1/public/links/q/${bad}`).set("user-agent", UA); assert.ok([404, 400].includes(r.status), `${bad} -> ${r.status}`); assert.equal(r.headers.location, undefined);
    }
    await t.http.patch(`/api/v1/growth/links/${l.id}`).set(owner()).send({ status: "PAUSED" });
    const before = (await prisma.providerReferralLinkDaily.aggregate({ where: { linkId: l.id }, _sum: { visits: true } }))._sum.visits ?? 0;
    const paused = await t.http.get(`/api/v1/public/links/q/${l.code}`).set("user-agent", UA);
    assert.equal(paused.status, 302); assert.equal(new URL(paused.headers.location!).searchParams.get("lt"), null, "paused: plain page, no token"); assert.equal(new URL(paused.headers.location!).search, "");
    await t.http.patch(`/api/v1/growth/links/${l.id}`).set(owner()).send({ status: "REVOKED" });
    const revoked = await t.http.get(`/api/v1/public/links/q/${l.code}`).set("user-agent", UA);
    assert.equal(revoked.status, 302); assert.equal(new URL(revoked.headers.location!).search, "");
    assert.equal((await prisma.providerReferralLinkDaily.aggregate({ where: { linkId: l.id }, _sum: { visits: true } }))._sum.visits ?? 0, before, "no counting once paused or revoked");
  });

  it("an organisation that is not connected to Kiorex: every Growth route is 403 KIOREX_NOT_CONNECTED, the public link opens the plain page and counts nothing", async () => {
    const l = await mk({ ownerScope: "ORG" });
    await prisma.tenant.update({ where: { id: f.orgId }, data: { settings: { ownerPhone: "+201000000000", mode: "STANDALONE" } } });
    try {
      for (const p of ["/api/v1/growth/links", "/api/v1/growth/summary", "/api/v1/growth/performance", "/api/v1/growth/recommendations", `/api/v1/growth/links/${l.id}/qr.svg`, `/api/v1/growth/links/${l.id}/poster`, "/api/v1/mobile/growth"]) {
        const r = await t.http.get(p).set(owner()); assert.equal(r.status, 403, p); assert.equal(r.body.code, "KIOREX_NOT_CONNECTED", p);
      }
      assert.equal((await t.http.post("/api/v1/growth/links").set(owner()).send({ label: "Valid label", ownerScope: "ORG" })).body.code, "KIOREX_NOT_CONNECTED");
      assert.equal((await t.http.get("/api/v1/growth/access").set(owner())).body.connected, false);
      const r = await t.http.get(`/api/v1/public/links/q/${l.code}`).set("user-agent", UA);
      assert.equal(r.status, 302); assert.equal(new URL(r.headers.location!).search, "");
      assert.equal(await prisma.providerReferralLinkDaily.count({ where: { linkId: l.id } }), 0);
    } finally { await prisma.tenant.update({ where: { id: f.orgId }, data: { settings: { ownerPhone: "+201000000000" } } }); }
    assert.equal((await t.http.get("/api/v1/growth/links").set(owner())).status, 200);
    // a paused Kiorex connection (front-door state) is not connected either
    await prisma.tenant.update({ where: { id: f.orgId }, data: { settings: { ownerPhone: "+201000000000", kiorexConnect: { status: "PAUSED" } } } });
    assert.equal((await t.http.get("/api/v1/growth/links").set(owner())).body.code, "KIOREX_NOT_CONNECTED");
    await prisma.tenant.update({ where: { id: f.orgId }, data: { settings: { ownerPhone: "+201000000000" } } });
  });

  it("flag growth.provider_links OFF: nothing new can be created or printed, existing links keep resolving and counting, a revoke still reaches Kiorex", async () => {
    const l = await mk({ ownerScope: "ORG" });
    t.flags.setSnapshot(snap([{ key: "growth.provider_links", values: { global: "OFF" } }]));
    try {
      const c = await t.http.post("/api/v1/growth/links").set(owner()).send({ label: "Valid label", ownerScope: "ORG" });
      assert.equal(c.status, 403); assert.deepEqual([c.body.code, c.body.key], ["FEATURE_DISABLED", "growth.provider_links"]);
      assert.equal((await t.http.get(`/api/v1/growth/links/${l.id}/qr.svg`).set(owner())).status, 403);
      assert.equal((await t.http.get("/api/v1/growth/links").set(owner())).status, 200, "data is never hidden");
      assert.equal((await t.http.get(`/api/v1/public/links/q/${l.code}`).set("user-agent", UA)).status, 302);
      assert.equal((await prisma.providerReferralLinkDaily.findFirstOrThrow({ where: { linkId: l.id } })).visits, 1, "still counting");
      assert.equal((await t.http.patch(`/api/v1/growth/links/${l.id}`).set(owner()).send({ status: "REVOKED" })).status, 200);
      assert.ok((await events(f.orgId, "ReferralLinkRevoked")).some((e) => (e.payload as { data: { linkCode: string } }).data.linkCode === l.code), "the revoke is never flag-gated");
    } finally { t.flags.setSnapshot(null); }
  });

  it("plan limit: LITE allows 3 active links, a revoke frees a slot", async () => {
    const lite = await seedTenant(t, { edition: "LITE" }); const w = auth(lite.users.owner.token);
    const ids: string[] = [];
    for (let i = 0; i < 3; i += 1) ids.push((await t.http.post("/api/v1/growth/links").set(w).send({ label: `Lite ${i} link`, ownerScope: "ORG" })).body.id);
    const over = await t.http.post("/api/v1/growth/links").set(w).send({ label: "Fourth link", ownerScope: "ORG" });
    assert.equal(over.status, 409); assert.equal(over.body.code, "GROWTH_LINK_LIMIT_REACHED"); assert.equal(over.body.details.limit, 3);
    await t.http.patch(`/api/v1/growth/links/${ids[0]}`).set(w).send({ status: "REVOKED" });
    assert.equal((await t.http.post("/api/v1/growth/links").set(w).send({ label: "Fourth link", ownerScope: "ORG" })).status, 201);
  });

  it("performance and recommendations: counts only, no money, closed catalogue", async () => {
    const perf = (await t.http.get("/api/v1/growth/performance").set(owner())).body;
    assert.ok(perf.links.visits >= 1); assert.equal(perf.acquisitionPending, true); assert.equal(perf.statement.configured, false);
    const keys: string[] = []; const walk = (o: unknown) => { if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) { keys.push(k); walk(v); } }; walk(perf);
    assert.deepEqual(keys.filter((k) => /value|price|amount|fee|money|revenue|commission|customer|patient|phone/i.test(k)), []);
    const rec = (await t.http.get("/api/v1/growth/recommendations").set(owner())).body;
    for (const r of rec.items) assert.ok(["CREATE_FIRST_LINK", "PRINT_COUNTER_CARD", "BRANCH_NOT_LISTED", "LINKS_UNUSED", "HIGH_REJECTION"].includes(r.id));
    assert.ok(rec.items.some((r: { id: string }) => r.id === "BRANCH_NOT_LISTED"), "the second branch is not opted in to Kiorex");
  });

  describe("Kiorly staff app: /mobile/growth", () => {
    it("plan gate first: a LITE organisation gets 403 FEATURE_DISABLED (mobile_staff_app) whatever the role", async () => {
      const lite = await seedTenant(t, { edition: "LITE" });
      for (const u of [lite.users.owner, lite.users.cashier]) { const r = await t.http.get("/api/v1/mobile/growth").set(auth(u.token)); assert.equal(r.status, 403); assert.deepEqual([r.body.code, r.body.key], ["FEATURE_DISABLED", "mobile_staff_app"]); }
      assert.equal((await t.http.post("/api/v1/mobile/growth/links").set(auth(lite.users.owner.token)).send({ label: "Valid label" })).body.code, "FEATURE_DISABLED");
    });
    it("a PRO connected organisation gets the whole tab in one call; staff roles read, owner and manager create, revoke is web only", async () => {
      const first = await mk({ ownerScope: "ORG", label: "App link" });
      const o = await t.http.get("/api/v1/mobile/growth").set(owner()).set("x-kiorly-client", "kiorly/1.0"); assert.equal(o.status, 200, JSON.stringify(o.body));
      assert.equal(o.body.product, "PHARMACY"); assert.ok(o.body.links.some((l: { id: string }) => l.id === first.id)); assert.match(o.body.profileUrl, /\/pharmacy$/); assert.equal(o.body.can.revoke, false); assert.equal(o.body.statement.configured, false);
      assert.ok(Array.isArray(o.body.recommendations)); assert.equal(o.body.level, "admin");
      const cashier = await t.http.get("/api/v1/mobile/growth").set(auth(f.users.cashier.token)); assert.equal(cashier.status, 200); assert.equal(cashier.body.can.create, false);
      assert.equal((await t.http.post("/api/v1/mobile/growth/links").set(auth(f.users.cashier.token)).send({ label: "Valid label", ownerScope: "ORG" })).body.code, "GROWTH_FORBIDDEN");
      const made = await t.http.post("/api/v1/mobile/growth/links").set(auth(f.users.manager.token)).send({ label: "From the app", ownerScope: "BRANCH" }); assert.equal(made.status, 201, JSON.stringify(made.body));
      assert.equal((await t.http.patch(`/api/v1/mobile/growth/links/${made.body.id}`).set(owner()).send({ status: "PAUSED" })).body.status, "PAUSED");
      assert.equal((await t.http.patch(`/api/v1/mobile/growth/links/${made.body.id}`).set(owner()).send({ status: "REVOKED" })).status, 403);
      const qr = await getSvg(`/api/v1/mobile/growth/qr?linkId=${made.body.id}`, owner()); assert.equal(qr.status, 200); assert.match(qr.body as string, /^<svg/);
      const qj = await t.http.get(`/api/v1/mobile/growth/qr?linkId=${made.body.id}&format=json`).set(owner()); assert.equal(qj.status, 200); assert.equal(qj.body.linkId, made.body.id); assert.match(qj.body.svg, /^<svg/); assert.match(qj.body.url, /^https?:\/\//);
      assert.equal((await t.http.get("/api/v1/mobile/growth/qr").set(owner())).status, 400);
      assert.equal((await t.http.get(`/api/v1/mobile/growth/qr?linkId=${made.body.id}`).set(auth(other.users.owner.token))).status, 404, "another organisation");
      assert.equal((await t.http.get("/api/v1/mobile/growth/links").set(owner())).body.items.length > 0, true);
    });
  });

  it("the daily aggregate belongs to its link: deleting nothing leaks across links; unique per day", async () => {
    const a = await mk({ ownerScope: "ORG" }), b = await mk({ ownerScope: "ORG" });
    await t.http.get(`/api/v1/public/links/q/${a.code}`).set("user-agent", UA);
    assert.equal(await prisma.providerReferralLinkDaily.count({ where: { linkId: b.id } }), 0);
    await assert.rejects(prisma.$executeRaw`INSERT INTO "ProviderReferralLinkDaily" ("linkId","orgId","date","visits") VALUES (${a.id}, ${f.orgId}, now()::date, -1)`);
  });

  it("outbox delivery (mock transport) signs and delivers the registry events", async () => {
    const r = await t.outbox.deliverDue(500);
    assert.equal(r.failed, 0);
    assert.ok(t.outbox.mockInbox.some((m) => m.type === "ReferralLinkCreated"));
  });
});
