import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card, Empty, ErrorNote, ExpiryChip, Field, Input, LOT_TONE, Modal, PageHeader, Select, Spinner, Table, Tabs, Td } from "@/components/ui";
import { drugName, fmtDate, fmtNum } from "@/lib/format";
import { useToast } from "@/lib/toast";
import type { Lot, Page, StockRow } from "@/lib/types";

function StockTab() {
  const { t } = useTranslation();
  const { branchId } = useAuth();
  const [q, setQ] = useState(""); const [low, setLow] = useState(false);
  const res = useQuery({ queryKey: ["stock", branchId, q, low], queryFn: () => api<Page<StockRow>>("/inventory/stock", { query: { branchId, q, lowOnly: low, pageSize: 100 } }), enabled: !!branchId });
  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-end gap-3">
        <Field label={t("common.search")}>{(id) => <Input id={id} type="search" value={q} onChange={(e) => setQ(e.target.value)} className="w-64" />}</Field>
        <label className="flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={low} onChange={(e) => setLow(e.target.checked)} />{t("inv.lowOnly")}</label>
      </div>
      <ErrorNote error={res.error} />
      {res.isLoading ? <Spinner /> : (
        <Table head={[t("common.product"), t("inv.onHand"), t("inv.reserved"), t("inv.sellable"), t("inv.blocked"), t("inv.nextExpiry"), t("inv.minMax")]} empty={!res.data?.items.length ? <Empty>{t("common.noResults")}</Empty> : null}>
          {res.data?.items.map((r) => (
            <tr key={r.drugId} className={r.blocked > 0 ? "kx-row-bad" : r.low ? "kx-row-warn" : undefined}>
              <Td className="font-medium">{drugName(r)} <span className="text-xs text-muted-foreground">{r.strength}</span> {r.low && <Badge tone="warn">{t("inv.low")}</Badge>}</Td>
              <Td>{fmtNum(r.onHand)}</Td><Td>{fmtNum(r.reserved)}</Td><Td className="font-semibold">{fmtNum(r.sellable)}</Td><Td>{r.blocked > 0 ? <Badge tone="bad">{fmtNum(r.blocked)}</Badge> : 0}</Td>
              <Td>{fmtDate(r.nextExpiry)}</Td><Td>{r.minQty !== null ? `${r.minQty} / ${r.maxQty}` : "—"}</Td>
            </tr>
          ))}
        </Table>
      )}
    </Card>
  );
}

function ReasonModal({ title, open, onClose, onSubmit, busy, error }: { title: string; open: boolean; onClose: () => void; onSubmit: (reason: string) => void; busy: boolean; error: unknown }) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(reason); }} className="space-y-3">
        <Field label={t("common.reason")}>{(id) => <Input id={id} required minLength={3} value={reason} onChange={(e) => setReason(e.target.value)} />}</Field>
        <ErrorNote error={error} /><Button type="submit" disabled={busy}>{t("common.confirm")}</Button>
      </form>
    </Modal>
  );
}

const expLabel = (t: (k: string, o?: Record<string, unknown>) => string) => (k: "expired" | "soon" | "watch" | "ok", n: number) => (k === "expired" ? t("inv.expiredAgo", { count: Math.abs(n) }) : t("inv.inDays", { count: n }));
/** First-expiry-first-out: per product, order sellable lots by expiry and flag the one to pick first. */
function fefo(lots: Lot[]): Array<{ l: Lot; first: boolean }> {
  const sorted = [...lots].sort((a, b) => drugName(a.drug).localeCompare(drugName(b.drug)) || a.expiryDate.localeCompare(b.expiryDate));
  const seen = new Set<string>();
  return sorted.map((l) => { const sellable = l.status === "AVAILABLE" && l.daysToExpiry >= 0 && l.qtyOnHand > 0; const first = sellable && !seen.has(l.drugId); if (sellable) seen.add(l.drugId); return { l, first }; });
}

function LotsTab() {
  const { t } = useTranslation();
  const { branchId, can } = useAuth();
  const qc = useQueryClient(); const toast = useToast();
  const [status, setStatus] = useState(""); const [q, setQ] = useState("");
  const [act, setAct] = useState<{ lot: Lot; kind: "quarantine" | "release" | "write-off" | "temp" } | null>(null);
  const [temp, setTemp] = useState("");
  const res = useQuery({ queryKey: ["lots", branchId, status, q], queryFn: () => api<Page<Lot>>("/inventory/lots", { query: { branchId, status, q, pageSize: 100 } }), enabled: !!branchId });
  const run = useMutation({
    mutationFn: async (reason: string) => {
      if (!act) return;
      if (act.kind === "temp") return api(`/inventory/cold-chain/${act.lot.id}/readings`, { body: { temperatureC: Number(temp) } });
      return api(`/inventory/lots/${act.lot.id}/${act.kind}`, { body: { reason } });
    },
    onSuccess: () => { toast(t("common.saved")); setAct(null); void qc.invalidateQueries({ queryKey: ["lots"] }); void qc.invalidateQueries({ queryKey: ["stock"] }); },
  });
  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-end gap-3">
        <Field label={t("common.search")}>{(id) => <Input id={id} type="search" value={q} onChange={(e) => setQ(e.target.value)} className="w-64" />}</Field>
        <Field label={t("common.status")}>{(id) => <Select id={id} value={status} onChange={(e) => setStatus(e.target.value)}><option value="">{t("common.all")}</option>{["AVAILABLE", "QUARANTINE", "RECALLED", "EXPIRED"].map((s) => <option key={s} value={s}>{t(`lot.${s}`)}</option>)}</Select>}</Field>
      </div>
      <ErrorNote error={res.error} />
      {res.isLoading ? <Spinner /> : (
        <Table head={[t("common.product"), t("inv.lot"), t("inv.expiry"), t("inv.qty"), t("common.status"), ""]} empty={!res.data?.items.length ? <Empty>{t("common.noResults")}</Empty> : null}>
          {fefo(res.data?.items ?? []).map(({ l, first }) => (
            <tr key={l.id} className={l.status === "RECALLED" || l.status === "EXPIRED" || l.blockReason === "EXPIRED" ? "kx-row-bad" : l.status === "QUARANTINE" ? "kx-row-warn" : undefined}>
              <Td className="font-medium">{drugName(l.drug)}</Td><Td className="font-mono text-xs">{l.lotNumber}</Td>
              <Td><div className="flex flex-wrap items-center gap-1.5"><span className="whitespace-nowrap">{fmtDate(l.expiryDate)}</span><ExpiryChip days={l.daysToExpiry} label={expLabel(t)} />{first && <Badge tone="brand">{t("inv.fefoFirst")}</Badge>}</div></Td>
              <Td>{fmtNum(l.qtyOnHand)}{l.qtyReserved ? ` (${t("inv.reservedN", { count: l.qtyReserved })})` : ""}</Td>
              <Td><Badge tone={LOT_TONE[l.blockReason ?? l.status] ?? "neutral"}>{t(`lot.${l.blockReason ?? l.status}`, { defaultValue: l.status })}</Badge>{l.blockedReason && <div className="text-xs text-muted-foreground">{l.blockedReason}</div>}</Td>
              <Td><div className="flex flex-wrap gap-1">
                {can("inventory.quarantine") && l.status === "AVAILABLE" && <Button size="sm" variant="outline" onClick={() => setAct({ lot: l, kind: "quarantine" })}>{t("inv.quarantine")}</Button>}
                {can("inventory.quarantine") && l.status === "QUARANTINE" && <Button size="sm" variant="outline" onClick={() => setAct({ lot: l, kind: "release" })}>{t("inv.release")}</Button>}
                {can("inventory.adjust") && (l.status === "EXPIRED" || l.status === "RECALLED" || l.blockReason === "EXPIRED") && l.qtyOnHand > 0 && <Button size="sm" variant="danger" onClick={() => setAct({ lot: l, kind: "write-off" })}>{t("inv.writeOff")}</Button>}
                {l.drug.coldChain && <Button size="sm" variant="outline" onClick={() => setAct({ lot: l, kind: "temp" })}>{t("inv.logTemp")}</Button>}
              </div></Td>
            </tr>
          ))}
        </Table>
      )}
      {act && act.kind !== "temp" && <ReasonModal open title={t(`inv.${act.kind === "write-off" ? "writeOff" : act.kind}`)} onClose={() => setAct(null)} onSubmit={(r) => run.mutate(r)} busy={run.isPending} error={run.error} />}
      <Modal open={act?.kind === "temp"} onClose={() => setAct(null)} title={t("inv.logTemp")}>
        <form onSubmit={(e) => { e.preventDefault(); run.mutate(""); }} className="space-y-3">
          <Field label={t("inv.tempC")} hint={t("inv.tempHint")}>{(id) => <Input id={id} type="number" step="0.1" required value={temp} onChange={(e) => setTemp(e.target.value)} />}</Field>
          <ErrorNote error={run.error} /><Button type="submit" disabled={run.isPending}>{t("common.save")}</Button>
        </form>
      </Modal>
    </Card>
  );
}

interface Bucket { lotId: string; brandName: string; brandNameAr: string | null; lotNumber: string; expiryDate: string; qtyOnHand: number; daysToExpiry: number; supplierId: string | null; status: string }
function ExpiryTab() {
  const { t } = useTranslation();
  const { branchId, can } = useAuth();
  const qc = useQueryClient(); const toast = useToast();
  const res = useQuery({ queryKey: ["expiry", branchId], queryFn: () => api<Record<"expired" | "d30" | "d60" | "d90", Bucket[]>>("/inventory/expiry", { query: { branchId } }), enabled: !!branchId });
  const sweep = useMutation({ mutationFn: () => api<{ expired: number; alerts: number }>("/inventory/jobs/expiry-sweep", { method: "POST" }), onSuccess: (r) => { toast(t("inv.sweepDone", { expired: r.expired, alerts: r.alerts })); void qc.invalidateQueries({ queryKey: ["expiry"] }); } });
  const [ret, setRet] = useState<Bucket | null>(null);
  const doRet = useMutation({ mutationFn: (reason: string) => api("/inventory/returns-to-supplier", { body: { lotId: ret!.lotId, quantity: ret!.qtyOnHand, reason } }), onSuccess: () => { toast(t("common.saved")); setRet(null); void qc.invalidateQueries({ queryKey: ["expiry"] }); } });
  const groups: Array<["expired" | "d30" | "d60" | "d90", string]> = [["expired", t("inv.bExpired")], ["d30", t("inv.b30")], ["d60", t("inv.b60")], ["d90", t("inv.b90")]];
  return (
    <div className="space-y-4">
      {can("inventory.adjust") && <Button variant="outline" onClick={() => sweep.mutate()} disabled={sweep.isPending}>{t("inv.runSweep")}</Button>}
      <ErrorNote error={res.error || sweep.error} />
      {res.data && <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label={t("inv.tabExpiry")}>{groups.map(([k, label]) => { const n = res.data[k].length; const tone = k === "expired" ? "text-[hsl(var(--danger-text))]" : k === "d30" ? "text-[hsl(var(--warning))]" : "text-foreground"; return <li key={k} className="rounded-xl border border-border/80 bg-card p-3 shadow-[var(--kx-shadow-1)]"><div className="text-xs font-medium text-muted-foreground">{label}</div><div className={`mt-1 text-2xl font-bold tabular-nums ${n ? tone : "text-muted-foreground"}`}>{fmtNum(n)}</div></li>; })}</ul>}
      {res.isLoading ? <Spinner /> : groups.map(([k, label]) => (
        <Card key={k} title={`${label} (${res.data?.[k].length ?? 0})`}>
          {res.data?.[k].length ? (
            <Table head={[t("common.product"), t("inv.lot"), t("inv.expiry"), t("inv.qty"), ""]}>
              {res.data[k].map((b) => <tr key={b.lotId}><Td className="font-medium">{drugName(b)}</Td><Td className="font-mono text-xs">{b.lotNumber}</Td><Td><div className="flex flex-wrap items-center gap-1.5"><span className="whitespace-nowrap">{fmtDate(b.expiryDate)}</span><ExpiryChip days={b.daysToExpiry} label={expLabel(t)} /></div></Td><Td>{fmtNum(b.qtyOnHand)}</Td>
                <Td>{can("inventory.adjust") && b.supplierId && b.qtyOnHand > 0 && <Button size="sm" variant="outline" onClick={() => setRet(b)}>{t("inv.returnToSupplier")}</Button>}</Td></tr>)}
            </Table>
          ) : <Empty>{t("common.none")}</Empty>}
        </Card>
      ))}
      {ret && <ReasonModal open title={t("inv.returnToSupplier")} onClose={() => setRet(null)} onSubmit={(r) => doRet.mutate(r)} busy={doRet.isPending} error={doRet.error} />}
    </div>
  );
}

interface Count { id: string; type: string; status: string; startedAt: string; lines?: Array<{ id: string; lotId: string; lotNumber?: string; brandName?: string; qtyExpected: number; qtyCounted: number | null; variance: number | null }> }
function CountsTab() {
  const { t } = useTranslation();
  const { branchId, can } = useAuth();
  const qc = useQueryClient(); const toast = useToast();
  const [openId, setOpenId] = useState<string | null>(null);
  const list = useQuery({ queryKey: ["counts", branchId], queryFn: () => api<Count[]>("/inventory/counts", { query: { branchId } }), enabled: !!branchId });
  const detail = useQuery({ queryKey: ["count", openId], queryFn: () => api<Count>(`/inventory/counts/${openId}`), enabled: !!openId });
  const [vals, setVals] = useState<Record<string, string>>({});
  const refresh = () => { void qc.invalidateQueries({ queryKey: ["counts"] }); void qc.invalidateQueries({ queryKey: ["count"] }); void qc.invalidateQueries({ queryKey: ["stock"] }); };
  const start = useMutation({ mutationFn: (type: "FULL" | "CYCLE") => api<Count>("/inventory/counts", { body: { branchId, type, ...(type === "CYCLE" ? { drugIds: [] } : {}) } }), onSuccess: (c) => { setOpenId(c.id); refresh(); } });
  const save = useMutation({ mutationFn: () => api(`/inventory/counts/${openId}/lines`, { method: "PUT", body: { lines: Object.entries(vals).filter(([, v]) => v !== "").map(([lotId, v]) => ({ lotId, qtyCounted: Number(v) })) } }), onSuccess: () => { toast(t("common.saved")); refresh(); } });
  const act = useMutation({ mutationFn: (a: "submit" | "approve" | "reject") => api(`/inventory/counts/${openId}/${a}`, { method: "POST" }), onSuccess: () => { toast(t("common.saved")); refresh(); } });
  const d = detail.data;
  return (
    <div className="space-y-4">
      <div className="flex gap-2">{can("inventory.count") && <Button onClick={() => start.mutate("FULL")} disabled={start.isPending}>{t("inv.startFullCount")}</Button>}</div>
      <ErrorNote error={start.error || save.error || act.error} />
      <Card title={t("inv.counts")}>
        <Table head={[t("common.date"), t("common.type"), t("common.status"), ""]} empty={!list.data?.length ? <Empty>{t("common.none")}</Empty> : null}>
          {list.data?.map((c) => <tr key={c.id}><Td>{fmtDate(c.startedAt)}</Td><Td>{c.type}</Td><Td><Badge>{t(`countStatus.${c.status}`)}</Badge></Td><Td><Button size="sm" variant="outline" onClick={() => setOpenId(c.id)}>{t("common.open")}</Button></Td></tr>)}
        </Table>
      </Card>
      <Modal open={!!openId} onClose={() => setOpenId(null)} title={t("inv.counts")} wide>
        {d && (
          <div className="space-y-3">
            <Table head={[t("common.product"), t("inv.lot"), t("inv.expected"), t("inv.counted"), t("inv.variance")]}>
              {d.lines?.map((l) => <tr key={l.id}><Td>{l.brandName}</Td><Td className="font-mono text-xs">{l.lotNumber}</Td><Td>{l.qtyExpected}</Td>
                <Td>{d.status === "OPEN" ? <Input aria-label={t("inv.counted")} type="number" min={0} className="w-24" defaultValue={l.qtyCounted ?? ""} onChange={(e) => setVals({ ...vals, [l.lotId]: e.target.value })} /> : l.qtyCounted}</Td>
                <Td className={l.variance ? "font-semibold text-danger" : ""}>{l.variance ?? "—"}</Td></tr>)}
            </Table>
            <div className="flex flex-wrap gap-2">
              {d.status === "OPEN" && <><Button variant="outline" onClick={() => save.mutate()}>{t("common.save")}</Button><Button onClick={() => act.mutate("submit")}>{t("inv.submitCount")}</Button></>}
              {d.status === "PENDING_APPROVAL" && can("inventory.count.approve") && <><Button onClick={() => act.mutate("approve")}>{t("inv.approveVariance")}</Button><Button variant="danger" onClick={() => act.mutate("reject")}>{t("inv.rejectCount")}</Button></>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export function Inventory() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("stock");
  return (
    <>
      <PageHeader title={t("inv.title")} />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: "stock", label: t("inv.tabStock") }, { id: "lots", label: t("inv.tabLots") }, { id: "expiry", label: t("inv.tabExpiry") }, { id: "counts", label: t("inv.tabCounts") }]} />
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "stock" && <StockTab />}{tab === "lots" && <LotsTab />}{tab === "expiry" && <ExpiryTab />}{tab === "counts" && <CountsTab />}
      </div>
    </>
  );
}
