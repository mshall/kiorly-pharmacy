import type { Permission } from "./permissions";
export declare const IS_PUBLIC = "kx:public";
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
export declare const REQUIRES_PERM = "kx:perm";
export declare const Perm: (...p: Permission[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
