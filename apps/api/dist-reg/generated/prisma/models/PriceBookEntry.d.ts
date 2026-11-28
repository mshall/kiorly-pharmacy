import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type PriceBookEntryModel = runtime.Types.Result.DefaultSelection<Prisma.$PriceBookEntryPayload>;
export type AggregatePriceBookEntry = {
    _count: PriceBookEntryCountAggregateOutputType | null;
    _avg: PriceBookEntryAvgAggregateOutputType | null;
    _sum: PriceBookEntrySumAggregateOutputType | null;
    _min: PriceBookEntryMinAggregateOutputType | null;
    _max: PriceBookEntryMaxAggregateOutputType | null;
};
export type PriceBookEntryAvgAggregateOutputType = {
    price: runtime.Decimal | null;
};
export type PriceBookEntrySumAggregateOutputType = {
    price: runtime.Decimal | null;
};
export type PriceBookEntryMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    drugId: string | null;
    branchId: string | null;
    price: runtime.Decimal | null;
    effectiveFrom: Date | null;
    effectiveTo: Date | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type PriceBookEntryMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    drugId: string | null;
    branchId: string | null;
    price: runtime.Decimal | null;
    effectiveFrom: Date | null;
    effectiveTo: Date | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type PriceBookEntryCountAggregateOutputType = {
    id: number;
    orgId: number;
    drugId: number;
    branchId: number;
    price: number;
    effectiveFrom: number;
    effectiveTo: number;
    createdBy: number;
    createdAt: number;
    _all: number;
};
export type PriceBookEntryAvgAggregateInputType = {
    price?: true;
};
export type PriceBookEntrySumAggregateInputType = {
    price?: true;
};
export type PriceBookEntryMinAggregateInputType = {
    id?: true;
    orgId?: true;
    drugId?: true;
    branchId?: true;
    price?: true;
    effectiveFrom?: true;
    effectiveTo?: true;
    createdBy?: true;
    createdAt?: true;
};
export type PriceBookEntryMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    drugId?: true;
    branchId?: true;
    price?: true;
    effectiveFrom?: true;
    effectiveTo?: true;
    createdBy?: true;
    createdAt?: true;
};
export type PriceBookEntryCountAggregateInputType = {
    id?: true;
    orgId?: true;
    drugId?: true;
    branchId?: true;
    price?: true;
    effectiveFrom?: true;
    effectiveTo?: true;
    createdBy?: true;
    createdAt?: true;
    _all?: true;
};
export type PriceBookEntryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PriceBookEntryWhereInput;
    orderBy?: Prisma.PriceBookEntryOrderByWithRelationInput | Prisma.PriceBookEntryOrderByWithRelationInput[];
    cursor?: Prisma.PriceBookEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PriceBookEntryCountAggregateInputType;
    _avg?: PriceBookEntryAvgAggregateInputType;
    _sum?: PriceBookEntrySumAggregateInputType;
    _min?: PriceBookEntryMinAggregateInputType;
    _max?: PriceBookEntryMaxAggregateInputType;
};
export type GetPriceBookEntryAggregateType<T extends PriceBookEntryAggregateArgs> = {
    [P in keyof T & keyof AggregatePriceBookEntry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePriceBookEntry[P]> : Prisma.GetScalarType<T[P], AggregatePriceBookEntry[P]>;
};
export type PriceBookEntryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PriceBookEntryWhereInput;
    orderBy?: Prisma.PriceBookEntryOrderByWithAggregationInput | Prisma.PriceBookEntryOrderByWithAggregationInput[];
    by: Prisma.PriceBookEntryScalarFieldEnum[] | Prisma.PriceBookEntryScalarFieldEnum;
    having?: Prisma.PriceBookEntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PriceBookEntryCountAggregateInputType | true;
    _avg?: PriceBookEntryAvgAggregateInputType;
    _sum?: PriceBookEntrySumAggregateInputType;
    _min?: PriceBookEntryMinAggregateInputType;
    _max?: PriceBookEntryMaxAggregateInputType;
};
export type PriceBookEntryGroupByOutputType = {
    id: string;
    orgId: string;
    drugId: string;
    branchId: string | null;
    price: runtime.Decimal;
    effectiveFrom: Date;
    effectiveTo: Date | null;
    createdBy: string | null;
    createdAt: Date;
    _count: PriceBookEntryCountAggregateOutputType | null;
    _avg: PriceBookEntryAvgAggregateOutputType | null;
    _sum: PriceBookEntrySumAggregateOutputType | null;
    _min: PriceBookEntryMinAggregateOutputType | null;
    _max: PriceBookEntryMaxAggregateOutputType | null;
};
export type GetPriceBookEntryGroupByPayload<T extends PriceBookEntryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PriceBookEntryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PriceBookEntryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PriceBookEntryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PriceBookEntryGroupByOutputType[P]>;
}>>;
export type PriceBookEntryWhereInput = {
    AND?: Prisma.PriceBookEntryWhereInput | Prisma.PriceBookEntryWhereInput[];
    OR?: Prisma.PriceBookEntryWhereInput[];
    NOT?: Prisma.PriceBookEntryWhereInput | Prisma.PriceBookEntryWhereInput[];
    id?: Prisma.StringFilter<"PriceBookEntry"> | string;
    orgId?: Prisma.StringFilter<"PriceBookEntry"> | string;
    drugId?: Prisma.StringFilter<"PriceBookEntry"> | string;
    branchId?: Prisma.StringNullableFilter<"PriceBookEntry"> | string | null;
    price?: Prisma.DecimalFilter<"PriceBookEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom?: Prisma.DateTimeFilter<"PriceBookEntry"> | Date | string;
    effectiveTo?: Prisma.DateTimeNullableFilter<"PriceBookEntry"> | Date | string | null;
    createdBy?: Prisma.StringNullableFilter<"PriceBookEntry"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PriceBookEntry"> | Date | string;
    drug?: Prisma.XOR<Prisma.DrugScalarRelationFilter, Prisma.DrugWhereInput>;
};
export type PriceBookEntryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    price?: Prisma.SortOrder;
    effectiveFrom?: Prisma.SortOrder;
    effectiveTo?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    drug?: Prisma.DrugOrderByWithRelationInput;
};
export type PriceBookEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PriceBookEntryWhereInput | Prisma.PriceBookEntryWhereInput[];
    OR?: Prisma.PriceBookEntryWhereInput[];
    NOT?: Prisma.PriceBookEntryWhereInput | Prisma.PriceBookEntryWhereInput[];
    orgId?: Prisma.StringFilter<"PriceBookEntry"> | string;
    drugId?: Prisma.StringFilter<"PriceBookEntry"> | string;
    branchId?: Prisma.StringNullableFilter<"PriceBookEntry"> | string | null;
    price?: Prisma.DecimalFilter<"PriceBookEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom?: Prisma.DateTimeFilter<"PriceBookEntry"> | Date | string;
    effectiveTo?: Prisma.DateTimeNullableFilter<"PriceBookEntry"> | Date | string | null;
    createdBy?: Prisma.StringNullableFilter<"PriceBookEntry"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PriceBookEntry"> | Date | string;
    drug?: Prisma.XOR<Prisma.DrugScalarRelationFilter, Prisma.DrugWhereInput>;
}, "id">;
export type PriceBookEntryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    price?: Prisma.SortOrder;
    effectiveFrom?: Prisma.SortOrder;
    effectiveTo?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.PriceBookEntryCountOrderByAggregateInput;
    _avg?: Prisma.PriceBookEntryAvgOrderByAggregateInput;
    _max?: Prisma.PriceBookEntryMaxOrderByAggregateInput;
    _min?: Prisma.PriceBookEntryMinOrderByAggregateInput;
    _sum?: Prisma.PriceBookEntrySumOrderByAggregateInput;
};
export type PriceBookEntryScalarWhereWithAggregatesInput = {
    AND?: Prisma.PriceBookEntryScalarWhereWithAggregatesInput | Prisma.PriceBookEntryScalarWhereWithAggregatesInput[];
    OR?: Prisma.PriceBookEntryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PriceBookEntryScalarWhereWithAggregatesInput | Prisma.PriceBookEntryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PriceBookEntry"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"PriceBookEntry"> | string;
    drugId?: Prisma.StringWithAggregatesFilter<"PriceBookEntry"> | string;
    branchId?: Prisma.StringNullableWithAggregatesFilter<"PriceBookEntry"> | string | null;
    price?: Prisma.DecimalWithAggregatesFilter<"PriceBookEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom?: Prisma.DateTimeWithAggregatesFilter<"PriceBookEntry"> | Date | string;
    effectiveTo?: Prisma.DateTimeNullableWithAggregatesFilter<"PriceBookEntry"> | Date | string | null;
    createdBy?: Prisma.StringNullableWithAggregatesFilter<"PriceBookEntry"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PriceBookEntry"> | Date | string;
};
export type PriceBookEntryCreateInput = {
    id?: string;
    orgId: string;
    branchId?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom: Date | string;
    effectiveTo?: Date | string | null;
    createdBy?: string | null;
    createdAt?: Date | string;
    drug: Prisma.DrugCreateNestedOneWithoutPricesInput;
};
export type PriceBookEntryUncheckedCreateInput = {
    id?: string;
    orgId: string;
    drugId: string;
    branchId?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom: Date | string;
    effectiveTo?: Date | string | null;
    createdBy?: string | null;
    createdAt?: Date | string;
};
export type PriceBookEntryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    effectiveTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    drug?: Prisma.DrugUpdateOneRequiredWithoutPricesNestedInput;
};
export type PriceBookEntryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    effectiveTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PriceBookEntryCreateManyInput = {
    id?: string;
    orgId: string;
    drugId: string;
    branchId?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom: Date | string;
    effectiveTo?: Date | string | null;
    createdBy?: string | null;
    createdAt?: Date | string;
};
export type PriceBookEntryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    effectiveTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PriceBookEntryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    effectiveTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PriceBookEntryListRelationFilter = {
    every?: Prisma.PriceBookEntryWhereInput;
    some?: Prisma.PriceBookEntryWhereInput;
    none?: Prisma.PriceBookEntryWhereInput;
};
export type PriceBookEntryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PriceBookEntryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    effectiveFrom?: Prisma.SortOrder;
    effectiveTo?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PriceBookEntryAvgOrderByAggregateInput = {
    price?: Prisma.SortOrder;
};
export type PriceBookEntryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    effectiveFrom?: Prisma.SortOrder;
    effectiveTo?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PriceBookEntryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    effectiveFrom?: Prisma.SortOrder;
    effectiveTo?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PriceBookEntrySumOrderByAggregateInput = {
    price?: Prisma.SortOrder;
};
export type PriceBookEntryCreateNestedManyWithoutDrugInput = {
    create?: Prisma.XOR<Prisma.PriceBookEntryCreateWithoutDrugInput, Prisma.PriceBookEntryUncheckedCreateWithoutDrugInput> | Prisma.PriceBookEntryCreateWithoutDrugInput[] | Prisma.PriceBookEntryUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.PriceBookEntryCreateOrConnectWithoutDrugInput | Prisma.PriceBookEntryCreateOrConnectWithoutDrugInput[];
    createMany?: Prisma.PriceBookEntryCreateManyDrugInputEnvelope;
    connect?: Prisma.PriceBookEntryWhereUniqueInput | Prisma.PriceBookEntryWhereUniqueInput[];
};
export type PriceBookEntryUncheckedCreateNestedManyWithoutDrugInput = {
    create?: Prisma.XOR<Prisma.PriceBookEntryCreateWithoutDrugInput, Prisma.PriceBookEntryUncheckedCreateWithoutDrugInput> | Prisma.PriceBookEntryCreateWithoutDrugInput[] | Prisma.PriceBookEntryUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.PriceBookEntryCreateOrConnectWithoutDrugInput | Prisma.PriceBookEntryCreateOrConnectWithoutDrugInput[];
    createMany?: Prisma.PriceBookEntryCreateManyDrugInputEnvelope;
    connect?: Prisma.PriceBookEntryWhereUniqueInput | Prisma.PriceBookEntryWhereUniqueInput[];
};
export type PriceBookEntryUpdateManyWithoutDrugNestedInput = {
    create?: Prisma.XOR<Prisma.PriceBookEntryCreateWithoutDrugInput, Prisma.PriceBookEntryUncheckedCreateWithoutDrugInput> | Prisma.PriceBookEntryCreateWithoutDrugInput[] | Prisma.PriceBookEntryUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.PriceBookEntryCreateOrConnectWithoutDrugInput | Prisma.PriceBookEntryCreateOrConnectWithoutDrugInput[];
    upsert?: Prisma.PriceBookEntryUpsertWithWhereUniqueWithoutDrugInput | Prisma.PriceBookEntryUpsertWithWhereUniqueWithoutDrugInput[];
    createMany?: Prisma.PriceBookEntryCreateManyDrugInputEnvelope;
    set?: Prisma.PriceBookEntryWhereUniqueInput | Prisma.PriceBookEntryWhereUniqueInput[];
    disconnect?: Prisma.PriceBookEntryWhereUniqueInput | Prisma.PriceBookEntryWhereUniqueInput[];
    delete?: Prisma.PriceBookEntryWhereUniqueInput | Prisma.PriceBookEntryWhereUniqueInput[];
    connect?: Prisma.PriceBookEntryWhereUniqueInput | Prisma.PriceBookEntryWhereUniqueInput[];
    update?: Prisma.PriceBookEntryUpdateWithWhereUniqueWithoutDrugInput | Prisma.PriceBookEntryUpdateWithWhereUniqueWithoutDrugInput[];
    updateMany?: Prisma.PriceBookEntryUpdateManyWithWhereWithoutDrugInput | Prisma.PriceBookEntryUpdateManyWithWhereWithoutDrugInput[];
    deleteMany?: Prisma.PriceBookEntryScalarWhereInput | Prisma.PriceBookEntryScalarWhereInput[];
};
export type PriceBookEntryUncheckedUpdateManyWithoutDrugNestedInput = {
    create?: Prisma.XOR<Prisma.PriceBookEntryCreateWithoutDrugInput, Prisma.PriceBookEntryUncheckedCreateWithoutDrugInput> | Prisma.PriceBookEntryCreateWithoutDrugInput[] | Prisma.PriceBookEntryUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.PriceBookEntryCreateOrConnectWithoutDrugInput | Prisma.PriceBookEntryCreateOrConnectWithoutDrugInput[];
    upsert?: Prisma.PriceBookEntryUpsertWithWhereUniqueWithoutDrugInput | Prisma.PriceBookEntryUpsertWithWhereUniqueWithoutDrugInput[];
    createMany?: Prisma.PriceBookEntryCreateManyDrugInputEnvelope;
    set?: Prisma.PriceBookEntryWhereUniqueInput | Prisma.PriceBookEntryWhereUniqueInput[];
    disconnect?: Prisma.PriceBookEntryWhereUniqueInput | Prisma.PriceBookEntryWhereUniqueInput[];
    delete?: Prisma.PriceBookEntryWhereUniqueInput | Prisma.PriceBookEntryWhereUniqueInput[];
    connect?: Prisma.PriceBookEntryWhereUniqueInput | Prisma.PriceBookEntryWhereUniqueInput[];
    update?: Prisma.PriceBookEntryUpdateWithWhereUniqueWithoutDrugInput | Prisma.PriceBookEntryUpdateWithWhereUniqueWithoutDrugInput[];
    updateMany?: Prisma.PriceBookEntryUpdateManyWithWhereWithoutDrugInput | Prisma.PriceBookEntryUpdateManyWithWhereWithoutDrugInput[];
    deleteMany?: Prisma.PriceBookEntryScalarWhereInput | Prisma.PriceBookEntryScalarWhereInput[];
};
export type DecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type PriceBookEntryCreateWithoutDrugInput = {
    id?: string;
    orgId: string;
    branchId?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom: Date | string;
    effectiveTo?: Date | string | null;
    createdBy?: string | null;
    createdAt?: Date | string;
};
export type PriceBookEntryUncheckedCreateWithoutDrugInput = {
    id?: string;
    orgId: string;
    branchId?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom: Date | string;
    effectiveTo?: Date | string | null;
    createdBy?: string | null;
    createdAt?: Date | string;
};
export type PriceBookEntryCreateOrConnectWithoutDrugInput = {
    where: Prisma.PriceBookEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.PriceBookEntryCreateWithoutDrugInput, Prisma.PriceBookEntryUncheckedCreateWithoutDrugInput>;
};
export type PriceBookEntryCreateManyDrugInputEnvelope = {
    data: Prisma.PriceBookEntryCreateManyDrugInput | Prisma.PriceBookEntryCreateManyDrugInput[];
    skipDuplicates?: boolean;
};
export type PriceBookEntryUpsertWithWhereUniqueWithoutDrugInput = {
    where: Prisma.PriceBookEntryWhereUniqueInput;
    update: Prisma.XOR<Prisma.PriceBookEntryUpdateWithoutDrugInput, Prisma.PriceBookEntryUncheckedUpdateWithoutDrugInput>;
    create: Prisma.XOR<Prisma.PriceBookEntryCreateWithoutDrugInput, Prisma.PriceBookEntryUncheckedCreateWithoutDrugInput>;
};
export type PriceBookEntryUpdateWithWhereUniqueWithoutDrugInput = {
    where: Prisma.PriceBookEntryWhereUniqueInput;
    data: Prisma.XOR<Prisma.PriceBookEntryUpdateWithoutDrugInput, Prisma.PriceBookEntryUncheckedUpdateWithoutDrugInput>;
};
export type PriceBookEntryUpdateManyWithWhereWithoutDrugInput = {
    where: Prisma.PriceBookEntryScalarWhereInput;
    data: Prisma.XOR<Prisma.PriceBookEntryUpdateManyMutationInput, Prisma.PriceBookEntryUncheckedUpdateManyWithoutDrugInput>;
};
export type PriceBookEntryScalarWhereInput = {
    AND?: Prisma.PriceBookEntryScalarWhereInput | Prisma.PriceBookEntryScalarWhereInput[];
    OR?: Prisma.PriceBookEntryScalarWhereInput[];
    NOT?: Prisma.PriceBookEntryScalarWhereInput | Prisma.PriceBookEntryScalarWhereInput[];
    id?: Prisma.StringFilter<"PriceBookEntry"> | string;
    orgId?: Prisma.StringFilter<"PriceBookEntry"> | string;
    drugId?: Prisma.StringFilter<"PriceBookEntry"> | string;
    branchId?: Prisma.StringNullableFilter<"PriceBookEntry"> | string | null;
    price?: Prisma.DecimalFilter<"PriceBookEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom?: Prisma.DateTimeFilter<"PriceBookEntry"> | Date | string;
    effectiveTo?: Prisma.DateTimeNullableFilter<"PriceBookEntry"> | Date | string | null;
    createdBy?: Prisma.StringNullableFilter<"PriceBookEntry"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PriceBookEntry"> | Date | string;
};
export type PriceBookEntryCreateManyDrugInput = {
    id?: string;
    orgId: string;
    branchId?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom: Date | string;
    effectiveTo?: Date | string | null;
    createdBy?: string | null;
    createdAt?: Date | string;
};
export type PriceBookEntryUpdateWithoutDrugInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    effectiveTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PriceBookEntryUncheckedUpdateWithoutDrugInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    effectiveTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PriceBookEntryUncheckedUpdateManyWithoutDrugInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    effectiveFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    effectiveTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PriceBookEntrySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    drugId?: boolean;
    branchId?: boolean;
    price?: boolean;
    effectiveFrom?: boolean;
    effectiveTo?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["priceBookEntry"]>;
export type PriceBookEntrySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    drugId?: boolean;
    branchId?: boolean;
    price?: boolean;
    effectiveFrom?: boolean;
    effectiveTo?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["priceBookEntry"]>;
export type PriceBookEntrySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    drugId?: boolean;
    branchId?: boolean;
    price?: boolean;
    effectiveFrom?: boolean;
    effectiveTo?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["priceBookEntry"]>;
export type PriceBookEntrySelectScalar = {
    id?: boolean;
    orgId?: boolean;
    drugId?: boolean;
    branchId?: boolean;
    price?: boolean;
    effectiveFrom?: boolean;
    effectiveTo?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
};
export type PriceBookEntryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "drugId" | "branchId" | "price" | "effectiveFrom" | "effectiveTo" | "createdBy" | "createdAt", ExtArgs["result"]["priceBookEntry"]>;
export type PriceBookEntryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
};
export type PriceBookEntryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
};
export type PriceBookEntryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
};
export type $PriceBookEntryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PriceBookEntry";
    objects: {
        drug: Prisma.$DrugPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        drugId: string;
        branchId: string | null;
        price: runtime.Decimal;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        createdBy: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["priceBookEntry"]>;
    composites: {};
};
export type PriceBookEntryGetPayload<S extends boolean | null | undefined | PriceBookEntryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PriceBookEntryPayload, S>;
export type PriceBookEntryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PriceBookEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PriceBookEntryCountAggregateInputType | true;
};
export interface PriceBookEntryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PriceBookEntry'];
        meta: {
            name: 'PriceBookEntry';
        };
    };
    findUnique<T extends PriceBookEntryFindUniqueArgs>(args: Prisma.SelectSubset<T, PriceBookEntryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PriceBookEntryClient<runtime.Types.Result.GetResult<Prisma.$PriceBookEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PriceBookEntryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PriceBookEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PriceBookEntryClient<runtime.Types.Result.GetResult<Prisma.$PriceBookEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PriceBookEntryFindFirstArgs>(args?: Prisma.SelectSubset<T, PriceBookEntryFindFirstArgs<ExtArgs>>): Prisma.Prisma__PriceBookEntryClient<runtime.Types.Result.GetResult<Prisma.$PriceBookEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PriceBookEntryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PriceBookEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PriceBookEntryClient<runtime.Types.Result.GetResult<Prisma.$PriceBookEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PriceBookEntryFindManyArgs>(args?: Prisma.SelectSubset<T, PriceBookEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PriceBookEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PriceBookEntryCreateArgs>(args: Prisma.SelectSubset<T, PriceBookEntryCreateArgs<ExtArgs>>): Prisma.Prisma__PriceBookEntryClient<runtime.Types.Result.GetResult<Prisma.$PriceBookEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PriceBookEntryCreateManyArgs>(args?: Prisma.SelectSubset<T, PriceBookEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PriceBookEntryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PriceBookEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PriceBookEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PriceBookEntryDeleteArgs>(args: Prisma.SelectSubset<T, PriceBookEntryDeleteArgs<ExtArgs>>): Prisma.Prisma__PriceBookEntryClient<runtime.Types.Result.GetResult<Prisma.$PriceBookEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PriceBookEntryUpdateArgs>(args: Prisma.SelectSubset<T, PriceBookEntryUpdateArgs<ExtArgs>>): Prisma.Prisma__PriceBookEntryClient<runtime.Types.Result.GetResult<Prisma.$PriceBookEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PriceBookEntryDeleteManyArgs>(args?: Prisma.SelectSubset<T, PriceBookEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PriceBookEntryUpdateManyArgs>(args: Prisma.SelectSubset<T, PriceBookEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PriceBookEntryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PriceBookEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PriceBookEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PriceBookEntryUpsertArgs>(args: Prisma.SelectSubset<T, PriceBookEntryUpsertArgs<ExtArgs>>): Prisma.Prisma__PriceBookEntryClient<runtime.Types.Result.GetResult<Prisma.$PriceBookEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PriceBookEntryCountArgs>(args?: Prisma.Subset<T, PriceBookEntryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PriceBookEntryCountAggregateOutputType> : number>;
    aggregate<T extends PriceBookEntryAggregateArgs>(args: Prisma.Subset<T, PriceBookEntryAggregateArgs>): Prisma.PrismaPromise<GetPriceBookEntryAggregateType<T>>;
    groupBy<T extends PriceBookEntryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PriceBookEntryGroupByArgs['orderBy'];
    } : {
        orderBy?: PriceBookEntryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PriceBookEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPriceBookEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PriceBookEntryFieldRefs;
}
export interface Prisma__PriceBookEntryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    drug<T extends Prisma.DrugDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DrugDefaultArgs<ExtArgs>>): Prisma.Prisma__DrugClient<runtime.Types.Result.GetResult<Prisma.$DrugPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PriceBookEntryFieldRefs {
    readonly id: Prisma.FieldRef<"PriceBookEntry", 'String'>;
    readonly orgId: Prisma.FieldRef<"PriceBookEntry", 'String'>;
    readonly drugId: Prisma.FieldRef<"PriceBookEntry", 'String'>;
    readonly branchId: Prisma.FieldRef<"PriceBookEntry", 'String'>;
    readonly price: Prisma.FieldRef<"PriceBookEntry", 'Decimal'>;
    readonly effectiveFrom: Prisma.FieldRef<"PriceBookEntry", 'DateTime'>;
    readonly effectiveTo: Prisma.FieldRef<"PriceBookEntry", 'DateTime'>;
    readonly createdBy: Prisma.FieldRef<"PriceBookEntry", 'String'>;
    readonly createdAt: Prisma.FieldRef<"PriceBookEntry", 'DateTime'>;
}
export type PriceBookEntryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceBookEntrySelect<ExtArgs> | null;
    omit?: Prisma.PriceBookEntryOmit<ExtArgs> | null;
    include?: Prisma.PriceBookEntryInclude<ExtArgs> | null;
    where: Prisma.PriceBookEntryWhereUniqueInput;
};
export type PriceBookEntryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceBookEntrySelect<ExtArgs> | null;
    omit?: Prisma.PriceBookEntryOmit<ExtArgs> | null;
    include?: Prisma.PriceBookEntryInclude<ExtArgs> | null;
    where: Prisma.PriceBookEntryWhereUniqueInput;
};
export type PriceBookEntryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceBookEntrySelect<ExtArgs> | null;
    omit?: Prisma.PriceBookEntryOmit<ExtArgs> | null;
    include?: Prisma.PriceBookEntryInclude<ExtArgs> | null;
    where?: Prisma.PriceBookEntryWhereInput;
    orderBy?: Prisma.PriceBookEntryOrderByWithRelationInput | Prisma.PriceBookEntryOrderByWithRelationInput[];
    cursor?: Prisma.PriceBookEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PriceBookEntryScalarFieldEnum | Prisma.PriceBookEntryScalarFieldEnum[];
};
export type PriceBookEntryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceBookEntrySelect<ExtArgs> | null;
    omit?: Prisma.PriceBookEntryOmit<ExtArgs> | null;
    include?: Prisma.PriceBookEntryInclude<ExtArgs> | null;
    where?: Prisma.PriceBookEntryWhereInput;
    orderBy?: Prisma.PriceBookEntryOrderByWithRelationInput | Prisma.PriceBookEntryOrderByWithRelationInput[];
    cursor?: Prisma.PriceBookEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PriceBookEntryScalarFieldEnum | Prisma.PriceBookEntryScalarFieldEnum[];
};
export type PriceBookEntryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceBookEntrySelect<ExtArgs> | null;
    omit?: Prisma.PriceBookEntryOmit<ExtArgs> | null;
    include?: Prisma.PriceBookEntryInclude<ExtArgs> | null;
    where?: Prisma.PriceBookEntryWhereInput;
    orderBy?: Prisma.PriceBookEntryOrderByWithRelationInput | Prisma.PriceBookEntryOrderByWithRelationInput[];
    cursor?: Prisma.PriceBookEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PriceBookEntryScalarFieldEnum | Prisma.PriceBookEntryScalarFieldEnum[];
};
export type PriceBookEntryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceBookEntrySelect<ExtArgs> | null;
    omit?: Prisma.PriceBookEntryOmit<ExtArgs> | null;
    include?: Prisma.PriceBookEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PriceBookEntryCreateInput, Prisma.PriceBookEntryUncheckedCreateInput>;
};
export type PriceBookEntryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PriceBookEntryCreateManyInput | Prisma.PriceBookEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PriceBookEntryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceBookEntrySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PriceBookEntryOmit<ExtArgs> | null;
    data: Prisma.PriceBookEntryCreateManyInput | Prisma.PriceBookEntryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PriceBookEntryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PriceBookEntryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceBookEntrySelect<ExtArgs> | null;
    omit?: Prisma.PriceBookEntryOmit<ExtArgs> | null;
    include?: Prisma.PriceBookEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PriceBookEntryUpdateInput, Prisma.PriceBookEntryUncheckedUpdateInput>;
    where: Prisma.PriceBookEntryWhereUniqueInput;
};
export type PriceBookEntryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PriceBookEntryUpdateManyMutationInput, Prisma.PriceBookEntryUncheckedUpdateManyInput>;
    where?: Prisma.PriceBookEntryWhereInput;
    limit?: number;
};
export type PriceBookEntryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceBookEntrySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PriceBookEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PriceBookEntryUpdateManyMutationInput, Prisma.PriceBookEntryUncheckedUpdateManyInput>;
    where?: Prisma.PriceBookEntryWhereInput;
    limit?: number;
    include?: Prisma.PriceBookEntryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PriceBookEntryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceBookEntrySelect<ExtArgs> | null;
    omit?: Prisma.PriceBookEntryOmit<ExtArgs> | null;
    include?: Prisma.PriceBookEntryInclude<ExtArgs> | null;
    where: Prisma.PriceBookEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.PriceBookEntryCreateInput, Prisma.PriceBookEntryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PriceBookEntryUpdateInput, Prisma.PriceBookEntryUncheckedUpdateInput>;
};
export type PriceBookEntryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceBookEntrySelect<ExtArgs> | null;
    omit?: Prisma.PriceBookEntryOmit<ExtArgs> | null;
    include?: Prisma.PriceBookEntryInclude<ExtArgs> | null;
    where: Prisma.PriceBookEntryWhereUniqueInput;
};
export type PriceBookEntryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PriceBookEntryWhereInput;
    limit?: number;
};
export type PriceBookEntryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PriceBookEntrySelect<ExtArgs> | null;
    omit?: Prisma.PriceBookEntryOmit<ExtArgs> | null;
    include?: Prisma.PriceBookEntryInclude<ExtArgs> | null;
};
