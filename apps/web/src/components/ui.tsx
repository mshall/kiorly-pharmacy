import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { forwardRef, useEffect, useId, useRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import { ApiError } from "@/lib/api";
import { EmptyState, PageHeader as KitPageHeader } from "@/brand/ui-kit";
import { PulseLine } from "@/brand/components";
import { Search, X } from "lucide-react";

export const cn = (...i: ClassValue[]) => twMerge(clsx(i));

const button = cva("inline-flex min-h-10 whitespace-nowrap items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-[background-color,box-shadow,transform] duration-150 ease-[var(--kx-ease-standard)] active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: { primary: "bg-primary text-primary-foreground shadow-[var(--kx-shadow-1)] hover:bg-[var(--kx-primary-hover)]", secondary: "bg-secondary text-secondary-foreground hover:bg-accent", outline: "border border-input bg-card shadow-[var(--kx-shadow-1)] hover:bg-accent", danger: "bg-destructive text-destructive-foreground dark:bg-[#c92a2a] shadow-[var(--kx-shadow-1)] hover:opacity-90", ghost: "hover:bg-accent" },
    size: { md: "", lg: "min-h-14 rounded-xl px-6 text-base", sm: "min-h-8 px-3 text-xs" },
  },
  defaultVariants: { variant: "primary", size: "md" },
});
/** Class string for a Link/anchor that should look like a Button. */
export const buttonClass = (o: VariantProps<typeof button> = {}) => button(o);
export function Button({ className, variant, size, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>) {
  return <button type="button" className={cn(button({ variant, size }), className)} {...p} />;
}

export function Card({ className, children, title, actions }: { className?: string; children: ReactNode; title?: ReactNode; actions?: ReactNode }) {
  return (
    <section className={cn("rounded-xl border border-border/80 bg-card p-4 shadow-[var(--kx-shadow-1)]", className)}>
      {(title || actions) && <header className="mb-3 flex items-center justify-between gap-2"><h2 className="text-base font-semibold tracking-tight">{title}</h2><div className="flex gap-2">{actions}</div></header>}
      {children}
    </section>
  );
}

export function Field({ label, children, hint, error, className }: { label: string; children: (id: string) => ReactNode; hint?: string; error?: string; className?: string }) {
  const id = useId();
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      {children(id)}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p role="alert" className="text-xs text-danger">{error}</p>}
    </div>
  );
}
const inputCls = "min-h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-[var(--kx-shadow-1)] transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, ref) => <input ref={ref} className={cn(inputCls, className)} {...p} />);
Input.displayName = "Input";
export const Select = ({ className, ...p }: SelectHTMLAttributes<HTMLSelectElement>) => <select className={cn(inputCls, className)} {...p} />;
export const Textarea = ({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea className={cn(inputCls, "min-h-20 py-2", className)} {...p} />;

const tone = {
  neutral: "bg-muted text-muted-foreground ring-border",
  good: "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))] ring-[hsl(var(--success)/0.25)]",
  warn: "bg-[hsl(var(--warning)/0.14)] text-[hsl(var(--warning))] ring-[hsl(var(--warning)/0.3)]",
  bad: "bg-[hsl(var(--danger-text)/0.12)] text-[hsl(var(--danger-text))] ring-[hsl(var(--danger-text)/0.28)]",
  info: "bg-accent text-accent-foreground ring-primary/20",
  brand: "bg-primary text-primary-foreground ring-primary",
} as const;
export type Tone = keyof typeof tone;
export const Badge = ({ tone: t = "neutral", children }: { tone?: Tone; children: ReactNode }) => <span className={cn("inline-flex min-h-6 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", tone[t])}>{children}</span>;

export const LOT_TONE: Record<string, Tone> = { AVAILABLE: "good", RESERVED: "info", RECEIVED: "neutral", QUARANTINE: "warn", RECALLED: "bad", EXPIRED: "bad", DISPENSED: "neutral" };
export const OUTCOME_TONE: Record<string, Tone> = { PASS: "good", WARN: "warn", BLOCK: "bad", OVERRIDDEN_BY_PHARMACIST: "info" };

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useTranslation();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // land on the first field (not the close button) so keyboard users can type straight away
      requestAnimationFrame(() => d.querySelector<HTMLElement>("[data-autofocus], input:not([type=hidden]):not([type=checkbox]):not([type=radio]), select, textarea")?.focus());
    }
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} onCancel={onClose} aria-label={title} className={cn("kx-dialog w-full rounded-2xl border border-border/60 bg-card p-0 text-card-foreground shadow-[var(--kx-shadow-4)] backdrop:bg-[var(--kx-overlay)] max-sm:m-0 max-sm:mt-auto max-sm:max-h-[92dvh] max-sm:max-w-none max-sm:rounded-b-none", wide ? "max-w-3xl" : "max-w-lg")}>
      {open && (
        <div>
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border/70 bg-card/95 px-5 py-3 backdrop-blur"><h2 className="text-lg font-semibold">{title}</h2><Button variant="ghost" size="sm" onClick={onClose} aria-label={t("common.close")} className="size-9 px-0"><X aria-hidden className="size-4" /></Button></div>
          <div className="p-5">{children}</div>
        </div>
      )}
    </dialog>
  );
}

export function Table({ head, children, empty, numeric = [], dense, hideOnPhone = [] }: { head: string[]; children: ReactNode; empty?: ReactNode; numeric?: number[]; dense?: boolean; hideOnPhone?: number[] }) {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard-scrollable region (axe scrollable-region-focusable)
    <div className="kx-sticky-head kx-table-wrap overflow-auto" tabIndex={0} role="region" aria-label={head.filter(Boolean).slice(0, 2).join(" / ")}>
      <table className={cn("kx-table w-full text-start text-sm", dense && "kx-dense", hideOnPhone.map((n) => `kx-hp-${n}`))}>
        <thead><tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground rtl:normal-case rtl:tracking-normal">{head.map((h, i) => <th key={`${h}-${i}`} scope="col" className={cn("whitespace-nowrap px-3 py-2.5 text-[11px] font-semibold", numeric.includes(i) ? "text-end" : "text-start")}>{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
      {empty}
    </div>
  );
}
/** Expiry status chip: expired / <=30 d / <=90 d / ok, with the day count (FEFO reads left to right). */
export function ExpiryChip({ days, label }: { days: number; label: (k: "expired" | "soon" | "watch" | "ok", n: number) => string }) {
  const k = days < 0 ? "expired" : days <= 30 ? "soon" : days <= 90 ? "watch" : "ok";
  const tn: Tone = k === "expired" ? "bad" : k === "soon" ? "warn" : k === "watch" ? "info" : "good";
  return <Badge tone={tn}>{label(k, days)}</Badge>;
}
export const Td = ({ children, className }: { children?: ReactNode; className?: string }) => <td className={cn("px-3 py-2.5 align-middle", className)}>{children}</td>;

export const Spinner = () => <PulseLine size={14} loop label="loading" />;
export function Empty({ children, hint, action }: { children: ReactNode; hint?: ReactNode; action?: ReactNode }) { return <EmptyState compact title={children} description={hint} action={action} />; }

export function PageHeader({ title, actions, subtitle, description, eyebrow, className }: { title: string; actions?: ReactNode; subtitle?: string; description?: string; eyebrow?: ReactNode; className?: string }) {
  return <KitPageHeader title={title} description={description ?? subtitle} eyebrow={eyebrow} actions={actions} className={className} />;
}

/** Human message for an API error, honouring the OFF / entitlement / safety contracts. */
export function errorMessage(e: unknown, t: (k: string, o?: Record<string, unknown>) => string): string {
  if (e instanceof ApiError) {
    if (e.featureDisabled) return t("errors.featureDisabled", { key: String(e.body?.key ?? "") });
    if (e.entitlementRequired) return t("errors.entitlement", { capability: String(e.body?.capability ?? "") });
    if (e.isNetwork) return t("errors.network");
    const k = `errors.codes.${e.code}`;
    const translated = t(k);
    return translated === k ? e.message : translated;
  }
  return e instanceof Error ? e.message : String(e);
}

export function ErrorNote({ error }: { error: unknown }) {
  const { t } = useTranslation();
  if (!error) return null;
  return <p role="alert" className="rounded-lg border border-[hsl(var(--danger-text)/0.3)] bg-[hsl(var(--danger-text)/0.08)] p-3 text-sm text-[hsl(var(--danger-text))]">{errorMessage(error, t as never)}</p>;
}

export function Tabs({ tabs, value, onChange }: { tabs: Array<{ id: string; label: string; icon?: ReactNode; count?: number }>; value: string; onChange: (id: string) => void }) {
  const onKey = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((x) => x.id === value);
    const rtl = document.documentElement.dir === "rtl";
    const step = e.key === "ArrowRight" ? (rtl ? -1 : 1) : e.key === "ArrowLeft" ? (rtl ? 1 : -1) : e.key === "Home" ? -99 : e.key === "End" ? 99 : 0;
    if (!step) return;
    e.preventDefault();
    const n = Math.max(0, Math.min(tabs.length - 1, Math.abs(step) > 1 ? (step < 0 ? 0 : tabs.length - 1) : i + step));
    onChange(tabs[n]!.id);
    requestAnimationFrame(() => document.getElementById(`tab-${tabs[n]!.id}`)?.focus());
  };
  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- focus lives on the tab buttons (roving tabindex); this handler only receives bubbled keys
    <div role="tablist" onKeyDown={onKey} className="mb-5 flex gap-1 overflow-x-auto border-b border-border">
      {tabs.map((t) => (
        <button key={t.id} role="tab" type="button" tabIndex={value === t.id ? 0 : -1} aria-selected={value === t.id} id={`tab-${t.id}`} aria-controls={`panel-${t.id}`} onClick={() => onChange(t.id)}
          className={cn("-mb-px inline-flex min-h-11 items-center gap-2 whitespace-nowrap border-b-2 px-4 text-sm font-medium transition-colors duration-150", value === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
          {t.icon && <span aria-hidden className="[&>svg]:size-4">{t.icon}</span>}{t.label}{t.count !== undefined && t.count > 0 && <span className="rounded-full bg-muted px-1.5 text-[11px] font-semibold tabular-nums text-muted-foreground">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Search field with a leading icon (mirrors in RTL). */
export function SearchInput({ label, className, ...p }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className={cn("relative", className)}>
      <Search aria-hidden className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input type="search" aria-label={label} className={cn(inputCls, "ps-9")} {...p} />
    </div>
  );
}

/** Segmented single-choice filter (radio semantics, arrow keys). */
export function Segmented<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: Array<{ id: T; label: string; count?: number }> }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-muted/60 p-1">
      {options.map((o) => (
        <label key={o.id} className={cn("relative inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors duration-150 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring", value === o.id ? "bg-card text-foreground shadow-[var(--kx-shadow-1)]" : "text-muted-foreground hover:text-foreground")}>
          <input type="radio" name={label} className="sr-only" checked={value === o.id} onChange={() => onChange(o.id)} />
          {o.label}{o.count !== undefined && <span className="text-xs tabular-nums text-muted-foreground">{o.count}</span>}
        </label>
      ))}
    </div>
  );
}

/** Thin progress / meter bar. */
export function Meter({ value, max = 100, tone = "brand", label, className }: { value: number; max?: number; tone?: "brand" | "good" | "warn" | "bad"; label: string; className?: string }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const bar = { brand: "bg-primary", good: "bg-[hsl(var(--success))]", warn: "bg-[hsl(var(--warning))]", bad: "bg-[hsl(var(--danger-text))]" }[tone];
  return <div role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} className={cn("h-1.5 overflow-hidden rounded-full bg-muted", className)}><div className={cn("h-full rounded-full transition-[width] duration-300 ease-out motion-reduce:transition-none", bar)} style={{ width: `${pct}%` }} /></div>;
}

/** Initials avatar (neutral tint, no photos). */
export function Avatar({ name, className }: { name: string; className?: string }) {
  const ini = name.replace(/\(.*?\)/g, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return <span aria-hidden className={cn("inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground", className)}>{ini}</span>;
}

/** Inline toolbar surface for filters above a table. */
export function Toolbar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mb-4 flex flex-wrap items-center gap-3", className)}>{children}</div>;
}

/** Accessible on/off switch (role=switch). */
export function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)}
      className={cn("relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-colors duration-150 disabled:opacity-50", checked ? "bg-primary" : "bg-[hsl(var(--input))]")}>
      <span aria-hidden className={cn("size-5 rounded-full bg-white shadow-[var(--kx-shadow-1)] transition-transform duration-150 motion-reduce:transition-none", checked ? "translate-x-[22px] rtl:-translate-x-[22px]" : "translate-x-0.5 rtl:-translate-x-0.5")} />
    </button>
  );
}
