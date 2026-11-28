"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canRequest = exports.progressPct = exports.publicApiBase = exports.intakeUrl = exports.kiorexHost = exports.newSecret = exports.newClientKey = exports.deriveStatusToken = exports.intakeHeaders = exports.isEnrolmentCode = exports.KIOREX_TERMS_VERSION = exports.newIntakeNonce = exports.enrolmentIdOf = exports.deriveIntakeSigningKey = void 0;
exports.validatePayoutLabel = validatePayoutLabel;
const node_crypto_1 = require("node:crypto");
const contracts_1 = require("@kiorex/contracts");
Object.defineProperty(exports, "deriveIntakeSigningKey", { enumerable: true, get: function () { return contracts_1.deriveIntakeSigningKey; } });
Object.defineProperty(exports, "enrolmentIdOf", { enumerable: true, get: function () { return contracts_1.enrolmentIdOf; } });
Object.defineProperty(exports, "newIntakeNonce", { enumerable: true, get: function () { return contracts_1.newIntakeNonce; } });
exports.KIOREX_TERMS_VERSION = "2026-11";
const isEnrolmentCode = (code) => typeof code === "string" && !!(0, contracts_1.enrolmentIdOf)(code);
exports.isEnrolmentCode = isEnrolmentCode;
const intakeHeaders = (secret, ts, body, enrolmentCode) => (0, contracts_1.signIntakeRequest)({ secret, body, timestamp: ts, enrolmentCode });
exports.intakeHeaders = intakeHeaders;
const deriveStatusToken = (kek, orgId) => (0, node_crypto_1.createHmac)("sha256", (0, node_crypto_1.createHash)("sha256").update(kek).digest()).update(`kiorex-connect-status:${orgId}`).digest("base64url");
exports.deriveStatusToken = deriveStatusToken;
const newClientKey = (prefix) => `${prefix}_${(0, node_crypto_1.randomBytes)(9).toString("hex")}`;
exports.newClientKey = newClientKey;
const newSecret = () => (0, node_crypto_1.randomBytes)(32).toString("base64url");
exports.newSecret = newSecret;
const kiorexHost = (env = process.env) => (env.KIOREX_BASE_URL ?? env.KIOREX_API_URL ?? "http://localhost:4000").replace(/\/+$/, "").replace(/\/api\/v1$/, "");
exports.kiorexHost = kiorexHost;
const intakeUrl = (host) => `${host}/api/v1${contracts_1.INTAKE_PATH}`;
exports.intakeUrl = intakeUrl;
const publicApiBase = (env = process.env) => (env.PUBLIC_API_BASE_URL ?? `http://localhost:${env.PORT ?? "3100"}`).replace(/\/+$/, "");
exports.publicApiBase = publicApiBase;
function validatePayoutLabel(label) {
    if (typeof label !== "string")
        return { ok: false, code: "PAYOUT_LABEL_INVALID" };
    const v = label.trim();
    if (v.length < 2 || v.length > 40)
        return { ok: false, code: "PAYOUT_LABEL_INVALID" };
    if (/\d{6,}/.test(v.replace(/[\s-]/g, "")) || /\b[A-Za-z]{2}\d{2}[A-Za-z0-9]{8,}/.test(v))
        return { ok: false, code: "PAYOUT_LOOKS_LIKE_ACCOUNT_NUMBER" };
    return { ok: true, value: v };
}
const progressPct = (steps) => { const req = steps.filter((s) => !s.optional); return Math.round((req.filter((s) => s.status === "done").length / req.length) * 100); };
exports.progressPct = progressPct;
const canRequest = (steps, status) => (status === "CONSENTED" || status === "CHANGES_REQUESTED" || status === "REJECTED") && steps.filter((s) => !s.optional && !["request", "live"].includes(s.key)).every((s) => s.status === "done");
exports.canRequest = canRequest;
//# sourceMappingURL=kiorex-connect.core.js.map