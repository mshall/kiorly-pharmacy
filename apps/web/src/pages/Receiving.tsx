import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api, newKey } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { PackagePlus, ScanBarcode, Snowflake, Trash2 } from "lucide-react";
import { Badge, Button, Card, Empty, ErrorNote, ExpiryChip, Field, Input, PageHeader, SearchInput, Select, Table, Td } from "@/components/ui";
import { StatusChip } from "@/brand/ui-kit";
import { drugName, fmtMoney, fmtNum } from "@/lib/format";
import { useToast } from "@/lib/toast";
import type { Drug, Page, Supplier } from "@/lib/types";

interface Line { key: string; drug: Drug; lotNumber: string; expiryDate: string; quantity: string; unitCost: string; temperatureC: string }
interface Scan { gtin: string | null; lotNumber: string | null; expiryDate: string | null; drug: Drug | null }

/** KPINV01: receive by PO or direct. Scan a GS1 / EAN barcode to prefill drug, lot and expiry; cold-chain items require the arrival temperature. */
export function Receiving() {
  const { t } = useTranslation();
  const { branchId, can } = useAuth();
  const toast = useToast();
  const scanRef = useRef<HTMLInputElement>(null);
  const [lines, setLines] = useState<Line[]>([]); const [supplierId, setSupplierId] = useState(""); const [invoiceNo, setInvoiceNo] = useState(""); const [invoiceTotal, setInvoiceTotal] = useState(""); const [poId, setPoId] = useState("");
  const [scan, setScan] = useState("");
  useEffect(() => { scanRef.current?.focus(); }, []); const [search, setSearch] = useState(""); const [idem, setIdem] = useState(newKey());
  const suppliers = useQuery({ queryKey: ["suppliers"], queryFn: () => api<Supplier[]>("/suppliers"), enabled: can("supplier.read") });
  const pos = useQuery({ queryKey: ["pos-open", branchId], queryFn: () => api<Array<{ id: string; poNumber: string | null; status: string; supplierId: string }>>("/purchase-orders", { query: { branchId } }), enabled: can("supplier.read") && !!branchId, retry: false });
  const results = useQuery({ queryKey: ["rcv-search", search], queryFn: () => api<Page<Drug>>("/catalogue/drugs", { query: { q: search, pageSize: 8 } }), enabled: search.length >= 2 });
  const addDrug = (drug: Drug, prefill?: Partial<Line>) => setLines((l) => [...l, { key: newKey(), drug, lotNumber: "", expiryDate: "", quantity: "1", unitCost: "", temperatureC: "", ...prefill }]);
  const onScan = useMutation({
    mutationFn: (code: string) => api<Scan>("/inventory/scan/parse", { body: { code } }),
    onSuccess: (r) => { if (r.drug) addDrug(r.drug, { lotNumber: r.lotNumber ?? "", expiryDate: r.expiryDate ?? "" }); else toast(t("rcv.unknownBarcode"), "err"); setScan(""); scanRef.current?.focus(); },
  });
  const submit = useMutation({
    mutationFn: () => api("/inventory/receipts", { body: { branchId, supplierId: supplierId || undefined, purchaseOrderId: poId || undefined, invoiceNo: invoiceNo || undefined, invoiceTotal: invoiceTotal || undefined, idempotencyKey: idem,
      lines: lines.map((l) => ({ drugId: l.drug.id, lotNumber: l.lotNumber, expiryDate: l.expiryDate, quantity: Number(l.quantity), unitCost: l.unitCost, ...(l.drug.coldChain ? { temperatureC: Number(l.temperatureC) } : {}) })) } }),
    onSuccess: () => { toast(t("rcv.received")); setLines([]); setInvoiceNo(""); setInvoiceTotal(""); setPoId(""); setIdem(newKey()); },
  });
  const upd = (k: string, patch: Partial<Line>) => setLines((l) => l.map((x) => (x.key === k ? { ...x, ...patch } : x)));
  const units = lines.reduce((a, l) => a + (Number(l.quantity) || 0), 0);
  const cost = lines.reduce((a, l) => a + (Number(l.quantity) || 0) * (Number(l.unitCost) || 0), 0);
  const inv = Number(invoiceTotal);
  const variance = invoiceTotal && cost ? inv - cost : null;
  const incomplete = lines.filter((l) => !l.lotNumber || !l.expiryDate || !l.unitCost || (l.drug.coldChain && l.temperatureC === "")).length;
  const daysTo = (iso: string) => Math.floor((new Date(iso).getTime() - Date.now()) / 86_400_000);
  const po = pos.data?.find((p) => p.id === poId);
  return (
    <>
      <PageHeader title={t("rcv.title")} subtitle={t("rcv.subtitle")} />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <Card title={t("rcv.header")} className="lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-3">
            <Field label={t("rcv.supplier")}>{(id) => <Select id={id} value={supplierId} onChange={(e) => setSupplierId(e.target.value)}><option value="">{t("rcv.direct")}</option>{suppliers.data?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>}</Field>
            {!!pos.data?.length && <Field label={t("rcv.po")}>{(id) => <Select id={id} value={poId} onChange={(e) => { setPoId(e.target.value); const p = pos.data?.find((x) => x.id === e.target.value); if (p) setSupplierId(p.supplierId); }}><option value="">—</option>{pos.data.filter((p) => ["SENT", "PARTIALLY_RECEIVED", "DRAFT"].includes(p.status)).map((p) => <option key={p.id} value={p.id}>{p.poNumber}</option>)}</Select>}</Field>}
            {po && <p className="flex items-center gap-2 text-xs text-muted-foreground"><StatusChip tone="info">{t(`poStatus.${po.status}`)}</StatusChip>{po.poNumber}</p>}
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("rcv.invoiceNo")}>{(id) => <Input id={id} value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />}</Field>
              <Field label={t("rcv.invoiceTotal")}>{(id) => <Input id={id} inputMode="decimal" value={invoiceTotal} onChange={(e) => setInvoiceTotal(e.target.value)} />}</Field>
            </div>
          </div>
          <dl className="mt-5 space-y-2 border-t border-border/70 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">{t("rcv.sumLines")}</dt><dd className="kx-num font-medium">{fmtNum(lines.length)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{t("rcv.sumUnits")}</dt><dd className="kx-num font-medium">{fmtNum(units)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{t("rcv.sumCost")}</dt><dd className="kx-num text-base font-semibold">{fmtMoney(cost)}</dd></div>
            {variance !== null && <div className="flex items-center justify-between"><dt className="text-muted-foreground">{t("rcv.variance")}</dt><dd>{Math.abs(variance) < 0.01 ? <StatusChip tone="good">{t("rcv.matches")}</StatusChip> : <StatusChip tone="warn">{variance > 0 ? "+" : ""}{fmtMoney(variance)}</StatusChip>}</dd></div>}
          </dl>
        </Card>
        <div className="min-w-0 space-y-4">
          <Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <form onSubmit={(e) => { e.preventDefault(); if (scan.trim()) onScan.mutate(scan.trim()); }}>
                <Field label={t("rcv.scan")} hint={t("rcv.scanHint")}>{(id) => <div className="relative"><ScanBarcode aria-hidden className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id={id} ref={scanRef} value={scan} onChange={(e) => setScan(e.target.value)} placeholder="(01)…(17)…(10)…" className="ps-9 font-mono" dir="ltr" /></div>}</Field>
              </form>
              <div className="relative">
                <Field label={t("rcv.searchProduct")}>{(id) => <SearchInput id={id} label={t("rcv.searchProduct")} value={search} onChange={(e) => setSearch(e.target.value)} />}</Field>
                {results.data?.items.length ? <ul className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-[var(--kx-shadow-3)]">{results.data.items.map((d) => <li key={d.id}><button type="button" className="flex min-h-11 w-full items-center justify-between gap-2 px-3 text-start text-sm hover:bg-accent" onClick={() => { addDrug(d); setSearch(""); }}><span className="font-medium">{drugName(d)}</span><span className="text-xs text-muted-foreground">{d.strength} · {d.dosageForm}</span></button></li>)}</ul> : null}
              </div>
            </div>
            <ErrorNote error={onScan.error} />
          </Card>
          <Card title={t("rcv.lines")} actions={incomplete > 0 ? <StatusChip tone="warn">{t("rcv.incomplete", { count: incomplete })}</StatusChip> : lines.length ? <StatusChip tone="good">{t("rcv.ready")}</StatusChip> : null} className="p-0 [&>header]:px-4 [&>header]:pt-4">
            <Table dense head={[t("common.product"), t("inv.lot"), t("inv.expiry"), t("inv.qty"), t("rcv.unitCost"), t("inv.tempC"), ""]} numeric={[3, 4]} empty={!lines.length ? <Empty hint={t("rcv.emptyHint")}>{t("rcv.empty")}</Empty> : null}>
              {lines.map((l) => (
                <tr key={l.key}>
                  <Td><div className="font-medium leading-tight">{drugName(l.drug)}</div><div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">{l.drug.strength}{l.drug.coldChain && <Badge tone="warn"><Snowflake aria-hidden className="me-1 size-3" />{t("cat.coldChain")}</Badge>}</div></Td>
                  <Td><Input aria-label={t("inv.lot")} value={l.lotNumber} onChange={(e) => upd(l.key, { lotNumber: e.target.value })} className="w-32 font-mono" dir="ltr" /></Td>
                  <Td><div className="flex flex-col gap-1"><Input aria-label={t("inv.expiry")} type="date" value={l.expiryDate} onChange={(e) => upd(l.key, { expiryDate: e.target.value })} />{l.expiryDate && daysTo(l.expiryDate) <= 90 && <ExpiryChip days={daysTo(l.expiryDate)} label={(k, n) => (k === "expired" ? t("inv.expiredAgo", { count: Math.abs(n) }) : t("inv.inDays", { count: n }))} />}</div></Td>
                  <Td><Input aria-label={t("inv.qty")} type="number" min={1} value={l.quantity} onChange={(e) => upd(l.key, { quantity: e.target.value })} className="w-20 text-end" /></Td>
                  <Td><Input aria-label={t("rcv.unitCost")} inputMode="decimal" value={l.unitCost} onChange={(e) => upd(l.key, { unitCost: e.target.value })} className="w-24 text-end" /></Td>
                  <Td>{l.drug.coldChain ? <Input aria-label={t("inv.tempC")} type="number" step="0.1" value={l.temperatureC} onChange={(e) => upd(l.key, { temperatureC: e.target.value })} className="w-20" /> : <span className="text-muted-foreground">—</span>}</Td>
                  <Td><Button size="sm" variant="ghost" onClick={() => setLines((x) => x.filter((y) => y.key !== l.key))} aria-label={t("common.remove")} className="size-8 px-0 text-muted-foreground hover:text-[hsl(var(--danger-text))]"><Trash2 aria-hidden className="size-4" /></Button></Td>
                </tr>
              ))}
            </Table>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 p-4">
              <ErrorNote error={submit.error} />
              <Button size="lg" className="ms-auto" disabled={!lines.length || submit.isPending || incomplete > 0} onClick={() => submit.mutate()}><PackagePlus aria-hidden className="size-5" />{t("rcv.submit")}</Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
