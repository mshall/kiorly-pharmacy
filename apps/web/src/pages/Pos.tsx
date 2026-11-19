import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { api, ApiError, newKey } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, Select, Table, Td, errorMessage } from "@/components/ui";
import { useOnline } from "@/components/Layout";
import { fmtMoney } from "@/lib/format";
import { drugName } from "@/lib/format";
import { listQueue, loadCatalogue, queueSale, removeQueued, saveCatalogue, searchOffline, type OfflineItem, type QueuedSale } from "@/lib/offline";
import { printHtml } from "@/lib/print";
import { useToast } from "@/lib/toast";
import type { Sale } from "@/lib/types";

interface CartLine { item: OfflineItem; qty: number }
interface Customer { id: string; displayName: string; creditLimit: string; balance: string; available: string }
interface Shift { id: string; openedAt: string; openingFloat: string }
interface Pay { method: string; amount: string }
const METHODS = ["CASH", "CARD", "INSTAPAY", "FAWRY", "WALLET", "CUSTOMER_CREDIT"] as const;

/** Touch-first till. Search + barcode run against a local catalogue copy (IndexedDB) so the till keeps working offline; sales ring up with an idempotency key. */
export function Pos() {
  const { t } = useTranslation();
  const { branchId, can } = useAuth();
  const online = useOnline();
  const qc = useQueryClient(); const toast = useToast();
  const scanRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<OfflineItem[]>([]); const [q, setQ] = useState(""); const [cart, setCart] = useState<CartLine[]>([]);
  const [pay, setPay] = useState(false); const [shiftModal, setShiftModal] = useState<"open" | "close" | null>(null); const [history, setHistory] = useState(false); const [conflictsOpen, setConflictsOpen] = useState(false);
  const [receipt, setReceipt] = useState<{ sale?: Sale; change: string; queued?: boolean } | null>(null);
  const [approval, setApproval] = useState<{ retry: () => void } | null>(null);

  // --- local catalogue (offline bundle)
  const refreshBundle = useCallback(async () => {
    setItems(await loadCatalogue());
    if (!navigator.onLine || !branchId) return;
    try { const b = await api<{ generatedAt: string; items: OfflineItem[] }>("/pos/offline-bundle", { query: { branchId } }); await saveCatalogue(b.items, b.generatedAt); setItems(b.items); } catch { /* keep cached copy */ }
  }, [branchId]);
  useEffect(() => { void refreshBundle(); const id = setInterval(() => void refreshBundle(), 120_000); return () => clearInterval(id); }, [refreshBundle]);
  useEffect(() => { scanRef.current?.focus(); }, [cart.length, pay]);

  const shiftQ = useQuery({ queryKey: ["shift", branchId], queryFn: () => api<Shift | null>("/pos/shifts/current", { query: { branchId } }), enabled: !!branchId && online, retry: false });
  const shift = shiftQ.data ?? null;
  const queueQ = useQuery({ queryKey: ["offline-queue-full"], queryFn: listQueue, refetchInterval: 4000 });
  const results = useMemo(() => searchOffline(items, q), [items, q]);

  const add = (item: OfflineItem) => setCart((c) => { const i = c.findIndex((x) => x.item.id === item.id); return i >= 0 ? c.map((x, k) => (k === i ? { ...x, qty: x.qty + 1 } : x)) : [...c, { item, qty: 1 }]; });
  const onScanSubmit = async () => {
    const code = q.trim(); if (!code) return;
    const hit = items.find((i) => i.gtin === code || i.gtin === code.padStart(14, "0") || i.gtin === code.replace(/^0+/, ""));
    if (hit) { add(hit); setQ(""); return; }
    if (online && /^\d{6,14}$/.test(code)) {
      const r = await api<{ found: boolean; requiresPrescription?: boolean }>("/pos/lookup", { query: { code, branchId } }).catch(() => null);
      if (r?.found && r.requiresPrescription) { toast(t("pos.rxRequired"), "err"); setQ(""); return; }
      if (r && !r.found) toast(t("pos.notFound"), "err");
    }
  };
  const total = cart.reduce((a, l) => a + Number(l.item.price) * l.qty, 0);

  // --- sale
  const [pays, setPays] = useState<Pay[]>([]); const [customerId, setCustomerId] = useState(""); const [amount, setAmount] = useState(""); const [method, setMethod] = useState<string>("CASH");
  const customers = useQuery({ queryKey: ["customers"], queryFn: () => api<Customer[]>("/pos/customers"), enabled: pay && can("customer.credit") && online });
  const paid = pays.reduce((a, p) => a + Number(p.amount), 0);
  const due = Math.max(total - paid, 0);
  const reset = () => { setCart([]); setPays([]); setPay(false); setCustomerId(""); setAmount(""); setQ(""); };
  const checkout = useMutation({
    mutationFn: async (vars: { approval?: { email: string; password: string }; key: string }) => {
      const body = { idempotencyKey: vars.key, lines: cart.map((l) => ({ drugId: l.item.id, quantity: l.qty })), payments: pays, customerAccountId: customerId || undefined, approval: vars.approval };
      try { return await api<{ sale: Sale; change: string }>("/pos/sales", { body: { ...body, branchId } }); }
      catch (e) {
        if (e instanceof ApiError && e.isNetwork) {
          if (pays.some((p) => !["CASH", "CUSTOMER_CREDIT"].includes(p.method))) throw new ApiError(0, "OFFLINE_METHOD_NOT_SUPPORTED", t("pos.offlineCashOnly"));
          const q: QueuedSale = { idempotencyKey: vars.key, clientCreatedAt: new Date().toISOString(), lines: body.lines, payments: pays, customerAccountId: customerId || undefined, total: total.toFixed(2), label: cart.map((l) => `${l.qty}× ${l.item.brandName}`).join(", ") };
          await queueSale(q);
          return { queued: true as const };
        }
        throw e;
      }
    },
    onSuccess: (r) => {
      if ("queued" in r) { setReceipt({ change: "0.00", queued: true }); toast(t("pos.savedOffline")); } else { setReceipt({ sale: r.sale, change: r.change }); void refreshBundle(); void qc.invalidateQueries({ queryKey: ["dashboard"] }); }
      reset(); void qc.invalidateQueries({ queryKey: ["offline-queue"] }); void qc.invalidateQueries({ queryKey: ["offline-queue-full"] });
    },
    onError: (e, vars) => { if (e instanceof ApiError && e.code === "INSUFFICIENT_STOCK") setApproval({ retry: () => undefined }); void vars; },
  });
  const [saleKey, setSaleKey] = useState(newKey());
  const startPay = () => { setPays([]); setAmount(""); setMethod("CASH"); setSaleKey(newKey()); setPay(true); };
  const addPay = () => { const a = amount || due.toFixed(2); if (Number(a) <= 0) return; setPays([...pays, { method, amount: Number(a).toFixed(2) }]); setAmount(""); };

  // --- sync
  const sync = useMutation({
    mutationFn: async () => {
      const queue = await listQueue();
      const r = await api<{ results: Array<{ idempotencyKey: string; status: string; reason?: string }> }>("/pos/sync", { body: { branchId, sales: queue.map((s) => ({ idempotencyKey: s.idempotencyKey, clientCreatedAt: s.clientCreatedAt, lines: s.lines, payments: s.payments, customerAccountId: s.customerAccountId })) } });
      for (const x of r.results) await removeQueued(x.idempotencyKey);
      return r.results;
    },
    onSuccess: (res) => { const c = res.filter((x) => x.status === "CONFLICT").length; toast(t("pos.synced", { ok: res.length - c, conflicts: c }), c ? "err" : "ok"); void qc.invalidateQueries({ queryKey: ["offline-queue"] }); void qc.invalidateQueries({ queryKey: ["offline-queue-full"] }); void qc.invalidateQueries({ queryKey: ["dashboard"] }); void refreshBundle(); },
  });
  useEffect(() => { if (online && (queueQ.data?.length ?? 0) > 0 && !sync.isPending) sync.mutate(); /* auto-sync when connectivity returns */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online]);

  const needShift = online && !shift && !shiftQ.isLoading;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{t("pos.title")}</h1>
        <div className="flex flex-wrap items-center gap-2">
          {shift ? <><Badge tone="good">{t("pos.shiftOpen")}</Badge><Button size="sm" variant="outline" onClick={() => setHistory(true)}>{t("pos.sales")}</Button><Button size="sm" variant="outline" onClick={() => setShiftModal("close")}>{t("pos.closeShift")}</Button></> : online && can("pos.shift") && <Button onClick={() => setShiftModal("open")}>{t("pos.openShift")}</Button>}
          {!!queueQ.data?.length && <Button size="sm" variant="outline" disabled={!online || sync.isPending} onClick={() => sync.mutate()}>{t("pos.sync", { count: queueQ.data.length })}</Button>}
          {can("pos.refund_approve") && <Button size="sm" variant="ghost" onClick={() => setConflictsOpen(true)}>{t("pos.conflicts")}</Button>}
        </div>
      </div>
      <ErrorNote error={sync.error} />
      {needShift && <p role="alert" className="rounded-md bg-[hsl(var(--warning)/0.18)] p-3 text-sm">{t("pos.needShift")}</p>}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-3">
          <form onSubmit={(e) => { e.preventDefault(); void onScanSubmit(); }}>
            <label htmlFor="pos-scan" className="sr-only">{t("pos.scan")}</label>
            <Input id="pos-scan" ref={scanRef} autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("pos.scan")} className="min-h-14 text-lg" />
          </form>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4" aria-label={t("pos.results")}>
            {results.map((i) => (
              <li key={i.id}><button type="button" onClick={() => add(i)} className="min-h-24 w-full rounded-lg bg-card p-3 text-start shadow-sm ring-1 ring-border hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">
                <div className="line-clamp-2 text-sm font-semibold">{drugName(i)}</div><div className="text-xs text-muted-foreground">{i.strength}</div>
                <div className="mt-1 flex items-center justify-between"><span className="font-bold">{fmtMoney(i.price)}</span><span className="text-xs text-muted-foreground">{t("inv.available")}: {i.available}</span></div>
              </button></li>
            ))}
            {!results.length && <li className="col-span-full"><Empty>{items.length ? t("common.noResults") : t("pos.noCatalogue")}</Empty></li>}
          </ul>
          <p className="text-xs text-muted-foreground">{t("pos.rxNote")} <Link className="underline" to="/rx">{t("nav.rx")}</Link></p>
        </div>
        <Card className="lg:col-span-2" title={t("pos.cart")}>
          {!cart.length ? <Empty>{t("pos.emptyCart")}</Empty> : (
            <ul className="divide-y divide-border">
              {cart.map((l) => (
                <li key={l.item.id} className="flex items-center justify-between gap-2 py-2">
                  <div className="min-w-0"><div className="truncate text-sm font-medium">{drugName(l.item)}</div><div className="text-xs text-muted-foreground">{fmtMoney(l.item.price)}</div></div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" aria-label={t("pos.decrease")} onClick={() => setCart(cart.map((x) => (x === l ? { ...x, qty: Math.max(1, x.qty - 1) } : x)))}>−</Button>
                    <span className="w-8 text-center font-semibold" aria-live="polite">{l.qty}</span>
                    <Button size="sm" variant="outline" aria-label={t("pos.increase")} onClick={() => setCart(cart.map((x) => (x === l ? { ...x, qty: x.qty + 1 } : x)))}>+</Button>
                    <Button size="sm" variant="ghost" aria-label={t("common.remove")} onClick={() => setCart(cart.filter((x) => x !== l))}>✕</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 border-t border-border pt-3"><div className="flex items-center justify-between text-xl font-bold"><span>{t("pos.total")}</span><span data-testid="cart-total">{fmtMoney(total)}</span></div>
            <Button size="lg" className="mt-3 w-full" disabled={!cart.length || (online && !shift)} onClick={startPay}>{t("pos.pay")}</Button></div>
        </Card>
      </div>

      <Modal open={pay} onClose={() => setPay(false)} title={t("pos.payment")} wide>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-2xl font-bold"><span>{t("pos.total")}</span><span>{fmtMoney(total)}</span></div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("pos.method")}>{METHODS.map((m) => <Button key={m} variant={method === m ? "primary" : "outline"} aria-pressed={method === m} disabled={!online && !["CASH", "CUSTOMER_CREDIT"].includes(m)} onClick={() => setMethod(m)}>{t(`method.${m}`)}</Button>)}</div>
          {method === "CUSTOMER_CREDIT" && <Field label={t("pos.customer")}>{(id) => <Select id={id} value={customerId} onChange={(e) => setCustomerId(e.target.value)}><option value="">—</option>{customers.data?.map((c) => <option key={c.id} value={c.id}>{c.displayName} ({t("pos.creditAvailable")}: {fmtMoney(c.available)})</option>)}</Select>}</Field>}
          <div className="flex flex-wrap items-end gap-2">
            <Field label={t("pos.amount")}>{(id) => <Input id={id} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={due.toFixed(2)} className="w-40 text-lg" />}</Field>
            <Button onClick={addPay}>{t("pos.addPayment")}</Button>
            {method === "CASH" && [50, 100, 200].map((n) => <Button key={n} variant="outline" onClick={() => setAmount(String(n))}>{n}</Button>)}
          </div>
          {pays.length > 0 && <ul className="space-y-1">{pays.map((p, i) => <li key={i} className="flex items-center justify-between rounded-md bg-secondary px-3 py-2 text-sm"><span>{t(`method.${p.method}`)}</span><span className="flex items-center gap-2 font-semibold">{fmtMoney(p.amount)}<Button size="sm" variant="ghost" aria-label={t("common.remove")} onClick={() => setPays(pays.filter((_, k) => k !== i))}>✕</Button></span></li>)}</ul>}
          <div className="flex justify-between text-lg"><span>{due > 0 ? t("pos.due") : t("pos.change")}</span><span className="font-bold">{fmtMoney(due > 0 ? due : paid - total)}</span></div>
          {checkout.error && !approval && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-danger">{errorMessage(checkout.error, t as never)}</p>}
          <Button size="lg" className="w-full" disabled={due > 0 || checkout.isPending || !pays.length} onClick={() => checkout.mutate({ key: saleKey })}>{t("pos.complete")}</Button>
        </div>
      </Modal>
      {approval && <ApprovalModal onClose={() => setApproval(null)} onApprove={(a) => { setApproval(null); checkout.mutate({ key: saleKey, approval: a }); }} message={t("pos.negativeStock")} />}
      <ReceiptModal data={receipt} onClose={() => { setReceipt(null); scanRef.current?.focus(); }} />
      <ShiftModal mode={shiftModal} shift={shift} onClose={() => setShiftModal(null)} branchId={branchId} />
      <HistoryModal open={history} onClose={() => setHistory(false)} shiftId={shift?.id} />
      <ConflictsModal open={conflictsOpen} onClose={() => setConflictsOpen(false)} />
    </div>
  );
}

function ApprovalModal({ onClose, onApprove, message }: { onClose: () => void; onApprove: (a: { email: string; password: string }) => void; message: string }) {
  const { t } = useTranslation();
  const [a, setA] = useState({ email: "", password: "" });
  return (
    <Modal open onClose={onClose} title={t("pos.managerApproval")}>
      <form onSubmit={(e) => { e.preventDefault(); onApprove(a); }} className="space-y-3">
        <p className="text-sm text-muted-foreground">{message}</p>
        <Field label={t("auth.email")}>{(id) => <Input id={id} type="email" required value={a.email} onChange={(e) => setA({ ...a, email: e.target.value })} />}</Field>
        <Field label={t("auth.password")}>{(id) => <Input id={id} type="password" required value={a.password} onChange={(e) => setA({ ...a, password: e.target.value })} />}</Field>
        <Button type="submit">{t("common.confirm")}</Button>
      </form>
    </Modal>
  );
}

function ReceiptModal({ data, onClose }: { data: { sale?: Sale; change: string; queued?: boolean } | null; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <Modal open={!!data} onClose={onClose} title={t("pos.saleDone")}>
      {data && (
        <div className="space-y-3 text-center">
          {data.queued ? <p className="text-sm">{t("pos.savedOfflineLong")}</p> : <>
            <p className="text-3xl font-bold">{fmtMoney(data.sale?.total)}</p>
            {Number(data.change) > 0 && <p className="text-xl">{t("pos.change")}: <strong>{fmtMoney(data.change)}</strong></p>}
            <p className="text-sm text-muted-foreground">{t("pos.receiptNo")}: {data.sale?.receiptNo}</p>
            <Button variant="outline" onClick={() => data.sale && void printHtml(`/pos/sales/${data.sale.id}/receipt.html`, { lang: document.documentElement.lang })}>{t("pos.printReceipt")}</Button></>}
          <Button size="lg" className="w-full" onClick={onClose}>{t("pos.newSale")}</Button>
        </div>
      )}
    </Modal>
  );
}

function ShiftModal({ mode, shift, onClose, branchId }: { mode: "open" | "close" | null; shift: Shift | null; onClose: () => void; branchId: string | null }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [v, setV] = useState("");
  const [z, setZ] = useState<Record<string, unknown> | null>(null);
  const m = useMutation({
    mutationFn: () => (mode === "open" ? api("/pos/shifts/open", { body: { branchId, openingFloat: v } }) : api<{ zReport: Record<string, unknown>; varianceAlert: boolean }>(`/pos/shifts/${shift!.id}/close`, { body: { countedCash: v } })),
    onSuccess: (r) => { if (mode === "close") setZ((r as { zReport: Record<string, unknown> }).zReport); else onClose(); setV(""); void qc.invalidateQueries({ queryKey: ["shift"] }); void qc.invalidateQueries({ queryKey: ["dashboard"] }); },
  });
  return (
    <Modal open={!!mode} onClose={() => { setZ(null); onClose(); }} title={mode === "open" ? t("pos.openShift") : t("pos.closeShift")}>
      {z ? (
        <div className="space-y-2 text-sm" data-testid="z-report">
          <h3 className="font-semibold">{t("pos.zReport")}</h3>
          <dl className="grid grid-cols-2 gap-1">{(["salesCount", "grossSales", "vatTotal", "cashSales", "expectedCash", "countedCash", "variance"] as const).map((k) => <div key={k} className="contents"><dt className="text-muted-foreground">{t(`z.${k}`)}</dt><dd className="font-medium">{String(z[k] ?? "—")}</dd></div>)}</dl>
          <p className="text-xs text-muted-foreground">{t("pos.vatNote")}</p>
          <Button onClick={() => { setZ(null); onClose(); }}>{t("common.close")}</Button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="space-y-3">
          <Field label={mode === "open" ? t("pos.openingFloat") : t("pos.countedCash")}>{(id) => <Input id={id} inputMode="decimal" required pattern="[0-9]+(\.[0-9]{1,2})?" value={v} onChange={(e) => setV(e.target.value)} />}</Field>
          <ErrorNote error={m.error} /><Button type="submit" disabled={m.isPending}>{t("common.confirm")}</Button>
        </form>
      )}
    </Modal>
  );
}

function HistoryModal({ open, onClose, shiftId }: { open: boolean; onClose: () => void; shiftId?: string }) {
  const { t } = useTranslation();
  const { can } = useAuth();
  const qc = useQueryClient(); const toast = useToast();
  const [appr, setAppr] = useState<{ sale: Sale; kind: "void" | "return" } | null>(null);
  const res = useQuery({ queryKey: ["sales-shift", shiftId], queryFn: () => api<{ items: Sale[] }>("/pos/sales", { query: { shiftId, pageSize: 30 } }), enabled: open && !!shiftId });
  const act = useMutation({
    mutationFn: async (a: { sale: Sale; kind: "void" | "return"; approval?: { email: string; password: string } }) => {
      const full = await api<Sale>(`/pos/sales/${a.sale.id}`);
      if (a.kind === "void") return api(`/pos/sales/${a.sale.id}/void`, { body: { reason: "cashier void", approval: a.approval } });
      return api(`/pos/sales/${a.sale.id}/returns`, { body: { lines: full.lines.map((l) => ({ saleLineId: l.id, quantity: l.quantity })), reason: "customer return", refundMethod: "CASH", approval: a.approval } });
    },
    onSuccess: () => { toast(t("common.saved")); setAppr(null); void qc.invalidateQueries({ queryKey: ["sales-shift"] }); },
  });
  return (
    <Modal open={open} onClose={onClose} title={t("pos.sales")} wide>
      <ErrorNote error={act.error} />
      <Table head={[t("pos.receiptNo"), t("common.date"), t("pos.total"), t("common.status"), ""]} empty={!res.data?.items.length ? <Empty>{t("common.none")}</Empty> : null}>
        {res.data?.items.map((s) => <tr key={s.id}><Td className="font-mono text-xs">{s.receiptNo}</Td><Td>{new Date(s.soldAt).toLocaleTimeString()}</Td><Td>{fmtMoney(s.total)}</Td><Td><Badge tone={s.status === "COMPLETED" ? "good" : "warn"}>{t(`saleStatus.${s.status}`)}</Badge></Td>
          <Td><div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => void printHtml(`/pos/sales/${s.id}/receipt.html`, { lang: document.documentElement.lang })}>{t("pos.printReceipt")}</Button>
            {s.status === "COMPLETED" && can("pos.sell") && <><Button size="sm" variant="outline" onClick={() => setAppr({ sale: s, kind: "return" })}>{t("pos.return")}</Button><Button size="sm" variant="danger" onClick={() => setAppr({ sale: s, kind: "void" })}>{t("pos.void")}</Button></>}</div></Td></tr>)}
      </Table>
      {appr && <ApprovalModal onClose={() => setAppr(null)} message={t("pos.refundApproval")} onApprove={(a) => act.mutate({ ...appr, approval: a })} />}
    </Modal>
  );
}

interface Conflict { id: string; idempotencyKey: string; reason: string; createdAt: string }
function ConflictsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const qc = useQueryClient(); const toast = useToast();
  const res = useQuery({ queryKey: ["conflicts"], queryFn: () => api<Conflict[]>("/pos/sync/conflicts"), enabled: open });
  const [force, setForce] = useState<Conflict | null>(null);
  const resolve = useMutation({ mutationFn: (v: { id: string; action: "FORCE" | "DISCARD"; approval?: { email: string; password: string } }) => api(`/pos/sync/conflicts/${v.id}/resolve`, { body: { action: v.action, approval: v.approval } }), onSuccess: () => { toast(t("common.saved")); setForce(null); void qc.invalidateQueries({ queryKey: ["conflicts"] }); void qc.invalidateQueries({ queryKey: ["dashboard"] }); } });
  return (
    <Modal open={open} onClose={onClose} title={t("pos.conflicts")} wide>
      <p className="mb-3 text-sm text-muted-foreground">{t("pos.conflictsHelp")}</p>
      <ErrorNote error={resolve.error} />
      <Table head={[t("common.date"), t("common.reason"), ""]} empty={!res.data?.length ? <Empty>{t("common.none")}</Empty> : null}>
        {res.data?.map((c) => <tr key={c.id}><Td>{new Date(c.createdAt).toLocaleString()}</Td><Td className="text-xs">{c.reason}</Td><Td><div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => resolve.mutate({ id: c.id, action: "DISCARD" })}>{t("pos.discard")}</Button><Button size="sm" onClick={() => setForce(c)}>{t("pos.forceApply")}</Button></div></Td></tr>)}
      </Table>
      {force && <ApprovalModal onClose={() => setForce(null)} message={t("pos.negativeStock")} onApprove={(a) => resolve.mutate({ id: force.id, action: "FORCE", approval: a })} />}
    </Modal>
  );
}
