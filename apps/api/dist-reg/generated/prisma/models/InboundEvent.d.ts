import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type InboundEventModel = runtime.Types.Result.DefaultSelection<Prisma.$InboundEventPayload>;
export type AggregateInboundEvent = {
    _count: InboundEventCountAggregateOutputType | null;
    _min: InboundEventMinAggregateOutputType | null;
    _max: InboundEventMaxAggregateOutputType | null;
};
export type InboundEventMinAggregateOutputType = {
    id: string | null;
    eventId: string | null;
    type: string | null;
    orgId: string | null;
    receivedAt: Date | null;
};
export type InboundEventMaxAggregateOutputType = {
    id: string | null;
    eventId: string | null;
    type: string | null;
    orgId: string | null;
    receivedAt: Date | null;
};
export type InboundEventCountAggregateOutputType = {
    id: number;
    eventId: number;
    type: number;
    orgId: number;
    receivedAt: number;
    _all: number;
};
export type InboundEventMinAggregateInputType = {
    id?: true;
    eventId?: true;
    type?: true;
    orgId?: true;
    receivedAt?: true;
};
export type InboundEventMaxAggregateInputType = {
    id?: true;
    eventId?: true;
    type?: true;
    orgId?: true;
    receivedAt?: true;
};
export type InboundEventCountAggregateInputType = {
    id?: true;
    eventId?: true;
    type?: true;
    orgId?: true;
    receivedAt?: true;
    _all?: true;
};
export type InboundEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InboundEventWhereInput;
    orderBy?: Prisma.InboundEventOrderByWithRelationInput | Prisma.InboundEventOrderByWithRelationInput[];
    cursor?: Prisma.InboundEventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | InboundEventCountAggregateInputType;
    _min?: InboundEventMinAggregateInputType;
    _max?: InboundEventMaxAggregateInputType;
};
export type GetInboundEventAggregateType<T extends InboundEventAggregateArgs> = {
    [P in keyof T & keyof AggregateInboundEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateInboundEvent[P]> : Prisma.GetScalarType<T[P], AggregateInboundEvent[P]>;
};
export type InboundEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InboundEventWhereInput;
    orderBy?: Prisma.InboundEventOrderByWithAggregationInput | Prisma.InboundEventOrderByWithAggregationInput[];
    by: Prisma.InboundEventScalarFieldEnum[] | Prisma.InboundEventScalarFieldEnum;
    having?: Prisma.InboundEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: InboundEventCountAggregateInputType | true;
    _min?: InboundEventMinAggregateInputType;
    _max?: InboundEventMaxAggregateInputType;
};
export type InboundEventGroupByOutputType = {
    id: string;
    eventId: string;
    type: string;
    orgId: string;
    receivedAt: Date;
    _count: InboundEventCountAggregateOutputType | null;
    _min: InboundEventMinAggregateOutputType | null;
    _max: InboundEventMaxAggregateOutputType | null;
};
export type GetInboundEventGroupByPayload<T extends InboundEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<InboundEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof InboundEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], InboundEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], InboundEventGroupByOutputType[P]>;
}>>;
export type InboundEventWhereInput = {
    AND?: Prisma.InboundEventWhereInput | Prisma.InboundEventWhereInput[];
    OR?: Prisma.InboundEventWhereInput[];
    NOT?: Prisma.InboundEventWhereInput | Prisma.InboundEventWhereInput[];
    id?: Prisma.StringFilter<"InboundEvent"> | string;
    eventId?: Prisma.StringFilter<"InboundEvent"> | string;
    type?: Prisma.StringFilter<"InboundEvent"> | string;
    orgId?: Prisma.StringFilter<"InboundEvent"> | string;
    receivedAt?: Prisma.DateTimeFilter<"InboundEvent"> | Date | string;
};
export type InboundEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type InboundEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId_eventId?: Prisma.InboundEventOrgIdEventIdCompoundUniqueInput;
    AND?: Prisma.InboundEventWhereInput | Prisma.InboundEventWhereInput[];
    OR?: Prisma.InboundEventWhereInput[];
    NOT?: Prisma.InboundEventWhereInput | Prisma.InboundEventWhereInput[];
    eventId?: Prisma.StringFilter<"InboundEvent"> | string;
    type?: Prisma.StringFilter<"InboundEvent"> | string;
    orgId?: Prisma.StringFilter<"InboundEvent"> | string;
    receivedAt?: Prisma.DateTimeFilter<"InboundEvent"> | Date | string;
}, "id" | "orgId_eventId">;
export type InboundEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
    _count?: Prisma.InboundEventCountOrderByAggregateInput;
    _max?: Prisma.InboundEventMaxOrderByAggregateInput;
    _min?: Prisma.InboundEventMinOrderByAggregateInput;
};
export type InboundEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.InboundEventScalarWhereWithAggregatesInput | Prisma.InboundEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.InboundEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.InboundEventScalarWhereWithAggregatesInput | Prisma.InboundEventScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"InboundEvent"> | string;
    eventId?: Prisma.StringWithAggregatesFilter<"InboundEvent"> | string;
    type?: Prisma.StringWithAggregatesFilter<"InboundEvent"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"InboundEvent"> | string;
    receivedAt?: Prisma.DateTimeWithAggregatesFilter<"InboundEvent"> | Date | string;
};
export type InboundEventCreateInput = {
    id?: string;
    eventId: string;
    type: string;
    orgId: string;
    receivedAt?: Date | string;
};
export type InboundEventUncheckedCreateInput = {
    id?: string;
    eventId: string;
    type: string;
    orgId: string;
    receivedAt?: Date | string;
};
export type InboundEventUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InboundEventUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InboundEventCreateManyInput = {
    id?: string;
    eventId: string;
    type: string;
    orgId: string;
    receivedAt?: Date | string;
};
export type InboundEventUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InboundEventUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InboundEventOrgIdEventIdCompoundUniqueInput = {
    orgId: string;
    eventId: string;
};
export type InboundEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type InboundEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type InboundEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
};
export type InboundEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    type?: boolean;
    orgId?: boolean;
    receivedAt?: boolean;
}, ExtArgs["result"]["inboundEvent"]>;
export type InboundEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    type?: boolean;
    orgId?: boolean;
    receivedAt?: boolean;
}, ExtArgs["result"]["inboundEvent"]>;
export type InboundEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    type?: boolean;
    orgId?: boolean;
    receivedAt?: boolean;
}, ExtArgs["result"]["inboundEvent"]>;
export type InboundEventSelectScalar = {
    id?: boolean;
    eventId?: boolean;
    type?: boolean;
    orgId?: boolean;
    receivedAt?: boolean;
};
export type InboundEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "eventId" | "type" | "orgId" | "receivedAt", ExtArgs["result"]["inboundEvent"]>;
export type $InboundEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "InboundEvent";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        eventId: string;
        type: string;
        orgId: string;
        receivedAt: Date;
    }, ExtArgs["result"]["inboundEvent"]>;
    composites: {};
};
export type InboundEventGetPayload<S extends boolean | null | undefined | InboundEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$InboundEventPayload, S>;
export type InboundEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<InboundEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: InboundEventCountAggregateInputType | true;
};
export interface InboundEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['InboundEvent'];
        meta: {
            name: 'InboundEvent';
        };
    };
    findUnique<T extends InboundEventFindUniqueArgs>(args: Prisma.SelectSubset<T, InboundEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__InboundEventClient<runtime.Types.Result.GetResult<Prisma.$InboundEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends InboundEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, InboundEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__InboundEventClient<runtime.Types.Result.GetResult<Prisma.$InboundEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends InboundEventFindFirstArgs>(args?: Prisma.SelectSubset<T, InboundEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__InboundEventClient<runtime.Types.Result.GetResult<Prisma.$InboundEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends InboundEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, InboundEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__InboundEventClient<runtime.Types.Result.GetResult<Prisma.$InboundEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends InboundEventFindManyArgs>(args?: Prisma.SelectSubset<T, InboundEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InboundEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends InboundEventCreateArgs>(args: Prisma.SelectSubset<T, InboundEventCreateArgs<ExtArgs>>): Prisma.Prisma__InboundEventClient<runtime.Types.Result.GetResult<Prisma.$InboundEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends InboundEventCreateManyArgs>(args?: Prisma.SelectSubset<T, InboundEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends InboundEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, InboundEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InboundEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends InboundEventDeleteArgs>(args: Prisma.SelectSubset<T, InboundEventDeleteArgs<ExtArgs>>): Prisma.Prisma__InboundEventClient<runtime.Types.Result.GetResult<Prisma.$InboundEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends InboundEventUpdateArgs>(args: Prisma.SelectSubset<T, InboundEventUpdateArgs<ExtArgs>>): Prisma.Prisma__InboundEventClient<runtime.Types.Result.GetResult<Prisma.$InboundEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends InboundEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, InboundEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends InboundEventUpdateManyArgs>(args: Prisma.SelectSubset<T, InboundEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends InboundEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, InboundEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InboundEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends InboundEventUpsertArgs>(args: Prisma.SelectSubset<T, InboundEventUpsertArgs<ExtArgs>>): Prisma.Prisma__InboundEventClient<runtime.Types.Result.GetResult<Prisma.$InboundEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends InboundEventCountArgs>(args?: Prisma.Subset<T, InboundEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], InboundEventCountAggregateOutputType> : number>;
    aggregate<T extends InboundEventAggregateArgs>(args: Prisma.Subset<T, InboundEventAggregateArgs>): Prisma.PrismaPromise<GetInboundEventAggregateType<T>>;
    groupBy<T extends InboundEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: InboundEventGroupByArgs['orderBy'];
    } : {
        orderBy?: InboundEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, InboundEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInboundEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: InboundEventFieldRefs;
}
export interface Prisma__InboundEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface InboundEventFieldRefs {
    readonly id: Prisma.FieldRef<"InboundEvent", 'String'>;
    readonly eventId: Prisma.FieldRef<"InboundEvent", 'String'>;
    readonly type: Prisma.FieldRef<"InboundEvent", 'String'>;
    readonly orgId: Prisma.FieldRef<"InboundEvent", 'String'>;
    readonly receivedAt: Prisma.FieldRef<"InboundEvent", 'DateTime'>;
}
export type InboundEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InboundEventSelect<ExtArgs> | null;
    omit?: Prisma.InboundEventOmit<ExtArgs> | null;
    where: Prisma.InboundEventWhereUniqueInput;
};
export type InboundEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InboundEventSelect<ExtArgs> | null;
    omit?: Prisma.InboundEventOmit<ExtArgs> | null;
    where: Prisma.InboundEventWhereUniqueInput;
};
export type InboundEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InboundEventSelect<ExtArgs> | null;
    omit?: Prisma.InboundEventOmit<ExtArgs> | null;
    where?: Prisma.InboundEventWhereInput;
    orderBy?: Prisma.InboundEventOrderByWithRelationInput | Prisma.InboundEventOrderByWithRelationInput[];
    cursor?: Prisma.InboundEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InboundEventScalarFieldEnum | Prisma.InboundEventScalarFieldEnum[];
};
export type InboundEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InboundEventSelect<ExtArgs> | null;
    omit?: Prisma.InboundEventOmit<ExtArgs> | null;
    where?: Prisma.InboundEventWhereInput;
    orderBy?: Prisma.InboundEventOrderByWithRelationInput | Prisma.InboundEventOrderByWithRelationInput[];
    cursor?: Prisma.InboundEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InboundEventScalarFieldEnum | Prisma.InboundEventScalarFieldEnum[];
};
export type InboundEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InboundEventSelect<ExtArgs> | null;
    omit?: Prisma.InboundEventOmit<ExtArgs> | null;
    where?: Prisma.InboundEventWhereInput;
    orderBy?: Prisma.InboundEventOrderByWithRelationInput | Prisma.InboundEventOrderByWithRelationInput[];
    cursor?: Prisma.InboundEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InboundEventScalarFieldEnum | Prisma.InboundEventScalarFieldEnum[];
};
export type InboundEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InboundEventSelect<ExtArgs> | null;
    omit?: Prisma.InboundEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InboundEventCreateInput, Prisma.InboundEventUncheckedCreateInput>;
};
export type InboundEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.InboundEventCreateManyInput | Prisma.InboundEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type InboundEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InboundEventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.InboundEventOmit<ExtArgs> | null;
    data: Prisma.InboundEventCreateManyInput | Prisma.InboundEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type InboundEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InboundEventSelect<ExtArgs> | null;
    omit?: Prisma.InboundEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InboundEventUpdateInput, Prisma.InboundEventUncheckedUpdateInput>;
    where: Prisma.InboundEventWhereUniqueInput;
};
export type InboundEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.InboundEventUpdateManyMutationInput, Prisma.InboundEventUncheckedUpdateManyInput>;
    where?: Prisma.InboundEventWhereInput;
    limit?: number;
};
export type InboundEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InboundEventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.InboundEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InboundEventUpdateManyMutationInput, Prisma.InboundEventUncheckedUpdateManyInput>;
    where?: Prisma.InboundEventWhereInput;
    limit?: number;
};
export type InboundEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InboundEventSelect<ExtArgs> | null;
    omit?: Prisma.InboundEventOmit<ExtArgs> | null;
    where: Prisma.InboundEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.InboundEventCreateInput, Prisma.InboundEventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.InboundEventUpdateInput, Prisma.InboundEventUncheckedUpdateInput>;
};
export type InboundEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InboundEventSelect<ExtArgs> | null;
    omit?: Prisma.InboundEventOmit<ExtArgs> | null;
    where: Prisma.InboundEventWhereUniqueInput;
};
export type InboundEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InboundEventWhereInput;
    limit?: number;
};
export type InboundEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InboundEventSelect<ExtArgs> | null;
    omit?: Prisma.InboundEventOmit<ExtArgs> | null;
};
