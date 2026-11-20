import { Body, Controller, Get, Inject, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { pageArgs } from "../../common/pagination";
import { branchFilter, resolveBranchId } from "../../common/branch-scope";
import { PrismaService } from "../../prisma/prisma.service";
import { InventoryService } from "./inventory.service";
import { ReceivingService } from "./receiving.service";
import { CountsService } from "./counts.service";
import { TransfersService } from "./transfers.service";
import { ApprovalService } from "../../auth/approval.service";
import { RequiresEntitlement, RequiresEntitlementGuard } from "../../kernel-adapter/requires-entitlement.guard";
import * as dto from "./inventory.dto";
import { DomainError } from "../../common/errors";
import type { LotStatus } from "../../generated/prisma/client";

@ApiTags("inventory")
@ApiBearerAuth()
@Controller("inventory")
export class InventoryController {
  constructor(
    @Inject(InventoryService) private readonly inv: InventoryService,
    @Inject(ReceivingService) private readonly receiving: ReceivingService,
    @Inject(CountsService) private readonly counts: CountsService,
    @Inject(TransfersService) private readonly transfers: TransfersService,
    @Inject(ApprovalService) private readonly approvals: ApprovalService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  @Get("lots")
  @Perm("inventory.read")
  lots(@CurrentUser() u: AuthUser, @Query() q: { branchId?: string; drugId?: string; status?: LotStatus; expiringWithinDays?: string; q?: string; includeEmpty?: string; page?: string; pageSize?: string }) {
    const { skip, take } = pageArgs(q, 200);
    return this.inv.lots(u.orgId, { ...branchFilter(u, q.branchId), drugId: q.drugId, status: q.status, expiringWithinDays: q.expiringWithinDays ? Number(q.expiringWithinDays) : undefined, q: q.q, includeEmpty: q.includeEmpty === "true", skip, take });
  }

  @Get("stock")
  @Perm("inventory.read")
  async stock(@CurrentUser() u: AuthUser, @Query() q: { branchId?: string; q?: string; lowOnly?: string; page?: string; pageSize?: string }) {
    const { skip, take } = pageArgs(q, 200);
    return this.inv.stock(u.orgId, await resolveBranchId(this.prisma, u, q.branchId), { q: q.q, lowOnly: q.lowOnly === "true", skip, take });
  }

  @Get("fefo")
  @Perm("inventory.read")
  async fefo(@CurrentUser() u: AuthUser, @Query() q: { drugId: string; qty?: string; branchId?: string }) {
    return this.inv.fefo(u.orgId, await resolveBranchId(this.prisma, u, q.branchId), q.drugId, Number(q.qty ?? 1));
  }

  @Post("scan/parse")
  @Perm("inventory.receive")
  scan(@CurrentUser() u: AuthUser, @Body() d: dto.ScanDto) { return this.receiving.resolveScan(u.orgId, d.code); }

  @Post("receipts")
  @Perm("inventory.receive")
  async receive(@CurrentUser() u: AuthUser, @Body() d: dto.ReceiptDto) {
    return this.receiving.receive(u, { ...d, branchId: await resolveBranchId(this.prisma, u, d.branchId) });
  }

  @Get("receipts")
  @Perm("inventory.read")
  receipts(@CurrentUser() u: AuthUser, @Query() q: { branchId?: string }) {
    return this.prisma.goodsReceipt.findMany({ where: { orgId: u.orgId, ...branchFilter(u, q.branchId) }, include: { lines: true }, orderBy: { receivedAt: "desc" }, take: 50 });
  }

  @Post("lots/:id/quarantine")
  @Perm("inventory.quarantine")
  quarantine(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: dto.ReasonDto) { return this.inv.quarantine(u, id, d.reason); }

  @Post("lots/:id/release")
  @Perm("inventory.quarantine")
  release(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: dto.ReasonDto) { return this.inv.release(u, id, d.reason); }

  @Post("lots/:id/write-off")
  @Perm("inventory.adjust")
  async writeOff(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: dto.ReasonDto) { return this.inv.writeOff(u, id, d.reason, d.witness ? await this.approvals.witness(u, d.witness) : undefined); }

  @Post("adjustments")
  @Perm("inventory.adjust")
  async adjust(@CurrentUser() u: AuthUser, @Body() d: dto.AdjustDto) {
    const lot = await this.prisma.stockLot.findFirst({ where: { id: d.lotId, orgId: u.orgId } });
    if (!lot) throw new DomainError("LOT_NOT_FOUND", "Lot not found", 404);
    const goesNegative = d.quantity < 0 && lot.qtyOnHand + d.quantity < 0;
    const approver = goesNegative ? await this.approvals.approver(u, "inventory.negative_stock", d.approval) : undefined;
    return this.inv.adjust(u, d.lotId, d.quantity, d.reason, approver, d.witness ? await this.approvals.witness(u, d.witness) : undefined, d.reasonCode);
  }

  @Get("expiry")
  @Perm("inventory.read")
  expiry(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return this.inv.expiryBuckets(u.orgId, branchFilter(u, branchId).branchId); }

  @Post("jobs/expiry-sweep")
  @Perm("inventory.adjust")
  async sweep(@CurrentUser() u: AuthUser) { return { ...(await this.inv.expirySweep(u.orgId)), ...(await this.inv.runExpiryAlerts(u.orgId)) }; }

  @Post("returns-to-supplier")
  @Perm("inventory.adjust", "supplier.read")
  async returnToSupplier(@CurrentUser() u: AuthUser, @Body() d: dto.ReturnSupplierDto) { const { witness, ...rest } = d; return this.inv.returnToSupplier(u, { ...rest, witness: witness ? await this.approvals.witness(u, witness) : undefined }); }

  @Post("cold-chain/:lotId/readings")
  @Perm("inventory.receive")
  temperature(@CurrentUser() u: AuthUser, @Param("lotId") lotId: string, @Body() d: dto.TempDto) { return this.inv.recordTemperature(u, lotId, d.temperatureC); }

  @Get("cold-chain/:lotId/readings")
  @Perm("inventory.read")
  readings(@CurrentUser() u: AuthUser, @Param("lotId") lotId: string) { return this.inv.readings(u.orgId, lotId); }

  @Get("reorder-policies")
  @Perm("inventory.read")
  async policies(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return this.inv.reorderPolicies(u.orgId, await resolveBranchId(this.prisma, u, branchId)); }

  @Put("reorder-policies")
  @Perm("inventory.adjust")
  async setPolicy(@CurrentUser() u: AuthUser, @Body() d: dto.PolicyDto, @Query("branchId") branchId?: string) { return this.inv.setReorderPolicy(u.orgId, await resolveBranchId(this.prisma, u, branchId), d); }

  // ---- stock counts (KPINV05)
  @Get("counts")
  @Perm("inventory.count")
  countList(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return this.counts.list(u.orgId, branchFilter(u, branchId).branchId); }
  @Post("counts")
  @Perm("inventory.count")
  async countStart(@CurrentUser() u: AuthUser, @Body() d: dto.CountStartDto) { return this.counts.start(u, await resolveBranchId(this.prisma, u, d.branchId), d.type, d.drugIds); }
  @Get("counts/:id")
  @Perm("inventory.count")
  countGet(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.counts.get(u.orgId, id); }
  @Put("counts/:id/lines")
  @Perm("inventory.count")
  countRecord(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: dto.CountRecordDto) { return this.counts.record(u, id, d.lines); }
  @Post("counts/:id/submit")
  @Perm("inventory.count")
  countSubmit(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.counts.submit(u, id); }
  @Post("counts/:id/approve")
  @Perm("inventory.count.approve")
  async countApprove(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: dto.WitnessDto) { return this.counts.approve(u, id, d.witness ? await this.approvals.witness(u, d.witness) : undefined); }
  @Post("counts/:id/reject")
  @Perm("inventory.count.approve")
  countReject(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.counts.reject(u, id); }

  // ---- inter-branch transfers (Chain / Enterprise)
  @Get("transfers")
  @UseGuards(RequiresEntitlementGuard)
  @RequiresEntitlement("transfers")
  @Perm("inventory.transfer")
  transferList(@CurrentUser() u: AuthUser) { return this.transfers.list(u.orgId); }
  @Post("transfers")
  @UseGuards(RequiresEntitlementGuard)
  @RequiresEntitlement("transfers")
  @Perm("inventory.transfer")
  transferCreate(@CurrentUser() u: AuthUser, @Body() d: dto.TransferDto) { return this.transfers.create(u, d); }
  @Post("transfers/:id/dispatch")
  @UseGuards(RequiresEntitlementGuard)
  @RequiresEntitlement("transfers")
  @Perm("inventory.transfer")
  async transferDispatch(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: dto.WitnessDto) { return this.transfers.dispatch(u, id, d.witness ? await this.approvals.witness(u, d.witness) : undefined); }
  @Post("transfers/:id/receive")
  @UseGuards(RequiresEntitlementGuard)
  @RequiresEntitlement("transfers")
  @Perm("inventory.transfer")
  transferReceive(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.transfers.receive(u, id); }
  @Post("transfers/:id/cancel")
  @UseGuards(RequiresEntitlementGuard)
  @RequiresEntitlement("transfers")
  @Perm("inventory.transfer")
  transferCancel(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.transfers.cancel(u, id); }
}
