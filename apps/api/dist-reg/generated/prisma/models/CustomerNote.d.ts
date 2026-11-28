import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type CustomerNoteModel = runtime.Types.Result.DefaultSelection<Prisma.$CustomerNotePayload>;
export type AggregateCustomerNote = {
    _count: CustomerNoteCountAggregateOutputType | null;
    _min: CustomerNoteMinAggregateOutputType | null;
    _max: CustomerNoteMaxAggregateOutputType | null;
};
export type CustomerNoteMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    patientId: string | null;
    kind: string | null;
    body: string | null;
    refType: string | null;
    refId: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type CustomerNoteMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    patientId: string | null;
    kind: string | null;
    body: string | null;
    refType: string | null;
    refId: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type CustomerNoteCountAggregateOutputType = {
    id: number;
    orgId: number;
    patientId: number;
    kind: number;
    body: number;
    refType: number;
    refId: number;
    createdBy: number;
    createdAt: number;
    _all: number;
};
export type CustomerNoteMinAggregateInputType = {
    id?: true;
    orgId?: true;
    patientId?: true;
    kind?: true;
    body?: true;
    refType?: true;
    refId?: true;
    createdBy?: true;
    createdAt?: true;
};
export type CustomerNoteMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    patientId?: true;
    kind?: true;
    body?: true;
    refType?: true;
    refId?: true;
    createdBy?: true;
    createdAt?: true;
};
export type CustomerNoteCountAggregateInputType = {
    id?: true;
    orgId?: true;
    patientId?: true;
    kind?: true;
    body?: true;
    refType?: true;
    refId?: true;
    createdBy?: true;
    createdAt?: true;
    _all?: true;
};
export type CustomerNoteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerNoteWhereInput;
    orderBy?: Prisma.CustomerNoteOrderByWithRelationInput | Prisma.CustomerNoteOrderByWithRelationInput[];
    cursor?: Prisma.CustomerNoteWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CustomerNoteCountAggregateInputType;
    _min?: CustomerNoteMinAggregateInputType;
    _max?: CustomerNoteMaxAggregateInputType;
};
export type GetCustomerNoteAggregateType<T extends CustomerNoteAggregateArgs> = {
    [P in keyof T & keyof AggregateCustomerNote]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCustomerNote[P]> : Prisma.GetScalarType<T[P], AggregateCustomerNote[P]>;
};
export type CustomerNoteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerNoteWhereInput;
    orderBy?: Prisma.CustomerNoteOrderByWithAggregationInput | Prisma.CustomerNoteOrderByWithAggregationInput[];
    by: Prisma.CustomerNoteScalarFieldEnum[] | Prisma.CustomerNoteScalarFieldEnum;
    having?: Prisma.CustomerNoteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CustomerNoteCountAggregateInputType | true;
    _min?: CustomerNoteMinAggregateInputType;
    _max?: CustomerNoteMaxAggregateInputType;
};
export type CustomerNoteGroupByOutputType = {
    id: string;
    orgId: string;
    patientId: string;
    kind: string;
    body: string;
    refType: string | null;
    refId: string | null;
    createdBy: string;
    createdAt: Date;
    _count: CustomerNoteCountAggregateOutputType | null;
    _min: CustomerNoteMinAggregateOutputType | null;
    _max: CustomerNoteMaxAggregateOutputType | null;
};
export type GetCustomerNoteGroupByPayload<T extends CustomerNoteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CustomerNoteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CustomerNoteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CustomerNoteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CustomerNoteGroupByOutputType[P]>;
}>>;
export type CustomerNoteWhereInput = {
    AND?: Prisma.CustomerNoteWhereInput | Prisma.CustomerNoteWhereInput[];
    OR?: Prisma.CustomerNoteWhereInput[];
    NOT?: Prisma.CustomerNoteWhereInput | Prisma.CustomerNoteWhereInput[];
    id?: Prisma.StringFilter<"CustomerNote"> | string;
    orgId?: Prisma.StringFilter<"CustomerNote"> | string;
    patientId?: Prisma.StringFilter<"CustomerNote"> | string;
    kind?: Prisma.StringFilter<"CustomerNote"> | string;
    body?: Prisma.StringFilter<"CustomerNote"> | string;
    refType?: Prisma.StringNullableFilter<"CustomerNote"> | string | null;
    refId?: Prisma.StringNullableFilter<"CustomerNote"> | string | null;
    createdBy?: Prisma.StringFilter<"CustomerNote"> | string;
    createdAt?: Prisma.DateTimeFilter<"CustomerNote"> | Date | string;
};
export type CustomerNoteOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    refType?: Prisma.SortOrderInput | Prisma.SortOrder;
    refId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CustomerNoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.CustomerNoteWhereInput | Prisma.CustomerNoteWhereInput[];
    OR?: Prisma.CustomerNoteWhereInput[];
    NOT?: Prisma.CustomerNoteWhereInput | Prisma.CustomerNoteWhereInput[];
    orgId?: Prisma.StringFilter<"CustomerNote"> | string;
    patientId?: Prisma.StringFilter<"CustomerNote"> | string;
    kind?: Prisma.StringFilter<"CustomerNote"> | string;
    body?: Prisma.StringFilter<"CustomerNote"> | string;
    refType?: Prisma.StringNullableFilter<"CustomerNote"> | string | null;
    refId?: Prisma.StringNullableFilter<"CustomerNote"> | string | null;
    createdBy?: Prisma.StringFilter<"CustomerNote"> | string;
    createdAt?: Prisma.DateTimeFilter<"CustomerNote"> | Date | string;
}, "id">;
export type CustomerNoteOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    refType?: Prisma.SortOrderInput | Prisma.SortOrder;
    refId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.CustomerNoteCountOrderByAggregateInput;
    _max?: Prisma.CustomerNoteMaxOrderByAggregateInput;
    _min?: Prisma.CustomerNoteMinOrderByAggregateInput;
};
export type CustomerNoteScalarWhereWithAggregatesInput = {
    AND?: Prisma.CustomerNoteScalarWhereWithAggregatesInput | Prisma.CustomerNoteScalarWhereWithAggregatesInput[];
    OR?: Prisma.CustomerNoteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CustomerNoteScalarWhereWithAggregatesInput | Prisma.CustomerNoteScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"CustomerNote"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"CustomerNote"> | string;
    patientId?: Prisma.StringWithAggregatesFilter<"CustomerNote"> | string;
    kind?: Prisma.StringWithAggregatesFilter<"CustomerNote"> | string;
    body?: Prisma.StringWithAggregatesFilter<"CustomerNote"> | string;
    refType?: Prisma.StringNullableWithAggregatesFilter<"CustomerNote"> | string | null;
    refId?: Prisma.StringNullableWithAggregatesFilter<"CustomerNote"> | string | null;
    createdBy?: Prisma.StringWithAggregatesFilter<"CustomerNote"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"CustomerNote"> | Date | string;
};
export type CustomerNoteCreateInput = {
    id?: string;
    orgId: string;
    patientId: string;
    kind?: string;
    body: string;
    refType?: string | null;
    refId?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type CustomerNoteUncheckedCreateInput = {
    id?: string;
    orgId: string;
    patientId: string;
    kind?: string;
    body: string;
    refType?: string | null;
    refId?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type CustomerNoteUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerNoteUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerNoteCreateManyInput = {
    id?: string;
    orgId: string;
    patientId: string;
    kind?: string;
    body: string;
    refType?: string | null;
    refId?: string | null;
    createdBy: string;
    createdAt?: Date | string;
};
export type CustomerNoteUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerNoteUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    refType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerNoteCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CustomerNoteMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CustomerNoteMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    refType?: Prisma.SortOrder;
    refId?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CustomerNoteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    kind?: boolean;
    body?: boolean;
    refType?: boolean;
    refId?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["customerNote"]>;
export type CustomerNoteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    kind?: boolean;
    body?: boolean;
    refType?: boolean;
    refId?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["customerNote"]>;
export type CustomerNoteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    kind?: boolean;
    body?: boolean;
    refType?: boolean;
    refId?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["customerNote"]>;
export type CustomerNoteSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    kind?: boolean;
    body?: boolean;
    refType?: boolean;
    refId?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
};
export type CustomerNoteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "patientId" | "kind" | "body" | "refType" | "refId" | "createdBy" | "createdAt", ExtArgs["result"]["customerNote"]>;
export type $CustomerNotePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CustomerNote";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        patientId: string;
        kind: string;
        body: string;
        refType: string | null;
        refId: string | null;
        createdBy: string;
        createdAt: Date;
    }, ExtArgs["result"]["customerNote"]>;
    composites: {};
};
export type CustomerNoteGetPayload<S extends boolean | null | undefined | CustomerNoteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CustomerNotePayload, S>;
export type CustomerNoteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CustomerNoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CustomerNoteCountAggregateInputType | true;
};
export interface CustomerNoteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CustomerNote'];
        meta: {
            name: 'CustomerNote';
        };
    };
    findUnique<T extends CustomerNoteFindUniqueArgs>(args: Prisma.SelectSubset<T, CustomerNoteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CustomerNoteClient<runtime.Types.Result.GetResult<Prisma.$CustomerNotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CustomerNoteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CustomerNoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CustomerNoteClient<runtime.Types.Result.GetResult<Prisma.$CustomerNotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CustomerNoteFindFirstArgs>(args?: Prisma.SelectSubset<T, CustomerNoteFindFirstArgs<ExtArgs>>): Prisma.Prisma__CustomerNoteClient<runtime.Types.Result.GetResult<Prisma.$CustomerNotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CustomerNoteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CustomerNoteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CustomerNoteClient<runtime.Types.Result.GetResult<Prisma.$CustomerNotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CustomerNoteFindManyArgs>(args?: Prisma.SelectSubset<T, CustomerNoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerNotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CustomerNoteCreateArgs>(args: Prisma.SelectSubset<T, CustomerNoteCreateArgs<ExtArgs>>): Prisma.Prisma__CustomerNoteClient<runtime.Types.Result.GetResult<Prisma.$CustomerNotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CustomerNoteCreateManyArgs>(args?: Prisma.SelectSubset<T, CustomerNoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CustomerNoteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CustomerNoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerNotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CustomerNoteDeleteArgs>(args: Prisma.SelectSubset<T, CustomerNoteDeleteArgs<ExtArgs>>): Prisma.Prisma__CustomerNoteClient<runtime.Types.Result.GetResult<Prisma.$CustomerNotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CustomerNoteUpdateArgs>(args: Prisma.SelectSubset<T, CustomerNoteUpdateArgs<ExtArgs>>): Prisma.Prisma__CustomerNoteClient<runtime.Types.Result.GetResult<Prisma.$CustomerNotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CustomerNoteDeleteManyArgs>(args?: Prisma.SelectSubset<T, CustomerNoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CustomerNoteUpdateManyArgs>(args: Prisma.SelectSubset<T, CustomerNoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CustomerNoteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CustomerNoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerNotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CustomerNoteUpsertArgs>(args: Prisma.SelectSubset<T, CustomerNoteUpsertArgs<ExtArgs>>): Prisma.Prisma__CustomerNoteClient<runtime.Types.Result.GetResult<Prisma.$CustomerNotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CustomerNoteCountArgs>(args?: Prisma.Subset<T, CustomerNoteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CustomerNoteCountAggregateOutputType> : number>;
    aggregate<T extends CustomerNoteAggregateArgs>(args: Prisma.Subset<T, CustomerNoteAggregateArgs>): Prisma.PrismaPromise<GetCustomerNoteAggregateType<T>>;
    groupBy<T extends CustomerNoteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CustomerNoteGroupByArgs['orderBy'];
    } : {
        orderBy?: CustomerNoteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CustomerNoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerNoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CustomerNoteFieldRefs;
}
export interface Prisma__CustomerNoteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CustomerNoteFieldRefs {
    readonly id: Prisma.FieldRef<"CustomerNote", 'String'>;
    readonly orgId: Prisma.FieldRef<"CustomerNote", 'String'>;
    readonly patientId: Prisma.FieldRef<"CustomerNote", 'String'>;
    readonly kind: Prisma.FieldRef<"CustomerNote", 'String'>;
    readonly body: Prisma.FieldRef<"CustomerNote", 'String'>;
    readonly refType: Prisma.FieldRef<"CustomerNote", 'String'>;
    readonly refId: Prisma.FieldRef<"CustomerNote", 'String'>;
    readonly createdBy: Prisma.FieldRef<"CustomerNote", 'String'>;
    readonly createdAt: Prisma.FieldRef<"CustomerNote", 'DateTime'>;
}
export type CustomerNoteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerNoteSelect<ExtArgs> | null;
    omit?: Prisma.CustomerNoteOmit<ExtArgs> | null;
    where: Prisma.CustomerNoteWhereUniqueInput;
};
export type CustomerNoteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerNoteSelect<ExtArgs> | null;
    omit?: Prisma.CustomerNoteOmit<ExtArgs> | null;
    where: Prisma.CustomerNoteWhereUniqueInput;
};
export type CustomerNoteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerNoteSelect<ExtArgs> | null;
    omit?: Prisma.CustomerNoteOmit<ExtArgs> | null;
    where?: Prisma.CustomerNoteWhereInput;
    orderBy?: Prisma.CustomerNoteOrderByWithRelationInput | Prisma.CustomerNoteOrderByWithRelationInput[];
    cursor?: Prisma.CustomerNoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerNoteScalarFieldEnum | Prisma.CustomerNoteScalarFieldEnum[];
};
export type CustomerNoteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerNoteSelect<ExtArgs> | null;
    omit?: Prisma.CustomerNoteOmit<ExtArgs> | null;
    where?: Prisma.CustomerNoteWhereInput;
    orderBy?: Prisma.CustomerNoteOrderByWithRelationInput | Prisma.CustomerNoteOrderByWithRelationInput[];
    cursor?: Prisma.CustomerNoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerNoteScalarFieldEnum | Prisma.CustomerNoteScalarFieldEnum[];
};
export type CustomerNoteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerNoteSelect<ExtArgs> | null;
    omit?: Prisma.CustomerNoteOmit<ExtArgs> | null;
    where?: Prisma.CustomerNoteWhereInput;
    orderBy?: Prisma.CustomerNoteOrderByWithRelationInput | Prisma.CustomerNoteOrderByWithRelationInput[];
    cursor?: Prisma.CustomerNoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerNoteScalarFieldEnum | Prisma.CustomerNoteScalarFieldEnum[];
};
export type CustomerNoteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerNoteSelect<ExtArgs> | null;
    omit?: Prisma.CustomerNoteOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CustomerNoteCreateInput, Prisma.CustomerNoteUncheckedCreateInput>;
};
export type CustomerNoteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CustomerNoteCreateManyInput | Prisma.CustomerNoteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CustomerNoteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerNoteSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CustomerNoteOmit<ExtArgs> | null;
    data: Prisma.CustomerNoteCreateManyInput | Prisma.CustomerNoteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CustomerNoteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerNoteSelect<ExtArgs> | null;
    omit?: Prisma.CustomerNoteOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CustomerNoteUpdateInput, Prisma.CustomerNoteUncheckedUpdateInput>;
    where: Prisma.CustomerNoteWhereUniqueInput;
};
export type CustomerNoteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CustomerNoteUpdateManyMutationInput, Prisma.CustomerNoteUncheckedUpdateManyInput>;
    where?: Prisma.CustomerNoteWhereInput;
    limit?: number;
};
export type CustomerNoteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerNoteSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CustomerNoteOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CustomerNoteUpdateManyMutationInput, Prisma.CustomerNoteUncheckedUpdateManyInput>;
    where?: Prisma.CustomerNoteWhereInput;
    limit?: number;
};
export type CustomerNoteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerNoteSelect<ExtArgs> | null;
    omit?: Prisma.CustomerNoteOmit<ExtArgs> | null;
    where: Prisma.CustomerNoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.CustomerNoteCreateInput, Prisma.CustomerNoteUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CustomerNoteUpdateInput, Prisma.CustomerNoteUncheckedUpdateInput>;
};
export type CustomerNoteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerNoteSelect<ExtArgs> | null;
    omit?: Prisma.CustomerNoteOmit<ExtArgs> | null;
    where: Prisma.CustomerNoteWhereUniqueInput;
};
export type CustomerNoteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerNoteWhereInput;
    limit?: number;
};
export type CustomerNoteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerNoteSelect<ExtArgs> | null;
    omit?: Prisma.CustomerNoteOmit<ExtArgs> | null;
};
