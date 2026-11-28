import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type SupplierLedgerEntryModel = runtime.Types.Result.DefaultSelection<Prisma.$SupplierLedgerEntryPayload>;
export type AggregateSupplierLedgerEntry = {
    _count: SupplierLedgerEntryCountAggregateOutputType | null;
    _avg: SupplierLedgerEntryAvgAggregateOutputType | null;
    _sum: SupplierLedgerEntrySumAggregateOutputType | null;
    _min: SupplierLedgerEntryMinAggregateOutputType | null;
    _max: SupplierLedgerEntryMaxAggregateOutputType | null;
};
export type SupplierLedgerEntryAvgAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type SupplierLedgerEntrySumAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type SupplierLedgerEntryMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    supplierId: string | null;
    type: $Enums.SupplierLedgerType | null;
    amount: runtime.Decimal | null;
    refType: string | null;
    refId: string | null;
    note: string | null;
    idempotencyKey: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type SupplierLedgerEntryMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    supplierId: string | null;
    type: $Enums.SupplierLedgerType | null;
    amount: runtime.Decimal | null;
    refType: string | null;
    refId: string | null;
    note: string | null;
    idempotencyKey: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type SupplierLedgerEntryCountAggregateOutputType = {
    id: number;
    orgId: number;
    supplierId: number;
    type: number;
    amount: number;
    refType: number;
    refId: number;
    note: number;
    idempotencyKey: number;
    createdBy: number;
    createdAt: number;
    _all: number;
};
export type SupplierLedgerEntryAvgAggregateInputType = {
    amount?: true;
};
export type SupplierLedgerEntrySumAggregateInputType = {
    amount?: true;
};
export type SupplierLedgerEntryMinAggregateInputType = {
    id?: true;
    orgId?: true;
    supplierId?: true;
    type?: true;
    amount?: true;
    refType?: true;
    refId?: true;
    note?: true;
    idempotencyKey?: true;
    createdBy?: true;
    createdAt?: true;
};
export type SupplierLedgerEntryMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    supplierId?: true;
    type?: true;
    amount?: true;
    refType?: true;
    refId?: true;
    note?: true;
    idempotencyKey?: true;
    createdBy?: true;
    createdAt?: true;
};
export type SupplierLedgerEntryCountAggregateInputType = {
    id?: true;
    orgId?: true;
    supplierId?: true;
    type?: true;
    amount?: true;
    refType?: true;
    refId?: true;
    note?: true;
    idempotencyKey?: true;
    createdBy?: true;
    createdAt?: true;
    _all?: true;
};
export type SupplierLedgerEntryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierLedgerEntryWhereInput;
    orderBy?: Prisma.SupplierLedgerEntryOrderByWithRelationInput | Prisma.SupplierLedgerEntryOrderByWithRelationInput[];
    cursor?: Prisma.SupplierLedgerEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SupplierLedgerEntryCountAggregateInputType;
    _avg?: SupplierLedgerEntryAvgAggregateInputType;
    _sum?: SupplierLedgerEntrySumAggregateInputType;
    _min?: SupplierLedgerEntryMinAggregateInputType;
    _max?: SupplierLedgerEntryMaxAggregateInputType;
};
export type GetSupplierLedgerEntryAggregateType<T extends SupplierLedgerEntryAggregateArgs> = {
    [P in keyof T & keyof AggregateSupplierLedgerEntry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSupplierLedgerEntry[P]> : Prisma.GetScalarType<T[P], AggregateSupplierLedgerEntry[P]>;
};
export type SupplierLedgerEntryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierLedgerEntryWhereInput;
    orderBy?: Prisma.SupplierLedgerEntryOrderByWithAggregationInput | Prisma.SupplierLedgerEntryOrderByWithAggregationInput[];
    by: Prisma.SupplierLedgerEntryScalarFieldEnum[] | Prisma.SupplierLedgerEntryScalarFieldEnum;
    having?: Prisma.SupplierLedgerEntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SupplierLedgerEntryCountAggregateInputType | true;
    _avg?: SupplierLedgerEntryAvgAggregateInputType;
    _sum?: SupplierLedgerEntrySumAggregateInputType;
    _min?: SupplierLedgerEntryMinAggregateInputType;
    _max?: SupplierLedgerEntryMaxAggregateInputType;
};
export type SupplierLedgerEntryGroupByOutputType = {
    id: string;
    orgId: string;
    supplierId: string;
    type: $Enums.SupplierLedgerType;
    amount: runtime.Decimal;
    refType: string | null;
    refId: string | null;
    note: string | null;
    idempotencyKey: string | null;
    createdBy: string;
    createdAt: Date;
    _count: SupplierLedgerEntryCountAggregateOutputType | null;
    _avg: SupplierLedgerEntryAvgAggregateOutputType | null;
    _sum: SupplierLedgerEntrySumAggregateOutputType | null;
    _min: SupplierLedgerEntryMinAggregateOutputType | null;
    _max: SupplierLedgerEntryMaxAggregateOutputType | null;
};
export type GetSupplierLedgerEntryGroupByPayload<T extends SupplierLedgerEntryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SupplierLedgerEntryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SupplierLedgerEntryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SupplierLedgerEntryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SupplierLedgerEntryGroupByOutputType[P]>;
}>>;
export type SupplierLedgerEntryWhereInput = {
    AND?: Prisma.SupplierLedgerEntryWhereInput | Prisma.SupplierLedgerEntryWhereInput[];
    OR?: Prisma.SupplierLedgerEntryWhereInput[];
    NOT?: Prisma.SupplierLedgerEntryWhereInput | Prisma.SupplierLedgerEntryWhereInput[];
    id?: Prisma.StringFilter<"SupplierLedgerEntry"> | string;
    orgId?: Prisma.StringFilter<"SupplierLedgerEntry"> | string;
    supplierId?: Prisma.StringFilter<"SupplierLedgerEntry"> | string;
    type?: Prisma.EnumSupplierLedgerTypeFilter<"SupplierLedgerEntry"> | $Enums.SupplierLedgerType;
    amount?: Prisma.DecimalFilter<"SupplierLedgerEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: Prisma.StringNullableFilter<"SupplierLedgerEntry"> | string | null;
    refId?: Prisma.StringNullableFilter<"SupplierLedgerEntry"> | string | null;
    note?: Prisma.StringNullableFilter<"SupplierLedgerEntry"> | string | null;
    idempotencyKey?: Prisma.StringNullableFilter<"SupplierLedgerEntry"> | string | null;
    createdBy?: Prisma.StringFilter<"SupplierLedgerEntry"> | string;
    createdAt?: Prisma.DateTimeFilter<"SupplierLedgerEntry"> | Date | string;
    supplier?: Prisma.XOR<Prisma.SupplierScalarRelationFilter, Prisma.SupplierWhereInput>;
};
export type SupplierLedgerEntryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    refType?: Prisma.SortOrderInput | Prisma.SortOrder;
    refId?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    supplier?: Prisma.SupplierOrderByWithRelationInput;
};
export type SupplierLedgerEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId_idempotencyKey?: Prisma.SupplierLedgerEntryOrgIdIdempotencyKeyCompoundUniqueInput;
    AND?: Prisma.SupplierLedgerEntryWhereInput | Prisma.SupplierLedgerEntryWhereInput[];
    OR?: Prisma.SupplierLedgerEntryWhereInput[];
    NOT?: Prisma.SupplierLedgerEntryWhereInput | Prisma.SupplierLedgerEntryWhereInput[];
    orgId?: Prisma.StringFilter<"SupplierLedgerEntry"> | string;
    supplierId?: Prisma.StringFilter<"SupplierLedgerEntry"> | string;
    type?: Prisma.EnumSupplierLedgerTypeFilter<"SupplierLedgerEntry"> | $Enums.SupplierLedgerType;
    amount?: Prisma.DecimalFilter<"SupplierLedgerEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: Prisma.StringNullableFilter<"SupplierLedgerEntry"> | string | null;
    refId?: Prisma.StringNullableFilter<"SupplierLedgerEntry"> | string | null;
    note?: Prisma.StringNullableFilter<"SupplierLedgerEntry"> | string | null;
    idempotencyKey?: Prisma.StringNullableFilter<"SupplierLedgerEntry"> | string | null;
    createdBy?: Prisma.StringFilter<"SupplierLedgerEntry"> | string;
    createdAt?: Prisma.DateTimeFilter<"SupplierLedgerEntry"> | Date | string;
    supplier?: Prisma.XOR<Prisma.SupplierScalarRelationFilter, Prisma.SupplierWhereInput>;
}, "id" | "orgId_idempotencyKey">;
export type SupplierLedgerEntryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    refType?: Prisma.SortOrderInput | Prisma.SortOrder;
    refId?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.SupplierLedgerEntryCountOrderByAggregateInput;
    _avg?: Prisma.SupplierLedgerEntryAvgOrderByAggregateInput;
    _max?: Prisma.SupplierLedgerEntryMaxOrderByAggregateInput;
    _min?: Prisma.SupplierLedgerEntryMinOrderByAggregateInput;
    _sum?: Prisma.SupplierLedgerEntrySumOrderByAggregateInput;
};
export type SupplierLedgerEntryScalarWhereWithAggregatesInput = {
    AND?: Prisma.SupplierLedgerEntryScalarWhereWithAggregatesInput | Prisma.SupplierLedgerEntryScalarWhereWithAggregatesInput[];
    OR?: Prisma.SupplierLedgerEntryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SupplierLedgerEntryScalarWhereWithAggregatesInput | Prisma.SupplierLedgerEntryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SupplierLedgerEntry"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"SupplierLedgerEntry"> | string;
    supplierId?: Prisma.StringWithAggregatesFilter<"SupplierLedgerEntry"> | string;
    type?: Prisma.EnumSupplierLedgerTypeWithAggregatesFilter<"SupplierLedgerEntry"> | $Enums.SupplierLedgerType;
    amount?: Prisma.DecimalWithAggregatesFilter<"SupplierLedgerEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: Prisma.StringNullableWithAggregatesFilter<"SupplierLedgerEntry"> | string | null;
    refId?: Prisma.StringNullableWithAggregatesFilter<"SupplierLedgerEntry"> | string | null;
    note?: Prisma.StringNullableWithAggregatesFilter<"SupplierLedgerEntry"> | string | null;
    idempotencyKey?: Prisma.StringNullableWithAggregatesFilter<"SupplierLedgerEntry"> | string | null;
    createdBy?: Prisma.StringWithAggregatesFilter<"SupplierLedgerEntry"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SupplierLedgerEntry"> | Date | string;
};
export type SupplierLedgerEntryCreateInput = {
    id?: string;
    orgId: string;
    type: $Enums.SupplierLedgerType;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: string | null;
    refId?: string | null;
    note?: string | null;
    idempotencyKey?: string | null;
    createdBy: string;
    createdAt?: Date | string;
    supplier: Prisma.SupplierCreateNestedOneWithoutLedgerInput;
};
export type SupplierLedgerEntryUncheckedCreateInput = {
    id?: string;
    orgId: string;
    supplierId: string;
    type: $Enums.SupplierLedgerType;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: string | null;
    refId?: string | null;
    note?: string | null;
    idempotencyKey?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type SupplierLedgerEntryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumSupplierLedgerTypeFieldUpdateOperationsInput | $Enums.SupplierLedgerType;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    supplier?: Prisma.SupplierUpdateOneRequiredWithoutLedgerNestedInput;
};
export type SupplierLedgerEntryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumSupplierLedgerTypeFieldUpdateOperationsInput | $Enums.SupplierLedgerType;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierLedgerEntryCreateManyInput = {
    id?: string;
    orgId: string;
    supplierId: string;
    type: $Enums.SupplierLedgerType;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: string | null;
    refId?: string | null;
    note?: string | null;
    idempotencyKey?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type SupplierLedgerEntryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumSupplierLedgerTypeFieldUpdateOperationsInput | $Enums.SupplierLedgerType;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierLedgerEntryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    supplierId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumSupplierLedgerTypeFieldUpdateOperationsInput | $Enums.SupplierLedgerType;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierLedgerEntryListRelationFilter = {
    every?: Prisma.SupplierLedgerEntryWhereInput;
    some?: Prisma.SupplierLedgerEntryWhereInput;
    none?: Prisma.SupplierLedgerEntryWhereInput;
};
export type SupplierLedgerEntryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SupplierLedgerEntryOrgIdIdempotencyKeyCompoundUniqueInput = {
    orgId: string;
    idempotencyKey: string;
};
export type SupplierLedgerEntryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SupplierLedgerEntryAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type SupplierLedgerEntryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SupplierLedgerEntryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    supplierId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SupplierLedgerEntrySumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type SupplierLedgerEntryCreateNestedManyWithoutSupplierInput = {
    create?: Prisma.XOR<Prisma.SupplierLedgerEntryCreateWithoutSupplierInput, Prisma.SupplierLedgerEntryUncheckedCreateWithoutSupplierInput> | Prisma.SupplierLedgerEntryCreateWithoutSupplierInput[] | Prisma.SupplierLedgerEntryUncheckedCreateWithoutSupplierInput[];
    connectOrCreate?: Prisma.SupplierLedgerEntryCreateOrConnectWithoutSupplierInput | Prisma.SupplierLedgerEntryCreateOrConnectWithoutSupplierInput[];
    createMany?: Prisma.SupplierLedgerEntryCreateManySupplierInputEnvelope;
    connect?: Prisma.SupplierLedgerEntryWhereUniqueInput | Prisma.SupplierLedgerEntryWhereUniqueInput[];
};
export type SupplierLedgerEntryUncheckedCreateNestedManyWithoutSupplierInput = {
    create?: Prisma.XOR<Prisma.SupplierLedgerEntryCreateWithoutSupplierInput, Prisma.SupplierLedgerEntryUncheckedCreateWithoutSupplierInput> | Prisma.SupplierLedgerEntryCreateWithoutSupplierInput[] | Prisma.SupplierLedgerEntryUncheckedCreateWithoutSupplierInput[];
    connectOrCreate?: Prisma.SupplierLedgerEntryCreateOrConnectWithoutSupplierInput | Prisma.SupplierLedgerEntryCreateOrConnectWithoutSupplierInput[];
    createMany?: Prisma.SupplierLedgerEntryCreateManySupplierInputEnvelope;
    connect?: Prisma.SupplierLedgerEntryWhereUniqueInput | Prisma.SupplierLedgerEntryWhereUniqueInput[];
};
export type SupplierLedgerEntryUpdateManyWithoutSupplierNestedInput = {
    create?: Prisma.XOR<Prisma.SupplierLedgerEntryCreateWithoutSupplierInput, Prisma.SupplierLedgerEntryUncheckedCreateWithoutSupplierInput> | Prisma.SupplierLedgerEntryCreateWithoutSupplierInput[] | Prisma.SupplierLedgerEntryUncheckedCreateWithoutSupplierInput[];
    connectOrCreate?: Prisma.SupplierLedgerEntryCreateOrConnectWithoutSupplierInput | Prisma.SupplierLedgerEntryCreateOrConnectWithoutSupplierInput[];
    upsert?: Prisma.SupplierLedgerEntryUpsertWithWhereUniqueWithoutSupplierInput | Prisma.SupplierLedgerEntryUpsertWithWhereUniqueWithoutSupplierInput[];
    createMany?: Prisma.SupplierLedgerEntryCreateManySupplierInputEnvelope;
    set?: Prisma.SupplierLedgerEntryWhereUniqueInput | Prisma.SupplierLedgerEntryWhereUniqueInput[];
    disconnect?: Prisma.SupplierLedgerEntryWhereUniqueInput | Prisma.SupplierLedgerEntryWhereUniqueInput[];
    delete?: Prisma.SupplierLedgerEntryWhereUniqueInput | Prisma.SupplierLedgerEntryWhereUniqueInput[];
    connect?: Prisma.SupplierLedgerEntryWhereUniqueInput | Prisma.SupplierLedgerEntryWhereUniqueInput[];
    update?: Prisma.SupplierLedgerEntryUpdateWithWhereUniqueWithoutSupplierInput | Prisma.SupplierLedgerEntryUpdateWithWhereUniqueWithoutSupplierInput[];
    updateMany?: Prisma.SupplierLedgerEntryUpdateManyWithWhereWithoutSupplierInput | Prisma.SupplierLedgerEntryUpdateManyWithWhereWithoutSupplierInput[];
    deleteMany?: Prisma.SupplierLedgerEntryScalarWhereInput | Prisma.SupplierLedgerEntryScalarWhereInput[];
};
export type SupplierLedgerEntryUncheckedUpdateManyWithoutSupplierNestedInput = {
    create?: Prisma.XOR<Prisma.SupplierLedgerEntryCreateWithoutSupplierInput, Prisma.SupplierLedgerEntryUncheckedCreateWithoutSupplierInput> | Prisma.SupplierLedgerEntryCreateWithoutSupplierInput[] | Prisma.SupplierLedgerEntryUncheckedCreateWithoutSupplierInput[];
    connectOrCreate?: Prisma.SupplierLedgerEntryCreateOrConnectWithoutSupplierInput | Prisma.SupplierLedgerEntryCreateOrConnectWithoutSupplierInput[];
    upsert?: Prisma.SupplierLedgerEntryUpsertWithWhereUniqueWithoutSupplierInput | Prisma.SupplierLedgerEntryUpsertWithWhereUniqueWithoutSupplierInput[];
    createMany?: Prisma.SupplierLedgerEntryCreateManySupplierInputEnvelope;
    set?: Prisma.SupplierLedgerEntryWhereUniqueInput | Prisma.SupplierLedgerEntryWhereUniqueInput[];
    disconnect?: Prisma.SupplierLedgerEntryWhereUniqueInput | Prisma.SupplierLedgerEntryWhereUniqueInput[];
    delete?: Prisma.SupplierLedgerEntryWhereUniqueInput | Prisma.SupplierLedgerEntryWhereUniqueInput[];
    connect?: Prisma.SupplierLedgerEntryWhereUniqueInput | Prisma.SupplierLedgerEntryWhereUniqueInput[];
    update?: Prisma.SupplierLedgerEntryUpdateWithWhereUniqueWithoutSupplierInput | Prisma.SupplierLedgerEntryUpdateWithWhereUniqueWithoutSupplierInput[];
    updateMany?: Prisma.SupplierLedgerEntryUpdateManyWithWhereWithoutSupplierInput | Prisma.SupplierLedgerEntryUpdateManyWithWhereWithoutSupplierInput[];
    deleteMany?: Prisma.SupplierLedgerEntryScalarWhereInput | Prisma.SupplierLedgerEntryScalarWhereInput[];
};
export type EnumSupplierLedgerTypeFieldUpdateOperationsInput = {
    set?: $Enums.SupplierLedgerType;
};
export type SupplierLedgerEntryCreateWithoutSupplierInput = {
    id?: string;
    orgId: string;
    type: $Enums.SupplierLedgerType;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: string | null;
    refId?: string | null;
    note?: string | null;
    idempotencyKey?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type SupplierLedgerEntryUncheckedCreateWithoutSupplierInput = {
    id?: string;
    orgId: string;
    type: $Enums.SupplierLedgerType;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: string | null;
    refId?: string | null;
    note?: string | null;
    idempotencyKey?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type SupplierLedgerEntryCreateOrConnectWithoutSupplierInput = {
    where: Prisma.SupplierLedgerEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.SupplierLedgerEntryCreateWithoutSupplierInput, Prisma.SupplierLedgerEntryUncheckedCreateWithoutSupplierInput>;
};
export type SupplierLedgerEntryCreateManySupplierInputEnvelope = {
    data: Prisma.SupplierLedgerEntryCreateManySupplierInput | Prisma.SupplierLedgerEntryCreateManySupplierInput[];
    skipDuplicates?: boolean;
};
export type SupplierLedgerEntryUpsertWithWhereUniqueWithoutSupplierInput = {
    where: Prisma.SupplierLedgerEntryWhereUniqueInput;
    update: Prisma.XOR<Prisma.SupplierLedgerEntryUpdateWithoutSupplierInput, Prisma.SupplierLedgerEntryUncheckedUpdateWithoutSupplierInput>;
    create: Prisma.XOR<Prisma.SupplierLedgerEntryCreateWithoutSupplierInput, Prisma.SupplierLedgerEntryUncheckedCreateWithoutSupplierInput>;
};
export type SupplierLedgerEntryUpdateWithWhereUniqueWithoutSupplierInput = {
    where: Prisma.SupplierLedgerEntryWhereUniqueInput;
    data: Prisma.XOR<Prisma.SupplierLedgerEntryUpdateWithoutSupplierInput, Prisma.SupplierLedgerEntryUncheckedUpdateWithoutSupplierInput>;
};
export type SupplierLedgerEntryUpdateManyWithWhereWithoutSupplierInput = {
    where: Prisma.SupplierLedgerEntryScalarWhereInput;
    data: Prisma.XOR<Prisma.SupplierLedgerEntryUpdateManyMutationInput, Prisma.SupplierLedgerEntryUncheckedUpdateManyWithoutSupplierInput>;
};
export type SupplierLedgerEntryScalarWhereInput = {
    AND?: Prisma.SupplierLedgerEntryScalarWhereInput | Prisma.SupplierLedgerEntryScalarWhereInput[];
    OR?: Prisma.SupplierLedgerEntryScalarWhereInput[];
    NOT?: Prisma.SupplierLedgerEntryScalarWhereInput | Prisma.SupplierLedgerEntryScalarWhereInput[];
    id?: Prisma.StringFilter<"SupplierLedgerEntry"> | string;
    orgId?: Prisma.StringFilter<"SupplierLedgerEntry"> | string;
    supplierId?: Prisma.StringFilter<"SupplierLedgerEntry"> | string;
    type?: Prisma.EnumSupplierLedgerTypeFilter<"SupplierLedgerEntry"> | $Enums.SupplierLedgerType;
    amount?: Prisma.DecimalFilter<"SupplierLedgerEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: Prisma.StringNullableFilter<"SupplierLedgerEntry"> | string | null;
    refId?: Prisma.StringNullableFilter<"SupplierLedgerEntry"> | string | null;
    note?: Prisma.StringNullableFilter<"SupplierLedgerEntry"> | string | null;
    idempotencyKey?: Prisma.StringNullableFilter<"SupplierLedgerEntry"> | string | null;
    createdBy?: Prisma.StringFilter<"SupplierLedgerEntry"> | string;
    createdAt?: Prisma.DateTimeFilter<"SupplierLedgerEntry"> | Date | string;
};
export type SupplierLedgerEntryCreateManySupplierInput = {
    id?: string;
    orgId: string;
    type: $Enums.SupplierLedgerType;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: string | null;
    refId?: string | null;
    note?: string | null;
    idempotencyKey?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type SupplierLedgerEntryUpdateWithoutSupplierInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumSupplierLedgerTypeFieldUpdateOperationsInput | $Enums.SupplierLedgerType;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierLedgerEntryUncheckedUpdateWithoutSupplierInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumSupplierLedgerTypeFieldUpdateOperationsInput | $Enums.SupplierLedgerType;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierLedgerEntryUncheckedUpdateManyWithoutSupplierInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumSupplierLedgerTypeFieldUpdateOperationsInput | $Enums.SupplierLedgerType;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierLedgerEntrySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    supplierId?: boolean;
    type?: boolean;
    amount?: boolean;
    refType?: boolean;
    refId?: boolean;
    note?: boolean;
    idempotencyKey?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    supplier?: boolean | Prisma.SupplierDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["supplierLedgerEntry"]>;
export type SupplierLedgerEntrySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    supplierId?: boolean;
    type?: boolean;
    amount?: boolean;
    refType?: boolean;
    refId?: boolean;
    note?: boolean;
    idempotencyKey?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    supplier?: boolean | Prisma.SupplierDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["supplierLedgerEntry"]>;
export type SupplierLedgerEntrySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    supplierId?: boolean;
    type?: boolean;
    amount?: boolean;
    refType?: boolean;
    refId?: boolean;
    note?: boolean;
    idempotencyKey?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    supplier?: boolean | Prisma.SupplierDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["supplierLedgerEntry"]>;
export type SupplierLedgerEntrySelectScalar = {
    id?: boolean;
    orgId?: boolean;
    supplierId?: boolean;
    type?: boolean;
    amount?: boolean;
    refType?: boolean;
    refId?: boolean;
    note?: boolean;
    idempotencyKey?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
};
export type SupplierLedgerEntryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "supplierId" | "type" | "amount" | "refType" | "refId" | "note" | "idempotencyKey" | "createdBy" | "createdAt", ExtArgs["result"]["supplierLedgerEntry"]>;
export type SupplierLedgerEntryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supplier?: boolean | Prisma.SupplierDefaultArgs<ExtArgs>;
};
export type SupplierLedgerEntryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supplier?: boolean | Prisma.SupplierDefaultArgs<ExtArgs>;
};
export type SupplierLedgerEntryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supplier?: boolean | Prisma.SupplierDefaultArgs<ExtArgs>;
};
export type $SupplierLedgerEntryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SupplierLedgerEntry";
    objects: {
        supplier: Prisma.$SupplierPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        supplierId: string;
        type: $Enums.SupplierLedgerType;
        amount: runtime.Decimal;
        refType: string | null;
        refId: string | null;
        note: string | null;
        idempotencyKey: string | null;
        createdBy: string;
        createdAt: Date;
    }, ExtArgs["result"]["supplierLedgerEntry"]>;
    composites: {};
};
export type SupplierLedgerEntryGetPayload<S extends boolean | null | undefined | SupplierLedgerEntryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SupplierLedgerEntryPayload, S>;
export type SupplierLedgerEntryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SupplierLedgerEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SupplierLedgerEntryCountAggregateInputType | true;
};
export interface SupplierLedgerEntryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SupplierLedgerEntry'];
        meta: {
            name: 'SupplierLedgerEntry';
        };
    };
    findUnique<T extends SupplierLedgerEntryFindUniqueArgs>(args: Prisma.SelectSubset<T, SupplierLedgerEntryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SupplierLedgerEntryClient<runtime.Types.Result.GetResult<Prisma.$SupplierLedgerEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SupplierLedgerEntryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SupplierLedgerEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SupplierLedgerEntryClient<runtime.Types.Result.GetResult<Prisma.$SupplierLedgerEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SupplierLedgerEntryFindFirstArgs>(args?: Prisma.SelectSubset<T, SupplierLedgerEntryFindFirstArgs<ExtArgs>>): Prisma.Prisma__SupplierLedgerEntryClient<runtime.Types.Result.GetResult<Prisma.$SupplierLedgerEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SupplierLedgerEntryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SupplierLedgerEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SupplierLedgerEntryClient<runtime.Types.Result.GetResult<Prisma.$SupplierLedgerEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SupplierLedgerEntryFindManyArgs>(args?: Prisma.SelectSubset<T, SupplierLedgerEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierLedgerEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SupplierLedgerEntryCreateArgs>(args: Prisma.SelectSubset<T, SupplierLedgerEntryCreateArgs<ExtArgs>>): Prisma.Prisma__SupplierLedgerEntryClient<runtime.Types.Result.GetResult<Prisma.$SupplierLedgerEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SupplierLedgerEntryCreateManyArgs>(args?: Prisma.SelectSubset<T, SupplierLedgerEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SupplierLedgerEntryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SupplierLedgerEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierLedgerEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SupplierLedgerEntryDeleteArgs>(args: Prisma.SelectSubset<T, SupplierLedgerEntryDeleteArgs<ExtArgs>>): Prisma.Prisma__SupplierLedgerEntryClient<runtime.Types.Result.GetResult<Prisma.$SupplierLedgerEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SupplierLedgerEntryUpdateArgs>(args: Prisma.SelectSubset<T, SupplierLedgerEntryUpdateArgs<ExtArgs>>): Prisma.Prisma__SupplierLedgerEntryClient<runtime.Types.Result.GetResult<Prisma.$SupplierLedgerEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SupplierLedgerEntryDeleteManyArgs>(args?: Prisma.SelectSubset<T, SupplierLedgerEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SupplierLedgerEntryUpdateManyArgs>(args: Prisma.SelectSubset<T, SupplierLedgerEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SupplierLedgerEntryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SupplierLedgerEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierLedgerEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SupplierLedgerEntryUpsertArgs>(args: Prisma.SelectSubset<T, SupplierLedgerEntryUpsertArgs<ExtArgs>>): Prisma.Prisma__SupplierLedgerEntryClient<runtime.Types.Result.GetResult<Prisma.$SupplierLedgerEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SupplierLedgerEntryCountArgs>(args?: Prisma.Subset<T, SupplierLedgerEntryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SupplierLedgerEntryCountAggregateOutputType> : number>;
    aggregate<T extends SupplierLedgerEntryAggregateArgs>(args: Prisma.Subset<T, SupplierLedgerEntryAggregateArgs>): Prisma.PrismaPromise<GetSupplierLedgerEntryAggregateType<T>>;
    groupBy<T extends SupplierLedgerEntryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SupplierLedgerEntryGroupByArgs['orderBy'];
    } : {
        orderBy?: SupplierLedgerEntryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SupplierLedgerEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierLedgerEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SupplierLedgerEntryFieldRefs;
}
export interface Prisma__SupplierLedgerEntryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    supplier<T extends Prisma.SupplierDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SupplierDefaultArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SupplierLedgerEntryFieldRefs {
    readonly id: Prisma.FieldRef<"SupplierLedgerEntry", 'String'>;
    readonly orgId: Prisma.FieldRef<"SupplierLedgerEntry", 'String'>;
    readonly supplierId: Prisma.FieldRef<"SupplierLedgerEntry", 'String'>;
    readonly type: Prisma.FieldRef<"SupplierLedgerEntry", 'SupplierLedgerType'>;
    readonly amount: Prisma.FieldRef<"SupplierLedgerEntry", 'Decimal'>;
    readonly refType: Prisma.FieldRef<"SupplierLedgerEntry", 'String'>;
    readonly refId: Prisma.FieldRef<"SupplierLedgerEntry", 'String'>;
    readonly note: Prisma.FieldRef<"SupplierLedgerEntry", 'String'>;
    readonly idempotencyKey: Prisma.FieldRef<"SupplierLedgerEntry", 'String'>;
    readonly createdBy: Prisma.FieldRef<"SupplierLedgerEntry", 'String'>;
    readonly createdAt: Prisma.FieldRef<"SupplierLedgerEntry", 'DateTime'>;
}
export type SupplierLedgerEntryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierLedgerEntrySelect<ExtArgs> | null;
    omit?: Prisma.SupplierLedgerEntryOmit<ExtArgs> | null;
    include?: Prisma.SupplierLedgerEntryInclude<ExtArgs> | null;
    where: Prisma.SupplierLedgerEntryWhereUniqueInput;
};
export type SupplierLedgerEntryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierLedgerEntrySelect<ExtArgs> | null;
    omit?: Prisma.SupplierLedgerEntryOmit<ExtArgs> | null;
    include?: Prisma.SupplierLedgerEntryInclude<ExtArgs> | null;
    where: Prisma.SupplierLedgerEntryWhereUniqueInput;
};
export type SupplierLedgerEntryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierLedgerEntrySelect<ExtArgs> | null;
    omit?: Prisma.SupplierLedgerEntryOmit<ExtArgs> | null;
    include?: Prisma.SupplierLedgerEntryInclude<ExtArgs> | null;
    where?: Prisma.SupplierLedgerEntryWhereInput;
    orderBy?: Prisma.SupplierLedgerEntryOrderByWithRelationInput | Prisma.SupplierLedgerEntryOrderByWithRelationInput[];
    cursor?: Prisma.SupplierLedgerEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SupplierLedgerEntryScalarFieldEnum | Prisma.SupplierLedgerEntryScalarFieldEnum[];
};
export type SupplierLedgerEntryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierLedgerEntrySelect<ExtArgs> | null;
    omit?: Prisma.SupplierLedgerEntryOmit<ExtArgs> | null;
    include?: Prisma.SupplierLedgerEntryInclude<ExtArgs> | null;
    where?: Prisma.SupplierLedgerEntryWhereInput;
    orderBy?: Prisma.SupplierLedgerEntryOrderByWithRelationInput | Prisma.SupplierLedgerEntryOrderByWithRelationInput[];
    cursor?: Prisma.SupplierLedgerEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SupplierLedgerEntryScalarFieldEnum | Prisma.SupplierLedgerEntryScalarFieldEnum[];
};
export type SupplierLedgerEntryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierLedgerEntrySelect<ExtArgs> | null;
    omit?: Prisma.SupplierLedgerEntryOmit<ExtArgs> | null;
    include?: Prisma.SupplierLedgerEntryInclude<ExtArgs> | null;
    where?: Prisma.SupplierLedgerEntryWhereInput;
    orderBy?: Prisma.SupplierLedgerEntryOrderByWithRelationInput | Prisma.SupplierLedgerEntryOrderByWithRelationInput[];
    cursor?: Prisma.SupplierLedgerEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SupplierLedgerEntryScalarFieldEnum | Prisma.SupplierLedgerEntryScalarFieldEnum[];
};
export type SupplierLedgerEntryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierLedgerEntrySelect<ExtArgs> | null;
    omit?: Prisma.SupplierLedgerEntryOmit<ExtArgs> | null;
    include?: Prisma.SupplierLedgerEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SupplierLedgerEntryCreateInput, Prisma.SupplierLedgerEntryUncheckedCreateInput>;
};
export type SupplierLedgerEntryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SupplierLedgerEntryCreateManyInput | Prisma.SupplierLedgerEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SupplierLedgerEntryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierLedgerEntrySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SupplierLedgerEntryOmit<ExtArgs> | null;
    data: Prisma.SupplierLedgerEntryCreateManyInput | Prisma.SupplierLedgerEntryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SupplierLedgerEntryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SupplierLedgerEntryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierLedgerEntrySelect<ExtArgs> | null;
    omit?: Prisma.SupplierLedgerEntryOmit<ExtArgs> | null;
    include?: Prisma.SupplierLedgerEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SupplierLedgerEntryUpdateInput, Prisma.SupplierLedgerEntryUncheckedUpdateInput>;
    where: Prisma.SupplierLedgerEntryWhereUniqueInput;
};
export type SupplierLedgerEntryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SupplierLedgerEntryUpdateManyMutationInput, Prisma.SupplierLedgerEntryUncheckedUpdateManyInput>;
    where?: Prisma.SupplierLedgerEntryWhereInput;
    limit?: number;
};
export type SupplierLedgerEntryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierLedgerEntrySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SupplierLedgerEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SupplierLedgerEntryUpdateManyMutationInput, Prisma.SupplierLedgerEntryUncheckedUpdateManyInput>;
    where?: Prisma.SupplierLedgerEntryWhereInput;
    limit?: number;
    include?: Prisma.SupplierLedgerEntryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SupplierLedgerEntryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierLedgerEntrySelect<ExtArgs> | null;
    omit?: Prisma.SupplierLedgerEntryOmit<ExtArgs> | null;
    include?: Prisma.SupplierLedgerEntryInclude<ExtArgs> | null;
    where: Prisma.SupplierLedgerEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.SupplierLedgerEntryCreateInput, Prisma.SupplierLedgerEntryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SupplierLedgerEntryUpdateInput, Prisma.SupplierLedgerEntryUncheckedUpdateInput>;
};
export type SupplierLedgerEntryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierLedgerEntrySelect<ExtArgs> | null;
    omit?: Prisma.SupplierLedgerEntryOmit<ExtArgs> | null;
    include?: Prisma.SupplierLedgerEntryInclude<ExtArgs> | null;
    where: Prisma.SupplierLedgerEntryWhereUniqueInput;
};
export type SupplierLedgerEntryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierLedgerEntryWhereInput;
    limit?: number;
};
export type SupplierLedgerEntryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierLedgerEntrySelect<ExtArgs> | null;
    omit?: Prisma.SupplierLedgerEntryOmit<ExtArgs> | null;
    include?: Prisma.SupplierLedgerEntryInclude<ExtArgs> | null;
};
