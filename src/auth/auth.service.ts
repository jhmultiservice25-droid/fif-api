import { ConflictException, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AUTH, ensureStaffFromEnv, type AppAuth } from "./auth";

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject(AUTH) private readonly auth: AppAuth,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await ensureStaffFromEnv(this.auth, this.prisma);
  }

  async register(role: "ORGANIZATION" | "INNOVATOR", email: string, password: string, name: string) {
    const normalized = email.trim().toLowerCase();
    const ctx = await this.auth.$context;
    const existing = await ctx.internalAdapter.findUserByEmail(normalized);
    if (existing) {
      throw new ConflictException("Un compte existe déjà avec cet e-mail.");
    }

    const hash = await ctx.password.hash(password);
    const user = await ctx.internalAdapter.createUser(
      {
        email: normalized,
        name: name.trim(),
        emailVerified: true,
      },
      { method: "email-password" },
    );
    await this.prisma.user.update({
      where: { id: user.id },
      data: { role },
    });
    await ctx.internalAdapter.linkAccount({
      userId: user.id,
      providerId: "credential",
      issuer: "local:credential",
      accountId: user.id,
      password: hash,
    });

    if (role === "ORGANIZATION") {
      await this.prisma.organizationProfile.create({
        data: { userId: user.id, name: name.trim(), professionalEmail: normalized },
      });
    } else {
      await this.prisma.innovatorProfile.create({
        data: { userId: user.id, displayName: name.trim(), email: normalized },
      });
    }

    return { id: user.id, email: normalized, name: name.trim(), role };
  }
}
