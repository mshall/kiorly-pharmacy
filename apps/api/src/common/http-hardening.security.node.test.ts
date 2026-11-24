import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { secretsEqual, securityHeaderMap, securityHeaders, swaggerEnabled, trustedProxyHops } from "./http-hardening";
import { snsConfirmUrl, verifySnsBasicAuth } from "../providers/vendors/ses";

/** Pentest 2026-11 regression tests: headers, swagger gating, proxy hops, constant-time secrets, SNS subscription URL host allow-list (SSRF). */
describe("http hardening (security)", () => {
  it("security headers; HSTS only in production", () => {
    const p = securityHeaderMap({ NODE_ENV: "production" });
    assert.equal(p["X-Content-Type-Options"], "nosniff"); assert.equal(p["X-Frame-Options"], "DENY"); assert.match(p["Strict-Transport-Security"] ?? "", /max-age=31536000/);
    assert.equal(securityHeaderMap({ NODE_ENV: "development" })["Strict-Transport-Security"], undefined);
  });
  it("middleware sets the headers, strips X-Powered-By and leaves the docs UI frameable by itself", () => {
    const set: Record<string, string> = {}; const removed: string[] = []; let next = false;
    securityHeaders({ NODE_ENV: "production" })({ path: "/api/v1/x" }, { setHeader: (k, v) => { set[k] = v; }, removeHeader: (k) => removed.push(k) }, () => { next = true; });
    assert.ok(next); assert.ok(removed.includes("X-Powered-By")); assert.equal(set["Referrer-Policy"], "no-referrer");
    const docs: Record<string, string> = {}; securityHeaders({})({ path: "/docs" }, { setHeader: (k, v) => { docs[k] = v; } }, () => undefined);
    assert.equal(docs["Content-Security-Policy"], undefined);
  });
  it("swagger is off in production unless SWAGGER_ENABLED=true", () => {
    assert.equal(swaggerEnabled({ NODE_ENV: "production" }), false);
    assert.equal(swaggerEnabled({ NODE_ENV: "production", SWAGGER_ENABLED: "true" }), true);
    assert.equal(swaggerEnabled({ NODE_ENV: "development" }), true);
    assert.equal(swaggerEnabled({ NODE_ENV: "development", SWAGGER_ENABLED: "false" }), false);
  });
  it("trusted proxy hops default to 0", () => { assert.equal(trustedProxyHops({}), 0); assert.equal(trustedProxyHops({ TRUSTED_PROXY_HOPS: "2" }), 2); assert.equal(trustedProxyHops({ TRUSTED_PROXY_HOPS: "-3" }), 0); });
  it("secretsEqual", () => { assert.equal(secretsEqual("a", "a"), true); assert.equal(secretsEqual("a", "b"), false); assert.equal(secretsEqual("a", "ab"), false); assert.equal(secretsEqual("", ""), false); });
  it("SNS basic auth uses the shared secret only", () => {
    const hdr = (pw: string) => ({ authorization: `Basic ${Buffer.from(`sns:${pw}`).toString("base64")}` });
    assert.equal(verifySnsBasicAuth("s3cret", hdr("s3cret")), true); assert.equal(verifySnsBasicAuth("s3cret", hdr("s3cre")), false); assert.equal(verifySnsBasicAuth("", hdr("")), false);
  });
  it("SNS SubscribeURL is only honoured for amazonaws SNS hosts over https (no SSRF through the confirmation handshake)", () => {
    const body = (u: string) => JSON.stringify({ Type: "SubscriptionConfirmation", SubscribeURL: u });
    assert.ok(snsConfirmUrl(body("https://sns.eu-central-1.amazonaws.com/?Action=ConfirmSubscription&Token=x")));
    for (const u of ["http://sns.eu-central-1.amazonaws.com/x", "https://169.254.169.254/latest/meta-data", "https://sns.eu-central-1.amazonaws.com.evil.example/x", "https://evil.example/sns.eu-central-1.amazonaws.com", "https://localhost/x", "https://user@evil.example/"]) assert.equal(snsConfirmUrl(body(u)), null, u);
  });
});
