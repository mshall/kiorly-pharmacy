import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type StaffUserModel = runtime.Types.Result.DefaultSelection<Prisma.$StaffUserPayload>;
export type AggregateStaffUser = {
    _count: StaffUserCountAggregateOutputType | null;
    _min: StaffUserMinAggregateOutputType | null;
    _max: StaffUserMaxAggregateOutputType | null;
};
export type StaffUserMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    subject: string | null;
    phone: string | null;
    displayName: string | null;
    role: $Enums.StaffRole | null;
    pharmacistLicenceNo: string | null;
    active: boolean | null;
    email: string | null;
    passwordHash: string | null;
    branchId: string | null;
    mfaEnrolled: boolean | null;
    lastLoginAt: Date | null;
    createdAt: Date | null;
};
export type StaffUserMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    subject: string | null;
    phone: string | null;
    displayName: string | null;
    role: $Enums.StaffRole | null;
    pharmacistLicenceNo: string | null;
    active: boolean | null;
    email: string | null;
    passwordHash: string | null;
    branchId: string | null;
    mfaEnrolled: boolean | null;
    lastLoginAt: Date | null;
    createdAt: Date | null;
};
export type StaffUserCountAggregateOutputType = {
    id: number;
    orgId: number;
    subject: number;
    phone: number;
    displayName: number;
    role: number;
    pharmacistLicenceNo: number;
    active: number;
    email: number;
    passwordHash: number;
    branchId: number;
    mfaEnrolled: number;
    dismissedCards: number;
    lastLoginAt: number;
    createdAt: number;
    _all: number;
};
export type StaffUserMinAggregateInputType = {
    id?: true;
    orgId?: true;
    subject?: true;
    phone?: true;
    displayName?: true;
    role?: true;
    pharmacistLicenceNo?: true;
    active?: true;
    email?: true;
    passwordHash?: true;
    branchId?: true;
    mfaEnrolled?: true;
    lastLoginAt?: true;
    createdAt?: true;
};
export type StaffUserMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    subject?: true;
    phone?: true;
    displayName?: true;
    role?: true;
    pharmacistLicenceNo?: true;
    active?: true;
    email?: true;
    passwordHash?: true;
    branchId?: true;
    mfaEnrolled?: true;
    lastLoginAt?: true;
    createdAt?: true;
};
export type StaffUserCountAggregateInputType = {
    id?: true;
    orgId?: true;
    subject?: true;
    phone?: true;
    displayName?: true;
    role?: true;
    pharmacistLicenceNo?: true;
    active?: true;
    email?: true;
    passwordHash?: true;
    branchId?: true;
    mfaEnrolled?: true;
    dismissedCards?: true;
    lastLoginAt?: true;
    createdAt?: true;
    _all?: true;
};
export type StaffUserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StaffUserWhereInput;
    orderBy?: Prisma.StaffUserOrderByWithRelationInput | Prisma.StaffUserOrderByWithRelationInput[];
    cursor?: Prisma.StaffUserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StaffUserCountAggregateInputType;
    _min?: StaffUserMinAggregateInputType;
    _max?: StaffUserMaxAggregateInputType;
};
export type GetStaffUserAggregateType<T extends StaffUserAggregateArgs> = {
    [P in keyof T & keyof AggregateStaffUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStaffUser[P]> : Prisma.GetScalarType<T[P], AggregateStaffUser[P]>;
};
export type StaffUserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StaffUserWhereInput;
    orderBy?: Prisma.StaffUserOrderByWithAggregationInput | Prisma.StaffUserOrderByWithAggregationInput[];
    by: Prisma.StaffUserScalarFieldEnum[] | Prisma.StaffUserScalarFieldEnum;
    having?: Prisma.StaffUserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StaffUserCountAggregateInputType | true;
    _min?: StaffUserMinAggregateInputType;
    _max?: StaffUserMaxAggregateInputType;
};
export type StaffUserGroupByOutputType = {
    id: string;
    orgId: string;
    subject: string | null;
    phone: string | null;
    displayName: string;
    role: $Enums.StaffRole;
    pharmacistLicenceNo: string | null;
    active: boolean;
    email: string | null;
    passwordHash: string | null;
    branchId: string | null;
    mfaEnrolled: boolean;
    dismissedCards: runtime.JsonValue;
    lastLoginAt: Date | null;
    createdAt: Date;
    _count: StaffUserCountAggregateOutputType | null;
    _min: StaffUserMinAggregateOutputType | null;
    _max: StaffUserMaxAggregateOutputType | null;
};
export type GetStaffUserGroupByPayload<T extends StaffUserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StaffUserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StaffUserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StaffUserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StaffUserGroupByOutputType[P]>;
}>>;
export type StaffUserWhereInput = {
    AND?: Prisma.StaffUserWhereInput | Prisma.StaffUserWhereInput[];
    OR?: Prisma.StaffUserWhereInput[];
    NOT?: Prisma.StaffUserWhereInput | Prisma.StaffUserWhereInput[];
    id?: Prisma.StringFilter<"StaffUser"> | string;
    orgId?: Prisma.StringFilter<"StaffUser"> | string;
    subject?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    phone?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    displayName?: Prisma.StringFilter<"StaffUser"> | string;
    role?: Prisma.EnumStaffRoleFilter<"StaffUser"> | $Enums.StaffRole;
    pharmacistLicenceNo?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    active?: Prisma.BoolFilter<"StaffUser"> | boolean;
    email?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    passwordHash?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    branchId?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    mfaEnrolled?: Prisma.BoolFilter<"StaffUser"> | boolean;
    dismissedCards?: Prisma.JsonFilter<"StaffUser">;
    lastLoginAt?: Prisma.DateTimeNullableFilter<"StaffUser"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"StaffUser"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
};
export type StaffUserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    subject?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    displayName?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    pharmacistLicenceNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    passwordHash?: Prisma.SortOrderInput | Prisma.SortOrder;
    branchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    mfaEnrolled?: Prisma.SortOrder;
    dismissedCards?: Prisma.SortOrder;
    lastLoginAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
};
export type StaffUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    orgId_subject?: Prisma.StaffUserOrgIdSubjectCompoundUniqueInput;
    orgId_phone?: Prisma.StaffUserOrgIdPhoneCompoundUniqueInput;
    AND?: Prisma.StaffUserWhereInput | Prisma.StaffUserWhereInput[];
    OR?: Prisma.StaffUserWhereInput[];
    NOT?: Prisma.StaffUserWhereInput | Prisma.StaffUserWhereInput[];
    orgId?: Prisma.StringFilter<"StaffUser"> | string;
    subject?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    phone?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    displayName?: Prisma.StringFilter<"StaffUser"> | string;
    role?: Prisma.EnumStaffRoleFilter<"StaffUser"> | $Enums.StaffRole;
    pharmacistLicenceNo?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    active?: Prisma.BoolFilter<"StaffUser"> | boolean;
    passwordHash?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    branchId?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    mfaEnrolled?: Prisma.BoolFilter<"StaffUser"> | boolean;
    dismissedCards?: Prisma.JsonFilter<"StaffUser">;
    lastLoginAt?: Prisma.DateTimeNullableFilter<"StaffUser"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"StaffUser"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
}, "id" | "email" | "orgId_subject" | "orgId_phone">;
export type StaffUserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    subject?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    displayName?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    pharmacistLicenceNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    passwordHash?: Prisma.SortOrderInput | Prisma.SortOrder;
    branchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    mfaEnrolled?: Prisma.SortOrder;
    dismissedCards?: Prisma.SortOrder;
    lastLoginAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.StaffUserCountOrderByAggregateInput;
    _max?: Prisma.StaffUserMaxOrderByAggregateInput;
    _min?: Prisma.StaffUserMinOrderByAggregateInput;
};
export type StaffUserScalarWhereWithAggregatesInput = {
    AND?: Prisma.StaffUserScalarWhereWithAggregatesInput | Prisma.StaffUserScalarWhereWithAggregatesInput[];
    OR?: Prisma.StaffUserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StaffUserScalarWhereWithAggregatesInput | Prisma.StaffUserScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"StaffUser"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"StaffUser"> | string;
    subject?: Prisma.StringNullableWithAggregatesFilter<"StaffUser"> | string | null;
    phone?: Prisma.StringNullableWithAggregatesFilter<"StaffUser"> | string | null;
    displayName?: Prisma.StringWithAggregatesFilter<"StaffUser"> | string;
    role?: Prisma.EnumStaffRoleWithAggregatesFilter<"StaffUser"> | $Enums.StaffRole;
    pharmacistLicenceNo?: Prisma.StringNullableWithAggregatesFilter<"StaffUser"> | string | null;
    active?: Prisma.BoolWithAggregatesFilter<"StaffUser"> | boolean;
    email?: Prisma.StringNullableWithAggregatesFilter<"StaffUser"> | string | null;
    passwordHash?: Prisma.StringNullableWithAggregatesFilter<"StaffUser"> | string | null;
    branchId?: Prisma.StringNullableWithAggregatesFilter<"StaffUser"> | string | null;
    mfaEnrolled?: Prisma.BoolWithAggregatesFilter<"StaffUser"> | boolean;
    dismissedCards?: Prisma.JsonWithAggregatesFilter<"StaffUser">;
    lastLoginAt?: Prisma.DateTimeNullableWithAggregatesFilter<"StaffUser"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"StaffUser"> | Date | string;
};
export type StaffUserCreateInput = {
    id?: string;
    subject?: string | null;
    phone?: string | null;
    displayName: string;
    role: $Enums.StaffRole;
    pharmacistLicenceNo?: string | null;
    active?: boolean;
    email?: string | null;
    passwordHash?: string | null;
    branchId?: string | null;
    mfaEnrolled?: boolean;
    dismissedCards?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutStaffInput;
};
export type StaffUserUncheckedCreateInput = {
    id?: string;
    orgId: string;
    subject?: string | null;
    phone?: string | null;
    displayName: string;
    role: $Enums.StaffRole;
    pharmacistLicenceNo?: string | null;
    active?: boolean;
    email?: string | null;
    passwordHash?: string | null;
    branchId?: string | null;
    mfaEnrolled?: boolean;
    dismissedCards?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
};
export type StaffUserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole;
    pharmacistLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mfaEnrolled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    dismissedCards?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutStaffNestedInput;
};
export type StaffUserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole;
    pharmacistLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mfaEnrolled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    dismissedCards?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StaffUserCreateManyInput = {
    id?: string;
    orgId: string;
    subject?: string | null;
    phone?: string | null;
    displayName: string;
    role: $Enums.StaffRole;
    pharmacistLicenceNo?: string | null;
    active?: boolean;
    email?: string | null;
    passwordHash?: string | null;
    branchId?: string | null;
    mfaEnrolled?: boolean;
    dismissedCards?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
};
export type StaffUserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole;
    pharmacistLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mfaEnrolled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    dismissedCards?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StaffUserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole;
    pharmacistLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mfaEnrolled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    dismissedCards?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StaffUserListRelationFilter = {
    every?: Prisma.StaffUserWhereInput;
    some?: Prisma.StaffUserWhereInput;
    none?: Prisma.StaffUserWhereInput;
};
export type StaffUserOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StaffUserOrgIdSubjectCompoundUniqueInput = {
    orgId: string;
    subject: string;
};
export type StaffUserOrgIdPhoneCompoundUniqueInput = {
    orgId: string;
    phone: string;
};
export type StaffUserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    displayName?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    pharmacistLicenceNo?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    mfaEnrolled?: Prisma.SortOrder;
    dismissedCards?: Prisma.SortOrder;
    lastLoginAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StaffUserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    displayName?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    pharmacistLicenceNo?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    mfaEnrolled?: Prisma.SortOrder;
    lastLoginAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StaffUserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    displayName?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    pharmacistLicenceNo?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    mfaEnrolled?: Prisma.SortOrder;
    lastLoginAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StaffUserCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.StaffUserCreateWithoutTenantInput, Prisma.StaffUserUncheckedCreateWithoutTenantInput> | Prisma.StaffUserCreateWithoutTenantInput[] | Prisma.StaffUserUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.StaffUserCreateOrConnectWithoutTenantInput | Prisma.StaffUserCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.StaffUserCreateManyTenantInputEnvelope;
    connect?: Prisma.StaffUserWhereUniqueInput | Prisma.StaffUserWhereUniqueInput[];
};
export type StaffUserUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.StaffUserCreateWithoutTenantInput, Prisma.StaffUserUncheckedCreateWithoutTenantInput> | Prisma.StaffUserCreateWithoutTenantInput[] | Prisma.StaffUserUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.StaffUserCreateOrConnectWithoutTenantInput | Prisma.StaffUserCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.StaffUserCreateManyTenantInputEnvelope;
    connect?: Prisma.StaffUserWhereUniqueInput | Prisma.StaffUserWhereUniqueInput[];
};
export type StaffUserUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.StaffUserCreateWithoutTenantInput, Prisma.StaffUserUncheckedCreateWithoutTenantInput> | Prisma.StaffUserCreateWithoutTenantInput[] | Prisma.StaffUserUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.StaffUserCreateOrConnectWithoutTenantInput | Prisma.StaffUserCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.StaffUserUpsertWithWhereUniqueWithoutTenantInput | Prisma.StaffUserUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.StaffUserCreateManyTenantInputEnvelope;
    set?: Prisma.StaffUserWhereUniqueInput | Prisma.StaffUserWhereUniqueInput[];
    disconnect?: Prisma.StaffUserWhereUniqueInput | Prisma.StaffUserWhereUniqueInput[];
    delete?: Prisma.StaffUserWhereUniqueInput | Prisma.StaffUserWhereUniqueInput[];
    connect?: Prisma.StaffUserWhereUniqueInput | Prisma.StaffUserWhereUniqueInput[];
    update?: Prisma.StaffUserUpdateWithWhereUniqueWithoutTenantInput | Prisma.StaffUserUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.StaffUserUpdateManyWithWhereWithoutTenantInput | Prisma.StaffUserUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.StaffUserScalarWhereInput | Prisma.StaffUserScalarWhereInput[];
};
export type StaffUserUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.StaffUserCreateWithoutTenantInput, Prisma.StaffUserUncheckedCreateWithoutTenantInput> | Prisma.StaffUserCreateWithoutTenantInput[] | Prisma.StaffUserUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.StaffUserCreateOrConnectWithoutTenantInput | Prisma.StaffUserCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.StaffUserUpsertWithWhereUniqueWithoutTenantInput | Prisma.StaffUserUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.StaffUserCreateManyTenantInputEnvelope;
    set?: Prisma.StaffUserWhereUniqueInput | Prisma.StaffUserWhereUniqueInput[];
    disconnect?: Prisma.StaffUserWhereUniqueInput | Prisma.StaffUserWhereUniqueInput[];
    delete?: Prisma.StaffUserWhereUniqueInput | Prisma.StaffUserWhereUniqueInput[];
    connect?: Prisma.StaffUserWhereUniqueInput | Prisma.StaffUserWhereUniqueInput[];
    update?: Prisma.StaffUserUpdateWithWhereUniqueWithoutTenantInput | Prisma.StaffUserUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.StaffUserUpdateManyWithWhereWithoutTenantInput | Prisma.StaffUserUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.StaffUserScalarWhereInput | Prisma.StaffUserScalarWhereInput[];
};
export type EnumStaffRoleFieldUpdateOperationsInput = {
    set?: $Enums.StaffRole;
};
export type StaffUserCreateWithoutTenantInput = {
    id?: string;
    subject?: string | null;
    phone?: string | null;
    displayName: string;
    role: $Enums.StaffRole;
    pharmacistLicenceNo?: string | null;
    active?: boolean;
    email?: string | null;
    passwordHash?: string | null;
    branchId?: string | null;
    mfaEnrolled?: boolean;
    dismissedCards?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
};
export type StaffUserUncheckedCreateWithoutTenantInput = {
    id?: string;
    subject?: string | null;
    phone?: string | null;
    displayName: string;
    role: $Enums.StaffRole;
    pharmacistLicenceNo?: string | null;
    active?: boolean;
    email?: string | null;
    passwordHash?: string | null;
    branchId?: string | null;
    mfaEnrolled?: boolean;
    dismissedCards?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
};
export type StaffUserCreateOrConnectWithoutTenantInput = {
    where: Prisma.StaffUserWhereUniqueInput;
    create: Prisma.XOR<Prisma.StaffUserCreateWithoutTenantInput, Prisma.StaffUserUncheckedCreateWithoutTenantInput>;
};
export type StaffUserCreateManyTenantInputEnvelope = {
    data: Prisma.StaffUserCreateManyTenantInput | Prisma.StaffUserCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type StaffUserUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.StaffUserWhereUniqueInput;
    update: Prisma.XOR<Prisma.StaffUserUpdateWithoutTenantInput, Prisma.StaffUserUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.StaffUserCreateWithoutTenantInput, Prisma.StaffUserUncheckedCreateWithoutTenantInput>;
};
export type StaffUserUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.StaffUserWhereUniqueInput;
    data: Prisma.XOR<Prisma.StaffUserUpdateWithoutTenantInput, Prisma.StaffUserUncheckedUpdateWithoutTenantInput>;
};
export type StaffUserUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.StaffUserScalarWhereInput;
    data: Prisma.XOR<Prisma.StaffUserUpdateManyMutationInput, Prisma.StaffUserUncheckedUpdateManyWithoutTenantInput>;
};
export type StaffUserScalarWhereInput = {
    AND?: Prisma.StaffUserScalarWhereInput | Prisma.StaffUserScalarWhereInput[];
    OR?: Prisma.StaffUserScalarWhereInput[];
    NOT?: Prisma.StaffUserScalarWhereInput | Prisma.StaffUserScalarWhereInput[];
    id?: Prisma.StringFilter<"StaffUser"> | string;
    orgId?: Prisma.StringFilter<"StaffUser"> | string;
    subject?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    phone?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    displayName?: Prisma.StringFilter<"StaffUser"> | string;
    role?: Prisma.EnumStaffRoleFilter<"StaffUser"> | $Enums.StaffRole;
    pharmacistLicenceNo?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    active?: Prisma.BoolFilter<"StaffUser"> | boolean;
    email?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    passwordHash?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    branchId?: Prisma.StringNullableFilter<"StaffUser"> | string | null;
    mfaEnrolled?: Prisma.BoolFilter<"StaffUser"> | boolean;
    dismissedCards?: Prisma.JsonFilter<"StaffUser">;
    lastLoginAt?: Prisma.DateTimeNullableFilter<"StaffUser"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"StaffUser"> | Date | string;
};
export type StaffUserCreateManyTenantInput = {
    id?: string;
    subject?: string | null;
    phone?: string | null;
    displayName: string;
    role: $Enums.StaffRole;
    pharmacistLicenceNo?: string | null;
    active?: boolean;
    email?: string | null;
    passwordHash?: string | null;
    branchId?: string | null;
    mfaEnrolled?: boolean;
    dismissedCards?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
};
export type StaffUserUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole;
    pharmacistLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mfaEnrolled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    dismissedCards?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StaffUserUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole;
    pharmacistLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mfaEnrolled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    dismissedCards?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StaffUserUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole;
    pharmacistLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mfaEnrolled?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    dismissedCards?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StaffUserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    subject?: boolean;
    phone?: boolean;
    displayName?: boolean;
    role?: boolean;
    pharmacistLicenceNo?: boolean;
    active?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    branchId?: boolean;
    mfaEnrolled?: boolean;
    dismissedCards?: boolean;
    lastLoginAt?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["staffUser"]>;
export type StaffUserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    subject?: boolean;
    phone?: boolean;
    displayName?: boolean;
    role?: boolean;
    pharmacistLicenceNo?: boolean;
    active?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    branchId?: boolean;
    mfaEnrolled?: boolean;
    dismissedCards?: boolean;
    lastLoginAt?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["staffUser"]>;
export type StaffUserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    subject?: boolean;
    phone?: boolean;
    displayName?: boolean;
    role?: boolean;
    pharmacistLicenceNo?: boolean;
    active?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    branchId?: boolean;
    mfaEnrolled?: boolean;
    dismissedCards?: boolean;
    lastLoginAt?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["staffUser"]>;
export type StaffUserSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    subject?: boolean;
    phone?: boolean;
    displayName?: boolean;
    role?: boolean;
    pharmacistLicenceNo?: boolean;
    active?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    branchId?: boolean;
    mfaEnrolled?: boolean;
    dismissedCards?: boolean;
    lastLoginAt?: boolean;
    createdAt?: boolean;
};
export type StaffUserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "subject" | "phone" | "displayName" | "role" | "pharmacistLicenceNo" | "active" | "email" | "passwordHash" | "branchId" | "mfaEnrolled" | "dismissedCards" | "lastLoginAt" | "createdAt", ExtArgs["result"]["staffUser"]>;
export type StaffUserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type StaffUserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type StaffUserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $StaffUserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StaffUser";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        subject: string | null;
        phone: string | null;
        displayName: string;
        role: $Enums.StaffRole;
        pharmacistLicenceNo: string | null;
        active: boolean;
        email: string | null;
        passwordHash: string | null;
        branchId: string | null;
        mfaEnrolled: boolean;
        dismissedCards: runtime.JsonValue;
        lastLoginAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["staffUser"]>;
    composites: {};
};
export type StaffUserGetPayload<S extends boolean | null | undefined | StaffUserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StaffUserPayload, S>;
export type StaffUserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StaffUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StaffUserCountAggregateInputType | true;
};
export interface StaffUserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StaffUser'];
        meta: {
            name: 'StaffUser';
        };
    };
    findUnique<T extends StaffUserFindUniqueArgs>(args: Prisma.SelectSubset<T, StaffUserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StaffUserClient<runtime.Types.Result.GetResult<Prisma.$StaffUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StaffUserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StaffUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StaffUserClient<runtime.Types.Result.GetResult<Prisma.$StaffUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StaffUserFindFirstArgs>(args?: Prisma.SelectSubset<T, StaffUserFindFirstArgs<ExtArgs>>): Prisma.Prisma__StaffUserClient<runtime.Types.Result.GetResult<Prisma.$StaffUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StaffUserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StaffUserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StaffUserClient<runtime.Types.Result.GetResult<Prisma.$StaffUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StaffUserFindManyArgs>(args?: Prisma.SelectSubset<T, StaffUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StaffUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StaffUserCreateArgs>(args: Prisma.SelectSubset<T, StaffUserCreateArgs<ExtArgs>>): Prisma.Prisma__StaffUserClient<runtime.Types.Result.GetResult<Prisma.$StaffUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StaffUserCreateManyArgs>(args?: Prisma.SelectSubset<T, StaffUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StaffUserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StaffUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StaffUserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StaffUserDeleteArgs>(args: Prisma.SelectSubset<T, StaffUserDeleteArgs<ExtArgs>>): Prisma.Prisma__StaffUserClient<runtime.Types.Result.GetResult<Prisma.$StaffUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StaffUserUpdateArgs>(args: Prisma.SelectSubset<T, StaffUserUpdateArgs<ExtArgs>>): Prisma.Prisma__StaffUserClient<runtime.Types.Result.GetResult<Prisma.$StaffUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StaffUserDeleteManyArgs>(args?: Prisma.SelectSubset<T, StaffUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StaffUserUpdateManyArgs>(args: Prisma.SelectSubset<T, StaffUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StaffUserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StaffUserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StaffUserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StaffUserUpsertArgs>(args: Prisma.SelectSubset<T, StaffUserUpsertArgs<ExtArgs>>): Prisma.Prisma__StaffUserClient<runtime.Types.Result.GetResult<Prisma.$StaffUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StaffUserCountArgs>(args?: Prisma.Subset<T, StaffUserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StaffUserCountAggregateOutputType> : number>;
    aggregate<T extends StaffUserAggregateArgs>(args: Prisma.Subset<T, StaffUserAggregateArgs>): Prisma.PrismaPromise<GetStaffUserAggregateType<T>>;
    groupBy<T extends StaffUserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StaffUserGroupByArgs['orderBy'];
    } : {
        orderBy?: StaffUserGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StaffUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStaffUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StaffUserFieldRefs;
}
export interface Prisma__StaffUserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StaffUserFieldRefs {
    readonly id: Prisma.FieldRef<"StaffUser", 'String'>;
    readonly orgId: Prisma.FieldRef<"StaffUser", 'String'>;
    readonly subject: Prisma.FieldRef<"StaffUser", 'String'>;
    readonly phone: Prisma.FieldRef<"StaffUser", 'String'>;
    readonly displayName: Prisma.FieldRef<"StaffUser", 'String'>;
    readonly role: Prisma.FieldRef<"StaffUser", 'StaffRole'>;
    readonly pharmacistLicenceNo: Prisma.FieldRef<"StaffUser", 'String'>;
    readonly active: Prisma.FieldRef<"StaffUser", 'Boolean'>;
    readonly email: Prisma.FieldRef<"StaffUser", 'String'>;
    readonly passwordHash: Prisma.FieldRef<"StaffUser", 'String'>;
    readonly branchId: Prisma.FieldRef<"StaffUser", 'String'>;
    readonly mfaEnrolled: Prisma.FieldRef<"StaffUser", 'Boolean'>;
    readonly dismissedCards: Prisma.FieldRef<"StaffUser", 'Json'>;
    readonly lastLoginAt: Prisma.FieldRef<"StaffUser", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"StaffUser", 'DateTime'>;
}
export type StaffUserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StaffUserSelect<ExtArgs> | null;
    omit?: Prisma.StaffUserOmit<ExtArgs> | null;
    include?: Prisma.StaffUserInclude<ExtArgs> | null;
    where: Prisma.StaffUserWhereUniqueInput;
};
export type StaffUserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StaffUserSelect<ExtArgs> | null;
    omit?: Prisma.StaffUserOmit<ExtArgs> | null;
    include?: Prisma.StaffUserInclude<ExtArgs> | null;
    where: Prisma.StaffUserWhereUniqueInput;
};
export type StaffUserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StaffUserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StaffUserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StaffUserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StaffUserSelect<ExtArgs> | null;
    omit?: Prisma.StaffUserOmit<ExtArgs> | null;
    include?: Prisma.StaffUserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StaffUserCreateInput, Prisma.StaffUserUncheckedCreateInput>;
};
export type StaffUserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StaffUserCreateManyInput | Prisma.StaffUserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StaffUserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StaffUserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StaffUserOmit<ExtArgs> | null;
    data: Prisma.StaffUserCreateManyInput | Prisma.StaffUserCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.StaffUserIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type StaffUserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StaffUserSelect<ExtArgs> | null;
    omit?: Prisma.StaffUserOmit<ExtArgs> | null;
    include?: Prisma.StaffUserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StaffUserUpdateInput, Prisma.StaffUserUncheckedUpdateInput>;
    where: Prisma.StaffUserWhereUniqueInput;
};
export type StaffUserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StaffUserUpdateManyMutationInput, Prisma.StaffUserUncheckedUpdateManyInput>;
    where?: Prisma.StaffUserWhereInput;
    limit?: number;
};
export type StaffUserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StaffUserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StaffUserOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StaffUserUpdateManyMutationInput, Prisma.StaffUserUncheckedUpdateManyInput>;
    where?: Prisma.StaffUserWhereInput;
    limit?: number;
    include?: Prisma.StaffUserIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type StaffUserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StaffUserSelect<ExtArgs> | null;
    omit?: Prisma.StaffUserOmit<ExtArgs> | null;
    include?: Prisma.StaffUserInclude<ExtArgs> | null;
    where: Prisma.StaffUserWhereUniqueInput;
    create: Prisma.XOR<Prisma.StaffUserCreateInput, Prisma.StaffUserUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StaffUserUpdateInput, Prisma.StaffUserUncheckedUpdateInput>;
};
export type StaffUserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StaffUserSelect<ExtArgs> | null;
    omit?: Prisma.StaffUserOmit<ExtArgs> | null;
    include?: Prisma.StaffUserInclude<ExtArgs> | null;
    where: Prisma.StaffUserWhereUniqueInput;
};
export type StaffUserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StaffUserWhereInput;
    limit?: number;
};
export type StaffUserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StaffUserSelect<ExtArgs> | null;
    omit?: Prisma.StaffUserOmit<ExtArgs> | null;
    include?: Prisma.StaffUserInclude<ExtArgs> | null;
};
