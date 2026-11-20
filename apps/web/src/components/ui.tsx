import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { forwardRef, useEffect, useId, useRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import { ApiError } from "@/lib/api";
import { EmptyState, PageHeader as KitPageHeader } from "@/brand/ui-kit";
import { PulseLine } from "@/brand/components";

export const cn = (...i: ClassValue[]) => twMerge(clsx(i));

const button = cva("inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-[background-color,box-shadow,transform] duration-150 ease-[var(--kx-ease-standard)] active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: { primary: "bg-primary text-primary-foreground shadow-[var(--kx-shadow-1)] hover:bg-[var(--kx-primary-hover)]", secondary: "bg-secondary text-secondary-foreground hover:bg-accent", outline: "border border-input bg-card shadow-[var(--kx-shadow-1)] hover:bg-accent", danger: "bg-destructive text-destructive-foreground dark:bg-[#c92a2a] shadow-[var(--kx-shadow-1)] hover:opacity-90", ghost: "hover:bg-accent" },
    size: { md: "", lg: "min-h-14 rounded-xl px-6 text-base", sm: "min-h-8 px-3 text-xs" },
  },
  defaultVariants: { variant: "primary", size: "md" },
});
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

export function Field({ label, children, hint, error }: { label: string; children: (id: string) => ReactNode; hint?: string; error?: string }) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
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
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} onCancel={onClose} aria-label={title} className={cn("w-full rounded-2xl bg-card p-0 text-card-foreground shadow-[var(--kx-shadow-4)] backdrop:bg-[var(--kx-overlay)]", wide ? "max-w-3xl" : "max-w-lg")}>
      {open && (
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2><Button variant="ghost" size="sm" onClick={onClose} aria-label={t("common.close")}>✕</Button></div>
          {children}
        </div>
      )}
    </dialog>
  );
}

export function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: ReactNode }) {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard-scrollable region (axe scrollable-region-focusable)
    <div className="kx-sticky-head kx-table-wrap overflow-auto" tabIndex={0} role="region" aria-label={head.filter(Boolean).slice(0, 2).join(" / ")}>
      <table className="kx-table w-full text-start text-sm">
        <thead><tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground rtl:normal-case rtl:tracking-normal">{head.map((h) => <th key={h} scope="col" className="whitespace-nowrap px-3 py-2.5 text-start text-[11px] font-semibold">{h}</th>)}</tr></thead>
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
export function Empty({ children }: { children: ReactNode }) { return <EmptyState compact title={children} />; }

export function PageHeader({ title, actions, subtitle }: { title: string; actions?: ReactNode; subtitle?: string }) {
  return (
    <KitPageHeader title={title} description={subtitle} actions={actions} />
  );
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

export function Tabs({ tabs, value, onChange }: { tabs: Array<{ id: string; label: string }>; value: string; onChange: (id: string) => void }) {
  return (
    <div role="tablist" className="mb-4 flex gap-1 overflow-x-auto border-b border-border">
      {tabs.map((t) => (
        <button key={t.id} role="tab" type="button" aria-selected={value === t.id} id={`tab-${t.id}`} aria-controls={`panel-${t.id}`} onClick={() => onChange(t.id)}
          className={cn("min-h-10 whitespace-nowrap border-b-2 px-4 text-sm font-medium", value === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>{t.label}</button>
      ))}
    </div>
  );
}
