import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type SyncConflictModel = runtime.Types.Result.DefaultSelection<Prisma.$SyncConflictPayload>;
export type AggregateSyncConflict = {
    _count: SyncConflictCountAggregateOutputType | null;
    _min: SyncConflictMinAggregateOutputType | null;
    _max: SyncConflictMaxAggregateOutputType | null;
};
export type SyncConflictMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    idempotencyKey: string | null;
    reason: string | null;
    resolved: boolean | null;
    resolvedBy: string | null;
    createdAt: Date | null;
};
export type SyncConflictMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    idempotencyKey: string | null;
    reason: string | null;
    resolved: boolean | null;
    resolvedBy: string | null;
    createdAt: Date | null;
};
export type SyncConflictCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    idempotencyKey: number;
    reason: number;
    payload: number;
    resolved: number;
    resolvedBy: number;
    createdAt: number;
    _all: number;
};
export type SyncConflictMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    idempotencyKey?: true;
    reason?: true;
    resolved?: true;
    resolvedBy?: true;
    createdAt?: true;
};
export type SyncConflictMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    idempotencyKey?: true;
    reason?: true;
    resolved?: true;
    resolvedBy?: true;
    createdAt?: true;
};
export type SyncConflictCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    idempotencyKey?: true;
    reason?: true;
    payload?: true;
    resolved?: true;
    resolvedBy?: true;
    createdAt?: true;
    _all?: true;
};
export type SyncConflictAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SyncConflictWhereInput;
    orderBy?: Prisma.SyncConflictOrderByWithRelationInput | Prisma.SyncConflictOrderByWithRelationInput[];
    cursor?: Prisma.SyncConflictWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SyncConflictCountAggregateInputType;
    _min?: SyncConflictMinAggregateInputType;
    _max?: SyncConflictMaxAggregateInputType;
};
export type GetSyncConflictAggregateType<T extends SyncConflictAggregateArgs> = {
    [P in keyof T & keyof AggregateSyncConflict]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSyncConflict[P]> : Prisma.GetScalarType<T[P], AggregateSyncConflict[P]>;
};
export type SyncConflictGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SyncConflictWhereInput;
    orderBy?: Prisma.SyncConflictOrderByWithAggregationInput | Prisma.SyncConflictOrderByWithAggregationInput[];
    by: Prisma.SyncConflictScalarFieldEnum[] | Prisma.SyncConflictScalarFieldEnum;
    having?: Prisma.SyncConflictScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SyncConflictCountAggregateInputType | true;
    _min?: SyncConflictMinAggregateInputType;
    _max?: SyncConflictMaxAggregateInputType;
};
export type SyncConflictGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    idempotencyKey: string;
    reason: string;
    payload: runtime.JsonValue;
    resolved: boolean;
    resolvedBy: string | null;
    createdAt: Date;
    _count: SyncConflictCountAggregateOutputType | null;
    _min: SyncConflictMinAggregateOutputType | null;
    _max: SyncConflictMaxAggregateOutputType | null;
};
export type GetSyncConflictGroupByPayload<T extends SyncConflictGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SyncConflictGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SyncConflictGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SyncConflictGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SyncConflictGroupByOutputType[P]>;
}>>;
export type SyncConflictWhereInput = {
    AND?: Prisma.SyncConflictWhereInput | Prisma.SyncConflictWhereInput[];
    OR?: Prisma.SyncConflictWhereInput[];
    NOT?: Prisma.SyncConflictWhereInput | Prisma.SyncConflictWhereInput[];
    id?: Prisma.StringFilter<"SyncConflict"> | string;
    orgId?: Prisma.StringFilter<"SyncConflict"> | string;
    branchId?: Prisma.StringFilter<"SyncConflict"> | string;
    idempotencyKey?: Prisma.StringFilter<"SyncConflict"> | string;
    reason?: Prisma.StringFilter<"SyncConflict"> | string;
    payload?: Prisma.JsonFilter<"SyncConflict">;
    resolved?: Prisma.BoolFilter<"SyncConflict"> | boolean;
    resolvedBy?: Prisma.StringNullableFilter<"SyncConflict"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"SyncConflict"> | Date | string;
};
export type SyncConflictOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    resolved?: Prisma.SortOrder;
    resolvedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SyncConflictWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId_idempotencyKey?: Prisma.SyncConflictOrgIdIdempotencyKeyCompoundUniqueInput;
    AND?: Prisma.SyncConflictWhereInput | Prisma.SyncConflictWhereInput[];
    OR?: Prisma.SyncConflictWhereInput[];
    NOT?: Prisma.SyncConflictWhereInput | Prisma.SyncConflictWhereInput[];
    orgId?: Prisma.StringFilter<"SyncConflict"> | string;
    branchId?: Prisma.StringFilter<"SyncConflict"> | string;
    idempotencyKey?: Prisma.StringFilter<"SyncConflict"> | string;
    reason?: Prisma.StringFilter<"SyncConflict"> | string;
    payload?: Prisma.JsonFilter<"SyncConflict">;
    resolved?: Prisma.BoolFilter<"SyncConflict"> | boolean;
    resolvedBy?: Prisma.StringNullableFilter<"SyncConflict"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"SyncConflict"> | Date | string;
}, "id" | "orgId_idempotencyKey">;
export type SyncConflictOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    resolved?: Prisma.SortOrder;
    resolvedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.SyncConflictCountOrderByAggregateInput;
    _max?: Prisma.SyncConflictMaxOrderByAggregateInput;
    _min?: Prisma.SyncConflictMinOrderByAggregateInput;
};
export type SyncConflictScalarWhereWithAggregatesInput = {
    AND?: Prisma.SyncConflictScalarWhereWithAggregatesInput | Prisma.SyncConflictScalarWhereWithAggregatesInput[];
    OR?: Prisma.SyncConflictScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SyncConflictScalarWhereWithAggregatesInput | Prisma.SyncConflictScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SyncConflict"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"SyncConflict"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"SyncConflict"> | string;
    idempotencyKey?: Prisma.StringWithAggregatesFilter<"SyncConflict"> | string;
    reason?: Prisma.StringWithAggregatesFilter<"SyncConflict"> | string;
    payload?: Prisma.JsonWithAggregatesFilter<"SyncConflict">;
    resolved?: Prisma.BoolWithAggregatesFilter<"SyncConflict"> | boolean;
    resolvedBy?: Prisma.StringNullableWithAggregatesFilter<"SyncConflict"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SyncConflict"> | Date | string;
};
export type SyncConflictCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    idempotencyKey: string;
    reason: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    resolved?: boolean;
    resolvedBy?: string | null;
    createdAt?: Date | string;
};
export type SyncConflictUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    idempotencyKey: string;
    reason: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    resolved?: boolean;
    resolvedBy?: string | null;
    createdAt?: Date | string;
};
export type SyncConflictUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    idempotencyKey?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    resolvedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SyncConflictUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    idempotencyKey?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    resolvedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SyncConflictCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    idempotencyKey: string;
    reason: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    resolved?: boolean;
    resolvedBy?: string | null;
    createdAt?: Date | string;
};
export type SyncConflictUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    idempotencyKey?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    resolvedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SyncConflictUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    idempotencyKey?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    resolvedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SyncConflictOrgIdIdempotencyKeyCompoundUniqueInput = {
    orgId: string;
    idempotencyKey: string;
};
export type SyncConflictCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    resolved?: Prisma.SortOrder;
    resolvedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SyncConflictMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    resolved?: Prisma.SortOrder;
    resolvedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SyncConflictMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    resolved?: Prisma.SortOrder;
    resolvedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SyncConflictSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    idempotencyKey?: boolean;
    reason?: boolean;
    payload?: boolean;
    resolved?: boolean;
    resolvedBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["syncConflict"]>;
export type SyncConflictSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    idempotencyKey?: boolean;
    reason?: boolean;
    payload?: boolean;
    resolved?: boolean;
    resolvedBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["syncConflict"]>;
export type SyncConflictSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    idempotencyKey?: boolean;
    reason?: boolean;
    payload?: boolean;
    resolved?: boolean;
    resolvedBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["syncConflict"]>;
export type SyncConflictSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    idempotencyKey?: boolean;
    reason?: boolean;
    payload?: boolean;
    resolved?: boolean;
    resolvedBy?: boolean;
    createdAt?: boolean;
};
export type SyncConflictOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "idempotencyKey" | "reason" | "payload" | "resolved" | "resolvedBy" | "createdAt", ExtArgs["result"]["syncConflict"]>;
export type $SyncConflictPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SyncConflict";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        idempotencyKey: string;
        reason: string;
        payload: runtime.JsonValue;
        resolved: boolean;
        resolvedBy: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["syncConflict"]>;
    composites: {};
};
export type SyncConflictGetPayload<S extends boolean | null | undefined | SyncConflictDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SyncConflictPayload, S>;
export type SyncConflictCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SyncConflictFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SyncConflictCountAggregateInputType | true;
};
export interface SyncConflictDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SyncConflict'];
        meta: {
            name: 'SyncConflict';
        };
    };
    findUnique<T extends SyncConflictFindUniqueArgs>(args: Prisma.SelectSubset<T, SyncConflictFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SyncConflictClient<runtime.Types.Result.GetResult<Prisma.$SyncConflictPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SyncConflictFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SyncConflictFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SyncConflictClient<runtime.Types.Result.GetResult<Prisma.$SyncConflictPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SyncConflictFindFirstArgs>(args?: Prisma.SelectSubset<T, SyncConflictFindFirstArgs<ExtArgs>>): Prisma.Prisma__SyncConflictClient<runtime.Types.Result.GetResult<Prisma.$SyncConflictPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SyncConflictFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SyncConflictFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SyncConflictClient<runtime.Types.Result.GetResult<Prisma.$SyncConflictPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SyncConflictFindManyArgs>(args?: Prisma.SelectSubset<T, SyncConflictFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SyncConflictPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SyncConflictCreateArgs>(args: Prisma.SelectSubset<T, SyncConflictCreateArgs<ExtArgs>>): Prisma.Prisma__SyncConflictClient<runtime.Types.Result.GetResult<Prisma.$SyncConflictPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SyncConflictCreateManyArgs>(args?: Prisma.SelectSubset<T, SyncConflictCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SyncConflictCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SyncConflictCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SyncConflictPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SyncConflictDeleteArgs>(args: Prisma.SelectSubset<T, SyncConflictDeleteArgs<ExtArgs>>): Prisma.Prisma__SyncConflictClient<runtime.Types.Result.GetResult<Prisma.$SyncConflictPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SyncConflictUpdateArgs>(args: Prisma.SelectSubset<T, SyncConflictUpdateArgs<ExtArgs>>): Prisma.Prisma__SyncConflictClient<runtime.Types.Result.GetResult<Prisma.$SyncConflictPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SyncConflictDeleteManyArgs>(args?: Prisma.SelectSubset<T, SyncConflictDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SyncConflictUpdateManyArgs>(args: Prisma.SelectSubset<T, SyncConflictUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SyncConflictUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SyncConflictUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SyncConflictPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SyncConflictUpsertArgs>(args: Prisma.SelectSubset<T, SyncConflictUpsertArgs<ExtArgs>>): Prisma.Prisma__SyncConflictClient<runtime.Types.Result.GetResult<Prisma.$SyncConflictPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SyncConflictCountArgs>(args?: Prisma.Subset<T, SyncConflictCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SyncConflictCountAggregateOutputType> : number>;
    aggregate<T extends SyncConflictAggregateArgs>(args: Prisma.Subset<T, SyncConflictAggregateArgs>): Prisma.PrismaPromise<GetSyncConflictAggregateType<T>>;
    groupBy<T extends SyncConflictGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SyncConflictGroupByArgs['orderBy'];
    } : {
        orderBy?: SyncConflictGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SyncConflictGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSyncConflictGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SyncConflictFieldRefs;
}
export interface Prisma__SyncConflictClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SyncConflictFieldRefs {
    readonly id: Prisma.FieldRef<"SyncConflict", 'String'>;
    readonly orgId: Prisma.FieldRef<"SyncConflict", 'String'>;
    readonly branchId: Prisma.FieldRef<"SyncConflict", 'String'>;
    readonly idempotencyKey: Prisma.FieldRef<"SyncConflict", 'String'>;
    readonly reason: Prisma.FieldRef<"SyncConflict", 'String'>;
    readonly payload: Prisma.FieldRef<"SyncConflict", 'Json'>;
    readonly resolved: Prisma.FieldRef<"SyncConflict", 'Boolean'>;
    readonly resolvedBy: Prisma.FieldRef<"SyncConflict", 'String'>;
    readonly createdAt: Prisma.FieldRef<"SyncConflict", 'DateTime'>;
}
export type SyncConflictFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SyncConflictSelect<ExtArgs> | null;
    omit?: Prisma.SyncConflictOmit<ExtArgs> | null;
    where: Prisma.SyncConflictWhereUniqueInput;
};
export type SyncConflictFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SyncConflictSelect<ExtArgs> | null;
    omit?: Prisma.SyncConflictOmit<ExtArgs> | null;
    where: Prisma.SyncConflictWhereUniqueInput;
};
export type SyncConflictFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SyncConflictSelect<ExtArgs> | null;
    omit?: Prisma.SyncConflictOmit<ExtArgs> | null;
    where?: Prisma.SyncConflictWhereInput;
    orderBy?: Prisma.SyncConflictOrderByWithRelationInput | Prisma.SyncConflictOrderByWithRelationInput[];
    cursor?: Prisma.SyncConflictWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SyncConflictScalarFieldEnum | Prisma.SyncConflictScalarFieldEnum[];
};
export type SyncConflictFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SyncConflictSelect<ExtArgs> | null;
    omit?: Prisma.SyncConflictOmit<ExtArgs> | null;
    where?: Prisma.SyncConflictWhereInput;
    orderBy?: Prisma.SyncConflictOrderByWithRelationInput | Prisma.SyncConflictOrderByWithRelationInput[];
    cursor?: Prisma.SyncConflictWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SyncConflictScalarFieldEnum | Prisma.SyncConflictScalarFieldEnum[];
};
export type SyncConflictFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SyncConflictSelect<ExtArgs> | null;
    omit?: Prisma.SyncConflictOmit<ExtArgs> | null;
    where?: Prisma.SyncConflictWhereInput;
    orderBy?: Prisma.SyncConflictOrderByWithRelationInput | Prisma.SyncConflictOrderByWithRelationInput[];
    cursor?: Prisma.SyncConflictWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SyncConflictScalarFieldEnum | Prisma.SyncConflictScalarFieldEnum[];
};
export type SyncConflictCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SyncConflictSelect<ExtArgs> | null;
    omit?: Prisma.SyncConflictOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SyncConflictCreateInput, Prisma.SyncConflictUncheckedCreateInput>;
};
export type SyncConflictCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SyncConflictCreateManyInput | Prisma.SyncConflictCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SyncConflictCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SyncConflictSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SyncConflictOmit<ExtArgs> | null;
    data: Prisma.SyncConflictCreateManyInput | Prisma.SyncConflictCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SyncConflictUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SyncConflictSelect<ExtArgs> | null;
    omit?: Prisma.SyncConflictOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SyncConflictUpdateInput, Prisma.SyncConflictUncheckedUpdateInput>;
    where: Prisma.SyncConflictWhereUniqueInput;
};
export type SyncConflictUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SyncConflictUpdateManyMutationInput, Prisma.SyncConflictUncheckedUpdateManyInput>;
    where?: Prisma.SyncConflictWhereInput;
    limit?: number;
};
export type SyncConflictUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SyncConflictSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SyncConflictOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SyncConflictUpdateManyMutationInput, Prisma.SyncConflictUncheckedUpdateManyInput>;
    where?: Prisma.SyncConflictWhereInput;
    limit?: number;
};
export type SyncConflictUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SyncConflictSelect<ExtArgs> | null;
    omit?: Prisma.SyncConflictOmit<ExtArgs> | null;
    where: Prisma.SyncConflictWhereUniqueInput;
    create: Prisma.XOR<Prisma.SyncConflictCreateInput, Prisma.SyncConflictUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SyncConflictUpdateInput, Prisma.SyncConflictUncheckedUpdateInput>;
};
export type SyncConflictDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SyncConflictSelect<ExtArgs> | null;
    omit?: Prisma.SyncConflictOmit<ExtArgs> | null;
    where: Prisma.SyncConflictWhereUniqueInput;
};
export type SyncConflictDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SyncConflictWhereInput;
    limit?: number;
};
export type SyncConflictDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SyncConflictSelect<ExtArgs> | null;
    omit?: Prisma.SyncConflictOmit<ExtArgs> | null;
};
