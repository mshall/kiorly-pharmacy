/** Routes the Kiorly Team client may call even without the mobile_staff_app entitlement (login, bootstrap, safety alerts + the witness countersign flow ADR-025, own sign-out). */
export function isEntitlementExempt(method: string, path: string): boolean {
  const p = path.split("?")[0]!.replace(/\/+$/, "");
  if (/^\/api\/v1\/auth(\/|$)/.test(p) || p === "/api/v1/mobile/bootstrap") return true;
  if (/^\/api\/v1\/mobile\/alerts(\/|$)/.test(p)) return true;
  // The witness countersign flow is the response to the CONTROLLED_WITNESS_PENDING safety alert: safety paths are never plan-gated (ADR-025). RBAC (controlled.read / controlled.manage) still applies.
  if (method === "GET" && p === "/api/v1/mobile/pharmacy/controlled/pending-witness") return true;
  if (method === "POST" && p === "/api/v1/mobile/pharmacy/controlled/countersign") return true;
  if (method === "POST" && p === "/api/v1/mobile/upgrade-request") return true;
  return method === "DELETE" && /^\/api\/v1\/mobile\/devices\/[^/]+$/.test(p);
}

/** Plan-gated: requests from the Kiorly Team client or any /mobile/* route, minus the exempt ones. */
export function isMobilePlanGated(req: { method: string; originalUrl?: string; url: string; headers: Record<string, string | string[] | undefined> }): boolean {
  const url = req.originalUrl ?? req.url;
  const c = req.headers["x-kiorly-client"];
  const client = Array.isArray(c) ? c[0] : c;
  const isApp = Boolean(client && /^kiorly-(team|work)(\/|$)/.test(client)) || /^\/api\/v1\/mobile(\/|$|\?)/.test(url);
  return isApp && !isEntitlementExempt(req.method, url);
}
