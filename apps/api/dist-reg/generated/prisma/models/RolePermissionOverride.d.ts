import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type RolePermissionOverrideModel = runtime.Types.Result.DefaultSelection<Prisma.$RolePermissionOverridePayload>;
export type AggregateRolePermissionOverride = {
    _count: RolePermissionOverrideCountAggregateOutputType | null;
    _min: RolePermissionOverrideMinAggregateOutputType | null;
    _max: RolePermissionOverrideMaxAggregateOutputType | null;
};
export type RolePermissionOverrideMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    role: $Enums.StaffRole | null;
    permission: string | null;
    granted: boolean | null;
    updatedBy: string | null;
    updatedAt: Date | null;
};
export type RolePermissionOverrideMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    role: $Enums.StaffRole | null;
    permission: string | null;
    granted: boolean | null;
    updatedBy: string | null;
    updatedAt: Date | null;
};
export type RolePermissionOverrideCountAggregateOutputType = {
    id: number;
    orgId: number;
    role: number;
    permission: number;
    granted: number;
    updatedBy: number;
    updatedAt: number;
    _all: number;
};
export type RolePermissionOverrideMinAggregateInputType = {
    id?: true;
    orgId?: true;
    role?: true;
    permission?: true;
    granted?: true;
    updatedBy?: true;
    updatedAt?: true;
};
export type RolePermissionOverrideMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    role?: true;
    permission?: true;
    granted?: true;
    updatedBy?: true;
    updatedAt?: true;
};
export type RolePermissionOverrideCountAggregateInputType = {
    id?: true;
    orgId?: true;
    role?: true;
    permission?: true;
    granted?: true;
    updatedBy?: true;
    updatedAt?: true;
    _all?: true;
};
export type RolePermissionOverrideAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RolePermissionOverrideWhereInput;
    orderBy?: Prisma.RolePermissionOverrideOrderByWithRelationInput | Prisma.RolePermissionOverrideOrderByWithRelationInput[];
    cursor?: Prisma.RolePermissionOverrideWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RolePermissionOverrideCountAggregateInputType;
    _min?: RolePermissionOverrideMinAggregateInputType;
    _max?: RolePermissionOverrideMaxAggregateInputType;
};
export type GetRolePermissionOverrideAggregateType<T extends RolePermissionOverrideAggregateArgs> = {
    [P in keyof T & keyof AggregateRolePermissionOverride]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRolePermissionOverride[P]> : Prisma.GetScalarType<T[P], AggregateRolePermissionOverride[P]>;
};
export type RolePermissionOverrideGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RolePermissionOverrideWhereInput;
    orderBy?: Prisma.RolePermissionOverrideOrderByWithAggregationInput | Prisma.RolePermissionOverrideOrderByWithAggregationInput[];
    by: Prisma.RolePermissionOverrideScalarFieldEnum[] | Prisma.RolePermissionOverrideScalarFieldEnum;
    having?: Prisma.RolePermissionOverrideScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RolePermissionOverrideCountAggregateInputType | true;
    _min?: RolePermissionOverrideMinAggregateInputType;
    _max?: RolePermissionOverrideMaxAggregateInputType;
};
export type RolePermissionOverrideGroupByOutputType = {
    id: string;
    orgId: string;
    role: $Enums.StaffRole;
    permission: string;
    granted: boolean;
    updatedBy: string | null;
    updatedAt: Date;
    _count: RolePermissionOverrideCountAggregateOutputType | null;
    _min: RolePermissionOverrideMinAggregateOutputType | null;
    _max: RolePermissionOverrideMaxAggregateOutputType | null;
};
export type GetRolePermissionOverrideGroupByPayload<T extends RolePermissionOverrideGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RolePermissionOverrideGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RolePermissionOverrideGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RolePermissionOverrideGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RolePermissionOverrideGroupByOutputType[P]>;
}>>;
export type RolePermissionOverrideWhereInput = {
    AND?: Prisma.RolePermissionOverrideWhereInput | Prisma.RolePermissionOverrideWhereInput[];
    OR?: Prisma.RolePermissionOverrideWhereInput[];
    NOT?: Prisma.RolePermissionOverrideWhereInput | Prisma.RolePermissionOverrideWhereInput[];
    id?: Prisma.StringFilter<"RolePermissionOverride"> | string;
    orgId?: Prisma.StringFilter<"RolePermissionOverride"> | string;
    role?: Prisma.EnumStaffRoleFilter<"RolePermissionOverride"> | $Enums.StaffRole;
    permission?: Prisma.StringFilter<"RolePermissionOverride"> | string;
    granted?: Prisma.BoolFilter<"RolePermissionOverride"> | boolean;
    updatedBy?: Prisma.StringNullableFilter<"RolePermissionOverride"> | string | null;
    updatedAt?: Prisma.DateTimeFilter<"RolePermissionOverride"> | Date | string;
};
export type RolePermissionOverrideOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    permission?: Prisma.SortOrder;
    granted?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RolePermissionOverrideWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orgId_role_permission?: Prisma.RolePermissionOverrideOrgIdRolePermissionCompoundUniqueInput;
    AND?: Prisma.RolePermissionOverrideWhereInput | Prisma.RolePermissionOverrideWhereInput[];
    OR?: Prisma.RolePermissionOverrideWhereInput[];
    NOT?: Prisma.RolePermissionOverrideWhereInput | Prisma.RolePermissionOverrideWhereInput[];
    orgId?: Prisma.StringFilter<"RolePermissionOverride"> | string;
    role?: Prisma.EnumStaffRoleFilter<"RolePermissionOverride"> | $Enums.StaffRole;
    permission?: Prisma.StringFilter<"RolePermissionOverride"> | string;
    granted?: Prisma.BoolFilter<"RolePermissionOverride"> | boolean;
    updatedBy?: Prisma.StringNullableFilter<"RolePermissionOverride"> | string | null;
    updatedAt?: Prisma.DateTimeFilter<"RolePermissionOverride"> | Date | string;
}, "id" | "orgId_role_permission">;
export type RolePermissionOverrideOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    permission?: Prisma.SortOrder;
    granted?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.RolePermissionOverrideCountOrderByAggregateInput;
    _max?: Prisma.RolePermissionOverrideMaxOrderByAggregateInput;
    _min?: Prisma.RolePermissionOverrideMinOrderByAggregateInput;
};
export type RolePermissionOverrideScalarWhereWithAggregatesInput = {
    AND?: Prisma.RolePermissionOverrideScalarWhereWithAggregatesInput | Prisma.RolePermissionOverrideScalarWhereWithAggregatesInput[];
    OR?: Prisma.RolePermissionOverrideScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RolePermissionOverrideScalarWhereWithAggregatesInput | Prisma.RolePermissionOverrideScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RolePermissionOverride"> | string;
    orgId?: Prisma.StringWithAggregatesFilter<"RolePermissionOverride"> | string;
    role?: Prisma.EnumStaffRoleWithAggregatesFilter<"RolePermissionOverride"> | $Enums.StaffRole;
    permission?: Prisma.StringWithAggregatesFilter<"RolePermissionOverride"> | string;
    granted?: Prisma.BoolWithAggregatesFilter<"RolePermissionOverride"> | boolean;
    updatedBy?: Prisma.StringNullableWithAggregatesFilter<"RolePermissionOverride"> | string | null;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"RolePermissionOverride"> | Date | string;
};
export type RolePermissionOverrideCreateInput = {
    id?: string;
    orgId: string;
    role: $Enums.StaffRole;
    permission: string;
    granted: boolean;
    updatedBy?: string | null;
    updatedAt?: Date | string;
};
export type RolePermissionOverrideUncheckedCreateInput = {
    id?: string;
    orgId: string;
    role: $Enums.StaffRole;
    permission: string;
    granted: boolean;
    updatedBy?: string | null;
    updatedAt?: Date | string;
};
export type RolePermissionOverrideUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole;
    permission?: Prisma.StringFieldUpdateOperationsInput | string;
    granted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    updatedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RolePermissionOverrideUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole;
    permission?: Prisma.StringFieldUpdateOperationsInput | string;
    granted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    updatedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RolePermissionOverrideCreateManyInput = {
    id?: string;
    orgId: string;
    role: $Enums.StaffRole;
    permission: string;
    granted: boolean;
    updatedBy?: string | null;
    updatedAt?: Date | string;
};
export type RolePermissionOverrideUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole;
    permission?: Prisma.StringFieldUpdateOperationsInput | string;
    granted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    updatedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RolePermissionOverrideUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orgId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole;
    permission?: Prisma.StringFieldUpdateOperationsInput | string;
    granted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    updatedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RolePermissionOverrideOrgIdRolePermissionCompoundUniqueInput = {
    orgId: string;
    role: $Enums.StaffRole;
    permission: string;
};
export type RolePermissionOverrideCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    permission?: Prisma.SortOrder;
    granted?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RolePermissionOverrideMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    permission?: Prisma.SortOrder;
    granted?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RolePermissionOverrideMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orgId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    permission?: Prisma.SortOrder;
    granted?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RolePermissionOverrideSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    role?: boolean;
    permission?: boolean;
    granted?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["rolePermissionOverride"]>;
export type RolePermissionOverrideSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    role?: boolean;
    permission?: boolean;
    granted?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["rolePermissionOverride"]>;
export type RolePermissionOverrideSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orgId?: boolean;
    role?: boolean;
    permission?: boolean;
    granted?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["rolePermissionOverride"]>;
export type RolePermissionOverrideSelectScalar = {
    id?: boolean;
    orgId?: boolean;
    role?: boolean;
    permission?: boolean;
    granted?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
};
export type RolePermissionOverrideOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orgId" | "role" | "permission" | "granted" | "updatedBy" | "updatedAt", ExtArgs["result"]["rolePermissionOverride"]>;
export type $RolePermissionOverridePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RolePermissionOverride";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orgId: string;
        role: $Enums.StaffRole;
        permission: string;
        granted: boolean;
        updatedBy: string | null;
        updatedAt: Date;
    }, ExtArgs["result"]["rolePermissionOverride"]>;
    composites: {};
};
export type RolePermissionOverrideGetPayload<S extends boolean | null | undefined | RolePermissionOverrideDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RolePermissionOverridePayload, S>;
export type RolePermissionOverrideCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RolePermissionOverrideFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RolePermissionOverrideCountAggregateInputType | true;
};
export interface RolePermissionOverrideDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RolePermissionOverride'];
        meta: {
            name: 'RolePermissionOverride';
        };
    };
    findUnique<T extends RolePermissionOverrideFindUniqueArgs>(args: Prisma.SelectSubset<T, RolePermissionOverrideFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RolePermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionOverridePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RolePermissionOverrideFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RolePermissionOverrideFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RolePermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionOverridePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RolePermissionOverrideFindFirstArgs>(args?: Prisma.SelectSubset<T, RolePermissionOverrideFindFirstArgs<ExtArgs>>): Prisma.Prisma__RolePermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionOverridePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RolePermissionOverrideFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RolePermissionOverrideFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RolePermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionOverridePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RolePermissionOverrideFindManyArgs>(args?: Prisma.SelectSubset<T, RolePermissionOverrideFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RolePermissionOverridePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RolePermissionOverrideCreateArgs>(args: Prisma.SelectSubset<T, RolePermissionOverrideCreateArgs<ExtArgs>>): Prisma.Prisma__RolePermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionOverridePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RolePermissionOverrideCreateManyArgs>(args?: Prisma.SelectSubset<T, RolePermissionOverrideCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RolePermissionOverrideCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RolePermissionOverrideCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RolePermissionOverridePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RolePermissionOverrideDeleteArgs>(args: Prisma.SelectSubset<T, RolePermissionOverrideDeleteArgs<ExtArgs>>): Prisma.Prisma__RolePermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionOverridePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RolePermissionOverrideUpdateArgs>(args: Prisma.SelectSubset<T, RolePermissionOverrideUpdateArgs<ExtArgs>>): Prisma.Prisma__RolePermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionOverridePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RolePermissionOverrideDeleteManyArgs>(args?: Prisma.SelectSubset<T, RolePermissionOverrideDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RolePermissionOverrideUpdateManyArgs>(args: Prisma.SelectSubset<T, RolePermissionOverrideUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RolePermissionOverrideUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RolePermissionOverrideUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RolePermissionOverridePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RolePermissionOverrideUpsertArgs>(args: Prisma.SelectSubset<T, RolePermissionOverrideUpsertArgs<ExtArgs>>): Prisma.Prisma__RolePermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionOverridePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RolePermissionOverrideCountArgs>(args?: Prisma.Subset<T, RolePermissionOverrideCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RolePermissionOverrideCountAggregateOutputType> : number>;
    aggregate<T extends RolePermissionOverrideAggregateArgs>(args: Prisma.Subset<T, RolePermissionOverrideAggregateArgs>): Prisma.PrismaPromise<GetRolePermissionOverrideAggregateType<T>>;
    groupBy<T extends RolePermissionOverrideGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RolePermissionOverrideGroupByArgs['orderBy'];
    } : {
        orderBy?: RolePermissionOverrideGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RolePermissionOverrideGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRolePermissionOverrideGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RolePermissionOverrideFieldRefs;
}
export interface Prisma__RolePermissionOverrideClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RolePermissionOverrideFieldRefs {
    readonly id: Prisma.FieldRef<"RolePermissionOverride", 'String'>;
    readonly orgId: Prisma.FieldRef<"RolePermissionOverride", 'String'>;
    readonly role: Prisma.FieldRef<"RolePermissionOverride", 'StaffRole'>;
    readonly permission: Prisma.FieldRef<"RolePermissionOverride", 'String'>;
    readonly granted: Prisma.FieldRef<"RolePermissionOverride", 'Boolean'>;
    readonly updatedBy: Prisma.FieldRef<"RolePermissionOverride", 'String'>;
    readonly updatedAt: Prisma.FieldRef<"RolePermissionOverride", 'DateTime'>;
}
export type RolePermissionOverrideFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOverrideOmit<ExtArgs> | null;
    where: Prisma.RolePermissionOverrideWhereUniqueInput;
};
export type RolePermissionOverrideFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOverrideOmit<ExtArgs> | null;
    where: Prisma.RolePermissionOverrideWhereUniqueInput;
};
export type RolePermissionOverrideFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOverrideOmit<ExtArgs> | null;
    where?: Prisma.RolePermissionOverrideWhereInput;
    orderBy?: Prisma.RolePermissionOverrideOrderByWithRelationInput | Prisma.RolePermissionOverrideOrderByWithRelationInput[];
    cursor?: Prisma.RolePermissionOverrideWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RolePermissionOverrideScalarFieldEnum | Prisma.RolePermissionOverrideScalarFieldEnum[];
};
export type RolePermissionOverrideFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOverrideOmit<ExtArgs> | null;
    where?: Prisma.RolePermissionOverrideWhereInput;
    orderBy?: Prisma.RolePermissionOverrideOrderByWithRelationInput | Prisma.RolePermissionOverrideOrderByWithRelationInput[];
    cursor?: Prisma.RolePermissionOverrideWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RolePermissionOverrideScalarFieldEnum | Prisma.RolePermissionOverrideScalarFieldEnum[];
};
export type RolePermissionOverrideFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOverrideOmit<ExtArgs> | null;
    where?: Prisma.RolePermissionOverrideWhereInput;
    orderBy?: Prisma.RolePermissionOverrideOrderByWithRelationInput | Prisma.RolePermissionOverrideOrderByWithRelationInput[];
    cursor?: Prisma.RolePermissionOverrideWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RolePermissionOverrideScalarFieldEnum | Prisma.RolePermissionOverrideScalarFieldEnum[];
};
export type RolePermissionOverrideCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOverrideOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RolePermissionOverrideCreateInput, Prisma.RolePermissionOverrideUncheckedCreateInput>;
};
export type RolePermissionOverrideCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RolePermissionOverrideCreateManyInput | Prisma.RolePermissionOverrideCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RolePermissionOverrideCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionOverrideSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RolePermissionOverrideOmit<ExtArgs> | null;
    data: Prisma.RolePermissionOverrideCreateManyInput | Prisma.RolePermissionOverrideCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RolePermissionOverrideUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOverrideOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RolePermissionOverrideUpdateInput, Prisma.RolePermissionOverrideUncheckedUpdateInput>;
    where: Prisma.RolePermissionOverrideWhereUniqueInput;
};
export type RolePermissionOverrideUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RolePermissionOverrideUpdateManyMutationInput, Prisma.RolePermissionOverrideUncheckedUpdateManyInput>;
    where?: Prisma.RolePermissionOverrideWhereInput;
    limit?: number;
};
export type RolePermissionOverrideUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionOverrideSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RolePermissionOverrideOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RolePermissionOverrideUpdateManyMutationInput, Prisma.RolePermissionOverrideUncheckedUpdateManyInput>;
    where?: Prisma.RolePermissionOverrideWhereInput;
    limit?: number;
};
export type RolePermissionOverrideUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOverrideOmit<ExtArgs> | null;
    where: Prisma.RolePermissionOverrideWhereUniqueInput;
    create: Prisma.XOR<Prisma.RolePermissionOverrideCreateInput, Prisma.RolePermissionOverrideUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RolePermissionOverrideUpdateInput, Prisma.RolePermissionOverrideUncheckedUpdateInput>;
};
export type RolePermissionOverrideDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOverrideOmit<ExtArgs> | null;
    where: Prisma.RolePermissionOverrideWhereUniqueInput;
};
export type RolePermissionOverrideDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RolePermissionOverrideWhereInput;
    limit?: number;
};
export type RolePermissionOverrideDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOverrideOmit<ExtArgs> | null;
};
