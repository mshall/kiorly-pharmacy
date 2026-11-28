import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ControlledCountersignModel = runtime.Types.Result.DefaultSelection<Prisma.$ControlledCountersignPayload>;
export type AggregateControlledCountersign = {
    _count: ControlledCountersignCountAggregateOutputType | null;
    _min: ControlledCountersignMinAggregateOutputType | null;
    _max: ControlledCountersignMaxAggregateOutputType | null;
};
export type ControlledCountersignMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    discrepancyId: string | null;
    witnessId: string | null;
    note: string | null;
    signedAt: Date | null;
};
export type ControlledCountersignMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    discrepancyId: string | null;
    witnessId: string | null;
    note: string | null;
    signedAt: Date | null;
};
export type ControlledCountersignCountAggregateOutputType = {
    id: number;
    orgId: number;
    discrepancyId: number;
    witnessId: number;
    note: number;
    signedAt: number;
    _all: number;
};
export type ControlledCountersignMinAggregateInputType = {
    id?: true;
    orgId?: true;
    discrepancyId?: true;
    witnessId?: true;
    note?: true;
    signedAt?: true;
};
export type ControlledCountersignMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    discrepancyId?: true;
    witnessId?: true;
    note?: true;
    signedAt?: true;
};
export type ControlledCountersignCountAggregateInputType = {
    id?: true;
    orgId?: true;
    discrepancyId?: true;
    witnessId?: true;
    note?: true;
    signedAt?: true;
    _all?: true;
};
export type ControlledCountersignAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ControlledCountersignWhereInput;
    orderBy?: Prisma.ControlledCountersignOrderByWithRelationInput | Prisma.ControlledCountersignOrderByWithRelationInput[];
    cursor?: Prisma.ControlledCountersignWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ControlledCountersignCountAggregateInputType;
    _min?: ControlledCountersignMinAggregateInputType;
    _max?: ControlledCountersignMaxAggregateInputType;
};
export type GetControlledCountersignAggregateType<T extends ControlledCountersignAggregateArgs> = {
    [P in keyof T & keyof AggregateControlledCountersign]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateControlledCountersign[P]> : Prisma.GetScalarType<T[P], AggregateControlledCountersign[P]>;
};
export type ControlledCountersignGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ControlledCountersignWhereInput;
    orderBy?: Prisma.ControlledCountersignOrderByWithAggregationInput | Prisma.ControlledCountersignOrderByWithAggregationInput[];
    by: Prisma.ControlledCountersignScalarFieldEnum[] | Prisma.ControlledCountersignScalarFieldEnum;
    having?: Prisma.ControlledCountersignScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ControlledCountersignCountAggregateInputType | true;
    _min?: ControlledCountersignMinAggregateInputType;
    _max?: ControlledCountersignMaxAggregateInputType;
};
export type ControlledCountersignGroupByOutputType = {
    id: string;
    orgId: string;
    discrepancyId: string;
    witnessId: string;
    note: string | null;
    signedAt: Date;
    _count: ControlledCountersignCountAggregateOutputType | null;
    _min: ControlledCountersignMinAggregateOutputType | null;
    _max: ControlledCountersignMaxAggregateOutputType | null;
};
export type GetControlledCountersignGroupByPayload<T extends ControlledCountersignGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ControlledCountersignGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ControlledCountersignGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ControlledCountersignGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ControlledCountersignGroupByOutputType[P]>;
}>>;
export type ControlledCountersignWhereInput = {
    AND?: Prisma.ControlledCountersignWhereInput | Prisma.ControlledCountersignWhereInput[];
    OR?: Prisma.ControlledCountersignWhereInput[];
    NOT?: Prisma.ControlledCountersignWhereInput | Prisma.ControlledCountersignWhereInput[];
    id?: Prisma.StringFilter<"ControlledCountersign"> | string;
    orgId?: Prisma.StringFilter<"ControlledCountersign"> | string;
    discrepancyId?: Prisma.StringFilter<"ControlledCountersign"> | string;
    witnessId?: Prisma.StringFilter<"ControlledCountersign"> | string;
    note?: Prisma.StringNullableFilter<"ControlledCountersign"> | string | null;
    signedAt?: Prisma.DateTimeFilter<"ControlledCountersign"> | Date | string;
};
export type ControlledCountersignOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    discrepancyId?: Prisma.SortOrder;
    witnessId?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    signedAt?: Prisma.SortOrder;
};
export type ControlledCountersignWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId_discrepancyId_witnessId?: Prisma.ControlledCountersignOrgIdDiscrepancyIdWitnessIdCompoundUniqueInput;
    AND?: Prisma.ControlledCountersignWhereInput | Prisma.ControlledCountersignWhereInput[];
    OR?: Prisma.ControlledCountersignWhereInput[];
    NOT?: Prisma.ControlledCountersignWhereInput | Prisma.ControlledCountersignWhereInput[];
    orgId?: Prisma.StringFilter<"ControlledCountersign"> | string;
    discrepancyId?: Prisma.StringFilter<"ControlledCountersign"> | string;
    witnessId?: Prisma.StringFilter<"ControlledCountersign"> | string;
    note?: Prisma.StringNullableFilter<"ControlledCountersign"> | string | null;
    signedAt?: Prisma.DateTimeFilter<"ControlledCountersign"> | Date | string;
}, "id" | "orgId_discrepancyId_witnessId">;
export type ControlledCountersignOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    discrepancyId?: Prisma.SortOrder;
    witnessId?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    signedAt?: Prisma.SortOrder;
    _count?: Prisma.ControlledCountersignCountOrderByAggregateInput;
    _max?: Prisma.ControlledCountersignMaxOrderByAggregateInput;
    _min?: Prisma.ControlledCountersignMinOrderByAggregateInput;
};
export type ControlledCountersignScalarWhereWithAggregatesInput = {
    AND?: Prisma.ControlledCountersignScalarWhereWithAggregatesInput | Prisma.ControlledCountersignScalarWhereWithAggregatesInput[];
    OR?: Prisma.ControlledCountersignScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ControlledCountersignScalarWhereWithAggregatesInput | Prisma.ControlledCountersignScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ControlledCountersign"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"ControlledCountersign"> | string;
    discrepancyId?: Prisma.StringWithAggregatesFilter<"ControlledCountersign"> | string;
    witnessId?: Prisma.StringWithAggregatesFilter<"ControlledCountersign"> | string;
    note?: Prisma.StringNullableWithAggregatesFilter<"ControlledCountersign"> | string | null;
    signedAt?: Prisma.DateTimeWithAggregatesFilter<"ControlledCountersign"> | Date | string;
};
export type ControlledCountersignCreateInput = {
    id?: string;
    orgId: string;
    discrepancyId: string;
    witnessId: string;
    note?: string | null;
    signedAt?: Date | string;
};
export type ControlledCountersignUncheckedCreateInput = {
    id?: string;
    orgId: string;
    discrepancyId: string;
    witnessId: string;
    note?: string | null;
    signedAt?: Date | string;
};
export type ControlledCountersignUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    discrepancyId?: Prisma.StringFieldUpdateOperationsInput | string;
    witnessId?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ControlledCountersignUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    discrepancyId?: Prisma.StringFieldUpdateOperationsInput | string;
    witnessId?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ControlledCountersignCreateManyInput = {
    id?: string;
    orgId: string;
    discrepancyId: string;
    witnessId: string;
    note?: string | null;
    signedAt?: Date | string;
};
export type ControlledCountersignUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    discrepancyId?: Prisma.StringFieldUpdateOperationsInput | string;
    witnessId?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ControlledCountersignUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    discrepancyId?: Prisma.StringFieldUpdateOperationsInput | string;
    witnessId?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ControlledCountersignOrgIdDiscrepancyIdWitnessIdCompoundUniqueInput = {
    orgId: string;
    discrepancyId: string;
    witnessId: string;
};
export type ControlledCountersignCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    discrepancyId?: Prisma.SortOrder;
    witnessId?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    signedAt?: Prisma.SortOrder;
};
export type ControlledCountersignMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    discrepancyId?: Prisma.SortOrder;
    witnessId?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    signedAt?: Prisma.SortOrder;
};
export type ControlledCountersignMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    discrepancyId?: Prisma.SortOrder;
    witnessId?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    signedAt?: Prisma.SortOrder;
};
export type ControlledCountersignSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    discrepancyId?: boolean;
    witnessId?: boolean;
    note?: boolean;
    signedAt?: boolean;
}, ExtArgs["result"]["controlledCountersign"]>;
export type ControlledCountersignSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    discrepancyId?: boolean;
    witnessId?: boolean;
    note?: boolean;
    signedAt?: boolean;
}, ExtArgs["result"]["controlledCountersign"]>;
export type ControlledCountersignSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    discrepancyId?: boolean;
    witnessId?: boolean;
    note?: boolean;
    signedAt?: boolean;
}, ExtArgs["result"]["controlledCountersign"]>;
export type ControlledCountersignSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    discrepancyId?: boolean;
    witnessId?: boolean;
    note?: boolean;
    signedAt?: boolean;
};
export type ControlledCountersignOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "discrepancyId" | "witnessId" | "note" | "signedAt", ExtArgs["result"]["controlledCountersign"]>;
export type $ControlledCountersignPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ControlledCountersign";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        discrepancyId: string;
        witnessId: string;
        note: string | null;
        signedAt: Date;
    }, ExtArgs["result"]["controlledCountersign"]>;
    composites: {};
};
export type ControlledCountersignGetPayload<S extends boolean | null | undefined | ControlledCountersignDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ControlledCountersignPayload, S>;
export type ControlledCountersignCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ControlledCountersignFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ControlledCountersignCountAggregateInputType | true;
};
export interface ControlledCountersignDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ControlledCountersign'];
        meta: {
            name: 'ControlledCountersign';
        };
    };
    findUnique<T extends ControlledCountersignFindUniqueArgs>(args: Prisma.SelectSubset<T, ControlledCountersignFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ControlledCountersignClient<runtime.Types.Result.GetResult<Prisma.$ControlledCountersignPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ControlledCountersignFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ControlledCountersignFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ControlledCountersignClient<runtime.Types.Result.GetResult<Prisma.$ControlledCountersignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ControlledCountersignFindFirstArgs>(args?: Prisma.SelectSubset<T, ControlledCountersignFindFirstArgs<ExtArgs>>): Prisma.Prisma__ControlledCountersignClient<runtime.Types.Result.GetResult<Prisma.$ControlledCountersignPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ControlledCountersignFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ControlledCountersignFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ControlledCountersignClient<runtime.Types.Result.GetResult<Prisma.$ControlledCountersignPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ControlledCountersignFindManyArgs>(args?: Prisma.SelectSubset<T, ControlledCountersignFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ControlledCountersignPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ControlledCountersignCreateArgs>(args: Prisma.SelectSubset<T, ControlledCountersignCreateArgs<ExtArgs>>): Prisma.Prisma__ControlledCountersignClient<runtime.Types.Result.GetResult<Prisma.$ControlledCountersignPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ControlledCountersignCreateManyArgs>(args?: Prisma.SelectSubset<T, ControlledCountersignCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ControlledCountersignCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ControlledCountersignCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ControlledCountersignPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ControlledCountersignDeleteArgs>(args: Prisma.SelectSubset<T, ControlledCountersignDeleteArgs<ExtArgs>>): Prisma.Prisma__ControlledCountersignClient<runtime.Types.Result.GetResult<Prisma.$ControlledCountersignPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ControlledCountersignUpdateArgs>(args: Prisma.SelectSubset<T, ControlledCountersignUpdateArgs<ExtArgs>>): Prisma.Prisma__ControlledCountersignClient<runtime.Types.Result.GetResult<Prisma.$ControlledCountersignPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ControlledCountersignDeleteManyArgs>(args?: Prisma.SelectSubset<T, ControlledCountersignDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ControlledCountersignUpdateManyArgs>(args: Prisma.SelectSubset<T, ControlledCountersignUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ControlledCountersignUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ControlledCountersignUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ControlledCountersignPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ControlledCountersignUpsertArgs>(args: Prisma.SelectSubset<T, ControlledCountersignUpsertArgs<ExtArgs>>): Prisma.Prisma__ControlledCountersignClient<runtime.Types.Result.GetResult<Prisma.$ControlledCountersignPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ControlledCountersignCountArgs>(args?: Prisma.Subset<T, ControlledCountersignCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ControlledCountersignCountAggregateOutputType> : number>;
    aggregate<T extends ControlledCountersignAggregateArgs>(args: Prisma.Subset<T, ControlledCountersignAggregateArgs>): Prisma.PrismaPromise<GetControlledCountersignAggregateType<T>>;
    groupBy<T extends ControlledCountersignGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ControlledCountersignGroupByArgs['orderBy'];
    } : {
        orderBy?: ControlledCountersignGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ControlledCountersignGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetControlledCountersignGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ControlledCountersignFieldRefs;
}
export interface Prisma__ControlledCountersignClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ControlledCountersignFieldRefs {
    readonly id: Prisma.FieldRef<"ControlledCountersign", 'String'>;
    readonly orgId: Prisma.FieldRef<"ControlledCountersign", 'String'>;
    readonly discrepancyId: Prisma.FieldRef<"ControlledCountersign", 'String'>;
    readonly witnessId: Prisma.FieldRef<"ControlledCountersign", 'String'>;
    readonly note: Prisma.FieldRef<"ControlledCountersign", 'String'>;
    readonly signedAt: Prisma.FieldRef<"ControlledCountersign", 'DateTime'>;
}
export type ControlledCountersignFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledCountersignSelect<ExtArgs> | null;
    omit?: Prisma.ControlledCountersignOmit<ExtArgs> | null;
    where: Prisma.ControlledCountersignWhereUniqueInput;
};
export type ControlledCountersignFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledCountersignSelect<ExtArgs> | null;
    omit?: Prisma.ControlledCountersignOmit<ExtArgs> | null;
    where: Prisma.ControlledCountersignWhereUniqueInput;
};
export type ControlledCountersignFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledCountersignSelect<ExtArgs> | null;
    omit?: Prisma.ControlledCountersignOmit<ExtArgs> | null;
    where?: Prisma.ControlledCountersignWhereInput;
    orderBy?: Prisma.ControlledCountersignOrderByWithRelationInput | Prisma.ControlledCountersignOrderByWithRelationInput[];
    cursor?: Prisma.ControlledCountersignWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ControlledCountersignScalarFieldEnum | Prisma.ControlledCountersignScalarFieldEnum[];
};
export type ControlledCountersignFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledCountersignSelect<ExtArgs> | null;
    omit?: Prisma.ControlledCountersignOmit<ExtArgs> | null;
    where?: Prisma.ControlledCountersignWhereInput;
    orderBy?: Prisma.ControlledCountersignOrderByWithRelationInput | Prisma.ControlledCountersignOrderByWithRelationInput[];
    cursor?: Prisma.ControlledCountersignWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ControlledCountersignScalarFieldEnum | Prisma.ControlledCountersignScalarFieldEnum[];
};
export type ControlledCountersignFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledCountersignSelect<ExtArgs> | null;
    omit?: Prisma.ControlledCountersignOmit<ExtArgs> | null;
    where?: Prisma.ControlledCountersignWhereInput;
    orderBy?: Prisma.ControlledCountersignOrderByWithRelationInput | Prisma.ControlledCountersignOrderByWithRelationInput[];
    cursor?: Prisma.ControlledCountersignWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ControlledCountersignScalarFieldEnum | Prisma.ControlledCountersignScalarFieldEnum[];
};
export type ControlledCountersignCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledCountersignSelect<ExtArgs> | null;
    omit?: Prisma.ControlledCountersignOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ControlledCountersignCreateInput, Prisma.ControlledCountersignUncheckedCreateInput>;
};
export type ControlledCountersignCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ControlledCountersignCreateManyInput | Prisma.ControlledCountersignCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ControlledCountersignCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledCountersignSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ControlledCountersignOmit<ExtArgs> | null;
    data: Prisma.ControlledCountersignCreateManyInput | Prisma.ControlledCountersignCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ControlledCountersignUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledCountersignSelect<ExtArgs> | null;
    omit?: Prisma.ControlledCountersignOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ControlledCountersignUpdateInput, Prisma.ControlledCountersignUncheckedUpdateInput>;
    where: Prisma.ControlledCountersignWhereUniqueInput;
};
export type ControlledCountersignUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ControlledCountersignUpdateManyMutationInput, Prisma.ControlledCountersignUncheckedUpdateManyInput>;
    where?: Prisma.ControlledCountersignWhereInput;
    limit?: number;
};
export type ControlledCountersignUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledCountersignSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ControlledCountersignOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ControlledCountersignUpdateManyMutationInput, Prisma.ControlledCountersignUncheckedUpdateManyInput>;
    where?: Prisma.ControlledCountersignWhereInput;
    limit?: number;
};
export type ControlledCountersignUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledCountersignSelect<ExtArgs> | null;
    omit?: Prisma.ControlledCountersignOmit<ExtArgs> | null;
    where: Prisma.ControlledCountersignWhereUniqueInput;
    create: Prisma.XOR<Prisma.ControlledCountersignCreateInput, Prisma.ControlledCountersignUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ControlledCountersignUpdateInput, Prisma.ControlledCountersignUncheckedUpdateInput>;
};
export type ControlledCountersignDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledCountersignSelect<ExtArgs> | null;
    omit?: Prisma.ControlledCountersignOmit<ExtArgs> | null;
    where: Prisma.ControlledCountersignWhereUniqueInput;
};
export type ControlledCountersignDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ControlledCountersignWhereInput;
    limit?: number;
};
export type ControlledCountersignDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ControlledCountersignSelect<ExtArgs> | null;
    omit?: Prisma.ControlledCountersignOmit<ExtArgs> | null;
};
