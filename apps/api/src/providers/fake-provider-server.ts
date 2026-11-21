import { createServer, type IncomingMessage, type Server } from "node:http";

/** Test helper: a local fake provider (SMS / email / WhatsApp gateway, PSP, push gateway, object store) used to prove real-mode wiring without any network. */
export interface RecordedRequest { method: string; path: string; headers: Record<string, string | string[] | undefined>; body: any; raw: Buffer }
export interface FakeReply { status?: number; body?: unknown; delayMs?: number; headers?: Record<string, string> }
export interface FakeProvider { url: string; requests: RecordedRequest[]; objects: Map<string, Buffer>; close(): Promise<void> }

const read = (req: IncomingMessage) => new Promise<Buffer>((res) => { const c: Buffer[] = []; req.on("data", (d) => c.push(d)); req.on("end", () => res(Buffer.concat(c))); });

/** `idPrefix` keeps provider ids unique across runs when the DB under test is persistent. */
export async function startFakeProvider(override?: (r: RecordedRequest, n: number) => FakeReply | undefined, idPrefix = "fake"): Promise<FakeProvider> {
  const requests: RecordedRequest[] = [];
  const objects = new Map<string, Buffer>();
  const server: Server = createServer(async (req, res) => {
    const raw = await read(req);
    let body: any = null;
    if (raw.length && /json/.test(String(req.headers["content-type"] ?? ""))) { try { body = JSON.parse(raw.toString("utf8")); } catch { /* keep null */ } }
    const rec: RecordedRequest = { method: req.method ?? "GET", path: req.url ?? "/", headers: req.headers, body, raw };
    requests.push(rec);
    const n = requests.length;
    let reply: FakeReply = override?.(rec, n) ?? {};
    if (reply.status === undefined && reply.body === undefined) {
      const p = rec.path.split("?")[0]!;
      if (rec.method === "PUT") { objects.set(p, raw); reply = { status: 200, body: { ok: true } }; }
      else if (rec.method === "GET" && objects.has(p)) {
        res.writeHead(200, { "content-type": "application/octet-stream" }); res.end(objects.get(p)); return;
      }
      else if (p === "/messages") reply = { status: 202, body: { id: `${idPrefix}_msg_${n}`, status: "queued" } };
      else if (p === "/charges") reply = { status: 200, body: { id: `${idPrefix}_ch_${n}`, status: rec.body?.cardToken === "tok_decline" ? "declined" : "captured", declineReason: rec.body?.cardToken === "tok_decline" ? "do_not_honor" : undefined } };
      else if (p === "/pay-links") reply = { status: 201, body: { id: `${idPrefix}_pl_${n}`, payUrl: `https://pay.fake.test/${n}`, status: "pending" } };
      else if (p === "/refunds") reply = { status: 200, body: { id: `${idPrefix}_rf_${n}`, status: "pending" } };
      else if (p === "/") reply = { status: 200, body: { data: (Array.isArray(rec.body) ? rec.body : []).map(() => ({ status: "ok", id: "t" })) } };
      else reply = { status: 404, body: { error: "not found" } };
    }
    const send = () => { res.writeHead(reply.status ?? 200, { "content-type": "application/json", ...(reply.headers ?? {}) }); res.end(JSON.stringify(reply.body ?? {})); };
    if (reply.delayMs) setTimeout(send, reply.delayMs); else send();
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  const addr = server.address() as { port: number };
  return { url: `http://127.0.0.1:${addr.port}`, requests, objects, close: () => new Promise((r) => { server.closeAllConnections?.(); server.close(() => r()); }) };
}
