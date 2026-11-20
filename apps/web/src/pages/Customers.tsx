import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GitMerge, Plus, UserRound } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useAction, useForm } from "@/lib/hooks";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, SearchInput, Segmented, Select, Table, Tabs, Td, Textarea } from "@/components/ui";
import { StatCard, TableSkeleton } from "@/brand/ui-kit";
import { drugName, fmtDate, fmtDateTime, fmtMoney, fmtNum } from "@/lib/format";
import type { Customer, CustomerProfile, Page } from "@/lib/types";

const list = (s: string) => s.split(/[,،]/).map((x) => x.trim()).filter(Boolean);
const TIER_TONE = { BRONZE: "neutral", SILVER: "info", GOLD: "warn", PLATINUM: "good" } as const;

export function TierBadge({ tier }: { tier: string }) { const { t } = useTranslation(); return <Badge tone={TIER_TONE[tier as keyof typeof TIER_TONE] ?? "neutral"}>{t(`cus.tier${tier}`)}</Badge>; }

function CustomerForm({ open, onClose, edit, onSaved }: { open: boolean; onClose: () => void; edit?: Customer | null; onSaved?: (c: Customer) => void }) {
  const { t } = useTranslation();
  const blank = { displayName: "", phone: "", email: "", gender: "", dateOfBirth: "", address: "", nationalId: "", allergies: "", chronicConditions: "", medicalNotes: "", weightKg: "", pregnant: false, lactating: false, renalImpairment: false, hepaticImpairment: false };
  const init = edit ? { ...blank, displayName: edit.displayName, phone: edit.phone ?? "", email: edit.email ?? "", gender: edit.gender ?? "", dateOfBirth: edit.dateOfBirth?.slice(0, 10) ?? "", address: edit.address ?? "", allergies: edit.allergies.join(", "), chronicConditions: edit.chronicConditions.join(", "), medicalNotes: edit.medicalNotes ?? "", weightKg: edit.weightKg ?? "", pregnant: edit.pregnant, lactating: edit.lactating, renalImpairment: edit.renalImpairment, hepaticImpairment: edit.hepaticImpairment } : blank;
  const [f, set, bind] = useForm<typeof blank>(init);
  const [force, setForce] = useState(false);
  const body = () => ({ displayName: f.displayName, phone: f.phone || undefined, email: f.email || undefined, gender: f.gender || undefined, dateOfBirth: f.dateOfBirth || undefined, address: f.address || undefined, nationalId: f.nationalId || undefined, allergies: list(f.allergies), chronicConditions: list(f.chronicConditions), medicalNotes: f.medicalNotes || undefined, weightKg: f.weightKg || undefined, pregnant: f.pregnant, lactating: f.lactating, renalImpairment: f.renalImpairment, hepaticImpairment: f.hepaticImpairment });
  const save = useAction((force: boolean) => edit ? api<Customer>(`/customers/${edit.id}`, { method: "PATCH", body: body() }) : api<Customer>("/customers", { body: { ...body(), consentDataProcessing: true, force } }), ["customers", "customer"], { onDone: (c) => { onSaved?.(c); setForce(false); onClose(); } });
  const dup = save.error instanceof ApiError && save.error.code === "DUPLICATE_CUSTOMER" ? (save.error.details as { candidates: Array<{ id: string; displayName: string; customerNo: string }> }) : null;
  const chk = (k: "pregnant" | "lactating" | "renalImpairment" | "hepaticImpairment", label: string) => <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f[k]} onChange={(e) => set({ [k]: e.target.checked } as never)} />{label}</label>;
  return (
    <Modal open={open} onClose={onClose} title={edit ? t("cus.edit") : t("cus.new")} wide>
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); save.mutate(force); }}>
        <Field label={t("cus.name")}>{(id) => <Input id={id} required minLength={2} {...bind("displayName")} />}</Field>
        <Field label={t("cus.phone")}>{(id) => <Input id={id} inputMode="tel" dir="ltr" {...bind("phone")} />}</Field>
        <Field label={t("cus.email")}>{(id) => <Input id={id} type="email" dir="ltr" {...bind("email")} />}</Field>
        <Field label={t("cus.dob")}>{(id) => <Input id={id} type="date" {...bind("dateOfBirth")} />}</Field>
        <Field label={t("cus.gender")}>{(id) => <Select id={id} {...bind("gender")}><option value="">—</option><option value="F">{t("cus.female")}</option><option value="M">{t("cus.male")}</option></Select>}</Field>
        <Field label={t("cus.weight")}>{(id) => <Input id={id} inputMode="decimal" {...bind("weightKg")} />}</Field>
        <Field label={t("cus.address")} className="sm:col-span-2">{(id) => <Input id={id} {...bind("address")} />}</Field>
        {!edit && <Field label={t("cus.nationalId")}>{(id) => <Input id={id} inputMode="numeric" dir="ltr" pattern="\d{14}" {...bind("nationalId")} />}</Field>}
        <Field label={t("cus.allergies")} hint={t("cus.allergiesHint")} className="sm:col-span-2">{(id) => <Input id={id} {...bind("allergies")} />}</Field>
        <Field label={t("cus.conditions")} hint={t("cus.conditionsHint")} className="sm:col-span-2">{(id) => <Input id={id} {...bind("chronicConditions")} />}</Field>
        <Field label={t("cus.medicalNotes")} className="sm:col-span-2">{(id) => <Textarea id={id} {...bind("medicalNotes")} />}</Field>
        <fieldset className="grid gap-2 rounded-xl border border-border p-3 sm:col-span-2 sm:grid-cols-2"><legend className="px-1 text-xs font-semibold text-muted-foreground">{t("cus.clinicalFlags")}</legend>
          {chk("pregnant", t("cus.pregnant"))}{chk("lactating", t("cus.lactating"))}{chk("renalImpairment", t("cus.renal"))}{chk("hepaticImpairment", t("cus.hepatic"))}</fieldset>
        {dup && <div className="rounded-xl border border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.1)] p-3 text-sm sm:col-span-2"><p className="font-medium">{t("cus.duplicate")}</p>{dup.candidates.map((c) => <p key={c.id}>{c.displayName} · {c.customerNo}</p>)}<Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => { setForce(true); save.mutate(true); }}>{t("cus.createAnyway")}</Button></div>}
        {!dup && <div className="sm:col-span-2"><ErrorNote error={save.error} /></div>}
        <div className="sm:col-span-2"><Button type="submit" disabled={save.isPending}>{t("common.save")}</Button></div>
      </form>
    </Modal>
  );
}

function Profile({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { t } = useTranslation();
  const { can } = useAuth();
  const [tab, setTab] = useState("overview");
  const [edit, setEdit] = useState(false);
  const p = useQuery({ queryKey: ["customer", id], queryFn: () => api<CustomerProfile>(`/customers/${id}`), enabled: !!id });
  const hist = useQuery({ queryKey: ["customer", id, "history"], queryFn: () => api<{ items: Array<{ kind: "RX" | "OTC"; at: string; quantity: number; drug: { brandName: string; brandNameAr: string | null; strength: string } | null; receiptNo: string | null }> }>(`/customers/${id}/history`), enabled: !!id && tab === "history" });
  const notes = useQuery({ queryKey: ["customer", id, "notes"], queryFn: () => api<Array<{ id: string; kind: string; body: string; createdAt: string }>>(`/customers/${id}/notes`), enabled: !!id && tab === "notes" });
  const loy = useQuery({ queryKey: ["customer", id, "loyalty"], queryFn: () => api<{ points: number; tier: string; value: string; lifetimeSpend: string; nextTier: { name: string; remaining: string } | null; entries: Array<{ id: string; kind: string; points: number; balanceAfter: number; note: string | null; createdAt: string }> }>(`/customers/${id}/loyalty`), enabled: !!id && tab === "loyalty" });
  const [nf, , nb, nreset] = useForm({ body: "", kind: "NOTE" });
  const addNote = useAction(() => api(`/customers/${id}/notes`, { body: nf }), ["customer"], { onDone: () => nreset() });
  const [ff, , fb, freset] = useForm({ related: "", relation: "" });
  const [fq, setFq] = useState("");
  const cand = useQuery({ queryKey: ["customers", "pick", fq], queryFn: () => api<Page<Customer>>("/customers", { query: { q: fq, pageSize: 6 } }), enabled: tab === "family" && fq.length >= 2 });
  const addFam = useAction(() => api(`/customers/${id}/family`, { body: { relatedPatientId: ff.related, relation: ff.relation } }), ["customer"], { onDone: () => freset() });
  const rmFam = useAction((lid: string) => api(`/customers/${id}/family/${lid}`, { method: "DELETE" }), ["customer"]);
  const [pf, , pb, preset] = useForm({ points: "", note: "" });
  const adjust = useAction(() => api(`/customers/${id}/loyalty/adjust`, { body: { points: Number(pf.points), note: pf.note } }), ["customer", "customers"], { onDone: () => preset() });
  const [limit, setLimit] = useState("");
  const credit = useAction(() => api(`/customers/${id}/credit-account`, { body: { creditLimit: limit } }), ["customer", "customers"]);
  const consent = useAction((b: { dataProcessing: boolean; marketing: boolean }) => api(`/customers/${id}/consent`, { method: "PUT", body: b }), ["customer"]);
  const active = useAction((v: boolean) => api(`/customers/${id}`, { method: "PATCH", body: { active: v } }), ["customer", "customers"]);
  const d = p.data;
  return (
    <Modal open={!!id} onClose={() => { onClose(); setTab("overview"); }} title={d?.displayName ?? t("cus.title")} wide>
      {!d ? <TableSkeleton rows={4} cols={3} /> : <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">{d.customerNo}</span><TierBadge tier={d.loyaltyTier} />{!d.active && <Badge tone="bad">{t("cus.inactive")}</Badge>}
          {d.allergies.map((a) => <Badge key={a} tone="bad">{a}</Badge>)}{d.chronicConditions.map((a) => <Badge key={a} tone="info">{a}</Badge>)}
          <div className="ms-auto flex gap-2">{can("customer.write") && <><Button size="sm" variant="outline" onClick={() => setEdit(true)}>{t("cus.edit")}</Button><Button size="sm" variant="outline" onClick={() => active.mutate(!d.active)}>{d.active ? t("cus.deactivate") : t("cus.activate")}</Button></>}</div>
        </div>
        <Tabs value={tab} onChange={setTab} tabs={[{ id: "overview", label: t("cus.tabOverview") }, { id: "history", label: t("cus.tabHistory") }, { id: "family", label: t("cus.tabFamily"), count: d.family.length }, { id: "notes", label: t("cus.tabNotes") }, { id: "loyalty", label: t("cus.tabLoyalty") }, { id: "account", label: t("cus.tabAccount") }]} />
        {tab === "overview" && <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4"><StatCard label={t("cus.rxCount")} value={fmtNum(d.stats.prescriptions)} /><StatCard label={t("cus.purchases")} value={fmtNum(d.stats.purchases)} /><StatCard label={t("cus.totalSpend")} value={fmtMoney(d.stats.totalSpend)} tone="brand" /><StatCard label={t("cus.lastVisit")} value={d.stats.lastVisit ? fmtDate(d.stats.lastVisit) : "—"} /></div>
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {([["cus.phone", d.phone], ["cus.email", d.email], ["cus.dob", d.dateOfBirth ? fmtDate(d.dateOfBirth) : d.birthYear], ["cus.address", d.address], ["cus.weight", d.weightKg], ["cus.nationalId", d.nationalIdLast4 ? `•••• ${d.nationalIdLast4}` : null]] as const).map(([k, v]) => <div key={k} className="flex justify-between gap-3 border-b border-border/60 py-1.5"><dt className="text-muted-foreground">{t(k)}</dt><dd className="font-medium" dir="auto">{v ?? "—"}</dd></div>)}
          </dl>
          <div className="flex flex-wrap gap-2">{[d.pregnant && t("cus.pregnant"), d.lactating && t("cus.lactating"), d.renalImpairment && t("cus.renal"), d.hepaticImpairment && t("cus.hepatic")].filter(Boolean).map((x) => <Badge key={String(x)} tone="warn">{String(x)}</Badge>)}</div>
          {d.medicalNotes && <p className="rounded-xl bg-muted/60 p-3 text-sm">{d.medicalNotes}</p>}
        </div>}
        {tab === "history" && (hist.isLoading ? <TableSkeleton rows={4} cols={4} /> : <Table dense head={[t("common.date"), t("common.type"), t("common.product"), t("inv.qty")]} numeric={[3]} empty={!hist.data?.items.length ? <Empty>{t("cus.noHistory")}</Empty> : null}>
          {hist.data?.items.map((h, i) => <tr key={i}><Td>{fmtDate(h.at)}</Td><Td><Badge tone={h.kind === "RX" ? "info" : "neutral"}>{h.kind === "RX" ? t("cus.rx") : t("cus.otc")}</Badge></Td><Td className="font-medium">{drugName(h.drug)} <span className="text-muted-foreground"><bdi>{h.drug?.strength}</bdi></span></Td><Td className="kx-num text-end">{h.quantity}</Td></tr>)}</Table>)}
        {tab === "family" && <div className="space-y-4">
          <Table dense head={[t("cus.name"), t("cus.relation"), t("cus.phone"), ""]} empty={!d.family.length ? <Empty>{t("common.none")}</Empty> : null}>{d.family.map((l) => <tr key={l.id}><Td className="font-medium">{l.person?.displayName}</Td><Td>{l.relation.replace(":inverse", "")}</Td><Td dir="ltr">{l.person?.phone ?? "—"}</Td><Td className="text-end">{can("customer.write") && <Button size="sm" variant="outline" onClick={() => rmFam.mutate(l.id)}>{t("common.remove")}</Button>}</Td></tr>)}</Table>
          {can("customer.write") && <form className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-border p-3" onSubmit={(e) => { e.preventDefault(); addFam.mutate(); }}>
            <Field label={t("cus.pickCustomer")}>{(i) => <Input id={i} value={fq} onChange={(e) => setFq(e.target.value)} placeholder={t("common.search")} />}</Field>
            <Field label=" ">{(i) => <Select id={i} required value={ff.related} onChange={fb("related").onChange}><option value="">{t("cus.pickCustomer")}</option>{cand.data?.items.filter((c) => c.id !== id).map((c) => <option key={c.id} value={c.id}>{c.displayName}</option>)}</Select>}</Field>
            <Field label={t("cus.relation")} hint={t("cus.relationHint")}>{(i) => <Input id={i} required {...fb("relation")} />}</Field><Button type="submit">{t("cus.linkFamily")}</Button></form>}
        </div>}
        {tab === "notes" && <div className="space-y-4">
          {can("customer.write") && <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); addNote.mutate(); }}><div className="flex gap-2"><Select aria-label={t("cus.noteKind")} className="w-40" {...nb("kind")}>{["NOTE", "COUNSELLING", "COMPLAINT"].map((k) => <option key={k} value={k}>{t(`cus.k${k}`)}</option>)}</Select><Input aria-label={t("cus.noteBody")} required placeholder={t("cus.noteBody")} {...nb("body")} /><Button type="submit">{t("cus.addNote")}</Button></div></form>}
          <ul className="space-y-2">{notes.data?.map((n) => <li key={n.id} className="rounded-xl border border-border/70 p-3 text-sm"><div className="mb-1 flex items-center gap-2"><Badge tone="neutral">{t(`cus.k${n.kind}`)}</Badge><span className="text-xs text-muted-foreground">{fmtDateTime(n.createdAt)}</span></div>{n.body}</li>)}</ul>
        </div>}
        {tab === "loyalty" && <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3"><StatCard label={t("cus.points")} value={fmtNum(loy.data?.points ?? d.loyalty.points)} tone="brand" /><StatCard label={t("cus.pointsValue")} value={fmtMoney(loy.data?.value ?? d.loyalty.value)} /><StatCard label={t("cus.tier")} value={<TierBadge tier={loy.data?.tier ?? d.loyaltyTier} />} hint={loy.data?.nextTier ? t("cus.nextTier", { remaining: fmtMoney(loy.data.nextTier.remaining), tier: t(`cus.tier${loy.data.nextTier.name}`) }) : undefined} /></div>
          {can("loyalty.manage") && <form className="flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); adjust.mutate(); }}><Field label={t("cus.pointsDelta")}>{(i) => <Input id={i} type="number" required className="w-32" {...pb("points")} />}</Field><Field label={t("common.reason")}>{(i) => <Input id={i} required minLength={3} {...pb("note")} />}</Field><Button type="submit">{t("cus.adjustPoints")}</Button></form>}
          <Table dense head={[t("common.date"), t("common.type"), t("cus.points"), t("cus.balance")]} numeric={[2, 3]}>{loy.data?.entries.map((e) => <tr key={e.id}><Td>{fmtDateTime(e.createdAt)}</Td><Td>{e.kind}{e.note ? ` · ${e.note}` : ""}</Td><Td className={`kx-num text-end ${e.points < 0 ? "text-[hsl(var(--danger-text))]" : ""}`}>{e.points > 0 ? "+" : ""}{e.points}</Td><Td className="kx-num text-end">{e.balanceAfter}</Td></tr>)}</Table>
        </div>}
        {tab === "account" && <div className="grid gap-5 md:grid-cols-2">
          <Card title={t("cus.credit")}>{d.customerAccount ? <div className="grid grid-cols-3 gap-3 text-sm"><div><div className="text-muted-foreground">{t("cus.creditLimit")}</div><div className="kx-num font-semibold">{fmtMoney(d.customerAccount.creditLimit)}</div></div><div><div className="text-muted-foreground">{t("cus.balance")}</div><div className="kx-num font-semibold">{fmtMoney(d.customerAccount.balance)}</div></div><div><div className="text-muted-foreground">{t("cus.available")}</div><div className="kx-num font-semibold">{fmtMoney(d.customerAccount.available)}</div></div></div> : <p className="text-sm text-muted-foreground">{t("cus.noCredit")}</p>}
            {can("customer.credit") && can("pos.refund_approve") && <form className="mt-4 flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); credit.mutate(); }}><Field label={t("cus.creditLimit")}>{(i) => <Input id={i} inputMode="decimal" required pattern="[0-9]+(\.[0-9]{1,2})?" value={limit} onChange={(e) => setLimit(e.target.value)} className="w-32" />}</Field><Button type="submit" size="sm">{t("cus.openCredit")}</Button></form>}</Card>
          <Card title={t("cus.consent")}><div className="space-y-3 text-sm">
            <label className="flex items-start gap-2"><input type="checkbox" className="mt-1" checked={d.consentDataProcessing} disabled={!can("customer.write")} onChange={(e) => consent.mutate({ dataProcessing: e.target.checked, marketing: d.consentMarketing })} />{t("cus.consentData")}</label>
            <label className="flex items-start gap-2"><input type="checkbox" className="mt-1" checked={d.consentMarketing} disabled={!can("customer.write")} onChange={(e) => consent.mutate({ dataProcessing: d.consentDataProcessing, marketing: e.target.checked })} />{t("cus.consentMarketing")}</label>
            {d.consentRecordedAt && <p className="text-xs text-muted-foreground">{t("cus.consentSaved", { date: fmtDate(d.consentRecordedAt) })}</p>}</div></Card>
        </div>}
        <CustomerForm key={d.id + String(edit)} open={edit} onClose={() => setEdit(false)} edit={d} />
      </div>}
    </Modal>
  );
}

function MergeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const dups = useQuery({ queryKey: ["customers", "duplicates"], queryFn: () => api<{ groups: Array<{ reason: string; customers: Array<{ id: string; displayName: string; phone: string | null; customerNo: string | null; birthYear: number | null }> }> }>("/customers/duplicates"), enabled: open });
  const merge = useAction((v: { keep: string; source: string }) => api(`/customers/${v.keep}/merge`, { body: { sourceId: v.source } }), ["customers", "customer"]);
  return (
    <Modal open={open} onClose={onClose} title={t("cus.mergeTitle")} wide>
      {!dups.data?.groups.length ? <Empty>{t("cus.mergeNone")}</Empty> : <div className="space-y-4">{dups.data.groups.map((g, gi) => <Card key={gi} title={t(g.reason === "SAME_PHONE" ? "cus.reasonPHONE" : "cus.reasonNAME")}><ul className="space-y-2">{g.customers.map((c) => <li key={c.id} className="flex items-center justify-between gap-3 text-sm"><span><span className="font-medium">{c.displayName}</span> <span className="text-muted-foreground" dir="ltr">{c.customerNo} · {c.phone ?? ""}</span></span>
        <div className="flex gap-2">{g.customers.filter((o) => o.id !== c.id).map((o) => <Button key={o.id} size="sm" variant="outline" onClick={() => { if (window.confirm(t("cus.mergeConfirm", { source: o.displayName, target: c.displayName }))) merge.mutate({ keep: c.id, source: o.id }); }}><GitMerge aria-hidden className="size-3.5" />{t("cus.mergeKeep")}</Button>)}</div></li>)}</ul></Card>)}</div>}
      <div className="mt-3"><ErrorNote error={merge.error} /></div>
    </Modal>
  );
}

export function Customers() {
  const { t } = useTranslation();
  const { can } = useAuth();
  const [q, setQ] = useState(""); const [filter, setFilter] = useState<"" | "credit" | "allergies">(""); const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false); const [sel, setSel] = useState<string | null>(null); const [merge, setMerge] = useState(false);
  const query = { q: q || undefined, page, pageSize: 25, credit: filter === "credit" ? "true" : undefined, allergies: filter === "allergies" ? "true" : undefined };
  const res = useQuery({ queryKey: ["customers", query], queryFn: () => api<Page<Customer>>("/customers", { query }), placeholderData: (x) => x });
  return (
    <>
      <PageHeader title={t("cus.title")} subtitle={t("cus.subtitle")} actions={<>{can("customer.merge") && <Button variant="outline" onClick={() => setMerge(true)}><GitMerge aria-hidden className="size-4" />{t("cus.merge")}</Button>}{can("customer.write") && <Button onClick={() => setOpen(true)}><Plus aria-hidden className="size-4" />{t("cus.new")}</Button>}</>} />
      <div className="mb-4 flex flex-wrap items-center gap-3"><SearchInput label={t("cus.search")} placeholder={t("cus.search")} value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="min-w-72 flex-1" />
        <Segmented label={t("common.type")} value={filter} onChange={(v) => { setFilter(v); setPage(1); }} options={[{ id: "", label: t("cus.filterAll") }, { id: "credit", label: t("cus.filterCredit") }, { id: "allergies", label: t("cus.filterAllergy") }]} /></div>
      <ErrorNote error={res.error} />
      <Card className="p-0">{res.isLoading ? <TableSkeleton rows={8} cols={6} /> : (
        <Table head={[t("cus.number"), t("cus.name"), t("cus.phone"), t("cus.tier"), t("cus.allergies"), t("cus.balance")]} numeric={[5]} hideOnPhone={[0, 4]} empty={!res.data?.items.length ? <Empty hint={t("cus.emptyHint")}>{t("cus.empty")}</Empty> : null}>
          {res.data?.items.map((c) => <tr key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSel(c.id)}>
            <Td className="font-mono text-xs text-muted-foreground">{c.customerNo}</Td>
            <Td><button type="button" className="flex items-center gap-2 text-start font-medium hover:underline" onClick={(e) => { e.stopPropagation(); setSel(c.id); }}><UserRound aria-hidden className="size-4 text-muted-foreground" />{c.displayName}</button></Td>
            <Td dir="ltr" className="text-end">{c.phone ?? "—"}</Td><Td><TierBadge tier={c.loyaltyTier} /> <span className="kx-num text-xs text-muted-foreground">{fmtNum(c.loyaltyPoints)}</span></Td>
            <Td><div className="flex flex-wrap gap-1">{c.allergies.slice(0, 3).map((a) => <Badge key={a} tone="bad">{a}</Badge>)}</div></Td>
            <Td className="kx-num text-end">{c.customerAccount ? fmtMoney(c.customerAccount.balance) : "—"}</Td></tr>)}
        </Table>)}</Card>
      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground"><span>{t("common.total", { count: res.data?.total ?? 0 })}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>{t("common.prev")}</Button><Button size="sm" variant="outline" disabled={(res.data?.items.length ?? 0) < 25} onClick={() => setPage(page + 1)}>{t("common.next")}</Button></div></div>
      <CustomerForm open={open} onClose={() => setOpen(false)} onSaved={(c) => setSel(c.id)} />
      <Profile id={sel} onClose={() => setSel(null)} />
      <MergeModal open={merge} onClose={() => setMerge(false)} />
    </>
  );
}
