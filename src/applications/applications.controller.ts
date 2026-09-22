import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import type { Response } from "express";
import { diskStorage } from "multer";
import { randomUUID } from "node:crypto";
import { extname, join } from "node:path";
import { AdminAuth } from "../auth/admin-auth";
import {
  ApiCreatedData,
  ApiOkData,
  ApiOkOneOf,
  ApiStandardErrors,
  SkipEnvelope,
} from "../http/envelope";
import {
  AdminStatsResponse,
  ApplicationListPage,
  CommitteeApplicationDetail,
  CommitteeApplicationRecord,
  ParticipantRegistrationRecord,
  VolunteerApplicationDetail,
  VolunteerApplicationRecord,
} from "../http/models";
import { ApplicationsService } from "./applications.service";
import {
  CommitteeApplicationDto,
  ListQueryDto,
  ParticipantRegistrationDto,
  PatchApplicationDto,
  VolunteerApplicationDto,
} from "./dto";

const uploadDir = process.env.UPLOAD_DIR ?? "./data/uploads";

@Controller()
@ApiStandardErrors()
@ApiExtraModels(CommitteeApplicationDto, VolunteerApplicationDto, PatchApplicationDto)
export class ApplicationsController {
  constructor(private readonly applications: ApplicationsService) {}

  @Post("applications/committee")
  @ApiTags("Candidatures")
  @ApiOperation({ summary: "Déposer une candidature comité (CV PDF obligatoire)" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommitteeApplicationDto) },
        {
          type: "object",
          required: ["cv"],
          properties: {
            cv: {
              type: "string",
              format: "binary",
              description: "CV au format PDF, 5 Mo maximum.",
            },
          },
        },
      ],
    },
  })
  @ApiCreatedData(CommitteeApplicationRecord, "Candidature comité enregistrée.")
  @UseInterceptors(
    FileInterceptor("cv", {
      storage: diskStorage({
        destination: uploadDir,
        filename: (_req, file, cb) => {
          cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (file.mimetype !== "application/pdf" && !file.originalname.toLowerCase().endsWith(".pdf")) {
          cb(new BadRequestException("Le CV doit être un PDF."), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  createCommittee(
    @Body() body: CommitteeApplicationDto,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    if (!file) {
      throw new BadRequestException("Le CV PDF est obligatoire.");
    }
    return this.applications.createCommittee(body, join(uploadDir, file.filename));
  }

  @Post("applications/participant")
  @ApiTags("Inscriptions")
  @ApiOperation({ summary: "Enregistrer la participation au FIF 2026" })
  @ApiBody({ type: ParticipantRegistrationDto })
  @ApiCreatedData(ParticipantRegistrationRecord, "Inscription participant enregistrée.")
  createParticipant(@Body() body: ParticipantRegistrationDto) {
    return this.applications.createParticipant(body);
  }

  @Post("applications/volunteer")
  @ApiTags("Candidatures")
  @ApiOperation({ summary: "Déposer une candidature volontaire" })
  @ApiBody({ type: VolunteerApplicationDto })
  @ApiCreatedData(VolunteerApplicationRecord, "Candidature volontaire enregistrée.")
  createVolunteer(@Body() body: VolunteerApplicationDto) {
    return this.applications.createVolunteer(body);
  }

  @AdminAuth()
  @Get("admin/applications")
  @ApiTags("Admin")
  @ApiOperation({ summary: "Lister les candidatures" })
  @ApiOkData(ApplicationListPage, "Page de candidatures comité et/ou volontaires.")
  list(@Query() query: ListQueryDto) {
    return this.applications.list(query);
  }

  @AdminAuth()
  @Get("admin/applications/export.csv")
  @ApiTags("Admin")
  @ApiOperation({
    summary: "Exporter les candidatures en CSV",
    description: "Réponse `text/csv` brute, hors enveloppe JSON.",
  })
  @ApiProduces("text/csv")
  @SkipEnvelope()
  @ApiOkResponse({
    description: "Fichier CSV. Hors enveloppe JSON.",
    content: {
      "text/csv": {
        schema: {
          type: "string",
          example: "id,type,nom,email,whatsapp,ville,choix,statut,date",
        },
      },
    },
  })
  async exportCsv(@Query() query: ListQueryDto, @Res() res: Response) {
    const csv = await this.applications.exportCsv(query);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=fif-candidatures.csv");
    res.send(csv);
  }

  @AdminAuth()
  @Get("admin/applications/:id")
  @ApiTags("Admin")
  @ApiOperation({ summary: "Détail d’une candidature" })
  @ApiParam({ name: "id" })
  @ApiOkOneOf(
    [CommitteeApplicationDetail, VolunteerApplicationDetail],
    "Candidature comité (avec postes) ou volontaire.",
  )
  getOne(@Param("id") id: string) {
    return this.applications.getOne(id);
  }

  @AdminAuth()
  @Patch("admin/applications/:id")
  @ApiTags("Admin")
  @ApiOperation({ summary: "Mettre à jour le statut ou l’affectation" })
  @ApiParam({ name: "id" })
  @ApiBody({ type: PatchApplicationDto })
  @ApiOkOneOf(
    [CommitteeApplicationRecord, VolunteerApplicationRecord],
    "Candidature mise à jour.",
  )
  patch(@Param("id") id: string, @Body() body: PatchApplicationDto) {
    return this.applications.patch(id, body);
  }

  @AdminAuth()
  @Get("admin/stats")
  @ApiTags("Admin")
  @ApiOperation({ summary: "Compteurs de candidatures" })
  @ApiOkData(AdminStatsResponse, "Totaux et répartitions par statut, poste et équipe.")
  stats() {
    return this.applications.stats();
  }
}
