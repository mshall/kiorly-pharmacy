import { SetMetadata, createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { Permission } from "./permissions";
import type { AuthUser } from "./auth-user";

export const IS_PUBLIC = "kx:public";
/** Marks a route as unauthenticated (health, login, HMAC-authenticated machine endpoints that verify their own signature). */
export const Public = () => SetMetadata(IS_PUBLIC, true);

export const REQUIRES_PERM = "kx:perm";
/** All listed permissions are required. */
export const Perm = (...p: Permission[]) => SetMetadata(REQUIRES_PERM, p);

export const CurrentUser = createParamDecorator((_d: unknown, ctx: ExecutionContext): AuthUser => ctx.switchToHttp().getRequest().user);
