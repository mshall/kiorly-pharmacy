"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderError = void 0;
exports.mapStatus = mapStatus;
exports.providerRequest = providerRequest;
class ProviderError extends Error {
    code;
    httpStatus;
    retryable;
    constructor(code, message, httpStatus, retryable = false) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
        this.retryable = retryable;
        this.name = "ProviderError";
    }
}
exports.ProviderError = ProviderError;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function mapStatus(status) {
    if (status >= 200 && status < 300)
        return null;
    if (status === 401 || status === 403)
        return new ProviderError("AUTH", `provider rejected our credentials (${status})`, status);
    if (status === 408)
        return new ProviderError("TIMEOUT", "provider timed out (408)", status, true);
    if (status === 429)
        return new ProviderError("RATE_LIMITED", "provider rate limit (429)", status, true);
    if (status >= 500)
        return new ProviderError("PROVIDER_5XX", `provider error (${status})`, status, true);
    return new ProviderError("REJECTED", `provider rejected the request (${status})`, status);
}
async function providerRequest(cfg, req, authHeaders, fetchImpl = fetch) {
    if (!cfg.apiUrl && !req.absoluteUrl)
        throw new ProviderError("NOT_CONFIGURED", `${cfg.kind}_API_URL is not set`);
    const url = req.absoluteUrl ?? `${cfg.apiUrl}${req.path.startsWith("/") || req.path === "" ? req.path : `/${req.path}`}`;
    const headers = { accept: "application/json", ...(req.rawBody ? {} : { "content-type": req.form ? "application/x-www-form-urlencoded" : "application/json" }), ...authHeaders, ...req.headers };
    if (req.idempotencyKey)
        headers["idempotency-key"] = req.idempotencyKey;
    const body = req.rawBody ?? (req.form ? new URLSearchParams(req.form).toString() : req.body === undefined ? undefined : JSON.stringify(req.body));
    let last = new ProviderError("NETWORK", "no attempt made", undefined, true);
    for (let attempt = 0; attempt <= cfg.maxRetries; attempt++) {
        let retryAfterMs = 0;
        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort(), cfg.timeoutMs);
        try {
            const signed = req.sign ? req.sign({ method: req.method ?? "POST", url, body: typeof body === "string" ? body : "" }) : {};
            const res = await fetchImpl(url, { method: req.method ?? "POST", headers: { ...headers, ...signed }, body, signal: ac.signal });
            const raw = new Uint8Array(await res.arrayBuffer());
            const err = mapStatus(res.status);
            if (err) {
                const ra = Number(res.headers.get("retry-after"));
                if (Number.isFinite(ra) && ra > 0)
                    retryAfterMs = Math.min(ra * 1000, 10_000);
                last = err;
            }
            else {
                let json = null;
                if (!req.rawBody && !req.binary && raw.length && /json/.test(res.headers.get("content-type") ?? "json")) {
                    try {
                        json = JSON.parse(Buffer.from(raw).toString("utf8"));
                    }
                    catch {
                        throw new ProviderError("BAD_RESPONSE", "provider returned a non-JSON body", res.status);
                    }
                }
                return { status: res.status, json, raw };
            }
        }
        catch (e) {
            if (e instanceof ProviderError && !e.retryable)
                throw e;
            if (e instanceof ProviderError)
                last = e;
            else
                last = e?.name === "AbortError" ? new ProviderError("TIMEOUT", `provider did not answer within ${cfg.timeoutMs} ms`, undefined, true) : new ProviderError("NETWORK", "provider unreachable", undefined, true);
        }
        finally {
            clearTimeout(timer);
        }
        if (!last.retryable || attempt === cfg.maxRetries)
            throw last;
        await sleep(retryAfterMs || cfg.backoffMs * 2 ** attempt * (0.75 + Math.random() * 0.5));
    }
    throw last;
}
//# sourceMappingURL=http.js.map