import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useAction, useForm } from "@/lib/hooks";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, Select, Table, Tabs, Td } from "@/components/ui";
import { WitnessFields, useWitness } from "@/components/witness";
import { drugName, fmtDateTime } from "@/lib/format";
import { download } from "@/lib/print";
import { useToast } from "@/lib/toast";
import type { Page } from "@/lib/types";

interface DrugLite { id: string; brandName: string; brandNameAr: string | null; strength: string; controlledSchedule: string }
interface Bal { branchId: string; drugId: string; drug: DrugLite | null; onHand: number; registerBalance: number; inSync: boolean; lastMovementAt: string | null }
interface Entry { id: string; kind: string; qtyDelta: number; balanceAfter: number; lotNumber: string | null; patientName: string | null; patientIdLast4: string | null; prescriberLicenceNo: string | null; performedByName: string | null; witnessName: string | null; reason: string | null; occurredAt: string; drug: DrugLite | null }
interface Disc { id: string; drug: DrugLite | null; drugId: string; branchId: string; expectedQty: number; countedQty: number; difference: number; status: string; notes: string | null; resolution: string | null; createdAt: string }

function Balances({ onOpen }: { onOpen: (id: string) => void }) {
  const { t } = useTranslation(); const { branchId } = useAuth();
  const q = useQuery({ queryKey: ["ctl-balances", branchId], queryFn: () => api<Bal[]>("/controlled/balances", { query: { branchId } }), enabled: !!branchId });
  return <Table head={[t("ctl.drug"), t("ctl.schedule"), t("ctl.onHand"), t("ctl.registerBalance"), t("common.status"), t("ctl.lastMovement"), ""]} numeric={[2, 3]} empty={!q.data?.length ? <Empty>{t("ctl.noControlled")}</Empty> : null}>
    {q.data?.map((b) => <tr key={`${b.branchId}${b.drugId}`}><Td className="font-medium">{drugName(b.drug)} <bdi className="text-xs text-muted-foreground">{b.drug?.strength}</bdi></Td><Td><Badge tone="bad">{b.drug?.controlledSchedule.replace("SCHEDULE_", "S")}</Badge></Td><Td className="kx-num text-end">{b.onHand}</Td><Td className="kx-num text-end font-semibold">{b.registerBalance}</Td>
      <Td><Badge tone={b.inSync ? "good" : "bad"}>{b.inSync ? t("ctl.inSync") : t("ctl.outOfSync")}</Badge></Td><Td>{fmtDateTime(b.lastMovementAt)}</Td><Td className="text-end"><Button size="sm" variant="outline" onClick={() => onOpen(b.drugId)}>{t("ctl.tabRegister")}</Button></Td></tr>)}</Table>;
}

function Register({ drugId, setDrugId }: { drugId: string; setDrugId: (v: string) => void }) {
  const { t } = useTranslation(); const { branchId } = useAuth(); const toast = useToast();
  const bal = useQuery({ queryKey: ["ctl-balances", branchId], queryFn: () => api<Bal[]>("/controlled/balances", { query: { branchId } }), enabled: !!branchId });
  const q = useQuery({ queryKey: ["ctl-register", branchId, drugId], queryFn: () => api<Page<Entry>>("/controlled/register", { query: { branchId, drugId: drugId || undefined, pageSize: 100 } }), enabled: !!branchId });
  const exp = () => download("/reports/controlled-register", "controlled-register.csv", { format: "csv", branchId: branchId ?? undefined, from: new Date(Date.now() - 365 * 86_400_000).toISOString() }).catch(() => toast(t("errors.network"), "err"));
  return <div className="space-y-3"><div className="flex flex-wrap items-end justify-between gap-3"><Field label={t("ctl.drug")}>{(id) => <Select id={id} value={drugId} onChange={(e) => setDrugId(e.target.value)} className="min-w-64"><option value="">{t("ctl.allDrugs")}</option>{bal.data?.map((b) => <option key={b.drugId} value={b.drugId}>{drugName(b.drug)} {b.drug?.strength}</option>)}</Select>}</Field>
    <Button variant="outline" onClick={() => void exp()}><Download aria-hidden className="size-4" />{t("ctl.exportCsv")}</Button></div>
    <Table dense head={[t("common.date"), t("ctl.drug"), t("ctl.movement"), t("ctl.change"), t("ctl.balance"), t("ctl.patient"), t("ctl.prescriber"), t("ctl.by"), t("ctl.witness")]} numeric={[3, 4]} hideOnPhone={[1, 5, 6, 7]} empty={!q.data?.items.length ? <Empty>{t("ctl.pickDrug")}</Empty> : null}>
      {q.data?.items.map((e) => <tr key={e.id}><Td className="whitespace-nowrap">{fmtDateTime(e.occurredAt)}</Td><Td>{drugName(e.drug)}</Td><Td><Badge tone={e.qtyDelta < 0 ? "warn" : "good"}>{t(`ctl.kind.${e.kind}`)}</Badge>{e.reason && <div className="max-w-48 truncate text-xs text-muted-foreground" title={e.reason}>{e.reason}</div>}</Td>
        <Td className={`kx-num text-end font-medium ${e.qtyDelta < 0 ? "text-[hsl(var(--danger-text))]" : ""}`}>{e.qtyDelta > 0 ? "+" : ""}{e.qtyDelta}</Td><Td className="kx-num text-end font-semibold">{e.balanceAfter}</Td>
        <Td>{e.patientName ?? "—"}{e.patientIdLast4 && <span className="text-xs text-muted-foreground" dir="ltr"> ••{e.patientIdLast4}</span>}</Td><Td dir="ltr" className="text-end text-xs">{e.prescriberLicenceNo ?? "—"}</Td><Td>{e.performedByName ?? "—"}</Td><Td>{e.witnessName ?? "—"}</Td></tr>)}</Table></div>;
}

function Audits() {
  const { t } = useTranslation(); const { branchId, can } = useAuth(); const toast = useToast();
  const bal = useQuery({ queryKey: ["ctl-balances", branchId], queryFn: () => api<Bal[]>("/controlled/balances", { query: { branchId } }), enabled: !!branchId });
  const disc = useQuery({ queryKey: ["ctl-disc"], queryFn: () => api<Disc[]>("/controlled/discrepancies") });
  const [open, setOpen] = useState(false); const [res, setRes] = useState<Disc | null>(null);
  const [f, , bind, reset] = useForm({ drugId: "", countedQty: "", notes: "", resolution: "", adjust: "yes" });
  const aw = useWitness(); const rw = useWitness();
  const audit = useAction(() => api<{ match: boolean; expected: number; difference: number }>("/controlled/audits", { body: { branchId, drugId: f.drugId, countedQty: Number(f.countedQty), notes: f.notes || undefined, witness: aw.value } }), ["ctl-disc", "ctl-balances"], { silent: true, onDone: (r) => { toast(r.match ? t("ctl.auditMatch", { expected: r.expected }) : t("ctl.auditDiff", { diff: r.difference, expected: r.expected }), r.match ? "ok" : "err"); setOpen(false); reset(); aw.reset(); } });
  const lots = useQuery({ queryKey: ["ctl-lots", res?.drugId, branchId], queryFn: () => api<{ items: Array<{ id: string; lotNumber: string; qtyOnHand: number }> }>("/inventory/lots", { query: { branchId, drugId: res!.drugId, pageSize: 50 } }), enabled: !!res });
  const [lot, setLot] = useState("");
  const resolve = useAction(() => api(`/controlled/discrepancies/${res!.id}/resolve`, { body: { resolution: f.resolution, adjustLotId: f.adjust === "yes" ? lot || lots.data?.items[0]?.id : undefined, witness: f.adjust === "yes" ? rw.value : undefined } }), ["ctl-disc", "ctl-balances", "ctl-register"], { onDone: () => { setRes(null); reset(); rw.reset(); } });
  return <div className="space-y-4">
    {can("controlled.manage") && <div className="flex justify-end"><Button onClick={() => setOpen(true)}><Plus aria-hidden className="size-4" />{t("ctl.newAudit")}</Button></div>}
    <Table head={[t("common.date"), t("ctl.drug"), t("ctl.expected"), t("ctl.counted"), t("ctl.difference"), t("common.status"), ""]} numeric={[2, 3, 4]} empty={!disc.data?.length ? <Empty>{t("ctl.noDiscrepancies")}</Empty> : null}>
      {disc.data?.map((d) => <tr key={d.id}><Td>{fmtDateTime(d.createdAt)}</Td><Td className="font-medium">{drugName(d.drug)}</Td><Td className="kx-num text-end">{d.expectedQty}</Td><Td className="kx-num text-end">{d.countedQty}</Td><Td className="kx-num text-end font-semibold text-[hsl(var(--danger-text))]">{d.difference}</Td><Td><Badge tone={d.status === "OPEN" ? "bad" : "good"}>{d.status === "OPEN" ? t("ctl.open") : t("ctl.resolved")}</Badge>{d.resolution && <div className="max-w-56 truncate text-xs text-muted-foreground" title={d.resolution}>{d.resolution}</div>}</Td>
        <Td className="text-end">{d.status === "OPEN" && can("controlled.manage") && <Button size="sm" onClick={() => setRes(d)}>{t("ctl.resolve")}</Button>}</Td></tr>)}</Table>
    <Modal open={open} onClose={() => setOpen(false)} title={t("ctl.newAudit")}><form className="space-y-3" onSubmit={(e) => { e.preventDefault(); audit.mutate(); }}>
      <Field label={t("ctl.drug")}>{(id) => <Select id={id} required {...bind("drugId")}><option value="">—</option>{bal.data?.map((b) => <option key={b.drugId} value={b.drugId}>{drugName(b.drug)} {b.drug?.strength}</option>)}</Select>}</Field>
      <Field label={t("ctl.countedQty")}>{(id) => <Input id={id} type="number" min={0} required {...bind("countedQty")} />}</Field><Field label={t("ctl.auditNotes")}>{(id) => <Input id={id} {...bind("notes")} />}</Field>
      <WitnessFields w={aw.w} setW={aw.setW} required /><ErrorNote error={audit.error} /><Button type="submit" disabled={audit.isPending}>{t("common.save")}</Button></form></Modal>
    <Modal open={!!res} onClose={() => setRes(null)} title={t("ctl.resolve")}><form className="space-y-3" onSubmit={(e) => { e.preventDefault(); resolve.mutate(); }}>
      <Field label={t("ctl.resolution")}>{(id) => <Input id={id} required minLength={5} {...bind("resolution")} />}</Field>
      <Field label={t("ctl.adjustLot")}>{(id) => <Select id={id} {...bind("adjust")}><option value="yes">{t("common.confirm")}</option><option value="no">—</option></Select>}</Field>
      {f.adjust === "yes" && <><Field label={t("inv.lot")}>{(id) => <Select id={id} value={lot} onChange={(e) => setLot(e.target.value)}>{lots.data?.items.map((l) => <option key={l.id} value={l.id}>{l.lotNumber} · {l.qtyOnHand}</option>)}</Select>}</Field><WitnessFields w={rw.w} setW={rw.setW} required /></>}
      <ErrorNote error={resolve.error} /><Button type="submit" disabled={resolve.isPending}>{t("ctl.resolve")}</Button></form></Modal></div>;
}

export function Controlled() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("balances"); const [drugId, setDrugId] = useState("");
  return (<><PageHeader title={t("ctl.title")} subtitle={t("ctl.subtitle")} />
    <Tabs value={tab} onChange={setTab} tabs={[{ id: "balances", label: t("ctl.tabBalances") }, { id: "register", label: t("ctl.tabRegister") }, { id: "audits", label: t("ctl.tabAudits") }]} />
    <Card className="mt-3">{tab === "balances" ? <Balances onOpen={(id) => { setDrugId(id); setTab("register"); }} /> : tab === "register" ? <Register drugId={drugId} setDrugId={setDrugId} /> : <Audits />}</Card></>);
}
