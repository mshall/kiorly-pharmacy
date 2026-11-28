import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type CustomerAccountModel = runtime.Types.Result.DefaultSelection<Prisma.$CustomerAccountPayload>;
export type AggregateCustomerAccount = {
    _count: CustomerAccountCountAggregateOutputType | null;
    _avg: CustomerAccountAvgAggregateOutputType | null;
    _sum: CustomerAccountSumAggregateOutputType | null;
    _min: CustomerAccountMinAggregateOutputType | null;
    _max: CustomerAccountMaxAggregateOutputType | null;
};
export type CustomerAccountAvgAggregateOutputType = {
    creditLimit: runtime.Decimal | null;
    balance: runtime.Decimal | null;
};
export type CustomerAccountSumAggregateOutputType = {
    creditLimit: runtime.Decimal | null;
    balance: runtime.Decimal | null;
};
export type CustomerAccountMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    patientId: string | null;
    creditLimit: runtime.Decimal | null;
    balance: runtime.Decimal | null;
    createdAt: Date | null;
};
export type CustomerAccountMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    patientId: string | null;
    creditLimit: runtime.Decimal | null;
    balance: runtime.Decimal | null;
    createdAt: Date | null;
};
export type CustomerAccountCountAggregateOutputType = {
    id: number;
    orgId: number;
    patientId: number;
    creditLimit: number;
    balance: number;
    createdAt: number;
    _all: number;
};
export type CustomerAccountAvgAggregateInputType = {
    creditLimit?: true;
    balance?: true;
};
export type CustomerAccountSumAggregateInputType = {
    creditLimit?: true;
    balance?: true;
};
export type CustomerAccountMinAggregateInputType = {
    id?: true;
    orgId?: true;
    patientId?: true;
    creditLimit?: true;
    balance?: true;
    createdAt?: true;
};
export type CustomerAccountMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    patientId?: true;
    creditLimit?: true;
    balance?: true;
    createdAt?: true;
};
export type CustomerAccountCountAggregateInputType = {
    id?: true;
    orgId?: true;
    patientId?: true;
    creditLimit?: true;
    balance?: true;
    createdAt?: true;
    _all?: true;
};
export type CustomerAccountAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerAccountWhereInput;
    orderBy?: Prisma.CustomerAccountOrderByWithRelationInput | Prisma.CustomerAccountOrderByWithRelationInput[];
    cursor?: Prisma.CustomerAccountWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CustomerAccountCountAggregateInputType;
    _avg?: CustomerAccountAvgAggregateInputType;
    _sum?: CustomerAccountSumAggregateInputType;
    _min?: CustomerAccountMinAggregateInputType;
    _max?: CustomerAccountMaxAggregateInputType;
};
export type GetCustomerAccountAggregateType<T extends CustomerAccountAggregateArgs> = {
    [P in keyof T & keyof AggregateCustomerAccount]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCustomerAccount[P]> : Prisma.GetScalarType<T[P], AggregateCustomerAccount[P]>;
};
export type CustomerAccountGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerAccountWhereInput;
    orderBy?: Prisma.CustomerAccountOrderByWithAggregationInput | Prisma.CustomerAccountOrderByWithAggregationInput[];
    by: Prisma.CustomerAccountScalarFieldEnum[] | Prisma.CustomerAccountScalarFieldEnum;
    having?: Prisma.CustomerAccountScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CustomerAccountCountAggregateInputType | true;
    _avg?: CustomerAccountAvgAggregateInputType;
    _sum?: CustomerAccountSumAggregateInputType;
    _min?: CustomerAccountMinAggregateInputType;
    _max?: CustomerAccountMaxAggregateInputType;
};
export type CustomerAccountGroupByOutputType = {
    id: string;
    orgId: string;
    patientId: string;
    creditLimit: runtime.Decimal;
    balance: runtime.Decimal;
    createdAt: Date;
    _count: CustomerAccountCountAggregateOutputType | null;
    _avg: CustomerAccountAvgAggregateOutputType | null;
    _sum: CustomerAccountSumAggregateOutputType | null;
    _min: CustomerAccountMinAggregateOutputType | null;
    _max: CustomerAccountMaxAggregateOutputType | null;
};
export type GetCustomerAccountGroupByPayload<T extends CustomerAccountGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CustomerAccountGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CustomerAccountGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CustomerAccountGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CustomerAccountGroupByOutputType[P]>;
}>>;
export type CustomerAccountWhereInput = {
    AND?: Prisma.CustomerAccountWhereInput | Prisma.CustomerAccountWhereInput[];
    OR?: Prisma.CustomerAccountWhereInput[];
    NOT?: Prisma.CustomerAccountWhereInput | Prisma.CustomerAccountWhereInput[];
    id?: Prisma.StringFilter<"CustomerAccount"> | string;
    orgId?: Prisma.StringFilter<"CustomerAccount"> | string;
    patientId?: Prisma.StringFilter<"CustomerAccount"> | string;
    creditLimit?: Prisma.DecimalFilter<"CustomerAccount"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: Prisma.DecimalFilter<"CustomerAccount"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFilter<"CustomerAccount"> | Date | string;
    patient?: Prisma.XOR<Prisma.PatientRefScalarRelationFilter, Prisma.PatientRefWhereInput>;
    sales?: Prisma.SaleListRelationFilter;
    entries?: Prisma.CustomerCreditEntryListRelationFilter;
};
export type CustomerAccountOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    creditLimit?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    patient?: Prisma.PatientRefOrderByWithRelationInput;
    sales?: Prisma.SaleOrderByRelationAggregateInput;
    entries?: Prisma.CustomerCreditEntryOrderByRelationAggregateInput;
};
export type CustomerAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    patientId?: string;
    AND?: Prisma.CustomerAccountWhereInput | Prisma.CustomerAccountWhereInput[];
    OR?: Prisma.CustomerAccountWhereInput[];
    NOT?: Prisma.CustomerAccountWhereInput | Prisma.CustomerAccountWhereInput[];
    orgId?: Prisma.StringFilter<"CustomerAccount"> | string;
    creditLimit?: Prisma.DecimalFilter<"CustomerAccount"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: Prisma.DecimalFilter<"CustomerAccount"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFilter<"CustomerAccount"> | Date | string;
    patient?: Prisma.XOR<Prisma.PatientRefScalarRelationFilter, Prisma.PatientRefWhereInput>;
    sales?: Prisma.SaleListRelationFilter;
    entries?: Prisma.CustomerCreditEntryListRelationFilter;
}, "id" | "patientId">;
export type CustomerAccountOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    creditLimit?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.CustomerAccountCountOrderByAggregateInput;
    _avg?: Prisma.CustomerAccountAvgOrderByAggregateInput;
    _max?: Prisma.CustomerAccountMaxOrderByAggregateInput;
    _min?: Prisma.CustomerAccountMinOrderByAggregateInput;
    _sum?: Prisma.CustomerAccountSumOrderByAggregateInput;
};
export type CustomerAccountScalarWhereWithAggregatesInput = {
    AND?: Prisma.CustomerAccountScalarWhereWithAggregatesInput | Prisma.CustomerAccountScalarWhereWithAggregatesInput[];
    OR?: Prisma.CustomerAccountScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CustomerAccountScalarWhereWithAggregatesInput | Prisma.CustomerAccountScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"CustomerAccount"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"CustomerAccount"> | string;
    patientId?: Prisma.StringWithAggregatesFilter<"CustomerAccount"> | string;
    creditLimit?: Prisma.DecimalWithAggregatesFilter<"CustomerAccount"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: Prisma.DecimalWithAggregatesFilter<"CustomerAccount"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"CustomerAccount"> | Date | string;
};
export type CustomerAccountCreateInput = {
    id?: string;
    orgId: string;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    patient: Prisma.PatientRefCreateNestedOneWithoutCustomerAccountInput;
    sales?: Prisma.SaleCreateNestedManyWithoutCustomerAccountInput;
    entries?: Prisma.CustomerCreditEntryCreateNestedManyWithoutAccountInput;
};
export type CustomerAccountUncheckedCreateInput = {
    id?: string;
    orgId: string;
    patientId: string;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    sales?: Prisma.SaleUncheckedCreateNestedManyWithoutCustomerAccountInput;
    entries?: Prisma.CustomerCreditEntryUncheckedCreateNestedManyWithoutAccountInput;
};
export type CustomerAccountUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    creditLimit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patient?: Prisma.PatientRefUpdateOneRequiredWithoutCustomerAccountNestedInput;
    sales?: Prisma.SaleUpdateManyWithoutCustomerAccountNestedInput;
    entries?: Prisma.CustomerCreditEntryUpdateManyWithoutAccountNestedInput;
};
export type CustomerAccountUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    creditLimit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sales?: Prisma.SaleUncheckedUpdateManyWithoutCustomerAccountNestedInput;
    entries?: Prisma.CustomerCreditEntryUncheckedUpdateManyWithoutAccountNestedInput;
};
export type CustomerAccountCreateManyInput = {
    id?: string;
    orgId: string;
    patientId: string;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
};
export type CustomerAccountUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    creditLimit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerAccountUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    creditLimit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerAccountNullableScalarRelationFilter = {
    is?: Prisma.CustomerAccountWhereInput | null;
    isNot?: Prisma.CustomerAccountWhereInput | null;
};
export type CustomerAccountCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    creditLimit?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CustomerAccountAvgOrderByAggregateInput = {
    creditLimit?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
};
export type CustomerAccountMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    creditLimit?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CustomerAccountMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    creditLimit?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CustomerAccountSumOrderByAggregateInput = {
    creditLimit?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
};
export type CustomerAccountScalarRelationFilter = {
    is?: Prisma.CustomerAccountWhereInput;
    isNot?: Prisma.CustomerAccountWhereInput;
};
export type CustomerAccountCreateNestedOneWithoutPatientInput = {
    create?: Prisma.XOR<Prisma.CustomerAccountCreateWithoutPatientInput, Prisma.CustomerAccountUncheckedCreateWithoutPatientInput>;
    connectOrCreate?: Prisma.CustomerAccountCreateOrConnectWithoutPatientInput;
    connect?: Prisma.CustomerAccountWhereUniqueInput;
};
export type CustomerAccountUncheckedCreateNestedOneWithoutPatientInput = {
    create?: Prisma.XOR<Prisma.CustomerAccountCreateWithoutPatientInput, Prisma.CustomerAccountUncheckedCreateWithoutPatientInput>;
    connectOrCreate?: Prisma.CustomerAccountCreateOrConnectWithoutPatientInput;
    connect?: Prisma.CustomerAccountWhereUniqueInput;
};
export type CustomerAccountUpdateOneWithoutPatientNestedInput = {
    create?: Prisma.XOR<Prisma.CustomerAccountCreateWithoutPatientInput, Prisma.CustomerAccountUncheckedCreateWithoutPatientInput>;
    connectOrCreate?: Prisma.CustomerAccountCreateOrConnectWithoutPatientInput;
    upsert?: Prisma.CustomerAccountUpsertWithoutPatientInput;
    disconnect?: Prisma.CustomerAccountWhereInput | boolean;
    delete?: Prisma.CustomerAccountWhereInput | boolean;
    connect?: Prisma.CustomerAccountWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CustomerAccountUpdateToOneWithWhereWithoutPatientInput, Prisma.CustomerAccountUpdateWithoutPatientInput>, Prisma.CustomerAccountUncheckedUpdateWithoutPatientInput>;
};
export type CustomerAccountUncheckedUpdateOneWithoutPatientNestedInput = {
    create?: Prisma.XOR<Prisma.CustomerAccountCreateWithoutPatientInput, Prisma.CustomerAccountUncheckedCreateWithoutPatientInput>;
    connectOrCreate?: Prisma.CustomerAccountCreateOrConnectWithoutPatientInput;
    upsert?: Prisma.CustomerAccountUpsertWithoutPatientInput;
    disconnect?: Prisma.CustomerAccountWhereInput | boolean;
    delete?: Prisma.CustomerAccountWhereInput | boolean;
    connect?: Prisma.CustomerAccountWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CustomerAccountUpdateToOneWithWhereWithoutPatientInput, Prisma.CustomerAccountUpdateWithoutPatientInput>, Prisma.CustomerAccountUncheckedUpdateWithoutPatientInput>;
};
export type CustomerAccountCreateNestedOneWithoutSalesInput = {
    create?: Prisma.XOR<Prisma.CustomerAccountCreateWithoutSalesInput, Prisma.CustomerAccountUncheckedCreateWithoutSalesInput>;
    connectOrCreate?: Prisma.CustomerAccountCreateOrConnectWithoutSalesInput;
    connect?: Prisma.CustomerAccountWhereUniqueInput;
};
export type CustomerAccountUpdateOneWithoutSalesNestedInput = {
    create?: Prisma.XOR<Prisma.CustomerAccountCreateWithoutSalesInput, Prisma.CustomerAccountUncheckedCreateWithoutSalesInput>;
    connectOrCreate?: Prisma.CustomerAccountCreateOrConnectWithoutSalesInput;
    upsert?: Prisma.CustomerAccountUpsertWithoutSalesInput;
    disconnect?: Prisma.CustomerAccountWhereInput | boolean;
    delete?: Prisma.CustomerAccountWhereInput | boolean;
    connect?: Prisma.CustomerAccountWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CustomerAccountUpdateToOneWithWhereWithoutSalesInput, Prisma.CustomerAccountUpdateWithoutSalesInput>, Prisma.CustomerAccountUncheckedUpdateWithoutSalesInput>;
};
export type CustomerAccountCreateNestedOneWithoutEntriesInput = {
    create?: Prisma.XOR<Prisma.CustomerAccountCreateWithoutEntriesInput, Prisma.CustomerAccountUncheckedCreateWithoutEntriesInput>;
    connectOrCreate?: Prisma.CustomerAccountCreateOrConnectWithoutEntriesInput;
    connect?: Prisma.CustomerAccountWhereUniqueInput;
};
export type CustomerAccountUpdateOneRequiredWithoutEntriesNestedInput = {
    create?: Prisma.XOR<Prisma.CustomerAccountCreateWithoutEntriesInput, Prisma.CustomerAccountUncheckedCreateWithoutEntriesInput>;
    connectOrCreate?: Prisma.CustomerAccountCreateOrConnectWithoutEntriesInput;
    upsert?: Prisma.CustomerAccountUpsertWithoutEntriesInput;
    connect?: Prisma.CustomerAccountWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CustomerAccountUpdateToOneWithWhereWithoutEntriesInput, Prisma.CustomerAccountUpdateWithoutEntriesInput>, Prisma.CustomerAccountUncheckedUpdateWithoutEntriesInput>;
};
export type CustomerAccountCreateWithoutPatientInput = {
    id?: string;
    orgId: string;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    sales?: Prisma.SaleCreateNestedManyWithoutCustomerAccountInput;
    entries?: Prisma.CustomerCreditEntryCreateNestedManyWithoutAccountInput;
};
export type CustomerAccountUncheckedCreateWithoutPatientInput = {
    id?: string;
    orgId: string;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    sales?: Prisma.SaleUncheckedCreateNestedManyWithoutCustomerAccountInput;
    entries?: Prisma.CustomerCreditEntryUncheckedCreateNestedManyWithoutAccountInput;
};
export type CustomerAccountCreateOrConnectWithoutPatientInput = {
    where: Prisma.CustomerAccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.CustomerAccountCreateWithoutPatientInput, Prisma.CustomerAccountUncheckedCreateWithoutPatientInput>;
};
export type CustomerAccountUpsertWithoutPatientInput = {
    update: Prisma.XOR<Prisma.CustomerAccountUpdateWithoutPatientInput, Prisma.CustomerAccountUncheckedUpdateWithoutPatientInput>;
    create: Prisma.XOR<Prisma.CustomerAccountCreateWithoutPatientInput, Prisma.CustomerAccountUncheckedCreateWithoutPatientInput>;
    where?: Prisma.CustomerAccountWhereInput;
};
export type CustomerAccountUpdateToOneWithWhereWithoutPatientInput = {
    where?: Prisma.CustomerAccountWhereInput;
    data: Prisma.XOR<Prisma.CustomerAccountUpdateWithoutPatientInput, Prisma.CustomerAccountUncheckedUpdateWithoutPatientInput>;
};
export type CustomerAccountUpdateWithoutPatientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    creditLimit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sales?: Prisma.SaleUpdateManyWithoutCustomerAccountNestedInput;
    entries?: Prisma.CustomerCreditEntryUpdateManyWithoutAccountNestedInput;
};
export type CustomerAccountUncheckedUpdateWithoutPatientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    creditLimit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sales?: Prisma.SaleUncheckedUpdateManyWithoutCustomerAccountNestedInput;
    entries?: Prisma.CustomerCreditEntryUncheckedUpdateManyWithoutAccountNestedInput;
};
export type CustomerAccountCreateWithoutSalesInput = {
    id?: string;
    orgId: string;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    patient: Prisma.PatientRefCreateNestedOneWithoutCustomerAccountInput;
    entries?: Prisma.CustomerCreditEntryCreateNestedManyWithoutAccountInput;
};
export type CustomerAccountUncheckedCreateWithoutSalesInput = {
    id?: string;
    orgId: string;
    patientId: string;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    entries?: Prisma.CustomerCreditEntryUncheckedCreateNestedManyWithoutAccountInput;
};
export type CustomerAccountCreateOrConnectWithoutSalesInput = {
    where: Prisma.CustomerAccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.CustomerAccountCreateWithoutSalesInput, Prisma.CustomerAccountUncheckedCreateWithoutSalesInput>;
};
export type CustomerAccountUpsertWithoutSalesInput = {
    update: Prisma.XOR<Prisma.CustomerAccountUpdateWithoutSalesInput, Prisma.CustomerAccountUncheckedUpdateWithoutSalesInput>;
    create: Prisma.XOR<Prisma.CustomerAccountCreateWithoutSalesInput, Prisma.CustomerAccountUncheckedCreateWithoutSalesInput>;
    where?: Prisma.CustomerAccountWhereInput;
};
export type CustomerAccountUpdateToOneWithWhereWithoutSalesInput = {
    where?: Prisma.CustomerAccountWhereInput;
    data: Prisma.XOR<Prisma.CustomerAccountUpdateWithoutSalesInput, Prisma.CustomerAccountUncheckedUpdateWithoutSalesInput>;
};
export type CustomerAccountUpdateWithoutSalesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    creditLimit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patient?: Prisma.PatientRefUpdateOneRequiredWithoutCustomerAccountNestedInput;
    entries?: Prisma.CustomerCreditEntryUpdateManyWithoutAccountNestedInput;
};
export type CustomerAccountUncheckedUpdateWithoutSalesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    creditLimit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    entries?: Prisma.CustomerCreditEntryUncheckedUpdateManyWithoutAccountNestedInput;
};
export type CustomerAccountCreateWithoutEntriesInput = {
    id?: string;
    orgId: string;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    patient: Prisma.PatientRefCreateNestedOneWithoutCustomerAccountInput;
    sales?: Prisma.SaleCreateNestedManyWithoutCustomerAccountInput;
};
export type CustomerAccountUncheckedCreateWithoutEntriesInput = {
    id?: string;
    orgId: string;
    patientId: string;
    creditLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    sales?: Prisma.SaleUncheckedCreateNestedManyWithoutCustomerAccountInput;
};
export type CustomerAccountCreateOrConnectWithoutEntriesInput = {
    where: Prisma.CustomerAccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.CustomerAccountCreateWithoutEntriesInput, Prisma.CustomerAccountUncheckedCreateWithoutEntriesInput>;
};
export type CustomerAccountUpsertWithoutEntriesInput = {
    update: Prisma.XOR<Prisma.CustomerAccountUpdateWithoutEntriesInput, Prisma.CustomerAccountUncheckedUpdateWithoutEntriesInput>;
    create: Prisma.XOR<Prisma.CustomerAccountCreateWithoutEntriesInput, Prisma.CustomerAccountUncheckedCreateWithoutEntriesInput>;
    where?: Prisma.CustomerAccountWhereInput;
};
export type CustomerAccountUpdateToOneWithWhereWithoutEntriesInput = {
    where?: Prisma.CustomerAccountWhereInput;
    data: Prisma.XOR<Prisma.CustomerAccountUpdateWithoutEntriesInput, Prisma.CustomerAccountUncheckedUpdateWithoutEntriesInput>;
};
export type CustomerAccountUpdateWithoutEntriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    creditLimit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patient?: Prisma.PatientRefUpdateOneRequiredWithoutCustomerAccountNestedInput;
    sales?: Prisma.SaleUpdateManyWithoutCustomerAccountNestedInput;
};
export type CustomerAccountUncheckedUpdateWithoutEntriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    creditLimit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sales?: Prisma.SaleUncheckedUpdateManyWithoutCustomerAccountNestedInput;
};
export type CustomerAccountCountOutputType = {
    sales: number;
    entries: number;
};
export type CustomerAccountCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sales?: boolean | CustomerAccountCountOutputTypeCountSalesArgs;
    entries?: boolean | CustomerAccountCountOutputTypeCountEntriesArgs;
};
export type CustomerAccountCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerAccountCountOutputTypeSelect<ExtArgs> | null;
};
export type CustomerAccountCountOutputTypeCountSalesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SaleWhereInput;
};
export type CustomerAccountCountOutputTypeCountEntriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerCreditEntryWhereInput;
};
export type CustomerAccountSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    creditLimit?: boolean;
    balance?: boolean;
    createdAt?: boolean;
    patient?: boolean | Prisma.PatientRefDefaultArgs<ExtArgs>;
    sales?: boolean | Prisma.CustomerAccount$salesArgs<ExtArgs>;
    entries?: boolean | Prisma.CustomerAccount$entriesArgs<ExtArgs>;
    _count?: boolean | Prisma.CustomerAccountCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["customerAccount"]>;
export type CustomerAccountSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    creditLimit?: boolean;
    balance?: boolean;
    createdAt?: boolean;
    patient?: boolean | Prisma.PatientRefDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["customerAccount"]>;
export type CustomerAccountSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    creditLimit?: boolean;
    balance?: boolean;
    createdAt?: boolean;
    patient?: boolean | Prisma.PatientRefDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["customerAccount"]>;
export type CustomerAccountSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    creditLimit?: boolean;
    balance?: boolean;
    createdAt?: boolean;
};
export type CustomerAccountOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "patientId" | "creditLimit" | "balance" | "createdAt", ExtArgs["result"]["customerAccount"]>;
export type CustomerAccountInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    patient?: boolean | Prisma.PatientRefDefaultArgs<ExtArgs>;
    sales?: boolean | Prisma.CustomerAccount$salesArgs<ExtArgs>;
    entries?: boolean | Prisma.CustomerAccount$entriesArgs<ExtArgs>;
    _count?: boolean | Prisma.CustomerAccountCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CustomerAccountIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    patient?: boolean | Prisma.PatientRefDefaultArgs<ExtArgs>;
};
export type CustomerAccountIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    patient?: boolean | Prisma.PatientRefDefaultArgs<ExtArgs>;
};
export type $CustomerAccountPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CustomerAccount";
    objects: {
        patient: Prisma.$PatientRefPayload<ExtArgs>;
        sales: Prisma.$SalePayload<ExtArgs>[];
        entries: Prisma.$CustomerCreditEntryPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        patientId: string;
        creditLimit: runtime.Decimal;
        balance: runtime.Decimal;
        createdAt: Date;
    }, ExtArgs["result"]["customerAccount"]>;
    composites: {};
};
export type CustomerAccountGetPayload<S extends boolean | null | undefined | CustomerAccountDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CustomerAccountPayload, S>;
export type CustomerAccountCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CustomerAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CustomerAccountCountAggregateInputType | true;
};
export interface CustomerAccountDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CustomerAccount'];
        meta: {
            name: 'CustomerAccount';
        };
    };
    findUnique<T extends CustomerAccountFindUniqueArgs>(args: Prisma.SelectSubset<T, CustomerAccountFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CustomerAccountClient<runtime.Types.Result.GetResult<Prisma.$CustomerAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CustomerAccountFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CustomerAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CustomerAccountClient<runtime.Types.Result.GetResult<Prisma.$CustomerAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CustomerAccountFindFirstArgs>(args?: Prisma.SelectSubset<T, CustomerAccountFindFirstArgs<ExtArgs>>): Prisma.Prisma__CustomerAccountClient<runtime.Types.Result.GetResult<Prisma.$CustomerAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CustomerAccountFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CustomerAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CustomerAccountClient<runtime.Types.Result.GetResult<Prisma.$CustomerAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CustomerAccountFindManyArgs>(args?: Prisma.SelectSubset<T, CustomerAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CustomerAccountCreateArgs>(args: Prisma.SelectSubset<T, CustomerAccountCreateArgs<ExtArgs>>): Prisma.Prisma__CustomerAccountClient<runtime.Types.Result.GetResult<Prisma.$CustomerAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CustomerAccountCreateManyArgs>(args?: Prisma.SelectSubset<T, CustomerAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CustomerAccountCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CustomerAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CustomerAccountDeleteArgs>(args: Prisma.SelectSubset<T, CustomerAccountDeleteArgs<ExtArgs>>): Prisma.Prisma__CustomerAccountClient<runtime.Types.Result.GetResult<Prisma.$CustomerAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CustomerAccountUpdateArgs>(args: Prisma.SelectSubset<T, CustomerAccountUpdateArgs<ExtArgs>>): Prisma.Prisma__CustomerAccountClient<runtime.Types.Result.GetResult<Prisma.$CustomerAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CustomerAccountDeleteManyArgs>(args?: Prisma.SelectSubset<T, CustomerAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CustomerAccountUpdateManyArgs>(args: Prisma.SelectSubset<T, CustomerAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CustomerAccountUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CustomerAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CustomerAccountUpsertArgs>(args: Prisma.SelectSubset<T, CustomerAccountUpsertArgs<ExtArgs>>): Prisma.Prisma__CustomerAccountClient<runtime.Types.Result.GetResult<Prisma.$CustomerAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CustomerAccountCountArgs>(args?: Prisma.Subset<T, CustomerAccountCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CustomerAccountCountAggregateOutputType> : number>;
    aggregate<T extends CustomerAccountAggregateArgs>(args: Prisma.Subset<T, CustomerAccountAggregateArgs>): Prisma.PrismaPromise<GetCustomerAccountAggregateType<T>>;
    groupBy<T extends CustomerAccountGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CustomerAccountGroupByArgs['orderBy'];
    } : {
        orderBy?: CustomerAccountGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CustomerAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CustomerAccountFieldRefs;
}
export interface Prisma__CustomerAccountClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    patient<T extends Prisma.PatientRefDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PatientRefDefaultArgs<ExtArgs>>): Prisma.Prisma__PatientRefClient<runtime.Types.Result.GetResult<Prisma.$PatientRefPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    sales<T extends Prisma.CustomerAccount$salesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CustomerAccount$salesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    entries<T extends Prisma.CustomerAccount$entriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CustomerAccount$entriesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerCreditEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CustomerAccountFieldRefs {
    readonly id: Prisma.FieldRef<"CustomerAccount", 'String'>;
    readonly orgId: Prisma.FieldRef<"CustomerAccount", 'String'>;
    readonly patientId: Prisma.FieldRef<"CustomerAccount", 'String'>;
    readonly creditLimit: Prisma.FieldRef<"CustomerAccount", 'Decimal'>;
    readonly balance: Prisma.FieldRef<"CustomerAccount", 'Decimal'>;
    readonly createdAt: Prisma.FieldRef<"CustomerAccount", 'DateTime'>;
}
export type CustomerAccountFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerAccountSelect<ExtArgs> | null;
    omit?: Prisma.CustomerAccountOmit<ExtArgs> | null;
    include?: Prisma.CustomerAccountInclude<ExtArgs> | null;
    where: Prisma.CustomerAccountWhereUniqueInput;
};
export type CustomerAccountFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerAccountSelect<ExtArgs> | null;
    omit?: Prisma.CustomerAccountOmit<ExtArgs> | null;
    include?: Prisma.CustomerAccountInclude<ExtArgs> | null;
    where: Prisma.CustomerAccountWhereUniqueInput;
};
export type CustomerAccountFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerAccountSelect<ExtArgs> | null;
    omit?: Prisma.CustomerAccountOmit<ExtArgs> | null;
    include?: Prisma.CustomerAccountInclude<ExtArgs> | null;
    where?: Prisma.CustomerAccountWhereInput;
    orderBy?: Prisma.CustomerAccountOrderByWithRelationInput | Prisma.CustomerAccountOrderByWithRelationInput[];
    cursor?: Prisma.CustomerAccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerAccountScalarFieldEnum | Prisma.CustomerAccountScalarFieldEnum[];
};
export type CustomerAccountFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerAccountSelect<ExtArgs> | null;
    omit?: Prisma.CustomerAccountOmit<ExtArgs> | null;
    include?: Prisma.CustomerAccountInclude<ExtArgs> | null;
    where?: Prisma.CustomerAccountWhereInput;
    orderBy?: Prisma.CustomerAccountOrderByWithRelationInput | Prisma.CustomerAccountOrderByWithRelationInput[];
    cursor?: Prisma.CustomerAccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerAccountScalarFieldEnum | Prisma.CustomerAccountScalarFieldEnum[];
};
export type CustomerAccountFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerAccountSelect<ExtArgs> | null;
    omit?: Prisma.CustomerAccountOmit<ExtArgs> | null;
    include?: Prisma.CustomerAccountInclude<ExtArgs> | null;
    where?: Prisma.CustomerAccountWhereInput;
    orderBy?: Prisma.CustomerAccountOrderByWithRelationInput | Prisma.CustomerAccountOrderByWithRelationInput[];
    cursor?: Prisma.CustomerAccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerAccountScalarFieldEnum | Prisma.CustomerAccountScalarFieldEnum[];
};
export type CustomerAccountCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerAccountSelect<ExtArgs> | null;
    omit?: Prisma.CustomerAccountOmit<ExtArgs> | null;
    include?: Prisma.CustomerAccountInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CustomerAccountCreateInput, Prisma.CustomerAccountUncheckedCreateInput>;
};
export type CustomerAccountCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CustomerAccountCreateManyInput | Prisma.CustomerAccountCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CustomerAccountCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerAccountSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CustomerAccountOmit<ExtArgs> | null;
    data: Prisma.CustomerAccountCreateManyInput | Prisma.CustomerAccountCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CustomerAccountIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CustomerAccountUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerAccountSelect<ExtArgs> | null;
    omit?: Prisma.CustomerAccountOmit<ExtArgs> | null;
    include?: Prisma.CustomerAccountInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CustomerAccountUpdateInput, Prisma.CustomerAccountUncheckedUpdateInput>;
    where: Prisma.CustomerAccountWhereUniqueInput;
};
export type CustomerAccountUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CustomerAccountUpdateManyMutationInput, Prisma.CustomerAccountUncheckedUpdateManyInput>;
    where?: Prisma.CustomerAccountWhereInput;
    limit?: number;
};
export type CustomerAccountUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerAccountSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CustomerAccountOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CustomerAccountUpdateManyMutationInput, Prisma.CustomerAccountUncheckedUpdateManyInput>;
    where?: Prisma.CustomerAccountWhereInput;
    limit?: number;
    include?: Prisma.CustomerAccountIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CustomerAccountUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerAccountSelect<ExtArgs> | null;
    omit?: Prisma.CustomerAccountOmit<ExtArgs> | null;
    include?: Prisma.CustomerAccountInclude<ExtArgs> | null;
    where: Prisma.CustomerAccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.CustomerAccountCreateInput, Prisma.CustomerAccountUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CustomerAccountUpdateInput, Prisma.CustomerAccountUncheckedUpdateInput>;
};
export type CustomerAccountDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerAccountSelect<ExtArgs> | null;
    omit?: Prisma.CustomerAccountOmit<ExtArgs> | null;
    include?: Prisma.CustomerAccountInclude<ExtArgs> | null;
    where: Prisma.CustomerAccountWhereUniqueInput;
};
export type CustomerAccountDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerAccountWhereInput;
    limit?: number;
};
export type CustomerAccount$salesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CustomerAccount$entriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CustomerAccountDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerAccountSelect<ExtArgs> | null;
    omit?: Prisma.CustomerAccountOmit<ExtArgs> | null;
    include?: Prisma.CustomerAccountInclude<ExtArgs> | null;
};
