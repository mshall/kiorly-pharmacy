import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api, newKey } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, Card, ErrorNote, Field, Input, PageHeader, Select, Table, Td } from "@/components/ui";
import { drugName } from "@/lib/format";
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
  return (
    <>
      <PageHeader title={t("rcv.title")} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title={t("rcv.header")} className="lg:col-span-1">
          <div className="space-y-3">
            <Field label={t("rcv.supplier")}>{(id) => <Select id={id} value={supplierId} onChange={(e) => setSupplierId(e.target.value)}><option value="">{t("rcv.direct")}</option>{suppliers.data?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>}</Field>
            {!!pos.data?.length && <Field label={t("rcv.po")}>{(id) => <Select id={id} value={poId} onChange={(e) => { setPoId(e.target.value); const p = pos.data?.find((x) => x.id === e.target.value); if (p) setSupplierId(p.supplierId); }}><option value="">—</option>{pos.data.filter((p) => ["SENT", "PARTIALLY_RECEIVED", "DRAFT"].includes(p.status)).map((p) => <option key={p.id} value={p.id}>{p.poNumber}</option>)}</Select>}</Field>}
            <Field label={t("rcv.invoiceNo")}>{(id) => <Input id={id} value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />}</Field>
            <Field label={t("rcv.invoiceTotal")}>{(id) => <Input id={id} inputMode="decimal" value={invoiceTotal} onChange={(e) => setInvoiceTotal(e.target.value)} />}</Field>
          </div>
        </Card>
        <Card title={t("rcv.add")} className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <form onSubmit={(e) => { e.preventDefault(); if (scan.trim()) onScan.mutate(scan.trim()); }}>
              <Field label={t("rcv.scan")} hint={t("rcv.scanHint")}>{(id) => <Input id={id} ref={scanRef} value={scan} onChange={(e) => setScan(e.target.value)} placeholder="(01)…(17)…(10)…" />}</Field>
            </form>
            <div>
              <Field label={t("rcv.searchProduct")}>{(id) => <Input id={id} type="search" value={search} onChange={(e) => setSearch(e.target.value)} />}</Field>
              {results.data?.items.length ? <ul className="mt-1 rounded-md border border-border bg-card">{results.data.items.map((d) => <li key={d.id}><button type="button" className="min-h-10 w-full px-3 text-start text-sm hover:bg-accent" onClick={() => { addDrug(d); setSearch(""); }}>{drugName(d)} <span className="text-muted-foreground">{d.strength}</span></button></li>)}</ul> : null}
            </div>
          </div>
          <ErrorNote error={onScan.error} />
        </Card>
      </div>
      <Card className="mt-4" title={t("rcv.lines")}>
        <Table head={[t("common.product"), t("inv.lot"), t("inv.expiry"), t("inv.qty"), t("rcv.unitCost"), t("inv.tempC"), ""]} empty={!lines.length ? <p className="py-6 text-center text-sm text-muted-foreground">{t("rcv.empty")}</p> : null}>
          {lines.map((l) => (
            <tr key={l.key}>
              <Td className="font-medium">{drugName(l.drug)}<div className="text-xs text-muted-foreground">{l.drug.strength}</div></Td>
              <Td><Input aria-label={t("inv.lot")} value={l.lotNumber} onChange={(e) => upd(l.key, { lotNumber: e.target.value })} className="w-32" /></Td>
              <Td><Input aria-label={t("inv.expiry")} type="date" value={l.expiryDate} onChange={(e) => upd(l.key, { expiryDate: e.target.value })} /></Td>
              <Td><Input aria-label={t("inv.qty")} type="number" min={1} value={l.quantity} onChange={(e) => upd(l.key, { quantity: e.target.value })} className="w-20" /></Td>
              <Td><Input aria-label={t("rcv.unitCost")} inputMode="decimal" value={l.unitCost} onChange={(e) => upd(l.key, { unitCost: e.target.value })} className="w-24" /></Td>
              <Td>{l.drug.coldChain ? <Input aria-label={t("inv.tempC")} type="number" step="0.1" value={l.temperatureC} onChange={(e) => upd(l.key, { temperatureC: e.target.value })} className="w-20" /> : "—"}</Td>
              <Td><Button size="sm" variant="ghost" onClick={() => setLines((x) => x.filter((y) => y.key !== l.key))} aria-label={t("common.remove")}>✕</Button></Td>
            </tr>
          ))}
        </Table>
        <ErrorNote error={submit.error} />
        <div className="mt-3"><Button size="lg" disabled={!lines.length || submit.isPending || lines.some((l) => !l.lotNumber || !l.expiryDate || !l.unitCost)} onClick={() => submit.mutate()}>{t("rcv.submit")}</Button></div>
      </Card>
    </>
  );
}
