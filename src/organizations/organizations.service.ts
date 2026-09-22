import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { MarketplaceListQueryDto, PatchOrganizationProfileDto, UpsertNeedDto } from "./organizations.dto";

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async profile(userId: string) {
    const existing = await this.prisma.organizationProfile.findUnique({ where: { userId } });
    if (existing) {
      return existing;
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("Compte introuvable.");
    }
    return this.prisma.organizationProfile.create({
      data: { userId, name: user.name, professionalEmail: user.email },
    });
  }

  async patchProfile(userId: string, body: PatchOrganizationProfileDto) {
    await this.profile(userId);
    return this.prisma.organizationProfile.update({
      where: { userId },
      data: body,
    });
  }

  async listNeeds(userId: string) {
    const org = await this.profile(userId);
    return this.prisma.organizationNeed.findMany({
      where: { organizationId: org.id },
      orderBy: { updatedAt: "desc" },
    });
  }

  async createNeed(userId: string, body: UpsertNeedDto) {
    const org = await this.profile(userId);
    return this.prisma.organizationNeed.create({
      data: {
        organizationId: org.id,
        status: body.status ?? "DRAFT",
        priorityChallenge: body.priorityChallenge ?? "",
        problemDomains: body.problemDomains ?? [],
        solutionTypes: body.solutionTypes ?? [],
        priority: body.priority ?? "",
        timeline: body.timeline ?? "",
        pilotWillingness: body.pilotWillingness ?? "",
        budgetBand: body.budgetBand ?? "",
        publicationConsent: body.publicationConsent ?? "DISCUSS",
        fikiriChallenge: body.fikiriChallenge ?? "A_DISCUTER",
        payload: (body.payload ?? {}) as Prisma.InputJsonValue,
      },
    });
  }

  async getNeed(userId: string, id: string) {
    const org = await this.profile(userId);
    const need = await this.prisma.organizationNeed.findFirst({
      where: { id, organizationId: org.id },
    });
    if (!need) {
      throw new NotFoundException("Fiche introuvable.");
    }
    return need;
  }

  async patchNeed(userId: string, id: string, body: UpsertNeedDto) {
    await this.getNeed(userId, id);
    return this.prisma.organizationNeed.update({
      where: { id },
      data: {
        ...body,
        payload: body.payload === undefined ? undefined : (body.payload as Prisma.InputJsonValue),
      },
    });
  }

  async adminList(query: MarketplaceListQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const [items, total] = await Promise.all([
      this.prisma.organizationNeed.findMany({
        include: { organization: true },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.organizationNeed.count(),
    ]);
    return { items, total, page, pageSize };
  }

  async adminGet(id: string) {
    const need = await this.prisma.organizationNeed.findUnique({
      where: { id },
      include: { organization: true, matches: true },
    });
    if (!need) {
      throw new NotFoundException("Fiche introuvable.");
    }
    return need;
  }
}
