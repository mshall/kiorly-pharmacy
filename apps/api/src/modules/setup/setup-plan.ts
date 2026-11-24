/**
 * Quick setup (Pharmacy), pure rules. Every step is computed from real data (never a manual tick); per-branch steps are listed per branch
 * with their own state and deep link; optional steps can be skipped (the only stored state). New branches simply appear as new pending entities.
 */
import type { StaffRole } from "../../generated/prisma/client";
import { ROLE_PERMISSIONS, type Permission } from "../../auth/permissions";

export type SetupStatus = "pending" | "done" | "skipped";
export type SetupKey =
  | "branch_licence" | "pharmacist_licence" | "drug_prices" | "first_stock" | "invite_staff" | "receipt_settings" | "first_sale" | "connect_kiorex";

export interface BranchSnap { id: string; name: string; licenceNo: string | null; address: string | null; stockLots: number; sales: number }
export interface SetupSnapshot {
  branches: BranchSnap[];
  /** A PHARMACIST/OWNER with a syndicate licence number. */
  pharmacistLicensed: boolean;
  /** Price-book entries this organisation created (the global drug catalogue is pre-loaded, so only prices are a real setup action). */
  pricedDrugs: number;
  otherStaff: number;
  receiptConfigured: boolean;
  connectStatus: string | null;
}
export interface Viewer { role: StaffRole }
interface Def {
  key: SetupKey; scope: "org" | "branch"; required: boolean; perm: Permission; hideIfCannot?: boolean;
  done: (s: SetupSnapshot, b?: BranchSnap) => boolean; href: (branchId?: string) => string;
}
const q = (path: string, key: string, entity?: string) => `${path}${path.includes("?") ? "&" : "?"}setup=${key}${entity ? `&entity=${entity}` : ""}`;

export const SETUP_DEFS: Def[] = [
  { key: "branch_licence", scope: "branch", required: true, perm: "settings.write", done: (_s, b) => Boolean(b?.licenceNo?.trim() && b?.address?.trim()), href: (id) => q("/settings?tab=branches", "branch_licence", id) },
  { key: "pharmacist_licence", scope: "org", required: true, perm: "staff.manage", done: (s) => s.pharmacistLicensed, href: () => q("/settings?tab=staff", "pharmacist_licence") },
  { key: "drug_prices", scope: "org", required: true, perm: "price.write", done: (s) => s.pricedDrugs > 0, href: () => q("/catalogue", "drug_prices") },
  { key: "first_stock", scope: "branch", required: true, perm: "inventory.receive", done: (_s, b) => (b?.stockLots ?? 0) > 0, href: (id) => q("/receiving", "first_stock", id) },
  { key: "invite_staff", scope: "org", required: false, perm: "staff.manage", done: (s) => s.otherStaff > 0, href: () => q("/settings?tab=staff", "invite_staff") },
  { key: "receipt_settings", scope: "org", required: false, perm: "settings.write", done: (s) => s.receiptConfigured, href: () => q("/settings?tab=receipt", "receipt_settings") },
  { key: "first_sale", scope: "branch", required: true, perm: "pos.sell", done: (_s, b) => (b?.sales ?? 0) > 0, href: (id) => q("/pos", "first_sale", id) },
  { key: "connect_kiorex", scope: "org", required: false, perm: "settings.write", hideIfCannot: true, done: (s) => ["REQUESTED", "APPROVED", "PAUSED", "CHANGES_REQUESTED"].includes(s.connectStatus ?? ""), href: () => q("/kiorex-connect", "connect_kiorex") },
];

export interface EntityDto { id: string; name: string; status: SetupStatus; href: string }
export interface StepDto {
  key: SetupKey; order: number; required: boolean; manual: false; scope: "org" | "branch"; status: SetupStatus; href: string;
  whoCan: StaffRole[]; canPerform: boolean; available: boolean; entities: EntityDto[] | null; doneCount: number; totalCount: number;
}
export interface PlanDto {
  steps: StepDto[]; progressPercent: number; overallPercent: number; doneUnits: number; totalUnits: number; allDone: boolean;
  nextKey: SetupKey | null; nextHref: string | null; dismissedAt: string | null;
}

export const skipKey = (key: string, entity?: string | null) => (entity ? `${key}@${entity}` : key);
export const rolesWith = (perm: Permission): StaffRole[] => (Object.keys(ROLE_PERMISSIONS) as StaffRole[]).filter((r) => ROLE_PERMISSIONS[r].has(perm));

export function buildPlan(snap: SetupSnapshot, skipped: Record<string, string>, viewer: Viewer, dismissedAt: string | null = null): PlanDto {
  const steps: StepDto[] = [];
  let order = 0;
  for (const d of SETUP_DEFS) {
    const canPerform = ROLE_PERMISSIONS[viewer.role].has(d.perm);
    if (d.hideIfCannot && !canPerform) continue;
    order += 1;
    let entities: EntityDto[] | null = null;
    let status: SetupStatus; let href: string; let doneCount: number; let totalCount: number;
    if (d.scope === "branch") {
      entities = snap.branches.map((b) => {
        const done = d.done(snap, b);
        const sk = !done && !d.required && skipped[skipKey(d.key, b.id)] === "skipped";
        return { id: b.id, name: b.name, status: done ? "done" : sk ? "skipped" : "pending", href: d.href(b.id) } as EntityDto;
      });
      totalCount = entities.length; doneCount = entities.filter((e) => e.status !== "pending").length;
      const first = entities.find((e) => e.status === "pending");
      status = totalCount === 0 ? "pending" : first ? "pending" : entities.every((e) => e.status === "skipped") ? "skipped" : "done";
      href = (first ?? entities[0])?.href ?? d.href();
    } else {
      const done = d.done(snap);
      const sk = !done && !d.required && skipped[d.key] === "skipped";
      status = done ? "done" : sk ? "skipped" : "pending"; totalCount = 1; doneCount = status === "pending" ? 0 : 1; href = d.href();
    }
    steps.push({ key: d.key, order, required: d.required, manual: false, scope: d.scope, status, href, whoCan: rolesWith(d.perm), canPerform, available: true, entities, doneCount, totalCount });
  }
  const units = (s: StepDto) => Math.max(s.totalCount, 1);
  const req = steps.filter((s) => s.required);
  const reqTotal = req.reduce((a, s) => a + units(s), 0), reqDone = req.reduce((a, s) => a + s.doneCount, 0);
  const total = steps.reduce((a, s) => a + units(s), 0), done = steps.reduce((a, s) => a + s.doneCount, 0);
  const next = steps.find((s) => s.status === "pending") ?? null;
  const allDone = total > 0 && done === total;
  return {
    steps, progressPercent: reqTotal ? Math.round((reqDone / reqTotal) * 100) : 100, overallPercent: total ? Math.round((done / total) * 100) : 100,
    doneUnits: done, totalUnits: total, allDone, nextKey: next?.key ?? null, nextHref: next?.href ?? null, dismissedAt: allDone ? dismissedAt : null,
  };
}
