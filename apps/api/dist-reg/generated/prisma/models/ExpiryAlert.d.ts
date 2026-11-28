import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ExpiryAlertModel = runtime.Types.Result.DefaultSelection<Prisma.$ExpiryAlertPayload>;
export type AggregateExpiryAlert = {
    _count: ExpiryAlertCountAggregateOutputType | null;
    _avg: ExpiryAlertAvgAggregateOutputType | null;
    _sum: ExpiryAlertSumAggregateOutputType | null;
    _min: ExpiryAlertMinAggregateOutputType | null;
    _max: ExpiryAlertMaxAggregateOutputType | null;
};
export type ExpiryAlertAvgAggregateOutputType = {
    thresholdDays: number | null;
};
export type ExpiryAlertSumAggregateOutputType = {
    thresholdDays: number | null;
};
export type ExpiryAlertMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    lotId: string | null;
    thresholdDays: number | null;
    notifiedAt: Date | null;
};
export type ExpiryAlertMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    lotId: string | null;
    thresholdDays: number | null;
    notifiedAt: Date | null;
};
export type ExpiryAlertCountAggregateOutputType = {
    id: number;
    orgId: number;
    lotId: number;
    thresholdDays: number;
    notifiedAt: number;
    _all: number;
};
export type ExpiryAlertAvgAggregateInputType = {
    thresholdDays?: true;
};
export type ExpiryAlertSumAggregateInputType = {
    thresholdDays?: true;
};
export type ExpiryAlertMinAggregateInputType = {
    id?: true;
    orgId?: true;
    lotId?: true;
    thresholdDays?: true;
    notifiedAt?: true;
};
export type ExpiryAlertMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    lotId?: true;
    thresholdDays?: true;
    notifiedAt?: true;
};
export type ExpiryAlertCountAggregateInputType = {
    id?: true;
    orgId?: true;
    lotId?: true;
    thresholdDays?: true;
    notifiedAt?: true;
    _all?: true;
};
export type ExpiryAlertAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ExpiryAlertWhereInput;
    orderBy?: Prisma.ExpiryAlertOrderByWithRelationInput | Prisma.ExpiryAlertOrderByWithRelationInput[];
    cursor?: Prisma.ExpiryAlertWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ExpiryAlertCountAggregateInputType;
    _avg?: ExpiryAlertAvgAggregateInputType;
    _sum?: ExpiryAlertSumAggregateInputType;
    _min?: ExpiryAlertMinAggregateInputType;
    _max?: ExpiryAlertMaxAggregateInputType;
};
export type GetExpiryAlertAggregateType<T extends ExpiryAlertAggregateArgs> = {
    [P in keyof T & keyof AggregateExpiryAlert]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateExpiryAlert[P]> : Prisma.GetScalarType<T[P], AggregateExpiryAlert[P]>;
};
export type ExpiryAlertGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ExpiryAlertWhereInput;
    orderBy?: Prisma.ExpiryAlertOrderByWithAggregationInput | Prisma.ExpiryAlertOrderByWithAggregationInput[];
    by: Prisma.ExpiryAlertScalarFieldEnum[] | Prisma.ExpiryAlertScalarFieldEnum;
    having?: Prisma.ExpiryAlertScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ExpiryAlertCountAggregateInputType | true;
    _avg?: ExpiryAlertAvgAggregateInputType;
    _sum?: ExpiryAlertSumAggregateInputType;
    _min?: ExpiryAlertMinAggregateInputType;
    _max?: ExpiryAlertMaxAggregateInputType;
};
export type ExpiryAlertGroupByOutputType = {
    id: string;
    orgId: string;
    lotId: string;
    thresholdDays: number;
    notifiedAt: Date;
    _count: ExpiryAlertCountAggregateOutputType | null;
    _avg: ExpiryAlertAvgAggregateOutputType | null;
    _sum: ExpiryAlertSumAggregateOutputType | null;
    _min: ExpiryAlertMinAggregateOutputType | null;
    _max: ExpiryAlertMaxAggregateOutputType | null;
};
export type GetExpiryAlertGroupByPayload<T extends ExpiryAlertGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ExpiryAlertGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ExpiryAlertGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ExpiryAlertGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ExpiryAlertGroupByOutputType[P]>;
}>>;
export type ExpiryAlertWhereInput = {
    AND?: Prisma.ExpiryAlertWhereInput | Prisma.ExpiryAlertWhereInput[];
    OR?: Prisma.ExpiryAlertWhereInput[];
    NOT?: Prisma.ExpiryAlertWhereInput | Prisma.ExpiryAlertWhereInput[];
    id?: Prisma.StringFilter<"ExpiryAlert"> | string;
    orgId?: Prisma.StringFilter<"ExpiryAlert"> | string;
    lotId?: Prisma.StringFilter<"ExpiryAlert"> | string;
    thresholdDays?: Prisma.IntFilter<"ExpiryAlert"> | number;
    notifiedAt?: Prisma.DateTimeFilter<"ExpiryAlert"> | Date | string;
    lot?: Prisma.XOR<Prisma.StockLotScalarRelationFilter, Prisma.StockLotWhereInput>;
};
export type ExpiryAlertOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    thresholdDays?: Prisma.SortOrder;
    notifiedAt?: Prisma.SortOrder;
    lot?: Prisma.StockLotOrderByWithRelationInput;
};
export type ExpiryAlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    lotId_thresholdDays?: Prisma.ExpiryAlertLotIdThresholdDaysCompoundUniqueInput;
    AND?: Prisma.ExpiryAlertWhereInput | Prisma.ExpiryAlertWhereInput[];
    OR?: Prisma.ExpiryAlertWhereInput[];
    NOT?: Prisma.ExpiryAlertWhereInput | Prisma.ExpiryAlertWhereInput[];
    orgId?: Prisma.StringFilter<"ExpiryAlert"> | string;
    lotId?: Prisma.StringFilter<"ExpiryAlert"> | string;
    thresholdDays?: Prisma.IntFilter<"ExpiryAlert"> | number;
    notifiedAt?: Prisma.DateTimeFilter<"ExpiryAlert"> | Date | string;
    lot?: Prisma.XOR<Prisma.StockLotScalarRelationFilter, Prisma.StockLotWhereInput>;
}, "id" | "lotId_thresholdDays">;
export type ExpiryAlertOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    thresholdDays?: Prisma.SortOrder;
    notifiedAt?: Prisma.SortOrder;
    _count?: Prisma.ExpiryAlertCountOrderByAggregateInput;
    _avg?: Prisma.ExpiryAlertAvgOrderByAggregateInput;
    _max?: Prisma.ExpiryAlertMaxOrderByAggregateInput;
    _min?: Prisma.ExpiryAlertMinOrderByAggregateInput;
    _sum?: Prisma.ExpiryAlertSumOrderByAggregateInput;
};
export type ExpiryAlertScalarWhereWithAggregatesInput = {
    AND?: Prisma.ExpiryAlertScalarWhereWithAggregatesInput | Prisma.ExpiryAlertScalarWhereWithAggregatesInput[];
    OR?: Prisma.ExpiryAlertScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ExpiryAlertScalarWhereWithAggregatesInput | Prisma.ExpiryAlertScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ExpiryAlert"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"ExpiryAlert"> | string;
    lotId?: Prisma.StringWithAggregatesFilter<"ExpiryAlert"> | string;
    thresholdDays?: Prisma.IntWithAggregatesFilter<"ExpiryAlert"> | number;
    notifiedAt?: Prisma.DateTimeWithAggregatesFilter<"ExpiryAlert"> | Date | string;
};
export type ExpiryAlertCreateInput = {
    id?: string;
    orgId: string;
    thresholdDays: number;
    notifiedAt?: Date | string;
    lot: Prisma.StockLotCreateNestedOneWithoutExpiryAlertsInput;
};
export type ExpiryAlertUncheckedCreateInput = {
    id?: string;
    orgId: string;
    lotId: string;
    thresholdDays: number;
    notifiedAt?: Date | string;
};
export type ExpiryAlertUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    thresholdDays?: Prisma.IntFieldUpdateOperationsInput | number;
    notifiedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lot?: Prisma.StockLotUpdateOneRequiredWithoutExpiryAlertsNestedInput;
};
export type ExpiryAlertUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    thresholdDays?: Prisma.IntFieldUpdateOperationsInput | number;
    notifiedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ExpiryAlertCreateManyInput = {
    id?: string;
    orgId: string;
    lotId: string;
    thresholdDays: number;
    notifiedAt?: Date | string;
};
export type ExpiryAlertUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    thresholdDays?: Prisma.IntFieldUpdateOperationsInput | number;
    notifiedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ExpiryAlertUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    thresholdDays?: Prisma.IntFieldUpdateOperationsInput | number;
    notifiedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ExpiryAlertListRelationFilter = {
    every?: Prisma.ExpiryAlertWhereInput;
    some?: Prisma.ExpiryAlertWhereInput;
    none?: Prisma.ExpiryAlertWhereInput;
};
export type ExpiryAlertOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ExpiryAlertLotIdThresholdDaysCompoundUniqueInput = {
    lotId: string;
    thresholdDays: number;
};
export type ExpiryAlertCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    thresholdDays?: Prisma.SortOrder;
    notifiedAt?: Prisma.SortOrder;
};
export type ExpiryAlertAvgOrderByAggregateInput = {
    thresholdDays?: Prisma.SortOrder;
};
export type ExpiryAlertMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    thresholdDays?: Prisma.SortOrder;
    notifiedAt?: Prisma.SortOrder;
};
export type ExpiryAlertMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    thresholdDays?: Prisma.SortOrder;
    notifiedAt?: Prisma.SortOrder;
};
export type ExpiryAlertSumOrderByAggregateInput = {
    thresholdDays?: Prisma.SortOrder;
};
export type ExpiryAlertCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.ExpiryAlertCreateWithoutLotInput, Prisma.ExpiryAlertUncheckedCreateWithoutLotInput> | Prisma.ExpiryAlertCreateWithoutLotInput[] | Prisma.ExpiryAlertUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.ExpiryAlertCreateOrConnectWithoutLotInput | Prisma.ExpiryAlertCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.ExpiryAlertCreateManyLotInputEnvelope;
    connect?: Prisma.ExpiryAlertWhereUniqueInput | Prisma.ExpiryAlertWhereUniqueInput[];
};
export type ExpiryAlertUncheckedCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.ExpiryAlertCreateWithoutLotInput, Prisma.ExpiryAlertUncheckedCreateWithoutLotInput> | Prisma.ExpiryAlertCreateWithoutLotInput[] | Prisma.ExpiryAlertUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.ExpiryAlertCreateOrConnectWithoutLotInput | Prisma.ExpiryAlertCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.ExpiryAlertCreateManyLotInputEnvelope;
    connect?: Prisma.ExpiryAlertWhereUniqueInput | Prisma.ExpiryAlertWhereUniqueInput[];
};
export type ExpiryAlertUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.ExpiryAlertCreateWithoutLotInput, Prisma.ExpiryAlertUncheckedCreateWithoutLotInput> | Prisma.ExpiryAlertCreateWithoutLotInput[] | Prisma.ExpiryAlertUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.ExpiryAlertCreateOrConnectWithoutLotInput | Prisma.ExpiryAlertCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.ExpiryAlertUpsertWithWhereUniqueWithoutLotInput | Prisma.ExpiryAlertUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.ExpiryAlertCreateManyLotInputEnvelope;
    set?: Prisma.ExpiryAlertWhereUniqueInput | Prisma.ExpiryAlertWhereUniqueInput[];
    disconnect?: Prisma.ExpiryAlertWhereUniqueInput | Prisma.ExpiryAlertWhereUniqueInput[];
    delete?: Prisma.ExpiryAlertWhereUniqueInput | Prisma.ExpiryAlertWhereUniqueInput[];
    connect?: Prisma.ExpiryAlertWhereUniqueInput | Prisma.ExpiryAlertWhereUniqueInput[];
    update?: Prisma.ExpiryAlertUpdateWithWhereUniqueWithoutLotInput | Prisma.ExpiryAlertUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.ExpiryAlertUpdateManyWithWhereWithoutLotInput | Prisma.ExpiryAlertUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.ExpiryAlertScalarWhereInput | Prisma.ExpiryAlertScalarWhereInput[];
};
export type ExpiryAlertUncheckedUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.ExpiryAlertCreateWithoutLotInput, Prisma.ExpiryAlertUncheckedCreateWithoutLotInput> | Prisma.ExpiryAlertCreateWithoutLotInput[] | Prisma.ExpiryAlertUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.ExpiryAlertCreateOrConnectWithoutLotInput | Prisma.ExpiryAlertCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.ExpiryAlertUpsertWithWhereUniqueWithoutLotInput | Prisma.ExpiryAlertUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.ExpiryAlertCreateManyLotInputEnvelope;
    set?: Prisma.ExpiryAlertWhereUniqueInput | Prisma.ExpiryAlertWhereUniqueInput[];
    disconnect?: Prisma.ExpiryAlertWhereUniqueInput | Prisma.ExpiryAlertWhereUniqueInput[];
    delete?: Prisma.ExpiryAlertWhereUniqueInput | Prisma.ExpiryAlertWhereUniqueInput[];
    connect?: Prisma.ExpiryAlertWhereUniqueInput | Prisma.ExpiryAlertWhereUniqueInput[];
    update?: Prisma.ExpiryAlertUpdateWithWhereUniqueWithoutLotInput | Prisma.ExpiryAlertUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.ExpiryAlertUpdateManyWithWhereWithoutLotInput | Prisma.ExpiryAlertUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.ExpiryAlertScalarWhereInput | Prisma.ExpiryAlertScalarWhereInput[];
};
export type ExpiryAlertCreateWithoutLotInput = {
    id?: string;
    orgId: string;
    thresholdDays: number;
    notifiedAt?: Date | string;
};
export type ExpiryAlertUncheckedCreateWithoutLotInput = {
    id?: string;
    orgId: string;
    thresholdDays: number;
    notifiedAt?: Date | string;
};
export type ExpiryAlertCreateOrConnectWithoutLotInput = {
    where: Prisma.ExpiryAlertWhereUniqueInput;
    create: Prisma.XOR<Prisma.ExpiryAlertCreateWithoutLotInput, Prisma.ExpiryAlertUncheckedCreateWithoutLotInput>;
};
export type ExpiryAlertCreateManyLotInputEnvelope = {
    data: Prisma.ExpiryAlertCreateManyLotInput | Prisma.ExpiryAlertCreateManyLotInput[];
    skipDuplicates?: boolean;
};
export type ExpiryAlertUpsertWithWhereUniqueWithoutLotInput = {
    where: Prisma.ExpiryAlertWhereUniqueInput;
    update: Prisma.XOR<Prisma.ExpiryAlertUpdateWithoutLotInput, Prisma.ExpiryAlertUncheckedUpdateWithoutLotInput>;
    create: Prisma.XOR<Prisma.ExpiryAlertCreateWithoutLotInput, Prisma.ExpiryAlertUncheckedCreateWithoutLotInput>;
};
export type ExpiryAlertUpdateWithWhereUniqueWithoutLotInput = {
    where: Prisma.ExpiryAlertWhereUniqueInput;
    data: Prisma.XOR<Prisma.ExpiryAlertUpdateWithoutLotInput, Prisma.ExpiryAlertUncheckedUpdateWithoutLotInput>;
};
export type ExpiryAlertUpdateManyWithWhereWithoutLotInput = {
    where: Prisma.ExpiryAlertScalarWhereInput;
    data: Prisma.XOR<Prisma.ExpiryAlertUpdateManyMutationInput, Prisma.ExpiryAlertUncheckedUpdateManyWithoutLotInput>;
};
export type ExpiryAlertScalarWhereInput = {
    AND?: Prisma.ExpiryAlertScalarWhereInput | Prisma.ExpiryAlertScalarWhereInput[];
    OR?: Prisma.ExpiryAlertScalarWhereInput[];
    NOT?: Prisma.ExpiryAlertScalarWhereInput | Prisma.ExpiryAlertScalarWhereInput[];
    id?: Prisma.StringFilter<"ExpiryAlert"> | string;
    orgId?: Prisma.StringFilter<"ExpiryAlert"> | string;
    lotId?: Prisma.StringFilter<"ExpiryAlert"> | string;
    thresholdDays?: Prisma.IntFilter<"ExpiryAlert"> | number;
    notifiedAt?: Prisma.DateTimeFilter<"ExpiryAlert"> | Date | string;
};
export type ExpiryAlertCreateManyLotInput = {
    id?: string;
    orgId: string;
    thresholdDays: number;
    notifiedAt?: Date | string;
};
export type ExpiryAlertUpdateWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    thresholdDays?: Prisma.IntFieldUpdateOperationsInput | number;
    notifiedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ExpiryAlertUncheckedUpdateWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    thresholdDays?: Prisma.IntFieldUpdateOperationsInput | number;
    notifiedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ExpiryAlertUncheckedUpdateManyWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    thresholdDays?: Prisma.IntFieldUpdateOperationsInput | number;
    notifiedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ExpiryAlertSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    lotId?: boolean;
    thresholdDays?: boolean;
    notifiedAt?: boolean;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["expiryAlert"]>;
export type ExpiryAlertSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    lotId?: boolean;
    thresholdDays?: boolean;
    notifiedAt?: boolean;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["expiryAlert"]>;
export type ExpiryAlertSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    lotId?: boolean;
    thresholdDays?: boolean;
    notifiedAt?: boolean;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["expiryAlert"]>;
export type ExpiryAlertSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    lotId?: boolean;
    thresholdDays?: boolean;
    notifiedAt?: boolean;
};
export type ExpiryAlertOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "lotId" | "thresholdDays" | "notifiedAt", ExtArgs["result"]["expiryAlert"]>;
export type ExpiryAlertInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
};
export type ExpiryAlertIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
};
export type ExpiryAlertIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
};
export type $ExpiryAlertPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ExpiryAlert";
    objects: {
        lot: Prisma.$StockLotPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        lotId: string;
        thresholdDays: number;
        notifiedAt: Date;
    }, ExtArgs["result"]["expiryAlert"]>;
    composites: {};
};
export type ExpiryAlertGetPayload<S extends boolean | null | undefined | ExpiryAlertDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ExpiryAlertPayload, S>;
export type ExpiryAlertCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ExpiryAlertFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ExpiryAlertCountAggregateInputType | true;
};
export interface ExpiryAlertDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ExpiryAlert'];
        meta: {
            name: 'ExpiryAlert';
        };
    };
    findUnique<T extends ExpiryAlertFindUniqueArgs>(args: Prisma.SelectSubset<T, ExpiryAlertFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ExpiryAlertClient<runtime.Types.Result.GetResult<Prisma.$ExpiryAlertPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ExpiryAlertFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ExpiryAlertFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ExpiryAlertClient<runtime.Types.Result.GetResult<Prisma.$ExpiryAlertPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ExpiryAlertFindFirstArgs>(args?: Prisma.SelectSubset<T, ExpiryAlertFindFirstArgs<ExtArgs>>): Prisma.Prisma__ExpiryAlertClient<runtime.Types.Result.GetResult<Prisma.$ExpiryAlertPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ExpiryAlertFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ExpiryAlertFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ExpiryAlertClient<runtime.Types.Result.GetResult<Prisma.$ExpiryAlertPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ExpiryAlertFindManyArgs>(args?: Prisma.SelectSubset<T, ExpiryAlertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExpiryAlertPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ExpiryAlertCreateArgs>(args: Prisma.SelectSubset<T, ExpiryAlertCreateArgs<ExtArgs>>): Prisma.Prisma__ExpiryAlertClient<runtime.Types.Result.GetResult<Prisma.$ExpiryAlertPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ExpiryAlertCreateManyArgs>(args?: Prisma.SelectSubset<T, ExpiryAlertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ExpiryAlertCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ExpiryAlertCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExpiryAlertPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ExpiryAlertDeleteArgs>(args: Prisma.SelectSubset<T, ExpiryAlertDeleteArgs<ExtArgs>>): Prisma.Prisma__ExpiryAlertClient<runtime.Types.Result.GetResult<Prisma.$ExpiryAlertPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ExpiryAlertUpdateArgs>(args: Prisma.SelectSubset<T, ExpiryAlertUpdateArgs<ExtArgs>>): Prisma.Prisma__ExpiryAlertClient<runtime.Types.Result.GetResult<Prisma.$ExpiryAlertPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ExpiryAlertDeleteManyArgs>(args?: Prisma.SelectSubset<T, ExpiryAlertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ExpiryAlertUpdateManyArgs>(args: Prisma.SelectSubset<T, ExpiryAlertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ExpiryAlertUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ExpiryAlertUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExpiryAlertPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ExpiryAlertUpsertArgs>(args: Prisma.SelectSubset<T, ExpiryAlertUpsertArgs<ExtArgs>>): Prisma.Prisma__ExpiryAlertClient<runtime.Types.Result.GetResult<Prisma.$ExpiryAlertPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ExpiryAlertCountArgs>(args?: Prisma.Subset<T, ExpiryAlertCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ExpiryAlertCountAggregateOutputType> : number>;
    aggregate<T extends ExpiryAlertAggregateArgs>(args: Prisma.Subset<T, ExpiryAlertAggregateArgs>): Prisma.PrismaPromise<GetExpiryAlertAggregateType<T>>;
    groupBy<T extends ExpiryAlertGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ExpiryAlertGroupByArgs['orderBy'];
    } : {
        orderBy?: ExpiryAlertGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ExpiryAlertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExpiryAlertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ExpiryAlertFieldRefs;
}
export interface Prisma__ExpiryAlertClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    lot<T extends Prisma.StockLotDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.StockLotDefaultArgs<ExtArgs>>): Prisma.Prisma__StockLotClient<runtime.Types.Result.GetResult<Prisma.$StockLotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ExpiryAlertFieldRefs {
    readonly id: Prisma.FieldRef<"ExpiryAlert", 'String'>;
    readonly orgId: Prisma.FieldRef<"ExpiryAlert", 'String'>;
    readonly lotId: Prisma.FieldRef<"ExpiryAlert", 'String'>;
    readonly thresholdDays: Prisma.FieldRef<"ExpiryAlert", 'Int'>;
    readonly notifiedAt: Prisma.FieldRef<"ExpiryAlert", 'DateTime'>;
}
export type ExpiryAlertFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpiryAlertSelect<ExtArgs> | null;
    omit?: Prisma.ExpiryAlertOmit<ExtArgs> | null;
    include?: Prisma.ExpiryAlertInclude<ExtArgs> | null;
    where: Prisma.ExpiryAlertWhereUniqueInput;
};
export type ExpiryAlertFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpiryAlertSelect<ExtArgs> | null;
    omit?: Prisma.ExpiryAlertOmit<ExtArgs> | null;
    include?: Prisma.ExpiryAlertInclude<ExtArgs> | null;
    where: Prisma.ExpiryAlertWhereUniqueInput;
};
export type ExpiryAlertFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpiryAlertSelect<ExtArgs> | null;
    omit?: Prisma.ExpiryAlertOmit<ExtArgs> | null;
    include?: Prisma.ExpiryAlertInclude<ExtArgs> | null;
    where?: Prisma.ExpiryAlertWhereInput;
    orderBy?: Prisma.ExpiryAlertOrderByWithRelationInput | Prisma.ExpiryAlertOrderByWithRelationInput[];
    cursor?: Prisma.ExpiryAlertWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ExpiryAlertScalarFieldEnum | Prisma.ExpiryAlertScalarFieldEnum[];
};
export type ExpiryAlertFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpiryAlertSelect<ExtArgs> | null;
    omit?: Prisma.ExpiryAlertOmit<ExtArgs> | null;
    include?: Prisma.ExpiryAlertInclude<ExtArgs> | null;
    where?: Prisma.ExpiryAlertWhereInput;
    orderBy?: Prisma.ExpiryAlertOrderByWithRelationInput | Prisma.ExpiryAlertOrderByWithRelationInput[];
    cursor?: Prisma.ExpiryAlertWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ExpiryAlertScalarFieldEnum | Prisma.ExpiryAlertScalarFieldEnum[];
};
export type ExpiryAlertFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpiryAlertSelect<ExtArgs> | null;
    omit?: Prisma.ExpiryAlertOmit<ExtArgs> | null;
    include?: Prisma.ExpiryAlertInclude<ExtArgs> | null;
    where?: Prisma.ExpiryAlertWhereInput;
    orderBy?: Prisma.ExpiryAlertOrderByWithRelationInput | Prisma.ExpiryAlertOrderByWithRelationInput[];
    cursor?: Prisma.ExpiryAlertWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ExpiryAlertScalarFieldEnum | Prisma.ExpiryAlertScalarFieldEnum[];
};
export type ExpiryAlertCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpiryAlertSelect<ExtArgs> | null;
    omit?: Prisma.ExpiryAlertOmit<ExtArgs> | null;
    include?: Prisma.ExpiryAlertInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ExpiryAlertCreateInput, Prisma.ExpiryAlertUncheckedCreateInput>;
};
export type ExpiryAlertCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ExpiryAlertCreateManyInput | Prisma.ExpiryAlertCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ExpiryAlertCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpiryAlertSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ExpiryAlertOmit<ExtArgs> | null;
    data: Prisma.ExpiryAlertCreateManyInput | Prisma.ExpiryAlertCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ExpiryAlertIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ExpiryAlertUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpiryAlertSelect<ExtArgs> | null;
    omit?: Prisma.ExpiryAlertOmit<ExtArgs> | null;
    include?: Prisma.ExpiryAlertInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ExpiryAlertUpdateInput, Prisma.ExpiryAlertUncheckedUpdateInput>;
    where: Prisma.ExpiryAlertWhereUniqueInput;
};
export type ExpiryAlertUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ExpiryAlertUpdateManyMutationInput, Prisma.ExpiryAlertUncheckedUpdateManyInput>;
    where?: Prisma.ExpiryAlertWhereInput;
    limit?: number;
};
export type ExpiryAlertUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpiryAlertSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ExpiryAlertOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ExpiryAlertUpdateManyMutationInput, Prisma.ExpiryAlertUncheckedUpdateManyInput>;
    where?: Prisma.ExpiryAlertWhereInput;
    limit?: number;
    include?: Prisma.ExpiryAlertIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ExpiryAlertUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpiryAlertSelect<ExtArgs> | null;
    omit?: Prisma.ExpiryAlertOmit<ExtArgs> | null;
    include?: Prisma.ExpiryAlertInclude<ExtArgs> | null;
    where: Prisma.ExpiryAlertWhereUniqueInput;
    create: Prisma.XOR<Prisma.ExpiryAlertCreateInput, Prisma.ExpiryAlertUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ExpiryAlertUpdateInput, Prisma.ExpiryAlertUncheckedUpdateInput>;
};
export type ExpiryAlertDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpiryAlertSelect<ExtArgs> | null;
    omit?: Prisma.ExpiryAlertOmit<ExtArgs> | null;
    include?: Prisma.ExpiryAlertInclude<ExtArgs> | null;
    where: Prisma.ExpiryAlertWhereUniqueInput;
};
export type ExpiryAlertDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ExpiryAlertWhereInput;
    limit?: number;
};
export type ExpiryAlertDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpiryAlertSelect<ExtArgs> | null;
    omit?: Prisma.ExpiryAlertOmit<ExtArgs> | null;
    include?: Prisma.ExpiryAlertInclude<ExtArgs> | null;
};
