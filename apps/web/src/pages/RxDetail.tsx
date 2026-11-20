import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { Stepper } from "@/brand/ui-kit";
import { useTranslation } from "react-i18next";
import { api, newKey } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card, ErrorNote, Field, Input, Modal, OUTCOME_TONE, PageHeader, Select, Spinner, Table, Td, Textarea } from "@/components/ui";
import { RX_TONE } from "@/pages/RxQueue";
import { drugName, fmtDate, fmtMoney } from "@/lib/format";
import { printHtml } from "@/lib/print";
import { useToast } from "@/lib/toast";
import type { Dispensing, Drug, Page, Rx, RxLine, Sale } from "@/lib/types";

interface Issue { code: string; severity: "ERROR" | "WARN"; message: string }
interface Alt { drugId: string; brandName: string; brandNameAr: string | null; available: number; price: string | null }
interface Pick { drugId: string; quantity: string; consent: boolean }

function LinePicker({ line, branchId, value, onChange }: { line: RxLine; branchId: string; value: Pick; onChange: (p: Pick) => void }) {
  const { t } = useTranslation();
  const prescribed = line.drug;
  const [q, setQ] = useState("");
  const alts = useQuery({ queryKey: ["alts", line.drugId, branchId], queryFn: () => api<Alt[]>(`/catalogue/drugs/${line.drugId}/substitutes`, { query: { branchId } }), enabled: !!line.drugId });
  const byIngredient = useQuery({ queryKey: ["by-ing", line.activeIngredient, q], queryFn: () => api<Page<Drug>>("/catalogue/drugs", { query: { q: q || line.activeIngredient || "", pageSize: 12 } }), enabled: !line.drugId });
  const remaining = line.quantity - line.qtyDispensed;
  const isSubstitute = !!line.drugId && value.drugId !== line.drugId;
  return (
    <tr>
      <Td className="font-medium">{line.drugName ?? line.activeIngredient}<div className="text-xs text-muted-foreground">{line.strength} · {line.directions}</div>{line.controlled && <Badge tone="bad">{t("cat.controlled")}</Badge>}</Td>
      <Td>{remaining}/{line.quantity}</Td>
      <Td>
        {line.drugId ? (
          <Select aria-label={t("rx.chooseProduct")} value={value.drugId} onChange={(e) => onChange({ ...value, drugId: e.target.value, consent: false })}>
            <option value={line.drugId}>{drugName(prescribed ?? { brandName: line.drugName ?? "" })} ({t("rx.prescribed")})</option>
            {alts.data?.map((a) => <option key={a.drugId} value={a.drugId}>{drugName(a)} — {a.available} {t("inv.available")}</option>)}
          </Select>
        ) : (
          <div className="space-y-1">
            <Input aria-label={t("common.search")} type="search" placeholder={t("rx.searchProduct")} value={q} onChange={(e) => setQ(e.target.value)} />
            <Select aria-label={t("rx.chooseProduct")} value={value.drugId} onChange={(e) => onChange({ ...value, drugId: e.target.value })}><option value="">—</option>{byIngredient.data?.items.map((d) => <option key={d.id} value={d.id}>{drugName(d)} · {d.strength}</option>)}</Select>
          </div>
        )}
        {isSubstitute && <label className="mt-1 flex items-center gap-2 text-xs"><input type="checkbox" checked={value.consent} onChange={(e) => onChange({ ...value, consent: e.target.checked })} />{t("rx.substitutionConsent")}</label>}
      </Td>
      <Td><Input aria-label={t("inv.qty")} type="number" min={1} max={remaining} className="w-20" value={value.quantity} onChange={(e) => onChange({ ...value, quantity: e.target.value })} /></Td>
    </tr>
  );
}

const rank = (o: string) => (o === "BLOCK" ? 0 : o === "WARN" ? 1 : 2);
function SafetyPanel({ d, canOverride }: { d: Dispensing; canOverride: boolean }) {
  const { t } = useTranslation();
  const qc = useQueryClient(); const toast = useToast();
  const [ov, setOv] = useState<{ id: string; kind: string } | null>(null); const [reason, setReason] = useState("");
  const m = useMutation({ mutationFn: () => api(`/dispensings/${d.id}/override/${ov!.id}`, { body: { reason } }), onSuccess: () => { toast(t("disp.overridden")); setOv(null); setReason(""); void qc.invalidateQueries({ queryKey: ["dispensing"] }); } });
  return (
    <Card title={t("disp.safety")} actions={<span className="flex gap-1.5">{(["BLOCK", "WARN", "PASS"] as const).map((o) => { const n = d.safetyChecks.filter((c) => c.outcome === o || (o === "PASS" && c.outcome === "OVERRIDDEN_BY_PHARMACIST")).length; return n ? <Badge key={o} tone={OUTCOME_TONE[o]}>{n} {t(`outcome.${o}`)}</Badge> : null; })}</span>}>
      {d.safetyChecks.some((c) => c.outcome === "BLOCK") && <p role="alert" className="mb-3 flex items-center gap-2 rounded-lg border-2 border-[hsl(var(--danger-text))] bg-[hsl(var(--danger-text)/0.1)] px-3 py-2 text-sm font-semibold text-[hsl(var(--danger-text))]"><ShieldAlert aria-hidden="true" className="size-5 shrink-0" />{t("disp.resolveBlocks")}</p>}
      <ul className="grid gap-2 2xl:grid-cols-2">
        {[...d.safetyChecks].sort((x, y) => rank(x.outcome) - rank(y.outcome)).map((c) => {
          const Icon = c.outcome === "BLOCK" ? ShieldAlert : c.outcome === "WARN" ? AlertTriangle : CheckCircle2;
          const accent = c.outcome === "BLOCK" ? "border-[hsl(var(--danger-text)/0.5)] bg-[hsl(var(--danger-text)/0.07)]" : c.outcome === "WARN" ? "border-[hsl(var(--warning)/0.5)] bg-[hsl(var(--warning)/0.08)]" : "border-border";
          const ic = c.outcome === "BLOCK" ? "text-[hsl(var(--danger-text))]" : c.outcome === "WARN" ? "text-[hsl(var(--warning))]" : "text-[hsl(var(--success))]";
          return (
            <li key={c.id} className={`flex flex-wrap items-start justify-between gap-2 rounded-xl border p-3 ${accent}`}>
              <div className="flex min-w-0 gap-3"><Icon aria-hidden="true" className={`mt-0.5 size-5 shrink-0 ${ic}`} />
                <div><div className="flex flex-wrap items-center gap-2"><span className="text-sm font-semibold">{t(`check.${c.kind}`)}</span><Badge tone={OUTCOME_TONE[c.outcome] ?? "neutral"}>{t(`outcome.${c.outcome}`)}</Badge></div>
                  {c.detail && <p className="mt-1 text-sm text-muted-foreground">{c.detail}</p>}{c.overrideReason && <p className="mt-1 text-xs">{t("disp.overrideReason")}: {c.overrideReason}</p>}</div></div>
              {c.outcome === "BLOCK" && canOverride && !["CONTROLLED_LIMIT", "PRESCRIBER", "DOSE_QUANTITY"].includes(c.kind) && <Button size="sm" variant="outline" onClick={() => setOv({ id: c.id, kind: c.kind })}>{t("disp.override")}</Button>}
              {c.outcome === "BLOCK" && ["CONTROLLED_LIMIT", "PRESCRIBER", "DOSE_QUANTITY"].includes(c.kind) && <span className="text-xs font-semibold text-[hsl(var(--danger-text))]">{t("disp.hardStop")}</span>}
            </li>
          );
        })}
      </ul>
      <Modal open={!!ov} onClose={() => setOv(null)} title={t("disp.override")}>
        <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="space-y-3">
          <p className="text-sm text-muted-foreground">{t("disp.overrideWarn")}</p>
          <Field label={t("disp.overrideReason")}>{(id) => <Textarea id={id} required minLength={5} value={reason} onChange={(e) => setReason(e.target.value)} />}</Field>
          <ErrorNote error={m.error} /><Button type="submit" variant="danger" disabled={m.isPending}>{t("disp.override")}</Button>
        </form>
      </Modal>
    </Card>
  );
}

export function Workflow({ d, rx }: { d: Dispensing; rx?: Rx }) {
  const { t } = useTranslation();
  const { me, can } = useAuth();
  const qc = useQueryClient(); const toast = useToast();
  const [nid, setNid] = useState({ nationalId: "", patientName: rx?.patient?.displayName ?? "" });
  const [notes, setNotes] = useState(""); const [method, setMethod] = useState("CASH"); const [tendered, setTendered] = useState(""); const [done, setDone] = useState<Sale | null>(null);
  const refresh = () => { void qc.invalidateQueries({ queryKey: ["dispensing"] }); void qc.invalidateQueries({ queryKey: ["rx"] }); void qc.invalidateQueries({ queryKey: ["dispensings-for-rx"] }); };
  const total = d.lines.reduce((a, l) => a + Number(l.unitPrice) * l.quantity, 0);
  const controlled = d.lines.some((l) => l.drug && l.drug.controlledSchedule !== "NONE");
  const isPharm = !!me?.user.isPharmacist && can("dispense.signoff");
  const cid = useMutation({ mutationFn: () => api(`/dispensings/${d.id}/controlled-id`, { body: nid }), onSuccess: () => { toast(t("common.saved")); refresh(); } });
  const sign = useMutation({ mutationFn: () => api(`/dispensings/${d.id}/signoff`, { body: { counsellingNotes: notes || undefined } }), onSuccess: () => { toast(t("disp.signedOff")); refresh(); } });
  const repick = useMutation({ mutationFn: () => api(`/dispensings/${d.id}/repick`, { method: "POST" }), onSuccess: refresh });
  const cancel = useMutation({ mutationFn: () => api(`/dispensings/${d.id}/cancel`, { body: { reason: "cancelled at counter" } }), onSuccess: refresh });
  const complete = useMutation({
    mutationFn: () => api<{ sale: Sale }>(`/dispensings/${d.id}/complete`, { body: { idempotencyKey: newKey(), ...(d.kiorexOrderRef ? {} : { payments: [{ method, amount: method === "CASH" && tendered ? tendered : total.toFixed(2) }] }) } }),
    onSuccess: (r) => { toast(t("disp.dispensed")); setDone(r.sale); refresh(); },
  });
  return (
    <div className="space-y-4">
      <Stepper steps={[t("disp.stReserved"), t("disp.stSignedOff"), t("disp.stDispensed")]} current={d.status === "DISPENSED" || done ? 2 : d.status === "SIGNED_OFF" ? 1 : 0} />
      <Card title={`${t("disp.title")} · ${t(`dispStatus.${d.status}`)}`} actions={["RESERVED", "SIGNED_OFF", "VALIDATED"].includes(d.status) && <Button size="sm" variant="outline" onClick={() => cancel.mutate()}>{t("common.cancel")}</Button>}>
        <Table numeric={[3, 4]} head={[t("common.product"), t("inv.lot"), t("inv.expiry"), t("inv.qty"), t("cat.price")]}>
          {d.lines.map((l) => <tr key={l.id}><Td className="font-medium">{drugName(l.drug)} {l.substitutedFromDrugId && <Badge tone="info">{t("rx.substituted")}</Badge>}</Td><Td className="font-mono text-xs">{l.lot.lotNumber}</Td><Td className="whitespace-nowrap">{fmtDate(l.lot.expiryDate)}</Td><Td className="kx-num text-end">{l.quantity}</Td><Td className="kx-num text-end">{fmtMoney(l.unitPrice)}</Td></tr>)}
        </Table>
        <p className="mt-3 flex items-baseline justify-end gap-3 border-t border-border/70 pt-3"><span className="text-sm text-muted-foreground">{t("pos.total")}</span><span className="kx-num text-2xl font-semibold tracking-tight">{fmtMoney(total)}</span></p>
        <ErrorNote error={cancel.error || repick.error} />
        {d.status === "RESERVED" && d.lines.some((l) => l.lot.status !== "AVAILABLE" && l.lot.status !== "RESERVED") && <div className="mt-2 rounded-md bg-destructive/10 p-3 text-sm text-danger">{t("disp.lotBlocked")} <Button size="sm" variant="danger" onClick={() => repick.mutate()}>{t("disp.repick")}</Button></div>}
      </Card>
      <SafetyPanel d={d} canOverride={isPharm} />
      {controlled && d.status !== "DISPENSED" && (
        <Card title={t("disp.controlledId")}>
          {d.controlledIdCaptured ? <Badge tone="good">{t("disp.idCaptured")}</Badge> : (
            <form className="flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); cid.mutate(); }}>
              <Field label={t("disp.nationalId")} hint={t("disp.nationalIdHint")}>{(id) => <Input id={id} inputMode="numeric" pattern="[0-9]{14}" required value={nid.nationalId} onChange={(e) => setNid({ ...nid, nationalId: e.target.value })} />}</Field>
              <Field label={t("rx.patientName")}>{(id) => <Input id={id} required value={nid.patientName} onChange={(e) => setNid({ ...nid, patientName: e.target.value })} />}</Field>
              <Button type="submit" disabled={cid.isPending}>{t("common.save")}</Button>
            </form>
          )}
          <ErrorNote error={cid.error} />
        </Card>
      )}
      {d.status === "RESERVED" && (
        <Card title={t("disp.signoffTitle")}>
          {isPharm ? (
            <div className="space-y-3">
              <Field label={t("disp.counselling")}>{(id) => <Textarea id={id} value={notes} onChange={(e) => setNotes(e.target.value)} />}</Field>
              <ErrorNote error={sign.error} />
              <Button size="lg" onClick={() => sign.mutate()} disabled={sign.isPending || d.safetyChecks.some((c) => c.outcome === "BLOCK")}>{t("disp.signoff")}</Button>
              {d.safetyChecks.some((c) => c.outcome === "BLOCK") && <p className="text-sm text-danger">{t("disp.resolveBlocks")}</p>}
            </div>
          ) : <p className="text-sm text-muted-foreground">{t("disp.pharmacistOnly")}</p>}
        </Card>
      )}
      {d.status === "SIGNED_OFF" && !done && (
        <Card title={t("disp.payTitle")}>
          <p className="mb-3 text-sm text-muted-foreground">{t("disp.signedBy", { when: new Date(d.signedOffAt ?? "").toLocaleString() })}</p>
          {d.kiorexOrderRef ? <p className="text-sm">{t("disp.prepaid")}</p> : (
            <div className="flex flex-wrap items-end gap-3">
              <Field label={t("pos.method")}>{(id) => <Select id={id} value={method} onChange={(e) => setMethod(e.target.value)}>{["CASH", "CARD", "INSTAPAY", "FAWRY", "WALLET"].map((m) => <option key={m} value={m}>{t(`method.${m}`)}</option>)}</Select>}</Field>
              {method === "CASH" && <Field label={t("pos.tendered")}>{(id) => <Input id={id} inputMode="decimal" placeholder={total.toFixed(2)} value={tendered} onChange={(e) => setTendered(e.target.value)} />}</Field>}
            </div>
          )}
          <ErrorNote error={complete.error} />
          <Button size="lg" className="mt-3" onClick={() => complete.mutate()} disabled={complete.isPending}>{t("disp.complete")}</Button>
        </Card>
      )}
      {(done || d.status === "DISPENSED") && (
        <Card title={t("disp.dispensed")}>
          <Badge tone="good">{t("dispStatus.DISPENSED")}</Badge>
          {done && <Button className="ms-3" variant="outline" onClick={() => void printHtml(`/pos/sales/${done.id}/receipt.html`, { lang: document.documentElement.lang })}>{t("pos.printReceipt")}</Button>}
        </Card>
      )}
    </div>
  );
}

export function RxDetail() {
  const { id = "" } = useParams();
  const { t } = useTranslation();
  const { branchId, can } = useAuth();
  const qc = useQueryClient(); const toast = useToast();
  const [issues, setIssues] = useState<Issue[] | null>(null); const [picks, setPicks] = useState<Record<string, Pick>>({}); const [rejectReason, setRejectReason] = useState(""); const [rejecting, setRejecting] = useState(false);
  const rxQ = useQuery({ queryKey: ["rx", id], queryFn: () => api<Rx>(`/prescriptions/${id}`) });
  const list = useQuery({ queryKey: ["dispensings-for-rx", id], queryFn: () => api<Page<{ id: string; status: string; prescriptionId: string | null }>>("/dispensings", { query: { pageSize: 50 } }) });
  const activeId = list.data?.items.find((x) => x.prescriptionId === id && ["VALIDATED", "RESERVED", "SIGNED_OFF", "DISPENSED"].includes(x.status))?.id;
  const dispQ = useQuery({ queryKey: ["dispensing", activeId], queryFn: () => api<Dispensing>(`/dispensings/${activeId}`), enabled: !!activeId });
  const refresh = () => { void qc.invalidateQueries({ queryKey: ["rx"] }); void qc.invalidateQueries({ queryKey: ["dispensings-for-rx"] }); void qc.invalidateQueries({ queryKey: ["dispensing"] }); };
  const validate = useMutation({ mutationFn: () => api<{ issues: Issue[]; validated: boolean }>(`/prescriptions/${id}/validate`, { method: "POST" }), onSuccess: (r) => { setIssues(r.issues); toast(r.validated ? t("rx.validated") : t("rx.validationFailed"), r.validated ? "ok" : "err"); refresh(); } });
  const reject = useMutation({ mutationFn: () => api(`/prescriptions/${id}/reject`, { body: { reason: rejectReason } }), onSuccess: () => { setRejecting(false); refresh(); } });
  const dispense = useMutation({
    mutationFn: () => {
      const rx = rxQ.data!;
      const items = rx.lines.filter((l) => l.quantity > l.qtyDispensed).map((l) => ({ l, p: picks[l.id] ?? { drugId: l.drugId ?? "", quantity: String(l.quantity - l.qtyDispensed), consent: false } })).filter((x) => x.p.drugId)
        .map(({ l, p }) => ({ prescriptionLineId: l.id, drugId: p.drugId, quantity: Number(p.quantity), ...(l.drugId && p.drugId !== l.drugId ? { substitution: { fromDrugId: l.drugId, consent: p.consent } } : {}) }));
      return api("/dispensings", { body: { branchId, prescriptionId: id, items } });
    },
    onSuccess: () => { toast(t("disp.created")); refresh(); },
  });
  const rx = rxQ.data;
  if (rxQ.isLoading || !rx) return <Spinner />;
  const open = rx.lines.filter((l) => l.quantity > l.qtyDispensed);
  const canPlan = ["VALIDATED", "PARTIALLY_DISPENSED"].includes(rx.status) && (!dispQ.data || ["DISPENSED", "CANCELLED"].includes(dispQ.data.status));
  return (
    <>
      <PageHeader title={t("rx.detail")} subtitle={rx.patient?.displayName} actions={<Badge tone={RX_TONE[rx.status] ?? "neutral"}>{t(`rxStatus.${rx.status}`)}</Badge>} />
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          <Card title={t("rx.items")}>
            <dl className="mb-3 grid grid-cols-2 gap-2 text-sm"><dt className="text-muted-foreground">{t("rx.source")}</dt><dd>{t(`rxSource.${rx.source}`)}</dd><dt className="text-muted-foreground">{t("rx.prescriber")}</dt><dd>{rx.prescriberName} {rx.prescriberVerifiedBadge && "✔"}</dd><dt className="text-muted-foreground">{t("rx.validUntil")}</dt><dd>{fmtDate(rx.validUntil)}</dd>
              {!!rx.patient?.allergies?.length && <><dt className="text-muted-foreground">{t("rx.allergies")}</dt><dd className="text-danger">{rx.patient.allergies.join(", ")}</dd></>}</dl>
            <Table numeric={[1]} head={[t("common.product"), t("inv.qty"), t("rx.directions")]}>
              {rx.lines.map((l) => <tr key={l.id}><Td className="font-medium">{l.drugName ?? l.activeIngredient} <span className="text-xs text-muted-foreground">{l.strength}</span></Td><Td>{l.qtyDispensed}/{l.quantity}</Td><Td>{l.directions ?? "—"}</Td></tr>)}
            </Table>
            {issues && <ul className="mt-3 space-y-1" aria-label={t("rx.issues")}>{issues.map((i, k) => <li key={k} className="flex items-center gap-2 text-sm"><Badge tone={i.severity === "ERROR" ? "bad" : "warn"}>{i.severity === "ERROR" ? t("rx.error") : t("rx.warning")}</Badge>{i.message}</li>)}</ul>}
            <ErrorNote error={validate.error || reject.error} />
            {can("rx.validate") && ["RECEIVED", "VALIDATING"].includes(rx.status) && <div className="mt-3 flex gap-2"><Button onClick={() => validate.mutate()} disabled={validate.isPending}>{t("rx.validate")}</Button><Button variant="danger" onClick={() => setRejecting(true)}>{t("rx.reject")}</Button></div>}
          </Card>
          {canPlan && can("dispense.create") && branchId && (
            <Card title={t("disp.plan")}>
              <Table head={[t("rx.prescribedItem"), t("rx.remaining"), t("rx.chooseProduct"), t("inv.qty")]}>
                {open.map((l) => <LinePicker key={l.id} line={l} branchId={branchId} value={picks[l.id] ?? { drugId: l.drugId ?? "", quantity: String(l.quantity - l.qtyDispensed), consent: false }} onChange={(p) => setPicks({ ...picks, [l.id]: p })} />)}
              </Table>
              <ErrorNote error={dispense.error} />
              <Button className="mt-3" size="lg" onClick={() => dispense.mutate()} disabled={dispense.isPending}>{t("disp.start")}</Button>
              <p className="mt-2 text-xs text-muted-foreground">{t("disp.startNote")}</p>
            </Card>
          )}
        </div>
        <div>{dispQ.data ? <Workflow d={dispQ.data} rx={rx} /> : <Card><p className="text-sm text-muted-foreground">{t("disp.none")}</p></Card>}</div>
      </div>
      <Modal open={rejecting} onClose={() => setRejecting(false)} title={t("rx.reject")}>
        <form onSubmit={(e) => { e.preventDefault(); reject.mutate(); }} className="space-y-3"><Field label={t("common.reason")}>{(fid) => <Textarea id={fid} required minLength={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />}</Field><Button type="submit" variant="danger">{t("rx.reject")}</Button></form>
      </Modal>
    </>
  );
}

/** Standalone dispensing workspace (Kiorex orders without a prescription, OTC counter dispensing): sign-off and completion live here. */
export function DispensingPage() {
  const { id = "" } = useParams();
  const { t } = useTranslation();
  const q = useQuery({ queryKey: ["dispensing", id], queryFn: () => api<Dispensing>(`/dispensings/${id}`) });
  if (q.isLoading || !q.data) return <Spinner />;
  return (<><PageHeader title={t("disp.title")} /><div className="max-w-3xl"><Workflow d={q.data} /></div></>);
}
