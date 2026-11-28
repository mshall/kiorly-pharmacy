import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type DemoMarkerModel = runtime.Types.Result.DefaultSelection<Prisma.$DemoMarkerPayload>;
export type AggregateDemoMarker = {
    _count: DemoMarkerCountAggregateOutputType | null;
    _min: DemoMarkerMinAggregateOutputType | null;
    _max: DemoMarkerMaxAggregateOutputType | null;
};
export type DemoMarkerMinAggregateOutputType = {
    tableName: string | null;
    rowId: string | null;
    dataClass: string | null;
    batch: string | null;
    createdAt: Date | null;
};
export type DemoMarkerMaxAggregateOutputType = {
    tableName: string | null;
    rowId: string | null;
    dataClass: string | null;
    batch: string | null;
    createdAt: Date | null;
};
export type DemoMarkerCountAggregateOutputType = {
    tableName: number;
    rowId: number;
    dataClass: number;
    batch: number;
    createdAt: number;
    _all: number;
};
export type DemoMarkerMinAggregateInputType = {
    tableName?: true;
    rowId?: true;
    dataClass?: true;
    batch?: true;
    createdAt?: true;
};
export type DemoMarkerMaxAggregateInputType = {
    tableName?: true;
    rowId?: true;
    dataClass?: true;
    batch?: true;
    createdAt?: true;
};
export type DemoMarkerCountAggregateInputType = {
    tableName?: true;
    rowId?: true;
    dataClass?: true;
    batch?: true;
    createdAt?: true;
    _all?: true;
};
export type DemoMarkerAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DemoMarkerWhereInput;
    orderBy?: Prisma.DemoMarkerOrderByWithRelationInput | Prisma.DemoMarkerOrderByWithRelationInput[];
    cursor?: Prisma.DemoMarkerWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DemoMarkerCountAggregateInputType;
    _min?: DemoMarkerMinAggregateInputType;
    _max?: DemoMarkerMaxAggregateInputType;
};
export type GetDemoMarkerAggregateType<T extends DemoMarkerAggregateArgs> = {
    [P in keyof T & keyof AggregateDemoMarker]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDemoMarker[P]> : Prisma.GetScalarType<T[P], AggregateDemoMarker[P]>;
};
export type DemoMarkerGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DemoMarkerWhereInput;
    orderBy?: Prisma.DemoMarkerOrderByWithAggregationInput | Prisma.DemoMarkerOrderByWithAggregationInput[];
    by: Prisma.DemoMarkerScalarFieldEnum[] | Prisma.DemoMarkerScalarFieldEnum;
    having?: Prisma.DemoMarkerScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DemoMarkerCountAggregateInputType | true;
    _min?: DemoMarkerMinAggregateInputType;
    _max?: DemoMarkerMaxAggregateInputType;
};
export type DemoMarkerGroupByOutputType = {
    tableName: string;
    rowId: string;
    dataClass: string;
    batch: string;
    createdAt: Date;
    _count: DemoMarkerCountAggregateOutputType | null;
    _min: DemoMarkerMinAggregateOutputType | null;
    _max: DemoMarkerMaxAggregateOutputType | null;
};
export type GetDemoMarkerGroupByPayload<T extends DemoMarkerGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DemoMarkerGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DemoMarkerGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DemoMarkerGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DemoMarkerGroupByOutputType[P]>;
}>>;
export type DemoMarkerWhereInput = {
    AND?: Prisma.DemoMarkerWhereInput | Prisma.DemoMarkerWhereInput[];
    OR?: Prisma.DemoMarkerWhereInput[];
    NOT?: Prisma.DemoMarkerWhereInput | Prisma.DemoMarkerWhereInput[];
    tableName?: Prisma.StringFilter<"DemoMarker"> | string;
    rowId?: Prisma.StringFilter<"DemoMarker"> | string;
    dataClass?: Prisma.StringFilter<"DemoMarker"> | string;
    batch?: Prisma.StringFilter<"DemoMarker"> | string;
    createdAt?: Prisma.DateTimeFilter<"DemoMarker"> | Date | string;
};
export type DemoMarkerOrderByWithRelationInput = {
    tableName?: Prisma.SortOrder;
    rowId?: Prisma.SortOrder;
    dataClass?: Prisma.SortOrder;
    batch?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DemoMarkerWhereUniqueInput = Prisma.AtLeast<{
    tableName_rowId?: Prisma.DemoMarkerTableNameRowIdCompoundUniqueInput;
    AND?: Prisma.DemoMarkerWhereInput | Prisma.DemoMarkerWhereInput[];
    OR?: Prisma.DemoMarkerWhereInput[];
    NOT?: Prisma.DemoMarkerWhereInput | Prisma.DemoMarkerWhereInput[];
    tableName?: Prisma.StringFilter<"DemoMarker"> | string;
    rowId?: Prisma.StringFilter<"DemoMarker"> | string;
    dataClass?: Prisma.StringFilter<"DemoMarker"> | string;
    batch?: Prisma.StringFilter<"DemoMarker"> | string;
    createdAt?: Prisma.DateTimeFilter<"DemoMarker"> | Date | string;
}, "tableName_rowId">;
export type DemoMarkerOrderByWithAggregationInput = {
    tableName?: Prisma.SortOrder;
    rowId?: Prisma.SortOrder;
    dataClass?: Prisma.SortOrder;
    batch?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.DemoMarkerCountOrderByAggregateInput;
    _max?: Prisma.DemoMarkerMaxOrderByAggregateInput;
    _min?: Prisma.DemoMarkerMinOrderByAggregateInput;
};
export type DemoMarkerScalarWhereWithAggregatesInput = {
    AND?: Prisma.DemoMarkerScalarWhereWithAggregatesInput | Prisma.DemoMarkerScalarWhereWithAggregatesInput[];
    OR?: Prisma.DemoMarkerScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DemoMarkerScalarWhereWithAggregatesInput | Prisma.DemoMarkerScalarWhereWithAggregatesInput[];
    tableName?: Prisma.StringWithAggregatesFilter<"DemoMarker"> | string;
    rowId?: Prisma.StringWithAggregatesFilter<"DemoMarker"> | string;
    dataClass?: Prisma.StringWithAggregatesFilter<"DemoMarker"> | string;
    batch?: Prisma.StringWithAggregatesFilter<"DemoMarker"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"DemoMarker"> | Date | string;
};
export type DemoMarkerCreateInput = {
    tableName: string;
    rowId: string;
    dataClass?: string;
    batch?: string;
    createdAt?: Date | string;
};
export type DemoMarkerUncheckedCreateInput = {
    tableName: string;
    rowId: string;
    dataClass?: string;
    batch?: string;
    createdAt?: Date | string;
};
export type DemoMarkerUpdateInput = {
    tableName?: Prisma.StringFieldUpdateOperationsInput | string;
    rowId?: Prisma.StringFieldUpdateOperationsInput | string;
    dataClass?: Prisma.StringFieldUpdateOperationsInput | string;
    batch?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DemoMarkerUncheckedUpdateInput = {
    tableName?: Prisma.StringFieldUpdateOperationsInput | string;
    rowId?: Prisma.StringFieldUpdateOperationsInput | string;
    dataClass?: Prisma.StringFieldUpdateOperationsInput | string;
    batch?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DemoMarkerCreateManyInput = {
    tableName: string;
    rowId: string;
    dataClass?: string;
    batch?: string;
    createdAt?: Date | string;
};
export type DemoMarkerUpdateManyMutationInput = {
    tableName?: Prisma.StringFieldUpdateOperationsInput | string;
    rowId?: Prisma.StringFieldUpdateOperationsInput | string;
    dataClass?: Prisma.StringFieldUpdateOperationsInput | string;
    batch?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DemoMarkerUncheckedUpdateManyInput = {
    tableName?: Prisma.StringFieldUpdateOperationsInput | string;
    rowId?: Prisma.StringFieldUpdateOperationsInput | string;
    dataClass?: Prisma.StringFieldUpdateOperationsInput | string;
    batch?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DemoMarkerTableNameRowIdCompoundUniqueInput = {
    tableName: string;
    rowId: string;
};
export type DemoMarkerCountOrderByAggregateInput = {
    tableName?: Prisma.SortOrder;
    rowId?: Prisma.SortOrder;
    dataClass?: Prisma.SortOrder;
    batch?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DemoMarkerMaxOrderByAggregateInput = {
    tableName?: Prisma.SortOrder;
    rowId?: Prisma.SortOrder;
    dataClass?: Prisma.SortOrder;
    batch?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DemoMarkerMinOrderByAggregateInput = {
    tableName?: Prisma.SortOrder;
    rowId?: Prisma.SortOrder;
    dataClass?: Prisma.SortOrder;
    batch?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DemoMarkerSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    tableName?: boolean;
    rowId?: boolean;
    dataClass?: boolean;
    batch?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["demoMarker"]>;
export type DemoMarkerSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    tableName?: boolean;
    rowId?: boolean;
    dataClass?: boolean;
    batch?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["demoMarker"]>;
export type DemoMarkerSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    tableName?: boolean;
    rowId?: boolean;
    dataClass?: boolean;
    batch?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["demoMarker"]>;
export type DemoMarkerSelectScalar = {
    tableName?: boolean;
    rowId?: boolean;
    dataClass?: boolean;
    batch?: boolean;
    createdAt?: boolean;
};
export type DemoMarkerOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"tableName" | "rowId" | "dataClass" | "batch" | "createdAt", ExtArgs["result"]["demoMarker"]>;
export type $DemoMarkerPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DemoMarker";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        tableName: string;
        rowId: string;
        dataClass: string;
        batch: string;
        createdAt: Date;
    }, ExtArgs["result"]["demoMarker"]>;
    composites: {};
};
export type DemoMarkerGetPayload<S extends boolean | null | undefined | DemoMarkerDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DemoMarkerPayload, S>;
export type DemoMarkerCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DemoMarkerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DemoMarkerCountAggregateInputType | true;
};
export interface DemoMarkerDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DemoMarker'];
        meta: {
            name: 'DemoMarker';
        };
    };
    findUnique<T extends DemoMarkerFindUniqueArgs>(args: Prisma.SelectSubset<T, DemoMarkerFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DemoMarkerClient<runtime.Types.Result.GetResult<Prisma.$DemoMarkerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DemoMarkerFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DemoMarkerFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DemoMarkerClient<runtime.Types.Result.GetResult<Prisma.$DemoMarkerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DemoMarkerFindFirstArgs>(args?: Prisma.SelectSubset<T, DemoMarkerFindFirstArgs<ExtArgs>>): Prisma.Prisma__DemoMarkerClient<runtime.Types.Result.GetResult<Prisma.$DemoMarkerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DemoMarkerFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DemoMarkerFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DemoMarkerClient<runtime.Types.Result.GetResult<Prisma.$DemoMarkerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DemoMarkerFindManyArgs>(args?: Prisma.SelectSubset<T, DemoMarkerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DemoMarkerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DemoMarkerCreateArgs>(args: Prisma.SelectSubset<T, DemoMarkerCreateArgs<ExtArgs>>): Prisma.Prisma__DemoMarkerClient<runtime.Types.Result.GetResult<Prisma.$DemoMarkerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DemoMarkerCreateManyArgs>(args?: Prisma.SelectSubset<T, DemoMarkerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DemoMarkerCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DemoMarkerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DemoMarkerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DemoMarkerDeleteArgs>(args: Prisma.SelectSubset<T, DemoMarkerDeleteArgs<ExtArgs>>): Prisma.Prisma__DemoMarkerClient<runtime.Types.Result.GetResult<Prisma.$DemoMarkerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DemoMarkerUpdateArgs>(args: Prisma.SelectSubset<T, DemoMarkerUpdateArgs<ExtArgs>>): Prisma.Prisma__DemoMarkerClient<runtime.Types.Result.GetResult<Prisma.$DemoMarkerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DemoMarkerDeleteManyArgs>(args?: Prisma.SelectSubset<T, DemoMarkerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DemoMarkerUpdateManyArgs>(args: Prisma.SelectSubset<T, DemoMarkerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DemoMarkerUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DemoMarkerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DemoMarkerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DemoMarkerUpsertArgs>(args: Prisma.SelectSubset<T, DemoMarkerUpsertArgs<ExtArgs>>): Prisma.Prisma__DemoMarkerClient<runtime.Types.Result.GetResult<Prisma.$DemoMarkerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DemoMarkerCountArgs>(args?: Prisma.Subset<T, DemoMarkerCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DemoMarkerCountAggregateOutputType> : number>;
    aggregate<T extends DemoMarkerAggregateArgs>(args: Prisma.Subset<T, DemoMarkerAggregateArgs>): Prisma.PrismaPromise<GetDemoMarkerAggregateType<T>>;
    groupBy<T extends DemoMarkerGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DemoMarkerGroupByArgs['orderBy'];
    } : {
        orderBy?: DemoMarkerGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DemoMarkerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDemoMarkerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DemoMarkerFieldRefs;
}
export interface Prisma__DemoMarkerClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DemoMarkerFieldRefs {
    readonly tableName: Prisma.FieldRef<"DemoMarker", 'String'>;
    readonly rowId: Prisma.FieldRef<"DemoMarker", 'String'>;
    readonly dataClass: Prisma.FieldRef<"DemoMarker", 'String'>;
    readonly batch: Prisma.FieldRef<"DemoMarker", 'String'>;
    readonly createdAt: Prisma.FieldRef<"DemoMarker", 'DateTime'>;
}
export type DemoMarkerFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DemoMarkerSelect<ExtArgs> | null;
    omit?: Prisma.DemoMarkerOmit<ExtArgs> | null;
    where: Prisma.DemoMarkerWhereUniqueInput;
};
export type DemoMarkerFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DemoMarkerSelect<ExtArgs> | null;
    omit?: Prisma.DemoMarkerOmit<ExtArgs> | null;
    where: Prisma.DemoMarkerWhereUniqueInput;
};
export type DemoMarkerFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DemoMarkerSelect<ExtArgs> | null;
    omit?: Prisma.DemoMarkerOmit<ExtArgs> | null;
    where?: Prisma.DemoMarkerWhereInput;
    orderBy?: Prisma.DemoMarkerOrderByWithRelationInput | Prisma.DemoMarkerOrderByWithRelationInput[];
    cursor?: Prisma.DemoMarkerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DemoMarkerScalarFieldEnum | Prisma.DemoMarkerScalarFieldEnum[];
};
export type DemoMarkerFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DemoMarkerSelect<ExtArgs> | null;
    omit?: Prisma.DemoMarkerOmit<ExtArgs> | null;
    where?: Prisma.DemoMarkerWhereInput;
    orderBy?: Prisma.DemoMarkerOrderByWithRelationInput | Prisma.DemoMarkerOrderByWithRelationInput[];
    cursor?: Prisma.DemoMarkerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DemoMarkerScalarFieldEnum | Prisma.DemoMarkerScalarFieldEnum[];
};
export type DemoMarkerFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DemoMarkerSelect<ExtArgs> | null;
    omit?: Prisma.DemoMarkerOmit<ExtArgs> | null;
    where?: Prisma.DemoMarkerWhereInput;
    orderBy?: Prisma.DemoMarkerOrderByWithRelationInput | Prisma.DemoMarkerOrderByWithRelationInput[];
    cursor?: Prisma.DemoMarkerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DemoMarkerScalarFieldEnum | Prisma.DemoMarkerScalarFieldEnum[];
};
export type DemoMarkerCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DemoMarkerSelect<ExtArgs> | null;
    omit?: Prisma.DemoMarkerOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DemoMarkerCreateInput, Prisma.DemoMarkerUncheckedCreateInput>;
};
export type DemoMarkerCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DemoMarkerCreateManyInput | Prisma.DemoMarkerCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DemoMarkerCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DemoMarkerSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DemoMarkerOmit<ExtArgs> | null;
    data: Prisma.DemoMarkerCreateManyInput | Prisma.DemoMarkerCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DemoMarkerUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DemoMarkerSelect<ExtArgs> | null;
    omit?: Prisma.DemoMarkerOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DemoMarkerUpdateInput, Prisma.DemoMarkerUncheckedUpdateInput>;
    where: Prisma.DemoMarkerWhereUniqueInput;
};
export type DemoMarkerUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DemoMarkerUpdateManyMutationInput, Prisma.DemoMarkerUncheckedUpdateManyInput>;
    where?: Prisma.DemoMarkerWhereInput;
    limit?: number;
};
export type DemoMarkerUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DemoMarkerSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DemoMarkerOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DemoMarkerUpdateManyMutationInput, Prisma.DemoMarkerUncheckedUpdateManyInput>;
    where?: Prisma.DemoMarkerWhereInput;
    limit?: number;
};
export type DemoMarkerUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DemoMarkerSelect<ExtArgs> | null;
    omit?: Prisma.DemoMarkerOmit<ExtArgs> | null;
    where: Prisma.DemoMarkerWhereUniqueInput;
    create: Prisma.XOR<Prisma.DemoMarkerCreateInput, Prisma.DemoMarkerUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DemoMarkerUpdateInput, Prisma.DemoMarkerUncheckedUpdateInput>;
};
export type DemoMarkerDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DemoMarkerSelect<ExtArgs> | null;
    omit?: Prisma.DemoMarkerOmit<ExtArgs> | null;
    where: Prisma.DemoMarkerWhereUniqueInput;
};
export type DemoMarkerDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DemoMarkerWhereInput;
    limit?: number;
};
export type DemoMarkerDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DemoMarkerSelect<ExtArgs> | null;
    omit?: Prisma.DemoMarkerOmit<ExtArgs> | null;
};
