import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { AlertTriangle, Mail, MessageCircle, Plus, Truck, ClipboardList, ShieldAlert, Wand2 } from "lucide-react";
import { Avatar, Badge, Button, Card, Empty, ErrorNote, Field, Input, Meter, Modal, PageHeader, Select, Table, Tabs, Td } from "@/components/ui";
import { StatusChip, TableSkeleton, type KTone } from "@/brand/ui-kit";
import { drugName, fmtDate, fmtDateTime, fmtMoney, fmtNum } from "@/lib/format";
import { useToast } from "@/lib/toast";
import type { Drug, Page, Po, Supplier } from "@/lib/types";

function SuppliersTab() {
  const { t } = useTranslation();
  const { can } = useAuth();
  const qc = useQueryClient(); const toast = useToast();
  const list = useQuery({ queryKey: ["suppliers"], queryFn: () => api<Supplier[]>("/suppliers") });
  const [add, setAdd] = useState(false); const [f, setF] = useState({ name: "", phone: "", email: "", paymentTerms: "", creditLimit: "" });
  const [sel, setSel] = useState<Supplier | null>(null); const [amount, setAmount] = useState("");
  const ledger = useQuery({ queryKey: ["ledger", sel?.id], queryFn: () => api<Array<{ id: string; type: string; amount: string; note: string | null; createdAt: string }>>(`/suppliers/${sel!.id}/ledger`), enabled: !!sel });
  const create = useMutation({ mutationFn: () => api("/suppliers", { body: { name: f.name, phone: f.phone || undefined, email: f.email || undefined, paymentTerms: f.paymentTerms || undefined, creditLimit: f.creditLimit || undefined } }), onSuccess: () => { setAdd(false); setF({ name: "", phone: "", email: "", paymentTerms: "", creditLimit: "" }); void qc.invalidateQueries({ queryKey: ["suppliers"] }); } });
  const pay = useMutation({ mutationFn: () => api(`/suppliers/${sel!.id}/payments`, { body: { amount, idempotencyKey: crypto.randomUUID() } }), onSuccess: () => { toast(t("common.saved")); setAmount(""); void qc.invalidateQueries({ queryKey: ["ledger"] }); void qc.invalidateQueries({ queryKey: ["suppliers"] }); } });
  return (
    <Card title={t("sup.suppliers")} className="p-0 [&>header]:px-4 [&>header]:pt-4 [&>p]:mx-4" actions={can("supplier.write") && <Button size="sm" onClick={() => setAdd(true)}><Plus aria-hidden className="size-4" />{t("sup.add")}</Button>}>
      {list.isLoading ? <TableSkeleton rows={5} cols={4} /> : (
      <Table head={[t("sup.name"), t("sup.terms"), t("sup.credit"), t("sup.balance"), ""]} numeric={[3]} empty={!list.data?.length ? <Empty hint={t("sup.emptyHint")}>{t("common.none")}</Empty> : null}>
        {list.data?.map((s) => { const bal = Number(s.balance), lim = s.creditLimit ? Number(s.creditLimit) : 0; const over = lim > 0 && bal > lim; return (
          <tr key={s.id}>
            <Td><div className="flex items-center gap-3"><Avatar name={s.name} /><div className="min-w-0"><div className="font-medium leading-tight">{s.name}</div><div className="text-xs text-muted-foreground" dir="ltr">{s.phone ?? s.email ?? ""}</div></div></div></Td>
            <Td>{s.paymentTerms ? <StatusChip tone="neutral" dot={false}>{s.paymentTerms}</StatusChip> : "—"}</Td>
            <Td className="min-w-40">{lim > 0 ? <div><div className="mb-1 flex justify-between text-xs text-muted-foreground"><span className="kx-num">{fmtMoney(lim)}</span><span className={over ? "font-semibold text-[hsl(var(--danger-text))]" : ""}>{fmtNum(Math.round((bal / lim) * 100))}%</span></div><Meter label={t("sup.creditUsed")} value={bal} max={lim} tone={over ? "bad" : bal / lim > 0.8 ? "warn" : "brand"} /></div> : <span className="text-muted-foreground">—</span>}</Td>
            <Td className={`kx-num text-end font-semibold ${over ? "text-[hsl(var(--danger-text))]" : ""}`}>{fmtMoney(s.balance)}</Td>
            <Td className="text-end"><Button size="sm" variant="outline" onClick={() => setSel(s)}>{t("sup.ledger")}</Button></Td>
          </tr>); })}
      </Table>)}
      <Modal open={add} onClose={() => setAdd(false)} title={t("sup.add")}>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
          {(["name", "phone", "email", "paymentTerms", "creditLimit"] as const).map((k) => <Field key={k} label={t(`sup.${k}`)}>{(id) => <Input id={id} required={k === "name"} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />}</Field>)}
          <ErrorNote error={create.error} /><Button type="submit">{t("common.save")}</Button>
        </form>
      </Modal>
      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.name ?? ""} wide>
        {sel && <div className="space-y-3">
          <div className="flex items-center gap-4 rounded-xl bg-muted/60 p-4"><Avatar name={sel.name} className="size-11" /><div><div className="text-xs font-medium text-muted-foreground">{t("sup.balance")}</div><div className="kx-num text-3xl font-semibold tracking-tight">{fmtMoney(sel.balance)}</div></div>{sel.creditLimit && <div className="ms-auto text-end text-xs text-muted-foreground">{t("sup.creditLimit")}<div className="kx-num text-sm font-medium text-foreground">{fmtMoney(sel.creditLimit)}</div></div>}</div>
          {can("supplier.write") && <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); pay.mutate(); }}><Field label={t("sup.payment")}>{(id) => <Input id={id} inputMode="decimal" required value={amount} onChange={(e) => setAmount(e.target.value)} />}</Field><Button type="submit" disabled={pay.isPending}>{t("sup.pay")}</Button></form>}
          <ErrorNote error={pay.error} />
          <Table dense numeric={[2]} head={[t("common.date"), t("common.type"), t("sup.amount"), t("common.note")]} empty={ledger.data && !ledger.data.length ? <Empty>{t("common.none")}</Empty> : null}>{ledger.data?.map((e) => <tr key={e.id}><Td>{fmtDateTime(e.createdAt)}</Td><Td>{t(`ledger.${e.type}`)}</Td><Td className={`kx-num text-end font-medium ${Number(e.amount) < 0 ? "text-[hsl(var(--success))]" : ""}`}>{fmtMoney(e.amount)}</Td><Td>{e.note ?? ""}</Td></tr>)}</Table>
        </div>}
      </Modal>
    </Card>
  );
}

const PO_FLOW = ["DRAFT", "SENT", "PARTIALLY_RECEIVED", "RECEIVED"] as const;
const PO_TONE: Record<string, KTone> = { DRAFT: "neutral", SENT: "info", PARTIALLY_RECEIVED: "warn", RECEIVED: "good", CANCELLED: "bad" };
function PoTrack({ status }: { status: string }) {
  const { t } = useTranslation();
  const i = PO_FLOW.indexOf(status as (typeof PO_FLOW)[number]);
  if (i < 0) return null;
  return (
    <ol className="flex items-center gap-1" aria-label={t("sup.poProgress")}>
      {PO_FLOW.map((k, n) => <li key={k} className="flex items-center gap-1" title={t(`poStatus.${k}`)}><span className={`size-2 rounded-full ${n < i ? "bg-primary" : n === i ? "bg-primary ring-4 ring-primary/20" : "bg-border"}`} />{n < PO_FLOW.length - 1 && <span aria-hidden className={`h-px w-4 ${n < i ? "bg-primary" : "bg-border"}`} />}</li>)}
    </ol>
  );
}
function PosTab() {
  const { t } = useTranslation();
  const { can } = useAuth();
  const qc = useQueryClient(); const toast = useToast();
  const res = useQuery({ queryKey: ["purchase-orders"], queryFn: () => api<Po[]>("/purchase-orders") });
  const act = useMutation({ mutationFn: (v: { id: string; kind: "send" | "cancel"; via?: string }) => api(`/purchase-orders/${v.id}/${v.kind}`, { body: v.via ? { via: v.via } : {} }), onSuccess: () => { toast(t("common.saved")); void qc.invalidateQueries({ queryKey: ["purchase-orders"] }); } });
  return (
    <Card title={t("sup.pos")} className="p-0 [&>header]:px-4 [&>header]:pt-4">
      <div className="px-4"><ErrorNote error={res.error || act.error} /></div>
      {res.isLoading ? <TableSkeleton rows={5} cols={5} /> : (
      <Table head={["#", t("sup.name"), t("common.status"), t("sup.received"), t("sup.total"), t("common.date"), ""]} numeric={[4]} empty={!res.data?.length ? <Empty hint={t("sup.posEmptyHint")}>{t("common.none")}</Empty> : null}>
        {res.data?.map((p) => { const ord = p.lines?.reduce((a, l) => a + l.qtyOrdered, 0) ?? 0; const rec = p.lines?.reduce((a, l) => a + l.qtyReceived, 0) ?? 0; return (
          <tr key={p.id}>
            <Td className="whitespace-nowrap font-mono text-xs">{p.poNumber}</Td><Td className="font-medium">{p.supplier?.name}</Td>
            <Td><div className="space-y-1.5"><StatusChip tone={PO_TONE[p.status] ?? "neutral"}>{t(`poStatus.${p.status}`)}</StatusChip><PoTrack status={p.status} /></div></Td>
            <Td className="min-w-32">{ord > 0 ? <div><div className="kx-num mb-1 text-xs text-muted-foreground">{fmtNum(rec)} / {fmtNum(ord)}</div><Meter label={t("sup.received")} value={rec} max={ord} tone={rec >= ord ? "good" : "brand"} /></div> : "—"}</Td>
            <Td className="kx-num text-end font-medium">{fmtMoney(p.totalCost)}</Td><Td className="whitespace-nowrap">{fmtDate(p.createdAt)}</Td>
            <Td>{can("po.write") && p.status === "DRAFT" && <div className="flex justify-end gap-1"><Button size="sm" onClick={() => act.mutate({ id: p.id, kind: "send", via: "WHATSAPP" })}><MessageCircle aria-hidden className="size-3.5" />{t("sup.sendWhatsapp")}</Button><Button size="sm" variant="outline" onClick={() => act.mutate({ id: p.id, kind: "send", via: "EMAIL" })}><Mail aria-hidden className="size-3.5" />{t("sup.sendEmail")}</Button><Button size="sm" variant="ghost" onClick={() => act.mutate({ id: p.id, kind: "cancel" })}>{t("common.cancel")}</Button></div>}</Td>
          </tr>); })}
      </Table>)}
    </Card>
  );
}

interface Suggestion { drugId: string; brandName: string; brandNameAr: string | null; position: number; minQty: number; maxQty: number; suggestedQty: number; method: string; supplierId: string | null; forecast?: { avgDailyDemand: number; explanation: string } }
function ReorderTab() {
  const { t } = useTranslation();
  const { branchId, can } = useAuth();
  const qc = useQueryClient(); const toast = useToast();
  const sug = useQuery({ queryKey: ["reorder", branchId], queryFn: () => api<{ method: string; items: Suggestion[] }>("/reorder/suggestions", { query: { branchId } }), enabled: !!branchId });
  const suppliers = useQuery({ queryKey: ["suppliers"], queryFn: () => api<Supplier[]>("/suppliers") });
  const [pick, setPick] = useState<Record<string, boolean>>({}); const [sup, setSup] = useState<Record<string, string>>({});
  const create = useMutation({ mutationFn: () => api("/reorder/create-pos", { body: { branchId, items: sug.data!.items.filter((i) => pick[i.drugId]).map((i) => ({ drugId: i.drugId, qty: i.suggestedQty, supplierId: sup[i.drugId] || i.supplierId || undefined })) } }), onSuccess: () => { toast(t("sup.posCreated")); setPick({}); void qc.invalidateQueries({ queryKey: ["reorder"] }); void qc.invalidateQueries({ queryKey: ["purchase-orders"] }); } });
  const [policy, setPolicy] = useState(false);
  return (
    <Card title={t("sup.reorder")} className="p-0 [&>header]:px-4 [&>header]:pt-4 [&>p]:mx-4" actions={sug.data && <Badge tone={sug.data.method === "FORECAST" ? "info" : "neutral"}>{sug.data.method === "FORECAST" ? t("sup.methodForecast") : t("sup.methodMinMax")}</Badge>}>
      <ErrorNote error={sug.error || create.error} />
      {sug.isLoading ? <TableSkeleton rows={5} cols={5} /> : (
        <Table head={["", t("common.product"), t("sup.position"), t("inv.minMax"), t("sup.suggested"), t("rcv.supplier")]} empty={!sug.data?.items.length ? <Empty hint={t("sup.noReorderHint")}>{t("sup.noReorder")}</Empty> : null}>
          {sug.data?.items.map((i) => <tr key={i.drugId}><Td><input type="checkbox" aria-label={drugName(i)} checked={!!pick[i.drugId]} onChange={(e) => setPick({ ...pick, [i.drugId]: e.target.checked })} /></Td>
            <Td className="font-medium">{drugName(i)}{i.forecast && <div className="text-xs text-muted-foreground">{i.forecast.explanation}</div>}</Td><Td className="kx-num">{i.position}</Td><Td className="kx-num">{i.minQty} / {i.maxQty}</Td><Td className="font-semibold"><span className="kx-num">{i.suggestedQty}</span> <Badge>{i.method === "FORECAST" ? t("sup.methodForecast") : t("sup.methodMinMax")}</Badge></Td>
            <Td><Select aria-label={t("rcv.supplier")} value={sup[i.drugId] ?? i.supplierId ?? ""} onChange={(e) => setSup({ ...sup, [i.drugId]: e.target.value })}><option value="">—</option>{suppliers.data?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></Td></tr>)}
        </Table>
      )}
      <div className="flex gap-2 border-t border-border/70 px-4 py-3">
        {can("po.write") && <Button disabled={!Object.values(pick).some(Boolean) || create.isPending} onClick={() => create.mutate()}><Wand2 aria-hidden className="size-4" />{t("sup.createPos")}{Object.values(pick).some(Boolean) && ` (${Object.values(pick).filter(Boolean).length})`}</Button>}
        {can("inventory.adjust") && <Button variant="outline" onClick={() => setPolicy(true)}>{t("sup.setPolicy")}</Button>}
      </div>
      <PolicyModal open={policy} onClose={() => setPolicy(false)} />
    </Card>
  );
}

function PolicyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const { branchId } = useAuth();
  const qc = useQueryClient(); const toast = useToast();
  const [search, setSearch] = useState(""); const [drug, setDrug] = useState<Drug | null>(null); const [min, setMin] = useState("5"); const [max, setMax] = useState("20");
  const res = useQuery({ queryKey: ["pol-search", search], queryFn: () => api<Page<Drug>>("/catalogue/drugs", { query: { q: search, pageSize: 6 } }), enabled: search.length >= 2 });
  const save = useMutation({ mutationFn: () => api("/inventory/reorder-policies", { method: "PUT", query: { branchId }, body: { drugId: drug!.id, minQty: Number(min), maxQty: Number(max) } }), onSuccess: () => { toast(t("common.saved")); setDrug(null); onClose(); void qc.invalidateQueries({ queryKey: ["reorder"] }); } });
  return (
    <Modal open={open} onClose={onClose} title={t("sup.setPolicy")}>
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
        <Field label={t("common.search")}>{(id) => <Input id={id} type="search" value={search} onChange={(e) => setSearch(e.target.value)} />}</Field>
        {res.data?.items.map((d) => <button key={d.id} type="button" onClick={() => { setDrug(d); setSearch(""); }} className="block min-h-10 w-full rounded px-2 text-start text-sm hover:bg-accent">{drugName(d)} {d.strength}</button>)}
        {drug && <p className="text-sm font-medium">{drugName(drug)}</p>}
        <div className="grid grid-cols-2 gap-3"><Field label={t("sup.min")}>{(id) => <Input id={id} type="number" min={0} value={min} onChange={(e) => setMin(e.target.value)} />}</Field><Field label={t("sup.max")}>{(id) => <Input id={id} type="number" min={0} value={max} onChange={(e) => setMax(e.target.value)} />}</Field></div>
        <ErrorNote error={save.error} /><Button type="submit" disabled={!drug || save.isPending}>{t("common.save")}</Button>
      </form>
    </Modal>
  );
}

interface Recall { id: string; drugId: string; lotNumbers: string[]; reason: string; status: string; enteredAt: string; affectedLots: number }
function RecallsTab() {
  const { t } = useTranslation();
  const { can } = useAuth();
  const qc = useQueryClient(); const toast = useToast();
  const list = useQuery({ queryKey: ["recalls"], queryFn: () => api<Recall[]>("/recalls") });
  const [open, setOpen] = useState(false); const [search, setSearch] = useState(""); const [drug, setDrug] = useState<Drug | null>(null); const [lots, setLots] = useState(""); const [reason, setReason] = useState("");
  const res = useQuery({ queryKey: ["recall-search", search], queryFn: () => api<Page<Drug>>("/catalogue/drugs", { query: { q: search, pageSize: 6 } }), enabled: search.length >= 2 });
  const enter = useMutation({ mutationFn: () => api<Recall>("/recalls", { body: { drugId: drug!.id, lotNumbers: lots.split(/[,\s]+/).filter(Boolean), reason } }), onSuccess: (r) => { toast(t("sup.recallBlocked", { count: r.affectedLots })); setOpen(false); setDrug(null); setLots(""); setReason(""); void qc.invalidateQueries(); } });
  const lift = useMutation({ mutationFn: (id: string) => api(`/recalls/${id}/lift`, { method: "POST" }), onSuccess: () => void qc.invalidateQueries() });
  return (
    <Card title={t("sup.recalls")} className="p-0 [&>header]:px-4 [&>header]:pt-4 [&>p]:mx-4" actions={can("recall.manage") && <Button size="sm" variant="danger" onClick={() => setOpen(true)}><ShieldAlert aria-hidden className="size-4" />{t("sup.enterRecall")}</Button>}>
      <p className="mb-3 text-sm text-muted-foreground">{t("sup.recallNote")}</p>
      <ErrorNote error={lift.error} />
      <Table head={[t("common.date"), t("inv.lot"), t("common.reason"), t("sup.affected"), t("common.status"), ""]} empty={!list.data?.length ? <Empty hint={t("sup.recallsEmptyHint")}>{t("sup.noRecalls")}</Empty> : null}>
        {list.data?.map((r) => <tr key={r.id}><Td>{fmtDateTime(r.enteredAt)}</Td><Td className="font-mono text-xs">{r.lotNumbers.join(", ")}</Td><Td>{r.reason}</Td><Td className="kx-num">{r.affectedLots}</Td><Td><StatusChip tone={r.status === "ACTIVE" ? "bad" : "neutral"}>{t(`recallStatus.${r.status}`)}</StatusChip></Td><Td>{can("recall.manage") && r.status === "ACTIVE" && <Button size="sm" variant="outline" onClick={() => lift.mutate(r.id)}>{t("sup.lift")}</Button>}</Td></tr>)}
      </Table>
      <Modal open={open} onClose={() => setOpen(false)} title={t("sup.enterRecall")}>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); enter.mutate(); }}>
          <Field label={t("common.search")}>{(id) => <Input id={id} type="search" value={search} onChange={(e) => setSearch(e.target.value)} />}</Field>
          {res.data?.items.map((d) => <button key={d.id} type="button" onClick={() => { setDrug(d); setSearch(""); }} className="block min-h-10 w-full rounded px-2 text-start text-sm hover:bg-accent">{drugName(d)} {d.strength}</button>)}
          {drug && <p className="text-sm font-medium">{drugName(drug)}</p>}
          <Field label={t("sup.lotNumbers")} hint={t("sup.lotNumbersHint")}>{(id) => <Input id={id} required value={lots} onChange={(e) => setLots(e.target.value)} />}</Field>
          <Field label={t("common.reason")}>{(id) => <Input id={id} required minLength={3} value={reason} onChange={(e) => setReason(e.target.value)} />}</Field>
          <ErrorNote error={enter.error} /><Button type="submit" variant="danger" disabled={!drug || enter.isPending}>{t("sup.blockNow")}</Button>
        </form>
      </Modal>
    </Card>
  );
}

export function Purchasing() {
  const { t } = useTranslation();
  const { can, me } = useAuth();
  const [tab, setTab] = useState("suppliers");
  const lite = me?.tenant.edition === "LITE";
  const tabs = [{ id: "suppliers", label: t("sup.suppliers"), icon: <Truck /> }, ...(!lite ? [{ id: "pos", label: t("sup.pos"), icon: <ClipboardList /> }, { id: "reorder", label: t("sup.reorder"), icon: <Wand2 /> }] : []), { id: "recalls", label: t("sup.recalls"), icon: <AlertTriangle /> }];
  return (
    <>
      <PageHeader title={t("sup.title")} subtitle={t("sup.subtitle")} />
      {lite && <p className="mb-4 rounded-xl border border-primary/20 bg-accent p-3 text-sm text-accent-foreground">{t("sup.liteNote")}</p>}
      <Tabs value={tab} onChange={setTab} tabs={tabs} />
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "suppliers" && can("supplier.read") && <SuppliersTab />}{tab === "pos" && <PosTab />}{tab === "reorder" && <ReorderTab />}{tab === "recalls" && <RecallsTab />}
      </div>
    </>
  );
}
