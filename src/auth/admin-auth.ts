import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiCookieAuth } from "@nestjs/swagger";
import { ROLES_KEY } from "./roles";
import { RolesGuard } from "./roles.guard";
import { SessionAuthGuard } from "./session.guard";

function RoleAuth(...roles: string[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(SessionAuthGuard, RolesGuard),
    ApiCookieAuth("session"),
  );
}

/** Any signed-in Better Auth session. */
export function SessionAuth() {
  return applyDecorators(UseGuards(SessionAuthGuard), ApiCookieAuth("session"));
}

/** Staff-only: Better Auth session cookie. */
export function AdminAuth() {
  return RoleAuth("ADMIN");
}

export function OrganizationAuth() {
  return RoleAuth("ORGANIZATION");
}

export function InnovatorAuth() {
  return RoleAuth("INNOVATOR");
}

/** Organisation or innovateur space (not staff). */
export function ParticipantAuth() {
  return RoleAuth("ORGANIZATION", "INNOVATOR");
}
