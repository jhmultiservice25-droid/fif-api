import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MarketplaceListQueryDto } from "../organizations/organizations.dto";
import { PatchInnovatorProfileDto, UpsertProjectDto } from "./innovators.dto";

@Injectable()
export class InnovatorsService {
  constructor(private readonly prisma: PrismaService) {}

  async profile(userId: string) {
    const existing = await this.prisma.innovatorProfile.findUnique({ where: { userId } });
    if (existing) {
      return existing;
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("Compte introuvable.");
    }
    return this.prisma.innovatorProfile.create({
      data: { userId, displayName: user.name, email: user.email },
    });
  }

  async patchProfile(userId: string, body: PatchInnovatorProfileDto) {
    await this.profile(userId);
    return this.prisma.innovatorProfile.update({
      where: { userId },
      data: body,
    });
  }

  async listProjects(userId: string) {
    const innovator = await this.profile(userId);
    return this.prisma.innovatorProject.findMany({
      where: { innovatorId: innovator.id },
      orderBy: { updatedAt: "desc" },
    });
  }

  async createProject(userId: string, body: UpsertProjectDto) {
    const innovator = await this.profile(userId);
    return this.prisma.innovatorProject.create({
      data: {
        innovatorId: innovator.id,
        status: body.status ?? "DRAFT",
        title: body.title ?? "",
        problemSolved: body.problemSolved ?? "",
        solution: body.solution ?? "",
        sectors: body.sectors ?? [],
        capabilities: body.capabilities ?? [],
        stage: body.stage ?? "",
        publicationConsent: body.publicationConsent ?? "DISCUSS",
      },
    });
  }

  async getProject(userId: string, id: string) {
    const innovator = await this.profile(userId);
    const project = await this.prisma.innovatorProject.findFirst({
      where: { id, innovatorId: innovator.id },
    });
    if (!project) {
      throw new NotFoundException("Projet introuvable.");
    }
    return project;
  }

  async patchProject(userId: string, id: string, body: UpsertProjectDto) {
    await this.getProject(userId, id);
    return this.prisma.innovatorProject.update({
      where: { id },
      data: body,
    });
  }

  async adminList(query: MarketplaceListQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const [items, total] = await Promise.all([
      this.prisma.innovatorProject.findMany({
        include: { innovator: true },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.innovatorProject.count(),
    ]);
    return { items, total, page, pageSize };
  }

  async adminGet(id: string) {
    const project = await this.prisma.innovatorProject.findUnique({
      where: { id },
      include: { innovator: true, matches: true },
    });
    if (!project) {
      throw new NotFoundException("Projet introuvable.");
    }
    return project;
  }
}
