import { Body, Controller, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { OrganizationAuth } from "../auth/admin-auth";
import { ApiCreatedData, ApiOkData, ApiStandardErrors } from "../http/envelope";
import {
  OrganizationNeedResponse,
  OrganizationProfileResponse,
} from "../http/models";
import { PatchOrganizationProfileDto, UpsertNeedDto } from "./organizations.dto";
import { OrganizationsService } from "./organizations.service";

type Authed = Request & { user?: { id: string } };

@ApiTags("Organisation")
@ApiStandardErrors()
@OrganizationAuth()
@Controller("me")
export class OrganizationsController {
  constructor(private readonly organizations: OrganizationsService) {}

  @Get("organization")
  @ApiOperation({ summary: "Profil organisation" })
  @ApiOkData(OrganizationProfileResponse)
  profile(@Req() request: Authed) {
    return this.organizations.profile(request.user.id);
  }

  @Patch("organization")
  @ApiOperation({ summary: "Mettre à jour le profil organisation" })
  @ApiOkData(OrganizationProfileResponse)
  patchProfile(@Req() request: Authed, @Body() body: PatchOrganizationProfileDto) {
    return this.organizations.patchProfile(request.user.id, body);
  }

  @Get("needs")
  @ApiOperation({ summary: "Lister mes fiches besoin" })
  @ApiOkData([OrganizationNeedResponse])
  listNeeds(@Req() request: Authed) {
    return this.organizations.listNeeds(request.user.id);
  }

  @Post("needs")
  @ApiOperation({ summary: "Créer une fiche besoin" })
  @ApiCreatedData(OrganizationNeedResponse)
  createNeed(@Req() request: Authed, @Body() body: UpsertNeedDto) {
    return this.organizations.createNeed(request.user.id, body);
  }

  @Get("needs/:id")
  @ApiOperation({ summary: "Détail d’une fiche besoin" })
  @ApiOkData(OrganizationNeedResponse)
  getNeed(@Req() request: Authed, @Param("id") id: string) {
    return this.organizations.getNeed(request.user.id, id);
  }

  @Patch("needs/:id")
  @ApiOperation({ summary: "Mettre à jour une fiche besoin" })
  @ApiOkData(OrganizationNeedResponse)
  patchNeed(@Req() request: Authed, @Param("id") id: string, @Body() body: UpsertNeedDto) {
    return this.organizations.patchNeed(request.user.id, id, body);
  }
}
