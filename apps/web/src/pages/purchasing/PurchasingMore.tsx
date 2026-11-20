import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Wand2 } from "lucide-react";
import { api, newKey } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useAction, useForm } from "@/lib/hooks";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, Table, Td, type Tone } from "@/components/ui";
import { DrugPicker } from "@/components/pickers";
import { StatCard } from "@/brand/ui-kit";
import { drugName, fmtDate, fmtDateTime, fmtMoney, fmtNum } from "@/lib/format";
import { useToast } from "@/lib/toast";
import type { Drug, Supplier } from "@/lib/types";

const RFQ_TONE: Record<string, Tone> = { DRAFT: "neutral", SENT: "info", QUOTED: "warn", AWARDED: "good", CLOSED: "neutral", CANCELLED: "neutral" };
interface RfqRow { id: string; number: string; status: string; branchId: string; createdAt: string; dueAt: string | null; lineCount: number; quoted: number; invited: number }
interface RfqDetail { id: string; number: string; status: string; notes: string | null; lines: Array<{ id: string; drugId: string; qty: number; drug: { brandName: string; brandNameAr: string | null; strength: string } | null; bestSupplierId: string | null; bestPrice: string | null; offers: Array<{ supplierId: string; unitPrice: string }> }>; quotes: Array<{ id: string; supplierId: string; supplierName: string; status: string; leadTimeDays: number | null; complete: boolean; total: string }> }

function RfqModal({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { t } = useTranslation(); const { can } = useAuth(); const toast = useToast();
  const q = useQuery({ queryKey: ["rfq", id], queryFn: () => api<RfqDetail>(`/purchasing/rfqs/${id}`), enabled: !!id });
  const d = q.data; const open = d && ["SENT", "QUOTED"].includes(d.status);
  const [rec, setRec] = useState<string | null>(null); const [prices, setPrices] = useState<Record<string, string>>({}); const [lead, setLead] = useState("");
  const send = useAction(() => api<{ notified: number }>(`/purchasing/rfqs/${id}/send`, { method: "POST" }), ["rfq", "rfqs"], { silent: true, onDone: (r) => toast(t("pur.rfqSent", { count: r.notified })) });
  const quote = useAction(() => api(`/purchasing/rfqs/${id}/quotes/${rec}`, { body: { lines: Object.entries(prices).filter(([, v]) => v).map(([rfqLineId, unitPrice]) => ({ rfqLineId, unitPrice })), leadTimeDays: lead ? Number(lead) : undefined } }), ["rfq", "rfqs"], { onDone: () => { setRec(null); setPrices({}); setLead(""); } });
  const decline = useAction((sid: string) => api(`/purchasing/rfqs/${id}/quotes/${sid}/decline`, { method: "POST" }), ["rfq", "rfqs"]);
  const award = useAction((mode: { mode: string; supplierId?: string }) => api<{ purchaseOrders: unknown[] }>(`/purchasing/rfqs/${id}/award`, { body: mode }), ["rfq", "rfqs", "pos"], { silent: true, onDone: (r) => toast(t("pur.rfqAwarded", { count: r.purchaseOrders.length })) });
  const cancel = useAction(() => api(`/purchasing/rfqs/${id}/cancel`, { method: "POST" }), ["rfq", "rfqs"]);
  return (
    <Modal open={!!id} onClose={onClose} title={d ? `${t("pur.rfqNumber")} ${d.number}` : t("pur.tabRfq")} wide>
      {d && <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2"><Badge tone={RFQ_TONE[d.status] ?? "neutral"}>{t(`pur.rfqStatus.${d.status}`)}</Badge>{d.notes && <span className="text-sm text-muted-foreground">{d.notes}</span>}
          <div className="ms-auto flex gap-2">{can("po.write") && d.status === "DRAFT" && <Button onClick={() => send.mutate()} disabled={send.isPending}>{t("pur.rfqSend")}</Button>}{can("po.write") && d.status !== "AWARDED" && d.status !== "CANCELLED" && <Button variant="ghost" onClick={() => cancel.mutate()}>{t("common.cancel")}</Button>}</div></div>
        <h3 className="text-sm font-semibold">{t("pur.rfqCompare")}</h3>
        <Table dense numeric={d.quotes.map((_, i) => i + 2)} head={[t("common.product"), t("inv.qty"), ...d.quotes.map((x) => `${x.supplierName}${x.status === "DECLINED" ? ` (${t("pur.rfqDecline")})` : ""}`)]}>
          {d.lines.map((l) => <tr key={l.id}><Td className="font-medium">{drugName(l.drug)} <bdi className="text-xs text-muted-foreground">{l.drug?.strength}</bdi></Td><Td className="kx-num text-end">{l.qty}</Td>{d.quotes.map((x) => { const o = l.offers.find((p) => p.supplierId === x.supplierId); const best = l.bestSupplierId === x.supplierId; return <Td key={x.id} className={`kx-num text-end ${best ? "font-bold text-[hsl(var(--success))]" : ""}`}>{o ? fmtMoney(o.unitPrice) : "—"}{best && <span className="ms-1 text-xs">★</span>}</Td>; })}</tr>)}
          <tr className="font-semibold"><Td>{t("pur.rfqTotal")}</Td><Td />{d.quotes.map((x) => <Td key={x.id} className="kx-num text-end">{x.status === "QUOTED" || x.status === "AWARDED" ? fmtMoney(x.total) : "—"}{x.leadTimeDays != null && <div className="text-xs font-normal text-muted-foreground">{x.leadTimeDays} d</div>}</Td>)}</tr></Table>
        {can("po.write") && open && <div className="flex flex-wrap gap-2">{d.quotes.filter((x) => x.status !== "DECLINED" && x.status !== "AWARDED").map((x) => <span key={x.id} className="inline-flex items-center gap-1"><Button size="sm" variant="outline" onClick={() => setRec(x.supplierId)}>{t("pur.rfqRecord")}: {x.supplierName}</Button>{x.status === "INVITED" && <Button size="sm" variant="ghost" onClick={() => decline.mutate(x.supplierId)}>{t("pur.rfqDecline")}</Button>}</span>)}</div>}
        {can("po.write") && open && d.quotes.some((x) => x.status === "QUOTED") && <div className="flex flex-wrap gap-2 border-t border-border pt-3"><Button onClick={() => award.mutate({ mode: "CHEAPEST_PER_LINE" })} disabled={award.isPending}>{t("pur.rfqAward")}: {t("pur.rfqAwardCheapest")}</Button>{d.quotes.filter((x) => x.status === "QUOTED" && x.complete).map((x) => <Button key={x.id} variant="outline" onClick={() => award.mutate({ mode: "SUPPLIER", supplierId: x.supplierId })}>{t("pur.rfqAwardSupplier")}: {x.supplierName}</Button>)}</div>}
        <ErrorNote error={send.error || quote.error || award.error || decline.error || cancel.error} />
        <Modal open={!!rec} onClose={() => setRec(null)} title={t("pur.rfqRecord")}><form className="space-y-3" onSubmit={(e) => { e.preventDefault(); quote.mutate(); }}>
          {d.lines.map((l) => <Field key={l.id} label={`${drugName(l.drug)} × ${l.qty}`}>{(fid) => <Input id={fid} inputMode="decimal" pattern="[0-9]+(\.[0-9]{1,2})?" value={prices[l.id] ?? ""} onChange={(e) => setPrices({ ...prices, [l.id]: e.target.value })} placeholder={t("pur.unitPrice")} />}</Field>)}
          <Field label={t("pur.rfqLead")}>{(fid) => <Input id={fid} type="number" min={0} value={lead} onChange={(e) => setLead(e.target.value)} />}</Field><ErrorNote error={quote.error} /><Button type="submit" disabled={quote.isPending}>{t("common.save")}</Button></form></Modal>
      </div>}
    </Modal>
  );
}

export function RfqTab({ suppliers }: { suppliers: Supplier[] }) {
  const { t } = useTranslation(); const { can, branchId } = useAuth(); const toast = useToast();
  const list = useQuery({ queryKey: ["rfqs", branchId], queryFn: () => api<RfqRow[]>("/purchasing/rfqs", { query: { branchId } }), enabled: !!branchId });
  const [open, setOpen] = useState(false); const [sel, setSel] = useState<string | null>(null);
  const [f, , bind, reset] = useForm({ notes: "", dueAt: "" }); const [lines, setLines] = useState<Array<{ drug: Drug; qty: string; k: string }>>([]); const [sup, setSup] = useState<string[]>([]);
  const create = useAction(() => api<{ id: string }>("/purchasing/rfqs", { body: { branchId, notes: f.notes || undefined, dueAt: f.dueAt ? new Date(f.dueAt).toISOString() : undefined, lines: lines.map((l) => ({ drugId: l.drug.id, qty: Number(l.qty) })), supplierIds: sup } }), ["rfqs"], { onDone: (r) => { reset(); setLines([]); setSup([]); setOpen(false); setSel(r.id); } });
  const fromSug = useAction(() => api<{ id: string }>("/purchasing/rfqs/from-suggestions", { body: { branchId, supplierIds: sup.length ? sup : suppliers.slice(0, 3).map((s) => s.id) } }), ["rfqs"], { silent: true, onDone: (r) => { setSel(r.id); toast(t("common.saved")); } });
  return <Card title={t("pur.tabRfq")} actions={can("po.write") && <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => fromSug.mutate()} disabled={fromSug.isPending}><Wand2 aria-hidden className="size-4" />{t("pur.rfqFromSugg")}</Button><Button size="sm" onClick={() => setOpen(true)}><Plus aria-hidden className="size-4" />{t("pur.rfqNew")}</Button></div>}>
    <ErrorNote error={fromSug.error} />
    <Table head={[t("pur.rfqNumber"), t("common.date"), t("pur.rfqLines"), t("pur.rfqQuoted"), t("common.status"), ""]} numeric={[2]} empty={!list.data?.length ? <Empty>{t("pur.rfqEmpty")}</Empty> : null}>
      {list.data?.map((r) => <tr key={r.id}><Td className="font-mono text-xs">{r.number}</Td><Td>{fmtDate(r.createdAt)}</Td><Td className="kx-num text-end">{r.lineCount}</Td><Td>{r.quoted}/{r.invited}</Td><Td><Badge tone={RFQ_TONE[r.status] ?? "neutral"}>{t(`pur.rfqStatus.${r.status}`)}</Badge></Td><Td className="text-end"><Button size="sm" variant="outline" onClick={() => setSel(r.id)}>{t("common.open")}</Button></Td></tr>)}</Table>
    <Modal open={open} onClose={() => setOpen(false)} title={t("pur.rfqNew")} wide><form className="space-y-3" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
      <div className="grid gap-3 sm:grid-cols-2"><Field label={t("pur.rfqNotes")}>{(id) => <Input id={id} {...bind("notes")} />}</Field><Field label={t("pur.rfqDue")}>{(id) => <Input id={id} type="date" {...bind("dueAt")} />}</Field></div>
      <fieldset className="rounded-xl border border-border p-3"><legend className="px-1 text-xs font-semibold text-muted-foreground">{t("pur.rfqSuppliers")}</legend><div className="flex flex-wrap gap-3">{suppliers.map((s) => <label key={s.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sup.includes(s.id)} onChange={(e) => setSup(e.target.checked ? [...sup, s.id] : sup.filter((x) => x !== s.id))} />{s.name}</label>)}</div></fieldset>
      <h3 className="text-sm font-semibold">{t("pur.rfqLines")}</h3><DrugPicker label={t("rx.addDrug")} onPick={(d) => setLines((x) => [...x, { drug: d, qty: "10", k: newKey() }])} />
      {lines.map((l) => <div key={l.k} className="flex items-center gap-2"><span className="flex-1 text-sm">{drugName(l.drug)} <bdi className="text-muted-foreground">{l.drug.strength}</bdi></span><Input aria-label={t("inv.qty")} type="number" min={1} className="w-24" value={l.qty} onChange={(e) => setLines(lines.map((x) => x.k === l.k ? { ...x, qty: e.target.value } : x))} /><Button type="button" variant="ghost" size="sm" onClick={() => setLines(lines.filter((x) => x.k !== l.k))}>✕</Button></div>)}
      <ErrorNote error={create.error} /><Button type="submit" disabled={create.isPending || !lines.length || !sup.length}>{t("common.save")}</Button></form></Modal>
    <RfqModal id={sel} onClose={() => setSel(null)} /></Card>;
}

export function Statement({ supplierId, onClose }: { supplierId: string | null; onClose: () => void }) {
  const { t } = useTranslation();
  const q = useQuery({ queryKey: ["statement", supplierId], queryFn: () => api<{ supplier: { name: string }; openingBalance: string; closingBalance: string; entries: Array<{ id: string; at: string; type: string; note: string | null; amount: string; balance: string }> }>(`/purchasing/suppliers/${supplierId}/statement`), enabled: !!supplierId });
  return <Modal open={!!supplierId} onClose={onClose} title={`${t("pur.statementTitle")}${q.data ? ` · ${q.data.supplier.name}` : ""}`} wide>
    <Table dense numeric={[2, 3]} head={[t("common.date"), t("pur.entryType"), t("fin.expAmount"), t("cus.balance")]} empty={!q.data?.entries.length ? <Empty>{t("common.none")}</Empty> : null}>
      {q.data?.entries.map((e) => <tr key={e.id}><Td>{fmtDateTime(e.at)}</Td><Td>{t(`ledger.${e.type}`)}{e.note ? ` · ${e.note}` : ""}</Td><Td className={`kx-num text-end ${Number(e.amount) < 0 ? "text-[hsl(var(--success))]" : ""}`}>{fmtMoney(e.amount)}</Td><Td className="kx-num text-end font-semibold">{fmtMoney(e.balance)}</Td></tr>)}</Table>
    {q.data && <p className="mt-3 flex justify-between text-sm"><span>{t("pur.opening")}: <b className="kx-num">{fmtMoney(q.data.openingBalance)}</b></span><span>{t("pur.closing")}: <b className="kx-num">{fmtMoney(q.data.closingBalance)}</b></span></p>}</Modal>;
}

const BUCKETS = ["current", "d1_30", "d31_60", "d61_90", "d90_plus"] as const;
export interface AgingRow { buckets: Record<(typeof BUCKETS)[number], string>; outstanding: string; overLimit?: boolean; oldestDaysPastDue: number }
export function AgingTable<T extends AgingRow>({ rows, label, empty, onRow, totals }: { rows: T[]; label: (r: T) => string; empty: string; onRow?: (r: T) => void; totals?: Record<string, string> }) {
  const { t } = useTranslation();
  return <Table dense numeric={[1, 2, 3, 4, 5, 6]} head={[t("sup.name"), t("pur.outstanding"), ...BUCKETS.map((b) => t(`pur.ag.${b}`)), ""]} empty={!rows.length ? <Empty>{empty}</Empty> : null}>
    {rows.map((r, i) => <tr key={i}><Td className="font-medium">{label(r)} {r.overLimit && <Badge tone="bad">{t("pur.overLimit")}</Badge>}</Td><Td className="kx-num text-end font-semibold">{fmtMoney(r.outstanding)}</Td>{BUCKETS.map((b) => <Td key={b} className={`kx-num text-end ${b === "d90_plus" && Number(r.buckets[b]) > 0 ? "font-semibold text-[hsl(var(--danger-text))]" : ""}`}>{Number(r.buckets[b]) ? fmtMoney(r.buckets[b]) : "—"}</Td>)}<Td className="text-end">{onRow && <Button size="sm" variant="outline" onClick={() => onRow(r)}>{t("pur.statement")}</Button>}</Td></tr>)}
    {totals && !!rows.length && <tr className="font-semibold"><Td>Σ</Td><Td className="kx-num text-end">{fmtMoney(Object.values(totals).reduce((a, v) => a + Number(v), 0))}</Td>{BUCKETS.map((b) => <Td key={b} className="kx-num text-end">{fmtMoney(totals[b] ?? 0)}</Td>)}<Td /></tr>}</Table>;
}

export function ApAgingTab({ onStatement }: { onStatement: (id: string) => void }) {
  const { t } = useTranslation();
  const q = useQuery({ queryKey: ["ap-aging"], queryFn: () => api<{ outstanding: string; totals: Record<string, string>; suppliers: Array<AgingRow & { supplierId: string; name: string; advance: string }> }>("/purchasing/aging") });
  return <div className="space-y-4"><div className="grid gap-4 sm:grid-cols-5">{BUCKETS.map((b) => <StatCard key={b} label={t(`pur.ag.${b}`)} value={fmtMoney(q.data?.totals[b] ?? 0)} tone={b === "d90_plus" ? "bad" : b === "current" ? "good" : "warn"} />)}</div>
    <Card className="p-0"><AgingTable rows={q.data?.suppliers ?? []} label={(r) => r.name} empty={t("pur.agingEmpty")} onRow={(r) => onStatement(r.supplierId)} /></Card></div>;
}

export function VarianceTab() {
  const { t } = useTranslation(); const { branchId } = useAuth(); const [min, setMin] = useState("5");
  const from = new Date(Date.now() - 90 * 86_400_000).toISOString();
  const q = useQuery({ queryKey: ["variance", branchId, min], queryFn: () => api<{ count: number; extraCostVsPo: string; items: Array<{ receiptLineId: string; receivedAt: string; brandName: string; brandNameAr: string | null; supplier: string | null; quantity: number; unitCost: string; poUnitCost: string | null; prevUnitCost: string | null; pctVsPo: number | null; pctVsPrev: number | null; extraCost: string | null }> }>("/purchasing/cost-variance", { query: { branchId, minPct: min, from } }), enabled: !!branchId });
  const pct = (v: number | null) => v == null ? "—" : <Badge tone={Math.abs(v) >= 10 ? "bad" : "warn"}>{v > 0 ? "+" : ""}{v}%</Badge>;
  return <Card><div className="mb-3 flex flex-wrap items-end gap-3"><Field label={t("pur.varianceMin")}>{(id) => <Input id={id} type="number" min={0} className="w-28" value={min} onChange={(e) => setMin(e.target.value)} />}</Field><StatCard label={t("pur.varExtra")} value={fmtMoney(q.data?.extraCostVsPo ?? 0)} tone="warn" className="min-w-48" /></div>
    <Table dense numeric={[3, 4, 5]} head={[t("common.date"), t("common.product"), t("sup.suppliers"), t("pur.varPo"), t("pur.varPrev"), t("pur.varExtra")]} hideOnPhone={[2]} empty={!q.data?.items.length ? <Empty>{t("pur.varEmpty")}</Empty> : null}>
      {q.data?.items.map((r) => <tr key={r.receiptLineId}><Td>{fmtDate(r.receivedAt)}</Td><Td className="font-medium">{drugName(r)}</Td><Td>{r.supplier ?? "—"}</Td><Td className="kx-num text-end">{fmtMoney(r.unitCost)} <span className="text-xs text-muted-foreground">/ {r.poUnitCost ? fmtMoney(r.poUnitCost) : "—"}</span> {pct(r.pctVsPo)}</Td><Td className="kx-num text-end">{pct(r.pctVsPrev)}</Td><Td className="kx-num text-end">{r.extraCost ? fmtMoney(r.extraCost) : "—"}</Td><Td /></tr>)}</Table></Card>;
}

export function SupplierReturnsTab() {
  const { t } = useTranslation(); const { branchId } = useAuth();
  const q = useQuery({ queryKey: ["supplier-returns", branchId], queryFn: () => api<Array<{ id: string; createdAt: string; supplierName: string | null; brandName: string | null; brandNameAr: string | null; lotNumber: string | null; quantity: number; creditAmount: string; reason: string }>>("/purchasing/supplier-returns", { query: { branchId } }), enabled: !!branchId });
  return <Card><Table dense numeric={[3, 4]} head={[t("common.date"), t("sup.suppliers"), t("common.product"), t("inv.qty"), t("pur.credit"), t("common.reason")]} empty={!q.data?.length ? <Empty>{t("pur.returnsEmpty")}</Empty> : null}>
    {q.data?.map((r) => <tr key={r.id}><Td>{fmtDate(r.createdAt)}</Td><Td>{r.supplierName}</Td><Td className="font-medium">{drugName({ brandName: r.brandName ?? "", brandNameAr: r.brandNameAr })} <span className="font-mono text-xs text-muted-foreground">{r.lotNumber}</span></Td><Td className="kx-num text-end">{fmtNum(r.quantity)}</Td><Td className="kx-num text-end">{fmtMoney(r.creditAmount)}</Td><Td>{r.reason}</Td></tr>)}</Table></Card>;
}
