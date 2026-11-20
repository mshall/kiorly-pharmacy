import { marketToday } from "../../common/dates";
import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { D, money, round2 } from "../../common/money";
import { StockLedger } from "./stock-ledger.service";
import { KERNEL, type MarketPackPort } from "../../kernel-adapter/ports";
import type { AuthUser } from "../../auth/auth-user";
import { parseGs1 } from "./gs1";
import { UomService } from "./uom.service";

export interface ReceiptLineInput {
  drugId?: string;
  /** GS1 scan string or plain GTIN: prefills drug, lot and expiry; explicit fields win. */
  scan?: string;
  lotNumber?: string;
  expiryDate?: string;
  quantity: number;
  unitCost: string;
  /** Required for cold-chain drugs (KPINV06). */
  temperatureC?: number;
  /** Receive in a pack unit defined for the drug (box, carton ...): quantity and unitCost are then per that unit. */
  uom?: string;
  /** Shelf location to put the lot on. */
  locationId?: string;
}
export interface ReceiptInput {
  branchId: string;
  supplierId?: string;
  purchaseOrderId?: string;
  invoiceNo?: string;
  invoiceTotal?: string;
  idempotencyKey?: string;
  lines: ReceiptLineInput[];
}

const startOfTodayUtc = () => marketToday();

@Injectable()
export class ReceivingService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(StockLedger) private readonly ledger: StockLedger,
    @Inject(KERNEL.marketPacks) private readonly packs: MarketPackPort,
    @Inject(UomService) private readonly uoms: UomService,
  ) {}

  /** KPINV01 scan -> {drug, lot, expiry} prefill. Looks up by GTIN in the tenant's visible catalogue. */
  async resolveScan(orgId: string, code: string) {
    const g = parseGs1(code);
    const gtin = g.gtin ?? (/^\d{8,14}$/.test(code.trim()) ? code.trim() : undefined);
    const candidates = gtin ? [gtin, gtin.replace(/^0+/, ""), gtin.padStart(14, "0")] : [];
    const drug = gtin ? await this.prisma.drug.findFirst({ where: { gtin: { in: candidates }, OR: [{ orgId: null }, { orgId }] } }) : null;
    return { gtin: gtin ?? null, lotNumber: g.lot ?? null, expiryDate: g.expiry ?? null, drug };
  }

  async receive(user: AuthUser, input: ReceiptInput) {
    const { orgId } = user;
    if (input.idempotencyKey) {
      const prior = await this.prisma.goodsReceipt.findUnique({ where: { orgId_idempotencyKey: { orgId, idempotencyKey: input.idempotencyKey } }, include: { lines: true } });
      if (prior) return { ...prior, replayed: true };
    }
    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
    const pack = this.packs.get(tenant.marketCode);
    const supplierId = input.supplierId ?? undefined;
    if (supplierId && !(await this.prisma.supplier.findFirst({ where: { id: supplierId, orgId } }))) throw notFound("Supplier", supplierId);
    const po = input.purchaseOrderId ? await this.prisma.purchaseOrder.findFirst({ where: { id: input.purchaseOrderId, orgId, branchId: input.branchId }, include: { lines: true } }) : null;
    if (input.purchaseOrderId && !po) throw notFound("Purchase order", input.purchaseOrderId);
    if (po && (po.status === "CANCELLED" || po.status === "RECEIVED")) throw new DomainError("PO_CLOSED", `Purchase order is ${po.status}`, 409);
    if (!input.lines.length) throw new DomainError("NO_LINES", "A receipt needs at least one line", 400);

    return this.prisma.$transaction(async (tx) => {
      const receipt = await tx.goodsReceipt.create({
        data: { orgId, branchId: input.branchId, supplierId: supplierId ?? po?.supplierId ?? null, purchaseOrderId: po?.id, invoiceNo: input.invoiceNo, invoiceTotal: input.invoiceTotal, idempotencyKey: input.idempotencyKey, receivedBy: user.userId },
      });
      let total = D(0);
      const outLines: Array<{ lotId: string; drugId: string; quantity: number; status: string }> = [];
      for (const rawLine of input.lines) {
        const scan = rawLine.scan ? await this.resolveScan(orgId, rawLine.scan) : null;
        const drugId = rawLine.drugId ?? scan?.drug?.id;
        if (!drugId) throw new DomainError("DRUG_UNRESOLVED", "Line needs a drugId or a scan that matches the catalogue", 400);
        // pack conversion: 1 box = N base units; cost per base unit = box cost / N
        const factor = await this.uoms.factor(orgId, drugId, rawLine.uom);
        const line = factor === 1 ? rawLine : { ...rawLine, quantity: rawLine.quantity * factor, unitCost: D(rawLine.unitCost).div(factor).toDecimalPlaces(2).toString() };
        const drug = await tx.drug.findFirst({ where: { id: drugId, OR: [{ orgId: null }, { orgId }] } });
        if (!drug) throw notFound("Drug", drugId);
        const lotNumber = (line.lotNumber ?? scan?.lotNumber ?? "").trim();
        const expiryStr = line.expiryDate ?? scan?.expiryDate;
        if (!lotNumber || !expiryStr) throw new DomainError("LOT_REQUIRED", "Lot number and expiry date are required", 400, { drugId });
        const expiryDate = new Date(`${expiryStr.slice(0, 10)}T00:00:00.000Z`);
        if (Number.isNaN(expiryDate.getTime())) throw new DomainError("INVALID_EXPIRY", "Invalid expiry date", 400);
        if (expiryDate < startOfTodayUtc()) throw new DomainError("EXPIRED_AT_RECEIPT", `Lot ${lotNumber} is already expired and cannot be received`, 409, { drugId, lotNumber });
        if (!Number.isInteger(line.quantity) || line.quantity <= 0) throw new DomainError("INVALID_QUANTITY", "Quantity must be a positive integer", 400);

        // KPINV06: cold-chain items need a temperature reading at receipt; an excursion quarantines the lot.
        let excursion = false;
        if (drug.coldChain) {
          if (line.temperatureC == null) throw new DomainError("TEMPERATURE_REQUIRED", "Cold-chain item: record the temperature at receipt", 400, { drugId });
          excursion = line.temperatureC < pack.coldChainRangeC.min || line.temperatureC > pack.coldChainRangeC.max;
        }
        // KPSUP03: a lot number under an ACTIVE recall for this drug is received as RECALLED.
        const recall = await tx.recallNotice.findFirst({ where: { orgId, status: "ACTIVE", drugId, lotNumbers: { has: lotNumber } } });

        let lot = await tx.stockLot.findUnique({ where: { branchId_drugId_lotNumber: { branchId: input.branchId, drugId, lotNumber } } });
        if (lot) {
          if (lot.expiryDate.getTime() !== expiryDate.getTime()) throw new DomainError("LOT_EXPIRY_MISMATCH", `Lot ${lotNumber} already exists with a different expiry`, 409, { drugId, lotNumber });
        } else {
          lot = await tx.stockLot.create({
            data: {
              orgId, branchId: input.branchId, drugId, lotNumber, expiryDate, unitCost: line.unitCost, supplierId: supplierId ?? po?.supplierId, purchaseOrderId: po?.id, supplierInvoiceNo: input.invoiceNo,
              locationId: line.locationId,
              status: recall ? "RECALLED" : excursion ? "QUARANTINE" : "AVAILABLE",
              blockedReason: recall ? `Recall: ${recall.reason}` : excursion ? `Cold-chain excursion at receipt (${line.temperatureC}°C)` : null,
              blockedAt: recall || excursion ? new Date() : null, recallNoticeId: recall?.id, statusBeforeBlock: recall || excursion ? "AVAILABLE" : null,
            },
          });
        }
        await this.ledger.post(tx, { orgId, branchId: input.branchId, lotId: lot.id, type: "RECEIPT", quantity: line.quantity, performedBy: user.userId, refType: "GoodsReceipt", refId: receipt.id, reason: input.invoiceNo ? `Invoice ${input.invoiceNo}` : "Direct receipt" });
        if (drug.coldChain) await tx.coldChainReading.create({ data: { orgId, lotId: lot.id, temperatureC: line.temperatureC!, excursion, recordedBy: user.userId } });
        await tx.goodsReceiptLine.create({ data: { receiptId: receipt.id, drugId, lotId: lot.id, quantity: line.quantity, unitCost: line.unitCost } });
        total = total.plus(D(line.unitCost).mul(line.quantity));
        outLines.push({ lotId: lot.id, drugId, quantity: line.quantity, status: lot.status });
        if (po) {
          const pl = po.lines.find((l) => l.drugId === drugId);
          if (pl) await tx.purchaseOrderLine.update({ where: { id: pl.id }, data: { qtyReceived: { increment: line.quantity } } });
        }
      }
      if (po) {
        const lines = await tx.purchaseOrderLine.findMany({ where: { purchaseOrderId: po.id } });
        const all = lines.every((l) => l.qtyReceived >= l.qtyOrdered);
        await tx.purchaseOrder.update({ where: { id: po.id }, data: { status: all ? "RECEIVED" : "PARTIALLY_RECEIVED" } });
      }
      const sid = supplierId ?? po?.supplierId;
      if (sid) {
        const amount = input.invoiceTotal ? D(input.invoiceTotal) : round2(total);
        await tx.supplierLedgerEntry.create({ data: { orgId, supplierId: sid, type: "INVOICE", amount, refType: "GoodsReceipt", refId: receipt.id, note: input.invoiceNo, createdBy: user.userId } });
        await tx.supplier.update({ where: { id: sid }, data: { balance: { increment: amount } } });
      }
      await tx.auditLog.create({ data: { orgId, actorId: user.userId, action: "inventory.receive", entityType: "GoodsReceipt", entityId: receipt.id, meta: { lines: outLines.length, total: money(total), poId: po?.id ?? null } } });
      return { ...receipt, lines: outLines, total: money(total), replayed: false } as never;
    }, { timeout: 30_000 }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002" && input.idempotencyKey) return this.prisma.goodsReceipt.findUniqueOrThrow({ where: { orgId_idempotencyKey: { orgId, idempotencyKey: input.idempotencyKey } } });
      throw e;
    });
  }
}
