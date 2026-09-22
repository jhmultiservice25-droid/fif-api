import { Controller, Get, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { ApiOkData, ApiStandardErrors } from "../http/envelope";
import { SessionUserData } from "../http/models";
import { SessionAuth } from "./admin-auth";

@ApiTags("Auth")
@ApiStandardErrors()
@Controller()
export class MeController {
  @SessionAuth()
  @Get("me")
  @ApiOperation({ summary: "Session courante (tous rôles)" })
  @ApiOkData(SessionUserData, "Compte lié au cookie de session.")
  me(@Req() request: Request & { user?: SessionUserData }) {
    const user = request.user;
    if (!user) {
      return { id: "", email: "", role: "" };
    }
    return user;
  }
}
