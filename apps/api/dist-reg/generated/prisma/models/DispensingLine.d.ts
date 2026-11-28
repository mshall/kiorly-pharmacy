import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type DispensingLineModel = runtime.Types.Result.DefaultSelection<Prisma.$DispensingLinePayload>;
export type AggregateDispensingLine = {
    _count: DispensingLineCountAggregateOutputType | null;
    _avg: DispensingLineAvgAggregateOutputType | null;
    _sum: DispensingLineSumAggregateOutputType | null;
    _min: DispensingLineMinAggregateOutputType | null;
    _max: DispensingLineMaxAggregateOutputType | null;
};
export type DispensingLineAvgAggregateOutputType = {
    quantity: number | null;
    unitPrice: runtime.Decimal | null;
    vatRate: runtime.Decimal | null;
};
export type DispensingLineSumAggregateOutputType = {
    quantity: number | null;
    unitPrice: runtime.Decimal | null;
    vatRate: runtime.Decimal | null;
};
export type DispensingLineMinAggregateOutputType = {
    id: string | null;
    dispensingId: string | null;
    drugId: string | null;
    lotId: string | null;
    quantity: number | null;
    prescriptionLineId: string | null;
    substitutedFromDrugId: string | null;
    substitutionConsent: boolean | null;
    substitutionDecidedBy: string | null;
    unitPrice: runtime.Decimal | null;
    vatRate: runtime.Decimal | null;
};
export type DispensingLineMaxAggregateOutputType = {
    id: string | null;
    dispensingId: string | null;
    drugId: string | null;
    lotId: string | null;
    quantity: number | null;
    prescriptionLineId: string | null;
    substitutedFromDrugId: string | null;
    substitutionConsent: boolean | null;
    substitutionDecidedBy: string | null;
    unitPrice: runtime.Decimal | null;
    vatRate: runtime.Decimal | null;
};
export type DispensingLineCountAggregateOutputType = {
    id: number;
    dispensingId: number;
    drugId: number;
    lotId: number;
    quantity: number;
    prescriptionLineId: number;
    substitutedFromDrugId: number;
    substitutionConsent: number;
    substitutionDecidedBy: number;
    unitPrice: number;
    vatRate: number;
    _all: number;
};
export type DispensingLineAvgAggregateInputType = {
    quantity?: true;
    unitPrice?: true;
    vatRate?: true;
};
export type DispensingLineSumAggregateInputType = {
    quantity?: true;
    unitPrice?: true;
    vatRate?: true;
};
export type DispensingLineMinAggregateInputType = {
    id?: true;
    dispensingId?: true;
    drugId?: true;
    lotId?: true;
    quantity?: true;
    prescriptionLineId?: true;
    substitutedFromDrugId?: true;
    substitutionConsent?: true;
    substitutionDecidedBy?: true;
    unitPrice?: true;
    vatRate?: true;
};
export type DispensingLineMaxAggregateInputType = {
    id?: true;
    dispensingId?: true;
    drugId?: true;
    lotId?: true;
    quantity?: true;
    prescriptionLineId?: true;
    substitutedFromDrugId?: true;
    substitutionConsent?: true;
    substitutionDecidedBy?: true;
    unitPrice?: true;
    vatRate?: true;
};
export type DispensingLineCountAggregateInputType = {
    id?: true;
    dispensingId?: true;
    drugId?: true;
    lotId?: true;
    quantity?: true;
    prescriptionLineId?: true;
    substitutedFromDrugId?: true;
    substitutionConsent?: true;
    substitutionDecidedBy?: true;
    unitPrice?: true;
    vatRate?: true;
    _all?: true;
};
export type DispensingLineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DispensingLineWhereInput;
    orderBy?: Prisma.DispensingLineOrderByWithRelationInput | Prisma.DispensingLineOrderByWithRelationInput[];
    cursor?: Prisma.DispensingLineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DispensingLineCountAggregateInputType;
    _avg?: DispensingLineAvgAggregateInputType;
    _sum?: DispensingLineSumAggregateInputType;
    _min?: DispensingLineMinAggregateInputType;
    _max?: DispensingLineMaxAggregateInputType;
};
export type GetDispensingLineAggregateType<T extends DispensingLineAggregateArgs> = {
    [P in keyof T & keyof AggregateDispensingLine]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDispensingLine[P]> : Prisma.GetScalarType<T[P], AggregateDispensingLine[P]>;
};
export type DispensingLineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DispensingLineWhereInput;
    orderBy?: Prisma.DispensingLineOrderByWithAggregationInput | Prisma.DispensingLineOrderByWithAggregationInput[];
    by: Prisma.DispensingLineScalarFieldEnum[] | Prisma.DispensingLineScalarFieldEnum;
    having?: Prisma.DispensingLineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DispensingLineCountAggregateInputType | true;
    _avg?: DispensingLineAvgAggregateInputType;
    _sum?: DispensingLineSumAggregateInputType;
    _min?: DispensingLineMinAggregateInputType;
    _max?: DispensingLineMaxAggregateInputType;
};
export type DispensingLineGroupByOutputType = {
    id: string;
    dispensingId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    prescriptionLineId: string | null;
    substitutedFromDrugId: string | null;
    substitutionConsent: boolean;
    substitutionDecidedBy: string | null;
    unitPrice: runtime.Decimal;
    vatRate: runtime.Decimal;
    _count: DispensingLineCountAggregateOutputType | null;
    _avg: DispensingLineAvgAggregateOutputType | null;
    _sum: DispensingLineSumAggregateOutputType | null;
    _min: DispensingLineMinAggregateOutputType | null;
    _max: DispensingLineMaxAggregateOutputType | null;
};
export type GetDispensingLineGroupByPayload<T extends DispensingLineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DispensingLineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DispensingLineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DispensingLineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DispensingLineGroupByOutputType[P]>;
}>>;
export type DispensingLineWhereInput = {
    AND?: Prisma.DispensingLineWhereInput | Prisma.DispensingLineWhereInput[];
    OR?: Prisma.DispensingLineWhereInput[];
    NOT?: Prisma.DispensingLineWhereInput | Prisma.DispensingLineWhereInput[];
    id?: Prisma.StringFilter<"DispensingLine"> | string;
    dispensingId?: Prisma.StringFilter<"DispensingLine"> | string;
    drugId?: Prisma.StringFilter<"DispensingLine"> | string;
    lotId?: Prisma.StringFilter<"DispensingLine"> | string;
    quantity?: Prisma.IntFilter<"DispensingLine"> | number;
    prescriptionLineId?: Prisma.StringNullableFilter<"DispensingLine"> | string | null;
    substitutedFromDrugId?: Prisma.StringNullableFilter<"DispensingLine"> | string | null;
    substitutionConsent?: Prisma.BoolFilter<"DispensingLine"> | boolean;
    substitutionDecidedBy?: Prisma.StringNullableFilter<"DispensingLine"> | string | null;
    unitPrice?: Prisma.DecimalFilter<"DispensingLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFilter<"DispensingLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    dispensing?: Prisma.XOR<Prisma.DispensingScalarRelationFilter, Prisma.DispensingWhereInput>;
    lot?: Prisma.XOR<Prisma.StockLotScalarRelationFilter, Prisma.StockLotWhereInput>;
};
export type DispensingLineOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    dispensingId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    prescriptionLineId?: Prisma.SortOrderInput | Prisma.SortOrder;
    substitutedFromDrugId?: Prisma.SortOrderInput | Prisma.SortOrder;
    substitutionConsent?: Prisma.SortOrder;
    substitutionDecidedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    vatRate?: Prisma.SortOrder;
    dispensing?: Prisma.DispensingOrderByWithRelationInput;
    lot?: Prisma.StockLotOrderByWithRelationInput;
};
export type DispensingLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.DispensingLineWhereInput | Prisma.DispensingLineWhereInput[];
    OR?: Prisma.DispensingLineWhereInput[];
    NOT?: Prisma.DispensingLineWhereInput | Prisma.DispensingLineWhereInput[];
    dispensingId?: Prisma.StringFilter<"DispensingLine"> | string;
    drugId?: Prisma.StringFilter<"DispensingLine"> | string;
    lotId?: Prisma.StringFilter<"DispensingLine"> | string;
    quantity?: Prisma.IntFilter<"DispensingLine"> | number;
    prescriptionLineId?: Prisma.StringNullableFilter<"DispensingLine"> | string | null;
    substitutedFromDrugId?: Prisma.StringNullableFilter<"DispensingLine"> | string | null;
    substitutionConsent?: Prisma.BoolFilter<"DispensingLine"> | boolean;
    substitutionDecidedBy?: Prisma.StringNullableFilter<"DispensingLine"> | string | null;
    unitPrice?: Prisma.DecimalFilter<"DispensingLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFilter<"DispensingLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    dispensing?: Prisma.XOR<Prisma.DispensingScalarRelationFilter, Prisma.DispensingWhereInput>;
    lot?: Prisma.XOR<Prisma.StockLotScalarRelationFilter, Prisma.StockLotWhereInput>;
}, "id">;
export type DispensingLineOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    dispensingId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    prescriptionLineId?: Prisma.SortOrderInput | Prisma.SortOrder;
    substitutedFromDrugId?: Prisma.SortOrderInput | Prisma.SortOrder;
    substitutionConsent?: Prisma.SortOrder;
    substitutionDecidedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    vatRate?: Prisma.SortOrder;
    _count?: Prisma.DispensingLineCountOrderByAggregateInput;
    _avg?: Prisma.DispensingLineAvgOrderByAggregateInput;
    _max?: Prisma.DispensingLineMaxOrderByAggregateInput;
    _min?: Prisma.DispensingLineMinOrderByAggregateInput;
    _sum?: Prisma.DispensingLineSumOrderByAggregateInput;
};
export type DispensingLineScalarWhereWithAggregatesInput = {
    AND?: Prisma.DispensingLineScalarWhereWithAggregatesInput | Prisma.DispensingLineScalarWhereWithAggregatesInput[];
    OR?: Prisma.DispensingLineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DispensingLineScalarWhereWithAggregatesInput | Prisma.DispensingLineScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"DispensingLine"> | string;
    dispensingId?: Prisma.StringWithAggregatesFilter<"DispensingLine"> | string;
    drugId?: Prisma.StringWithAggregatesFilter<"DispensingLine"> | string;
    lotId?: Prisma.StringWithAggregatesFilter<"DispensingLine"> | string;
    quantity?: Prisma.IntWithAggregatesFilter<"DispensingLine"> | number;
    prescriptionLineId?: Prisma.StringNullableWithAggregatesFilter<"DispensingLine"> | string | null;
    substitutedFromDrugId?: Prisma.StringNullableWithAggregatesFilter<"DispensingLine"> | string | null;
    substitutionConsent?: Prisma.BoolWithAggregatesFilter<"DispensingLine"> | boolean;
    substitutionDecidedBy?: Prisma.StringNullableWithAggregatesFilter<"DispensingLine"> | string | null;
    unitPrice?: Prisma.DecimalWithAggregatesFilter<"DispensingLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalWithAggregatesFilter<"DispensingLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DispensingLineCreateInput = {
    id?: string;
    drugId: string;
    quantity: number;
    prescriptionLineId?: string | null;
    substitutedFromDrugId?: string | null;
    substitutionConsent?: boolean;
    substitutionDecidedBy?: string | null;
    unitPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    dispensing: Prisma.DispensingCreateNestedOneWithoutLinesInput;
    lot: Prisma.StockLotCreateNestedOneWithoutDispensingLinesInput;
};
export type DispensingLineUncheckedCreateInput = {
    id?: string;
    dispensingId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    prescriptionLineId?: string | null;
    substitutedFromDrugId?: string | null;
    substitutionConsent?: boolean;
    substitutionDecidedBy?: string | null;
    unitPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DispensingLineUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    prescriptionLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutedFromDrugId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutionConsent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    substitutionDecidedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    dispensing?: Prisma.DispensingUpdateOneRequiredWithoutLinesNestedInput;
    lot?: Prisma.StockLotUpdateOneRequiredWithoutDispensingLinesNestedInput;
};
export type DispensingLineUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dispensingId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    prescriptionLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutedFromDrugId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutionConsent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    substitutionDecidedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DispensingLineCreateManyInput = {
    id?: string;
    dispensingId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    prescriptionLineId?: string | null;
    substitutedFromDrugId?: string | null;
    substitutionConsent?: boolean;
    substitutionDecidedBy?: string | null;
    unitPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DispensingLineUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    prescriptionLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutedFromDrugId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutionConsent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    substitutionDecidedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DispensingLineUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dispensingId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    prescriptionLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutedFromDrugId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutionConsent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    substitutionDecidedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DispensingLineListRelationFilter = {
    every?: Prisma.DispensingLineWhereInput;
    some?: Prisma.DispensingLineWhereInput;
    none?: Prisma.DispensingLineWhereInput;
};
export type DispensingLineOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DispensingLineCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    dispensingId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    prescriptionLineId?: Prisma.SortOrder;
    substitutedFromDrugId?: Prisma.SortOrder;
    substitutionConsent?: Prisma.SortOrder;
    substitutionDecidedBy?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    vatRate?: Prisma.SortOrder;
};
export type DispensingLineAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    vatRate?: Prisma.SortOrder;
};
export type DispensingLineMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    dispensingId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    prescriptionLineId?: Prisma.SortOrder;
    substitutedFromDrugId?: Prisma.SortOrder;
    substitutionConsent?: Prisma.SortOrder;
    substitutionDecidedBy?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    vatRate?: Prisma.SortOrder;
};
export type DispensingLineMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    dispensingId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    prescriptionLineId?: Prisma.SortOrder;
    substitutedFromDrugId?: Prisma.SortOrder;
    substitutionConsent?: Prisma.SortOrder;
    substitutionDecidedBy?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    vatRate?: Prisma.SortOrder;
};
export type DispensingLineSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    unitPrice?: Prisma.SortOrder;
    vatRate?: Prisma.SortOrder;
};
export type DispensingLineCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.DispensingLineCreateWithoutLotInput, Prisma.DispensingLineUncheckedCreateWithoutLotInput> | Prisma.DispensingLineCreateWithoutLotInput[] | Prisma.DispensingLineUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.DispensingLineCreateOrConnectWithoutLotInput | Prisma.DispensingLineCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.DispensingLineCreateManyLotInputEnvelope;
    connect?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
};
export type DispensingLineUncheckedCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.DispensingLineCreateWithoutLotInput, Prisma.DispensingLineUncheckedCreateWithoutLotInput> | Prisma.DispensingLineCreateWithoutLotInput[] | Prisma.DispensingLineUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.DispensingLineCreateOrConnectWithoutLotInput | Prisma.DispensingLineCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.DispensingLineCreateManyLotInputEnvelope;
    connect?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
};
export type DispensingLineUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.DispensingLineCreateWithoutLotInput, Prisma.DispensingLineUncheckedCreateWithoutLotInput> | Prisma.DispensingLineCreateWithoutLotInput[] | Prisma.DispensingLineUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.DispensingLineCreateOrConnectWithoutLotInput | Prisma.DispensingLineCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.DispensingLineUpsertWithWhereUniqueWithoutLotInput | Prisma.DispensingLineUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.DispensingLineCreateManyLotInputEnvelope;
    set?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    disconnect?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    delete?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    connect?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    update?: Prisma.DispensingLineUpdateWithWhereUniqueWithoutLotInput | Prisma.DispensingLineUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.DispensingLineUpdateManyWithWhereWithoutLotInput | Prisma.DispensingLineUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.DispensingLineScalarWhereInput | Prisma.DispensingLineScalarWhereInput[];
};
export type DispensingLineUncheckedUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.DispensingLineCreateWithoutLotInput, Prisma.DispensingLineUncheckedCreateWithoutLotInput> | Prisma.DispensingLineCreateWithoutLotInput[] | Prisma.DispensingLineUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.DispensingLineCreateOrConnectWithoutLotInput | Prisma.DispensingLineCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.DispensingLineUpsertWithWhereUniqueWithoutLotInput | Prisma.DispensingLineUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.DispensingLineCreateManyLotInputEnvelope;
    set?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    disconnect?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    delete?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    connect?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    update?: Prisma.DispensingLineUpdateWithWhereUniqueWithoutLotInput | Prisma.DispensingLineUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.DispensingLineUpdateManyWithWhereWithoutLotInput | Prisma.DispensingLineUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.DispensingLineScalarWhereInput | Prisma.DispensingLineScalarWhereInput[];
};
export type DispensingLineCreateNestedManyWithoutDispensingInput = {
    create?: Prisma.XOR<Prisma.DispensingLineCreateWithoutDispensingInput, Prisma.DispensingLineUncheckedCreateWithoutDispensingInput> | Prisma.DispensingLineCreateWithoutDispensingInput[] | Prisma.DispensingLineUncheckedCreateWithoutDispensingInput[];
    connectOrCreate?: Prisma.DispensingLineCreateOrConnectWithoutDispensingInput | Prisma.DispensingLineCreateOrConnectWithoutDispensingInput[];
    createMany?: Prisma.DispensingLineCreateManyDispensingInputEnvelope;
    connect?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
};
export type DispensingLineUncheckedCreateNestedManyWithoutDispensingInput = {
    create?: Prisma.XOR<Prisma.DispensingLineCreateWithoutDispensingInput, Prisma.DispensingLineUncheckedCreateWithoutDispensingInput> | Prisma.DispensingLineCreateWithoutDispensingInput[] | Prisma.DispensingLineUncheckedCreateWithoutDispensingInput[];
    connectOrCreate?: Prisma.DispensingLineCreateOrConnectWithoutDispensingInput | Prisma.DispensingLineCreateOrConnectWithoutDispensingInput[];
    createMany?: Prisma.DispensingLineCreateManyDispensingInputEnvelope;
    connect?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
};
export type DispensingLineUpdateManyWithoutDispensingNestedInput = {
    create?: Prisma.XOR<Prisma.DispensingLineCreateWithoutDispensingInput, Prisma.DispensingLineUncheckedCreateWithoutDispensingInput> | Prisma.DispensingLineCreateWithoutDispensingInput[] | Prisma.DispensingLineUncheckedCreateWithoutDispensingInput[];
    connectOrCreate?: Prisma.DispensingLineCreateOrConnectWithoutDispensingInput | Prisma.DispensingLineCreateOrConnectWithoutDispensingInput[];
    upsert?: Prisma.DispensingLineUpsertWithWhereUniqueWithoutDispensingInput | Prisma.DispensingLineUpsertWithWhereUniqueWithoutDispensingInput[];
    createMany?: Prisma.DispensingLineCreateManyDispensingInputEnvelope;
    set?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    disconnect?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    delete?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    connect?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    update?: Prisma.DispensingLineUpdateWithWhereUniqueWithoutDispensingInput | Prisma.DispensingLineUpdateWithWhereUniqueWithoutDispensingInput[];
    updateMany?: Prisma.DispensingLineUpdateManyWithWhereWithoutDispensingInput | Prisma.DispensingLineUpdateManyWithWhereWithoutDispensingInput[];
    deleteMany?: Prisma.DispensingLineScalarWhereInput | Prisma.DispensingLineScalarWhereInput[];
};
export type DispensingLineUncheckedUpdateManyWithoutDispensingNestedInput = {
    create?: Prisma.XOR<Prisma.DispensingLineCreateWithoutDispensingInput, Prisma.DispensingLineUncheckedCreateWithoutDispensingInput> | Prisma.DispensingLineCreateWithoutDispensingInput[] | Prisma.DispensingLineUncheckedCreateWithoutDispensingInput[];
    connectOrCreate?: Prisma.DispensingLineCreateOrConnectWithoutDispensingInput | Prisma.DispensingLineCreateOrConnectWithoutDispensingInput[];
    upsert?: Prisma.DispensingLineUpsertWithWhereUniqueWithoutDispensingInput | Prisma.DispensingLineUpsertWithWhereUniqueWithoutDispensingInput[];
    createMany?: Prisma.DispensingLineCreateManyDispensingInputEnvelope;
    set?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    disconnect?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    delete?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    connect?: Prisma.DispensingLineWhereUniqueInput | Prisma.DispensingLineWhereUniqueInput[];
    update?: Prisma.DispensingLineUpdateWithWhereUniqueWithoutDispensingInput | Prisma.DispensingLineUpdateWithWhereUniqueWithoutDispensingInput[];
    updateMany?: Prisma.DispensingLineUpdateManyWithWhereWithoutDispensingInput | Prisma.DispensingLineUpdateManyWithWhereWithoutDispensingInput[];
    deleteMany?: Prisma.DispensingLineScalarWhereInput | Prisma.DispensingLineScalarWhereInput[];
};
export type DispensingLineCreateWithoutLotInput = {
    id?: string;
    drugId: string;
    quantity: number;
    prescriptionLineId?: string | null;
    substitutedFromDrugId?: string | null;
    substitutionConsent?: boolean;
    substitutionDecidedBy?: string | null;
    unitPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    dispensing: Prisma.DispensingCreateNestedOneWithoutLinesInput;
};
export type DispensingLineUncheckedCreateWithoutLotInput = {
    id?: string;
    dispensingId: string;
    drugId: string;
    quantity: number;
    prescriptionLineId?: string | null;
    substitutedFromDrugId?: string | null;
    substitutionConsent?: boolean;
    substitutionDecidedBy?: string | null;
    unitPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DispensingLineCreateOrConnectWithoutLotInput = {
    where: Prisma.DispensingLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.DispensingLineCreateWithoutLotInput, Prisma.DispensingLineUncheckedCreateWithoutLotInput>;
};
export type DispensingLineCreateManyLotInputEnvelope = {
    data: Prisma.DispensingLineCreateManyLotInput | Prisma.DispensingLineCreateManyLotInput[];
    skipDuplicates?: boolean;
};
export type DispensingLineUpsertWithWhereUniqueWithoutLotInput = {
    where: Prisma.DispensingLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.DispensingLineUpdateWithoutLotInput, Prisma.DispensingLineUncheckedUpdateWithoutLotInput>;
    create: Prisma.XOR<Prisma.DispensingLineCreateWithoutLotInput, Prisma.DispensingLineUncheckedCreateWithoutLotInput>;
};
export type DispensingLineUpdateWithWhereUniqueWithoutLotInput = {
    where: Prisma.DispensingLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.DispensingLineUpdateWithoutLotInput, Prisma.DispensingLineUncheckedUpdateWithoutLotInput>;
};
export type DispensingLineUpdateManyWithWhereWithoutLotInput = {
    where: Prisma.DispensingLineScalarWhereInput;
    data: Prisma.XOR<Prisma.DispensingLineUpdateManyMutationInput, Prisma.DispensingLineUncheckedUpdateManyWithoutLotInput>;
};
export type DispensingLineScalarWhereInput = {
    AND?: Prisma.DispensingLineScalarWhereInput | Prisma.DispensingLineScalarWhereInput[];
    OR?: Prisma.DispensingLineScalarWhereInput[];
    NOT?: Prisma.DispensingLineScalarWhereInput | Prisma.DispensingLineScalarWhereInput[];
    id?: Prisma.StringFilter<"DispensingLine"> | string;
    dispensingId?: Prisma.StringFilter<"DispensingLine"> | string;
    drugId?: Prisma.StringFilter<"DispensingLine"> | string;
    lotId?: Prisma.StringFilter<"DispensingLine"> | string;
    quantity?: Prisma.IntFilter<"DispensingLine"> | number;
    prescriptionLineId?: Prisma.StringNullableFilter<"DispensingLine"> | string | null;
    substitutedFromDrugId?: Prisma.StringNullableFilter<"DispensingLine"> | string | null;
    substitutionConsent?: Prisma.BoolFilter<"DispensingLine"> | boolean;
    substitutionDecidedBy?: Prisma.StringNullableFilter<"DispensingLine"> | string | null;
    unitPrice?: Prisma.DecimalFilter<"DispensingLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFilter<"DispensingLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DispensingLineCreateWithoutDispensingInput = {
    id?: string;
    drugId: string;
    quantity: number;
    prescriptionLineId?: string | null;
    substitutedFromDrugId?: string | null;
    substitutionConsent?: boolean;
    substitutionDecidedBy?: string | null;
    unitPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    lot: Prisma.StockLotCreateNestedOneWithoutDispensingLinesInput;
};
export type DispensingLineUncheckedCreateWithoutDispensingInput = {
    id?: string;
    drugId: string;
    lotId: string;
    quantity: number;
    prescriptionLineId?: string | null;
    substitutedFromDrugId?: string | null;
    substitutionConsent?: boolean;
    substitutionDecidedBy?: string | null;
    unitPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DispensingLineCreateOrConnectWithoutDispensingInput = {
    where: Prisma.DispensingLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.DispensingLineCreateWithoutDispensingInput, Prisma.DispensingLineUncheckedCreateWithoutDispensingInput>;
};
export type DispensingLineCreateManyDispensingInputEnvelope = {
    data: Prisma.DispensingLineCreateManyDispensingInput | Prisma.DispensingLineCreateManyDispensingInput[];
    skipDuplicates?: boolean;
};
export type DispensingLineUpsertWithWhereUniqueWithoutDispensingInput = {
    where: Prisma.DispensingLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.DispensingLineUpdateWithoutDispensingInput, Prisma.DispensingLineUncheckedUpdateWithoutDispensingInput>;
    create: Prisma.XOR<Prisma.DispensingLineCreateWithoutDispensingInput, Prisma.DispensingLineUncheckedCreateWithoutDispensingInput>;
};
export type DispensingLineUpdateWithWhereUniqueWithoutDispensingInput = {
    where: Prisma.DispensingLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.DispensingLineUpdateWithoutDispensingInput, Prisma.DispensingLineUncheckedUpdateWithoutDispensingInput>;
};
export type DispensingLineUpdateManyWithWhereWithoutDispensingInput = {
    where: Prisma.DispensingLineScalarWhereInput;
    data: Prisma.XOR<Prisma.DispensingLineUpdateManyMutationInput, Prisma.DispensingLineUncheckedUpdateManyWithoutDispensingInput>;
};
export type DispensingLineCreateManyLotInput = {
    id?: string;
    dispensingId: string;
    drugId: string;
    quantity: number;
    prescriptionLineId?: string | null;
    substitutedFromDrugId?: string | null;
    substitutionConsent?: boolean;
    substitutionDecidedBy?: string | null;
    unitPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DispensingLineUpdateWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    prescriptionLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutedFromDrugId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutionConsent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    substitutionDecidedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    dispensing?: Prisma.DispensingUpdateOneRequiredWithoutLinesNestedInput;
};
export type DispensingLineUncheckedUpdateWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dispensingId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    prescriptionLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutedFromDrugId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutionConsent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    substitutionDecidedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DispensingLineUncheckedUpdateManyWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dispensingId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    prescriptionLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutedFromDrugId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutionConsent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    substitutionDecidedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DispensingLineCreateManyDispensingInput = {
    id?: string;
    drugId: string;
    lotId: string;
    quantity: number;
    prescriptionLineId?: string | null;
    substitutedFromDrugId?: string | null;
    substitutionConsent?: boolean;
    substitutionDecidedBy?: string | null;
    unitPrice?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DispensingLineUpdateWithoutDispensingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    prescriptionLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutedFromDrugId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutionConsent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    substitutionDecidedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    lot?: Prisma.StockLotUpdateOneRequiredWithoutDispensingLinesNestedInput;
};
export type DispensingLineUncheckedUpdateWithoutDispensingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    prescriptionLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutedFromDrugId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutionConsent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    substitutionDecidedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DispensingLineUncheckedUpdateManyWithoutDispensingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    prescriptionLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutedFromDrugId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    substitutionConsent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    substitutionDecidedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unitPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    vatRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DispensingLineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    dispensingId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    prescriptionLineId?: boolean;
    substitutedFromDrugId?: boolean;
    substitutionConsent?: boolean;
    substitutionDecidedBy?: boolean;
    unitPrice?: boolean;
    vatRate?: boolean;
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["dispensingLine"]>;
export type DispensingLineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    dispensingId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    prescriptionLineId?: boolean;
    substitutedFromDrugId?: boolean;
    substitutionConsent?: boolean;
    substitutionDecidedBy?: boolean;
    unitPrice?: boolean;
    vatRate?: boolean;
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["dispensingLine"]>;
export type DispensingLineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    dispensingId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    prescriptionLineId?: boolean;
    substitutedFromDrugId?: boolean;
    substitutionConsent?: boolean;
    substitutionDecidedBy?: boolean;
    unitPrice?: boolean;
    vatRate?: boolean;
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["dispensingLine"]>;
export type DispensingLineSelectScalar = {
    id?: boolean;
    dispensingId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    prescriptionLineId?: boolean;
    substitutedFromDrugId?: boolean;
    substitutionConsent?: boolean;
    substitutionDecidedBy?: boolean;
    unitPrice?: boolean;
    vatRate?: boolean;
};
export type DispensingLineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "dispensingId" | "drugId" | "lotId" | "quantity" | "prescriptionLineId" | "substitutedFromDrugId" | "substitutionConsent" | "substitutionDecidedBy" | "unitPrice" | "vatRate", ExtArgs["result"]["dispensingLine"]>;
export type DispensingLineInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
};
export type DispensingLineIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
};
export type DispensingLineIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
    lot?: boolean | Prisma.StockLotDefaultArgs<ExtArgs>;
};
export type $DispensingLinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DispensingLine";
    objects: {
        dispensing: Prisma.$DispensingPayload<ExtArgs>;
        lot: Prisma.$StockLotPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        dispensingId: string;
        drugId: string;
        lotId: string;
        quantity: number;
        prescriptionLineId: string | null;
        substitutedFromDrugId: string | null;
        substitutionConsent: boolean;
        substitutionDecidedBy: string | null;
        unitPrice: runtime.Decimal;
        vatRate: runtime.Decimal;
    }, ExtArgs["result"]["dispensingLine"]>;
    composites: {};
};
export type DispensingLineGetPayload<S extends boolean | null | undefined | DispensingLineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DispensingLinePayload, S>;
export type DispensingLineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DispensingLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DispensingLineCountAggregateInputType | true;
};
export interface DispensingLineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DispensingLine'];
        meta: {
            name: 'DispensingLine';
        };
    };
    findUnique<T extends DispensingLineFindUniqueArgs>(args: Prisma.SelectSubset<T, DispensingLineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DispensingLineClient<runtime.Types.Result.GetResult<Prisma.$DispensingLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DispensingLineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DispensingLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DispensingLineClient<runtime.Types.Result.GetResult<Prisma.$DispensingLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DispensingLineFindFirstArgs>(args?: Prisma.SelectSubset<T, DispensingLineFindFirstArgs<ExtArgs>>): Prisma.Prisma__DispensingLineClient<runtime.Types.Result.GetResult<Prisma.$DispensingLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DispensingLineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DispensingLineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DispensingLineClient<runtime.Types.Result.GetResult<Prisma.$DispensingLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DispensingLineFindManyArgs>(args?: Prisma.SelectSubset<T, DispensingLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DispensingLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DispensingLineCreateArgs>(args: Prisma.SelectSubset<T, DispensingLineCreateArgs<ExtArgs>>): Prisma.Prisma__DispensingLineClient<runtime.Types.Result.GetResult<Prisma.$DispensingLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DispensingLineCreateManyArgs>(args?: Prisma.SelectSubset<T, DispensingLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DispensingLineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DispensingLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DispensingLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DispensingLineDeleteArgs>(args: Prisma.SelectSubset<T, DispensingLineDeleteArgs<ExtArgs>>): Prisma.Prisma__DispensingLineClient<runtime.Types.Result.GetResult<Prisma.$DispensingLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DispensingLineUpdateArgs>(args: Prisma.SelectSubset<T, DispensingLineUpdateArgs<ExtArgs>>): Prisma.Prisma__DispensingLineClient<runtime.Types.Result.GetResult<Prisma.$DispensingLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DispensingLineDeleteManyArgs>(args?: Prisma.SelectSubset<T, DispensingLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DispensingLineUpdateManyArgs>(args: Prisma.SelectSubset<T, DispensingLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DispensingLineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DispensingLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DispensingLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DispensingLineUpsertArgs>(args: Prisma.SelectSubset<T, DispensingLineUpsertArgs<ExtArgs>>): Prisma.Prisma__DispensingLineClient<runtime.Types.Result.GetResult<Prisma.$DispensingLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DispensingLineCountArgs>(args?: Prisma.Subset<T, DispensingLineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DispensingLineCountAggregateOutputType> : number>;
    aggregate<T extends DispensingLineAggregateArgs>(args: Prisma.Subset<T, DispensingLineAggregateArgs>): Prisma.PrismaPromise<GetDispensingLineAggregateType<T>>;
    groupBy<T extends DispensingLineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DispensingLineGroupByArgs['orderBy'];
    } : {
        orderBy?: DispensingLineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DispensingLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDispensingLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DispensingLineFieldRefs;
}
export interface Prisma__DispensingLineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    dispensing<T extends Prisma.DispensingDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DispensingDefaultArgs<ExtArgs>>): Prisma.Prisma__DispensingClient<runtime.Types.Result.GetResult<Prisma.$DispensingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    lot<T extends Prisma.StockLotDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.StockLotDefaultArgs<ExtArgs>>): Prisma.Prisma__StockLotClient<runtime.Types.Result.GetResult<Prisma.$StockLotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DispensingLineFieldRefs {
    readonly id: Prisma.FieldRef<"DispensingLine", 'String'>;
    readonly dispensingId: Prisma.FieldRef<"DispensingLine", 'String'>;
    readonly drugId: Prisma.FieldRef<"DispensingLine", 'String'>;
    readonly lotId: Prisma.FieldRef<"DispensingLine", 'String'>;
    readonly quantity: Prisma.FieldRef<"DispensingLine", 'Int'>;
    readonly prescriptionLineId: Prisma.FieldRef<"DispensingLine", 'String'>;
    readonly substitutedFromDrugId: Prisma.FieldRef<"DispensingLine", 'String'>;
    readonly substitutionConsent: Prisma.FieldRef<"DispensingLine", 'Boolean'>;
    readonly substitutionDecidedBy: Prisma.FieldRef<"DispensingLine", 'String'>;
    readonly unitPrice: Prisma.FieldRef<"DispensingLine", 'Decimal'>;
    readonly vatRate: Prisma.FieldRef<"DispensingLine", 'Decimal'>;
}
export type DispensingLineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DispensingLineSelect<ExtArgs> | null;
    omit?: Prisma.DispensingLineOmit<ExtArgs> | null;
    include?: Prisma.DispensingLineInclude<ExtArgs> | null;
    where: Prisma.DispensingLineWhereUniqueInput;
};
export type DispensingLineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DispensingLineSelect<ExtArgs> | null;
    omit?: Prisma.DispensingLineOmit<ExtArgs> | null;
    include?: Prisma.DispensingLineInclude<ExtArgs> | null;
    where: Prisma.DispensingLineWhereUniqueInput;
};
export type DispensingLineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DispensingLineSelect<ExtArgs> | null;
    omit?: Prisma.DispensingLineOmit<ExtArgs> | null;
    include?: Prisma.DispensingLineInclude<ExtArgs> | null;
    where?: Prisma.DispensingLineWhereInput;
    orderBy?: Prisma.DispensingLineOrderByWithRelationInput | Prisma.DispensingLineOrderByWithRelationInput[];
    cursor?: Prisma.DispensingLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DispensingLineScalarFieldEnum | Prisma.DispensingLineScalarFieldEnum[];
};
export type DispensingLineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DispensingLineSelect<ExtArgs> | null;
    omit?: Prisma.DispensingLineOmit<ExtArgs> | null;
    include?: Prisma.DispensingLineInclude<ExtArgs> | null;
    where?: Prisma.DispensingLineWhereInput;
    orderBy?: Prisma.DispensingLineOrderByWithRelationInput | Prisma.DispensingLineOrderByWithRelationInput[];
    cursor?: Prisma.DispensingLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DispensingLineScalarFieldEnum | Prisma.DispensingLineScalarFieldEnum[];
};
export type DispensingLineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DispensingLineSelect<ExtArgs> | null;
    omit?: Prisma.DispensingLineOmit<ExtArgs> | null;
    include?: Prisma.DispensingLineInclude<ExtArgs> | null;
    where?: Prisma.DispensingLineWhereInput;
    orderBy?: Prisma.DispensingLineOrderByWithRelationInput | Prisma.DispensingLineOrderByWithRelationInput[];
    cursor?: Prisma.DispensingLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DispensingLineScalarFieldEnum | Prisma.DispensingLineScalarFieldEnum[];
};
export type DispensingLineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DispensingLineSelect<ExtArgs> | null;
    omit?: Prisma.DispensingLineOmit<ExtArgs> | null;
    include?: Prisma.DispensingLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DispensingLineCreateInput, Prisma.DispensingLineUncheckedCreateInput>;
};
export type DispensingLineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DispensingLineCreateManyInput | Prisma.DispensingLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DispensingLineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DispensingLineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DispensingLineOmit<ExtArgs> | null;
    data: Prisma.DispensingLineCreateManyInput | Prisma.DispensingLineCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.DispensingLineIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type DispensingLineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DispensingLineSelect<ExtArgs> | null;
    omit?: Prisma.DispensingLineOmit<ExtArgs> | null;
    include?: Prisma.DispensingLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DispensingLineUpdateInput, Prisma.DispensingLineUncheckedUpdateInput>;
    where: Prisma.DispensingLineWhereUniqueInput;
};
export type DispensingLineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DispensingLineUpdateManyMutationInput, Prisma.DispensingLineUncheckedUpdateManyInput>;
    where?: Prisma.DispensingLineWhereInput;
    limit?: number;
};
export type DispensingLineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DispensingLineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DispensingLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DispensingLineUpdateManyMutationInput, Prisma.DispensingLineUncheckedUpdateManyInput>;
    where?: Prisma.DispensingLineWhereInput;
    limit?: number;
    include?: Prisma.DispensingLineIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type DispensingLineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DispensingLineSelect<ExtArgs> | null;
    omit?: Prisma.DispensingLineOmit<ExtArgs> | null;
    include?: Prisma.DispensingLineInclude<ExtArgs> | null;
    where: Prisma.DispensingLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.DispensingLineCreateInput, Prisma.DispensingLineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DispensingLineUpdateInput, Prisma.DispensingLineUncheckedUpdateInput>;
};
export type DispensingLineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DispensingLineSelect<ExtArgs> | null;
    omit?: Prisma.DispensingLineOmit<ExtArgs> | null;
    include?: Prisma.DispensingLineInclude<ExtArgs> | null;
    where: Prisma.DispensingLineWhereUniqueInput;
};
export type DispensingLineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DispensingLineWhereInput;
    limit?: number;
};
export type DispensingLineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DispensingLineSelect<ExtArgs> | null;
    omit?: Prisma.DispensingLineOmit<ExtArgs> | null;
    include?: Prisma.DispensingLineInclude<ExtArgs> | null;
};
