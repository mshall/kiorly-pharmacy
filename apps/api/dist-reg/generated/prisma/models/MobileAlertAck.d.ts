import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type MobileAlertAckModel = runtime.Types.Result.DefaultSelection<Prisma.$MobileAlertAckPayload>;
export type AggregateMobileAlertAck = {
    _count: MobileAlertAckCountAggregateOutputType | null;
    _min: MobileAlertAckMinAggregateOutputType | null;
    _max: MobileAlertAckMaxAggregateOutputType | null;
};
export type MobileAlertAckMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    alertKey: string | null;
    ackedBy: string | null;
    note: string | null;
    ackedAt: Date | null;
};
export type MobileAlertAckMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    alertKey: string | null;
    ackedBy: string | null;
    note: string | null;
    ackedAt: Date | null;
};
export type MobileAlertAckCountAggregateOutputType = {
    id: number;
    orgId: number;
    alertKey: number;
    ackedBy: number;
    note: number;
    ackedAt: number;
    _all: number;
};
export type MobileAlertAckMinAggregateInputType = {
    id?: true;
    orgId?: true;
    alertKey?: true;
    ackedBy?: true;
    note?: true;
    ackedAt?: true;
};
export type MobileAlertAckMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    alertKey?: true;
    ackedBy?: true;
    note?: true;
    ackedAt?: true;
};
export type MobileAlertAckCountAggregateInputType = {
    id?: true;
    orgId?: true;
    alertKey?: true;
    ackedBy?: true;
    note?: true;
    ackedAt?: true;
    _all?: true;
};
export type MobileAlertAckAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MobileAlertAckWhereInput;
    orderBy?: Prisma.MobileAlertAckOrderByWithRelationInput | Prisma.MobileAlertAckOrderByWithRelationInput[];
    cursor?: Prisma.MobileAlertAckWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MobileAlertAckCountAggregateInputType;
    _min?: MobileAlertAckMinAggregateInputType;
    _max?: MobileAlertAckMaxAggregateInputType;
};
export type GetMobileAlertAckAggregateType<T extends MobileAlertAckAggregateArgs> = {
    [P in keyof T & keyof AggregateMobileAlertAck]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMobileAlertAck[P]> : Prisma.GetScalarType<T[P], AggregateMobileAlertAck[P]>;
};
export type MobileAlertAckGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MobileAlertAckWhereInput;
    orderBy?: Prisma.MobileAlertAckOrderByWithAggregationInput | Prisma.MobileAlertAckOrderByWithAggregationInput[];
    by: Prisma.MobileAlertAckScalarFieldEnum[] | Prisma.MobileAlertAckScalarFieldEnum;
    having?: Prisma.MobileAlertAckScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MobileAlertAckCountAggregateInputType | true;
    _min?: MobileAlertAckMinAggregateInputType;
    _max?: MobileAlertAckMaxAggregateInputType;
};
export type MobileAlertAckGroupByOutputType = {
    id: string;
    orgId: string;
    alertKey: string;
    ackedBy: string;
    note: string | null;
    ackedAt: Date;
    _count: MobileAlertAckCountAggregateOutputType | null;
    _min: MobileAlertAckMinAggregateOutputType | null;
    _max: MobileAlertAckMaxAggregateOutputType | null;
};
export type GetMobileAlertAckGroupByPayload<T extends MobileAlertAckGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MobileAlertAckGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MobileAlertAckGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MobileAlertAckGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MobileAlertAckGroupByOutputType[P]>;
}>>;
export type MobileAlertAckWhereInput = {
    AND?: Prisma.MobileAlertAckWhereInput | Prisma.MobileAlertAckWhereInput[];
    OR?: Prisma.MobileAlertAckWhereInput[];
    NOT?: Prisma.MobileAlertAckWhereInput | Prisma.MobileAlertAckWhereInput[];
    id?: Prisma.StringFilter<"MobileAlertAck"> | string;
    orgId?: Prisma.StringFilter<"MobileAlertAck"> | string;
    alertKey?: Prisma.StringFilter<"MobileAlertAck"> | string;
    ackedBy?: Prisma.StringFilter<"MobileAlertAck"> | string;
    note?: Prisma.StringNullableFilter<"MobileAlertAck"> | string | null;
    ackedAt?: Prisma.DateTimeFilter<"MobileAlertAck"> | Date | string;
};
export type MobileAlertAckOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    alertKey?: Prisma.SortOrder;
    ackedBy?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    ackedAt?: Prisma.SortOrder;
};
export type MobileAlertAckWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId_alertKey?: Prisma.MobileAlertAckOrgIdAlertKeyCompoundUniqueInput;
    AND?: Prisma.MobileAlertAckWhereInput | Prisma.MobileAlertAckWhereInput[];
    OR?: Prisma.MobileAlertAckWhereInput[];
    NOT?: Prisma.MobileAlertAckWhereInput | Prisma.MobileAlertAckWhereInput[];
    orgId?: Prisma.StringFilter<"MobileAlertAck"> | string;
    alertKey?: Prisma.StringFilter<"MobileAlertAck"> | string;
    ackedBy?: Prisma.StringFilter<"MobileAlertAck"> | string;
    note?: Prisma.StringNullableFilter<"MobileAlertAck"> | string | null;
    ackedAt?: Prisma.DateTimeFilter<"MobileAlertAck"> | Date | string;
}, "id" | "orgId_alertKey">;
export type MobileAlertAckOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    alertKey?: Prisma.SortOrder;
    ackedBy?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    ackedAt?: Prisma.SortOrder;
    _count?: Prisma.MobileAlertAckCountOrderByAggregateInput;
    _max?: Prisma.MobileAlertAckMaxOrderByAggregateInput;
    _min?: Prisma.MobileAlertAckMinOrderByAggregateInput;
};
export type MobileAlertAckScalarWhereWithAggregatesInput = {
    AND?: Prisma.MobileAlertAckScalarWhereWithAggregatesInput | Prisma.MobileAlertAckScalarWhereWithAggregatesInput[];
    OR?: Prisma.MobileAlertAckScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MobileAlertAckScalarWhereWithAggregatesInput | Prisma.MobileAlertAckScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"MobileAlertAck"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"MobileAlertAck"> | string;
    alertKey?: Prisma.StringWithAggregatesFilter<"MobileAlertAck"> | string;
    ackedBy?: Prisma.StringWithAggregatesFilter<"MobileAlertAck"> | string;
    note?: Prisma.StringNullableWithAggregatesFilter<"MobileAlertAck"> | string | null;
    ackedAt?: Prisma.DateTimeWithAggregatesFilter<"MobileAlertAck"> | Date | string;
};
export type MobileAlertAckCreateInput = {
    id?: string;
    orgId: string;
    alertKey: string;
    ackedBy: string;
    note?: string | null;
    ackedAt?: Date | string;
};
export type MobileAlertAckUncheckedCreateInput = {
    id?: string;
    orgId: string;
    alertKey: string;
    ackedBy: string;
    note?: string | null;
    ackedAt?: Date | string;
};
export type MobileAlertAckUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    alertKey?: Prisma.StringFieldUpdateOperationsInput | string;
    ackedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ackedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MobileAlertAckUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    alertKey?: Prisma.StringFieldUpdateOperationsInput | string;
    ackedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ackedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MobileAlertAckCreateManyInput = {
    id?: string;
    orgId: string;
    alertKey: string;
    ackedBy: string;
    note?: string | null;
    ackedAt?: Date | string;
};
export type MobileAlertAckUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    alertKey?: Prisma.StringFieldUpdateOperationsInput | string;
    ackedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ackedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MobileAlertAckUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    alertKey?: Prisma.StringFieldUpdateOperationsInput | string;
    ackedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ackedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MobileAlertAckOrgIdAlertKeyCompoundUniqueInput = {
    orgId: string;
    alertKey: string;
};
export type MobileAlertAckCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    alertKey?: Prisma.SortOrder;
    ackedBy?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    ackedAt?: Prisma.SortOrder;
};
export type MobileAlertAckMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    alertKey?: Prisma.SortOrder;
    ackedBy?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    ackedAt?: Prisma.SortOrder;
};
export type MobileAlertAckMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    alertKey?: Prisma.SortOrder;
    ackedBy?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    ackedAt?: Prisma.SortOrder;
};
export type MobileAlertAckSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    alertKey?: boolean;
    ackedBy?: boolean;
    note?: boolean;
    ackedAt?: boolean;
}, ExtArgs["result"]["mobileAlertAck"]>;
export type MobileAlertAckSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    alertKey?: boolean;
    ackedBy?: boolean;
    note?: boolean;
    ackedAt?: boolean;
}, ExtArgs["result"]["mobileAlertAck"]>;
export type MobileAlertAckSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    alertKey?: boolean;
    ackedBy?: boolean;
    note?: boolean;
    ackedAt?: boolean;
}, ExtArgs["result"]["mobileAlertAck"]>;
export type MobileAlertAckSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    alertKey?: boolean;
    ackedBy?: boolean;
    note?: boolean;
    ackedAt?: boolean;
};
export type MobileAlertAckOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "alertKey" | "ackedBy" | "note" | "ackedAt", ExtArgs["result"]["mobileAlertAck"]>;
export type $MobileAlertAckPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MobileAlertAck";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        alertKey: string;
        ackedBy: string;
        note: string | null;
        ackedAt: Date;
    }, ExtArgs["result"]["mobileAlertAck"]>;
    composites: {};
};
export type MobileAlertAckGetPayload<S extends boolean | null | undefined | MobileAlertAckDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MobileAlertAckPayload, S>;
export type MobileAlertAckCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MobileAlertAckFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MobileAlertAckCountAggregateInputType | true;
};
export interface MobileAlertAckDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MobileAlertAck'];
        meta: {
            name: 'MobileAlertAck';
        };
    };
    findUnique<T extends MobileAlertAckFindUniqueArgs>(args: Prisma.SelectSubset<T, MobileAlertAckFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MobileAlertAckClient<runtime.Types.Result.GetResult<Prisma.$MobileAlertAckPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MobileAlertAckFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MobileAlertAckFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MobileAlertAckClient<runtime.Types.Result.GetResult<Prisma.$MobileAlertAckPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MobileAlertAckFindFirstArgs>(args?: Prisma.SelectSubset<T, MobileAlertAckFindFirstArgs<ExtArgs>>): Prisma.Prisma__MobileAlertAckClient<runtime.Types.Result.GetResult<Prisma.$MobileAlertAckPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MobileAlertAckFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MobileAlertAckFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MobileAlertAckClient<runtime.Types.Result.GetResult<Prisma.$MobileAlertAckPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MobileAlertAckFindManyArgs>(args?: Prisma.SelectSubset<T, MobileAlertAckFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MobileAlertAckPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MobileAlertAckCreateArgs>(args: Prisma.SelectSubset<T, MobileAlertAckCreateArgs<ExtArgs>>): Prisma.Prisma__MobileAlertAckClient<runtime.Types.Result.GetResult<Prisma.$MobileAlertAckPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MobileAlertAckCreateManyArgs>(args?: Prisma.SelectSubset<T, MobileAlertAckCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MobileAlertAckCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MobileAlertAckCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MobileAlertAckPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MobileAlertAckDeleteArgs>(args: Prisma.SelectSubset<T, MobileAlertAckDeleteArgs<ExtArgs>>): Prisma.Prisma__MobileAlertAckClient<runtime.Types.Result.GetResult<Prisma.$MobileAlertAckPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MobileAlertAckUpdateArgs>(args: Prisma.SelectSubset<T, MobileAlertAckUpdateArgs<ExtArgs>>): Prisma.Prisma__MobileAlertAckClient<runtime.Types.Result.GetResult<Prisma.$MobileAlertAckPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MobileAlertAckDeleteManyArgs>(args?: Prisma.SelectSubset<T, MobileAlertAckDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MobileAlertAckUpdateManyArgs>(args: Prisma.SelectSubset<T, MobileAlertAckUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MobileAlertAckUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MobileAlertAckUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MobileAlertAckPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MobileAlertAckUpsertArgs>(args: Prisma.SelectSubset<T, MobileAlertAckUpsertArgs<ExtArgs>>): Prisma.Prisma__MobileAlertAckClient<runtime.Types.Result.GetResult<Prisma.$MobileAlertAckPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MobileAlertAckCountArgs>(args?: Prisma.Subset<T, MobileAlertAckCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MobileAlertAckCountAggregateOutputType> : number>;
    aggregate<T extends MobileAlertAckAggregateArgs>(args: Prisma.Subset<T, MobileAlertAckAggregateArgs>): Prisma.PrismaPromise<GetMobileAlertAckAggregateType<T>>;
    groupBy<T extends MobileAlertAckGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MobileAlertAckGroupByArgs['orderBy'];
    } : {
        orderBy?: MobileAlertAckGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MobileAlertAckGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMobileAlertAckGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MobileAlertAckFieldRefs;
}
export interface Prisma__MobileAlertAckClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MobileAlertAckFieldRefs {
    readonly id: Prisma.FieldRef<"MobileAlertAck", 'String'>;
    readonly orgId: Prisma.FieldRef<"MobileAlertAck", 'String'>;
    readonly alertKey: Prisma.FieldRef<"MobileAlertAck", 'String'>;
    readonly ackedBy: Prisma.FieldRef<"MobileAlertAck", 'String'>;
    readonly note: Prisma.FieldRef<"MobileAlertAck", 'String'>;
    readonly ackedAt: Prisma.FieldRef<"MobileAlertAck", 'DateTime'>;
}
export type MobileAlertAckFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileAlertAckSelect<ExtArgs> | null;
    omit?: Prisma.MobileAlertAckOmit<ExtArgs> | null;
    where: Prisma.MobileAlertAckWhereUniqueInput;
};
export type MobileAlertAckFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileAlertAckSelect<ExtArgs> | null;
    omit?: Prisma.MobileAlertAckOmit<ExtArgs> | null;
    where: Prisma.MobileAlertAckWhereUniqueInput;
};
export type MobileAlertAckFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileAlertAckSelect<ExtArgs> | null;
    omit?: Prisma.MobileAlertAckOmit<ExtArgs> | null;
    where?: Prisma.MobileAlertAckWhereInput;
    orderBy?: Prisma.MobileAlertAckOrderByWithRelationInput | Prisma.MobileAlertAckOrderByWithRelationInput[];
    cursor?: Prisma.MobileAlertAckWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MobileAlertAckScalarFieldEnum | Prisma.MobileAlertAckScalarFieldEnum[];
};
export type MobileAlertAckFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileAlertAckSelect<ExtArgs> | null;
    omit?: Prisma.MobileAlertAckOmit<ExtArgs> | null;
    where?: Prisma.MobileAlertAckWhereInput;
    orderBy?: Prisma.MobileAlertAckOrderByWithRelationInput | Prisma.MobileAlertAckOrderByWithRelationInput[];
    cursor?: Prisma.MobileAlertAckWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MobileAlertAckScalarFieldEnum | Prisma.MobileAlertAckScalarFieldEnum[];
};
export type MobileAlertAckFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileAlertAckSelect<ExtArgs> | null;
    omit?: Prisma.MobileAlertAckOmit<ExtArgs> | null;
    where?: Prisma.MobileAlertAckWhereInput;
    orderBy?: Prisma.MobileAlertAckOrderByWithRelationInput | Prisma.MobileAlertAckOrderByWithRelationInput[];
    cursor?: Prisma.MobileAlertAckWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MobileAlertAckScalarFieldEnum | Prisma.MobileAlertAckScalarFieldEnum[];
};
export type MobileAlertAckCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileAlertAckSelect<ExtArgs> | null;
    omit?: Prisma.MobileAlertAckOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MobileAlertAckCreateInput, Prisma.MobileAlertAckUncheckedCreateInput>;
};
export type MobileAlertAckCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MobileAlertAckCreateManyInput | Prisma.MobileAlertAckCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MobileAlertAckCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileAlertAckSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MobileAlertAckOmit<ExtArgs> | null;
    data: Prisma.MobileAlertAckCreateManyInput | Prisma.MobileAlertAckCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MobileAlertAckUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileAlertAckSelect<ExtArgs> | null;
    omit?: Prisma.MobileAlertAckOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MobileAlertAckUpdateInput, Prisma.MobileAlertAckUncheckedUpdateInput>;
    where: Prisma.MobileAlertAckWhereUniqueInput;
};
export type MobileAlertAckUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MobileAlertAckUpdateManyMutationInput, Prisma.MobileAlertAckUncheckedUpdateManyInput>;
    where?: Prisma.MobileAlertAckWhereInput;
    limit?: number;
};
export type MobileAlertAckUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileAlertAckSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MobileAlertAckOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MobileAlertAckUpdateManyMutationInput, Prisma.MobileAlertAckUncheckedUpdateManyInput>;
    where?: Prisma.MobileAlertAckWhereInput;
    limit?: number;
};
export type MobileAlertAckUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileAlertAckSelect<ExtArgs> | null;
    omit?: Prisma.MobileAlertAckOmit<ExtArgs> | null;
    where: Prisma.MobileAlertAckWhereUniqueInput;
    create: Prisma.XOR<Prisma.MobileAlertAckCreateInput, Prisma.MobileAlertAckUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MobileAlertAckUpdateInput, Prisma.MobileAlertAckUncheckedUpdateInput>;
};
export type MobileAlertAckDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileAlertAckSelect<ExtArgs> | null;
    omit?: Prisma.MobileAlertAckOmit<ExtArgs> | null;
    where: Prisma.MobileAlertAckWhereUniqueInput;
};
export type MobileAlertAckDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MobileAlertAckWhereInput;
    limit?: number;
};
export type MobileAlertAckDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MobileAlertAckSelect<ExtArgs> | null;
    omit?: Prisma.MobileAlertAckOmit<ExtArgs> | null;
};
