import { Body, Controller, Get, Inject, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsIn, IsNumberString, IsOptional, IsString, MinLength } from "class-validator";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { branchFilter, resolveBranchId } from "../../common/branch-scope";
import { pageArgs } from "../../common/pagination";
import { EXPENSE_CATEGORIES, FinanceService } from "./finance.service";

class ExpenseDto {
  @IsOptional() @IsString() branchId?: string; @IsIn(EXPENSE_CATEGORIES) category!: string; @IsNumberString() amount!: string; @IsOptional() @IsNumberString() vatAmount?: string;
  @IsOptional() @IsIn(["CASH", "CARD", "BANK", "OTHER"]) method?: string; @IsString() @MinLength(3) description!: string; @IsOptional() @IsString() supplierId?: string;
  @IsOptional() @IsDateString() expenseDate?: string; @IsOptional() @IsString() receiptRef?: string; @IsOptional() @IsBoolean() fromDrawer?: boolean;
}
const range = (q: { from?: string; to?: string }) => { const to = q.to ? new Date(q.to) : new Date(); const from = q.from ? new Date(q.from) : new Date(to.getTime() - 29 * 86_400_000); return { from, to }; };

@ApiTags("finance")
@ApiBearerAuth()
@Controller("finance")
export class FinanceController {
  constructor(@Inject(FinanceService) private readonly svc: FinanceService, @Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get("overview") @Perm("finance.read")
  overview(@CurrentUser() u: AuthUser, @Query() q: { from?: string; to?: string; branchId?: string }) { return this.svc.overview({ orgId: u.orgId, ...branchFilter(u, q.branchId), ...range(q) }); }
  @Get("margin") @Perm("finance.read")
  margin(@CurrentUser() u: AuthUser, @Query() q: { from?: string; to?: string; branchId?: string; by?: string }) { return this.svc.margin({ orgId: u.orgId, ...branchFilter(u, q.branchId), ...range(q) }, q.by === "category" ? "category" : "product"); }
  @Get("receivables") @Perm("finance.read")
  receivables(@CurrentUser() u: AuthUser) { return this.svc.receivables(u.orgId); }
  @Get("expense-categories") @Perm("expense.read")
  categories() { return EXPENSE_CATEGORIES; }
  @Get("expenses") @Perm("expense.read")
  expenses(@CurrentUser() u: AuthUser, @Query() q: { from?: string; to?: string; branchId?: string; category?: string; page?: string; pageSize?: string }) { const { skip, take } = pageArgs(q); return this.svc.listExpenses(u.orgId, { ...branchFilter(u, q.branchId), category: q.category, from: q.from ? new Date(q.from) : undefined, to: q.to ? new Date(q.to) : undefined, skip, take }); }
  @Post("expenses") @Perm("expense.write")
  async createExpense(@CurrentUser() u: AuthUser, @Body() d: ExpenseDto) { return this.svc.createExpense(u, await resolveBranchId(this.prisma, u, d.branchId), d); }
  @Post("expenses/:id/void") @Perm("expense.write")
  voidExpense(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.voidExpense(u, id); }
}
