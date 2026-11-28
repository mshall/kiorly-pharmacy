import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type BranchMarketplaceSettingModel = runtime.Types.Result.DefaultSelection<Prisma.$BranchMarketplaceSettingPayload>;
export type AggregateBranchMarketplaceSetting = {
    _count: BranchMarketplaceSettingCountAggregateOutputType | null;
    _avg: BranchMarketplaceSettingAvgAggregateOutputType | null;
    _sum: BranchMarketplaceSettingSumAggregateOutputType | null;
    _min: BranchMarketplaceSettingMinAggregateOutputType | null;
    _max: BranchMarketplaceSettingMaxAggregateOutputType | null;
};
export type BranchMarketplaceSettingAvgAggregateOutputType = {
    deliveryRadiusKm: runtime.Decimal | null;
    prepMinutes: number | null;
    slaMinutes: number | null;
    latitude: runtime.Decimal | null;
    longitude: runtime.Decimal | null;
};
export type BranchMarketplaceSettingSumAggregateOutputType = {
    deliveryRadiusKm: runtime.Decimal | null;
    prepMinutes: number | null;
    slaMinutes: number | null;
    latitude: runtime.Decimal | null;
    longitude: runtime.Decimal | null;
};
export type BranchMarketplaceSettingMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    optedIn: boolean | null;
    deliveryRadiusKm: runtime.Decimal | null;
    prepMinutes: number | null;
    slaMinutes: number | null;
    latitude: runtime.Decimal | null;
    longitude: runtime.Decimal | null;
    updatedAt: Date | null;
};
export type BranchMarketplaceSettingMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    optedIn: boolean | null;
    deliveryRadiusKm: runtime.Decimal | null;
    prepMinutes: number | null;
    slaMinutes: number | null;
    latitude: runtime.Decimal | null;
    longitude: runtime.Decimal | null;
    updatedAt: Date | null;
};
export type BranchMarketplaceSettingCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    optedIn: number;
    deliveryRadiusKm: number;
    openingHours: number;
    prepMinutes: number;
    slaMinutes: number;
    latitude: number;
    longitude: number;
    updatedAt: number;
    _all: number;
};
export type BranchMarketplaceSettingAvgAggregateInputType = {
    deliveryRadiusKm?: true;
    prepMinutes?: true;
    slaMinutes?: true;
    latitude?: true;
    longitude?: true;
};
export type BranchMarketplaceSettingSumAggregateInputType = {
    deliveryRadiusKm?: true;
    prepMinutes?: true;
    slaMinutes?: true;
    latitude?: true;
    longitude?: true;
};
export type BranchMarketplaceSettingMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    optedIn?: true;
    deliveryRadiusKm?: true;
    prepMinutes?: true;
    slaMinutes?: true;
    latitude?: true;
    longitude?: true;
    updatedAt?: true;
};
export type BranchMarketplaceSettingMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    optedIn?: true;
    deliveryRadiusKm?: true;
    prepMinutes?: true;
    slaMinutes?: true;
    latitude?: true;
    longitude?: true;
    updatedAt?: true;
};
export type BranchMarketplaceSettingCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    optedIn?: true;
    deliveryRadiusKm?: true;
    openingHours?: true;
    prepMinutes?: true;
    slaMinutes?: true;
    latitude?: true;
    longitude?: true;
    updatedAt?: true;
    _all?: true;
};
export type BranchMarketplaceSettingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BranchMarketplaceSettingWhereInput;
    orderBy?: Prisma.BranchMarketplaceSettingOrderByWithRelationInput | Prisma.BranchMarketplaceSettingOrderByWithRelationInput[];
    cursor?: Prisma.BranchMarketplaceSettingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BranchMarketplaceSettingCountAggregateInputType;
    _avg?: BranchMarketplaceSettingAvgAggregateInputType;
    _sum?: BranchMarketplaceSettingSumAggregateInputType;
    _min?: BranchMarketplaceSettingMinAggregateInputType;
    _max?: BranchMarketplaceSettingMaxAggregateInputType;
};
export type GetBranchMarketplaceSettingAggregateType<T extends BranchMarketplaceSettingAggregateArgs> = {
    [P in keyof T & keyof AggregateBranchMarketplaceSetting]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBranchMarketplaceSetting[P]> : Prisma.GetScalarType<T[P], AggregateBranchMarketplaceSetting[P]>;
};
export type BranchMarketplaceSettingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BranchMarketplaceSettingWhereInput;
    orderBy?: Prisma.BranchMarketplaceSettingOrderByWithAggregationInput | Prisma.BranchMarketplaceSettingOrderByWithAggregationInput[];
    by: Prisma.BranchMarketplaceSettingScalarFieldEnum[] | Prisma.BranchMarketplaceSettingScalarFieldEnum;
    having?: Prisma.BranchMarketplaceSettingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BranchMarketplaceSettingCountAggregateInputType | true;
    _avg?: BranchMarketplaceSettingAvgAggregateInputType;
    _sum?: BranchMarketplaceSettingSumAggregateInputType;
    _min?: BranchMarketplaceSettingMinAggregateInputType;
    _max?: BranchMarketplaceSettingMaxAggregateInputType;
};
export type BranchMarketplaceSettingGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    optedIn: boolean;
    deliveryRadiusKm: runtime.Decimal;
    openingHours: runtime.JsonValue | null;
    prepMinutes: number;
    slaMinutes: number;
    latitude: runtime.Decimal | null;
    longitude: runtime.Decimal | null;
    updatedAt: Date;
    _count: BranchMarketplaceSettingCountAggregateOutputType | null;
    _avg: BranchMarketplaceSettingAvgAggregateOutputType | null;
    _sum: BranchMarketplaceSettingSumAggregateOutputType | null;
    _min: BranchMarketplaceSettingMinAggregateOutputType | null;
    _max: BranchMarketplaceSettingMaxAggregateOutputType | null;
};
export type GetBranchMarketplaceSettingGroupByPayload<T extends BranchMarketplaceSettingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BranchMarketplaceSettingGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BranchMarketplaceSettingGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BranchMarketplaceSettingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BranchMarketplaceSettingGroupByOutputType[P]>;
}>>;
export type BranchMarketplaceSettingWhereInput = {
    AND?: Prisma.BranchMarketplaceSettingWhereInput | Prisma.BranchMarketplaceSettingWhereInput[];
    OR?: Prisma.BranchMarketplaceSettingWhereInput[];
    NOT?: Prisma.BranchMarketplaceSettingWhereInput | Prisma.BranchMarketplaceSettingWhereInput[];
    id?: Prisma.StringFilter<"BranchMarketplaceSetting"> | string;
    orgId?: Prisma.StringFilter<"BranchMarketplaceSetting"> | string;
    branchId?: Prisma.StringFilter<"BranchMarketplaceSetting"> | string;
    optedIn?: Prisma.BoolFilter<"BranchMarketplaceSetting"> | boolean;
    deliveryRadiusKm?: Prisma.DecimalFilter<"BranchMarketplaceSetting"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    openingHours?: Prisma.JsonNullableFilter<"BranchMarketplaceSetting">;
    prepMinutes?: Prisma.IntFilter<"BranchMarketplaceSetting"> | number;
    slaMinutes?: Prisma.IntFilter<"BranchMarketplaceSetting"> | number;
    latitude?: Prisma.DecimalNullableFilter<"BranchMarketplaceSetting"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.DecimalNullableFilter<"BranchMarketplaceSetting"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    updatedAt?: Prisma.DateTimeFilter<"BranchMarketplaceSetting"> | Date | string;
};
export type BranchMarketplaceSettingOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    optedIn?: Prisma.SortOrder;
    deliveryRadiusKm?: Prisma.SortOrder;
    openingHours?: Prisma.SortOrderInput | Prisma.SortOrder;
    prepMinutes?: Prisma.SortOrder;
    slaMinutes?: Prisma.SortOrder;
    latitude?: Prisma.SortOrderInput | Prisma.SortOrder;
    longitude?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BranchMarketplaceSettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    branchId?: string;
    AND?: Prisma.BranchMarketplaceSettingWhereInput | Prisma.BranchMarketplaceSettingWhereInput[];
    OR?: Prisma.BranchMarketplaceSettingWhereInput[];
    NOT?: Prisma.BranchMarketplaceSettingWhereInput | Prisma.BranchMarketplaceSettingWhereInput[];
    orgId?: Prisma.StringFilter<"BranchMarketplaceSetting"> | string;
    optedIn?: Prisma.BoolFilter<"BranchMarketplaceSetting"> | boolean;
    deliveryRadiusKm?: Prisma.DecimalFilter<"BranchMarketplaceSetting"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    openingHours?: Prisma.JsonNullableFilter<"BranchMarketplaceSetting">;
    prepMinutes?: Prisma.IntFilter<"BranchMarketplaceSetting"> | number;
    slaMinutes?: Prisma.IntFilter<"BranchMarketplaceSetting"> | number;
    latitude?: Prisma.DecimalNullableFilter<"BranchMarketplaceSetting"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.DecimalNullableFilter<"BranchMarketplaceSetting"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    updatedAt?: Prisma.DateTimeFilter<"BranchMarketplaceSetting"> | Date | string;
}, "id" | "branchId">;
export type BranchMarketplaceSettingOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    optedIn?: Prisma.SortOrder;
    deliveryRadiusKm?: Prisma.SortOrder;
    openingHours?: Prisma.SortOrderInput | Prisma.SortOrder;
    prepMinutes?: Prisma.SortOrder;
    slaMinutes?: Prisma.SortOrder;
    latitude?: Prisma.SortOrderInput | Prisma.SortOrder;
    longitude?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BranchMarketplaceSettingCountOrderByAggregateInput;
    _avg?: Prisma.BranchMarketplaceSettingAvgOrderByAggregateInput;
    _max?: Prisma.BranchMarketplaceSettingMaxOrderByAggregateInput;
    _min?: Prisma.BranchMarketplaceSettingMinOrderByAggregateInput;
    _sum?: Prisma.BranchMarketplaceSettingSumOrderByAggregateInput;
};
export type BranchMarketplaceSettingScalarWhereWithAggregatesInput = {
    AND?: Prisma.BranchMarketplaceSettingScalarWhereWithAggregatesInput | Prisma.BranchMarketplaceSettingScalarWhereWithAggregatesInput[];
    OR?: Prisma.BranchMarketplaceSettingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BranchMarketplaceSettingScalarWhereWithAggregatesInput | Prisma.BranchMarketplaceSettingScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"BranchMarketplaceSetting"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"BranchMarketplaceSetting"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"BranchMarketplaceSetting"> | string;
    optedIn?: Prisma.BoolWithAggregatesFilter<"BranchMarketplaceSetting"> | boolean;
    deliveryRadiusKm?: Prisma.DecimalWithAggregatesFilter<"BranchMarketplaceSetting"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    openingHours?: Prisma.JsonNullableWithAggregatesFilter<"BranchMarketplaceSetting">;
    prepMinutes?: Prisma.IntWithAggregatesFilter<"BranchMarketplaceSetting"> | number;
    slaMinutes?: Prisma.IntWithAggregatesFilter<"BranchMarketplaceSetting"> | number;
    latitude?: Prisma.DecimalNullableWithAggregatesFilter<"BranchMarketplaceSetting"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.DecimalNullableWithAggregatesFilter<"BranchMarketplaceSetting"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"BranchMarketplaceSetting"> | Date | string;
};
export type BranchMarketplaceSettingCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    optedIn?: boolean;
    deliveryRadiusKm?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    openingHours?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    prepMinutes?: number;
    slaMinutes?: number;
    latitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    updatedAt?: Date | string;
};
export type BranchMarketplaceSettingUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    optedIn?: boolean;
    deliveryRadiusKm?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    openingHours?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    prepMinutes?: number;
    slaMinutes?: number;
    latitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    updatedAt?: Date | string;
};
export type BranchMarketplaceSettingUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    optedIn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deliveryRadiusKm?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    openingHours?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    prepMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    slaMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    latitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BranchMarketplaceSettingUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    optedIn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deliveryRadiusKm?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    openingHours?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    prepMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    slaMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    latitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BranchMarketplaceSettingCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    optedIn?: boolean;
    deliveryRadiusKm?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    openingHours?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    prepMinutes?: number;
    slaMinutes?: number;
    latitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    updatedAt?: Date | string;
};
export type BranchMarketplaceSettingUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    optedIn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deliveryRadiusKm?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    openingHours?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    prepMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    slaMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    latitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BranchMarketplaceSettingUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    optedIn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    deliveryRadiusKm?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    openingHours?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    prepMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    slaMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    latitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BranchMarketplaceSettingCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    optedIn?: Prisma.SortOrder;
    deliveryRadiusKm?: Prisma.SortOrder;
    openingHours?: Prisma.SortOrder;
    prepMinutes?: Prisma.SortOrder;
    slaMinutes?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BranchMarketplaceSettingAvgOrderByAggregateInput = {
    deliveryRadiusKm?: Prisma.SortOrder;
    prepMinutes?: Prisma.SortOrder;
    slaMinutes?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
};
export type BranchMarketplaceSettingMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    optedIn?: Prisma.SortOrder;
    deliveryRadiusKm?: Prisma.SortOrder;
    prepMinutes?: Prisma.SortOrder;
    slaMinutes?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BranchMarketplaceSettingMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    optedIn?: Prisma.SortOrder;
    deliveryRadiusKm?: Prisma.SortOrder;
    prepMinutes?: Prisma.SortOrder;
    slaMinutes?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BranchMarketplaceSettingSumOrderByAggregateInput = {
    deliveryRadiusKm?: Prisma.SortOrder;
    prepMinutes?: Prisma.SortOrder;
    slaMinutes?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
};
export type BranchMarketplaceSettingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    optedIn?: boolean;
    deliveryRadiusKm?: boolean;
    openingHours?: boolean;
    prepMinutes?: boolean;
    slaMinutes?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["branchMarketplaceSetting"]>;
export type BranchMarketplaceSettingSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    optedIn?: boolean;
    deliveryRadiusKm?: boolean;
    openingHours?: boolean;
    prepMinutes?: boolean;
    slaMinutes?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["branchMarketplaceSetting"]>;
export type BranchMarketplaceSettingSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    optedIn?: boolean;
    deliveryRadiusKm?: boolean;
    openingHours?: boolean;
    prepMinutes?: boolean;
    slaMinutes?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["branchMarketplaceSetting"]>;
export type BranchMarketplaceSettingSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    optedIn?: boolean;
    deliveryRadiusKm?: boolean;
    openingHours?: boolean;
    prepMinutes?: boolean;
    slaMinutes?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    updatedAt?: boolean;
};
export type BranchMarketplaceSettingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "optedIn" | "deliveryRadiusKm" | "openingHours" | "prepMinutes" | "slaMinutes" | "latitude" | "longitude" | "updatedAt", ExtArgs["result"]["branchMarketplaceSetting"]>;
export type $BranchMarketplaceSettingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BranchMarketplaceSetting";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        optedIn: boolean;
        deliveryRadiusKm: runtime.Decimal;
        openingHours: runtime.JsonValue | null;
        prepMinutes: number;
        slaMinutes: number;
        latitude: runtime.Decimal | null;
        longitude: runtime.Decimal | null;
        updatedAt: Date;
    }, ExtArgs["result"]["branchMarketplaceSetting"]>;
    composites: {};
};
export type BranchMarketplaceSettingGetPayload<S extends boolean | null | undefined | BranchMarketplaceSettingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BranchMarketplaceSettingPayload, S>;
export type BranchMarketplaceSettingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BranchMarketplaceSettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BranchMarketplaceSettingCountAggregateInputType | true;
};
export interface BranchMarketplaceSettingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BranchMarketplaceSetting'];
        meta: {
            name: 'BranchMarketplaceSetting';
        };
    };
    findUnique<T extends BranchMarketplaceSettingFindUniqueArgs>(args: Prisma.SelectSubset<T, BranchMarketplaceSettingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BranchMarketplaceSettingClient<runtime.Types.Result.GetResult<Prisma.$BranchMarketplaceSettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BranchMarketplaceSettingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BranchMarketplaceSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BranchMarketplaceSettingClient<runtime.Types.Result.GetResult<Prisma.$BranchMarketplaceSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BranchMarketplaceSettingFindFirstArgs>(args?: Prisma.SelectSubset<T, BranchMarketplaceSettingFindFirstArgs<ExtArgs>>): Prisma.Prisma__BranchMarketplaceSettingClient<runtime.Types.Result.GetResult<Prisma.$BranchMarketplaceSettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BranchMarketplaceSettingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BranchMarketplaceSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BranchMarketplaceSettingClient<runtime.Types.Result.GetResult<Prisma.$BranchMarketplaceSettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BranchMarketplaceSettingFindManyArgs>(args?: Prisma.SelectSubset<T, BranchMarketplaceSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchMarketplaceSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BranchMarketplaceSettingCreateArgs>(args: Prisma.SelectSubset<T, BranchMarketplaceSettingCreateArgs<ExtArgs>>): Prisma.Prisma__BranchMarketplaceSettingClient<runtime.Types.Result.GetResult<Prisma.$BranchMarketplaceSettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BranchMarketplaceSettingCreateManyArgs>(args?: Prisma.SelectSubset<T, BranchMarketplaceSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BranchMarketplaceSettingCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BranchMarketplaceSettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchMarketplaceSettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BranchMarketplaceSettingDeleteArgs>(args: Prisma.SelectSubset<T, BranchMarketplaceSettingDeleteArgs<ExtArgs>>): Prisma.Prisma__BranchMarketplaceSettingClient<runtime.Types.Result.GetResult<Prisma.$BranchMarketplaceSettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BranchMarketplaceSettingUpdateArgs>(args: Prisma.SelectSubset<T, BranchMarketplaceSettingUpdateArgs<ExtArgs>>): Prisma.Prisma__BranchMarketplaceSettingClient<runtime.Types.Result.GetResult<Prisma.$BranchMarketplaceSettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BranchMarketplaceSettingDeleteManyArgs>(args?: Prisma.SelectSubset<T, BranchMarketplaceSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BranchMarketplaceSettingUpdateManyArgs>(args: Prisma.SelectSubset<T, BranchMarketplaceSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BranchMarketplaceSettingUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BranchMarketplaceSettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchMarketplaceSettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BranchMarketplaceSettingUpsertArgs>(args: Prisma.SelectSubset<T, BranchMarketplaceSettingUpsertArgs<ExtArgs>>): Prisma.Prisma__BranchMarketplaceSettingClient<runtime.Types.Result.GetResult<Prisma.$BranchMarketplaceSettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BranchMarketplaceSettingCountArgs>(args?: Prisma.Subset<T, BranchMarketplaceSettingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BranchMarketplaceSettingCountAggregateOutputType> : number>;
    aggregate<T extends BranchMarketplaceSettingAggregateArgs>(args: Prisma.Subset<T, BranchMarketplaceSettingAggregateArgs>): Prisma.PrismaPromise<GetBranchMarketplaceSettingAggregateType<T>>;
    groupBy<T extends BranchMarketplaceSettingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BranchMarketplaceSettingGroupByArgs['orderBy'];
    } : {
        orderBy?: BranchMarketplaceSettingGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BranchMarketplaceSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBranchMarketplaceSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BranchMarketplaceSettingFieldRefs;
}
export interface Prisma__BranchMarketplaceSettingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BranchMarketplaceSettingFieldRefs {
    readonly id: Prisma.FieldRef<"BranchMarketplaceSetting", 'String'>;
    readonly orgId: Prisma.FieldRef<"BranchMarketplaceSetting", 'String'>;
    readonly branchId: Prisma.FieldRef<"BranchMarketplaceSetting", 'String'>;
    readonly optedIn: Prisma.FieldRef<"BranchMarketplaceSetting", 'Boolean'>;
    readonly deliveryRadiusKm: Prisma.FieldRef<"BranchMarketplaceSetting", 'Decimal'>;
    readonly openingHours: Prisma.FieldRef<"BranchMarketplaceSetting", 'Json'>;
    readonly prepMinutes: Prisma.FieldRef<"BranchMarketplaceSetting", 'Int'>;
    readonly slaMinutes: Prisma.FieldRef<"BranchMarketplaceSetting", 'Int'>;
    readonly latitude: Prisma.FieldRef<"BranchMarketplaceSetting", 'Decimal'>;
    readonly longitude: Prisma.FieldRef<"BranchMarketplaceSetting", 'Decimal'>;
    readonly updatedAt: Prisma.FieldRef<"BranchMarketplaceSetting", 'DateTime'>;
}
export type BranchMarketplaceSettingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchMarketplaceSettingSelect<ExtArgs> | null;
    omit?: Prisma.BranchMarketplaceSettingOmit<ExtArgs> | null;
    where: Prisma.BranchMarketplaceSettingWhereUniqueInput;
};
export type BranchMarketplaceSettingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchMarketplaceSettingSelect<ExtArgs> | null;
    omit?: Prisma.BranchMarketplaceSettingOmit<ExtArgs> | null;
    where: Prisma.BranchMarketplaceSettingWhereUniqueInput;
};
export type BranchMarketplaceSettingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchMarketplaceSettingSelect<ExtArgs> | null;
    omit?: Prisma.BranchMarketplaceSettingOmit<ExtArgs> | null;
    where?: Prisma.BranchMarketplaceSettingWhereInput;
    orderBy?: Prisma.BranchMarketplaceSettingOrderByWithRelationInput | Prisma.BranchMarketplaceSettingOrderByWithRelationInput[];
    cursor?: Prisma.BranchMarketplaceSettingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BranchMarketplaceSettingScalarFieldEnum | Prisma.BranchMarketplaceSettingScalarFieldEnum[];
};
export type BranchMarketplaceSettingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchMarketplaceSettingSelect<ExtArgs> | null;
    omit?: Prisma.BranchMarketplaceSettingOmit<ExtArgs> | null;
    where?: Prisma.BranchMarketplaceSettingWhereInput;
    orderBy?: Prisma.BranchMarketplaceSettingOrderByWithRelationInput | Prisma.BranchMarketplaceSettingOrderByWithRelationInput[];
    cursor?: Prisma.BranchMarketplaceSettingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BranchMarketplaceSettingScalarFieldEnum | Prisma.BranchMarketplaceSettingScalarFieldEnum[];
};
export type BranchMarketplaceSettingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchMarketplaceSettingSelect<ExtArgs> | null;
    omit?: Prisma.BranchMarketplaceSettingOmit<ExtArgs> | null;
    where?: Prisma.BranchMarketplaceSettingWhereInput;
    orderBy?: Prisma.BranchMarketplaceSettingOrderByWithRelationInput | Prisma.BranchMarketplaceSettingOrderByWithRelationInput[];
    cursor?: Prisma.BranchMarketplaceSettingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BranchMarketplaceSettingScalarFieldEnum | Prisma.BranchMarketplaceSettingScalarFieldEnum[];
};
export type BranchMarketplaceSettingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchMarketplaceSettingSelect<ExtArgs> | null;
    omit?: Prisma.BranchMarketplaceSettingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BranchMarketplaceSettingCreateInput, Prisma.BranchMarketplaceSettingUncheckedCreateInput>;
};
export type BranchMarketplaceSettingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BranchMarketplaceSettingCreateManyInput | Prisma.BranchMarketplaceSettingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BranchMarketplaceSettingCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchMarketplaceSettingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BranchMarketplaceSettingOmit<ExtArgs> | null;
    data: Prisma.BranchMarketplaceSettingCreateManyInput | Prisma.BranchMarketplaceSettingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BranchMarketplaceSettingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchMarketplaceSettingSelect<ExtArgs> | null;
    omit?: Prisma.BranchMarketplaceSettingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BranchMarketplaceSettingUpdateInput, Prisma.BranchMarketplaceSettingUncheckedUpdateInput>;
    where: Prisma.BranchMarketplaceSettingWhereUniqueInput;
};
export type BranchMarketplaceSettingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BranchMarketplaceSettingUpdateManyMutationInput, Prisma.BranchMarketplaceSettingUncheckedUpdateManyInput>;
    where?: Prisma.BranchMarketplaceSettingWhereInput;
    limit?: number;
};
export type BranchMarketplaceSettingUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchMarketplaceSettingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BranchMarketplaceSettingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BranchMarketplaceSettingUpdateManyMutationInput, Prisma.BranchMarketplaceSettingUncheckedUpdateManyInput>;
    where?: Prisma.BranchMarketplaceSettingWhereInput;
    limit?: number;
};
export type BranchMarketplaceSettingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchMarketplaceSettingSelect<ExtArgs> | null;
    omit?: Prisma.BranchMarketplaceSettingOmit<ExtArgs> | null;
    where: Prisma.BranchMarketplaceSettingWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchMarketplaceSettingCreateInput, Prisma.BranchMarketplaceSettingUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BranchMarketplaceSettingUpdateInput, Prisma.BranchMarketplaceSettingUncheckedUpdateInput>;
};
export type BranchMarketplaceSettingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchMarketplaceSettingSelect<ExtArgs> | null;
    omit?: Prisma.BranchMarketplaceSettingOmit<ExtArgs> | null;
    where: Prisma.BranchMarketplaceSettingWhereUniqueInput;
};
export type BranchMarketplaceSettingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BranchMarketplaceSettingWhereInput;
    limit?: number;
};
export type BranchMarketplaceSettingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchMarketplaceSettingSelect<ExtArgs> | null;
    omit?: Prisma.BranchMarketplaceSettingOmit<ExtArgs> | null;
};
