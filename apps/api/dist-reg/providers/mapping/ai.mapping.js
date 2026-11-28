"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiMapping = void 0;
const http_1 = require("../http");
const generic_1 = require("./generic");
exports.aiMapping = {
    paths: { complete: "/chat/completions" },
    authHeaders: (cfg) => (0, generic_1.bearer)(cfg),
    body: (cfg, r) => ({ model: cfg.model, messages: [...(r.system ? [{ role: "system", content: r.system }] : []), { role: "user", content: r.prompt }], max_tokens: r.maxOutputTokens, temperature: r.temperature ?? 0.2 }),
    result: (cfg, json) => {
        const text = json?.choices?.[0]?.message?.content;
        if (typeof text !== "string" || !text.trim())
            throw new http_1.ProviderError("BAD_RESPONSE", "AI provider response has no message content");
        return { text, model: typeof json?.model === "string" ? json.model : cfg.model ?? "unknown", providerRef: typeof json?.id === "string" ? json.id : undefined, usage: { inputTokens: Number(json?.usage?.prompt_tokens) || 0, outputTokens: Number(json?.usage?.completion_tokens) || 0 } };
    },
};
//# sourceMappingURL=ai.mapping.js.map