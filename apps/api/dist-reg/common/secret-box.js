"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seal = seal;
exports.open = open;
const node_crypto_1 = require("node:crypto");
const key = () => (0, node_crypto_1.createHash)("sha256").update(process.env.INTEGRATION_KEK ?? "dev-kek-change-me-dev-kek-change-me!").digest();
function seal(plain) {
    const iv = (0, node_crypto_1.randomBytes)(12);
    const c = (0, node_crypto_1.createCipheriv)("aes-256-gcm", key(), iv);
    const enc = Buffer.concat([c.update(plain, "utf8"), c.final()]);
    return [iv, c.getAuthTag(), enc].map((b) => b.toString("base64url")).join(".");
}
function open(sealed) {
    const [iv, tag, enc] = sealed.split(".").map((p) => Buffer.from(p, "base64url"));
    const d = (0, node_crypto_1.createDecipheriv)("aes-256-gcm", key(), iv);
    d.setAuthTag(tag);
    return Buffer.concat([d.update(enc), d.final()]).toString("utf8");
}
//# sourceMappingURL=secret-box.js.map