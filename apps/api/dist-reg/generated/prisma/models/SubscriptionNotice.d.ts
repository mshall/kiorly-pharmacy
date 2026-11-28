import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type SubscriptionNoticeModel = runtime.Types.Result.DefaultSelection<Prisma.$SubscriptionNoticePayload>;
export type AggregateSubscriptionNotice = {
    _count: SubscriptionNoticeCountAggregateOutputType | null;
    _min: SubscriptionNoticeMinAggregateOutputType | null;
    _max: SubscriptionNoticeMaxAggregateOutputType | null;
};
export type SubscriptionNoticeMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    kind: string | null;
    notBefore: Date | null;
    sentAt: Date | null;
    dedupeKey: string | null;
    createdAt: Date | null;
};
export type SubscriptionNoticeMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    kind: string | null;
    notBefore: Date | null;
    sentAt: Date | null;
    dedupeKey: string | null;
    createdAt: Date | null;
};
export type SubscriptionNoticeCountAggregateOutputType = {
    id: number;
    orgId: number;
    kind: number;
    payload: number;
    notBefore: number;
    sentAt: number;
    dedupeKey: number;
    createdAt: number;
    _all: number;
};
export type SubscriptionNoticeMinAggregateInputType = {
    id?: true;
    orgId?: true;
    kind?: true;
    notBefore?: true;
    sentAt?: true;
    dedupeKey?: true;
    createdAt?: true;
};
export type SubscriptionNoticeMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    kind?: true;
    notBefore?: true;
    sentAt?: true;
    dedupeKey?: true;
    createdAt?: true;
};
export type SubscriptionNoticeCountAggregateInputType = {
    id?: true;
    orgId?: true;
    kind?: true;
    payload?: true;
    notBefore?: true;
    sentAt?: true;
    dedupeKey?: true;
    createdAt?: true;
    _all?: true;
};
export type SubscriptionNoticeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionNoticeWhereInput;
    orderBy?: Prisma.SubscriptionNoticeOrderByWithRelationInput | Prisma.SubscriptionNoticeOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionNoticeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SubscriptionNoticeCountAggregateInputType;
    _min?: SubscriptionNoticeMinAggregateInputType;
    _max?: SubscriptionNoticeMaxAggregateInputType;
};
export type GetSubscriptionNoticeAggregateType<T extends SubscriptionNoticeAggregateArgs> = {
    [P in keyof T & keyof AggregateSubscriptionNotice]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSubscriptionNotice[P]> : Prisma.GetScalarType<T[P], AggregateSubscriptionNotice[P]>;
};
export type SubscriptionNoticeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionNoticeWhereInput;
    orderBy?: Prisma.SubscriptionNoticeOrderByWithAggregationInput | Prisma.SubscriptionNoticeOrderByWithAggregationInput[];
    by: Prisma.SubscriptionNoticeScalarFieldEnum[] | Prisma.SubscriptionNoticeScalarFieldEnum;
    having?: Prisma.SubscriptionNoticeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SubscriptionNoticeCountAggregateInputType | true;
    _min?: SubscriptionNoticeMinAggregateInputType;
    _max?: SubscriptionNoticeMaxAggregateInputType;
};
export type SubscriptionNoticeGroupByOutputType = {
    id: string;
    orgId: string;
    kind: string;
    payload: runtime.JsonValue;
    notBefore: Date;
    sentAt: Date | null;
    dedupeKey: string;
    createdAt: Date;
    _count: SubscriptionNoticeCountAggregateOutputType | null;
    _min: SubscriptionNoticeMinAggregateOutputType | null;
    _max: SubscriptionNoticeMaxAggregateOutputType | null;
};
export type GetSubscriptionNoticeGroupByPayload<T extends SubscriptionNoticeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SubscriptionNoticeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SubscriptionNoticeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SubscriptionNoticeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SubscriptionNoticeGroupByOutputType[P]>;
}>>;
export type SubscriptionNoticeWhereInput = {
    AND?: Prisma.SubscriptionNoticeWhereInput | Prisma.SubscriptionNoticeWhereInput[];
    OR?: Prisma.SubscriptionNoticeWhereInput[];
    NOT?: Prisma.SubscriptionNoticeWhereInput | Prisma.SubscriptionNoticeWhereInput[];
    id?: Prisma.StringFilter<"SubscriptionNotice"> | string;
    orgId?: Prisma.StringFilter<"SubscriptionNotice"> | string;
    kind?: Prisma.StringFilter<"SubscriptionNotice"> | string;
    payload?: Prisma.JsonFilter<"SubscriptionNotice">;
    notBefore?: Prisma.DateTimeFilter<"SubscriptionNotice"> | Date | string;
    sentAt?: Prisma.DateTimeNullableFilter<"SubscriptionNotice"> | Date | string | null;
    dedupeKey?: Prisma.StringFilter<"SubscriptionNotice"> | string;
    createdAt?: Prisma.DateTimeFilter<"SubscriptionNotice"> | Date | string;
};
export type SubscriptionNoticeOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    notBefore?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    dedupeKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SubscriptionNoticeWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId_dedupeKey?: Prisma.SubscriptionNoticeOrgIdDedupeKeyCompoundUniqueInput;
    AND?: Prisma.SubscriptionNoticeWhereInput | Prisma.SubscriptionNoticeWhereInput[];
    OR?: Prisma.SubscriptionNoticeWhereInput[];
    NOT?: Prisma.SubscriptionNoticeWhereInput | Prisma.SubscriptionNoticeWhereInput[];
    orgId?: Prisma.StringFilter<"SubscriptionNotice"> | string;
    kind?: Prisma.StringFilter<"SubscriptionNotice"> | string;
    payload?: Prisma.JsonFilter<"SubscriptionNotice">;
    notBefore?: Prisma.DateTimeFilter<"SubscriptionNotice"> | Date | string;
    sentAt?: Prisma.DateTimeNullableFilter<"SubscriptionNotice"> | Date | string | null;
    dedupeKey?: Prisma.StringFilter<"SubscriptionNotice"> | string;
    createdAt?: Prisma.DateTimeFilter<"SubscriptionNotice"> | Date | string;
}, "id" | "orgId_dedupeKey">;
export type SubscriptionNoticeOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    notBefore?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    dedupeKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.SubscriptionNoticeCountOrderByAggregateInput;
    _max?: Prisma.SubscriptionNoticeMaxOrderByAggregateInput;
    _min?: Prisma.SubscriptionNoticeMinOrderByAggregateInput;
};
export type SubscriptionNoticeScalarWhereWithAggregatesInput = {
    AND?: Prisma.SubscriptionNoticeScalarWhereWithAggregatesInput | Prisma.SubscriptionNoticeScalarWhereWithAggregatesInput[];
    OR?: Prisma.SubscriptionNoticeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SubscriptionNoticeScalarWhereWithAggregatesInput | Prisma.SubscriptionNoticeScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SubscriptionNotice"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"SubscriptionNotice"> | string;
    kind?: Prisma.StringWithAggregatesFilter<"SubscriptionNotice"> | string;
    payload?: Prisma.JsonWithAggregatesFilter<"SubscriptionNotice">;
    notBefore?: Prisma.DateTimeWithAggregatesFilter<"SubscriptionNotice"> | Date | string;
    sentAt?: Prisma.DateTimeNullableWithAggregatesFilter<"SubscriptionNotice"> | Date | string | null;
    dedupeKey?: Prisma.StringWithAggregatesFilter<"SubscriptionNotice"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SubscriptionNotice"> | Date | string;
};
export type SubscriptionNoticeCreateInput = {
    id?: string;
    orgId: string;
    kind: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    notBefore?: Date | string;
    sentAt?: Date | string | null;
    dedupeKey: string;
    createdAt?: Date | string;
};
export type SubscriptionNoticeUncheckedCreateInput = {
    id?: string;
    orgId: string;
    kind: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    notBefore?: Date | string;
    sentAt?: Date | string | null;
    dedupeKey: string;
    createdAt?: Date | string;
};
export type SubscriptionNoticeUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    notBefore?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    dedupeKey?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionNoticeUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    notBefore?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    dedupeKey?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionNoticeCreateManyInput = {
    id?: string;
    orgId: string;
    kind: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    notBefore?: Date | string;
    sentAt?: Date | string | null;
    dedupeKey: string;
    createdAt?: Date | string;
};
export type SubscriptionNoticeUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    notBefore?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    dedupeKey?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionNoticeUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    notBefore?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    dedupeKey?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionNoticeOrgIdDedupeKeyCompoundUniqueInput = {
    orgId: string;
    dedupeKey: string;
};
export type SubscriptionNoticeCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    notBefore?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
    dedupeKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SubscriptionNoticeMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    notBefore?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
    dedupeKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SubscriptionNoticeMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    notBefore?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
    dedupeKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SubscriptionNoticeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    kind?: boolean;
    payload?: boolean;
    notBefore?: boolean;
    sentAt?: boolean;
    dedupeKey?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["subscriptionNotice"]>;
export type SubscriptionNoticeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    kind?: boolean;
    payload?: boolean;
    notBefore?: boolean;
    sentAt?: boolean;
    dedupeKey?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["subscriptionNotice"]>;
export type SubscriptionNoticeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    kind?: boolean;
    payload?: boolean;
    notBefore?: boolean;
    sentAt?: boolean;
    dedupeKey?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["subscriptionNotice"]>;
export type SubscriptionNoticeSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    kind?: boolean;
    payload?: boolean;
    notBefore?: boolean;
    sentAt?: boolean;
    dedupeKey?: boolean;
    createdAt?: boolean;
};
export type SubscriptionNoticeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "kind" | "payload" | "notBefore" | "sentAt" | "dedupeKey" | "createdAt", ExtArgs["result"]["subscriptionNotice"]>;
export type $SubscriptionNoticePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SubscriptionNotice";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        kind: string;
        payload: runtime.JsonValue;
        notBefore: Date;
        sentAt: Date | null;
        dedupeKey: string;
        createdAt: Date;
    }, ExtArgs["result"]["subscriptionNotice"]>;
    composites: {};
};
export type SubscriptionNoticeGetPayload<S extends boolean | null | undefined | SubscriptionNoticeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SubscriptionNoticePayload, S>;
export type SubscriptionNoticeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SubscriptionNoticeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SubscriptionNoticeCountAggregateInputType | true;
};
export interface SubscriptionNoticeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SubscriptionNotice'];
        meta: {
            name: 'SubscriptionNotice';
        };
    };
    findUnique<T extends SubscriptionNoticeFindUniqueArgs>(args: Prisma.SelectSubset<T, SubscriptionNoticeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SubscriptionNoticeClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionNoticePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SubscriptionNoticeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SubscriptionNoticeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubscriptionNoticeClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionNoticePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SubscriptionNoticeFindFirstArgs>(args?: Prisma.SelectSubset<T, SubscriptionNoticeFindFirstArgs<ExtArgs>>): Prisma.Prisma__SubscriptionNoticeClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionNoticePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SubscriptionNoticeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SubscriptionNoticeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubscriptionNoticeClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionNoticePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SubscriptionNoticeFindManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionNoticeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionNoticePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SubscriptionNoticeCreateArgs>(args: Prisma.SelectSubset<T, SubscriptionNoticeCreateArgs<ExtArgs>>): Prisma.Prisma__SubscriptionNoticeClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionNoticePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SubscriptionNoticeCreateManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionNoticeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SubscriptionNoticeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SubscriptionNoticeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionNoticePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SubscriptionNoticeDeleteArgs>(args: Prisma.SelectSubset<T, SubscriptionNoticeDeleteArgs<ExtArgs>>): Prisma.Prisma__SubscriptionNoticeClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionNoticePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SubscriptionNoticeUpdateArgs>(args: Prisma.SelectSubset<T, SubscriptionNoticeUpdateArgs<ExtArgs>>): Prisma.Prisma__SubscriptionNoticeClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionNoticePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SubscriptionNoticeDeleteManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionNoticeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SubscriptionNoticeUpdateManyArgs>(args: Prisma.SelectSubset<T, SubscriptionNoticeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SubscriptionNoticeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SubscriptionNoticeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionNoticePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SubscriptionNoticeUpsertArgs>(args: Prisma.SelectSubset<T, SubscriptionNoticeUpsertArgs<ExtArgs>>): Prisma.Prisma__SubscriptionNoticeClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionNoticePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SubscriptionNoticeCountArgs>(args?: Prisma.Subset<T, SubscriptionNoticeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SubscriptionNoticeCountAggregateOutputType> : number>;
    aggregate<T extends SubscriptionNoticeAggregateArgs>(args: Prisma.Subset<T, SubscriptionNoticeAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionNoticeAggregateType<T>>;
    groupBy<T extends SubscriptionNoticeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SubscriptionNoticeGroupByArgs['orderBy'];
    } : {
        orderBy?: SubscriptionNoticeGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SubscriptionNoticeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionNoticeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SubscriptionNoticeFieldRefs;
}
export interface Prisma__SubscriptionNoticeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SubscriptionNoticeFieldRefs {
    readonly id: Prisma.FieldRef<"SubscriptionNotice", 'String'>;
    readonly orgId: Prisma.FieldRef<"SubscriptionNotice", 'String'>;
    readonly kind: Prisma.FieldRef<"SubscriptionNotice", 'String'>;
    readonly payload: Prisma.FieldRef<"SubscriptionNotice", 'Json'>;
    readonly notBefore: Prisma.FieldRef<"SubscriptionNotice", 'DateTime'>;
    readonly sentAt: Prisma.FieldRef<"SubscriptionNotice", 'DateTime'>;
    readonly dedupeKey: Prisma.FieldRef<"SubscriptionNotice", 'String'>;
    readonly createdAt: Prisma.FieldRef<"SubscriptionNotice", 'DateTime'>;
}
export type SubscriptionNoticeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionNoticeSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionNoticeOmit<ExtArgs> | null;
    where: Prisma.SubscriptionNoticeWhereUniqueInput;
};
export type SubscriptionNoticeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionNoticeSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionNoticeOmit<ExtArgs> | null;
    where: Prisma.SubscriptionNoticeWhereUniqueInput;
};
export type SubscriptionNoticeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionNoticeSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionNoticeOmit<ExtArgs> | null;
    where?: Prisma.SubscriptionNoticeWhereInput;
    orderBy?: Prisma.SubscriptionNoticeOrderByWithRelationInput | Prisma.SubscriptionNoticeOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionNoticeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubscriptionNoticeScalarFieldEnum | Prisma.SubscriptionNoticeScalarFieldEnum[];
};
export type SubscriptionNoticeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionNoticeSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionNoticeOmit<ExtArgs> | null;
    where?: Prisma.SubscriptionNoticeWhereInput;
    orderBy?: Prisma.SubscriptionNoticeOrderByWithRelationInput | Prisma.SubscriptionNoticeOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionNoticeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubscriptionNoticeScalarFieldEnum | Prisma.SubscriptionNoticeScalarFieldEnum[];
};
export type SubscriptionNoticeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionNoticeSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionNoticeOmit<ExtArgs> | null;
    where?: Prisma.SubscriptionNoticeWhereInput;
    orderBy?: Prisma.SubscriptionNoticeOrderByWithRelationInput | Prisma.SubscriptionNoticeOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionNoticeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubscriptionNoticeScalarFieldEnum | Prisma.SubscriptionNoticeScalarFieldEnum[];
};
export type SubscriptionNoticeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionNoticeSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionNoticeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubscriptionNoticeCreateInput, Prisma.SubscriptionNoticeUncheckedCreateInput>;
};
export type SubscriptionNoticeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SubscriptionNoticeCreateManyInput | Prisma.SubscriptionNoticeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SubscriptionNoticeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionNoticeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubscriptionNoticeOmit<ExtArgs> | null;
    data: Prisma.SubscriptionNoticeCreateManyInput | Prisma.SubscriptionNoticeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SubscriptionNoticeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionNoticeSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionNoticeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubscriptionNoticeUpdateInput, Prisma.SubscriptionNoticeUncheckedUpdateInput>;
    where: Prisma.SubscriptionNoticeWhereUniqueInput;
};
export type SubscriptionNoticeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SubscriptionNoticeUpdateManyMutationInput, Prisma.SubscriptionNoticeUncheckedUpdateManyInput>;
    where?: Prisma.SubscriptionNoticeWhereInput;
    limit?: number;
};
export type SubscriptionNoticeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionNoticeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubscriptionNoticeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubscriptionNoticeUpdateManyMutationInput, Prisma.SubscriptionNoticeUncheckedUpdateManyInput>;
    where?: Prisma.SubscriptionNoticeWhereInput;
    limit?: number;
};
export type SubscriptionNoticeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionNoticeSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionNoticeOmit<ExtArgs> | null;
    where: Prisma.SubscriptionNoticeWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubscriptionNoticeCreateInput, Prisma.SubscriptionNoticeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SubscriptionNoticeUpdateInput, Prisma.SubscriptionNoticeUncheckedUpdateInput>;
};
export type SubscriptionNoticeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionNoticeSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionNoticeOmit<ExtArgs> | null;
    where: Prisma.SubscriptionNoticeWhereUniqueInput;
};
export type SubscriptionNoticeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionNoticeWhereInput;
    limit?: number;
};
export type SubscriptionNoticeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionNoticeSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionNoticeOmit<ExtArgs> | null;
};
