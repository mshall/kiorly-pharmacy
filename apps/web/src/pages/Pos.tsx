import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ScanLine, X } from "lucide-react";
import { api, ApiError, newKey } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Empty, ErrorNote, Field, Input, Modal, Select, Table, Td, cn, errorMessage } from "@/components/ui";
import { useOnline } from "@/components/Layout";
import { drugName, fmtDateTime, fmtMoney } from "@/lib/format";
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
  const itemCount = cart.reduce((a, l) => a + l.qty, 0);
  const queuedCount = queueQ.data?.length ?? 0;
  // keyboard-first till: "/" or F2 focuses scan, F9 (or Ctrl+Enter) opens payment, Esc clears the scan field
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (e.key === "F2" || (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT")) { e.preventDefault(); scanRef.current?.focus(); }
      if ((e.key === "F9" || (e.key === "Enter" && e.ctrlKey)) && cart.length && !pay && !(online && !shift)) { e.preventDefault(); startPay(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{t("pos.title")}</h1>
          {shift ? <Badge tone="good">{t("pos.shiftOpen")}</Badge> : <Badge tone="warn">{t("pos.shiftClosed")}</Badge>}
          <span data-testid="pos-link" className={cn("inline-flex min-h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium ring-1 ring-inset", online ? "bg-muted text-muted-foreground ring-border" : "bg-[hsl(var(--danger-text)/0.12)] text-[hsl(var(--danger-text))] ring-[hsl(var(--danger-text)/0.28)]")}>
            <span aria-hidden className={cn("size-1.5 rounded-full", online ? "bg-[hsl(var(--success))]" : "bg-[hsl(var(--danger-text))]")} />{online ? t("pos.liveCatalogue") : t("pos.offlineMode")}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {shift ? <><Button size="sm" variant="outline" onClick={() => setHistory(true)}>{t("pos.sales")}</Button><Button size="sm" variant="outline" onClick={() => setShiftModal("close")}>{t("pos.closeShift")}</Button></> : online && can("pos.shift") && <Button onClick={() => setShiftModal("open")}>{t("pos.openShift")}</Button>}
          {!!queuedCount && <Button size="sm" variant="outline" disabled={!online || sync.isPending} onClick={() => sync.mutate()}>{t("pos.sync", { count: queuedCount })}</Button>}
          {can("pos.refund_approve") && <Button size="sm" variant="ghost" onClick={() => setConflictsOpen(true)}>{t("pos.conflicts")}</Button>}
        </div>
      </div>
      <ErrorNote error={sync.error} />
      {needShift && <p role="alert" className="rounded-lg border border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.14)] p-3 text-sm">{t("pos.needShift")}</p>}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-3">
          <form onSubmit={(e) => { e.preventDefault(); void onScanSubmit(); }} className="relative">
            <label htmlFor="pos-scan" className="sr-only">{t("pos.scan")}</label>
            <ScanLine aria-hidden="true" className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input id="pos-scan" ref={scanRef} autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Escape") setQ(""); }} placeholder={t("pos.scan")} className="min-h-14 ps-12 pe-16 text-lg" />
            <kbd aria-hidden="true" className="pointer-events-none absolute end-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground sm:block">F2</kbd>
          </form>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4" aria-label={t("pos.results")}>
            {results.map((i) => {
              const inCart = cart.find((x) => x.item.id === i.id)?.qty ?? 0;
              const stockTone = i.available <= 0 ? "text-[hsl(var(--danger-text))]" : i.available <= 10 ? "text-[hsl(var(--warning))]" : "text-muted-foreground";
              return (
                <li key={i.id}><button type="button" onClick={() => add(i)} className="group relative flex min-h-28 w-full flex-col justify-between rounded-xl bg-card p-3 text-start shadow-[var(--kx-shadow-1)] ring-1 ring-border transition-[box-shadow,transform,background-color] duration-150 hover:-translate-y-px hover:shadow-[var(--kx-shadow-2)] active:translate-y-0 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none">
                  {inCart > 0 && <span className="absolute -top-2 end-2 grid min-w-6 place-items-center rounded-full bg-primary px-1.5 text-xs font-bold tabular-nums text-primary-foreground shadow-[var(--kx-shadow-1)]" aria-label={t("pos.inCart", { count: inCart })}>{inCart}</span>}
                  <div><div className="line-clamp-2 text-sm font-semibold leading-snug">{drugName(i)}</div><div className="mt-0.5 text-xs text-muted-foreground">{[i.strength, i.dosageForm].filter(Boolean).join(" · ")}</div></div>
                  <div className="mt-2 flex flex-wrap items-end justify-between gap-x-2 gap-y-0.5"><span className="whitespace-nowrap text-base font-bold tabular-nums">{fmtMoney(i.price)}</span><span className={cn("whitespace-nowrap text-xs tabular-nums", stockTone)}>{i.available <= 0 ? t("pos.outOfStock") : `${t("inv.available")}: ${i.available}`}</span></div>
                </button></li>
              );
            })}
            {!results.length && <li className="col-span-full"><Empty>{items.length ? t("common.noResults") : t("pos.noCatalogue")}</Empty></li>}
          </ul>
          <p className="text-xs text-muted-foreground">{t("pos.rxNote")} <Link className="underline" to="/rx">{t("nav.rx")}</Link></p>
        </div>
        <section aria-label={t("pos.cart")} className="flex max-h-[calc(100vh-7rem)] flex-col rounded-2xl border border-border/80 bg-card shadow-[var(--kx-shadow-2)] lg:sticky lg:top-20">
          <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3"><h2 className="text-base font-semibold">{t("pos.cart")}</h2>{itemCount > 0 && <><span className="text-xs tabular-nums text-muted-foreground">{t("pos.items", { count: itemCount })}</span><Button size="sm" variant="ghost" onClick={() => setCart([])}>{t("pos.clear")}</Button></>}</header>
          <div className="min-h-32 flex-1 overflow-y-auto px-4">
            {!cart.length ? <Empty>{t("pos.emptyCart")}</Empty> : (
              <ul className="divide-y divide-border">
                {cart.map((l) => (
                  <li key={l.item.id} className="py-3">
                    <div className="flex items-start justify-between gap-2"><div className="min-w-0"><div className="truncate text-sm font-medium">{drugName(l.item)}</div><div className="text-xs tabular-nums text-muted-foreground">{fmtMoney(l.item.price)} × {l.qty}</div></div><div className="whitespace-nowrap text-sm font-semibold tabular-nums">{fmtMoney(Number(l.item.price) * l.qty)}</div></div>
                    <div className="mt-2 flex items-center gap-1">
                      <Button variant="outline" className="size-11 px-0 text-lg" aria-label={t("pos.decrease")} onClick={() => setCart(cart.map((x) => (x === l ? { ...x, qty: Math.max(1, x.qty - 1) } : x)))}>−</Button>
                      <span className="w-10 text-center text-base font-semibold tabular-nums" aria-live="polite">{l.qty}</span>
                      <Button variant="outline" className="size-11 px-0 text-lg" aria-label={t("pos.increase")} onClick={() => setCart(cart.map((x) => (x === l ? { ...x, qty: x.qty + 1 } : x)))}>+</Button>
                      <Button variant="ghost" className="ms-auto size-11 px-0" aria-label={t("common.remove")} onClick={() => setCart(cart.filter((x) => x !== l))}><X aria-hidden="true" className="size-4" /></Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <footer className="border-t border-border px-4 py-3"><div className="flex items-baseline justify-between text-2xl font-bold"><span className="text-base font-semibold">{t("pos.total")}</span><span data-testid="cart-total" className="tabular-nums">{fmtMoney(total)}</span></div>
            <Button size="lg" className="mt-3 w-full" disabled={!cart.length || (online && !shift)} onClick={startPay}>{t("pos.pay")}<kbd aria-hidden="true" className="ms-1 hidden rounded border border-primary-foreground/40 px-1.5 text-xs font-normal opacity-80 sm:inline">F9</kbd></Button></footer>
        </section>
      </div>

      <Modal open={pay} onClose={() => setPay(false)} title={t("pos.payment")} wide>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted p-4"><div className="text-xs font-medium text-muted-foreground">{t("pos.total")}</div><div className="mt-1 text-3xl font-bold tabular-nums">{fmtMoney(total)}</div></div>
            <div className={cn("rounded-xl p-4", due > 0 ? "bg-[hsl(var(--warning)/0.14)]" : "bg-[hsl(var(--success)/0.14)]")} aria-live="polite"><div className="text-xs font-medium text-muted-foreground">{due > 0 ? t("pos.due") : t("pos.change")}</div><div className="mt-1 text-3xl font-bold tabular-nums">{fmtMoney(due > 0 ? due : paid - total)}</div></div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label={t("pos.method")}>{METHODS.map((m) => <Button key={m} size="lg" className="min-h-14" variant={method === m ? "primary" : "outline"} aria-pressed={method === m} disabled={!online && !["CASH", "CUSTOMER_CREDIT"].includes(m)} onClick={() => setMethod(m)}>{t(`method.${m}`)}</Button>)}</div>
          {method === "CUSTOMER_CREDIT" && <Field label={t("pos.customer")}>{(id) => <Select id={id} value={customerId} onChange={(e) => setCustomerId(e.target.value)}><option value="">—</option>{customers.data?.map((c) => <option key={c.id} value={c.id}>{c.displayName} ({t("pos.creditAvailable")}: {fmtMoney(c.available)})</option>)}</Select>}</Field>}
          <div className="flex flex-wrap items-end gap-2">
            <Field label={t("pos.amount")}>{(id) => <Input id={id} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPay(); } }} placeholder={due.toFixed(2)} className="min-h-14 w-44 text-xl tabular-nums" />}</Field>
            <Button size="lg" onClick={addPay}>{t("pos.addPayment")}</Button>
            {method === "CASH" && <><Button size="lg" variant="secondary" onClick={() => setAmount(due.toFixed(2))}>{t("pos.exact")}</Button>{[50, 100, 200].map((n) => <Button key={n} size="lg" variant="outline" className="tabular-nums" onClick={() => setAmount(String(n))}>{n}</Button>)}</>}
          </div>
          {pays.length > 0 && <ul className="space-y-1">{pays.map((p, i) => <li key={i} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm"><span>{t(`method.${p.method}`)}</span><span className="flex items-center gap-2 font-semibold tabular-nums">{fmtMoney(p.amount)}<Button size="sm" variant="ghost" aria-label={t("common.remove")} onClick={() => setPays(pays.filter((_, k) => k !== i))}><X aria-hidden="true" className="size-4" /></Button></span></li>)}</ul>}
          {checkout.error && !approval && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-danger">{errorMessage(checkout.error, t as never)}</p>}
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
  const sale = data?.sale;
  return (
    <Modal open={!!data} onClose={onClose} title={t("pos.saleDone")}>
      {data && (
        <div className="space-y-4">
          {data.queued ? <p className="rounded-lg bg-[hsl(var(--warning)/0.14)] p-3 text-sm">{t("pos.savedOfflineLong")}</p> : sale && <>
            <div className="text-center"><div className="text-3xl font-bold tabular-nums">{fmtMoney(sale.total)}</div>{Number(data.change) > 0 && <div className="mt-1 text-lg">{t("pos.change")}: <strong className="tabular-nums">{fmtMoney(data.change)}</strong></div>}</div>
            <div aria-label={t("pos.receiptPreview")} role="group" className="mx-auto max-w-xs rounded-md border border-dashed border-border bg-background p-4 font-mono text-xs shadow-[var(--kx-shadow-1)]">
              <div className="text-center font-semibold">{t("app.product")}</div>
              <div className="text-center text-muted-foreground">{t("pos.receiptNo")}: {sale.receiptNo} · {fmtDateTime(sale.soldAt)}</div>
              <ul className="my-3 space-y-1 border-y border-dashed border-border py-2">
                {sale.lines.map((l) => <li key={l.id} className="flex justify-between gap-2"><span className="min-w-0 truncate">{l.quantity} × {drugName(l.drug)}</span><span className="tabular-nums">{fmtMoney(Number(l.unitPrice) * l.quantity - Number(l.discount))}</span></li>)}
              </ul>
              <dl className="space-y-0.5 tabular-nums">
                <div className="flex justify-between"><dt>{t("pos.subtotal")}</dt><dd>{fmtMoney(sale.subtotal)}</dd></div>
                <div className="flex justify-between"><dt>{t("pos.vat")}</dt><dd>{fmtMoney(sale.vatTotal)}</dd></div>
                <div className="flex justify-between border-t border-dashed border-border pt-1 text-sm font-bold"><dt>{t("pos.total")}</dt><dd>{fmtMoney(sale.total)}</dd></div>
              </dl>
            </div>
            <div className="text-center"><Button variant="outline" onClick={() => void printHtml(`/pos/sales/${sale.id}/receipt.html`, { lang: document.documentElement.lang })}>{t("pos.printReceipt")}</Button></div></>}
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
