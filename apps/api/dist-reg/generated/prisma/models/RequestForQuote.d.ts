import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type RequestForQuoteModel = runtime.Types.Result.DefaultSelection<Prisma.$RequestForQuotePayload>;
export type AggregateRequestForQuote = {
    _count: RequestForQuoteCountAggregateOutputType | null;
    _min: RequestForQuoteMinAggregateOutputType | null;
    _max: RequestForQuoteMaxAggregateOutputType | null;
};
export type RequestForQuoteMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    number: string | null;
    status: string | null;
    notes: string | null;
    dueAt: Date | null;
    createdBy: string | null;
    createdAt: Date | null;
    awardedAt: Date | null;
};
export type RequestForQuoteMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    number: string | null;
    status: string | null;
    notes: string | null;
    dueAt: Date | null;
    createdBy: string | null;
    createdAt: Date | null;
    awardedAt: Date | null;
};
export type RequestForQuoteCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    number: number;
    status: number;
    notes: number;
    dueAt: number;
    createdBy: number;
    createdAt: number;
    awardedAt: number;
    _all: number;
};
export type RequestForQuoteMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    number?: true;
    status?: true;
    notes?: true;
    dueAt?: true;
    createdBy?: true;
    createdAt?: true;
    awardedAt?: true;
};
export type RequestForQuoteMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    number?: true;
    status?: true;
    notes?: true;
    dueAt?: true;
    createdBy?: true;
    createdAt?: true;
    awardedAt?: true;
};
export type RequestForQuoteCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    number?: true;
    status?: true;
    notes?: true;
    dueAt?: true;
    createdBy?: true;
    createdAt?: true;
    awardedAt?: true;
    _all?: true;
};
export type RequestForQuoteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RequestForQuoteWhereInput;
    orderBy?: Prisma.RequestForQuoteOrderByWithRelationInput | Prisma.RequestForQuoteOrderByWithRelationInput[];
    cursor?: Prisma.RequestForQuoteWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RequestForQuoteCountAggregateInputType;
    _min?: RequestForQuoteMinAggregateInputType;
    _max?: RequestForQuoteMaxAggregateInputType;
};
export type GetRequestForQuoteAggregateType<T extends RequestForQuoteAggregateArgs> = {
    [P in keyof T & keyof AggregateRequestForQuote]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRequestForQuote[P]> : Prisma.GetScalarType<T[P], AggregateRequestForQuote[P]>;
};
export type RequestForQuoteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RequestForQuoteWhereInput;
    orderBy?: Prisma.RequestForQuoteOrderByWithAggregationInput | Prisma.RequestForQuoteOrderByWithAggregationInput[];
    by: Prisma.RequestForQuoteScalarFieldEnum[] | Prisma.RequestForQuoteScalarFieldEnum;
    having?: Prisma.RequestForQuoteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RequestForQuoteCountAggregateInputType | true;
    _min?: RequestForQuoteMinAggregateInputType;
    _max?: RequestForQuoteMaxAggregateInputType;
};
export type RequestForQuoteGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    number: string;
    status: string;
    notes: string | null;
    dueAt: Date | null;
    createdBy: string;
    createdAt: Date;
    awardedAt: Date | null;
    _count: RequestForQuoteCountAggregateOutputType | null;
    _min: RequestForQuoteMinAggregateOutputType | null;
    _max: RequestForQuoteMaxAggregateOutputType | null;
};
export type GetRequestForQuoteGroupByPayload<T extends RequestForQuoteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RequestForQuoteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RequestForQuoteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RequestForQuoteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RequestForQuoteGroupByOutputType[P]>;
}>>;
export type RequestForQuoteWhereInput = {
    AND?: Prisma.RequestForQuoteWhereInput | Prisma.RequestForQuoteWhereInput[];
    OR?: Prisma.RequestForQuoteWhereInput[];
    NOT?: Prisma.RequestForQuoteWhereInput | Prisma.RequestForQuoteWhereInput[];
    id?: Prisma.StringFilter<"RequestForQuote"> | string;
    orgId?: Prisma.StringFilter<"RequestForQuote"> | string;
    branchId?: Prisma.StringFilter<"RequestForQuote"> | string;
    number?: Prisma.StringFilter<"RequestForQuote"> | string;
    status?: Prisma.StringFilter<"RequestForQuote"> | string;
    notes?: Prisma.StringNullableFilter<"RequestForQuote"> | string | null;
    dueAt?: Prisma.DateTimeNullableFilter<"RequestForQuote"> | Date | string | null;
    createdBy?: Prisma.StringFilter<"RequestForQuote"> | string;
    createdAt?: Prisma.DateTimeFilter<"RequestForQuote"> | Date | string;
    awardedAt?: Prisma.DateTimeNullableFilter<"RequestForQuote"> | Date | string | null;
    lines?: Prisma.RfqLineListRelationFilter;
    quotes?: Prisma.RfqQuoteListRelationFilter;
};
export type RequestForQuoteOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    dueAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    awardedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    lines?: Prisma.RfqLineOrderByRelationAggregateInput;
    quotes?: Prisma.RfqQuoteOrderByRelationAggregateInput;
};
export type RequestForQuoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId_number?: Prisma.RequestForQuoteOrgIdNumberCompoundUniqueInput;
    AND?: Prisma.RequestForQuoteWhereInput | Prisma.RequestForQuoteWhereInput[];
    OR?: Prisma.RequestForQuoteWhereInput[];
    NOT?: Prisma.RequestForQuoteWhereInput | Prisma.RequestForQuoteWhereInput[];
    orgId?: Prisma.StringFilter<"RequestForQuote"> | string;
    branchId?: Prisma.StringFilter<"RequestForQuote"> | string;
    number?: Prisma.StringFilter<"RequestForQuote"> | string;
    status?: Prisma.StringFilter<"RequestForQuote"> | string;
    notes?: Prisma.StringNullableFilter<"RequestForQuote"> | string | null;
    dueAt?: Prisma.DateTimeNullableFilter<"RequestForQuote"> | Date | string | null;
    createdBy?: Prisma.StringFilter<"RequestForQuote"> | string;
    createdAt?: Prisma.DateTimeFilter<"RequestForQuote"> | Date | string;
    awardedAt?: Prisma.DateTimeNullableFilter<"RequestForQuote"> | Date | string | null;
    lines?: Prisma.RfqLineListRelationFilter;
    quotes?: Prisma.RfqQuoteListRelationFilter;
}, "id" | "orgId_number">;
export type RequestForQuoteOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    dueAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    awardedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.RequestForQuoteCountOrderByAggregateInput;
    _max?: Prisma.RequestForQuoteMaxOrderByAggregateInput;
    _min?: Prisma.RequestForQuoteMinOrderByAggregateInput;
};
export type RequestForQuoteScalarWhereWithAggregatesInput = {
    AND?: Prisma.RequestForQuoteScalarWhereWithAggregatesInput | Prisma.RequestForQuoteScalarWhereWithAggregatesInput[];
    OR?: Prisma.RequestForQuoteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RequestForQuoteScalarWhereWithAggregatesInput | Prisma.RequestForQuoteScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RequestForQuote"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"RequestForQuote"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"RequestForQuote"> | string;
    number?: Prisma.StringWithAggregatesFilter<"RequestForQuote"> | string;
    status?: Prisma.StringWithAggregatesFilter<"RequestForQuote"> | string;
    notes?: Prisma.StringNullableWithAggregatesFilter<"RequestForQuote"> | string | null;
    dueAt?: Prisma.DateTimeNullableWithAggregatesFilter<"RequestForQuote"> | Date | string | null;
    createdBy?: Prisma.StringWithAggregatesFilter<"RequestForQuote"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RequestForQuote"> | Date | string;
    awardedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"RequestForQuote"> | Date | string | null;
};
export type RequestForQuoteCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    number: string;
    status?: string;
    notes?: string | null;
    dueAt?: Date | string | null;
    createdBy: string;
    createdAt?: Date | string;
    awardedAt?: Date | string | null;
    lines?: Prisma.RfqLineCreateNestedManyWithoutRfqInput;
    quotes?: Prisma.RfqQuoteCreateNestedManyWithoutRfqInput;
};
export type RequestForQuoteUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    number: string;
    status?: string;
    notes?: string | null;
    dueAt?: Date | string | null;
    createdBy: string;
    createdAt?: Date | string;
    awardedAt?: Date | string | null;
    lines?: Prisma.RfqLineUncheckedCreateNestedManyWithoutRfqInput;
    quotes?: Prisma.RfqQuoteUncheckedCreateNestedManyWithoutRfqInput;
};
export type RequestForQuoteUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    awardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lines?: Prisma.RfqLineUpdateManyWithoutRfqNestedInput;
    quotes?: Prisma.RfqQuoteUpdateManyWithoutRfqNestedInput;
};
export type RequestForQuoteUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    awardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lines?: Prisma.RfqLineUncheckedUpdateManyWithoutRfqNestedInput;
    quotes?: Prisma.RfqQuoteUncheckedUpdateManyWithoutRfqNestedInput;
};
export type RequestForQuoteCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    number: string;
    status?: string;
    notes?: string | null;
    dueAt?: Date | string | null;
    createdBy: string;
    createdAt?: Date | string;
    awardedAt?: Date | string | null;
};
export type RequestForQuoteUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    awardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type RequestForQuoteUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    awardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type RequestForQuoteOrgIdNumberCompoundUniqueInput = {
    orgId: string;
    number: string;
};
export type RequestForQuoteCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    dueAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    awardedAt?: Prisma.SortOrder;
};
export type RequestForQuoteMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    dueAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    awardedAt?: Prisma.SortOrder;
};
export type RequestForQuoteMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    dueAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    awardedAt?: Prisma.SortOrder;
};
export type RequestForQuoteScalarRelationFilter = {
    is?: Prisma.RequestForQuoteWhereInput;
    isNot?: Prisma.RequestForQuoteWhereInput;
};
export type RequestForQuoteCreateNestedOneWithoutLinesInput = {
    create?: Prisma.XOR<Prisma.RequestForQuoteCreateWithoutLinesInput, Prisma.RequestForQuoteUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.RequestForQuoteCreateOrConnectWithoutLinesInput;
    connect?: Prisma.RequestForQuoteWhereUniqueInput;
};
export type RequestForQuoteUpdateOneRequiredWithoutLinesNestedInput = {
    create?: Prisma.XOR<Prisma.RequestForQuoteCreateWithoutLinesInput, Prisma.RequestForQuoteUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.RequestForQuoteCreateOrConnectWithoutLinesInput;
    upsert?: Prisma.RequestForQuoteUpsertWithoutLinesInput;
    connect?: Prisma.RequestForQuoteWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.RequestForQuoteUpdateToOneWithWhereWithoutLinesInput, Prisma.RequestForQuoteUpdateWithoutLinesInput>, Prisma.RequestForQuoteUncheckedUpdateWithoutLinesInput>;
};
export type RequestForQuoteCreateNestedOneWithoutQuotesInput = {
    create?: Prisma.XOR<Prisma.RequestForQuoteCreateWithoutQuotesInput, Prisma.RequestForQuoteUncheckedCreateWithoutQuotesInput>;
    connectOrCreate?: Prisma.RequestForQuoteCreateOrConnectWithoutQuotesInput;
    connect?: Prisma.RequestForQuoteWhereUniqueInput;
};
export type RequestForQuoteUpdateOneRequiredWithoutQuotesNestedInput = {
    create?: Prisma.XOR<Prisma.RequestForQuoteCreateWithoutQuotesInput, Prisma.RequestForQuoteUncheckedCreateWithoutQuotesInput>;
    connectOrCreate?: Prisma.RequestForQuoteCreateOrConnectWithoutQuotesInput;
    upsert?: Prisma.RequestForQuoteUpsertWithoutQuotesInput;
    connect?: Prisma.RequestForQuoteWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.RequestForQuoteUpdateToOneWithWhereWithoutQuotesInput, Prisma.RequestForQuoteUpdateWithoutQuotesInput>, Prisma.RequestForQuoteUncheckedUpdateWithoutQuotesInput>;
};
export type RequestForQuoteCreateWithoutLinesInput = {
    id?: string;
    orgId: string;
    branchId: string;
    number: string;
    status?: string;
    notes?: string | null;
    dueAt?: Date | string | null;
    createdBy: string;
    createdAt?: Date | string;
    awardedAt?: Date | string | null;
    quotes?: Prisma.RfqQuoteCreateNestedManyWithoutRfqInput;
};
export type RequestForQuoteUncheckedCreateWithoutLinesInput = {
    id?: string;
    orgId: string;
    branchId: string;
    number: string;
    status?: string;
    notes?: string | null;
    dueAt?: Date | string | null;
    createdBy: string;
    createdAt?: Date | string;
    awardedAt?: Date | string | null;
    quotes?: Prisma.RfqQuoteUncheckedCreateNestedManyWithoutRfqInput;
};
export type RequestForQuoteCreateOrConnectWithoutLinesInput = {
    where: Prisma.RequestForQuoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.RequestForQuoteCreateWithoutLinesInput, Prisma.RequestForQuoteUncheckedCreateWithoutLinesInput>;
};
export type RequestForQuoteUpsertWithoutLinesInput = {
    update: Prisma.XOR<Prisma.RequestForQuoteUpdateWithoutLinesInput, Prisma.RequestForQuoteUncheckedUpdateWithoutLinesInput>;
    create: Prisma.XOR<Prisma.RequestForQuoteCreateWithoutLinesInput, Prisma.RequestForQuoteUncheckedCreateWithoutLinesInput>;
    where?: Prisma.RequestForQuoteWhereInput;
};
export type RequestForQuoteUpdateToOneWithWhereWithoutLinesInput = {
    where?: Prisma.RequestForQuoteWhereInput;
    data: Prisma.XOR<Prisma.RequestForQuoteUpdateWithoutLinesInput, Prisma.RequestForQuoteUncheckedUpdateWithoutLinesInput>;
};
export type RequestForQuoteUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    awardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    quotes?: Prisma.RfqQuoteUpdateManyWithoutRfqNestedInput;
};
export type RequestForQuoteUncheckedUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    awardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    quotes?: Prisma.RfqQuoteUncheckedUpdateManyWithoutRfqNestedInput;
};
export type RequestForQuoteCreateWithoutQuotesInput = {
    id?: string;
    orgId: string;
    branchId: string;
    number: string;
    status?: string;
    notes?: string | null;
    dueAt?: Date | string | null;
    createdBy: string;
    createdAt?: Date | string;
    awardedAt?: Date | string | null;
    lines?: Prisma.RfqLineCreateNestedManyWithoutRfqInput;
};
export type RequestForQuoteUncheckedCreateWithoutQuotesInput = {
    id?: string;
    orgId: string;
    branchId: string;
    number: string;
    status?: string;
    notes?: string | null;
    dueAt?: Date | string | null;
    createdBy: string;
    createdAt?: Date | string;
    awardedAt?: Date | string | null;
    lines?: Prisma.RfqLineUncheckedCreateNestedManyWithoutRfqInput;
};
export type RequestForQuoteCreateOrConnectWithoutQuotesInput = {
    where: Prisma.RequestForQuoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.RequestForQuoteCreateWithoutQuotesInput, Prisma.RequestForQuoteUncheckedCreateWithoutQuotesInput>;
};
export type RequestForQuoteUpsertWithoutQuotesInput = {
    update: Prisma.XOR<Prisma.RequestForQuoteUpdateWithoutQuotesInput, Prisma.RequestForQuoteUncheckedUpdateWithoutQuotesInput>;
    create: Prisma.XOR<Prisma.RequestForQuoteCreateWithoutQuotesInput, Prisma.RequestForQuoteUncheckedCreateWithoutQuotesInput>;
    where?: Prisma.RequestForQuoteWhereInput;
};
export type RequestForQuoteUpdateToOneWithWhereWithoutQuotesInput = {
    where?: Prisma.RequestForQuoteWhereInput;
    data: Prisma.XOR<Prisma.RequestForQuoteUpdateWithoutQuotesInput, Prisma.RequestForQuoteUncheckedUpdateWithoutQuotesInput>;
};
export type RequestForQuoteUpdateWithoutQuotesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    awardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lines?: Prisma.RfqLineUpdateManyWithoutRfqNestedInput;
};
export type RequestForQuoteUncheckedUpdateWithoutQuotesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    awardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lines?: Prisma.RfqLineUncheckedUpdateManyWithoutRfqNestedInput;
};
export type RequestForQuoteCountOutputType = {
    lines: number;
    quotes: number;
};
export type RequestForQuoteCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | RequestForQuoteCountOutputTypeCountLinesArgs;
    quotes?: boolean | RequestForQuoteCountOutputTypeCountQuotesArgs;
};
export type RequestForQuoteCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RequestForQuoteCountOutputTypeSelect<ExtArgs> | null;
};
export type RequestForQuoteCountOutputTypeCountLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RfqLineWhereInput;
};
export type RequestForQuoteCountOutputTypeCountQuotesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RfqQuoteWhereInput;
};
export type RequestForQuoteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    number?: boolean;
    status?: boolean;
    notes?: boolean;
    dueAt?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    awardedAt?: boolean;
    lines?: boolean | Prisma.RequestForQuote$linesArgs<ExtArgs>;
    quotes?: boolean | Prisma.RequestForQuote$quotesArgs<ExtArgs>;
    _count?: boolean | Prisma.RequestForQuoteCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["requestForQuote"]>;
export type RequestForQuoteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    number?: boolean;
    status?: boolean;
    notes?: boolean;
    dueAt?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    awardedAt?: boolean;
}, ExtArgs["result"]["requestForQuote"]>;
export type RequestForQuoteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    number?: boolean;
    status?: boolean;
    notes?: boolean;
    dueAt?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    awardedAt?: boolean;
}, ExtArgs["result"]["requestForQuote"]>;
export type RequestForQuoteSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    number?: boolean;
    status?: boolean;
    notes?: boolean;
    dueAt?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    awardedAt?: boolean;
};
export type RequestForQuoteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "number" | "status" | "notes" | "dueAt" | "createdBy" | "createdAt" | "awardedAt", ExtArgs["result"]["requestForQuote"]>;
export type RequestForQuoteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | Prisma.RequestForQuote$linesArgs<ExtArgs>;
    quotes?: boolean | Prisma.RequestForQuote$quotesArgs<ExtArgs>;
    _count?: boolean | Prisma.RequestForQuoteCountOutputTypeDefaultArgs<ExtArgs>;
};
export type RequestForQuoteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type RequestForQuoteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $RequestForQuotePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RequestForQuote";
    objects: {
        lines: Prisma.$RfqLinePayload<ExtArgs>[];
        quotes: Prisma.$RfqQuotePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        number: string;
        status: string;
        notes: string | null;
        dueAt: Date | null;
        createdBy: string;
        createdAt: Date;
        awardedAt: Date | null;
    }, ExtArgs["result"]["requestForQuote"]>;
    composites: {};
};
export type RequestForQuoteGetPayload<S extends boolean | null | undefined | RequestForQuoteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RequestForQuotePayload, S>;
export type RequestForQuoteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RequestForQuoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RequestForQuoteCountAggregateInputType | true;
};
export interface RequestForQuoteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RequestForQuote'];
        meta: {
            name: 'RequestForQuote';
        };
    };
    findUnique<T extends RequestForQuoteFindUniqueArgs>(args: Prisma.SelectSubset<T, RequestForQuoteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RequestForQuoteClient<runtime.Types.Result.GetResult<Prisma.$RequestForQuotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RequestForQuoteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RequestForQuoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RequestForQuoteClient<runtime.Types.Result.GetResult<Prisma.$RequestForQuotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RequestForQuoteFindFirstArgs>(args?: Prisma.SelectSubset<T, RequestForQuoteFindFirstArgs<ExtArgs>>): Prisma.Prisma__RequestForQuoteClient<runtime.Types.Result.GetResult<Prisma.$RequestForQuotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RequestForQuoteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RequestForQuoteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RequestForQuoteClient<runtime.Types.Result.GetResult<Prisma.$RequestForQuotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RequestForQuoteFindManyArgs>(args?: Prisma.SelectSubset<T, RequestForQuoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RequestForQuotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RequestForQuoteCreateArgs>(args: Prisma.SelectSubset<T, RequestForQuoteCreateArgs<ExtArgs>>): Prisma.Prisma__RequestForQuoteClient<runtime.Types.Result.GetResult<Prisma.$RequestForQuotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RequestForQuoteCreateManyArgs>(args?: Prisma.SelectSubset<T, RequestForQuoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RequestForQuoteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RequestForQuoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RequestForQuotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RequestForQuoteDeleteArgs>(args: Prisma.SelectSubset<T, RequestForQuoteDeleteArgs<ExtArgs>>): Prisma.Prisma__RequestForQuoteClient<runtime.Types.Result.GetResult<Prisma.$RequestForQuotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RequestForQuoteUpdateArgs>(args: Prisma.SelectSubset<T, RequestForQuoteUpdateArgs<ExtArgs>>): Prisma.Prisma__RequestForQuoteClient<runtime.Types.Result.GetResult<Prisma.$RequestForQuotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RequestForQuoteDeleteManyArgs>(args?: Prisma.SelectSubset<T, RequestForQuoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RequestForQuoteUpdateManyArgs>(args: Prisma.SelectSubset<T, RequestForQuoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RequestForQuoteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RequestForQuoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RequestForQuotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RequestForQuoteUpsertArgs>(args: Prisma.SelectSubset<T, RequestForQuoteUpsertArgs<ExtArgs>>): Prisma.Prisma__RequestForQuoteClient<runtime.Types.Result.GetResult<Prisma.$RequestForQuotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RequestForQuoteCountArgs>(args?: Prisma.Subset<T, RequestForQuoteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RequestForQuoteCountAggregateOutputType> : number>;
    aggregate<T extends RequestForQuoteAggregateArgs>(args: Prisma.Subset<T, RequestForQuoteAggregateArgs>): Prisma.PrismaPromise<GetRequestForQuoteAggregateType<T>>;
    groupBy<T extends RequestForQuoteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RequestForQuoteGroupByArgs['orderBy'];
    } : {
        orderBy?: RequestForQuoteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RequestForQuoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRequestForQuoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RequestForQuoteFieldRefs;
}
export interface Prisma__RequestForQuoteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    lines<T extends Prisma.RequestForQuote$linesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RequestForQuote$linesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RfqLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    quotes<T extends Prisma.RequestForQuote$quotesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RequestForQuote$quotesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RfqQuotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RequestForQuoteFieldRefs {
    readonly id: Prisma.FieldRef<"RequestForQuote", 'String'>;
    readonly orgId: Prisma.FieldRef<"RequestForQuote", 'String'>;
    readonly branchId: Prisma.FieldRef<"RequestForQuote", 'String'>;
    readonly number: Prisma.FieldRef<"RequestForQuote", 'String'>;
    readonly status: Prisma.FieldRef<"RequestForQuote", 'String'>;
    readonly notes: Prisma.FieldRef<"RequestForQuote", 'String'>;
    readonly dueAt: Prisma.FieldRef<"RequestForQuote", 'DateTime'>;
    readonly createdBy: Prisma.FieldRef<"RequestForQuote", 'String'>;
    readonly createdAt: Prisma.FieldRef<"RequestForQuote", 'DateTime'>;
    readonly awardedAt: Prisma.FieldRef<"RequestForQuote", 'DateTime'>;
}
export type RequestForQuoteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RequestForQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RequestForQuoteOmit<ExtArgs> | null;
    include?: Prisma.RequestForQuoteInclude<ExtArgs> | null;
    where: Prisma.RequestForQuoteWhereUniqueInput;
};
export type RequestForQuoteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RequestForQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RequestForQuoteOmit<ExtArgs> | null;
    include?: Prisma.RequestForQuoteInclude<ExtArgs> | null;
    where: Prisma.RequestForQuoteWhereUniqueInput;
};
export type RequestForQuoteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RequestForQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RequestForQuoteOmit<ExtArgs> | null;
    include?: Prisma.RequestForQuoteInclude<ExtArgs> | null;
    where?: Prisma.RequestForQuoteWhereInput;
    orderBy?: Prisma.RequestForQuoteOrderByWithRelationInput | Prisma.RequestForQuoteOrderByWithRelationInput[];
    cursor?: Prisma.RequestForQuoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RequestForQuoteScalarFieldEnum | Prisma.RequestForQuoteScalarFieldEnum[];
};
export type RequestForQuoteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RequestForQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RequestForQuoteOmit<ExtArgs> | null;
    include?: Prisma.RequestForQuoteInclude<ExtArgs> | null;
    where?: Prisma.RequestForQuoteWhereInput;
    orderBy?: Prisma.RequestForQuoteOrderByWithRelationInput | Prisma.RequestForQuoteOrderByWithRelationInput[];
    cursor?: Prisma.RequestForQuoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RequestForQuoteScalarFieldEnum | Prisma.RequestForQuoteScalarFieldEnum[];
};
export type RequestForQuoteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RequestForQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RequestForQuoteOmit<ExtArgs> | null;
    include?: Prisma.RequestForQuoteInclude<ExtArgs> | null;
    where?: Prisma.RequestForQuoteWhereInput;
    orderBy?: Prisma.RequestForQuoteOrderByWithRelationInput | Prisma.RequestForQuoteOrderByWithRelationInput[];
    cursor?: Prisma.RequestForQuoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RequestForQuoteScalarFieldEnum | Prisma.RequestForQuoteScalarFieldEnum[];
};
export type RequestForQuoteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RequestForQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RequestForQuoteOmit<ExtArgs> | null;
    include?: Prisma.RequestForQuoteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RequestForQuoteCreateInput, Prisma.RequestForQuoteUncheckedCreateInput>;
};
export type RequestForQuoteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RequestForQuoteCreateManyInput | Prisma.RequestForQuoteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RequestForQuoteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RequestForQuoteSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RequestForQuoteOmit<ExtArgs> | null;
    data: Prisma.RequestForQuoteCreateManyInput | Prisma.RequestForQuoteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RequestForQuoteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RequestForQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RequestForQuoteOmit<ExtArgs> | null;
    include?: Prisma.RequestForQuoteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RequestForQuoteUpdateInput, Prisma.RequestForQuoteUncheckedUpdateInput>;
    where: Prisma.RequestForQuoteWhereUniqueInput;
};
export type RequestForQuoteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RequestForQuoteUpdateManyMutationInput, Prisma.RequestForQuoteUncheckedUpdateManyInput>;
    where?: Prisma.RequestForQuoteWhereInput;
    limit?: number;
};
export type RequestForQuoteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RequestForQuoteSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RequestForQuoteOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RequestForQuoteUpdateManyMutationInput, Prisma.RequestForQuoteUncheckedUpdateManyInput>;
    where?: Prisma.RequestForQuoteWhereInput;
    limit?: number;
};
export type RequestForQuoteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RequestForQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RequestForQuoteOmit<ExtArgs> | null;
    include?: Prisma.RequestForQuoteInclude<ExtArgs> | null;
    where: Prisma.RequestForQuoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.RequestForQuoteCreateInput, Prisma.RequestForQuoteUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RequestForQuoteUpdateInput, Prisma.RequestForQuoteUncheckedUpdateInput>;
};
export type RequestForQuoteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RequestForQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RequestForQuoteOmit<ExtArgs> | null;
    include?: Prisma.RequestForQuoteInclude<ExtArgs> | null;
    where: Prisma.RequestForQuoteWhereUniqueInput;
};
export type RequestForQuoteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RequestForQuoteWhereInput;
    limit?: number;
};
export type RequestForQuote$linesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RfqLineSelect<ExtArgs> | null;
    omit?: Prisma.RfqLineOmit<ExtArgs> | null;
    include?: Prisma.RfqLineInclude<ExtArgs> | null;
    where?: Prisma.RfqLineWhereInput;
    orderBy?: Prisma.RfqLineOrderByWithRelationInput | Prisma.RfqLineOrderByWithRelationInput[];
    cursor?: Prisma.RfqLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RfqLineScalarFieldEnum | Prisma.RfqLineScalarFieldEnum[];
};
export type RequestForQuote$quotesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RequestForQuoteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RequestForQuoteSelect<ExtArgs> | null;
    omit?: Prisma.RequestForQuoteOmit<ExtArgs> | null;
    include?: Prisma.RequestForQuoteInclude<ExtArgs> | null;
};
