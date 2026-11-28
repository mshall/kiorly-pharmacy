import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type SupplierModel = runtime.Types.Result.DefaultSelection<Prisma.$SupplierPayload>;
export type AggregateSupplier = {
    _count: SupplierCountAggregateOutputType | null;
    _avg: SupplierAvgAggregateOutputType | null;
    _sum: SupplierSumAggregateOutputType | null;
    _min: SupplierMinAggregateOutputType | null;
    _max: SupplierMaxAggregateOutputType | null;
};
export type SupplierAvgAggregateOutputType = {
    creditLimit: runtime.Decimal | null;
    balance: runtime.Decimal | null;
    leadTimeDays: number | null;
};
export type SupplierSumAggregateOutputType = {
    creditLimit: runtime.Decimal | null;
    balance: runtime.Decimal | null;
    leadTimeDays: number | null;
};
export type SupplierMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    name: string | null;
    phone: string | null;
    email: string | null;
    paymentTerms: string | null;
    creditLimit: runtime.Decimal | null;
    balance: runtime.Decimal | null;
    leadTimeDays: number | null;
    active: boolean | null;
    createdAt: Date | null;
};
export type SupplierMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    name: string | null;
    phone: string | null;
    email: string | null;
    paymentTerms: string | null;
    creditLimit: runtime.Decimal | null;
    balance: runtime.Decimal | null;
    leadTimeDays: number | null;
    active: boolean | null;
    createdAt: Date | null;
};
export type SupplierCountAggregateOutputType = {
    id: number;
    orgId: number;
    name: number;
    phone: number;
    email: number;
    paymentTerms: number;
    creditLimit: number;
    balance: number;
    leadTimeDays: number;
    active: number;
    createdAt: number;
    _all: number;
};
export type SupplierAvgAggregateInputType = {
    creditLimit?: true;
    balance?: true;
    leadTimeDays?: true;
};
export type SupplierSumAggregateInputType = {
    creditLimit?: true;
    balance?: true;
    leadTimeDays?: true;
};
export type SupplierMinAggregateInputType = {
    id?: true;
    orgId?: true;
    name?: true;
    phone?: true;
    email?: true;
    paymentTerms?: true;
    creditLimit?: true;
    balance?: true;
    leadTimeDays?: true;
    active?: true;
    createdAt?: true;
};
export type SupplierMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    name?: true;
    phone?: true;
    email?: true;
    paymentTerms?: true;
    creditLimit?: true;
    balance?: true;
    leadTimeDays?: true;
    active?: true;
    createdAt?: true;
};
export type SupplierCountAggregateInputType = {
    id?: true;
    orgId?: true;
    name?: true;
    phone?: true;
    email?: true;
    paymentTerms?: true;
    creditLimit?: true;
    balance?: true;
    leadTimeDays?: true;
    active?: true;
    createdAt?: true;
    _all?: true;
};
export type SupplierAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierWhereInput;
    orderBy?: Prisma.SupplierOrderByWithRelationInput | Prisma.SupplierOrderByWithRelationInput[];
    cursor?: Prisma.SupplierWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SupplierCountAggregateInputType;
    _avg?: SupplierAvgAggregateInputType;
    _sum?: SupplierSumAggregateInputType;
    _min?: SupplierMinAggregateInputType;
    _max?: SupplierMaxAggregateInputType;
};
export type GetSupplierAggregateType<T extends SupplierAggregateArgs> = {
    [P in keyof T & keyof AggregateSupplier]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSupplier[P]> : Prisma.GetScalarType<T[P], AggregateSupplier[P]>;
};
export type SupplierGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierWhereInput;
    orderBy?: Prisma.SupplierOrderByWithAggregationInput | Prisma.SupplierOrderByWithAggregationInput[];
    by: Prisma.SupplierScalarFieldEnum[] | Prisma.SupplierScalarFieldEnum;
    having?: Prisma.SupplierScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SupplierCountAggregateInputType | true;
    _avg?: SupplierAvgAggregateInputType;
    _sum?: SupplierSumAggregateInputType;
    _min?: SupplierMinAggregateInputType;
    _max?: SupplierMaxAggregateInputType;
};
export type SupplierGroupByOutputType = {
    id: string;
    orgId: string;
    name: string;
    phone: string | null;
    email: string | null;
    paymentTerms: string | null;
    creditLimit: runtime.Decimal | null;
    balance: runtime.Decimal;
    leadTimeDays: number;
    active: boolean;
    createdAt: Date;
    _count: SupplierCountAggregateOutputType | null;
    _avg: SupplierAvgAggregateOutputType | null;
    _sum: SupplierSumAggregateOutputType | null;
    _min: SupplierMinAggregateOutputType | null;
    _max: SupplierMaxAggregateOutputType | null;
};
export type GetSupplierGroupByPayload<T extends SupplierGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SupplierGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SupplierGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SupplierGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SupplierGroupByOutputType[P]>;
}>>;
export type SupplierWhereInput = {
    AND?: Prisma.SupplierWhereInput | Prisma.SupplierWhereInput[];
    OR?: Prisma.SupplierWhereInput[];
    NOT?: Prisma.SupplierWhereInput | Prisma.SupplierWhereInput[];
    id?: Prisma.StringFilter<"Supplier"> | string;
    orgId?: Prisma.StringFilter<"Supplier"> | string;
    name?: Prisma.StringFilter<"Supplier"> | string;
    phone?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    email?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    paymentTerms?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    creditLimit?: Prisma.DecimalNullableFilter<"Supplier"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: Prisma.DecimalFilter<"Supplier"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: Prisma.IntFilter<"Supplier"> | number;
    active?: Prisma.BoolFilter<"Supplier"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Supplier"> | Date | string;
    purchaseOrders?: Prisma.PurchaseOrderListRelationFilter;
    lots?: Prisma.StockLotListRelationFilter;
    ledger?: Prisma.SupplierLedgerEntryListRelationFilter;
};
export type SupplierOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    paymentTerms?: Prisma.SortOrderInput | Prisma.SortOrder;
    creditLimit?: Prisma.SortOrderInput | Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    purchaseOrders?: Prisma.PurchaseOrderOrderByRelationAggregateInput;
    lots?: Prisma.StockLotOrderByRelationAggregateInput;
    ledger?: Prisma.SupplierLedgerEntryOrderByRelationAggregateInput;
};
export type SupplierWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SupplierWhereInput | Prisma.SupplierWhereInput[];
    OR?: Prisma.SupplierWhereInput[];
    NOT?: Prisma.SupplierWhereInput | Prisma.SupplierWhereInput[];
    orgId?: Prisma.StringFilter<"Supplier"> | string;
    name?: Prisma.StringFilter<"Supplier"> | string;
    phone?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    email?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    paymentTerms?: Prisma.StringNullableFilter<"Supplier"> | string | null;
    creditLimit?: Prisma.DecimalNullableFilter<"Supplier"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: Prisma.DecimalFilter<"Supplier"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: Prisma.IntFilter<"Supplier"> | number;
    active?: Prisma.BoolFilter<"Supplier"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Supplier"> | Date | string;
    purchaseOrders?: Prisma.PurchaseOrderListRelationFilter;
    lots?: Prisma.StockLotListRelationFilter;
    ledger?: Prisma.SupplierLedgerEntryListRelationFilter;
}, "id">;
export type SupplierOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    paymentTerms?: Prisma.SortOrderInput | Prisma.SortOrder;
    creditLimit?: Prisma.SortOrderInput | Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.SupplierCountOrderByAggregateInput;
    _avg?: Prisma.SupplierAvgOrderByAggregateInput;
    _max?: Prisma.SupplierMaxOrderByAggregateInput;
    _min?: Prisma.SupplierMinOrderByAggregateInput;
    _sum?: Prisma.SupplierSumOrderByAggregateInput;
};
export type SupplierScalarWhereWithAggregatesInput = {
    AND?: Prisma.SupplierScalarWhereWithAggregatesInput | Prisma.SupplierScalarWhereWithAggregatesInput[];
    OR?: Prisma.SupplierScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SupplierScalarWhereWithAggregatesInput | Prisma.SupplierScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Supplier"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"Supplier"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Supplier"> | string;
    phone?: Prisma.StringNullableWithAggregatesFilter<"Supplier"> | string | null;
    email?: Prisma.StringNullableWithAggregatesFilter<"Supplier"> | string | null;
    paymentTerms?: Prisma.StringNullableWithAggregatesFilter<"Supplier"> | string | null;
    creditLimit?: Prisma.DecimalNullableWithAggregatesFilter<"Supplier"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: Prisma.DecimalWithAggregatesFilter<"Supplier"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: Prisma.IntWithAggregatesFilter<"Supplier"> | number;
    active?: Prisma.BoolWithAggregatesFilter<"Supplier"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Supplier"> | Date | string;
};
export type SupplierCreateInput = {
    id?: string;
    orgId: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    paymentTerms?: string | null;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: number;
    active?: boolean;
    createdAt?: Date | string;
    purchaseOrders?: Prisma.PurchaseOrderCreateNestedManyWithoutSupplierInput;
    lots?: Prisma.StockLotCreateNestedManyWithoutSupplierInput;
    ledger?: Prisma.SupplierLedgerEntryCreateNestedManyWithoutSupplierInput;
};
export type SupplierUncheckedCreateInput = {
    id?: string;
    orgId: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    paymentTerms?: string | null;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: number;
    active?: boolean;
    createdAt?: Date | string;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedCreateNestedManyWithoutSupplierInput;
    lots?: Prisma.StockLotUncheckedCreateNestedManyWithoutSupplierInput;
    ledger?: Prisma.SupplierLedgerEntryUncheckedCreateNestedManyWithoutSupplierInput;
};
export type SupplierUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentTerms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    creditLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    purchaseOrders?: Prisma.PurchaseOrderUpdateManyWithoutSupplierNestedInput;
    lots?: Prisma.StockLotUpdateManyWithoutSupplierNestedInput;
    ledger?: Prisma.SupplierLedgerEntryUpdateManyWithoutSupplierNestedInput;
};
export type SupplierUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentTerms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    creditLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedUpdateManyWithoutSupplierNestedInput;
    lots?: Prisma.StockLotUncheckedUpdateManyWithoutSupplierNestedInput;
    ledger?: Prisma.SupplierLedgerEntryUncheckedUpdateManyWithoutSupplierNestedInput;
};
export type SupplierCreateManyInput = {
    id?: string;
    orgId: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    paymentTerms?: string | null;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: number;
    active?: boolean;
    createdAt?: Date | string;
};
export type SupplierUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentTerms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    creditLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentTerms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    creditLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SupplierCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    paymentTerms?: Prisma.SortOrder;
    creditLimit?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SupplierAvgOrderByAggregateInput = {
    creditLimit?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
};
export type SupplierMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    paymentTerms?: Prisma.SortOrder;
    creditLimit?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SupplierMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    paymentTerms?: Prisma.SortOrder;
    creditLimit?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SupplierSumOrderByAggregateInput = {
    creditLimit?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    leadTimeDays?: Prisma.SortOrder;
};
export type SupplierScalarRelationFilter = {
    is?: Prisma.SupplierWhereInput;
    isNot?: Prisma.SupplierWhereInput;
};
export type SupplierNullableScalarRelationFilter = {
    is?: Prisma.SupplierWhereInput | null;
    isNot?: Prisma.SupplierWhereInput | null;
};
export type SupplierCreateNestedOneWithoutPurchaseOrdersInput = {
    create?: Prisma.XOR<Prisma.SupplierCreateWithoutPurchaseOrdersInput, Prisma.SupplierUncheckedCreateWithoutPurchaseOrdersInput>;
    connectOrCreate?: Prisma.SupplierCreateOrConnectWithoutPurchaseOrdersInput;
    connect?: Prisma.SupplierWhereUniqueInput;
};
export type SupplierUpdateOneRequiredWithoutPurchaseOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.SupplierCreateWithoutPurchaseOrdersInput, Prisma.SupplierUncheckedCreateWithoutPurchaseOrdersInput>;
    connectOrCreate?: Prisma.SupplierCreateOrConnectWithoutPurchaseOrdersInput;
    upsert?: Prisma.SupplierUpsertWithoutPurchaseOrdersInput;
    connect?: Prisma.SupplierWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SupplierUpdateToOneWithWhereWithoutPurchaseOrdersInput, Prisma.SupplierUpdateWithoutPurchaseOrdersInput>, Prisma.SupplierUncheckedUpdateWithoutPurchaseOrdersInput>;
};
export type SupplierCreateNestedOneWithoutLotsInput = {
    create?: Prisma.XOR<Prisma.SupplierCreateWithoutLotsInput, Prisma.SupplierUncheckedCreateWithoutLotsInput>;
    connectOrCreate?: Prisma.SupplierCreateOrConnectWithoutLotsInput;
    connect?: Prisma.SupplierWhereUniqueInput;
};
export type SupplierUpdateOneWithoutLotsNestedInput = {
    create?: Prisma.XOR<Prisma.SupplierCreateWithoutLotsInput, Prisma.SupplierUncheckedCreateWithoutLotsInput>;
    connectOrCreate?: Prisma.SupplierCreateOrConnectWithoutLotsInput;
    upsert?: Prisma.SupplierUpsertWithoutLotsInput;
    disconnect?: Prisma.SupplierWhereInput | boolean;
    delete?: Prisma.SupplierWhereInput | boolean;
    connect?: Prisma.SupplierWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SupplierUpdateToOneWithWhereWithoutLotsInput, Prisma.SupplierUpdateWithoutLotsInput>, Prisma.SupplierUncheckedUpdateWithoutLotsInput>;
};
export type SupplierCreateNestedOneWithoutLedgerInput = {
    create?: Prisma.XOR<Prisma.SupplierCreateWithoutLedgerInput, Prisma.SupplierUncheckedCreateWithoutLedgerInput>;
    connectOrCreate?: Prisma.SupplierCreateOrConnectWithoutLedgerInput;
    connect?: Prisma.SupplierWhereUniqueInput;
};
export type SupplierUpdateOneRequiredWithoutLedgerNestedInput = {
    create?: Prisma.XOR<Prisma.SupplierCreateWithoutLedgerInput, Prisma.SupplierUncheckedCreateWithoutLedgerInput>;
    connectOrCreate?: Prisma.SupplierCreateOrConnectWithoutLedgerInput;
    upsert?: Prisma.SupplierUpsertWithoutLedgerInput;
    connect?: Prisma.SupplierWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SupplierUpdateToOneWithWhereWithoutLedgerInput, Prisma.SupplierUpdateWithoutLedgerInput>, Prisma.SupplierUncheckedUpdateWithoutLedgerInput>;
};
export type SupplierCreateWithoutPurchaseOrdersInput = {
    id?: string;
    orgId: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    paymentTerms?: string | null;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: number;
    active?: boolean;
    createdAt?: Date | string;
    lots?: Prisma.StockLotCreateNestedManyWithoutSupplierInput;
    ledger?: Prisma.SupplierLedgerEntryCreateNestedManyWithoutSupplierInput;
};
export type SupplierUncheckedCreateWithoutPurchaseOrdersInput = {
    id?: string;
    orgId: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    paymentTerms?: string | null;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: number;
    active?: boolean;
    createdAt?: Date | string;
    lots?: Prisma.StockLotUncheckedCreateNestedManyWithoutSupplierInput;
    ledger?: Prisma.SupplierLedgerEntryUncheckedCreateNestedManyWithoutSupplierInput;
};
export type SupplierCreateOrConnectWithoutPurchaseOrdersInput = {
    where: Prisma.SupplierWhereUniqueInput;
    create: Prisma.XOR<Prisma.SupplierCreateWithoutPurchaseOrdersInput, Prisma.SupplierUncheckedCreateWithoutPurchaseOrdersInput>;
};
export type SupplierUpsertWithoutPurchaseOrdersInput = {
    update: Prisma.XOR<Prisma.SupplierUpdateWithoutPurchaseOrdersInput, Prisma.SupplierUncheckedUpdateWithoutPurchaseOrdersInput>;
    create: Prisma.XOR<Prisma.SupplierCreateWithoutPurchaseOrdersInput, Prisma.SupplierUncheckedCreateWithoutPurchaseOrdersInput>;
    where?: Prisma.SupplierWhereInput;
};
export type SupplierUpdateToOneWithWhereWithoutPurchaseOrdersInput = {
    where?: Prisma.SupplierWhereInput;
    data: Prisma.XOR<Prisma.SupplierUpdateWithoutPurchaseOrdersInput, Prisma.SupplierUncheckedUpdateWithoutPurchaseOrdersInput>;
};
export type SupplierUpdateWithoutPurchaseOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentTerms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    creditLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lots?: Prisma.StockLotUpdateManyWithoutSupplierNestedInput;
    ledger?: Prisma.SupplierLedgerEntryUpdateManyWithoutSupplierNestedInput;
};
export type SupplierUncheckedUpdateWithoutPurchaseOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentTerms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    creditLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lots?: Prisma.StockLotUncheckedUpdateManyWithoutSupplierNestedInput;
    ledger?: Prisma.SupplierLedgerEntryUncheckedUpdateManyWithoutSupplierNestedInput;
};
export type SupplierCreateWithoutLotsInput = {
    id?: string;
    orgId: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    paymentTerms?: string | null;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: number;
    active?: boolean;
    createdAt?: Date | string;
    purchaseOrders?: Prisma.PurchaseOrderCreateNestedManyWithoutSupplierInput;
    ledger?: Prisma.SupplierLedgerEntryCreateNestedManyWithoutSupplierInput;
};
export type SupplierUncheckedCreateWithoutLotsInput = {
    id?: string;
    orgId: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    paymentTerms?: string | null;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: number;
    active?: boolean;
    createdAt?: Date | string;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedCreateNestedManyWithoutSupplierInput;
    ledger?: Prisma.SupplierLedgerEntryUncheckedCreateNestedManyWithoutSupplierInput;
};
export type SupplierCreateOrConnectWithoutLotsInput = {
    where: Prisma.SupplierWhereUniqueInput;
    create: Prisma.XOR<Prisma.SupplierCreateWithoutLotsInput, Prisma.SupplierUncheckedCreateWithoutLotsInput>;
};
export type SupplierUpsertWithoutLotsInput = {
    update: Prisma.XOR<Prisma.SupplierUpdateWithoutLotsInput, Prisma.SupplierUncheckedUpdateWithoutLotsInput>;
    create: Prisma.XOR<Prisma.SupplierCreateWithoutLotsInput, Prisma.SupplierUncheckedCreateWithoutLotsInput>;
    where?: Prisma.SupplierWhereInput;
};
export type SupplierUpdateToOneWithWhereWithoutLotsInput = {
    where?: Prisma.SupplierWhereInput;
    data: Prisma.XOR<Prisma.SupplierUpdateWithoutLotsInput, Prisma.SupplierUncheckedUpdateWithoutLotsInput>;
};
export type SupplierUpdateWithoutLotsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentTerms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    creditLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    purchaseOrders?: Prisma.PurchaseOrderUpdateManyWithoutSupplierNestedInput;
    ledger?: Prisma.SupplierLedgerEntryUpdateManyWithoutSupplierNestedInput;
};
export type SupplierUncheckedUpdateWithoutLotsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentTerms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    creditLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedUpdateManyWithoutSupplierNestedInput;
    ledger?: Prisma.SupplierLedgerEntryUncheckedUpdateManyWithoutSupplierNestedInput;
};
export type SupplierCreateWithoutLedgerInput = {
    id?: string;
    orgId: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    paymentTerms?: string | null;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: number;
    active?: boolean;
    createdAt?: Date | string;
    purchaseOrders?: Prisma.PurchaseOrderCreateNestedManyWithoutSupplierInput;
    lots?: Prisma.StockLotCreateNestedManyWithoutSupplierInput;
};
export type SupplierUncheckedCreateWithoutLedgerInput = {
    id?: string;
    orgId: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    paymentTerms?: string | null;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: number;
    active?: boolean;
    createdAt?: Date | string;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedCreateNestedManyWithoutSupplierInput;
    lots?: Prisma.StockLotUncheckedCreateNestedManyWithoutSupplierInput;
};
export type SupplierCreateOrConnectWithoutLedgerInput = {
    where: Prisma.SupplierWhereUniqueInput;
    create: Prisma.XOR<Prisma.SupplierCreateWithoutLedgerInput, Prisma.SupplierUncheckedCreateWithoutLedgerInput>;
};
export type SupplierUpsertWithoutLedgerInput = {
    update: Prisma.XOR<Prisma.SupplierUpdateWithoutLedgerInput, Prisma.SupplierUncheckedUpdateWithoutLedgerInput>;
    create: Prisma.XOR<Prisma.SupplierCreateWithoutLedgerInput, Prisma.SupplierUncheckedCreateWithoutLedgerInput>;
    where?: Prisma.SupplierWhereInput;
};
export type SupplierUpdateToOneWithWhereWithoutLedgerInput = {
    where?: Prisma.SupplierWhereInput;
    data: Prisma.XOR<Prisma.SupplierUpdateWithoutLedgerInput, Prisma.SupplierUncheckedUpdateWithoutLedgerInput>;
};
export type SupplierUpdateWithoutLedgerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentTerms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    creditLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    purchaseOrders?: Prisma.PurchaseOrderUpdateManyWithoutSupplierNestedInput;
    lots?: Prisma.StockLotUpdateManyWithoutSupplierNestedInput;
};
export type SupplierUncheckedUpdateWithoutLedgerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentTerms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    creditLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    leadTimeDays?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedUpdateManyWithoutSupplierNestedInput;
    lots?: Prisma.StockLotUncheckedUpdateManyWithoutSupplierNestedInput;
};
export type SupplierCountOutputType = {
    purchaseOrders: number;
    lots: number;
    ledger: number;
};
export type SupplierCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    purchaseOrders?: boolean | SupplierCountOutputTypeCountPurchaseOrdersArgs;
    lots?: boolean | SupplierCountOutputTypeCountLotsArgs;
    ledger?: boolean | SupplierCountOutputTypeCountLedgerArgs;
};
export type SupplierCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierCountOutputTypeSelect<ExtArgs> | null;
};
export type SupplierCountOutputTypeCountPurchaseOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PurchaseOrderWhereInput;
};
export type SupplierCountOutputTypeCountLotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockLotWhereInput;
};
export type SupplierCountOutputTypeCountLedgerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierLedgerEntryWhereInput;
};
export type SupplierSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    paymentTerms?: boolean;
    creditLimit?: boolean;
    balance?: boolean;
    leadTimeDays?: boolean;
    active?: boolean;
    createdAt?: boolean;
    purchaseOrders?: boolean | Prisma.Supplier$purchaseOrdersArgs<ExtArgs>;
    lots?: boolean | Prisma.Supplier$lotsArgs<ExtArgs>;
    ledger?: boolean | Prisma.Supplier$ledgerArgs<ExtArgs>;
    _count?: boolean | Prisma.SupplierCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["supplier"]>;
export type SupplierSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    paymentTerms?: boolean;
    creditLimit?: boolean;
    balance?: boolean;
    leadTimeDays?: boolean;
    active?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["supplier"]>;
export type SupplierSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    paymentTerms?: boolean;
    creditLimit?: boolean;
    balance?: boolean;
    leadTimeDays?: boolean;
    active?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["supplier"]>;
export type SupplierSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    paymentTerms?: boolean;
    creditLimit?: boolean;
    balance?: boolean;
    leadTimeDays?: boolean;
    active?: boolean;
    createdAt?: boolean;
};
export type SupplierOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "name" | "phone" | "email" | "paymentTerms" | "creditLimit" | "balance" | "leadTimeDays" | "active" | "createdAt", ExtArgs["result"]["supplier"]>;
export type SupplierInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    purchaseOrders?: boolean | Prisma.Supplier$purchaseOrdersArgs<ExtArgs>;
    lots?: boolean | Prisma.Supplier$lotsArgs<ExtArgs>;
    ledger?: boolean | Prisma.Supplier$ledgerArgs<ExtArgs>;
    _count?: boolean | Prisma.SupplierCountOutputTypeDefaultArgs<ExtArgs>;
};
export type SupplierIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type SupplierIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $SupplierPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Supplier";
    objects: {
        purchaseOrders: Prisma.$PurchaseOrderPayload<ExtArgs>[];
        lots: Prisma.$StockLotPayload<ExtArgs>[];
        ledger: Prisma.$SupplierLedgerEntryPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        name: string;
        phone: string | null;
        email: string | null;
        paymentTerms: string | null;
        creditLimit: runtime.Decimal | null;
        balance: runtime.Decimal;
        leadTimeDays: number;
        active: boolean;
        createdAt: Date;
    }, ExtArgs["result"]["supplier"]>;
    composites: {};
};
export type SupplierGetPayload<S extends boolean | null | undefined | SupplierDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SupplierPayload, S>;
export type SupplierCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SupplierFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SupplierCountAggregateInputType | true;
};
export interface SupplierDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Supplier'];
        meta: {
            name: 'Supplier';
        };
    };
    findUnique<T extends SupplierFindUniqueArgs>(args: Prisma.SelectSubset<T, SupplierFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SupplierFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SupplierFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SupplierFindFirstArgs>(args?: Prisma.SelectSubset<T, SupplierFindFirstArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SupplierFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SupplierFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SupplierFindManyArgs>(args?: Prisma.SelectSubset<T, SupplierFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SupplierCreateArgs>(args: Prisma.SelectSubset<T, SupplierCreateArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SupplierCreateManyArgs>(args?: Prisma.SelectSubset<T, SupplierCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SupplierCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SupplierCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SupplierDeleteArgs>(args: Prisma.SelectSubset<T, SupplierDeleteArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SupplierUpdateArgs>(args: Prisma.SelectSubset<T, SupplierUpdateArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SupplierDeleteManyArgs>(args?: Prisma.SelectSubset<T, SupplierDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SupplierUpdateManyArgs>(args: Prisma.SelectSubset<T, SupplierUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SupplierUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SupplierUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SupplierUpsertArgs>(args: Prisma.SelectSubset<T, SupplierUpsertArgs<ExtArgs>>): Prisma.Prisma__SupplierClient<runtime.Types.Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SupplierCountArgs>(args?: Prisma.Subset<T, SupplierCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SupplierCountAggregateOutputType> : number>;
    aggregate<T extends SupplierAggregateArgs>(args: Prisma.Subset<T, SupplierAggregateArgs>): Prisma.PrismaPromise<GetSupplierAggregateType<T>>;
    groupBy<T extends SupplierGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SupplierGroupByArgs['orderBy'];
    } : {
        orderBy?: SupplierGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SupplierGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SupplierFieldRefs;
}
export interface Prisma__SupplierClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    purchaseOrders<T extends Prisma.Supplier$purchaseOrdersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Supplier$purchaseOrdersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    lots<T extends Prisma.Supplier$lotsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Supplier$lotsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockLotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    ledger<T extends Prisma.Supplier$ledgerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Supplier$ledgerArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SupplierLedgerEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SupplierFieldRefs {
    readonly id: Prisma.FieldRef<"Supplier", 'String'>;
    readonly orgId: Prisma.FieldRef<"Supplier", 'String'>;
    readonly name: Prisma.FieldRef<"Supplier", 'String'>;
    readonly phone: Prisma.FieldRef<"Supplier", 'String'>;
    readonly email: Prisma.FieldRef<"Supplier", 'String'>;
    readonly paymentTerms: Prisma.FieldRef<"Supplier", 'String'>;
    readonly creditLimit: Prisma.FieldRef<"Supplier", 'Decimal'>;
    readonly balance: Prisma.FieldRef<"Supplier", 'Decimal'>;
    readonly leadTimeDays: Prisma.FieldRef<"Supplier", 'Int'>;
    readonly active: Prisma.FieldRef<"Supplier", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Supplier", 'DateTime'>;
}
export type SupplierFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    where: Prisma.SupplierWhereUniqueInput;
};
export type SupplierFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    where: Prisma.SupplierWhereUniqueInput;
};
export type SupplierFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    where?: Prisma.SupplierWhereInput;
    orderBy?: Prisma.SupplierOrderByWithRelationInput | Prisma.SupplierOrderByWithRelationInput[];
    cursor?: Prisma.SupplierWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SupplierScalarFieldEnum | Prisma.SupplierScalarFieldEnum[];
};
export type SupplierFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    where?: Prisma.SupplierWhereInput;
    orderBy?: Prisma.SupplierOrderByWithRelationInput | Prisma.SupplierOrderByWithRelationInput[];
    cursor?: Prisma.SupplierWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SupplierScalarFieldEnum | Prisma.SupplierScalarFieldEnum[];
};
export type SupplierFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    where?: Prisma.SupplierWhereInput;
    orderBy?: Prisma.SupplierOrderByWithRelationInput | Prisma.SupplierOrderByWithRelationInput[];
    cursor?: Prisma.SupplierWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SupplierScalarFieldEnum | Prisma.SupplierScalarFieldEnum[];
};
export type SupplierCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SupplierCreateInput, Prisma.SupplierUncheckedCreateInput>;
};
export type SupplierCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SupplierCreateManyInput | Prisma.SupplierCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SupplierCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    data: Prisma.SupplierCreateManyInput | Prisma.SupplierCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SupplierUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SupplierUpdateInput, Prisma.SupplierUncheckedUpdateInput>;
    where: Prisma.SupplierWhereUniqueInput;
};
export type SupplierUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SupplierUpdateManyMutationInput, Prisma.SupplierUncheckedUpdateManyInput>;
    where?: Prisma.SupplierWhereInput;
    limit?: number;
};
export type SupplierUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SupplierUpdateManyMutationInput, Prisma.SupplierUncheckedUpdateManyInput>;
    where?: Prisma.SupplierWhereInput;
    limit?: number;
};
export type SupplierUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    where: Prisma.SupplierWhereUniqueInput;
    create: Prisma.XOR<Prisma.SupplierCreateInput, Prisma.SupplierUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SupplierUpdateInput, Prisma.SupplierUncheckedUpdateInput>;
};
export type SupplierDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
    where: Prisma.SupplierWhereUniqueInput;
};
export type SupplierDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SupplierWhereInput;
    limit?: number;
};
export type Supplier$purchaseOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderOmit<ExtArgs> | null;
    include?: Prisma.PurchaseOrderInclude<ExtArgs> | null;
    where?: Prisma.PurchaseOrderWhereInput;
    orderBy?: Prisma.PurchaseOrderOrderByWithRelationInput | Prisma.PurchaseOrderOrderByWithRelationInput[];
    cursor?: Prisma.PurchaseOrderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PurchaseOrderScalarFieldEnum | Prisma.PurchaseOrderScalarFieldEnum[];
};
export type Supplier$lotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockLotSelect<ExtArgs> | null;
    omit?: Prisma.StockLotOmit<ExtArgs> | null;
    include?: Prisma.StockLotInclude<ExtArgs> | null;
    where?: Prisma.StockLotWhereInput;
    orderBy?: Prisma.StockLotOrderByWithRelationInput | Prisma.StockLotOrderByWithRelationInput[];
    cursor?: Prisma.StockLotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockLotScalarFieldEnum | Prisma.StockLotScalarFieldEnum[];
};
export type Supplier$ledgerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SupplierDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SupplierSelect<ExtArgs> | null;
    omit?: Prisma.SupplierOmit<ExtArgs> | null;
    include?: Prisma.SupplierInclude<ExtArgs> | null;
};
