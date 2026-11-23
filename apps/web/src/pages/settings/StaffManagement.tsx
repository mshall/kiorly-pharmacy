import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyRound, Pencil, UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import type { Role } from "@/lib/types";
import { Avatar, Button, Card, Empty, ErrorNote, Field, Input, Modal, Segmented, SearchInput, Select, Switch, Table, Td, Toolbar } from "@/components/ui";
import { StatusChip, TableSkeleton } from "@/brand/ui-kit";
import { fmtDateTime } from "@/lib/format";
import { isE164, normalizeStaffPhone } from "@/lib/staff-phone";

export interface Staff { id: string; displayName: string; email: string | null; phone: string | null; role: Role; branchId: string | null; pharmacistLicenceNo: string | null; active: boolean; passportLinked: boolean; lastLoginAt: string | null }
interface Branch { id: string; name: string; active: boolean }
export const STAFF_ROLES: Role[] = ["OWNER", "PHARMACIST", "BRANCH_MANAGER", "CASHIER", "ASSISTANT", "CHAIN_OPS"];

type Form = { id?: string; displayName: string; email: string; password: string; phone: string; role: Role; branchId: string; pharmacistLicenceNo: string; active: boolean };
const empty: Form = { displayName: "", email: "", password: "", phone: "", role: "CASHIER", branchId: "", pharmacistLicenceNo: "", active: true };

/**
 * Staff management (Settings > Staff and roles): list, add, edit name / role / branch / licence / active, and set the staff member's mobile
 * number (E.164). The number is what links a person's Kiorex Passport to their staff row on first Passport sign-in; role, branch and
 * permissions always come from this row, never from Passport. The API enforces everything (staff.manage, phone format and uniqueness).
 */
export function StaffManagement() {
  const { t } = useTranslation();
  const qc = useQueryClient(); const toast = useToast(); const { me } = useAuth();
  const staff = useQuery({ queryKey: ["staff"], queryFn: () => api<Staff[]>("/staff") });
  const branches = useQuery({ queryKey: ["branches"], queryFn: () => api<Branch[]>("/branches") });
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [q, setQ] = useState("");
  const [f, setF] = useState<Form | null>(null);
  const done = () => { setF(null); void qc.invalidateQueries({ queryKey: ["staff"] }); toast(t("common.saved")); };
  const save = useMutation({
    mutationFn: (v: Form) => {
      const phone = normalizeStaffPhone(v.phone);
      const common = { displayName: v.displayName, role: v.role, branchId: v.branchId || undefined, pharmacistLicenceNo: v.role === "PHARMACIST" ? v.pharmacistLicenceNo || undefined : undefined };
      return v.id
        ? api(`/staff/${v.id}`, { method: "PATCH", body: { ...common, active: v.active, phone: phone || null, ...(v.password ? { password: v.password } : {}) } })
        : api("/staff", { body: { ...common, email: v.email, password: v.password, ...(phone ? { phone } : {}) } });
    },
    onSuccess: done,
  });
  const toggle = useMutation({ mutationFn: (s: Staff) => api(`/staff/${s.id}`, { method: "PATCH", body: { active: !s.active } }), onSuccess: () => void qc.invalidateQueries({ queryKey: ["staff"] }) });

  const rows = useMemo(() => (staff.data ?? []).filter((s) => (filter === "all" || (filter === "active") === s.active)
    && (!q.trim() || `${s.displayName} ${s.email ?? ""} ${s.phone ?? ""}`.toLowerCase().includes(q.trim().toLowerCase()))), [staff.data, filter, q]);
  const phoneBad = !!f?.phone.trim() && !isE164(f.phone);
  const edit = (s: Staff) => setF({ id: s.id, displayName: s.displayName, email: s.email ?? "", password: "", phone: s.phone ?? "", role: s.role, branchId: s.branchId ?? "", pharmacistLicenceNo: s.pharmacistLicenceNo ?? "", active: s.active });

  return (
    <Card title={t("set.staff")} actions={<Button size="sm" onClick={() => setF({ ...empty })}><UserPlus aria-hidden className="size-4" />{t("set.addStaff")}</Button>}>
      <p className="mb-1 text-sm text-muted-foreground">{t("set.rbacNote")}</p>
      <p className="mb-4 text-sm text-muted-foreground">{t("set.staffPassportNote")}</p>
      <Toolbar>
        <SearchInput label={t("set.staffSearch")} placeholder={t("set.staffSearch")} value={q} onChange={(e) => setQ(e.target.value)} className="w-full sm:w-72" />
        <Segmented label={t("common.status")} value={filter} onChange={setFilter} options={[{ id: "all", label: t("common.all") }, { id: "active", label: t("set.active") }, { id: "inactive", label: t("set.inactive") }]} />
      </Toolbar>
      <ErrorNote error={toggle.error} />
      {staff.isLoading ? <TableSkeleton rows={5} cols={6} /> : (
        <Table head={[t("sup.name"), t("set.staffPhone"), t("set.role"), t("common.branch"), t("set.passport"), t("common.status"), ""]} hideOnPhone={[3, 4]} empty={!rows.length ? <Empty>{t("common.none")}</Empty> : null}>
          {rows.map((s) => (
            <tr key={s.id} data-testid={`staff-row-${s.email ?? s.id}`}>
              <Td><div className="flex items-center gap-3"><Avatar name={s.displayName} /><div className="min-w-0"><div className="font-medium leading-tight">{s.displayName}{s.id === me?.user.id && <span className="ms-2 text-xs font-normal text-muted-foreground">({t("set.you")})</span>}</div><div className="text-xs text-muted-foreground" dir="ltr">{s.email}</div></div></div></Td>
              <Td><bdi dir="ltr" className="tabular-nums">{s.phone ?? <span className="text-muted-foreground">—</span>}</bdi></Td>
              <Td><StatusChip tone={s.role === "OWNER" ? "info" : "neutral"}>{t(`roles.${s.role}`)}</StatusChip></Td>
              <Td>{branches.data?.find((b) => b.id === s.branchId)?.name ?? <span className="text-muted-foreground">{t("set.allBranches")}</span>}</Td>
              <Td><StatusChip tone={s.passportLinked ? "good" : s.phone ? "warn" : "neutral"}>{s.passportLinked ? t("set.passportLinked") : s.phone ? t("set.passportPending") : t("set.passportNoPhone")}</StatusChip></Td>
              <Td><StatusChip tone={s.active ? "good" : "bad"}>{s.active ? t("set.active") : t("set.inactive")}</StatusChip></Td>
              <Td className="text-end"><span className="inline-flex gap-2">
                <Button size="sm" variant="outline" onClick={() => edit(s)} aria-label={`${t("set.editStaff")}: ${s.displayName}`}><Pencil aria-hidden className="size-4" /><span className="max-sm:sr-only">{t("set.editBtn")}</span></Button>
                <Button size="sm" variant="outline" disabled={s.id === me?.user.id} onClick={() => toggle.mutate(s)}>{s.active ? t("set.deactivate") : t("set.activate")}</Button>
              </span></Td>
            </tr>
          ))}
        </Table>
      )}
      <Modal open={!!f} onClose={() => { setF(null); save.reset(); }} title={f?.id ? t("set.editStaff") : t("set.addStaff")}>
        {f && (
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (!phoneBad) save.mutate(f); }}>
            <Field label={t("sup.name")}>{(id) => <Input id={id} required value={f.displayName} onChange={(e) => setF({ ...f, displayName: e.target.value })} />}</Field>
            <Field label={t("auth.email")}>{(id) => <Input id={id} type="email" required disabled={!!f.id} dir="ltr" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />}</Field>
            <Field label={t("set.staffPhone")} hint={t("set.staffPhoneHint")} error={phoneBad ? t("set.staffPhoneInvalid") : undefined}>
              {(id) => <Input id={id} type="tel" inputMode="tel" dir="ltr" autoComplete="off" placeholder="+201000002004" aria-invalid={phoneBad || undefined} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />}
            </Field>
            <Field label={f.id ? t("set.newPassword") : t("auth.password")} hint={f.id ? t("set.newPasswordHint") : t("auth.passwordHint")}>
              {(id) => <Input id={id} type="password" required={!f.id} minLength={8} autoComplete="new-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />}
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t("set.role")}>{(id) => <Select id={id} disabled={f.id === me?.user.id} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as Role })}>{STAFF_ROLES.map((r) => <option key={r} value={r}>{t(`roles.${r}`)}</option>)}</Select>}</Field>
              <Field label={t("common.branch")}>{(id) => <Select id={id} value={f.branchId} onChange={(e) => setF({ ...f, branchId: e.target.value })}><option value="">{t("set.allBranches")}</option>{branches.data?.filter((b) => b.active).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>}</Field>
            </div>
            {f.role === "PHARMACIST" && <Field label={t("set.licence")} hint={t("set.licenceHint")}>{(id) => <Input id={id} required value={f.pharmacistLicenceNo} onChange={(e) => setF({ ...f, pharmacistLicenceNo: e.target.value })} />}</Field>}
            {f.id && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2">
                <span className="text-sm font-medium">{t("set.active")}</span>
                <Switch checked={f.active} disabled={f.id === me?.user.id} label={t("set.active")} onChange={(v) => setF({ ...f, active: v })} />
              </div>
            )}
            {f.id && <p className="flex items-center gap-2 text-xs text-muted-foreground"><KeyRound aria-hidden className="size-3.5" />{(staff.data?.find((s) => s.id === f.id)?.passportLinked) ? t("set.passportLinkedHint") : t("set.passportPendingHint")}{staff.data?.find((s) => s.id === f.id)?.lastLoginAt ? ` · ${fmtDateTime(staff.data.find((s) => s.id === f.id)!.lastLoginAt!)}` : ""}</p>}
            <ErrorNote error={save.error} />
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setF(null)}>{t("common.cancel")}</Button><Button type="submit" disabled={save.isPending || phoneBad}>{t("common.save")}</Button></div>
          </form>
        )}
      </Modal>
    </Card>
  );
}
