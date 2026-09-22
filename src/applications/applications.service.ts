import {
  COMMITTEE_STATUS_LABELS,
  COMMITTEE_STATUSES,
  VOLUNTEER_MOTIVATION_MAX_WORDS,
  VOLUNTEER_STATUS_LABELS,
  VOLUNTEER_STATUSES,
  VOLUNTEER_TEAMS,
  countWords,
  type AdminStats,
  type ApplicationListItem,
} from "../domain";
import type { CommitteeApplication, VolunteerApplication } from "@prisma/client";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { assertCampaignOpen, fullName, kinshasaDay, lastDays } from "../campaign";
import { NotificationsService } from "../notifications/notifications.service";
import { PrismaService } from "../prisma/prisma.service";
import {
  CommitteeApplicationDto,
  ListQueryDto,
  PatchApplicationDto,
  VolunteerApplicationDto,
} from "./dto";

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async createCommittee(dto: CommitteeApplicationDto, cvPath: string) {
    assertCampaignOpen("committee");
    if (dto.secondaryJobId && dto.secondaryJobId === dto.primaryJobId) {
      throw new BadRequestException("Le deuxième choix doit être différent du poste principal.");
    }
    const primary = await this.prisma.job.findUnique({ where: { id: dto.primaryJobId } });
    if (!primary) {
      throw new BadRequestException("Poste principal invalide.");
    }
    if (dto.secondaryJobId) {
      const secondary = await this.prisma.job.findUnique({ where: { id: dto.secondaryJobId } });
      if (!secondary) {
        throw new BadRequestException("Deuxième choix invalide.");
      }
    }
    const row = await this.prisma.committeeApplication.create({
      data: {
        lastName: dto.lastName,
        postnom: dto.postnom,
        firstName: dto.firstName,
        sex: dto.sex,
        birthDate: new Date(dto.birthDate),
        city: dto.city,
        whatsapp: dto.whatsapp,
        email: dto.email,
        primaryJobId: dto.primaryJobId,
        secondaryJobId: dto.secondaryJobId || null,
        educationLevel: dto.educationLevel,
        fieldOfStudy: dto.fieldOfStudy,
        professionalSituation: dto.professionalSituation,
        yearsOfExperience: dto.yearsOfExperience,
        motivation: dto.motivation,
        experience: dto.experience,
        availability: dto.availability,
        linkedin: dto.linkedin || null,
        cvPath,
      },
    });
    await this.notifications.received({
      kind: "COMMITTEE",
      id: row.id,
      lastName: row.lastName,
      postnom: row.postnom,
      firstName: row.firstName,
      choice: primary.title,
    });
    return withoutCvPath(row);
  }

  async createVolunteer(dto: VolunteerApplicationDto) {
    assertCampaignOpen("volunteer");
    if (countWords(dto.motivation) > VOLUNTEER_MOTIVATION_MAX_WORDS) {
      throw new BadRequestException("La motivation ne peut pas dépasser 150 mots.");
    }
    if (dto.secondaryTeamId && dto.secondaryTeamId === dto.primaryTeamId) {
      throw new BadRequestException("Le deuxième choix d’affectation doit être différent.");
    }
    const row = await this.prisma.volunteerApplication.create({
      data: {
        lastName: dto.lastName,
        postnom: dto.postnom,
        firstName: dto.firstName,
        sex: dto.sex,
        birthDate: new Date(dto.birthDate),
        city: dto.city,
        whatsapp: dto.whatsapp,
        email: dto.email,
        organization: dto.organization || null,
        educationLevel: dto.educationLevel,
        fieldOfStudy: dto.fieldOfStudy,
        primaryTeamId: dto.primaryTeamId,
        secondaryTeamId: dto.secondaryTeamId || null,
        skills: dto.skills || null,
        eventExperience: dto.eventExperience || null,
        languages: dto.languages,
        availability: dto.availability,
        motivation: dto.motivation,
      },
    });
    const team = VOLUNTEER_TEAMS.find((item) => item.id === row.primaryTeamId);
    await this.notifications.received({
      kind: "VOLUNTEER",
      id: row.id,
      lastName: row.lastName,
      postnom: row.postnom,
      firstName: row.firstName,
      choice: team?.name ?? row.primaryTeamId,
    });
    return row;
  }

  async list(query: ListQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const kind = query.kind;

    const [committee, volunteer] = await Promise.all([
      kind === "VOLUNTEER" ? [] : this.prisma.committeeApplication.findMany({
        include: { primaryJob: true, secondaryJob: true },
        orderBy: { createdAt: "desc" },
      }),
      kind === "COMMITTEE" ? [] : this.prisma.volunteerApplication.findMany({
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const items: ApplicationListItem[] = [];

    for (const row of committee) {
      if (query.status && row.status !== query.status) continue;
      if (query.jobId && row.primaryJobId !== query.jobId) continue;
      if (query.poleId && row.primaryJob.poleId !== query.poleId) continue;
      if (query.q && !matchesSearch(query.q, row)) continue;
      items.push({
        id: row.id,
        kind: "COMMITTEE",
        fullName: fullName(row.lastName, row.postnom, row.firstName),
        email: row.email,
        whatsapp: row.whatsapp,
        city: row.city,
        status: row.status as ApplicationListItem["status"],
        primaryChoice: row.primaryJob.title,
        secondaryChoice: row.secondaryJob?.title,
        createdAt: row.createdAt.toISOString(),
      });
    }

    for (const row of volunteer) {
      if (query.status && row.status !== query.status) continue;
      if (query.teamId && row.primaryTeamId !== query.teamId) continue;
      if (query.q && !matchesSearch(query.q, row)) continue;
      const team = VOLUNTEER_TEAMS.find((t) => t.id === row.primaryTeamId);
      const team2 = VOLUNTEER_TEAMS.find((t) => t.id === row.secondaryTeamId);
      items.push({
        id: row.id,
        kind: "VOLUNTEER",
        fullName: fullName(row.lastName, row.postnom, row.firstName),
        email: row.email,
        whatsapp: row.whatsapp,
        city: row.city,
        status: row.status as ApplicationListItem["status"],
        primaryChoice: team?.name ?? row.primaryTeamId,
        secondaryChoice: team2?.name,
        createdAt: row.createdAt.toISOString(),
      });
    }

    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const total = items.length;
    const slice = items.slice((page - 1) * pageSize, page * pageSize);
    return { total, page, pageSize, items: slice };
  }

  async getOne(id: string) {
    const committee = await this.prisma.committeeApplication.findUnique({
      where: { id },
      include: { primaryJob: { include: { pole: true } }, secondaryJob: true },
    });
    if (committee) {
      return { kind: "COMMITTEE" as const, ...withoutCvPath(committee) };
    }
    const volunteer = await this.prisma.volunteerApplication.findUnique({ where: { id } });
    if (volunteer) {
      return { kind: "VOLUNTEER" as const, ...volunteer };
    }
    throw new NotFoundException("Candidature introuvable.");
  }

  async patch(id: string, dto: PatchApplicationDto) {
    const committee = await this.prisma.committeeApplication.findUnique({ where: { id } });
    if (committee) {
      if (dto.status && !COMMITTEE_STATUSES.includes(dto.status as (typeof COMMITTEE_STATUSES)[number])) {
        throw new BadRequestException("Statut comité invalide.");
      }
      const nextStatus = dto.status ?? committee.status;
      const row = await this.prisma.committeeApplication.update({
        where: { id },
        data: { status: nextStatus },
      });
      await this.notifications.statusChanged({
        id: row.id,
        lastName: row.lastName,
        postnom: row.postnom,
        firstName: row.firstName,
        from:
          COMMITTEE_STATUS_LABELS[committee.status as keyof typeof COMMITTEE_STATUS_LABELS] ??
          committee.status,
        to: COMMITTEE_STATUS_LABELS[nextStatus as keyof typeof COMMITTEE_STATUS_LABELS] ?? nextStatus,
      });
      return withoutCvPath(row);
    }
    const volunteer = await this.prisma.volunteerApplication.findUnique({ where: { id } });
    if (!volunteer) {
      throw new NotFoundException("Candidature introuvable.");
    }
    if (dto.status && !VOLUNTEER_STATUSES.includes(dto.status as (typeof VOLUNTEER_STATUSES)[number])) {
      throw new BadRequestException("Statut volontaire invalide.");
    }
    const nextStatus = dto.status ?? volunteer.status;
    const row = await this.prisma.volunteerApplication.update({
      where: { id },
      data: {
        status: nextStatus,
        assignmentTeamId: dto.assignmentTeamId ?? volunteer.assignmentTeamId,
        assignmentZone: dto.assignmentZone ?? volunteer.assignmentZone,
        assignmentLead: dto.assignmentLead ?? volunteer.assignmentLead,
        assignmentShift: dto.assignmentShift ?? volunteer.assignmentShift,
      },
    });
    await this.notifications.statusChanged({
      id: row.id,
      lastName: row.lastName,
      postnom: row.postnom,
      firstName: row.firstName,
      from:
        VOLUNTEER_STATUS_LABELS[volunteer.status as keyof typeof VOLUNTEER_STATUS_LABELS] ??
        volunteer.status,
      to: VOLUNTEER_STATUS_LABELS[nextStatus as keyof typeof VOLUNTEER_STATUS_LABELS] ?? nextStatus,
    });
    return row;
  }

  async stats(): Promise<AdminStats> {
    const [committee, volunteer, jobs] = await Promise.all([
      this.prisma.committeeApplication.findMany({ include: { primaryJob: true } }),
      this.prisma.volunteerApplication.findMany(),
      this.prisma.job.findMany({ orderBy: { title: "asc" } }),
    ]);

    const committeeByStatus: Record<string, number> = {};
    for (const status of COMMITTEE_STATUSES) committeeByStatus[status] = 0;
    const volunteerByStatus: Record<string, number> = {};
    for (const status of VOLUNTEER_STATUSES) volunteerByStatus[status] = 0;

    const jobCounts = new Map<string, number>();
    for (const row of committee) {
      committeeByStatus[row.status] = (committeeByStatus[row.status] ?? 0) + 1;
      jobCounts.set(row.primaryJobId, (jobCounts.get(row.primaryJobId) ?? 0) + 1);
    }
    const teamCounts = new Map<string, number>();
    for (const row of volunteer) {
      volunteerByStatus[row.status] = (volunteerByStatus[row.status] ?? 0) + 1;
      teamCounts.set(row.primaryTeamId, (teamCounts.get(row.primaryTeamId) ?? 0) + 1);
    }

    const days = lastDays(14);
    const byDay = days.map((date) => ({ date, committee: 0, volunteer: 0 }));
    const index = new Map(byDay.map((row, i) => [row.date, i]));
    for (const row of committee) {
      const key = kinshasaDay(row.createdAt);
      const i = index.get(key);
      const bucket = i === undefined ? undefined : byDay[i];
      if (bucket) bucket.committee += 1;
    }
    for (const row of volunteer) {
      const key = kinshasaDay(row.createdAt);
      const i = index.get(key);
      const bucket = i === undefined ? undefined : byDay[i];
      if (bucket) bucket.volunteer += 1;
    }
    const thisWeek = byDay.slice(-7).reduce((sum, row) => sum + row.committee + row.volunteer, 0);
    const lastWeek = byDay.slice(0, 7).reduce((sum, row) => sum + row.committee + row.volunteer, 0);

    return {
      committeeTotal: committee.length,
      volunteerTotal: volunteer.length,
      committeeByStatus,
      volunteerByStatus,
      committeeByJob: jobs.map((job) => ({
        jobId: job.id,
        title: job.title,
        poleId: job.poleId,
        count: jobCounts.get(job.id) ?? 0,
      })),
      volunteerByTeam: VOLUNTEER_TEAMS.map((team) => ({
        teamId: team.id,
        name: team.name,
        count: teamCounts.get(team.id) ?? 0,
      })),
      byDay,
      thisWeek,
      lastWeek,
    };
  }

  async exportCsv(query: ListQueryDto) {
    const { items } = await this.list({ ...query, page: 1, pageSize: 10_000 });
    const header = ["id", "type", "nom", "email", "whatsapp", "ville", "choix", "statut", "date"];
    const lines = [
      header.join(","),
      ...items.map((item) =>
        [
          item.id,
          item.kind,
          csv(item.fullName),
          csv(item.email),
          csv(item.whatsapp),
          csv(item.city),
          csv(item.primaryChoice),
          item.status,
          item.createdAt,
        ].join(","),
      ),
    ];
    return lines.join("\n");
  }
}

function withoutCvPath<T extends CommitteeApplication>(row: T): Omit<T, "cvPath"> {
  const { cvPath: _cvPath, ...rest } = row;
  return rest;
}

function matchesSearch(
  q: string,
  row: Pick<
    CommitteeApplication | VolunteerApplication,
    "lastName" | "postnom" | "firstName" | "email" | "whatsapp"
  >,
) {
  const hay = `${row.lastName} ${row.postnom} ${row.firstName} ${row.email} ${row.whatsapp}`.toLowerCase();
  return hay.includes(q.toLowerCase().trim());
}

function csv(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}
