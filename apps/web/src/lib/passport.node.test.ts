import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { b64url, completePassportSignIn, s256, takeEndSessionUrl } from "./passport";

const store = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) }; };
const g = globalThis as unknown as Record<string, unknown>;
afterEach(() => { delete g.sessionStorage; delete g.localStorage; });

describe("PKCE + callback", () => {
  it("S256 matches the RFC 7636 appendix B vector", async () => {
    assert.equal(await s256("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"), "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
    assert.equal(b64url(new Uint8Array([251, 255])), "-_8");
  });
  it("refuses a callback whose state does not match the stored transaction and consumes the transaction", async () => {
    const ss = store(); g.sessionStorage = ss; g.localStorage = store();
    ss.setItem("kiorly.passport.txn", JSON.stringify({ state: "A", nonce: "n", verifier: "v", redirectUri: "http://x/auth/callback" }));
    await assert.rejects(completePassportSignIn("?code=c&state=B"), (e: { code?: string }) => e.code === "PASSPORT_STATE");
    assert.equal(ss.getItem("kiorly.passport.txn"), null);
    await assert.rejects(completePassportSignIn("?code=c&state=A"), (e: { code?: string }) => e.code === "PASSPORT_STATE");
  });
  it("exchanges the code through the API and remembers the logout URL once", async () => {
    const ss = store(); const ls = store(); g.sessionStorage = ss; g.localStorage = ls;
    ss.setItem("kiorly.passport.txn", JSON.stringify({ state: "A", nonce: "n", verifier: "v".repeat(50), redirectUri: "http://x/auth/callback" }));
    const real = globalThis.fetch; let sent: Record<string, string> = {};
    globalThis.fetch = (async (_u: unknown, init: { body: string }) => { sent = JSON.parse(init.body); return new Response(JSON.stringify({ accessToken: "tok", endSessionUrl: "http://idp/end?id_token_hint=h" }), { status: 200 }); }) as never;
    try {
      const r = await completePassportSignIn("?code=c&state=A");
      assert.equal(r.accessToken, "tok"); assert.deepEqual([sent.code, sent.nonce, sent.redirectUri], ["c", "n", "http://x/auth/callback"]);
      assert.equal(takeEndSessionUrl(), "http://idp/end?id_token_hint=h"); assert.equal(takeEndSessionUrl(), null);
    } finally { globalThis.fetch = real; }
  });
});
