import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ControlledSubstanceLogEntryModel = runtime.Types.Result.DefaultSelection<Prisma.$ControlledSubstanceLogEntryPayload>;
export type AggregateControlledSubstanceLogEntry = {
    _count: ControlledSubstanceLogEntryCountAggregateOutputType | null;
    _avg: ControlledSubstanceLogEntryAvgAggregateOutputType | null;
    _sum: ControlledSubstanceLogEntrySumAggregateOutputType | null;
    _min: ControlledSubstanceLogEntryMinAggregateOutputType | null;
    _max: ControlledSubstanceLogEntryMaxAggregateOutputType | null;
};
export type ControlledSubstanceLogEntryAvgAggregateOutputType = {
    quantity: number | null;
};
export type ControlledSubstanceLogEntrySumAggregateOutputType = {
    quantity: number | null;
};
export type ControlledSubstanceLogEntryMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    dispensingId: string | null;
    drugId: string | null;
    lotId: string | null;
    quantity: number | null;
    patientNationalIdLast4: string | null;
    patientNationalIdHash: string | null;
    patientName: string | null;
    prescriptionId: string | null;
    prescriberLicenceNo: string | null;
    pharmacistId: string | null;
    loggedAt: Date | null;
};
export type ControlledSubstanceLogEntryMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    dispensingId: string | null;
    drugId: string | null;
    lotId: string | null;
    quantity: number | null;
    patientNationalIdLast4: string | null;
    patientNationalIdHash: string | null;
    patientName: string | null;
    prescriptionId: string | null;
    prescriberLicenceNo: string | null;
    pharmacistId: string | null;
    loggedAt: Date | null;
};
export type ControlledSubstanceLogEntryCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    dispensingId: number;
    drugId: number;
    lotId: number;
    quantity: number;
    patientNationalIdLast4: number;
    patientNationalIdHash: number;
    patientName: number;
    prescriptionId: number;
    prescriberLicenceNo: number;
    pharmacistId: number;
    loggedAt: number;
    _all: number;
};
export type ControlledSubstanceLogEntryAvgAggregateInputType = {
    quantity?: true;
};
export type ControlledSubstanceLogEntrySumAggregateInputType = {
    quantity?: true;
};
export type ControlledSubstanceLogEntryMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    dispensingId?: true;
    drugId?: true;
    lotId?: true;
    quantity?: true;
    patientNationalIdLast4?: true;
    patientNationalIdHash?: true;
    patientName?: true;
    prescriptionId?: true;
    prescriberLicenceNo?: true;
    pharmacistId?: true;
    loggedAt?: true;
};
export type ControlledSubstanceLogEntryMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    dispensingId?: true;
    drugId?: true;
    lotId?: true;
    quantity?: true;
    patientNationalIdLast4?: true;
    patientNationalIdHash?: true;
    patientName?: true;
    prescriptionId?: true;
    prescriberLicenceNo?: true;
    pharmacistId?: true;
    loggedAt?: true;
};
export type ControlledSubstanceLogEntryCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    dispensingId?: true;
    drugId?: true;
    lotId?: true;
    quantity?: true;
    patientNationalIdLast4?: true;
    patientNationalIdHash?: true;
    patientName?: true;
    prescriptionId?: true;
    prescriberLicenceNo?: true;
    pharmacistId?: true;
    loggedAt?: true;
    _all?: true;
};
export type ControlledSubstanceLogEntryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ControlledSubstanceLogEntryWhereInput;
    orderBy?: Prisma.ControlledSubstanceLogEntryOrderByWithRelationInput | Prisma.ControlledSubstanceLogEntryOrderByWithRelationInput[];
    cursor?: Prisma.ControlledSubstanceLogEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ControlledSubstanceLogEntryCountAggregateInputType;
    _avg?: ControlledSubstanceLogEntryAvgAggregateInputType;
    _sum?: ControlledSubstanceLogEntrySumAggregateInputType;
    _min?: ControlledSubstanceLogEntryMinAggregateInputType;
    _max?: ControlledSubstanceLogEntryMaxAggregateInputType;
};
export type GetControlledSubstanceLogEntryAggregateType<T extends ControlledSubstanceLogEntryAggregateArgs> = {
    [P in keyof T & keyof AggregateControlledSubstanceLogEntry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateControlledSubstanceLogEntry[P]> : Prisma.GetScalarType<T[P], AggregateControlledSubstanceLogEntry[P]>;
};
export type ControlledSubstanceLogEntryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ControlledSubstanceLogEntryWhereInput;
    orderBy?: Prisma.ControlledSubstanceLogEntryOrderByWithAggregationInput | Prisma.ControlledSubstanceLogEntryOrderByWithAggregationInput[];
    by: Prisma.ControlledSubstanceLogEntryScalarFieldEnum[] | Prisma.ControlledSubstanceLogEntryScalarFieldEnum;
    having?: Prisma.ControlledSubstanceLogEntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ControlledSubstanceLogEntryCountAggregateInputType | true;
    _avg?: ControlledSubstanceLogEntryAvgAggregateInputType;
    _sum?: ControlledSubstanceLogEntrySumAggregateInputType;
    _min?: ControlledSubstanceLogEntryMinAggregateInputType;
    _max?: ControlledSubstanceLogEntryMaxAggregateInputType;
};
export type ControlledSubstanceLogEntryGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    dispensingId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    patientNationalIdLast4: string;
    patientNationalIdHash: string | null;
    patientName: string | null;
    prescriptionId: string | null;
    prescriberLicenceNo: string | null;
    pharmacistId: string;
    loggedAt: Date;
    _count: ControlledSubstanceLogEntryCountAggregateOutputType | null;
    _avg: ControlledSubstanceLogEntryAvgAggregateOutputType | null;
    _sum: ControlledSubstanceLogEntrySumAggregateOutputType | null;
    _min: ControlledSubstanceLogEntryMinAggregateOutputType | null;
    _max: ControlledSubstanceLogEntryMaxAggregateOutputType | null;
};
export type GetControlledSubstanceLogEntryGroupByPayload<T extends ControlledSubstanceLogEntryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ControlledSubstanceLogEntryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ControlledSubstanceLogEntryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ControlledSubstanceLogEntryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ControlledSubstanceLogEntryGroupByOutputType[P]>;
}>>;
export type ControlledSubstanceLogEntryWhereInput = {
    AND?: Prisma.ControlledSubstanceLogEntryWhereInput | Prisma.ControlledSubstanceLogEntryWhereInput[];
    OR?: Prisma.ControlledSubstanceLogEntryWhereInput[];
    NOT?: Prisma.ControlledSubstanceLogEntryWhereInput | Prisma.ControlledSubstanceLogEntryWhereInput[];
    id?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    orgId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    branchId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    dispensingId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    drugId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    lotId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    quantity?: Prisma.IntFilter<"ControlledSubstanceLogEntry"> | number;
    patientNationalIdLast4?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    patientNationalIdHash?: Prisma.StringNullableFilter<"ControlledSubstanceLogEntry"> | string | null;
    patientName?: Prisma.StringNullableFilter<"ControlledSubstanceLogEntry"> | string | null;
    prescriptionId?: Prisma.StringNullableFilter<"ControlledSubstanceLogEntry"> | string | null;
    prescriberLicenceNo?: Prisma.StringNullableFilter<"ControlledSubstanceLogEntry"> | string | null;
    pharmacistId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    loggedAt?: Prisma.DateTimeFilter<"ControlledSubstanceLogEntry"> | Date | string;
    dispensing?: Prisma.XOR<Prisma.DispensingScalarRelationFilter, Prisma.DispensingWhereInput>;
};
export type ControlledSubstanceLogEntryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    dispensingId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    patientNationalIdLast4?: Prisma.SortOrder;
    patientNationalIdHash?: Prisma.SortOrderInput | Prisma.SortOrder;
    patientName?: Prisma.SortOrderInput | Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    prescriberLicenceNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    pharmacistId?: Prisma.SortOrder;
    loggedAt?: Prisma.SortOrder;
    dispensing?: Prisma.DispensingOrderByWithRelationInput;
};
export type ControlledSubstanceLogEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ControlledSubstanceLogEntryWhereInput | Prisma.ControlledSubstanceLogEntryWhereInput[];
    OR?: Prisma.ControlledSubstanceLogEntryWhereInput[];
    NOT?: Prisma.ControlledSubstanceLogEntryWhereInput | Prisma.ControlledSubstanceLogEntryWhereInput[];
    orgId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    branchId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    dispensingId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    drugId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    lotId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    quantity?: Prisma.IntFilter<"ControlledSubstanceLogEntry"> | number;
    patientNationalIdLast4?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    patientNationalIdHash?: Prisma.StringNullableFilter<"ControlledSubstanceLogEntry"> | string | null;
    patientName?: Prisma.StringNullableFilter<"ControlledSubstanceLogEntry"> | string | null;
    prescriptionId?: Prisma.StringNullableFilter<"ControlledSubstanceLogEntry"> | string | null;
    prescriberLicenceNo?: Prisma.StringNullableFilter<"ControlledSubstanceLogEntry"> | string | null;
    pharmacistId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    loggedAt?: Prisma.DateTimeFilter<"ControlledSubstanceLogEntry"> | Date | string;
    dispensing?: Prisma.XOR<Prisma.DispensingScalarRelationFilter, Prisma.DispensingWhereInput>;
}, "id">;
export type ControlledSubstanceLogEntryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    dispensingId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    patientNationalIdLast4?: Prisma.SortOrder;
    patientNationalIdHash?: Prisma.SortOrderInput | Prisma.SortOrder;
    patientName?: Prisma.SortOrderInput | Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    prescriberLicenceNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    pharmacistId?: Prisma.SortOrder;
    loggedAt?: Prisma.SortOrder;
    _count?: Prisma.ControlledSubstanceLogEntryCountOrderByAggregateInput;
    _avg?: Prisma.ControlledSubstanceLogEntryAvgOrderByAggregateInput;
    _max?: Prisma.ControlledSubstanceLogEntryMaxOrderByAggregateInput;
    _min?: Prisma.ControlledSubstanceLogEntryMinOrderByAggregateInput;
    _sum?: Prisma.ControlledSubstanceLogEntrySumOrderByAggregateInput;
};
export type ControlledSubstanceLogEntryScalarWhereWithAggregatesInput = {
    AND?: Prisma.ControlledSubstanceLogEntryScalarWhereWithAggregatesInput | Prisma.ControlledSubstanceLogEntryScalarWhereWithAggregatesInput[];
    OR?: Prisma.ControlledSubstanceLogEntryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ControlledSubstanceLogEntryScalarWhereWithAggregatesInput | Prisma.ControlledSubstanceLogEntryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ControlledSubstanceLogEntry"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"ControlledSubstanceLogEntry"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"ControlledSubstanceLogEntry"> | string;
    dispensingId?: Prisma.StringWithAggregatesFilter<"ControlledSubstanceLogEntry"> | string;
    drugId?: Prisma.StringWithAggregatesFilter<"ControlledSubstanceLogEntry"> | string;
    lotId?: Prisma.StringWithAggregatesFilter<"ControlledSubstanceLogEntry"> | string;
    quantity?: Prisma.IntWithAggregatesFilter<"ControlledSubstanceLogEntry"> | number;
    patientNationalIdLast4?: Prisma.StringWithAggregatesFilter<"ControlledSubstanceLogEntry"> | string;
    patientNationalIdHash?: Prisma.StringNullableWithAggregatesFilter<"ControlledSubstanceLogEntry"> | string | null;
    patientName?: Prisma.StringNullableWithAggregatesFilter<"ControlledSubstanceLogEntry"> | string | null;
    prescriptionId?: Prisma.StringNullableWithAggregatesFilter<"ControlledSubstanceLogEntry"> | string | null;
    prescriberLicenceNo?: Prisma.StringNullableWithAggregatesFilter<"ControlledSubstanceLogEntry"> | string | null;
    pharmacistId?: Prisma.StringWithAggregatesFilter<"ControlledSubstanceLogEntry"> | string;
    loggedAt?: Prisma.DateTimeWithAggregatesFilter<"ControlledSubstanceLogEntry"> | Date | string;
};
export type ControlledSubstanceLogEntryCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    patientNationalIdLast4: string;
    patientNationalIdHash?: string | null;
    patientName?: string | null;
    prescriptionId?: string | null;
    prescriberLicenceNo?: string | null;
    pharmacistId: string;
    loggedAt?: Date | string;
    dispensing: Prisma.DispensingCreateNestedOneWithoutControlledLogInput;
};
export type ControlledSubstanceLogEntryUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    dispensingId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    patientNationalIdLast4: string;
    patientNationalIdHash?: string | null;
    patientName?: string | null;
    prescriptionId?: string | null;
    prescriberLicenceNo?: string | null;
    pharmacistId: string;
    loggedAt?: Date | string;
};
export type ControlledSubstanceLogEntryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    patientNationalIdLast4?: Prisma.StringFieldUpdateOperationsInput | string;
    patientNationalIdHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    patientName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescriptionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescriberLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pharmacistId?: Prisma.StringFieldUpdateOperationsInput | string;
    loggedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dispensing?: Prisma.DispensingUpdateOneRequiredWithoutControlledLogNestedInput;
};
export type ControlledSubstanceLogEntryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    dispensingId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    patientNationalIdLast4?: Prisma.StringFieldUpdateOperationsInput | string;
    patientNationalIdHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    patientName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescriptionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescriberLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pharmacistId?: Prisma.StringFieldUpdateOperationsInput | string;
    loggedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ControlledSubstanceLogEntryCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    dispensingId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    patientNationalIdLast4: string;
    patientNationalIdHash?: string | null;
    patientName?: string | null;
    prescriptionId?: string | null;
    prescriberLicenceNo?: string | null;
    pharmacistId: string;
    loggedAt?: Date | string;
};
export type ControlledSubstanceLogEntryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    patientNationalIdLast4?: Prisma.StringFieldUpdateOperationsInput | string;
    patientNationalIdHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    patientName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescriptionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescriberLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pharmacistId?: Prisma.StringFieldUpdateOperationsInput | string;
    loggedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ControlledSubstanceLogEntryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    dispensingId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    patientNationalIdLast4?: Prisma.StringFieldUpdateOperationsInput | string;
    patientNationalIdHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    patientName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescriptionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescriberLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pharmacistId?: Prisma.StringFieldUpdateOperationsInput | string;
    loggedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ControlledSubstanceLogEntryListRelationFilter = {
    every?: Prisma.ControlledSubstanceLogEntryWhereInput;
    some?: Prisma.ControlledSubstanceLogEntryWhereInput;
    none?: Prisma.ControlledSubstanceLogEntryWhereInput;
};
export type ControlledSubstanceLogEntryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ControlledSubstanceLogEntryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    dispensingId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    patientNationalIdLast4?: Prisma.SortOrder;
    patientNationalIdHash?: Prisma.SortOrder;
    patientName?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    prescriberLicenceNo?: Prisma.SortOrder;
    pharmacistId?: Prisma.SortOrder;
    loggedAt?: Prisma.SortOrder;
};
export type ControlledSubstanceLogEntryAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type ControlledSubstanceLogEntryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    dispensingId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    patientNationalIdLast4?: Prisma.SortOrder;
    patientNationalIdHash?: Prisma.SortOrder;
    patientName?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    prescriberLicenceNo?: Prisma.SortOrder;
    pharmacistId?: Prisma.SortOrder;
    loggedAt?: Prisma.SortOrder;
};
export type ControlledSubstanceLogEntryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    dispensingId?: Prisma.SortOrder;
    drugId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    patientNationalIdLast4?: Prisma.SortOrder;
    patientNationalIdHash?: Prisma.SortOrder;
    patientName?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    prescriberLicenceNo?: Prisma.SortOrder;
    pharmacistId?: Prisma.SortOrder;
    loggedAt?: Prisma.SortOrder;
};
export type ControlledSubstanceLogEntrySumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type ControlledSubstanceLogEntryCreateNestedManyWithoutDispensingInput = {
    create?: Prisma.XOR<Prisma.ControlledSubstanceLogEntryCreateWithoutDispensingInput, Prisma.ControlledSubstanceLogEntryUncheckedCreateWithoutDispensingInput> | Prisma.ControlledSubstanceLogEntryCreateWithoutDispensingInput[] | Prisma.ControlledSubstanceLogEntryUncheckedCreateWithoutDispensingInput[];
    connectOrCreate?: Prisma.ControlledSubstanceLogEntryCreateOrConnectWithoutDispensingInput | Prisma.ControlledSubstanceLogEntryCreateOrConnectWithoutDispensingInput[];
    createMany?: Prisma.ControlledSubstanceLogEntryCreateManyDispensingInputEnvelope;
    connect?: Prisma.ControlledSubstanceLogEntryWhereUniqueInput | Prisma.ControlledSubstanceLogEntryWhereUniqueInput[];
};
export type ControlledSubstanceLogEntryUncheckedCreateNestedManyWithoutDispensingInput = {
    create?: Prisma.XOR<Prisma.ControlledSubstanceLogEntryCreateWithoutDispensingInput, Prisma.ControlledSubstanceLogEntryUncheckedCreateWithoutDispensingInput> | Prisma.ControlledSubstanceLogEntryCreateWithoutDispensingInput[] | Prisma.ControlledSubstanceLogEntryUncheckedCreateWithoutDispensingInput[];
    connectOrCreate?: Prisma.ControlledSubstanceLogEntryCreateOrConnectWithoutDispensingInput | Prisma.ControlledSubstanceLogEntryCreateOrConnectWithoutDispensingInput[];
    createMany?: Prisma.ControlledSubstanceLogEntryCreateManyDispensingInputEnvelope;
    connect?: Prisma.ControlledSubstanceLogEntryWhereUniqueInput | Prisma.ControlledSubstanceLogEntryWhereUniqueInput[];
};
export type ControlledSubstanceLogEntryUpdateManyWithoutDispensingNestedInput = {
    create?: Prisma.XOR<Prisma.ControlledSubstanceLogEntryCreateWithoutDispensingInput, Prisma.ControlledSubstanceLogEntryUncheckedCreateWithoutDispensingInput> | Prisma.ControlledSubstanceLogEntryCreateWithoutDispensingInput[] | Prisma.ControlledSubstanceLogEntryUncheckedCreateWithoutDispensingInput[];
    connectOrCreate?: Prisma.ControlledSubstanceLogEntryCreateOrConnectWithoutDispensingInput | Prisma.ControlledSubstanceLogEntryCreateOrConnectWithoutDispensingInput[];
    upsert?: Prisma.ControlledSubstanceLogEntryUpsertWithWhereUniqueWithoutDispensingInput | Prisma.ControlledSubstanceLogEntryUpsertWithWhereUniqueWithoutDispensingInput[];
    createMany?: Prisma.ControlledSubstanceLogEntryCreateManyDispensingInputEnvelope;
    set?: Prisma.ControlledSubstanceLogEntryWhereUniqueInput | Prisma.ControlledSubstanceLogEntryWhereUniqueInput[];
    disconnect?: Prisma.ControlledSubstanceLogEntryWhereUniqueInput | Prisma.ControlledSubstanceLogEntryWhereUniqueInput[];
    delete?: Prisma.ControlledSubstanceLogEntryWhereUniqueInput | Prisma.ControlledSubstanceLogEntryWhereUniqueInput[];
    connect?: Prisma.ControlledSubstanceLogEntryWhereUniqueInput | Prisma.ControlledSubstanceLogEntryWhereUniqueInput[];
    update?: Prisma.ControlledSubstanceLogEntryUpdateWithWhereUniqueWithoutDispensingInput | Prisma.ControlledSubstanceLogEntryUpdateWithWhereUniqueWithoutDispensingInput[];
    updateMany?: Prisma.ControlledSubstanceLogEntryUpdateManyWithWhereWithoutDispensingInput | Prisma.ControlledSubstanceLogEntryUpdateManyWithWhereWithoutDispensingInput[];
    deleteMany?: Prisma.ControlledSubstanceLogEntryScalarWhereInput | Prisma.ControlledSubstanceLogEntryScalarWhereInput[];
};
export type ControlledSubstanceLogEntryUncheckedUpdateManyWithoutDispensingNestedInput = {
    create?: Prisma.XOR<Prisma.ControlledSubstanceLogEntryCreateWithoutDispensingInput, Prisma.ControlledSubstanceLogEntryUncheckedCreateWithoutDispensingInput> | Prisma.ControlledSubstanceLogEntryCreateWithoutDispensingInput[] | Prisma.ControlledSubstanceLogEntryUncheckedCreateWithoutDispensingInput[];
    connectOrCreate?: Prisma.ControlledSubstanceLogEntryCreateOrConnectWithoutDispensingInput | Prisma.ControlledSubstanceLogEntryCreateOrConnectWithoutDispensingInput[];
    upsert?: Prisma.ControlledSubstanceLogEntryUpsertWithWhereUniqueWithoutDispensingInput | Prisma.ControlledSubstanceLogEntryUpsertWithWhereUniqueWithoutDispensingInput[];
    createMany?: Prisma.ControlledSubstanceLogEntryCreateManyDispensingInputEnvelope;
    set?: Prisma.ControlledSubstanceLogEntryWhereUniqueInput | Prisma.ControlledSubstanceLogEntryWhereUniqueInput[];
    disconnect?: Prisma.ControlledSubstanceLogEntryWhereUniqueInput | Prisma.ControlledSubstanceLogEntryWhereUniqueInput[];
    delete?: Prisma.ControlledSubstanceLogEntryWhereUniqueInput | Prisma.ControlledSubstanceLogEntryWhereUniqueInput[];
    connect?: Prisma.ControlledSubstanceLogEntryWhereUniqueInput | Prisma.ControlledSubstanceLogEntryWhereUniqueInput[];
    update?: Prisma.ControlledSubstanceLogEntryUpdateWithWhereUniqueWithoutDispensingInput | Prisma.ControlledSubstanceLogEntryUpdateWithWhereUniqueWithoutDispensingInput[];
    updateMany?: Prisma.ControlledSubstanceLogEntryUpdateManyWithWhereWithoutDispensingInput | Prisma.ControlledSubstanceLogEntryUpdateManyWithWhereWithoutDispensingInput[];
    deleteMany?: Prisma.ControlledSubstanceLogEntryScalarWhereInput | Prisma.ControlledSubstanceLogEntryScalarWhereInput[];
};
export type ControlledSubstanceLogEntryCreateWithoutDispensingInput = {
    id?: string;
    orgId: string;
    branchId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    patientNationalIdLast4: string;
    patientNationalIdHash?: string | null;
    patientName?: string | null;
    prescriptionId?: string | null;
    prescriberLicenceNo?: string | null;
    pharmacistId: string;
    loggedAt?: Date | string;
};
export type ControlledSubstanceLogEntryUncheckedCreateWithoutDispensingInput = {
    id?: string;
    orgId: string;
    branchId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    patientNationalIdLast4: string;
    patientNationalIdHash?: string | null;
    patientName?: string | null;
    prescriptionId?: string | null;
    prescriberLicenceNo?: string | null;
    pharmacistId: string;
    loggedAt?: Date | string;
};
export type ControlledSubstanceLogEntryCreateOrConnectWithoutDispensingInput = {
    where: Prisma.ControlledSubstanceLogEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.ControlledSubstanceLogEntryCreateWithoutDispensingInput, Prisma.ControlledSubstanceLogEntryUncheckedCreateWithoutDispensingInput>;
};
export type ControlledSubstanceLogEntryCreateManyDispensingInputEnvelope = {
    data: Prisma.ControlledSubstanceLogEntryCreateManyDispensingInput | Prisma.ControlledSubstanceLogEntryCreateManyDispensingInput[];
    skipDuplicates?: boolean;
};
export type ControlledSubstanceLogEntryUpsertWithWhereUniqueWithoutDispensingInput = {
    where: Prisma.ControlledSubstanceLogEntryWhereUniqueInput;
    update: Prisma.XOR<Prisma.ControlledSubstanceLogEntryUpdateWithoutDispensingInput, Prisma.ControlledSubstanceLogEntryUncheckedUpdateWithoutDispensingInput>;
    create: Prisma.XOR<Prisma.ControlledSubstanceLogEntryCreateWithoutDispensingInput, Prisma.ControlledSubstanceLogEntryUncheckedCreateWithoutDispensingInput>;
};
export type ControlledSubstanceLogEntryUpdateWithWhereUniqueWithoutDispensingInput = {
    where: Prisma.ControlledSubstanceLogEntryWhereUniqueInput;
    data: Prisma.XOR<Prisma.ControlledSubstanceLogEntryUpdateWithoutDispensingInput, Prisma.ControlledSubstanceLogEntryUncheckedUpdateWithoutDispensingInput>;
};
export type ControlledSubstanceLogEntryUpdateManyWithWhereWithoutDispensingInput = {
    where: Prisma.ControlledSubstanceLogEntryScalarWhereInput;
    data: Prisma.XOR<Prisma.ControlledSubstanceLogEntryUpdateManyMutationInput, Prisma.ControlledSubstanceLogEntryUncheckedUpdateManyWithoutDispensingInput>;
};
export type ControlledSubstanceLogEntryScalarWhereInput = {
    AND?: Prisma.ControlledSubstanceLogEntryScalarWhereInput | Prisma.ControlledSubstanceLogEntryScalarWhereInput[];
    OR?: Prisma.ControlledSubstanceLogEntryScalarWhereInput[];
    NOT?: Prisma.ControlledSubstanceLogEntryScalarWhereInput | Prisma.ControlledSubstanceLogEntryScalarWhereInput[];
    id?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    orgId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    branchId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    dispensingId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    drugId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    lotId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    quantity?: Prisma.IntFilter<"ControlledSubstanceLogEntry"> | number;
    patientNationalIdLast4?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    patientNationalIdHash?: Prisma.StringNullableFilter<"ControlledSubstanceLogEntry"> | string | null;
    patientName?: Prisma.StringNullableFilter<"ControlledSubstanceLogEntry"> | string | null;
    prescriptionId?: Prisma.StringNullableFilter<"ControlledSubstanceLogEntry"> | string | null;
    prescriberLicenceNo?: Prisma.StringNullableFilter<"ControlledSubstanceLogEntry"> | string | null;
    pharmacistId?: Prisma.StringFilter<"ControlledSubstanceLogEntry"> | string;
    loggedAt?: Prisma.DateTimeFilter<"ControlledSubstanceLogEntry"> | Date | string;
};
export type ControlledSubstanceLogEntryCreateManyDispensingInput = {
    id?: string;
    orgId: string;
    branchId: string;
    drugId: string;
    lotId: string;
    quantity: number;
    patientNationalIdLast4: string;
    patientNationalIdHash?: string | null;
    patientName?: string | null;
    prescriptionId?: string | null;
    prescriberLicenceNo?: string | null;
    pharmacistId: string;
    loggedAt?: Date | string;
};
export type ControlledSubstanceLogEntryUpdateWithoutDispensingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    patientNationalIdLast4?: Prisma.StringFieldUpdateOperationsInput | string;
    patientNationalIdHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    patientName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescriptionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescriberLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pharmacistId?: Prisma.StringFieldUpdateOperationsInput | string;
    loggedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ControlledSubstanceLogEntryUncheckedUpdateWithoutDispensingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    patientNationalIdLast4?: Prisma.StringFieldUpdateOperationsInput | string;
    patientNationalIdHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    patientName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescriptionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescriberLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pharmacistId?: Prisma.StringFieldUpdateOperationsInput | string;
    loggedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ControlledSubstanceLogEntryUncheckedUpdateManyWithoutDispensingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    drugId?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    patientNationalIdLast4?: Prisma.StringFieldUpdateOperationsInput | string;
    patientNationalIdHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    patientName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescriptionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    prescriberLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pharmacistId?: Prisma.StringFieldUpdateOperationsInput | string;
    loggedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ControlledSubstanceLogEntrySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    dispensingId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    patientNationalIdLast4?: boolean;
    patientNationalIdHash?: boolean;
    patientName?: boolean;
    prescriptionId?: boolean;
    prescriberLicenceNo?: boolean;
    pharmacistId?: boolean;
    loggedAt?: boolean;
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["controlledSubstanceLogEntry"]>;
export type ControlledSubstanceLogEntrySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    dispensingId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    patientNationalIdLast4?: boolean;
    patientNationalIdHash?: boolean;
    patientName?: boolean;
    prescriptionId?: boolean;
    prescriberLicenceNo?: boolean;
    pharmacistId?: boolean;
    loggedAt?: boolean;
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["controlledSubstanceLogEntry"]>;
export type ControlledSubstanceLogEntrySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    dispensingId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    patientNationalIdLast4?: boolean;
    patientNationalIdHash?: boolean;
    patientName?: boolean;
    prescriptionId?: boolean;
    prescriberLicenceNo?: boolean;
    pharmacistId?: boolean;
    loggedAt?: boolean;
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["controlledSubstanceLogEntry"]>;
export type ControlledSubstanceLogEntrySelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    dispensingId?: boolean;
    drugId?: boolean;
    lotId?: boolean;
    quantity?: boolean;
    patientNationalIdLast4?: boolean;
    patientNationalIdHash?: boolean;
    patientName?: boolean;
    prescriptionId?: boolean;
    prescriberLicenceNo?: boolean;
    pharmacistId?: boolean;
    loggedAt?: boolean;
};
export type ControlledSubstanceLogEntryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "dispensingId" | "drugId" | "lotId" | "quantity" | "patientNationalIdLast4" | "patientNationalIdHash" | "patientName" | "prescriptionId" | "prescriberLicenceNo" | "pharmacistId" | "loggedAt", ExtArgs["result"]["controlledSubstanceLogEntry"]>;
export type ControlledSubstanceLogEntryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
};
export type ControlledSubstanceLogEntryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
};
export type ControlledSubstanceLogEntryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    dispensing?: boolean | Prisma.DispensingDefaultArgs<ExtArgs>;
};
export type $ControlledSubstanceLogEntryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ControlledSubstanceLogEntry";
    objects: {
        dispensing: Prisma.$DispensingPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        dispensingId: string;
        drugId: string;
        lotId: string;
        quantity: number;
        patientNationalIdLast4: string;
        patientNationalIdHash: string | null;
        patientName: string | null;
        prescriptionId: string | null;
        prescriberLicenceNo: string | null;
        pharmacistId: string;
        loggedAt: Date;
    }, ExtArgs["result"]["controlledSubstanceLogEntry"]>;
    composites: {};
};
export type ControlledSubstanceLogEntryGetPayload<S extends boolean | null | undefined | ControlledSubstanceLogEntryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ControlledSubstanceLogEntryPayload, S>;
export type ControlledSubstanceLogEntryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ControlledSubstanceLogEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ControlledSubstanceLogEntryCountAggregateInputType | true;
};
export interface ControlledSubstanceLogEntryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ControlledSubstanceLogEntry'];
        meta: {
            name: 'ControlledSubstanceLogEntry';
        };
    };
    findUnique<T extends ControlledSubstanceLogEntryFindUniqueArgs>(args: Prisma.SelectSubset<T, ControlledSubstanceLogEntryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ControlledSubstanceLogEntryClient<runtime.Types.Result.GetResult<Prisma.$ControlledSubstanceLogEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ControlledSubstanceLogEntryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ControlledSubstanceLogEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ControlledSubstanceLogEntryClient<runtime.Types.Result.GetResult<Prisma.$ControlledSubstanceLogEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ControlledSubstanceLogEntryFindFirstArgs>(args?: Prisma.SelectSubset<T, ControlledSubstanceLogEntryFindFirstArgs<ExtArgs>>): Prisma.Prisma__ControlledSubstanceLogEntryClient<runtime.Types.Result.GetResult<Prisma.$ControlledSubstanceLogEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ControlledSubstanceLogEntryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ControlledSubstanceLogEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ControlledSubstanceLogEntryClient<runtime.Types.Result.GetResult<Prisma.$ControlledSubstanceLogEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ControlledSubstanceLogEntryFindManyArgs>(args?: Prisma.SelectSubset<T, ControlledSubstanceLogEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ControlledSubstanceLogEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ControlledSubstanceLogEntryCreateArgs>(args: Prisma.SelectSubset<T, ControlledSubstanceLogEntryCreateArgs<ExtArgs>>): Prisma.Prisma__ControlledSubstanceLogEntryClient<runtime.Types.Result.GetResult<Prisma.$ControlledSubstanceLogEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ControlledSubstanceLogEntryCreateManyArgs>(args?: Prisma.SelectSubset<T, ControlledSubstanceLogEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ControlledSubstanceLogEntryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ControlledSubstanceLogEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ControlledSubstanceLogEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ControlledSubstanceLogEntryDeleteArgs>(args: Prisma.SelectSubset<T, ControlledSubstanceLogEntryDeleteArgs<ExtArgs>>): Prisma.Prisma__ControlledSubstanceLogEntryClient<runtime.Types.Result.GetResult<Prisma.$ControlledSubstanceLogEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ControlledSubstanceLogEntryUpdateArgs>(args: Prisma.SelectSubset<T, ControlledSubstanceLogEntryUpdateArgs<ExtArgs>>): Prisma.Prisma__ControlledSubstanceLogEntryClient<runtime.Types.Result.GetResult<Prisma.$ControlledSubstanceLogEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ControlledSubstanceLogEntryDeleteManyArgs>(args?: Prisma.SelectSubset<T, ControlledSubstanceLogEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ControlledSubstanceLogEntryUpdateManyArgs>(args: Prisma.SelectSubset<T, ControlledSubstanceLogEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ControlledSubstanceLogEntryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ControlledSubstanceLogEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ControlledSubstanceLogEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ControlledSubstanceLogEntryUpsertArgs>(args: Prisma.SelectSubset<T, ControlledSubstanceLogEntryUpsertArgs<ExtArgs>>): Prisma.Prisma__ControlledSubstanceLogEntryClient<runtime.Types.Result.GetResult<Prisma.$ControlledSubstanceLogEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ControlledSubstanceLogEntryCountArgs>(args?: Prisma.Subset<T, ControlledSubstanceLogEntryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ControlledSubstanceLogEntryCountAggregateOutputType> : number>;
    aggregate<T extends ControlledSubstanceLogEntryAggregateArgs>(args: Prisma.Subset<T, ControlledSubstanceLogEntryAggregateArgs>): Prisma.PrismaPromise<GetControlledSubstanceLogEntryAggregateType<T>>;
    groupBy<T extends ControlledSubstanceLogEntryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ControlledSubstanceLogEntryGroupByArgs['orderBy'];
    } : {
        orderBy?: ControlledSubstanceLogEntryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ControlledSubstanceLogEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetControlledSubstanceLogEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ControlledSubstanceLogEntryFieldRefs;
}
export interface Prisma__ControlledSubstanceLogEntryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    dispensing<T extends Prisma.DispensingDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DispensingDefaultArgs<ExtArgs>>): Prisma.Prisma__DispensingClient<runtime.Types.Result.GetResult<Prisma.$DispensingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ControlledSubstanceLogEntryFieldRefs {
    readonly id: Prisma.FieldRef<"ControlledSubstanceLogEntry", 'String'>;
    readonly orgId: Prisma.FieldRef<"ControlledSubstanceLogEntry", 'String'>;
    readonly branchId: Prisma.FieldRef<"ControlledSubstanceLogEntry", 'String'>;
    readonly dispensingId: Prisma.FieldRef<"ControlledSubstanceLogEntry", 'String'>;
    readonly drugId: Prisma.FieldRef<"ControlledSubstanceLogEntry", 'String'>;
    readonly lotId: Prisma.FieldRef<"ControlledSubstanceLogEntry", 'String'>;
    readonly quantity: Prisma.FieldRef<"ControlledSubstanceLogEntry", 'Int'>;
    readonly patientNationalIdLast4: Prisma.FieldRef<"ControlledSubstanceLogEntry", 'String'>;
    readonly patientNationalIdHash: Prisma.FieldRef<"ControlledSubstanceLogEntry", 'String'>;
    readonly patientName: Prisma.FieldRef<"ControlledSubstanceLogEntry", 'String'>;
    readonly prescriptionId: Prisma.FieldRef<"ControlledSubstanceLogEntry", 'String'>;
    readonly prescriberLicenceNo: Prisma.FieldRef<"ControlledSubstanceLogEntry", 'String'>;
    readonly pharmacistId: Prisma.FieldRef<"ControlledSubstanceLogEntry", 'String'>;
    readonly loggedAt: Prisma.FieldRef<"ControlledSubstanceLogEntry", 'DateTime'>;
}
export type ControlledSubstanceLogEntryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledSubstanceLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.ControlledSubstanceLogEntryOmit<ExtArgs> | null;
    include?: Prisma.ControlledSubstanceLogEntryInclude<ExtArgs> | null;
    where: Prisma.ControlledSubstanceLogEntryWhereUniqueInput;
};
export type ControlledSubstanceLogEntryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledSubstanceLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.ControlledSubstanceLogEntryOmit<ExtArgs> | null;
    include?: Prisma.ControlledSubstanceLogEntryInclude<ExtArgs> | null;
    where: Prisma.ControlledSubstanceLogEntryWhereUniqueInput;
};
export type ControlledSubstanceLogEntryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledSubstanceLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.ControlledSubstanceLogEntryOmit<ExtArgs> | null;
    include?: Prisma.ControlledSubstanceLogEntryInclude<ExtArgs> | null;
    where?: Prisma.ControlledSubstanceLogEntryWhereInput;
    orderBy?: Prisma.ControlledSubstanceLogEntryOrderByWithRelationInput | Prisma.ControlledSubstanceLogEntryOrderByWithRelationInput[];
    cursor?: Prisma.ControlledSubstanceLogEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ControlledSubstanceLogEntryScalarFieldEnum | Prisma.ControlledSubstanceLogEntryScalarFieldEnum[];
};
export type ControlledSubstanceLogEntryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledSubstanceLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.ControlledSubstanceLogEntryOmit<ExtArgs> | null;
    include?: Prisma.ControlledSubstanceLogEntryInclude<ExtArgs> | null;
    where?: Prisma.ControlledSubstanceLogEntryWhereInput;
    orderBy?: Prisma.ControlledSubstanceLogEntryOrderByWithRelationInput | Prisma.ControlledSubstanceLogEntryOrderByWithRelationInput[];
    cursor?: Prisma.ControlledSubstanceLogEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ControlledSubstanceLogEntryScalarFieldEnum | Prisma.ControlledSubstanceLogEntryScalarFieldEnum[];
};
export type ControlledSubstanceLogEntryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledSubstanceLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.ControlledSubstanceLogEntryOmit<ExtArgs> | null;
    include?: Prisma.ControlledSubstanceLogEntryInclude<ExtArgs> | null;
    where?: Prisma.ControlledSubstanceLogEntryWhereInput;
    orderBy?: Prisma.ControlledSubstanceLogEntryOrderByWithRelationInput | Prisma.ControlledSubstanceLogEntryOrderByWithRelationInput[];
    cursor?: Prisma.ControlledSubstanceLogEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ControlledSubstanceLogEntryScalarFieldEnum | Prisma.ControlledSubstanceLogEntryScalarFieldEnum[];
};
export type ControlledSubstanceLogEntryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledSubstanceLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.ControlledSubstanceLogEntryOmit<ExtArgs> | null;
    include?: Prisma.ControlledSubstanceLogEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ControlledSubstanceLogEntryCreateInput, Prisma.ControlledSubstanceLogEntryUncheckedCreateInput>;
};
export type ControlledSubstanceLogEntryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ControlledSubstanceLogEntryCreateManyInput | Prisma.ControlledSubstanceLogEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ControlledSubstanceLogEntryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledSubstanceLogEntrySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ControlledSubstanceLogEntryOmit<ExtArgs> | null;
    data: Prisma.ControlledSubstanceLogEntryCreateManyInput | Prisma.ControlledSubstanceLogEntryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ControlledSubstanceLogEntryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ControlledSubstanceLogEntryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledSubstanceLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.ControlledSubstanceLogEntryOmit<ExtArgs> | null;
    include?: Prisma.ControlledSubstanceLogEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ControlledSubstanceLogEntryUpdateInput, Prisma.ControlledSubstanceLogEntryUncheckedUpdateInput>;
    where: Prisma.ControlledSubstanceLogEntryWhereUniqueInput;
};
export type ControlledSubstanceLogEntryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ControlledSubstanceLogEntryUpdateManyMutationInput, Prisma.ControlledSubstanceLogEntryUncheckedUpdateManyInput>;
    where?: Prisma.ControlledSubstanceLogEntryWhereInput;
    limit?: number;
};
export type ControlledSubstanceLogEntryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledSubstanceLogEntrySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ControlledSubstanceLogEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ControlledSubstanceLogEntryUpdateManyMutationInput, Prisma.ControlledSubstanceLogEntryUncheckedUpdateManyInput>;
    where?: Prisma.ControlledSubstanceLogEntryWhereInput;
    limit?: number;
    include?: Prisma.ControlledSubstanceLogEntryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ControlledSubstanceLogEntryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledSubstanceLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.ControlledSubstanceLogEntryOmit<ExtArgs> | null;
    include?: Prisma.ControlledSubstanceLogEntryInclude<ExtArgs> | null;
    where: Prisma.ControlledSubstanceLogEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.ControlledSubstanceLogEntryCreateInput, Prisma.ControlledSubstanceLogEntryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ControlledSubstanceLogEntryUpdateInput, Prisma.ControlledSubstanceLogEntryUncheckedUpdateInput>;
};
export type ControlledSubstanceLogEntryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledSubstanceLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.ControlledSubstanceLogEntryOmit<ExtArgs> | null;
    include?: Prisma.ControlledSubstanceLogEntryInclude<ExtArgs> | null;
    where: Prisma.ControlledSubstanceLogEntryWhereUniqueInput;
};
export type ControlledSubstanceLogEntryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ControlledSubstanceLogEntryWhereInput;
    limit?: number;
};
export type ControlledSubstanceLogEntryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledSubstanceLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.ControlledSubstanceLogEntryOmit<ExtArgs> | null;
    include?: Prisma.ControlledSubstanceLogEntryInclude<ExtArgs> | null;
};
