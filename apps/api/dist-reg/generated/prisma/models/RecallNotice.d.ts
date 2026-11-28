import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type RecallNoticeModel = runtime.Types.Result.DefaultSelection<Prisma.$RecallNoticePayload>;
export type AggregateRecallNotice = {
    _count: RecallNoticeCountAggregateOutputType | null;
    _avg: RecallNoticeAvgAggregateOutputType | null;
    _sum: RecallNoticeSumAggregateOutputType | null;
    _min: RecallNoticeMinAggregateOutputType | null;
    _max: RecallNoticeMaxAggregateOutputType | null;
};
export type RecallNoticeAvgAggregateOutputType = {
    affectedLots: number | null;
};
export type RecallNoticeSumAggregateOutputType = {
    affectedLots: number | null;
};
export type RecallNoticeMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    drugId: string | null;
    affectedLots: number | null;
    reason: string | null;
    source: string | null;
    status: $Enums.RecallStatus | null;
    enteredBy: string | null;
    enteredAt: Date | null;
    liftedBy: string | null;
    liftedAt: Date | null;
};
export type RecallNoticeMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    drugId: string | null;
    affectedLots: number | null;
    reason: string | null;
    source: string | null;
    status: $Enums.RecallStatus | null;
    enteredBy: string | null;
    enteredAt: Date | null;
    liftedBy: string | null;
    liftedAt: Date | null;
};
export type RecallNoticeCountAggregateOutputType = {
    id: number;
    orgId: number;
    drugId: number;
    lotNumbers: number;
    affectedLots: number;
    reason: number;
    source: number;
    status: number;
    enteredBy: number;
    enteredAt: number;
    liftedBy: number;
    liftedAt: number;
    _all: number;
};
export type RecallNoticeAvgAggregateInputType = {
    affectedLots?: true;
};
export type RecallNoticeSumAggregateInputType = {
    affectedLots?: true;
};
export type RecallNoticeMinAggregateInputType = {
    id?: true;
    orgId?: true;
    drugId?: true;
    affectedLots?: true;
    reason?: true;
    source?: true;
    status?: true;
    enteredBy?: true;
    enteredAt?: true;
    liftedBy?: true;
    liftedAt?: true;
};
export type RecallNoticeMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    drugId?: true;
    affectedLots?: true;
    reason?: true;
    source?: true;
    status?: true;
    enteredBy?: true;
    enteredAt?: true;
    liftedBy?: true;
    liftedAt?: true;
};
export type RecallNoticeCountAggregateInputType = {
    id?: true;
    orgId?: true;
    drugId?: true;
    lotNumbers?: true;
    affectedLots?: true;
    reason?: true;
    source?: true;
    status?: true;
    enteredBy?: true;
    enteredAt?: true;
    liftedBy?: true;
    liftedAt?: true;
    _all?: true;
};
export type RecallNoticeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RecallNoticeWhereInput;
    orderBy?: Prisma.RecallNoticeOrderByWithRelationInput | Prisma.RecallNoticeOrderByWithRelationInput[];
    cursor?: Prisma.RecallNoticeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RecallNoticeCountAggregateInputType;
    _avg?: RecallNoticeAvgAggregateInputType;
    _sum?: RecallNoticeSumAggregateInputType;
    _min?: RecallNoticeMinAggregateInputType;
    _max?: RecallNoticeMaxAggregateInputType;
};
export type GetRecallNoticeAggregateType<T extends RecallNoticeAggregateArgs> = {
    [P in keyof T & keyof AggregateRecallNotice]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRecallNotice[P]> : Prisma.GetScalarType<T[P], AggregateRecallNotice[P]>;
};
export type RecallNoticeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RecallNoticeWhereInput;
    orderBy?: Prisma.RecallNoticeOrderByWithAggregationInput | Prisma.RecallNoticeOrderByWithAggregationInput[];
    by: Prisma.RecallNoticeScalarFieldEnum[] | Prisma.RecallNoticeScalarFieldEnum;
    having?: Prisma.RecallNoticeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RecallNoticeCountAggregateInputType | true;
    _avg?: RecallNoticeAvgAggregateInputType;
    _sum?: RecallNoticeSumAggregateInputType;
    _min?: RecallNoticeMinAggregateInputType;
    _max?: RecallNoticeMaxAggregateInputType;
};
export type RecallNoticeGroupByOutputType = {
    id: string;
    orgId: string;
    drugId: string;
    lotNumbers: string[];
    affectedLots: number;
    reason: string;
    source: string | null;
    status: $Enums.RecallStatus;
    enteredBy: string;
    enteredAt: Date;
    liftedBy: string | null;
    liftedAt: Date | null;
    _count: RecallNoticeCountAggregateOutputType | null;
    _avg: RecallNoticeAvgAggregateOutputType | null;
    _sum: RecallNoticeSumAggregateOutputType | null;
    _min: RecallNoticeMinAggregateOutputType | null;
    _max: RecallNoticeMaxAggregateOutputType | null;
};
export type GetRecallNoticeGroupByPayload<T extends RecallNoticeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RecallNoticeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RecallNoticeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RecallNoticeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RecallNoticeGroupByOutputType[P]>;
}>>;
export type RecallNoticeWhereInput = {
    AND?: Prisma.RecallNoticeWhereInput | Prisma.RecallNoticeWhereInput[];
    OR?: Prisma.RecallNoticeWhereInput[];
    NOT?: Prisma.RecallNoticeWhereInput | Prisma.RecallNoticeWhereInput[];
    id?: Prisma.StringFilter<"RecallNotice"> | string;
    orgId?: Prisma.StringFilter<"RecallNotice"> | string;
    drugId?: Prisma.StringFilter<"RecallNotice"> | string;
    lotNumbers?: Prisma.StringNullableListFilter<"RecallNotice">;
    affectedLots?: Prisma.IntFilter<"RecallNotice"> | number;
    reason?: Prisma.StringFilter<"RecallNotice"> | string;
    source?: Prisma.StringNullableFilter<"RecallNotice"> | string | null;
    status?: Prisma.EnumRecallStatusFilter<"RecallNotice"> | $Enums.RecallStatus;
    enteredBy?: Prisma.StringFilter<"RecallNotice"> | string;
    enteredAt?: Prisma.DateTimeFilter<"RecallNotice"> | Date | string;
    liftedBy?: Prisma.StringNullableFilter<"RecallNotice"> | string | null;
    liftedAt?: Prisma.DateTimeNullableFilter<"RecallNotice"> | Date | string | null;
};
export type RecallNoticeOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotNumbers?: Prisma.SortOrder;
    affectedLots?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    source?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    enteredBy?: Prisma.SortOrder;
    enteredAt?: Prisma.SortOrder;
    liftedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    liftedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
};
export type RecallNoticeWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RecallNoticeWhereInput | Prisma.RecallNoticeWhereInput[];
    OR?: Prisma.RecallNoticeWhereInput[];
    NOT?: Prisma.RecallNoticeWhereInput | Prisma.RecallNoticeWhereInput[];
    orgId?: Prisma.StringFilter<"RecallNotice"> | string;
    drugId?: Prisma.StringFilter<"RecallNotice"> | string;
    lotNumbers?: Prisma.StringNullableListFilter<"RecallNotice">;
    affectedLots?: Prisma.IntFilter<"RecallNotice"> | number;
    reason?: Prisma.StringFilter<"RecallNotice"> | string;
    source?: Prisma.StringNullableFilter<"RecallNotice"> | string | null;
    status?: Prisma.EnumRecallStatusFilter<"RecallNotice"> | $Enums.RecallStatus;
    enteredBy?: Prisma.StringFilter<"RecallNotice"> | string;
    enteredAt?: Prisma.DateTimeFilter<"RecallNotice"> | Date | string;
    liftedBy?: Prisma.StringNullableFilter<"RecallNotice"> | string | null;
    liftedAt?: Prisma.DateTimeNullableFilter<"RecallNotice"> | Date | string | null;
}, "id">;
export type RecallNoticeOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotNumbers?: Prisma.SortOrder;
    affectedLots?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    source?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    enteredBy?: Prisma.SortOrder;
    enteredAt?: Prisma.SortOrder;
    liftedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    liftedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.RecallNoticeCountOrderByAggregateInput;
    _avg?: Prisma.RecallNoticeAvgOrderByAggregateInput;
    _max?: Prisma.RecallNoticeMaxOrderByAggregateInput;
    _min?: Prisma.RecallNoticeMinOrderByAggregateInput;
    _sum?: Prisma.RecallNoticeSumOrderByAggregateInput;
};
export type RecallNoticeScalarWhereWithAggregatesInput = {
    AND?: Prisma.RecallNoticeScalarWhereWithAggregatesInput | Prisma.RecallNoticeScalarWhereWithAggregatesInput[];
    OR?: Prisma.RecallNoticeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RecallNoticeScalarWhereWithAggregatesInput | Prisma.RecallNoticeScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RecallNotice"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"RecallNotice"> | string;
    drugId?: Prisma.StringWithAggregatesFilter<"RecallNotice"> | string;
    lotNumbers?: Prisma.StringNullableListFilter<"RecallNotice">;
    affectedLots?: Prisma.IntWithAggregatesFilter<"RecallNotice"> | number;
    reason?: Prisma.StringWithAggregatesFilter<"RecallNotice"> | string;
    source?: Prisma.StringNullableWithAggregatesFilter<"RecallNotice"> | string | null;
    status?: Prisma.EnumRecallStatusWithAggregatesFilter<"RecallNotice"> | $Enums.RecallStatus;
    enteredBy?: Prisma.StringWithAggregatesFilter<"RecallNotice"> | string;
    enteredAt?: Prisma.DateTimeWithAggregatesFilter<"RecallNotice"> | Date | string;
    liftedBy?: Prisma.StringNullableWithAggregatesFilter<"RecallNotice"> | string | null;
    liftedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"RecallNotice"> | Date | string | null;
};
export type RecallNoticeCreateInput = {
    id?: string;
    orgId: string;
    drugId: string;
    lotNumbers?: Prisma.RecallNoticeCreatelotNumbersInput | string[];
    affectedLots?: number;
    reason: string;
    source?: string | null;
    status?: $Enums.RecallStatus;
    enteredBy: string;
    enteredAt?: Date | string;
    liftedBy?: string | null;
    liftedAt?: Date | string | null;
};
export type RecallNoticeUncheckedCreateInput = {
    id?: string;
    orgId: string;
    drugId: string;
    lotNumbers?: Prisma.RecallNoticeCreatelotNumbersInput | string[];
    affectedLots?: number;
    reason: string;
    source?: string | null;
    status?: $Enums.RecallStatus;
    enteredBy: string;
    enteredAt?: Date | string;
    liftedBy?: string | null;
    liftedAt?: Date | string | null;
};
export type RecallNoticeUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotNumbers?: Prisma.RecallNoticeUpdatelotNumbersInput | string[];
    affectedLots?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumRecallStatusFieldUpdateOperationsInput | $Enums.RecallStatus;
    enteredBy?: Prisma.StringFieldUpdateOperationsInput | string;
    enteredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liftedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    liftedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type RecallNoticeUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotNumbers?: Prisma.RecallNoticeUpdatelotNumbersInput | string[];
    affectedLots?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumRecallStatusFieldUpdateOperationsInput | $Enums.RecallStatus;
    enteredBy?: Prisma.StringFieldUpdateOperationsInput | string;
    enteredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liftedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    liftedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type RecallNoticeCreateManyInput = {
    id?: string;
    orgId: string;
    drugId: string;
    lotNumbers?: Prisma.RecallNoticeCreatelotNumbersInput | string[];
    affectedLots?: number;
    reason: string;
    source?: string | null;
    status?: $Enums.RecallStatus;
    enteredBy: string;
    enteredAt?: Date | string;
    liftedBy?: string | null;
    liftedAt?: Date | string | null;
};
export type RecallNoticeUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotNumbers?: Prisma.RecallNoticeUpdatelotNumbersInput | string[];
    affectedLots?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumRecallStatusFieldUpdateOperationsInput | $Enums.RecallStatus;
    enteredBy?: Prisma.StringFieldUpdateOperationsInput | string;
    enteredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liftedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    liftedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type RecallNoticeUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotNumbers?: Prisma.RecallNoticeUpdatelotNumbersInput | string[];
    affectedLots?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumRecallStatusFieldUpdateOperationsInput | $Enums.RecallStatus;
    enteredBy?: Prisma.StringFieldUpdateOperationsInput | string;
    enteredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liftedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    liftedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
};
export type RecallNoticeCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotNumbers?: Prisma.SortOrder;
    affectedLots?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    enteredBy?: Prisma.SortOrder;
    enteredAt?: Prisma.SortOrder;
    liftedBy?: Prisma.SortOrder;
    liftedAt?: Prisma.SortOrder;
};
export type RecallNoticeAvgOrderByAggregateInput = {
    affectedLots?: Prisma.SortOrder;
};
export type RecallNoticeMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    affectedLots?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    enteredBy?: Prisma.SortOrder;
    enteredAt?: Prisma.SortOrder;
    liftedBy?: Prisma.SortOrder;
    liftedAt?: Prisma.SortOrder;
};
export type RecallNoticeMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    affectedLots?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    enteredBy?: Prisma.SortOrder;
    enteredAt?: Prisma.SortOrder;
    liftedBy?: Prisma.SortOrder;
    liftedAt?: Prisma.SortOrder;
};
export type RecallNoticeSumOrderByAggregateInput = {
    affectedLots?: Prisma.SortOrder;
};
export type RecallNoticeCreatelotNumbersInput = {
    set: string[];
};
export type RecallNoticeUpdatelotNumbersInput = {
    set?: string[];
    push?: string | string[];
};
export type EnumRecallStatusFieldUpdateOperationsInput = {
    set?: $Enums.RecallStatus;
};
export type RecallNoticeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    drugId?: boolean;
    lotNumbers?: boolean;
    affectedLots?: boolean;
    reason?: boolean;
    source?: boolean;
    status?: boolean;
    enteredBy?: boolean;
    enteredAt?: boolean;
    liftedBy?: boolean;
    liftedAt?: boolean;
}, ExtArgs["result"]["recallNotice"]>;
export type RecallNoticeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    drugId?: boolean;
    lotNumbers?: boolean;
    affectedLots?: boolean;
    reason?: boolean;
    source?: boolean;
    status?: boolean;
    enteredBy?: boolean;
    enteredAt?: boolean;
    liftedBy?: boolean;
    liftedAt?: boolean;
}, ExtArgs["result"]["recallNotice"]>;
export type RecallNoticeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    drugId?: boolean;
    lotNumbers?: boolean;
    affectedLots?: boolean;
    reason?: boolean;
    source?: boolean;
    status?: boolean;
    enteredBy?: boolean;
    enteredAt?: boolean;
    liftedBy?: boolean;
    liftedAt?: boolean;
}, ExtArgs["result"]["recallNotice"]>;
export type RecallNoticeSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    drugId?: boolean;
    lotNumbers?: boolean;
    affectedLots?: boolean;
    reason?: boolean;
    source?: boolean;
    status?: boolean;
    enteredBy?: boolean;
    enteredAt?: boolean;
    liftedBy?: boolean;
    liftedAt?: boolean;
};
export type RecallNoticeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "drugId" | "lotNumbers" | "affectedLots" | "reason" | "source" | "status" | "enteredBy" | "enteredAt" | "liftedBy" | "liftedAt", ExtArgs["result"]["recallNotice"]>;
export type $RecallNoticePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RecallNotice";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        drugId: string;
        lotNumbers: string[];
        affectedLots: number;
        reason: string;
        source: string | null;
        status: $Enums.RecallStatus;
        enteredBy: string;
        enteredAt: Date;
        liftedBy: string | null;
        liftedAt: Date | null;
    }, ExtArgs["result"]["recallNotice"]>;
    composites: {};
};
export type RecallNoticeGetPayload<S extends boolean | null | undefined | RecallNoticeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RecallNoticePayload, S>;
export type RecallNoticeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RecallNoticeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RecallNoticeCountAggregateInputType | true;
};
export interface RecallNoticeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RecallNotice'];
        meta: {
            name: 'RecallNotice';
        };
    };
    findUnique<T extends RecallNoticeFindUniqueArgs>(args: Prisma.SelectSubset<T, RecallNoticeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RecallNoticeClient<runtime.Types.Result.GetResult<Prisma.$RecallNoticePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RecallNoticeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RecallNoticeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RecallNoticeClient<runtime.Types.Result.GetResult<Prisma.$RecallNoticePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RecallNoticeFindFirstArgs>(args?: Prisma.SelectSubset<T, RecallNoticeFindFirstArgs<ExtArgs>>): Prisma.Prisma__RecallNoticeClient<runtime.Types.Result.GetResult<Prisma.$RecallNoticePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RecallNoticeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RecallNoticeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RecallNoticeClient<runtime.Types.Result.GetResult<Prisma.$RecallNoticePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RecallNoticeFindManyArgs>(args?: Prisma.SelectSubset<T, RecallNoticeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RecallNoticePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RecallNoticeCreateArgs>(args: Prisma.SelectSubset<T, RecallNoticeCreateArgs<ExtArgs>>): Prisma.Prisma__RecallNoticeClient<runtime.Types.Result.GetResult<Prisma.$RecallNoticePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RecallNoticeCreateManyArgs>(args?: Prisma.SelectSubset<T, RecallNoticeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RecallNoticeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RecallNoticeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RecallNoticePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RecallNoticeDeleteArgs>(args: Prisma.SelectSubset<T, RecallNoticeDeleteArgs<ExtArgs>>): Prisma.Prisma__RecallNoticeClient<runtime.Types.Result.GetResult<Prisma.$RecallNoticePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RecallNoticeUpdateArgs>(args: Prisma.SelectSubset<T, RecallNoticeUpdateArgs<ExtArgs>>): Prisma.Prisma__RecallNoticeClient<runtime.Types.Result.GetResult<Prisma.$RecallNoticePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RecallNoticeDeleteManyArgs>(args?: Prisma.SelectSubset<T, RecallNoticeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RecallNoticeUpdateManyArgs>(args: Prisma.SelectSubset<T, RecallNoticeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RecallNoticeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RecallNoticeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RecallNoticePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RecallNoticeUpsertArgs>(args: Prisma.SelectSubset<T, RecallNoticeUpsertArgs<ExtArgs>>): Prisma.Prisma__RecallNoticeClient<runtime.Types.Result.GetResult<Prisma.$RecallNoticePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RecallNoticeCountArgs>(args?: Prisma.Subset<T, RecallNoticeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RecallNoticeCountAggregateOutputType> : number>;
    aggregate<T extends RecallNoticeAggregateArgs>(args: Prisma.Subset<T, RecallNoticeAggregateArgs>): Prisma.PrismaPromise<GetRecallNoticeAggregateType<T>>;
    groupBy<T extends RecallNoticeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RecallNoticeGroupByArgs['orderBy'];
    } : {
        orderBy?: RecallNoticeGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RecallNoticeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecallNoticeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RecallNoticeFieldRefs;
}
export interface Prisma__RecallNoticeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RecallNoticeFieldRefs {
    readonly id: Prisma.FieldRef<"RecallNotice", 'String'>;
    readonly orgId: Prisma.FieldRef<"RecallNotice", 'String'>;
    readonly drugId: Prisma.FieldRef<"RecallNotice", 'String'>;
    readonly lotNumbers: Prisma.FieldRef<"RecallNotice", 'String[]'>;
    readonly affectedLots: Prisma.FieldRef<"RecallNotice", 'Int'>;
    readonly reason: Prisma.FieldRef<"RecallNotice", 'String'>;
    readonly source: Prisma.FieldRef<"RecallNotice", 'String'>;
    readonly status: Prisma.FieldRef<"RecallNotice", 'RecallStatus'>;
    readonly enteredBy: Prisma.FieldRef<"RecallNotice", 'String'>;
    readonly enteredAt: Prisma.FieldRef<"RecallNotice", 'DateTime'>;
    readonly liftedBy: Prisma.FieldRef<"RecallNotice", 'String'>;
    readonly liftedAt: Prisma.FieldRef<"RecallNotice", 'DateTime'>;
}
export type RecallNoticeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RecallNoticeSelect<ExtArgs> | null;
    omit?: Prisma.RecallNoticeOmit<ExtArgs> | null;
    where: Prisma.RecallNoticeWhereUniqueInput;
};
export type RecallNoticeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RecallNoticeSelect<ExtArgs> | null;
    omit?: Prisma.RecallNoticeOmit<ExtArgs> | null;
    where: Prisma.RecallNoticeWhereUniqueInput;
};
export type RecallNoticeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RecallNoticeSelect<ExtArgs> | null;
    omit?: Prisma.RecallNoticeOmit<ExtArgs> | null;
    where?: Prisma.RecallNoticeWhereInput;
    orderBy?: Prisma.RecallNoticeOrderByWithRelationInput | Prisma.RecallNoticeOrderByWithRelationInput[];
    cursor?: Prisma.RecallNoticeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RecallNoticeScalarFieldEnum | Prisma.RecallNoticeScalarFieldEnum[];
};
export type RecallNoticeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RecallNoticeSelect<ExtArgs> | null;
    omit?: Prisma.RecallNoticeOmit<ExtArgs> | null;
    where?: Prisma.RecallNoticeWhereInput;
    orderBy?: Prisma.RecallNoticeOrderByWithRelationInput | Prisma.RecallNoticeOrderByWithRelationInput[];
    cursor?: Prisma.RecallNoticeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RecallNoticeScalarFieldEnum | Prisma.RecallNoticeScalarFieldEnum[];
};
export type RecallNoticeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RecallNoticeSelect<ExtArgs> | null;
    omit?: Prisma.RecallNoticeOmit<ExtArgs> | null;
    where?: Prisma.RecallNoticeWhereInput;
    orderBy?: Prisma.RecallNoticeOrderByWithRelationInput | Prisma.RecallNoticeOrderByWithRelationInput[];
    cursor?: Prisma.RecallNoticeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RecallNoticeScalarFieldEnum | Prisma.RecallNoticeScalarFieldEnum[];
};
export type RecallNoticeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RecallNoticeSelect<ExtArgs> | null;
    omit?: Prisma.RecallNoticeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RecallNoticeCreateInput, Prisma.RecallNoticeUncheckedCreateInput>;
};
export type RecallNoticeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RecallNoticeCreateManyInput | Prisma.RecallNoticeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RecallNoticeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RecallNoticeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RecallNoticeOmit<ExtArgs> | null;
    data: Prisma.RecallNoticeCreateManyInput | Prisma.RecallNoticeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RecallNoticeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RecallNoticeSelect<ExtArgs> | null;
    omit?: Prisma.RecallNoticeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RecallNoticeUpdateInput, Prisma.RecallNoticeUncheckedUpdateInput>;
    where: Prisma.RecallNoticeWhereUniqueInput;
};
export type RecallNoticeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RecallNoticeUpdateManyMutationInput, Prisma.RecallNoticeUncheckedUpdateManyInput>;
    where?: Prisma.RecallNoticeWhereInput;
    limit?: number;
};
export type RecallNoticeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RecallNoticeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RecallNoticeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RecallNoticeUpdateManyMutationInput, Prisma.RecallNoticeUncheckedUpdateManyInput>;
    where?: Prisma.RecallNoticeWhereInput;
    limit?: number;
};
export type RecallNoticeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RecallNoticeSelect<ExtArgs> | null;
    omit?: Prisma.RecallNoticeOmit<ExtArgs> | null;
    where: Prisma.RecallNoticeWhereUniqueInput;
    create: Prisma.XOR<Prisma.RecallNoticeCreateInput, Prisma.RecallNoticeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RecallNoticeUpdateInput, Prisma.RecallNoticeUncheckedUpdateInput>;
};
export type RecallNoticeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RecallNoticeSelect<ExtArgs> | null;
    omit?: Prisma.RecallNoticeOmit<ExtArgs> | null;
    where: Prisma.RecallNoticeWhereUniqueInput;
};
export type RecallNoticeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RecallNoticeWhereInput;
    limit?: number;
};
export type RecallNoticeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RecallNoticeSelect<ExtArgs> | null;
    omit?: Prisma.RecallNoticeOmit<ExtArgs> | null;
};
