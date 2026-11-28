import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type StockTransferModel = runtime.Types.Result.DefaultSelection<Prisma.$StockTransferPayload>;
export type AggregateStockTransfer = {
    _count: StockTransferCountAggregateOutputType | null;
    _min: StockTransferMinAggregateOutputType | null;
    _max: StockTransferMaxAggregateOutputType | null;
};
export type StockTransferMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    fromBranchId: string | null;
    toBranchId: string | null;
    status: $Enums.TransferStatus | null;
    requestedBy: string | null;
    dispatchedBy: string | null;
    receivedBy: string | null;
    createdAt: Date | null;
    dispatchedAt: Date | null;
    receivedAt: Date | null;
};
export type StockTransferMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    fromBranchId: string | null;
    toBranchId: string | null;
    status: $Enums.TransferStatus | null;
    requestedBy: string | null;
    dispatchedBy: string | null;
    receivedBy: string | null;
    createdAt: Date | null;
    dispatchedAt: Date | null;
    receivedAt: Date | null;
};
export type StockTransferCountAggregateOutputType = {
    id: number;
    orgId: number;
    fromBranchId: number;
    toBranchId: number;
    status: number;
    requestedBy: number;
    dispatchedBy: number;
    receivedBy: number;
    createdAt: number;
    dispatchedAt: number;
    receivedAt: number;
    _all: number;
};
export type StockTransferMinAggregateInputType = {
    id?: true;
    orgId?: true;
    fromBranchId?: true;
    toBranchId?: true;
    status?: true;
    requestedBy?: true;
    dispatchedBy?: true;
    receivedBy?: true;
    createdAt?: true;
    dispatchedAt?: true;
    receivedAt?: true;
};
export type StockTransferMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    fromBranchId?: true;
    toBranchId?: true;
    status?: true;
    requestedBy?: true;
    dispatchedBy?: true;
    receivedBy?: true;
    createdAt?: true;
    dispatchedAt?: true;
    receivedAt?: true;
};
export type StockTransferCountAggregateInputType = {
    id?: true;
    orgId?: true;
    fromBranchId?: true;
    toBranchId?: true;
    status?: true;
    requestedBy?: true;
    dispatchedBy?: true;
    receivedBy?: true;
    createdAt?: true;
    dispatchedAt?: true;
    receivedAt?: true;
    _all?: true;
};
export type StockTransferAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockTransferWhereInput;
    orderBy?: Prisma.StockTransferOrderByWithRelationInput | Prisma.StockTransferOrderByWithRelationInput[];
    cursor?: Prisma.StockTransferWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StockTransferCountAggregateInputType;
    _min?: StockTransferMinAggregateInputType;
    _max?: StockTransferMaxAggregateInputType;
};
export type GetStockTransferAggregateType<T extends StockTransferAggregateArgs> = {
    [P in keyof T & keyof AggregateStockTransfer]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStockTransfer[P]> : Prisma.GetScalarType<T[P], AggregateStockTransfer[P]>;
};
export type StockTransferGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockTransferWhereInput;
    orderBy?: Prisma.StockTransferOrderByWithAggregationInput | Prisma.StockTransferOrderByWithAggregationInput[];
    by: Prisma.StockTransferScalarFieldEnum[] | Prisma.StockTransferScalarFieldEnum;
    having?: Prisma.StockTransferScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StockTransferCountAggregateInputType | true;
    _min?: StockTransferMinAggregateInputType;
    _max?: StockTransferMaxAggregateInputType;
};
export type StockTransferGroupByOutputType = {
    id: string;
    orgId: string;
    fromBranchId: string;
    toBranchId: string;
    status: $Enums.TransferStatus;
    requestedBy: string;
    dispatchedBy: string | null;
    receivedBy: string | null;
    createdAt: Date;
    dispatchedAt: Date | null;
    receivedAt: Date | null;
    _count: StockTransferCountAggregateOutputType | null;
    _min: StockTransferMinAggregateOutputType | null;
    _max: StockTransferMaxAggregateOutputType | null;
};
export type GetStockTransferGroupByPayload<T extends StockTransferGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StockTransferGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StockTransferGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StockTransferGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StockTransferGroupByOutputType[P]>;
}>>;
export type StockTransferWhereInput = {
    AND?: Prisma.StockTransferWhereInput | Prisma.StockTransferWhereInput[];
    OR?: Prisma.StockTransferWhereInput[];
    NOT?: Prisma.StockTransferWhereInput | Prisma.StockTransferWhereInput[];
    id?: Prisma.StringFilter<"StockTransfer"> | string;
    orgId?: Prisma.StringFilter<"StockTransfer"> | string;
    fromBranchId?: Prisma.StringFilter<"StockTransfer"> | string;
    toBranchId?: Prisma.StringFilter<"StockTransfer"> | string;
    status?: Prisma.EnumTransferStatusFilter<"StockTransfer"> | $Enums.TransferStatus;
    requestedBy?: Prisma.StringFilter<"StockTransfer"> | string;
    dispatchedBy?: Prisma.StringNullableFilter<"StockTransfer"> | string | null;
    receivedBy?: Prisma.StringNullableFilter<"StockTransfer"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"StockTransfer"> | Date | string;
    dispatchedAt?: Prisma.DateTimeNullableFilter<"StockTransfer"> | Date | string | null;
    receivedAt?: Prisma.DateTimeNullableFilter<"StockTransfer"> | Date | string | null;
    lines?: Prisma.StockTransferLineListRelationFilter;
};
export type StockTransferOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    fromBranchId?: Prisma.SortOrder;
    toBranchId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    requestedBy?: Prisma.SortOrder;
    dispatchedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    receivedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    dispatchedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    receivedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    lines?: Prisma.StockTransferLineOrderByRelationAggregateInput;
};
export type StockTransferWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.StockTransferWhereInput | Prisma.StockTransferWhereInput[];
    OR?: Prisma.StockTransferWhereInput[];
    NOT?: Prisma.StockTransferWhereInput | Prisma.StockTransferWhereInput[];
    orgId?: Prisma.StringFilter<"StockTransfer"> | string;
    fromBranchId?: Prisma.StringFilter<"StockTransfer"> | string;
    toBranchId?: Prisma.StringFilter<"StockTransfer"> | string;
    status?: Prisma.EnumTransferStatusFilter<"StockTransfer"> | $Enums.TransferStatus;
    requestedBy?: Prisma.StringFilter<"StockTransfer"> | string;
    dispatchedBy?: Prisma.StringNullableFilter<"StockTransfer"> | string | null;
    receivedBy?: Prisma.StringNullableFilter<"StockTransfer"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"StockTransfer"> | Date | string;
    dispatchedAt?: Prisma.DateTimeNullableFilter<"StockTransfer"> | Date | string | null;
    receivedAt?: Prisma.DateTimeNullableFilter<"StockTransfer"> | Date | string | null;
    lines?: Prisma.StockTransferLineListRelationFilter;
}, "id">;
export type StockTransferOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    fromBranchId?: Prisma.SortOrder;
    toBranchId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    requestedBy?: Prisma.SortOrder;
    dispatchedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    receivedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    dispatchedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    receivedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.StockTransferCountOrderByAggregateInput;
    _max?: Prisma.StockTransferMaxOrderByAggregateInput;
    _min?: Prisma.StockTransferMinOrderByAggregateInput;
};
export type StockTransferScalarWhereWithAggregatesInput = {
    AND?: Prisma.StockTransferScalarWhereWithAggregatesInput | Prisma.StockTransferScalarWhereWithAggregatesInput[];
    OR?: Prisma.StockTransferScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StockTransferScalarWhereWithAggregatesInput | Prisma.StockTransferScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"StockTransfer"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"StockTransfer"> | string;
    fromBranchId?: Prisma.StringWithAggregatesFilter<"StockTransfer"> | string;
    toBranchId?: Prisma.StringWithAggregatesFilter<"StockTransfer"> | string;
    status?: Prisma.EnumTransferStatusWithAggregatesFilter<"StockTransfer"> | $Enums.TransferStatus;
    requestedBy?: Prisma.StringWithAggregatesFilter<"StockTransfer"> | string;
    dispatchedBy?: Prisma.StringNullableWithAggregatesFilter<"StockTransfer"> | string | null;
    receivedBy?: Prisma.StringNullableWithAggregatesFilter<"StockTransfer"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"StockTransfer"> | Date | string;
    dispatchedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"StockTransfer"> | Date | string | null;
    receivedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"StockTransfer"> | Date | string | null;
};
export type StockTransferCreateInput = {
    id?: string;
    orgId: string;
    fromBranchId: string;
    toBranchId: string;
    status?: $Enums.TransferStatus;
    requestedBy: string;
    dispatchedBy?: string | null;
    receivedBy?: string | null;
    createdAt?: Date | string;
    dispatchedAt?: Date | string | null;
    receivedAt?: Date | string | null;
    lines?: Prisma.StockTransferLineCreateNestedManyWithoutTransferInput;
};
export type StockTransferUncheckedCreateInput = {
    id?: string;
    orgId: string;
    fromBranchId: string;
    toBranchId: string;
    status?: $Enums.TransferStatus;
    requestedBy: string;
    dispatchedBy?: string | null;
    receivedBy?: string | null;
    createdAt?: Date | string;
    dispatchedAt?: Date | string | null;
    receivedAt?: Date | string | null;
    lines?: Prisma.StockTransferLineUncheckedCreateNestedManyWithoutTransferInput;
};
export type StockTransferUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    fromBranchId?: Prisma.StringFieldUpdateOperationsInput | string;
    toBranchId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumTransferStatusFieldUpdateOperationsInput | $Enums.TransferStatus;
    requestedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    dispatchedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dispatchedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    receivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lines?: Prisma.StockTransferLineUpdateManyWithoutTransferNestedInput;
};
export type StockTransferUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    fromBranchId?: Prisma.StringFieldUpdateOperationsInput | string;
    toBranchId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumTransferStatusFieldUpdateOperationsInput | $Enums.TransferStatus;
    requestedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    dispatchedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dispatchedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    receivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lines?: Prisma.StockTransferLineUncheckedUpdateManyWithoutTransferNestedInput;
};
export type StockTransferCreateManyInput = {
    id?: string;
    orgId: string;
    fromBranchId: string;
    toBranchId: string;
    status?: $Enums.TransferStatus;
    requestedBy: string;
    dispatchedBy?: string | null;
    receivedBy?: string | null;
    createdAt?: Date | string;
    dispatchedAt?: Date | string | null;
    receivedAt?: Date | string | null;
};
export type StockTransferUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    fromBranchId?: Prisma.StringFieldUpdateOperationsInput | string;
    toBranchId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumTransferStatusFieldUpdateOperationsInput | $Enums.TransferStatus;
    requestedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    dispatchedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dispatchedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    receivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type StockTransferUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    fromBranchId?: Prisma.StringFieldUpdateOperationsInput | string;
    toBranchId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumTransferStatusFieldUpdateOperationsInput | $Enums.TransferStatus;
    requestedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    dispatchedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dispatchedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    receivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type StockTransferCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    fromBranchId?: Prisma.SortOrder;
    toBranchId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    requestedBy?: Prisma.SortOrder;
    dispatchedBy?: Prisma.SortOrder;
    receivedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    dispatchedAt?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type StockTransferMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    fromBranchId?: Prisma.SortOrder;
    toBranchId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    requestedBy?: Prisma.SortOrder;
    dispatchedBy?: Prisma.SortOrder;
    receivedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    dispatchedAt?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type StockTransferMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    fromBranchId?: Prisma.SortOrder;
    toBranchId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    requestedBy?: Prisma.SortOrder;
    dispatchedBy?: Prisma.SortOrder;
    receivedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    dispatchedAt?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type StockTransferScalarRelationFilter = {
    is?: Prisma.StockTransferWhereInput;
    isNot?: Prisma.StockTransferWhereInput;
};
export type EnumTransferStatusFieldUpdateOperationsInput = {
    set?: $Enums.TransferStatus;
};
export type StockTransferCreateNestedOneWithoutLinesInput = {
    create?: Prisma.XOR<Prisma.StockTransferCreateWithoutLinesInput, Prisma.StockTransferUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.StockTransferCreateOrConnectWithoutLinesInput;
    connect?: Prisma.StockTransferWhereUniqueInput;
};
export type StockTransferUpdateOneRequiredWithoutLinesNestedInput = {
    create?: Prisma.XOR<Prisma.StockTransferCreateWithoutLinesInput, Prisma.StockTransferUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.StockTransferCreateOrConnectWithoutLinesInput;
    upsert?: Prisma.StockTransferUpsertWithoutLinesInput;
    connect?: Prisma.StockTransferWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.StockTransferUpdateToOneWithWhereWithoutLinesInput, Prisma.StockTransferUpdateWithoutLinesInput>, Prisma.StockTransferUncheckedUpdateWithoutLinesInput>;
};
export type StockTransferCreateWithoutLinesInput = {
    id?: string;
    orgId: string;
    fromBranchId: string;
    toBranchId: string;
    status?: $Enums.TransferStatus;
    requestedBy: string;
    dispatchedBy?: string | null;
    receivedBy?: string | null;
    createdAt?: Date | string;
    dispatchedAt?: Date | string | null;
    receivedAt?: Date | string | null;
};
export type StockTransferUncheckedCreateWithoutLinesInput = {
    id?: string;
    orgId: string;
    fromBranchId: string;
    toBranchId: string;
    status?: $Enums.TransferStatus;
    requestedBy: string;
    dispatchedBy?: string | null;
    receivedBy?: string | null;
    createdAt?: Date | string;
    dispatchedAt?: Date | string | null;
    receivedAt?: Date | string | null;
};
export type StockTransferCreateOrConnectWithoutLinesInput = {
    where: Prisma.StockTransferWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockTransferCreateWithoutLinesInput, Prisma.StockTransferUncheckedCreateWithoutLinesInput>;
};
export type StockTransferUpsertWithoutLinesInput = {
    update: Prisma.XOR<Prisma.StockTransferUpdateWithoutLinesInput, Prisma.StockTransferUncheckedUpdateWithoutLinesInput>;
    create: Prisma.XOR<Prisma.StockTransferCreateWithoutLinesInput, Prisma.StockTransferUncheckedCreateWithoutLinesInput>;
    where?: Prisma.StockTransferWhereInput;
};
export type StockTransferUpdateToOneWithWhereWithoutLinesInput = {
    where?: Prisma.StockTransferWhereInput;
    data: Prisma.XOR<Prisma.StockTransferUpdateWithoutLinesInput, Prisma.StockTransferUncheckedUpdateWithoutLinesInput>;
};
export type StockTransferUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    fromBranchId?: Prisma.StringFieldUpdateOperationsInput | string;
    toBranchId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumTransferStatusFieldUpdateOperationsInput | $Enums.TransferStatus;
    requestedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    dispatchedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dispatchedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    receivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type StockTransferUncheckedUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    fromBranchId?: Prisma.StringFieldUpdateOperationsInput | string;
    toBranchId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumTransferStatusFieldUpdateOperationsInput | $Enums.TransferStatus;
    requestedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    dispatchedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dispatchedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    receivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type StockTransferCountOutputType = {
    lines: number;
};
export type StockTransferCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | StockTransferCountOutputTypeCountLinesArgs;
};
export type StockTransferCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferCountOutputTypeSelect<ExtArgs> | null;
};
export type StockTransferCountOutputTypeCountLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockTransferLineWhereInput;
};
export type StockTransferSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    fromBranchId?: boolean;
    toBranchId?: boolean;
    status?: boolean;
    requestedBy?: boolean;
    dispatchedBy?: boolean;
    receivedBy?: boolean;
    createdAt?: boolean;
    dispatchedAt?: boolean;
    receivedAt?: boolean;
    lines?: boolean | Prisma.StockTransfer$linesArgs<ExtArgs>;
    _count?: boolean | Prisma.StockTransferCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stockTransfer"]>;
export type StockTransferSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    fromBranchId?: boolean;
    toBranchId?: boolean;
    status?: boolean;
    requestedBy?: boolean;
    dispatchedBy?: boolean;
    receivedBy?: boolean;
    createdAt?: boolean;
    dispatchedAt?: boolean;
    receivedAt?: boolean;
}, ExtArgs["result"]["stockTransfer"]>;
export type StockTransferSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    fromBranchId?: boolean;
    toBranchId?: boolean;
    status?: boolean;
    requestedBy?: boolean;
    dispatchedBy?: boolean;
    receivedBy?: boolean;
    createdAt?: boolean;
    dispatchedAt?: boolean;
    receivedAt?: boolean;
}, ExtArgs["result"]["stockTransfer"]>;
export type StockTransferSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    fromBranchId?: boolean;
    toBranchId?: boolean;
    status?: boolean;
    requestedBy?: boolean;
    dispatchedBy?: boolean;
    receivedBy?: boolean;
    createdAt?: boolean;
    dispatchedAt?: boolean;
    receivedAt?: boolean;
};
export type StockTransferOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "fromBranchId" | "toBranchId" | "status" | "requestedBy" | "dispatchedBy" | "receivedBy" | "createdAt" | "dispatchedAt" | "receivedAt", ExtArgs["result"]["stockTransfer"]>;
export type StockTransferInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | Prisma.StockTransfer$linesArgs<ExtArgs>;
    _count?: boolean | Prisma.StockTransferCountOutputTypeDefaultArgs<ExtArgs>;
};
export type StockTransferIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type StockTransferIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $StockTransferPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StockTransfer";
    objects: {
        lines: Prisma.$StockTransferLinePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        fromBranchId: string;
        toBranchId: string;
        status: $Enums.TransferStatus;
        requestedBy: string;
        dispatchedBy: string | null;
        receivedBy: string | null;
        createdAt: Date;
        dispatchedAt: Date | null;
        receivedAt: Date | null;
    }, ExtArgs["result"]["stockTransfer"]>;
    composites: {};
};
export type StockTransferGetPayload<S extends boolean | null | undefined | StockTransferDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StockTransferPayload, S>;
export type StockTransferCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StockTransferFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StockTransferCountAggregateInputType | true;
};
export interface StockTransferDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StockTransfer'];
        meta: {
            name: 'StockTransfer';
        };
    };
    findUnique<T extends StockTransferFindUniqueArgs>(args: Prisma.SelectSubset<T, StockTransferFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StockTransferClient<runtime.Types.Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StockTransferFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StockTransferFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StockTransferClient<runtime.Types.Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StockTransferFindFirstArgs>(args?: Prisma.SelectSubset<T, StockTransferFindFirstArgs<ExtArgs>>): Prisma.Prisma__StockTransferClient<runtime.Types.Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StockTransferFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StockTransferFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StockTransferClient<runtime.Types.Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StockTransferFindManyArgs>(args?: Prisma.SelectSubset<T, StockTransferFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StockTransferCreateArgs>(args: Prisma.SelectSubset<T, StockTransferCreateArgs<ExtArgs>>): Prisma.Prisma__StockTransferClient<runtime.Types.Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StockTransferCreateManyArgs>(args?: Prisma.SelectSubset<T, StockTransferCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StockTransferCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StockTransferCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StockTransferDeleteArgs>(args: Prisma.SelectSubset<T, StockTransferDeleteArgs<ExtArgs>>): Prisma.Prisma__StockTransferClient<runtime.Types.Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StockTransferUpdateArgs>(args: Prisma.SelectSubset<T, StockTransferUpdateArgs<ExtArgs>>): Prisma.Prisma__StockTransferClient<runtime.Types.Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StockTransferDeleteManyArgs>(args?: Prisma.SelectSubset<T, StockTransferDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StockTransferUpdateManyArgs>(args: Prisma.SelectSubset<T, StockTransferUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StockTransferUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StockTransferUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StockTransferUpsertArgs>(args: Prisma.SelectSubset<T, StockTransferUpsertArgs<ExtArgs>>): Prisma.Prisma__StockTransferClient<runtime.Types.Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StockTransferCountArgs>(args?: Prisma.Subset<T, StockTransferCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StockTransferCountAggregateOutputType> : number>;
    aggregate<T extends StockTransferAggregateArgs>(args: Prisma.Subset<T, StockTransferAggregateArgs>): Prisma.PrismaPromise<GetStockTransferAggregateType<T>>;
    groupBy<T extends StockTransferGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StockTransferGroupByArgs['orderBy'];
    } : {
        orderBy?: StockTransferGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StockTransferGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockTransferGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StockTransferFieldRefs;
}
export interface Prisma__StockTransferClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    lines<T extends Prisma.StockTransfer$linesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.StockTransfer$linesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockTransferLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StockTransferFieldRefs {
    readonly id: Prisma.FieldRef<"StockTransfer", 'String'>;
    readonly orgId: Prisma.FieldRef<"StockTransfer", 'String'>;
    readonly fromBranchId: Prisma.FieldRef<"StockTransfer", 'String'>;
    readonly toBranchId: Prisma.FieldRef<"StockTransfer", 'String'>;
    readonly status: Prisma.FieldRef<"StockTransfer", 'TransferStatus'>;
    readonly requestedBy: Prisma.FieldRef<"StockTransfer", 'String'>;
    readonly dispatchedBy: Prisma.FieldRef<"StockTransfer", 'String'>;
    readonly receivedBy: Prisma.FieldRef<"StockTransfer", 'String'>;
    readonly createdAt: Prisma.FieldRef<"StockTransfer", 'DateTime'>;
    readonly dispatchedAt: Prisma.FieldRef<"StockTransfer", 'DateTime'>;
    readonly receivedAt: Prisma.FieldRef<"StockTransfer", 'DateTime'>;
}
export type StockTransferFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferOmit<ExtArgs> | null;
    include?: Prisma.StockTransferInclude<ExtArgs> | null;
    where: Prisma.StockTransferWhereUniqueInput;
};
export type StockTransferFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferOmit<ExtArgs> | null;
    include?: Prisma.StockTransferInclude<ExtArgs> | null;
    where: Prisma.StockTransferWhereUniqueInput;
};
export type StockTransferFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferOmit<ExtArgs> | null;
    include?: Prisma.StockTransferInclude<ExtArgs> | null;
    where?: Prisma.StockTransferWhereInput;
    orderBy?: Prisma.StockTransferOrderByWithRelationInput | Prisma.StockTransferOrderByWithRelationInput[];
    cursor?: Prisma.StockTransferWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockTransferScalarFieldEnum | Prisma.StockTransferScalarFieldEnum[];
};
export type StockTransferFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferOmit<ExtArgs> | null;
    include?: Prisma.StockTransferInclude<ExtArgs> | null;
    where?: Prisma.StockTransferWhereInput;
    orderBy?: Prisma.StockTransferOrderByWithRelationInput | Prisma.StockTransferOrderByWithRelationInput[];
    cursor?: Prisma.StockTransferWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockTransferScalarFieldEnum | Prisma.StockTransferScalarFieldEnum[];
};
export type StockTransferFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferOmit<ExtArgs> | null;
    include?: Prisma.StockTransferInclude<ExtArgs> | null;
    where?: Prisma.StockTransferWhereInput;
    orderBy?: Prisma.StockTransferOrderByWithRelationInput | Prisma.StockTransferOrderByWithRelationInput[];
    cursor?: Prisma.StockTransferWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockTransferScalarFieldEnum | Prisma.StockTransferScalarFieldEnum[];
};
export type StockTransferCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferOmit<ExtArgs> | null;
    include?: Prisma.StockTransferInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockTransferCreateInput, Prisma.StockTransferUncheckedCreateInput>;
};
export type StockTransferCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StockTransferCreateManyInput | Prisma.StockTransferCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StockTransferCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StockTransferOmit<ExtArgs> | null;
    data: Prisma.StockTransferCreateManyInput | Prisma.StockTransferCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StockTransferUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferOmit<ExtArgs> | null;
    include?: Prisma.StockTransferInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockTransferUpdateInput, Prisma.StockTransferUncheckedUpdateInput>;
    where: Prisma.StockTransferWhereUniqueInput;
};
export type StockTransferUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StockTransferUpdateManyMutationInput, Prisma.StockTransferUncheckedUpdateManyInput>;
    where?: Prisma.StockTransferWhereInput;
    limit?: number;
};
export type StockTransferUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StockTransferOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockTransferUpdateManyMutationInput, Prisma.StockTransferUncheckedUpdateManyInput>;
    where?: Prisma.StockTransferWhereInput;
    limit?: number;
};
export type StockTransferUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferOmit<ExtArgs> | null;
    include?: Prisma.StockTransferInclude<ExtArgs> | null;
    where: Prisma.StockTransferWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockTransferCreateInput, Prisma.StockTransferUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StockTransferUpdateInput, Prisma.StockTransferUncheckedUpdateInput>;
};
export type StockTransferDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferOmit<ExtArgs> | null;
    include?: Prisma.StockTransferInclude<ExtArgs> | null;
    where: Prisma.StockTransferWhereUniqueInput;
};
export type StockTransferDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockTransferWhereInput;
    limit?: number;
};
export type StockTransfer$linesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferLineSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferLineOmit<ExtArgs> | null;
    include?: Prisma.StockTransferLineInclude<ExtArgs> | null;
    where?: Prisma.StockTransferLineWhereInput;
    orderBy?: Prisma.StockTransferLineOrderByWithRelationInput | Prisma.StockTransferLineOrderByWithRelationInput[];
    cursor?: Prisma.StockTransferLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockTransferLineScalarFieldEnum | Prisma.StockTransferLineScalarFieldEnum[];
};
export type StockTransferDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferOmit<ExtArgs> | null;
    include?: Prisma.StockTransferInclude<ExtArgs> | null;
};
