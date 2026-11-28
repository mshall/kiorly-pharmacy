import type * as runtime from "@prisma/client/runtime/client";
import * as $Enums from "./enums";
import type * as Prisma from "./internal/prismaNamespace";
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type EnumEditionFilter<$PrismaModel = never> = {
    equals?: $Enums.Edition | Prisma.EnumEditionFieldRefInput<$PrismaModel>;
    in?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEditionFilter<$PrismaModel> | $Enums.Edition;
};
export type EnumSignInMethodNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.SignInMethod | Prisma.EnumSignInMethodFieldRefInput<$PrismaModel> | null;
    in?: $Enums.SignInMethod[] | Prisma.ListEnumSignInMethodFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.SignInMethod[] | Prisma.ListEnumSignInMethodFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumSignInMethodNullableFilter<$PrismaModel> | $Enums.SignInMethod | null;
};
export type JsonNullableFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>, Required<JsonNullableFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>;
export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type SortOrderInput = {
    sort: Prisma.SortOrder;
    nulls?: Prisma.NullsOrder;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type EnumEditionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Edition | Prisma.EnumEditionFieldRefInput<$PrismaModel>;
    in?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEditionWithAggregatesFilter<$PrismaModel> | $Enums.Edition;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumEditionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumEditionFilter<$PrismaModel>;
};
export type EnumSignInMethodNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SignInMethod | Prisma.EnumSignInMethodFieldRefInput<$PrismaModel> | null;
    in?: $Enums.SignInMethod[] | Prisma.ListEnumSignInMethodFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.SignInMethod[] | Prisma.ListEnumSignInMethodFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumSignInMethodNullableWithAggregatesFilter<$PrismaModel> | $Enums.SignInMethod | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSignInMethodNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSignInMethodNullableFilter<$PrismaModel>;
};
export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>, Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>;
export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedJsonNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedJsonNullableFilter<$PrismaModel>;
};
export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type IntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type EnumStaffRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.StaffRole | Prisma.EnumStaffRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.StaffRole[] | Prisma.ListEnumStaffRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StaffRole[] | Prisma.ListEnumStaffRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStaffRoleFilter<$PrismaModel> | $Enums.StaffRole;
};
export type JsonFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>, Required<JsonFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>;
export type JsonFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type EnumStaffRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StaffRole | Prisma.EnumStaffRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.StaffRole[] | Prisma.ListEnumStaffRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StaffRole[] | Prisma.ListEnumStaffRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStaffRoleWithAggregatesFilter<$PrismaModel> | $Enums.StaffRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStaffRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStaffRoleFilter<$PrismaModel>;
};
export type JsonWithAggregatesFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>, Required<JsonWithAggregatesFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>;
export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedJsonFilter<$PrismaModel>;
    _max?: Prisma.NestedJsonFilter<$PrismaModel>;
};
export type EnumControlledScheduleFilter<$PrismaModel = never> = {
    equals?: $Enums.ControlledSchedule | Prisma.EnumControlledScheduleFieldRefInput<$PrismaModel>;
    in?: $Enums.ControlledSchedule[] | Prisma.ListEnumControlledScheduleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ControlledSchedule[] | Prisma.ListEnumControlledScheduleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumControlledScheduleFilter<$PrismaModel> | $Enums.ControlledSchedule;
};
export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type EnumControlledScheduleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ControlledSchedule | Prisma.EnumControlledScheduleFieldRefInput<$PrismaModel>;
    in?: $Enums.ControlledSchedule[] | Prisma.ListEnumControlledScheduleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ControlledSchedule[] | Prisma.ListEnumControlledScheduleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumControlledScheduleWithAggregatesFilter<$PrismaModel> | $Enums.ControlledSchedule;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumControlledScheduleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumControlledScheduleFilter<$PrismaModel>;
};
export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
};
export type DecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type EnumPurchaseOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PurchaseOrderStatus | Prisma.EnumPurchaseOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PurchaseOrderStatus[] | Prisma.ListEnumPurchaseOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PurchaseOrderStatus[] | Prisma.ListEnumPurchaseOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPurchaseOrderStatusFilter<$PrismaModel> | $Enums.PurchaseOrderStatus;
};
export type EnumPurchaseOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PurchaseOrderStatus | Prisma.EnumPurchaseOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PurchaseOrderStatus[] | Prisma.ListEnumPurchaseOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PurchaseOrderStatus[] | Prisma.ListEnumPurchaseOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPurchaseOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.PurchaseOrderStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPurchaseOrderStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPurchaseOrderStatusFilter<$PrismaModel>;
};
export type EnumRecallStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RecallStatus | Prisma.EnumRecallStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RecallStatus[] | Prisma.ListEnumRecallStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RecallStatus[] | Prisma.ListEnumRecallStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRecallStatusFilter<$PrismaModel> | $Enums.RecallStatus;
};
export type EnumRecallStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RecallStatus | Prisma.EnumRecallStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RecallStatus[] | Prisma.ListEnumRecallStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RecallStatus[] | Prisma.ListEnumRecallStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRecallStatusWithAggregatesFilter<$PrismaModel> | $Enums.RecallStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRecallStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRecallStatusFilter<$PrismaModel>;
};
export type EnumLotStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LotStatus | Prisma.EnumLotStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLotStatusFilter<$PrismaModel> | $Enums.LotStatus;
};
export type EnumLotStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.LotStatus | Prisma.EnumLotStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumLotStatusNullableFilter<$PrismaModel> | $Enums.LotStatus | null;
};
export type EnumLotStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LotStatus | Prisma.EnumLotStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLotStatusWithAggregatesFilter<$PrismaModel> | $Enums.LotStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLotStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLotStatusFilter<$PrismaModel>;
};
export type EnumLotStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LotStatus | Prisma.EnumLotStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumLotStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.LotStatus | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLotStatusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLotStatusNullableFilter<$PrismaModel>;
};
export type EnumStockMovementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMovementType | Prisma.EnumStockMovementTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockMovementTypeFilter<$PrismaModel> | $Enums.StockMovementType;
};
export type EnumStockMovementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMovementType | Prisma.EnumStockMovementTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockMovementTypeWithAggregatesFilter<$PrismaModel> | $Enums.StockMovementType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStockMovementTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStockMovementTypeFilter<$PrismaModel>;
};
export type EnumStockCountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.StockCountType | Prisma.EnumStockCountTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.StockCountType[] | Prisma.ListEnumStockCountTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockCountType[] | Prisma.ListEnumStockCountTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockCountTypeFilter<$PrismaModel> | $Enums.StockCountType;
};
export type EnumStockCountStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.StockCountStatus | Prisma.EnumStockCountStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.StockCountStatus[] | Prisma.ListEnumStockCountStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockCountStatus[] | Prisma.ListEnumStockCountStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockCountStatusFilter<$PrismaModel> | $Enums.StockCountStatus;
};
export type EnumStockCountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockCountType | Prisma.EnumStockCountTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.StockCountType[] | Prisma.ListEnumStockCountTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockCountType[] | Prisma.ListEnumStockCountTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockCountTypeWithAggregatesFilter<$PrismaModel> | $Enums.StockCountType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStockCountTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStockCountTypeFilter<$PrismaModel>;
};
export type EnumStockCountStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockCountStatus | Prisma.EnumStockCountStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.StockCountStatus[] | Prisma.ListEnumStockCountStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockCountStatus[] | Prisma.ListEnumStockCountStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockCountStatusWithAggregatesFilter<$PrismaModel> | $Enums.StockCountStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStockCountStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStockCountStatusFilter<$PrismaModel>;
};
export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type EnumRxSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.RxSource | Prisma.EnumRxSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.RxSource[] | Prisma.ListEnumRxSourceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RxSource[] | Prisma.ListEnumRxSourceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRxSourceFilter<$PrismaModel> | $Enums.RxSource;
};
export type EnumRxStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RxStatus | Prisma.EnumRxStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RxStatus[] | Prisma.ListEnumRxStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RxStatus[] | Prisma.ListEnumRxStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRxStatusFilter<$PrismaModel> | $Enums.RxStatus;
};
export type EnumRxSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RxSource | Prisma.EnumRxSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.RxSource[] | Prisma.ListEnumRxSourceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RxSource[] | Prisma.ListEnumRxSourceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRxSourceWithAggregatesFilter<$PrismaModel> | $Enums.RxSource;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRxSourceFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRxSourceFilter<$PrismaModel>;
};
export type EnumRxStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RxStatus | Prisma.EnumRxStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RxStatus[] | Prisma.ListEnumRxStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RxStatus[] | Prisma.ListEnumRxStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRxStatusWithAggregatesFilter<$PrismaModel> | $Enums.RxStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRxStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRxStatusFilter<$PrismaModel>;
};
export type EnumDispensingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DispensingStatus | Prisma.EnumDispensingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.DispensingStatus[] | Prisma.ListEnumDispensingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DispensingStatus[] | Prisma.ListEnumDispensingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDispensingStatusFilter<$PrismaModel> | $Enums.DispensingStatus;
};
export type EnumDispensingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DispensingStatus | Prisma.EnumDispensingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.DispensingStatus[] | Prisma.ListEnumDispensingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DispensingStatus[] | Prisma.ListEnumDispensingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDispensingStatusWithAggregatesFilter<$PrismaModel> | $Enums.DispensingStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDispensingStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDispensingStatusFilter<$PrismaModel>;
};
export type EnumSafetyCheckKindFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyCheckKind | Prisma.EnumSafetyCheckKindFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyCheckKind[] | Prisma.ListEnumSafetyCheckKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyCheckKind[] | Prisma.ListEnumSafetyCheckKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyCheckKindFilter<$PrismaModel> | $Enums.SafetyCheckKind;
};
export type EnumSafetyCheckOutcomeFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyCheckOutcome | Prisma.EnumSafetyCheckOutcomeFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyCheckOutcome[] | Prisma.ListEnumSafetyCheckOutcomeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyCheckOutcome[] | Prisma.ListEnumSafetyCheckOutcomeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyCheckOutcomeFilter<$PrismaModel> | $Enums.SafetyCheckOutcome;
};
export type EnumSafetyCheckKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyCheckKind | Prisma.EnumSafetyCheckKindFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyCheckKind[] | Prisma.ListEnumSafetyCheckKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyCheckKind[] | Prisma.ListEnumSafetyCheckKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyCheckKindWithAggregatesFilter<$PrismaModel> | $Enums.SafetyCheckKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSafetyCheckKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSafetyCheckKindFilter<$PrismaModel>;
};
export type EnumSafetyCheckOutcomeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyCheckOutcome | Prisma.EnumSafetyCheckOutcomeFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyCheckOutcome[] | Prisma.ListEnumSafetyCheckOutcomeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyCheckOutcome[] | Prisma.ListEnumSafetyCheckOutcomeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyCheckOutcomeWithAggregatesFilter<$PrismaModel> | $Enums.SafetyCheckOutcome;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSafetyCheckOutcomeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSafetyCheckOutcomeFilter<$PrismaModel>;
};
export type EnumShiftStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ShiftStatus | Prisma.EnumShiftStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ShiftStatus[] | Prisma.ListEnumShiftStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ShiftStatus[] | Prisma.ListEnumShiftStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumShiftStatusFilter<$PrismaModel> | $Enums.ShiftStatus;
};
export type EnumShiftStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ShiftStatus | Prisma.EnumShiftStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ShiftStatus[] | Prisma.ListEnumShiftStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ShiftStatus[] | Prisma.ListEnumShiftStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumShiftStatusWithAggregatesFilter<$PrismaModel> | $Enums.ShiftStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumShiftStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumShiftStatusFilter<$PrismaModel>;
};
export type EnumSaleChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.SaleChannel | Prisma.EnumSaleChannelFieldRefInput<$PrismaModel>;
    in?: $Enums.SaleChannel[] | Prisma.ListEnumSaleChannelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SaleChannel[] | Prisma.ListEnumSaleChannelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSaleChannelFilter<$PrismaModel> | $Enums.SaleChannel;
};
export type EnumSaleStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SaleStatus | Prisma.EnumSaleStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSaleStatusFilter<$PrismaModel> | $Enums.SaleStatus;
};
export type EnumSaleChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SaleChannel | Prisma.EnumSaleChannelFieldRefInput<$PrismaModel>;
    in?: $Enums.SaleChannel[] | Prisma.ListEnumSaleChannelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SaleChannel[] | Prisma.ListEnumSaleChannelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSaleChannelWithAggregatesFilter<$PrismaModel> | $Enums.SaleChannel;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSaleChannelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSaleChannelFilter<$PrismaModel>;
};
export type EnumSaleStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SaleStatus | Prisma.EnumSaleStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSaleStatusWithAggregatesFilter<$PrismaModel> | $Enums.SaleStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSaleStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSaleStatusFilter<$PrismaModel>;
};
export type EnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | Prisma.EnumPaymentMethodFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod;
};
export type EnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | Prisma.EnumPaymentMethodFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPaymentMethodFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPaymentMethodFilter<$PrismaModel>;
};
export type EnumOutboxStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OutboxStatus | Prisma.EnumOutboxStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.OutboxStatus[] | Prisma.ListEnumOutboxStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OutboxStatus[] | Prisma.ListEnumOutboxStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumOutboxStatusFilter<$PrismaModel> | $Enums.OutboxStatus;
};
export type EnumOutboxStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OutboxStatus | Prisma.EnumOutboxStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.OutboxStatus[] | Prisma.ListEnumOutboxStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OutboxStatus[] | Prisma.ListEnumOutboxStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumOutboxStatusWithAggregatesFilter<$PrismaModel> | $Enums.OutboxStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumOutboxStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumOutboxStatusFilter<$PrismaModel>;
};
export type EnumSupplierLedgerTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SupplierLedgerType | Prisma.EnumSupplierLedgerTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.SupplierLedgerType[] | Prisma.ListEnumSupplierLedgerTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SupplierLedgerType[] | Prisma.ListEnumSupplierLedgerTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSupplierLedgerTypeFilter<$PrismaModel> | $Enums.SupplierLedgerType;
};
export type EnumSupplierLedgerTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SupplierLedgerType | Prisma.EnumSupplierLedgerTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.SupplierLedgerType[] | Prisma.ListEnumSupplierLedgerTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SupplierLedgerType[] | Prisma.ListEnumSupplierLedgerTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSupplierLedgerTypeWithAggregatesFilter<$PrismaModel> | $Enums.SupplierLedgerType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSupplierLedgerTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSupplierLedgerTypeFilter<$PrismaModel>;
};
export type EnumTransferStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransferStatus | Prisma.EnumTransferStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.TransferStatus[] | Prisma.ListEnumTransferStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TransferStatus[] | Prisma.ListEnumTransferStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTransferStatusFilter<$PrismaModel> | $Enums.TransferStatus;
};
export type EnumTransferStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransferStatus | Prisma.EnumTransferStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.TransferStatus[] | Prisma.ListEnumTransferStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TransferStatus[] | Prisma.ListEnumTransferStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTransferStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransferStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTransferStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTransferStatusFilter<$PrismaModel>;
};
export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    in?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    notIn?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    lt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBigIntFilter<$PrismaModel> | bigint | number;
};
export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    in?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    notIn?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    lt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedBigIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBigIntFilter<$PrismaModel>;
    _max?: Prisma.NestedBigIntFilter<$PrismaModel>;
};
export type EnumKiorexOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.KiorexOrderStatus | Prisma.EnumKiorexOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.KiorexOrderStatus[] | Prisma.ListEnumKiorexOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KiorexOrderStatus[] | Prisma.ListEnumKiorexOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKiorexOrderStatusFilter<$PrismaModel> | $Enums.KiorexOrderStatus;
};
export type EnumKiorexOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KiorexOrderStatus | Prisma.EnumKiorexOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.KiorexOrderStatus[] | Prisma.ListEnumKiorexOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KiorexOrderStatus[] | Prisma.ListEnumKiorexOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKiorexOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.KiorexOrderStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumKiorexOrderStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumKiorexOrderStatusFilter<$PrismaModel>;
};
export type EnumNotificationChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationChannel | Prisma.EnumNotificationChannelFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationChannel[] | Prisma.ListEnumNotificationChannelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationChannel[] | Prisma.ListEnumNotificationChannelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationChannelFilter<$PrismaModel> | $Enums.NotificationChannel;
};
export type EnumNotificationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationStatus | Prisma.EnumNotificationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationStatus[] | Prisma.ListEnumNotificationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationStatus[] | Prisma.ListEnumNotificationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationStatusFilter<$PrismaModel> | $Enums.NotificationStatus;
};
export type EnumNotificationChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationChannel | Prisma.EnumNotificationChannelFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationChannel[] | Prisma.ListEnumNotificationChannelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationChannel[] | Prisma.ListEnumNotificationChannelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationChannelWithAggregatesFilter<$PrismaModel> | $Enums.NotificationChannel;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumNotificationChannelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumNotificationChannelFilter<$PrismaModel>;
};
export type EnumNotificationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationStatus | Prisma.EnumNotificationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationStatus[] | Prisma.ListEnumNotificationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationStatus[] | Prisma.ListEnumNotificationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationStatusWithAggregatesFilter<$PrismaModel> | $Enums.NotificationStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumNotificationStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumNotificationStatusFilter<$PrismaModel>;
};
export type EnumClaimStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | Prisma.EnumClaimStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ClaimStatus[] | Prisma.ListEnumClaimStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ClaimStatus[] | Prisma.ListEnumClaimStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumClaimStatusFilter<$PrismaModel> | $Enums.ClaimStatus;
};
export type EnumClaimStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | Prisma.EnumClaimStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ClaimStatus[] | Prisma.ListEnumClaimStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ClaimStatus[] | Prisma.ListEnumClaimStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumClaimStatusWithAggregatesFilter<$PrismaModel> | $Enums.ClaimStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumClaimStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumClaimStatusFilter<$PrismaModel>;
};
export type EnumPayLinkStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PayLinkStatus | Prisma.EnumPayLinkStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PayLinkStatus[] | Prisma.ListEnumPayLinkStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PayLinkStatus[] | Prisma.ListEnumPayLinkStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPayLinkStatusFilter<$PrismaModel> | $Enums.PayLinkStatus;
};
export type EnumPayLinkStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PayLinkStatus | Prisma.EnumPayLinkStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PayLinkStatus[] | Prisma.ListEnumPayLinkStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PayLinkStatus[] | Prisma.ListEnumPayLinkStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPayLinkStatusWithAggregatesFilter<$PrismaModel> | $Enums.PayLinkStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPayLinkStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPayLinkStatusFilter<$PrismaModel>;
};
export type EnumConsentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentStatus | Prisma.EnumConsentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ConsentStatus[] | Prisma.ListEnumConsentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ConsentStatus[] | Prisma.ListEnumConsentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumConsentStatusFilter<$PrismaModel> | $Enums.ConsentStatus;
};
export type EnumConsentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentStatus | Prisma.EnumConsentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ConsentStatus[] | Prisma.ListEnumConsentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ConsentStatus[] | Prisma.ListEnumConsentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumConsentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ConsentStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumConsentStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumConsentStatusFilter<$PrismaModel>;
};
export type EnumReferralLinkOwnerScopeFilter<$PrismaModel = never> = {
    equals?: $Enums.ReferralLinkOwnerScope | Prisma.EnumReferralLinkOwnerScopeFieldRefInput<$PrismaModel>;
    in?: $Enums.ReferralLinkOwnerScope[] | Prisma.ListEnumReferralLinkOwnerScopeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReferralLinkOwnerScope[] | Prisma.ListEnumReferralLinkOwnerScopeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReferralLinkOwnerScopeFilter<$PrismaModel> | $Enums.ReferralLinkOwnerScope;
};
export type EnumReferralLinkChannelKindFilter<$PrismaModel = never> = {
    equals?: $Enums.ReferralLinkChannelKind | Prisma.EnumReferralLinkChannelKindFieldRefInput<$PrismaModel>;
    in?: $Enums.ReferralLinkChannelKind[] | Prisma.ListEnumReferralLinkChannelKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReferralLinkChannelKind[] | Prisma.ListEnumReferralLinkChannelKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReferralLinkChannelKindFilter<$PrismaModel> | $Enums.ReferralLinkChannelKind;
};
export type EnumReferralLinkStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReferralLinkStatus | Prisma.EnumReferralLinkStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ReferralLinkStatus[] | Prisma.ListEnumReferralLinkStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReferralLinkStatus[] | Prisma.ListEnumReferralLinkStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReferralLinkStatusFilter<$PrismaModel> | $Enums.ReferralLinkStatus;
};
export type EnumReferralLinkOwnerScopeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReferralLinkOwnerScope | Prisma.EnumReferralLinkOwnerScopeFieldRefInput<$PrismaModel>;
    in?: $Enums.ReferralLinkOwnerScope[] | Prisma.ListEnumReferralLinkOwnerScopeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReferralLinkOwnerScope[] | Prisma.ListEnumReferralLinkOwnerScopeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReferralLinkOwnerScopeWithAggregatesFilter<$PrismaModel> | $Enums.ReferralLinkOwnerScope;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumReferralLinkOwnerScopeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumReferralLinkOwnerScopeFilter<$PrismaModel>;
};
export type EnumReferralLinkChannelKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReferralLinkChannelKind | Prisma.EnumReferralLinkChannelKindFieldRefInput<$PrismaModel>;
    in?: $Enums.ReferralLinkChannelKind[] | Prisma.ListEnumReferralLinkChannelKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReferralLinkChannelKind[] | Prisma.ListEnumReferralLinkChannelKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReferralLinkChannelKindWithAggregatesFilter<$PrismaModel> | $Enums.ReferralLinkChannelKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumReferralLinkChannelKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumReferralLinkChannelKindFilter<$PrismaModel>;
};
export type EnumReferralLinkStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReferralLinkStatus | Prisma.EnumReferralLinkStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ReferralLinkStatus[] | Prisma.ListEnumReferralLinkStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReferralLinkStatus[] | Prisma.ListEnumReferralLinkStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReferralLinkStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReferralLinkStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumReferralLinkStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumReferralLinkStatusFilter<$PrismaModel>;
};
export type EnumEditionNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Edition | Prisma.EnumEditionFieldRefInput<$PrismaModel> | null;
    in?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumEditionNullableFilter<$PrismaModel> | $Enums.Edition | null;
};
export type EnumEditionNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Edition | Prisma.EnumEditionFieldRefInput<$PrismaModel> | null;
    in?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumEditionNullableWithAggregatesFilter<$PrismaModel> | $Enums.Edition | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumEditionNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumEditionNullableFilter<$PrismaModel>;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type NestedEnumEditionFilter<$PrismaModel = never> = {
    equals?: $Enums.Edition | Prisma.EnumEditionFieldRefInput<$PrismaModel>;
    in?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEditionFilter<$PrismaModel> | $Enums.Edition;
};
export type NestedEnumSignInMethodNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.SignInMethod | Prisma.EnumSignInMethodFieldRefInput<$PrismaModel> | null;
    in?: $Enums.SignInMethod[] | Prisma.ListEnumSignInMethodFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.SignInMethod[] | Prisma.ListEnumSignInMethodFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumSignInMethodNullableFilter<$PrismaModel> | $Enums.SignInMethod | null;
};
export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type NestedEnumEditionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Edition | Prisma.EnumEditionFieldRefInput<$PrismaModel>;
    in?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEditionWithAggregatesFilter<$PrismaModel> | $Enums.Edition;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumEditionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumEditionFilter<$PrismaModel>;
};
export type NestedEnumSignInMethodNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SignInMethod | Prisma.EnumSignInMethodFieldRefInput<$PrismaModel> | null;
    in?: $Enums.SignInMethod[] | Prisma.ListEnumSignInMethodFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.SignInMethod[] | Prisma.ListEnumSignInMethodFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumSignInMethodNullableWithAggregatesFilter<$PrismaModel> | $Enums.SignInMethod | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSignInMethodNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSignInMethodNullableFilter<$PrismaModel>;
};
export type NestedJsonNullableFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>, Required<NestedJsonNullableFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>;
export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type NestedEnumStaffRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.StaffRole | Prisma.EnumStaffRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.StaffRole[] | Prisma.ListEnumStaffRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StaffRole[] | Prisma.ListEnumStaffRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStaffRoleFilter<$PrismaModel> | $Enums.StaffRole;
};
export type NestedEnumStaffRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StaffRole | Prisma.EnumStaffRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.StaffRole[] | Prisma.ListEnumStaffRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StaffRole[] | Prisma.ListEnumStaffRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStaffRoleWithAggregatesFilter<$PrismaModel> | $Enums.StaffRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStaffRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStaffRoleFilter<$PrismaModel>;
};
export type NestedJsonFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>, Required<NestedJsonFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>;
export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type NestedEnumControlledScheduleFilter<$PrismaModel = never> = {
    equals?: $Enums.ControlledSchedule | Prisma.EnumControlledScheduleFieldRefInput<$PrismaModel>;
    in?: $Enums.ControlledSchedule[] | Prisma.ListEnumControlledScheduleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ControlledSchedule[] | Prisma.ListEnumControlledScheduleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumControlledScheduleFilter<$PrismaModel> | $Enums.ControlledSchedule;
};
export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type NestedEnumControlledScheduleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ControlledSchedule | Prisma.EnumControlledScheduleFieldRefInput<$PrismaModel>;
    in?: $Enums.ControlledSchedule[] | Prisma.ListEnumControlledScheduleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ControlledSchedule[] | Prisma.ListEnumControlledScheduleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumControlledScheduleWithAggregatesFilter<$PrismaModel> | $Enums.ControlledSchedule;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumControlledScheduleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumControlledScheduleFilter<$PrismaModel>;
};
export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
};
export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type NestedEnumPurchaseOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PurchaseOrderStatus | Prisma.EnumPurchaseOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PurchaseOrderStatus[] | Prisma.ListEnumPurchaseOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PurchaseOrderStatus[] | Prisma.ListEnumPurchaseOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPurchaseOrderStatusFilter<$PrismaModel> | $Enums.PurchaseOrderStatus;
};
export type NestedEnumPurchaseOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PurchaseOrderStatus | Prisma.EnumPurchaseOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PurchaseOrderStatus[] | Prisma.ListEnumPurchaseOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PurchaseOrderStatus[] | Prisma.ListEnumPurchaseOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPurchaseOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.PurchaseOrderStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPurchaseOrderStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPurchaseOrderStatusFilter<$PrismaModel>;
};
export type NestedEnumRecallStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RecallStatus | Prisma.EnumRecallStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RecallStatus[] | Prisma.ListEnumRecallStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RecallStatus[] | Prisma.ListEnumRecallStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRecallStatusFilter<$PrismaModel> | $Enums.RecallStatus;
};
export type NestedEnumRecallStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RecallStatus | Prisma.EnumRecallStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RecallStatus[] | Prisma.ListEnumRecallStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RecallStatus[] | Prisma.ListEnumRecallStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRecallStatusWithAggregatesFilter<$PrismaModel> | $Enums.RecallStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRecallStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRecallStatusFilter<$PrismaModel>;
};
export type NestedEnumLotStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LotStatus | Prisma.EnumLotStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLotStatusFilter<$PrismaModel> | $Enums.LotStatus;
};
export type NestedEnumLotStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.LotStatus | Prisma.EnumLotStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumLotStatusNullableFilter<$PrismaModel> | $Enums.LotStatus | null;
};
export type NestedEnumLotStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LotStatus | Prisma.EnumLotStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLotStatusWithAggregatesFilter<$PrismaModel> | $Enums.LotStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLotStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLotStatusFilter<$PrismaModel>;
};
export type NestedEnumLotStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LotStatus | Prisma.EnumLotStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.LotStatus[] | Prisma.ListEnumLotStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumLotStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.LotStatus | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLotStatusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLotStatusNullableFilter<$PrismaModel>;
};
export type NestedEnumStockMovementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMovementType | Prisma.EnumStockMovementTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockMovementTypeFilter<$PrismaModel> | $Enums.StockMovementType;
};
export type NestedEnumStockMovementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMovementType | Prisma.EnumStockMovementTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockMovementTypeWithAggregatesFilter<$PrismaModel> | $Enums.StockMovementType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStockMovementTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStockMovementTypeFilter<$PrismaModel>;
};
export type NestedEnumStockCountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.StockCountType | Prisma.EnumStockCountTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.StockCountType[] | Prisma.ListEnumStockCountTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockCountType[] | Prisma.ListEnumStockCountTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockCountTypeFilter<$PrismaModel> | $Enums.StockCountType;
};
export type NestedEnumStockCountStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.StockCountStatus | Prisma.EnumStockCountStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.StockCountStatus[] | Prisma.ListEnumStockCountStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockCountStatus[] | Prisma.ListEnumStockCountStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockCountStatusFilter<$PrismaModel> | $Enums.StockCountStatus;
};
export type NestedEnumStockCountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockCountType | Prisma.EnumStockCountTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.StockCountType[] | Prisma.ListEnumStockCountTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockCountType[] | Prisma.ListEnumStockCountTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockCountTypeWithAggregatesFilter<$PrismaModel> | $Enums.StockCountType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStockCountTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStockCountTypeFilter<$PrismaModel>;
};
export type NestedEnumStockCountStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockCountStatus | Prisma.EnumStockCountStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.StockCountStatus[] | Prisma.ListEnumStockCountStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockCountStatus[] | Prisma.ListEnumStockCountStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockCountStatusWithAggregatesFilter<$PrismaModel> | $Enums.StockCountStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStockCountStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStockCountStatusFilter<$PrismaModel>;
};
export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null;
};
export type NestedEnumRxSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.RxSource | Prisma.EnumRxSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.RxSource[] | Prisma.ListEnumRxSourceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RxSource[] | Prisma.ListEnumRxSourceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRxSourceFilter<$PrismaModel> | $Enums.RxSource;
};
export type NestedEnumRxStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RxStatus | Prisma.EnumRxStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RxStatus[] | Prisma.ListEnumRxStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RxStatus[] | Prisma.ListEnumRxStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRxStatusFilter<$PrismaModel> | $Enums.RxStatus;
};
export type NestedEnumRxSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RxSource | Prisma.EnumRxSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.RxSource[] | Prisma.ListEnumRxSourceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RxSource[] | Prisma.ListEnumRxSourceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRxSourceWithAggregatesFilter<$PrismaModel> | $Enums.RxSource;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRxSourceFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRxSourceFilter<$PrismaModel>;
};
export type NestedEnumRxStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RxStatus | Prisma.EnumRxStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RxStatus[] | Prisma.ListEnumRxStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RxStatus[] | Prisma.ListEnumRxStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRxStatusWithAggregatesFilter<$PrismaModel> | $Enums.RxStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRxStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRxStatusFilter<$PrismaModel>;
};
export type NestedEnumDispensingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DispensingStatus | Prisma.EnumDispensingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.DispensingStatus[] | Prisma.ListEnumDispensingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DispensingStatus[] | Prisma.ListEnumDispensingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDispensingStatusFilter<$PrismaModel> | $Enums.DispensingStatus;
};
export type NestedEnumDispensingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DispensingStatus | Prisma.EnumDispensingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.DispensingStatus[] | Prisma.ListEnumDispensingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DispensingStatus[] | Prisma.ListEnumDispensingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDispensingStatusWithAggregatesFilter<$PrismaModel> | $Enums.DispensingStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDispensingStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDispensingStatusFilter<$PrismaModel>;
};
export type NestedEnumSafetyCheckKindFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyCheckKind | Prisma.EnumSafetyCheckKindFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyCheckKind[] | Prisma.ListEnumSafetyCheckKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyCheckKind[] | Prisma.ListEnumSafetyCheckKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyCheckKindFilter<$PrismaModel> | $Enums.SafetyCheckKind;
};
export type NestedEnumSafetyCheckOutcomeFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyCheckOutcome | Prisma.EnumSafetyCheckOutcomeFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyCheckOutcome[] | Prisma.ListEnumSafetyCheckOutcomeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyCheckOutcome[] | Prisma.ListEnumSafetyCheckOutcomeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyCheckOutcomeFilter<$PrismaModel> | $Enums.SafetyCheckOutcome;
};
export type NestedEnumSafetyCheckKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyCheckKind | Prisma.EnumSafetyCheckKindFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyCheckKind[] | Prisma.ListEnumSafetyCheckKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyCheckKind[] | Prisma.ListEnumSafetyCheckKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyCheckKindWithAggregatesFilter<$PrismaModel> | $Enums.SafetyCheckKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSafetyCheckKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSafetyCheckKindFilter<$PrismaModel>;
};
export type NestedEnumSafetyCheckOutcomeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyCheckOutcome | Prisma.EnumSafetyCheckOutcomeFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyCheckOutcome[] | Prisma.ListEnumSafetyCheckOutcomeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyCheckOutcome[] | Prisma.ListEnumSafetyCheckOutcomeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyCheckOutcomeWithAggregatesFilter<$PrismaModel> | $Enums.SafetyCheckOutcome;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSafetyCheckOutcomeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSafetyCheckOutcomeFilter<$PrismaModel>;
};
export type NestedEnumShiftStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ShiftStatus | Prisma.EnumShiftStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ShiftStatus[] | Prisma.ListEnumShiftStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ShiftStatus[] | Prisma.ListEnumShiftStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumShiftStatusFilter<$PrismaModel> | $Enums.ShiftStatus;
};
export type NestedEnumShiftStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ShiftStatus | Prisma.EnumShiftStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ShiftStatus[] | Prisma.ListEnumShiftStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ShiftStatus[] | Prisma.ListEnumShiftStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumShiftStatusWithAggregatesFilter<$PrismaModel> | $Enums.ShiftStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumShiftStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumShiftStatusFilter<$PrismaModel>;
};
export type NestedEnumSaleChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.SaleChannel | Prisma.EnumSaleChannelFieldRefInput<$PrismaModel>;
    in?: $Enums.SaleChannel[] | Prisma.ListEnumSaleChannelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SaleChannel[] | Prisma.ListEnumSaleChannelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSaleChannelFilter<$PrismaModel> | $Enums.SaleChannel;
};
export type NestedEnumSaleStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SaleStatus | Prisma.EnumSaleStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSaleStatusFilter<$PrismaModel> | $Enums.SaleStatus;
};
export type NestedEnumSaleChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SaleChannel | Prisma.EnumSaleChannelFieldRefInput<$PrismaModel>;
    in?: $Enums.SaleChannel[] | Prisma.ListEnumSaleChannelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SaleChannel[] | Prisma.ListEnumSaleChannelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSaleChannelWithAggregatesFilter<$PrismaModel> | $Enums.SaleChannel;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSaleChannelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSaleChannelFilter<$PrismaModel>;
};
export type NestedEnumSaleStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SaleStatus | Prisma.EnumSaleStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSaleStatusWithAggregatesFilter<$PrismaModel> | $Enums.SaleStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSaleStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSaleStatusFilter<$PrismaModel>;
};
export type NestedEnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | Prisma.EnumPaymentMethodFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod;
};
export type NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | Prisma.EnumPaymentMethodFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPaymentMethodFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPaymentMethodFilter<$PrismaModel>;
};
export type NestedEnumOutboxStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OutboxStatus | Prisma.EnumOutboxStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.OutboxStatus[] | Prisma.ListEnumOutboxStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OutboxStatus[] | Prisma.ListEnumOutboxStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumOutboxStatusFilter<$PrismaModel> | $Enums.OutboxStatus;
};
export type NestedEnumOutboxStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OutboxStatus | Prisma.EnumOutboxStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.OutboxStatus[] | Prisma.ListEnumOutboxStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OutboxStatus[] | Prisma.ListEnumOutboxStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumOutboxStatusWithAggregatesFilter<$PrismaModel> | $Enums.OutboxStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumOutboxStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumOutboxStatusFilter<$PrismaModel>;
};
export type NestedEnumSupplierLedgerTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SupplierLedgerType | Prisma.EnumSupplierLedgerTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.SupplierLedgerType[] | Prisma.ListEnumSupplierLedgerTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SupplierLedgerType[] | Prisma.ListEnumSupplierLedgerTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSupplierLedgerTypeFilter<$PrismaModel> | $Enums.SupplierLedgerType;
};
export type NestedEnumSupplierLedgerTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SupplierLedgerType | Prisma.EnumSupplierLedgerTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.SupplierLedgerType[] | Prisma.ListEnumSupplierLedgerTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SupplierLedgerType[] | Prisma.ListEnumSupplierLedgerTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSupplierLedgerTypeWithAggregatesFilter<$PrismaModel> | $Enums.SupplierLedgerType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSupplierLedgerTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSupplierLedgerTypeFilter<$PrismaModel>;
};
export type NestedEnumTransferStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransferStatus | Prisma.EnumTransferStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.TransferStatus[] | Prisma.ListEnumTransferStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TransferStatus[] | Prisma.ListEnumTransferStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTransferStatusFilter<$PrismaModel> | $Enums.TransferStatus;
};
export type NestedEnumTransferStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransferStatus | Prisma.EnumTransferStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.TransferStatus[] | Prisma.ListEnumTransferStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TransferStatus[] | Prisma.ListEnumTransferStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTransferStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransferStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTransferStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTransferStatusFilter<$PrismaModel>;
};
export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    in?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    notIn?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    lt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBigIntFilter<$PrismaModel> | bigint | number;
};
export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    in?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    notIn?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    lt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedBigIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBigIntFilter<$PrismaModel>;
    _max?: Prisma.NestedBigIntFilter<$PrismaModel>;
};
export type NestedEnumKiorexOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.KiorexOrderStatus | Prisma.EnumKiorexOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.KiorexOrderStatus[] | Prisma.ListEnumKiorexOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KiorexOrderStatus[] | Prisma.ListEnumKiorexOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKiorexOrderStatusFilter<$PrismaModel> | $Enums.KiorexOrderStatus;
};
export type NestedEnumKiorexOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KiorexOrderStatus | Prisma.EnumKiorexOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.KiorexOrderStatus[] | Prisma.ListEnumKiorexOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KiorexOrderStatus[] | Prisma.ListEnumKiorexOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKiorexOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.KiorexOrderStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumKiorexOrderStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumKiorexOrderStatusFilter<$PrismaModel>;
};
export type NestedEnumNotificationChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationChannel | Prisma.EnumNotificationChannelFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationChannel[] | Prisma.ListEnumNotificationChannelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationChannel[] | Prisma.ListEnumNotificationChannelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationChannelFilter<$PrismaModel> | $Enums.NotificationChannel;
};
export type NestedEnumNotificationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationStatus | Prisma.EnumNotificationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationStatus[] | Prisma.ListEnumNotificationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationStatus[] | Prisma.ListEnumNotificationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationStatusFilter<$PrismaModel> | $Enums.NotificationStatus;
};
export type NestedEnumNotificationChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationChannel | Prisma.EnumNotificationChannelFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationChannel[] | Prisma.ListEnumNotificationChannelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationChannel[] | Prisma.ListEnumNotificationChannelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationChannelWithAggregatesFilter<$PrismaModel> | $Enums.NotificationChannel;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumNotificationChannelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumNotificationChannelFilter<$PrismaModel>;
};
export type NestedEnumNotificationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationStatus | Prisma.EnumNotificationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationStatus[] | Prisma.ListEnumNotificationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationStatus[] | Prisma.ListEnumNotificationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationStatusWithAggregatesFilter<$PrismaModel> | $Enums.NotificationStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumNotificationStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumNotificationStatusFilter<$PrismaModel>;
};
export type NestedEnumClaimStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | Prisma.EnumClaimStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ClaimStatus[] | Prisma.ListEnumClaimStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ClaimStatus[] | Prisma.ListEnumClaimStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumClaimStatusFilter<$PrismaModel> | $Enums.ClaimStatus;
};
export type NestedEnumClaimStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | Prisma.EnumClaimStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ClaimStatus[] | Prisma.ListEnumClaimStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ClaimStatus[] | Prisma.ListEnumClaimStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumClaimStatusWithAggregatesFilter<$PrismaModel> | $Enums.ClaimStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumClaimStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumClaimStatusFilter<$PrismaModel>;
};
export type NestedEnumPayLinkStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PayLinkStatus | Prisma.EnumPayLinkStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PayLinkStatus[] | Prisma.ListEnumPayLinkStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PayLinkStatus[] | Prisma.ListEnumPayLinkStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPayLinkStatusFilter<$PrismaModel> | $Enums.PayLinkStatus;
};
export type NestedEnumPayLinkStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PayLinkStatus | Prisma.EnumPayLinkStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PayLinkStatus[] | Prisma.ListEnumPayLinkStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PayLinkStatus[] | Prisma.ListEnumPayLinkStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPayLinkStatusWithAggregatesFilter<$PrismaModel> | $Enums.PayLinkStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPayLinkStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPayLinkStatusFilter<$PrismaModel>;
};
export type NestedEnumConsentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentStatus | Prisma.EnumConsentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ConsentStatus[] | Prisma.ListEnumConsentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ConsentStatus[] | Prisma.ListEnumConsentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumConsentStatusFilter<$PrismaModel> | $Enums.ConsentStatus;
};
export type NestedEnumConsentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentStatus | Prisma.EnumConsentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ConsentStatus[] | Prisma.ListEnumConsentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ConsentStatus[] | Prisma.ListEnumConsentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumConsentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ConsentStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumConsentStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumConsentStatusFilter<$PrismaModel>;
};
export type NestedEnumReferralLinkOwnerScopeFilter<$PrismaModel = never> = {
    equals?: $Enums.ReferralLinkOwnerScope | Prisma.EnumReferralLinkOwnerScopeFieldRefInput<$PrismaModel>;
    in?: $Enums.ReferralLinkOwnerScope[] | Prisma.ListEnumReferralLinkOwnerScopeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReferralLinkOwnerScope[] | Prisma.ListEnumReferralLinkOwnerScopeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReferralLinkOwnerScopeFilter<$PrismaModel> | $Enums.ReferralLinkOwnerScope;
};
export type NestedEnumReferralLinkChannelKindFilter<$PrismaModel = never> = {
    equals?: $Enums.ReferralLinkChannelKind | Prisma.EnumReferralLinkChannelKindFieldRefInput<$PrismaModel>;
    in?: $Enums.ReferralLinkChannelKind[] | Prisma.ListEnumReferralLinkChannelKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReferralLinkChannelKind[] | Prisma.ListEnumReferralLinkChannelKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReferralLinkChannelKindFilter<$PrismaModel> | $Enums.ReferralLinkChannelKind;
};
export type NestedEnumReferralLinkStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReferralLinkStatus | Prisma.EnumReferralLinkStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ReferralLinkStatus[] | Prisma.ListEnumReferralLinkStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReferralLinkStatus[] | Prisma.ListEnumReferralLinkStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReferralLinkStatusFilter<$PrismaModel> | $Enums.ReferralLinkStatus;
};
export type NestedEnumReferralLinkOwnerScopeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReferralLinkOwnerScope | Prisma.EnumReferralLinkOwnerScopeFieldRefInput<$PrismaModel>;
    in?: $Enums.ReferralLinkOwnerScope[] | Prisma.ListEnumReferralLinkOwnerScopeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReferralLinkOwnerScope[] | Prisma.ListEnumReferralLinkOwnerScopeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReferralLinkOwnerScopeWithAggregatesFilter<$PrismaModel> | $Enums.ReferralLinkOwnerScope;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumReferralLinkOwnerScopeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumReferralLinkOwnerScopeFilter<$PrismaModel>;
};
export type NestedEnumReferralLinkChannelKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReferralLinkChannelKind | Prisma.EnumReferralLinkChannelKindFieldRefInput<$PrismaModel>;
    in?: $Enums.ReferralLinkChannelKind[] | Prisma.ListEnumReferralLinkChannelKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReferralLinkChannelKind[] | Prisma.ListEnumReferralLinkChannelKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReferralLinkChannelKindWithAggregatesFilter<$PrismaModel> | $Enums.ReferralLinkChannelKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumReferralLinkChannelKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumReferralLinkChannelKindFilter<$PrismaModel>;
};
export type NestedEnumReferralLinkStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReferralLinkStatus | Prisma.EnumReferralLinkStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ReferralLinkStatus[] | Prisma.ListEnumReferralLinkStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReferralLinkStatus[] | Prisma.ListEnumReferralLinkStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReferralLinkStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReferralLinkStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumReferralLinkStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumReferralLinkStatusFilter<$PrismaModel>;
};
export type NestedEnumEditionNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Edition | Prisma.EnumEditionFieldRefInput<$PrismaModel> | null;
    in?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumEditionNullableFilter<$PrismaModel> | $Enums.Edition | null;
};
export type NestedEnumEditionNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Edition | Prisma.EnumEditionFieldRefInput<$PrismaModel> | null;
    in?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.Edition[] | Prisma.ListEnumEditionFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumEditionNullableWithAggregatesFilter<$PrismaModel> | $Enums.Edition | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumEditionNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumEditionNullableFilter<$PrismaModel>;
};
