import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api, newKey } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useAction, useForm } from "@/lib/hooks";
import { Badge, Button, Empty, ErrorNote, Field, Input, Modal, Select, Table, Td } from "@/components/ui";
import { drugName, fmtDateTime, fmtMoney } from "@/lib/format";
import { searchOffline, type OfflineItem } from "@/lib/offline";
import type { Sale } from "@/lib/types";

export interface HeldCartRow { id: string; label: string; createdAt: string; payload: { lines: Array<{ drugId: string; quantity: number; brandName?: string }>; customer?: { id: string; displayName: string } | null } }

export function HeldModal({ open, onClose, onResume }: { open: boolean; onClose: () => void; onResume: (h: HeldCartRow) => void }) {
  const { t } = useTranslation(); const { branchId } = useAuth();
  const q = useQuery({ queryKey: ["held", branchId], queryFn: () => api<HeldCartRow[]>("/pos/held", { query: { branchId } }), enabled: open && !!branchId });
  const resume = useAction((id: string) => api<HeldCartRow>(`/pos/held/${id}/resume`, { method: "POST" }), ["held"], { silent: true, onDone: (h) => { onResume(h); onClose(); } });
  const del = useAction((id: string) => api(`/pos/held/${id}`, { method: "DELETE" }), ["held"]);
  return (
    <Modal open={open} onClose={onClose} title={t("pos.held")}>
      <Table dense head={[t("pos.heldLabel"), t("common.date"), t("inv.qty"), ""]} empty={!q.data?.length ? <Empty>{t("pos.heldEmpty")}</Empty> : null}>
        {q.data?.map((h) => <tr key={h.id}><Td className="font-medium">{h.label}</Td><Td>{fmtDateTime(h.createdAt)}</Td><Td className="kx-num">{h.payload.lines.reduce((a, l) => a + l.quantity, 0)}</Td>
          <Td className="text-end"><Button size="sm" onClick={() => resume.mutate(h.id)}>{t("pos.resume")}</Button> <Button size="sm" variant="ghost" aria-label={t("common.remove")} onClick={() => del.mutate(h.id)}>✕</Button></Td></tr>)}</Table>
      <ErrorNote error={resume.error || del.error} />
    </Modal>
  );
}

interface Movement { id: string; kind: string; category: string; amount: string; reason: string; createdAt: string }
const IN_CATS = ["FLOAT_TOP_UP", "OWNER_DEPOSIT", "OTHER_IN"], OUT_CATS = ["PETTY_CASH", "BANK_DEPOSIT", "SUPPLIER_PAYMENT", "EXPENSE", "OWNER_WITHDRAWAL", "OTHER_OUT"];
export function CashModal({ open, onClose, shiftId }: { open: boolean; onClose: () => void; shiftId?: string }) {
  const { t } = useTranslation(); const { branchId } = useAuth();
  const list = useQuery({ queryKey: ["cash-moves", shiftId], queryFn: () => api<Movement[]>("/pos/cash-movements", { query: { shiftId } }), enabled: open && !!shiftId });
  const [f, set, bind, reset] = useForm({ kind: "OUT", category: "PETTY_CASH", amount: "", reason: "" });
  const save = useAction(() => api("/pos/cash-movements", { body: { branchId, ...f } }), ["cash-moves", "x-report"], { onDone: () => reset() });
  const cats = f.kind === "IN" ? IN_CATS : OUT_CATS;
  return (
    <Modal open={open} onClose={onClose} title={t("pos.cashDrawer")} wide>
      <form className="mb-4 grid gap-3 sm:grid-cols-5" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
        <Field label={t("common.type")}>{(id) => <Select id={id} value={f.kind} onChange={(e) => set({ kind: e.target.value, category: e.target.value === "IN" ? "FLOAT_TOP_UP" : "PETTY_CASH" })}><option value="OUT">{t("pos.cashOut")}</option><option value="IN">{t("pos.cashIn")}</option></Select>}</Field>
        <Field label={t("pos.cashCategory")}>{(id) => <Select id={id} {...bind("category")}>{cats.map((c) => <option key={c} value={c}>{t(`pos.cashCat.${c}`)}</option>)}</Select>}</Field>
        <Field label={t("pos.cashAmount")}>{(id) => <Input id={id} inputMode="decimal" required pattern="[0-9]+(\.[0-9]{1,2})?" {...bind("amount")} />}</Field>
        <Field label={t("pos.cashReason")} className="sm:col-span-2">{(id) => <Input id={id} required minLength={3} {...bind("reason")} />}</Field>
        <div className="sm:col-span-5"><ErrorNote error={save.error} /><Button type="submit" disabled={save.isPending || !shiftId}>{t("common.save")}</Button></div>
      </form>
      <h3 className="mb-2 text-sm font-semibold">{t("pos.cashMovements")}</h3>
      <Table dense numeric={[2]} head={[t("common.date"), t("pos.cashCategory"), t("pos.cashAmount"), t("pos.cashReason")]} empty={!list.data?.length ? <Empty>{t("common.none")}</Empty> : null}>
        {list.data?.map((m) => <tr key={m.id}><Td>{fmtDateTime(m.createdAt)}</Td><Td><Badge tone={m.kind === "IN" ? "good" : "warn"}>{t(`pos.cashCat.${m.category}`)}</Badge></Td><Td className={`kx-num text-end font-medium ${m.kind === "OUT" ? "text-[hsl(var(--danger-text))]" : ""}`}>{m.kind === "OUT" ? "−" : "+"}{fmtMoney(m.amount)}</Td><Td>{m.reason}</Td></tr>)}</Table>
    </Modal>
  );
}

export function XReportModal({ open, onClose, shiftId }: { open: boolean; onClose: () => void; shiftId?: string }) {
  const { t } = useTranslation();
  const q = useQuery({ queryKey: ["x-report", shiftId], queryFn: () => api<Record<string, unknown>>(`/pos/shifts/${shiftId}/x-report`), enabled: open && !!shiftId });
  const keys = ["salesCount", "grossSales", "vatTotal", "cashSales", "cashIn", "cashOut", "expectedCash"] as const;
  return (
    <Modal open={open} onClose={onClose} title={t("pos.xReport")}>
      <p className="mb-3 text-sm text-muted-foreground">{t("pos.xReportNote")}</p>
      <dl className="grid grid-cols-2 gap-1 text-sm" data-testid="x-report">{keys.map((k) => <div key={k} className="contents"><dt className="text-muted-foreground">{t(`z.${k}`)}</dt><dd className="font-medium kx-num">{k === "salesCount" ? String(q.data?.[k] ?? "—") : fmtMoney(String(q.data?.[k] ?? 0))}</dd></div>)}</dl>
      {!!q.data?.byMethod && <dl className="mt-3 grid grid-cols-2 gap-1 border-t border-border pt-3 text-sm">{Object.entries(q.data.byMethod as Record<string, string>).map(([m, v]) => <div key={m} className="contents"><dt className="text-muted-foreground">{t(`method.${m}`)}</dt><dd className="kx-num font-medium">{fmtMoney(v)}</dd></div>)}</dl>}
    </Modal>
  );
}

/** Exchange: pick quantities to take back, ring up replacement items from the local catalogue, settle the difference. Manager approval retries on demand. */
export function ExchangeModal({ sale, items, onClose, onDone }: { sale: Sale | null; items: OfflineItem[]; onClose: () => void; onDone: () => void }) {
  const { t } = useTranslation(); const { can } = useAuth();
  const full = useQuery({ queryKey: ["sale-full", sale?.id], queryFn: () => api<Sale>(`/pos/sales/${sale!.id}`), enabled: !!sale });
  const [ret, setRet] = useState<Record<string, number>>({}); const [news, setNews] = useState<Array<{ item: OfflineItem; qty: number }>>([]); const [q, setQ] = useState("");
  const [f, , bind] = useForm({ reason: "", refundMethod: "CASH", payMethod: "CASH" });
  const [appr, setAppr] = useState({ email: "", password: "" }); const [key] = useState(newKey());
  const refund = (full.data?.lines ?? []).reduce((a, l) => a + ((Number(l.unitPrice) * l.quantity - Number(l.discount)) / l.quantity) * (ret[l.id] ?? 0), 0);
  const newTotal = news.reduce((a, l) => a + Number(l.item.price) * l.qty, 0);
  const results = searchOffline(items, q).slice(0, 6);
  const needApproval = !can("pos.refund_approve");
  const run = useAction(() => api<{ refund: string }>(`/pos/sales/${sale!.id}/exchange`, { body: { returnLines: Object.entries(ret).filter(([, n]) => n > 0).map(([saleLineId, quantity]) => ({ saleLineId, quantity })), reason: f.reason, refundMethod: f.refundMethod, newLines: news.map((n) => ({ drugId: n.item.id, quantity: n.qty })), payments: [{ method: f.payMethod, amount: newTotal.toFixed(2) }], idempotencyKey: key, approval: needApproval && appr.email ? appr : undefined } }), ["sales-shift", "shift", "dashboard"], { silent: false, onDone: () => { onDone(); onClose(); } });
  return (
    <Modal open={!!sale} onClose={onClose} title={t("pos.exchangeTitle")} wide>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); run.mutate(); }}>
        <section><h3 className="mb-2 text-sm font-semibold">{t("pos.exchangeReturn")}</h3>
          <Table dense numeric={[1, 2]} head={[t("common.product"), t("pos.sold"), t("inv.qty")]}>{full.data?.lines.map((l) => <tr key={l.id}><Td>{drugName(l.drug)}</Td><Td className="kx-num text-end">{l.quantity}</Td><Td className="text-end"><Input aria-label={t("inv.qty")} type="number" min={0} max={l.quantity} className="w-20" value={ret[l.id] ?? 0} onChange={(e) => setRet({ ...ret, [l.id]: Math.min(Number(e.target.value), l.quantity) })} /></Td></tr>)}</Table></section>
        <section><h3 className="mb-2 text-sm font-semibold">{t("pos.exchangeNew")}</h3>
          <Input aria-label={t("pos.scan")} placeholder={t("pos.scan")} value={q} onChange={(e) => setQ(e.target.value)} />
          {q && <ul className="mt-1 rounded-lg border border-border">{results.map((i) => <li key={i.id}><button type="button" className="min-h-10 w-full px-3 text-start text-sm hover:bg-accent" onClick={() => { setNews((n) => n.some((x) => x.item.id === i.id) ? n.map((x) => x.item.id === i.id ? { ...x, qty: x.qty + 1 } : x) : [...n, { item: i, qty: 1 }]); setQ(""); }}>{drugName(i)} · {fmtMoney(i.price)}</button></li>)}</ul>}
          <Table dense numeric={[1, 2]} head={[t("common.product"), t("inv.qty"), t("pos.total")]} empty={!news.length ? <Empty>{t("pos.emptyCart")}</Empty> : null}>{news.map((n) => <tr key={n.item.id}><Td>{drugName(n.item)}</Td><Td className="text-end"><Input aria-label={t("inv.qty")} type="number" min={1} className="w-20" value={n.qty} onChange={(e) => setNews(news.map((x) => x === n ? { ...x, qty: Math.max(1, Number(e.target.value)) } : x))} /></Td><Td className="kx-num text-end">{fmtMoney(Number(n.item.price) * n.qty)}</Td></tr>)}</Table></section>
        <div className="grid gap-3 sm:grid-cols-3"><Field label={t("pos.exchangeReason")}>{(id) => <Input id={id} required minLength={3} {...bind("reason")} />}</Field>
          <Field label={t("pos.exchangeRefund")}>{(id) => <Select id={id} {...bind("refundMethod")}>{["CASH", "CARD", "INSTAPAY", "FAWRY", "WALLET"].map((m) => <option key={m} value={m}>{t(`method.${m}`)}</option>)}</Select>}</Field>
          <Field label={t("pos.exchangePay")}>{(id) => <Select id={id} {...bind("payMethod")}>{["CASH", "CARD", "INSTAPAY", "FAWRY", "WALLET"].map((m) => <option key={m} value={m}>{t(`method.${m}`)}</option>)}</Select>}</Field></div>
        {needApproval && <div className="grid gap-3 sm:grid-cols-2"><Field label={t("auth.email")}>{(id) => <Input id={id} type="email" value={appr.email} onChange={(e) => setAppr({ ...appr, email: e.target.value })} />}</Field><Field label={t("auth.password")}>{(id) => <Input id={id} type="password" value={appr.password} onChange={(e) => setAppr({ ...appr, password: e.target.value })} />}</Field></div>}
        <p className="flex justify-between text-sm"><span>{t("pos.exchangeRefund")}: <b className="kx-num">{fmtMoney(refund)}</b></span><span>{t("pos.exchangePay")}: <b className="kx-num">{fmtMoney(newTotal)}</b></span></p>
        <ErrorNote error={run.error} /><Button type="submit" disabled={run.isPending || refund <= 0 || !news.length}>{t("pos.exchange")}</Button>
      </form>
    </Modal>
  );
}
