import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ControlledDiscrepancyModel = runtime.Types.Result.DefaultSelection<Prisma.$ControlledDiscrepancyPayload>;
export type AggregateControlledDiscrepancy = {
    _count: ControlledDiscrepancyCountAggregateOutputType | null;
    _avg: ControlledDiscrepancyAvgAggregateOutputType | null;
    _sum: ControlledDiscrepancySumAggregateOutputType | null;
    _min: ControlledDiscrepancyMinAggregateOutputType | null;
    _max: ControlledDiscrepancyMaxAggregateOutputType | null;
};
export type ControlledDiscrepancyAvgAggregateOutputType = {
    expectedQty: number | null;
    countedQty: number | null;
    difference: number | null;
};
export type ControlledDiscrepancySumAggregateOutputType = {
    expectedQty: number | null;
    countedQty: number | null;
    difference: number | null;
};
export type ControlledDiscrepancyMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    drugId: string | null;
    expectedQty: number | null;
    countedQty: number | null;
    difference: number | null;
    status: string | null;
    notes: string | null;
    reportedBy: string | null;
    witnessId: string | null;
    resolvedBy: string | null;
    resolution: string | null;
    resolvedAt: Date | null;
    createdAt: Date | null;
};
export type ControlledDiscrepancyMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    drugId: string | null;
    expectedQty: number | null;
    countedQty: number | null;
    difference: number | null;
    status: string | null;
    notes: string | null;
    reportedBy: string | null;
    witnessId: string | null;
    resolvedBy: string | null;
    resolution: string | null;
    resolvedAt: Date | null;
    createdAt: Date | null;
};
export type ControlledDiscrepancyCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    drugId: number;
    expectedQty: number;
    countedQty: number;
    difference: number;
    status: number;
    notes: number;
    reportedBy: number;
    witnessId: number;
    resolvedBy: number;
    resolution: number;
    resolvedAt: number;
    createdAt: number;
    _all: number;
};
export type ControlledDiscrepancyAvgAggregateInputType = {
    expectedQty?: true;
    countedQty?: true;
    difference?: true;
};
export type ControlledDiscrepancySumAggregateInputType = {
    expectedQty?: true;
    countedQty?: true;
    difference?: true;
};
export type ControlledDiscrepancyMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    drugId?: true;
    expectedQty?: true;
    countedQty?: true;
    difference?: true;
    status?: true;
    notes?: true;
    reportedBy?: true;
    witnessId?: true;
    resolvedBy?: true;
    resolution?: true;
    resolvedAt?: true;
    createdAt?: true;
};
export type ControlledDiscrepancyMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    drugId?: true;
    expectedQty?: true;
    countedQty?: true;
    difference?: true;
    status?: true;
    notes?: true;
    reportedBy?: true;
    witnessId?: true;
    resolvedBy?: true;
    resolution?: true;
    resolvedAt?: true;
    createdAt?: true;
};
export type ControlledDiscrepancyCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    drugId?: true;
    expectedQty?: true;
    countedQty?: true;
    difference?: true;
    status?: true;
    notes?: true;
    reportedBy?: true;
    witnessId?: true;
    resolvedBy?: true;
    resolution?: true;
    resolvedAt?: true;
    createdAt?: true;
    _all?: true;
};
export type ControlledDiscrepancyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ControlledDiscrepancyWhereInput;
    orderBy?: Prisma.ControlledDiscrepancyOrderByWithRelationInput | Prisma.ControlledDiscrepancyOrderByWithRelationInput[];
    cursor?: Prisma.ControlledDiscrepancyWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ControlledDiscrepancyCountAggregateInputType;
    _avg?: ControlledDiscrepancyAvgAggregateInputType;
    _sum?: ControlledDiscrepancySumAggregateInputType;
    _min?: ControlledDiscrepancyMinAggregateInputType;
    _max?: ControlledDiscrepancyMaxAggregateInputType;
};
export type GetControlledDiscrepancyAggregateType<T extends ControlledDiscrepancyAggregateArgs> = {
    [P in keyof T & keyof AggregateControlledDiscrepancy]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateControlledDiscrepancy[P]> : Prisma.GetScalarType<T[P], AggregateControlledDiscrepancy[P]>;
};
export type ControlledDiscrepancyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ControlledDiscrepancyWhereInput;
    orderBy?: Prisma.ControlledDiscrepancyOrderByWithAggregationInput | Prisma.ControlledDiscrepancyOrderByWithAggregationInput[];
    by: Prisma.ControlledDiscrepancyScalarFieldEnum[] | Prisma.ControlledDiscrepancyScalarFieldEnum;
    having?: Prisma.ControlledDiscrepancyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ControlledDiscrepancyCountAggregateInputType | true;
    _avg?: ControlledDiscrepancyAvgAggregateInputType;
    _sum?: ControlledDiscrepancySumAggregateInputType;
    _min?: ControlledDiscrepancyMinAggregateInputType;
    _max?: ControlledDiscrepancyMaxAggregateInputType;
};
export type ControlledDiscrepancyGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    drugId: string;
    expectedQty: number;
    countedQty: number;
    difference: number;
    status: string;
    notes: string | null;
    reportedBy: string;
    witnessId: string | null;
    resolvedBy: string | null;
    resolution: string | null;
    resolvedAt: Date | null;
    createdAt: Date;
    _count: ControlledDiscrepancyCountAggregateOutputType | null;
    _avg: ControlledDiscrepancyAvgAggregateOutputType | null;
    _sum: ControlledDiscrepancySumAggregateOutputType | null;
    _min: ControlledDiscrepancyMinAggregateOutputType | null;
    _max: ControlledDiscrepancyMaxAggregateOutputType | null;
};
export type GetControlledDiscrepancyGroupByPayload<T extends ControlledDiscrepancyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ControlledDiscrepancyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ControlledDiscrepancyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ControlledDiscrepancyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ControlledDiscrepancyGroupByOutputType[P]>;
}>>;
export type ControlledDiscrepancyWhereInput = {
    AND?: Prisma.ControlledDiscrepancyWhereInput | Prisma.ControlledDiscrepancyWhereInput[];
    OR?: Prisma.ControlledDiscrepancyWhereInput[];
    NOT?: Prisma.ControlledDiscrepancyWhereInput | Prisma.ControlledDiscrepancyWhereInput[];
    id?: Prisma.StringFilter<"ControlledDiscrepancy"> | string;
    orgId?: Prisma.StringFilter<"ControlledDiscrepancy"> | string;
    branchId?: Prisma.StringFilter<"ControlledDiscrepancy"> | string;
    drugId?: Prisma.StringFilter<"ControlledDiscrepancy"> | string;
    expectedQty?: Prisma.IntFilter<"ControlledDiscrepancy"> | number;
    countedQty?: Prisma.IntFilter<"ControlledDiscrepancy"> | number;
    difference?: Prisma.IntFilter<"ControlledDiscrepancy"> | number;
    status?: Prisma.StringFilter<"ControlledDiscrepancy"> | string;
    notes?: Prisma.StringNullableFilter<"ControlledDiscrepancy"> | string | null;
    reportedBy?: Prisma.StringFilter<"ControlledDiscrepancy"> | string;
    witnessId?: Prisma.StringNullableFilter<"ControlledDiscrepancy"> | string | null;
    resolvedBy?: Prisma.StringNullableFilter<"ControlledDiscrepancy"> | string | null;
    resolution?: Prisma.StringNullableFilter<"ControlledDiscrepancy"> | string | null;
    resolvedAt?: Prisma.DateTimeNullableFilter<"ControlledDiscrepancy"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"ControlledDiscrepancy"> | Date | string;
};
export type ControlledDiscrepancyOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    expectedQty?: Prisma.SortOrder;
    countedQty?: Prisma.SortOrder;
    difference?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    reportedBy?: Prisma.SortOrder;
    witnessId?: Prisma.SortOrderInput | Prisma.SortOrder;
    resolvedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    resolution?: Prisma.SortOrderInput | Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ControlledDiscrepancyWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ControlledDiscrepancyWhereInput | Prisma.ControlledDiscrepancyWhereInput[];
    OR?: Prisma.ControlledDiscrepancyWhereInput[];
    NOT?: Prisma.ControlledDiscrepancyWhereInput | Prisma.ControlledDiscrepancyWhereInput[];
    orgId?: Prisma.StringFilter<"ControlledDiscrepancy"> | string;
    branchId?: Prisma.StringFilter<"ControlledDiscrepancy"> | string;
    drugId?: Prisma.StringFilter<"ControlledDiscrepancy"> | string;
    expectedQty?: Prisma.IntFilter<"ControlledDiscrepancy"> | number;
    countedQty?: Prisma.IntFilter<"ControlledDiscrepancy"> | number;
    difference?: Prisma.IntFilter<"ControlledDiscrepancy"> | number;
    status?: Prisma.StringFilter<"ControlledDiscrepancy"> | string;
    notes?: Prisma.StringNullableFilter<"ControlledDiscrepancy"> | string | null;
    reportedBy?: Prisma.StringFilter<"ControlledDiscrepancy"> | string;
    witnessId?: Prisma.StringNullableFilter<"ControlledDiscrepancy"> | string | null;
    resolvedBy?: Prisma.StringNullableFilter<"ControlledDiscrepancy"> | string | null;
    resolution?: Prisma.StringNullableFilter<"ControlledDiscrepancy"> | string | null;
    resolvedAt?: Prisma.DateTimeNullableFilter<"ControlledDiscrepancy"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"ControlledDiscrepancy"> | Date | string;
}, "id">;
export type ControlledDiscrepancyOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    expectedQty?: Prisma.SortOrder;
    countedQty?: Prisma.SortOrder;
    difference?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    reportedBy?: Prisma.SortOrder;
    witnessId?: Prisma.SortOrderInput | Prisma.SortOrder;
    resolvedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    resolution?: Prisma.SortOrderInput | Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ControlledDiscrepancyCountOrderByAggregateInput;
    _avg?: Prisma.ControlledDiscrepancyAvgOrderByAggregateInput;
    _max?: Prisma.ControlledDiscrepancyMaxOrderByAggregateInput;
    _min?: Prisma.ControlledDiscrepancyMinOrderByAggregateInput;
    _sum?: Prisma.ControlledDiscrepancySumOrderByAggregateInput;
};
export type ControlledDiscrepancyScalarWhereWithAggregatesInput = {
    AND?: Prisma.ControlledDiscrepancyScalarWhereWithAggregatesInput | Prisma.ControlledDiscrepancyScalarWhereWithAggregatesInput[];
    OR?: Prisma.ControlledDiscrepancyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ControlledDiscrepancyScalarWhereWithAggregatesInput | Prisma.ControlledDiscrepancyScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ControlledDiscrepancy"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"ControlledDiscrepancy"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"ControlledDiscrepancy"> | string;
    drugId?: Prisma.StringWithAggregatesFilter<"ControlledDiscrepancy"> | string;
    expectedQty?: Prisma.IntWithAggregatesFilter<"ControlledDiscrepancy"> | number;
    countedQty?: Prisma.IntWithAggregatesFilter<"ControlledDiscrepancy"> | number;
    difference?: Prisma.IntWithAggregatesFilter<"ControlledDiscrepancy"> | number;
    status?: Prisma.StringWithAggregatesFilter<"ControlledDiscrepancy"> | string;
    notes?: Prisma.StringNullableWithAggregatesFilter<"ControlledDiscrepancy"> | string | null;
    reportedBy?: Prisma.StringWithAggregatesFilter<"ControlledDiscrepancy"> | string;
    witnessId?: Prisma.StringNullableWithAggregatesFilter<"ControlledDiscrepancy"> | string | null;
    resolvedBy?: Prisma.StringNullableWithAggregatesFilter<"ControlledDiscrepancy"> | string | null;
    resolution?: Prisma.StringNullableWithAggregatesFilter<"ControlledDiscrepancy"> | string | null;
    resolvedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"ControlledDiscrepancy"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ControlledDiscrepancy"> | Date | string;
};
export type ControlledDiscrepancyCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    drugId: string;
    expectedQty: number;
    countedQty: number;
    difference: number;
    status?: string;
    notes?: string | null;
    reportedBy: string;
    witnessId?: string | null;
    resolvedBy?: string | null;
    resolution?: string | null;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ControlledDiscrepancyUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    drugId: string;
    expectedQty: number;
    countedQty: number;
    difference: number;
    status?: string;
    notes?: string | null;
    reportedBy: string;
    witnessId?: string | null;
    resolvedBy?: string | null;
    resolution?: string | null;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ControlledDiscrepancyUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedQty?: Prisma.IntFieldUpdateOperationsInput | number;
    countedQty?: Prisma.IntFieldUpdateOperationsInput | number;
    difference?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reportedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    witnessId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolvedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ControlledDiscrepancyUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedQty?: Prisma.IntFieldUpdateOperationsInput | number;
    countedQty?: Prisma.IntFieldUpdateOperationsInput | number;
    difference?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reportedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    witnessId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolvedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ControlledDiscrepancyCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    drugId: string;
    expectedQty: number;
    countedQty: number;
    difference: number;
    status?: string;
    notes?: string | null;
    reportedBy: string;
    witnessId?: string | null;
    resolvedBy?: string | null;
    resolution?: string | null;
    resolvedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ControlledDiscrepancyUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedQty?: Prisma.IntFieldUpdateOperationsInput | number;
    countedQty?: Prisma.IntFieldUpdateOperationsInput | number;
    difference?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reportedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    witnessId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolvedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ControlledDiscrepancyUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedQty?: Prisma.IntFieldUpdateOperationsInput | number;
    countedQty?: Prisma.IntFieldUpdateOperationsInput | number;
    difference?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reportedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    witnessId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolvedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ControlledDiscrepancyCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    expectedQty?: Prisma.SortOrder;
    countedQty?: Prisma.SortOrder;
    difference?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    reportedBy?: Prisma.SortOrder;
    witnessId?: Prisma.SortOrder;
    resolvedBy?: Prisma.SortOrder;
    resolution?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ControlledDiscrepancyAvgOrderByAggregateInput = {
    expectedQty?: Prisma.SortOrder;
    countedQty?: Prisma.SortOrder;
    difference?: Prisma.SortOrder;
};
export type ControlledDiscrepancyMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    expectedQty?: Prisma.SortOrder;
    countedQty?: Prisma.SortOrder;
    difference?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    reportedBy?: Prisma.SortOrder;
    witnessId?: Prisma.SortOrder;
    resolvedBy?: Prisma.SortOrder;
    resolution?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ControlledDiscrepancyMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    expectedQty?: Prisma.SortOrder;
    countedQty?: Prisma.SortOrder;
    difference?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    reportedBy?: Prisma.SortOrder;
    witnessId?: Prisma.SortOrder;
    resolvedBy?: Prisma.SortOrder;
    resolution?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ControlledDiscrepancySumOrderByAggregateInput = {
    expectedQty?: Prisma.SortOrder;
    countedQty?: Prisma.SortOrder;
    difference?: Prisma.SortOrder;
};
export type ControlledDiscrepancySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    drugId?: boolean;
    expectedQty?: boolean;
    countedQty?: boolean;
    difference?: boolean;
    status?: boolean;
    notes?: boolean;
    reportedBy?: boolean;
    witnessId?: boolean;
    resolvedBy?: boolean;
    resolution?: boolean;
    resolvedAt?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["controlledDiscrepancy"]>;
export type ControlledDiscrepancySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    drugId?: boolean;
    expectedQty?: boolean;
    countedQty?: boolean;
    difference?: boolean;
    status?: boolean;
    notes?: boolean;
    reportedBy?: boolean;
    witnessId?: boolean;
    resolvedBy?: boolean;
    resolution?: boolean;
    resolvedAt?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["controlledDiscrepancy"]>;
export type ControlledDiscrepancySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    drugId?: boolean;
    expectedQty?: boolean;
    countedQty?: boolean;
    difference?: boolean;
    status?: boolean;
    notes?: boolean;
    reportedBy?: boolean;
    witnessId?: boolean;
    resolvedBy?: boolean;
    resolution?: boolean;
    resolvedAt?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["controlledDiscrepancy"]>;
export type ControlledDiscrepancySelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    drugId?: boolean;
    expectedQty?: boolean;
    countedQty?: boolean;
    difference?: boolean;
    status?: boolean;
    notes?: boolean;
    reportedBy?: boolean;
    witnessId?: boolean;
    resolvedBy?: boolean;
    resolution?: boolean;
    resolvedAt?: boolean;
    createdAt?: boolean;
};
export type ControlledDiscrepancyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "drugId" | "expectedQty" | "countedQty" | "difference" | "status" | "notes" | "reportedBy" | "witnessId" | "resolvedBy" | "resolution" | "resolvedAt" | "createdAt", ExtArgs["result"]["controlledDiscrepancy"]>;
export type $ControlledDiscrepancyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ControlledDiscrepancy";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        drugId: string;
        expectedQty: number;
        countedQty: number;
        difference: number;
        status: string;
        notes: string | null;
        reportedBy: string;
        witnessId: string | null;
        resolvedBy: string | null;
        resolution: string | null;
        resolvedAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["controlledDiscrepancy"]>;
    composites: {};
};
export type ControlledDiscrepancyGetPayload<S extends boolean | null | undefined | ControlledDiscrepancyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ControlledDiscrepancyPayload, S>;
export type ControlledDiscrepancyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ControlledDiscrepancyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ControlledDiscrepancyCountAggregateInputType | true;
};
export interface ControlledDiscrepancyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ControlledDiscrepancy'];
        meta: {
            name: 'ControlledDiscrepancy';
        };
    };
    findUnique<T extends ControlledDiscrepancyFindUniqueArgs>(args: Prisma.SelectSubset<T, ControlledDiscrepancyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ControlledDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$ControlledDiscrepancyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ControlledDiscrepancyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ControlledDiscrepancyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ControlledDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$ControlledDiscrepancyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ControlledDiscrepancyFindFirstArgs>(args?: Prisma.SelectSubset<T, ControlledDiscrepancyFindFirstArgs<ExtArgs>>): Prisma.Prisma__ControlledDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$ControlledDiscrepancyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ControlledDiscrepancyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ControlledDiscrepancyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ControlledDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$ControlledDiscrepancyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ControlledDiscrepancyFindManyArgs>(args?: Prisma.SelectSubset<T, ControlledDiscrepancyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ControlledDiscrepancyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ControlledDiscrepancyCreateArgs>(args: Prisma.SelectSubset<T, ControlledDiscrepancyCreateArgs<ExtArgs>>): Prisma.Prisma__ControlledDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$ControlledDiscrepancyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ControlledDiscrepancyCreateManyArgs>(args?: Prisma.SelectSubset<T, ControlledDiscrepancyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ControlledDiscrepancyCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ControlledDiscrepancyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ControlledDiscrepancyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ControlledDiscrepancyDeleteArgs>(args: Prisma.SelectSubset<T, ControlledDiscrepancyDeleteArgs<ExtArgs>>): Prisma.Prisma__ControlledDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$ControlledDiscrepancyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ControlledDiscrepancyUpdateArgs>(args: Prisma.SelectSubset<T, ControlledDiscrepancyUpdateArgs<ExtArgs>>): Prisma.Prisma__ControlledDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$ControlledDiscrepancyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ControlledDiscrepancyDeleteManyArgs>(args?: Prisma.SelectSubset<T, ControlledDiscrepancyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ControlledDiscrepancyUpdateManyArgs>(args: Prisma.SelectSubset<T, ControlledDiscrepancyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ControlledDiscrepancyUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ControlledDiscrepancyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ControlledDiscrepancyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ControlledDiscrepancyUpsertArgs>(args: Prisma.SelectSubset<T, ControlledDiscrepancyUpsertArgs<ExtArgs>>): Prisma.Prisma__ControlledDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$ControlledDiscrepancyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ControlledDiscrepancyCountArgs>(args?: Prisma.Subset<T, ControlledDiscrepancyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ControlledDiscrepancyCountAggregateOutputType> : number>;
    aggregate<T extends ControlledDiscrepancyAggregateArgs>(args: Prisma.Subset<T, ControlledDiscrepancyAggregateArgs>): Prisma.PrismaPromise<GetControlledDiscrepancyAggregateType<T>>;
    groupBy<T extends ControlledDiscrepancyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ControlledDiscrepancyGroupByArgs['orderBy'];
    } : {
        orderBy?: ControlledDiscrepancyGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ControlledDiscrepancyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetControlledDiscrepancyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ControlledDiscrepancyFieldRefs;
}
export interface Prisma__ControlledDiscrepancyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ControlledDiscrepancyFieldRefs {
    readonly id: Prisma.FieldRef<"ControlledDiscrepancy", 'String'>;
    readonly orgId: Prisma.FieldRef<"ControlledDiscrepancy", 'String'>;
    readonly branchId: Prisma.FieldRef<"ControlledDiscrepancy", 'String'>;
    readonly drugId: Prisma.FieldRef<"ControlledDiscrepancy", 'String'>;
    readonly expectedQty: Prisma.FieldRef<"ControlledDiscrepancy", 'Int'>;
    readonly countedQty: Prisma.FieldRef<"ControlledDiscrepancy", 'Int'>;
    readonly difference: Prisma.FieldRef<"ControlledDiscrepancy", 'Int'>;
    readonly status: Prisma.FieldRef<"ControlledDiscrepancy", 'String'>;
    readonly notes: Prisma.FieldRef<"ControlledDiscrepancy", 'String'>;
    readonly reportedBy: Prisma.FieldRef<"ControlledDiscrepancy", 'String'>;
    readonly witnessId: Prisma.FieldRef<"ControlledDiscrepancy", 'String'>;
    readonly resolvedBy: Prisma.FieldRef<"ControlledDiscrepancy", 'String'>;
    readonly resolution: Prisma.FieldRef<"ControlledDiscrepancy", 'String'>;
    readonly resolvedAt: Prisma.FieldRef<"ControlledDiscrepancy", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"ControlledDiscrepancy", 'DateTime'>;
}
export type ControlledDiscrepancyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.ControlledDiscrepancyOmit<ExtArgs> | null;
    where: Prisma.ControlledDiscrepancyWhereUniqueInput;
};
export type ControlledDiscrepancyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.ControlledDiscrepancyOmit<ExtArgs> | null;
    where: Prisma.ControlledDiscrepancyWhereUniqueInput;
};
export type ControlledDiscrepancyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.ControlledDiscrepancyOmit<ExtArgs> | null;
    where?: Prisma.ControlledDiscrepancyWhereInput;
    orderBy?: Prisma.ControlledDiscrepancyOrderByWithRelationInput | Prisma.ControlledDiscrepancyOrderByWithRelationInput[];
    cursor?: Prisma.ControlledDiscrepancyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ControlledDiscrepancyScalarFieldEnum | Prisma.ControlledDiscrepancyScalarFieldEnum[];
};
export type ControlledDiscrepancyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.ControlledDiscrepancyOmit<ExtArgs> | null;
    where?: Prisma.ControlledDiscrepancyWhereInput;
    orderBy?: Prisma.ControlledDiscrepancyOrderByWithRelationInput | Prisma.ControlledDiscrepancyOrderByWithRelationInput[];
    cursor?: Prisma.ControlledDiscrepancyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ControlledDiscrepancyScalarFieldEnum | Prisma.ControlledDiscrepancyScalarFieldEnum[];
};
export type ControlledDiscrepancyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.ControlledDiscrepancyOmit<ExtArgs> | null;
    where?: Prisma.ControlledDiscrepancyWhereInput;
    orderBy?: Prisma.ControlledDiscrepancyOrderByWithRelationInput | Prisma.ControlledDiscrepancyOrderByWithRelationInput[];
    cursor?: Prisma.ControlledDiscrepancyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ControlledDiscrepancyScalarFieldEnum | Prisma.ControlledDiscrepancyScalarFieldEnum[];
};
export type ControlledDiscrepancyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.ControlledDiscrepancyOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ControlledDiscrepancyCreateInput, Prisma.ControlledDiscrepancyUncheckedCreateInput>;
};
export type ControlledDiscrepancyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ControlledDiscrepancyCreateManyInput | Prisma.ControlledDiscrepancyCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ControlledDiscrepancyCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledDiscrepancySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ControlledDiscrepancyOmit<ExtArgs> | null;
    data: Prisma.ControlledDiscrepancyCreateManyInput | Prisma.ControlledDiscrepancyCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ControlledDiscrepancyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.ControlledDiscrepancyOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ControlledDiscrepancyUpdateInput, Prisma.ControlledDiscrepancyUncheckedUpdateInput>;
    where: Prisma.ControlledDiscrepancyWhereUniqueInput;
};
export type ControlledDiscrepancyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ControlledDiscrepancyUpdateManyMutationInput, Prisma.ControlledDiscrepancyUncheckedUpdateManyInput>;
    where?: Prisma.ControlledDiscrepancyWhereInput;
    limit?: number;
};
export type ControlledDiscrepancyUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledDiscrepancySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ControlledDiscrepancyOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ControlledDiscrepancyUpdateManyMutationInput, Prisma.ControlledDiscrepancyUncheckedUpdateManyInput>;
    where?: Prisma.ControlledDiscrepancyWhereInput;
    limit?: number;
};
export type ControlledDiscrepancyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.ControlledDiscrepancyOmit<ExtArgs> | null;
    where: Prisma.ControlledDiscrepancyWhereUniqueInput;
    create: Prisma.XOR<Prisma.ControlledDiscrepancyCreateInput, Prisma.ControlledDiscrepancyUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ControlledDiscrepancyUpdateInput, Prisma.ControlledDiscrepancyUncheckedUpdateInput>;
};
export type ControlledDiscrepancyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.ControlledDiscrepancyOmit<ExtArgs> | null;
    where: Prisma.ControlledDiscrepancyWhereUniqueInput;
};
export type ControlledDiscrepancyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ControlledDiscrepancyWhereInput;
    limit?: number;
};
export type ControlledDiscrepancyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.ControlledDiscrepancyOmit<ExtArgs> | null;
};
