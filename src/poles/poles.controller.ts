import { Controller, Get, Param, NotFoundException } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiOkData, ApiStandardErrors } from "../http/envelope";
import { PoleWithJobsResponse } from "../http/models";
import { PrismaService } from "../prisma/prisma.service";

@ApiTags("Pôles")
@ApiStandardErrors()
@Controller("poles")
export class PolesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: "Lister les pôles et leurs postes" })
  @ApiOkData([PoleWithJobsResponse], "Pôles triés, chacun avec ses postes.")
  list() {
    return this.prisma.pole.findMany({
      orderBy: { order: "asc" },
      include: { jobs: { orderBy: { title: "asc" } } },
    });
  }

  @Get(":slug")
  @ApiOperation({ summary: "Détail d’un pôle" })
  @ApiParam({ name: "slug", example: "programme" })
  @ApiOkData(PoleWithJobsResponse, "Pôle et ses postes.")
  async one(@Param("slug") slug: string) {
    const pole = await this.prisma.pole.findUnique({
      where: { slug },
      include: { jobs: true },
    });
    if (!pole) {
      throw new NotFoundException("Pôle introuvable.");
    }
    return pole;
  }
}
