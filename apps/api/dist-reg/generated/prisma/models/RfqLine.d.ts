import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type RfqLineModel = runtime.Types.Result.DefaultSelection<Prisma.$RfqLinePayload>;
export type AggregateRfqLine = {
    _count: RfqLineCountAggregateOutputType | null;
    _avg: RfqLineAvgAggregateOutputType | null;
    _sum: RfqLineSumAggregateOutputType | null;
    _min: RfqLineMinAggregateOutputType | null;
    _max: RfqLineMaxAggregateOutputType | null;
};
export type RfqLineAvgAggregateOutputType = {
    qty: number | null;
};
export type RfqLineSumAggregateOutputType = {
    qty: number | null;
};
export type RfqLineMinAggregateOutputType = {
    id: string | null;
    rfqId: string | null;
    drugId: string | null;
    qty: number | null;
};
export type RfqLineMaxAggregateOutputType = {
    id: string | null;
    rfqId: string | null;
    drugId: string | null;
    qty: number | null;
};
export type RfqLineCountAggregateOutputType = {
    id: number;
    rfqId: number;
    drugId: number;
    qty: number;
    _all: number;
};
export type RfqLineAvgAggregateInputType = {
    qty?: true;
};
export type RfqLineSumAggregateInputType = {
    qty?: true;
};
export type RfqLineMinAggregateInputType = {
    id?: true;
    rfqId?: true;
    drugId?: true;
    qty?: true;
};
export type RfqLineMaxAggregateInputType = {
    id?: true;
    rfqId?: true;
    drugId?: true;
    qty?: true;
};
export type RfqLineCountAggregateInputType = {
    id?: true;
    rfqId?: true;
    drugId?: true;
    qty?: true;
    _all?: true;
};
export type RfqLineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RfqLineWhereInput;
    orderBy?: Prisma.RfqLineOrderByWithRelationInput | Prisma.RfqLineOrderByWithRelationInput[];
    cursor?: Prisma.RfqLineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RfqLineCountAggregateInputType;
    _avg?: RfqLineAvgAggregateInputType;
    _sum?: RfqLineSumAggregateInputType;
    _min?: RfqLineMinAggregateInputType;
    _max?: RfqLineMaxAggregateInputType;
};
export type GetRfqLineAggregateType<T extends RfqLineAggregateArgs> = {
    [P in keyof T & keyof AggregateRfqLine]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRfqLine[P]> : Prisma.GetScalarType<T[P], AggregateRfqLine[P]>;
};
export type RfqLineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RfqLineWhereInput;
    orderBy?: Prisma.RfqLineOrderByWithAggregationInput | Prisma.RfqLineOrderByWithAggregationInput[];
    by: Prisma.RfqLineScalarFieldEnum[] | Prisma.RfqLineScalarFieldEnum;
    having?: Prisma.RfqLineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RfqLineCountAggregateInputType | true;
    _avg?: RfqLineAvgAggregateInputType;
    _sum?: RfqLineSumAggregateInputType;
    _min?: RfqLineMinAggregateInputType;
    _max?: RfqLineMaxAggregateInputType;
};
export type RfqLineGroupByOutputType = {
    id: string;
    rfqId: string;
    drugId: string;
    qty: number;
    _count: RfqLineCountAggregateOutputType | null;
    _avg: RfqLineAvgAggregateOutputType | null;
    _sum: RfqLineSumAggregateOutputType | null;
    _min: RfqLineMinAggregateOutputType | null;
    _max: RfqLineMaxAggregateOutputType | null;
};
export type GetRfqLineGroupByPayload<T extends RfqLineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RfqLineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RfqLineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RfqLineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RfqLineGroupByOutputType[P]>;
}>>;
export type RfqLineWhereInput = {
    AND?: Prisma.RfqLineWhereInput | Prisma.RfqLineWhereInput[];
    OR?: Prisma.RfqLineWhereInput[];
    NOT?: Prisma.RfqLineWhereInput | Prisma.RfqLineWhereInput[];
    id?: Prisma.StringFilter<"RfqLine"> | string;
    rfqId?: Prisma.StringFilter<"RfqLine"> | string;
    drugId?: Prisma.StringFilter<"RfqLine"> | string;
    qty?: Prisma.IntFilter<"RfqLine"> | number;
    rfq?: Prisma.XOR<Prisma.RequestForQuoteScalarRelationFilter, Prisma.RequestForQuoteWhereInput>;
};
export type RfqLineOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    rfqId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    rfq?: Prisma.RequestForQuoteOrderByWithRelationInput;
};
export type RfqLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RfqLineWhereInput | Prisma.RfqLineWhereInput[];
    OR?: Prisma.RfqLineWhereInput[];
    NOT?: Prisma.RfqLineWhereInput | Prisma.RfqLineWhereInput[];
    rfqId?: Prisma.StringFilter<"RfqLine"> | string;
    drugId?: Prisma.StringFilter<"RfqLine"> | string;
    qty?: Prisma.IntFilter<"RfqLine"> | number;
    rfq?: Prisma.XOR<Prisma.RequestForQuoteScalarRelationFilter, Prisma.RequestForQuoteWhereInput>;
}, "id">;
export type RfqLineOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    rfqId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    _count?: Prisma.RfqLineCountOrderByAggregateInput;
    _avg?: Prisma.RfqLineAvgOrderByAggregateInput;
    _max?: Prisma.RfqLineMaxOrderByAggregateInput;
    _min?: Prisma.RfqLineMinOrderByAggregateInput;
    _sum?: Prisma.RfqLineSumOrderByAggregateInput;
};
export type RfqLineScalarWhereWithAggregatesInput = {
    AND?: Prisma.RfqLineScalarWhereWithAggregatesInput | Prisma.RfqLineScalarWhereWithAggregatesInput[];
    OR?: Prisma.RfqLineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RfqLineScalarWhereWithAggregatesInput | Prisma.RfqLineScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RfqLine"> | string;
    rfqId?: Prisma.StringWithAggregatesFilter<"RfqLine"> | string;
    drugId?: Prisma.StringWithAggregatesFilter<"RfqLine"> | string;
    qty?: Prisma.IntWithAggregatesFilter<"RfqLine"> | number;
};
export type RfqLineCreateInput = {
    id?: string;
    drugId: string;
    qty: number;
    rfq: Prisma.RequestForQuoteCreateNestedOneWithoutLinesInput;
};
export type RfqLineUncheckedCreateInput = {
    id?: string;
    rfqId: string;
    drugId: string;
    qty: number;
};
export type RfqLineUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    rfq?: Prisma.RequestForQuoteUpdateOneRequiredWithoutLinesNestedInput;
};
export type RfqLineUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rfqId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type RfqLineCreateManyInput = {
    id?: string;
    rfqId: string;
    drugId: string;
    qty: number;
};
export type RfqLineUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type RfqLineUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rfqId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type RfqLineListRelationFilter = {
    every?: Prisma.RfqLineWhereInput;
    some?: Prisma.RfqLineWhereInput;
    none?: Prisma.RfqLineWhereInput;
};
export type RfqLineOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RfqLineCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rfqId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
};
export type RfqLineAvgOrderByAggregateInput = {
    qty?: Prisma.SortOrder;
};
export type RfqLineMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rfqId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
};
export type RfqLineMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rfqId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
};
export type RfqLineSumOrderByAggregateInput = {
    qty?: Prisma.SortOrder;
};
export type RfqLineCreateNestedManyWithoutRfqInput = {
    create?: Prisma.XOR<Prisma.RfqLineCreateWithoutRfqInput, Prisma.RfqLineUncheckedCreateWithoutRfqInput> | Prisma.RfqLineCreateWithoutRfqInput[] | Prisma.RfqLineUncheckedCreateWithoutRfqInput[];
    connectOrCreate?: Prisma.RfqLineCreateOrConnectWithoutRfqInput | Prisma.RfqLineCreateOrConnectWithoutRfqInput[];
    createMany?: Prisma.RfqLineCreateManyRfqInputEnvelope;
    connect?: Prisma.RfqLineWhereUniqueInput | Prisma.RfqLineWhereUniqueInput[];
};
export type RfqLineUncheckedCreateNestedManyWithoutRfqInput = {
    create?: Prisma.XOR<Prisma.RfqLineCreateWithoutRfqInput, Prisma.RfqLineUncheckedCreateWithoutRfqInput> | Prisma.RfqLineCreateWithoutRfqInput[] | Prisma.RfqLineUncheckedCreateWithoutRfqInput[];
    connectOrCreate?: Prisma.RfqLineCreateOrConnectWithoutRfqInput | Prisma.RfqLineCreateOrConnectWithoutRfqInput[];
    createMany?: Prisma.RfqLineCreateManyRfqInputEnvelope;
    connect?: Prisma.RfqLineWhereUniqueInput | Prisma.RfqLineWhereUniqueInput[];
};
export type RfqLineUpdateManyWithoutRfqNestedInput = {
    create?: Prisma.XOR<Prisma.RfqLineCreateWithoutRfqInput, Prisma.RfqLineUncheckedCreateWithoutRfqInput> | Prisma.RfqLineCreateWithoutRfqInput[] | Prisma.RfqLineUncheckedCreateWithoutRfqInput[];
    connectOrCreate?: Prisma.RfqLineCreateOrConnectWithoutRfqInput | Prisma.RfqLineCreateOrConnectWithoutRfqInput[];
    upsert?: Prisma.RfqLineUpsertWithWhereUniqueWithoutRfqInput | Prisma.RfqLineUpsertWithWhereUniqueWithoutRfqInput[];
    createMany?: Prisma.RfqLineCreateManyRfqInputEnvelope;
    set?: Prisma.RfqLineWhereUniqueInput | Prisma.RfqLineWhereUniqueInput[];
    disconnect?: Prisma.RfqLineWhereUniqueInput | Prisma.RfqLineWhereUniqueInput[];
    delete?: Prisma.RfqLineWhereUniqueInput | Prisma.RfqLineWhereUniqueInput[];
    connect?: Prisma.RfqLineWhereUniqueInput | Prisma.RfqLineWhereUniqueInput[];
    update?: Prisma.RfqLineUpdateWithWhereUniqueWithoutRfqInput | Prisma.RfqLineUpdateWithWhereUniqueWithoutRfqInput[];
    updateMany?: Prisma.RfqLineUpdateManyWithWhereWithoutRfqInput | Prisma.RfqLineUpdateManyWithWhereWithoutRfqInput[];
    deleteMany?: Prisma.RfqLineScalarWhereInput | Prisma.RfqLineScalarWhereInput[];
};
export type RfqLineUncheckedUpdateManyWithoutRfqNestedInput = {
    create?: Prisma.XOR<Prisma.RfqLineCreateWithoutRfqInput, Prisma.RfqLineUncheckedCreateWithoutRfqInput> | Prisma.RfqLineCreateWithoutRfqInput[] | Prisma.RfqLineUncheckedCreateWithoutRfqInput[];
    connectOrCreate?: Prisma.RfqLineCreateOrConnectWithoutRfqInput | Prisma.RfqLineCreateOrConnectWithoutRfqInput[];
    upsert?: Prisma.RfqLineUpsertWithWhereUniqueWithoutRfqInput | Prisma.RfqLineUpsertWithWhereUniqueWithoutRfqInput[];
    createMany?: Prisma.RfqLineCreateManyRfqInputEnvelope;
    set?: Prisma.RfqLineWhereUniqueInput | Prisma.RfqLineWhereUniqueInput[];
    disconnect?: Prisma.RfqLineWhereUniqueInput | Prisma.RfqLineWhereUniqueInput[];
    delete?: Prisma.RfqLineWhereUniqueInput | Prisma.RfqLineWhereUniqueInput[];
    connect?: Prisma.RfqLineWhereUniqueInput | Prisma.RfqLineWhereUniqueInput[];
    update?: Prisma.RfqLineUpdateWithWhereUniqueWithoutRfqInput | Prisma.RfqLineUpdateWithWhereUniqueWithoutRfqInput[];
    updateMany?: Prisma.RfqLineUpdateManyWithWhereWithoutRfqInput | Prisma.RfqLineUpdateManyWithWhereWithoutRfqInput[];
    deleteMany?: Prisma.RfqLineScalarWhereInput | Prisma.RfqLineScalarWhereInput[];
};
export type RfqLineCreateWithoutRfqInput = {
    id?: string;
    drugId: string;
    qty: number;
};
export type RfqLineUncheckedCreateWithoutRfqInput = {
    id?: string;
    drugId: string;
    qty: number;
};
export type RfqLineCreateOrConnectWithoutRfqInput = {
    where: Prisma.RfqLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.RfqLineCreateWithoutRfqInput, Prisma.RfqLineUncheckedCreateWithoutRfqInput>;
};
export type RfqLineCreateManyRfqInputEnvelope = {
    data: Prisma.RfqLineCreateManyRfqInput | Prisma.RfqLineCreateManyRfqInput[];
    skipDuplicates?: boolean;
};
export type RfqLineUpsertWithWhereUniqueWithoutRfqInput = {
    where: Prisma.RfqLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.RfqLineUpdateWithoutRfqInput, Prisma.RfqLineUncheckedUpdateWithoutRfqInput>;
    create: Prisma.XOR<Prisma.RfqLineCreateWithoutRfqInput, Prisma.RfqLineUncheckedCreateWithoutRfqInput>;
};
export type RfqLineUpdateWithWhereUniqueWithoutRfqInput = {
    where: Prisma.RfqLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.RfqLineUpdateWithoutRfqInput, Prisma.RfqLineUncheckedUpdateWithoutRfqInput>;
};
export type RfqLineUpdateManyWithWhereWithoutRfqInput = {
    where: Prisma.RfqLineScalarWhereInput;
    data: Prisma.XOR<Prisma.RfqLineUpdateManyMutationInput, Prisma.RfqLineUncheckedUpdateManyWithoutRfqInput>;
};
export type RfqLineScalarWhereInput = {
    AND?: Prisma.RfqLineScalarWhereInput | Prisma.RfqLineScalarWhereInput[];
    OR?: Prisma.RfqLineScalarWhereInput[];
    NOT?: Prisma.RfqLineScalarWhereInput | Prisma.RfqLineScalarWhereInput[];
    id?: Prisma.StringFilter<"RfqLine"> | string;
    rfqId?: Prisma.StringFilter<"RfqLine"> | string;
    drugId?: Prisma.StringFilter<"RfqLine"> | string;
    qty?: Prisma.IntFilter<"RfqLine"> | number;
};
export type RfqLineCreateManyRfqInput = {
    id?: string;
    drugId: string;
    qty: number;
};
export type RfqLineUpdateWithoutRfqInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type RfqLineUncheckedUpdateWithoutRfqInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type RfqLineUncheckedUpdateManyWithoutRfqInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type RfqLineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rfqId?: boolean;
    drugId?: boolean;
    qty?: boolean;
    rfq?: boolean | Prisma.RequestForQuoteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rfqLine"]>;
export type RfqLineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rfqId?: boolean;
    drugId?: boolean;
    qty?: boolean;
    rfq?: boolean | Prisma.RequestForQuoteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rfqLine"]>;
export type RfqLineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rfqId?: boolean;
    drugId?: boolean;
    qty?: boolean;
    rfq?: boolean | Prisma.RequestForQuoteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rfqLine"]>;
export type RfqLineSelectScalar = {
    id?: boolean;
    rfqId?: boolean;
    drugId?: boolean;
    qty?: boolean;
};
export type RfqLineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "rfqId" | "drugId" | "qty", ExtArgs["result"]["rfqLine"]>;
export type RfqLineInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rfq?: boolean | Prisma.RequestForQuoteDefaultArgs<ExtArgs>;
};
export type RfqLineIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rfq?: boolean | Prisma.RequestForQuoteDefaultArgs<ExtArgs>;
};
export type RfqLineIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rfq?: boolean | Prisma.RequestForQuoteDefaultArgs<ExtArgs>;
};
export type $RfqLinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RfqLine";
    objects: {
        rfq: Prisma.$RequestForQuotePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        rfqId: string;
        drugId: string;
        qty: number;
    }, ExtArgs["result"]["rfqLine"]>;
    composites: {};
};
export type RfqLineGetPayload<S extends boolean | null | undefined | RfqLineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RfqLinePayload, S>;
export type RfqLineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RfqLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RfqLineCountAggregateInputType | true;
};
export interface RfqLineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RfqLine'];
        meta: {
            name: 'RfqLine';
        };
    };
    findUnique<T extends RfqLineFindUniqueArgs>(args: Prisma.SelectSubset<T, RfqLineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RfqLineClient<runtime.Types.Result.GetResult<Prisma.$RfqLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RfqLineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RfqLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RfqLineClient<runtime.Types.Result.GetResult<Prisma.$RfqLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RfqLineFindFirstArgs>(args?: Prisma.SelectSubset<T, RfqLineFindFirstArgs<ExtArgs>>): Prisma.Prisma__RfqLineClient<runtime.Types.Result.GetResult<Prisma.$RfqLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RfqLineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RfqLineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RfqLineClient<runtime.Types.Result.GetResult<Prisma.$RfqLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RfqLineFindManyArgs>(args?: Prisma.SelectSubset<T, RfqLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RfqLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RfqLineCreateArgs>(args: Prisma.SelectSubset<T, RfqLineCreateArgs<ExtArgs>>): Prisma.Prisma__RfqLineClient<runtime.Types.Result.GetResult<Prisma.$RfqLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RfqLineCreateManyArgs>(args?: Prisma.SelectSubset<T, RfqLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RfqLineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RfqLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RfqLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RfqLineDeleteArgs>(args: Prisma.SelectSubset<T, RfqLineDeleteArgs<ExtArgs>>): Prisma.Prisma__RfqLineClient<runtime.Types.Result.GetResult<Prisma.$RfqLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RfqLineUpdateArgs>(args: Prisma.SelectSubset<T, RfqLineUpdateArgs<ExtArgs>>): Prisma.Prisma__RfqLineClient<runtime.Types.Result.GetResult<Prisma.$RfqLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RfqLineDeleteManyArgs>(args?: Prisma.SelectSubset<T, RfqLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RfqLineUpdateManyArgs>(args: Prisma.SelectSubset<T, RfqLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RfqLineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RfqLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RfqLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RfqLineUpsertArgs>(args: Prisma.SelectSubset<T, RfqLineUpsertArgs<ExtArgs>>): Prisma.Prisma__RfqLineClient<runtime.Types.Result.GetResult<Prisma.$RfqLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RfqLineCountArgs>(args?: Prisma.Subset<T, RfqLineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RfqLineCountAggregateOutputType> : number>;
    aggregate<T extends RfqLineAggregateArgs>(args: Prisma.Subset<T, RfqLineAggregateArgs>): Prisma.PrismaPromise<GetRfqLineAggregateType<T>>;
    groupBy<T extends RfqLineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RfqLineGroupByArgs['orderBy'];
    } : {
        orderBy?: RfqLineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RfqLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRfqLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RfqLineFieldRefs;
}
export interface Prisma__RfqLineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    rfq<T extends Prisma.RequestForQuoteDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RequestForQuoteDefaultArgs<ExtArgs>>): Prisma.Prisma__RequestForQuoteClient<runtime.Types.Result.GetResult<Prisma.$RequestForQuotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RfqLineFieldRefs {
    readonly id: Prisma.FieldRef<"RfqLine", 'String'>;
    readonly rfqId: Prisma.FieldRef<"RfqLine", 'String'>;
    readonly drugId: Prisma.FieldRef<"RfqLine", 'String'>;
    readonly qty: Prisma.FieldRef<"RfqLine", 'Int'>;
}
export type RfqLineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqLineOmit<ExtArgs> | null;
    include?: Prisma.RfqLineInclude<ExtArgs> | null;
    where: Prisma.RfqLineWhereUniqueInput;
};
export type RfqLineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqLineOmit<ExtArgs> | null;
    include?: Prisma.RfqLineInclude<ExtArgs> | null;
    where: Prisma.RfqLineWhereUniqueInput;
};
export type RfqLineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqLineOmit<ExtArgs> | null;
    include?: Prisma.RfqLineInclude<ExtArgs> | null;
    where?: Prisma.RfqLineWhereInput;
    orderBy?: Prisma.RfqLineOrderByWithRelationInput | Prisma.RfqLineOrderByWithRelationInput[];
    cursor?: Prisma.RfqLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RfqLineScalarFieldEnum | Prisma.RfqLineScalarFieldEnum[];
};
export type RfqLineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqLineOmit<ExtArgs> | null;
    include?: Prisma.RfqLineInclude<ExtArgs> | null;
    where?: Prisma.RfqLineWhereInput;
    orderBy?: Prisma.RfqLineOrderByWithRelationInput | Prisma.RfqLineOrderByWithRelationInput[];
    cursor?: Prisma.RfqLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RfqLineScalarFieldEnum | Prisma.RfqLineScalarFieldEnum[];
};
export type RfqLineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqLineOmit<ExtArgs> | null;
    include?: Prisma.RfqLineInclude<ExtArgs> | null;
    where?: Prisma.RfqLineWhereInput;
    orderBy?: Prisma.RfqLineOrderByWithRelationInput | Prisma.RfqLineOrderByWithRelationInput[];
    cursor?: Prisma.RfqLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RfqLineScalarFieldEnum | Prisma.RfqLineScalarFieldEnum[];
};
export type RfqLineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqLineOmit<ExtArgs> | null;
    include?: Prisma.RfqLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RfqLineCreateInput, Prisma.RfqLineUncheckedCreateInput>;
};
export type RfqLineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RfqLineCreateManyInput | Prisma.RfqLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RfqLineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqLineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RfqLineOmit<ExtArgs> | null;
    data: Prisma.RfqLineCreateManyInput | Prisma.RfqLineCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.RfqLineIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type RfqLineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqLineOmit<ExtArgs> | null;
    include?: Prisma.RfqLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RfqLineUpdateInput, Prisma.RfqLineUncheckedUpdateInput>;
    where: Prisma.RfqLineWhereUniqueInput;
};
export type RfqLineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RfqLineUpdateManyMutationInput, Prisma.RfqLineUncheckedUpdateManyInput>;
    where?: Prisma.RfqLineWhereInput;
    limit?: number;
};
export type RfqLineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqLineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RfqLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RfqLineUpdateManyMutationInput, Prisma.RfqLineUncheckedUpdateManyInput>;
    where?: Prisma.RfqLineWhereInput;
    limit?: number;
    include?: Prisma.RfqLineIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type RfqLineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqLineOmit<ExtArgs> | null;
    include?: Prisma.RfqLineInclude<ExtArgs> | null;
    where: Prisma.RfqLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.RfqLineCreateInput, Prisma.RfqLineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RfqLineUpdateInput, Prisma.RfqLineUncheckedUpdateInput>;
};
export type RfqLineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqLineOmit<ExtArgs> | null;
    include?: Prisma.RfqLineInclude<ExtArgs> | null;
    where: Prisma.RfqLineWhereUniqueInput;
};
export type RfqLineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RfqLineWhereInput;
    limit?: number;
};
export type RfqLineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqLineOmit<ExtArgs> | null;
    include?: Prisma.RfqLineInclude<ExtArgs> | null;
};
