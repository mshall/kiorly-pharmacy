import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type PlanPriceModel = runtime.Types.Result.DefaultSelection<Prisma.$PlanPricePayload>;
export type AggregatePlanPrice = {
    _count: PlanPriceCountAggregateOutputType | null;
    _avg: PlanPriceAvgAggregateOutputType | null;
    _sum: PlanPriceSumAggregateOutputType | null;
    _min: PlanPriceMinAggregateOutputType | null;
    _max: PlanPriceMaxAggregateOutputType | null;
};
export type PlanPriceAvgAggregateOutputType = {
    amount: runtime.Decimal | null;
    priceVersion: number | null;
};
export type PlanPriceSumAggregateOutputType = {
    amount: runtime.Decimal | null;
    priceVersion: number | null;
};
export type PlanPriceMinAggregateOutputType = {
    id: string | null;
    edition: $Enums.Edition | null;
    marketCode: string | null;
    interval: string | null;
    currency: string | null;
    amount: runtime.Decimal | null;
    validFrom: Date | null;
    validTo: Date | null;
    priceVersion: number | null;
    proposalId: string | null;
    proposedBy: string | null;
    publishedBy: string | null;
    createdAt: Date | null;
};
export type PlanPriceMaxAggregateOutputType = {
    id: string | null;
    edition: $Enums.Edition | null;
    marketCode: string | null;
    interval: string | null;
    currency: string | null;
    amount: runtime.Decimal | null;
    validFrom: Date | null;
    validTo: Date | null;
    priceVersion: number | null;
    proposalId: string | null;
    proposedBy: string | null;
    publishedBy: string | null;
    createdAt: Date | null;
};
export type PlanPriceCountAggregateOutputType = {
    id: number;
    edition: number;
    marketCode: number;
    interval: number;
    currency: number;
    amount: number;
    validFrom: number;
    validTo: number;
    priceVersion: number;
    proposalId: number;
    proposedBy: number;
    publishedBy: number;
    createdAt: number;
    _all: number;
};
export type PlanPriceAvgAggregateInputType = {
    amount?: true;
    priceVersion?: true;
};
export type PlanPriceSumAggregateInputType = {
    amount?: true;
    priceVersion?: true;
};
export type PlanPriceMinAggregateInputType = {
    id?: true;
    edition?: true;
    marketCode?: true;
    interval?: true;
    currency?: true;
    amount?: true;
    validFrom?: true;
    validTo?: true;
    priceVersion?: true;
    proposalId?: true;
    proposedBy?: true;
    publishedBy?: true;
    createdAt?: true;
};
export type PlanPriceMaxAggregateInputType = {
    id?: true;
    edition?: true;
    marketCode?: true;
    interval?: true;
    currency?: true;
    amount?: true;
    validFrom?: true;
    validTo?: true;
    priceVersion?: true;
    proposalId?: true;
    proposedBy?: true;
    publishedBy?: true;
    createdAt?: true;
};
export type PlanPriceCountAggregateInputType = {
    id?: true;
    edition?: true;
    marketCode?: true;
    interval?: true;
    currency?: true;
    amount?: true;
    validFrom?: true;
    validTo?: true;
    priceVersion?: true;
    proposalId?: true;
    proposedBy?: true;
    publishedBy?: true;
    createdAt?: true;
    _all?: true;
};
export type PlanPriceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlanPriceWhereInput;
    orderBy?: Prisma.PlanPriceOrderByWithRelationInput | Prisma.PlanPriceOrderByWithRelationInput[];
    cursor?: Prisma.PlanPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PlanPriceCountAggregateInputType;
    _avg?: PlanPriceAvgAggregateInputType;
    _sum?: PlanPriceSumAggregateInputType;
    _min?: PlanPriceMinAggregateInputType;
    _max?: PlanPriceMaxAggregateInputType;
};
export type GetPlanPriceAggregateType<T extends PlanPriceAggregateArgs> = {
    [P in keyof T & keyof AggregatePlanPrice]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePlanPrice[P]> : Prisma.GetScalarType<T[P], AggregatePlanPrice[P]>;
};
export type PlanPriceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlanPriceWhereInput;
    orderBy?: Prisma.PlanPriceOrderByWithAggregationInput | Prisma.PlanPriceOrderByWithAggregationInput[];
    by: Prisma.PlanPriceScalarFieldEnum[] | Prisma.PlanPriceScalarFieldEnum;
    having?: Prisma.PlanPriceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PlanPriceCountAggregateInputType | true;
    _avg?: PlanPriceAvgAggregateInputType;
    _sum?: PlanPriceSumAggregateInputType;
    _min?: PlanPriceMinAggregateInputType;
    _max?: PlanPriceMaxAggregateInputType;
};
export type PlanPriceGroupByOutputType = {
    id: string;
    edition: $Enums.Edition;
    marketCode: string;
    interval: string;
    currency: string;
    amount: runtime.Decimal;
    validFrom: Date;
    validTo: Date | null;
    priceVersion: number;
    proposalId: string | null;
    proposedBy: string | null;
    publishedBy: string | null;
    createdAt: Date;
    _count: PlanPriceCountAggregateOutputType | null;
    _avg: PlanPriceAvgAggregateOutputType | null;
    _sum: PlanPriceSumAggregateOutputType | null;
    _min: PlanPriceMinAggregateOutputType | null;
    _max: PlanPriceMaxAggregateOutputType | null;
};
export type GetPlanPriceGroupByPayload<T extends PlanPriceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PlanPriceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PlanPriceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PlanPriceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PlanPriceGroupByOutputType[P]>;
}>>;
export type PlanPriceWhereInput = {
    AND?: Prisma.PlanPriceWhereInput | Prisma.PlanPriceWhereInput[];
    OR?: Prisma.PlanPriceWhereInput[];
    NOT?: Prisma.PlanPriceWhereInput | Prisma.PlanPriceWhereInput[];
    id?: Prisma.StringFilter<"PlanPrice"> | string;
    edition?: Prisma.EnumEditionFilter<"PlanPrice"> | $Enums.Edition;
    marketCode?: Prisma.StringFilter<"PlanPrice"> | string;
    interval?: Prisma.StringFilter<"PlanPrice"> | string;
    currency?: Prisma.StringFilter<"PlanPrice"> | string;
    amount?: Prisma.DecimalFilter<"PlanPrice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    validFrom?: Prisma.DateTimeFilter<"PlanPrice"> | Date | string;
    validTo?: Prisma.DateTimeNullableFilter<"PlanPrice"> | Date | string | null;
    priceVersion?: Prisma.IntFilter<"PlanPrice"> | number;
    proposalId?: Prisma.StringNullableFilter<"PlanPrice"> | string | null;
    proposedBy?: Prisma.StringNullableFilter<"PlanPrice"> | string | null;
    publishedBy?: Prisma.StringNullableFilter<"PlanPrice"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PlanPrice"> | Date | string;
};
export type PlanPriceOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    edition?: Prisma.SortOrder;
    marketCode?: Prisma.SortOrder;
    interval?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    validFrom?: Prisma.SortOrder;
    validTo?: Prisma.SortOrderInput | Prisma.SortOrder;
    priceVersion?: Prisma.SortOrder;
    proposalId?: Prisma.SortOrderInput | Prisma.SortOrder;
    proposedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    publishedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PlanPriceWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    proposalId?: string;
    edition_marketCode_interval_priceVersion?: Prisma.PlanPriceEditionMarketCodeIntervalPriceVersionCompoundUniqueInput;
    AND?: Prisma.PlanPriceWhereInput | Prisma.PlanPriceWhereInput[];
    OR?: Prisma.PlanPriceWhereInput[];
    NOT?: Prisma.PlanPriceWhereInput | Prisma.PlanPriceWhereInput[];
    edition?: Prisma.EnumEditionFilter<"PlanPrice"> | $Enums.Edition;
    marketCode?: Prisma.StringFilter<"PlanPrice"> | string;
    interval?: Prisma.StringFilter<"PlanPrice"> | string;
    currency?: Prisma.StringFilter<"PlanPrice"> | string;
    amount?: Prisma.DecimalFilter<"PlanPrice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    validFrom?: Prisma.DateTimeFilter<"PlanPrice"> | Date | string;
    validTo?: Prisma.DateTimeNullableFilter<"PlanPrice"> | Date | string | null;
    priceVersion?: Prisma.IntFilter<"PlanPrice"> | number;
    proposedBy?: Prisma.StringNullableFilter<"PlanPrice"> | string | null;
    publishedBy?: Prisma.StringNullableFilter<"PlanPrice"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PlanPrice"> | Date | string;
}, "id" | "proposalId" | "edition_marketCode_interval_priceVersion">;
export type PlanPriceOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    edition?: Prisma.SortOrder;
    marketCode?: Prisma.SortOrder;
    interval?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    validFrom?: Prisma.SortOrder;
    validTo?: Prisma.SortOrderInput | Prisma.SortOrder;
    priceVersion?: Prisma.SortOrder;
    proposalId?: Prisma.SortOrderInput | Prisma.SortOrder;
    proposedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    publishedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.PlanPriceCountOrderByAggregateInput;
    _avg?: Prisma.PlanPriceAvgOrderByAggregateInput;
    _max?: Prisma.PlanPriceMaxOrderByAggregateInput;
    _min?: Prisma.PlanPriceMinOrderByAggregateInput;
    _sum?: Prisma.PlanPriceSumOrderByAggregateInput;
};
export type PlanPriceScalarWhereWithAggregatesInput = {
    AND?: Prisma.PlanPriceScalarWhereWithAggregatesInput | Prisma.PlanPriceScalarWhereWithAggregatesInput[];
    OR?: Prisma.PlanPriceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PlanPriceScalarWhereWithAggregatesInput | Prisma.PlanPriceScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PlanPrice"> | string;
    edition?: Prisma.EnumEditionWithAggregatesFilter<"PlanPrice"> | $Enums.Edition;
    marketCode?: Prisma.StringWithAggregatesFilter<"PlanPrice"> | string;
    interval?: Prisma.StringWithAggregatesFilter<"PlanPrice"> | string;
    currency?: Prisma.StringWithAggregatesFilter<"PlanPrice"> | string;
    amount?: Prisma.DecimalWithAggregatesFilter<"PlanPrice"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    validFrom?: Prisma.DateTimeWithAggregatesFilter<"PlanPrice"> | Date | string;
    validTo?: Prisma.DateTimeNullableWithAggregatesFilter<"PlanPrice"> | Date | string | null;
    priceVersion?: Prisma.IntWithAggregatesFilter<"PlanPrice"> | number;
    proposalId?: Prisma.StringNullableWithAggregatesFilter<"PlanPrice"> | string | null;
    proposedBy?: Prisma.StringNullableWithAggregatesFilter<"PlanPrice"> | string | null;
    publishedBy?: Prisma.StringNullableWithAggregatesFilter<"PlanPrice"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PlanPrice"> | Date | string;
};
export type PlanPriceCreateInput = {
    id?: string;
    edition: $Enums.Edition;
    marketCode?: string;
    interval?: string;
    currency?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    validFrom?: Date | string;
    validTo?: Date | string | null;
    priceVersion?: number;
    proposalId?: string | null;
    proposedBy?: string | null;
    publishedBy?: string | null;
    createdAt?: Date | string;
};
export type PlanPriceUncheckedCreateInput = {
    id?: string;
    edition: $Enums.Edition;
    marketCode?: string;
    interval?: string;
    currency?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    validFrom?: Date | string;
    validTo?: Date | string | null;
    priceVersion?: number;
    proposalId?: string | null;
    proposedBy?: string | null;
    publishedBy?: string | null;
    createdAt?: Date | string;
};
export type PlanPriceUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.EnumEditionFieldUpdateOperationsInput | $Enums.Edition;
    marketCode?: Prisma.StringFieldUpdateOperationsInput | string;
    interval?: Prisma.StringFieldUpdateOperationsInput | string;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    validFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    validTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    priceVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    proposalId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    proposedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    publishedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlanPriceUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.EnumEditionFieldUpdateOperationsInput | $Enums.Edition;
    marketCode?: Prisma.StringFieldUpdateOperationsInput | string;
    interval?: Prisma.StringFieldUpdateOperationsInput | string;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    validFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    validTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    priceVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    proposalId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    proposedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    publishedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlanPriceCreateManyInput = {
    id?: string;
    edition: $Enums.Edition;
    marketCode?: string;
    interval?: string;
    currency?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    validFrom?: Date | string;
    validTo?: Date | string | null;
    priceVersion?: number;
    proposalId?: string | null;
    proposedBy?: string | null;
    publishedBy?: string | null;
    createdAt?: Date | string;
};
export type PlanPriceUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.EnumEditionFieldUpdateOperationsInput | $Enums.Edition;
    marketCode?: Prisma.StringFieldUpdateOperationsInput | string;
    interval?: Prisma.StringFieldUpdateOperationsInput | string;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    validFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    validTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    priceVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    proposalId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    proposedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    publishedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlanPriceUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.EnumEditionFieldUpdateOperationsInput | $Enums.Edition;
    marketCode?: Prisma.StringFieldUpdateOperationsInput | string;
    interval?: Prisma.StringFieldUpdateOperationsInput | string;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    validFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    validTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    priceVersion?: Prisma.IntFieldUpdateOperationsInput | number;
    proposalId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    proposedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    publishedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlanPriceEditionMarketCodeIntervalPriceVersionCompoundUniqueInput = {
    edition: $Enums.Edition;
    marketCode: string;
    interval: string;
    priceVersion: number;
};
export type PlanPriceCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    edition?: Prisma.SortOrder;
    marketCode?: Prisma.SortOrder;
    interval?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    validFrom?: Prisma.SortOrder;
    validTo?: Prisma.SortOrder;
    priceVersion?: Prisma.SortOrder;
    proposalId?: Prisma.SortOrder;
    proposedBy?: Prisma.SortOrder;
    publishedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PlanPriceAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
    priceVersion?: Prisma.SortOrder;
};
export type PlanPriceMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    edition?: Prisma.SortOrder;
    marketCode?: Prisma.SortOrder;
    interval?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    validFrom?: Prisma.SortOrder;
    validTo?: Prisma.SortOrder;
    priceVersion?: Prisma.SortOrder;
    proposalId?: Prisma.SortOrder;
    proposedBy?: Prisma.SortOrder;
    publishedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PlanPriceMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    edition?: Prisma.SortOrder;
    marketCode?: Prisma.SortOrder;
    interval?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    validFrom?: Prisma.SortOrder;
    validTo?: Prisma.SortOrder;
    priceVersion?: Prisma.SortOrder;
    proposalId?: Prisma.SortOrder;
    proposedBy?: Prisma.SortOrder;
    publishedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PlanPriceSumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
    priceVersion?: Prisma.SortOrder;
};
export type PlanPriceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    edition?: boolean;
    marketCode?: boolean;
    interval?: boolean;
    currency?: boolean;
    amount?: boolean;
    validFrom?: boolean;
    validTo?: boolean;
    priceVersion?: boolean;
    proposalId?: boolean;
    proposedBy?: boolean;
    publishedBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["planPrice"]>;
export type PlanPriceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    edition?: boolean;
    marketCode?: boolean;
    interval?: boolean;
    currency?: boolean;
    amount?: boolean;
    validFrom?: boolean;
    validTo?: boolean;
    priceVersion?: boolean;
    proposalId?: boolean;
    proposedBy?: boolean;
    publishedBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["planPrice"]>;
export type PlanPriceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    edition?: boolean;
    marketCode?: boolean;
    interval?: boolean;
    currency?: boolean;
    amount?: boolean;
    validFrom?: boolean;
    validTo?: boolean;
    priceVersion?: boolean;
    proposalId?: boolean;
    proposedBy?: boolean;
    publishedBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["planPrice"]>;
export type PlanPriceSelectScalar = {
    id?: boolean;
    edition?: boolean;
    marketCode?: boolean;
    interval?: boolean;
    currency?: boolean;
    amount?: boolean;
    validFrom?: boolean;
    validTo?: boolean;
    priceVersion?: boolean;
    proposalId?: boolean;
    proposedBy?: boolean;
    publishedBy?: boolean;
    createdAt?: boolean;
};
export type PlanPriceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "edition" | "marketCode" | "interval" | "currency" | "amount" | "validFrom" | "validTo" | "priceVersion" | "proposalId" | "proposedBy" | "publishedBy" | "createdAt", ExtArgs["result"]["planPrice"]>;
export type $PlanPricePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PlanPrice";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        edition: $Enums.Edition;
        marketCode: string;
        interval: string;
        currency: string;
        amount: runtime.Decimal;
        validFrom: Date;
        validTo: Date | null;
        priceVersion: number;
        proposalId: string | null;
        proposedBy: string | null;
        publishedBy: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["planPrice"]>;
    composites: {};
};
export type PlanPriceGetPayload<S extends boolean | null | undefined | PlanPriceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PlanPricePayload, S>;
export type PlanPriceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PlanPriceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PlanPriceCountAggregateInputType | true;
};
export interface PlanPriceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PlanPrice'];
        meta: {
            name: 'PlanPrice';
        };
    };
    findUnique<T extends PlanPriceFindUniqueArgs>(args: Prisma.SelectSubset<T, PlanPriceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PlanPriceClient<runtime.Types.Result.GetResult<Prisma.$PlanPricePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PlanPriceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PlanPriceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlanPriceClient<runtime.Types.Result.GetResult<Prisma.$PlanPricePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PlanPriceFindFirstArgs>(args?: Prisma.SelectSubset<T, PlanPriceFindFirstArgs<ExtArgs>>): Prisma.Prisma__PlanPriceClient<runtime.Types.Result.GetResult<Prisma.$PlanPricePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PlanPriceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PlanPriceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlanPriceClient<runtime.Types.Result.GetResult<Prisma.$PlanPricePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PlanPriceFindManyArgs>(args?: Prisma.SelectSubset<T, PlanPriceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlanPricePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PlanPriceCreateArgs>(args: Prisma.SelectSubset<T, PlanPriceCreateArgs<ExtArgs>>): Prisma.Prisma__PlanPriceClient<runtime.Types.Result.GetResult<Prisma.$PlanPricePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PlanPriceCreateManyArgs>(args?: Prisma.SelectSubset<T, PlanPriceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PlanPriceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PlanPriceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlanPricePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PlanPriceDeleteArgs>(args: Prisma.SelectSubset<T, PlanPriceDeleteArgs<ExtArgs>>): Prisma.Prisma__PlanPriceClient<runtime.Types.Result.GetResult<Prisma.$PlanPricePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PlanPriceUpdateArgs>(args: Prisma.SelectSubset<T, PlanPriceUpdateArgs<ExtArgs>>): Prisma.Prisma__PlanPriceClient<runtime.Types.Result.GetResult<Prisma.$PlanPricePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PlanPriceDeleteManyArgs>(args?: Prisma.SelectSubset<T, PlanPriceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PlanPriceUpdateManyArgs>(args: Prisma.SelectSubset<T, PlanPriceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PlanPriceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PlanPriceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlanPricePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PlanPriceUpsertArgs>(args: Prisma.SelectSubset<T, PlanPriceUpsertArgs<ExtArgs>>): Prisma.Prisma__PlanPriceClient<runtime.Types.Result.GetResult<Prisma.$PlanPricePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PlanPriceCountArgs>(args?: Prisma.Subset<T, PlanPriceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PlanPriceCountAggregateOutputType> : number>;
    aggregate<T extends PlanPriceAggregateArgs>(args: Prisma.Subset<T, PlanPriceAggregateArgs>): Prisma.PrismaPromise<GetPlanPriceAggregateType<T>>;
    groupBy<T extends PlanPriceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PlanPriceGroupByArgs['orderBy'];
    } : {
        orderBy?: PlanPriceGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PlanPriceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanPriceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PlanPriceFieldRefs;
}
export interface Prisma__PlanPriceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PlanPriceFieldRefs {
    readonly id: Prisma.FieldRef<"PlanPrice", 'String'>;
    readonly edition: Prisma.FieldRef<"PlanPrice", 'Edition'>;
    readonly marketCode: Prisma.FieldRef<"PlanPrice", 'String'>;
    readonly interval: Prisma.FieldRef<"PlanPrice", 'String'>;
    readonly currency: Prisma.FieldRef<"PlanPrice", 'String'>;
    readonly amount: Prisma.FieldRef<"PlanPrice", 'Decimal'>;
    readonly validFrom: Prisma.FieldRef<"PlanPrice", 'DateTime'>;
    readonly validTo: Prisma.FieldRef<"PlanPrice", 'DateTime'>;
    readonly priceVersion: Prisma.FieldRef<"PlanPrice", 'Int'>;
    readonly proposalId: Prisma.FieldRef<"PlanPrice", 'String'>;
    readonly proposedBy: Prisma.FieldRef<"PlanPrice", 'String'>;
    readonly publishedBy: Prisma.FieldRef<"PlanPrice", 'String'>;
    readonly createdAt: Prisma.FieldRef<"PlanPrice", 'DateTime'>;
}
export type PlanPriceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPriceSelect<ExtArgs> | null;
    omit?: Prisma.PlanPriceOmit<ExtArgs> | null;
    where: Prisma.PlanPriceWhereUniqueInput;
};
export type PlanPriceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPriceSelect<ExtArgs> | null;
    omit?: Prisma.PlanPriceOmit<ExtArgs> | null;
    where: Prisma.PlanPriceWhereUniqueInput;
};
export type PlanPriceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPriceSelect<ExtArgs> | null;
    omit?: Prisma.PlanPriceOmit<ExtArgs> | null;
    where?: Prisma.PlanPriceWhereInput;
    orderBy?: Prisma.PlanPriceOrderByWithRelationInput | Prisma.PlanPriceOrderByWithRelationInput[];
    cursor?: Prisma.PlanPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlanPriceScalarFieldEnum | Prisma.PlanPriceScalarFieldEnum[];
};
export type PlanPriceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPriceSelect<ExtArgs> | null;
    omit?: Prisma.PlanPriceOmit<ExtArgs> | null;
    where?: Prisma.PlanPriceWhereInput;
    orderBy?: Prisma.PlanPriceOrderByWithRelationInput | Prisma.PlanPriceOrderByWithRelationInput[];
    cursor?: Prisma.PlanPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlanPriceScalarFieldEnum | Prisma.PlanPriceScalarFieldEnum[];
};
export type PlanPriceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPriceSelect<ExtArgs> | null;
    omit?: Prisma.PlanPriceOmit<ExtArgs> | null;
    where?: Prisma.PlanPriceWhereInput;
    orderBy?: Prisma.PlanPriceOrderByWithRelationInput | Prisma.PlanPriceOrderByWithRelationInput[];
    cursor?: Prisma.PlanPriceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlanPriceScalarFieldEnum | Prisma.PlanPriceScalarFieldEnum[];
};
export type PlanPriceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPriceSelect<ExtArgs> | null;
    omit?: Prisma.PlanPriceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlanPriceCreateInput, Prisma.PlanPriceUncheckedCreateInput>;
};
export type PlanPriceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PlanPriceCreateManyInput | Prisma.PlanPriceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PlanPriceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPriceSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlanPriceOmit<ExtArgs> | null;
    data: Prisma.PlanPriceCreateManyInput | Prisma.PlanPriceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PlanPriceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPriceSelect<ExtArgs> | null;
    omit?: Prisma.PlanPriceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlanPriceUpdateInput, Prisma.PlanPriceUncheckedUpdateInput>;
    where: Prisma.PlanPriceWhereUniqueInput;
};
export type PlanPriceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PlanPriceUpdateManyMutationInput, Prisma.PlanPriceUncheckedUpdateManyInput>;
    where?: Prisma.PlanPriceWhereInput;
    limit?: number;
};
export type PlanPriceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPriceSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlanPriceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlanPriceUpdateManyMutationInput, Prisma.PlanPriceUncheckedUpdateManyInput>;
    where?: Prisma.PlanPriceWhereInput;
    limit?: number;
};
export type PlanPriceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPriceSelect<ExtArgs> | null;
    omit?: Prisma.PlanPriceOmit<ExtArgs> | null;
    where: Prisma.PlanPriceWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlanPriceCreateInput, Prisma.PlanPriceUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PlanPriceUpdateInput, Prisma.PlanPriceUncheckedUpdateInput>;
};
export type PlanPriceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPriceSelect<ExtArgs> | null;
    omit?: Prisma.PlanPriceOmit<ExtArgs> | null;
    where: Prisma.PlanPriceWhereUniqueInput;
};
export type PlanPriceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlanPriceWhereInput;
    limit?: number;
};
export type PlanPriceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPriceSelect<ExtArgs> | null;
    omit?: Prisma.PlanPriceOmit<ExtArgs> | null;
};
