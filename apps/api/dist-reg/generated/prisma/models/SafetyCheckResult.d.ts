import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type SafetyCheckResultModel = runtime.Types.Result.DefaultSelection<Prisma.$SafetyCheckResultPayload>;
export type AggregateSafetyCheckResult = {
    _count: SafetyCheckResultCountAggregateOutputType | null;
    _min: SafetyCheckResultMinAggregateOutputType | null;
    _max: SafetyCheckResultMaxAggregateOutputType | null;
};
export type SafetyCheckResultMinAggregateOutputType = {
    id: string | null;
    dispensingId: string | null;
    kind: $Enums.SafetyCheckKind | null;
    outcome: $Enums.SafetyCheckOutcome | null;
    detail: string | null;
    overridable: boolean | null;
    overriddenBy: string | null;
    overrideReason: string | null;
    checkedAt: Date | null;
};
export type SafetyCheckResultMaxAggregateOutputType = {
    id: string | null;
    dispensingId: string | null;
    kind: $Enums.SafetyCheckKind | null;
    outcome: $Enums.SafetyCheckOutcome | null;
    detail: string | null;
    overridable: boolean | null;
    overriddenBy: string | null;
    overrideReason: string | null;
    checkedAt: Date | null;
};
export type SafetyCheckResultCountAggregateOutputType = {
    id: number;
    dispensingId: number;
    kind: number;
    outcome: number;
    detail: number;
    overridable: number;
    overriddenBy: number;
    overrideReason: number;
    checkedAt: number;
    _all: number;
};
export type SafetyCheckResultMinAggregateInputType = {
    id?: true;
    dispensingId?: true;
    kind?: true;
    outcome?: true;
    detail?: true;
    overridable?: true;
    overriddenBy?: true;
    overrideReason?: true;
    checkedAt?: true;
};
export type SafetyCheckResultMaxAggregateInputType = {
    id?: true;
    dispensingId?: true;
    kind?: true;
    outcome?: true;
    detail?: true;
    overridable?: true;
    overriddenBy?: true;
    overrideReason?: true;
    checkedAt?: true;
};
export type SafetyCheckResultCountAggregateInputType = {
    id?: true;
    dispensingId?: true;
    kind?: true;
    outcome?: true;
    detail?: true;
    overridable?: true;
    overriddenBy?: true;
    overrideReason?: true;
    checkedAt?: true;
    _all?: true;
};
export type SafetyCheckResultAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SafetyCheckResultWhereInput;
    orderBy?: Prisma.SafetyCheckResultOrderByWithRelationInput | Prisma.SafetyCheckResultOrderByWithRelationInput[];
    cursor?: Prisma.SafetyCheckResultWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SafetyCheckResultCountAggregateInputType;
    _min?: SafetyCheckResultMinAggregateInputType;
    _max?: SafetyCheckResultMaxAggregateInputType;
};
export type GetSafetyCheckResultAggregateType<T extends SafetyCheckResultAggregateArgs> = {
    [P in keyof T & keyof AggregateSafetyCheckResult]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSafetyCheckResult[P]> : Prisma.GetScalarType<T[P], AggregateSafetyCheckResult[P]>;
};
export type SafetyCheckResultGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SafetyCheckResultWhereInput;
    orderBy?: Prisma.SafetyCheckResultOrderByWithAggregationInput | Prisma.SafetyCheckResultOrderByWithAggregationInput[];
    by: Prisma.SafetyCheckResultScalarFieldEnum[] | Prisma.SafetyCheckResultScalarFieldEnum;
    having?: Prisma.SafetyCheckResultScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SafetyCheckResultCountAggregateInputType | true;
    _min?: SafetyCheckResultMinAggregateInputType;
    _max?: SafetyCheckResultMaxAggregateInputType;
};
export type SafetyCheckResultGroupByOutputType = {
    id: string;
    dispensingId: string;
    kind: $Enums.SafetyCheckKind;
    outcome: $Enums.SafetyCheckOutcome;
    detail: string | null;
    overridable: boolean;
    overriddenBy: string | null;
    overrideReason: string | null;
    checkedAt: Date;
    _count: SafetyCheckResultCountAggregateOutputType | null;
    _min: SafetyCheckResultMinAggregateOutputType | null;
    _max: SafetyCheckResultMaxAggregateOutputType | null;
};
export type GetSafetyCheckResultGroupByPayload<T extends SafetyCheckResultGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SafetyCheckResultGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SafetyCheckResultGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SafetyCheckResultGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SafetyCheckResultGroupByOutputType[P]>;
}>>;
export type SafetyCheckResultWhereInput = {
    AND?: Prisma.SafetyCheckResultWhereInput | Prisma.SafetyCheckResultWhereInput[];
    OR?: Prisma.SafetyCheckResultWhereInput[];
    NOT?: Prisma.SafetyCheckResultWhereInput | Prisma.SafetyCheckResultWhereInput[];
    id?: Prisma.StringFilter<"SafetyCheckResult"> | string;
    dispensingId?: Prisma.StringFilter<"SafetyCheckResult"> | string;
    kind?: Prisma.EnumSafetyCheckKindFilter<"SafetyCheckResult"> | $Enums.SafetyCheckKind;
    outcome?: Prisma.EnumSafetyCheckOutcomeFilter<"SafetyCheckResult"> | $Enums.SafetyCheckOutcome;
    detail?: Prisma.StringNullableFilter<"SafetyCheckResult"> | string | null;
    overridable?: Prisma.BoolFilter<"SafetyCheckResult"> | boolean;
    overriddenBy?: Prisma.StringNullableFilter<"SafetyCheckResult"> | string | null;
    overrideReason?: Prisma.StringNullableFilter<"SafetyCheckResult"> | string | null;
    checkedAt?: Prisma.DateTimeFilter<"SafetyCheckResult"> | Date | string;
    dispensing?: Prisma.XOR<Prisma.DispensingScalarRelationFilter, Prisma.DispensingWhereInput>;
};
export type SafetyCheckResultOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    dispensingId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    outcome?: Prisma.SortOrder;
    detail?: Prisma.SortOrderInput | Prisma.SortOrder;
    overridable?: Prisma.SortOrder;
    overriddenBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    overrideReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    checkedAt?: Prisma.SortOrder;
    dispensing?: Prisma.DispensingOrderByWithRelationInput;
};
export type SafetyCheckResultWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SafetyCheckResultWhereInput | Prisma.SafetyCheckResultWhereInput[];
    OR?: Prisma.SafetyCheckResultWhereInput[];
    NOT?: Prisma.SafetyCheckResultWhereInput | Prisma.SafetyCheckResultWhereInput[];
    dispensingId?: Prisma.StringFilter<"SafetyCheckResult"> | string;
    kind?: Prisma.EnumSafetyCheckKindFilter<"SafetyCheckResult"> | $Enums.SafetyCheckKind;
    outcome?: Prisma.EnumSafetyCheckOutcomeFilter<"SafetyCheckResult"> | $Enums.SafetyCheckOutcome;
    detail?: Prisma.StringNullableFilter<"SafetyCheckResult"> | string | null;
    overridable?: Prisma.BoolFilter<"SafetyCheckResult"> | boolean;
    overriddenBy?: Prisma.StringNullableFilter<"SafetyCheckResult"> | string | null;
    overrideReason?: Prisma.StringNullableFilter<"SafetyCheckResult"> | string | null;
    checkedAt?: Prisma.DateTimeFilter<"SafetyCheckResult"> | Date | string;
    dispensing?: Prisma.XOR<Prisma.DispensingScalarRelationFilter, Prisma.DispensingWhereInput>;
}, "id">;
export type SafetyCheckResultOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    dispensingId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    outcome?: Prisma.SortOrder;
    detail?: Prisma.SortOrderInput | Prisma.SortOrder;
    overridable?: Prisma.SortOrder;
    overriddenBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    overrideReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    checkedAt?: Prisma.SortOrder;
    _count?: Prisma.SafetyCheckResultCountOrderByAggregateInput;
    _max?: Prisma.SafetyCheckResultMaxOrderByAggregateInput;
    _min?: Prisma.SafetyCheckResultMinOrderByAggregateInput;
};
export type SafetyCheckResultScalarWhereWithAggregatesInput = {
    AND?: Prisma.SafetyCheckResultScalarWhereWithAggregatesInput | Prisma.SafetyCheckResultScalarWhereWithAggregatesInput[];
    OR?: Prisma.SafetyCheckResultScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SafetyCheckResultScalarWhereWithAggregatesInput | Prisma.SafetyCheckResultScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SafetyCheckResult"> | string;
    dispensingId?: Prisma.StringWithAggregatesFilter<"SafetyCheckResult"> | string;
    kind?: Prisma.EnumSafetyCheckKindWithAggregatesFilter<"SafetyCheckResult"> | $Enums.SafetyCheckKind;
    outcome?: Prisma.EnumSafetyCheckOutcomeWithAggregatesFilter<"SafetyCheckResult"> | $Enums.SafetyCheckOutcome;
    detail?: Prisma.StringNullableWithAggregatesFilter<"SafetyCheckResult"> | string | null;
    overridable?: Prisma.BoolWithAggregatesFilter<"SafetyCheckResult"> | boolean;
    overriddenBy?: Prisma.StringNullableWithAggregatesFilter<"SafetyCheckResult"> | string | null;
    overrideReason?: Prisma.StringNullableWithAggregatesFilter<"SafetyCheckResult"> | string | null;
    checkedAt?: Prisma.DateTimeWithAggregatesFilter<"SafetyCheckResult"> | Date | string;
};
export type SafetyCheckResultCreateInput = {
    id?: string;
    kind: $Enums.SafetyCheckKind;
    outcome: $Enums.SafetyCheckOutcome;
    detail?: string | null;
    overridable?: boolean;
    overriddenBy?: string | null;
    overrideReason?: string | null;
    checkedAt?: Date | string;
    dispensing: Prisma.DispensingCreateNestedOneWithoutSafetyChecksInput;
};
export type SafetyCheckResultUncheckedCreateInput = {
    id?: string;
    dispensingId: string;
    kind: $Enums.SafetyCheckKind;
    outcome: $Enums.SafetyCheckOutcome;
    detail?: string | null;
    overridable?: boolean;
    overriddenBy?: string | null;
    overrideReason?: string | null;
    checkedAt?: Date | string;
};
export type SafetyCheckResultUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumSafetyCheckKindFieldUpdateOperationsInput | $Enums.SafetyCheckKind;
    outcome?: Prisma.EnumSafetyCheckOutcomeFieldUpdateOperationsInput | $Enums.SafetyCheckOutcome;
    detail?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    overridable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    overriddenBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    overrideReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    checkedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dispensing?: Prisma.DispensingUpdateOneRequiredWithoutSafetyChecksNestedInput;
};
export type SafetyCheckResultUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dispensingId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumSafetyCheckKindFieldUpdateOperationsInput | $Enums.SafetyCheckKind;
    outcome?: Prisma.EnumSafetyCheckOutcomeFieldUpdateOperationsInput | $Enums.SafetyCheckOutcome;
    detail?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    overridable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    overriddenBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    overrideReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    checkedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SafetyCheckResultCreateManyInput = {
    id?: string;
    dispensingId: string;
    kind: $Enums.SafetyCheckKind;
    outcome: $Enums.SafetyCheckOutcome;
    detail?: string | null;
    overridable?: boolean;
    overriddenBy?: string | null;
    overrideReason?: string | null;
    checkedAt?: Date | string;
};
export type SafetyCheckResultUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumSafetyCheckKindFieldUpdateOperationsInput | $Enums.SafetyCheckKind;
    outcome?: Prisma.EnumSafetyCheckOutcomeFieldUpdateOperationsInput | $Enums.SafetyCheckOutcome;
    detail?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    overridable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    overriddenBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    overrideReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    checkedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SafetyCheckResultUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dispensingId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumSafetyCheckKindFieldUpdateOperationsInput | $Enums.SafetyCheckKind;
    outcome?: Prisma.EnumSafetyCheckOutcomeFieldUpdateOperationsInput | $Enums.SafetyCheckOutcome;
    detail?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    overridable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    overriddenBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    overrideReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    checkedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SafetyCheckResultListRelationFilter = {
    every?: Prisma.SafetyCheckResultWhereInput;
    some?: Prisma.SafetyCheckResultWhereInput;
    none?: Prisma.SafetyCheckResultWhereInput;
};
export type SafetyCheckResultOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SafetyCheckResultCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    dispensingId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    outcome?: Prisma.SortOrder;
    detail?: Prisma.SortOrder;
    overridable?: Prisma.SortOrder;
    overriddenBy?: Prisma.SortOrder;
    overrideReason?: Prisma.SortOrder;
    checkedAt?: Prisma.SortOrder;
};
export type SafetyCheckResultMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    dispensingId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    outcome?: Prisma.SortOrder;
    detail?: Prisma.SortOrder;
    overridable?: Prisma.SortOrder;
    overriddenBy?: Prisma.SortOrder;
    overrideReason?: Prisma.SortOrder;
    checkedAt?: Prisma.SortOrder;
};
export type SafetyCheckResultMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    dispensingId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    outcome?: Prisma.SortOrder;
    detail?: Prisma.SortOrder;
    overridable?: Prisma.SortOrder;
    overriddenBy?: Prisma.SortOrder;
    overrideReason?: Prisma.SortOrder;
    checkedAt?: Prisma.SortOrder;
};
export type SafetyCheckResultCreateNestedManyWithoutDispensingInput = {
    create?: Prisma.XOR<Prisma.SafetyCheckResultCreateWithoutDispensingInput, Prisma.SafetyCheckResultUncheckedCreateWithoutDispensingInput> | Prisma.SafetyCheckResultCreateWithoutDispensingInput[] | Prisma.SafetyCheckResultUncheckedCreateWithoutDispensingInput[];
    connectOrCreate?: Prisma.SafetyCheckResultCreateOrConnectWithoutDispensingInput | Prisma.SafetyCheckResultCreateOrConnectWithoutDispensingInput[];
    createMany?: Prisma.SafetyCheckResultCreateManyDispensingInputEnvelope;
    connect?: Prisma.SafetyCheckResultWhereUniqueInput | Prisma.SafetyCheckResultWhereUniqueInput[];
};
export type SafetyCheckResultUncheckedCreateNestedManyWithoutDispensingInput = {
    create?: Prisma.XOR<Prisma.SafetyCheckResultCreateWithoutDispensingInput, Prisma.SafetyCheckResultUncheckedCreateWithoutDispensingInput> | Prisma.SafetyCheckResultCreateWithoutDispensingInput[] | Prisma.SafetyCheckResultUncheckedCreateWithoutDispensingInput[];
    connectOrCreate?: Prisma.SafetyCheckResultCreateOrConnectWithoutDispensingInput | Prisma.SafetyCheckResultCreateOrConnectWithoutDispensingInput[];
    createMany?: Prisma.SafetyCheckResultCreateManyDispensingInputEnvelope;
    connect?: Prisma.SafetyCheckResultWhereUniqueInput | Prisma.SafetyCheckResultWhereUniqueInput[];
};
export type SafetyCheckResultUpdateManyWithoutDispensingNestedInput = {
    create?: Prisma.XOR<Prisma.SafetyCheckResultCreateWithoutDispensingInput, Prisma.SafetyCheckResultUncheckedCreateWithoutDispensingInput> | Prisma.SafetyCheckResultCreateWithoutDispensingInput[] | Prisma.SafetyCheckResultUncheckedCreateWithoutDispensingInput[];
    connectOrCreate?: Prisma.SafetyCheckResultCreateOrConnectWithoutDispensingInput | Prisma.SafetyCheckResultCreateOrConnectWithoutDispensingInput[];
    upsert?: Prisma.SafetyCheckResultUpsertWithWhereUniqueWithoutDispensingInput | Prisma.SafetyCheckResultUpsertWithWhereUniqueWithoutDispensingInput[];
    createMany?: Prisma.SafetyCheckResultCreateManyDispensingInputEnvelope;
    set?: Prisma.SafetyCheckResultWhereUniqueInput | Prisma.SafetyCheckResultWhereUniqueInput[];
    disconnect?: Prisma.SafetyCheckResultWhereUniqueInput | Prisma.SafetyCheckResultWhereUniqueInput[];
    delete?: Prisma.SafetyCheckResultWhereUniqueInput | Prisma.SafetyCheckResultWhereUniqueInput[];
    connect?: Prisma.SafetyCheckResultWhereUniqueInput | Prisma.SafetyCheckResultWhereUniqueInput[];
    update?: Prisma.SafetyCheckResultUpdateWithWhereUniqueWithoutDispensingInput | Prisma.SafetyCheckResultUpdateWithWhereUniqueWithoutDispensingInput[];
    updateMany?: Prisma.SafetyCheckResultUpdateManyWithWhereWithoutDispensingInput | Prisma.SafetyCheckResultUpdateManyWithWhereWithoutDispensingInput[];
    deleteMany?: Prisma.SafetyCheckResultScalarWhereInput | Prisma.SafetyCheckResultScalarWhereInput[];
};
export type SafetyCheckResultUncheckedUpdateManyWithoutDispensingNestedInput = {
    create?: Prisma.XOR<Prisma.SafetyCheckResultCreateWithoutDispensingInput, Prisma.SafetyCheckResultUncheckedCreateWithoutDispensingInput> | Prisma.SafetyCheckResultCreateWithoutDispensingInput[] | Prisma.SafetyCheckResultUncheckedCreateWithoutDispensingInput[];
    connectOrCreate?: Prisma.SafetyCheckResultCreateOrConnectWithoutDispensingInput | Prisma.SafetyCheckResultCreateOrConnectWithoutDispensingInput[];
    upsert?: Prisma.SafetyCheckResultUpsertWithWhereUniqueWithoutDispensingInput | Prisma.SafetyCheckResultUpsertWithWhereUniqueWithoutDispensingInput[];
    createMany?: Prisma.SafetyCheckResultCreateManyDispensingInputEnvelope;
    set?: Prisma.SafetyCheckResultWhereUniqueInput | Prisma.SafetyCheckResultWhereUniqueInput[];
    disconnect?: Prisma.SafetyCheckResultWhereUniqueInput | Prisma.SafetyCheckResultWhereUniqueInput[];
    delete?: Prisma.SafetyCheckResultWhereUniqueInput | Prisma.SafetyCheckResultWhereUniqueInput[];
    connect?: Prisma.SafetyCheckResultWhereUniqueInput | Prisma.SafetyCheckResultWhereUniqueInput[];
    update?: Prisma.SafetyCheckResultUpdateWithWhereUniqueWithoutDispensingInput | Prisma.SafetyCheckResultUpdateWithWhereUniqueWithoutDispensingInput[];
    updateMany?: Prisma.SafetyCheckResultUpdateManyWithWhereWithoutDispensingInput | Prisma.SafetyCheckResultUpdateManyWithWhereWithoutDispensingInput[];
    deleteMany?: Prisma.SafetyCheckResultScalarWhereInput | Prisma.SafetyCheckResultScalarWhereInput[];
};
export type EnumSafetyCheckKindFieldUpdateOperationsInput = {
    set?: $Enums.SafetyCheckKind;
};
export type EnumSafetyCheckOutcomeFieldUpdateOperationsInput = {
    set?: $Enums.SafetyCheckOutcome;
};
export type SafetyCheckResultCreateWithoutDispensingInput = {
    id?: string;
    kind: $Enums.SafetyCheckKind;
    outcome: $Enums.SafetyCheckOutcome;
    detail?: string | null;
    overridable?: boolean;
    overriddenBy?: string | null;
    overrideReason?: string | null;
    checkedAt?: Date | string;
};
export type SafetyCheckResultUncheckedCreateWithoutDispensingInput = {
    id?: string;
    kind: $Enums.SafetyCheckKind;
    outcome: $Enums.SafetyCheckOutcome;
    detail?: string | null;
    overridable?: boolean;
    overriddenBy?: string | null;
    overrideReason?: string | null;
    checkedAt?: Date | string;
};
export type SafetyCheckResultCreateOrConnectWithoutDispensingInput = {
    where: Prisma.SafetyCheckResultWhereUniqueInput;
    create: Prisma.XOR<Prisma.SafetyCheckResultCreateWithoutDispensingInput, Prisma.SafetyCheckResultUncheckedCreateWithoutDispensingInput>;
};
export type SafetyCheckResultCreateManyDispensingInputEnvelope = {
    data: Prisma.SafetyCheckResultCreateManyDispensingInput | Prisma.SafetyCheckResultCreateManyDispensingInput[];
    skipDuplicates?: boolean;
};
export type SafetyCheckResultUpsertWithWhereUniqueWithoutDispensingInput = {
    where: Prisma.SafetyCheckResultWhereUniqueInput;
    update: Prisma.XOR<Prisma.SafetyCheckResultUpdateWithoutDispensingInput, Prisma.SafetyCheckResultUncheckedUpdateWithoutDispensingInput>;
    create: Prisma.XOR<Prisma.SafetyCheckResultCreateWithoutDispensingInput, Prisma.SafetyCheckResultUncheckedCreateWithoutDispensingInput>;
};
export type SafetyCheckResultUpdateWithWhereUniqueWithoutDispensingInput = {
    where: Prisma.SafetyCheckResultWhereUniqueInput;
    data: Prisma.XOR<Prisma.SafetyCheckResultUpdateWithoutDispensingInput, Prisma.SafetyCheckResultUncheckedUpdateWithoutDispensingInput>;
};
export type SafetyCheckResultUpdateManyWithWhereWithoutDispensingInput = {
    where: Prisma.SafetyCheckResultScalarWhereInput;
    data: Prisma.XOR<Prisma.SafetyCheckResultUpdateManyMutationInput, Prisma.SafetyCheckResultUncheckedUpdateManyWithoutDispensingInput>;
};
export type SafetyCheckResultScalarWhereInput = {
    AND?: Prisma.SafetyCheckResultScalarWhereInput | Prisma.SafetyCheckResultScalarWhereInput[];
    OR?: Prisma.SafetyCheckResultScalarWhereInput[];
    NOT?: Prisma.SafetyCheckResultScalarWhereInput | Prisma.SafetyCheckResultScalarWhereInput[];
    id?: Prisma.StringFilter<"SafetyCheckResult"> | string;
    dispensingId?: Prisma.StringFilter<"SafetyCheckResult"> | string;
    kind?: Prisma.EnumSafetyCheckKindFilter<"SafetyCheckResult"> | $Enums.SafetyCheckKind;
    outcome?: Prisma.EnumSafetyCheckOutcomeFilter<"SafetyCheckResult"> | $Enums.SafetyCheckOutcome;
    detail?: Prisma.StringNullableFilter<"SafetyCheckResult"> | string | null;
    overridable?: Prisma.BoolFilter<"SafetyCheckResult"> | boolean;
    overriddenBy?: Prisma.StringNullableFilter<"SafetyCheckResult"> | string | null;
    overrideReason?: Prisma.StringNullableFilter<"SafetyCheckResult"> | string | null;
    checkedAt?: Prisma.DateTimeFilter<"SafetyCheckResult"> | Date | string;
};
export type SafetyCheckResultCreateManyDispensingInput = {
    id?: string;
    kind: $Enums.SafetyCheckKind;
    outcome: $Enums.SafetyCheckOutcome;
    detail?: string | null;
    overridable?: boolean;
    overriddenBy?: string | null;
    overrideReason?: string | null;
    checkedAt?: Date | string;
};
export type SafetyCheckResultUpdateWithoutDispensingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumSafetyCheckKindFieldUpdateOperationsInput | $Enums.SafetyCheckKind;
    outcome?: Prisma.EnumSafetyCheckOutcomeFieldUpdateOperationsInput | $Enums.SafetyCheckOutcome;
    detail?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    overridable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    overriddenBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    overrideReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    checkedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SafetyCheckResultUncheckedUpdateWithoutDispensingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumSafetyCheckKindFieldUpdateOperationsInput | $Enums.SafetyCheckKind;
    outcome?: Prisma.EnumSafetyCheckOutcomeFieldUpdateOperationsInput | $Enums.SafetyCheckOutcome;
    detail?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    overridable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    overriddenBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    overrideReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    checkedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SafetyCheckResultUncheckedUpdateManyWithoutDispensingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumSafetyCheckKindFieldUpdateOperationsInput | $Enums.SafetyCheckKind;
    outcome?: Prisma.EnumSafetyCheckOutcomeFieldUpdateOperationsInput | $Enums.SafetyCheckOutcome;
    detail?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    overridable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    overriddenBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    overrideReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    checkedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SafetyCheckResultSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    dispensingId?: boolean;
    kind?: boolean;
    outcome?: boolean;
    detail?: boolean;
    overridable?: boolean;
    overriddenBy?: boolean;
    overrideReason?: boolean;
    checkedAt?: boolean;
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["safetyCheckResult"]>;
export type SafetyCheckResultSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    dispensingId?: boolean;
    kind?: boolean;
    outcome?: boolean;
    detail?: boolean;
    overridable?: boolean;
    overriddenBy?: boolean;
    overrideReason?: boolean;
    checkedAt?: boolean;
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["safetyCheckResult"]>;
export type SafetyCheckResultSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    dispensingId?: boolean;
    kind?: boolean;
    outcome?: boolean;
    detail?: boolean;
    overridable?: boolean;
    overriddenBy?: boolean;
    overrideReason?: boolean;
    checkedAt?: boolean;
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["safetyCheckResult"]>;
export type SafetyCheckResultSelectScalar = {
    id?: boolean;
    dispensingId?: boolean;
    kind?: boolean;
    outcome?: boolean;
    detail?: boolean;
    overridable?: boolean;
    overriddenBy?: boolean;
    overrideReason?: boolean;
    checkedAt?: boolean;
};
export type SafetyCheckResultOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "dispensingId" | "kind" | "outcome" | "detail" | "overridable" | "overriddenBy" | "overrideReason" | "checkedAt", ExtArgs["result"]["safetyCheckResult"]>;
export type SafetyCheckResultInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
};
export type SafetyCheckResultIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
};
export type SafetyCheckResultIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
};
export type $SafetyCheckResultPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SafetyCheckResult";
    objects: {
        dispensing: Prisma.$DispensingPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        dispensingId: string;
        kind: $Enums.SafetyCheckKind;
        outcome: $Enums.SafetyCheckOutcome;
        detail: string | null;
        overridable: boolean;
        overriddenBy: string | null;
        overrideReason: string | null;
        checkedAt: Date;
    }, ExtArgs["result"]["safetyCheckResult"]>;
    composites: {};
};
export type SafetyCheckResultGetPayload<S extends boolean | null | undefined | SafetyCheckResultDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SafetyCheckResultPayload, S>;
export type SafetyCheckResultCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SafetyCheckResultFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SafetyCheckResultCountAggregateInputType | true;
};
export interface SafetyCheckResultDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SafetyCheckResult'];
        meta: {
            name: 'SafetyCheckResult';
        };
    };
    findUnique<T extends SafetyCheckResultFindUniqueArgs>(args: Prisma.SelectSubset<T, SafetyCheckResultFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SafetyCheckResultClient<runtime.Types.Result.GetResult<Prisma.$SafetyCheckResultPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SafetyCheckResultFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SafetyCheckResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SafetyCheckResultClient<runtime.Types.Result.GetResult<Prisma.$SafetyCheckResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SafetyCheckResultFindFirstArgs>(args?: Prisma.SelectSubset<T, SafetyCheckResultFindFirstArgs<ExtArgs>>): Prisma.Prisma__SafetyCheckResultClient<runtime.Types.Result.GetResult<Prisma.$SafetyCheckResultPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SafetyCheckResultFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SafetyCheckResultFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SafetyCheckResultClient<runtime.Types.Result.GetResult<Prisma.$SafetyCheckResultPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SafetyCheckResultFindManyArgs>(args?: Prisma.SelectSubset<T, SafetyCheckResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SafetyCheckResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SafetyCheckResultCreateArgs>(args: Prisma.SelectSubset<T, SafetyCheckResultCreateArgs<ExtArgs>>): Prisma.Prisma__SafetyCheckResultClient<runtime.Types.Result.GetResult<Prisma.$SafetyCheckResultPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SafetyCheckResultCreateManyArgs>(args?: Prisma.SelectSubset<T, SafetyCheckResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SafetyCheckResultCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SafetyCheckResultCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SafetyCheckResultPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SafetyCheckResultDeleteArgs>(args: Prisma.SelectSubset<T, SafetyCheckResultDeleteArgs<ExtArgs>>): Prisma.Prisma__SafetyCheckResultClient<runtime.Types.Result.GetResult<Prisma.$SafetyCheckResultPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SafetyCheckResultUpdateArgs>(args: Prisma.SelectSubset<T, SafetyCheckResultUpdateArgs<ExtArgs>>): Prisma.Prisma__SafetyCheckResultClient<runtime.Types.Result.GetResult<Prisma.$SafetyCheckResultPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SafetyCheckResultDeleteManyArgs>(args?: Prisma.SelectSubset<T, SafetyCheckResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SafetyCheckResultUpdateManyArgs>(args: Prisma.SelectSubset<T, SafetyCheckResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SafetyCheckResultUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SafetyCheckResultUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SafetyCheckResultPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SafetyCheckResultUpsertArgs>(args: Prisma.SelectSubset<T, SafetyCheckResultUpsertArgs<ExtArgs>>): Prisma.Prisma__SafetyCheckResultClient<runtime.Types.Result.GetResult<Prisma.$SafetyCheckResultPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SafetyCheckResultCountArgs>(args?: Prisma.Subset<T, SafetyCheckResultCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SafetyCheckResultCountAggregateOutputType> : number>;
    aggregate<T extends SafetyCheckResultAggregateArgs>(args: Prisma.Subset<T, SafetyCheckResultAggregateArgs>): Prisma.PrismaPromise<GetSafetyCheckResultAggregateType<T>>;
    groupBy<T extends SafetyCheckResultGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SafetyCheckResultGroupByArgs['orderBy'];
    } : {
        orderBy?: SafetyCheckResultGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SafetyCheckResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSafetyCheckResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SafetyCheckResultFieldRefs;
}
export interface Prisma__SafetyCheckResultClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    dispensing<T extends Prisma.DispensingDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DispensingDefaultArgs<ExtArgs>>): Prisma.Prisma__DispensingClient<runtime.Types.Result.GetResult<Prisma.$DispensingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SafetyCheckResultFieldRefs {
    readonly id: Prisma.FieldRef<"SafetyCheckResult", 'String'>;
    readonly dispensingId: Prisma.FieldRef<"SafetyCheckResult", 'String'>;
    readonly kind: Prisma.FieldRef<"SafetyCheckResult", 'SafetyCheckKind'>;
    readonly outcome: Prisma.FieldRef<"SafetyCheckResult", 'SafetyCheckOutcome'>;
    readonly detail: Prisma.FieldRef<"SafetyCheckResult", 'String'>;
    readonly overridable: Prisma.FieldRef<"SafetyCheckResult", 'Boolean'>;
    readonly overriddenBy: Prisma.FieldRef<"SafetyCheckResult", 'String'>;
    readonly overrideReason: Prisma.FieldRef<"SafetyCheckResult", 'String'>;
    readonly checkedAt: Prisma.FieldRef<"SafetyCheckResult", 'DateTime'>;
}
export type SafetyCheckResultFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SafetyCheckResultSelect<ExtArgs> | null;
    omit?: Prisma.SafetyCheckResultOmit<ExtArgs> | null;
    include?: Prisma.SafetyCheckResultInclude<ExtArgs> | null;
    where: Prisma.SafetyCheckResultWhereUniqueInput;
};
export type SafetyCheckResultFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SafetyCheckResultSelect<ExtArgs> | null;
    omit?: Prisma.SafetyCheckResultOmit<ExtArgs> | null;
    include?: Prisma.SafetyCheckResultInclude<ExtArgs> | null;
    where: Prisma.SafetyCheckResultWhereUniqueInput;
};
export type SafetyCheckResultFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SafetyCheckResultSelect<ExtArgs> | null;
    omit?: Prisma.SafetyCheckResultOmit<ExtArgs> | null;
    include?: Prisma.SafetyCheckResultInclude<ExtArgs> | null;
    where?: Prisma.SafetyCheckResultWhereInput;
    orderBy?: Prisma.SafetyCheckResultOrderByWithRelationInput | Prisma.SafetyCheckResultOrderByWithRelationInput[];
    cursor?: Prisma.SafetyCheckResultWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SafetyCheckResultScalarFieldEnum | Prisma.SafetyCheckResultScalarFieldEnum[];
};
export type SafetyCheckResultFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SafetyCheckResultSelect<ExtArgs> | null;
    omit?: Prisma.SafetyCheckResultOmit<ExtArgs> | null;
    include?: Prisma.SafetyCheckResultInclude<ExtArgs> | null;
    where?: Prisma.SafetyCheckResultWhereInput;
    orderBy?: Prisma.SafetyCheckResultOrderByWithRelationInput | Prisma.SafetyCheckResultOrderByWithRelationInput[];
    cursor?: Prisma.SafetyCheckResultWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SafetyCheckResultScalarFieldEnum | Prisma.SafetyCheckResultScalarFieldEnum[];
};
export type SafetyCheckResultFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SafetyCheckResultSelect<ExtArgs> | null;
    omit?: Prisma.SafetyCheckResultOmit<ExtArgs> | null;
    include?: Prisma.SafetyCheckResultInclude<ExtArgs> | null;
    where?: Prisma.SafetyCheckResultWhereInput;
    orderBy?: Prisma.SafetyCheckResultOrderByWithRelationInput | Prisma.SafetyCheckResultOrderByWithRelationInput[];
    cursor?: Prisma.SafetyCheckResultWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SafetyCheckResultScalarFieldEnum | Prisma.SafetyCheckResultScalarFieldEnum[];
};
export type SafetyCheckResultCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SafetyCheckResultSelect<ExtArgs> | null;
    omit?: Prisma.SafetyCheckResultOmit<ExtArgs> | null;
    include?: Prisma.SafetyCheckResultInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SafetyCheckResultCreateInput, Prisma.SafetyCheckResultUncheckedCreateInput>;
};
export type SafetyCheckResultCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SafetyCheckResultCreateManyInput | Prisma.SafetyCheckResultCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SafetyCheckResultCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SafetyCheckResultSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SafetyCheckResultOmit<ExtArgs> | null;
    data: Prisma.SafetyCheckResultCreateManyInput | Prisma.SafetyCheckResultCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SafetyCheckResultIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SafetyCheckResultUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SafetyCheckResultSelect<ExtArgs> | null;
    omit?: Prisma.SafetyCheckResultOmit<ExtArgs> | null;
    include?: Prisma.SafetyCheckResultInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SafetyCheckResultUpdateInput, Prisma.SafetyCheckResultUncheckedUpdateInput>;
    where: Prisma.SafetyCheckResultWhereUniqueInput;
};
export type SafetyCheckResultUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SafetyCheckResultUpdateManyMutationInput, Prisma.SafetyCheckResultUncheckedUpdateManyInput>;
    where?: Prisma.SafetyCheckResultWhereInput;
    limit?: number;
};
export type SafetyCheckResultUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SafetyCheckResultSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SafetyCheckResultOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SafetyCheckResultUpdateManyMutationInput, Prisma.SafetyCheckResultUncheckedUpdateManyInput>;
    where?: Prisma.SafetyCheckResultWhereInput;
    limit?: number;
    include?: Prisma.SafetyCheckResultIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SafetyCheckResultUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SafetyCheckResultSelect<ExtArgs> | null;
    omit?: Prisma.SafetyCheckResultOmit<ExtArgs> | null;
    include?: Prisma.SafetyCheckResultInclude<ExtArgs> | null;
    where: Prisma.SafetyCheckResultWhereUniqueInput;
    create: Prisma.XOR<Prisma.SafetyCheckResultCreateInput, Prisma.SafetyCheckResultUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SafetyCheckResultUpdateInput, Prisma.SafetyCheckResultUncheckedUpdateInput>;
};
export type SafetyCheckResultDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SafetyCheckResultSelect<ExtArgs> | null;
    omit?: Prisma.SafetyCheckResultOmit<ExtArgs> | null;
    include?: Prisma.SafetyCheckResultInclude<ExtArgs> | null;
    where: Prisma.SafetyCheckResultWhereUniqueInput;
};
export type SafetyCheckResultDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SafetyCheckResultWhereInput;
    limit?: number;
};
export type SafetyCheckResultDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SafetyCheckResultSelect<ExtArgs> | null;
    omit?: Prisma.SafetyCheckResultOmit<ExtArgs> | null;
    include?: Prisma.SafetyCheckResultInclude<ExtArgs> | null;
};
