import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { ROLES_KEY } from "./roles";

type AuthedRequest = Request & { user?: { role?: string } };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) {
      return true;
    }
    const role = context.switchToHttp().getRequest<AuthedRequest>().user?.role;
    if (!role || !roles.includes(role)) {
      throw new ForbiddenException("Accès refusé.");
    }
    return true;
  }
}
