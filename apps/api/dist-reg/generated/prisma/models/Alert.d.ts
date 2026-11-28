import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type AlertModel = runtime.Types.Result.DefaultSelection<Prisma.$AlertPayload>;
export type AggregateAlert = {
    _count: AlertCountAggregateOutputType | null;
    _min: AlertMinAggregateOutputType | null;
    _max: AlertMaxAggregateOutputType | null;
};
export type AlertMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    kind: string | null;
    severity: string | null;
    title: string | null;
    body: string | null;
    link: string | null;
    refType: string | null;
    refId: string | null;
    dedupeKey: string | null;
    createdAt: Date | null;
    resolvedAt: Date | null;
};
export type AlertMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    kind: string | null;
    severity: string | null;
    title: string | null;
    body: string | null;
    link: string | null;
    refType: string | null;
    refId: string | null;
    dedupeKey: string | null;
    createdAt: Date | null;
    resolvedAt: Date | null;
};
export type AlertCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    kind: number;
    severity: number;
    title: number;
    body: number;
    link: number;
    refType: number;
    refId: number;
    dedupeKey: number;
    readBy: number;
    createdAt: number;
    resolvedAt: number;
    _all: number;
};
export type AlertMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    kind?: true;
    severity?: true;
    title?: true;
    body?: true;
    link?: true;
    refType?: true;
    refId?: true;
    dedupeKey?: true;
    createdAt?: true;
    resolvedAt?: true;
};
export type AlertMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    kind?: true;
    severity?: true;
    title?: true;
    body?: true;
    link?: true;
    refType?: true;
    refId?: true;
    dedupeKey?: true;
    createdAt?: true;
    resolvedAt?: true;
};
export type AlertCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    kind?: true;
    severity?: true;
    title?: true;
    body?: true;
    link?: true;
    refType?: true;
    refId?: true;
    dedupeKey?: true;
    readBy?: true;
    createdAt?: true;
    resolvedAt?: true;
    _all?: true;
};
export type AlertAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AlertWhereInput;
    orderBy?: Prisma.AlertOrderByWithRelationInput | Prisma.AlertOrderByWithRelationInput[];
    cursor?: Prisma.AlertWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AlertCountAggregateInputType;
    _min?: AlertMinAggregateInputType;
    _max?: AlertMaxAggregateInputType;
};
export type GetAlertAggregateType<T extends AlertAggregateArgs> = {
    [P in keyof T & keyof AggregateAlert]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAlert[P]> : Prisma.GetScalarType<T[P], AggregateAlert[P]>;
};
export type AlertGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AlertWhereInput;
    orderBy?: Prisma.AlertOrderByWithAggregationInput | Prisma.AlertOrderByWithAggregationInput[];
    by: Prisma.AlertScalarFieldEnum[] | Prisma.AlertScalarFieldEnum;
    having?: Prisma.AlertScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AlertCountAggregateInputType | true;
    _min?: AlertMinAggregateInputType;
    _max?: AlertMaxAggregateInputType;
};
export type AlertGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string | null;
    kind: string;
    severity: string;
    title: string;
    body: string | null;
    link: string | null;
    refType: string | null;
    refId: string | null;
    dedupeKey: string;
    readBy: string[];
    createdAt: Date;
    resolvedAt: Date | null;
    _count: AlertCountAggregateOutputType | null;
    _min: AlertMinAggregateOutputType | null;
    _max: AlertMaxAggregateOutputType | null;
};
export type GetAlertGroupByPayload<T extends AlertGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AlertGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AlertGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AlertGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AlertGroupByOutputType[P]>;
}>>;
export type AlertWhereInput = {
    AND?: Prisma.AlertWhereInput | Prisma.AlertWhereInput[];
    OR?: Prisma.AlertWhereInput[];
    NOT?: Prisma.AlertWhereInput | Prisma.AlertWhereInput[];
    id?: Prisma.StringFilter<"Alert"> | string;
    orgId?: Prisma.StringFilter<"Alert"> | string;
    branchId?: Prisma.StringNullableFilter<"Alert"> | string | null;
    kind?: Prisma.StringFilter<"Alert"> | string;
    severity?: Prisma.StringFilter<"Alert"> | string;
    title?: Prisma.StringFilter<"Alert"> | string;
    body?: Prisma.StringNullableFilter<"Alert"> | string | null;
    link?: Prisma.StringNullableFilter<"Alert"> | string | null;
    refType?: Prisma.StringNullableFilter<"Alert"> | string | null;
    refId?: Prisma.StringNullableFilter<"Alert"> | string | null;
    dedupeKey?: Prisma.StringFilter<"Alert"> | string;
    readBy?: Prisma.StringNullableListFilter<"Alert">;
    createdAt?: Prisma.DateTimeFilter<"Alert"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableFilter<"Alert"> | Date | string | null;
};
export type AlertOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    severity?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrderInput | Prisma.SortOrder;
    link?: Prisma.SortOrderInput | Prisma.SortOrder;
    refType?: Prisma.SortOrderInput | Prisma.SortOrder;
    refId?: Prisma.SortOrderInput | Prisma.SortOrder;
    dedupeKey?: Prisma.SortOrder;
    readBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
};
export type AlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId_dedupeKey?: Prisma.AlertOrgIdDedupeKeyCompoundUniqueInput;
    AND?: Prisma.AlertWhereInput | Prisma.AlertWhereInput[];
    OR?: Prisma.AlertWhereInput[];
    NOT?: Prisma.AlertWhereInput | Prisma.AlertWhereInput[];
    orgId?: Prisma.StringFilter<"Alert"> | string;
    branchId?: Prisma.StringNullableFilter<"Alert"> | string | null;
    kind?: Prisma.StringFilter<"Alert"> | string;
    severity?: Prisma.StringFilter<"Alert"> | string;
    title?: Prisma.StringFilter<"Alert"> | string;
    body?: Prisma.StringNullableFilter<"Alert"> | string | null;
    link?: Prisma.StringNullableFilter<"Alert"> | string | null;
    refType?: Prisma.StringNullableFilter<"Alert"> | string | null;
    refId?: Prisma.StringNullableFilter<"Alert"> | string | null;
    dedupeKey?: Prisma.StringFilter<"Alert"> | string;
    readBy?: Prisma.StringNullableListFilter<"Alert">;
    createdAt?: Prisma.DateTimeFilter<"Alert"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableFilter<"Alert"> | Date | string | null;
}, "id" | "orgId_dedupeKey">;
export type AlertOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    severity?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrderInput | Prisma.SortOrder;
    link?: Prisma.SortOrderInput | Prisma.SortOrder;
    refType?: Prisma.SortOrderInput | Prisma.SortOrder;
    refId?: Prisma.SortOrderInput | Prisma.SortOrder;
    dedupeKey?: Prisma.SortOrder;
    readBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.AlertCountOrderByAggregateInput;
    _max?: Prisma.AlertMaxOrderByAggregateInput;
    _min?: Prisma.AlertMinOrderByAggregateInput;
};
export type AlertScalarWhereWithAggregatesInput = {
    AND?: Prisma.AlertScalarWhereWithAggregatesInput | Prisma.AlertScalarWhereWithAggregatesInput[];
    OR?: Prisma.AlertScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AlertScalarWhereWithAggregatesInput | Prisma.AlertScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Alert"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"Alert"> | string;
    branchId?: Prisma.StringNullableWithAggregatesFilter<"Alert"> | string | null;
    kind?: Prisma.StringWithAggregatesFilter<"Alert"> | string;
    severity?: Prisma.StringWithAggregatesFilter<"Alert"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Alert"> | string;
    body?: Prisma.StringNullableWithAggregatesFilter<"Alert"> | string | null;
    link?: Prisma.StringNullableWithAggregatesFilter<"Alert"> | string | null;
    refType?: Prisma.StringNullableWithAggregatesFilter<"Alert"> | string | null;
    refId?: Prisma.StringNullableWithAggregatesFilter<"Alert"> | string | null;
    dedupeKey?: Prisma.StringWithAggregatesFilter<"Alert"> | string;
    readBy?: Prisma.StringNullableListFilter<"Alert">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Alert"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Alert"> | Date | string | null;
};
export type AlertCreateInput = {
    id?: string;
    orgId: string;
    branchId?: string | null;
    kind: string;
    severity?: string;
    title: string;
    body?: string | null;
    link?: string | null;
    refType?: string | null;
    refId?: string | null;
    dedupeKey: string;
    readBy?: Prisma.AlertCreatereadByInput | string[];
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
};
export type AlertUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId?: string | null;
    kind: string;
    severity?: string;
    title: string;
    body?: string | null;
    link?: string | null;
    refType?: string | null;
    refId?: string | null;
    dedupeKey: string;
    readBy?: Prisma.AlertCreatereadByInput | string[];
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
};
export type AlertUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    severity?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    link?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dedupeKey?: Prisma.StringFieldUpdateOperationsInput | string;
    readBy?: Prisma.AlertUpdatereadByInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AlertUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    severity?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    link?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dedupeKey?: Prisma.StringFieldUpdateOperationsInput | string;
    readBy?: Prisma.AlertUpdatereadByInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AlertCreateManyInput = {
    id?: string;
    orgId: string;
    branchId?: string | null;
    kind: string;
    severity?: string;
    title: string;
    body?: string | null;
    link?: string | null;
    refType?: string | null;
    refId?: string | null;
    dedupeKey: string;
    readBy?: Prisma.AlertCreatereadByInput | string[];
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
};
export type AlertUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    severity?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    link?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dedupeKey?: Prisma.StringFieldUpdateOperationsInput | string;
    readBy?: Prisma.AlertUpdatereadByInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AlertUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    severity?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    link?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dedupeKey?: Prisma.StringFieldUpdateOperationsInput | string;
    readBy?: Prisma.AlertUpdatereadByInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AlertOrgIdDedupeKeyCompoundUniqueInput = {
    orgId: string;
    dedupeKey: string;
};
export type AlertCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    severity?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    link?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    dedupeKey?: Prisma.SortOrder;
    readBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
};
export type AlertMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    severity?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    link?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    dedupeKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
};
export type AlertMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    severity?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    link?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    dedupeKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
};
export type AlertCreatereadByInput = {
    set: string[];
};
export type AlertUpdatereadByInput = {
    set?: string[];
    push?: string | string[];
};
export type AlertSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    kind?: boolean;
    severity?: boolean;
    title?: boolean;
    body?: boolean;
    link?: boolean;
    refType?: boolean;
    refId?: boolean;
    dedupeKey?: boolean;
    readBy?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
}, ExtArgs["result"]["alert"]>;
export type AlertSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    kind?: boolean;
    severity?: boolean;
    title?: boolean;
    body?: boolean;
    link?: boolean;
    refType?: boolean;
    refId?: boolean;
    dedupeKey?: boolean;
    readBy?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
}, ExtArgs["result"]["alert"]>;
export type AlertSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    kind?: boolean;
    severity?: boolean;
    title?: boolean;
    body?: boolean;
    link?: boolean;
    refType?: boolean;
    refId?: boolean;
    dedupeKey?: boolean;
    readBy?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
}, ExtArgs["result"]["alert"]>;
export type AlertSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    kind?: boolean;
    severity?: boolean;
    title?: boolean;
    body?: boolean;
    link?: boolean;
    refType?: boolean;
    refId?: boolean;
    dedupeKey?: boolean;
    readBy?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
};
export type AlertOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "kind" | "severity" | "title" | "body" | "link" | "refType" | "refId" | "dedupeKey" | "readBy" | "createdAt" | "resolvedAt", ExtArgs["result"]["alert"]>;
export type $AlertPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Alert";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string | null;
        kind: string;
        severity: string;
        title: string;
        body: string | null;
        link: string | null;
        refType: string | null;
        refId: string | null;
        dedupeKey: string;
        readBy: string[];
        createdAt: Date;
        resolvedAt: Date | null;
    }, ExtArgs["result"]["alert"]>;
    composites: {};
};
export type AlertGetPayload<S extends boolean | null | undefined | AlertDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AlertPayload, S>;
export type AlertCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AlertFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AlertCountAggregateInputType | true;
};
export interface AlertDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Alert'];
        meta: {
            name: 'Alert';
        };
    };
    findUnique<T extends AlertFindUniqueArgs>(args: Prisma.SelectSubset<T, AlertFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AlertClient<runtime.Types.Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AlertFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AlertFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AlertClient<runtime.Types.Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AlertFindFirstArgs>(args?: Prisma.SelectSubset<T, AlertFindFirstArgs<ExtArgs>>): Prisma.Prisma__AlertClient<runtime.Types.Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AlertFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AlertFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AlertClient<runtime.Types.Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AlertFindManyArgs>(args?: Prisma.SelectSubset<T, AlertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AlertCreateArgs>(args: Prisma.SelectSubset<T, AlertCreateArgs<ExtArgs>>): Prisma.Prisma__AlertClient<runtime.Types.Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AlertCreateManyArgs>(args?: Prisma.SelectSubset<T, AlertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends AlertCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AlertCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends AlertDeleteArgs>(args: Prisma.SelectSubset<T, AlertDeleteArgs<ExtArgs>>): Prisma.Prisma__AlertClient<runtime.Types.Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AlertUpdateArgs>(args: Prisma.SelectSubset<T, AlertUpdateArgs<ExtArgs>>): Prisma.Prisma__AlertClient<runtime.Types.Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AlertDeleteManyArgs>(args?: Prisma.SelectSubset<T, AlertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AlertUpdateManyArgs>(args: Prisma.SelectSubset<T, AlertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends AlertUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AlertUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends AlertUpsertArgs>(args: Prisma.SelectSubset<T, AlertUpsertArgs<ExtArgs>>): Prisma.Prisma__AlertClient<runtime.Types.Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AlertCountArgs>(args?: Prisma.Subset<T, AlertCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AlertCountAggregateOutputType> : number>;
    aggregate<T extends AlertAggregateArgs>(args: Prisma.Subset<T, AlertAggregateArgs>): Prisma.PrismaPromise<GetAlertAggregateType<T>>;
    groupBy<T extends AlertGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AlertGroupByArgs['orderBy'];
    } : {
        orderBy?: AlertGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AlertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AlertFieldRefs;
}
export interface Prisma__AlertClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AlertFieldRefs {
    readonly id: Prisma.FieldRef<"Alert", 'String'>;
    readonly orgId: Prisma.FieldRef<"Alert", 'String'>;
    readonly branchId: Prisma.FieldRef<"Alert", 'String'>;
    readonly kind: Prisma.FieldRef<"Alert", 'String'>;
    readonly severity: Prisma.FieldRef<"Alert", 'String'>;
    readonly title: Prisma.FieldRef<"Alert", 'String'>;
    readonly body: Prisma.FieldRef<"Alert", 'String'>;
    readonly link: Prisma.FieldRef<"Alert", 'String'>;
    readonly refType: Prisma.FieldRef<"Alert", 'String'>;
    readonly refId: Prisma.FieldRef<"Alert", 'String'>;
    readonly dedupeKey: Prisma.FieldRef<"Alert", 'String'>;
    readonly readBy: Prisma.FieldRef<"Alert", 'String[]'>;
    readonly createdAt: Prisma.FieldRef<"Alert", 'DateTime'>;
    readonly resolvedAt: Prisma.FieldRef<"Alert", 'DateTime'>;
}
export type AlertFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AlertSelect<ExtArgs> | null;
    omit?: Prisma.AlertOmit<ExtArgs> | null;
    where: Prisma.AlertWhereUniqueInput;
};
export type AlertFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AlertSelect<ExtArgs> | null;
    omit?: Prisma.AlertOmit<ExtArgs> | null;
    where: Prisma.AlertWhereUniqueInput;
};
export type AlertFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AlertSelect<ExtArgs> | null;
    omit?: Prisma.AlertOmit<ExtArgs> | null;
    where?: Prisma.AlertWhereInput;
    orderBy?: Prisma.AlertOrderByWithRelationInput | Prisma.AlertOrderByWithRelationInput[];
    cursor?: Prisma.AlertWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AlertScalarFieldEnum | Prisma.AlertScalarFieldEnum[];
};
export type AlertFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AlertSelect<ExtArgs> | null;
    omit?: Prisma.AlertOmit<ExtArgs> | null;
    where?: Prisma.AlertWhereInput;
    orderBy?: Prisma.AlertOrderByWithRelationInput | Prisma.AlertOrderByWithRelationInput[];
    cursor?: Prisma.AlertWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AlertScalarFieldEnum | Prisma.AlertScalarFieldEnum[];
};
export type AlertFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AlertSelect<ExtArgs> | null;
    omit?: Prisma.AlertOmit<ExtArgs> | null;
    where?: Prisma.AlertWhereInput;
    orderBy?: Prisma.AlertOrderByWithRelationInput | Prisma.AlertOrderByWithRelationInput[];
    cursor?: Prisma.AlertWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AlertScalarFieldEnum | Prisma.AlertScalarFieldEnum[];
};
export type AlertCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AlertSelect<ExtArgs> | null;
    omit?: Prisma.AlertOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AlertCreateInput, Prisma.AlertUncheckedCreateInput>;
};
export type AlertCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AlertCreateManyInput | Prisma.AlertCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AlertCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AlertSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AlertOmit<ExtArgs> | null;
    data: Prisma.AlertCreateManyInput | Prisma.AlertCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AlertUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AlertSelect<ExtArgs> | null;
    omit?: Prisma.AlertOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AlertUpdateInput, Prisma.AlertUncheckedUpdateInput>;
    where: Prisma.AlertWhereUniqueInput;
};
export type AlertUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AlertUpdateManyMutationInput, Prisma.AlertUncheckedUpdateManyInput>;
    where?: Prisma.AlertWhereInput;
    limit?: number;
};
export type AlertUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AlertSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AlertOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AlertUpdateManyMutationInput, Prisma.AlertUncheckedUpdateManyInput>;
    where?: Prisma.AlertWhereInput;
    limit?: number;
};
export type AlertUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AlertSelect<ExtArgs> | null;
    omit?: Prisma.AlertOmit<ExtArgs> | null;
    where: Prisma.AlertWhereUniqueInput;
    create: Prisma.XOR<Prisma.AlertCreateInput, Prisma.AlertUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AlertUpdateInput, Prisma.AlertUncheckedUpdateInput>;
};
export type AlertDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AlertSelect<ExtArgs> | null;
    omit?: Prisma.AlertOmit<ExtArgs> | null;
    where: Prisma.AlertWhereUniqueInput;
};
export type AlertDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AlertWhereInput;
    limit?: number;
};
export type AlertDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AlertSelect<ExtArgs> | null;
    omit?: Prisma.AlertOmit<ExtArgs> | null;
};
