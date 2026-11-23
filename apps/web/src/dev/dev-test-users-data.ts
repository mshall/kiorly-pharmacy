/**
 * DEV ONLY synthetic Kiorly Pharmacy logins (kiorly-pharmacy/DEMO_DATA.md, `npm run seed:demo`): 15 accounts, one dev password.
 * Imported only by ./dev-test-users.tsx, which the login page loads behind `import.meta.env.DEV`, so none of this reaches a production bundle.
 */
export const DEMO_PASSWORD = "Demo@12345";
export type DevGroupKey = "chain" | "solo" | "basic";
export interface DevUser { email: string; name: string; role: string; group: DevGroupKey }
const E = "@demo.kiorly.local";
const u = (local: string, name: string, role: string, group: DevGroupKey): DevUser => ({ email: `${local}${E}`, name, role, group });

export const DEV_GROUPS: Record<DevGroupKey, { en: string; ar: string }> = {
  chain: { en: "Kiorly Demo Pharmacy (chain, Enterprise, Kiorex orders)", ar: "صيدلية كيورلي التجريبية (سلسلة، Enterprise، طلبات كيوريكس)" },
  solo: { en: "Kiorly Solo Pharmacy (Pro, standalone)", ar: "صيدلية كيورلي الفردية (Pro، مستقلة)" },
  basic: { en: "Kiorly Corner Pharmacy (Lite / Basic)", ar: "صيدلية الركن (Lite / Basic)" },
};
export const DEV_USERS: DevUser[] = [
  u("owner", "Dr. Demo Owner", "Owner (licensed pharmacist)", "chain"),
  u("pharmacist", "Ph. Salma Demo", "Pharmacist (can sign off)", "chain"),
  u("pharmacist2", "Pharmacist 2", "Pharmacist (witness)", "chain"),
  u("manager", "Mona Manager", "Branch manager", "chain"),
  u("cashier", "Omar Cashier", "Cashier", "chain"),
  u("assistant", "Asma Assistant", "Assistant", "chain"),
  u("chain", "Chain Ops", "Chain operations", "chain"),
  u("solo.owner", "Dr. Solo Owner", "Owner", "solo"),
  u("solo.pharmacist", "Solo Pharmacist", "Pharmacist", "solo"),
  u("solo.manager", "Solo Manager", "Branch manager", "solo"),
  u("solo.cashier", "Solo Cashier", "Cashier", "solo"),
  u("solo.assistant", "Solo Assistant", "Assistant", "solo"),
  u("owner.basic", "Dr. Basic Owner", "Owner", "basic"),
  u("pharmacist.basic", "Basic Pharmacist", "Pharmacist", "basic"),
  u("cashier.basic", "Basic Cashier", "Cashier", "basic"),
];
