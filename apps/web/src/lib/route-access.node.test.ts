import assert from "node:assert/strict";
import { test } from "node:test";
import { routeDeniedReason } from "./route-access";

const items = [
  { to: "/pos", perm: "pos.sell" },
  { to: "/rx", perm: "rx.read" },
  { to: "/orders", perm: "orders.read", flag: "pharmacy.kiorex_orders" },
  { to: "/finance", perm: "finance.read" },
];
const cashier = (p: string) => ["pos.sell", "orders.read"].includes(p);
const on = () => true;

test("a hidden nav entry is denied on direct URL", () => {
  assert.equal(routeDeniedReason("/finance", items, cashier, on), "perm");
  assert.equal(routeDeniedReason("/rx/abc", items, cashier, on), "perm");
  assert.equal(routeDeniedReason("/dispensing/abc", items, cashier, on), "perm");
});
test("allowed routes, the dashboard and unknown paths pass", () => {
  assert.equal(routeDeniedReason("/pos", items, cashier, on), null);
  assert.equal(routeDeniedReason("/", items, cashier, on), null);
  assert.equal(routeDeniedReason("/something-else", items, cashier, on), null);
});
test("a switched-off feature flag reads as 'flag', not 'perm'", () => {
  assert.equal(routeDeniedReason("/orders", items, cashier, (k) => k !== "pharmacy.kiorex_orders"), "flag");
});
