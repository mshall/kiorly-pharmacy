import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api, newKey } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, Select, Spinner, Table, Td, type Tone } from "@/components/ui";
import { drugName, fmtDateTime } from "@/lib/format";
import type { Drug, Page, Rx } from "@/lib/types";

export const RX_TONE: Record<string, Tone> = { RECEIVED: "info", VALIDATING: "warn", VALIDATED: "good", PARTIALLY_DISPENSED: "warn", DISPENSED: "neutral", REJECTED: "bad", CANCELLED: "neutral", EXPIRED: "bad" };

interface NewLine { key: string; drug: Drug; quantity: string; directions: string }
function NewRx({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const { branchId } = useAuth();
  const nav = useNavigate(); const qc = useQueryClient();
  const [patient, setPatient] = useState({ displayName: "", phone: "", allergies: "" });
  const [pres, setPres] = useState({ prescriberName: "", prescriberLicenceNo: "" });
  const [lines, setLines] = useState<NewLine[]>([]); const [search, setSearch] = useState(""); const [scan, setScan] = useState<string | undefined>();
  const res = useQuery({ queryKey: ["rx-drug-search", search], queryFn: () => api<Page<Drug>>("/catalogue/drugs", { query: { q: search, pageSize: 8 } }), enabled: search.length >= 2 });
  const m = useMutation({
    mutationFn: () => api<Rx>("/prescriptions/paper", { body: { branchId, patient: { displayName: patient.displayName, phone: patient.phone || undefined, allergies: patient.allergies.split(",").map((s) => s.trim()).filter(Boolean) }, prescriberName: pres.prescriberName, prescriberLicenceNo: pres.prescriberLicenceNo || undefined, scanDataUrl: scan, lines: lines.map((l) => ({ drugId: l.drug.id, quantity: Number(l.quantity), directions: l.directions || undefined })) } }),
    onSuccess: (r) => { void qc.invalidateQueries({ queryKey: ["rx-list"] }); onClose(); nav(`/rx/${r.id}`); },
  });
  const onFile = (f: File | undefined) => { if (!f) return setScan(undefined); const fr = new FileReader(); fr.onload = () => setScan(String(fr.result)); fr.readAsDataURL(f); };
  return (
    <Modal open={open} onClose={onClose} title={t("rx.newPaper")} wide>
      <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t("rx.patientName")}>{(id) => <Input id={id} required minLength={2} value={patient.displayName} onChange={(e) => setPatient({ ...patient, displayName: e.target.value })} />}</Field>
          <Field label={t("rx.patientPhone")}>{(id) => <Input id={id} inputMode="tel" value={patient.phone} onChange={(e) => setPatient({ ...patient, phone: e.target.value })} />}</Field>
          <Field label={t("rx.allergies")} hint={t("rx.allergiesHint")}>{(id) => <Input id={id} value={patient.allergies} onChange={(e) => setPatient({ ...patient, allergies: e.target.value })} />}</Field>
          <Field label={t("rx.scan")}>{(id) => <input id={id} type="file" accept="image/*,application/pdf" onChange={(e) => onFile(e.target.files?.[0])} className="min-h-10 text-sm" />}</Field>
          <Field label={t("rx.prescriber")}>{(id) => <Input id={id} required minLength={2} value={pres.prescriberName} onChange={(e) => setPres({ ...pres, prescriberName: e.target.value })} />}</Field>
          <Field label={t("rx.prescriberLicence")}>{(id) => <Input id={id} value={pres.prescriberLicenceNo} onChange={(e) => setPres({ ...pres, prescriberLicenceNo: e.target.value })} />}</Field>
        </div>
        <div>
          <Field label={t("rx.addDrug")}>{(id) => <Input id={id} type="search" value={search} onChange={(e) => setSearch(e.target.value)} />}</Field>
          {res.data?.items.length ? <ul className="mt-1 rounded-md border border-border">{res.data.items.map((d) => <li key={d.id}><button type="button" className="min-h-10 w-full px-3 text-start text-sm hover:bg-accent" onClick={() => { setLines([...lines, { key: newKey(), drug: d, quantity: "1", directions: "" }]); setSearch(""); }}>{drugName(d)} · {d.strength} · {d.dosageForm}</button></li>)}</ul> : null}
        </div>
        <Table head={[t("common.product"), t("inv.qty"), t("rx.directions"), ""]} empty={!lines.length ? <Empty>{t("rx.noLines")}</Empty> : null}>
          {lines.map((l) => <tr key={l.key}><Td>{drugName(l.drug)} {l.drug.strength}</Td>
            <Td><Input aria-label={t("inv.qty")} type="number" min={1} value={l.quantity} onChange={(e) => setLines(lines.map((x) => (x.key === l.key ? { ...x, quantity: e.target.value } : x)))} className="w-20" /></Td>
            <Td><Input aria-label={t("rx.directions")} value={l.directions} onChange={(e) => setLines(lines.map((x) => (x.key === l.key ? { ...x, directions: e.target.value } : x)))} /></Td>
            <Td><Button size="sm" variant="ghost" aria-label={t("common.remove")} onClick={() => setLines(lines.filter((x) => x.key !== l.key))}>✕</Button></Td></tr>)}
        </Table>
        <ErrorNote error={m.error} />
        <Button type="submit" disabled={!lines.length || m.isPending}>{t("rx.create")}</Button>
      </form>
    </Modal>
  );
}

export function RxQueue() {
  const { t } = useTranslation();
  const { branchId, can } = useAuth();
  const nav = useNavigate();
  const [status, setStatus] = useState(""); const [add, setAdd] = useState(false);
  const res = useQuery({ queryKey: ["rx-list", branchId, status], queryFn: () => api<Page<Rx>>("/prescriptions", { query: { branchId, status, pageSize: 50 } }), enabled: !!branchId, refetchInterval: 20_000 });
  return (
    <>
      <PageHeader title={t("rx.title")} actions={can("rx.intake") && <Button onClick={() => setAdd(true)}>{t("rx.newPaper")}</Button>} />
      <Card>
        <div className="mb-3"><Field label={t("common.status")}>{(id) => <Select id={id} value={status} onChange={(e) => setStatus(e.target.value)}><option value="">{t("common.all")}</option>{Object.keys(RX_TONE).map((s) => <option key={s} value={s}>{t(`rxStatus.${s}`)}</option>)}</Select>}</Field></div>
        <ErrorNote error={res.error} />
        {res.isLoading ? <Spinner /> : (
          <Table head={[t("rx.patient"), t("rx.source"), t("rx.prescriber"), t("rx.items"), t("common.status"), t("rx.received"), ""]} empty={!res.data?.items.length ? <Empty>{t("rx.empty")}</Empty> : null}>
            {res.data?.items.map((r) => (
              <tr key={r.id}>
                <Td className="font-medium">{r.patient?.displayName ?? "—"}</Td><Td><Badge tone="info">{t(`rxSource.${r.source}`)}</Badge></Td><Td>{r.prescriberName ?? "—"}{r.prescriberVerifiedBadge && <span className="ms-1" title={t("rx.verified")}>✔</span>}</Td>
                <Td>{r.lines.length}</Td><Td><Badge tone={RX_TONE[r.status] ?? "neutral"}>{t(`rxStatus.${r.status}`)}</Badge></Td><Td>{fmtDateTime(r.receivedAt)}</Td>
                <Td><Button size="sm" variant="outline" onClick={() => nav(`/rx/${r.id}`)}>{t("common.open")}</Button></Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
      <NewRx open={add} onClose={() => setAdd(false)} />
    </>
  );
}
