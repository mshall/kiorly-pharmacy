import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type PrescriptionLineModel = runtime.Types.Result.DefaultSelection<Prisma.$PrescriptionLinePayload>;
export type AggregatePrescriptionLine = {
    _count: PrescriptionLineCountAggregateOutputType | null;
    _avg: PrescriptionLineAvgAggregateOutputType | null;
    _sum: PrescriptionLineSumAggregateOutputType | null;
    _min: PrescriptionLineMinAggregateOutputType | null;
    _max: PrescriptionLineMaxAggregateOutputType | null;
};
export type PrescriptionLineAvgAggregateOutputType = {
    quantity: number | null;
    qtyDispensed: number | null;
};
export type PrescriptionLineSumAggregateOutputType = {
    quantity: number | null;
    qtyDispensed: number | null;
};
export type PrescriptionLineMinAggregateOutputType = {
    id: string | null;
    prescriptionId: string | null;
    drugId: string | null;
    activeIngredient: string | null;
    strength: string | null;
    dosageForm: string | null;
    quantity: number | null;
    qtyDispensed: number | null;
    drugName: string | null;
    controlled: boolean | null;
    directions: string | null;
};
export type PrescriptionLineMaxAggregateOutputType = {
    id: string | null;
    prescriptionId: string | null;
    drugId: string | null;
    activeIngredient: string | null;
    strength: string | null;
    dosageForm: string | null;
    quantity: number | null;
    qtyDispensed: number | null;
    drugName: string | null;
    controlled: boolean | null;
    directions: string | null;
};
export type PrescriptionLineCountAggregateOutputType = {
    id: number;
    prescriptionId: number;
    drugId: number;
    activeIngredient: number;
    strength: number;
    dosageForm: number;
    quantity: number;
    qtyDispensed: number;
    drugName: number;
    controlled: number;
    directions: number;
    _all: number;
};
export type PrescriptionLineAvgAggregateInputType = {
    quantity?: true;
    qtyDispensed?: true;
};
export type PrescriptionLineSumAggregateInputType = {
    quantity?: true;
    qtyDispensed?: true;
};
export type PrescriptionLineMinAggregateInputType = {
    id?: true;
    prescriptionId?: true;
    drugId?: true;
    activeIngredient?: true;
    strength?: true;
    dosageForm?: true;
    quantity?: true;
    qtyDispensed?: true;
    drugName?: true;
    controlled?: true;
    directions?: true;
};
export type PrescriptionLineMaxAggregateInputType = {
    id?: true;
    prescriptionId?: true;
    drugId?: true;
    activeIngredient?: true;
    strength?: true;
    dosageForm?: true;
    quantity?: true;
    qtyDispensed?: true;
    drugName?: true;
    controlled?: true;
    directions?: true;
};
export type PrescriptionLineCountAggregateInputType = {
    id?: true;
    prescriptionId?: true;
    drugId?: true;
    activeIngredient?: true;
    strength?: true;
    dosageForm?: true;
    quantity?: true;
    qtyDispensed?: true;
    drugName?: true;
    controlled?: true;
    directions?: true;
    _all?: true;
};
export type PrescriptionLineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PrescriptionLineWhereInput;
    orderBy?: Prisma.PrescriptionLineOrderByWithRelationInput | Prisma.PrescriptionLineOrderByWithRelationInput[];
    cursor?: Prisma.PrescriptionLineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PrescriptionLineCountAggregateInputType;
    _avg?: PrescriptionLineAvgAggregateInputType;
    _sum?: PrescriptionLineSumAggregateInputType;
    _min?: PrescriptionLineMinAggregateInputType;
    _max?: PrescriptionLineMaxAggregateInputType;
};
export type GetPrescriptionLineAggregateType<T extends PrescriptionLineAggregateArgs> = {
    [P in keyof T & keyof AggregatePrescriptionLine]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePrescriptionLine[P]> : Prisma.GetScalarType<T[P], AggregatePrescriptionLine[P]>;
};
export type PrescriptionLineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PrescriptionLineWhereInput;
    orderBy?: Prisma.PrescriptionLineOrderByWithAggregationInput | Prisma.PrescriptionLineOrderByWithAggregationInput[];
    by: Prisma.PrescriptionLineScalarFieldEnum[] | Prisma.PrescriptionLineScalarFieldEnum;
    having?: Prisma.PrescriptionLineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PrescriptionLineCountAggregateInputType | true;
    _avg?: PrescriptionLineAvgAggregateInputType;
    _sum?: PrescriptionLineSumAggregateInputType;
    _min?: PrescriptionLineMinAggregateInputType;
    _max?: PrescriptionLineMaxAggregateInputType;
};
export type PrescriptionLineGroupByOutputType = {
    id: string;
    prescriptionId: string;
    drugId: string | null;
    activeIngredient: string | null;
    strength: string | null;
    dosageForm: string | null;
    quantity: number;
    qtyDispensed: number;
    drugName: string | null;
    controlled: boolean;
    directions: string | null;
    _count: PrescriptionLineCountAggregateOutputType | null;
    _avg: PrescriptionLineAvgAggregateOutputType | null;
    _sum: PrescriptionLineSumAggregateOutputType | null;
    _min: PrescriptionLineMinAggregateOutputType | null;
    _max: PrescriptionLineMaxAggregateOutputType | null;
};
export type GetPrescriptionLineGroupByPayload<T extends PrescriptionLineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PrescriptionLineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PrescriptionLineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PrescriptionLineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PrescriptionLineGroupByOutputType[P]>;
}>>;
export type PrescriptionLineWhereInput = {
    AND?: Prisma.PrescriptionLineWhereInput | Prisma.PrescriptionLineWhereInput[];
    OR?: Prisma.PrescriptionLineWhereInput[];
    NOT?: Prisma.PrescriptionLineWhereInput | Prisma.PrescriptionLineWhereInput[];
    id?: Prisma.StringFilter<"PrescriptionLine"> | string;
    prescriptionId?: Prisma.StringFilter<"PrescriptionLine"> | string;
    drugId?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    activeIngredient?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    strength?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    dosageForm?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    quantity?: Prisma.IntFilter<"PrescriptionLine"> | number;
    qtyDispensed?: Prisma.IntFilter<"PrescriptionLine"> | number;
    drugName?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    controlled?: Prisma.BoolFilter<"PrescriptionLine"> | boolean;
    directions?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    prescription?: Prisma.XOR<Prisma.PrescriptionScalarRelationFilter, Prisma.PrescriptionWhereInput>;
    drug?: Prisma.XOR<Prisma.DrugNullableScalarRelationFilter, Prisma.DrugWhereInput> | null;
};
export type PrescriptionLineOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrderInput | Prisma.SortOrder;
    activeIngredient?: Prisma.SortOrderInput | Prisma.SortOrder;
    strength?: Prisma.SortOrderInput | Prisma.SortOrder;
    dosageForm?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    qtyDispensed?: Prisma.SortOrder;
    drugName?: Prisma.SortOrderInput | Prisma.SortOrder;
    controlled?: Prisma.SortOrder;
    directions?: Prisma.SortOrderInput | Prisma.SortOrder;
    prescription?: Prisma.PrescriptionOrderByWithRelationInput;
    drug?: Prisma.DrugOrderByWithRelationInput;
};
export type PrescriptionLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PrescriptionLineWhereInput | Prisma.PrescriptionLineWhereInput[];
    OR?: Prisma.PrescriptionLineWhereInput[];
    NOT?: Prisma.PrescriptionLineWhereInput | Prisma.PrescriptionLineWhereInput[];
    prescriptionId?: Prisma.StringFilter<"PrescriptionLine"> | string;
    drugId?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    activeIngredient?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    strength?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    dosageForm?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    quantity?: Prisma.IntFilter<"PrescriptionLine"> | number;
    qtyDispensed?: Prisma.IntFilter<"PrescriptionLine"> | number;
    drugName?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    controlled?: Prisma.BoolFilter<"PrescriptionLine"> | boolean;
    directions?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    prescription?: Prisma.XOR<Prisma.PrescriptionScalarRelationFilter, Prisma.PrescriptionWhereInput>;
    drug?: Prisma.XOR<Prisma.DrugNullableScalarRelationFilter, Prisma.DrugWhereInput> | null;
}, "id">;
export type PrescriptionLineOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrderInput | Prisma.SortOrder;
    activeIngredient?: Prisma.SortOrderInput | Prisma.SortOrder;
    strength?: Prisma.SortOrderInput | Prisma.SortOrder;
    dosageForm?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    qtyDispensed?: Prisma.SortOrder;
    drugName?: Prisma.SortOrderInput | Prisma.SortOrder;
    controlled?: Prisma.SortOrder;
    directions?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.PrescriptionLineCountOrderByAggregateInput;
    _avg?: Prisma.PrescriptionLineAvgOrderByAggregateInput;
    _max?: Prisma.PrescriptionLineMaxOrderByAggregateInput;
    _min?: Prisma.PrescriptionLineMinOrderByAggregateInput;
    _sum?: Prisma.PrescriptionLineSumOrderByAggregateInput;
};
export type PrescriptionLineScalarWhereWithAggregatesInput = {
    AND?: Prisma.PrescriptionLineScalarWhereWithAggregatesInput | Prisma.PrescriptionLineScalarWhereWithAggregatesInput[];
    OR?: Prisma.PrescriptionLineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PrescriptionLineScalarWhereWithAggregatesInput | Prisma.PrescriptionLineScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PrescriptionLine"> | string;
    prescriptionId?: Prisma.StringWithAggregatesFilter<"PrescriptionLine"> | string;
    drugId?: Prisma.StringNullableWithAggregatesFilter<"PrescriptionLine"> | string | null;
    activeIngredient?: Prisma.StringNullableWithAggregatesFilter<"PrescriptionLine"> | string | null;
    strength?: Prisma.StringNullableWithAggregatesFilter<"PrescriptionLine"> | string | null;
    dosageForm?: Prisma.StringNullableWithAggregatesFilter<"PrescriptionLine"> | string | null;
    quantity?: Prisma.IntWithAggregatesFilter<"PrescriptionLine"> | number;
    qtyDispensed?: Prisma.IntWithAggregatesFilter<"PrescriptionLine"> | number;
    drugName?: Prisma.StringNullableWithAggregatesFilter<"PrescriptionLine"> | string | null;
    controlled?: Prisma.BoolWithAggregatesFilter<"PrescriptionLine"> | boolean;
    directions?: Prisma.StringNullableWithAggregatesFilter<"PrescriptionLine"> | string | null;
};
export type PrescriptionLineCreateInput = {
    id?: string;
    activeIngredient?: string | null;
    strength?: string | null;
    dosageForm?: string | null;
    quantity: number;
    qtyDispensed?: number;
    drugName?: string | null;
    controlled?: boolean;
    directions?: string | null;
    prescription: Prisma.PrescriptionCreateNestedOneWithoutLinesInput;
    drug?: Prisma.DrugCreateNestedOneWithoutRxLinesInput;
};
export type PrescriptionLineUncheckedCreateInput = {
    id?: string;
    prescriptionId: string;
    drugId?: string | null;
    activeIngredient?: string | null;
    strength?: string | null;
    dosageForm?: string | null;
    quantity: number;
    qtyDispensed?: number;
    drugName?: string | null;
    controlled?: boolean;
    directions?: string | null;
};
export type PrescriptionLineUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    activeIngredient?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    strength?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosageForm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyDispensed?: Prisma.IntFieldUpdateOperationsInput | number;
    drugName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    controlled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    directions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescription?: Prisma.PrescriptionUpdateOneRequiredWithoutLinesNestedInput;
    drug?: Prisma.DrugUpdateOneWithoutRxLinesNestedInput;
};
export type PrescriptionLineUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeIngredient?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    strength?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosageForm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyDispensed?: Prisma.IntFieldUpdateOperationsInput | number;
    drugName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    controlled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    directions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PrescriptionLineCreateManyInput = {
    id?: string;
    prescriptionId: string;
    drugId?: string | null;
    activeIngredient?: string | null;
    strength?: string | null;
    dosageForm?: string | null;
    quantity: number;
    qtyDispensed?: number;
    drugName?: string | null;
    controlled?: boolean;
    directions?: string | null;
};
export type PrescriptionLineUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    activeIngredient?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    strength?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosageForm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyDispensed?: Prisma.IntFieldUpdateOperationsInput | number;
    drugName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    controlled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    directions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PrescriptionLineUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeIngredient?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    strength?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosageForm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyDispensed?: Prisma.IntFieldUpdateOperationsInput | number;
    drugName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    controlled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    directions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PrescriptionLineListRelationFilter = {
    every?: Prisma.PrescriptionLineWhereInput;
    some?: Prisma.PrescriptionLineWhereInput;
    none?: Prisma.PrescriptionLineWhereInput;
};
export type PrescriptionLineOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PrescriptionLineCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    activeIngredient?: Prisma.SortOrder;
    strength?: Prisma.SortOrder;
    dosageForm?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    qtyDispensed?: Prisma.SortOrder;
    drugName?: Prisma.SortOrder;
    controlled?: Prisma.SortOrder;
    directions?: Prisma.SortOrder;
};
export type PrescriptionLineAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    qtyDispensed?: Prisma.SortOrder;
};
export type PrescriptionLineMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    activeIngredient?: Prisma.SortOrder;
    strength?: Prisma.SortOrder;
    dosageForm?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    qtyDispensed?: Prisma.SortOrder;
    drugName?: Prisma.SortOrder;
    controlled?: Prisma.SortOrder;
    directions?: Prisma.SortOrder;
};
export type PrescriptionLineMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    activeIngredient?: Prisma.SortOrder;
    strength?: Prisma.SortOrder;
    dosageForm?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    qtyDispensed?: Prisma.SortOrder;
    drugName?: Prisma.SortOrder;
    controlled?: Prisma.SortOrder;
    directions?: Prisma.SortOrder;
};
export type PrescriptionLineSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    qtyDispensed?: Prisma.SortOrder;
};
export type PrescriptionLineCreateNestedManyWithoutDrugInput = {
    create?: Prisma.XOR<Prisma.PrescriptionLineCreateWithoutDrugInput, Prisma.PrescriptionLineUncheckedCreateWithoutDrugInput> | Prisma.PrescriptionLineCreateWithoutDrugInput[] | Prisma.PrescriptionLineUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.PrescriptionLineCreateOrConnectWithoutDrugInput | Prisma.PrescriptionLineCreateOrConnectWithoutDrugInput[];
    createMany?: Prisma.PrescriptionLineCreateManyDrugInputEnvelope;
    connect?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
};
export type PrescriptionLineUncheckedCreateNestedManyWithoutDrugInput = {
    create?: Prisma.XOR<Prisma.PrescriptionLineCreateWithoutDrugInput, Prisma.PrescriptionLineUncheckedCreateWithoutDrugInput> | Prisma.PrescriptionLineCreateWithoutDrugInput[] | Prisma.PrescriptionLineUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.PrescriptionLineCreateOrConnectWithoutDrugInput | Prisma.PrescriptionLineCreateOrConnectWithoutDrugInput[];
    createMany?: Prisma.PrescriptionLineCreateManyDrugInputEnvelope;
    connect?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
};
export type PrescriptionLineUpdateManyWithoutDrugNestedInput = {
    create?: Prisma.XOR<Prisma.PrescriptionLineCreateWithoutDrugInput, Prisma.PrescriptionLineUncheckedCreateWithoutDrugInput> | Prisma.PrescriptionLineCreateWithoutDrugInput[] | Prisma.PrescriptionLineUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.PrescriptionLineCreateOrConnectWithoutDrugInput | Prisma.PrescriptionLineCreateOrConnectWithoutDrugInput[];
    upsert?: Prisma.PrescriptionLineUpsertWithWhereUniqueWithoutDrugInput | Prisma.PrescriptionLineUpsertWithWhereUniqueWithoutDrugInput[];
    createMany?: Prisma.PrescriptionLineCreateManyDrugInputEnvelope;
    set?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    disconnect?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    delete?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    connect?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    update?: Prisma.PrescriptionLineUpdateWithWhereUniqueWithoutDrugInput | Prisma.PrescriptionLineUpdateWithWhereUniqueWithoutDrugInput[];
    updateMany?: Prisma.PrescriptionLineUpdateManyWithWhereWithoutDrugInput | Prisma.PrescriptionLineUpdateManyWithWhereWithoutDrugInput[];
    deleteMany?: Prisma.PrescriptionLineScalarWhereInput | Prisma.PrescriptionLineScalarWhereInput[];
};
export type PrescriptionLineUncheckedUpdateManyWithoutDrugNestedInput = {
    create?: Prisma.XOR<Prisma.PrescriptionLineCreateWithoutDrugInput, Prisma.PrescriptionLineUncheckedCreateWithoutDrugInput> | Prisma.PrescriptionLineCreateWithoutDrugInput[] | Prisma.PrescriptionLineUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.PrescriptionLineCreateOrConnectWithoutDrugInput | Prisma.PrescriptionLineCreateOrConnectWithoutDrugInput[];
    upsert?: Prisma.PrescriptionLineUpsertWithWhereUniqueWithoutDrugInput | Prisma.PrescriptionLineUpsertWithWhereUniqueWithoutDrugInput[];
    createMany?: Prisma.PrescriptionLineCreateManyDrugInputEnvelope;
    set?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    disconnect?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    delete?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    connect?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    update?: Prisma.PrescriptionLineUpdateWithWhereUniqueWithoutDrugInput | Prisma.PrescriptionLineUpdateWithWhereUniqueWithoutDrugInput[];
    updateMany?: Prisma.PrescriptionLineUpdateManyWithWhereWithoutDrugInput | Prisma.PrescriptionLineUpdateManyWithWhereWithoutDrugInput[];
    deleteMany?: Prisma.PrescriptionLineScalarWhereInput | Prisma.PrescriptionLineScalarWhereInput[];
};
export type PrescriptionLineCreateNestedManyWithoutPrescriptionInput = {
    create?: Prisma.XOR<Prisma.PrescriptionLineCreateWithoutPrescriptionInput, Prisma.PrescriptionLineUncheckedCreateWithoutPrescriptionInput> | Prisma.PrescriptionLineCreateWithoutPrescriptionInput[] | Prisma.PrescriptionLineUncheckedCreateWithoutPrescriptionInput[];
    connectOrCreate?: Prisma.PrescriptionLineCreateOrConnectWithoutPrescriptionInput | Prisma.PrescriptionLineCreateOrConnectWithoutPrescriptionInput[];
    createMany?: Prisma.PrescriptionLineCreateManyPrescriptionInputEnvelope;
    connect?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
};
export type PrescriptionLineUncheckedCreateNestedManyWithoutPrescriptionInput = {
    create?: Prisma.XOR<Prisma.PrescriptionLineCreateWithoutPrescriptionInput, Prisma.PrescriptionLineUncheckedCreateWithoutPrescriptionInput> | Prisma.PrescriptionLineCreateWithoutPrescriptionInput[] | Prisma.PrescriptionLineUncheckedCreateWithoutPrescriptionInput[];
    connectOrCreate?: Prisma.PrescriptionLineCreateOrConnectWithoutPrescriptionInput | Prisma.PrescriptionLineCreateOrConnectWithoutPrescriptionInput[];
    createMany?: Prisma.PrescriptionLineCreateManyPrescriptionInputEnvelope;
    connect?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
};
export type PrescriptionLineUpdateManyWithoutPrescriptionNestedInput = {
    create?: Prisma.XOR<Prisma.PrescriptionLineCreateWithoutPrescriptionInput, Prisma.PrescriptionLineUncheckedCreateWithoutPrescriptionInput> | Prisma.PrescriptionLineCreateWithoutPrescriptionInput[] | Prisma.PrescriptionLineUncheckedCreateWithoutPrescriptionInput[];
    connectOrCreate?: Prisma.PrescriptionLineCreateOrConnectWithoutPrescriptionInput | Prisma.PrescriptionLineCreateOrConnectWithoutPrescriptionInput[];
    upsert?: Prisma.PrescriptionLineUpsertWithWhereUniqueWithoutPrescriptionInput | Prisma.PrescriptionLineUpsertWithWhereUniqueWithoutPrescriptionInput[];
    createMany?: Prisma.PrescriptionLineCreateManyPrescriptionInputEnvelope;
    set?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    disconnect?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    delete?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    connect?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    update?: Prisma.PrescriptionLineUpdateWithWhereUniqueWithoutPrescriptionInput | Prisma.PrescriptionLineUpdateWithWhereUniqueWithoutPrescriptionInput[];
    updateMany?: Prisma.PrescriptionLineUpdateManyWithWhereWithoutPrescriptionInput | Prisma.PrescriptionLineUpdateManyWithWhereWithoutPrescriptionInput[];
    deleteMany?: Prisma.PrescriptionLineScalarWhereInput | Prisma.PrescriptionLineScalarWhereInput[];
};
export type PrescriptionLineUncheckedUpdateManyWithoutPrescriptionNestedInput = {
    create?: Prisma.XOR<Prisma.PrescriptionLineCreateWithoutPrescriptionInput, Prisma.PrescriptionLineUncheckedCreateWithoutPrescriptionInput> | Prisma.PrescriptionLineCreateWithoutPrescriptionInput[] | Prisma.PrescriptionLineUncheckedCreateWithoutPrescriptionInput[];
    connectOrCreate?: Prisma.PrescriptionLineCreateOrConnectWithoutPrescriptionInput | Prisma.PrescriptionLineCreateOrConnectWithoutPrescriptionInput[];
    upsert?: Prisma.PrescriptionLineUpsertWithWhereUniqueWithoutPrescriptionInput | Prisma.PrescriptionLineUpsertWithWhereUniqueWithoutPrescriptionInput[];
    createMany?: Prisma.PrescriptionLineCreateManyPrescriptionInputEnvelope;
    set?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    disconnect?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    delete?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    connect?: Prisma.PrescriptionLineWhereUniqueInput | Prisma.PrescriptionLineWhereUniqueInput[];
    update?: Prisma.PrescriptionLineUpdateWithWhereUniqueWithoutPrescriptionInput | Prisma.PrescriptionLineUpdateWithWhereUniqueWithoutPrescriptionInput[];
    updateMany?: Prisma.PrescriptionLineUpdateManyWithWhereWithoutPrescriptionInput | Prisma.PrescriptionLineUpdateManyWithWhereWithoutPrescriptionInput[];
    deleteMany?: Prisma.PrescriptionLineScalarWhereInput | Prisma.PrescriptionLineScalarWhereInput[];
};
export type PrescriptionLineCreateWithoutDrugInput = {
    id?: string;
    activeIngredient?: string | null;
    strength?: string | null;
    dosageForm?: string | null;
    quantity: number;
    qtyDispensed?: number;
    drugName?: string | null;
    controlled?: boolean;
    directions?: string | null;
    prescription: Prisma.PrescriptionCreateNestedOneWithoutLinesInput;
};
export type PrescriptionLineUncheckedCreateWithoutDrugInput = {
    id?: string;
    prescriptionId: string;
    activeIngredient?: string | null;
    strength?: string | null;
    dosageForm?: string | null;
    quantity: number;
    qtyDispensed?: number;
    drugName?: string | null;
    controlled?: boolean;
    directions?: string | null;
};
export type PrescriptionLineCreateOrConnectWithoutDrugInput = {
    where: Prisma.PrescriptionLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.PrescriptionLineCreateWithoutDrugInput, Prisma.PrescriptionLineUncheckedCreateWithoutDrugInput>;
};
export type PrescriptionLineCreateManyDrugInputEnvelope = {
    data: Prisma.PrescriptionLineCreateManyDrugInput | Prisma.PrescriptionLineCreateManyDrugInput[];
    skipDuplicates?: boolean;
};
export type PrescriptionLineUpsertWithWhereUniqueWithoutDrugInput = {
    where: Prisma.PrescriptionLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.PrescriptionLineUpdateWithoutDrugInput, Prisma.PrescriptionLineUncheckedUpdateWithoutDrugInput>;
    create: Prisma.XOR<Prisma.PrescriptionLineCreateWithoutDrugInput, Prisma.PrescriptionLineUncheckedCreateWithoutDrugInput>;
};
export type PrescriptionLineUpdateWithWhereUniqueWithoutDrugInput = {
    where: Prisma.PrescriptionLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.PrescriptionLineUpdateWithoutDrugInput, Prisma.PrescriptionLineUncheckedUpdateWithoutDrugInput>;
};
export type PrescriptionLineUpdateManyWithWhereWithoutDrugInput = {
    where: Prisma.PrescriptionLineScalarWhereInput;
    data: Prisma.XOR<Prisma.PrescriptionLineUpdateManyMutationInput, Prisma.PrescriptionLineUncheckedUpdateManyWithoutDrugInput>;
};
export type PrescriptionLineScalarWhereInput = {
    AND?: Prisma.PrescriptionLineScalarWhereInput | Prisma.PrescriptionLineScalarWhereInput[];
    OR?: Prisma.PrescriptionLineScalarWhereInput[];
    NOT?: Prisma.PrescriptionLineScalarWhereInput | Prisma.PrescriptionLineScalarWhereInput[];
    id?: Prisma.StringFilter<"PrescriptionLine"> | string;
    prescriptionId?: Prisma.StringFilter<"PrescriptionLine"> | string;
    drugId?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    activeIngredient?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    strength?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    dosageForm?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    quantity?: Prisma.IntFilter<"PrescriptionLine"> | number;
    qtyDispensed?: Prisma.IntFilter<"PrescriptionLine"> | number;
    drugName?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
    controlled?: Prisma.BoolFilter<"PrescriptionLine"> | boolean;
    directions?: Prisma.StringNullableFilter<"PrescriptionLine"> | string | null;
};
export type PrescriptionLineCreateWithoutPrescriptionInput = {
    id?: string;
    activeIngredient?: string | null;
    strength?: string | null;
    dosageForm?: string | null;
    quantity: number;
    qtyDispensed?: number;
    drugName?: string | null;
    controlled?: boolean;
    directions?: string | null;
    drug?: Prisma.DrugCreateNestedOneWithoutRxLinesInput;
};
export type PrescriptionLineUncheckedCreateWithoutPrescriptionInput = {
    id?: string;
    drugId?: string | null;
    activeIngredient?: string | null;
    strength?: string | null;
    dosageForm?: string | null;
    quantity: number;
    qtyDispensed?: number;
    drugName?: string | null;
    controlled?: boolean;
    directions?: string | null;
};
export type PrescriptionLineCreateOrConnectWithoutPrescriptionInput = {
    where: Prisma.PrescriptionLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.PrescriptionLineCreateWithoutPrescriptionInput, Prisma.PrescriptionLineUncheckedCreateWithoutPrescriptionInput>;
};
export type PrescriptionLineCreateManyPrescriptionInputEnvelope = {
    data: Prisma.PrescriptionLineCreateManyPrescriptionInput | Prisma.PrescriptionLineCreateManyPrescriptionInput[];
    skipDuplicates?: boolean;
};
export type PrescriptionLineUpsertWithWhereUniqueWithoutPrescriptionInput = {
    where: Prisma.PrescriptionLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.PrescriptionLineUpdateWithoutPrescriptionInput, Prisma.PrescriptionLineUncheckedUpdateWithoutPrescriptionInput>;
    create: Prisma.XOR<Prisma.PrescriptionLineCreateWithoutPrescriptionInput, Prisma.PrescriptionLineUncheckedCreateWithoutPrescriptionInput>;
};
export type PrescriptionLineUpdateWithWhereUniqueWithoutPrescriptionInput = {
    where: Prisma.PrescriptionLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.PrescriptionLineUpdateWithoutPrescriptionInput, Prisma.PrescriptionLineUncheckedUpdateWithoutPrescriptionInput>;
};
export type PrescriptionLineUpdateManyWithWhereWithoutPrescriptionInput = {
    where: Prisma.PrescriptionLineScalarWhereInput;
    data: Prisma.XOR<Prisma.PrescriptionLineUpdateManyMutationInput, Prisma.PrescriptionLineUncheckedUpdateManyWithoutPrescriptionInput>;
};
export type PrescriptionLineCreateManyDrugInput = {
    id?: string;
    prescriptionId: string;
    activeIngredient?: string | null;
    strength?: string | null;
    dosageForm?: string | null;
    quantity: number;
    qtyDispensed?: number;
    drugName?: string | null;
    controlled?: boolean;
    directions?: string | null;
};
export type PrescriptionLineUpdateWithoutDrugInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    activeIngredient?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    strength?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosageForm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyDispensed?: Prisma.IntFieldUpdateOperationsInput | number;
    drugName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    controlled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    directions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescription?: Prisma.PrescriptionUpdateOneRequiredWithoutLinesNestedInput;
};
export type PrescriptionLineUncheckedUpdateWithoutDrugInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    activeIngredient?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    strength?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosageForm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyDispensed?: Prisma.IntFieldUpdateOperationsInput | number;
    drugName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    controlled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    directions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PrescriptionLineUncheckedUpdateManyWithoutDrugInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    activeIngredient?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    strength?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosageForm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyDispensed?: Prisma.IntFieldUpdateOperationsInput | number;
    drugName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    controlled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    directions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PrescriptionLineCreateManyPrescriptionInput = {
    id?: string;
    drugId?: string | null;
    activeIngredient?: string | null;
    strength?: string | null;
    dosageForm?: string | null;
    quantity: number;
    qtyDispensed?: number;
    drugName?: string | null;
    controlled?: boolean;
    directions?: string | null;
};
export type PrescriptionLineUpdateWithoutPrescriptionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    activeIngredient?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    strength?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosageForm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyDispensed?: Prisma.IntFieldUpdateOperationsInput | number;
    drugName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    controlled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    directions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    drug?: Prisma.DrugUpdateOneWithoutRxLinesNestedInput;
};
export type PrescriptionLineUncheckedUpdateWithoutPrescriptionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeIngredient?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    strength?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosageForm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyDispensed?: Prisma.IntFieldUpdateOperationsInput | number;
    drugName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    controlled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    directions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PrescriptionLineUncheckedUpdateManyWithoutPrescriptionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeIngredient?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    strength?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosageForm?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    qtyDispensed?: Prisma.IntFieldUpdateOperationsInput | number;
    drugName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    controlled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    directions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PrescriptionLineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    prescriptionId?: boolean;
    drugId?: boolean;
    activeIngredient?: boolean;
    strength?: boolean;
    dosageForm?: boolean;
    quantity?: boolean;
    qtyDispensed?: boolean;
    drugName?: boolean;
    controlled?: boolean;
    directions?: boolean;
    prescription?: boolean | Prisma.PrescriptionDefaultArgs<ExtArgs>;
    drug?: boolean | Prisma.PrescriptionLine$drugArgs<ExtArgs>;
}, ExtArgs["result"]["prescriptionLine"]>;
export type PrescriptionLineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    prescriptionId?: boolean;
    drugId?: boolean;
    activeIngredient?: boolean;
    strength?: boolean;
    dosageForm?: boolean;
    quantity?: boolean;
    qtyDispensed?: boolean;
    drugName?: boolean;
    controlled?: boolean;
    directions?: boolean;
    prescription?: boolean | Prisma.PrescriptionDefaultArgs<ExtArgs>;
    drug?: boolean | Prisma.PrescriptionLine$drugArgs<ExtArgs>;
}, ExtArgs["result"]["prescriptionLine"]>;
export type PrescriptionLineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    prescriptionId?: boolean;
    drugId?: boolean;
    activeIngredient?: boolean;
    strength?: boolean;
    dosageForm?: boolean;
    quantity?: boolean;
    qtyDispensed?: boolean;
    drugName?: boolean;
    controlled?: boolean;
    directions?: boolean;
    prescription?: boolean | Prisma.PrescriptionDefaultArgs<ExtArgs>;
    drug?: boolean | Prisma.PrescriptionLine$drugArgs<ExtArgs>;
}, ExtArgs["result"]["prescriptionLine"]>;
export type PrescriptionLineSelectScalar = {
    id?: boolean;
    prescriptionId?: boolean;
    drugId?: boolean;
    activeIngredient?: boolean;
    strength?: boolean;
    dosageForm?: boolean;
    quantity?: boolean;
    qtyDispensed?: boolean;
    drugName?: boolean;
    controlled?: boolean;
    directions?: boolean;
};
export type PrescriptionLineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "prescriptionId" | "drugId" | "activeIngredient" | "strength" | "dosageForm" | "quantity" | "qtyDispensed" | "drugName" | "controlled" | "directions", ExtArgs["result"]["prescriptionLine"]>;
export type PrescriptionLineInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    prescription?: boolean | Prisma.PrescriptionDefaultArgs<ExtArgs>;
    drug?: boolean | Prisma.PrescriptionLine$drugArgs<ExtArgs>;
};
export type PrescriptionLineIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    prescription?: boolean | Prisma.PrescriptionDefaultArgs<ExtArgs>;
    drug?: boolean | Prisma.PrescriptionLine$drugArgs<ExtArgs>;
};
export type PrescriptionLineIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    prescription?: boolean | Prisma.PrescriptionDefaultArgs<ExtArgs>;
    drug?: boolean | Prisma.PrescriptionLine$drugArgs<ExtArgs>;
};
export type $PrescriptionLinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PrescriptionLine";
    objects: {
        prescription: Prisma.$PrescriptionPayload<ExtArgs>;
        drug: Prisma.$DrugPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        prescriptionId: string;
        drugId: string | null;
        activeIngredient: string | null;
        strength: string | null;
        dosageForm: string | null;
        quantity: number;
        qtyDispensed: number;
        drugName: string | null;
        controlled: boolean;
        directions: string | null;
    }, ExtArgs["result"]["prescriptionLine"]>;
    composites: {};
};
export type PrescriptionLineGetPayload<S extends boolean | null | undefined | PrescriptionLineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PrescriptionLinePayload, S>;
export type PrescriptionLineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PrescriptionLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PrescriptionLineCountAggregateInputType | true;
};
export interface PrescriptionLineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PrescriptionLine'];
        meta: {
            name: 'PrescriptionLine';
        };
    };
    findUnique<T extends PrescriptionLineFindUniqueArgs>(args: Prisma.SelectSubset<T, PrescriptionLineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PrescriptionLineClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PrescriptionLineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PrescriptionLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PrescriptionLineClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PrescriptionLineFindFirstArgs>(args?: Prisma.SelectSubset<T, PrescriptionLineFindFirstArgs<ExtArgs>>): Prisma.Prisma__PrescriptionLineClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PrescriptionLineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PrescriptionLineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PrescriptionLineClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PrescriptionLineFindManyArgs>(args?: Prisma.SelectSubset<T, PrescriptionLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PrescriptionLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PrescriptionLineCreateArgs>(args: Prisma.SelectSubset<T, PrescriptionLineCreateArgs<ExtArgs>>): Prisma.Prisma__PrescriptionLineClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PrescriptionLineCreateManyArgs>(args?: Prisma.SelectSubset<T, PrescriptionLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PrescriptionLineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PrescriptionLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PrescriptionLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PrescriptionLineDeleteArgs>(args: Prisma.SelectSubset<T, PrescriptionLineDeleteArgs<ExtArgs>>): Prisma.Prisma__PrescriptionLineClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PrescriptionLineUpdateArgs>(args: Prisma.SelectSubset<T, PrescriptionLineUpdateArgs<ExtArgs>>): Prisma.Prisma__PrescriptionLineClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PrescriptionLineDeleteManyArgs>(args?: Prisma.SelectSubset<T, PrescriptionLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PrescriptionLineUpdateManyArgs>(args: Prisma.SelectSubset<T, PrescriptionLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PrescriptionLineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PrescriptionLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PrescriptionLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PrescriptionLineUpsertArgs>(args: Prisma.SelectSubset<T, PrescriptionLineUpsertArgs<ExtArgs>>): Prisma.Prisma__PrescriptionLineClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PrescriptionLineCountArgs>(args?: Prisma.Subset<T, PrescriptionLineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PrescriptionLineCountAggregateOutputType> : number>;
    aggregate<T extends PrescriptionLineAggregateArgs>(args: Prisma.Subset<T, PrescriptionLineAggregateArgs>): Prisma.PrismaPromise<GetPrescriptionLineAggregateType<T>>;
    groupBy<T extends PrescriptionLineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PrescriptionLineGroupByArgs['orderBy'];
    } : {
        orderBy?: PrescriptionLineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PrescriptionLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPrescriptionLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PrescriptionLineFieldRefs;
}
export interface Prisma__PrescriptionLineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    prescription<T extends Prisma.PrescriptionDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PrescriptionDefaultArgs<ExtArgs>>): Prisma.Prisma__PrescriptionClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    drug<T extends Prisma.PrescriptionLine$drugArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PrescriptionLine$drugArgs<ExtArgs>>): Prisma.Prisma__DrugClient<runtime.Types.Result.GetResult<Prisma.$DrugPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PrescriptionLineFieldRefs {
    readonly id: Prisma.FieldRef<"PrescriptionLine", 'String'>;
    readonly prescriptionId: Prisma.FieldRef<"PrescriptionLine", 'String'>;
    readonly drugId: Prisma.FieldRef<"PrescriptionLine", 'String'>;
    readonly activeIngredient: Prisma.FieldRef<"PrescriptionLine", 'String'>;
    readonly strength: Prisma.FieldRef<"PrescriptionLine", 'String'>;
    readonly dosageForm: Prisma.FieldRef<"PrescriptionLine", 'String'>;
    readonly quantity: Prisma.FieldRef<"PrescriptionLine", 'Int'>;
    readonly qtyDispensed: Prisma.FieldRef<"PrescriptionLine", 'Int'>;
    readonly drugName: Prisma.FieldRef<"PrescriptionLine", 'String'>;
    readonly controlled: Prisma.FieldRef<"PrescriptionLine", 'Boolean'>;
    readonly directions: Prisma.FieldRef<"PrescriptionLine", 'String'>;
}
export type PrescriptionLineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionLineSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionLineOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionLineInclude<ExtArgs> | null;
    where: Prisma.PrescriptionLineWhereUniqueInput;
};
export type PrescriptionLineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionLineSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionLineOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionLineInclude<ExtArgs> | null;
    where: Prisma.PrescriptionLineWhereUniqueInput;
};
export type PrescriptionLineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionLineSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionLineOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionLineInclude<ExtArgs> | null;
    where?: Prisma.PrescriptionLineWhereInput;
    orderBy?: Prisma.PrescriptionLineOrderByWithRelationInput | Prisma.PrescriptionLineOrderByWithRelationInput[];
    cursor?: Prisma.PrescriptionLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PrescriptionLineScalarFieldEnum | Prisma.PrescriptionLineScalarFieldEnum[];
};
export type PrescriptionLineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionLineSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionLineOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionLineInclude<ExtArgs> | null;
    where?: Prisma.PrescriptionLineWhereInput;
    orderBy?: Prisma.PrescriptionLineOrderByWithRelationInput | Prisma.PrescriptionLineOrderByWithRelationInput[];
    cursor?: Prisma.PrescriptionLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PrescriptionLineScalarFieldEnum | Prisma.PrescriptionLineScalarFieldEnum[];
};
export type PrescriptionLineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionLineSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionLineOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionLineInclude<ExtArgs> | null;
    where?: Prisma.PrescriptionLineWhereInput;
    orderBy?: Prisma.PrescriptionLineOrderByWithRelationInput | Prisma.PrescriptionLineOrderByWithRelationInput[];
    cursor?: Prisma.PrescriptionLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PrescriptionLineScalarFieldEnum | Prisma.PrescriptionLineScalarFieldEnum[];
};
export type PrescriptionLineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionLineSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionLineOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PrescriptionLineCreateInput, Prisma.PrescriptionLineUncheckedCreateInput>;
};
export type PrescriptionLineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PrescriptionLineCreateManyInput | Prisma.PrescriptionLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PrescriptionLineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionLineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PrescriptionLineOmit<ExtArgs> | null;
    data: Prisma.PrescriptionLineCreateManyInput | Prisma.PrescriptionLineCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PrescriptionLineIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PrescriptionLineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionLineSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionLineOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PrescriptionLineUpdateInput, Prisma.PrescriptionLineUncheckedUpdateInput>;
    where: Prisma.PrescriptionLineWhereUniqueInput;
};
export type PrescriptionLineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PrescriptionLineUpdateManyMutationInput, Prisma.PrescriptionLineUncheckedUpdateManyInput>;
    where?: Prisma.PrescriptionLineWhereInput;
    limit?: number;
};
export type PrescriptionLineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionLineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PrescriptionLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PrescriptionLineUpdateManyMutationInput, Prisma.PrescriptionLineUncheckedUpdateManyInput>;
    where?: Prisma.PrescriptionLineWhereInput;
    limit?: number;
    include?: Prisma.PrescriptionLineIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PrescriptionLineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionLineSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionLineOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionLineInclude<ExtArgs> | null;
    where: Prisma.PrescriptionLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.PrescriptionLineCreateInput, Prisma.PrescriptionLineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PrescriptionLineUpdateInput, Prisma.PrescriptionLineUncheckedUpdateInput>;
};
export type PrescriptionLineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionLineSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionLineOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionLineInclude<ExtArgs> | null;
    where: Prisma.PrescriptionLineWhereUniqueInput;
};
export type PrescriptionLineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PrescriptionLineWhereInput;
    limit?: number;
};
export type PrescriptionLine$drugArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DrugSelect<ExtArgs> | null;
    omit?: Prisma.DrugOmit<ExtArgs> | null;
    include?: Prisma.DrugInclude<ExtArgs> | null;
    where?: Prisma.DrugWhereInput;
};
export type PrescriptionLineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionLineSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionLineOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionLineInclude<ExtArgs> | null;
};
