import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type GoodsReceiptLineModel = runtime.Types.Result.DefaultSelection<Prisma.$GoodsReceiptLinePayload>;
export type AggregateGoodsReceiptLine = {
    _count: GoodsReceiptLineCountAggregateOutputType | null;
    _avg: GoodsReceiptLineAvgAggregateOutputType | null;
    _sum: GoodsReceiptLineSumAggregateOutputType | null;
    _min: GoodsReceiptLineMinAggregateOutputType | null;
    _max: GoodsReceiptLineMaxAggregateOutputType | null;
};
export type GoodsReceiptLineAvgAggregateOutputType = {
    quantity: number | null;
    unitCost: runtime.Decimal | null;
    poUnitCost: runtime.Decimal | null;
    prevUnitCost: runtime.Decimal | null;
};
export type GoodsReceiptLineSumAggregateOutputType = {
    quantity: number | null;
    unitCost: runtime.Decimal | null;
    poUnitCost: runtime.Decimal | null;
    prevUnitCost: runtime.Decimal | null;
};
export type GoodsReceiptLineMinAggregateOutputType = {
    id: string | null;
    receiptId: string | null;
    drugId: string | null;
    lotId: string | null;
    quantity: number | null;
    unitCost: runtime.Decimal | null;
    poUnitCost: runtime.Decimal | null;
    prevUnitCost: runtime.Decimal | null;
};
export type GoodsReceiptLineMaxAggregateOutputType = {
    id: string | null;
    receiptId: string | null;
    drugId: string | null;
    lotId: string | null;
    quantity: number | null;
    unitCost: runtime.Decimal | null;
    poUnitCost: runtime.Decimal | null;
    prevUnitCost: runtime.Decimal | null;
};
export type GoodsReceiptLineCountAggregateOutputType = {
    id: number;
    receiptId: number;
    drugId: number;
    lotId: number;
    quantity: number;
    unitCost: number;
    poUnitCost: number;
    prevUnitCost: number;
    _all: number;
};
export type GoodsReceiptLineAvgAggregateInputType = {
    quantity?: true;
    unitCost?: true;
    poUnitCost?: true;
    prevUnitCost?: true;
};
export type GoodsReceiptLineSumAggregateInputType = {
    quantity?: true;
    unitCost?: true;
    poUnitCost?: true;
    prevUnitCost?: true;
};
export type GoodsReceiptLineMinAggregateInputType = {
    id?: true;
    receiptId?: true;
    drugId?: true;
    lotId?: true;
    quantity?: true;
    unitCost?: true;
    poUnitCost?: true;
    prevUnitCost?: true;
};
export type GoodsReceiptLineMaxAggregateInputType = {
    id?: true;
    receiptId?: true;
    drugId?: true;
    lotId?: true;
    quantity?: true;
    unitCost?: true;
    poUnitCost?: true;
    prevUnitCost?: true;
};
export type GoodsReceiptLineCountAggregateInputType = {
    id?: true;
    receiptId?: true;
    drugId?: true;
    lotId?: true;
    quantity?: true;
    unitCost?: true;
    poUnitCost?: true;
    prevUnitCost?: true;
    _all?: true;
};
export type GoodsReceiptLineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.GoodsReceiptLineWhereInput;
    orderBy?: Prisma.GoodsReceiptLineOrderByWithRelationInput | Prisma.GoodsReceiptLineOrderByWithRelationInput[];
    cursor?: Prisma.GoodsReceiptLineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | GoodsReceiptLineCountAggregateInputType;
    _avg?: GoodsReceiptLineAvgAggregateInputType;
    _sum?: GoodsReceiptLineSumAggregateInputType;
    _min?: GoodsReceiptLineMinAggregateInputType;
    _max?: GoodsReceiptLineMaxAggregateInputType;
};
export type GetGoodsReceiptLineAggregateType<T extends GoodsReceiptLineAggregateArgs> = {
    [P in keyof T & keyof AggregateGoodsReceiptLine]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateGoodsReceiptLine[P]> : Prisma.GetScalarType<T[P], AggregateGoodsReceiptLine[P]>;
};
export type GoodsReceiptLineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.GoodsReceiptLineWhereInput;
    orderBy?: Prisma.GoodsReceiptLineOrderByWithAggregationInput | Prisma.GoodsReceiptLineOrderByWithAggregationInput[];
    by: Prisma.GoodsReceiptLineScalarFieldEnum[] | Prisma.GoodsReceiptLineScalarFieldEnum;
    having?: Prisma.GoodsReceiptLineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: GoodsReceiptLineCountAggregateInputType | true;
    _avg?: GoodsReceiptLineAvgAggregateInputType;
    _sum?: GoodsReceiptLineSumAggregateInputType;
    _min?: GoodsReceiptLineMinAggregateInputType;
    _max?: GoodsReceiptLineMaxAggregateInputType;
};
export type GoodsReceiptLineGroupByOutputType = {
    id: string;
    receiptId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    unitCost: runtime.Decimal;
    poUnitCost: runtime.Decimal | null;
    prevUnitCost: runtime.Decimal | null;
    _count: GoodsReceiptLineCountAggregateOutputType | null;
    _avg: GoodsReceiptLineAvgAggregateOutputType | null;
    _sum: GoodsReceiptLineSumAggregateOutputType | null;
    _min: GoodsReceiptLineMinAggregateOutputType | null;
    _max: GoodsReceiptLineMaxAggregateOutputType | null;
};
export type GetGoodsReceiptLineGroupByPayload<T extends GoodsReceiptLineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<GoodsReceiptLineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof GoodsReceiptLineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], GoodsReceiptLineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], GoodsReceiptLineGroupByOutputType[P]>;
}>>;
export type GoodsReceiptLineWhereInput = {
    AND?: Prisma.GoodsReceiptLineWhereInput | Prisma.GoodsReceiptLineWhereInput[];
    OR?: Prisma.GoodsReceiptLineWhereInput[];
    NOT?: Prisma.GoodsReceiptLineWhereInput | Prisma.GoodsReceiptLineWhereInput[];
    id?: Prisma.StringFilter<"GoodsReceiptLine"> | string;
    receiptId?: Prisma.StringFilter<"GoodsReceiptLine"> | string;
    drugId?: Prisma.StringFilter<"GoodsReceiptLine"> | string;
    lotId?: Prisma.StringFilter<"GoodsReceiptLine"> | string;
    quantity?: Prisma.IntFilter<"GoodsReceiptLine"> | number;
    unitCost?: Prisma.DecimalFilter<"GoodsReceiptLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: Prisma.DecimalNullableFilter<"GoodsReceiptLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: Prisma.DecimalNullableFilter<"GoodsReceiptLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    receipt?: Prisma.XOR<Prisma.GoodsReceiptScalarRelationFilter, Prisma.GoodsReceiptWhereInput>;
};
export type GoodsReceiptLineOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    receiptId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    poUnitCost?: Prisma.SortOrderInput | Prisma.SortOrder;
    prevUnitCost?: Prisma.SortOrderInput | Prisma.SortOrder;
    receipt?: Prisma.GoodsReceiptOrderByWithRelationInput;
};
export type GoodsReceiptLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.GoodsReceiptLineWhereInput | Prisma.GoodsReceiptLineWhereInput[];
    OR?: Prisma.GoodsReceiptLineWhereInput[];
    NOT?: Prisma.GoodsReceiptLineWhereInput | Prisma.GoodsReceiptLineWhereInput[];
    receiptId?: Prisma.StringFilter<"GoodsReceiptLine"> | string;
    drugId?: Prisma.StringFilter<"GoodsReceiptLine"> | string;
    lotId?: Prisma.StringFilter<"GoodsReceiptLine"> | string;
    quantity?: Prisma.IntFilter<"GoodsReceiptLine"> | number;
    unitCost?: Prisma.DecimalFilter<"GoodsReceiptLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: Prisma.DecimalNullableFilter<"GoodsReceiptLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: Prisma.DecimalNullableFilter<"GoodsReceiptLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    receipt?: Prisma.XOR<Prisma.GoodsReceiptScalarRelationFilter, Prisma.GoodsReceiptWhereInput>;
}, "id">;
export type GoodsReceiptLineOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    receiptId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    poUnitCost?: Prisma.SortOrderInput | Prisma.SortOrder;
    prevUnitCost?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.GoodsReceiptLineCountOrderByAggregateInput;
    _avg?: Prisma.GoodsReceiptLineAvgOrderByAggregateInput;
    _max?: Prisma.GoodsReceiptLineMaxOrderByAggregateInput;
    _min?: Prisma.GoodsReceiptLineMinOrderByAggregateInput;
    _sum?: Prisma.GoodsReceiptLineSumOrderByAggregateInput;
};
export type GoodsReceiptLineScalarWhereWithAggregatesInput = {
    AND?: Prisma.GoodsReceiptLineScalarWhereWithAggregatesInput | Prisma.GoodsReceiptLineScalarWhereWithAggregatesInput[];
    OR?: Prisma.GoodsReceiptLineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.GoodsReceiptLineScalarWhereWithAggregatesInput | Prisma.GoodsReceiptLineScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"GoodsReceiptLine"> | string;
    receiptId?: Prisma.StringWithAggregatesFilter<"GoodsReceiptLine"> | string;
    drugId?: Prisma.StringWithAggregatesFilter<"GoodsReceiptLine"> | string;
    lotId?: Prisma.StringWithAggregatesFilter<"GoodsReceiptLine"> | string;
    quantity?: Prisma.IntWithAggregatesFilter<"GoodsReceiptLine"> | number;
    unitCost?: Prisma.DecimalWithAggregatesFilter<"GoodsReceiptLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: Prisma.DecimalNullableWithAggregatesFilter<"GoodsReceiptLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: Prisma.DecimalNullableWithAggregatesFilter<"GoodsReceiptLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type GoodsReceiptLineCreateInput = {
    id?: string;
    drugId: string;
    lotId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    receipt: Prisma.GoodsReceiptCreateNestedOneWithoutLinesInput;
};
export type GoodsReceiptLineUncheckedCreateInput = {
    id?: string;
    receiptId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type GoodsReceiptLineUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    receipt?: Prisma.GoodsReceiptUpdateOneRequiredWithoutLinesNestedInput;
};
export type GoodsReceiptLineUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    receiptId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type GoodsReceiptLineCreateManyInput = {
    id?: string;
    receiptId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type GoodsReceiptLineUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type GoodsReceiptLineUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    receiptId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type GoodsReceiptLineListRelationFilter = {
    every?: Prisma.GoodsReceiptLineWhereInput;
    some?: Prisma.GoodsReceiptLineWhereInput;
    none?: Prisma.GoodsReceiptLineWhereInput;
};
export type GoodsReceiptLineOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type GoodsReceiptLineCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    receiptId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    poUnitCost?: Prisma.SortOrder;
    prevUnitCost?: Prisma.SortOrder;
};
export type GoodsReceiptLineAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    poUnitCost?: Prisma.SortOrder;
    prevUnitCost?: Prisma.SortOrder;
};
export type GoodsReceiptLineMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    receiptId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    poUnitCost?: Prisma.SortOrder;
    prevUnitCost?: Prisma.SortOrder;
};
export type GoodsReceiptLineMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    receiptId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    poUnitCost?: Prisma.SortOrder;
    prevUnitCost?: Prisma.SortOrder;
};
export type GoodsReceiptLineSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    poUnitCost?: Prisma.SortOrder;
    prevUnitCost?: Prisma.SortOrder;
};
export type GoodsReceiptLineCreateNestedManyWithoutReceiptInput = {
    create?: Prisma.XOR<Prisma.GoodsReceiptLineCreateWithoutReceiptInput, Prisma.GoodsReceiptLineUncheckedCreateWithoutReceiptInput> | Prisma.GoodsReceiptLineCreateWithoutReceiptInput[] | Prisma.GoodsReceiptLineUncheckedCreateWithoutReceiptInput[];
    connectOrCreate?: Prisma.GoodsReceiptLineCreateOrConnectWithoutReceiptInput | Prisma.GoodsReceiptLineCreateOrConnectWithoutReceiptInput[];
    createMany?: Prisma.GoodsReceiptLineCreateManyReceiptInputEnvelope;
    connect?: Prisma.GoodsReceiptLineWhereUniqueInput | Prisma.GoodsReceiptLineWhereUniqueInput[];
};
export type GoodsReceiptLineUncheckedCreateNestedManyWithoutReceiptInput = {
    create?: Prisma.XOR<Prisma.GoodsReceiptLineCreateWithoutReceiptInput, Prisma.GoodsReceiptLineUncheckedCreateWithoutReceiptInput> | Prisma.GoodsReceiptLineCreateWithoutReceiptInput[] | Prisma.GoodsReceiptLineUncheckedCreateWithoutReceiptInput[];
    connectOrCreate?: Prisma.GoodsReceiptLineCreateOrConnectWithoutReceiptInput | Prisma.GoodsReceiptLineCreateOrConnectWithoutReceiptInput[];
    createMany?: Prisma.GoodsReceiptLineCreateManyReceiptInputEnvelope;
    connect?: Prisma.GoodsReceiptLineWhereUniqueInput | Prisma.GoodsReceiptLineWhereUniqueInput[];
};
export type GoodsReceiptLineUpdateManyWithoutReceiptNestedInput = {
    create?: Prisma.XOR<Prisma.GoodsReceiptLineCreateWithoutReceiptInput, Prisma.GoodsReceiptLineUncheckedCreateWithoutReceiptInput> | Prisma.GoodsReceiptLineCreateWithoutReceiptInput[] | Prisma.GoodsReceiptLineUncheckedCreateWithoutReceiptInput[];
    connectOrCreate?: Prisma.GoodsReceiptLineCreateOrConnectWithoutReceiptInput | Prisma.GoodsReceiptLineCreateOrConnectWithoutReceiptInput[];
    upsert?: Prisma.GoodsReceiptLineUpsertWithWhereUniqueWithoutReceiptInput | Prisma.GoodsReceiptLineUpsertWithWhereUniqueWithoutReceiptInput[];
    createMany?: Prisma.GoodsReceiptLineCreateManyReceiptInputEnvelope;
    set?: Prisma.GoodsReceiptLineWhereUniqueInput | Prisma.GoodsReceiptLineWhereUniqueInput[];
    disconnect?: Prisma.GoodsReceiptLineWhereUniqueInput | Prisma.GoodsReceiptLineWhereUniqueInput[];
    delete?: Prisma.GoodsReceiptLineWhereUniqueInput | Prisma.GoodsReceiptLineWhereUniqueInput[];
    connect?: Prisma.GoodsReceiptLineWhereUniqueInput | Prisma.GoodsReceiptLineWhereUniqueInput[];
    update?: Prisma.GoodsReceiptLineUpdateWithWhereUniqueWithoutReceiptInput | Prisma.GoodsReceiptLineUpdateWithWhereUniqueWithoutReceiptInput[];
    updateMany?: Prisma.GoodsReceiptLineUpdateManyWithWhereWithoutReceiptInput | Prisma.GoodsReceiptLineUpdateManyWithWhereWithoutReceiptInput[];
    deleteMany?: Prisma.GoodsReceiptLineScalarWhereInput | Prisma.GoodsReceiptLineScalarWhereInput[];
};
export type GoodsReceiptLineUncheckedUpdateManyWithoutReceiptNestedInput = {
    create?: Prisma.XOR<Prisma.GoodsReceiptLineCreateWithoutReceiptInput, Prisma.GoodsReceiptLineUncheckedCreateWithoutReceiptInput> | Prisma.GoodsReceiptLineCreateWithoutReceiptInput[] | Prisma.GoodsReceiptLineUncheckedCreateWithoutReceiptInput[];
    connectOrCreate?: Prisma.GoodsReceiptLineCreateOrConnectWithoutReceiptInput | Prisma.GoodsReceiptLineCreateOrConnectWithoutReceiptInput[];
    upsert?: Prisma.GoodsReceiptLineUpsertWithWhereUniqueWithoutReceiptInput | Prisma.GoodsReceiptLineUpsertWithWhereUniqueWithoutReceiptInput[];
    createMany?: Prisma.GoodsReceiptLineCreateManyReceiptInputEnvelope;
    set?: Prisma.GoodsReceiptLineWhereUniqueInput | Prisma.GoodsReceiptLineWhereUniqueInput[];
    disconnect?: Prisma.GoodsReceiptLineWhereUniqueInput | Prisma.GoodsReceiptLineWhereUniqueInput[];
    delete?: Prisma.GoodsReceiptLineWhereUniqueInput | Prisma.GoodsReceiptLineWhereUniqueInput[];
    connect?: Prisma.GoodsReceiptLineWhereUniqueInput | Prisma.GoodsReceiptLineWhereUniqueInput[];
    update?: Prisma.GoodsReceiptLineUpdateWithWhereUniqueWithoutReceiptInput | Prisma.GoodsReceiptLineUpdateWithWhereUniqueWithoutReceiptInput[];
    updateMany?: Prisma.GoodsReceiptLineUpdateManyWithWhereWithoutReceiptInput | Prisma.GoodsReceiptLineUpdateManyWithWhereWithoutReceiptInput[];
    deleteMany?: Prisma.GoodsReceiptLineScalarWhereInput | Prisma.GoodsReceiptLineScalarWhereInput[];
};
export type GoodsReceiptLineCreateWithoutReceiptInput = {
    id?: string;
    drugId: string;
    lotId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type GoodsReceiptLineUncheckedCreateWithoutReceiptInput = {
    id?: string;
    drugId: string;
    lotId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type GoodsReceiptLineCreateOrConnectWithoutReceiptInput = {
    where: Prisma.GoodsReceiptLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.GoodsReceiptLineCreateWithoutReceiptInput, Prisma.GoodsReceiptLineUncheckedCreateWithoutReceiptInput>;
};
export type GoodsReceiptLineCreateManyReceiptInputEnvelope = {
    data: Prisma.GoodsReceiptLineCreateManyReceiptInput | Prisma.GoodsReceiptLineCreateManyReceiptInput[];
    skipDuplicates?: boolean;
};
export type GoodsReceiptLineUpsertWithWhereUniqueWithoutReceiptInput = {
    where: Prisma.GoodsReceiptLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.GoodsReceiptLineUpdateWithoutReceiptInput, Prisma.GoodsReceiptLineUncheckedUpdateWithoutReceiptInput>;
    create: Prisma.XOR<Prisma.GoodsReceiptLineCreateWithoutReceiptInput, Prisma.GoodsReceiptLineUncheckedCreateWithoutReceiptInput>;
};
export type GoodsReceiptLineUpdateWithWhereUniqueWithoutReceiptInput = {
    where: Prisma.GoodsReceiptLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.GoodsReceiptLineUpdateWithoutReceiptInput, Prisma.GoodsReceiptLineUncheckedUpdateWithoutReceiptInput>;
};
export type GoodsReceiptLineUpdateManyWithWhereWithoutReceiptInput = {
    where: Prisma.GoodsReceiptLineScalarWhereInput;
    data: Prisma.XOR<Prisma.GoodsReceiptLineUpdateManyMutationInput, Prisma.GoodsReceiptLineUncheckedUpdateManyWithoutReceiptInput>;
};
export type GoodsReceiptLineScalarWhereInput = {
    AND?: Prisma.GoodsReceiptLineScalarWhereInput | Prisma.GoodsReceiptLineScalarWhereInput[];
    OR?: Prisma.GoodsReceiptLineScalarWhereInput[];
    NOT?: Prisma.GoodsReceiptLineScalarWhereInput | Prisma.GoodsReceiptLineScalarWhereInput[];
    id?: Prisma.StringFilter<"GoodsReceiptLine"> | string;
    receiptId?: Prisma.StringFilter<"GoodsReceiptLine"> | string;
    drugId?: Prisma.StringFilter<"GoodsReceiptLine"> | string;
    lotId?: Prisma.StringFilter<"GoodsReceiptLine"> | string;
    quantity?: Prisma.IntFilter<"GoodsReceiptLine"> | number;
    unitCost?: Prisma.DecimalFilter<"GoodsReceiptLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: Prisma.DecimalNullableFilter<"GoodsReceiptLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: Prisma.DecimalNullableFilter<"GoodsReceiptLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type GoodsReceiptLineCreateManyReceiptInput = {
    id?: string;
    drugId: string;
    lotId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type GoodsReceiptLineUpdateWithoutReceiptInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type GoodsReceiptLineUncheckedUpdateWithoutReceiptInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type GoodsReceiptLineUncheckedUpdateManyWithoutReceiptInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    poUnitCost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    prevUnitCost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type GoodsReceiptLineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    receiptId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    unitCost?: boolean;
    poUnitCost?: boolean;
    prevUnitCost?: boolean;
    receipt?: boolean | Prisma.GoodsReceiptDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["goodsReceiptLine"]>;
export type GoodsReceiptLineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    receiptId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    unitCost?: boolean;
    poUnitCost?: boolean;
    prevUnitCost?: boolean;
    receipt?: boolean | Prisma.GoodsReceiptDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["goodsReceiptLine"]>;
export type GoodsReceiptLineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    receiptId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    unitCost?: boolean;
    poUnitCost?: boolean;
    prevUnitCost?: boolean;
    receipt?: boolean | Prisma.GoodsReceiptDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["goodsReceiptLine"]>;
export type GoodsReceiptLineSelectScalar = {
    id?: boolean;
    receiptId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    unitCost?: boolean;
    poUnitCost?: boolean;
    prevUnitCost?: boolean;
};
export type GoodsReceiptLineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "receiptId" | "drugId" | "lotId" | "quantity" | "unitCost" | "poUnitCost" | "prevUnitCost", ExtArgs["result"]["goodsReceiptLine"]>;
export type GoodsReceiptLineInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    receipt?: boolean | Prisma.GoodsReceiptDefaultArgs<ExtArgs>;
};
export type GoodsReceiptLineIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    receipt?: boolean | Prisma.GoodsReceiptDefaultArgs<ExtArgs>;
};
export type GoodsReceiptLineIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    receipt?: boolean | Prisma.GoodsReceiptDefaultArgs<ExtArgs>;
};
export type $GoodsReceiptLinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "GoodsReceiptLine";
    objects: {
        receipt: Prisma.$GoodsReceiptPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        receiptId: string;
        drugId: string;
        lotId: string;
        quantity: number;
        unitCost: runtime.Decimal;
        poUnitCost: runtime.Decimal | null;
        prevUnitCost: runtime.Decimal | null;
    }, ExtArgs["result"]["goodsReceiptLine"]>;
    composites: {};
};
export type GoodsReceiptLineGetPayload<S extends boolean | null | undefined | GoodsReceiptLineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$GoodsReceiptLinePayload, S>;
export type GoodsReceiptLineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<GoodsReceiptLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: GoodsReceiptLineCountAggregateInputType | true;
};
export interface GoodsReceiptLineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['GoodsReceiptLine'];
        meta: {
            name: 'GoodsReceiptLine';
        };
    };
    findUnique<T extends GoodsReceiptLineFindUniqueArgs>(args: Prisma.SelectSubset<T, GoodsReceiptLineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptLineClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends GoodsReceiptLineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, GoodsReceiptLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptLineClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends GoodsReceiptLineFindFirstArgs>(args?: Prisma.SelectSubset<T, GoodsReceiptLineFindFirstArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptLineClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends GoodsReceiptLineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, GoodsReceiptLineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptLineClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends GoodsReceiptLineFindManyArgs>(args?: Prisma.SelectSubset<T, GoodsReceiptLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends GoodsReceiptLineCreateArgs>(args: Prisma.SelectSubset<T, GoodsReceiptLineCreateArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptLineClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends GoodsReceiptLineCreateManyArgs>(args?: Prisma.SelectSubset<T, GoodsReceiptLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends GoodsReceiptLineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, GoodsReceiptLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends GoodsReceiptLineDeleteArgs>(args: Prisma.SelectSubset<T, GoodsReceiptLineDeleteArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptLineClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends GoodsReceiptLineUpdateArgs>(args: Prisma.SelectSubset<T, GoodsReceiptLineUpdateArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptLineClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends GoodsReceiptLineDeleteManyArgs>(args?: Prisma.SelectSubset<T, GoodsReceiptLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends GoodsReceiptLineUpdateManyArgs>(args: Prisma.SelectSubset<T, GoodsReceiptLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends GoodsReceiptLineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, GoodsReceiptLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends GoodsReceiptLineUpsertArgs>(args: Prisma.SelectSubset<T, GoodsReceiptLineUpsertArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptLineClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends GoodsReceiptLineCountArgs>(args?: Prisma.Subset<T, GoodsReceiptLineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], GoodsReceiptLineCountAggregateOutputType> : number>;
    aggregate<T extends GoodsReceiptLineAggregateArgs>(args: Prisma.Subset<T, GoodsReceiptLineAggregateArgs>): Prisma.PrismaPromise<GetGoodsReceiptLineAggregateType<T>>;
    groupBy<T extends GoodsReceiptLineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: GoodsReceiptLineGroupByArgs['orderBy'];
    } : {
        orderBy?: GoodsReceiptLineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, GoodsReceiptLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGoodsReceiptLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: GoodsReceiptLineFieldRefs;
}
export interface Prisma__GoodsReceiptLineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    receipt<T extends Prisma.GoodsReceiptDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.GoodsReceiptDefaultArgs<ExtArgs>>): Prisma.Prisma__GoodsReceiptClient<runtime.Types.Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface GoodsReceiptLineFieldRefs {
    readonly id: Prisma.FieldRef<"GoodsReceiptLine", 'String'>;
    readonly receiptId: Prisma.FieldRef<"GoodsReceiptLine", 'String'>;
    readonly drugId: Prisma.FieldRef<"GoodsReceiptLine", 'String'>;
    readonly lotId: Prisma.FieldRef<"GoodsReceiptLine", 'String'>;
    readonly quantity: Prisma.FieldRef<"GoodsReceiptLine", 'Int'>;
    readonly unitCost: Prisma.FieldRef<"GoodsReceiptLine", 'Decimal'>;
    readonly poUnitCost: Prisma.FieldRef<"GoodsReceiptLine", 'Decimal'>;
    readonly prevUnitCost: Prisma.FieldRef<"GoodsReceiptLine", 'Decimal'>;
}
export type GoodsReceiptLineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptLineSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptLineOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptLineInclude<ExtArgs> | null;
    where: Prisma.GoodsReceiptLineWhereUniqueInput;
};
export type GoodsReceiptLineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptLineSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptLineOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptLineInclude<ExtArgs> | null;
    where: Prisma.GoodsReceiptLineWhereUniqueInput;
};
export type GoodsReceiptLineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type GoodsReceiptLineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type GoodsReceiptLineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type GoodsReceiptLineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptLineSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptLineOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.GoodsReceiptLineCreateInput, Prisma.GoodsReceiptLineUncheckedCreateInput>;
};
export type GoodsReceiptLineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.GoodsReceiptLineCreateManyInput | Prisma.GoodsReceiptLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type GoodsReceiptLineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptLineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptLineOmit<ExtArgs> | null;
    data: Prisma.GoodsReceiptLineCreateManyInput | Prisma.GoodsReceiptLineCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.GoodsReceiptLineIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type GoodsReceiptLineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptLineSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptLineOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.GoodsReceiptLineUpdateInput, Prisma.GoodsReceiptLineUncheckedUpdateInput>;
    where: Prisma.GoodsReceiptLineWhereUniqueInput;
};
export type GoodsReceiptLineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.GoodsReceiptLineUpdateManyMutationInput, Prisma.GoodsReceiptLineUncheckedUpdateManyInput>;
    where?: Prisma.GoodsReceiptLineWhereInput;
    limit?: number;
};
export type GoodsReceiptLineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptLineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.GoodsReceiptLineUpdateManyMutationInput, Prisma.GoodsReceiptLineUncheckedUpdateManyInput>;
    where?: Prisma.GoodsReceiptLineWhereInput;
    limit?: number;
    include?: Prisma.GoodsReceiptLineIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type GoodsReceiptLineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptLineSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptLineOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptLineInclude<ExtArgs> | null;
    where: Prisma.GoodsReceiptLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.GoodsReceiptLineCreateInput, Prisma.GoodsReceiptLineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.GoodsReceiptLineUpdateInput, Prisma.GoodsReceiptLineUncheckedUpdateInput>;
};
export type GoodsReceiptLineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptLineSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptLineOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptLineInclude<ExtArgs> | null;
    where: Prisma.GoodsReceiptLineWhereUniqueInput;
};
export type GoodsReceiptLineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.GoodsReceiptLineWhereInput;
    limit?: number;
};
export type GoodsReceiptLineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GoodsReceiptLineSelect<ExtArgs> | null;
    omit?: Prisma.GoodsReceiptLineOmit<ExtArgs> | null;
    include?: Prisma.GoodsReceiptLineInclude<ExtArgs> | null;
};
