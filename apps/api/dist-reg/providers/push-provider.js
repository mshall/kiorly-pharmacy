"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPush = sendPush;
const http_1 = require("./http");
const provider_env_1 = require("./provider-env");
const push_1 = require("./vendors/push");
const asResponseFetch = (f) => async (url, init = {}) => {
    const r = await f(url, { method: init.method ?? "POST", headers: (init.headers ?? {}), body: init.body, signal: init.signal });
    const text = Buffer.from(await r.arrayBuffer()).toString("utf8");
    return { status: r.status, ok: r.status >= 200 && r.status < 300, text: async () => text };
};
async function sendPush(msgs, env = process.env, fetchImpl) {
    const cfg = (0, provider_env_1.providerConfig)("PUSH", env);
    if (cfg.mode !== "real")
        return { accepted: msgs.length, invalid: [] };
    if (!msgs.length)
        return { accepted: 0, invalid: [] };
    if (cfg.apiUrl) {
        const res = await (0, http_1.providerRequest)(cfg, { path: "", body: msgs }, cfg.apiKey ? { authorization: `Bearer ${cfg.apiKey}` } : {}, fetchImpl);
        const tickets = Array.isArray(res.json?.data) ? res.json.data : [];
        return { accepted: tickets.length ? tickets.filter((t) => t?.status !== "error").length : msgs.length, invalid: [] };
    }
    if ((0, push_1.pushProblems)(env).length)
        throw new http_1.ProviderError("NOT_CONFIGURED", "push credentials are not set (PUSH_FCM_SERVICE_ACCOUNT_JSON and/or PUSH_EXPO_ENABLED, or PUSH_API_URL)");
    const sender = new push_1.PushSender((0, push_1.pushConfigFromEnv)(env), fetchImpl ? asResponseFetch(fetchImpl) : fetch);
    let accepted = 0;
    const invalid = [];
    let lastError;
    for (const m of msgs) {
        const r = await sender.send({ token: m.to, title: m.title, body: m.body, data: m.data, channelId: m.channelId });
        if (r.ok)
            accepted++;
        else {
            lastError = r.error;
            if (r.invalidToken)
                invalid.push(m.to);
        }
    }
    if (!accepted && invalid.length < msgs.length)
        throw new http_1.ProviderError("REJECTED", `push provider rejected every message (${lastError ?? "unknown"})`);
    return { accepted, invalid };
}
//# sourceMappingURL=push-provider.js.map