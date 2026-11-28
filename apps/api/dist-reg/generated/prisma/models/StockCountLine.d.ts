import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type StockCountLineModel = runtime.Types.Result.DefaultSelection<Prisma.$StockCountLinePayload>;
export type AggregateStockCountLine = {
    _count: StockCountLineCountAggregateOutputType | null;
    _avg: StockCountLineAvgAggregateOutputType | null;
    _sum: StockCountLineSumAggregateOutputType | null;
    _min: StockCountLineMinAggregateOutputType | null;
    _max: StockCountLineMaxAggregateOutputType | null;
};
export type StockCountLineAvgAggregateOutputType = {
    qtyExpected: number | null;
    qtyCounted: number | null;
};
export type StockCountLineSumAggregateOutputType = {
    qtyExpected: number | null;
    qtyCounted: number | null;
};
export type StockCountLineMinAggregateOutputType = {
    id: string | null;
    stockCountId: string | null;
    lotId: string | null;
    qtyExpected: number | null;
    qtyCounted: number | null;
};
export type StockCountLineMaxAggregateOutputType = {
    id: string | null;
    stockCountId: string | null;
    lotId: string | null;
    qtyExpected: number | null;
    qtyCounted: number | null;
};
export type StockCountLineCountAggregateOutputType = {
    id: number;
    stockCountId: number;
    lotId: number;
    qtyExpected: number;
    qtyCounted: number;
    _all: number;
};
export type StockCountLineAvgAggregateInputType = {
    qtyExpected?: true;
    qtyCounted?: true;
};
export type StockCountLineSumAggregateInputType = {
    qtyExpected?: true;
    qtyCounted?: true;
};
export type StockCountLineMinAggregateInputType = {
    id?: true;
    stockCountId?: true;
    lotId?: true;
    qtyExpected?: true;
    qtyCounted?: true;
};
export type StockCountLineMaxAggregateInputType = {
    id?: true;
    stockCountId?: true;
    lotId?: true;
    qtyExpected?: true;
    qtyCounted?: true;
};
export type StockCountLineCountAggregateInputType = {
    id?: true;
    stockCountId?: true;
    lotId?: true;
    qtyExpected?: true;
    qtyCounted?: true;
    _all?: true;
};
export type StockCountLineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockCountLineWhereInput;
    orderBy?: Prisma.StockCountLineOrderByWithRelationInput | Prisma.StockCountLineOrderByWithRelationInput[];
    cursor?: Prisma.StockCountLineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StockCountLineCountAggregateInputType;
    _avg?: StockCountLineAvgAggregateInputType;
    _sum?: StockCountLineSumAggregateInputType;
    _min?: StockCountLineMinAggregateInputType;
    _max?: StockCountLineMaxAggregateInputType;
};
export type GetStockCountLineAggregateType<T extends StockCountLineAggregateArgs> = {
    [P in keyof T & keyof AggregateStockCountLine]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStockCountLine[P]> : Prisma.GetScalarType<T[P], AggregateStockCountLine[P]>;
};
export type StockCountLineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockCountLineWhereInput;
    orderBy?: Prisma.StockCountLineOrderByWithAggregationInput | Prisma.StockCountLineOrderByWithAggregationInput[];
    by: Prisma.StockCountLineScalarFieldEnum[] | Prisma.StockCountLineScalarFieldEnum;
    having?: Prisma.StockCountLineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StockCountLineCountAggregateInputType | true;
    _avg?: StockCountLineAvgAggregateInputType;
    _sum?: StockCountLineSumAggregateInputType;
    _min?: StockCountLineMinAggregateInputType;
    _max?: StockCountLineMaxAggregateInputType;
};
export type StockCountLineGroupByOutputType = {
    id: string;
    stockCountId: string;
    lotId: string;
    qtyExpected: number;
    qtyCounted: number | null;
    _count: StockCountLineCountAggregateOutputType | null;
    _avg: StockCountLineAvgAggregateOutputType | null;
    _sum: StockCountLineSumAggregateOutputType | null;
    _min: StockCountLineMinAggregateOutputType | null;
    _max: StockCountLineMaxAggregateOutputType | null;
};
export type GetStockCountLineGroupByPayload<T extends StockCountLineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StockCountLineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StockCountLineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StockCountLineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StockCountLineGroupByOutputType[P]>;
}>>;
export type StockCountLineWhereInput = {
    AND?: Prisma.StockCountLineWhereInput | Prisma.StockCountLineWhereInput[];
    OR?: Prisma.StockCountLineWhereInput[];
    NOT?: Prisma.StockCountLineWhereInput | Prisma.StockCountLineWhereInput[];
    id?: Prisma.StringFilter<"StockCountLine"> | string;
    stockCountId?: Prisma.StringFilter<"StockCountLine"> | string;
    lotId?: Prisma.StringFilter<"StockCountLine"> | string;
    qtyExpected?: Prisma.IntFilter<"StockCountLine"> | number;
    qtyCounted?: Prisma.IntNullableFilter<"StockCountLine"> | number | null;
    stockCount?: Prisma.XOR<Prisma.StockCountScalarRelationFilter, Prisma.StockCountWhereInput>;
};
export type StockCountLineOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    stockCountId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    qtyExpected?: Prisma.SortOrder;
    qtyCounted?: Prisma.SortOrderInput | Prisma.SortOrder;
    stockCount?: Prisma.StockCountOrderByWithRelationInput;
};
export type StockCountLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.StockCountLineWhereInput | Prisma.StockCountLineWhereInput[];
    OR?: Prisma.StockCountLineWhereInput[];
    NOT?: Prisma.StockCountLineWhereInput | Prisma.StockCountLineWhereInput[];
    stockCountId?: Prisma.StringFilter<"StockCountLine"> | string;
    lotId?: Prisma.StringFilter<"StockCountLine"> | string;
    qtyExpected?: Prisma.IntFilter<"StockCountLine"> | number;
    qtyCounted?: Prisma.IntNullableFilter<"StockCountLine"> | number | null;
    stockCount?: Prisma.XOR<Prisma.StockCountScalarRelationFilter, Prisma.StockCountWhereInput>;
}, "id">;
export type StockCountLineOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    stockCountId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    qtyExpected?: Prisma.SortOrder;
    qtyCounted?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.StockCountLineCountOrderByAggregateInput;
    _avg?: Prisma.StockCountLineAvgOrderByAggregateInput;
    _max?: Prisma.StockCountLineMaxOrderByAggregateInput;
    _min?: Prisma.StockCountLineMinOrderByAggregateInput;
    _sum?: Prisma.StockCountLineSumOrderByAggregateInput;
};
export type StockCountLineScalarWhereWithAggregatesInput = {
    AND?: Prisma.StockCountLineScalarWhereWithAggregatesInput | Prisma.StockCountLineScalarWhereWithAggregatesInput[];
    OR?: Prisma.StockCountLineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StockCountLineScalarWhereWithAggregatesInput | Prisma.StockCountLineScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"StockCountLine"> | string;
    stockCountId?: Prisma.StringWithAggregatesFilter<"StockCountLine"> | string;
    lotId?: Prisma.StringWithAggregatesFilter<"StockCountLine"> | string;
    qtyExpected?: Prisma.IntWithAggregatesFilter<"StockCountLine"> | number;
    qtyCounted?: Prisma.IntNullableWithAggregatesFilter<"StockCountLine"> | number | null;
};
export type StockCountLineCreateInput = {
    id?: string;
    lotId: string;
    qtyExpected: number;
    qtyCounted?: number | null;
    stockCount: Prisma.StockCountCreateNestedOneWithoutLinesInput;
};
export type StockCountLineUncheckedCreateInput = {
    id?: string;
    stockCountId: string;
    lotId: string;
    qtyExpected: number;
    qtyCounted?: number | null;
};
export type StockCountLineUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    qtyExpected?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyCounted?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    stockCount?: Prisma.StockCountUpdateOneRequiredWithoutLinesNestedInput;
};
export type StockCountLineUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stockCountId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    qtyExpected?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyCounted?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type StockCountLineCreateManyInput = {
    id?: string;
    stockCountId: string;
    lotId: string;
    qtyExpected: number;
    qtyCounted?: number | null;
};
export type StockCountLineUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    qtyExpected?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyCounted?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type StockCountLineUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stockCountId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    qtyExpected?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyCounted?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type StockCountLineListRelationFilter = {
    every?: Prisma.StockCountLineWhereInput;
    some?: Prisma.StockCountLineWhereInput;
    none?: Prisma.StockCountLineWhereInput;
};
export type StockCountLineOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StockCountLineCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stockCountId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    qtyExpected?: Prisma.SortOrder;
    qtyCounted?: Prisma.SortOrder;
};
export type StockCountLineAvgOrderByAggregateInput = {
    qtyExpected?: Prisma.SortOrder;
    qtyCounted?: Prisma.SortOrder;
};
export type StockCountLineMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stockCountId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    qtyExpected?: Prisma.SortOrder;
    qtyCounted?: Prisma.SortOrder;
};
export type StockCountLineMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stockCountId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    qtyExpected?: Prisma.SortOrder;
    qtyCounted?: Prisma.SortOrder;
};
export type StockCountLineSumOrderByAggregateInput = {
    qtyExpected?: Prisma.SortOrder;
    qtyCounted?: Prisma.SortOrder;
};
export type StockCountLineCreateNestedManyWithoutStockCountInput = {
    create?: Prisma.XOR<Prisma.StockCountLineCreateWithoutStockCountInput, Prisma.StockCountLineUncheckedCreateWithoutStockCountInput> | Prisma.StockCountLineCreateWithoutStockCountInput[] | Prisma.StockCountLineUncheckedCreateWithoutStockCountInput[];
    connectOrCreate?: Prisma.StockCountLineCreateOrConnectWithoutStockCountInput | Prisma.StockCountLineCreateOrConnectWithoutStockCountInput[];
    createMany?: Prisma.StockCountLineCreateManyStockCountInputEnvelope;
    connect?: Prisma.StockCountLineWhereUniqueInput | Prisma.StockCountLineWhereUniqueInput[];
};
export type StockCountLineUncheckedCreateNestedManyWithoutStockCountInput = {
    create?: Prisma.XOR<Prisma.StockCountLineCreateWithoutStockCountInput, Prisma.StockCountLineUncheckedCreateWithoutStockCountInput> | Prisma.StockCountLineCreateWithoutStockCountInput[] | Prisma.StockCountLineUncheckedCreateWithoutStockCountInput[];
    connectOrCreate?: Prisma.StockCountLineCreateOrConnectWithoutStockCountInput | Prisma.StockCountLineCreateOrConnectWithoutStockCountInput[];
    createMany?: Prisma.StockCountLineCreateManyStockCountInputEnvelope;
    connect?: Prisma.StockCountLineWhereUniqueInput | Prisma.StockCountLineWhereUniqueInput[];
};
export type StockCountLineUpdateManyWithoutStockCountNestedInput = {
    create?: Prisma.XOR<Prisma.StockCountLineCreateWithoutStockCountInput, Prisma.StockCountLineUncheckedCreateWithoutStockCountInput> | Prisma.StockCountLineCreateWithoutStockCountInput[] | Prisma.StockCountLineUncheckedCreateWithoutStockCountInput[];
    connectOrCreate?: Prisma.StockCountLineCreateOrConnectWithoutStockCountInput | Prisma.StockCountLineCreateOrConnectWithoutStockCountInput[];
    upsert?: Prisma.StockCountLineUpsertWithWhereUniqueWithoutStockCountInput | Prisma.StockCountLineUpsertWithWhereUniqueWithoutStockCountInput[];
    createMany?: Prisma.StockCountLineCreateManyStockCountInputEnvelope;
    set?: Prisma.StockCountLineWhereUniqueInput | Prisma.StockCountLineWhereUniqueInput[];
    disconnect?: Prisma.StockCountLineWhereUniqueInput | Prisma.StockCountLineWhereUniqueInput[];
    delete?: Prisma.StockCountLineWhereUniqueInput | Prisma.StockCountLineWhereUniqueInput[];
    connect?: Prisma.StockCountLineWhereUniqueInput | Prisma.StockCountLineWhereUniqueInput[];
    update?: Prisma.StockCountLineUpdateWithWhereUniqueWithoutStockCountInput | Prisma.StockCountLineUpdateWithWhereUniqueWithoutStockCountInput[];
    updateMany?: Prisma.StockCountLineUpdateManyWithWhereWithoutStockCountInput | Prisma.StockCountLineUpdateManyWithWhereWithoutStockCountInput[];
    deleteMany?: Prisma.StockCountLineScalarWhereInput | Prisma.StockCountLineScalarWhereInput[];
};
export type StockCountLineUncheckedUpdateManyWithoutStockCountNestedInput = {
    create?: Prisma.XOR<Prisma.StockCountLineCreateWithoutStockCountInput, Prisma.StockCountLineUncheckedCreateWithoutStockCountInput> | Prisma.StockCountLineCreateWithoutStockCountInput[] | Prisma.StockCountLineUncheckedCreateWithoutStockCountInput[];
    connectOrCreate?: Prisma.StockCountLineCreateOrConnectWithoutStockCountInput | Prisma.StockCountLineCreateOrConnectWithoutStockCountInput[];
    upsert?: Prisma.StockCountLineUpsertWithWhereUniqueWithoutStockCountInput | Prisma.StockCountLineUpsertWithWhereUniqueWithoutStockCountInput[];
    createMany?: Prisma.StockCountLineCreateManyStockCountInputEnvelope;
    set?: Prisma.StockCountLineWhereUniqueInput | Prisma.StockCountLineWhereUniqueInput[];
    disconnect?: Prisma.StockCountLineWhereUniqueInput | Prisma.StockCountLineWhereUniqueInput[];
    delete?: Prisma.StockCountLineWhereUniqueInput | Prisma.StockCountLineWhereUniqueInput[];
    connect?: Prisma.StockCountLineWhereUniqueInput | Prisma.StockCountLineWhereUniqueInput[];
    update?: Prisma.StockCountLineUpdateWithWhereUniqueWithoutStockCountInput | Prisma.StockCountLineUpdateWithWhereUniqueWithoutStockCountInput[];
    updateMany?: Prisma.StockCountLineUpdateManyWithWhereWithoutStockCountInput | Prisma.StockCountLineUpdateManyWithWhereWithoutStockCountInput[];
    deleteMany?: Prisma.StockCountLineScalarWhereInput | Prisma.StockCountLineScalarWhereInput[];
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type StockCountLineCreateWithoutStockCountInput = {
    id?: string;
    lotId: string;
    qtyExpected: number;
    qtyCounted?: number | null;
};
export type StockCountLineUncheckedCreateWithoutStockCountInput = {
    id?: string;
    lotId: string;
    qtyExpected: number;
    qtyCounted?: number | null;
};
export type StockCountLineCreateOrConnectWithoutStockCountInput = {
    where: Prisma.StockCountLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockCountLineCreateWithoutStockCountInput, Prisma.StockCountLineUncheckedCreateWithoutStockCountInput>;
};
export type StockCountLineCreateManyStockCountInputEnvelope = {
    data: Prisma.StockCountLineCreateManyStockCountInput | Prisma.StockCountLineCreateManyStockCountInput[];
    skipDuplicates?: boolean;
};
export type StockCountLineUpsertWithWhereUniqueWithoutStockCountInput = {
    where: Prisma.StockCountLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.StockCountLineUpdateWithoutStockCountInput, Prisma.StockCountLineUncheckedUpdateWithoutStockCountInput>;
    create: Prisma.XOR<Prisma.StockCountLineCreateWithoutStockCountInput, Prisma.StockCountLineUncheckedCreateWithoutStockCountInput>;
};
export type StockCountLineUpdateWithWhereUniqueWithoutStockCountInput = {
    where: Prisma.StockCountLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.StockCountLineUpdateWithoutStockCountInput, Prisma.StockCountLineUncheckedUpdateWithoutStockCountInput>;
};
export type StockCountLineUpdateManyWithWhereWithoutStockCountInput = {
    where: Prisma.StockCountLineScalarWhereInput;
    data: Prisma.XOR<Prisma.StockCountLineUpdateManyMutationInput, Prisma.StockCountLineUncheckedUpdateManyWithoutStockCountInput>;
};
export type StockCountLineScalarWhereInput = {
    AND?: Prisma.StockCountLineScalarWhereInput | Prisma.StockCountLineScalarWhereInput[];
    OR?: Prisma.StockCountLineScalarWhereInput[];
    NOT?: Prisma.StockCountLineScalarWhereInput | Prisma.StockCountLineScalarWhereInput[];
    id?: Prisma.StringFilter<"StockCountLine"> | string;
    stockCountId?: Prisma.StringFilter<"StockCountLine"> | string;
    lotId?: Prisma.StringFilter<"StockCountLine"> | string;
    qtyExpected?: Prisma.IntFilter<"StockCountLine"> | number;
    qtyCounted?: Prisma.IntNullableFilter<"StockCountLine"> | number | null;
};
export type StockCountLineCreateManyStockCountInput = {
    id?: string;
    lotId: string;
    qtyExpected: number;
    qtyCounted?: number | null;
};
export type StockCountLineUpdateWithoutStockCountInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    qtyExpected?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyCounted?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type StockCountLineUncheckedUpdateWithoutStockCountInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    qtyExpected?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyCounted?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type StockCountLineUncheckedUpdateManyWithoutStockCountInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    qtyExpected?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyCounted?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type StockCountLineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stockCountId?: boolean;
    lotId?: boolean;
    qtyExpected?: boolean;
    qtyCounted?: boolean;
    stockCount?: boolean | Prisma.StockCountDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stockCountLine"]>;
export type StockCountLineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stockCountId?: boolean;
    lotId?: boolean;
    qtyExpected?: boolean;
    qtyCounted?: boolean;
    stockCount?: boolean | Prisma.StockCountDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stockCountLine"]>;
export type StockCountLineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stockCountId?: boolean;
    lotId?: boolean;
    qtyExpected?: boolean;
    qtyCounted?: boolean;
    stockCount?: boolean | Prisma.StockCountDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stockCountLine"]>;
export type StockCountLineSelectScalar = {
    id?: boolean;
    stockCountId?: boolean;
    lotId?: boolean;
    qtyExpected?: boolean;
    qtyCounted?: boolean;
};
export type StockCountLineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "stockCountId" | "lotId" | "qtyExpected" | "qtyCounted", ExtArgs["result"]["stockCountLine"]>;
export type StockCountLineInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stockCount?: boolean | Prisma.StockCountDefaultArgs<ExtArgs>;
};
export type StockCountLineIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stockCount?: boolean | Prisma.StockCountDefaultArgs<ExtArgs>;
};
export type StockCountLineIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stockCount?: boolean | Prisma.StockCountDefaultArgs<ExtArgs>;
};
export type $StockCountLinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StockCountLine";
    objects: {
        stockCount: Prisma.$StockCountPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        stockCountId: string;
        lotId: string;
        qtyExpected: number;
        qtyCounted: number | null;
    }, ExtArgs["result"]["stockCountLine"]>;
    composites: {};
};
export type StockCountLineGetPayload<S extends boolean | null | undefined | StockCountLineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StockCountLinePayload, S>;
export type StockCountLineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StockCountLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StockCountLineCountAggregateInputType | true;
};
export interface StockCountLineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StockCountLine'];
        meta: {
            name: 'StockCountLine';
        };
    };
    findUnique<T extends StockCountLineFindUniqueArgs>(args: Prisma.SelectSubset<T, StockCountLineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StockCountLineClient<runtime.Types.Result.GetResult<Prisma.$StockCountLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StockCountLineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StockCountLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StockCountLineClient<runtime.Types.Result.GetResult<Prisma.$StockCountLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StockCountLineFindFirstArgs>(args?: Prisma.SelectSubset<T, StockCountLineFindFirstArgs<ExtArgs>>): Prisma.Prisma__StockCountLineClient<runtime.Types.Result.GetResult<Prisma.$StockCountLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StockCountLineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StockCountLineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StockCountLineClient<runtime.Types.Result.GetResult<Prisma.$StockCountLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StockCountLineFindManyArgs>(args?: Prisma.SelectSubset<T, StockCountLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockCountLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StockCountLineCreateArgs>(args: Prisma.SelectSubset<T, StockCountLineCreateArgs<ExtArgs>>): Prisma.Prisma__StockCountLineClient<runtime.Types.Result.GetResult<Prisma.$StockCountLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StockCountLineCreateManyArgs>(args?: Prisma.SelectSubset<T, StockCountLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StockCountLineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StockCountLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockCountLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StockCountLineDeleteArgs>(args: Prisma.SelectSubset<T, StockCountLineDeleteArgs<ExtArgs>>): Prisma.Prisma__StockCountLineClient<runtime.Types.Result.GetResult<Prisma.$StockCountLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StockCountLineUpdateArgs>(args: Prisma.SelectSubset<T, StockCountLineUpdateArgs<ExtArgs>>): Prisma.Prisma__StockCountLineClient<runtime.Types.Result.GetResult<Prisma.$StockCountLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StockCountLineDeleteManyArgs>(args?: Prisma.SelectSubset<T, StockCountLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StockCountLineUpdateManyArgs>(args: Prisma.SelectSubset<T, StockCountLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StockCountLineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StockCountLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockCountLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StockCountLineUpsertArgs>(args: Prisma.SelectSubset<T, StockCountLineUpsertArgs<ExtArgs>>): Prisma.Prisma__StockCountLineClient<runtime.Types.Result.GetResult<Prisma.$StockCountLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StockCountLineCountArgs>(args?: Prisma.Subset<T, StockCountLineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StockCountLineCountAggregateOutputType> : number>;
    aggregate<T extends StockCountLineAggregateArgs>(args: Prisma.Subset<T, StockCountLineAggregateArgs>): Prisma.PrismaPromise<GetStockCountLineAggregateType<T>>;
    groupBy<T extends StockCountLineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StockCountLineGroupByArgs['orderBy'];
    } : {
        orderBy?: StockCountLineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StockCountLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockCountLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StockCountLineFieldRefs;
}
export interface Prisma__StockCountLineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    stockCount<T extends Prisma.StockCountDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.StockCountDefaultArgs<ExtArgs>>): Prisma.Prisma__StockCountClient<runtime.Types.Result.GetResult<Prisma.$StockCountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StockCountLineFieldRefs {
    readonly id: Prisma.FieldRef<"StockCountLine", 'String'>;
    readonly stockCountId: Prisma.FieldRef<"StockCountLine", 'String'>;
    readonly lotId: Prisma.FieldRef<"StockCountLine", 'String'>;
    readonly qtyExpected: Prisma.FieldRef<"StockCountLine", 'Int'>;
    readonly qtyCounted: Prisma.FieldRef<"StockCountLine", 'Int'>;
}
export type StockCountLineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountLineSelect<ExtArgs> | null;
    omit?: Prisma.StockCountLineOmit<ExtArgs> | null;
    include?: Prisma.StockCountLineInclude<ExtArgs> | null;
    where: Prisma.StockCountLineWhereUniqueInput;
};
export type StockCountLineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountLineSelect<ExtArgs> | null;
    omit?: Prisma.StockCountLineOmit<ExtArgs> | null;
    include?: Prisma.StockCountLineInclude<ExtArgs> | null;
    where: Prisma.StockCountLineWhereUniqueInput;
};
export type StockCountLineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountLineSelect<ExtArgs> | null;
    omit?: Prisma.StockCountLineOmit<ExtArgs> | null;
    include?: Prisma.StockCountLineInclude<ExtArgs> | null;
    where?: Prisma.StockCountLineWhereInput;
    orderBy?: Prisma.StockCountLineOrderByWithRelationInput | Prisma.StockCountLineOrderByWithRelationInput[];
    cursor?: Prisma.StockCountLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockCountLineScalarFieldEnum | Prisma.StockCountLineScalarFieldEnum[];
};
export type StockCountLineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountLineSelect<ExtArgs> | null;
    omit?: Prisma.StockCountLineOmit<ExtArgs> | null;
    include?: Prisma.StockCountLineInclude<ExtArgs> | null;
    where?: Prisma.StockCountLineWhereInput;
    orderBy?: Prisma.StockCountLineOrderByWithRelationInput | Prisma.StockCountLineOrderByWithRelationInput[];
    cursor?: Prisma.StockCountLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockCountLineScalarFieldEnum | Prisma.StockCountLineScalarFieldEnum[];
};
export type StockCountLineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountLineSelect<ExtArgs> | null;
    omit?: Prisma.StockCountLineOmit<ExtArgs> | null;
    include?: Prisma.StockCountLineInclude<ExtArgs> | null;
    where?: Prisma.StockCountLineWhereInput;
    orderBy?: Prisma.StockCountLineOrderByWithRelationInput | Prisma.StockCountLineOrderByWithRelationInput[];
    cursor?: Prisma.StockCountLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockCountLineScalarFieldEnum | Prisma.StockCountLineScalarFieldEnum[];
};
export type StockCountLineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountLineSelect<ExtArgs> | null;
    omit?: Prisma.StockCountLineOmit<ExtArgs> | null;
    include?: Prisma.StockCountLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockCountLineCreateInput, Prisma.StockCountLineUncheckedCreateInput>;
};
export type StockCountLineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StockCountLineCreateManyInput | Prisma.StockCountLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StockCountLineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountLineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StockCountLineOmit<ExtArgs> | null;
    data: Prisma.StockCountLineCreateManyInput | Prisma.StockCountLineCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.StockCountLineIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type StockCountLineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountLineSelect<ExtArgs> | null;
    omit?: Prisma.StockCountLineOmit<ExtArgs> | null;
    include?: Prisma.StockCountLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockCountLineUpdateInput, Prisma.StockCountLineUncheckedUpdateInput>;
    where: Prisma.StockCountLineWhereUniqueInput;
};
export type StockCountLineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StockCountLineUpdateManyMutationInput, Prisma.StockCountLineUncheckedUpdateManyInput>;
    where?: Prisma.StockCountLineWhereInput;
    limit?: number;
};
export type StockCountLineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountLineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StockCountLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockCountLineUpdateManyMutationInput, Prisma.StockCountLineUncheckedUpdateManyInput>;
    where?: Prisma.StockCountLineWhereInput;
    limit?: number;
    include?: Prisma.StockCountLineIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type StockCountLineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountLineSelect<ExtArgs> | null;
    omit?: Prisma.StockCountLineOmit<ExtArgs> | null;
    include?: Prisma.StockCountLineInclude<ExtArgs> | null;
    where: Prisma.StockCountLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockCountLineCreateInput, Prisma.StockCountLineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StockCountLineUpdateInput, Prisma.StockCountLineUncheckedUpdateInput>;
};
export type StockCountLineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountLineSelect<ExtArgs> | null;
    omit?: Prisma.StockCountLineOmit<ExtArgs> | null;
    include?: Prisma.StockCountLineInclude<ExtArgs> | null;
    where: Prisma.StockCountLineWhereUniqueInput;
};
export type StockCountLineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockCountLineWhereInput;
    limit?: number;
};
export type StockCountLineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountLineSelect<ExtArgs> | null;
    omit?: Prisma.StockCountLineOmit<ExtArgs> | null;
    include?: Prisma.StockCountLineInclude<ExtArgs> | null;
};
