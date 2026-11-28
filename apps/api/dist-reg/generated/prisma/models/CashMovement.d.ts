import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type CashMovementModel = runtime.Types.Result.DefaultSelection<Prisma.$CashMovementPayload>;
export type AggregateCashMovement = {
    _count: CashMovementCountAggregateOutputType | null;
    _avg: CashMovementAvgAggregateOutputType | null;
    _sum: CashMovementSumAggregateOutputType | null;
    _min: CashMovementMinAggregateOutputType | null;
    _max: CashMovementMaxAggregateOutputType | null;
};
export type CashMovementAvgAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type CashMovementSumAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type CashMovementMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    shiftId: string | null;
    kind: string | null;
    category: string | null;
    amount: runtime.Decimal | null;
    reason: string | null;
    refType: string | null;
    refId: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type CashMovementMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    shiftId: string | null;
    kind: string | null;
    category: string | null;
    amount: runtime.Decimal | null;
    reason: string | null;
    refType: string | null;
    refId: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type CashMovementCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    shiftId: number;
    kind: number;
    category: number;
    amount: number;
    reason: number;
    refType: number;
    refId: number;
    createdBy: number;
    createdAt: number;
    _all: number;
};
export type CashMovementAvgAggregateInputType = {
    amount?: true;
};
export type CashMovementSumAggregateInputType = {
    amount?: true;
};
export type CashMovementMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    shiftId?: true;
    kind?: true;
    category?: true;
    amount?: true;
    reason?: true;
    refType?: true;
    refId?: true;
    createdBy?: true;
    createdAt?: true;
};
export type CashMovementMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    shiftId?: true;
    kind?: true;
    category?: true;
    amount?: true;
    reason?: true;
    refType?: true;
    refId?: true;
    createdBy?: true;
    createdAt?: true;
};
export type CashMovementCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    shiftId?: true;
    kind?: true;
    category?: true;
    amount?: true;
    reason?: true;
    refType?: true;
    refId?: true;
    createdBy?: true;
    createdAt?: true;
    _all?: true;
};
export type CashMovementAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CashMovementWhereInput;
    orderBy?: Prisma.CashMovementOrderByWithRelationInput | Prisma.CashMovementOrderByWithRelationInput[];
    cursor?: Prisma.CashMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CashMovementCountAggregateInputType;
    _avg?: CashMovementAvgAggregateInputType;
    _sum?: CashMovementSumAggregateInputType;
    _min?: CashMovementMinAggregateInputType;
    _max?: CashMovementMaxAggregateInputType;
};
export type GetCashMovementAggregateType<T extends CashMovementAggregateArgs> = {
    [P in keyof T & keyof AggregateCashMovement]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCashMovement[P]> : Prisma.GetScalarType<T[P], AggregateCashMovement[P]>;
};
export type CashMovementGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CashMovementWhereInput;
    orderBy?: Prisma.CashMovementOrderByWithAggregationInput | Prisma.CashMovementOrderByWithAggregationInput[];
    by: Prisma.CashMovementScalarFieldEnum[] | Prisma.CashMovementScalarFieldEnum;
    having?: Prisma.CashMovementScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CashMovementCountAggregateInputType | true;
    _avg?: CashMovementAvgAggregateInputType;
    _sum?: CashMovementSumAggregateInputType;
    _min?: CashMovementMinAggregateInputType;
    _max?: CashMovementMaxAggregateInputType;
};
export type CashMovementGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    shiftId: string;
    kind: string;
    category: string;
    amount: runtime.Decimal;
    reason: string;
    refType: string | null;
    refId: string | null;
    createdBy: string;
    createdAt: Date;
    _count: CashMovementCountAggregateOutputType | null;
    _avg: CashMovementAvgAggregateOutputType | null;
    _sum: CashMovementSumAggregateOutputType | null;
    _min: CashMovementMinAggregateOutputType | null;
    _max: CashMovementMaxAggregateOutputType | null;
};
export type GetCashMovementGroupByPayload<T extends CashMovementGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CashMovementGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CashMovementGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CashMovementGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CashMovementGroupByOutputType[P]>;
}>>;
export type CashMovementWhereInput = {
    AND?: Prisma.CashMovementWhereInput | Prisma.CashMovementWhereInput[];
    OR?: Prisma.CashMovementWhereInput[];
    NOT?: Prisma.CashMovementWhereInput | Prisma.CashMovementWhereInput[];
    id?: Prisma.StringFilter<"CashMovement"> | string;
    orgId?: Prisma.StringFilter<"CashMovement"> | string;
    branchId?: Prisma.StringFilter<"CashMovement"> | string;
    shiftId?: Prisma.StringFilter<"CashMovement"> | string;
    kind?: Prisma.StringFilter<"CashMovement"> | string;
    category?: Prisma.StringFilter<"CashMovement"> | string;
    amount?: Prisma.DecimalFilter<"CashMovement"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFilter<"CashMovement"> | string;
    refType?: Prisma.StringNullableFilter<"CashMovement"> | string | null;
    refId?: Prisma.StringNullableFilter<"CashMovement"> | string | null;
    createdBy?: Prisma.StringFilter<"CashMovement"> | string;
    createdAt?: Prisma.DateTimeFilter<"CashMovement"> | Date | string;
};
export type CashMovementOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    shiftId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    refType?: Prisma.SortOrderInput | Prisma.SortOrder;
    refId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CashMovementWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.CashMovementWhereInput | Prisma.CashMovementWhereInput[];
    OR?: Prisma.CashMovementWhereInput[];
    NOT?: Prisma.CashMovementWhereInput | Prisma.CashMovementWhereInput[];
    orgId?: Prisma.StringFilter<"CashMovement"> | string;
    branchId?: Prisma.StringFilter<"CashMovement"> | string;
    shiftId?: Prisma.StringFilter<"CashMovement"> | string;
    kind?: Prisma.StringFilter<"CashMovement"> | string;
    category?: Prisma.StringFilter<"CashMovement"> | string;
    amount?: Prisma.DecimalFilter<"CashMovement"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFilter<"CashMovement"> | string;
    refType?: Prisma.StringNullableFilter<"CashMovement"> | string | null;
    refId?: Prisma.StringNullableFilter<"CashMovement"> | string | null;
    createdBy?: Prisma.StringFilter<"CashMovement"> | string;
    createdAt?: Prisma.DateTimeFilter<"CashMovement"> | Date | string;
}, "id">;
export type CashMovementOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    shiftId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    refType?: Prisma.SortOrderInput | Prisma.SortOrder;
    refId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.CashMovementCountOrderByAggregateInput;
    _avg?: Prisma.CashMovementAvgOrderByAggregateInput;
    _max?: Prisma.CashMovementMaxOrderByAggregateInput;
    _min?: Prisma.CashMovementMinOrderByAggregateInput;
    _sum?: Prisma.CashMovementSumOrderByAggregateInput;
};
export type CashMovementScalarWhereWithAggregatesInput = {
    AND?: Prisma.CashMovementScalarWhereWithAggregatesInput | Prisma.CashMovementScalarWhereWithAggregatesInput[];
    OR?: Prisma.CashMovementScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CashMovementScalarWhereWithAggregatesInput | Prisma.CashMovementScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"CashMovement"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"CashMovement"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"CashMovement"> | string;
    shiftId?: Prisma.StringWithAggregatesFilter<"CashMovement"> | string;
    kind?: Prisma.StringWithAggregatesFilter<"CashMovement"> | string;
    category?: Prisma.StringWithAggregatesFilter<"CashMovement"> | string;
    amount?: Prisma.DecimalWithAggregatesFilter<"CashMovement"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringWithAggregatesFilter<"CashMovement"> | string;
    refType?: Prisma.StringNullableWithAggregatesFilter<"CashMovement"> | string | null;
    refId?: Prisma.StringNullableWithAggregatesFilter<"CashMovement"> | string | null;
    createdBy?: Prisma.StringWithAggregatesFilter<"CashMovement"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"CashMovement"> | Date | string;
};
export type CashMovementCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    shiftId: string;
    kind: string;
    category: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    refType?: string | null;
    refId?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type CashMovementUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    shiftId: string;
    kind: string;
    category: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    refType?: string | null;
    refId?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type CashMovementUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    shiftId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CashMovementUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    shiftId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CashMovementCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    shiftId: string;
    kind: string;
    category: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    refType?: string | null;
    refId?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type CashMovementUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    shiftId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CashMovementUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    shiftId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CashMovementCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    shiftId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CashMovementAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type CashMovementMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    shiftId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CashMovementMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    shiftId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CashMovementSumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type CashMovementSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    shiftId?: boolean;
    kind?: boolean;
    category?: boolean;
    amount?: boolean;
    reason?: boolean;
    refType?: boolean;
    refId?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["cashMovement"]>;
export type CashMovementSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    shiftId?: boolean;
    kind?: boolean;
    category?: boolean;
    amount?: boolean;
    reason?: boolean;
    refType?: boolean;
    refId?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["cashMovement"]>;
export type CashMovementSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    shiftId?: boolean;
    kind?: boolean;
    category?: boolean;
    amount?: boolean;
    reason?: boolean;
    refType?: boolean;
    refId?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["cashMovement"]>;
export type CashMovementSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    shiftId?: boolean;
    kind?: boolean;
    category?: boolean;
    amount?: boolean;
    reason?: boolean;
    refType?: boolean;
    refId?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
};
export type CashMovementOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "shiftId" | "kind" | "category" | "amount" | "reason" | "refType" | "refId" | "createdBy" | "createdAt", ExtArgs["result"]["cashMovement"]>;
export type $CashMovementPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CashMovement";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        shiftId: string;
        kind: string;
        category: string;
        amount: runtime.Decimal;
        reason: string;
        refType: string | null;
        refId: string | null;
        createdBy: string;
        createdAt: Date;
    }, ExtArgs["result"]["cashMovement"]>;
    composites: {};
};
export type CashMovementGetPayload<S extends boolean | null | undefined | CashMovementDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CashMovementPayload, S>;
export type CashMovementCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CashMovementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CashMovementCountAggregateInputType | true;
};
export interface CashMovementDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CashMovement'];
        meta: {
            name: 'CashMovement';
        };
    };
    findUnique<T extends CashMovementFindUniqueArgs>(args: Prisma.SelectSubset<T, CashMovementFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CashMovementClient<runtime.Types.Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CashMovementFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CashMovementFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CashMovementClient<runtime.Types.Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CashMovementFindFirstArgs>(args?: Prisma.SelectSubset<T, CashMovementFindFirstArgs<ExtArgs>>): Prisma.Prisma__CashMovementClient<runtime.Types.Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CashMovementFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CashMovementFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CashMovementClient<runtime.Types.Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CashMovementFindManyArgs>(args?: Prisma.SelectSubset<T, CashMovementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CashMovementCreateArgs>(args: Prisma.SelectSubset<T, CashMovementCreateArgs<ExtArgs>>): Prisma.Prisma__CashMovementClient<runtime.Types.Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CashMovementCreateManyArgs>(args?: Prisma.SelectSubset<T, CashMovementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CashMovementCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CashMovementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CashMovementDeleteArgs>(args: Prisma.SelectSubset<T, CashMovementDeleteArgs<ExtArgs>>): Prisma.Prisma__CashMovementClient<runtime.Types.Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CashMovementUpdateArgs>(args: Prisma.SelectSubset<T, CashMovementUpdateArgs<ExtArgs>>): Prisma.Prisma__CashMovementClient<runtime.Types.Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CashMovementDeleteManyArgs>(args?: Prisma.SelectSubset<T, CashMovementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CashMovementUpdateManyArgs>(args: Prisma.SelectSubset<T, CashMovementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CashMovementUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CashMovementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CashMovementUpsertArgs>(args: Prisma.SelectSubset<T, CashMovementUpsertArgs<ExtArgs>>): Prisma.Prisma__CashMovementClient<runtime.Types.Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CashMovementCountArgs>(args?: Prisma.Subset<T, CashMovementCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CashMovementCountAggregateOutputType> : number>;
    aggregate<T extends CashMovementAggregateArgs>(args: Prisma.Subset<T, CashMovementAggregateArgs>): Prisma.PrismaPromise<GetCashMovementAggregateType<T>>;
    groupBy<T extends CashMovementGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CashMovementGroupByArgs['orderBy'];
    } : {
        orderBy?: CashMovementGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CashMovementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCashMovementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CashMovementFieldRefs;
}
export interface Prisma__CashMovementClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CashMovementFieldRefs {
    readonly id: Prisma.FieldRef<"CashMovement", 'String'>;
    readonly orgId: Prisma.FieldRef<"CashMovement", 'String'>;
    readonly branchId: Prisma.FieldRef<"CashMovement", 'String'>;
    readonly shiftId: Prisma.FieldRef<"CashMovement", 'String'>;
    readonly kind: Prisma.FieldRef<"CashMovement", 'String'>;
    readonly category: Prisma.FieldRef<"CashMovement", 'String'>;
    readonly amount: Prisma.FieldRef<"CashMovement", 'Decimal'>;
    readonly reason: Prisma.FieldRef<"CashMovement", 'String'>;
    readonly refType: Prisma.FieldRef<"CashMovement", 'String'>;
    readonly refId: Prisma.FieldRef<"CashMovement", 'String'>;
    readonly createdBy: Prisma.FieldRef<"CashMovement", 'String'>;
    readonly createdAt: Prisma.FieldRef<"CashMovement", 'DateTime'>;
}
export type CashMovementFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CashMovementSelect<ExtArgs> | null;
    omit?: Prisma.CashMovementOmit<ExtArgs> | null;
    where: Prisma.CashMovementWhereUniqueInput;
};
export type CashMovementFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CashMovementSelect<ExtArgs> | null;
    omit?: Prisma.CashMovementOmit<ExtArgs> | null;
    where: Prisma.CashMovementWhereUniqueInput;
};
export type CashMovementFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CashMovementSelect<ExtArgs> | null;
    omit?: Prisma.CashMovementOmit<ExtArgs> | null;
    where?: Prisma.CashMovementWhereInput;
    orderBy?: Prisma.CashMovementOrderByWithRelationInput | Prisma.CashMovementOrderByWithRelationInput[];
    cursor?: Prisma.CashMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CashMovementScalarFieldEnum | Prisma.CashMovementScalarFieldEnum[];
};
export type CashMovementFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CashMovementSelect<ExtArgs> | null;
    omit?: Prisma.CashMovementOmit<ExtArgs> | null;
    where?: Prisma.CashMovementWhereInput;
    orderBy?: Prisma.CashMovementOrderByWithRelationInput | Prisma.CashMovementOrderByWithRelationInput[];
    cursor?: Prisma.CashMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CashMovementScalarFieldEnum | Prisma.CashMovementScalarFieldEnum[];
};
export type CashMovementFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CashMovementSelect<ExtArgs> | null;
    omit?: Prisma.CashMovementOmit<ExtArgs> | null;
    where?: Prisma.CashMovementWhereInput;
    orderBy?: Prisma.CashMovementOrderByWithRelationInput | Prisma.CashMovementOrderByWithRelationInput[];
    cursor?: Prisma.CashMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CashMovementScalarFieldEnum | Prisma.CashMovementScalarFieldEnum[];
};
export type CashMovementCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CashMovementSelect<ExtArgs> | null;
    omit?: Prisma.CashMovementOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CashMovementCreateInput, Prisma.CashMovementUncheckedCreateInput>;
};
export type CashMovementCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CashMovementCreateManyInput | Prisma.CashMovementCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CashMovementCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CashMovementSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CashMovementOmit<ExtArgs> | null;
    data: Prisma.CashMovementCreateManyInput | Prisma.CashMovementCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CashMovementUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CashMovementSelect<ExtArgs> | null;
    omit?: Prisma.CashMovementOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CashMovementUpdateInput, Prisma.CashMovementUncheckedUpdateInput>;
    where: Prisma.CashMovementWhereUniqueInput;
};
export type CashMovementUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CashMovementUpdateManyMutationInput, Prisma.CashMovementUncheckedUpdateManyInput>;
    where?: Prisma.CashMovementWhereInput;
    limit?: number;
};
export type CashMovementUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CashMovementSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CashMovementOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CashMovementUpdateManyMutationInput, Prisma.CashMovementUncheckedUpdateManyInput>;
    where?: Prisma.CashMovementWhereInput;
    limit?: number;
};
export type CashMovementUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CashMovementSelect<ExtArgs> | null;
    omit?: Prisma.CashMovementOmit<ExtArgs> | null;
    where: Prisma.CashMovementWhereUniqueInput;
    create: Prisma.XOR<Prisma.CashMovementCreateInput, Prisma.CashMovementUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CashMovementUpdateInput, Prisma.CashMovementUncheckedUpdateInput>;
};
export type CashMovementDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CashMovementSelect<ExtArgs> | null;
    omit?: Prisma.CashMovementOmit<ExtArgs> | null;
    where: Prisma.CashMovementWhereUniqueInput;
};
export type CashMovementDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CashMovementWhereInput;
    limit?: number;
};
export type CashMovementDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CashMovementSelect<ExtArgs> | null;
    omit?: Prisma.CashMovementOmit<ExtArgs> | null;
};
