import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type SubstitutionGroupModel = runtime.Types.Result.DefaultSelection<Prisma.$SubstitutionGroupPayload>;
export type AggregateSubstitutionGroup = {
    _count: SubstitutionGroupCountAggregateOutputType | null;
    _min: SubstitutionGroupMinAggregateOutputType | null;
    _max: SubstitutionGroupMaxAggregateOutputType | null;
};
export type SubstitutionGroupMinAggregateOutputType = {
    id: string | null;
    activeIngredient: string | null;
    strength: string | null;
    dosageForm: string | null;
};
export type SubstitutionGroupMaxAggregateOutputType = {
    id: string | null;
    activeIngredient: string | null;
    strength: string | null;
    dosageForm: string | null;
};
export type SubstitutionGroupCountAggregateOutputType = {
    id: number;
    activeIngredient: number;
    strength: number;
    dosageForm: number;
    _all: number;
};
export type SubstitutionGroupMinAggregateInputType = {
    id?: true;
    activeIngredient?: true;
    strength?: true;
    dosageForm?: true;
};
export type SubstitutionGroupMaxAggregateInputType = {
    id?: true;
    activeIngredient?: true;
    strength?: true;
    dosageForm?: true;
};
export type SubstitutionGroupCountAggregateInputType = {
    id?: true;
    activeIngredient?: true;
    strength?: true;
    dosageForm?: true;
    _all?: true;
};
export type SubstitutionGroupAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubstitutionGroupWhereInput;
    orderBy?: Prisma.SubstitutionGroupOrderByWithRelationInput | Prisma.SubstitutionGroupOrderByWithRelationInput[];
    cursor?: Prisma.SubstitutionGroupWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SubstitutionGroupCountAggregateInputType;
    _min?: SubstitutionGroupMinAggregateInputType;
    _max?: SubstitutionGroupMaxAggregateInputType;
};
export type GetSubstitutionGroupAggregateType<T extends SubstitutionGroupAggregateArgs> = {
    [P in keyof T & keyof AggregateSubstitutionGroup]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSubstitutionGroup[P]> : Prisma.GetScalarType<T[P], AggregateSubstitutionGroup[P]>;
};
export type SubstitutionGroupGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubstitutionGroupWhereInput;
    orderBy?: Prisma.SubstitutionGroupOrderByWithAggregationInput | Prisma.SubstitutionGroupOrderByWithAggregationInput[];
    by: Prisma.SubstitutionGroupScalarFieldEnum[] | Prisma.SubstitutionGroupScalarFieldEnum;
    having?: Prisma.SubstitutionGroupScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SubstitutionGroupCountAggregateInputType | true;
    _min?: SubstitutionGroupMinAggregateInputType;
    _max?: SubstitutionGroupMaxAggregateInputType;
};
export type SubstitutionGroupGroupByOutputType = {
    id: string;
    activeIngredient: string;
    strength: string;
    dosageForm: string;
    _count: SubstitutionGroupCountAggregateOutputType | null;
    _min: SubstitutionGroupMinAggregateOutputType | null;
    _max: SubstitutionGroupMaxAggregateOutputType | null;
};
export type GetSubstitutionGroupGroupByPayload<T extends SubstitutionGroupGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SubstitutionGroupGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SubstitutionGroupGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SubstitutionGroupGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SubstitutionGroupGroupByOutputType[P]>;
}>>;
export type SubstitutionGroupWhereInput = {
    AND?: Prisma.SubstitutionGroupWhereInput | Prisma.SubstitutionGroupWhereInput[];
    OR?: Prisma.SubstitutionGroupWhereInput[];
    NOT?: Prisma.SubstitutionGroupWhereInput | Prisma.SubstitutionGroupWhereInput[];
    id?: Prisma.StringFilter<"SubstitutionGroup"> | string;
    activeIngredient?: Prisma.StringFilter<"SubstitutionGroup"> | string;
    strength?: Prisma.StringFilter<"SubstitutionGroup"> | string;
    dosageForm?: Prisma.StringFilter<"SubstitutionGroup"> | string;
    drugs?: Prisma.DrugListRelationFilter;
};
export type SubstitutionGroupOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    activeIngredient?: Prisma.SortOrder;
    strength?: Prisma.SortOrder;
    dosageForm?: Prisma.SortOrder;
    drugs?: Prisma.DrugOrderByRelationAggregateInput;
};
export type SubstitutionGroupWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    activeIngredient_strength_dosageForm?: Prisma.SubstitutionGroupActiveIngredientStrengthDosageFormCompoundUniqueInput;
    AND?: Prisma.SubstitutionGroupWhereInput | Prisma.SubstitutionGroupWhereInput[];
    OR?: Prisma.SubstitutionGroupWhereInput[];
    NOT?: Prisma.SubstitutionGroupWhereInput | Prisma.SubstitutionGroupWhereInput[];
    activeIngredient?: Prisma.StringFilter<"SubstitutionGroup"> | string;
    strength?: Prisma.StringFilter<"SubstitutionGroup"> | string;
    dosageForm?: Prisma.StringFilter<"SubstitutionGroup"> | string;
    drugs?: Prisma.DrugListRelationFilter;
}, "id" | "activeIngredient_strength_dosageForm">;
export type SubstitutionGroupOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    activeIngredient?: Prisma.SortOrder;
    strength?: Prisma.SortOrder;
    dosageForm?: Prisma.SortOrder;
    _count?: Prisma.SubstitutionGroupCountOrderByAggregateInput;
    _max?: Prisma.SubstitutionGroupMaxOrderByAggregateInput;
    _min?: Prisma.SubstitutionGroupMinOrderByAggregateInput;
};
export type SubstitutionGroupScalarWhereWithAggregatesInput = {
    AND?: Prisma.SubstitutionGroupScalarWhereWithAggregatesInput | Prisma.SubstitutionGroupScalarWhereWithAggregatesInput[];
    OR?: Prisma.SubstitutionGroupScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SubstitutionGroupScalarWhereWithAggregatesInput | Prisma.SubstitutionGroupScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SubstitutionGroup"> | string;
    activeIngredient?: Prisma.StringWithAggregatesFilter<"SubstitutionGroup"> | string;
    strength?: Prisma.StringWithAggregatesFilter<"SubstitutionGroup"> | string;
    dosageForm?: Prisma.StringWithAggregatesFilter<"SubstitutionGroup"> | string;
};
export type SubstitutionGroupCreateInput = {
    id?: string;
    activeIngredient: string;
    strength: string;
    dosageForm: string;
    drugs?: Prisma.DrugCreateNestedManyWithoutSubstitutionGroupInput;
};
export type SubstitutionGroupUncheckedCreateInput = {
    id?: string;
    activeIngredient: string;
    strength: string;
    dosageForm: string;
    drugs?: Prisma.DrugUncheckedCreateNestedManyWithoutSubstitutionGroupInput;
};
export type SubstitutionGroupUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    activeIngredient?: Prisma.StringFieldUpdateOperationsInput | string;
    strength?: Prisma.StringFieldUpdateOperationsInput | string;
    dosageForm?: Prisma.StringFieldUpdateOperationsInput | string;
    drugs?: Prisma.DrugUpdateManyWithoutSubstitutionGroupNestedInput;
};
export type SubstitutionGroupUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    activeIngredient?: Prisma.StringFieldUpdateOperationsInput | string;
    strength?: Prisma.StringFieldUpdateOperationsInput | string;
    dosageForm?: Prisma.StringFieldUpdateOperationsInput | string;
    drugs?: Prisma.DrugUncheckedUpdateManyWithoutSubstitutionGroupNestedInput;
};
export type SubstitutionGroupCreateManyInput = {
    id?: string;
    activeIngredient: string;
    strength: string;
    dosageForm: string;
};
export type SubstitutionGroupUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    activeIngredient?: Prisma.StringFieldUpdateOperationsInput | string;
    strength?: Prisma.StringFieldUpdateOperationsInput | string;
    dosageForm?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SubstitutionGroupUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    activeIngredient?: Prisma.StringFieldUpdateOperationsInput | string;
    strength?: Prisma.StringFieldUpdateOperationsInput | string;
    dosageForm?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SubstitutionGroupNullableScalarRelationFilter = {
    is?: Prisma.SubstitutionGroupWhereInput | null;
    isNot?: Prisma.SubstitutionGroupWhereInput | null;
};
export type SubstitutionGroupActiveIngredientStrengthDosageFormCompoundUniqueInput = {
    activeIngredient: string;
    strength: string;
    dosageForm: string;
};
export type SubstitutionGroupCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    activeIngredient?: Prisma.SortOrder;
    strength?: Prisma.SortOrder;
    dosageForm?: Prisma.SortOrder;
};
export type SubstitutionGroupMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    activeIngredient?: Prisma.SortOrder;
    strength?: Prisma.SortOrder;
    dosageForm?: Prisma.SortOrder;
};
export type SubstitutionGroupMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    activeIngredient?: Prisma.SortOrder;
    strength?: Prisma.SortOrder;
    dosageForm?: Prisma.SortOrder;
};
export type SubstitutionGroupCreateNestedOneWithoutDrugsInput = {
    create?: Prisma.XOR<Prisma.SubstitutionGroupCreateWithoutDrugsInput, Prisma.SubstitutionGroupUncheckedCreateWithoutDrugsInput>;
    connectOrCreate?: Prisma.SubstitutionGroupCreateOrConnectWithoutDrugsInput;
    connect?: Prisma.SubstitutionGroupWhereUniqueInput;
};
export type SubstitutionGroupUpdateOneWithoutDrugsNestedInput = {
    create?: Prisma.XOR<Prisma.SubstitutionGroupCreateWithoutDrugsInput, Prisma.SubstitutionGroupUncheckedCreateWithoutDrugsInput>;
    connectOrCreate?: Prisma.SubstitutionGroupCreateOrConnectWithoutDrugsInput;
    upsert?: Prisma.SubstitutionGroupUpsertWithoutDrugsInput;
    disconnect?: Prisma.SubstitutionGroupWhereInput | boolean;
    delete?: Prisma.SubstitutionGroupWhereInput | boolean;
    connect?: Prisma.SubstitutionGroupWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SubstitutionGroupUpdateToOneWithWhereWithoutDrugsInput, Prisma.SubstitutionGroupUpdateWithoutDrugsInput>, Prisma.SubstitutionGroupUncheckedUpdateWithoutDrugsInput>;
};
export type SubstitutionGroupCreateWithoutDrugsInput = {
    id?: string;
    activeIngredient: string;
    strength: string;
    dosageForm: string;
};
export type SubstitutionGroupUncheckedCreateWithoutDrugsInput = {
    id?: string;
    activeIngredient: string;
    strength: string;
    dosageForm: string;
};
export type SubstitutionGroupCreateOrConnectWithoutDrugsInput = {
    where: Prisma.SubstitutionGroupWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubstitutionGroupCreateWithoutDrugsInput, Prisma.SubstitutionGroupUncheckedCreateWithoutDrugsInput>;
};
export type SubstitutionGroupUpsertWithoutDrugsInput = {
    update: Prisma.XOR<Prisma.SubstitutionGroupUpdateWithoutDrugsInput, Prisma.SubstitutionGroupUncheckedUpdateWithoutDrugsInput>;
    create: Prisma.XOR<Prisma.SubstitutionGroupCreateWithoutDrugsInput, Prisma.SubstitutionGroupUncheckedCreateWithoutDrugsInput>;
    where?: Prisma.SubstitutionGroupWhereInput;
};
export type SubstitutionGroupUpdateToOneWithWhereWithoutDrugsInput = {
    where?: Prisma.SubstitutionGroupWhereInput;
    data: Prisma.XOR<Prisma.SubstitutionGroupUpdateWithoutDrugsInput, Prisma.SubstitutionGroupUncheckedUpdateWithoutDrugsInput>;
};
export type SubstitutionGroupUpdateWithoutDrugsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    activeIngredient?: Prisma.StringFieldUpdateOperationsInput | string;
    strength?: Prisma.StringFieldUpdateOperationsInput | string;
    dosageForm?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SubstitutionGroupUncheckedUpdateWithoutDrugsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    activeIngredient?: Prisma.StringFieldUpdateOperationsInput | string;
    strength?: Prisma.StringFieldUpdateOperationsInput | string;
    dosageForm?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SubstitutionGroupCountOutputType = {
    drugs: number;
};
export type SubstitutionGroupCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drugs?: boolean | SubstitutionGroupCountOutputTypeCountDrugsArgs;
};
export type SubstitutionGroupCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionGroupCountOutputTypeSelect<ExtArgs> | null;
};
export type SubstitutionGroupCountOutputTypeCountDrugsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DrugWhereInput;
};
export type SubstitutionGroupSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    activeIngredient?: boolean;
    strength?: boolean;
    dosageForm?: boolean;
    drugs?: boolean | Prisma.SubstitutionGroup$drugsArgs<ExtArgs>;
    _count?: boolean | Prisma.SubstitutionGroupCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["substitutionGroup"]>;
export type SubstitutionGroupSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    activeIngredient?: boolean;
    strength?: boolean;
    dosageForm?: boolean;
}, ExtArgs["result"]["substitutionGroup"]>;
export type SubstitutionGroupSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    activeIngredient?: boolean;
    strength?: boolean;
    dosageForm?: boolean;
}, ExtArgs["result"]["substitutionGroup"]>;
export type SubstitutionGroupSelectScalar = {
    id?: boolean;
    activeIngredient?: boolean;
    strength?: boolean;
    dosageForm?: boolean;
};
export type SubstitutionGroupOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "activeIngredient" | "strength" | "dosageForm", ExtArgs["result"]["substitutionGroup"]>;
export type SubstitutionGroupInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drugs?: boolean | Prisma.SubstitutionGroup$drugsArgs<ExtArgs>;
    _count?: boolean | Prisma.SubstitutionGroupCountOutputTypeDefaultArgs<ExtArgs>;
};
export type SubstitutionGroupIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type SubstitutionGroupIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $SubstitutionGroupPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SubstitutionGroup";
    objects: {
        drugs: Prisma.$DrugPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        activeIngredient: string;
        strength: string;
        dosageForm: string;
    }, ExtArgs["result"]["substitutionGroup"]>;
    composites: {};
};
export type SubstitutionGroupGetPayload<S extends boolean | null | undefined | SubstitutionGroupDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SubstitutionGroupPayload, S>;
export type SubstitutionGroupCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SubstitutionGroupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SubstitutionGroupCountAggregateInputType | true;
};
export interface SubstitutionGroupDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SubstitutionGroup'];
        meta: {
            name: 'SubstitutionGroup';
        };
    };
    findUnique<T extends SubstitutionGroupFindUniqueArgs>(args: Prisma.SelectSubset<T, SubstitutionGroupFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SubstitutionGroupClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionGroupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SubstitutionGroupFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SubstitutionGroupFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubstitutionGroupClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionGroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SubstitutionGroupFindFirstArgs>(args?: Prisma.SelectSubset<T, SubstitutionGroupFindFirstArgs<ExtArgs>>): Prisma.Prisma__SubstitutionGroupClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionGroupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SubstitutionGroupFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SubstitutionGroupFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubstitutionGroupClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionGroupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SubstitutionGroupFindManyArgs>(args?: Prisma.SelectSubset<T, SubstitutionGroupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubstitutionGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SubstitutionGroupCreateArgs>(args: Prisma.SelectSubset<T, SubstitutionGroupCreateArgs<ExtArgs>>): Prisma.Prisma__SubstitutionGroupClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionGroupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SubstitutionGroupCreateManyArgs>(args?: Prisma.SelectSubset<T, SubstitutionGroupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SubstitutionGroupCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SubstitutionGroupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubstitutionGroupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SubstitutionGroupDeleteArgs>(args: Prisma.SelectSubset<T, SubstitutionGroupDeleteArgs<ExtArgs>>): Prisma.Prisma__SubstitutionGroupClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionGroupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SubstitutionGroupUpdateArgs>(args: Prisma.SelectSubset<T, SubstitutionGroupUpdateArgs<ExtArgs>>): Prisma.Prisma__SubstitutionGroupClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionGroupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SubstitutionGroupDeleteManyArgs>(args?: Prisma.SelectSubset<T, SubstitutionGroupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SubstitutionGroupUpdateManyArgs>(args: Prisma.SelectSubset<T, SubstitutionGroupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SubstitutionGroupUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SubstitutionGroupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubstitutionGroupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SubstitutionGroupUpsertArgs>(args: Prisma.SelectSubset<T, SubstitutionGroupUpsertArgs<ExtArgs>>): Prisma.Prisma__SubstitutionGroupClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionGroupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SubstitutionGroupCountArgs>(args?: Prisma.Subset<T, SubstitutionGroupCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SubstitutionGroupCountAggregateOutputType> : number>;
    aggregate<T extends SubstitutionGroupAggregateArgs>(args: Prisma.Subset<T, SubstitutionGroupAggregateArgs>): Prisma.PrismaPromise<GetSubstitutionGroupAggregateType<T>>;
    groupBy<T extends SubstitutionGroupGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SubstitutionGroupGroupByArgs['orderBy'];
    } : {
        orderBy?: SubstitutionGroupGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SubstitutionGroupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubstitutionGroupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SubstitutionGroupFieldRefs;
}
export interface Prisma__SubstitutionGroupClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    drugs<T extends Prisma.SubstitutionGroup$drugsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SubstitutionGroup$drugsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DrugPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SubstitutionGroupFieldRefs {
    readonly id: Prisma.FieldRef<"SubstitutionGroup", 'String'>;
    readonly activeIngredient: Prisma.FieldRef<"SubstitutionGroup", 'String'>;
    readonly strength: Prisma.FieldRef<"SubstitutionGroup", 'String'>;
    readonly dosageForm: Prisma.FieldRef<"SubstitutionGroup", 'String'>;
}
export type SubstitutionGroupFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionGroupSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionGroupOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionGroupInclude<ExtArgs> | null;
    where: Prisma.SubstitutionGroupWhereUniqueInput;
};
export type SubstitutionGroupFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionGroupSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionGroupOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionGroupInclude<ExtArgs> | null;
    where: Prisma.SubstitutionGroupWhereUniqueInput;
};
export type SubstitutionGroupFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionGroupSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionGroupOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionGroupInclude<ExtArgs> | null;
    where?: Prisma.SubstitutionGroupWhereInput;
    orderBy?: Prisma.SubstitutionGroupOrderByWithRelationInput | Prisma.SubstitutionGroupOrderByWithRelationInput[];
    cursor?: Prisma.SubstitutionGroupWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubstitutionGroupScalarFieldEnum | Prisma.SubstitutionGroupScalarFieldEnum[];
};
export type SubstitutionGroupFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionGroupSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionGroupOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionGroupInclude<ExtArgs> | null;
    where?: Prisma.SubstitutionGroupWhereInput;
    orderBy?: Prisma.SubstitutionGroupOrderByWithRelationInput | Prisma.SubstitutionGroupOrderByWithRelationInput[];
    cursor?: Prisma.SubstitutionGroupWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubstitutionGroupScalarFieldEnum | Prisma.SubstitutionGroupScalarFieldEnum[];
};
export type SubstitutionGroupFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionGroupSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionGroupOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionGroupInclude<ExtArgs> | null;
    where?: Prisma.SubstitutionGroupWhereInput;
    orderBy?: Prisma.SubstitutionGroupOrderByWithRelationInput | Prisma.SubstitutionGroupOrderByWithRelationInput[];
    cursor?: Prisma.SubstitutionGroupWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubstitutionGroupScalarFieldEnum | Prisma.SubstitutionGroupScalarFieldEnum[];
};
export type SubstitutionGroupCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionGroupSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionGroupOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionGroupInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubstitutionGroupCreateInput, Prisma.SubstitutionGroupUncheckedCreateInput>;
};
export type SubstitutionGroupCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SubstitutionGroupCreateManyInput | Prisma.SubstitutionGroupCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SubstitutionGroupCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionGroupSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubstitutionGroupOmit<ExtArgs> | null;
    data: Prisma.SubstitutionGroupCreateManyInput | Prisma.SubstitutionGroupCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SubstitutionGroupUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionGroupSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionGroupOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionGroupInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubstitutionGroupUpdateInput, Prisma.SubstitutionGroupUncheckedUpdateInput>;
    where: Prisma.SubstitutionGroupWhereUniqueInput;
};
export type SubstitutionGroupUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SubstitutionGroupUpdateManyMutationInput, Prisma.SubstitutionGroupUncheckedUpdateManyInput>;
    where?: Prisma.SubstitutionGroupWhereInput;
    limit?: number;
};
export type SubstitutionGroupUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionGroupSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubstitutionGroupOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubstitutionGroupUpdateManyMutationInput, Prisma.SubstitutionGroupUncheckedUpdateManyInput>;
    where?: Prisma.SubstitutionGroupWhereInput;
    limit?: number;
};
export type SubstitutionGroupUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionGroupSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionGroupOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionGroupInclude<ExtArgs> | null;
    where: Prisma.SubstitutionGroupWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubstitutionGroupCreateInput, Prisma.SubstitutionGroupUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SubstitutionGroupUpdateInput, Prisma.SubstitutionGroupUncheckedUpdateInput>;
};
export type SubstitutionGroupDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionGroupSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionGroupOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionGroupInclude<ExtArgs> | null;
    where: Prisma.SubstitutionGroupWhereUniqueInput;
};
export type SubstitutionGroupDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubstitutionGroupWhereInput;
    limit?: number;
};
export type SubstitutionGroup$drugsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DrugSelect<ExtArgs> | null;
    omit?: Prisma.DrugOmit<ExtArgs> | null;
    include?: Prisma.DrugInclude<ExtArgs> | null;
    where?: Prisma.DrugWhereInput;
    orderBy?: Prisma.DrugOrderByWithRelationInput | Prisma.DrugOrderByWithRelationInput[];
    cursor?: Prisma.DrugWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DrugScalarFieldEnum | Prisma.DrugScalarFieldEnum[];
};
export type SubstitutionGroupDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionGroupSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionGroupOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionGroupInclude<ExtArgs> | null;
};
