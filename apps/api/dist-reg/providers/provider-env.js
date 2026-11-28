"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderConfigError = exports.MOCK_WEBHOOK_SECRET = exports.WEBHOOK_KINDS = exports.PROVIDER_KINDS = void 0;
exports.providerMode = providerMode;
exports.providerConfig = providerConfig;
exports.webhookSecretFor = webhookSecretFor;
exports.validateProviderConfig = validateProviderConfig;
exports.assertProviderConfig = assertProviderConfig;
exports.providerStatus = providerStatus;
exports.devToolsEnabled = devToolsEnabled;
const vendor_kit_1 = require("./vendor-kit");
const push_1 = require("./vendors/push");
exports.PROVIDER_KINDS = ["SMS", "EMAIL", "WHATSAPP", "PAYMENT", "PUSH", "STORAGE", "CONSENT", "AI"];
exports.WEBHOOK_KINDS = ["SMS", "EMAIL", "WHATSAPP", "PAYMENT", "CONSENT"];
const LEGACY_MODE = {
    SMS: ["MESSAGING_MODE"],
    EMAIL: ["MESSAGING_MODE"],
    WHATSAPP: ["MESSAGING_MODE"],
    PAYMENT: ["PSP_MODE"],
    PUSH: ["MOBILE_PUSH_MODE", "PUSH_MODE"],
    STORAGE: [],
    CONSENT: [],
    AI: [],
};
const SENDER_VAR = { SMS: "SMS_SENDER_ID", EMAIL: "EMAIL_FROM", WHATSAPP: "WHATSAPP_SENDER_ID" };
exports.MOCK_WEBHOOK_SECRET = "mock-webhook-secret-not-a-credential";
const clean = (v) => (v && v.trim() ? v.trim() : undefined);
const int = (v, d) => (v && Number.isFinite(Number(v)) && Number(v) >= 0 ? Math.floor(Number(v)) : d);
function providerMode(kind, env = process.env) {
    for (const name of [`${kind}_MODE`, ...LEGACY_MODE[kind]]) {
        const v = clean(env[name]);
        if (v)
            return v === "real" ? "real" : "mock";
    }
    return "mock";
}
function providerConfig(kind, env = process.env) {
    return {
        kind,
        mode: providerMode(kind, env),
        apiUrl: (0, vendor_kit_1.vendorApiUrl)(kind, env),
        apiKey: clean(env[`${kind}_API_KEY`]) ?? clean(env[`${kind}_API_TOKEN`]),
        webhookSecret: clean(env[`${kind}_WEBHOOK_SECRET`]),
        senderId: SENDER_VAR[kind] ? clean(env[SENDER_VAR[kind]]) : undefined,
        model: kind === "AI" ? clean(env.AI_MODEL) : undefined,
        timeoutMs: int(env[`${kind}_TIMEOUT_MS`], 8000),
        maxRetries: int(env[`${kind}_MAX_RETRIES`], 2),
        backoffMs: int(env[`${kind}_BACKOFF_MS`], 300),
    };
}
function webhookSecretFor(kind, env = process.env) {
    const c = providerConfig(kind, env);
    if (c.webhookSecret)
        return c.webhookSecret;
    if (c.mode === "real") {
        const d = (0, vendor_kit_1.derivedWebhookSecret)(kind, env);
        if (d)
            return d;
    }
    return c.mode === "mock" && env.NODE_ENV !== "production" ? exports.MOCK_WEBHOOK_SECRET : undefined;
}
class ProviderConfigError extends Error {
    problems;
    constructor(problems) {
        super(`Provider configuration invalid (MODE=real needs credentials):\n - ${problems.join("\n - ")}`);
        this.problems = problems;
        this.name = "ProviderConfigError";
    }
}
exports.ProviderConfigError = ProviderConfigError;
function validateProviderConfig(env = process.env, kinds = exports.PROVIDER_KINDS) {
    const problems = [];
    for (const kind of kinds) {
        const c = providerConfig(kind, env);
        if (c.mode !== "real")
            continue;
        const need = (name, v) => { if (!v)
            problems.push(`${kind}_MODE=real but ${name} is not set`); };
        if (kind === "PUSH" && !c.apiUrl) {
            problems.push(...(0, push_1.pushProblems)(env).map((p) => p.replace("PUSH_MODE=real needs", "PUSH_MODE=real (or MOBILE_PUSH_MODE) needs")));
            continue;
        }
        need(`${kind}_API_URL`, c.apiUrl);
        if (c.apiUrl) {
            try {
                const u = new URL(c.apiUrl);
                if (!/^https?:$/.test(u.protocol))
                    problems.push(`${kind}_API_URL must be http(s)`);
                else if (env.NODE_ENV === "production" && u.protocol !== "https:")
                    problems.push(`${kind}_API_URL must be https in production`);
            }
            catch {
                problems.push(`${kind}_API_URL is not a valid URL`);
            }
        }
        if (kind !== "PUSH")
            need(`${kind}_API_KEY`, c.apiKey);
        if (kind === "AI")
            need("AI_MODEL", c.model);
        if (exports.WEBHOOK_KINDS.includes(kind) && !(0, vendor_kit_1.derivedWebhookSecret)(kind, env))
            need(`${kind}_WEBHOOK_SECRET`, c.webhookSecret);
        if (SENDER_VAR[kind])
            need(SENDER_VAR[kind], c.senderId);
        problems.push(...(0, vendor_kit_1.vendorProblems)(kind, env));
    }
    return problems;
}
function assertProviderConfig(env = process.env, kinds) {
    const problems = validateProviderConfig(env, kinds);
    if (problems.length)
        throw new ProviderConfigError(problems);
}
function providerStatus(env = process.env, kinds = exports.PROVIDER_KINDS) {
    return kinds.map((kind) => {
        const c = providerConfig(kind, env);
        const vendor = c.mode === "real" ? ((0, vendor_kit_1.vendorOf)(kind, env) ?? (kind === "PUSH" && !c.apiUrl ? "fcm+expo" : "gateway")) : "mock";
        return { provider: kind.toLowerCase(), mode: c.mode, vendor, ready: c.mode === "mock" || validateProviderConfig(env, [kind]).length === 0 };
    });
}
function devToolsEnabled(env = process.env) {
    return env.NODE_ENV !== "production" && env.PROVIDER_DEV_TOOLS !== "false";
}
//# sourceMappingURL=provider-env.js.map