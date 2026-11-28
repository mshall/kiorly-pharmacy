import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type MobileUpgradeRequestModel = runtime.Types.Result.DefaultSelection<Prisma.$MobileUpgradeRequestPayload>;
export type AggregateMobileUpgradeRequest = {
    _count: MobileUpgradeRequestCountAggregateOutputType | null;
    _avg: MobileUpgradeRequestAvgAggregateOutputType | null;
    _sum: MobileUpgradeRequestSumAggregateOutputType | null;
    _min: MobileUpgradeRequestMinAggregateOutputType | null;
    _max: MobileUpgradeRequestMaxAggregateOutputType | null;
};
export type MobileUpgradeRequestAvgAggregateOutputType = {
    notifiedCount: number | null;
};
export type MobileUpgradeRequestSumAggregateOutputType = {
    notifiedCount: number | null;
};
export type MobileUpgradeRequestMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    userId: string | null;
    role: string | null;
    featureKey: string | null;
    plan: string | null;
    note: string | null;
    status: string | null;
    notifiedCount: number | null;
    createdAt: Date | null;
};
export type MobileUpgradeRequestMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    userId: string | null;
    role: string | null;
    featureKey: string | null;
    plan: string | null;
    note: string | null;
    status: string | null;
    notifiedCount: number | null;
    createdAt: Date | null;
};
export type MobileUpgradeRequestCountAggregateOutputType = {
    id: number;
    orgId: number;
    userId: number;
    role: number;
    featureKey: number;
    plan: number;
    note: number;
    status: number;
    notifiedCount: number;
    createdAt: number;
    _all: number;
};
export type MobileUpgradeRequestAvgAggregateInputType = {
    notifiedCount?: true;
};
export type MobileUpgradeRequestSumAggregateInputType = {
    notifiedCount?: true;
};
export type MobileUpgradeRequestMinAggregateInputType = {
    id?: true;
    orgId?: true;
    userId?: true;
    role?: true;
    featureKey?: true;
    plan?: true;
    note?: true;
    status?: true;
    notifiedCount?: true;
    createdAt?: true;
};
export type MobileUpgradeRequestMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    userId?: true;
    role?: true;
    featureKey?: true;
    plan?: true;
    note?: true;
    status?: true;
    notifiedCount?: true;
    createdAt?: true;
};
export type MobileUpgradeRequestCountAggregateInputType = {
    id?: true;
    orgId?: true;
    userId?: true;
    role?: true;
    featureKey?: true;
    plan?: true;
    note?: true;
    status?: true;
    notifiedCount?: true;
    createdAt?: true;
    _all?: true;
};
export type MobileUpgradeRequestAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MobileUpgradeRequestWhereInput;
    orderBy?: Prisma.MobileUpgradeRequestOrderByWithRelationInput | Prisma.MobileUpgradeRequestOrderByWithRelationInput[];
    cursor?: Prisma.MobileUpgradeRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MobileUpgradeRequestCountAggregateInputType;
    _avg?: MobileUpgradeRequestAvgAggregateInputType;
    _sum?: MobileUpgradeRequestSumAggregateInputType;
    _min?: MobileUpgradeRequestMinAggregateInputType;
    _max?: MobileUpgradeRequestMaxAggregateInputType;
};
export type GetMobileUpgradeRequestAggregateType<T extends MobileUpgradeRequestAggregateArgs> = {
    [P in keyof T & keyof AggregateMobileUpgradeRequest]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMobileUpgradeRequest[P]> : Prisma.GetScalarType<T[P], AggregateMobileUpgradeRequest[P]>;
};
export type MobileUpgradeRequestGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MobileUpgradeRequestWhereInput;
    orderBy?: Prisma.MobileUpgradeRequestOrderByWithAggregationInput | Prisma.MobileUpgradeRequestOrderByWithAggregationInput[];
    by: Prisma.MobileUpgradeRequestScalarFieldEnum[] | Prisma.MobileUpgradeRequestScalarFieldEnum;
    having?: Prisma.MobileUpgradeRequestScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MobileUpgradeRequestCountAggregateInputType | true;
    _avg?: MobileUpgradeRequestAvgAggregateInputType;
    _sum?: MobileUpgradeRequestSumAggregateInputType;
    _min?: MobileUpgradeRequestMinAggregateInputType;
    _max?: MobileUpgradeRequestMaxAggregateInputType;
};
export type MobileUpgradeRequestGroupByOutputType = {
    id: string;
    orgId: string;
    userId: string;
    role: string;
    featureKey: string;
    plan: string;
    note: string | null;
    status: string;
    notifiedCount: number;
    createdAt: Date;
    _count: MobileUpgradeRequestCountAggregateOutputType | null;
    _avg: MobileUpgradeRequestAvgAggregateOutputType | null;
    _sum: MobileUpgradeRequestSumAggregateOutputType | null;
    _min: MobileUpgradeRequestMinAggregateOutputType | null;
    _max: MobileUpgradeRequestMaxAggregateOutputType | null;
};
export type GetMobileUpgradeRequestGroupByPayload<T extends MobileUpgradeRequestGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MobileUpgradeRequestGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MobileUpgradeRequestGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MobileUpgradeRequestGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MobileUpgradeRequestGroupByOutputType[P]>;
}>>;
export type MobileUpgradeRequestWhereInput = {
    AND?: Prisma.MobileUpgradeRequestWhereInput | Prisma.MobileUpgradeRequestWhereInput[];
    OR?: Prisma.MobileUpgradeRequestWhereInput[];
    NOT?: Prisma.MobileUpgradeRequestWhereInput | Prisma.MobileUpgradeRequestWhereInput[];
    id?: Prisma.StringFilter<"MobileUpgradeRequest"> | string;
    orgId?: Prisma.StringFilter<"MobileUpgradeRequest"> | string;
    userId?: Prisma.StringFilter<"MobileUpgradeRequest"> | string;
    role?: Prisma.StringFilter<"MobileUpgradeRequest"> | string;
    featureKey?: Prisma.StringFilter<"MobileUpgradeRequest"> | string;
    plan?: Prisma.StringFilter<"MobileUpgradeRequest"> | string;
    note?: Prisma.StringNullableFilter<"MobileUpgradeRequest"> | string | null;
    status?: Prisma.StringFilter<"MobileUpgradeRequest"> | string;
    notifiedCount?: Prisma.IntFilter<"MobileUpgradeRequest"> | number;
    createdAt?: Prisma.DateTimeFilter<"MobileUpgradeRequest"> | Date | string;
};
export type MobileUpgradeRequestOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    featureKey?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notifiedCount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MobileUpgradeRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.MobileUpgradeRequestWhereInput | Prisma.MobileUpgradeRequestWhereInput[];
    OR?: Prisma.MobileUpgradeRequestWhereInput[];
    NOT?: Prisma.MobileUpgradeRequestWhereInput | Prisma.MobileUpgradeRequestWhereInput[];
    orgId?: Prisma.StringFilter<"MobileUpgradeRequest"> | string;
    userId?: Prisma.StringFilter<"MobileUpgradeRequest"> | string;
    role?: Prisma.StringFilter<"MobileUpgradeRequest"> | string;
    featureKey?: Prisma.StringFilter<"MobileUpgradeRequest"> | string;
    plan?: Prisma.StringFilter<"MobileUpgradeRequest"> | string;
    note?: Prisma.StringNullableFilter<"MobileUpgradeRequest"> | string | null;
    status?: Prisma.StringFilter<"MobileUpgradeRequest"> | string;
    notifiedCount?: Prisma.IntFilter<"MobileUpgradeRequest"> | number;
    createdAt?: Prisma.DateTimeFilter<"MobileUpgradeRequest"> | Date | string;
}, "id">;
export type MobileUpgradeRequestOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    featureKey?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notifiedCount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.MobileUpgradeRequestCountOrderByAggregateInput;
    _avg?: Prisma.MobileUpgradeRequestAvgOrderByAggregateInput;
    _max?: Prisma.MobileUpgradeRequestMaxOrderByAggregateInput;
    _min?: Prisma.MobileUpgradeRequestMinOrderByAggregateInput;
    _sum?: Prisma.MobileUpgradeRequestSumOrderByAggregateInput;
};
export type MobileUpgradeRequestScalarWhereWithAggregatesInput = {
    AND?: Prisma.MobileUpgradeRequestScalarWhereWithAggregatesInput | Prisma.MobileUpgradeRequestScalarWhereWithAggregatesInput[];
    OR?: Prisma.MobileUpgradeRequestScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MobileUpgradeRequestScalarWhereWithAggregatesInput | Prisma.MobileUpgradeRequestScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"MobileUpgradeRequest"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"MobileUpgradeRequest"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"MobileUpgradeRequest"> | string;
    role?: Prisma.StringWithAggregatesFilter<"MobileUpgradeRequest"> | string;
    featureKey?: Prisma.StringWithAggregatesFilter<"MobileUpgradeRequest"> | string;
    plan?: Prisma.StringWithAggregatesFilter<"MobileUpgradeRequest"> | string;
    note?: Prisma.StringNullableWithAggregatesFilter<"MobileUpgradeRequest"> | string | null;
    status?: Prisma.StringWithAggregatesFilter<"MobileUpgradeRequest"> | string;
    notifiedCount?: Prisma.IntWithAggregatesFilter<"MobileUpgradeRequest"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"MobileUpgradeRequest"> | Date | string;
};
export type MobileUpgradeRequestCreateInput = {
    id?: string;
    orgId: string;
    userId: string;
    role: string;
    featureKey: string;
    plan: string;
    note?: string | null;
    status?: string;
    notifiedCount?: number;
    createdAt?: Date | string;
};
export type MobileUpgradeRequestUncheckedCreateInput = {
    id?: string;
    orgId: string;
    userId: string;
    role: string;
    featureKey: string;
    plan: string;
    note?: string | null;
    status?: string;
    notifiedCount?: number;
    createdAt?: Date | string;
};
export type MobileUpgradeRequestUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    featureKey?: Prisma.StringFieldUpdateOperationsInput | string;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notifiedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MobileUpgradeRequestUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    featureKey?: Prisma.StringFieldUpdateOperationsInput | string;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notifiedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MobileUpgradeRequestCreateManyInput = {
    id?: string;
    orgId: string;
    userId: string;
    role: string;
    featureKey: string;
    plan: string;
    note?: string | null;
    status?: string;
    notifiedCount?: number;
    createdAt?: Date | string;
};
export type MobileUpgradeRequestUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    featureKey?: Prisma.StringFieldUpdateOperationsInput | string;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notifiedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MobileUpgradeRequestUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    featureKey?: Prisma.StringFieldUpdateOperationsInput | string;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notifiedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MobileUpgradeRequestCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    featureKey?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notifiedCount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MobileUpgradeRequestAvgOrderByAggregateInput = {
    notifiedCount?: Prisma.SortOrder;
};
export type MobileUpgradeRequestMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    featureKey?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notifiedCount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MobileUpgradeRequestMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    featureKey?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notifiedCount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MobileUpgradeRequestSumOrderByAggregateInput = {
    notifiedCount?: Prisma.SortOrder;
};
export type MobileUpgradeRequestSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    userId?: boolean;
    role?: boolean;
    featureKey?: boolean;
    plan?: boolean;
    note?: boolean;
    status?: boolean;
    notifiedCount?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["mobileUpgradeRequest"]>;
export type MobileUpgradeRequestSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    userId?: boolean;
    role?: boolean;
    featureKey?: boolean;
    plan?: boolean;
    note?: boolean;
    status?: boolean;
    notifiedCount?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["mobileUpgradeRequest"]>;
export type MobileUpgradeRequestSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    userId?: boolean;
    role?: boolean;
    featureKey?: boolean;
    plan?: boolean;
    note?: boolean;
    status?: boolean;
    notifiedCount?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["mobileUpgradeRequest"]>;
export type MobileUpgradeRequestSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    userId?: boolean;
    role?: boolean;
    featureKey?: boolean;
    plan?: boolean;
    note?: boolean;
    status?: boolean;
    notifiedCount?: boolean;
    createdAt?: boolean;
};
export type MobileUpgradeRequestOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "userId" | "role" | "featureKey" | "plan" | "note" | "status" | "notifiedCount" | "createdAt", ExtArgs["result"]["mobileUpgradeRequest"]>;
export type $MobileUpgradeRequestPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MobileUpgradeRequest";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        userId: string;
        role: string;
        featureKey: string;
        plan: string;
        note: string | null;
        status: string;
        notifiedCount: number;
        createdAt: Date;
    }, ExtArgs["result"]["mobileUpgradeRequest"]>;
    composites: {};
};
export type MobileUpgradeRequestGetPayload<S extends boolean | null | undefined | MobileUpgradeRequestDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MobileUpgradeRequestPayload, S>;
export type MobileUpgradeRequestCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MobileUpgradeRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MobileUpgradeRequestCountAggregateInputType | true;
};
export interface MobileUpgradeRequestDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MobileUpgradeRequest'];
        meta: {
            name: 'MobileUpgradeRequest';
        };
    };
    findUnique<T extends MobileUpgradeRequestFindUniqueArgs>(args: Prisma.SelectSubset<T, MobileUpgradeRequestFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MobileUpgradeRequestClient<runtime.Types.Result.GetResult<Prisma.$MobileUpgradeRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MobileUpgradeRequestFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MobileUpgradeRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MobileUpgradeRequestClient<runtime.Types.Result.GetResult<Prisma.$MobileUpgradeRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MobileUpgradeRequestFindFirstArgs>(args?: Prisma.SelectSubset<T, MobileUpgradeRequestFindFirstArgs<ExtArgs>>): Prisma.Prisma__MobileUpgradeRequestClient<runtime.Types.Result.GetResult<Prisma.$MobileUpgradeRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MobileUpgradeRequestFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MobileUpgradeRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MobileUpgradeRequestClient<runtime.Types.Result.GetResult<Prisma.$MobileUpgradeRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MobileUpgradeRequestFindManyArgs>(args?: Prisma.SelectSubset<T, MobileUpgradeRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MobileUpgradeRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MobileUpgradeRequestCreateArgs>(args: Prisma.SelectSubset<T, MobileUpgradeRequestCreateArgs<ExtArgs>>): Prisma.Prisma__MobileUpgradeRequestClient<runtime.Types.Result.GetResult<Prisma.$MobileUpgradeRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MobileUpgradeRequestCreateManyArgs>(args?: Prisma.SelectSubset<T, MobileUpgradeRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MobileUpgradeRequestCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MobileUpgradeRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MobileUpgradeRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MobileUpgradeRequestDeleteArgs>(args: Prisma.SelectSubset<T, MobileUpgradeRequestDeleteArgs<ExtArgs>>): Prisma.Prisma__MobileUpgradeRequestClient<runtime.Types.Result.GetResult<Prisma.$MobileUpgradeRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MobileUpgradeRequestUpdateArgs>(args: Prisma.SelectSubset<T, MobileUpgradeRequestUpdateArgs<ExtArgs>>): Prisma.Prisma__MobileUpgradeRequestClient<runtime.Types.Result.GetResult<Prisma.$MobileUpgradeRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MobileUpgradeRequestDeleteManyArgs>(args?: Prisma.SelectSubset<T, MobileUpgradeRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MobileUpgradeRequestUpdateManyArgs>(args: Prisma.SelectSubset<T, MobileUpgradeRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MobileUpgradeRequestUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MobileUpgradeRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MobileUpgradeRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MobileUpgradeRequestUpsertArgs>(args: Prisma.SelectSubset<T, MobileUpgradeRequestUpsertArgs<ExtArgs>>): Prisma.Prisma__MobileUpgradeRequestClient<runtime.Types.Result.GetResult<Prisma.$MobileUpgradeRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MobileUpgradeRequestCountArgs>(args?: Prisma.Subset<T, MobileUpgradeRequestCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MobileUpgradeRequestCountAggregateOutputType> : number>;
    aggregate<T extends MobileUpgradeRequestAggregateArgs>(args: Prisma.Subset<T, MobileUpgradeRequestAggregateArgs>): Prisma.PrismaPromise<GetMobileUpgradeRequestAggregateType<T>>;
    groupBy<T extends MobileUpgradeRequestGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MobileUpgradeRequestGroupByArgs['orderBy'];
    } : {
        orderBy?: MobileUpgradeRequestGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MobileUpgradeRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMobileUpgradeRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MobileUpgradeRequestFieldRefs;
}
export interface Prisma__MobileUpgradeRequestClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MobileUpgradeRequestFieldRefs {
    readonly id: Prisma.FieldRef<"MobileUpgradeRequest", 'String'>;
    readonly orgId: Prisma.FieldRef<"MobileUpgradeRequest", 'String'>;
    readonly userId: Prisma.FieldRef<"MobileUpgradeRequest", 'String'>;
    readonly role: Prisma.FieldRef<"MobileUpgradeRequest", 'String'>;
    readonly featureKey: Prisma.FieldRef<"MobileUpgradeRequest", 'String'>;
    readonly plan: Prisma.FieldRef<"MobileUpgradeRequest", 'String'>;
    readonly note: Prisma.FieldRef<"MobileUpgradeRequest", 'String'>;
    readonly status: Prisma.FieldRef<"MobileUpgradeRequest", 'String'>;
    readonly notifiedCount: Prisma.FieldRef<"MobileUpgradeRequest", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"MobileUpgradeRequest", 'DateTime'>;
}
export type MobileUpgradeRequestFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileUpgradeRequestSelect<ExtArgs> | null;
    omit?: Prisma.MobileUpgradeRequestOmit<ExtArgs> | null;
    where: Prisma.MobileUpgradeRequestWhereUniqueInput;
};
export type MobileUpgradeRequestFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileUpgradeRequestSelect<ExtArgs> | null;
    omit?: Prisma.MobileUpgradeRequestOmit<ExtArgs> | null;
    where: Prisma.MobileUpgradeRequestWhereUniqueInput;
};
export type MobileUpgradeRequestFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileUpgradeRequestSelect<ExtArgs> | null;
    omit?: Prisma.MobileUpgradeRequestOmit<ExtArgs> | null;
    where?: Prisma.MobileUpgradeRequestWhereInput;
    orderBy?: Prisma.MobileUpgradeRequestOrderByWithRelationInput | Prisma.MobileUpgradeRequestOrderByWithRelationInput[];
    cursor?: Prisma.MobileUpgradeRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MobileUpgradeRequestScalarFieldEnum | Prisma.MobileUpgradeRequestScalarFieldEnum[];
};
export type MobileUpgradeRequestFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileUpgradeRequestSelect<ExtArgs> | null;
    omit?: Prisma.MobileUpgradeRequestOmit<ExtArgs> | null;
    where?: Prisma.MobileUpgradeRequestWhereInput;
    orderBy?: Prisma.MobileUpgradeRequestOrderByWithRelationInput | Prisma.MobileUpgradeRequestOrderByWithRelationInput[];
    cursor?: Prisma.MobileUpgradeRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MobileUpgradeRequestScalarFieldEnum | Prisma.MobileUpgradeRequestScalarFieldEnum[];
};
export type MobileUpgradeRequestFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileUpgradeRequestSelect<ExtArgs> | null;
    omit?: Prisma.MobileUpgradeRequestOmit<ExtArgs> | null;
    where?: Prisma.MobileUpgradeRequestWhereInput;
    orderBy?: Prisma.MobileUpgradeRequestOrderByWithRelationInput | Prisma.MobileUpgradeRequestOrderByWithRelationInput[];
    cursor?: Prisma.MobileUpgradeRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MobileUpgradeRequestScalarFieldEnum | Prisma.MobileUpgradeRequestScalarFieldEnum[];
};
export type MobileUpgradeRequestCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileUpgradeRequestSelect<ExtArgs> | null;
    omit?: Prisma.MobileUpgradeRequestOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MobileUpgradeRequestCreateInput, Prisma.MobileUpgradeRequestUncheckedCreateInput>;
};
export type MobileUpgradeRequestCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MobileUpgradeRequestCreateManyInput | Prisma.MobileUpgradeRequestCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MobileUpgradeRequestCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileUpgradeRequestSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MobileUpgradeRequestOmit<ExtArgs> | null;
    data: Prisma.MobileUpgradeRequestCreateManyInput | Prisma.MobileUpgradeRequestCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MobileUpgradeRequestUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileUpgradeRequestSelect<ExtArgs> | null;
    omit?: Prisma.MobileUpgradeRequestOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MobileUpgradeRequestUpdateInput, Prisma.MobileUpgradeRequestUncheckedUpdateInput>;
    where: Prisma.MobileUpgradeRequestWhereUniqueInput;
};
export type MobileUpgradeRequestUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MobileUpgradeRequestUpdateManyMutationInput, Prisma.MobileUpgradeRequestUncheckedUpdateManyInput>;
    where?: Prisma.MobileUpgradeRequestWhereInput;
    limit?: number;
};
export type MobileUpgradeRequestUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileUpgradeRequestSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MobileUpgradeRequestOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MobileUpgradeRequestUpdateManyMutationInput, Prisma.MobileUpgradeRequestUncheckedUpdateManyInput>;
    where?: Prisma.MobileUpgradeRequestWhereInput;
    limit?: number;
};
export type MobileUpgradeRequestUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileUpgradeRequestSelect<ExtArgs> | null;
    omit?: Prisma.MobileUpgradeRequestOmit<ExtArgs> | null;
    where: Prisma.MobileUpgradeRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.MobileUpgradeRequestCreateInput, Prisma.MobileUpgradeRequestUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MobileUpgradeRequestUpdateInput, Prisma.MobileUpgradeRequestUncheckedUpdateInput>;
};
export type MobileUpgradeRequestDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileUpgradeRequestSelect<ExtArgs> | null;
    omit?: Prisma.MobileUpgradeRequestOmit<ExtArgs> | null;
    where: Prisma.MobileUpgradeRequestWhereUniqueInput;
};
export type MobileUpgradeRequestDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MobileUpgradeRequestWhereInput;
    limit?: number;
};
export type MobileUpgradeRequestDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileUpgradeRequestSelect<ExtArgs> | null;
    omit?: Prisma.MobileUpgradeRequestOmit<ExtArgs> | null;
};
