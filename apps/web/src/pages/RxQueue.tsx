import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Printer, RefreshCw } from "lucide-react";
import { api, newKey } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useAction, useForm } from "@/lib/hooks";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, SearchInput, Select, Spinner, Table, Tabs, Td, type Tone } from "@/components/ui";
import { CustomerPicker, DrugPicker, PrescriberPicker, type PrescriberLite } from "@/components/pickers";
import { StatusChip } from "@/brand/ui-kit";
import { drugName, fmtDate, fmtDateTime } from "@/lib/format";
import { printHtml } from "@/lib/print";
import { useToast } from "@/lib/toast";
import type { Customer, Drug, Page, Rx } from "@/lib/types";

export const RX_TONE: Record<string, Tone> = { RECEIVED: "info", VALIDATING: "warn", VALIDATED: "good", PARTIALLY_DISPENSED: "warn", DISPENSED: "neutral", REJECTED: "bad", CANCELLED: "neutral", EXPIRED: "bad", TRANSFERRED_OUT: "neutral" };

interface NewLine { key: string; drug: Drug; quantity: string; directions: string }
const csv = (s: string) => s.split(/[,،]/).map((x) => x.trim()).filter(Boolean);

export function NewRx({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const { branchId } = useAuth();
  const nav = useNavigate();
  const [cust, setCust] = useState<Customer | null>(null); const [presc, setPresc] = useState<PrescriberLite | null>(null);
  const [f, , bind] = useForm({ displayName: "", phone: "", allergies: "", prescriberName: "", prescriberLicenceNo: "", issuedAt: new Date().toISOString().slice(0, 10), validDays: "30", refillsAllowed: "0", refillIntervalDays: "30", priority: "NORMAL" });
  const [lines, setLines] = useState<NewLine[]>([]); const [scan, setScan] = useState<string | undefined>();
  const m = useAction(() => api<Rx>("/prescriptions/manual", { body: {
    branchId, ...(cust ? { patientId: cust.id } : { patient: { displayName: f.displayName, phone: f.phone || undefined, allergies: csv(f.allergies) } }),
    ...(presc ? { prescriberId: presc.id } : { prescriberName: f.prescriberName, prescriberLicenceNo: f.prescriberLicenceNo || undefined }),
    issuedAt: new Date(f.issuedAt).toISOString(), validDays: Number(f.validDays), refillsAllowed: Number(f.refillsAllowed), refillIntervalDays: Number(f.refillsAllowed) > 0 ? Number(f.refillIntervalDays) : undefined, priority: f.priority, scanDataUrl: scan,
    lines: lines.map((l) => ({ drugId: l.drug.id, quantity: Number(l.quantity), directions: l.directions || undefined })) } }),
  ["rx-list", "rx-queue", "customers", "prescribers"], { onDone: (r) => { onClose(); nav(`/rx/${r.id}`); } });
  const onFile = (file: File | undefined) => { if (!file) return setScan(undefined); const fr = new FileReader(); fr.onload = () => setScan(String(fr.result)); fr.readAsDataURL(file); };
  const setLine = (k: string, p: Partial<NewLine>) => setLines(lines.map((x) => (x.key === k ? { ...x, ...p } : x)));
  return (
    <Modal open={open} onClose={onClose} title={t("rx.newManual")} wide>
      <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="space-y-5">
        <section className="space-y-3"><h3 className="text-sm font-semibold">{t("rx.customer")}</h3><CustomerPicker value={cust} onChange={setCust} />
          {!cust && <div className="grid gap-3 sm:grid-cols-3"><Field label={t("rx.patientName")}>{(id) => <Input id={id} required minLength={2} {...bind("displayName")} />}</Field><Field label={t("rx.patientPhone")}>{(id) => <Input id={id} inputMode="tel" dir="ltr" {...bind("phone")} />}</Field><Field label={t("rx.allergies")} hint={t("rx.allergiesHint")}>{(id) => <Input id={id} {...bind("allergies")} />}</Field></div>}</section>
        <section className="space-y-3"><h3 className="text-sm font-semibold">{t("rx.prescriber")}</h3><PrescriberPicker value={presc} onChange={setPresc} />
          {!presc && <div className="grid gap-3 sm:grid-cols-2"><Field label={t("rx.newPrescriber")}>{(id) => <Input id={id} required minLength={2} {...bind("prescriberName")} />}</Field><Field label={t("rx.prescriberLicence")}>{(id) => <Input id={id} dir="ltr" {...bind("prescriberLicenceNo")} />}</Field></div>}</section>
        <section className="grid gap-3 sm:grid-cols-5">
          <Field label={t("rx.issuedAt")}>{(id) => <Input id={id} type="date" required max={new Date().toISOString().slice(0, 10)} {...bind("issuedAt")} />}</Field>
          <Field label={t("rx.validDays")}>{(id) => <Input id={id} type="number" min={1} max={365} {...bind("validDays")} />}</Field>
          <Field label={t("rx.refillsAllowed")}>{(id) => <Input id={id} type="number" min={0} max={12} {...bind("refillsAllowed")} />}</Field>
          <Field label={t("rx.refillInterval")}>{(id) => <Input id={id} type="number" min={1} max={180} disabled={Number(f.refillsAllowed) === 0} {...bind("refillIntervalDays")} />}</Field>
          <Field label={t("rx.priority")}>{(id) => <Select id={id} {...bind("priority")}><option value="NORMAL">{t("rx.normal")}</option><option value="URGENT">{t("rx.urgent")}</option></Select>}</Field>
        </section>
        <Field label={t("rx.scan")}>{(id) => <input id={id} type="file" accept="image/*,application/pdf" onChange={(e) => onFile(e.target.files?.[0])} className="min-h-10 text-sm" />}</Field>
        <section className="space-y-2"><DrugPicker label={t("rx.addDrug")} onPick={(d) => setLines([...lines, { key: newKey(), drug: d, quantity: "1", directions: "" }])} />
          <Table head={[t("common.product"), t("inv.qty"), t("rx.directions"), ""]} empty={!lines.length ? <Empty>{t("rx.noLines")}</Empty> : null}>
            {lines.map((l) => <tr key={l.key}><Td className="font-medium">{drugName(l.drug)} <bdi className="text-xs text-muted-foreground">{l.drug.strength}</bdi>{l.drug.controlledSchedule !== "NONE" && <span className="ms-2"><Badge tone="bad">{t("cat.controlled")}</Badge></span>}</Td>
              <Td><Input aria-label={t("inv.qty")} type="number" min={1} value={l.quantity} onChange={(e) => setLine(l.key, { quantity: e.target.value })} className="w-20" /></Td>
              <Td><Input aria-label={t("rx.directions")} value={l.directions} onChange={(e) => setLine(l.key, { directions: e.target.value })} /></Td>
              <Td><Button type="button" size="sm" variant="ghost" aria-label={t("common.remove")} onClick={() => setLines(lines.filter((x) => x.key !== l.key))}>✕</Button></Td></tr>)}</Table></section>
        <ErrorNote error={m.error} />
        <Button type="submit" disabled={!lines.length || m.isPending}>{t("rx.create")}</Button>
      </form>
    </Modal>
  );
}

function TransferInModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const { branchId } = useAuth(); const nav = useNavigate();
  const [cust, setCust] = useState<Customer | null>(null);
  const [f, , bind] = useForm({ cpName: "", cpPhone: "", cpPharmacist: "", originalRef: "", displayName: "", phone: "", prescriberName: "", prescriberLicenceNo: "", issuedAt: new Date().toISOString().slice(0, 10), refillsAllowed: "0" });
  const [lines, setLines] = useState<NewLine[]>([]);
  const m = useAction(() => api<{ prescription: Rx }>("/prescriptions/transfer-in", { body: { branchId, counterparty: { name: f.cpName, phone: f.cpPhone || undefined, pharmacist: f.cpPharmacist || undefined }, originalRef: f.originalRef || undefined,
    ...(cust ? { patientId: cust.id } : { patient: { displayName: f.displayName, phone: f.phone || undefined } }), prescriberName: f.prescriberName, prescriberLicenceNo: f.prescriberLicenceNo || undefined, issuedAt: new Date(f.issuedAt).toISOString(), refillsAllowed: Number(f.refillsAllowed),
    lines: lines.map((l) => ({ drugId: l.drug.id, quantity: Number(l.quantity), directions: l.directions || undefined })) } }), ["rx-list", "rx-queue", "rx-transfers"], { onDone: (r) => { onClose(); nav(`/rx/${r.prescription.id}`); } });
  return (
    <Modal open={open} onClose={onClose} title={t("rx.transferIn")} wide>
      <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-4"><Field label={t("rx.transferFrom")}>{(id) => <Input id={id} required minLength={2} {...bind("cpName")} />}</Field><Field label={t("rx.pharmacistName")}>{(id) => <Input id={id} {...bind("cpPharmacist")} />}</Field><Field label={t("rx.patientPhone")}>{(id) => <Input id={id} dir="ltr" {...bind("cpPhone")} />}</Field><Field label={t("rx.originalRef")}>{(id) => <Input id={id} {...bind("originalRef")} />}</Field></div>
        <CustomerPicker value={cust} onChange={setCust} />
        {!cust && <div className="grid gap-3 sm:grid-cols-2"><Field label={t("rx.patientName")}>{(id) => <Input id={id} required minLength={2} {...bind("displayName")} />}</Field><Field label={t("rx.patientPhone")}>{(id) => <Input id={id} dir="ltr" {...bind("phone")} />}</Field></div>}
        <div className="grid gap-3 sm:grid-cols-4"><Field label={t("rx.prescriber")}>{(id) => <Input id={id} required minLength={2} {...bind("prescriberName")} />}</Field><Field label={t("rx.prescriberLicence")}>{(id) => <Input id={id} {...bind("prescriberLicenceNo")} />}</Field><Field label={t("rx.issuedAt")}>{(id) => <Input id={id} type="date" required {...bind("issuedAt")} />}</Field><Field label={t("rx.refillsAllowed")}>{(id) => <Input id={id} type="number" min={0} max={12} {...bind("refillsAllowed")} />}</Field></div>
        <DrugPicker label={t("rx.addDrug")} onPick={(d) => setLines([...lines, { key: newKey(), drug: d, quantity: "1", directions: "" }])} />
        <Table head={[t("common.product"), t("inv.qty"), t("rx.directions"), ""]} empty={!lines.length ? <Empty>{t("rx.noLines")}</Empty> : null}>{lines.map((l) => <tr key={l.key}><Td>{drugName(l.drug)}</Td><Td><Input aria-label={t("inv.qty")} type="number" min={1} className="w-20" value={l.quantity} onChange={(e) => setLines(lines.map((x) => (x.key === l.key ? { ...x, quantity: e.target.value } : x)))} /></Td><Td><Input aria-label={t("rx.directions")} value={l.directions} onChange={(e) => setLines(lines.map((x) => (x.key === l.key ? { ...x, directions: e.target.value } : x)))} /></Td><Td><Button type="button" size="sm" variant="ghost" onClick={() => setLines(lines.filter((x) => x.key !== l.key))}>✕</Button></Td></tr>)}</Table>
        <ErrorNote error={m.error} /><Button type="submit" disabled={!lines.length || m.isPending}>{t("common.save")}</Button>
      </form>
    </Modal>
  );
}

interface QueueItem { id: string; status: string; priority: string; source: string; ageMinutes: number; patient: { displayName: string } | null; prescriberName: string | null; prescriberVerified: boolean; lines: number; controlled: boolean; hasAllergyOnFile: boolean; expiresInDays: number | null; refillsAllowed: number }
const ageText = (m: number, t: (k: string, o?: Record<string, unknown>) => string) => (m < 90 ? t("rx.ageMin", { count: m }) : t("rx.ageHours", { count: Math.round(m / 60) }));

function VerificationTab() {
  const { t } = useTranslation(); const nav = useNavigate(); const { branchId } = useAuth();
  const q = useQuery({ queryKey: ["rx-queue", branchId], queryFn: () => api<{ total: number; urgent: number; items: QueueItem[] }>("/prescriptions/verification-queue", { query: { branchId } }), enabled: !!branchId, refetchInterval: 20_000 });
  if (q.isLoading) return <Spinner />;
  return <Table head={[t("rx.patient"), t("rx.prescriber"), t("rx.source"), t("rx.items"), t("rx.priority"), t("rx.age"), ""]} numeric={[3]} empty={!q.data?.items.length ? <Empty>{t("rx.queueEmpty")}</Empty> : null}>
    {q.data?.items.map((r) => <tr key={r.id} className={r.priority === "URGENT" ? "bg-[hsl(var(--danger-text)/0.05)]" : undefined}>
      <Td className="font-medium">{r.patient?.displayName ?? "—"} {r.hasAllergyOnFile && <Badge tone="warn">{t("rx.allergies")}</Badge>}</Td><Td>{r.prescriberName ?? "—"} {r.prescriberVerified && <span title={t("rx.verified")}>✔</span>}</Td>
      <Td><Badge tone="info">{t(`rxSource.${r.source}`)}</Badge></Td><Td className="kx-num text-end">{r.lines} {r.controlled && <Badge tone="bad">{t("rx.hasControlled")}</Badge>}</Td>
      <Td>{r.priority === "URGENT" ? <StatusChip tone="bad">{t("rx.urgent")}</StatusChip> : t("rx.normal")}</Td><Td className="kx-num">{ageText(r.ageMinutes, t as never)}</Td><Td className="text-end"><Button size="sm" onClick={() => nav(`/rx/${r.id}`)}>{t("rx.review")}</Button></Td></tr>)}</Table>;
}

function AllTab() {
  const { t } = useTranslation(); const nav = useNavigate(); const { branchId } = useAuth();
  const [status, setStatus] = useState(""); const [q, setQ] = useState("");
  const res = useQuery({ queryKey: ["rx-list", branchId, status, q], queryFn: () => api<Page<Rx>>("/prescriptions", { query: { branchId, status, q: q || undefined, pageSize: 50 } }), enabled: !!branchId, refetchInterval: 20_000 });
  return <div className="space-y-3"><div className="flex flex-wrap items-end gap-3"><SearchInput label={t("rx.search")} placeholder={t("rx.search")} value={q} onChange={(e) => setQ(e.target.value)} className="min-w-64 flex-1" /><Field label={t("common.status")}>{(id) => <Select id={id} value={status} onChange={(e) => setStatus(e.target.value)}><option value="">{t("common.all")}</option>{Object.keys(RX_TONE).map((s) => <option key={s} value={s}>{t(`rxStatus.${s}`)}</option>)}</Select>}</Field></div>
    <ErrorNote error={res.error} />
    {res.isLoading ? <Spinner /> : <Table head={[t("rx.patient"), t("rx.source"), t("rx.prescriber"), t("rx.items"), t("common.status"), t("rx.received"), ""]} empty={!res.data?.items.length ? <Empty>{t("rx.empty")}</Empty> : null}>
      {res.data?.items.map((r) => <tr key={r.id}><Td className="font-medium">{r.patient?.displayName ?? "—"}</Td><Td><Badge tone="info">{t(`rxSource.${r.source}`)}</Badge></Td><Td>{r.prescriberName ?? "—"}{r.prescriberVerifiedBadge && <span className="ms-1" title={t("rx.verified")}>✔</span>}</Td><Td>{r.lines.length}</Td><Td><Badge tone={RX_TONE[r.status] ?? "neutral"}>{t(`rxStatus.${r.status}`)}</Badge></Td><Td>{fmtDateTime(r.receivedAt)}</Td><Td><Button size="sm" variant="outline" onClick={() => nav(`/rx/${r.id}`)}>{t("common.open")}</Button></Td></tr>)}</Table>}</div>;
}

function RefillsTab() {
  const { t } = useTranslation(); const nav = useNavigate(); const { branchId, can } = useAuth(); const toast = useToast();
  const q = useQuery({ queryKey: ["rx-refills", branchId], queryFn: () => api<Array<{ id: string; patient: { displayName: string; phone: string | null } | null; dueAt: string; overdueDays: number; refillsLeft: number; items: string[]; reminded: boolean; canRemind: boolean }>>("/prescriptions/refills/due", { query: { days: 14, branchId } }), enabled: !!branchId });
  const run = useAction(() => api<{ sent: number; skipped: number }>("/prescriptions/refills/reminders/run?days=14", { method: "POST" }), ["rx-refills"], { silent: true, onDone: (r) => toast(t("rx.remindersResult", { sent: r.sent, skipped: r.skipped })) });
  return <div className="space-y-3">{can("rx.refill") && <div className="flex justify-end"><Button variant="outline" onClick={() => run.mutate()} disabled={run.isPending}><RefreshCw aria-hidden className="size-4" />{t("rx.remind")}</Button></div>}
    <Table head={[t("rx.patient"), t("rx.items"), t("rx.dueOn"), t("rx.refills"), ""]} empty={!q.data?.length ? <Empty>{t("rx.refillsEmpty")}</Empty> : null}>
      {q.data?.map((r) => <tr key={r.id}><Td className="font-medium">{r.patient?.displayName}<div className="text-xs text-muted-foreground" dir="ltr">{r.patient?.phone}</div></Td><Td>{r.items.join(", ")}</Td><Td>{fmtDate(r.dueAt)} {r.overdueDays > 0 && <Badge tone="bad">{t("rx.overdue", { count: r.overdueDays })}</Badge>}</Td>
        <Td>{t("rx.refillsLeft", { count: r.refillsLeft })} {r.reminded ? <Badge tone="good">{t("rx.reminded")}</Badge> : !r.canRemind && <Badge tone="neutral">{t("rx.noConsent")}</Badge>}</Td><Td className="text-end"><Button size="sm" variant="outline" onClick={() => nav(`/rx/${r.id}`)}>{t("common.open")}</Button></Td></tr>)}</Table></div>;
}

function PartialTab() {
  const { t } = useTranslation(); const nav = useNavigate(); const { branchId } = useAuth();
  const q = useQuery({ queryKey: ["rx-partial", branchId], queryFn: () => api<Array<{ id: string; patient: { displayName: string; phone: string | null } | null; receivedAt: string; validUntil: string | null; owed: number }>>("/prescriptions/partial", { query: { branchId } }), enabled: !!branchId });
  return <Table head={[t("rx.patient"), t("rx.received"), t("rx.validUntil"), t("rx.owed"), ""]} numeric={[3]} empty={!q.data?.length ? <Empty>{t("rx.partialEmpty")}</Empty> : null}>
    {q.data?.map((r) => <tr key={r.id}><Td className="font-medium">{r.patient?.displayName}</Td><Td>{fmtDate(r.receivedAt)}</Td><Td>{fmtDate(r.validUntil)}</Td><Td className="kx-num text-end font-semibold">{r.owed}</Td><Td className="text-end"><Button size="sm" onClick={() => nav(`/rx/${r.id}`)}>{t("common.open")}</Button></Td></tr>)}</Table>;
}

function TransfersTab() {
  const { t } = useTranslation(); const nav = useNavigate(); const { can } = useAuth(); const [dir, setDir] = useState(""); const [open, setOpen] = useState(false);
  const q = useQuery({ queryKey: ["rx-transfers", dir], queryFn: () => api<Page<{ id: string; direction: string; prescriptionId: string; counterpartyName: string; reason: string | null; createdAt: string }>>("/prescriptions/transfers", { query: { direction: dir || undefined } }) });
  return <div className="space-y-3"><div className="flex flex-wrap items-end justify-between gap-3"><Field label={t("rx.direction")}>{(id) => <Select id={id} value={dir} onChange={(e) => setDir(e.target.value)}><option value="">{t("common.all")}</option><option value="IN">{t("rx.dirIN")}</option><option value="OUT">{t("rx.dirOUT")}</option></Select>}</Field>{can("rx.transfer") && <Button onClick={() => setOpen(true)}><Plus aria-hidden className="size-4" />{t("rx.transferIn")}</Button>}</div>
    <Table head={[t("common.date"), t("rx.direction"), t("rx.counterparty"), t("common.reason"), ""]} empty={!q.data?.items.length ? <Empty>{t("rx.transfersEmpty")}</Empty> : null}>
      {q.data?.items.map((r) => <tr key={r.id}><Td>{fmtDateTime(r.createdAt)}</Td><Td><Badge tone={r.direction === "IN" ? "info" : "neutral"}>{t(`rx.dir${r.direction}`)}</Badge></Td><Td className="font-medium">{r.counterpartyName}</Td><Td>{r.reason ?? "—"}</Td>
        <Td className="text-end"><Button size="sm" variant="outline" onClick={() => nav(`/rx/${r.prescriptionId}`)}>{t("common.open")}</Button> <Button size="sm" variant="ghost" aria-label={t("rx.transferNote")} onClick={() => void printHtml(`/prescriptions/transfers/${r.id}/note.html`, { lang: document.documentElement.lang })}><Printer aria-hidden className="size-4" /></Button></Td></tr>)}</Table>
    <TransferInModal open={open} onClose={() => setOpen(false)} /></div>;
}

interface PrescriberRow extends PrescriberLite { nameAr: string | null; phone: string | null; clinicName: string | null; prescriptions: number; verifiedAt: string | null }
function PrescribersTab() {
  const { t } = useTranslation(); const { can } = useAuth(); const [q, setQ] = useState(""); const [open, setOpen] = useState(false);
  const list = useQuery({ queryKey: ["prescribers", q], queryFn: () => api<Page<PrescriberRow>>("/prescribers", { query: { q: q || undefined, pageSize: 50 } }) });
  const verify = useAction((v: { id: string; verified: boolean }) => api(`/prescribers/${v.id}/verify`, { body: { verified: v.verified } }), ["prescribers"]);
  const [f, , bind, reset] = useForm({ name: "", licenceNo: "", specialty: "", phone: "", clinicName: "" });
  const add = useAction(() => api("/prescribers", { body: { ...f, specialty: f.specialty || undefined, phone: f.phone || undefined, clinicName: f.clinicName || undefined } }), ["prescribers"], { onDone: () => { reset(); setOpen(false); } });
  return <div className="space-y-3"><div className="flex flex-wrap items-center gap-3"><SearchInput label={t("common.search")} placeholder={t("common.search")} value={q} onChange={(e) => setQ(e.target.value)} className="min-w-64 flex-1" /><Button onClick={() => setOpen(true)}><Plus aria-hidden className="size-4" />{t("rx.addPrescriber")}</Button></div>
    <Table head={[t("sup.name"), t("rx.licenceNo"), t("rx.specialty"), t("rx.clinic"), t("rx.prescriberRx"), t("common.status"), ""]} numeric={[4]} empty={!list.data?.items.length ? <Empty>{t("rx.prescribersEmpty")}</Empty> : null}>
      {list.data?.items.map((p) => <tr key={p.id}><Td className="font-medium">{p.name}</Td><Td dir="ltr" className="text-end font-mono text-xs">{p.licenceNo}</Td><Td>{p.specialty ?? "—"}</Td><Td>{p.clinicName ?? "—"}</Td><Td className="kx-num text-end">{p.prescriptions}</Td><Td><Badge tone={p.verified ? "good" : "neutral"}>{p.verified ? t("rx.verifiedBy") : t("rx.unverified")}</Badge></Td>
        <Td className="text-end">{can("prescriber.manage") && <Button size="sm" variant="outline" onClick={() => verify.mutate({ id: p.id, verified: !p.verified })}>{p.verified ? t("rx.unverify") : t("rx.verifyLicence")}</Button>}</Td></tr>)}</Table>
    <Modal open={open} onClose={() => setOpen(false)} title={t("rx.addPrescriber")}><form className="space-y-3" onSubmit={(e) => { e.preventDefault(); add.mutate(); }}>
      <Field label={t("sup.name")}>{(id) => <Input id={id} required minLength={2} {...bind("name")} />}</Field><Field label={t("rx.licenceNo")}>{(id) => <Input id={id} required minLength={3} dir="ltr" {...bind("licenceNo")} />}</Field>
      <Field label={t("rx.specialty")}>{(id) => <Input id={id} {...bind("specialty")} />}</Field><Field label={t("rx.clinic")}>{(id) => <Input id={id} {...bind("clinicName")} />}</Field><Field label={t("sup.phone")}>{(id) => <Input id={id} dir="ltr" {...bind("phone")} />}</Field>
      <ErrorNote error={add.error} /><Button type="submit" disabled={add.isPending}>{t("common.save")}</Button></form></Modal></div>;
}

export function RxQueue() {
  const { t } = useTranslation();
  const { can } = useAuth();
  const [tab, setTab] = useState("queue"); const [add, setAdd] = useState(false);
  const counts = useQuery({ queryKey: ["rx-queue", "count"], queryFn: () => api<{ total: number }>("/prescriptions/verification-queue"), refetchInterval: 30_000 });
  return (
    <>
      <PageHeader title={t("rx.title")} subtitle={t("rx.subtitle")} actions={can("rx.intake") && <Button onClick={() => setAdd(true)}><Plus aria-hidden className="size-4" />{t("rx.newManual")}</Button>} />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: "queue", label: t("rx.tabQueue"), count: counts.data?.total }, { id: "all", label: t("rx.tabAll") }, { id: "refills", label: t("rx.tabRefills") }, { id: "partial", label: t("rx.tabPartial") }, { id: "transfers", label: t("rx.tabTransfers") }, { id: "prescribers", label: t("rx.tabPrescribers") }]} />
      <Card className="mt-3">{tab === "queue" ? <VerificationTab /> : tab === "all" ? <AllTab /> : tab === "refills" ? <RefillsTab /> : tab === "partial" ? <PartialTab /> : tab === "transfers" ? <TransfersTab /> : <PrescribersTab />}</Card>
      <NewRx open={add} onClose={() => setAdd(false)} />
    </>
  );
}
