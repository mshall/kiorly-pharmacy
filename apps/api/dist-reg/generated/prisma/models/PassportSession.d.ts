import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type PassportSessionModel = runtime.Types.Result.DefaultSelection<Prisma.$PassportSessionPayload>;
export type AggregatePassportSession = {
    _count: PassportSessionCountAggregateOutputType | null;
    _min: PassportSessionMinAggregateOutputType | null;
    _max: PassportSessionMaxAggregateOutputType | null;
};
export type PassportSessionMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    staffId: string | null;
    sub: string | null;
    sid: string | null;
    createdAt: Date | null;
    lastSeenAt: Date | null;
    expiresAt: Date | null;
    revokedAt: Date | null;
    revokedReason: string | null;
};
export type PassportSessionMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    staffId: string | null;
    sub: string | null;
    sid: string | null;
    createdAt: Date | null;
    lastSeenAt: Date | null;
    expiresAt: Date | null;
    revokedAt: Date | null;
    revokedReason: string | null;
};
export type PassportSessionCountAggregateOutputType = {
    id: number;
    orgId: number;
    staffId: number;
    sub: number;
    sid: number;
    createdAt: number;
    lastSeenAt: number;
    expiresAt: number;
    revokedAt: number;
    revokedReason: number;
    _all: number;
};
export type PassportSessionMinAggregateInputType = {
    id?: true;
    orgId?: true;
    staffId?: true;
    sub?: true;
    sid?: true;
    createdAt?: true;
    lastSeenAt?: true;
    expiresAt?: true;
    revokedAt?: true;
    revokedReason?: true;
};
export type PassportSessionMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    staffId?: true;
    sub?: true;
    sid?: true;
    createdAt?: true;
    lastSeenAt?: true;
    expiresAt?: true;
    revokedAt?: true;
    revokedReason?: true;
};
export type PassportSessionCountAggregateInputType = {
    id?: true;
    orgId?: true;
    staffId?: true;
    sub?: true;
    sid?: true;
    createdAt?: true;
    lastSeenAt?: true;
    expiresAt?: true;
    revokedAt?: true;
    revokedReason?: true;
    _all?: true;
};
export type PassportSessionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PassportSessionWhereInput;
    orderBy?: Prisma.PassportSessionOrderByWithRelationInput | Prisma.PassportSessionOrderByWithRelationInput[];
    cursor?: Prisma.PassportSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PassportSessionCountAggregateInputType;
    _min?: PassportSessionMinAggregateInputType;
    _max?: PassportSessionMaxAggregateInputType;
};
export type GetPassportSessionAggregateType<T extends PassportSessionAggregateArgs> = {
    [P in keyof T & keyof AggregatePassportSession]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePassportSession[P]> : Prisma.GetScalarType<T[P], AggregatePassportSession[P]>;
};
export type PassportSessionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PassportSessionWhereInput;
    orderBy?: Prisma.PassportSessionOrderByWithAggregationInput | Prisma.PassportSessionOrderByWithAggregationInput[];
    by: Prisma.PassportSessionScalarFieldEnum[] | Prisma.PassportSessionScalarFieldEnum;
    having?: Prisma.PassportSessionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PassportSessionCountAggregateInputType | true;
    _min?: PassportSessionMinAggregateInputType;
    _max?: PassportSessionMaxAggregateInputType;
};
export type PassportSessionGroupByOutputType = {
    id: string;
    orgId: string;
    staffId: string;
    sub: string;
    sid: string | null;
    createdAt: Date;
    lastSeenAt: Date;
    expiresAt: Date;
    revokedAt: Date | null;
    revokedReason: string | null;
    _count: PassportSessionCountAggregateOutputType | null;
    _min: PassportSessionMinAggregateOutputType | null;
    _max: PassportSessionMaxAggregateOutputType | null;
};
export type GetPassportSessionGroupByPayload<T extends PassportSessionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PassportSessionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PassportSessionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PassportSessionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PassportSessionGroupByOutputType[P]>;
}>>;
export type PassportSessionWhereInput = {
    AND?: Prisma.PassportSessionWhereInput | Prisma.PassportSessionWhereInput[];
    OR?: Prisma.PassportSessionWhereInput[];
    NOT?: Prisma.PassportSessionWhereInput | Prisma.PassportSessionWhereInput[];
    id?: Prisma.StringFilter<"PassportSession"> | string;
    orgId?: Prisma.StringFilter<"PassportSession"> | string;
    staffId?: Prisma.StringFilter<"PassportSession"> | string;
    sub?: Prisma.StringFilter<"PassportSession"> | string;
    sid?: Prisma.StringNullableFilter<"PassportSession"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PassportSession"> | Date | string;
    lastSeenAt?: Prisma.DateTimeFilter<"PassportSession"> | Date | string;
    expiresAt?: Prisma.DateTimeFilter<"PassportSession"> | Date | string;
    revokedAt?: Prisma.DateTimeNullableFilter<"PassportSession"> | Date | string | null;
    revokedReason?: Prisma.StringNullableFilter<"PassportSession"> | string | null;
};
export type PassportSessionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    staffId?: Prisma.SortOrder;
    sub?: Prisma.SortOrder;
    sid?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    lastSeenAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    revokedReason?: Prisma.SortOrderInput | Prisma.SortOrder;
};
export type PassportSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PassportSessionWhereInput | Prisma.PassportSessionWhereInput[];
    OR?: Prisma.PassportSessionWhereInput[];
    NOT?: Prisma.PassportSessionWhereInput | Prisma.PassportSessionWhereInput[];
    orgId?: Prisma.StringFilter<"PassportSession"> | string;
    staffId?: Prisma.StringFilter<"PassportSession"> | string;
    sub?: Prisma.StringFilter<"PassportSession"> | string;
    sid?: Prisma.StringNullableFilter<"PassportSession"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PassportSession"> | Date | string;
    lastSeenAt?: Prisma.DateTimeFilter<"PassportSession"> | Date | string;
    expiresAt?: Prisma.DateTimeFilter<"PassportSession"> | Date | string;
    revokedAt?: Prisma.DateTimeNullableFilter<"PassportSession"> | Date | string | null;
    revokedReason?: Prisma.StringNullableFilter<"PassportSession"> | string | null;
}, "id">;
export type PassportSessionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    staffId?: Prisma.SortOrder;
    sub?: Prisma.SortOrder;
    sid?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    lastSeenAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    revokedReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.PassportSessionCountOrderByAggregateInput;
    _max?: Prisma.PassportSessionMaxOrderByAggregateInput;
    _min?: Prisma.PassportSessionMinOrderByAggregateInput;
};
export type PassportSessionScalarWhereWithAggregatesInput = {
    AND?: Prisma.PassportSessionScalarWhereWithAggregatesInput | Prisma.PassportSessionScalarWhereWithAggregatesInput[];
    OR?: Prisma.PassportSessionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PassportSessionScalarWhereWithAggregatesInput | Prisma.PassportSessionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PassportSession"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"PassportSession"> | string;
    staffId?: Prisma.StringWithAggregatesFilter<"PassportSession"> | string;
    sub?: Prisma.StringWithAggregatesFilter<"PassportSession"> | string;
    sid?: Prisma.StringNullableWithAggregatesFilter<"PassportSession"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PassportSession"> | Date | string;
    lastSeenAt?: Prisma.DateTimeWithAggregatesFilter<"PassportSession"> | Date | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"PassportSession"> | Date | string;
    revokedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"PassportSession"> | Date | string | null;
    revokedReason?: Prisma.StringNullableWithAggregatesFilter<"PassportSession"> | string | null;
};
export type PassportSessionCreateInput = {
    id?: string;
    orgId: string;
    staffId: string;
    sub: string;
    sid?: string | null;
    createdAt?: Date | string;
    lastSeenAt?: Date | string;
    expiresAt: Date | string;
    revokedAt?: Date | string | null;
    revokedReason?: string | null;
};
export type PassportSessionUncheckedCreateInput = {
    id?: string;
    orgId: string;
    staffId: string;
    sub: string;
    sid?: string | null;
    createdAt?: Date | string;
    lastSeenAt?: Date | string;
    expiresAt: Date | string;
    revokedAt?: Date | string | null;
    revokedReason?: string | null;
};
export type PassportSessionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    staffId?: Prisma.StringFieldUpdateOperationsInput | string;
    sub?: Prisma.StringFieldUpdateOperationsInput | string;
    sid?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lastSeenAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PassportSessionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    staffId?: Prisma.StringFieldUpdateOperationsInput | string;
    sub?: Prisma.StringFieldUpdateOperationsInput | string;
    sid?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lastSeenAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PassportSessionCreateManyInput = {
    id?: string;
    orgId: string;
    staffId: string;
    sub: string;
    sid?: string | null;
    createdAt?: Date | string;
    lastSeenAt?: Date | string;
    expiresAt: Date | string;
    revokedAt?: Date | string | null;
    revokedReason?: string | null;
};
export type PassportSessionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    staffId?: Prisma.StringFieldUpdateOperationsInput | string;
    sub?: Prisma.StringFieldUpdateOperationsInput | string;
    sid?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lastSeenAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PassportSessionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    staffId?: Prisma.StringFieldUpdateOperationsInput | string;
    sub?: Prisma.StringFieldUpdateOperationsInput | string;
    sid?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lastSeenAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PassportSessionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    staffId?: Prisma.SortOrder;
    sub?: Prisma.SortOrder;
    sid?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    lastSeenAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    revokedReason?: Prisma.SortOrder;
};
export type PassportSessionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    staffId?: Prisma.SortOrder;
    sub?: Prisma.SortOrder;
    sid?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    lastSeenAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    revokedReason?: Prisma.SortOrder;
};
export type PassportSessionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    staffId?: Prisma.SortOrder;
    sub?: Prisma.SortOrder;
    sid?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    lastSeenAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    revokedReason?: Prisma.SortOrder;
};
export type PassportSessionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    staffId?: boolean;
    sub?: boolean;
    sid?: boolean;
    createdAt?: boolean;
    lastSeenAt?: boolean;
    expiresAt?: boolean;
    revokedAt?: boolean;
    revokedReason?: boolean;
}, ExtArgs["result"]["passportSession"]>;
export type PassportSessionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    staffId?: boolean;
    sub?: boolean;
    sid?: boolean;
    createdAt?: boolean;
    lastSeenAt?: boolean;
    expiresAt?: boolean;
    revokedAt?: boolean;
    revokedReason?: boolean;
}, ExtArgs["result"]["passportSession"]>;
export type PassportSessionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    staffId?: boolean;
    sub?: boolean;
    sid?: boolean;
    createdAt?: boolean;
    lastSeenAt?: boolean;
    expiresAt?: boolean;
    revokedAt?: boolean;
    revokedReason?: boolean;
}, ExtArgs["result"]["passportSession"]>;
export type PassportSessionSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    staffId?: boolean;
    sub?: boolean;
    sid?: boolean;
    createdAt?: boolean;
    lastSeenAt?: boolean;
    expiresAt?: boolean;
    revokedAt?: boolean;
    revokedReason?: boolean;
};
export type PassportSessionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "staffId" | "sub" | "sid" | "createdAt" | "lastSeenAt" | "expiresAt" | "revokedAt" | "revokedReason", ExtArgs["result"]["passportSession"]>;
export type $PassportSessionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PassportSession";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        staffId: string;
        sub: string;
        sid: string | null;
        createdAt: Date;
        lastSeenAt: Date;
        expiresAt: Date;
        revokedAt: Date | null;
        revokedReason: string | null;
    }, ExtArgs["result"]["passportSession"]>;
    composites: {};
};
export type PassportSessionGetPayload<S extends boolean | null | undefined | PassportSessionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PassportSessionPayload, S>;
export type PassportSessionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PassportSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PassportSessionCountAggregateInputType | true;
};
export interface PassportSessionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PassportSession'];
        meta: {
            name: 'PassportSession';
        };
    };
    findUnique<T extends PassportSessionFindUniqueArgs>(args: Prisma.SelectSubset<T, PassportSessionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PassportSessionClient<runtime.Types.Result.GetResult<Prisma.$PassportSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PassportSessionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PassportSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PassportSessionClient<runtime.Types.Result.GetResult<Prisma.$PassportSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PassportSessionFindFirstArgs>(args?: Prisma.SelectSubset<T, PassportSessionFindFirstArgs<ExtArgs>>): Prisma.Prisma__PassportSessionClient<runtime.Types.Result.GetResult<Prisma.$PassportSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PassportSessionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PassportSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PassportSessionClient<runtime.Types.Result.GetResult<Prisma.$PassportSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PassportSessionFindManyArgs>(args?: Prisma.SelectSubset<T, PassportSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PassportSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PassportSessionCreateArgs>(args: Prisma.SelectSubset<T, PassportSessionCreateArgs<ExtArgs>>): Prisma.Prisma__PassportSessionClient<runtime.Types.Result.GetResult<Prisma.$PassportSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PassportSessionCreateManyArgs>(args?: Prisma.SelectSubset<T, PassportSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PassportSessionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PassportSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PassportSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PassportSessionDeleteArgs>(args: Prisma.SelectSubset<T, PassportSessionDeleteArgs<ExtArgs>>): Prisma.Prisma__PassportSessionClient<runtime.Types.Result.GetResult<Prisma.$PassportSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PassportSessionUpdateArgs>(args: Prisma.SelectSubset<T, PassportSessionUpdateArgs<ExtArgs>>): Prisma.Prisma__PassportSessionClient<runtime.Types.Result.GetResult<Prisma.$PassportSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PassportSessionDeleteManyArgs>(args?: Prisma.SelectSubset<T, PassportSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PassportSessionUpdateManyArgs>(args: Prisma.SelectSubset<T, PassportSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PassportSessionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PassportSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PassportSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PassportSessionUpsertArgs>(args: Prisma.SelectSubset<T, PassportSessionUpsertArgs<ExtArgs>>): Prisma.Prisma__PassportSessionClient<runtime.Types.Result.GetResult<Prisma.$PassportSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PassportSessionCountArgs>(args?: Prisma.Subset<T, PassportSessionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PassportSessionCountAggregateOutputType> : number>;
    aggregate<T extends PassportSessionAggregateArgs>(args: Prisma.Subset<T, PassportSessionAggregateArgs>): Prisma.PrismaPromise<GetPassportSessionAggregateType<T>>;
    groupBy<T extends PassportSessionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PassportSessionGroupByArgs['orderBy'];
    } : {
        orderBy?: PassportSessionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PassportSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPassportSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PassportSessionFieldRefs;
}
export interface Prisma__PassportSessionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PassportSessionFieldRefs {
    readonly id: Prisma.FieldRef<"PassportSession", 'String'>;
    readonly orgId: Prisma.FieldRef<"PassportSession", 'String'>;
    readonly staffId: Prisma.FieldRef<"PassportSession", 'String'>;
    readonly sub: Prisma.FieldRef<"PassportSession", 'String'>;
    readonly sid: Prisma.FieldRef<"PassportSession", 'String'>;
    readonly createdAt: Prisma.FieldRef<"PassportSession", 'DateTime'>;
    readonly lastSeenAt: Prisma.FieldRef<"PassportSession", 'DateTime'>;
    readonly expiresAt: Prisma.FieldRef<"PassportSession", 'DateTime'>;
    readonly revokedAt: Prisma.FieldRef<"PassportSession", 'DateTime'>;
    readonly revokedReason: Prisma.FieldRef<"PassportSession", 'String'>;
}
export type PassportSessionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportSessionSelect<ExtArgs> | null;
    omit?: Prisma.PassportSessionOmit<ExtArgs> | null;
    where: Prisma.PassportSessionWhereUniqueInput;
};
export type PassportSessionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportSessionSelect<ExtArgs> | null;
    omit?: Prisma.PassportSessionOmit<ExtArgs> | null;
    where: Prisma.PassportSessionWhereUniqueInput;
};
export type PassportSessionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportSessionSelect<ExtArgs> | null;
    omit?: Prisma.PassportSessionOmit<ExtArgs> | null;
    where?: Prisma.PassportSessionWhereInput;
    orderBy?: Prisma.PassportSessionOrderByWithRelationInput | Prisma.PassportSessionOrderByWithRelationInput[];
    cursor?: Prisma.PassportSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PassportSessionScalarFieldEnum | Prisma.PassportSessionScalarFieldEnum[];
};
export type PassportSessionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportSessionSelect<ExtArgs> | null;
    omit?: Prisma.PassportSessionOmit<ExtArgs> | null;
    where?: Prisma.PassportSessionWhereInput;
    orderBy?: Prisma.PassportSessionOrderByWithRelationInput | Prisma.PassportSessionOrderByWithRelationInput[];
    cursor?: Prisma.PassportSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PassportSessionScalarFieldEnum | Prisma.PassportSessionScalarFieldEnum[];
};
export type PassportSessionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportSessionSelect<ExtArgs> | null;
    omit?: Prisma.PassportSessionOmit<ExtArgs> | null;
    where?: Prisma.PassportSessionWhereInput;
    orderBy?: Prisma.PassportSessionOrderByWithRelationInput | Prisma.PassportSessionOrderByWithRelationInput[];
    cursor?: Prisma.PassportSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PassportSessionScalarFieldEnum | Prisma.PassportSessionScalarFieldEnum[];
};
export type PassportSessionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportSessionSelect<ExtArgs> | null;
    omit?: Prisma.PassportSessionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PassportSessionCreateInput, Prisma.PassportSessionUncheckedCreateInput>;
};
export type PassportSessionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PassportSessionCreateManyInput | Prisma.PassportSessionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PassportSessionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportSessionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PassportSessionOmit<ExtArgs> | null;
    data: Prisma.PassportSessionCreateManyInput | Prisma.PassportSessionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PassportSessionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportSessionSelect<ExtArgs> | null;
    omit?: Prisma.PassportSessionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PassportSessionUpdateInput, Prisma.PassportSessionUncheckedUpdateInput>;
    where: Prisma.PassportSessionWhereUniqueInput;
};
export type PassportSessionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PassportSessionUpdateManyMutationInput, Prisma.PassportSessionUncheckedUpdateManyInput>;
    where?: Prisma.PassportSessionWhereInput;
    limit?: number;
};
export type PassportSessionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportSessionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PassportSessionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PassportSessionUpdateManyMutationInput, Prisma.PassportSessionUncheckedUpdateManyInput>;
    where?: Prisma.PassportSessionWhereInput;
    limit?: number;
};
export type PassportSessionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportSessionSelect<ExtArgs> | null;
    omit?: Prisma.PassportSessionOmit<ExtArgs> | null;
    where: Prisma.PassportSessionWhereUniqueInput;
    create: Prisma.XOR<Prisma.PassportSessionCreateInput, Prisma.PassportSessionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PassportSessionUpdateInput, Prisma.PassportSessionUncheckedUpdateInput>;
};
export type PassportSessionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportSessionSelect<ExtArgs> | null;
    omit?: Prisma.PassportSessionOmit<ExtArgs> | null;
    where: Prisma.PassportSessionWhereUniqueInput;
};
export type PassportSessionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PassportSessionWhereInput;
    limit?: number;
};
export type PassportSessionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportSessionSelect<ExtArgs> | null;
    omit?: Prisma.PassportSessionOmit<ExtArgs> | null;
};
