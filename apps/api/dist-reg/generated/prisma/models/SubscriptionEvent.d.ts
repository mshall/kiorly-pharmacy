import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type SubscriptionEventModel = runtime.Types.Result.DefaultSelection<Prisma.$SubscriptionEventPayload>;
export type AggregateSubscriptionEvent = {
    _count: SubscriptionEventCountAggregateOutputType | null;
    _min: SubscriptionEventMinAggregateOutputType | null;
    _max: SubscriptionEventMaxAggregateOutputType | null;
};
export type SubscriptionEventMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    type: string | null;
    actorId: string | null;
    at: Date | null;
};
export type SubscriptionEventMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    type: string | null;
    actorId: string | null;
    at: Date | null;
};
export type SubscriptionEventCountAggregateOutputType = {
    id: number;
    orgId: number;
    type: number;
    fromJson: number;
    toJson: number;
    actorId: number;
    at: number;
    _all: number;
};
export type SubscriptionEventMinAggregateInputType = {
    id?: true;
    orgId?: true;
    type?: true;
    actorId?: true;
    at?: true;
};
export type SubscriptionEventMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    type?: true;
    actorId?: true;
    at?: true;
};
export type SubscriptionEventCountAggregateInputType = {
    id?: true;
    orgId?: true;
    type?: true;
    fromJson?: true;
    toJson?: true;
    actorId?: true;
    at?: true;
    _all?: true;
};
export type SubscriptionEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionEventWhereInput;
    orderBy?: Prisma.SubscriptionEventOrderByWithRelationInput | Prisma.SubscriptionEventOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionEventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SubscriptionEventCountAggregateInputType;
    _min?: SubscriptionEventMinAggregateInputType;
    _max?: SubscriptionEventMaxAggregateInputType;
};
export type GetSubscriptionEventAggregateType<T extends SubscriptionEventAggregateArgs> = {
    [P in keyof T & keyof AggregateSubscriptionEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSubscriptionEvent[P]> : Prisma.GetScalarType<T[P], AggregateSubscriptionEvent[P]>;
};
export type SubscriptionEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionEventWhereInput;
    orderBy?: Prisma.SubscriptionEventOrderByWithAggregationInput | Prisma.SubscriptionEventOrderByWithAggregationInput[];
    by: Prisma.SubscriptionEventScalarFieldEnum[] | Prisma.SubscriptionEventScalarFieldEnum;
    having?: Prisma.SubscriptionEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SubscriptionEventCountAggregateInputType | true;
    _min?: SubscriptionEventMinAggregateInputType;
    _max?: SubscriptionEventMaxAggregateInputType;
};
export type SubscriptionEventGroupByOutputType = {
    id: string;
    orgId: string;
    type: string;
    fromJson: runtime.JsonValue | null;
    toJson: runtime.JsonValue | null;
    actorId: string | null;
    at: Date;
    _count: SubscriptionEventCountAggregateOutputType | null;
    _min: SubscriptionEventMinAggregateOutputType | null;
    _max: SubscriptionEventMaxAggregateOutputType | null;
};
export type GetSubscriptionEventGroupByPayload<T extends SubscriptionEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SubscriptionEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SubscriptionEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SubscriptionEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SubscriptionEventGroupByOutputType[P]>;
}>>;
export type SubscriptionEventWhereInput = {
    AND?: Prisma.SubscriptionEventWhereInput | Prisma.SubscriptionEventWhereInput[];
    OR?: Prisma.SubscriptionEventWhereInput[];
    NOT?: Prisma.SubscriptionEventWhereInput | Prisma.SubscriptionEventWhereInput[];
    id?: Prisma.StringFilter<"SubscriptionEvent"> | string;
    orgId?: Prisma.StringFilter<"SubscriptionEvent"> | string;
    type?: Prisma.StringFilter<"SubscriptionEvent"> | string;
    fromJson?: Prisma.JsonNullableFilter<"SubscriptionEvent">;
    toJson?: Prisma.JsonNullableFilter<"SubscriptionEvent">;
    actorId?: Prisma.StringNullableFilter<"SubscriptionEvent"> | string | null;
    at?: Prisma.DateTimeFilter<"SubscriptionEvent"> | Date | string;
};
export type SubscriptionEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    fromJson?: Prisma.SortOrderInput | Prisma.SortOrder;
    toJson?: Prisma.SortOrderInput | Prisma.SortOrder;
    actorId?: Prisma.SortOrderInput | Prisma.SortOrder;
    at?: Prisma.SortOrder;
};
export type SubscriptionEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SubscriptionEventWhereInput | Prisma.SubscriptionEventWhereInput[];
    OR?: Prisma.SubscriptionEventWhereInput[];
    NOT?: Prisma.SubscriptionEventWhereInput | Prisma.SubscriptionEventWhereInput[];
    orgId?: Prisma.StringFilter<"SubscriptionEvent"> | string;
    type?: Prisma.StringFilter<"SubscriptionEvent"> | string;
    fromJson?: Prisma.JsonNullableFilter<"SubscriptionEvent">;
    toJson?: Prisma.JsonNullableFilter<"SubscriptionEvent">;
    actorId?: Prisma.StringNullableFilter<"SubscriptionEvent"> | string | null;
    at?: Prisma.DateTimeFilter<"SubscriptionEvent"> | Date | string;
}, "id">;
export type SubscriptionEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    fromJson?: Prisma.SortOrderInput | Prisma.SortOrder;
    toJson?: Prisma.SortOrderInput | Prisma.SortOrder;
    actorId?: Prisma.SortOrderInput | Prisma.SortOrder;
    at?: Prisma.SortOrder;
    _count?: Prisma.SubscriptionEventCountOrderByAggregateInput;
    _max?: Prisma.SubscriptionEventMaxOrderByAggregateInput;
    _min?: Prisma.SubscriptionEventMinOrderByAggregateInput;
};
export type SubscriptionEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.SubscriptionEventScalarWhereWithAggregatesInput | Prisma.SubscriptionEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.SubscriptionEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SubscriptionEventScalarWhereWithAggregatesInput | Prisma.SubscriptionEventScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SubscriptionEvent"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"SubscriptionEvent"> | string;
    type?: Prisma.StringWithAggregatesFilter<"SubscriptionEvent"> | string;
    fromJson?: Prisma.JsonNullableWithAggregatesFilter<"SubscriptionEvent">;
    toJson?: Prisma.JsonNullableWithAggregatesFilter<"SubscriptionEvent">;
    actorId?: Prisma.StringNullableWithAggregatesFilter<"SubscriptionEvent"> | string | null;
    at?: Prisma.DateTimeWithAggregatesFilter<"SubscriptionEvent"> | Date | string;
};
export type SubscriptionEventCreateInput = {
    id?: string;
    orgId: string;
    type: string;
    fromJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    toJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    actorId?: string | null;
    at?: Date | string;
};
export type SubscriptionEventUncheckedCreateInput = {
    id?: string;
    orgId: string;
    type: string;
    fromJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    toJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    actorId?: string | null;
    at?: Date | string;
};
export type SubscriptionEventUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    fromJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    toJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    actorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionEventUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    fromJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    toJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    actorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionEventCreateManyInput = {
    id?: string;
    orgId: string;
    type: string;
    fromJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    toJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    actorId?: string | null;
    at?: Date | string;
};
export type SubscriptionEventUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    fromJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    toJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    actorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionEventUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    fromJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    toJson?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    actorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    fromJson?: Prisma.SortOrder;
    toJson?: Prisma.SortOrder;
    actorId?: Prisma.SortOrder;
    at?: Prisma.SortOrder;
};
export type SubscriptionEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    actorId?: Prisma.SortOrder;
    at?: Prisma.SortOrder;
};
export type SubscriptionEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    actorId?: Prisma.SortOrder;
    at?: Prisma.SortOrder;
};
export type SubscriptionEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    type?: boolean;
    fromJson?: boolean;
    toJson?: boolean;
    actorId?: boolean;
    at?: boolean;
}, ExtArgs["result"]["subscriptionEvent"]>;
export type SubscriptionEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    type?: boolean;
    fromJson?: boolean;
    toJson?: boolean;
    actorId?: boolean;
    at?: boolean;
}, ExtArgs["result"]["subscriptionEvent"]>;
export type SubscriptionEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    type?: boolean;
    fromJson?: boolean;
    toJson?: boolean;
    actorId?: boolean;
    at?: boolean;
}, ExtArgs["result"]["subscriptionEvent"]>;
export type SubscriptionEventSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    type?: boolean;
    fromJson?: boolean;
    toJson?: boolean;
    actorId?: boolean;
    at?: boolean;
};
export type SubscriptionEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "type" | "fromJson" | "toJson" | "actorId" | "at", ExtArgs["result"]["subscriptionEvent"]>;
export type $SubscriptionEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SubscriptionEvent";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        type: string;
        fromJson: runtime.JsonValue | null;
        toJson: runtime.JsonValue | null;
        actorId: string | null;
        at: Date;
    }, ExtArgs["result"]["subscriptionEvent"]>;
    composites: {};
};
export type SubscriptionEventGetPayload<S extends boolean | null | undefined | SubscriptionEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SubscriptionEventPayload, S>;
export type SubscriptionEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SubscriptionEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SubscriptionEventCountAggregateInputType | true;
};
export interface SubscriptionEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SubscriptionEvent'];
        meta: {
            name: 'SubscriptionEvent';
        };
    };
    findUnique<T extends SubscriptionEventFindUniqueArgs>(args: Prisma.SelectSubset<T, SubscriptionEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SubscriptionEventClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SubscriptionEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SubscriptionEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubscriptionEventClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SubscriptionEventFindFirstArgs>(args?: Prisma.SelectSubset<T, SubscriptionEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__SubscriptionEventClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SubscriptionEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SubscriptionEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubscriptionEventClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SubscriptionEventFindManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SubscriptionEventCreateArgs>(args: Prisma.SelectSubset<T, SubscriptionEventCreateArgs<ExtArgs>>): Prisma.Prisma__SubscriptionEventClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SubscriptionEventCreateManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SubscriptionEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SubscriptionEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SubscriptionEventDeleteArgs>(args: Prisma.SelectSubset<T, SubscriptionEventDeleteArgs<ExtArgs>>): Prisma.Prisma__SubscriptionEventClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SubscriptionEventUpdateArgs>(args: Prisma.SelectSubset<T, SubscriptionEventUpdateArgs<ExtArgs>>): Prisma.Prisma__SubscriptionEventClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SubscriptionEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SubscriptionEventUpdateManyArgs>(args: Prisma.SelectSubset<T, SubscriptionEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SubscriptionEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SubscriptionEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SubscriptionEventUpsertArgs>(args: Prisma.SelectSubset<T, SubscriptionEventUpsertArgs<ExtArgs>>): Prisma.Prisma__SubscriptionEventClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SubscriptionEventCountArgs>(args?: Prisma.Subset<T, SubscriptionEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SubscriptionEventCountAggregateOutputType> : number>;
    aggregate<T extends SubscriptionEventAggregateArgs>(args: Prisma.Subset<T, SubscriptionEventAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionEventAggregateType<T>>;
    groupBy<T extends SubscriptionEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SubscriptionEventGroupByArgs['orderBy'];
    } : {
        orderBy?: SubscriptionEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SubscriptionEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SubscriptionEventFieldRefs;
}
export interface Prisma__SubscriptionEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SubscriptionEventFieldRefs {
    readonly id: Prisma.FieldRef<"SubscriptionEvent", 'String'>;
    readonly orgId: Prisma.FieldRef<"SubscriptionEvent", 'String'>;
    readonly type: Prisma.FieldRef<"SubscriptionEvent", 'String'>;
    readonly fromJson: Prisma.FieldRef<"SubscriptionEvent", 'Json'>;
    readonly toJson: Prisma.FieldRef<"SubscriptionEvent", 'Json'>;
    readonly actorId: Prisma.FieldRef<"SubscriptionEvent", 'String'>;
    readonly at: Prisma.FieldRef<"SubscriptionEvent", 'DateTime'>;
}
export type SubscriptionEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionEventSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionEventOmit<ExtArgs> | null;
    where: Prisma.SubscriptionEventWhereUniqueInput;
};
export type SubscriptionEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionEventSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionEventOmit<ExtArgs> | null;
    where: Prisma.SubscriptionEventWhereUniqueInput;
};
export type SubscriptionEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionEventSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionEventOmit<ExtArgs> | null;
    where?: Prisma.SubscriptionEventWhereInput;
    orderBy?: Prisma.SubscriptionEventOrderByWithRelationInput | Prisma.SubscriptionEventOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubscriptionEventScalarFieldEnum | Prisma.SubscriptionEventScalarFieldEnum[];
};
export type SubscriptionEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionEventSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionEventOmit<ExtArgs> | null;
    where?: Prisma.SubscriptionEventWhereInput;
    orderBy?: Prisma.SubscriptionEventOrderByWithRelationInput | Prisma.SubscriptionEventOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubscriptionEventScalarFieldEnum | Prisma.SubscriptionEventScalarFieldEnum[];
};
export type SubscriptionEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionEventSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionEventOmit<ExtArgs> | null;
    where?: Prisma.SubscriptionEventWhereInput;
    orderBy?: Prisma.SubscriptionEventOrderByWithRelationInput | Prisma.SubscriptionEventOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubscriptionEventScalarFieldEnum | Prisma.SubscriptionEventScalarFieldEnum[];
};
export type SubscriptionEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionEventSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubscriptionEventCreateInput, Prisma.SubscriptionEventUncheckedCreateInput>;
};
export type SubscriptionEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SubscriptionEventCreateManyInput | Prisma.SubscriptionEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SubscriptionEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionEventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubscriptionEventOmit<ExtArgs> | null;
    data: Prisma.SubscriptionEventCreateManyInput | Prisma.SubscriptionEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SubscriptionEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionEventSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubscriptionEventUpdateInput, Prisma.SubscriptionEventUncheckedUpdateInput>;
    where: Prisma.SubscriptionEventWhereUniqueInput;
};
export type SubscriptionEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SubscriptionEventUpdateManyMutationInput, Prisma.SubscriptionEventUncheckedUpdateManyInput>;
    where?: Prisma.SubscriptionEventWhereInput;
    limit?: number;
};
export type SubscriptionEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionEventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubscriptionEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubscriptionEventUpdateManyMutationInput, Prisma.SubscriptionEventUncheckedUpdateManyInput>;
    where?: Prisma.SubscriptionEventWhereInput;
    limit?: number;
};
export type SubscriptionEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionEventSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionEventOmit<ExtArgs> | null;
    where: Prisma.SubscriptionEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubscriptionEventCreateInput, Prisma.SubscriptionEventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SubscriptionEventUpdateInput, Prisma.SubscriptionEventUncheckedUpdateInput>;
};
export type SubscriptionEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionEventSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionEventOmit<ExtArgs> | null;
    where: Prisma.SubscriptionEventWhereUniqueInput;
};
export type SubscriptionEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionEventWhereInput;
    limit?: number;
};
export type SubscriptionEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionEventSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionEventOmit<ExtArgs> | null;
};
