import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError } from "../../common/errors";
import { money } from "../../common/money";

export interface ReportColumn { key: string; label: string }
export interface Report { name: string; title: string; note?: string; columns: ReportColumn[]; rows: Array<Record<string, string | number | null>> }
export interface ReportParams { orgId: string; branchId?: string; from: Date; to: Date }

export const REPORT_NAMES = ["sales-daily", "top-sellers", "stock-valuation", "expiry", "controlled-register", "supplier-balances", "vat-lines", "dispensing-log"] as const;
export type ReportName = (typeof REPORT_NAMES)[number];

@Injectable()
export class ReportsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async run(name: string, p: ReportParams): Promise<Report> {
    switch (name as ReportName) {
      case "sales-daily": return this.salesDaily(p);
      case "top-sellers": return this.topSellers(p);
      case "stock-valuation": return this.stockValuation(p);
      case "expiry": return this.expiry(p);
      case "controlled-register": return this.controlled(p);
      case "supplier-balances": return this.supplierBalances(p);
      case "vat-lines": return this.vatLines(p);
      case "dispensing-log": return this.dispensingLog(p);
      default: throw new DomainError("UNKNOWN_REPORT", `Unknown report ${name}`, 404, { available: REPORT_NAMES });
    }
  }

  private async salesDaily(p: ReportParams): Promise<Report> {
    const rows = await this.prisma.$queryRaw<Array<{ day: Date; sales: bigint; gross: string; vat: string; discount: string; cash: string }>>`
      SELECT date_trunc('day', s."soldAt")::date AS day, COUNT(*) AS sales, SUM(s.total) AS gross, SUM(s."vatTotal") AS vat, SUM(s."discountTotal") AS discount,
             COALESCE(SUM((SELECT SUM(amount) FROM "SalePayment" sp WHERE sp."saleId" = s.id AND sp.method = 'CASH')),0) AS cash
      FROM "Sale" s WHERE s."orgId" = ${p.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${p.from} AND s."soldAt" <= ${p.to} AND (${p.branchId ?? null}::text IS NULL OR s."branchId" = ${p.branchId ?? null})
      GROUP BY 1 ORDER BY 1`;
    return { name: "sales-daily", title: "Daily sales", columns: [{ key: "day", label: "Day" }, { key: "sales", label: "Sales" }, { key: "gross", label: "Gross" }, { key: "vat", label: "VAT (incl.)" }, { key: "discount", label: "Discount" }, { key: "cash", label: "Cash" }],
      rows: rows.map((r) => ({ day: new Date(r.day).toISOString().slice(0, 10), sales: Number(r.sales), gross: money(r.gross), vat: money(r.vat), discount: money(r.discount), cash: money(r.cash) })) };
  }

  private async topSellers(p: ReportParams): Promise<Report> {
    const rows = await this.prisma.$queryRaw<Array<{ brandName: string; qty: bigint; revenue: string }>>`
      SELECT d."brandName", SUM(sl.quantity) AS qty, SUM(sl."unitPrice" * sl.quantity - sl.discount) AS revenue FROM "SaleLine" sl JOIN "Sale" s ON s.id = sl."saleId" JOIN "Drug" d ON d.id = sl."drugId"
      WHERE s."orgId" = ${p.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${p.from} AND s."soldAt" <= ${p.to} AND (${p.branchId ?? null}::text IS NULL OR s."branchId" = ${p.branchId ?? null})
      GROUP BY d."brandName" ORDER BY qty DESC LIMIT 50`;
    return { name: "top-sellers", title: "Top sellers", columns: [{ key: "brandName", label: "Product" }, { key: "qty", label: "Units" }, { key: "revenue", label: "Revenue" }], rows: rows.map((r) => ({ brandName: r.brandName, qty: Number(r.qty), revenue: money(r.revenue) })) };
  }

  private async stockValuation(p: ReportParams): Promise<Report> {
    const rows = await this.prisma.$queryRaw<Array<{ brandName: string; onHand: bigint; cost: string; retail: string | null }>>`
      SELECT d."brandName", SUM(l."qtyOnHand") AS "onHand", SUM(l."qtyOnHand" * l."unitCost") AS cost,
        SUM(l."qtyOnHand" * (SELECT pb.price FROM "PriceBookEntry" pb WHERE pb."drugId" = l."drugId" AND pb."orgId" = l."orgId" AND (pb."branchId" IS NULL OR pb."branchId" = l."branchId") AND pb."effectiveFrom" <= now() AND (pb."effectiveTo" IS NULL OR pb."effectiveTo" > now()) ORDER BY pb."branchId" NULLS LAST, pb."effectiveFrom" DESC LIMIT 1)) AS retail
      FROM "StockLot" l JOIN "Drug" d ON d.id = l."drugId" WHERE l."orgId" = ${p.orgId} AND l."qtyOnHand" > 0 AND (${p.branchId ?? null}::text IS NULL OR l."branchId" = ${p.branchId ?? null})
      GROUP BY d."brandName" ORDER BY cost DESC`;
    return { name: "stock-valuation", title: "Stock valuation", columns: [{ key: "brandName", label: "Product" }, { key: "onHand", label: "On hand" }, { key: "cost", label: "Cost value" }, { key: "retail", label: "Retail value" }], rows: rows.map((r) => ({ brandName: r.brandName, onHand: Number(r.onHand), cost: money(r.cost), retail: r.retail == null ? null : money(r.retail) })) };
  }

  private async expiry(p: ReportParams): Promise<Report> {
    const lots = await this.prisma.stockLot.findMany({ where: { orgId: p.orgId, ...(p.branchId ? { branchId: p.branchId } : {}), qtyOnHand: { gt: 0 }, expiryDate: { lte: new Date(Date.now() + 90 * 86_400_000) } }, include: { drug: { select: { brandName: true } } }, orderBy: { expiryDate: "asc" } });
    return { name: "expiry", title: "Expiry (next 90 days and expired)", columns: [{ key: "brandName", label: "Product" }, { key: "lotNumber", label: "Lot" }, { key: "expiryDate", label: "Expiry" }, { key: "qtyOnHand", label: "Qty" }, { key: "status", label: "Status" }, { key: "value", label: "Cost value" }],
      rows: lots.map((l) => ({ brandName: l.drug.brandName, lotNumber: l.lotNumber, expiryDate: l.expiryDate.toISOString().slice(0, 10), qtyOnHand: l.qtyOnHand, status: l.status, value: money(l.unitCost.mul(l.qtyOnHand)) })) };
  }

  private async controlled(p: ReportParams): Promise<Report> {
    const rows = await this.prisma.controlledSubstanceLogEntry.findMany({ where: { orgId: p.orgId, ...(p.branchId ? { branchId: p.branchId } : {}), loggedAt: { gte: p.from, lte: p.to } }, orderBy: { loggedAt: "asc" } });
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: rows.map((r) => r.drugId) } }, select: { id: true, brandName: true, controlledSchedule: true } });
    const dm = new Map(drugs.map((d) => [d.id, d]));
    return { name: "controlled-register", title: "Controlled-substance register", note: "Regulatory record. Never shared with Kiorex.", columns: [{ key: "loggedAt", label: "Date" }, { key: "drug", label: "Drug" }, { key: "schedule", label: "Schedule" }, { key: "quantity", label: "Qty" }, { key: "idLast4", label: "Patient ID (last 4)" }, { key: "prescriber", label: "Prescriber licence" }, { key: "pharmacistId", label: "Pharmacist" }],
      rows: rows.map((r) => ({ loggedAt: r.loggedAt.toISOString(), drug: dm.get(r.drugId)?.brandName ?? r.drugId, schedule: dm.get(r.drugId)?.controlledSchedule ?? "", quantity: r.quantity, idLast4: r.patientNationalIdLast4, prescriber: r.prescriberLicenceNo ?? "", pharmacistId: r.pharmacistId })) };
  }

  private async supplierBalances(p: ReportParams): Promise<Report> {
    const s = await this.prisma.supplier.findMany({ where: { orgId: p.orgId }, orderBy: { balance: "desc" } });
    return { name: "supplier-balances", title: "Supplier balances (payable)", columns: [{ key: "name", label: "Supplier" }, { key: "paymentTerms", label: "Terms" }, { key: "creditLimit", label: "Credit limit" }, { key: "balance", label: "Balance" }], rows: s.map((x) => ({ name: x.name, paymentTerms: x.paymentTerms ?? "", creditLimit: x.creditLimit ? money(x.creditLimit) : "", balance: money(x.balance) })) };
  }

  /** VAT lines for the pharmacy's accountant. Export only: Kiorly does not submit this (or anything) to any tax authority. */
  private async vatLines(p: ReportParams): Promise<Report> {
    const rows = await this.prisma.$queryRaw<Array<{ rate: string; net: string; vat: string; gross: string }>>`
      SELECT sl."vatRate" AS rate, SUM(sl."unitPrice" * sl.quantity - sl.discount - sl."vatAmount") AS net, SUM(sl."vatAmount") AS vat, SUM(sl."unitPrice" * sl.quantity - sl.discount) AS gross
      FROM "SaleLine" sl JOIN "Sale" s ON s.id = sl."saleId" WHERE s."orgId" = ${p.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${p.from} AND s."soldAt" <= ${p.to} AND (${p.branchId ?? null}::text IS NULL OR s."branchId" = ${p.branchId ?? null})
      GROUP BY sl."vatRate" ORDER BY sl."vatRate"`;
    return { name: "vat-lines", title: "VAT lines by rate", note: "Export for your accountant. Kiorly does not submit tax data to any authority.", columns: [{ key: "rate", label: "VAT rate" }, { key: "net", label: "Net" }, { key: "vat", label: "VAT" }, { key: "gross", label: "Gross" }], rows: rows.map((r) => ({ rate: `${(Number(r.rate) * 100).toFixed(2)}%`, net: money(r.net), vat: money(r.vat), gross: money(r.gross) })) };
  }

  private async dispensingLog(p: ReportParams): Promise<Report> {
    const rows = await this.prisma.dispensing.findMany({ where: { orgId: p.orgId, ...(p.branchId ? { branchId: p.branchId } : {}), status: "DISPENSED", dispensedAt: { gte: p.from, lte: p.to } }, include: { lines: true }, orderBy: { dispensedAt: "asc" } });
    return { name: "dispensing-log", title: "Dispensing log", columns: [{ key: "dispensedAt", label: "Dispensed" }, { key: "dispensingId", label: "Dispensing" }, { key: "lines", label: "Lines" }, { key: "pharmacistId", label: "Pharmacist" }, { key: "signedOffAt", label: "Signed off" }, { key: "rx", label: "Rx" }], rows: rows.map((d) => ({ dispensedAt: d.dispensedAt!.toISOString(), dispensingId: d.id, lines: d.lines.length, pharmacistId: d.pharmacistId ?? "", signedOffAt: d.signedOffAt?.toISOString() ?? "", rx: d.prescriptionId ?? "" })) };
  }
}

const csvCell = (v: unknown) => { const s = v == null ? "" : String(v); return /[",\n\r]/.test(s) || /^[=+\-@]/.test(s) ? `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"` : s; };
/** CSV with UTF-8 BOM so Excel opens Arabic correctly; cells starting with = + - @ are neutralised (CSV injection). */
export function toCsv(r: Report): string {
  return "﻿" + [r.columns.map((c) => csvCell(c.label)).join(","), ...r.rows.map((row) => r.columns.map((c) => csvCell(row[c.key])).join(","))].join("\r\n") + "\r\n";
}
