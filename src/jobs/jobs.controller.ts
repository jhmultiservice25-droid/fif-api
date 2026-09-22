import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiOkData, ApiStandardErrors } from "../http/envelope";
import { JobWithPoleResponse } from "../http/models";
import { PrismaService } from "../prisma/prisma.service";

@ApiTags("Postes")
@ApiStandardErrors()
@Controller("jobs")
export class JobsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: "Lister les postes du Comité" })
  @ApiOkData([JobWithPoleResponse], "Postes du comité, avec leur pôle.")
  list() {
    return this.prisma.job.findMany({
      include: { pole: true },
      orderBy: { title: "asc" },
    });
  }

  @Get(":slug")
  @ApiOperation({ summary: "Détail d’un poste" })
  @ApiParam({ name: "slug", example: "charge-programme" })
  @ApiOkData(JobWithPoleResponse, "Poste et son pôle.")
  async one(@Param("slug") slug: string) {
    const job = await this.prisma.job.findUnique({
      where: { slug },
      include: { pole: true },
    });
    if (!job) {
      throw new NotFoundException("Poste introuvable.");
    }
    return job;
  }
}
