import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type FamilyLinkModel = runtime.Types.Result.DefaultSelection<Prisma.$FamilyLinkPayload>;
export type AggregateFamilyLink = {
    _count: FamilyLinkCountAggregateOutputType | null;
    _min: FamilyLinkMinAggregateOutputType | null;
    _max: FamilyLinkMaxAggregateOutputType | null;
};
export type FamilyLinkMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    patientId: string | null;
    relatedPatientId: string | null;
    relation: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type FamilyLinkMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    patientId: string | null;
    relatedPatientId: string | null;
    relation: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type FamilyLinkCountAggregateOutputType = {
    id: number;
    orgId: number;
    patientId: number;
    relatedPatientId: number;
    relation: number;
    createdBy: number;
    createdAt: number;
    _all: number;
};
export type FamilyLinkMinAggregateInputType = {
    id?: true;
    orgId?: true;
    patientId?: true;
    relatedPatientId?: true;
    relation?: true;
    createdBy?: true;
    createdAt?: true;
};
export type FamilyLinkMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    patientId?: true;
    relatedPatientId?: true;
    relation?: true;
    createdBy?: true;
    createdAt?: true;
};
export type FamilyLinkCountAggregateInputType = {
    id?: true;
    orgId?: true;
    patientId?: true;
    relatedPatientId?: true;
    relation?: true;
    createdBy?: true;
    createdAt?: true;
    _all?: true;
};
export type FamilyLinkAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FamilyLinkWhereInput;
    orderBy?: Prisma.FamilyLinkOrderByWithRelationInput | Prisma.FamilyLinkOrderByWithRelationInput[];
    cursor?: Prisma.FamilyLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | FamilyLinkCountAggregateInputType;
    _min?: FamilyLinkMinAggregateInputType;
    _max?: FamilyLinkMaxAggregateInputType;
};
export type GetFamilyLinkAggregateType<T extends FamilyLinkAggregateArgs> = {
    [P in keyof T & keyof AggregateFamilyLink]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFamilyLink[P]> : Prisma.GetScalarType<T[P], AggregateFamilyLink[P]>;
};
export type FamilyLinkGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FamilyLinkWhereInput;
    orderBy?: Prisma.FamilyLinkOrderByWithAggregationInput | Prisma.FamilyLinkOrderByWithAggregationInput[];
    by: Prisma.FamilyLinkScalarFieldEnum[] | Prisma.FamilyLinkScalarFieldEnum;
    having?: Prisma.FamilyLinkScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FamilyLinkCountAggregateInputType | true;
    _min?: FamilyLinkMinAggregateInputType;
    _max?: FamilyLinkMaxAggregateInputType;
};
export type FamilyLinkGroupByOutputType = {
    id: string;
    orgId: string;
    patientId: string;
    relatedPatientId: string;
    relation: string;
    createdBy: string;
    createdAt: Date;
    _count: FamilyLinkCountAggregateOutputType | null;
    _min: FamilyLinkMinAggregateOutputType | null;
    _max: FamilyLinkMaxAggregateOutputType | null;
};
export type GetFamilyLinkGroupByPayload<T extends FamilyLinkGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FamilyLinkGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FamilyLinkGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FamilyLinkGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FamilyLinkGroupByOutputType[P]>;
}>>;
export type FamilyLinkWhereInput = {
    AND?: Prisma.FamilyLinkWhereInput | Prisma.FamilyLinkWhereInput[];
    OR?: Prisma.FamilyLinkWhereInput[];
    NOT?: Prisma.FamilyLinkWhereInput | Prisma.FamilyLinkWhereInput[];
    id?: Prisma.StringFilter<"FamilyLink"> | string;
    orgId?: Prisma.StringFilter<"FamilyLink"> | string;
    patientId?: Prisma.StringFilter<"FamilyLink"> | string;
    relatedPatientId?: Prisma.StringFilter<"FamilyLink"> | string;
    relation?: Prisma.StringFilter<"FamilyLink"> | string;
    createdBy?: Prisma.StringFilter<"FamilyLink"> | string;
    createdAt?: Prisma.DateTimeFilter<"FamilyLink"> | Date | string;
};
export type FamilyLinkOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    relatedPatientId?: Prisma.SortOrder;
    relation?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FamilyLinkWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    patientId_relatedPatientId?: Prisma.FamilyLinkPatientIdRelatedPatientIdCompoundUniqueInput;
    AND?: Prisma.FamilyLinkWhereInput | Prisma.FamilyLinkWhereInput[];
    OR?: Prisma.FamilyLinkWhereInput[];
    NOT?: Prisma.FamilyLinkWhereInput | Prisma.FamilyLinkWhereInput[];
    orgId?: Prisma.StringFilter<"FamilyLink"> | string;
    patientId?: Prisma.StringFilter<"FamilyLink"> | string;
    relatedPatientId?: Prisma.StringFilter<"FamilyLink"> | string;
    relation?: Prisma.StringFilter<"FamilyLink"> | string;
    createdBy?: Prisma.StringFilter<"FamilyLink"> | string;
    createdAt?: Prisma.DateTimeFilter<"FamilyLink"> | Date | string;
}, "id" | "patientId_relatedPatientId">;
export type FamilyLinkOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    relatedPatientId?: Prisma.SortOrder;
    relation?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.FamilyLinkCountOrderByAggregateInput;
    _max?: Prisma.FamilyLinkMaxOrderByAggregateInput;
    _min?: Prisma.FamilyLinkMinOrderByAggregateInput;
};
export type FamilyLinkScalarWhereWithAggregatesInput = {
    AND?: Prisma.FamilyLinkScalarWhereWithAggregatesInput | Prisma.FamilyLinkScalarWhereWithAggregatesInput[];
    OR?: Prisma.FamilyLinkScalarWhereWithAggregatesInput[];
    NOT?: Prisma.FamilyLinkScalarWhereWithAggregatesInput | Prisma.FamilyLinkScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"FamilyLink"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"FamilyLink"> | string;
    patientId?: Prisma.StringWithAggregatesFilter<"FamilyLink"> | string;
    relatedPatientId?: Prisma.StringWithAggregatesFilter<"FamilyLink"> | string;
    relation?: Prisma.StringWithAggregatesFilter<"FamilyLink"> | string;
    createdBy?: Prisma.StringWithAggregatesFilter<"FamilyLink"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"FamilyLink"> | Date | string;
};
export type FamilyLinkCreateInput = {
    id?: string;
    orgId: string;
    patientId: string;
    relatedPatientId: string;
    relation: string;
    createdBy: string;
    createdAt?: Date | string;
};
export type FamilyLinkUncheckedCreateInput = {
    id?: string;
    orgId: string;
    patientId: string;
    relatedPatientId: string;
    relation: string;
    createdBy: string;
    createdAt?: Date | string;
};
export type FamilyLinkUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    relatedPatientId?: Prisma.StringFieldUpdateOperationsInput | string;
    relation?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FamilyLinkUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    relatedPatientId?: Prisma.StringFieldUpdateOperationsInput | string;
    relation?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FamilyLinkCreateManyInput = {
    id?: string;
    orgId: string;
    patientId: string;
    relatedPatientId: string;
    relation: string;
    createdBy: string;
    createdAt?: Date | string;
};
export type FamilyLinkUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    relatedPatientId?: Prisma.StringFieldUpdateOperationsInput | string;
    relation?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FamilyLinkUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    relatedPatientId?: Prisma.StringFieldUpdateOperationsInput | string;
    relation?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FamilyLinkPatientIdRelatedPatientIdCompoundUniqueInput = {
    patientId: string;
    relatedPatientId: string;
};
export type FamilyLinkCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    relatedPatientId?: Prisma.SortOrder;
    relation?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FamilyLinkMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    relatedPatientId?: Prisma.SortOrder;
    relation?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FamilyLinkMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    relatedPatientId?: Prisma.SortOrder;
    relation?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FamilyLinkSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    relatedPatientId?: boolean;
    relation?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["familyLink"]>;
export type FamilyLinkSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    relatedPatientId?: boolean;
    relation?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["familyLink"]>;
export type FamilyLinkSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    relatedPatientId?: boolean;
    relation?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["familyLink"]>;
export type FamilyLinkSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    patientId?: boolean;
    relatedPatientId?: boolean;
    relation?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
};
export type FamilyLinkOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "patientId" | "relatedPatientId" | "relation" | "createdBy" | "createdAt", ExtArgs["result"]["familyLink"]>;
export type $FamilyLinkPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "FamilyLink";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        patientId: string;
        relatedPatientId: string;
        relation: string;
        createdBy: string;
        createdAt: Date;
    }, ExtArgs["result"]["familyLink"]>;
    composites: {};
};
export type FamilyLinkGetPayload<S extends boolean | null | undefined | FamilyLinkDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$FamilyLinkPayload, S>;
export type FamilyLinkCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<FamilyLinkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FamilyLinkCountAggregateInputType | true;
};
export interface FamilyLinkDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['FamilyLink'];
        meta: {
            name: 'FamilyLink';
        };
    };
    findUnique<T extends FamilyLinkFindUniqueArgs>(args: Prisma.SelectSubset<T, FamilyLinkFindUniqueArgs<ExtArgs>>): Prisma.Prisma__FamilyLinkClient<runtime.Types.Result.GetResult<Prisma.$FamilyLinkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends FamilyLinkFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, FamilyLinkFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__FamilyLinkClient<runtime.Types.Result.GetResult<Prisma.$FamilyLinkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends FamilyLinkFindFirstArgs>(args?: Prisma.SelectSubset<T, FamilyLinkFindFirstArgs<ExtArgs>>): Prisma.Prisma__FamilyLinkClient<runtime.Types.Result.GetResult<Prisma.$FamilyLinkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends FamilyLinkFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, FamilyLinkFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__FamilyLinkClient<runtime.Types.Result.GetResult<Prisma.$FamilyLinkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends FamilyLinkFindManyArgs>(args?: Prisma.SelectSubset<T, FamilyLinkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FamilyLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends FamilyLinkCreateArgs>(args: Prisma.SelectSubset<T, FamilyLinkCreateArgs<ExtArgs>>): Prisma.Prisma__FamilyLinkClient<runtime.Types.Result.GetResult<Prisma.$FamilyLinkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends FamilyLinkCreateManyArgs>(args?: Prisma.SelectSubset<T, FamilyLinkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends FamilyLinkCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, FamilyLinkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FamilyLinkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends FamilyLinkDeleteArgs>(args: Prisma.SelectSubset<T, FamilyLinkDeleteArgs<ExtArgs>>): Prisma.Prisma__FamilyLinkClient<runtime.Types.Result.GetResult<Prisma.$FamilyLinkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends FamilyLinkUpdateArgs>(args: Prisma.SelectSubset<T, FamilyLinkUpdateArgs<ExtArgs>>): Prisma.Prisma__FamilyLinkClient<runtime.Types.Result.GetResult<Prisma.$FamilyLinkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends FamilyLinkDeleteManyArgs>(args?: Prisma.SelectSubset<T, FamilyLinkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends FamilyLinkUpdateManyArgs>(args: Prisma.SelectSubset<T, FamilyLinkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends FamilyLinkUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, FamilyLinkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FamilyLinkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends FamilyLinkUpsertArgs>(args: Prisma.SelectSubset<T, FamilyLinkUpsertArgs<ExtArgs>>): Prisma.Prisma__FamilyLinkClient<runtime.Types.Result.GetResult<Prisma.$FamilyLinkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends FamilyLinkCountArgs>(args?: Prisma.Subset<T, FamilyLinkCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FamilyLinkCountAggregateOutputType> : number>;
    aggregate<T extends FamilyLinkAggregateArgs>(args: Prisma.Subset<T, FamilyLinkAggregateArgs>): Prisma.PrismaPromise<GetFamilyLinkAggregateType<T>>;
    groupBy<T extends FamilyLinkGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: FamilyLinkGroupByArgs['orderBy'];
    } : {
        orderBy?: FamilyLinkGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, FamilyLinkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFamilyLinkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: FamilyLinkFieldRefs;
}
export interface Prisma__FamilyLinkClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface FamilyLinkFieldRefs {
    readonly id: Prisma.FieldRef<"FamilyLink", 'String'>;
    readonly orgId: Prisma.FieldRef<"FamilyLink", 'String'>;
    readonly patientId: Prisma.FieldRef<"FamilyLink", 'String'>;
    readonly relatedPatientId: Prisma.FieldRef<"FamilyLink", 'String'>;
    readonly relation: Prisma.FieldRef<"FamilyLink", 'String'>;
    readonly createdBy: Prisma.FieldRef<"FamilyLink", 'String'>;
    readonly createdAt: Prisma.FieldRef<"FamilyLink", 'DateTime'>;
}
export type FamilyLinkFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FamilyLinkSelect<ExtArgs> | null;
    omit?: Prisma.FamilyLinkOmit<ExtArgs> | null;
    where: Prisma.FamilyLinkWhereUniqueInput;
};
export type FamilyLinkFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FamilyLinkSelect<ExtArgs> | null;
    omit?: Prisma.FamilyLinkOmit<ExtArgs> | null;
    where: Prisma.FamilyLinkWhereUniqueInput;
};
export type FamilyLinkFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FamilyLinkSelect<ExtArgs> | null;
    omit?: Prisma.FamilyLinkOmit<ExtArgs> | null;
    where?: Prisma.FamilyLinkWhereInput;
    orderBy?: Prisma.FamilyLinkOrderByWithRelationInput | Prisma.FamilyLinkOrderByWithRelationInput[];
    cursor?: Prisma.FamilyLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FamilyLinkScalarFieldEnum | Prisma.FamilyLinkScalarFieldEnum[];
};
export type FamilyLinkFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FamilyLinkSelect<ExtArgs> | null;
    omit?: Prisma.FamilyLinkOmit<ExtArgs> | null;
    where?: Prisma.FamilyLinkWhereInput;
    orderBy?: Prisma.FamilyLinkOrderByWithRelationInput | Prisma.FamilyLinkOrderByWithRelationInput[];
    cursor?: Prisma.FamilyLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FamilyLinkScalarFieldEnum | Prisma.FamilyLinkScalarFieldEnum[];
};
export type FamilyLinkFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FamilyLinkSelect<ExtArgs> | null;
    omit?: Prisma.FamilyLinkOmit<ExtArgs> | null;
    where?: Prisma.FamilyLinkWhereInput;
    orderBy?: Prisma.FamilyLinkOrderByWithRelationInput | Prisma.FamilyLinkOrderByWithRelationInput[];
    cursor?: Prisma.FamilyLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FamilyLinkScalarFieldEnum | Prisma.FamilyLinkScalarFieldEnum[];
};
export type FamilyLinkCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FamilyLinkSelect<ExtArgs> | null;
    omit?: Prisma.FamilyLinkOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FamilyLinkCreateInput, Prisma.FamilyLinkUncheckedCreateInput>;
};
export type FamilyLinkCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.FamilyLinkCreateManyInput | Prisma.FamilyLinkCreateManyInput[];
    skipDuplicates?: boolean;
};
export type FamilyLinkCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FamilyLinkSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FamilyLinkOmit<ExtArgs> | null;
    data: Prisma.FamilyLinkCreateManyInput | Prisma.FamilyLinkCreateManyInput[];
    skipDuplicates?: boolean;
};
export type FamilyLinkUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FamilyLinkSelect<ExtArgs> | null;
    omit?: Prisma.FamilyLinkOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FamilyLinkUpdateInput, Prisma.FamilyLinkUncheckedUpdateInput>;
    where: Prisma.FamilyLinkWhereUniqueInput;
};
export type FamilyLinkUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.FamilyLinkUpdateManyMutationInput, Prisma.FamilyLinkUncheckedUpdateManyInput>;
    where?: Prisma.FamilyLinkWhereInput;
    limit?: number;
};
export type FamilyLinkUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FamilyLinkSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FamilyLinkOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FamilyLinkUpdateManyMutationInput, Prisma.FamilyLinkUncheckedUpdateManyInput>;
    where?: Prisma.FamilyLinkWhereInput;
    limit?: number;
};
export type FamilyLinkUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FamilyLinkSelect<ExtArgs> | null;
    omit?: Prisma.FamilyLinkOmit<ExtArgs> | null;
    where: Prisma.FamilyLinkWhereUniqueInput;
    create: Prisma.XOR<Prisma.FamilyLinkCreateInput, Prisma.FamilyLinkUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.FamilyLinkUpdateInput, Prisma.FamilyLinkUncheckedUpdateInput>;
};
export type FamilyLinkDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FamilyLinkSelect<ExtArgs> | null;
    omit?: Prisma.FamilyLinkOmit<ExtArgs> | null;
    where: Prisma.FamilyLinkWhereUniqueInput;
};
export type FamilyLinkDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FamilyLinkWhereInput;
    limit?: number;
};
export type FamilyLinkDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FamilyLinkSelect<ExtArgs> | null;
    omit?: Prisma.FamilyLinkOmit<ExtArgs> | null;
};
