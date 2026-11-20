import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsIn, IsInt, IsNumber, IsNumberString, IsOptional, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { ApprovalDto } from "../../auth/approval.service";

export const ADJUST_REASONS = ["DAMAGE", "THEFT", "LOSS", "FOUND", "COUNT_CORRECTION", "SAMPLE", "OTHER"] as const;
export class ReceiptLineDto {
  @IsOptional() @IsString() drugId?: string;
  @IsOptional() @IsString() scan?: string;
  @IsOptional() @IsString() lotNumber?: string;
  @IsOptional() @IsString() expiryDate?: string;
  @IsInt() @Min(1) quantity!: number;
  @IsNumberString() unitCost!: string;
  @IsOptional() @IsNumber() temperatureC?: number;
  @IsOptional() @IsString() uom?: string;
  @IsOptional() @IsString() locationId?: string;
}
export class ReceiptDto {
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsString() supplierId?: string;
  @IsOptional() @IsString() purchaseOrderId?: string;
  @IsOptional() @IsString() invoiceNo?: string;
  @IsOptional() @IsNumberString() invoiceTotal?: string;
  @IsOptional() @IsString() idempotencyKey?: string;
  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(200) @ValidateNested({ each: true }) @Type(() => ReceiptLineDto) lines!: ReceiptLineDto[];
}
export class ScanDto { @IsString() @MinLength(6) code!: string; }
export class ReasonDto { @IsString() @MinLength(3) reason!: string; @IsOptional() @ValidateNested() @Type(() => ApprovalDto) witness?: ApprovalDto; }
export class WitnessDto { @IsOptional() @ValidateNested() @Type(() => ApprovalDto) witness?: ApprovalDto; }
export class AdjustDto {
  @IsString() lotId!: string;
  @IsInt() quantity!: number;
  @IsString() @MinLength(3) reason!: string;
  /** Adjustment reason code for reporting: DAMAGE | THEFT | LOSS | FOUND | COUNT_CORRECTION | SAMPLE | OTHER. */
  @IsOptional() @IsIn(ADJUST_REASONS) reasonCode?: string;
  @IsOptional() @ValidateNested() @Type(() => ApprovalDto) approval?: ApprovalDto;
  @IsOptional() @ValidateNested() @Type(() => ApprovalDto) witness?: ApprovalDto;
}
export class ReturnSupplierDto {
  @IsString() lotId!: string;
  @IsInt() @Min(1) quantity!: number;
  @IsString() @MinLength(3) reason!: string;
  @IsOptional() @IsNumberString() creditAmount?: string;
  @IsOptional() @ValidateNested() @Type(() => ApprovalDto) witness?: ApprovalDto;
}
export class TempDto { @IsNumber() temperatureC!: number; }
export class PolicyDto {
  @IsString() drugId!: string;
  @IsInt() @Min(0) minQty!: number;
  @IsInt() @Min(0) maxQty!: number;
  @IsOptional() @IsInt() @Min(0) leadTimeDays?: number;
  @IsOptional() @IsString() supplierId?: string;
}
export class CountStartDto {
  @IsOptional() @IsString() branchId?: string;
  @IsIn(["CYCLE", "FULL"]) type!: "CYCLE" | "FULL";
  @IsOptional() @IsArray() @IsString({ each: true }) drugIds?: string[];
}
export class CountLineDto { @IsString() lotId!: string; @IsInt() @Min(0) qtyCounted!: number; }
export class CountRecordDto { @IsArray() @ValidateNested({ each: true }) @Type(() => CountLineDto) lines!: CountLineDto[]; }
export class TransferLineDto { @IsString() lotId!: string; @IsInt() @Min(1) quantity!: number; }
export class TransferDto {
  @IsString() fromBranchId!: string;
  @IsString() toBranchId!: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => TransferLineDto) lines!: TransferLineDto[];
}
