import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type RfqQuoteLineModel = runtime.Types.Result.DefaultSelection<Prisma.$RfqQuoteLinePayload>;
export type AggregateRfqQuoteLine = {
    _count: RfqQuoteLineCountAggregateOutputType | null;
    _avg: RfqQuoteLineAvgAggregateOutputType | null;
    _sum: RfqQuoteLineSumAggregateOutputType | null;
    _min: RfqQuoteLineMinAggregateOutputType | null;
    _max: RfqQuoteLineMaxAggregateOutputType | null;
};
export type RfqQuoteLineAvgAggregateOutputType = {
    unitPrice: runtime.Decimal | null;
};
export type RfqQuoteLineSumAggregateOutputType = {
    unitPrice: runtime.Decimal | null;
};
export type RfqQuoteLineMinAggregateOutputType = {
    id: string | null;
    quoteId: string | null;
    rfqLineId: string | null;
    unitPrice: runtime.Decimal | null;
};
export type RfqQuoteLineMaxAggregateOutputType = {
    id: string | null;
    quoteId: string | null;
    rfqLineId: string | null;
    unitPrice: runtime.Decimal | null;
};
export type RfqQuoteLineCountAggregateOutputType = {
    id: number;
    quoteId: number;
    rfqLineId: number;
    unitPrice: number;
    _all: number;
};
export type RfqQuoteLineAvgAggregateInputType = {
    unitPrice?: true;
};
export type RfqQuoteLineSumAggregateInputType = {
    unitPrice?: true;
};
export type RfqQuoteLineMinAggregateInputType = {
    id?: true;
    quoteId?: true;
    rfqLineId?: true;
    unitPrice?: true;
};
export type RfqQuoteLineMaxAggregateInputType = {
    id?: true;
    quoteId?: true;
    rfqLineId?: true;
    unitPrice?: true;
};
export type RfqQuoteLineCountAggregateInputType = {
    id?: true;
    quoteId?: true;
    rfqLineId?: true;
    unitPrice?: true;
    _all?: true;
};
export type RfqQuoteLineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RfqQuoteLineWhereInput;
    orderBy?: Prisma.RfqQuoteLineOrderByWithRelationInput | Prisma.RfqQuoteLineOrderByWithRelationInput[];
    cursor?: Prisma.RfqQuoteLineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RfqQuoteLineCountAggregateInputType;
    _avg?: RfqQuoteLineAvgAggregateInputType;
    _sum?: RfqQuoteLineSumAggregateInputType;
    _min?: RfqQuoteLineMinAggregateInputType;
    _max?: RfqQuoteLineMaxAggregateInputType;
};
export type GetRfqQuoteLineAggregateType<T extends RfqQuoteLineAggregateArgs> = {
    [P in keyof T & keyof AggregateRfqQuoteLine]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRfqQuoteLine[P]> : Prisma.GetScalarType<T[P], AggregateRfqQuoteLine[P]>;
};
export type RfqQuoteLineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RfqQuoteLineWhereInput;
    orderBy?: Prisma.RfqQuoteLineOrderByWithAggregationInput | Prisma.RfqQuoteLineOrderByWithAggregationInput[];
    by: Prisma.RfqQuoteLineScalarFieldEnum[] | Prisma.RfqQuoteLineScalarFieldEnum;
    having?: Prisma.RfqQuoteLineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RfqQuoteLineCountAggregateInputType | true;
    _avg?: RfqQuoteLineAvgAggregateInputType;
    _sum?: RfqQuoteLineSumAggregateInputType;
    _min?: RfqQuoteLineMinAggregateInputType;
    _max?: RfqQuoteLineMaxAggregateInputType;
};
export type RfqQuoteLineGroupByOutputType = {
    id: string;
    quoteId: string;
    rfqLineId: string;
    unitPrice: runtime.Decimal;
    _count: RfqQuoteLineCountAggregateOutputType | null;
    _avg: RfqQuoteLineAvgAggregateOutputType | null;
    _sum: RfqQuoteLineSumAggregateOutputType | null;
    _min: RfqQuoteLineMinAggregateOutputType | null;
    _max: RfqQuoteLineMaxAggregateOutputType | null;
};
export type GetRfqQuoteLineGroupByPayload<T extends RfqQuoteLineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RfqQuoteLineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RfqQuoteLineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RfqQuoteLineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RfqQuoteLineGroupByOutputType[P]>;
}>>;
export type RfqQuoteLineWhereInput = {
    AND?: Prisma.RfqQuoteLineWhereInput | Prisma.RfqQuoteLineWhereInput[];
    OR?: Prisma.RfqQuoteLineWhereInput[];
    NOT?: Prisma.RfqQuoteLineWhereInput | Prisma.RfqQuoteLineWhereInput[];
    id?: Prisma.StringFilter<"RfqQuoteLine"> | string;
    quoteId?: Prisma.StringFilter<"RfqQuoteLine"> | string;
    rfqLineId?: Prisma.StringFilter<"RfqQuoteLine"> | string;
    unitPrice?: Prisma.DecimalFilter<"RfqQuoteLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quote?: Prisma.XOR<Prisma.RfqQuoteScalarRelationFilter, Prisma.RfqQuoteWhereInput>;
};
export type RfqQuoteLineOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    quoteId?: Prisma.SortOrder;
    rfqLineId?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    quote?: Prisma.RfqQuoteOrderByWithRelationInput;
};
export type RfqQuoteLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    quoteId_rfqLineId?: Prisma.RfqQuoteLineQuoteIdRfqLineIdCompoundUniqueInput;
    AND?: Prisma.RfqQuoteLineWhereInput | Prisma.RfqQuoteLineWhereInput[];
    OR?: Prisma.RfqQuoteLineWhereInput[];
    NOT?: Prisma.RfqQuoteLineWhereInput | Prisma.RfqQuoteLineWhereInput[];
    quoteId?: Prisma.StringFilter<"RfqQuoteLine"> | string;
    rfqLineId?: Prisma.StringFilter<"RfqQuoteLine"> | string;
    unitPrice?: Prisma.DecimalFilter<"RfqQuoteLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quote?: Prisma.XOR<Prisma.RfqQuoteScalarRelationFilter, Prisma.RfqQuoteWhereInput>;
}, "id" | "quoteId_rfqLineId">;
export type RfqQuoteLineOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    quoteId?: Prisma.SortOrder;
    rfqLineId?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    _count?: Prisma.RfqQuoteLineCountOrderByAggregateInput;
    _avg?: Prisma.RfqQuoteLineAvgOrderByAggregateInput;
    _max?: Prisma.RfqQuoteLineMaxOrderByAggregateInput;
    _min?: Prisma.RfqQuoteLineMinOrderByAggregateInput;
    _sum?: Prisma.RfqQuoteLineSumOrderByAggregateInput;
};
export type RfqQuoteLineScalarWhereWithAggregatesInput = {
    AND?: Prisma.RfqQuoteLineScalarWhereWithAggregatesInput | Prisma.RfqQuoteLineScalarWhereWithAggregatesInput[];
    OR?: Prisma.RfqQuoteLineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RfqQuoteLineScalarWhereWithAggregatesInput | Prisma.RfqQuoteLineScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RfqQuoteLine"> | string;
    quoteId?: Prisma.StringWithAggregatesFilter<"RfqQuoteLine"> | string;
    rfqLineId?: Prisma.StringWithAggregatesFilter<"RfqQuoteLine"> | string;
    unitPrice?: Prisma.DecimalWithAggregatesFilter<"RfqQuoteLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type RfqQuoteLineCreateInput = {
    id?: string;
    rfqLineId: string;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quote: Prisma.RfqQuoteCreateNestedOneWithoutLinesInput;
};
export type RfqQuoteLineUncheckedCreateInput = {
    id?: string;
    quoteId: string;
    rfqLineId: string;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type RfqQuoteLineUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rfqLineId?: Prisma.StringFieldUpdateOperationsInput | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quote?: Prisma.RfqQuoteUpdateOneRequiredWithoutLinesNestedInput;
};
export type RfqQuoteLineUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quoteId?: Prisma.StringFieldUpdateOperationsInput | string;
    rfqLineId?: Prisma.StringFieldUpdateOperationsInput | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type RfqQuoteLineCreateManyInput = {
    id?: string;
    quoteId: string;
    rfqLineId: string;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type RfqQuoteLineUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rfqLineId?: Prisma.StringFieldUpdateOperationsInput | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type RfqQuoteLineUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quoteId?: Prisma.StringFieldUpdateOperationsInput | string;
    rfqLineId?: Prisma.StringFieldUpdateOperationsInput | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type RfqQuoteLineListRelationFilter = {
    every?: Prisma.RfqQuoteLineWhereInput;
    some?: Prisma.RfqQuoteLineWhereInput;
    none?: Prisma.RfqQuoteLineWhereInput;
};
export type RfqQuoteLineOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RfqQuoteLineQuoteIdRfqLineIdCompoundUniqueInput = {
    quoteId: string;
    rfqLineId: string;
};
export type RfqQuoteLineCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    quoteId?: Prisma.SortOrder;
    rfqLineId?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
};
export type RfqQuoteLineAvgOrderByAggregateInput = {
    unitPrice?: Prisma.SortOrder;
};
export type RfqQuoteLineMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    quoteId?: Prisma.SortOrder;
    rfqLineId?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
};
export type RfqQuoteLineMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    quoteId?: Prisma.SortOrder;
    rfqLineId?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
};
export type RfqQuoteLineSumOrderByAggregateInput = {
    unitPrice?: Prisma.SortOrder;
};
export type RfqQuoteLineCreateNestedManyWithoutQuoteInput = {
    create?: Prisma.XOR<Prisma.RfqQuoteLineCreateWithoutQuoteInput, Prisma.RfqQuoteLineUncheckedCreateWithoutQuoteInput> | Prisma.RfqQuoteLineCreateWithoutQuoteInput[] | Prisma.RfqQuoteLineUncheckedCreateWithoutQuoteInput[];
    connectOrCreate?: Prisma.RfqQuoteLineCreateOrConnectWithoutQuoteInput | Prisma.RfqQuoteLineCreateOrConnectWithoutQuoteInput[];
    createMany?: Prisma.RfqQuoteLineCreateManyQuoteInputEnvelope;
    connect?: Prisma.RfqQuoteLineWhereUniqueInput | Prisma.RfqQuoteLineWhereUniqueInput[];
};
export type RfqQuoteLineUncheckedCreateNestedManyWithoutQuoteInput = {
    create?: Prisma.XOR<Prisma.RfqQuoteLineCreateWithoutQuoteInput, Prisma.RfqQuoteLineUncheckedCreateWithoutQuoteInput> | Prisma.RfqQuoteLineCreateWithoutQuoteInput[] | Prisma.RfqQuoteLineUncheckedCreateWithoutQuoteInput[];
    connectOrCreate?: Prisma.RfqQuoteLineCreateOrConnectWithoutQuoteInput | Prisma.RfqQuoteLineCreateOrConnectWithoutQuoteInput[];
    createMany?: Prisma.RfqQuoteLineCreateManyQuoteInputEnvelope;
    connect?: Prisma.RfqQuoteLineWhereUniqueInput | Prisma.RfqQuoteLineWhereUniqueInput[];
};
export type RfqQuoteLineUpdateManyWithoutQuoteNestedInput = {
    create?: Prisma.XOR<Prisma.RfqQuoteLineCreateWithoutQuoteInput, Prisma.RfqQuoteLineUncheckedCreateWithoutQuoteInput> | Prisma.RfqQuoteLineCreateWithoutQuoteInput[] | Prisma.RfqQuoteLineUncheckedCreateWithoutQuoteInput[];
    connectOrCreate?: Prisma.RfqQuoteLineCreateOrConnectWithoutQuoteInput | Prisma.RfqQuoteLineCreateOrConnectWithoutQuoteInput[];
    upsert?: Prisma.RfqQuoteLineUpsertWithWhereUniqueWithoutQuoteInput | Prisma.RfqQuoteLineUpsertWithWhereUniqueWithoutQuoteInput[];
    createMany?: Prisma.RfqQuoteLineCreateManyQuoteInputEnvelope;
    set?: Prisma.RfqQuoteLineWhereUniqueInput | Prisma.RfqQuoteLineWhereUniqueInput[];
    disconnect?: Prisma.RfqQuoteLineWhereUniqueInput | Prisma.RfqQuoteLineWhereUniqueInput[];
    delete?: Prisma.RfqQuoteLineWhereUniqueInput | Prisma.RfqQuoteLineWhereUniqueInput[];
    connect?: Prisma.RfqQuoteLineWhereUniqueInput | Prisma.RfqQuoteLineWhereUniqueInput[];
    update?: Prisma.RfqQuoteLineUpdateWithWhereUniqueWithoutQuoteInput | Prisma.RfqQuoteLineUpdateWithWhereUniqueWithoutQuoteInput[];
    updateMany?: Prisma.RfqQuoteLineUpdateManyWithWhereWithoutQuoteInput | Prisma.RfqQuoteLineUpdateManyWithWhereWithoutQuoteInput[];
    deleteMany?: Prisma.RfqQuoteLineScalarWhereInput | Prisma.RfqQuoteLineScalarWhereInput[];
};
export type RfqQuoteLineUncheckedUpdateManyWithoutQuoteNestedInput = {
    create?: Prisma.XOR<Prisma.RfqQuoteLineCreateWithoutQuoteInput, Prisma.RfqQuoteLineUncheckedCreateWithoutQuoteInput> | Prisma.RfqQuoteLineCreateWithoutQuoteInput[] | Prisma.RfqQuoteLineUncheckedCreateWithoutQuoteInput[];
    connectOrCreate?: Prisma.RfqQuoteLineCreateOrConnectWithoutQuoteInput | Prisma.RfqQuoteLineCreateOrConnectWithoutQuoteInput[];
    upsert?: Prisma.RfqQuoteLineUpsertWithWhereUniqueWithoutQuoteInput | Prisma.RfqQuoteLineUpsertWithWhereUniqueWithoutQuoteInput[];
    createMany?: Prisma.RfqQuoteLineCreateManyQuoteInputEnvelope;
    set?: Prisma.RfqQuoteLineWhereUniqueInput | Prisma.RfqQuoteLineWhereUniqueInput[];
    disconnect?: Prisma.RfqQuoteLineWhereUniqueInput | Prisma.RfqQuoteLineWhereUniqueInput[];
    delete?: Prisma.RfqQuoteLineWhereUniqueInput | Prisma.RfqQuoteLineWhereUniqueInput[];
    connect?: Prisma.RfqQuoteLineWhereUniqueInput | Prisma.RfqQuoteLineWhereUniqueInput[];
    update?: Prisma.RfqQuoteLineUpdateWithWhereUniqueWithoutQuoteInput | Prisma.RfqQuoteLineUpdateWithWhereUniqueWithoutQuoteInput[];
    updateMany?: Prisma.RfqQuoteLineUpdateManyWithWhereWithoutQuoteInput | Prisma.RfqQuoteLineUpdateManyWithWhereWithoutQuoteInput[];
    deleteMany?: Prisma.RfqQuoteLineScalarWhereInput | Prisma.RfqQuoteLineScalarWhereInput[];
};
export type RfqQuoteLineCreateWithoutQuoteInput = {
    id?: string;
    rfqLineId: string;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type RfqQuoteLineUncheckedCreateWithoutQuoteInput = {
    id?: string;
    rfqLineId: string;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type RfqQuoteLineCreateOrConnectWithoutQuoteInput = {
    where: Prisma.RfqQuoteLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.RfqQuoteLineCreateWithoutQuoteInput, Prisma.RfqQuoteLineUncheckedCreateWithoutQuoteInput>;
};
export type RfqQuoteLineCreateManyQuoteInputEnvelope = {
    data: Prisma.RfqQuoteLineCreateManyQuoteInput | Prisma.RfqQuoteLineCreateManyQuoteInput[];
    skipDuplicates?: boolean;
};
export type RfqQuoteLineUpsertWithWhereUniqueWithoutQuoteInput = {
    where: Prisma.RfqQuoteLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.RfqQuoteLineUpdateWithoutQuoteInput, Prisma.RfqQuoteLineUncheckedUpdateWithoutQuoteInput>;
    create: Prisma.XOR<Prisma.RfqQuoteLineCreateWithoutQuoteInput, Prisma.RfqQuoteLineUncheckedCreateWithoutQuoteInput>;
};
export type RfqQuoteLineUpdateWithWhereUniqueWithoutQuoteInput = {
    where: Prisma.RfqQuoteLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.RfqQuoteLineUpdateWithoutQuoteInput, Prisma.RfqQuoteLineUncheckedUpdateWithoutQuoteInput>;
};
export type RfqQuoteLineUpdateManyWithWhereWithoutQuoteInput = {
    where: Prisma.RfqQuoteLineScalarWhereInput;
    data: Prisma.XOR<Prisma.RfqQuoteLineUpdateManyMutationInput, Prisma.RfqQuoteLineUncheckedUpdateManyWithoutQuoteInput>;
};
export type RfqQuoteLineScalarWhereInput = {
    AND?: Prisma.RfqQuoteLineScalarWhereInput | Prisma.RfqQuoteLineScalarWhereInput[];
    OR?: Prisma.RfqQuoteLineScalarWhereInput[];
    NOT?: Prisma.RfqQuoteLineScalarWhereInput | Prisma.RfqQuoteLineScalarWhereInput[];
    id?: Prisma.StringFilter<"RfqQuoteLine"> | string;
    quoteId?: Prisma.StringFilter<"RfqQuoteLine"> | string;
    rfqLineId?: Prisma.StringFilter<"RfqQuoteLine"> | string;
    unitPrice?: Prisma.DecimalFilter<"RfqQuoteLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type RfqQuoteLineCreateManyQuoteInput = {
    id?: string;
    rfqLineId: string;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type RfqQuoteLineUpdateWithoutQuoteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rfqLineId?: Prisma.StringFieldUpdateOperationsInput | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type RfqQuoteLineUncheckedUpdateWithoutQuoteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rfqLineId?: Prisma.StringFieldUpdateOperationsInput | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type RfqQuoteLineUncheckedUpdateManyWithoutQuoteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rfqLineId?: Prisma.StringFieldUpdateOperationsInput | string;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type RfqQuoteLineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    quoteId?: boolean;
    rfqLineId?: boolean;
    unitPrice?: boolean;
    quote?: boolean | Prisma.RfqQuoteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rfqQuoteLine"]>;
export type RfqQuoteLineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    quoteId?: boolean;
    rfqLineId?: boolean;
    unitPrice?: boolean;
    quote?: boolean | Prisma.RfqQuoteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rfqQuoteLine"]>;
export type RfqQuoteLineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    quoteId?: boolean;
    rfqLineId?: boolean;
    unitPrice?: boolean;
    quote?: boolean | Prisma.RfqQuoteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rfqQuoteLine"]>;
export type RfqQuoteLineSelectScalar = {
    id?: boolean;
    quoteId?: boolean;
    rfqLineId?: boolean;
    unitPrice?: boolean;
};
export type RfqQuoteLineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "quoteId" | "rfqLineId" | "unitPrice", ExtArgs["result"]["rfqQuoteLine"]>;
export type RfqQuoteLineInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    quote?: boolean | Prisma.RfqQuoteDefaultArgs<ExtArgs>;
};
export type RfqQuoteLineIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    quote?: boolean | Prisma.RfqQuoteDefaultArgs<ExtArgs>;
};
export type RfqQuoteLineIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    quote?: boolean | Prisma.RfqQuoteDefaultArgs<ExtArgs>;
};
export type $RfqQuoteLinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RfqQuoteLine";
    objects: {
        quote: Prisma.$RfqQuotePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        quoteId: string;
        rfqLineId: string;
        unitPrice: runtime.Decimal;
    }, ExtArgs["result"]["rfqQuoteLine"]>;
    composites: {};
};
export type RfqQuoteLineGetPayload<S extends boolean | null | undefined | RfqQuoteLineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RfqQuoteLinePayload, S>;
export type RfqQuoteLineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RfqQuoteLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RfqQuoteLineCountAggregateInputType | true;
};
export interface RfqQuoteLineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RfqQuoteLine'];
        meta: {
            name: 'RfqQuoteLine';
        };
    };
    findUnique<T extends RfqQuoteLineFindUniqueArgs>(args: Prisma.SelectSubset<T, RfqQuoteLineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteLineClient<runtime.Types.Result.GetResult<Prisma.$RfqQuoteLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RfqQuoteLineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RfqQuoteLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteLineClient<runtime.Types.Result.GetResult<Prisma.$RfqQuoteLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RfqQuoteLineFindFirstArgs>(args?: Prisma.SelectSubset<T, RfqQuoteLineFindFirstArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteLineClient<runtime.Types.Result.GetResult<Prisma.$RfqQuoteLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RfqQuoteLineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RfqQuoteLineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteLineClient<runtime.Types.Result.GetResult<Prisma.$RfqQuoteLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RfqQuoteLineFindManyArgs>(args?: Prisma.SelectSubset<T, RfqQuoteLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RfqQuoteLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RfqQuoteLineCreateArgs>(args: Prisma.SelectSubset<T, RfqQuoteLineCreateArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteLineClient<runtime.Types.Result.GetResult<Prisma.$RfqQuoteLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RfqQuoteLineCreateManyArgs>(args?: Prisma.SelectSubset<T, RfqQuoteLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RfqQuoteLineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RfqQuoteLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RfqQuoteLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RfqQuoteLineDeleteArgs>(args: Prisma.SelectSubset<T, RfqQuoteLineDeleteArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteLineClient<runtime.Types.Result.GetResult<Prisma.$RfqQuoteLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RfqQuoteLineUpdateArgs>(args: Prisma.SelectSubset<T, RfqQuoteLineUpdateArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteLineClient<runtime.Types.Result.GetResult<Prisma.$RfqQuoteLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RfqQuoteLineDeleteManyArgs>(args?: Prisma.SelectSubset<T, RfqQuoteLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RfqQuoteLineUpdateManyArgs>(args: Prisma.SelectSubset<T, RfqQuoteLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RfqQuoteLineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RfqQuoteLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RfqQuoteLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RfqQuoteLineUpsertArgs>(args: Prisma.SelectSubset<T, RfqQuoteLineUpsertArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteLineClient<runtime.Types.Result.GetResult<Prisma.$RfqQuoteLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RfqQuoteLineCountArgs>(args?: Prisma.Subset<T, RfqQuoteLineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RfqQuoteLineCountAggregateOutputType> : number>;
    aggregate<T extends RfqQuoteLineAggregateArgs>(args: Prisma.Subset<T, RfqQuoteLineAggregateArgs>): Prisma.PrismaPromise<GetRfqQuoteLineAggregateType<T>>;
    groupBy<T extends RfqQuoteLineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RfqQuoteLineGroupByArgs['orderBy'];
    } : {
        orderBy?: RfqQuoteLineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RfqQuoteLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRfqQuoteLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RfqQuoteLineFieldRefs;
}
export interface Prisma__RfqQuoteLineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    quote<T extends Prisma.RfqQuoteDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RfqQuoteDefaultArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteClient<runtime.Types.Result.GetResult<Prisma.$RfqQuotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RfqQuoteLineFieldRefs {
    readonly id: Prisma.FieldRef<"RfqQuoteLine", 'String'>;
    readonly quoteId: Prisma.FieldRef<"RfqQuoteLine", 'String'>;
    readonly rfqLineId: Prisma.FieldRef<"RfqQuoteLine", 'String'>;
    readonly unitPrice: Prisma.FieldRef<"RfqQuoteLine", 'Decimal'>;
}
export type RfqQuoteLineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteLineOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteLineInclude<ExtArgs> | null;
    where: Prisma.RfqQuoteLineWhereUniqueInput;
};
export type RfqQuoteLineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteLineOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteLineInclude<ExtArgs> | null;
    where: Prisma.RfqQuoteLineWhereUniqueInput;
};
export type RfqQuoteLineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteLineOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteLineInclude<ExtArgs> | null;
    where?: Prisma.RfqQuoteLineWhereInput;
    orderBy?: Prisma.RfqQuoteLineOrderByWithRelationInput | Prisma.RfqQuoteLineOrderByWithRelationInput[];
    cursor?: Prisma.RfqQuoteLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RfqQuoteLineScalarFieldEnum | Prisma.RfqQuoteLineScalarFieldEnum[];
};
export type RfqQuoteLineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteLineOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteLineInclude<ExtArgs> | null;
    where?: Prisma.RfqQuoteLineWhereInput;
    orderBy?: Prisma.RfqQuoteLineOrderByWithRelationInput | Prisma.RfqQuoteLineOrderByWithRelationInput[];
    cursor?: Prisma.RfqQuoteLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RfqQuoteLineScalarFieldEnum | Prisma.RfqQuoteLineScalarFieldEnum[];
};
export type RfqQuoteLineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteLineOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteLineInclude<ExtArgs> | null;
    where?: Prisma.RfqQuoteLineWhereInput;
    orderBy?: Prisma.RfqQuoteLineOrderByWithRelationInput | Prisma.RfqQuoteLineOrderByWithRelationInput[];
    cursor?: Prisma.RfqQuoteLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RfqQuoteLineScalarFieldEnum | Prisma.RfqQuoteLineScalarFieldEnum[];
};
export type RfqQuoteLineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteLineOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RfqQuoteLineCreateInput, Prisma.RfqQuoteLineUncheckedCreateInput>;
};
export type RfqQuoteLineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RfqQuoteLineCreateManyInput | Prisma.RfqQuoteLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RfqQuoteLineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteLineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RfqQuoteLineOmit<ExtArgs> | null;
    data: Prisma.RfqQuoteLineCreateManyInput | Prisma.RfqQuoteLineCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.RfqQuoteLineIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type RfqQuoteLineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteLineOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RfqQuoteLineUpdateInput, Prisma.RfqQuoteLineUncheckedUpdateInput>;
    where: Prisma.RfqQuoteLineWhereUniqueInput;
};
export type RfqQuoteLineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RfqQuoteLineUpdateManyMutationInput, Prisma.RfqQuoteLineUncheckedUpdateManyInput>;
    where?: Prisma.RfqQuoteLineWhereInput;
    limit?: number;
};
export type RfqQuoteLineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteLineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RfqQuoteLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RfqQuoteLineUpdateManyMutationInput, Prisma.RfqQuoteLineUncheckedUpdateManyInput>;
    where?: Prisma.RfqQuoteLineWhereInput;
    limit?: number;
    include?: Prisma.RfqQuoteLineIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type RfqQuoteLineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteLineOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteLineInclude<ExtArgs> | null;
    where: Prisma.RfqQuoteLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.RfqQuoteLineCreateInput, Prisma.RfqQuoteLineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RfqQuoteLineUpdateInput, Prisma.RfqQuoteLineUncheckedUpdateInput>;
};
export type RfqQuoteLineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteLineOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteLineInclude<ExtArgs> | null;
    where: Prisma.RfqQuoteLineWhereUniqueInput;
};
export type RfqQuoteLineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RfqQuoteLineWhereInput;
    limit?: number;
};
export type RfqQuoteLineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteLineOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteLineInclude<ExtArgs> | null;
};
