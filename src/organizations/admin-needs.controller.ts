import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminAuth } from "../auth/admin-auth";
import { ApiOkData, ApiStandardErrors } from "../http/envelope";
import { NeedListPage, OrganizationNeedResponse } from "../http/models";
import { MarketplaceListQueryDto } from "./organizations.dto";
import { OrganizationsService } from "./organizations.service";

@ApiTags("Admin")
@ApiStandardErrors()
@AdminAuth()
@Controller("admin/needs")
export class AdminNeedsController {
  constructor(private readonly organizations: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: "Lister les fiches besoin" })
  @ApiOkData(NeedListPage)
  list(@Query() query: MarketplaceListQueryDto) {
    return this.organizations.adminList(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Détail d’une fiche besoin" })
  @ApiOkData(OrganizationNeedResponse)
  one(@Param("id") id: string) {
    return this.organizations.adminGet(id);
  }
}
