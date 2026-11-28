import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type SupplierReturnModel = runtime.Types.Result.DefaultSelection<Prisma.$SupplierReturnPayload>;
export type AggregateSupplierReturn = {
    _count: SupplierReturnCountAggregateOutputType | null;
    _avg: SupplierReturnAvgAggregateOutputType | null;
    _sum: SupplierReturnSumAggregateOutputType | null;
    _min: SupplierReturnMinAggregateOutputType | null;
    _max: SupplierReturnMaxAggregateOutputType | null;
};
export type SupplierReturnAvgAggregateOutputType = {
    quantity: number | null;
    creditAmount: runtime.Decimal | null;
};
export type SupplierReturnSumAggregateOutputType = {
    quantity: number | null;
    creditAmount: runtime.Decimal | null;
};
export type SupplierReturnMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    supplierId: string | null;
    lotId: string | null;
    quantity: number | null;
    creditAmount: runtime.Decimal | null;
    reason: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type SupplierReturnMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    supplierId: string | null;
    lotId: string | null;
    quantity: number | null;
    creditAmount: runtime.Decimal | null;
    reason: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type SupplierReturnCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    supplierId: number;
    lotId: number;
    quantity: number;
    creditAmount: number;
    reason: number;
    createdBy: number;
    createdAt: number;
    _all: number;
};
export type SupplierReturnAvgAggregateInputType = {
    quantity?: true;
    creditAmount?: true;
};
export type SupplierReturnSumAggregateInputType = {
    quantity?: true;
    creditAmount?: true;
};
export type SupplierReturnMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    supplierId?: true;
    lotId?: true;
    quantity?: true;
    creditAmount?: true;
    reason?: true;
    createdBy?: true;
    createdAt?: true;
};
export type SupplierReturnMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    supplierId?: true;
    lotId?: true;
    quantity?: true;
    creditAmount?: true;
    reason?: true;
    createdBy?: true;
    createdAt?: true;
};
export type SupplierReturnCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    supplierId?: true;
    lotId?: true;
    quantity?: true;
    creditAmount?: true;
    reason?: true;
    createdBy?: true;
    createdAt?: true;
    _all?: true;
};
export type SupplierReturnAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierReturnWhereInput;
    orderBy?: Prisma.SupplierReturnOrderByWithRelationInput | Prisma.SupplierReturnOrderByWithRelationInput[];
    cursor?: Prisma.SupplierReturnWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SupplierReturnCountAggregateInputType;
    _avg?: SupplierReturnAvgAggregateInputType;
    _sum?: SupplierReturnSumAggregateInputType;
    _min?: SupplierReturnMinAggregateInputType;
    _max?: SupplierReturnMaxAggregateInputType;
};
export type GetSupplierReturnAggregateType<T extends SupplierReturnAggregateArgs> = {
    [P in keyof T & keyof AggregateSupplierReturn]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSupplierReturn[P]> : Prisma.GetScalarType<T[P], AggregateSupplierReturn[P]>;
};
export type SupplierReturnGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierReturnWhereInput;
    orderBy?: Prisma.SupplierReturnOrderByWithAggregationInput | Prisma.SupplierReturnOrderByWithAggregationInput[];
    by: Prisma.SupplierReturnScalarFieldEnum[] | Prisma.SupplierReturnScalarFieldEnum;
    having?: Prisma.SupplierReturnScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SupplierReturnCountAggregateInputType | true;
    _avg?: SupplierReturnAvgAggregateInputType;
    _sum?: SupplierReturnSumAggregateInputType;
    _min?: SupplierReturnMinAggregateInputType;
    _max?: SupplierReturnMaxAggregateInputType;
};
export type SupplierReturnGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    supplierId: string;
    lotId: string;
    quantity: number;
    creditAmount: runtime.Decimal;
    reason: string;
    createdBy: string;
    createdAt: Date;
    _count: SupplierReturnCountAggregateOutputType | null;
    _avg: SupplierReturnAvgAggregateOutputType | null;
    _sum: SupplierReturnSumAggregateOutputType | null;
    _min: SupplierReturnMinAggregateOutputType | null;
    _max: SupplierReturnMaxAggregateOutputType | null;
};
export type GetSupplierReturnGroupByPayload<T extends SupplierReturnGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SupplierReturnGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SupplierReturnGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SupplierReturnGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SupplierReturnGroupByOutputType[P]>;
}>>;
export type SupplierReturnWhereInput = {
    AND?: Prisma.SupplierReturnWhereInput | Prisma.SupplierReturnWhereInput[];
    OR?: Prisma.SupplierReturnWhereInput[];
    NOT?: Prisma.SupplierReturnWhereInput | Prisma.SupplierReturnWhereInput[];
    id?: Prisma.StringFilter<"SupplierReturn"> | string;
    orgId?: Prisma.StringFilter<"SupplierReturn"> | string;
    branchId?: Prisma.StringFilter<"SupplierReturn"> | string;
    supplierId?: Prisma.StringFilter<"SupplierReturn"> | string;
    lotId?: Prisma.StringFilter<"SupplierReturn"> | string;
    quantity?: Prisma.IntFilter<"SupplierReturn"> | number;
    creditAmount?: Prisma.DecimalFilter<"SupplierReturn"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFilter<"SupplierReturn"> | string;
    createdBy?: Prisma.StringFilter<"SupplierReturn"> | string;
    createdAt?: Prisma.DateTimeFilter<"SupplierReturn"> | Date | string;
};
export type SupplierReturnOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    creditAmount?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SupplierReturnWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SupplierReturnWhereInput | Prisma.SupplierReturnWhereInput[];
    OR?: Prisma.SupplierReturnWhereInput[];
    NOT?: Prisma.SupplierReturnWhereInput | Prisma.SupplierReturnWhereInput[];
    orgId?: Prisma.StringFilter<"SupplierReturn"> | string;
    branchId?: Prisma.StringFilter<"SupplierReturn"> | string;
    supplierId?: Prisma.StringFilter<"SupplierReturn"> | string;
    lotId?: Prisma.StringFilter<"SupplierReturn"> | string;
    quantity?: Prisma.IntFilter<"SupplierReturn"> | number;
    creditAmount?: Prisma.DecimalFilter<"SupplierReturn"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFilter<"SupplierReturn"> | string;
    createdBy?: Prisma.StringFilter<"SupplierReturn"> | string;
    createdAt?: Prisma.DateTimeFilter<"SupplierReturn"> | Date | string;
}, "id">;
export type SupplierReturnOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    creditAmount?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.SupplierReturnCountOrderByAggregateInput;
    _avg?: Prisma.SupplierReturnAvgOrderByAggregateInput;
    _max?: Prisma.SupplierReturnMaxOrderByAggregateInput;
    _min?: Prisma.SupplierReturnMinOrderByAggregateInput;
    _sum?: Prisma.SupplierReturnSumOrderByAggregateInput;
};
export type SupplierReturnScalarWhereWithAggregatesInput = {
    AND?: Prisma.SupplierReturnScalarWhereWithAggregatesInput | Prisma.SupplierReturnScalarWhereWithAggregatesInput[];
    OR?: Prisma.SupplierReturnScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SupplierReturnScalarWhereWithAggregatesInput | Prisma.SupplierReturnScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SupplierReturn"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"SupplierReturn"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"SupplierReturn"> | string;
    supplierId?: Prisma.StringWithAggregatesFilter<"SupplierReturn"> | string;
    lotId?: Prisma.StringWithAggregatesFilter<"SupplierReturn"> | string;
    quantity?: Prisma.IntWithAggregatesFilter<"SupplierReturn"> | number;
    creditAmount?: Prisma.DecimalWithAggregatesFilter<"SupplierReturn"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringWithAggregatesFilter<"SupplierReturn"> | string;
    createdBy?: Prisma.StringWithAggregatesFilter<"SupplierReturn"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SupplierReturn"> | Date | string;
};
export type SupplierReturnCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    supplierId: string;
    lotId: string;
    quantity: number;
    creditAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    createdBy: string;
    createdAt?: Date | string;
};
export type SupplierReturnUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    supplierId: string;
    lotId: string;
    quantity: number;
    creditAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    createdBy: string;
    createdAt?: Date | string;
};
export type SupplierReturnUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    creditAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierReturnUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    creditAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierReturnCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    supplierId: string;
    lotId: string;
    quantity: number;
    creditAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    createdBy: string;
    createdAt?: Date | string;
};
export type SupplierReturnUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    creditAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierReturnUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    creditAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierReturnCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    creditAmount?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SupplierReturnAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    creditAmount?: Prisma.SortOrder;
};
export type SupplierReturnMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    creditAmount?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SupplierReturnMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    creditAmount?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SupplierReturnSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    creditAmount?: Prisma.SortOrder;
};
export type SupplierReturnSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    supplierId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    creditAmount?: boolean;
    reason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["supplierReturn"]>;
export type SupplierReturnSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    supplierId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    creditAmount?: boolean;
    reason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["supplierReturn"]>;
export type SupplierReturnSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    supplierId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    creditAmount?: boolean;
    reason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["supplierReturn"]>;
export type SupplierReturnSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    supplierId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    creditAmount?: boolean;
    reason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
};
export type SupplierReturnOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "supplierId" | "lotId" | "quantity" | "creditAmount" | "reason" | "createdBy" | "createdAt", ExtArgs["result"]["supplierReturn"]>;
export type $SupplierReturnPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SupplierReturn";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        supplierId: string;
        lotId: string;
        quantity: number;
        creditAmount: runtime.Decimal;
        reason: string;
        createdBy: string;
        createdAt: Date;
    }, ExtArgs["result"]["supplierReturn"]>;
    composites: {};
};
export type SupplierReturnGetPayload<S extends boolean | null | undefined | SupplierReturnDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SupplierReturnPayload, S>;
export type SupplierReturnCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SupplierReturnFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SupplierReturnCountAggregateInputType | true;
};
export interface SupplierReturnDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SupplierReturn'];
        meta: {
            name: 'SupplierReturn';
        };
    };
    findUnique<T extends SupplierReturnFindUniqueArgs>(args: Prisma.SelectSubset<T, SupplierReturnFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SupplierReturnClient<runtime.Types.Result.GetResult<Prisma.$SupplierReturnPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SupplierReturnFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SupplierReturnFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SupplierReturnClient<runtime.Types.Result.GetResult<Prisma.$SupplierReturnPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SupplierReturnFindFirstArgs>(args?: Prisma.SelectSubset<T, SupplierReturnFindFirstArgs<ExtArgs>>): Prisma.Prisma__SupplierReturnClient<runtime.Types.Result.GetResult<Prisma.$SupplierReturnPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SupplierReturnFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SupplierReturnFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SupplierReturnClient<runtime.Types.Result.GetResult<Prisma.$SupplierReturnPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SupplierReturnFindManyArgs>(args?: Prisma.SelectSubset<T, SupplierReturnFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierReturnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SupplierReturnCreateArgs>(args: Prisma.SelectSubset<T, SupplierReturnCreateArgs<ExtArgs>>): Prisma.Prisma__SupplierReturnClient<runtime.Types.Result.GetResult<Prisma.$SupplierReturnPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SupplierReturnCreateManyArgs>(args?: Prisma.SelectSubset<T, SupplierReturnCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SupplierReturnCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SupplierReturnCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierReturnPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SupplierReturnDeleteArgs>(args: Prisma.SelectSubset<T, SupplierReturnDeleteArgs<ExtArgs>>): Prisma.Prisma__SupplierReturnClient<runtime.Types.Result.GetResult<Prisma.$SupplierReturnPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SupplierReturnUpdateArgs>(args: Prisma.SelectSubset<T, SupplierReturnUpdateArgs<ExtArgs>>): Prisma.Prisma__SupplierReturnClient<runtime.Types.Result.GetResult<Prisma.$SupplierReturnPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SupplierReturnDeleteManyArgs>(args?: Prisma.SelectSubset<T, SupplierReturnDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SupplierReturnUpdateManyArgs>(args: Prisma.SelectSubset<T, SupplierReturnUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SupplierReturnUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SupplierReturnUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierReturnPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SupplierReturnUpsertArgs>(args: Prisma.SelectSubset<T, SupplierReturnUpsertArgs<ExtArgs>>): Prisma.Prisma__SupplierReturnClient<runtime.Types.Result.GetResult<Prisma.$SupplierReturnPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SupplierReturnCountArgs>(args?: Prisma.Subset<T, SupplierReturnCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SupplierReturnCountAggregateOutputType> : number>;
    aggregate<T extends SupplierReturnAggregateArgs>(args: Prisma.Subset<T, SupplierReturnAggregateArgs>): Prisma.PrismaPromise<GetSupplierReturnAggregateType<T>>;
    groupBy<T extends SupplierReturnGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SupplierReturnGroupByArgs['orderBy'];
    } : {
        orderBy?: SupplierReturnGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SupplierReturnGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierReturnGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SupplierReturnFieldRefs;
}
export interface Prisma__SupplierReturnClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SupplierReturnFieldRefs {
    readonly id: Prisma.FieldRef<"SupplierReturn", 'String'>;
    readonly orgId: Prisma.FieldRef<"SupplierReturn", 'String'>;
    readonly branchId: Prisma.FieldRef<"SupplierReturn", 'String'>;
    readonly supplierId: Prisma.FieldRef<"SupplierReturn", 'String'>;
    readonly lotId: Prisma.FieldRef<"SupplierReturn", 'String'>;
    readonly quantity: Prisma.FieldRef<"SupplierReturn", 'Int'>;
    readonly creditAmount: Prisma.FieldRef<"SupplierReturn", 'Decimal'>;
    readonly reason: Prisma.FieldRef<"SupplierReturn", 'String'>;
    readonly createdBy: Prisma.FieldRef<"SupplierReturn", 'String'>;
    readonly createdAt: Prisma.FieldRef<"SupplierReturn", 'DateTime'>;
}
export type SupplierReturnFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierReturnSelect<ExtArgs> | null;
    omit?: Prisma.SupplierReturnOmit<ExtArgs> | null;
    where: Prisma.SupplierReturnWhereUniqueInput;
};
export type SupplierReturnFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierReturnSelect<ExtArgs> | null;
    omit?: Prisma.SupplierReturnOmit<ExtArgs> | null;
    where: Prisma.SupplierReturnWhereUniqueInput;
};
export type SupplierReturnFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierReturnSelect<ExtArgs> | null;
    omit?: Prisma.SupplierReturnOmit<ExtArgs> | null;
    where?: Prisma.SupplierReturnWhereInput;
    orderBy?: Prisma.SupplierReturnOrderByWithRelationInput | Prisma.SupplierReturnOrderByWithRelationInput[];
    cursor?: Prisma.SupplierReturnWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SupplierReturnScalarFieldEnum | Prisma.SupplierReturnScalarFieldEnum[];
};
export type SupplierReturnFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierReturnSelect<ExtArgs> | null;
    omit?: Prisma.SupplierReturnOmit<ExtArgs> | null;
    where?: Prisma.SupplierReturnWhereInput;
    orderBy?: Prisma.SupplierReturnOrderByWithRelationInput | Prisma.SupplierReturnOrderByWithRelationInput[];
    cursor?: Prisma.SupplierReturnWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SupplierReturnScalarFieldEnum | Prisma.SupplierReturnScalarFieldEnum[];
};
export type SupplierReturnFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierReturnSelect<ExtArgs> | null;
    omit?: Prisma.SupplierReturnOmit<ExtArgs> | null;
    where?: Prisma.SupplierReturnWhereInput;
    orderBy?: Prisma.SupplierReturnOrderByWithRelationInput | Prisma.SupplierReturnOrderByWithRelationInput[];
    cursor?: Prisma.SupplierReturnWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SupplierReturnScalarFieldEnum | Prisma.SupplierReturnScalarFieldEnum[];
};
export type SupplierReturnCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierReturnSelect<ExtArgs> | null;
    omit?: Prisma.SupplierReturnOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SupplierReturnCreateInput, Prisma.SupplierReturnUncheckedCreateInput>;
};
export type SupplierReturnCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SupplierReturnCreateManyInput | Prisma.SupplierReturnCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SupplierReturnCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierReturnSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SupplierReturnOmit<ExtArgs> | null;
    data: Prisma.SupplierReturnCreateManyInput | Prisma.SupplierReturnCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SupplierReturnUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierReturnSelect<ExtArgs> | null;
    omit?: Prisma.SupplierReturnOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SupplierReturnUpdateInput, Prisma.SupplierReturnUncheckedUpdateInput>;
    where: Prisma.SupplierReturnWhereUniqueInput;
};
export type SupplierReturnUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SupplierReturnUpdateManyMutationInput, Prisma.SupplierReturnUncheckedUpdateManyInput>;
    where?: Prisma.SupplierReturnWhereInput;
    limit?: number;
};
export type SupplierReturnUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierReturnSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SupplierReturnOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SupplierReturnUpdateManyMutationInput, Prisma.SupplierReturnUncheckedUpdateManyInput>;
    where?: Prisma.SupplierReturnWhereInput;
    limit?: number;
};
export type SupplierReturnUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierReturnSelect<ExtArgs> | null;
    omit?: Prisma.SupplierReturnOmit<ExtArgs> | null;
    where: Prisma.SupplierReturnWhereUniqueInput;
    create: Prisma.XOR<Prisma.SupplierReturnCreateInput, Prisma.SupplierReturnUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SupplierReturnUpdateInput, Prisma.SupplierReturnUncheckedUpdateInput>;
};
export type SupplierReturnDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierReturnSelect<ExtArgs> | null;
    omit?: Prisma.SupplierReturnOmit<ExtArgs> | null;
    where: Prisma.SupplierReturnWhereUniqueInput;
};
export type SupplierReturnDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierReturnWhereInput;
    limit?: number;
};
export type SupplierReturnDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierReturnSelect<ExtArgs> | null;
    omit?: Prisma.SupplierReturnOmit<ExtArgs> | null;
};
