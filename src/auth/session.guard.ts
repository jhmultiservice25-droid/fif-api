import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { AUTH, type AppAuth } from "./auth";

type AuthedRequest = Request & {
  user?: { id: string; email: string; role?: string };
};

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(@Inject(AUTH) private readonly auth: AppAuth) {}

  async canActivate(context: ExecutionContext) {
    const { fromNodeHeaders } = await import("better-auth/node");
    const request = context.switchToHttp().getRequest<AuthedRequest>();
    const session = await this.auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });
    if (!session?.user) {
      throw new UnauthorizedException("Non authentifié.");
    }
    const role = "role" in session.user ? String(session.user.role) : "";
    request.user = {
      id: session.user.id,
      email: session.user.email,
      role,
    };
    return true;
  }
}
