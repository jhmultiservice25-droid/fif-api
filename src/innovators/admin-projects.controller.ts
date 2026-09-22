import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminAuth } from "../auth/admin-auth";
import { ApiOkData, ApiStandardErrors } from "../http/envelope";
import { InnovatorProjectResponse, ProjectListPage } from "../http/models";
import { MarketplaceListQueryDto } from "../organizations/organizations.dto";
import { InnovatorsService } from "./innovators.service";

@ApiTags("Admin")
@ApiStandardErrors()
@AdminAuth()
@Controller("admin/projects")
export class AdminProjectsController {
  constructor(private readonly innovators: InnovatorsService) {}

  @Get()
  @ApiOperation({ summary: "Lister les projets innovateurs" })
  @ApiOkData(ProjectListPage)
  list(@Query() query: MarketplaceListQueryDto) {
    return this.innovators.adminList(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Détail d’un projet" })
  @ApiOkData(InnovatorProjectResponse)
  one(@Param("id") id: string) {
    return this.innovators.adminGet(id);
  }
}
