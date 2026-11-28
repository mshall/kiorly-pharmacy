import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ColdChainReadingModel = runtime.Types.Result.DefaultSelection<Prisma.$ColdChainReadingPayload>;
export type AggregateColdChainReading = {
    _count: ColdChainReadingCountAggregateOutputType | null;
    _avg: ColdChainReadingAvgAggregateOutputType | null;
    _sum: ColdChainReadingSumAggregateOutputType | null;
    _min: ColdChainReadingMinAggregateOutputType | null;
    _max: ColdChainReadingMaxAggregateOutputType | null;
};
export type ColdChainReadingAvgAggregateOutputType = {
    temperatureC: runtime.Decimal | null;
};
export type ColdChainReadingSumAggregateOutputType = {
    temperatureC: runtime.Decimal | null;
};
export type ColdChainReadingMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    lotId: string | null;
    temperatureC: runtime.Decimal | null;
    excursion: boolean | null;
    recordedBy: string | null;
    recordedAt: Date | null;
};
export type ColdChainReadingMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    lotId: string | null;
    temperatureC: runtime.Decimal | null;
    excursion: boolean | null;
    recordedBy: string | null;
    recordedAt: Date | null;
};
export type ColdChainReadingCountAggregateOutputType = {
    id: number;
    orgId: number;
    lotId: number;
    temperatureC: number;
    excursion: number;
    recordedBy: number;
    recordedAt: number;
    _all: number;
};
export type ColdChainReadingAvgAggregateInputType = {
    temperatureC?: true;
};
export type ColdChainReadingSumAggregateInputType = {
    temperatureC?: true;
};
export type ColdChainReadingMinAggregateInputType = {
    id?: true;
    orgId?: true;
    lotId?: true;
    temperatureC?: true;
    excursion?: true;
    recordedBy?: true;
    recordedAt?: true;
};
export type ColdChainReadingMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    lotId?: true;
    temperatureC?: true;
    excursion?: true;
    recordedBy?: true;
    recordedAt?: true;
};
export type ColdChainReadingCountAggregateInputType = {
    id?: true;
    orgId?: true;
    lotId?: true;
    temperatureC?: true;
    excursion?: true;
    recordedBy?: true;
    recordedAt?: true;
    _all?: true;
};
export type ColdChainReadingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ColdChainReadingWhereInput;
    orderBy?: Prisma.ColdChainReadingOrderByWithRelationInput | Prisma.ColdChainReadingOrderByWithRelationInput[];
    cursor?: Prisma.ColdChainReadingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ColdChainReadingCountAggregateInputType;
    _avg?: ColdChainReadingAvgAggregateInputType;
    _sum?: ColdChainReadingSumAggregateInputType;
    _min?: ColdChainReadingMinAggregateInputType;
    _max?: ColdChainReadingMaxAggregateInputType;
};
export type GetColdChainReadingAggregateType<T extends ColdChainReadingAggregateArgs> = {
    [P in keyof T & keyof AggregateColdChainReading]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateColdChainReading[P]> : Prisma.GetScalarType<T[P], AggregateColdChainReading[P]>;
};
export type ColdChainReadingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ColdChainReadingWhereInput;
    orderBy?: Prisma.ColdChainReadingOrderByWithAggregationInput | Prisma.ColdChainReadingOrderByWithAggregationInput[];
    by: Prisma.ColdChainReadingScalarFieldEnum[] | Prisma.ColdChainReadingScalarFieldEnum;
    having?: Prisma.ColdChainReadingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ColdChainReadingCountAggregateInputType | true;
    _avg?: ColdChainReadingAvgAggregateInputType;
    _sum?: ColdChainReadingSumAggregateInputType;
    _min?: ColdChainReadingMinAggregateInputType;
    _max?: ColdChainReadingMaxAggregateInputType;
};
export type ColdChainReadingGroupByOutputType = {
    id: string;
    orgId: string;
    lotId: string;
    temperatureC: runtime.Decimal;
    excursion: boolean;
    recordedBy: string;
    recordedAt: Date;
    _count: ColdChainReadingCountAggregateOutputType | null;
    _avg: ColdChainReadingAvgAggregateOutputType | null;
    _sum: ColdChainReadingSumAggregateOutputType | null;
    _min: ColdChainReadingMinAggregateOutputType | null;
    _max: ColdChainReadingMaxAggregateOutputType | null;
};
export type GetColdChainReadingGroupByPayload<T extends ColdChainReadingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ColdChainReadingGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ColdChainReadingGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ColdChainReadingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ColdChainReadingGroupByOutputType[P]>;
}>>;
export type ColdChainReadingWhereInput = {
    AND?: Prisma.ColdChainReadingWhereInput | Prisma.ColdChainReadingWhereInput[];
    OR?: Prisma.ColdChainReadingWhereInput[];
    NOT?: Prisma.ColdChainReadingWhereInput | Prisma.ColdChainReadingWhereInput[];
    id?: Prisma.StringFilter<"ColdChainReading"> | string;
    orgId?: Prisma.StringFilter<"ColdChainReading"> | string;
    lotId?: Prisma.StringFilter<"ColdChainReading"> | string;
    temperatureC?: Prisma.DecimalFilter<"ColdChainReading"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: Prisma.BoolFilter<"ColdChainReading"> | boolean;
    recordedBy?: Prisma.StringFilter<"ColdChainReading"> | string;
    recordedAt?: Prisma.DateTimeFilter<"ColdChainReading"> | Date | string;
    lot?: Prisma.XOR<Prisma.StockLotScalarRelationFilter, Prisma.StockLotWhereInput>;
};
export type ColdChainReadingOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    temperatureC?: Prisma.SortOrder;
    excursion?: Prisma.SortOrder;
    recordedBy?: Prisma.SortOrder;
    recordedAt?: Prisma.SortOrder;
    lot?: Prisma.StockLotOrderByWithRelationInput;
};
export type ColdChainReadingWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ColdChainReadingWhereInput | Prisma.ColdChainReadingWhereInput[];
    OR?: Prisma.ColdChainReadingWhereInput[];
    NOT?: Prisma.ColdChainReadingWhereInput | Prisma.ColdChainReadingWhereInput[];
    orgId?: Prisma.StringFilter<"ColdChainReading"> | string;
    lotId?: Prisma.StringFilter<"ColdChainReading"> | string;
    temperatureC?: Prisma.DecimalFilter<"ColdChainReading"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: Prisma.BoolFilter<"ColdChainReading"> | boolean;
    recordedBy?: Prisma.StringFilter<"ColdChainReading"> | string;
    recordedAt?: Prisma.DateTimeFilter<"ColdChainReading"> | Date | string;
    lot?: Prisma.XOR<Prisma.StockLotScalarRelationFilter, Prisma.StockLotWhereInput>;
}, "id">;
export type ColdChainReadingOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    temperatureC?: Prisma.SortOrder;
    excursion?: Prisma.SortOrder;
    recordedBy?: Prisma.SortOrder;
    recordedAt?: Prisma.SortOrder;
    _count?: Prisma.ColdChainReadingCountOrderByAggregateInput;
    _avg?: Prisma.ColdChainReadingAvgOrderByAggregateInput;
    _max?: Prisma.ColdChainReadingMaxOrderByAggregateInput;
    _min?: Prisma.ColdChainReadingMinOrderByAggregateInput;
    _sum?: Prisma.ColdChainReadingSumOrderByAggregateInput;
};
export type ColdChainReadingScalarWhereWithAggregatesInput = {
    AND?: Prisma.ColdChainReadingScalarWhereWithAggregatesInput | Prisma.ColdChainReadingScalarWhereWithAggregatesInput[];
    OR?: Prisma.ColdChainReadingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ColdChainReadingScalarWhereWithAggregatesInput | Prisma.ColdChainReadingScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ColdChainReading"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"ColdChainReading"> | string;
    lotId?: Prisma.StringWithAggregatesFilter<"ColdChainReading"> | string;
    temperatureC?: Prisma.DecimalWithAggregatesFilter<"ColdChainReading"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: Prisma.BoolWithAggregatesFilter<"ColdChainReading"> | boolean;
    recordedBy?: Prisma.StringWithAggregatesFilter<"ColdChainReading"> | string;
    recordedAt?: Prisma.DateTimeWithAggregatesFilter<"ColdChainReading"> | Date | string;
};
export type ColdChainReadingCreateInput = {
    id?: string;
    orgId: string;
    temperatureC: runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: boolean;
    recordedBy: string;
    recordedAt?: Date | string;
    lot: Prisma.StockLotCreateNestedOneWithoutReadingsInput;
};
export type ColdChainReadingUncheckedCreateInput = {
    id?: string;
    orgId: string;
    lotId: string;
    temperatureC: runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: boolean;
    recordedBy: string;
    recordedAt?: Date | string;
};
export type ColdChainReadingUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    temperatureC?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    recordedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    recordedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lot?: Prisma.StockLotUpdateOneRequiredWithoutReadingsNestedInput;
};
export type ColdChainReadingUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    temperatureC?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    recordedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    recordedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ColdChainReadingCreateManyInput = {
    id?: string;
    orgId: string;
    lotId: string;
    temperatureC: runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: boolean;
    recordedBy: string;
    recordedAt?: Date | string;
};
export type ColdChainReadingUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    temperatureC?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    recordedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    recordedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ColdChainReadingUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    temperatureC?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    recordedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    recordedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ColdChainReadingListRelationFilter = {
    every?: Prisma.ColdChainReadingWhereInput;
    some?: Prisma.ColdChainReadingWhereInput;
    none?: Prisma.ColdChainReadingWhereInput;
};
export type ColdChainReadingOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ColdChainReadingCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    temperatureC?: Prisma.SortOrder;
    excursion?: Prisma.SortOrder;
    recordedBy?: Prisma.SortOrder;
    recordedAt?: Prisma.SortOrder;
};
export type ColdChainReadingAvgOrderByAggregateInput = {
    temperatureC?: Prisma.SortOrder;
};
export type ColdChainReadingMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    temperatureC?: Prisma.SortOrder;
    excursion?: Prisma.SortOrder;
    recordedBy?: Prisma.SortOrder;
    recordedAt?: Prisma.SortOrder;
};
export type ColdChainReadingMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    temperatureC?: Prisma.SortOrder;
    excursion?: Prisma.SortOrder;
    recordedBy?: Prisma.SortOrder;
    recordedAt?: Prisma.SortOrder;
};
export type ColdChainReadingSumOrderByAggregateInput = {
    temperatureC?: Prisma.SortOrder;
};
export type ColdChainReadingCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.ColdChainReadingCreateWithoutLotInput, Prisma.ColdChainReadingUncheckedCreateWithoutLotInput> | Prisma.ColdChainReadingCreateWithoutLotInput[] | Prisma.ColdChainReadingUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.ColdChainReadingCreateOrConnectWithoutLotInput | Prisma.ColdChainReadingCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.ColdChainReadingCreateManyLotInputEnvelope;
    connect?: Prisma.ColdChainReadingWhereUniqueInput | Prisma.ColdChainReadingWhereUniqueInput[];
};
export type ColdChainReadingUncheckedCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.ColdChainReadingCreateWithoutLotInput, Prisma.ColdChainReadingUncheckedCreateWithoutLotInput> | Prisma.ColdChainReadingCreateWithoutLotInput[] | Prisma.ColdChainReadingUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.ColdChainReadingCreateOrConnectWithoutLotInput | Prisma.ColdChainReadingCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.ColdChainReadingCreateManyLotInputEnvelope;
    connect?: Prisma.ColdChainReadingWhereUniqueInput | Prisma.ColdChainReadingWhereUniqueInput[];
};
export type ColdChainReadingUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.ColdChainReadingCreateWithoutLotInput, Prisma.ColdChainReadingUncheckedCreateWithoutLotInput> | Prisma.ColdChainReadingCreateWithoutLotInput[] | Prisma.ColdChainReadingUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.ColdChainReadingCreateOrConnectWithoutLotInput | Prisma.ColdChainReadingCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.ColdChainReadingUpsertWithWhereUniqueWithoutLotInput | Prisma.ColdChainReadingUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.ColdChainReadingCreateManyLotInputEnvelope;
    set?: Prisma.ColdChainReadingWhereUniqueInput | Prisma.ColdChainReadingWhereUniqueInput[];
    disconnect?: Prisma.ColdChainReadingWhereUniqueInput | Prisma.ColdChainReadingWhereUniqueInput[];
    delete?: Prisma.ColdChainReadingWhereUniqueInput | Prisma.ColdChainReadingWhereUniqueInput[];
    connect?: Prisma.ColdChainReadingWhereUniqueInput | Prisma.ColdChainReadingWhereUniqueInput[];
    update?: Prisma.ColdChainReadingUpdateWithWhereUniqueWithoutLotInput | Prisma.ColdChainReadingUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.ColdChainReadingUpdateManyWithWhereWithoutLotInput | Prisma.ColdChainReadingUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.ColdChainReadingScalarWhereInput | Prisma.ColdChainReadingScalarWhereInput[];
};
export type ColdChainReadingUncheckedUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.ColdChainReadingCreateWithoutLotInput, Prisma.ColdChainReadingUncheckedCreateWithoutLotInput> | Prisma.ColdChainReadingCreateWithoutLotInput[] | Prisma.ColdChainReadingUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.ColdChainReadingCreateOrConnectWithoutLotInput | Prisma.ColdChainReadingCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.ColdChainReadingUpsertWithWhereUniqueWithoutLotInput | Prisma.ColdChainReadingUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.ColdChainReadingCreateManyLotInputEnvelope;
    set?: Prisma.ColdChainReadingWhereUniqueInput | Prisma.ColdChainReadingWhereUniqueInput[];
    disconnect?: Prisma.ColdChainReadingWhereUniqueInput | Prisma.ColdChainReadingWhereUniqueInput[];
    delete?: Prisma.ColdChainReadingWhereUniqueInput | Prisma.ColdChainReadingWhereUniqueInput[];
    connect?: Prisma.ColdChainReadingWhereUniqueInput | Prisma.ColdChainReadingWhereUniqueInput[];
    update?: Prisma.ColdChainReadingUpdateWithWhereUniqueWithoutLotInput | Prisma.ColdChainReadingUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.ColdChainReadingUpdateManyWithWhereWithoutLotInput | Prisma.ColdChainReadingUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.ColdChainReadingScalarWhereInput | Prisma.ColdChainReadingScalarWhereInput[];
};
export type ColdChainReadingCreateWithoutLotInput = {
    id?: string;
    orgId: string;
    temperatureC: runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: boolean;
    recordedBy: string;
    recordedAt?: Date | string;
};
export type ColdChainReadingUncheckedCreateWithoutLotInput = {
    id?: string;
    orgId: string;
    temperatureC: runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: boolean;
    recordedBy: string;
    recordedAt?: Date | string;
};
export type ColdChainReadingCreateOrConnectWithoutLotInput = {
    where: Prisma.ColdChainReadingWhereUniqueInput;
    create: Prisma.XOR<Prisma.ColdChainReadingCreateWithoutLotInput, Prisma.ColdChainReadingUncheckedCreateWithoutLotInput>;
};
export type ColdChainReadingCreateManyLotInputEnvelope = {
    data: Prisma.ColdChainReadingCreateManyLotInput | Prisma.ColdChainReadingCreateManyLotInput[];
    skipDuplicates?: boolean;
};
export type ColdChainReadingUpsertWithWhereUniqueWithoutLotInput = {
    where: Prisma.ColdChainReadingWhereUniqueInput;
    update: Prisma.XOR<Prisma.ColdChainReadingUpdateWithoutLotInput, Prisma.ColdChainReadingUncheckedUpdateWithoutLotInput>;
    create: Prisma.XOR<Prisma.ColdChainReadingCreateWithoutLotInput, Prisma.ColdChainReadingUncheckedCreateWithoutLotInput>;
};
export type ColdChainReadingUpdateWithWhereUniqueWithoutLotInput = {
    where: Prisma.ColdChainReadingWhereUniqueInput;
    data: Prisma.XOR<Prisma.ColdChainReadingUpdateWithoutLotInput, Prisma.ColdChainReadingUncheckedUpdateWithoutLotInput>;
};
export type ColdChainReadingUpdateManyWithWhereWithoutLotInput = {
    where: Prisma.ColdChainReadingScalarWhereInput;
    data: Prisma.XOR<Prisma.ColdChainReadingUpdateManyMutationInput, Prisma.ColdChainReadingUncheckedUpdateManyWithoutLotInput>;
};
export type ColdChainReadingScalarWhereInput = {
    AND?: Prisma.ColdChainReadingScalarWhereInput | Prisma.ColdChainReadingScalarWhereInput[];
    OR?: Prisma.ColdChainReadingScalarWhereInput[];
    NOT?: Prisma.ColdChainReadingScalarWhereInput | Prisma.ColdChainReadingScalarWhereInput[];
    id?: Prisma.StringFilter<"ColdChainReading"> | string;
    orgId?: Prisma.StringFilter<"ColdChainReading"> | string;
    lotId?: Prisma.StringFilter<"ColdChainReading"> | string;
    temperatureC?: Prisma.DecimalFilter<"ColdChainReading"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: Prisma.BoolFilter<"ColdChainReading"> | boolean;
    recordedBy?: Prisma.StringFilter<"ColdChainReading"> | string;
    recordedAt?: Prisma.DateTimeFilter<"ColdChainReading"> | Date | string;
};
export type ColdChainReadingCreateManyLotInput = {
    id?: string;
    orgId: string;
    temperatureC: runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: boolean;
    recordedBy: string;
    recordedAt?: Date | string;
};
export type ColdChainReadingUpdateWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    temperatureC?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    recordedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    recordedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ColdChainReadingUncheckedUpdateWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    temperatureC?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    recordedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    recordedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ColdChainReadingUncheckedUpdateManyWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    temperatureC?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    excursion?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    recordedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    recordedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ColdChainReadingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    lotId?: boolean;
    temperatureC?: boolean;
    excursion?: boolean;
    recordedBy?: boolean;
    recordedAt?: boolean;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["coldChainReading"]>;
export type ColdChainReadingSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    lotId?: boolean;
    temperatureC?: boolean;
    excursion?: boolean;
    recordedBy?: boolean;
    recordedAt?: boolean;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["coldChainReading"]>;
export type ColdChainReadingSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    lotId?: boolean;
    temperatureC?: boolean;
    excursion?: boolean;
    recordedBy?: boolean;
    recordedAt?: boolean;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["coldChainReading"]>;
export type ColdChainReadingSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    lotId?: boolean;
    temperatureC?: boolean;
    excursion?: boolean;
    recordedBy?: boolean;
    recordedAt?: boolean;
};
export type ColdChainReadingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "lotId" | "temperatureC" | "excursion" | "recordedBy" | "recordedAt", ExtArgs["result"]["coldChainReading"]>;
export type ColdChainReadingInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
};
export type ColdChainReadingIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
};
export type ColdChainReadingIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
};
export type $ColdChainReadingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ColdChainReading";
    objects: {
        lot: Prisma.$StockLotPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        lotId: string;
        temperatureC: runtime.Decimal;
        excursion: boolean;
        recordedBy: string;
        recordedAt: Date;
    }, ExtArgs["result"]["coldChainReading"]>;
    composites: {};
};
export type ColdChainReadingGetPayload<S extends boolean | null | undefined | ColdChainReadingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ColdChainReadingPayload, S>;
export type ColdChainReadingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ColdChainReadingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ColdChainReadingCountAggregateInputType | true;
};
export interface ColdChainReadingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ColdChainReading'];
        meta: {
            name: 'ColdChainReading';
        };
    };
    findUnique<T extends ColdChainReadingFindUniqueArgs>(args: Prisma.SelectSubset<T, ColdChainReadingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ColdChainReadingClient<runtime.Types.Result.GetResult<Prisma.$ColdChainReadingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ColdChainReadingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ColdChainReadingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ColdChainReadingClient<runtime.Types.Result.GetResult<Prisma.$ColdChainReadingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ColdChainReadingFindFirstArgs>(args?: Prisma.SelectSubset<T, ColdChainReadingFindFirstArgs<ExtArgs>>): Prisma.Prisma__ColdChainReadingClient<runtime.Types.Result.GetResult<Prisma.$ColdChainReadingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ColdChainReadingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ColdChainReadingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ColdChainReadingClient<runtime.Types.Result.GetResult<Prisma.$ColdChainReadingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ColdChainReadingFindManyArgs>(args?: Prisma.SelectSubset<T, ColdChainReadingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ColdChainReadingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ColdChainReadingCreateArgs>(args: Prisma.SelectSubset<T, ColdChainReadingCreateArgs<ExtArgs>>): Prisma.Prisma__ColdChainReadingClient<runtime.Types.Result.GetResult<Prisma.$ColdChainReadingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ColdChainReadingCreateManyArgs>(args?: Prisma.SelectSubset<T, ColdChainReadingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ColdChainReadingCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ColdChainReadingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ColdChainReadingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ColdChainReadingDeleteArgs>(args: Prisma.SelectSubset<T, ColdChainReadingDeleteArgs<ExtArgs>>): Prisma.Prisma__ColdChainReadingClient<runtime.Types.Result.GetResult<Prisma.$ColdChainReadingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ColdChainReadingUpdateArgs>(args: Prisma.SelectSubset<T, ColdChainReadingUpdateArgs<ExtArgs>>): Prisma.Prisma__ColdChainReadingClient<runtime.Types.Result.GetResult<Prisma.$ColdChainReadingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ColdChainReadingDeleteManyArgs>(args?: Prisma.SelectSubset<T, ColdChainReadingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ColdChainReadingUpdateManyArgs>(args: Prisma.SelectSubset<T, ColdChainReadingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ColdChainReadingUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ColdChainReadingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ColdChainReadingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ColdChainReadingUpsertArgs>(args: Prisma.SelectSubset<T, ColdChainReadingUpsertArgs<ExtArgs>>): Prisma.Prisma__ColdChainReadingClient<runtime.Types.Result.GetResult<Prisma.$ColdChainReadingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ColdChainReadingCountArgs>(args?: Prisma.Subset<T, ColdChainReadingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ColdChainReadingCountAggregateOutputType> : number>;
    aggregate<T extends ColdChainReadingAggregateArgs>(args: Prisma.Subset<T, ColdChainReadingAggregateArgs>): Prisma.PrismaPromise<GetColdChainReadingAggregateType<T>>;
    groupBy<T extends ColdChainReadingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ColdChainReadingGroupByArgs['orderBy'];
    } : {
        orderBy?: ColdChainReadingGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ColdChainReadingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetColdChainReadingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ColdChainReadingFieldRefs;
}
export interface Prisma__ColdChainReadingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    lot<T extends Prisma.StockLotDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.StockLotDefaultArgs<ExtArgs>>): Prisma.Prisma__StockLotClient<runtime.Types.Result.GetResult<Prisma.$StockLotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ColdChainReadingFieldRefs {
    readonly id: Prisma.FieldRef<"ColdChainReading", 'String'>;
    readonly orgId: Prisma.FieldRef<"ColdChainReading", 'String'>;
    readonly lotId: Prisma.FieldRef<"ColdChainReading", 'String'>;
    readonly temperatureC: Prisma.FieldRef<"ColdChainReading", 'Decimal'>;
    readonly excursion: Prisma.FieldRef<"ColdChainReading", 'Boolean'>;
    readonly recordedBy: Prisma.FieldRef<"ColdChainReading", 'String'>;
    readonly recordedAt: Prisma.FieldRef<"ColdChainReading", 'DateTime'>;
}
export type ColdChainReadingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ColdChainReadingSelect<ExtArgs> | null;
    omit?: Prisma.ColdChainReadingOmit<ExtArgs> | null;
    include?: Prisma.ColdChainReadingInclude<ExtArgs> | null;
    where: Prisma.ColdChainReadingWhereUniqueInput;
};
export type ColdChainReadingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ColdChainReadingSelect<ExtArgs> | null;
    omit?: Prisma.ColdChainReadingOmit<ExtArgs> | null;
    include?: Prisma.ColdChainReadingInclude<ExtArgs> | null;
    where: Prisma.ColdChainReadingWhereUniqueInput;
};
export type ColdChainReadingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ColdChainReadingSelect<ExtArgs> | null;
    omit?: Prisma.ColdChainReadingOmit<ExtArgs> | null;
    include?: Prisma.ColdChainReadingInclude<ExtArgs> | null;
    where?: Prisma.ColdChainReadingWhereInput;
    orderBy?: Prisma.ColdChainReadingOrderByWithRelationInput | Prisma.ColdChainReadingOrderByWithRelationInput[];
    cursor?: Prisma.ColdChainReadingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ColdChainReadingScalarFieldEnum | Prisma.ColdChainReadingScalarFieldEnum[];
};
export type ColdChainReadingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ColdChainReadingSelect<ExtArgs> | null;
    omit?: Prisma.ColdChainReadingOmit<ExtArgs> | null;
    include?: Prisma.ColdChainReadingInclude<ExtArgs> | null;
    where?: Prisma.ColdChainReadingWhereInput;
    orderBy?: Prisma.ColdChainReadingOrderByWithRelationInput | Prisma.ColdChainReadingOrderByWithRelationInput[];
    cursor?: Prisma.ColdChainReadingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ColdChainReadingScalarFieldEnum | Prisma.ColdChainReadingScalarFieldEnum[];
};
export type ColdChainReadingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ColdChainReadingSelect<ExtArgs> | null;
    omit?: Prisma.ColdChainReadingOmit<ExtArgs> | null;
    include?: Prisma.ColdChainReadingInclude<ExtArgs> | null;
    where?: Prisma.ColdChainReadingWhereInput;
    orderBy?: Prisma.ColdChainReadingOrderByWithRelationInput | Prisma.ColdChainReadingOrderByWithRelationInput[];
    cursor?: Prisma.ColdChainReadingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ColdChainReadingScalarFieldEnum | Prisma.ColdChainReadingScalarFieldEnum[];
};
export type ColdChainReadingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ColdChainReadingSelect<ExtArgs> | null;
    omit?: Prisma.ColdChainReadingOmit<ExtArgs> | null;
    include?: Prisma.ColdChainReadingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ColdChainReadingCreateInput, Prisma.ColdChainReadingUncheckedCreateInput>;
};
export type ColdChainReadingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ColdChainReadingCreateManyInput | Prisma.ColdChainReadingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ColdChainReadingCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ColdChainReadingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ColdChainReadingOmit<ExtArgs> | null;
    data: Prisma.ColdChainReadingCreateManyInput | Prisma.ColdChainReadingCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ColdChainReadingIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ColdChainReadingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ColdChainReadingSelect<ExtArgs> | null;
    omit?: Prisma.ColdChainReadingOmit<ExtArgs> | null;
    include?: Prisma.ColdChainReadingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ColdChainReadingUpdateInput, Prisma.ColdChainReadingUncheckedUpdateInput>;
    where: Prisma.ColdChainReadingWhereUniqueInput;
};
export type ColdChainReadingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ColdChainReadingUpdateManyMutationInput, Prisma.ColdChainReadingUncheckedUpdateManyInput>;
    where?: Prisma.ColdChainReadingWhereInput;
    limit?: number;
};
export type ColdChainReadingUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ColdChainReadingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ColdChainReadingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ColdChainReadingUpdateManyMutationInput, Prisma.ColdChainReadingUncheckedUpdateManyInput>;
    where?: Prisma.ColdChainReadingWhereInput;
    limit?: number;
    include?: Prisma.ColdChainReadingIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ColdChainReadingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ColdChainReadingSelect<ExtArgs> | null;
    omit?: Prisma.ColdChainReadingOmit<ExtArgs> | null;
    include?: Prisma.ColdChainReadingInclude<ExtArgs> | null;
    where: Prisma.ColdChainReadingWhereUniqueInput;
    create: Prisma.XOR<Prisma.ColdChainReadingCreateInput, Prisma.ColdChainReadingUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ColdChainReadingUpdateInput, Prisma.ColdChainReadingUncheckedUpdateInput>;
};
export type ColdChainReadingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ColdChainReadingSelect<ExtArgs> | null;
    omit?: Prisma.ColdChainReadingOmit<ExtArgs> | null;
    include?: Prisma.ColdChainReadingInclude<ExtArgs> | null;
    where: Prisma.ColdChainReadingWhereUniqueInput;
};
export type ColdChainReadingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ColdChainReadingWhereInput;
    limit?: number;
};
export type ColdChainReadingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ColdChainReadingSelect<ExtArgs> | null;
    omit?: Prisma.ColdChainReadingOmit<ExtArgs> | null;
    include?: Prisma.ColdChainReadingInclude<ExtArgs> | null;
};
