import { useQuery } from "@tanstack/react-query";
import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { setLang, type Lang } from "@/lib/i18n";
import { Button, Select, cn } from "@/components/ui";
import { listQueue } from "@/lib/offline";

interface NavItem { to: string; label: string; perm?: string; flag?: string; icon: string }

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
    { to: "/", label: t("nav.dashboard"), icon: "▦" },
    { to: "/pos", label: t("nav.pos"), perm: "pos.sell", icon: "◎" },
    { to: "/rx", label: t("nav.rx"), perm: "rx.read", icon: "℞" },
    { to: "/orders", label: t("nav.orders"), perm: "orders.read", flag: "pharmacy.kiorex_orders", icon: "✉" },
    { to: "/catalogue", label: t("nav.catalogue"), perm: "catalogue.read", icon: "☰" },
    { to: "/inventory", label: t("nav.inventory"), perm: "inventory.read", icon: "▤" },
    { to: "/receiving", label: t("nav.receiving"), perm: "inventory.receive", icon: "⇩" },
    { to: "/purchasing", label: t("nav.purchasing"), perm: "supplier.read", icon: "⛟" },
    { to: "/reports", label: t("nav.reports"), perm: "reports.read", icon: "▥" },
    { to: "/settings", label: t("nav.settings"), perm: "settings.read", icon: "⚙" },
  ].filter((i) => (!i.perm || can(i.perm)) && (!i.flag || flag(i.flag)));
  const next: Lang = i18n.language === "ar" ? "en" : "ar";

  return (
    <div className="min-h-screen md:flex">
      <a href="#main" className="skip-link">{t("common.skip")}</a>
      <nav aria-label={t("nav.main")} className="no-print border-b border-border bg-card md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-e">
        <div className="flex items-center gap-2 px-4 py-4"><img src="/logo.svg" alt="" className="h-8 w-8" /><span className="font-semibold">{t("app.product")}</span></div>
        <ul className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:overflow-visible">
          {items.map((i) => (
            <li key={i.to}>
              <NavLink to={i.to} end={i.to === "/"} className={({ isActive }) => cn("flex min-h-11 items-center gap-3 whitespace-nowrap rounded-md px-3 text-sm hover:bg-accent", isActive && "bg-accent font-semibold text-accent-foreground")}>
                <span aria-hidden="true" className="w-5 text-center">{i.icon}</span>{i.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="min-w-0 flex-1">
        <header className="no-print flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card px-4 py-2">
          <div className="flex items-center gap-3">
            {me && me.branches.length > 1 && !me.user.branchId ? (
              <label className="flex items-center gap-2 text-sm">{t("common.branch")}
                <Select aria-label={t("common.branch")} value={branchId ?? ""} onChange={(e) => setBranchId(e.target.value)} className="w-44">{me.branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>
              </label>
            ) : <span className="text-sm text-muted-foreground">{me?.branches.find((b) => b.id === branchId)?.name}</span>}
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", online ? "bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]" : "bg-destructive/15 text-danger")} data-testid="online-status">{online ? t("common.online") : t("common.offline")}</span>
            {!!queued.data && <span className="rounded-full bg-[hsl(var(--warning)/0.18)] px-2 py-0.5 text-xs font-semibold text-[hsl(var(--warning))]">{t("pos.queued", { count: queued.data })}</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm sm:inline">{me?.user.displayName} · {me ? t(`roles.${me.user.role}`) : ""}</span>
            <Button variant="outline" size="sm" onClick={() => setLang(next)}>{t("app.lang")}</Button>
            <Button variant="outline" size="sm" onClick={logout}>{t("auth.logout")}</Button>
          </div>
        </header>
        <main id="main" tabIndex={-1} className="p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
