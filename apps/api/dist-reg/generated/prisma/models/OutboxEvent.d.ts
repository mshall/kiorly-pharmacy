import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type OutboxEventModel = runtime.Types.Result.DefaultSelection<Prisma.$OutboxEventPayload>;
export type AggregateOutboxEvent = {
    _count: OutboxEventCountAggregateOutputType | null;
    _avg: OutboxEventAvgAggregateOutputType | null;
    _sum: OutboxEventSumAggregateOutputType | null;
    _min: OutboxEventMinAggregateOutputType | null;
    _max: OutboxEventMaxAggregateOutputType | null;
};
export type OutboxEventAvgAggregateOutputType = {
    attempts: number | null;
};
export type OutboxEventSumAggregateOutputType = {
    attempts: number | null;
};
export type OutboxEventMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    type: string | null;
    aggregateType: string | null;
    aggregateId: string | null;
    target: string | null;
    dedupeKey: string | null;
    status: $Enums.OutboxStatus | null;
    attempts: number | null;
    lastError: string | null;
    nextAttemptAt: Date | null;
    occurredAt: Date | null;
    sentAt: Date | null;
};
export type OutboxEventMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    type: string | null;
    aggregateType: string | null;
    aggregateId: string | null;
    target: string | null;
    dedupeKey: string | null;
    status: $Enums.OutboxStatus | null;
    attempts: number | null;
    lastError: string | null;
    nextAttemptAt: Date | null;
    occurredAt: Date | null;
    sentAt: Date | null;
};
export type OutboxEventCountAggregateOutputType = {
    id: number;
    orgId: number;
    type: number;
    aggregateType: number;
    aggregateId: number;
    payload: number;
    target: number;
    dedupeKey: number;
    status: number;
    attempts: number;
    lastError: number;
    nextAttemptAt: number;
    occurredAt: number;
    sentAt: number;
    _all: number;
};
export type OutboxEventAvgAggregateInputType = {
    attempts?: true;
};
export type OutboxEventSumAggregateInputType = {
    attempts?: true;
};
export type OutboxEventMinAggregateInputType = {
    id?: true;
    orgId?: true;
    type?: true;
    aggregateType?: true;
    aggregateId?: true;
    target?: true;
    dedupeKey?: true;
    status?: true;
    attempts?: true;
    lastError?: true;
    nextAttemptAt?: true;
    occurredAt?: true;
    sentAt?: true;
};
export type OutboxEventMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    type?: true;
    aggregateType?: true;
    aggregateId?: true;
    target?: true;
    dedupeKey?: true;
    status?: true;
    attempts?: true;
    lastError?: true;
    nextAttemptAt?: true;
    occurredAt?: true;
    sentAt?: true;
};
export type OutboxEventCountAggregateInputType = {
    id?: true;
    orgId?: true;
    type?: true;
    aggregateType?: true;
    aggregateId?: true;
    payload?: true;
    target?: true;
    dedupeKey?: true;
    status?: true;
    attempts?: true;
    lastError?: true;
    nextAttemptAt?: true;
    occurredAt?: true;
    sentAt?: true;
    _all?: true;
};
export type OutboxEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OutboxEventWhereInput;
    orderBy?: Prisma.OutboxEventOrderByWithRelationInput | Prisma.OutboxEventOrderByWithRelationInput[];
    cursor?: Prisma.OutboxEventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | OutboxEventCountAggregateInputType;
    _avg?: OutboxEventAvgAggregateInputType;
    _sum?: OutboxEventSumAggregateInputType;
    _min?: OutboxEventMinAggregateInputType;
    _max?: OutboxEventMaxAggregateInputType;
};
export type GetOutboxEventAggregateType<T extends OutboxEventAggregateArgs> = {
    [P in keyof T & keyof AggregateOutboxEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOutboxEvent[P]> : Prisma.GetScalarType<T[P], AggregateOutboxEvent[P]>;
};
export type OutboxEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OutboxEventWhereInput;
    orderBy?: Prisma.OutboxEventOrderByWithAggregationInput | Prisma.OutboxEventOrderByWithAggregationInput[];
    by: Prisma.OutboxEventScalarFieldEnum[] | Prisma.OutboxEventScalarFieldEnum;
    having?: Prisma.OutboxEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OutboxEventCountAggregateInputType | true;
    _avg?: OutboxEventAvgAggregateInputType;
    _sum?: OutboxEventSumAggregateInputType;
    _min?: OutboxEventMinAggregateInputType;
    _max?: OutboxEventMaxAggregateInputType;
};
export type OutboxEventGroupByOutputType = {
    id: string;
    orgId: string;
    type: string;
    aggregateType: string;
    aggregateId: string;
    payload: runtime.JsonValue;
    target: string;
    dedupeKey: string | null;
    status: $Enums.OutboxStatus;
    attempts: number;
    lastError: string | null;
    nextAttemptAt: Date | null;
    occurredAt: Date;
    sentAt: Date | null;
    _count: OutboxEventCountAggregateOutputType | null;
    _avg: OutboxEventAvgAggregateOutputType | null;
    _sum: OutboxEventSumAggregateOutputType | null;
    _min: OutboxEventMinAggregateOutputType | null;
    _max: OutboxEventMaxAggregateOutputType | null;
};
export type GetOutboxEventGroupByPayload<T extends OutboxEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OutboxEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OutboxEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OutboxEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OutboxEventGroupByOutputType[P]>;
}>>;
export type OutboxEventWhereInput = {
    AND?: Prisma.OutboxEventWhereInput | Prisma.OutboxEventWhereInput[];
    OR?: Prisma.OutboxEventWhereInput[];
    NOT?: Prisma.OutboxEventWhereInput | Prisma.OutboxEventWhereInput[];
    id?: Prisma.StringFilter<"OutboxEvent"> | string;
    orgId?: Prisma.StringFilter<"OutboxEvent"> | string;
    type?: Prisma.StringFilter<"OutboxEvent"> | string;
    aggregateType?: Prisma.StringFilter<"OutboxEvent"> | string;
    aggregateId?: Prisma.StringFilter<"OutboxEvent"> | string;
    payload?: Prisma.JsonFilter<"OutboxEvent">;
    target?: Prisma.StringFilter<"OutboxEvent"> | string;
    dedupeKey?: Prisma.StringNullableFilter<"OutboxEvent"> | string | null;
    status?: Prisma.EnumOutboxStatusFilter<"OutboxEvent"> | $Enums.OutboxStatus;
    attempts?: Prisma.IntFilter<"OutboxEvent"> | number;
    lastError?: Prisma.StringNullableFilter<"OutboxEvent"> | string | null;
    nextAttemptAt?: Prisma.DateTimeNullableFilter<"OutboxEvent"> | Date | string | null;
    occurredAt?: Prisma.DateTimeFilter<"OutboxEvent"> | Date | string;
    sentAt?: Prisma.DateTimeNullableFilter<"OutboxEvent"> | Date | string | null;
};
export type OutboxEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    aggregateType?: Prisma.SortOrder;
    aggregateId?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    target?: Prisma.SortOrder;
    dedupeKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    attempts?: Prisma.SortOrder;
    lastError?: Prisma.SortOrderInput | Prisma.SortOrder;
    nextAttemptAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    occurredAt?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrderInput | Prisma.SortOrder;
};
export type OutboxEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId_dedupeKey?: Prisma.OutboxEventOrgIdDedupeKeyCompoundUniqueInput;
    AND?: Prisma.OutboxEventWhereInput | Prisma.OutboxEventWhereInput[];
    OR?: Prisma.OutboxEventWhereInput[];
    NOT?: Prisma.OutboxEventWhereInput | Prisma.OutboxEventWhereInput[];
    orgId?: Prisma.StringFilter<"OutboxEvent"> | string;
    type?: Prisma.StringFilter<"OutboxEvent"> | string;
    aggregateType?: Prisma.StringFilter<"OutboxEvent"> | string;
    aggregateId?: Prisma.StringFilter<"OutboxEvent"> | string;
    payload?: Prisma.JsonFilter<"OutboxEvent">;
    target?: Prisma.StringFilter<"OutboxEvent"> | string;
    dedupeKey?: Prisma.StringNullableFilter<"OutboxEvent"> | string | null;
    status?: Prisma.EnumOutboxStatusFilter<"OutboxEvent"> | $Enums.OutboxStatus;
    attempts?: Prisma.IntFilter<"OutboxEvent"> | number;
    lastError?: Prisma.StringNullableFilter<"OutboxEvent"> | string | null;
    nextAttemptAt?: Prisma.DateTimeNullableFilter<"OutboxEvent"> | Date | string | null;
    occurredAt?: Prisma.DateTimeFilter<"OutboxEvent"> | Date | string;
    sentAt?: Prisma.DateTimeNullableFilter<"OutboxEvent"> | Date | string | null;
}, "id" | "orgId_dedupeKey">;
export type OutboxEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    aggregateType?: Prisma.SortOrder;
    aggregateId?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    target?: Prisma.SortOrder;
    dedupeKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    attempts?: Prisma.SortOrder;
    lastError?: Prisma.SortOrderInput | Prisma.SortOrder;
    nextAttemptAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    occurredAt?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.OutboxEventCountOrderByAggregateInput;
    _avg?: Prisma.OutboxEventAvgOrderByAggregateInput;
    _max?: Prisma.OutboxEventMaxOrderByAggregateInput;
    _min?: Prisma.OutboxEventMinOrderByAggregateInput;
    _sum?: Prisma.OutboxEventSumOrderByAggregateInput;
};
export type OutboxEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.OutboxEventScalarWhereWithAggregatesInput | Prisma.OutboxEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.OutboxEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OutboxEventScalarWhereWithAggregatesInput | Prisma.OutboxEventScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"OutboxEvent"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"OutboxEvent"> | string;
    type?: Prisma.StringWithAggregatesFilter<"OutboxEvent"> | string;
    aggregateType?: Prisma.StringWithAggregatesFilter<"OutboxEvent"> | string;
    aggregateId?: Prisma.StringWithAggregatesFilter<"OutboxEvent"> | string;
    payload?: Prisma.JsonWithAggregatesFilter<"OutboxEvent">;
    target?: Prisma.StringWithAggregatesFilter<"OutboxEvent"> | string;
    dedupeKey?: Prisma.StringNullableWithAggregatesFilter<"OutboxEvent"> | string | null;
    status?: Prisma.EnumOutboxStatusWithAggregatesFilter<"OutboxEvent"> | $Enums.OutboxStatus;
    attempts?: Prisma.IntWithAggregatesFilter<"OutboxEvent"> | number;
    lastError?: Prisma.StringNullableWithAggregatesFilter<"OutboxEvent"> | string | null;
    nextAttemptAt?: Prisma.DateTimeNullableWithAggregatesFilter<"OutboxEvent"> | Date | string | null;
    occurredAt?: Prisma.DateTimeWithAggregatesFilter<"OutboxEvent"> | Date | string;
    sentAt?: Prisma.DateTimeNullableWithAggregatesFilter<"OutboxEvent"> | Date | string | null;
};
export type OutboxEventCreateInput = {
    id?: string;
    orgId: string;
    type: string;
    aggregateType: string;
    aggregateId: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    target?: string;
    dedupeKey?: string | null;
    status?: $Enums.OutboxStatus;
    attempts?: number;
    lastError?: string | null;
    nextAttemptAt?: Date | string | null;
    occurredAt?: Date | string;
    sentAt?: Date | string | null;
};
export type OutboxEventUncheckedCreateInput = {
    id?: string;
    orgId: string;
    type: string;
    aggregateType: string;
    aggregateId: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    target?: string;
    dedupeKey?: string | null;
    status?: $Enums.OutboxStatus;
    attempts?: number;
    lastError?: string | null;
    nextAttemptAt?: Date | string | null;
    occurredAt?: Date | string;
    sentAt?: Date | string | null;
};
export type OutboxEventUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    aggregateType?: Prisma.StringFieldUpdateOperationsInput | string;
    aggregateId?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    target?: Prisma.StringFieldUpdateOperationsInput | string;
    dedupeKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumOutboxStatusFieldUpdateOperationsInput | $Enums.OutboxStatus;
    attempts?: Prisma.IntFieldUpdateOperationsInput | number;
    lastError?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextAttemptAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    occurredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type OutboxEventUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    aggregateType?: Prisma.StringFieldUpdateOperationsInput | string;
    aggregateId?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    target?: Prisma.StringFieldUpdateOperationsInput | string;
    dedupeKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumOutboxStatusFieldUpdateOperationsInput | $Enums.OutboxStatus;
    attempts?: Prisma.IntFieldUpdateOperationsInput | number;
    lastError?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextAttemptAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    occurredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type OutboxEventCreateManyInput = {
    id?: string;
    orgId: string;
    type: string;
    aggregateType: string;
    aggregateId: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    target?: string;
    dedupeKey?: string | null;
    status?: $Enums.OutboxStatus;
    attempts?: number;
    lastError?: string | null;
    nextAttemptAt?: Date | string | null;
    occurredAt?: Date | string;
    sentAt?: Date | string | null;
};
export type OutboxEventUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    aggregateType?: Prisma.StringFieldUpdateOperationsInput | string;
    aggregateId?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    target?: Prisma.StringFieldUpdateOperationsInput | string;
    dedupeKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumOutboxStatusFieldUpdateOperationsInput | $Enums.OutboxStatus;
    attempts?: Prisma.IntFieldUpdateOperationsInput | number;
    lastError?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextAttemptAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    occurredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type OutboxEventUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    aggregateType?: Prisma.StringFieldUpdateOperationsInput | string;
    aggregateId?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    target?: Prisma.StringFieldUpdateOperationsInput | string;
    dedupeKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumOutboxStatusFieldUpdateOperationsInput | $Enums.OutboxStatus;
    attempts?: Prisma.IntFieldUpdateOperationsInput | number;
    lastError?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextAttemptAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    occurredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sentAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type OutboxEventOrgIdDedupeKeyCompoundUniqueInput = {
    orgId: string;
    dedupeKey: string;
};
export type OutboxEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    aggregateType?: Prisma.SortOrder;
    aggregateId?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    target?: Prisma.SortOrder;
    dedupeKey?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    attempts?: Prisma.SortOrder;
    lastError?: Prisma.SortOrder;
    nextAttemptAt?: Prisma.SortOrder;
    occurredAt?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
};
export type OutboxEventAvgOrderByAggregateInput = {
    attempts?: Prisma.SortOrder;
};
export type OutboxEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    aggregateType?: Prisma.SortOrder;
    aggregateId?: Prisma.SortOrder;
    target?: Prisma.SortOrder;
    dedupeKey?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    attempts?: Prisma.SortOrder;
    lastError?: Prisma.SortOrder;
    nextAttemptAt?: Prisma.SortOrder;
    occurredAt?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
};
export type OutboxEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    aggregateType?: Prisma.SortOrder;
    aggregateId?: Prisma.SortOrder;
    target?: Prisma.SortOrder;
    dedupeKey?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    attempts?: Prisma.SortOrder;
    lastError?: Prisma.SortOrder;
    nextAttemptAt?: Prisma.SortOrder;
    occurredAt?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
};
export type OutboxEventSumOrderByAggregateInput = {
    attempts?: Prisma.SortOrder;
};
export type EnumOutboxStatusFieldUpdateOperationsInput = {
    set?: $Enums.OutboxStatus;
};
export type OutboxEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    type?: boolean;
    aggregateType?: boolean;
    aggregateId?: boolean;
    payload?: boolean;
    target?: boolean;
    dedupeKey?: boolean;
    status?: boolean;
    attempts?: boolean;
    lastError?: boolean;
    nextAttemptAt?: boolean;
    occurredAt?: boolean;
    sentAt?: boolean;
}, ExtArgs["result"]["outboxEvent"]>;
export type OutboxEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    type?: boolean;
    aggregateType?: boolean;
    aggregateId?: boolean;
    payload?: boolean;
    target?: boolean;
    dedupeKey?: boolean;
    status?: boolean;
    attempts?: boolean;
    lastError?: boolean;
    nextAttemptAt?: boolean;
    occurredAt?: boolean;
    sentAt?: boolean;
}, ExtArgs["result"]["outboxEvent"]>;
export type OutboxEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    type?: boolean;
    aggregateType?: boolean;
    aggregateId?: boolean;
    payload?: boolean;
    target?: boolean;
    dedupeKey?: boolean;
    status?: boolean;
    attempts?: boolean;
    lastError?: boolean;
    nextAttemptAt?: boolean;
    occurredAt?: boolean;
    sentAt?: boolean;
}, ExtArgs["result"]["outboxEvent"]>;
export type OutboxEventSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    type?: boolean;
    aggregateType?: boolean;
    aggregateId?: boolean;
    payload?: boolean;
    target?: boolean;
    dedupeKey?: boolean;
    status?: boolean;
    attempts?: boolean;
    lastError?: boolean;
    nextAttemptAt?: boolean;
    occurredAt?: boolean;
    sentAt?: boolean;
};
export type OutboxEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "type" | "aggregateType" | "aggregateId" | "payload" | "target" | "dedupeKey" | "status" | "attempts" | "lastError" | "nextAttemptAt" | "occurredAt" | "sentAt", ExtArgs["result"]["outboxEvent"]>;
export type $OutboxEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "OutboxEvent";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        type: string;
        aggregateType: string;
        aggregateId: string;
        payload: runtime.JsonValue;
        target: string;
        dedupeKey: string | null;
        status: $Enums.OutboxStatus;
        attempts: number;
        lastError: string | null;
        nextAttemptAt: Date | null;
        occurredAt: Date;
        sentAt: Date | null;
    }, ExtArgs["result"]["outboxEvent"]>;
    composites: {};
};
export type OutboxEventGetPayload<S extends boolean | null | undefined | OutboxEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OutboxEventPayload, S>;
export type OutboxEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OutboxEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OutboxEventCountAggregateInputType | true;
};
export interface OutboxEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['OutboxEvent'];
        meta: {
            name: 'OutboxEvent';
        };
    };
    findUnique<T extends OutboxEventFindUniqueArgs>(args: Prisma.SelectSubset<T, OutboxEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OutboxEventClient<runtime.Types.Result.GetResult<Prisma.$OutboxEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends OutboxEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OutboxEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OutboxEventClient<runtime.Types.Result.GetResult<Prisma.$OutboxEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends OutboxEventFindFirstArgs>(args?: Prisma.SelectSubset<T, OutboxEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__OutboxEventClient<runtime.Types.Result.GetResult<Prisma.$OutboxEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends OutboxEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OutboxEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OutboxEventClient<runtime.Types.Result.GetResult<Prisma.$OutboxEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends OutboxEventFindManyArgs>(args?: Prisma.SelectSubset<T, OutboxEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OutboxEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends OutboxEventCreateArgs>(args: Prisma.SelectSubset<T, OutboxEventCreateArgs<ExtArgs>>): Prisma.Prisma__OutboxEventClient<runtime.Types.Result.GetResult<Prisma.$OutboxEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends OutboxEventCreateManyArgs>(args?: Prisma.SelectSubset<T, OutboxEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends OutboxEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OutboxEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OutboxEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends OutboxEventDeleteArgs>(args: Prisma.SelectSubset<T, OutboxEventDeleteArgs<ExtArgs>>): Prisma.Prisma__OutboxEventClient<runtime.Types.Result.GetResult<Prisma.$OutboxEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends OutboxEventUpdateArgs>(args: Prisma.SelectSubset<T, OutboxEventUpdateArgs<ExtArgs>>): Prisma.Prisma__OutboxEventClient<runtime.Types.Result.GetResult<Prisma.$OutboxEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends OutboxEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, OutboxEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends OutboxEventUpdateManyArgs>(args: Prisma.SelectSubset<T, OutboxEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends OutboxEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OutboxEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OutboxEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends OutboxEventUpsertArgs>(args: Prisma.SelectSubset<T, OutboxEventUpsertArgs<ExtArgs>>): Prisma.Prisma__OutboxEventClient<runtime.Types.Result.GetResult<Prisma.$OutboxEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends OutboxEventCountArgs>(args?: Prisma.Subset<T, OutboxEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OutboxEventCountAggregateOutputType> : number>;
    aggregate<T extends OutboxEventAggregateArgs>(args: Prisma.Subset<T, OutboxEventAggregateArgs>): Prisma.PrismaPromise<GetOutboxEventAggregateType<T>>;
    groupBy<T extends OutboxEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OutboxEventGroupByArgs['orderBy'];
    } : {
        orderBy?: OutboxEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OutboxEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOutboxEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: OutboxEventFieldRefs;
}
export interface Prisma__OutboxEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface OutboxEventFieldRefs {
    readonly id: Prisma.FieldRef<"OutboxEvent", 'String'>;
    readonly orgId: Prisma.FieldRef<"OutboxEvent", 'String'>;
    readonly type: Prisma.FieldRef<"OutboxEvent", 'String'>;
    readonly aggregateType: Prisma.FieldRef<"OutboxEvent", 'String'>;
    readonly aggregateId: Prisma.FieldRef<"OutboxEvent", 'String'>;
    readonly payload: Prisma.FieldRef<"OutboxEvent", 'Json'>;
    readonly target: Prisma.FieldRef<"OutboxEvent", 'String'>;
    readonly dedupeKey: Prisma.FieldRef<"OutboxEvent", 'String'>;
    readonly status: Prisma.FieldRef<"OutboxEvent", 'OutboxStatus'>;
    readonly attempts: Prisma.FieldRef<"OutboxEvent", 'Int'>;
    readonly lastError: Prisma.FieldRef<"OutboxEvent", 'String'>;
    readonly nextAttemptAt: Prisma.FieldRef<"OutboxEvent", 'DateTime'>;
    readonly occurredAt: Prisma.FieldRef<"OutboxEvent", 'DateTime'>;
    readonly sentAt: Prisma.FieldRef<"OutboxEvent", 'DateTime'>;
}
export type OutboxEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OutboxEventSelect<ExtArgs> | null;
    omit?: Prisma.OutboxEventOmit<ExtArgs> | null;
    where: Prisma.OutboxEventWhereUniqueInput;
};
export type OutboxEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OutboxEventSelect<ExtArgs> | null;
    omit?: Prisma.OutboxEventOmit<ExtArgs> | null;
    where: Prisma.OutboxEventWhereUniqueInput;
};
export type OutboxEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OutboxEventSelect<ExtArgs> | null;
    omit?: Prisma.OutboxEventOmit<ExtArgs> | null;
    where?: Prisma.OutboxEventWhereInput;
    orderBy?: Prisma.OutboxEventOrderByWithRelationInput | Prisma.OutboxEventOrderByWithRelationInput[];
    cursor?: Prisma.OutboxEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OutboxEventScalarFieldEnum | Prisma.OutboxEventScalarFieldEnum[];
};
export type OutboxEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OutboxEventSelect<ExtArgs> | null;
    omit?: Prisma.OutboxEventOmit<ExtArgs> | null;
    where?: Prisma.OutboxEventWhereInput;
    orderBy?: Prisma.OutboxEventOrderByWithRelationInput | Prisma.OutboxEventOrderByWithRelationInput[];
    cursor?: Prisma.OutboxEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OutboxEventScalarFieldEnum | Prisma.OutboxEventScalarFieldEnum[];
};
export type OutboxEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OutboxEventSelect<ExtArgs> | null;
    omit?: Prisma.OutboxEventOmit<ExtArgs> | null;
    where?: Prisma.OutboxEventWhereInput;
    orderBy?: Prisma.OutboxEventOrderByWithRelationInput | Prisma.OutboxEventOrderByWithRelationInput[];
    cursor?: Prisma.OutboxEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OutboxEventScalarFieldEnum | Prisma.OutboxEventScalarFieldEnum[];
};
export type OutboxEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OutboxEventSelect<ExtArgs> | null;
    omit?: Prisma.OutboxEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OutboxEventCreateInput, Prisma.OutboxEventUncheckedCreateInput>;
};
export type OutboxEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.OutboxEventCreateManyInput | Prisma.OutboxEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OutboxEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OutboxEventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OutboxEventOmit<ExtArgs> | null;
    data: Prisma.OutboxEventCreateManyInput | Prisma.OutboxEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OutboxEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OutboxEventSelect<ExtArgs> | null;
    omit?: Prisma.OutboxEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OutboxEventUpdateInput, Prisma.OutboxEventUncheckedUpdateInput>;
    where: Prisma.OutboxEventWhereUniqueInput;
};
export type OutboxEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.OutboxEventUpdateManyMutationInput, Prisma.OutboxEventUncheckedUpdateManyInput>;
    where?: Prisma.OutboxEventWhereInput;
    limit?: number;
};
export type OutboxEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OutboxEventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OutboxEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OutboxEventUpdateManyMutationInput, Prisma.OutboxEventUncheckedUpdateManyInput>;
    where?: Prisma.OutboxEventWhereInput;
    limit?: number;
};
export type OutboxEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OutboxEventSelect<ExtArgs> | null;
    omit?: Prisma.OutboxEventOmit<ExtArgs> | null;
    where: Prisma.OutboxEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.OutboxEventCreateInput, Prisma.OutboxEventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.OutboxEventUpdateInput, Prisma.OutboxEventUncheckedUpdateInput>;
};
export type OutboxEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OutboxEventSelect<ExtArgs> | null;
    omit?: Prisma.OutboxEventOmit<ExtArgs> | null;
    where: Prisma.OutboxEventWhereUniqueInput;
};
export type OutboxEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OutboxEventWhereInput;
    limit?: number;
};
export type OutboxEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OutboxEventSelect<ExtArgs> | null;
    omit?: Prisma.OutboxEventOmit<ExtArgs> | null;
};
