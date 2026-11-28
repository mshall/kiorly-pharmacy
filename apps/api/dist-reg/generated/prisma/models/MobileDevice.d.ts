import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type MobileDeviceModel = runtime.Types.Result.DefaultSelection<Prisma.$MobileDevicePayload>;
export type AggregateMobileDevice = {
    _count: MobileDeviceCountAggregateOutputType | null;
    _min: MobileDeviceMinAggregateOutputType | null;
    _max: MobileDeviceMaxAggregateOutputType | null;
};
export type MobileDeviceMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    userId: string | null;
    deviceId: string | null;
    platform: string | null;
    name: string | null;
    appVersion: string | null;
    tokenHash: string | null;
    pushToken: string | null;
    pushProvider: string | null;
    status: string | null;
    lastSeenAt: Date | null;
    revokedAt: Date | null;
    revokedBy: string | null;
    createdAt: Date | null;
};
export type MobileDeviceMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    userId: string | null;
    deviceId: string | null;
    platform: string | null;
    name: string | null;
    appVersion: string | null;
    tokenHash: string | null;
    pushToken: string | null;
    pushProvider: string | null;
    status: string | null;
    lastSeenAt: Date | null;
    revokedAt: Date | null;
    revokedBy: string | null;
    createdAt: Date | null;
};
export type MobileDeviceCountAggregateOutputType = {
    id: number;
    orgId: number;
    userId: number;
    deviceId: number;
    platform: number;
    name: number;
    appVersion: number;
    tokenHash: number;
    pushToken: number;
    pushProvider: number;
    status: number;
    lastSeenAt: number;
    revokedAt: number;
    revokedBy: number;
    createdAt: number;
    _all: number;
};
export type MobileDeviceMinAggregateInputType = {
    id?: true;
    orgId?: true;
    userId?: true;
    deviceId?: true;
    platform?: true;
    name?: true;
    appVersion?: true;
    tokenHash?: true;
    pushToken?: true;
    pushProvider?: true;
    status?: true;
    lastSeenAt?: true;
    revokedAt?: true;
    revokedBy?: true;
    createdAt?: true;
};
export type MobileDeviceMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    userId?: true;
    deviceId?: true;
    platform?: true;
    name?: true;
    appVersion?: true;
    tokenHash?: true;
    pushToken?: true;
    pushProvider?: true;
    status?: true;
    lastSeenAt?: true;
    revokedAt?: true;
    revokedBy?: true;
    createdAt?: true;
};
export type MobileDeviceCountAggregateInputType = {
    id?: true;
    orgId?: true;
    userId?: true;
    deviceId?: true;
    platform?: true;
    name?: true;
    appVersion?: true;
    tokenHash?: true;
    pushToken?: true;
    pushProvider?: true;
    status?: true;
    lastSeenAt?: true;
    revokedAt?: true;
    revokedBy?: true;
    createdAt?: true;
    _all?: true;
};
export type MobileDeviceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MobileDeviceWhereInput;
    orderBy?: Prisma.MobileDeviceOrderByWithRelationInput | Prisma.MobileDeviceOrderByWithRelationInput[];
    cursor?: Prisma.MobileDeviceWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MobileDeviceCountAggregateInputType;
    _min?: MobileDeviceMinAggregateInputType;
    _max?: MobileDeviceMaxAggregateInputType;
};
export type GetMobileDeviceAggregateType<T extends MobileDeviceAggregateArgs> = {
    [P in keyof T & keyof AggregateMobileDevice]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMobileDevice[P]> : Prisma.GetScalarType<T[P], AggregateMobileDevice[P]>;
};
export type MobileDeviceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MobileDeviceWhereInput;
    orderBy?: Prisma.MobileDeviceOrderByWithAggregationInput | Prisma.MobileDeviceOrderByWithAggregationInput[];
    by: Prisma.MobileDeviceScalarFieldEnum[] | Prisma.MobileDeviceScalarFieldEnum;
    having?: Prisma.MobileDeviceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MobileDeviceCountAggregateInputType | true;
    _min?: MobileDeviceMinAggregateInputType;
    _max?: MobileDeviceMaxAggregateInputType;
};
export type MobileDeviceGroupByOutputType = {
    id: string;
    orgId: string;
    userId: string;
    deviceId: string;
    platform: string;
    name: string;
    appVersion: string | null;
    tokenHash: string;
    pushToken: string | null;
    pushProvider: string | null;
    status: string;
    lastSeenAt: Date | null;
    revokedAt: Date | null;
    revokedBy: string | null;
    createdAt: Date;
    _count: MobileDeviceCountAggregateOutputType | null;
    _min: MobileDeviceMinAggregateOutputType | null;
    _max: MobileDeviceMaxAggregateOutputType | null;
};
export type GetMobileDeviceGroupByPayload<T extends MobileDeviceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MobileDeviceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MobileDeviceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MobileDeviceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MobileDeviceGroupByOutputType[P]>;
}>>;
export type MobileDeviceWhereInput = {
    AND?: Prisma.MobileDeviceWhereInput | Prisma.MobileDeviceWhereInput[];
    OR?: Prisma.MobileDeviceWhereInput[];
    NOT?: Prisma.MobileDeviceWhereInput | Prisma.MobileDeviceWhereInput[];
    id?: Prisma.StringFilter<"MobileDevice"> | string;
    orgId?: Prisma.StringFilter<"MobileDevice"> | string;
    userId?: Prisma.StringFilter<"MobileDevice"> | string;
    deviceId?: Prisma.StringFilter<"MobileDevice"> | string;
    platform?: Prisma.StringFilter<"MobileDevice"> | string;
    name?: Prisma.StringFilter<"MobileDevice"> | string;
    appVersion?: Prisma.StringNullableFilter<"MobileDevice"> | string | null;
    tokenHash?: Prisma.StringFilter<"MobileDevice"> | string;
    pushToken?: Prisma.StringNullableFilter<"MobileDevice"> | string | null;
    pushProvider?: Prisma.StringNullableFilter<"MobileDevice"> | string | null;
    status?: Prisma.StringFilter<"MobileDevice"> | string;
    lastSeenAt?: Prisma.DateTimeNullableFilter<"MobileDevice"> | Date | string | null;
    revokedAt?: Prisma.DateTimeNullableFilter<"MobileDevice"> | Date | string | null;
    revokedBy?: Prisma.StringNullableFilter<"MobileDevice"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"MobileDevice"> | Date | string;
};
export type MobileDeviceOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    deviceId?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    appVersion?: Prisma.SortOrderInput | Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    pushToken?: Prisma.SortOrderInput | Prisma.SortOrder;
    pushProvider?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    lastSeenAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    revokedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MobileDeviceWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_deviceId?: Prisma.MobileDeviceUserIdDeviceIdCompoundUniqueInput;
    AND?: Prisma.MobileDeviceWhereInput | Prisma.MobileDeviceWhereInput[];
    OR?: Prisma.MobileDeviceWhereInput[];
    NOT?: Prisma.MobileDeviceWhereInput | Prisma.MobileDeviceWhereInput[];
    orgId?: Prisma.StringFilter<"MobileDevice"> | string;
    userId?: Prisma.StringFilter<"MobileDevice"> | string;
    deviceId?: Prisma.StringFilter<"MobileDevice"> | string;
    platform?: Prisma.StringFilter<"MobileDevice"> | string;
    name?: Prisma.StringFilter<"MobileDevice"> | string;
    appVersion?: Prisma.StringNullableFilter<"MobileDevice"> | string | null;
    tokenHash?: Prisma.StringFilter<"MobileDevice"> | string;
    pushToken?: Prisma.StringNullableFilter<"MobileDevice"> | string | null;
    pushProvider?: Prisma.StringNullableFilter<"MobileDevice"> | string | null;
    status?: Prisma.StringFilter<"MobileDevice"> | string;
    lastSeenAt?: Prisma.DateTimeNullableFilter<"MobileDevice"> | Date | string | null;
    revokedAt?: Prisma.DateTimeNullableFilter<"MobileDevice"> | Date | string | null;
    revokedBy?: Prisma.StringNullableFilter<"MobileDevice"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"MobileDevice"> | Date | string;
}, "id" | "userId_deviceId">;
export type MobileDeviceOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    deviceId?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    appVersion?: Prisma.SortOrderInput | Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    pushToken?: Prisma.SortOrderInput | Prisma.SortOrder;
    pushProvider?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    lastSeenAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    revokedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.MobileDeviceCountOrderByAggregateInput;
    _max?: Prisma.MobileDeviceMaxOrderByAggregateInput;
    _min?: Prisma.MobileDeviceMinOrderByAggregateInput;
};
export type MobileDeviceScalarWhereWithAggregatesInput = {
    AND?: Prisma.MobileDeviceScalarWhereWithAggregatesInput | Prisma.MobileDeviceScalarWhereWithAggregatesInput[];
    OR?: Prisma.MobileDeviceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MobileDeviceScalarWhereWithAggregatesInput | Prisma.MobileDeviceScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"MobileDevice"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"MobileDevice"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"MobileDevice"> | string;
    deviceId?: Prisma.StringWithAggregatesFilter<"MobileDevice"> | string;
    platform?: Prisma.StringWithAggregatesFilter<"MobileDevice"> | string;
    name?: Prisma.StringWithAggregatesFilter<"MobileDevice"> | string;
    appVersion?: Prisma.StringNullableWithAggregatesFilter<"MobileDevice"> | string | null;
    tokenHash?: Prisma.StringWithAggregatesFilter<"MobileDevice"> | string;
    pushToken?: Prisma.StringNullableWithAggregatesFilter<"MobileDevice"> | string | null;
    pushProvider?: Prisma.StringNullableWithAggregatesFilter<"MobileDevice"> | string | null;
    status?: Prisma.StringWithAggregatesFilter<"MobileDevice"> | string;
    lastSeenAt?: Prisma.DateTimeNullableWithAggregatesFilter<"MobileDevice"> | Date | string | null;
    revokedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"MobileDevice"> | Date | string | null;
    revokedBy?: Prisma.StringNullableWithAggregatesFilter<"MobileDevice"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"MobileDevice"> | Date | string;
};
export type MobileDeviceCreateInput = {
    id?: string;
    orgId: string;
    userId: string;
    deviceId: string;
    platform: string;
    name: string;
    appVersion?: string | null;
    tokenHash: string;
    pushToken?: string | null;
    pushProvider?: string | null;
    status?: string;
    lastSeenAt?: Date | string | null;
    revokedAt?: Date | string | null;
    revokedBy?: string | null;
    createdAt?: Date | string;
};
export type MobileDeviceUncheckedCreateInput = {
    id?: string;
    orgId: string;
    userId: string;
    deviceId: string;
    platform: string;
    name: string;
    appVersion?: string | null;
    tokenHash: string;
    pushToken?: string | null;
    pushProvider?: string | null;
    status?: string;
    lastSeenAt?: Date | string | null;
    revokedAt?: Date | string | null;
    revokedBy?: string | null;
    createdAt?: Date | string;
};
export type MobileDeviceUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    deviceId?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    appVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    pushToken?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pushProvider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    lastSeenAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MobileDeviceUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    deviceId?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    appVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    pushToken?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pushProvider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    lastSeenAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MobileDeviceCreateManyInput = {
    id?: string;
    orgId: string;
    userId: string;
    deviceId: string;
    platform: string;
    name: string;
    appVersion?: string | null;
    tokenHash: string;
    pushToken?: string | null;
    pushProvider?: string | null;
    status?: string;
    lastSeenAt?: Date | string | null;
    revokedAt?: Date | string | null;
    revokedBy?: string | null;
    createdAt?: Date | string;
};
export type MobileDeviceUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    deviceId?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    appVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    pushToken?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pushProvider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    lastSeenAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MobileDeviceUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    deviceId?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    appVersion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    pushToken?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pushProvider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    lastSeenAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MobileDeviceUserIdDeviceIdCompoundUniqueInput = {
    userId: string;
    deviceId: string;
};
export type MobileDeviceCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    deviceId?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    appVersion?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    pushToken?: Prisma.SortOrder;
    pushProvider?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    lastSeenAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    revokedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MobileDeviceMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    deviceId?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    appVersion?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    pushToken?: Prisma.SortOrder;
    pushProvider?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    lastSeenAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    revokedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MobileDeviceMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    deviceId?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    appVersion?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    pushToken?: Prisma.SortOrder;
    pushProvider?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    lastSeenAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    revokedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MobileDeviceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    userId?: boolean;
    deviceId?: boolean;
    platform?: boolean;
    name?: boolean;
    appVersion?: boolean;
    tokenHash?: boolean;
    pushToken?: boolean;
    pushProvider?: boolean;
    status?: boolean;
    lastSeenAt?: boolean;
    revokedAt?: boolean;
    revokedBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["mobileDevice"]>;
export type MobileDeviceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    userId?: boolean;
    deviceId?: boolean;
    platform?: boolean;
    name?: boolean;
    appVersion?: boolean;
    tokenHash?: boolean;
    pushToken?: boolean;
    pushProvider?: boolean;
    status?: boolean;
    lastSeenAt?: boolean;
    revokedAt?: boolean;
    revokedBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["mobileDevice"]>;
export type MobileDeviceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    userId?: boolean;
    deviceId?: boolean;
    platform?: boolean;
    name?: boolean;
    appVersion?: boolean;
    tokenHash?: boolean;
    pushToken?: boolean;
    pushProvider?: boolean;
    status?: boolean;
    lastSeenAt?: boolean;
    revokedAt?: boolean;
    revokedBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["mobileDevice"]>;
export type MobileDeviceSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    userId?: boolean;
    deviceId?: boolean;
    platform?: boolean;
    name?: boolean;
    appVersion?: boolean;
    tokenHash?: boolean;
    pushToken?: boolean;
    pushProvider?: boolean;
    status?: boolean;
    lastSeenAt?: boolean;
    revokedAt?: boolean;
    revokedBy?: boolean;
    createdAt?: boolean;
};
export type MobileDeviceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "userId" | "deviceId" | "platform" | "name" | "appVersion" | "tokenHash" | "pushToken" | "pushProvider" | "status" | "lastSeenAt" | "revokedAt" | "revokedBy" | "createdAt", ExtArgs["result"]["mobileDevice"]>;
export type $MobileDevicePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MobileDevice";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        userId: string;
        deviceId: string;
        platform: string;
        name: string;
        appVersion: string | null;
        tokenHash: string;
        pushToken: string | null;
        pushProvider: string | null;
        status: string;
        lastSeenAt: Date | null;
        revokedAt: Date | null;
        revokedBy: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["mobileDevice"]>;
    composites: {};
};
export type MobileDeviceGetPayload<S extends boolean | null | undefined | MobileDeviceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MobileDevicePayload, S>;
export type MobileDeviceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MobileDeviceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MobileDeviceCountAggregateInputType | true;
};
export interface MobileDeviceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MobileDevice'];
        meta: {
            name: 'MobileDevice';
        };
    };
    findUnique<T extends MobileDeviceFindUniqueArgs>(args: Prisma.SelectSubset<T, MobileDeviceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MobileDeviceClient<runtime.Types.Result.GetResult<Prisma.$MobileDevicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MobileDeviceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MobileDeviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MobileDeviceClient<runtime.Types.Result.GetResult<Prisma.$MobileDevicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MobileDeviceFindFirstArgs>(args?: Prisma.SelectSubset<T, MobileDeviceFindFirstArgs<ExtArgs>>): Prisma.Prisma__MobileDeviceClient<runtime.Types.Result.GetResult<Prisma.$MobileDevicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MobileDeviceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MobileDeviceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MobileDeviceClient<runtime.Types.Result.GetResult<Prisma.$MobileDevicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MobileDeviceFindManyArgs>(args?: Prisma.SelectSubset<T, MobileDeviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MobileDevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MobileDeviceCreateArgs>(args: Prisma.SelectSubset<T, MobileDeviceCreateArgs<ExtArgs>>): Prisma.Prisma__MobileDeviceClient<runtime.Types.Result.GetResult<Prisma.$MobileDevicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MobileDeviceCreateManyArgs>(args?: Prisma.SelectSubset<T, MobileDeviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MobileDeviceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MobileDeviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MobileDevicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MobileDeviceDeleteArgs>(args: Prisma.SelectSubset<T, MobileDeviceDeleteArgs<ExtArgs>>): Prisma.Prisma__MobileDeviceClient<runtime.Types.Result.GetResult<Prisma.$MobileDevicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MobileDeviceUpdateArgs>(args: Prisma.SelectSubset<T, MobileDeviceUpdateArgs<ExtArgs>>): Prisma.Prisma__MobileDeviceClient<runtime.Types.Result.GetResult<Prisma.$MobileDevicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MobileDeviceDeleteManyArgs>(args?: Prisma.SelectSubset<T, MobileDeviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MobileDeviceUpdateManyArgs>(args: Prisma.SelectSubset<T, MobileDeviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MobileDeviceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MobileDeviceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MobileDevicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MobileDeviceUpsertArgs>(args: Prisma.SelectSubset<T, MobileDeviceUpsertArgs<ExtArgs>>): Prisma.Prisma__MobileDeviceClient<runtime.Types.Result.GetResult<Prisma.$MobileDevicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MobileDeviceCountArgs>(args?: Prisma.Subset<T, MobileDeviceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MobileDeviceCountAggregateOutputType> : number>;
    aggregate<T extends MobileDeviceAggregateArgs>(args: Prisma.Subset<T, MobileDeviceAggregateArgs>): Prisma.PrismaPromise<GetMobileDeviceAggregateType<T>>;
    groupBy<T extends MobileDeviceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MobileDeviceGroupByArgs['orderBy'];
    } : {
        orderBy?: MobileDeviceGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MobileDeviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMobileDeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MobileDeviceFieldRefs;
}
export interface Prisma__MobileDeviceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MobileDeviceFieldRefs {
    readonly id: Prisma.FieldRef<"MobileDevice", 'String'>;
    readonly orgId: Prisma.FieldRef<"MobileDevice", 'String'>;
    readonly userId: Prisma.FieldRef<"MobileDevice", 'String'>;
    readonly deviceId: Prisma.FieldRef<"MobileDevice", 'String'>;
    readonly platform: Prisma.FieldRef<"MobileDevice", 'String'>;
    readonly name: Prisma.FieldRef<"MobileDevice", 'String'>;
    readonly appVersion: Prisma.FieldRef<"MobileDevice", 'String'>;
    readonly tokenHash: Prisma.FieldRef<"MobileDevice", 'String'>;
    readonly pushToken: Prisma.FieldRef<"MobileDevice", 'String'>;
    readonly pushProvider: Prisma.FieldRef<"MobileDevice", 'String'>;
    readonly status: Prisma.FieldRef<"MobileDevice", 'String'>;
    readonly lastSeenAt: Prisma.FieldRef<"MobileDevice", 'DateTime'>;
    readonly revokedAt: Prisma.FieldRef<"MobileDevice", 'DateTime'>;
    readonly revokedBy: Prisma.FieldRef<"MobileDevice", 'String'>;
    readonly createdAt: Prisma.FieldRef<"MobileDevice", 'DateTime'>;
}
export type MobileDeviceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileDeviceSelect<ExtArgs> | null;
    omit?: Prisma.MobileDeviceOmit<ExtArgs> | null;
    where: Prisma.MobileDeviceWhereUniqueInput;
};
export type MobileDeviceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileDeviceSelect<ExtArgs> | null;
    omit?: Prisma.MobileDeviceOmit<ExtArgs> | null;
    where: Prisma.MobileDeviceWhereUniqueInput;
};
export type MobileDeviceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileDeviceSelect<ExtArgs> | null;
    omit?: Prisma.MobileDeviceOmit<ExtArgs> | null;
    where?: Prisma.MobileDeviceWhereInput;
    orderBy?: Prisma.MobileDeviceOrderByWithRelationInput | Prisma.MobileDeviceOrderByWithRelationInput[];
    cursor?: Prisma.MobileDeviceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MobileDeviceScalarFieldEnum | Prisma.MobileDeviceScalarFieldEnum[];
};
export type MobileDeviceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileDeviceSelect<ExtArgs> | null;
    omit?: Prisma.MobileDeviceOmit<ExtArgs> | null;
    where?: Prisma.MobileDeviceWhereInput;
    orderBy?: Prisma.MobileDeviceOrderByWithRelationInput | Prisma.MobileDeviceOrderByWithRelationInput[];
    cursor?: Prisma.MobileDeviceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MobileDeviceScalarFieldEnum | Prisma.MobileDeviceScalarFieldEnum[];
};
export type MobileDeviceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileDeviceSelect<ExtArgs> | null;
    omit?: Prisma.MobileDeviceOmit<ExtArgs> | null;
    where?: Prisma.MobileDeviceWhereInput;
    orderBy?: Prisma.MobileDeviceOrderByWithRelationInput | Prisma.MobileDeviceOrderByWithRelationInput[];
    cursor?: Prisma.MobileDeviceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MobileDeviceScalarFieldEnum | Prisma.MobileDeviceScalarFieldEnum[];
};
export type MobileDeviceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileDeviceSelect<ExtArgs> | null;
    omit?: Prisma.MobileDeviceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MobileDeviceCreateInput, Prisma.MobileDeviceUncheckedCreateInput>;
};
export type MobileDeviceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MobileDeviceCreateManyInput | Prisma.MobileDeviceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MobileDeviceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileDeviceSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MobileDeviceOmit<ExtArgs> | null;
    data: Prisma.MobileDeviceCreateManyInput | Prisma.MobileDeviceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MobileDeviceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileDeviceSelect<ExtArgs> | null;
    omit?: Prisma.MobileDeviceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MobileDeviceUpdateInput, Prisma.MobileDeviceUncheckedUpdateInput>;
    where: Prisma.MobileDeviceWhereUniqueInput;
};
export type MobileDeviceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MobileDeviceUpdateManyMutationInput, Prisma.MobileDeviceUncheckedUpdateManyInput>;
    where?: Prisma.MobileDeviceWhereInput;
    limit?: number;
};
export type MobileDeviceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileDeviceSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MobileDeviceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MobileDeviceUpdateManyMutationInput, Prisma.MobileDeviceUncheckedUpdateManyInput>;
    where?: Prisma.MobileDeviceWhereInput;
    limit?: number;
};
export type MobileDeviceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileDeviceSelect<ExtArgs> | null;
    omit?: Prisma.MobileDeviceOmit<ExtArgs> | null;
    where: Prisma.MobileDeviceWhereUniqueInput;
    create: Prisma.XOR<Prisma.MobileDeviceCreateInput, Prisma.MobileDeviceUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MobileDeviceUpdateInput, Prisma.MobileDeviceUncheckedUpdateInput>;
};
export type MobileDeviceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileDeviceSelect<ExtArgs> | null;
    omit?: Prisma.MobileDeviceOmit<ExtArgs> | null;
    where: Prisma.MobileDeviceWhereUniqueInput;
};
export type MobileDeviceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MobileDeviceWhereInput;
    limit?: number;
};
export type MobileDeviceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileDeviceSelect<ExtArgs> | null;
    omit?: Prisma.MobileDeviceOmit<ExtArgs> | null;
};
