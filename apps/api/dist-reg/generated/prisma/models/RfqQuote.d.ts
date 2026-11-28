import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type RfqQuoteModel = runtime.Types.Result.DefaultSelection<Prisma.$RfqQuotePayload>;
export type AggregateRfqQuote = {
    _count: RfqQuoteCountAggregateOutputType | null;
    _avg: RfqQuoteAvgAggregateOutputType | null;
    _sum: RfqQuoteSumAggregateOutputType | null;
    _min: RfqQuoteMinAggregateOutputType | null;
    _max: RfqQuoteMaxAggregateOutputType | null;
};
export type RfqQuoteAvgAggregateOutputType = {
    leadTimeDays: number | null;
};
export type RfqQuoteSumAggregateOutputType = {
    leadTimeDays: number | null;
};
export type RfqQuoteMinAggregateOutputType = {
    id: string | null;
    rfqId: string | null;
    supplierId: string | null;
    status: string | null;
    leadTimeDays: number | null;
    validUntil: Date | null;
    notes: string | null;
    receivedAt: Date | null;
    createdAt: Date | null;
};
export type RfqQuoteMaxAggregateOutputType = {
    id: string | null;
    rfqId: string | null;
    supplierId: string | null;
    status: string | null;
    leadTimeDays: number | null;
    validUntil: Date | null;
    notes: string | null;
    receivedAt: Date | null;
    createdAt: Date | null;
};
export type RfqQuoteCountAggregateOutputType = {
    id: number;
    rfqId: number;
    supplierId: number;
    status: number;
    leadTimeDays: number;
    validUntil: number;
    notes: number;
    receivedAt: number;
    createdAt: number;
    _all: number;
};
export type RfqQuoteAvgAggregateInputType = {
    leadTimeDays?: true;
};
export type RfqQuoteSumAggregateInputType = {
    leadTimeDays?: true;
};
export type RfqQuoteMinAggregateInputType = {
    id?: true;
    rfqId?: true;
    supplierId?: true;
    status?: true;
    leadTimeDays?: true;
    validUntil?: true;
    notes?: true;
    receivedAt?: true;
    createdAt?: true;
};
export type RfqQuoteMaxAggregateInputType = {
    id?: true;
    rfqId?: true;
    supplierId?: true;
    status?: true;
    leadTimeDays?: true;
    validUntil?: true;
    notes?: true;
    receivedAt?: true;
    createdAt?: true;
};
export type RfqQuoteCountAggregateInputType = {
    id?: true;
    rfqId?: true;
    supplierId?: true;
    status?: true;
    leadTimeDays?: true;
    validUntil?: true;
    notes?: true;
    receivedAt?: true;
    createdAt?: true;
    _all?: true;
};
export type RfqQuoteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RfqQuoteWhereInput;
    orderBy?: Prisma.RfqQuoteOrderByWithRelationInput | Prisma.RfqQuoteOrderByWithRelationInput[];
    cursor?: Prisma.RfqQuoteWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RfqQuoteCountAggregateInputType;
    _avg?: RfqQuoteAvgAggregateInputType;
    _sum?: RfqQuoteSumAggregateInputType;
    _min?: RfqQuoteMinAggregateInputType;
    _max?: RfqQuoteMaxAggregateInputType;
};
export type GetRfqQuoteAggregateType<T extends RfqQuoteAggregateArgs> = {
    [P in keyof T & keyof AggregateRfqQuote]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRfqQuote[P]> : Prisma.GetScalarType<T[P], AggregateRfqQuote[P]>;
};
export type RfqQuoteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RfqQuoteWhereInput;
    orderBy?: Prisma.RfqQuoteOrderByWithAggregationInput | Prisma.RfqQuoteOrderByWithAggregationInput[];
    by: Prisma.RfqQuoteScalarFieldEnum[] | Prisma.RfqQuoteScalarFieldEnum;
    having?: Prisma.RfqQuoteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RfqQuoteCountAggregateInputType | true;
    _avg?: RfqQuoteAvgAggregateInputType;
    _sum?: RfqQuoteSumAggregateInputType;
    _min?: RfqQuoteMinAggregateInputType;
    _max?: RfqQuoteMaxAggregateInputType;
};
export type RfqQuoteGroupByOutputType = {
    id: string;
    rfqId: string;
    supplierId: string;
    status: string;
    leadTimeDays: number | null;
    validUntil: Date | null;
    notes: string | null;
    receivedAt: Date | null;
    createdAt: Date;
    _count: RfqQuoteCountAggregateOutputType | null;
    _avg: RfqQuoteAvgAggregateOutputType | null;
    _sum: RfqQuoteSumAggregateOutputType | null;
    _min: RfqQuoteMinAggregateOutputType | null;
    _max: RfqQuoteMaxAggregateOutputType | null;
};
export type GetRfqQuoteGroupByPayload<T extends RfqQuoteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RfqQuoteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RfqQuoteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RfqQuoteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RfqQuoteGroupByOutputType[P]>;
}>>;
export type RfqQuoteWhereInput = {
    AND?: Prisma.RfqQuoteWhereInput | Prisma.RfqQuoteWhereInput[];
    OR?: Prisma.RfqQuoteWhereInput[];
    NOT?: Prisma.RfqQuoteWhereInput | Prisma.RfqQuoteWhereInput[];
    id?: Prisma.StringFilter<"RfqQuote"> | string;
    rfqId?: Prisma.StringFilter<"RfqQuote"> | string;
    supplierId?: Prisma.StringFilter<"RfqQuote"> | string;
    status?: Prisma.StringFilter<"RfqQuote"> | string;
    leadTimeDays?: Prisma.IntNullableFilter<"RfqQuote"> | number | null;
    validUntil?: Prisma.DateTimeNullableFilter<"RfqQuote"> | Date | string | null;
    notes?: Prisma.StringNullableFilter<"RfqQuote"> | string | null;
    receivedAt?: Prisma.DateTimeNullableFilter<"RfqQuote"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"RfqQuote"> | Date | string;
    rfq?: Prisma.XOR<Prisma.RequestForQuoteScalarRelationFilter, Prisma.RequestForQuoteWhereInput>;
    lines?: Prisma.RfqQuoteLineListRelationFilter;
};
export type RfqQuoteOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    rfqId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrderInput | Prisma.SortOrder;
    validUntil?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    receivedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    rfq?: Prisma.RequestForQuoteOrderByWithRelationInput;
    lines?: Prisma.RfqQuoteLineOrderByRelationAggregateInput;
};
export type RfqQuoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    rfqId_supplierId?: Prisma.RfqQuoteRfqIdSupplierIdCompoundUniqueInput;
    AND?: Prisma.RfqQuoteWhereInput | Prisma.RfqQuoteWhereInput[];
    OR?: Prisma.RfqQuoteWhereInput[];
    NOT?: Prisma.RfqQuoteWhereInput | Prisma.RfqQuoteWhereInput[];
    rfqId?: Prisma.StringFilter<"RfqQuote"> | string;
    supplierId?: Prisma.StringFilter<"RfqQuote"> | string;
    status?: Prisma.StringFilter<"RfqQuote"> | string;
    leadTimeDays?: Prisma.IntNullableFilter<"RfqQuote"> | number | null;
    validUntil?: Prisma.DateTimeNullableFilter<"RfqQuote"> | Date | string | null;
    notes?: Prisma.StringNullableFilter<"RfqQuote"> | string | null;
    receivedAt?: Prisma.DateTimeNullableFilter<"RfqQuote"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"RfqQuote"> | Date | string;
    rfq?: Prisma.XOR<Prisma.RequestForQuoteScalarRelationFilter, Prisma.RequestForQuoteWhereInput>;
    lines?: Prisma.RfqQuoteLineListRelationFilter;
}, "id" | "rfqId_supplierId">;
export type RfqQuoteOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    rfqId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrderInput | Prisma.SortOrder;
    validUntil?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    receivedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.RfqQuoteCountOrderByAggregateInput;
    _avg?: Prisma.RfqQuoteAvgOrderByAggregateInput;
    _max?: Prisma.RfqQuoteMaxOrderByAggregateInput;
    _min?: Prisma.RfqQuoteMinOrderByAggregateInput;
    _sum?: Prisma.RfqQuoteSumOrderByAggregateInput;
};
export type RfqQuoteScalarWhereWithAggregatesInput = {
    AND?: Prisma.RfqQuoteScalarWhereWithAggregatesInput | Prisma.RfqQuoteScalarWhereWithAggregatesInput[];
    OR?: Prisma.RfqQuoteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RfqQuoteScalarWhereWithAggregatesInput | Prisma.RfqQuoteScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RfqQuote"> | string;
    rfqId?: Prisma.StringWithAggregatesFilter<"RfqQuote"> | string;
    supplierId?: Prisma.StringWithAggregatesFilter<"RfqQuote"> | string;
    status?: Prisma.StringWithAggregatesFilter<"RfqQuote"> | string;
    leadTimeDays?: Prisma.IntNullableWithAggregatesFilter<"RfqQuote"> | number | null;
    validUntil?: Prisma.DateTimeNullableWithAggregatesFilter<"RfqQuote"> | Date | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"RfqQuote"> | string | null;
    receivedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"RfqQuote"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RfqQuote"> | Date | string;
};
export type RfqQuoteCreateInput = {
    id?: string;
    supplierId: string;
    status?: string;
    leadTimeDays?: number | null;
    validUntil?: Date | string | null;
    notes?: string | null;
    receivedAt?: Date | string | null;
    createdAt?: Date | string;
    rfq: Prisma.RequestForQuoteCreateNestedOneWithoutQuotesInput;
    lines?: Prisma.RfqQuoteLineCreateNestedManyWithoutQuoteInput;
};
export type RfqQuoteUncheckedCreateInput = {
    id?: string;
    rfqId: string;
    supplierId: string;
    status?: string;
    leadTimeDays?: number | null;
    validUntil?: Date | string | null;
    notes?: string | null;
    receivedAt?: Date | string | null;
    createdAt?: Date | string;
    lines?: Prisma.RfqQuoteLineUncheckedCreateNestedManyWithoutQuoteInput;
};
export type RfqQuoteUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    leadTimeDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    validUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rfq?: Prisma.RequestForQuoteUpdateOneRequiredWithoutQuotesNestedInput;
    lines?: Prisma.RfqQuoteLineUpdateManyWithoutQuoteNestedInput;
};
export type RfqQuoteUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rfqId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    leadTimeDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    validUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.RfqQuoteLineUncheckedUpdateManyWithoutQuoteNestedInput;
};
export type RfqQuoteCreateManyInput = {
    id?: string;
    rfqId: string;
    supplierId: string;
    status?: string;
    leadTimeDays?: number | null;
    validUntil?: Date | string | null;
    notes?: string | null;
    receivedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type RfqQuoteUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    leadTimeDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    validUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RfqQuoteUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rfqId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    leadTimeDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    validUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RfqQuoteListRelationFilter = {
    every?: Prisma.RfqQuoteWhereInput;
    some?: Prisma.RfqQuoteWhereInput;
    none?: Prisma.RfqQuoteWhereInput;
};
export type RfqQuoteOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RfqQuoteRfqIdSupplierIdCompoundUniqueInput = {
    rfqId: string;
    supplierId: string;
};
export type RfqQuoteCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rfqId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
    validUntil?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RfqQuoteAvgOrderByAggregateInput = {
    leadTimeDays?: Prisma.SortOrder;
};
export type RfqQuoteMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rfqId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
    validUntil?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RfqQuoteMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rfqId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
    validUntil?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    receivedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RfqQuoteSumOrderByAggregateInput = {
    leadTimeDays?: Prisma.SortOrder;
};
export type RfqQuoteScalarRelationFilter = {
    is?: Prisma.RfqQuoteWhereInput;
    isNot?: Prisma.RfqQuoteWhereInput;
};
export type RfqQuoteCreateNestedManyWithoutRfqInput = {
    create?: Prisma.XOR<Prisma.RfqQuoteCreateWithoutRfqInput, Prisma.RfqQuoteUncheckedCreateWithoutRfqInput> | Prisma.RfqQuoteCreateWithoutRfqInput[] | Prisma.RfqQuoteUncheckedCreateWithoutRfqInput[];
    connectOrCreate?: Prisma.RfqQuoteCreateOrConnectWithoutRfqInput | Prisma.RfqQuoteCreateOrConnectWithoutRfqInput[];
    createMany?: Prisma.RfqQuoteCreateManyRfqInputEnvelope;
    connect?: Prisma.RfqQuoteWhereUniqueInput | Prisma.RfqQuoteWhereUniqueInput[];
};
export type RfqQuoteUncheckedCreateNestedManyWithoutRfqInput = {
    create?: Prisma.XOR<Prisma.RfqQuoteCreateWithoutRfqInput, Prisma.RfqQuoteUncheckedCreateWithoutRfqInput> | Prisma.RfqQuoteCreateWithoutRfqInput[] | Prisma.RfqQuoteUncheckedCreateWithoutRfqInput[];
    connectOrCreate?: Prisma.RfqQuoteCreateOrConnectWithoutRfqInput | Prisma.RfqQuoteCreateOrConnectWithoutRfqInput[];
    createMany?: Prisma.RfqQuoteCreateManyRfqInputEnvelope;
    connect?: Prisma.RfqQuoteWhereUniqueInput | Prisma.RfqQuoteWhereUniqueInput[];
};
export type RfqQuoteUpdateManyWithoutRfqNestedInput = {
    create?: Prisma.XOR<Prisma.RfqQuoteCreateWithoutRfqInput, Prisma.RfqQuoteUncheckedCreateWithoutRfqInput> | Prisma.RfqQuoteCreateWithoutRfqInput[] | Prisma.RfqQuoteUncheckedCreateWithoutRfqInput[];
    connectOrCreate?: Prisma.RfqQuoteCreateOrConnectWithoutRfqInput | Prisma.RfqQuoteCreateOrConnectWithoutRfqInput[];
    upsert?: Prisma.RfqQuoteUpsertWithWhereUniqueWithoutRfqInput | Prisma.RfqQuoteUpsertWithWhereUniqueWithoutRfqInput[];
    createMany?: Prisma.RfqQuoteCreateManyRfqInputEnvelope;
    set?: Prisma.RfqQuoteWhereUniqueInput | Prisma.RfqQuoteWhereUniqueInput[];
    disconnect?: Prisma.RfqQuoteWhereUniqueInput | Prisma.RfqQuoteWhereUniqueInput[];
    delete?: Prisma.RfqQuoteWhereUniqueInput | Prisma.RfqQuoteWhereUniqueInput[];
    connect?: Prisma.RfqQuoteWhereUniqueInput | Prisma.RfqQuoteWhereUniqueInput[];
    update?: Prisma.RfqQuoteUpdateWithWhereUniqueWithoutRfqInput | Prisma.RfqQuoteUpdateWithWhereUniqueWithoutRfqInput[];
    updateMany?: Prisma.RfqQuoteUpdateManyWithWhereWithoutRfqInput | Prisma.RfqQuoteUpdateManyWithWhereWithoutRfqInput[];
    deleteMany?: Prisma.RfqQuoteScalarWhereInput | Prisma.RfqQuoteScalarWhereInput[];
};
export type RfqQuoteUncheckedUpdateManyWithoutRfqNestedInput = {
    create?: Prisma.XOR<Prisma.RfqQuoteCreateWithoutRfqInput, Prisma.RfqQuoteUncheckedCreateWithoutRfqInput> | Prisma.RfqQuoteCreateWithoutRfqInput[] | Prisma.RfqQuoteUncheckedCreateWithoutRfqInput[];
    connectOrCreate?: Prisma.RfqQuoteCreateOrConnectWithoutRfqInput | Prisma.RfqQuoteCreateOrConnectWithoutRfqInput[];
    upsert?: Prisma.RfqQuoteUpsertWithWhereUniqueWithoutRfqInput | Prisma.RfqQuoteUpsertWithWhereUniqueWithoutRfqInput[];
    createMany?: Prisma.RfqQuoteCreateManyRfqInputEnvelope;
    set?: Prisma.RfqQuoteWhereUniqueInput | Prisma.RfqQuoteWhereUniqueInput[];
    disconnect?: Prisma.RfqQuoteWhereUniqueInput | Prisma.RfqQuoteWhereUniqueInput[];
    delete?: Prisma.RfqQuoteWhereUniqueInput | Prisma.RfqQuoteWhereUniqueInput[];
    connect?: Prisma.RfqQuoteWhereUniqueInput | Prisma.RfqQuoteWhereUniqueInput[];
    update?: Prisma.RfqQuoteUpdateWithWhereUniqueWithoutRfqInput | Prisma.RfqQuoteUpdateWithWhereUniqueWithoutRfqInput[];
    updateMany?: Prisma.RfqQuoteUpdateManyWithWhereWithoutRfqInput | Prisma.RfqQuoteUpdateManyWithWhereWithoutRfqInput[];
    deleteMany?: Prisma.RfqQuoteScalarWhereInput | Prisma.RfqQuoteScalarWhereInput[];
};
export type RfqQuoteCreateNestedOneWithoutLinesInput = {
    create?: Prisma.XOR<Prisma.RfqQuoteCreateWithoutLinesInput, Prisma.RfqQuoteUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.RfqQuoteCreateOrConnectWithoutLinesInput;
    connect?: Prisma.RfqQuoteWhereUniqueInput;
};
export type RfqQuoteUpdateOneRequiredWithoutLinesNestedInput = {
    create?: Prisma.XOR<Prisma.RfqQuoteCreateWithoutLinesInput, Prisma.RfqQuoteUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.RfqQuoteCreateOrConnectWithoutLinesInput;
    upsert?: Prisma.RfqQuoteUpsertWithoutLinesInput;
    connect?: Prisma.RfqQuoteWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.RfqQuoteUpdateToOneWithWhereWithoutLinesInput, Prisma.RfqQuoteUpdateWithoutLinesInput>, Prisma.RfqQuoteUncheckedUpdateWithoutLinesInput>;
};
export type RfqQuoteCreateWithoutRfqInput = {
    id?: string;
    supplierId: string;
    status?: string;
    leadTimeDays?: number | null;
    validUntil?: Date | string | null;
    notes?: string | null;
    receivedAt?: Date | string | null;
    createdAt?: Date | string;
    lines?: Prisma.RfqQuoteLineCreateNestedManyWithoutQuoteInput;
};
export type RfqQuoteUncheckedCreateWithoutRfqInput = {
    id?: string;
    supplierId: string;
    status?: string;
    leadTimeDays?: number | null;
    validUntil?: Date | string | null;
    notes?: string | null;
    receivedAt?: Date | string | null;
    createdAt?: Date | string;
    lines?: Prisma.RfqQuoteLineUncheckedCreateNestedManyWithoutQuoteInput;
};
export type RfqQuoteCreateOrConnectWithoutRfqInput = {
    where: Prisma.RfqQuoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.RfqQuoteCreateWithoutRfqInput, Prisma.RfqQuoteUncheckedCreateWithoutRfqInput>;
};
export type RfqQuoteCreateManyRfqInputEnvelope = {
    data: Prisma.RfqQuoteCreateManyRfqInput | Prisma.RfqQuoteCreateManyRfqInput[];
    skipDuplicates?: boolean;
};
export type RfqQuoteUpsertWithWhereUniqueWithoutRfqInput = {
    where: Prisma.RfqQuoteWhereUniqueInput;
    update: Prisma.XOR<Prisma.RfqQuoteUpdateWithoutRfqInput, Prisma.RfqQuoteUncheckedUpdateWithoutRfqInput>;
    create: Prisma.XOR<Prisma.RfqQuoteCreateWithoutRfqInput, Prisma.RfqQuoteUncheckedCreateWithoutRfqInput>;
};
export type RfqQuoteUpdateWithWhereUniqueWithoutRfqInput = {
    where: Prisma.RfqQuoteWhereUniqueInput;
    data: Prisma.XOR<Prisma.RfqQuoteUpdateWithoutRfqInput, Prisma.RfqQuoteUncheckedUpdateWithoutRfqInput>;
};
export type RfqQuoteUpdateManyWithWhereWithoutRfqInput = {
    where: Prisma.RfqQuoteScalarWhereInput;
    data: Prisma.XOR<Prisma.RfqQuoteUpdateManyMutationInput, Prisma.RfqQuoteUncheckedUpdateManyWithoutRfqInput>;
};
export type RfqQuoteScalarWhereInput = {
    AND?: Prisma.RfqQuoteScalarWhereInput | Prisma.RfqQuoteScalarWhereInput[];
    OR?: Prisma.RfqQuoteScalarWhereInput[];
    NOT?: Prisma.RfqQuoteScalarWhereInput | Prisma.RfqQuoteScalarWhereInput[];
    id?: Prisma.StringFilter<"RfqQuote"> | string;
    rfqId?: Prisma.StringFilter<"RfqQuote"> | string;
    supplierId?: Prisma.StringFilter<"RfqQuote"> | string;
    status?: Prisma.StringFilter<"RfqQuote"> | string;
    leadTimeDays?: Prisma.IntNullableFilter<"RfqQuote"> | number | null;
    validUntil?: Prisma.DateTimeNullableFilter<"RfqQuote"> | Date | string | null;
    notes?: Prisma.StringNullableFilter<"RfqQuote"> | string | null;
    receivedAt?: Prisma.DateTimeNullableFilter<"RfqQuote"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"RfqQuote"> | Date | string;
};
export type RfqQuoteCreateWithoutLinesInput = {
    id?: string;
    supplierId: string;
    status?: string;
    leadTimeDays?: number | null;
    validUntil?: Date | string | null;
    notes?: string | null;
    receivedAt?: Date | string | null;
    createdAt?: Date | string;
    rfq: Prisma.RequestForQuoteCreateNestedOneWithoutQuotesInput;
};
export type RfqQuoteUncheckedCreateWithoutLinesInput = {
    id?: string;
    rfqId: string;
    supplierId: string;
    status?: string;
    leadTimeDays?: number | null;
    validUntil?: Date | string | null;
    notes?: string | null;
    receivedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type RfqQuoteCreateOrConnectWithoutLinesInput = {
    where: Prisma.RfqQuoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.RfqQuoteCreateWithoutLinesInput, Prisma.RfqQuoteUncheckedCreateWithoutLinesInput>;
};
export type RfqQuoteUpsertWithoutLinesInput = {
    update: Prisma.XOR<Prisma.RfqQuoteUpdateWithoutLinesInput, Prisma.RfqQuoteUncheckedUpdateWithoutLinesInput>;
    create: Prisma.XOR<Prisma.RfqQuoteCreateWithoutLinesInput, Prisma.RfqQuoteUncheckedCreateWithoutLinesInput>;
    where?: Prisma.RfqQuoteWhereInput;
};
export type RfqQuoteUpdateToOneWithWhereWithoutLinesInput = {
    where?: Prisma.RfqQuoteWhereInput;
    data: Prisma.XOR<Prisma.RfqQuoteUpdateWithoutLinesInput, Prisma.RfqQuoteUncheckedUpdateWithoutLinesInput>;
};
export type RfqQuoteUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    leadTimeDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    validUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rfq?: Prisma.RequestForQuoteUpdateOneRequiredWithoutQuotesNestedInput;
};
export type RfqQuoteUncheckedUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rfqId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    leadTimeDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    validUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RfqQuoteCreateManyRfqInput = {
    id?: string;
    supplierId: string;
    status?: string;
    leadTimeDays?: number | null;
    validUntil?: Date | string | null;
    notes?: string | null;
    receivedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type RfqQuoteUpdateWithoutRfqInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    leadTimeDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    validUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.RfqQuoteLineUpdateManyWithoutQuoteNestedInput;
};
export type RfqQuoteUncheckedUpdateWithoutRfqInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    leadTimeDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    validUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lines?: Prisma.RfqQuoteLineUncheckedUpdateManyWithoutQuoteNestedInput;
};
export type RfqQuoteUncheckedUpdateManyWithoutRfqInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    leadTimeDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    validUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    receivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RfqQuoteCountOutputType = {
    lines: number;
};
export type RfqQuoteCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | RfqQuoteCountOutputTypeCountLinesArgs;
};
export type RfqQuoteCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteCountOutputTypeSelect<ExtArgs> | null;
};
export type RfqQuoteCountOutputTypeCountLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RfqQuoteLineWhereInput;
};
export type RfqQuoteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rfqId?: boolean;
    supplierId?: boolean;
    status?: boolean;
    leadTimeDays?: boolean;
    validUntil?: boolean;
    notes?: boolean;
    receivedAt?: boolean;
    createdAt?: boolean;
    rfq?: boolean | Prisma.RequestForQuoteDefaultArgs<ExtArgs>;
    lines?: boolean | Prisma.RfqQuote$linesArgs<ExtArgs>;
    _count?: boolean | Prisma.RfqQuoteCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rfqQuote"]>;
export type RfqQuoteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rfqId?: boolean;
    supplierId?: boolean;
    status?: boolean;
    leadTimeDays?: boolean;
    validUntil?: boolean;
    notes?: boolean;
    receivedAt?: boolean;
    createdAt?: boolean;
    rfq?: boolean | Prisma.RequestForQuoteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rfqQuote"]>;
export type RfqQuoteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rfqId?: boolean;
    supplierId?: boolean;
    status?: boolean;
    leadTimeDays?: boolean;
    validUntil?: boolean;
    notes?: boolean;
    receivedAt?: boolean;
    createdAt?: boolean;
    rfq?: boolean | Prisma.RequestForQuoteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rfqQuote"]>;
export type RfqQuoteSelectScalar = {
    id?: boolean;
    rfqId?: boolean;
    supplierId?: boolean;
    status?: boolean;
    leadTimeDays?: boolean;
    validUntil?: boolean;
    notes?: boolean;
    receivedAt?: boolean;
    createdAt?: boolean;
};
export type RfqQuoteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "rfqId" | "supplierId" | "status" | "leadTimeDays" | "validUntil" | "notes" | "receivedAt" | "createdAt", ExtArgs["result"]["rfqQuote"]>;
export type RfqQuoteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rfq?: boolean | Prisma.RequestForQuoteDefaultArgs<ExtArgs>;
    lines?: boolean | Prisma.RfqQuote$linesArgs<ExtArgs>;
    _count?: boolean | Prisma.RfqQuoteCountOutputTypeDefaultArgs<ExtArgs>;
};
export type RfqQuoteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rfq?: boolean | Prisma.RequestForQuoteDefaultArgs<ExtArgs>;
};
export type RfqQuoteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rfq?: boolean | Prisma.RequestForQuoteDefaultArgs<ExtArgs>;
};
export type $RfqQuotePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RfqQuote";
    objects: {
        rfq: Prisma.$RequestForQuotePayload<ExtArgs>;
        lines: Prisma.$RfqQuoteLinePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        rfqId: string;
        supplierId: string;
        status: string;
        leadTimeDays: number | null;
        validUntil: Date | null;
        notes: string | null;
        receivedAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["rfqQuote"]>;
    composites: {};
};
export type RfqQuoteGetPayload<S extends boolean | null | undefined | RfqQuoteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RfqQuotePayload, S>;
export type RfqQuoteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RfqQuoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RfqQuoteCountAggregateInputType | true;
};
export interface RfqQuoteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RfqQuote'];
        meta: {
            name: 'RfqQuote';
        };
    };
    findUnique<T extends RfqQuoteFindUniqueArgs>(args: Prisma.SelectSubset<T, RfqQuoteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteClient<runtime.Types.Result.GetResult<Prisma.$RfqQuotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RfqQuoteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RfqQuoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteClient<runtime.Types.Result.GetResult<Prisma.$RfqQuotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RfqQuoteFindFirstArgs>(args?: Prisma.SelectSubset<T, RfqQuoteFindFirstArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteClient<runtime.Types.Result.GetResult<Prisma.$RfqQuotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RfqQuoteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RfqQuoteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteClient<runtime.Types.Result.GetResult<Prisma.$RfqQuotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RfqQuoteFindManyArgs>(args?: Prisma.SelectSubset<T, RfqQuoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RfqQuotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RfqQuoteCreateArgs>(args: Prisma.SelectSubset<T, RfqQuoteCreateArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteClient<runtime.Types.Result.GetResult<Prisma.$RfqQuotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RfqQuoteCreateManyArgs>(args?: Prisma.SelectSubset<T, RfqQuoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RfqQuoteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RfqQuoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RfqQuotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RfqQuoteDeleteArgs>(args: Prisma.SelectSubset<T, RfqQuoteDeleteArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteClient<runtime.Types.Result.GetResult<Prisma.$RfqQuotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RfqQuoteUpdateArgs>(args: Prisma.SelectSubset<T, RfqQuoteUpdateArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteClient<runtime.Types.Result.GetResult<Prisma.$RfqQuotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RfqQuoteDeleteManyArgs>(args?: Prisma.SelectSubset<T, RfqQuoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RfqQuoteUpdateManyArgs>(args: Prisma.SelectSubset<T, RfqQuoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RfqQuoteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RfqQuoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RfqQuotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RfqQuoteUpsertArgs>(args: Prisma.SelectSubset<T, RfqQuoteUpsertArgs<ExtArgs>>): Prisma.Prisma__RfqQuoteClient<runtime.Types.Result.GetResult<Prisma.$RfqQuotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RfqQuoteCountArgs>(args?: Prisma.Subset<T, RfqQuoteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RfqQuoteCountAggregateOutputType> : number>;
    aggregate<T extends RfqQuoteAggregateArgs>(args: Prisma.Subset<T, RfqQuoteAggregateArgs>): Prisma.PrismaPromise<GetRfqQuoteAggregateType<T>>;
    groupBy<T extends RfqQuoteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RfqQuoteGroupByArgs['orderBy'];
    } : {
        orderBy?: RfqQuoteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RfqQuoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRfqQuoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RfqQuoteFieldRefs;
}
export interface Prisma__RfqQuoteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    rfq<T extends Prisma.RequestForQuoteDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RequestForQuoteDefaultArgs<ExtArgs>>): Prisma.Prisma__RequestForQuoteClient<runtime.Types.Result.GetResult<Prisma.$RequestForQuotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    lines<T extends Prisma.RfqQuote$linesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RfqQuote$linesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RfqQuoteLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RfqQuoteFieldRefs {
    readonly id: Prisma.FieldRef<"RfqQuote", 'String'>;
    readonly rfqId: Prisma.FieldRef<"RfqQuote", 'String'>;
    readonly supplierId: Prisma.FieldRef<"RfqQuote", 'String'>;
    readonly status: Prisma.FieldRef<"RfqQuote", 'String'>;
    readonly leadTimeDays: Prisma.FieldRef<"RfqQuote", 'Int'>;
    readonly validUntil: Prisma.FieldRef<"RfqQuote", 'DateTime'>;
    readonly notes: Prisma.FieldRef<"RfqQuote", 'String'>;
    readonly receivedAt: Prisma.FieldRef<"RfqQuote", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"RfqQuote", 'DateTime'>;
}
export type RfqQuoteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteInclude<ExtArgs> | null;
    where: Prisma.RfqQuoteWhereUniqueInput;
};
export type RfqQuoteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteInclude<ExtArgs> | null;
    where: Prisma.RfqQuoteWhereUniqueInput;
};
export type RfqQuoteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteInclude<ExtArgs> | null;
    where?: Prisma.RfqQuoteWhereInput;
    orderBy?: Prisma.RfqQuoteOrderByWithRelationInput | Prisma.RfqQuoteOrderByWithRelationInput[];
    cursor?: Prisma.RfqQuoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RfqQuoteScalarFieldEnum | Prisma.RfqQuoteScalarFieldEnum[];
};
export type RfqQuoteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteInclude<ExtArgs> | null;
    where?: Prisma.RfqQuoteWhereInput;
    orderBy?: Prisma.RfqQuoteOrderByWithRelationInput | Prisma.RfqQuoteOrderByWithRelationInput[];
    cursor?: Prisma.RfqQuoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RfqQuoteScalarFieldEnum | Prisma.RfqQuoteScalarFieldEnum[];
};
export type RfqQuoteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteInclude<ExtArgs> | null;
    where?: Prisma.RfqQuoteWhereInput;
    orderBy?: Prisma.RfqQuoteOrderByWithRelationInput | Prisma.RfqQuoteOrderByWithRelationInput[];
    cursor?: Prisma.RfqQuoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RfqQuoteScalarFieldEnum | Prisma.RfqQuoteScalarFieldEnum[];
};
export type RfqQuoteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RfqQuoteCreateInput, Prisma.RfqQuoteUncheckedCreateInput>;
};
export type RfqQuoteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RfqQuoteCreateManyInput | Prisma.RfqQuoteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RfqQuoteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RfqQuoteOmit<ExtArgs> | null;
    data: Prisma.RfqQuoteCreateManyInput | Prisma.RfqQuoteCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.RfqQuoteIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type RfqQuoteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RfqQuoteUpdateInput, Prisma.RfqQuoteUncheckedUpdateInput>;
    where: Prisma.RfqQuoteWhereUniqueInput;
};
export type RfqQuoteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RfqQuoteUpdateManyMutationInput, Prisma.RfqQuoteUncheckedUpdateManyInput>;
    where?: Prisma.RfqQuoteWhereInput;
    limit?: number;
};
export type RfqQuoteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RfqQuoteOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RfqQuoteUpdateManyMutationInput, Prisma.RfqQuoteUncheckedUpdateManyInput>;
    where?: Prisma.RfqQuoteWhereInput;
    limit?: number;
    include?: Prisma.RfqQuoteIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type RfqQuoteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteInclude<ExtArgs> | null;
    where: Prisma.RfqQuoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.RfqQuoteCreateInput, Prisma.RfqQuoteUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RfqQuoteUpdateInput, Prisma.RfqQuoteUncheckedUpdateInput>;
};
export type RfqQuoteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteInclude<ExtArgs> | null;
    where: Prisma.RfqQuoteWhereUniqueInput;
};
export type RfqQuoteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RfqQuoteWhereInput;
    limit?: number;
};
export type RfqQuote$linesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteLineOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteLineInclude<ExtArgs> | null;
    where?: Prisma.RfqQuoteLineWhereInput;
    orderBy?: Prisma.RfqQuoteLineOrderByWithRelationInput | Prisma.RfqQuoteLineOrderByWithRelationInput[];
    cursor?: Prisma.RfqQuoteLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RfqQuoteLineScalarFieldEnum | Prisma.RfqQuoteLineScalarFieldEnum[];
};
export type RfqQuoteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RfqQuoteOmit<ExtArgs> | null;
    include?: Prisma.RfqQuoteInclude<ExtArgs> | null;
};
