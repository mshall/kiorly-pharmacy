import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, Select, Spinner, Table, Td } from "@/components/ui";
import { drugName, fmtDate, fmtMoney } from "@/lib/format";
import { printHtml } from "@/lib/print";
import { useToast } from "@/lib/toast";
import type { Drug, Page } from "@/lib/types";

interface PricePoint { id: string; price: string; effectiveFrom: string; effectiveTo: string | null; branchId: string | null }

function PriceModal({ drug, onClose }: { drug: Drug | null; onClose: () => void }) {
  const { t } = useTranslation();
  const { can, branchId } = useAuth();
  const qc = useQueryClient(); const toast = useToast();
  const [price, setPrice] = useState(""); const [from, setFrom] = useState(new Date(Date.now() + 60_000).toISOString().slice(0, 16));
  const hist = useQuery({ queryKey: ["price-history", drug?.id], queryFn: () => api<PricePoint[]>(`/catalogue/prices/${drug!.id}`), enabled: !!drug });
  const subs = useQuery({ queryKey: ["substitutes", drug?.id, branchId], queryFn: () => api<Array<{ drugId: string; brandName: string; brandNameAr: string | null; available: number; price: string | null; nextExpiry: string }>>(`/catalogue/drugs/${drug!.id}/substitutes`, { query: { branchId } }), enabled: !!drug && !!branchId });
  const save = useMutation({
    mutationFn: () => api("/catalogue/prices/bulk", { body: { effectiveFrom: new Date(from).toISOString(), items: [{ drugId: drug!.id, price }] } }),
    onSuccess: () => { toast(t("common.saved")); setPrice(""); void qc.invalidateQueries({ queryKey: ["price-history"] }); },
  });
  return (
    <Modal open={!!drug} onClose={onClose} title={drug ? drugName(drug) : ""} wide>
      {drug && (
        <div className="space-y-4">
          <Card title={t("cat.priceHistory")}>
            {hist.isLoading ? <Spinner /> : (
              <Table head={[t("cat.price"), t("cat.from"), t("cat.to")]}>
                {hist.data?.map((p) => <tr key={p.id}><Td className="font-medium">{fmtMoney(p.price)}</Td><Td>{fmtDate(p.effectiveFrom)}</Td><Td>{p.effectiveTo ? fmtDate(p.effectiveTo) : <Badge tone="good">{t("cat.current")}</Badge>}</Td></tr>)}
              </Table>
            )}
            {can("price.write") && (
              <form className="mt-3 flex flex-wrap items-end gap-3" onSubmit={(e: FormEvent) => { e.preventDefault(); save.mutate(); }}>
                <Field label={t("cat.newPrice")}>{(id) => <Input id={id} inputMode="decimal" required pattern="[0-9]+(\.[0-9]{1,2})?" value={price} onChange={(e) => setPrice(e.target.value)} className="w-32" />}</Field>
                <Field label={t("cat.effectiveFrom")}>{(id) => <Input id={id} type="datetime-local" required value={from} onChange={(e) => setFrom(e.target.value)} />}</Field>
                <Button type="submit" disabled={save.isPending}>{t("common.save")}</Button>
              </form>
            )}
            <ErrorNote error={save.error} />
          </Card>
          <Card title={t("cat.substitutes")}>
            {subs.data?.length ? (
              <Table head={[t("common.product"), t("inv.available"), t("cat.price"), t("inv.nextExpiry")]}>
                {subs.data.map((s) => <tr key={s.drugId}><Td>{drugName(s)}</Td><Td>{s.available}</Td><Td>{s.price ? fmtMoney(s.price) : "—"}</Td><Td>{fmtDate(s.nextExpiry)}</Td></tr>)}
              </Table>
            ) : <Empty>{t("cat.noSubstitutes")}</Empty>}
          </Card>
        </div>
      )}
    </Modal>
  );
}

function AddDrug({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const qc = useQueryClient(); const toast = useToast();
  const blank = { brandName: "", brandNameAr: "", activeIngredient: "", strength: "", dosageForm: "tablet", packSize: "", gtin: "", price: "", rxOnly: false, controlledSchedule: "NONE", coldChain: false };
  const [f, setF] = useState(blank);
  const m = useMutation({
    mutationFn: () => api("/catalogue/drugs", { body: { ...f, brandNameAr: f.brandNameAr || undefined, gtin: f.gtin || undefined, price: f.price || undefined } }),
    onSuccess: () => { toast(t("common.saved")); setF(blank); onClose(); void qc.invalidateQueries({ queryKey: ["drugs"] }); },
  });
  const text = (k: "brandName" | "brandNameAr" | "activeIngredient" | "strength" | "packSize" | "gtin" | "price", label: string, req = false) => <Field label={label}>{(id) => <Input id={id} required={req} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />}</Field>;
  return (
    <Modal open={open} onClose={onClose} title={t("cat.addDrug")} wide>
      <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="grid gap-3 sm:grid-cols-2">
        {text("brandName", t("cat.brand"), true)}{text("brandNameAr", t("cat.brandAr"))}{text("activeIngredient", t("cat.ingredient"), true)}{text("strength", t("cat.strength"), true)}
        <Field label={t("cat.form")}>{(id) => <Select id={id} value={f.dosageForm} onChange={(e) => setF({ ...f, dosageForm: e.target.value })}>{["tablet", "capsule", "syrup", "suspension", "injection", "cream", "ointment", "drops", "inhaler", "powder"].map((x) => <option key={x} value={x}>{x}</option>)}</Select>}</Field>
        {text("packSize", t("cat.pack"), true)}{text("gtin", t("cat.barcode"))}{text("price", t("cat.price"))}
        <Field label={t("cat.schedule")}>{(id) => <Select id={id} value={f.controlledSchedule} onChange={(e) => setF({ ...f, controlledSchedule: e.target.value })}>{["NONE", "SCHEDULE_1", "SCHEDULE_2", "SCHEDULE_3", "SCHEDULE_4"].map((x) => <option key={x} value={x}>{x === "NONE" ? t("cat.notControlled") : x}</option>)}</Select>}</Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.rxOnly} onChange={(e) => setF({ ...f, rxOnly: e.target.checked })} />{t("cat.rxOnly")}</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.coldChain} onChange={(e) => setF({ ...f, coldChain: e.target.checked })} />{t("cat.coldChain")}</label>
        <div className="sm:col-span-2"><ErrorNote error={m.error} /></div>
        <div className="sm:col-span-2"><Button type="submit" disabled={m.isPending}>{t("common.save")}</Button></div>
      </form>
    </Modal>
  );
}

export function Catalogue() {
  const { t } = useTranslation();
  const { can, branchId } = useAuth();
  const [q, setQ] = useState(""); const [filter, setFilter] = useState(""); const [page, setPage] = useState(1);
  const [price, setPrice] = useState<Drug | null>(null); const [add, setAdd] = useState(false);
  const [sel, setSel] = useState<string[]>([]);
  const query: Record<string, string | number | undefined> = { q: q || undefined, page, pageSize: 25, ...(filter === "rx" ? { rxOnly: "true" } : filter === "controlled" ? { controlled: "true" } : filter === "cold" ? { coldChain: "true" } : filter === "otc" ? { otc: "true" } : {}) };
  const res = useQuery({ queryKey: ["drugs", query], queryFn: () => api<Page<Drug>>("/catalogue/drugs", { query }), placeholderData: (p) => p });
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  return (
    <>
      <PageHeader title={t("cat.title")} actions={<>
        {sel.length > 0 && <Button variant="outline" onClick={() => void printHtml("/catalogue/labels/print", { drugIds: sel.join(","), lang: document.documentElement.lang, branchId: branchId ?? undefined })}>{t("cat.printLabels", { count: sel.length })}</Button>}
        {can("catalogue.write") && <Button onClick={() => setAdd(true)}>{t("cat.addDrug")}</Button>}
      </>} />
      <Card>
        <div className="mb-3 flex flex-wrap gap-3">
          <Field label={t("common.search")}>{(id) => <Input id={id} type="search" placeholder={t("cat.searchHint")} value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="w-72" />}</Field>
          <Field label={t("cat.filter")}>{(id) => <Select id={id} value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}><option value="">{t("common.all")}</option><option value="rx">{t("cat.rxOnly")}</option><option value="controlled">{t("cat.controlled")}</option><option value="cold">{t("cat.coldChain")}</option><option value="otc">OTC</option></Select>}</Field>
        </div>
        <ErrorNote error={res.error} />
        {res.isLoading ? <Spinner /> : (
          <Table head={["", t("common.product"), t("cat.ingredient"), t("cat.strength"), t("cat.form"), t("cat.barcode"), t("cat.flags"), ""]} empty={!res.data?.items.length ? <Empty>{t("common.noResults")}</Empty> : null}>
            {res.data?.items.map((d) => (
              <tr key={d.id}>
                <Td><input type="checkbox" aria-label={t("cat.selectLabel", { name: d.brandName })} checked={sel.includes(d.id)} onChange={() => toggle(d.id)} /></Td>
                <Td className="font-medium">{drugName(d)}</Td><Td>{d.activeIngredient}</Td><Td>{d.strength}</Td><Td>{d.dosageForm}</Td><Td className="font-mono text-xs">{d.gtin ?? "—"}</Td>
                <Td><div className="flex flex-wrap gap-1">{d.rxOnly && <Badge tone="info">Rx</Badge>}{d.controlledSchedule !== "NONE" && <Badge tone="bad">{t("cat.controlled")}</Badge>}{d.coldChain && <Badge tone="warn">{t("cat.coldChain")}</Badge>}{d.otc && <Badge>OTC</Badge>}</div></Td>
                <Td><Button size="sm" variant="outline" onClick={() => setPrice(d)}>{t("cat.priceAndSubs")}</Button></Td>
              </tr>
            ))}
          </Table>
        )}
        <div className="mt-3 flex items-center justify-between text-sm">
          <span>{t("common.total", { count: res.data?.total ?? 0 })}</span>
          <div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>{t("common.prev")}</Button><Button size="sm" variant="outline" disabled={(res.data?.items.length ?? 0) < 25} onClick={() => setPage(page + 1)}>{t("common.next")}</Button></div>
        </div>
      </Card>
      <PriceModal drug={price} onClose={() => setPrice(null)} />
      <AddDrug open={add} onClose={() => setAdd(false)} />
    </>
  );
}
