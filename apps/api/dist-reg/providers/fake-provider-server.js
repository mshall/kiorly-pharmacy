"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startFakeProvider = startFakeProvider;
const node_http_1 = require("node:http");
const read = (req) => new Promise((res) => { const c = []; req.on("data", (d) => c.push(d)); req.on("end", () => res(Buffer.concat(c))); });
async function startFakeProvider(override, idPrefix = "fake") {
    const requests = [];
    const objects = new Map();
    const server = (0, node_http_1.createServer)(async (req, res) => {
        const raw = await read(req);
        let body = null;
        if (raw.length && /json/.test(String(req.headers["content-type"] ?? ""))) {
            try {
                body = JSON.parse(raw.toString("utf8"));
            }
            catch { }
        }
        const rec = { method: req.method ?? "GET", path: req.url ?? "/", headers: req.headers, body, raw };
        requests.push(rec);
        const n = requests.length;
        let reply = override?.(rec, n) ?? {};
        if (reply.status === undefined && reply.body === undefined) {
            const p = rec.path.split("?")[0];
            if (rec.method === "PUT") {
                objects.set(p, raw);
                reply = { status: 200, body: { ok: true } };
            }
            else if (rec.method === "GET" && objects.has(p)) {
                res.writeHead(200, { "content-type": "application/octet-stream" });
                res.end(objects.get(p));
                return;
            }
            else if (p === "/messages")
                reply = { status: 202, body: { id: `${idPrefix}_msg_${n}`, status: "queued" } };
            else if (p === "/charges")
                reply = { status: 200, body: { id: `${idPrefix}_ch_${n}`, status: rec.body?.cardToken === "tok_decline" ? "declined" : "captured", declineReason: rec.body?.cardToken === "tok_decline" ? "do_not_honor" : undefined } };
            else if (p === "/pay-links")
                reply = { status: 201, body: { id: `${idPrefix}_pl_${n}`, payUrl: `https://pay.fake.test/${n}`, status: "pending" } };
            else if (p === "/refunds")
                reply = { status: 200, body: { id: `${idPrefix}_rf_${n}`, status: "pending" } };
            else if (p === "/consents" && rec.method === "POST")
                reply = { status: 201, body: { id: `${idPrefix}_cs_${n}`, status: "active", expiresAt: rec.body?.expiresAt } };
            else if (p === "/consents" && rec.method === "GET")
                reply = { status: 200, body: { data: [{ id: `${idPrefix}_cs_1`, status: "active", grantedAt: new Date().toISOString() }] } };
            else if (/^\/consents\/[^/]+\/revoke$/.test(p))
                reply = { status: 200, body: { id: decodeURIComponent(p.split("/")[2]), status: "revoked" } };
            else if (p === "/consents/introspect")
                reply = { status: 200, body: { active: !String(rec.body?.token ?? "").startsWith("ct_revoked"), reason: String(rec.body?.token ?? "").startsWith("ct_revoked") ? "revoked" : undefined, expiresAt: new Date(Date.now() + 86_400_000).toISOString() } };
            else if (p === "/chat/completions")
                reply = { status: 200, body: { id: `${idPrefix}_ai_${n}`, model: rec.body?.model ?? "fake-model", choices: [{ message: { role: "assistant", content: `Echo: ${String(rec.body?.messages?.at(-1)?.content ?? "").slice(0, 100)}` } }], usage: { prompt_tokens: 40, completion_tokens: 12 } } };
            else if (p === "/")
                reply = { status: 200, body: { data: (Array.isArray(rec.body) ? rec.body : []).map(() => ({ status: "ok", id: "t" })) } };
            else
                reply = { status: 404, body: { error: "not found" } };
        }
        const send = () => { res.writeHead(reply.status ?? 200, { "content-type": "application/json", ...(reply.headers ?? {}) }); res.end(JSON.stringify(reply.body ?? {})); };
        if (reply.delayMs)
            setTimeout(send, reply.delayMs);
        else
            send();
    });
    await new Promise((r) => server.listen(0, "127.0.0.1", r));
    const addr = server.address();
    return { url: `http://127.0.0.1:${addr.port}`, requests, objects, close: () => new Promise((r) => { server.closeAllConnections?.(); server.close(() => r()); }) };
}
//# sourceMappingURL=fake-provider-server.js.map