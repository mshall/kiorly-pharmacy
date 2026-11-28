"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AiGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiGateway = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const ai_provider_1 = require("../../providers/ai-provider");
const http_1 = require("../../providers/http");
const phi_redaction_1 = require("../../providers/phi-redaction");
const provider_env_1 = require("../../providers/provider-env");
const num = (v, d) => (v && Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : d);
const today = () => new Date().toISOString().slice(0, 10);
let AiGateway = class AiGateway {
    static { AiGateway_1 = this; }
    prisma;
    log = new common_1.Logger(AiGateway_1.name);
    static spent = new Map();
    static fetchImpl;
    constructor(prisma) {
        this.prisma = prisma;
    }
    static resetBudget() { AiGateway_1.spent.clear(); }
    async assist(i) {
        const env = process.env;
        const cfg = (0, provider_env_1.providerConfig)("AI", env);
        const maxIn = num(env.AI_MAX_INPUT_TOKENS, 2000);
        const maxOut = Math.min(i.maxOutputTokens ?? num(env.AI_MAX_OUTPUT_TOKENS, 500), num(env.AI_MAX_OUTPUT_TOKENS, 500));
        const budget = num(env.AI_DAILY_TOKEN_BUDGET, 100_000);
        const red = (0, phi_redaction_1.redactPhi)(i.prompt, i.names);
        const system = i.system ? (0, phi_redaction_1.redactPhi)(i.system, i.names).text : undefined;
        const inTokens = (0, ai_provider_1.estimateTokens)(`${system ?? ""}${red.text}`);
        if (inTokens > maxIn)
            throw new errors_1.DomainError("AI_INPUT_TOO_LARGE", `Prompt is about ${inTokens} tokens (max ${maxIn})`, 413, { maxInputTokens: maxIn });
        const key = `${i.orgId}:${today()}`;
        const used = AiGateway_1.spent.get(key) ?? 0;
        if (used + inTokens + maxOut > budget)
            throw new errors_1.DomainError("AI_BUDGET_EXCEEDED", "Daily AI token budget for this pharmacy is used up", 429, { dailyTokenBudget: budget });
        const provider = (0, ai_provider_1.aiProvider)(env, AiGateway_1.fetchImpl);
        let r;
        try {
            r = await provider.complete({ system, prompt: red.text, maxOutputTokens: maxOut, idempotencyKey: `ai-${(0, node_crypto_1.createHash)("sha256").update(`${i.orgId}|${i.task}|${red.text}`).digest("hex").slice(0, 24)}-${(0, node_crypto_1.randomUUID)().slice(0, 8)}` });
        }
        catch (e) {
            if (e instanceof http_1.ProviderError)
                throw new errors_1.DomainError("AI_UNAVAILABLE", `AI provider call failed (${e.code})`, 503, { code: e.code });
            throw e;
        }
        const outTokens = r.usage.outputTokens || (0, ai_provider_1.estimateTokens)(r.text);
        const inUsed = r.usage.inputTokens || inTokens;
        AiGateway_1.spent.set(key, used + inUsed + outTokens);
        const perK = Number(env.AI_COST_PER_1K_TOKENS_USD);
        const label = `AI-generated (${provider.name}/${r.model}); not clinical advice, a pharmacist must review before use`;
        await this.prisma.auditLog.create({ data: { orgId: i.orgId, actorId: i.actorId, action: "ai.assist", entityType: "AiGateway", entityId: i.task, meta: { provider: provider.name, model: r.model, mode: provider.mode, redactions: red.total, inputTokens: inUsed, outputTokens: outTokens } } }).catch((e) => this.log.warn(`ai audit failed: ${e.message}`));
        return {
            text: `[${label}]\n${r.text}`, label, provider: provider.name, model: r.model, mode: provider.mode, sentPrompt: red.text, redactions: red.counts,
            usage: { inputTokens: inUsed, outputTokens: outTokens, estimatedCostUsd: Number.isFinite(perK) && perK > 0 ? Math.round(((inUsed + outTokens) / 1000) * perK * 1e6) / 1e6 : null },
        };
    }
};
exports.AiGateway = AiGateway;
exports.AiGateway = AiGateway = AiGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiGateway);
//# sourceMappingURL=ai.gateway.js.map