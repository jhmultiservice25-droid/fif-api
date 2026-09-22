import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import type { StaffNotification } from "@prisma/client";
import { VOLUNTEER_TEAMS } from "../domain";
import { fullName } from "../campaign";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.staffNotification.count();
    if (count > 0) return;
    await this.backfill();
  }

  async list(limit = 30) {
    const [unread, items] = await Promise.all([
      this.prisma.staffNotification.count({ where: { readAt: null } }),
      this.prisma.staffNotification.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    ]);
    return {
      unread,
      items: items.map((row: StaffNotification) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        body: row.body,
        href: row.href,
        readAt: row.readAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
      })),
    };
  }

  async markRead(id: string) {
    const row = await this.prisma.staffNotification.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException("Notification introuvable.");
    }
    if (!row.readAt) {
      await this.prisma.staffNotification.update({
        where: { id },
        data: { readAt: new Date() },
      });
    }
    return this.list();
  }

  async markAllRead() {
    await this.prisma.staffNotification.updateMany({
      where: { readAt: null },
      data: { readAt: new Date() },
    });
    return this.list();
  }

  async received(input: {
    kind: "COMMITTEE" | "VOLUNTEER";
    id: string;
    lastName: string;
    postnom: string;
    firstName: string;
    choice: string;
    createdAt?: Date;
  }) {
    const name = fullName(input.lastName, input.postnom, input.firstName);
    const kind = input.kind === "COMMITTEE" ? "comité" : "volontaire";
    await this.prisma.staffNotification.create({
      data: {
        type: "APPLICATION_RECEIVED",
        title: `Nouvelle candidature ${kind}`,
        body: `${name} · ${input.choice}`,
        href: `/applications/${input.id}`,
        createdAt: input.createdAt,
      },
    });
  }

  async statusChanged(input: {
    id: string;
    lastName: string;
    postnom: string;
    firstName: string;
    from: string;
    to: string;
  }) {
    if (input.from === input.to) return;
    const name = fullName(input.lastName, input.postnom, input.firstName);
    await this.prisma.staffNotification.create({
      data: {
        type: "STATUS_CHANGED",
        title: "Statut mis à jour",
        body: `${name} · ${input.from} → ${input.to}`,
        href: `/applications/${input.id}`,
      },
    });
  }

  private async backfill() {
    const [committee, volunteer] = await Promise.all([
      this.prisma.committeeApplication.findMany({
        include: { primaryJob: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      this.prisma.volunteerApplication.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);
    const rows = [
      ...committee.map((row) => ({
        kind: "COMMITTEE" as const,
        id: row.id,
        lastName: row.lastName,
        postnom: row.postnom,
        firstName: row.firstName,
        choice: row.primaryJob.title,
        createdAt: row.createdAt,
      })),
      ...volunteer.map((row) => ({
        kind: "VOLUNTEER" as const,
        id: row.id,
        lastName: row.lastName,
        postnom: row.postnom,
        firstName: row.firstName,
        choice: VOLUNTEER_TEAMS.find((team) => team.id === row.primaryTeamId)?.name ?? row.primaryTeamId,
        createdAt: row.createdAt,
      })),
    ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    for (const row of rows) {
      await this.received(row);
    }
  }
}
