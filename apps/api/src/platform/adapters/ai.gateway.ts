import { Inject, Injectable, Logger } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError } from "../../common/errors";
import { aiProvider, estimateTokens } from "../../providers/ai-provider";
import { ProviderError, type FetchLike } from "../../providers/http";
import { redactPhi } from "../../providers/phi-redaction";
import { providerConfig } from "../../providers/provider-env";

export interface AssistInput { orgId: string; actorId?: string; task: string; prompt: string; system?: string; /** Patient / customer / prescriber names known to the caller: removed from the prompt. */ names?: string[]; maxOutputTokens?: number }
export interface AssistResult {
  /** Provider text, prefixed with the AI label. Always show this, never the bare answer. */
  text: string;
  label: string;
  provider: string;
  model: string;
  mode: "mock" | "real";
  /** What was actually sent to the provider (after redaction). */
  sentPrompt: string;
  redactions: Record<string, number>;
  usage: { inputTokens: number; outputTokens: number; estimatedCostUsd: number | null };
}

const num = (v: string | undefined, d: number) => (v && Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : d);
const today = () => new Date().toISOString().slice(0, 10);

/**
 * AI assistant gateway (AI_MODE=mock|real; AI_API_URL, AI_API_KEY, AI_MODEL). Every call: PHI redaction -> input-size guard -> per-org daily token budget
 * -> provider call (timeout / bounded retries / idempotency in providers/http.ts) -> output labelled as AI-generated -> audit row (counts only, never the prompt).
 * Guards: AI_MAX_INPUT_TOKENS (2000), AI_MAX_OUTPUT_TOKENS (500), AI_DAILY_TOKEN_BUDGET per org (100000, in memory per API instance), AI_COST_PER_1K_TOKENS_USD (optional, for the cost estimate).
 * Failures never leak the prompt or credentials (DomainError AI_UNAVAILABLE with the provider error code).
 */
@Injectable()
export class AiGateway {
  private readonly log = new Logger(AiGateway.name);
  private static spent = new Map<string, number>();
  /** Test seam for the real HTTP provider. */
  static fetchImpl?: FetchLike;
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  static resetBudget() { AiGateway.spent.clear(); }

  async assist(i: AssistInput): Promise<AssistResult> {
    const env = process.env;
    const cfg = providerConfig("AI", env);
    const maxIn = num(env.AI_MAX_INPUT_TOKENS, 2000);
    const maxOut = Math.min(i.maxOutputTokens ?? num(env.AI_MAX_OUTPUT_TOKENS, 500), num(env.AI_MAX_OUTPUT_TOKENS, 500));
    const budget = num(env.AI_DAILY_TOKEN_BUDGET, 100_000);

    const red = redactPhi(i.prompt, i.names);
    const system = i.system ? redactPhi(i.system, i.names).text : undefined;
    const inTokens = estimateTokens(`${system ?? ""}${red.text}`);
    if (inTokens > maxIn) throw new DomainError("AI_INPUT_TOO_LARGE", `Prompt is about ${inTokens} tokens (max ${maxIn})`, 413, { maxInputTokens: maxIn });
    const key = `${i.orgId}:${today()}`;
    const used = AiGateway.spent.get(key) ?? 0;
    if (used + inTokens + maxOut > budget) throw new DomainError("AI_BUDGET_EXCEEDED", "Daily AI token budget for this pharmacy is used up", 429, { dailyTokenBudget: budget });

    const provider = aiProvider(env, AiGateway.fetchImpl);
    let r;
    try {
      r = await provider.complete({ system, prompt: red.text, maxOutputTokens: maxOut, idempotencyKey: `ai-${createHash("sha256").update(`${i.orgId}|${i.task}|${red.text}`).digest("hex").slice(0, 24)}-${randomUUID().slice(0, 8)}` });
    } catch (e) {
      if (e instanceof ProviderError) throw new DomainError("AI_UNAVAILABLE", `AI provider call failed (${e.code})`, 503, { code: e.code });
      throw e;
    }
    const outTokens = r.usage.outputTokens || estimateTokens(r.text);
    const inUsed = r.usage.inputTokens || inTokens;
    AiGateway.spent.set(key, used + inUsed + outTokens);
    const perK = Number(env.AI_COST_PER_1K_TOKENS_USD);
    const label = `AI-generated (${provider.name}/${r.model}); not clinical advice, a pharmacist must review before use`;
    await this.prisma.auditLog.create({ data: { orgId: i.orgId, actorId: i.actorId, action: "ai.assist", entityType: "AiGateway", entityId: i.task, meta: { provider: provider.name, model: r.model, mode: provider.mode, redactions: red.total, inputTokens: inUsed, outputTokens: outTokens } } }).catch((e) => this.log.warn(`ai audit failed: ${(e as Error).message}`));
    return {
      text: `[${label}]\n${r.text}`, label, provider: provider.name, model: r.model, mode: provider.mode, sentPrompt: red.text, redactions: red.counts,
      usage: { inputTokens: inUsed, outputTokens: outTokens, estimatedCostUsd: Number.isFinite(perK) && perK > 0 ? Math.round(((inUsed + outTokens) / 1000) * perK * 1e6) / 1e6 : null },
    };
  }
}
