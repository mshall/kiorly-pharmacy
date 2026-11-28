import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type ProviderReferralLinkModel = runtime.Types.Result.DefaultSelection<Prisma.$ProviderReferralLinkPayload>;
export type AggregateProviderReferralLink = {
    _count: ProviderReferralLinkCountAggregateOutputType | null;
    _min: ProviderReferralLinkMinAggregateOutputType | null;
    _max: ProviderReferralLinkMaxAggregateOutputType | null;
};
export type ProviderReferralLinkMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchRef: string | null;
    ownerScope: $Enums.ReferralLinkOwnerScope | null;
    channelKind: $Enums.ReferralLinkChannelKind | null;
    code: string | null;
    label: string | null;
    status: $Enums.ReferralLinkStatus | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    revokedAt: Date | null;
    revokedBy: string | null;
};
export type ProviderReferralLinkMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchRef: string | null;
    ownerScope: $Enums.ReferralLinkOwnerScope | null;
    channelKind: $Enums.ReferralLinkChannelKind | null;
    code: string | null;
    label: string | null;
    status: $Enums.ReferralLinkStatus | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    revokedAt: Date | null;
    revokedBy: string | null;
};
export type ProviderReferralLinkCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchRef: number;
    ownerScope: number;
    channelKind: number;
    code: number;
    label: number;
    status: number;
    tags: number;
    createdBy: number;
    createdAt: number;
    updatedAt: number;
    revokedAt: number;
    revokedBy: number;
    _all: number;
};
export type ProviderReferralLinkMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchRef?: true;
    ownerScope?: true;
    channelKind?: true;
    code?: true;
    label?: true;
    status?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
    revokedAt?: true;
    revokedBy?: true;
};
export type ProviderReferralLinkMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchRef?: true;
    ownerScope?: true;
    channelKind?: true;
    code?: true;
    label?: true;
    status?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
    revokedAt?: true;
    revokedBy?: true;
};
export type ProviderReferralLinkCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchRef?: true;
    ownerScope?: true;
    channelKind?: true;
    code?: true;
    label?: true;
    status?: true;
    tags?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
    revokedAt?: true;
    revokedBy?: true;
    _all?: true;
};
export type ProviderReferralLinkAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProviderReferralLinkWhereInput;
    orderBy?: Prisma.ProviderReferralLinkOrderByWithRelationInput | Prisma.ProviderReferralLinkOrderByWithRelationInput[];
    cursor?: Prisma.ProviderReferralLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProviderReferralLinkCountAggregateInputType;
    _min?: ProviderReferralLinkMinAggregateInputType;
    _max?: ProviderReferralLinkMaxAggregateInputType;
};
export type GetProviderReferralLinkAggregateType<T extends ProviderReferralLinkAggregateArgs> = {
    [P in keyof T & keyof AggregateProviderReferralLink]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProviderReferralLink[P]> : Prisma.GetScalarType<T[P], AggregateProviderReferralLink[P]>;
};
export type ProviderReferralLinkGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProviderReferralLinkWhereInput;
    orderBy?: Prisma.ProviderReferralLinkOrderByWithAggregationInput | Prisma.ProviderReferralLinkOrderByWithAggregationInput[];
    by: Prisma.ProviderReferralLinkScalarFieldEnum[] | Prisma.ProviderReferralLinkScalarFieldEnum;
    having?: Prisma.ProviderReferralLinkScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProviderReferralLinkCountAggregateInputType | true;
    _min?: ProviderReferralLinkMinAggregateInputType;
    _max?: ProviderReferralLinkMaxAggregateInputType;
};
export type ProviderReferralLinkGroupByOutputType = {
    id: string;
    orgId: string;
    branchRef: string | null;
    ownerScope: $Enums.ReferralLinkOwnerScope;
    channelKind: $Enums.ReferralLinkChannelKind;
    code: string;
    label: string;
    status: $Enums.ReferralLinkStatus;
    tags: runtime.JsonValue | null;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    revokedAt: Date | null;
    revokedBy: string | null;
    _count: ProviderReferralLinkCountAggregateOutputType | null;
    _min: ProviderReferralLinkMinAggregateOutputType | null;
    _max: ProviderReferralLinkMaxAggregateOutputType | null;
};
export type GetProviderReferralLinkGroupByPayload<T extends ProviderReferralLinkGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProviderReferralLinkGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProviderReferralLinkGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProviderReferralLinkGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProviderReferralLinkGroupByOutputType[P]>;
}>>;
export type ProviderReferralLinkWhereInput = {
    AND?: Prisma.ProviderReferralLinkWhereInput | Prisma.ProviderReferralLinkWhereInput[];
    OR?: Prisma.ProviderReferralLinkWhereInput[];
    NOT?: Prisma.ProviderReferralLinkWhereInput | Prisma.ProviderReferralLinkWhereInput[];
    id?: Prisma.StringFilter<"ProviderReferralLink"> | string;
    orgId?: Prisma.StringFilter<"ProviderReferralLink"> | string;
    branchRef?: Prisma.StringNullableFilter<"ProviderReferralLink"> | string | null;
    ownerScope?: Prisma.EnumReferralLinkOwnerScopeFilter<"ProviderReferralLink"> | $Enums.ReferralLinkOwnerScope;
    channelKind?: Prisma.EnumReferralLinkChannelKindFilter<"ProviderReferralLink"> | $Enums.ReferralLinkChannelKind;
    code?: Prisma.StringFilter<"ProviderReferralLink"> | string;
    label?: Prisma.StringFilter<"ProviderReferralLink"> | string;
    status?: Prisma.EnumReferralLinkStatusFilter<"ProviderReferralLink"> | $Enums.ReferralLinkStatus;
    tags?: Prisma.JsonNullableFilter<"ProviderReferralLink">;
    createdBy?: Prisma.StringFilter<"ProviderReferralLink"> | string;
    createdAt?: Prisma.DateTimeFilter<"ProviderReferralLink"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ProviderReferralLink"> | Date | string;
    revokedAt?: Prisma.DateTimeNullableFilter<"ProviderReferralLink"> | Date | string | null;
    revokedBy?: Prisma.StringNullableFilter<"ProviderReferralLink"> | string | null;
    daily?: Prisma.ProviderReferralLinkDailyListRelationFilter;
};
export type ProviderReferralLinkOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchRef?: Prisma.SortOrderInput | Prisma.SortOrder;
    ownerScope?: Prisma.SortOrder;
    channelKind?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    tags?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    revokedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    daily?: Prisma.ProviderReferralLinkDailyOrderByRelationAggregateInput;
};
export type ProviderReferralLinkWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    code?: string;
    AND?: Prisma.ProviderReferralLinkWhereInput | Prisma.ProviderReferralLinkWhereInput[];
    OR?: Prisma.ProviderReferralLinkWhereInput[];
    NOT?: Prisma.ProviderReferralLinkWhereInput | Prisma.ProviderReferralLinkWhereInput[];
    orgId?: Prisma.StringFilter<"ProviderReferralLink"> | string;
    branchRef?: Prisma.StringNullableFilter<"ProviderReferralLink"> | string | null;
    ownerScope?: Prisma.EnumReferralLinkOwnerScopeFilter<"ProviderReferralLink"> | $Enums.ReferralLinkOwnerScope;
    channelKind?: Prisma.EnumReferralLinkChannelKindFilter<"ProviderReferralLink"> | $Enums.ReferralLinkChannelKind;
    label?: Prisma.StringFilter<"ProviderReferralLink"> | string;
    status?: Prisma.EnumReferralLinkStatusFilter<"ProviderReferralLink"> | $Enums.ReferralLinkStatus;
    tags?: Prisma.JsonNullableFilter<"ProviderReferralLink">;
    createdBy?: Prisma.StringFilter<"ProviderReferralLink"> | string;
    createdAt?: Prisma.DateTimeFilter<"ProviderReferralLink"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ProviderReferralLink"> | Date | string;
    revokedAt?: Prisma.DateTimeNullableFilter<"ProviderReferralLink"> | Date | string | null;
    revokedBy?: Prisma.StringNullableFilter<"ProviderReferralLink"> | string | null;
    daily?: Prisma.ProviderReferralLinkDailyListRelationFilter;
}, "id" | "code">;
export type ProviderReferralLinkOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchRef?: Prisma.SortOrderInput | Prisma.SortOrder;
    ownerScope?: Prisma.SortOrder;
    channelKind?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    tags?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    revokedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ProviderReferralLinkCountOrderByAggregateInput;
    _max?: Prisma.ProviderReferralLinkMaxOrderByAggregateInput;
    _min?: Prisma.ProviderReferralLinkMinOrderByAggregateInput;
};
export type ProviderReferralLinkScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProviderReferralLinkScalarWhereWithAggregatesInput | Prisma.ProviderReferralLinkScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProviderReferralLinkScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProviderReferralLinkScalarWhereWithAggregatesInput | Prisma.ProviderReferralLinkScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ProviderReferralLink"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"ProviderReferralLink"> | string;
    branchRef?: Prisma.StringNullableWithAggregatesFilter<"ProviderReferralLink"> | string | null;
    ownerScope?: Prisma.EnumReferralLinkOwnerScopeWithAggregatesFilter<"ProviderReferralLink"> | $Enums.ReferralLinkOwnerScope;
    channelKind?: Prisma.EnumReferralLinkChannelKindWithAggregatesFilter<"ProviderReferralLink"> | $Enums.ReferralLinkChannelKind;
    code?: Prisma.StringWithAggregatesFilter<"ProviderReferralLink"> | string;
    label?: Prisma.StringWithAggregatesFilter<"ProviderReferralLink"> | string;
    status?: Prisma.EnumReferralLinkStatusWithAggregatesFilter<"ProviderReferralLink"> | $Enums.ReferralLinkStatus;
    tags?: Prisma.JsonNullableWithAggregatesFilter<"ProviderReferralLink">;
    createdBy?: Prisma.StringWithAggregatesFilter<"ProviderReferralLink"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ProviderReferralLink"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"ProviderReferralLink"> | Date | string;
    revokedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"ProviderReferralLink"> | Date | string | null;
    revokedBy?: Prisma.StringNullableWithAggregatesFilter<"ProviderReferralLink"> | string | null;
};
export type ProviderReferralLinkCreateInput = {
    id?: string;
    orgId: string;
    branchRef?: string | null;
    ownerScope: $Enums.ReferralLinkOwnerScope;
    channelKind?: $Enums.ReferralLinkChannelKind;
    code: string;
    label: string;
    status?: $Enums.ReferralLinkStatus;
    tags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    revokedAt?: Date | string | null;
    revokedBy?: string | null;
    daily?: Prisma.ProviderReferralLinkDailyCreateNestedManyWithoutLinkInput;
};
export type ProviderReferralLinkUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchRef?: string | null;
    ownerScope: $Enums.ReferralLinkOwnerScope;
    channelKind?: $Enums.ReferralLinkChannelKind;
    code: string;
    label: string;
    status?: $Enums.ReferralLinkStatus;
    tags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    revokedAt?: Date | string | null;
    revokedBy?: string | null;
    daily?: Prisma.ProviderReferralLinkDailyUncheckedCreateNestedManyWithoutLinkInput;
};
export type ProviderReferralLinkUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerScope?: Prisma.EnumReferralLinkOwnerScopeFieldUpdateOperationsInput | $Enums.ReferralLinkOwnerScope;
    channelKind?: Prisma.EnumReferralLinkChannelKindFieldUpdateOperationsInput | $Enums.ReferralLinkChannelKind;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReferralLinkStatusFieldUpdateOperationsInput | $Enums.ReferralLinkStatus;
    tags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    daily?: Prisma.ProviderReferralLinkDailyUpdateManyWithoutLinkNestedInput;
};
export type ProviderReferralLinkUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerScope?: Prisma.EnumReferralLinkOwnerScopeFieldUpdateOperationsInput | $Enums.ReferralLinkOwnerScope;
    channelKind?: Prisma.EnumReferralLinkChannelKindFieldUpdateOperationsInput | $Enums.ReferralLinkChannelKind;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReferralLinkStatusFieldUpdateOperationsInput | $Enums.ReferralLinkStatus;
    tags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    daily?: Prisma.ProviderReferralLinkDailyUncheckedUpdateManyWithoutLinkNestedInput;
};
export type ProviderReferralLinkCreateManyInput = {
    id?: string;
    orgId: string;
    branchRef?: string | null;
    ownerScope: $Enums.ReferralLinkOwnerScope;
    channelKind?: $Enums.ReferralLinkChannelKind;
    code: string;
    label: string;
    status?: $Enums.ReferralLinkStatus;
    tags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    revokedAt?: Date | string | null;
    revokedBy?: string | null;
};
export type ProviderReferralLinkUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerScope?: Prisma.EnumReferralLinkOwnerScopeFieldUpdateOperationsInput | $Enums.ReferralLinkOwnerScope;
    channelKind?: Prisma.EnumReferralLinkChannelKindFieldUpdateOperationsInput | $Enums.ReferralLinkChannelKind;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReferralLinkStatusFieldUpdateOperationsInput | $Enums.ReferralLinkStatus;
    tags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ProviderReferralLinkUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerScope?: Prisma.EnumReferralLinkOwnerScopeFieldUpdateOperationsInput | $Enums.ReferralLinkOwnerScope;
    channelKind?: Prisma.EnumReferralLinkChannelKindFieldUpdateOperationsInput | $Enums.ReferralLinkChannelKind;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReferralLinkStatusFieldUpdateOperationsInput | $Enums.ReferralLinkStatus;
    tags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ProviderReferralLinkCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchRef?: Prisma.SortOrder;
    ownerScope?: Prisma.SortOrder;
    channelKind?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    tags?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    revokedBy?: Prisma.SortOrder;
};
export type ProviderReferralLinkMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchRef?: Prisma.SortOrder;
    ownerScope?: Prisma.SortOrder;
    channelKind?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    revokedBy?: Prisma.SortOrder;
};
export type ProviderReferralLinkMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchRef?: Prisma.SortOrder;
    ownerScope?: Prisma.SortOrder;
    channelKind?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    revokedBy?: Prisma.SortOrder;
};
export type ProviderReferralLinkScalarRelationFilter = {
    is?: Prisma.ProviderReferralLinkWhereInput;
    isNot?: Prisma.ProviderReferralLinkWhereInput;
};
export type EnumReferralLinkOwnerScopeFieldUpdateOperationsInput = {
    set?: $Enums.ReferralLinkOwnerScope;
};
export type EnumReferralLinkChannelKindFieldUpdateOperationsInput = {
    set?: $Enums.ReferralLinkChannelKind;
};
export type EnumReferralLinkStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReferralLinkStatus;
};
export type ProviderReferralLinkCreateNestedOneWithoutDailyInput = {
    create?: Prisma.XOR<Prisma.ProviderReferralLinkCreateWithoutDailyInput, Prisma.ProviderReferralLinkUncheckedCreateWithoutDailyInput>;
    connectOrCreate?: Prisma.ProviderReferralLinkCreateOrConnectWithoutDailyInput;
    connect?: Prisma.ProviderReferralLinkWhereUniqueInput;
};
export type ProviderReferralLinkUpdateOneRequiredWithoutDailyNestedInput = {
    create?: Prisma.XOR<Prisma.ProviderReferralLinkCreateWithoutDailyInput, Prisma.ProviderReferralLinkUncheckedCreateWithoutDailyInput>;
    connectOrCreate?: Prisma.ProviderReferralLinkCreateOrConnectWithoutDailyInput;
    upsert?: Prisma.ProviderReferralLinkUpsertWithoutDailyInput;
    connect?: Prisma.ProviderReferralLinkWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProviderReferralLinkUpdateToOneWithWhereWithoutDailyInput, Prisma.ProviderReferralLinkUpdateWithoutDailyInput>, Prisma.ProviderReferralLinkUncheckedUpdateWithoutDailyInput>;
};
export type ProviderReferralLinkCreateWithoutDailyInput = {
    id?: string;
    orgId: string;
    branchRef?: string | null;
    ownerScope: $Enums.ReferralLinkOwnerScope;
    channelKind?: $Enums.ReferralLinkChannelKind;
    code: string;
    label: string;
    status?: $Enums.ReferralLinkStatus;
    tags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    revokedAt?: Date | string | null;
    revokedBy?: string | null;
};
export type ProviderReferralLinkUncheckedCreateWithoutDailyInput = {
    id?: string;
    orgId: string;
    branchRef?: string | null;
    ownerScope: $Enums.ReferralLinkOwnerScope;
    channelKind?: $Enums.ReferralLinkChannelKind;
    code: string;
    label: string;
    status?: $Enums.ReferralLinkStatus;
    tags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    revokedAt?: Date | string | null;
    revokedBy?: string | null;
};
export type ProviderReferralLinkCreateOrConnectWithoutDailyInput = {
    where: Prisma.ProviderReferralLinkWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProviderReferralLinkCreateWithoutDailyInput, Prisma.ProviderReferralLinkUncheckedCreateWithoutDailyInput>;
};
export type ProviderReferralLinkUpsertWithoutDailyInput = {
    update: Prisma.XOR<Prisma.ProviderReferralLinkUpdateWithoutDailyInput, Prisma.ProviderReferralLinkUncheckedUpdateWithoutDailyInput>;
    create: Prisma.XOR<Prisma.ProviderReferralLinkCreateWithoutDailyInput, Prisma.ProviderReferralLinkUncheckedCreateWithoutDailyInput>;
    where?: Prisma.ProviderReferralLinkWhereInput;
};
export type ProviderReferralLinkUpdateToOneWithWhereWithoutDailyInput = {
    where?: Prisma.ProviderReferralLinkWhereInput;
    data: Prisma.XOR<Prisma.ProviderReferralLinkUpdateWithoutDailyInput, Prisma.ProviderReferralLinkUncheckedUpdateWithoutDailyInput>;
};
export type ProviderReferralLinkUpdateWithoutDailyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerScope?: Prisma.EnumReferralLinkOwnerScopeFieldUpdateOperationsInput | $Enums.ReferralLinkOwnerScope;
    channelKind?: Prisma.EnumReferralLinkChannelKindFieldUpdateOperationsInput | $Enums.ReferralLinkChannelKind;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReferralLinkStatusFieldUpdateOperationsInput | $Enums.ReferralLinkStatus;
    tags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ProviderReferralLinkUncheckedUpdateWithoutDailyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerScope?: Prisma.EnumReferralLinkOwnerScopeFieldUpdateOperationsInput | $Enums.ReferralLinkOwnerScope;
    channelKind?: Prisma.EnumReferralLinkChannelKindFieldUpdateOperationsInput | $Enums.ReferralLinkChannelKind;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReferralLinkStatusFieldUpdateOperationsInput | $Enums.ReferralLinkStatus;
    tags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ProviderReferralLinkCountOutputType = {
    daily: number;
};
export type ProviderReferralLinkCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    daily?: boolean | ProviderReferralLinkCountOutputTypeCountDailyArgs;
};
export type ProviderReferralLinkCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkCountOutputTypeSelect<ExtArgs> | null;
};
export type ProviderReferralLinkCountOutputTypeCountDailyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProviderReferralLinkDailyWhereInput;
};
export type ProviderReferralLinkSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchRef?: boolean;
    ownerScope?: boolean;
    channelKind?: boolean;
    code?: boolean;
    label?: boolean;
    status?: boolean;
    tags?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    revokedAt?: boolean;
    revokedBy?: boolean;
    daily?: boolean | Prisma.ProviderReferralLink$dailyArgs<ExtArgs>;
    _count?: boolean | Prisma.ProviderReferralLinkCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["providerReferralLink"]>;
export type ProviderReferralLinkSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchRef?: boolean;
    ownerScope?: boolean;
    channelKind?: boolean;
    code?: boolean;
    label?: boolean;
    status?: boolean;
    tags?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    revokedAt?: boolean;
    revokedBy?: boolean;
}, ExtArgs["result"]["providerReferralLink"]>;
export type ProviderReferralLinkSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchRef?: boolean;
    ownerScope?: boolean;
    channelKind?: boolean;
    code?: boolean;
    label?: boolean;
    status?: boolean;
    tags?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    revokedAt?: boolean;
    revokedBy?: boolean;
}, ExtArgs["result"]["providerReferralLink"]>;
export type ProviderReferralLinkSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchRef?: boolean;
    ownerScope?: boolean;
    channelKind?: boolean;
    code?: boolean;
    label?: boolean;
    status?: boolean;
    tags?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    revokedAt?: boolean;
    revokedBy?: boolean;
};
export type ProviderReferralLinkOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchRef" | "ownerScope" | "channelKind" | "code" | "label" | "status" | "tags" | "createdBy" | "createdAt" | "updatedAt" | "revokedAt" | "revokedBy", ExtArgs["result"]["providerReferralLink"]>;
export type ProviderReferralLinkInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    daily?: boolean | Prisma.ProviderReferralLink$dailyArgs<ExtArgs>;
    _count?: boolean | Prisma.ProviderReferralLinkCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ProviderReferralLinkIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type ProviderReferralLinkIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $ProviderReferralLinkPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProviderReferralLink";
    objects: {
        daily: Prisma.$ProviderReferralLinkDailyPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchRef: string | null;
        ownerScope: $Enums.ReferralLinkOwnerScope;
        channelKind: $Enums.ReferralLinkChannelKind;
        code: string;
        label: string;
        status: $Enums.ReferralLinkStatus;
        tags: runtime.JsonValue | null;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
        revokedAt: Date | null;
        revokedBy: string | null;
    }, ExtArgs["result"]["providerReferralLink"]>;
    composites: {};
};
export type ProviderReferralLinkGetPayload<S extends boolean | null | undefined | ProviderReferralLinkDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkPayload, S>;
export type ProviderReferralLinkCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProviderReferralLinkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProviderReferralLinkCountAggregateInputType | true;
};
export interface ProviderReferralLinkDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProviderReferralLink'];
        meta: {
            name: 'ProviderReferralLink';
        };
    };
    findUnique<T extends ProviderReferralLinkFindUniqueArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProviderReferralLinkFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProviderReferralLinkFindFirstArgs>(args?: Prisma.SelectSubset<T, ProviderReferralLinkFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProviderReferralLinkFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProviderReferralLinkFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProviderReferralLinkFindManyArgs>(args?: Prisma.SelectSubset<T, ProviderReferralLinkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProviderReferralLinkCreateArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkCreateArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProviderReferralLinkCreateManyArgs>(args?: Prisma.SelectSubset<T, ProviderReferralLinkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProviderReferralLinkCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProviderReferralLinkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProviderReferralLinkDeleteArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkDeleteArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProviderReferralLinkUpdateArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkUpdateArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProviderReferralLinkDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProviderReferralLinkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProviderReferralLinkUpdateManyArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProviderReferralLinkUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProviderReferralLinkUpsertArgs>(args: Prisma.SelectSubset<T, ProviderReferralLinkUpsertArgs<ExtArgs>>): Prisma.Prisma__ProviderReferralLinkClient<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProviderReferralLinkCountArgs>(args?: Prisma.Subset<T, ProviderReferralLinkCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProviderReferralLinkCountAggregateOutputType> : number>;
    aggregate<T extends ProviderReferralLinkAggregateArgs>(args: Prisma.Subset<T, ProviderReferralLinkAggregateArgs>): Prisma.PrismaPromise<GetProviderReferralLinkAggregateType<T>>;
    groupBy<T extends ProviderReferralLinkGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProviderReferralLinkGroupByArgs['orderBy'];
    } : {
        orderBy?: ProviderReferralLinkGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProviderReferralLinkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProviderReferralLinkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProviderReferralLinkFieldRefs;
}
export interface Prisma__ProviderReferralLinkClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    daily<T extends Prisma.ProviderReferralLink$dailyArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProviderReferralLink$dailyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProviderReferralLinkDailyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProviderReferralLinkFieldRefs {
    readonly id: Prisma.FieldRef<"ProviderReferralLink", 'String'>;
    readonly orgId: Prisma.FieldRef<"ProviderReferralLink", 'String'>;
    readonly branchRef: Prisma.FieldRef<"ProviderReferralLink", 'String'>;
    readonly ownerScope: Prisma.FieldRef<"ProviderReferralLink", 'ReferralLinkOwnerScope'>;
    readonly channelKind: Prisma.FieldRef<"ProviderReferralLink", 'ReferralLinkChannelKind'>;
    readonly code: Prisma.FieldRef<"ProviderReferralLink", 'String'>;
    readonly label: Prisma.FieldRef<"ProviderReferralLink", 'String'>;
    readonly status: Prisma.FieldRef<"ProviderReferralLink", 'ReferralLinkStatus'>;
    readonly tags: Prisma.FieldRef<"ProviderReferralLink", 'Json'>;
    readonly createdBy: Prisma.FieldRef<"ProviderReferralLink", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ProviderReferralLink", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"ProviderReferralLink", 'DateTime'>;
    readonly revokedAt: Prisma.FieldRef<"ProviderReferralLink", 'DateTime'>;
    readonly revokedBy: Prisma.FieldRef<"ProviderReferralLink", 'String'>;
}
export type ProviderReferralLinkFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkSelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkInclude<ExtArgs> | null;
    where: Prisma.ProviderReferralLinkWhereUniqueInput;
};
export type ProviderReferralLinkFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkSelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkInclude<ExtArgs> | null;
    where: Prisma.ProviderReferralLinkWhereUniqueInput;
};
export type ProviderReferralLinkFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkSelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkInclude<ExtArgs> | null;
    where?: Prisma.ProviderReferralLinkWhereInput;
    orderBy?: Prisma.ProviderReferralLinkOrderByWithRelationInput | Prisma.ProviderReferralLinkOrderByWithRelationInput[];
    cursor?: Prisma.ProviderReferralLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProviderReferralLinkScalarFieldEnum | Prisma.ProviderReferralLinkScalarFieldEnum[];
};
export type ProviderReferralLinkFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkSelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkInclude<ExtArgs> | null;
    where?: Prisma.ProviderReferralLinkWhereInput;
    orderBy?: Prisma.ProviderReferralLinkOrderByWithRelationInput | Prisma.ProviderReferralLinkOrderByWithRelationInput[];
    cursor?: Prisma.ProviderReferralLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProviderReferralLinkScalarFieldEnum | Prisma.ProviderReferralLinkScalarFieldEnum[];
};
export type ProviderReferralLinkFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkSelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkInclude<ExtArgs> | null;
    where?: Prisma.ProviderReferralLinkWhereInput;
    orderBy?: Prisma.ProviderReferralLinkOrderByWithRelationInput | Prisma.ProviderReferralLinkOrderByWithRelationInput[];
    cursor?: Prisma.ProviderReferralLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProviderReferralLinkScalarFieldEnum | Prisma.ProviderReferralLinkScalarFieldEnum[];
};
export type ProviderReferralLinkCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkSelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProviderReferralLinkCreateInput, Prisma.ProviderReferralLinkUncheckedCreateInput>;
};
export type ProviderReferralLinkCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProviderReferralLinkCreateManyInput | Prisma.ProviderReferralLinkCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProviderReferralLinkCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkOmit<ExtArgs> | null;
    data: Prisma.ProviderReferralLinkCreateManyInput | Prisma.ProviderReferralLinkCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProviderReferralLinkUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkSelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProviderReferralLinkUpdateInput, Prisma.ProviderReferralLinkUncheckedUpdateInput>;
    where: Prisma.ProviderReferralLinkWhereUniqueInput;
};
export type ProviderReferralLinkUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProviderReferralLinkUpdateManyMutationInput, Prisma.ProviderReferralLinkUncheckedUpdateManyInput>;
    where?: Prisma.ProviderReferralLinkWhereInput;
    limit?: number;
};
export type ProviderReferralLinkUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProviderReferralLinkUpdateManyMutationInput, Prisma.ProviderReferralLinkUncheckedUpdateManyInput>;
    where?: Prisma.ProviderReferralLinkWhereInput;
    limit?: number;
};
export type ProviderReferralLinkUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkSelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkInclude<ExtArgs> | null;
    where: Prisma.ProviderReferralLinkWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProviderReferralLinkCreateInput, Prisma.ProviderReferralLinkUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProviderReferralLinkUpdateInput, Prisma.ProviderReferralLinkUncheckedUpdateInput>;
};
export type ProviderReferralLinkDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkSelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkInclude<ExtArgs> | null;
    where: Prisma.ProviderReferralLinkWhereUniqueInput;
};
export type ProviderReferralLinkDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProviderReferralLinkWhereInput;
    limit?: number;
};
export type ProviderReferralLink$dailyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkDailySelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkDailyOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkDailyInclude<ExtArgs> | null;
    where?: Prisma.ProviderReferralLinkDailyWhereInput;
    orderBy?: Prisma.ProviderReferralLinkDailyOrderByWithRelationInput | Prisma.ProviderReferralLinkDailyOrderByWithRelationInput[];
    cursor?: Prisma.ProviderReferralLinkDailyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProviderReferralLinkDailyScalarFieldEnum | Prisma.ProviderReferralLinkDailyScalarFieldEnum[];
};
export type ProviderReferralLinkDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProviderReferralLinkSelect<ExtArgs> | null;
    omit?: Prisma.ProviderReferralLinkOmit<ExtArgs> | null;
    include?: Prisma.ProviderReferralLinkInclude<ExtArgs> | null;
};
