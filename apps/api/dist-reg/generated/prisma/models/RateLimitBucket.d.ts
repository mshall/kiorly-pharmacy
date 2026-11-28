import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type RateLimitBucketModel = runtime.Types.Result.DefaultSelection<Prisma.$RateLimitBucketPayload>;
export type AggregateRateLimitBucket = {
    _count: RateLimitBucketCountAggregateOutputType | null;
    _avg: RateLimitBucketAvgAggregateOutputType | null;
    _sum: RateLimitBucketSumAggregateOutputType | null;
    _min: RateLimitBucketMinAggregateOutputType | null;
    _max: RateLimitBucketMaxAggregateOutputType | null;
};
export type RateLimitBucketAvgAggregateOutputType = {
    count: number | null;
};
export type RateLimitBucketSumAggregateOutputType = {
    count: number | null;
};
export type RateLimitBucketMinAggregateOutputType = {
    key: string | null;
    windowStart: Date | null;
    count: number | null;
    expiresAt: Date | null;
};
export type RateLimitBucketMaxAggregateOutputType = {
    key: string | null;
    windowStart: Date | null;
    count: number | null;
    expiresAt: Date | null;
};
export type RateLimitBucketCountAggregateOutputType = {
    key: number;
    windowStart: number;
    count: number;
    expiresAt: number;
    _all: number;
};
export type RateLimitBucketAvgAggregateInputType = {
    count?: true;
};
export type RateLimitBucketSumAggregateInputType = {
    count?: true;
};
export type RateLimitBucketMinAggregateInputType = {
    key?: true;
    windowStart?: true;
    count?: true;
    expiresAt?: true;
};
export type RateLimitBucketMaxAggregateInputType = {
    key?: true;
    windowStart?: true;
    count?: true;
    expiresAt?: true;
};
export type RateLimitBucketCountAggregateInputType = {
    key?: true;
    windowStart?: true;
    count?: true;
    expiresAt?: true;
    _all?: true;
};
export type RateLimitBucketAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RateLimitBucketWhereInput;
    orderBy?: Prisma.RateLimitBucketOrderByWithRelationInput | Prisma.RateLimitBucketOrderByWithRelationInput[];
    cursor?: Prisma.RateLimitBucketWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RateLimitBucketCountAggregateInputType;
    _avg?: RateLimitBucketAvgAggregateInputType;
    _sum?: RateLimitBucketSumAggregateInputType;
    _min?: RateLimitBucketMinAggregateInputType;
    _max?: RateLimitBucketMaxAggregateInputType;
};
export type GetRateLimitBucketAggregateType<T extends RateLimitBucketAggregateArgs> = {
    [P in keyof T & keyof AggregateRateLimitBucket]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRateLimitBucket[P]> : Prisma.GetScalarType<T[P], AggregateRateLimitBucket[P]>;
};
export type RateLimitBucketGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RateLimitBucketWhereInput;
    orderBy?: Prisma.RateLimitBucketOrderByWithAggregationInput | Prisma.RateLimitBucketOrderByWithAggregationInput[];
    by: Prisma.RateLimitBucketScalarFieldEnum[] | Prisma.RateLimitBucketScalarFieldEnum;
    having?: Prisma.RateLimitBucketScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RateLimitBucketCountAggregateInputType | true;
    _avg?: RateLimitBucketAvgAggregateInputType;
    _sum?: RateLimitBucketSumAggregateInputType;
    _min?: RateLimitBucketMinAggregateInputType;
    _max?: RateLimitBucketMaxAggregateInputType;
};
export type RateLimitBucketGroupByOutputType = {
    key: string;
    windowStart: Date;
    count: number;
    expiresAt: Date;
    _count: RateLimitBucketCountAggregateOutputType | null;
    _avg: RateLimitBucketAvgAggregateOutputType | null;
    _sum: RateLimitBucketSumAggregateOutputType | null;
    _min: RateLimitBucketMinAggregateOutputType | null;
    _max: RateLimitBucketMaxAggregateOutputType | null;
};
export type GetRateLimitBucketGroupByPayload<T extends RateLimitBucketGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RateLimitBucketGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RateLimitBucketGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RateLimitBucketGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RateLimitBucketGroupByOutputType[P]>;
}>>;
export type RateLimitBucketWhereInput = {
    AND?: Prisma.RateLimitBucketWhereInput | Prisma.RateLimitBucketWhereInput[];
    OR?: Prisma.RateLimitBucketWhereInput[];
    NOT?: Prisma.RateLimitBucketWhereInput | Prisma.RateLimitBucketWhereInput[];
    key?: Prisma.StringFilter<"RateLimitBucket"> | string;
    windowStart?: Prisma.DateTimeFilter<"RateLimitBucket"> | Date | string;
    count?: Prisma.IntFilter<"RateLimitBucket"> | number;
    expiresAt?: Prisma.DateTimeFilter<"RateLimitBucket"> | Date | string;
};
export type RateLimitBucketOrderByWithRelationInput = {
    key?: Prisma.SortOrder;
    windowStart?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type RateLimitBucketWhereUniqueInput = Prisma.AtLeast<{
    key_windowStart?: Prisma.RateLimitBucketKeyWindowStartCompoundUniqueInput;
    AND?: Prisma.RateLimitBucketWhereInput | Prisma.RateLimitBucketWhereInput[];
    OR?: Prisma.RateLimitBucketWhereInput[];
    NOT?: Prisma.RateLimitBucketWhereInput | Prisma.RateLimitBucketWhereInput[];
    key?: Prisma.StringFilter<"RateLimitBucket"> | string;
    windowStart?: Prisma.DateTimeFilter<"RateLimitBucket"> | Date | string;
    count?: Prisma.IntFilter<"RateLimitBucket"> | number;
    expiresAt?: Prisma.DateTimeFilter<"RateLimitBucket"> | Date | string;
}, "key_windowStart">;
export type RateLimitBucketOrderByWithAggregationInput = {
    key?: Prisma.SortOrder;
    windowStart?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    _count?: Prisma.RateLimitBucketCountOrderByAggregateInput;
    _avg?: Prisma.RateLimitBucketAvgOrderByAggregateInput;
    _max?: Prisma.RateLimitBucketMaxOrderByAggregateInput;
    _min?: Prisma.RateLimitBucketMinOrderByAggregateInput;
    _sum?: Prisma.RateLimitBucketSumOrderByAggregateInput;
};
export type RateLimitBucketScalarWhereWithAggregatesInput = {
    AND?: Prisma.RateLimitBucketScalarWhereWithAggregatesInput | Prisma.RateLimitBucketScalarWhereWithAggregatesInput[];
    OR?: Prisma.RateLimitBucketScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RateLimitBucketScalarWhereWithAggregatesInput | Prisma.RateLimitBucketScalarWhereWithAggregatesInput[];
    key?: Prisma.StringWithAggregatesFilter<"RateLimitBucket"> | string;
    windowStart?: Prisma.DateTimeWithAggregatesFilter<"RateLimitBucket"> | Date | string;
    count?: Prisma.IntWithAggregatesFilter<"RateLimitBucket"> | number;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"RateLimitBucket"> | Date | string;
};
export type RateLimitBucketCreateInput = {
    key: string;
    windowStart: Date | string;
    count: number;
    expiresAt: Date | string;
};
export type RateLimitBucketUncheckedCreateInput = {
    key: string;
    windowStart: Date | string;
    count: number;
    expiresAt: Date | string;
};
export type RateLimitBucketUpdateInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    windowStart?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    count?: Prisma.IntFieldUpdateOperationsInput | number;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RateLimitBucketUncheckedUpdateInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    windowStart?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    count?: Prisma.IntFieldUpdateOperationsInput | number;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RateLimitBucketCreateManyInput = {
    key: string;
    windowStart: Date | string;
    count: number;
    expiresAt: Date | string;
};
export type RateLimitBucketUpdateManyMutationInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    windowStart?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    count?: Prisma.IntFieldUpdateOperationsInput | number;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RateLimitBucketUncheckedUpdateManyInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    windowStart?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    count?: Prisma.IntFieldUpdateOperationsInput | number;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RateLimitBucketKeyWindowStartCompoundUniqueInput = {
    key: string;
    windowStart: Date | string;
};
export type RateLimitBucketCountOrderByAggregateInput = {
    key?: Prisma.SortOrder;
    windowStart?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type RateLimitBucketAvgOrderByAggregateInput = {
    count?: Prisma.SortOrder;
};
export type RateLimitBucketMaxOrderByAggregateInput = {
    key?: Prisma.SortOrder;
    windowStart?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type RateLimitBucketMinOrderByAggregateInput = {
    key?: Prisma.SortOrder;
    windowStart?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type RateLimitBucketSumOrderByAggregateInput = {
    count?: Prisma.SortOrder;
};
export type RateLimitBucketSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    key?: boolean;
    windowStart?: boolean;
    count?: boolean;
    expiresAt?: boolean;
}, ExtArgs["result"]["rateLimitBucket"]>;
export type RateLimitBucketSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    key?: boolean;
    windowStart?: boolean;
    count?: boolean;
    expiresAt?: boolean;
}, ExtArgs["result"]["rateLimitBucket"]>;
export type RateLimitBucketSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    key?: boolean;
    windowStart?: boolean;
    count?: boolean;
    expiresAt?: boolean;
}, ExtArgs["result"]["rateLimitBucket"]>;
export type RateLimitBucketSelectScalar = {
    key?: boolean;
    windowStart?: boolean;
    count?: boolean;
    expiresAt?: boolean;
};
export type RateLimitBucketOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"key" | "windowStart" | "count" | "expiresAt", ExtArgs["result"]["rateLimitBucket"]>;
export type $RateLimitBucketPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RateLimitBucket";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        key: string;
        windowStart: Date;
        count: number;
        expiresAt: Date;
    }, ExtArgs["result"]["rateLimitBucket"]>;
    composites: {};
};
export type RateLimitBucketGetPayload<S extends boolean | null | undefined | RateLimitBucketDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RateLimitBucketPayload, S>;
export type RateLimitBucketCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RateLimitBucketFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RateLimitBucketCountAggregateInputType | true;
};
export interface RateLimitBucketDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RateLimitBucket'];
        meta: {
            name: 'RateLimitBucket';
        };
    };
    findUnique<T extends RateLimitBucketFindUniqueArgs>(args: Prisma.SelectSubset<T, RateLimitBucketFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RateLimitBucketClient<runtime.Types.Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RateLimitBucketFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RateLimitBucketFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RateLimitBucketClient<runtime.Types.Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RateLimitBucketFindFirstArgs>(args?: Prisma.SelectSubset<T, RateLimitBucketFindFirstArgs<ExtArgs>>): Prisma.Prisma__RateLimitBucketClient<runtime.Types.Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RateLimitBucketFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RateLimitBucketFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RateLimitBucketClient<runtime.Types.Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RateLimitBucketFindManyArgs>(args?: Prisma.SelectSubset<T, RateLimitBucketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RateLimitBucketCreateArgs>(args: Prisma.SelectSubset<T, RateLimitBucketCreateArgs<ExtArgs>>): Prisma.Prisma__RateLimitBucketClient<runtime.Types.Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RateLimitBucketCreateManyArgs>(args?: Prisma.SelectSubset<T, RateLimitBucketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RateLimitBucketCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RateLimitBucketCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RateLimitBucketDeleteArgs>(args: Prisma.SelectSubset<T, RateLimitBucketDeleteArgs<ExtArgs>>): Prisma.Prisma__RateLimitBucketClient<runtime.Types.Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RateLimitBucketUpdateArgs>(args: Prisma.SelectSubset<T, RateLimitBucketUpdateArgs<ExtArgs>>): Prisma.Prisma__RateLimitBucketClient<runtime.Types.Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RateLimitBucketDeleteManyArgs>(args?: Prisma.SelectSubset<T, RateLimitBucketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RateLimitBucketUpdateManyArgs>(args: Prisma.SelectSubset<T, RateLimitBucketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RateLimitBucketUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RateLimitBucketUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RateLimitBucketUpsertArgs>(args: Prisma.SelectSubset<T, RateLimitBucketUpsertArgs<ExtArgs>>): Prisma.Prisma__RateLimitBucketClient<runtime.Types.Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RateLimitBucketCountArgs>(args?: Prisma.Subset<T, RateLimitBucketCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RateLimitBucketCountAggregateOutputType> : number>;
    aggregate<T extends RateLimitBucketAggregateArgs>(args: Prisma.Subset<T, RateLimitBucketAggregateArgs>): Prisma.PrismaPromise<GetRateLimitBucketAggregateType<T>>;
    groupBy<T extends RateLimitBucketGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RateLimitBucketGroupByArgs['orderBy'];
    } : {
        orderBy?: RateLimitBucketGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RateLimitBucketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRateLimitBucketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RateLimitBucketFieldRefs;
}
export interface Prisma__RateLimitBucketClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RateLimitBucketFieldRefs {
    readonly key: Prisma.FieldRef<"RateLimitBucket", 'String'>;
    readonly windowStart: Prisma.FieldRef<"RateLimitBucket", 'DateTime'>;
    readonly count: Prisma.FieldRef<"RateLimitBucket", 'Int'>;
    readonly expiresAt: Prisma.FieldRef<"RateLimitBucket", 'DateTime'>;
}
export type RateLimitBucketFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RateLimitBucketSelect<ExtArgs> | null;
    omit?: Prisma.RateLimitBucketOmit<ExtArgs> | null;
    where: Prisma.RateLimitBucketWhereUniqueInput;
};
export type RateLimitBucketFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RateLimitBucketSelect<ExtArgs> | null;
    omit?: Prisma.RateLimitBucketOmit<ExtArgs> | null;
    where: Prisma.RateLimitBucketWhereUniqueInput;
};
export type RateLimitBucketFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RateLimitBucketSelect<ExtArgs> | null;
    omit?: Prisma.RateLimitBucketOmit<ExtArgs> | null;
    where?: Prisma.RateLimitBucketWhereInput;
    orderBy?: Prisma.RateLimitBucketOrderByWithRelationInput | Prisma.RateLimitBucketOrderByWithRelationInput[];
    cursor?: Prisma.RateLimitBucketWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RateLimitBucketScalarFieldEnum | Prisma.RateLimitBucketScalarFieldEnum[];
};
export type RateLimitBucketFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RateLimitBucketSelect<ExtArgs> | null;
    omit?: Prisma.RateLimitBucketOmit<ExtArgs> | null;
    where?: Prisma.RateLimitBucketWhereInput;
    orderBy?: Prisma.RateLimitBucketOrderByWithRelationInput | Prisma.RateLimitBucketOrderByWithRelationInput[];
    cursor?: Prisma.RateLimitBucketWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RateLimitBucketScalarFieldEnum | Prisma.RateLimitBucketScalarFieldEnum[];
};
export type RateLimitBucketFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RateLimitBucketSelect<ExtArgs> | null;
    omit?: Prisma.RateLimitBucketOmit<ExtArgs> | null;
    where?: Prisma.RateLimitBucketWhereInput;
    orderBy?: Prisma.RateLimitBucketOrderByWithRelationInput | Prisma.RateLimitBucketOrderByWithRelationInput[];
    cursor?: Prisma.RateLimitBucketWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RateLimitBucketScalarFieldEnum | Prisma.RateLimitBucketScalarFieldEnum[];
};
export type RateLimitBucketCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RateLimitBucketSelect<ExtArgs> | null;
    omit?: Prisma.RateLimitBucketOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RateLimitBucketCreateInput, Prisma.RateLimitBucketUncheckedCreateInput>;
};
export type RateLimitBucketCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RateLimitBucketCreateManyInput | Prisma.RateLimitBucketCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RateLimitBucketCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RateLimitBucketSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RateLimitBucketOmit<ExtArgs> | null;
    data: Prisma.RateLimitBucketCreateManyInput | Prisma.RateLimitBucketCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RateLimitBucketUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RateLimitBucketSelect<ExtArgs> | null;
    omit?: Prisma.RateLimitBucketOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RateLimitBucketUpdateInput, Prisma.RateLimitBucketUncheckedUpdateInput>;
    where: Prisma.RateLimitBucketWhereUniqueInput;
};
export type RateLimitBucketUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RateLimitBucketUpdateManyMutationInput, Prisma.RateLimitBucketUncheckedUpdateManyInput>;
    where?: Prisma.RateLimitBucketWhereInput;
    limit?: number;
};
export type RateLimitBucketUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RateLimitBucketSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RateLimitBucketOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RateLimitBucketUpdateManyMutationInput, Prisma.RateLimitBucketUncheckedUpdateManyInput>;
    where?: Prisma.RateLimitBucketWhereInput;
    limit?: number;
};
export type RateLimitBucketUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RateLimitBucketSelect<ExtArgs> | null;
    omit?: Prisma.RateLimitBucketOmit<ExtArgs> | null;
    where: Prisma.RateLimitBucketWhereUniqueInput;
    create: Prisma.XOR<Prisma.RateLimitBucketCreateInput, Prisma.RateLimitBucketUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RateLimitBucketUpdateInput, Prisma.RateLimitBucketUncheckedUpdateInput>;
};
export type RateLimitBucketDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RateLimitBucketSelect<ExtArgs> | null;
    omit?: Prisma.RateLimitBucketOmit<ExtArgs> | null;
    where: Prisma.RateLimitBucketWhereUniqueInput;
};
export type RateLimitBucketDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RateLimitBucketWhereInput;
    limit?: number;
};
export type RateLimitBucketDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RateLimitBucketSelect<ExtArgs> | null;
    omit?: Prisma.RateLimitBucketOmit<ExtArgs> | null;
};
