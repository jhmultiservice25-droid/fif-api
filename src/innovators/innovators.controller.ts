import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { randomUUID } from "node:crypto";
import { extname, join } from "node:path";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { InnovatorAuth } from "../auth/admin-auth";
import { ApiCreatedData, ApiOkData, ApiStandardErrors } from "../http/envelope";
import { InnovatorProfileResponse, InnovatorProjectResponse } from "../http/models";
import { PatchInnovatorProfileDto, UpsertProjectDto } from "./innovators.dto";
import { assertCampaignOpen } from "../campaign";

const uploadDir = process.env.UPLOAD_DIR ?? "./data/uploads";
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


  @Post("projects/:id/pitch-video")
  @ApiOperation({ summary: "Téléverser la vidéo pitch obligatoire de la solution (2 minutes maximum)" })
  @UseInterceptors(
    FileInterceptor("video", {
      storage: diskStorage({
        destination: uploadDir,
        filename: (_req, file, cb) =>
          cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`),
      }),
      limits: { fileSize: 100 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("video/")) {
          cb(new BadRequestException("Le fichier doit être une vidéo."), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  uploadPitchVideo(
    @Req() request: Authed,
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    assertCampaignOpen("innovation");
    if (!file) throw new BadRequestException("La vidéo de présentation est obligatoire.");
    return this.innovators.attachPitchVideo(
      request.user.id,
      id,
      join(uploadDir, file.filename),
      file.originalname,
    );
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
