import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type SettlementEntryModel = runtime.Types.Result.DefaultSelection<Prisma.$SettlementEntryPayload>;
export type AggregateSettlementEntry = {
    _count: SettlementEntryCountAggregateOutputType | null;
    _avg: SettlementEntryAvgAggregateOutputType | null;
    _sum: SettlementEntrySumAggregateOutputType | null;
    _min: SettlementEntryMinAggregateOutputType | null;
    _max: SettlementEntryMaxAggregateOutputType | null;
};
export type SettlementEntryAvgAggregateOutputType = {
    orderValue: runtime.Decimal | null;
    feeRate: runtime.Decimal | null;
    feeAmount: runtime.Decimal | null;
};
export type SettlementEntrySumAggregateOutputType = {
    orderValue: runtime.Decimal | null;
    feeRate: runtime.Decimal | null;
    feeAmount: runtime.Decimal | null;
};
export type SettlementEntryMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    orderRef: string | null;
    orderValue: runtime.Decimal | null;
    feeRate: runtime.Decimal | null;
    feeAmount: runtime.Decimal | null;
    currency: string | null;
    createdAt: Date | null;
};
export type SettlementEntryMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    orderRef: string | null;
    orderValue: runtime.Decimal | null;
    feeRate: runtime.Decimal | null;
    feeAmount: runtime.Decimal | null;
    currency: string | null;
    createdAt: Date | null;
};
export type SettlementEntryCountAggregateOutputType = {
    id: number;
    orgId: number;
    orderRef: number;
    orderValue: number;
    feeRate: number;
    feeAmount: number;
    currency: number;
    createdAt: number;
    _all: number;
};
export type SettlementEntryAvgAggregateInputType = {
    orderValue?: true;
    feeRate?: true;
    feeAmount?: true;
};
export type SettlementEntrySumAggregateInputType = {
    orderValue?: true;
    feeRate?: true;
    feeAmount?: true;
};
export type SettlementEntryMinAggregateInputType = {
    id?: true;
    orgId?: true;
    orderRef?: true;
    orderValue?: true;
    feeRate?: true;
    feeAmount?: true;
    currency?: true;
    createdAt?: true;
};
export type SettlementEntryMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    orderRef?: true;
    orderValue?: true;
    feeRate?: true;
    feeAmount?: true;
    currency?: true;
    createdAt?: true;
};
export type SettlementEntryCountAggregateInputType = {
    id?: true;
    orgId?: true;
    orderRef?: true;
    orderValue?: true;
    feeRate?: true;
    feeAmount?: true;
    currency?: true;
    createdAt?: true;
    _all?: true;
};
export type SettlementEntryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SettlementEntryWhereInput;
    orderBy?: Prisma.SettlementEntryOrderByWithRelationInput | Prisma.SettlementEntryOrderByWithRelationInput[];
    cursor?: Prisma.SettlementEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SettlementEntryCountAggregateInputType;
    _avg?: SettlementEntryAvgAggregateInputType;
    _sum?: SettlementEntrySumAggregateInputType;
    _min?: SettlementEntryMinAggregateInputType;
    _max?: SettlementEntryMaxAggregateInputType;
};
export type GetSettlementEntryAggregateType<T extends SettlementEntryAggregateArgs> = {
    [P in keyof T & keyof AggregateSettlementEntry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSettlementEntry[P]> : Prisma.GetScalarType<T[P], AggregateSettlementEntry[P]>;
};
export type SettlementEntryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SettlementEntryWhereInput;
    orderBy?: Prisma.SettlementEntryOrderByWithAggregationInput | Prisma.SettlementEntryOrderByWithAggregationInput[];
    by: Prisma.SettlementEntryScalarFieldEnum[] | Prisma.SettlementEntryScalarFieldEnum;
    having?: Prisma.SettlementEntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SettlementEntryCountAggregateInputType | true;
    _avg?: SettlementEntryAvgAggregateInputType;
    _sum?: SettlementEntrySumAggregateInputType;
    _min?: SettlementEntryMinAggregateInputType;
    _max?: SettlementEntryMaxAggregateInputType;
};
export type SettlementEntryGroupByOutputType = {
    id: string;
    orgId: string;
    orderRef: string;
    orderValue: runtime.Decimal;
    feeRate: runtime.Decimal;
    feeAmount: runtime.Decimal;
    currency: string;
    createdAt: Date;
    _count: SettlementEntryCountAggregateOutputType | null;
    _avg: SettlementEntryAvgAggregateOutputType | null;
    _sum: SettlementEntrySumAggregateOutputType | null;
    _min: SettlementEntryMinAggregateOutputType | null;
    _max: SettlementEntryMaxAggregateOutputType | null;
};
export type GetSettlementEntryGroupByPayload<T extends SettlementEntryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SettlementEntryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SettlementEntryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SettlementEntryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SettlementEntryGroupByOutputType[P]>;
}>>;
export type SettlementEntryWhereInput = {
    AND?: Prisma.SettlementEntryWhereInput | Prisma.SettlementEntryWhereInput[];
    OR?: Prisma.SettlementEntryWhereInput[];
    NOT?: Prisma.SettlementEntryWhereInput | Prisma.SettlementEntryWhereInput[];
    id?: Prisma.StringFilter<"SettlementEntry"> | string;
    orgId?: Prisma.StringFilter<"SettlementEntry"> | string;
    orderRef?: Prisma.StringFilter<"SettlementEntry"> | string;
    orderValue?: Prisma.DecimalFilter<"SettlementEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeRate?: Prisma.DecimalFilter<"SettlementEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeAmount?: Prisma.DecimalFilter<"SettlementEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    currency?: Prisma.StringFilter<"SettlementEntry"> | string;
    createdAt?: Prisma.DateTimeFilter<"SettlementEntry"> | Date | string;
};
export type SettlementEntryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    orderRef?: Prisma.SortOrder;
    orderValue?: Prisma.SortOrder;
    feeRate?: Prisma.SortOrder;
    feeAmount?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SettlementEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId_orderRef?: Prisma.SettlementEntryOrgIdOrderRefCompoundUniqueInput;
    AND?: Prisma.SettlementEntryWhereInput | Prisma.SettlementEntryWhereInput[];
    OR?: Prisma.SettlementEntryWhereInput[];
    NOT?: Prisma.SettlementEntryWhereInput | Prisma.SettlementEntryWhereInput[];
    orgId?: Prisma.StringFilter<"SettlementEntry"> | string;
    orderRef?: Prisma.StringFilter<"SettlementEntry"> | string;
    orderValue?: Prisma.DecimalFilter<"SettlementEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeRate?: Prisma.DecimalFilter<"SettlementEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeAmount?: Prisma.DecimalFilter<"SettlementEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    currency?: Prisma.StringFilter<"SettlementEntry"> | string;
    createdAt?: Prisma.DateTimeFilter<"SettlementEntry"> | Date | string;
}, "id" | "orgId_orderRef">;
export type SettlementEntryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    orderRef?: Prisma.SortOrder;
    orderValue?: Prisma.SortOrder;
    feeRate?: Prisma.SortOrder;
    feeAmount?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.SettlementEntryCountOrderByAggregateInput;
    _avg?: Prisma.SettlementEntryAvgOrderByAggregateInput;
    _max?: Prisma.SettlementEntryMaxOrderByAggregateInput;
    _min?: Prisma.SettlementEntryMinOrderByAggregateInput;
    _sum?: Prisma.SettlementEntrySumOrderByAggregateInput;
};
export type SettlementEntryScalarWhereWithAggregatesInput = {
    AND?: Prisma.SettlementEntryScalarWhereWithAggregatesInput | Prisma.SettlementEntryScalarWhereWithAggregatesInput[];
    OR?: Prisma.SettlementEntryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SettlementEntryScalarWhereWithAggregatesInput | Prisma.SettlementEntryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SettlementEntry"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"SettlementEntry"> | string;
    orderRef?: Prisma.StringWithAggregatesFilter<"SettlementEntry"> | string;
    orderValue?: Prisma.DecimalWithAggregatesFilter<"SettlementEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeRate?: Prisma.DecimalWithAggregatesFilter<"SettlementEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeAmount?: Prisma.DecimalWithAggregatesFilter<"SettlementEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    currency?: Prisma.StringWithAggregatesFilter<"SettlementEntry"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SettlementEntry"> | Date | string;
};
export type SettlementEntryCreateInput = {
    id?: string;
    orgId: string;
    orderRef: string;
    orderValue: runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeRate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    currency?: string;
    createdAt?: Date | string;
};
export type SettlementEntryUncheckedCreateInput = {
    id?: string;
    orgId: string;
    orderRef: string;
    orderValue: runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeRate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    currency?: string;
    createdAt?: Date | string;
};
export type SettlementEntryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderRef?: Prisma.StringFieldUpdateOperationsInput | string;
    orderValue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SettlementEntryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderRef?: Prisma.StringFieldUpdateOperationsInput | string;
    orderValue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SettlementEntryCreateManyInput = {
    id?: string;
    orgId: string;
    orderRef: string;
    orderValue: runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeRate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    currency?: string;
    createdAt?: Date | string;
};
export type SettlementEntryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderRef?: Prisma.StringFieldUpdateOperationsInput | string;
    orderValue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SettlementEntryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderRef?: Prisma.StringFieldUpdateOperationsInput | string;
    orderValue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    feeAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SettlementEntryOrgIdOrderRefCompoundUniqueInput = {
    orgId: string;
    orderRef: string;
};
export type SettlementEntryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    orderRef?: Prisma.SortOrder;
    orderValue?: Prisma.SortOrder;
    feeRate?: Prisma.SortOrder;
    feeAmount?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SettlementEntryAvgOrderByAggregateInput = {
    orderValue?: Prisma.SortOrder;
    feeRate?: Prisma.SortOrder;
    feeAmount?: Prisma.SortOrder;
};
export type SettlementEntryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    orderRef?: Prisma.SortOrder;
    orderValue?: Prisma.SortOrder;
    feeRate?: Prisma.SortOrder;
    feeAmount?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SettlementEntryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    orderRef?: Prisma.SortOrder;
    orderValue?: Prisma.SortOrder;
    feeRate?: Prisma.SortOrder;
    feeAmount?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SettlementEntrySumOrderByAggregateInput = {
    orderValue?: Prisma.SortOrder;
    feeRate?: Prisma.SortOrder;
    feeAmount?: Prisma.SortOrder;
};
export type SettlementEntrySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    orderRef?: boolean;
    orderValue?: boolean;
    feeRate?: boolean;
    feeAmount?: boolean;
    currency?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["settlementEntry"]>;
export type SettlementEntrySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    orderRef?: boolean;
    orderValue?: boolean;
    feeRate?: boolean;
    feeAmount?: boolean;
    currency?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["settlementEntry"]>;
export type SettlementEntrySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    orderRef?: boolean;
    orderValue?: boolean;
    feeRate?: boolean;
    feeAmount?: boolean;
    currency?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["settlementEntry"]>;
export type SettlementEntrySelectScalar = {
    id?: boolean;
    orgId?: boolean;
    orderRef?: boolean;
    orderValue?: boolean;
    feeRate?: boolean;
    feeAmount?: boolean;
    currency?: boolean;
    createdAt?: boolean;
};
export type SettlementEntryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "orderRef" | "orderValue" | "feeRate" | "feeAmount" | "currency" | "createdAt", ExtArgs["result"]["settlementEntry"]>;
export type $SettlementEntryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SettlementEntry";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        orderRef: string;
        orderValue: runtime.Decimal;
        feeRate: runtime.Decimal;
        feeAmount: runtime.Decimal;
        currency: string;
        createdAt: Date;
    }, ExtArgs["result"]["settlementEntry"]>;
    composites: {};
};
export type SettlementEntryGetPayload<S extends boolean | null | undefined | SettlementEntryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SettlementEntryPayload, S>;
export type SettlementEntryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SettlementEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SettlementEntryCountAggregateInputType | true;
};
export interface SettlementEntryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SettlementEntry'];
        meta: {
            name: 'SettlementEntry';
        };
    };
    findUnique<T extends SettlementEntryFindUniqueArgs>(args: Prisma.SelectSubset<T, SettlementEntryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SettlementEntryClient<runtime.Types.Result.GetResult<Prisma.$SettlementEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SettlementEntryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SettlementEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SettlementEntryClient<runtime.Types.Result.GetResult<Prisma.$SettlementEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SettlementEntryFindFirstArgs>(args?: Prisma.SelectSubset<T, SettlementEntryFindFirstArgs<ExtArgs>>): Prisma.Prisma__SettlementEntryClient<runtime.Types.Result.GetResult<Prisma.$SettlementEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SettlementEntryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SettlementEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SettlementEntryClient<runtime.Types.Result.GetResult<Prisma.$SettlementEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SettlementEntryFindManyArgs>(args?: Prisma.SelectSubset<T, SettlementEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SettlementEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SettlementEntryCreateArgs>(args: Prisma.SelectSubset<T, SettlementEntryCreateArgs<ExtArgs>>): Prisma.Prisma__SettlementEntryClient<runtime.Types.Result.GetResult<Prisma.$SettlementEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SettlementEntryCreateManyArgs>(args?: Prisma.SelectSubset<T, SettlementEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SettlementEntryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SettlementEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SettlementEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SettlementEntryDeleteArgs>(args: Prisma.SelectSubset<T, SettlementEntryDeleteArgs<ExtArgs>>): Prisma.Prisma__SettlementEntryClient<runtime.Types.Result.GetResult<Prisma.$SettlementEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SettlementEntryUpdateArgs>(args: Prisma.SelectSubset<T, SettlementEntryUpdateArgs<ExtArgs>>): Prisma.Prisma__SettlementEntryClient<runtime.Types.Result.GetResult<Prisma.$SettlementEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SettlementEntryDeleteManyArgs>(args?: Prisma.SelectSubset<T, SettlementEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SettlementEntryUpdateManyArgs>(args: Prisma.SelectSubset<T, SettlementEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SettlementEntryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SettlementEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SettlementEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SettlementEntryUpsertArgs>(args: Prisma.SelectSubset<T, SettlementEntryUpsertArgs<ExtArgs>>): Prisma.Prisma__SettlementEntryClient<runtime.Types.Result.GetResult<Prisma.$SettlementEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SettlementEntryCountArgs>(args?: Prisma.Subset<T, SettlementEntryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SettlementEntryCountAggregateOutputType> : number>;
    aggregate<T extends SettlementEntryAggregateArgs>(args: Prisma.Subset<T, SettlementEntryAggregateArgs>): Prisma.PrismaPromise<GetSettlementEntryAggregateType<T>>;
    groupBy<T extends SettlementEntryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SettlementEntryGroupByArgs['orderBy'];
    } : {
        orderBy?: SettlementEntryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SettlementEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSettlementEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SettlementEntryFieldRefs;
}
export interface Prisma__SettlementEntryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SettlementEntryFieldRefs {
    readonly id: Prisma.FieldRef<"SettlementEntry", 'String'>;
    readonly orgId: Prisma.FieldRef<"SettlementEntry", 'String'>;
    readonly orderRef: Prisma.FieldRef<"SettlementEntry", 'String'>;
    readonly orderValue: Prisma.FieldRef<"SettlementEntry", 'Decimal'>;
    readonly feeRate: Prisma.FieldRef<"SettlementEntry", 'Decimal'>;
    readonly feeAmount: Prisma.FieldRef<"SettlementEntry", 'Decimal'>;
    readonly currency: Prisma.FieldRef<"SettlementEntry", 'String'>;
    readonly createdAt: Prisma.FieldRef<"SettlementEntry", 'DateTime'>;
}
export type SettlementEntryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SettlementEntrySelect<ExtArgs> | null;
    omit?: Prisma.SettlementEntryOmit<ExtArgs> | null;
    where: Prisma.SettlementEntryWhereUniqueInput;
};
export type SettlementEntryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SettlementEntrySelect<ExtArgs> | null;
    omit?: Prisma.SettlementEntryOmit<ExtArgs> | null;
    where: Prisma.SettlementEntryWhereUniqueInput;
};
export type SettlementEntryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SettlementEntrySelect<ExtArgs> | null;
    omit?: Prisma.SettlementEntryOmit<ExtArgs> | null;
    where?: Prisma.SettlementEntryWhereInput;
    orderBy?: Prisma.SettlementEntryOrderByWithRelationInput | Prisma.SettlementEntryOrderByWithRelationInput[];
    cursor?: Prisma.SettlementEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SettlementEntryScalarFieldEnum | Prisma.SettlementEntryScalarFieldEnum[];
};
export type SettlementEntryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SettlementEntrySelect<ExtArgs> | null;
    omit?: Prisma.SettlementEntryOmit<ExtArgs> | null;
    where?: Prisma.SettlementEntryWhereInput;
    orderBy?: Prisma.SettlementEntryOrderByWithRelationInput | Prisma.SettlementEntryOrderByWithRelationInput[];
    cursor?: Prisma.SettlementEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SettlementEntryScalarFieldEnum | Prisma.SettlementEntryScalarFieldEnum[];
};
export type SettlementEntryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SettlementEntrySelect<ExtArgs> | null;
    omit?: Prisma.SettlementEntryOmit<ExtArgs> | null;
    where?: Prisma.SettlementEntryWhereInput;
    orderBy?: Prisma.SettlementEntryOrderByWithRelationInput | Prisma.SettlementEntryOrderByWithRelationInput[];
    cursor?: Prisma.SettlementEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SettlementEntryScalarFieldEnum | Prisma.SettlementEntryScalarFieldEnum[];
};
export type SettlementEntryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SettlementEntrySelect<ExtArgs> | null;
    omit?: Prisma.SettlementEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SettlementEntryCreateInput, Prisma.SettlementEntryUncheckedCreateInput>;
};
export type SettlementEntryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SettlementEntryCreateManyInput | Prisma.SettlementEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SettlementEntryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SettlementEntrySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SettlementEntryOmit<ExtArgs> | null;
    data: Prisma.SettlementEntryCreateManyInput | Prisma.SettlementEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SettlementEntryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SettlementEntrySelect<ExtArgs> | null;
    omit?: Prisma.SettlementEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SettlementEntryUpdateInput, Prisma.SettlementEntryUncheckedUpdateInput>;
    where: Prisma.SettlementEntryWhereUniqueInput;
};
export type SettlementEntryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SettlementEntryUpdateManyMutationInput, Prisma.SettlementEntryUncheckedUpdateManyInput>;
    where?: Prisma.SettlementEntryWhereInput;
    limit?: number;
};
export type SettlementEntryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SettlementEntrySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SettlementEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SettlementEntryUpdateManyMutationInput, Prisma.SettlementEntryUncheckedUpdateManyInput>;
    where?: Prisma.SettlementEntryWhereInput;
    limit?: number;
};
export type SettlementEntryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SettlementEntrySelect<ExtArgs> | null;
    omit?: Prisma.SettlementEntryOmit<ExtArgs> | null;
    where: Prisma.SettlementEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.SettlementEntryCreateInput, Prisma.SettlementEntryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SettlementEntryUpdateInput, Prisma.SettlementEntryUncheckedUpdateInput>;
};
export type SettlementEntryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SettlementEntrySelect<ExtArgs> | null;
    omit?: Prisma.SettlementEntryOmit<ExtArgs> | null;
    where: Prisma.SettlementEntryWhereUniqueInput;
};
export type SettlementEntryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SettlementEntryWhereInput;
    limit?: number;
};
export type SettlementEntryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SettlementEntrySelect<ExtArgs> | null;
    omit?: Prisma.SettlementEntryOmit<ExtArgs> | null;
};
