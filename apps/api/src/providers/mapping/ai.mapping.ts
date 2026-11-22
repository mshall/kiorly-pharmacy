import { ProviderError } from "../http";
import type { ProviderConfig } from "../provider-env";
import type { AiRequest, AiResult } from "../provider-types";
import { bearer } from "./generic";

/**
 * AI gateway: the ONLY file to adapt for a concrete LLM vendor. Default = OpenAI-compatible chat completions (OpenAI EU, Azure OpenAI, vLLM, any gateway):
 *   POST {AI_API_URL}/chat/completions { model: AI_MODEL, messages:[{role,content}], max_tokens, temperature }
 *     ->  { id, model, choices:[{ message:{ content } }], usage:{ prompt_tokens, completion_tokens } }
 */
export const aiMapping = {
  paths: { complete: "/chat/completions" },
  authHeaders: (cfg: ProviderConfig) => bearer(cfg),
  body: (cfg: ProviderConfig, r: AiRequest) => ({ model: cfg.model, messages: [...(r.system ? [{ role: "system", content: r.system }] : []), { role: "user", content: r.prompt }], max_tokens: r.maxOutputTokens, temperature: r.temperature ?? 0.2 }),
  result: (cfg: ProviderConfig, json: any): AiResult => {
    const text = json?.choices?.[0]?.message?.content;
    if (typeof text !== "string" || !text.trim()) throw new ProviderError("BAD_RESPONSE", "AI provider response has no message content");
    return { text, model: typeof json?.model === "string" ? json.model : cfg.model ?? "unknown", providerRef: typeof json?.id === "string" ? json.id : undefined, usage: { inputTokens: Number(json?.usage?.prompt_tokens) || 0, outputTokens: Number(json?.usage?.completion_tokens) || 0 } };
  },
};
