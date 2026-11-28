"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesWith = exports.skipKey = exports.SETUP_DEFS = void 0;
exports.buildPlan = buildPlan;
const permissions_1 = require("../../auth/permissions");
const q = (path, key, entity) => `${path}${path.includes("?") ? "&" : "?"}setup=${key}${entity ? `&entity=${entity}` : ""}`;
exports.SETUP_DEFS = [
    { key: "branch_licence", scope: "branch", required: true, perm: "settings.write", done: (_s, b) => Boolean(b?.licenceNo?.trim() && b?.address?.trim()), href: (id) => q("/settings?tab=branches", "branch_licence", id) },
    { key: "pharmacist_licence", scope: "org", required: true, perm: "staff.manage", done: (s) => s.pharmacistLicensed, href: () => q("/settings?tab=staff", "pharmacist_licence") },
    { key: "drug_prices", scope: "org", required: true, perm: "price.write", done: (s) => s.pricedDrugs > 0, href: () => q("/catalogue", "drug_prices") },
    { key: "first_stock", scope: "branch", required: true, perm: "inventory.receive", done: (_s, b) => (b?.stockLots ?? 0) > 0, href: (id) => q("/receiving", "first_stock", id) },
    { key: "invite_staff", scope: "org", required: false, perm: "staff.manage", done: (s) => s.otherStaff > 0, href: () => q("/settings?tab=staff", "invite_staff") },
    { key: "receipt_settings", scope: "org", required: false, perm: "settings.write", done: (s) => s.receiptConfigured, href: () => q("/settings?tab=receipt", "receipt_settings") },
    { key: "first_sale", scope: "branch", required: true, perm: "pos.sell", done: (_s, b) => (b?.sales ?? 0) > 0, href: (id) => q("/pos", "first_sale", id) },
    { key: "connect_kiorex", scope: "org", required: false, perm: "settings.write", hideIfCannot: true, done: (s) => ["REQUESTED", "APPROVED", "PAUSED", "CHANGES_REQUESTED"].includes(s.connectStatus ?? ""), href: () => q("/kiorex-connect", "connect_kiorex") },
];
const skipKey = (key, entity) => (entity ? `${key}@${entity}` : key);
exports.skipKey = skipKey;
const rolesWith = (perm) => Object.keys(permissions_1.ROLE_PERMISSIONS).filter((r) => permissions_1.ROLE_PERMISSIONS[r].has(perm));
exports.rolesWith = rolesWith;
function buildPlan(snap, skipped, viewer, dismissedAt = null) {
    const steps = [];
    let order = 0;
    for (const d of exports.SETUP_DEFS) {
        const canPerform = permissions_1.ROLE_PERMISSIONS[viewer.role].has(d.perm);
        if (d.hideIfCannot && !canPerform)
            continue;
        order += 1;
        let entities = null;
        let status;
        let href;
        let doneCount;
        let totalCount;
        if (d.scope === "branch") {
            entities = snap.branches.map((b) => {
                const done = d.done(snap, b);
                const sk = !done && !d.required && skipped[(0, exports.skipKey)(d.key, b.id)] === "skipped";
                return { id: b.id, name: b.name, status: done ? "done" : sk ? "skipped" : "pending", href: d.href(b.id) };
            });
            totalCount = entities.length;
            doneCount = entities.filter((e) => e.status !== "pending").length;
            const first = entities.find((e) => e.status === "pending");
            status = totalCount === 0 ? "pending" : first ? "pending" : entities.every((e) => e.status === "skipped") ? "skipped" : "done";
            href = (first ?? entities[0])?.href ?? d.href();
        }
        else {
            const done = d.done(snap);
            const sk = !done && !d.required && skipped[d.key] === "skipped";
            status = done ? "done" : sk ? "skipped" : "pending";
            totalCount = 1;
            doneCount = status === "pending" ? 0 : 1;
            href = d.href();
        }
        steps.push({ key: d.key, order, required: d.required, manual: false, scope: d.scope, status, href, whoCan: (0, exports.rolesWith)(d.perm), canPerform, available: true, entities, doneCount, totalCount });
    }
    const units = (s) => Math.max(s.totalCount, 1);
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
//# sourceMappingURL=setup-plan.js.map