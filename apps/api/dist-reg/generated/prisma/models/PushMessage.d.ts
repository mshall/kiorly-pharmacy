import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type PushMessageModel = runtime.Types.Result.DefaultSelection<Prisma.$PushMessagePayload>;
export type AggregatePushMessage = {
    _count: PushMessageCountAggregateOutputType | null;
    _min: PushMessageMinAggregateOutputType | null;
    _max: PushMessageMaxAggregateOutputType | null;
};
export type PushMessageMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    userId: string | null;
    kind: string | null;
    title: string | null;
    titleAr: string | null;
    body: string | null;
    bodyAr: string | null;
    provider: string | null;
    deliveredAt: Date | null;
    readAt: Date | null;
    createdAt: Date | null;
};
export type PushMessageMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    userId: string | null;
    kind: string | null;
    title: string | null;
    titleAr: string | null;
    body: string | null;
    bodyAr: string | null;
    provider: string | null;
    deliveredAt: Date | null;
    readAt: Date | null;
    createdAt: Date | null;
};
export type PushMessageCountAggregateOutputType = {
    id: number;
    orgId: number;
    userId: number;
    kind: number;
    title: number;
    titleAr: number;
    body: number;
    bodyAr: number;
    data: number;
    provider: number;
    deliveredAt: number;
    readAt: number;
    createdAt: number;
    _all: number;
};
export type PushMessageMinAggregateInputType = {
    id?: true;
    orgId?: true;
    userId?: true;
    kind?: true;
    title?: true;
    titleAr?: true;
    body?: true;
    bodyAr?: true;
    provider?: true;
    deliveredAt?: true;
    readAt?: true;
    createdAt?: true;
};
export type PushMessageMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    userId?: true;
    kind?: true;
    title?: true;
    titleAr?: true;
    body?: true;
    bodyAr?: true;
    provider?: true;
    deliveredAt?: true;
    readAt?: true;
    createdAt?: true;
};
export type PushMessageCountAggregateInputType = {
    id?: true;
    orgId?: true;
    userId?: true;
    kind?: true;
    title?: true;
    titleAr?: true;
    body?: true;
    bodyAr?: true;
    data?: true;
    provider?: true;
    deliveredAt?: true;
    readAt?: true;
    createdAt?: true;
    _all?: true;
};
export type PushMessageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PushMessageWhereInput;
    orderBy?: Prisma.PushMessageOrderByWithRelationInput | Prisma.PushMessageOrderByWithRelationInput[];
    cursor?: Prisma.PushMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PushMessageCountAggregateInputType;
    _min?: PushMessageMinAggregateInputType;
    _max?: PushMessageMaxAggregateInputType;
};
export type GetPushMessageAggregateType<T extends PushMessageAggregateArgs> = {
    [P in keyof T & keyof AggregatePushMessage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePushMessage[P]> : Prisma.GetScalarType<T[P], AggregatePushMessage[P]>;
};
export type PushMessageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PushMessageWhereInput;
    orderBy?: Prisma.PushMessageOrderByWithAggregationInput | Prisma.PushMessageOrderByWithAggregationInput[];
    by: Prisma.PushMessageScalarFieldEnum[] | Prisma.PushMessageScalarFieldEnum;
    having?: Prisma.PushMessageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PushMessageCountAggregateInputType | true;
    _min?: PushMessageMinAggregateInputType;
    _max?: PushMessageMaxAggregateInputType;
};
export type PushMessageGroupByOutputType = {
    id: string;
    orgId: string;
    userId: string;
    kind: string;
    title: string;
    titleAr: string;
    body: string;
    bodyAr: string;
    data: runtime.JsonValue | null;
    provider: string;
    deliveredAt: Date | null;
    readAt: Date | null;
    createdAt: Date;
    _count: PushMessageCountAggregateOutputType | null;
    _min: PushMessageMinAggregateOutputType | null;
    _max: PushMessageMaxAggregateOutputType | null;
};
export type GetPushMessageGroupByPayload<T extends PushMessageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PushMessageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PushMessageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PushMessageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PushMessageGroupByOutputType[P]>;
}>>;
export type PushMessageWhereInput = {
    AND?: Prisma.PushMessageWhereInput | Prisma.PushMessageWhereInput[];
    OR?: Prisma.PushMessageWhereInput[];
    NOT?: Prisma.PushMessageWhereInput | Prisma.PushMessageWhereInput[];
    id?: Prisma.StringFilter<"PushMessage"> | string;
    orgId?: Prisma.StringFilter<"PushMessage"> | string;
    userId?: Prisma.StringFilter<"PushMessage"> | string;
    kind?: Prisma.StringFilter<"PushMessage"> | string;
    title?: Prisma.StringFilter<"PushMessage"> | string;
    titleAr?: Prisma.StringFilter<"PushMessage"> | string;
    body?: Prisma.StringFilter<"PushMessage"> | string;
    bodyAr?: Prisma.StringFilter<"PushMessage"> | string;
    data?: Prisma.JsonNullableFilter<"PushMessage">;
    provider?: Prisma.StringFilter<"PushMessage"> | string;
    deliveredAt?: Prisma.DateTimeNullableFilter<"PushMessage"> | Date | string | null;
    readAt?: Prisma.DateTimeNullableFilter<"PushMessage"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"PushMessage"> | Date | string;
};
export type PushMessageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    titleAr?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    bodyAr?: Prisma.SortOrder;
    data?: Prisma.SortOrderInput | Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    deliveredAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    readAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PushMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PushMessageWhereInput | Prisma.PushMessageWhereInput[];
    OR?: Prisma.PushMessageWhereInput[];
    NOT?: Prisma.PushMessageWhereInput | Prisma.PushMessageWhereInput[];
    orgId?: Prisma.StringFilter<"PushMessage"> | string;
    userId?: Prisma.StringFilter<"PushMessage"> | string;
    kind?: Prisma.StringFilter<"PushMessage"> | string;
    title?: Prisma.StringFilter<"PushMessage"> | string;
    titleAr?: Prisma.StringFilter<"PushMessage"> | string;
    body?: Prisma.StringFilter<"PushMessage"> | string;
    bodyAr?: Prisma.StringFilter<"PushMessage"> | string;
    data?: Prisma.JsonNullableFilter<"PushMessage">;
    provider?: Prisma.StringFilter<"PushMessage"> | string;
    deliveredAt?: Prisma.DateTimeNullableFilter<"PushMessage"> | Date | string | null;
    readAt?: Prisma.DateTimeNullableFilter<"PushMessage"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"PushMessage"> | Date | string;
}, "id">;
export type PushMessageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    titleAr?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    bodyAr?: Prisma.SortOrder;
    data?: Prisma.SortOrderInput | Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    deliveredAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    readAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.PushMessageCountOrderByAggregateInput;
    _max?: Prisma.PushMessageMaxOrderByAggregateInput;
    _min?: Prisma.PushMessageMinOrderByAggregateInput;
};
export type PushMessageScalarWhereWithAggregatesInput = {
    AND?: Prisma.PushMessageScalarWhereWithAggregatesInput | Prisma.PushMessageScalarWhereWithAggregatesInput[];
    OR?: Prisma.PushMessageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PushMessageScalarWhereWithAggregatesInput | Prisma.PushMessageScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PushMessage"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"PushMessage"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"PushMessage"> | string;
    kind?: Prisma.StringWithAggregatesFilter<"PushMessage"> | string;
    title?: Prisma.StringWithAggregatesFilter<"PushMessage"> | string;
    titleAr?: Prisma.StringWithAggregatesFilter<"PushMessage"> | string;
    body?: Prisma.StringWithAggregatesFilter<"PushMessage"> | string;
    bodyAr?: Prisma.StringWithAggregatesFilter<"PushMessage"> | string;
    data?: Prisma.JsonNullableWithAggregatesFilter<"PushMessage">;
    provider?: Prisma.StringWithAggregatesFilter<"PushMessage"> | string;
    deliveredAt?: Prisma.DateTimeNullableWithAggregatesFilter<"PushMessage"> | Date | string | null;
    readAt?: Prisma.DateTimeNullableWithAggregatesFilter<"PushMessage"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PushMessage"> | Date | string;
};
export type PushMessageCreateInput = {
    id?: string;
    orgId: string;
    userId: string;
    kind: string;
    title: string;
    titleAr: string;
    body: string;
    bodyAr: string;
    data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    provider?: string;
    deliveredAt?: Date | string | null;
    readAt?: Date | string | null;
    createdAt?: Date | string;
};
export type PushMessageUncheckedCreateInput = {
    id?: string;
    orgId: string;
    userId: string;
    kind: string;
    title: string;
    titleAr: string;
    body: string;
    bodyAr: string;
    data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    provider?: string;
    deliveredAt?: Date | string | null;
    readAt?: Date | string | null;
    createdAt?: Date | string;
};
export type PushMessageUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    titleAr?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    bodyAr?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    deliveredAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PushMessageUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    titleAr?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    bodyAr?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    deliveredAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PushMessageCreateManyInput = {
    id?: string;
    orgId: string;
    userId: string;
    kind: string;
    title: string;
    titleAr: string;
    body: string;
    bodyAr: string;
    data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    provider?: string;
    deliveredAt?: Date | string | null;
    readAt?: Date | string | null;
    createdAt?: Date | string;
};
export type PushMessageUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    titleAr?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    bodyAr?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    deliveredAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PushMessageUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    titleAr?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    bodyAr?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    deliveredAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PushMessageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    titleAr?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    bodyAr?: Prisma.SortOrder;
    data?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    deliveredAt?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PushMessageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    titleAr?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    bodyAr?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    deliveredAt?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PushMessageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    titleAr?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    bodyAr?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    deliveredAt?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PushMessageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    userId?: boolean;
    kind?: boolean;
    title?: boolean;
    titleAr?: boolean;
    body?: boolean;
    bodyAr?: boolean;
    data?: boolean;
    provider?: boolean;
    deliveredAt?: boolean;
    readAt?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["pushMessage"]>;
export type PushMessageSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    userId?: boolean;
    kind?: boolean;
    title?: boolean;
    titleAr?: boolean;
    body?: boolean;
    bodyAr?: boolean;
    data?: boolean;
    provider?: boolean;
    deliveredAt?: boolean;
    readAt?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["pushMessage"]>;
export type PushMessageSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    userId?: boolean;
    kind?: boolean;
    title?: boolean;
    titleAr?: boolean;
    body?: boolean;
    bodyAr?: boolean;
    data?: boolean;
    provider?: boolean;
    deliveredAt?: boolean;
    readAt?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["pushMessage"]>;
export type PushMessageSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    userId?: boolean;
    kind?: boolean;
    title?: boolean;
    titleAr?: boolean;
    body?: boolean;
    bodyAr?: boolean;
    data?: boolean;
    provider?: boolean;
    deliveredAt?: boolean;
    readAt?: boolean;
    createdAt?: boolean;
};
export type PushMessageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "userId" | "kind" | "title" | "titleAr" | "body" | "bodyAr" | "data" | "provider" | "deliveredAt" | "readAt" | "createdAt", ExtArgs["result"]["pushMessage"]>;
export type $PushMessagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PushMessage";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        userId: string;
        kind: string;
        title: string;
        titleAr: string;
        body: string;
        bodyAr: string;
        data: runtime.JsonValue | null;
        provider: string;
        deliveredAt: Date | null;
        readAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["pushMessage"]>;
    composites: {};
};
export type PushMessageGetPayload<S extends boolean | null | undefined | PushMessageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PushMessagePayload, S>;
export type PushMessageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PushMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PushMessageCountAggregateInputType | true;
};
export interface PushMessageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PushMessage'];
        meta: {
            name: 'PushMessage';
        };
    };
    findUnique<T extends PushMessageFindUniqueArgs>(args: Prisma.SelectSubset<T, PushMessageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PushMessageClient<runtime.Types.Result.GetResult<Prisma.$PushMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PushMessageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PushMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PushMessageClient<runtime.Types.Result.GetResult<Prisma.$PushMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PushMessageFindFirstArgs>(args?: Prisma.SelectSubset<T, PushMessageFindFirstArgs<ExtArgs>>): Prisma.Prisma__PushMessageClient<runtime.Types.Result.GetResult<Prisma.$PushMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PushMessageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PushMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PushMessageClient<runtime.Types.Result.GetResult<Prisma.$PushMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PushMessageFindManyArgs>(args?: Prisma.SelectSubset<T, PushMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PushMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PushMessageCreateArgs>(args: Prisma.SelectSubset<T, PushMessageCreateArgs<ExtArgs>>): Prisma.Prisma__PushMessageClient<runtime.Types.Result.GetResult<Prisma.$PushMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PushMessageCreateManyArgs>(args?: Prisma.SelectSubset<T, PushMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PushMessageCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PushMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PushMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PushMessageDeleteArgs>(args: Prisma.SelectSubset<T, PushMessageDeleteArgs<ExtArgs>>): Prisma.Prisma__PushMessageClient<runtime.Types.Result.GetResult<Prisma.$PushMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PushMessageUpdateArgs>(args: Prisma.SelectSubset<T, PushMessageUpdateArgs<ExtArgs>>): Prisma.Prisma__PushMessageClient<runtime.Types.Result.GetResult<Prisma.$PushMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PushMessageDeleteManyArgs>(args?: Prisma.SelectSubset<T, PushMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PushMessageUpdateManyArgs>(args: Prisma.SelectSubset<T, PushMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PushMessageUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PushMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PushMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PushMessageUpsertArgs>(args: Prisma.SelectSubset<T, PushMessageUpsertArgs<ExtArgs>>): Prisma.Prisma__PushMessageClient<runtime.Types.Result.GetResult<Prisma.$PushMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PushMessageCountArgs>(args?: Prisma.Subset<T, PushMessageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PushMessageCountAggregateOutputType> : number>;
    aggregate<T extends PushMessageAggregateArgs>(args: Prisma.Subset<T, PushMessageAggregateArgs>): Prisma.PrismaPromise<GetPushMessageAggregateType<T>>;
    groupBy<T extends PushMessageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PushMessageGroupByArgs['orderBy'];
    } : {
        orderBy?: PushMessageGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PushMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPushMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PushMessageFieldRefs;
}
export interface Prisma__PushMessageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PushMessageFieldRefs {
    readonly id: Prisma.FieldRef<"PushMessage", 'String'>;
    readonly orgId: Prisma.FieldRef<"PushMessage", 'String'>;
    readonly userId: Prisma.FieldRef<"PushMessage", 'String'>;
    readonly kind: Prisma.FieldRef<"PushMessage", 'String'>;
    readonly title: Prisma.FieldRef<"PushMessage", 'String'>;
    readonly titleAr: Prisma.FieldRef<"PushMessage", 'String'>;
    readonly body: Prisma.FieldRef<"PushMessage", 'String'>;
    readonly bodyAr: Prisma.FieldRef<"PushMessage", 'String'>;
    readonly data: Prisma.FieldRef<"PushMessage", 'Json'>;
    readonly provider: Prisma.FieldRef<"PushMessage", 'String'>;
    readonly deliveredAt: Prisma.FieldRef<"PushMessage", 'DateTime'>;
    readonly readAt: Prisma.FieldRef<"PushMessage", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"PushMessage", 'DateTime'>;
}
export type PushMessageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PushMessageSelect<ExtArgs> | null;
    omit?: Prisma.PushMessageOmit<ExtArgs> | null;
    where: Prisma.PushMessageWhereUniqueInput;
};
export type PushMessageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PushMessageSelect<ExtArgs> | null;
    omit?: Prisma.PushMessageOmit<ExtArgs> | null;
    where: Prisma.PushMessageWhereUniqueInput;
};
export type PushMessageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PushMessageSelect<ExtArgs> | null;
    omit?: Prisma.PushMessageOmit<ExtArgs> | null;
    where?: Prisma.PushMessageWhereInput;
    orderBy?: Prisma.PushMessageOrderByWithRelationInput | Prisma.PushMessageOrderByWithRelationInput[];
    cursor?: Prisma.PushMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PushMessageScalarFieldEnum | Prisma.PushMessageScalarFieldEnum[];
};
export type PushMessageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PushMessageSelect<ExtArgs> | null;
    omit?: Prisma.PushMessageOmit<ExtArgs> | null;
    where?: Prisma.PushMessageWhereInput;
    orderBy?: Prisma.PushMessageOrderByWithRelationInput | Prisma.PushMessageOrderByWithRelationInput[];
    cursor?: Prisma.PushMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PushMessageScalarFieldEnum | Prisma.PushMessageScalarFieldEnum[];
};
export type PushMessageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PushMessageSelect<ExtArgs> | null;
    omit?: Prisma.PushMessageOmit<ExtArgs> | null;
    where?: Prisma.PushMessageWhereInput;
    orderBy?: Prisma.PushMessageOrderByWithRelationInput | Prisma.PushMessageOrderByWithRelationInput[];
    cursor?: Prisma.PushMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PushMessageScalarFieldEnum | Prisma.PushMessageScalarFieldEnum[];
};
export type PushMessageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PushMessageSelect<ExtArgs> | null;
    omit?: Prisma.PushMessageOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PushMessageCreateInput, Prisma.PushMessageUncheckedCreateInput>;
};
export type PushMessageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PushMessageCreateManyInput | Prisma.PushMessageCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PushMessageCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PushMessageSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PushMessageOmit<ExtArgs> | null;
    data: Prisma.PushMessageCreateManyInput | Prisma.PushMessageCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PushMessageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PushMessageSelect<ExtArgs> | null;
    omit?: Prisma.PushMessageOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PushMessageUpdateInput, Prisma.PushMessageUncheckedUpdateInput>;
    where: Prisma.PushMessageWhereUniqueInput;
};
export type PushMessageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PushMessageUpdateManyMutationInput, Prisma.PushMessageUncheckedUpdateManyInput>;
    where?: Prisma.PushMessageWhereInput;
    limit?: number;
};
export type PushMessageUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PushMessageSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PushMessageOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PushMessageUpdateManyMutationInput, Prisma.PushMessageUncheckedUpdateManyInput>;
    where?: Prisma.PushMessageWhereInput;
    limit?: number;
};
export type PushMessageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PushMessageSelect<ExtArgs> | null;
    omit?: Prisma.PushMessageOmit<ExtArgs> | null;
    where: Prisma.PushMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.PushMessageCreateInput, Prisma.PushMessageUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PushMessageUpdateInput, Prisma.PushMessageUncheckedUpdateInput>;
};
export type PushMessageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PushMessageSelect<ExtArgs> | null;
    omit?: Prisma.PushMessageOmit<ExtArgs> | null;
    where: Prisma.PushMessageWhereUniqueInput;
};
export type PushMessageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PushMessageWhereInput;
    limit?: number;
};
export type PushMessageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PushMessageSelect<ExtArgs> | null;
    omit?: Prisma.PushMessageOmit<ExtArgs> | null;
};
