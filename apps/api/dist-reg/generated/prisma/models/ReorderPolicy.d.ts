import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ReorderPolicyModel = runtime.Types.Result.DefaultSelection<Prisma.$ReorderPolicyPayload>;
export type AggregateReorderPolicy = {
    _count: ReorderPolicyCountAggregateOutputType | null;
    _avg: ReorderPolicyAvgAggregateOutputType | null;
    _sum: ReorderPolicySumAggregateOutputType | null;
    _min: ReorderPolicyMinAggregateOutputType | null;
    _max: ReorderPolicyMaxAggregateOutputType | null;
};
export type ReorderPolicyAvgAggregateOutputType = {
    minQty: number | null;
    maxQty: number | null;
    leadTimeDays: number | null;
};
export type ReorderPolicySumAggregateOutputType = {
    minQty: number | null;
    maxQty: number | null;
    leadTimeDays: number | null;
};
export type ReorderPolicyMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    drugId: string | null;
    minQty: number | null;
    maxQty: number | null;
    leadTimeDays: number | null;
    supplierId: string | null;
    updatedAt: Date | null;
};
export type ReorderPolicyMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    drugId: string | null;
    minQty: number | null;
    maxQty: number | null;
    leadTimeDays: number | null;
    supplierId: string | null;
    updatedAt: Date | null;
};
export type ReorderPolicyCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    drugId: number;
    minQty: number;
    maxQty: number;
    leadTimeDays: number;
    supplierId: number;
    updatedAt: number;
    _all: number;
};
export type ReorderPolicyAvgAggregateInputType = {
    minQty?: true;
    maxQty?: true;
    leadTimeDays?: true;
};
export type ReorderPolicySumAggregateInputType = {
    minQty?: true;
    maxQty?: true;
    leadTimeDays?: true;
};
export type ReorderPolicyMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    drugId?: true;
    minQty?: true;
    maxQty?: true;
    leadTimeDays?: true;
    supplierId?: true;
    updatedAt?: true;
};
export type ReorderPolicyMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    drugId?: true;
    minQty?: true;
    maxQty?: true;
    leadTimeDays?: true;
    supplierId?: true;
    updatedAt?: true;
};
export type ReorderPolicyCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    drugId?: true;
    minQty?: true;
    maxQty?: true;
    leadTimeDays?: true;
    supplierId?: true;
    updatedAt?: true;
    _all?: true;
};
export type ReorderPolicyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReorderPolicyWhereInput;
    orderBy?: Prisma.ReorderPolicyOrderByWithRelationInput | Prisma.ReorderPolicyOrderByWithRelationInput[];
    cursor?: Prisma.ReorderPolicyWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ReorderPolicyCountAggregateInputType;
    _avg?: ReorderPolicyAvgAggregateInputType;
    _sum?: ReorderPolicySumAggregateInputType;
    _min?: ReorderPolicyMinAggregateInputType;
    _max?: ReorderPolicyMaxAggregateInputType;
};
export type GetReorderPolicyAggregateType<T extends ReorderPolicyAggregateArgs> = {
    [P in keyof T & keyof AggregateReorderPolicy]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReorderPolicy[P]> : Prisma.GetScalarType<T[P], AggregateReorderPolicy[P]>;
};
export type ReorderPolicyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReorderPolicyWhereInput;
    orderBy?: Prisma.ReorderPolicyOrderByWithAggregationInput | Prisma.ReorderPolicyOrderByWithAggregationInput[];
    by: Prisma.ReorderPolicyScalarFieldEnum[] | Prisma.ReorderPolicyScalarFieldEnum;
    having?: Prisma.ReorderPolicyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReorderPolicyCountAggregateInputType | true;
    _avg?: ReorderPolicyAvgAggregateInputType;
    _sum?: ReorderPolicySumAggregateInputType;
    _min?: ReorderPolicyMinAggregateInputType;
    _max?: ReorderPolicyMaxAggregateInputType;
};
export type ReorderPolicyGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    drugId: string;
    minQty: number;
    maxQty: number;
    leadTimeDays: number;
    supplierId: string | null;
    updatedAt: Date;
    _count: ReorderPolicyCountAggregateOutputType | null;
    _avg: ReorderPolicyAvgAggregateOutputType | null;
    _sum: ReorderPolicySumAggregateOutputType | null;
    _min: ReorderPolicyMinAggregateOutputType | null;
    _max: ReorderPolicyMaxAggregateOutputType | null;
};
export type GetReorderPolicyGroupByPayload<T extends ReorderPolicyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReorderPolicyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReorderPolicyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReorderPolicyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReorderPolicyGroupByOutputType[P]>;
}>>;
export type ReorderPolicyWhereInput = {
    AND?: Prisma.ReorderPolicyWhereInput | Prisma.ReorderPolicyWhereInput[];
    OR?: Prisma.ReorderPolicyWhereInput[];
    NOT?: Prisma.ReorderPolicyWhereInput | Prisma.ReorderPolicyWhereInput[];
    id?: Prisma.StringFilter<"ReorderPolicy"> | string;
    orgId?: Prisma.StringFilter<"ReorderPolicy"> | string;
    branchId?: Prisma.StringFilter<"ReorderPolicy"> | string;
    drugId?: Prisma.StringFilter<"ReorderPolicy"> | string;
    minQty?: Prisma.IntFilter<"ReorderPolicy"> | number;
    maxQty?: Prisma.IntFilter<"ReorderPolicy"> | number;
    leadTimeDays?: Prisma.IntFilter<"ReorderPolicy"> | number;
    supplierId?: Prisma.StringNullableFilter<"ReorderPolicy"> | string | null;
    updatedAt?: Prisma.DateTimeFilter<"ReorderPolicy"> | Date | string;
    drug?: Prisma.XOR<Prisma.DrugScalarRelationFilter, Prisma.DrugWhereInput>;
};
export type ReorderPolicyOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    minQty?: Prisma.SortOrder;
    maxQty?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    drug?: Prisma.DrugOrderByWithRelationInput;
};
export type ReorderPolicyWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    branchId_drugId?: Prisma.ReorderPolicyBranchIdDrugIdCompoundUniqueInput;
    AND?: Prisma.ReorderPolicyWhereInput | Prisma.ReorderPolicyWhereInput[];
    OR?: Prisma.ReorderPolicyWhereInput[];
    NOT?: Prisma.ReorderPolicyWhereInput | Prisma.ReorderPolicyWhereInput[];
    orgId?: Prisma.StringFilter<"ReorderPolicy"> | string;
    branchId?: Prisma.StringFilter<"ReorderPolicy"> | string;
    drugId?: Prisma.StringFilter<"ReorderPolicy"> | string;
    minQty?: Prisma.IntFilter<"ReorderPolicy"> | number;
    maxQty?: Prisma.IntFilter<"ReorderPolicy"> | number;
    leadTimeDays?: Prisma.IntFilter<"ReorderPolicy"> | number;
    supplierId?: Prisma.StringNullableFilter<"ReorderPolicy"> | string | null;
    updatedAt?: Prisma.DateTimeFilter<"ReorderPolicy"> | Date | string;
    drug?: Prisma.XOR<Prisma.DrugScalarRelationFilter, Prisma.DrugWhereInput>;
}, "id" | "branchId_drugId">;
export type ReorderPolicyOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    minQty?: Prisma.SortOrder;
    maxQty?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ReorderPolicyCountOrderByAggregateInput;
    _avg?: Prisma.ReorderPolicyAvgOrderByAggregateInput;
    _max?: Prisma.ReorderPolicyMaxOrderByAggregateInput;
    _min?: Prisma.ReorderPolicyMinOrderByAggregateInput;
    _sum?: Prisma.ReorderPolicySumOrderByAggregateInput;
};
export type ReorderPolicyScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReorderPolicyScalarWhereWithAggregatesInput | Prisma.ReorderPolicyScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReorderPolicyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReorderPolicyScalarWhereWithAggregatesInput | Prisma.ReorderPolicyScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ReorderPolicy"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"ReorderPolicy"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"ReorderPolicy"> | string;
    drugId?: Prisma.StringWithAggregatesFilter<"ReorderPolicy"> | string;
    minQty?: Prisma.IntWithAggregatesFilter<"ReorderPolicy"> | number;
    maxQty?: Prisma.IntWithAggregatesFilter<"ReorderPolicy"> | number;
    leadTimeDays?: Prisma.IntWithAggregatesFilter<"ReorderPolicy"> | number;
    supplierId?: Prisma.StringNullableWithAggregatesFilter<"ReorderPolicy"> | string | null;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"ReorderPolicy"> | Date | string;
};
export type ReorderPolicyCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    minQty: number;
    maxQty: number;
    leadTimeDays?: number;
    supplierId?: string | null;
    updatedAt?: Date | string;
    drug: Prisma.DrugCreateNestedOneWithoutReorderPoliciesInput;
};
export type ReorderPolicyUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    drugId: string;
    minQty: number;
    maxQty: number;
    leadTimeDays?: number;
    supplierId?: string | null;
    updatedAt?: Date | string;
};
export type ReorderPolicyUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    minQty?: Prisma.IntFieldUpdateOperationsInput | number;
    maxQty?: Prisma.IntFieldUpdateOperationsInput | number;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    supplierId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    drug?: Prisma.DrugUpdateOneRequiredWithoutReorderPoliciesNestedInput;
};
export type ReorderPolicyUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    minQty?: Prisma.IntFieldUpdateOperationsInput | number;
    maxQty?: Prisma.IntFieldUpdateOperationsInput | number;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    supplierId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReorderPolicyCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    drugId: string;
    minQty: number;
    maxQty: number;
    leadTimeDays?: number;
    supplierId?: string | null;
    updatedAt?: Date | string;
};
export type ReorderPolicyUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    minQty?: Prisma.IntFieldUpdateOperationsInput | number;
    maxQty?: Prisma.IntFieldUpdateOperationsInput | number;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    supplierId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReorderPolicyUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    minQty?: Prisma.IntFieldUpdateOperationsInput | number;
    maxQty?: Prisma.IntFieldUpdateOperationsInput | number;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    supplierId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReorderPolicyListRelationFilter = {
    every?: Prisma.ReorderPolicyWhereInput;
    some?: Prisma.ReorderPolicyWhereInput;
    none?: Prisma.ReorderPolicyWhereInput;
};
export type ReorderPolicyOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ReorderPolicyBranchIdDrugIdCompoundUniqueInput = {
    branchId: string;
    drugId: string;
};
export type ReorderPolicyCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    minQty?: Prisma.SortOrder;
    maxQty?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReorderPolicyAvgOrderByAggregateInput = {
    minQty?: Prisma.SortOrder;
    maxQty?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
};
export type ReorderPolicyMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    minQty?: Prisma.SortOrder;
    maxQty?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReorderPolicyMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    minQty?: Prisma.SortOrder;
    maxQty?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReorderPolicySumOrderByAggregateInput = {
    minQty?: Prisma.SortOrder;
    maxQty?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
};
export type ReorderPolicyCreateNestedManyWithoutDrugInput = {
    create?: Prisma.XOR<Prisma.ReorderPolicyCreateWithoutDrugInput, Prisma.ReorderPolicyUncheckedCreateWithoutDrugInput> | Prisma.ReorderPolicyCreateWithoutDrugInput[] | Prisma.ReorderPolicyUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.ReorderPolicyCreateOrConnectWithoutDrugInput | Prisma.ReorderPolicyCreateOrConnectWithoutDrugInput[];
    createMany?: Prisma.ReorderPolicyCreateManyDrugInputEnvelope;
    connect?: Prisma.ReorderPolicyWhereUniqueInput | Prisma.ReorderPolicyWhereUniqueInput[];
};
export type ReorderPolicyUncheckedCreateNestedManyWithoutDrugInput = {
    create?: Prisma.XOR<Prisma.ReorderPolicyCreateWithoutDrugInput, Prisma.ReorderPolicyUncheckedCreateWithoutDrugInput> | Prisma.ReorderPolicyCreateWithoutDrugInput[] | Prisma.ReorderPolicyUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.ReorderPolicyCreateOrConnectWithoutDrugInput | Prisma.ReorderPolicyCreateOrConnectWithoutDrugInput[];
    createMany?: Prisma.ReorderPolicyCreateManyDrugInputEnvelope;
    connect?: Prisma.ReorderPolicyWhereUniqueInput | Prisma.ReorderPolicyWhereUniqueInput[];
};
export type ReorderPolicyUpdateManyWithoutDrugNestedInput = {
    create?: Prisma.XOR<Prisma.ReorderPolicyCreateWithoutDrugInput, Prisma.ReorderPolicyUncheckedCreateWithoutDrugInput> | Prisma.ReorderPolicyCreateWithoutDrugInput[] | Prisma.ReorderPolicyUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.ReorderPolicyCreateOrConnectWithoutDrugInput | Prisma.ReorderPolicyCreateOrConnectWithoutDrugInput[];
    upsert?: Prisma.ReorderPolicyUpsertWithWhereUniqueWithoutDrugInput | Prisma.ReorderPolicyUpsertWithWhereUniqueWithoutDrugInput[];
    createMany?: Prisma.ReorderPolicyCreateManyDrugInputEnvelope;
    set?: Prisma.ReorderPolicyWhereUniqueInput | Prisma.ReorderPolicyWhereUniqueInput[];
    disconnect?: Prisma.ReorderPolicyWhereUniqueInput | Prisma.ReorderPolicyWhereUniqueInput[];
    delete?: Prisma.ReorderPolicyWhereUniqueInput | Prisma.ReorderPolicyWhereUniqueInput[];
    connect?: Prisma.ReorderPolicyWhereUniqueInput | Prisma.ReorderPolicyWhereUniqueInput[];
    update?: Prisma.ReorderPolicyUpdateWithWhereUniqueWithoutDrugInput | Prisma.ReorderPolicyUpdateWithWhereUniqueWithoutDrugInput[];
    updateMany?: Prisma.ReorderPolicyUpdateManyWithWhereWithoutDrugInput | Prisma.ReorderPolicyUpdateManyWithWhereWithoutDrugInput[];
    deleteMany?: Prisma.ReorderPolicyScalarWhereInput | Prisma.ReorderPolicyScalarWhereInput[];
};
export type ReorderPolicyUncheckedUpdateManyWithoutDrugNestedInput = {
    create?: Prisma.XOR<Prisma.ReorderPolicyCreateWithoutDrugInput, Prisma.ReorderPolicyUncheckedCreateWithoutDrugInput> | Prisma.ReorderPolicyCreateWithoutDrugInput[] | Prisma.ReorderPolicyUncheckedCreateWithoutDrugInput[];
    connectOrCreate?: Prisma.ReorderPolicyCreateOrConnectWithoutDrugInput | Prisma.ReorderPolicyCreateOrConnectWithoutDrugInput[];
    upsert?: Prisma.ReorderPolicyUpsertWithWhereUniqueWithoutDrugInput | Prisma.ReorderPolicyUpsertWithWhereUniqueWithoutDrugInput[];
    createMany?: Prisma.ReorderPolicyCreateManyDrugInputEnvelope;
    set?: Prisma.ReorderPolicyWhereUniqueInput | Prisma.ReorderPolicyWhereUniqueInput[];
    disconnect?: Prisma.ReorderPolicyWhereUniqueInput | Prisma.ReorderPolicyWhereUniqueInput[];
    delete?: Prisma.ReorderPolicyWhereUniqueInput | Prisma.ReorderPolicyWhereUniqueInput[];
    connect?: Prisma.ReorderPolicyWhereUniqueInput | Prisma.ReorderPolicyWhereUniqueInput[];
    update?: Prisma.ReorderPolicyUpdateWithWhereUniqueWithoutDrugInput | Prisma.ReorderPolicyUpdateWithWhereUniqueWithoutDrugInput[];
    updateMany?: Prisma.ReorderPolicyUpdateManyWithWhereWithoutDrugInput | Prisma.ReorderPolicyUpdateManyWithWhereWithoutDrugInput[];
    deleteMany?: Prisma.ReorderPolicyScalarWhereInput | Prisma.ReorderPolicyScalarWhereInput[];
};
export type ReorderPolicyCreateWithoutDrugInput = {
    id?: string;
    orgId: string;
    branchId: string;
    minQty: number;
    maxQty: number;
    leadTimeDays?: number;
    supplierId?: string | null;
    updatedAt?: Date | string;
};
export type ReorderPolicyUncheckedCreateWithoutDrugInput = {
    id?: string;
    orgId: string;
    branchId: string;
    minQty: number;
    maxQty: number;
    leadTimeDays?: number;
    supplierId?: string | null;
    updatedAt?: Date | string;
};
export type ReorderPolicyCreateOrConnectWithoutDrugInput = {
    where: Prisma.ReorderPolicyWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReorderPolicyCreateWithoutDrugInput, Prisma.ReorderPolicyUncheckedCreateWithoutDrugInput>;
};
export type ReorderPolicyCreateManyDrugInputEnvelope = {
    data: Prisma.ReorderPolicyCreateManyDrugInput | Prisma.ReorderPolicyCreateManyDrugInput[];
    skipDuplicates?: boolean;
};
export type ReorderPolicyUpsertWithWhereUniqueWithoutDrugInput = {
    where: Prisma.ReorderPolicyWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReorderPolicyUpdateWithoutDrugInput, Prisma.ReorderPolicyUncheckedUpdateWithoutDrugInput>;
    create: Prisma.XOR<Prisma.ReorderPolicyCreateWithoutDrugInput, Prisma.ReorderPolicyUncheckedCreateWithoutDrugInput>;
};
export type ReorderPolicyUpdateWithWhereUniqueWithoutDrugInput = {
    where: Prisma.ReorderPolicyWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReorderPolicyUpdateWithoutDrugInput, Prisma.ReorderPolicyUncheckedUpdateWithoutDrugInput>;
};
export type ReorderPolicyUpdateManyWithWhereWithoutDrugInput = {
    where: Prisma.ReorderPolicyScalarWhereInput;
    data: Prisma.XOR<Prisma.ReorderPolicyUpdateManyMutationInput, Prisma.ReorderPolicyUncheckedUpdateManyWithoutDrugInput>;
};
export type ReorderPolicyScalarWhereInput = {
    AND?: Prisma.ReorderPolicyScalarWhereInput | Prisma.ReorderPolicyScalarWhereInput[];
    OR?: Prisma.ReorderPolicyScalarWhereInput[];
    NOT?: Prisma.ReorderPolicyScalarWhereInput | Prisma.ReorderPolicyScalarWhereInput[];
    id?: Prisma.StringFilter<"ReorderPolicy"> | string;
    orgId?: Prisma.StringFilter<"ReorderPolicy"> | string;
    branchId?: Prisma.StringFilter<"ReorderPolicy"> | string;
    drugId?: Prisma.StringFilter<"ReorderPolicy"> | string;
    minQty?: Prisma.IntFilter<"ReorderPolicy"> | number;
    maxQty?: Prisma.IntFilter<"ReorderPolicy"> | number;
    leadTimeDays?: Prisma.IntFilter<"ReorderPolicy"> | number;
    supplierId?: Prisma.StringNullableFilter<"ReorderPolicy"> | string | null;
    updatedAt?: Prisma.DateTimeFilter<"ReorderPolicy"> | Date | string;
};
export type ReorderPolicyCreateManyDrugInput = {
    id?: string;
    orgId: string;
    branchId: string;
    minQty: number;
    maxQty: number;
    leadTimeDays?: number;
    supplierId?: string | null;
    updatedAt?: Date | string;
};
export type ReorderPolicyUpdateWithoutDrugInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    minQty?: Prisma.IntFieldUpdateOperationsInput | number;
    maxQty?: Prisma.IntFieldUpdateOperationsInput | number;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    supplierId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReorderPolicyUncheckedUpdateWithoutDrugInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    minQty?: Prisma.IntFieldUpdateOperationsInput | number;
    maxQty?: Prisma.IntFieldUpdateOperationsInput | number;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    supplierId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReorderPolicyUncheckedUpdateManyWithoutDrugInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    minQty?: Prisma.IntFieldUpdateOperationsInput | number;
    maxQty?: Prisma.IntFieldUpdateOperationsInput | number;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    supplierId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReorderPolicySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    drugId?: boolean;
    minQty?: boolean;
    maxQty?: boolean;
    leadTimeDays?: boolean;
    supplierId?: boolean;
    updatedAt?: boolean;
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reorderPolicy"]>;
export type ReorderPolicySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    drugId?: boolean;
    minQty?: boolean;
    maxQty?: boolean;
    leadTimeDays?: boolean;
    supplierId?: boolean;
    updatedAt?: boolean;
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reorderPolicy"]>;
export type ReorderPolicySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    drugId?: boolean;
    minQty?: boolean;
    maxQty?: boolean;
    leadTimeDays?: boolean;
    supplierId?: boolean;
    updatedAt?: boolean;
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reorderPolicy"]>;
export type ReorderPolicySelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    drugId?: boolean;
    minQty?: boolean;
    maxQty?: boolean;
    leadTimeDays?: boolean;
    supplierId?: boolean;
    updatedAt?: boolean;
};
export type ReorderPolicyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "drugId" | "minQty" | "maxQty" | "leadTimeDays" | "supplierId" | "updatedAt", ExtArgs["result"]["reorderPolicy"]>;
export type ReorderPolicyInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
};
export type ReorderPolicyIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
};
export type ReorderPolicyIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drug?: boolean | Prisma.DrugDefaultArgs<ExtArgs>;
};
export type $ReorderPolicyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ReorderPolicy";
    objects: {
        drug: Prisma.$DrugPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        drugId: string;
        minQty: number;
        maxQty: number;
        leadTimeDays: number;
        supplierId: string | null;
        updatedAt: Date;
    }, ExtArgs["result"]["reorderPolicy"]>;
    composites: {};
};
export type ReorderPolicyGetPayload<S extends boolean | null | undefined | ReorderPolicyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReorderPolicyPayload, S>;
export type ReorderPolicyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReorderPolicyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReorderPolicyCountAggregateInputType | true;
};
export interface ReorderPolicyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ReorderPolicy'];
        meta: {
            name: 'ReorderPolicy';
        };
    };
    findUnique<T extends ReorderPolicyFindUniqueArgs>(args: Prisma.SelectSubset<T, ReorderPolicyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReorderPolicyClient<runtime.Types.Result.GetResult<Prisma.$ReorderPolicyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ReorderPolicyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReorderPolicyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReorderPolicyClient<runtime.Types.Result.GetResult<Prisma.$ReorderPolicyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ReorderPolicyFindFirstArgs>(args?: Prisma.SelectSubset<T, ReorderPolicyFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReorderPolicyClient<runtime.Types.Result.GetResult<Prisma.$ReorderPolicyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ReorderPolicyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReorderPolicyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReorderPolicyClient<runtime.Types.Result.GetResult<Prisma.$ReorderPolicyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ReorderPolicyFindManyArgs>(args?: Prisma.SelectSubset<T, ReorderPolicyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReorderPolicyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ReorderPolicyCreateArgs>(args: Prisma.SelectSubset<T, ReorderPolicyCreateArgs<ExtArgs>>): Prisma.Prisma__ReorderPolicyClient<runtime.Types.Result.GetResult<Prisma.$ReorderPolicyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ReorderPolicyCreateManyArgs>(args?: Prisma.SelectSubset<T, ReorderPolicyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ReorderPolicyCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReorderPolicyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReorderPolicyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ReorderPolicyDeleteArgs>(args: Prisma.SelectSubset<T, ReorderPolicyDeleteArgs<ExtArgs>>): Prisma.Prisma__ReorderPolicyClient<runtime.Types.Result.GetResult<Prisma.$ReorderPolicyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ReorderPolicyUpdateArgs>(args: Prisma.SelectSubset<T, ReorderPolicyUpdateArgs<ExtArgs>>): Prisma.Prisma__ReorderPolicyClient<runtime.Types.Result.GetResult<Prisma.$ReorderPolicyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ReorderPolicyDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReorderPolicyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ReorderPolicyUpdateManyArgs>(args: Prisma.SelectSubset<T, ReorderPolicyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ReorderPolicyUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReorderPolicyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReorderPolicyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ReorderPolicyUpsertArgs>(args: Prisma.SelectSubset<T, ReorderPolicyUpsertArgs<ExtArgs>>): Prisma.Prisma__ReorderPolicyClient<runtime.Types.Result.GetResult<Prisma.$ReorderPolicyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ReorderPolicyCountArgs>(args?: Prisma.Subset<T, ReorderPolicyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReorderPolicyCountAggregateOutputType> : number>;
    aggregate<T extends ReorderPolicyAggregateArgs>(args: Prisma.Subset<T, ReorderPolicyAggregateArgs>): Prisma.PrismaPromise<GetReorderPolicyAggregateType<T>>;
    groupBy<T extends ReorderPolicyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReorderPolicyGroupByArgs['orderBy'];
    } : {
        orderBy?: ReorderPolicyGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReorderPolicyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReorderPolicyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ReorderPolicyFieldRefs;
}
export interface Prisma__ReorderPolicyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    drug<T extends Prisma.DrugDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DrugDefaultArgs<ExtArgs>>): Prisma.Prisma__DrugClient<runtime.Types.Result.GetResult<Prisma.$DrugPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ReorderPolicyFieldRefs {
    readonly id: Prisma.FieldRef<"ReorderPolicy", 'String'>;
    readonly orgId: Prisma.FieldRef<"ReorderPolicy", 'String'>;
    readonly branchId: Prisma.FieldRef<"ReorderPolicy", 'String'>;
    readonly drugId: Prisma.FieldRef<"ReorderPolicy", 'String'>;
    readonly minQty: Prisma.FieldRef<"ReorderPolicy", 'Int'>;
    readonly maxQty: Prisma.FieldRef<"ReorderPolicy", 'Int'>;
    readonly leadTimeDays: Prisma.FieldRef<"ReorderPolicy", 'Int'>;
    readonly supplierId: Prisma.FieldRef<"ReorderPolicy", 'String'>;
    readonly updatedAt: Prisma.FieldRef<"ReorderPolicy", 'DateTime'>;
}
export type ReorderPolicyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReorderPolicySelect<ExtArgs> | null;
    omit?: Prisma.ReorderPolicyOmit<ExtArgs> | null;
    include?: Prisma.ReorderPolicyInclude<ExtArgs> | null;
    where: Prisma.ReorderPolicyWhereUniqueInput;
};
export type ReorderPolicyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReorderPolicySelect<ExtArgs> | null;
    omit?: Prisma.ReorderPolicyOmit<ExtArgs> | null;
    include?: Prisma.ReorderPolicyInclude<ExtArgs> | null;
    where: Prisma.ReorderPolicyWhereUniqueInput;
};
export type ReorderPolicyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReorderPolicySelect<ExtArgs> | null;
    omit?: Prisma.ReorderPolicyOmit<ExtArgs> | null;
    include?: Prisma.ReorderPolicyInclude<ExtArgs> | null;
    where?: Prisma.ReorderPolicyWhereInput;
    orderBy?: Prisma.ReorderPolicyOrderByWithRelationInput | Prisma.ReorderPolicyOrderByWithRelationInput[];
    cursor?: Prisma.ReorderPolicyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReorderPolicyScalarFieldEnum | Prisma.ReorderPolicyScalarFieldEnum[];
};
export type ReorderPolicyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReorderPolicySelect<ExtArgs> | null;
    omit?: Prisma.ReorderPolicyOmit<ExtArgs> | null;
    include?: Prisma.ReorderPolicyInclude<ExtArgs> | null;
    where?: Prisma.ReorderPolicyWhereInput;
    orderBy?: Prisma.ReorderPolicyOrderByWithRelationInput | Prisma.ReorderPolicyOrderByWithRelationInput[];
    cursor?: Prisma.ReorderPolicyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReorderPolicyScalarFieldEnum | Prisma.ReorderPolicyScalarFieldEnum[];
};
export type ReorderPolicyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReorderPolicySelect<ExtArgs> | null;
    omit?: Prisma.ReorderPolicyOmit<ExtArgs> | null;
    include?: Prisma.ReorderPolicyInclude<ExtArgs> | null;
    where?: Prisma.ReorderPolicyWhereInput;
    orderBy?: Prisma.ReorderPolicyOrderByWithRelationInput | Prisma.ReorderPolicyOrderByWithRelationInput[];
    cursor?: Prisma.ReorderPolicyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReorderPolicyScalarFieldEnum | Prisma.ReorderPolicyScalarFieldEnum[];
};
export type ReorderPolicyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReorderPolicySelect<ExtArgs> | null;
    omit?: Prisma.ReorderPolicyOmit<ExtArgs> | null;
    include?: Prisma.ReorderPolicyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReorderPolicyCreateInput, Prisma.ReorderPolicyUncheckedCreateInput>;
};
export type ReorderPolicyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ReorderPolicyCreateManyInput | Prisma.ReorderPolicyCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReorderPolicyCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReorderPolicySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReorderPolicyOmit<ExtArgs> | null;
    data: Prisma.ReorderPolicyCreateManyInput | Prisma.ReorderPolicyCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ReorderPolicyIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ReorderPolicyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReorderPolicySelect<ExtArgs> | null;
    omit?: Prisma.ReorderPolicyOmit<ExtArgs> | null;
    include?: Prisma.ReorderPolicyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReorderPolicyUpdateInput, Prisma.ReorderPolicyUncheckedUpdateInput>;
    where: Prisma.ReorderPolicyWhereUniqueInput;
};
export type ReorderPolicyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ReorderPolicyUpdateManyMutationInput, Prisma.ReorderPolicyUncheckedUpdateManyInput>;
    where?: Prisma.ReorderPolicyWhereInput;
    limit?: number;
};
export type ReorderPolicyUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReorderPolicySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReorderPolicyOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReorderPolicyUpdateManyMutationInput, Prisma.ReorderPolicyUncheckedUpdateManyInput>;
    where?: Prisma.ReorderPolicyWhereInput;
    limit?: number;
    include?: Prisma.ReorderPolicyIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ReorderPolicyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReorderPolicySelect<ExtArgs> | null;
    omit?: Prisma.ReorderPolicyOmit<ExtArgs> | null;
    include?: Prisma.ReorderPolicyInclude<ExtArgs> | null;
    where: Prisma.ReorderPolicyWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReorderPolicyCreateInput, Prisma.ReorderPolicyUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ReorderPolicyUpdateInput, Prisma.ReorderPolicyUncheckedUpdateInput>;
};
export type ReorderPolicyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReorderPolicySelect<ExtArgs> | null;
    omit?: Prisma.ReorderPolicyOmit<ExtArgs> | null;
    include?: Prisma.ReorderPolicyInclude<ExtArgs> | null;
    where: Prisma.ReorderPolicyWhereUniqueInput;
};
export type ReorderPolicyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReorderPolicyWhereInput;
    limit?: number;
};
export type ReorderPolicyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReorderPolicySelect<ExtArgs> | null;
    omit?: Prisma.ReorderPolicyOmit<ExtArgs> | null;
    include?: Prisma.ReorderPolicyInclude<ExtArgs> | null;
};
