import { createHash } from "node:crypto";
import { providerRequest, type FetchLike } from "./http";
import { providerConfig, type ProviderConfig } from "./provider-env";
import type { AiRequest, AiResult } from "./provider-types";
import { aiMapping as M } from "./mapping/ai.mapping";

/** Port: LLM completion. Callers go through AiGateway (platform/adapters/ai.gateway.ts), which redacts PHI, guards tokens/cost and labels output. */
export interface AiProvider {
  readonly mode: "mock" | "real";
  readonly name: string;
  complete(r: AiRequest): Promise<AiResult>;
}

/** Rough token estimate (~4 chars/token) used for the guard and by the fake. */
export const estimateTokens = (s: string) => Math.ceil(s.length / 4);

/** Deterministic fake ("fake" provider): the answer is a pure function of the (already redacted) prompt, so demos/tests can assert on it. No network. */
export class MockAiProvider implements AiProvider {
  readonly mode = "mock" as const;
  readonly name = "fake";
  async complete(r: AiRequest): Promise<AiResult> {
    const digest = createHash("sha256").update(`${r.system ?? ""}|${r.prompt}`).digest("hex").slice(0, 8);
    const text = `Fake AI answer ${digest}. You asked: "${r.prompt.replace(/\s+/g, " ").slice(0, 120)}"`.slice(0, r.maxOutputTokens * 4);
    return { text, model: "fake-1", providerRef: `fakeai_${digest}`, usage: { inputTokens: estimateTokens(`${r.system ?? ""}${r.prompt}`), outputTokens: estimateTokens(text) } };
  }
}

export class HttpAiProvider implements AiProvider {
  readonly mode = "real" as const;
  readonly name = "ai";
  constructor(private readonly cfg: ProviderConfig, private readonly fetchImpl?: FetchLike) {}
  async complete(r: AiRequest): Promise<AiResult> {
    const res = await providerRequest(this.cfg, { path: M.paths.complete, body: M.body(this.cfg, r), idempotencyKey: r.idempotencyKey }, M.authHeaders(this.cfg), this.fetchImpl);
    return M.result(this.cfg, res.json);
  }
}

export function aiProvider(env: Record<string, string | undefined> = process.env, fetchImpl?: FetchLike): AiProvider {
  const cfg = providerConfig("AI", env);
  return cfg.mode === "real" ? new HttpAiProvider(cfg, fetchImpl) : new MockAiProvider();
}
