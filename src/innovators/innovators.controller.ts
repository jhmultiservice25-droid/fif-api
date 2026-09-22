import { Body, Controller, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { InnovatorAuth } from "../auth/admin-auth";
import { ApiCreatedData, ApiOkData, ApiStandardErrors } from "../http/envelope";
import { InnovatorProfileResponse, InnovatorProjectResponse } from "../http/models";
import { PatchInnovatorProfileDto, UpsertProjectDto } from "./innovators.dto";
import { InnovatorsService } from "./innovators.service";

type Authed = Request & { user?: { id: string } };

@ApiTags("Innovateur")
@ApiStandardErrors()
@InnovatorAuth()
@Controller("me")
export class InnovatorsController {
  constructor(private readonly innovators: InnovatorsService) {}

  @Get("innovator")
  @ApiOperation({ summary: "Profil innovateur" })
  @ApiOkData(InnovatorProfileResponse)
  profile(@Req() request: Authed) {
    return this.innovators.profile(request.user.id);
  }

  @Patch("innovator")
  @ApiOperation({ summary: "Mettre à jour le profil innovateur" })
  @ApiOkData(InnovatorProfileResponse)
  patchProfile(@Req() request: Authed, @Body() body: PatchInnovatorProfileDto) {
    return this.innovators.patchProfile(request.user.id, body);
  }

  @Get("projects")
  @ApiOperation({ summary: "Lister mes projets" })
  @ApiOkData([InnovatorProjectResponse])
  listProjects(@Req() request: Authed) {
    return this.innovators.listProjects(request.user.id);
  }

  @Post("projects")
  @ApiOperation({ summary: "Créer un projet / une solution" })
  @ApiCreatedData(InnovatorProjectResponse)
  createProject(@Req() request: Authed, @Body() body: UpsertProjectDto) {
    return this.innovators.createProject(request.user.id, body);
  }

  @Get("projects/:id")
  @ApiOperation({ summary: "Détail d’un projet" })
  @ApiOkData(InnovatorProjectResponse)
  getProject(@Req() request: Authed, @Param("id") id: string) {
    return this.innovators.getProject(request.user.id, id);
  }

  @Patch("projects/:id")
  @ApiOperation({ summary: "Mettre à jour un projet" })
  @ApiOkData(InnovatorProjectResponse)
  patchProject(@Req() request: Authed, @Param("id") id: string, @Body() body: UpsertProjectDto) {
    return this.innovators.patchProject(request.user.id, id, body);
  }
}
