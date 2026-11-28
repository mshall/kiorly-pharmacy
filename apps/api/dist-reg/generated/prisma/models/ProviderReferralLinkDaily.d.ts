import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ProviderReferralLinkDailyModel = runtime.Types.Result.DefaultSelection<Prisma.$ProviderReferralLinkDailyPayload>;
export type AggregateProviderReferralLinkDaily = {
    _count: ProviderReferralLinkDailyCountAggregateOutputType | null;
    _avg: ProviderReferralLinkDailyAvgAggregateOutputType | null;
    _sum: ProviderReferralLinkDailySumAggregateOutputType | null;
    _min: ProviderReferralLinkDailyMinAggregateOutputType | null;
    _max: ProviderReferralLinkDailyMaxAggregateOutputType | null;
};
export type ProviderReferralLinkDailyAvgAggregateOutputType = {
    visits: number | null;
    orders: number | null;
    completed: number | null;
};
export type ProviderReferralLinkDailySumAggregateOutputType = {
    visits: number | null;
    orders: number | null;
    completed: number | null;
};
export type ProviderReferralLinkDailyMinAggregateOutputType = {
    linkId: string | null;
    orgId: string | null;
    date: Date | null;
    visits: number | null;
    orders: number | null;
    completed: number | null;
    updatedAt: Date | null;
};
export type ProviderReferralLinkDailyMaxAggregateOutputType = {
    linkId: string | null;
    orgId: string | null;
    date: Date | null;
    visits: number | null;
    orders: number | null;
    completed: number | null;
    updatedAt: Date | null;
};
export type ProviderReferralLinkDailyCountAggregateOutputType = {
    linkId: number;
    orgId: number;
    date: number;
    visits: number;
    orders: number;
    completed: number;
    updatedAt: number;
    _all: number;
};
export type ProviderReferralLinkDailyAvgAggregateInputType = {
    visits?: true;
    orders?: true;
    completed?: true;
};
export type ProviderReferralLinkDailySumAggregateInputType = {
    visits?: true;
    orders?: true;
    completed?: true;
};
export type ProviderReferralLinkDailyMinAggregateInputType = {
    linkId?: true;
    orgId?: true;
    date?: true;
    visits?: true;
    orders?: true;
    completed?: true;
    updatedAt?: true;
};
export type ProviderReferralLinkDailyMaxAggregateInputType = {
    linkId?: true;
    orgId?: true;
    date?: true;
    visits?: true;
    orders?: true;
    completed?: true;
    updatedAt?: true;
};
export type ProviderReferralLinkDailyCountAggregateInputType = {
    linkId?: true;
    orgId?: true;
    date?: true;
    visits?: true;
    orders?: true;
    completed?: true;
    updatedAt?: true;
    _all?: true;
};
export type ProviderReferralLinkDailyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProviderReferralLinkDailyWhereInput;
    orderBy?: Prisma.ProviderReferralLinkDailyOrderByWithRelationInput | Prisma.ProviderReferralLinkDailyOrderByWithRelationInput[];
    cursor?: Prisma.ProviderReferralLinkDailyWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProviderReferralLinkDailyCountAggregateInputType;
    _avg?: ProviderReferralLinkDailyAvgAggregateInputType;
    _sum?: ProviderReferralLinkDailySumAggregateInputType;
    _min?: ProviderReferralLinkDailyMinAggregateInputType;
    _max?: ProviderReferralLinkDailyMaxAggregateInputType;
};
export type GetProviderReferralLinkDailyAggregateType<T extends ProviderReferralLinkDailyAggregateArgs> = {
    [P in keyof T & keyof AggregateProviderReferralLinkDaily]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProviderReferralLinkDaily[P]> : Prisma.GetScalarType<T[P], AggregateProviderReferralLinkDaily[P]>;
};
export type ProviderReferralLinkDailyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProviderReferralLinkDailyWhereInput;
    orderBy?: Prisma.ProviderReferralLinkDailyOrderByWithAggregationInput | Prisma.ProviderReferralLinkDailyOrderByWithAggregationInput[];
    by: Prisma.ProviderReferralLinkDailyScalarFieldEnum[] | Prisma.ProviderReferralLinkDailyScalarFieldEnum;
    having?: Prisma.ProviderReferralLinkDailyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProviderReferralLinkDailyCountAggregateInputType | true;
    _avg?: ProviderReferralLinkDailyAvgAggregateInputType;
    _sum?: ProviderReferralLinkDailySumAggregateInputType;
    _min?: ProviderReferralLinkDailyMinAggregateInputType;
    _max?: ProviderReferralLinkDailyMaxAggregateInputType;
};
export type ProviderReferralLinkDailyGroupByOutputType = {
    linkId: string;
    orgId: string;
    date: Date;
    visits: number;
    orders: number;
    completed: number;
    updatedAt: Date;
    _count: ProviderReferralLinkDailyCountAggregateOutputType | null;
    _avg: ProviderReferralLinkDailyAvgAggregateOutputType | null;
    _sum: ProviderReferralLinkDailySumAggregateOutputType | null;
    _min: ProviderReferralLinkDailyMinAggregateOutputType | null;
    _max: ProviderReferralLinkDailyMaxAggregateOutputType | null;
};
export type GetProviderReferralLinkDailyGroupByPayload<T extends ProviderReferralLinkDailyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProviderReferralLinkDailyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProviderReferralLinkDailyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProviderReferralLinkDailyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProviderReferralLinkDailyGroupByOutputType[P]>;
}>>;
export type ProviderReferralLinkDailyWhereInput = {
    AND?: Prisma.ProviderReferralLinkDailyWhereInput | Prisma.ProviderReferralLinkDailyWhereInput[];
    OR?: Prisma.ProviderReferralLinkDailyWhereInput[];
    NOT?: Prisma.ProviderReferralLinkDailyWhereInput | Prisma.ProviderReferralLinkDailyWhereInput[];
    linkId?: Prisma.StringFilter<"ProviderReferralLinkDaily"> | string;
    orgId?: Prisma.StringFilter<"ProviderReferralLinkDaily"> | string;
    date?: Prisma.DateTimeFilter<"ProviderReferralLinkDaily"> | Date | string;
    visits?: Prisma.IntFilter<"ProviderReferralLinkDaily"> | number;
    orders?: Prisma.IntFilter<"ProviderReferralLinkDaily"> | number;
    completed?: Prisma.IntFilter<"ProviderReferralLinkDaily"> | number;
    updatedAt?: Prisma.DateTimeFilter<"ProviderReferralLinkDaily"> | Date | string;
    link?: Prisma.XOR<Prisma.ProviderReferralLinkScalarRelationFilter, Prisma.ProviderReferralLinkWhereInput>;
};
export type ProviderReferralLinkDailyOrderByWithRelationInput = {
    linkId?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    visits?: Prisma.SortOrder;
    orders?: Prisma.SortOrder;
    completed?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    link?: Prisma.ProviderReferralLinkOrderByWithRelationInput;
};
export type ProviderReferralLinkDailyWhereUniqueInput = Prisma.AtLeast<{
    linkId_date?: Prisma.ProviderReferralLinkDailyLinkIdDateCompoundUniqueInput;
    AND?: Prisma.ProviderReferralLinkDailyWhereInput | Prisma.ProviderReferralLinkDailyWhereInput[];
    OR?: Prisma.ProviderReferralLinkDailyWhereInput[];
    NOT?: Prisma.ProviderReferralLinkDailyWhereInput | Prisma.ProviderReferralLinkDailyWhereInput[];
    linkId?: Prisma.StringFilter<"ProviderReferralLinkDaily"> | string;
    orgId?: Prisma.StringFilter<"ProviderReferralLinkDaily"> | string;
    date?: Prisma.DateTimeFilter<"ProviderReferralLinkDaily"> | Date | string;
    visits?: Prisma.IntFilter<"ProviderReferralLinkDaily"> | number;
    orders?: Prisma.IntFilter<"ProviderReferralLinkDaily"> | number;
    completed?: Prisma.IntFilter<"ProviderReferralLinkDaily"> | number;
    updatedAt?: Prisma.DateTimeFilter<"ProviderReferralLinkDaily"> | Date | string;
    link?: Prisma.XOR<Prisma.ProviderReferralLinkScalarRelationFilter, Prisma.ProviderReferralLinkWhereInput>;
}, "linkId_date">;
export type ProviderReferralLinkDailyOrderByWithAggregationInput = {
    linkId?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    visits?: Prisma.SortOrder;
    orders?: Prisma.SortOrder;
    completed?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ProviderReferralLinkDailyCountOrderByAggregateInput;
    _avg?: Prisma.ProviderReferralLinkDailyAvgOrderByAggregateInput;
    _max?: Prisma.ProviderReferralLinkDailyMaxOrderByAggregateInput;
    _min?: Prisma.ProviderReferralLinkDailyMinOrderByAggregateInput;
    _sum?: Prisma.ProviderReferralLinkDailySumOrderByAggregateInput;
};
export type ProviderReferralLinkDailyScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProviderReferralLinkDailyScalarWhereWithAggregatesInput | Prisma.ProviderReferralLinkDailyScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProviderReferralLinkDailyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProviderReferralLinkDailyScalarWhereWithAggregatesInput | Prisma.ProviderReferralLinkDailyScalarWhereWithAggregatesInput[];
    linkId?: Prisma.StringWithAggregatesFilter<"ProviderReferralLinkDaily"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"ProviderReferralLinkDaily"> | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"ProviderReferralLinkDaily"> | Date | string;
    visits?: Prisma.IntWithAggregatesFilter<"ProviderReferralLinkDaily"> | number;
    orders?: Prisma.IntWithAggregatesFilter<"ProviderReferralLinkDaily"> | number;
    completed?: Prisma.IntWithAggregatesFilter<"ProviderReferralLinkDaily"> | number;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"ProviderReferralLinkDaily"> | Date | string;
};
export type ProviderReferralLinkDailyCreateInput = {
    orgId: string;
    date: Date | string;
    visits?: number;
    orders?: number;
    completed?: number;
    updatedAt?: Date | string;
    link: Prisma.ProviderReferralLinkCreateNestedOneWithoutDailyInput;
};
export type ProviderReferralLinkDailyUncheckedCreateInput = {
    linkId: string;
    orgId: string;
    date: Date | string;
    visits?: number;
    orders?: number;
    completed?: number;
    updatedAt?: Date | string;
};
export type ProviderReferralLinkDailyUpdateInput = {
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    visits?: Prisma.IntFieldUpdateOperationsInput | number;
    orders?: Prisma.IntFieldUpdateOperationsInput | number;
    completed?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    link?: Prisma.ProviderReferralLinkUpdateOneRequiredWithoutDailyNestedInput;
};
export type ProviderReferralLinkDailyUncheckedUpdateInput = {
    linkId?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    visits?: Prisma.IntFieldUpdateOperationsInput | number;
    orders?: Prisma.IntFieldUpdateOperationsInput | number;
    completed?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProviderReferralLinkDailyCreateManyInput = {
    linkId: string;
    orgId: string;
    date: Date | string;
    visits?: number;
    orders?: number;
    completed?: number;
    updatedAt?: Date | string;
};
export type ProviderReferralLinkDailyUpdateManyMutationInput = {
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    visits?: Prisma.IntFieldUpdateOperationsInput | number;
    orders?: Prisma.IntFieldUpdateOperationsInput | number;
    completed?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProviderReferralLinkDailyUncheckedUpdateManyInput = {
    linkId?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    visits?: Prisma.IntFieldUpdateOperationsInput | number;
    orders?: Prisma.IntFieldUpdateOperationsInput | number;
    completed?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProviderReferralLinkDailyListRelationFilter = {
    every?: Prisma.ProviderReferralLinkDailyWhereInput;
    some?: Prisma.ProviderReferralLinkDailyWhereInput;
    none?: Prisma.ProviderReferralLinkDailyWhereInput;
};
export type ProviderReferralLinkDailyOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ProviderReferralLinkDailyLinkIdDateCompoundUniqueInput = {
    linkId: string;
    date: Date | string;
};
export type ProviderReferralLinkDailyCountOrderByAggregateInput = {
    linkId?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    visits?: Prisma.SortOrder;
    orders?: Prisma.SortOrder;
    completed?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ProviderReferralLinkDailyAvgOrderByAggregateInput = {
    visits?: Prisma.SortOrder;
    orders?: Prisma.SortOrder;
    completed?: Prisma.SortOrder;
};
export type ProviderReferralLinkDailyMaxOrderByAggregateInput = {
    linkId?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    visits?: Prisma.SortOrder;
    orders?: Prisma.SortOrder;
    completed?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ProviderReferralLinkDailyMinOrderByAggregateInput = {
    linkId?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    visits?: Prisma.SortOrder;
    orders?: Prisma.SortOrder;
    completed?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ProviderReferralLinkDailySumOrderByAggregateInput = {
    visits?: Prisma.SortOrder;
    orders?: Prisma.SortOrder;
    completed?: Prisma.SortOrder;
};
export type ProviderReferralLinkDailyCreateNestedManyWithoutLinkInput = {
    create?: Prisma.XOR<Prisma.ProviderReferralLinkDailyCreateWithoutLinkInput, Prisma.ProviderReferralLinkDailyUncheckedCreateWithoutLinkInput> | Prisma.ProviderReferralLinkDailyCreateWithoutLinkInput[] | Prisma.ProviderReferralLinkDailyUncheckedCreateWithoutLinkInput[];
    connectOrCreate?: Prisma.ProviderReferralLinkDailyCreateOrConnectWithoutLinkInput | Prisma.ProviderReferralLinkDailyCreateOrConnectWithoutLinkInput[];
    createMany?: Prisma.ProviderReferralLinkDailyCreateManyLinkInputEnvelope;
    connect?: Prisma.ProviderReferralLinkDailyWhereUniqueInput | Prisma.ProviderReferralLinkDailyWhereUniqueInput[];
};
export type ProviderReferralLinkDailyUncheckedCreateNestedManyWithoutLinkInput = {
    create?: Prisma.XOR<Prisma.ProviderReferralLinkDailyCreateWithoutLinkInput, Prisma.ProviderReferralLinkDailyUncheckedCreateWithoutLinkInput> | Prisma.ProviderReferralLinkDailyCreateWithoutLinkInput[] | Prisma.ProviderReferralLinkDailyUncheckedCreateWithoutLinkInput[];
    connectOrCreate?: Prisma.ProviderReferralLinkDailyCreateOrConnectWithoutLinkInput | Prisma.ProviderReferralLinkDailyCreateOrConnectWithoutLinkInput[];
    createMany?: Prisma.ProviderReferralLinkDailyCreateManyLinkInputEnvelope;
    connect?: Prisma.ProviderReferralLinkDailyWhereUniqueInput | Prisma.ProviderReferralLinkDailyWhereUniqueInput[];
};
export type ProviderReferralLinkDailyUpdateManyWithoutLinkNestedInput = {
    create?: Prisma.XOR<Prisma.ProviderReferralLinkDailyCreateWithoutLinkInput, Prisma.ProviderReferralLinkDailyUncheckedCreateWithoutLinkInput> | Prisma.ProviderReferralLinkDailyCreateWithoutLinkInput[] | Prisma.ProviderReferralLinkDailyUncheckedCreateWithoutLinkInput[];
    connectOrCreate?: Prisma.ProviderReferralLinkDailyCreateOrConnectWithoutLinkInput | Prisma.ProviderReferralLinkDailyCreateOrConnectWithoutLinkInput[];
    upsert?: Prisma.ProviderReferralLinkDailyUpsertWithWhereUniqueWithoutLinkInput | Prisma.ProviderReferralLinkDailyUpsertWithWhereUniqueWithoutLinkInput[];
    createMany?: Prisma.ProviderReferralLinkDailyCreateManyLinkInputEnvelope;
    set?: Prisma.ProviderReferralLinkDailyWhereUniqueInput | Prisma.ProviderReferralLinkDailyWhereUniqueInput[];
    disconnect?: Prisma.ProviderReferralLinkDailyWhereUniqueInput | Prisma.ProviderReferralLinkDailyWhereUniqueInput[];
    delete?: Prisma.ProviderReferralLinkDailyWhereUniqueInput | Prisma.ProviderReferralLinkDailyWhereUniqueInput[];
    connect?: Prisma.ProviderReferralLinkDailyWhereUniqueInput | Prisma.ProviderReferralLinkDailyWhereUniqueInput[];
    update?: Prisma.ProviderReferralLinkDailyUpdateWithWhereUniqueWithoutLinkInput | Prisma.ProviderReferralLinkDailyUpdateWithWhereUniqueWithoutLinkInput[];
    updateMany?: Prisma.ProviderReferralLinkDailyUpdateManyWithWhereWithoutLinkInput | Prisma.ProviderReferralLinkDailyUpdateManyWithWhereWithoutLinkInput[];
    deleteMany?: Prisma.ProviderReferralLinkDailyScalarWhereInput | Prisma.ProviderReferralLinkDailyScalarWhereInput[];
};
export type ProviderReferralLinkDailyUncheckedUpdateManyWithoutLinkNestedInput = {
    create?: Prisma.XOR<Prisma.ProviderReferralLinkDailyCreateWithoutLinkInput, Prisma.ProviderReferralLinkDailyUncheckedCreateWithoutLinkInput> | Prisma.ProviderReferralLinkDailyCreateWithoutLinkInput[] | Prisma.ProviderReferralLinkDailyUncheckedCreateWithoutLinkInput[];
    connectOrCreate?: Prisma.ProviderReferralLinkDailyCreateOrConnectWithoutLinkInput | Prisma.ProviderReferralLinkDailyCreateOrConnectWithoutLinkInput[];
    upsert?: Prisma.ProviderReferralLinkDailyUpsertWithWhereUniqueWithoutLinkInput | Prisma.ProviderReferralLinkDailyUpsertWithWhereUniqueWithoutLinkInput[];
    createMany?: Prisma.ProviderReferralLinkDailyCreateManyLinkInputEnvelope;
    set?: Prisma.ProviderReferralLinkDailyWhereUniqueInput | Prisma.ProviderReferralLinkDailyWhereUniqueInput[];
    disconnect?: Prisma.ProviderReferralLinkDailyWhereUniqueInput | Prisma.ProviderReferralLinkDailyWhereUniqueInput[];
    delete?: Prisma.ProviderReferralLinkDailyWhereUniqueInput | Prisma.ProviderReferralLinkDailyWhereUniqueInput[];
    connect?: Prisma.ProviderReferralLinkDailyWhereUniqueInput | Prisma.ProviderReferralLinkDailyWhereUniqueInput[];
    update?: Prisma.ProviderReferralLinkDailyUpdateWithWhereUniqueWithoutLinkInput | Prisma.ProviderReferralLinkDailyUpdateWithWhereUniqueWithoutLinkInput[];
    updateMany?: Prisma.ProviderReferralLinkDailyUpdateManyWithWhereWithoutLinkInput | Prisma.ProviderReferralLinkDailyUpdateManyWithWhereWithoutLinkInput[];
    deleteMany?: Prisma.ProviderReferralLinkDailyScalarWhereInput | Prisma.ProviderReferralLinkDailyScalarWhereInput[];
};
export type ProviderReferralLinkDailyCreateWithoutLinkInput = {
    orgId: string;
    date: Date | string;
    visits?: number;
    orders?: number;
    completed?: number;
    updatedAt?: Date | string;
};
export type ProviderReferralLinkDailyUncheckedCreateWithoutLinkInput = {
    orgId: string;
    date: Date | string;
    visits?: number;
    orders?: number;
    completed?: number;
    updatedAt?: Date | string;
};
export type ProviderReferralLinkDailyCreateOrConnectWithoutLinkInput = {
    where: Prisma.ProviderReferralLinkDailyWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProviderReferralLinkDailyCreateWithoutLinkInput, Prisma.ProviderReferralLinkDailyUncheckedCreateWithoutLinkInput>;
};
export type ProviderReferralLinkDailyCreateManyLinkInputEnvelope = {
    data: Prisma.ProviderReferralLinkDailyCreateManyLinkInput | Prisma.ProviderReferralLinkDailyCreateManyLinkInput[];
    skipDuplicates?: boolean;
};
export type ProviderReferralLinkDailyUpsertWithWhereUniqueWithoutLinkInput = {
    where: Prisma.ProviderReferralLinkDailyWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProviderReferralLinkDailyUpdateWithoutLinkInput, Prisma.ProviderReferralLinkDailyUncheckedUpdateWithoutLinkInput>;
    create: Prisma.XOR<Prisma.ProviderReferralLinkDailyCreateWithoutLinkInput, Prisma.ProviderReferralLinkDailyUncheckedCreateWithoutLinkInput>;
};
export type ProviderReferralLinkDailyUpdateWithWhereUniqueWithoutLinkInput = {
    where: Prisma.ProviderReferralLinkDailyWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProviderReferralLinkDailyUpdateWithoutLinkInput, Prisma.ProviderReferralLinkDailyUncheckedUpdateWithoutLinkInput>;
};
export type ProviderReferralLinkDailyUpdateManyWithWhereWithoutLinkInput = {
    where: Prisma.ProviderReferralLinkDailyScalarWhereInput;
    data: Prisma.XOR<Prisma.ProviderReferralLinkDailyUpdateManyMutationInput, Prisma.ProviderReferralLinkDailyUncheckedUpdateManyWithoutLinkInput>;
};
export type ProviderReferralLinkDailyScalarWhereInput = {
    AND?: Prisma.ProviderReferralLinkDailyScalarWhereInput | Prisma.ProviderReferralLinkDailyScalarWhereInput[];
    OR?: Prisma.ProviderReferralLinkDailyScalarWhereInput[];
    NOT?: Prisma.ProviderReferralLinkDailyScalarWhereInput | Prisma.ProviderReferralLinkDailyScalarWhereInput[];
    linkId?: Prisma.StringFilter<"ProviderReferralLinkDaily"> | string;
    orgId?: Prisma.StringFilter<"ProviderReferralLinkDaily"> | string;
    date?: Prisma.DateTimeFilter<"ProviderReferralLinkDaily"> | Date | string;
    visits?: Prisma.IntFilter<"ProviderReferralLinkDaily"> | number;
    orders?: Prisma.IntFilter<"ProviderReferralLinkDaily"> | number;
    completed?: Prisma.IntFilter<"ProviderReferralLinkDaily"> | number;
    updatedAt?: Prisma.DateTimeFilter<"ProviderReferralLinkDaily"> | Date | string;
};
export type ProviderReferralLinkDailyCreateManyLinkInput = {
    orgId: string;
    date: Date | string;
    visits?: number;
    orders?: number;
    completed?: number;
    updatedAt?: Date | string;
};
export type ProviderReferralLinkDailyUpdateWithoutLinkInput = {
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    visits?: Prisma.IntFieldUpdateOperationsInput | number;
    orders?: Prisma.IntFieldUpdateOperationsInput | number;
    completed?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProviderReferralLinkDailyUncheckedUpdateWithoutLinkInput = {
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    visits?: Prisma.IntFieldUpdateOperationsInput | number;
    orders?: Prisma.IntFieldUpdateOperationsInput | number;
    completed?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProviderReferralLinkDailyUncheckedUpdateManyWithoutLinkInput = {
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    visits?: Prisma.IntFieldUpdateOperationsInput | number;
    orders?: Prisma.IntFieldUpdateOperationsInput | number;
    completed?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProviderReferralLinkDailySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    linkId?: boolean;
    orgId?: boolean;
    date?: boolean;
    visits?: boolean;
    orders?: boolean;
    completed?: boolean;
    updatedAt?: boolean;
    link?: boolean | Prisma.ProviderReferralLinkDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["providerReferralLinkDaily"]>;
export type ProviderReferralLinkDailySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    linkId?: boolean;
    orgId?: boolean;
    date?: boolean;
    visits?: boolean;
    orders?: boolean;
    completed?: boolean;
    updatedAt?: boolean;
    link?: boolean | Prisma.ProviderReferralLinkDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["providerReferralLinkDaily"]>;
export type ProviderReferralLinkDailySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    linkId?: boolean;
    orgId?: boolean;
    date?: boolean;
    visits?: boolean;
    orders?: boolean;
    completed?: boolean;
    updatedAt?: boolean;
    link?: boolean | Prisma.ProviderReferralLinkDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["providerReferralLinkDaily"]>;
export type ProviderReferralLinkDailySelectScalar = {
    linkId?: boolean;
    orgId?: boolean;
    date?: boolean;
    visits?: boolean;
    orders?: boolean;
    completed?: boolean;
    updatedAt?: boolean;
};
export type ProviderReferralLinkDailyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"linkId" | "orgId" | "date" | "visits" | "orders" | "completed" | "updatedAt", ExtArgs["result"]["providerReferralLinkDaily"]>;
export type ProviderReferralLinkDailyInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    link?: boolean | Prisma.ProviderReferralLinkDefaultArgs<ExtArgs>;
};
export type ProviderReferralLinkDailyIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    link?: boolean | Prisma.ProviderReferralLinkDefaultArgs<ExtArgs>;
};
export type ProviderReferralLinkDailyIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    link?: boolean | Prisma.ProviderReferralLinkDefaultArgs<ExtArgs>;
};
export type $ProviderReferralLinkDailyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProviderReferralLinkDaily";
    objects: {
        link: Prisma.$ProviderReferralLinkPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        linkId: string;
        orgId: string;
        date: Date;
        visits: number;
        orders: number;
        completed: number;
        updatedAt: Date;
    }, ExtArgs["result"]["providerReferralLinkDaily"]>;
    composites: {};
};
export type ProviderReferralLinkDailyGetPayload<S extends boolean | null | undefined | ProviderReferralLinkDailyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkDailyPayload, S>;
export type ProviderReferralLinkDailyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProviderReferralLinkDailyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProviderReferralLinkDailyCountAggregateInputType | true;
};
export interface ProviderReferralLinkDailyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProviderReferralLinkDaily'];
        meta: {
            name: 'ProviderReferralLinkDaily';
        };
    };
    findUnique<T extends ProviderReferralLinkDailyFindUniqueArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkDailyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkDailyClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkDailyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProviderReferralLinkDailyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkDailyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkDailyClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkDailyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProviderReferralLinkDailyFindFirstArgs>(args?: Prisma.SelectSubset<T, ProviderReferralLinkDailyFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkDailyClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkDailyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProviderReferralLinkDailyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProviderReferralLinkDailyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkDailyClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkDailyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProviderReferralLinkDailyFindManyArgs>(args?: Prisma.SelectSubset<T, ProviderReferralLinkDailyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkDailyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProviderReferralLinkDailyCreateArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkDailyCreateArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkDailyClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkDailyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProviderReferralLinkDailyCreateManyArgs>(args?: Prisma.SelectSubset<T, ProviderReferralLinkDailyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProviderReferralLinkDailyCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProviderReferralLinkDailyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkDailyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProviderReferralLinkDailyDeleteArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkDailyDeleteArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkDailyClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkDailyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProviderReferralLinkDailyUpdateArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkDailyUpdateArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkDailyClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkDailyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProviderReferralLinkDailyDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProviderReferralLinkDailyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProviderReferralLinkDailyUpdateManyArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkDailyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProviderReferralLinkDailyUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkDailyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkDailyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProviderReferralLinkDailyUpsertArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkDailyUpsertArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkDailyClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkDailyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProviderReferralLinkDailyCountArgs>(args?: Prisma.Subset<T, ProviderReferralLinkDailyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProviderReferralLinkDailyCountAggregateOutputType> : number>;
    aggregate<T extends ProviderReferralLinkDailyAggregateArgs>(args: Prisma.Subset<T, ProviderReferralLinkDailyAggregateArgs>): Prisma.PrismaPromise<GetProviderReferralLinkDailyAggregateType<T>>;
    groupBy<T extends ProviderReferralLinkDailyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProviderReferralLinkDailyGroupByArgs['orderBy'];
    } : {
        orderBy?: ProviderReferralLinkDailyGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProviderReferralLinkDailyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProviderReferralLinkDailyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProviderReferralLinkDailyFieldRefs;
}
export interface Prisma__ProviderReferralLinkDailyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    link<T extends Prisma.ProviderReferralLinkDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProviderReferralLinkDefaultArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProviderReferralLinkDailyFieldRefs {
    readonly linkId: Prisma.FieldRef<"ProviderReferralLinkDaily", 'String'>;
    readonly orgId: Prisma.FieldRef<"ProviderReferralLinkDaily", 'String'>;
    readonly date: Prisma.FieldRef<"ProviderReferralLinkDaily", 'DateTime'>;
    readonly visits: Prisma.FieldRef<"ProviderReferralLinkDaily", 'Int'>;
    readonly orders: Prisma.FieldRef<"ProviderReferralLinkDaily", 'Int'>;
    readonly completed: Prisma.FieldRef<"ProviderReferralLinkDaily", 'Int'>;
    readonly updatedAt: Prisma.FieldRef<"ProviderReferralLinkDaily", 'DateTime'>;
}
export type ProviderReferralLinkDailyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkDailySelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkDailyOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkDailyInclude<ExtArgs> | null;
    where: Prisma.ProviderReferralLinkDailyWhereUniqueInput;
};
export type ProviderReferralLinkDailyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkDailySelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkDailyOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkDailyInclude<ExtArgs> | null;
    where: Prisma.ProviderReferralLinkDailyWhereUniqueInput;
};
export type ProviderReferralLinkDailyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkDailySelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkDailyOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkDailyInclude<ExtArgs> | null;
    where?: Prisma.ProviderReferralLinkDailyWhereInput;
    orderBy?: Prisma.ProviderReferralLinkDailyOrderByWithRelationInput | Prisma.ProviderReferralLinkDailyOrderByWithRelationInput[];
    cursor?: Prisma.ProviderReferralLinkDailyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProviderReferralLinkDailyScalarFieldEnum | Prisma.ProviderReferralLinkDailyScalarFieldEnum[];
};
export type ProviderReferralLinkDailyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkDailySelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkDailyOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkDailyInclude<ExtArgs> | null;
    where?: Prisma.ProviderReferralLinkDailyWhereInput;
    orderBy?: Prisma.ProviderReferralLinkDailyOrderByWithRelationInput | Prisma.ProviderReferralLinkDailyOrderByWithRelationInput[];
    cursor?: Prisma.ProviderReferralLinkDailyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProviderReferralLinkDailyScalarFieldEnum | Prisma.ProviderReferralLinkDailyScalarFieldEnum[];
};
export type ProviderReferralLinkDailyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkDailySelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkDailyOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkDailyInclude<ExtArgs> | null;
    where?: Prisma.ProviderReferralLinkDailyWhereInput;
    orderBy?: Prisma.ProviderReferralLinkDailyOrderByWithRelationInput | Prisma.ProviderReferralLinkDailyOrderByWithRelationInput[];
    cursor?: Prisma.ProviderReferralLinkDailyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProviderReferralLinkDailyScalarFieldEnum | Prisma.ProviderReferralLinkDailyScalarFieldEnum[];
};
export type ProviderReferralLinkDailyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkDailySelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkDailyOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkDailyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProviderReferralLinkDailyCreateInput, Prisma.ProviderReferralLinkDailyUncheckedCreateInput>;
};
export type ProviderReferralLinkDailyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProviderReferralLinkDailyCreateManyInput | Prisma.ProviderReferralLinkDailyCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProviderReferralLinkDailyCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkDailySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkDailyOmit<ExtArgs> | null;
    data: Prisma.ProviderReferralLinkDailyCreateManyInput | Prisma.ProviderReferralLinkDailyCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ProviderReferralLinkDailyIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ProviderReferralLinkDailyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkDailySelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkDailyOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkDailyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProviderReferralLinkDailyUpdateInput, Prisma.ProviderReferralLinkDailyUncheckedUpdateInput>;
    where: Prisma.ProviderReferralLinkDailyWhereUniqueInput;
};
export type ProviderReferralLinkDailyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProviderReferralLinkDailyUpdateManyMutationInput, Prisma.ProviderReferralLinkDailyUncheckedUpdateManyInput>;
    where?: Prisma.ProviderReferralLinkDailyWhereInput;
    limit?: number;
};
export type ProviderReferralLinkDailyUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkDailySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkDailyOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProviderReferralLinkDailyUpdateManyMutationInput, Prisma.ProviderReferralLinkDailyUncheckedUpdateManyInput>;
    where?: Prisma.ProviderReferralLinkDailyWhereInput;
    limit?: number;
    include?: Prisma.ProviderReferralLinkDailyIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ProviderReferralLinkDailyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkDailySelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkDailyOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkDailyInclude<ExtArgs> | null;
    where: Prisma.ProviderReferralLinkDailyWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProviderReferralLinkDailyCreateInput, Prisma.ProviderReferralLinkDailyUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProviderReferralLinkDailyUpdateInput, Prisma.ProviderReferralLinkDailyUncheckedUpdateInput>;
};
export type ProviderReferralLinkDailyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkDailySelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkDailyOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkDailyInclude<ExtArgs> | null;
    where: Prisma.ProviderReferralLinkDailyWhereUniqueInput;
};
export type ProviderReferralLinkDailyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProviderReferralLinkDailyWhereInput;
    limit?: number;
};
export type ProviderReferralLinkDailyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkDailySelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkDailyOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkDailyInclude<ExtArgs> | null;
};
