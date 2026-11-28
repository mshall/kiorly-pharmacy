"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpAiProvider = exports.MockAiProvider = exports.estimateTokens = void 0;
exports.aiProvider = aiProvider;
const node_crypto_1 = require("node:crypto");
const http_1 = require("./http");
const provider_env_1 = require("./provider-env");
const ai_mapping_1 = require("./mapping/ai.mapping");
const estimateTokens = (s) => Math.ceil(s.length / 4);
exports.estimateTokens = estimateTokens;
class MockAiProvider {
    mode = "mock";
    name = "fake";
    async complete(r) {
        const digest = (0, node_crypto_1.createHash)("sha256").update(`${r.system ?? ""}|${r.prompt}`).digest("hex").slice(0, 8);
        const text = `Fake AI answer ${digest}. You asked: "${r.prompt.replace(/\s+/g, " ").slice(0, 120)}"`.slice(0, r.maxOutputTokens * 4);
        return { text, model: "fake-1", providerRef: `fakeai_${digest}`, usage: { inputTokens: (0, exports.estimateTokens)(`${r.system ?? ""}${r.prompt}`), outputTokens: (0, exports.estimateTokens)(text) } };
    }
}
exports.MockAiProvider = MockAiProvider;
class HttpAiProvider {
    cfg;
    fetchImpl;
    mode = "real";
    name = "ai";
    constructor(cfg, fetchImpl) {
        this.cfg = cfg;
        this.fetchImpl = fetchImpl;
    }
    async complete(r) {
        const res = await (0, http_1.providerRequest)(this.cfg, { path: ai_mapping_1.aiMapping.paths.complete, body: ai_mapping_1.aiMapping.body(this.cfg, r), idempotencyKey: r.idempotencyKey }, ai_mapping_1.aiMapping.authHeaders(this.cfg), this.fetchImpl);
        return ai_mapping_1.aiMapping.result(this.cfg, res.json);
    }
}
exports.HttpAiProvider = HttpAiProvider;
function aiProvider(env = process.env, fetchImpl) {
    const cfg = (0, provider_env_1.providerConfig)("AI", env);
    return cfg.mode === "real" ? new HttpAiProvider(cfg, fetchImpl) : new MockAiProvider();
}
//# sourceMappingURL=ai-provider.js.map