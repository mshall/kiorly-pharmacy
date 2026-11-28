import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type CustomerCreditEntryModel = runtime.Types.Result.DefaultSelection<Prisma.$CustomerCreditEntryPayload>;
export type AggregateCustomerCreditEntry = {
    _count: CustomerCreditEntryCountAggregateOutputType | null;
    _avg: CustomerCreditEntryAvgAggregateOutputType | null;
    _sum: CustomerCreditEntrySumAggregateOutputType | null;
    _min: CustomerCreditEntryMinAggregateOutputType | null;
    _max: CustomerCreditEntryMaxAggregateOutputType | null;
};
export type CustomerCreditEntryAvgAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type CustomerCreditEntrySumAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type CustomerCreditEntryMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    accountId: string | null;
    kind: string | null;
    amount: runtime.Decimal | null;
    saleId: string | null;
    note: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type CustomerCreditEntryMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    accountId: string | null;
    kind: string | null;
    amount: runtime.Decimal | null;
    saleId: string | null;
    note: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type CustomerCreditEntryCountAggregateOutputType = {
    id: number;
    orgId: number;
    accountId: number;
    kind: number;
    amount: number;
    saleId: number;
    note: number;
    createdBy: number;
    createdAt: number;
    _all: number;
};
export type CustomerCreditEntryAvgAggregateInputType = {
    amount?: true;
};
export type CustomerCreditEntrySumAggregateInputType = {
    amount?: true;
};
export type CustomerCreditEntryMinAggregateInputType = {
    id?: true;
    orgId?: true;
    accountId?: true;
    kind?: true;
    amount?: true;
    saleId?: true;
    note?: true;
    createdBy?: true;
    createdAt?: true;
};
export type CustomerCreditEntryMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    accountId?: true;
    kind?: true;
    amount?: true;
    saleId?: true;
    note?: true;
    createdBy?: true;
    createdAt?: true;
};
export type CustomerCreditEntryCountAggregateInputType = {
    id?: true;
    orgId?: true;
    accountId?: true;
    kind?: true;
    amount?: true;
    saleId?: true;
    note?: true;
    createdBy?: true;
    createdAt?: true;
    _all?: true;
};
export type CustomerCreditEntryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerCreditEntryWhereInput;
    orderBy?: Prisma.CustomerCreditEntryOrderByWithRelationInput | Prisma.CustomerCreditEntryOrderByWithRelationInput[];
    cursor?: Prisma.CustomerCreditEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CustomerCreditEntryCountAggregateInputType;
    _avg?: CustomerCreditEntryAvgAggregateInputType;
    _sum?: CustomerCreditEntrySumAggregateInputType;
    _min?: CustomerCreditEntryMinAggregateInputType;
    _max?: CustomerCreditEntryMaxAggregateInputType;
};
export type GetCustomerCreditEntryAggregateType<T extends CustomerCreditEntryAggregateArgs> = {
    [P in keyof T & keyof AggregateCustomerCreditEntry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCustomerCreditEntry[P]> : Prisma.GetScalarType<T[P], AggregateCustomerCreditEntry[P]>;
};
export type CustomerCreditEntryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerCreditEntryWhereInput;
    orderBy?: Prisma.CustomerCreditEntryOrderByWithAggregationInput | Prisma.CustomerCreditEntryOrderByWithAggregationInput[];
    by: Prisma.CustomerCreditEntryScalarFieldEnum[] | Prisma.CustomerCreditEntryScalarFieldEnum;
    having?: Prisma.CustomerCreditEntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CustomerCreditEntryCountAggregateInputType | true;
    _avg?: CustomerCreditEntryAvgAggregateInputType;
    _sum?: CustomerCreditEntrySumAggregateInputType;
    _min?: CustomerCreditEntryMinAggregateInputType;
    _max?: CustomerCreditEntryMaxAggregateInputType;
};
export type CustomerCreditEntryGroupByOutputType = {
    id: string;
    orgId: string;
    accountId: string;
    kind: string;
    amount: runtime.Decimal;
    saleId: string | null;
    note: string | null;
    createdBy: string;
    createdAt: Date;
    _count: CustomerCreditEntryCountAggregateOutputType | null;
    _avg: CustomerCreditEntryAvgAggregateOutputType | null;
    _sum: CustomerCreditEntrySumAggregateOutputType | null;
    _min: CustomerCreditEntryMinAggregateOutputType | null;
    _max: CustomerCreditEntryMaxAggregateOutputType | null;
};
export type GetCustomerCreditEntryGroupByPayload<T extends CustomerCreditEntryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CustomerCreditEntryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CustomerCreditEntryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CustomerCreditEntryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CustomerCreditEntryGroupByOutputType[P]>;
}>>;
export type CustomerCreditEntryWhereInput = {
    AND?: Prisma.CustomerCreditEntryWhereInput | Prisma.CustomerCreditEntryWhereInput[];
    OR?: Prisma.CustomerCreditEntryWhereInput[];
    NOT?: Prisma.CustomerCreditEntryWhereInput | Prisma.CustomerCreditEntryWhereInput[];
    id?: Prisma.StringFilter<"CustomerCreditEntry"> | string;
    orgId?: Prisma.StringFilter<"CustomerCreditEntry"> | string;
    accountId?: Prisma.StringFilter<"CustomerCreditEntry"> | string;
    kind?: Prisma.StringFilter<"CustomerCreditEntry"> | string;
    amount?: Prisma.DecimalFilter<"CustomerCreditEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: Prisma.StringNullableFilter<"CustomerCreditEntry"> | string | null;
    note?: Prisma.StringNullableFilter<"CustomerCreditEntry"> | string | null;
    createdBy?: Prisma.StringFilter<"CustomerCreditEntry"> | string;
    createdAt?: Prisma.DateTimeFilter<"CustomerCreditEntry"> | Date | string;
    account?: Prisma.XOR<Prisma.CustomerAccountScalarRelationFilter, Prisma.CustomerAccountWhereInput>;
};
export type CustomerCreditEntryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    accountId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    saleId?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    account?: Prisma.CustomerAccountOrderByWithRelationInput;
};
export type CustomerCreditEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.CustomerCreditEntryWhereInput | Prisma.CustomerCreditEntryWhereInput[];
    OR?: Prisma.CustomerCreditEntryWhereInput[];
    NOT?: Prisma.CustomerCreditEntryWhereInput | Prisma.CustomerCreditEntryWhereInput[];
    orgId?: Prisma.StringFilter<"CustomerCreditEntry"> | string;
    accountId?: Prisma.StringFilter<"CustomerCreditEntry"> | string;
    kind?: Prisma.StringFilter<"CustomerCreditEntry"> | string;
    amount?: Prisma.DecimalFilter<"CustomerCreditEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: Prisma.StringNullableFilter<"CustomerCreditEntry"> | string | null;
    note?: Prisma.StringNullableFilter<"CustomerCreditEntry"> | string | null;
    createdBy?: Prisma.StringFilter<"CustomerCreditEntry"> | string;
    createdAt?: Prisma.DateTimeFilter<"CustomerCreditEntry"> | Date | string;
    account?: Prisma.XOR<Prisma.CustomerAccountScalarRelationFilter, Prisma.CustomerAccountWhereInput>;
}, "id">;
export type CustomerCreditEntryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    accountId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    saleId?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.CustomerCreditEntryCountOrderByAggregateInput;
    _avg?: Prisma.CustomerCreditEntryAvgOrderByAggregateInput;
    _max?: Prisma.CustomerCreditEntryMaxOrderByAggregateInput;
    _min?: Prisma.CustomerCreditEntryMinOrderByAggregateInput;
    _sum?: Prisma.CustomerCreditEntrySumOrderByAggregateInput;
};
export type CustomerCreditEntryScalarWhereWithAggregatesInput = {
    AND?: Prisma.CustomerCreditEntryScalarWhereWithAggregatesInput | Prisma.CustomerCreditEntryScalarWhereWithAggregatesInput[];
    OR?: Prisma.CustomerCreditEntryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CustomerCreditEntryScalarWhereWithAggregatesInput | Prisma.CustomerCreditEntryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"CustomerCreditEntry"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"CustomerCreditEntry"> | string;
    accountId?: Prisma.StringWithAggregatesFilter<"CustomerCreditEntry"> | string;
    kind?: Prisma.StringWithAggregatesFilter<"CustomerCreditEntry"> | string;
    amount?: Prisma.DecimalWithAggregatesFilter<"CustomerCreditEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: Prisma.StringNullableWithAggregatesFilter<"CustomerCreditEntry"> | string | null;
    note?: Prisma.StringNullableWithAggregatesFilter<"CustomerCreditEntry"> | string | null;
    createdBy?: Prisma.StringWithAggregatesFilter<"CustomerCreditEntry"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"CustomerCreditEntry"> | Date | string;
};
export type CustomerCreditEntryCreateInput = {
    id?: string;
    orgId: string;
    kind: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: string | null;
    note?: string | null;
    createdBy: string;
    createdAt?: Date | string;
    account: Prisma.CustomerAccountCreateNestedOneWithoutEntriesInput;
};
export type CustomerCreditEntryUncheckedCreateInput = {
    id?: string;
    orgId: string;
    accountId: string;
    kind: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: string | null;
    note?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type CustomerCreditEntryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    account?: Prisma.CustomerAccountUpdateOneRequiredWithoutEntriesNestedInput;
};
export type CustomerCreditEntryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    accountId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerCreditEntryCreateManyInput = {
    id?: string;
    orgId: string;
    accountId: string;
    kind: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: string | null;
    note?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type CustomerCreditEntryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerCreditEntryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    accountId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerCreditEntryListRelationFilter = {
    every?: Prisma.CustomerCreditEntryWhereInput;
    some?: Prisma.CustomerCreditEntryWhereInput;
    none?: Prisma.CustomerCreditEntryWhereInput;
};
export type CustomerCreditEntryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CustomerCreditEntryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    accountId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CustomerCreditEntryAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type CustomerCreditEntryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    accountId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CustomerCreditEntryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    accountId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CustomerCreditEntrySumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type CustomerCreditEntryCreateNestedManyWithoutAccountInput = {
    create?: Prisma.XOR<Prisma.CustomerCreditEntryCreateWithoutAccountInput, Prisma.CustomerCreditEntryUncheckedCreateWithoutAccountInput> | Prisma.CustomerCreditEntryCreateWithoutAccountInput[] | Prisma.CustomerCreditEntryUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: Prisma.CustomerCreditEntryCreateOrConnectWithoutAccountInput | Prisma.CustomerCreditEntryCreateOrConnectWithoutAccountInput[];
    createMany?: Prisma.CustomerCreditEntryCreateManyAccountInputEnvelope;
    connect?: Prisma.CustomerCreditEntryWhereUniqueInput | Prisma.CustomerCreditEntryWhereUniqueInput[];
};
export type CustomerCreditEntryUncheckedCreateNestedManyWithoutAccountInput = {
    create?: Prisma.XOR<Prisma.CustomerCreditEntryCreateWithoutAccountInput, Prisma.CustomerCreditEntryUncheckedCreateWithoutAccountInput> | Prisma.CustomerCreditEntryCreateWithoutAccountInput[] | Prisma.CustomerCreditEntryUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: Prisma.CustomerCreditEntryCreateOrConnectWithoutAccountInput | Prisma.CustomerCreditEntryCreateOrConnectWithoutAccountInput[];
    createMany?: Prisma.CustomerCreditEntryCreateManyAccountInputEnvelope;
    connect?: Prisma.CustomerCreditEntryWhereUniqueInput | Prisma.CustomerCreditEntryWhereUniqueInput[];
};
export type CustomerCreditEntryUpdateManyWithoutAccountNestedInput = {
    create?: Prisma.XOR<Prisma.CustomerCreditEntryCreateWithoutAccountInput, Prisma.CustomerCreditEntryUncheckedCreateWithoutAccountInput> | Prisma.CustomerCreditEntryCreateWithoutAccountInput[] | Prisma.CustomerCreditEntryUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: Prisma.CustomerCreditEntryCreateOrConnectWithoutAccountInput | Prisma.CustomerCreditEntryCreateOrConnectWithoutAccountInput[];
    upsert?: Prisma.CustomerCreditEntryUpsertWithWhereUniqueWithoutAccountInput | Prisma.CustomerCreditEntryUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: Prisma.CustomerCreditEntryCreateManyAccountInputEnvelope;
    set?: Prisma.CustomerCreditEntryWhereUniqueInput | Prisma.CustomerCreditEntryWhereUniqueInput[];
    disconnect?: Prisma.CustomerCreditEntryWhereUniqueInput | Prisma.CustomerCreditEntryWhereUniqueInput[];
    delete?: Prisma.CustomerCreditEntryWhereUniqueInput | Prisma.CustomerCreditEntryWhereUniqueInput[];
    connect?: Prisma.CustomerCreditEntryWhereUniqueInput | Prisma.CustomerCreditEntryWhereUniqueInput[];
    update?: Prisma.CustomerCreditEntryUpdateWithWhereUniqueWithoutAccountInput | Prisma.CustomerCreditEntryUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?: Prisma.CustomerCreditEntryUpdateManyWithWhereWithoutAccountInput | Prisma.CustomerCreditEntryUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: Prisma.CustomerCreditEntryScalarWhereInput | Prisma.CustomerCreditEntryScalarWhereInput[];
};
export type CustomerCreditEntryUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: Prisma.XOR<Prisma.CustomerCreditEntryCreateWithoutAccountInput, Prisma.CustomerCreditEntryUncheckedCreateWithoutAccountInput> | Prisma.CustomerCreditEntryCreateWithoutAccountInput[] | Prisma.CustomerCreditEntryUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: Prisma.CustomerCreditEntryCreateOrConnectWithoutAccountInput | Prisma.CustomerCreditEntryCreateOrConnectWithoutAccountInput[];
    upsert?: Prisma.CustomerCreditEntryUpsertWithWhereUniqueWithoutAccountInput | Prisma.CustomerCreditEntryUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: Prisma.CustomerCreditEntryCreateManyAccountInputEnvelope;
    set?: Prisma.CustomerCreditEntryWhereUniqueInput | Prisma.CustomerCreditEntryWhereUniqueInput[];
    disconnect?: Prisma.CustomerCreditEntryWhereUniqueInput | Prisma.CustomerCreditEntryWhereUniqueInput[];
    delete?: Prisma.CustomerCreditEntryWhereUniqueInput | Prisma.CustomerCreditEntryWhereUniqueInput[];
    connect?: Prisma.CustomerCreditEntryWhereUniqueInput | Prisma.CustomerCreditEntryWhereUniqueInput[];
    update?: Prisma.CustomerCreditEntryUpdateWithWhereUniqueWithoutAccountInput | Prisma.CustomerCreditEntryUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?: Prisma.CustomerCreditEntryUpdateManyWithWhereWithoutAccountInput | Prisma.CustomerCreditEntryUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: Prisma.CustomerCreditEntryScalarWhereInput | Prisma.CustomerCreditEntryScalarWhereInput[];
};
export type CustomerCreditEntryCreateWithoutAccountInput = {
    id?: string;
    orgId: string;
    kind: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: string | null;
    note?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type CustomerCreditEntryUncheckedCreateWithoutAccountInput = {
    id?: string;
    orgId: string;
    kind: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: string | null;
    note?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type CustomerCreditEntryCreateOrConnectWithoutAccountInput = {
    where: Prisma.CustomerCreditEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.CustomerCreditEntryCreateWithoutAccountInput, Prisma.CustomerCreditEntryUncheckedCreateWithoutAccountInput>;
};
export type CustomerCreditEntryCreateManyAccountInputEnvelope = {
    data: Prisma.CustomerCreditEntryCreateManyAccountInput | Prisma.CustomerCreditEntryCreateManyAccountInput[];
    skipDuplicates?: boolean;
};
export type CustomerCreditEntryUpsertWithWhereUniqueWithoutAccountInput = {
    where: Prisma.CustomerCreditEntryWhereUniqueInput;
    update: Prisma.XOR<Prisma.CustomerCreditEntryUpdateWithoutAccountInput, Prisma.CustomerCreditEntryUncheckedUpdateWithoutAccountInput>;
    create: Prisma.XOR<Prisma.CustomerCreditEntryCreateWithoutAccountInput, Prisma.CustomerCreditEntryUncheckedCreateWithoutAccountInput>;
};
export type CustomerCreditEntryUpdateWithWhereUniqueWithoutAccountInput = {
    where: Prisma.CustomerCreditEntryWhereUniqueInput;
    data: Prisma.XOR<Prisma.CustomerCreditEntryUpdateWithoutAccountInput, Prisma.CustomerCreditEntryUncheckedUpdateWithoutAccountInput>;
};
export type CustomerCreditEntryUpdateManyWithWhereWithoutAccountInput = {
    where: Prisma.CustomerCreditEntryScalarWhereInput;
    data: Prisma.XOR<Prisma.CustomerCreditEntryUpdateManyMutationInput, Prisma.CustomerCreditEntryUncheckedUpdateManyWithoutAccountInput>;
};
export type CustomerCreditEntryScalarWhereInput = {
    AND?: Prisma.CustomerCreditEntryScalarWhereInput | Prisma.CustomerCreditEntryScalarWhereInput[];
    OR?: Prisma.CustomerCreditEntryScalarWhereInput[];
    NOT?: Prisma.CustomerCreditEntryScalarWhereInput | Prisma.CustomerCreditEntryScalarWhereInput[];
    id?: Prisma.StringFilter<"CustomerCreditEntry"> | string;
    orgId?: Prisma.StringFilter<"CustomerCreditEntry"> | string;
    accountId?: Prisma.StringFilter<"CustomerCreditEntry"> | string;
    kind?: Prisma.StringFilter<"CustomerCreditEntry"> | string;
    amount?: Prisma.DecimalFilter<"CustomerCreditEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: Prisma.StringNullableFilter<"CustomerCreditEntry"> | string | null;
    note?: Prisma.StringNullableFilter<"CustomerCreditEntry"> | string | null;
    createdBy?: Prisma.StringFilter<"CustomerCreditEntry"> | string;
    createdAt?: Prisma.DateTimeFilter<"CustomerCreditEntry"> | Date | string;
};
export type CustomerCreditEntryCreateManyAccountInput = {
    id?: string;
    orgId: string;
    kind: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: string | null;
    note?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type CustomerCreditEntryUpdateWithoutAccountInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerCreditEntryUncheckedUpdateWithoutAccountInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerCreditEntryUncheckedUpdateManyWithoutAccountInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    saleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerCreditEntrySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    accountId?: boolean;
    kind?: boolean;
    amount?: boolean;
    saleId?: boolean;
    note?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    account?: boolean | Prisma.CustomerAccountDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["customerCreditEntry"]>;
export type CustomerCreditEntrySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    accountId?: boolean;
    kind?: boolean;
    amount?: boolean;
    saleId?: boolean;
    note?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    account?: boolean | Prisma.CustomerAccountDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["customerCreditEntry"]>;
export type CustomerCreditEntrySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    accountId?: boolean;
    kind?: boolean;
    amount?: boolean;
    saleId?: boolean;
    note?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    account?: boolean | Prisma.CustomerAccountDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["customerCreditEntry"]>;
export type CustomerCreditEntrySelectScalar = {
    id?: boolean;
    orgId?: boolean;
    accountId?: boolean;
    kind?: boolean;
    amount?: boolean;
    saleId?: boolean;
    note?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
};
export type CustomerCreditEntryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "accountId" | "kind" | "amount" | "saleId" | "note" | "createdBy" | "createdAt", ExtArgs["result"]["customerCreditEntry"]>;
export type CustomerCreditEntryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    account?: boolean | Prisma.CustomerAccountDefaultArgs<ExtArgs>;
};
export type CustomerCreditEntryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    account?: boolean | Prisma.CustomerAccountDefaultArgs<ExtArgs>;
};
export type CustomerCreditEntryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    account?: boolean | Prisma.CustomerAccountDefaultArgs<ExtArgs>;
};
export type $CustomerCreditEntryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CustomerCreditEntry";
    objects: {
        account: Prisma.$CustomerAccountPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        accountId: string;
        kind: string;
        amount: runtime.Decimal;
        saleId: string | null;
        note: string | null;
        createdBy: string;
        createdAt: Date;
    }, ExtArgs["result"]["customerCreditEntry"]>;
    composites: {};
};
export type CustomerCreditEntryGetPayload<S extends boolean | null | undefined | CustomerCreditEntryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CustomerCreditEntryPayload, S>;
export type CustomerCreditEntryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CustomerCreditEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CustomerCreditEntryCountAggregateInputType | true;
};
export interface CustomerCreditEntryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CustomerCreditEntry'];
        meta: {
            name: 'CustomerCreditEntry';
        };
    };
    findUnique<T extends CustomerCreditEntryFindUniqueArgs>(args: Prisma.SelectSubset<T, CustomerCreditEntryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CustomerCreditEntryClient<runtime.Types.Result.GetResult<Prisma.$CustomerCreditEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CustomerCreditEntryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CustomerCreditEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CustomerCreditEntryClient<runtime.Types.Result.GetResult<Prisma.$CustomerCreditEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CustomerCreditEntryFindFirstArgs>(args?: Prisma.SelectSubset<T, CustomerCreditEntryFindFirstArgs<ExtArgs>>): Prisma.Prisma__CustomerCreditEntryClient<runtime.Types.Result.GetResult<Prisma.$CustomerCreditEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CustomerCreditEntryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CustomerCreditEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CustomerCreditEntryClient<runtime.Types.Result.GetResult<Prisma.$CustomerCreditEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CustomerCreditEntryFindManyArgs>(args?: Prisma.SelectSubset<T, CustomerCreditEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerCreditEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CustomerCreditEntryCreateArgs>(args: Prisma.SelectSubset<T, CustomerCreditEntryCreateArgs<ExtArgs>>): Prisma.Prisma__CustomerCreditEntryClient<runtime.Types.Result.GetResult<Prisma.$CustomerCreditEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CustomerCreditEntryCreateManyArgs>(args?: Prisma.SelectSubset<T, CustomerCreditEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CustomerCreditEntryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CustomerCreditEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerCreditEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CustomerCreditEntryDeleteArgs>(args: Prisma.SelectSubset<T, CustomerCreditEntryDeleteArgs<ExtArgs>>): Prisma.Prisma__CustomerCreditEntryClient<runtime.Types.Result.GetResult<Prisma.$CustomerCreditEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CustomerCreditEntryUpdateArgs>(args: Prisma.SelectSubset<T, CustomerCreditEntryUpdateArgs<ExtArgs>>): Prisma.Prisma__CustomerCreditEntryClient<runtime.Types.Result.GetResult<Prisma.$CustomerCreditEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CustomerCreditEntryDeleteManyArgs>(args?: Prisma.SelectSubset<T, CustomerCreditEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CustomerCreditEntryUpdateManyArgs>(args: Prisma.SelectSubset<T, CustomerCreditEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CustomerCreditEntryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CustomerCreditEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerCreditEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CustomerCreditEntryUpsertArgs>(args: Prisma.SelectSubset<T, CustomerCreditEntryUpsertArgs<ExtArgs>>): Prisma.Prisma__CustomerCreditEntryClient<runtime.Types.Result.GetResult<Prisma.$CustomerCreditEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CustomerCreditEntryCountArgs>(args?: Prisma.Subset<T, CustomerCreditEntryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CustomerCreditEntryCountAggregateOutputType> : number>;
    aggregate<T extends CustomerCreditEntryAggregateArgs>(args: Prisma.Subset<T, CustomerCreditEntryAggregateArgs>): Prisma.PrismaPromise<GetCustomerCreditEntryAggregateType<T>>;
    groupBy<T extends CustomerCreditEntryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CustomerCreditEntryGroupByArgs['orderBy'];
    } : {
        orderBy?: CustomerCreditEntryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CustomerCreditEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerCreditEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CustomerCreditEntryFieldRefs;
}
export interface Prisma__CustomerCreditEntryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    account<T extends Prisma.CustomerAccountDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CustomerAccountDefaultArgs<ExtArgs>>): Prisma.Prisma__CustomerAccountClient<runtime.Types.Result.GetResult<Prisma.$CustomerAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CustomerCreditEntryFieldRefs {
    readonly id: Prisma.FieldRef<"CustomerCreditEntry", 'String'>;
    readonly orgId: Prisma.FieldRef<"CustomerCreditEntry", 'String'>;
    readonly accountId: Prisma.FieldRef<"CustomerCreditEntry", 'String'>;
    readonly kind: Prisma.FieldRef<"CustomerCreditEntry", 'String'>;
    readonly amount: Prisma.FieldRef<"CustomerCreditEntry", 'Decimal'>;
    readonly saleId: Prisma.FieldRef<"CustomerCreditEntry", 'String'>;
    readonly note: Prisma.FieldRef<"CustomerCreditEntry", 'String'>;
    readonly createdBy: Prisma.FieldRef<"CustomerCreditEntry", 'String'>;
    readonly createdAt: Prisma.FieldRef<"CustomerCreditEntry", 'DateTime'>;
}
export type CustomerCreditEntryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerCreditEntrySelect<ExtArgs> | null;
    omit?: Prisma.CustomerCreditEntryOmit<ExtArgs> | null;
    include?: Prisma.CustomerCreditEntryInclude<ExtArgs> | null;
    where: Prisma.CustomerCreditEntryWhereUniqueInput;
};
export type CustomerCreditEntryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerCreditEntrySelect<ExtArgs> | null;
    omit?: Prisma.CustomerCreditEntryOmit<ExtArgs> | null;
    include?: Prisma.CustomerCreditEntryInclude<ExtArgs> | null;
    where: Prisma.CustomerCreditEntryWhereUniqueInput;
};
export type CustomerCreditEntryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerCreditEntrySelect<ExtArgs> | null;
    omit?: Prisma.CustomerCreditEntryOmit<ExtArgs> | null;
    include?: Prisma.CustomerCreditEntryInclude<ExtArgs> | null;
    where?: Prisma.CustomerCreditEntryWhereInput;
    orderBy?: Prisma.CustomerCreditEntryOrderByWithRelationInput | Prisma.CustomerCreditEntryOrderByWithRelationInput[];
    cursor?: Prisma.CustomerCreditEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerCreditEntryScalarFieldEnum | Prisma.CustomerCreditEntryScalarFieldEnum[];
};
export type CustomerCreditEntryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerCreditEntrySelect<ExtArgs> | null;
    omit?: Prisma.CustomerCreditEntryOmit<ExtArgs> | null;
    include?: Prisma.CustomerCreditEntryInclude<ExtArgs> | null;
    where?: Prisma.CustomerCreditEntryWhereInput;
    orderBy?: Prisma.CustomerCreditEntryOrderByWithRelationInput | Prisma.CustomerCreditEntryOrderByWithRelationInput[];
    cursor?: Prisma.CustomerCreditEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerCreditEntryScalarFieldEnum | Prisma.CustomerCreditEntryScalarFieldEnum[];
};
export type CustomerCreditEntryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerCreditEntrySelect<ExtArgs> | null;
    omit?: Prisma.CustomerCreditEntryOmit<ExtArgs> | null;
    include?: Prisma.CustomerCreditEntryInclude<ExtArgs> | null;
    where?: Prisma.CustomerCreditEntryWhereInput;
    orderBy?: Prisma.CustomerCreditEntryOrderByWithRelationInput | Prisma.CustomerCreditEntryOrderByWithRelationInput[];
    cursor?: Prisma.CustomerCreditEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerCreditEntryScalarFieldEnum | Prisma.CustomerCreditEntryScalarFieldEnum[];
};
export type CustomerCreditEntryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerCreditEntrySelect<ExtArgs> | null;
    omit?: Prisma.CustomerCreditEntryOmit<ExtArgs> | null;
    include?: Prisma.CustomerCreditEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CustomerCreditEntryCreateInput, Prisma.CustomerCreditEntryUncheckedCreateInput>;
};
export type CustomerCreditEntryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CustomerCreditEntryCreateManyInput | Prisma.CustomerCreditEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CustomerCreditEntryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerCreditEntrySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CustomerCreditEntryOmit<ExtArgs> | null;
    data: Prisma.CustomerCreditEntryCreateManyInput | Prisma.CustomerCreditEntryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CustomerCreditEntryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CustomerCreditEntryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerCreditEntrySelect<ExtArgs> | null;
    omit?: Prisma.CustomerCreditEntryOmit<ExtArgs> | null;
    include?: Prisma.CustomerCreditEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CustomerCreditEntryUpdateInput, Prisma.CustomerCreditEntryUncheckedUpdateInput>;
    where: Prisma.CustomerCreditEntryWhereUniqueInput;
};
export type CustomerCreditEntryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CustomerCreditEntryUpdateManyMutationInput, Prisma.CustomerCreditEntryUncheckedUpdateManyInput>;
    where?: Prisma.CustomerCreditEntryWhereInput;
    limit?: number;
};
export type CustomerCreditEntryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerCreditEntrySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CustomerCreditEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CustomerCreditEntryUpdateManyMutationInput, Prisma.CustomerCreditEntryUncheckedUpdateManyInput>;
    where?: Prisma.CustomerCreditEntryWhereInput;
    limit?: number;
    include?: Prisma.CustomerCreditEntryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CustomerCreditEntryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerCreditEntrySelect<ExtArgs> | null;
    omit?: Prisma.CustomerCreditEntryOmit<ExtArgs> | null;
    include?: Prisma.CustomerCreditEntryInclude<ExtArgs> | null;
    where: Prisma.CustomerCreditEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.CustomerCreditEntryCreateInput, Prisma.CustomerCreditEntryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CustomerCreditEntryUpdateInput, Prisma.CustomerCreditEntryUncheckedUpdateInput>;
};
export type CustomerCreditEntryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerCreditEntrySelect<ExtArgs> | null;
    omit?: Prisma.CustomerCreditEntryOmit<ExtArgs> | null;
    include?: Prisma.CustomerCreditEntryInclude<ExtArgs> | null;
    where: Prisma.CustomerCreditEntryWhereUniqueInput;
};
export type CustomerCreditEntryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerCreditEntryWhereInput;
    limit?: number;
};
export type CustomerCreditEntryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerCreditEntrySelect<ExtArgs> | null;
    omit?: Prisma.CustomerCreditEntryOmit<ExtArgs> | null;
    include?: Prisma.CustomerCreditEntryInclude<ExtArgs> | null;
};
