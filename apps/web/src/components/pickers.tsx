import { useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { Button, Input, cn } from "@/components/ui";
import { drugName } from "@/lib/format";
import type { Customer, Drug, Page } from "@/lib/types";

/** Debounce-free typeahead list: shows up to `limit` results for the typed query (>= 2 chars) and calls onPick. */
function Typeahead<T extends { id: string }>({ label, placeholder, queryKey, fetcher, render, onPick }: { label: string; placeholder?: string; queryKey: string; fetcher: (q: string) => Promise<T[]>; render: (x: T) => ReactNode; onPick: (x: T) => void }) {
  const [q, setQ] = useState("");
  const res = useQuery({ queryKey: [queryKey, q], queryFn: () => fetcher(q), enabled: q.trim().length >= 2 });
  return (
    <div className="relative">
      <Input aria-label={label} type="search" placeholder={placeholder ?? label} value={q} onChange={(e) => setQ(e.target.value)} />
      {!!res.data?.length && q.trim().length >= 2 && (
        <ul className="absolute inset-x-0 top-full z-30 mt-1 max-h-60 overflow-auto rounded-xl border border-border bg-card shadow-kx-3">
          {res.data.map((x) => <li key={x.id}><button type="button" className="min-h-10 w-full px-3 py-1.5 text-start text-sm hover:bg-accent" onClick={() => { onPick(x); setQ(""); }}>{render(x)}</button></li>)}
        </ul>
      )}
    </div>
  );
}

export function CustomerPicker({ value, onChange, label }: { value: Customer | null; onChange: (c: Customer | null) => void; label?: string }) {
  const { t } = useTranslation();
  if (value) return <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm"><span>{t("rx.usingCustomer", { name: `${value.displayName}${value.phone ? ` · ${value.phone}` : ""}` })}</span><Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>{t("rx.clearCustomer")}</Button></div>;
  return <Typeahead<Customer> label={label ?? t("rx.pickCustomer")} queryKey="pick-customer" fetcher={async (q) => (await api<Page<Customer>>("/customers", { query: { q, pageSize: 6 } })).items} render={(c) => <span><span className="font-medium">{c.displayName}</span> <span className="text-muted-foreground" dir="ltr">{c.phone ?? ""} {c.customerNo ?? ""}</span></span>} onPick={onChange} />;
}

export interface PrescriberLite { id: string; name: string; licenceNo: string; verified: boolean; specialty: string | null }
export function PrescriberPicker({ value, onChange }: { value: PrescriberLite | null; onChange: (p: PrescriberLite | null) => void }) {
  const { t } = useTranslation();
  if (value) return <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm"><span>{value.name} · <bdi>{value.licenceNo}</bdi> {value.verified && "✔"}</span><Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>{t("rx.clearCustomer")}</Button></div>;
  return <Typeahead<PrescriberLite> label={t("rx.pickPrescriber")} queryKey="pick-prescriber" fetcher={async (q) => (await api<Page<PrescriberLite>>("/prescribers", { query: { q, pageSize: 6 } })).items} render={(p) => <span><span className="font-medium">{p.name}</span> <span className="text-muted-foreground" dir="ltr">{p.licenceNo}</span></span>} onPick={onChange} />;
}

export function DrugPicker({ onPick, label, filter, className }: { onPick: (d: Drug) => void; label: string; filter?: Record<string, string>; className?: string }) {
  return <div className={cn(className)}><Typeahead<Drug> label={label} queryKey="pick-drug" fetcher={async (q) => (await api<Page<Drug>>("/catalogue/drugs", { query: { q, pageSize: 8, ...filter } })).items} render={(d) => <span><span className="font-medium">{drugName(d)}</span> <span className="text-muted-foreground"><bdi>{d.strength}</bdi> · {d.dosageForm}</span></span>} onPick={onPick} /></div>;
}
