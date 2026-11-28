import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type TenantModel = runtime.Types.Result.DefaultSelection<Prisma.$TenantPayload>;
export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null;
    _min: TenantMinAggregateOutputType | null;
    _max: TenantMaxAggregateOutputType | null;
};
export type TenantMinAggregateOutputType = {
    id: string | null;
    externalOrgId: string | null;
    name: string | null;
    edition: $Enums.Edition | null;
    marketCode: string | null;
    subscriptionStatus: string | null;
    defaultSignInMethod: $Enums.SignInMethod | null;
    onboardedAt: Date | null;
    createdAt: Date | null;
};
export type TenantMaxAggregateOutputType = {
    id: string | null;
    externalOrgId: string | null;
    name: string | null;
    edition: $Enums.Edition | null;
    marketCode: string | null;
    subscriptionStatus: string | null;
    defaultSignInMethod: $Enums.SignInMethod | null;
    onboardedAt: Date | null;
    createdAt: Date | null;
};
export type TenantCountAggregateOutputType = {
    id: number;
    externalOrgId: number;
    name: number;
    edition: number;
    marketCode: number;
    subscriptionStatus: number;
    defaultSignInMethod: number;
    settings: number;
    onboardedAt: number;
    createdAt: number;
    _all: number;
};
export type TenantMinAggregateInputType = {
    id?: true;
    externalOrgId?: true;
    name?: true;
    edition?: true;
    marketCode?: true;
    subscriptionStatus?: true;
    defaultSignInMethod?: true;
    onboardedAt?: true;
    createdAt?: true;
};
export type TenantMaxAggregateInputType = {
    id?: true;
    externalOrgId?: true;
    name?: true;
    edition?: true;
    marketCode?: true;
    subscriptionStatus?: true;
    defaultSignInMethod?: true;
    onboardedAt?: true;
    createdAt?: true;
};
export type TenantCountAggregateInputType = {
    id?: true;
    externalOrgId?: true;
    name?: true;
    edition?: true;
    marketCode?: true;
    subscriptionStatus?: true;
    defaultSignInMethod?: true;
    settings?: true;
    onboardedAt?: true;
    createdAt?: true;
    _all?: true;
};
export type TenantAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput | Prisma.TenantOrderByWithRelationInput[];
    cursor?: Prisma.TenantWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TenantCountAggregateInputType;
    _min?: TenantMinAggregateInputType;
    _max?: TenantMaxAggregateInputType;
};
export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
    [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTenant[P]> : Prisma.GetScalarType<T[P], AggregateTenant[P]>;
};
export type TenantGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithAggregationInput | Prisma.TenantOrderByWithAggregationInput[];
    by: Prisma.TenantScalarFieldEnum[] | Prisma.TenantScalarFieldEnum;
    having?: Prisma.TenantScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TenantCountAggregateInputType | true;
    _min?: TenantMinAggregateInputType;
    _max?: TenantMaxAggregateInputType;
};
export type TenantGroupByOutputType = {
    id: string;
    externalOrgId: string | null;
    name: string;
    edition: $Enums.Edition;
    marketCode: string;
    subscriptionStatus: string;
    defaultSignInMethod: $Enums.SignInMethod | null;
    settings: runtime.JsonValue | null;
    onboardedAt: Date | null;
    createdAt: Date;
    _count: TenantCountAggregateOutputType | null;
    _min: TenantMinAggregateOutputType | null;
    _max: TenantMaxAggregateOutputType | null;
};
export type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TenantGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TenantGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TenantGroupByOutputType[P]>;
}>>;
export type TenantWhereInput = {
    AND?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    OR?: Prisma.TenantWhereInput[];
    NOT?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    id?: Prisma.StringFilter<"Tenant"> | string;
    externalOrgId?: Prisma.StringNullableFilter<"Tenant"> | string | null;
    name?: Prisma.StringFilter<"Tenant"> | string;
    edition?: Prisma.EnumEditionFilter<"Tenant"> | $Enums.Edition;
    marketCode?: Prisma.StringFilter<"Tenant"> | string;
    subscriptionStatus?: Prisma.StringFilter<"Tenant"> | string;
    defaultSignInMethod?: Prisma.EnumSignInMethodNullableFilter<"Tenant"> | $Enums.SignInMethod | null;
    settings?: Prisma.JsonNullableFilter<"Tenant">;
    onboardedAt?: Prisma.DateTimeNullableFilter<"Tenant"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    branches?: Prisma.BranchListRelationFilter;
    staff?: Prisma.StaffUserListRelationFilter;
    kiorexCommissionRateView?: Prisma.XOR<Prisma.KiorexCommissionRateViewNullableScalarRelationFilter, Prisma.KiorexCommissionRateViewWhereInput> | null;
};
export type TenantOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    externalOrgId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    edition?: Prisma.SortOrder;
    marketCode?: Prisma.SortOrder;
    subscriptionStatus?: Prisma.SortOrder;
    defaultSignInMethod?: Prisma.SortOrderInput | Prisma.SortOrder;
    settings?: Prisma.SortOrderInput | Prisma.SortOrder;
    onboardedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    branches?: Prisma.BranchOrderByRelationAggregateInput;
    staff?: Prisma.StaffUserOrderByRelationAggregateInput;
    kiorexCommissionRateView?: Prisma.KiorexCommissionRateViewOrderByWithRelationInput;
};
export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    externalOrgId?: string;
    AND?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    OR?: Prisma.TenantWhereInput[];
    NOT?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    name?: Prisma.StringFilter<"Tenant"> | string;
    edition?: Prisma.EnumEditionFilter<"Tenant"> | $Enums.Edition;
    marketCode?: Prisma.StringFilter<"Tenant"> | string;
    subscriptionStatus?: Prisma.StringFilter<"Tenant"> | string;
    defaultSignInMethod?: Prisma.EnumSignInMethodNullableFilter<"Tenant"> | $Enums.SignInMethod | null;
    settings?: Prisma.JsonNullableFilter<"Tenant">;
    onboardedAt?: Prisma.DateTimeNullableFilter<"Tenant"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    branches?: Prisma.BranchListRelationFilter;
    staff?: Prisma.StaffUserListRelationFilter;
    kiorexCommissionRateView?: Prisma.XOR<Prisma.KiorexCommissionRateViewNullableScalarRelationFilter, Prisma.KiorexCommissionRateViewWhereInput> | null;
}, "id" | "externalOrgId">;
export type TenantOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    externalOrgId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    edition?: Prisma.SortOrder;
    marketCode?: Prisma.SortOrder;
    subscriptionStatus?: Prisma.SortOrder;
    defaultSignInMethod?: Prisma.SortOrderInput | Prisma.SortOrder;
    settings?: Prisma.SortOrderInput | Prisma.SortOrder;
    onboardedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.TenantCountOrderByAggregateInput;
    _max?: Prisma.TenantMaxOrderByAggregateInput;
    _min?: Prisma.TenantMinOrderByAggregateInput;
};
export type TenantScalarWhereWithAggregatesInput = {
    AND?: Prisma.TenantScalarWhereWithAggregatesInput | Prisma.TenantScalarWhereWithAggregatesInput[];
    OR?: Prisma.TenantScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TenantScalarWhereWithAggregatesInput | Prisma.TenantScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Tenant"> | string;
    externalOrgId?: Prisma.StringNullableWithAggregatesFilter<"Tenant"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"Tenant"> | string;
    edition?: Prisma.EnumEditionWithAggregatesFilter<"Tenant"> | $Enums.Edition;
    marketCode?: Prisma.StringWithAggregatesFilter<"Tenant"> | string;
    subscriptionStatus?: Prisma.StringWithAggregatesFilter<"Tenant"> | string;
    defaultSignInMethod?: Prisma.EnumSignInMethodNullableWithAggregatesFilter<"Tenant"> | $Enums.SignInMethod | null;
    settings?: Prisma.JsonNullableWithAggregatesFilter<"Tenant">;
    onboardedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Tenant"> | Date | string;
};
export type TenantCreateInput = {
    id?: string;
    externalOrgId?: string | null;
    name: string;
    edition?: $Enums.Edition;
    marketCode?: string;
    subscriptionStatus?: string;
    defaultSignInMethod?: $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Date | string | null;
    createdAt?: Date | string;
    branches?: Prisma.BranchCreateNestedManyWithoutTenantInput;
    staff?: Prisma.StaffUserCreateNestedManyWithoutTenantInput;
    kiorexCommissionRateView?: Prisma.KiorexCommissionRateViewCreateNestedOneWithoutTenantInput;
};
export type TenantUncheckedCreateInput = {
    id?: string;
    externalOrgId?: string | null;
    name: string;
    edition?: $Enums.Edition;
    marketCode?: string;
    subscriptionStatus?: string;
    defaultSignInMethod?: $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Date | string | null;
    createdAt?: Date | string;
    branches?: Prisma.BranchUncheckedCreateNestedManyWithoutTenantInput;
    staff?: Prisma.StaffUserUncheckedCreateNestedManyWithoutTenantInput;
    kiorexCommissionRateView?: Prisma.KiorexCommissionRateViewUncheckedCreateNestedOneWithoutTenantInput;
};
export type TenantUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    externalOrgId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.EnumEditionFieldUpdateOperationsInput | $Enums.Edition;
    marketCode?: Prisma.StringFieldUpdateOperationsInput | string;
    subscriptionStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    defaultSignInMethod?: Prisma.NullableEnumSignInMethodFieldUpdateOperationsInput | $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branches?: Prisma.BranchUpdateManyWithoutTenantNestedInput;
    staff?: Prisma.StaffUserUpdateManyWithoutTenantNestedInput;
    kiorexCommissionRateView?: Prisma.KiorexCommissionRateViewUpdateOneWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    externalOrgId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.EnumEditionFieldUpdateOperationsInput | $Enums.Edition;
    marketCode?: Prisma.StringFieldUpdateOperationsInput | string;
    subscriptionStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    defaultSignInMethod?: Prisma.NullableEnumSignInMethodFieldUpdateOperationsInput | $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branches?: Prisma.BranchUncheckedUpdateManyWithoutTenantNestedInput;
    staff?: Prisma.StaffUserUncheckedUpdateManyWithoutTenantNestedInput;
    kiorexCommissionRateView?: Prisma.KiorexCommissionRateViewUncheckedUpdateOneWithoutTenantNestedInput;
};
export type TenantCreateManyInput = {
    id?: string;
    externalOrgId?: string | null;
    name: string;
    edition?: $Enums.Edition;
    marketCode?: string;
    subscriptionStatus?: string;
    defaultSignInMethod?: $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type TenantUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    externalOrgId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.EnumEditionFieldUpdateOperationsInput | $Enums.Edition;
    marketCode?: Prisma.StringFieldUpdateOperationsInput | string;
    subscriptionStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    defaultSignInMethod?: Prisma.NullableEnumSignInMethodFieldUpdateOperationsInput | $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TenantUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    externalOrgId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.EnumEditionFieldUpdateOperationsInput | $Enums.Edition;
    marketCode?: Prisma.StringFieldUpdateOperationsInput | string;
    subscriptionStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    defaultSignInMethod?: Prisma.NullableEnumSignInMethodFieldUpdateOperationsInput | $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TenantCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    externalOrgId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    edition?: Prisma.SortOrder;
    marketCode?: Prisma.SortOrder;
    subscriptionStatus?: Prisma.SortOrder;
    defaultSignInMethod?: Prisma.SortOrder;
    settings?: Prisma.SortOrder;
    onboardedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TenantMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    externalOrgId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    edition?: Prisma.SortOrder;
    marketCode?: Prisma.SortOrder;
    subscriptionStatus?: Prisma.SortOrder;
    defaultSignInMethod?: Prisma.SortOrder;
    onboardedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TenantMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    externalOrgId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    edition?: Prisma.SortOrder;
    marketCode?: Prisma.SortOrder;
    subscriptionStatus?: Prisma.SortOrder;
    defaultSignInMethod?: Prisma.SortOrder;
    onboardedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TenantScalarRelationFilter = {
    is?: Prisma.TenantWhereInput;
    isNot?: Prisma.TenantWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type EnumEditionFieldUpdateOperationsInput = {
    set?: $Enums.Edition;
};
export type NullableEnumSignInMethodFieldUpdateOperationsInput = {
    set?: $Enums.SignInMethod | null;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type TenantCreateNestedOneWithoutBranchesInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutBranchesInput, Prisma.TenantUncheckedCreateWithoutBranchesInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutBranchesInput;
    connect?: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateOneRequiredWithoutBranchesNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutBranchesInput, Prisma.TenantUncheckedCreateWithoutBranchesInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutBranchesInput;
    upsert?: Prisma.TenantUpsertWithoutBranchesInput;
    connect?: Prisma.TenantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TenantUpdateToOneWithWhereWithoutBranchesInput, Prisma.TenantUpdateWithoutBranchesInput>, Prisma.TenantUncheckedUpdateWithoutBranchesInput>;
};
export type TenantCreateNestedOneWithoutStaffInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutStaffInput, Prisma.TenantUncheckedCreateWithoutStaffInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutStaffInput;
    connect?: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateOneRequiredWithoutStaffNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutStaffInput, Prisma.TenantUncheckedCreateWithoutStaffInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutStaffInput;
    upsert?: Prisma.TenantUpsertWithoutStaffInput;
    connect?: Prisma.TenantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TenantUpdateToOneWithWhereWithoutStaffInput, Prisma.TenantUpdateWithoutStaffInput>, Prisma.TenantUncheckedUpdateWithoutStaffInput>;
};
export type TenantCreateNestedOneWithoutKiorexCommissionRateViewInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutKiorexCommissionRateViewInput, Prisma.TenantUncheckedCreateWithoutKiorexCommissionRateViewInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutKiorexCommissionRateViewInput;
    connect?: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateOneRequiredWithoutKiorexCommissionRateViewNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutKiorexCommissionRateViewInput, Prisma.TenantUncheckedCreateWithoutKiorexCommissionRateViewInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutKiorexCommissionRateViewInput;
    upsert?: Prisma.TenantUpsertWithoutKiorexCommissionRateViewInput;
    connect?: Prisma.TenantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TenantUpdateToOneWithWhereWithoutKiorexCommissionRateViewInput, Prisma.TenantUpdateWithoutKiorexCommissionRateViewInput>, Prisma.TenantUncheckedUpdateWithoutKiorexCommissionRateViewInput>;
};
export type TenantCreateWithoutBranchesInput = {
    id?: string;
    externalOrgId?: string | null;
    name: string;
    edition?: $Enums.Edition;
    marketCode?: string;
    subscriptionStatus?: string;
    defaultSignInMethod?: $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Date | string | null;
    createdAt?: Date | string;
    staff?: Prisma.StaffUserCreateNestedManyWithoutTenantInput;
    kiorexCommissionRateView?: Prisma.KiorexCommissionRateViewCreateNestedOneWithoutTenantInput;
};
export type TenantUncheckedCreateWithoutBranchesInput = {
    id?: string;
    externalOrgId?: string | null;
    name: string;
    edition?: $Enums.Edition;
    marketCode?: string;
    subscriptionStatus?: string;
    defaultSignInMethod?: $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Date | string | null;
    createdAt?: Date | string;
    staff?: Prisma.StaffUserUncheckedCreateNestedManyWithoutTenantInput;
    kiorexCommissionRateView?: Prisma.KiorexCommissionRateViewUncheckedCreateNestedOneWithoutTenantInput;
};
export type TenantCreateOrConnectWithoutBranchesInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutBranchesInput, Prisma.TenantUncheckedCreateWithoutBranchesInput>;
};
export type TenantUpsertWithoutBranchesInput = {
    update: Prisma.XOR<Prisma.TenantUpdateWithoutBranchesInput, Prisma.TenantUncheckedUpdateWithoutBranchesInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutBranchesInput, Prisma.TenantUncheckedCreateWithoutBranchesInput>;
    where?: Prisma.TenantWhereInput;
};
export type TenantUpdateToOneWithWhereWithoutBranchesInput = {
    where?: Prisma.TenantWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutBranchesInput, Prisma.TenantUncheckedUpdateWithoutBranchesInput>;
};
export type TenantUpdateWithoutBranchesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    externalOrgId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.EnumEditionFieldUpdateOperationsInput | $Enums.Edition;
    marketCode?: Prisma.StringFieldUpdateOperationsInput | string;
    subscriptionStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    defaultSignInMethod?: Prisma.NullableEnumSignInMethodFieldUpdateOperationsInput | $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    staff?: Prisma.StaffUserUpdateManyWithoutTenantNestedInput;
    kiorexCommissionRateView?: Prisma.KiorexCommissionRateViewUpdateOneWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateWithoutBranchesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    externalOrgId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.EnumEditionFieldUpdateOperationsInput | $Enums.Edition;
    marketCode?: Prisma.StringFieldUpdateOperationsInput | string;
    subscriptionStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    defaultSignInMethod?: Prisma.NullableEnumSignInMethodFieldUpdateOperationsInput | $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    staff?: Prisma.StaffUserUncheckedUpdateManyWithoutTenantNestedInput;
    kiorexCommissionRateView?: Prisma.KiorexCommissionRateViewUncheckedUpdateOneWithoutTenantNestedInput;
};
export type TenantCreateWithoutStaffInput = {
    id?: string;
    externalOrgId?: string | null;
    name: string;
    edition?: $Enums.Edition;
    marketCode?: string;
    subscriptionStatus?: string;
    defaultSignInMethod?: $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Date | string | null;
    createdAt?: Date | string;
    branches?: Prisma.BranchCreateNestedManyWithoutTenantInput;
    kiorexCommissionRateView?: Prisma.KiorexCommissionRateViewCreateNestedOneWithoutTenantInput;
};
export type TenantUncheckedCreateWithoutStaffInput = {
    id?: string;
    externalOrgId?: string | null;
    name: string;
    edition?: $Enums.Edition;
    marketCode?: string;
    subscriptionStatus?: string;
    defaultSignInMethod?: $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Date | string | null;
    createdAt?: Date | string;
    branches?: Prisma.BranchUncheckedCreateNestedManyWithoutTenantInput;
    kiorexCommissionRateView?: Prisma.KiorexCommissionRateViewUncheckedCreateNestedOneWithoutTenantInput;
};
export type TenantCreateOrConnectWithoutStaffInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutStaffInput, Prisma.TenantUncheckedCreateWithoutStaffInput>;
};
export type TenantUpsertWithoutStaffInput = {
    update: Prisma.XOR<Prisma.TenantUpdateWithoutStaffInput, Prisma.TenantUncheckedUpdateWithoutStaffInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutStaffInput, Prisma.TenantUncheckedCreateWithoutStaffInput>;
    where?: Prisma.TenantWhereInput;
};
export type TenantUpdateToOneWithWhereWithoutStaffInput = {
    where?: Prisma.TenantWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutStaffInput, Prisma.TenantUncheckedUpdateWithoutStaffInput>;
};
export type TenantUpdateWithoutStaffInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    externalOrgId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.EnumEditionFieldUpdateOperationsInput | $Enums.Edition;
    marketCode?: Prisma.StringFieldUpdateOperationsInput | string;
    subscriptionStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    defaultSignInMethod?: Prisma.NullableEnumSignInMethodFieldUpdateOperationsInput | $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branches?: Prisma.BranchUpdateManyWithoutTenantNestedInput;
    kiorexCommissionRateView?: Prisma.KiorexCommissionRateViewUpdateOneWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateWithoutStaffInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    externalOrgId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.EnumEditionFieldUpdateOperationsInput | $Enums.Edition;
    marketCode?: Prisma.StringFieldUpdateOperationsInput | string;
    subscriptionStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    defaultSignInMethod?: Prisma.NullableEnumSignInMethodFieldUpdateOperationsInput | $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branches?: Prisma.BranchUncheckedUpdateManyWithoutTenantNestedInput;
    kiorexCommissionRateView?: Prisma.KiorexCommissionRateViewUncheckedUpdateOneWithoutTenantNestedInput;
};
export type TenantCreateWithoutKiorexCommissionRateViewInput = {
    id?: string;
    externalOrgId?: string | null;
    name: string;
    edition?: $Enums.Edition;
    marketCode?: string;
    subscriptionStatus?: string;
    defaultSignInMethod?: $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Date | string | null;
    createdAt?: Date | string;
    branches?: Prisma.BranchCreateNestedManyWithoutTenantInput;
    staff?: Prisma.StaffUserCreateNestedManyWithoutTenantInput;
};
export type TenantUncheckedCreateWithoutKiorexCommissionRateViewInput = {
    id?: string;
    externalOrgId?: string | null;
    name: string;
    edition?: $Enums.Edition;
    marketCode?: string;
    subscriptionStatus?: string;
    defaultSignInMethod?: $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Date | string | null;
    createdAt?: Date | string;
    branches?: Prisma.BranchUncheckedCreateNestedManyWithoutTenantInput;
    staff?: Prisma.StaffUserUncheckedCreateNestedManyWithoutTenantInput;
};
export type TenantCreateOrConnectWithoutKiorexCommissionRateViewInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutKiorexCommissionRateViewInput, Prisma.TenantUncheckedCreateWithoutKiorexCommissionRateViewInput>;
};
export type TenantUpsertWithoutKiorexCommissionRateViewInput = {
    update: Prisma.XOR<Prisma.TenantUpdateWithoutKiorexCommissionRateViewInput, Prisma.TenantUncheckedUpdateWithoutKiorexCommissionRateViewInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutKiorexCommissionRateViewInput, Prisma.TenantUncheckedCreateWithoutKiorexCommissionRateViewInput>;
    where?: Prisma.TenantWhereInput;
};
export type TenantUpdateToOneWithWhereWithoutKiorexCommissionRateViewInput = {
    where?: Prisma.TenantWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutKiorexCommissionRateViewInput, Prisma.TenantUncheckedUpdateWithoutKiorexCommissionRateViewInput>;
};
export type TenantUpdateWithoutKiorexCommissionRateViewInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    externalOrgId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.EnumEditionFieldUpdateOperationsInput | $Enums.Edition;
    marketCode?: Prisma.StringFieldUpdateOperationsInput | string;
    subscriptionStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    defaultSignInMethod?: Prisma.NullableEnumSignInMethodFieldUpdateOperationsInput | $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branches?: Prisma.BranchUpdateManyWithoutTenantNestedInput;
    staff?: Prisma.StaffUserUpdateManyWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateWithoutKiorexCommissionRateViewInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    externalOrgId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.EnumEditionFieldUpdateOperationsInput | $Enums.Edition;
    marketCode?: Prisma.StringFieldUpdateOperationsInput | string;
    subscriptionStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    defaultSignInMethod?: Prisma.NullableEnumSignInMethodFieldUpdateOperationsInput | $Enums.SignInMethod | null;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    onboardedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branches?: Prisma.BranchUncheckedUpdateManyWithoutTenantNestedInput;
    staff?: Prisma.StaffUserUncheckedUpdateManyWithoutTenantNestedInput;
};
export type TenantCountOutputType = {
    branches: number;
    staff: number;
};
export type TenantCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branches?: boolean | TenantCountOutputTypeCountBranchesArgs;
    staff?: boolean | TenantCountOutputTypeCountStaffArgs;
};
export type TenantCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantCountOutputTypeSelect<ExtArgs> | null;
};
export type TenantCountOutputTypeCountBranchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BranchWhereInput;
};
export type TenantCountOutputTypeCountStaffArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StaffUserWhereInput;
};
export type TenantSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    externalOrgId?: boolean;
    name?: boolean;
    edition?: boolean;
    marketCode?: boolean;
    subscriptionStatus?: boolean;
    defaultSignInMethod?: boolean;
    settings?: boolean;
    onboardedAt?: boolean;
    createdAt?: boolean;
    branches?: boolean | Prisma.Tenant$branchesArgs<ExtArgs>;
    staff?: boolean | Prisma.Tenant$staffArgs<ExtArgs>;
    kiorexCommissionRateView?: boolean | Prisma.Tenant$kiorexCommissionRateViewArgs<ExtArgs>;
    _count?: boolean | Prisma.TenantCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tenant"]>;
export type TenantSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    externalOrgId?: boolean;
    name?: boolean;
    edition?: boolean;
    marketCode?: boolean;
    subscriptionStatus?: boolean;
    defaultSignInMethod?: boolean;
    settings?: boolean;
    onboardedAt?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["tenant"]>;
export type TenantSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    externalOrgId?: boolean;
    name?: boolean;
    edition?: boolean;
    marketCode?: boolean;
    subscriptionStatus?: boolean;
    defaultSignInMethod?: boolean;
    settings?: boolean;
    onboardedAt?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["tenant"]>;
export type TenantSelectScalar = {
    id?: boolean;
    externalOrgId?: boolean;
    name?: boolean;
    edition?: boolean;
    marketCode?: boolean;
    subscriptionStatus?: boolean;
    defaultSignInMethod?: boolean;
    settings?: boolean;
    onboardedAt?: boolean;
    createdAt?: boolean;
};
export type TenantOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "externalOrgId" | "name" | "edition" | "marketCode" | "subscriptionStatus" | "defaultSignInMethod" | "settings" | "onboardedAt" | "createdAt", ExtArgs["result"]["tenant"]>;
export type TenantInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branches?: boolean | Prisma.Tenant$branchesArgs<ExtArgs>;
    staff?: boolean | Prisma.Tenant$staffArgs<ExtArgs>;
    kiorexCommissionRateView?: boolean | Prisma.Tenant$kiorexCommissionRateViewArgs<ExtArgs>;
    _count?: boolean | Prisma.TenantCountOutputTypeDefaultArgs<ExtArgs>;
};
export type TenantIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type TenantIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $TenantPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Tenant";
    objects: {
        branches: Prisma.$BranchPayload<ExtArgs>[];
        staff: Prisma.$StaffUserPayload<ExtArgs>[];
        kiorexCommissionRateView: Prisma.$KiorexCommissionRateViewPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        externalOrgId: string | null;
        name: string;
        edition: $Enums.Edition;
        marketCode: string;
        subscriptionStatus: string;
        defaultSignInMethod: $Enums.SignInMethod | null;
        settings: runtime.JsonValue | null;
        onboardedAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["tenant"]>;
    composites: {};
};
export type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TenantPayload, S>;
export type TenantCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TenantCountAggregateInputType | true;
};
export interface TenantDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Tenant'];
        meta: {
            name: 'Tenant';
        };
    };
    findUnique<T extends TenantFindUniqueArgs>(args: Prisma.SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TenantFindFirstArgs>(args?: Prisma.SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TenantFindManyArgs>(args?: Prisma.SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TenantCreateArgs>(args: Prisma.SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TenantCreateManyArgs>(args?: Prisma.SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TenantDeleteArgs>(args: Prisma.SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TenantUpdateArgs>(args: Prisma.SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TenantDeleteManyArgs>(args?: Prisma.SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TenantUpdateManyArgs>(args: Prisma.SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TenantUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TenantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TenantUpsertArgs>(args: Prisma.SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TenantCountArgs>(args?: Prisma.Subset<T, TenantCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TenantCountAggregateOutputType> : number>;
    aggregate<T extends TenantAggregateArgs>(args: Prisma.Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>;
    groupBy<T extends TenantGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TenantGroupByArgs['orderBy'];
    } : {
        orderBy?: TenantGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TenantFieldRefs;
}
export interface Prisma__TenantClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    branches<T extends Prisma.Tenant$branchesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tenant$branchesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    staff<T extends Prisma.Tenant$staffArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tenant$staffArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StaffUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    kiorexCommissionRateView<T extends Prisma.Tenant$kiorexCommissionRateViewArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tenant$kiorexCommissionRateViewArgs<ExtArgs>>): Prisma.Prisma__KiorexCommissionRateViewClient<runtime.Types.Result.GetResult<Prisma.$KiorexCommissionRateViewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TenantFieldRefs {
    readonly id: Prisma.FieldRef<"Tenant", 'String'>;
    readonly externalOrgId: Prisma.FieldRef<"Tenant", 'String'>;
    readonly name: Prisma.FieldRef<"Tenant", 'String'>;
    readonly edition: Prisma.FieldRef<"Tenant", 'Edition'>;
    readonly marketCode: Prisma.FieldRef<"Tenant", 'String'>;
    readonly subscriptionStatus: Prisma.FieldRef<"Tenant", 'String'>;
    readonly defaultSignInMethod: Prisma.FieldRef<"Tenant", 'SignInMethod'>;
    readonly settings: Prisma.FieldRef<"Tenant", 'Json'>;
    readonly onboardedAt: Prisma.FieldRef<"Tenant", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Tenant", 'DateTime'>;
}
export type TenantFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput | Prisma.TenantOrderByWithRelationInput[];
    cursor?: Prisma.TenantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TenantScalarFieldEnum | Prisma.TenantScalarFieldEnum[];
};
export type TenantFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput | Prisma.TenantOrderByWithRelationInput[];
    cursor?: Prisma.TenantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TenantScalarFieldEnum | Prisma.TenantScalarFieldEnum[];
};
export type TenantFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput | Prisma.TenantOrderByWithRelationInput[];
    cursor?: Prisma.TenantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TenantScalarFieldEnum | Prisma.TenantScalarFieldEnum[];
};
export type TenantCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TenantCreateInput, Prisma.TenantUncheckedCreateInput>;
};
export type TenantCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TenantCreateManyInput | Prisma.TenantCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TenantCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    data: Prisma.TenantCreateManyInput | Prisma.TenantCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TenantUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TenantUpdateInput, Prisma.TenantUncheckedUpdateInput>;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TenantUpdateManyMutationInput, Prisma.TenantUncheckedUpdateManyInput>;
    where?: Prisma.TenantWhereInput;
    limit?: number;
};
export type TenantUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TenantUpdateManyMutationInput, Prisma.TenantUncheckedUpdateManyInput>;
    where?: Prisma.TenantWhereInput;
    limit?: number;
};
export type TenantUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateInput, Prisma.TenantUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TenantUpdateInput, Prisma.TenantUncheckedUpdateInput>;
};
export type TenantDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantWhereInput;
    limit?: number;
};
export type Tenant$branchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    cursor?: Prisma.BranchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BranchScalarFieldEnum | Prisma.BranchScalarFieldEnum[];
};
export type Tenant$staffArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StaffUserSelect<ExtArgs> | null;
    omit?: Prisma.StaffUserOmit<ExtArgs> | null;
    include?: Prisma.StaffUserInclude<ExtArgs> | null;
    where?: Prisma.StaffUserWhereInput;
    orderBy?: Prisma.StaffUserOrderByWithRelationInput | Prisma.StaffUserOrderByWithRelationInput[];
    cursor?: Prisma.StaffUserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StaffUserScalarFieldEnum | Prisma.StaffUserScalarFieldEnum[];
};
export type Tenant$kiorexCommissionRateViewArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KiorexCommissionRateViewSelect<ExtArgs> | null;
    omit?: Prisma.KiorexCommissionRateViewOmit<ExtArgs> | null;
    include?: Prisma.KiorexCommissionRateViewInclude<ExtArgs> | null;
    where?: Prisma.KiorexCommissionRateViewWhereInput;
};
export type TenantDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
};
