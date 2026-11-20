import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ArrowRight, Printer, Plus, Snowflake, ShieldAlert, Tag, X } from "lucide-react";
import { Badge, Button, Card, Empty, ErrorNote, ExpiryChip, Field, Input, Modal, PageHeader, SearchInput, Segmented, Select, Table, Tabs, Td, Toolbar } from "@/components/ui";
import { useAction, useForm } from "@/lib/hooks";
import { TableSkeleton } from "@/brand/ui-kit";
import { Sparkline } from "@/components/charts";
import { drugName, fmtDate, fmtMoney } from "@/lib/format";
import { printHtml } from "@/lib/print";
import { useToast } from "@/lib/toast";
import type { Drug, Page } from "@/lib/types";

interface PricePoint { id: string; price: string; effectiveFrom: string; effectiveTo: string | null; branchId: string | null }

const daysTo = (iso: string) => Math.floor((new Date(iso).getTime() - Date.now()) / 86_400_000);

function PriceModal({ drug, onClose }: { drug: Drug | null; onClose: () => void }) {
  const { t } = useTranslation();
  const { can, branchId } = useAuth();
  const qc = useQueryClient(); const toast = useToast();
  const [price, setPrice] = useState(""); const [from, setFrom] = useState(() => new Date(Date.now() + 60_000).toISOString().slice(0, 16));
  const hist = useQuery({ queryKey: ["price-history", drug?.id], queryFn: () => api<PricePoint[]>(`/catalogue/prices/${drug!.id}`), enabled: !!drug });
  const subs = useQuery({ queryKey: ["substitutes", drug?.id, branchId], queryFn: () => api<Array<{ drugId: string; brandName: string; brandNameAr: string | null; available: number; price: string | null; nextExpiry: string }>>(`/catalogue/drugs/${drug!.id}/substitutes`, { query: { branchId } }), enabled: !!drug && !!branchId });
  const save = useMutation({
    mutationFn: () => api("/catalogue/prices/bulk", { body: { effectiveFrom: new Date(from).toISOString(), items: [{ drugId: drug!.id, price }] } }),
    onSuccess: () => { toast(t("common.saved")); setPrice(""); void qc.invalidateQueries({ queryKey: ["price-history"] }); },
  });
  const current = hist.data?.find((p) => !p.effectiveTo) ?? hist.data?.[0];
  const series = [...(hist.data ?? [])].reverse().map((p) => Number(p.price));
  const cur = current ? Number(current.price) : null;
  const group = [...(subs.data ?? [])].sort((x, y) => Number(x.price ?? Infinity) - Number(y.price ?? Infinity));
  const cheapest = group.find((g) => g.available > 0 && g.price)?.drugId;
  return (
    <Modal open={!!drug} onClose={onClose} title={drug ? drugName(drug) : ""} wide>
      {drug && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl bg-muted/60 p-4">
            <div>
              <div className="text-xs font-medium text-muted-foreground">{t("cat.currentPrice")}</div>
              <div className="kx-num text-3xl font-semibold tracking-tight">{current ? fmtMoney(current.price) : "—"}</div>{current && <div className="text-xs text-muted-foreground">{t("cat.since", { date: fmtDate(current.effectiveFrom) })}</div>}
            </div>
            <Sparkline values={series} label={t("cat.priceTrend")} />
            <div className="ms-auto text-sm text-muted-foreground"><span className="font-medium text-foreground"><bdi>{drug.strength}</bdi> · <bdi>{drug.dosageForm}</bdi></span><br /><bdi>{drug.activeIngredient}</bdi> · <bdi>{drug.packSize}</bdi></div>
          </div>
          <section aria-labelledby="pb-h">
            <h3 id="pb-h" className="mb-2 text-sm font-semibold">{t("cat.priceBook")}</h3>
            {hist.isLoading ? <TableSkeleton rows={3} cols={3} /> : (
              <Table dense head={[t("cat.price"), t("cat.from"), t("cat.to")]} numeric={[0]} empty={!hist.data?.length ? <Empty hint={t("cat.noPriceHint")}>{t("cat.noPrice")}</Empty> : null}>
                {hist.data?.map((p) => <tr key={p.id}><Td className="kx-num text-end font-medium">{fmtMoney(p.price)}</Td><Td>{fmtDate(p.effectiveFrom)}</Td><Td>{p.effectiveTo ? fmtDate(p.effectiveTo) : <Badge tone="good">{t("cat.current")}</Badge>}</Td></tr>)}
              </Table>
            )}
            {can("price.write") && (
              <form className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-border p-3" onSubmit={(e: FormEvent) => { e.preventDefault(); save.mutate(); }}>
                <Field label={t("cat.newPrice")}>{(id) => <Input id={id} inputMode="decimal" required pattern="[0-9]+(\.[0-9]{1,2})?" value={price} onChange={(e) => setPrice(e.target.value)} className="w-32" />}</Field>
                <Field label={t("cat.effectiveFrom")} hint={t("cat.scheduleHint")}>{(id) => <Input id={id} type="datetime-local" required value={from} onChange={(e) => setFrom(e.target.value)} />}</Field>
                <Button type="submit" disabled={save.isPending}>{t("common.save")}</Button>
              </form>
            )}
            <div className="mt-2"><ErrorNote error={save.error} /></div>
          </section>
          <UomSection drugId={drug.id} baseUnit={drug.packSize} canWrite={can("catalogue.write")} />
          <section aria-labelledby="sub-h">
            <div className="mb-2 flex items-baseline justify-between gap-2"><h3 id="sub-h" className="text-sm font-semibold">{t("cat.substitutes")}</h3><span className="text-xs text-muted-foreground">{t("cat.subsHint")}</span></div>
            {subs.isLoading ? <TableSkeleton rows={3} cols={4} /> : group.length ? (
              <Table dense head={[t("common.product"), t("inv.available"), t("cat.price"), t("inv.nextExpiry")]} numeric={[1, 2]}>
                {group.map((x) => { const p = x.price ? Number(x.price) : null; const delta = p !== null && cur ? Math.round(((p - cur) / cur) * 100) : null; return (
                  <tr key={x.drugId}>
                    <Td className="font-medium">{drugName(x)} {x.drugId === cheapest && <Badge tone="good">{t("cat.bestValue")}</Badge>}</Td>
                    <Td className="text-end">{x.available > 0 ? <span className="kx-num font-medium">{x.available}</span> : <Badge tone="bad">{t("cat.outOfStock")}</Badge>}</Td>
                    <Td className="text-end">{p !== null ? <><span className="kx-num font-medium">{fmtMoney(x.price)}</span>{delta !== null && delta !== 0 && <span className={`kx-num ms-2 text-xs ${delta < 0 ? "text-[hsl(var(--success))]" : "text-muted-foreground"}`}>{delta > 0 ? "+" : ""}{delta}%</span>}</> : "—"}</Td>
                    <Td><ExpiryChip days={daysTo(x.nextExpiry)} label={(k, n) => (k === "expired" ? t("inv.expiredAgo", { count: Math.abs(n) }) : t("inv.inDays", { count: n }))} /></Td>
                  </tr>); })}
              </Table>
            ) : <Empty hint={t("cat.noSubstitutesHint")}>{t("cat.noSubstitutes")}</Empty>}
          </section>
        </div>
      )}
    </Modal>
  );
}

function UomSection({ drugId, canWrite }: { drugId: string; baseUnit: string; canWrite: boolean }) {
  const { t } = useTranslation();
  const q = useQuery({ queryKey: ["uoms", drugId], queryFn: () => api<Array<{ id: string; name: string; factor: number }>>(`/inventory/uoms/${drugId}`) });
  const [f, , bind, reset] = useForm({ name: "", factor: "12" });
  const add = useAction(() => api(`/inventory/uoms/${drugId}`, { body: { name: f.name, factor: Number(f.factor) } }), ["uoms"], { onDone: () => reset() });
  const del = useAction((id: string) => api(`/inventory/uoms/item/${id}`, { method: "DELETE" }), ["uoms"]);
  return (
    <section aria-labelledby="uom-h"><h3 id="uom-h" className="mb-1 text-sm font-semibold">{t("cat.packUnits")}</h3><p className="mb-2 text-xs text-muted-foreground">{t("cat.packUnitHint")}</p>
      <div className="flex flex-wrap gap-2">{q.data?.map((u) => <span key={u.id} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">1 {u.name} = {u.factor}{canWrite && <button type="button" aria-label={t("common.remove")} onClick={() => del.mutate(u.id)}>✕</button>}</span>)}</div>
      {canWrite && <form className="mt-2 flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); add.mutate(); }}><Field label={t("cat.unitName")}>{(id) => <Input id={id} required className="w-40" {...bind("name")} />}</Field><Field label={t("cat.unitFactor")}>{(id) => <Input id={id} type="number" min={2} required className="w-28" {...bind("factor")} />}</Field><Button type="submit" size="sm" variant="outline">{t("cat.addUnit")}</Button></form>}
      <div className="mt-1"><ErrorNote error={add.error || del.error} /></div></section>
  );
}

interface PbRow { id: string; brandName: string; brandNameAr: string | null; strength: string; dosageForm: string; category: string | null; price: string; since: string; cost: string | null; marginPct: number | null; onHand: number }
function PriceBook({ onOpen }: { onOpen: (id: string) => void }) {
  const { t } = useTranslation(); const { branchId } = useAuth();
  const [q, setQ] = useState(""); const [cat, setCat] = useState(""); const [low, setLow] = useState(false); const [page, setPage] = useState(1);
  const cats = useQuery({ queryKey: ["categories"], queryFn: () => api<string[]>("/catalogue/categories") });
  const res = useQuery({ queryKey: ["price-book", branchId, q, cat, low, page], queryFn: () => api<{ total: number; items: PbRow[] }>("/catalogue/price-book", { query: { branchId, q: q || undefined, category: cat || undefined, lowMargin: low ? "true" : undefined, page, pageSize: 25 } }), enabled: !!branchId, placeholderData: (p) => p });
  return (
    <>
      <Toolbar><SearchInput label={t("common.search")} placeholder={t("cat.searchHint")} value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="w-full sm:w-80" />
        <Select aria-label={t("cat.category")} value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }} className="w-52"><option value="">{t("cat.allCategories")}</option>{cats.data?.map((c) => <option key={c} value={c}>{c}</option>)}</Select>
        <label className="flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={low} onChange={(e) => { setLow(e.target.checked); setPage(1); }} />{t("cat.lowMargin")}</label></Toolbar>
      <Card className="p-0">{res.isLoading ? <TableSkeleton rows={8} cols={6} /> : <Table numeric={[3, 4, 5, 6]} hideOnPhone={[1, 4]} head={[t("common.product"), t("cat.category"), t("cat.priceSince"), t("cat.price"), t("cat.cost"), t("cat.margin"), t("cat.onHand")]} empty={!res.data?.items.length ? <Empty>{t("common.noResults")}</Empty> : null}>
        {res.data?.items.map((r) => <tr key={r.id} className="kx-row-click" onClick={() => onOpen(r.id)}><Td className="font-medium">{drugName(r)} <bdi className="text-xs text-muted-foreground">{r.strength}</bdi></Td><Td>{r.category ?? "—"}</Td><Td className="kx-num text-end text-xs text-muted-foreground">{fmtDate(r.since)}</Td><Td className="kx-num text-end font-semibold">{fmtMoney(r.price)}</Td><Td className="kx-num text-end">{r.cost ? fmtMoney(r.cost) : "—"}</Td>
          <Td className="text-end">{r.marginPct == null ? "—" : <Badge tone={r.marginPct < 10 ? "bad" : r.marginPct < 20 ? "warn" : "good"}>{r.marginPct}%</Badge>}</Td><Td className="kx-num text-end">{r.onHand}</Td></tr>)}</Table>}
        <div className="flex items-center justify-between gap-3 border-t border-border/70 px-4 py-3 text-sm"><span className="text-muted-foreground">{t("common.total", { count: res.data?.total ?? 0 })}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>{t("common.prev")}</Button><Button size="sm" variant="outline" disabled={page * 25 >= (res.data?.total ?? 0)} onClick={() => setPage(page + 1)}>{t("common.next")}</Button></div></div></Card>
    </>
  );
}

function AddDrug({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const qc = useQueryClient(); const toast = useToast();
  const blank = { brandName: "", brandNameAr: "", activeIngredient: "", strength: "", dosageForm: "tablet", packSize: "", gtin: "", price: "", category: "", rxOnly: false, controlledSchedule: "NONE", coldChain: false };
  const [f, setF] = useState(blank);
  const m = useMutation({
    mutationFn: () => api("/catalogue/drugs", { body: { ...f, brandNameAr: f.brandNameAr || undefined, gtin: f.gtin || undefined, price: f.price || undefined, category: f.category || undefined } }),
    onSuccess: () => { toast(t("common.saved")); setF(blank); onClose(); void qc.invalidateQueries({ queryKey: ["drugs"] }); },
  });
  const text = (k: "brandName" | "brandNameAr" | "activeIngredient" | "strength" | "packSize" | "gtin" | "price" | "category", label: string, req = false) => <Field label={label}>{(id) => <Input id={id} required={req} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />}</Field>;
  return (
    <Modal open={open} onClose={onClose} title={t("cat.addDrug")} wide>
      <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="grid gap-3 sm:grid-cols-2">
        {text("brandName", t("cat.brand"), true)}{text("brandNameAr", t("cat.brandAr"))}{text("activeIngredient", t("cat.ingredient"), true)}{text("strength", t("cat.strength"), true)}
        <Field label={t("cat.form")}>{(id) => <Select id={id} value={f.dosageForm} onChange={(e) => setF({ ...f, dosageForm: e.target.value })}>{["tablet", "capsule", "syrup", "suspension", "injection", "cream", "ointment", "drops", "inhaler", "powder"].map((x) => <option key={x} value={x}>{x}</option>)}</Select>}</Field>
        {text("packSize", t("cat.pack"), true)}{text("gtin", t("cat.barcode"))}{text("price", t("cat.price"))}{text("category", t("cat.category"))}
        <Field label={t("cat.schedule")}>{(id) => <Select id={id} value={f.controlledSchedule} onChange={(e) => setF({ ...f, controlledSchedule: e.target.value })}>{["NONE", "SCHEDULE_1", "SCHEDULE_2", "SCHEDULE_3", "SCHEDULE_4"].map((x) => <option key={x} value={x}>{x === "NONE" ? t("cat.notControlled") : x}</option>)}</Select>}</Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.rxOnly} onChange={(e) => setF({ ...f, rxOnly: e.target.checked })} />{t("cat.rxOnly")}</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.coldChain} onChange={(e) => setF({ ...f, coldChain: e.target.checked })} />{t("cat.coldChain")}</label>
        <div className="sm:col-span-2"><ErrorNote error={m.error} /></div>
        <div className="sm:col-span-2"><Button type="submit" disabled={m.isPending}>{t("common.save")}</Button></div>
      </form>
    </Modal>
  );
}

type CatFilter = "" | "rx" | "controlled" | "cold" | "otc";

export function Catalogue() {
  const { t } = useTranslation();
  const { can, branchId } = useAuth();
  const [q, setQ] = useState(""); const [filter, setFilter] = useState<CatFilter>(""); const [page, setPage] = useState(1);
  const [price, setPrice] = useState<Drug | null>(null); const [add, setAdd] = useState(false);
  const [sel, setSel] = useState<string[]>([]); const [view, setView] = useState("drugs");
  const query: Record<string, string | number | undefined> = { q: q || undefined, page, pageSize: 25, ...(filter === "rx" ? { rxOnly: "true" } : filter === "controlled" ? { controlled: "true" } : filter === "cold" ? { coldChain: "true" } : filter === "otc" ? { otc: "true" } : {}) };
  const res = useQuery({ queryKey: ["drugs", query], queryFn: () => api<Page<Drug>>("/catalogue/drugs", { query }), placeholderData: (p) => p });
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const total = res.data?.total ?? 0; const shown = res.data?.items.length ?? 0;
  const allOnPage = !!shown && res.data!.items.every((d) => sel.includes(d.id));
  return (
    <>
      <PageHeader title={t("cat.title")} subtitle={t("cat.subtitle")} actions={<>
        {can("catalogue.write") && <Button onClick={() => setAdd(true)}><Plus aria-hidden className="size-4" />{t("cat.addDrug")}</Button>}
      </>} />
      <Tabs value={view} onChange={setView} tabs={[{ id: "drugs", label: t("cat.tabDrugs") }, { id: "pricebook", label: t("cat.tabPriceBook") }]} />
      {view === "pricebook" ? <div className="mt-3"><PriceBook onOpen={(id) => void api<Drug>(`/catalogue/drugs/${id}`).then(setPrice)} /></div> : <>
      <Toolbar>
        <SearchInput label={t("common.search")} placeholder={t("cat.searchHint")} value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="w-full sm:w-80" />
        <Segmented<CatFilter> label={t("cat.filter")} value={filter} onChange={(v) => { setFilter(v); setPage(1); }} options={[{ id: "", label: t("common.all") }, { id: "rx", label: "Rx" }, { id: "controlled", label: t("cat.controlled") }, { id: "cold", label: t("cat.coldChain") }, { id: "otc", label: "OTC" }]} />
        {sel.length > 0 && (
          <div className="ms-auto flex items-center gap-2 rounded-xl bg-accent px-3 py-1.5 text-sm text-accent-foreground" role="status">
            <span className="font-medium">{t("cat.selected", { count: sel.length })}</span>
            <Button size="sm" variant="outline" onClick={() => void printHtml("/catalogue/labels/print", { drugIds: sel.join(","), lang: document.documentElement.lang, branchId: branchId ?? undefined })}><Printer aria-hidden className="size-3.5" />{t("cat.printLabels", { count: sel.length })}</Button>
            <Button size="sm" variant="ghost" onClick={() => setSel([])} aria-label={t("cat.clearSel")} className="size-8 px-0"><X aria-hidden className="size-4" /></Button>
          </div>
        )}
      </Toolbar>
      <ErrorNote error={res.error} />
      <Card className="p-0">
        {res.isLoading ? <TableSkeleton rows={8} cols={5} /> : (
          <Table hideOnPhone={[3, 4, 5]} head={["", t("common.product"), t("cat.ingredient"), t("cat.flags"), t("cat.barcode"), ""]} empty={!shown ? <Empty hint={t("cat.emptyHint")} action={q || filter ? <Button variant="outline" size="sm" onClick={() => { setQ(""); setFilter(""); }}>{t("cat.resetFilters")}</Button> : undefined}>{t("common.noResults")}</Empty> : null}>
            {res.data?.items.map((d) => (
              <tr key={d.id} className="kx-row-click" onClick={(e) => { if (!(e.target as HTMLElement).closest("input,button,a")) setPrice(d); }}>
                <Td className="w-10"><input type="checkbox" className="size-4 accent-[hsl(var(--primary))]" aria-label={t("cat.selectLabel", { name: d.brandName })} checked={sel.includes(d.id)} onChange={() => toggle(d.id)} /></Td>
                <Td><div className="font-medium leading-tight">{drugName(d)}</div><div className="mt-0.5 text-xs text-muted-foreground"><bdi>{d.strength}</bdi> · <bdi>{d.dosageForm}</bdi> · <bdi>{d.packSize}</bdi><span className="sm:hidden"> · <bdi>{d.activeIngredient}</bdi></span></div><div className="mt-1.5 flex flex-wrap gap-1 sm:hidden">{d.rxOnly && <Badge tone="info">Rx</Badge>}{d.controlledSchedule !== "NONE" && <Badge tone="bad"><ShieldAlert aria-hidden className="me-1 size-3" />{t("cat.controlled")}</Badge>}{d.coldChain && <Badge tone="warn"><Snowflake aria-hidden className="me-1 size-3" />{t("cat.coldChain")}</Badge>}{d.otc && <Badge>OTC</Badge>}</div></Td>
                <Td className="text-muted-foreground">{d.activeIngredient}</Td>
                <Td><div className="flex flex-wrap gap-1">{d.rxOnly && <Badge tone="info">Rx</Badge>}{d.controlledSchedule !== "NONE" && <Badge tone="bad"><ShieldAlert aria-hidden className="me-1 size-3" />{t("cat.controlled")}</Badge>}{d.coldChain && <Badge tone="warn"><Snowflake aria-hidden className="me-1 size-3" />{t("cat.coldChain")}</Badge>}{d.otc && <Badge>OTC</Badge>}</div></Td>
                <Td className="font-mono text-xs text-muted-foreground">{d.gtin ?? "—"}</Td>
                <Td className="text-end"><Button size="sm" variant="outline" onClick={() => setPrice(d)} aria-label={`${t("cat.priceAndSubs")}: ${drugName(d)}`}><Tag aria-hidden className="size-3.5" /><span className="max-sm:sr-only">{t("cat.priceAndSubs")}</span><ArrowRight aria-hidden className="size-3.5 rtl:rotate-180" /></Button></Td>
              </tr>
            ))}
          </Table>
        )}
        <div className="flex items-center justify-between gap-3 border-t border-border/70 px-4 py-3 text-sm">
          <span className="text-muted-foreground">{shown ? t("cat.showing", { from: (page - 1) * 25 + 1, to: (page - 1) * 25 + shown, total }) : t("common.total", { count: total })}{allOnPage && <button type="button" className="ms-3 text-primary underline-offset-2 hover:underline" onClick={() => setSel((s) => s.filter((id) => !res.data!.items.some((d) => d.id === id)))}>{t("cat.deselectPage")}</button>}{!allOnPage && !!shown && <button type="button" className="ms-3 text-primary underline-offset-2 hover:underline" onClick={() => setSel((s) => [...new Set([...s, ...res.data!.items.map((d) => d.id)])])}>{t("cat.selectPage")}</button>}</span>
          <div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>{t("common.prev")}</Button><Button size="sm" variant="outline" disabled={page * 25 >= total} onClick={() => setPage(page + 1)}>{t("common.next")}</Button></div>
        </div>
      </Card>
      </>}
      <PriceModal drug={price} onClose={() => setPrice(null)} />
      <AddDrug open={add} onClose={() => setAdd(false)} />
    </>
  );
}
