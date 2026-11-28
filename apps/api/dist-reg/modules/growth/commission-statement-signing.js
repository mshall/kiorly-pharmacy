"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUERY_SIGNATURE_HEADER = void 0;
exports.canonicalQuery = canonicalQuery;
exports.signStatementQuery = signStatementQuery;
exports.statementSigningSecret = statementSigningSecret;
const node_crypto_1 = require("node:crypto");
exports.QUERY_SIGNATURE_HEADER = "X-Kiorly-Query-Signature";
function canonicalQuery(query) {
    const raw = typeof query === "string" ? (query.startsWith("?") ? query.slice(1) : query) : query;
    const pairs = [...new URLSearchParams(raw ?? "")];
    pairs.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));
    return pairs.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
}
function signStatementQuery(secret, i) {
    const canonical = `kiorly-query-v1\n${i.timestamp}\n${i.nonce}\n${i.method.toUpperCase()}\n${i.path}\n${canonicalQuery(i.query)}`;
    return (0, node_crypto_1.createHmac)("sha256", secret).update(canonical).digest("base64url");
}
function statementSigningSecret(registered, env = process.env) {
    const own = env.KIOREX_STATEMENT_ORG_SECRET?.trim();
    return own && own.length >= 16 ? own : registered;
}
//# sourceMappingURL=commission-statement-signing.js.map