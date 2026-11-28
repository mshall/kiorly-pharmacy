import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type RxRefillModel = runtime.Types.Result.DefaultSelection<Prisma.$RxRefillPayload>;
export type AggregateRxRefill = {
    _count: RxRefillCountAggregateOutputType | null;
    _avg: RxRefillAvgAggregateOutputType | null;
    _sum: RxRefillSumAggregateOutputType | null;
    _min: RxRefillMinAggregateOutputType | null;
    _max: RxRefillMaxAggregateOutputType | null;
};
export type RxRefillAvgAggregateOutputType = {
    refillNo: number | null;
};
export type RxRefillSumAggregateOutputType = {
    refillNo: number | null;
};
export type RxRefillMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    prescriptionId: string | null;
    refillNo: number | null;
    early: boolean | null;
    earlyReason: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type RxRefillMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    prescriptionId: string | null;
    refillNo: number | null;
    early: boolean | null;
    earlyReason: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type RxRefillCountAggregateOutputType = {
    id: number;
    orgId: number;
    prescriptionId: number;
    refillNo: number;
    early: number;
    earlyReason: number;
    createdBy: number;
    createdAt: number;
    _all: number;
};
export type RxRefillAvgAggregateInputType = {
    refillNo?: true;
};
export type RxRefillSumAggregateInputType = {
    refillNo?: true;
};
export type RxRefillMinAggregateInputType = {
    id?: true;
    orgId?: true;
    prescriptionId?: true;
    refillNo?: true;
    early?: true;
    earlyReason?: true;
    createdBy?: true;
    createdAt?: true;
};
export type RxRefillMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    prescriptionId?: true;
    refillNo?: true;
    early?: true;
    earlyReason?: true;
    createdBy?: true;
    createdAt?: true;
};
export type RxRefillCountAggregateInputType = {
    id?: true;
    orgId?: true;
    prescriptionId?: true;
    refillNo?: true;
    early?: true;
    earlyReason?: true;
    createdBy?: true;
    createdAt?: true;
    _all?: true;
};
export type RxRefillAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RxRefillWhereInput;
    orderBy?: Prisma.RxRefillOrderByWithRelationInput | Prisma.RxRefillOrderByWithRelationInput[];
    cursor?: Prisma.RxRefillWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RxRefillCountAggregateInputType;
    _avg?: RxRefillAvgAggregateInputType;
    _sum?: RxRefillSumAggregateInputType;
    _min?: RxRefillMinAggregateInputType;
    _max?: RxRefillMaxAggregateInputType;
};
export type GetRxRefillAggregateType<T extends RxRefillAggregateArgs> = {
    [P in keyof T & keyof AggregateRxRefill]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRxRefill[P]> : Prisma.GetScalarType<T[P], AggregateRxRefill[P]>;
};
export type RxRefillGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RxRefillWhereInput;
    orderBy?: Prisma.RxRefillOrderByWithAggregationInput | Prisma.RxRefillOrderByWithAggregationInput[];
    by: Prisma.RxRefillScalarFieldEnum[] | Prisma.RxRefillScalarFieldEnum;
    having?: Prisma.RxRefillScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RxRefillCountAggregateInputType | true;
    _avg?: RxRefillAvgAggregateInputType;
    _sum?: RxRefillSumAggregateInputType;
    _min?: RxRefillMinAggregateInputType;
    _max?: RxRefillMaxAggregateInputType;
};
export type RxRefillGroupByOutputType = {
    id: string;
    orgId: string;
    prescriptionId: string;
    refillNo: number;
    early: boolean;
    earlyReason: string | null;
    createdBy: string;
    createdAt: Date;
    _count: RxRefillCountAggregateOutputType | null;
    _avg: RxRefillAvgAggregateOutputType | null;
    _sum: RxRefillSumAggregateOutputType | null;
    _min: RxRefillMinAggregateOutputType | null;
    _max: RxRefillMaxAggregateOutputType | null;
};
export type GetRxRefillGroupByPayload<T extends RxRefillGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RxRefillGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RxRefillGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RxRefillGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RxRefillGroupByOutputType[P]>;
}>>;
export type RxRefillWhereInput = {
    AND?: Prisma.RxRefillWhereInput | Prisma.RxRefillWhereInput[];
    OR?: Prisma.RxRefillWhereInput[];
    NOT?: Prisma.RxRefillWhereInput | Prisma.RxRefillWhereInput[];
    id?: Prisma.StringFilter<"RxRefill"> | string;
    orgId?: Prisma.StringFilter<"RxRefill"> | string;
    prescriptionId?: Prisma.StringFilter<"RxRefill"> | string;
    refillNo?: Prisma.IntFilter<"RxRefill"> | number;
    early?: Prisma.BoolFilter<"RxRefill"> | boolean;
    earlyReason?: Prisma.StringNullableFilter<"RxRefill"> | string | null;
    createdBy?: Prisma.StringFilter<"RxRefill"> | string;
    createdAt?: Prisma.DateTimeFilter<"RxRefill"> | Date | string;
};
export type RxRefillOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    refillNo?: Prisma.SortOrder;
    early?: Prisma.SortOrder;
    earlyReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RxRefillWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    prescriptionId_refillNo?: Prisma.RxRefillPrescriptionIdRefillNoCompoundUniqueInput;
    AND?: Prisma.RxRefillWhereInput | Prisma.RxRefillWhereInput[];
    OR?: Prisma.RxRefillWhereInput[];
    NOT?: Prisma.RxRefillWhereInput | Prisma.RxRefillWhereInput[];
    orgId?: Prisma.StringFilter<"RxRefill"> | string;
    prescriptionId?: Prisma.StringFilter<"RxRefill"> | string;
    refillNo?: Prisma.IntFilter<"RxRefill"> | number;
    early?: Prisma.BoolFilter<"RxRefill"> | boolean;
    earlyReason?: Prisma.StringNullableFilter<"RxRefill"> | string | null;
    createdBy?: Prisma.StringFilter<"RxRefill"> | string;
    createdAt?: Prisma.DateTimeFilter<"RxRefill"> | Date | string;
}, "id" | "prescriptionId_refillNo">;
export type RxRefillOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    refillNo?: Prisma.SortOrder;
    early?: Prisma.SortOrder;
    earlyReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.RxRefillCountOrderByAggregateInput;
    _avg?: Prisma.RxRefillAvgOrderByAggregateInput;
    _max?: Prisma.RxRefillMaxOrderByAggregateInput;
    _min?: Prisma.RxRefillMinOrderByAggregateInput;
    _sum?: Prisma.RxRefillSumOrderByAggregateInput;
};
export type RxRefillScalarWhereWithAggregatesInput = {
    AND?: Prisma.RxRefillScalarWhereWithAggregatesInput | Prisma.RxRefillScalarWhereWithAggregatesInput[];
    OR?: Prisma.RxRefillScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RxRefillScalarWhereWithAggregatesInput | Prisma.RxRefillScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RxRefill"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"RxRefill"> | string;
    prescriptionId?: Prisma.StringWithAggregatesFilter<"RxRefill"> | string;
    refillNo?: Prisma.IntWithAggregatesFilter<"RxRefill"> | number;
    early?: Prisma.BoolWithAggregatesFilter<"RxRefill"> | boolean;
    earlyReason?: Prisma.StringNullableWithAggregatesFilter<"RxRefill"> | string | null;
    createdBy?: Prisma.StringWithAggregatesFilter<"RxRefill"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RxRefill"> | Date | string;
};
export type RxRefillCreateInput = {
    id?: string;
    orgId: string;
    prescriptionId: string;
    refillNo: number;
    early?: boolean;
    earlyReason?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type RxRefillUncheckedCreateInput = {
    id?: string;
    orgId: string;
    prescriptionId: string;
    refillNo: number;
    early?: boolean;
    earlyReason?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type RxRefillUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    refillNo?: Prisma.IntFieldUpdateOperationsInput | number;
    early?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    earlyReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RxRefillUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    refillNo?: Prisma.IntFieldUpdateOperationsInput | number;
    early?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    earlyReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RxRefillCreateManyInput = {
    id?: string;
    orgId: string;
    prescriptionId: string;
    refillNo: number;
    early?: boolean;
    earlyReason?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type RxRefillUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    refillNo?: Prisma.IntFieldUpdateOperationsInput | number;
    early?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    earlyReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RxRefillUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    prescriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    refillNo?: Prisma.IntFieldUpdateOperationsInput | number;
    early?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    earlyReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RxRefillPrescriptionIdRefillNoCompoundUniqueInput = {
    prescriptionId: string;
    refillNo: number;
};
export type RxRefillCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    refillNo?: Prisma.SortOrder;
    early?: Prisma.SortOrder;
    earlyReason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RxRefillAvgOrderByAggregateInput = {
    refillNo?: Prisma.SortOrder;
};
export type RxRefillMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    refillNo?: Prisma.SortOrder;
    early?: Prisma.SortOrder;
    earlyReason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RxRefillMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    prescriptionId?: Prisma.SortOrder;
    refillNo?: Prisma.SortOrder;
    early?: Prisma.SortOrder;
    earlyReason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RxRefillSumOrderByAggregateInput = {
    refillNo?: Prisma.SortOrder;
};
export type RxRefillSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    prescriptionId?: boolean;
    refillNo?: boolean;
    early?: boolean;
    earlyReason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["rxRefill"]>;
export type RxRefillSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    prescriptionId?: boolean;
    refillNo?: boolean;
    early?: boolean;
    earlyReason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["rxRefill"]>;
export type RxRefillSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    prescriptionId?: boolean;
    refillNo?: boolean;
    early?: boolean;
    earlyReason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["rxRefill"]>;
export type RxRefillSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    prescriptionId?: boolean;
    refillNo?: boolean;
    early?: boolean;
    earlyReason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
};
export type RxRefillOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "prescriptionId" | "refillNo" | "early" | "earlyReason" | "createdBy" | "createdAt", ExtArgs["result"]["rxRefill"]>;
export type $RxRefillPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RxRefill";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        prescriptionId: string;
        refillNo: number;
        early: boolean;
        earlyReason: string | null;
        createdBy: string;
        createdAt: Date;
    }, ExtArgs["result"]["rxRefill"]>;
    composites: {};
};
export type RxRefillGetPayload<S extends boolean | null | undefined | RxRefillDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RxRefillPayload, S>;
export type RxRefillCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RxRefillFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RxRefillCountAggregateInputType | true;
};
export interface RxRefillDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RxRefill'];
        meta: {
            name: 'RxRefill';
        };
    };
    findUnique<T extends RxRefillFindUniqueArgs>(args: Prisma.SelectSubset<T, RxRefillFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RxRefillClient<runtime.Types.Result.GetResult<Prisma.$RxRefillPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RxRefillFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RxRefillFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RxRefillClient<runtime.Types.Result.GetResult<Prisma.$RxRefillPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RxRefillFindFirstArgs>(args?: Prisma.SelectSubset<T, RxRefillFindFirstArgs<ExtArgs>>): Prisma.Prisma__RxRefillClient<runtime.Types.Result.GetResult<Prisma.$RxRefillPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RxRefillFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RxRefillFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RxRefillClient<runtime.Types.Result.GetResult<Prisma.$RxRefillPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RxRefillFindManyArgs>(args?: Prisma.SelectSubset<T, RxRefillFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RxRefillPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RxRefillCreateArgs>(args: Prisma.SelectSubset<T, RxRefillCreateArgs<ExtArgs>>): Prisma.Prisma__RxRefillClient<runtime.Types.Result.GetResult<Prisma.$RxRefillPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RxRefillCreateManyArgs>(args?: Prisma.SelectSubset<T, RxRefillCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RxRefillCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RxRefillCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RxRefillPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RxRefillDeleteArgs>(args: Prisma.SelectSubset<T, RxRefillDeleteArgs<ExtArgs>>): Prisma.Prisma__RxRefillClient<runtime.Types.Result.GetResult<Prisma.$RxRefillPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RxRefillUpdateArgs>(args: Prisma.SelectSubset<T, RxRefillUpdateArgs<ExtArgs>>): Prisma.Prisma__RxRefillClient<runtime.Types.Result.GetResult<Prisma.$RxRefillPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RxRefillDeleteManyArgs>(args?: Prisma.SelectSubset<T, RxRefillDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RxRefillUpdateManyArgs>(args: Prisma.SelectSubset<T, RxRefillUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RxRefillUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RxRefillUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RxRefillPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RxRefillUpsertArgs>(args: Prisma.SelectSubset<T, RxRefillUpsertArgs<ExtArgs>>): Prisma.Prisma__RxRefillClient<runtime.Types.Result.GetResult<Prisma.$RxRefillPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RxRefillCountArgs>(args?: Prisma.Subset<T, RxRefillCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RxRefillCountAggregateOutputType> : number>;
    aggregate<T extends RxRefillAggregateArgs>(args: Prisma.Subset<T, RxRefillAggregateArgs>): Prisma.PrismaPromise<GetRxRefillAggregateType<T>>;
    groupBy<T extends RxRefillGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RxRefillGroupByArgs['orderBy'];
    } : {
        orderBy?: RxRefillGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RxRefillGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRxRefillGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RxRefillFieldRefs;
}
export interface Prisma__RxRefillClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RxRefillFieldRefs {
    readonly id: Prisma.FieldRef<"RxRefill", 'String'>;
    readonly orgId: Prisma.FieldRef<"RxRefill", 'String'>;
    readonly prescriptionId: Prisma.FieldRef<"RxRefill", 'String'>;
    readonly refillNo: Prisma.FieldRef<"RxRefill", 'Int'>;
    readonly early: Prisma.FieldRef<"RxRefill", 'Boolean'>;
    readonly earlyReason: Prisma.FieldRef<"RxRefill", 'String'>;
    readonly createdBy: Prisma.FieldRef<"RxRefill", 'String'>;
    readonly createdAt: Prisma.FieldRef<"RxRefill", 'DateTime'>;
}
export type RxRefillFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxRefillSelect<ExtArgs> | null;
    omit?: Prisma.RxRefillOmit<ExtArgs> | null;
    where: Prisma.RxRefillWhereUniqueInput;
};
export type RxRefillFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxRefillSelect<ExtArgs> | null;
    omit?: Prisma.RxRefillOmit<ExtArgs> | null;
    where: Prisma.RxRefillWhereUniqueInput;
};
export type RxRefillFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxRefillSelect<ExtArgs> | null;
    omit?: Prisma.RxRefillOmit<ExtArgs> | null;
    where?: Prisma.RxRefillWhereInput;
    orderBy?: Prisma.RxRefillOrderByWithRelationInput | Prisma.RxRefillOrderByWithRelationInput[];
    cursor?: Prisma.RxRefillWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RxRefillScalarFieldEnum | Prisma.RxRefillScalarFieldEnum[];
};
export type RxRefillFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxRefillSelect<ExtArgs> | null;
    omit?: Prisma.RxRefillOmit<ExtArgs> | null;
    where?: Prisma.RxRefillWhereInput;
    orderBy?: Prisma.RxRefillOrderByWithRelationInput | Prisma.RxRefillOrderByWithRelationInput[];
    cursor?: Prisma.RxRefillWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RxRefillScalarFieldEnum | Prisma.RxRefillScalarFieldEnum[];
};
export type RxRefillFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxRefillSelect<ExtArgs> | null;
    omit?: Prisma.RxRefillOmit<ExtArgs> | null;
    where?: Prisma.RxRefillWhereInput;
    orderBy?: Prisma.RxRefillOrderByWithRelationInput | Prisma.RxRefillOrderByWithRelationInput[];
    cursor?: Prisma.RxRefillWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RxRefillScalarFieldEnum | Prisma.RxRefillScalarFieldEnum[];
};
export type RxRefillCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxRefillSelect<ExtArgs> | null;
    omit?: Prisma.RxRefillOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RxRefillCreateInput, Prisma.RxRefillUncheckedCreateInput>;
};
export type RxRefillCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RxRefillCreateManyInput | Prisma.RxRefillCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RxRefillCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxRefillSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RxRefillOmit<ExtArgs> | null;
    data: Prisma.RxRefillCreateManyInput | Prisma.RxRefillCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RxRefillUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxRefillSelect<ExtArgs> | null;
    omit?: Prisma.RxRefillOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RxRefillUpdateInput, Prisma.RxRefillUncheckedUpdateInput>;
    where: Prisma.RxRefillWhereUniqueInput;
};
export type RxRefillUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RxRefillUpdateManyMutationInput, Prisma.RxRefillUncheckedUpdateManyInput>;
    where?: Prisma.RxRefillWhereInput;
    limit?: number;
};
export type RxRefillUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxRefillSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RxRefillOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RxRefillUpdateManyMutationInput, Prisma.RxRefillUncheckedUpdateManyInput>;
    where?: Prisma.RxRefillWhereInput;
    limit?: number;
};
export type RxRefillUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxRefillSelect<ExtArgs> | null;
    omit?: Prisma.RxRefillOmit<ExtArgs> | null;
    where: Prisma.RxRefillWhereUniqueInput;
    create: Prisma.XOR<Prisma.RxRefillCreateInput, Prisma.RxRefillUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RxRefillUpdateInput, Prisma.RxRefillUncheckedUpdateInput>;
};
export type RxRefillDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxRefillSelect<ExtArgs> | null;
    omit?: Prisma.RxRefillOmit<ExtArgs> | null;
    where: Prisma.RxRefillWhereUniqueInput;
};
export type RxRefillDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RxRefillWhereInput;
    limit?: number;
};
export type RxRefillDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RxRefillSelect<ExtArgs> | null;
    omit?: Prisma.RxRefillOmit<ExtArgs> | null;
};
