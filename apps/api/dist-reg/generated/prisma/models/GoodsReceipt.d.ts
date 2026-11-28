import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type GoodsReceiptModel = runtime.Types.Result.DefaultSelection<Prisma.$GoodsReceiptPayload>;
export type AggregateGoodsReceipt = {
    _count: GoodsReceiptCountAggregateOutputType | null;
    _avg: GoodsReceiptAvgAggregateOutputType | null;
    _sum: GoodsReceiptSumAggregateOutputType | null;
    _min: GoodsReceiptMinAggregateOutputType | null;
    _max: GoodsReceiptMaxAggregateOutputType | null;
};
export type GoodsReceiptAvgAggregateOutputType = {
    invoiceTotal: runtime.Decimal | null;
};
export type GoodsReceiptSumAggregateOutputType = {
    invoiceTotal: runtime.Decimal | null;
};
export type GoodsReceiptMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    supplierId: string | null;
    purchaseOrderId: string | null;
    invoiceNo: string | null;
    invoiceTotal: runtime.Decimal | null;
    idempotencyKey: string | null;
    receivedBy: string | null;
    receivedAt: Date | null;
};
export type GoodsReceiptMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    supplierId: string | null;
    purchaseOrderId: string | null;
    invoiceNo: string | null;
    invoiceTotal: runtime.Decimal | null;
    idempotencyKey: string | null;
    receivedBy: string | null;
    receivedAt: Date | null;
};
export type GoodsReceiptCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    supplierId: number;
    purchaseOrderId: number;
    invoiceNo: number;
    invoiceTotal: number;
    idempotencyKey: number;
    receivedBy: number;
    receivedAt: number;
    _all: number;
};
export type GoodsReceiptAvgAggregateInputType = {
    invoiceTotal?: true;
};
export type GoodsReceiptSumAggregateInputType = {
    invoiceTotal?: true;
};
export type GoodsReceiptMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    supplierId?: true;
    purchaseOrderId?: true;
    invoiceNo?: true;
    invoiceTotal?: true;
    idempotencyKey?: true;
    receivedBy?: true;
    receivedAt?: true;
};
export type GoodsReceiptMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    supplierId?: true;
    purchaseOrderId?: true;
    invoiceNo?: true;
    invoiceTotal?: true;
    idempotencyKey?: true;
    receivedBy?: true;
    receivedAt?: true;
};
export type GoodsReceiptCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    supplierId?: true;
    purchaseOrderId?: true;
    invoiceNo?: true;
    invoiceTotal?: true;
    idempotencyKey?: true;
    receivedBy?: true;
    receivedAt?: true;
    _all?: true;
};
export type GoodsReceiptAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.GoodsReceiptWhereInput;
    orderBy?: Prisma.GoodsReceiptOrderByWithRelationInput | Prisma.GoodsReceiptOrderByWithRelationInput[];
    cursor?: Prisma.GoodsReceiptWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | GoodsReceiptCountAggregateInputType;
    _avg?: GoodsReceiptAvgAggregateInputType;
    _sum?: GoodsReceiptSumAggregateInputType;
    _min?: GoodsReceiptMinAggregateInputType;
    _max?: GoodsReceiptMaxAggregateInputType;
};
export type GetGoodsReceiptAggregateType<T extends GoodsReceiptAggregateArgs> = {
    [P in keyof T & keyof AggregateGoodsReceipt]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateGoodsReceipt[P]> : Prisma.GetScalarType<T[P], AggregateGoodsReceipt[P]>;
};
export type GoodsReceiptGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.GoodsReceiptWhereInput;
    orderBy?: Prisma.GoodsReceiptOrderByWithAggregationInput | Prisma.GoodsReceiptOrderByWithAggregationInput[];
    by: Prisma.GoodsReceiptScalarFieldEnum[] | Prisma.GoodsReceiptScalarFieldEnum;
    having?: Prisma.GoodsReceiptScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: GoodsReceiptCountAggregateInputType | true;
    _avg?: GoodsReceiptAvgAggregateInputType;
    _sum?: GoodsReceiptSumAggregateInputType;
    _min?: GoodsReceiptMinAggregateInputType;
    _max?: GoodsReceiptMaxAggregateInputType;
};
export type GoodsReceiptGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    supplierId: string | null;
    purchaseOrderId: string | null;
    invoiceNo: string | null;
    invoiceTotal: runtime.Decimal | null;
    idempotencyKey: string | null;
    receivedBy: string;
    receivedAt: Date;
    _count: GoodsReceiptCountAggregateOutputType | null;
    _avg: GoodsReceiptAvgAggregateOutputType | null;
    _sum: GoodsReceiptSumAggregateOutputType | null;
    _min: GoodsReceiptMinAggregateOutputType | null;
    _max: GoodsReceiptMaxAggregateOutputType | null;
};
export type GetGoodsReceiptGroupByPayload<T extends GoodsReceiptGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<GoodsReceiptGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof GoodsReceiptGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], GoodsReceiptGroupByOutputType[P]> : Prisma.GetScalarType<T[P], GoodsReceiptGroupByOutputType[P]>;
}>>;
export type GoodsReceiptWhereInput = {
    AND?: Prisma.GoodsReceiptWhereInput | Prisma.GoodsReceiptWhereInput[];
    OR?: Prisma.GoodsReceiptWhereInput[];
    NOT?: Prisma.GoodsReceiptWhereInput | Prisma.GoodsReceiptWhereInput[];
    id?: Prisma.StringFilter<"GoodsReceipt"> | string;
    orgId?: Prisma.StringFilter<"GoodsReceipt"> | string;
    branchId?: Prisma.StringFilter<"GoodsReceipt"> | string;
    supplierId?: Prisma.StringNullableFilter<"GoodsReceipt"> | string | null;
    purchaseOrderId?: Prisma.StringNullableFilter<"GoodsReceipt"> | string | null;
    invoiceNo?: Prisma.StringNullableFilter<"GoodsReceipt"> | string | null;
    invoiceTotal?: Prisma.DecimalNullableFilter<"GoodsReceipt"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    idempotencyKey?: Prisma.StringNullableFilter<"GoodsReceipt"> | string | null;
    receivedBy?: Prisma.StringFilter<"GoodsReceipt"> | string;
    receivedAt?: Prisma.DateTimeFilter<"GoodsReceipt"> | Date | string;
    lines?: Prisma.GoodsReceiptLineListRelationFilter;
};
export type GoodsReceiptOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrderInput | Prisma.SortOrder;
    purchaseOrderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    invoiceNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    invoiceTotal?: Prisma.SortOrderInput | Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    receivedBy?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
    lines?: Prisma.GoodsReceiptLineOrderByRelationAggregateInput;
};
export type GoodsReceiptWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId_idempotencyKey?: Prisma.GoodsReceiptOrgIdIdempotencyKeyCompoundUniqueInput;
    AND?: Prisma.GoodsReceiptWhereInput | Prisma.GoodsReceiptWhereInput[];
    OR?: Prisma.GoodsReceiptWhereInput[];
    NOT?: Prisma.GoodsReceiptWhereInput | Prisma.GoodsReceiptWhereInput[];
    orgId?: Prisma.StringFilter<"GoodsReceipt"> | string;
    branchId?: Prisma.StringFilter<"GoodsReceipt"> | string;
    supplierId?: Prisma.StringNullableFilter<"GoodsReceipt"> | string | null;
    purchaseOrderId?: Prisma.StringNullableFilter<"GoodsReceipt"> | string | null;
    invoiceNo?: Prisma.StringNullableFilter<"GoodsReceipt"> | string | null;
    invoiceTotal?: Prisma.DecimalNullableFilter<"GoodsReceipt"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    idempotencyKey?: Prisma.StringNullableFilter<"GoodsReceipt"> | string | null;
    receivedBy?: Prisma.StringFilter<"GoodsReceipt"> | string;
    receivedAt?: Prisma.DateTimeFilter<"GoodsReceipt"> | Date | string;
    lines?: Prisma.GoodsReceiptLineListRelationFilter;
}, "id" | "orgId_idempotencyKey">;
export type GoodsReceiptOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrderInput | Prisma.SortOrder;
    purchaseOrderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    invoiceNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    invoiceTotal?: Prisma.SortOrderInput | Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    receivedBy?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
    _count?: Prisma.GoodsReceiptCountOrderByAggregateInput;
    _avg?: Prisma.GoodsReceiptAvgOrderByAggregateInput;
    _max?: Prisma.GoodsReceiptMaxOrderByAggregateInput;
    _min?: Prisma.GoodsReceiptMinOrderByAggregateInput;
    _sum?: Prisma.GoodsReceiptSumOrderByAggregateInput;
};
export type GoodsReceiptScalarWhereWithAggregatesInput = {
    AND?: Prisma.GoodsReceiptScalarWhereWithAggregatesInput | Prisma.GoodsReceiptScalarWhereWithAggregatesInput[];
    OR?: Prisma.GoodsReceiptScalarWhereWithAggregatesInput[];
    NOT?: Prisma.GoodsReceiptScalarWhereWithAggregatesInput | Prisma.GoodsReceiptScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"GoodsReceipt"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"GoodsReceipt"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"GoodsReceipt"> | string;
    supplierId?: Prisma.StringNullableWithAggregatesFilter<"GoodsReceipt"> | string | null;
    purchaseOrderId?: Prisma.StringNullableWithAggregatesFilter<"GoodsReceipt"> | string | null;
    invoiceNo?: Prisma.StringNullableWithAggregatesFilter<"GoodsReceipt"> | string | null;
    invoiceTotal?: Prisma.DecimalNullableWithAggregatesFilter<"GoodsReceipt"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    idempotencyKey?: Prisma.StringNullableWithAggregatesFilter<"GoodsReceipt"> | string | null;
    receivedBy?: Prisma.StringWithAggregatesFilter<"GoodsReceipt"> | string;
    receivedAt?: Prisma.DateTimeWithAggregatesFilter<"GoodsReceipt"> | Date | string;
};
export type GoodsReceiptCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    supplierId?: string | null;
    purchaseOrderId?: string | null;
    invoiceNo?: string | null;
    invoiceTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    idempotencyKey?: string | null;
    receivedBy: string;
    receivedAt?: Date | string;
    lines?: Prisma.GoodsReceiptLineCreateNestedManyWithoutReceiptInput;
};
export type GoodsReceiptUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    supplierId?: string | null;
    purchaseOrderId?: string | null;
    invoiceNo?: string | null;
    invoiceTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    idempotencyKey?: string | null;
    receivedBy: string;
    receivedAt?: Date | string;
    lines?: Prisma.GoodsReceiptLineUncheckedCreateNestedManyWithoutReceiptInput;
};
export type GoodsReceiptUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    purchaseOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    invoiceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    invoiceTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.GoodsReceiptLineUpdateManyWithoutReceiptNestedInput;
};
export type GoodsReceiptUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    purchaseOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    invoiceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    invoiceTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.GoodsReceiptLineUncheckedUpdateManyWithoutReceiptNestedInput;
};
export type GoodsReceiptCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    supplierId?: string | null;
    purchaseOrderId?: string | null;
    invoiceNo?: string | null;
    invoiceTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    idempotencyKey?: string | null;
    receivedBy: string;
    receivedAt?: Date | string;
};
export type GoodsReceiptUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    purchaseOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    invoiceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    invoiceTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type GoodsReceiptUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    purchaseOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    invoiceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    invoiceTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type GoodsReceiptOrgIdIdempotencyKeyCompoundUniqueInput = {
    orgId: string;
    idempotencyKey: string;
};
export type GoodsReceiptCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    purchaseOrderId?: Prisma.SortOrder;
    invoiceNo?: Prisma.SortOrder;
    invoiceTotal?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    receivedBy?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type GoodsReceiptAvgOrderByAggregateInput = {
    invoiceTotal?: Prisma.SortOrder;
};
export type GoodsReceiptMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    purchaseOrderId?: Prisma.SortOrder;
    invoiceNo?: Prisma.SortOrder;
    invoiceTotal?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    receivedBy?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type GoodsReceiptMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    purchaseOrderId?: Prisma.SortOrder;
    invoiceNo?: Prisma.SortOrder;
    invoiceTotal?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    receivedBy?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type GoodsReceiptSumOrderByAggregateInput = {
    invoiceTotal?: Prisma.SortOrder;
};
export type GoodsReceiptScalarRelationFilter = {
    is?: Prisma.GoodsReceiptWhereInput;
    isNot?: Prisma.GoodsReceiptWhereInput;
};
export type GoodsReceiptCreateNestedOneWithoutLinesInput = {
    create?: Prisma.XOR<Prisma.GoodsReceiptCreateWithoutLinesInput, Prisma.GoodsReceiptUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.GoodsReceiptCreateOrConnectWithoutLinesInput;
    connect?: Prisma.GoodsReceiptWhereUniqueInput;
};
export type GoodsReceiptUpdateOneRequiredWithoutLinesNestedInput = {
    create?: Prisma.XOR<Prisma.GoodsReceiptCreateWithoutLinesInput, Prisma.GoodsReceiptUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.GoodsReceiptCreateOrConnectWithoutLinesInput;
    upsert?: Prisma.GoodsReceiptUpsertWithoutLinesInput;
    connect?: Prisma.GoodsReceiptWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.GoodsReceiptUpdateToOneWithWhereWithoutLinesInput, Prisma.GoodsReceiptUpdateWithoutLinesInput>, Prisma.GoodsReceiptUncheckedUpdateWithoutLinesInput>;
};
export type GoodsReceiptCreateWithoutLinesInput = {
    id?: string;
    orgId: string;
    branchId: string;
    supplierId?: string | null;
    purchaseOrderId?: string | null;
    invoiceNo?: string | null;
    invoiceTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    idempotencyKey?: string | null;
    receivedBy: string;
    receivedAt?: Date | string;
};
export type GoodsReceiptUncheckedCreateWithoutLinesInput = {
    id?: string;
    orgId: string;
    branchId: string;
    supplierId?: string | null;
    purchaseOrderId?: string | null;
    invoiceNo?: string | null;
    invoiceTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    idempotencyKey?: string | null;
    receivedBy: string;
    receivedAt?: Date | string;
};
export type GoodsReceiptCreateOrConnectWithoutLinesInput = {
    where: Prisma.GoodsReceiptWhereUniqueInput;
    create: Prisma.XOR<Prisma.GoodsReceiptCreateWithoutLinesInput, Prisma.GoodsReceiptUncheckedCreateWithoutLinesInput>;
};
export type GoodsReceiptUpsertWithoutLinesInput = {
    update: Prisma.XOR<Prisma.GoodsReceiptUpdateWithoutLinesInput, Prisma.GoodsReceiptUncheckedUpdateWithoutLinesInput>;
    create: Prisma.XOR<Prisma.GoodsReceiptCreateWithoutLinesInput, Prisma.GoodsReceiptUncheckedCreateWithoutLinesInput>;
    where?: Prisma.GoodsReceiptWhereInput;
};
export type GoodsReceiptUpdateToOneWithWhereWithoutLinesInput = {
    where?: Prisma.GoodsReceiptWhereInput;
    data: Prisma.XOR<Prisma.GoodsReceiptUpdateWithoutLinesInput, Prisma.GoodsReceiptUncheckedUpdateWithoutLinesInput>;
};
export type GoodsReceiptUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    purchaseOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    invoiceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    invoiceTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type GoodsReceiptUncheckedUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    purchaseOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    invoiceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    invoiceTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type GoodsReceiptCountOutputType = {
    lines: number;
};
export type GoodsReceiptCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | GoodsReceiptCountOutputTypeCountLinesArgs;
};
export type GoodsReceiptCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptCountOutputTypeSelect<ExtArgs> | null;
};
export type GoodsReceiptCountOutputTypeCountLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.GoodsReceiptLineWhereInput;
};
export type GoodsReceiptSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    supplierId?: boolean;
    purchaseOrderId?: boolean;
    invoiceNo?: boolean;
    invoiceTotal?: boolean;
    idempotencyKey?: boolean;
    receivedBy?: boolean;
    receivedAt?: boolean;
    lines?: boolean | Prisma.GoodsReceipt$linesArgs<ExtArgs>;
    _count?: boolean | Prisma.GoodsReceiptCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["goodsReceipt"]>;
export type GoodsReceiptSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    supplierId?: boolean;
    purchaseOrderId?: boolean;
    invoiceNo?: boolean;
    invoiceTotal?: boolean;
    idempotencyKey?: boolean;
    receivedBy?: boolean;
    receivedAt?: boolean;
}, ExtArgs["result"]["goodsReceipt"]>;
export type GoodsReceiptSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    supplierId?: boolean;
    purchaseOrderId?: boolean;
    invoiceNo?: boolean;
    invoiceTotal?: boolean;
    idempotencyKey?: boolean;
    receivedBy?: boolean;
    receivedAt?: boolean;
}, ExtArgs["result"]["goodsReceipt"]>;
export type GoodsReceiptSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    supplierId?: boolean;
    purchaseOrderId?: boolean;
    invoiceNo?: boolean;
    invoiceTotal?: boolean;
    idempotencyKey?: boolean;
    receivedBy?: boolean;
    receivedAt?: boolean;
};
export type GoodsReceiptOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "supplierId" | "purchaseOrderId" | "invoiceNo" | "invoiceTotal" | "idempotencyKey" | "receivedBy" | "receivedAt", ExtArgs["result"]["goodsReceipt"]>;
export type GoodsReceiptInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | Prisma.GoodsReceipt$linesArgs<ExtArgs>;
    _count?: boolean | Prisma.GoodsReceiptCountOutputTypeDefaultArgs<ExtArgs>;
};
export type GoodsReceiptIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type GoodsReceiptIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $GoodsReceiptPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "GoodsReceipt";
    objects: {
        lines: Prisma.$GoodsReceiptLinePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        supplierId: string | null;
        purchaseOrderId: string | null;
        invoiceNo: string | null;
        invoiceTotal: runtime.Decimal | null;
        idempotencyKey: string | null;
        receivedBy: string;
        receivedAt: Date;
    }, ExtArgs["result"]["goodsReceipt"]>;
    composites: {};
};
export type GoodsReceiptGetPayload<S extends boolean | null | undefined | GoodsReceiptDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$GoodsReceiptPayload, S>;
export type GoodsReceiptCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<GoodsReceiptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: GoodsReceiptCountAggregateInputType | true;
};
export interface GoodsReceiptDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['GoodsReceipt'];
        meta: {
            name: 'GoodsReceipt';
        };
    };
    findUnique<T extends GoodsReceiptFindUniqueArgs>(args: Prisma.SelectSubset<T, GoodsReceiptFindUniqueArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends GoodsReceiptFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, GoodsReceiptFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends GoodsReceiptFindFirstArgs>(args?: Prisma.SelectSubset<T, GoodsReceiptFindFirstArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends GoodsReceiptFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, GoodsReceiptFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends GoodsReceiptFindManyArgs>(args?: Prisma.SelectSubset<T, GoodsReceiptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends GoodsReceiptCreateArgs>(args: Prisma.SelectSubset<T, GoodsReceiptCreateArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends GoodsReceiptCreateManyArgs>(args?: Prisma.SelectSubset<T, GoodsReceiptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends GoodsReceiptCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, GoodsReceiptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends GoodsReceiptDeleteArgs>(args: Prisma.SelectSubset<T, GoodsReceiptDeleteArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends GoodsReceiptUpdateArgs>(args: Prisma.SelectSubset<T, GoodsReceiptUpdateArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends GoodsReceiptDeleteManyArgs>(args?: Prisma.SelectSubset<T, GoodsReceiptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends GoodsReceiptUpdateManyArgs>(args: Prisma.SelectSubset<T, GoodsReceiptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends GoodsReceiptUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, GoodsReceiptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends GoodsReceiptUpsertArgs>(args: Prisma.SelectSubset<T, GoodsReceiptUpsertArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends GoodsReceiptCountArgs>(args?: Prisma.Subset<T, GoodsReceiptCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], GoodsReceiptCountAggregateOutputType> : number>;
    aggregate<T extends GoodsReceiptAggregateArgs>(args: Prisma.Subset<T, GoodsReceiptAggregateArgs>): Prisma.PrismaPromise<GetGoodsReceiptAggregateType<T>>;
    groupBy<T extends GoodsReceiptGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: GoodsReceiptGroupByArgs['orderBy'];
    } : {
        orderBy?: GoodsReceiptGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, GoodsReceiptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGoodsReceiptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: GoodsReceiptFieldRefs;
}
export interface Prisma__GoodsReceiptClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    lines<T extends Prisma.GoodsReceipt$linesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.GoodsReceipt$linesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface GoodsReceiptFieldRefs {
    readonly id: Prisma.FieldRef<"GoodsReceipt", 'String'>;
    readonly orgId: Prisma.FieldRef<"GoodsReceipt", 'String'>;
    readonly branchId: Prisma.FieldRef<"GoodsReceipt", 'String'>;
    readonly supplierId: Prisma.FieldRef<"GoodsReceipt", 'String'>;
    readonly purchaseOrderId: Prisma.FieldRef<"GoodsReceipt", 'String'>;
    readonly invoiceNo: Prisma.FieldRef<"GoodsReceipt", 'String'>;
    readonly invoiceTotal: Prisma.FieldRef<"GoodsReceipt", 'Decimal'>;
    readonly idempotencyKey: Prisma.FieldRef<"GoodsReceipt", 'String'>;
    readonly receivedBy: Prisma.FieldRef<"GoodsReceipt", 'String'>;
    readonly receivedAt: Prisma.FieldRef<"GoodsReceipt", 'DateTime'>;
}
export type GoodsReceiptFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptInclude<ExtArgs> | null;
    where: Prisma.GoodsReceiptWhereUniqueInput;
};
export type GoodsReceiptFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptInclude<ExtArgs> | null;
    where: Prisma.GoodsReceiptWhereUniqueInput;
};
export type GoodsReceiptFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptInclude<ExtArgs> | null;
    where?: Prisma.GoodsReceiptWhereInput;
    orderBy?: Prisma.GoodsReceiptOrderByWithRelationInput | Prisma.GoodsReceiptOrderByWithRelationInput[];
    cursor?: Prisma.GoodsReceiptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.GoodsReceiptScalarFieldEnum | Prisma.GoodsReceiptScalarFieldEnum[];
};
export type GoodsReceiptFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptInclude<ExtArgs> | null;
    where?: Prisma.GoodsReceiptWhereInput;
    orderBy?: Prisma.GoodsReceiptOrderByWithRelationInput | Prisma.GoodsReceiptOrderByWithRelationInput[];
    cursor?: Prisma.GoodsReceiptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.GoodsReceiptScalarFieldEnum | Prisma.GoodsReceiptScalarFieldEnum[];
};
export type GoodsReceiptFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptInclude<ExtArgs> | null;
    where?: Prisma.GoodsReceiptWhereInput;
    orderBy?: Prisma.GoodsReceiptOrderByWithRelationInput | Prisma.GoodsReceiptOrderByWithRelationInput[];
    cursor?: Prisma.GoodsReceiptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.GoodsReceiptScalarFieldEnum | Prisma.GoodsReceiptScalarFieldEnum[];
};
export type GoodsReceiptCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.GoodsReceiptCreateInput, Prisma.GoodsReceiptUncheckedCreateInput>;
};
export type GoodsReceiptCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.GoodsReceiptCreateManyInput | Prisma.GoodsReceiptCreateManyInput[];
    skipDuplicates?: boolean;
};
export type GoodsReceiptCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptOmit<ExtArgs> | null;
    data: Prisma.GoodsReceiptCreateManyInput | Prisma.GoodsReceiptCreateManyInput[];
    skipDuplicates?: boolean;
};
export type GoodsReceiptUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.GoodsReceiptUpdateInput, Prisma.GoodsReceiptUncheckedUpdateInput>;
    where: Prisma.GoodsReceiptWhereUniqueInput;
};
export type GoodsReceiptUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.GoodsReceiptUpdateManyMutationInput, Prisma.GoodsReceiptUncheckedUpdateManyInput>;
    where?: Prisma.GoodsReceiptWhereInput;
    limit?: number;
};
export type GoodsReceiptUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.GoodsReceiptUpdateManyMutationInput, Prisma.GoodsReceiptUncheckedUpdateManyInput>;
    where?: Prisma.GoodsReceiptWhereInput;
    limit?: number;
};
export type GoodsReceiptUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptInclude<ExtArgs> | null;
    where: Prisma.GoodsReceiptWhereUniqueInput;
    create: Prisma.XOR<Prisma.GoodsReceiptCreateInput, Prisma.GoodsReceiptUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.GoodsReceiptUpdateInput, Prisma.GoodsReceiptUncheckedUpdateInput>;
};
export type GoodsReceiptDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptInclude<ExtArgs> | null;
    where: Prisma.GoodsReceiptWhereUniqueInput;
};
export type GoodsReceiptDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.GoodsReceiptWhereInput;
    limit?: number;
};
export type GoodsReceipt$linesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptLineSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptLineOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptLineInclude<ExtArgs> | null;
    where?: Prisma.GoodsReceiptLineWhereInput;
    orderBy?: Prisma.GoodsReceiptLineOrderByWithRelationInput | Prisma.GoodsReceiptLineOrderByWithRelationInput[];
    cursor?: Prisma.GoodsReceiptLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.GoodsReceiptLineScalarFieldEnum | Prisma.GoodsReceiptLineScalarFieldEnum[];
};
export type GoodsReceiptDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptInclude<ExtArgs> | null;
};
