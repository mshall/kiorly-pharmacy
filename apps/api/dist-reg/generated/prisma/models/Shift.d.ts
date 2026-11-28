import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type ShiftModel = runtime.Types.Result.DefaultSelection<Prisma.$ShiftPayload>;
export type AggregateShift = {
    _count: ShiftCountAggregateOutputType | null;
    _avg: ShiftAvgAggregateOutputType | null;
    _sum: ShiftSumAggregateOutputType | null;
    _min: ShiftMinAggregateOutputType | null;
    _max: ShiftMaxAggregateOutputType | null;
};
export type ShiftAvgAggregateOutputType = {
    openingFloat: runtime.Decimal | null;
    countedCash: runtime.Decimal | null;
    expectedCash: runtime.Decimal | null;
    variance: runtime.Decimal | null;
};
export type ShiftSumAggregateOutputType = {
    openingFloat: runtime.Decimal | null;
    countedCash: runtime.Decimal | null;
    expectedCash: runtime.Decimal | null;
    variance: runtime.Decimal | null;
};
export type ShiftMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    openedBy: string | null;
    closedBy: string | null;
    status: $Enums.ShiftStatus | null;
    openingFloat: runtime.Decimal | null;
    countedCash: runtime.Decimal | null;
    expectedCash: runtime.Decimal | null;
    variance: runtime.Decimal | null;
    varianceAlerted: boolean | null;
    openedAt: Date | null;
    closedAt: Date | null;
};
export type ShiftMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    openedBy: string | null;
    closedBy: string | null;
    status: $Enums.ShiftStatus | null;
    openingFloat: runtime.Decimal | null;
    countedCash: runtime.Decimal | null;
    expectedCash: runtime.Decimal | null;
    variance: runtime.Decimal | null;
    varianceAlerted: boolean | null;
    openedAt: Date | null;
    closedAt: Date | null;
};
export type ShiftCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    openedBy: number;
    closedBy: number;
    status: number;
    openingFloat: number;
    countedCash: number;
    expectedCash: number;
    variance: number;
    varianceAlerted: number;
    zReport: number;
    openedAt: number;
    closedAt: number;
    _all: number;
};
export type ShiftAvgAggregateInputType = {
    openingFloat?: true;
    countedCash?: true;
    expectedCash?: true;
    variance?: true;
};
export type ShiftSumAggregateInputType = {
    openingFloat?: true;
    countedCash?: true;
    expectedCash?: true;
    variance?: true;
};
export type ShiftMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    openedBy?: true;
    closedBy?: true;
    status?: true;
    openingFloat?: true;
    countedCash?: true;
    expectedCash?: true;
    variance?: true;
    varianceAlerted?: true;
    openedAt?: true;
    closedAt?: true;
};
export type ShiftMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    openedBy?: true;
    closedBy?: true;
    status?: true;
    openingFloat?: true;
    countedCash?: true;
    expectedCash?: true;
    variance?: true;
    varianceAlerted?: true;
    openedAt?: true;
    closedAt?: true;
};
export type ShiftCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    openedBy?: true;
    closedBy?: true;
    status?: true;
    openingFloat?: true;
    countedCash?: true;
    expectedCash?: true;
    variance?: true;
    varianceAlerted?: true;
    zReport?: true;
    openedAt?: true;
    closedAt?: true;
    _all?: true;
};
export type ShiftAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ShiftWhereInput;
    orderBy?: Prisma.ShiftOrderByWithRelationInput | Prisma.ShiftOrderByWithRelationInput[];
    cursor?: Prisma.ShiftWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ShiftCountAggregateInputType;
    _avg?: ShiftAvgAggregateInputType;
    _sum?: ShiftSumAggregateInputType;
    _min?: ShiftMinAggregateInputType;
    _max?: ShiftMaxAggregateInputType;
};
export type GetShiftAggregateType<T extends ShiftAggregateArgs> = {
    [P in keyof T & keyof AggregateShift]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateShift[P]> : Prisma.GetScalarType<T[P], AggregateShift[P]>;
};
export type ShiftGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ShiftWhereInput;
    orderBy?: Prisma.ShiftOrderByWithAggregationInput | Prisma.ShiftOrderByWithAggregationInput[];
    by: Prisma.ShiftScalarFieldEnum[] | Prisma.ShiftScalarFieldEnum;
    having?: Prisma.ShiftScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ShiftCountAggregateInputType | true;
    _avg?: ShiftAvgAggregateInputType;
    _sum?: ShiftSumAggregateInputType;
    _min?: ShiftMinAggregateInputType;
    _max?: ShiftMaxAggregateInputType;
};
export type ShiftGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    openedBy: string;
    closedBy: string | null;
    status: $Enums.ShiftStatus;
    openingFloat: runtime.Decimal;
    countedCash: runtime.Decimal | null;
    expectedCash: runtime.Decimal | null;
    variance: runtime.Decimal | null;
    varianceAlerted: boolean;
    zReport: runtime.JsonValue | null;
    openedAt: Date;
    closedAt: Date | null;
    _count: ShiftCountAggregateOutputType | null;
    _avg: ShiftAvgAggregateOutputType | null;
    _sum: ShiftSumAggregateOutputType | null;
    _min: ShiftMinAggregateOutputType | null;
    _max: ShiftMaxAggregateOutputType | null;
};
export type GetShiftGroupByPayload<T extends ShiftGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ShiftGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ShiftGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ShiftGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ShiftGroupByOutputType[P]>;
}>>;
export type ShiftWhereInput = {
    AND?: Prisma.ShiftWhereInput | Prisma.ShiftWhereInput[];
    OR?: Prisma.ShiftWhereInput[];
    NOT?: Prisma.ShiftWhereInput | Prisma.ShiftWhereInput[];
    id?: Prisma.StringFilter<"Shift"> | string;
    orgId?: Prisma.StringFilter<"Shift"> | string;
    branchId?: Prisma.StringFilter<"Shift"> | string;
    openedBy?: Prisma.StringFilter<"Shift"> | string;
    closedBy?: Prisma.StringNullableFilter<"Shift"> | string | null;
    status?: Prisma.EnumShiftStatusFilter<"Shift"> | $Enums.ShiftStatus;
    openingFloat?: Prisma.DecimalFilter<"Shift"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedCash?: Prisma.DecimalNullableFilter<"Shift"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    expectedCash?: Prisma.DecimalNullableFilter<"Shift"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    variance?: Prisma.DecimalNullableFilter<"Shift"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    varianceAlerted?: Prisma.BoolFilter<"Shift"> | boolean;
    zReport?: Prisma.JsonNullableFilter<"Shift">;
    openedAt?: Prisma.DateTimeFilter<"Shift"> | Date | string;
    closedAt?: Prisma.DateTimeNullableFilter<"Shift"> | Date | string | null;
    sales?: Prisma.SaleListRelationFilter;
};
export type ShiftOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    openedBy?: Prisma.SortOrder;
    closedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    openingFloat?: Prisma.SortOrder;
    countedCash?: Prisma.SortOrderInput | Prisma.SortOrder;
    expectedCash?: Prisma.SortOrderInput | Prisma.SortOrder;
    variance?: Prisma.SortOrderInput | Prisma.SortOrder;
    varianceAlerted?: Prisma.SortOrder;
    zReport?: Prisma.SortOrderInput | Prisma.SortOrder;
    openedAt?: Prisma.SortOrder;
    closedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    sales?: Prisma.SaleOrderByRelationAggregateInput;
};
export type ShiftWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ShiftWhereInput | Prisma.ShiftWhereInput[];
    OR?: Prisma.ShiftWhereInput[];
    NOT?: Prisma.ShiftWhereInput | Prisma.ShiftWhereInput[];
    orgId?: Prisma.StringFilter<"Shift"> | string;
    branchId?: Prisma.StringFilter<"Shift"> | string;
    openedBy?: Prisma.StringFilter<"Shift"> | string;
    closedBy?: Prisma.StringNullableFilter<"Shift"> | string | null;
    status?: Prisma.EnumShiftStatusFilter<"Shift"> | $Enums.ShiftStatus;
    openingFloat?: Prisma.DecimalFilter<"Shift"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedCash?: Prisma.DecimalNullableFilter<"Shift"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    expectedCash?: Prisma.DecimalNullableFilter<"Shift"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    variance?: Prisma.DecimalNullableFilter<"Shift"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    varianceAlerted?: Prisma.BoolFilter<"Shift"> | boolean;
    zReport?: Prisma.JsonNullableFilter<"Shift">;
    openedAt?: Prisma.DateTimeFilter<"Shift"> | Date | string;
    closedAt?: Prisma.DateTimeNullableFilter<"Shift"> | Date | string | null;
    sales?: Prisma.SaleListRelationFilter;
}, "id">;
export type ShiftOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    openedBy?: Prisma.SortOrder;
    closedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    openingFloat?: Prisma.SortOrder;
    countedCash?: Prisma.SortOrderInput | Prisma.SortOrder;
    expectedCash?: Prisma.SortOrderInput | Prisma.SortOrder;
    variance?: Prisma.SortOrderInput | Prisma.SortOrder;
    varianceAlerted?: Prisma.SortOrder;
    zReport?: Prisma.SortOrderInput | Prisma.SortOrder;
    openedAt?: Prisma.SortOrder;
    closedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ShiftCountOrderByAggregateInput;
    _avg?: Prisma.ShiftAvgOrderByAggregateInput;
    _max?: Prisma.ShiftMaxOrderByAggregateInput;
    _min?: Prisma.ShiftMinOrderByAggregateInput;
    _sum?: Prisma.ShiftSumOrderByAggregateInput;
};
export type ShiftScalarWhereWithAggregatesInput = {
    AND?: Prisma.ShiftScalarWhereWithAggregatesInput | Prisma.ShiftScalarWhereWithAggregatesInput[];
    OR?: Prisma.ShiftScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ShiftScalarWhereWithAggregatesInput | Prisma.ShiftScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Shift"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"Shift"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"Shift"> | string;
    openedBy?: Prisma.StringWithAggregatesFilter<"Shift"> | string;
    closedBy?: Prisma.StringNullableWithAggregatesFilter<"Shift"> | string | null;
    status?: Prisma.EnumShiftStatusWithAggregatesFilter<"Shift"> | $Enums.ShiftStatus;
    openingFloat?: Prisma.DecimalWithAggregatesFilter<"Shift"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedCash?: Prisma.DecimalNullableWithAggregatesFilter<"Shift"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    expectedCash?: Prisma.DecimalNullableWithAggregatesFilter<"Shift"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    variance?: Prisma.DecimalNullableWithAggregatesFilter<"Shift"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    varianceAlerted?: Prisma.BoolWithAggregatesFilter<"Shift"> | boolean;
    zReport?: Prisma.JsonNullableWithAggregatesFilter<"Shift">;
    openedAt?: Prisma.DateTimeWithAggregatesFilter<"Shift"> | Date | string;
    closedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Shift"> | Date | string | null;
};
export type ShiftCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    openedBy: string;
    closedBy?: string | null;
    status?: $Enums.ShiftStatus;
    openingFloat: runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedCash?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    expectedCash?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    variance?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    varianceAlerted?: boolean;
    zReport?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    openedAt?: Date | string;
    closedAt?: Date | string | null;
    sales?: Prisma.SaleCreateNestedManyWithoutShiftInput;
};
export type ShiftUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    openedBy: string;
    closedBy?: string | null;
    status?: $Enums.ShiftStatus;
    openingFloat: runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedCash?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    expectedCash?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    variance?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    varianceAlerted?: boolean;
    zReport?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    openedAt?: Date | string;
    closedAt?: Date | string | null;
    sales?: Prisma.SaleUncheckedCreateNestedManyWithoutShiftInput;
};
export type ShiftUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    openedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    closedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumShiftStatusFieldUpdateOperationsInput | $Enums.ShiftStatus;
    openingFloat?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedCash?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    expectedCash?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    variance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    varianceAlerted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    zReport?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    openedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    sales?: Prisma.SaleUpdateManyWithoutShiftNestedInput;
};
export type ShiftUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    openedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    closedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumShiftStatusFieldUpdateOperationsInput | $Enums.ShiftStatus;
    openingFloat?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedCash?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    expectedCash?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    variance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    varianceAlerted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    zReport?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    openedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    sales?: Prisma.SaleUncheckedUpdateManyWithoutShiftNestedInput;
};
export type ShiftCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    openedBy: string;
    closedBy?: string | null;
    status?: $Enums.ShiftStatus;
    openingFloat: runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedCash?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    expectedCash?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    variance?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    varianceAlerted?: boolean;
    zReport?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    openedAt?: Date | string;
    closedAt?: Date | string | null;
};
export type ShiftUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    openedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    closedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumShiftStatusFieldUpdateOperationsInput | $Enums.ShiftStatus;
    openingFloat?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedCash?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    expectedCash?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    variance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    varianceAlerted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    zReport?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    openedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ShiftUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    openedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    closedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumShiftStatusFieldUpdateOperationsInput | $Enums.ShiftStatus;
    openingFloat?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedCash?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    expectedCash?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    variance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    varianceAlerted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    zReport?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    openedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ShiftCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    openedBy?: Prisma.SortOrder;
    closedBy?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    openingFloat?: Prisma.SortOrder;
    countedCash?: Prisma.SortOrder;
    expectedCash?: Prisma.SortOrder;
    variance?: Prisma.SortOrder;
    varianceAlerted?: Prisma.SortOrder;
    zReport?: Prisma.SortOrder;
    openedAt?: Prisma.SortOrder;
    closedAt?: Prisma.SortOrder;
};
export type ShiftAvgOrderByAggregateInput = {
    openingFloat?: Prisma.SortOrder;
    countedCash?: Prisma.SortOrder;
    expectedCash?: Prisma.SortOrder;
    variance?: Prisma.SortOrder;
};
export type ShiftMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    openedBy?: Prisma.SortOrder;
    closedBy?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    openingFloat?: Prisma.SortOrder;
    countedCash?: Prisma.SortOrder;
    expectedCash?: Prisma.SortOrder;
    variance?: Prisma.SortOrder;
    varianceAlerted?: Prisma.SortOrder;
    openedAt?: Prisma.SortOrder;
    closedAt?: Prisma.SortOrder;
};
export type ShiftMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    openedBy?: Prisma.SortOrder;
    closedBy?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    openingFloat?: Prisma.SortOrder;
    countedCash?: Prisma.SortOrder;
    expectedCash?: Prisma.SortOrder;
    variance?: Prisma.SortOrder;
    varianceAlerted?: Prisma.SortOrder;
    openedAt?: Prisma.SortOrder;
    closedAt?: Prisma.SortOrder;
};
export type ShiftSumOrderByAggregateInput = {
    openingFloat?: Prisma.SortOrder;
    countedCash?: Prisma.SortOrder;
    expectedCash?: Prisma.SortOrder;
    variance?: Prisma.SortOrder;
};
export type ShiftNullableScalarRelationFilter = {
    is?: Prisma.ShiftWhereInput | null;
    isNot?: Prisma.ShiftWhereInput | null;
};
export type EnumShiftStatusFieldUpdateOperationsInput = {
    set?: $Enums.ShiftStatus;
};
export type ShiftCreateNestedOneWithoutSalesInput = {
    create?: Prisma.XOR<Prisma.ShiftCreateWithoutSalesInput, Prisma.ShiftUncheckedCreateWithoutSalesInput>;
    connectOrCreate?: Prisma.ShiftCreateOrConnectWithoutSalesInput;
    connect?: Prisma.ShiftWhereUniqueInput;
};
export type ShiftUpdateOneWithoutSalesNestedInput = {
    create?: Prisma.XOR<Prisma.ShiftCreateWithoutSalesInput, Prisma.ShiftUncheckedCreateWithoutSalesInput>;
    connectOrCreate?: Prisma.ShiftCreateOrConnectWithoutSalesInput;
    upsert?: Prisma.ShiftUpsertWithoutSalesInput;
    disconnect?: Prisma.ShiftWhereInput | boolean;
    delete?: Prisma.ShiftWhereInput | boolean;
    connect?: Prisma.ShiftWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ShiftUpdateToOneWithWhereWithoutSalesInput, Prisma.ShiftUpdateWithoutSalesInput>, Prisma.ShiftUncheckedUpdateWithoutSalesInput>;
};
export type ShiftCreateWithoutSalesInput = {
    id?: string;
    orgId: string;
    branchId: string;
    openedBy: string;
    closedBy?: string | null;
    status?: $Enums.ShiftStatus;
    openingFloat: runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedCash?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    expectedCash?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    variance?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    varianceAlerted?: boolean;
    zReport?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    openedAt?: Date | string;
    closedAt?: Date | string | null;
};
export type ShiftUncheckedCreateWithoutSalesInput = {
    id?: string;
    orgId: string;
    branchId: string;
    openedBy: string;
    closedBy?: string | null;
    status?: $Enums.ShiftStatus;
    openingFloat: runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedCash?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    expectedCash?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    variance?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    varianceAlerted?: boolean;
    zReport?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    openedAt?: Date | string;
    closedAt?: Date | string | null;
};
export type ShiftCreateOrConnectWithoutSalesInput = {
    where: Prisma.ShiftWhereUniqueInput;
    create: Prisma.XOR<Prisma.ShiftCreateWithoutSalesInput, Prisma.ShiftUncheckedCreateWithoutSalesInput>;
};
export type ShiftUpsertWithoutSalesInput = {
    update: Prisma.XOR<Prisma.ShiftUpdateWithoutSalesInput, Prisma.ShiftUncheckedUpdateWithoutSalesInput>;
    create: Prisma.XOR<Prisma.ShiftCreateWithoutSalesInput, Prisma.ShiftUncheckedCreateWithoutSalesInput>;
    where?: Prisma.ShiftWhereInput;
};
export type ShiftUpdateToOneWithWhereWithoutSalesInput = {
    where?: Prisma.ShiftWhereInput;
    data: Prisma.XOR<Prisma.ShiftUpdateWithoutSalesInput, Prisma.ShiftUncheckedUpdateWithoutSalesInput>;
};
export type ShiftUpdateWithoutSalesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    openedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    closedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumShiftStatusFieldUpdateOperationsInput | $Enums.ShiftStatus;
    openingFloat?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedCash?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    expectedCash?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    variance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    varianceAlerted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    zReport?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    openedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ShiftUncheckedUpdateWithoutSalesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    openedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    closedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumShiftStatusFieldUpdateOperationsInput | $Enums.ShiftStatus;
    openingFloat?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedCash?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    expectedCash?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    variance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    varianceAlerted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    zReport?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    openedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ShiftCountOutputType = {
    sales: number;
};
export type ShiftCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sales?: boolean | ShiftCountOutputTypeCountSalesArgs;
};
export type ShiftCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShiftCountOutputTypeSelect<ExtArgs> | null;
};
export type ShiftCountOutputTypeCountSalesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SaleWhereInput;
};
export type ShiftSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    openedBy?: boolean;
    closedBy?: boolean;
    status?: boolean;
    openingFloat?: boolean;
    countedCash?: boolean;
    expectedCash?: boolean;
    variance?: boolean;
    varianceAlerted?: boolean;
    zReport?: boolean;
    openedAt?: boolean;
    closedAt?: boolean;
    sales?: boolean | Prisma.Shift$salesArgs<ExtArgs>;
    _count?: boolean | Prisma.ShiftCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["shift"]>;
export type ShiftSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    openedBy?: boolean;
    closedBy?: boolean;
    status?: boolean;
    openingFloat?: boolean;
    countedCash?: boolean;
    expectedCash?: boolean;
    variance?: boolean;
    varianceAlerted?: boolean;
    zReport?: boolean;
    openedAt?: boolean;
    closedAt?: boolean;
}, ExtArgs["result"]["shift"]>;
export type ShiftSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    openedBy?: boolean;
    closedBy?: boolean;
    status?: boolean;
    openingFloat?: boolean;
    countedCash?: boolean;
    expectedCash?: boolean;
    variance?: boolean;
    varianceAlerted?: boolean;
    zReport?: boolean;
    openedAt?: boolean;
    closedAt?: boolean;
}, ExtArgs["result"]["shift"]>;
export type ShiftSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    openedBy?: boolean;
    closedBy?: boolean;
    status?: boolean;
    openingFloat?: boolean;
    countedCash?: boolean;
    expectedCash?: boolean;
    variance?: boolean;
    varianceAlerted?: boolean;
    zReport?: boolean;
    openedAt?: boolean;
    closedAt?: boolean;
};
export type ShiftOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "openedBy" | "closedBy" | "status" | "openingFloat" | "countedCash" | "expectedCash" | "variance" | "varianceAlerted" | "zReport" | "openedAt" | "closedAt", ExtArgs["result"]["shift"]>;
export type ShiftInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sales?: boolean | Prisma.Shift$salesArgs<ExtArgs>;
    _count?: boolean | Prisma.ShiftCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ShiftIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type ShiftIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $ShiftPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Shift";
    objects: {
        sales: Prisma.$SalePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        openedBy: string;
        closedBy: string | null;
        status: $Enums.ShiftStatus;
        openingFloat: runtime.Decimal;
        countedCash: runtime.Decimal | null;
        expectedCash: runtime.Decimal | null;
        variance: runtime.Decimal | null;
        varianceAlerted: boolean;
        zReport: runtime.JsonValue | null;
        openedAt: Date;
        closedAt: Date | null;
    }, ExtArgs["result"]["shift"]>;
    composites: {};
};
export type ShiftGetPayload<S extends boolean | null | undefined | ShiftDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ShiftPayload, S>;
export type ShiftCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ShiftFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ShiftCountAggregateInputType | true;
};
export interface ShiftDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Shift'];
        meta: {
            name: 'Shift';
        };
    };
    findUnique<T extends ShiftFindUniqueArgs>(args: Prisma.SelectSubset<T, ShiftFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ShiftClient<runtime.Types.Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ShiftFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ShiftFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ShiftClient<runtime.Types.Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ShiftFindFirstArgs>(args?: Prisma.SelectSubset<T, ShiftFindFirstArgs<ExtArgs>>): Prisma.Prisma__ShiftClient<runtime.Types.Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ShiftFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ShiftFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ShiftClient<runtime.Types.Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ShiftFindManyArgs>(args?: Prisma.SelectSubset<T, ShiftFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ShiftCreateArgs>(args: Prisma.SelectSubset<T, ShiftCreateArgs<ExtArgs>>): Prisma.Prisma__ShiftClient<runtime.Types.Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ShiftCreateManyArgs>(args?: Prisma.SelectSubset<T, ShiftCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ShiftCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ShiftCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ShiftDeleteArgs>(args: Prisma.SelectSubset<T, ShiftDeleteArgs<ExtArgs>>): Prisma.Prisma__ShiftClient<runtime.Types.Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ShiftUpdateArgs>(args: Prisma.SelectSubset<T, ShiftUpdateArgs<ExtArgs>>): Prisma.Prisma__ShiftClient<runtime.Types.Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ShiftDeleteManyArgs>(args?: Prisma.SelectSubset<T, ShiftDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ShiftUpdateManyArgs>(args: Prisma.SelectSubset<T, ShiftUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ShiftUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ShiftUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ShiftUpsertArgs>(args: Prisma.SelectSubset<T, ShiftUpsertArgs<ExtArgs>>): Prisma.Prisma__ShiftClient<runtime.Types.Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ShiftCountArgs>(args?: Prisma.Subset<T, ShiftCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ShiftCountAggregateOutputType> : number>;
    aggregate<T extends ShiftAggregateArgs>(args: Prisma.Subset<T, ShiftAggregateArgs>): Prisma.PrismaPromise<GetShiftAggregateType<T>>;
    groupBy<T extends ShiftGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ShiftGroupByArgs['orderBy'];
    } : {
        orderBy?: ShiftGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ShiftGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShiftGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ShiftFieldRefs;
}
export interface Prisma__ShiftClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    sales<T extends Prisma.Shift$salesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Shift$salesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ShiftFieldRefs {
    readonly id: Prisma.FieldRef<"Shift", 'String'>;
    readonly orgId: Prisma.FieldRef<"Shift", 'String'>;
    readonly branchId: Prisma.FieldRef<"Shift", 'String'>;
    readonly openedBy: Prisma.FieldRef<"Shift", 'String'>;
    readonly closedBy: Prisma.FieldRef<"Shift", 'String'>;
    readonly status: Prisma.FieldRef<"Shift", 'ShiftStatus'>;
    readonly openingFloat: Prisma.FieldRef<"Shift", 'Decimal'>;
    readonly countedCash: Prisma.FieldRef<"Shift", 'Decimal'>;
    readonly expectedCash: Prisma.FieldRef<"Shift", 'Decimal'>;
    readonly variance: Prisma.FieldRef<"Shift", 'Decimal'>;
    readonly varianceAlerted: Prisma.FieldRef<"Shift", 'Boolean'>;
    readonly zReport: Prisma.FieldRef<"Shift", 'Json'>;
    readonly openedAt: Prisma.FieldRef<"Shift", 'DateTime'>;
    readonly closedAt: Prisma.FieldRef<"Shift", 'DateTime'>;
}
export type ShiftFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShiftSelect<ExtArgs> | null;
    omit?: Prisma.ShiftOmit<ExtArgs> | null;
    include?: Prisma.ShiftInclude<ExtArgs> | null;
    where: Prisma.ShiftWhereUniqueInput;
};
export type ShiftFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShiftSelect<ExtArgs> | null;
    omit?: Prisma.ShiftOmit<ExtArgs> | null;
    include?: Prisma.ShiftInclude<ExtArgs> | null;
    where: Prisma.ShiftWhereUniqueInput;
};
export type ShiftFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShiftSelect<ExtArgs> | null;
    omit?: Prisma.ShiftOmit<ExtArgs> | null;
    include?: Prisma.ShiftInclude<ExtArgs> | null;
    where?: Prisma.ShiftWhereInput;
    orderBy?: Prisma.ShiftOrderByWithRelationInput | Prisma.ShiftOrderByWithRelationInput[];
    cursor?: Prisma.ShiftWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ShiftScalarFieldEnum | Prisma.ShiftScalarFieldEnum[];
};
export type ShiftFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShiftSelect<ExtArgs> | null;
    omit?: Prisma.ShiftOmit<ExtArgs> | null;
    include?: Prisma.ShiftInclude<ExtArgs> | null;
    where?: Prisma.ShiftWhereInput;
    orderBy?: Prisma.ShiftOrderByWithRelationInput | Prisma.ShiftOrderByWithRelationInput[];
    cursor?: Prisma.ShiftWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ShiftScalarFieldEnum | Prisma.ShiftScalarFieldEnum[];
};
export type ShiftFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShiftSelect<ExtArgs> | null;
    omit?: Prisma.ShiftOmit<ExtArgs> | null;
    include?: Prisma.ShiftInclude<ExtArgs> | null;
    where?: Prisma.ShiftWhereInput;
    orderBy?: Prisma.ShiftOrderByWithRelationInput | Prisma.ShiftOrderByWithRelationInput[];
    cursor?: Prisma.ShiftWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ShiftScalarFieldEnum | Prisma.ShiftScalarFieldEnum[];
};
export type ShiftCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShiftSelect<ExtArgs> | null;
    omit?: Prisma.ShiftOmit<ExtArgs> | null;
    include?: Prisma.ShiftInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ShiftCreateInput, Prisma.ShiftUncheckedCreateInput>;
};
export type ShiftCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ShiftCreateManyInput | Prisma.ShiftCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ShiftCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShiftSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ShiftOmit<ExtArgs> | null;
    data: Prisma.ShiftCreateManyInput | Prisma.ShiftCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ShiftUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShiftSelect<ExtArgs> | null;
    omit?: Prisma.ShiftOmit<ExtArgs> | null;
    include?: Prisma.ShiftInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ShiftUpdateInput, Prisma.ShiftUncheckedUpdateInput>;
    where: Prisma.ShiftWhereUniqueInput;
};
export type ShiftUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ShiftUpdateManyMutationInput, Prisma.ShiftUncheckedUpdateManyInput>;
    where?: Prisma.ShiftWhereInput;
    limit?: number;
};
export type ShiftUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShiftSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ShiftOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ShiftUpdateManyMutationInput, Prisma.ShiftUncheckedUpdateManyInput>;
    where?: Prisma.ShiftWhereInput;
    limit?: number;
};
export type ShiftUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShiftSelect<ExtArgs> | null;
    omit?: Prisma.ShiftOmit<ExtArgs> | null;
    include?: Prisma.ShiftInclude<ExtArgs> | null;
    where: Prisma.ShiftWhereUniqueInput;
    create: Prisma.XOR<Prisma.ShiftCreateInput, Prisma.ShiftUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ShiftUpdateInput, Prisma.ShiftUncheckedUpdateInput>;
};
export type ShiftDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShiftSelect<ExtArgs> | null;
    omit?: Prisma.ShiftOmit<ExtArgs> | null;
    include?: Prisma.ShiftInclude<ExtArgs> | null;
    where: Prisma.ShiftWhereUniqueInput;
};
export type ShiftDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ShiftWhereInput;
    limit?: number;
};
export type Shift$salesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleSelect<ExtArgs> | null;
    omit?: Prisma.SaleOmit<ExtArgs> | null;
    include?: Prisma.SaleInclude<ExtArgs> | null;
    where?: Prisma.SaleWhereInput;
    orderBy?: Prisma.SaleOrderByWithRelationInput | Prisma.SaleOrderByWithRelationInput[];
    cursor?: Prisma.SaleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SaleScalarFieldEnum | Prisma.SaleScalarFieldEnum[];
};
export type ShiftDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShiftSelect<ExtArgs> | null;
    omit?: Prisma.ShiftOmit<ExtArgs> | null;
    include?: Prisma.ShiftInclude<ExtArgs> | null;
};
