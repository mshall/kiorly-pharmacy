import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type WalletEntryModel = runtime.Types.Result.DefaultSelection<Prisma.$WalletEntryPayload>;
export type AggregateWalletEntry = {
    _count: WalletEntryCountAggregateOutputType | null;
    _avg: WalletEntryAvgAggregateOutputType | null;
    _sum: WalletEntrySumAggregateOutputType | null;
    _min: WalletEntryMinAggregateOutputType | null;
    _max: WalletEntryMaxAggregateOutputType | null;
};
export type WalletEntryAvgAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type WalletEntrySumAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type WalletEntryMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    amount: runtime.Decimal | null;
    kind: string | null;
    refType: string | null;
    refId: string | null;
    idempotencyKey: string | null;
    createdAt: Date | null;
};
export type WalletEntryMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    amount: runtime.Decimal | null;
    kind: string | null;
    refType: string | null;
    refId: string | null;
    idempotencyKey: string | null;
    createdAt: Date | null;
};
export type WalletEntryCountAggregateOutputType = {
    id: number;
    orgId: number;
    amount: number;
    kind: number;
    refType: number;
    refId: number;
    idempotencyKey: number;
    createdAt: number;
    _all: number;
};
export type WalletEntryAvgAggregateInputType = {
    amount?: true;
};
export type WalletEntrySumAggregateInputType = {
    amount?: true;
};
export type WalletEntryMinAggregateInputType = {
    id?: true;
    orgId?: true;
    amount?: true;
    kind?: true;
    refType?: true;
    refId?: true;
    idempotencyKey?: true;
    createdAt?: true;
};
export type WalletEntryMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    amount?: true;
    kind?: true;
    refType?: true;
    refId?: true;
    idempotencyKey?: true;
    createdAt?: true;
};
export type WalletEntryCountAggregateInputType = {
    id?: true;
    orgId?: true;
    amount?: true;
    kind?: true;
    refType?: true;
    refId?: true;
    idempotencyKey?: true;
    createdAt?: true;
    _all?: true;
};
export type WalletEntryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WalletEntryWhereInput;
    orderBy?: Prisma.WalletEntryOrderByWithRelationInput | Prisma.WalletEntryOrderByWithRelationInput[];
    cursor?: Prisma.WalletEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WalletEntryCountAggregateInputType;
    _avg?: WalletEntryAvgAggregateInputType;
    _sum?: WalletEntrySumAggregateInputType;
    _min?: WalletEntryMinAggregateInputType;
    _max?: WalletEntryMaxAggregateInputType;
};
export type GetWalletEntryAggregateType<T extends WalletEntryAggregateArgs> = {
    [P in keyof T & keyof AggregateWalletEntry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWalletEntry[P]> : Prisma.GetScalarType<T[P], AggregateWalletEntry[P]>;
};
export type WalletEntryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WalletEntryWhereInput;
    orderBy?: Prisma.WalletEntryOrderByWithAggregationInput | Prisma.WalletEntryOrderByWithAggregationInput[];
    by: Prisma.WalletEntryScalarFieldEnum[] | Prisma.WalletEntryScalarFieldEnum;
    having?: Prisma.WalletEntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WalletEntryCountAggregateInputType | true;
    _avg?: WalletEntryAvgAggregateInputType;
    _sum?: WalletEntrySumAggregateInputType;
    _min?: WalletEntryMinAggregateInputType;
    _max?: WalletEntryMaxAggregateInputType;
};
export type WalletEntryGroupByOutputType = {
    id: string;
    orgId: string;
    amount: runtime.Decimal;
    kind: string;
    refType: string | null;
    refId: string | null;
    idempotencyKey: string;
    createdAt: Date;
    _count: WalletEntryCountAggregateOutputType | null;
    _avg: WalletEntryAvgAggregateOutputType | null;
    _sum: WalletEntrySumAggregateOutputType | null;
    _min: WalletEntryMinAggregateOutputType | null;
    _max: WalletEntryMaxAggregateOutputType | null;
};
export type GetWalletEntryGroupByPayload<T extends WalletEntryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WalletEntryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WalletEntryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WalletEntryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WalletEntryGroupByOutputType[P]>;
}>>;
export type WalletEntryWhereInput = {
    AND?: Prisma.WalletEntryWhereInput | Prisma.WalletEntryWhereInput[];
    OR?: Prisma.WalletEntryWhereInput[];
    NOT?: Prisma.WalletEntryWhereInput | Prisma.WalletEntryWhereInput[];
    id?: Prisma.StringFilter<"WalletEntry"> | string;
    orgId?: Prisma.StringFilter<"WalletEntry"> | string;
    amount?: Prisma.DecimalFilter<"WalletEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    kind?: Prisma.StringFilter<"WalletEntry"> | string;
    refType?: Prisma.StringNullableFilter<"WalletEntry"> | string | null;
    refId?: Prisma.StringNullableFilter<"WalletEntry"> | string | null;
    idempotencyKey?: Prisma.StringFilter<"WalletEntry"> | string;
    createdAt?: Prisma.DateTimeFilter<"WalletEntry"> | Date | string;
};
export type WalletEntryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    refType?: Prisma.SortOrderInput | Prisma.SortOrder;
    refId?: Prisma.SortOrderInput | Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WalletEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId_idempotencyKey?: Prisma.WalletEntryOrgIdIdempotencyKeyCompoundUniqueInput;
    AND?: Prisma.WalletEntryWhereInput | Prisma.WalletEntryWhereInput[];
    OR?: Prisma.WalletEntryWhereInput[];
    NOT?: Prisma.WalletEntryWhereInput | Prisma.WalletEntryWhereInput[];
    orgId?: Prisma.StringFilter<"WalletEntry"> | string;
    amount?: Prisma.DecimalFilter<"WalletEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    kind?: Prisma.StringFilter<"WalletEntry"> | string;
    refType?: Prisma.StringNullableFilter<"WalletEntry"> | string | null;
    refId?: Prisma.StringNullableFilter<"WalletEntry"> | string | null;
    idempotencyKey?: Prisma.StringFilter<"WalletEntry"> | string;
    createdAt?: Prisma.DateTimeFilter<"WalletEntry"> | Date | string;
}, "id" | "orgId_idempotencyKey">;
export type WalletEntryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    refType?: Prisma.SortOrderInput | Prisma.SortOrder;
    refId?: Prisma.SortOrderInput | Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.WalletEntryCountOrderByAggregateInput;
    _avg?: Prisma.WalletEntryAvgOrderByAggregateInput;
    _max?: Prisma.WalletEntryMaxOrderByAggregateInput;
    _min?: Prisma.WalletEntryMinOrderByAggregateInput;
    _sum?: Prisma.WalletEntrySumOrderByAggregateInput;
};
export type WalletEntryScalarWhereWithAggregatesInput = {
    AND?: Prisma.WalletEntryScalarWhereWithAggregatesInput | Prisma.WalletEntryScalarWhereWithAggregatesInput[];
    OR?: Prisma.WalletEntryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WalletEntryScalarWhereWithAggregatesInput | Prisma.WalletEntryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"WalletEntry"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"WalletEntry"> | string;
    amount?: Prisma.DecimalWithAggregatesFilter<"WalletEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    kind?: Prisma.StringWithAggregatesFilter<"WalletEntry"> | string;
    refType?: Prisma.StringNullableWithAggregatesFilter<"WalletEntry"> | string | null;
    refId?: Prisma.StringNullableWithAggregatesFilter<"WalletEntry"> | string | null;
    idempotencyKey?: Prisma.StringWithAggregatesFilter<"WalletEntry"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"WalletEntry"> | Date | string;
};
export type WalletEntryCreateInput = {
    id?: string;
    orgId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    kind: string;
    refType?: string | null;
    refId?: string | null;
    idempotencyKey: string;
    createdAt?: Date | string;
};
export type WalletEntryUncheckedCreateInput = {
    id?: string;
    orgId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    kind: string;
    refType?: string | null;
    refId?: string | null;
    idempotencyKey: string;
    createdAt?: Date | string;
};
export type WalletEntryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WalletEntryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WalletEntryCreateManyInput = {
    id?: string;
    orgId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    kind: string;
    refType?: string | null;
    refId?: string | null;
    idempotencyKey: string;
    createdAt?: Date | string;
};
export type WalletEntryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WalletEntryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WalletEntryOrgIdIdempotencyKeyCompoundUniqueInput = {
    orgId: string;
    idempotencyKey: string;
};
export type WalletEntryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WalletEntryAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type WalletEntryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WalletEntryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WalletEntrySumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type WalletEntrySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    amount?: boolean;
    kind?: boolean;
    refType?: boolean;
    refId?: boolean;
    idempotencyKey?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["walletEntry"]>;
export type WalletEntrySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    amount?: boolean;
    kind?: boolean;
    refType?: boolean;
    refId?: boolean;
    idempotencyKey?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["walletEntry"]>;
export type WalletEntrySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    amount?: boolean;
    kind?: boolean;
    refType?: boolean;
    refId?: boolean;
    idempotencyKey?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["walletEntry"]>;
export type WalletEntrySelectScalar = {
    id?: boolean;
    orgId?: boolean;
    amount?: boolean;
    kind?: boolean;
    refType?: boolean;
    refId?: boolean;
    idempotencyKey?: boolean;
    createdAt?: boolean;
};
export type WalletEntryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "amount" | "kind" | "refType" | "refId" | "idempotencyKey" | "createdAt", ExtArgs["result"]["walletEntry"]>;
export type $WalletEntryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "WalletEntry";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        amount: runtime.Decimal;
        kind: string;
        refType: string | null;
        refId: string | null;
        idempotencyKey: string;
        createdAt: Date;
    }, ExtArgs["result"]["walletEntry"]>;
    composites: {};
};
export type WalletEntryGetPayload<S extends boolean | null | undefined | WalletEntryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WalletEntryPayload, S>;
export type WalletEntryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WalletEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WalletEntryCountAggregateInputType | true;
};
export interface WalletEntryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['WalletEntry'];
        meta: {
            name: 'WalletEntry';
        };
    };
    findUnique<T extends WalletEntryFindUniqueArgs>(args: Prisma.SelectSubset<T, WalletEntryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WalletEntryClient<runtime.Types.Result.GetResult<Prisma.$WalletEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WalletEntryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WalletEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WalletEntryClient<runtime.Types.Result.GetResult<Prisma.$WalletEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WalletEntryFindFirstArgs>(args?: Prisma.SelectSubset<T, WalletEntryFindFirstArgs<ExtArgs>>): Prisma.Prisma__WalletEntryClient<runtime.Types.Result.GetResult<Prisma.$WalletEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WalletEntryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WalletEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WalletEntryClient<runtime.Types.Result.GetResult<Prisma.$WalletEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WalletEntryFindManyArgs>(args?: Prisma.SelectSubset<T, WalletEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WalletEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WalletEntryCreateArgs>(args: Prisma.SelectSubset<T, WalletEntryCreateArgs<ExtArgs>>): Prisma.Prisma__WalletEntryClient<runtime.Types.Result.GetResult<Prisma.$WalletEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WalletEntryCreateManyArgs>(args?: Prisma.SelectSubset<T, WalletEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WalletEntryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WalletEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WalletEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WalletEntryDeleteArgs>(args: Prisma.SelectSubset<T, WalletEntryDeleteArgs<ExtArgs>>): Prisma.Prisma__WalletEntryClient<runtime.Types.Result.GetResult<Prisma.$WalletEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WalletEntryUpdateArgs>(args: Prisma.SelectSubset<T, WalletEntryUpdateArgs<ExtArgs>>): Prisma.Prisma__WalletEntryClient<runtime.Types.Result.GetResult<Prisma.$WalletEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WalletEntryDeleteManyArgs>(args?: Prisma.SelectSubset<T, WalletEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WalletEntryUpdateManyArgs>(args: Prisma.SelectSubset<T, WalletEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WalletEntryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WalletEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WalletEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WalletEntryUpsertArgs>(args: Prisma.SelectSubset<T, WalletEntryUpsertArgs<ExtArgs>>): Prisma.Prisma__WalletEntryClient<runtime.Types.Result.GetResult<Prisma.$WalletEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WalletEntryCountArgs>(args?: Prisma.Subset<T, WalletEntryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WalletEntryCountAggregateOutputType> : number>;
    aggregate<T extends WalletEntryAggregateArgs>(args: Prisma.Subset<T, WalletEntryAggregateArgs>): Prisma.PrismaPromise<GetWalletEntryAggregateType<T>>;
    groupBy<T extends WalletEntryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WalletEntryGroupByArgs['orderBy'];
    } : {
        orderBy?: WalletEntryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WalletEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWalletEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WalletEntryFieldRefs;
}
export interface Prisma__WalletEntryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WalletEntryFieldRefs {
    readonly id: Prisma.FieldRef<"WalletEntry", 'String'>;
    readonly orgId: Prisma.FieldRef<"WalletEntry", 'String'>;
    readonly amount: Prisma.FieldRef<"WalletEntry", 'Decimal'>;
    readonly kind: Prisma.FieldRef<"WalletEntry", 'String'>;
    readonly refType: Prisma.FieldRef<"WalletEntry", 'String'>;
    readonly refId: Prisma.FieldRef<"WalletEntry", 'String'>;
    readonly idempotencyKey: Prisma.FieldRef<"WalletEntry", 'String'>;
    readonly createdAt: Prisma.FieldRef<"WalletEntry", 'DateTime'>;
}
export type WalletEntryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WalletEntrySelect<ExtArgs> | null;
    omit?: Prisma.WalletEntryOmit<ExtArgs> | null;
    where: Prisma.WalletEntryWhereUniqueInput;
};
export type WalletEntryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WalletEntrySelect<ExtArgs> | null;
    omit?: Prisma.WalletEntryOmit<ExtArgs> | null;
    where: Prisma.WalletEntryWhereUniqueInput;
};
export type WalletEntryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WalletEntrySelect<ExtArgs> | null;
    omit?: Prisma.WalletEntryOmit<ExtArgs> | null;
    where?: Prisma.WalletEntryWhereInput;
    orderBy?: Prisma.WalletEntryOrderByWithRelationInput | Prisma.WalletEntryOrderByWithRelationInput[];
    cursor?: Prisma.WalletEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WalletEntryScalarFieldEnum | Prisma.WalletEntryScalarFieldEnum[];
};
export type WalletEntryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WalletEntrySelect<ExtArgs> | null;
    omit?: Prisma.WalletEntryOmit<ExtArgs> | null;
    where?: Prisma.WalletEntryWhereInput;
    orderBy?: Prisma.WalletEntryOrderByWithRelationInput | Prisma.WalletEntryOrderByWithRelationInput[];
    cursor?: Prisma.WalletEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WalletEntryScalarFieldEnum | Prisma.WalletEntryScalarFieldEnum[];
};
export type WalletEntryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WalletEntrySelect<ExtArgs> | null;
    omit?: Prisma.WalletEntryOmit<ExtArgs> | null;
    where?: Prisma.WalletEntryWhereInput;
    orderBy?: Prisma.WalletEntryOrderByWithRelationInput | Prisma.WalletEntryOrderByWithRelationInput[];
    cursor?: Prisma.WalletEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WalletEntryScalarFieldEnum | Prisma.WalletEntryScalarFieldEnum[];
};
export type WalletEntryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WalletEntrySelect<ExtArgs> | null;
    omit?: Prisma.WalletEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WalletEntryCreateInput, Prisma.WalletEntryUncheckedCreateInput>;
};
export type WalletEntryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WalletEntryCreateManyInput | Prisma.WalletEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WalletEntryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WalletEntrySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WalletEntryOmit<ExtArgs> | null;
    data: Prisma.WalletEntryCreateManyInput | Prisma.WalletEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WalletEntryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WalletEntrySelect<ExtArgs> | null;
    omit?: Prisma.WalletEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WalletEntryUpdateInput, Prisma.WalletEntryUncheckedUpdateInput>;
    where: Prisma.WalletEntryWhereUniqueInput;
};
export type WalletEntryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WalletEntryUpdateManyMutationInput, Prisma.WalletEntryUncheckedUpdateManyInput>;
    where?: Prisma.WalletEntryWhereInput;
    limit?: number;
};
export type WalletEntryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WalletEntrySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WalletEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WalletEntryUpdateManyMutationInput, Prisma.WalletEntryUncheckedUpdateManyInput>;
    where?: Prisma.WalletEntryWhereInput;
    limit?: number;
};
export type WalletEntryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WalletEntrySelect<ExtArgs> | null;
    omit?: Prisma.WalletEntryOmit<ExtArgs> | null;
    where: Prisma.WalletEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.WalletEntryCreateInput, Prisma.WalletEntryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WalletEntryUpdateInput, Prisma.WalletEntryUncheckedUpdateInput>;
};
export type WalletEntryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WalletEntrySelect<ExtArgs> | null;
    omit?: Prisma.WalletEntryOmit<ExtArgs> | null;
    where: Prisma.WalletEntryWhereUniqueInput;
};
export type WalletEntryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WalletEntryWhereInput;
    limit?: number;
};
export type WalletEntryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WalletEntrySelect<ExtArgs> | null;
    omit?: Prisma.WalletEntryOmit<ExtArgs> | null;
};
