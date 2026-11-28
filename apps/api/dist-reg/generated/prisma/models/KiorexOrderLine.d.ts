import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type KiorexOrderLineModel = runtime.Types.Result.DefaultSelection<Prisma.$KiorexOrderLinePayload>;
export type AggregateKiorexOrderLine = {
    _count: KiorexOrderLineCountAggregateOutputType | null;
    _avg: KiorexOrderLineAvgAggregateOutputType | null;
    _sum: KiorexOrderLineSumAggregateOutputType | null;
    _min: KiorexOrderLineMinAggregateOutputType | null;
    _max: KiorexOrderLineMaxAggregateOutputType | null;
};
export type KiorexOrderLineAvgAggregateOutputType = {
    qtyRequested: number | null;
    qtyAccepted: number | null;
    unitPrice: runtime.Decimal | null;
};
export type KiorexOrderLineSumAggregateOutputType = {
    qtyRequested: number | null;
    qtyAccepted: number | null;
    unitPrice: runtime.Decimal | null;
};
export type KiorexOrderLineMinAggregateOutputType = {
    id: string | null;
    orderId: string | null;
    drugId: string | null;
    qtyRequested: number | null;
    qtyAccepted: number | null;
    unitPrice: runtime.Decimal | null;
};
export type KiorexOrderLineMaxAggregateOutputType = {
    id: string | null;
    orderId: string | null;
    drugId: string | null;
    qtyRequested: number | null;
    qtyAccepted: number | null;
    unitPrice: runtime.Decimal | null;
};
export type KiorexOrderLineCountAggregateOutputType = {
    id: number;
    orderId: number;
    drugId: number;
    qtyRequested: number;
    qtyAccepted: number;
    unitPrice: number;
    _all: number;
};
export type KiorexOrderLineAvgAggregateInputType = {
    qtyRequested?: true;
    qtyAccepted?: true;
    unitPrice?: true;
};
export type KiorexOrderLineSumAggregateInputType = {
    qtyRequested?: true;
    qtyAccepted?: true;
    unitPrice?: true;
};
export type KiorexOrderLineMinAggregateInputType = {
    id?: true;
    orderId?: true;
    drugId?: true;
    qtyRequested?: true;
    qtyAccepted?: true;
    unitPrice?: true;
};
export type KiorexOrderLineMaxAggregateInputType = {
    id?: true;
    orderId?: true;
    drugId?: true;
    qtyRequested?: true;
    qtyAccepted?: true;
    unitPrice?: true;
};
export type KiorexOrderLineCountAggregateInputType = {
    id?: true;
    orderId?: true;
    drugId?: true;
    qtyRequested?: true;
    qtyAccepted?: true;
    unitPrice?: true;
    _all?: true;
};
export type KiorexOrderLineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.KiorexOrderLineWhereInput;
    orderBy?: Prisma.KiorexOrderLineOrderByWithRelationInput | Prisma.KiorexOrderLineOrderByWithRelationInput[];
    cursor?: Prisma.KiorexOrderLineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | KiorexOrderLineCountAggregateInputType;
    _avg?: KiorexOrderLineAvgAggregateInputType;
    _sum?: KiorexOrderLineSumAggregateInputType;
    _min?: KiorexOrderLineMinAggregateInputType;
    _max?: KiorexOrderLineMaxAggregateInputType;
};
export type GetKiorexOrderLineAggregateType<T extends KiorexOrderLineAggregateArgs> = {
    [P in keyof T & keyof AggregateKiorexOrderLine]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateKiorexOrderLine[P]> : Prisma.GetScalarType<T[P], AggregateKiorexOrderLine[P]>;
};
export type KiorexOrderLineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.KiorexOrderLineWhereInput;
    orderBy?: Prisma.KiorexOrderLineOrderByWithAggregationInput | Prisma.KiorexOrderLineOrderByWithAggregationInput[];
    by: Prisma.KiorexOrderLineScalarFieldEnum[] | Prisma.KiorexOrderLineScalarFieldEnum;
    having?: Prisma.KiorexOrderLineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: KiorexOrderLineCountAggregateInputType | true;
    _avg?: KiorexOrderLineAvgAggregateInputType;
    _sum?: KiorexOrderLineSumAggregateInputType;
    _min?: KiorexOrderLineMinAggregateInputType;
    _max?: KiorexOrderLineMaxAggregateInputType;
};
export type KiorexOrderLineGroupByOutputType = {
    id: string;
    orderId: string;
    drugId: string;
    qtyRequested: number;
    qtyAccepted: number;
    unitPrice: runtime.Decimal;
    _count: KiorexOrderLineCountAggregateOutputType | null;
    _avg: KiorexOrderLineAvgAggregateOutputType | null;
    _sum: KiorexOrderLineSumAggregateOutputType | null;
    _min: KiorexOrderLineMinAggregateOutputType | null;
    _max: KiorexOrderLineMaxAggregateOutputType | null;
};
export type GetKiorexOrderLineGroupByPayload<T extends KiorexOrderLineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<KiorexOrderLineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof KiorexOrderLineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], KiorexOrderLineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], KiorexOrderLineGroupByOutputType[P]>;
}>>;
export type KiorexOrderLineWhereInput = {
    AND?: Prisma.KiorexOrderLineWhereInput | Prisma.KiorexOrderLineWhereInput[];
    OR?: Prisma.KiorexOrderLineWhereInput[];
    NOT?: Prisma.KiorexOrderLineWhereInput | Prisma.KiorexOrderLineWhereInput[];
    id?: Prisma.StringFilter<"KiorexOrderLine"> | string;
    orderId?: Prisma.StringFilter<"KiorexOrderLine"> | string;
    drugId?: Prisma.StringFilter<"KiorexOrderLine"> | string;
    qtyRequested?: Prisma.IntFilter<"KiorexOrderLine"> | number;
    qtyAccepted?: Prisma.IntFilter<"KiorexOrderLine"> | number;
    unitPrice?: Prisma.DecimalFilter<"KiorexOrderLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    order?: Prisma.XOR<Prisma.KiorexOrderScalarRelationFilter, Prisma.KiorexOrderWhereInput>;
};
export type KiorexOrderLineOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    qtyRequested?: Prisma.SortOrder;
    qtyAccepted?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    order?: Prisma.KiorexOrderOrderByWithRelationInput;
};
export type KiorexOrderLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.KiorexOrderLineWhereInput | Prisma.KiorexOrderLineWhereInput[];
    OR?: Prisma.KiorexOrderLineWhereInput[];
    NOT?: Prisma.KiorexOrderLineWhereInput | Prisma.KiorexOrderLineWhereInput[];
    orderId?: Prisma.StringFilter<"KiorexOrderLine"> | string;
    drugId?: Prisma.StringFilter<"KiorexOrderLine"> | string;
    qtyRequested?: Prisma.IntFilter<"KiorexOrderLine"> | number;
    qtyAccepted?: Prisma.IntFilter<"KiorexOrderLine"> | number;
    unitPrice?: Prisma.DecimalFilter<"KiorexOrderLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    order?: Prisma.XOR<Prisma.KiorexOrderScalarRelationFilter, Prisma.KiorexOrderWhereInput>;
}, "id">;
export type KiorexOrderLineOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    qtyRequested?: Prisma.SortOrder;
    qtyAccepted?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    _count?: Prisma.KiorexOrderLineCountOrderByAggregateInput;
    _avg?: Prisma.KiorexOrderLineAvgOrderByAggregateInput;
    _max?: Prisma.KiorexOrderLineMaxOrderByAggregateInput;
    _min?: Prisma.KiorexOrderLineMinOrderByAggregateInput;
    _sum?: Prisma.KiorexOrderLineSumOrderByAggregateInput;
};
export type KiorexOrderLineScalarWhereWithAggregatesInput = {
    AND?: Prisma.KiorexOrderLineScalarWhereWithAggregatesInput | Prisma.KiorexOrderLineScalarWhereWithAggregatesInput[];
    OR?: Prisma.KiorexOrderLineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.KiorexOrderLineScalarWhereWithAggregatesInput | Prisma.KiorexOrderLineScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"KiorexOrderLine"> | string;
    orderId?: Prisma.StringWithAggregatesFilter<"KiorexOrderLine"> | string;
    drugId?: Prisma.StringWithAggregatesFilter<"KiorexOrderLine"> | string;
    qtyRequested?: Prisma.IntWithAggregatesFilter<"KiorexOrderLine"> | number;
    qtyAccepted?: Prisma.IntWithAggregatesFilter<"KiorexOrderLine"> | number;
    unitPrice?: Prisma.DecimalWithAggregatesFilter<"KiorexOrderLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type KiorexOrderLineCreateInput = {
    id?: string;
    drugId: string;
    qtyRequested: number;
    qtyAccepted?: number;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    order: Prisma.KiorexOrderCreateNestedOneWithoutLinesInput;
};
export type KiorexOrderLineUncheckedCreateInput = {
    id?: string;
    orderId: string;
    drugId: string;
    qtyRequested: number;
    qtyAccepted?: number;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type KiorexOrderLineUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    qtyRequested?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyAccepted?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    order?: Prisma.KiorexOrderUpdateOneRequiredWithoutLinesNestedInput;
};
export type KiorexOrderLineUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    qtyRequested?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyAccepted?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type KiorexOrderLineCreateManyInput = {
    id?: string;
    orderId: string;
    drugId: string;
    qtyRequested: number;
    qtyAccepted?: number;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type KiorexOrderLineUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    qtyRequested?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyAccepted?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type KiorexOrderLineUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    qtyRequested?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyAccepted?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type KiorexOrderLineListRelationFilter = {
    every?: Prisma.KiorexOrderLineWhereInput;
    some?: Prisma.KiorexOrderLineWhereInput;
    none?: Prisma.KiorexOrderLineWhereInput;
};
export type KiorexOrderLineOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type KiorexOrderLineCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    qtyRequested?: Prisma.SortOrder;
    qtyAccepted?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
};
export type KiorexOrderLineAvgOrderByAggregateInput = {
    qtyRequested?: Prisma.SortOrder;
    qtyAccepted?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
};
export type KiorexOrderLineMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    qtyRequested?: Prisma.SortOrder;
    qtyAccepted?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
};
export type KiorexOrderLineMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    qtyRequested?: Prisma.SortOrder;
    qtyAccepted?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
};
export type KiorexOrderLineSumOrderByAggregateInput = {
    qtyRequested?: Prisma.SortOrder;
    qtyAccepted?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
};
export type KiorexOrderLineCreateNestedManyWithoutOrderInput = {
    create?: Prisma.XOR<Prisma.KiorexOrderLineCreateWithoutOrderInput, Prisma.KiorexOrderLineUncheckedCreateWithoutOrderInput> | Prisma.KiorexOrderLineCreateWithoutOrderInput[] | Prisma.KiorexOrderLineUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.KiorexOrderLineCreateOrConnectWithoutOrderInput | Prisma.KiorexOrderLineCreateOrConnectWithoutOrderInput[];
    createMany?: Prisma.KiorexOrderLineCreateManyOrderInputEnvelope;
    connect?: Prisma.KiorexOrderLineWhereUniqueInput | Prisma.KiorexOrderLineWhereUniqueInput[];
};
export type KiorexOrderLineUncheckedCreateNestedManyWithoutOrderInput = {
    create?: Prisma.XOR<Prisma.KiorexOrderLineCreateWithoutOrderInput, Prisma.KiorexOrderLineUncheckedCreateWithoutOrderInput> | Prisma.KiorexOrderLineCreateWithoutOrderInput[] | Prisma.KiorexOrderLineUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.KiorexOrderLineCreateOrConnectWithoutOrderInput | Prisma.KiorexOrderLineCreateOrConnectWithoutOrderInput[];
    createMany?: Prisma.KiorexOrderLineCreateManyOrderInputEnvelope;
    connect?: Prisma.KiorexOrderLineWhereUniqueInput | Prisma.KiorexOrderLineWhereUniqueInput[];
};
export type KiorexOrderLineUpdateManyWithoutOrderNestedInput = {
    create?: Prisma.XOR<Prisma.KiorexOrderLineCreateWithoutOrderInput, Prisma.KiorexOrderLineUncheckedCreateWithoutOrderInput> | Prisma.KiorexOrderLineCreateWithoutOrderInput[] | Prisma.KiorexOrderLineUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.KiorexOrderLineCreateOrConnectWithoutOrderInput | Prisma.KiorexOrderLineCreateOrConnectWithoutOrderInput[];
    upsert?: Prisma.KiorexOrderLineUpsertWithWhereUniqueWithoutOrderInput | Prisma.KiorexOrderLineUpsertWithWhereUniqueWithoutOrderInput[];
    createMany?: Prisma.KiorexOrderLineCreateManyOrderInputEnvelope;
    set?: Prisma.KiorexOrderLineWhereUniqueInput | Prisma.KiorexOrderLineWhereUniqueInput[];
    disconnect?: Prisma.KiorexOrderLineWhereUniqueInput | Prisma.KiorexOrderLineWhereUniqueInput[];
    delete?: Prisma.KiorexOrderLineWhereUniqueInput | Prisma.KiorexOrderLineWhereUniqueInput[];
    connect?: Prisma.KiorexOrderLineWhereUniqueInput | Prisma.KiorexOrderLineWhereUniqueInput[];
    update?: Prisma.KiorexOrderLineUpdateWithWhereUniqueWithoutOrderInput | Prisma.KiorexOrderLineUpdateWithWhereUniqueWithoutOrderInput[];
    updateMany?: Prisma.KiorexOrderLineUpdateManyWithWhereWithoutOrderInput | Prisma.KiorexOrderLineUpdateManyWithWhereWithoutOrderInput[];
    deleteMany?: Prisma.KiorexOrderLineScalarWhereInput | Prisma.KiorexOrderLineScalarWhereInput[];
};
export type KiorexOrderLineUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: Prisma.XOR<Prisma.KiorexOrderLineCreateWithoutOrderInput, Prisma.KiorexOrderLineUncheckedCreateWithoutOrderInput> | Prisma.KiorexOrderLineCreateWithoutOrderInput[] | Prisma.KiorexOrderLineUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.KiorexOrderLineCreateOrConnectWithoutOrderInput | Prisma.KiorexOrderLineCreateOrConnectWithoutOrderInput[];
    upsert?: Prisma.KiorexOrderLineUpsertWithWhereUniqueWithoutOrderInput | Prisma.KiorexOrderLineUpsertWithWhereUniqueWithoutOrderInput[];
    createMany?: Prisma.KiorexOrderLineCreateManyOrderInputEnvelope;
    set?: Prisma.KiorexOrderLineWhereUniqueInput | Prisma.KiorexOrderLineWhereUniqueInput[];
    disconnect?: Prisma.KiorexOrderLineWhereUniqueInput | Prisma.KiorexOrderLineWhereUniqueInput[];
    delete?: Prisma.KiorexOrderLineWhereUniqueInput | Prisma.KiorexOrderLineWhereUniqueInput[];
    connect?: Prisma.KiorexOrderLineWhereUniqueInput | Prisma.KiorexOrderLineWhereUniqueInput[];
    update?: Prisma.KiorexOrderLineUpdateWithWhereUniqueWithoutOrderInput | Prisma.KiorexOrderLineUpdateWithWhereUniqueWithoutOrderInput[];
    updateMany?: Prisma.KiorexOrderLineUpdateManyWithWhereWithoutOrderInput | Prisma.KiorexOrderLineUpdateManyWithWhereWithoutOrderInput[];
    deleteMany?: Prisma.KiorexOrderLineScalarWhereInput | Prisma.KiorexOrderLineScalarWhereInput[];
};
export type KiorexOrderLineCreateWithoutOrderInput = {
    id?: string;
    drugId: string;
    qtyRequested: number;
    qtyAccepted?: number;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type KiorexOrderLineUncheckedCreateWithoutOrderInput = {
    id?: string;
    drugId: string;
    qtyRequested: number;
    qtyAccepted?: number;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type KiorexOrderLineCreateOrConnectWithoutOrderInput = {
    where: Prisma.KiorexOrderLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.KiorexOrderLineCreateWithoutOrderInput, Prisma.KiorexOrderLineUncheckedCreateWithoutOrderInput>;
};
export type KiorexOrderLineCreateManyOrderInputEnvelope = {
    data: Prisma.KiorexOrderLineCreateManyOrderInput | Prisma.KiorexOrderLineCreateManyOrderInput[];
    skipDuplicates?: boolean;
};
export type KiorexOrderLineUpsertWithWhereUniqueWithoutOrderInput = {
    where: Prisma.KiorexOrderLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.KiorexOrderLineUpdateWithoutOrderInput, Prisma.KiorexOrderLineUncheckedUpdateWithoutOrderInput>;
    create: Prisma.XOR<Prisma.KiorexOrderLineCreateWithoutOrderInput, Prisma.KiorexOrderLineUncheckedCreateWithoutOrderInput>;
};
export type KiorexOrderLineUpdateWithWhereUniqueWithoutOrderInput = {
    where: Prisma.KiorexOrderLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.KiorexOrderLineUpdateWithoutOrderInput, Prisma.KiorexOrderLineUncheckedUpdateWithoutOrderInput>;
};
export type KiorexOrderLineUpdateManyWithWhereWithoutOrderInput = {
    where: Prisma.KiorexOrderLineScalarWhereInput;
    data: Prisma.XOR<Prisma.KiorexOrderLineUpdateManyMutationInput, Prisma.KiorexOrderLineUncheckedUpdateManyWithoutOrderInput>;
};
export type KiorexOrderLineScalarWhereInput = {
    AND?: Prisma.KiorexOrderLineScalarWhereInput | Prisma.KiorexOrderLineScalarWhereInput[];
    OR?: Prisma.KiorexOrderLineScalarWhereInput[];
    NOT?: Prisma.KiorexOrderLineScalarWhereInput | Prisma.KiorexOrderLineScalarWhereInput[];
    id?: Prisma.StringFilter<"KiorexOrderLine"> | string;
    orderId?: Prisma.StringFilter<"KiorexOrderLine"> | string;
    drugId?: Prisma.StringFilter<"KiorexOrderLine"> | string;
    qtyRequested?: Prisma.IntFilter<"KiorexOrderLine"> | number;
    qtyAccepted?: Prisma.IntFilter<"KiorexOrderLine"> | number;
    unitPrice?: Prisma.DecimalFilter<"KiorexOrderLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type KiorexOrderLineCreateManyOrderInput = {
    id?: string;
    drugId: string;
    qtyRequested: number;
    qtyAccepted?: number;
    unitPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type KiorexOrderLineUpdateWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    qtyRequested?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyAccepted?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type KiorexOrderLineUncheckedUpdateWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    qtyRequested?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyAccepted?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type KiorexOrderLineUncheckedUpdateManyWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    qtyRequested?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyAccepted?: Prisma.IntFieldUpdateOperationsInput | number;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type KiorexOrderLineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    drugId?: boolean;
    qtyRequested?: boolean;
    qtyAccepted?: boolean;
    unitPrice?: boolean;
    order?: boolean | Prisma.KiorexOrderDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["kiorexOrderLine"]>;
export type KiorexOrderLineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    drugId?: boolean;
    qtyRequested?: boolean;
    qtyAccepted?: boolean;
    unitPrice?: boolean;
    order?: boolean | Prisma.KiorexOrderDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["kiorexOrderLine"]>;
export type KiorexOrderLineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    drugId?: boolean;
    qtyRequested?: boolean;
    qtyAccepted?: boolean;
    unitPrice?: boolean;
    order?: boolean | Prisma.KiorexOrderDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["kiorexOrderLine"]>;
export type KiorexOrderLineSelectScalar = {
    id?: boolean;
    orderId?: boolean;
    drugId?: boolean;
    qtyRequested?: boolean;
    qtyAccepted?: boolean;
    unitPrice?: boolean;
};
export type KiorexOrderLineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orderId" | "drugId" | "qtyRequested" | "qtyAccepted" | "unitPrice", ExtArgs["result"]["kiorexOrderLine"]>;
export type KiorexOrderLineInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.KiorexOrderDefaultArgs<ExtArgs>;
};
export type KiorexOrderLineIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.KiorexOrderDefaultArgs<ExtArgs>;
};
export type KiorexOrderLineIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.KiorexOrderDefaultArgs<ExtArgs>;
};
export type $KiorexOrderLinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "KiorexOrderLine";
    objects: {
        order: Prisma.$KiorexOrderPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orderId: string;
        drugId: string;
        qtyRequested: number;
        qtyAccepted: number;
        unitPrice: runtime.Decimal;
    }, ExtArgs["result"]["kiorexOrderLine"]>;
    composites: {};
};
export type KiorexOrderLineGetPayload<S extends boolean | null | undefined | KiorexOrderLineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$KiorexOrderLinePayload, S>;
export type KiorexOrderLineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<KiorexOrderLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: KiorexOrderLineCountAggregateInputType | true;
};
export interface KiorexOrderLineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['KiorexOrderLine'];
        meta: {
            name: 'KiorexOrderLine';
        };
    };
    findUnique<T extends KiorexOrderLineFindUniqueArgs>(args: Prisma.SelectSubset<T, KiorexOrderLineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__KiorexOrderLineClient<runtime.Types.Result.GetResult<Prisma.$KiorexOrderLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends KiorexOrderLineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, KiorexOrderLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__KiorexOrderLineClient<runtime.Types.Result.GetResult<Prisma.$KiorexOrderLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends KiorexOrderLineFindFirstArgs>(args?: Prisma.SelectSubset<T, KiorexOrderLineFindFirstArgs<ExtArgs>>): Prisma.Prisma__KiorexOrderLineClient<runtime.Types.Result.GetResult<Prisma.$KiorexOrderLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends KiorexOrderLineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, KiorexOrderLineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__KiorexOrderLineClient<runtime.Types.Result.GetResult<Prisma.$KiorexOrderLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends KiorexOrderLineFindManyArgs>(args?: Prisma.SelectSubset<T, KiorexOrderLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$KiorexOrderLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends KiorexOrderLineCreateArgs>(args: Prisma.SelectSubset<T, KiorexOrderLineCreateArgs<ExtArgs>>): Prisma.Prisma__KiorexOrderLineClient<runtime.Types.Result.GetResult<Prisma.$KiorexOrderLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends KiorexOrderLineCreateManyArgs>(args?: Prisma.SelectSubset<T, KiorexOrderLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends KiorexOrderLineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, KiorexOrderLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$KiorexOrderLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends KiorexOrderLineDeleteArgs>(args: Prisma.SelectSubset<T, KiorexOrderLineDeleteArgs<ExtArgs>>): Prisma.Prisma__KiorexOrderLineClient<runtime.Types.Result.GetResult<Prisma.$KiorexOrderLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends KiorexOrderLineUpdateArgs>(args: Prisma.SelectSubset<T, KiorexOrderLineUpdateArgs<ExtArgs>>): Prisma.Prisma__KiorexOrderLineClient<runtime.Types.Result.GetResult<Prisma.$KiorexOrderLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends KiorexOrderLineDeleteManyArgs>(args?: Prisma.SelectSubset<T, KiorexOrderLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends KiorexOrderLineUpdateManyArgs>(args: Prisma.SelectSubset<T, KiorexOrderLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends KiorexOrderLineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, KiorexOrderLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$KiorexOrderLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends KiorexOrderLineUpsertArgs>(args: Prisma.SelectSubset<T, KiorexOrderLineUpsertArgs<ExtArgs>>): Prisma.Prisma__KiorexOrderLineClient<runtime.Types.Result.GetResult<Prisma.$KiorexOrderLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends KiorexOrderLineCountArgs>(args?: Prisma.Subset<T, KiorexOrderLineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], KiorexOrderLineCountAggregateOutputType> : number>;
    aggregate<T extends KiorexOrderLineAggregateArgs>(args: Prisma.Subset<T, KiorexOrderLineAggregateArgs>): Prisma.PrismaPromise<GetKiorexOrderLineAggregateType<T>>;
    groupBy<T extends KiorexOrderLineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: KiorexOrderLineGroupByArgs['orderBy'];
    } : {
        orderBy?: KiorexOrderLineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, KiorexOrderLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKiorexOrderLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: KiorexOrderLineFieldRefs;
}
export interface Prisma__KiorexOrderLineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    order<T extends Prisma.KiorexOrderDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.KiorexOrderDefaultArgs<ExtArgs>>): Prisma.Prisma__KiorexOrderClient<runtime.Types.Result.GetResult<Prisma.$KiorexOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface KiorexOrderLineFieldRefs {
    readonly id: Prisma.FieldRef<"KiorexOrderLine", 'String'>;
    readonly orderId: Prisma.FieldRef<"KiorexOrderLine", 'String'>;
    readonly drugId: Prisma.FieldRef<"KiorexOrderLine", 'String'>;
    readonly qtyRequested: Prisma.FieldRef<"KiorexOrderLine", 'Int'>;
    readonly qtyAccepted: Prisma.FieldRef<"KiorexOrderLine", 'Int'>;
    readonly unitPrice: Prisma.FieldRef<"KiorexOrderLine", 'Decimal'>;
}
export type KiorexOrderLineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexOrderLineSelect<ExtArgs> | null;
    omit?: Prisma.KiorexOrderLineOmit<ExtArgs> | null;
    include?: Prisma.KiorexOrderLineInclude<ExtArgs> | null;
    where: Prisma.KiorexOrderLineWhereUniqueInput;
};
export type KiorexOrderLineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexOrderLineSelect<ExtArgs> | null;
    omit?: Prisma.KiorexOrderLineOmit<ExtArgs> | null;
    include?: Prisma.KiorexOrderLineInclude<ExtArgs> | null;
    where: Prisma.KiorexOrderLineWhereUniqueInput;
};
export type KiorexOrderLineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexOrderLineSelect<ExtArgs> | null;
    omit?: Prisma.KiorexOrderLineOmit<ExtArgs> | null;
    include?: Prisma.KiorexOrderLineInclude<ExtArgs> | null;
    where?: Prisma.KiorexOrderLineWhereInput;
    orderBy?: Prisma.KiorexOrderLineOrderByWithRelationInput | Prisma.KiorexOrderLineOrderByWithRelationInput[];
    cursor?: Prisma.KiorexOrderLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.KiorexOrderLineScalarFieldEnum | Prisma.KiorexOrderLineScalarFieldEnum[];
};
export type KiorexOrderLineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexOrderLineSelect<ExtArgs> | null;
    omit?: Prisma.KiorexOrderLineOmit<ExtArgs> | null;
    include?: Prisma.KiorexOrderLineInclude<ExtArgs> | null;
    where?: Prisma.KiorexOrderLineWhereInput;
    orderBy?: Prisma.KiorexOrderLineOrderByWithRelationInput | Prisma.KiorexOrderLineOrderByWithRelationInput[];
    cursor?: Prisma.KiorexOrderLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.KiorexOrderLineScalarFieldEnum | Prisma.KiorexOrderLineScalarFieldEnum[];
};
export type KiorexOrderLineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexOrderLineSelect<ExtArgs> | null;
    omit?: Prisma.KiorexOrderLineOmit<ExtArgs> | null;
    include?: Prisma.KiorexOrderLineInclude<ExtArgs> | null;
    where?: Prisma.KiorexOrderLineWhereInput;
    orderBy?: Prisma.KiorexOrderLineOrderByWithRelationInput | Prisma.KiorexOrderLineOrderByWithRelationInput[];
    cursor?: Prisma.KiorexOrderLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.KiorexOrderLineScalarFieldEnum | Prisma.KiorexOrderLineScalarFieldEnum[];
};
export type KiorexOrderLineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexOrderLineSelect<ExtArgs> | null;
    omit?: Prisma.KiorexOrderLineOmit<ExtArgs> | null;
    include?: Prisma.KiorexOrderLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.KiorexOrderLineCreateInput, Prisma.KiorexOrderLineUncheckedCreateInput>;
};
export type KiorexOrderLineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.KiorexOrderLineCreateManyInput | Prisma.KiorexOrderLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type KiorexOrderLineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexOrderLineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.KiorexOrderLineOmit<ExtArgs> | null;
    data: Prisma.KiorexOrderLineCreateManyInput | Prisma.KiorexOrderLineCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.KiorexOrderLineIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type KiorexOrderLineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexOrderLineSelect<ExtArgs> | null;
    omit?: Prisma.KiorexOrderLineOmit<ExtArgs> | null;
    include?: Prisma.KiorexOrderLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.KiorexOrderLineUpdateInput, Prisma.KiorexOrderLineUncheckedUpdateInput>;
    where: Prisma.KiorexOrderLineWhereUniqueInput;
};
export type KiorexOrderLineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.KiorexOrderLineUpdateManyMutationInput, Prisma.KiorexOrderLineUncheckedUpdateManyInput>;
    where?: Prisma.KiorexOrderLineWhereInput;
    limit?: number;
};
export type KiorexOrderLineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexOrderLineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.KiorexOrderLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.KiorexOrderLineUpdateManyMutationInput, Prisma.KiorexOrderLineUncheckedUpdateManyInput>;
    where?: Prisma.KiorexOrderLineWhereInput;
    limit?: number;
    include?: Prisma.KiorexOrderLineIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type KiorexOrderLineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexOrderLineSelect<ExtArgs> | null;
    omit?: Prisma.KiorexOrderLineOmit<ExtArgs> | null;
    include?: Prisma.KiorexOrderLineInclude<ExtArgs> | null;
    where: Prisma.KiorexOrderLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.KiorexOrderLineCreateInput, Prisma.KiorexOrderLineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.KiorexOrderLineUpdateInput, Prisma.KiorexOrderLineUncheckedUpdateInput>;
};
export type KiorexOrderLineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexOrderLineSelect<ExtArgs> | null;
    omit?: Prisma.KiorexOrderLineOmit<ExtArgs> | null;
    include?: Prisma.KiorexOrderLineInclude<ExtArgs> | null;
    where: Prisma.KiorexOrderLineWhereUniqueInput;
};
export type KiorexOrderLineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.KiorexOrderLineWhereInput;
    limit?: number;
};
export type KiorexOrderLineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexOrderLineSelect<ExtArgs> | null;
    omit?: Prisma.KiorexOrderLineOmit<ExtArgs> | null;
    include?: Prisma.KiorexOrderLineInclude<ExtArgs> | null;
};
