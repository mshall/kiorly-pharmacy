import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type LoyaltyEntryModel = runtime.Types.Result.DefaultSelection<Prisma.$LoyaltyEntryPayload>;
export type AggregateLoyaltyEntry = {
    _count: LoyaltyEntryCountAggregateOutputType | null;
    _avg: LoyaltyEntryAvgAggregateOutputType | null;
    _sum: LoyaltyEntrySumAggregateOutputType | null;
    _min: LoyaltyEntryMinAggregateOutputType | null;
    _max: LoyaltyEntryMaxAggregateOutputType | null;
};
export type LoyaltyEntryAvgAggregateOutputType = {
    points: number | null;
    balanceAfter: number | null;
};
export type LoyaltyEntrySumAggregateOutputType = {
    points: number | null;
    balanceAfter: number | null;
};
export type LoyaltyEntryMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    patientId: string | null;
    kind: string | null;
    points: number | null;
    balanceAfter: number | null;
    saleId: string | null;
    note: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type LoyaltyEntryMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    patientId: string | null;
    kind: string | null;
    points: number | null;
    balanceAfter: number | null;
    saleId: string | null;
    note: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type LoyaltyEntryCountAggregateOutputType = {
    id: number;
    orgId: number;
    patientId: number;
    kind: number;
    points: number;
    balanceAfter: number;
    saleId: number;
    note: number;
    createdBy: number;
    createdAt: number;
    _all: number;
};
export type LoyaltyEntryAvgAggregateInputType = {
    points?: true;
    balanceAfter?: true;
};
export type LoyaltyEntrySumAggregateInputType = {
    points?: true;
    balanceAfter?: true;
};
export type LoyaltyEntryMinAggregateInputType = {
    id?: true;
    orgId?: true;
    patientId?: true;
    kind?: true;
    points?: true;
    balanceAfter?: true;
    saleId?: true;
    note?: true;
    createdBy?: true;
    createdAt?: true;
};
export type LoyaltyEntryMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    patientId?: true;
    kind?: true;
    points?: true;
    balanceAfter?: true;
    saleId?: true;
    note?: true;
    createdBy?: true;
    createdAt?: true;
};
export type LoyaltyEntryCountAggregateInputType = {
    id?: true;
    orgId?: true;
    patientId?: true;
    kind?: true;
    points?: true;
    balanceAfter?: true;
    saleId?: true;
    note?: true;
    createdBy?: true;
    createdAt?: true;
    _all?: true;
};
export type LoyaltyEntryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LoyaltyEntryWhereInput;
    orderBy?: Prisma.LoyaltyEntryOrderByWithRelationInput | Prisma.LoyaltyEntryOrderByWithRelationInput[];
    cursor?: Prisma.LoyaltyEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LoyaltyEntryCountAggregateInputType;
    _avg?: LoyaltyEntryAvgAggregateInputType;
    _sum?: LoyaltyEntrySumAggregateInputType;
    _min?: LoyaltyEntryMinAggregateInputType;
    _max?: LoyaltyEntryMaxAggregateInputType;
};
export type GetLoyaltyEntryAggregateType<T extends LoyaltyEntryAggregateArgs> = {
    [P in keyof T & keyof AggregateLoyaltyEntry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLoyaltyEntry[P]> : Prisma.GetScalarType<T[P], AggregateLoyaltyEntry[P]>;
};
export type LoyaltyEntryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LoyaltyEntryWhereInput;
    orderBy?: Prisma.LoyaltyEntryOrderByWithAggregationInput | Prisma.LoyaltyEntryOrderByWithAggregationInput[];
    by: Prisma.LoyaltyEntryScalarFieldEnum[] | Prisma.LoyaltyEntryScalarFieldEnum;
    having?: Prisma.LoyaltyEntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LoyaltyEntryCountAggregateInputType | true;
    _avg?: LoyaltyEntryAvgAggregateInputType;
    _sum?: LoyaltyEntrySumAggregateInputType;
    _min?: LoyaltyEntryMinAggregateInputType;
    _max?: LoyaltyEntryMaxAggregateInputType;
};
export type LoyaltyEntryGroupByOutputType = {
    id: string;
    orgId: string;
    patientId: string;
    kind: string;
    points: number;
    balanceAfter: number;
    saleId: string | null;
    note: string | null;
    createdBy: string | null;
    createdAt: Date;
    _count: LoyaltyEntryCountAggregateOutputType | null;
    _avg: LoyaltyEntryAvgAggregateOutputType | null;
    _sum: LoyaltyEntrySumAggregateOutputType | null;
    _min: LoyaltyEntryMinAggregateOutputType | null;
    _max: LoyaltyEntryMaxAggregateOutputType | null;
};
export type GetLoyaltyEntryGroupByPayload<T extends LoyaltyEntryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LoyaltyEntryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LoyaltyEntryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LoyaltyEntryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LoyaltyEntryGroupByOutputType[P]>;
}>>;
export type LoyaltyEntryWhereInput = {
    AND?: Prisma.LoyaltyEntryWhereInput | Prisma.LoyaltyEntryWhereInput[];
    OR?: Prisma.LoyaltyEntryWhereInput[];
    NOT?: Prisma.LoyaltyEntryWhereInput | Prisma.LoyaltyEntryWhereInput[];
    id?: Prisma.StringFilter<"LoyaltyEntry"> | string;
    orgId?: Prisma.StringFilter<"LoyaltyEntry"> | string;
    patientId?: Prisma.StringFilter<"LoyaltyEntry"> | string;
    kind?: Prisma.StringFilter<"LoyaltyEntry"> | string;
    points?: Prisma.IntFilter<"LoyaltyEntry"> | number;
    balanceAfter?: Prisma.IntFilter<"LoyaltyEntry"> | number;
    saleId?: Prisma.StringNullableFilter<"LoyaltyEntry"> | string | null;
    note?: Prisma.StringNullableFilter<"LoyaltyEntry"> | string | null;
    createdBy?: Prisma.StringNullableFilter<"LoyaltyEntry"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"LoyaltyEntry"> | Date | string;
};
export type LoyaltyEntryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    points?: Prisma.SortOrder;
    balanceAfter?: Prisma.SortOrder;
    saleId?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LoyaltyEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.LoyaltyEntryWhereInput | Prisma.LoyaltyEntryWhereInput[];
    OR?: Prisma.LoyaltyEntryWhereInput[];
    NOT?: Prisma.LoyaltyEntryWhereInput | Prisma.LoyaltyEntryWhereInput[];
    orgId?: Prisma.StringFilter<"LoyaltyEntry"> | string;
    patientId?: Prisma.StringFilter<"LoyaltyEntry"> | string;
    kind?: Prisma.StringFilter<"LoyaltyEntry"> | string;
    points?: Prisma.IntFilter<"LoyaltyEntry"> | number;
    balanceAfter?: Prisma.IntFilter<"LoyaltyEntry"> | number;
    saleId?: Prisma.StringNullableFilter<"LoyaltyEntry"> | string | null;
    note?: Prisma.StringNullableFilter<"LoyaltyEntry"> | string | null;
    createdBy?: Prisma.StringNullableFilter<"LoyaltyEntry"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"LoyaltyEntry"> | Date | string;
}, "id">;
export type LoyaltyEntryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    points?: Prisma.SortOrder;
    balanceAfter?: Prisma.SortOrder;
    saleId?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.LoyaltyEntryCountOrderByAggregateInput;
    _avg?: Prisma.LoyaltyEntryAvgOrderByAggregateInput;
    _max?: Prisma.LoyaltyEntryMaxOrderByAggregateInput;
    _min?: Prisma.LoyaltyEntryMinOrderByAggregateInput;
    _sum?: Prisma.LoyaltyEntrySumOrderByAggregateInput;
};
export type LoyaltyEntryScalarWhereWithAggregatesInput = {
    AND?: Prisma.LoyaltyEntryScalarWhereWithAggregatesInput | Prisma.LoyaltyEntryScalarWhereWithAggregatesInput[];
    OR?: Prisma.LoyaltyEntryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LoyaltyEntryScalarWhereWithAggregatesInput | Prisma.LoyaltyEntryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"LoyaltyEntry"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"LoyaltyEntry"> | string;
    patientId?: Prisma.StringWithAggregatesFilter<"LoyaltyEntry"> | string;
    kind?: Prisma.StringWithAggregatesFilter<"LoyaltyEntry"> | string;
    points?: Prisma.IntWithAggregatesFilter<"LoyaltyEntry"> | number;
    balanceAfter?: Prisma.IntWithAggregatesFilter<"LoyaltyEntry"> | number;
    saleId?: Prisma.StringNullableWithAggregatesFilter<"LoyaltyEntry"> | string | null;
    note?: Prisma.StringNullableWithAggregatesFilter<"LoyaltyEntry"> | string | null;
    createdBy?: Prisma.StringNullableWithAggregatesFilter<"LoyaltyEntry"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"LoyaltyEntry"> | Date | string;
};
export type LoyaltyEntryCreateInput = {
    id?: string;
    orgId: string;
    patientId: string;
    kind: string;
    points: number;
    balanceAfter: number;
    saleId?: string | null;
    note?: string | null;
    createdBy?: string | null;
    createdAt?: Date | string;
};
export type LoyaltyEntryUncheckedCreateInput = {
    id?: string;
    orgId: string;
    patientId: string;
    kind: string;
    points: number;
    balanceAfter: number;
    saleId?: string | null;
    note?: string | null;
    createdBy?: string | null;
    createdAt?: Date | string;
};
export type LoyaltyEntryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    balanceAfter?: Prisma.IntFieldUpdateOperationsInput | number;
    saleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LoyaltyEntryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    balanceAfter?: Prisma.IntFieldUpdateOperationsInput | number;
    saleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LoyaltyEntryCreateManyInput = {
    id?: string;
    orgId: string;
    patientId: string;
    kind: string;
    points: number;
    balanceAfter: number;
    saleId?: string | null;
    note?: string | null;
    createdBy?: string | null;
    createdAt?: Date | string;
};
export type LoyaltyEntryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    balanceAfter?: Prisma.IntFieldUpdateOperationsInput | number;
    saleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LoyaltyEntryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    balanceAfter?: Prisma.IntFieldUpdateOperationsInput | number;
    saleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LoyaltyEntryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    points?: Prisma.SortOrder;
    balanceAfter?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LoyaltyEntryAvgOrderByAggregateInput = {
    points?: Prisma.SortOrder;
    balanceAfter?: Prisma.SortOrder;
};
export type LoyaltyEntryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    points?: Prisma.SortOrder;
    balanceAfter?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LoyaltyEntryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    points?: Prisma.SortOrder;
    balanceAfter?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LoyaltyEntrySumOrderByAggregateInput = {
    points?: Prisma.SortOrder;
    balanceAfter?: Prisma.SortOrder;
};
export type LoyaltyEntrySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    kind?: boolean;
    points?: boolean;
    balanceAfter?: boolean;
    saleId?: boolean;
    note?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["loyaltyEntry"]>;
export type LoyaltyEntrySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    kind?: boolean;
    points?: boolean;
    balanceAfter?: boolean;
    saleId?: boolean;
    note?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["loyaltyEntry"]>;
export type LoyaltyEntrySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    kind?: boolean;
    points?: boolean;
    balanceAfter?: boolean;
    saleId?: boolean;
    note?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["loyaltyEntry"]>;
export type LoyaltyEntrySelectScalar = {
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    kind?: boolean;
    points?: boolean;
    balanceAfter?: boolean;
    saleId?: boolean;
    note?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
};
export type LoyaltyEntryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "patientId" | "kind" | "points" | "balanceAfter" | "saleId" | "note" | "createdBy" | "createdAt", ExtArgs["result"]["loyaltyEntry"]>;
export type $LoyaltyEntryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LoyaltyEntry";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        patientId: string;
        kind: string;
        points: number;
        balanceAfter: number;
        saleId: string | null;
        note: string | null;
        createdBy: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["loyaltyEntry"]>;
    composites: {};
};
export type LoyaltyEntryGetPayload<S extends boolean | null | undefined | LoyaltyEntryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LoyaltyEntryPayload, S>;
export type LoyaltyEntryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LoyaltyEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LoyaltyEntryCountAggregateInputType | true;
};
export interface LoyaltyEntryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LoyaltyEntry'];
        meta: {
            name: 'LoyaltyEntry';
        };
    };
    findUnique<T extends LoyaltyEntryFindUniqueArgs>(args: Prisma.SelectSubset<T, LoyaltyEntryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LoyaltyEntryClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LoyaltyEntryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LoyaltyEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LoyaltyEntryClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LoyaltyEntryFindFirstArgs>(args?: Prisma.SelectSubset<T, LoyaltyEntryFindFirstArgs<ExtArgs>>): Prisma.Prisma__LoyaltyEntryClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LoyaltyEntryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LoyaltyEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LoyaltyEntryClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LoyaltyEntryFindManyArgs>(args?: Prisma.SelectSubset<T, LoyaltyEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LoyaltyEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LoyaltyEntryCreateArgs>(args: Prisma.SelectSubset<T, LoyaltyEntryCreateArgs<ExtArgs>>): Prisma.Prisma__LoyaltyEntryClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LoyaltyEntryCreateManyArgs>(args?: Prisma.SelectSubset<T, LoyaltyEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LoyaltyEntryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LoyaltyEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LoyaltyEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LoyaltyEntryDeleteArgs>(args: Prisma.SelectSubset<T, LoyaltyEntryDeleteArgs<ExtArgs>>): Prisma.Prisma__LoyaltyEntryClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LoyaltyEntryUpdateArgs>(args: Prisma.SelectSubset<T, LoyaltyEntryUpdateArgs<ExtArgs>>): Prisma.Prisma__LoyaltyEntryClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LoyaltyEntryDeleteManyArgs>(args?: Prisma.SelectSubset<T, LoyaltyEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LoyaltyEntryUpdateManyArgs>(args: Prisma.SelectSubset<T, LoyaltyEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LoyaltyEntryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LoyaltyEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LoyaltyEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LoyaltyEntryUpsertArgs>(args: Prisma.SelectSubset<T, LoyaltyEntryUpsertArgs<ExtArgs>>): Prisma.Prisma__LoyaltyEntryClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LoyaltyEntryCountArgs>(args?: Prisma.Subset<T, LoyaltyEntryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LoyaltyEntryCountAggregateOutputType> : number>;
    aggregate<T extends LoyaltyEntryAggregateArgs>(args: Prisma.Subset<T, LoyaltyEntryAggregateArgs>): Prisma.PrismaPromise<GetLoyaltyEntryAggregateType<T>>;
    groupBy<T extends LoyaltyEntryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LoyaltyEntryGroupByArgs['orderBy'];
    } : {
        orderBy?: LoyaltyEntryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LoyaltyEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoyaltyEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LoyaltyEntryFieldRefs;
}
export interface Prisma__LoyaltyEntryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LoyaltyEntryFieldRefs {
    readonly id: Prisma.FieldRef<"LoyaltyEntry", 'String'>;
    readonly orgId: Prisma.FieldRef<"LoyaltyEntry", 'String'>;
    readonly patientId: Prisma.FieldRef<"LoyaltyEntry", 'String'>;
    readonly kind: Prisma.FieldRef<"LoyaltyEntry", 'String'>;
    readonly points: Prisma.FieldRef<"LoyaltyEntry", 'Int'>;
    readonly balanceAfter: Prisma.FieldRef<"LoyaltyEntry", 'Int'>;
    readonly saleId: Prisma.FieldRef<"LoyaltyEntry", 'String'>;
    readonly note: Prisma.FieldRef<"LoyaltyEntry", 'String'>;
    readonly createdBy: Prisma.FieldRef<"LoyaltyEntry", 'String'>;
    readonly createdAt: Prisma.FieldRef<"LoyaltyEntry", 'DateTime'>;
}
export type LoyaltyEntryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LoyaltyEntrySelect<ExtArgs> | null;
    omit?: Prisma.LoyaltyEntryOmit<ExtArgs> | null;
    where: Prisma.LoyaltyEntryWhereUniqueInput;
};
export type LoyaltyEntryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LoyaltyEntrySelect<ExtArgs> | null;
    omit?: Prisma.LoyaltyEntryOmit<ExtArgs> | null;
    where: Prisma.LoyaltyEntryWhereUniqueInput;
};
export type LoyaltyEntryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LoyaltyEntrySelect<ExtArgs> | null;
    omit?: Prisma.LoyaltyEntryOmit<ExtArgs> | null;
    where?: Prisma.LoyaltyEntryWhereInput;
    orderBy?: Prisma.LoyaltyEntryOrderByWithRelationInput | Prisma.LoyaltyEntryOrderByWithRelationInput[];
    cursor?: Prisma.LoyaltyEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LoyaltyEntryScalarFieldEnum | Prisma.LoyaltyEntryScalarFieldEnum[];
};
export type LoyaltyEntryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LoyaltyEntrySelect<ExtArgs> | null;
    omit?: Prisma.LoyaltyEntryOmit<ExtArgs> | null;
    where?: Prisma.LoyaltyEntryWhereInput;
    orderBy?: Prisma.LoyaltyEntryOrderByWithRelationInput | Prisma.LoyaltyEntryOrderByWithRelationInput[];
    cursor?: Prisma.LoyaltyEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LoyaltyEntryScalarFieldEnum | Prisma.LoyaltyEntryScalarFieldEnum[];
};
export type LoyaltyEntryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LoyaltyEntrySelect<ExtArgs> | null;
    omit?: Prisma.LoyaltyEntryOmit<ExtArgs> | null;
    where?: Prisma.LoyaltyEntryWhereInput;
    orderBy?: Prisma.LoyaltyEntryOrderByWithRelationInput | Prisma.LoyaltyEntryOrderByWithRelationInput[];
    cursor?: Prisma.LoyaltyEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LoyaltyEntryScalarFieldEnum | Prisma.LoyaltyEntryScalarFieldEnum[];
};
export type LoyaltyEntryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LoyaltyEntrySelect<ExtArgs> | null;
    omit?: Prisma.LoyaltyEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LoyaltyEntryCreateInput, Prisma.LoyaltyEntryUncheckedCreateInput>;
};
export type LoyaltyEntryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LoyaltyEntryCreateManyInput | Prisma.LoyaltyEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LoyaltyEntryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LoyaltyEntrySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LoyaltyEntryOmit<ExtArgs> | null;
    data: Prisma.LoyaltyEntryCreateManyInput | Prisma.LoyaltyEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LoyaltyEntryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LoyaltyEntrySelect<ExtArgs> | null;
    omit?: Prisma.LoyaltyEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LoyaltyEntryUpdateInput, Prisma.LoyaltyEntryUncheckedUpdateInput>;
    where: Prisma.LoyaltyEntryWhereUniqueInput;
};
export type LoyaltyEntryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LoyaltyEntryUpdateManyMutationInput, Prisma.LoyaltyEntryUncheckedUpdateManyInput>;
    where?: Prisma.LoyaltyEntryWhereInput;
    limit?: number;
};
export type LoyaltyEntryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LoyaltyEntrySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LoyaltyEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LoyaltyEntryUpdateManyMutationInput, Prisma.LoyaltyEntryUncheckedUpdateManyInput>;
    where?: Prisma.LoyaltyEntryWhereInput;
    limit?: number;
};
export type LoyaltyEntryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LoyaltyEntrySelect<ExtArgs> | null;
    omit?: Prisma.LoyaltyEntryOmit<ExtArgs> | null;
    where: Prisma.LoyaltyEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.LoyaltyEntryCreateInput, Prisma.LoyaltyEntryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LoyaltyEntryUpdateInput, Prisma.LoyaltyEntryUncheckedUpdateInput>;
};
export type LoyaltyEntryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LoyaltyEntrySelect<ExtArgs> | null;
    omit?: Prisma.LoyaltyEntryOmit<ExtArgs> | null;
    where: Prisma.LoyaltyEntryWhereUniqueInput;
};
export type LoyaltyEntryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LoyaltyEntryWhereInput;
    limit?: number;
};
export type LoyaltyEntryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LoyaltyEntrySelect<ExtArgs> | null;
    omit?: Prisma.LoyaltyEntryOmit<ExtArgs> | null;
};
