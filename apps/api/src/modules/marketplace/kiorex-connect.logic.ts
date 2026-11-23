import type { ConnectStatus, ConnectStep, StepStatus } from "./kiorex-connect.core";

/** Kiorly Pharmacy: step checklist computed from real state (pure). */
export interface PharmacyConnectFacts {
  status: ConnectStatus;
  subscriptionStatus: string;
  optedInBranches: number;
  pricedItems: number;
  /** opted-in branches missing opening hours or a map pin */
  branchesMissingHours: number;
  branchesMissingLicenceNo: number;
  licenceDocument: boolean;
  payoutLabel: boolean;
  termsAccepted: boolean;
  liveOnKiorex: boolean;
}
export function computePharmacySteps(f: PharmacyConnectFacts): ConnectStep[] {
  const s: ConnectStep[] = [];
  const sub = f.subscriptionStatus;
  s.push({ key: "subscription", status: sub === "ACTIVE" || sub === "TRIAL" ? "done" : "blocked", link: "/settings", detail: { subscription: sub } });
  s.push({ key: "branch_optin", status: f.optedInBranches > 0 ? "done" : "action_needed", link: "/orders", detail: { branches: f.optedInBranches } });
  s.push({ key: "catalogue", status: f.pricedItems > 0 ? "done" : "action_needed", link: "/catalogue", detail: { priced: f.pricedItems } });
  s.push({ key: "hours_delivery", status: f.optedInBranches > 0 && f.branchesMissingHours === 0 ? "done" : "action_needed", link: "/orders", detail: { missing: f.branchesMissingHours } });
  s.push({ key: "licence", status: f.optedInBranches > 0 && f.branchesMissingLicenceNo === 0 && f.licenceDocument ? "done" : "action_needed", link: "/settings", detail: { branchesMissingLicenceNo: f.branchesMissingLicenceNo, document: f.licenceDocument } });
  s.push({ key: "payout", status: f.payoutLabel ? "done" : "action_needed", detail: {} });
  s.push({ key: "terms", status: f.termsAccepted ? "done" : "action_needed", detail: {} });
  const prereq = s.every((x) => x.status === "done");
  const requested: StepStatus = f.status === "APPROVED" ? "done" : ["REQUESTED", "PAUSED"].includes(f.status) ? "waiting_kiorex" : prereq ? "action_needed" : "blocked";
  s.push({ key: "request", status: f.status === "CHANGES_REQUESTED" || f.status === "REJECTED" ? (prereq ? "action_needed" : "blocked") : requested, detail: { connectStatus: f.status } });
  s.push({ key: "live", status: f.status === "APPROVED" && f.liveOnKiorex ? "done" : "blocked", detail: {} });
  return s;
}
