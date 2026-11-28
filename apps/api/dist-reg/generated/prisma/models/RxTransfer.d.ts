import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type RxTransferModel = runtime.Types.Result.DefaultSelection<Prisma.$RxTransferPayload>;
export type AggregateRxTransfer = {
    _count: RxTransferCountAggregateOutputType | null;
    _min: RxTransferMinAggregateOutputType | null;
    _max: RxTransferMaxAggregateOutputType | null;
};
export type RxTransferMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    direction: string | null;
    prescriptionId: string | null;
    counterpartyName: string | null;
    counterpartyPhone: string | null;
    counterpartyPharmacist: string | null;
    counterpartyLicenceNo: string | null;
    reason: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type RxTransferMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    direction: string | null;
    prescriptionId: string | null;
    counterpartyName: string | null;
    counterpartyPhone: string | null;
    counterpartyPharmacist: string | null;
    counterpartyLicenceNo: string | null;
    reason: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type RxTransferCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    direction: number;
    prescriptionId: number;
    counterpartyName: number;
    counterpartyPhone: number;
    counterpartyPharmacist: number;
    counterpartyLicenceNo: number;
    reason: number;
    snapshot: number;
    createdBy: number;
    createdAt: number;
    _all: number;
};
export type RxTransferMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    direction?: true;
    prescriptionId?: true;
    counterpartyName?: true;
    counterpartyPhone?: true;
    counterpartyPharmacist?: true;
    counterpartyLicenceNo?: true;
    reason?: true;
    createdBy?: true;
    createdAt?: true;
};
export type RxTransferMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    direction?: true;
    prescriptionId?: true;
    counterpartyName?: true;
    counterpartyPhone?: true;
    counterpartyPharmacist?: true;
    counterpartyLicenceNo?: true;
    reason?: true;
    createdBy?: true;
    createdAt?: true;
};
export type RxTransferCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    direction?: true;
    prescriptionId?: true;
    counterpartyName?: true;
    counterpartyPhone?: true;
    counterpartyPharmacist?: true;
    counterpartyLicenceNo?: true;
    reason?: true;
    snapshot?: true;
    createdBy?: true;
    createdAt?: true;
    _all?: true;
};
export type RxTransferAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RxTransferWhereInput;
    orderBy?: Prisma.RxTransferOrderByWithRelationInput | Prisma.RxTransferOrderByWithRelationInput[];
    cursor?: Prisma.RxTransferWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RxTransferCountAggregateInputType;
    _min?: RxTransferMinAggregateInputType;
    _max?: RxTransferMaxAggregateInputType;
};
export type GetRxTransferAggregateType<T extends RxTransferAggregateArgs> = {
    [P in keyof T & keyof AggregateRxTransfer]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRxTransfer[P]> : Prisma.GetScalarType<T[P], AggregateRxTransfer[P]>;
};
export type RxTransferGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RxTransferWhereInput;
    orderBy?: Prisma.RxTransferOrderByWithAggregationInput | Prisma.RxTransferOrderByWithAggregationInput[];
    by: Prisma.RxTransferScalarFieldEnum[] | Prisma.RxTransferScalarFieldEnum;
    having?: Prisma.RxTransferScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RxTransferCountAggregateInputType | true;
    _min?: RxTransferMinAggregateInputType;
    _max?: RxTransferMaxAggregateInputType;
};
export type RxTransferGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    direction: string;
    prescriptionId: string;
    counterpartyName: string;
    counterpartyPhone: string | null;
    counterpartyPharmacist: string | null;
    counterpartyLicenceNo: string | null;
    reason: string | null;
    snapshot: runtime.JsonValue | null;
    createdBy: string;
    createdAt: Date;
    _count: RxTransferCountAggregateOutputType | null;
    _min: RxTransferMinAggregateOutputType | null;
    _max: RxTransferMaxAggregateOutputType | null;
};
export type GetRxTransferGroupByPayload<T extends RxTransferGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RxTransferGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RxTransferGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RxTransferGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RxTransferGroupByOutputType[P]>;
}>>;
export type RxTransferWhereInput = {
    AND?: Prisma.RxTransferWhereInput | Prisma.RxTransferWhereInput[];
    OR?: Prisma.RxTransferWhereInput[];
    NOT?: Prisma.RxTransferWhereInput | Prisma.RxTransferWhereInput[];
    id?: Prisma.StringFilter<"RxTransfer"> | string;
    orgId?: Prisma.StringFilter<"RxTransfer"> | string;
    branchId?: Prisma.StringFilter<"RxTransfer"> | string;
    direction?: Prisma.StringFilter<"RxTransfer"> | string;
    prescriptionId?: Prisma.StringFilter<"RxTransfer"> | string;
    counterpartyName?: Prisma.StringFilter<"RxTransfer"> | string;
    counterpartyPhone?: Prisma.StringNullableFilter<"RxTransfer"> | string | null;
    counterpartyPharmacist?: Prisma.StringNullableFilter<"RxTransfer"> | string | null;
    counterpartyLicenceNo?: Prisma.StringNullableFilter<"RxTransfer"> | string | null;
    reason?: Prisma.StringNullableFilter<"RxTransfer"> | string | null;
    snapshot?: Prisma.JsonNullableFilter<"RxTransfer">;
    createdBy?: Prisma.StringFilter<"RxTransfer"> | string;
    createdAt?: Prisma.DateTimeFilter<"RxTransfer"> | Date | string;
};
export type RxTransferOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    counterpartyName?: Prisma.SortOrder;
    counterpartyPhone?: Prisma.SortOrderInput | Prisma.SortOrder;
    counterpartyPharmacist?: Prisma.SortOrderInput | Prisma.SortOrder;
    counterpartyLicenceNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    snapshot?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RxTransferWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RxTransferWhereInput | Prisma.RxTransferWhereInput[];
    OR?: Prisma.RxTransferWhereInput[];
    NOT?: Prisma.RxTransferWhereInput | Prisma.RxTransferWhereInput[];
    orgId?: Prisma.StringFilter<"RxTransfer"> | string;
    branchId?: Prisma.StringFilter<"RxTransfer"> | string;
    direction?: Prisma.StringFilter<"RxTransfer"> | string;
    prescriptionId?: Prisma.StringFilter<"RxTransfer"> | string;
    counterpartyName?: Prisma.StringFilter<"RxTransfer"> | string;
    counterpartyPhone?: Prisma.StringNullableFilter<"RxTransfer"> | string | null;
    counterpartyPharmacist?: Prisma.StringNullableFilter<"RxTransfer"> | string | null;
    counterpartyLicenceNo?: Prisma.StringNullableFilter<"RxTransfer"> | string | null;
    reason?: Prisma.StringNullableFilter<"RxTransfer"> | string | null;
    snapshot?: Prisma.JsonNullableFilter<"RxTransfer">;
    createdBy?: Prisma.StringFilter<"RxTransfer"> | string;
    createdAt?: Prisma.DateTimeFilter<"RxTransfer"> | Date | string;
}, "id">;
export type RxTransferOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    counterpartyName?: Prisma.SortOrder;
    counterpartyPhone?: Prisma.SortOrderInput | Prisma.SortOrder;
    counterpartyPharmacist?: Prisma.SortOrderInput | Prisma.SortOrder;
    counterpartyLicenceNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    snapshot?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.RxTransferCountOrderByAggregateInput;
    _max?: Prisma.RxTransferMaxOrderByAggregateInput;
    _min?: Prisma.RxTransferMinOrderByAggregateInput;
};
export type RxTransferScalarWhereWithAggregatesInput = {
    AND?: Prisma.RxTransferScalarWhereWithAggregatesInput | Prisma.RxTransferScalarWhereWithAggregatesInput[];
    OR?: Prisma.RxTransferScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RxTransferScalarWhereWithAggregatesInput | Prisma.RxTransferScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RxTransfer"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"RxTransfer"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"RxTransfer"> | string;
    direction?: Prisma.StringWithAggregatesFilter<"RxTransfer"> | string;
    prescriptionId?: Prisma.StringWithAggregatesFilter<"RxTransfer"> | string;
    counterpartyName?: Prisma.StringWithAggregatesFilter<"RxTransfer"> | string;
    counterpartyPhone?: Prisma.StringNullableWithAggregatesFilter<"RxTransfer"> | string | null;
    counterpartyPharmacist?: Prisma.StringNullableWithAggregatesFilter<"RxTransfer"> | string | null;
    counterpartyLicenceNo?: Prisma.StringNullableWithAggregatesFilter<"RxTransfer"> | string | null;
    reason?: Prisma.StringNullableWithAggregatesFilter<"RxTransfer"> | string | null;
    snapshot?: Prisma.JsonNullableWithAggregatesFilter<"RxTransfer">;
    createdBy?: Prisma.StringWithAggregatesFilter<"RxTransfer"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RxTransfer"> | Date | string;
};
export type RxTransferCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    direction: string;
    prescriptionId: string;
    counterpartyName: string;
    counterpartyPhone?: string | null;
    counterpartyPharmacist?: string | null;
    counterpartyLicenceNo?: string | null;
    reason?: string | null;
    snapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy: string;
    createdAt?: Date | string;
};
export type RxTransferUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    direction: string;
    prescriptionId: string;
    counterpartyName: string;
    counterpartyPhone?: string | null;
    counterpartyPharmacist?: string | null;
    counterpartyLicenceNo?: string | null;
    reason?: string | null;
    snapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy: string;
    createdAt?: Date | string;
};
export type RxTransferUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    counterpartyName?: Prisma.StringFieldUpdateOperationsInput | string;
    counterpartyPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    counterpartyPharmacist?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    counterpartyLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    snapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RxTransferUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    counterpartyName?: Prisma.StringFieldUpdateOperationsInput | string;
    counterpartyPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    counterpartyPharmacist?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    counterpartyLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    snapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RxTransferCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    direction: string;
    prescriptionId: string;
    counterpartyName: string;
    counterpartyPhone?: string | null;
    counterpartyPharmacist?: string | null;
    counterpartyLicenceNo?: string | null;
    reason?: string | null;
    snapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy: string;
    createdAt?: Date | string;
};
export type RxTransferUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    counterpartyName?: Prisma.StringFieldUpdateOperationsInput | string;
    counterpartyPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    counterpartyPharmacist?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    counterpartyLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    snapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RxTransferUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    counterpartyName?: Prisma.StringFieldUpdateOperationsInput | string;
    counterpartyPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    counterpartyPharmacist?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    counterpartyLicenceNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    snapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RxTransferCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    counterpartyName?: Prisma.SortOrder;
    counterpartyPhone?: Prisma.SortOrder;
    counterpartyPharmacist?: Prisma.SortOrder;
    counterpartyLicenceNo?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    snapshot?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RxTransferMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    counterpartyName?: Prisma.SortOrder;
    counterpartyPhone?: Prisma.SortOrder;
    counterpartyPharmacist?: Prisma.SortOrder;
    counterpartyLicenceNo?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RxTransferMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    counterpartyName?: Prisma.SortOrder;
    counterpartyPhone?: Prisma.SortOrder;
    counterpartyPharmacist?: Prisma.SortOrder;
    counterpartyLicenceNo?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RxTransferSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    direction?: boolean;
    prescriptionId?: boolean;
    counterpartyName?: boolean;
    counterpartyPhone?: boolean;
    counterpartyPharmacist?: boolean;
    counterpartyLicenceNo?: boolean;
    reason?: boolean;
    snapshot?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["rxTransfer"]>;
export type RxTransferSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    direction?: boolean;
    prescriptionId?: boolean;
    counterpartyName?: boolean;
    counterpartyPhone?: boolean;
    counterpartyPharmacist?: boolean;
    counterpartyLicenceNo?: boolean;
    reason?: boolean;
    snapshot?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["rxTransfer"]>;
export type RxTransferSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    direction?: boolean;
    prescriptionId?: boolean;
    counterpartyName?: boolean;
    counterpartyPhone?: boolean;
    counterpartyPharmacist?: boolean;
    counterpartyLicenceNo?: boolean;
    reason?: boolean;
    snapshot?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["rxTransfer"]>;
export type RxTransferSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    direction?: boolean;
    prescriptionId?: boolean;
    counterpartyName?: boolean;
    counterpartyPhone?: boolean;
    counterpartyPharmacist?: boolean;
    counterpartyLicenceNo?: boolean;
    reason?: boolean;
    snapshot?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
};
export type RxTransferOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "direction" | "prescriptionId" | "counterpartyName" | "counterpartyPhone" | "counterpartyPharmacist" | "counterpartyLicenceNo" | "reason" | "snapshot" | "createdBy" | "createdAt", ExtArgs["result"]["rxTransfer"]>;
export type $RxTransferPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RxTransfer";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        direction: string;
        prescriptionId: string;
        counterpartyName: string;
        counterpartyPhone: string | null;
        counterpartyPharmacist: string | null;
        counterpartyLicenceNo: string | null;
        reason: string | null;
        snapshot: runtime.JsonValue | null;
        createdBy: string;
        createdAt: Date;
    }, ExtArgs["result"]["rxTransfer"]>;
    composites: {};
};
export type RxTransferGetPayload<S extends boolean | null | undefined | RxTransferDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RxTransferPayload, S>;
export type RxTransferCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RxTransferFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RxTransferCountAggregateInputType | true;
};
export interface RxTransferDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RxTransfer'];
        meta: {
            name: 'RxTransfer';
        };
    };
    findUnique<T extends RxTransferFindUniqueArgs>(args: Prisma.SelectSubset<T, RxTransferFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RxTransferClient<runtime.Types.Result.GetResult<Prisma.$RxTransferPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RxTransferFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RxTransferFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RxTransferClient<runtime.Types.Result.GetResult<Prisma.$RxTransferPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RxTransferFindFirstArgs>(args?: Prisma.SelectSubset<T, RxTransferFindFirstArgs<ExtArgs>>): Prisma.Prisma__RxTransferClient<runtime.Types.Result.GetResult<Prisma.$RxTransferPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RxTransferFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RxTransferFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RxTransferClient<runtime.Types.Result.GetResult<Prisma.$RxTransferPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RxTransferFindManyArgs>(args?: Prisma.SelectSubset<T, RxTransferFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RxTransferPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RxTransferCreateArgs>(args: Prisma.SelectSubset<T, RxTransferCreateArgs<ExtArgs>>): Prisma.Prisma__RxTransferClient<runtime.Types.Result.GetResult<Prisma.$RxTransferPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RxTransferCreateManyArgs>(args?: Prisma.SelectSubset<T, RxTransferCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RxTransferCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RxTransferCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RxTransferPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RxTransferDeleteArgs>(args: Prisma.SelectSubset<T, RxTransferDeleteArgs<ExtArgs>>): Prisma.Prisma__RxTransferClient<runtime.Types.Result.GetResult<Prisma.$RxTransferPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RxTransferUpdateArgs>(args: Prisma.SelectSubset<T, RxTransferUpdateArgs<ExtArgs>>): Prisma.Prisma__RxTransferClient<runtime.Types.Result.GetResult<Prisma.$RxTransferPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RxTransferDeleteManyArgs>(args?: Prisma.SelectSubset<T, RxTransferDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RxTransferUpdateManyArgs>(args: Prisma.SelectSubset<T, RxTransferUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RxTransferUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RxTransferUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RxTransferPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RxTransferUpsertArgs>(args: Prisma.SelectSubset<T, RxTransferUpsertArgs<ExtArgs>>): Prisma.Prisma__RxTransferClient<runtime.Types.Result.GetResult<Prisma.$RxTransferPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RxTransferCountArgs>(args?: Prisma.Subset<T, RxTransferCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RxTransferCountAggregateOutputType> : number>;
    aggregate<T extends RxTransferAggregateArgs>(args: Prisma.Subset<T, RxTransferAggregateArgs>): Prisma.PrismaPromise<GetRxTransferAggregateType<T>>;
    groupBy<T extends RxTransferGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RxTransferGroupByArgs['orderBy'];
    } : {
        orderBy?: RxTransferGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RxTransferGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRxTransferGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RxTransferFieldRefs;
}
export interface Prisma__RxTransferClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RxTransferFieldRefs {
    readonly id: Prisma.FieldRef<"RxTransfer", 'String'>;
    readonly orgId: Prisma.FieldRef<"RxTransfer", 'String'>;
    readonly branchId: Prisma.FieldRef<"RxTransfer", 'String'>;
    readonly direction: Prisma.FieldRef<"RxTransfer", 'String'>;
    readonly prescriptionId: Prisma.FieldRef<"RxTransfer", 'String'>;
    readonly counterpartyName: Prisma.FieldRef<"RxTransfer", 'String'>;
    readonly counterpartyPhone: Prisma.FieldRef<"RxTransfer", 'String'>;
    readonly counterpartyPharmacist: Prisma.FieldRef<"RxTransfer", 'String'>;
    readonly counterpartyLicenceNo: Prisma.FieldRef<"RxTransfer", 'String'>;
    readonly reason: Prisma.FieldRef<"RxTransfer", 'String'>;
    readonly snapshot: Prisma.FieldRef<"RxTransfer", 'Json'>;
    readonly createdBy: Prisma.FieldRef<"RxTransfer", 'String'>;
    readonly createdAt: Prisma.FieldRef<"RxTransfer", 'DateTime'>;
}
export type RxTransferFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxTransferSelect<ExtArgs> | null;
    omit?: Prisma.RxTransferOmit<ExtArgs> | null;
    where: Prisma.RxTransferWhereUniqueInput;
};
export type RxTransferFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxTransferSelect<ExtArgs> | null;
    omit?: Prisma.RxTransferOmit<ExtArgs> | null;
    where: Prisma.RxTransferWhereUniqueInput;
};
export type RxTransferFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxTransferSelect<ExtArgs> | null;
    omit?: Prisma.RxTransferOmit<ExtArgs> | null;
    where?: Prisma.RxTransferWhereInput;
    orderBy?: Prisma.RxTransferOrderByWithRelationInput | Prisma.RxTransferOrderByWithRelationInput[];
    cursor?: Prisma.RxTransferWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RxTransferScalarFieldEnum | Prisma.RxTransferScalarFieldEnum[];
};
export type RxTransferFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxTransferSelect<ExtArgs> | null;
    omit?: Prisma.RxTransferOmit<ExtArgs> | null;
    where?: Prisma.RxTransferWhereInput;
    orderBy?: Prisma.RxTransferOrderByWithRelationInput | Prisma.RxTransferOrderByWithRelationInput[];
    cursor?: Prisma.RxTransferWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RxTransferScalarFieldEnum | Prisma.RxTransferScalarFieldEnum[];
};
export type RxTransferFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxTransferSelect<ExtArgs> | null;
    omit?: Prisma.RxTransferOmit<ExtArgs> | null;
    where?: Prisma.RxTransferWhereInput;
    orderBy?: Prisma.RxTransferOrderByWithRelationInput | Prisma.RxTransferOrderByWithRelationInput[];
    cursor?: Prisma.RxTransferWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RxTransferScalarFieldEnum | Prisma.RxTransferScalarFieldEnum[];
};
export type RxTransferCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxTransferSelect<ExtArgs> | null;
    omit?: Prisma.RxTransferOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RxTransferCreateInput, Prisma.RxTransferUncheckedCreateInput>;
};
export type RxTransferCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RxTransferCreateManyInput | Prisma.RxTransferCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RxTransferCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxTransferSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RxTransferOmit<ExtArgs> | null;
    data: Prisma.RxTransferCreateManyInput | Prisma.RxTransferCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RxTransferUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxTransferSelect<ExtArgs> | null;
    omit?: Prisma.RxTransferOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RxTransferUpdateInput, Prisma.RxTransferUncheckedUpdateInput>;
    where: Prisma.RxTransferWhereUniqueInput;
};
export type RxTransferUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RxTransferUpdateManyMutationInput, Prisma.RxTransferUncheckedUpdateManyInput>;
    where?: Prisma.RxTransferWhereInput;
    limit?: number;
};
export type RxTransferUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxTransferSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RxTransferOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RxTransferUpdateManyMutationInput, Prisma.RxTransferUncheckedUpdateManyInput>;
    where?: Prisma.RxTransferWhereInput;
    limit?: number;
};
export type RxTransferUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxTransferSelect<ExtArgs> | null;
    omit?: Prisma.RxTransferOmit<ExtArgs> | null;
    where: Prisma.RxTransferWhereUniqueInput;
    create: Prisma.XOR<Prisma.RxTransferCreateInput, Prisma.RxTransferUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RxTransferUpdateInput, Prisma.RxTransferUncheckedUpdateInput>;
};
export type RxTransferDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxTransferSelect<ExtArgs> | null;
    omit?: Prisma.RxTransferOmit<ExtArgs> | null;
    where: Prisma.RxTransferWhereUniqueInput;
};
export type RxTransferDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RxTransferWhereInput;
    limit?: number;
};
export type RxTransferDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxTransferSelect<ExtArgs> | null;
    omit?: Prisma.RxTransferOmit<ExtArgs> | null;
};
