"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtraReports = exports.REPORT_CATALOGUE = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const money_1 = require("../../common/money");
const aging_1 = require("../../common/aging");
const finance_service_1 = require("../finance/finance.service");
const purchasing_service_1 = require("../purchasing/purchasing.service");
const inventory_analytics_service_1 = require("../inventory/inventory-analytics.service");
const refills_service_1 = require("../prescriptions/refills.service");
const col = (key, label) => ({ key, label });
const d10 = (d) => (d ? d.toISOString().slice(0, 10) : null);
const dt = (d) => (d ? d.toISOString().slice(0, 16).replace("T", " ") : null);
const bid = (p) => p.branchId ?? null;
const pct = (n, base) => (base.gt(0) ? Math.round(n.div(base).mul(1000).toNumber()) / 10 : 0);
exports.REPORT_CATALOGUE = [
    { name: "sales-daily", group: "SALES" }, { name: "top-sellers", group: "SALES" }, { name: "sales-by-cashier", group: "SALES" }, { name: "sales-by-hour", group: "SALES" }, { name: "payments-by-method", group: "SALES" },
    { name: "returns", group: "SALES" }, { name: "discount-usage", group: "SALES" }, { name: "cash-close", group: "SALES" }, { name: "vat-lines", group: "SALES" }, { name: "loyalty", group: "SALES" },
    { name: "margin-by-product", group: "PROFIT" }, { name: "margin-by-category", group: "PROFIT" }, { name: "expenses", group: "PROFIT" }, { name: "price-changes", group: "PROFIT" },
    { name: "stock-valuation", group: "STOCK" }, { name: "expiry", group: "STOCK" }, { name: "near-expiry", group: "STOCK" }, { name: "low-stock", group: "STOCK" }, { name: "fast-slow-movers", group: "STOCK" }, { name: "dead-stock", group: "STOCK" }, { name: "stock-adjustments", group: "STOCK" },
    { name: "controlled-register", group: "CLINICAL" }, { name: "dispensing-log", group: "CLINICAL" }, { name: "rx-volume", group: "CLINICAL" }, { name: "pharmacist-performance", group: "CLINICAL" }, { name: "safety-overrides", group: "CLINICAL" }, { name: "refills-due", group: "CLINICAL" },
    { name: "supplier-balances", group: "PURCHASING" }, { name: "supplier-aging", group: "PURCHASING" }, { name: "cost-variance", group: "PURCHASING" },
    { name: "customer-receivables", group: "RECEIVABLES" }, { name: "insurer-claims", group: "RECEIVABLES" },
];
let ExtraReports = class ExtraReports {
    prisma;
    finance;
    purchasing;
    analytics;
    refills;
    constructor(prisma, finance, purchasing, analytics, refills) {
        this.prisma = prisma;
        this.finance = finance;
        this.purchasing = purchasing;
        this.analytics = analytics;
        this.refills = refills;
    }
    has(name) { return exports.REPORT_CATALOGUE.some((r) => r.name === name); }
    async run(name, p) {
        switch (name) {
            case "margin-by-product":
            case "margin-by-category": {
                const rows = await this.finance.margin(p, name === "margin-by-product" ? "product" : "category");
                return { name, title: name === "margin-by-product" ? "Gross margin by product" : "Gross margin by category", note: "Net of VAT (VAT is shown as an included line only). Cost = unit cost of the lot sold.", columns: [col(name === "margin-by-product" ? "label" : "category", name === "margin-by-product" ? "Product" : "Category"), col("units", "Units"), col("revenue", "Net sales"), col("cogs", "Cost"), col("margin", "Margin"), col("marginPct", "Margin %")], rows: rows.map((r) => ({ [name === "margin-by-product" ? "label" : "category"]: r.label, units: r.units, revenue: r.revenue, cogs: r.cogs, margin: r.margin, marginPct: r.marginPct })) };
            }
            case "sales-by-cashier": {
                const r = await this.prisma.$queryRaw `SELECT s."soldBy" AS who, COUNT(*) AS sales, SUM(s.total) AS gross, SUM(s."discountTotal") AS discount, SUM(s."vatTotal") AS vat FROM "Sale" s WHERE s."orgId" = ${p.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${p.from} AND s."soldAt" <= ${p.to} AND (${bid(p)}::text IS NULL OR s."branchId" = ${bid(p)}) GROUP BY 1 ORDER BY 3 DESC`;
                const staff = new Map((await this.prisma.staffUser.findMany({ where: { id: { in: r.map((x) => x.who) } }, select: { id: true, displayName: true } })).map((s) => [s.id, s.displayName]));
                return { name, title: "Sales by cashier", columns: [col("staff", "Staff"), col("sales", "Sales"), col("gross", "Gross"), col("discount", "Discount"), col("avg", "Average sale"), col("vat", "VAT (incl.)")], rows: r.map((x) => ({ staff: staff.get(x.who) ?? x.who, sales: Number(x.sales), gross: (0, money_1.money)(x.gross), discount: (0, money_1.money)(x.discount), avg: (0, money_1.money)((0, money_1.D)(x.gross).div(Math.max(Number(x.sales), 1))), vat: (0, money_1.money)(x.vat) })) };
            }
            case "sales-by-hour": {
                const r = await this.prisma.$queryRaw `SELECT EXTRACT(HOUR FROM s."soldAt" AT TIME ZONE 'Africa/Cairo')::int AS hour, COUNT(*) AS sales, SUM(s.total) AS gross FROM "Sale" s WHERE s."orgId" = ${p.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${p.from} AND s."soldAt" <= ${p.to} AND (${bid(p)}::text IS NULL OR s."branchId" = ${bid(p)}) GROUP BY 1 ORDER BY 1`;
                return { name, title: "Sales by hour of day", columns: [col("hour", "Hour"), col("sales", "Sales"), col("gross", "Gross")], rows: r.map((x) => ({ hour: `${String(x.hour).padStart(2, "0")}:00`, sales: Number(x.sales), gross: (0, money_1.money)(x.gross) })) };
            }
            case "payments-by-method": {
                const r = await this.prisma.$queryRaw `SELECT sp.method::text AS method, COUNT(*) AS n, SUM(sp.amount) AS amount FROM "SalePayment" sp JOIN "Sale" s ON s.id = sp."saleId" WHERE s."orgId" = ${p.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${p.from} AND s."soldAt" <= ${p.to} AND (${bid(p)}::text IS NULL OR s."branchId" = ${bid(p)}) GROUP BY 1 ORDER BY 3 DESC`;
                const total = r.reduce((a, x) => a.plus(x.amount), (0, money_1.D)(0));
                return { name, title: "Payments by method", columns: [col("method", "Method"), col("count", "Payments"), col("amount", "Amount"), col("share", "Share %")], rows: r.map((x) => ({ method: x.method, count: Number(x.n), amount: (0, money_1.money)(x.amount), share: pct((0, money_1.D)(x.amount), total) })) };
            }
            case "returns": {
                const r = await this.prisma.saleReturn.findMany({ where: { sale: { orgId: p.orgId, ...(p.branchId ? { branchId: p.branchId } : {}) }, createdAt: { gte: p.from, lte: p.to } }, include: { sale: { select: { receiptNo: true } } }, orderBy: { createdAt: "desc" }, take: 5000 });
                const lots = new Map((await this.prisma.stockLot.findMany({ where: { id: { in: r.map((x) => x.lotId) } }, select: { id: true, drug: { select: { brandName: true } } } })).map((l) => [l.id, l.drug.brandName]));
                const staff = new Map((await this.prisma.staffUser.findMany({ where: { id: { in: r.map((x) => x.approvedBy) } }, select: { id: true, displayName: true } })).map((s) => [s.id, s.displayName]));
                return { name, title: "Returns and refunds", columns: [col("date", "Date"), col("receiptNo", "Receipt"), col("brandName", "Product"), col("quantity", "Qty"), col("refund", "Refund"), col("method", "Refund method"), col("reason", "Reason"), col("approvedBy", "Approved by")], rows: r.map((x) => ({ date: dt(x.createdAt), receiptNo: x.sale.receiptNo, brandName: lots.get(x.lotId) ?? "", quantity: x.quantity, refund: (0, money_1.money)(x.refund), method: x.refundMethod, reason: x.reason, approvedBy: staff.get(x.approvedBy) ?? x.approvedBy })) };
            }
            case "discount-usage": {
                const promos = await this.prisma.$queryRaw `SELECT p.name, COUNT(*) AS uses, SUM(r."discountAmount") AS amount FROM "PromotionRedemption" r JOIN "Promotion" p ON p.id = r."promotionId" JOIN "Sale" s ON s.id = r."saleId" WHERE r."orgId" = ${p.orgId} AND s."soldAt" >= ${p.from} AND s."soldAt" <= ${p.to} AND (${bid(p)}::text IS NULL OR s."branchId" = ${bid(p)}) GROUP BY 1 ORDER BY 3 DESC`;
                const manual = await this.prisma.$queryRaw `SELECT s."soldBy" AS who, COUNT(DISTINCT s.id) AS sales, SUM(sl.discount) AS amount FROM "SaleLine" sl JOIN "Sale" s ON s.id = sl."saleId" WHERE s."orgId" = ${p.orgId} AND s.status <> 'VOIDED' AND sl.discount > 0 AND s."soldAt" >= ${p.from} AND s."soldAt" <= ${p.to} AND (${bid(p)}::text IS NULL OR s."branchId" = ${bid(p)}) GROUP BY 1 ORDER BY 3 DESC`;
                const promoTotals = await this.prisma.$queryRaw `SELECT s."soldBy" AS who, SUM(r."discountAmount") AS amount FROM "PromotionRedemption" r JOIN "Sale" s ON s.id = r."saleId" WHERE r."orgId" = ${p.orgId} AND s."soldAt" >= ${p.from} AND s."soldAt" <= ${p.to} GROUP BY 1`;
                const pt = new Map(promoTotals.map((x) => [x.who, (0, money_1.D)(x.amount)]));
                const staff = new Map((await this.prisma.staffUser.findMany({ where: { id: { in: manual.map((m) => m.who) } }, select: { id: true, displayName: true } })).map((s) => [s.id, s.displayName]));
                return { name, title: "Discount usage", note: "PROMOTION rows are offers and coupons; MANUAL rows are discounts typed at the till (promotion discounts excluded).", columns: [col("type", "Type"), col("name", "Promotion / staff"), col("uses", "Uses"), col("amount", "Discount")], rows: [...promos.map((x) => ({ type: "PROMOTION", name: x.name, uses: Number(x.uses), amount: (0, money_1.money)(x.amount) })), ...manual.map((x) => ({ type: "MANUAL", name: staff.get(x.who) ?? x.who, uses: Number(x.sales), amount: (0, money_1.money)((0, money_1.D)(x.amount).minus(pt.get(x.who) ?? 0)) }))] };
            }
            case "cash-close": {
                const shifts = await this.prisma.shift.findMany({ where: { orgId: p.orgId, ...(p.branchId ? { branchId: p.branchId } : {}), openedAt: { gte: p.from, lte: p.to } }, orderBy: { openedAt: "desc" }, take: 2000 });
                const staff = new Map((await this.prisma.staffUser.findMany({ where: { id: { in: [...new Set(shifts.flatMap((s) => [s.openedBy, s.closedBy ?? ""]))] } }, select: { id: true, displayName: true } })).map((s) => [s.id, s.displayName]));
                return { name, title: "Cash close (shifts)", columns: [col("opened", "Opened"), col("closed", "Closed"), col("staff", "Cashier"), col("openingFloat", "Opening float"), col("expected", "Expected cash"), col("counted", "Counted cash"), col("variance", "Variance"), col("sales", "Sales"), col("gross", "Gross sales")], rows: shifts.map((s) => { const z = (s.zReport ?? {}); return { opened: dt(s.openedAt), closed: dt(s.closedAt), staff: staff.get(s.openedBy) ?? s.openedBy, openingFloat: (0, money_1.money)(s.openingFloat), expected: s.expectedCash ? (0, money_1.money)(s.expectedCash) : null, counted: s.countedCash ? (0, money_1.money)(s.countedCash) : null, variance: s.variance != null ? (0, money_1.money)(s.variance) : null, sales: z.salesCount ?? null, gross: z.grossSales ?? null }; }) };
            }
            case "loyalty": {
                const r = await this.prisma.$queryRaw `SELECT c.id, c."displayName", c."customerNo", c."loyaltyTier" AS tier, c."loyaltyPoints" AS balance, COALESCE(SUM(CASE WHEN e.points > 0 AND e."createdAt" >= ${p.from} AND e."createdAt" <= ${p.to} THEN e.points END),0) AS earned, COALESCE(-SUM(CASE WHEN e.points < 0 AND e."createdAt" >= ${p.from} AND e."createdAt" <= ${p.to} THEN e.points END),0) AS redeemed FROM "PatientRef" c LEFT JOIN "LoyaltyEntry" e ON e."patientId" = c.id WHERE c."orgId" = ${p.orgId} AND c."mergedIntoId" IS NULL GROUP BY c.id HAVING c."loyaltyPoints" <> 0 OR COUNT(e.id) > 0 ORDER BY c."loyaltyPoints" DESC LIMIT 1000`;
                return { name, title: "Loyalty points", columns: [col("customerNo", "Customer no."), col("customer", "Customer"), col("tier", "Tier"), col("earned", "Earned"), col("redeemed", "Redeemed"), col("balance", "Balance")], rows: r.map((x) => ({ customerNo: x.customerNo, customer: x.displayName, tier: x.tier, earned: Number(x.earned), redeemed: Number(x.redeemed), balance: x.balance })) };
            }
            case "expenses": {
                const r = await this.prisma.expense.findMany({ where: { orgId: p.orgId, voidedAt: null, expenseDate: { gte: p.from, lte: p.to }, ...(p.branchId ? { branchId: p.branchId } : {}) }, orderBy: { expenseDate: "desc" }, take: 5000 });
                return { name, title: "Expenses", columns: [col("date", "Date"), col("category", "Category"), col("amount", "Amount"), col("vat", "VAT (incl.)"), col("method", "Paid by"), col("description", "Description"), col("receiptRef", "Receipt ref")], rows: r.map((x) => ({ date: d10(x.expenseDate), category: x.category, amount: (0, money_1.money)(x.amount), vat: (0, money_1.money)(x.vatAmount), method: x.method, description: x.description, receiptRef: x.receiptRef })) };
            }
            case "price-changes": {
                const r = await this.prisma.priceBookEntry.findMany({ where: { orgId: p.orgId, effectiveFrom: { gte: p.from, lte: p.to } }, orderBy: { effectiveFrom: "desc" }, take: 5000 });
                const drugs = new Map((await this.prisma.drug.findMany({ where: { id: { in: [...new Set(r.map((x) => x.drugId))] } }, select: { id: true, brandName: true } })).map((x) => [x.id, x.brandName]));
                const prev = await this.prisma.priceBookEntry.findMany({ where: { orgId: p.orgId, drugId: { in: [...new Set(r.map((x) => x.drugId))] }, effectiveTo: { not: null } }, orderBy: { effectiveTo: "desc" } });
                return { name, title: "Price changes", columns: [col("effectiveFrom", "Effective"), col("brandName", "Product"), col("oldPrice", "Old price"), col("price", "New price"), col("changePct", "Change %")], rows: r.map((x) => { const old = prev.find((o) => o.drugId === x.drugId && o.branchId === x.branchId && o.effectiveTo && o.effectiveTo.getTime() === x.effectiveFrom.getTime()); return { effectiveFrom: d10(x.effectiveFrom), brandName: drugs.get(x.drugId) ?? x.drugId, oldPrice: old ? (0, money_1.money)(old.price) : null, price: (0, money_1.money)(x.price), changePct: old && old.price.gt(0) ? pct(x.price.minus(old.price), old.price) : null }; }) };
            }
            case "near-expiry": {
                const lots = await this.prisma.stockLot.findMany({ where: { orgId: p.orgId, ...(p.branchId ? { branchId: p.branchId } : {}), qtyOnHand: { gt: 0 }, status: { in: ["AVAILABLE", "RESERVED"] }, expiryDate: { gte: new Date(new Date().toISOString().slice(0, 10)), lte: new Date(Date.now() + 90 * 86_400_000) } }, include: { drug: { select: { brandName: true } } }, orderBy: { expiryDate: "asc" }, take: 5000 });
                return { name, title: "Near expiry (next 90 days)", note: "At-risk value is at cost. Act early: return to supplier, discount, or transfer to a faster branch.", columns: [col("brandName", "Product"), col("lotNumber", "Lot"), col("expiryDate", "Expiry"), col("daysLeft", "Days left"), col("bucket", "Bucket"), col("qtyOnHand", "On hand"), col("value", "Value at cost")], rows: lots.map((l) => { const days = Math.ceil((l.expiryDate.getTime() - Date.now()) / 86_400_000); return { brandName: l.drug.brandName, lotNumber: l.lotNumber, expiryDate: d10(l.expiryDate), daysLeft: days, bucket: days <= 30 ? "30" : days <= 60 ? "60" : "90", qtyOnHand: l.qtyOnHand, value: (0, money_1.money)(l.unitCost.mul(l.qtyOnHand)) }; }) };
            }
            case "low-stock": {
                const r = await this.prisma.$queryRaw `SELECT d."brandName", COALESCE((SELECT SUM(l."qtyOnHand" - l."qtyReserved") FROM "StockLot" l WHERE l."branchId" = rp."branchId" AND l."drugId" = rp."drugId" AND l.status IN ('AVAILABLE','RESERVED') AND l."expiryDate" >= kx_today()),0) AS sellable, rp."minQty", rp."maxQty", COALESCE((SELECT SUM(GREATEST(pl."qtyOrdered" - pl."qtyReceived",0)) FROM "PurchaseOrderLine" pl JOIN "PurchaseOrder" po ON po.id = pl."purchaseOrderId" WHERE po."branchId" = rp."branchId" AND pl."drugId" = rp."drugId" AND po.status IN ('SENT','PARTIALLY_RECEIVED')),0) AS "onOrder" FROM "ReorderPolicy" rp JOIN "Drug" d ON d.id = rp."drugId" WHERE rp."orgId" = ${p.orgId} AND (${bid(p)}::text IS NULL OR rp."branchId" = ${bid(p)}) ORDER BY d."brandName"`;
                const low = r.filter((x) => Number(x.sellable) <= x.minQty);
                return { name, title: "Low stock", columns: [col("brandName", "Product"), col("sellable", "Sellable"), col("onOrder", "On order"), col("minQty", "Min"), col("maxQty", "Max"), col("suggested", "Suggested order")], rows: low.map((x) => ({ brandName: x.brandName, sellable: Number(x.sellable), onOrder: Number(x.onOrder), minQty: x.minQty, maxQty: x.maxQty, suggested: Math.max(x.maxQty - Number(x.sellable) - Number(x.onOrder), 0) })) };
            }
            case "fast-slow-movers":
            case "dead-stock": {
                const branch = p.branchId ?? (await this.prisma.branch.findFirst({ where: { orgId: p.orgId, active: true }, orderBy: { createdAt: "asc" } }))?.id;
                const days = Math.min(Math.max(Math.round((p.to.getTime() - p.from.getTime()) / 86_400_000), 7), 365);
                const m = branch ? await this.analytics.movers(p.orgId, branch, days) : { items: [], days };
                const items = name === "dead-stock" ? m.items.filter((x) => x.class === "DEAD") : m.items;
                return { name, title: name === "dead-stock" ? "Dead stock" : "Fast and slow movers", note: `Window: last ${days} days (the report period length). DEAD = stock on hand with no net sale in the window.`, columns: [col("brandName", "Product"), col("class", "Class"), col("units", "Units sold"), col("perDay", "Per day"), col("onHand", "On hand"), col("daysOfCover", "Days of cover"), col("stockValue", "Stock value"), col("lastSold", "Last sold")], rows: items.map((x) => ({ brandName: x.brandName, class: x.class, units: x.units, perDay: x.perDay, onHand: x.onHand, daysOfCover: x.daysOfCover, stockValue: x.stockValue, lastSold: d10(x.lastSold) })) };
            }
            case "stock-adjustments": {
                const r = await this.prisma.stockMovement.findMany({ where: { orgId: p.orgId, ...(p.branchId ? { branchId: p.branchId } : {}), type: { in: ["ADJUSTMENT", "EXPIRY_WRITE_OFF", "RECALL_WRITE_OFF", "COUNT_VARIANCE", "RETURN_TO_SUPPLIER"] }, occurredAt: { gte: p.from, lte: p.to } }, include: { lot: { select: { lotNumber: true, unitCost: true, drug: { select: { brandName: true } } } } }, orderBy: { occurredAt: "desc" }, take: 5000 });
                const staff = new Map((await this.prisma.staffUser.findMany({ where: { id: { in: [...new Set(r.map((x) => x.performedBy))] } }, select: { id: true, displayName: true } })).map((s) => [s.id, s.displayName]));
                return { name, title: "Stock adjustments and write-offs", columns: [col("date", "Date"), col("brandName", "Product"), col("lotNumber", "Lot"), col("type", "Type"), col("reasonCode", "Reason code"), col("qtyDelta", "Change"), col("value", "Value at cost"), col("reason", "Reason"), col("by", "By")], rows: r.map((x) => ({ date: dt(x.occurredAt), brandName: x.lot.drug.brandName, lotNumber: x.lot.lotNumber, type: x.type, reasonCode: x.reasonCode, qtyDelta: x.qtyDelta, value: (0, money_1.money)(x.lot.unitCost.mul(x.qtyDelta)), reason: x.reason, by: staff.get(x.performedBy) ?? x.performedBy })) };
            }
            case "rx-volume": {
                const r = await this.prisma.$queryRaw `SELECT date_trunc('day', "receivedAt")::date AS day, COUNT(*) AS received, COUNT(*) FILTER (WHERE source = 'MANUAL_ENTRY') AS manual, COUNT(*) FILTER (WHERE source = 'PAPER_SCAN') AS scan, COUNT(*) FILTER (WHERE source IN ('KIORLY_E_RX','KIOREX_UPLOAD')) AS erx, COUNT(*) FILTER (WHERE source = 'TRANSFER_IN') AS transfer, COUNT(*) FILTER (WHERE status IN ('DISPENSED','PARTIALLY_DISPENSED')) AS dispensed, COUNT(*) FILTER (WHERE status = 'REJECTED') AS rejected FROM "Prescription" WHERE "orgId" = ${p.orgId} AND "receivedAt" >= ${p.from} AND "receivedAt" <= ${p.to} AND (${bid(p)}::text IS NULL OR "branchId" = ${bid(p)}) GROUP BY 1 ORDER BY 1`;
                return { name, title: "Prescription volume", columns: [col("day", "Day"), col("received", "Received"), col("manual", "Manual entry"), col("scan", "Paper scan"), col("erx", "e-Rx"), col("transfer", "Transferred in"), col("dispensed", "Dispensed"), col("rejected", "Rejected")], rows: r.map((x) => ({ day: d10(x.day), received: Number(x.received), manual: Number(x.manual), scan: Number(x.scan), erx: Number(x.erx), transfer: Number(x.transfer), dispensed: Number(x.dispensed), rejected: Number(x.rejected) })) };
            }
            case "pharmacist-performance": {
                const disp = await this.prisma.$queryRaw `SELECT d."pharmacistId" AS who, COUNT(*) AS n, COALESCE(SUM((SELECT SUM(dl.quantity) FROM "DispensingLine" dl WHERE dl."dispensingId" = d.id)),0) AS items, AVG(EXTRACT(EPOCH FROM (d."signedOffAt" - d."createdAt"))/60) AS "avgMin" FROM "Dispensing" d WHERE d."orgId" = ${p.orgId} AND d."pharmacistId" IS NOT NULL AND d."signedOffAt" >= ${p.from} AND d."signedOffAt" <= ${p.to} AND (${bid(p)}::text IS NULL OR d."branchId" = ${bid(p)}) GROUP BY 1`;
                const val = await this.prisma.prescription.groupBy({ by: ["validatedBy"], where: { orgId: p.orgId, validatedBy: { not: null }, validatedAt: { gte: p.from, lte: p.to } }, _count: true });
                const ov = await this.prisma.safetyCheckResult.groupBy({ by: ["overriddenBy"], where: { dispensing: { orgId: p.orgId }, outcome: "OVERRIDDEN_BY_PHARMACIST", checkedAt: { gte: p.from, lte: p.to } }, _count: true });
                const ids = [...new Set([...disp.map((x) => x.who), ...val.map((x) => x.validatedBy), ...ov.map((x) => x.overriddenBy).filter(Boolean)])];
                const staff = new Map((await this.prisma.staffUser.findMany({ where: { id: { in: ids } }, select: { id: true, displayName: true, pharmacistLicenceNo: true } })).map((s) => [s.id, s]));
                return { name, title: "Pharmacist performance", columns: [col("pharmacist", "Pharmacist"), col("licence", "Licence"), col("validated", "Rx verified"), col("signedOff", "Dispensings signed"), col("items", "Items"), col("avgMinutes", "Avg minutes to sign-off"), col("overrides", "Safety overrides")], rows: ids.map((id) => { const dsp = disp.find((x) => x.who === id); return { pharmacist: staff.get(id)?.displayName ?? id, licence: staff.get(id)?.pharmacistLicenceNo ?? null, validated: val.find((x) => x.validatedBy === id)?._count ?? 0, signedOff: Number(dsp?.n ?? 0), items: Number(dsp?.items ?? 0), avgMinutes: dsp?.avgMin != null ? Math.round(dsp.avgMin * 10) / 10 : null, overrides: ov.find((x) => x.overriddenBy === id)?._count ?? 0 }; }).sort((a, b) => b.signedOff - a.signedOff) };
            }
            case "safety-overrides": {
                const r = await this.prisma.safetyCheckResult.findMany({ where: { dispensing: { orgId: p.orgId, ...(p.branchId ? { branchId: p.branchId } : {}) }, outcome: "OVERRIDDEN_BY_PHARMACIST", checkedAt: { gte: p.from, lte: p.to } }, orderBy: { checkedAt: "desc" }, take: 5000 });
                const staff = new Map((await this.prisma.staffUser.findMany({ where: { id: { in: r.map((x) => x.overriddenBy ?? "") } }, select: { id: true, displayName: true } })).map((s) => [s.id, s.displayName]));
                return { name, title: "Safety overrides", columns: [col("date", "Date"), col("kind", "Check"), col("detail", "Finding"), col("reason", "Reason given"), col("pharmacist", "Pharmacist")], rows: r.map((x) => ({ date: dt(x.checkedAt), kind: x.kind, detail: x.detail, reason: x.overrideReason, pharmacist: staff.get(x.overriddenBy ?? "") ?? x.overriddenBy })) };
            }
            case "refills-due": {
                const r = await this.refills.due(p.orgId, { days: 14, branchId: p.branchId });
                return { name, title: "Refills due", columns: [col("customer", "Customer"), col("phone", "Phone"), col("items", "Items"), col("dueAt", "Due"), col("overdueDays", "Days overdue"), col("refillsLeft", "Refills left"), col("reminded", "Reminded")], rows: r.map((x) => ({ customer: x.patient?.displayName ?? "", phone: x.patient?.phone ?? null, items: x.items.join("; "), dueAt: d10(x.dueAt), overdueDays: x.overdueDays, refillsLeft: x.refillsLeft, reminded: x.reminded ? "yes" : "no" })) };
            }
            case "supplier-aging": {
                const a = await this.purchasing.aging(p.orgId);
                return { name, title: "Supplier aging (payables)", columns: [col("name", "Supplier"), col("paymentTerms", "Terms"), col("outstanding", "Outstanding"), ...aging_1.AGING_BUCKETS.map((b) => col(b, { current: "Not due", d1_30: "1-30 days", d31_60: "31-60 days", d61_90: "61-90 days", d90_plus: "90+ days" }[b])), col("overLimit", "Over limit")], rows: a.suppliers.map((s) => ({ name: s.name, paymentTerms: s.paymentTerms, outstanding: s.outstanding, ...s.buckets, overLimit: s.overLimit ? "yes" : "" })) };
            }
            case "cost-variance": {
                const v = await this.purchasing.costVariance(p.orgId, { from: p.from, to: p.to, minPct: 0, branchId: p.branchId });
                return { name, title: "Cost price variance", columns: [col("date", "Received"), col("brandName", "Product"), col("supplier", "Supplier"), col("quantity", "Qty"), col("unitCost", "Unit cost"), col("poUnitCost", "PO cost"), col("pctVsPo", "% vs PO"), col("prevUnitCost", "Previous cost"), col("pctVsPrev", "% vs previous"), col("extraCost", "Extra cost")], rows: v.items.map((i) => ({ date: d10(i.receivedAt), brandName: i.brandName, supplier: i.supplier, quantity: i.quantity, unitCost: i.unitCost, poUnitCost: i.poUnitCost, pctVsPo: i.pctVsPo, prevUnitCost: i.prevUnitCost, pctVsPrev: i.pctVsPrev, extraCost: i.extraCost })) };
            }
            case "customer-receivables": {
                const a = await this.finance.receivables(p.orgId);
                return { name, title: "Customer receivables (credit)", columns: [col("customer", "Customer"), col("creditLimit", "Credit limit"), col("outstanding", "Outstanding"), ...aging_1.AGING_BUCKETS.map((b) => col(b, { current: "Not due", d1_30: "1-30 days", d31_60: "31-60 days", d61_90: "61-90 days", d90_plus: "90+ days" }[b])), col("overLimit", "Over limit")], rows: a.customers.map((c) => ({ customer: c.customer.displayName, creditLimit: c.creditLimit, outstanding: c.outstanding, ...c.buckets, overLimit: c.overLimit ? "yes" : "" })) };
            }
            case "insurer-claims": {
                const r = await this.prisma.insurerClaim.findMany({ where: { orgId: p.orgId, ...(p.branchId ? { branchId: p.branchId } : {}), createdAt: { gte: p.from, lte: p.to } }, orderBy: { createdAt: "desc" }, take: 5000 });
                return { name, title: "Insurer claims", columns: [col("date", "Created"), col("insurer", "Insurer"), col("member", "Member / card"), col("claimed", "Claimed"), col("approved", "Approved"), col("paid", "Paid"), col("status", "Status"), col("submissionRef", "Submission ref"), col("rejection", "Rejection reason")], rows: r.map((x) => ({ date: d10(x.createdAt), insurer: x.insurerName, member: x.memberRef, claimed: (0, money_1.money)(x.amountClaimed), approved: x.approvedAmount ? (0, money_1.money)(x.approvedAmount) : null, paid: (0, money_1.money)(x.paidAmount), status: x.status, submissionRef: x.submissionRef, rejection: x.rejectionReason })) };
            }
            default: return null;
        }
    }
};
exports.ExtraReports = ExtraReports;
exports.ExtraReports = ExtraReports = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(finance_service_1.FinanceService)),
    __param(2, (0, common_1.Inject)(purchasing_service_1.PurchasingService)),
    __param(3, (0, common_1.Inject)(inventory_analytics_service_1.InventoryAnalyticsService)),
    __param(4, (0, common_1.Inject)(refills_service_1.RefillsService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, finance_service_1.FinanceService, purchasing_service_1.PurchasingService,
        inventory_analytics_service_1.InventoryAnalyticsService, refills_service_1.RefillsService])
], ExtraReports);
//# sourceMappingURL=reports-extra.js.map