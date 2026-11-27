import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isMfaRequired, passportSecurityUrl } from "./mfa-required";

describe("MFA_REQUIRED friendly screen helpers", () => {
  it("recognises the API refusal by its code, nothing else", () => {
    assert.equal(isMfaRequired({ status: 403, code: "MFA_REQUIRED" }), true);
    assert.equal(isMfaRequired({ status: 403, code: "PERMISSION_DENIED" }), false);
    assert.equal(isMfaRequired(new Error("MFA_REQUIRED")), false);
    assert.equal(isMfaRequired(null), false);
    assert.equal(isMfaRequired(undefined), false);
  });
  it("links to the Security page on the Passport host, never to anything else", () => {
    assert.equal(passportSecurityUrl("https://passport.example.test"), "https://passport.example.test/account/security");
    assert.equal(passportSecurityUrl("https://passport.example.test/some/path?x=1"), "https://passport.example.test/account/security");
    assert.equal(passportSecurityUrl("http://localhost:4400"), "http://localhost:4400/account/security");
    assert.equal(passportSecurityUrl("javascript:alert(1)"), null);
    assert.equal(passportSecurityUrl("not a url"), null);
    assert.equal(passportSecurityUrl(undefined), null);
  });
});
