import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type PassportRevocationModel = runtime.Types.Result.DefaultSelection<Prisma.$PassportRevocationPayload>;
export type AggregatePassportRevocation = {
    _count: PassportRevocationCountAggregateOutputType | null;
    _min: PassportRevocationMinAggregateOutputType | null;
    _max: PassportRevocationMaxAggregateOutputType | null;
};
export type PassportRevocationMinAggregateOutputType = {
    id: string | null;
    kind: string | null;
    value: string | null;
    revokedAt: Date | null;
    expiresAt: Date | null;
};
export type PassportRevocationMaxAggregateOutputType = {
    id: string | null;
    kind: string | null;
    value: string | null;
    revokedAt: Date | null;
    expiresAt: Date | null;
};
export type PassportRevocationCountAggregateOutputType = {
    id: number;
    kind: number;
    value: number;
    revokedAt: number;
    expiresAt: number;
    _all: number;
};
export type PassportRevocationMinAggregateInputType = {
    id?: true;
    kind?: true;
    value?: true;
    revokedAt?: true;
    expiresAt?: true;
};
export type PassportRevocationMaxAggregateInputType = {
    id?: true;
    kind?: true;
    value?: true;
    revokedAt?: true;
    expiresAt?: true;
};
export type PassportRevocationCountAggregateInputType = {
    id?: true;
    kind?: true;
    value?: true;
    revokedAt?: true;
    expiresAt?: true;
    _all?: true;
};
export type PassportRevocationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PassportRevocationWhereInput;
    orderBy?: Prisma.PassportRevocationOrderByWithRelationInput | Prisma.PassportRevocationOrderByWithRelationInput[];
    cursor?: Prisma.PassportRevocationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PassportRevocationCountAggregateInputType;
    _min?: PassportRevocationMinAggregateInputType;
    _max?: PassportRevocationMaxAggregateInputType;
};
export type GetPassportRevocationAggregateType<T extends PassportRevocationAggregateArgs> = {
    [P in keyof T & keyof AggregatePassportRevocation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePassportRevocation[P]> : Prisma.GetScalarType<T[P], AggregatePassportRevocation[P]>;
};
export type PassportRevocationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PassportRevocationWhereInput;
    orderBy?: Prisma.PassportRevocationOrderByWithAggregationInput | Prisma.PassportRevocationOrderByWithAggregationInput[];
    by: Prisma.PassportRevocationScalarFieldEnum[] | Prisma.PassportRevocationScalarFieldEnum;
    having?: Prisma.PassportRevocationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PassportRevocationCountAggregateInputType | true;
    _min?: PassportRevocationMinAggregateInputType;
    _max?: PassportRevocationMaxAggregateInputType;
};
export type PassportRevocationGroupByOutputType = {
    id: string;
    kind: string;
    value: string;
    revokedAt: Date;
    expiresAt: Date;
    _count: PassportRevocationCountAggregateOutputType | null;
    _min: PassportRevocationMinAggregateOutputType | null;
    _max: PassportRevocationMaxAggregateOutputType | null;
};
export type GetPassportRevocationGroupByPayload<T extends PassportRevocationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PassportRevocationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PassportRevocationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PassportRevocationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PassportRevocationGroupByOutputType[P]>;
}>>;
export type PassportRevocationWhereInput = {
    AND?: Prisma.PassportRevocationWhereInput | Prisma.PassportRevocationWhereInput[];
    OR?: Prisma.PassportRevocationWhereInput[];
    NOT?: Prisma.PassportRevocationWhereInput | Prisma.PassportRevocationWhereInput[];
    id?: Prisma.StringFilter<"PassportRevocation"> | string;
    kind?: Prisma.StringFilter<"PassportRevocation"> | string;
    value?: Prisma.StringFilter<"PassportRevocation"> | string;
    revokedAt?: Prisma.DateTimeFilter<"PassportRevocation"> | Date | string;
    expiresAt?: Prisma.DateTimeFilter<"PassportRevocation"> | Date | string;
};
export type PassportRevocationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type PassportRevocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    kind_value?: Prisma.PassportRevocationKindValueCompoundUniqueInput;
    AND?: Prisma.PassportRevocationWhereInput | Prisma.PassportRevocationWhereInput[];
    OR?: Prisma.PassportRevocationWhereInput[];
    NOT?: Prisma.PassportRevocationWhereInput | Prisma.PassportRevocationWhereInput[];
    kind?: Prisma.StringFilter<"PassportRevocation"> | string;
    value?: Prisma.StringFilter<"PassportRevocation"> | string;
    revokedAt?: Prisma.DateTimeFilter<"PassportRevocation"> | Date | string;
    expiresAt?: Prisma.DateTimeFilter<"PassportRevocation"> | Date | string;
}, "id" | "kind_value">;
export type PassportRevocationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    _count?: Prisma.PassportRevocationCountOrderByAggregateInput;
    _max?: Prisma.PassportRevocationMaxOrderByAggregateInput;
    _min?: Prisma.PassportRevocationMinOrderByAggregateInput;
};
export type PassportRevocationScalarWhereWithAggregatesInput = {
    AND?: Prisma.PassportRevocationScalarWhereWithAggregatesInput | Prisma.PassportRevocationScalarWhereWithAggregatesInput[];
    OR?: Prisma.PassportRevocationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PassportRevocationScalarWhereWithAggregatesInput | Prisma.PassportRevocationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PassportRevocation"> | string;
    kind?: Prisma.StringWithAggregatesFilter<"PassportRevocation"> | string;
    value?: Prisma.StringWithAggregatesFilter<"PassportRevocation"> | string;
    revokedAt?: Prisma.DateTimeWithAggregatesFilter<"PassportRevocation"> | Date | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"PassportRevocation"> | Date | string;
};
export type PassportRevocationCreateInput = {
    id?: string;
    kind: string;
    value: string;
    revokedAt?: Date | string;
    expiresAt: Date | string;
};
export type PassportRevocationUncheckedCreateInput = {
    id?: string;
    kind: string;
    value: string;
    revokedAt?: Date | string;
    expiresAt: Date | string;
};
export type PassportRevocationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    revokedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PassportRevocationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    revokedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PassportRevocationCreateManyInput = {
    id?: string;
    kind: string;
    value: string;
    revokedAt?: Date | string;
    expiresAt: Date | string;
};
export type PassportRevocationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    revokedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PassportRevocationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    revokedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PassportRevocationKindValueCompoundUniqueInput = {
    kind: string;
    value: string;
};
export type PassportRevocationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type PassportRevocationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type PassportRevocationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
};
export type PassportRevocationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    kind?: boolean;
    value?: boolean;
    revokedAt?: boolean;
    expiresAt?: boolean;
}, ExtArgs["result"]["passportRevocation"]>;
export type PassportRevocationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    kind?: boolean;
    value?: boolean;
    revokedAt?: boolean;
    expiresAt?: boolean;
}, ExtArgs["result"]["passportRevocation"]>;
export type PassportRevocationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    kind?: boolean;
    value?: boolean;
    revokedAt?: boolean;
    expiresAt?: boolean;
}, ExtArgs["result"]["passportRevocation"]>;
export type PassportRevocationSelectScalar = {
    id?: boolean;
    kind?: boolean;
    value?: boolean;
    revokedAt?: boolean;
    expiresAt?: boolean;
};
export type PassportRevocationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "kind" | "value" | "revokedAt" | "expiresAt", ExtArgs["result"]["passportRevocation"]>;
export type $PassportRevocationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PassportRevocation";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        kind: string;
        value: string;
        revokedAt: Date;
        expiresAt: Date;
    }, ExtArgs["result"]["passportRevocation"]>;
    composites: {};
};
export type PassportRevocationGetPayload<S extends boolean | null | undefined | PassportRevocationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PassportRevocationPayload, S>;
export type PassportRevocationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PassportRevocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PassportRevocationCountAggregateInputType | true;
};
export interface PassportRevocationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PassportRevocation'];
        meta: {
            name: 'PassportRevocation';
        };
    };
    findUnique<T extends PassportRevocationFindUniqueArgs>(args: Prisma.SelectSubset<T, PassportRevocationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PassportRevocationClient<runtime.Types.Result.GetResult<Prisma.$PassportRevocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PassportRevocationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PassportRevocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PassportRevocationClient<runtime.Types.Result.GetResult<Prisma.$PassportRevocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PassportRevocationFindFirstArgs>(args?: Prisma.SelectSubset<T, PassportRevocationFindFirstArgs<ExtArgs>>): Prisma.Prisma__PassportRevocationClient<runtime.Types.Result.GetResult<Prisma.$PassportRevocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PassportRevocationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PassportRevocationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PassportRevocationClient<runtime.Types.Result.GetResult<Prisma.$PassportRevocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PassportRevocationFindManyArgs>(args?: Prisma.SelectSubset<T, PassportRevocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PassportRevocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PassportRevocationCreateArgs>(args: Prisma.SelectSubset<T, PassportRevocationCreateArgs<ExtArgs>>): Prisma.Prisma__PassportRevocationClient<runtime.Types.Result.GetResult<Prisma.$PassportRevocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PassportRevocationCreateManyArgs>(args?: Prisma.SelectSubset<T, PassportRevocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PassportRevocationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PassportRevocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PassportRevocationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PassportRevocationDeleteArgs>(args: Prisma.SelectSubset<T, PassportRevocationDeleteArgs<ExtArgs>>): Prisma.Prisma__PassportRevocationClient<runtime.Types.Result.GetResult<Prisma.$PassportRevocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PassportRevocationUpdateArgs>(args: Prisma.SelectSubset<T, PassportRevocationUpdateArgs<ExtArgs>>): Prisma.Prisma__PassportRevocationClient<runtime.Types.Result.GetResult<Prisma.$PassportRevocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PassportRevocationDeleteManyArgs>(args?: Prisma.SelectSubset<T, PassportRevocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PassportRevocationUpdateManyArgs>(args: Prisma.SelectSubset<T, PassportRevocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PassportRevocationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PassportRevocationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PassportRevocationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PassportRevocationUpsertArgs>(args: Prisma.SelectSubset<T, PassportRevocationUpsertArgs<ExtArgs>>): Prisma.Prisma__PassportRevocationClient<runtime.Types.Result.GetResult<Prisma.$PassportRevocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PassportRevocationCountArgs>(args?: Prisma.Subset<T, PassportRevocationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PassportRevocationCountAggregateOutputType> : number>;
    aggregate<T extends PassportRevocationAggregateArgs>(args: Prisma.Subset<T, PassportRevocationAggregateArgs>): Prisma.PrismaPromise<GetPassportRevocationAggregateType<T>>;
    groupBy<T extends PassportRevocationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PassportRevocationGroupByArgs['orderBy'];
    } : {
        orderBy?: PassportRevocationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PassportRevocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPassportRevocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PassportRevocationFieldRefs;
}
export interface Prisma__PassportRevocationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PassportRevocationFieldRefs {
    readonly id: Prisma.FieldRef<"PassportRevocation", 'String'>;
    readonly kind: Prisma.FieldRef<"PassportRevocation", 'String'>;
    readonly value: Prisma.FieldRef<"PassportRevocation", 'String'>;
    readonly revokedAt: Prisma.FieldRef<"PassportRevocation", 'DateTime'>;
    readonly expiresAt: Prisma.FieldRef<"PassportRevocation", 'DateTime'>;
}
export type PassportRevocationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportRevocationSelect<ExtArgs> | null;
    omit?: Prisma.PassportRevocationOmit<ExtArgs> | null;
    where: Prisma.PassportRevocationWhereUniqueInput;
};
export type PassportRevocationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportRevocationSelect<ExtArgs> | null;
    omit?: Prisma.PassportRevocationOmit<ExtArgs> | null;
    where: Prisma.PassportRevocationWhereUniqueInput;
};
export type PassportRevocationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportRevocationSelect<ExtArgs> | null;
    omit?: Prisma.PassportRevocationOmit<ExtArgs> | null;
    where?: Prisma.PassportRevocationWhereInput;
    orderBy?: Prisma.PassportRevocationOrderByWithRelationInput | Prisma.PassportRevocationOrderByWithRelationInput[];
    cursor?: Prisma.PassportRevocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PassportRevocationScalarFieldEnum | Prisma.PassportRevocationScalarFieldEnum[];
};
export type PassportRevocationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportRevocationSelect<ExtArgs> | null;
    omit?: Prisma.PassportRevocationOmit<ExtArgs> | null;
    where?: Prisma.PassportRevocationWhereInput;
    orderBy?: Prisma.PassportRevocationOrderByWithRelationInput | Prisma.PassportRevocationOrderByWithRelationInput[];
    cursor?: Prisma.PassportRevocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PassportRevocationScalarFieldEnum | Prisma.PassportRevocationScalarFieldEnum[];
};
export type PassportRevocationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportRevocationSelect<ExtArgs> | null;
    omit?: Prisma.PassportRevocationOmit<ExtArgs> | null;
    where?: Prisma.PassportRevocationWhereInput;
    orderBy?: Prisma.PassportRevocationOrderByWithRelationInput | Prisma.PassportRevocationOrderByWithRelationInput[];
    cursor?: Prisma.PassportRevocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PassportRevocationScalarFieldEnum | Prisma.PassportRevocationScalarFieldEnum[];
};
export type PassportRevocationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportRevocationSelect<ExtArgs> | null;
    omit?: Prisma.PassportRevocationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PassportRevocationCreateInput, Prisma.PassportRevocationUncheckedCreateInput>;
};
export type PassportRevocationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PassportRevocationCreateManyInput | Prisma.PassportRevocationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PassportRevocationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportRevocationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PassportRevocationOmit<ExtArgs> | null;
    data: Prisma.PassportRevocationCreateManyInput | Prisma.PassportRevocationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PassportRevocationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportRevocationSelect<ExtArgs> | null;
    omit?: Prisma.PassportRevocationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PassportRevocationUpdateInput, Prisma.PassportRevocationUncheckedUpdateInput>;
    where: Prisma.PassportRevocationWhereUniqueInput;
};
export type PassportRevocationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PassportRevocationUpdateManyMutationInput, Prisma.PassportRevocationUncheckedUpdateManyInput>;
    where?: Prisma.PassportRevocationWhereInput;
    limit?: number;
};
export type PassportRevocationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportRevocationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PassportRevocationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PassportRevocationUpdateManyMutationInput, Prisma.PassportRevocationUncheckedUpdateManyInput>;
    where?: Prisma.PassportRevocationWhereInput;
    limit?: number;
};
export type PassportRevocationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportRevocationSelect<ExtArgs> | null;
    omit?: Prisma.PassportRevocationOmit<ExtArgs> | null;
    where: Prisma.PassportRevocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.PassportRevocationCreateInput, Prisma.PassportRevocationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PassportRevocationUpdateInput, Prisma.PassportRevocationUncheckedUpdateInput>;
};
export type PassportRevocationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportRevocationSelect<ExtArgs> | null;
    omit?: Prisma.PassportRevocationOmit<ExtArgs> | null;
    where: Prisma.PassportRevocationWhereUniqueInput;
};
export type PassportRevocationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PassportRevocationWhereInput;
    limit?: number;
};
export type PassportRevocationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PassportRevocationSelect<ExtArgs> | null;
    omit?: Prisma.PassportRevocationOmit<ExtArgs> | null;
};
