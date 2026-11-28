import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type StockMovementModel = runtime.Types.Result.DefaultSelection<Prisma.$StockMovementPayload>;
export type AggregateStockMovement = {
    _count: StockMovementCountAggregateOutputType | null;
    _avg: StockMovementAvgAggregateOutputType | null;
    _sum: StockMovementSumAggregateOutputType | null;
    _min: StockMovementMinAggregateOutputType | null;
    _max: StockMovementMaxAggregateOutputType | null;
};
export type StockMovementAvgAggregateOutputType = {
    qtyDelta: number | null;
};
export type StockMovementSumAggregateOutputType = {
    qtyDelta: number | null;
};
export type StockMovementMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    lotId: string | null;
    type: $Enums.StockMovementType | null;
    qtyDelta: number | null;
    reason: string | null;
    refType: string | null;
    refId: string | null;
    reasonCode: string | null;
    managerApprovalBy: string | null;
    performedBy: string | null;
    occurredAt: Date | null;
};
export type StockMovementMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    lotId: string | null;
    type: $Enums.StockMovementType | null;
    qtyDelta: number | null;
    reason: string | null;
    refType: string | null;
    refId: string | null;
    reasonCode: string | null;
    managerApprovalBy: string | null;
    performedBy: string | null;
    occurredAt: Date | null;
};
export type StockMovementCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    lotId: number;
    type: number;
    qtyDelta: number;
    reason: number;
    refType: number;
    refId: number;
    reasonCode: number;
    managerApprovalBy: number;
    performedBy: number;
    occurredAt: number;
    _all: number;
};
export type StockMovementAvgAggregateInputType = {
    qtyDelta?: true;
};
export type StockMovementSumAggregateInputType = {
    qtyDelta?: true;
};
export type StockMovementMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    lotId?: true;
    type?: true;
    qtyDelta?: true;
    reason?: true;
    refType?: true;
    refId?: true;
    reasonCode?: true;
    managerApprovalBy?: true;
    performedBy?: true;
    occurredAt?: true;
};
export type StockMovementMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    lotId?: true;
    type?: true;
    qtyDelta?: true;
    reason?: true;
    refType?: true;
    refId?: true;
    reasonCode?: true;
    managerApprovalBy?: true;
    performedBy?: true;
    occurredAt?: true;
};
export type StockMovementCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    lotId?: true;
    type?: true;
    qtyDelta?: true;
    reason?: true;
    refType?: true;
    refId?: true;
    reasonCode?: true;
    managerApprovalBy?: true;
    performedBy?: true;
    occurredAt?: true;
    _all?: true;
};
export type StockMovementAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockMovementWhereInput;
    orderBy?: Prisma.StockMovementOrderByWithRelationInput | Prisma.StockMovementOrderByWithRelationInput[];
    cursor?: Prisma.StockMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StockMovementCountAggregateInputType;
    _avg?: StockMovementAvgAggregateInputType;
    _sum?: StockMovementSumAggregateInputType;
    _min?: StockMovementMinAggregateInputType;
    _max?: StockMovementMaxAggregateInputType;
};
export type GetStockMovementAggregateType<T extends StockMovementAggregateArgs> = {
    [P in keyof T & keyof AggregateStockMovement]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStockMovement[P]> : Prisma.GetScalarType<T[P], AggregateStockMovement[P]>;
};
export type StockMovementGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockMovementWhereInput;
    orderBy?: Prisma.StockMovementOrderByWithAggregationInput | Prisma.StockMovementOrderByWithAggregationInput[];
    by: Prisma.StockMovementScalarFieldEnum[] | Prisma.StockMovementScalarFieldEnum;
    having?: Prisma.StockMovementScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StockMovementCountAggregateInputType | true;
    _avg?: StockMovementAvgAggregateInputType;
    _sum?: StockMovementSumAggregateInputType;
    _min?: StockMovementMinAggregateInputType;
    _max?: StockMovementMaxAggregateInputType;
};
export type StockMovementGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    lotId: string;
    type: $Enums.StockMovementType;
    qtyDelta: number;
    reason: string | null;
    refType: string | null;
    refId: string | null;
    reasonCode: string | null;
    managerApprovalBy: string | null;
    performedBy: string;
    occurredAt: Date;
    _count: StockMovementCountAggregateOutputType | null;
    _avg: StockMovementAvgAggregateOutputType | null;
    _sum: StockMovementSumAggregateOutputType | null;
    _min: StockMovementMinAggregateOutputType | null;
    _max: StockMovementMaxAggregateOutputType | null;
};
export type GetStockMovementGroupByPayload<T extends StockMovementGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StockMovementGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StockMovementGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StockMovementGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StockMovementGroupByOutputType[P]>;
}>>;
export type StockMovementWhereInput = {
    AND?: Prisma.StockMovementWhereInput | Prisma.StockMovementWhereInput[];
    OR?: Prisma.StockMovementWhereInput[];
    NOT?: Prisma.StockMovementWhereInput | Prisma.StockMovementWhereInput[];
    id?: Prisma.StringFilter<"StockMovement"> | string;
    orgId?: Prisma.StringFilter<"StockMovement"> | string;
    branchId?: Prisma.StringFilter<"StockMovement"> | string;
    lotId?: Prisma.StringFilter<"StockMovement"> | string;
    type?: Prisma.EnumStockMovementTypeFilter<"StockMovement"> | $Enums.StockMovementType;
    qtyDelta?: Prisma.IntFilter<"StockMovement"> | number;
    reason?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    refType?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    refId?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    reasonCode?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    managerApprovalBy?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    performedBy?: Prisma.StringFilter<"StockMovement"> | string;
    occurredAt?: Prisma.DateTimeFilter<"StockMovement"> | Date | string;
    lot?: Prisma.XOR<Prisma.StockLotScalarRelationFilter, Prisma.StockLotWhereInput>;
};
export type StockMovementOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    qtyDelta?: Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    refType?: Prisma.SortOrderInput | Prisma.SortOrder;
    refId?: Prisma.SortOrderInput | Prisma.SortOrder;
    reasonCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    managerApprovalBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    performedBy?: Prisma.SortOrder;
    occurredAt?: Prisma.SortOrder;
    lot?: Prisma.StockLotOrderByWithRelationInput;
};
export type StockMovementWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.StockMovementWhereInput | Prisma.StockMovementWhereInput[];
    OR?: Prisma.StockMovementWhereInput[];
    NOT?: Prisma.StockMovementWhereInput | Prisma.StockMovementWhereInput[];
    orgId?: Prisma.StringFilter<"StockMovement"> | string;
    branchId?: Prisma.StringFilter<"StockMovement"> | string;
    lotId?: Prisma.StringFilter<"StockMovement"> | string;
    type?: Prisma.EnumStockMovementTypeFilter<"StockMovement"> | $Enums.StockMovementType;
    qtyDelta?: Prisma.IntFilter<"StockMovement"> | number;
    reason?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    refType?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    refId?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    reasonCode?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    managerApprovalBy?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    performedBy?: Prisma.StringFilter<"StockMovement"> | string;
    occurredAt?: Prisma.DateTimeFilter<"StockMovement"> | Date | string;
    lot?: Prisma.XOR<Prisma.StockLotScalarRelationFilter, Prisma.StockLotWhereInput>;
}, "id">;
export type StockMovementOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    qtyDelta?: Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    refType?: Prisma.SortOrderInput | Prisma.SortOrder;
    refId?: Prisma.SortOrderInput | Prisma.SortOrder;
    reasonCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    managerApprovalBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    performedBy?: Prisma.SortOrder;
    occurredAt?: Prisma.SortOrder;
    _count?: Prisma.StockMovementCountOrderByAggregateInput;
    _avg?: Prisma.StockMovementAvgOrderByAggregateInput;
    _max?: Prisma.StockMovementMaxOrderByAggregateInput;
    _min?: Prisma.StockMovementMinOrderByAggregateInput;
    _sum?: Prisma.StockMovementSumOrderByAggregateInput;
};
export type StockMovementScalarWhereWithAggregatesInput = {
    AND?: Prisma.StockMovementScalarWhereWithAggregatesInput | Prisma.StockMovementScalarWhereWithAggregatesInput[];
    OR?: Prisma.StockMovementScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StockMovementScalarWhereWithAggregatesInput | Prisma.StockMovementScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"StockMovement"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"StockMovement"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"StockMovement"> | string;
    lotId?: Prisma.StringWithAggregatesFilter<"StockMovement"> | string;
    type?: Prisma.EnumStockMovementTypeWithAggregatesFilter<"StockMovement"> | $Enums.StockMovementType;
    qtyDelta?: Prisma.IntWithAggregatesFilter<"StockMovement"> | number;
    reason?: Prisma.StringNullableWithAggregatesFilter<"StockMovement"> | string | null;
    refType?: Prisma.StringNullableWithAggregatesFilter<"StockMovement"> | string | null;
    refId?: Prisma.StringNullableWithAggregatesFilter<"StockMovement"> | string | null;
    reasonCode?: Prisma.StringNullableWithAggregatesFilter<"StockMovement"> | string | null;
    managerApprovalBy?: Prisma.StringNullableWithAggregatesFilter<"StockMovement"> | string | null;
    performedBy?: Prisma.StringWithAggregatesFilter<"StockMovement"> | string;
    occurredAt?: Prisma.DateTimeWithAggregatesFilter<"StockMovement"> | Date | string;
};
export type StockMovementCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    type: $Enums.StockMovementType;
    qtyDelta: number;
    reason?: string | null;
    refType?: string | null;
    refId?: string | null;
    reasonCode?: string | null;
    managerApprovalBy?: string | null;
    performedBy: string;
    occurredAt?: Date | string;
    lot: Prisma.StockLotCreateNestedOneWithoutMovementsInput;
};
export type StockMovementUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    lotId: string;
    type: $Enums.StockMovementType;
    qtyDelta: number;
    reason?: string | null;
    refType?: string | null;
    refId?: string | null;
    reasonCode?: string | null;
    managerApprovalBy?: string | null;
    performedBy: string;
    occurredAt?: Date | string;
};
export type StockMovementUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumStockMovementTypeFieldUpdateOperationsInput | $Enums.StockMovementType;
    qtyDelta?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reasonCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    managerApprovalBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    performedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    occurredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lot?: Prisma.StockLotUpdateOneRequiredWithoutMovementsNestedInput;
};
export type StockMovementUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumStockMovementTypeFieldUpdateOperationsInput | $Enums.StockMovementType;
    qtyDelta?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reasonCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    managerApprovalBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    performedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    occurredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StockMovementCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    lotId: string;
    type: $Enums.StockMovementType;
    qtyDelta: number;
    reason?: string | null;
    refType?: string | null;
    refId?: string | null;
    reasonCode?: string | null;
    managerApprovalBy?: string | null;
    performedBy: string;
    occurredAt?: Date | string;
};
export type StockMovementUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumStockMovementTypeFieldUpdateOperationsInput | $Enums.StockMovementType;
    qtyDelta?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reasonCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    managerApprovalBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    performedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    occurredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StockMovementUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumStockMovementTypeFieldUpdateOperationsInput | $Enums.StockMovementType;
    qtyDelta?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reasonCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    managerApprovalBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    performedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    occurredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StockMovementListRelationFilter = {
    every?: Prisma.StockMovementWhereInput;
    some?: Prisma.StockMovementWhereInput;
    none?: Prisma.StockMovementWhereInput;
};
export type StockMovementOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StockMovementCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    qtyDelta?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    reasonCode?: Prisma.SortOrder;
    managerApprovalBy?: Prisma.SortOrder;
    performedBy?: Prisma.SortOrder;
    occurredAt?: Prisma.SortOrder;
};
export type StockMovementAvgOrderByAggregateInput = {
    qtyDelta?: Prisma.SortOrder;
};
export type StockMovementMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    qtyDelta?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    reasonCode?: Prisma.SortOrder;
    managerApprovalBy?: Prisma.SortOrder;
    performedBy?: Prisma.SortOrder;
    occurredAt?: Prisma.SortOrder;
};
export type StockMovementMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    qtyDelta?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    reasonCode?: Prisma.SortOrder;
    managerApprovalBy?: Prisma.SortOrder;
    performedBy?: Prisma.SortOrder;
    occurredAt?: Prisma.SortOrder;
};
export type StockMovementSumOrderByAggregateInput = {
    qtyDelta?: Prisma.SortOrder;
};
export type StockMovementCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.StockMovementCreateWithoutLotInput, Prisma.StockMovementUncheckedCreateWithoutLotInput> | Prisma.StockMovementCreateWithoutLotInput[] | Prisma.StockMovementUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.StockMovementCreateOrConnectWithoutLotInput | Prisma.StockMovementCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.StockMovementCreateManyLotInputEnvelope;
    connect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
};
export type StockMovementUncheckedCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.StockMovementCreateWithoutLotInput, Prisma.StockMovementUncheckedCreateWithoutLotInput> | Prisma.StockMovementCreateWithoutLotInput[] | Prisma.StockMovementUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.StockMovementCreateOrConnectWithoutLotInput | Prisma.StockMovementCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.StockMovementCreateManyLotInputEnvelope;
    connect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
};
export type StockMovementUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.StockMovementCreateWithoutLotInput, Prisma.StockMovementUncheckedCreateWithoutLotInput> | Prisma.StockMovementCreateWithoutLotInput[] | Prisma.StockMovementUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.StockMovementCreateOrConnectWithoutLotInput | Prisma.StockMovementCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.StockMovementUpsertWithWhereUniqueWithoutLotInput | Prisma.StockMovementUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.StockMovementCreateManyLotInputEnvelope;
    set?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    disconnect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    delete?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    connect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    update?: Prisma.StockMovementUpdateWithWhereUniqueWithoutLotInput | Prisma.StockMovementUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.StockMovementUpdateManyWithWhereWithoutLotInput | Prisma.StockMovementUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.StockMovementScalarWhereInput | Prisma.StockMovementScalarWhereInput[];
};
export type StockMovementUncheckedUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.StockMovementCreateWithoutLotInput, Prisma.StockMovementUncheckedCreateWithoutLotInput> | Prisma.StockMovementCreateWithoutLotInput[] | Prisma.StockMovementUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.StockMovementCreateOrConnectWithoutLotInput | Prisma.StockMovementCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.StockMovementUpsertWithWhereUniqueWithoutLotInput | Prisma.StockMovementUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.StockMovementCreateManyLotInputEnvelope;
    set?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    disconnect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    delete?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    connect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    update?: Prisma.StockMovementUpdateWithWhereUniqueWithoutLotInput | Prisma.StockMovementUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.StockMovementUpdateManyWithWhereWithoutLotInput | Prisma.StockMovementUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.StockMovementScalarWhereInput | Prisma.StockMovementScalarWhereInput[];
};
export type EnumStockMovementTypeFieldUpdateOperationsInput = {
    set?: $Enums.StockMovementType;
};
export type StockMovementCreateWithoutLotInput = {
    id?: string;
    orgId: string;
    branchId: string;
    type: $Enums.StockMovementType;
    qtyDelta: number;
    reason?: string | null;
    refType?: string | null;
    refId?: string | null;
    reasonCode?: string | null;
    managerApprovalBy?: string | null;
    performedBy: string;
    occurredAt?: Date | string;
};
export type StockMovementUncheckedCreateWithoutLotInput = {
    id?: string;
    orgId: string;
    branchId: string;
    type: $Enums.StockMovementType;
    qtyDelta: number;
    reason?: string | null;
    refType?: string | null;
    refId?: string | null;
    reasonCode?: string | null;
    managerApprovalBy?: string | null;
    performedBy: string;
    occurredAt?: Date | string;
};
export type StockMovementCreateOrConnectWithoutLotInput = {
    where: Prisma.StockMovementWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockMovementCreateWithoutLotInput, Prisma.StockMovementUncheckedCreateWithoutLotInput>;
};
export type StockMovementCreateManyLotInputEnvelope = {
    data: Prisma.StockMovementCreateManyLotInput | Prisma.StockMovementCreateManyLotInput[];
    skipDuplicates?: boolean;
};
export type StockMovementUpsertWithWhereUniqueWithoutLotInput = {
    where: Prisma.StockMovementWhereUniqueInput;
    update: Prisma.XOR<Prisma.StockMovementUpdateWithoutLotInput, Prisma.StockMovementUncheckedUpdateWithoutLotInput>;
    create: Prisma.XOR<Prisma.StockMovementCreateWithoutLotInput, Prisma.StockMovementUncheckedCreateWithoutLotInput>;
};
export type StockMovementUpdateWithWhereUniqueWithoutLotInput = {
    where: Prisma.StockMovementWhereUniqueInput;
    data: Prisma.XOR<Prisma.StockMovementUpdateWithoutLotInput, Prisma.StockMovementUncheckedUpdateWithoutLotInput>;
};
export type StockMovementUpdateManyWithWhereWithoutLotInput = {
    where: Prisma.StockMovementScalarWhereInput;
    data: Prisma.XOR<Prisma.StockMovementUpdateManyMutationInput, Prisma.StockMovementUncheckedUpdateManyWithoutLotInput>;
};
export type StockMovementScalarWhereInput = {
    AND?: Prisma.StockMovementScalarWhereInput | Prisma.StockMovementScalarWhereInput[];
    OR?: Prisma.StockMovementScalarWhereInput[];
    NOT?: Prisma.StockMovementScalarWhereInput | Prisma.StockMovementScalarWhereInput[];
    id?: Prisma.StringFilter<"StockMovement"> | string;
    orgId?: Prisma.StringFilter<"StockMovement"> | string;
    branchId?: Prisma.StringFilter<"StockMovement"> | string;
    lotId?: Prisma.StringFilter<"StockMovement"> | string;
    type?: Prisma.EnumStockMovementTypeFilter<"StockMovement"> | $Enums.StockMovementType;
    qtyDelta?: Prisma.IntFilter<"StockMovement"> | number;
    reason?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    refType?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    refId?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    reasonCode?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    managerApprovalBy?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    performedBy?: Prisma.StringFilter<"StockMovement"> | string;
    occurredAt?: Prisma.DateTimeFilter<"StockMovement"> | Date | string;
};
export type StockMovementCreateManyLotInput = {
    id?: string;
    orgId: string;
    branchId: string;
    type: $Enums.StockMovementType;
    qtyDelta: number;
    reason?: string | null;
    refType?: string | null;
    refId?: string | null;
    reasonCode?: string | null;
    managerApprovalBy?: string | null;
    performedBy: string;
    occurredAt?: Date | string;
};
export type StockMovementUpdateWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumStockMovementTypeFieldUpdateOperationsInput | $Enums.StockMovementType;
    qtyDelta?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reasonCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    managerApprovalBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    performedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    occurredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StockMovementUncheckedUpdateWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumStockMovementTypeFieldUpdateOperationsInput | $Enums.StockMovementType;
    qtyDelta?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reasonCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    managerApprovalBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    performedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    occurredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StockMovementUncheckedUpdateManyWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumStockMovementTypeFieldUpdateOperationsInput | $Enums.StockMovementType;
    qtyDelta?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reasonCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    managerApprovalBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    performedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    occurredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StockMovementSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    lotId?: boolean;
    type?: boolean;
    qtyDelta?: boolean;
    reason?: boolean;
    refType?: boolean;
    refId?: boolean;
    reasonCode?: boolean;
    managerApprovalBy?: boolean;
    performedBy?: boolean;
    occurredAt?: boolean;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stockMovement"]>;
export type StockMovementSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    lotId?: boolean;
    type?: boolean;
    qtyDelta?: boolean;
    reason?: boolean;
    refType?: boolean;
    refId?: boolean;
    reasonCode?: boolean;
    managerApprovalBy?: boolean;
    performedBy?: boolean;
    occurredAt?: boolean;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stockMovement"]>;
export type StockMovementSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    lotId?: boolean;
    type?: boolean;
    qtyDelta?: boolean;
    reason?: boolean;
    refType?: boolean;
    refId?: boolean;
    reasonCode?: boolean;
    managerApprovalBy?: boolean;
    performedBy?: boolean;
    occurredAt?: boolean;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stockMovement"]>;
export type StockMovementSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    lotId?: boolean;
    type?: boolean;
    qtyDelta?: boolean;
    reason?: boolean;
    refType?: boolean;
    refId?: boolean;
    reasonCode?: boolean;
    managerApprovalBy?: boolean;
    performedBy?: boolean;
    occurredAt?: boolean;
};
export type StockMovementOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "lotId" | "type" | "qtyDelta" | "reason" | "refType" | "refId" | "reasonCode" | "managerApprovalBy" | "performedBy" | "occurredAt", ExtArgs["result"]["stockMovement"]>;
export type StockMovementInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
};
export type StockMovementIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
};
export type StockMovementIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
};
export type $StockMovementPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StockMovement";
    objects: {
        lot: Prisma.$StockLotPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        lotId: string;
        type: $Enums.StockMovementType;
        qtyDelta: number;
        reason: string | null;
        refType: string | null;
        refId: string | null;
        reasonCode: string | null;
        managerApprovalBy: string | null;
        performedBy: string;
        occurredAt: Date;
    }, ExtArgs["result"]["stockMovement"]>;
    composites: {};
};
export type StockMovementGetPayload<S extends boolean | null | undefined | StockMovementDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StockMovementPayload, S>;
export type StockMovementCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StockMovementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StockMovementCountAggregateInputType | true;
};
export interface StockMovementDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StockMovement'];
        meta: {
            name: 'StockMovement';
        };
    };
    findUnique<T extends StockMovementFindUniqueArgs>(args: Prisma.SelectSubset<T, StockMovementFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StockMovementFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StockMovementFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StockMovementFindFirstArgs>(args?: Prisma.SelectSubset<T, StockMovementFindFirstArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StockMovementFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StockMovementFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StockMovementFindManyArgs>(args?: Prisma.SelectSubset<T, StockMovementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StockMovementCreateArgs>(args: Prisma.SelectSubset<T, StockMovementCreateArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StockMovementCreateManyArgs>(args?: Prisma.SelectSubset<T, StockMovementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StockMovementCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StockMovementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StockMovementDeleteArgs>(args: Prisma.SelectSubset<T, StockMovementDeleteArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StockMovementUpdateArgs>(args: Prisma.SelectSubset<T, StockMovementUpdateArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StockMovementDeleteManyArgs>(args?: Prisma.SelectSubset<T, StockMovementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StockMovementUpdateManyArgs>(args: Prisma.SelectSubset<T, StockMovementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StockMovementUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StockMovementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StockMovementUpsertArgs>(args: Prisma.SelectSubset<T, StockMovementUpsertArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StockMovementCountArgs>(args?: Prisma.Subset<T, StockMovementCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StockMovementCountAggregateOutputType> : number>;
    aggregate<T extends StockMovementAggregateArgs>(args: Prisma.Subset<T, StockMovementAggregateArgs>): Prisma.PrismaPromise<GetStockMovementAggregateType<T>>;
    groupBy<T extends StockMovementGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StockMovementGroupByArgs['orderBy'];
    } : {
        orderBy?: StockMovementGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StockMovementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockMovementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StockMovementFieldRefs;
}
export interface Prisma__StockMovementClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    lot<T extends Prisma.StockLotDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.StockLotDefaultArgs<ExtArgs>>): Prisma.Prisma__StockLotClient<runtime.Types.Result.GetResult<Prisma.$StockLotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StockMovementFieldRefs {
    readonly id: Prisma.FieldRef<"StockMovement", 'String'>;
    readonly orgId: Prisma.FieldRef<"StockMovement", 'String'>;
    readonly branchId: Prisma.FieldRef<"StockMovement", 'String'>;
    readonly lotId: Prisma.FieldRef<"StockMovement", 'String'>;
    readonly type: Prisma.FieldRef<"StockMovement", 'StockMovementType'>;
    readonly qtyDelta: Prisma.FieldRef<"StockMovement", 'Int'>;
    readonly reason: Prisma.FieldRef<"StockMovement", 'String'>;
    readonly refType: Prisma.FieldRef<"StockMovement", 'String'>;
    readonly refId: Prisma.FieldRef<"StockMovement", 'String'>;
    readonly reasonCode: Prisma.FieldRef<"StockMovement", 'String'>;
    readonly managerApprovalBy: Prisma.FieldRef<"StockMovement", 'String'>;
    readonly performedBy: Prisma.FieldRef<"StockMovement", 'String'>;
    readonly occurredAt: Prisma.FieldRef<"StockMovement", 'DateTime'>;
}
export type StockMovementFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where: Prisma.StockMovementWhereUniqueInput;
};
export type StockMovementFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where: Prisma.StockMovementWhereUniqueInput;
};
export type StockMovementFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where?: Prisma.StockMovementWhereInput;
    orderBy?: Prisma.StockMovementOrderByWithRelationInput | Prisma.StockMovementOrderByWithRelationInput[];
    cursor?: Prisma.StockMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockMovementScalarFieldEnum | Prisma.StockMovementScalarFieldEnum[];
};
export type StockMovementFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where?: Prisma.StockMovementWhereInput;
    orderBy?: Prisma.StockMovementOrderByWithRelationInput | Prisma.StockMovementOrderByWithRelationInput[];
    cursor?: Prisma.StockMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockMovementScalarFieldEnum | Prisma.StockMovementScalarFieldEnum[];
};
export type StockMovementFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where?: Prisma.StockMovementWhereInput;
    orderBy?: Prisma.StockMovementOrderByWithRelationInput | Prisma.StockMovementOrderByWithRelationInput[];
    cursor?: Prisma.StockMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockMovementScalarFieldEnum | Prisma.StockMovementScalarFieldEnum[];
};
export type StockMovementCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockMovementCreateInput, Prisma.StockMovementUncheckedCreateInput>;
};
export type StockMovementCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StockMovementCreateManyInput | Prisma.StockMovementCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StockMovementCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    data: Prisma.StockMovementCreateManyInput | Prisma.StockMovementCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.StockMovementIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type StockMovementUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockMovementUpdateInput, Prisma.StockMovementUncheckedUpdateInput>;
    where: Prisma.StockMovementWhereUniqueInput;
};
export type StockMovementUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StockMovementUpdateManyMutationInput, Prisma.StockMovementUncheckedUpdateManyInput>;
    where?: Prisma.StockMovementWhereInput;
    limit?: number;
};
export type StockMovementUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockMovementUpdateManyMutationInput, Prisma.StockMovementUncheckedUpdateManyInput>;
    where?: Prisma.StockMovementWhereInput;
    limit?: number;
    include?: Prisma.StockMovementIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type StockMovementUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where: Prisma.StockMovementWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockMovementCreateInput, Prisma.StockMovementUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StockMovementUpdateInput, Prisma.StockMovementUncheckedUpdateInput>;
};
export type StockMovementDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where: Prisma.StockMovementWhereUniqueInput;
};
export type StockMovementDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockMovementWhereInput;
    limit?: number;
};
export type StockMovementDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
};
