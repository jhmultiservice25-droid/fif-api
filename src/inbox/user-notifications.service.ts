import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserNotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, limit = 30) {
    const take = Math.min(100, Math.max(1, limit));
    const items = await this.prisma.userNotification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
    });
    const unread = await this.prisma.userNotification.count({
      where: { userId, readAt: null },
    });
    return { unread, items };
  }

  async markRead(userId: string, id: string) {
    const row = await this.prisma.userNotification.findFirst({ where: { id, userId } });
    if (!row) {
      throw new NotFoundException("Notification introuvable.");
    }
    await this.prisma.userNotification.update({
      where: { id },
      data: { readAt: new Date() },
    });
    return this.list(userId);
  }

  async markAllRead(userId: string) {
    await this.prisma.userNotification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
    return this.list(userId);
  }
}
