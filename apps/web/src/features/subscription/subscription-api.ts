import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import "./subscription-strings";

export type DowngradeImpact = { fromEdition: string; toEdition: string; lostFeatures: string[]; reducedLimits: { key: "users" | "branches"; from: number | null; to: number | null; current: number; overBy: number }[]; dataRetained: true; readOnlyGraceDays: number };
export type SubState = {
  isOwner: boolean; edition: string; status: string; onFreePlan: boolean; autoRenew: boolean; autoRenewForced: "ON" | "OFF" | null; canChangeAutoRenew: boolean; willDowngradeAtPeriodEnd: boolean;
  currentPeriodEnd: string; renewsOn: string | null; endsOn: string | null; paymentMethod: { brand: string | null; last4: string; expMonth: number | null; expYear: number | null } | null;
  downgradedToLiteAt: string | null; liteReadOnlyGraceUntil: string | null; previousEdition: string | null; canReactivate: boolean; downgradeImpact: DowngradeImpact | null;
  policy: { downgradeAfterDays: number; renewalReminderDaysBefore: number[]; liteReadOnlyGraceDays: number };
};
export type PlanRow = { edition: string; relation: "CURRENT" | "UPGRADE" | "DOWNGRADE"; maxUsers: number | null; maxBranches: number | null; capabilities: string[]; addOns: string[]; prices: { interval: string; amount: string; currency: string }[]; priceNeedsHuman: boolean; downgradeImpact: DowngradeImpact | null };
export type PlanCompare = { currentEdition: string; usage: { users: number; branches: number }; taxLine: { ratePercent: number } | null; plans: PlanRow[] };
export type InvoiceRow = { id: string; number: string; periodKey: string; status: string; currency: string; total: string; issuedAt: string };

export const useSubState = () => useQuery({ queryKey: ["sub", "state"], queryFn: () => api<SubState>("/subscription") });
export const useSubPlans = () => useQuery({ queryKey: ["sub", "plans"], queryFn: () => api<PlanCompare>("/subscription/plans") });
export const useSubInvoices = () => useQuery({ queryKey: ["sub", "invoices"], queryFn: () => api<InvoiceRow[]>("/subscription/invoices") });
export function useSubMutations() {
  const qc = useQueryClient();
  const done = () => { void qc.invalidateQueries({ queryKey: ["sub"] }); void qc.invalidateQueries({ queryKey: ["me"] }); };
  return {
    autoRenew: useMutation({ mutationFn: (body: { enabled: boolean; confirmDowngrade?: boolean }) => api<SubState>("/subscription/auto-renew", { method: "POST", body }), onSuccess: done }),
    reactivate: useMutation({ mutationFn: (body: { edition: string; interval: string }) => api<{ needsPaymentMethod: boolean }>("/subscription/reactivate", { method: "POST", body }), onSuccess: done }),
    card: useMutation({ mutationFn: (body: { tokenRef: string; brand: string; last4: string; expMonth: number; expYear: number }) => api<SubState>("/subscription/payment-method", { method: "PUT", body }), onSuccess: done }),
  };
}
