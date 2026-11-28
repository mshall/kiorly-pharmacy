import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type HeldCartModel = runtime.Types.Result.DefaultSelection<Prisma.$HeldCartPayload>;
export type AggregateHeldCart = {
    _count: HeldCartCountAggregateOutputType | null;
    _min: HeldCartMinAggregateOutputType | null;
    _max: HeldCartMaxAggregateOutputType | null;
};
export type HeldCartMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    userId: string | null;
    label: string | null;
    patientId: string | null;
    status: string | null;
    createdAt: Date | null;
    resolvedAt: Date | null;
};
export type HeldCartMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    branchId: string | null;
    userId: string | null;
    label: string | null;
    patientId: string | null;
    status: string | null;
    createdAt: Date | null;
    resolvedAt: Date | null;
};
export type HeldCartCountAggregateOutputType = {
    id: number;
    orgId: number;
    branchId: number;
    userId: number;
    label: number;
    patientId: number;
    payload: number;
    status: number;
    createdAt: number;
    resolvedAt: number;
    _all: number;
};
export type HeldCartMinAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    userId?: true;
    label?: true;
    patientId?: true;
    status?: true;
    createdAt?: true;
    resolvedAt?: true;
};
export type HeldCartMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    userId?: true;
    label?: true;
    patientId?: true;
    status?: true;
    createdAt?: true;
    resolvedAt?: true;
};
export type HeldCartCountAggregateInputType = {
    id?: true;
    orgId?: true;
    branchId?: true;
    userId?: true;
    label?: true;
    patientId?: true;
    payload?: true;
    status?: true;
    createdAt?: true;
    resolvedAt?: true;
    _all?: true;
};
export type HeldCartAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HeldCartWhereInput;
    orderBy?: Prisma.HeldCartOrderByWithRelationInput | Prisma.HeldCartOrderByWithRelationInput[];
    cursor?: Prisma.HeldCartWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | HeldCartCountAggregateInputType;
    _min?: HeldCartMinAggregateInputType;
    _max?: HeldCartMaxAggregateInputType;
};
export type GetHeldCartAggregateType<T extends HeldCartAggregateArgs> = {
    [P in keyof T & keyof AggregateHeldCart]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateHeldCart[P]> : Prisma.GetScalarType<T[P], AggregateHeldCart[P]>;
};
export type HeldCartGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HeldCartWhereInput;
    orderBy?: Prisma.HeldCartOrderByWithAggregationInput | Prisma.HeldCartOrderByWithAggregationInput[];
    by: Prisma.HeldCartScalarFieldEnum[] | Prisma.HeldCartScalarFieldEnum;
    having?: Prisma.HeldCartScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: HeldCartCountAggregateInputType | true;
    _min?: HeldCartMinAggregateInputType;
    _max?: HeldCartMaxAggregateInputType;
};
export type HeldCartGroupByOutputType = {
    id: string;
    orgId: string;
    branchId: string;
    userId: string;
    label: string;
    patientId: string | null;
    payload: runtime.JsonValue;
    status: string;
    createdAt: Date;
    resolvedAt: Date | null;
    _count: HeldCartCountAggregateOutputType | null;
    _min: HeldCartMinAggregateOutputType | null;
    _max: HeldCartMaxAggregateOutputType | null;
};
export type GetHeldCartGroupByPayload<T extends HeldCartGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<HeldCartGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof HeldCartGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], HeldCartGroupByOutputType[P]> : Prisma.GetScalarType<T[P], HeldCartGroupByOutputType[P]>;
}>>;
export type HeldCartWhereInput = {
    AND?: Prisma.HeldCartWhereInput | Prisma.HeldCartWhereInput[];
    OR?: Prisma.HeldCartWhereInput[];
    NOT?: Prisma.HeldCartWhereInput | Prisma.HeldCartWhereInput[];
    id?: Prisma.StringFilter<"HeldCart"> | string;
    orgId?: Prisma.StringFilter<"HeldCart"> | string;
    branchId?: Prisma.StringFilter<"HeldCart"> | string;
    userId?: Prisma.StringFilter<"HeldCart"> | string;
    label?: Prisma.StringFilter<"HeldCart"> | string;
    patientId?: Prisma.StringNullableFilter<"HeldCart"> | string | null;
    payload?: Prisma.JsonFilter<"HeldCart">;
    status?: Prisma.StringFilter<"HeldCart"> | string;
    createdAt?: Prisma.DateTimeFilter<"HeldCart"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableFilter<"HeldCart"> | Date | string | null;
};
export type HeldCartOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    patientId?: Prisma.SortOrderInput | Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
};
export type HeldCartWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.HeldCartWhereInput | Prisma.HeldCartWhereInput[];
    OR?: Prisma.HeldCartWhereInput[];
    NOT?: Prisma.HeldCartWhereInput | Prisma.HeldCartWhereInput[];
    orgId?: Prisma.StringFilter<"HeldCart"> | string;
    branchId?: Prisma.StringFilter<"HeldCart"> | string;
    userId?: Prisma.StringFilter<"HeldCart"> | string;
    label?: Prisma.StringFilter<"HeldCart"> | string;
    patientId?: Prisma.StringNullableFilter<"HeldCart"> | string | null;
    payload?: Prisma.JsonFilter<"HeldCart">;
    status?: Prisma.StringFilter<"HeldCart"> | string;
    createdAt?: Prisma.DateTimeFilter<"HeldCart"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableFilter<"HeldCart"> | Date | string | null;
}, "id">;
export type HeldCartOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    patientId?: Prisma.SortOrderInput | Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.HeldCartCountOrderByAggregateInput;
    _max?: Prisma.HeldCartMaxOrderByAggregateInput;
    _min?: Prisma.HeldCartMinOrderByAggregateInput;
};
export type HeldCartScalarWhereWithAggregatesInput = {
    AND?: Prisma.HeldCartScalarWhereWithAggregatesInput | Prisma.HeldCartScalarWhereWithAggregatesInput[];
    OR?: Prisma.HeldCartScalarWhereWithAggregatesInput[];
    NOT?: Prisma.HeldCartScalarWhereWithAggregatesInput | Prisma.HeldCartScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"HeldCart"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"HeldCart"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"HeldCart"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"HeldCart"> | string;
    label?: Prisma.StringWithAggregatesFilter<"HeldCart"> | string;
    patientId?: Prisma.StringNullableWithAggregatesFilter<"HeldCart"> | string | null;
    payload?: Prisma.JsonWithAggregatesFilter<"HeldCart">;
    status?: Prisma.StringWithAggregatesFilter<"HeldCart"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"HeldCart"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"HeldCart"> | Date | string | null;
};
export type HeldCartCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    userId: string;
    label: string;
    patientId?: string | null;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
};
export type HeldCartUncheckedCreateInput = {
    id?: string;
    orgId: string;
    branchId: string;
    userId: string;
    label: string;
    patientId?: string | null;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
};
export type HeldCartUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type HeldCartUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type HeldCartCreateManyInput = {
    id?: string;
    orgId: string;
    branchId: string;
    userId: string;
    label: string;
    patientId?: string | null;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
};
export type HeldCartUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type HeldCartUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type HeldCartCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
};
export type HeldCartMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
};
export type HeldCartMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
};
export type HeldCartSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    userId?: boolean;
    label?: boolean;
    patientId?: boolean;
    payload?: boolean;
    status?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
}, ExtArgs["result"]["heldCart"]>;
export type HeldCartSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    userId?: boolean;
    label?: boolean;
    patientId?: boolean;
    payload?: boolean;
    status?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
}, ExtArgs["result"]["heldCart"]>;
export type HeldCartSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    userId?: boolean;
    label?: boolean;
    patientId?: boolean;
    payload?: boolean;
    status?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
}, ExtArgs["result"]["heldCart"]>;
export type HeldCartSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    branchId?: boolean;
    userId?: boolean;
    label?: boolean;
    patientId?: boolean;
    payload?: boolean;
    status?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
};
export type HeldCartOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "branchId" | "userId" | "label" | "patientId" | "payload" | "status" | "createdAt" | "resolvedAt", ExtArgs["result"]["heldCart"]>;
export type $HeldCartPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "HeldCart";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        branchId: string;
        userId: string;
        label: string;
        patientId: string | null;
        payload: runtime.JsonValue;
        status: string;
        createdAt: Date;
        resolvedAt: Date | null;
    }, ExtArgs["result"]["heldCart"]>;
    composites: {};
};
export type HeldCartGetPayload<S extends boolean | null | undefined | HeldCartDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$HeldCartPayload, S>;
export type HeldCartCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<HeldCartFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: HeldCartCountAggregateInputType | true;
};
export interface HeldCartDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['HeldCart'];
        meta: {
            name: 'HeldCart';
        };
    };
    findUnique<T extends HeldCartFindUniqueArgs>(args: Prisma.SelectSubset<T, HeldCartFindUniqueArgs<ExtArgs>>): Prisma.Prisma__HeldCartClient<runtime.Types.Result.GetResult<Prisma.$HeldCartPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends HeldCartFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, HeldCartFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__HeldCartClient<runtime.Types.Result.GetResult<Prisma.$HeldCartPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends HeldCartFindFirstArgs>(args?: Prisma.SelectSubset<T, HeldCartFindFirstArgs<ExtArgs>>): Prisma.Prisma__HeldCartClient<runtime.Types.Result.GetResult<Prisma.$HeldCartPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends HeldCartFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, HeldCartFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__HeldCartClient<runtime.Types.Result.GetResult<Prisma.$HeldCartPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends HeldCartFindManyArgs>(args?: Prisma.SelectSubset<T, HeldCartFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HeldCartPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends HeldCartCreateArgs>(args: Prisma.SelectSubset<T, HeldCartCreateArgs<ExtArgs>>): Prisma.Prisma__HeldCartClient<runtime.Types.Result.GetResult<Prisma.$HeldCartPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends HeldCartCreateManyArgs>(args?: Prisma.SelectSubset<T, HeldCartCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends HeldCartCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, HeldCartCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HeldCartPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends HeldCartDeleteArgs>(args: Prisma.SelectSubset<T, HeldCartDeleteArgs<ExtArgs>>): Prisma.Prisma__HeldCartClient<runtime.Types.Result.GetResult<Prisma.$HeldCartPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends HeldCartUpdateArgs>(args: Prisma.SelectSubset<T, HeldCartUpdateArgs<ExtArgs>>): Prisma.Prisma__HeldCartClient<runtime.Types.Result.GetResult<Prisma.$HeldCartPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends HeldCartDeleteManyArgs>(args?: Prisma.SelectSubset<T, HeldCartDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends HeldCartUpdateManyArgs>(args: Prisma.SelectSubset<T, HeldCartUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends HeldCartUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, HeldCartUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HeldCartPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends HeldCartUpsertArgs>(args: Prisma.SelectSubset<T, HeldCartUpsertArgs<ExtArgs>>): Prisma.Prisma__HeldCartClient<runtime.Types.Result.GetResult<Prisma.$HeldCartPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends HeldCartCountArgs>(args?: Prisma.Subset<T, HeldCartCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], HeldCartCountAggregateOutputType> : number>;
    aggregate<T extends HeldCartAggregateArgs>(args: Prisma.Subset<T, HeldCartAggregateArgs>): Prisma.PrismaPromise<GetHeldCartAggregateType<T>>;
    groupBy<T extends HeldCartGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: HeldCartGroupByArgs['orderBy'];
    } : {
        orderBy?: HeldCartGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, HeldCartGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHeldCartGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: HeldCartFieldRefs;
}
export interface Prisma__HeldCartClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface HeldCartFieldRefs {
    readonly id: Prisma.FieldRef<"HeldCart", 'String'>;
    readonly orgId: Prisma.FieldRef<"HeldCart", 'String'>;
    readonly branchId: Prisma.FieldRef<"HeldCart", 'String'>;
    readonly userId: Prisma.FieldRef<"HeldCart", 'String'>;
    readonly label: Prisma.FieldRef<"HeldCart", 'String'>;
    readonly patientId: Prisma.FieldRef<"HeldCart", 'String'>;
    readonly payload: Prisma.FieldRef<"HeldCart", 'Json'>;
    readonly status: Prisma.FieldRef<"HeldCart", 'String'>;
    readonly createdAt: Prisma.FieldRef<"HeldCart", 'DateTime'>;
    readonly resolvedAt: Prisma.FieldRef<"HeldCart", 'DateTime'>;
}
export type HeldCartFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HeldCartSelect<ExtArgs> | null;
    omit?: Prisma.HeldCartOmit<ExtArgs> | null;
    where: Prisma.HeldCartWhereUniqueInput;
};
export type HeldCartFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HeldCartSelect<ExtArgs> | null;
    omit?: Prisma.HeldCartOmit<ExtArgs> | null;
    where: Prisma.HeldCartWhereUniqueInput;
};
export type HeldCartFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HeldCartSelect<ExtArgs> | null;
    omit?: Prisma.HeldCartOmit<ExtArgs> | null;
    where?: Prisma.HeldCartWhereInput;
    orderBy?: Prisma.HeldCartOrderByWithRelationInput | Prisma.HeldCartOrderByWithRelationInput[];
    cursor?: Prisma.HeldCartWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HeldCartScalarFieldEnum | Prisma.HeldCartScalarFieldEnum[];
};
export type HeldCartFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HeldCartSelect<ExtArgs> | null;
    omit?: Prisma.HeldCartOmit<ExtArgs> | null;
    where?: Prisma.HeldCartWhereInput;
    orderBy?: Prisma.HeldCartOrderByWithRelationInput | Prisma.HeldCartOrderByWithRelationInput[];
    cursor?: Prisma.HeldCartWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HeldCartScalarFieldEnum | Prisma.HeldCartScalarFieldEnum[];
};
export type HeldCartFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HeldCartSelect<ExtArgs> | null;
    omit?: Prisma.HeldCartOmit<ExtArgs> | null;
    where?: Prisma.HeldCartWhereInput;
    orderBy?: Prisma.HeldCartOrderByWithRelationInput | Prisma.HeldCartOrderByWithRelationInput[];
    cursor?: Prisma.HeldCartWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HeldCartScalarFieldEnum | Prisma.HeldCartScalarFieldEnum[];
};
export type HeldCartCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HeldCartSelect<ExtArgs> | null;
    omit?: Prisma.HeldCartOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HeldCartCreateInput, Prisma.HeldCartUncheckedCreateInput>;
};
export type HeldCartCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.HeldCartCreateManyInput | Prisma.HeldCartCreateManyInput[];
    skipDuplicates?: boolean;
};
export type HeldCartCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HeldCartSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.HeldCartOmit<ExtArgs> | null;
    data: Prisma.HeldCartCreateManyInput | Prisma.HeldCartCreateManyInput[];
    skipDuplicates?: boolean;
};
export type HeldCartUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HeldCartSelect<ExtArgs> | null;
    omit?: Prisma.HeldCartOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HeldCartUpdateInput, Prisma.HeldCartUncheckedUpdateInput>;
    where: Prisma.HeldCartWhereUniqueInput;
};
export type HeldCartUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.HeldCartUpdateManyMutationInput, Prisma.HeldCartUncheckedUpdateManyInput>;
    where?: Prisma.HeldCartWhereInput;
    limit?: number;
};
export type HeldCartUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HeldCartSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.HeldCartOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HeldCartUpdateManyMutationInput, Prisma.HeldCartUncheckedUpdateManyInput>;
    where?: Prisma.HeldCartWhereInput;
    limit?: number;
};
export type HeldCartUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HeldCartSelect<ExtArgs> | null;
    omit?: Prisma.HeldCartOmit<ExtArgs> | null;
    where: Prisma.HeldCartWhereUniqueInput;
    create: Prisma.XOR<Prisma.HeldCartCreateInput, Prisma.HeldCartUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.HeldCartUpdateInput, Prisma.HeldCartUncheckedUpdateInput>;
};
export type HeldCartDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HeldCartSelect<ExtArgs> | null;
    omit?: Prisma.HeldCartOmit<ExtArgs> | null;
    where: Prisma.HeldCartWhereUniqueInput;
};
export type HeldCartDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HeldCartWhereInput;
    limit?: number;
};
export type HeldCartDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HeldCartSelect<ExtArgs> | null;
    omit?: Prisma.HeldCartOmit<ExtArgs> | null;
};
