import { Controller, Get, Post, Query, Req } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { ParticipantAuth } from "../auth/admin-auth";
import { ApiOkData, ApiStandardErrors } from "../http/envelope";
import { MatchResponse } from "../http/models";
import { MatchingService } from "./matching.service";

type Authed = Request & { user?: { id: string; role?: string } };

@ApiTags("Matching")
@ApiStandardErrors()
@ParticipantAuth()
@Controller("me/matches")
export class MatchingController {
  constructor(private readonly matching: MatchingService) {}

  @Get()
  @ApiOperation({ summary: "Correspondances stockées pour mon espace" })
  @ApiOkData([MatchResponse])
  list(@Req() request: Authed) {
    return this.matching.listForUser(request.user);
  }

  @Post("compute")
  @ApiOperation({ summary: "Relancer le matching OpenAI (à la demande)" })
  @ApiQuery({ name: "force", required: false, type: Boolean })
  @ApiOkData([MatchResponse])
  compute(@Req() request: Authed, @Query("force") force?: string) {
    return this.matching.computeForUser(request.user, force === "true" || force === "1");
  }
}
