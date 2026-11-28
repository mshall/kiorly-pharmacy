import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ClinicalRuleModel = runtime.Types.Result.DefaultSelection<Prisma.$ClinicalRulePayload>;
export type AggregateClinicalRule = {
    _count: ClinicalRuleCountAggregateOutputType | null;
    _avg: ClinicalRuleAvgAggregateOutputType | null;
    _sum: ClinicalRuleSumAggregateOutputType | null;
    _min: ClinicalRuleMinAggregateOutputType | null;
    _max: ClinicalRuleMaxAggregateOutputType | null;
};
export type ClinicalRuleAvgAggregateOutputType = {
    maxDailyMg: runtime.Decimal | null;
    maxSingleMg: runtime.Decimal | null;
    pediatricMaxMgPerKg: runtime.Decimal | null;
};
export type ClinicalRuleSumAggregateOutputType = {
    maxDailyMg: runtime.Decimal | null;
    maxSingleMg: runtime.Decimal | null;
    pediatricMaxMgPerKg: runtime.Decimal | null;
};
export type ClinicalRuleMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    key: string | null;
    kind: string | null;
    ingredient: string | null;
    ingredientB: string | null;
    severity: string | null;
    note: string | null;
    maxDailyMg: runtime.Decimal | null;
    maxSingleMg: runtime.Decimal | null;
    pediatricMaxMgPerKg: runtime.Decimal | null;
    category: string | null;
    source: string | null;
    active: boolean | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type ClinicalRuleMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    key: string | null;
    kind: string | null;
    ingredient: string | null;
    ingredientB: string | null;
    severity: string | null;
    note: string | null;
    maxDailyMg: runtime.Decimal | null;
    maxSingleMg: runtime.Decimal | null;
    pediatricMaxMgPerKg: runtime.Decimal | null;
    category: string | null;
    source: string | null;
    active: boolean | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type ClinicalRuleCountAggregateOutputType = {
    id: number;
    orgId: number;
    key: number;
    kind: number;
    ingredient: number;
    ingredientB: number;
    severity: number;
    note: number;
    maxDailyMg: number;
    maxSingleMg: number;
    pediatricMaxMgPerKg: number;
    category: number;
    source: number;
    active: number;
    createdBy: number;
    createdAt: number;
    _all: number;
};
export type ClinicalRuleAvgAggregateInputType = {
    maxDailyMg?: true;
    maxSingleMg?: true;
    pediatricMaxMgPerKg?: true;
};
export type ClinicalRuleSumAggregateInputType = {
    maxDailyMg?: true;
    maxSingleMg?: true;
    pediatricMaxMgPerKg?: true;
};
export type ClinicalRuleMinAggregateInputType = {
    id?: true;
    orgId?: true;
    key?: true;
    kind?: true;
    ingredient?: true;
    ingredientB?: true;
    severity?: true;
    note?: true;
    maxDailyMg?: true;
    maxSingleMg?: true;
    pediatricMaxMgPerKg?: true;
    category?: true;
    source?: true;
    active?: true;
    createdBy?: true;
    createdAt?: true;
};
export type ClinicalRuleMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    key?: true;
    kind?: true;
    ingredient?: true;
    ingredientB?: true;
    severity?: true;
    note?: true;
    maxDailyMg?: true;
    maxSingleMg?: true;
    pediatricMaxMgPerKg?: true;
    category?: true;
    source?: true;
    active?: true;
    createdBy?: true;
    createdAt?: true;
};
export type ClinicalRuleCountAggregateInputType = {
    id?: true;
    orgId?: true;
    key?: true;
    kind?: true;
    ingredient?: true;
    ingredientB?: true;
    severity?: true;
    note?: true;
    maxDailyMg?: true;
    maxSingleMg?: true;
    pediatricMaxMgPerKg?: true;
    category?: true;
    source?: true;
    active?: true;
    createdBy?: true;
    createdAt?: true;
    _all?: true;
};
export type ClinicalRuleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClinicalRuleWhereInput;
    orderBy?: Prisma.ClinicalRuleOrderByWithRelationInput | Prisma.ClinicalRuleOrderByWithRelationInput[];
    cursor?: Prisma.ClinicalRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ClinicalRuleCountAggregateInputType;
    _avg?: ClinicalRuleAvgAggregateInputType;
    _sum?: ClinicalRuleSumAggregateInputType;
    _min?: ClinicalRuleMinAggregateInputType;
    _max?: ClinicalRuleMaxAggregateInputType;
};
export type GetClinicalRuleAggregateType<T extends ClinicalRuleAggregateArgs> = {
    [P in keyof T & keyof AggregateClinicalRule]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateClinicalRule[P]> : Prisma.GetScalarType<T[P], AggregateClinicalRule[P]>;
};
export type ClinicalRuleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClinicalRuleWhereInput;
    orderBy?: Prisma.ClinicalRuleOrderByWithAggregationInput | Prisma.ClinicalRuleOrderByWithAggregationInput[];
    by: Prisma.ClinicalRuleScalarFieldEnum[] | Prisma.ClinicalRuleScalarFieldEnum;
    having?: Prisma.ClinicalRuleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ClinicalRuleCountAggregateInputType | true;
    _avg?: ClinicalRuleAvgAggregateInputType;
    _sum?: ClinicalRuleSumAggregateInputType;
    _min?: ClinicalRuleMinAggregateInputType;
    _max?: ClinicalRuleMaxAggregateInputType;
};
export type ClinicalRuleGroupByOutputType = {
    id: string;
    orgId: string | null;
    key: string;
    kind: string;
    ingredient: string;
    ingredientB: string | null;
    severity: string;
    note: string;
    maxDailyMg: runtime.Decimal | null;
    maxSingleMg: runtime.Decimal | null;
    pediatricMaxMgPerKg: runtime.Decimal | null;
    category: string | null;
    source: string;
    active: boolean;
    createdBy: string | null;
    createdAt: Date;
    _count: ClinicalRuleCountAggregateOutputType | null;
    _avg: ClinicalRuleAvgAggregateOutputType | null;
    _sum: ClinicalRuleSumAggregateOutputType | null;
    _min: ClinicalRuleMinAggregateOutputType | null;
    _max: ClinicalRuleMaxAggregateOutputType | null;
};
export type GetClinicalRuleGroupByPayload<T extends ClinicalRuleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ClinicalRuleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ClinicalRuleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ClinicalRuleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ClinicalRuleGroupByOutputType[P]>;
}>>;
export type ClinicalRuleWhereInput = {
    AND?: Prisma.ClinicalRuleWhereInput | Prisma.ClinicalRuleWhereInput[];
    OR?: Prisma.ClinicalRuleWhereInput[];
    NOT?: Prisma.ClinicalRuleWhereInput | Prisma.ClinicalRuleWhereInput[];
    id?: Prisma.StringFilter<"ClinicalRule"> | string;
    orgId?: Prisma.StringNullableFilter<"ClinicalRule"> | string | null;
    key?: Prisma.StringFilter<"ClinicalRule"> | string;
    kind?: Prisma.StringFilter<"ClinicalRule"> | string;
    ingredient?: Prisma.StringFilter<"ClinicalRule"> | string;
    ingredientB?: Prisma.StringNullableFilter<"ClinicalRule"> | string | null;
    severity?: Prisma.StringFilter<"ClinicalRule"> | string;
    note?: Prisma.StringFilter<"ClinicalRule"> | string;
    maxDailyMg?: Prisma.DecimalNullableFilter<"ClinicalRule"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    maxSingleMg?: Prisma.DecimalNullableFilter<"ClinicalRule"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    pediatricMaxMgPerKg?: Prisma.DecimalNullableFilter<"ClinicalRule"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    category?: Prisma.StringNullableFilter<"ClinicalRule"> | string | null;
    source?: Prisma.StringFilter<"ClinicalRule"> | string;
    active?: Prisma.BoolFilter<"ClinicalRule"> | boolean;
    createdBy?: Prisma.StringNullableFilter<"ClinicalRule"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"ClinicalRule"> | Date | string;
};
export type ClinicalRuleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrderInput | Prisma.SortOrder;
    key?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    ingredient?: Prisma.SortOrder;
    ingredientB?: Prisma.SortOrderInput | Prisma.SortOrder;
    severity?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    maxDailyMg?: Prisma.SortOrderInput | Prisma.SortOrder;
    maxSingleMg?: Prisma.SortOrderInput | Prisma.SortOrder;
    pediatricMaxMgPerKg?: Prisma.SortOrderInput | Prisma.SortOrder;
    category?: Prisma.SortOrderInput | Prisma.SortOrder;
    source?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ClinicalRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    key?: string;
    AND?: Prisma.ClinicalRuleWhereInput | Prisma.ClinicalRuleWhereInput[];
    OR?: Prisma.ClinicalRuleWhereInput[];
    NOT?: Prisma.ClinicalRuleWhereInput | Prisma.ClinicalRuleWhereInput[];
    orgId?: Prisma.StringNullableFilter<"ClinicalRule"> | string | null;
    kind?: Prisma.StringFilter<"ClinicalRule"> | string;
    ingredient?: Prisma.StringFilter<"ClinicalRule"> | string;
    ingredientB?: Prisma.StringNullableFilter<"ClinicalRule"> | string | null;
    severity?: Prisma.StringFilter<"ClinicalRule"> | string;
    note?: Prisma.StringFilter<"ClinicalRule"> | string;
    maxDailyMg?: Prisma.DecimalNullableFilter<"ClinicalRule"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    maxSingleMg?: Prisma.DecimalNullableFilter<"ClinicalRule"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    pediatricMaxMgPerKg?: Prisma.DecimalNullableFilter<"ClinicalRule"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    category?: Prisma.StringNullableFilter<"ClinicalRule"> | string | null;
    source?: Prisma.StringFilter<"ClinicalRule"> | string;
    active?: Prisma.BoolFilter<"ClinicalRule"> | boolean;
    createdBy?: Prisma.StringNullableFilter<"ClinicalRule"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"ClinicalRule"> | Date | string;
}, "id" | "key">;
export type ClinicalRuleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrderInput | Prisma.SortOrder;
    key?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    ingredient?: Prisma.SortOrder;
    ingredientB?: Prisma.SortOrderInput | Prisma.SortOrder;
    severity?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    maxDailyMg?: Prisma.SortOrderInput | Prisma.SortOrder;
    maxSingleMg?: Prisma.SortOrderInput | Prisma.SortOrder;
    pediatricMaxMgPerKg?: Prisma.SortOrderInput | Prisma.SortOrder;
    category?: Prisma.SortOrderInput | Prisma.SortOrder;
    source?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ClinicalRuleCountOrderByAggregateInput;
    _avg?: Prisma.ClinicalRuleAvgOrderByAggregateInput;
    _max?: Prisma.ClinicalRuleMaxOrderByAggregateInput;
    _min?: Prisma.ClinicalRuleMinOrderByAggregateInput;
    _sum?: Prisma.ClinicalRuleSumOrderByAggregateInput;
};
export type ClinicalRuleScalarWhereWithAggregatesInput = {
    AND?: Prisma.ClinicalRuleScalarWhereWithAggregatesInput | Prisma.ClinicalRuleScalarWhereWithAggregatesInput[];
    OR?: Prisma.ClinicalRuleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ClinicalRuleScalarWhereWithAggregatesInput | Prisma.ClinicalRuleScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ClinicalRule"> | string;
    orgId?: Prisma.StringNullableWithAggregatesFilter<"ClinicalRule"> | string | null;
    key?: Prisma.StringWithAggregatesFilter<"ClinicalRule"> | string;
    kind?: Prisma.StringWithAggregatesFilter<"ClinicalRule"> | string;
    ingredient?: Prisma.StringWithAggregatesFilter<"ClinicalRule"> | string;
    ingredientB?: Prisma.StringNullableWithAggregatesFilter<"ClinicalRule"> | string | null;
    severity?: Prisma.StringWithAggregatesFilter<"ClinicalRule"> | string;
    note?: Prisma.StringWithAggregatesFilter<"ClinicalRule"> | string;
    maxDailyMg?: Prisma.DecimalNullableWithAggregatesFilter<"ClinicalRule"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    maxSingleMg?: Prisma.DecimalNullableWithAggregatesFilter<"ClinicalRule"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    pediatricMaxMgPerKg?: Prisma.DecimalNullableWithAggregatesFilter<"ClinicalRule"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    category?: Prisma.StringNullableWithAggregatesFilter<"ClinicalRule"> | string | null;
    source?: Prisma.StringWithAggregatesFilter<"ClinicalRule"> | string;
    active?: Prisma.BoolWithAggregatesFilter<"ClinicalRule"> | boolean;
    createdBy?: Prisma.StringNullableWithAggregatesFilter<"ClinicalRule"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ClinicalRule"> | Date | string;
};
export type ClinicalRuleCreateInput = {
    id?: string;
    orgId?: string | null;
    key: string;
    kind: string;
    ingredient: string;
    ingredientB?: string | null;
    severity?: string;
    note: string;
    maxDailyMg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    maxSingleMg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    pediatricMaxMgPerKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    category?: string | null;
    source?: string;
    active?: boolean;
    createdBy?: string | null;
    createdAt?: Date | string;
};
export type ClinicalRuleUncheckedCreateInput = {
    id?: string;
    orgId?: string | null;
    key: string;
    kind: string;
    ingredient: string;
    ingredientB?: string | null;
    severity?: string;
    note: string;
    maxDailyMg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    maxSingleMg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    pediatricMaxMgPerKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    category?: string | null;
    source?: string;
    active?: boolean;
    createdBy?: string | null;
    createdAt?: Date | string;
};
export type ClinicalRuleUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    ingredient?: Prisma.StringFieldUpdateOperationsInput | string;
    ingredientB?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    severity?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.StringFieldUpdateOperationsInput | string;
    maxDailyMg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    maxSingleMg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    pediatricMaxMgPerKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClinicalRuleUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    ingredient?: Prisma.StringFieldUpdateOperationsInput | string;
    ingredientB?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    severity?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.StringFieldUpdateOperationsInput | string;
    maxDailyMg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    maxSingleMg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    pediatricMaxMgPerKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClinicalRuleCreateManyInput = {
    id?: string;
    orgId?: string | null;
    key: string;
    kind: string;
    ingredient: string;
    ingredientB?: string | null;
    severity?: string;
    note: string;
    maxDailyMg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    maxSingleMg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    pediatricMaxMgPerKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    category?: string | null;
    source?: string;
    active?: boolean;
    createdBy?: string | null;
    createdAt?: Date | string;
};
export type ClinicalRuleUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    ingredient?: Prisma.StringFieldUpdateOperationsInput | string;
    ingredientB?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    severity?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.StringFieldUpdateOperationsInput | string;
    maxDailyMg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    maxSingleMg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    pediatricMaxMgPerKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClinicalRuleUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    ingredient?: Prisma.StringFieldUpdateOperationsInput | string;
    ingredientB?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    severity?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.StringFieldUpdateOperationsInput | string;
    maxDailyMg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    maxSingleMg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    pediatricMaxMgPerKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClinicalRuleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    ingredient?: Prisma.SortOrder;
    ingredientB?: Prisma.SortOrder;
    severity?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    maxDailyMg?: Prisma.SortOrder;
    maxSingleMg?: Prisma.SortOrder;
    pediatricMaxMgPerKg?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ClinicalRuleAvgOrderByAggregateInput = {
    maxDailyMg?: Prisma.SortOrder;
    maxSingleMg?: Prisma.SortOrder;
    pediatricMaxMgPerKg?: Prisma.SortOrder;
};
export type ClinicalRuleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    ingredient?: Prisma.SortOrder;
    ingredientB?: Prisma.SortOrder;
    severity?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    maxDailyMg?: Prisma.SortOrder;
    maxSingleMg?: Prisma.SortOrder;
    pediatricMaxMgPerKg?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ClinicalRuleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    ingredient?: Prisma.SortOrder;
    ingredientB?: Prisma.SortOrder;
    severity?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    maxDailyMg?: Prisma.SortOrder;
    maxSingleMg?: Prisma.SortOrder;
    pediatricMaxMgPerKg?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ClinicalRuleSumOrderByAggregateInput = {
    maxDailyMg?: Prisma.SortOrder;
    maxSingleMg?: Prisma.SortOrder;
    pediatricMaxMgPerKg?: Prisma.SortOrder;
};
export type ClinicalRuleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    key?: boolean;
    kind?: boolean;
    ingredient?: boolean;
    ingredientB?: boolean;
    severity?: boolean;
    note?: boolean;
    maxDailyMg?: boolean;
    maxSingleMg?: boolean;
    pediatricMaxMgPerKg?: boolean;
    category?: boolean;
    source?: boolean;
    active?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["clinicalRule"]>;
export type ClinicalRuleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    key?: boolean;
    kind?: boolean;
    ingredient?: boolean;
    ingredientB?: boolean;
    severity?: boolean;
    note?: boolean;
    maxDailyMg?: boolean;
    maxSingleMg?: boolean;
    pediatricMaxMgPerKg?: boolean;
    category?: boolean;
    source?: boolean;
    active?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["clinicalRule"]>;
export type ClinicalRuleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    key?: boolean;
    kind?: boolean;
    ingredient?: boolean;
    ingredientB?: boolean;
    severity?: boolean;
    note?: boolean;
    maxDailyMg?: boolean;
    maxSingleMg?: boolean;
    pediatricMaxMgPerKg?: boolean;
    category?: boolean;
    source?: boolean;
    active?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["clinicalRule"]>;
export type ClinicalRuleSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    key?: boolean;
    kind?: boolean;
    ingredient?: boolean;
    ingredientB?: boolean;
    severity?: boolean;
    note?: boolean;
    maxDailyMg?: boolean;
    maxSingleMg?: boolean;
    pediatricMaxMgPerKg?: boolean;
    category?: boolean;
    source?: boolean;
    active?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
};
export type ClinicalRuleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "key" | "kind" | "ingredient" | "ingredientB" | "severity" | "note" | "maxDailyMg" | "maxSingleMg" | "pediatricMaxMgPerKg" | "category" | "source" | "active" | "createdBy" | "createdAt", ExtArgs["result"]["clinicalRule"]>;
export type $ClinicalRulePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ClinicalRule";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string | null;
        key: string;
        kind: string;
        ingredient: string;
        ingredientB: string | null;
        severity: string;
        note: string;
        maxDailyMg: runtime.Decimal | null;
        maxSingleMg: runtime.Decimal | null;
        pediatricMaxMgPerKg: runtime.Decimal | null;
        category: string | null;
        source: string;
        active: boolean;
        createdBy: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["clinicalRule"]>;
    composites: {};
};
export type ClinicalRuleGetPayload<S extends boolean | null | undefined | ClinicalRuleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ClinicalRulePayload, S>;
export type ClinicalRuleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ClinicalRuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ClinicalRuleCountAggregateInputType | true;
};
export interface ClinicalRuleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ClinicalRule'];
        meta: {
            name: 'ClinicalRule';
        };
    };
    findUnique<T extends ClinicalRuleFindUniqueArgs>(args: Prisma.SelectSubset<T, ClinicalRuleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ClinicalRuleClient<runtime.Types.Result.GetResult<Prisma.$ClinicalRulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ClinicalRuleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ClinicalRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClinicalRuleClient<runtime.Types.Result.GetResult<Prisma.$ClinicalRulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ClinicalRuleFindFirstArgs>(args?: Prisma.SelectSubset<T, ClinicalRuleFindFirstArgs<ExtArgs>>): Prisma.Prisma__ClinicalRuleClient<runtime.Types.Result.GetResult<Prisma.$ClinicalRulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ClinicalRuleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ClinicalRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClinicalRuleClient<runtime.Types.Result.GetResult<Prisma.$ClinicalRulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ClinicalRuleFindManyArgs>(args?: Prisma.SelectSubset<T, ClinicalRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClinicalRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ClinicalRuleCreateArgs>(args: Prisma.SelectSubset<T, ClinicalRuleCreateArgs<ExtArgs>>): Prisma.Prisma__ClinicalRuleClient<runtime.Types.Result.GetResult<Prisma.$ClinicalRulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ClinicalRuleCreateManyArgs>(args?: Prisma.SelectSubset<T, ClinicalRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ClinicalRuleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ClinicalRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClinicalRulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ClinicalRuleDeleteArgs>(args: Prisma.SelectSubset<T, ClinicalRuleDeleteArgs<ExtArgs>>): Prisma.Prisma__ClinicalRuleClient<runtime.Types.Result.GetResult<Prisma.$ClinicalRulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ClinicalRuleUpdateArgs>(args: Prisma.SelectSubset<T, ClinicalRuleUpdateArgs<ExtArgs>>): Prisma.Prisma__ClinicalRuleClient<runtime.Types.Result.GetResult<Prisma.$ClinicalRulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ClinicalRuleDeleteManyArgs>(args?: Prisma.SelectSubset<T, ClinicalRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ClinicalRuleUpdateManyArgs>(args: Prisma.SelectSubset<T, ClinicalRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ClinicalRuleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ClinicalRuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClinicalRulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ClinicalRuleUpsertArgs>(args: Prisma.SelectSubset<T, ClinicalRuleUpsertArgs<ExtArgs>>): Prisma.Prisma__ClinicalRuleClient<runtime.Types.Result.GetResult<Prisma.$ClinicalRulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ClinicalRuleCountArgs>(args?: Prisma.Subset<T, ClinicalRuleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ClinicalRuleCountAggregateOutputType> : number>;
    aggregate<T extends ClinicalRuleAggregateArgs>(args: Prisma.Subset<T, ClinicalRuleAggregateArgs>): Prisma.PrismaPromise<GetClinicalRuleAggregateType<T>>;
    groupBy<T extends ClinicalRuleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ClinicalRuleGroupByArgs['orderBy'];
    } : {
        orderBy?: ClinicalRuleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ClinicalRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClinicalRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ClinicalRuleFieldRefs;
}
export interface Prisma__ClinicalRuleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ClinicalRuleFieldRefs {
    readonly id: Prisma.FieldRef<"ClinicalRule", 'String'>;
    readonly orgId: Prisma.FieldRef<"ClinicalRule", 'String'>;
    readonly key: Prisma.FieldRef<"ClinicalRule", 'String'>;
    readonly kind: Prisma.FieldRef<"ClinicalRule", 'String'>;
    readonly ingredient: Prisma.FieldRef<"ClinicalRule", 'String'>;
    readonly ingredientB: Prisma.FieldRef<"ClinicalRule", 'String'>;
    readonly severity: Prisma.FieldRef<"ClinicalRule", 'String'>;
    readonly note: Prisma.FieldRef<"ClinicalRule", 'String'>;
    readonly maxDailyMg: Prisma.FieldRef<"ClinicalRule", 'Decimal'>;
    readonly maxSingleMg: Prisma.FieldRef<"ClinicalRule", 'Decimal'>;
    readonly pediatricMaxMgPerKg: Prisma.FieldRef<"ClinicalRule", 'Decimal'>;
    readonly category: Prisma.FieldRef<"ClinicalRule", 'String'>;
    readonly source: Prisma.FieldRef<"ClinicalRule", 'String'>;
    readonly active: Prisma.FieldRef<"ClinicalRule", 'Boolean'>;
    readonly createdBy: Prisma.FieldRef<"ClinicalRule", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ClinicalRule", 'DateTime'>;
}
export type ClinicalRuleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClinicalRuleSelect<ExtArgs> | null;
    omit?: Prisma.ClinicalRuleOmit<ExtArgs> | null;
    where: Prisma.ClinicalRuleWhereUniqueInput;
};
export type ClinicalRuleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClinicalRuleSelect<ExtArgs> | null;
    omit?: Prisma.ClinicalRuleOmit<ExtArgs> | null;
    where: Prisma.ClinicalRuleWhereUniqueInput;
};
export type ClinicalRuleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClinicalRuleSelect<ExtArgs> | null;
    omit?: Prisma.ClinicalRuleOmit<ExtArgs> | null;
    where?: Prisma.ClinicalRuleWhereInput;
    orderBy?: Prisma.ClinicalRuleOrderByWithRelationInput | Prisma.ClinicalRuleOrderByWithRelationInput[];
    cursor?: Prisma.ClinicalRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClinicalRuleScalarFieldEnum | Prisma.ClinicalRuleScalarFieldEnum[];
};
export type ClinicalRuleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClinicalRuleSelect<ExtArgs> | null;
    omit?: Prisma.ClinicalRuleOmit<ExtArgs> | null;
    where?: Prisma.ClinicalRuleWhereInput;
    orderBy?: Prisma.ClinicalRuleOrderByWithRelationInput | Prisma.ClinicalRuleOrderByWithRelationInput[];
    cursor?: Prisma.ClinicalRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClinicalRuleScalarFieldEnum | Prisma.ClinicalRuleScalarFieldEnum[];
};
export type ClinicalRuleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClinicalRuleSelect<ExtArgs> | null;
    omit?: Prisma.ClinicalRuleOmit<ExtArgs> | null;
    where?: Prisma.ClinicalRuleWhereInput;
    orderBy?: Prisma.ClinicalRuleOrderByWithRelationInput | Prisma.ClinicalRuleOrderByWithRelationInput[];
    cursor?: Prisma.ClinicalRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClinicalRuleScalarFieldEnum | Prisma.ClinicalRuleScalarFieldEnum[];
};
export type ClinicalRuleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClinicalRuleSelect<ExtArgs> | null;
    omit?: Prisma.ClinicalRuleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ClinicalRuleCreateInput, Prisma.ClinicalRuleUncheckedCreateInput>;
};
export type ClinicalRuleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ClinicalRuleCreateManyInput | Prisma.ClinicalRuleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ClinicalRuleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClinicalRuleSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ClinicalRuleOmit<ExtArgs> | null;
    data: Prisma.ClinicalRuleCreateManyInput | Prisma.ClinicalRuleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ClinicalRuleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClinicalRuleSelect<ExtArgs> | null;
    omit?: Prisma.ClinicalRuleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ClinicalRuleUpdateInput, Prisma.ClinicalRuleUncheckedUpdateInput>;
    where: Prisma.ClinicalRuleWhereUniqueInput;
};
export type ClinicalRuleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ClinicalRuleUpdateManyMutationInput, Prisma.ClinicalRuleUncheckedUpdateManyInput>;
    where?: Prisma.ClinicalRuleWhereInput;
    limit?: number;
};
export type ClinicalRuleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClinicalRuleSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ClinicalRuleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ClinicalRuleUpdateManyMutationInput, Prisma.ClinicalRuleUncheckedUpdateManyInput>;
    where?: Prisma.ClinicalRuleWhereInput;
    limit?: number;
};
export type ClinicalRuleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClinicalRuleSelect<ExtArgs> | null;
    omit?: Prisma.ClinicalRuleOmit<ExtArgs> | null;
    where: Prisma.ClinicalRuleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ClinicalRuleCreateInput, Prisma.ClinicalRuleUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ClinicalRuleUpdateInput, Prisma.ClinicalRuleUncheckedUpdateInput>;
};
export type ClinicalRuleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClinicalRuleSelect<ExtArgs> | null;
    omit?: Prisma.ClinicalRuleOmit<ExtArgs> | null;
    where: Prisma.ClinicalRuleWhereUniqueInput;
};
export type ClinicalRuleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClinicalRuleWhereInput;
    limit?: number;
};
export type ClinicalRuleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClinicalRuleSelect<ExtArgs> | null;
    omit?: Prisma.ClinicalRuleOmit<ExtArgs> | null;
};
