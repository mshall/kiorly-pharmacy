import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type RefillReminderModel = runtime.Types.Result.DefaultSelection<Prisma.$RefillReminderPayload>;
export type AggregateRefillReminder = {
    _count: RefillReminderCountAggregateOutputType | null;
    _avg: RefillReminderAvgAggregateOutputType | null;
    _sum: RefillReminderSumAggregateOutputType | null;
    _min: RefillReminderMinAggregateOutputType | null;
    _max: RefillReminderMaxAggregateOutputType | null;
};
export type RefillReminderAvgAggregateOutputType = {
    refillNo: number | null;
};
export type RefillReminderSumAggregateOutputType = {
    refillNo: number | null;
};
export type RefillReminderMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    prescriptionId: string | null;
    refillNo: number | null;
    notificationId: string | null;
    sentAt: Date | null;
};
export type RefillReminderMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    prescriptionId: string | null;
    refillNo: number | null;
    notificationId: string | null;
    sentAt: Date | null;
};
export type RefillReminderCountAggregateOutputType = {
    id: number;
    orgId: number;
    prescriptionId: number;
    refillNo: number;
    notificationId: number;
    sentAt: number;
    _all: number;
};
export type RefillReminderAvgAggregateInputType = {
    refillNo?: true;
};
export type RefillReminderSumAggregateInputType = {
    refillNo?: true;
};
export type RefillReminderMinAggregateInputType = {
    id?: true;
    orgId?: true;
    prescriptionId?: true;
    refillNo?: true;
    notificationId?: true;
    sentAt?: true;
};
export type RefillReminderMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    prescriptionId?: true;
    refillNo?: true;
    notificationId?: true;
    sentAt?: true;
};
export type RefillReminderCountAggregateInputType = {
    id?: true;
    orgId?: true;
    prescriptionId?: true;
    refillNo?: true;
    notificationId?: true;
    sentAt?: true;
    _all?: true;
};
export type RefillReminderAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RefillReminderWhereInput;
    orderBy?: Prisma.RefillReminderOrderByWithRelationInput | Prisma.RefillReminderOrderByWithRelationInput[];
    cursor?: Prisma.RefillReminderWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RefillReminderCountAggregateInputType;
    _avg?: RefillReminderAvgAggregateInputType;
    _sum?: RefillReminderSumAggregateInputType;
    _min?: RefillReminderMinAggregateInputType;
    _max?: RefillReminderMaxAggregateInputType;
};
export type GetRefillReminderAggregateType<T extends RefillReminderAggregateArgs> = {
    [P in keyof T & keyof AggregateRefillReminder]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRefillReminder[P]> : Prisma.GetScalarType<T[P], AggregateRefillReminder[P]>;
};
export type RefillReminderGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RefillReminderWhereInput;
    orderBy?: Prisma.RefillReminderOrderByWithAggregationInput | Prisma.RefillReminderOrderByWithAggregationInput[];
    by: Prisma.RefillReminderScalarFieldEnum[] | Prisma.RefillReminderScalarFieldEnum;
    having?: Prisma.RefillReminderScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RefillReminderCountAggregateInputType | true;
    _avg?: RefillReminderAvgAggregateInputType;
    _sum?: RefillReminderSumAggregateInputType;
    _min?: RefillReminderMinAggregateInputType;
    _max?: RefillReminderMaxAggregateInputType;
};
export type RefillReminderGroupByOutputType = {
    id: string;
    orgId: string;
    prescriptionId: string;
    refillNo: number;
    notificationId: string | null;
    sentAt: Date;
    _count: RefillReminderCountAggregateOutputType | null;
    _avg: RefillReminderAvgAggregateOutputType | null;
    _sum: RefillReminderSumAggregateOutputType | null;
    _min: RefillReminderMinAggregateOutputType | null;
    _max: RefillReminderMaxAggregateOutputType | null;
};
export type GetRefillReminderGroupByPayload<T extends RefillReminderGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RefillReminderGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RefillReminderGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RefillReminderGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RefillReminderGroupByOutputType[P]>;
}>>;
export type RefillReminderWhereInput = {
    AND?: Prisma.RefillReminderWhereInput | Prisma.RefillReminderWhereInput[];
    OR?: Prisma.RefillReminderWhereInput[];
    NOT?: Prisma.RefillReminderWhereInput | Prisma.RefillReminderWhereInput[];
    id?: Prisma.StringFilter<"RefillReminder"> | string;
    orgId?: Prisma.StringFilter<"RefillReminder"> | string;
    prescriptionId?: Prisma.StringFilter<"RefillReminder"> | string;
    refillNo?: Prisma.IntFilter<"RefillReminder"> | number;
    notificationId?: Prisma.StringNullableFilter<"RefillReminder"> | string | null;
    sentAt?: Prisma.DateTimeFilter<"RefillReminder"> | Date | string;
};
export type RefillReminderOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    refillNo?: Prisma.SortOrder;
    notificationId?: Prisma.SortOrderInput | Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
};
export type RefillReminderWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    prescriptionId_refillNo?: Prisma.RefillReminderPrescriptionIdRefillNoCompoundUniqueInput;
    AND?: Prisma.RefillReminderWhereInput | Prisma.RefillReminderWhereInput[];
    OR?: Prisma.RefillReminderWhereInput[];
    NOT?: Prisma.RefillReminderWhereInput | Prisma.RefillReminderWhereInput[];
    orgId?: Prisma.StringFilter<"RefillReminder"> | string;
    prescriptionId?: Prisma.StringFilter<"RefillReminder"> | string;
    refillNo?: Prisma.IntFilter<"RefillReminder"> | number;
    notificationId?: Prisma.StringNullableFilter<"RefillReminder"> | string | null;
    sentAt?: Prisma.DateTimeFilter<"RefillReminder"> | Date | string;
}, "id" | "prescriptionId_refillNo">;
export type RefillReminderOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    refillNo?: Prisma.SortOrder;
    notificationId?: Prisma.SortOrderInput | Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
    _count?: Prisma.RefillReminderCountOrderByAggregateInput;
    _avg?: Prisma.RefillReminderAvgOrderByAggregateInput;
    _max?: Prisma.RefillReminderMaxOrderByAggregateInput;
    _min?: Prisma.RefillReminderMinOrderByAggregateInput;
    _sum?: Prisma.RefillReminderSumOrderByAggregateInput;
};
export type RefillReminderScalarWhereWithAggregatesInput = {
    AND?: Prisma.RefillReminderScalarWhereWithAggregatesInput | Prisma.RefillReminderScalarWhereWithAggregatesInput[];
    OR?: Prisma.RefillReminderScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RefillReminderScalarWhereWithAggregatesInput | Prisma.RefillReminderScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RefillReminder"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"RefillReminder"> | string;
    prescriptionId?: Prisma.StringWithAggregatesFilter<"RefillReminder"> | string;
    refillNo?: Prisma.IntWithAggregatesFilter<"RefillReminder"> | number;
    notificationId?: Prisma.StringNullableWithAggregatesFilter<"RefillReminder"> | string | null;
    sentAt?: Prisma.DateTimeWithAggregatesFilter<"RefillReminder"> | Date | string;
};
export type RefillReminderCreateInput = {
    id?: string;
    orgId: string;
    prescriptionId: string;
    refillNo: number;
    notificationId?: string | null;
    sentAt?: Date | string;
};
export type RefillReminderUncheckedCreateInput = {
    id?: string;
    orgId: string;
    prescriptionId: string;
    refillNo: number;
    notificationId?: string | null;
    sentAt?: Date | string;
};
export type RefillReminderUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    refillNo?: Prisma.IntFieldUpdateOperationsInput | number;
    notificationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RefillReminderUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    refillNo?: Prisma.IntFieldUpdateOperationsInput | number;
    notificationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RefillReminderCreateManyInput = {
    id?: string;
    orgId: string;
    prescriptionId: string;
    refillNo: number;
    notificationId?: string | null;
    sentAt?: Date | string;
};
export type RefillReminderUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    refillNo?: Prisma.IntFieldUpdateOperationsInput | number;
    notificationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RefillReminderUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    refillNo?: Prisma.IntFieldUpdateOperationsInput | number;
    notificationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RefillReminderPrescriptionIdRefillNoCompoundUniqueInput = {
    prescriptionId: string;
    refillNo: number;
};
export type RefillReminderCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    refillNo?: Prisma.SortOrder;
    notificationId?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
};
export type RefillReminderAvgOrderByAggregateInput = {
    refillNo?: Prisma.SortOrder;
};
export type RefillReminderMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    refillNo?: Prisma.SortOrder;
    notificationId?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
};
export type RefillReminderMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    refillNo?: Prisma.SortOrder;
    notificationId?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
};
export type RefillReminderSumOrderByAggregateInput = {
    refillNo?: Prisma.SortOrder;
};
export type RefillReminderSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    prescriptionId?: boolean;
    refillNo?: boolean;
    notificationId?: boolean;
    sentAt?: boolean;
}, ExtArgs["result"]["refillReminder"]>;
export type RefillReminderSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    prescriptionId?: boolean;
    refillNo?: boolean;
    notificationId?: boolean;
    sentAt?: boolean;
}, ExtArgs["result"]["refillReminder"]>;
export type RefillReminderSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    prescriptionId?: boolean;
    refillNo?: boolean;
    notificationId?: boolean;
    sentAt?: boolean;
}, ExtArgs["result"]["refillReminder"]>;
export type RefillReminderSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    prescriptionId?: boolean;
    refillNo?: boolean;
    notificationId?: boolean;
    sentAt?: boolean;
};
export type RefillReminderOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "prescriptionId" | "refillNo" | "notificationId" | "sentAt", ExtArgs["result"]["refillReminder"]>;
export type $RefillReminderPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RefillReminder";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        prescriptionId: string;
        refillNo: number;
        notificationId: string | null;
        sentAt: Date;
    }, ExtArgs["result"]["refillReminder"]>;
    composites: {};
};
export type RefillReminderGetPayload<S extends boolean | null | undefined | RefillReminderDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RefillReminderPayload, S>;
export type RefillReminderCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RefillReminderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RefillReminderCountAggregateInputType | true;
};
export interface RefillReminderDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RefillReminder'];
        meta: {
            name: 'RefillReminder';
        };
    };
    findUnique<T extends RefillReminderFindUniqueArgs>(args: Prisma.SelectSubset<T, RefillReminderFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RefillReminderClient<runtime.Types.Result.GetResult<Prisma.$RefillReminderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RefillReminderFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RefillReminderFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RefillReminderClient<runtime.Types.Result.GetResult<Prisma.$RefillReminderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RefillReminderFindFirstArgs>(args?: Prisma.SelectSubset<T, RefillReminderFindFirstArgs<ExtArgs>>): Prisma.Prisma__RefillReminderClient<runtime.Types.Result.GetResult<Prisma.$RefillReminderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RefillReminderFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RefillReminderFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RefillReminderClient<runtime.Types.Result.GetResult<Prisma.$RefillReminderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RefillReminderFindManyArgs>(args?: Prisma.SelectSubset<T, RefillReminderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RefillReminderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RefillReminderCreateArgs>(args: Prisma.SelectSubset<T, RefillReminderCreateArgs<ExtArgs>>): Prisma.Prisma__RefillReminderClient<runtime.Types.Result.GetResult<Prisma.$RefillReminderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RefillReminderCreateManyArgs>(args?: Prisma.SelectSubset<T, RefillReminderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RefillReminderCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RefillReminderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RefillReminderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RefillReminderDeleteArgs>(args: Prisma.SelectSubset<T, RefillReminderDeleteArgs<ExtArgs>>): Prisma.Prisma__RefillReminderClient<runtime.Types.Result.GetResult<Prisma.$RefillReminderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RefillReminderUpdateArgs>(args: Prisma.SelectSubset<T, RefillReminderUpdateArgs<ExtArgs>>): Prisma.Prisma__RefillReminderClient<runtime.Types.Result.GetResult<Prisma.$RefillReminderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RefillReminderDeleteManyArgs>(args?: Prisma.SelectSubset<T, RefillReminderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RefillReminderUpdateManyArgs>(args: Prisma.SelectSubset<T, RefillReminderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RefillReminderUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RefillReminderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RefillReminderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RefillReminderUpsertArgs>(args: Prisma.SelectSubset<T, RefillReminderUpsertArgs<ExtArgs>>): Prisma.Prisma__RefillReminderClient<runtime.Types.Result.GetResult<Prisma.$RefillReminderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RefillReminderCountArgs>(args?: Prisma.Subset<T, RefillReminderCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RefillReminderCountAggregateOutputType> : number>;
    aggregate<T extends RefillReminderAggregateArgs>(args: Prisma.Subset<T, RefillReminderAggregateArgs>): Prisma.PrismaPromise<GetRefillReminderAggregateType<T>>;
    groupBy<T extends RefillReminderGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RefillReminderGroupByArgs['orderBy'];
    } : {
        orderBy?: RefillReminderGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RefillReminderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefillReminderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RefillReminderFieldRefs;
}
export interface Prisma__RefillReminderClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RefillReminderFieldRefs {
    readonly id: Prisma.FieldRef<"RefillReminder", 'String'>;
    readonly orgId: Prisma.FieldRef<"RefillReminder", 'String'>;
    readonly prescriptionId: Prisma.FieldRef<"RefillReminder", 'String'>;
    readonly refillNo: Prisma.FieldRef<"RefillReminder", 'Int'>;
    readonly notificationId: Prisma.FieldRef<"RefillReminder", 'String'>;
    readonly sentAt: Prisma.FieldRef<"RefillReminder", 'DateTime'>;
}
export type RefillReminderFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefillReminderSelect<ExtArgs> | null;
    omit?: Prisma.RefillReminderOmit<ExtArgs> | null;
    where: Prisma.RefillReminderWhereUniqueInput;
};
export type RefillReminderFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefillReminderSelect<ExtArgs> | null;
    omit?: Prisma.RefillReminderOmit<ExtArgs> | null;
    where: Prisma.RefillReminderWhereUniqueInput;
};
export type RefillReminderFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefillReminderSelect<ExtArgs> | null;
    omit?: Prisma.RefillReminderOmit<ExtArgs> | null;
    where?: Prisma.RefillReminderWhereInput;
    orderBy?: Prisma.RefillReminderOrderByWithRelationInput | Prisma.RefillReminderOrderByWithRelationInput[];
    cursor?: Prisma.RefillReminderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RefillReminderScalarFieldEnum | Prisma.RefillReminderScalarFieldEnum[];
};
export type RefillReminderFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefillReminderSelect<ExtArgs> | null;
    omit?: Prisma.RefillReminderOmit<ExtArgs> | null;
    where?: Prisma.RefillReminderWhereInput;
    orderBy?: Prisma.RefillReminderOrderByWithRelationInput | Prisma.RefillReminderOrderByWithRelationInput[];
    cursor?: Prisma.RefillReminderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RefillReminderScalarFieldEnum | Prisma.RefillReminderScalarFieldEnum[];
};
export type RefillReminderFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefillReminderSelect<ExtArgs> | null;
    omit?: Prisma.RefillReminderOmit<ExtArgs> | null;
    where?: Prisma.RefillReminderWhereInput;
    orderBy?: Prisma.RefillReminderOrderByWithRelationInput | Prisma.RefillReminderOrderByWithRelationInput[];
    cursor?: Prisma.RefillReminderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RefillReminderScalarFieldEnum | Prisma.RefillReminderScalarFieldEnum[];
};
export type RefillReminderCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefillReminderSelect<ExtArgs> | null;
    omit?: Prisma.RefillReminderOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RefillReminderCreateInput, Prisma.RefillReminderUncheckedCreateInput>;
};
export type RefillReminderCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RefillReminderCreateManyInput | Prisma.RefillReminderCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RefillReminderCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefillReminderSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RefillReminderOmit<ExtArgs> | null;
    data: Prisma.RefillReminderCreateManyInput | Prisma.RefillReminderCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RefillReminderUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefillReminderSelect<ExtArgs> | null;
    omit?: Prisma.RefillReminderOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RefillReminderUpdateInput, Prisma.RefillReminderUncheckedUpdateInput>;
    where: Prisma.RefillReminderWhereUniqueInput;
};
export type RefillReminderUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RefillReminderUpdateManyMutationInput, Prisma.RefillReminderUncheckedUpdateManyInput>;
    where?: Prisma.RefillReminderWhereInput;
    limit?: number;
};
export type RefillReminderUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefillReminderSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RefillReminderOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RefillReminderUpdateManyMutationInput, Prisma.RefillReminderUncheckedUpdateManyInput>;
    where?: Prisma.RefillReminderWhereInput;
    limit?: number;
};
export type RefillReminderUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefillReminderSelect<ExtArgs> | null;
    omit?: Prisma.RefillReminderOmit<ExtArgs> | null;
    where: Prisma.RefillReminderWhereUniqueInput;
    create: Prisma.XOR<Prisma.RefillReminderCreateInput, Prisma.RefillReminderUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RefillReminderUpdateInput, Prisma.RefillReminderUncheckedUpdateInput>;
};
export type RefillReminderDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefillReminderSelect<ExtArgs> | null;
    omit?: Prisma.RefillReminderOmit<ExtArgs> | null;
    where: Prisma.RefillReminderWhereUniqueInput;
};
export type RefillReminderDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RefillReminderWhereInput;
    limit?: number;
};
export type RefillReminderDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefillReminderSelect<ExtArgs> | null;
    omit?: Prisma.RefillReminderOmit<ExtArgs> | null;
};
