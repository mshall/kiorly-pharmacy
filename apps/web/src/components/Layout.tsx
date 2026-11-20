import { useQuery } from "@tanstack/react-query";
import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { setLang, type Lang } from "@/lib/i18n";
import { Button, Select, cn } from "@/components/ui";
import { listQueue } from "@/lib/offline";
import { KiorlyBrand, ThemeToggle } from "@/brand/ui-kit";
import { BarChart3, BookOpen, Boxes, Inbox, LayoutDashboard, PackagePlus, Pill, Settings, ShoppingCart, Truck, type LucideIcon } from "lucide-react";

interface NavItem { to: string; label: string; perm?: string; flag?: string; icon: LucideIcon }

export function useOnline(): boolean {
  const [on, setOn] = useState(navigator.onLine);
  useEffect(() => {
    const a = () => setOn(true), b = () => setOn(false);
    window.addEventListener("online", a); window.addEventListener("offline", b);
    return () => { window.removeEventListener("online", a); window.removeEventListener("offline", b); };
  }, []);
  return on;
}

export function Layout() {
  const { t, i18n } = useTranslation();
  const { me, can, flag, logout, branchId, setBranchId } = useAuth();
  const online = useOnline();
  const queued = useQuery({ queryKey: ["offline-queue"], queryFn: () => listQueue().then((q) => q.length), refetchInterval: 5000 });
  const items: NavItem[] = [
    { to: "/", label: t("nav.dashboard"), icon: LayoutDashboard },
    { to: "/pos", label: t("nav.pos"), perm: "pos.sell", icon: ShoppingCart },
    { to: "/rx", label: t("nav.rx"), perm: "rx.read", icon: Pill },
    { to: "/orders", label: t("nav.orders"), perm: "orders.read", flag: "pharmacy.kiorex_orders", icon: Inbox },
    { to: "/catalogue", label: t("nav.catalogue"), perm: "catalogue.read", icon: BookOpen },
    { to: "/inventory", label: t("nav.inventory"), perm: "inventory.read", icon: Boxes },
    { to: "/receiving", label: t("nav.receiving"), perm: "inventory.receive", icon: PackagePlus },
    { to: "/purchasing", label: t("nav.purchasing"), perm: "supplier.read", icon: Truck },
    { to: "/reports", label: t("nav.reports"), perm: "reports.read", icon: BarChart3 },
    { to: "/settings", label: t("nav.settings"), perm: "settings.read", icon: Settings },
  ].filter((i) => (!i.perm || can(i.perm)) && (!i.flag || flag(i.flag)));
  const next: Lang = i18n.language === "ar" ? "en" : "ar";

  return (
    <div className="min-h-screen md:flex">
      <a href="#main" className="skip-link">{t("common.skip")}</a>
      <nav aria-label={t("nav.main")} className="no-print border-b border-border bg-card md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:overflow-y-auto md:border-b-0 md:border-e">
        <div className="px-4 py-4"><KiorlyBrand height={40} /><div className="mt-1.5 text-sm font-semibold">{t("app.product")}</div></div>
        <ul className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:overflow-visible">
          {items.map((i) => (
            <li key={i.to}>
              <NavLink to={i.to} end={i.to === "/"} className={({ isActive }) => cn("relative flex min-h-11 items-center gap-3 whitespace-nowrap rounded-lg px-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground", isActive && "bg-accent font-semibold text-accent-foreground before:absolute before:inset-y-2 before:start-0 before:w-[3px] before:rounded-full before:bg-primary")}>
                <i.icon aria-hidden="true" className="size-[18px] shrink-0" />{i.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="min-w-0 flex-1">
        <header className="no-print sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card/90 px-4 py-2 backdrop-blur">
          <div className="flex items-center gap-3">
            {me && me.branches.length > 1 && !me.user.branchId ? (
              <label className="flex items-center gap-2 text-sm">{t("common.branch")}
                <Select aria-label={t("common.branch")} value={branchId ?? ""} onChange={(e) => setBranchId(e.target.value)} className="w-44">{me.branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>
              </label>
            ) : <span className="text-sm text-muted-foreground">{me?.branches.find((b) => b.id === branchId)?.name}</span>}
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", online ? "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))] ring-[hsl(var(--success)/0.25)]" : "bg-[hsl(var(--danger-text)/0.12)] text-[hsl(var(--danger-text))] ring-[hsl(var(--danger-text)/0.28)]")} data-testid="online-status"><span aria-hidden className={cn("size-1.5 rounded-full", online ? "bg-[hsl(var(--success))]" : "bg-[hsl(var(--danger-text))]")} />{online ? t("common.online") : t("common.offline")}</span>
            {!!queued.data && <span className="rounded-full bg-[hsl(var(--warning)/0.18)] px-2 py-0.5 text-xs font-semibold text-[hsl(var(--warning))]">{t("pos.queued", { count: queued.data })}</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm sm:inline">{me?.user.displayName} · {me ? t(`roles.${me.user.role}`) : ""}</span>
            <ThemeToggle labels={{ theme: t("theme.label"), light: t("theme.light"), dark: t("theme.dark"), system: t("theme.system") }} className="size-8 text-sm" />
            <Button variant="outline" size="sm" onClick={() => setLang(next)}>{t("app.lang")}</Button>
            <Button variant="outline" size="sm" onClick={logout}>{t("auth.logout")}</Button>
          </div>
        </header>
        <main id="main" tabIndex={-1} className="p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
