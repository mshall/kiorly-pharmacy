import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type PurchaseOrderModel = runtime.Types.Result.DefaultSelection<Prisma.$PurchaseOrderPayload>;
export type AggregatePurchaseOrder = {
    _count: PurchaseOrderCountAggregateOutputType | null;
    _avg: PurchaseOrderAvgAggregateOutputType | null;
    _sum: PurchaseOrderSumAggregateOutputType | null;
    _min: PurchaseOrderMinAggregateOutputType | null;
    _max: PurchaseOrderMaxAggregateOutputType | null;
};
export type PurchaseOrderAvgAggregateOutputType = {
    totalCost: runtime.Decimal | null;
};
export type PurchaseOrderSumAggregateOutputType = {
    totalCost: runtime.Decimal | null;
};
export type PurchaseOrderMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    supplierId: string | null;
    status: $Enums.PurchaseOrderStatus | null;
    origin: string | null;
    createdBy: string | null;
    poNumber: string | null;
    expectedAt: Date | null;
    notes: string | null;
    sentVia: string | null;
    totalCost: runtime.Decimal | null;
    sentAt: Date | null;
    createdAt: Date | null;
};
export type PurchaseOrderMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    supplierId: string | null;
    status: $Enums.PurchaseOrderStatus | null;
    origin: string | null;
    createdBy: string | null;
    poNumber: string | null;
    expectedAt: Date | null;
    notes: string | null;
    sentVia: string | null;
    totalCost: runtime.Decimal | null;
    sentAt: Date | null;
    createdAt: Date | null;
};
export type PurchaseOrderCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    supplierId: number;
    status: number;
    origin: number;
    createdBy: number;
    poNumber: number;
    expectedAt: number;
    notes: number;
    sentVia: number;
    totalCost: number;
    sentAt: number;
    createdAt: number;
    _all: number;
};
export type PurchaseOrderAvgAggregateInputType = {
    totalCost?: true;
};
export type PurchaseOrderSumAggregateInputType = {
    totalCost?: true;
};
export type PurchaseOrderMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    supplierId?: true;
    status?: true;
    origin?: true;
    createdBy?: true;
    poNumber?: true;
    expectedAt?: true;
    notes?: true;
    sentVia?: true;
    totalCost?: true;
    sentAt?: true;
    createdAt?: true;
};
export type PurchaseOrderMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    supplierId?: true;
    status?: true;
    origin?: true;
    createdBy?: true;
    poNumber?: true;
    expectedAt?: true;
    notes?: true;
    sentVia?: true;
    totalCost?: true;
    sentAt?: true;
    createdAt?: true;
};
export type PurchaseOrderCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    supplierId?: true;
    status?: true;
    origin?: true;
    createdBy?: true;
    poNumber?: true;
    expectedAt?: true;
    notes?: true;
    sentVia?: true;
    totalCost?: true;
    sentAt?: true;
    createdAt?: true;
    _all?: true;
};
export type PurchaseOrderAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PurchaseOrderWhereInput;
    orderBy?: Prisma.PurchaseOrderOrderByWithRelationInput | Prisma.PurchaseOrderOrderByWithRelationInput[];
    cursor?: Prisma.PurchaseOrderWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PurchaseOrderCountAggregateInputType;
    _avg?: PurchaseOrderAvgAggregateInputType;
    _sum?: PurchaseOrderSumAggregateInputType;
    _min?: PurchaseOrderMinAggregateInputType;
    _max?: PurchaseOrderMaxAggregateInputType;
};
export type GetPurchaseOrderAggregateType<T extends PurchaseOrderAggregateArgs> = {
    [P in keyof T & keyof AggregatePurchaseOrder]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePurchaseOrder[P]> : Prisma.GetScalarType<T[P], AggregatePurchaseOrder[P]>;
};
export type PurchaseOrderGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PurchaseOrderWhereInput;
    orderBy?: Prisma.PurchaseOrderOrderByWithAggregationInput | Prisma.PurchaseOrderOrderByWithAggregationInput[];
    by: Prisma.PurchaseOrderScalarFieldEnum[] | Prisma.PurchaseOrderScalarFieldEnum;
    having?: Prisma.PurchaseOrderScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PurchaseOrderCountAggregateInputType | true;
    _avg?: PurchaseOrderAvgAggregateInputType;
    _sum?: PurchaseOrderSumAggregateInputType;
    _min?: PurchaseOrderMinAggregateInputType;
    _max?: PurchaseOrderMaxAggregateInputType;
};
export type PurchaseOrderGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    supplierId: string;
    status: $Enums.PurchaseOrderStatus;
    origin: string;
    createdBy: string | null;
    poNumber: string | null;
    expectedAt: Date | null;
    notes: string | null;
    sentVia: string | null;
    totalCost: runtime.Decimal;
    sentAt: Date | null;
    createdAt: Date;
    _count: PurchaseOrderCountAggregateOutputType | null;
    _avg: PurchaseOrderAvgAggregateOutputType | null;
    _sum: PurchaseOrderSumAggregateOutputType | null;
    _min: PurchaseOrderMinAggregateOutputType | null;
    _max: PurchaseOrderMaxAggregateOutputType | null;
};
export type GetPurchaseOrderGroupByPayload<T extends PurchaseOrderGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PurchaseOrderGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PurchaseOrderGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PurchaseOrderGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PurchaseOrderGroupByOutputType[P]>;
}>>;
export type PurchaseOrderWhereInput = {
    AND?: Prisma.PurchaseOrderWhereInput | Prisma.PurchaseOrderWhereInput[];
    OR?: Prisma.PurchaseOrderWhereInput[];
    NOT?: Prisma.PurchaseOrderWhereInput | Prisma.PurchaseOrderWhereInput[];
    id?: Prisma.StringFilter<"PurchaseOrder"> | string;
    orgId?: Prisma.StringFilter<"PurchaseOrder"> | string;
    branchId?: Prisma.StringFilter<"PurchaseOrder"> | string;
    supplierId?: Prisma.StringFilter<"PurchaseOrder"> | string;
    status?: Prisma.EnumPurchaseOrderStatusFilter<"PurchaseOrder"> | $Enums.PurchaseOrderStatus;
    origin?: Prisma.StringFilter<"PurchaseOrder"> | string;
    createdBy?: Prisma.StringNullableFilter<"PurchaseOrder"> | string | null;
    poNumber?: Prisma.StringNullableFilter<"PurchaseOrder"> | string | null;
    expectedAt?: Prisma.DateTimeNullableFilter<"PurchaseOrder"> | Date | string | null;
    notes?: Prisma.StringNullableFilter<"PurchaseOrder"> | string | null;
    sentVia?: Prisma.StringNullableFilter<"PurchaseOrder"> | string | null;
    totalCost?: Prisma.DecimalFilter<"PurchaseOrder"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Prisma.DateTimeNullableFilter<"PurchaseOrder"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"PurchaseOrder"> | Date | string;
    supplier?: Prisma.XOR<Prisma.SupplierScalarRelationFilter, Prisma.SupplierWhereInput>;
    lines?: Prisma.PurchaseOrderLineListRelationFilter;
    lots?: Prisma.StockLotListRelationFilter;
};
export type PurchaseOrderOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    origin?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    poNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    expectedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    sentVia?: Prisma.SortOrderInput | Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    supplier?: Prisma.SupplierOrderByWithRelationInput;
    lines?: Prisma.PurchaseOrderLineOrderByRelationAggregateInput;
    lots?: Prisma.StockLotOrderByRelationAggregateInput;
};
export type PurchaseOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId_poNumber?: Prisma.PurchaseOrderOrgIdPoNumberCompoundUniqueInput;
    AND?: Prisma.PurchaseOrderWhereInput | Prisma.PurchaseOrderWhereInput[];
    OR?: Prisma.PurchaseOrderWhereInput[];
    NOT?: Prisma.PurchaseOrderWhereInput | Prisma.PurchaseOrderWhereInput[];
    orgId?: Prisma.StringFilter<"PurchaseOrder"> | string;
    branchId?: Prisma.StringFilter<"PurchaseOrder"> | string;
    supplierId?: Prisma.StringFilter<"PurchaseOrder"> | string;
    status?: Prisma.EnumPurchaseOrderStatusFilter<"PurchaseOrder"> | $Enums.PurchaseOrderStatus;
    origin?: Prisma.StringFilter<"PurchaseOrder"> | string;
    createdBy?: Prisma.StringNullableFilter<"PurchaseOrder"> | string | null;
    poNumber?: Prisma.StringNullableFilter<"PurchaseOrder"> | string | null;
    expectedAt?: Prisma.DateTimeNullableFilter<"PurchaseOrder"> | Date | string | null;
    notes?: Prisma.StringNullableFilter<"PurchaseOrder"> | string | null;
    sentVia?: Prisma.StringNullableFilter<"PurchaseOrder"> | string | null;
    totalCost?: Prisma.DecimalFilter<"PurchaseOrder"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Prisma.DateTimeNullableFilter<"PurchaseOrder"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"PurchaseOrder"> | Date | string;
    supplier?: Prisma.XOR<Prisma.SupplierScalarRelationFilter, Prisma.SupplierWhereInput>;
    lines?: Prisma.PurchaseOrderLineListRelationFilter;
    lots?: Prisma.StockLotListRelationFilter;
}, "id" | "orgId_poNumber">;
export type PurchaseOrderOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    origin?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    poNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    expectedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    sentVia?: Prisma.SortOrderInput | Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.PurchaseOrderCountOrderByAggregateInput;
    _avg?: Prisma.PurchaseOrderAvgOrderByAggregateInput;
    _max?: Prisma.PurchaseOrderMaxOrderByAggregateInput;
    _min?: Prisma.PurchaseOrderMinOrderByAggregateInput;
    _sum?: Prisma.PurchaseOrderSumOrderByAggregateInput;
};
export type PurchaseOrderScalarWhereWithAggregatesInput = {
    AND?: Prisma.PurchaseOrderScalarWhereWithAggregatesInput | Prisma.PurchaseOrderScalarWhereWithAggregatesInput[];
    OR?: Prisma.PurchaseOrderScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PurchaseOrderScalarWhereWithAggregatesInput | Prisma.PurchaseOrderScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PurchaseOrder"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"PurchaseOrder"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"PurchaseOrder"> | string;
    supplierId?: Prisma.StringWithAggregatesFilter<"PurchaseOrder"> | string;
    status?: Prisma.EnumPurchaseOrderStatusWithAggregatesFilter<"PurchaseOrder"> | $Enums.PurchaseOrderStatus;
    origin?: Prisma.StringWithAggregatesFilter<"PurchaseOrder"> | string;
    createdBy?: Prisma.StringNullableWithAggregatesFilter<"PurchaseOrder"> | string | null;
    poNumber?: Prisma.StringNullableWithAggregatesFilter<"PurchaseOrder"> | string | null;
    expectedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"PurchaseOrder"> | Date | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"PurchaseOrder"> | string | null;
    sentVia?: Prisma.StringNullableWithAggregatesFilter<"PurchaseOrder"> | string | null;
    totalCost?: Prisma.DecimalWithAggregatesFilter<"PurchaseOrder"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Prisma.DateTimeNullableWithAggregatesFilter<"PurchaseOrder"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PurchaseOrder"> | Date | string;
};
export type PurchaseOrderCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    status?: $Enums.PurchaseOrderStatus;
    origin?: string;
    createdBy?: string | null;
    poNumber?: string | null;
    expectedAt?: Date | string | null;
    notes?: string | null;
    sentVia?: string | null;
    totalCost?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Date | string | null;
    createdAt?: Date | string;
    supplier: Prisma.SupplierCreateNestedOneWithoutPurchaseOrdersInput;
    lines?: Prisma.PurchaseOrderLineCreateNestedManyWithoutPurchaseOrderInput;
    lots?: Prisma.StockLotCreateNestedManyWithoutPurchaseOrderInput;
};
export type PurchaseOrderUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    supplierId: string;
    status?: $Enums.PurchaseOrderStatus;
    origin?: string;
    createdBy?: string | null;
    poNumber?: string | null;
    expectedAt?: Date | string | null;
    notes?: string | null;
    sentVia?: string | null;
    totalCost?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Date | string | null;
    createdAt?: Date | string;
    lines?: Prisma.PurchaseOrderLineUncheckedCreateNestedManyWithoutPurchaseOrderInput;
    lots?: Prisma.StockLotUncheckedCreateNestedManyWithoutPurchaseOrderInput;
};
export type PurchaseOrderUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPurchaseOrderStatusFieldUpdateOperationsInput | $Enums.PurchaseOrderStatus;
    origin?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    poNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expectedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentVia?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    supplier?: Prisma.SupplierUpdateOneRequiredWithoutPurchaseOrdersNestedInput;
    lines?: Prisma.PurchaseOrderLineUpdateManyWithoutPurchaseOrderNestedInput;
    lots?: Prisma.StockLotUpdateManyWithoutPurchaseOrderNestedInput;
};
export type PurchaseOrderUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPurchaseOrderStatusFieldUpdateOperationsInput | $Enums.PurchaseOrderStatus;
    origin?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    poNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expectedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentVia?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.PurchaseOrderLineUncheckedUpdateManyWithoutPurchaseOrderNestedInput;
    lots?: Prisma.StockLotUncheckedUpdateManyWithoutPurchaseOrderNestedInput;
};
export type PurchaseOrderCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    supplierId: string;
    status?: $Enums.PurchaseOrderStatus;
    origin?: string;
    createdBy?: string | null;
    poNumber?: string | null;
    expectedAt?: Date | string | null;
    notes?: string | null;
    sentVia?: string | null;
    totalCost?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Date | string | null;
    createdAt?: Date | string;
};
export type PurchaseOrderUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPurchaseOrderStatusFieldUpdateOperationsInput | $Enums.PurchaseOrderStatus;
    origin?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    poNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expectedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentVia?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PurchaseOrderUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPurchaseOrderStatusFieldUpdateOperationsInput | $Enums.PurchaseOrderStatus;
    origin?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    poNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expectedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentVia?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PurchaseOrderListRelationFilter = {
    every?: Prisma.PurchaseOrderWhereInput;
    some?: Prisma.PurchaseOrderWhereInput;
    none?: Prisma.PurchaseOrderWhereInput;
};
export type PurchaseOrderOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PurchaseOrderOrgIdPoNumberCompoundUniqueInput = {
    orgId: string;
    poNumber: string;
};
export type PurchaseOrderCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    origin?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    poNumber?: Prisma.SortOrder;
    expectedAt?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    sentVia?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PurchaseOrderAvgOrderByAggregateInput = {
    totalCost?: Prisma.SortOrder;
};
export type PurchaseOrderMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    origin?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    poNumber?: Prisma.SortOrder;
    expectedAt?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    sentVia?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PurchaseOrderMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    origin?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    poNumber?: Prisma.SortOrder;
    expectedAt?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    sentVia?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PurchaseOrderSumOrderByAggregateInput = {
    totalCost?: Prisma.SortOrder;
};
export type PurchaseOrderScalarRelationFilter = {
    is?: Prisma.PurchaseOrderWhereInput;
    isNot?: Prisma.PurchaseOrderWhereInput;
};
export type PurchaseOrderNullableScalarRelationFilter = {
    is?: Prisma.PurchaseOrderWhereInput | null;
    isNot?: Prisma.PurchaseOrderWhereInput | null;
};
export type PurchaseOrderCreateNestedManyWithoutSupplierInput = {
    create?: Prisma.XOR<Prisma.PurchaseOrderCreateWithoutSupplierInput, Prisma.PurchaseOrderUncheckedCreateWithoutSupplierInput> | Prisma.PurchaseOrderCreateWithoutSupplierInput[] | Prisma.PurchaseOrderUncheckedCreateWithoutSupplierInput[];
    connectOrCreate?: Prisma.PurchaseOrderCreateOrConnectWithoutSupplierInput | Prisma.PurchaseOrderCreateOrConnectWithoutSupplierInput[];
    createMany?: Prisma.PurchaseOrderCreateManySupplierInputEnvelope;
    connect?: Prisma.PurchaseOrderWhereUniqueInput | Prisma.PurchaseOrderWhereUniqueInput[];
};
export type PurchaseOrderUncheckedCreateNestedManyWithoutSupplierInput = {
    create?: Prisma.XOR<Prisma.PurchaseOrderCreateWithoutSupplierInput, Prisma.PurchaseOrderUncheckedCreateWithoutSupplierInput> | Prisma.PurchaseOrderCreateWithoutSupplierInput[] | Prisma.PurchaseOrderUncheckedCreateWithoutSupplierInput[];
    connectOrCreate?: Prisma.PurchaseOrderCreateOrConnectWithoutSupplierInput | Prisma.PurchaseOrderCreateOrConnectWithoutSupplierInput[];
    createMany?: Prisma.PurchaseOrderCreateManySupplierInputEnvelope;
    connect?: Prisma.PurchaseOrderWhereUniqueInput | Prisma.PurchaseOrderWhereUniqueInput[];
};
export type PurchaseOrderUpdateManyWithoutSupplierNestedInput = {
    create?: Prisma.XOR<Prisma.PurchaseOrderCreateWithoutSupplierInput, Prisma.PurchaseOrderUncheckedCreateWithoutSupplierInput> | Prisma.PurchaseOrderCreateWithoutSupplierInput[] | Prisma.PurchaseOrderUncheckedCreateWithoutSupplierInput[];
    connectOrCreate?: Prisma.PurchaseOrderCreateOrConnectWithoutSupplierInput | Prisma.PurchaseOrderCreateOrConnectWithoutSupplierInput[];
    upsert?: Prisma.PurchaseOrderUpsertWithWhereUniqueWithoutSupplierInput | Prisma.PurchaseOrderUpsertWithWhereUniqueWithoutSupplierInput[];
    createMany?: Prisma.PurchaseOrderCreateManySupplierInputEnvelope;
    set?: Prisma.PurchaseOrderWhereUniqueInput | Prisma.PurchaseOrderWhereUniqueInput[];
    disconnect?: Prisma.PurchaseOrderWhereUniqueInput | Prisma.PurchaseOrderWhereUniqueInput[];
    delete?: Prisma.PurchaseOrderWhereUniqueInput | Prisma.PurchaseOrderWhereUniqueInput[];
    connect?: Prisma.PurchaseOrderWhereUniqueInput | Prisma.PurchaseOrderWhereUniqueInput[];
    update?: Prisma.PurchaseOrderUpdateWithWhereUniqueWithoutSupplierInput | Prisma.PurchaseOrderUpdateWithWhereUniqueWithoutSupplierInput[];
    updateMany?: Prisma.PurchaseOrderUpdateManyWithWhereWithoutSupplierInput | Prisma.PurchaseOrderUpdateManyWithWhereWithoutSupplierInput[];
    deleteMany?: Prisma.PurchaseOrderScalarWhereInput | Prisma.PurchaseOrderScalarWhereInput[];
};
export type PurchaseOrderUncheckedUpdateManyWithoutSupplierNestedInput = {
    create?: Prisma.XOR<Prisma.PurchaseOrderCreateWithoutSupplierInput, Prisma.PurchaseOrderUncheckedCreateWithoutSupplierInput> | Prisma.PurchaseOrderCreateWithoutSupplierInput[] | Prisma.PurchaseOrderUncheckedCreateWithoutSupplierInput[];
    connectOrCreate?: Prisma.PurchaseOrderCreateOrConnectWithoutSupplierInput | Prisma.PurchaseOrderCreateOrConnectWithoutSupplierInput[];
    upsert?: Prisma.PurchaseOrderUpsertWithWhereUniqueWithoutSupplierInput | Prisma.PurchaseOrderUpsertWithWhereUniqueWithoutSupplierInput[];
    createMany?: Prisma.PurchaseOrderCreateManySupplierInputEnvelope;
    set?: Prisma.PurchaseOrderWhereUniqueInput | Prisma.PurchaseOrderWhereUniqueInput[];
    disconnect?: Prisma.PurchaseOrderWhereUniqueInput | Prisma.PurchaseOrderWhereUniqueInput[];
    delete?: Prisma.PurchaseOrderWhereUniqueInput | Prisma.PurchaseOrderWhereUniqueInput[];
    connect?: Prisma.PurchaseOrderWhereUniqueInput | Prisma.PurchaseOrderWhereUniqueInput[];
    update?: Prisma.PurchaseOrderUpdateWithWhereUniqueWithoutSupplierInput | Prisma.PurchaseOrderUpdateWithWhereUniqueWithoutSupplierInput[];
    updateMany?: Prisma.PurchaseOrderUpdateManyWithWhereWithoutSupplierInput | Prisma.PurchaseOrderUpdateManyWithWhereWithoutSupplierInput[];
    deleteMany?: Prisma.PurchaseOrderScalarWhereInput | Prisma.PurchaseOrderScalarWhereInput[];
};
export type EnumPurchaseOrderStatusFieldUpdateOperationsInput = {
    set?: $Enums.PurchaseOrderStatus;
};
export type PurchaseOrderCreateNestedOneWithoutLinesInput = {
    create?: Prisma.XOR<Prisma.PurchaseOrderCreateWithoutLinesInput, Prisma.PurchaseOrderUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.PurchaseOrderCreateOrConnectWithoutLinesInput;
    connect?: Prisma.PurchaseOrderWhereUniqueInput;
};
export type PurchaseOrderUpdateOneRequiredWithoutLinesNestedInput = {
    create?: Prisma.XOR<Prisma.PurchaseOrderCreateWithoutLinesInput, Prisma.PurchaseOrderUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.PurchaseOrderCreateOrConnectWithoutLinesInput;
    upsert?: Prisma.PurchaseOrderUpsertWithoutLinesInput;
    connect?: Prisma.PurchaseOrderWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PurchaseOrderUpdateToOneWithWhereWithoutLinesInput, Prisma.PurchaseOrderUpdateWithoutLinesInput>, Prisma.PurchaseOrderUncheckedUpdateWithoutLinesInput>;
};
export type PurchaseOrderCreateNestedOneWithoutLotsInput = {
    create?: Prisma.XOR<Prisma.PurchaseOrderCreateWithoutLotsInput, Prisma.PurchaseOrderUncheckedCreateWithoutLotsInput>;
    connectOrCreate?: Prisma.PurchaseOrderCreateOrConnectWithoutLotsInput;
    connect?: Prisma.PurchaseOrderWhereUniqueInput;
};
export type PurchaseOrderUpdateOneWithoutLotsNestedInput = {
    create?: Prisma.XOR<Prisma.PurchaseOrderCreateWithoutLotsInput, Prisma.PurchaseOrderUncheckedCreateWithoutLotsInput>;
    connectOrCreate?: Prisma.PurchaseOrderCreateOrConnectWithoutLotsInput;
    upsert?: Prisma.PurchaseOrderUpsertWithoutLotsInput;
    disconnect?: Prisma.PurchaseOrderWhereInput | boolean;
    delete?: Prisma.PurchaseOrderWhereInput | boolean;
    connect?: Prisma.PurchaseOrderWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PurchaseOrderUpdateToOneWithWhereWithoutLotsInput, Prisma.PurchaseOrderUpdateWithoutLotsInput>, Prisma.PurchaseOrderUncheckedUpdateWithoutLotsInput>;
};
export type PurchaseOrderCreateWithoutSupplierInput = {
    id?: string;
    orgId: string;
    branchId: string;
    status?: $Enums.PurchaseOrderStatus;
    origin?: string;
    createdBy?: string | null;
    poNumber?: string | null;
    expectedAt?: Date | string | null;
    notes?: string | null;
    sentVia?: string | null;
    totalCost?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Date | string | null;
    createdAt?: Date | string;
    lines?: Prisma.PurchaseOrderLineCreateNestedManyWithoutPurchaseOrderInput;
    lots?: Prisma.StockLotCreateNestedManyWithoutPurchaseOrderInput;
};
export type PurchaseOrderUncheckedCreateWithoutSupplierInput = {
    id?: string;
    orgId: string;
    branchId: string;
    status?: $Enums.PurchaseOrderStatus;
    origin?: string;
    createdBy?: string | null;
    poNumber?: string | null;
    expectedAt?: Date | string | null;
    notes?: string | null;
    sentVia?: string | null;
    totalCost?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Date | string | null;
    createdAt?: Date | string;
    lines?: Prisma.PurchaseOrderLineUncheckedCreateNestedManyWithoutPurchaseOrderInput;
    lots?: Prisma.StockLotUncheckedCreateNestedManyWithoutPurchaseOrderInput;
};
export type PurchaseOrderCreateOrConnectWithoutSupplierInput = {
    where: Prisma.PurchaseOrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.PurchaseOrderCreateWithoutSupplierInput, Prisma.PurchaseOrderUncheckedCreateWithoutSupplierInput>;
};
export type PurchaseOrderCreateManySupplierInputEnvelope = {
    data: Prisma.PurchaseOrderCreateManySupplierInput | Prisma.PurchaseOrderCreateManySupplierInput[];
    skipDuplicates?: boolean;
};
export type PurchaseOrderUpsertWithWhereUniqueWithoutSupplierInput = {
    where: Prisma.PurchaseOrderWhereUniqueInput;
    update: Prisma.XOR<Prisma.PurchaseOrderUpdateWithoutSupplierInput, Prisma.PurchaseOrderUncheckedUpdateWithoutSupplierInput>;
    create: Prisma.XOR<Prisma.PurchaseOrderCreateWithoutSupplierInput, Prisma.PurchaseOrderUncheckedCreateWithoutSupplierInput>;
};
export type PurchaseOrderUpdateWithWhereUniqueWithoutSupplierInput = {
    where: Prisma.PurchaseOrderWhereUniqueInput;
    data: Prisma.XOR<Prisma.PurchaseOrderUpdateWithoutSupplierInput, Prisma.PurchaseOrderUncheckedUpdateWithoutSupplierInput>;
};
export type PurchaseOrderUpdateManyWithWhereWithoutSupplierInput = {
    where: Prisma.PurchaseOrderScalarWhereInput;
    data: Prisma.XOR<Prisma.PurchaseOrderUpdateManyMutationInput, Prisma.PurchaseOrderUncheckedUpdateManyWithoutSupplierInput>;
};
export type PurchaseOrderScalarWhereInput = {
    AND?: Prisma.PurchaseOrderScalarWhereInput | Prisma.PurchaseOrderScalarWhereInput[];
    OR?: Prisma.PurchaseOrderScalarWhereInput[];
    NOT?: Prisma.PurchaseOrderScalarWhereInput | Prisma.PurchaseOrderScalarWhereInput[];
    id?: Prisma.StringFilter<"PurchaseOrder"> | string;
    orgId?: Prisma.StringFilter<"PurchaseOrder"> | string;
    branchId?: Prisma.StringFilter<"PurchaseOrder"> | string;
    supplierId?: Prisma.StringFilter<"PurchaseOrder"> | string;
    status?: Prisma.EnumPurchaseOrderStatusFilter<"PurchaseOrder"> | $Enums.PurchaseOrderStatus;
    origin?: Prisma.StringFilter<"PurchaseOrder"> | string;
    createdBy?: Prisma.StringNullableFilter<"PurchaseOrder"> | string | null;
    poNumber?: Prisma.StringNullableFilter<"PurchaseOrder"> | string | null;
    expectedAt?: Prisma.DateTimeNullableFilter<"PurchaseOrder"> | Date | string | null;
    notes?: Prisma.StringNullableFilter<"PurchaseOrder"> | string | null;
    sentVia?: Prisma.StringNullableFilter<"PurchaseOrder"> | string | null;
    totalCost?: Prisma.DecimalFilter<"PurchaseOrder"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Prisma.DateTimeNullableFilter<"PurchaseOrder"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"PurchaseOrder"> | Date | string;
};
export type PurchaseOrderCreateWithoutLinesInput = {
    id?: string;
    orgId: string;
    branchId: string;
    status?: $Enums.PurchaseOrderStatus;
    origin?: string;
    createdBy?: string | null;
    poNumber?: string | null;
    expectedAt?: Date | string | null;
    notes?: string | null;
    sentVia?: string | null;
    totalCost?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Date | string | null;
    createdAt?: Date | string;
    supplier: Prisma.SupplierCreateNestedOneWithoutPurchaseOrdersInput;
    lots?: Prisma.StockLotCreateNestedManyWithoutPurchaseOrderInput;
};
export type PurchaseOrderUncheckedCreateWithoutLinesInput = {
    id?: string;
    orgId: string;
    branchId: string;
    supplierId: string;
    status?: $Enums.PurchaseOrderStatus;
    origin?: string;
    createdBy?: string | null;
    poNumber?: string | null;
    expectedAt?: Date | string | null;
    notes?: string | null;
    sentVia?: string | null;
    totalCost?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Date | string | null;
    createdAt?: Date | string;
    lots?: Prisma.StockLotUncheckedCreateNestedManyWithoutPurchaseOrderInput;
};
export type PurchaseOrderCreateOrConnectWithoutLinesInput = {
    where: Prisma.PurchaseOrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.PurchaseOrderCreateWithoutLinesInput, Prisma.PurchaseOrderUncheckedCreateWithoutLinesInput>;
};
export type PurchaseOrderUpsertWithoutLinesInput = {
    update: Prisma.XOR<Prisma.PurchaseOrderUpdateWithoutLinesInput, Prisma.PurchaseOrderUncheckedUpdateWithoutLinesInput>;
    create: Prisma.XOR<Prisma.PurchaseOrderCreateWithoutLinesInput, Prisma.PurchaseOrderUncheckedCreateWithoutLinesInput>;
    where?: Prisma.PurchaseOrderWhereInput;
};
export type PurchaseOrderUpdateToOneWithWhereWithoutLinesInput = {
    where?: Prisma.PurchaseOrderWhereInput;
    data: Prisma.XOR<Prisma.PurchaseOrderUpdateWithoutLinesInput, Prisma.PurchaseOrderUncheckedUpdateWithoutLinesInput>;
};
export type PurchaseOrderUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPurchaseOrderStatusFieldUpdateOperationsInput | $Enums.PurchaseOrderStatus;
    origin?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    poNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expectedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentVia?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    supplier?: Prisma.SupplierUpdateOneRequiredWithoutPurchaseOrdersNestedInput;
    lots?: Prisma.StockLotUpdateManyWithoutPurchaseOrderNestedInput;
};
export type PurchaseOrderUncheckedUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPurchaseOrderStatusFieldUpdateOperationsInput | $Enums.PurchaseOrderStatus;
    origin?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    poNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expectedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentVia?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lots?: Prisma.StockLotUncheckedUpdateManyWithoutPurchaseOrderNestedInput;
};
export type PurchaseOrderCreateWithoutLotsInput = {
    id?: string;
    orgId: string;
    branchId: string;
    status?: $Enums.PurchaseOrderStatus;
    origin?: string;
    createdBy?: string | null;
    poNumber?: string | null;
    expectedAt?: Date | string | null;
    notes?: string | null;
    sentVia?: string | null;
    totalCost?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Date | string | null;
    createdAt?: Date | string;
    supplier: Prisma.SupplierCreateNestedOneWithoutPurchaseOrdersInput;
    lines?: Prisma.PurchaseOrderLineCreateNestedManyWithoutPurchaseOrderInput;
};
export type PurchaseOrderUncheckedCreateWithoutLotsInput = {
    id?: string;
    orgId: string;
    branchId: string;
    supplierId: string;
    status?: $Enums.PurchaseOrderStatus;
    origin?: string;
    createdBy?: string | null;
    poNumber?: string | null;
    expectedAt?: Date | string | null;
    notes?: string | null;
    sentVia?: string | null;
    totalCost?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Date | string | null;
    createdAt?: Date | string;
    lines?: Prisma.PurchaseOrderLineUncheckedCreateNestedManyWithoutPurchaseOrderInput;
};
export type PurchaseOrderCreateOrConnectWithoutLotsInput = {
    where: Prisma.PurchaseOrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.PurchaseOrderCreateWithoutLotsInput, Prisma.PurchaseOrderUncheckedCreateWithoutLotsInput>;
};
export type PurchaseOrderUpsertWithoutLotsInput = {
    update: Prisma.XOR<Prisma.PurchaseOrderUpdateWithoutLotsInput, Prisma.PurchaseOrderUncheckedUpdateWithoutLotsInput>;
    create: Prisma.XOR<Prisma.PurchaseOrderCreateWithoutLotsInput, Prisma.PurchaseOrderUncheckedCreateWithoutLotsInput>;
    where?: Prisma.PurchaseOrderWhereInput;
};
export type PurchaseOrderUpdateToOneWithWhereWithoutLotsInput = {
    where?: Prisma.PurchaseOrderWhereInput;
    data: Prisma.XOR<Prisma.PurchaseOrderUpdateWithoutLotsInput, Prisma.PurchaseOrderUncheckedUpdateWithoutLotsInput>;
};
export type PurchaseOrderUpdateWithoutLotsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPurchaseOrderStatusFieldUpdateOperationsInput | $Enums.PurchaseOrderStatus;
    origin?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    poNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expectedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentVia?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    supplier?: Prisma.SupplierUpdateOneRequiredWithoutPurchaseOrdersNestedInput;
    lines?: Prisma.PurchaseOrderLineUpdateManyWithoutPurchaseOrderNestedInput;
};
export type PurchaseOrderUncheckedUpdateWithoutLotsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPurchaseOrderStatusFieldUpdateOperationsInput | $Enums.PurchaseOrderStatus;
    origin?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    poNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expectedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentVia?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.PurchaseOrderLineUncheckedUpdateManyWithoutPurchaseOrderNestedInput;
};
export type PurchaseOrderCreateManySupplierInput = {
    id?: string;
    orgId: string;
    branchId: string;
    status?: $Enums.PurchaseOrderStatus;
    origin?: string;
    createdBy?: string | null;
    poNumber?: string | null;
    expectedAt?: Date | string | null;
    notes?: string | null;
    sentVia?: string | null;
    totalCost?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Date | string | null;
    createdAt?: Date | string;
};
export type PurchaseOrderUpdateWithoutSupplierInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPurchaseOrderStatusFieldUpdateOperationsInput | $Enums.PurchaseOrderStatus;
    origin?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    poNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expectedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentVia?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.PurchaseOrderLineUpdateManyWithoutPurchaseOrderNestedInput;
    lots?: Prisma.StockLotUpdateManyWithoutPurchaseOrderNestedInput;
};
export type PurchaseOrderUncheckedUpdateWithoutSupplierInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPurchaseOrderStatusFieldUpdateOperationsInput | $Enums.PurchaseOrderStatus;
    origin?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    poNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expectedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentVia?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.PurchaseOrderLineUncheckedUpdateManyWithoutPurchaseOrderNestedInput;
    lots?: Prisma.StockLotUncheckedUpdateManyWithoutPurchaseOrderNestedInput;
};
export type PurchaseOrderUncheckedUpdateManyWithoutSupplierInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPurchaseOrderStatusFieldUpdateOperationsInput | $Enums.PurchaseOrderStatus;
    origin?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    poNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expectedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentVia?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PurchaseOrderCountOutputType = {
    lines: number;
    lots: number;
};
export type PurchaseOrderCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | PurchaseOrderCountOutputTypeCountLinesArgs;
    lots?: boolean | PurchaseOrderCountOutputTypeCountLotsArgs;
};
export type PurchaseOrderCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderCountOutputTypeSelect<ExtArgs> | null;
};
export type PurchaseOrderCountOutputTypeCountLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PurchaseOrderLineWhereInput;
};
export type PurchaseOrderCountOutputTypeCountLotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockLotWhereInput;
};
export type PurchaseOrderSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    supplierId?: boolean;
    status?: boolean;
    origin?: boolean;
    createdBy?: boolean;
    poNumber?: boolean;
    expectedAt?: boolean;
    notes?: boolean;
    sentVia?: boolean;
    totalCost?: boolean;
    sentAt?: boolean;
    createdAt?: boolean;
    supplier?: boolean | Prisma.SupplierDefaultArgs<ExtArgs>;
    lines?: boolean | Prisma.PurchaseOrder$linesArgs<ExtArgs>;
    lots?: boolean | Prisma.PurchaseOrder$lotsArgs<ExtArgs>;
    _count?: boolean | Prisma.PurchaseOrderCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["purchaseOrder"]>;
export type PurchaseOrderSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    supplierId?: boolean;
    status?: boolean;
    origin?: boolean;
    createdBy?: boolean;
    poNumber?: boolean;
    expectedAt?: boolean;
    notes?: boolean;
    sentVia?: boolean;
    totalCost?: boolean;
    sentAt?: boolean;
    createdAt?: boolean;
    supplier?: boolean | Prisma.SupplierDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["purchaseOrder"]>;
export type PurchaseOrderSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    supplierId?: boolean;
    status?: boolean;
    origin?: boolean;
    createdBy?: boolean;
    poNumber?: boolean;
    expectedAt?: boolean;
    notes?: boolean;
    sentVia?: boolean;
    totalCost?: boolean;
    sentAt?: boolean;
    createdAt?: boolean;
    supplier?: boolean | Prisma.SupplierDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["purchaseOrder"]>;
export type PurchaseOrderSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    supplierId?: boolean;
    status?: boolean;
    origin?: boolean;
    createdBy?: boolean;
    poNumber?: boolean;
    expectedAt?: boolean;
    notes?: boolean;
    sentVia?: boolean;
    totalCost?: boolean;
    sentAt?: boolean;
    createdAt?: boolean;
};
export type PurchaseOrderOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "supplierId" | "status" | "origin" | "createdBy" | "poNumber" | "expectedAt" | "notes" | "sentVia" | "totalCost" | "sentAt" | "createdAt", ExtArgs["result"]["purchaseOrder"]>;
export type PurchaseOrderInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supplier?: boolean | Prisma.SupplierDefaultArgs<ExtArgs>;
    lines?: boolean | Prisma.PurchaseOrder$linesArgs<ExtArgs>;
    lots?: boolean | Prisma.PurchaseOrder$lotsArgs<ExtArgs>;
    _count?: boolean | Prisma.PurchaseOrderCountOutputTypeDefaultArgs<ExtArgs>;
};
export type PurchaseOrderIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supplier?: boolean | Prisma.SupplierDefaultArgs<ExtArgs>;
};
export type PurchaseOrderIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supplier?: boolean | Prisma.SupplierDefaultArgs<ExtArgs>;
};
export type $PurchaseOrderPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PurchaseOrder";
    objects: {
        supplier: Prisma.$SupplierPayload<ExtArgs>;
        lines: Prisma.$PurchaseOrderLinePayload<ExtArgs>[];
        lots: Prisma.$StockLotPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        supplierId: string;
        status: $Enums.PurchaseOrderStatus;
        origin: string;
        createdBy: string | null;
        poNumber: string | null;
        expectedAt: Date | null;
        notes: string | null;
        sentVia: string | null;
        totalCost: runtime.Decimal;
        sentAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["purchaseOrder"]>;
    composites: {};
};
export type PurchaseOrderGetPayload<S extends boolean | null | undefined | PurchaseOrderDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PurchaseOrderPayload, S>;
export type PurchaseOrderCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PurchaseOrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PurchaseOrderCountAggregateInputType | true;
};
export interface PurchaseOrderDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PurchaseOrder'];
        meta: {
            name: 'PurchaseOrder';
        };
    };
    findUnique<T extends PurchaseOrderFindUniqueArgs>(args: Prisma.SelectSubset<T, PurchaseOrderFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PurchaseOrderClient<runtime.Types.Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PurchaseOrderFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PurchaseOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PurchaseOrderClient<runtime.Types.Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PurchaseOrderFindFirstArgs>(args?: Prisma.SelectSubset<T, PurchaseOrderFindFirstArgs<ExtArgs>>): Prisma.Prisma__PurchaseOrderClient<runtime.Types.Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PurchaseOrderFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PurchaseOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PurchaseOrderClient<runtime.Types.Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PurchaseOrderFindManyArgs>(args?: Prisma.SelectSubset<T, PurchaseOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PurchaseOrderCreateArgs>(args: Prisma.SelectSubset<T, PurchaseOrderCreateArgs<ExtArgs>>): Prisma.Prisma__PurchaseOrderClient<runtime.Types.Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PurchaseOrderCreateManyArgs>(args?: Prisma.SelectSubset<T, PurchaseOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PurchaseOrderCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PurchaseOrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PurchaseOrderDeleteArgs>(args: Prisma.SelectSubset<T, PurchaseOrderDeleteArgs<ExtArgs>>): Prisma.Prisma__PurchaseOrderClient<runtime.Types.Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PurchaseOrderUpdateArgs>(args: Prisma.SelectSubset<T, PurchaseOrderUpdateArgs<ExtArgs>>): Prisma.Prisma__PurchaseOrderClient<runtime.Types.Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PurchaseOrderDeleteManyArgs>(args?: Prisma.SelectSubset<T, PurchaseOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PurchaseOrderUpdateManyArgs>(args: Prisma.SelectSubset<T, PurchaseOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PurchaseOrderUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PurchaseOrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PurchaseOrderUpsertArgs>(args: Prisma.SelectSubset<T, PurchaseOrderUpsertArgs<ExtArgs>>): Prisma.Prisma__PurchaseOrderClient<runtime.Types.Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PurchaseOrderCountArgs>(args?: Prisma.Subset<T, PurchaseOrderCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PurchaseOrderCountAggregateOutputType> : number>;
    aggregate<T extends PurchaseOrderAggregateArgs>(args: Prisma.Subset<T, PurchaseOrderAggregateArgs>): Prisma.PrismaPromise<GetPurchaseOrderAggregateType<T>>;
    groupBy<T extends PurchaseOrderGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PurchaseOrderGroupByArgs['orderBy'];
    } : {
        orderBy?: PurchaseOrderGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PurchaseOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchaseOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PurchaseOrderFieldRefs;
}
export interface Prisma__PurchaseOrderClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    supplier<T extends Prisma.SupplierDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SupplierDefaultArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    lines<T extends Prisma.PurchaseOrder$linesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PurchaseOrder$linesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PurchaseOrderLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    lots<T extends Prisma.PurchaseOrder$lotsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PurchaseOrder$lotsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockLotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PurchaseOrderFieldRefs {
    readonly id: Prisma.FieldRef<"PurchaseOrder", 'String'>;
    readonly orgId: Prisma.FieldRef<"PurchaseOrder", 'String'>;
    readonly branchId: Prisma.FieldRef<"PurchaseOrder", 'String'>;
    readonly supplierId: Prisma.FieldRef<"PurchaseOrder", 'String'>;
    readonly status: Prisma.FieldRef<"PurchaseOrder", 'PurchaseOrderStatus'>;
    readonly origin: Prisma.FieldRef<"PurchaseOrder", 'String'>;
    readonly createdBy: Prisma.FieldRef<"PurchaseOrder", 'String'>;
    readonly poNumber: Prisma.FieldRef<"PurchaseOrder", 'String'>;
    readonly expectedAt: Prisma.FieldRef<"PurchaseOrder", 'DateTime'>;
    readonly notes: Prisma.FieldRef<"PurchaseOrder", 'String'>;
    readonly sentVia: Prisma.FieldRef<"PurchaseOrder", 'String'>;
    readonly totalCost: Prisma.FieldRef<"PurchaseOrder", 'Decimal'>;
    readonly sentAt: Prisma.FieldRef<"PurchaseOrder", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"PurchaseOrder", 'DateTime'>;
}
export type PurchaseOrderFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderOmit<ExtArgs> | null;
    include?: Prisma.PurchaseOrderInclude<ExtArgs> | null;
    where: Prisma.PurchaseOrderWhereUniqueInput;
};
export type PurchaseOrderFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderOmit<ExtArgs> | null;
    include?: Prisma.PurchaseOrderInclude<ExtArgs> | null;
    where: Prisma.PurchaseOrderWhereUniqueInput;
};
export type PurchaseOrderFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderOmit<ExtArgs> | null;
    include?: Prisma.PurchaseOrderInclude<ExtArgs> | null;
    where?: Prisma.PurchaseOrderWhereInput;
    orderBy?: Prisma.PurchaseOrderOrderByWithRelationInput | Prisma.PurchaseOrderOrderByWithRelationInput[];
    cursor?: Prisma.PurchaseOrderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PurchaseOrderScalarFieldEnum | Prisma.PurchaseOrderScalarFieldEnum[];
};
export type PurchaseOrderFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderOmit<ExtArgs> | null;
    include?: Prisma.PurchaseOrderInclude<ExtArgs> | null;
    where?: Prisma.PurchaseOrderWhereInput;
    orderBy?: Prisma.PurchaseOrderOrderByWithRelationInput | Prisma.PurchaseOrderOrderByWithRelationInput[];
    cursor?: Prisma.PurchaseOrderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PurchaseOrderScalarFieldEnum | Prisma.PurchaseOrderScalarFieldEnum[];
};
export type PurchaseOrderFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderOmit<ExtArgs> | null;
    include?: Prisma.PurchaseOrderInclude<ExtArgs> | null;
    where?: Prisma.PurchaseOrderWhereInput;
    orderBy?: Prisma.PurchaseOrderOrderByWithRelationInput | Prisma.PurchaseOrderOrderByWithRelationInput[];
    cursor?: Prisma.PurchaseOrderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PurchaseOrderScalarFieldEnum | Prisma.PurchaseOrderScalarFieldEnum[];
};
export type PurchaseOrderCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderOmit<ExtArgs> | null;
    include?: Prisma.PurchaseOrderInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PurchaseOrderCreateInput, Prisma.PurchaseOrderUncheckedCreateInput>;
};
export type PurchaseOrderCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PurchaseOrderCreateManyInput | Prisma.PurchaseOrderCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PurchaseOrderCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderOmit<ExtArgs> | null;
    data: Prisma.PurchaseOrderCreateManyInput | Prisma.PurchaseOrderCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PurchaseOrderIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PurchaseOrderUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderOmit<ExtArgs> | null;
    include?: Prisma.PurchaseOrderInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PurchaseOrderUpdateInput, Prisma.PurchaseOrderUncheckedUpdateInput>;
    where: Prisma.PurchaseOrderWhereUniqueInput;
};
export type PurchaseOrderUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PurchaseOrderUpdateManyMutationInput, Prisma.PurchaseOrderUncheckedUpdateManyInput>;
    where?: Prisma.PurchaseOrderWhereInput;
    limit?: number;
};
export type PurchaseOrderUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PurchaseOrderUpdateManyMutationInput, Prisma.PurchaseOrderUncheckedUpdateManyInput>;
    where?: Prisma.PurchaseOrderWhereInput;
    limit?: number;
    include?: Prisma.PurchaseOrderIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PurchaseOrderUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderOmit<ExtArgs> | null;
    include?: Prisma.PurchaseOrderInclude<ExtArgs> | null;
    where: Prisma.PurchaseOrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.PurchaseOrderCreateInput, Prisma.PurchaseOrderUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PurchaseOrderUpdateInput, Prisma.PurchaseOrderUncheckedUpdateInput>;
};
export type PurchaseOrderDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderOmit<ExtArgs> | null;
    include?: Prisma.PurchaseOrderInclude<ExtArgs> | null;
    where: Prisma.PurchaseOrderWhereUniqueInput;
};
export type PurchaseOrderDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PurchaseOrderWhereInput;
    limit?: number;
};
export type PurchaseOrder$linesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderLineSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderLineOmit<ExtArgs> | null;
    include?: Prisma.PurchaseOrderLineInclude<ExtArgs> | null;
    where?: Prisma.PurchaseOrderLineWhereInput;
    orderBy?: Prisma.PurchaseOrderLineOrderByWithRelationInput | Prisma.PurchaseOrderLineOrderByWithRelationInput[];
    cursor?: Prisma.PurchaseOrderLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PurchaseOrderLineScalarFieldEnum | Prisma.PurchaseOrderLineScalarFieldEnum[];
};
export type PurchaseOrder$lotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockLotSelect<ExtArgs> | null;
    omit?: Prisma.StockLotOmit<ExtArgs> | null;
    include?: Prisma.StockLotInclude<ExtArgs> | null;
    where?: Prisma.StockLotWhereInput;
    orderBy?: Prisma.StockLotOrderByWithRelationInput | Prisma.StockLotOrderByWithRelationInput[];
    cursor?: Prisma.StockLotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockLotScalarFieldEnum | Prisma.StockLotScalarFieldEnum[];
};
export type PurchaseOrderDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderOmit<ExtArgs> | null;
    include?: Prisma.PurchaseOrderInclude<ExtArgs> | null;
};
