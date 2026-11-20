import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useAction, useForm } from "@/lib/hooks";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, SearchInput, Select, Table, Tabs, Td, type Tone } from "@/components/ui";
import { fmtDateTime } from "@/lib/format";
import type { Page } from "@/lib/types";

interface Rule { id: string | null; scope: string; kind: string; ingredient: string; ingredientB: string | null; severity?: string; note: string; maxDailyMg?: string | number | null; maxSingleMg?: string | number | null; pediatricMaxMgPerKg?: string | number | null; category?: string | null }
const SEV_TONE: Record<string, Tone> = { MINOR: "neutral", MODERATE: "warn", MAJOR: "bad", CONTRAINDICATED: "bad" };
const KINDS = ["INTERACTION", "DOSE_RANGE", "PREGNANCY", "LACTATION", "RENAL", "HEPATIC"];

function Kb() {
  const { t } = useTranslation(); const { can } = useAuth();
  const [kind, setKind] = useState(""); const [q, setQ] = useState(""); const [open, setOpen] = useState(false);
  const res = useQuery({ queryKey: ["kb", kind, q], queryFn: () => api<{ mode: string; counts: { builtIn: number; database: number }; rules: Rule[] }>("/clinical/kb", { query: { kind: kind || undefined, q: q || undefined } }) });
  const del = useAction((id: string) => api(`/clinical/kb/${id}`, { method: "DELETE" }), ["kb"]);
  const [f, , bind, reset] = useForm({ kind: "DOSE_RANGE", ingredient: "", ingredientB: "", severity: "MAJOR", note: "", maxDailyMg: "", maxSingleMg: "", pediatricMaxMgPerKg: "", category: "C" });
  const add = useAction(() => api("/clinical/kb", { body: { kind: f.kind, ingredient: f.ingredient, ingredientB: f.kind === "INTERACTION" ? f.ingredientB : undefined, severity: ["INTERACTION", "LACTATION", "RENAL", "HEPATIC"].includes(f.kind) ? f.severity : undefined, note: f.note, maxDailyMg: f.kind === "DOSE_RANGE" ? f.maxDailyMg : undefined, maxSingleMg: f.kind === "DOSE_RANGE" && f.maxSingleMg ? f.maxSingleMg : undefined, pediatricMaxMgPerKg: f.kind === "DOSE_RANGE" && f.pediatricMaxMgPerKg ? f.pediatricMaxMgPerKg : undefined, category: f.kind === "PREGNANCY" ? f.category : undefined } }), ["kb"], { onDone: () => { setOpen(false); reset(); } });
  return <div className="space-y-3">
    <p className="rounded-xl border border-primary/20 bg-accent p-3 text-sm text-accent-foreground">{t("saf.disclaimer")} · {t("saf.mode", { mode: res.data?.mode ?? "…" })}</p>
    <div className="flex flex-wrap items-end gap-3"><SearchInput label={t("saf.search")} placeholder={t("saf.search")} value={q} onChange={(e) => setQ(e.target.value)} className="min-w-60 flex-1" /><Field label={t("saf.kindLabel")}>{(id) => <Select id={id} value={kind} onChange={(e) => setKind(e.target.value)}><option value="">{t("common.all")}</option>{KINDS.map((k) => <option key={k} value={k}>{t(`saf.kind.${k}`)}</option>)}</Select>}</Field>
      {can("safety.kb.manage") && <Button onClick={() => setOpen(true)}><Plus aria-hidden className="size-4" />{t("saf.addRule")}</Button>}</div>
    <Table dense head={[t("saf.kindLabel"), t("saf.ingredient"), t("saf.severity"), t("saf.note"), t("saf.scopeLabel"), ""]} empty={!res.data?.rules.length ? <Empty>{t("common.noResults")}</Empty> : null}>
      {res.data?.rules.map((r, i) => <tr key={r.id ?? `b${i}`}><Td><Badge tone="info">{t(`saf.kind.${r.kind}`)}</Badge></Td><Td className="font-medium">{r.ingredient}{r.ingredientB ? ` + ${r.ingredientB}` : ""}</Td>
        <Td>{r.severity ? <Badge tone={SEV_TONE[r.severity] ?? "neutral"}>{t(`saf.sev.${r.severity}`)}</Badge> : r.category ? <Badge tone={r.category === "X" || r.category === "D" ? "bad" : r.category === "C" ? "warn" : "good"}>{r.category}</Badge> : r.maxDailyMg ? <span className="kx-num">{r.maxDailyMg} mg</span> : "—"}</Td>
        <Td className="max-w-md">{r.note}</Td><Td><Badge tone={r.scope === "TENANT" ? "good" : "neutral"}>{t(`saf.scope.${r.scope}`)}</Badge></Td><Td className="text-end">{r.scope === "TENANT" && r.id && can("safety.kb.manage") && <Button size="sm" variant="ghost" aria-label={t("common.remove")} onClick={() => del.mutate(r.id!)}><Trash2 aria-hidden className="size-4" /></Button>}</Td></tr>)}</Table>
    <Modal open={open} onClose={() => setOpen(false)} title={t("saf.addRule")}><form className="space-y-3" onSubmit={(e) => { e.preventDefault(); add.mutate(); }}>
      <Field label={t("saf.kindLabel")}>{(id) => <Select id={id} {...bind("kind")}>{KINDS.map((k) => <option key={k} value={k}>{t(`saf.kind.${k}`)}</option>)}</Select>}</Field>
      <Field label={t("saf.ingredient")}>{(id) => <Input id={id} required minLength={2} {...bind("ingredient")} />}</Field>
      {f.kind === "INTERACTION" && <Field label={t("saf.ingredientB")}>{(id) => <Input id={id} required {...bind("ingredientB")} />}</Field>}
      {["INTERACTION", "LACTATION", "RENAL", "HEPATIC"].includes(f.kind) && <Field label={t("saf.severity")}>{(id) => <Select id={id} {...bind("severity")}>{["MINOR", "MODERATE", "MAJOR", "CONTRAINDICATED"].map((s) => <option key={s} value={s}>{t(`saf.sev.${s}`)}</option>)}</Select>}</Field>}
      {f.kind === "PREGNANCY" && <Field label={t("saf.category")}>{(id) => <Select id={id} {...bind("category")}>{["A", "B", "C", "D", "X"].map((s) => <option key={s}>{s}</option>)}</Select>}</Field>}
      {f.kind === "DOSE_RANGE" && <div className="grid gap-3 sm:grid-cols-3"><Field label={t("saf.maxDaily")}>{(id) => <Input id={id} inputMode="decimal" required {...bind("maxDailyMg")} />}</Field><Field label={t("saf.maxSingle")}>{(id) => <Input id={id} inputMode="decimal" {...bind("maxSingleMg")} />}</Field><Field label={t("saf.maxPediatric")}>{(id) => <Input id={id} inputMode="decimal" {...bind("pediatricMaxMgPerKg")} />}</Field></div>}
      <Field label={t("saf.note")}>{(id) => <Input id={id} required minLength={3} {...bind("note")} />}</Field><ErrorNote error={add.error} /><Button type="submit" disabled={add.isPending}>{t("common.save")}</Button></form></Modal></div>;
}

function Overrides() {
  const { t } = useTranslation();
  const q = useQuery({ queryKey: ["overrides"], queryFn: () => api<Page<{ id: string; kind: string; detail: string | null; reason: string | null; checkedAt: string; pharmacist: { displayName?: string; pharmacistLicenceNo?: string } | null }>>("/clinical/overrides", { query: { pageSize: 100 } }) });
  return <Table head={[t("saf.when"), t("common.type"), t("saf.note"), t("saf.reason"), t("saf.overriddenBy")]} empty={!q.data?.items.length ? <Empty>{t("saf.overridesEmpty")}</Empty> : null}>
    {q.data?.items.map((o) => <tr key={o.id}><Td className="whitespace-nowrap">{fmtDateTime(o.checkedAt)}</Td><Td><Badge tone="warn">{t(`check.${o.kind}`)}</Badge></Td><Td className="max-w-sm text-sm">{o.detail}</Td><Td className="max-w-xs font-medium">{o.reason}</Td><Td>{o.pharmacist?.displayName ?? "—"}<div className="font-mono text-xs text-muted-foreground">{o.pharmacist?.pharmacistLicenceNo}</div></Td></tr>)}</Table>;
}

export function Safety() {
  const { t } = useTranslation(); const { can } = useAuth();
  const [tab, setTab] = useState("kb");
  return (<><PageHeader title={t("saf.title")} subtitle={t("saf.subtitle")} />
    <Tabs value={tab} onChange={setTab} tabs={[{ id: "kb", label: t("saf.tabKb") }, ...(can("audit.read") ? [{ id: "overrides", label: t("saf.tabOverrides") }] : [])]} />
    <Card className="mt-3">{tab === "kb" ? <Kb /> : <Overrides />}</Card></>);
}
