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
exports.ReportsService = exports.REPORT_CATALOGUE = exports.REPORT_NAMES = void 0;
exports.toCsv = toCsv;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const reports_extra_1 = require("./reports-extra");
Object.defineProperty(exports, "REPORT_CATALOGUE", { enumerable: true, get: function () { return reports_extra_1.REPORT_CATALOGUE; } });
const BASE_REPORTS = ["sales-daily", "top-sellers", "stock-valuation", "expiry", "controlled-register", "supplier-balances", "vat-lines", "dispensing-log"];
exports.REPORT_NAMES = reports_extra_1.REPORT_CATALOGUE.map((r) => r.name);
let ReportsService = class ReportsService {
    prisma;
    extra;
    constructor(prisma, extra) {
        this.prisma = prisma;
        this.extra = extra;
    }
    async run(name, p) {
        const x = await this.extra.run(name, p);
        if (x)
            return x;
        switch (name) {
            case "sales-daily": return this.salesDaily(p);
            case "top-sellers": return this.topSellers(p);
            case "stock-valuation": return this.stockValuation(p);
            case "expiry": return this.expiry(p);
            case "controlled-register": return this.controlled(p);
            case "supplier-balances": return this.supplierBalances(p);
            case "vat-lines": return this.vatLines(p);
            case "dispensing-log": return this.dispensingLog(p);
            default: throw new errors_1.DomainError("UNKNOWN_REPORT", `Unknown report ${name}`, 404, { available: exports.REPORT_NAMES });
        }
    }
    async salesDaily(p) {
        const rows = await this.prisma.$queryRaw `
      SELECT date_trunc('day', s."soldAt")::date AS day, COUNT(*) AS sales, SUM(s.total) AS gross, SUM(s."vatTotal") AS vat, SUM(s."discountTotal") AS discount,
             COALESCE(SUM((SELECT SUM(amount) FROM "SalePayment" sp WHERE sp."saleId" = s.id AND sp.method = 'CASH')),0) AS cash
      FROM "Sale" s WHERE s."orgId" = ${p.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${p.from} AND s."soldAt" <= ${p.to} AND (${p.branchId ?? null}::text IS NULL OR s."branchId" = ${p.branchId ?? null})
      GROUP BY 1 ORDER BY 1`;
        return { name: "sales-daily", title: "Daily sales", columns: [{ key: "day", label: "Day" }, { key: "sales", label: "Sales" }, { key: "gross", label: "Gross" }, { key: "vat", label: "VAT (incl.)" }, { key: "discount", label: "Discount" }, { key: "cash", label: "Cash" }],
            rows: rows.map((r) => ({ day: new Date(r.day).toISOString().slice(0, 10), sales: Number(r.sales), gross: (0, money_1.money)(r.gross), vat: (0, money_1.money)(r.vat), discount: (0, money_1.money)(r.discount), cash: (0, money_1.money)(r.cash) })) };
    }
    async topSellers(p) {
        const rows = await this.prisma.$queryRaw `
      SELECT d."brandName", SUM(sl.quantity) AS qty, SUM(sl."unitPrice" * sl.quantity - sl.discount) AS revenue FROM "SaleLine" sl JOIN "Sale" s ON s.id = sl."saleId" JOIN "Drug" d ON d.id = sl."drugId"
      WHERE s."orgId" = ${p.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${p.from} AND s."soldAt" <= ${p.to} AND (${p.branchId ?? null}::text IS NULL OR s."branchId" = ${p.branchId ?? null})
      GROUP BY d."brandName" ORDER BY qty DESC LIMIT 50`;
        return { name: "top-sellers", title: "Top sellers", columns: [{ key: "brandName", label: "Product" }, { key: "qty", label: "Units" }, { key: "revenue", label: "Revenue" }], rows: rows.map((r) => ({ brandName: r.brandName, qty: Number(r.qty), revenue: (0, money_1.money)(r.revenue) })) };
    }
    async stockValuation(p) {
        const rows = await this.prisma.$queryRaw `
      SELECT d."brandName", SUM(l."qtyOnHand") AS "onHand", SUM(l."qtyOnHand" * l."unitCost") AS cost,
        SUM(l."qtyOnHand" * (SELECT pb.price FROM "PriceBookEntry" pb WHERE pb."drugId" = l."drugId" AND pb."orgId" = l."orgId" AND (pb."branchId" IS NULL OR pb."branchId" = l."branchId") AND pb."effectiveFrom" <= now() AND (pb."effectiveTo" IS NULL OR pb."effectiveTo" > now()) ORDER BY pb."branchId" NULLS LAST, pb."effectiveFrom" DESC LIMIT 1)) AS retail
      FROM "StockLot" l JOIN "Drug" d ON d.id = l."drugId" WHERE l."orgId" = ${p.orgId} AND l."qtyOnHand" > 0 AND (${p.branchId ?? null}::text IS NULL OR l."branchId" = ${p.branchId ?? null})
      GROUP BY d."brandName" ORDER BY cost DESC`;
        return { name: "stock-valuation", title: "Stock valuation", columns: [{ key: "brandName", label: "Product" }, { key: "onHand", label: "On hand" }, { key: "cost", label: "Cost value" }, { key: "retail", label: "Retail value" }], rows: rows.map((r) => ({ brandName: r.brandName, onHand: Number(r.onHand), cost: (0, money_1.money)(r.cost), retail: r.retail == null ? null : (0, money_1.money)(r.retail) })) };
    }
    async expiry(p) {
        const lots = await this.prisma.stockLot.findMany({ where: { orgId: p.orgId, ...(p.branchId ? { branchId: p.branchId } : {}), qtyOnHand: { gt: 0 }, expiryDate: { lte: new Date(Date.now() + 90 * 86_400_000) } }, include: { drug: { select: { brandName: true } } }, orderBy: { expiryDate: "asc" } });
        return { name: "expiry", title: "Expiry (next 90 days and expired)", columns: [{ key: "brandName", label: "Product" }, { key: "lotNumber", label: "Lot" }, { key: "expiryDate", label: "Expiry" }, { key: "qtyOnHand", label: "Qty" }, { key: "status", label: "Status" }, { key: "value", label: "Cost value" }],
            rows: lots.map((l) => ({ brandName: l.drug.brandName, lotNumber: l.lotNumber, expiryDate: l.expiryDate.toISOString().slice(0, 10), qtyOnHand: l.qtyOnHand, status: l.status, value: (0, money_1.money)(l.unitCost.mul(l.qtyOnHand)) })) };
    }
    async controlled(p) {
        const rows = await this.prisma.controlledRegisterEntry.findMany({ where: { orgId: p.orgId, ...(p.branchId ? { branchId: p.branchId } : {}), occurredAt: { gte: p.from, lte: p.to } }, orderBy: { occurredAt: "asc" }, take: 20_000 });
        const [drugs, staff] = await Promise.all([this.prisma.drug.findMany({ where: { id: { in: [...new Set(rows.map((r) => r.drugId))] } }, select: { id: true, brandName: true, controlledSchedule: true } }), this.prisma.staffUser.findMany({ where: { id: { in: [...new Set(rows.map((r) => r.performedBy))] } }, select: { id: true, displayName: true } })]);
        const dm = new Map(drugs.map((d) => [d.id, d])), sm = new Map(staff.map((x) => [x.id, x.displayName]));
        return { name: "controlled-register", title: "Controlled-substance register", note: "Regulatory record with a running balance. Never shared with Kiorex.", columns: [{ key: "loggedAt", label: "Date" }, { key: "drug", label: "Drug" }, { key: "schedule", label: "Schedule" }, { key: "kind", label: "Movement" }, { key: "quantity", label: "Change" }, { key: "balance", label: "Balance" }, { key: "idLast4", label: "Patient ID (last 4)" }, { key: "patient", label: "Patient" }, { key: "prescriber", label: "Prescriber licence" }, { key: "by", label: "By" }, { key: "witness", label: "Witness" }],
            rows: rows.map((r) => ({ loggedAt: r.occurredAt.toISOString(), drug: dm.get(r.drugId)?.brandName ?? r.drugId, schedule: dm.get(r.drugId)?.controlledSchedule ?? "", kind: r.kind, quantity: r.qtyDelta, balance: r.balanceAfter, idLast4: r.patientIdLast4, patient: r.patientName, prescriber: r.prescriberLicenceNo, by: sm.get(r.performedBy) ?? r.performedBy, witness: r.witnessName })) };
    }
    async supplierBalances(p) {
        const s = await this.prisma.supplier.findMany({ where: { orgId: p.orgId }, orderBy: { balance: "desc" } });
        return { name: "supplier-balances", title: "Supplier balances (payable)", columns: [{ key: "name", label: "Supplier" }, { key: "paymentTerms", label: "Terms" }, { key: "creditLimit", label: "Credit limit" }, { key: "balance", label: "Balance" }], rows: s.map((x) => ({ name: x.name, paymentTerms: x.paymentTerms ?? "", creditLimit: x.creditLimit ? (0, money_1.money)(x.creditLimit) : "", balance: (0, money_1.money)(x.balance) })) };
    }
    async vatLines(p) {
        const rows = await this.prisma.$queryRaw `
      SELECT sl."vatRate" AS rate, SUM(sl."unitPrice" * sl.quantity - sl.discount - sl."vatAmount") AS net, SUM(sl."vatAmount") AS vat, SUM(sl."unitPrice" * sl.quantity - sl.discount) AS gross
      FROM "SaleLine" sl JOIN "Sale" s ON s.id = sl."saleId" WHERE s."orgId" = ${p.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${p.from} AND s."soldAt" <= ${p.to} AND (${p.branchId ?? null}::text IS NULL OR s."branchId" = ${p.branchId ?? null})
      GROUP BY sl."vatRate" ORDER BY sl."vatRate"`;
        return { name: "vat-lines", title: "VAT lines by rate", note: "Export for your accountant. Kiorly does not submit tax data to any authority.", columns: [{ key: "rate", label: "VAT rate" }, { key: "net", label: "Net" }, { key: "vat", label: "VAT" }, { key: "gross", label: "Gross" }], rows: rows.map((r) => ({ rate: `${(Number(r.rate) * 100).toFixed(2)}%`, net: (0, money_1.money)(r.net), vat: (0, money_1.money)(r.vat), gross: (0, money_1.money)(r.gross) })) };
    }
    async dispensingLog(p) {
        const rows = await this.prisma.dispensing.findMany({ where: { orgId: p.orgId, ...(p.branchId ? { branchId: p.branchId } : {}), status: "DISPENSED", dispensedAt: { gte: p.from, lte: p.to } }, include: { lines: true }, orderBy: { dispensedAt: "asc" } });
        return { name: "dispensing-log", title: "Dispensing log", columns: [{ key: "dispensedAt", label: "Dispensed" }, { key: "dispensingId", label: "Dispensing" }, { key: "lines", label: "Lines" }, { key: "pharmacistId", label: "Pharmacist" }, { key: "signedOffAt", label: "Signed off" }, { key: "rx", label: "Rx" }], rows: rows.map((d) => ({ dispensedAt: d.dispensedAt.toISOString(), dispensingId: d.id, lines: d.lines.length, pharmacistId: d.pharmacistId ?? "", signedOffAt: d.signedOffAt?.toISOString() ?? "", rx: d.prescriptionId ?? "" })) };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(reports_extra_1.ExtraReports)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, reports_extra_1.ExtraReports])
], ReportsService);
const csvCell = (v) => { const s = v == null ? "" : String(v); return /[",\n\r]/.test(s) || /^[=+\-@]/.test(s) ? `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"` : s; };
function toCsv(r) {
    return "﻿" + [r.columns.map((c) => csvCell(c.label)).join(","), ...r.rows.map((row) => r.columns.map((c) => csvCell(row[c.key])).join(","))].join("\r\n") + "\r\n";
}
//# sourceMappingURL=reports.service.js.map