import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type SaleLineModel = runtime.Types.Result.DefaultSelection<Prisma.$SaleLinePayload>;
export type AggregateSaleLine = {
    _count: SaleLineCountAggregateOutputType | null;
    _avg: SaleLineAvgAggregateOutputType | null;
    _sum: SaleLineSumAggregateOutputType | null;
    _min: SaleLineMinAggregateOutputType | null;
    _max: SaleLineMaxAggregateOutputType | null;
};
export type SaleLineAvgAggregateOutputType = {
    quantity: number | null;
    unitPrice: runtime.Decimal | null;
    discount: runtime.Decimal | null;
    vatRate: runtime.Decimal | null;
    vatAmount: runtime.Decimal | null;
};
export type SaleLineSumAggregateOutputType = {
    quantity: number | null;
    unitPrice: runtime.Decimal | null;
    discount: runtime.Decimal | null;
    vatRate: runtime.Decimal | null;
    vatAmount: runtime.Decimal | null;
};
export type SaleLineMinAggregateOutputType = {
    id: string | null;
    saleId: string | null;
    drugId: string | null;
    lotId: string | null;
    quantity: number | null;
    unitPrice: runtime.Decimal | null;
    discount: runtime.Decimal | null;
    vatRate: runtime.Decimal | null;
    vatAmount: runtime.Decimal | null;
};
export type SaleLineMaxAggregateOutputType = {
    id: string | null;
    saleId: string | null;
    drugId: string | null;
    lotId: string | null;
    quantity: number | null;
    unitPrice: runtime.Decimal | null;
    discount: runtime.Decimal | null;
    vatRate: runtime.Decimal | null;
    vatAmount: runtime.Decimal | null;
};
export type SaleLineCountAggregateOutputType = {
    id: number;
    saleId: number;
    drugId: number;
    lotId: number;
    quantity: number;
    unitPrice: number;
    discount: number;
    vatRate: number;
    vatAmount: number;
    _all: number;
};
export type SaleLineAvgAggregateInputType = {
    quantity?: true;
    unitPrice?: true;
    discount?: true;
    vatRate?: true;
    vatAmount?: true;
};
export type SaleLineSumAggregateInputType = {
    quantity?: true;
    unitPrice?: true;
    discount?: true;
    vatRate?: true;
    vatAmount?: true;
};
export type SaleLineMinAggregateInputType = {
    id?: true;
    saleId?: true;
    drugId?: true;
    lotId?: true;
    quantity?: true;
    unitPrice?: true;
    discount?: true;
    vatRate?: true;
    vatAmount?: true;
};
export type SaleLineMaxAggregateInputType = {
    id?: true;
    saleId?: true;
    drugId?: true;
    lotId?: true;
    quantity?: true;
    unitPrice?: true;
    discount?: true;
    vatRate?: true;
    vatAmount?: true;
};
export type SaleLineCountAggregateInputType = {
    id?: true;
    saleId?: true;
    drugId?: true;
    lotId?: true;
    quantity?: true;
    unitPrice?: true;
    discount?: true;
    vatRate?: true;
    vatAmount?: true;
    _all?: true;
};
export type SaleLineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SaleLineWhereInput;
    orderBy?: Prisma.SaleLineOrderByWithRelationInput | Prisma.SaleLineOrderByWithRelationInput[];
    cursor?: Prisma.SaleLineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SaleLineCountAggregateInputType;
    _avg?: SaleLineAvgAggregateInputType;
    _sum?: SaleLineSumAggregateInputType;
    _min?: SaleLineMinAggregateInputType;
    _max?: SaleLineMaxAggregateInputType;
};
export type GetSaleLineAggregateType<T extends SaleLineAggregateArgs> = {
    [P in keyof T & keyof AggregateSaleLine]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSaleLine[P]> : Prisma.GetScalarType<T[P], AggregateSaleLine[P]>;
};
export type SaleLineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SaleLineWhereInput;
    orderBy?: Prisma.SaleLineOrderByWithAggregationInput | Prisma.SaleLineOrderByWithAggregationInput[];
    by: Prisma.SaleLineScalarFieldEnum[] | Prisma.SaleLineScalarFieldEnum;
    having?: Prisma.SaleLineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SaleLineCountAggregateInputType | true;
    _avg?: SaleLineAvgAggregateInputType;
    _sum?: SaleLineSumAggregateInputType;
    _min?: SaleLineMinAggregateInputType;
    _max?: SaleLineMaxAggregateInputType;
};
export type SaleLineGroupByOutputType = {
    id: string;
    saleId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    unitPrice: runtime.Decimal;
    discount: runtime.Decimal;
    vatRate: runtime.Decimal;
    vatAmount: runtime.Decimal;
    _count: SaleLineCountAggregateOutputType | null;
    _avg: SaleLineAvgAggregateOutputType | null;
    _sum: SaleLineSumAggregateOutputType | null;
    _min: SaleLineMinAggregateOutputType | null;
    _max: SaleLineMaxAggregateOutputType | null;
};
export type GetSaleLineGroupByPayload<T extends SaleLineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SaleLineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SaleLineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SaleLineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SaleLineGroupByOutputType[P]>;
}>>;
export type SaleLineWhereInput = {
    AND?: Prisma.SaleLineWhereInput | Prisma.SaleLineWhereInput[];
    OR?: Prisma.SaleLineWhereInput[];
    NOT?: Prisma.SaleLineWhereInput | Prisma.SaleLineWhereInput[];
    id?: Prisma.StringFilter<"SaleLine"> | string;
    saleId?: Prisma.StringFilter<"SaleLine"> | string;
    drugId?: Prisma.StringFilter<"SaleLine"> | string;
    lotId?: Prisma.StringFilter<"SaleLine"> | string;
    quantity?: Prisma.IntFilter<"SaleLine"> | number;
    unitPrice?: Prisma.DecimalFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: Prisma.DecimalFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: Prisma.DecimalFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sale?: Prisma.XOR<Prisma.SaleScalarRelationFilter, Prisma.SaleWhereInput>;
    lot?: Prisma.XOR<Prisma.StockLotScalarRelationFilter, Prisma.StockLotWhereInput>;
};
export type SaleLineOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    discount?: Prisma.SortOrder;
    vatRate?: Prisma.SortOrder;
    vatAmount?: Prisma.SortOrder;
    sale?: Prisma.SaleOrderByWithRelationInput;
    lot?: Prisma.StockLotOrderByWithRelationInput;
};
export type SaleLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SaleLineWhereInput | Prisma.SaleLineWhereInput[];
    OR?: Prisma.SaleLineWhereInput[];
    NOT?: Prisma.SaleLineWhereInput | Prisma.SaleLineWhereInput[];
    saleId?: Prisma.StringFilter<"SaleLine"> | string;
    drugId?: Prisma.StringFilter<"SaleLine"> | string;
    lotId?: Prisma.StringFilter<"SaleLine"> | string;
    quantity?: Prisma.IntFilter<"SaleLine"> | number;
    unitPrice?: Prisma.DecimalFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: Prisma.DecimalFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: Prisma.DecimalFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sale?: Prisma.XOR<Prisma.SaleScalarRelationFilter, Prisma.SaleWhereInput>;
    lot?: Prisma.XOR<Prisma.StockLotScalarRelationFilter, Prisma.StockLotWhereInput>;
}, "id">;
export type SaleLineOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    discount?: Prisma.SortOrder;
    vatRate?: Prisma.SortOrder;
    vatAmount?: Prisma.SortOrder;
    _count?: Prisma.SaleLineCountOrderByAggregateInput;
    _avg?: Prisma.SaleLineAvgOrderByAggregateInput;
    _max?: Prisma.SaleLineMaxOrderByAggregateInput;
    _min?: Prisma.SaleLineMinOrderByAggregateInput;
    _sum?: Prisma.SaleLineSumOrderByAggregateInput;
};
export type SaleLineScalarWhereWithAggregatesInput = {
    AND?: Prisma.SaleLineScalarWhereWithAggregatesInput | Prisma.SaleLineScalarWhereWithAggregatesInput[];
    OR?: Prisma.SaleLineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SaleLineScalarWhereWithAggregatesInput | Prisma.SaleLineScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SaleLine"> | string;
    saleId?: Prisma.StringWithAggregatesFilter<"SaleLine"> | string;
    drugId?: Prisma.StringWithAggregatesFilter<"SaleLine"> | string;
    lotId?: Prisma.StringWithAggregatesFilter<"SaleLine"> | string;
    quantity?: Prisma.IntWithAggregatesFilter<"SaleLine"> | number;
    unitPrice?: Prisma.DecimalWithAggregatesFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: Prisma.DecimalWithAggregatesFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalWithAggregatesFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: Prisma.DecimalWithAggregatesFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SaleLineCreateInput = {
    id?: string;
    drugId: string;
    quantity: number;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    sale: Prisma.SaleCreateNestedOneWithoutLinesInput;
    lot: Prisma.StockLotCreateNestedOneWithoutSaleLinesInput;
};
export type SaleLineUncheckedCreateInput = {
    id?: string;
    saleId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SaleLineUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sale?: Prisma.SaleUpdateOneRequiredWithoutLinesNestedInput;
    lot?: Prisma.StockLotUpdateOneRequiredWithoutSaleLinesNestedInput;
};
export type SaleLineUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SaleLineCreateManyInput = {
    id?: string;
    saleId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SaleLineUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SaleLineUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SaleLineListRelationFilter = {
    every?: Prisma.SaleLineWhereInput;
    some?: Prisma.SaleLineWhereInput;
    none?: Prisma.SaleLineWhereInput;
};
export type SaleLineOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SaleLineCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    discount?: Prisma.SortOrder;
    vatRate?: Prisma.SortOrder;
    vatAmount?: Prisma.SortOrder;
};
export type SaleLineAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    discount?: Prisma.SortOrder;
    vatRate?: Prisma.SortOrder;
    vatAmount?: Prisma.SortOrder;
};
export type SaleLineMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    discount?: Prisma.SortOrder;
    vatRate?: Prisma.SortOrder;
    vatAmount?: Prisma.SortOrder;
};
export type SaleLineMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    discount?: Prisma.SortOrder;
    vatRate?: Prisma.SortOrder;
    vatAmount?: Prisma.SortOrder;
};
export type SaleLineSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    discount?: Prisma.SortOrder;
    vatRate?: Prisma.SortOrder;
    vatAmount?: Prisma.SortOrder;
};
export type SaleLineCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.SaleLineCreateWithoutLotInput, Prisma.SaleLineUncheckedCreateWithoutLotInput> | Prisma.SaleLineCreateWithoutLotInput[] | Prisma.SaleLineUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.SaleLineCreateOrConnectWithoutLotInput | Prisma.SaleLineCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.SaleLineCreateManyLotInputEnvelope;
    connect?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
};
export type SaleLineUncheckedCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.SaleLineCreateWithoutLotInput, Prisma.SaleLineUncheckedCreateWithoutLotInput> | Prisma.SaleLineCreateWithoutLotInput[] | Prisma.SaleLineUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.SaleLineCreateOrConnectWithoutLotInput | Prisma.SaleLineCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.SaleLineCreateManyLotInputEnvelope;
    connect?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
};
export type SaleLineUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.SaleLineCreateWithoutLotInput, Prisma.SaleLineUncheckedCreateWithoutLotInput> | Prisma.SaleLineCreateWithoutLotInput[] | Prisma.SaleLineUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.SaleLineCreateOrConnectWithoutLotInput | Prisma.SaleLineCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.SaleLineUpsertWithWhereUniqueWithoutLotInput | Prisma.SaleLineUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.SaleLineCreateManyLotInputEnvelope;
    set?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    disconnect?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    delete?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    connect?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    update?: Prisma.SaleLineUpdateWithWhereUniqueWithoutLotInput | Prisma.SaleLineUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.SaleLineUpdateManyWithWhereWithoutLotInput | Prisma.SaleLineUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.SaleLineScalarWhereInput | Prisma.SaleLineScalarWhereInput[];
};
export type SaleLineUncheckedUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.SaleLineCreateWithoutLotInput, Prisma.SaleLineUncheckedCreateWithoutLotInput> | Prisma.SaleLineCreateWithoutLotInput[] | Prisma.SaleLineUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.SaleLineCreateOrConnectWithoutLotInput | Prisma.SaleLineCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.SaleLineUpsertWithWhereUniqueWithoutLotInput | Prisma.SaleLineUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.SaleLineCreateManyLotInputEnvelope;
    set?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    disconnect?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    delete?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    connect?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    update?: Prisma.SaleLineUpdateWithWhereUniqueWithoutLotInput | Prisma.SaleLineUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.SaleLineUpdateManyWithWhereWithoutLotInput | Prisma.SaleLineUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.SaleLineScalarWhereInput | Prisma.SaleLineScalarWhereInput[];
};
export type SaleLineCreateNestedManyWithoutSaleInput = {
    create?: Prisma.XOR<Prisma.SaleLineCreateWithoutSaleInput, Prisma.SaleLineUncheckedCreateWithoutSaleInput> | Prisma.SaleLineCreateWithoutSaleInput[] | Prisma.SaleLineUncheckedCreateWithoutSaleInput[];
    connectOrCreate?: Prisma.SaleLineCreateOrConnectWithoutSaleInput | Prisma.SaleLineCreateOrConnectWithoutSaleInput[];
    createMany?: Prisma.SaleLineCreateManySaleInputEnvelope;
    connect?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
};
export type SaleLineUncheckedCreateNestedManyWithoutSaleInput = {
    create?: Prisma.XOR<Prisma.SaleLineCreateWithoutSaleInput, Prisma.SaleLineUncheckedCreateWithoutSaleInput> | Prisma.SaleLineCreateWithoutSaleInput[] | Prisma.SaleLineUncheckedCreateWithoutSaleInput[];
    connectOrCreate?: Prisma.SaleLineCreateOrConnectWithoutSaleInput | Prisma.SaleLineCreateOrConnectWithoutSaleInput[];
    createMany?: Prisma.SaleLineCreateManySaleInputEnvelope;
    connect?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
};
export type SaleLineUpdateManyWithoutSaleNestedInput = {
    create?: Prisma.XOR<Prisma.SaleLineCreateWithoutSaleInput, Prisma.SaleLineUncheckedCreateWithoutSaleInput> | Prisma.SaleLineCreateWithoutSaleInput[] | Prisma.SaleLineUncheckedCreateWithoutSaleInput[];
    connectOrCreate?: Prisma.SaleLineCreateOrConnectWithoutSaleInput | Prisma.SaleLineCreateOrConnectWithoutSaleInput[];
    upsert?: Prisma.SaleLineUpsertWithWhereUniqueWithoutSaleInput | Prisma.SaleLineUpsertWithWhereUniqueWithoutSaleInput[];
    createMany?: Prisma.SaleLineCreateManySaleInputEnvelope;
    set?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    disconnect?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    delete?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    connect?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    update?: Prisma.SaleLineUpdateWithWhereUniqueWithoutSaleInput | Prisma.SaleLineUpdateWithWhereUniqueWithoutSaleInput[];
    updateMany?: Prisma.SaleLineUpdateManyWithWhereWithoutSaleInput | Prisma.SaleLineUpdateManyWithWhereWithoutSaleInput[];
    deleteMany?: Prisma.SaleLineScalarWhereInput | Prisma.SaleLineScalarWhereInput[];
};
export type SaleLineUncheckedUpdateManyWithoutSaleNestedInput = {
    create?: Prisma.XOR<Prisma.SaleLineCreateWithoutSaleInput, Prisma.SaleLineUncheckedCreateWithoutSaleInput> | Prisma.SaleLineCreateWithoutSaleInput[] | Prisma.SaleLineUncheckedCreateWithoutSaleInput[];
    connectOrCreate?: Prisma.SaleLineCreateOrConnectWithoutSaleInput | Prisma.SaleLineCreateOrConnectWithoutSaleInput[];
    upsert?: Prisma.SaleLineUpsertWithWhereUniqueWithoutSaleInput | Prisma.SaleLineUpsertWithWhereUniqueWithoutSaleInput[];
    createMany?: Prisma.SaleLineCreateManySaleInputEnvelope;
    set?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    disconnect?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    delete?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    connect?: Prisma.SaleLineWhereUniqueInput | Prisma.SaleLineWhereUniqueInput[];
    update?: Prisma.SaleLineUpdateWithWhereUniqueWithoutSaleInput | Prisma.SaleLineUpdateWithWhereUniqueWithoutSaleInput[];
    updateMany?: Prisma.SaleLineUpdateManyWithWhereWithoutSaleInput | Prisma.SaleLineUpdateManyWithWhereWithoutSaleInput[];
    deleteMany?: Prisma.SaleLineScalarWhereInput | Prisma.SaleLineScalarWhereInput[];
};
export type SaleLineCreateWithoutLotInput = {
    id?: string;
    drugId: string;
    quantity: number;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    sale: Prisma.SaleCreateNestedOneWithoutLinesInput;
};
export type SaleLineUncheckedCreateWithoutLotInput = {
    id?: string;
    saleId: string;
    drugId: string;
    quantity: number;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SaleLineCreateOrConnectWithoutLotInput = {
    where: Prisma.SaleLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.SaleLineCreateWithoutLotInput, Prisma.SaleLineUncheckedCreateWithoutLotInput>;
};
export type SaleLineCreateManyLotInputEnvelope = {
    data: Prisma.SaleLineCreateManyLotInput | Prisma.SaleLineCreateManyLotInput[];
    skipDuplicates?: boolean;
};
export type SaleLineUpsertWithWhereUniqueWithoutLotInput = {
    where: Prisma.SaleLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.SaleLineUpdateWithoutLotInput, Prisma.SaleLineUncheckedUpdateWithoutLotInput>;
    create: Prisma.XOR<Prisma.SaleLineCreateWithoutLotInput, Prisma.SaleLineUncheckedCreateWithoutLotInput>;
};
export type SaleLineUpdateWithWhereUniqueWithoutLotInput = {
    where: Prisma.SaleLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.SaleLineUpdateWithoutLotInput, Prisma.SaleLineUncheckedUpdateWithoutLotInput>;
};
export type SaleLineUpdateManyWithWhereWithoutLotInput = {
    where: Prisma.SaleLineScalarWhereInput;
    data: Prisma.XOR<Prisma.SaleLineUpdateManyMutationInput, Prisma.SaleLineUncheckedUpdateManyWithoutLotInput>;
};
export type SaleLineScalarWhereInput = {
    AND?: Prisma.SaleLineScalarWhereInput | Prisma.SaleLineScalarWhereInput[];
    OR?: Prisma.SaleLineScalarWhereInput[];
    NOT?: Prisma.SaleLineScalarWhereInput | Prisma.SaleLineScalarWhereInput[];
    id?: Prisma.StringFilter<"SaleLine"> | string;
    saleId?: Prisma.StringFilter<"SaleLine"> | string;
    drugId?: Prisma.StringFilter<"SaleLine"> | string;
    lotId?: Prisma.StringFilter<"SaleLine"> | string;
    quantity?: Prisma.IntFilter<"SaleLine"> | number;
    unitPrice?: Prisma.DecimalFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: Prisma.DecimalFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: Prisma.DecimalFilter<"SaleLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SaleLineCreateWithoutSaleInput = {
    id?: string;
    drugId: string;
    quantity: number;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    lot: Prisma.StockLotCreateNestedOneWithoutSaleLinesInput;
};
export type SaleLineUncheckedCreateWithoutSaleInput = {
    id?: string;
    drugId: string;
    lotId: string;
    quantity: number;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SaleLineCreateOrConnectWithoutSaleInput = {
    where: Prisma.SaleLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.SaleLineCreateWithoutSaleInput, Prisma.SaleLineUncheckedCreateWithoutSaleInput>;
};
export type SaleLineCreateManySaleInputEnvelope = {
    data: Prisma.SaleLineCreateManySaleInput | Prisma.SaleLineCreateManySaleInput[];
    skipDuplicates?: boolean;
};
export type SaleLineUpsertWithWhereUniqueWithoutSaleInput = {
    where: Prisma.SaleLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.SaleLineUpdateWithoutSaleInput, Prisma.SaleLineUncheckedUpdateWithoutSaleInput>;
    create: Prisma.XOR<Prisma.SaleLineCreateWithoutSaleInput, Prisma.SaleLineUncheckedCreateWithoutSaleInput>;
};
export type SaleLineUpdateWithWhereUniqueWithoutSaleInput = {
    where: Prisma.SaleLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.SaleLineUpdateWithoutSaleInput, Prisma.SaleLineUncheckedUpdateWithoutSaleInput>;
};
export type SaleLineUpdateManyWithWhereWithoutSaleInput = {
    where: Prisma.SaleLineScalarWhereInput;
    data: Prisma.XOR<Prisma.SaleLineUpdateManyMutationInput, Prisma.SaleLineUncheckedUpdateManyWithoutSaleInput>;
};
export type SaleLineCreateManyLotInput = {
    id?: string;
    saleId: string;
    drugId: string;
    quantity: number;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SaleLineUpdateWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    sale?: Prisma.SaleUpdateOneRequiredWithoutLinesNestedInput;
};
export type SaleLineUncheckedUpdateWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SaleLineUncheckedUpdateManyWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SaleLineCreateManySaleInput = {
    id?: string;
    drugId: string;
    lotId: string;
    quantity: number;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SaleLineUpdateWithoutSaleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lot?: Prisma.StockLotUpdateOneRequiredWithoutSaleLinesNestedInput;
};
export type SaleLineUncheckedUpdateWithoutSaleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SaleLineUncheckedUpdateManyWithoutSaleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    discount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type SaleLineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    saleId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    unitPrice?: boolean;
    discount?: boolean;
    vatRate?: boolean;
    vatAmount?: boolean;
    sale?: boolean | Prisma.SaleDefaultArgs<ExtArgs>;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["saleLine"]>;
export type SaleLineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    saleId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    unitPrice?: boolean;
    discount?: boolean;
    vatRate?: boolean;
    vatAmount?: boolean;
    sale?: boolean | Prisma.SaleDefaultArgs<ExtArgs>;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["saleLine"]>;
export type SaleLineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    saleId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    unitPrice?: boolean;
    discount?: boolean;
    vatRate?: boolean;
    vatAmount?: boolean;
    sale?: boolean | Prisma.SaleDefaultArgs<ExtArgs>;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["saleLine"]>;
export type SaleLineSelectScalar = {
    id?: boolean;
    saleId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    unitPrice?: boolean;
    discount?: boolean;
    vatRate?: boolean;
    vatAmount?: boolean;
};
export type SaleLineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "saleId" | "drugId" | "lotId" | "quantity" | "unitPrice" | "discount" | "vatRate" | "vatAmount", ExtArgs["result"]["saleLine"]>;
export type SaleLineInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sale?: boolean | Prisma.SaleDefaultArgs<ExtArgs>;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
};
export type SaleLineIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sale?: boolean | Prisma.SaleDefaultArgs<ExtArgs>;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
};
export type SaleLineIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sale?: boolean | Prisma.SaleDefaultArgs<ExtArgs>;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
};
export type $SaleLinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SaleLine";
    objects: {
        sale: Prisma.$SalePayload<ExtArgs>;
        lot: Prisma.$StockLotPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        saleId: string;
        drugId: string;
        lotId: string;
        quantity: number;
        unitPrice: runtime.Decimal;
        discount: runtime.Decimal;
        vatRate: runtime.Decimal;
        vatAmount: runtime.Decimal;
    }, ExtArgs["result"]["saleLine"]>;
    composites: {};
};
export type SaleLineGetPayload<S extends boolean | null | undefined | SaleLineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SaleLinePayload, S>;
export type SaleLineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SaleLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SaleLineCountAggregateInputType | true;
};
export interface SaleLineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SaleLine'];
        meta: {
            name: 'SaleLine';
        };
    };
    findUnique<T extends SaleLineFindUniqueArgs>(args: Prisma.SelectSubset<T, SaleLineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SaleLineClient<runtime.Types.Result.GetResult<Prisma.$SaleLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SaleLineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SaleLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SaleLineClient<runtime.Types.Result.GetResult<Prisma.$SaleLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SaleLineFindFirstArgs>(args?: Prisma.SelectSubset<T, SaleLineFindFirstArgs<ExtArgs>>): Prisma.Prisma__SaleLineClient<runtime.Types.Result.GetResult<Prisma.$SaleLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SaleLineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SaleLineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SaleLineClient<runtime.Types.Result.GetResult<Prisma.$SaleLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SaleLineFindManyArgs>(args?: Prisma.SelectSubset<T, SaleLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SaleLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SaleLineCreateArgs>(args: Prisma.SelectSubset<T, SaleLineCreateArgs<ExtArgs>>): Prisma.Prisma__SaleLineClient<runtime.Types.Result.GetResult<Prisma.$SaleLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SaleLineCreateManyArgs>(args?: Prisma.SelectSubset<T, SaleLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SaleLineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SaleLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SaleLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SaleLineDeleteArgs>(args: Prisma.SelectSubset<T, SaleLineDeleteArgs<ExtArgs>>): Prisma.Prisma__SaleLineClient<runtime.Types.Result.GetResult<Prisma.$SaleLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SaleLineUpdateArgs>(args: Prisma.SelectSubset<T, SaleLineUpdateArgs<ExtArgs>>): Prisma.Prisma__SaleLineClient<runtime.Types.Result.GetResult<Prisma.$SaleLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SaleLineDeleteManyArgs>(args?: Prisma.SelectSubset<T, SaleLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SaleLineUpdateManyArgs>(args: Prisma.SelectSubset<T, SaleLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SaleLineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SaleLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SaleLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SaleLineUpsertArgs>(args: Prisma.SelectSubset<T, SaleLineUpsertArgs<ExtArgs>>): Prisma.Prisma__SaleLineClient<runtime.Types.Result.GetResult<Prisma.$SaleLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SaleLineCountArgs>(args?: Prisma.Subset<T, SaleLineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SaleLineCountAggregateOutputType> : number>;
    aggregate<T extends SaleLineAggregateArgs>(args: Prisma.Subset<T, SaleLineAggregateArgs>): Prisma.PrismaPromise<GetSaleLineAggregateType<T>>;
    groupBy<T extends SaleLineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SaleLineGroupByArgs['orderBy'];
    } : {
        orderBy?: SaleLineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SaleLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSaleLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SaleLineFieldRefs;
}
export interface Prisma__SaleLineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    sale<T extends Prisma.SaleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SaleDefaultArgs<ExtArgs>>): Prisma.Prisma__SaleClient<runtime.Types.Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    lot<T extends Prisma.StockLotDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.StockLotDefaultArgs<ExtArgs>>): Prisma.Prisma__StockLotClient<runtime.Types.Result.GetResult<Prisma.$StockLotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SaleLineFieldRefs {
    readonly id: Prisma.FieldRef<"SaleLine", 'String'>;
    readonly saleId: Prisma.FieldRef<"SaleLine", 'String'>;
    readonly drugId: Prisma.FieldRef<"SaleLine", 'String'>;
    readonly lotId: Prisma.FieldRef<"SaleLine", 'String'>;
    readonly quantity: Prisma.FieldRef<"SaleLine", 'Int'>;
    readonly unitPrice: Prisma.FieldRef<"SaleLine", 'Decimal'>;
    readonly discount: Prisma.FieldRef<"SaleLine", 'Decimal'>;
    readonly vatRate: Prisma.FieldRef<"SaleLine", 'Decimal'>;
    readonly vatAmount: Prisma.FieldRef<"SaleLine", 'Decimal'>;
}
export type SaleLineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleLineSelect<ExtArgs> | null;
    omit?: Prisma.SaleLineOmit<ExtArgs> | null;
    include?: Prisma.SaleLineInclude<ExtArgs> | null;
    where: Prisma.SaleLineWhereUniqueInput;
};
export type SaleLineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleLineSelect<ExtArgs> | null;
    omit?: Prisma.SaleLineOmit<ExtArgs> | null;
    include?: Prisma.SaleLineInclude<ExtArgs> | null;
    where: Prisma.SaleLineWhereUniqueInput;
};
export type SaleLineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleLineSelect<ExtArgs> | null;
    omit?: Prisma.SaleLineOmit<ExtArgs> | null;
    include?: Prisma.SaleLineInclude<ExtArgs> | null;
    where?: Prisma.SaleLineWhereInput;
    orderBy?: Prisma.SaleLineOrderByWithRelationInput | Prisma.SaleLineOrderByWithRelationInput[];
    cursor?: Prisma.SaleLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SaleLineScalarFieldEnum | Prisma.SaleLineScalarFieldEnum[];
};
export type SaleLineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleLineSelect<ExtArgs> | null;
    omit?: Prisma.SaleLineOmit<ExtArgs> | null;
    include?: Prisma.SaleLineInclude<ExtArgs> | null;
    where?: Prisma.SaleLineWhereInput;
    orderBy?: Prisma.SaleLineOrderByWithRelationInput | Prisma.SaleLineOrderByWithRelationInput[];
    cursor?: Prisma.SaleLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SaleLineScalarFieldEnum | Prisma.SaleLineScalarFieldEnum[];
};
export type SaleLineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleLineSelect<ExtArgs> | null;
    omit?: Prisma.SaleLineOmit<ExtArgs> | null;
    include?: Prisma.SaleLineInclude<ExtArgs> | null;
    where?: Prisma.SaleLineWhereInput;
    orderBy?: Prisma.SaleLineOrderByWithRelationInput | Prisma.SaleLineOrderByWithRelationInput[];
    cursor?: Prisma.SaleLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SaleLineScalarFieldEnum | Prisma.SaleLineScalarFieldEnum[];
};
export type SaleLineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleLineSelect<ExtArgs> | null;
    omit?: Prisma.SaleLineOmit<ExtArgs> | null;
    include?: Prisma.SaleLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SaleLineCreateInput, Prisma.SaleLineUncheckedCreateInput>;
};
export type SaleLineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SaleLineCreateManyInput | Prisma.SaleLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SaleLineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleLineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SaleLineOmit<ExtArgs> | null;
    data: Prisma.SaleLineCreateManyInput | Prisma.SaleLineCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SaleLineIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SaleLineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleLineSelect<ExtArgs> | null;
    omit?: Prisma.SaleLineOmit<ExtArgs> | null;
    include?: Prisma.SaleLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SaleLineUpdateInput, Prisma.SaleLineUncheckedUpdateInput>;
    where: Prisma.SaleLineWhereUniqueInput;
};
export type SaleLineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SaleLineUpdateManyMutationInput, Prisma.SaleLineUncheckedUpdateManyInput>;
    where?: Prisma.SaleLineWhereInput;
    limit?: number;
};
export type SaleLineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleLineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SaleLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SaleLineUpdateManyMutationInput, Prisma.SaleLineUncheckedUpdateManyInput>;
    where?: Prisma.SaleLineWhereInput;
    limit?: number;
    include?: Prisma.SaleLineIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SaleLineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleLineSelect<ExtArgs> | null;
    omit?: Prisma.SaleLineOmit<ExtArgs> | null;
    include?: Prisma.SaleLineInclude<ExtArgs> | null;
    where: Prisma.SaleLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.SaleLineCreateInput, Prisma.SaleLineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SaleLineUpdateInput, Prisma.SaleLineUncheckedUpdateInput>;
};
export type SaleLineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleLineSelect<ExtArgs> | null;
    omit?: Prisma.SaleLineOmit<ExtArgs> | null;
    include?: Prisma.SaleLineInclude<ExtArgs> | null;
    where: Prisma.SaleLineWhereUniqueInput;
};
export type SaleLineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SaleLineWhereInput;
    limit?: number;
};
export type SaleLineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleLineSelect<ExtArgs> | null;
    omit?: Prisma.SaleLineOmit<ExtArgs> | null;
    include?: Prisma.SaleLineInclude<ExtArgs> | null;
};
