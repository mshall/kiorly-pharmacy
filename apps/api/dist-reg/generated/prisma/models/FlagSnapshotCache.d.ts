import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type FlagSnapshotCacheModel = runtime.Types.Result.DefaultSelection<Prisma.$FlagSnapshotCachePayload>;
export type AggregateFlagSnapshotCache = {
    _count: FlagSnapshotCacheCountAggregateOutputType | null;
    _min: FlagSnapshotCacheMinAggregateOutputType | null;
    _max: FlagSnapshotCacheMaxAggregateOutputType | null;
};
export type FlagSnapshotCacheMinAggregateOutputType = {
    product: string | null;
    version: string | null;
    etag: string | null;
    fetchedAt: Date | null;
};
export type FlagSnapshotCacheMaxAggregateOutputType = {
    product: string | null;
    version: string | null;
    etag: string | null;
    fetchedAt: Date | null;
};
export type FlagSnapshotCacheCountAggregateOutputType = {
    product: number;
    version: number;
    etag: number;
    body: number;
    fetchedAt: number;
    _all: number;
};
export type FlagSnapshotCacheMinAggregateInputType = {
    product?: true;
    version?: true;
    etag?: true;
    fetchedAt?: true;
};
export type FlagSnapshotCacheMaxAggregateInputType = {
    product?: true;
    version?: true;
    etag?: true;
    fetchedAt?: true;
};
export type FlagSnapshotCacheCountAggregateInputType = {
    product?: true;
    version?: true;
    etag?: true;
    body?: true;
    fetchedAt?: true;
    _all?: true;
};
export type FlagSnapshotCacheAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FlagSnapshotCacheWhereInput;
    orderBy?: Prisma.FlagSnapshotCacheOrderByWithRelationInput | Prisma.FlagSnapshotCacheOrderByWithRelationInput[];
    cursor?: Prisma.FlagSnapshotCacheWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | FlagSnapshotCacheCountAggregateInputType;
    _min?: FlagSnapshotCacheMinAggregateInputType;
    _max?: FlagSnapshotCacheMaxAggregateInputType;
};
export type GetFlagSnapshotCacheAggregateType<T extends FlagSnapshotCacheAggregateArgs> = {
    [P in keyof T & keyof AggregateFlagSnapshotCache]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFlagSnapshotCache[P]> : Prisma.GetScalarType<T[P], AggregateFlagSnapshotCache[P]>;
};
export type FlagSnapshotCacheGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FlagSnapshotCacheWhereInput;
    orderBy?: Prisma.FlagSnapshotCacheOrderByWithAggregationInput | Prisma.FlagSnapshotCacheOrderByWithAggregationInput[];
    by: Prisma.FlagSnapshotCacheScalarFieldEnum[] | Prisma.FlagSnapshotCacheScalarFieldEnum;
    having?: Prisma.FlagSnapshotCacheScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FlagSnapshotCacheCountAggregateInputType | true;
    _min?: FlagSnapshotCacheMinAggregateInputType;
    _max?: FlagSnapshotCacheMaxAggregateInputType;
};
export type FlagSnapshotCacheGroupByOutputType = {
    product: string;
    version: string;
    etag: string | null;
    body: runtime.JsonValue;
    fetchedAt: Date;
    _count: FlagSnapshotCacheCountAggregateOutputType | null;
    _min: FlagSnapshotCacheMinAggregateOutputType | null;
    _max: FlagSnapshotCacheMaxAggregateOutputType | null;
};
export type GetFlagSnapshotCacheGroupByPayload<T extends FlagSnapshotCacheGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FlagSnapshotCacheGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FlagSnapshotCacheGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FlagSnapshotCacheGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FlagSnapshotCacheGroupByOutputType[P]>;
}>>;
export type FlagSnapshotCacheWhereInput = {
    AND?: Prisma.FlagSnapshotCacheWhereInput | Prisma.FlagSnapshotCacheWhereInput[];
    OR?: Prisma.FlagSnapshotCacheWhereInput[];
    NOT?: Prisma.FlagSnapshotCacheWhereInput | Prisma.FlagSnapshotCacheWhereInput[];
    product?: Prisma.StringFilter<"FlagSnapshotCache"> | string;
    version?: Prisma.StringFilter<"FlagSnapshotCache"> | string;
    etag?: Prisma.StringNullableFilter<"FlagSnapshotCache"> | string | null;
    body?: Prisma.JsonFilter<"FlagSnapshotCache">;
    fetchedAt?: Prisma.DateTimeFilter<"FlagSnapshotCache"> | Date | string;
};
export type FlagSnapshotCacheOrderByWithRelationInput = {
    product?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    etag?: Prisma.SortOrderInput | Prisma.SortOrder;
    body?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type FlagSnapshotCacheWhereUniqueInput = Prisma.AtLeast<{
    product?: string;
    AND?: Prisma.FlagSnapshotCacheWhereInput | Prisma.FlagSnapshotCacheWhereInput[];
    OR?: Prisma.FlagSnapshotCacheWhereInput[];
    NOT?: Prisma.FlagSnapshotCacheWhereInput | Prisma.FlagSnapshotCacheWhereInput[];
    version?: Prisma.StringFilter<"FlagSnapshotCache"> | string;
    etag?: Prisma.StringNullableFilter<"FlagSnapshotCache"> | string | null;
    body?: Prisma.JsonFilter<"FlagSnapshotCache">;
    fetchedAt?: Prisma.DateTimeFilter<"FlagSnapshotCache"> | Date | string;
}, "product">;
export type FlagSnapshotCacheOrderByWithAggregationInput = {
    product?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    etag?: Prisma.SortOrderInput | Prisma.SortOrder;
    body?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    _count?: Prisma.FlagSnapshotCacheCountOrderByAggregateInput;
    _max?: Prisma.FlagSnapshotCacheMaxOrderByAggregateInput;
    _min?: Prisma.FlagSnapshotCacheMinOrderByAggregateInput;
};
export type FlagSnapshotCacheScalarWhereWithAggregatesInput = {
    AND?: Prisma.FlagSnapshotCacheScalarWhereWithAggregatesInput | Prisma.FlagSnapshotCacheScalarWhereWithAggregatesInput[];
    OR?: Prisma.FlagSnapshotCacheScalarWhereWithAggregatesInput[];
    NOT?: Prisma.FlagSnapshotCacheScalarWhereWithAggregatesInput | Prisma.FlagSnapshotCacheScalarWhereWithAggregatesInput[];
    product?: Prisma.StringWithAggregatesFilter<"FlagSnapshotCache"> | string;
    version?: Prisma.StringWithAggregatesFilter<"FlagSnapshotCache"> | string;
    etag?: Prisma.StringNullableWithAggregatesFilter<"FlagSnapshotCache"> | string | null;
    body?: Prisma.JsonWithAggregatesFilter<"FlagSnapshotCache">;
    fetchedAt?: Prisma.DateTimeWithAggregatesFilter<"FlagSnapshotCache"> | Date | string;
};
export type FlagSnapshotCacheCreateInput = {
    product: string;
    version: string;
    etag?: string | null;
    body: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    fetchedAt?: Date | string;
};
export type FlagSnapshotCacheUncheckedCreateInput = {
    product: string;
    version: string;
    etag?: string | null;
    body: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    fetchedAt?: Date | string;
};
export type FlagSnapshotCacheUpdateInput = {
    product?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.StringFieldUpdateOperationsInput | string;
    etag?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FlagSnapshotCacheUncheckedUpdateInput = {
    product?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.StringFieldUpdateOperationsInput | string;
    etag?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FlagSnapshotCacheCreateManyInput = {
    product: string;
    version: string;
    etag?: string | null;
    body: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    fetchedAt?: Date | string;
};
export type FlagSnapshotCacheUpdateManyMutationInput = {
    product?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.StringFieldUpdateOperationsInput | string;
    etag?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FlagSnapshotCacheUncheckedUpdateManyInput = {
    product?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.StringFieldUpdateOperationsInput | string;
    etag?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    body?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FlagSnapshotCacheCountOrderByAggregateInput = {
    product?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    etag?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type FlagSnapshotCacheMaxOrderByAggregateInput = {
    product?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    etag?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type FlagSnapshotCacheMinOrderByAggregateInput = {
    product?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    etag?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type FlagSnapshotCacheSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    product?: boolean;
    version?: boolean;
    etag?: boolean;
    body?: boolean;
    fetchedAt?: boolean;
}, ExtArgs["result"]["flagSnapshotCache"]>;
export type FlagSnapshotCacheSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    product?: boolean;
    version?: boolean;
    etag?: boolean;
    body?: boolean;
    fetchedAt?: boolean;
}, ExtArgs["result"]["flagSnapshotCache"]>;
export type FlagSnapshotCacheSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    product?: boolean;
    version?: boolean;
    etag?: boolean;
    body?: boolean;
    fetchedAt?: boolean;
}, ExtArgs["result"]["flagSnapshotCache"]>;
export type FlagSnapshotCacheSelectScalar = {
    product?: boolean;
    version?: boolean;
    etag?: boolean;
    body?: boolean;
    fetchedAt?: boolean;
};
export type FlagSnapshotCacheOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"product" | "version" | "etag" | "body" | "fetchedAt", ExtArgs["result"]["flagSnapshotCache"]>;
export type $FlagSnapshotCachePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "FlagSnapshotCache";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        product: string;
        version: string;
        etag: string | null;
        body: runtime.JsonValue;
        fetchedAt: Date;
    }, ExtArgs["result"]["flagSnapshotCache"]>;
    composites: {};
};
export type FlagSnapshotCacheGetPayload<S extends boolean | null | undefined | FlagSnapshotCacheDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$FlagSnapshotCachePayload, S>;
export type FlagSnapshotCacheCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<FlagSnapshotCacheFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FlagSnapshotCacheCountAggregateInputType | true;
};
export interface FlagSnapshotCacheDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['FlagSnapshotCache'];
        meta: {
            name: 'FlagSnapshotCache';
        };
    };
    findUnique<T extends FlagSnapshotCacheFindUniqueArgs>(args: Prisma.SelectSubset<T, FlagSnapshotCacheFindUniqueArgs<ExtArgs>>): Prisma.Prisma__FlagSnapshotCacheClient<runtime.Types.Result.GetResult<Prisma.$FlagSnapshotCachePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends FlagSnapshotCacheFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, FlagSnapshotCacheFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__FlagSnapshotCacheClient<runtime.Types.Result.GetResult<Prisma.$FlagSnapshotCachePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends FlagSnapshotCacheFindFirstArgs>(args?: Prisma.SelectSubset<T, FlagSnapshotCacheFindFirstArgs<ExtArgs>>): Prisma.Prisma__FlagSnapshotCacheClient<runtime.Types.Result.GetResult<Prisma.$FlagSnapshotCachePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends FlagSnapshotCacheFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, FlagSnapshotCacheFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__FlagSnapshotCacheClient<runtime.Types.Result.GetResult<Prisma.$FlagSnapshotCachePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends FlagSnapshotCacheFindManyArgs>(args?: Prisma.SelectSubset<T, FlagSnapshotCacheFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FlagSnapshotCachePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends FlagSnapshotCacheCreateArgs>(args: Prisma.SelectSubset<T, FlagSnapshotCacheCreateArgs<ExtArgs>>): Prisma.Prisma__FlagSnapshotCacheClient<runtime.Types.Result.GetResult<Prisma.$FlagSnapshotCachePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends FlagSnapshotCacheCreateManyArgs>(args?: Prisma.SelectSubset<T, FlagSnapshotCacheCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends FlagSnapshotCacheCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, FlagSnapshotCacheCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FlagSnapshotCachePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends FlagSnapshotCacheDeleteArgs>(args: Prisma.SelectSubset<T, FlagSnapshotCacheDeleteArgs<ExtArgs>>): Prisma.Prisma__FlagSnapshotCacheClient<runtime.Types.Result.GetResult<Prisma.$FlagSnapshotCachePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends FlagSnapshotCacheUpdateArgs>(args: Prisma.SelectSubset<T, FlagSnapshotCacheUpdateArgs<ExtArgs>>): Prisma.Prisma__FlagSnapshotCacheClient<runtime.Types.Result.GetResult<Prisma.$FlagSnapshotCachePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends FlagSnapshotCacheDeleteManyArgs>(args?: Prisma.SelectSubset<T, FlagSnapshotCacheDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends FlagSnapshotCacheUpdateManyArgs>(args: Prisma.SelectSubset<T, FlagSnapshotCacheUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends FlagSnapshotCacheUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, FlagSnapshotCacheUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FlagSnapshotCachePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends FlagSnapshotCacheUpsertArgs>(args: Prisma.SelectSubset<T, FlagSnapshotCacheUpsertArgs<ExtArgs>>): Prisma.Prisma__FlagSnapshotCacheClient<runtime.Types.Result.GetResult<Prisma.$FlagSnapshotCachePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends FlagSnapshotCacheCountArgs>(args?: Prisma.Subset<T, FlagSnapshotCacheCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FlagSnapshotCacheCountAggregateOutputType> : number>;
    aggregate<T extends FlagSnapshotCacheAggregateArgs>(args: Prisma.Subset<T, FlagSnapshotCacheAggregateArgs>): Prisma.PrismaPromise<GetFlagSnapshotCacheAggregateType<T>>;
    groupBy<T extends FlagSnapshotCacheGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: FlagSnapshotCacheGroupByArgs['orderBy'];
    } : {
        orderBy?: FlagSnapshotCacheGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, FlagSnapshotCacheGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFlagSnapshotCacheGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: FlagSnapshotCacheFieldRefs;
}
export interface Prisma__FlagSnapshotCacheClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface FlagSnapshotCacheFieldRefs {
    readonly product: Prisma.FieldRef<"FlagSnapshotCache", 'String'>;
    readonly version: Prisma.FieldRef<"FlagSnapshotCache", 'String'>;
    readonly etag: Prisma.FieldRef<"FlagSnapshotCache", 'String'>;
    readonly body: Prisma.FieldRef<"FlagSnapshotCache", 'Json'>;
    readonly fetchedAt: Prisma.FieldRef<"FlagSnapshotCache", 'DateTime'>;
}
export type FlagSnapshotCacheFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FlagSnapshotCacheSelect<ExtArgs> | null;
    omit?: Prisma.FlagSnapshotCacheOmit<ExtArgs> | null;
    where: Prisma.FlagSnapshotCacheWhereUniqueInput;
};
export type FlagSnapshotCacheFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FlagSnapshotCacheSelect<ExtArgs> | null;
    omit?: Prisma.FlagSnapshotCacheOmit<ExtArgs> | null;
    where: Prisma.FlagSnapshotCacheWhereUniqueInput;
};
export type FlagSnapshotCacheFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FlagSnapshotCacheSelect<ExtArgs> | null;
    omit?: Prisma.FlagSnapshotCacheOmit<ExtArgs> | null;
    where?: Prisma.FlagSnapshotCacheWhereInput;
    orderBy?: Prisma.FlagSnapshotCacheOrderByWithRelationInput | Prisma.FlagSnapshotCacheOrderByWithRelationInput[];
    cursor?: Prisma.FlagSnapshotCacheWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FlagSnapshotCacheScalarFieldEnum | Prisma.FlagSnapshotCacheScalarFieldEnum[];
};
export type FlagSnapshotCacheFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FlagSnapshotCacheSelect<ExtArgs> | null;
    omit?: Prisma.FlagSnapshotCacheOmit<ExtArgs> | null;
    where?: Prisma.FlagSnapshotCacheWhereInput;
    orderBy?: Prisma.FlagSnapshotCacheOrderByWithRelationInput | Prisma.FlagSnapshotCacheOrderByWithRelationInput[];
    cursor?: Prisma.FlagSnapshotCacheWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FlagSnapshotCacheScalarFieldEnum | Prisma.FlagSnapshotCacheScalarFieldEnum[];
};
export type FlagSnapshotCacheFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FlagSnapshotCacheSelect<ExtArgs> | null;
    omit?: Prisma.FlagSnapshotCacheOmit<ExtArgs> | null;
    where?: Prisma.FlagSnapshotCacheWhereInput;
    orderBy?: Prisma.FlagSnapshotCacheOrderByWithRelationInput | Prisma.FlagSnapshotCacheOrderByWithRelationInput[];
    cursor?: Prisma.FlagSnapshotCacheWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FlagSnapshotCacheScalarFieldEnum | Prisma.FlagSnapshotCacheScalarFieldEnum[];
};
export type FlagSnapshotCacheCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FlagSnapshotCacheSelect<ExtArgs> | null;
    omit?: Prisma.FlagSnapshotCacheOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FlagSnapshotCacheCreateInput, Prisma.FlagSnapshotCacheUncheckedCreateInput>;
};
export type FlagSnapshotCacheCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.FlagSnapshotCacheCreateManyInput | Prisma.FlagSnapshotCacheCreateManyInput[];
    skipDuplicates?: boolean;
};
export type FlagSnapshotCacheCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FlagSnapshotCacheSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FlagSnapshotCacheOmit<ExtArgs> | null;
    data: Prisma.FlagSnapshotCacheCreateManyInput | Prisma.FlagSnapshotCacheCreateManyInput[];
    skipDuplicates?: boolean;
};
export type FlagSnapshotCacheUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FlagSnapshotCacheSelect<ExtArgs> | null;
    omit?: Prisma.FlagSnapshotCacheOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FlagSnapshotCacheUpdateInput, Prisma.FlagSnapshotCacheUncheckedUpdateInput>;
    where: Prisma.FlagSnapshotCacheWhereUniqueInput;
};
export type FlagSnapshotCacheUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.FlagSnapshotCacheUpdateManyMutationInput, Prisma.FlagSnapshotCacheUncheckedUpdateManyInput>;
    where?: Prisma.FlagSnapshotCacheWhereInput;
    limit?: number;
};
export type FlagSnapshotCacheUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FlagSnapshotCacheSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FlagSnapshotCacheOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FlagSnapshotCacheUpdateManyMutationInput, Prisma.FlagSnapshotCacheUncheckedUpdateManyInput>;
    where?: Prisma.FlagSnapshotCacheWhereInput;
    limit?: number;
};
export type FlagSnapshotCacheUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FlagSnapshotCacheSelect<ExtArgs> | null;
    omit?: Prisma.FlagSnapshotCacheOmit<ExtArgs> | null;
    where: Prisma.FlagSnapshotCacheWhereUniqueInput;
    create: Prisma.XOR<Prisma.FlagSnapshotCacheCreateInput, Prisma.FlagSnapshotCacheUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.FlagSnapshotCacheUpdateInput, Prisma.FlagSnapshotCacheUncheckedUpdateInput>;
};
export type FlagSnapshotCacheDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FlagSnapshotCacheSelect<ExtArgs> | null;
    omit?: Prisma.FlagSnapshotCacheOmit<ExtArgs> | null;
    where: Prisma.FlagSnapshotCacheWhereUniqueInput;
};
export type FlagSnapshotCacheDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FlagSnapshotCacheWhereInput;
    limit?: number;
};
export type FlagSnapshotCacheDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FlagSnapshotCacheSelect<ExtArgs> | null;
    omit?: Prisma.FlagSnapshotCacheOmit<ExtArgs> | null;
};
