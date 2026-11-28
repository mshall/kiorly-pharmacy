import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type StockCountModel = runtime.Types.Result.DefaultSelection<Prisma.$StockCountPayload>;
export type AggregateStockCount = {
    _count: StockCountCountAggregateOutputType | null;
    _min: StockCountMinAggregateOutputType | null;
    _max: StockCountMaxAggregateOutputType | null;
};
export type StockCountMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    type: $Enums.StockCountType | null;
    status: $Enums.StockCountStatus | null;
    startedBy: string | null;
    approvedBy: string | null;
    startedAt: Date | null;
    closedAt: Date | null;
};
export type StockCountMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    type: $Enums.StockCountType | null;
    status: $Enums.StockCountStatus | null;
    startedBy: string | null;
    approvedBy: string | null;
    startedAt: Date | null;
    closedAt: Date | null;
};
export type StockCountCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    type: number;
    status: number;
    startedBy: number;
    approvedBy: number;
    startedAt: number;
    closedAt: number;
    _all: number;
};
export type StockCountMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    type?: true;
    status?: true;
    startedBy?: true;
    approvedBy?: true;
    startedAt?: true;
    closedAt?: true;
};
export type StockCountMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    type?: true;
    status?: true;
    startedBy?: true;
    approvedBy?: true;
    startedAt?: true;
    closedAt?: true;
};
export type StockCountCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    type?: true;
    status?: true;
    startedBy?: true;
    approvedBy?: true;
    startedAt?: true;
    closedAt?: true;
    _all?: true;
};
export type StockCountAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockCountWhereInput;
    orderBy?: Prisma.StockCountOrderByWithRelationInput | Prisma.StockCountOrderByWithRelationInput[];
    cursor?: Prisma.StockCountWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StockCountCountAggregateInputType;
    _min?: StockCountMinAggregateInputType;
    _max?: StockCountMaxAggregateInputType;
};
export type GetStockCountAggregateType<T extends StockCountAggregateArgs> = {
    [P in keyof T & keyof AggregateStockCount]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStockCount[P]> : Prisma.GetScalarType<T[P], AggregateStockCount[P]>;
};
export type StockCountGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockCountWhereInput;
    orderBy?: Prisma.StockCountOrderByWithAggregationInput | Prisma.StockCountOrderByWithAggregationInput[];
    by: Prisma.StockCountScalarFieldEnum[] | Prisma.StockCountScalarFieldEnum;
    having?: Prisma.StockCountScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StockCountCountAggregateInputType | true;
    _min?: StockCountMinAggregateInputType;
    _max?: StockCountMaxAggregateInputType;
};
export type StockCountGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    type: $Enums.StockCountType;
    status: $Enums.StockCountStatus;
    startedBy: string;
    approvedBy: string | null;
    startedAt: Date;
    closedAt: Date | null;
    _count: StockCountCountAggregateOutputType | null;
    _min: StockCountMinAggregateOutputType | null;
    _max: StockCountMaxAggregateOutputType | null;
};
export type GetStockCountGroupByPayload<T extends StockCountGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StockCountGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StockCountGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StockCountGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StockCountGroupByOutputType[P]>;
}>>;
export type StockCountWhereInput = {
    AND?: Prisma.StockCountWhereInput | Prisma.StockCountWhereInput[];
    OR?: Prisma.StockCountWhereInput[];
    NOT?: Prisma.StockCountWhereInput | Prisma.StockCountWhereInput[];
    id?: Prisma.StringFilter<"StockCount"> | string;
    orgId?: Prisma.StringFilter<"StockCount"> | string;
    branchId?: Prisma.StringFilter<"StockCount"> | string;
    type?: Prisma.EnumStockCountTypeFilter<"StockCount"> | $Enums.StockCountType;
    status?: Prisma.EnumStockCountStatusFilter<"StockCount"> | $Enums.StockCountStatus;
    startedBy?: Prisma.StringFilter<"StockCount"> | string;
    approvedBy?: Prisma.StringNullableFilter<"StockCount"> | string | null;
    startedAt?: Prisma.DateTimeFilter<"StockCount"> | Date | string;
    closedAt?: Prisma.DateTimeNullableFilter<"StockCount"> | Date | string | null;
    lines?: Prisma.StockCountLineListRelationFilter;
};
export type StockCountOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    startedBy?: Prisma.SortOrder;
    approvedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    closedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    lines?: Prisma.StockCountLineOrderByRelationAggregateInput;
};
export type StockCountWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.StockCountWhereInput | Prisma.StockCountWhereInput[];
    OR?: Prisma.StockCountWhereInput[];
    NOT?: Prisma.StockCountWhereInput | Prisma.StockCountWhereInput[];
    orgId?: Prisma.StringFilter<"StockCount"> | string;
    branchId?: Prisma.StringFilter<"StockCount"> | string;
    type?: Prisma.EnumStockCountTypeFilter<"StockCount"> | $Enums.StockCountType;
    status?: Prisma.EnumStockCountStatusFilter<"StockCount"> | $Enums.StockCountStatus;
    startedBy?: Prisma.StringFilter<"StockCount"> | string;
    approvedBy?: Prisma.StringNullableFilter<"StockCount"> | string | null;
    startedAt?: Prisma.DateTimeFilter<"StockCount"> | Date | string;
    closedAt?: Prisma.DateTimeNullableFilter<"StockCount"> | Date | string | null;
    lines?: Prisma.StockCountLineListRelationFilter;
}, "id">;
export type StockCountOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    startedBy?: Prisma.SortOrder;
    approvedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    closedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.StockCountCountOrderByAggregateInput;
    _max?: Prisma.StockCountMaxOrderByAggregateInput;
    _min?: Prisma.StockCountMinOrderByAggregateInput;
};
export type StockCountScalarWhereWithAggregatesInput = {
    AND?: Prisma.StockCountScalarWhereWithAggregatesInput | Prisma.StockCountScalarWhereWithAggregatesInput[];
    OR?: Prisma.StockCountScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StockCountScalarWhereWithAggregatesInput | Prisma.StockCountScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"StockCount"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"StockCount"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"StockCount"> | string;
    type?: Prisma.EnumStockCountTypeWithAggregatesFilter<"StockCount"> | $Enums.StockCountType;
    status?: Prisma.EnumStockCountStatusWithAggregatesFilter<"StockCount"> | $Enums.StockCountStatus;
    startedBy?: Prisma.StringWithAggregatesFilter<"StockCount"> | string;
    approvedBy?: Prisma.StringNullableWithAggregatesFilter<"StockCount"> | string | null;
    startedAt?: Prisma.DateTimeWithAggregatesFilter<"StockCount"> | Date | string;
    closedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"StockCount"> | Date | string | null;
};
export type StockCountCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    type: $Enums.StockCountType;
    status?: $Enums.StockCountStatus;
    startedBy: string;
    approvedBy?: string | null;
    startedAt?: Date | string;
    closedAt?: Date | string | null;
    lines?: Prisma.StockCountLineCreateNestedManyWithoutStockCountInput;
};
export type StockCountUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    type: $Enums.StockCountType;
    status?: $Enums.StockCountStatus;
    startedBy: string;
    approvedBy?: string | null;
    startedAt?: Date | string;
    closedAt?: Date | string | null;
    lines?: Prisma.StockCountLineUncheckedCreateNestedManyWithoutStockCountInput;
};
export type StockCountUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumStockCountTypeFieldUpdateOperationsInput | $Enums.StockCountType;
    status?: Prisma.EnumStockCountStatusFieldUpdateOperationsInput | $Enums.StockCountStatus;
    startedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    approvedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lines?: Prisma.StockCountLineUpdateManyWithoutStockCountNestedInput;
};
export type StockCountUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumStockCountTypeFieldUpdateOperationsInput | $Enums.StockCountType;
    status?: Prisma.EnumStockCountStatusFieldUpdateOperationsInput | $Enums.StockCountStatus;
    startedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    approvedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lines?: Prisma.StockCountLineUncheckedUpdateManyWithoutStockCountNestedInput;
};
export type StockCountCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    type: $Enums.StockCountType;
    status?: $Enums.StockCountStatus;
    startedBy: string;
    approvedBy?: string | null;
    startedAt?: Date | string;
    closedAt?: Date | string | null;
};
export type StockCountUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumStockCountTypeFieldUpdateOperationsInput | $Enums.StockCountType;
    status?: Prisma.EnumStockCountStatusFieldUpdateOperationsInput | $Enums.StockCountStatus;
    startedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    approvedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type StockCountUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumStockCountTypeFieldUpdateOperationsInput | $Enums.StockCountType;
    status?: Prisma.EnumStockCountStatusFieldUpdateOperationsInput | $Enums.StockCountStatus;
    startedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    approvedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type StockCountCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    startedBy?: Prisma.SortOrder;
    approvedBy?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    closedAt?: Prisma.SortOrder;
};
export type StockCountMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    startedBy?: Prisma.SortOrder;
    approvedBy?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    closedAt?: Prisma.SortOrder;
};
export type StockCountMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    startedBy?: Prisma.SortOrder;
    approvedBy?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    closedAt?: Prisma.SortOrder;
};
export type StockCountScalarRelationFilter = {
    is?: Prisma.StockCountWhereInput;
    isNot?: Prisma.StockCountWhereInput;
};
export type EnumStockCountTypeFieldUpdateOperationsInput = {
    set?: $Enums.StockCountType;
};
export type EnumStockCountStatusFieldUpdateOperationsInput = {
    set?: $Enums.StockCountStatus;
};
export type StockCountCreateNestedOneWithoutLinesInput = {
    create?: Prisma.XOR<Prisma.StockCountCreateWithoutLinesInput, Prisma.StockCountUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.StockCountCreateOrConnectWithoutLinesInput;
    connect?: Prisma.StockCountWhereUniqueInput;
};
export type StockCountUpdateOneRequiredWithoutLinesNestedInput = {
    create?: Prisma.XOR<Prisma.StockCountCreateWithoutLinesInput, Prisma.StockCountUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.StockCountCreateOrConnectWithoutLinesInput;
    upsert?: Prisma.StockCountUpsertWithoutLinesInput;
    connect?: Prisma.StockCountWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.StockCountUpdateToOneWithWhereWithoutLinesInput, Prisma.StockCountUpdateWithoutLinesInput>, Prisma.StockCountUncheckedUpdateWithoutLinesInput>;
};
export type StockCountCreateWithoutLinesInput = {
    id?: string;
    orgId: string;
    branchId: string;
    type: $Enums.StockCountType;
    status?: $Enums.StockCountStatus;
    startedBy: string;
    approvedBy?: string | null;
    startedAt?: Date | string;
    closedAt?: Date | string | null;
};
export type StockCountUncheckedCreateWithoutLinesInput = {
    id?: string;
    orgId: string;
    branchId: string;
    type: $Enums.StockCountType;
    status?: $Enums.StockCountStatus;
    startedBy: string;
    approvedBy?: string | null;
    startedAt?: Date | string;
    closedAt?: Date | string | null;
};
export type StockCountCreateOrConnectWithoutLinesInput = {
    where: Prisma.StockCountWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockCountCreateWithoutLinesInput, Prisma.StockCountUncheckedCreateWithoutLinesInput>;
};
export type StockCountUpsertWithoutLinesInput = {
    update: Prisma.XOR<Prisma.StockCountUpdateWithoutLinesInput, Prisma.StockCountUncheckedUpdateWithoutLinesInput>;
    create: Prisma.XOR<Prisma.StockCountCreateWithoutLinesInput, Prisma.StockCountUncheckedCreateWithoutLinesInput>;
    where?: Prisma.StockCountWhereInput;
};
export type StockCountUpdateToOneWithWhereWithoutLinesInput = {
    where?: Prisma.StockCountWhereInput;
    data: Prisma.XOR<Prisma.StockCountUpdateWithoutLinesInput, Prisma.StockCountUncheckedUpdateWithoutLinesInput>;
};
export type StockCountUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumStockCountTypeFieldUpdateOperationsInput | $Enums.StockCountType;
    status?: Prisma.EnumStockCountStatusFieldUpdateOperationsInput | $Enums.StockCountStatus;
    startedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    approvedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type StockCountUncheckedUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumStockCountTypeFieldUpdateOperationsInput | $Enums.StockCountType;
    status?: Prisma.EnumStockCountStatusFieldUpdateOperationsInput | $Enums.StockCountStatus;
    startedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    approvedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type StockCountCountOutputType = {
    lines: number;
};
export type StockCountCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | StockCountCountOutputTypeCountLinesArgs;
};
export type StockCountCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountCountOutputTypeSelect<ExtArgs> | null;
};
export type StockCountCountOutputTypeCountLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockCountLineWhereInput;
};
export type StockCountSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    type?: boolean;
    status?: boolean;
    startedBy?: boolean;
    approvedBy?: boolean;
    startedAt?: boolean;
    closedAt?: boolean;
    lines?: boolean | Prisma.StockCount$linesArgs<ExtArgs>;
    _count?: boolean | Prisma.StockCountCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stockCount"]>;
export type StockCountSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    type?: boolean;
    status?: boolean;
    startedBy?: boolean;
    approvedBy?: boolean;
    startedAt?: boolean;
    closedAt?: boolean;
}, ExtArgs["result"]["stockCount"]>;
export type StockCountSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    type?: boolean;
    status?: boolean;
    startedBy?: boolean;
    approvedBy?: boolean;
    startedAt?: boolean;
    closedAt?: boolean;
}, ExtArgs["result"]["stockCount"]>;
export type StockCountSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    type?: boolean;
    status?: boolean;
    startedBy?: boolean;
    approvedBy?: boolean;
    startedAt?: boolean;
    closedAt?: boolean;
};
export type StockCountOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "type" | "status" | "startedBy" | "approvedBy" | "startedAt" | "closedAt", ExtArgs["result"]["stockCount"]>;
export type StockCountInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | Prisma.StockCount$linesArgs<ExtArgs>;
    _count?: boolean | Prisma.StockCountCountOutputTypeDefaultArgs<ExtArgs>;
};
export type StockCountIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type StockCountIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $StockCountPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StockCount";
    objects: {
        lines: Prisma.$StockCountLinePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        type: $Enums.StockCountType;
        status: $Enums.StockCountStatus;
        startedBy: string;
        approvedBy: string | null;
        startedAt: Date;
        closedAt: Date | null;
    }, ExtArgs["result"]["stockCount"]>;
    composites: {};
};
export type StockCountGetPayload<S extends boolean | null | undefined | StockCountDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StockCountPayload, S>;
export type StockCountCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StockCountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StockCountCountAggregateInputType | true;
};
export interface StockCountDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StockCount'];
        meta: {
            name: 'StockCount';
        };
    };
    findUnique<T extends StockCountFindUniqueArgs>(args: Prisma.SelectSubset<T, StockCountFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StockCountClient<runtime.Types.Result.GetResult<Prisma.$StockCountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StockCountFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StockCountFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StockCountClient<runtime.Types.Result.GetResult<Prisma.$StockCountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StockCountFindFirstArgs>(args?: Prisma.SelectSubset<T, StockCountFindFirstArgs<ExtArgs>>): Prisma.Prisma__StockCountClient<runtime.Types.Result.GetResult<Prisma.$StockCountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StockCountFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StockCountFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StockCountClient<runtime.Types.Result.GetResult<Prisma.$StockCountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StockCountFindManyArgs>(args?: Prisma.SelectSubset<T, StockCountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockCountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StockCountCreateArgs>(args: Prisma.SelectSubset<T, StockCountCreateArgs<ExtArgs>>): Prisma.Prisma__StockCountClient<runtime.Types.Result.GetResult<Prisma.$StockCountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StockCountCreateManyArgs>(args?: Prisma.SelectSubset<T, StockCountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StockCountCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StockCountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockCountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StockCountDeleteArgs>(args: Prisma.SelectSubset<T, StockCountDeleteArgs<ExtArgs>>): Prisma.Prisma__StockCountClient<runtime.Types.Result.GetResult<Prisma.$StockCountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StockCountUpdateArgs>(args: Prisma.SelectSubset<T, StockCountUpdateArgs<ExtArgs>>): Prisma.Prisma__StockCountClient<runtime.Types.Result.GetResult<Prisma.$StockCountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StockCountDeleteManyArgs>(args?: Prisma.SelectSubset<T, StockCountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StockCountUpdateManyArgs>(args: Prisma.SelectSubset<T, StockCountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StockCountUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StockCountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockCountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StockCountUpsertArgs>(args: Prisma.SelectSubset<T, StockCountUpsertArgs<ExtArgs>>): Prisma.Prisma__StockCountClient<runtime.Types.Result.GetResult<Prisma.$StockCountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StockCountCountArgs>(args?: Prisma.Subset<T, StockCountCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StockCountCountAggregateOutputType> : number>;
    aggregate<T extends StockCountAggregateArgs>(args: Prisma.Subset<T, StockCountAggregateArgs>): Prisma.PrismaPromise<GetStockCountAggregateType<T>>;
    groupBy<T extends StockCountGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StockCountGroupByArgs['orderBy'];
    } : {
        orderBy?: StockCountGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StockCountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockCountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StockCountFieldRefs;
}
export interface Prisma__StockCountClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    lines<T extends Prisma.StockCount$linesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.StockCount$linesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockCountLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StockCountFieldRefs {
    readonly id: Prisma.FieldRef<"StockCount", 'String'>;
    readonly orgId: Prisma.FieldRef<"StockCount", 'String'>;
    readonly branchId: Prisma.FieldRef<"StockCount", 'String'>;
    readonly type: Prisma.FieldRef<"StockCount", 'StockCountType'>;
    readonly status: Prisma.FieldRef<"StockCount", 'StockCountStatus'>;
    readonly startedBy: Prisma.FieldRef<"StockCount", 'String'>;
    readonly approvedBy: Prisma.FieldRef<"StockCount", 'String'>;
    readonly startedAt: Prisma.FieldRef<"StockCount", 'DateTime'>;
    readonly closedAt: Prisma.FieldRef<"StockCount", 'DateTime'>;
}
export type StockCountFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountSelect<ExtArgs> | null;
    omit?: Prisma.StockCountOmit<ExtArgs> | null;
    include?: Prisma.StockCountInclude<ExtArgs> | null;
    where: Prisma.StockCountWhereUniqueInput;
};
export type StockCountFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountSelect<ExtArgs> | null;
    omit?: Prisma.StockCountOmit<ExtArgs> | null;
    include?: Prisma.StockCountInclude<ExtArgs> | null;
    where: Prisma.StockCountWhereUniqueInput;
};
export type StockCountFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountSelect<ExtArgs> | null;
    omit?: Prisma.StockCountOmit<ExtArgs> | null;
    include?: Prisma.StockCountInclude<ExtArgs> | null;
    where?: Prisma.StockCountWhereInput;
    orderBy?: Prisma.StockCountOrderByWithRelationInput | Prisma.StockCountOrderByWithRelationInput[];
    cursor?: Prisma.StockCountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockCountScalarFieldEnum | Prisma.StockCountScalarFieldEnum[];
};
export type StockCountFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountSelect<ExtArgs> | null;
    omit?: Prisma.StockCountOmit<ExtArgs> | null;
    include?: Prisma.StockCountInclude<ExtArgs> | null;
    where?: Prisma.StockCountWhereInput;
    orderBy?: Prisma.StockCountOrderByWithRelationInput | Prisma.StockCountOrderByWithRelationInput[];
    cursor?: Prisma.StockCountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockCountScalarFieldEnum | Prisma.StockCountScalarFieldEnum[];
};
export type StockCountFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountSelect<ExtArgs> | null;
    omit?: Prisma.StockCountOmit<ExtArgs> | null;
    include?: Prisma.StockCountInclude<ExtArgs> | null;
    where?: Prisma.StockCountWhereInput;
    orderBy?: Prisma.StockCountOrderByWithRelationInput | Prisma.StockCountOrderByWithRelationInput[];
    cursor?: Prisma.StockCountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockCountScalarFieldEnum | Prisma.StockCountScalarFieldEnum[];
};
export type StockCountCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountSelect<ExtArgs> | null;
    omit?: Prisma.StockCountOmit<ExtArgs> | null;
    include?: Prisma.StockCountInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockCountCreateInput, Prisma.StockCountUncheckedCreateInput>;
};
export type StockCountCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StockCountCreateManyInput | Prisma.StockCountCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StockCountCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StockCountOmit<ExtArgs> | null;
    data: Prisma.StockCountCreateManyInput | Prisma.StockCountCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StockCountUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountSelect<ExtArgs> | null;
    omit?: Prisma.StockCountOmit<ExtArgs> | null;
    include?: Prisma.StockCountInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockCountUpdateInput, Prisma.StockCountUncheckedUpdateInput>;
    where: Prisma.StockCountWhereUniqueInput;
};
export type StockCountUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StockCountUpdateManyMutationInput, Prisma.StockCountUncheckedUpdateManyInput>;
    where?: Prisma.StockCountWhereInput;
    limit?: number;
};
export type StockCountUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StockCountOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockCountUpdateManyMutationInput, Prisma.StockCountUncheckedUpdateManyInput>;
    where?: Prisma.StockCountWhereInput;
    limit?: number;
};
export type StockCountUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountSelect<ExtArgs> | null;
    omit?: Prisma.StockCountOmit<ExtArgs> | null;
    include?: Prisma.StockCountInclude<ExtArgs> | null;
    where: Prisma.StockCountWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockCountCreateInput, Prisma.StockCountUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StockCountUpdateInput, Prisma.StockCountUncheckedUpdateInput>;
};
export type StockCountDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountSelect<ExtArgs> | null;
    omit?: Prisma.StockCountOmit<ExtArgs> | null;
    include?: Prisma.StockCountInclude<ExtArgs> | null;
    where: Prisma.StockCountWhereUniqueInput;
};
export type StockCountDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockCountWhereInput;
    limit?: number;
};
export type StockCount$linesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StockCountDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockCountSelect<ExtArgs> | null;
    omit?: Prisma.StockCountOmit<ExtArgs> | null;
    include?: Prisma.StockCountInclude<ExtArgs> | null;
};
