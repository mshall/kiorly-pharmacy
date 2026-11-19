import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, Select, Spinner, Table, Tabs, Td } from "@/components/ui";
import { drugName, fmtDate, fmtDateTime, fmtMoney } from "@/lib/format";
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
    <Card title={t("sup.suppliers")} actions={can("supplier.write") && <Button size="sm" onClick={() => setAdd(true)}>{t("sup.add")}</Button>}>
      <Table head={[t("sup.name"), t("sup.terms"), t("sup.creditLimit"), t("sup.balance"), ""]} empty={!list.data?.length ? <Empty>{t("common.none")}</Empty> : null}>
        {list.data?.map((s) => <tr key={s.id}><Td className="font-medium">{s.name}<div className="text-xs text-muted-foreground">{s.phone}</div></Td><Td>{s.paymentTerms ?? "—"}</Td><Td>{s.creditLimit ? fmtMoney(s.creditLimit) : "—"}</Td><Td className="font-semibold">{fmtMoney(s.balance)}</Td><Td><Button size="sm" variant="outline" onClick={() => setSel(s)}>{t("sup.ledger")}</Button></Td></tr>)}
      </Table>
      <Modal open={add} onClose={() => setAdd(false)} title={t("sup.add")}>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
          {(["name", "phone", "email", "paymentTerms", "creditLimit"] as const).map((k) => <Field key={k} label={t(`sup.${k}`)}>{(id) => <Input id={id} required={k === "name"} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />}</Field>)}
          <ErrorNote error={create.error} /><Button type="submit">{t("common.save")}</Button>
        </form>
      </Modal>
      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.name ?? ""} wide>
        {sel && <div className="space-y-3">
          <p className="text-lg font-semibold">{t("sup.balance")}: {fmtMoney(sel.balance)}</p>
          {can("supplier.write") && <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); pay.mutate(); }}><Field label={t("sup.payment")}>{(id) => <Input id={id} inputMode="decimal" required value={amount} onChange={(e) => setAmount(e.target.value)} />}</Field><Button type="submit" disabled={pay.isPending}>{t("sup.pay")}</Button></form>}
          <ErrorNote error={pay.error} />
          <Table head={[t("common.date"), t("common.type"), t("sup.amount"), t("common.note")]}>{ledger.data?.map((e) => <tr key={e.id}><Td>{fmtDateTime(e.createdAt)}</Td><Td>{t(`ledger.${e.type}`)}</Td><Td className={Number(e.amount) < 0 ? "text-[hsl(var(--success))]" : ""}>{fmtMoney(e.amount)}</Td><Td>{e.note ?? ""}</Td></tr>)}</Table>
        </div>}
      </Modal>
    </Card>
  );
}

function PosTab() {
  const { t } = useTranslation();
  const { can } = useAuth();
  const qc = useQueryClient(); const toast = useToast();
  const res = useQuery({ queryKey: ["purchase-orders"], queryFn: () => api<Po[]>("/purchase-orders") });
  const act = useMutation({ mutationFn: (v: { id: string; kind: "send" | "cancel"; via?: string }) => api(`/purchase-orders/${v.id}/${v.kind}`, { body: v.via ? { via: v.via } : {} }), onSuccess: () => { toast(t("common.saved")); void qc.invalidateQueries({ queryKey: ["purchase-orders"] }); } });
  return (
    <Card title={t("sup.pos")}>
      <ErrorNote error={res.error || act.error} />
      <Table head={["#", t("sup.name"), t("common.status"), t("sup.total"), t("common.date"), ""]} empty={!res.data?.length ? <Empty>{t("common.none")}</Empty> : null}>
        {res.data?.map((p) => <tr key={p.id}><Td className="font-mono text-xs">{p.poNumber}</Td><Td>{p.supplier?.name}</Td><Td><Badge tone={p.status === "RECEIVED" ? "good" : p.status === "CANCELLED" ? "bad" : "info"}>{t(`poStatus.${p.status}`)}</Badge></Td><Td>{fmtMoney(p.totalCost)}</Td><Td>{fmtDate(p.createdAt)}</Td>
          <Td>{can("po.write") && p.status === "DRAFT" && <div className="flex gap-1"><Button size="sm" onClick={() => act.mutate({ id: p.id, kind: "send", via: "WHATSAPP" })}>{t("sup.sendWhatsapp")}</Button><Button size="sm" variant="outline" onClick={() => act.mutate({ id: p.id, kind: "send", via: "EMAIL" })}>{t("sup.sendEmail")}</Button><Button size="sm" variant="ghost" onClick={() => act.mutate({ id: p.id, kind: "cancel" })}>{t("common.cancel")}</Button></div>}</Td></tr>)}
      </Table>
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
    <Card title={t("sup.reorder")} actions={sug.data && <Badge tone={sug.data.method === "FORECAST" ? "info" : "neutral"}>{sug.data.method === "FORECAST" ? t("sup.methodForecast") : t("sup.methodMinMax")}</Badge>}>
      <ErrorNote error={sug.error || create.error} />
      {sug.isLoading ? <Spinner /> : (
        <Table head={["", t("common.product"), t("sup.position"), t("inv.minMax"), t("sup.suggested"), t("rcv.supplier")]} empty={!sug.data?.items.length ? <Empty>{t("sup.noReorder")}</Empty> : null}>
          {sug.data?.items.map((i) => <tr key={i.drugId}><Td><input type="checkbox" aria-label={drugName(i)} checked={!!pick[i.drugId]} onChange={(e) => setPick({ ...pick, [i.drugId]: e.target.checked })} /></Td>
            <Td className="font-medium">{drugName(i)}{i.forecast && <div className="text-xs text-muted-foreground">{i.forecast.explanation}</div>}</Td><Td>{i.position}</Td><Td>{i.minQty} / {i.maxQty}</Td><Td className="font-semibold">{i.suggestedQty} <Badge>{i.method === "FORECAST" ? t("sup.methodForecast") : t("sup.methodMinMax")}</Badge></Td>
            <Td><Select aria-label={t("rcv.supplier")} value={sup[i.drugId] ?? i.supplierId ?? ""} onChange={(e) => setSup({ ...sup, [i.drugId]: e.target.value })}><option value="">—</option>{suppliers.data?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></Td></tr>)}
        </Table>
      )}
      <div className="mt-3 flex gap-2">
        {can("po.write") && <Button disabled={!Object.values(pick).some(Boolean) || create.isPending} onClick={() => create.mutate()}>{t("sup.createPos")}</Button>}
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
    <Card title={t("sup.recalls")} actions={can("recall.manage") && <Button size="sm" variant="danger" onClick={() => setOpen(true)}>{t("sup.enterRecall")}</Button>}>
      <p className="mb-3 text-sm text-muted-foreground">{t("sup.recallNote")}</p>
      <ErrorNote error={lift.error} />
      <Table head={[t("common.date"), t("inv.lot"), t("common.reason"), t("sup.affected"), t("common.status"), ""]} empty={!list.data?.length ? <Empty>{t("common.none")}</Empty> : null}>
        {list.data?.map((r) => <tr key={r.id}><Td>{fmtDateTime(r.enteredAt)}</Td><Td className="font-mono text-xs">{r.lotNumbers.join(", ")}</Td><Td>{r.reason}</Td><Td>{r.affectedLots}</Td><Td><Badge tone={r.status === "ACTIVE" ? "bad" : "neutral"}>{t(`recallStatus.${r.status}`)}</Badge></Td><Td>{can("recall.manage") && r.status === "ACTIVE" && <Button size="sm" variant="outline" onClick={() => lift.mutate(r.id)}>{t("sup.lift")}</Button>}</Td></tr>)}
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
  const tabs = [{ id: "suppliers", label: t("sup.suppliers") }, ...(!lite ? [{ id: "pos", label: t("sup.pos") }, { id: "reorder", label: t("sup.reorder") }] : []), { id: "recalls", label: t("sup.recalls") }];
  return (
    <>
      <PageHeader title={t("sup.title")} />
      {lite && <p className="mb-3 rounded-md bg-accent p-3 text-sm">{t("sup.liteNote")}</p>}
      <Tabs value={tab} onChange={setTab} tabs={tabs} />
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "suppliers" && can("supplier.read") && <SuppliersTab />}{tab === "pos" && <PosTab />}{tab === "reorder" && <ReorderTab />}{tab === "recalls" && <RecallsTab />}
      </div>
    </>
  );
}
