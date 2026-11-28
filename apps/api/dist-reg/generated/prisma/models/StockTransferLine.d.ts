import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type StockTransferLineModel = runtime.Types.Result.DefaultSelection<Prisma.$StockTransferLinePayload>;
export type AggregateStockTransferLine = {
    _count: StockTransferLineCountAggregateOutputType | null;
    _avg: StockTransferLineAvgAggregateOutputType | null;
    _sum: StockTransferLineSumAggregateOutputType | null;
    _min: StockTransferLineMinAggregateOutputType | null;
    _max: StockTransferLineMaxAggregateOutputType | null;
};
export type StockTransferLineAvgAggregateOutputType = {
    quantity: number | null;
};
export type StockTransferLineSumAggregateOutputType = {
    quantity: number | null;
};
export type StockTransferLineMinAggregateOutputType = {
    id: string | null;
    transferId: string | null;
    drugId: string | null;
    lotId: string | null;
    quantity: number | null;
};
export type StockTransferLineMaxAggregateOutputType = {
    id: string | null;
    transferId: string | null;
    drugId: string | null;
    lotId: string | null;
    quantity: number | null;
};
export type StockTransferLineCountAggregateOutputType = {
    id: number;
    transferId: number;
    drugId: number;
    lotId: number;
    quantity: number;
    _all: number;
};
export type StockTransferLineAvgAggregateInputType = {
    quantity?: true;
};
export type StockTransferLineSumAggregateInputType = {
    quantity?: true;
};
export type StockTransferLineMinAggregateInputType = {
    id?: true;
    transferId?: true;
    drugId?: true;
    lotId?: true;
    quantity?: true;
};
export type StockTransferLineMaxAggregateInputType = {
    id?: true;
    transferId?: true;
    drugId?: true;
    lotId?: true;
    quantity?: true;
};
export type StockTransferLineCountAggregateInputType = {
    id?: true;
    transferId?: true;
    drugId?: true;
    lotId?: true;
    quantity?: true;
    _all?: true;
};
export type StockTransferLineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockTransferLineWhereInput;
    orderBy?: Prisma.StockTransferLineOrderByWithRelationInput | Prisma.StockTransferLineOrderByWithRelationInput[];
    cursor?: Prisma.StockTransferLineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StockTransferLineCountAggregateInputType;
    _avg?: StockTransferLineAvgAggregateInputType;
    _sum?: StockTransferLineSumAggregateInputType;
    _min?: StockTransferLineMinAggregateInputType;
    _max?: StockTransferLineMaxAggregateInputType;
};
export type GetStockTransferLineAggregateType<T extends StockTransferLineAggregateArgs> = {
    [P in keyof T & keyof AggregateStockTransferLine]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStockTransferLine[P]> : Prisma.GetScalarType<T[P], AggregateStockTransferLine[P]>;
};
export type StockTransferLineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockTransferLineWhereInput;
    orderBy?: Prisma.StockTransferLineOrderByWithAggregationInput | Prisma.StockTransferLineOrderByWithAggregationInput[];
    by: Prisma.StockTransferLineScalarFieldEnum[] | Prisma.StockTransferLineScalarFieldEnum;
    having?: Prisma.StockTransferLineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StockTransferLineCountAggregateInputType | true;
    _avg?: StockTransferLineAvgAggregateInputType;
    _sum?: StockTransferLineSumAggregateInputType;
    _min?: StockTransferLineMinAggregateInputType;
    _max?: StockTransferLineMaxAggregateInputType;
};
export type StockTransferLineGroupByOutputType = {
    id: string;
    transferId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    _count: StockTransferLineCountAggregateOutputType | null;
    _avg: StockTransferLineAvgAggregateOutputType | null;
    _sum: StockTransferLineSumAggregateOutputType | null;
    _min: StockTransferLineMinAggregateOutputType | null;
    _max: StockTransferLineMaxAggregateOutputType | null;
};
export type GetStockTransferLineGroupByPayload<T extends StockTransferLineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StockTransferLineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StockTransferLineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StockTransferLineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StockTransferLineGroupByOutputType[P]>;
}>>;
export type StockTransferLineWhereInput = {
    AND?: Prisma.StockTransferLineWhereInput | Prisma.StockTransferLineWhereInput[];
    OR?: Prisma.StockTransferLineWhereInput[];
    NOT?: Prisma.StockTransferLineWhereInput | Prisma.StockTransferLineWhereInput[];
    id?: Prisma.StringFilter<"StockTransferLine"> | string;
    transferId?: Prisma.StringFilter<"StockTransferLine"> | string;
    drugId?: Prisma.StringFilter<"StockTransferLine"> | string;
    lotId?: Prisma.StringFilter<"StockTransferLine"> | string;
    quantity?: Prisma.IntFilter<"StockTransferLine"> | number;
    transfer?: Prisma.XOR<Prisma.StockTransferScalarRelationFilter, Prisma.StockTransferWhereInput>;
};
export type StockTransferLineOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    transferId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    transfer?: Prisma.StockTransferOrderByWithRelationInput;
};
export type StockTransferLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.StockTransferLineWhereInput | Prisma.StockTransferLineWhereInput[];
    OR?: Prisma.StockTransferLineWhereInput[];
    NOT?: Prisma.StockTransferLineWhereInput | Prisma.StockTransferLineWhereInput[];
    transferId?: Prisma.StringFilter<"StockTransferLine"> | string;
    drugId?: Prisma.StringFilter<"StockTransferLine"> | string;
    lotId?: Prisma.StringFilter<"StockTransferLine"> | string;
    quantity?: Prisma.IntFilter<"StockTransferLine"> | number;
    transfer?: Prisma.XOR<Prisma.StockTransferScalarRelationFilter, Prisma.StockTransferWhereInput>;
}, "id">;
export type StockTransferLineOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    transferId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    _count?: Prisma.StockTransferLineCountOrderByAggregateInput;
    _avg?: Prisma.StockTransferLineAvgOrderByAggregateInput;
    _max?: Prisma.StockTransferLineMaxOrderByAggregateInput;
    _min?: Prisma.StockTransferLineMinOrderByAggregateInput;
    _sum?: Prisma.StockTransferLineSumOrderByAggregateInput;
};
export type StockTransferLineScalarWhereWithAggregatesInput = {
    AND?: Prisma.StockTransferLineScalarWhereWithAggregatesInput | Prisma.StockTransferLineScalarWhereWithAggregatesInput[];
    OR?: Prisma.StockTransferLineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StockTransferLineScalarWhereWithAggregatesInput | Prisma.StockTransferLineScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"StockTransferLine"> | string;
    transferId?: Prisma.StringWithAggregatesFilter<"StockTransferLine"> | string;
    drugId?: Prisma.StringWithAggregatesFilter<"StockTransferLine"> | string;
    lotId?: Prisma.StringWithAggregatesFilter<"StockTransferLine"> | string;
    quantity?: Prisma.IntWithAggregatesFilter<"StockTransferLine"> | number;
};
export type StockTransferLineCreateInput = {
    id?: string;
    drugId: string;
    lotId: string;
    quantity: number;
    transfer: Prisma.StockTransferCreateNestedOneWithoutLinesInput;
};
export type StockTransferLineUncheckedCreateInput = {
    id?: string;
    transferId: string;
    drugId: string;
    lotId: string;
    quantity: number;
};
export type StockTransferLineUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    transfer?: Prisma.StockTransferUpdateOneRequiredWithoutLinesNestedInput;
};
export type StockTransferLineUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    transferId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type StockTransferLineCreateManyInput = {
    id?: string;
    transferId: string;
    drugId: string;
    lotId: string;
    quantity: number;
};
export type StockTransferLineUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type StockTransferLineUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    transferId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type StockTransferLineListRelationFilter = {
    every?: Prisma.StockTransferLineWhereInput;
    some?: Prisma.StockTransferLineWhereInput;
    none?: Prisma.StockTransferLineWhereInput;
};
export type StockTransferLineOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StockTransferLineCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    transferId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type StockTransferLineAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type StockTransferLineMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    transferId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type StockTransferLineMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    transferId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type StockTransferLineSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type StockTransferLineCreateNestedManyWithoutTransferInput = {
    create?: Prisma.XOR<Prisma.StockTransferLineCreateWithoutTransferInput, Prisma.StockTransferLineUncheckedCreateWithoutTransferInput> | Prisma.StockTransferLineCreateWithoutTransferInput[] | Prisma.StockTransferLineUncheckedCreateWithoutTransferInput[];
    connectOrCreate?: Prisma.StockTransferLineCreateOrConnectWithoutTransferInput | Prisma.StockTransferLineCreateOrConnectWithoutTransferInput[];
    createMany?: Prisma.StockTransferLineCreateManyTransferInputEnvelope;
    connect?: Prisma.StockTransferLineWhereUniqueInput | Prisma.StockTransferLineWhereUniqueInput[];
};
export type StockTransferLineUncheckedCreateNestedManyWithoutTransferInput = {
    create?: Prisma.XOR<Prisma.StockTransferLineCreateWithoutTransferInput, Prisma.StockTransferLineUncheckedCreateWithoutTransferInput> | Prisma.StockTransferLineCreateWithoutTransferInput[] | Prisma.StockTransferLineUncheckedCreateWithoutTransferInput[];
    connectOrCreate?: Prisma.StockTransferLineCreateOrConnectWithoutTransferInput | Prisma.StockTransferLineCreateOrConnectWithoutTransferInput[];
    createMany?: Prisma.StockTransferLineCreateManyTransferInputEnvelope;
    connect?: Prisma.StockTransferLineWhereUniqueInput | Prisma.StockTransferLineWhereUniqueInput[];
};
export type StockTransferLineUpdateManyWithoutTransferNestedInput = {
    create?: Prisma.XOR<Prisma.StockTransferLineCreateWithoutTransferInput, Prisma.StockTransferLineUncheckedCreateWithoutTransferInput> | Prisma.StockTransferLineCreateWithoutTransferInput[] | Prisma.StockTransferLineUncheckedCreateWithoutTransferInput[];
    connectOrCreate?: Prisma.StockTransferLineCreateOrConnectWithoutTransferInput | Prisma.StockTransferLineCreateOrConnectWithoutTransferInput[];
    upsert?: Prisma.StockTransferLineUpsertWithWhereUniqueWithoutTransferInput | Prisma.StockTransferLineUpsertWithWhereUniqueWithoutTransferInput[];
    createMany?: Prisma.StockTransferLineCreateManyTransferInputEnvelope;
    set?: Prisma.StockTransferLineWhereUniqueInput | Prisma.StockTransferLineWhereUniqueInput[];
    disconnect?: Prisma.StockTransferLineWhereUniqueInput | Prisma.StockTransferLineWhereUniqueInput[];
    delete?: Prisma.StockTransferLineWhereUniqueInput | Prisma.StockTransferLineWhereUniqueInput[];
    connect?: Prisma.StockTransferLineWhereUniqueInput | Prisma.StockTransferLineWhereUniqueInput[];
    update?: Prisma.StockTransferLineUpdateWithWhereUniqueWithoutTransferInput | Prisma.StockTransferLineUpdateWithWhereUniqueWithoutTransferInput[];
    updateMany?: Prisma.StockTransferLineUpdateManyWithWhereWithoutTransferInput | Prisma.StockTransferLineUpdateManyWithWhereWithoutTransferInput[];
    deleteMany?: Prisma.StockTransferLineScalarWhereInput | Prisma.StockTransferLineScalarWhereInput[];
};
export type StockTransferLineUncheckedUpdateManyWithoutTransferNestedInput = {
    create?: Prisma.XOR<Prisma.StockTransferLineCreateWithoutTransferInput, Prisma.StockTransferLineUncheckedCreateWithoutTransferInput> | Prisma.StockTransferLineCreateWithoutTransferInput[] | Prisma.StockTransferLineUncheckedCreateWithoutTransferInput[];
    connectOrCreate?: Prisma.StockTransferLineCreateOrConnectWithoutTransferInput | Prisma.StockTransferLineCreateOrConnectWithoutTransferInput[];
    upsert?: Prisma.StockTransferLineUpsertWithWhereUniqueWithoutTransferInput | Prisma.StockTransferLineUpsertWithWhereUniqueWithoutTransferInput[];
    createMany?: Prisma.StockTransferLineCreateManyTransferInputEnvelope;
    set?: Prisma.StockTransferLineWhereUniqueInput | Prisma.StockTransferLineWhereUniqueInput[];
    disconnect?: Prisma.StockTransferLineWhereUniqueInput | Prisma.StockTransferLineWhereUniqueInput[];
    delete?: Prisma.StockTransferLineWhereUniqueInput | Prisma.StockTransferLineWhereUniqueInput[];
    connect?: Prisma.StockTransferLineWhereUniqueInput | Prisma.StockTransferLineWhereUniqueInput[];
    update?: Prisma.StockTransferLineUpdateWithWhereUniqueWithoutTransferInput | Prisma.StockTransferLineUpdateWithWhereUniqueWithoutTransferInput[];
    updateMany?: Prisma.StockTransferLineUpdateManyWithWhereWithoutTransferInput | Prisma.StockTransferLineUpdateManyWithWhereWithoutTransferInput[];
    deleteMany?: Prisma.StockTransferLineScalarWhereInput | Prisma.StockTransferLineScalarWhereInput[];
};
export type StockTransferLineCreateWithoutTransferInput = {
    id?: string;
    drugId: string;
    lotId: string;
    quantity: number;
};
export type StockTransferLineUncheckedCreateWithoutTransferInput = {
    id?: string;
    drugId: string;
    lotId: string;
    quantity: number;
};
export type StockTransferLineCreateOrConnectWithoutTransferInput = {
    where: Prisma.StockTransferLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockTransferLineCreateWithoutTransferInput, Prisma.StockTransferLineUncheckedCreateWithoutTransferInput>;
};
export type StockTransferLineCreateManyTransferInputEnvelope = {
    data: Prisma.StockTransferLineCreateManyTransferInput | Prisma.StockTransferLineCreateManyTransferInput[];
    skipDuplicates?: boolean;
};
export type StockTransferLineUpsertWithWhereUniqueWithoutTransferInput = {
    where: Prisma.StockTransferLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.StockTransferLineUpdateWithoutTransferInput, Prisma.StockTransferLineUncheckedUpdateWithoutTransferInput>;
    create: Prisma.XOR<Prisma.StockTransferLineCreateWithoutTransferInput, Prisma.StockTransferLineUncheckedCreateWithoutTransferInput>;
};
export type StockTransferLineUpdateWithWhereUniqueWithoutTransferInput = {
    where: Prisma.StockTransferLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.StockTransferLineUpdateWithoutTransferInput, Prisma.StockTransferLineUncheckedUpdateWithoutTransferInput>;
};
export type StockTransferLineUpdateManyWithWhereWithoutTransferInput = {
    where: Prisma.StockTransferLineScalarWhereInput;
    data: Prisma.XOR<Prisma.StockTransferLineUpdateManyMutationInput, Prisma.StockTransferLineUncheckedUpdateManyWithoutTransferInput>;
};
export type StockTransferLineScalarWhereInput = {
    AND?: Prisma.StockTransferLineScalarWhereInput | Prisma.StockTransferLineScalarWhereInput[];
    OR?: Prisma.StockTransferLineScalarWhereInput[];
    NOT?: Prisma.StockTransferLineScalarWhereInput | Prisma.StockTransferLineScalarWhereInput[];
    id?: Prisma.StringFilter<"StockTransferLine"> | string;
    transferId?: Prisma.StringFilter<"StockTransferLine"> | string;
    drugId?: Prisma.StringFilter<"StockTransferLine"> | string;
    lotId?: Prisma.StringFilter<"StockTransferLine"> | string;
    quantity?: Prisma.IntFilter<"StockTransferLine"> | number;
};
export type StockTransferLineCreateManyTransferInput = {
    id?: string;
    drugId: string;
    lotId: string;
    quantity: number;
};
export type StockTransferLineUpdateWithoutTransferInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type StockTransferLineUncheckedUpdateWithoutTransferInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type StockTransferLineUncheckedUpdateManyWithoutTransferInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type StockTransferLineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    transferId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    transfer?: boolean | Prisma.StockTransferDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stockTransferLine"]>;
export type StockTransferLineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    transferId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    transfer?: boolean | Prisma.StockTransferDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stockTransferLine"]>;
export type StockTransferLineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    transferId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    transfer?: boolean | Prisma.StockTransferDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stockTransferLine"]>;
export type StockTransferLineSelectScalar = {
    id?: boolean;
    transferId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
};
export type StockTransferLineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "transferId" | "drugId" | "lotId" | "quantity", ExtArgs["result"]["stockTransferLine"]>;
export type StockTransferLineInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    transfer?: boolean | Prisma.StockTransferDefaultArgs<ExtArgs>;
};
export type StockTransferLineIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    transfer?: boolean | Prisma.StockTransferDefaultArgs<ExtArgs>;
};
export type StockTransferLineIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    transfer?: boolean | Prisma.StockTransferDefaultArgs<ExtArgs>;
};
export type $StockTransferLinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StockTransferLine";
    objects: {
        transfer: Prisma.$StockTransferPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        transferId: string;
        drugId: string;
        lotId: string;
        quantity: number;
    }, ExtArgs["result"]["stockTransferLine"]>;
    composites: {};
};
export type StockTransferLineGetPayload<S extends boolean | null | undefined | StockTransferLineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StockTransferLinePayload, S>;
export type StockTransferLineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StockTransferLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StockTransferLineCountAggregateInputType | true;
};
export interface StockTransferLineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StockTransferLine'];
        meta: {
            name: 'StockTransferLine';
        };
    };
    findUnique<T extends StockTransferLineFindUniqueArgs>(args: Prisma.SelectSubset<T, StockTransferLineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StockTransferLineClient<runtime.Types.Result.GetResult<Prisma.$StockTransferLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StockTransferLineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StockTransferLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StockTransferLineClient<runtime.Types.Result.GetResult<Prisma.$StockTransferLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StockTransferLineFindFirstArgs>(args?: Prisma.SelectSubset<T, StockTransferLineFindFirstArgs<ExtArgs>>): Prisma.Prisma__StockTransferLineClient<runtime.Types.Result.GetResult<Prisma.$StockTransferLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StockTransferLineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StockTransferLineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StockTransferLineClient<runtime.Types.Result.GetResult<Prisma.$StockTransferLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StockTransferLineFindManyArgs>(args?: Prisma.SelectSubset<T, StockTransferLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockTransferLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StockTransferLineCreateArgs>(args: Prisma.SelectSubset<T, StockTransferLineCreateArgs<ExtArgs>>): Prisma.Prisma__StockTransferLineClient<runtime.Types.Result.GetResult<Prisma.$StockTransferLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StockTransferLineCreateManyArgs>(args?: Prisma.SelectSubset<T, StockTransferLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StockTransferLineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StockTransferLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockTransferLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StockTransferLineDeleteArgs>(args: Prisma.SelectSubset<T, StockTransferLineDeleteArgs<ExtArgs>>): Prisma.Prisma__StockTransferLineClient<runtime.Types.Result.GetResult<Prisma.$StockTransferLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StockTransferLineUpdateArgs>(args: Prisma.SelectSubset<T, StockTransferLineUpdateArgs<ExtArgs>>): Prisma.Prisma__StockTransferLineClient<runtime.Types.Result.GetResult<Prisma.$StockTransferLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StockTransferLineDeleteManyArgs>(args?: Prisma.SelectSubset<T, StockTransferLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StockTransferLineUpdateManyArgs>(args: Prisma.SelectSubset<T, StockTransferLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StockTransferLineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StockTransferLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockTransferLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StockTransferLineUpsertArgs>(args: Prisma.SelectSubset<T, StockTransferLineUpsertArgs<ExtArgs>>): Prisma.Prisma__StockTransferLineClient<runtime.Types.Result.GetResult<Prisma.$StockTransferLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StockTransferLineCountArgs>(args?: Prisma.Subset<T, StockTransferLineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StockTransferLineCountAggregateOutputType> : number>;
    aggregate<T extends StockTransferLineAggregateArgs>(args: Prisma.Subset<T, StockTransferLineAggregateArgs>): Prisma.PrismaPromise<GetStockTransferLineAggregateType<T>>;
    groupBy<T extends StockTransferLineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StockTransferLineGroupByArgs['orderBy'];
    } : {
        orderBy?: StockTransferLineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StockTransferLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockTransferLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StockTransferLineFieldRefs;
}
export interface Prisma__StockTransferLineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    transfer<T extends Prisma.StockTransferDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.StockTransferDefaultArgs<ExtArgs>>): Prisma.Prisma__StockTransferClient<runtime.Types.Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StockTransferLineFieldRefs {
    readonly id: Prisma.FieldRef<"StockTransferLine", 'String'>;
    readonly transferId: Prisma.FieldRef<"StockTransferLine", 'String'>;
    readonly drugId: Prisma.FieldRef<"StockTransferLine", 'String'>;
    readonly lotId: Prisma.FieldRef<"StockTransferLine", 'String'>;
    readonly quantity: Prisma.FieldRef<"StockTransferLine", 'Int'>;
}
export type StockTransferLineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferLineSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferLineOmit<ExtArgs> | null;
    include?: Prisma.StockTransferLineInclude<ExtArgs> | null;
    where: Prisma.StockTransferLineWhereUniqueInput;
};
export type StockTransferLineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferLineSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferLineOmit<ExtArgs> | null;
    include?: Prisma.StockTransferLineInclude<ExtArgs> | null;
    where: Prisma.StockTransferLineWhereUniqueInput;
};
export type StockTransferLineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StockTransferLineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StockTransferLineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StockTransferLineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferLineSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferLineOmit<ExtArgs> | null;
    include?: Prisma.StockTransferLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockTransferLineCreateInput, Prisma.StockTransferLineUncheckedCreateInput>;
};
export type StockTransferLineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StockTransferLineCreateManyInput | Prisma.StockTransferLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StockTransferLineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferLineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StockTransferLineOmit<ExtArgs> | null;
    data: Prisma.StockTransferLineCreateManyInput | Prisma.StockTransferLineCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.StockTransferLineIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type StockTransferLineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferLineSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferLineOmit<ExtArgs> | null;
    include?: Prisma.StockTransferLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockTransferLineUpdateInput, Prisma.StockTransferLineUncheckedUpdateInput>;
    where: Prisma.StockTransferLineWhereUniqueInput;
};
export type StockTransferLineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StockTransferLineUpdateManyMutationInput, Prisma.StockTransferLineUncheckedUpdateManyInput>;
    where?: Prisma.StockTransferLineWhereInput;
    limit?: number;
};
export type StockTransferLineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferLineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StockTransferLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockTransferLineUpdateManyMutationInput, Prisma.StockTransferLineUncheckedUpdateManyInput>;
    where?: Prisma.StockTransferLineWhereInput;
    limit?: number;
    include?: Prisma.StockTransferLineIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type StockTransferLineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferLineSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferLineOmit<ExtArgs> | null;
    include?: Prisma.StockTransferLineInclude<ExtArgs> | null;
    where: Prisma.StockTransferLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockTransferLineCreateInput, Prisma.StockTransferLineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StockTransferLineUpdateInput, Prisma.StockTransferLineUncheckedUpdateInput>;
};
export type StockTransferLineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferLineSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferLineOmit<ExtArgs> | null;
    include?: Prisma.StockTransferLineInclude<ExtArgs> | null;
    where: Prisma.StockTransferLineWhereUniqueInput;
};
export type StockTransferLineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockTransferLineWhereInput;
    limit?: number;
};
export type StockTransferLineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockTransferLineSelect<ExtArgs> | null;
    omit?: Prisma.StockTransferLineOmit<ExtArgs> | null;
    include?: Prisma.StockTransferLineInclude<ExtArgs> | null;
};
