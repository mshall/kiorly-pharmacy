import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ProviderWebhookEventModel = runtime.Types.Result.DefaultSelection<Prisma.$ProviderWebhookEventPayload>;
export type AggregateProviderWebhookEvent = {
    _count: ProviderWebhookEventCountAggregateOutputType | null;
    _min: ProviderWebhookEventMinAggregateOutputType | null;
    _max: ProviderWebhookEventMaxAggregateOutputType | null;
};
export type ProviderWebhookEventMinAggregateOutputType = {
    id: string | null;
    kind: string | null;
    eventId: string | null;
    type: string | null;
    receivedAt: Date | null;
};
export type ProviderWebhookEventMaxAggregateOutputType = {
    id: string | null;
    kind: string | null;
    eventId: string | null;
    type: string | null;
    receivedAt: Date | null;
};
export type ProviderWebhookEventCountAggregateOutputType = {
    id: number;
    kind: number;
    eventId: number;
    type: number;
    receivedAt: number;
    _all: number;
};
export type ProviderWebhookEventMinAggregateInputType = {
    id?: true;
    kind?: true;
    eventId?: true;
    type?: true;
    receivedAt?: true;
};
export type ProviderWebhookEventMaxAggregateInputType = {
    id?: true;
    kind?: true;
    eventId?: true;
    type?: true;
    receivedAt?: true;
};
export type ProviderWebhookEventCountAggregateInputType = {
    id?: true;
    kind?: true;
    eventId?: true;
    type?: true;
    receivedAt?: true;
    _all?: true;
};
export type ProviderWebhookEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProviderWebhookEventWhereInput;
    orderBy?: Prisma.ProviderWebhookEventOrderByWithRelationInput | Prisma.ProviderWebhookEventOrderByWithRelationInput[];
    cursor?: Prisma.ProviderWebhookEventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProviderWebhookEventCountAggregateInputType;
    _min?: ProviderWebhookEventMinAggregateInputType;
    _max?: ProviderWebhookEventMaxAggregateInputType;
};
export type GetProviderWebhookEventAggregateType<T extends ProviderWebhookEventAggregateArgs> = {
    [P in keyof T & keyof AggregateProviderWebhookEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProviderWebhookEvent[P]> : Prisma.GetScalarType<T[P], AggregateProviderWebhookEvent[P]>;
};
export type ProviderWebhookEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProviderWebhookEventWhereInput;
    orderBy?: Prisma.ProviderWebhookEventOrderByWithAggregationInput | Prisma.ProviderWebhookEventOrderByWithAggregationInput[];
    by: Prisma.ProviderWebhookEventScalarFieldEnum[] | Prisma.ProviderWebhookEventScalarFieldEnum;
    having?: Prisma.ProviderWebhookEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProviderWebhookEventCountAggregateInputType | true;
    _min?: ProviderWebhookEventMinAggregateInputType;
    _max?: ProviderWebhookEventMaxAggregateInputType;
};
export type ProviderWebhookEventGroupByOutputType = {
    id: string;
    kind: string;
    eventId: string;
    type: string;
    receivedAt: Date;
    _count: ProviderWebhookEventCountAggregateOutputType | null;
    _min: ProviderWebhookEventMinAggregateOutputType | null;
    _max: ProviderWebhookEventMaxAggregateOutputType | null;
};
export type GetProviderWebhookEventGroupByPayload<T extends ProviderWebhookEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProviderWebhookEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProviderWebhookEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProviderWebhookEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProviderWebhookEventGroupByOutputType[P]>;
}>>;
export type ProviderWebhookEventWhereInput = {
    AND?: Prisma.ProviderWebhookEventWhereInput | Prisma.ProviderWebhookEventWhereInput[];
    OR?: Prisma.ProviderWebhookEventWhereInput[];
    NOT?: Prisma.ProviderWebhookEventWhereInput | Prisma.ProviderWebhookEventWhereInput[];
    id?: Prisma.StringFilter<"ProviderWebhookEvent"> | string;
    kind?: Prisma.StringFilter<"ProviderWebhookEvent"> | string;
    eventId?: Prisma.StringFilter<"ProviderWebhookEvent"> | string;
    type?: Prisma.StringFilter<"ProviderWebhookEvent"> | string;
    receivedAt?: Prisma.DateTimeFilter<"ProviderWebhookEvent"> | Date | string;
};
export type ProviderWebhookEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type ProviderWebhookEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    kind_eventId?: Prisma.ProviderWebhookEventKindEventIdCompoundUniqueInput;
    AND?: Prisma.ProviderWebhookEventWhereInput | Prisma.ProviderWebhookEventWhereInput[];
    OR?: Prisma.ProviderWebhookEventWhereInput[];
    NOT?: Prisma.ProviderWebhookEventWhereInput | Prisma.ProviderWebhookEventWhereInput[];
    kind?: Prisma.StringFilter<"ProviderWebhookEvent"> | string;
    eventId?: Prisma.StringFilter<"ProviderWebhookEvent"> | string;
    type?: Prisma.StringFilter<"ProviderWebhookEvent"> | string;
    receivedAt?: Prisma.DateTimeFilter<"ProviderWebhookEvent"> | Date | string;
}, "id" | "kind_eventId">;
export type ProviderWebhookEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
    _count?: Prisma.ProviderWebhookEventCountOrderByAggregateInput;
    _max?: Prisma.ProviderWebhookEventMaxOrderByAggregateInput;
    _min?: Prisma.ProviderWebhookEventMinOrderByAggregateInput;
};
export type ProviderWebhookEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProviderWebhookEventScalarWhereWithAggregatesInput | Prisma.ProviderWebhookEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProviderWebhookEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProviderWebhookEventScalarWhereWithAggregatesInput | Prisma.ProviderWebhookEventScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ProviderWebhookEvent"> | string;
    kind?: Prisma.StringWithAggregatesFilter<"ProviderWebhookEvent"> | string;
    eventId?: Prisma.StringWithAggregatesFilter<"ProviderWebhookEvent"> | string;
    type?: Prisma.StringWithAggregatesFilter<"ProviderWebhookEvent"> | string;
    receivedAt?: Prisma.DateTimeWithAggregatesFilter<"ProviderWebhookEvent"> | Date | string;
};
export type ProviderWebhookEventCreateInput = {
    id?: string;
    kind: string;
    eventId: string;
    type: string;
    receivedAt?: Date | string;
};
export type ProviderWebhookEventUncheckedCreateInput = {
    id?: string;
    kind: string;
    eventId: string;
    type: string;
    receivedAt?: Date | string;
};
export type ProviderWebhookEventUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProviderWebhookEventUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProviderWebhookEventCreateManyInput = {
    id?: string;
    kind: string;
    eventId: string;
    type: string;
    receivedAt?: Date | string;
};
export type ProviderWebhookEventUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProviderWebhookEventUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProviderWebhookEventKindEventIdCompoundUniqueInput = {
    kind: string;
    eventId: string;
};
export type ProviderWebhookEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type ProviderWebhookEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type ProviderWebhookEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type ProviderWebhookEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    kind?: boolean;
    eventId?: boolean;
    type?: boolean;
    receivedAt?: boolean;
}, ExtArgs["result"]["providerWebhookEvent"]>;
export type ProviderWebhookEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    kind?: boolean;
    eventId?: boolean;
    type?: boolean;
    receivedAt?: boolean;
}, ExtArgs["result"]["providerWebhookEvent"]>;
export type ProviderWebhookEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    kind?: boolean;
    eventId?: boolean;
    type?: boolean;
    receivedAt?: boolean;
}, ExtArgs["result"]["providerWebhookEvent"]>;
export type ProviderWebhookEventSelectScalar = {
    id?: boolean;
    kind?: boolean;
    eventId?: boolean;
    type?: boolean;
    receivedAt?: boolean;
};
export type ProviderWebhookEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "kind" | "eventId" | "type" | "receivedAt", ExtArgs["result"]["providerWebhookEvent"]>;
export type $ProviderWebhookEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProviderWebhookEvent";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        kind: string;
        eventId: string;
        type: string;
        receivedAt: Date;
    }, ExtArgs["result"]["providerWebhookEvent"]>;
    composites: {};
};
export type ProviderWebhookEventGetPayload<S extends boolean | null | undefined | ProviderWebhookEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProviderWebhookEventPayload, S>;
export type ProviderWebhookEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProviderWebhookEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProviderWebhookEventCountAggregateInputType | true;
};
export interface ProviderWebhookEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProviderWebhookEvent'];
        meta: {
            name: 'ProviderWebhookEvent';
        };
    };
    findUnique<T extends ProviderWebhookEventFindUniqueArgs>(args: Prisma.SelectSubset<T, ProviderWebhookEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProviderWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$ProviderWebhookEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProviderWebhookEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProviderWebhookEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProviderWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$ProviderWebhookEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProviderWebhookEventFindFirstArgs>(args?: Prisma.SelectSubset<T, ProviderWebhookEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProviderWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$ProviderWebhookEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProviderWebhookEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProviderWebhookEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProviderWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$ProviderWebhookEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProviderWebhookEventFindManyArgs>(args?: Prisma.SelectSubset<T, ProviderWebhookEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProviderWebhookEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProviderWebhookEventCreateArgs>(args: Prisma.SelectSubset<T, ProviderWebhookEventCreateArgs<ExtArgs>>): Prisma.Prisma__ProviderWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$ProviderWebhookEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProviderWebhookEventCreateManyArgs>(args?: Prisma.SelectSubset<T, ProviderWebhookEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProviderWebhookEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProviderWebhookEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProviderWebhookEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProviderWebhookEventDeleteArgs>(args: Prisma.SelectSubset<T, ProviderWebhookEventDeleteArgs<ExtArgs>>): Prisma.Prisma__ProviderWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$ProviderWebhookEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProviderWebhookEventUpdateArgs>(args: Prisma.SelectSubset<T, ProviderWebhookEventUpdateArgs<ExtArgs>>): Prisma.Prisma__ProviderWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$ProviderWebhookEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProviderWebhookEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProviderWebhookEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProviderWebhookEventUpdateManyArgs>(args: Prisma.SelectSubset<T, ProviderWebhookEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProviderWebhookEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProviderWebhookEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProviderWebhookEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProviderWebhookEventUpsertArgs>(args: Prisma.SelectSubset<T, ProviderWebhookEventUpsertArgs<ExtArgs>>): Prisma.Prisma__ProviderWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$ProviderWebhookEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProviderWebhookEventCountArgs>(args?: Prisma.Subset<T, ProviderWebhookEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProviderWebhookEventCountAggregateOutputType> : number>;
    aggregate<T extends ProviderWebhookEventAggregateArgs>(args: Prisma.Subset<T, ProviderWebhookEventAggregateArgs>): Prisma.PrismaPromise<GetProviderWebhookEventAggregateType<T>>;
    groupBy<T extends ProviderWebhookEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProviderWebhookEventGroupByArgs['orderBy'];
    } : {
        orderBy?: ProviderWebhookEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProviderWebhookEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProviderWebhookEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProviderWebhookEventFieldRefs;
}
export interface Prisma__ProviderWebhookEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProviderWebhookEventFieldRefs {
    readonly id: Prisma.FieldRef<"ProviderWebhookEvent", 'String'>;
    readonly kind: Prisma.FieldRef<"ProviderWebhookEvent", 'String'>;
    readonly eventId: Prisma.FieldRef<"ProviderWebhookEvent", 'String'>;
    readonly type: Prisma.FieldRef<"ProviderWebhookEvent", 'String'>;
    readonly receivedAt: Prisma.FieldRef<"ProviderWebhookEvent", 'DateTime'>;
}
export type ProviderWebhookEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.ProviderWebhookEventOmit<ExtArgs> | null;
    where: Prisma.ProviderWebhookEventWhereUniqueInput;
};
export type ProviderWebhookEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.ProviderWebhookEventOmit<ExtArgs> | null;
    where: Prisma.ProviderWebhookEventWhereUniqueInput;
};
export type ProviderWebhookEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.ProviderWebhookEventOmit<ExtArgs> | null;
    where?: Prisma.ProviderWebhookEventWhereInput;
    orderBy?: Prisma.ProviderWebhookEventOrderByWithRelationInput | Prisma.ProviderWebhookEventOrderByWithRelationInput[];
    cursor?: Prisma.ProviderWebhookEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProviderWebhookEventScalarFieldEnum | Prisma.ProviderWebhookEventScalarFieldEnum[];
};
export type ProviderWebhookEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.ProviderWebhookEventOmit<ExtArgs> | null;
    where?: Prisma.ProviderWebhookEventWhereInput;
    orderBy?: Prisma.ProviderWebhookEventOrderByWithRelationInput | Prisma.ProviderWebhookEventOrderByWithRelationInput[];
    cursor?: Prisma.ProviderWebhookEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProviderWebhookEventScalarFieldEnum | Prisma.ProviderWebhookEventScalarFieldEnum[];
};
export type ProviderWebhookEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.ProviderWebhookEventOmit<ExtArgs> | null;
    where?: Prisma.ProviderWebhookEventWhereInput;
    orderBy?: Prisma.ProviderWebhookEventOrderByWithRelationInput | Prisma.ProviderWebhookEventOrderByWithRelationInput[];
    cursor?: Prisma.ProviderWebhookEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProviderWebhookEventScalarFieldEnum | Prisma.ProviderWebhookEventScalarFieldEnum[];
};
export type ProviderWebhookEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.ProviderWebhookEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProviderWebhookEventCreateInput, Prisma.ProviderWebhookEventUncheckedCreateInput>;
};
export type ProviderWebhookEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProviderWebhookEventCreateManyInput | Prisma.ProviderWebhookEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProviderWebhookEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderWebhookEventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProviderWebhookEventOmit<ExtArgs> | null;
    data: Prisma.ProviderWebhookEventCreateManyInput | Prisma.ProviderWebhookEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProviderWebhookEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.ProviderWebhookEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProviderWebhookEventUpdateInput, Prisma.ProviderWebhookEventUncheckedUpdateInput>;
    where: Prisma.ProviderWebhookEventWhereUniqueInput;
};
export type ProviderWebhookEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProviderWebhookEventUpdateManyMutationInput, Prisma.ProviderWebhookEventUncheckedUpdateManyInput>;
    where?: Prisma.ProviderWebhookEventWhereInput;
    limit?: number;
};
export type ProviderWebhookEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderWebhookEventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProviderWebhookEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProviderWebhookEventUpdateManyMutationInput, Prisma.ProviderWebhookEventUncheckedUpdateManyInput>;
    where?: Prisma.ProviderWebhookEventWhereInput;
    limit?: number;
};
export type ProviderWebhookEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.ProviderWebhookEventOmit<ExtArgs> | null;
    where: Prisma.ProviderWebhookEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProviderWebhookEventCreateInput, Prisma.ProviderWebhookEventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProviderWebhookEventUpdateInput, Prisma.ProviderWebhookEventUncheckedUpdateInput>;
};
export type ProviderWebhookEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.ProviderWebhookEventOmit<ExtArgs> | null;
    where: Prisma.ProviderWebhookEventWhereUniqueInput;
};
export type ProviderWebhookEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProviderWebhookEventWhereInput;
    limit?: number;
};
export type ProviderWebhookEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.ProviderWebhookEventOmit<ExtArgs> | null;
};
