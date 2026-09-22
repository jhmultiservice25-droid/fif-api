import { Controller, Get, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { ApiOkData, ApiStandardErrors } from "../http/envelope";
import { SessionUserData } from "../http/models";
import { AdminAuth } from "./admin-auth";

@ApiTags("Auth")
@ApiStandardErrors()
@Controller("admin")
export class AuthController {
  @AdminAuth()
  @Get("me")
  @ApiOperation({ summary: "Session staff courante" })
  @ApiOkData(SessionUserData, "Compte admin lié au cookie de session.")
  me(@Req() request: Request & { user?: SessionUserData }) {
    const user = request.user;
    if (!user) {
      return { id: "", email: "", role: "ADMIN" };
    }
    return user;
  }
}
