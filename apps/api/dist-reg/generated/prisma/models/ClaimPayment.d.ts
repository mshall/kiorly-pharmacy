import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ClaimPaymentModel = runtime.Types.Result.DefaultSelection<Prisma.$ClaimPaymentPayload>;
export type AggregateClaimPayment = {
    _count: ClaimPaymentCountAggregateOutputType | null;
    _avg: ClaimPaymentAvgAggregateOutputType | null;
    _sum: ClaimPaymentSumAggregateOutputType | null;
    _min: ClaimPaymentMinAggregateOutputType | null;
    _max: ClaimPaymentMaxAggregateOutputType | null;
};
export type ClaimPaymentAvgAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type ClaimPaymentSumAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type ClaimPaymentMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    claimId: string | null;
    amount: runtime.Decimal | null;
    reference: string | null;
    paidAt: Date | null;
    createdBy: string | null;
};
export type ClaimPaymentMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    claimId: string | null;
    amount: runtime.Decimal | null;
    reference: string | null;
    paidAt: Date | null;
    createdBy: string | null;
};
export type ClaimPaymentCountAggregateOutputType = {
    id: number;
    orgId: number;
    claimId: number;
    amount: number;
    reference: number;
    paidAt: number;
    createdBy: number;
    _all: number;
};
export type ClaimPaymentAvgAggregateInputType = {
    amount?: true;
};
export type ClaimPaymentSumAggregateInputType = {
    amount?: true;
};
export type ClaimPaymentMinAggregateInputType = {
    id?: true;
    orgId?: true;
    claimId?: true;
    amount?: true;
    reference?: true;
    paidAt?: true;
    createdBy?: true;
};
export type ClaimPaymentMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    claimId?: true;
    amount?: true;
    reference?: true;
    paidAt?: true;
    createdBy?: true;
};
export type ClaimPaymentCountAggregateInputType = {
    id?: true;
    orgId?: true;
    claimId?: true;
    amount?: true;
    reference?: true;
    paidAt?: true;
    createdBy?: true;
    _all?: true;
};
export type ClaimPaymentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClaimPaymentWhereInput;
    orderBy?: Prisma.ClaimPaymentOrderByWithRelationInput | Prisma.ClaimPaymentOrderByWithRelationInput[];
    cursor?: Prisma.ClaimPaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ClaimPaymentCountAggregateInputType;
    _avg?: ClaimPaymentAvgAggregateInputType;
    _sum?: ClaimPaymentSumAggregateInputType;
    _min?: ClaimPaymentMinAggregateInputType;
    _max?: ClaimPaymentMaxAggregateInputType;
};
export type GetClaimPaymentAggregateType<T extends ClaimPaymentAggregateArgs> = {
    [P in keyof T & keyof AggregateClaimPayment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateClaimPayment[P]> : Prisma.GetScalarType<T[P], AggregateClaimPayment[P]>;
};
export type ClaimPaymentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClaimPaymentWhereInput;
    orderBy?: Prisma.ClaimPaymentOrderByWithAggregationInput | Prisma.ClaimPaymentOrderByWithAggregationInput[];
    by: Prisma.ClaimPaymentScalarFieldEnum[] | Prisma.ClaimPaymentScalarFieldEnum;
    having?: Prisma.ClaimPaymentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ClaimPaymentCountAggregateInputType | true;
    _avg?: ClaimPaymentAvgAggregateInputType;
    _sum?: ClaimPaymentSumAggregateInputType;
    _min?: ClaimPaymentMinAggregateInputType;
    _max?: ClaimPaymentMaxAggregateInputType;
};
export type ClaimPaymentGroupByOutputType = {
    id: string;
    orgId: string;
    claimId: string;
    amount: runtime.Decimal;
    reference: string | null;
    paidAt: Date;
    createdBy: string;
    _count: ClaimPaymentCountAggregateOutputType | null;
    _avg: ClaimPaymentAvgAggregateOutputType | null;
    _sum: ClaimPaymentSumAggregateOutputType | null;
    _min: ClaimPaymentMinAggregateOutputType | null;
    _max: ClaimPaymentMaxAggregateOutputType | null;
};
export type GetClaimPaymentGroupByPayload<T extends ClaimPaymentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ClaimPaymentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ClaimPaymentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ClaimPaymentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ClaimPaymentGroupByOutputType[P]>;
}>>;
export type ClaimPaymentWhereInput = {
    AND?: Prisma.ClaimPaymentWhereInput | Prisma.ClaimPaymentWhereInput[];
    OR?: Prisma.ClaimPaymentWhereInput[];
    NOT?: Prisma.ClaimPaymentWhereInput | Prisma.ClaimPaymentWhereInput[];
    id?: Prisma.StringFilter<"ClaimPayment"> | string;
    orgId?: Prisma.StringFilter<"ClaimPayment"> | string;
    claimId?: Prisma.StringFilter<"ClaimPayment"> | string;
    amount?: Prisma.DecimalFilter<"ClaimPayment"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference?: Prisma.StringNullableFilter<"ClaimPayment"> | string | null;
    paidAt?: Prisma.DateTimeFilter<"ClaimPayment"> | Date | string;
    createdBy?: Prisma.StringFilter<"ClaimPayment"> | string;
};
export type ClaimPaymentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    claimId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    reference?: Prisma.SortOrderInput | Prisma.SortOrder;
    paidAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
};
export type ClaimPaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ClaimPaymentWhereInput | Prisma.ClaimPaymentWhereInput[];
    OR?: Prisma.ClaimPaymentWhereInput[];
    NOT?: Prisma.ClaimPaymentWhereInput | Prisma.ClaimPaymentWhereInput[];
    orgId?: Prisma.StringFilter<"ClaimPayment"> | string;
    claimId?: Prisma.StringFilter<"ClaimPayment"> | string;
    amount?: Prisma.DecimalFilter<"ClaimPayment"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference?: Prisma.StringNullableFilter<"ClaimPayment"> | string | null;
    paidAt?: Prisma.DateTimeFilter<"ClaimPayment"> | Date | string;
    createdBy?: Prisma.StringFilter<"ClaimPayment"> | string;
}, "id">;
export type ClaimPaymentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    claimId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    reference?: Prisma.SortOrderInput | Prisma.SortOrder;
    paidAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    _count?: Prisma.ClaimPaymentCountOrderByAggregateInput;
    _avg?: Prisma.ClaimPaymentAvgOrderByAggregateInput;
    _max?: Prisma.ClaimPaymentMaxOrderByAggregateInput;
    _min?: Prisma.ClaimPaymentMinOrderByAggregateInput;
    _sum?: Prisma.ClaimPaymentSumOrderByAggregateInput;
};
export type ClaimPaymentScalarWhereWithAggregatesInput = {
    AND?: Prisma.ClaimPaymentScalarWhereWithAggregatesInput | Prisma.ClaimPaymentScalarWhereWithAggregatesInput[];
    OR?: Prisma.ClaimPaymentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ClaimPaymentScalarWhereWithAggregatesInput | Prisma.ClaimPaymentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ClaimPayment"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"ClaimPayment"> | string;
    claimId?: Prisma.StringWithAggregatesFilter<"ClaimPayment"> | string;
    amount?: Prisma.DecimalWithAggregatesFilter<"ClaimPayment"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference?: Prisma.StringNullableWithAggregatesFilter<"ClaimPayment"> | string | null;
    paidAt?: Prisma.DateTimeWithAggregatesFilter<"ClaimPayment"> | Date | string;
    createdBy?: Prisma.StringWithAggregatesFilter<"ClaimPayment"> | string;
};
export type ClaimPaymentCreateInput = {
    id?: string;
    orgId: string;
    claimId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference?: string | null;
    paidAt?: Date | string;
    createdBy: string;
};
export type ClaimPaymentUncheckedCreateInput = {
    id?: string;
    orgId: string;
    claimId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference?: string | null;
    paidAt?: Date | string;
    createdBy: string;
};
export type ClaimPaymentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    claimId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paidAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ClaimPaymentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    claimId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paidAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ClaimPaymentCreateManyInput = {
    id?: string;
    orgId: string;
    claimId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference?: string | null;
    paidAt?: Date | string;
    createdBy: string;
};
export type ClaimPaymentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    claimId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paidAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ClaimPaymentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    claimId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paidAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ClaimPaymentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    claimId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    paidAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
};
export type ClaimPaymentAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type ClaimPaymentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    claimId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    paidAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
};
export type ClaimPaymentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    claimId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    paidAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
};
export type ClaimPaymentSumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type ClaimPaymentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    claimId?: boolean;
    amount?: boolean;
    reference?: boolean;
    paidAt?: boolean;
    createdBy?: boolean;
}, ExtArgs["result"]["claimPayment"]>;
export type ClaimPaymentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    claimId?: boolean;
    amount?: boolean;
    reference?: boolean;
    paidAt?: boolean;
    createdBy?: boolean;
}, ExtArgs["result"]["claimPayment"]>;
export type ClaimPaymentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    claimId?: boolean;
    amount?: boolean;
    reference?: boolean;
    paidAt?: boolean;
    createdBy?: boolean;
}, ExtArgs["result"]["claimPayment"]>;
export type ClaimPaymentSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    claimId?: boolean;
    amount?: boolean;
    reference?: boolean;
    paidAt?: boolean;
    createdBy?: boolean;
};
export type ClaimPaymentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "claimId" | "amount" | "reference" | "paidAt" | "createdBy", ExtArgs["result"]["claimPayment"]>;
export type $ClaimPaymentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ClaimPayment";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        claimId: string;
        amount: runtime.Decimal;
        reference: string | null;
        paidAt: Date;
        createdBy: string;
    }, ExtArgs["result"]["claimPayment"]>;
    composites: {};
};
export type ClaimPaymentGetPayload<S extends boolean | null | undefined | ClaimPaymentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ClaimPaymentPayload, S>;
export type ClaimPaymentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ClaimPaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ClaimPaymentCountAggregateInputType | true;
};
export interface ClaimPaymentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ClaimPayment'];
        meta: {
            name: 'ClaimPayment';
        };
    };
    findUnique<T extends ClaimPaymentFindUniqueArgs>(args: Prisma.SelectSubset<T, ClaimPaymentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ClaimPaymentClient<runtime.Types.Result.GetResult<Prisma.$ClaimPaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ClaimPaymentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ClaimPaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClaimPaymentClient<runtime.Types.Result.GetResult<Prisma.$ClaimPaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ClaimPaymentFindFirstArgs>(args?: Prisma.SelectSubset<T, ClaimPaymentFindFirstArgs<ExtArgs>>): Prisma.Prisma__ClaimPaymentClient<runtime.Types.Result.GetResult<Prisma.$ClaimPaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ClaimPaymentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ClaimPaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClaimPaymentClient<runtime.Types.Result.GetResult<Prisma.$ClaimPaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ClaimPaymentFindManyArgs>(args?: Prisma.SelectSubset<T, ClaimPaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClaimPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ClaimPaymentCreateArgs>(args: Prisma.SelectSubset<T, ClaimPaymentCreateArgs<ExtArgs>>): Prisma.Prisma__ClaimPaymentClient<runtime.Types.Result.GetResult<Prisma.$ClaimPaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ClaimPaymentCreateManyArgs>(args?: Prisma.SelectSubset<T, ClaimPaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ClaimPaymentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ClaimPaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClaimPaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ClaimPaymentDeleteArgs>(args: Prisma.SelectSubset<T, ClaimPaymentDeleteArgs<ExtArgs>>): Prisma.Prisma__ClaimPaymentClient<runtime.Types.Result.GetResult<Prisma.$ClaimPaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ClaimPaymentUpdateArgs>(args: Prisma.SelectSubset<T, ClaimPaymentUpdateArgs<ExtArgs>>): Prisma.Prisma__ClaimPaymentClient<runtime.Types.Result.GetResult<Prisma.$ClaimPaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ClaimPaymentDeleteManyArgs>(args?: Prisma.SelectSubset<T, ClaimPaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ClaimPaymentUpdateManyArgs>(args: Prisma.SelectSubset<T, ClaimPaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ClaimPaymentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ClaimPaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClaimPaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ClaimPaymentUpsertArgs>(args: Prisma.SelectSubset<T, ClaimPaymentUpsertArgs<ExtArgs>>): Prisma.Prisma__ClaimPaymentClient<runtime.Types.Result.GetResult<Prisma.$ClaimPaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ClaimPaymentCountArgs>(args?: Prisma.Subset<T, ClaimPaymentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ClaimPaymentCountAggregateOutputType> : number>;
    aggregate<T extends ClaimPaymentAggregateArgs>(args: Prisma.Subset<T, ClaimPaymentAggregateArgs>): Prisma.PrismaPromise<GetClaimPaymentAggregateType<T>>;
    groupBy<T extends ClaimPaymentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ClaimPaymentGroupByArgs['orderBy'];
    } : {
        orderBy?: ClaimPaymentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ClaimPaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClaimPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ClaimPaymentFieldRefs;
}
export interface Prisma__ClaimPaymentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ClaimPaymentFieldRefs {
    readonly id: Prisma.FieldRef<"ClaimPayment", 'String'>;
    readonly orgId: Prisma.FieldRef<"ClaimPayment", 'String'>;
    readonly claimId: Prisma.FieldRef<"ClaimPayment", 'String'>;
    readonly amount: Prisma.FieldRef<"ClaimPayment", 'Decimal'>;
    readonly reference: Prisma.FieldRef<"ClaimPayment", 'String'>;
    readonly paidAt: Prisma.FieldRef<"ClaimPayment", 'DateTime'>;
    readonly createdBy: Prisma.FieldRef<"ClaimPayment", 'String'>;
}
export type ClaimPaymentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimPaymentSelect<ExtArgs> | null;
    omit?: Prisma.ClaimPaymentOmit<ExtArgs> | null;
    where: Prisma.ClaimPaymentWhereUniqueInput;
};
export type ClaimPaymentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimPaymentSelect<ExtArgs> | null;
    omit?: Prisma.ClaimPaymentOmit<ExtArgs> | null;
    where: Prisma.ClaimPaymentWhereUniqueInput;
};
export type ClaimPaymentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimPaymentSelect<ExtArgs> | null;
    omit?: Prisma.ClaimPaymentOmit<ExtArgs> | null;
    where?: Prisma.ClaimPaymentWhereInput;
    orderBy?: Prisma.ClaimPaymentOrderByWithRelationInput | Prisma.ClaimPaymentOrderByWithRelationInput[];
    cursor?: Prisma.ClaimPaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClaimPaymentScalarFieldEnum | Prisma.ClaimPaymentScalarFieldEnum[];
};
export type ClaimPaymentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimPaymentSelect<ExtArgs> | null;
    omit?: Prisma.ClaimPaymentOmit<ExtArgs> | null;
    where?: Prisma.ClaimPaymentWhereInput;
    orderBy?: Prisma.ClaimPaymentOrderByWithRelationInput | Prisma.ClaimPaymentOrderByWithRelationInput[];
    cursor?: Prisma.ClaimPaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClaimPaymentScalarFieldEnum | Prisma.ClaimPaymentScalarFieldEnum[];
};
export type ClaimPaymentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimPaymentSelect<ExtArgs> | null;
    omit?: Prisma.ClaimPaymentOmit<ExtArgs> | null;
    where?: Prisma.ClaimPaymentWhereInput;
    orderBy?: Prisma.ClaimPaymentOrderByWithRelationInput | Prisma.ClaimPaymentOrderByWithRelationInput[];
    cursor?: Prisma.ClaimPaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClaimPaymentScalarFieldEnum | Prisma.ClaimPaymentScalarFieldEnum[];
};
export type ClaimPaymentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimPaymentSelect<ExtArgs> | null;
    omit?: Prisma.ClaimPaymentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ClaimPaymentCreateInput, Prisma.ClaimPaymentUncheckedCreateInput>;
};
export type ClaimPaymentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ClaimPaymentCreateManyInput | Prisma.ClaimPaymentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ClaimPaymentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimPaymentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ClaimPaymentOmit<ExtArgs> | null;
    data: Prisma.ClaimPaymentCreateManyInput | Prisma.ClaimPaymentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ClaimPaymentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimPaymentSelect<ExtArgs> | null;
    omit?: Prisma.ClaimPaymentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ClaimPaymentUpdateInput, Prisma.ClaimPaymentUncheckedUpdateInput>;
    where: Prisma.ClaimPaymentWhereUniqueInput;
};
export type ClaimPaymentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ClaimPaymentUpdateManyMutationInput, Prisma.ClaimPaymentUncheckedUpdateManyInput>;
    where?: Prisma.ClaimPaymentWhereInput;
    limit?: number;
};
export type ClaimPaymentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimPaymentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ClaimPaymentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ClaimPaymentUpdateManyMutationInput, Prisma.ClaimPaymentUncheckedUpdateManyInput>;
    where?: Prisma.ClaimPaymentWhereInput;
    limit?: number;
};
export type ClaimPaymentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimPaymentSelect<ExtArgs> | null;
    omit?: Prisma.ClaimPaymentOmit<ExtArgs> | null;
    where: Prisma.ClaimPaymentWhereUniqueInput;
    create: Prisma.XOR<Prisma.ClaimPaymentCreateInput, Prisma.ClaimPaymentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ClaimPaymentUpdateInput, Prisma.ClaimPaymentUncheckedUpdateInput>;
};
export type ClaimPaymentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimPaymentSelect<ExtArgs> | null;
    omit?: Prisma.ClaimPaymentOmit<ExtArgs> | null;
    where: Prisma.ClaimPaymentWhereUniqueInput;
};
export type ClaimPaymentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClaimPaymentWhereInput;
    limit?: number;
};
export type ClaimPaymentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClaimPaymentSelect<ExtArgs> | null;
    omit?: Prisma.ClaimPaymentOmit<ExtArgs> | null;
};
