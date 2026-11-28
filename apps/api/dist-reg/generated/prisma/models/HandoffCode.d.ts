import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type HandoffCodeModel = runtime.Types.Result.DefaultSelection<Prisma.$HandoffCodePayload>;
export type AggregateHandoffCode = {
    _count: HandoffCodeCountAggregateOutputType | null;
    _min: HandoffCodeMinAggregateOutputType | null;
    _max: HandoffCodeMaxAggregateOutputType | null;
};
export type HandoffCodeMinAggregateOutputType = {
    id: string | null;
    codeHash: string | null;
    product: string | null;
    edition: string | null;
    origin: string | null;
    subjectId: string | null;
    createdAt: Date | null;
    expiresAt: Date | null;
    usedAt: Date | null;
};
export type HandoffCodeMaxAggregateOutputType = {
    id: string | null;
    codeHash: string | null;
    product: string | null;
    edition: string | null;
    origin: string | null;
    subjectId: string | null;
    createdAt: Date | null;
    expiresAt: Date | null;
    usedAt: Date | null;
};
export type HandoffCodeCountAggregateOutputType = {
    id: number;
    codeHash: number;
    product: number;
    edition: number;
    origin: number;
    subjectId: number;
    createdAt: number;
    expiresAt: number;
    usedAt: number;
    _all: number;
};
export type HandoffCodeMinAggregateInputType = {
    id?: true;
    codeHash?: true;
    product?: true;
    edition?: true;
    origin?: true;
    subjectId?: true;
    createdAt?: true;
    expiresAt?: true;
    usedAt?: true;
};
export type HandoffCodeMaxAggregateInputType = {
    id?: true;
    codeHash?: true;
    product?: true;
    edition?: true;
    origin?: true;
    subjectId?: true;
    createdAt?: true;
    expiresAt?: true;
    usedAt?: true;
};
export type HandoffCodeCountAggregateInputType = {
    id?: true;
    codeHash?: true;
    product?: true;
    edition?: true;
    origin?: true;
    subjectId?: true;
    createdAt?: true;
    expiresAt?: true;
    usedAt?: true;
    _all?: true;
};
export type HandoffCodeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HandoffCodeWhereInput;
    orderBy?: Prisma.HandoffCodeOrderByWithRelationInput | Prisma.HandoffCodeOrderByWithRelationInput[];
    cursor?: Prisma.HandoffCodeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | HandoffCodeCountAggregateInputType;
    _min?: HandoffCodeMinAggregateInputType;
    _max?: HandoffCodeMaxAggregateInputType;
};
export type GetHandoffCodeAggregateType<T extends HandoffCodeAggregateArgs> = {
    [P in keyof T & keyof AggregateHandoffCode]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateHandoffCode[P]> : Prisma.GetScalarType<T[P], AggregateHandoffCode[P]>;
};
export type HandoffCodeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HandoffCodeWhereInput;
    orderBy?: Prisma.HandoffCodeOrderByWithAggregationInput | Prisma.HandoffCodeOrderByWithAggregationInput[];
    by: Prisma.HandoffCodeScalarFieldEnum[] | Prisma.HandoffCodeScalarFieldEnum;
    having?: Prisma.HandoffCodeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: HandoffCodeCountAggregateInputType | true;
    _min?: HandoffCodeMinAggregateInputType;
    _max?: HandoffCodeMaxAggregateInputType;
};
export type HandoffCodeGroupByOutputType = {
    id: string;
    codeHash: string;
    product: string;
    edition: string | null;
    origin: string;
    subjectId: string;
    createdAt: Date;
    expiresAt: Date;
    usedAt: Date | null;
    _count: HandoffCodeCountAggregateOutputType | null;
    _min: HandoffCodeMinAggregateOutputType | null;
    _max: HandoffCodeMaxAggregateOutputType | null;
};
export type GetHandoffCodeGroupByPayload<T extends HandoffCodeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<HandoffCodeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof HandoffCodeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], HandoffCodeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], HandoffCodeGroupByOutputType[P]>;
}>>;
export type HandoffCodeWhereInput = {
    AND?: Prisma.HandoffCodeWhereInput | Prisma.HandoffCodeWhereInput[];
    OR?: Prisma.HandoffCodeWhereInput[];
    NOT?: Prisma.HandoffCodeWhereInput | Prisma.HandoffCodeWhereInput[];
    id?: Prisma.StringFilter<"HandoffCode"> | string;
    codeHash?: Prisma.StringFilter<"HandoffCode"> | string;
    product?: Prisma.StringFilter<"HandoffCode"> | string;
    edition?: Prisma.StringNullableFilter<"HandoffCode"> | string | null;
    origin?: Prisma.StringFilter<"HandoffCode"> | string;
    subjectId?: Prisma.StringFilter<"HandoffCode"> | string;
    createdAt?: Prisma.DateTimeFilter<"HandoffCode"> | Date | string;
    expiresAt?: Prisma.DateTimeFilter<"HandoffCode"> | Date | string;
    usedAt?: Prisma.DateTimeNullableFilter<"HandoffCode"> | Date | string | null;
};
export type HandoffCodeOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    codeHash?: Prisma.SortOrder;
    product?: Prisma.SortOrder;
    edition?: Prisma.SortOrderInput | Prisma.SortOrder;
    origin?: Prisma.SortOrder;
    subjectId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    usedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
};
export type HandoffCodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    codeHash?: string;
    AND?: Prisma.HandoffCodeWhereInput | Prisma.HandoffCodeWhereInput[];
    OR?: Prisma.HandoffCodeWhereInput[];
    NOT?: Prisma.HandoffCodeWhereInput | Prisma.HandoffCodeWhereInput[];
    product?: Prisma.StringFilter<"HandoffCode"> | string;
    edition?: Prisma.StringNullableFilter<"HandoffCode"> | string | null;
    origin?: Prisma.StringFilter<"HandoffCode"> | string;
    subjectId?: Prisma.StringFilter<"HandoffCode"> | string;
    createdAt?: Prisma.DateTimeFilter<"HandoffCode"> | Date | string;
    expiresAt?: Prisma.DateTimeFilter<"HandoffCode"> | Date | string;
    usedAt?: Prisma.DateTimeNullableFilter<"HandoffCode"> | Date | string | null;
}, "id" | "codeHash">;
export type HandoffCodeOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    codeHash?: Prisma.SortOrder;
    product?: Prisma.SortOrder;
    edition?: Prisma.SortOrderInput | Prisma.SortOrder;
    origin?: Prisma.SortOrder;
    subjectId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    usedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.HandoffCodeCountOrderByAggregateInput;
    _max?: Prisma.HandoffCodeMaxOrderByAggregateInput;
    _min?: Prisma.HandoffCodeMinOrderByAggregateInput;
};
export type HandoffCodeScalarWhereWithAggregatesInput = {
    AND?: Prisma.HandoffCodeScalarWhereWithAggregatesInput | Prisma.HandoffCodeScalarWhereWithAggregatesInput[];
    OR?: Prisma.HandoffCodeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.HandoffCodeScalarWhereWithAggregatesInput | Prisma.HandoffCodeScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"HandoffCode"> | string;
    codeHash?: Prisma.StringWithAggregatesFilter<"HandoffCode"> | string;
    product?: Prisma.StringWithAggregatesFilter<"HandoffCode"> | string;
    edition?: Prisma.StringNullableWithAggregatesFilter<"HandoffCode"> | string | null;
    origin?: Prisma.StringWithAggregatesFilter<"HandoffCode"> | string;
    subjectId?: Prisma.StringWithAggregatesFilter<"HandoffCode"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"HandoffCode"> | Date | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"HandoffCode"> | Date | string;
    usedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"HandoffCode"> | Date | string | null;
};
export type HandoffCodeCreateInput = {
    id?: string;
    codeHash: string;
    product: string;
    edition?: string | null;
    origin: string;
    subjectId: string;
    createdAt?: Date | string;
    expiresAt: Date | string;
    usedAt?: Date | string | null;
};
export type HandoffCodeUncheckedCreateInput = {
    id?: string;
    codeHash: string;
    product: string;
    edition?: string | null;
    origin: string;
    subjectId: string;
    createdAt?: Date | string;
    expiresAt: Date | string;
    usedAt?: Date | string | null;
};
export type HandoffCodeUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    codeHash?: Prisma.StringFieldUpdateOperationsInput | string;
    product?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    origin?: Prisma.StringFieldUpdateOperationsInput | string;
    subjectId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type HandoffCodeUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    codeHash?: Prisma.StringFieldUpdateOperationsInput | string;
    product?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    origin?: Prisma.StringFieldUpdateOperationsInput | string;
    subjectId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type HandoffCodeCreateManyInput = {
    id?: string;
    codeHash: string;
    product: string;
    edition?: string | null;
    origin: string;
    subjectId: string;
    createdAt?: Date | string;
    expiresAt: Date | string;
    usedAt?: Date | string | null;
};
export type HandoffCodeUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    codeHash?: Prisma.StringFieldUpdateOperationsInput | string;
    product?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    origin?: Prisma.StringFieldUpdateOperationsInput | string;
    subjectId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type HandoffCodeUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    codeHash?: Prisma.StringFieldUpdateOperationsInput | string;
    product?: Prisma.StringFieldUpdateOperationsInput | string;
    edition?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    origin?: Prisma.StringFieldUpdateOperationsInput | string;
    subjectId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type HandoffCodeCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    codeHash?: Prisma.SortOrder;
    product?: Prisma.SortOrder;
    edition?: Prisma.SortOrder;
    origin?: Prisma.SortOrder;
    subjectId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    usedAt?: Prisma.SortOrder;
};
export type HandoffCodeMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    codeHash?: Prisma.SortOrder;
    product?: Prisma.SortOrder;
    edition?: Prisma.SortOrder;
    origin?: Prisma.SortOrder;
    subjectId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    usedAt?: Prisma.SortOrder;
};
export type HandoffCodeMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    codeHash?: Prisma.SortOrder;
    product?: Prisma.SortOrder;
    edition?: Prisma.SortOrder;
    origin?: Prisma.SortOrder;
    subjectId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    usedAt?: Prisma.SortOrder;
};
export type HandoffCodeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    codeHash?: boolean;
    product?: boolean;
    edition?: boolean;
    origin?: boolean;
    subjectId?: boolean;
    createdAt?: boolean;
    expiresAt?: boolean;
    usedAt?: boolean;
}, ExtArgs["result"]["handoffCode"]>;
export type HandoffCodeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    codeHash?: boolean;
    product?: boolean;
    edition?: boolean;
    origin?: boolean;
    subjectId?: boolean;
    createdAt?: boolean;
    expiresAt?: boolean;
    usedAt?: boolean;
}, ExtArgs["result"]["handoffCode"]>;
export type HandoffCodeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    codeHash?: boolean;
    product?: boolean;
    edition?: boolean;
    origin?: boolean;
    subjectId?: boolean;
    createdAt?: boolean;
    expiresAt?: boolean;
    usedAt?: boolean;
}, ExtArgs["result"]["handoffCode"]>;
export type HandoffCodeSelectScalar = {
    id?: boolean;
    codeHash?: boolean;
    product?: boolean;
    edition?: boolean;
    origin?: boolean;
    subjectId?: boolean;
    createdAt?: boolean;
    expiresAt?: boolean;
    usedAt?: boolean;
};
export type HandoffCodeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "codeHash" | "product" | "edition" | "origin" | "subjectId" | "createdAt" | "expiresAt" | "usedAt", ExtArgs["result"]["handoffCode"]>;
export type $HandoffCodePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "HandoffCode";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        codeHash: string;
        product: string;
        edition: string | null;
        origin: string;
        subjectId: string;
        createdAt: Date;
        expiresAt: Date;
        usedAt: Date | null;
    }, ExtArgs["result"]["handoffCode"]>;
    composites: {};
};
export type HandoffCodeGetPayload<S extends boolean | null | undefined | HandoffCodeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$HandoffCodePayload, S>;
export type HandoffCodeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<HandoffCodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: HandoffCodeCountAggregateInputType | true;
};
export interface HandoffCodeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['HandoffCode'];
        meta: {
            name: 'HandoffCode';
        };
    };
    findUnique<T extends HandoffCodeFindUniqueArgs>(args: Prisma.SelectSubset<T, HandoffCodeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__HandoffCodeClient<runtime.Types.Result.GetResult<Prisma.$HandoffCodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends HandoffCodeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, HandoffCodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__HandoffCodeClient<runtime.Types.Result.GetResult<Prisma.$HandoffCodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends HandoffCodeFindFirstArgs>(args?: Prisma.SelectSubset<T, HandoffCodeFindFirstArgs<ExtArgs>>): Prisma.Prisma__HandoffCodeClient<runtime.Types.Result.GetResult<Prisma.$HandoffCodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends HandoffCodeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, HandoffCodeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__HandoffCodeClient<runtime.Types.Result.GetResult<Prisma.$HandoffCodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends HandoffCodeFindManyArgs>(args?: Prisma.SelectSubset<T, HandoffCodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HandoffCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends HandoffCodeCreateArgs>(args: Prisma.SelectSubset<T, HandoffCodeCreateArgs<ExtArgs>>): Prisma.Prisma__HandoffCodeClient<runtime.Types.Result.GetResult<Prisma.$HandoffCodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends HandoffCodeCreateManyArgs>(args?: Prisma.SelectSubset<T, HandoffCodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends HandoffCodeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, HandoffCodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HandoffCodePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends HandoffCodeDeleteArgs>(args: Prisma.SelectSubset<T, HandoffCodeDeleteArgs<ExtArgs>>): Prisma.Prisma__HandoffCodeClient<runtime.Types.Result.GetResult<Prisma.$HandoffCodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends HandoffCodeUpdateArgs>(args: Prisma.SelectSubset<T, HandoffCodeUpdateArgs<ExtArgs>>): Prisma.Prisma__HandoffCodeClient<runtime.Types.Result.GetResult<Prisma.$HandoffCodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends HandoffCodeDeleteManyArgs>(args?: Prisma.SelectSubset<T, HandoffCodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends HandoffCodeUpdateManyArgs>(args: Prisma.SelectSubset<T, HandoffCodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends HandoffCodeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, HandoffCodeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HandoffCodePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends HandoffCodeUpsertArgs>(args: Prisma.SelectSubset<T, HandoffCodeUpsertArgs<ExtArgs>>): Prisma.Prisma__HandoffCodeClient<runtime.Types.Result.GetResult<Prisma.$HandoffCodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends HandoffCodeCountArgs>(args?: Prisma.Subset<T, HandoffCodeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], HandoffCodeCountAggregateOutputType> : number>;
    aggregate<T extends HandoffCodeAggregateArgs>(args: Prisma.Subset<T, HandoffCodeAggregateArgs>): Prisma.PrismaPromise<GetHandoffCodeAggregateType<T>>;
    groupBy<T extends HandoffCodeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: HandoffCodeGroupByArgs['orderBy'];
    } : {
        orderBy?: HandoffCodeGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, HandoffCodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHandoffCodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: HandoffCodeFieldRefs;
}
export interface Prisma__HandoffCodeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface HandoffCodeFieldRefs {
    readonly id: Prisma.FieldRef<"HandoffCode", 'String'>;
    readonly codeHash: Prisma.FieldRef<"HandoffCode", 'String'>;
    readonly product: Prisma.FieldRef<"HandoffCode", 'String'>;
    readonly edition: Prisma.FieldRef<"HandoffCode", 'String'>;
    readonly origin: Prisma.FieldRef<"HandoffCode", 'String'>;
    readonly subjectId: Prisma.FieldRef<"HandoffCode", 'String'>;
    readonly createdAt: Prisma.FieldRef<"HandoffCode", 'DateTime'>;
    readonly expiresAt: Prisma.FieldRef<"HandoffCode", 'DateTime'>;
    readonly usedAt: Prisma.FieldRef<"HandoffCode", 'DateTime'>;
}
export type HandoffCodeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoffCodeSelect<ExtArgs> | null;
    omit?: Prisma.HandoffCodeOmit<ExtArgs> | null;
    where: Prisma.HandoffCodeWhereUniqueInput;
};
export type HandoffCodeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoffCodeSelect<ExtArgs> | null;
    omit?: Prisma.HandoffCodeOmit<ExtArgs> | null;
    where: Prisma.HandoffCodeWhereUniqueInput;
};
export type HandoffCodeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoffCodeSelect<ExtArgs> | null;
    omit?: Prisma.HandoffCodeOmit<ExtArgs> | null;
    where?: Prisma.HandoffCodeWhereInput;
    orderBy?: Prisma.HandoffCodeOrderByWithRelationInput | Prisma.HandoffCodeOrderByWithRelationInput[];
    cursor?: Prisma.HandoffCodeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HandoffCodeScalarFieldEnum | Prisma.HandoffCodeScalarFieldEnum[];
};
export type HandoffCodeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoffCodeSelect<ExtArgs> | null;
    omit?: Prisma.HandoffCodeOmit<ExtArgs> | null;
    where?: Prisma.HandoffCodeWhereInput;
    orderBy?: Prisma.HandoffCodeOrderByWithRelationInput | Prisma.HandoffCodeOrderByWithRelationInput[];
    cursor?: Prisma.HandoffCodeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HandoffCodeScalarFieldEnum | Prisma.HandoffCodeScalarFieldEnum[];
};
export type HandoffCodeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoffCodeSelect<ExtArgs> | null;
    omit?: Prisma.HandoffCodeOmit<ExtArgs> | null;
    where?: Prisma.HandoffCodeWhereInput;
    orderBy?: Prisma.HandoffCodeOrderByWithRelationInput | Prisma.HandoffCodeOrderByWithRelationInput[];
    cursor?: Prisma.HandoffCodeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HandoffCodeScalarFieldEnum | Prisma.HandoffCodeScalarFieldEnum[];
};
export type HandoffCodeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoffCodeSelect<ExtArgs> | null;
    omit?: Prisma.HandoffCodeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HandoffCodeCreateInput, Prisma.HandoffCodeUncheckedCreateInput>;
};
export type HandoffCodeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.HandoffCodeCreateManyInput | Prisma.HandoffCodeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type HandoffCodeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoffCodeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.HandoffCodeOmit<ExtArgs> | null;
    data: Prisma.HandoffCodeCreateManyInput | Prisma.HandoffCodeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type HandoffCodeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoffCodeSelect<ExtArgs> | null;
    omit?: Prisma.HandoffCodeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HandoffCodeUpdateInput, Prisma.HandoffCodeUncheckedUpdateInput>;
    where: Prisma.HandoffCodeWhereUniqueInput;
};
export type HandoffCodeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.HandoffCodeUpdateManyMutationInput, Prisma.HandoffCodeUncheckedUpdateManyInput>;
    where?: Prisma.HandoffCodeWhereInput;
    limit?: number;
};
export type HandoffCodeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoffCodeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.HandoffCodeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HandoffCodeUpdateManyMutationInput, Prisma.HandoffCodeUncheckedUpdateManyInput>;
    where?: Prisma.HandoffCodeWhereInput;
    limit?: number;
};
export type HandoffCodeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoffCodeSelect<ExtArgs> | null;
    omit?: Prisma.HandoffCodeOmit<ExtArgs> | null;
    where: Prisma.HandoffCodeWhereUniqueInput;
    create: Prisma.XOR<Prisma.HandoffCodeCreateInput, Prisma.HandoffCodeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.HandoffCodeUpdateInput, Prisma.HandoffCodeUncheckedUpdateInput>;
};
export type HandoffCodeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoffCodeSelect<ExtArgs> | null;
    omit?: Prisma.HandoffCodeOmit<ExtArgs> | null;
    where: Prisma.HandoffCodeWhereUniqueInput;
};
export type HandoffCodeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HandoffCodeWhereInput;
    limit?: number;
};
export type HandoffCodeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HandoffCodeSelect<ExtArgs> | null;
    omit?: Prisma.HandoffCodeOmit<ExtArgs> | null;
};
