import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type PromotionRedemptionModel = runtime.Types.Result.DefaultSelection<Prisma.$PromotionRedemptionPayload>;
export type AggregatePromotionRedemption = {
    _count: PromotionRedemptionCountAggregateOutputType | null;
    _avg: PromotionRedemptionAvgAggregateOutputType | null;
    _sum: PromotionRedemptionSumAggregateOutputType | null;
    _min: PromotionRedemptionMinAggregateOutputType | null;
    _max: PromotionRedemptionMaxAggregateOutputType | null;
};
export type PromotionRedemptionAvgAggregateOutputType = {
    discountAmount: runtime.Decimal | null;
};
export type PromotionRedemptionSumAggregateOutputType = {
    discountAmount: runtime.Decimal | null;
};
export type PromotionRedemptionMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    promotionId: string | null;
    saleId: string | null;
    patientId: string | null;
    discountAmount: runtime.Decimal | null;
    couponCode: string | null;
    createdAt: Date | null;
};
export type PromotionRedemptionMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    promotionId: string | null;
    saleId: string | null;
    patientId: string | null;
    discountAmount: runtime.Decimal | null;
    couponCode: string | null;
    createdAt: Date | null;
};
export type PromotionRedemptionCountAggregateOutputType = {
    id: number;
    orgId: number;
    promotionId: number;
    saleId: number;
    patientId: number;
    discountAmount: number;
    couponCode: number;
    createdAt: number;
    _all: number;
};
export type PromotionRedemptionAvgAggregateInputType = {
    discountAmount?: true;
};
export type PromotionRedemptionSumAggregateInputType = {
    discountAmount?: true;
};
export type PromotionRedemptionMinAggregateInputType = {
    id?: true;
    orgId?: true;
    promotionId?: true;
    saleId?: true;
    patientId?: true;
    discountAmount?: true;
    couponCode?: true;
    createdAt?: true;
};
export type PromotionRedemptionMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    promotionId?: true;
    saleId?: true;
    patientId?: true;
    discountAmount?: true;
    couponCode?: true;
    createdAt?: true;
};
export type PromotionRedemptionCountAggregateInputType = {
    id?: true;
    orgId?: true;
    promotionId?: true;
    saleId?: true;
    patientId?: true;
    discountAmount?: true;
    couponCode?: true;
    createdAt?: true;
    _all?: true;
};
export type PromotionRedemptionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionRedemptionWhereInput;
    orderBy?: Prisma.PromotionRedemptionOrderByWithRelationInput | Prisma.PromotionRedemptionOrderByWithRelationInput[];
    cursor?: Prisma.PromotionRedemptionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PromotionRedemptionCountAggregateInputType;
    _avg?: PromotionRedemptionAvgAggregateInputType;
    _sum?: PromotionRedemptionSumAggregateInputType;
    _min?: PromotionRedemptionMinAggregateInputType;
    _max?: PromotionRedemptionMaxAggregateInputType;
};
export type GetPromotionRedemptionAggregateType<T extends PromotionRedemptionAggregateArgs> = {
    [P in keyof T & keyof AggregatePromotionRedemption]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePromotionRedemption[P]> : Prisma.GetScalarType<T[P], AggregatePromotionRedemption[P]>;
};
export type PromotionRedemptionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionRedemptionWhereInput;
    orderBy?: Prisma.PromotionRedemptionOrderByWithAggregationInput | Prisma.PromotionRedemptionOrderByWithAggregationInput[];
    by: Prisma.PromotionRedemptionScalarFieldEnum[] | Prisma.PromotionRedemptionScalarFieldEnum;
    having?: Prisma.PromotionRedemptionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PromotionRedemptionCountAggregateInputType | true;
    _avg?: PromotionRedemptionAvgAggregateInputType;
    _sum?: PromotionRedemptionSumAggregateInputType;
    _min?: PromotionRedemptionMinAggregateInputType;
    _max?: PromotionRedemptionMaxAggregateInputType;
};
export type PromotionRedemptionGroupByOutputType = {
    id: string;
    orgId: string;
    promotionId: string;
    saleId: string;
    patientId: string | null;
    discountAmount: runtime.Decimal;
    couponCode: string | null;
    createdAt: Date;
    _count: PromotionRedemptionCountAggregateOutputType | null;
    _avg: PromotionRedemptionAvgAggregateOutputType | null;
    _sum: PromotionRedemptionSumAggregateOutputType | null;
    _min: PromotionRedemptionMinAggregateOutputType | null;
    _max: PromotionRedemptionMaxAggregateOutputType | null;
};
export type GetPromotionRedemptionGroupByPayload<T extends PromotionRedemptionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PromotionRedemptionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PromotionRedemptionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PromotionRedemptionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PromotionRedemptionGroupByOutputType[P]>;
}>>;
export type PromotionRedemptionWhereInput = {
    AND?: Prisma.PromotionRedemptionWhereInput | Prisma.PromotionRedemptionWhereInput[];
    OR?: Prisma.PromotionRedemptionWhereInput[];
    NOT?: Prisma.PromotionRedemptionWhereInput | Prisma.PromotionRedemptionWhereInput[];
    id?: Prisma.StringFilter<"PromotionRedemption"> | string;
    orgId?: Prisma.StringFilter<"PromotionRedemption"> | string;
    promotionId?: Prisma.StringFilter<"PromotionRedemption"> | string;
    saleId?: Prisma.StringFilter<"PromotionRedemption"> | string;
    patientId?: Prisma.StringNullableFilter<"PromotionRedemption"> | string | null;
    discountAmount?: Prisma.DecimalFilter<"PromotionRedemption"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    couponCode?: Prisma.StringNullableFilter<"PromotionRedemption"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PromotionRedemption"> | Date | string;
};
export type PromotionRedemptionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    promotionId?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrderInput | Prisma.SortOrder;
    discountAmount?: Prisma.SortOrder;
    couponCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PromotionRedemptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PromotionRedemptionWhereInput | Prisma.PromotionRedemptionWhereInput[];
    OR?: Prisma.PromotionRedemptionWhereInput[];
    NOT?: Prisma.PromotionRedemptionWhereInput | Prisma.PromotionRedemptionWhereInput[];
    orgId?: Prisma.StringFilter<"PromotionRedemption"> | string;
    promotionId?: Prisma.StringFilter<"PromotionRedemption"> | string;
    saleId?: Prisma.StringFilter<"PromotionRedemption"> | string;
    patientId?: Prisma.StringNullableFilter<"PromotionRedemption"> | string | null;
    discountAmount?: Prisma.DecimalFilter<"PromotionRedemption"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    couponCode?: Prisma.StringNullableFilter<"PromotionRedemption"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PromotionRedemption"> | Date | string;
}, "id">;
export type PromotionRedemptionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    promotionId?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrderInput | Prisma.SortOrder;
    discountAmount?: Prisma.SortOrder;
    couponCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.PromotionRedemptionCountOrderByAggregateInput;
    _avg?: Prisma.PromotionRedemptionAvgOrderByAggregateInput;
    _max?: Prisma.PromotionRedemptionMaxOrderByAggregateInput;
    _min?: Prisma.PromotionRedemptionMinOrderByAggregateInput;
    _sum?: Prisma.PromotionRedemptionSumOrderByAggregateInput;
};
export type PromotionRedemptionScalarWhereWithAggregatesInput = {
    AND?: Prisma.PromotionRedemptionScalarWhereWithAggregatesInput | Prisma.PromotionRedemptionScalarWhereWithAggregatesInput[];
    OR?: Prisma.PromotionRedemptionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PromotionRedemptionScalarWhereWithAggregatesInput | Prisma.PromotionRedemptionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PromotionRedemption"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"PromotionRedemption"> | string;
    promotionId?: Prisma.StringWithAggregatesFilter<"PromotionRedemption"> | string;
    saleId?: Prisma.StringWithAggregatesFilter<"PromotionRedemption"> | string;
    patientId?: Prisma.StringNullableWithAggregatesFilter<"PromotionRedemption"> | string | null;
    discountAmount?: Prisma.DecimalWithAggregatesFilter<"PromotionRedemption"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    couponCode?: Prisma.StringNullableWithAggregatesFilter<"PromotionRedemption"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PromotionRedemption"> | Date | string;
};
export type PromotionRedemptionCreateInput = {
    id?: string;
    orgId: string;
    promotionId: string;
    saleId: string;
    patientId?: string | null;
    discountAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    couponCode?: string | null;
    createdAt?: Date | string;
};
export type PromotionRedemptionUncheckedCreateInput = {
    id?: string;
    orgId: string;
    promotionId: string;
    saleId: string;
    patientId?: string | null;
    discountAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    couponCode?: string | null;
    createdAt?: Date | string;
};
export type PromotionRedemptionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    promotionId?: Prisma.StringFieldUpdateOperationsInput | string;
    saleId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    discountAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    couponCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionRedemptionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    promotionId?: Prisma.StringFieldUpdateOperationsInput | string;
    saleId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    discountAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    couponCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionRedemptionCreateManyInput = {
    id?: string;
    orgId: string;
    promotionId: string;
    saleId: string;
    patientId?: string | null;
    discountAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    couponCode?: string | null;
    createdAt?: Date | string;
};
export type PromotionRedemptionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    promotionId?: Prisma.StringFieldUpdateOperationsInput | string;
    saleId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    discountAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    couponCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionRedemptionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    promotionId?: Prisma.StringFieldUpdateOperationsInput | string;
    saleId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    discountAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    couponCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionRedemptionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    promotionId?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    discountAmount?: Prisma.SortOrder;
    couponCode?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PromotionRedemptionAvgOrderByAggregateInput = {
    discountAmount?: Prisma.SortOrder;
};
export type PromotionRedemptionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    promotionId?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    discountAmount?: Prisma.SortOrder;
    couponCode?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PromotionRedemptionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    promotionId?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    discountAmount?: Prisma.SortOrder;
    couponCode?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PromotionRedemptionSumOrderByAggregateInput = {
    discountAmount?: Prisma.SortOrder;
};
export type PromotionRedemptionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    promotionId?: boolean;
    saleId?: boolean;
    patientId?: boolean;
    discountAmount?: boolean;
    couponCode?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["promotionRedemption"]>;
export type PromotionRedemptionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    promotionId?: boolean;
    saleId?: boolean;
    patientId?: boolean;
    discountAmount?: boolean;
    couponCode?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["promotionRedemption"]>;
export type PromotionRedemptionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    promotionId?: boolean;
    saleId?: boolean;
    patientId?: boolean;
    discountAmount?: boolean;
    couponCode?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["promotionRedemption"]>;
export type PromotionRedemptionSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    promotionId?: boolean;
    saleId?: boolean;
    patientId?: boolean;
    discountAmount?: boolean;
    couponCode?: boolean;
    createdAt?: boolean;
};
export type PromotionRedemptionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "promotionId" | "saleId" | "patientId" | "discountAmount" | "couponCode" | "createdAt", ExtArgs["result"]["promotionRedemption"]>;
export type $PromotionRedemptionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PromotionRedemption";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        promotionId: string;
        saleId: string;
        patientId: string | null;
        discountAmount: runtime.Decimal;
        couponCode: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["promotionRedemption"]>;
    composites: {};
};
export type PromotionRedemptionGetPayload<S extends boolean | null | undefined | PromotionRedemptionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PromotionRedemptionPayload, S>;
export type PromotionRedemptionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PromotionRedemptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PromotionRedemptionCountAggregateInputType | true;
};
export interface PromotionRedemptionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PromotionRedemption'];
        meta: {
            name: 'PromotionRedemption';
        };
    };
    findUnique<T extends PromotionRedemptionFindUniqueArgs>(args: Prisma.SelectSubset<T, PromotionRedemptionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PromotionRedemptionClient<runtime.Types.Result.GetResult<Prisma.$PromotionRedemptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PromotionRedemptionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PromotionRedemptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PromotionRedemptionClient<runtime.Types.Result.GetResult<Prisma.$PromotionRedemptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PromotionRedemptionFindFirstArgs>(args?: Prisma.SelectSubset<T, PromotionRedemptionFindFirstArgs<ExtArgs>>): Prisma.Prisma__PromotionRedemptionClient<runtime.Types.Result.GetResult<Prisma.$PromotionRedemptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PromotionRedemptionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PromotionRedemptionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PromotionRedemptionClient<runtime.Types.Result.GetResult<Prisma.$PromotionRedemptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PromotionRedemptionFindManyArgs>(args?: Prisma.SelectSubset<T, PromotionRedemptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionRedemptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PromotionRedemptionCreateArgs>(args: Prisma.SelectSubset<T, PromotionRedemptionCreateArgs<ExtArgs>>): Prisma.Prisma__PromotionRedemptionClient<runtime.Types.Result.GetResult<Prisma.$PromotionRedemptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PromotionRedemptionCreateManyArgs>(args?: Prisma.SelectSubset<T, PromotionRedemptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PromotionRedemptionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PromotionRedemptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionRedemptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PromotionRedemptionDeleteArgs>(args: Prisma.SelectSubset<T, PromotionRedemptionDeleteArgs<ExtArgs>>): Prisma.Prisma__PromotionRedemptionClient<runtime.Types.Result.GetResult<Prisma.$PromotionRedemptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PromotionRedemptionUpdateArgs>(args: Prisma.SelectSubset<T, PromotionRedemptionUpdateArgs<ExtArgs>>): Prisma.Prisma__PromotionRedemptionClient<runtime.Types.Result.GetResult<Prisma.$PromotionRedemptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PromotionRedemptionDeleteManyArgs>(args?: Prisma.SelectSubset<T, PromotionRedemptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PromotionRedemptionUpdateManyArgs>(args: Prisma.SelectSubset<T, PromotionRedemptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PromotionRedemptionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PromotionRedemptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionRedemptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PromotionRedemptionUpsertArgs>(args: Prisma.SelectSubset<T, PromotionRedemptionUpsertArgs<ExtArgs>>): Prisma.Prisma__PromotionRedemptionClient<runtime.Types.Result.GetResult<Prisma.$PromotionRedemptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PromotionRedemptionCountArgs>(args?: Prisma.Subset<T, PromotionRedemptionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PromotionRedemptionCountAggregateOutputType> : number>;
    aggregate<T extends PromotionRedemptionAggregateArgs>(args: Prisma.Subset<T, PromotionRedemptionAggregateArgs>): Prisma.PrismaPromise<GetPromotionRedemptionAggregateType<T>>;
    groupBy<T extends PromotionRedemptionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PromotionRedemptionGroupByArgs['orderBy'];
    } : {
        orderBy?: PromotionRedemptionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PromotionRedemptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPromotionRedemptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PromotionRedemptionFieldRefs;
}
export interface Prisma__PromotionRedemptionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PromotionRedemptionFieldRefs {
    readonly id: Prisma.FieldRef<"PromotionRedemption", 'String'>;
    readonly orgId: Prisma.FieldRef<"PromotionRedemption", 'String'>;
    readonly promotionId: Prisma.FieldRef<"PromotionRedemption", 'String'>;
    readonly saleId: Prisma.FieldRef<"PromotionRedemption", 'String'>;
    readonly patientId: Prisma.FieldRef<"PromotionRedemption", 'String'>;
    readonly discountAmount: Prisma.FieldRef<"PromotionRedemption", 'Decimal'>;
    readonly couponCode: Prisma.FieldRef<"PromotionRedemption", 'String'>;
    readonly createdAt: Prisma.FieldRef<"PromotionRedemption", 'DateTime'>;
}
export type PromotionRedemptionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRedemptionSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRedemptionOmit<ExtArgs> | null;
    where: Prisma.PromotionRedemptionWhereUniqueInput;
};
export type PromotionRedemptionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRedemptionSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRedemptionOmit<ExtArgs> | null;
    where: Prisma.PromotionRedemptionWhereUniqueInput;
};
export type PromotionRedemptionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRedemptionSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRedemptionOmit<ExtArgs> | null;
    where?: Prisma.PromotionRedemptionWhereInput;
    orderBy?: Prisma.PromotionRedemptionOrderByWithRelationInput | Prisma.PromotionRedemptionOrderByWithRelationInput[];
    cursor?: Prisma.PromotionRedemptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionRedemptionScalarFieldEnum | Prisma.PromotionRedemptionScalarFieldEnum[];
};
export type PromotionRedemptionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRedemptionSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRedemptionOmit<ExtArgs> | null;
    where?: Prisma.PromotionRedemptionWhereInput;
    orderBy?: Prisma.PromotionRedemptionOrderByWithRelationInput | Prisma.PromotionRedemptionOrderByWithRelationInput[];
    cursor?: Prisma.PromotionRedemptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionRedemptionScalarFieldEnum | Prisma.PromotionRedemptionScalarFieldEnum[];
};
export type PromotionRedemptionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRedemptionSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRedemptionOmit<ExtArgs> | null;
    where?: Prisma.PromotionRedemptionWhereInput;
    orderBy?: Prisma.PromotionRedemptionOrderByWithRelationInput | Prisma.PromotionRedemptionOrderByWithRelationInput[];
    cursor?: Prisma.PromotionRedemptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionRedemptionScalarFieldEnum | Prisma.PromotionRedemptionScalarFieldEnum[];
};
export type PromotionRedemptionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRedemptionSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRedemptionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PromotionRedemptionCreateInput, Prisma.PromotionRedemptionUncheckedCreateInput>;
};
export type PromotionRedemptionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PromotionRedemptionCreateManyInput | Prisma.PromotionRedemptionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PromotionRedemptionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRedemptionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PromotionRedemptionOmit<ExtArgs> | null;
    data: Prisma.PromotionRedemptionCreateManyInput | Prisma.PromotionRedemptionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PromotionRedemptionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRedemptionSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRedemptionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PromotionRedemptionUpdateInput, Prisma.PromotionRedemptionUncheckedUpdateInput>;
    where: Prisma.PromotionRedemptionWhereUniqueInput;
};
export type PromotionRedemptionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PromotionRedemptionUpdateManyMutationInput, Prisma.PromotionRedemptionUncheckedUpdateManyInput>;
    where?: Prisma.PromotionRedemptionWhereInput;
    limit?: number;
};
export type PromotionRedemptionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRedemptionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PromotionRedemptionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PromotionRedemptionUpdateManyMutationInput, Prisma.PromotionRedemptionUncheckedUpdateManyInput>;
    where?: Prisma.PromotionRedemptionWhereInput;
    limit?: number;
};
export type PromotionRedemptionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRedemptionSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRedemptionOmit<ExtArgs> | null;
    where: Prisma.PromotionRedemptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionRedemptionCreateInput, Prisma.PromotionRedemptionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PromotionRedemptionUpdateInput, Prisma.PromotionRedemptionUncheckedUpdateInput>;
};
export type PromotionRedemptionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRedemptionSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRedemptionOmit<ExtArgs> | null;
    where: Prisma.PromotionRedemptionWhereUniqueInput;
};
export type PromotionRedemptionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionRedemptionWhereInput;
    limit?: number;
};
export type PromotionRedemptionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRedemptionSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRedemptionOmit<ExtArgs> | null;
};
