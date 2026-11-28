import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type LogoutTokenSeenModel = runtime.Types.Result.DefaultSelection<Prisma.$LogoutTokenSeenPayload>;
export type AggregateLogoutTokenSeen = {
    _count: LogoutTokenSeenCountAggregateOutputType | null;
    _min: LogoutTokenSeenMinAggregateOutputType | null;
    _max: LogoutTokenSeenMaxAggregateOutputType | null;
};
export type LogoutTokenSeenMinAggregateOutputType = {
    jti: string | null;
    seenAt: Date | null;
    expiresAt: Date | null;
};
export type LogoutTokenSeenMaxAggregateOutputType = {
    jti: string | null;
    seenAt: Date | null;
    expiresAt: Date | null;
};
export type LogoutTokenSeenCountAggregateOutputType = {
    jti: number;
    seenAt: number;
    expiresAt: number;
    _all: number;
};
export type LogoutTokenSeenMinAggregateInputType = {
    jti?: true;
    seenAt?: true;
    expiresAt?: true;
};
export type LogoutTokenSeenMaxAggregateInputType = {
    jti?: true;
    seenAt?: true;
    expiresAt?: true;
};
export type LogoutTokenSeenCountAggregateInputType = {
    jti?: true;
    seenAt?: true;
    expiresAt?: true;
    _all?: true;
};
export type LogoutTokenSeenAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LogoutTokenSeenWhereInput;
    orderBy?: Prisma.LogoutTokenSeenOrderByWithRelationInput | Prisma.LogoutTokenSeenOrderByWithRelationInput[];
    cursor?: Prisma.LogoutTokenSeenWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LogoutTokenSeenCountAggregateInputType;
    _min?: LogoutTokenSeenMinAggregateInputType;
    _max?: LogoutTokenSeenMaxAggregateInputType;
};
export type GetLogoutTokenSeenAggregateType<T extends LogoutTokenSeenAggregateArgs> = {
    [P in keyof T & keyof AggregateLogoutTokenSeen]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLogoutTokenSeen[P]> : Prisma.GetScalarType<T[P], AggregateLogoutTokenSeen[P]>;
};
export type LogoutTokenSeenGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LogoutTokenSeenWhereInput;
    orderBy?: Prisma.LogoutTokenSeenOrderByWithAggregationInput | Prisma.LogoutTokenSeenOrderByWithAggregationInput[];
    by: Prisma.LogoutTokenSeenScalarFieldEnum[] | Prisma.LogoutTokenSeenScalarFieldEnum;
    having?: Prisma.LogoutTokenSeenScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LogoutTokenSeenCountAggregateInputType | true;
    _min?: LogoutTokenSeenMinAggregateInputType;
    _max?: LogoutTokenSeenMaxAggregateInputType;
};
export type LogoutTokenSeenGroupByOutputType = {
    jti: string;
    seenAt: Date;
    expiresAt: Date;
    _count: LogoutTokenSeenCountAggregateOutputType | null;
    _min: LogoutTokenSeenMinAggregateOutputType | null;
    _max: LogoutTokenSeenMaxAggregateOutputType | null;
};
export type GetLogoutTokenSeenGroupByPayload<T extends LogoutTokenSeenGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LogoutTokenSeenGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LogoutTokenSeenGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LogoutTokenSeenGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LogoutTokenSeenGroupByOutputType[P]>;
}>>;
export type LogoutTokenSeenWhereInput = {
    AND?: Prisma.LogoutTokenSeenWhereInput | Prisma.LogoutTokenSeenWhereInput[];
    OR?: Prisma.LogoutTokenSeenWhereInput[];
    NOT?: Prisma.LogoutTokenSeenWhereInput | Prisma.LogoutTokenSeenWhereInput[];
    jti?: Prisma.StringFilter<"LogoutTokenSeen"> | string;
    seenAt?: Prisma.DateTimeFilter<"LogoutTokenSeen"> | Date | string;
    expiresAt?: Prisma.DateTimeFilter<"LogoutTokenSeen"> | Date | string;
};
export type LogoutTokenSeenOrderByWithRelationInput = {
    jti?: Prisma.SortOrder;
    seenAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type LogoutTokenSeenWhereUniqueInput = Prisma.AtLeast<{
    jti?: string;
    AND?: Prisma.LogoutTokenSeenWhereInput | Prisma.LogoutTokenSeenWhereInput[];
    OR?: Prisma.LogoutTokenSeenWhereInput[];
    NOT?: Prisma.LogoutTokenSeenWhereInput | Prisma.LogoutTokenSeenWhereInput[];
    seenAt?: Prisma.DateTimeFilter<"LogoutTokenSeen"> | Date | string;
    expiresAt?: Prisma.DateTimeFilter<"LogoutTokenSeen"> | Date | string;
}, "jti">;
export type LogoutTokenSeenOrderByWithAggregationInput = {
    jti?: Prisma.SortOrder;
    seenAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    _count?: Prisma.LogoutTokenSeenCountOrderByAggregateInput;
    _max?: Prisma.LogoutTokenSeenMaxOrderByAggregateInput;
    _min?: Prisma.LogoutTokenSeenMinOrderByAggregateInput;
};
export type LogoutTokenSeenScalarWhereWithAggregatesInput = {
    AND?: Prisma.LogoutTokenSeenScalarWhereWithAggregatesInput | Prisma.LogoutTokenSeenScalarWhereWithAggregatesInput[];
    OR?: Prisma.LogoutTokenSeenScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LogoutTokenSeenScalarWhereWithAggregatesInput | Prisma.LogoutTokenSeenScalarWhereWithAggregatesInput[];
    jti?: Prisma.StringWithAggregatesFilter<"LogoutTokenSeen"> | string;
    seenAt?: Prisma.DateTimeWithAggregatesFilter<"LogoutTokenSeen"> | Date | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"LogoutTokenSeen"> | Date | string;
};
export type LogoutTokenSeenCreateInput = {
    jti: string;
    seenAt?: Date | string;
    expiresAt: Date | string;
};
export type LogoutTokenSeenUncheckedCreateInput = {
    jti: string;
    seenAt?: Date | string;
    expiresAt: Date | string;
};
export type LogoutTokenSeenUpdateInput = {
    jti?: Prisma.StringFieldUpdateOperationsInput | string;
    seenAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LogoutTokenSeenUncheckedUpdateInput = {
    jti?: Prisma.StringFieldUpdateOperationsInput | string;
    seenAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LogoutTokenSeenCreateManyInput = {
    jti: string;
    seenAt?: Date | string;
    expiresAt: Date | string;
};
export type LogoutTokenSeenUpdateManyMutationInput = {
    jti?: Prisma.StringFieldUpdateOperationsInput | string;
    seenAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LogoutTokenSeenUncheckedUpdateManyInput = {
    jti?: Prisma.StringFieldUpdateOperationsInput | string;
    seenAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LogoutTokenSeenCountOrderByAggregateInput = {
    jti?: Prisma.SortOrder;
    seenAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type LogoutTokenSeenMaxOrderByAggregateInput = {
    jti?: Prisma.SortOrder;
    seenAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type LogoutTokenSeenMinOrderByAggregateInput = {
    jti?: Prisma.SortOrder;
    seenAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type LogoutTokenSeenSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    jti?: boolean;
    seenAt?: boolean;
    expiresAt?: boolean;
}, ExtArgs["result"]["logoutTokenSeen"]>;
export type LogoutTokenSeenSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    jti?: boolean;
    seenAt?: boolean;
    expiresAt?: boolean;
}, ExtArgs["result"]["logoutTokenSeen"]>;
export type LogoutTokenSeenSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    jti?: boolean;
    seenAt?: boolean;
    expiresAt?: boolean;
}, ExtArgs["result"]["logoutTokenSeen"]>;
export type LogoutTokenSeenSelectScalar = {
    jti?: boolean;
    seenAt?: boolean;
    expiresAt?: boolean;
};
export type LogoutTokenSeenOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"jti" | "seenAt" | "expiresAt", ExtArgs["result"]["logoutTokenSeen"]>;
export type $LogoutTokenSeenPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LogoutTokenSeen";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        jti: string;
        seenAt: Date;
        expiresAt: Date;
    }, ExtArgs["result"]["logoutTokenSeen"]>;
    composites: {};
};
export type LogoutTokenSeenGetPayload<S extends boolean | null | undefined | LogoutTokenSeenDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LogoutTokenSeenPayload, S>;
export type LogoutTokenSeenCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LogoutTokenSeenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LogoutTokenSeenCountAggregateInputType | true;
};
export interface LogoutTokenSeenDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LogoutTokenSeen'];
        meta: {
            name: 'LogoutTokenSeen';
        };
    };
    findUnique<T extends LogoutTokenSeenFindUniqueArgs>(args: Prisma.SelectSubset<T, LogoutTokenSeenFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LogoutTokenSeenClient<runtime.Types.Result.GetResult<Prisma.$LogoutTokenSeenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LogoutTokenSeenFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LogoutTokenSeenFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LogoutTokenSeenClient<runtime.Types.Result.GetResult<Prisma.$LogoutTokenSeenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LogoutTokenSeenFindFirstArgs>(args?: Prisma.SelectSubset<T, LogoutTokenSeenFindFirstArgs<ExtArgs>>): Prisma.Prisma__LogoutTokenSeenClient<runtime.Types.Result.GetResult<Prisma.$LogoutTokenSeenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LogoutTokenSeenFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LogoutTokenSeenFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LogoutTokenSeenClient<runtime.Types.Result.GetResult<Prisma.$LogoutTokenSeenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LogoutTokenSeenFindManyArgs>(args?: Prisma.SelectSubset<T, LogoutTokenSeenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LogoutTokenSeenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LogoutTokenSeenCreateArgs>(args: Prisma.SelectSubset<T, LogoutTokenSeenCreateArgs<ExtArgs>>): Prisma.Prisma__LogoutTokenSeenClient<runtime.Types.Result.GetResult<Prisma.$LogoutTokenSeenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LogoutTokenSeenCreateManyArgs>(args?: Prisma.SelectSubset<T, LogoutTokenSeenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LogoutTokenSeenCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LogoutTokenSeenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LogoutTokenSeenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LogoutTokenSeenDeleteArgs>(args: Prisma.SelectSubset<T, LogoutTokenSeenDeleteArgs<ExtArgs>>): Prisma.Prisma__LogoutTokenSeenClient<runtime.Types.Result.GetResult<Prisma.$LogoutTokenSeenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LogoutTokenSeenUpdateArgs>(args: Prisma.SelectSubset<T, LogoutTokenSeenUpdateArgs<ExtArgs>>): Prisma.Prisma__LogoutTokenSeenClient<runtime.Types.Result.GetResult<Prisma.$LogoutTokenSeenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LogoutTokenSeenDeleteManyArgs>(args?: Prisma.SelectSubset<T, LogoutTokenSeenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LogoutTokenSeenUpdateManyArgs>(args: Prisma.SelectSubset<T, LogoutTokenSeenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LogoutTokenSeenUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LogoutTokenSeenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LogoutTokenSeenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LogoutTokenSeenUpsertArgs>(args: Prisma.SelectSubset<T, LogoutTokenSeenUpsertArgs<ExtArgs>>): Prisma.Prisma__LogoutTokenSeenClient<runtime.Types.Result.GetResult<Prisma.$LogoutTokenSeenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LogoutTokenSeenCountArgs>(args?: Prisma.Subset<T, LogoutTokenSeenCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LogoutTokenSeenCountAggregateOutputType> : number>;
    aggregate<T extends LogoutTokenSeenAggregateArgs>(args: Prisma.Subset<T, LogoutTokenSeenAggregateArgs>): Prisma.PrismaPromise<GetLogoutTokenSeenAggregateType<T>>;
    groupBy<T extends LogoutTokenSeenGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LogoutTokenSeenGroupByArgs['orderBy'];
    } : {
        orderBy?: LogoutTokenSeenGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LogoutTokenSeenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLogoutTokenSeenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LogoutTokenSeenFieldRefs;
}
export interface Prisma__LogoutTokenSeenClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LogoutTokenSeenFieldRefs {
    readonly jti: Prisma.FieldRef<"LogoutTokenSeen", 'String'>;
    readonly seenAt: Prisma.FieldRef<"LogoutTokenSeen", 'DateTime'>;
    readonly expiresAt: Prisma.FieldRef<"LogoutTokenSeen", 'DateTime'>;
}
export type LogoutTokenSeenFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LogoutTokenSeenSelect<ExtArgs> | null;
    omit?: Prisma.LogoutTokenSeenOmit<ExtArgs> | null;
    where: Prisma.LogoutTokenSeenWhereUniqueInput;
};
export type LogoutTokenSeenFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LogoutTokenSeenSelect<ExtArgs> | null;
    omit?: Prisma.LogoutTokenSeenOmit<ExtArgs> | null;
    where: Prisma.LogoutTokenSeenWhereUniqueInput;
};
export type LogoutTokenSeenFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LogoutTokenSeenSelect<ExtArgs> | null;
    omit?: Prisma.LogoutTokenSeenOmit<ExtArgs> | null;
    where?: Prisma.LogoutTokenSeenWhereInput;
    orderBy?: Prisma.LogoutTokenSeenOrderByWithRelationInput | Prisma.LogoutTokenSeenOrderByWithRelationInput[];
    cursor?: Prisma.LogoutTokenSeenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LogoutTokenSeenScalarFieldEnum | Prisma.LogoutTokenSeenScalarFieldEnum[];
};
export type LogoutTokenSeenFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LogoutTokenSeenSelect<ExtArgs> | null;
    omit?: Prisma.LogoutTokenSeenOmit<ExtArgs> | null;
    where?: Prisma.LogoutTokenSeenWhereInput;
    orderBy?: Prisma.LogoutTokenSeenOrderByWithRelationInput | Prisma.LogoutTokenSeenOrderByWithRelationInput[];
    cursor?: Prisma.LogoutTokenSeenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LogoutTokenSeenScalarFieldEnum | Prisma.LogoutTokenSeenScalarFieldEnum[];
};
export type LogoutTokenSeenFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LogoutTokenSeenSelect<ExtArgs> | null;
    omit?: Prisma.LogoutTokenSeenOmit<ExtArgs> | null;
    where?: Prisma.LogoutTokenSeenWhereInput;
    orderBy?: Prisma.LogoutTokenSeenOrderByWithRelationInput | Prisma.LogoutTokenSeenOrderByWithRelationInput[];
    cursor?: Prisma.LogoutTokenSeenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LogoutTokenSeenScalarFieldEnum | Prisma.LogoutTokenSeenScalarFieldEnum[];
};
export type LogoutTokenSeenCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LogoutTokenSeenSelect<ExtArgs> | null;
    omit?: Prisma.LogoutTokenSeenOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LogoutTokenSeenCreateInput, Prisma.LogoutTokenSeenUncheckedCreateInput>;
};
export type LogoutTokenSeenCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LogoutTokenSeenCreateManyInput | Prisma.LogoutTokenSeenCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LogoutTokenSeenCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LogoutTokenSeenSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LogoutTokenSeenOmit<ExtArgs> | null;
    data: Prisma.LogoutTokenSeenCreateManyInput | Prisma.LogoutTokenSeenCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LogoutTokenSeenUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LogoutTokenSeenSelect<ExtArgs> | null;
    omit?: Prisma.LogoutTokenSeenOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LogoutTokenSeenUpdateInput, Prisma.LogoutTokenSeenUncheckedUpdateInput>;
    where: Prisma.LogoutTokenSeenWhereUniqueInput;
};
export type LogoutTokenSeenUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LogoutTokenSeenUpdateManyMutationInput, Prisma.LogoutTokenSeenUncheckedUpdateManyInput>;
    where?: Prisma.LogoutTokenSeenWhereInput;
    limit?: number;
};
export type LogoutTokenSeenUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LogoutTokenSeenSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LogoutTokenSeenOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LogoutTokenSeenUpdateManyMutationInput, Prisma.LogoutTokenSeenUncheckedUpdateManyInput>;
    where?: Prisma.LogoutTokenSeenWhereInput;
    limit?: number;
};
export type LogoutTokenSeenUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LogoutTokenSeenSelect<ExtArgs> | null;
    omit?: Prisma.LogoutTokenSeenOmit<ExtArgs> | null;
    where: Prisma.LogoutTokenSeenWhereUniqueInput;
    create: Prisma.XOR<Prisma.LogoutTokenSeenCreateInput, Prisma.LogoutTokenSeenUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LogoutTokenSeenUpdateInput, Prisma.LogoutTokenSeenUncheckedUpdateInput>;
};
export type LogoutTokenSeenDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LogoutTokenSeenSelect<ExtArgs> | null;
    omit?: Prisma.LogoutTokenSeenOmit<ExtArgs> | null;
    where: Prisma.LogoutTokenSeenWhereUniqueInput;
};
export type LogoutTokenSeenDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LogoutTokenSeenWhereInput;
    limit?: number;
};
export type LogoutTokenSeenDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LogoutTokenSeenSelect<ExtArgs> | null;
    omit?: Prisma.LogoutTokenSeenOmit<ExtArgs> | null;
};
