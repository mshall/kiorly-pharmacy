import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ShelfLocationModel = runtime.Types.Result.DefaultSelection<Prisma.$ShelfLocationPayload>;
export type AggregateShelfLocation = {
    _count: ShelfLocationCountAggregateOutputType | null;
    _min: ShelfLocationMinAggregateOutputType | null;
    _max: ShelfLocationMaxAggregateOutputType | null;
};
export type ShelfLocationMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    code: string | null;
    label: string | null;
    kind: string | null;
    active: boolean | null;
    createdAt: Date | null;
};
export type ShelfLocationMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    code: string | null;
    label: string | null;
    kind: string | null;
    active: boolean | null;
    createdAt: Date | null;
};
export type ShelfLocationCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    code: number;
    label: number;
    kind: number;
    active: number;
    createdAt: number;
    _all: number;
};
export type ShelfLocationMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    code?: true;
    label?: true;
    kind?: true;
    active?: true;
    createdAt?: true;
};
export type ShelfLocationMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    code?: true;
    label?: true;
    kind?: true;
    active?: true;
    createdAt?: true;
};
export type ShelfLocationCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    code?: true;
    label?: true;
    kind?: true;
    active?: true;
    createdAt?: true;
    _all?: true;
};
export type ShelfLocationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ShelfLocationWhereInput;
    orderBy?: Prisma.ShelfLocationOrderByWithRelationInput | Prisma.ShelfLocationOrderByWithRelationInput[];
    cursor?: Prisma.ShelfLocationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ShelfLocationCountAggregateInputType;
    _min?: ShelfLocationMinAggregateInputType;
    _max?: ShelfLocationMaxAggregateInputType;
};
export type GetShelfLocationAggregateType<T extends ShelfLocationAggregateArgs> = {
    [P in keyof T & keyof AggregateShelfLocation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateShelfLocation[P]> : Prisma.GetScalarType<T[P], AggregateShelfLocation[P]>;
};
export type ShelfLocationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ShelfLocationWhereInput;
    orderBy?: Prisma.ShelfLocationOrderByWithAggregationInput | Prisma.ShelfLocationOrderByWithAggregationInput[];
    by: Prisma.ShelfLocationScalarFieldEnum[] | Prisma.ShelfLocationScalarFieldEnum;
    having?: Prisma.ShelfLocationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ShelfLocationCountAggregateInputType | true;
    _min?: ShelfLocationMinAggregateInputType;
    _max?: ShelfLocationMaxAggregateInputType;
};
export type ShelfLocationGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    code: string;
    label: string | null;
    kind: string;
    active: boolean;
    createdAt: Date;
    _count: ShelfLocationCountAggregateOutputType | null;
    _min: ShelfLocationMinAggregateOutputType | null;
    _max: ShelfLocationMaxAggregateOutputType | null;
};
export type GetShelfLocationGroupByPayload<T extends ShelfLocationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ShelfLocationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ShelfLocationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ShelfLocationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ShelfLocationGroupByOutputType[P]>;
}>>;
export type ShelfLocationWhereInput = {
    AND?: Prisma.ShelfLocationWhereInput | Prisma.ShelfLocationWhereInput[];
    OR?: Prisma.ShelfLocationWhereInput[];
    NOT?: Prisma.ShelfLocationWhereInput | Prisma.ShelfLocationWhereInput[];
    id?: Prisma.StringFilter<"ShelfLocation"> | string;
    orgId?: Prisma.StringFilter<"ShelfLocation"> | string;
    branchId?: Prisma.StringFilter<"ShelfLocation"> | string;
    code?: Prisma.StringFilter<"ShelfLocation"> | string;
    label?: Prisma.StringNullableFilter<"ShelfLocation"> | string | null;
    kind?: Prisma.StringFilter<"ShelfLocation"> | string;
    active?: Prisma.BoolFilter<"ShelfLocation"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"ShelfLocation"> | Date | string;
};
export type ShelfLocationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    label?: Prisma.SortOrderInput | Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ShelfLocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    branchId_code?: Prisma.ShelfLocationBranchIdCodeCompoundUniqueInput;
    AND?: Prisma.ShelfLocationWhereInput | Prisma.ShelfLocationWhereInput[];
    OR?: Prisma.ShelfLocationWhereInput[];
    NOT?: Prisma.ShelfLocationWhereInput | Prisma.ShelfLocationWhereInput[];
    orgId?: Prisma.StringFilter<"ShelfLocation"> | string;
    branchId?: Prisma.StringFilter<"ShelfLocation"> | string;
    code?: Prisma.StringFilter<"ShelfLocation"> | string;
    label?: Prisma.StringNullableFilter<"ShelfLocation"> | string | null;
    kind?: Prisma.StringFilter<"ShelfLocation"> | string;
    active?: Prisma.BoolFilter<"ShelfLocation"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"ShelfLocation"> | Date | string;
}, "id" | "branchId_code">;
export type ShelfLocationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    label?: Prisma.SortOrderInput | Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ShelfLocationCountOrderByAggregateInput;
    _max?: Prisma.ShelfLocationMaxOrderByAggregateInput;
    _min?: Prisma.ShelfLocationMinOrderByAggregateInput;
};
export type ShelfLocationScalarWhereWithAggregatesInput = {
    AND?: Prisma.ShelfLocationScalarWhereWithAggregatesInput | Prisma.ShelfLocationScalarWhereWithAggregatesInput[];
    OR?: Prisma.ShelfLocationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ShelfLocationScalarWhereWithAggregatesInput | Prisma.ShelfLocationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ShelfLocation"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"ShelfLocation"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"ShelfLocation"> | string;
    code?: Prisma.StringWithAggregatesFilter<"ShelfLocation"> | string;
    label?: Prisma.StringNullableWithAggregatesFilter<"ShelfLocation"> | string | null;
    kind?: Prisma.StringWithAggregatesFilter<"ShelfLocation"> | string;
    active?: Prisma.BoolWithAggregatesFilter<"ShelfLocation"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ShelfLocation"> | Date | string;
};
export type ShelfLocationCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    code: string;
    label?: string | null;
    kind?: string;
    active?: boolean;
    createdAt?: Date | string;
};
export type ShelfLocationUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    code: string;
    label?: string | null;
    kind?: string;
    active?: boolean;
    createdAt?: Date | string;
};
export type ShelfLocationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ShelfLocationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ShelfLocationCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    code: string;
    label?: string | null;
    kind?: string;
    active?: boolean;
    createdAt?: Date | string;
};
export type ShelfLocationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ShelfLocationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ShelfLocationBranchIdCodeCompoundUniqueInput = {
    branchId: string;
    code: string;
};
export type ShelfLocationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ShelfLocationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ShelfLocationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ShelfLocationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    code?: boolean;
    label?: boolean;
    kind?: boolean;
    active?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["shelfLocation"]>;
export type ShelfLocationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    code?: boolean;
    label?: boolean;
    kind?: boolean;
    active?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["shelfLocation"]>;
export type ShelfLocationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    code?: boolean;
    label?: boolean;
    kind?: boolean;
    active?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["shelfLocation"]>;
export type ShelfLocationSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    code?: boolean;
    label?: boolean;
    kind?: boolean;
    active?: boolean;
    createdAt?: boolean;
};
export type ShelfLocationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "code" | "label" | "kind" | "active" | "createdAt", ExtArgs["result"]["shelfLocation"]>;
export type $ShelfLocationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ShelfLocation";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        code: string;
        label: string | null;
        kind: string;
        active: boolean;
        createdAt: Date;
    }, ExtArgs["result"]["shelfLocation"]>;
    composites: {};
};
export type ShelfLocationGetPayload<S extends boolean | null | undefined | ShelfLocationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ShelfLocationPayload, S>;
export type ShelfLocationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ShelfLocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ShelfLocationCountAggregateInputType | true;
};
export interface ShelfLocationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ShelfLocation'];
        meta: {
            name: 'ShelfLocation';
        };
    };
    findUnique<T extends ShelfLocationFindUniqueArgs>(args: Prisma.SelectSubset<T, ShelfLocationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ShelfLocationClient<runtime.Types.Result.GetResult<Prisma.$ShelfLocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ShelfLocationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ShelfLocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ShelfLocationClient<runtime.Types.Result.GetResult<Prisma.$ShelfLocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ShelfLocationFindFirstArgs>(args?: Prisma.SelectSubset<T, ShelfLocationFindFirstArgs<ExtArgs>>): Prisma.Prisma__ShelfLocationClient<runtime.Types.Result.GetResult<Prisma.$ShelfLocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ShelfLocationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ShelfLocationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ShelfLocationClient<runtime.Types.Result.GetResult<Prisma.$ShelfLocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ShelfLocationFindManyArgs>(args?: Prisma.SelectSubset<T, ShelfLocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ShelfLocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ShelfLocationCreateArgs>(args: Prisma.SelectSubset<T, ShelfLocationCreateArgs<ExtArgs>>): Prisma.Prisma__ShelfLocationClient<runtime.Types.Result.GetResult<Prisma.$ShelfLocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ShelfLocationCreateManyArgs>(args?: Prisma.SelectSubset<T, ShelfLocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ShelfLocationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ShelfLocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ShelfLocationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ShelfLocationDeleteArgs>(args: Prisma.SelectSubset<T, ShelfLocationDeleteArgs<ExtArgs>>): Prisma.Prisma__ShelfLocationClient<runtime.Types.Result.GetResult<Prisma.$ShelfLocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ShelfLocationUpdateArgs>(args: Prisma.SelectSubset<T, ShelfLocationUpdateArgs<ExtArgs>>): Prisma.Prisma__ShelfLocationClient<runtime.Types.Result.GetResult<Prisma.$ShelfLocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ShelfLocationDeleteManyArgs>(args?: Prisma.SelectSubset<T, ShelfLocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ShelfLocationUpdateManyArgs>(args: Prisma.SelectSubset<T, ShelfLocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ShelfLocationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ShelfLocationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ShelfLocationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ShelfLocationUpsertArgs>(args: Prisma.SelectSubset<T, ShelfLocationUpsertArgs<ExtArgs>>): Prisma.Prisma__ShelfLocationClient<runtime.Types.Result.GetResult<Prisma.$ShelfLocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ShelfLocationCountArgs>(args?: Prisma.Subset<T, ShelfLocationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ShelfLocationCountAggregateOutputType> : number>;
    aggregate<T extends ShelfLocationAggregateArgs>(args: Prisma.Subset<T, ShelfLocationAggregateArgs>): Prisma.PrismaPromise<GetShelfLocationAggregateType<T>>;
    groupBy<T extends ShelfLocationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ShelfLocationGroupByArgs['orderBy'];
    } : {
        orderBy?: ShelfLocationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ShelfLocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShelfLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ShelfLocationFieldRefs;
}
export interface Prisma__ShelfLocationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ShelfLocationFieldRefs {
    readonly id: Prisma.FieldRef<"ShelfLocation", 'String'>;
    readonly orgId: Prisma.FieldRef<"ShelfLocation", 'String'>;
    readonly branchId: Prisma.FieldRef<"ShelfLocation", 'String'>;
    readonly code: Prisma.FieldRef<"ShelfLocation", 'String'>;
    readonly label: Prisma.FieldRef<"ShelfLocation", 'String'>;
    readonly kind: Prisma.FieldRef<"ShelfLocation", 'String'>;
    readonly active: Prisma.FieldRef<"ShelfLocation", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"ShelfLocation", 'DateTime'>;
}
export type ShelfLocationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShelfLocationSelect<ExtArgs> | null;
    omit?: Prisma.ShelfLocationOmit<ExtArgs> | null;
    where: Prisma.ShelfLocationWhereUniqueInput;
};
export type ShelfLocationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShelfLocationSelect<ExtArgs> | null;
    omit?: Prisma.ShelfLocationOmit<ExtArgs> | null;
    where: Prisma.ShelfLocationWhereUniqueInput;
};
export type ShelfLocationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShelfLocationSelect<ExtArgs> | null;
    omit?: Prisma.ShelfLocationOmit<ExtArgs> | null;
    where?: Prisma.ShelfLocationWhereInput;
    orderBy?: Prisma.ShelfLocationOrderByWithRelationInput | Prisma.ShelfLocationOrderByWithRelationInput[];
    cursor?: Prisma.ShelfLocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ShelfLocationScalarFieldEnum | Prisma.ShelfLocationScalarFieldEnum[];
};
export type ShelfLocationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShelfLocationSelect<ExtArgs> | null;
    omit?: Prisma.ShelfLocationOmit<ExtArgs> | null;
    where?: Prisma.ShelfLocationWhereInput;
    orderBy?: Prisma.ShelfLocationOrderByWithRelationInput | Prisma.ShelfLocationOrderByWithRelationInput[];
    cursor?: Prisma.ShelfLocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ShelfLocationScalarFieldEnum | Prisma.ShelfLocationScalarFieldEnum[];
};
export type ShelfLocationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShelfLocationSelect<ExtArgs> | null;
    omit?: Prisma.ShelfLocationOmit<ExtArgs> | null;
    where?: Prisma.ShelfLocationWhereInput;
    orderBy?: Prisma.ShelfLocationOrderByWithRelationInput | Prisma.ShelfLocationOrderByWithRelationInput[];
    cursor?: Prisma.ShelfLocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ShelfLocationScalarFieldEnum | Prisma.ShelfLocationScalarFieldEnum[];
};
export type ShelfLocationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShelfLocationSelect<ExtArgs> | null;
    omit?: Prisma.ShelfLocationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ShelfLocationCreateInput, Prisma.ShelfLocationUncheckedCreateInput>;
};
export type ShelfLocationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ShelfLocationCreateManyInput | Prisma.ShelfLocationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ShelfLocationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShelfLocationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ShelfLocationOmit<ExtArgs> | null;
    data: Prisma.ShelfLocationCreateManyInput | Prisma.ShelfLocationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ShelfLocationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShelfLocationSelect<ExtArgs> | null;
    omit?: Prisma.ShelfLocationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ShelfLocationUpdateInput, Prisma.ShelfLocationUncheckedUpdateInput>;
    where: Prisma.ShelfLocationWhereUniqueInput;
};
export type ShelfLocationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ShelfLocationUpdateManyMutationInput, Prisma.ShelfLocationUncheckedUpdateManyInput>;
    where?: Prisma.ShelfLocationWhereInput;
    limit?: number;
};
export type ShelfLocationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShelfLocationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ShelfLocationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ShelfLocationUpdateManyMutationInput, Prisma.ShelfLocationUncheckedUpdateManyInput>;
    where?: Prisma.ShelfLocationWhereInput;
    limit?: number;
};
export type ShelfLocationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShelfLocationSelect<ExtArgs> | null;
    omit?: Prisma.ShelfLocationOmit<ExtArgs> | null;
    where: Prisma.ShelfLocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ShelfLocationCreateInput, Prisma.ShelfLocationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ShelfLocationUpdateInput, Prisma.ShelfLocationUncheckedUpdateInput>;
};
export type ShelfLocationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShelfLocationSelect<ExtArgs> | null;
    omit?: Prisma.ShelfLocationOmit<ExtArgs> | null;
    where: Prisma.ShelfLocationWhereUniqueInput;
};
export type ShelfLocationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ShelfLocationWhereInput;
    limit?: number;
};
export type ShelfLocationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ShelfLocationSelect<ExtArgs> | null;
    omit?: Prisma.ShelfLocationOmit<ExtArgs> | null;
};
