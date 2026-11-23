import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check, ExternalLink, Package, Timer, X } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Meter, Modal, PageHeader, Segmented } from "@/components/ui";
import { Skeleton, StatCard, StatusChip, type KTone } from "@/brand/ui-kit";
import { drugName, fmtMoney, fmtNum } from "@/lib/format";
import { useToast } from "@/lib/toast";
import type { Order } from "@/lib/types";

const TONE: Record<string, KTone> = { RECEIVED: "warn", ACCEPTED: "info", PARTIALLY_ACCEPTED: "info", READY: "good", DISPENSED: "neutral", REJECTED: "bad", CANCELLED: "bad", EXPIRED: "bad" };
const FLOW = ["RECEIVED", "ACCEPTED", "READY", "DISPENSED"] as const;
const REASONS = ["outOfStock", "rxInvalid", "cannotDeliver", "other"] as const;
/** Machine code sent to Kiorex with the free-text reason, so the patient sees a localised explanation. */
const REASON_CODE: Record<string, string> = { outOfStock: "OUT_OF_STOCK", rxInvalid: "RX_INVALID", cannotDeliver: "CANNOT_DELIVER" };
type View = "open" | "progress" | "closed" | "all";
const shortId = (id: string) => (id.length > 14 ? `${id.slice(0, 6)}…${id.slice(-6)}` : id);
const isOpen = (o: Order) => o.status === "RECEIVED";
const isProgress = (o: Order) => ["ACCEPTED", "PARTIALLY_ACCEPTED", "READY"].includes(o.status);

function useLeft(order: Order) {
  const base = order.slaRemainingSeconds ?? 0;
  const [clock, setClock] = useState({ base, ticks: 0 });
  // Server value changed: restart the countdown from it (state adjusted during render, no effect needed).
  if (clock.base !== base) setClock({ base, ticks: 0 });
  useEffect(() => { const id = setInterval(() => setClock((c) => ({ ...c, ticks: c.ticks + 1 })), 1000); return () => clearInterval(id); }, []);
  return base - (clock.base === base ? clock.ticks : 0);
}

/** SLA countdown: a draining bar that turns amber under 2 minutes and red once breached. */
function Sla({ order }: { order: Order }) {
  const { t } = useTranslation();
  const left = useLeft(order);
  const total = useMemo(() => Math.max(order.slaRemainingSeconds ?? 0, 600), [order.slaRemainingSeconds]);
  if (order.status !== "RECEIVED") return null;
  const m = Math.floor(Math.abs(left) / 60), s = Math.abs(left) % 60;
  const tone = left < 0 ? "bad" : left < 120 ? "warn" : "brand";
  return (
    <div className="mt-3 rounded-lg bg-muted/60 p-3">
      <div className="mb-1.5 flex items-center justify-between text-xs"><span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground"><Timer aria-hidden className="size-3.5" />{left < 0 ? t("ord.breached") : t("ord.sla")}</span>
        <span role="timer" aria-label={t("ord.sla")} className={`kx-num text-base font-semibold ${left < 0 ? "text-[hsl(var(--danger-text))]" : left < 120 ? "text-[hsl(var(--warning))]" : ""}`}>{left < 0 ? "−" : ""}{m}:{String(s).padStart(2, "0")}</span></div>
      <Meter label={t("ord.sla")} value={Math.max(0, left)} max={total} tone={tone} />
    </div>
  );
}

/** State timeline: New > Accepted > Ready > Dispensed, with rejected / cancelled / expired as a red terminal. */
function Timeline({ status }: { status: string }) {
  const { t } = useTranslation();
  const dead = ["REJECTED", "CANCELLED", "EXPIRED"].includes(status);
  const idx = status === "PARTIALLY_ACCEPTED" ? 1 : FLOW.indexOf(status as (typeof FLOW)[number]);
  const steps = dead ? [t("ordStatus.RECEIVED"), t(`ordStatus.${status}`)] : FLOW.map((k) => (k === "ACCEPTED" && status === "PARTIALLY_ACCEPTED" ? t("ordStatus.PARTIALLY_ACCEPTED") : t(`ordStatus.${k}`)));
  const cur = dead ? 1 : idx;
  return (
    <ol className="mt-4 flex items-start" aria-label={t("ord.timeline")}>
      {steps.map((label, i) => {
        const done = i < cur || (!dead && i === cur && status === "DISPENSED");
        const active = i === cur && !done;
        const bad = dead && i === 1;
        return (
          <li key={i} aria-current={active ? "step" : undefined} className="relative flex flex-1 flex-col items-center gap-1.5 text-center">
            {i > 0 && <span aria-hidden className={`absolute inset-s-[-50%] top-3 h-0.5 w-full ${i <= cur ? (bad ? "bg-[hsl(var(--danger-text))]" : "bg-primary") : "bg-border"}`} />}
            <span className={`relative z-1 flex size-6 items-center justify-center rounded-full text-[11px] font-semibold ring-4 ring-card ${bad ? "bg-[hsl(var(--danger-text))] text-white" : done ? "bg-primary text-primary-foreground" : active ? "bg-accent text-accent-foreground outline-solid outline-2 outline-primary" : "bg-muted text-muted-foreground"}`}>
              {bad ? <X aria-hidden className="size-3.5" /> : done ? <Check aria-hidden className="size-3.5" /> : i + 1}
            </span>
            <span className={`text-[11px] leading-tight ${active || bad ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function OrderCard({ o, onAccept, onReject, onReady, busy }: { o: Order; onAccept: (o: Order) => void; onReject: (o: Order) => void; onReady: (o: Order) => void; busy: boolean }) {
  const { t } = useTranslation();
  const { can } = useAuth();
  const units = o.lines.reduce((a, l) => a + l.qtyRequested, 0);
  return (
    <article aria-label={`#${o.externalOrderId}`} className="flex flex-col rounded-xl border border-border/80 bg-card p-5 shadow-kx-1 transition-shadow duration-150 hover:shadow-kx-2">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div><h2 className="text-base font-semibold tracking-tight" title={o.externalOrderId}><bdi>#{shortId(o.externalOrderId)}</bdi></h2><p className="mt-0.5 text-sm text-muted-foreground">{o.customerName ?? t("ord.guest")} · <span className="kx-num">{fmtNum(units)} {t("ord.units")}</span></p></div>
        <div className="flex flex-col items-end gap-1.5"><div className="flex gap-1.5">{o.deliveryMethod && <span data-testid="order-method"><Badge tone="neutral">{t(`ord.method.${o.deliveryMethod}`)}</Badge></span>}{o.hasRx && <Badge tone="info">Rx</Badge>}<StatusChip tone={TONE[o.status] ?? "neutral"}>{t(`ordStatus.${o.status}`)}</StatusChip></div><div className="kx-num text-lg font-semibold">{fmtMoney(o.orderValue)}</div></div>
      </header>
      {o.deliveryMethod === "DELIVERY" && (o.deliveryAddress || o.customerPhone) && <p className="mt-3 rounded-lg bg-muted/60 p-3 text-sm" data-testid="order-delivery"><span className="font-medium">{t("ord.deliverTo")}: </span><bdi>{o.deliveryAddress}</bdi>{o.customerPhone && <span className="ms-2 text-muted-foreground">{t("ord.phone")}: <bdi dir="ltr" className="kx-num">{o.customerPhone}</bdi></span>}</p>}
      <Timeline status={o.status} />
      <Sla order={o} />
      <ul className="mt-4 divide-y divide-border/70 rounded-lg border border-border/70 text-sm">
        {o.lines.map((l) => {
          const partial = o.status !== "RECEIVED" && l.qtyAccepted !== l.qtyRequested;
          return (
            <li key={l.id} className="flex items-center justify-between gap-3 px-3 py-2">
              <span className="min-w-0 truncate"><Package aria-hidden className="me-2 inline size-3.5 text-muted-foreground" />{drugName(l.drug)}{l.drug?.rxOnly && <span className="ms-1.5 text-xs text-muted-foreground">Rx</span>}</span>
              <span className="flex shrink-0 items-center gap-2"><span className="kx-num font-medium">{partial ? `${l.qtyAccepted}/${l.qtyRequested}` : `×${l.qtyRequested}`}</span>{partial && <Badge tone="warn">{t("ord.partial", { count: l.qtyAccepted })}</Badge>}</span>
            </li>
          );
        })}
      </ul>
      {o.hasRx && o.status === "RECEIVED" && <p className="mt-3 flex flex-wrap items-center gap-x-2 rounded-lg border border-primary/20 bg-accent p-3 text-sm text-accent-foreground">{t("ord.rxFirst")} {o.prescriptionId && <Link className="inline-flex items-center gap-1 font-medium underline" to={`/rx/${o.prescriptionId}`}>{t("ord.openRx")}<ExternalLink aria-hidden className="size-3.5" /></Link>}</p>}
      {can("orders.respond") && (o.status === "RECEIVED" || isProgress(o)) && (
        <footer className="mt-4 flex flex-wrap gap-2 border-t border-border/70 pt-4">
          {o.status === "RECEIVED" && <><Button onClick={() => onAccept(o)} disabled={busy}><Check aria-hidden className="size-4" />{t("ord.accept")}</Button><Button variant="outline" onClick={() => onReject(o)} className="text-[hsl(var(--danger-text))]">{t("ord.reject")}</Button></>}
          {isProgress(o) && <>{o.dispensingId && <Link className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-input bg-card px-4 text-sm font-medium shadow-kx-1 hover:bg-accent" to={`/dispensing/${o.dispensingId}`}>{t("ord.openDispensing")}<ArrowRight aria-hidden className="size-4 rtl:rotate-180" /></Link>}{o.status !== "READY" && <Button onClick={() => onReady(o)} disabled={busy}>{o.deliveryMethod === "DELIVERY" ? t("ord.readyDelivery") : t("ord.ready")}</Button>}<Button variant="ghost" onClick={() => onReject(o)} className="text-[hsl(var(--danger-text))]">{t("ord.reject")}</Button></>}
        </footer>
      )}
    </article>
  );
}

/** Accept dialog: full or partial, quantities per line (the API caps to what is in stock). */
function AcceptModal({ order, onClose, onSubmit, busy, error }: { order: Order | null; onClose: () => void; onSubmit: (lines: Array<{ lineId: string; qtyAccepted: number }>) => void; busy: boolean; error: unknown }) {
  const { t } = useTranslation();
  const initialQty = (o: Order | null): Record<string, number> => Object.fromEntries((o?.lines ?? []).map((l) => [l.id, l.qtyRequested]));
  const [qty, setQty] = useState(() => initialQty(order));
  const [qtyFor, setQtyFor] = useState(order);
  // A different order was opened: reset the per-line quantities (state adjusted during render, no effect needed).
  if (qtyFor !== order) { setQtyFor(order); setQty(initialQty(order)); }
  const total = order?.lines.reduce((a, l) => a + l.qtyRequested, 0) ?? 0;
  const acc = order?.lines.reduce((a, l) => a + (qty[l.id] ?? 0), 0) ?? 0;
  return (
    <Modal open={!!order} onClose={onClose} title={t("ord.acceptTitle", { id: shortId(order?.externalOrderId ?? "") })}>
      {order && (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(order.lines.map((l) => ({ lineId: l.id, qtyAccepted: qty[l.id] ?? 0 }))); }}>
          <p className="text-sm text-muted-foreground">{t("ord.acceptHint")}</p>
          <ul className="space-y-2">
            {order.lines.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/70 p-3">
                <div className="min-w-0"><div className="truncate text-sm font-medium">{drugName(l.drug)}</div><div className="text-xs text-muted-foreground">{t("ord.requested", { count: l.qtyRequested })}</div></div>
                <div className="flex items-center gap-1" role="group" aria-label={drugName(l.drug)}>
                  <Button type="button" variant="outline" size="sm" className="size-9 px-0" aria-label={t("ord.less")} onClick={() => setQty((q) => ({ ...q, [l.id]: Math.max(0, (q[l.id] ?? 0) - 1) }))}>−</Button>
                  <Input aria-label={t("ord.qtyAccepted")} type="number" min={0} max={l.qtyRequested} value={qty[l.id] ?? 0} onChange={(e) => setQty((q) => ({ ...q, [l.id]: Math.max(0, Math.min(l.qtyRequested, Number(e.target.value) || 0)) }))} className="w-16 text-center" />
                  <Button type="button" variant="outline" size="sm" className="size-9 px-0" aria-label={t("ord.more")} onClick={() => setQty((q) => ({ ...q, [l.id]: Math.min(l.qtyRequested, (q[l.id] ?? 0) + 1) }))}>+</Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-sm"><span>{t("ord.acceptSummary", { accepted: acc, total })}</span>{acc < total && acc > 0 ? <StatusChip tone="warn">{t("ord.partialOrder")}</StatusChip> : acc === total ? <StatusChip tone="good">{t("ord.fullOrder")}</StatusChip> : null}</div>
          <ErrorNote error={error} />
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={onClose}>{t("common.cancel")}</Button><Button type="submit" disabled={busy || acc === 0}>{acc < total ? t("ord.acceptPartial") : t("ord.accept")}</Button></div>
        </form>
      )}
    </Modal>
  );
}

/** KPMKT02-04: Kiorex order inbox with SLA timer. Hidden (nav + API 403) when pharmacy.kiorex_orders is OFF. */
export function Orders() {
  const { t } = useTranslation();
  const qc = useQueryClient(); const toast = useToast();
  const res = useQuery({ queryKey: ["orders"], queryFn: () => api<Order[]>("/kiorex-orders"), refetchInterval: 15_000 });
  const [rej, setRej] = useState<Order | null>(null); const [reason, setReason] = useState(""); const [reasonCode, setReasonCode] = useState("PHARMACY_REJECTED"); const [acc, setAcc] = useState<Order | null>(null);
  const [sp, setSp] = useSearchParams(); const [limit, setLimit] = useState(12);
  const qv = sp.get("view") as View | null; const view: View = qv && ["open", "progress", "closed", "all"].includes(qv) ? qv : "open";
  const setView = (v: View) => setSp({ view: v }, { replace: true });
  const refresh = () => void qc.invalidateQueries({ queryKey: ["orders"] });
  const accept = useMutation({ mutationFn: (v: { id: string; lines: Array<{ lineId: string; qtyAccepted: number }> }) => api(`/kiorex-orders/${v.id}/accept`, { body: { lines: v.lines } }), onSuccess: () => { toast(t("common.saved")); setAcc(null); refresh(); } });
  const ready = useMutation({ mutationFn: (id: string) => api(`/kiorex-orders/${id}/ready`, { body: {} }), onSuccess: () => { toast(t("common.saved")); refresh(); } });
  const reject = useMutation({ mutationFn: () => api(`/kiorex-orders/${rej!.id}/reject`, { body: { reason, reasonCode } }), onSuccess: () => { setRej(null); setReason(""); setReasonCode("PHARMACY_REJECTED"); refresh(); } });
  if (res.error instanceof ApiError && res.error.featureDisabled) return <Card><p>{t("errors.featureDisabled", { key: "pharmacy.kiorex_orders" })}</p></Card>;
  const all = res.data ?? [];
  const counts = { open: all.filter(isOpen).length, progress: all.filter(isProgress).length, closed: all.filter((o) => !isOpen(o) && !isProgress(o)).length };
  const shown = all.filter((o) => (view === "all" ? true : view === "open" ? isOpen(o) : view === "progress" ? isProgress(o) : !isOpen(o) && !isProgress(o)));
  const breached = all.filter((o) => o.status === "RECEIVED" && o.slaBreached).length;
  return (
    <>
      <PageHeader title={t("ord.title")} subtitle={t("ord.subtitle")} />
      <ErrorNote error={res.error || ready.error} />
      <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-4">
        <StatCard label={t("ord.viewOpen")} value={fmtNum(counts.open)} tone={counts.open ? "warn" : "neutral"} hint={<span className="max-sm:hidden">{breached ? t("ord.breachedCount", { count: breached }) : t("ord.needsResponse")}</span>} />
        <StatCard label={t("ord.viewProgress")} value={fmtNum(counts.progress)} tone={counts.progress ? "info" : "neutral"} hint={<span className="max-sm:hidden">{t("ord.prepHint")}</span>} />
        <StatCard label={t("ord.viewClosed")} value={fmtNum(counts.closed)} hint={<span className="max-sm:hidden">{t("ord.closedHint")}</span>} />
      </div>
      <div className="mb-4"><Segmented<View> label={t("ord.view")} value={view} onChange={(v) => { setView(v); setLimit(12); }} options={[{ id: "open", label: t("ord.viewOpen"), count: counts.open }, { id: "progress", label: t("ord.viewProgress"), count: counts.progress }, { id: "closed", label: t("ord.viewClosed"), count: counts.closed }, { id: "all", label: t("common.all") }]} /></div>
      {res.isLoading ? <div className="grid gap-4 lg:grid-cols-2">{[0, 1].map((i) => <div key={i} role="status" aria-busy className="space-y-3 rounded-xl border border-border/80 bg-card p-5"><Skeleton className="h-5 w-1/3" /><Skeleton className="h-10" /><Skeleton className="h-16" /></div>)}</div>
        : !shown.length ? <Empty hint={view === "open" ? t("ord.emptyHint") : undefined}>{all.length ? t("ord.emptyView") : t("ord.empty")}</Empty> : (
        <div className="grid gap-4 lg:grid-cols-2">
          {shown.slice(0, limit).map((o) => <OrderCard key={o.id} o={o} busy={accept.isPending || ready.isPending} onAccept={(x) => { accept.reset(); setAcc(x); }} onReject={setRej} onReady={(x) => ready.mutate(x.id)} />)}
        </div>
      )}
      {shown.length > limit && <div className="mt-5 flex justify-center"><Button variant="outline" onClick={() => setLimit(limit + 12)}>{t("ord.showMore", { count: shown.length - limit })}</Button></div>}
      <AcceptModal order={acc} onClose={() => setAcc(null)} onSubmit={(lines) => accept.mutate({ id: acc!.id, lines })} busy={accept.isPending} error={accept.error} />
      <Modal open={!!rej} onClose={() => setRej(null)} title={t("ord.reject")}>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); reject.mutate(); }}>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("ord.quickReasons")}>{REASONS.filter((r) => r !== "other").map((r) => <button key={r} type="button" onClick={() => { setReason(t(`ord.reasons.${r}`)); setReasonCode(REASON_CODE[r] ?? "PHARMACY_REJECTED"); }} className="min-h-8 rounded-full border border-border bg-card px-3 text-sm hover:bg-accent">{t(`ord.reasons.${r}`)}</button>)}</div>
          <Field label={t("common.reason")} hint={t("ord.rejectHint")}>{(id) => <Input id={id} required minLength={3} value={reason} onChange={(e) => { setReason(e.target.value); setReasonCode("PHARMACY_REJECTED"); }} />}</Field>
          <ErrorNote error={reject.error} /><div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setRej(null)}>{t("common.cancel")}</Button><Button type="submit" variant="danger" disabled={reject.isPending}>{t("ord.reject")}</Button></div>
        </form>
      </Modal>
    </>
  );
}
