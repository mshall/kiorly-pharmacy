import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type UomConversionModel = runtime.Types.Result.DefaultSelection<Prisma.$UomConversionPayload>;
export type AggregateUomConversion = {
    _count: UomConversionCountAggregateOutputType | null;
    _avg: UomConversionAvgAggregateOutputType | null;
    _sum: UomConversionSumAggregateOutputType | null;
    _min: UomConversionMinAggregateOutputType | null;
    _max: UomConversionMaxAggregateOutputType | null;
};
export type UomConversionAvgAggregateOutputType = {
    factor: number | null;
};
export type UomConversionSumAggregateOutputType = {
    factor: number | null;
};
export type UomConversionMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    drugId: string | null;
    name: string | null;
    factor: number | null;
    barcode: string | null;
    active: boolean | null;
    createdAt: Date | null;
};
export type UomConversionMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    drugId: string | null;
    name: string | null;
    factor: number | null;
    barcode: string | null;
    active: boolean | null;
    createdAt: Date | null;
};
export type UomConversionCountAggregateOutputType = {
    id: number;
    orgId: number;
    drugId: number;
    name: number;
    factor: number;
    barcode: number;
    active: number;
    createdAt: number;
    _all: number;
};
export type UomConversionAvgAggregateInputType = {
    factor?: true;
};
export type UomConversionSumAggregateInputType = {
    factor?: true;
};
export type UomConversionMinAggregateInputType = {
    id?: true;
    orgId?: true;
    drugId?: true;
    name?: true;
    factor?: true;
    barcode?: true;
    active?: true;
    createdAt?: true;
};
export type UomConversionMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    drugId?: true;
    name?: true;
    factor?: true;
    barcode?: true;
    active?: true;
    createdAt?: true;
};
export type UomConversionCountAggregateInputType = {
    id?: true;
    orgId?: true;
    drugId?: true;
    name?: true;
    factor?: true;
    barcode?: true;
    active?: true;
    createdAt?: true;
    _all?: true;
};
export type UomConversionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UomConversionWhereInput;
    orderBy?: Prisma.UomConversionOrderByWithRelationInput | Prisma.UomConversionOrderByWithRelationInput[];
    cursor?: Prisma.UomConversionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UomConversionCountAggregateInputType;
    _avg?: UomConversionAvgAggregateInputType;
    _sum?: UomConversionSumAggregateInputType;
    _min?: UomConversionMinAggregateInputType;
    _max?: UomConversionMaxAggregateInputType;
};
export type GetUomConversionAggregateType<T extends UomConversionAggregateArgs> = {
    [P in keyof T & keyof AggregateUomConversion]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUomConversion[P]> : Prisma.GetScalarType<T[P], AggregateUomConversion[P]>;
};
export type UomConversionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UomConversionWhereInput;
    orderBy?: Prisma.UomConversionOrderByWithAggregationInput | Prisma.UomConversionOrderByWithAggregationInput[];
    by: Prisma.UomConversionScalarFieldEnum[] | Prisma.UomConversionScalarFieldEnum;
    having?: Prisma.UomConversionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UomConversionCountAggregateInputType | true;
    _avg?: UomConversionAvgAggregateInputType;
    _sum?: UomConversionSumAggregateInputType;
    _min?: UomConversionMinAggregateInputType;
    _max?: UomConversionMaxAggregateInputType;
};
export type UomConversionGroupByOutputType = {
    id: string;
    orgId: string;
    drugId: string;
    name: string;
    factor: number;
    barcode: string | null;
    active: boolean;
    createdAt: Date;
    _count: UomConversionCountAggregateOutputType | null;
    _avg: UomConversionAvgAggregateOutputType | null;
    _sum: UomConversionSumAggregateOutputType | null;
    _min: UomConversionMinAggregateOutputType | null;
    _max: UomConversionMaxAggregateOutputType | null;
};
export type GetUomConversionGroupByPayload<T extends UomConversionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UomConversionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UomConversionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UomConversionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UomConversionGroupByOutputType[P]>;
}>>;
export type UomConversionWhereInput = {
    AND?: Prisma.UomConversionWhereInput | Prisma.UomConversionWhereInput[];
    OR?: Prisma.UomConversionWhereInput[];
    NOT?: Prisma.UomConversionWhereInput | Prisma.UomConversionWhereInput[];
    id?: Prisma.StringFilter<"UomConversion"> | string;
    orgId?: Prisma.StringFilter<"UomConversion"> | string;
    drugId?: Prisma.StringFilter<"UomConversion"> | string;
    name?: Prisma.StringFilter<"UomConversion"> | string;
    factor?: Prisma.IntFilter<"UomConversion"> | number;
    barcode?: Prisma.StringNullableFilter<"UomConversion"> | string | null;
    active?: Prisma.BoolFilter<"UomConversion"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"UomConversion"> | Date | string;
    drug?: Prisma.XOR<Prisma.DrugScalarRelationFilter, Prisma.DrugWhereInput>;
};
export type UomConversionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    factor?: Prisma.SortOrder;
    barcode?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    drug?: Prisma.DrugOrderByWithRelationInput;
};
export type UomConversionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId_drugId_name?: Prisma.UomConversionOrgIdDrugIdNameCompoundUniqueInput;
    AND?: Prisma.UomConversionWhereInput | Prisma.UomConversionWhereInput[];
    OR?: Prisma.UomConversionWhereInput[];
    NOT?: Prisma.UomConversionWhereInput | Prisma.UomConversionWhereInput[];
    orgId?: Prisma.StringFilter<"UomConversion"> | string;
    drugId?: Prisma.StringFilter<"UomConversion"> | string;
    name?: Prisma.StringFilter<"UomConversion"> | string;
    factor?: Prisma.IntFilter<"UomConversion"> | number;
    barcode?: Prisma.StringNullableFilter<"UomConversion"> | string | null;
    active?: Prisma.BoolFilter<"UomConversion"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"UomConversion"> | Date | string;
    drug?: Prisma.XOR<Prisma.DrugScalarRelationFilter, Prisma.DrugWhereInput>;
}, "id" | "orgId_drugId_name">;
export type UomConversionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    factor?: Prisma.SortOrder;
    barcode?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.UomConversionCountOrderByAggregateInput;
    _avg?: Prisma.UomConversionAvgOrderByAggregateInput;
    _max?: Prisma.UomConversionMaxOrderByAggregateInput;
    _min?: Prisma.UomConversionMinOrderByAggregateInput;
    _sum?: Prisma.UomConversionSumOrderByAggregateInput;
};
export type UomConversionScalarWhereWithAggregatesInput = {
    AND?: Prisma.UomConversionScalarWhereWithAggregatesInput | Prisma.UomConversionScalarWhereWithAggregatesInput[];
    OR?: Prisma.UomConversionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UomConversionScalarWhereWithAggregatesInput | Prisma.UomConversionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"UomConversion"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"UomConversion"> | string;
    drugId?: Prisma.StringWithAggregatesFilter<"UomConversion"> | string;
    name?: Prisma.StringWithAggregatesFilter<"UomConversion"> | string;
    factor?: Prisma.IntWithAggregatesFilter<"UomConversion"> | number;
    barcode?: Prisma.StringNullableWithAggregatesFilter<"UomConversion"> | string | null;
    active?: Prisma.BoolWithAggregatesFilter<"UomConversion"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"UomConversion"> | Date | string;
};
export type UomConversionCreateInput = {
    id?: string;
    orgId: string;
    name: string;
    factor: number;
    barcode?: string | null;
    active?: boolean;
    createdAt?: Date | string;
    drug: Prisma.DrugCreateNestedOneWithoutUomsInput;
};
export type UomConversionUncheckedCreateInput = {
    id?: string;
    orgId: string;
    drugId: string;
    name: string;
    factor: number;
    barcode?: string | null;
    active?: boolean;
    createdAt?: Date | string;
};
export type UomConversionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    factor?: Prisma.IntFieldUpdateOperationsInput | number;
    barcode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    drug?: Prisma.DrugUpdateOneRequiredWithoutUomsNestedInput;
};
export type UomConversionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    factor?: Prisma.IntFieldUpdateOperationsInput | number;
    barcode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UomConversionCreateManyInput = {
    id?: string;
    orgId: string;
    drugId: string;
    name: string;
    factor: number;
    barcode?: string | null;
    active?: boolean;
    createdAt?: Date | string;
};
export type UomConversionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    factor?: Prisma.IntFieldUpdateOperationsInput | number;
    barcode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UomConversionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    factor?: Prisma.IntFieldUpdateOperationsInput | number;
    barcode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UomConversionListRelationFilter = {
    every?: Prisma.UomConversionWhereInput;
    some?: Prisma.UomConversionWhereInput;
    none?: Prisma.UomConversionWhereInput;
};
export type UomConversionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UomConversionOrgIdDrugIdNameCompoundUniqueInput = {
    orgId: string;
    drugId: string;
    name: string;
};
export type UomConversionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    factor?: Prisma.SortOrder;
    barcode?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UomConversionAvgOrderByAggregateInput = {
    factor?: Prisma.SortOrder;
};
export type UomConversionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    factor?: Prisma.SortOrder;
    barcode?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UomConversionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    factor?: Prisma.SortOrder;
    barcode?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UomConversionSumOrderByAggregateInput = {
    factor?: Prisma.SortOrder;
};
export type UomConversionCreateNestedManyWithoutDrugInput = {
    create?: Prisma.XOR<Prisma.UomConversionCreateWithoutDrugInput, Prisma.UomConversionUncheckedCreateWithoutDrugInput> | Prisma.UomConversionCreateWithoutDrugInput[] | Prisma.UomConversionUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.UomConversionCreateOrConnectWithoutDrugInput | Prisma.UomConversionCreateOrConnectWithoutDrugInput[];
    createMany?: Prisma.UomConversionCreateManyDrugInputEnvelope;
    connect?: Prisma.UomConversionWhereUniqueInput | Prisma.UomConversionWhereUniqueInput[];
};
export type UomConversionUncheckedCreateNestedManyWithoutDrugInput = {
    create?: Prisma.XOR<Prisma.UomConversionCreateWithoutDrugInput, Prisma.UomConversionUncheckedCreateWithoutDrugInput> | Prisma.UomConversionCreateWithoutDrugInput[] | Prisma.UomConversionUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.UomConversionCreateOrConnectWithoutDrugInput | Prisma.UomConversionCreateOrConnectWithoutDrugInput[];
    createMany?: Prisma.UomConversionCreateManyDrugInputEnvelope;
    connect?: Prisma.UomConversionWhereUniqueInput | Prisma.UomConversionWhereUniqueInput[];
};
export type UomConversionUpdateManyWithoutDrugNestedInput = {
    create?: Prisma.XOR<Prisma.UomConversionCreateWithoutDrugInput, Prisma.UomConversionUncheckedCreateWithoutDrugInput> | Prisma.UomConversionCreateWithoutDrugInput[] | Prisma.UomConversionUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.UomConversionCreateOrConnectWithoutDrugInput | Prisma.UomConversionCreateOrConnectWithoutDrugInput[];
    upsert?: Prisma.UomConversionUpsertWithWhereUniqueWithoutDrugInput | Prisma.UomConversionUpsertWithWhereUniqueWithoutDrugInput[];
    createMany?: Prisma.UomConversionCreateManyDrugInputEnvelope;
    set?: Prisma.UomConversionWhereUniqueInput | Prisma.UomConversionWhereUniqueInput[];
    disconnect?: Prisma.UomConversionWhereUniqueInput | Prisma.UomConversionWhereUniqueInput[];
    delete?: Prisma.UomConversionWhereUniqueInput | Prisma.UomConversionWhereUniqueInput[];
    connect?: Prisma.UomConversionWhereUniqueInput | Prisma.UomConversionWhereUniqueInput[];
    update?: Prisma.UomConversionUpdateWithWhereUniqueWithoutDrugInput | Prisma.UomConversionUpdateWithWhereUniqueWithoutDrugInput[];
    updateMany?: Prisma.UomConversionUpdateManyWithWhereWithoutDrugInput | Prisma.UomConversionUpdateManyWithWhereWithoutDrugInput[];
    deleteMany?: Prisma.UomConversionScalarWhereInput | Prisma.UomConversionScalarWhereInput[];
};
export type UomConversionUncheckedUpdateManyWithoutDrugNestedInput = {
    create?: Prisma.XOR<Prisma.UomConversionCreateWithoutDrugInput, Prisma.UomConversionUncheckedCreateWithoutDrugInput> | Prisma.UomConversionCreateWithoutDrugInput[] | Prisma.UomConversionUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.UomConversionCreateOrConnectWithoutDrugInput | Prisma.UomConversionCreateOrConnectWithoutDrugInput[];
    upsert?: Prisma.UomConversionUpsertWithWhereUniqueWithoutDrugInput | Prisma.UomConversionUpsertWithWhereUniqueWithoutDrugInput[];
    createMany?: Prisma.UomConversionCreateManyDrugInputEnvelope;
    set?: Prisma.UomConversionWhereUniqueInput | Prisma.UomConversionWhereUniqueInput[];
    disconnect?: Prisma.UomConversionWhereUniqueInput | Prisma.UomConversionWhereUniqueInput[];
    delete?: Prisma.UomConversionWhereUniqueInput | Prisma.UomConversionWhereUniqueInput[];
    connect?: Prisma.UomConversionWhereUniqueInput | Prisma.UomConversionWhereUniqueInput[];
    update?: Prisma.UomConversionUpdateWithWhereUniqueWithoutDrugInput | Prisma.UomConversionUpdateWithWhereUniqueWithoutDrugInput[];
    updateMany?: Prisma.UomConversionUpdateManyWithWhereWithoutDrugInput | Prisma.UomConversionUpdateManyWithWhereWithoutDrugInput[];
    deleteMany?: Prisma.UomConversionScalarWhereInput | Prisma.UomConversionScalarWhereInput[];
};
export type UomConversionCreateWithoutDrugInput = {
    id?: string;
    orgId: string;
    name: string;
    factor: number;
    barcode?: string | null;
    active?: boolean;
    createdAt?: Date | string;
};
export type UomConversionUncheckedCreateWithoutDrugInput = {
    id?: string;
    orgId: string;
    name: string;
    factor: number;
    barcode?: string | null;
    active?: boolean;
    createdAt?: Date | string;
};
export type UomConversionCreateOrConnectWithoutDrugInput = {
    where: Prisma.UomConversionWhereUniqueInput;
    create: Prisma.XOR<Prisma.UomConversionCreateWithoutDrugInput, Prisma.UomConversionUncheckedCreateWithoutDrugInput>;
};
export type UomConversionCreateManyDrugInputEnvelope = {
    data: Prisma.UomConversionCreateManyDrugInput | Prisma.UomConversionCreateManyDrugInput[];
    skipDuplicates?: boolean;
};
export type UomConversionUpsertWithWhereUniqueWithoutDrugInput = {
    where: Prisma.UomConversionWhereUniqueInput;
    update: Prisma.XOR<Prisma.UomConversionUpdateWithoutDrugInput, Prisma.UomConversionUncheckedUpdateWithoutDrugInput>;
    create: Prisma.XOR<Prisma.UomConversionCreateWithoutDrugInput, Prisma.UomConversionUncheckedCreateWithoutDrugInput>;
};
export type UomConversionUpdateWithWhereUniqueWithoutDrugInput = {
    where: Prisma.UomConversionWhereUniqueInput;
    data: Prisma.XOR<Prisma.UomConversionUpdateWithoutDrugInput, Prisma.UomConversionUncheckedUpdateWithoutDrugInput>;
};
export type UomConversionUpdateManyWithWhereWithoutDrugInput = {
    where: Prisma.UomConversionScalarWhereInput;
    data: Prisma.XOR<Prisma.UomConversionUpdateManyMutationInput, Prisma.UomConversionUncheckedUpdateManyWithoutDrugInput>;
};
export type UomConversionScalarWhereInput = {
    AND?: Prisma.UomConversionScalarWhereInput | Prisma.UomConversionScalarWhereInput[];
    OR?: Prisma.UomConversionScalarWhereInput[];
    NOT?: Prisma.UomConversionScalarWhereInput | Prisma.UomConversionScalarWhereInput[];
    id?: Prisma.StringFilter<"UomConversion"> | string;
    orgId?: Prisma.StringFilter<"UomConversion"> | string;
    drugId?: Prisma.StringFilter<"UomConversion"> | string;
    name?: Prisma.StringFilter<"UomConversion"> | string;
    factor?: Prisma.IntFilter<"UomConversion"> | number;
    barcode?: Prisma.StringNullableFilter<"UomConversion"> | string | null;
    active?: Prisma.BoolFilter<"UomConversion"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"UomConversion"> | Date | string;
};
export type UomConversionCreateManyDrugInput = {
    id?: string;
    orgId: string;
    name: string;
    factor: number;
    barcode?: string | null;
    active?: boolean;
    createdAt?: Date | string;
};
export type UomConversionUpdateWithoutDrugInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    factor?: Prisma.IntFieldUpdateOperationsInput | number;
    barcode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UomConversionUncheckedUpdateWithoutDrugInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    factor?: Prisma.IntFieldUpdateOperationsInput | number;
    barcode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UomConversionUncheckedUpdateManyWithoutDrugInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    factor?: Prisma.IntFieldUpdateOperationsInput | number;
    barcode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UomConversionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    drugId?: boolean;
    name?: boolean;
    factor?: boolean;
    barcode?: boolean;
    active?: boolean;
    createdAt?: boolean;
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["uomConversion"]>;
export type UomConversionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    drugId?: boolean;
    name?: boolean;
    factor?: boolean;
    barcode?: boolean;
    active?: boolean;
    createdAt?: boolean;
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["uomConversion"]>;
export type UomConversionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    drugId?: boolean;
    name?: boolean;
    factor?: boolean;
    barcode?: boolean;
    active?: boolean;
    createdAt?: boolean;
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["uomConversion"]>;
export type UomConversionSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    drugId?: boolean;
    name?: boolean;
    factor?: boolean;
    barcode?: boolean;
    active?: boolean;
    createdAt?: boolean;
};
export type UomConversionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "drugId" | "name" | "factor" | "barcode" | "active" | "createdAt", ExtArgs["result"]["uomConversion"]>;
export type UomConversionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
};
export type UomConversionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
};
export type UomConversionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
};
export type $UomConversionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UomConversion";
    objects: {
        drug: Prisma.$DrugPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        drugId: string;
        name: string;
        factor: number;
        barcode: string | null;
        active: boolean;
        createdAt: Date;
    }, ExtArgs["result"]["uomConversion"]>;
    composites: {};
};
export type UomConversionGetPayload<S extends boolean | null | undefined | UomConversionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UomConversionPayload, S>;
export type UomConversionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UomConversionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UomConversionCountAggregateInputType | true;
};
export interface UomConversionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UomConversion'];
        meta: {
            name: 'UomConversion';
        };
    };
    findUnique<T extends UomConversionFindUniqueArgs>(args: Prisma.SelectSubset<T, UomConversionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UomConversionClient<runtime.Types.Result.GetResult<Prisma.$UomConversionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UomConversionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UomConversionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UomConversionClient<runtime.Types.Result.GetResult<Prisma.$UomConversionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UomConversionFindFirstArgs>(args?: Prisma.SelectSubset<T, UomConversionFindFirstArgs<ExtArgs>>): Prisma.Prisma__UomConversionClient<runtime.Types.Result.GetResult<Prisma.$UomConversionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UomConversionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UomConversionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UomConversionClient<runtime.Types.Result.GetResult<Prisma.$UomConversionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UomConversionFindManyArgs>(args?: Prisma.SelectSubset<T, UomConversionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UomConversionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UomConversionCreateArgs>(args: Prisma.SelectSubset<T, UomConversionCreateArgs<ExtArgs>>): Prisma.Prisma__UomConversionClient<runtime.Types.Result.GetResult<Prisma.$UomConversionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UomConversionCreateManyArgs>(args?: Prisma.SelectSubset<T, UomConversionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UomConversionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UomConversionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UomConversionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UomConversionDeleteArgs>(args: Prisma.SelectSubset<T, UomConversionDeleteArgs<ExtArgs>>): Prisma.Prisma__UomConversionClient<runtime.Types.Result.GetResult<Prisma.$UomConversionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UomConversionUpdateArgs>(args: Prisma.SelectSubset<T, UomConversionUpdateArgs<ExtArgs>>): Prisma.Prisma__UomConversionClient<runtime.Types.Result.GetResult<Prisma.$UomConversionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UomConversionDeleteManyArgs>(args?: Prisma.SelectSubset<T, UomConversionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UomConversionUpdateManyArgs>(args: Prisma.SelectSubset<T, UomConversionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UomConversionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UomConversionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UomConversionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UomConversionUpsertArgs>(args: Prisma.SelectSubset<T, UomConversionUpsertArgs<ExtArgs>>): Prisma.Prisma__UomConversionClient<runtime.Types.Result.GetResult<Prisma.$UomConversionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UomConversionCountArgs>(args?: Prisma.Subset<T, UomConversionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UomConversionCountAggregateOutputType> : number>;
    aggregate<T extends UomConversionAggregateArgs>(args: Prisma.Subset<T, UomConversionAggregateArgs>): Prisma.PrismaPromise<GetUomConversionAggregateType<T>>;
    groupBy<T extends UomConversionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UomConversionGroupByArgs['orderBy'];
    } : {
        orderBy?: UomConversionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UomConversionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUomConversionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UomConversionFieldRefs;
}
export interface Prisma__UomConversionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    drug<T extends Prisma.DrugDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DrugDefaultArgs<ExtArgs>>): Prisma.Prisma__DrugClient<runtime.Types.Result.GetResult<Prisma.$DrugPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UomConversionFieldRefs {
    readonly id: Prisma.FieldRef<"UomConversion", 'String'>;
    readonly orgId: Prisma.FieldRef<"UomConversion", 'String'>;
    readonly drugId: Prisma.FieldRef<"UomConversion", 'String'>;
    readonly name: Prisma.FieldRef<"UomConversion", 'String'>;
    readonly factor: Prisma.FieldRef<"UomConversion", 'Int'>;
    readonly barcode: Prisma.FieldRef<"UomConversion", 'String'>;
    readonly active: Prisma.FieldRef<"UomConversion", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"UomConversion", 'DateTime'>;
}
export type UomConversionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UomConversionSelect<ExtArgs> | null;
    omit?: Prisma.UomConversionOmit<ExtArgs> | null;
    include?: Prisma.UomConversionInclude<ExtArgs> | null;
    where: Prisma.UomConversionWhereUniqueInput;
};
export type UomConversionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UomConversionSelect<ExtArgs> | null;
    omit?: Prisma.UomConversionOmit<ExtArgs> | null;
    include?: Prisma.UomConversionInclude<ExtArgs> | null;
    where: Prisma.UomConversionWhereUniqueInput;
};
export type UomConversionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UomConversionSelect<ExtArgs> | null;
    omit?: Prisma.UomConversionOmit<ExtArgs> | null;
    include?: Prisma.UomConversionInclude<ExtArgs> | null;
    where?: Prisma.UomConversionWhereInput;
    orderBy?: Prisma.UomConversionOrderByWithRelationInput | Prisma.UomConversionOrderByWithRelationInput[];
    cursor?: Prisma.UomConversionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UomConversionScalarFieldEnum | Prisma.UomConversionScalarFieldEnum[];
};
export type UomConversionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UomConversionSelect<ExtArgs> | null;
    omit?: Prisma.UomConversionOmit<ExtArgs> | null;
    include?: Prisma.UomConversionInclude<ExtArgs> | null;
    where?: Prisma.UomConversionWhereInput;
    orderBy?: Prisma.UomConversionOrderByWithRelationInput | Prisma.UomConversionOrderByWithRelationInput[];
    cursor?: Prisma.UomConversionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UomConversionScalarFieldEnum | Prisma.UomConversionScalarFieldEnum[];
};
export type UomConversionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UomConversionSelect<ExtArgs> | null;
    omit?: Prisma.UomConversionOmit<ExtArgs> | null;
    include?: Prisma.UomConversionInclude<ExtArgs> | null;
    where?: Prisma.UomConversionWhereInput;
    orderBy?: Prisma.UomConversionOrderByWithRelationInput | Prisma.UomConversionOrderByWithRelationInput[];
    cursor?: Prisma.UomConversionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UomConversionScalarFieldEnum | Prisma.UomConversionScalarFieldEnum[];
};
export type UomConversionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UomConversionSelect<ExtArgs> | null;
    omit?: Prisma.UomConversionOmit<ExtArgs> | null;
    include?: Prisma.UomConversionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UomConversionCreateInput, Prisma.UomConversionUncheckedCreateInput>;
};
export type UomConversionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UomConversionCreateManyInput | Prisma.UomConversionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UomConversionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UomConversionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UomConversionOmit<ExtArgs> | null;
    data: Prisma.UomConversionCreateManyInput | Prisma.UomConversionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UomConversionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UomConversionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UomConversionSelect<ExtArgs> | null;
    omit?: Prisma.UomConversionOmit<ExtArgs> | null;
    include?: Prisma.UomConversionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UomConversionUpdateInput, Prisma.UomConversionUncheckedUpdateInput>;
    where: Prisma.UomConversionWhereUniqueInput;
};
export type UomConversionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UomConversionUpdateManyMutationInput, Prisma.UomConversionUncheckedUpdateManyInput>;
    where?: Prisma.UomConversionWhereInput;
    limit?: number;
};
export type UomConversionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UomConversionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UomConversionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UomConversionUpdateManyMutationInput, Prisma.UomConversionUncheckedUpdateManyInput>;
    where?: Prisma.UomConversionWhereInput;
    limit?: number;
    include?: Prisma.UomConversionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UomConversionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UomConversionSelect<ExtArgs> | null;
    omit?: Prisma.UomConversionOmit<ExtArgs> | null;
    include?: Prisma.UomConversionInclude<ExtArgs> | null;
    where: Prisma.UomConversionWhereUniqueInput;
    create: Prisma.XOR<Prisma.UomConversionCreateInput, Prisma.UomConversionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UomConversionUpdateInput, Prisma.UomConversionUncheckedUpdateInput>;
};
export type UomConversionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UomConversionSelect<ExtArgs> | null;
    omit?: Prisma.UomConversionOmit<ExtArgs> | null;
    include?: Prisma.UomConversionInclude<ExtArgs> | null;
    where: Prisma.UomConversionWhereUniqueInput;
};
export type UomConversionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UomConversionWhereInput;
    limit?: number;
};
export type UomConversionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UomConversionSelect<ExtArgs> | null;
    omit?: Prisma.UomConversionOmit<ExtArgs> | null;
    include?: Prisma.UomConversionInclude<ExtArgs> | null;
};
