import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type IntegrationClientModel = runtime.Types.Result.DefaultSelection<Prisma.$IntegrationClientPayload>;
export type AggregateIntegrationClient = {
    _count: IntegrationClientCountAggregateOutputType | null;
    _min: IntegrationClientMinAggregateOutputType | null;
    _max: IntegrationClientMaxAggregateOutputType | null;
};
export type IntegrationClientMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    key: string | null;
    secretEnc: string | null;
    source: string | null;
    kiorexBaseUrl: string | null;
    webhookSecretEnc: string | null;
    active: boolean | null;
    createdAt: Date | null;
};
export type IntegrationClientMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    key: string | null;
    secretEnc: string | null;
    source: string | null;
    kiorexBaseUrl: string | null;
    webhookSecretEnc: string | null;
    active: boolean | null;
    createdAt: Date | null;
};
export type IntegrationClientCountAggregateOutputType = {
    id: number;
    orgId: number;
    key: number;
    secretEnc: number;
    source: number;
    kiorexBaseUrl: number;
    webhookSecretEnc: number;
    active: number;
    createdAt: number;
    _all: number;
};
export type IntegrationClientMinAggregateInputType = {
    id?: true;
    orgId?: true;
    key?: true;
    secretEnc?: true;
    source?: true;
    kiorexBaseUrl?: true;
    webhookSecretEnc?: true;
    active?: true;
    createdAt?: true;
};
export type IntegrationClientMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    key?: true;
    secretEnc?: true;
    source?: true;
    kiorexBaseUrl?: true;
    webhookSecretEnc?: true;
    active?: true;
    createdAt?: true;
};
export type IntegrationClientCountAggregateInputType = {
    id?: true;
    orgId?: true;
    key?: true;
    secretEnc?: true;
    source?: true;
    kiorexBaseUrl?: true;
    webhookSecretEnc?: true;
    active?: true;
    createdAt?: true;
    _all?: true;
};
export type IntegrationClientAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IntegrationClientWhereInput;
    orderBy?: Prisma.IntegrationClientOrderByWithRelationInput | Prisma.IntegrationClientOrderByWithRelationInput[];
    cursor?: Prisma.IntegrationClientWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | IntegrationClientCountAggregateInputType;
    _min?: IntegrationClientMinAggregateInputType;
    _max?: IntegrationClientMaxAggregateInputType;
};
export type GetIntegrationClientAggregateType<T extends IntegrationClientAggregateArgs> = {
    [P in keyof T & keyof AggregateIntegrationClient]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateIntegrationClient[P]> : Prisma.GetScalarType<T[P], AggregateIntegrationClient[P]>;
};
export type IntegrationClientGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IntegrationClientWhereInput;
    orderBy?: Prisma.IntegrationClientOrderByWithAggregationInput | Prisma.IntegrationClientOrderByWithAggregationInput[];
    by: Prisma.IntegrationClientScalarFieldEnum[] | Prisma.IntegrationClientScalarFieldEnum;
    having?: Prisma.IntegrationClientScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: IntegrationClientCountAggregateInputType | true;
    _min?: IntegrationClientMinAggregateInputType;
    _max?: IntegrationClientMaxAggregateInputType;
};
export type IntegrationClientGroupByOutputType = {
    id: string;
    orgId: string;
    key: string;
    secretEnc: string;
    source: string;
    kiorexBaseUrl: string | null;
    webhookSecretEnc: string | null;
    active: boolean;
    createdAt: Date;
    _count: IntegrationClientCountAggregateOutputType | null;
    _min: IntegrationClientMinAggregateOutputType | null;
    _max: IntegrationClientMaxAggregateOutputType | null;
};
export type GetIntegrationClientGroupByPayload<T extends IntegrationClientGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<IntegrationClientGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof IntegrationClientGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], IntegrationClientGroupByOutputType[P]> : Prisma.GetScalarType<T[P], IntegrationClientGroupByOutputType[P]>;
}>>;
export type IntegrationClientWhereInput = {
    AND?: Prisma.IntegrationClientWhereInput | Prisma.IntegrationClientWhereInput[];
    OR?: Prisma.IntegrationClientWhereInput[];
    NOT?: Prisma.IntegrationClientWhereInput | Prisma.IntegrationClientWhereInput[];
    id?: Prisma.StringFilter<"IntegrationClient"> | string;
    orgId?: Prisma.StringFilter<"IntegrationClient"> | string;
    key?: Prisma.StringFilter<"IntegrationClient"> | string;
    secretEnc?: Prisma.StringFilter<"IntegrationClient"> | string;
    source?: Prisma.StringFilter<"IntegrationClient"> | string;
    kiorexBaseUrl?: Prisma.StringNullableFilter<"IntegrationClient"> | string | null;
    webhookSecretEnc?: Prisma.StringNullableFilter<"IntegrationClient"> | string | null;
    active?: Prisma.BoolFilter<"IntegrationClient"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"IntegrationClient"> | Date | string;
};
export type IntegrationClientOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    secretEnc?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    kiorexBaseUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    webhookSecretEnc?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type IntegrationClientWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    key?: string;
    AND?: Prisma.IntegrationClientWhereInput | Prisma.IntegrationClientWhereInput[];
    OR?: Prisma.IntegrationClientWhereInput[];
    NOT?: Prisma.IntegrationClientWhereInput | Prisma.IntegrationClientWhereInput[];
    orgId?: Prisma.StringFilter<"IntegrationClient"> | string;
    secretEnc?: Prisma.StringFilter<"IntegrationClient"> | string;
    source?: Prisma.StringFilter<"IntegrationClient"> | string;
    kiorexBaseUrl?: Prisma.StringNullableFilter<"IntegrationClient"> | string | null;
    webhookSecretEnc?: Prisma.StringNullableFilter<"IntegrationClient"> | string | null;
    active?: Prisma.BoolFilter<"IntegrationClient"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"IntegrationClient"> | Date | string;
}, "id" | "key">;
export type IntegrationClientOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    secretEnc?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    kiorexBaseUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    webhookSecretEnc?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.IntegrationClientCountOrderByAggregateInput;
    _max?: Prisma.IntegrationClientMaxOrderByAggregateInput;
    _min?: Prisma.IntegrationClientMinOrderByAggregateInput;
};
export type IntegrationClientScalarWhereWithAggregatesInput = {
    AND?: Prisma.IntegrationClientScalarWhereWithAggregatesInput | Prisma.IntegrationClientScalarWhereWithAggregatesInput[];
    OR?: Prisma.IntegrationClientScalarWhereWithAggregatesInput[];
    NOT?: Prisma.IntegrationClientScalarWhereWithAggregatesInput | Prisma.IntegrationClientScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"IntegrationClient"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"IntegrationClient"> | string;
    key?: Prisma.StringWithAggregatesFilter<"IntegrationClient"> | string;
    secretEnc?: Prisma.StringWithAggregatesFilter<"IntegrationClient"> | string;
    source?: Prisma.StringWithAggregatesFilter<"IntegrationClient"> | string;
    kiorexBaseUrl?: Prisma.StringNullableWithAggregatesFilter<"IntegrationClient"> | string | null;
    webhookSecretEnc?: Prisma.StringNullableWithAggregatesFilter<"IntegrationClient"> | string | null;
    active?: Prisma.BoolWithAggregatesFilter<"IntegrationClient"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"IntegrationClient"> | Date | string;
};
export type IntegrationClientCreateInput = {
    id?: string;
    orgId: string;
    key: string;
    secretEnc: string;
    source?: string;
    kiorexBaseUrl?: string | null;
    webhookSecretEnc?: string | null;
    active?: boolean;
    createdAt?: Date | string;
};
export type IntegrationClientUncheckedCreateInput = {
    id?: string;
    orgId: string;
    key: string;
    secretEnc: string;
    source?: string;
    kiorexBaseUrl?: string | null;
    webhookSecretEnc?: string | null;
    active?: boolean;
    createdAt?: Date | string;
};
export type IntegrationClientUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    secretEnc?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    kiorexBaseUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    webhookSecretEnc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IntegrationClientUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    secretEnc?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    kiorexBaseUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    webhookSecretEnc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IntegrationClientCreateManyInput = {
    id?: string;
    orgId: string;
    key: string;
    secretEnc: string;
    source?: string;
    kiorexBaseUrl?: string | null;
    webhookSecretEnc?: string | null;
    active?: boolean;
    createdAt?: Date | string;
};
export type IntegrationClientUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    secretEnc?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    kiorexBaseUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    webhookSecretEnc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IntegrationClientUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    secretEnc?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    kiorexBaseUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    webhookSecretEnc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IntegrationClientCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    secretEnc?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    kiorexBaseUrl?: Prisma.SortOrder;
    webhookSecretEnc?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type IntegrationClientMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    secretEnc?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    kiorexBaseUrl?: Prisma.SortOrder;
    webhookSecretEnc?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type IntegrationClientMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    secretEnc?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    kiorexBaseUrl?: Prisma.SortOrder;
    webhookSecretEnc?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type IntegrationClientSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    key?: boolean;
    secretEnc?: boolean;
    source?: boolean;
    kiorexBaseUrl?: boolean;
    webhookSecretEnc?: boolean;
    active?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["integrationClient"]>;
export type IntegrationClientSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    key?: boolean;
    secretEnc?: boolean;
    source?: boolean;
    kiorexBaseUrl?: boolean;
    webhookSecretEnc?: boolean;
    active?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["integrationClient"]>;
export type IntegrationClientSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    key?: boolean;
    secretEnc?: boolean;
    source?: boolean;
    kiorexBaseUrl?: boolean;
    webhookSecretEnc?: boolean;
    active?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["integrationClient"]>;
export type IntegrationClientSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    key?: boolean;
    secretEnc?: boolean;
    source?: boolean;
    kiorexBaseUrl?: boolean;
    webhookSecretEnc?: boolean;
    active?: boolean;
    createdAt?: boolean;
};
export type IntegrationClientOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "key" | "secretEnc" | "source" | "kiorexBaseUrl" | "webhookSecretEnc" | "active" | "createdAt", ExtArgs["result"]["integrationClient"]>;
export type $IntegrationClientPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "IntegrationClient";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        key: string;
        secretEnc: string;
        source: string;
        kiorexBaseUrl: string | null;
        webhookSecretEnc: string | null;
        active: boolean;
        createdAt: Date;
    }, ExtArgs["result"]["integrationClient"]>;
    composites: {};
};
export type IntegrationClientGetPayload<S extends boolean | null | undefined | IntegrationClientDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$IntegrationClientPayload, S>;
export type IntegrationClientCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<IntegrationClientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: IntegrationClientCountAggregateInputType | true;
};
export interface IntegrationClientDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['IntegrationClient'];
        meta: {
            name: 'IntegrationClient';
        };
    };
    findUnique<T extends IntegrationClientFindUniqueArgs>(args: Prisma.SelectSubset<T, IntegrationClientFindUniqueArgs<ExtArgs>>): Prisma.Prisma__IntegrationClientClient<runtime.Types.Result.GetResult<Prisma.$IntegrationClientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends IntegrationClientFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, IntegrationClientFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__IntegrationClientClient<runtime.Types.Result.GetResult<Prisma.$IntegrationClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends IntegrationClientFindFirstArgs>(args?: Prisma.SelectSubset<T, IntegrationClientFindFirstArgs<ExtArgs>>): Prisma.Prisma__IntegrationClientClient<runtime.Types.Result.GetResult<Prisma.$IntegrationClientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends IntegrationClientFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, IntegrationClientFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__IntegrationClientClient<runtime.Types.Result.GetResult<Prisma.$IntegrationClientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends IntegrationClientFindManyArgs>(args?: Prisma.SelectSubset<T, IntegrationClientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IntegrationClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends IntegrationClientCreateArgs>(args: Prisma.SelectSubset<T, IntegrationClientCreateArgs<ExtArgs>>): Prisma.Prisma__IntegrationClientClient<runtime.Types.Result.GetResult<Prisma.$IntegrationClientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends IntegrationClientCreateManyArgs>(args?: Prisma.SelectSubset<T, IntegrationClientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends IntegrationClientCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, IntegrationClientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IntegrationClientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends IntegrationClientDeleteArgs>(args: Prisma.SelectSubset<T, IntegrationClientDeleteArgs<ExtArgs>>): Prisma.Prisma__IntegrationClientClient<runtime.Types.Result.GetResult<Prisma.$IntegrationClientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends IntegrationClientUpdateArgs>(args: Prisma.SelectSubset<T, IntegrationClientUpdateArgs<ExtArgs>>): Prisma.Prisma__IntegrationClientClient<runtime.Types.Result.GetResult<Prisma.$IntegrationClientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends IntegrationClientDeleteManyArgs>(args?: Prisma.SelectSubset<T, IntegrationClientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends IntegrationClientUpdateManyArgs>(args: Prisma.SelectSubset<T, IntegrationClientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends IntegrationClientUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, IntegrationClientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IntegrationClientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends IntegrationClientUpsertArgs>(args: Prisma.SelectSubset<T, IntegrationClientUpsertArgs<ExtArgs>>): Prisma.Prisma__IntegrationClientClient<runtime.Types.Result.GetResult<Prisma.$IntegrationClientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends IntegrationClientCountArgs>(args?: Prisma.Subset<T, IntegrationClientCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], IntegrationClientCountAggregateOutputType> : number>;
    aggregate<T extends IntegrationClientAggregateArgs>(args: Prisma.Subset<T, IntegrationClientAggregateArgs>): Prisma.PrismaPromise<GetIntegrationClientAggregateType<T>>;
    groupBy<T extends IntegrationClientGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: IntegrationClientGroupByArgs['orderBy'];
    } : {
        orderBy?: IntegrationClientGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, IntegrationClientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIntegrationClientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: IntegrationClientFieldRefs;
}
export interface Prisma__IntegrationClientClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface IntegrationClientFieldRefs {
    readonly id: Prisma.FieldRef<"IntegrationClient", 'String'>;
    readonly orgId: Prisma.FieldRef<"IntegrationClient", 'String'>;
    readonly key: Prisma.FieldRef<"IntegrationClient", 'String'>;
    readonly secretEnc: Prisma.FieldRef<"IntegrationClient", 'String'>;
    readonly source: Prisma.FieldRef<"IntegrationClient", 'String'>;
    readonly kiorexBaseUrl: Prisma.FieldRef<"IntegrationClient", 'String'>;
    readonly webhookSecretEnc: Prisma.FieldRef<"IntegrationClient", 'String'>;
    readonly active: Prisma.FieldRef<"IntegrationClient", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"IntegrationClient", 'DateTime'>;
}
export type IntegrationClientFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IntegrationClientSelect<ExtArgs> | null;
    omit?: Prisma.IntegrationClientOmit<ExtArgs> | null;
    where: Prisma.IntegrationClientWhereUniqueInput;
};
export type IntegrationClientFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IntegrationClientSelect<ExtArgs> | null;
    omit?: Prisma.IntegrationClientOmit<ExtArgs> | null;
    where: Prisma.IntegrationClientWhereUniqueInput;
};
export type IntegrationClientFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IntegrationClientSelect<ExtArgs> | null;
    omit?: Prisma.IntegrationClientOmit<ExtArgs> | null;
    where?: Prisma.IntegrationClientWhereInput;
    orderBy?: Prisma.IntegrationClientOrderByWithRelationInput | Prisma.IntegrationClientOrderByWithRelationInput[];
    cursor?: Prisma.IntegrationClientWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IntegrationClientScalarFieldEnum | Prisma.IntegrationClientScalarFieldEnum[];
};
export type IntegrationClientFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IntegrationClientSelect<ExtArgs> | null;
    omit?: Prisma.IntegrationClientOmit<ExtArgs> | null;
    where?: Prisma.IntegrationClientWhereInput;
    orderBy?: Prisma.IntegrationClientOrderByWithRelationInput | Prisma.IntegrationClientOrderByWithRelationInput[];
    cursor?: Prisma.IntegrationClientWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IntegrationClientScalarFieldEnum | Prisma.IntegrationClientScalarFieldEnum[];
};
export type IntegrationClientFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IntegrationClientSelect<ExtArgs> | null;
    omit?: Prisma.IntegrationClientOmit<ExtArgs> | null;
    where?: Prisma.IntegrationClientWhereInput;
    orderBy?: Prisma.IntegrationClientOrderByWithRelationInput | Prisma.IntegrationClientOrderByWithRelationInput[];
    cursor?: Prisma.IntegrationClientWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IntegrationClientScalarFieldEnum | Prisma.IntegrationClientScalarFieldEnum[];
};
export type IntegrationClientCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IntegrationClientSelect<ExtArgs> | null;
    omit?: Prisma.IntegrationClientOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IntegrationClientCreateInput, Prisma.IntegrationClientUncheckedCreateInput>;
};
export type IntegrationClientCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.IntegrationClientCreateManyInput | Prisma.IntegrationClientCreateManyInput[];
    skipDuplicates?: boolean;
};
export type IntegrationClientCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IntegrationClientSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.IntegrationClientOmit<ExtArgs> | null;
    data: Prisma.IntegrationClientCreateManyInput | Prisma.IntegrationClientCreateManyInput[];
    skipDuplicates?: boolean;
};
export type IntegrationClientUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IntegrationClientSelect<ExtArgs> | null;
    omit?: Prisma.IntegrationClientOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IntegrationClientUpdateInput, Prisma.IntegrationClientUncheckedUpdateInput>;
    where: Prisma.IntegrationClientWhereUniqueInput;
};
export type IntegrationClientUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.IntegrationClientUpdateManyMutationInput, Prisma.IntegrationClientUncheckedUpdateManyInput>;
    where?: Prisma.IntegrationClientWhereInput;
    limit?: number;
};
export type IntegrationClientUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IntegrationClientSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.IntegrationClientOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IntegrationClientUpdateManyMutationInput, Prisma.IntegrationClientUncheckedUpdateManyInput>;
    where?: Prisma.IntegrationClientWhereInput;
    limit?: number;
};
export type IntegrationClientUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IntegrationClientSelect<ExtArgs> | null;
    omit?: Prisma.IntegrationClientOmit<ExtArgs> | null;
    where: Prisma.IntegrationClientWhereUniqueInput;
    create: Prisma.XOR<Prisma.IntegrationClientCreateInput, Prisma.IntegrationClientUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.IntegrationClientUpdateInput, Prisma.IntegrationClientUncheckedUpdateInput>;
};
export type IntegrationClientDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IntegrationClientSelect<ExtArgs> | null;
    omit?: Prisma.IntegrationClientOmit<ExtArgs> | null;
    where: Prisma.IntegrationClientWhereUniqueInput;
};
export type IntegrationClientDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IntegrationClientWhereInput;
    limit?: number;
};
export type IntegrationClientDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IntegrationClientSelect<ExtArgs> | null;
    omit?: Prisma.IntegrationClientOmit<ExtArgs> | null;
};
