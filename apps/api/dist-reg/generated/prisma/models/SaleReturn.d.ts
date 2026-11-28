import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type SaleReturnModel = runtime.Types.Result.DefaultSelection<Prisma.$SaleReturnPayload>;
export type AggregateSaleReturn = {
    _count: SaleReturnCountAggregateOutputType | null;
    _avg: SaleReturnAvgAggregateOutputType | null;
    _sum: SaleReturnSumAggregateOutputType | null;
    _min: SaleReturnMinAggregateOutputType | null;
    _max: SaleReturnMaxAggregateOutputType | null;
};
export type SaleReturnAvgAggregateOutputType = {
    quantity: number | null;
    refund: runtime.Decimal | null;
};
export type SaleReturnSumAggregateOutputType = {
    quantity: number | null;
    refund: runtime.Decimal | null;
};
export type SaleReturnMinAggregateOutputType = {
    id: string | null;
    saleId: string | null;
    saleLineId: string | null;
    refundMethod: $Enums.PaymentMethod | null;
    lotId: string | null;
    quantity: number | null;
    refund: runtime.Decimal | null;
    reason: string | null;
    approvedBy: string | null;
    createdAt: Date | null;
};
export type SaleReturnMaxAggregateOutputType = {
    id: string | null;
    saleId: string | null;
    saleLineId: string | null;
    refundMethod: $Enums.PaymentMethod | null;
    lotId: string | null;
    quantity: number | null;
    refund: runtime.Decimal | null;
    reason: string | null;
    approvedBy: string | null;
    createdAt: Date | null;
};
export type SaleReturnCountAggregateOutputType = {
    id: number;
    saleId: number;
    saleLineId: number;
    refundMethod: number;
    lotId: number;
    quantity: number;
    refund: number;
    reason: number;
    approvedBy: number;
    createdAt: number;
    _all: number;
};
export type SaleReturnAvgAggregateInputType = {
    quantity?: true;
    refund?: true;
};
export type SaleReturnSumAggregateInputType = {
    quantity?: true;
    refund?: true;
};
export type SaleReturnMinAggregateInputType = {
    id?: true;
    saleId?: true;
    saleLineId?: true;
    refundMethod?: true;
    lotId?: true;
    quantity?: true;
    refund?: true;
    reason?: true;
    approvedBy?: true;
    createdAt?: true;
};
export type SaleReturnMaxAggregateInputType = {
    id?: true;
    saleId?: true;
    saleLineId?: true;
    refundMethod?: true;
    lotId?: true;
    quantity?: true;
    refund?: true;
    reason?: true;
    approvedBy?: true;
    createdAt?: true;
};
export type SaleReturnCountAggregateInputType = {
    id?: true;
    saleId?: true;
    saleLineId?: true;
    refundMethod?: true;
    lotId?: true;
    quantity?: true;
    refund?: true;
    reason?: true;
    approvedBy?: true;
    createdAt?: true;
    _all?: true;
};
export type SaleReturnAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SaleReturnWhereInput;
    orderBy?: Prisma.SaleReturnOrderByWithRelationInput | Prisma.SaleReturnOrderByWithRelationInput[];
    cursor?: Prisma.SaleReturnWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SaleReturnCountAggregateInputType;
    _avg?: SaleReturnAvgAggregateInputType;
    _sum?: SaleReturnSumAggregateInputType;
    _min?: SaleReturnMinAggregateInputType;
    _max?: SaleReturnMaxAggregateInputType;
};
export type GetSaleReturnAggregateType<T extends SaleReturnAggregateArgs> = {
    [P in keyof T & keyof AggregateSaleReturn]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSaleReturn[P]> : Prisma.GetScalarType<T[P], AggregateSaleReturn[P]>;
};
export type SaleReturnGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SaleReturnWhereInput;
    orderBy?: Prisma.SaleReturnOrderByWithAggregationInput | Prisma.SaleReturnOrderByWithAggregationInput[];
    by: Prisma.SaleReturnScalarFieldEnum[] | Prisma.SaleReturnScalarFieldEnum;
    having?: Prisma.SaleReturnScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SaleReturnCountAggregateInputType | true;
    _avg?: SaleReturnAvgAggregateInputType;
    _sum?: SaleReturnSumAggregateInputType;
    _min?: SaleReturnMinAggregateInputType;
    _max?: SaleReturnMaxAggregateInputType;
};
export type SaleReturnGroupByOutputType = {
    id: string;
    saleId: string;
    saleLineId: string | null;
    refundMethod: $Enums.PaymentMethod;
    lotId: string;
    quantity: number;
    refund: runtime.Decimal;
    reason: string;
    approvedBy: string;
    createdAt: Date;
    _count: SaleReturnCountAggregateOutputType | null;
    _avg: SaleReturnAvgAggregateOutputType | null;
    _sum: SaleReturnSumAggregateOutputType | null;
    _min: SaleReturnMinAggregateOutputType | null;
    _max: SaleReturnMaxAggregateOutputType | null;
};
export type GetSaleReturnGroupByPayload<T extends SaleReturnGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SaleReturnGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SaleReturnGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SaleReturnGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SaleReturnGroupByOutputType[P]>;
}>>;
export type SaleReturnWhereInput = {
    AND?: Prisma.SaleReturnWhereInput | Prisma.SaleReturnWhereInput[];
    OR?: Prisma.SaleReturnWhereInput[];
    NOT?: Prisma.SaleReturnWhereInput | Prisma.SaleReturnWhereInput[];
    id?: Prisma.StringFilter<"SaleReturn"> | string;
    saleId?: Prisma.StringFilter<"SaleReturn"> | string;
    saleLineId?: Prisma.StringNullableFilter<"SaleReturn"> | string | null;
    refundMethod?: Prisma.EnumPaymentMethodFilter<"SaleReturn"> | $Enums.PaymentMethod;
    lotId?: Prisma.StringFilter<"SaleReturn"> | string;
    quantity?: Prisma.IntFilter<"SaleReturn"> | number;
    refund?: Prisma.DecimalFilter<"SaleReturn"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFilter<"SaleReturn"> | string;
    approvedBy?: Prisma.StringFilter<"SaleReturn"> | string;
    createdAt?: Prisma.DateTimeFilter<"SaleReturn"> | Date | string;
    sale?: Prisma.XOR<Prisma.SaleScalarRelationFilter, Prisma.SaleWhereInput>;
};
export type SaleReturnOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    saleLineId?: Prisma.SortOrderInput | Prisma.SortOrder;
    refundMethod?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    refund?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    approvedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    sale?: Prisma.SaleOrderByWithRelationInput;
};
export type SaleReturnWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SaleReturnWhereInput | Prisma.SaleReturnWhereInput[];
    OR?: Prisma.SaleReturnWhereInput[];
    NOT?: Prisma.SaleReturnWhereInput | Prisma.SaleReturnWhereInput[];
    saleId?: Prisma.StringFilter<"SaleReturn"> | string;
    saleLineId?: Prisma.StringNullableFilter<"SaleReturn"> | string | null;
    refundMethod?: Prisma.EnumPaymentMethodFilter<"SaleReturn"> | $Enums.PaymentMethod;
    lotId?: Prisma.StringFilter<"SaleReturn"> | string;
    quantity?: Prisma.IntFilter<"SaleReturn"> | number;
    refund?: Prisma.DecimalFilter<"SaleReturn"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFilter<"SaleReturn"> | string;
    approvedBy?: Prisma.StringFilter<"SaleReturn"> | string;
    createdAt?: Prisma.DateTimeFilter<"SaleReturn"> | Date | string;
    sale?: Prisma.XOR<Prisma.SaleScalarRelationFilter, Prisma.SaleWhereInput>;
}, "id">;
export type SaleReturnOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    saleLineId?: Prisma.SortOrderInput | Prisma.SortOrder;
    refundMethod?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    refund?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    approvedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.SaleReturnCountOrderByAggregateInput;
    _avg?: Prisma.SaleReturnAvgOrderByAggregateInput;
    _max?: Prisma.SaleReturnMaxOrderByAggregateInput;
    _min?: Prisma.SaleReturnMinOrderByAggregateInput;
    _sum?: Prisma.SaleReturnSumOrderByAggregateInput;
};
export type SaleReturnScalarWhereWithAggregatesInput = {
    AND?: Prisma.SaleReturnScalarWhereWithAggregatesInput | Prisma.SaleReturnScalarWhereWithAggregatesInput[];
    OR?: Prisma.SaleReturnScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SaleReturnScalarWhereWithAggregatesInput | Prisma.SaleReturnScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SaleReturn"> | string;
    saleId?: Prisma.StringWithAggregatesFilter<"SaleReturn"> | string;
    saleLineId?: Prisma.StringNullableWithAggregatesFilter<"SaleReturn"> | string | null;
    refundMethod?: Prisma.EnumPaymentMethodWithAggregatesFilter<"SaleReturn"> | $Enums.PaymentMethod;
    lotId?: Prisma.StringWithAggregatesFilter<"SaleReturn"> | string;
    quantity?: Prisma.IntWithAggregatesFilter<"SaleReturn"> | number;
    refund?: Prisma.DecimalWithAggregatesFilter<"SaleReturn"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringWithAggregatesFilter<"SaleReturn"> | string;
    approvedBy?: Prisma.StringWithAggregatesFilter<"SaleReturn"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SaleReturn"> | Date | string;
};
export type SaleReturnCreateInput = {
    id?: string;
    saleLineId?: string | null;
    refundMethod?: $Enums.PaymentMethod;
    lotId: string;
    quantity: number;
    refund: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    approvedBy: string;
    createdAt?: Date | string;
    sale: Prisma.SaleCreateNestedOneWithoutReturnsInput;
};
export type SaleReturnUncheckedCreateInput = {
    id?: string;
    saleId: string;
    saleLineId?: string | null;
    refundMethod?: $Enums.PaymentMethod;
    lotId: string;
    quantity: number;
    refund: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    approvedBy: string;
    createdAt?: Date | string;
};
export type SaleReturnUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refundMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    refund?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    approvedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sale?: Prisma.SaleUpdateOneRequiredWithoutReturnsNestedInput;
};
export type SaleReturnUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleId?: Prisma.StringFieldUpdateOperationsInput | string;
    saleLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refundMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    refund?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    approvedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SaleReturnCreateManyInput = {
    id?: string;
    saleId: string;
    saleLineId?: string | null;
    refundMethod?: $Enums.PaymentMethod;
    lotId: string;
    quantity: number;
    refund: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    approvedBy: string;
    createdAt?: Date | string;
};
export type SaleReturnUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refundMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    refund?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    approvedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SaleReturnUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleId?: Prisma.StringFieldUpdateOperationsInput | string;
    saleLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refundMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    refund?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    approvedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SaleReturnListRelationFilter = {
    every?: Prisma.SaleReturnWhereInput;
    some?: Prisma.SaleReturnWhereInput;
    none?: Prisma.SaleReturnWhereInput;
};
export type SaleReturnOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SaleReturnCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    saleLineId?: Prisma.SortOrder;
    refundMethod?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    refund?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    approvedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SaleReturnAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    refund?: Prisma.SortOrder;
};
export type SaleReturnMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    saleLineId?: Prisma.SortOrder;
    refundMethod?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    refund?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    approvedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SaleReturnMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    saleId?: Prisma.SortOrder;
    saleLineId?: Prisma.SortOrder;
    refundMethod?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    refund?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    approvedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SaleReturnSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    refund?: Prisma.SortOrder;
};
export type SaleReturnCreateNestedManyWithoutSaleInput = {
    create?: Prisma.XOR<Prisma.SaleReturnCreateWithoutSaleInput, Prisma.SaleReturnUncheckedCreateWithoutSaleInput> | Prisma.SaleReturnCreateWithoutSaleInput[] | Prisma.SaleReturnUncheckedCreateWithoutSaleInput[];
    connectOrCreate?: Prisma.SaleReturnCreateOrConnectWithoutSaleInput | Prisma.SaleReturnCreateOrConnectWithoutSaleInput[];
    createMany?: Prisma.SaleReturnCreateManySaleInputEnvelope;
    connect?: Prisma.SaleReturnWhereUniqueInput | Prisma.SaleReturnWhereUniqueInput[];
};
export type SaleReturnUncheckedCreateNestedManyWithoutSaleInput = {
    create?: Prisma.XOR<Prisma.SaleReturnCreateWithoutSaleInput, Prisma.SaleReturnUncheckedCreateWithoutSaleInput> | Prisma.SaleReturnCreateWithoutSaleInput[] | Prisma.SaleReturnUncheckedCreateWithoutSaleInput[];
    connectOrCreate?: Prisma.SaleReturnCreateOrConnectWithoutSaleInput | Prisma.SaleReturnCreateOrConnectWithoutSaleInput[];
    createMany?: Prisma.SaleReturnCreateManySaleInputEnvelope;
    connect?: Prisma.SaleReturnWhereUniqueInput | Prisma.SaleReturnWhereUniqueInput[];
};
export type SaleReturnUpdateManyWithoutSaleNestedInput = {
    create?: Prisma.XOR<Prisma.SaleReturnCreateWithoutSaleInput, Prisma.SaleReturnUncheckedCreateWithoutSaleInput> | Prisma.SaleReturnCreateWithoutSaleInput[] | Prisma.SaleReturnUncheckedCreateWithoutSaleInput[];
    connectOrCreate?: Prisma.SaleReturnCreateOrConnectWithoutSaleInput | Prisma.SaleReturnCreateOrConnectWithoutSaleInput[];
    upsert?: Prisma.SaleReturnUpsertWithWhereUniqueWithoutSaleInput | Prisma.SaleReturnUpsertWithWhereUniqueWithoutSaleInput[];
    createMany?: Prisma.SaleReturnCreateManySaleInputEnvelope;
    set?: Prisma.SaleReturnWhereUniqueInput | Prisma.SaleReturnWhereUniqueInput[];
    disconnect?: Prisma.SaleReturnWhereUniqueInput | Prisma.SaleReturnWhereUniqueInput[];
    delete?: Prisma.SaleReturnWhereUniqueInput | Prisma.SaleReturnWhereUniqueInput[];
    connect?: Prisma.SaleReturnWhereUniqueInput | Prisma.SaleReturnWhereUniqueInput[];
    update?: Prisma.SaleReturnUpdateWithWhereUniqueWithoutSaleInput | Prisma.SaleReturnUpdateWithWhereUniqueWithoutSaleInput[];
    updateMany?: Prisma.SaleReturnUpdateManyWithWhereWithoutSaleInput | Prisma.SaleReturnUpdateManyWithWhereWithoutSaleInput[];
    deleteMany?: Prisma.SaleReturnScalarWhereInput | Prisma.SaleReturnScalarWhereInput[];
};
export type SaleReturnUncheckedUpdateManyWithoutSaleNestedInput = {
    create?: Prisma.XOR<Prisma.SaleReturnCreateWithoutSaleInput, Prisma.SaleReturnUncheckedCreateWithoutSaleInput> | Prisma.SaleReturnCreateWithoutSaleInput[] | Prisma.SaleReturnUncheckedCreateWithoutSaleInput[];
    connectOrCreate?: Prisma.SaleReturnCreateOrConnectWithoutSaleInput | Prisma.SaleReturnCreateOrConnectWithoutSaleInput[];
    upsert?: Prisma.SaleReturnUpsertWithWhereUniqueWithoutSaleInput | Prisma.SaleReturnUpsertWithWhereUniqueWithoutSaleInput[];
    createMany?: Prisma.SaleReturnCreateManySaleInputEnvelope;
    set?: Prisma.SaleReturnWhereUniqueInput | Prisma.SaleReturnWhereUniqueInput[];
    disconnect?: Prisma.SaleReturnWhereUniqueInput | Prisma.SaleReturnWhereUniqueInput[];
    delete?: Prisma.SaleReturnWhereUniqueInput | Prisma.SaleReturnWhereUniqueInput[];
    connect?: Prisma.SaleReturnWhereUniqueInput | Prisma.SaleReturnWhereUniqueInput[];
    update?: Prisma.SaleReturnUpdateWithWhereUniqueWithoutSaleInput | Prisma.SaleReturnUpdateWithWhereUniqueWithoutSaleInput[];
    updateMany?: Prisma.SaleReturnUpdateManyWithWhereWithoutSaleInput | Prisma.SaleReturnUpdateManyWithWhereWithoutSaleInput[];
    deleteMany?: Prisma.SaleReturnScalarWhereInput | Prisma.SaleReturnScalarWhereInput[];
};
export type SaleReturnCreateWithoutSaleInput = {
    id?: string;
    saleLineId?: string | null;
    refundMethod?: $Enums.PaymentMethod;
    lotId: string;
    quantity: number;
    refund: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    approvedBy: string;
    createdAt?: Date | string;
};
export type SaleReturnUncheckedCreateWithoutSaleInput = {
    id?: string;
    saleLineId?: string | null;
    refundMethod?: $Enums.PaymentMethod;
    lotId: string;
    quantity: number;
    refund: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    approvedBy: string;
    createdAt?: Date | string;
};
export type SaleReturnCreateOrConnectWithoutSaleInput = {
    where: Prisma.SaleReturnWhereUniqueInput;
    create: Prisma.XOR<Prisma.SaleReturnCreateWithoutSaleInput, Prisma.SaleReturnUncheckedCreateWithoutSaleInput>;
};
export type SaleReturnCreateManySaleInputEnvelope = {
    data: Prisma.SaleReturnCreateManySaleInput | Prisma.SaleReturnCreateManySaleInput[];
    skipDuplicates?: boolean;
};
export type SaleReturnUpsertWithWhereUniqueWithoutSaleInput = {
    where: Prisma.SaleReturnWhereUniqueInput;
    update: Prisma.XOR<Prisma.SaleReturnUpdateWithoutSaleInput, Prisma.SaleReturnUncheckedUpdateWithoutSaleInput>;
    create: Prisma.XOR<Prisma.SaleReturnCreateWithoutSaleInput, Prisma.SaleReturnUncheckedCreateWithoutSaleInput>;
};
export type SaleReturnUpdateWithWhereUniqueWithoutSaleInput = {
    where: Prisma.SaleReturnWhereUniqueInput;
    data: Prisma.XOR<Prisma.SaleReturnUpdateWithoutSaleInput, Prisma.SaleReturnUncheckedUpdateWithoutSaleInput>;
};
export type SaleReturnUpdateManyWithWhereWithoutSaleInput = {
    where: Prisma.SaleReturnScalarWhereInput;
    data: Prisma.XOR<Prisma.SaleReturnUpdateManyMutationInput, Prisma.SaleReturnUncheckedUpdateManyWithoutSaleInput>;
};
export type SaleReturnScalarWhereInput = {
    AND?: Prisma.SaleReturnScalarWhereInput | Prisma.SaleReturnScalarWhereInput[];
    OR?: Prisma.SaleReturnScalarWhereInput[];
    NOT?: Prisma.SaleReturnScalarWhereInput | Prisma.SaleReturnScalarWhereInput[];
    id?: Prisma.StringFilter<"SaleReturn"> | string;
    saleId?: Prisma.StringFilter<"SaleReturn"> | string;
    saleLineId?: Prisma.StringNullableFilter<"SaleReturn"> | string | null;
    refundMethod?: Prisma.EnumPaymentMethodFilter<"SaleReturn"> | $Enums.PaymentMethod;
    lotId?: Prisma.StringFilter<"SaleReturn"> | string;
    quantity?: Prisma.IntFilter<"SaleReturn"> | number;
    refund?: Prisma.DecimalFilter<"SaleReturn"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFilter<"SaleReturn"> | string;
    approvedBy?: Prisma.StringFilter<"SaleReturn"> | string;
    createdAt?: Prisma.DateTimeFilter<"SaleReturn"> | Date | string;
};
export type SaleReturnCreateManySaleInput = {
    id?: string;
    saleLineId?: string | null;
    refundMethod?: $Enums.PaymentMethod;
    lotId: string;
    quantity: number;
    refund: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    approvedBy: string;
    createdAt?: Date | string;
};
export type SaleReturnUpdateWithoutSaleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refundMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    refund?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    approvedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SaleReturnUncheckedUpdateWithoutSaleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refundMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    refund?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    approvedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SaleReturnUncheckedUpdateManyWithoutSaleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleLineId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refundMethod?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    refund?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    approvedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SaleReturnSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    saleId?: boolean;
    saleLineId?: boolean;
    refundMethod?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    refund?: boolean;
    reason?: boolean;
    approvedBy?: boolean;
    createdAt?: boolean;
    sale?: boolean | Prisma.SaleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["saleReturn"]>;
export type SaleReturnSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    saleId?: boolean;
    saleLineId?: boolean;
    refundMethod?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    refund?: boolean;
    reason?: boolean;
    approvedBy?: boolean;
    createdAt?: boolean;
    sale?: boolean | Prisma.SaleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["saleReturn"]>;
export type SaleReturnSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    saleId?: boolean;
    saleLineId?: boolean;
    refundMethod?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    refund?: boolean;
    reason?: boolean;
    approvedBy?: boolean;
    createdAt?: boolean;
    sale?: boolean | Prisma.SaleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["saleReturn"]>;
export type SaleReturnSelectScalar = {
    id?: boolean;
    saleId?: boolean;
    saleLineId?: boolean;
    refundMethod?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    refund?: boolean;
    reason?: boolean;
    approvedBy?: boolean;
    createdAt?: boolean;
};
export type SaleReturnOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "saleId" | "saleLineId" | "refundMethod" | "lotId" | "quantity" | "refund" | "reason" | "approvedBy" | "createdAt", ExtArgs["result"]["saleReturn"]>;
export type SaleReturnInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sale?: boolean | Prisma.SaleDefaultArgs<ExtArgs>;
};
export type SaleReturnIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sale?: boolean | Prisma.SaleDefaultArgs<ExtArgs>;
};
export type SaleReturnIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sale?: boolean | Prisma.SaleDefaultArgs<ExtArgs>;
};
export type $SaleReturnPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SaleReturn";
    objects: {
        sale: Prisma.$SalePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        saleId: string;
        saleLineId: string | null;
        refundMethod: $Enums.PaymentMethod;
        lotId: string;
        quantity: number;
        refund: runtime.Decimal;
        reason: string;
        approvedBy: string;
        createdAt: Date;
    }, ExtArgs["result"]["saleReturn"]>;
    composites: {};
};
export type SaleReturnGetPayload<S extends boolean | null | undefined | SaleReturnDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SaleReturnPayload, S>;
export type SaleReturnCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SaleReturnFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SaleReturnCountAggregateInputType | true;
};
export interface SaleReturnDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SaleReturn'];
        meta: {
            name: 'SaleReturn';
        };
    };
    findUnique<T extends SaleReturnFindUniqueArgs>(args: Prisma.SelectSubset<T, SaleReturnFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SaleReturnClient<runtime.Types.Result.GetResult<Prisma.$SaleReturnPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SaleReturnFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SaleReturnFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SaleReturnClient<runtime.Types.Result.GetResult<Prisma.$SaleReturnPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SaleReturnFindFirstArgs>(args?: Prisma.SelectSubset<T, SaleReturnFindFirstArgs<ExtArgs>>): Prisma.Prisma__SaleReturnClient<runtime.Types.Result.GetResult<Prisma.$SaleReturnPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SaleReturnFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SaleReturnFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SaleReturnClient<runtime.Types.Result.GetResult<Prisma.$SaleReturnPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SaleReturnFindManyArgs>(args?: Prisma.SelectSubset<T, SaleReturnFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SaleReturnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SaleReturnCreateArgs>(args: Prisma.SelectSubset<T, SaleReturnCreateArgs<ExtArgs>>): Prisma.Prisma__SaleReturnClient<runtime.Types.Result.GetResult<Prisma.$SaleReturnPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SaleReturnCreateManyArgs>(args?: Prisma.SelectSubset<T, SaleReturnCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SaleReturnCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SaleReturnCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SaleReturnPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SaleReturnDeleteArgs>(args: Prisma.SelectSubset<T, SaleReturnDeleteArgs<ExtArgs>>): Prisma.Prisma__SaleReturnClient<runtime.Types.Result.GetResult<Prisma.$SaleReturnPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SaleReturnUpdateArgs>(args: Prisma.SelectSubset<T, SaleReturnUpdateArgs<ExtArgs>>): Prisma.Prisma__SaleReturnClient<runtime.Types.Result.GetResult<Prisma.$SaleReturnPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SaleReturnDeleteManyArgs>(args?: Prisma.SelectSubset<T, SaleReturnDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SaleReturnUpdateManyArgs>(args: Prisma.SelectSubset<T, SaleReturnUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SaleReturnUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SaleReturnUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SaleReturnPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SaleReturnUpsertArgs>(args: Prisma.SelectSubset<T, SaleReturnUpsertArgs<ExtArgs>>): Prisma.Prisma__SaleReturnClient<runtime.Types.Result.GetResult<Prisma.$SaleReturnPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SaleReturnCountArgs>(args?: Prisma.Subset<T, SaleReturnCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SaleReturnCountAggregateOutputType> : number>;
    aggregate<T extends SaleReturnAggregateArgs>(args: Prisma.Subset<T, SaleReturnAggregateArgs>): Prisma.PrismaPromise<GetSaleReturnAggregateType<T>>;
    groupBy<T extends SaleReturnGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SaleReturnGroupByArgs['orderBy'];
    } : {
        orderBy?: SaleReturnGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SaleReturnGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSaleReturnGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SaleReturnFieldRefs;
}
export interface Prisma__SaleReturnClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    sale<T extends Prisma.SaleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SaleDefaultArgs<ExtArgs>>): Prisma.Prisma__SaleClient<runtime.Types.Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SaleReturnFieldRefs {
    readonly id: Prisma.FieldRef<"SaleReturn", 'String'>;
    readonly saleId: Prisma.FieldRef<"SaleReturn", 'String'>;
    readonly saleLineId: Prisma.FieldRef<"SaleReturn", 'String'>;
    readonly refundMethod: Prisma.FieldRef<"SaleReturn", 'PaymentMethod'>;
    readonly lotId: Prisma.FieldRef<"SaleReturn", 'String'>;
    readonly quantity: Prisma.FieldRef<"SaleReturn", 'Int'>;
    readonly refund: Prisma.FieldRef<"SaleReturn", 'Decimal'>;
    readonly reason: Prisma.FieldRef<"SaleReturn", 'String'>;
    readonly approvedBy: Prisma.FieldRef<"SaleReturn", 'String'>;
    readonly createdAt: Prisma.FieldRef<"SaleReturn", 'DateTime'>;
}
export type SaleReturnFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleReturnSelect<ExtArgs> | null;
    omit?: Prisma.SaleReturnOmit<ExtArgs> | null;
    include?: Prisma.SaleReturnInclude<ExtArgs> | null;
    where: Prisma.SaleReturnWhereUniqueInput;
};
export type SaleReturnFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleReturnSelect<ExtArgs> | null;
    omit?: Prisma.SaleReturnOmit<ExtArgs> | null;
    include?: Prisma.SaleReturnInclude<ExtArgs> | null;
    where: Prisma.SaleReturnWhereUniqueInput;
};
export type SaleReturnFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleReturnSelect<ExtArgs> | null;
    omit?: Prisma.SaleReturnOmit<ExtArgs> | null;
    include?: Prisma.SaleReturnInclude<ExtArgs> | null;
    where?: Prisma.SaleReturnWhereInput;
    orderBy?: Prisma.SaleReturnOrderByWithRelationInput | Prisma.SaleReturnOrderByWithRelationInput[];
    cursor?: Prisma.SaleReturnWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SaleReturnScalarFieldEnum | Prisma.SaleReturnScalarFieldEnum[];
};
export type SaleReturnFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleReturnSelect<ExtArgs> | null;
    omit?: Prisma.SaleReturnOmit<ExtArgs> | null;
    include?: Prisma.SaleReturnInclude<ExtArgs> | null;
    where?: Prisma.SaleReturnWhereInput;
    orderBy?: Prisma.SaleReturnOrderByWithRelationInput | Prisma.SaleReturnOrderByWithRelationInput[];
    cursor?: Prisma.SaleReturnWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SaleReturnScalarFieldEnum | Prisma.SaleReturnScalarFieldEnum[];
};
export type SaleReturnFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleReturnSelect<ExtArgs> | null;
    omit?: Prisma.SaleReturnOmit<ExtArgs> | null;
    include?: Prisma.SaleReturnInclude<ExtArgs> | null;
    where?: Prisma.SaleReturnWhereInput;
    orderBy?: Prisma.SaleReturnOrderByWithRelationInput | Prisma.SaleReturnOrderByWithRelationInput[];
    cursor?: Prisma.SaleReturnWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SaleReturnScalarFieldEnum | Prisma.SaleReturnScalarFieldEnum[];
};
export type SaleReturnCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleReturnSelect<ExtArgs> | null;
    omit?: Prisma.SaleReturnOmit<ExtArgs> | null;
    include?: Prisma.SaleReturnInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SaleReturnCreateInput, Prisma.SaleReturnUncheckedCreateInput>;
};
export type SaleReturnCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SaleReturnCreateManyInput | Prisma.SaleReturnCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SaleReturnCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleReturnSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SaleReturnOmit<ExtArgs> | null;
    data: Prisma.SaleReturnCreateManyInput | Prisma.SaleReturnCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SaleReturnIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SaleReturnUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleReturnSelect<ExtArgs> | null;
    omit?: Prisma.SaleReturnOmit<ExtArgs> | null;
    include?: Prisma.SaleReturnInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SaleReturnUpdateInput, Prisma.SaleReturnUncheckedUpdateInput>;
    where: Prisma.SaleReturnWhereUniqueInput;
};
export type SaleReturnUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SaleReturnUpdateManyMutationInput, Prisma.SaleReturnUncheckedUpdateManyInput>;
    where?: Prisma.SaleReturnWhereInput;
    limit?: number;
};
export type SaleReturnUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleReturnSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SaleReturnOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SaleReturnUpdateManyMutationInput, Prisma.SaleReturnUncheckedUpdateManyInput>;
    where?: Prisma.SaleReturnWhereInput;
    limit?: number;
    include?: Prisma.SaleReturnIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SaleReturnUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleReturnSelect<ExtArgs> | null;
    omit?: Prisma.SaleReturnOmit<ExtArgs> | null;
    include?: Prisma.SaleReturnInclude<ExtArgs> | null;
    where: Prisma.SaleReturnWhereUniqueInput;
    create: Prisma.XOR<Prisma.SaleReturnCreateInput, Prisma.SaleReturnUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SaleReturnUpdateInput, Prisma.SaleReturnUncheckedUpdateInput>;
};
export type SaleReturnDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleReturnSelect<ExtArgs> | null;
    omit?: Prisma.SaleReturnOmit<ExtArgs> | null;
    include?: Prisma.SaleReturnInclude<ExtArgs> | null;
    where: Prisma.SaleReturnWhereUniqueInput;
};
export type SaleReturnDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SaleReturnWhereInput;
    limit?: number;
};
export type SaleReturnDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleReturnSelect<ExtArgs> | null;
    omit?: Prisma.SaleReturnOmit<ExtArgs> | null;
    include?: Prisma.SaleReturnInclude<ExtArgs> | null;
};
