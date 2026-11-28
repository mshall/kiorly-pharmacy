import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type KiorexCommissionRateViewModel = runtime.Types.Result.DefaultSelection<Prisma.$KiorexCommissionRateViewPayload>;
export type AggregateKiorexCommissionRateView = {
    _count: KiorexCommissionRateViewCountAggregateOutputType | null;
    _avg: KiorexCommissionRateViewAvgAggregateOutputType | null;
    _sum: KiorexCommissionRateViewSumAggregateOutputType | null;
    _min: KiorexCommissionRateViewMinAggregateOutputType | null;
    _max: KiorexCommissionRateViewMaxAggregateOutputType | null;
};
export type KiorexCommissionRateViewAvgAggregateOutputType = {
    version: number | null;
};
export type KiorexCommissionRateViewSumAggregateOutputType = {
    version: bigint | null;
};
export type KiorexCommissionRateViewMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    product: string | null;
    version: bigint | null;
    receivedAt: Date | null;
    updatedAt: Date | null;
};
export type KiorexCommissionRateViewMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    product: string | null;
    version: bigint | null;
    receivedAt: Date | null;
    updatedAt: Date | null;
};
export type KiorexCommissionRateViewCountAggregateOutputType = {
    id: number;
    orgId: number;
    product: number;
    version: number;
    view: number;
    receivedAt: number;
    updatedAt: number;
    _all: number;
};
export type KiorexCommissionRateViewAvgAggregateInputType = {
    version?: true;
};
export type KiorexCommissionRateViewSumAggregateInputType = {
    version?: true;
};
export type KiorexCommissionRateViewMinAggregateInputType = {
    id?: true;
    orgId?: true;
    product?: true;
    version?: true;
    receivedAt?: true;
    updatedAt?: true;
};
export type KiorexCommissionRateViewMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    product?: true;
    version?: true;
    receivedAt?: true;
    updatedAt?: true;
};
export type KiorexCommissionRateViewCountAggregateInputType = {
    id?: true;
    orgId?: true;
    product?: true;
    version?: true;
    view?: true;
    receivedAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type KiorexCommissionRateViewAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.KiorexCommissionRateViewWhereInput;
    orderBy?: Prisma.KiorexCommissionRateViewOrderByWithRelationInput | Prisma.KiorexCommissionRateViewOrderByWithRelationInput[];
    cursor?: Prisma.KiorexCommissionRateViewWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | KiorexCommissionRateViewCountAggregateInputType;
    _avg?: KiorexCommissionRateViewAvgAggregateInputType;
    _sum?: KiorexCommissionRateViewSumAggregateInputType;
    _min?: KiorexCommissionRateViewMinAggregateInputType;
    _max?: KiorexCommissionRateViewMaxAggregateInputType;
};
export type GetKiorexCommissionRateViewAggregateType<T extends KiorexCommissionRateViewAggregateArgs> = {
    [P in keyof T & keyof AggregateKiorexCommissionRateView]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateKiorexCommissionRateView[P]> : Prisma.GetScalarType<T[P], AggregateKiorexCommissionRateView[P]>;
};
export type KiorexCommissionRateViewGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.KiorexCommissionRateViewWhereInput;
    orderBy?: Prisma.KiorexCommissionRateViewOrderByWithAggregationInput | Prisma.KiorexCommissionRateViewOrderByWithAggregationInput[];
    by: Prisma.KiorexCommissionRateViewScalarFieldEnum[] | Prisma.KiorexCommissionRateViewScalarFieldEnum;
    having?: Prisma.KiorexCommissionRateViewScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: KiorexCommissionRateViewCountAggregateInputType | true;
    _avg?: KiorexCommissionRateViewAvgAggregateInputType;
    _sum?: KiorexCommissionRateViewSumAggregateInputType;
    _min?: KiorexCommissionRateViewMinAggregateInputType;
    _max?: KiorexCommissionRateViewMaxAggregateInputType;
};
export type KiorexCommissionRateViewGroupByOutputType = {
    id: string;
    orgId: string;
    product: string;
    version: bigint;
    view: runtime.JsonValue;
    receivedAt: Date;
    updatedAt: Date;
    _count: KiorexCommissionRateViewCountAggregateOutputType | null;
    _avg: KiorexCommissionRateViewAvgAggregateOutputType | null;
    _sum: KiorexCommissionRateViewSumAggregateOutputType | null;
    _min: KiorexCommissionRateViewMinAggregateOutputType | null;
    _max: KiorexCommissionRateViewMaxAggregateOutputType | null;
};
export type GetKiorexCommissionRateViewGroupByPayload<T extends KiorexCommissionRateViewGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<KiorexCommissionRateViewGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof KiorexCommissionRateViewGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], KiorexCommissionRateViewGroupByOutputType[P]> : Prisma.GetScalarType<T[P], KiorexCommissionRateViewGroupByOutputType[P]>;
}>>;
export type KiorexCommissionRateViewWhereInput = {
    AND?: Prisma.KiorexCommissionRateViewWhereInput | Prisma.KiorexCommissionRateViewWhereInput[];
    OR?: Prisma.KiorexCommissionRateViewWhereInput[];
    NOT?: Prisma.KiorexCommissionRateViewWhereInput | Prisma.KiorexCommissionRateViewWhereInput[];
    id?: Prisma.StringFilter<"KiorexCommissionRateView"> | string;
    orgId?: Prisma.StringFilter<"KiorexCommissionRateView"> | string;
    product?: Prisma.StringFilter<"KiorexCommissionRateView"> | string;
    version?: Prisma.BigIntFilter<"KiorexCommissionRateView"> | bigint | number;
    view?: Prisma.JsonFilter<"KiorexCommissionRateView">;
    receivedAt?: Prisma.DateTimeFilter<"KiorexCommissionRateView"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"KiorexCommissionRateView"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
};
export type KiorexCommissionRateViewOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    product?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    view?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
};
export type KiorexCommissionRateViewWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId?: string;
    AND?: Prisma.KiorexCommissionRateViewWhereInput | Prisma.KiorexCommissionRateViewWhereInput[];
    OR?: Prisma.KiorexCommissionRateViewWhereInput[];
    NOT?: Prisma.KiorexCommissionRateViewWhereInput | Prisma.KiorexCommissionRateViewWhereInput[];
    product?: Prisma.StringFilter<"KiorexCommissionRateView"> | string;
    version?: Prisma.BigIntFilter<"KiorexCommissionRateView"> | bigint | number;
    view?: Prisma.JsonFilter<"KiorexCommissionRateView">;
    receivedAt?: Prisma.DateTimeFilter<"KiorexCommissionRateView"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"KiorexCommissionRateView"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
}, "id" | "orgId">;
export type KiorexCommissionRateViewOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    product?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    view?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.KiorexCommissionRateViewCountOrderByAggregateInput;
    _avg?: Prisma.KiorexCommissionRateViewAvgOrderByAggregateInput;
    _max?: Prisma.KiorexCommissionRateViewMaxOrderByAggregateInput;
    _min?: Prisma.KiorexCommissionRateViewMinOrderByAggregateInput;
    _sum?: Prisma.KiorexCommissionRateViewSumOrderByAggregateInput;
};
export type KiorexCommissionRateViewScalarWhereWithAggregatesInput = {
    AND?: Prisma.KiorexCommissionRateViewScalarWhereWithAggregatesInput | Prisma.KiorexCommissionRateViewScalarWhereWithAggregatesInput[];
    OR?: Prisma.KiorexCommissionRateViewScalarWhereWithAggregatesInput[];
    NOT?: Prisma.KiorexCommissionRateViewScalarWhereWithAggregatesInput | Prisma.KiorexCommissionRateViewScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"KiorexCommissionRateView"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"KiorexCommissionRateView"> | string;
    product?: Prisma.StringWithAggregatesFilter<"KiorexCommissionRateView"> | string;
    version?: Prisma.BigIntWithAggregatesFilter<"KiorexCommissionRateView"> | bigint | number;
    view?: Prisma.JsonWithAggregatesFilter<"KiorexCommissionRateView">;
    receivedAt?: Prisma.DateTimeWithAggregatesFilter<"KiorexCommissionRateView"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"KiorexCommissionRateView"> | Date | string;
};
export type KiorexCommissionRateViewCreateInput = {
    id?: string;
    product: string;
    version: bigint | number;
    view: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutKiorexCommissionRateViewInput;
};
export type KiorexCommissionRateViewUncheckedCreateInput = {
    id?: string;
    orgId: string;
    product: string;
    version: bigint | number;
    view: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Date | string;
    updatedAt?: Date | string;
};
export type KiorexCommissionRateViewUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    view?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutKiorexCommissionRateViewNestedInput;
};
export type KiorexCommissionRateViewUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    product?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    view?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type KiorexCommissionRateViewCreateManyInput = {
    id?: string;
    orgId: string;
    product: string;
    version: bigint | number;
    view: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Date | string;
    updatedAt?: Date | string;
};
export type KiorexCommissionRateViewUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    view?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type KiorexCommissionRateViewUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    product?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    view?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type KiorexCommissionRateViewNullableScalarRelationFilter = {
    is?: Prisma.KiorexCommissionRateViewWhereInput | null;
    isNot?: Prisma.KiorexCommissionRateViewWhereInput | null;
};
export type KiorexCommissionRateViewCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    product?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    view?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type KiorexCommissionRateViewAvgOrderByAggregateInput = {
    version?: Prisma.SortOrder;
};
export type KiorexCommissionRateViewMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    product?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type KiorexCommissionRateViewMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    product?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type KiorexCommissionRateViewSumOrderByAggregateInput = {
    version?: Prisma.SortOrder;
};
export type KiorexCommissionRateViewCreateNestedOneWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.KiorexCommissionRateViewCreateWithoutTenantInput, Prisma.KiorexCommissionRateViewUncheckedCreateWithoutTenantInput>;
    connectOrCreate?: Prisma.KiorexCommissionRateViewCreateOrConnectWithoutTenantInput;
    connect?: Prisma.KiorexCommissionRateViewWhereUniqueInput;
};
export type KiorexCommissionRateViewUncheckedCreateNestedOneWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.KiorexCommissionRateViewCreateWithoutTenantInput, Prisma.KiorexCommissionRateViewUncheckedCreateWithoutTenantInput>;
    connectOrCreate?: Prisma.KiorexCommissionRateViewCreateOrConnectWithoutTenantInput;
    connect?: Prisma.KiorexCommissionRateViewWhereUniqueInput;
};
export type KiorexCommissionRateViewUpdateOneWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.KiorexCommissionRateViewCreateWithoutTenantInput, Prisma.KiorexCommissionRateViewUncheckedCreateWithoutTenantInput>;
    connectOrCreate?: Prisma.KiorexCommissionRateViewCreateOrConnectWithoutTenantInput;
    upsert?: Prisma.KiorexCommissionRateViewUpsertWithoutTenantInput;
    disconnect?: Prisma.KiorexCommissionRateViewWhereInput | boolean;
    delete?: Prisma.KiorexCommissionRateViewWhereInput | boolean;
    connect?: Prisma.KiorexCommissionRateViewWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.KiorexCommissionRateViewUpdateToOneWithWhereWithoutTenantInput, Prisma.KiorexCommissionRateViewUpdateWithoutTenantInput>, Prisma.KiorexCommissionRateViewUncheckedUpdateWithoutTenantInput>;
};
export type KiorexCommissionRateViewUncheckedUpdateOneWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.KiorexCommissionRateViewCreateWithoutTenantInput, Prisma.KiorexCommissionRateViewUncheckedCreateWithoutTenantInput>;
    connectOrCreate?: Prisma.KiorexCommissionRateViewCreateOrConnectWithoutTenantInput;
    upsert?: Prisma.KiorexCommissionRateViewUpsertWithoutTenantInput;
    disconnect?: Prisma.KiorexCommissionRateViewWhereInput | boolean;
    delete?: Prisma.KiorexCommissionRateViewWhereInput | boolean;
    connect?: Prisma.KiorexCommissionRateViewWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.KiorexCommissionRateViewUpdateToOneWithWhereWithoutTenantInput, Prisma.KiorexCommissionRateViewUpdateWithoutTenantInput>, Prisma.KiorexCommissionRateViewUncheckedUpdateWithoutTenantInput>;
};
export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number;
    increment?: bigint | number;
    decrement?: bigint | number;
    multiply?: bigint | number;
    divide?: bigint | number;
};
export type KiorexCommissionRateViewCreateWithoutTenantInput = {
    id?: string;
    product: string;
    version: bigint | number;
    view: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Date | string;
    updatedAt?: Date | string;
};
export type KiorexCommissionRateViewUncheckedCreateWithoutTenantInput = {
    id?: string;
    product: string;
    version: bigint | number;
    view: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Date | string;
    updatedAt?: Date | string;
};
export type KiorexCommissionRateViewCreateOrConnectWithoutTenantInput = {
    where: Prisma.KiorexCommissionRateViewWhereUniqueInput;
    create: Prisma.XOR<Prisma.KiorexCommissionRateViewCreateWithoutTenantInput, Prisma.KiorexCommissionRateViewUncheckedCreateWithoutTenantInput>;
};
export type KiorexCommissionRateViewUpsertWithoutTenantInput = {
    update: Prisma.XOR<Prisma.KiorexCommissionRateViewUpdateWithoutTenantInput, Prisma.KiorexCommissionRateViewUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.KiorexCommissionRateViewCreateWithoutTenantInput, Prisma.KiorexCommissionRateViewUncheckedCreateWithoutTenantInput>;
    where?: Prisma.KiorexCommissionRateViewWhereInput;
};
export type KiorexCommissionRateViewUpdateToOneWithWhereWithoutTenantInput = {
    where?: Prisma.KiorexCommissionRateViewWhereInput;
    data: Prisma.XOR<Prisma.KiorexCommissionRateViewUpdateWithoutTenantInput, Prisma.KiorexCommissionRateViewUncheckedUpdateWithoutTenantInput>;
};
export type KiorexCommissionRateViewUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    view?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type KiorexCommissionRateViewUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    view?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    receivedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type KiorexCommissionRateViewSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    product?: boolean;
    version?: boolean;
    view?: boolean;
    receivedAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["kiorexCommissionRateView"]>;
export type KiorexCommissionRateViewSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    product?: boolean;
    version?: boolean;
    view?: boolean;
    receivedAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["kiorexCommissionRateView"]>;
export type KiorexCommissionRateViewSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    product?: boolean;
    version?: boolean;
    view?: boolean;
    receivedAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["kiorexCommissionRateView"]>;
export type KiorexCommissionRateViewSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    product?: boolean;
    version?: boolean;
    view?: boolean;
    receivedAt?: boolean;
    updatedAt?: boolean;
};
export type KiorexCommissionRateViewOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "product" | "version" | "view" | "receivedAt" | "updatedAt", ExtArgs["result"]["kiorexCommissionRateView"]>;
export type KiorexCommissionRateViewInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type KiorexCommissionRateViewIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type KiorexCommissionRateViewIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $KiorexCommissionRateViewPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "KiorexCommissionRateView";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        product: string;
        version: bigint;
        view: runtime.JsonValue;
        receivedAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["kiorexCommissionRateView"]>;
    composites: {};
};
export type KiorexCommissionRateViewGetPayload<S extends boolean | null | undefined | KiorexCommissionRateViewDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$KiorexCommissionRateViewPayload, S>;
export type KiorexCommissionRateViewCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<KiorexCommissionRateViewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: KiorexCommissionRateViewCountAggregateInputType | true;
};
export interface KiorexCommissionRateViewDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['KiorexCommissionRateView'];
        meta: {
            name: 'KiorexCommissionRateView';
        };
    };
    findUnique<T extends KiorexCommissionRateViewFindUniqueArgs>(args: Prisma.SelectSubset<T, KiorexCommissionRateViewFindUniqueArgs<ExtArgs>>): Prisma.Prisma__KiorexCommissionRateViewClient<runtime.Types.Result.GetResult<Prisma.$KiorexCommissionRateViewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends KiorexCommissionRateViewFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, KiorexCommissionRateViewFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__KiorexCommissionRateViewClient<runtime.Types.Result.GetResult<Prisma.$KiorexCommissionRateViewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends KiorexCommissionRateViewFindFirstArgs>(args?: Prisma.SelectSubset<T, KiorexCommissionRateViewFindFirstArgs<ExtArgs>>): Prisma.Prisma__KiorexCommissionRateViewClient<runtime.Types.Result.GetResult<Prisma.$KiorexCommissionRateViewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends KiorexCommissionRateViewFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, KiorexCommissionRateViewFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__KiorexCommissionRateViewClient<runtime.Types.Result.GetResult<Prisma.$KiorexCommissionRateViewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends KiorexCommissionRateViewFindManyArgs>(args?: Prisma.SelectSubset<T, KiorexCommissionRateViewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$KiorexCommissionRateViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends KiorexCommissionRateViewCreateArgs>(args: Prisma.SelectSubset<T, KiorexCommissionRateViewCreateArgs<ExtArgs>>): Prisma.Prisma__KiorexCommissionRateViewClient<runtime.Types.Result.GetResult<Prisma.$KiorexCommissionRateViewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends KiorexCommissionRateViewCreateManyArgs>(args?: Prisma.SelectSubset<T, KiorexCommissionRateViewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends KiorexCommissionRateViewCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, KiorexCommissionRateViewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$KiorexCommissionRateViewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends KiorexCommissionRateViewDeleteArgs>(args: Prisma.SelectSubset<T, KiorexCommissionRateViewDeleteArgs<ExtArgs>>): Prisma.Prisma__KiorexCommissionRateViewClient<runtime.Types.Result.GetResult<Prisma.$KiorexCommissionRateViewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends KiorexCommissionRateViewUpdateArgs>(args: Prisma.SelectSubset<T, KiorexCommissionRateViewUpdateArgs<ExtArgs>>): Prisma.Prisma__KiorexCommissionRateViewClient<runtime.Types.Result.GetResult<Prisma.$KiorexCommissionRateViewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends KiorexCommissionRateViewDeleteManyArgs>(args?: Prisma.SelectSubset<T, KiorexCommissionRateViewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends KiorexCommissionRateViewUpdateManyArgs>(args: Prisma.SelectSubset<T, KiorexCommissionRateViewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends KiorexCommissionRateViewUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, KiorexCommissionRateViewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$KiorexCommissionRateViewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends KiorexCommissionRateViewUpsertArgs>(args: Prisma.SelectSubset<T, KiorexCommissionRateViewUpsertArgs<ExtArgs>>): Prisma.Prisma__KiorexCommissionRateViewClient<runtime.Types.Result.GetResult<Prisma.$KiorexCommissionRateViewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends KiorexCommissionRateViewCountArgs>(args?: Prisma.Subset<T, KiorexCommissionRateViewCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], KiorexCommissionRateViewCountAggregateOutputType> : number>;
    aggregate<T extends KiorexCommissionRateViewAggregateArgs>(args: Prisma.Subset<T, KiorexCommissionRateViewAggregateArgs>): Prisma.PrismaPromise<GetKiorexCommissionRateViewAggregateType<T>>;
    groupBy<T extends KiorexCommissionRateViewGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: KiorexCommissionRateViewGroupByArgs['orderBy'];
    } : {
        orderBy?: KiorexCommissionRateViewGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, KiorexCommissionRateViewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKiorexCommissionRateViewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: KiorexCommissionRateViewFieldRefs;
}
export interface Prisma__KiorexCommissionRateViewClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface KiorexCommissionRateViewFieldRefs {
    readonly id: Prisma.FieldRef<"KiorexCommissionRateView", 'String'>;
    readonly orgId: Prisma.FieldRef<"KiorexCommissionRateView", 'String'>;
    readonly product: Prisma.FieldRef<"KiorexCommissionRateView", 'String'>;
    readonly version: Prisma.FieldRef<"KiorexCommissionRateView", 'BigInt'>;
    readonly view: Prisma.FieldRef<"KiorexCommissionRateView", 'Json'>;
    readonly receivedAt: Prisma.FieldRef<"KiorexCommissionRateView", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"KiorexCommissionRateView", 'DateTime'>;
}
export type KiorexCommissionRateViewFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexCommissionRateViewSelect<ExtArgs> | null;
    omit?: Prisma.KiorexCommissionRateViewOmit<ExtArgs> | null;
    include?: Prisma.KiorexCommissionRateViewInclude<ExtArgs> | null;
    where: Prisma.KiorexCommissionRateViewWhereUniqueInput;
};
export type KiorexCommissionRateViewFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexCommissionRateViewSelect<ExtArgs> | null;
    omit?: Prisma.KiorexCommissionRateViewOmit<ExtArgs> | null;
    include?: Prisma.KiorexCommissionRateViewInclude<ExtArgs> | null;
    where: Prisma.KiorexCommissionRateViewWhereUniqueInput;
};
export type KiorexCommissionRateViewFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexCommissionRateViewSelect<ExtArgs> | null;
    omit?: Prisma.KiorexCommissionRateViewOmit<ExtArgs> | null;
    include?: Prisma.KiorexCommissionRateViewInclude<ExtArgs> | null;
    where?: Prisma.KiorexCommissionRateViewWhereInput;
    orderBy?: Prisma.KiorexCommissionRateViewOrderByWithRelationInput | Prisma.KiorexCommissionRateViewOrderByWithRelationInput[];
    cursor?: Prisma.KiorexCommissionRateViewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.KiorexCommissionRateViewScalarFieldEnum | Prisma.KiorexCommissionRateViewScalarFieldEnum[];
};
export type KiorexCommissionRateViewFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexCommissionRateViewSelect<ExtArgs> | null;
    omit?: Prisma.KiorexCommissionRateViewOmit<ExtArgs> | null;
    include?: Prisma.KiorexCommissionRateViewInclude<ExtArgs> | null;
    where?: Prisma.KiorexCommissionRateViewWhereInput;
    orderBy?: Prisma.KiorexCommissionRateViewOrderByWithRelationInput | Prisma.KiorexCommissionRateViewOrderByWithRelationInput[];
    cursor?: Prisma.KiorexCommissionRateViewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.KiorexCommissionRateViewScalarFieldEnum | Prisma.KiorexCommissionRateViewScalarFieldEnum[];
};
export type KiorexCommissionRateViewFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexCommissionRateViewSelect<ExtArgs> | null;
    omit?: Prisma.KiorexCommissionRateViewOmit<ExtArgs> | null;
    include?: Prisma.KiorexCommissionRateViewInclude<ExtArgs> | null;
    where?: Prisma.KiorexCommissionRateViewWhereInput;
    orderBy?: Prisma.KiorexCommissionRateViewOrderByWithRelationInput | Prisma.KiorexCommissionRateViewOrderByWithRelationInput[];
    cursor?: Prisma.KiorexCommissionRateViewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.KiorexCommissionRateViewScalarFieldEnum | Prisma.KiorexCommissionRateViewScalarFieldEnum[];
};
export type KiorexCommissionRateViewCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexCommissionRateViewSelect<ExtArgs> | null;
    omit?: Prisma.KiorexCommissionRateViewOmit<ExtArgs> | null;
    include?: Prisma.KiorexCommissionRateViewInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.KiorexCommissionRateViewCreateInput, Prisma.KiorexCommissionRateViewUncheckedCreateInput>;
};
export type KiorexCommissionRateViewCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.KiorexCommissionRateViewCreateManyInput | Prisma.KiorexCommissionRateViewCreateManyInput[];
    skipDuplicates?: boolean;
};
export type KiorexCommissionRateViewCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexCommissionRateViewSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.KiorexCommissionRateViewOmit<ExtArgs> | null;
    data: Prisma.KiorexCommissionRateViewCreateManyInput | Prisma.KiorexCommissionRateViewCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.KiorexCommissionRateViewIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type KiorexCommissionRateViewUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexCommissionRateViewSelect<ExtArgs> | null;
    omit?: Prisma.KiorexCommissionRateViewOmit<ExtArgs> | null;
    include?: Prisma.KiorexCommissionRateViewInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.KiorexCommissionRateViewUpdateInput, Prisma.KiorexCommissionRateViewUncheckedUpdateInput>;
    where: Prisma.KiorexCommissionRateViewWhereUniqueInput;
};
export type KiorexCommissionRateViewUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.KiorexCommissionRateViewUpdateManyMutationInput, Prisma.KiorexCommissionRateViewUncheckedUpdateManyInput>;
    where?: Prisma.KiorexCommissionRateViewWhereInput;
    limit?: number;
};
export type KiorexCommissionRateViewUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexCommissionRateViewSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.KiorexCommissionRateViewOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.KiorexCommissionRateViewUpdateManyMutationInput, Prisma.KiorexCommissionRateViewUncheckedUpdateManyInput>;
    where?: Prisma.KiorexCommissionRateViewWhereInput;
    limit?: number;
    include?: Prisma.KiorexCommissionRateViewIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type KiorexCommissionRateViewUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexCommissionRateViewSelect<ExtArgs> | null;
    omit?: Prisma.KiorexCommissionRateViewOmit<ExtArgs> | null;
    include?: Prisma.KiorexCommissionRateViewInclude<ExtArgs> | null;
    where: Prisma.KiorexCommissionRateViewWhereUniqueInput;
    create: Prisma.XOR<Prisma.KiorexCommissionRateViewCreateInput, Prisma.KiorexCommissionRateViewUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.KiorexCommissionRateViewUpdateInput, Prisma.KiorexCommissionRateViewUncheckedUpdateInput>;
};
export type KiorexCommissionRateViewDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexCommissionRateViewSelect<ExtArgs> | null;
    omit?: Prisma.KiorexCommissionRateViewOmit<ExtArgs> | null;
    include?: Prisma.KiorexCommissionRateViewInclude<ExtArgs> | null;
    where: Prisma.KiorexCommissionRateViewWhereUniqueInput;
};
export type KiorexCommissionRateViewDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.KiorexCommissionRateViewWhereInput;
    limit?: number;
};
export type KiorexCommissionRateViewDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexCommissionRateViewSelect<ExtArgs> | null;
    omit?: Prisma.KiorexCommissionRateViewOmit<ExtArgs> | null;
    include?: Prisma.KiorexCommissionRateViewInclude<ExtArgs> | null;
};
