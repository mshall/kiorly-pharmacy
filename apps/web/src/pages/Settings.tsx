import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, Select, Spinner, Table, Tabs, Td } from "@/components/ui";
import { fmtDateTime } from "@/lib/format";
import { useToast } from "@/lib/toast";
import type { Role } from "@/lib/types";

interface Staff { id: string; displayName: string; email: string | null; role: Role; branchId: string | null; pharmacistLicenceNo: string | null; active: boolean }
interface Branch { id: string; name: string; code: string | null; licenceNo: string | null; active: boolean }
const ROLES: Role[] = ["OWNER", "PHARMACIST", "BRANCH_MANAGER", "CASHIER", "CHAIN_OPS"];

function StaffTab() {
  const { t } = useTranslation();
  const qc = useQueryClient(); const toast = useToast();
  const staff = useQuery({ queryKey: ["staff"], queryFn: () => api<Staff[]>("/staff") });
  const branches = useQuery({ queryKey: ["branches"], queryFn: () => api<Branch[]>("/branches") });
  const [open, setOpen] = useState(false); const [f, setF] = useState({ displayName: "", email: "", password: "", role: "CASHIER" as Role, branchId: "", pharmacistLicenceNo: "" });
  const create = useMutation({ mutationFn: () => api("/staff", { body: { ...f, branchId: f.branchId || undefined, pharmacistLicenceNo: f.pharmacistLicenceNo || undefined } }), onSuccess: () => { toast(t("common.saved")); setOpen(false); void qc.invalidateQueries({ queryKey: ["staff"] }); } });
  const toggle = useMutation({ mutationFn: (s: Staff) => api(`/staff/${s.id}`, { method: "PATCH", body: { active: !s.active } }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["staff"] }) });
  return (
    <Card title={t("set.staff")} actions={<Button size="sm" onClick={() => setOpen(true)}>{t("set.addStaff")}</Button>}>
      <p className="mb-3 text-sm text-muted-foreground">{t("set.rbacNote")}</p>
      <ErrorNote error={toggle.error} />
      {staff.isLoading ? <Spinner /> : (
        <Table head={[t("sup.name"), t("auth.email"), t("set.role"), t("common.branch"), t("set.licence"), t("common.status"), ""]}>
          {staff.data?.map((s) => <tr key={s.id}><Td className="font-medium">{s.displayName}</Td><Td>{s.email}</Td><Td><Badge tone="info">{t(`roles.${s.role}`)}</Badge></Td><Td>{branches.data?.find((b) => b.id === s.branchId)?.name ?? t("set.allBranches")}</Td><Td>{s.pharmacistLicenceNo ?? "—"}</Td><Td><Badge tone={s.active ? "good" : "bad"}>{s.active ? t("set.active") : t("set.inactive")}</Badge></Td><Td><Button size="sm" variant="outline" onClick={() => toggle.mutate(s)}>{s.active ? t("set.deactivate") : t("set.activate")}</Button></Td></tr>)}
        </Table>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title={t("set.addStaff")}>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
          <Field label={t("sup.name")}>{(id) => <Input id={id} required value={f.displayName} onChange={(e) => setF({ ...f, displayName: e.target.value })} />}</Field>
          <Field label={t("auth.email")}>{(id) => <Input id={id} type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />}</Field>
          <Field label={t("auth.password")} hint={t("auth.passwordHint")}>{(id) => <Input id={id} type="password" required minLength={8} autoComplete="new-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />}</Field>
          <Field label={t("set.role")}>{(id) => <Select id={id} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as Role })}>{ROLES.map((r) => <option key={r} value={r}>{t(`roles.${r}`)}</option>)}</Select>}</Field>
          <Field label={t("common.branch")}>{(id) => <Select id={id} value={f.branchId} onChange={(e) => setF({ ...f, branchId: e.target.value })}><option value="">{t("set.allBranches")}</option>{branches.data?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>}</Field>
          {f.role === "PHARMACIST" && <Field label={t("set.licence")} hint={t("set.licenceHint")}>{(id) => <Input id={id} required value={f.pharmacistLicenceNo} onChange={(e) => setF({ ...f, pharmacistLicenceNo: e.target.value })} />}</Field>}
          <ErrorNote error={create.error} /><Button type="submit" disabled={create.isPending}>{t("common.save")}</Button>
        </form>
      </Modal>
    </Card>
  );
}

function BranchesTab() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const branches = useQuery({ queryKey: ["branches"], queryFn: () => api<Branch[]>("/branches") });
  const [name, setName] = useState("");
  const add = useMutation({ mutationFn: () => api("/branches", { body: { name } }), onSuccess: () => { setName(""); void qc.invalidateQueries({ queryKey: ["branches"] }); } });
  return (
    <Card title={t("set.branches")}>
      <Table head={[t("sup.name"), t("onb.branchLicence"), t("common.status")]}>{branches.data?.map((b) => <tr key={b.id}><Td className="font-medium">{b.name}</Td><Td>{b.licenceNo ?? "—"}</Td><Td><Badge tone={b.active ? "good" : "bad"}>{b.active ? t("set.active") : t("set.inactive")}</Badge></Td></tr>)}</Table>
      <form className="mt-3 flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); add.mutate(); }}><Field label={t("set.newBranch")}>{(id) => <Input id={id} required minLength={2} value={name} onChange={(e) => setName(e.target.value)} />}</Field><Button type="submit">{t("set.addBranch")}</Button></form>
      <ErrorNote error={add.error} />
    </Card>
  );
}

function PharmacyTab() {
  const { t } = useTranslation();
  const toast = useToast(); const qc = useQueryClient();
  const q = useQuery({ queryKey: ["settings"], queryFn: () => api<{ name: string; edition: string; market: string; pack: { currency: string; vat: { label: string; defaultRate: string }; shiftVarianceThreshold: string }; settings: Record<string, string> }>("/settings") });
  const [f, setF] = useState<Record<string, string>>({});
  const save = useMutation({ mutationFn: () => api("/settings", { method: "PATCH", body: f }), onSuccess: () => { toast(t("common.saved")); setF({}); void qc.invalidateQueries({ queryKey: ["settings"] }); } });
  if (!q.data) return <Spinner />;
  const v = (k: string, d = "") => f[k] ?? q.data.settings[k] ?? d;
  const set = (k: string) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  return (
    <Card title={q.data.name} actions={<Badge tone="info">{q.data.edition}</Badge>}>
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
        <Field label={t("set.vatRate")} hint={t("set.vatHint", { default: q.data.pack.vat.defaultRate })}>{(id) => <Input id={id} inputMode="decimal" value={v("vatRate", q.data.pack.vat.defaultRate)} onChange={set("vatRate")} />}</Field>
        <Field label={t("set.varianceThreshold")}>{(id) => <Input id={id} inputMode="decimal" value={v("shiftVarianceThreshold", q.data.pack.shiftVarianceThreshold)} onChange={set("shiftVarianceThreshold")} />}</Field>
        <Field label={t("set.ownerPhone")} hint={t("set.ownerPhoneHint")}>{(id) => <Input id={id} inputMode="tel" value={v("ownerPhone")} onChange={set("ownerPhone")} />}</Field>
        <Field label={t("set.receiptFooter")}>{(id) => <Input id={id} value={v("receiptFooter")} onChange={set("receiptFooter")} />}</Field>
        <div className="sm:col-span-2"><ErrorNote error={save.error} /><Button type="submit" disabled={save.isPending || !Object.keys(f).length}>{t("common.save")}</Button></div>
      </form>
      <p className="mt-4 text-xs text-muted-foreground">{t("set.noTaxNote")}</p>
    </Card>
  );
}

function MarketplaceTab() {
  const { t } = useTranslation();
  const { me, flag } = useAuth();
  const toast = useToast(); const qc = useQueryClient();
  const q = useQuery({ queryKey: ["mkt-settings"], queryFn: () => api<Array<{ branchId: string; optedIn: boolean; deliveryRadiusKm: string; prepMinutes: number; slaMinutes: number }>>("/kiorex-orders/settings"), enabled: flag("pharmacy.kiorex_orders"), retry: false });
  const save = useMutation({ mutationFn: (v: { branchId: string; optedIn: boolean; deliveryRadiusKm?: string; prepMinutes?: number; slaMinutes?: number }) => api(`/kiorex-orders/settings/${v.branchId}`, { method: "PUT", body: { optedIn: v.optedIn, deliveryRadiusKm: v.deliveryRadiusKm, prepMinutes: v.prepMinutes, slaMinutes: v.slaMinutes } }), onSuccess: () => { toast(t("common.saved")); void qc.invalidateQueries({ queryKey: ["mkt-settings"] }); } });
  if (!flag("pharmacy.kiorex_orders")) return <Card><p className="text-sm">{t("errors.featureDisabled", { key: "pharmacy.kiorex_orders" })}</p></Card>;
  return (
    <Card title={t("set.marketplace")}>
      <p className="mb-3 text-sm text-muted-foreground">{t("set.marketplaceNote")}</p>
      <ErrorNote error={save.error} />
      <Table head={[t("common.branch"), t("set.optIn"), t("set.radius"), t("set.prep"), t("set.sla")]}>
        {me?.branches.map((b) => { const s = q.data?.find((x) => x.branchId === b.id); return (
          <tr key={b.id}><Td className="font-medium">{b.name}</Td>
            <Td><label className="flex items-center gap-2"><input type="checkbox" checked={!!s?.optedIn} onChange={(e) => save.mutate({ branchId: b.id, optedIn: e.target.checked })} />{s?.optedIn ? t("set.on") : t("set.off")}</label></Td>
            <Td>{s?.deliveryRadiusKm ?? "5.00"} km</Td><Td>{s?.prepMinutes ?? 30}</Td><Td>{s?.slaMinutes ?? 10}</Td></tr>); })}
      </Table>
    </Card>
  );
}

function SystemTab() {
  const { t } = useTranslation();
  const { flag } = useAuth();
  const n = useQuery({ queryKey: ["notifications"], queryFn: () => api<Array<{ id: string; channel: string; recipient: string; template: string; body: string; createdAt: string; provider: string }>>("/dashboard/notifications") });
  const o = useQuery({ queryKey: ["outbox"], queryFn: () => api<Array<{ id: string; type: string; aggregateId: string; status: string; attempts: number; occurredAt: string }>>("/dashboard/outbox") });
  return (
    <div className="space-y-4">
      <Card title={t("set.flags")}>
        <ul className="grid gap-2 sm:grid-cols-2">{["pharmacy.module", "pharmacy.kiorex_orders", "pharmacy.forecasting", "pharmacy.insurer_claims"].map((k) => <li key={k} className="flex items-center justify-between rounded-md border border-border p-2 text-sm"><code>{k}</code><Badge tone={flag(k) ? "good" : "bad"}>{flag(k) ? t("set.on") : t("set.off")}</Badge></li>)}</ul>
        <p className="mt-3 text-xs text-muted-foreground">{t("set.safetyNotFlags")}</p>
      </Card>
      <Card title={t("set.inbox")}>
        <p className="mb-2 text-xs text-muted-foreground">{t("set.inboxNote")}</p>
        <Table head={[t("common.date"), t("set.channel"), t("set.recipient"), t("common.note")]} empty={!n.data?.length ? <Empty>{t("common.none")}</Empty> : null}>{n.data?.map((m) => <tr key={m.id}><Td>{fmtDateTime(m.createdAt)}</Td><Td><Badge>{m.channel}</Badge></Td><Td>{m.recipient}</Td><Td className="text-xs">{m.body}</Td></tr>)}</Table>
      </Card>
      <Card title={t("set.outbox")}>
        <Table head={[t("common.date"), t("common.type"), "ID", t("common.status")]} empty={!o.data?.length ? <Empty>{t("common.none")}</Empty> : null}>{o.data?.map((e) => <tr key={e.id}><Td>{fmtDateTime(e.occurredAt)}</Td><Td>{e.type}</Td><Td className="font-mono text-xs">{e.aggregateId}</Td><Td><Badge tone={e.status === "SENT" ? "good" : e.status === "FAILED" ? "bad" : "warn"}>{e.status}</Badge></Td></tr>)}</Table>
      </Card>
    </div>
  );
}

export function Settings() {
  const { t } = useTranslation();
  const { can } = useAuth();
  const [tab, setTab] = useState("pharmacy");
  const tabs = [{ id: "pharmacy", label: t("set.pharmacy") }, ...(can("staff.manage") ? [{ id: "staff", label: t("set.staff") }] : []), { id: "branches", label: t("set.branches") }, { id: "marketplace", label: t("set.marketplace") }, { id: "system", label: t("set.system") }];
  return (
    <>
      <PageHeader title={t("set.title")} />
      <Tabs value={tab} onChange={setTab} tabs={tabs} />
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "pharmacy" && <PharmacyTab />}{tab === "staff" && <StaffTab />}{tab === "branches" && <BranchesTab />}{tab === "marketplace" && <MarketplaceTab />}{tab === "system" && <SystemTab />}
      </div>
    </>
  );
}
