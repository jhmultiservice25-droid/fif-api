import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminAuth } from "../auth/admin-auth";
import { ApiOkData, ApiStandardErrors } from "../http/envelope";
import { MatchResponse } from "../http/models";
import { AdminComputeDto } from "./matching.dto";
import { MatchingService } from "./matching.service";

@ApiTags("Admin")
@ApiStandardErrors()
@AdminAuth()
@Controller("admin/matches")
export class AdminMatchingController {
  constructor(private readonly matching: MatchingService) {}

  @Get()
  @ApiOperation({ summary: "Lister les correspondances" })
  @ApiOkData([MatchResponse])
  list() {
    return this.matching.adminList();
  }

  @Post("compute")
  @ApiOperation({ summary: "Relancer le matching (staff)" })
  @ApiOkData([MatchResponse])
  compute(@Body() body: AdminComputeDto) {
    return this.matching.adminCompute({
      needId: body.needId,
      projectId: body.projectId,
      force: body.force,
    });
  }
}
