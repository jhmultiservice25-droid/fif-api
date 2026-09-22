import type { PrismaClient } from "@prisma/client";

export type AppAuth = Awaited<ReturnType<typeof createAuth>>;

export const AUTH = Symbol("AUTH");

/**
 * Better Auth is ESM. Nest compiles to CJS, so this factory uses dynamic import.
 */
export async function createAuth(prisma: PrismaClient) {
  const { betterAuth } = await import("better-auth");
  const { prismaAdapter } = await import("better-auth/adapters/prisma");

  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is required.");
  }

  const port = process.env.PORT ?? "4000";
  const baseURL = process.env.BETTER_AUTH_URL ?? `http://localhost:${port}`;
  const website = process.env.WEBSITE_ORIGIN ?? "http://localhost:3000";
  const admin = process.env.ADMIN_ORIGIN ?? "http://localhost:3001";

  return betterAuth({
    secret,
    baseURL,
    trustedOrigins: [website, admin],
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 8,
    },
    session: {
      expiresIn: 60 * 60 * 12,
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: true,
          defaultValue: "USER",
          input: false,
        },
      },
    },
    advanced: {
      useSecureCookies: process.env.NODE_ENV === "production",
      defaultCookieAttributes: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  });
}

export async function ensureStaffFromEnv(auth: AppAuth, prisma: PrismaClient) {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set.");
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  const ctx = await auth.$context;
  const hash = await ctx.password.hash(password);
  const existing = await ctx.internalAdapter.findUserByEmail(email, { includeAccounts: true });

  if (!existing) {
    const user = await ctx.internalAdapter.createUser(
      {
        email,
        name: "FIF Admin",
        emailVerified: true,
      },
      { method: "email-password" },
    );
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
    });
    await ctx.internalAdapter.linkAccount({
      userId: user.id,
      providerId: "credential",
      issuer: "local:credential",
      accountId: user.id,
      password: hash,
    });
    return;
  }

  const credential = existing.accounts.find(
    (account) =>
      account.providerId === "credential" &&
      account.issuer === "local:credential" &&
      account.accountId === existing.user.id,
  );
  if (credential) {
    await prisma.account.update({
      where: { id: credential.id },
      data: { password: hash, updatedAt: new Date() },
    });
    return;
  }

  await ctx.internalAdapter.linkAccount({
    userId: existing.user.id,
    providerId: "credential",
    issuer: "local:credential",
    accountId: existing.user.id,
    password: hash,
  });
}
