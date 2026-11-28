import { ApprovalDto } from "../../auth/approval.service";
export declare const ADJUST_REASONS: readonly ["DAMAGE", "THEFT", "LOSS", "FOUND", "COUNT_CORRECTION", "SAMPLE", "OTHER"];
export declare class ReceiptLineDto {
    drugId?: string;
    scan?: string;
    lotNumber?: string;
    expiryDate?: string;
    quantity: number;
    unitCost: string;
    temperatureC?: number;
    uom?: string;
    locationId?: string;
}
export declare class ReceiptDto {
    branchId?: string;
    supplierId?: string;
    purchaseOrderId?: string;
    invoiceNo?: string;
    invoiceTotal?: string;
    idempotencyKey?: string;
    lines: ReceiptLineDto[];
}
export declare class ScanDto {
    code: string;
}
export declare class ReasonDto {
    reason: string;
    witness?: ApprovalDto;
}
export declare class WitnessDto {
    witness?: ApprovalDto;
}
export declare class AdjustDto {
    lotId: string;
    quantity: number;
    reason: string;
    reasonCode?: string;
    approval?: ApprovalDto;
    witness?: ApprovalDto;
}
export declare class ReturnSupplierDto {
    lotId: string;
    quantity: number;
    reason: string;
    creditAmount?: string;
    witness?: ApprovalDto;
}
export declare class TempDto {
    temperatureC: number;
}
export declare class PolicyDto {
    drugId: string;
    minQty: number;
    maxQty: number;
    leadTimeDays?: number;
    supplierId?: string;
}
export declare class CountStartDto {
    branchId?: string;
    type: "CYCLE" | "FULL";
    drugIds?: string[];
}
export declare class CountLineDto {
    lotId: string;
    qtyCounted: number;
}
export declare class CountRecordDto {
    lines: CountLineDto[];
}
export declare class TransferLineDto {
    lotId: string;
    quantity: number;
}
export declare class TransferDto {
    fromBranchId: string;
    toBranchId: string;
    lines: TransferLineDto[];
}
